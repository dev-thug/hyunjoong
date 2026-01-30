import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getPostBySlug, generatePostParams, getAllPosts, getPostIdentifiers } from '@/lib/posts';
import { ArrowLeft, ArrowRight, Languages, AlertCircle } from 'lucide-react';
import type { Metadata } from 'next';
import { getDictionary } from '@/get-dictionary';
import type { Locale } from '@/i18n-config';

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
  
  // 가용한 모든 버전과 메타데이터를 병렬로 가져옴
  const [post, koPost, enPost, allIdentifiers] = await Promise.all([
    getPostBySlug(slug, lang),
    getPostBySlug(slug, 'ko'),
    getPostBySlug(slug, 'en'),
    getPostIdentifiers(),
  ]);

  let currentPost = post;
  
  // 요청된 언어의 포스트가 없으면 다른 언어 버전 사용
  if (!currentPost) {
    const otherVersion = allIdentifiers.find(id => id.slug === slug);
    if (otherVersion) {
      currentPost = otherVersion.lang === 'ko' ? koPost : enPost;
    }
  }

  if (!currentPost) {
    return { title: 'Post Not Found' };
  }

  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "https://hyunjoong.com";

  const languages: Record<string, string> = {};
  if (koPost) languages.ko = `${baseUrl}/ko/blog/${slug}`;
  if (enPost) languages.en = `${baseUrl}/en/blog/${slug}`;
  if (koPost) languages['x-default'] = `${baseUrl}/ko/blog/${slug}`;

  return {
    title: currentPost.title,
    description: currentPost.excerpt,
    alternates: {
      canonical: `${baseUrl}/${currentPost.lang}/blog/${slug}`,
      languages,
    },
    openGraph: {
      title: currentPost.title,
      description: currentPost.excerpt,
      url: `${baseUrl}/${lang}/blog/${slug}`,
      type: 'article',
      publishedTime: currentPost.date,
      locale: currentPost.lang === 'ko' ? 'ko_KR' : 'en_US',
    },
    twitter: {
      card: 'summary_large_image',
      title: currentPost.title,
      description: currentPost.excerpt,
    },
  };
}

/**
 * 블로그 포스트 상세 페이지
 */
export default async function BlogPostPage({ params }: BlogPostPageProps) {
  const { lang, slug } = await params;
  
  // 데이터 페칭 병렬화 (Parallel Data Fetching)
  // 사전 정의된 언어로 사전을 가져오고, 포스트 데이터도 동시에 병렬로 페칭
  let [dict, post, allPosts] = await Promise.all([
    getDictionary(lang as Locale),
    getPostBySlug(slug, lang),
    getAllPosts(lang)
  ]);
  
  let isFallback = false;
  let availableVersion: { slug: string; lang: string } | null = null;

  if (!post) {
    const allIdentifiers = await getPostIdentifiers();
    const otherVersions = allIdentifiers.filter(id => id.slug === slug);
    
    if (otherVersions.length === 0) {
      notFound();
    }
    
    // 첫 번째 가용한 버전을 선택
    availableVersion = otherVersions[0];
    
    // 폴백 데이터 페칭도 병렬화
    [post, allPosts] = await Promise.all([
      getPostBySlug(slug, availableVersion.lang),
      getAllPosts(availableVersion.lang)
    ]);
    
    isFallback = true;
  }

  if (!post) {
    notFound();
  }

  const currentIndex = allPosts.findIndex((p) => p.slug === slug);
  const prevPost = currentIndex < allPosts.length - 1 ? allPosts[currentIndex + 1] : null;
  const nextPost = currentIndex > 0 ? allPosts[currentIndex - 1] : null;

  // MDX 컴포넌트 동적 import (가용한 언어 버전을 사용)
  const contentLang = isFallback && availableVersion ? availableVersion.lang : lang;
  const { default: PostContent } = await import(`@/content/posts/${slug}.${contentLang}.mdx`);

  return (
    <article className="max-w-[85ch] mx-auto w-full">
      {/* 헤더 */}
      <header className="mb-12">
        <Link
          href={`/${lang}/blog`}
          className="inline-flex items-center gap-2 text-gray-400 hover:text-white transition-colors mb-8"
          tabIndex={0}
          aria-label={dict.blog.back_to_blog}
        >
          <ArrowLeft size={16} />
          <span className="text-sm font-mono uppercase tracking-widest">{dict.blog.back_to_blog}</span>
        </Link>

        {isFallback && availableVersion && (
          <div className="mb-12 p-6 rounded-xl border border-amber-500/20 bg-amber-500/5 backdrop-blur-sm">
            <div className="flex items-start gap-4">
              <div className="p-2 rounded-lg bg-amber-500/10 text-amber-500">
                <AlertCircle size={20} />
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-white mb-1">
                  {dict.blog.not_available_title}
                </h3>
                <p className="text-gray-400 text-sm mb-4">
                  {dict.blog.not_available_description.replace('{lang}', availableVersion.lang === 'ko' ? '한국어' : 'English')}
                </p>
                <Link
                  href={`/${availableVersion.lang}/blog/${slug}`}
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-white text-black text-sm font-medium hover:bg-gray-200 transition-colors"
                >
                  <Languages size={14} />
                  {dict.blog.read_in_language.replace('{lang}', availableVersion.lang === 'ko' ? '한국어' : 'English')}
                </Link>
              </div>
            </div>
          </div>
        )}

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
            {post.date} · {post.readTime} {dict.blog.read_time}
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
              aria-label={`${dict.blog.previous}: ${prevPost.title}`}
            >
              <span className="text-xs text-gray-500 uppercase tracking-widest flex items-center gap-2">
                <ArrowLeft size={12} />
                {dict.blog.previous}
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
              aria-label={`${dict.blog.next}: ${nextPost.title}`}
            >
              <span className="text-xs text-gray-500 uppercase tracking-widest flex items-center justify-end gap-2">
                {dict.blog.next}
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
