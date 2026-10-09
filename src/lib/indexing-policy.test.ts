import assert from "node:assert/strict";
import test from "node:test";
import { shouldNoIndexDeployment } from "./indexing-policy";

test("production content remains indexable while previews and development are not", () => {
  assert.equal(shouldNoIndexDeployment({ VERCEL_ENV: "production", NODE_ENV: "production" }), false);
  assert.equal(shouldNoIndexDeployment({ NODE_ENV: "production" }), false);
  assert.equal(shouldNoIndexDeployment({ VERCEL_ENV: "preview", NODE_ENV: "production" }), true);
  assert.equal(shouldNoIndexDeployment({ VERCEL_ENV: "development" }), true);
  assert.equal(shouldNoIndexDeployment({ NODE_ENV: "development" }), true);
});
