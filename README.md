# 🚀 Portfolio - Apple Style Backend Developer Portfolio

> **현대적이고 인터랙티브한 백엔드 개발자 포트폴리오**  
> Apple의 디자인 철학을 바탕으로 제작된 고품질 포트폴리오 웹사이트

[![Next.js](https://img.shields.io/badge/Next.js-15.3.3-black?style=for-the-badge&logo=next.js)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-19.0.0-61DAFB?style=for-the-badge&logo=react)](https://reactjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-3178C6?style=for-the-badge&logo=typescript)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-4.0-38B2AC?style=for-the-badge&logo=tailwind-css)](https://tailwindcss.com/)

---

## 📋 목차

- [🎯 프로젝트 개요](#-프로젝트-개요)
- [✨ 주요 특징](#-주요-특징)
- [🛠 기술 스택](#-기술-스택)
- [📁 프로젝트 구조](#-프로젝트-구조)
- [🚀 시작하기](#-시작하기)
- [🎨 디자인 시스템](#-디자인-시스템)
- [📱 섹션 구성](#-섹션-구성)
- [🧩 컴포넌트 아키텍처](#-컴포넌트-아키텍처)
- [🎯 최적화 및 성능](#-최적화-및-성능)
- [📈 SEO & 접근성](#-seo--접근성)
- [🔧 커스터마이징 가이드](#-커스터마이징-가이드)
- [📄 라이선스](#-라이선스)

---

## 🎯 프로젝트 개요

**스크롤 3번 이내에 핵심 역량을 강하게 각인시키는** 백엔드 개발자 포트폴리오입니다.

### 🎪 데모 미리보기

```bash
npm run dev
# http://localhost:3000에서 확인
```

### 🎯 설계 목표

- **빠른 임팩트**: 3번의 스크롤 내에 핵심 역량 노출
- **프리미엄 UX**: Apple 스타일의 정제된 인터랙션
- **모바일 최적화**: 완벽한 반응형 디자인
- **SEO 친화적**: 검색 엔진 최적화 완료
- **개발자 중심**: 기술적 전문성 강조

---

## ✨ 주요 특징

### 🎨 **Apple-Inspired Design**

- **Minimalism**: 불필요한 요소 제거, 핵심에 집중
- **Premium Animations**: Framer Motion 기반 부드러운 인터랙션
- **Glass Morphism**: 현대적인 글래스 효과와 backdrop blur
- **Mathematical Layout**: 정확한 그리드 시스템과 여백 활용

### 🚀 **Performance First**

- **Next.js 15 + React 19**: 최신 기술 스택
- **Turbopack**: 초고속 개발 서버
- **Code Splitting**: 자동 번들 최적화
- **Image Optimization**: 자동 이미지 최적화

### 📱 **Mobile Excellence**

- **Responsive Design**: 모든 디바이스 완벽 지원
- **Touch Optimized**: 모바일 터치 인터랙션 최적화
- **Performance**: 모바일 성능 우선 최적화

### 🔍 **SEO & Accessibility**

- **Meta Tags**: 완벽한 메타데이터 설정
- **Structured Data**: JSON-LD 구조화 데이터
- **WCAG Compliance**: 웹 접근성 가이드라인 준수
- **Semantic HTML**: 시맨틱 마크업 구조

---

## 🛠 기술 스택

### **Core Framework**

```typescript
"next": "15.3.3"           // React 메타프레임워크
"react": "^19.0.0"         // UI 라이브러리
"typescript": "^5"         // 타입 안전성
```

### **Styling & Animation**

```typescript
"tailwindcss": "^4"        // 유틸리티 CSS 프레임워크
"framer-motion": "^12.18.1" // 애니메이션 라이브러리
```

### **UI & Icons**

```typescript
"lucide-react": "^0.517.0" // 아이콘 라이브러리 (Apple 스타일)
```

### **Development Tools**

```typescript
"@tailwindcss/postcss": "^4" // PostCSS 플러그인
"eslint": "^9"              // 코드 품질 도구
"turbopack": "built-in"     // 빌드 도구
```

---

## 📁 프로젝트 구조

```
portfolio/
├── 📂 app/                          # Next.js App Router
│   ├── 🎨 globals.css              # 전역 스타일 (Apple 디자인 시스템)
│   ├── 🔧 layout.tsx               # 루트 레이아웃 (SEO 메타데이터)
│   ├── 🏠 page.tsx                 # 메인 페이지 (섹션 조합)
│   └── 📱 favicon.ico              # 파비콘
│
├── 📂 components/                   # 재사용 컴포넌트
│   ├── 📂 sections/                # 페이지 주요 섹션
│   │   ├── 🎭 Hero.tsx             # 히어로 섹션 (첫인상)
│   │   ├── 👨‍💻 About.tsx            # 개발자 소개
│   │   ├── 🛠 Skills.tsx            # 기술 스택
│   │   ├── 💼 Projects.tsx         # 프로젝트 포트폴리오
│   │   ├── 📈 Experience.tsx       # 경력 타임라인
│   │   ├── 📧 Contact.tsx          # 연락처 정보
│   │   └── 📋 index.ts             # 섹션 내보내기
│   │
│   ├── 📂 cards/                   # 카드 타입 컴포넌트
│   │   ├── 🏆 AchievementCard.tsx  # 성과 카드
│   │   ├── 📞 CallToActionCard.tsx # CTA 카드
│   │   ├── 📧 ContactCard.tsx      # 연락처 카드
│   │   ├── 💼 ExperienceCard.tsx   # 경력 카드
│   │   ├── 🎯 ExpertiseCard.tsx    # 전문성 카드
│   │   ├── 🔍 FocusCard.tsx        # 포커스 카드
│   │   ├── 📁 ProjectCard.tsx      # 프로젝트 카드
│   │   ├── 📊 ProjectHighlights.tsx # 프로젝트 하이라이트
│   │   ├── 📈 ProjectMetricCard.tsx # 프로젝트 지표 카드
│   │   ├── 🛠 SkillCard.tsx         # 스킬 카드
│   │   ├── 🏷 SkillCategoryHeader.tsx # 스킬 카테고리 헤더
│   │   ├── 💎 ValueCard.tsx        # 가치 카드
│   │   └── 📋 index.ts             # 카드 내보내기
│   │
│   ├── 📂 ui/                      # 기본 UI 컴포넌트
│   │   ├── 🎯 AnimatedCard.tsx     # 애니메이션 카드
│   │   ├── ✨ AnimatedText.tsx     # 애니메이션 텍스트
│   │   ├── 🌐 BackgroundGrid.tsx   # 배경 그리드
│   │   ├── 🏷 Badge.tsx            # 배지 컴포넌트
│   │   ├── 🎨 BadgeGroup.tsx       # 배지 그룹
│   │   ├── 📱 BaseCard.tsx         # 기본 카드
│   │   ├── 📱 DeviceMockup.tsx     # 디바이스 목업
│   │   ├── 🎨 GradientIcon.tsx     # 그라디언트 아이콘
│   │   ├── 📦 IconContainer.tsx    # 아이콘 컨테이너
│   │   ├── 📊 MetricCard.tsx       # 지표 카드
│   │   ├── 🖼 ProjectMockupContent.tsx # 프로젝트 목업 콘텐츠
│   │   ├── 📜 ScrollIndicator.tsx  # 스크롤 인디케이터
│   │   ├── 📦 SectionContainer.tsx # 섹션 컨테이너
│   │   ├── 🎯 SectionHeader.tsx    # 섹션 헤더
│   │   ├── 🏷 SkillTag.tsx         # 스킬 태그
│   │   ├── ⬆️ Spacer.tsx           # 간격 조정자
│   │   ├── 🏷 TagList.tsx          # 태그 리스트
│   │   ├── 🛠 TechBadge.tsx        # 기술 배지
│   │   └── 📋 index.ts             # UI 내보내기
│   │
│   ├── 🧠 StructuredData.tsx       # SEO 구조화 데이터
│   └── 📋 index.ts                 # 컴포넌트 내보내기
│
├── 📂 public/                      # 정적 파일
│   ├── 🖼 *.svg                    # SVG 아이콘들
│   └── 📱 favicon.ico              # 파비콘
│
├── ⚙️ next.config.ts               # Next.js 설정
├── 📝 tsconfig.json                # TypeScript 설정
├── 🎨 postcss.config.mjs           # PostCSS 설정
├── 🔧 eslint.config.mjs            # ESLint 설정
├── 📦 package.json                 # 의존성 관리
└── 📄 README.md                    # 프로젝트 문서
```

---

## 🚀 시작하기

### 📋 필수 조건

- **Node.js** 18.0 이상
- **npm** 또는 **yarn** 또는 **pnpm**

### ⚡ 빠른 시작

```bash
# 1. 저장소 클론
git clone https://github.com/your-username/portfolio.git
cd portfolio

# 2. 의존성 설치
npm install

# 3. 개발 서버 실행
npm run dev

# 4. 브라우저에서 확인
# http://localhost:3000
```

### 🏗 프로덕션 빌드

```bash
# 빌드 생성
npm run build

# 프로덕션 서버 실행
npm start
```

### 🧹 코드 품질 검사

```bash
# ESLint 실행
npm run lint
```

---

## 🎨 디자인 시스템

### 🎨 **Color Palette**

```css
/* Apple-Inspired Colors */
--foreground: #1d1d1f; /* 메인 텍스트 */
--background: #ffffff; /* 메인 배경 */
--blue-600: #2563eb; /* 프라이머리 블루 */
--gray-50: #f9fafb; /* 라이트 그레이 */
--gray-900: #111827; /* 다크 그레이 */
```

### 📏 **Typography Scale**

```css
/* Font Hierarchy */
.text-9xl {
  font-size: 8rem;
} /* Hero 타이틀 */
.text-4xl {
  font-size: 2.25rem;
} /* 섹션 제목 */
.text-2xl {
  font-size: 1.5rem;
} /* 서브 제목 */
.text-lg {
  font-size: 1.125rem;
} /* 본문 */
```

### 🌊 **Animation Easing**

```css
/* Apple-Style Easing */
cubic-bezier(0.16, 1, 0.3, 1)     /* Apple 표준 easing */
cubic-bezier(0.4, 0, 0.2, 1)      /* Material easing */
```

### 🎭 **Interactive States**

```css
/* Hover Effects */
.apple-button-hover:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15);
}

/* Glass Morphism */
.glass-effect {
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.1);
}
```

---

## 📱 섹션 구성

### 🎭 **1. Hero Section**

```typescript
// 강렬한 첫인상으로 3초 내 집중도 확보
- 거대한 타이포그래피
- 핵심 기술 스택 배지
- 시차 스크롤 애니메이션
- 스크롤 인디케이터
```

### 👨‍💻 **2. About Section**

```typescript
// 개발 철학과 핵심 역량 소개
- 개발 철학 (3개 가치)
- 핵심 기술 영역 (4개 분야)
- 주요 성과 하이라이트 (3개 지표)
```

### 🛠 **3. Skills Section**

```typescript
// iPhone 기능 소개 UI 스타일
- Backend Development
- Database & Storage
- Cloud & DevOps
- 각 기술별 숙련도 표시
```

### 💼 **4. Projects Section**

```typescript
// Apple 제품 갤러리 스타일
- 3개 주요 프로젝트
- 디바이스 목업 (MacBook, iPhone, Desktop)
- 성과 지표와 기술 스택
- GitHub 링크
```

### 📈 **5. Experience Section**

```typescript
// Apple 제품 출시 타임라인 스타일
- 수직 타임라인 레이아웃
- 3개 경력 단계
- 각 포지션별 성과와 기술
```

### 📧 **6. Contact Section**

```typescript
// Apple Store CTA 스타일
- 연락처 정보
- 현재 관심사
- 채용 문의 CTA
```

---

## 🧩 컴포넌트 아키텍처

### 🏗 **컴포넌트 계층구조**

```
Page (app/page.tsx)
├── Section Components (components/sections/)
│   ├── Hero, About, Skills, Projects, Experience, Contact
│   └── 각 섹션별 독립적인 상태 관리
│
├── Card Components (components/cards/)
│   ├── 데이터 표시 전용 컴포넌트
│   └── 재사용 가능한 카드 레이아웃
│
└── UI Components (components/ui/)
    ├── 기본 원자 단위 컴포넌트
    └── 공통 인터랙션 로직
```

### 🔧 **주요 컴포넌트 분석**

#### `BaseCard.tsx` - 기본 카드 시스템

```typescript
interface BaseCardProps {
  gradient?: string; // 호버 그라디언트
  index?: number; // 스태거 애니메이션
  delay?: number; // 애니메이션 지연
  hoverEffect?: boolean; // 호버 효과 활성화
  backdropBlur?: boolean; // 블러 효과
}
```

#### `SectionContainer.tsx` - 섹션 래퍼

```typescript
interface SectionContainerProps {
  id: string; // 앵커 링크용 ID
  backgroundClass?: string; // 배경 클래스
  enableParallax?: boolean; // 패럴랙스 효과
  children: ReactNode;
}
```

### 📊 **상태 관리 패턴**

```typescript
// 각 섹션은 독립적인 상태 관리
const [isVisible, setIsVisible] = useState(false);
const { scrollYProgress } = useScroll();
const y = useTransform(scrollYProgress, [0, 1], ["0%", "50%"]);
```

---

## 🎯 최적화 및 성능

### ⚡ **Build Performance**

- **Turbopack**: Next.js 15의 빠른 빌드 도구
- **Tree Shaking**: 사용하지 않는 코드 자동 제거
- **Code Splitting**: 라우트별 자동 분할
- **Bundle Analysis**: `npm run build`시 번들 크기 분석

### 🖼 **Asset Optimization**

- **Next.js Image**: 자동 이미지 최적화
- **SVG Icons**: Lucide React으로 가벼운 아이콘
- **Font Loading**: Inter 폰트 최적화 로딩

### 📱 **Runtime Performance**

- **Framer Motion**: GPU 가속 애니메이션
- **Intersection Observer**: 뷰포트 기반 애니메이션
- **CSS-in-JS 최소화**: Tailwind CSS 활용

### 🔍 **Core Web Vitals**

```typescript
// 성능 지표 목표
LCP: < 2.5s    // Largest Contentful Paint
FID: < 100ms   // First Input Delay
CLS: < 0.1     // Cumulative Layout Shift
```

---

## 📈 SEO & 접근성

### 🔍 **SEO 최적화**

#### Meta Tags (app/layout.tsx)

```typescript
export const metadata: Metadata = {
  title: "김현중 | 풀스택 개발자 포트폴리오",
  description: "풀스택 개발자...",
  keywords: ["백엔드 개발자", "NodeJS", "AWS"],
  openGraph: {
    /* Open Graph 설정 */
  },
  twitter: {
    /* Twitter Cards 설정 */
  },
};
```

#### 구조화 데이터 (components/StructuredData.tsx)

```typescript
const structuredData = {
  "@context": "https://schema.org",
  "@type": "Person",
  name: "김현중",
  jobTitle: "백엔드 개발자",
  // ... 상세 정보
};
```

### ♿ **접근성 (WCAG 2.1 AA)**

```typescript
// 키보드 네비게이션
tabIndex={0}
onKeyDown={(e) => e.key === 'Enter' && onClick()}

// 스크린 리더 지원
aria-label="섹션 제목"
role="button"

// 색상 대비율
contrast-ratio: 4.5:1 (일반 텍스트)
contrast-ratio: 3:1 (큰 텍스트)
```

### 🌍 **다국어 지원 준비**

```typescript
// HTML lang 속성
<html lang="ko">

// 다국어 메타데이터
locale: "ko_KR"
alternates: { canonical: "/" }
```

---

## 🔧 커스터마이징 가이드

### 👤 **개인 정보 수정**

#### 1. 기본 정보 (app/layout.tsx)

```typescript
export const metadata: Metadata = {
  title: "당신의 이름 | 직업",
  description: "당신의 소개글",
  // ...
};
```

#### 2. 구조화 데이터 (components/StructuredData.tsx)

```typescript
const structuredData = {
  name: "당신의 이름",
  jobTitle: "당신의 직업",
  email: "your.email@example.com",
  // ...
};
```

### 🎨 **디자인 커스터마이징**

#### 색상 변경 (app/globals.css)

```css
:root {
  --blue-500: #3b82f6; /* 프라이머리 색상 */
  --purple-500: #8b5cf6; /* 보조 색상 */
  /* 원하는 색상으로 변경 */
}
```

#### 폰트 변경 (app/layout.tsx)

```typescript
import { Roboto } from "next/font/google";

const roboto = Roboto({
  weight: ["300", "400", "500", "700"],
  subsets: ["latin"],
});
```

### 📝 **콘텐츠 수정**

#### Hero 섹션 (components/sections/Hero.tsx)

```typescript
// 메인 타이틀 변경
<span className="block">Your</span>
<span className="bg-gradient-to-r from-blue-600 to-purple-600">Title</span>

// 기술 스택 배지 변경
const techStack = [
  { label: "Your Tech 1", icon: <YourIcon /> },
  { label: "Your Tech 2", icon: <YourIcon /> },
];
```

#### 프로젝트 데이터 (components/sections/Projects.tsx)

```typescript
const projects = [
  {
    title: "Your Project Name",
    subtitle: "Project Description",
    description: "Detailed description...",
    // ... 프로젝트 정보
  },
];
```

### 🚀 **배포 설정**

#### Vercel 배포

```bash
# Vercel CLI 설치
npm i -g vercel

# 배포
vercel --prod
```

#### 환경 변수 설정

```typescript
// next.config.ts
const nextConfig = {
  env: {
    CUSTOM_KEY: process.env.CUSTOM_KEY,
  },
};
```

---

## 📊 성능 모니터링

### 📈 **빌드 분석**

```bash
# 번들 크기 분석
npm run build
```

### 🔍 **성능 측정 도구**

- **Lighthouse**: Chrome DevTools
- **WebPageTest**: webpagetest.org
- **GTmetrix**: gtmetrix.com

### 📱 **모바일 성능 체크리스트**

- [ ] 3G 환경에서 3초 이내 로딩
- [ ] 터치 타겟 44px 이상
- [ ] 가로/세로 모드 모두 지원
- [ ] iOS Safari와 Chrome 호환성

---

## 🤝 기여 및 이슈

### 🐛 **버그 리포트**

Issues 탭에서 버그를 신고해주세요.

### 💡 **기능 제안**

새로운 기능 아이디어가 있다면 Discussion을 활용해주세요.

### 🔧 **개발 기여**

1. Fork 후 브랜치 생성
2. 변경사항 커밋
3. Pull Request 생성

---

## 📄 라이선스

```
MIT License

Copyright (c) 2024 김현중

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.
```

---

## 🙋‍♂️ 문의 및 지원

- **Email**: de0978@gmail.com
- **GitHub**: [@dev-thug](https://github.com/dev-thug)
- **LinkedIn**: [김현중](https://linkedin.com/in/hyunjoongkim)

---

<div align="center">

**Made with ❤️ by 김현중**

_Apple의 디자인 철학에서 영감을 받아 제작되었습니다._

[![GitHub stars](https://img.shields.io/github/stars/your-username/portfolio?style=social)](https://github.com/dev-thug/portfolio)
[![GitHub forks](https://img.shields.io/github/forks/your-username/portfolio?style=social)](https://github.com/dev-thug/portfolio)

</div>
