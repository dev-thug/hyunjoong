import assert from "node:assert/strict";
import test from "node:test";
import config from "../../next.config";

test("actual Next headers protect custom-domain previews without blocking production", async () => {
  const original = process.env.VERCEL_ENV;
  try {
    if (!config.headers) throw new Error("Expected deployment response headers");
    for (const environment of ["production", "preview", "development"]) {
      process.env.VERCEL_ENV = environment;
      const rules = await config.headers();
      const global = rules.find(rule => rule.source === "/(.*)");
      const robots = global?.headers.find(header => header.key === "X-Robots-Tag");
      assert.equal(robots?.value, environment === "production" ? undefined : "noindex, nofollow");
      const api = rules.find(rule => rule.source === "/api/:path*");
      assert.equal(api?.headers.find(header => header.key === "X-Robots-Tag")?.value, "noindex, nofollow");
    }
  } finally {
    if (original === undefined) delete process.env.VERCEL_ENV;
    else process.env.VERCEL_ENV = original;
  }
});
