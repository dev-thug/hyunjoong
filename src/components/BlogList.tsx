'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import type { PostMetadata } from '@/types';

interface BlogListProps {
  readonly posts: PostMetadata[];
  readonly lang: string;
}

/**
 * 블로그 포스트 목록 컴포넌트
 */
const BlogList = ({ posts, lang }: BlogListProps) => {
  const [hoveredSlug, setHoveredSlug] = useState<string | null>(null);

  const handleMouseEnter = (slug: string) => {
    setHoveredSlug(slug);
  };

  const handleMouseLeave = () => {
    setHoveredSlug(null);
  };

  return (
    <div className="w-full flex flex-col gap-3 md:gap-4">
      <div className="flex justify-between items-end mb-6 md:mb-8 border-b border-white/10 pb-3 md:pb-4 px-2 md:px-4">
        <h4 className="text-[10px] md:text-xs font-mono text-gray-500 uppercase tracking-[0.15em] md:tracking-[0.2em]">Latest Intelligence</h4>
        <Link
          href={`/${lang}/blog`}
          className="text-[10px] md:text-xs font-mono text-gray-500 hover:text-white transition-colors"
          tabIndex={0}
          aria-label="View all blog posts"
        >
          ARCHIVE
        </Link>
      </div>

      <div className="space-y-2">
        {posts.map((post, idx) => (
          <Link
            key={post.slug}
            href={`/${lang}/blog/${post.slug}`}
            onMouseEnter={() => handleMouseEnter(post.slug)}
            onMouseLeave={handleMouseLeave}
            className="group relative rounded-lg md:rounded-xl transition-all duration-500 cursor-pointer p-4 md:p-6 lg:p-8 border border-transparent hover:glass-panel hover:glass-interactive hover:bg-noise block"
            tabIndex={0}
            aria-label={`Read blog post: ${post.title}`}
          >
            <div className="flex flex-col gap-3 md:gap-4 lg:flex-row lg:items-baseline lg:justify-between lg:gap-6 relative z-10">
                
              {/* 메타 정보 */}
              <div className="lg:w-1/4 flex items-center gap-2 md:gap-4 text-[10px] md:text-xs font-mono text-gray-500 group-hover:text-gray-400 transition-colors">
                <span>0{idx + 1}</span>
                <span className={`uppercase tracking-wider px-1.5 md:px-2 py-0.5 md:py-1 rounded border border-transparent ${
                  post.category === 'Business' ? 'group-hover:border-white/20 group-hover:text-white' : 'group-hover:border-gray-700'
                }`}>{post.category}</span>
              </div>

              {/* 타이틀 & 설명 */}
              <div className="lg:w-1/2">
                <h3 className="text-lg md:text-2xl lg:text-3xl font-light font-montserrat text-white group-hover:text-white transition-colors leading-snug">
                  {post.title}
                </h3>
                {/* 모바일에서는 항상 표시, 데스크톱에서는 호버 시 표시 */}
                <div className={`mt-2 md:mt-0 md:grid md:transition-[grid-template-rows] md:duration-500 md:ease-in-out ${
                  hoveredSlug === post.slug ? 'md:grid-rows-[1fr] md:mt-4' : 'md:grid-rows-[0fr]'
                }`}>
                  <div className="md:overflow-hidden">
                    <p className="text-xs md:text-sm text-gray-400 max-w-lg leading-relaxed font-light border-l border-white/20 pl-3 md:pl-4">
                      {post.excerpt}
                    </p>
                  </div>
                </div>
              </div>

              {/* 화살표 버튼 */}
              <div className="lg:w-1/4 flex justify-end items-center">
                <div className="w-8 h-8 md:w-10 md:h-10 rounded-full border border-white/10 flex items-center justify-center opacity-100 lg:opacity-0 lg:-translate-x-4 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-500 bg-white/5">
                  <ArrowRight size={14} className="md:w-4 md:h-4 text-white" />
                </div>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default BlogList;

