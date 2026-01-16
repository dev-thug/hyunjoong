import BlogList from '@/components/BlogList';
import { getAllPosts } from '@/lib/posts';

/**
 * 블로그 섹션 컴포넌트
 * 메인 페이지에서 최신 블로그 포스트 표시
 */
const BlogSection = async () => {
  const posts = await getAllPosts();

  return (
    <section id="blog" className="py-16 md:py-24 lg:py-32 relative z-10">
      <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black pointer-events-none" />
      <div className="w-full max-w-[1400px] mx-auto px-4 md:px-6 relative">
        <BlogList posts={posts} />
      </div>
    </section>
  );
};

export default BlogSection;

