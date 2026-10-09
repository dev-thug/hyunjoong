import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import path from "node:path";
import test from "node:test";

const root = process.cwd();
const layoutPath = path.join(root, "src/app/[lang]/layout.tsx");
const homePath = path.join(root, "src/app/[lang]/page.tsx");

test("keeps the home canonical out of the shared locale layout", () => {
  const layout = readFileSync(layoutPath, "utf8");
  const home = readFileSync(homePath, "utf8");

  assert.doesNotMatch(layout, /canonical:\s*`\$\{baseUrl\}\/\$\{lang\}`/);
  assert.match(home, /canonical:\s*`\$\{baseUrl\}\/\$\{lang\}`/);
});

test("uses the exact localized home title and description for social metadata", () => {
  const home = readFileSync(homePath, "utf8");

  assert.match(home, /title:\s*\{\s*absolute:\s*searchMetadata\.title\s*\}/);
  assert.match(
    home,
    /openGraph:\s*\{[\s\S]*?title:\s*searchMetadata\.title,[\s\S]*?description:\s*searchMetadata\.description/
  );
  assert.match(
    home,
    /twitter:\s*\{[\s\S]*?title:\s*searchMetadata\.title,[\s\S]*?description:\s*searchMetadata\.description/
  );
});
