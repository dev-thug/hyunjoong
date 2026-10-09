import Breadcrumbs from "@/components/layout/Breadcrumbs";
import BlogSearchClient from "@/components/BlogSearchClient";
import type { Locale } from "@/i18n-config";
import type { PaginatedPostsResult } from "@/lib/posts";
import type { getDictionary } from "@/get-dictionary";

type BlogDictionary = Awaited<ReturnType<typeof getDictionary>>["blog"];

interface BlogListingProps {
  readonly lang: Locale;
  readonly blog: BlogDictionary;
  readonly paginatedPosts: PaginatedPostsResult;
  readonly page?: number;
  readonly query?: string;
}

export default function BlogListing({
  lang,
  blog,
  paginatedPosts,
  page,
  query,
}: BlogListingProps) {
  const breadcrumbItems = [
    { name: lang === "ko" ? "홈" : "Home", path: `/${lang}` },
    {
      name: lang === "ko" ? "기술 블로그" : "Blog",
      path: `/${lang}/blog`,
    },
    ...(page && page > 1
      ? [
          {
            name: `${lang === "ko" ? "페이지 " : "Page "}${page}`,
            path: `/${lang}/blog/page/${page}`,
          },
        ]
      : []),
  ];

  return (
    <div>
      <Breadcrumbs lang={lang} items={breadcrumbItems} />
      <h1 className="sr-only">{blog.page_heading}</h1>
      <div className="mb-12 md:mb-16 pt-6 md:pt-8">
        <div
          aria-hidden="true"
          className="text-5xl md:text-7xl lg:text-8xl font-light font-montserrat heading-decorative select-none"
        >
          {blog.page_title.toUpperCase()}
        </div>
        <p className="text-gray-400 mt-4 text-lg">{blog.page_description}</p>
      </div>

      <BlogSearchClient
        posts={paginatedPosts.items}
        lang={lang}
        query={query}
        currentPage={paginatedPosts.currentPage}
        totalPages={paginatedPosts.totalPages}
        totalItems={paginatedPosts.totalItems}
        labels={{
          searchAria: blog.search_aria,
          searchPlaceholder: blog.search_placeholder,
          clearSearch: blog.clear_search,
          resultsCount: blog.results_count,
          noResults: blog.no_search_results,
          readPostAria: blog.read_post_aria,
          readMore: blog.read_more,
          pagination: blog.pagination,
          first: blog.first,
          last: blog.last,
          prevPage: blog.prev_page,
          nextPage: blog.next_page,
          page: blog.page,
          goToPage: blog.go_to_page,
          currentPage: blog.current_page,
        }}
      />
    </div>
  );
}
