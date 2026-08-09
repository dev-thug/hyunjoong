import assert from "node:assert/strict";
import test from "node:test";
import { getLocaleFromPathname } from "./pathname-locale";

test("selects English only for an English route pathname", () => {
  assert.equal(getLocaleFromPathname("/en/not-a-real-route"), "en");
  assert.equal(getLocaleFromPathname("/ko/not-a-real-route"), "ko");
  assert.equal(getLocaleFromPathname(null), "ko");
});
