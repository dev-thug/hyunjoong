import type { Metadata } from "next";
import type { Locale } from "@/i18n-config";
import {
  DEFAULT_BASE_URL,
  DEFAULT_OG_IMAGE,
  SITE_NAME,
} from "@/lib/site-config";

interface BlogListingMetadataOptions {
  lang: Locale;
  title: string;
  description: string;
  noIndex?: boolean;
}

export const buildBlogListingMetadata = ({
  lang,
  title,
  description,
  noIndex = false,
}: BlogListingMetadataOptions): Metadata => {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || DEFAULT_BASE_URL;
  const canonicalUrl = `${baseUrl}/${lang}/blog`;
  const locale = lang === "ko" ? "ko_KR" : "en_US";

  return {
    title,
    description,
    ...(noIndex ? { robots: { index: false, follow: true } as const } : {}),
    alternates: {
      canonical: canonicalUrl,
      languages: {
        ko: `${baseUrl}/ko/blog`,
        en: `${baseUrl}/en/blog`,
        "x-default": `${baseUrl}/ko/blog`,
      },
    },
    openGraph: {
      title,
      description,
      url: canonicalUrl,
      siteName: SITE_NAME,
      type: "website",
      locale,
      images: [
        {
          url: DEFAULT_OG_IMAGE,
          alt: SITE_NAME,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [DEFAULT_OG_IMAGE],
    },
  };
};
