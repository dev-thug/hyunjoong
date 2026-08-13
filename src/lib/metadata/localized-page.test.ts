import assert from "node:assert/strict";
import test from "node:test";
import { buildLocalizedPageMetadata } from "./localized-page";

test("emits hreflang only for locales where a paginated route exists", () => {
  const metadata = buildLocalizedPageMetadata({
    lang: "ko",
    title: "Blog",
    description: "Latest posts",
    canonicalPath: "/blog/page/6",
    availableLocales: { ko: true, en: false },
  });

  assert.deepEqual(metadata.alternates?.languages, {
    ko: "https://hyunjoong.kim/ko/blog/page/6",
    "x-default": "https://hyunjoong.kim/ko/blog/page/6",
  });
  assert.equal(metadata.twitter?.creator, "@de0978");
});

test("keeps both locale alternates by default", () => {
  const metadata = buildLocalizedPageMetadata({
    lang: "en",
    title: "Profile",
    description: "Profile page",
    canonicalPath: "/profile",
  });

  assert.deepEqual(metadata.alternates?.languages, {
    ko: "https://hyunjoong.kim/ko/profile",
    en: "https://hyunjoong.kim/en/profile",
    "x-default": "https://hyunjoong.kim/ko/profile",
  });
});

test("forwards page-specific keywords without changing visible content", () => {
  const keywords = ["백엔드 개발자", "AWS 개발자"] as const;
  const metadata = buildLocalizedPageMetadata({
    lang: "ko",
    title: "김현중 개발자 프로필",
    description: "개발 경력과 기술 스택",
    path: "/profile",
    keywords,
    absoluteTitle: true,
  });

  assert.deepEqual(metadata.keywords, keywords);
  assert.deepEqual(metadata.title, { absolute: "김현중 개발자 프로필" });
});
