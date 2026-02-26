import { MetadataRoute } from "next";
import { DEFAULT_BASE_URL } from "@/lib/site-config";

/**
 * Robots.txt configuration for search engine crawling
 */
export default function robots(): MetadataRoute.Robots {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || DEFAULT_BASE_URL;
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
