import { Suspense } from "react";
import HomeLayoutWrapper from "@/components/layout/HomeLayoutWrapper";
import HeroSection from "@/components/sections/HeroSection";
import AboutSection from "@/components/sections/AboutSection";
import ProjectsSection from "@/components/sections/ProjectsSection";
import BlogSection from "@/components/sections/BlogSection";
import { type Locale } from "@/i18n-config";
import { getDictionary } from "@/get-dictionary";
import { getSiteBaseUrl } from "@/lib/site-config";
import {
  buildSitePerson,
  buildWebsiteSchema,
  safeJsonLdStringify,
} from "@/lib/json-ld";

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
    ...buildSitePerson(baseUrl, lang),
  };

  const websiteSchema = buildWebsiteSchema({
    baseUrl,
    lang,
    title: dict.hero.meta_title,
    description: dict.hero.meta_description,
  });

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
      <HomeLayoutWrapper lang={lang}>
        {/* LCP 요소: 즉시 렌더링 */}
        <HeroSection dict={dict} />

        <AboutSection dict={dict} />

        {/* 서버 컴포넌트 스트리밍: 파일 I/O 중에도 상단 콘텐츠가 먼저 노출됩니다. */}
        <Suspense
          fallback={<div className="h-96 w-full animate-pulse bg-white/5" />}
        >
          <ProjectsSection dict={dict} lang={lang} />
        </Suspense>
        <Suspense
          fallback={<div className="h-96 w-full animate-pulse bg-white/5" />}
        >
          <BlogSection lang={lang} />
        </Suspense>
      </HomeLayoutWrapper>
    </>
  );
}
