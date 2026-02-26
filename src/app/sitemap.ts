import { MetadataRoute } from "next";
import { getAllPosts } from "@/lib/posts";
import { getProjectIdentifiers } from "@/lib/projects";
import { getSiteBaseUrl } from "@/lib/site-config";
export const revalidate = 3600;
const BUILD_DATE_ENV_KEYS = [
  "VERCEL_GIT_COMMIT_DATE",
  "NEXT_PUBLIC_BUILD_DATE",
] as const;

const toValidDate = (value?: string): Date | null => {
  if (!value) {
    return null;
  }
  const parsed = new Date(value);
  return Number.isNaN(parsed.getTime()) ? null : parsed;
};

const getBuildDate = (): Date => {
  for (const key of BUILD_DATE_ENV_KEYS) {
    const parsed = toValidDate(process.env[key]);
    if (parsed) {
      return parsed;
    }
  }
  return new Date();
};

const getLatestPostDate = (posts: Array<{ date: string }>): Date | null => {
  return posts.reduce<Date | null>((latest, post) => {
    const parsed = toValidDate(`${post.date}T00:00:00.000Z`);
    if (!parsed) {
      return latest;
    }
    if (!latest) {
      return parsed;
    }
    return parsed.getTime() > latest.getTime() ? parsed : latest;
  }, null);
};

/**
 * Dynamic sitemap generation for all pages, blog posts, and projects
 */
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = getSiteBaseUrl();

  // Fetch locale-specific blog posts and projects in parallel
  const [koPosts, enPosts, projectIdentifiers] = await Promise.all([
    getAllPosts("ko"),
    getAllPosts("en"),
    getProjectIdentifiers(),
  ]);
  const allPosts = [...koPosts, ...enPosts];
  const buildDate = getBuildDate();
  const latestPostDate = getLatestPostDate(allPosts);
  const contentLastModified = latestPostDate ?? buildDate;

  // Static pages with their priorities and change frequencies
  const staticPages: MetadataRoute.Sitemap = [
    {
      url: `${baseUrl}/ko`,
      lastModified: contentLastModified,
      changeFrequency: "monthly",
      priority: 1.0,
    },
    {
      url: `${baseUrl}/en`,
      lastModified: contentLastModified,
      changeFrequency: "monthly",
      priority: 1.0,
    },
    {
      url: `${baseUrl}/ko/blog`,
      lastModified: contentLastModified,
      changeFrequency: "weekly",
      priority: 0.9,
    },
    {
      url: `${baseUrl}/en/blog`,
      lastModified: contentLastModified,
      changeFrequency: "weekly",
      priority: 0.9,
    },
    {
      url: `${baseUrl}/ko/projects`,
      lastModified: buildDate,
      changeFrequency: "weekly",
      priority: 0.9,
    },
    {
      url: `${baseUrl}/en/projects`,
      lastModified: buildDate,
      changeFrequency: "weekly",
      priority: 0.9,
    },
    {
      url: `${baseUrl}/ko/profile`,
      lastModified: buildDate,
      changeFrequency: "monthly",
      priority: 0.7,
    },
    {
      url: `${baseUrl}/en/profile`,
      lastModified: buildDate,
      changeFrequency: "monthly",
      priority: 0.7,
    },
  ];

  // Blog post pages (lastModified from post date; fallback to now if invalid)
  const blogPages: MetadataRoute.Sitemap = allPosts.map((post) => {
    const parsed = toValidDate(`${post.date}T00:00:00.000Z`);
    const lastModified = parsed ?? buildDate;
    return {
      url: `${baseUrl}/${post.lang}/blog/${post.slug}`,
      lastModified,
      changeFrequency: "monthly" as const,
      priority: 0.8,
    };
  });

  // Project pages
  const projectPages: MetadataRoute.Sitemap = projectIdentifiers.map(
    ({ slug, lang }) => ({
      url: `${baseUrl}/${lang}/projects/${slug}`,
      lastModified: buildDate,
      changeFrequency: "monthly" as const,
      priority: 0.8,
    })
  );

  return [...staticPages, ...blogPages, ...projectPages];
}
