import assert from "node:assert/strict";
import test from "node:test";
import { isAllowedContactOrigin } from "./origin";

test("allows requests from the same host", () => {
  assert.equal(
    isAllowedContactOrigin("https://hyunjoong.kim", "hyunjoong.kim"),
    true
  );
});

test("allows requests from the same local host and port", () => {
  assert.equal(
    isAllowedContactOrigin("http://localhost:3000", "localhost:3000"),
    true
  );
});

test("rejects missing or cross-site origins", () => {
  assert.equal(isAllowedContactOrigin(null, "hyunjoong.kim"), false);
  assert.equal(
    isAllowedContactOrigin("https://example.com", "hyunjoong.kim"),
    false
  );
});

test("rejects malformed origins", () => {
  assert.equal(isAllowedContactOrigin("not a url", "hyunjoong.kim"), false);
});
