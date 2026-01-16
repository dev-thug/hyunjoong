import type { Metadata } from "next";
import { Inter, Montserrat } from "next/font/google";
import "./globals.css";
import GlobalNavigationWrapper from "@/components/layout/GlobalNavigationWrapper";

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

export const metadata: Metadata = {
  title: "Kim Hyun-joong | Full-stack Architect",
  description: "High-end portfolio for a Full-stack Engineer focusing on business impact and liquid visuals.",
};

export default async function RootLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ lang?: string; locale?: string }>;
}) {
  const { lang, locale } = await params;
  const currentLocale = lang || locale || "en";

  return (
    <html lang={currentLocale} className="dark">
      <body className={`${inter.variable} ${montserrat.variable}`}>
        <GlobalNavigationWrapper />
        {children}
      </body>
    </html>
  );
}
