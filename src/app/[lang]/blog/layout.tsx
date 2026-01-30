import type { ReactNode } from 'react';

interface BlogLayoutProps {
  readonly children: ReactNode;
}

/**
 * 블로그 레이아웃
 * prose 스타일 적용 및 공통 래퍼
 */
export default function BlogLayout({ children }: BlogLayoutProps) {
  return (
    <div className="min-h-screen bg-[#050505] text-white pt-32 pb-20">
      <div className="w-full max-w-[1200px] mx-auto px-4 md:px-6">
        {children}
      </div>
    </div>
  );
}
