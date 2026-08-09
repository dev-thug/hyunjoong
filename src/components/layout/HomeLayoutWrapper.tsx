import { type ReactNode } from "react";
import Footer from "@/components/layout/Footer";
import LiquidBackgroundLoader from "@/components/layout/LiquidBackgroundLoader";
import type { Locale } from "@/i18n-config";

interface HomeLayoutWrapperProps {
  readonly children: ReactNode;
  readonly lang: Locale;
}

/**
 * 홈 페이지 서버 래퍼
 * LiquidBackground(클라이언트 로더)와 Footer만 관리한다.
 * 네비게이션은 전역 레이아웃에서 관리된다.
 */
const HomeLayoutWrapper = ({ children, lang }: HomeLayoutWrapperProps) => (
  <div className="relative min-h-screen text-white selection:bg-white selection:text-black">
    <LiquidBackgroundLoader />

    <main>{children}</main>

    <Footer lang={lang} />
  </div>
);

export default HomeLayoutWrapper;
