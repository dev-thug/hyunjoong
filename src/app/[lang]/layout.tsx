import GlobalNavigationWrapper from "@/components/layout/GlobalNavigationWrapper";
import { i18n, type Locale } from "@/i18n-config";
import { getDictionary } from "@/get-dictionary";
import type { Metadata } from "next";
import { Inter, Montserrat } from "next/font/google";
import "../globals.css";

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

  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "https://hyunjoong.com";

  return {
    title: {
      template: `%s | ${dict.hero.architecture}`,
      default: `${dict.hero.title_beyond} ${dict.hero.title_code} | ${dict.hero.architecture}`,
    },
    description: dict.hero.role_description,
    alternates: {
      canonical: `${baseUrl}/${lang}`,
      languages: {
        ko: `${baseUrl}/ko`,
        en: `${baseUrl}/en`,
        "x-default": `${baseUrl}/ko`,
      },
    },
    metadataBase: new URL(baseUrl),
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
  const dict = await getDictionary(lang);

  return (
    <html lang={lang} className="dark" suppressHydrationWarning>
      <body className={`${inter.variable} ${montserrat.variable} antialiased`}>
        <GlobalNavigationWrapper dict={dict} lang={lang} />
        {children}
      </body>
    </html>
  );
}
