import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import path from "node:path";
import test from "node:test";

const profilePageSource = readFileSync(
  path.join(process.cwd(), "src", "app", "[lang]", "profile", "page.tsx"),
  "utf8",
);

test("keeps the emphasized profile-heading phrase together when it wraps", () => {
  assert.match(
    profilePageSource,
    /<span className="inline-block whitespace-nowrap">\s*<span className="text-gray-500 italic">\{dict\.profile\.intro_heading_emphasis\}<\/span>\s*\{dict\.profile\.intro_heading_suffix\}\s*<\/span>/,
  );
});
