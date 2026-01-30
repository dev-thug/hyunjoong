import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getPostBySlug, generatePostParams, getAllPosts } from '@/lib/posts';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import type { Metadata } from 'next';

interface BlogPostPageProps {
  params: Promise<{ lang: string; slug: string }>;
}

/**
 * 정적 페이지 생성을 위한 슬러그 목록
 */
export async function generateStaticParams() {
  const params = await generatePostParams();
  // Add lang to params if needed by Next.js i18n routing
  return params;
}

/**
 * 동적 메타데이터 생성
 */
export async function generateMetadata({ params }: BlogPostPageProps): Promise<Metadata> {
  const { lang, slug } = await params;
  const post = await getPostBySlug(slug, lang);
  
  if (!post) {
    return { title: 'Post Not Found' };
  }

  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "https://hyunjoong.com";
  
  // 다국어 버전 확인 (hreflang 설정을 위해)
  const [koPost, enPost] = await Promise.all([
    getPostBySlug(slug, 'ko'),
    getPostBySlug(slug, 'en'),
  ]);

  const languages: Record<string, string> = {};
  if (koPost) languages.ko = `${baseUrl}/ko/blog/${slug}`;
  if (enPost) languages.en = `${baseUrl}/en/blog/${slug}`;
  if (koPost) languages['x-default'] = `${baseUrl}/ko/blog/${slug}`;

  return {
    title: post.title,
    description: post.excerpt,
    alternates: {
      canonical: `${baseUrl}/${lang}/blog/${slug}`,
      languages,
    },
    openGraph: {
      title: post.title,
      description: post.excerpt,
      url: `${baseUrl}/${lang}/blog/${slug}`,
      type: 'article',
      publishedTime: post.date,
      locale: lang === 'ko' ? 'ko_KR' : 'en_US',
    },
    twitter: {
      card: 'summary_large_image',
      title: post.title,
      description: post.excerpt,
    },
  };
}

/**
 * 블로그 포스트 상세 페이지
 */
export default async function BlogPostPage({ params }: BlogPostPageProps) {
  const { lang, slug } = await params;
  
  // 데이터 페칭 병렬화 (Parallel Data Fetching)
  const [post, allPosts] = await Promise.all([
    getPostBySlug(slug, lang),
    getAllPosts(lang)
  ]);
  
  if (!post) {
    notFound();
  }

  const currentIndex = allPosts.findIndex((p) => p.slug === slug);
  const prevPost = currentIndex < allPosts.length - 1 ? allPosts[currentIndex + 1] : null;
  const nextPost = currentIndex > 0 ? allPosts[currentIndex - 1] : null;

  // MDX 컴포넌트 동적 import
  const { default: PostContent } = await import(`@/content/posts/${slug}.${lang}.mdx`);

  return (
    <article className="max-w-[85ch] mx-auto w-full">
      {/* 헤더 */}
      <header className="mb-12">
        <Link
          href={`/${lang}/blog`}
          className="inline-flex items-center gap-2 text-gray-400 hover:text-white transition-colors mb-8"
          tabIndex={0}
          aria-label="Go back to blog list"
        >
          <ArrowLeft size={16} />
          <span className="text-sm font-mono uppercase tracking-widest">Back to Blog</span>
        </Link>

        <div className="flex items-center gap-4 mb-4">
          <span className={`text-xs font-mono uppercase tracking-wider px-3 py-1 rounded-full ${
            post.category === 'Business'
              ? 'bg-green-500/10 text-green-400 border border-green-500/30'
              : post.category === 'Engineering'
              ? 'bg-blue-500/10 text-blue-400 border border-blue-500/30'
              : 'bg-purple-500/10 text-purple-400 border border-purple-500/30'
          }`}>
            {post.category}
          </span>
          <span className="text-sm text-gray-500 font-mono">
            {post.date} · {post.readTime} read
          </span>
        </div>

        <h1 className="text-4xl md:text-5xl font-bold font-montserrat text-white leading-tight">
          {post.title}
        </h1>
        
        <p className="text-xl text-gray-400 mt-4 leading-relaxed">
          {post.excerpt}
        </p>

        <hr className="border-gray-800 mt-8" />
      </header>

      {/* 본문 */}
      <div className="prose-custom">
        <PostContent />
      </div>

      {/* 네비게이션 */}
      <nav className="mt-16 pt-8 border-t border-gray-800">
        <div className="flex justify-between items-center gap-4">
          {prevPost ? (
            <Link
              href={`/${lang}/blog/${prevPost.slug}`}
              className="group flex-1 p-4 rounded-lg border border-gray-800 hover:border-gray-700 transition-colors"
              tabIndex={0}
              aria-label={`Previous post: ${prevPost.title}`}
            >
              <span className="text-xs text-gray-500 uppercase tracking-widest flex items-center gap-2">
                <ArrowLeft size={12} />
                Previous
              </span>
              <span className="block text-white mt-2 group-hover:text-gray-300 transition-colors line-clamp-1">
                {prevPost.title}
              </span>
            </Link>
          ) : (
            <div className="flex-1" />
          )}

          {nextPost ? (
            <Link
              href={`/${lang}/blog/${nextPost.slug}`}
              className="group flex-1 p-4 rounded-lg border border-gray-800 hover:border-gray-700 transition-colors text-right"
              tabIndex={0}
              aria-label={`Next post: ${nextPost.title}`}
            >
              <span className="text-xs text-gray-500 uppercase tracking-widest flex items-center justify-end gap-2">
                Next
                <ArrowRight size={12} />
              </span>
              <span className="block text-white mt-2 group-hover:text-gray-300 transition-colors line-clamp-1">
                {nextPost.title}
              </span>
            </Link>
          ) : (
            <div className="flex-1" />
          )}
        </div>
      </nav>
    </article>
  );
}
