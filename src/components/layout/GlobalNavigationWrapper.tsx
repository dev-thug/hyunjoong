"use client";

import { useState, useEffect, useRef, useCallback } from "react";
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
  const rafIdRef = useRef<number | null>(null);
  const prevIsScrolledRef = useRef(false);

  useEffect(() => {
    const updateScrolledState = () => {
      rafIdRef.current = null;
      const nextIsScrolled = window.scrollY > SCROLL_THRESHOLD;
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
