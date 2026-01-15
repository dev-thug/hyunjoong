import fs from 'fs';
import path from 'path';
import type { PostMetadata, PostCategory } from '@/types/blog';

/**
 * 블로그 포스트 디렉토리 경로
 */
const POSTS_DIRECTORY = path.join(process.cwd(), 'src/content/posts');

/**
 * 모든 MDX 파일의 슬러그 목록 반환
 */
export const getPostSlugs = (): string[] => {
  if (!fs.existsSync(POSTS_DIRECTORY)) {
    return [];
  }
  
  const files = fs.readdirSync(POSTS_DIRECTORY);
  return files
    .filter((file) => file.endsWith('.mdx') || file.endsWith('.md'))
    .map((file) => file.replace(/\.(mdx|md)$/, ''));
};

/**
 * MDX 파일에서 export된 metadata 추출
 */
const parseMetadataFromContent = (content: string): Record<string, string> | null => {
  // export const metadata = { ... }; 패턴 추출
  const metadataMatch = content.match(/export\s+const\s+metadata\s*=\s*\{([\s\S]*?)\};/);
  
  if (!metadataMatch) {
    return null;
  }
  
  const metadataBlock = metadataMatch[1];
  const result: Record<string, string> = {};
  
  // 각 필드를 개별적으로 추출
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
 * 슬러그로 특정 포스트 메타데이터 가져오기
 */
export const getPostBySlug = (slug: string): PostMetadata | null => {
  const mdxPath = path.join(POSTS_DIRECTORY, `${slug}.mdx`);
  const mdPath = path.join(POSTS_DIRECTORY, `${slug}.md`);
  
  let filePath: string;
  if (fs.existsSync(mdxPath)) {
    filePath = mdxPath;
  } else if (fs.existsSync(mdPath)) {
    filePath = mdPath;
  } else {
    return null;
  }
  
  const fileContents = fs.readFileSync(filePath, 'utf8');
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
 * 모든 포스트 메타데이터 가져오기 (날짜 내림차순 정렬)
 */
export const getAllPosts = (): PostMetadata[] => {
  const slugs = getPostSlugs();
  
  const posts = slugs
    .map((slug) => getPostBySlug(slug))
    .filter((post): post is PostMetadata => post !== null)
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  
  return posts;
};

/**
 * generateStaticParams용 슬러그 파라미터 목록
 */
export const generatePostParams = (): { slug: string }[] => {
  return getPostSlugs().map((slug) => ({ slug }));
};
