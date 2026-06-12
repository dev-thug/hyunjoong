---
name: process-sop-mgmt
description: "COO 프로세스·SOP·런북 관리 — 반복 업무 표준화, 체크리스트, 온보딩/릴리스/고객지원 절차 문서화."
version: 1.0.0
author: Hyunjoong Kim
license: MIT
platforms: [linux, macos, windows]
metadata:
  hermes:
    tags: [operations, sop, runbook, process, checklist, startup]
    category: productivity
    related_skills: [docx, doc-coauthoring, internal-comms, code-wiki]
---

# process-sop-mgmt

**반복 운영 업무**를 SOP(Standard Operating Procedure)와 런북으로 문서화합니다. 1인 사업에서도 “다음에 같은 일을 30분 안에” 끝낼 수 있게 만드는 것이 목표입니다.

## 언제 사용

- 신규 반복 업무가 2회 이상 발생했을 때 SOP 초안 작성
- 배포·릴리스·고객 온보딩·지원 응대 절차 정리
- 벤더/계약 갱신·결제 등 운영 체크리스트
- 팀(에이전트) 간 핸드오프 규칙 문서화

## 파일 레이아웃

```
workspace/operations/
├── sops/
│   └── {slug}-sop.md          # 표준 절차
├── runbooks/
│   └── {slug}-runbook.md      # 장애·예외 대응
└── checklists/
    └── {slug}-checklist.md    # 짧은 실행 체크리스트
```

공식 대외 문서(docx)가 필요하면 `docx` 스킬로 `sops/` 내용을 변환합니다.

## SOP 최소 구조

```markdown
# SOP: {제목}

| 항목 | 값 |
|------|-----|
| Owner | coo |
| Review 주기 | 분기 |
| Last updated | YYYY-MM-DD |

## 목적
…

## 트리거
언제 이 SOP를 실행하는가

## 사전 조건
- …

## 절차
1. …
2. …

## 완료 기준
- …

## 예외·에스컬레이션
- …

## 관련
- Kanban / 다른 SOP 링크
```

## 런북 vs SOP

| 유형 | 용도 |
|------|------|
| SOP | 정상 반복 절차 |
| Runbook | 장애·긴급·예외 (증상 → 진단 → 조치 → 복구 확인) |
| Checklist | 10단계 이하 짧은 실행 (출시 전, 월말 마감 등) |

## 품질 기준

- 각 단계는 **검증 가능**해야 함 (명령, URL, 파일 경로, 기대 결과)
- 모호한 표현("적절히", "필요시") 금지 — 구체적 조건으로 대체
- 변경 시 `Last updated`와 변경 요약 1줄 기록

## 금지·주의

- Notion/Figma 스킬 사용 금지
- SOP는 저장소 `workspace/operations/`가 SSOT — 외부 위키 복제만 하지 않음