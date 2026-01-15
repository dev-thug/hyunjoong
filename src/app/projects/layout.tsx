import type { ReactNode } from 'react';

interface ProjectsLayoutProps {
  readonly children: ReactNode;
}

/**
 * 프로젝트 레이아웃
 * 프로젝트 목록 및 상세 페이지 공통 래퍼
 */
export default function ProjectsLayout({ children }: ProjectsLayoutProps) {
  return (
    <div className="min-h-screen bg-[#050505] text-white pt-32 pb-20">
      <div className="w-full max-w-[1200px] mx-auto px-6">
        {children}
      </div>
    </div>
  );
}
