import assert from "node:assert/strict";
import test from "node:test";
import { buildNotFoundMetadata } from "./not-found";

test("builds noindex metadata without a canonical for missing resources", () => {
  const metadata = buildNotFoundMetadata();

  assert.deepEqual(metadata.robots, { index: false, follow: false });
  assert.equal(metadata.alternates?.canonical, null);
});
