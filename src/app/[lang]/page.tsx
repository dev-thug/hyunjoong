import { Suspense } from "react";
import type { Metadata } from "next";
import HomeLayoutWrapper from "@/components/layout/HomeLayoutWrapper";
import HeroSection from "@/components/sections/HeroSection";
import AboutSection from "@/components/sections/AboutSection";
import ProjectsSection from "@/components/sections/ProjectsSection";
import BlogSection from "@/components/sections/BlogSection";
import { SOCIAL_LINK_MAP } from "@/constants";
import { getPublicProfile } from "@/data/public-profile";
import { isSupportedLocale, type Locale } from "@/i18n-config";
import { getDictionary } from "@/get-dictionary";
import {
  DEFAULT_OG_IMAGE,
  SITE_NAME,
  getSiteBaseUrl,
} from "@/lib/site-config";
import { getDeveloperSearchMetadata } from "@/lib/metadata/developer-search";
import {
  buildSitePerson,
  buildWebsiteSchema,
  safeJsonLdStringify,
} from "@/lib/json-ld";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: string }>;
}): Promise<Metadata> {
  const { lang } = await params;

  if (!isSupportedLocale(lang)) {
    return {};
  }

  const searchMetadata = getDeveloperSearchMetadata(lang, "home");
  const profile = getPublicProfile(lang);
  const baseUrl = getSiteBaseUrl();

  return {
    title: { absolute: searchMetadata.title },
    description: searchMetadata.description,
    keywords: [...searchMetadata.keywords],
    alternates: {
      canonical: `${baseUrl}/${lang}`,
      languages: {
        ko: `${baseUrl}/ko`,
        en: `${baseUrl}/en`,
        "x-default": `${baseUrl}/ko`,
      },
    },
    openGraph: {
      type: "website",
      siteName: SITE_NAME,
      title: searchMetadata.title,
      description: searchMetadata.description,
      url: `${baseUrl}/${lang}`,
      locale: lang === "ko" ? "ko_KR" : "en_US",
      alternateLocale: lang === "ko" ? ["en_US"] : ["ko_KR"],
      images: [
        {
          url: DEFAULT_OG_IMAGE,
          alt: `${profile.name} — ${profile.jobTitle}`,
          width: 1200,
          height: 630,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      creator: SOCIAL_LINK_MAP.x.handle,
      title: searchMetadata.title,
      description: searchMetadata.description,
      images: [DEFAULT_OG_IMAGE],
    },
  };
}

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

  const websiteSchema = buildWebsiteSchema({ baseUrl });

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
