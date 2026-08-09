import { promises as fs } from "node:fs";
import path from "node:path";
import {
  BLOG_AUTOMATION_POLICY_START_DATE,
  parseBlogAutomationRecord,
  validateBlogAutomationPolicy,
} from "./blog-automation-policy";

async function main(): Promise<void> {
  const rootDir = process.cwd();
  const postsDir = path.join(rootDir, "src/content/posts");

  const fileNames = (await fs.readdir(postsDir))
    .filter((fileName) => /\.(mdx|md)$/.test(fileName))
    .sort();

  const parsedFiles = await Promise.all(
    fileNames.map(async (fileName) => {
      const absolutePath = path.join(postsDir, fileName);
      const relativePath = path.relative(rootDir, absolutePath);
      const source = await fs.readFile(absolutePath, "utf8");
      return {
        relativePath,
        record: parseBlogAutomationRecord(relativePath, source),
      };
    })
  );
  const malformedFiles = parsedFiles.filter((item) => item.record === null);
  if (malformedFiles.length > 0) {
    for (const item of malformedFiles) {
      console.error(
        `[ERROR] ${item.relativePath} (INVALID_METADATA): 자동 발행 정책 필드를 파싱할 수 없습니다.`
      );
    }
    console.error(`\n블로그 자동 발행 정책 검증 실패: ${malformedFiles.length}건`);
    process.exitCode = 1;
    return;
  }

  const records = parsedFiles.map((item) => item.record!);
  const issues = validateBlogAutomationPolicy(records);

  if (issues.length > 0) {
    for (const issue of issues) {
      console.error(
        `[ERROR] ${issue.filePath} (${issue.code}): ${issue.message}`
      );
    }
    console.error(
      `\n블로그 자동 발행 정책 검증 실패: ${issues.length}건 ` +
        `(적용일 ${BLOG_AUTOMATION_POLICY_START_DATE})`
    );
    process.exitCode = 1;
    return;
  }

  console.log(
    `블로그 자동 발행 정책 통과: ${records.length}개 파일 ` +
      `(적용일 ${BLOG_AUTOMATION_POLICY_START_DATE})`
  );
}

main().catch((error: unknown) => {
  console.error("블로그 자동 발행 정책 검증 중 오류가 발생했습니다.", error);
  process.exitCode = 1;
});
