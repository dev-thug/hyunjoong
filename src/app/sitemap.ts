import { MetadataRoute } from "next";
import { getAllPosts } from "@/lib/posts";
import { getProjectIdentifiers } from "@/lib/projects";

const DEFAULT_BASE_URL = "https://hyunjoong.kim";

/**
 * Dynamic sitemap generation for all pages, blog posts, and projects
 */
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || DEFAULT_BASE_URL;

  // Fetch all blog posts (with date for lastModified) and projects in parallel
  const [allPosts, projectIdentifiers] = await Promise.all([
    getAllPosts(),
    getProjectIdentifiers(),
  ]);

  // Static pages with their priorities and change frequencies
  const staticPages: MetadataRoute.Sitemap = [
    {
      url: `${baseUrl}/ko`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 1.0,
    },
    {
      url: `${baseUrl}/en`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 1.0,
    },
    {
      url: `${baseUrl}/ko/blog`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.9,
    },
    {
      url: `${baseUrl}/en/blog`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.9,
    },
    {
      url: `${baseUrl}/ko/projects`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.9,
    },
    {
      url: `${baseUrl}/en/projects`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.9,
    },
    {
      url: `${baseUrl}/ko/profile`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.7,
    },
    {
      url: `${baseUrl}/en/profile`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.7,
    },
  ];

  // Blog post pages (lastModified from post date; fallback to now if invalid)
  const blogPages: MetadataRoute.Sitemap = allPosts.map((post) => {
    const parsed = post.date ? new Date(post.date) : null;
    const lastModified =
      parsed && !Number.isNaN(parsed.getTime()) ? parsed : new Date();
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
      lastModified: new Date(),
      changeFrequency: "monthly" as const,
      priority: 0.8,
    })
  );

  return [...staticPages, ...blogPages, ...projectPages];
}
