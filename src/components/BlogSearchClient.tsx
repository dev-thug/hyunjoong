import Link from "next/link";
import { ArrowLeft, ArrowRight, X } from "lucide-react";

import BlogPostCardList from "@/components/BlogPostCardList";
import type { PostMetadata } from "@/types";

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
  readonly posts: PostMetadata[];
  readonly lang: string;
  readonly query?: string;
  readonly currentPage: number;
  readonly totalPages: number;
  readonly totalItems: number;
  readonly labels: BlogSearchClientLabels;
}

const COUNT_PLACEHOLDER = "{count}";
const PAGE_PLACEHOLDER = "{page}";
const ELLIPSIS = "ellipsis";
const MAX_VISIBLE_PAGES_WITHOUT_ELLIPSIS = 7;

const combineClassNames = (...values: Array<string | undefined>): string =>
  values.filter(Boolean).join(" ");

const getResultsText = (resultsLabel: string, resultCount: number): string => {
  if (resultsLabel.includes(COUNT_PLACEHOLDER)) {
    return resultsLabel.replace(COUNT_PLACEHOLDER, resultCount.toLocaleString());
  }

  return `${resultCount.toLocaleString()} ${resultsLabel}`;
};

const getCurrentPageAriaLabel = (label: string, pageLabel: string, page: number): string => {
  if (label.includes(PAGE_PLACEHOLDER)) {
    return label.replace(PAGE_PLACEHOLDER, String(page));
  }

  return `${label}: ${pageLabel} ${page}`;
};

const getPageItems = (currentPage: number, totalPages: number): Array<number | typeof ELLIPSIS> => {
  if (totalPages <= MAX_VISIBLE_PAGES_WITHOUT_ELLIPSIS) {
    return Array.from({ length: totalPages }, (_, index) => index + 1);
  }

  const items: Array<number | typeof ELLIPSIS> = [1];
  const start = Math.max(2, currentPage - 1);
  const end = Math.min(totalPages - 1, currentPage + 1);

  if (start > 2) {
    items.push(ELLIPSIS);
  }

  for (let page = start; page <= end; page += 1) {
    items.push(page);
  }

  if (end < totalPages - 1) {
    items.push(ELLIPSIS);
  }

  items.push(totalPages);
  return items;
};

const buildBlogHref = (lang: string, page: number, query?: string): string => {
  const safePage = Math.max(1, Math.floor(page));
  const basePath = `/${lang}/blog`;
  const pathname = safePage === 1 ? basePath : `${basePath}/page/${safePage}`;
  const normalizedQuery = query?.trim();
  if (!normalizedQuery) {
    return pathname;
  }
  const params = new URLSearchParams({ q: normalizedQuery });
  return `${pathname}?${params.toString()}`;
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
  const pageItems = getPageItems(safeCurrentPage, totalPages);
  const hasQuery = normalizedQuery.length > 0;
  const resultsText = getResultsText(labels.resultsCount, totalItems);

  const baseButtonClassName =
    "inline-flex min-w-9 h-9 items-center justify-center rounded-md border text-sm transition-colors duration-200 outline-none focus-visible:ring-2 focus-visible:ring-white/20";
  const defaultButtonClassName =
    "border-gray-800 text-gray-400 hover:text-white hover:border-gray-700";
  const activeButtonClassName = "bg-white/10 border-white/30 text-white";
  const disabledButtonClassName = "border-gray-800 text-gray-600 cursor-not-allowed";
  const hasPrevious = safeCurrentPage > 1;
  const hasNext = safeCurrentPage < totalPages;
  const blogRootPath = `/${lang}/blog`;

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
            aria-label={labels.searchAria}
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
        />
      ) : (
        <div
          className="rounded-xl border border-white/10 bg-white/[0.02] px-6 py-10 text-center text-gray-400"
          aria-live="polite"
        >
          {labels.noResults}
        </div>
      )}

      {totalPages > 1 ? (
        <nav aria-label={labels.pagination} className="mt-10 flex justify-center">
          <ul className="flex flex-wrap items-center justify-center gap-2">
            <li>
              {hasPrevious ? (
                <Link
                  href={buildBlogHref(lang, 1, normalizedQuery)}
                  aria-label={labels.first}
                  className={combineClassNames(
                    baseButtonClassName,
                    defaultButtonClassName,
                    "px-2 hidden sm:inline-flex"
                  )}
                >
                  {labels.first}
                </Link>
              ) : (
                <span
                  aria-disabled="true"
                  className={combineClassNames(
                    baseButtonClassName,
                    disabledButtonClassName,
                    "px-2 hidden sm:inline-flex"
                  )}
                >
                  {labels.first}
                </span>
              )}
            </li>

            <li>
              {hasPrevious ? (
                <Link
                  href={buildBlogHref(lang, safeCurrentPage - 1, normalizedQuery)}
                  aria-label={labels.prevPage}
                  className={combineClassNames(
                    baseButtonClassName,
                    defaultButtonClassName
                  )}
                >
                  <ArrowLeft className="h-4 w-4" aria-hidden="true" />
                  <span className="sr-only">{labels.prevPage}</span>
                </Link>
              ) : (
                <span
                  aria-disabled="true"
                  className={combineClassNames(
                    baseButtonClassName,
                    disabledButtonClassName
                  )}
                >
                  <ArrowLeft className="h-4 w-4" aria-hidden="true" />
                  <span className="sr-only">{labels.prevPage}</span>
                </span>
              )}
            </li>

            {pageItems.map((item, index) => {
              if (item === ELLIPSIS) {
                return (
                  <li
                    key={`${ELLIPSIS}-${index.toString()}`}
                    className="inline-flex min-w-9 h-9 items-center justify-center text-gray-500"
                    aria-hidden="true"
                  >
                    ...
                  </li>
                );
              }

              const isCurrent = item === safeCurrentPage;

              return (
                <li key={item}>
                  {isCurrent ? (
                    <span
                      aria-label={getCurrentPageAriaLabel(labels.currentPage, labels.page, item)}
                      aria-current="page"
                      className={combineClassNames(baseButtonClassName, activeButtonClassName)}
                    >
                      {item}
                    </span>
                  ) : (
                    <Link
                      href={buildBlogHref(lang, item, normalizedQuery)}
                      aria-label={`${labels.goToPage}: ${labels.page} ${item}`}
                      className={combineClassNames(baseButtonClassName, defaultButtonClassName)}
                    >
                      {item}
                    </Link>
                  )}
                </li>
              );
            })}

            <li>
              {hasNext ? (
                <Link
                  href={buildBlogHref(lang, safeCurrentPage + 1, normalizedQuery)}
                  aria-label={labels.nextPage}
                  className={combineClassNames(
                    baseButtonClassName,
                    defaultButtonClassName
                  )}
                >
                  <ArrowRight className="h-4 w-4" aria-hidden="true" />
                  <span className="sr-only">{labels.nextPage}</span>
                </Link>
              ) : (
                <span
                  aria-disabled="true"
                  className={combineClassNames(
                    baseButtonClassName,
                    disabledButtonClassName
                  )}
                >
                  <ArrowRight className="h-4 w-4" aria-hidden="true" />
                  <span className="sr-only">{labels.nextPage}</span>
                </span>
              )}
            </li>

            <li>
              {hasNext ? (
                <Link
                  href={buildBlogHref(lang, totalPages, normalizedQuery)}
                  aria-label={labels.last}
                  className={combineClassNames(
                    baseButtonClassName,
                    defaultButtonClassName,
                    "px-2 hidden sm:inline-flex"
                  )}
                >
                  {labels.last}
                </Link>
              ) : (
                <span
                  aria-disabled="true"
                  className={combineClassNames(
                    baseButtonClassName,
                    disabledButtonClassName,
                    "px-2 hidden sm:inline-flex"
                  )}
                >
                  {labels.last}
                </span>
              )}
            </li>
          </ul>
        </nav>
      ) : null}
    </div>
  );
};

export type { BlogSearchClientLabels, BlogSearchClientProps };
export default BlogSearchClient;
