import { cache } from "react";
import { getPostBySlug } from "@/lib/posts";
import { getProjectBySlug } from "@/lib/projects";
import type { Post } from "@/types/blog";
import type { Project } from "@/types/project";

// Editorial links connect implementation stories with the relevant engineering notes.
const PROJECT_READING: Readonly<Record<string, readonly string[]>> = {
  "graphrag-ai-agent-specify": ["post-rag-architecture-graphrag-hybrid-evaluation", "ai-agent-orchestration-architecture"],
  mamma: ["ai-agent-chatbot-mcp-guide", "serverless-pricing"],
  petty: ["agentic-workflow-architecture", "agent-observability-evals"],
};

export const getRelatedPostsForProject = cache(async (slug: string, lang: string): Promise<Post[]> => {
  const posts = await Promise.all((PROJECT_READING[slug] ?? []).map(postSlug => getPostBySlug(postSlug, lang)));
  return posts.filter((post): post is Post => post !== null && post.hidden !== true);
});

export const getRelatedProjectsForPost = cache(async (slug: string, lang: string): Promise<Project[]> => {
  const slugs = Object.entries(PROJECT_READING).filter(([, posts]) => posts.includes(slug)).map(([project]) => project);
  const projects = await Promise.all(slugs.map(projectSlug => getProjectBySlug(projectSlug, lang)));
  return projects.filter((project): project is Project => project !== null);
});
