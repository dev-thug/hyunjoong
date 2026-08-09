import assert from "node:assert/strict";
import test from "node:test";
import { getRequestLocale } from "./request-locale";

test("accepts only configured request locale values", () => {
  assert.equal(getRequestLocale(new Headers({ "x-request-locale": "en" })), "en");
  assert.equal(getRequestLocale(new Headers({ "x-request-locale": "ko" })), "ko");
  assert.equal(getRequestLocale(new Headers({ "x-request-locale": "fr" })), "ko");
  assert.equal(getRequestLocale(new Headers()), "ko");
});
