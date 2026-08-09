import assert from "node:assert/strict";
import { existsSync, readFileSync, statSync } from "node:fs";
import path from "node:path";
import test from "node:test";

const root = process.cwd();
const compatibilityFaviconPath = path.join(root, "public/images/favicon.svg");
const localeLayoutPath = path.join(root, "src/app/[lang]/layout.tsx");

test("keeps the legacy SVG favicon URL lightweight without using it as initial metadata", () => {
  assert.equal(existsSync(compatibilityFaviconPath), true);
  assert.ok(statSync(compatibilityFaviconPath).size < 20_000);
  assert.match(readFileSync(compatibilityFaviconPath, "utf8"), /data:image\/png;base64,/);
  assert.doesNotMatch(
    readFileSync(localeLayoutPath, "utf8"),
    /\/images\/favicon\.svg/
  );
});
