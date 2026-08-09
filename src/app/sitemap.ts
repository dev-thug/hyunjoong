import { MetadataRoute } from "next";
import { PUBLIC_PROFILE_REVIEWED_AT } from "@/data/public-profile";
import { BLOG_POSTS_PAGE_SIZE, getAllPosts } from "@/lib/posts";
import { getProjectIdentifiers } from "@/lib/projects";
import { getSiteBaseUrl } from "@/lib/site-config";
export const revalidate = 3600;

const toValidDate = (value?: string): Date | null => {
  if (!value) {
    return null;
  }
  const parsed = new Date(value);
  return Number.isNaN(parsed.getTime()) ? null : parsed;
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
  const latestPostDate = getLatestPostDate(allPosts);
  const contentLastModified = latestPostDate ?? undefined;
  const profileLastModified =
    toValidDate(`${PUBLIC_PROFILE_REVIEWED_AT}T00:00:00.000Z`) ?? undefined;

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
      changeFrequency: "weekly",
      priority: 0.9,
      alternates: staticAlternates("/projects"),
    },
    {
      url: `${baseUrl}/en/projects`,
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

  // Blog post pages (lastModified from verified post date; omit if invalid)
  const blogPages: MetadataRoute.Sitemap = allPosts.map((post) => {
    const parsed = toValidDate(`${post.date}T00:00:00.000Z`);
    const lastModified = parsed ?? undefined;
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
        lastModified: contentLastModified,
        changeFrequency: "weekly",
        priority: 0.6,
        alternates,
      });
    }
    if (hasEn) {
      paginationPages.push({
        url: `${baseUrl}/en/blog/page/${page}`,
        lastModified: contentLastModified,
        changeFrequency: "weekly",
        priority: 0.6,
        alternates,
      });
    }
  }

  // Project pages
  const projectPages: MetadataRoute.Sitemap = projectIdentifiers.map(
    ({ slug, lang }) => ({
      url: `${baseUrl}/${lang}/projects/${slug}`,
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

  return [...staticPages, ...paginationPages, ...blogPages, ...projectPages];
}
