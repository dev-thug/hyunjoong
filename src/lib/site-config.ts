export const DEFAULT_BASE_URL = "https://hyunjoong.kim";
export const SITE_NAME = "Hyunjoong Kim";
export const DEFAULT_OG_IMAGE = "/images/og-profile.png";

export const getSiteBaseUrl = (): string =>
  process.env.NEXT_PUBLIC_BASE_URL || DEFAULT_BASE_URL;

export const toAbsoluteSiteUrl = (path: string): string => {
  const normalizedPath = path.startsWith("/") ? path : `/${path}`;
  return `${getSiteBaseUrl()}${normalizedPath}`;
};
