import type { Metadata } from "next";
import { notFound, redirect } from "next/navigation";
import BlogSearchClient from "@/components/BlogSearchClient";

import { getDictionary } from "@/get-dictionary";
import { i18n, type Locale } from "@/i18n-config";
import { buildLocalizedPageMetadata } from "@/lib/metadata/localized-page";
import { BLOG_POSTS_PAGE_SIZE, getAllPosts, getPostsPage } from "@/lib/posts";

const PAGE_PARAM_PATTERN = /^[1-9]\d*$/;

const parsePageParam = (pageParam: string): number | null => {
  if (!PAGE_PARAM_PATTERN.test(pageParam)) {
    return null;
  }

  const parsedPage = Number(pageParam);
  if (!Number.isSafeInteger(parsedPage) || parsedPage < 1) {
    return null;
  }

  if (String(parsedPage) !== pageParam) {
    return null;
  }

  return parsedPage;
};

const parseSearchQuery = (value?: string | string[]): string => {
  const rawValue = Array.isArray(value) ? value[0] : value;
  return rawValue?.trim() ?? "";
};

// `?q=` search is canonicalized to /blog so pagination stays deterministic.
export async function generateMetadata({
  params,
  searchParams,
}: {
  params: Promise<{ lang: string; page: string }>;
  searchParams: Promise<{ q?: string | string[] }>;
}): Promise<Metadata> {
  const [resolvedParams, resolvedSearchParams] = await Promise.all([
    params,
    searchParams,
  ]);
  const { lang, page } = resolvedParams as { lang: Locale; page: string };
  const query = parseSearchQuery(resolvedSearchParams.q);
  const parsedPage = parsePageParam(page);
  const [dict, koPosts, enPosts] = await Promise.all([
    getDictionary(lang),
    getAllPosts("ko"),
    getAllPosts("en"),
  ]);
  const pageExists = (postCount: number): boolean =>
    parsedPage !== null &&
    parsedPage >= 2 &&
    parsedPage <= Math.ceil(postCount / BLOG_POSTS_PAGE_SIZE);
  const canonicalPath =
    parsedPage !== null && parsedPage >= 2 ? `/blog/page/${parsedPage}` : "/blog";
  return buildLocalizedPageMetadata({
    lang,
    title: dict.blog.page_title,
    description: dict.blog.page_description,
    canonicalPath: query ? "/blog" : canonicalPath,
    noIndex: query.length > 0,
    availableLocales:
      query.length === 0 && parsedPage !== null && parsedPage >= 2
        ? { ko: pageExists(koPosts.length), en: pageExists(enPosts.length) }
        : { ko: true, en: true },
  });
}

export const generateStaticParams = async (): Promise<
  { lang: string; page: string }[]
> => {
  const pagedRoutes = await Promise.all(
    i18n.locales.map(async (lang) => {
      const posts = await getAllPosts(lang);
      const totalPages = Math.max(
        1,
        Math.ceil(posts.length / BLOG_POSTS_PAGE_SIZE)
      );
      const pages: { lang: string; page: string }[] = [];

      for (let page = 2; page <= totalPages; page += 1) {
        pages.push({ lang, page: String(page) });
      }

      return pages;
    })
  );

  return pagedRoutes.flat();
};

export default async function BlogPageByPage({
  params,
  searchParams,
}: {
  params: Promise<{ lang: string; page: string }>;
  searchParams: Promise<{ q?: string | string[] }>;
}) {
  const [resolvedParams, resolvedSearchParams] = await Promise.all([
    params,
    searchParams,
  ]);
  const { lang, page } = resolvedParams as { lang: Locale; page: string };
  const query = parseSearchQuery(resolvedSearchParams.q);
  if (query) {
    redirect(`/${lang}/blog?q=${encodeURIComponent(query)}`);
  }
  const parsedPage = parsePageParam(page);
  if (parsedPage === null) {
    notFound();
  }
  // Canonicalize /blog/page/1 → /blog so the listing has a single URL.
  if (parsedPage === 1) {
    redirect(`/${lang}/blog`);
  }

  const [dict, paginatedPosts] = await Promise.all([
    getDictionary(lang),
    getPostsPage(lang, parsedPage, BLOG_POSTS_PAGE_SIZE),
  ]);
  if (parsedPage > paginatedPosts.totalPages) {
    notFound();
  }

  return (
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
        currentPage={parsedPage}
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
