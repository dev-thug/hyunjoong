import { promises as fs } from "fs";
import path from "path";
import { cache } from "react";
import type { Locale } from "@/i18n-config";
import type { Project, ProjectMetric } from "@/types";
import {
  CONTENT_SLUG_REGEX,
  extractMetadataBlock,
  getContentIdentifiers,
  isContentLang,
  parseQuotedString,
  parseStringArray,
} from "@/lib/content-utils";

/**
 * 프로젝트 디렉토리 경로
 */
const PROJECTS_DIRECTORY = path.join(process.cwd(), "src/content/projects");

interface ParsedProjectMetadata {
  id?: string;
  title?: string;
  adCopy?: string;
  description?: string;
  highlight?: string;
  serviceUrl?: string;
  image?: string;
  lang?: string;
  tags?: string[];
  metrics?: ProjectMetric[];
}

const REQUIRED_PROJECT_FIELDS = [
  "id",
  "title",
  "adCopy",
  "description",
  "highlight",
  "image",
  "lang",
] as const;

type RequiredProjectField = (typeof REQUIRED_PROJECT_FIELDS)[number];

/**
 * 모든 MDX 파일의 { slug, lang } 목록 반환.
 *
 * 파일명 파싱은 `content-utils.ts`로 위임되었으며,
 * 'ko' / 'en'이 아닌 언어 세그먼트를 가진 파일은 자동으로 제외된다.
 */
export const getProjectIdentifiers = cache(
  async (): Promise<{ slug: string; lang: string }[]> => {
    return getContentIdentifiers(PROJECTS_DIRECTORY, "projects");
  }
);

/**
 * metrics 배열 파싱.
 * `[{ label: "...", value: "..." }, ...]` 형식의 객체 배열을 추출한다.
 * CLAUDE.md 규약상 모든 값은 큰따옴표로 작성된다.
 */
const parseMetricsArray = (block: string): ProjectMetric[] => {
  const match = block.match(/metrics:\s*\[([\s\S]*?)\]/);
  if (!match) return [];

  const metricsStr = match[1];
  const metricRegex =
    /\{\s*label:\s*"([^"]+)"\s*,\s*value:\s*"([^"]+)"\s*\}/g;
  const metrics: ProjectMetric[] = [];
  let m: RegExpExecArray | null;
  while ((m = metricRegex.exec(metricsStr)) !== null) {
    metrics.push({ label: m[1], value: m[2] });
  }
  return metrics;
};

/**
 * MDX 파일에서 export된 metadata 추출.
 * content-utils의 공유 파서로 단일 문자열/문자열 배열을 추출하고,
 * metrics 객체 배열만 별도 처리한다.
 */
const parseMetadataFromContent = (
  content: string
): ParsedProjectMetadata | null => {
  const block = extractMetadataBlock(content);
  if (block === null) {
    return null;
  }

  return {
    id: parseQuotedString(block, "id"),
    title: parseQuotedString(block, "title"),
    adCopy: parseQuotedString(block, "adCopy"),
    description: parseQuotedString(block, "description"),
    highlight: parseQuotedString(block, "highlight"),
    serviceUrl: parseQuotedString(block, "serviceUrl"),
    image: parseQuotedString(block, "image"),
    lang: parseQuotedString(block, "lang"),
    tags: parseStringArray(block, "tags") ?? [],
    metrics: parseMetricsArray(block),
  } satisfies ParsedProjectMetadata;
};

const hasRequiredProjectFields = (
  metadata: ParsedProjectMetadata
): metadata is ParsedProjectMetadata &
  Record<RequiredProjectField, string> => {
  return REQUIRED_PROJECT_FIELDS.every((field) => {
    const value = metadata[field];
    return typeof value === "string" && value.trim().length > 0;
  });
};

/**
 * 슬러그와 언어로 특정 프로젝트 가져오기
 */
export const getProjectBySlug = cache(
  async (slug: string, lang: string): Promise<Project | null> => {
    if (!CONTENT_SLUG_REGEX.test(slug) || !isContentLang(lang)) {
      return null;
    }

    const mdxPath = path.join(PROJECTS_DIRECTORY, `${slug}.${lang}.mdx`);
    const mdPath = path.join(PROJECTS_DIRECTORY, `${slug}.${lang}.md`);

    try {
      let fileContents: string;
      try {
        fileContents = await fs.readFile(mdxPath, "utf8");
      } catch {
        fileContents = await fs.readFile(mdPath, "utf8");
      }
      const metadata = parseMetadataFromContent(fileContents);

      if (!metadata || !hasRequiredProjectFields(metadata)) {
        return null;
      }

      if (!isContentLang(metadata.lang) || metadata.lang !== lang) {
        return null;
      }

      return {
        id: metadata.id,
        title: metadata.title,
        adCopy: metadata.adCopy,
        description: metadata.description,
        highlight: metadata.highlight,
        serviceUrl: metadata.serviceUrl ?? undefined,
        image: metadata.image,
        lang: lang as Locale,
        tags: metadata.tags ?? [],
        metrics: metadata.metrics ?? [],
        slug,
      };
    } catch (error) {
      // 개발/빌드 중 잘못된 메타데이터를 가진 프로젝트를 가시화한다.
      console.error(`Error reading project ${slug}.${lang}:`, error);
      return null;
    }
  }
);

/**
 * ID 문자열에서 숫자 부분을 추출 (예: "p1" -> 1)
 * 형식이 맞지 않거나 ID가 없는 경우 Infinity를 반환하여 리스트의 끝으로 보냄
 */
const getNumericId = (id?: string | null): number => {
  if (!id) return Infinity;
  const match = id.match(/^p(\d+)$/);
  return match ? parseInt(match[1], 10) : Infinity;
};

/**
 * 모든 프로젝트 가져오기
 */
export const getAllProjects = cache(
  async (lang?: string): Promise<Project[]> => {
    if (lang !== undefined && !isContentLang(lang)) {
      return [];
    }

    const identifiers = await getProjectIdentifiers();

    const filteredIdentifiers = lang
      ? identifiers.filter((id) => id.lang === lang)
      : identifiers;

    const projectPromises = filteredIdentifiers.map(({ slug, lang }) =>
      getProjectBySlug(slug, lang)
    );
    const projects = await Promise.all(projectPromises);

    return projects
      .filter((p): p is Project => p !== null)
      .sort((a, b) => {
        const diff = getNumericId(a.id) - getNumericId(b.id);
        if (diff !== 0) return diff;
        // id가 동률 (특히 둘 다 Infinity)인 경우 슬러그 알파벳 순으로 결정적으로 정렬.
        return a.slug.localeCompare(b.slug);
      });
  }
);

/**
 * generateStaticParams용 파라미터 목록
 */
export const generateProjectParams = async (): Promise<
  { slug: string; lang: string }[]
> => {
  return await getProjectIdentifiers();
};

export const getAvailableProjectLocales = cache(
  async (slug: string): Promise<string[]> => {
    if (!CONTENT_SLUG_REGEX.test(slug)) {
      return [];
    }

    const identifiers = await getProjectIdentifiers();
    return identifiers
      .filter((item) => item.slug === slug)
      .map((item) => item.lang);
  }
);
