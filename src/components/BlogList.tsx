'use client';

import { useState } from 'react';
import { BLOG_POSTS } from '@/constants';
import { ArrowRight } from 'lucide-react';

/**
 * 블로그 포스트 목록 컴포넌트
 */
const BlogList = () => {
  const [hoveredSlug, setHoveredSlug] = useState<string | null>(null);

  const handleMouseEnter = (slug: string) => {
    setHoveredSlug(slug);
  };

  const handleMouseLeave = () => {
    setHoveredSlug(null);
  };

  const handleKeyDown = (event: React.KeyboardEvent) => {
    if (event.key === 'Enter' || event.key === ' ') {
      // Navigate to blog post
    }
  };

  return (
    <div className="w-full flex flex-col gap-4">
      <div className="flex justify-between items-end mb-8 border-b border-white/10 pb-4 px-4">
        <h4 className="text-xs font-mono text-gray-500 uppercase tracking-[0.2em]">Latest Intelligence</h4>
        <span className="text-xs font-mono text-gray-500">ARCHIVE</span>
      </div>

      <div className="space-y-2">
        {BLOG_POSTS.map((post, idx) => (
          <div 
            key={post.slug}
            onMouseEnter={() => handleMouseEnter(post.slug)}
            onMouseLeave={handleMouseLeave}
            onKeyDown={handleKeyDown}
            tabIndex={0}
            role="button"
            aria-label={`Read blog post: ${post.title}`}
            className="group relative rounded-xl transition-all duration-500 cursor-pointer p-8 border border-transparent hover:glass-panel hover:glass-interactive hover:bg-noise"
          >
            <div className="flex flex-col md:flex-row md:items-baseline justify-between gap-6 relative z-10">
                
              <div className="md:w-1/4 flex items-center gap-4 text-xs font-mono text-gray-500 group-hover:text-gray-400 transition-colors">
                <span>0{idx + 1}</span>
                <span className={`uppercase tracking-wider px-2 py-1 rounded border border-transparent ${
                  post.category === 'Business' ? 'group-hover:border-white/20 group-hover:text-white' : 'group-hover:border-gray-700'
                }`}>{post.category}</span>
              </div>

              <div className="md:w-1/2">
                <h3 className="text-3xl font-light font-montserrat text-white group-hover:text-white transition-colors">
                  {post.title}
                </h3>
                <div className={`grid transition-[grid-template-rows] duration-500 ease-in-out ${
                  hoveredSlug === post.slug ? 'grid-rows-[1fr] mt-4' : 'grid-rows-[0fr] mt-0'
                }`}>
                  <div className="overflow-hidden">
                    <p className="text-sm text-gray-400 max-w-lg leading-relaxed font-light border-l border-white/20 pl-4">
                      {post.excerpt}
                    </p>
                  </div>
                </div>
              </div>

              <div className="md:w-1/4 flex justify-end items-center">
                <div className="w-10 h-10 rounded-full border border-white/10 flex items-center justify-center opacity-0 -translate-x-4 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-500 bg-white/5">
                  <ArrowRight size={16} className="text-white" />
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default BlogList;
