"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import Navigation from "@/components/layout/Navigation";
import { SCROLL_THRESHOLD_PX, type NavLabels } from "@/constants";
import type { Locale } from "@/i18n-config";

interface GlobalNavigationClientProps {
  readonly lang: Locale;
  readonly navLabels: NavLabels;
}

/**
 * 클라이언트 네비게이션 상태 컨테이너
 * 스크롤 상태와 모바일 메뉴 오픈 상태를 관리한다.
 */
const GlobalNavigationClient = ({
  lang,
  navLabels,
}: GlobalNavigationClientProps) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const rafIdRef = useRef<number | null>(null);
  const prevIsScrolledRef = useRef(false);

  useEffect(() => {
    const updateScrolledState = () => {
      rafIdRef.current = null;
      const nextIsScrolled = window.scrollY > SCROLL_THRESHOLD_PX;
      if (nextIsScrolled === prevIsScrolledRef.current) {
        return;
      }
      prevIsScrolledRef.current = nextIsScrolled;
      setIsScrolled(nextIsScrolled);
    };

    const handleScroll = () => {
      if (rafIdRef.current !== null) {
        return;
      }
      rafIdRef.current = window.requestAnimationFrame(updateScrolledState);
    };

    updateScrolledState();
    window.addEventListener("scroll", handleScroll, { passive: true });

    return () => {
      window.removeEventListener("scroll", handleScroll);
      if (rafIdRef.current !== null) {
        window.cancelAnimationFrame(rafIdRef.current);
      }
    };
  }, []);

  const handleToggleMobileMenu = useCallback(() => {
    setIsMobileMenuOpen((prev) => !prev);
  }, []);

  const handleCloseMobileMenu = useCallback(() => {
    setIsMobileMenuOpen(false);
  }, []);

  return (
    <Navigation
      isScrolled={isScrolled}
      isMobileMenuOpen={isMobileMenuOpen}
      onToggleMobileMenu={handleToggleMobileMenu}
      onCloseMobileMenu={handleCloseMobileMenu}
      lang={lang}
      navLabels={navLabels}
    />
  );
};

export default GlobalNavigationClient;
