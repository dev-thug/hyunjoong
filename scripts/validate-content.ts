import { promises as fs } from "fs";
import path from "path";

type ValidationLevel = "ERROR" | "WARN";

interface ValidationIssue {
  readonly filePath: string;
  readonly level: ValidationLevel;
  readonly message: string;
}

const ROOT_DIR = process.cwd();
const POSTS_DIR = path.join(ROOT_DIR, "src/content/posts");
const PROJECTS_DIR = path.join(ROOT_DIR, "src/content/projects");
const ISO_DATE_REGEX = /^\d{4}-\d{2}-\d{2}$/;
const POST_CATEGORIES = new Set(["Engineering", "Business", "Insight"]);
const SUPPORTED_LANGS = new Set(["ko", "en"]);
const IS_STRICT =
  process.argv.includes("--strict") || process.argv.includes("--fail-on-warn");
const POST_FILE_NAME_REGEX = /^(.+)\.(ko|en)\.(mdx|md)$/;
const PROJECT_FILE_NAME_REGEX = /^(.+)\.(ko|en)\.(mdx|md)$/;

const logIssue = (issue: ValidationIssue): void => {
  console.error(`[${issue.level}] ${issue.filePath}: ${issue.message}`);
};

const parseFileName = (
  fileName: string,
  nameRegex: RegExp
): { slug: string; lang: string } | null => {
  const match = fileName.match(nameRegex);
  if (!match) {
    return null;
  }
  return { slug: match[1], lang: match[2] };
};

const getMetadataBlock = (content: string): string | null => {
  const metadataMatch = content.match(
    /export\s+const\s+metadata\s*=\s*\{([\s\S]*?)\};/
  );
  return metadataMatch ? metadataMatch[1] : null;
};

const parseStringField = (
  metadataBlock: string,
  key: string
): string | undefined => {
  const match = metadataBlock.match(
    new RegExp(`${key}:\\s*"((?:[^"\\\\]|\\\\.)*)"`)
  );
  if (!match) {
    return undefined;
  }
  return match[1].replace(/\\"/g, '"').replace(/\\\\/g, "\\");
};

const parseBooleanField = (
  metadataBlock: string,
  key: string
): boolean | undefined => {
  const match = metadataBlock.match(new RegExp(`${key}:\\s*(true|false)`));
  if (!match) {
    return undefined;
  }
  return match[1] === "true";
};

const parseStringArrayField = (
  metadataBlock: string,
  key: string
): string[] | undefined => {
  const match = metadataBlock.match(new RegExp(`${key}:\\s*\\[([\\s\\S]*?)\\]`));
  if (!match) {
    return undefined;
  }
  const values = [...match[1].matchAll(/"([^"]*)"/g)].map((value) => value[1]);
  return values;
};

const hasEmptyKeyword = (keywords: string[]): boolean => {
  return keywords.some((keyword) => keyword.trim().length === 0);
};

const parseCommaSeparatedKeywords = (keywords: string): string[] => {
  return keywords.split(",").map((keyword) => keyword.trim());
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

const validatePostFile = async (absolutePath: string): Promise<ValidationIssue[]> => {
  const issues: ValidationIssue[] = [];
  const relativePath = path.relative(ROOT_DIR, absolutePath);
  const content = await fs.readFile(absolutePath, "utf8");
  const metadataBlock = getMetadataBlock(content);

  if (!metadataBlock) {
    return [
      {
        filePath: relativePath,
        level: "ERROR",
        message: "metadata 블록을 찾을 수 없습니다.",
      },
    ];
  }

  const requiredStringFields = [
    "title",
    "excerpt",
    "category",
    "date",
    "readTime",
    "lang",
  ] as const;

  const parsedFields = Object.fromEntries(
    requiredStringFields.map((field) => [field, parseStringField(metadataBlock, field)])
  ) as Record<(typeof requiredStringFields)[number], string | undefined>;

  for (const field of requiredStringFields) {
    const value = parsedFields[field];
    if (!value || value.trim().length === 0) {
      issues.push({
        filePath: relativePath,
        level: "ERROR",
        message: `${field} 필드는 비어 있으면 안 됩니다.`,
      });
    }
  }

  if (parsedFields.category && !POST_CATEGORIES.has(parsedFields.category)) {
    issues.push({
      filePath: relativePath,
      level: "ERROR",
      message: `category 값이 유효하지 않습니다: ${parsedFields.category}`,
    });
  }

  if (parsedFields.date && !isValidIsoDate(parsedFields.date)) {
    issues.push({
      filePath: relativePath,
      level: "ERROR",
      message: `date 값이 유효한 YYYY-MM-DD 형식이 아닙니다: ${parsedFields.date}`,
    });
  }

  const fileName = path.basename(absolutePath);
  const parsedName = parseFileName(fileName, POST_FILE_NAME_REGEX);
  if (!parsedName) {
    issues.push({
      filePath: relativePath,
      level: "ERROR",
      message: "파일명은 {slug}.{lang}.mdx|md 형식을 따라야 합니다.",
    });
  } else if (parsedFields.lang && parsedFields.lang !== parsedName.lang) {
    issues.push({
      filePath: relativePath,
      level: "ERROR",
      message: `metadata.lang(${parsedFields.lang})과 파일명 lang(${parsedName.lang})이 다릅니다.`,
    });
  }

  if (parsedFields.lang && !SUPPORTED_LANGS.has(parsedFields.lang)) {
    issues.push({
      filePath: relativePath,
      level: "ERROR",
      message: `지원하지 않는 lang 값입니다: ${parsedFields.lang}`,
    });
  }

  const keywordsArray = parseStringArrayField(metadataBlock, "keywords");
  const keywordsString = parseStringField(metadataBlock, "keywords");
  if (keywordsArray === undefined && keywordsString === undefined) {
    // optional field
  } else if (keywordsArray !== undefined) {
    if (keywordsArray.length === 0 || hasEmptyKeyword(keywordsArray)) {
      issues.push({
        filePath: relativePath,
        level: "ERROR",
        message: "keywords 배열은 비어 있을 수 없고, 빈 항목도 허용되지 않습니다.",
      });
    }
  } else if (keywordsString !== undefined) {
    const parsedKeywords = parseCommaSeparatedKeywords(keywordsString);
    if (
      keywordsString.trim().length === 0 ||
      parsedKeywords.length === 0 ||
      hasEmptyKeyword(parsedKeywords)
    ) {
      issues.push({
        filePath: relativePath,
        level: "ERROR",
        message: "keywords 문자열 포맷에 빈 키워드가 포함되어 있습니다.",
      });
      return issues;
    }
    issues.push({
      filePath: relativePath,
      level: "WARN",
      message:
        "keywords 문자열 포맷은 하위호환으로 허용됩니다. 배열 포맷으로 마이그레이션을 권장합니다.",
    });
  }

  const hidden = parseBooleanField(metadataBlock, "hidden");
  const rawHiddenMatch = metadataBlock.match(/hidden:\s*([^,\n]+)/);
  if (rawHiddenMatch && hidden === undefined) {
    issues.push({
      filePath: relativePath,
      level: "ERROR",
      message: "hidden은 boolean(true/false) 이어야 합니다.",
    });
  }

  return issues;
};

const validateProjectFile = async (
  absolutePath: string
): Promise<ValidationIssue[]> => {
  const issues: ValidationIssue[] = [];
  const relativePath = path.relative(ROOT_DIR, absolutePath);
  const content = await fs.readFile(absolutePath, "utf8");
  const metadataBlock = getMetadataBlock(content);

  if (!metadataBlock) {
    return [
      {
        filePath: relativePath,
        level: "ERROR",
        message: "metadata 블록을 찾을 수 없습니다.",
      },
    ];
  }

  const requiredStringFields = [
    "id",
    "title",
    "adCopy",
    "description",
    "highlight",
    "image",
    "lang",
  ] as const;

  for (const field of requiredStringFields) {
    const value = parseStringField(metadataBlock, field);
    if (!value || value.trim().length === 0) {
      issues.push({
        filePath: relativePath,
        level: "ERROR",
        message: `${field} 필드는 비어 있으면 안 됩니다.`,
      });
    }
  }

  const lang = parseStringField(metadataBlock, "lang");
  const fileName = path.basename(absolutePath);
  const parsedName = parseFileName(fileName, PROJECT_FILE_NAME_REGEX);
  if (!parsedName) {
    issues.push({
      filePath: relativePath,
      level: "ERROR",
      message: "파일명은 {slug}.{lang}.mdx|md 형식을 따라야 합니다.",
    });
  } else if (lang && lang !== parsedName.lang) {
    issues.push({
      filePath: relativePath,
      level: "ERROR",
      message: `metadata.lang(${lang})과 파일명 lang(${parsedName.lang})이 다릅니다.`,
    });
  }

  if (lang && !SUPPORTED_LANGS.has(lang)) {
    issues.push({
      filePath: relativePath,
      level: "ERROR",
      message: `지원하지 않는 lang 값입니다: ${lang}`,
    });
  }

  const id = parseStringField(metadataBlock, "id");
  if (id && !/^p\d+$/.test(id)) {
    issues.push({
      filePath: relativePath,
      level: "WARN",
      message: `id는 p+숫자 포맷을 권장합니다. 현재 값: ${id}`,
    });
  }

  const tags = parseStringArrayField(metadataBlock, "tags");
  if (!tags || tags.length === 0) {
    issues.push({
      filePath: relativePath,
      level: "ERROR",
      message: "tags는 비어 있지 않은 문자열 배열이어야 합니다.",
    });
  }

  const metricsMatch = metadataBlock.match(/metrics:\s*\[([\s\S]*?)\]/);
  if (!metricsMatch) {
    issues.push({
      filePath: relativePath,
      level: "ERROR",
      message: "metrics는 객체 배열로 정의되어야 합니다.",
    });
  } else {
    const metricEntries = [
      ...metricsMatch[1].matchAll(
        /\{\s*label:\s*"([^"]+)"\s*,\s*value:\s*"([^"]+)"\s*\}/g
      ),
    ];
    if (metricEntries.length === 0) {
      issues.push({
        filePath: relativePath,
        level: "ERROR",
        message: "metrics 항목의 label/value를 파싱할 수 없습니다.",
      });
    }
  }

  return issues;
};

const validateDirectory = async (
  directoryPath: string,
  validator: (absolutePath: string) => Promise<ValidationIssue[]>
): Promise<ValidationIssue[]> => {
  const files = await fs.readdir(directoryPath);
  const targetFiles = files.filter((fileName) => /\.(mdx|md)$/.test(fileName));
  const issueGroups = await Promise.all(
    targetFiles.map((fileName) => validator(path.join(directoryPath, fileName)))
  );
  return issueGroups.flat();
};

const main = async (): Promise<void> => {
  const issues = [
    ...(await validateDirectory(POSTS_DIR, validatePostFile)),
    ...(await validateDirectory(PROJECTS_DIR, validateProjectFile)),
  ];

  const errorCount = issues.filter((issue) => issue.level === "ERROR").length;
  const warningCount = issues.filter((issue) => issue.level === "WARN").length;

  if (issues.length > 0) {
    issues.forEach(logIssue);
  }

  if (errorCount > 0) {
    console.error(`\n콘텐츠 검증 실패: 오류 ${errorCount}건, 경고 ${warningCount}건`);
    process.exit(1);
  }

  if (IS_STRICT && warningCount > 0) {
    console.error(
      `\n콘텐츠 검증 실패(strict): 경고 ${warningCount}건이 오류로 처리되었습니다.`
    );
    process.exit(1);
  }

  console.log(`콘텐츠 검증 통과: 오류 ${errorCount}건, 경고 ${warningCount}건`);
};

main().catch((error: unknown) => {
  console.error("콘텐츠 검증 실행 실패:", error);
  process.exit(2);
});
