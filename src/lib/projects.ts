import { promises as fs } from 'fs';
import path from 'path';
import { cache } from 'react';
import type { Project } from '@/types';

/**
 * 프로젝트 디렉토리 경로
 */
const PROJECTS_DIRECTORY = path.join(process.cwd(), 'src/content/projects');

/**
 * 파일명에서 슬러그와 언어 정보를 추출
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
 * 모든 MDX 파일의 { slug, lang } 목록 반환
 */
export const getProjectIdentifiers = cache(async (): Promise<{ slug: string; lang: string }[]> => {
  try {
    const files = await fs.readdir(PROJECTS_DIRECTORY);
    return files
      .map(parseFileName)
      .filter((item): item is { slug: string; lang: string } => item !== null);
  } catch (error) {
    console.error('Error reading projects directory:', error);
    return [];
  }
});

/**
 * MDX 파일에서 export된 metadata 추출
 * lib/posts.ts의 구현을 참고하여 프로젝트 필드에 맞게 확장
 */
const parseMetadataFromContent = (content: string): any | null => {
  const metadataMatch = content.match(/export\s+const\s+metadata\s*=\s*\{([\s\S]*?)\};/);
  
  if (!metadataMatch) {
    return null;
  }
  
  const metadataBlock = metadataMatch[1];
  
  // 단순 정규식 파싱의 한계가 있으므로, JSON.parse가 가능하도록 변환하거나 
  // 필요한 필드별로 정규식을 적용합니다.
  // 여기서는 metrics와 tags 같은 배열/객체 구조를 위해 조금 더 정교한 추출이 필요할 수 있습니다.
  
  const getValue = (key: string) => {
    const regex = new RegExp(`${key}:\\s*["']([^"']+)["']`);
    const match = metadataBlock.match(regex);
    return match ? match[1] : null;
  };

  const getArray = (key: string) => {
    const regex = new RegExp(`${key}:\\s*\\[([\\s\\S]*?)\\]`);
    const match = metadataBlock.match(regex);
    if (!match) return [];
    return match[1]
      .split(',')
      .map(s => s.trim().replace(/["']/g, ''))
      .filter(Boolean);
  };

  // metrics는 객체 배열이므로 별도 처리
  const getMetrics = () => {
    const regex = /metrics:\s*\[([\s\S]*?)\]/;
    const match = metadataBlock.match(regex);
    if (!match) return [];
    
    const metricsStr = match[1];
    const metricRegex = /\{\s*label:\s*["']([^"']+)["']\s*,\s*value:\s*["']([^"']+)["']\s*\}/g;
    const metrics = [];
    let m;
    while ((m = metricRegex.exec(metricsStr)) !== null) {
      metrics.push({ label: m[1], value: m[2] });
    }
    return metrics;
  };

  return {
    id: getValue('id'),
    title: getValue('title'),
    adCopy: getValue('adCopy'),
    description: getValue('description'),
    techHighlight: getValue('techHighlight'),
    image: getValue('image'),
    lang: getValue('lang'),
    tags: getArray('tags'),
    metrics: getMetrics(),
  };
};

/**
 * 슬러그와 언어로 특정 프로젝트 가져오기
 */
export const getProjectBySlug = cache(async (slug: string, lang: string): Promise<Project | null> => {
  const mdxPath = path.join(PROJECTS_DIRECTORY, `${slug}.${lang}.mdx`);
  
  try {
    const fileContents = await fs.readFile(mdxPath, 'utf8');
    const metadata = parseMetadataFromContent(fileContents);
    
    if (!metadata || !metadata.title) {
      return null;
    }
    
    return {
      ...metadata,
      slug,
    } as Project;
  } catch (error) {
    // console.error(`Error reading project ${slug}.${lang}:`, error);
    return null;
  }
});

/**
 * 모든 프로젝트 가져오기
 */
export const getAllProjects = cache(async (lang?: string): Promise<Project[]> => {
  const identifiers = await getProjectIdentifiers();
  
  const filteredIdentifiers = lang 
    ? identifiers.filter(id => id.lang === lang)
    : identifiers;
  
  const projectPromises = filteredIdentifiers.map(({ slug, lang }) => getProjectBySlug(slug, lang));
  const projects = await Promise.all(projectPromises);
  
  return projects.filter((p): p is Project => p !== null);
});

/**
 * generateStaticParams용 파라미터 목록
 */
export const generateProjectParams = async (): Promise<{ slug: string; lang: string }[]> => {
  return await getProjectIdentifiers();
};
