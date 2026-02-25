import type { Metadata } from "next";
import BlogSearchClient from "@/components/BlogSearchClient";

import { getDictionary } from "@/get-dictionary";
import type { Locale } from "@/i18n-config";
import { getAllPosts } from "@/lib/posts";

const parseSearchQuery = (
  value: string | string[] | undefined
): string | undefined => {
  if (Array.isArray(value)) {
    return parseSearchQuery(value[0]);
  }

  if (typeof value !== "string") {
    return undefined;
  }

  const normalized = value.trim();
  return normalized.length > 0 ? normalized : undefined;
};

export async function generateMetadata({
  params,
  searchParams,
}: {
  params: Promise<{ lang: string }>;
  searchParams: Promise<{ q?: string | string[] }>;
}): Promise<Metadata> {
  const { lang } = (await params) as { lang: Locale };
  const { q } = await searchParams;
  const query = parseSearchQuery(q);
  const dict = await getDictionary(lang);
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "https://hyunjoong.kim";

  if (query) {
    return {
      title: dict.blog.page_title,
      description: dict.blog.page_description,
      robots: {
        index: false,
        follow: false,
      },
    };
  }

  return {
    title: dict.blog.page_title,
    description: dict.blog.page_description,
    alternates: {
      canonical: `${baseUrl}/${lang}/blog`,
      languages: {
        ko: `${baseUrl}/ko/blog`,
        en: `${baseUrl}/en/blog`,
        "x-default": `${baseUrl}/ko/blog`,
      },
    },
  };
}

/**
 * 블로그 목록 페이지
 */
export default async function BlogPage({
  params,
  searchParams,
}: {
  params: Promise<{ lang: string }>;
  searchParams: Promise<{ q?: string | string[] }>;
}) {
  const { lang } = (await params) as { lang: Locale };
  const { q } = await searchParams;
  const query = parseSearchQuery(q);
  const dict = await getDictionary(lang);
  const posts = await getAllPosts(lang);

  return (
    <div>
      {/* 헤더 */}
      <div className="mb-12 md:mb-16 pt-6 md:pt-8">
        <h1 className="text-5xl md:text-7xl lg:text-8xl font-light font-montserrat heading-decorative select-none">
          {dict.blog.page_title.toUpperCase()}
        </h1>
        <p className="text-gray-400 mt-4 text-lg">
          {dict.blog.page_description}
        </p>
      </div>

      <BlogSearchClient
        posts={posts}
        lang={lang}
        initialQuery={query}
        initialPage={1}
        labels={{
          searchAria: dict.blog.search_aria,
          searchPlaceholder: dict.blog.search_placeholder,
          clearSearch: dict.blog.clear_search,
          resultsCount: dict.blog.results_count,
          noResults: dict.blog.no_search_results,
          readPostAria: dict.blog.read_post_aria,
          readMore: dict.blog.read_more,
          pagination: dict.blog.pagination,
          first: dict.blog.first,
          last: dict.blog.last,
          prevPage: dict.blog.prev_page,
          nextPage: dict.blog.next_page,
          page: dict.blog.page,
          goToPage: dict.blog.go_to_page,
          currentPage: dict.blog.current_page,
        }}
      />
    </div>
  );
}
