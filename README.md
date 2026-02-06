# hyunjoong.kim

[![Live Demo](https://img.shields.io/badge/Live-hyunjoong.kim-blue?style=flat-square)](https://hyunjoong.kim)
[![Vercel](https://img.shields.io/badge/Deployed%20on-Vercel-black?style=flat-square&logo=vercel)](https://vercel.com)

> **🌐 Live Site: [https://hyunjoong.kim](https://hyunjoong.kim)**

개인 포트폴리오 및 기술 블로그 웹사이트입니다.

## Tech Stack

- **Framework**: Next.js 16 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS v4
- **Content**: MDX
- **Icons**: Lucide React
- **Charts**: Recharts
- **Deployment**: Vercel

## Features

- **다국어 지원 (i18n)**: 한국어/영어 자동 감지 및 전환
- **MDX 블로그**: 코드 하이라이팅, 커스텀 컴포넌트 지원
- **댓글 시스템**: Giscus 기반 GitHub Discussions 연동
- **SEO 최적화**: 메타데이터, Open Graph, JSON-LD, sitemap, robots.txt
- **반응형 디자인**: 모바일/태블릿/데스크톱 최적화
- **다크 테마**: 기본 다크 모드 UI

## Project Structure

```
src/
├── app/                    # Next.js App Router 페이지
│   └── [lang]/             # 다국어 라우팅
│       ├── blog/           # 블로그 목록 및 상세
│       ├── projects/       # 프로젝트 목록 및 상세
│       └── profile/        # 프로필 페이지
├── components/
│   ├── layout/             # Navigation, Footer 등 레이아웃
│   ├── sections/           # Hero, About, Blog, Projects 섹션
│   └── mdx/                # MDX 커스텀 컴포넌트
├── content/
│   ├── posts/              # 블로그 포스트 (.mdx)
│   └── projects/           # 프로젝트 소개 (.mdx)
├── dictionaries/           # 다국어 번역 파일 (ko.json, en.json)
├── lib/                    # 유틸리티 함수
└── types/                  # TypeScript 타입 정의
```

## Getting Started

```bash
# 의존성 설치
npm install

# 개발 서버 실행
npm run dev

# 프로덕션 빌드
npm run build

# 프로덕션 서버 실행
npm start
```

## Writing Blog Posts

블로그 포스트는 `src/content/posts/` 디렉토리에 MDX 파일로 작성합니다.

### 파일 네이밍

```
{slug}.{lang}.mdx
예: nextjs-architecture.ko.mdx
```

### 메타데이터 형식

```javascript
export const metadata = {
  title: "포스트 제목",
  excerpt: "포스트 요약",
  category: "Engineering", // Engineering | Business | Insight
  date: "2024-05-10",
  readTime: "8 min",
  lang: "ko",
  keywords: ["Next.js", "React"], // 선택
  hidden: false, // 선택, true면 목록에서 숨김
};
```

### 이미지 삽입

이미지 파일은 `public/images/blog/` 디렉토리에 저장합니다.

```mdx
// 기본 마크다운 이미지
![이미지 설명](/images/blog/image.png)

// BlogImage 컴포넌트 (크기 조절, 캡션 지원)
<BlogImage
  src="/images/blog/image.png"
  alt="이미지 설명"
  size="lg"
  caption="이미지 캡션"
  align="center"
/>

// ImageGallery 컴포넌트 (여러 이미지 그리드)
<ImageGallery
  images={[
    { src: "/images/blog/img1.png", alt: "이미지1" },
    { src: "/images/blog/img2.png", alt: "이미지2" },
  ]}
  columns={2}
/>
```

## MDX Components

| 컴포넌트 | 설명 |
|---------|------|
| `BlogImage` | 크기 조절, 캡션, 정렬 지원 이미지 |
| `ImageGallery` | 여러 이미지 그리드 레이아웃 |
| `CodeBlock` | 코드 하이라이팅 + 복사 버튼 |
| `Giscus` | GitHub Discussions 기반 댓글 시스템 |

## Environment Variables

```env
# Base URL
NEXT_PUBLIC_BASE_URL=https://hyunjoong.kim

# Giscus 댓글 시스템 (https://giscus.app 에서 설정)
NEXT_PUBLIC_GISCUS_REPO=your-username/your-repo
NEXT_PUBLIC_GISCUS_REPO_ID=your-repo-id
NEXT_PUBLIC_GISCUS_CATEGORY_ID=your-category-id
```

## License

MIT
