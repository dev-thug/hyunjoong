import { promises as fs } from "fs";
import path from "path";
import { cache } from "react";
import type { PostMetadata, PostCategory } from "@/types/blog";

/**
 * 블로그 포스트 디렉토리 경로
 */
const POSTS_DIRECTORY = path.join(process.cwd(), "src/content/posts");
export const BLOG_POSTS_PAGE_SIZE = 6;

export interface PaginatedPostsResult {
  items: PostMetadata[];
  currentPage: number;
  totalPages: number;
  totalItems: number;
  pageSize: number;
}

interface ParsedPostMetadata {
  title?: string;
  excerpt?: string;
  category?: string;
  date?: string;
  readTime?: string;
  lang?: string;
  keywords?: string | string[];
  hidden?: boolean;
}

const REQUIRED_POST_METADATA_FIELDS = [
  "title",
  "excerpt",
  "category",
  "date",
  "readTime",
  "lang",
] as const;

type RequiredPostMetadataField = (typeof REQUIRED_POST_METADATA_FIELDS)[number];

const ISO_DATE_REGEX = /^\d{4}-\d{2}-\d{2}$/;
const POST_CATEGORIES: readonly PostCategory[] = [
  "Engineering",
  "Business",
  "Insight",
];
const POST_SLUG_REGEX = /^[a-z0-9-]+$/;
const POST_LANG_REGEX = /^(ko|en)$/;

/**
 * 파일명에서 슬러그와 언어 정보를 추출
 * 예: "nextjs-architecture.ko.mdx" -> { slug: "nextjs-architecture", lang: "ko" }
 */
const parseFileName = (
  fileName: string
): { slug: string; lang: string } | null => {
  const match = fileName.match(/^(.+)\.(.+)\.(mdx|md)$/);
  if (!match) return null;
  return {
    slug: match[1],
    lang: match[2],
  };
};

/**
 * 모든 MDX 파일의 { slug, lang } 목록 반환 (비동기)
 */
export const getPostIdentifiers = cache(
  async (): Promise<{ slug: string; lang: string }[]> => {
    try {
      const files = await fs.readdir(POSTS_DIRECTORY);
      return files
        .map(parseFileName)
        .filter(
          (item): item is { slug: string; lang: string } => item !== null
        );
    } catch (error) {
      console.error("Error reading posts directory:", error);
      return [];
    }
  }
);

/**
 * MDX 파일에서 export된 metadata 추출
 */
const parseMetadataFromContent = (
  content: string
): ParsedPostMetadata | null => {
  const metadataMatch = content.match(
    /export\s+const\s+metadata\s*=\s*\{([\s\S]*?)\};/
  );

  if (!metadataMatch) {
    return null;
  }

  const metadataBlock = metadataMatch[1];
  const parseStringField = (key: string): string | undefined => {
    const match = metadataBlock.match(
      new RegExp(`${key}:\\s*"((?:[^"\\\\]|\\\\.)*)"`)
    );
    if (!match) {
      return undefined;
    }
    return match[1].replace(/\\"/g, '"').replace(/\\\\/g, "\\");
  };
  const parseBooleanField = (key: string): boolean | undefined => {
    const match = metadataBlock.match(new RegExp(`${key}:\\s*(true|false)`));
    if (!match) {
      return undefined;
    }
    return match[1] === "true";
  };
  const parseStringArrayField = (key: string): string[] | undefined => {
    const match = metadataBlock.match(new RegExp(`${key}:\\s*\\[([\\s\\S]*?)\\]`));
    if (!match) {
      return undefined;
    }
    const values = [...match[1].matchAll(/"((?:[^"\\]|\\.)*)"/g)]
      .map((value) => value[1].replace(/\\"/g, '"').replace(/\\\\/g, "\\"))
      .map((value) => value.trim())
      .filter(Boolean);
    return values;
  };

  return {
    title: parseStringField("title"),
    excerpt: parseStringField("excerpt"),
    category: parseStringField("category"),
    date: parseStringField("date"),
    readTime: parseStringField("readTime"),
    lang: parseStringField("lang"),
    keywords:
      parseStringArrayField("keywords") ?? parseStringField("keywords"),
    hidden: parseBooleanField("hidden"),
  };
};

const hasRequiredPostMetadataFields = (
  metadata: ParsedPostMetadata
): metadata is ParsedPostMetadata &
  Record<RequiredPostMetadataField, string> => {
  return REQUIRED_POST_METADATA_FIELDS.every((field) => {
    const value = metadata[field];
    return typeof value === "string" && value.trim().length > 0;
  });
};

const isValidIsoDate = (value: string): boolean => {
  if (!ISO_DATE_REGEX.test(value)) {
    return false;
  }
  const parsed = new Date(`${value}T00:00:00.000Z`);
  return (
    !Number.isNaN(parsed.getTime()) &&
    parsed.toISOString().slice(0, 10) === value
  );
};

const isPostCategory = (value: string): value is PostCategory => {
  return POST_CATEGORIES.includes(value as PostCategory);
};

const normalizeKeywords = (value?: string | string[]): string[] | undefined => {
  if (value === undefined) {
    return undefined;
  }
  const items = Array.isArray(value) ? value : value.split(",");
  const normalizedItems = items.map((item) => item.trim()).filter(Boolean);
  return normalizedItems.length > 0 ? normalizedItems : undefined;
};

const isSafePostSlug = (value: string): boolean => POST_SLUG_REGEX.test(value);
const isSafePostLang = (value: string): boolean => POST_LANG_REGEX.test(value);

/**
 * 슬러그와 언어로 특정 포스트 메타데이터 가져오기 (비동기)
 */
export const getPostBySlug = cache(
  async (slug: string, lang: string): Promise<PostMetadata | null> => {
    if (!isSafePostSlug(slug) || !isSafePostLang(lang)) {
      return null;
    }

    const mdxPath = path.join(POSTS_DIRECTORY, `${slug}.${lang}.mdx`);
    const mdPath = path.join(POSTS_DIRECTORY, `${slug}.${lang}.md`);

    let fileContents: string;
    try {
      fileContents = await fs.readFile(mdxPath, "utf8");
    } catch {
      try {
        fileContents = await fs.readFile(mdPath, "utf8");
      } catch {
        return null;
      }
    }

    const metadata = parseMetadataFromContent(fileContents);

    if (!metadata || !hasRequiredPostMetadataFields(metadata)) {
      return null;
    }

    if (!isValidIsoDate(metadata.date)) {
      return null;
    }

    if (!isPostCategory(metadata.category)) {
      return null;
    }

    if (!isSafePostLang(metadata.lang) || metadata.lang !== lang) {
      return null;
    }

    const keywords = normalizeKeywords(metadata.keywords);
    const hidden = metadata.hidden === true;

    return {
      slug,
      lang: metadata.lang || lang,
      title: metadata.title,
      excerpt: metadata.excerpt,
      category: metadata.category,
      date: metadata.date,
      readTime: metadata.readTime,
      ...(keywords?.length ? { keywords } : {}),
      ...(hidden ? { hidden: true } : {}),
    };
  }
);

const DEFAULT_GET_ALL_POSTS_OPTIONS = { includeHidden: false } as const;

/**
 * 모든 포스트 메타데이터 가져오기 (날짜 내림차순 정렬, 비동기 병렬 처리)
 * @param lang 필터링할 언어 (선택 사항)
 * @param options.includeHidden true면 히든 포스트 포함, 기본값 false(공개만)
 */
export const getAllPosts = cache(
  async (
    lang?: string,
    options: { includeHidden?: boolean } = DEFAULT_GET_ALL_POSTS_OPTIONS
  ): Promise<PostMetadata[]> => {
    if (lang !== undefined && !isSafePostLang(lang)) {
      return [];
    }

    const identifiers = await getPostIdentifiers();

    const filteredIdentifiers = lang
      ? identifiers.filter((id) => id.lang === lang)
      : identifiers;

    const postPromises = filteredIdentifiers.map(({ slug, lang }) =>
      getPostBySlug(slug, lang)
    );
    const posts = await Promise.all(postPromises);

    const resolved = posts
      .filter((post): post is PostMetadata => post !== null)
      .filter((post) => options.includeHidden === true || !post.hidden)
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

    return resolved;
  }
);

export const paginatePosts = (
  posts: PostMetadata[],
  page: number,
  pageSize: number
): PaginatedPostsResult => {
  const normalizedPageSize = Number.isFinite(pageSize)
    ? Math.max(1, Math.trunc(pageSize))
    : BLOG_POSTS_PAGE_SIZE;
  const totalItems = posts.length;
  const totalPages = Math.max(1, Math.ceil(totalItems / normalizedPageSize));
  const normalizedPage = Number.isFinite(page)
    ? Math.max(1, Math.trunc(page))
    : 1;
  const currentPage = Math.min(normalizedPage, totalPages);
  const startIndex = (currentPage - 1) * normalizedPageSize;
  const endIndex = startIndex + normalizedPageSize;

  return {
    items: posts.slice(startIndex, endIndex),
    currentPage,
    totalPages,
    totalItems,
    pageSize: normalizedPageSize,
  };
};

const normalizeSearchQuery = (searchQuery?: string): string =>
  (searchQuery ?? "").trim().toLowerCase();

const isPostMatchingSearchQuery = (
  post: PostMetadata,
  normalizedSearchQuery: string
): boolean => {
  if (!normalizedSearchQuery) {
    return true;
  }

  const searchableFields = [
    post.title,
    post.excerpt,
    post.category,
    post.keywords?.join(" "),
  ];
  const normalizedSearchableText = searchableFields
    .filter((value): value is string => Boolean(value))
    .join(" ")
    .toLowerCase();

  return normalizedSearchableText.includes(normalizedSearchQuery);
};

export const filterPostsBySearchQuery = (
  posts: PostMetadata[],
  searchQuery?: string
): PostMetadata[] => {
  const normalizedSearchQuery = normalizeSearchQuery(searchQuery);

  if (!normalizedSearchQuery) {
    return posts;
  }

  return posts.filter((post) =>
    isPostMatchingSearchQuery(post, normalizedSearchQuery)
  );
};

const getPostsPageCached = cache(
  async (
    lang: string,
    page: number,
    pageSize: number,
    normalizedSearchQuery: string
  ): Promise<PaginatedPostsResult> => {
    const posts = await getAllPosts(lang);
    const filteredPosts = filterPostsBySearchQuery(posts, normalizedSearchQuery);

    return paginatePosts(filteredPosts, page, pageSize);
  }
);

export const getPostsPage = async (
  lang: string,
  page: number,
  pageSize: number = BLOG_POSTS_PAGE_SIZE,
  searchQuery?: string
): Promise<PaginatedPostsResult> => {
  const normalizedSearchQuery = normalizeSearchQuery(searchQuery);
  return getPostsPageCached(lang, page, pageSize, normalizedSearchQuery);
};

/**
 * generateStaticParams용 슬러그 파라미터 목록
 */
export const generatePostParams = async (): Promise<
  { slug: string; lang: string }[]
> => {
  const identifiers = await getPostIdentifiers();
  return identifiers.map(({ slug, lang }) => ({ slug, lang }));
};

export const getAvailablePostLocales = cache(
  async (slug: string): Promise<string[]> => {
    if (!isSafePostSlug(slug)) {
      return [];
    }

    const identifiers = await getPostIdentifiers();
    return identifiers
      .filter((item) => item.slug === slug)
      .map((item) => item.lang);
  }
);
