import Link from "next/link";
import { ArrowLeft, ArrowRight } from "lucide-react";

interface PaginationProps {
  basePath: string;
  currentPage: number;
  totalPages: number;
  ariaLabel: string;
  firstLabel: string;
  lastLabel: string;
  prevLabel: string;
  nextLabel: string;
  pageLabel: string;
  goToPageLabel: string;
  currentPageLabel: string;
  className?: string;
}

const ELLIPSIS = "ellipsis";
const MAX_VISIBLE_PAGES_WITHOUT_ELLIPSIS = 7;

const combineClassNames = (...values: Array<string | undefined>) =>
  values.filter(Boolean).join(" ");

const normalizeBasePath = (basePath: string) => {
  if (basePath === "/") {
    return "/";
  }

  return basePath.replace(/\/+$/, "");
};

const getPageHref = (basePath: string, page: number) => {
  if (page <= 1) {
    return basePath;
  }

  if (basePath === "/") {
    return `/page/${page}`;
  }

  return `${basePath}/page/${page}`;
};

const PAGE_PLACEHOLDER = "{page}";

const getCurrentPageAriaLabel = (label: string, pageLabel: string, page: number) => {
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

const Pagination = ({
  basePath,
  currentPage,
  totalPages,
  ariaLabel,
  firstLabel,
  lastLabel,
  prevLabel,
  nextLabel,
  pageLabel,
  goToPageLabel,
  currentPageLabel,
  className,
}: PaginationProps) => {
  if (totalPages <= 1) {
    return null;
  }

  const safeTotalPages = Math.max(1, totalPages);
  const safeCurrentPage = Math.min(Math.max(currentPage, 1), safeTotalPages);
  const safeBasePath = normalizeBasePath(basePath);
  const pageItems = getPageItems(safeCurrentPage, safeTotalPages);
  const hasPrevious = safeCurrentPage > 1;
  const hasNext = safeCurrentPage < safeTotalPages;
  const hasFirst = safeCurrentPage > 1;
  const hasLast = safeCurrentPage < safeTotalPages;
  const firstHref = getPageHref(safeBasePath, 1);
  const lastHref = getPageHref(safeBasePath, safeTotalPages);
  const previousHref = getPageHref(safeBasePath, safeCurrentPage - 1);
  const nextHref = getPageHref(safeBasePath, safeCurrentPage + 1);

  const baseButtonClassName =
    "inline-flex min-w-9 h-9 items-center justify-center rounded-md border text-sm transition-colors duration-200 outline-none focus-visible:ring-2 focus-visible:ring-white/20";
  const defaultButtonClassName =
    "border-gray-800 text-gray-400 hover:text-white hover:border-gray-700";
  const activeButtonClassName = "bg-white/10 border-white/30 text-white";
  const disabledButtonClassName = "border-gray-800 text-gray-600 cursor-not-allowed pointer-events-none";

  return (
    <nav aria-label={ariaLabel} className={className}>
      <ul className="flex flex-wrap items-center justify-center gap-2">
        <li>
          {hasFirst ? (
            <Link
              href={firstHref}
              aria-label={firstLabel}
              className={combineClassNames(
                baseButtonClassName,
                defaultButtonClassName,
                "px-2 hidden sm:inline-flex"
              )}
            >
              {firstLabel}
            </Link>
          ) : (
            <span
              aria-label={firstLabel}
              aria-disabled="true"
              className={combineClassNames(
                baseButtonClassName,
                disabledButtonClassName,
                "px-2 hidden sm:inline-flex"
              )}
            >
              {firstLabel}
            </span>
          )}
        </li>

        <li>
          {hasPrevious ? (
            <Link
              href={previousHref}
              aria-label={prevLabel}
              className={combineClassNames(baseButtonClassName, defaultButtonClassName)}
            >
              <ArrowLeft className="h-4 w-4" aria-hidden="true" />
              <span className="sr-only">{prevLabel}</span>
            </Link>
          ) : (
            <span
              aria-label={prevLabel}
              aria-disabled="true"
              className={combineClassNames(baseButtonClassName, disabledButtonClassName)}
            >
              <ArrowLeft className="h-4 w-4" aria-hidden="true" />
              <span className="sr-only">{prevLabel}</span>
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
          const href = getPageHref(safeBasePath, item);

          return (
            <li key={item}>
              {isCurrent ? (
                <span
                  aria-label={getCurrentPageAriaLabel(currentPageLabel, pageLabel, item)}
                  aria-current="page"
                  className={combineClassNames(baseButtonClassName, activeButtonClassName)}
                >
                  {item}
                </span>
              ) : (
                <Link
                  href={href}
                  aria-label={`${goToPageLabel}: ${pageLabel} ${item}`}
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
              href={nextHref}
              aria-label={nextLabel}
              className={combineClassNames(baseButtonClassName, defaultButtonClassName)}
            >
              <ArrowRight className="h-4 w-4" aria-hidden="true" />
              <span className="sr-only">{nextLabel}</span>
            </Link>
          ) : (
            <span
              aria-label={nextLabel}
              aria-disabled="true"
              className={combineClassNames(baseButtonClassName, disabledButtonClassName)}
            >
              <ArrowRight className="h-4 w-4" aria-hidden="true" />
              <span className="sr-only">{nextLabel}</span>
            </span>
          )}
        </li>

        <li>
          {hasLast ? (
            <Link
              href={lastHref}
              aria-label={lastLabel}
              className={combineClassNames(
                baseButtonClassName,
                defaultButtonClassName,
                "px-2 hidden sm:inline-flex"
              )}
            >
              {lastLabel}
            </Link>
          ) : (
            <span
              aria-label={lastLabel}
              aria-disabled="true"
              className={combineClassNames(
                baseButtonClassName,
                disabledButtonClassName,
                "px-2 hidden sm:inline-flex"
              )}
            >
              {lastLabel}
            </span>
          )}
        </li>
      </ul>
    </nav>
  );
};

export type { PaginationProps };
export default Pagination;
