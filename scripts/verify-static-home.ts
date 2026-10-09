import { readFile } from "node:fs/promises";
import path from "node:path";
import {
  assertStaticHomeRoutes,
  assertStaticContentRoutes,
  type PrerenderManifest,
} from "../src/lib/static-home-routes";
import { BLOG_POSTS_PAGE_SIZE, getAllPosts } from "../src/lib/posts";
import { getAllProjects } from "../src/lib/projects";

const main = async (): Promise<void> => {
  const manifestPath = path.join(process.cwd(), ".next/prerender-manifest.json");
  const manifest = JSON.parse(
    await readFile(manifestPath, "utf8")
  ) as PrerenderManifest;

  assertStaticHomeRoutes(manifest);
  const [posts, projects] = await Promise.all([getAllPosts(), getAllProjects()]);
  const archivePaths = ["ko", "en"].flatMap(lang => {
    const pages = Math.ceil(posts.filter(post => post.lang === lang).length / BLOG_POSTS_PAGE_SIZE);
    return ["/" + lang + "/blog", ...Array.from({ length: Math.max(0, pages - 1) }, (_, index) => "/" + lang + "/blog/page/" + (index + 2))];
  });
  const corePaths = ["ko", "en"].flatMap(lang => ["", "/profile", "/projects", "/contact"].map(pathname => "/" + lang + pathname));
  const paths = [
    ...corePaths,
    ...archivePaths,
    ...posts.map(post => "/" + post.lang + "/blog/" + post.slug),
    ...projects.map(project => "/" + project.lang + "/projects/" + project.slug),
  ];
  assertStaticContentRoutes(manifest, paths);
  for (const lang of ["ko", "en"]) {
    if (manifest.routes?.["/" + lang + "/blog/search"]?.compute === "static") {
      throw new Error("Filtered search must not be cached as a static indexable archive.");
    }
  }
  const appPaths = JSON.parse(await readFile(path.join(process.cwd(), ".next/server/app-paths-manifest.json"), "utf8"));
  if (!appPaths["/[lang]/blog/search/page"]) throw new Error("Server-rendered search route must exist.");
  console.log("Verified static prerendering for /ko and /en home routes.");
  console.log("Verified static prerendering for " + paths.length + " published articles, projects, and archive pages.");
};

void main();
