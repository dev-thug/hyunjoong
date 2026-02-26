import { MetadataRoute } from "next";
import { getSiteBaseUrl } from "@/lib/site-config";

/**
 * Robots.txt configuration for search engine crawling
 */
export default function robots(): MetadataRoute.Robots {
  const baseUrl = getSiteBaseUrl();
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: [
          "/ko/blog?*",
          "/en/blog?*",
          "/ko/blog/page/*?*",
          "/en/blog/page/*?*",
        ],
      },
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
    host: baseUrl,
  };
}
