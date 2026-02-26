import { SITE_NAME } from "@/lib/site-config";

export const safeJsonLdStringify = (value: unknown): string =>
  JSON.stringify(value).replace(/</g, "\\u003c");

export const buildSitePerson = (baseUrl: string) => ({
  "@type": "Person",
  name: SITE_NAME,
  url: baseUrl,
});

export const buildSitePublisher = (baseUrl: string, logoUrl: string) => ({
  "@type": "Organization",
  name: SITE_NAME,
  logo: {
    "@type": "ImageObject",
    url: logoUrl,
  },
  url: baseUrl,
});
