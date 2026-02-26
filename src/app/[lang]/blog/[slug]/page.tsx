import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import {
  getPostBySlug,
  generatePostParams,
  getAllPosts,
  getAvailablePostLocales,
  getPostSourceBySlug,
} from "@/lib/posts";
import { ArrowLeft, ArrowRight } from "lucide-react";
import type { Metadata } from "next";
import { getDictionary } from "@/get-dictionary";
import type { Locale } from "@/i18n-config";
import Giscus from "@/components/mdx/Giscus";
import BlogToc from "@/components/blog/BlogToc";
import { buildContentDetailMetadata } from "@/lib/metadata/content-detail";
import {
  DEFAULT_OG_IMAGE,
  getSiteBaseUrl,
  toAbsoluteSiteUrl,
} from "@/lib/site-config";
import {
  buildSitePerson,
  buildSitePublisher,
  safeJsonLdStringify,
} from "@/lib/json-ld";
import { NOT_FOUND_METADATA_TITLE } from "@/lib/metadata/constants";
import { extractTocItems } from "@/lib/toc";

interface BlogPostPageProps {
  params: Promise<{ lang: string; slug: string }>;
  searchParams?: Promise<Record<string, string | string[] | undefined>>;
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
export async function generateMetadata({
  params,
}: BlogPostPageProps): Promise<Metadata> {
  const { lang, slug } = await params;

  const [post, availableLocales] = await Promise.all([
    getPostBySlug(slug, lang),
    getAvailablePostLocales(slug),
  ]);
  const hasKo = availableLocales.includes("ko");
  const hasEn = availableLocales.includes("en");
  const fallbackLang = hasKo ? "ko" : hasEn ? "en" : null;
  const fallbackPost =
    !post && fallbackLang ? await getPostBySlug(slug, fallbackLang) : null;

  const currentPost = post ?? fallbackPost;

  if (!currentPost) {
    return { title: NOT_FOUND_METADATA_TITLE };
  }

  return buildContentDetailMetadata({
    lang: currentPost.lang as Locale,
    canonicalLang: currentPost.lang as Locale,
    slug,
    section: "blog",
    title: currentPost.title,
    description: currentPost.excerpt,
    availableLocales: { ko: hasKo, en: hasEn },
    image: DEFAULT_OG_IMAGE,
    openGraphType: "article",
    publishedTime: currentPost.date,
    noIndex: Boolean(currentPost.hidden),
  });
}

/**
 * 블로그 포스트 상세 페이지
 */
const toQueryString = (
  searchParams: Record<string, string | string[] | undefined>
): string => {
  const urlSearchParams = new URLSearchParams();

  for (const [key, rawValue] of Object.entries(searchParams)) {
    if (Array.isArray(rawValue)) {
      rawValue.forEach((value) => {
        if (typeof value === "string") {
          urlSearchParams.append(key, value);
        }
      });
      continue;
    }

    if (typeof rawValue === "string") {
      urlSearchParams.set(key, rawValue);
    }
  }

  const serialized = urlSearchParams.toString();
  return serialized.length > 0 ? `?${serialized}` : "";
};

export default async function BlogPostPage({
  params,
  searchParams,
}: BlogPostPageProps) {
  const { lang, slug } = await params;
  const resolvedSearchParams = searchParams ? await searchParams : {};

  const [dict, post] = await Promise.all([
    getDictionary(lang as Locale),
    getPostBySlug(slug, lang),
  ]);

  if (!post) {
    const [koPost, enPost] = await Promise.all([
      getPostBySlug(slug, "ko"),
      getPostBySlug(slug, "en"),
    ]);

    const availableLang = koPost ? "ko" : enPost ? "en" : null;
    if (!availableLang) {
      notFound();
    }
    const queryString = toQueryString(resolvedSearchParams);
    redirect(`/${availableLang}/blog/${slug}${queryString}`);
  }

  const allPosts = await getAllPosts(lang, { includeHidden: true });
  const postSource = await getPostSourceBySlug(slug, lang);
  const tocItems = postSource ? extractTocItems(postSource) : [];

  const currentIndex = allPosts.findIndex((p) => p.slug === slug);
  const prevPost =
    currentIndex < allPosts.length - 1 ? allPosts[currentIndex + 1] : null;
  const nextPost = currentIndex > 0 ? allPosts[currentIndex - 1] : null;

  // MDX 컴포넌트 동적 import (가용한 언어 버전을 사용)
  const { default: PostContent } = await import(
    `@/content/posts/${slug}.${lang}.mdx`
  );

  const baseUrl = getSiteBaseUrl();
  const articleUrl = `${baseUrl}/${post.lang}/blog/${slug}`;
  const ogImageUrl = toAbsoluteSiteUrl(DEFAULT_OG_IMAGE);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: post.title,
    description: post.excerpt,
    datePublished: post.date,
    url: articleUrl,
    author: buildSitePerson(baseUrl),
    publisher: buildSitePublisher(baseUrl, ogImageUrl),
    image: ogImageUrl,
    articleSection: post.category,
    ...(post.keywords?.length ? { keywords: post.keywords } : {}),
  };

  const jsonLdScript = safeJsonLdStringify(jsonLd);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: jsonLdScript }}
      />
      <div className="mx-auto grid w-full max-w-[1200px] gap-10 lg:grid-cols-[minmax(0,85ch)_280px]">
      <article id="blog-post-content" className="min-w-0">
        {/* 헤더 */}
        <header className="mb-12">
          <Link
            href={`/${lang}/blog`}
            className="inline-flex items-center gap-2 text-gray-400 hover:text-white transition-colors mb-8"
            tabIndex={0}
            aria-label={dict.blog.back_to_blog}
          >
            <ArrowLeft size={16} />
            <span className="text-sm font-mono uppercase tracking-widest">
              {dict.blog.back_to_blog}
            </span>
          </Link>

          <div className="flex items-center gap-4 mb-4">
            <span
              className={`text-xs font-mono uppercase tracking-wider px-3 py-1 rounded-full ${
                post.category === "Business"
                  ? "bg-green-500/10 text-green-400 border border-green-500/30"
                  : post.category === "Engineering"
                  ? "bg-blue-500/10 text-blue-400 border border-blue-500/30"
                  : "bg-purple-500/10 text-purple-400 border border-purple-500/30"
              }`}
            >
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

        <BlogToc
          mode="mobile"
          observeOn="mobile"
          targetId="blog-post-content"
          items={tocItems}
          labels={{
            tocTitle: dict.blog.toc_title,
            tocToggle: dict.blog.toc_toggle,
            tocClose: dict.blog.toc_close,
            readingProgress: dict.blog.reading_progress,
            readLabel: dict.blog.read_label,
            remainingLabel: dict.blog.remaining_label,
          }}
        />

        {/* 본문 */}
        <div className="prose-custom">
          <PostContent />
        </div>

        {/* 댓글 */}
        <Giscus lang={lang as 'ko' | 'en'} />

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
      <div className="hidden lg:block">
        <BlogToc
          mode="desktop"
          observeOn="desktop"
          targetId="blog-post-content"
          items={tocItems}
          labels={{
            tocTitle: dict.blog.toc_title,
            tocToggle: dict.blog.toc_toggle,
            tocClose: dict.blog.toc_close,
            readingProgress: dict.blog.reading_progress,
            readLabel: dict.blog.read_label,
            remainingLabel: dict.blog.remaining_label,
          }}
        />
      </div>
      </div>
    </>
  );
}
