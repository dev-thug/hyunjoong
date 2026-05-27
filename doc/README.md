# 포트폴리오 리팩토링 문서 모음

본 디렉토리는 Next.js 15, Tailwind CSS v4, Apple PWA 가이드라인을 반영하여 수행한 리팩토링의 결과와 운영 방법을 정리합니다.

## 문서 구성

- [리팩토링 개요](./REFACTORING.md)
- [분석/추적(GA4) 구성](./ANALYTICS.md)
- [SEO 및 PWA 설정](./SEO-PWA.md)
- [성능 최적화 전략](./PERFORMANCE.md)

## 빠른 시작

1. 환경 변수 설정(.env)

```bash
NEXT_PUBLIC_SITE_URL=https://hyunjoong.kim
NEXT_PUBLIC_GA_ID=G-XXXXXXXXXX
NEXT_PUBLIC_ADSENSE_CLIENT=ca-pub-XXXXXXXXXXXXXXXX  # optional, for AdSense
```

2. 빌드/실행

```bash
npm ci
npm run build
npm start
```

3. 점검 체크리스트

- `/robots.txt`, `/sitemap.xml`, `/opengraph-image` 응답 확인
- GA DebugView에서 초기 `page_view` 1회만 기록되는지 확인
- 접힘선 이하 섹션(스킬/경력/연락처) 동적 로딩 정상 렌더 확인
- iOS 홈 화면 추가 시 상태바/아이콘 정상 표시 확인
