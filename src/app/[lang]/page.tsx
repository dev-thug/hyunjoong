import { Suspense } from "react";
import dynamic from "next/dynamic";
import HomeLayoutWrapper from "@/components/layout/HomeLayoutWrapper";
import HeroSection from "@/components/sections/HeroSection";
import { type Locale } from "@/i18n-config";
import { getDictionary } from "@/get-dictionary";
import {
  DEFAULT_OG_IMAGE,
  SITE_NAME,
  getSiteBaseUrl,
  toAbsoluteSiteUrl,
} from "@/lib/site-config";
import { buildSitePerson, safeJsonLdStringify } from "@/lib/json-ld";

// 초기 로딩에 필수적이지 않은 하단 섹션들을 dynamic import로 분리하여 번들 크기 최적화
const AboutSection = dynamic(
  () => import("@/components/sections/AboutSection")
);
const ProjectsSection = dynamic(
  () => import("@/components/sections/ProjectsSection")
);
const BlogSection = dynamic(() => import("@/components/sections/BlogSection"));

/**
 * 홈 페이지 (서버 컴포넌트)
 * BlogSection에서 fs를 사용하여 MDX 파일을 읽으므로 서버 컴포넌트여야 함
 */
export default async function Home({
  params,
}: {
  params: Promise<{ lang: string }>;
}) {
  const { lang } = (await params) as { lang: Locale };
  const dict = await getDictionary(lang);

  const baseUrl = getSiteBaseUrl();

  const personSchema = {
    "@context": "https://schema.org",
    ...buildSitePerson(baseUrl),
    alternateName: lang === "ko" ? "김현중" : "Hyunjoong Kim",
    jobTitle: "Full-Stack Developer",
    description: dict.hero.meta_description,
    image: toAbsoluteSiteUrl(DEFAULT_OG_IMAGE),
    sameAs: [
      "https://github.com/hyunjoongkim",
      "https://linkedin.com/in/hyunjoongkim",
    ],
  };

  const websiteSchema = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: dict.hero.meta_title,
    description: dict.hero.meta_description,
    url: `${baseUrl}/${lang}`,
    author: {
      "@type": "Person",
      name: SITE_NAME,
    },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: safeJsonLdStringify(personSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: safeJsonLdStringify(websiteSchema) }}
      />
      <HomeLayoutWrapper>
        {/* LCP 요소: 즉시 렌더링 */}
        <HeroSection dict={dict} />

        {/* 하단 섹션들: 필요한 시점에 로드 */}
        <AboutSection dict={dict} />
        <ProjectsSection dict={dict} lang={lang} />

        {/* 서버 컴포넌트 스트리밍: 데이터 읽기 중에도 상단 콘텐츠 즉시 노출 가능 */}
        <Suspense
          fallback={<div className="h-96 w-full animate-pulse bg-white/5" />}
        >
          <BlogSection lang={lang} />
        </Suspense>
      </HomeLayoutWrapper>
    </>
  );
}
