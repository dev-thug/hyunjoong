import assert from "node:assert/strict";
import test from "node:test";
import { isSupportedLocale } from "@/i18n-config";

test("accepts configured locales and rejects route-like values", () => {
  assert.equal(isSupportedLocale("ko"), true);
  assert.equal(isSupportedLocale("en"), true);
  assert.equal(isSupportedLocale("images"), false);
  assert.equal(isSupportedLocale("_next"), false);
  assert.equal(isSupportedLocale(undefined), false);
});
