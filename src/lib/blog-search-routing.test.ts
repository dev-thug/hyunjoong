import assert from "node:assert/strict";
import test from "node:test";
import { resolveBlogSearchRoute } from "./blog-search-routing";

test("rewrites a localized blog query without changing its public path", () => {
  assert.deepEqual(resolveBlogSearchRoute("/ko/blog", [" Next.js "]), {
    type: "rewrite",
    pathname: "/ko/blog/search",
    query: "Next.js",
  });
});

test("uses the first repeated q value and treats empty or whitespace q as absent", () => {
  assert.deepEqual(resolveBlogSearchRoute("/en/blog", [" cloud ", "AI"]), {
    type: "rewrite",
    pathname: "/en/blog/search",
    query: "cloud",
  });
  assert.equal(resolveBlogSearchRoute("/en/blog", ["  ", "AI"]), null);
  assert.equal(resolveBlogSearchRoute("/en/blog", undefined), null);
});

test("redirects a filtered archive to the localized public blog search URL", () => {
  assert.deepEqual(
    resolveBlogSearchRoute("/ko/blog/page/2", "React & AWS"),
    {
      type: "redirect",
      pathname: "/ko/blog",
      query: "React & AWS",
    }
  );
  assert.deepEqual(
    resolveBlogSearchRoute("/ko/blog/page/not-a-number", "React"),
    { type: "redirect", pathname: "/ko/blog", query: "React" }
  );
});

test("redirects direct search-route visits to the public blog URL", () => {
  assert.deepEqual(resolveBlogSearchRoute("/en/blog/search", undefined), {
    type: "redirect",
    pathname: "/en/blog",
  });
  assert.deepEqual(resolveBlogSearchRoute("/en/blog/search", "  Rust  "), {
    type: "redirect",
    pathname: "/en/blog",
    query: "Rust",
  });
});

test("keeps direct search redirects and public rewrites loop-free", () => {
  const directVisit = resolveBlogSearchRoute("/ko/blog/search", "Rust");
  assert.equal(directVisit?.type, "redirect");
  if (directVisit?.type !== "redirect") {
    assert.fail("Expected direct internal search visits to redirect");
  }

  const publicVisit = resolveBlogSearchRoute(
    directVisit.pathname,
    directVisit.query
  );
  assert.deepEqual(publicVisit, {
    type: "rewrite",
    pathname: "/ko/blog/search",
    query: "Rust",
  });
});

test("caps routed search terms and ignores unrelated paths", () => {
  const longQuery = "x".repeat(240);
  const decision = resolveBlogSearchRoute("/ko/blog", longQuery);
  assert.equal(decision?.type, "rewrite");
  assert.equal(decision?.query?.length, 200);
  assert.equal(resolveBlogSearchRoute("/ko/projects", "x"), null);
  assert.equal(resolveBlogSearchRoute("/fr/blog", "x"), null);
});
