import { shouldNoIndexDeployment } from "@/lib/indexing-policy";
import { MetadataRoute } from "next";
import { getSiteBaseUrl } from "@/lib/site-config";

/**
 * Robots.txt configuration for search engine crawling
 */
export default function robots(): MetadataRoute.Robots {
  if (shouldNoIndexDeployment()) {
    // Keep previews crawlable so the deployment's X-Robots-Tag noindex header
    // can be observed by search crawlers.
    return { rules: [{ userAgent: "*", allow: "/" }] };
  }

  const baseUrl = getSiteBaseUrl();
  // Search and training can have distinct controls (for example, OAI-SearchBot
  // vs. GPTBot and Claude-SearchBot vs. ClaudeBot). Google-Extended is separate
  // from Googlebot and does not affect Google Search ranking. The site's current
  // policy remains public access for every crawler; that is not a ranking promise.
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
      },
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
    host: baseUrl,
  };
}
