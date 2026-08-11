import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import test from "node:test";
import React from "react";
import { renderToStaticMarkup } from "react-dom/server";
import koDictionary from "@/dictionaries/ko.json";
import enDictionary from "@/dictionaries/en.json";
import AboutSection from "./AboutSection";

const aboutSectionSource = readFileSync(
  resolve(process.cwd(), "src/components/sections/AboutSection.tsx"),
  "utf8",
);

const authoredPhilosophy = `"I don't just build software. I build leverage."`;

const toPlainText = (markup: string): string =>
  markup
    .replace(/<[^>]+>/g, "")
    .replaceAll("&quot;", '"')
    .replaceAll("&#x27;", "'");

test("preserves Hyunjoong's authored philosophy verbatim in every locale", () => {
  assert.match(aboutSectionSource, /I don(?:&apos;|')t just build software\./);
  assert.match(aboutSectionSource, /I build leverage\./);
  assert.doesNotMatch(aboutSectionSource, /dict\.about\.heading_(prefix|emphasis|suffix)/);

  for (const [locale, dictionary] of [
    ["ko", koDictionary],
    ["en", enDictionary],
  ] as const) {
    const html = renderToStaticMarkup(
      React.createElement(AboutSection, { dict: dictionary }),
    );
    const headingHtml = html.match(/<h2[^>]*>(.*?)<\/h2>/)?.[1];

    assert.ok(headingHtml, `${locale} About heading should render`);
    assert.equal(toPlainText(headingHtml), authoredPhilosophy);
  }
});

test("keeps the authored philosophy's two sentences visually distinct on desktop", () => {
  assert.match(aboutSectionSource, /<br className="hidden md:block"\s*\/>/);
  assert.match(
    aboutSectionSource,
    /<span className="text-gray-500 italic">\s*I build leverage\.&quot;\s*<\/span>/,
  );
});

test("does not leave the replaced localized slogan in the About dictionaries", () => {
  for (const dictionary of [koDictionary, enDictionary]) {
    assert.equal("heading_prefix" in dictionary.about, false);
    assert.equal("heading_emphasis" in dictionary.about, false);
    assert.equal("heading_suffix" in dictionary.about, false);
  }
});
