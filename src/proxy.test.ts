import assert from "node:assert/strict";
import { NextRequest } from "next/server";
import test from "node:test";
import { config, proxy } from "./proxy";

const localeProxyMatcher = config.matcher?.[0];

if (typeof localeProxyMatcher !== "string") {
  throw new Error("Expected a string locale proxy matcher");
}

const matchesLocaleProxy = (pathname: string): boolean =>
  new RegExp(`^${localeProxyMatcher}$`).test(pathname);

test("runs the locale proxy for localized and unlocalized document paths", () => {
  assert.equal(matchesLocaleProxy("/"), true);
  assert.equal(matchesLocaleProxy("/profile"), true);
  assert.equal(matchesLocaleProxy("/ko"), true);
  assert.equal(matchesLocaleProxy("/ko/projects/specify"), true);
  assert.equal(matchesLocaleProxy("/en"), true);
  assert.equal(matchesLocaleProxy("/en/blog/example"), true);
  assert.equal(matchesLocaleProxy("/en/no.such"), true);
});

test("continues to exclude Next internals, API routes, and static files", () => {
  assert.equal(matchesLocaleProxy("/_next/static/chunk.js"), false);
  assert.equal(matchesLocaleProxy("/api/contact"), false);
  assert.equal(matchesLocaleProxy("/images/favicon-96x96.png"), false);
  assert.equal(matchesLocaleProxy("/robots.txt"), false);
  assert.equal(matchesLocaleProxy("/llms.txt"), false);
  assert.equal(matchesLocaleProxy("/llms-full.txt"), false);
  assert.equal(matchesLocaleProxy("/sitemap.xml"), false);
});

test("serves WebP project covers and app previews without locale redirects", () => {
  assert.equal(matchesLocaleProxy("/images/projects/specify-ko.webp"), false);
  assert.equal(matchesLocaleProxy("/images/projects/mamma-chat.webp"), false);
  assert.equal(matchesLocaleProxy("/images/projects/petty-en.webp"), false);
});

test("rewrites a filtered localized blog request internally", () => {
  const response = proxy(
    new NextRequest("https://example.test/ko/blog?q=Next.js")
  );
  const rewrite = response.headers.get("x-middleware-rewrite");

  assert.ok(rewrite);
  const rewriteUrl = new URL(rewrite);
  assert.equal(rewriteUrl.pathname, "/ko/blog/search");
  assert.equal(rewriteUrl.searchParams.get("q"), "Next.js");
  assert.equal(
    response.headers.get("x-middleware-request-x-request-locale"),
    "ko"
  );
});

test("redirects filtered archives to the public blog search URL", () => {
  const response = proxy(
    new NextRequest("https://example.test/en/blog/page/2?q=React%20AWS")
  );
  const location = response.headers.get("location");

  assert.equal(response.status, 307);
  assert.ok(location);
  const redirectUrl = new URL(location);
  assert.equal(redirectUrl.pathname, "/en/blog");
  assert.equal(redirectUrl.searchParams.get("q"), "React AWS");
});

test("redirects direct internal search-route visits back to the public URL", () => {
  const response = proxy(
    new NextRequest("https://example.test/ko/blog/search?q=%20%20")
  );
  const location = response.headers.get("location");

  assert.equal(response.status, 307);
  assert.ok(location);
  const redirectUrl = new URL(location);
  assert.equal(redirectUrl.pathname, "/ko/blog");
  assert.equal(redirectUrl.search, "");
});

test("does not rewrite empty or whitespace-only public searches", () => {
  const empty = proxy(new NextRequest("https://example.test/ko/blog?q="));
  const whitespace = proxy(
    new NextRequest("https://example.test/ko/blog?q=+&q=React")
  );

  assert.equal(empty.headers.get("x-middleware-rewrite"), null);
  assert.equal(whitespace.headers.get("x-middleware-rewrite"), null);
});

test("preserves locale selection and cookie behavior before search routing", () => {
  const response = proxy(
    new NextRequest("https://example.test/blog?q=React", {
      headers: { "accept-language": "en" },
    })
  );
  const location = response.headers.get("location");

  assert.equal(response.status, 307);
  assert.ok(location);
  const redirectUrl = new URL(location);
  assert.equal(redirectUrl.pathname, "/en/blog");
  assert.equal(redirectUrl.searchParams.get("q"), "React");
  assert.equal(response.cookies.get("NEXT_LOCALE")?.value, "en");
});
