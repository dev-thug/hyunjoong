import { BLOG_POSTS_PAGE_SIZE, getPostsPage } from "@/lib/posts";
import type { Metadata } from "next";
import Pagination from "@/components/Pagination";
import BlogPostCardList from "@/components/BlogPostCardList";

import { getDictionary } from "@/get-dictionary";
import type { Locale } from "@/i18n-config";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: string }>;
}): Promise<Metadata> {
  const { lang } = (await params) as { lang: Locale };
  const dict = await getDictionary(lang);
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "https://hyunjoong.kim";

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
}: {
  params: Promise<{ lang: string }>;
}) {
  const { lang } = (await params) as { lang: Locale };
  const dict = await getDictionary(lang);
  const { items: posts, currentPage, totalPages } = await getPostsPage(
    lang,
    1,
    BLOG_POSTS_PAGE_SIZE
  );

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

      <BlogPostCardList
        posts={posts}
        lang={lang}
        readPostAriaTemplate={dict.blog.read_post_aria}
        readMoreLabel={dict.blog.read_more}
      />

      <Pagination
        basePath={`/${lang}/blog`}
        currentPage={currentPage}
        totalPages={totalPages}
        ariaLabel={dict.blog.pagination}
        firstLabel={dict.blog.first}
        lastLabel={dict.blog.last}
        prevLabel={dict.blog.prev_page}
        nextLabel={dict.blog.next_page}
        pageLabel={dict.blog.page}
        goToPageLabel={dict.blog.go_to_page}
        currentPageLabel={dict.blog.current_page}
        className="mt-10 flex justify-center"
      />
    </div>
  );
}
