import assert from "node:assert/strict";
import test from "node:test";
import { getProjectSourceBySlug } from "./projects";
import { extractTocItems } from "./toc";

test("project reading navigation uses the document's actual section headings", async () => {
  const source = await getProjectSourceBySlug("mamma", "ko");
  assert.ok(source);
  const sections = extractTocItems(source).filter((item) => item.level === 2);
  assert.ok(sections.length >= 3);
  assert.equal(new Set(sections.map((item) => item.id)).size, sections.length);
});

test("project source lookup rejects path traversal and unsupported locales", async () => {
  for (const [slug, lang] of [["../public-profile", "ko"], ["mamma", "../../en"], ["mamma", "fr"], ["missing-project", "ko"]]) {
    assert.equal(await getProjectSourceBySlug(slug, lang), null);
  }
});

test("published project metadata exposes its explicitly reviewed update date", async () => {
  const { getAllProjects } = await import("./projects");
  for (const lang of ["ko", "en"]) {
    const projects = await getAllProjects(lang);
    assert.ok(projects.length > 0);
    for (const project of projects) assert.equal(project.updatedAt, "2026-10-09");
  }
});
