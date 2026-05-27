# Google Analytics 4 & SEO 설정 가이드

이 프로젝트에는 Google Analytics 4 (GA4)와 포괄적인 SEO 최적화가 구현되어 있습니다.

## 🚀 설치된 기능

### 1. Google Analytics 4 (GA4)

- **최신 Next.js 방식**: `@next/third-parties/google` 사용
- **추적 ID**: `NEXT_PUBLIC_GA_ID` 환경 변수에서 로드 (하드코딩된 fallback ID 제거)
- **스크롤 추적**: 25%, 50%, 75%, 90% 마일스톤 자동 추적
- **이벤트 추적**: 프로젝트 클릭, 외부 링크, 다운로드 등

### 2. SEO 최적화

- **메타 태그**: 포괄적인 메타데이터 설정
- **Open Graph**: 소셜 미디어 최적화
- **Twitter Cards**: 트위터 공유 최적화
- **Structured Data**: JSON-LD 형식의 구조화된 데이터
- **Sitemap**: 자동 생성되는 XML 사이트맵
- **Robots.txt**: 검색 엔진 크롤링 최적화
- **PWA Manifest**: 모바일 앱 같은 경험

## 📁 파일 구조

```
components/
├── GoogleAnalytics.tsx          # GA4 메인 컴포넌트
├── AnalyticsProvider.tsx        # 분석 프로바이더
├── hooks/
│   └── useScrollTracking.ts     # 스크롤 추적 훅
└── StructuredData.tsx           # 구조화된 데이터

app/
├── layout.tsx                   # GA4 및 메타데이터 설정
├── sitemap.ts                   # 동적 사이트맵
├── robots.ts                    # 로봇 지시사항
└── manifest.ts                  # PWA 매니페스트
```

## 🔧 설정 방법

### 1. 도메인 변경

다음 파일들에서 `https://hyunjoong.kim`을 실제 도메인으로 변경하세요:

- `app/layout.tsx`
- `app/sitemap.ts`
- `app/robots.ts`
- `components/StructuredData.tsx`

### 2. Google Search Console 설정

`app/layout.tsx`의 metadata.verification 은 placeholder 값 때문에 제거되었습니다.
실제 Search Console 검증 코드가 필요하면 NEXT_PUBLIC_* env 또는 generateMetadata를 사용하세요.

## 📊 GA4 이벤트 추적

### 자동 추적 이벤트

- **페이지 뷰**: 자동으로 모든 페이지 뷰 추적
- **스크롤 깊이**: 25%, 50%, 75%, 90% 자동 추적

### 수동 추적 함수들

```typescript
// 프로젝트 클릭 추적
trackProjectClick("프로젝트명", "github|demo");

// 외부 링크 클릭 추적
trackExternalLink("https://example.com", "링크 설명");

// 연락처 클릭 추적
trackContactClick("email|phone|linkedin");

// 스킬 클릭 추적
trackSkillClick("React");

// 파일 다운로드 추적
trackDownload("resume.pdf");
```

## 📈 GA4에서 확인할 수 있는 데이터

1. **기본 메트릭스**: 페이지 뷰, 사용자 수, 세션 수, 이탈률
2. **사용자 행동**: 스크롤 깊이, 프로젝트 클릭률, 외부 링크 클릭률
3. **콘텐츠 성과**: 인기 프로젝트, 관심 기술 스택, 다운로드된 파일

## 🔍 SEO 최적화 요소

- 제목 템플릿 및 메타 설명 최적화
- Open Graph 및 Twitter Cards
- JSON-LD 구조화된 데이터 (Person, WebSite, ProfessionalService)
- 자동 사이트맵 및 로봇 지시사항
- PWA 지원 및 모바일 최적화

## 📋 설정 체크리스트

- [ ] 실제 도메인으로 변경
- [ ] Google Search Console 인증 코드 추가
- [ ] OG 이미지 추가 (`/og-image.jpg`)
- [ ] PWA 아이콘 추가 (`/icon-192x192.png`, `/icon-512x512.png`)
- [ ] GA4 대시보드에서 데이터 확인

이 설정으로 포트폴리오 사이트의 성과를 정확히 측정하고 SEO를 최적화할 수 있습니다!
