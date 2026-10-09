import assert from "node:assert/strict";
import test from "node:test";
import { PUBLIC_PROFILE_REVIEWED_AT } from "@/data/public-profile";
import { BLOG_POSTS_PAGE_SIZE, getAllPosts } from "@/lib/posts";
import { getAllProjects } from "@/lib/projects";
import sitemap from "./sitemap";

const baseUrl = "https://hyunjoong.kim";

const withVercelEnv = async <T>(
  value: string | undefined,
  run: () => Promise<T>
): Promise<T> => {
  const previous = process.env.VERCEL_ENV;
  if (value === undefined) delete process.env.VERCEL_ENV;
  else process.env.VERCEL_ENV = value;
  try {
    return await run();
  } finally {
    if (previous === undefined) delete process.env.VERCEL_ENV;
    else process.env.VERCEL_ENV = previous;
  }
};

test("includes only valid localized blog pagination URLs and alternates", async () => {
  await withVercelEnv("production", async () => {
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
});

test("includes visible canonical pages with reciprocal localized alternates", async () => {
  await withVercelEnv("production", async () => {
    const [entries, visiblePosts, allPosts] = await Promise.all([
      sitemap(),
      getAllPosts(),
      getAllPosts(undefined, { includeHidden: true }),
    ]);
    const entryByUrl = new Map(entries.map((entry) => [entry.url, entry]));

    for (const post of visiblePosts) {
      const url = `${baseUrl}/${post.lang}/blog/${post.slug}`;
      const entry = entryByUrl.get(url);
      assert.ok(entry, `expected visible post in sitemap: ${url}`);
      assert.equal(entry.alternates?.languages?.[post.lang], url);
      assert.equal(entry.lastModified, undefined);
    }

    for (const post of allPosts.filter((item) => item.hidden)) {
      assert.equal(
        entryByUrl.has(`${baseUrl}/${post.lang}/blog/${post.slug}`),
        false,
        `hidden post must not appear in sitemap: ${post.slug}`
      );
    }

    for (const entry of entries) {
      for (const alternateUrl of Object.values(entry.alternates?.languages ?? {})) {
        if (alternateUrl) {
          assert.ok(
            entryByUrl.has(alternateUrl),
            `${alternateUrl} must be in the sitemap`
          );
        }
      }
    }
  });
});

test("uses only an explicit review date for lastModified values", async () => {
  await withVercelEnv("production", async () => {
    const entries = await sitemap();
    const profileEntry = entries.find(
      (entry) => entry.url === `${baseUrl}/ko/profile`
    );

    assert.ok(profileEntry?.lastModified);
    assert.equal(
      new Date(profileEntry.lastModified).toISOString(),
      `${PUBLIC_PROFILE_REVIEWED_AT}T00:00:00.000Z`
    );
    assert.ok(
      entries.every(
        (entry) =>
          entry.url.includes("/profile") ||
          entry.url.includes("/projects") ||
          !entry.lastModified
      )
    );
  });
});

test("uses explicit project update dates on detail and projects index pages", async () => {
  await withVercelEnv("production", async () => {
    const [entries, koProjects, enProjects] = await Promise.all([
      sitemap(),
      getAllProjects("ko"),
      getAllProjects("en"),
    ]);
    const entryByUrl = new Map(entries.map((entry) => [entry.url, entry]));

    for (const project of [...koProjects, ...enProjects]) {
      const entry = entryByUrl.get(
        `${baseUrl}/${project.lang}/projects/${project.slug}`
      );
      assert.ok(entry, `expected project in sitemap: ${project.slug}`);
      assert.ok(project.updatedAt, `expected explicit updatedAt: ${project.slug}`);
      assert.ok(entry.lastModified, `expected lastModified: ${project.slug}`);
      assert.equal(
        new Date(entry.lastModified).toISOString(),
        `${project.updatedAt}T00:00:00.000Z`
      );
    }

    for (const [lang, projects] of [
      ["ko", koProjects],
      ["en", enProjects],
    ] as const) {
      const explicitDates = projects
        .map((project) => project.updatedAt)
        .filter((date): date is string => Boolean(date))
        .sort();
      const expectedDate = explicitDates.at(-1);
      const listingEntry = entryByUrl.get(`${baseUrl}/${lang}/projects`);
      assert.ok(listingEntry);
      assert.equal(
        listingEntry.lastModified
          ? new Date(listingEntry.lastModified).toISOString()
          : undefined,
        expectedDate ? `${expectedDate}T00:00:00.000Z` : undefined
      );
    }
  });
});

test("does not publish a preview sitemap with production canonical URLs", async () => {
  await withVercelEnv("preview", async () => {
    assert.deepEqual(await sitemap(), []);
  });
});
