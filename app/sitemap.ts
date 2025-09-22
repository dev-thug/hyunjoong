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
    // 앵커 링크들도 포함하여 검색엔진이 페이지 구조를 더 잘 이해하도록 함
    {
      url: `${base}/#about`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.9,
    },
    {
      url: `${base}/#skills`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.9,
    },
    {
      url: `${base}/#experience`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.9,
    },
    {
      url: `${base}/#contact`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.8,
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
