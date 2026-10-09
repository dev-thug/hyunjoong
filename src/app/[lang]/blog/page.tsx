import BlogListing from "@/components/blog/BlogListing";
import type { Metadata } from "next";
import { getDictionary } from "@/get-dictionary";
import type { Locale } from "@/i18n-config";
import { getDeveloperSearchMetadata } from "@/lib/metadata/developer-search";
import { buildLocalizedPageMetadata } from "@/lib/metadata/localized-page";
import { buildBlogSchema, safeJsonLdStringify } from "@/lib/json-ld";
import { BLOG_POSTS_PAGE_SIZE, getPostsPage } from "@/lib/posts";
import { getSiteBaseUrl } from "@/lib/site-config";

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
  });
}

/**
 * Blog listing. Search filtering is served by the sibling search route so the
 * unfiltered listing can be prerendered independently of request parameters.
 */
export default async function BlogPage({
  params,
}: {
  params: Promise<{ lang: string }>;
}) {
  const { lang } = (await params) as { lang: Locale };
  const searchMetadata = getDeveloperSearchMetadata(lang, "blog");
  const [dict, paginatedPosts] = await Promise.all([
    getDictionary(lang),
    getPostsPage(lang, 1, BLOG_POSTS_PAGE_SIZE),
  ]);
  const blogJsonLd = buildBlogSchema({
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
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: safeJsonLdStringify(blogJsonLd),
        }}
      />
      <BlogListing lang={lang} blog={dict.blog} paginatedPosts={paginatedPosts} />
    </>
  );
}
