import { parseSearchQuery } from "@/lib/search-query";

export type BlogSearchRouteDecision =
  | { readonly type: "rewrite"; readonly pathname: string; readonly query: string }
  | { readonly type: "redirect"; readonly pathname: string; readonly query?: string };

const LOCALIZED_BLOG_ROUTE = /^\/(ko|en)\/blog(?:\/page\/([^/]+)|\/search)?$/;

export const resolveBlogSearchRoute = (
  pathname: string,
  rawQuery: string | string[] | undefined
): BlogSearchRouteDecision | null => {
  const match = LOCALIZED_BLOG_ROUTE.exec(pathname);
  if (!match) {
    return null;
  }

  const [, lang, archivePage] = match;
  const isSearchRoute = pathname === `/${lang}/blog/search`;
  const query = parseSearchQuery(rawQuery);

  if (isSearchRoute) {
    return {
      type: "redirect",
      pathname: `/${lang}/blog`,
      ...(query ? { query } : {}),
    };
  }

  if (archivePage && query) {
    return { type: "redirect", pathname: `/${lang}/blog`, query };
  }

  if (!archivePage && query) {
    return { type: "rewrite", pathname: `/${lang}/blog/search`, query };
  }

  return null;
};
