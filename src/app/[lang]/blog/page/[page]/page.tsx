import type { Metadata } from "next";
import { notFound } from "next/navigation";
import BlogSearchClient from "@/components/BlogSearchClient";

import { getDictionary } from "@/get-dictionary";
import { i18n, type Locale } from "@/i18n-config";
import { BLOG_POSTS_PAGE_SIZE, getAllPosts, paginatePosts } from "@/lib/posts";

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
  params: Promise<{ lang: string; page: string }>;
  searchParams: Promise<{ q?: string | string[] }>;
}): Promise<Metadata> {
  const { lang, page } = (await params) as { lang: Locale; page: string };
  const { q } = await searchParams;
  const query = parseSearchQuery(q);
  const dict = await getDictionary(lang);
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "https://hyunjoong.kim";
  const parsedPage = parsePageParam(page);

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

  if (parsedPage === null || parsedPage < 2) {
    return {
      title: dict.blog.page_title,
      description: dict.blog.page_description,
      robots: {
        index: false,
        follow: false,
      },
    };
  }

  const posts = await getAllPosts(lang);
  const { totalPages } = paginatePosts(posts, parsedPage, BLOG_POSTS_PAGE_SIZE);
  if (parsedPage > totalPages) {
    return {
      title: dict.blog.page_title,
      description: dict.blog.page_description,
      robots: {
        index: false,
        follow: false,
      },
    };
  }

  const normalizedPage = String(parsedPage);

  return {
    title: dict.blog.page_title,
    description: dict.blog.page_description,
    alternates: {
      canonical: `${baseUrl}/${lang}/blog/page/${normalizedPage}`,
      languages: {
        ko: `${baseUrl}/ko/blog/page/${normalizedPage}`,
        en: `${baseUrl}/en/blog/page/${normalizedPage}`,
        "x-default": `${baseUrl}/ko/blog/page/${normalizedPage}`,
      },
    },
  };
}

export const generateStaticParams = async (): Promise<
  { lang: string; page: string }[]
> => {
  const pagedRoutes = await Promise.all(
    i18n.locales.map(async (lang) => {
      const posts = await getAllPosts(lang);
      const { totalPages } = paginatePosts(posts, 1, BLOG_POSTS_PAGE_SIZE);
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
  const { lang, page } = (await params) as { lang: Locale; page: string };
  const { q } = await searchParams;
  const query = parseSearchQuery(q);
  const parsedPage = parsePageParam(page);
  if (parsedPage === null || parsedPage < 2) {
    notFound();
  }

  const dict = await getDictionary(lang);
  const posts = await getAllPosts(lang);
  const { totalPages } = paginatePosts(posts, parsedPage, BLOG_POSTS_PAGE_SIZE);
  if (parsedPage > totalPages) {
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
        posts={posts}
        lang={lang}
        initialQuery={query}
        initialPage={parsedPage}
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
