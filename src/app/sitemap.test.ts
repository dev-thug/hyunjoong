import assert from "node:assert/strict";
import test from "node:test";
import sitemap from "./sitemap";
import { BLOG_POSTS_PAGE_SIZE, getAllPosts } from "@/lib/posts";

const baseUrl = "https://hyunjoong.kim";

test("includes only valid localized blog pagination URLs and alternates", async () => {
  const [entries, koPosts, enPosts] = await Promise.all([
    sitemap(),
    getAllPosts("ko"),
    getAllPosts("en"),
  ]);
  const entryByUrl = new Map(entries.map((entry) => [entry.url, entry]));
  const pageCounts = {
    ko: Math.ceil(koPosts.length / BLOG_POSTS_PAGE_SIZE),
    en: Math.ceil(enPosts.length / BLOG_POSTS_PAGE_SIZE),
  };

  for (const lang of ["ko", "en"] as const) {
    for (let page = 2; page <= pageCounts[lang]; page += 1) {
      assert.equal(entryByUrl.has(`${baseUrl}/${lang}/blog/page/${page}`), true);
    }
    assert.equal(
      entryByUrl.has(`${baseUrl}/${lang}/blog/page/${pageCounts[lang] + 1}`),
      false
    );
  }

  const lastKoPageUrl = `${baseUrl}/ko/blog/page/${pageCounts.ko}`;
  const lastKoPage = entryByUrl.get(lastKoPageUrl);
  assert.ok(lastKoPage);
  const expectedLanguages: Record<string, string> = {
    ko: lastKoPageUrl,
    "x-default": lastKoPageUrl,
  };
  if (pageCounts.en >= pageCounts.ko) {
    expectedLanguages.en = `${baseUrl}/en/blog/page/${pageCounts.ko}`;
  }
  assert.deepEqual(lastKoPage.alternates?.languages, expectedLanguages);
});
