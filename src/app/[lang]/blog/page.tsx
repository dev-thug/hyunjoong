import Link from "next/link";
import { getAllPosts } from "@/lib/posts";
import { ArrowRight } from "lucide-react";
import type { Metadata } from "next";

import { getDictionary } from "@/get-dictionary";
import { i18n, type Locale } from "@/i18n-config";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: string }>;
}): Promise<Metadata> {
  const { lang } = (await params) as { lang: Locale };
  const dict = await getDictionary(lang);
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "https://hyunjoong.com";

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
  const { lang } = await params;
  const posts = await getAllPosts(lang);

  return (
    <div>
      {/* 헤더 */}
      <div className="mb-12 md:mb-16 pt-6 md:pt-8">
        <h1 className="text-5xl md:text-7xl lg:text-8xl font-light font-montserrat heading-decorative select-none">
          INTELLIGENCE
        </h1>
        <p className="text-gray-400 mt-4 text-lg">
          Full-stack development, serverless architecture, and business
          insights.
        </p>
      </div>

      {/* 포스트 목록 */}
      <div className="space-y-6">
        {posts.map((post, idx) => (
          <Link
            key={post.slug}
            href={`/${lang}/blog/${post.slug}`}
            className="group block p-6 rounded-xl border border-transparent hover:border-white/10 hover:bg-white/5 transition-all duration-300"
            tabIndex={0}
            aria-label={`Read: ${post.title}`}
          >
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <span className="text-xs font-mono text-gray-600">
                  {String(idx + 1).padStart(2, "0")}
                </span>
                <span
                  className={`text-xs font-mono uppercase tracking-wider px-2 py-1 rounded border ${
                    post.category === "Business"
                      ? "border-green-500/30 text-green-400"
                      : post.category === "Engineering"
                      ? "border-blue-500/30 text-blue-400"
                      : "border-purple-500/30 text-purple-400"
                  }`}
                >
                  {post.category}
                </span>
              </div>

              <span className="text-xs font-mono text-gray-500">
                {post.date} · {post.readTime}
              </span>
            </div>

            <h2 className="text-2xl font-light text-white mt-4 group-hover:text-gray-200 transition-colors">
              {post.title}
            </h2>

            <p className="text-gray-500 mt-2 line-clamp-2">{post.excerpt}</p>

            <div className="flex justify-end mt-4">
              <span className="inline-flex items-center gap-2 text-sm text-gray-500 group-hover:text-white transition-colors">
                Read more
                <ArrowRight
                  size={14}
                  className="group-hover:translate-x-1 transition-transform"
                />
              </span>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
