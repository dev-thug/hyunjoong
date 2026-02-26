import type { Metadata } from "next";
import BlogSearchClient from "@/components/BlogSearchClient";

import { getDictionary } from "@/get-dictionary";
import type { Locale } from "@/i18n-config";
import { buildBlogListingMetadata } from "@/lib/metadata/blog-listing";
import { BLOG_POSTS_PAGE_SIZE, getPostsPage } from "@/lib/posts";
import { parseSearchQuery } from "@/lib/search-query";

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

  return buildBlogListingMetadata({
    lang,
    title: dict.blog.page_title,
    description: dict.blog.page_description,
    noIndex: Boolean(query),
  });
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
  const [dict, paginatedPosts] = await Promise.all([
    getDictionary(lang),
    getPostsPage(lang, 1, BLOG_POSTS_PAGE_SIZE, query),
  ]);

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
        posts={paginatedPosts.items}
        lang={lang}
        query={query}
        currentPage={paginatedPosts.currentPage}
        totalPages={paginatedPosts.totalPages}
        totalItems={paginatedPosts.totalItems}
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
