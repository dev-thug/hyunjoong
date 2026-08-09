import { readFile } from "node:fs/promises";
import path from "node:path";
import {
  assertStaticHomeRoutes,
  type PrerenderManifest,
} from "../src/lib/static-home-routes";

const main = async (): Promise<void> => {
  const manifestPath = path.join(process.cwd(), ".next/prerender-manifest.json");
  const manifest = JSON.parse(
    await readFile(manifestPath, "utf8")
  ) as PrerenderManifest;

  assertStaticHomeRoutes(manifest);
  console.log("Verified static prerendering for /ko and /en home routes.");
};

void main();
