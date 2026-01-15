'use client';

import { useState, useEffect, type ReactNode } from 'react';
import LiquidBackground from '@/components/LiquidBackground';
import { Navigation, Footer } from '@/components/layout';
import { SCROLL_THRESHOLD } from '@/constants';

interface HomeLayoutWrapperProps {
  readonly children: ReactNode;
}

/**
 * 홈 페이지 클라이언트 래퍼
 * 스크롤 상태 및 모바일 메뉴 상태 관리
 */
const HomeLayoutWrapper = ({ children }: HomeLayoutWrapperProps) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > SCROLL_THRESHOLD);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleToggleMobileMenu = () => {
    setIsMobileMenuOpen((prev) => !prev);
  };

  return (
    <div className="relative min-h-screen text-white selection:bg-white selection:text-black">
      <LiquidBackground />
      
      <Navigation
        isScrolled={isScrolled}
        isMobileMenuOpen={isMobileMenuOpen}
        onToggleMobileMenu={handleToggleMobileMenu}
      />

      {children}
      
      <Footer />
    </div>
  );
};

export default HomeLayoutWrapper;
