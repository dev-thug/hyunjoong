import { promises as fs } from "fs";

/**
 * 지원하는 컨텐츠 언어 리터럴 유니온 타입
 */
export type ContentLang = "ko" | "en";

/**
 * 컨텐츠 식별자 (슬러그 + 언어)
 */
export interface ContentIdentifier {
  slug: string;
  lang: ContentLang;
}

const CONTENT_FILE_NAME_REGEX = /^(.+)\.([a-zA-Z-]+)\.(mdx|md)$/;
const CONTENT_LANG_REGEX = /^(ko|en)$/;

/**
 * 컨텐츠 슬러그 검증용 정규식. 소문자/숫자/하이픈만 허용.
 */
export const CONTENT_SLUG_REGEX = /^[a-z0-9-]+$/;

/**
 * 주어진 문자열이 지원되는 컨텐츠 언어인지 검사하는 런타임 가드.
 */
export function isContentLang(value: string): value is ContentLang {
  return CONTENT_LANG_REGEX.test(value);
}

/**
 * 주어진 문자열이 유효한 컨텐츠 슬러그 형식인지 검사하는 런타임 가드.
 */
export function isContentSlug(value: string): boolean {
  return CONTENT_SLUG_REGEX.test(value);
}

/**
 * MDX 소스에서 `export const metadata = { ... };` 블록의 내부 문자열을 추출.
 * 매칭에 실패하면 `null`을 반환.
 */
export function extractMetadataBlock(source: string): string | null {
  const match = source.match(
    /export\s+const\s+metadata\s*=\s*\{([\s\S]*?)\};/
  );
  return match ? match[1] : null;
}

/**
 * 메타데이터 블록에서 큰따옴표("...")로 둘러싸인 문자열 필드를 파싱.
 * 이스케이프된 따옴표(\")와 백슬래시(\\)를 복원해서 반환.
 * 키가 없으면 `undefined`.
 */
export function parseQuotedString(
  block: string,
  key: string
): string | undefined {
  const match = block.match(
    new RegExp(`${key}:\\s*"((?:[^"\\\\]|\\\\.)*)"`)
  );
  if (!match) {
    return undefined;
  }
  return match[1].replace(/\\"/g, '"').replace(/\\\\/g, "\\");
}

/**
 * 메타데이터 블록에서 boolean 리터럴 필드를 파싱.
 * 키가 없거나 true/false 가 아니면 `undefined`.
 */
export function parseBoolean(
  block: string,
  key: string
): boolean | undefined {
  const match = block.match(new RegExp(`${key}:\\s*(true|false)`));
  if (!match) {
    return undefined;
  }
  return match[1] === "true";
}

/**
 * 메타데이터 블록에서 문자열 배열 필드를 파싱.
 * 대괄호 안의 큰따옴표 문자열들을 모아 trim 후 빈 항목 제거.
 * 키가 없으면 `undefined`.
 */
export function parseStringArray(
  block: string,
  key: string
): string[] | undefined {
  const match = block.match(new RegExp(`${key}:\\s*\\[([^\\]]*)\\]`));
  if (!match) {
    return undefined;
  }
  const values = [...match[1].matchAll(/"((?:[^"\\]|\\.)*)"/g)]
    .map((entry) => entry[1].replace(/\\"/g, '"').replace(/\\\\/g, "\\"))
    .map((entry) => entry.trim())
    .filter(Boolean);
  return values;
}

/**
 * "{slug}.{lang}.mdx" 형식의 파일명에서 슬러그와 언어를 추출
 * lang이 'ko' 또는 'en'이 아니면 null 반환
 *
 * @example
 * parseContentFileName("nextjs-architecture.ko.mdx")
 * // -> { slug: "nextjs-architecture", lang: "ko" }
 *
 * parseContentFileName("foo.fr.mdx") // -> null (지원하지 않는 언어)
 * parseContentFileName("README.md")  // -> null (lang 세그먼트 없음)
 */
export function parseContentFileName(
  filename: string
): ContentIdentifier | null {
  const match = filename.match(CONTENT_FILE_NAME_REGEX);
  if (!match) return null;

  const slug = match[1];
  const lang = match[2];

  if (!CONTENT_LANG_REGEX.test(lang)) {
    return null;
  }

  return {
    slug,
    lang: lang as ContentLang,
  };
}

/**
 * 디렉토리에서 컨텐츠 파일들의 { slug, lang } 식별자 목록을 반환.
 * 파일명이 유효하지 않은 항목은 제외하고, 읽기 실패 시 에러를 로그 후 빈 배열 반환.
 *
 * Internal helper — `posts.ts`와 `projects.ts`에서 공유 사용.
 */
export async function getContentIdentifiers(
  directory: string,
  label: string
): Promise<ContentIdentifier[]> {
  try {
    const files = await fs.readdir(directory);
    return files
      .map(parseContentFileName)
      .filter((item): item is ContentIdentifier => item !== null);
  } catch (error) {
    console.error(`Error reading ${label} directory:`, error);
    return [];
  }
}
