import { shouldNoIndexDeployment } from "@/lib/indexing-policy";
import { MetadataRoute } from "next";
import { PUBLIC_PROFILE_REVIEWED_AT } from "@/data/public-profile";
import { BLOG_POSTS_PAGE_SIZE, getAllPosts } from "@/lib/posts";
import { getAllProjects } from "@/lib/projects";
import { getSiteBaseUrl } from "@/lib/site-config";
export const revalidate = 3600;

const toValidDate = (value?: string): Date | null => {
  if (!value || !/^\d{4}-\d{2}-\d{2}$/.test(value)) {
    return null;
  }
  const parsed = new Date(`${value}T00:00:00.000Z`);
  return !Number.isNaN(parsed.getTime()) &&
    parsed.toISOString().slice(0, 10) === value
    ? parsed
    : null;
};

const getLatestProjectUpdateDate = (
  projects: ReadonlyArray<{ updatedAt?: string }>
): Date | undefined => {
  let latest: Date | undefined;
  for (const project of projects) {
    const parsed = toValidDate(project.updatedAt);
    if (parsed && (!latest || parsed.getTime() > latest.getTime())) {
      latest = parsed;
    }
  }
  return latest;
};

/**
 * Dynamic sitemap generation for all pages, blog posts, and projects
 */
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  if (shouldNoIndexDeployment()) {
    return [];
  }

  const baseUrl = getSiteBaseUrl();

  // Fetch locale-specific blog posts and projects in parallel
  const [koPosts, enPosts, koProjects, enProjects] = await Promise.all([
    getAllPosts("ko"),
    getAllPosts("en"),
    getAllProjects("ko"),
    getAllProjects("en"),
  ]);
  const allPosts = [...koPosts, ...enPosts];
  const allProjects = [...koProjects, ...enProjects];
  const profileLastModified =
    toValidDate(PUBLIC_PROFILE_REVIEWED_AT) ?? undefined;
  const koProjectsLastModified = getLatestProjectUpdateDate(koProjects);
  const enProjectsLastModified = getLatestProjectUpdateDate(enProjects);

  // Build sets for bilingual pair detection
  const koPostSlugs = new Set(koPosts.map((p) => p.slug));
  const enPostSlugs = new Set(enPosts.map((p) => p.slug));

  const koProjectSlugs = new Set(koProjects.map((project) => project.slug));
  const enProjectSlugs = new Set(enProjects.map((project) => project.slug));

  // Helper: build hreflang alternates for a per-locale content URL.
  // Includes only locales where the slug exists. x-default points to the
  // Korean version when present, otherwise to the English version.
  const buildContentAlternates = (
    section: "blog" | "projects",
    slug: string,
    hasKo: boolean,
    hasEn: boolean
  ): { languages: Record<string, string> } | undefined => {
    const languages: Record<string, string> = {};
    if (hasKo) languages.ko = `${baseUrl}/ko/${section}/${slug}`;
    if (hasEn) languages.en = `${baseUrl}/en/${section}/${slug}`;
    if (hasKo) {
      languages["x-default"] = `${baseUrl}/ko/${section}/${slug}`;
    } else if (hasEn) {
      languages["x-default"] = `${baseUrl}/en/${section}/${slug}`;
    }
    if (Object.keys(languages).length === 0) return undefined;
    return { languages };
  };

  // Static routes always exist in both locales
  const staticAlternates = (path: string) => ({
    languages: {
      ko: `${baseUrl}/ko${path}`,
      en: `${baseUrl}/en${path}`,
      "x-default": `${baseUrl}/ko${path}`,
    },
  });

  const buildPaginationAlternates = (
    page: number,
    hasKo: boolean,
    hasEn: boolean
  ): { languages: Record<string, string> } => {
    const languages: Record<string, string> = {};
    if (hasKo) languages.ko = `${baseUrl}/ko/blog/page/${page}`;
    if (hasEn) languages.en = `${baseUrl}/en/blog/page/${page}`;
    languages["x-default"] = hasKo
      ? `${baseUrl}/ko/blog/page/${page}`
      : `${baseUrl}/en/blog/page/${page}`;
    return { languages };
  };

  // Static pages with their priorities and change frequencies
  const staticPages: MetadataRoute.Sitemap = [
    {
      url: `${baseUrl}/ko`,
      changeFrequency: "monthly",
      priority: 1.0,
      alternates: staticAlternates(""),
    },
    {
      url: `${baseUrl}/en`,
      changeFrequency: "monthly",
      priority: 1.0,
      alternates: staticAlternates(""),
    },
    {
      url: `${baseUrl}/ko/blog`,
      changeFrequency: "weekly",
      priority: 0.9,
      alternates: staticAlternates("/blog"),
    },
    {
      url: `${baseUrl}/en/blog`,
      changeFrequency: "weekly",
      priority: 0.9,
      alternates: staticAlternates("/blog"),
    },
    {
      url: `${baseUrl}/ko/projects`,
      ...(koProjectsLastModified ? { lastModified: koProjectsLastModified } : {}),
      changeFrequency: "weekly",
      priority: 0.9,
      alternates: staticAlternates("/projects"),
    },
    {
      url: `${baseUrl}/en/projects`,
      ...(enProjectsLastModified ? { lastModified: enProjectsLastModified } : {}),
      changeFrequency: "weekly",
      priority: 0.9,
      alternates: staticAlternates("/projects"),
    },
    {
      url: `${baseUrl}/ko/profile`,
      lastModified: profileLastModified,
      changeFrequency: "monthly",
      priority: 0.7,
      alternates: staticAlternates("/profile"),
    },
    {
      url: `${baseUrl}/en/profile`,
      lastModified: profileLastModified,
      changeFrequency: "monthly",
      priority: 0.7,
      alternates: staticAlternates("/profile"),
    },
    {
      url: `${baseUrl}/ko/contact`,
      changeFrequency: "monthly",
      priority: 0.7,
      alternates: staticAlternates("/contact"),
    },
    {
      url: `${baseUrl}/en/contact`,
      changeFrequency: "monthly",
      priority: 0.7,
      alternates: staticAlternates("/contact"),
    },
  ];

  // `post.date` is the visible publication date, not an update timestamp. Omit
  // lastModified until content metadata exposes a reviewed update date.
  const blogPages: MetadataRoute.Sitemap = allPosts.map((post) => {
    return {
      url: `${baseUrl}/${post.lang}/blog/${post.slug}`,
      changeFrequency: "monthly" as const,
      priority: 0.8,
      alternates: buildContentAlternates(
        "blog",
        post.slug,
        koPostSlugs.has(post.slug),
        enPostSlugs.has(post.slug)
      ),
    };
  });

  const koPageCount = Math.ceil(koPosts.length / BLOG_POSTS_PAGE_SIZE);
  const enPageCount = Math.ceil(enPosts.length / BLOG_POSTS_PAGE_SIZE);
  const paginationPages: MetadataRoute.Sitemap = [];
  for (let page = 2; page <= Math.max(koPageCount, enPageCount); page += 1) {
    const hasKo = page <= koPageCount;
    const hasEn = page <= enPageCount;
    const alternates = buildPaginationAlternates(page, hasKo, hasEn);
    if (hasKo) {
      paginationPages.push({
        url: `${baseUrl}/ko/blog/page/${page}`,
        changeFrequency: "weekly",
        priority: 0.6,
        alternates,
      });
    }
    if (hasEn) {
      paginationPages.push({
        url: `${baseUrl}/en/blog/page/${page}`,
        changeFrequency: "weekly",
        priority: 0.6,
        alternates,
      });
    }
  }

  // Project pages
  const projectPages: MetadataRoute.Sitemap = allProjects.map((project) => {
    const lastModified = toValidDate(project.updatedAt) ?? undefined;
    return {
      url: `${baseUrl}/${project.lang}/projects/${project.slug}`,
      ...(lastModified ? { lastModified } : {}),
      changeFrequency: "monthly" as const,
      priority: 0.8,
      alternates: buildContentAlternates(
        "projects",
        project.slug,
        koProjectSlugs.has(project.slug),
        enProjectSlugs.has(project.slug)
      ),
    };
  });

  return [...staticPages, ...paginationPages, ...blogPages, ...projectPages];
}
