import { promises as fs } from 'fs';
import path from 'path';
import type { PostMetadata, PostCategory } from '@/types/blog';

/**
 * 블로그 포스트 디렉토리 경로
 */
const POSTS_DIRECTORY = path.join(process.cwd(), 'src/content/posts');

/**
 * 모든 MDX 파일의 슬러그 목록 반환 (비동기)
 */
export const getPostSlugs = async (): Promise<string[]> => {
  try {
    const files = await fs.readdir(POSTS_DIRECTORY);
    return files
      .filter((file) => file.endsWith('.mdx') || file.endsWith('.md'))
      .map((file) => file.replace(/\.(mdx|md)$/, ''));
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
  
  if (titleMatch) result.title = titleMatch[1];
  if (excerptMatch) result.excerpt = excerptMatch[1];
  if (categoryMatch) result.category = categoryMatch[1];
  if (dateMatch) result.date = dateMatch[1];
  if (readTimeMatch) result.readTime = readTimeMatch[1];
  
  return result;
};

/**
 * 슬러그로 특정 포스트 메타데이터 가져오기 (비동기)
 */
export const getPostBySlug = async (slug: string): Promise<PostMetadata | null> => {
  const mdxPath = path.join(POSTS_DIRECTORY, `${slug}.mdx`);
  const mdPath = path.join(POSTS_DIRECTORY, `${slug}.md`);
  
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
    title: metadata.title,
    excerpt: metadata.excerpt || '',
    category: (metadata.category || 'Insight') as PostCategory,
    date: metadata.date || '',
    readTime: metadata.readTime || '5 min',
  };
};

/**
 * 모든 포스트 메타데이터 가져오기 (날짜 내림차순 정렬, 비동기 병렬 처리)
 */
export const getAllPosts = async (): Promise<PostMetadata[]> => {
  const slugs = await getPostSlugs();
  
  const postPromises = slugs.map((slug) => getPostBySlug(slug));
  const posts = await Promise.all(postPromises);
  
  return posts
    .filter((post): post is PostMetadata => post !== null)
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
};

/**
 * generateStaticParams용 슬러그 파라미터 목록
 */
export const generatePostParams = async (): Promise<{ slug: string }[]> => {
  const slugs = await getPostSlugs();
  return slugs.map((slug) => ({ slug }));
};
