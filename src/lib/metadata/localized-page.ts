import type { Metadata } from "next";
import type { Locale } from "@/i18n-config";
import { DEFAULT_BASE_URL, DEFAULT_OG_IMAGE, SITE_NAME } from "@/lib/site-config";

interface BuildLocalizedPageMetadataOptions {
  lang: Locale;
  path: string;
  title: string;
  description: string;
  openGraphType?: "website" | "profile";
}

export const buildLocalizedPageMetadata = ({
  lang,
  path,
  title,
  description,
  openGraphType = "website",
}: BuildLocalizedPageMetadataOptions): Metadata => {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || DEFAULT_BASE_URL;
  const normalizedPath = path.startsWith("/") ? path : `/${path}`;
  const canonical = `${baseUrl}/${lang}${normalizedPath}`;
  const koUrl = `${baseUrl}/ko${normalizedPath}`;
  const enUrl = `${baseUrl}/en${normalizedPath}`;

  return {
    title,
    description,
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
      locale: lang === "ko" ? "ko_KR" : "en_US",
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
