import type { Metadata } from "next";
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
}

export const buildLocalizedPageMetadata = ({
  lang,
  title,
  description,
  path,
  canonicalPath,
  openGraphType = "website",
  noIndex = false,
}: BuildLocalizedPageMetadataOptions): Metadata => {
  const baseUrl = getSiteBaseUrl();
  const rawPath = path ?? canonicalPath ?? "/blog";
  const normalizedPath = rawPath.startsWith("/") ? rawPath : `/${rawPath}`;
  const canonical = `${baseUrl}/${lang}${normalizedPath}`;
  const koUrl = `${baseUrl}/ko${normalizedPath}`;
  const enUrl = `${baseUrl}/en${normalizedPath}`;
  const locale = lang === "ko" ? "ko_KR" : "en_US";

  return {
    title,
    description,
    ...(noIndex ? { robots: { index: false, follow: true } as const } : {}),
    alternates: {
      canonical,
      languages: {
        ko: koUrl,
        en: enUrl,
        "x-default": koUrl,
      },
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
    metadataBase: new URL(toAbsoluteSiteUrl("/")),
  };
};
