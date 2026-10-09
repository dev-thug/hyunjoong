import assert from "node:assert/strict";
import test from "node:test";
import { getAllPosts } from "@/lib/posts";
import { getAllProjects } from "@/lib/projects";
import { getSiteBaseUrl } from "@/lib/site-config";
import {
  buildAiDiscoveryDocuments,
  getAiDiscoveryData,
} from "@/lib/ai-discovery";
import type { Post } from "@/types/blog";
import type { Project } from "@/types/project";

const post = (overrides: Partial<Post> = {}): Post => ({
  slug: "visible-post",
  lang: "en",
  title: "Visible post",
  excerpt: "A short summary of the visible article.",
  category: "Engineering",
  date: "2026-09-10",
  readTime: "4 min",
  ...overrides,
});

const project: Project = {
  id: "p1",
  slug: "visible-project",
  title: "Visible project",
  adCopy: "A compact project summary.",
  description: "The project description.",
  highlight: "A project highlight.",
  image: "/images/projects/example.webp",
  lang: "en",
  tags: ["engineering"],
  metrics: [],
};

test("builds a short bilingual discovery file with canonical source links", async () => {
  const data = await getAiDiscoveryData();
  const documents = buildAiDiscoveryDocuments(data);

  assert.match(documents.summary, /^# Hyunjoong Kim/m);
  assert.match(documents.summary, /\[한국어 프로필\]\(https:\/\/hyunjoong\.kim\/ko\/profile\)/);
  assert.match(documents.summary, /\[English profile\]\(https:\/\/hyunjoong\.kim\/en\/profile\)/);
  assert.match(documents.summary, /\[Complete public-page index\]\(https:\/\/hyunjoong\.kim\/llms-full\.txt\)/);
  assert.match(documents.summary, /does not guarantee.*index or cite a page/i);
  assert.ok(documents.summary.length < documents.full.length);
  for (const lang of ["ko", "en"]) {
    for (const slug of ["graphrag-ai-agent-specify", "mamma", "petty"]) {
      assert.ok(documents.summary.includes(`/${lang}/projects/${slug}`), `Missing primary product: ${lang}/${slug}`);
    }
  }
});

test("the complete index lists public posts and projects for each locale", async () => {
  const [data, koPosts, enPosts, koProjects, enProjects] = await Promise.all([
    getAiDiscoveryData(),
    getAllPosts("ko"),
    getAllPosts("en"),
    getAllProjects("ko"),
    getAllProjects("en"),
  ]);
  const documents = buildAiDiscoveryDocuments(data);

  for (const content of [
    ...koPosts.map((entry) => ({ ...entry, lang: "ko" as const, section: "blog" })),
    ...enPosts.map((entry) => ({ ...entry, lang: "en" as const, section: "blog" })),
    ...koProjects.map((entry) => ({ ...entry, section: "projects" })),
    ...enProjects.map((entry) => ({ ...entry, section: "projects" })),
  ]) {
    const expectedPath = `/${content.lang}/${content.section}/${content.slug}`;
    assert.ok(documents.full.includes(expectedPath), `missing ${expectedPath}`);
  }

  assert.equal(data.baseUrl, getSiteBaseUrl());
});

test("filters hidden posts from both discovery files and escapes markdown links", () => {
  const documents = buildAiDiscoveryDocuments({
    baseUrl: "https://hyunjoong.kim",
    posts: [
      post({ title: "Visible [draft] post" }),
      post({
        slug: "hidden-post",
        title: "Hidden [draft] post",
        hidden: true,
      }),
    ],
    projects: [project],
  });

  assert.ok(documents.summary.includes("[Visible \\[draft\\] post]"));
  assert.doesNotMatch(documents.summary, /hidden-post|Hidden \[draft\] post/);
  assert.doesNotMatch(documents.full, /hidden-post|Hidden \[draft\] post/);
  assert.ok(documents.full.includes("[Visible \\[draft\\] post]"));
});
