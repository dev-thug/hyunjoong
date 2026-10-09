import assert from "node:assert/strict";
import test from "node:test";
import { GET } from "./route";

const withVercelEnv = async (
  value: string,
  run: () => Promise<void>
): Promise<void> => {
  const previous = process.env.VERCEL_ENV;
  process.env.VERCEL_ENV = value;
  try {
    await run();
  } finally {
    if (previous === undefined) delete process.env.VERCEL_ENV;
    else process.env.VERCEL_ENV = previous;
  }
};

test("serves the concise discovery index as UTF-8 plain text", async () => {
  await withVercelEnv("production", async () => {
    const response = await GET();
    const body = await response.text();

    assert.equal(response.status, 200);
    assert.match(response.headers.get("content-type") ?? "", /^text\/plain; charset=utf-8$/);
    assert.match(body, /^# Hyunjoong Kim/m);
    assert.match(body, /Complete public-page index/);
  });
});

test("keeps preview discovery content empty", async () => {
  await withVercelEnv("preview", async () => {
    const response = await GET();
    assert.equal(await response.text(), "");
  });
});
