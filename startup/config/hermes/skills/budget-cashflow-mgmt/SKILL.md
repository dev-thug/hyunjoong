---
name: budget-cashflow-mgmt
description: "1인 스타트업 일상 재정관리 — 월 예산 대비 실적, 현금흐름 캘린더, 고정비·변동비 분류, 지출 승인 체크리스트, runway 알림 기준."
version: 1.0.0
author: Hyunjoong Kim
license: MIT
platforms: [linux, macos, windows]
metadata:
  hermes:
    tags: [finance, budget, cashflow, startup, bookkeeping]
    category: productivity
    related_skills: [xlsx, excel-author, finance-data-analysis, google-workspace]
---

# budget-cashflow-mgmt

**운영 재정관리** 전용 워크플로입니다. CFO의 전략 예산 수립·지원사업 문서와 달리, 월별 **실적 추적·현금흐름 관리·지출 통제**에 씁니다.

## 언제 사용

- 이번 달 예산 vs 실적 점검
- 고정비(구독·임대·보험) 목록 갱신 및 갱신일 알림
- 대형 지출 전 runway·현금 버퍼 체크
- 월말 마감: 미분류 거래 정리, 다음 달 현금흐름 예측

## 파일 레이아웃 (권장)

```
workspace/finance/
├── budget/
│   ├── YYYY-master-budget.xlsx    # 연간·월별 예산 골격
│   └── YYYY-MM-actuals.xlsx       # 월 실적
├── cashflow/
│   └── YYYY-MM-forecast.xlsx      # 입·출금 예정
└── analytics/                     # finance-data-analysis 산출물
```

없으면 `excel-author` 또는 `xlsx` 스킬로 골격을 생성합니다.

## 카테고리 (기본)

| 구분 | 예시 |
|------|------|
| 인프라 | 클라우드, 도메인, API, 모니터링 |
| 도구·구독 | IDE, SaaS, AI API |
| 마케팅 | 광고, 콘텐츠, 이벤트 |
| 인건비 | (1인 사업 시 본인 인건비·4대보험) |
| 세무·행정 | 세무사, 등록비, 법무 |
| 기타 | 미분류 — 월말 0건 목표 |

## 월간 마감 체크리스트

1. [ ] 모든 거래 카테고리 분류 완료
2. [ ] 예산 대비 ±10% 초과 항목 원인 기록
3. [ ] 다음 90일 고정 지출(구독 갱신) 캘린더 반영
4. [ ] 현금 잔액·burn·runway 갱신 (`finance-data-analysis`와 동일 정의)
5. [ ] Kanban metadata에 핵심 숫자·파일 경로 기록

## 지출 승인 기준 (1인 사업 기본)

- **즉시 가능:** 월 예산 내·runway 6개월 이상·ROI 명확한 운영비
- **검토 필요:** 단일 50만원 초과 또는 runway 3개월 미만일 때 대안·연기 옵션 표로 제시
- **보류 권고:** runway 2개월 미만 + 비필수 대형 지출

임계값은 `workspace/finance/budget/policy.md`에 사용자가 수정할 수 있습니다. 없으면 위 기본값 사용 후 파일 생성을 제안합니다.

## Google Sheets

사용자가 Sheets를 쓰는 경우 `google-workspace`로 동기화할 수 있습니다. 로컬 `workspace/finance/`가 **단일 진실 공급원(SSOT)** 이 되도록보내기 시점을 명시합니다.

## 출력

- 월간: `workspace/finance/budget/YYYY-MM-summary.md` (1페이지 요약)
- 수치 변경 시 이전 달 대비 diff 한 줄씩

## 주의

- 세무 신고용 최종 장부가 아님 — 회계·세무는 전문가 검토 권고
- Notion/Figma 스킬 사용 금지