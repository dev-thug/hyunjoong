# Blog TOC & Reading Progress Design

## Goal

블로그 상세 페이지에서 다음 경험을 제공한다.

- 포스트의 목차(TOC)를 확인하고 원하는 섹션으로 즉시 이동
- 현재 어디까지 읽었는지/얼마나 남았는지 진행률 확인
- 기존 디자인 시스템(다크 톤, glass-panel, mono 타이포, 미니멀 인터랙션)과 시각적으로 일관성 유지

## UX Requirements

### Desktop

- 본문 우측에 `sticky` TOC 패널 배치 (`top-24`)
- 현재 읽는 섹션(active) 강조
- 읽은 섹션/남은 섹션 상태를 톤 차이로 표시
- 상단 얇은 progress bar와 TOC 내부 진행률 텍스트 동시 제공

### Mobile

- 본문 상단에 접이식 TOC 패널 배치
- 토글 버튼(`목차 보기`)으로 열고 닫음
- 항목 탭 시 해당 섹션으로 스크롤 이동

## Architecture

### Chosen Approach

서버에서 헤딩을 추출하고, 클라이언트에서 active/reading progress만 계산한다.

- 서버: TOC 데이터 생성(헤딩 id, 텍스트, depth)
- 클라이언트: `IntersectionObserver`로 현재 섹션 추적
- 장점: SSR 친화적, 초기 페인트 안정적, 클라이언트 오버헤드 낮음

### New/Updated Modules

- `src/lib/toc.ts` (new)
  - MDX 소스 기반 헤딩 추출 유틸
  - `h2`, `h3` 대상
  - slug 중복 충돌 방지 (`-2`, `-3`)
- `src/components/blog/BlogToc.tsx` (new, client)
  - TOC 렌더링(데스크톱 sticky + 모바일 접이식)
  - active section 하이라이트
- `src/components/blog/ReadingProgress.tsx` (new, client)
  - 상단 progress bar
  - `% 읽음 / % 남음` 계산 및 표시
- `src/app/[lang]/blog/[slug]/page.tsx` (update)
  - TOC 데이터 생성 및 컴포넌트에 props 전달
  - 기존 본문/Giscus/네비게이션 유지

## Data Flow

1. 서버에서 포스트 콘텐츠 로드
2. `toc.ts`가 헤딩 목록 생성
3. 상세 페이지에서 TOC 데이터와 본문 렌더
4. 클라이언트에서 섹션 가시성 추적
5. active TOC 항목과 진행률 UI 동기화

## Styling & Design-System Alignment

- 기존 토큰과 유틸 재사용:
  - `glass-panel`
  - `border-white/10`, `text-gray-*`, `font-mono`
  - 기존 transition 패턴
- 과도한 애니메이션 금지, 단순한 상태 강조 중심
- 기존 블로그 페이지의 시각적 계층(헤더 > 본문 > 댓글 > 네비) 유지

## Error Handling & Edge Cases

- 헤딩 없음: TOC 숨김, 진행률은 문서 길이에 따라 표시(또는 비활성)
- 중복 헤딩: id suffix로 유일성 보장
- 매우 짧은 문서: 진행률 100% 고정 또는 바 비활성
- 앵커 타깃 없음: 안전하게 no-op 처리

## Accessibility

- TOC 컨테이너: `nav` + `aria-label="Table of contents"`
- active 항목: `aria-current="location"`
- 모바일 토글: `aria-expanded`, `aria-controls`
- 키보드 탐색 및 포커스 링 유지
- 섹션 점프 시 헤더 오프셋 고려(`scroll-mt-*`)

## Testing Plan

- 기능 테스트
  - TOC 항목 클릭 시 정확한 섹션 이동
  - 스크롤 시 active 항목 업데이트
  - 진행률 수치/바 동기화
- 반응형 테스트
  - 데스크톱 sticky 동작
  - 모바일 접이식 동작
- 회귀 테스트
  - 기존 본문 렌더, Giscus, prev/next 네비 동작 유지
- 성능 테스트
  - 스크롤 시 프레임 드랍/레이아웃 점프 여부 확인

## Out of Scope (This Iteration)

- 사용자별 읽기 위치 영구 저장(localStorage/DB)
- TOC depth 커스터마이즈 UI
- 문서별 수동 TOC 오버라이드
