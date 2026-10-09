import { PUBLIC_PROFILE, getPublicProfile } from "@/data/public-profile";
import type { Locale } from "@/i18n-config";
import { getAllPosts } from "@/lib/posts";
import { getAllProjects } from "@/lib/projects";
import { getSiteBaseUrl } from "@/lib/site-config";
import type { Post } from "@/types/blog";
import type { Project } from "@/types/project";

export interface AiDiscoveryData {
  readonly baseUrl: string;
  readonly posts: readonly Post[];
  readonly projects: readonly Project[];
}

export interface AiDiscoveryDocuments {
  readonly summary: string;
  readonly full: string;
}

const normalizeInlineText = (value: string): string =>
  value
    .replace(/\s+/g, " ")
    .trim()
    .replace(/\\/g, "\\\\")
    .replace(/\[/g, "\\[")
    .replace(/\]/g, "\\]")
    .replace(/\|/g, "\\|");

const makeLink = (label: string, url: string, description?: string): string =>
  `- [${normalizeInlineText(label)}](${url})${
    description ? `: ${normalizeInlineText(description)}` : ""
  }`;

const sortPosts = (posts: readonly Post[], lang: Locale): Post[] =>
  posts
    .filter((post) => post.lang === lang && post.hidden !== true)
    .slice()
    .sort((left, right) => {
      const dateOrder = right.date.localeCompare(left.date);
      return dateOrder !== 0 ? dateOrder : left.slug.localeCompare(right.slug);
    });

const projectsForLocale = (
  projects: readonly Project[],
  lang: Locale
): Project[] => projects.filter((project) => project.lang === lang);

const sectionUrl = (
  baseUrl: string,
  lang: Locale,
  section: "blog" | "projects",
  slug: string
): string => `${baseUrl}/${lang}/${section}/${slug}`;

const profileUrl = (baseUrl: string, lang: Locale): string =>
  `${baseUrl}/${lang}/profile`;

const homeUrl = (baseUrl: string, lang: Locale): string =>
  `${baseUrl}/${lang}`;

const formatPost = (baseUrl: string, post: Post): string =>
  makeLink(
    post.title,
    sectionUrl(baseUrl, post.lang, "blog", post.slug),
    `${post.date} publication date. ${post.excerpt}`
  );

const formatProject = (baseUrl: string, project: Project): string =>
  makeLink(
    project.title,
    sectionUrl(baseUrl, project.lang, "projects", project.slug),
    `${project.description} ${project.highlight}`
  );

const buildProfileLinks = (baseUrl: string): string[] => [
  makeLink("한국어 홈페이지", homeUrl(baseUrl, "ko")),
  makeLink("한국어 프로필", profileUrl(baseUrl, "ko"), getPublicProfile("ko").description),
  makeLink("English home", homeUrl(baseUrl, "en")),
  makeLink("English profile", profileUrl(baseUrl, "en"), getPublicProfile("en").description),
];

const buildSummary = (data: AiDiscoveryData): string => {
  const { baseUrl } = data;
  const topics = PUBLIC_PROFILE.knowsAbout.map(normalizeInlineText).join(", ");
  const selectedPosts = (["ko", "en"] as const).flatMap((lang) =>
    sortPosts(data.posts, lang).slice(0, 3).map((post) => formatPost(baseUrl, post))
  );
  const selectedProjects = (["ko", "en"] as const).flatMap((lang) =>
    projectsForLocale(data.projects, lang)
      .slice(0, 3)
      .map((project) => formatProject(baseUrl, project))
  );

  return [
    "# Hyunjoong Kim",
    "",
    "> The Korean-English engineering website of Hyunjoong Kim, a software engineer and founder of Specify. He independently operates Specify, Mamma, and Petty, connecting product planning, design, development, marketing, and sales. Project stories and articles document his first-hand engineering work.",
    "",
    `This is an optional discovery index. Crawler access is governed separately by [robots.txt](${baseUrl}/robots.txt). Publishing this file does not guarantee that a crawler will index or cite a page.`,
    "",
    `Topics: ${topics}.`,
    "",
    "## Start here",
    ...buildProfileLinks(baseUrl),
    makeLink("한국어 프로젝트", `${baseUrl}/ko/projects`),
    makeLink("English projects", `${baseUrl}/en/projects`),
    makeLink("한국어 글 목록", `${baseUrl}/ko/blog`),
    makeLink("English articles", `${baseUrl}/en/blog`),
    "",
    "## Selected projects",
    ...(selectedProjects.length ? selectedProjects : ["- No public projects are currently listed."]),
    "",
    "## Selected articles",
    ...(selectedPosts.length ? selectedPosts : ["- No public articles are currently listed."]),
    "",
    "## Optional",
    makeLink(
      "Complete public-page index",
      `${baseUrl}/llms-full.txt`,
      "All visible localized project and blog pages with their summaries. Linked pages remain the canonical sources."
    ),
    "",
  ].join("\n");
};

const buildFullIndex = (data: AiDiscoveryData): string => {
  const { baseUrl } = data;
  const lines = [
    "# Hyunjoong Kim — Complete Public-Page Index",
    "",
    "> A complete index of public profile, project, and published article pages in Korean and English.",
    "",
    "This file lists page titles and summaries; it is not a full-text export. Follow each link for the canonical page and its complete content. Blog dates below are publication dates, not last-modified dates.",
    "",
    "## Profiles",
    ...buildProfileLinks(baseUrl),
  ];

  for (const lang of ["ko", "en"] as const) {
    const localeLabel = lang === "ko" ? "한국어" : "English";
    const projects = projectsForLocale(data.projects, lang);
    const posts = sortPosts(data.posts, lang);

    lines.push("", `## ${localeLabel} projects`);
    if (projects.length === 0) {
      lines.push("- No public projects are currently listed.");
    } else {
      lines.push(...projects.map((project) => formatProject(baseUrl, project)));
    }

    lines.push("", `## ${localeLabel} articles`);
    if (posts.length === 0) {
      lines.push("- No public articles are currently listed.");
    } else {
      lines.push(...posts.map((post) => formatPost(baseUrl, post)));
    }
  }

  return `${lines.join("\n")}\n`;
};

export const buildAiDiscoveryDocuments = (
  data: AiDiscoveryData
): AiDiscoveryDocuments => ({
  summary: buildSummary(data),
  full: buildFullIndex(data),
});

export const getAiDiscoveryData = async (): Promise<AiDiscoveryData> => {
  const [posts, projects] = await Promise.all([getAllPosts(), getAllProjects()]);
  return {
    baseUrl: getSiteBaseUrl(),
    posts,
    projects,
  };
};
