import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Pagination from "@/components/Pagination";
import BlogPostCardList from "@/components/BlogPostCardList";

import { getDictionary } from "@/get-dictionary";
import { i18n, type Locale } from "@/i18n-config";
import { BLOG_POSTS_PAGE_SIZE, getPostsPage } from "@/lib/posts";

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
  const dict = await getDictionary(lang);
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "https://hyunjoong.kim";
  const parsedPage = parsePageParam(page);
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

  const { currentPage } = await getPostsPage(lang, parsedPage, BLOG_POSTS_PAGE_SIZE);
  if (currentPage !== parsedPage) {
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
      const { totalPages } = await getPostsPage(lang, 1, BLOG_POSTS_PAGE_SIZE);
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
  if (parsedPage === null || parsedPage < 2) {
    notFound();
  }

  const dict = await getDictionary(lang);
  const { items: posts, currentPage, totalPages } = await getPostsPage(
    lang,
    parsedPage,
    BLOG_POSTS_PAGE_SIZE
  );

  if (parsedPage !== currentPage) {
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
