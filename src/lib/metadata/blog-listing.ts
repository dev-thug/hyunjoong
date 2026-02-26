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
  noIndexFollow?: boolean;
  canonicalPath?: string;
}

export const buildBlogListingMetadata = ({
  lang,
  title,
  description,
  noIndex = false,
  noIndexFollow = false,
  canonicalPath = "/blog",
}: BlogListingMetadataOptions): Metadata => {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || DEFAULT_BASE_URL;
  const normalizedCanonicalPath = canonicalPath.startsWith("/")
    ? canonicalPath
    : `/${canonicalPath}`;
  const canonicalUrl = `${baseUrl}/${lang}${normalizedCanonicalPath}`;
  const koUrl = `${baseUrl}/ko${normalizedCanonicalPath}`;
  const enUrl = `${baseUrl}/en${normalizedCanonicalPath}`;
  const locale = lang === "ko" ? "ko_KR" : "en_US";

  return {
    title,
    description,
    ...(noIndex
      ? { robots: { index: false, follow: noIndexFollow } as const }
      : {}),
    alternates: {
      canonical: canonicalUrl,
      languages: {
        ko: koUrl,
        en: enUrl,
        "x-default": koUrl,
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
