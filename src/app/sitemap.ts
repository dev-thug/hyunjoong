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

  // Build sets for bilingual pair detection
  const koPostSlugs = new Set(koPosts.map((p) => p.slug));
  const enPostSlugs = new Set(enPosts.map((p) => p.slug));

  const koProjectSlugs = new Set(
    projectIdentifiers.filter((p) => p.lang === "ko").map((p) => p.slug)
  );
  const enProjectSlugs = new Set(
    projectIdentifiers.filter((p) => p.lang === "en").map((p) => p.slug)
  );

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

  // Static pages with their priorities and change frequencies
  const staticPages: MetadataRoute.Sitemap = [
    {
      url: `${baseUrl}/ko`,
      lastModified: contentLastModified,
      changeFrequency: "monthly",
      priority: 1.0,
      alternates: staticAlternates(""),
    },
    {
      url: `${baseUrl}/en`,
      lastModified: contentLastModified,
      changeFrequency: "monthly",
      priority: 1.0,
      alternates: staticAlternates(""),
    },
    {
      url: `${baseUrl}/ko/blog`,
      lastModified: contentLastModified,
      changeFrequency: "weekly",
      priority: 0.9,
      alternates: staticAlternates("/blog"),
    },
    {
      url: `${baseUrl}/en/blog`,
      lastModified: contentLastModified,
      changeFrequency: "weekly",
      priority: 0.9,
      alternates: staticAlternates("/blog"),
    },
    {
      url: `${baseUrl}/ko/projects`,
      lastModified: buildDate,
      changeFrequency: "weekly",
      priority: 0.9,
      alternates: staticAlternates("/projects"),
    },
    {
      url: `${baseUrl}/en/projects`,
      lastModified: buildDate,
      changeFrequency: "weekly",
      priority: 0.9,
      alternates: staticAlternates("/projects"),
    },
    {
      url: `${baseUrl}/ko/profile`,
      lastModified: buildDate,
      changeFrequency: "monthly",
      priority: 0.7,
      alternates: staticAlternates("/profile"),
    },
    {
      url: `${baseUrl}/en/profile`,
      lastModified: buildDate,
      changeFrequency: "monthly",
      priority: 0.7,
      alternates: staticAlternates("/profile"),
    },
    {
      url: `${baseUrl}/ko/contact`,
      lastModified: buildDate,
      changeFrequency: "monthly",
      priority: 0.7,
      alternates: staticAlternates("/contact"),
    },
    {
      url: `${baseUrl}/en/contact`,
      lastModified: buildDate,
      changeFrequency: "monthly",
      priority: 0.7,
      alternates: staticAlternates("/contact"),
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
      alternates: buildContentAlternates(
        "blog",
        post.slug,
        koPostSlugs.has(post.slug),
        enPostSlugs.has(post.slug)
      ),
    };
  });

  // Project pages
  const projectPages: MetadataRoute.Sitemap = projectIdentifiers.map(
    ({ slug, lang }) => ({
      url: `${baseUrl}/${lang}/projects/${slug}`,
      lastModified: buildDate,
      changeFrequency: "monthly" as const,
      priority: 0.8,
      alternates: buildContentAlternates(
        "projects",
        slug,
        koProjectSlugs.has(slug),
        enProjectSlugs.has(slug)
      ),
    })
  );

  return [...staticPages, ...blogPages, ...projectPages];
}
