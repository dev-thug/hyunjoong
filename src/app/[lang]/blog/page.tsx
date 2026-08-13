import type { Metadata } from "next";
import BlogSearchClient from "@/components/BlogSearchClient";

import { getDictionary } from "@/get-dictionary";
import type { Locale } from "@/i18n-config";
import { getDeveloperSearchMetadata } from "@/lib/metadata/developer-search";
import { buildLocalizedPageMetadata } from "@/lib/metadata/localized-page";
import { buildBlogSchema, safeJsonLdStringify } from "@/lib/json-ld";
import { BLOG_POSTS_PAGE_SIZE, getPostsPage } from "@/lib/posts";
import { getSiteBaseUrl } from "@/lib/site-config";
import { parseSearchQuery } from "@/lib/search-query";

export async function generateMetadata({
  params,
  searchParams,
}: {
  params: Promise<{ lang: string }>;
  searchParams: Promise<{ q?: string | string[] }>;
}): Promise<Metadata> {
  const { lang } = (await params) as { lang: Locale };
  // Note: searchParams forces dynamic rendering — accepted trade-off
  // for server-side search filtering via getPostsPage(query).
  const { q } = await searchParams;
  const query = parseSearchQuery(q);
  const searchMetadata = getDeveloperSearchMetadata(lang, "blog");

  return buildLocalizedPageMetadata({
    lang,
    path: "/blog",
    title: searchMetadata.title,
    description: searchMetadata.description,
    keywords: searchMetadata.keywords,
    absoluteTitle: true,
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
  // Note: searchParams forces dynamic rendering — accepted trade-off
  // for server-side search filtering via getPostsPage(query).
  const { lang } = (await params) as { lang: Locale };
  const { q } = await searchParams;
  const query = parseSearchQuery(q);
  const pageSize = query ? Number.MAX_SAFE_INTEGER : BLOG_POSTS_PAGE_SIZE;
  const searchMetadata = getDeveloperSearchMetadata(lang, "blog");
  const [dict, paginatedPosts] = await Promise.all([
    getDictionary(lang),
    getPostsPage(lang, 1, pageSize, query),
  ]);
  const blogJsonLd = query
    ? null
    : buildBlogSchema({
        baseUrl: getSiteBaseUrl(),
        lang,
        name:
          lang === "ko" ? "김현중의 기술 블로그" : "Hyunjoong Kim's Technical Blog",
        description: searchMetadata.description,
        posts: paginatedPosts.items.map((post) => ({
          slug: post.slug,
          title: post.title,
          excerpt: post.excerpt,
          date: post.date,
        })),
      });

  return (
    <>
      {blogJsonLd ? (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: safeJsonLdStringify(blogJsonLd),
          }}
        />
      ) : null}
      <div>
        <h1 className="sr-only">{dict.blog.page_heading}</h1>
        <div className="mb-12 md:mb-16 pt-6 md:pt-8">
          <div
            aria-hidden="true"
            className="text-5xl md:text-7xl lg:text-8xl font-light font-montserrat heading-decorative select-none"
          >
            {dict.blog.page_title.toUpperCase()}
          </div>
          <p className="text-gray-400 mt-4 text-lg">
            {dict.blog.page_description}
          </p>
        </div>

      <BlogSearchClient
        posts={paginatedPosts.items}
        lang={lang}
        query={query}
        currentPage={paginatedPosts.currentPage}
        totalPages={query ? 1 : paginatedPosts.totalPages}
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
    </>
  );
}
