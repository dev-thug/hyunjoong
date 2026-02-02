import { MetadataRoute } from "next";

const DEFAULT_BASE_URL = "https://hyunjoong.kim";

/**
 * Robots.txt configuration for search engine crawling
 */
export default function robots(): MetadataRoute.Robots {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || DEFAULT_BASE_URL;
  return {
    rules: {
      userAgent: "*",
      allow: "/",
    },
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}
