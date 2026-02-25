"use client";

import { useId, useMemo, useState } from "react";
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
  readonly initialQuery?: string;
  readonly initialPage?: number;
  readonly labels: BlogSearchClientLabels;
  readonly pageSize?: number;
}

const COUNT_PLACEHOLDER = "{count}";
const PAGE_PLACEHOLDER = "{page}";
const ELLIPSIS = "ellipsis";
const DEFAULT_PAGE_SIZE = 6;
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

const normalizeQuery = (value: string): string => value.trim().toLowerCase();

const matchesPost = (post: PostMetadata, normalizedQuery: string): boolean => {
  if (!normalizedQuery) {
    return true;
  }

  const searchableContent = [
    post.title,
    post.excerpt,
    post.category,
    post.keywords?.join(" ") ?? "",
  ]
    .join(" ")
    .toLowerCase();

  return searchableContent.includes(normalizedQuery);
};

const BlogSearchClient = ({
  posts,
  lang,
  initialQuery = "",
  initialPage = 1,
  labels,
  pageSize = DEFAULT_PAGE_SIZE,
}: BlogSearchClientProps) => {
  const inputId = useId();
  const safePageSize = Math.max(1, pageSize);
  const [query, setQuery] = useState(initialQuery);
  const [currentPage, setCurrentPage] = useState(Math.max(1, Math.floor(initialPage)));

  const normalizedQuery = useMemo(() => normalizeQuery(query), [query]);
  const filteredPosts = useMemo(
    () => posts.filter((post) => matchesPost(post, normalizedQuery)),
    [posts, normalizedQuery]
  );
  const totalItems = filteredPosts.length;
  const totalPages = Math.max(1, Math.ceil(totalItems / safePageSize));
  const safeCurrentPage = Math.min(currentPage, totalPages);
  const pageItems = getPageItems(safeCurrentPage, totalPages);
  const startIndex = (safeCurrentPage - 1) * safePageSize;
  const paginatedPosts = filteredPosts.slice(startIndex, startIndex + safePageSize);
  const hasQuery = query.trim().length > 0;
  const resultsText = getResultsText(labels.resultsCount, totalItems);

  const baseButtonClassName =
    "inline-flex min-w-9 h-9 items-center justify-center rounded-md border text-sm transition-colors duration-200 outline-none focus-visible:ring-2 focus-visible:ring-white/20";
  const defaultButtonClassName =
    "border-gray-800 text-gray-400 hover:text-white hover:border-gray-700";
  const activeButtonClassName = "bg-white/10 border-white/30 text-white";
  const disabledButtonClassName = "border-gray-800 text-gray-600 cursor-not-allowed";

  const handleQueryChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(event.target.value);
    setCurrentPage(1);
  };

  const handleClearQuery = () => {
    setQuery("");
    setCurrentPage(1);
  };

  const handleMovePage = (page: number) => {
    const nextPage = Math.min(Math.max(1, page), totalPages);
    setCurrentPage(nextPage);
  };

  const hasPrevious = safeCurrentPage > 1;
  const hasNext = safeCurrentPage < totalPages;

  return (
    <div>
      <section
        aria-label={labels.searchAria}
        className="mb-8 rounded-xl border border-white/10 bg-white/5 p-4 md:p-5"
      >
        <div role="search" className="flex flex-col gap-3 md:flex-row md:items-center">
          <label htmlFor={inputId} className="sr-only">
            {labels.searchAria}
          </label>
          <input
            id={inputId}
            type="search"
            value={query}
            onChange={handleQueryChange}
            placeholder={labels.searchPlaceholder}
            aria-label={labels.searchAria}
            className="w-full rounded-lg border border-gray-700/80 bg-black/20 px-3 py-2.5 text-sm text-gray-100 placeholder:text-gray-500 outline-none transition-colors focus-visible:border-white/30 focus-visible:ring-2 focus-visible:ring-white/20"
          />

          {hasQuery ? (
            <button
              type="button"
              onClick={handleClearQuery}
              aria-label={labels.clearSearch}
              className="inline-flex h-10 items-center justify-center gap-2 rounded-lg border border-gray-700/90 px-4 text-xs font-mono uppercase tracking-wider text-gray-300 transition-colors hover:border-white/30 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/20 md:flex-shrink-0"
            >
              <X className="h-3.5 w-3.5" aria-hidden="true" />
              {labels.clearSearch}
            </button>
          ) : null}
        </div>

        <p className="mt-3 text-xs font-mono uppercase tracking-wider text-gray-500" aria-live="polite">
          {resultsText}
        </p>
      </section>

      {paginatedPosts.length > 0 ? (
        <BlogPostCardList
          posts={paginatedPosts}
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
              <button
                type="button"
                onClick={() => handleMovePage(1)}
                aria-label={labels.first}
                disabled={!hasPrevious}
                className={combineClassNames(
                  baseButtonClassName,
                  hasPrevious ? defaultButtonClassName : disabledButtonClassName,
                  "px-2 hidden sm:inline-flex"
                )}
              >
                {labels.first}
              </button>
            </li>

            <li>
              <button
                type="button"
                onClick={() => handleMovePage(safeCurrentPage - 1)}
                aria-label={labels.prevPage}
                disabled={!hasPrevious}
                className={combineClassNames(
                  baseButtonClassName,
                  hasPrevious ? defaultButtonClassName : disabledButtonClassName
                )}
              >
                <ArrowLeft className="h-4 w-4" aria-hidden="true" />
                <span className="sr-only">{labels.prevPage}</span>
              </button>
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
                    <button
                      type="button"
                      onClick={() => handleMovePage(item)}
                      aria-label={`${labels.goToPage}: ${labels.page} ${item}`}
                      className={combineClassNames(baseButtonClassName, defaultButtonClassName)}
                    >
                      {item}
                    </button>
                  )}
                </li>
              );
            })}

            <li>
              <button
                type="button"
                onClick={() => handleMovePage(safeCurrentPage + 1)}
                aria-label={labels.nextPage}
                disabled={!hasNext}
                className={combineClassNames(
                  baseButtonClassName,
                  hasNext ? defaultButtonClassName : disabledButtonClassName
                )}
              >
                <ArrowRight className="h-4 w-4" aria-hidden="true" />
                <span className="sr-only">{labels.nextPage}</span>
              </button>
            </li>

            <li>
              <button
                type="button"
                onClick={() => handleMovePage(totalPages)}
                aria-label={labels.last}
                disabled={!hasNext}
                className={combineClassNames(
                  baseButtonClassName,
                  hasNext ? defaultButtonClassName : disabledButtonClassName,
                  "px-2 hidden sm:inline-flex"
                )}
              >
                {labels.last}
              </button>
            </li>
          </ul>
        </nav>
      ) : null}
    </div>
  );
};

export type { BlogSearchClientLabels, BlogSearchClientProps };
export default BlogSearchClient;
