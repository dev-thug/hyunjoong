'use client';

import { useState, useEffect } from 'react';
import LiquidBackground from '@/components/LiquidBackground';
import { Navigation, Footer } from '@/components/layout';
import {
  HeroSection,
  AboutSection,
  ProjectsSection,
  BlogSection,
} from '@/components/sections';
import { SCROLL_THRESHOLD } from '@/constants';

/**
 * 홈 페이지 컴포넌트
 */
export default function Home() {
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

      <HeroSection />
      <AboutSection />
      <ProjectsSection />
      <BlogSection />
      <Footer />
    </div>
  );
}
