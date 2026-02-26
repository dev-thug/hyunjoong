import Link from "next/link";
import { ArrowRight } from "lucide-react";

import type { PostMetadata } from "@/types";

interface BlogPostCardListProps {
  readonly posts: PostMetadata[];
  readonly lang: string;
  readonly readPostAriaTemplate: string;
  readonly readMoreLabel: string;
}

const getCategoryBadgeClass = (category: string): string => {
  if (category === "Business") {
    return "border-green-500/30 text-green-400";
  }

  if (category === "Engineering") {
    return "border-blue-500/30 text-blue-400";
  }

  return "border-purple-500/30 text-purple-400";
};

const BlogPostCardList = ({
  posts,
  lang,
  readPostAriaTemplate,
  readMoreLabel,
}: BlogPostCardListProps) => {
  return (
    <div className="space-y-6">
      {posts.map((post, idx) => (
        <Link
          key={post.slug}
          href={`/${lang}/blog/${post.slug}`}
          className="group block p-6 rounded-xl border border-transparent hover:border-white/10 hover:bg-white/5 transition-all duration-300"
          tabIndex={0}
          aria-label={readPostAriaTemplate.replace("{title}", post.title)}
        >
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <span className="text-xs font-mono text-gray-600">
                {String(idx + 1).padStart(2, "0")}
              </span>
              <span
                className={`text-xs font-mono uppercase tracking-wider px-2 py-1 rounded border ${getCategoryBadgeClass(
                  post.category
                )}`}
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
              {readMoreLabel}
              <ArrowRight
                size={14}
                className="group-hover:translate-x-1 transition-transform"
              />
            </span>
          </div>
        </Link>
      ))}
    </div>
  );
};

export default BlogPostCardList;
