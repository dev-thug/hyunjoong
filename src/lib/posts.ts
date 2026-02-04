import { promises as fs } from "fs";
import path from "path";
import { cache } from "react";
import type { PostMetadata, PostCategory } from "@/types/blog";

/**
 * 블로그 포스트 디렉토리 경로
 */
const POSTS_DIRECTORY = path.join(process.cwd(), "src/content/posts");

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
): Record<string, string> | null => {
  const metadataMatch = content.match(
    /export\s+const\s+metadata\s*=\s*\{([\s\S]*?)\};/
  );

  if (!metadataMatch) {
    return null;
  }

  const metadataBlock = metadataMatch[1];
  const result: Record<string, string> = {};

  const titleMatch = metadataBlock.match(/title:\s*"([^"]+)"/);
  const excerptMatch = metadataBlock.match(/excerpt:\s*"([^"]+)"/);
  const categoryMatch = metadataBlock.match(/category:\s*"([^"]+)"/);
  const dateMatch = metadataBlock.match(/date:\s*"([^"]+)"/);
  const readTimeMatch = metadataBlock.match(/readTime:\s*"([^"]+)"/);
  const langMatch = metadataBlock.match(/lang:\s*"([^"]+)"/);
  // keywords: comma-separated string; value must not contain double quotes
  const keywordsMatch = metadataBlock.match(/keywords:\s*"([^"]*)"/);
  const hiddenMatch = metadataBlock.match(/hidden:\s*(true|false)/);

  if (titleMatch) result.title = titleMatch[1];
  if (excerptMatch) result.excerpt = excerptMatch[1];
  if (categoryMatch) result.category = categoryMatch[1];
  if (dateMatch) result.date = dateMatch[1];
  if (readTimeMatch) result.readTime = readTimeMatch[1];
  if (langMatch) result.lang = langMatch[1];
  if (keywordsMatch) result.keywords = keywordsMatch[1];
  if (hiddenMatch) result.hidden = hiddenMatch[1];

  return result;
};

/**
 * 슬러그와 언어로 특정 포스트 메타데이터 가져오기 (비동기)
 */
export const getPostBySlug = cache(
  async (slug: string, lang: string): Promise<PostMetadata | null> => {
    const mdxPath = path.join(POSTS_DIRECTORY, `${slug}.${lang}.mdx`);
    const mdPath = path.join(POSTS_DIRECTORY, `${slug}.${lang}.md`);

    let fileContents: string;
    let currentLang = lang;

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

    if (!metadata || !metadata.title) {
      return null;
    }

    const keywords = metadata.keywords
      ? metadata.keywords
          .split(",")
          .map((s) => s.trim())
          .filter(Boolean)
      : undefined;

    const hidden = metadata.hidden === "true";

    return {
      slug,
      lang: metadata.lang || lang,
      title: metadata.title,
      excerpt: metadata.excerpt || "",
      category: (metadata.category || "Insight") as PostCategory,
      date: metadata.date || "",
      readTime: metadata.readTime || "5 min",
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

/**
 * generateStaticParams용 슬러그 파라미터 목록
 */
export const generatePostParams = async (): Promise<
  { slug: string; lang: string }[]
> => {
  const identifiers = await getPostIdentifiers();
  return identifiers.map(({ slug, lang }) => ({ slug, lang }));
};
