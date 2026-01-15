import type { ReactNode } from 'react';

interface ProfileLayoutProps {
  readonly children: ReactNode;
}

/**
 * 프로필 레이아웃
 * 블로그/프로젝트와 일관된 스타일 적용
 */
export default function ProfileLayout({ children }: ProfileLayoutProps) {
  return (
    <div className="min-h-screen bg-[#050505] text-white pt-32 pb-20">
      <div className="w-full max-w-[1200px] mx-auto px-4 md:px-6">
        {children}
      </div>
    </div>
  );
}
