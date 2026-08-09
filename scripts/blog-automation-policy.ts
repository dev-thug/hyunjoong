import path from "node:path";
import {
  extractMetadataBlock,
  parseBoolean,
  parseContentFileName,
  parseQuotedString,
  parseStringArray,
} from "../src/lib/content-utils";

export const BLOG_AUTOMATION_POLICY_START_DATE = "2026-08-09";

const LEGACY_UNPAIRED_BLOG_SLUGS = new Set([
  "ai-agent-engineering-complete-guide",
  "claude-code-best-mcp-list",
  "claude-code-guide",
  "claude-code-mcp-optimization",
  "freelance-mindset",
  "nextjs16-portfolio-blog-architecture",
  "openclaw-mac-mini-telegram-ai-assistant",
  "rendering-patterns",
  "serverless-pricing",
]);

type BlogLocale = "ko" | "en";
type KeywordsFormat = "array" | "invalid-array" | "string" | "missing";

export interface BlogAutomationRecord {
  readonly filePath: string;
  readonly slug: string;
  readonly lang: BlogLocale;
  readonly date: string;
  readonly category: string;
  readonly hidden: boolean;
  readonly keywordsFormat: KeywordsFormat;
}

export type BlogAutomationIssueCode =
  | "MISSING_TRANSLATION"
  | "DUPLICATE_LOCALE"
  | "PAIR_DATE_MISMATCH"
  | "PAIR_CATEGORY_MISMATCH"
  | "PAIR_VISIBILITY_MISMATCH"
  | "KEYWORDS_ARRAY_REQUIRED";

export interface BlogAutomationIssue {
  readonly code: BlogAutomationIssueCode;
  readonly slug: string;
  readonly filePath: string;
  readonly message: string;
}

const locales: readonly BlogLocale[] = ["ko", "en"];

export function parseBlogAutomationRecord(
  filePath: string,
  source: string
): BlogAutomationRecord | null {
  const identifier = parseContentFileName(path.basename(filePath));
  const metadataBlock = extractMetadataBlock(source);
  if (!identifier || !metadataBlock) {
    return null;
  }

  const date = parseQuotedString(metadataBlock, "date");
  const category = parseQuotedString(metadataBlock, "category");
  const metadataLang = parseQuotedString(metadataBlock, "lang");
  if (!date || !category || metadataLang !== identifier.lang) {
    return null;
  }

  const keywordsArrayMatch = metadataBlock.match(/keywords:\s*\[([\s\S]*?)\]/);
  const keywordsArray = parseStringArray(metadataBlock, "keywords");
  const keywordsString = parseQuotedString(metadataBlock, "keywords");
  let keywordsFormat: KeywordsFormat = "missing";
  if (keywordsArrayMatch) {
    const invalidTokens = keywordsArrayMatch[1]
      .replace(/"[^"]*"/g, "")
      .replace(/[\s,]/g, "");
    keywordsFormat =
      keywordsArray &&
      keywordsArray.length > 0 &&
      keywordsArray.every((keyword) => keyword.trim().length > 0) &&
      invalidTokens.length === 0
        ? "array"
        : "invalid-array";
  } else if (keywordsString !== undefined) {
    keywordsFormat = "string";
  }

  return {
    filePath,
    slug: identifier.slug,
    lang: identifier.lang,
    date,
    category,
    hidden: parseBoolean(metadataBlock, "hidden") === true,
    keywordsFormat,
  };
}

export function validateBlogAutomationPolicy(
  records: readonly BlogAutomationRecord[],
  policyStartDate: string = BLOG_AUTOMATION_POLICY_START_DATE
): BlogAutomationIssue[] {
  const recordsBySlug = new Map<string, BlogAutomationRecord[]>();

  for (const item of records) {
    const group = recordsBySlug.get(item.slug) ?? [];
    group.push(item);
    recordsBySlug.set(item.slug, group);
  }

  const issues: BlogAutomationIssue[] = [];

  for (const [slug, group] of recordsBySlug) {
    const isGrandfatheredUnpairedPost =
      group.length === 1 &&
      LEGACY_UNPAIRED_BLOG_SLUGS.has(slug) &&
      group[0].date < policyStartDate;
    if (isGrandfatheredUnpairedPost) {
      continue;
    }

    const byLocale = new Map<BlogLocale, BlogAutomationRecord>();
    for (const item of group) {
      if (byLocale.has(item.lang)) {
        issues.push({
          code: "DUPLICATE_LOCALE",
          slug,
          filePath: item.filePath,
          message: `${slug}에 ${item.lang} 콘텐츠가 두 개 이상 있습니다.`,
        });
        continue;
      }
      byLocale.set(item.lang, item);

      if (item.keywordsFormat !== "array") {
        issues.push({
          code: "KEYWORDS_ARRAY_REQUIRED",
          slug,
          filePath: item.filePath,
          message: "자동 발행 대상 콘텐츠의 keywords는 비어 있지 않은 배열이어야 합니다.",
        });
      }
    }

    for (const locale of locales) {
      if (!byLocale.has(locale)) {
        const existing = group[0];
        issues.push({
          code: "MISSING_TRANSLATION",
          slug,
          filePath: existing.filePath,
          message: `${slug}.${locale}.mdx 번역 쌍이 없습니다.`,
        });
      }
    }

    const ko = byLocale.get("ko");
    const en = byLocale.get("en");
    if (!ko || !en) {
      continue;
    }

    if (ko.date !== en.date) {
      issues.push({
        code: "PAIR_DATE_MISMATCH",
        slug,
        filePath: en.filePath,
        message: `한·영 게시일이 다릅니다: ${ko.date} / ${en.date}`,
      });
    }
    if (ko.category !== en.category) {
      issues.push({
        code: "PAIR_CATEGORY_MISMATCH",
        slug,
        filePath: en.filePath,
        message: `한·영 카테고리가 다릅니다: ${ko.category} / ${en.category}`,
      });
    }
    if (ko.hidden !== en.hidden) {
      issues.push({
        code: "PAIR_VISIBILITY_MISMATCH",
        slug,
        filePath: en.filePath,
        message: "한·영 hidden 공개 상태가 다릅니다.",
      });
    }
  }

  return issues;
}
