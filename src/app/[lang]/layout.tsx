import GlobalNavigationWrapper from "@/components/layout/GlobalNavigationWrapper";
import { i18n, type Locale } from "@/i18n-config";
import { getDictionary } from "@/get-dictionary";
import {
  DEFAULT_OG_IMAGE,
  SITE_NAME,
  getSiteBaseUrl,
} from "@/lib/site-config";
import type { Metadata } from "next";
import { Inter, Montserrat } from "next/font/google";
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

export async function generateStaticParams() {
  return i18n.locales.map((locale) => ({ lang: locale }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: string }>;
}): Promise<Metadata> {
  const { lang } = (await params) as { lang: Locale };
  const dict = await getDictionary(lang);

  const baseUrl = getSiteBaseUrl();

  return {
    title: {
      template: dict.hero.meta_title_template,
      default: dict.hero.meta_title,
    },
    description: dict.hero.meta_description,
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
      siteName: SITE_NAME,
      title: dict.hero.meta_title,
      description: dict.hero.meta_description,
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
  const { lang } = (await params) as { lang: Locale };

  return (
    <html lang={lang} className="dark" suppressHydrationWarning>
      <body className={`${inter.variable} ${montserrat.variable} antialiased`}>
        <GlobalNavigationWrapper lang={lang} />
        {children}
        <SpeedInsights />
      </body>
    </html>
  );
}
