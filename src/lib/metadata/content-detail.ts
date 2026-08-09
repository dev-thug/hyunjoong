import type { Metadata } from "next";
import { SOCIAL_LINK_MAP } from "@/constants";
import type { Locale } from "@/i18n-config";
import {
  DEFAULT_OG_IMAGE,
  SITE_NAME,
  getSiteBaseUrl,
  toAbsoluteSiteUrl,
} from "@/lib/site-config";

type DetailSection = "blog" | "projects";
type OpenGraphType = "article" | "website";

interface BuildContentDetailMetadataOptions {
  lang: Locale;
  /**
   * Locale used to build the canonical URL. In every current call site this
   * equals `lang`, but the parameter is kept as a separate input so a future
   * caller can canonicalize a page to a different locale (for example, a
   * post only translated for one locale that should canonicalize there
   * regardless of the viewer's locale). If you find yourself always passing
   * `lang`, that's expected — do not collapse the API without auditing
   * every consumer.
   */
  canonicalLang: Locale;
  slug: string;
  section: DetailSection;
  title: string;
  description: string;
  availableLocales: Partial<Record<Locale, boolean>>;
  image?: string;
  openGraphType?: OpenGraphType;
  publishedTime?: string;
  noIndex?: boolean;
}

const toLocalePath = (lang: Locale, section: DetailSection, slug: string): string =>
  `/${lang}/${section}/${slug}`;

export const buildContentDetailMetadata = ({
  lang,
  canonicalLang,
  slug,
  section,
  title,
  description,
  availableLocales,
  image = DEFAULT_OG_IMAGE,
  openGraphType = "website",
  publishedTime,
  noIndex = false,
}: BuildContentDetailMetadataOptions): Metadata => {
  const baseUrl = getSiteBaseUrl();
  const canonicalPath = toLocalePath(canonicalLang, section, slug);
  const canonicalUrl = `${baseUrl}${canonicalPath}`;

  const languages: Record<string, string> = {};
  if (availableLocales.ko) {
    languages.ko = `${baseUrl}${toLocalePath("ko", section, slug)}`;
  }
  if (availableLocales.en) {
    languages.en = `${baseUrl}${toLocalePath("en", section, slug)}`;
  }
  if (availableLocales.ko) {
    languages["x-default"] = `${baseUrl}${toLocalePath("ko", section, slug)}`;
  } else if (availableLocales.en) {
    languages["x-default"] = `${baseUrl}${toLocalePath("en", section, slug)}`;
  }

  return {
    title,
    description,
    ...(noIndex ? { robots: { index: false, follow: false } as const } : {}),
    alternates: {
      canonical: canonicalUrl,
      languages,
    },
    openGraph: {
      title,
      description,
      url: canonicalUrl,
      siteName: SITE_NAME,
      type: openGraphType,
      ...(publishedTime ? { publishedTime } : {}),
      locale: lang === "ko" ? "ko_KR" : "en_US",
      images: [
        {
          url: image,
          alt: `${title} — ${SITE_NAME}`,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      creator: SOCIAL_LINK_MAP.x.handle,
      title,
      description,
      images: [image],
    },
    // Defensive: parent layout already sets metadataBase, but pinning it here
    // guarantees absolute URLs even if this helper is invoked from a route
    // that bypasses the root layout (e.g. a future opengraph-image.tsx).
    metadataBase: new URL(toAbsoluteSiteUrl("/")),
  };
};
