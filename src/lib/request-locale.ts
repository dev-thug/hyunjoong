import { i18n, isSupportedLocale, type Locale } from "@/i18n-config";

export interface HeaderLookup {
  get(name: string): string | null;
}

export const getRequestLocale = (headers: HeaderLookup): Locale => {
  const locale = headers.get("x-request-locale");
  return isSupportedLocale(locale) ? locale : i18n.defaultLocale;
};
