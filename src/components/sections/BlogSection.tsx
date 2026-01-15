import BlogList from '@/components/BlogList';
import { getAllPosts } from '@/lib/posts';

/**
 * 블로그 섹션 컴포넌트
 * 메인 페이지에서 최신 블로그 포스트 표시
 */
const BlogSection = () => {
  const posts = getAllPosts();

  return (
    <section id="blog" className="py-32 relative z-10">
      <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black pointer-events-none" />
      <div className="w-full max-w-[1400px] mx-auto px-6 relative">
        <BlogList posts={posts} />
      </div>
    </section>
  );
};

export default BlogSection;
