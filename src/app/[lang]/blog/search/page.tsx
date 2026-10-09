import BlogListing from "@/components/blog/BlogListing";
import type { Metadata } from "next";
import { redirect } from "next/navigation";

import { getDictionary } from "@/get-dictionary";
import type { Locale } from "@/i18n-config";
import { getDeveloperSearchMetadata } from "@/lib/metadata/developer-search";
import { buildLocalizedPageMetadata } from "@/lib/metadata/localized-page";
import { getPostsPage } from "@/lib/posts";
import { parseSearchQuery } from "@/lib/search-query";

export const dynamic = "force-dynamic";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: string }>;
}): Promise<Metadata> {
  const { lang } = (await params) as { lang: Locale };
  const searchMetadata = getDeveloperSearchMetadata(lang, "blog");

  return buildLocalizedPageMetadata({
    lang,
    path: "/blog",
    title: searchMetadata.title,
    description: searchMetadata.description,
    keywords: searchMetadata.keywords,
    absoluteTitle: true,
    noIndex: true,
  });
}

export default async function BlogSearchPage({
  params,
  searchParams,
}: {
  params: Promise<{ lang: string }>;
  searchParams: Promise<{ q?: string | string[] }>;
}) {
  const [{ lang }, { q }] = await Promise.all([params, searchParams]);
  const query = parseSearchQuery(q);

  if (!query) {
    redirect(`/${lang}/blog`);
  }

  const [dict, paginatedPosts] = await Promise.all([
    getDictionary(lang),
    getPostsPage(lang, 1, Number.MAX_SAFE_INTEGER, query),
  ]);

  return (
    <BlogListing
      lang={lang as Locale}
      blog={dict.blog}
      paginatedPosts={paginatedPosts}
      query={query}
    />
  );
}
