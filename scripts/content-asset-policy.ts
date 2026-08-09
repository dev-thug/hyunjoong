import { existsSync, statSync } from "node:fs";
import path from "node:path";

export interface ContentAssetSource {
  readonly filePath: string;
  readonly source: string;
}

export interface ContentAssetIssue {
  readonly code: "MISSING_LOCAL_ASSET";
  readonly filePath: string;
  readonly assetPath: string;
  readonly message: string;
}

interface IndexedAssetPath {
  readonly index: number;
  readonly assetPath: string;
}

const normalizeAssetPath = (rawPath: string): string => {
  const withoutSuffix = rawPath.split(/[?#]/, 1)[0];
  try {
    return decodeURIComponent(withoutSuffix);
  } catch {
    return withoutSuffix;
  }
};

const maskCodeExamples = (source: string): string =>
  source
    .replace(
      /(^|\n)(`{3,}|~{3,})[^\n]*\n[\s\S]*?\n\2[ \t]*(?=\n|$)/g,
      (match) => " ".repeat(match.length)
    )
    .replace(/(`+)([^\n]*?)\1/g, (match) => " ".repeat(match.length));

export function extractLocalAssetPaths(source: string): string[] {
  const renderedSource = maskCodeExamples(source);
  const matches: IndexedAssetPath[] = [];
  const quotedPath = /["'](\/images\/[^"'\s]+)["']/g;
  const markdownPath = /!\[[^\]]*\]\(\s*(\/images\/[^)\s]+)(?:\s+["'][^"']*["'])?\s*\)/g;

  for (const match of renderedSource.matchAll(quotedPath)) {
    matches.push({ index: match.index, assetPath: normalizeAssetPath(match[1]) });
  }

  for (const match of renderedSource.matchAll(markdownPath)) {
    matches.push({ index: match.index, assetPath: normalizeAssetPath(match[1]) });
  }

  matches.sort((a, b) => a.index - b.index);

  const seen = new Set<string>();
  return matches
    .map(({ assetPath }) => assetPath)
    .filter((assetPath) => {
      if (seen.has(assetPath)) {
        return false;
      }
      seen.add(assetPath);
      return true;
    });
}

export function validateLocalAssetReferences(
  files: readonly ContentAssetSource[],
  publicDir: string
): ContentAssetIssue[] {
  const normalizedPublicDir = path.resolve(publicDir);
  const issues: ContentAssetIssue[] = [];

  for (const file of files) {
    for (const assetPath of extractLocalAssetPaths(file.source)) {
      const resolvedPath = path.resolve(normalizedPublicDir, `.${assetPath}`);
      const isInsidePublicDir =
        resolvedPath === normalizedPublicDir ||
        resolvedPath.startsWith(`${normalizedPublicDir}${path.sep}`);
      const exists =
        isInsidePublicDir && existsSync(resolvedPath) && statSync(resolvedPath).isFile();

      if (!exists) {
        issues.push({
          code: "MISSING_LOCAL_ASSET",
          filePath: file.filePath,
          assetPath,
          message: `로컬 에셋 파일이 없습니다: ${assetPath}`,
        });
      }
    }
  }

  return issues;
}
