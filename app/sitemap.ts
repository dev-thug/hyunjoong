import { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  const base = process.env.NEXT_PUBLIC_SITE_URL ?? "https://hyunjoong.kim";
  const now = new Date();

  return [
    {
      url: `${base}/`,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 1,
    },
    // 향후 추가될 페이지들을 위한 확장성 고려
    // {
    //   url: `${base}/projects`,
    //   lastModified: now,
    //   changeFrequency: "monthly",
    //   priority: 0.8,
    // },
    // {
    //   url: `${base}/blog`,
    //   lastModified: now,
    //   changeFrequency: "weekly",
    //   priority: 0.7,
    // },
  ];
}
