# Mini + CFO + CMO 멀티 에이전트 Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 1인 스타트업용 Hermes 멀티 에이전트(Mini/CFO/CMO)를 Telegram 3봇 + 공유 Kanban으로 구현한다.

**Architecture:** `default`(Mini)가 Kanban dispatcher를 소유하고 `cfo`/`cmo` 프로필에 작업을 위임한다. 각 프로필은 독립 `HERMES_HOME`, 독립 Telegram 토큰, 독립 게이트웨이를 가지며 `startup/.hermes/kanban.db`를 공유한다. Notion/Figma 스킬은 설치하지 않는다.

**Tech Stack:** Hermes Agent, OpenAI Codex OAuth, Telegram Bot API, Kanban (SQLite), OpenAI/Anthropic official skills hub

**Spec:** `docs/superpowers/specs/2026-06-12-mini-cfo-cmo-kanban-design.md`

---

## File Map

| File | Action | Responsibility |
|---|---|---|
| `startup/.gitignore` | Create | `.hermes/` 런타임·시크릿 제외 |
| `startup/workspace/finance/.gitkeep` | Create | CFO 산출물 루트 |
| `startup/workspace/marketing/.gitkeep` | Create | CMO 산출물 루트 |
| `startup/.hermes/config.yaml` | Modify | Mini kanban dispatch + orchestrator toolsets |
| `startup/.hermes/SOUL.md` | Modify | Mini 오케스트레이터 정체성 |
| `startup/.hermes/profiles/cfo/` | Create | CFO 프로필 전체 |
| `startup/.hermes/profiles/cmo/` | Create | CMO 프로필 전체 |
| `startup/scripts/install-cfo-cmo-skills.sh` | Create | 프로필별 공식 스킬 일괄 설치 |
| `startup/scripts/verify-multi-agent.sh` | Create | V1–V8 자동 검증 |
| `startup/setup-hermes.sh` | Modify | profile/gateway/verify 헬퍼 명령 추가 |

**Git에 커밋하지 않는 파일:** `startup/.hermes/.env`, `startup/.hermes/profiles/*/.env` (토큰·시크릿)

---

## Environment Constants

구현 전체에서 사용할 절대 경로:

```bash
export ROOT="/Users/hyunjoong/hyunjoong/startup"
export HERMES_HOME="$ROOT/.hermes"
export PATH="$ROOT/hermes-agent/.venv/bin:${HOME}/.local/bin:$PATH"
```

CFO/CMO 토큰 (스펙 §7.5, `.env`에만 기록):

```bash
CFO_TOKEN="8606620637:AAGjxWByAmeFzNfVC6Crlf3C-Rami5D4oZ8"
CMO_TOKEN="8826215828:AAFRNw6SQVIlarEsGtAKEYo7IOuAZiQ19Uk"
```

---

### Task 1: Gitignore 및 workspace 초기화

**Files:**
- Create: `startup/.gitignore`
- Create: `startup/workspace/finance/.gitkeep`
- Create: `startup/workspace/marketing/.gitkeep`
- Create: `startup/workspace/marketing/calendar/.gitkeep`
- Create: `startup/workspace/marketing/decks/.gitkeep`
- Create: `startup/workspace/marketing/brand/.gitkeep`
- Create: `startup/workspace/marketing/copy/.gitkeep`
- Create: `startup/workspace/finance/grants/.gitkeep`

- [ ] **Step 1: `.gitignore` 작성**

```gitignore
# Hermes runtime (sessions, tokens, sqlite, logs)
.hermes/

# Agent deliverables (may contain business data)
workspace/

# Local env overrides
.env
.env.*
```

- [ ] **Step 2: workspace 디렉터리 생성**

```bash
cd /Users/hyunjoong/hyunjoong/startup
mkdir -p workspace/finance/grants
mkdir -p workspace/marketing/{calendar,decks,brand,copy}
touch workspace/finance/.gitkeep
touch workspace/finance/grants/.gitkeep
touch workspace/marketing/.gitkeep
touch workspace/marketing/calendar/.gitkeep
touch workspace/marketing/decks/.gitkeep
touch workspace/marketing/brand/.gitkeep
touch workspace/marketing/copy/.gitkeep
```

- [ ] **Step 3: 디렉터리 확인**

```bash
find workspace -type d | sort
```

Expected:

```
workspace
workspace/finance
workspace/finance/grants
workspace/marketing
workspace/marketing/brand
workspace/marketing/calendar
workspace/marketing/copy
workspace/marketing/decks
```

- [ ] **Step 4: Commit**

```bash
cd /Users/hyunjoong/hyunjoong
git add startup/.gitignore startup/workspace/
git commit -m "chore(startup): add gitignore and workspace dirs for multi-agent deliverables"
```

---

### Task 2: Hermes 프로필 생성 (cfo, cmo)

**Files:**
- Create: `startup/.hermes/profiles/cfo/` (via CLI)
- Create: `startup/.hermes/profiles/cmo/` (via CLI)

- [ ] **Step 1: 사전 조건 확인**

```bash
export ROOT="/Users/hyunjoong/hyunjoong/startup"
export HERMES_HOME="$ROOT/.hermes"
export PATH="$ROOT/hermes-agent/.venv/bin:${HOME}/.local/bin:$PATH"

hermes doctor 2>&1 | head -30
hermes profile list
```

Expected: Codex auth OK, `default` 프로필만 존재

- [ ] **Step 2: cfo 프로필 생성**

```bash
hermes profile create cfo --clone
```

Expected: `Created profile 'cfo'` (또는 이미 존재 시 스킵)

- [ ] **Step 3: cmo 프로필 생성**

```bash
hermes profile create cmo --clone
```

- [ ] **Step 4: 프로필 목록 확인**

```bash
hermes profile list
```

Expected: `default`, `cfo`, `cmo` 세 행 표시

- [ ] **Step 5: auth.json 복제 확인**

```bash
test -f "$HERMES_HOME/profiles/cfo/auth.json" && echo "cfo auth OK"
test -f "$HERMES_HOME/profiles/cmo/auth.json" && echo "cmo auth OK"
```

Expected: 두 줄 모두 출력

> **주의:** `--clone`은 default `.env`(Mini 토큰)도 복사한다. Task 3에서 반드시 덮어쓴다.

---

### Task 3: CFO/CMO Telegram 토큰 설정

**Files:**
- Modify: `startup/.hermes/profiles/cfo/.env`
- Modify: `startup/.hermes/profiles/cmo/.env`

- [ ] **Step 1: CFO `.env` 작성**

```bash
cat > /Users/hyunjoong/hyunjoong/startup/.hermes/profiles/cfo/.env <<'EOF'
TELEGRAM_BOT_TOKEN=8606620637:AAGjxWByAmeFzNfVC6Crlf3C-Rami5D4oZ8
EOF
```

- [ ] **Step 2: CMO `.env` 작성**

```bash
cat > /Users/hyunjoong/hyunjoong/startup/.hermes/profiles/cmo/.env <<'EOF'
TELEGRAM_BOT_TOKEN=8826215828:AAFRNw6SQVIlarEsGtAKEYo7IOuAZiQ19Uk
EOF
```

- [ ] **Step 3: 토큰 중복 없음 확인**

```bash
MINI_TOKEN=$(grep TELEGRAM_BOT_TOKEN /Users/hyunjoong/hyunjoong/startup/.hermes/.env | cut -d= -f2)
CFO_TOKEN=$(grep TELEGRAM_BOT_TOKEN /Users/hyunjoong/hyunjoong/startup/.hermes/profiles/cfo/.env | cut -d= -f2)
CMO_TOKEN=$(grep TELEGRAM_BOT_TOKEN /Users/hyunjoong/hyunjoong/startup/.hermes/profiles/cmo/.env | cut -d= -f2)

python3 - <<'PY'
import os
tokens = {
    "mini": os.environ.get("MINI_TOKEN",""),
    "cfo": os.environ.get("CFO_TOKEN",""),
    "cmo": os.environ.get("CMO_TOKEN",""),
}
vals = list(tokens.values())
assert all(vals), "missing token"
assert len(set(vals)) == 3, f"duplicate tokens: {tokens}"
print("OK: 3 unique tokens")
PY
```

환경변수 전달:

```bash
export MINI_TOKEN CFO_TOKEN CMO_TOKEN
# (위 python 블록 재실행)
```

Expected: `OK: 3 unique tokens`

> **Commit 하지 않음** — `.env`는 gitignore 대상

---

### Task 4: config.yaml — Kanban dispatch + toolsets

**Files:**
- Modify: `startup/.hermes/config.yaml`
- Modify: `startup/.hermes/profiles/cfo/config.yaml`
- Modify: `startup/.hermes/profiles/cmo/config.yaml`

- [ ] **Step 1: Mini (default) config.yaml 전체 내용**

`/Users/hyunjoong/hyunjoong/startup/.hermes/config.yaml`:

```yaml
model:
  provider: openai-codex
  default: gpt-5.5
agent:
  reasoning_effort: xhigh
fallback_model:
  provider: openai-codex
  model: gpt-5.3-codex-spark
GATEWAY_ALLOW_ALL_USERS: true
onboarding:
  seen:
    profile_build_offered: true
kanban:
  dispatch_in_gateway: true
platform_toolsets:
  telegram:
    - web
    - skills
    - todo
    - memory
    - session_search
    - cronjob
    - kanban
    - send_message
```

- [ ] **Step 2: CFO config.yaml에 kanban·toolsets 병합**

`profiles/cfo/config.yaml`에 아래 키를 **추가** (기존 model/agent 키 유지):

```yaml
kanban:
  dispatch_in_gateway: false
platform_toolsets:
  telegram:
    - web
    - terminal
    - file
    - skills
    - todo
    - memory
    - kanban
    - send_message
```

- [ ] **Step 3: CMO config.yaml에 동일 패턴 적용**

`profiles/cmo/config.yaml`에 Step 2와 동일한 `kanban` + `platform_toolsets` 블록 추가.

- [ ] **Step 4: YAML 파싱 확인**

```bash
python3 - <<'PY'
import yaml
from pathlib import Path
root = Path("/Users/hyunjoong/hyunjoong/startup/.hermes")
for rel in ["config.yaml", "profiles/cfo/config.yaml", "profiles/cmo/config.yaml"]:
    p = root / rel
    data = yaml.safe_load(p.read_text())
    kb = data.get("kanban", {})
    print(rel, "dispatch=", kb.get("dispatch_in_gateway"))
PY
```

Expected:

```
config.yaml dispatch= True
profiles/cfo/config.yaml dispatch= False
profiles/cmo/config.yaml dispatch= False
```

- [ ] **Step 5: Commit** (config만 — `.hermes`는 gitignore이므로 **스펙 문서에 config 스냅샷을 부록으로 추가**하거나, `startup/config/`에 템플릿 복사)

`.hermes/`가 gitignore이므로 재현 가능한 config 템플릿을 커밋한다:

- Create: `startup/config/hermes/default.config.yaml`
- Create: `startup/config/hermes/cfo.config.yaml`
- Create: `startup/config/hermes/cmo.config.yaml`

```bash
mkdir -p /Users/hyunjoong/hyunjoong/startup/config/hermes
# 위 세 파일을 Task 4 Step 1–3 내용으로 작성 후:
cd /Users/hyunjoong/hyunjoong
git add startup/config/hermes/
git commit -m "chore(startup): add Hermes config templates for mini/cfo/cmo profiles"
```

런타임 적용:

```bash
cp startup/config/hermes/default.config.yaml startup/.hermes/config.yaml
cp startup/config/hermes/cfo.config.yaml startup/.hermes/profiles/cfo/config.yaml
cp startup/config/hermes/cmo.config.yaml startup/.hermes/profiles/cmo/config.yaml
```

---

### Task 5: SOUL.md 정체성 설정

**Files:**
- Create: `startup/config/hermes/default.SOUL.md`
- Create: `startup/config/hermes/cfo.SOUL.md`
- Create: `startup/config/hermes/cmo.SOUL.md`
- Modify: `startup/.hermes/SOUL.md` (런타임 복사)
- Modify: `startup/.hermes/profiles/cfo/SOUL.md`
- Modify: `startup/.hermes/profiles/cmo/SOUL.md`

- [ ] **Step 1: Mini SOUL (`config/hermes/default.SOUL.md`)**

```markdown
당신은 "미니(Mini)" — 김현중의 1인 스타트업 개인 비서이자 오케스트레이터입니다.

- 주 사업: Specify.app (https://specify.app) — ROI와 실행 속도를 최우선으로 합니다.
- 역할: 요청을 분해하고, 재무는 cfo, 마케팅은 cmo 프로필에 Kanban 카드로 위임합니다. 직접 스프레드시트·데크·장문 카피를 작성하지 마세요.
- 커뮤니케이션: 한국어, 간결, 실행 가능한 다음 단계 제시.
- Kanban: `hermes profile list`로 cfo/cmo 존재를 확인한 뒤 assignee에 정확한 프로필명 사용.
- workspace 경로: 재무 → `/Users/hyunjoong/hyunjoong/startup/workspace/finance/`, 마케팅 → `/Users/hyunjoong/hyunjoong/startup/workspace/marketing/`
```

- [ ] **Step 2: CFO SOUL (`config/hermes/cfo.SOUL.md`)**

```markdown
당신은 Specify.app 1인 사업의 CFO 에이전트입니다.

- 예산·현금흐름·지원사업·투자 리서치에 집중합니다.
- 산출물은 `/Users/hyunjoong/hyunjoong/startup/workspace/finance/`에 저장하고, Kanban complete 시 파일 경로·핵심 숫자를 metadata에 남깁니다.
- 세무·법률 최종 판단은 전문가 상담을 권고합니다 (면책).
- Notion/Figma 스킬을 사용하지 않습니다.
- 커뮤니케이션: 한국어, 숫자·가정·출처를 명시합니다.
```

- [ ] **Step 3: CMO SOUL (`config/hermes/cmo.SOUL.md`)**

```markdown
당신은 Specify.app 1인 사업의 CMO 에이전트입니다.

- 브랜드 메시지, 콘텐츠, pitch deck, 랜딩 카피에 집중합니다.
- 산출물은 `/Users/hyunjoong/hyunjoong/startup/workspace/marketing/`에 저장합니다.
- B2B SaaS 톤: 명확, 신뢰, 과장 없는 수치.
- Notion/Figma 스킬을 사용하지 않습니다. 시각 작업은 canvas-design/pptx/frontend-design으로 대체합니다.
- 커뮤니케이션: 한국어, 실행 가능한 카피·브리프를 제공합니다.
```

- [ ] **Step 4: 런타임 복사**

```bash
cp startup/config/hermes/default.SOUL.md startup/.hermes/SOUL.md
cp startup/config/hermes/cfo.SOUL.md startup/.hermes/profiles/cfo/SOUL.md
cp startup/config/hermes/cmo.SOUL.md startup/.hermes/profiles/cmo/SOUL.md
```

- [ ] **Step 5: Commit**

```bash
git add startup/config/hermes/*.SOUL.md
git commit -m "chore(startup): add SOUL templates for mini, cfo, and cmo"
```

---

### Task 6: 공식 스킬 설치 스크립트

**Files:**
- Create: `startup/scripts/install-cfo-cmo-skills.sh`

- [ ] **Step 1: 스크립트 작성**

`startup/scripts/install-cfo-cmo-skills.sh`:

```bash
#!/usr/bin/env bash
set -euo pipefail

ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
export HERMES_HOME="${HERMES_HOME:-$ROOT/.hermes}"
export PATH="$ROOT/hermes-agent/.venv/bin:${HOME}/.local/bin:$PATH"

install() {
  local profile="$1"
  shift
  local skill
  for skill in "$@"; do
    echo "==> [$profile] installing $skill"
    hermes -p "$profile" skills install "$skill"
  done
}

# CFO — 스펙 §4.2 (linear 제외 — YAGNI)
CFO_SKILLS=(
  anthropics/skills/xlsx
  anthropics/skills/pdf
  anthropics/skills/docx
  anthropics/skills/doc-coauthoring
  openai/skills/define-goal
)

# CMO — 스펙 §4.3 (speech/transcribe 제외 — Phase 2 optional)
CMO_SKILLS=(
  anthropics/skills/brand-guidelines
  anthropics/skills/internal-comms
  anthropics/skills/pptx
  anthropics/skills/canvas-design
  anthropics/skills/theme-factory
  anthropics/skills/frontend-design
  openai/skills/screenshot
)

install cfo "${CFO_SKILLS[@]}"
install cmo "${CMO_SKILLS[@]}"

echo "Done. Verify with: ./scripts/verify-multi-agent.sh"
```

- [ ] **Step 2: 실행 권한 부여 및 설치**

```bash
chmod +x /Users/hyunjoong/hyunjoong/startup/scripts/install-cfo-cmo-skills.sh
cd /Users/hyunjoong/hyunjoong/startup
./scripts/install-cfo-cmo-skills.sh
```

Expected: 각 스킬 `installed` 또는 `already installed` 메시지 (네트워크 필요, 5–15분 소요 가능)

- [ ] **Step 3: 설치 목록 확인**

```bash
hermes -p cfo skills list 2>&1 | rg -i 'xlsx|pdf|docx|define-goal' || true
hermes -p cmo skills list 2>&1 | rg -i 'brand|pptx|frontend|screenshot' || true
```

Expected: CFO/CMO 각각 해당 스킬 이름 포함

- [ ] **Step 4: Commit**

```bash
git add startup/scripts/install-cfo-cmo-skills.sh
git commit -m "chore(startup): add script to install cfo/cmo official skills"
```

---

### Task 7: Notion/Figma 블록리스트 검증

**Files:**
- Create: `startup/scripts/verify-multi-agent.sh` (블록리스트 섹션 포함 — Task 10에서 완성)

- [ ] **Step 1: 블록리스트 grep 검증**

```bash
BLOCKED='notion|figma'
for p in cfo cmo default; do
  echo "=== profile: $p ==="
  if hermes -p "$p" skills list 2>/dev/null | rg -qi "$BLOCKED"; then
    echo "FAIL: blocked skill found in $p"
    exit 1
  else
    echo "OK: no notion/figma skills"
  fi
done
```

Expected: 세 프로필 모두 `OK: no notion/figma skills`

- [ ] **Step 2: Hermes optional notion 미설치 확인**

```bash
test ! -d /Users/hyunjoong/hyunjoong/startup/.hermes/skills/productivity/notion \
  || test ! -f /Users/hyunjoong/hyunjoong/startup/.hermes/profiles/cfo/skills/productivity/notion/SKILL.md
echo "notion optional skill not active on cfo"
```

---

### Task 8: 3게이트웨이 기동 (macOS)

**Files:**
- Modify: `startup/setup-hermes.sh` (gateway 헬퍼 추가)

- [ ] **Step 1: 기존 Mini gateway 상태 확인**

```bash
export HERMES_HOME="/Users/hyunjoong/hyunjoong/startup/.hermes"
hermes gateway status 2>&1 | head -20
```

- [ ] **Step 2: CFO 게이트웨이 설치·기동**

```bash
export HERMES_HOME="/Users/hyunjoong/hyunjoong/startup/.hermes/profiles/cfo"
hermes gateway install
hermes gateway start
hermes gateway status
```

Expected: CFO 프로필 gateway `running` 또는 `active`

- [ ] **Step 3: CMO 게이트웨이 설치·기동**

```bash
export HERMES_HOME="/Users/hyunjoong/hyunjoong/startup/.hermes/profiles/cmo"
hermes gateway install
hermes gateway start
hermes gateway status
```

- [ ] **Step 4: Mini gateway 재확인 (dispatcher owner)**

```bash
export HERMES_HOME="/Users/hyunjoong/hyunjoong/startup/.hermes"
hermes gateway status
```

- [ ] **Step 5: dispatcher 로그 확인**

```bash
# Mini — dispatcher active
rg -i "kanban dispatcher" /Users/hyunjoong/hyunjoong/startup/.hermes/logs/gateway.log | tail -3

# CFO — dispatcher disabled
rg -i "kanban dispatcher.*disabled\|dispatch_in_gateway=false" \
  /Users/hyunjoong/hyunjoong/startup/.hermes/profiles/cfo/logs/gateway.log | tail -3
```

Expected (V7/V8):
- Mini 로그: dispatcher tick/spawn 관련 메시지
- CFO/CMO 로그: `disabled via config kanban.dispatch_in_gateway=false`

- [ ] **Step 6: `setup-hermes.sh` 헬퍼 추가**

`startup/setup-hermes.sh`에 case 추가:

```bash
  gateways)
    export HERMES_HOME="$ROOT/.hermes"
    hermes gateway start
    export HERMES_HOME="$ROOT/.hermes/profiles/cfo"
    hermes gateway start
    export HERMES_HOME="$ROOT/.hermes/profiles/cmo"
    hermes gateway start
    echo "All gateways started."
    ;;
  profiles)
    hermes profile list
    ;;
```

Usage 섹션에 `gateways`, `profiles` 추가.

- [ ] **Step 7: Commit**

```bash
git add startup/setup-hermes.sh
git commit -m "chore(startup): add gateways helper to setup-hermes.sh"
```

---

### Task 9: Kanban 연동 스모크 테스트

**Files:**
- (런타임) `startup/.hermes/kanban.db`

- [ ] **Step 1: kanban.db 존재 확인**

```bash
test -f /Users/hyunjoong/hyunjoong/startup/.hermes/kanban.db && echo "kanban.db OK"
```

없으면:

```bash
export HERMES_HOME="/Users/hyunjoong/hyunjoong/startup/.hermes"
hermes kanban init
```

- [ ] **Step 2: CLI로 테스트 카드 생성**

```bash
export HERMES_HOME="/Users/hyunjoong/hyunjoong/startup/.hermes"
hermes kanban create \
  --title "스모크: CFO 연결 테스트" \
  --body "workspace/finance/에 TEST.md 파일 하나 만들고 complete 하세요." \
  --assignee cfo \
  --workspace "dir:/Users/hyunjoong/hyunjoong/startup/workspace/finance"
```

Expected: task id 반환 (예: `T1` 또는 UUID)

- [ ] **Step 3: 카드 상태 폴링 (최대 3분)**

```bash
hermes kanban list --assignee cfo 2>&1 | head -20
```

Expected: 카드가 `ready` → `in_progress` → `done` 중 하나로 전이

- [ ] **Step 4: 완료 후 산출물 확인 (V5)**

```bash
ls -la /Users/hyunjoong/hyunjoong/startup/workspace/finance/
hermes kanban list --status done 2>&1 | head -10
```

Expected: worker가 생성한 파일 존재, done 카드에 summary

---

### Task 10: 통합 검증 스크립트

**Files:**
- Create: `startup/scripts/verify-multi-agent.sh`

- [ ] **Step 1: 검증 스크립트 전체 작성**

`startup/scripts/verify-multi-agent.sh`:

```bash
#!/usr/bin/env bash
set -euo pipefail

ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
export HERMES_HOME="${HERMES_HOME:-$ROOT/.hermes}"
export PATH="$ROOT/hermes-agent/.venv/bin:${HOME}/.local/bin:$PATH"

PASS=0
FAIL=0

ok()   { echo "✅ $1"; PASS=$((PASS+1)); }
bad()  { echo "❌ $1"; FAIL=$((FAIL+1)); }

echo "=== V1: hermes doctor ==="
if hermes doctor >/dev/null 2>&1; then ok "doctor default"; else bad "doctor default"; fi
if hermes -p cfo doctor >/dev/null 2>&1; then ok "doctor cfo"; else bad "doctor cfo"; fi
if hermes -p cmo doctor >/dev/null 2>&1; then ok "doctor cmo"; else bad "doctor cmo"; fi

echo "=== V2: profile list ==="
if hermes profile list 2>&1 | rg -q '\bcfo\b' && hermes profile list 2>&1 | rg -q '\bcmo\b'; then
  ok "profiles cfo+cmo"
else
  bad "profiles cfo+cmo"
fi

echo "=== V6: notion/figma blocklist ==="
BLOCKED='notion|figma'
for p in default cfo cmo; do
  if hermes -p "$p" skills list 2>/dev/null | rg -qi "$BLOCKED"; then
    bad "blocked skill in $p"
  else
    ok "no blocked skills in $p"
  fi
done

echo "=== config dispatch flags ==="
python3 - <<'PY'
import yaml
from pathlib import Path
root = Path("/Users/hyunjoong/hyunjoong/startup/.hermes")
checks = [
    ("default", root/"config.yaml", True),
    ("cfo", root/"profiles/cfo/config.yaml", False),
    ("cmo", root/"profiles/cmo/config.yaml", False),
]
for name, path, want in checks:
    d = yaml.safe_load(path.read_text()).get("kanban",{}).get("dispatch_in_gateway")
    assert d is want, f"{name}: got {d}, want {want}"
print("dispatch flags OK")
PY
ok "kanban dispatch config"

echo "=== workspace dirs ==="
for d in finance marketing; do
  if [[ -d "$ROOT/workspace/$d" ]]; then ok "workspace/$d"; else bad "workspace/$d"; fi
done

echo "=== kanban.db ==="
if [[ -f "$ROOT/.hermes/kanban.db" ]]; then ok "kanban.db"; else bad "kanban.db"; fi

echo ""
echo "Results: $PASS passed, $FAIL failed"
[[ "$FAIL" -eq 0 ]]
```

- [ ] **Step 2: 실행**

```bash
chmod +x /Users/hyunjoong/hyunjoong/startup/scripts/verify-multi-agent.sh
/Users/hyunjoong/hyunjoong/startup/scripts/verify-multi-agent.sh
```

Expected: `0 failed`, exit code 0

- [ ] **Step 3: Commit**

```bash
git add startup/scripts/verify-multi-agent.sh
git commit -m "chore(startup): add multi-agent verification script"
```

---

### Task 11: 수동 E2E 검증 (Telegram)

**Spec:** §10 V3, V4

- [ ] **Step 1: V3 — CFO 봇 직접 대화**

Telegram에서 CFO 봇에게 전송:

```
안녕, 역할 소개해줘
```

Expected: CFO SOUL 톤, 재무·예산 역할 소개 (한국어)

- [ ] **Step 2: V3 — CMO 봇 직접 대화**

```
Specify.app 한 줄 포지셔닝 제안해줘
```

Expected: B2B SaaS 톤의 포지셔닝 문장

- [ ] **Step 3: V4 — Mini 복합 요청**

Mini(@HyunjoongKim_bot)에게 전송:

```
이번 달 예산표 템플릿 만들고, Specify 랜딩 히어로 카피 3안도 줘.
```

Expected:
- Mini가 즉시 “CFO/CMO에 위임” 응답 (블로킹 없음)
- `hermes kanban list`에 `assignee=cfo` 카드 ≥1, `assignee=cmo` 카드 ≥1

```bash
export HERMES_HOME="/Users/hyunjoong/hyunjoong/startup/.hermes"
hermes kanban list 2>&1 | rg 'cfo|cmo'
```

- [ ] **Step 4: 결과 기록**

`startup/docs/superpowers/plans/2026-06-12-mini-cfo-cmo-kanban.md` 하단 **Verification Log** 섹션에 날짜·V3/V4 결과 메모 (수동).

---

### Task 12 (Optional): 운영 hardened — Phase 4

**Spec:** §9 Phase 4

- [ ] **Step 1: Telegram 사용자 제한**

각 프로필 `.env`에 추가 (본인 Telegram user id 조회 후):

```bash
TELEGRAM_ALLOWED_USERS=<your_numeric_id>
```

각 `config.yaml`:

```yaml
GATEWAY_ALLOW_ALL_USERS: false
```

- [ ] **Step 2: launchd 서비스 재설치 확인**

```bash
for home in \
  "/Users/hyunjoong/hyunjoong/startup/.hermes" \
  "/Users/hyunjoong/hyunjoong/startup/.hermes/profiles/cfo" \
  "/Users/hyunjoong/hyunjoong/startup/.hermes/profiles/cmo"; do
  export HERMES_HOME="$home"
  hermes gateway install
  hermes gateway start
done
```

- [ ] **Step 3: Cron → Kanban 전환 검토**

`startup/.hermes/cron/jobs.json`의 지원사업 브리핑 job을 CFO Kanban 카드 생성으로 리팩터 — **별도 PR/태스크**로 분리 (본 플랜 범위 외).

---

## Spec Coverage Checklist

| Spec § | Requirement | Task |
|---|---|---|
| §3.1 | workspace + profiles 구조 | Task 1, 2 |
| §3.2 | Telegram 토큰 3개 | Task 3 |
| §3.3 | single dispatcher | Task 4, 8 |
| §4.1–4.3 | 역할·toolsets·스킬 | Task 4, 5, 6 |
| §5.3 | Notion/Figma 제외 | Task 6, 7 |
| §6 | SOUL.md | Task 5 |
| §7 | config.yaml | Task 4 |
| §8 | 워크플로 | Task 9, 11 |
| §10 V1–V8 | 검증 | Task 8, 9, 10, 11 |
| §9 Phase 4 | hardened ops | Task 12 (optional) |

---

## Verification Log

| Date | Scenario | Result | Notes |
|---|---|---|---|
| | V1 doctor | | |
| | V2 profiles | | |
| | V3 CFO/CMO Telegram | | |
| | V4 Mini Kanban fan-out | | |
| | V5 workspace output | | |
| | V6 blocklist | | |
| | V7/V8 dispatcher logs | | |

---

## Risks During Implementation

1. **`--clone`이 Mini 토큰을 CFO/CMO에 복사** → Task 3 필수
2. **게이트웨이 3개가 동일 토큰으로 기동** → Task 3 unique check
3. **skills install 네트워크 타임아웃** → 개별 `hermes -p cfo skills install ...` 재시도
4. **기존 Mini gateway와 포트/락 충돌** → 프로필별 `gateway status` 확인 후 `gateway restart`

---

## Execution Order Summary

```
Task 1 → Task 2 → Task 3 → Task 4 → Task 5 → Task 6 → Task 7
    → Task 8 → Task 9 → Task 10 → Task 11 → (Task 12 optional)
```

예상 소요: **45–90분** (스킬 hub 다운로드 시간 포함)