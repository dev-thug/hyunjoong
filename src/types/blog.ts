import type { Locale } from "@/i18n-config";

/**
 * 블로그 포스트 카테고리
 */
export type PostCategory = "Engineering" | "Business" | "Insight";

/**
 * 블로그 포스트 메타데이터 인터페이스
 */
export interface Post {
  readonly slug: string;
  readonly lang: Locale;
  readonly title: string;
  readonly excerpt: string;
  readonly category: PostCategory;
  readonly date: string;
  readonly readTime: string;
  // keywords is normalized from a comma-separated string in MDX metadata
  readonly keywords?: string[];
  readonly hidden?: boolean;
}

/** @deprecated Renamed to `Post` — this alias preserves backward compatibility. */
export type PostMetadata = Post;
