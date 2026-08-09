import assert from "node:assert/strict";
import { mkdtempSync, mkdirSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import path from "node:path";
import test from "node:test";
import {
  extractLocalAssetPaths,
  validateLocalAssetReferences,
} from "./content-asset-policy";

test("extracts local assets from metadata, MDX components, and Markdown", () => {
  const source = `
export const metadata = { image: "/images/project.png" };

<BlogImage src="/images/blog/example.png" alt="Example" />
![Diagram](/images/blog/diagram.svg)
<img src='/images/raw.webp' alt='Raw' />
`;

  assert.deepEqual(extractLocalAssetPaths(source), [
    "/images/project.png",
    "/images/blog/example.png",
    "/images/blog/diagram.svg",
    "/images/raw.webp",
  ]);
});

test("ignores remote, data, anchor, and dynamic asset values", () => {
  const source = `
![Remote](https://example.com/image.png)
<img src="data:image/png;base64,abc" />
<a href="#section">Section</a>
<BlogImage src={imagePath} />
`;

  assert.deepEqual(extractLocalAssetPaths(source), []);
});

test("ignores local asset examples inside fenced and inline code", () => {
  const source = [
    "```tsx",
    '<BlogImage src="/images/example-only.png" />',
    "```",
    "Use `<img src=\"/images/inline-only.png\" />` in an example.",
  ].join("\n");

  assert.deepEqual(extractLocalAssetPaths(source), []);
});

test("reports missing public assets with the referencing content file", () => {
  const root = mkdtempSync(path.join(tmpdir(), "content-assets-"));
  const publicDir = path.join(root, "public");
  mkdirSync(path.join(publicDir, "images"), { recursive: true });
  writeFileSync(path.join(publicDir, "images", "exists.png"), "fixture");

  try {
    const issues = validateLocalAssetReferences(
      [
        {
          filePath: "src/content/posts/example.ko.mdx",
          source:
            '<BlogImage src="/images/exists.png" /><BlogImage src="/images/missing.png" />',
        },
      ],
      publicDir
    );

    assert.deepEqual(issues, [
      {
        code: "MISSING_LOCAL_ASSET",
        filePath: "src/content/posts/example.ko.mdx",
        assetPath: "/images/missing.png",
        message: "로컬 에셋 파일이 없습니다: /images/missing.png",
      },
    ]);
  } finally {
    rmSync(root, { recursive: true, force: true });
  }
});
