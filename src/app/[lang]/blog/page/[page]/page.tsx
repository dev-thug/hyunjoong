import BlogListing from "@/components/blog/BlogListing";
import type { Metadata } from "next";
import { notFound, redirect } from "next/navigation";

import { getDictionary } from "@/get-dictionary";
import { i18n, type Locale } from "@/i18n-config";
import {
  getBlogPaginationSearchMetadata,
  getDeveloperSearchMetadata,
} from "@/lib/metadata/developer-search";
import { buildLocalizedPageMetadata } from "@/lib/metadata/localized-page";
import { buildNotFoundMetadata } from "@/lib/metadata/not-found";
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

export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: string; page: string }>;
}): Promise<Metadata> {
  const { lang, page } = (await params) as { lang: Locale; page: string };
  const parsedPage = parsePageParam(page);
  const baseSearchMetadata = getDeveloperSearchMetadata(lang, "blog");
  const [koPosts, enPosts] = await Promise.all([
    getAllPosts("ko"),
    getAllPosts("en"),
  ]);
  const pageExists = (postCount: number): boolean =>
    parsedPage !== null &&
    parsedPage >= 2 &&
    parsedPage <= Math.ceil(postCount / BLOG_POSTS_PAGE_SIZE);
  const requestedPostCount = lang === "en" ? enPosts.length : koPosts.length;
  const requestedPageExists = pageExists(requestedPostCount);
  const isMissingPage =
    parsedPage === null ||
    (parsedPage !== 1 && !requestedPageExists);

  if (isMissingPage) {
    return buildNotFoundMetadata();
  }

  const canonicalPath =
    parsedPage >= 2 ? `/blog/page/${parsedPage}` : "/blog";
  const searchMetadata =
    parsedPage >= 2
      ? {
          ...baseSearchMetadata,
          ...getBlogPaginationSearchMetadata(lang, parsedPage),
        }
      : baseSearchMetadata;

  return buildLocalizedPageMetadata({
    lang,
    title: searchMetadata.title,
    description: searchMetadata.description,
    keywords: searchMetadata.keywords,
    absoluteTitle: true,
    canonicalPath,
    availableLocales:
      parsedPage >= 2
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
    <BlogListing
      lang={lang}
      blog={dict.blog}
      page={parsedPage}
      paginatedPosts={paginatedPosts}
    />
  );
}
