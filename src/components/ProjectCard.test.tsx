import assert from "node:assert/strict";
import test from "node:test";
import { renderToStaticMarkup } from "react-dom/server";
import ProjectCard from "./ProjectCard";

test("does not preload homepage project images ahead of the text LCP", () => {
  const markup = renderToStaticMarkup(
    <ProjectCard
      index={0}
      lang="ko"
      caseStudyLabel="CASE STUDY"
      viewProjectAriaTemplate="{title} 보기"
      project={{
        id: "example",
        slug: "example",
        title: "Example",
        adCopy: "Example copy",
        description: "Example description",
        highlight: "Product",
        image: "/images/specify.png",
        lang: "ko",
        tags: ["Next.js"],
        metrics: [],
      }}
    />
  );

  assert.match(markup, /loading="lazy"/);
  assert.doesNotMatch(markup, /fetchpriority="high"/);
  assert.doesNotMatch(markup, /rel="preload"/);
});
