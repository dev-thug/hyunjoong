import Link from "next/link";
import { X } from "lucide-react";

import BlogPostCardList from "@/components/BlogPostCardList";
import Pagination from "@/components/Pagination";
import { BLOG_POSTS_PAGE_SIZE } from "@/lib/posts";
import type { Post } from "@/types";

interface BlogSearchClientLabels {
  readonly searchAria: string;
  readonly searchPlaceholder: string;
  readonly clearSearch: string;
  readonly resultsCount: string;
  readonly noResults: string;
  readonly readPostAria: string;
  readonly readMore: string;
  readonly pagination: string;
  readonly first: string;
  readonly last: string;
  readonly prevPage: string;
  readonly nextPage: string;
  readonly page: string;
  readonly goToPage: string;
  readonly currentPage: string;
}

interface BlogSearchClientProps {
  readonly posts: Post[];
  readonly lang: string;
  readonly query?: string;
  readonly currentPage: number;
  readonly totalPages: number;
  readonly totalItems: number;
  readonly labels: BlogSearchClientLabels;
}

const COUNT_PLACEHOLDER = "{count}";

const getResultsText = (resultsLabel: string, resultCount: number): string => {
  if (resultsLabel.includes(COUNT_PLACEHOLDER)) {
    return resultsLabel.replace(COUNT_PLACEHOLDER, resultCount.toLocaleString());
  }

  return `${resultCount.toLocaleString()} ${resultsLabel}`;
};

const BlogSearchClient = ({
  posts,
  lang,
  query,
  currentPage,
  totalPages,
  totalItems,
  labels,
}: BlogSearchClientProps) => {
  const normalizedQuery = query?.trim() ?? "";
  const safeCurrentPage = Math.min(
    Math.max(1, Math.floor(currentPage)),
    Math.max(1, Math.floor(totalPages))
  );
  const hasQuery = normalizedQuery.length > 0;
  const resultsText = getResultsText(labels.resultsCount, totalItems);
  const blogRootPath = `/${lang}/blog`;
  const startIndex = (safeCurrentPage - 1) * BLOG_POSTS_PAGE_SIZE;

  return (
    <div>
      <section
        aria-label={labels.searchAria}
        className="mb-8 rounded-xl border border-white/10 bg-white/5 p-4 md:p-5"
      >
        <form
          role="search"
          className="flex flex-col gap-3 md:flex-row md:items-center"
          method="get"
          action={blogRootPath}
        >
          <label htmlFor="blog-search" className="sr-only">
            {labels.searchAria}
          </label>
          <input
            id="blog-search"
            name="q"
            type="search"
            defaultValue={normalizedQuery}
            placeholder={labels.searchPlaceholder}
            className="w-full rounded-lg border border-gray-700/80 bg-black/20 px-3 py-2.5 text-sm text-gray-100 placeholder:text-gray-500 outline-none transition-colors focus-visible:border-white/30 focus-visible:ring-2 focus-visible:ring-white/20"
          />

          {hasQuery ? (
            <Link
              href={blogRootPath}
              aria-label={labels.clearSearch}
              className="inline-flex h-10 items-center justify-center gap-2 rounded-lg border border-gray-700/90 px-4 text-xs font-mono uppercase tracking-wider text-gray-300 transition-colors hover:border-white/30 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/20 md:flex-shrink-0"
            >
              <X className="h-3.5 w-3.5" aria-hidden="true" />
              {labels.clearSearch}
            </Link>
          ) : null}
        </form>

        <p className="mt-3 text-xs font-mono uppercase tracking-wider text-gray-500" aria-live="polite">
          {resultsText}
        </p>
      </section>

      {posts.length > 0 ? (
        <BlogPostCardList
          posts={posts}
          lang={lang}
          readPostAriaTemplate={labels.readPostAria}
          readMoreLabel={labels.readMore}
          startIndex={startIndex}
        />
      ) : (
        <div className="rounded-xl border border-white/10 bg-white/[0.02] px-6 py-10 text-center text-gray-400">
          {labels.noResults}
        </div>
      )}

      {totalPages > 1 ? (
        <Pagination
          basePath={blogRootPath}
          currentPage={safeCurrentPage}
          totalPages={totalPages}
          query={normalizedQuery || undefined}
          ariaLabel={labels.pagination}
          firstLabel={labels.first}
          lastLabel={labels.last}
          prevLabel={labels.prevPage}
          nextLabel={labels.nextPage}
          pageLabel={labels.page}
          goToPageLabel={labels.goToPage}
          currentPageLabel={labels.currentPage}
          className="mt-10 flex justify-center"
        />
      ) : null}
    </div>
  );
};

export type { BlogSearchClientLabels, BlogSearchClientProps };
export default BlogSearchClient;
