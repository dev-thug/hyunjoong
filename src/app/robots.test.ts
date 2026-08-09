import assert from "node:assert/strict";
import test from "node:test";
import robots from "./robots";

const withVercelEnv = (value: string | undefined, run: () => void) => {
  const previous = process.env.VERCEL_ENV;
  if (value === undefined) delete process.env.VERCEL_ENV;
  else process.env.VERCEL_ENV = value;
  try {
    run();
  } finally {
    if (previous === undefined) delete process.env.VERCEL_ENV;
    else process.env.VERCEL_ENV = previous;
  }
};

test("allows production crawling without hiding noindex query pages", () => {
  withVercelEnv("production", () => {
    const result = robots();
    assert.deepEqual(result.rules, [{ userAgent: "*", allow: "/" }]);
    assert.equal(result.sitemap, "https://hyunjoong.kim/sitemap.xml");
  });
});

test("blocks non-production deployments from indexing", () => {
  withVercelEnv("preview", () => {
    const result = robots();
    assert.deepEqual(result.rules, [{ userAgent: "*", disallow: "/" }]);
  });
});
