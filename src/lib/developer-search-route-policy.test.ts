import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import path from "node:path";
import test from "node:test";

const root = process.cwd();
const readRoute = (relativePath: string): string =>
  readFileSync(path.join(root, "src/app/[lang]", relativePath), "utf8");

const routeCases = [
  ["page.tsx", "home"],
  ["profile/page.tsx", "profile"],
  ["projects/page.tsx", "projects"],
  ["blog/page.tsx", "blog"],
  ["contact/page.tsx", "contact"],
] as const;

for (const [relativePath, surface] of routeCases) {
  test(`connects ${surface} route metadata to the developer-search policy`, () => {
    const source = readRoute(relativePath);
    assert.match(
      source,
      new RegExp(`getDeveloperSearchMetadata\\(lang,\\s*["']${surface}["']\\)`)
    );
    assert.match(source, /title:\s*(?:\{\s*absolute:\s*)?searchMetadata\.title/);
    assert.match(source, /description:\s*searchMetadata\.description/);
    assert.match(source, /keywords:\s*(?:\[\.\.\.)?searchMetadata\.keywords/);
  });
}

test("connects valid blog pagination metadata to its page-number policy", () => {
  const source = readRoute("blog/page/[page]/page.tsx");
  assert.match(
    source,
    /getBlogPaginationSearchMetadata\(lang,\s*parsedPage\)/
  );
  assert.match(source, /title:\s*searchMetadata\.title/);
  assert.match(source, /description:\s*searchMetadata\.description/);
  assert.match(source, /absoluteTitle:\s*true/);
});

test("keeps the unfiltered blog listing independent from search parameters", () => {
  const source = readRoute("blog/page.tsx");

  assert.doesNotMatch(source, /searchParams/);
  assert.match(
    source,
    /getPostsPage\(lang,\s*1,\s*BLOG_POSTS_PAGE_SIZE\)/
  );
});

test("keeps numbered archives independent from search parameters", () => {
  const source = readRoute("blog/page/[page]/page.tsx");

  assert.doesNotMatch(source, /searchParams/);
  assert.match(
    source,
    /getPostsPage\(lang,\s*parsedPage,\s*BLOG_POSTS_PAGE_SIZE\)/
  );
});

test("isolates filtered blog search as noindex server-rendered content", () => {
  const source = readRoute("blog/search/page.tsx");

  assert.match(source, /searchParams/);
  assert.match(source, /parseSearchQuery\(/);
  assert.match(source, /noIndex:\s*true/);
  assert.match(source, /path:\s*["']\/blog["']/);
  assert.doesNotMatch(source, /buildBlogSchema|safeJsonLdStringify/);
  assert.match(source, /getPostsPage\(lang,\s*1,\s*Number\.MAX_SAFE_INTEGER,\s*query\)/);
});
