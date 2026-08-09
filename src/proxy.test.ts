import assert from "node:assert/strict";
import test from "node:test";
import { config } from "./proxy";

const localeProxyMatcher = config.matcher?.[0];

if (typeof localeProxyMatcher !== "string") {
  throw new Error("Expected a string locale proxy matcher");
}

const matchesLocaleProxy = (pathname: string): boolean =>
  new RegExp(`^${localeProxyMatcher}$`).test(pathname);

test("runs the locale proxy for localized and unlocalized document paths", () => {
  assert.equal(matchesLocaleProxy("/"), true);
  assert.equal(matchesLocaleProxy("/profile"), true);
  assert.equal(matchesLocaleProxy("/ko"), true);
  assert.equal(matchesLocaleProxy("/ko/projects/specify"), true);
  assert.equal(matchesLocaleProxy("/en"), true);
  assert.equal(matchesLocaleProxy("/en/blog/example"), true);
  assert.equal(matchesLocaleProxy("/en/no.such"), true);
});

test("continues to exclude Next internals, API routes, and static files", () => {
  assert.equal(matchesLocaleProxy("/_next/static/chunk.js"), false);
  assert.equal(matchesLocaleProxy("/api/contact"), false);
  assert.equal(matchesLocaleProxy("/images/favicon-96x96.png"), false);
});
