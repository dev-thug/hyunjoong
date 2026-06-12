---
name: finance-data-analysis
description: "1인 스타트업 재무 데이터 분석 — CSV/엑셀 정제, pandas 집계, burn rate·runway·CAC·LTV 등 KPI 계산, Jupyter 탐색, 시각화 요약."
version: 1.0.0
author: Hyunjoong Kim
license: MIT
platforms: [linux, macos, windows]
metadata:
  hermes:
    tags: [finance, data-analysis, pandas, kpi, startup, analytics]
    category: data-science
    related_skills: [jupyter-live-kernel, xlsx, excel-author, budget-cashflow-mgmt]
---

# finance-data-analysis

Specify.app 1인 사업의 **재무·운영 데이터**를 분석할 때 사용합니다. 전략 문서·투자 리서치는 CFO 프로필에 맡기고, 여기서는 **숫자 기반 인사이트**에 집중합니다.

## 언제 사용

- 거래·비용 CSV/엑셀을 정제하고 월별·카테고리별 집계
- burn rate, runway, MRR/ARR 추이, 손익분기점 추정
- 이상치·중복·누락 검증, 전월 대비 변동 설명
- Jupyter로 탐색 후 요약 표·차트(또는 표 형태 인사이트) 산출

## 워크스페이스

- 입력·중간 산출: `workspace/finance/analytics/raw/`
- 최종 산출: `workspace/finance/analytics/reports/`
- 재사용 스크립트: `workspace/finance/analytics/scripts/` (필요 시 생성)

## 표준 KPI 정의 (1인 스타트업)

| 지표 | 정의 | 비고 |
|------|------|------|
| Burn rate | 월 평균 순현금 유출 (고정+변동 비용 − 운영 현금 유입) | 3개월 이동평균 권장 |
| Runway | 현금 잔액 ÷ burn rate (월) | 가정 변경 시 시나리오 표 병기 |
| Gross margin | (매출 − 직접비용) / 매출 | SaaS면 인프라·결제수수료 포함 여부 명시 |
| CAC | 해당 기간 마케팅·영업비 / 신규 유료 고객 수 | 기간·채널 단위로 분리 가능하면 분리 |

## 분석 절차

1. **입력 확인** — 파일 경로, 기준 통화(KRW), 기간, 컬럼 의미를 사용자 또는 Kanban 설명에서 확정
2. **정제** — 날짜 파싱, 중복 제거, 카테고리 매핑(고정 목록이 없으면 제안 후 확정)
3. **집계** — 월별 P&L 요약, 카테고리 Top N, 전월 MoM %
4. **검증** — 합계 대조(원본 vs 집계), 누락 월·이상치 플래그
5. **산출** — `reports/YYYY-MM-{slug}.md` (요약) + 필요 시 `.xlsx` / `.csv`
6. **메타데이터** — 가정, 데이터 출처, 한계(샘플 기간·누락 항목)를 반드시 기록

## 도구 선택

| 상황 | 도구 |
|------|------|
| 반복 탐색, DataFrame, 차트 | `jupyter-live-kernel` |
| 일회성 스크립트, 파일 변환 | `terminal` + Python |
| 감사 가능한 최종 모델 | `xlsx` 또는 `excel-author` |

## 출력 형식 (리포트 MD 최소 구조)

```markdown
# 재무 분석 요약 — {기간}

## 핵심 숫자
- 현금 잔액: …
- 월 burn: …
- Runway: …

## 가정·출처
- …

## 발견 사항
1. …

## 권장 액션
- …
```

## 금지·주의

- Notion/Figma 연동 스킬 사용 금지
- 세무 신고 수치·법적 최종 판단은 전문가 검토 필요 — 분석 결과에 면책 문구 포함