import assert from "node:assert/strict";
import test from "node:test";
import { getIndexablePostLocales } from "./posts";

test("hreflang includes only valid public translations, never hidden or missing content", () => {
  assert.deepEqual(getIndexablePostLocales([
    { lang: "ko" }, { lang: "en", hidden: true }, null, { lang: "fr" }, { lang: "ko" },
  ]), ["ko"]);
  assert.deepEqual(getIndexablePostLocales([{ lang: "en" }, { lang: "ko" }]), ["en", "ko"]);
});
