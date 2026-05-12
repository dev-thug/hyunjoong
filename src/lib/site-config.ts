export const DEFAULT_BASE_URL = "https://hyunjoong.kim";
export const SITE_NAME = "Hyunjoong Kim";
export const DEFAULT_OG_IMAGE = "/images/og-profile.png";
export const NOT_FOUND_METADATA_TITLE = `Not Found | ${SITE_NAME}`;

// Build-time constant: `NEXT_PUBLIC_BASE_URL` is baked at build, never changes.
// Memoize at module load so OG/sitemap/JSON-LD callers don't re-read env + run
// the trailing-slash regex on every metadata call.
const RESOLVED_BASE_URL = (
  process.env.NEXT_PUBLIC_BASE_URL || DEFAULT_BASE_URL
).replace(/\/+$/, "");

// One-time dev-mode warning: missing NEXT_PUBLIC_BASE_URL will silently
// fall back to the production URL, which produces wrong absolute links
// (sitemap, OG tags, JSON-LD) when developing locally. Emit a single
// console.warn at module load so the misconfiguration is visible.
if (
  process.env.NODE_ENV === "development" &&
  !process.env.NEXT_PUBLIC_BASE_URL
) {
  console.warn(
    `[site-config] NEXT_PUBLIC_BASE_URL is not set; falling back to ${DEFAULT_BASE_URL}. ` +
      `Set NEXT_PUBLIC_BASE_URL in .env.local (e.g. http://localhost:3000) to silence this warning.`
  );
}

export const getSiteBaseUrl = (): string => RESOLVED_BASE_URL;

export const toAbsoluteSiteUrl = (path: string): string => {
  const normalizedPath = path.startsWith("/") ? path : `/${path}`;
  return `${RESOLVED_BASE_URL}${normalizedPath}`;
};
