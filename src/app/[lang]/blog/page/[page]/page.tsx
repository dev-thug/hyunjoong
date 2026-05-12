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

// `?q=` search submits to /blog only; paginated routes have no search UI,
// so this file omits `searchParams` to remain fully statically generated.
export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: string; page: string }>;
}): Promise<Metadata> {
  const { lang, page } = (await params) as { lang: Locale; page: string };
  const dict = await getDictionary(lang);
  const parsedPage = parsePageParam(page);
  const canonicalPath =
    parsedPage !== null && parsedPage >= 2 ? `/blog/page/${parsedPage}` : "/blog";
  return buildLocalizedPageMetadata({
    lang,
    title: dict.blog.page_title,
    description: dict.blog.page_description,
    canonicalPath,
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
}: {
  params: Promise<{ lang: string; page: string }>;
}) {
  const { lang, page } = (await params) as { lang: Locale; page: string };
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
      <div className="mb-12 md:mb-16 pt-6 md:pt-8">
        <h1 className="text-5xl md:text-7xl lg:text-8xl font-light font-montserrat heading-decorative select-none">
          {dict.blog.page_title.toUpperCase()}
        </h1>
        <p className="text-gray-400 mt-4 text-lg">{dict.blog.page_description}</p>
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
