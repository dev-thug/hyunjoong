import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import StructuredData from "@/components/StructuredData";
import Script from "next/script";
import { GoogleAnalytics as GA } from "@next/third-parties/google";
import { Analytics } from "@vercel/analytics/next";
import ErrorBoundary from "@/components/ErrorBoundary";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
  themeColor: "#000000",
};

export const metadata: Metadata = {
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_SITE_URL ?? "https://hyunjoong.kim"
  ),
  alternates: { canonical: "/" },
  title: {
    default:
      "풀스택 개발자 포트폴리오 | 김현중 | NodeJS Python AWS 전문가 | 서울 개발자",
    template: "%s | 풀스택 개발자 김현중",
  },
  description:
    "풀스택 개발자 포트폴리오 - 김현중. 풀스택 개발 전문가로 NodeJS, Python, AWS 기반 4년 경력. 2000+ 유전체 분석 시스템 구축, 10만+ 사용자 서비스 경험. 서울 기반 풀스택 웹 개발자 채용 문의 환영.",
  keywords: [
    // 핵심 타겟 키워드 (검색량 높은 순)
    "풀스택 개발자 포트폴리오",
    "풀스택 개발",
    "풀스택 개발자",
    "개발자 포트폴리오",
    "풀스택 웹 개발",
    "풀스택 개발 포트폴리오",
    "풀스택 소프트웨어 개발",
    "풀스택 개발자 채용",
    "개발자 구인",
    "서울 개발자",
    "한국 개발자",
    "서울 풀스택 개발자",

    // 기술 스택 키워드
    "AWS 개발자",
    "NodeJS 개발자",
    "Python 개발자",
    "React 개발자",
    "Next.js 개발자",
    "AWS 개발자 포트폴리오",
    "NodeJS 개발자 포트폴리오",
    "Python 개발자 포트폴리오",

    // 클라우드 및 DevOps
    "클라우드 개발자",
    "DevOps 개발자",
    "Docker 개발자",
    "Kubernetes 개발자",
    "마이크로서비스 개발자",
    "서버리스 개발자",

    // 구체적 기술 키워드
    "AWS Amplify",
    "GraphQL 개발자",
    "DynamoDB 개발자",
    "Lambda 개발자",
    "Event Driven Architecture",
    "MSA 아키텍트",

    // 경력 및 경험
    "시니어 풀스택 개발자",
    "5년 경력 개발자",
    "유전체 분석 시스템",
    "대용량 트래픽 처리",
    "10만 사용자 서비스",

    // 산업별 키워드
    "헬스케어 개발자",
    "핀테크 개발자",
    "스타트업 개발자",
    "이커머스 개발자",
  ],
  openGraph: {
    title: "풀스택 개발자 포트폴리오 | 김현중 | NodeJS Python AWS 전문가",
    description:
      "풀스택 개발자 포트폴리오 - 김현중. 풀스택 개발 전문가로 NodeJS, Python, AWS 기반 4년 경력. 2000+ 유전체 분석 시스템 구축, 10만+ 사용자 서비스 경험. 서울 기반 풀스택 웹 개발자 채용 문의 환영.",
    url: "/",
    siteName: "풀스택 개발자 김현중 포트폴리오",
    images: [
      {
        url: "/images/og-profile.png",
        width: 1200,
        height: 630,
        alt: "풀스택 개발자 포트폴리오 - 김현중 | NodeJS Python AWS 전문가 | 서울 개발자",
      },
    ],
    locale: "ko_KR",
    type: "website",
    countryName: "South Korea",
  },
  twitter: {
    card: "summary_large_image",
    title: "풀스택 개발자 포트폴리오 | 김현중 | NodeJS Python AWS 전문가",
    description:
      "풀스택 개발자 포트폴리오 - 김현중. 풀스택 개발 전문가로 NodeJS, Python, AWS 기반 4년 경력. 2000+ 유전체 분석 시스템 구축, 10만+ 사용자 서비스 경험. 서울 기반 풀스택 웹 개발자 채용 문의 환영.",
    images: ["/images/og-profile.png"],
    creator: "@dev_thug",
    site: "@dev_thug",
  },
  robots: {
    index: true,
    follow: true,
    nocache: false,
    googleBot: {
      index: true,
      follow: true,
      noimageindex: false,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  // verification codes intentionally omitted (were placeholder values).
  // Add real verification IDs via env vars + generateMetadata if needed for Search Console etc.
  appleWebApp: {
    capable: true,
    title: "김현중 풀스택 개발자 포트폴리오",
    statusBarStyle: "black-translucent",
  },
  applicationName: "김현중 풀스택 개발자 포트폴리오",
  referrer: "origin-when-cross-origin",
  formatDetection: { telephone: true, email: true, address: true },
  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "48x48" },
      { url: "/favicon.svg", type: "image/svg+xml" },
      { url: "/favicon-96x96.png", sizes: "96x96", type: "image/png" },
    ],
    apple: [{ url: "/apple-touch-icon.png", sizes: "180x180", type: "image/png" }],
    shortcut: ["/favicon.ico"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko" className="scroll-smooth" suppressHydrationWarning>
      <head>
        <StructuredData />
        {/* PWA manifest is now served automatically via app/manifest.ts (Next.js App Router) */}
      </head>
      <body className={`${inter.variable} font-sans antialiased`}>
        {/* Google AdSense loader - only included when NEXT_PUBLIC_ADSENSE_CLIENT is set.
            Prevents hardcoded sensitive AdSense publisher ID in source. */}
        {process.env.NEXT_PUBLIC_ADSENSE_CLIENT && (
          <Script
            async
            src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${process.env.NEXT_PUBLIC_ADSENSE_CLIENT}`}
            crossOrigin="anonymous"
            strategy="afterInteractive"
          />
        )}
        {/* GA4 via official integration - only when NEXT_PUBLIC_GA_ID set (no hardcoded fallback) */}
        {process.env.NEXT_PUBLIC_GA_ID && <GA gaId={process.env.NEXT_PUBLIC_GA_ID} />}
        <Analytics />
        <ErrorBoundary>{children}</ErrorBoundary>
      </body>
    </html>
  );
}
