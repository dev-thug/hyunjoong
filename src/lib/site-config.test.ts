import assert from "node:assert/strict";
import { execFileSync } from "node:child_process";
import test from "node:test";
import { SITE_NAME, SITE_ALTERNATE_NAME } from "./site-config";
import { BRAND } from "@/constants";
import { buildLocalizedPageMetadata } from "./metadata/localized-page";
import { buildContentDetailMetadata } from "./metadata/content-detail";

test("keeps the visible brand and localized social site names aligned", () => {
  assert.equal(SITE_NAME, "김현중");
  assert.equal(SITE_ALTERNATE_NAME, "Hyunjoong Kim");
  assert.equal(BRAND.NAME, SITE_NAME);
  for (const lang of ["ko", "en"] as const) {
    const page = buildLocalizedPageMetadata({ lang, title: "Profile", description: "Profile", path: "/profile" });
    const article = buildContentDetailMetadata({ lang, canonicalLang: lang, slug: "example", section: "blog", title: "Example", description: "Example", availableLocales: { ko: true, en: true } });
    assert.equal(page.openGraph?.siteName, SITE_NAME);
    assert.equal(article.openGraph?.siteName, SITE_NAME);
  }
});

test("normalizes a configured origin before emitting canonical URLs", () => {
  for (const configured of ["https://dev.hyunjoong.kim\n", "  https://dev.hyunjoong.kim/  "]) {
    const actual = execFileSync(process.execPath, [
      "--import", "tsx", "--input-type=module", "-e",
      "import { getSiteBaseUrl } from './src/lib/site-config.ts'; process.stdout.write(getSiteBaseUrl());",
    ], { env: { ...process.env, NEXT_PUBLIC_BASE_URL: configured }, encoding: "utf8" });
    assert.equal(actual, "https://dev.hyunjoong.kim");
  }
});
