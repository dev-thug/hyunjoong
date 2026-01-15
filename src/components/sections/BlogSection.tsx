import BlogList from '@/components/BlogList';

const BlogSection = () => {
  return (
    <section id="blog" className="py-32 relative z-10">
      <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black pointer-events-none" />
      <div className="w-full max-w-[1400px] mx-auto px-6 relative">
        <BlogList />
      </div>
    </section>
  );
};

export default BlogSection;
