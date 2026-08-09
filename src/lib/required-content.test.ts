import assert from "node:assert/strict";
import test from "node:test";
import { loadRequiredContent } from "./required-content";

test("returns a required content module when the loader succeeds", async () => {
  const loadedModule = await loadRequiredContent("example.ko.mdx", async () => ({
    default: "content",
  }));

  assert.equal(loadedModule.default, "content");
});

test("fails closed and preserves the import error cause", async () => {
  const cause = new SyntaxError("malformed MDX");

  await assert.rejects(
    loadRequiredContent("broken.ko.mdx", async () => {
      throw cause;
    }),
    (error: unknown) => {
      assert.ok(error instanceof Error);
      assert.match(error.message, /broken\.ko\.mdx/);
      assert.equal(error.cause, cause);
      return true;
    }
  );
});
