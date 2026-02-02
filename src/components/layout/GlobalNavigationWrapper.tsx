"use client";

import { useState, useEffect } from "react";
import Navigation from "@/components/layout/Navigation";
import { SCROLL_THRESHOLD } from "@/constants";

interface GlobalNavigationWrapperProps {
  readonly lang: string;
}

/**
 * 전역 네비게이션 래퍼
 * 모든 페이지에서 동일한 네비게이션과 이벤트 효과 제공
 */
const GlobalNavigationWrapper = ({ lang }: GlobalNavigationWrapperProps) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > SCROLL_THRESHOLD);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleToggleMobileMenu = () => {
    setIsMobileMenuOpen((prev) => !prev);
  };

  return (
    <Navigation
      isScrolled={isScrolled}
      isMobileMenuOpen={isMobileMenuOpen}
      onToggleMobileMenu={handleToggleMobileMenu}
      lang={lang}
    />
  );
};

export default GlobalNavigationWrapper;
