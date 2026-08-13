import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import path from "node:path";
import test from "node:test";

const root = process.cwd();
const readRoute = (relativePath: string): string =>
  readFileSync(path.join(root, "src/app/[lang]", relativePath), "utf8");

const routeCases = [
  ["page.tsx", "home"],
  ["profile/page.tsx", "profile"],
  ["projects/page.tsx", "projects"],
  ["blog/page.tsx", "blog"],
  ["contact/page.tsx", "contact"],
] as const;

for (const [relativePath, surface] of routeCases) {
  test(`connects ${surface} route metadata to the developer-search policy`, () => {
    const source = readRoute(relativePath);
    assert.match(
      source,
      new RegExp(`getDeveloperSearchMetadata\\(lang,\\s*["']${surface}["']\\)`)
    );
    assert.match(source, /title:\s*(?:\{\s*absolute:\s*)?searchMetadata\.title/);
    assert.match(source, /description:\s*searchMetadata\.description/);
    assert.match(source, /keywords:\s*(?:\[\.\.\.)?searchMetadata\.keywords/);
  });
}

test("connects valid blog pagination metadata to its page-number policy", () => {
  const source = readRoute("blog/page/[page]/page.tsx");
  assert.match(
    source,
    /getBlogPaginationSearchMetadata\(lang,\s*parsedPage\)/
  );
  assert.match(source, /title:\s*searchMetadata\.title/);
  assert.match(source, /description:\s*searchMetadata\.description/);
  assert.match(source, /absoluteTitle:\s*true/);
});
