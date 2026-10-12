import type { Post } from "@/types/blog";

/** Use a real article image, ignoring examples inside fenced code blocks. */
export const resolvePostImage = (source: string, explicit?: string): string | undefined => {
  const body = source.replace(/(?:^|\n)[ \t]*(`{3,}|~{3,})[^\n]*\n[\s\S]*?\n[ \t]*\1[^\n]*(?=\n|$)/g, "");
  const candidate = explicit ?? body.match(/<BlogImage\b[^>]*\bsrc="([^"]+)"/)?.[1]
    ?? body.match(/!\[[^\]]*\]\((\/images\/[^\s)]+)\)/)?.[1];
  return candidate?.startsWith("/images/") && !candidate.includes("..") ? candidate : undefined;
};

const normalize = (value: string): string => value.normalize("NFKC").toLowerCase().replace(/[^\p{L}\p{N}]+/gu, " ").trim();
const broadTopics = new Set(["ai", "ai agent", "ai agents", "ai 에이전트", "automation", "engineering", "개발"]);
const topics = (post: Post): Set<string> => new Set((post.keywords ?? []).map(normalize).filter(value => value && !broadTopics.has(value)));

/** Link only genuinely overlapping topics, within the reader's language. */
export const rankRelatedPosts = (post: Post, candidates: readonly Post[], limit = 3): Post[] => {
  const currentTopics = topics(post);
  return candidates
    .filter(candidate => candidate.slug !== post.slug && candidate.lang === post.lang && !candidate.hidden)
    .map(candidate => ({ candidate, score: [...topics(candidate)].filter(topic => currentTopics.has(topic)).length }))
    .filter(entry => entry.score > 0)
    .sort((a, b) => b.score - a.score || b.candidate.date.localeCompare(a.candidate.date) || a.candidate.slug.localeCompare(b.candidate.slug))
    .slice(0, Math.max(0, limit))
    .map(entry => entry.candidate);
};
