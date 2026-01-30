import { promises as fs } from 'fs';
import path from 'path';
import type { PostMetadata, PostCategory } from '@/types/blog';

/**
 * 블로그 포스트 디렉토리 경로
 */
const POSTS_DIRECTORY = path.join(process.cwd(), 'src/content/posts');

/**
 * 파일명에서 슬러그와 언어 정보를 추출
 * 예: "nextjs-architecture.ko.mdx" -> { slug: "nextjs-architecture", lang: "ko" }
 */
const parseFileName = (fileName: string): { slug: string; lang: string } | null => {
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
export const getPostIdentifiers = async (): Promise<{ slug: string; lang: string }[]> => {
  try {
    const files = await fs.readdir(POSTS_DIRECTORY);
    return files
      .map(parseFileName)
      .filter((item): item is { slug: string; lang: string } => item !== null);
  } catch (error) {
    console.error('Error reading posts directory:', error);
    return [];
  }
};

/**
 * MDX 파일에서 export된 metadata 추출
 */
const parseMetadataFromContent = (content: string): Record<string, string> | null => {
  const metadataMatch = content.match(/export\s+const\s+metadata\s*=\s*\{([\s\S]*?)\};/);
  
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
  
  if (titleMatch) result.title = titleMatch[1];
  if (excerptMatch) result.excerpt = excerptMatch[1];
  if (categoryMatch) result.category = categoryMatch[1];
  if (dateMatch) result.date = dateMatch[1];
  if (readTimeMatch) result.readTime = readTimeMatch[1];
  if (langMatch) result.lang = langMatch[1];
  
  return result;
};

/**
 * 슬러그와 언어로 특정 포스트 메타데이터 가져오기 (비동기)
 */
export const getPostBySlug = async (slug: string, lang: string): Promise<PostMetadata | null> => {
  const mdxPath = path.join(POSTS_DIRECTORY, `${slug}.${lang}.mdx`);
  const mdPath = path.join(POSTS_DIRECTORY, `${slug}.${lang}.md`);
  
  let filePath: string | null = null;
  
  try {
    await fs.access(mdxPath);
    filePath = mdxPath;
  } catch {
    try {
      await fs.access(mdPath);
      filePath = mdPath;
    } catch {
      return null;
    }
  }
  
  const fileContents = await fs.readFile(filePath, 'utf8');
  const metadata = parseMetadataFromContent(fileContents);
  
  if (!metadata || !metadata.title) {
    return null;
  }
  
  return {
    slug,
    lang: metadata.lang || lang,
    title: metadata.title,
    excerpt: metadata.excerpt || '',
    category: (metadata.category || 'Insight') as PostCategory,
    date: metadata.date || '',
    readTime: metadata.readTime || '5 min',
  };
};

/**
 * 모든 포스트 메타데이터 가져오기 (날짜 내림차순 정렬, 비동기 병렬 처리)
 * @param lang 필터링할 언어 (선택 사항)
 */
export const getAllPosts = async (lang?: string): Promise<PostMetadata[]> => {
  const identifiers = await getPostIdentifiers();
  
  // 언어가 지정된 경우 해당 언어의 포스트만 필터링
  const filteredIdentifiers = lang 
    ? identifiers.filter(id => id.lang === lang)
    : identifiers;
  
  const postPromises = filteredIdentifiers.map(({ slug, lang }) => getPostBySlug(slug, lang));
  const posts = await Promise.all(postPromises);
  
  return posts
    .filter((post): post is PostMetadata => post !== null)
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
};

/**
 * generateStaticParams용 슬러그 파라미터 목록
 */
export const generatePostParams = async (): Promise<{ slug: string; lang: string }[]> => {
  const identifiers = await getPostIdentifiers();
  return identifiers.map(({ slug, lang }) => ({ slug, lang }));
};
