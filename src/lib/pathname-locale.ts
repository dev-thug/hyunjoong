import { i18n, isSupportedLocale, type Locale } from "@/i18n-config";

export const getLocaleFromPathname = (
  pathname: string | null | undefined
): Locale => {
  const firstSegment = pathname?.split("/").filter(Boolean)[0] ?? "";

  return isSupportedLocale(firstSegment) ? firstSegment : i18n.defaultLocale;
};
