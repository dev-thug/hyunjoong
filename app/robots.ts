import { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://hyunjoong.kim";

  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/private/", "/admin/", "/api/"],
        crawlDelay: 1,
      },
      {
        userAgent: "Googlebot",
        allow: "/",
        disallow: ["/private/", "/admin/"],
        crawlDelay: 0,
      },
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
    host: baseUrl,
  };
}
