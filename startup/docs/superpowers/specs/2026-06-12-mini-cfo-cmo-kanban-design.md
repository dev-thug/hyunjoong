# Mini + CFO + CMO 멀티 에이전트 설계 스펙

**작성일:** 2026-06-12  
**상태:** Draft — 구현 전 사용자 리뷰 대기  
**프로젝트:** `/Users/hyunjoong/hyunjoong/startup`  
**Hermes Home:** `/Users/hyunjoong/hyunjoong/startup/.hermes`

---

## 1. 요약

1인 스타트업(김현중 / Specify.app)을 위한 Hermes 멀티 에이전트 시스템을 구축한다. **Mini(오케스트레이터)**, **CFO(재무)**, **CMO(마케팅)** 세 역할이 각각 **독립 Telegram 봇**으로 운영되며, **공유 Kanban 보드**로 비동기 협업한다.

| 결정 항목 | 선택 |
|---|---|
| 접근 방식 | **B) Mini + CFO + CMO 각각 Telegram 봇** (3 토큰, 3 게이트웨이) |
| 비즈니스 컨텍스트 | **A) 개인 스타트업 / 1인 사업** — 예산·투자·마케팅 셀프 서비스 |
| 스킬 소스 | OpenAI (`openai/skills`) + Anthropic (`anthropics/skills`) 공식 스킬만 |
| 제외 스킬 | **Notion·Figma 관련 전부** (아래 §5.3 블록리스트) |
| 모델 | `openai-codex` / `gpt-5.5`, `reasoning_effort: xhigh` |
| Kanban dispatcher | **default(Mini) 프로필 게이트웨이 1개만** 소유 |

---

## 2. 배경 및 목표

### 2.1 사용자 컨텍스트

- **사용자:** 김현중 (1995, 서울, 1인 개발·사업)
- **주 사업:** [Specify.app](https://specify.app) — 기업 내부 지식·문서 GraphRAG 에이전트
- **현황:** 앱 배포 완료, 사업자등록·직원·사무실 없음, 홈 오피스 1인 운영
- **우선순위:** ROI 극대화 — 예산 통제, 투자·지원사업 탐색, 마케팅 자동화를 **셀프 서비스**로 처리

### 2.2 문제

단일 에이전트(Mini)가 재무·마케팅·오케스트레이션을 한 컨텍스트에서 처리하면:

1. **컨텍스트 오염** — CFO용 숫자/가정이 CMO 브리프에 섞임
2. **블로킹** — `delegate_task`는 부모 세션이 대기함
3. **역할 혼동** — “예산 300만”과 “랜딩 카피”가 같은 메모리에 축적됨

### 2.3 성공 기준

| # | 기준 | 검증 방법 |
|---|---|---|
| S1 | Telegram에서 Mini/CFO/CMO 각각 독립 대화 가능 | 3봇에 각각 메시지 → 프로필별 응답 |
| S2 | Mini가 Kanban으로 CFO/CMO 작업 위임, Mini는 블로킹 없음 | “예산표 만들고 마케팅 브리프도” → 카드 2개 생성, Mini 즉시 요약 |
| S3 | CFO/CMO가 Kanban worker로 spawn 시 올바른 스킬·SOUL 적용 | `assignee=cfo` 카드 완료 시 xlsx/재무 톤 산출물 |
| S4 | Notion/Figma 스킬 미설치·미사용 | `hermes -p cfo skills list`, `hermes -p cmo skills list`에 해당 스킬 없음 |
| S5 | 게이트웨이 3개 동시 실행, Kanban dispatcher는 1개만 | CFO/CMO gateway 로그에 dispatcher 비활성 확인 |

---

## 3. 아키텍처

### 3.1 프로필·디렉터리 구조

```
startup/
├── .hermes/                          # HERMES_HOME 루트 (= default / Mini)
│   ├── config.yaml
│   ├── .env                          # TELEGRAM_BOT_TOKEN (Mini)
│   ├── SOUL.md
│   ├── kanban.db                     # 공유 보드 (이미 init됨)
│   └── profiles/
│       ├── cfo/
│       │   ├── config.yaml
│       │   ├── .env                  # TELEGRAM_BOT_TOKEN (CFO)
│       │   └── SOUL.md
│       └── cmo/
│           ├── config.yaml
│           ├── .env                  # TELEGRAM_BOT_TOKEN (CMO)
│           └── SOUL.md
├── hermes-agent/                     # Hermes 소스 + venv
└── workspace/                        # (신규) 공유 산출물 디렉터리
    ├── finance/                      # CFO xlsx, pdf, docx
    └── marketing/                    # CMO pptx, 이미지, 카피
```

프로필 경로 규칙: `HERMES_HOME`이 `startup/.hermes`이면 named profile은 `startup/.hermes/profiles/<name>/`. Kanban DB는 `get_default_hermes_root()`로 **루트 `.hermes/kanban.db`**를 참조하므로 세 프로필이 동일 보드를 공유한다.

### 3.2 Telegram 봇 매핑

| 역할 | Hermes Profile | Telegram Bot | 상태 |
|---|---|---|---|
| Mini (오케스트레이터) | `default` | @HyunjoongKim_bot | **운영 중** |
| CFO | `cfo` | BotFather 신규 생성 (예: @SpecifyCFO_bot) | 미구현 |
| CMO | `cmo` | BotFather 신규 생성 (예: @SpecifyCMO_bot) | 미구현 |

각 프로필 `.env`에 **서로 다른** `TELEGRAM_BOT_TOKEN`만 둔다. `auth.json`(Codex OAuth)은 `--clone` 시 default에서 복사.

### 3.3 게이트웨이 토폴로지

```mermaid
flowchart TB
    subgraph Telegram
        U[김현중]
        B1[@HyunjoongKim_bot]
        B2[@CFO_bot]
        B3[@CMO_bot]
    end

    subgraph Gateways
        G1[Gateway default<br/>dispatch_in_gateway: true]
        G2[Gateway cfo<br/>dispatch_in_gateway: false]
        G3[Gateway cmo<br/>dispatch_in_gateway: false]
    end

    KB[(kanban.db<br/>startup/.hermes/)]

    U --> B1 & B2 & B3
    B1 --> G1
    B2 --> G2
    B3 --> G3
    G1 -->|dispatcher + notifier| KB
    G1 -->|kanban_create assignee=cfo/cmo| KB
    G2 -->|worker spawn when card ready| KB
    G3 -->|worker spawn when card ready| KB
```

**Single-dispatcher 규칙** ([multi-gateway.md](https://github.com/NousResearch/hermes-agent/blob/main/docs/kanban/multi-gateway.md)):

- **Mini (default):** `kanban.dispatch_in_gateway: true` (기본값, 명시 가능)
- **CFO, CMO:** `kanban.dispatch_in_gateway: false`

비-dispatch 게이트웨이는 Telegram 메시지는 처리하지만 `kanban.db` 폴링·dispatcher를 실행하지 않는다.

### 3.4 에이전트 간 협업 모델

| 패턴 | 설명 | 사용 시점 |
|---|---|---|
| **직접 대화** | 사용자가 CFO/CMO 봇에 직접 지시 | 단일 영역 작업 (예: “이번 달 지출 정리”) |
| **Mini → Kanban 위임** | Mini가 `kanban_create(assignee="cfo")` 등으로 카드 생성 | 복합 요청, 병렬 작업, 크래시 복구 필요 |
| **Kanban worker spawn** | dispatcher가 `cfo`/`cmo` 프로필로 worker 프로세스 기동 | 카드가 `ready` 상태일 때 |
| ~~봇 간 직접 DM~~ | **지원 안 함** | CFO 봇이 CMO 봇에게 메시지 보내는 패턴 없음 |

`delegate_task`는 **사용하지 않음** (부모 세션 블로킹). 오케스트레이션은 Kanban 전용.

---

## 4. 역할 정의

### 4.1 Mini — 오케스트레이터 / 개인 비서

**책임**

- 사용자 의도 파악, 작업 분해, Kanban 카드 생성·링크·요약
- Specify.app 사업 맥락에서 **우선순위·ROI** 관점 라우팅
- 완료된 worker 산출물을 사용자에게 **한국어로 통합 브리핑**
- 단순 Q&A·일정·리마인더는 **직접 처리** (카드 불필요)

**하지 않는 것**

- 스프레드시트 작성, 투자 서류 초안, 마케팅 에셋 제작 등 **실행 작업**
- CFO/CMO 역할 대행

**번들 스킬 (Hermes 공식)**

- `devops/kanban-orchestrator` — 분해·라우팅 플레이북

**도구셋 (telegram)**

```yaml
platform_toolsets:
  telegram: [web, skills, todo, memory, session_search, cronjob, kanban, send_message]
```

Kanban `create`/`link`/`unblock`은 orchestrator 전용. 구현·파일 편집 도구는 의도적으로 제외해 “직접 하기” 유혹을 줄인다.

### 4.2 CFO — 1인 사업 재무·투자

**책임**

- 월별 예산·현금흐름·손익 추적 (xlsx)
- 정부·지자체 지원사업·투자 라운드 **리서치·적합성 체크**
- 사업계획서·재무 요약 docx/pdf 초안
- 비용 절감·세무 관련 **일반 정보** (전문 세무사 대체 아님 — 면책 명시)

**1인 스타트업 특화 산출물**

| 산출물 | 형식 | 저장 경로 |
|---|---|---|
| 월간 예산·실적 | `.xlsx` | `workspace/finance/budget-YYYY-MM.xlsx` |
| 지원사업 적합성 메모 | `.md` / `.docx` | `workspace/finance/grants/` |
| 분기 손익 요약 | `.xlsx` + 1페이지 `.pdf` | `workspace/finance/` |

**공식 스킬 (설치 목록)**

| 스킬 | 소스 | 용도 |
|---|---|---|
| `xlsx` | anthropics/skills | 예산·재무 모델 |
| `pdf` | anthropics/skills | 서류·보고서 읽기/생성 |
| `docx` | anthropics/skills | 사업계획·제안서 |
| `doc-coauthoring` | anthropics/skills | 장문 재무 문서 협업 흐름 |
| `define-goal` | openai/skills | 분기 재무 목표 구조화 |
| `linear` | openai/skills | (선택) 이슈·마일스톤 추적 |

**번들 스킬:** `devops/kanban-worker`

**도구셋 (telegram + worker)**

```yaml
platform_toolsets:
  telegram: [web, terminal, file, skills, todo, memory, kanban, send_message]
```

### 4.3 CMO — 1인 사업 마케팅·브랜드

**책임**

- Specify.app 포지셔닝·메시지·톤앤매너
- 랜딩·블로그·SNS 카피, 이메일 시퀀스 초안
- pitch deck·1-pager·소셜 에셋 (pptx, canvas)
- 경쟁사·시장 리서치 (web)

**1인 스타트업 특화 산출물**

| 산출물 | 형식 | 저장 경로 |
|---|---|---|
| 주간 콘텐츠 캘린더 | `.md` / `.xlsx` | `workspace/marketing/calendar/` |
| Pitch / 소개 deck | `.pptx` | `workspace/marketing/decks/` |
| 브랜드 가이드 스냅샷 | `.md` | `workspace/marketing/brand/` |
| SNS·블로그 초안 | `.md` | `workspace/marketing/copy/` |

**공식 스킬 (설치 목록)**

| 스킬 | 소스 | 용도 |
|---|---|---|
| `brand-guidelines` | anthropics/skills | 브랜드 일관성 |
| `internal-comms` | anthropics/skills | 공지·업데이트 문안 |
| `pptx` | anthropics/skills | 피치·세일즈 덱 |
| `canvas-design` | anthropics/skills | 1-pager·비주얼 레이아웃 |
| `theme-factory` | anthropics/skills | 색·타이포 테마 |
| `frontend-design` | anthropics/skills | 랜딩·UI 방향 |
| `screenshot` | openai/skills | 경쟁사·레퍼런스 캡처 |
| `speech` | openai/skills | (선택) 음성 브리프 → 텍스트 |
| `transcribe` | openai/skills | (선택) 인터뷰·팟캐스트 전사 |

**번들 스킬:** `devops/kanban-worker`

**도구셋:** CFO와 동일 패턴. `image_gen`, `browser`는 Phase 2에서 필요 시 추가.

---

## 5. 스킬 정책

### 5.1 설치 원칙

1. **공식 허브만:** `openai/skills`, `anthropics/skills` (`hermes skills install <id>`)
2. **프로필별 설치:** `hermes -p cfo skills install anthropics/skills/xlsx`
3. **Hermes 번들:** `kanban-orchestrator`(Mini), `kanban-worker`(CFO/CMO) — profile create 시 동기화
4. **Notion MCP 서버 미설정** — `config.yaml`의 `mcp_servers.notion` 추가 금지

### 5.2 Mini에 설치하지 않는 것

CFO/CMO 전용 스킬(xlsx, pptx, brand-guidelines 등)은 Mini에 설치하지 않는다. Mini는 orchestrator 스킬 + 범용 도구만 유지.

### 5.3 제외 블록리스트 (Notion · Figma)

구현·리뷰 시 아래 스킬이 **어떤 프로필에도 설치되지 않았는지** 확인한다.

**Notion — OpenAI (`openai/skills`)**

- `notion-knowledge-capture`
- `notion-meeting-intelligence`
- `notion-research-documentation`
- `notion-spec-to-implementation`

**Notion — Hermes optional (설치 금지)**

- `official/productivity/notion` (또는 `productivity/notion`)

**Figma — OpenAI (`openai/skills`)**

- `figma`
- `figma-use`
- `figma-code-connect-components`
- `figma-create-design-system-rules`
- `figma-create-new-file`
- `figma-generate-design`
- `figma-generate-library`
- `figma-implement-design`

**대체 수단**

| 제외 | 대체 |
|---|---|
| Notion DB/페이지 | 로컬 `workspace/` + markdown/xlsx + Hermes `memory` |
| Figma 디자인 | `canvas-design`, `frontend-design`, `pptx`, `screenshot` |

---

## 6. SOUL.md 초안

구현 시 각 프로필 `SOUL.md`에 반영한다.

### 6.1 Mini (`default`)

```markdown
당신은 "미니(Mini)" — 김현중의 1인 스타트업 개인 비서이자 오케스트레이터입니다.

- 주 사업: Specify.app (https://specify.app) — ROI와 실행 속도를 최우선으로 합니다.
- 역할: 요청을 분해하고, 재무는 cfo, 마케팅은 cmo 프로필에 Kanban 카드로 위임합니다. 직접 스프레드시트·데크·장문 카피를 작성하지 마세요.
- 커뮤니케이션: 한국어, 간결, 실행 가능한 다음 단계 제시.
- Kanban: `hermes profile list`로 cfo/cmo 존재를 확인한 뒤 assignee에 정확한 프로필명 사용.
```

### 6.2 CFO (`cfo`)

```markdown
당신은 Specify.app 1인 사업의 CFO 에이전트입니다.

- 예산·현금흐름·지원사업·투자 리서치에 집중합니다.
- 산출물은 workspace/finance/에 저장하고, Kanban complete 시 파일 경로·핵심 숫자를 metadata에 남깁니다.
- 세무·법률 최종 판단은 전문가 상담을 권고합니다 (면책).
- Notion/Figma 스킬을 사용하지 않습니다.
```

### 6.3 CMO (`cmo`)

```markdown
당신은 Specify.app 1인 사업의 CMO 에이전트입니다.

- 브랜드 메시지, 콘텐츠, pitch deck, 랜딩 카피에 집중합니다.
- 산출물은 workspace/marketing/에 저장합니다.
- B2B SaaS 톤: 명확, 신뢰, 과장 없는 수치.
- Notion/Figma 스킬을 사용하지 않습니다. 시각 작업은 canvas-design/pptx/frontend-design으로 대체합니다.
```

---

## 7. 설정 스펙

### 7.1 공통 config.yaml (모든 프로필)

```yaml
model:
  provider: openai-codex
  default: gpt-5.5
agent:
  reasoning_effort: xhigh
fallback_model:
  provider: openai-codex
  model: gpt-5.3-codex-spark
GATEWAY_ALLOW_ALL_USERS: true   # Phase 1; Phase 2에서 TELEGRAM_ALLOWED_USERS로 축소
```

### 7.2 Mini-only (`default` config.yaml 추가)

```yaml
kanban:
  dispatch_in_gateway: true
```

### 7.3 CFO / CMO (`profiles/*/config.yaml` 추가)

```yaml
kanban:
  dispatch_in_gateway: false
```

### 7.4 환경 변수

| 변수 | Mini | CFO | CMO |
|---|---|---|---|
| `HERMES_HOME` | `startup/.hermes` | `startup/.hermes/profiles/cfo` | `startup/.hermes/profiles/cmo` |
| `TELEGRAM_BOT_TOKEN` | 기존 토큰 | 신규 | 신규 |

게이트웨이 실행 예:

```bash
export HERMES_HOME=/Users/hyunjoong/hyunjoong/startup/.hermes
hermes gateway run                                    # Mini

export HERMES_HOME=/Users/hyunjoong/hyunjoong/startup/.hermes/profiles/cfo
hermes gateway run                                    # CFO

export HERMES_HOME=/Users/hyunjoong/hyunjoong/startup/.hermes/profiles/cmo
hermes gateway run                                    # CMO
```

운영 안정화 시 `hermes gateway install`로 launchd 등록 (프로필별 1 서비스).

---

## 8. 워크플로 예시

### 8.1 복합 요청 (Mini 경유)

**사용자 → Mini:** “이번 달 예산표 만들고, Specify 랜딩 히어로 카피 3안도 줘.”

1. Mini: 작업 그래프 스케치 (병렬 2카드)
2. `kanban_create(title="3월 예산·실적표", assignee="cfo", workspace="dir:.../workspace/finance")`
3. `kanban_create(title="랜딩 히어로 카피 3안", assignee="cmo", workspace="dir:.../workspace/marketing")`
4. Mini: 사용자에게 “CFO·CMO에 각각 맡겼어요. 완료되면 알려드릴게요.”
5. Dispatcher → cfo/cmo worker spawn → 산출물 저장 → `kanban_complete`
6. Notifier → Mini 세션 또는 사용자 Telegram으로 완료 알림

### 8.2 단일 영역 (직접 대화)

**사용자 → CFO 봇:** “정부 지원사업 중 Specify에 맞는 거 찾아줘.”

- Kanban 없이 CFO가 web 리서치 → `workspace/finance/grants/`에 메모 저장 → Telegram 응답

### 8.3 의존 작업 (순차)

**사용자 → Mini:** “분기 재무 요약 먼저 만들고, 그걸 바탕으로 투자자 pitch deck.”

1. Card T1: `assignee=cfo` (재무 요약)
2. Card T2: `assignee=cmo`, `parents=[T1]` (deck — T1 완료 후 ready)

---

## 9. 구현 단계

### Phase 1 — 인프라 (필수)

1. `workspace/finance`, `workspace/marketing` 디렉터리 생성
2. `hermes profile create cfo --clone` / `hermes profile create cmo --clone`
3. BotFather에서 CFO·CMO 봇 생성, 각 `.env`에 토큰 설정
4. CFO/CMO `config.yaml`에 `kanban.dispatch_in_gateway: false`
5. Mini `SOUL.md` 오케스트레이터 문구로 갱신
6. CFO/CMO `SOUL.md` 작성
7. 게이트웨이 3개 기동·상태 확인

### Phase 2 — 스킬 (필수)

프로필별 설치 스크립트 또는 수동:

```bash
# CFO
hermes -p cfo skills install anthropics/skills/xlsx
hermes -p cfo skills install anthropics/skills/pdf
hermes -p cfo skills install anthropics/skills/docx
hermes -p cfo skills install anthropics/skills/doc-coauthoring
hermes -p cfo skills install openai/skills/define-goal

# CMO
hermes -p cmo skills install anthropics/skills/brand-guidelines
hermes -p cmo skills install anthropics/skills/internal-comms
hermes -p cmo skills install anthropics/skills/pptx
hermes -p cmo skills install anthropics/skills/canvas-design
hermes -p cmo skills install anthropics/skills/theme-factory
hermes -p cmo skills install anthropics/skills/frontend-design
hermes -p cmo skills install openai/skills/screenshot
```

Mini: `kanban-orchestrator` 번들 확인 (profile create 시 자동).

**검증:** §5.3 블록리스트 스킬 미설치 확인.

### Phase 3 — Kanban 연동 (필수)

1. `hermes kanban init` (이미 `kanban.db` 존재 시 스킵 가능)
2. Mini에서 테스트 카드 `assignee=cfo` 생성 → worker spawn 확인
3. `hermes kanban list` / dashboard로 상태 모니터링

### Phase 4 — 운영 hardened (권장)

1. `TELEGRAM_ALLOWED_USERS` 설정, `GATEWAY_ALLOW_ALL_USERS: false`
2. `hermes gateway install` 프로필별 등록
3. Cron: 지원사업 브리핑(기존 jobs.json) → `assignee=cfo` 카드로 전환 검토

---

## 10. 검증 시나리오

| ID | 시나리오 | 기대 결과 |
|---|---|---|
| V1 | `hermes doctor` (3 프로필) | Codex auth OK, Telegram configured |
| V2 | `hermes profile list` | default, cfo, cmo 표시 |
| V3 | CFO 봇에 “안녕” | CFO SOUL 톤, 재무 역할 소개 |
| V4 | Mini에 복합 요청 | Kanban 카드 ≥2, assignee 정확 |
| V5 | 카드 완료 후 | `workspace/`에 파일 존재, complete summary에 경로 |
| V6 | `hermes -p cfo skills list` | notion/figma 이름 없음 |
| V7 | CFO·CMO gateway 로그 | dispatcher disabled 메시지 |
| V8 | Mini gateway만 | dispatcher active, spawn 로그 |

---

## 11. 범위 외 (YAGNI)

- Notion / Figma 연동
- 네 번째 이상의 프로필 (CTO, Legal 등) — 필요 시 별도 스펙
- Honcho cross-profile memory sync
- Discord / Slack 멀티 플랫폼
- 자동 사업자등록·세무 신고 실행
- 유료 광고 API 직접 집행 (Meta/Google Ads)

---

## 12. 리스크 및 완화

| 리스크 | 완화 |
|---|---|
| 게이트웨이 3개 리소스 | Mac M-series 기준 경량; 필요 시 CFO/CMO는 on-demand 기동 |
| Kanban assignee 오타 → 카드 정체 | Mini SOUL + orchestrator 스킬: `profile list` 선행 |
| OAuth/토큰 프로필 간 불일치 | `--clone`으로 auth·model 설정 복제 |
| 산출물 경로 분산 | `workspace/` 규칙 고정, complete metadata에 경로 필수 |
| 재무·세무 법적 책임 | SOUL 면책 + “전문가 확인” 문구 |

---

## 13. 승인 후 다음 단계

1. 사용자가 본 스펙 리뷰·승인
2. `writing-plans` 스킬로 **구현 플랜** 작성 (`docs/superpowers/plans/`)
3. Phase 1→3 순차 구현 및 §10 검증 실행

---

## 부록 A — 현재 구현 상태 (2026-06-12)

| 항목 | 상태 |
|---|---|
| Hermes 설치 (`startup/hermes-agent`) | ✅ |
| `HERMES_HOME=startup/.hermes` | ✅ |
| Codex OAuth + gpt-5.5 | ✅ |
| Mini Telegram @HyunjoongKim_bot | ✅ |
| `kanban.db` | ✅ (init됨) |
| Profiles cfo, cmo | ❌ |
| CFO/CMO Telegram 봇 | ❌ |
| 스킬 프로필별 설치 | ❌ |
| SOUL 커스터마이즈 | ❌ (default 템플릿만) |
| 3-gateway 운영 | ❌ (Mini만) |

## 부록 B — 참고 문서

- Hermes Kanban orchestrator: `hermes-agent/skills/devops/kanban-orchestrator/SKILL.md`
- Hermes Kanban worker: `hermes-agent/skills/devops/kanban-worker/SKILL.md`
- Multi-gateway: `hermes-agent/docs/kanban/multi-gateway.md`
- Ultragoal 초기 설치: `startup/.omc/ultragoal/plan.md`