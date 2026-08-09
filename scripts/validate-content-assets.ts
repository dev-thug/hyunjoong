import { promises as fs } from "node:fs";
import path from "node:path";
import { validateLocalAssetReferences } from "./content-asset-policy";

const contentDirectories = [
  "src/content/posts",
  "src/content/projects",
] as const;

async function main() {
  const rootDir = process.cwd();
  const files: Array<{ filePath: string; source: string }> = [];

  for (const relativeDirectory of contentDirectories) {
    const directory = path.join(rootDir, relativeDirectory);
    const entries = (await fs.readdir(directory))
      .filter((entry) => entry.endsWith(".mdx"))
      .sort();

    for (const entry of entries) {
      const absolutePath = path.join(directory, entry);
      files.push({
        filePath: path.posix.join(relativeDirectory, entry),
        source: await fs.readFile(absolutePath, "utf8"),
      });
    }
  }

  const publicDir = path.join(rootDir, "public");
  const issues = validateLocalAssetReferences(files, publicDir);

  if (issues.length > 0) {
    console.error(`로컬 콘텐츠 에셋 검증 실패: ${issues.length}건`);
    for (const issue of issues) {
      console.error(`- [${issue.code}] ${issue.filePath}: ${issue.message}`);
    }
    process.exitCode = 1;
    return;
  }

  console.log(`로컬 콘텐츠 에셋 검증 통과: ${files.length}개 MDX 파일`);
}

main().catch((error: unknown) => {
  console.error("로컬 콘텐츠 에셋 검증 실행 실패");
  console.error(error);
  process.exitCode = 1;
});
