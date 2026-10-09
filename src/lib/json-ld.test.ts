import assert from "node:assert/strict";
import test from "node:test";
import { SOCIAL_LINK_MAP } from "@/constants";
import {
  buildBlogSchema,
  buildBreadcrumbSchema,
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
  assert.equal(person.image, `${baseUrl}/images/profile-portrait.webp`);
  assert.deepEqual(person.hasOccupation, {
    "@type": "Occupation",
    name: "소프트웨어 엔지니어",
    description: "고객과 팀을 위한 제품과 시스템을 만드는 소프트웨어 엔지니어.",
    skills: [
      "AI Agents",
      "RAG / GraphRAG",
      "System Design",
      "Software Architecture",
      "React",
      "Next.js",
      "TypeScript",
      "Tailwind CSS",
      "Node.js",
      "Python",
      "AWS",
      "Serverless",
      "Test Automation",
      "GitHub Actions",
      "Docker",
      "Evidence-led Validation",
    ],
  });
});

test("builds one domain-level WebSite identity linked to the canonical Person", () => {
  const website = buildWebsiteSchema({ baseUrl });

  assert.equal(website["@id"], `${baseUrl}/#website`);
  assert.equal(website.name, "Hyunjoong Kim");
  assert.equal(website.alternateName, "김현중");
  assert.equal(website.url, baseUrl);
  assert.deepEqual(website.author, { "@id": `${baseUrl}/#person` });
  assert.deepEqual(website.publisher, { "@id": `${baseUrl}/#person` });
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


test("breadcrumb schema describes the same canonical path users navigate", () => {
  const schema = buildBreadcrumbSchema(baseUrl, [
    { name: "홈", path: "/ko" },
    { name: "프로젝트", path: "/ko/projects" },
    { name: "맘마", path: "/ko/projects/mamma" },
  ]);
  assert.equal(schema["@type"], "BreadcrumbList");
  assert.deepEqual(schema.itemListElement.map(item => item.position), [1, 2, 3]);
  assert.equal(schema.itemListElement[2].item, baseUrl + "/ko/projects/mamma");
  assert.throws(() => buildBreadcrumbSchema(baseUrl, [{ name: "External", path: "//example.com" }]), /relative/);
});
