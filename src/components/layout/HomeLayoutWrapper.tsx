'use client';

import { type ReactNode } from 'react';
import LiquidBackground from '@/components/LiquidBackground';
import { Footer } from '@/components/layout';

interface HomeLayoutWrapperProps {
  readonly children: ReactNode;
}

/**
 * 홈 페이지 클라이언트 래퍼
 * LiquidBackground와 Footer만 관리
 * 네비게이션은 전역 레이아웃에서 관리됨
 */
const HomeLayoutWrapper = ({ children }: HomeLayoutWrapperProps) => {
  return (
    <div className="relative min-h-screen text-white selection:bg-white selection:text-black">
      <LiquidBackground />

      {children}
      
      <Footer />
    </div>
  );
};

export default HomeLayoutWrapper;
