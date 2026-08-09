import GlobalNavigationWrapper from "@/components/layout/GlobalNavigationWrapper";
import { SOCIAL_LINK_MAP } from "@/constants";
import { getPublicProfile } from "@/data/public-profile";
import { i18n, isSupportedLocale } from "@/i18n-config";
import { getDictionary } from "@/get-dictionary";
import {
  DEFAULT_OG_IMAGE,
  SITE_NAME,
  getSiteBaseUrl,
} from "@/lib/site-config";
import type { Metadata, Viewport } from "next";
import { Inter, Montserrat, Noto_Sans_KR } from "next/font/google";
import { notFound } from "next/navigation";
import "../globals.css";

import { SpeedInsights } from "@vercel/speed-insights/next";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  weight: ["300", "400", "600"],
});

const montserrat = Montserrat({
  variable: "--font-montserrat",
  subsets: ["latin"],
  weight: ["300", "400", "500", "700", "900"],
});

const notoSansKr = Noto_Sans_KR({
  variable: "--font-noto-sans-kr",
  subsets: ["latin"],
  display: "swap",
});

export async function generateStaticParams() {
  return i18n.locales.map((locale) => ({ lang: locale }));
}

export const viewport: Viewport = {
  themeColor: "#050505",
  width: "device-width",
  initialScale: 1,
};

export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: string }>;
}): Promise<Metadata> {
  const { lang } = await params;
  if (!isSupportedLocale(lang)) {
    notFound();
  }
  const dict = await getDictionary(lang);
  const profile = getPublicProfile(lang);

  const baseUrl = getSiteBaseUrl();

  return {
    title: {
      template: dict.hero.meta_title_template,
      default: dict.hero.meta_title,
    },
    description: dict.hero.meta_description,
    authors: [{ name: profile.name, url: `${baseUrl}/${lang}/profile` }],
    creator: profile.name,
    publisher: profile.name,
    category: "technology",
    metadataBase: new URL(baseUrl),
    icons: {
      icon: [
        { url: "/images/favicon.svg", type: "image/svg+xml", sizes: "any" },
        { url: "/images/favicon-96x96.png", type: "image/png", sizes: "96x96" },
        { url: "/images/favicon.ico", type: "image/x-icon", sizes: "any" },
      ],
      apple: [
        {
          url: "/images/apple-touch-icon.png",
          type: "image/png",
          sizes: "180x180",
        },
      ],
    },
    manifest: "/images/site.webmanifest",
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
      title: dict.hero.meta_title,
      description: dict.hero.meta_description,
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
      title: dict.hero.meta_title,
      description: dict.hero.meta_description,
      images: [DEFAULT_OG_IMAGE],
    },
  };
}

export default async function LangLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;
  if (!isSupportedLocale(lang)) {
    notFound();
  }

  return (
    <html lang={lang} className="dark" suppressHydrationWarning>
      <body
        className={`${inter.variable} ${montserrat.variable} ${notoSansKr.variable} antialiased`}
      >
        <GlobalNavigationWrapper lang={lang} />
        {children}
        <SpeedInsights />
      </body>
    </html>
  );
}
