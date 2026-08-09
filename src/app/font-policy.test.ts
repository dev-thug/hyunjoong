import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import path from "node:path";
import test from "node:test";

const layoutPath = path.join(process.cwd(), "src/app/[lang]/layout.tsx");
const globalsPath = path.join(process.cwd(), "src/app/globals.css");

test("keeps a non-preloaded Korean webfont for glyph coverage without competing for the initial LCP", () => {
  const layout = readFileSync(layoutPath, "utf8");
  const globals = readFileSync(globalsPath, "utf8");

  assert.match(layout, /Noto_Sans_KR/);
  assert.match(layout, /preload:\s*false/);
  assert.match(layout, /weight:\s*\["400"\]/);
  assert.match(
    globals,
    /\.font-montserrat\s*\{[\s\S]*?var\(--font-noto-sans-kr\)/
  );
});
