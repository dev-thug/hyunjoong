import assert from "node:assert/strict";
import test from "node:test";
import { extractTocItems } from "./toc.ts";

test("extracts h2/h3 headings with stable unique ids", () => {
  const mdx = `
## Intro
### Setup
## Intro
`;

  const items = extractTocItems(mdx);
  assert.deepEqual(
    items.map((item) => item.id),
    ["intro", "setup", "intro-2"]
  );
  assert.deepEqual(
    items.map((item) => item.level),
    [2, 3, 2]
  );
});

test("ignores fenced blocks and strips inline markdown in heading text", () => {
  const mdx = `
\`\`\`md
## Ignored
### Still Ignored
\`\`\`

## **Bold** and \`code\` [Link](https://example.com)
### ~~_Deep_~~ Dive
`;

  const items = extractTocItems(mdx);
  assert.deepEqual(items, [
    { id: "bold-and-code-link", text: "Bold and code Link", level: 2 },
    { id: "deep-dive", text: "Deep Dive", level: 3 },
  ]);
});
