import assert from "node:assert/strict";
import test from "node:test";
import { SOCIAL_LINK_MAP } from "@/constants";
import {
  buildBlogSchema,
  buildSitePerson,
  buildWebsiteSchema,
  safeJsonLdStringify,
} from "./json-ld";

const baseUrl = "https://hyunjoong.kim";

test("builds one canonical Korean public Person identity", () => {
  const person = buildSitePerson(baseUrl, "ko");

  assert.equal(person["@id"], `${baseUrl}/#person`);
  assert.equal(person.name, "김현중");
  assert.equal(person.alternateName, "Hyunjoong Kim");
  assert.equal(person.jobTitle, "소프트웨어 엔지니어");
  assert.doesNotMatch(person.description, /Specify\.app|제품 빌더/i);
  assert.deepEqual(person.sameAs, [
    SOCIAL_LINK_MAP.github.href,
    SOCIAL_LINK_MAP.linkedin.href,
    SOCIAL_LINK_MAP.x.href,
  ]);
  assert.equal(person.image, `${baseUrl}/images/profile-photo.png`);
});

test("links WebSite authorship to the canonical Person id", () => {
  const website = buildWebsiteSchema({
    baseUrl,
    lang: "en",
    title: "Hyunjoong Kim",
    description: "Software engineering and cloud architecture.",
  });

  assert.equal(website["@id"], `${baseUrl}/#website`);
  assert.equal(website.url, `${baseUrl}/en`);
  assert.equal(website.inLanguage, "en");
  assert.deepEqual(website.author, { "@id": `${baseUrl}/#person` });
});

test("builds an indexable Blog collection with post entities", () => {
  const schema = buildBlogSchema({
    baseUrl,
    lang: "ko",
    name: "김현중의 기술 블로그",
    description: "AI 에이전트와 제품 개발에 대한 글",
    posts: [
      {
        slug: "reliable-ai-agents",
        title: "신뢰할 수 있는 AI 에이전트",
        excerpt: "운영 가능한 에이전트 설계",
        date: "2026-08-09",
      },
    ],
  });

  assert.equal(schema["@type"], "Blog");
  assert.equal(schema["@id"], `${baseUrl}/ko/blog#blog`);
  assert.equal(schema.blogPost.length, 1);
  assert.deepEqual(schema.blogPost[0], {
    "@type": "BlogPosting",
    headline: "신뢰할 수 있는 AI 에이전트",
    description: "운영 가능한 에이전트 설계",
    datePublished: "2026-08-09",
    inLanguage: "ko",
    url: `${baseUrl}/ko/blog/reliable-ai-agents`,
    author: { "@id": `${baseUrl}/#person` },
  });
});

test("escapes closing-script vectors in JSON-LD", () => {
  assert.equal(
    safeJsonLdStringify({ value: "</script>" }),
    '{"value":"\\u003c/script>"}'
  );
});

test("rejects non-serializable JSON-LD root values", () => {
  assert.throws(
    () => safeJsonLdStringify(undefined),
    (error: unknown) =>
      error instanceof TypeError &&
      error.message === "JSON-LD payload must be serializable."
  );
});
