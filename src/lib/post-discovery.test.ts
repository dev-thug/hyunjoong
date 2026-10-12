import assert from "node:assert/strict";
import test from "node:test";
import { rankRelatedPosts, resolvePostImage } from "./post-discovery";
import type { Post } from "@/types/blog";

const post = (slug: string, overrides: Partial<Post> = {}): Post => ({ slug, lang: "ko", title: slug, excerpt: slug, category: "Engineering", date: "2026-10-12", readTime: "5 min", keywords: ["AI", "Telegram Bot"], ...overrides });

test("uses real article images and skips fenced examples and unsafe paths", () => {
  assert.equal(resolvePostImage('```tsx\n<BlogImage src="/images/example.png" />\n```\n<BlogImage src="/images/real.png" />'), "/images/real.png");
  assert.equal(resolvePostImage('![diagram](/images/diagram.webp)'), "/images/diagram.webp");
  assert.equal(resolvePostImage('<BlogImage src="/images/real.png" />', "/images/cover.png"), "/images/cover.png");
  assert.equal(resolvePostImage("no image"), undefined);
  assert.equal(resolvePostImage("", "/images/../private"), undefined);
});

test("related links exclude self, hidden, other languages and generic topic matches", () => {
  const current = post("current");
  const candidates = [current, post("hidden", { hidden: true }), post("english", { lang: "en" }), post("generic", { keywords: ["AI"] }), post("related", { keywords: ["telegram-bot"] }), post("unrelated", { keywords: ["Next.js"] })];
  assert.deepEqual(rankRelatedPosts(current, candidates).map(p => p.slug), ["related"]);
  assert.deepEqual(rankRelatedPosts(current, candidates, 0), []);
});
