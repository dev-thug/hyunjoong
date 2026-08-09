import type { Metadata } from "next";
import { SOCIAL_LINK_MAP } from "@/constants";
import type { Locale } from "@/i18n-config";
import {
  DEFAULT_OG_IMAGE,
  SITE_NAME,
  getSiteBaseUrl,
  toAbsoluteSiteUrl,
} from "@/lib/site-config";

type OpenGraphType = "website" | "profile" | "article";

interface BuildLocalizedPageMetadataOptions {
  lang: Locale;
  title: string;
  description: string;
  /**
   * Path under the locale segment (e.g. `/blog`, `/projects`).
   * Either `path` or `canonicalPath` must be provided; `canonicalPath`
   * is kept as an alias for backward compatibility with the
   * deprecated `buildBlogListingMetadata` helper.
   */
  path?: string;
  /** @deprecated Use `path`. Retained for backward compatibility. */
  canonicalPath?: string;
  openGraphType?: OpenGraphType;
  noIndex?: boolean;
  availableLocales?: Partial<Record<Locale, boolean>>;
}

export const buildLocalizedPageMetadata = ({
  lang,
  title,
  description,
  path,
  canonicalPath,
  openGraphType = "website",
  noIndex = false,
  availableLocales = { ko: true, en: true },
}: BuildLocalizedPageMetadataOptions): Metadata => {
  const baseUrl = getSiteBaseUrl();
  const rawPath = path ?? canonicalPath ?? "/blog";
  const normalizedPath = rawPath.startsWith("/") ? rawPath : `/${rawPath}`;
  const canonical = `${baseUrl}/${lang}${normalizedPath}`;
  const koUrl = `${baseUrl}/ko${normalizedPath}`;
  const enUrl = `${baseUrl}/en${normalizedPath}`;
  const locale = lang === "ko" ? "ko_KR" : "en_US";
  const languages: Record<string, string> = {};
  if (availableLocales.ko) {
    languages.ko = koUrl;
  }
  if (availableLocales.en) {
    languages.en = enUrl;
  }
  if (availableLocales.ko) {
    languages["x-default"] = koUrl;
  } else if (availableLocales.en) {
    languages["x-default"] = enUrl;
  }

  return {
    title,
    description,
    ...(noIndex ? { robots: { index: false, follow: true } as const } : {}),
    alternates: {
      canonical,
      languages,
    },
    openGraph: {
      title,
      description,
      url: canonical,
      siteName: SITE_NAME,
      type: openGraphType,
      locale,
      images: [
        {
          url: DEFAULT_OG_IMAGE,
          alt: `${title} — ${SITE_NAME}`,
          width: 1200,
          height: 630,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      creator: SOCIAL_LINK_MAP.x.handle,
      title,
      description,
      images: [DEFAULT_OG_IMAGE],
    },
    metadataBase: new URL(toAbsoluteSiteUrl("/")),
  };
};
