---
name: ops-execution
description: "1인 스타트업 COO 실행·조율 — 프로젝트 마일스톤, 액션아이템, 크로스펑셔널 Kanban 위임, 주간 운영 리포트, 블로커 에스컬레이션."
version: 1.0.0
author: Hyunjoong Kim
license: MIT
platforms: [linux, macos, windows]
metadata:
  hermes:
    tags: [operations, coo, execution, kanban, coordination, okr, startup]
    category: productivity
    related_skills: [kanban-worker, define-goal, internal-comms, process-sop-mgmt]
---

# ops-execution

Specify.app 1인 사업의 **운영 실행·조율** 전용 워크플로입니다. 전략·재무·마케팅 산출물 자체를 만들기보다 **누가 무엇을 언제까지** 하는지 맞추고 진행을 추적합니다.

## 언제 사용

- 여러 영역(재무·마케팅·개발)이 섞인 이니셔티브를 작업 단위로 쪼개고 위임
- 주간/스프린트 운영 리포트 (진행·블로커·다음 주 우선순위)
- 마일스톤 지연·의존성 충돌 해소
- 회의 후 액션아이템을 Kanban 카드로 전환

## 워크스페이스

- 실행 보드 스냅샷: `workspace/operations/projects/`
- 주간 리포트: `workspace/operations/reports/YYYY-Www-ops.md`
- 에스컬레이션·결정 로그: `workspace/operations/meetings/`

## 위임 매트릭스 (기본)

| 요청 유형 | assignee |
|-----------|----------|
| burn/runway, 비용 집계, KPI 분석 | `finmgr` |
| 예산 수립, 투자·지원사업, IR 문서 | `cfo` |
| 브랜드, 덱, 랜딩, 캠페인 | `cmo` |
| SOP·프로세스 문서, 운영 조율 | `coo` (자체) |
| 최종 라우팅·복합 요청 분해 | `default` (Mini) |

## 실행 절차

1. **목표 확인** — 완료 정의(DoD), 기한, 제약(1인·ROI 우선)
2. **분해** — 2시간 이내 완료 가능한 카드 단위로 쪼갬
3. **위임** — Kanban `assignee`에 프로필명, 설명에 입력·출력 경로·완료 기준
4. **추적** — blocked 카드는 원인·필요 결정·제안 옵션을 metadata에 기록
5. **리포트** — 주간 요약: Done / In progress / Blocked / Next

## 주간 운영 리포트 템플릿

```markdown
# 운영 리포트 — {기간}

## 핵심 진행
- …

## 완료
- [ ] …

## 진행 중
- …

## 블로커
| 항목 | 원인 | 제안 |
|------|------|------|

## 다음 주 Top 3
1. …
```

## Kanban 카드 품질 (필수)

- **제목:** 동사 + 산출물 (예: "3월 비용 집계표 작성")
- **설명:** 배경 1문장, 입력 링크/경로, 완료 기준 1~3개
- **metadata:** `output_path`, `due`, `depends_on` (있을 때)

## 금지·주의

- Notion/Figma 스킬 사용 금지
- 재무 최종 판단·세무는 cfo/finmgr + 전문가 검토 — COO는 조율만