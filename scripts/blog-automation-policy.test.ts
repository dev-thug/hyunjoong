import assert from "node:assert/strict";
import test from "node:test";
import {
  BLOG_AUTOMATION_POLICY_START_DATE,
  parseBlogAutomationRecord,
  validateBlogAutomationPolicy,
  type BlogAutomationRecord,
} from "./blog-automation-policy";

const record = (
  overrides: Partial<BlogAutomationRecord> = {}
): BlogAutomationRecord => ({
  filePath: "src/content/posts/reliable-agents.ko.mdx",
  slug: "reliable-agents",
  lang: "ko",
  date: BLOG_AUTOMATION_POLICY_START_DATE,
  category: "Engineering",
  hidden: false,
  keywordsFormat: "array",
  ...overrides,
});

test("accepts a policy-compliant Korean and English post pair", () => {
  const issues = validateBlogAutomationPolicy([
    record(),
    record({
      filePath: "src/content/posts/reliable-agents.en.mdx",
      lang: "en",
    }),
  ]);

  assert.deepEqual(issues, []);
});

test("rejects a new post that is missing its bilingual counterpart", () => {
  const issues = validateBlogAutomationPolicy([record()]);

  assert.ok(issues.some((issue) => issue.code === "MISSING_TRANSLATION"));
});

test("rejects pair metadata that can create inconsistent locale pages", () => {
  const issues = validateBlogAutomationPolicy([
    record(),
    record({
      filePath: "src/content/posts/reliable-agents.en.mdx",
      lang: "en",
      date: "2026-08-10",
      category: "Insight",
      hidden: true,
    }),
  ]);

  assert.deepEqual(
    new Set(issues.map((issue) => issue.code)),
    new Set(["PAIR_DATE_MISMATCH", "PAIR_CATEGORY_MISMATCH", "PAIR_VISIBILITY_MISMATCH"])
  );
});

test("requires array keywords for newly automated content", () => {
  const issues = validateBlogAutomationPolicy([
    record({ keywordsFormat: "string" }),
    record({
      filePath: "src/content/posts/reliable-agents.en.mdx",
      lang: "en",
    }),
  ]);

  assert.ok(issues.some((issue) => issue.code === "KEYWORDS_ARRAY_REQUIRED"));
});

test("grandfathers legacy single-locale posts before the policy boundary", () => {
  const issues = validateBlogAutomationPolicy([
    record({
      filePath: "src/content/posts/ai-agent-engineering-complete-guide.ko.mdx",
      slug: "ai-agent-engineering-complete-guide",
      date: "2026-08-08",
      lang: "ko",
    }),
  ]);

  assert.deepEqual(issues, []);
});

test("rejects an unknown backdated single-locale post", () => {
  const issues = validateBlogAutomationPolicy([
    record({
      filePath: "src/content/posts/backdated.ko.mdx",
      slug: "backdated",
      date: "2020-01-01",
      lang: "ko",
    }),
  ]);

  assert.deepEqual(issues.map((issue) => issue.code), ["MISSING_TRANSLATION"]);
});

test("parses automation policy fields from an MDX metadata export", () => {
  const parsed = parseBlogAutomationRecord(
    "src/content/posts/reliable-agents.en.mdx",
    `export const metadata = {
      title: "Reliable Agents",
      excerpt: "A practical guide",
      category: "Engineering",
      date: "2026-08-09",
      readTime: "7 min",
      lang: "en",
      keywords: ["AI agents", "reliability"],
      hidden: false,
    };`
  );

  assert.deepEqual(parsed, {
    filePath: "src/content/posts/reliable-agents.en.mdx",
    slug: "reliable-agents",
    lang: "en",
    date: "2026-08-09",
    category: "Engineering",
    hidden: false,
    keywordsFormat: "array",
  });
});

test("ignores files that the primary content validator will reject", () => {
  assert.equal(
    parseBlogAutomationRecord(
      "src/content/posts/broken.ko.mdx",
      "# metadata export is missing"
    ),
    null
  );
});

test("classifies empty and non-string keyword arrays as invalid", () => {
  const source = (keywords: string) => `
export const metadata = {
  title: "Test",
  category: "Engineering",
  date: "2026-08-09",
  lang: "ko",
  keywords: ${keywords},
};
`;

  assert.equal(
    parseBlogAutomationRecord("empty.ko.mdx", source("[]"))?.keywordsFormat,
    "invalid-array"
  );
  assert.equal(
    parseBlogAutomationRecord("numeric.ko.mdx", source("[1]"))?.keywordsFormat,
    "invalid-array"
  );
  assert.equal(
    parseBlogAutomationRecord("mixed.ko.mdx", source('["valid", 1]'))?.keywordsFormat,
    "invalid-array"
  );
});
