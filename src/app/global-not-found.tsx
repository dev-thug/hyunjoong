import "./globals.css";
import { headers } from "next/headers";
import type { Metadata } from "next";
import { Inter, Montserrat, Noto_Sans_KR } from "next/font/google";
import LocalizedNotFound from "@/components/layout/LocalizedNotFound";
import { buildNotFoundMetadata } from "@/lib/metadata/not-found";
import { getRequestLocale } from "@/lib/request-locale";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

const montserrat = Montserrat({
  variable: "--font-montserrat",
  subsets: ["latin"],
  display: "swap",
});

const notoSansKr = Noto_Sans_KR({
  variable: "--font-noto-sans-kr",
  subsets: ["latin"],
  weight: ["400"],
  display: "swap",
  preload: false,
});

const getNotFoundLocale = async () => getRequestLocale(await headers());

export async function generateMetadata(): Promise<Metadata> {
  const locale = await getNotFoundLocale();

  return {
    ...buildNotFoundMetadata(),
    title:
      locale === "en"
        ? "Page Not Found | Hyunjoong Kim"
        : "페이지를 찾을 수 없습니다 | 김현중",
  };
}

/**
 * Standalone unmatched-route boundary. It intentionally owns html/body because
 * global-not-found bypasses route layouts; locale comes from the proxy-injected
 * request header rather than an untrusted client pathname.
 */
export default async function GlobalNotFound() {
  const locale = await getNotFoundLocale();

  return (
    <html
      lang={locale}
      className={`${inter.variable} ${montserrat.variable} ${notoSansKr.variable}`}
    >
      <body>
        <LocalizedNotFound locale={locale} />
      </body>
    </html>
  );
}
