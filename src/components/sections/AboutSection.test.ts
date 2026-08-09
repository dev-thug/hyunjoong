import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import test from "node:test";
import React from "react";
import { renderToStaticMarkup } from "react-dom/server";
import koDictionary from "@/dictionaries/ko.json";
import enDictionary from "@/dictionaries/en.json";
import AboutSection from "./AboutSection";

type Dictionary = {
  readonly about: Record<string, string>;
};

const aboutSectionSource = readFileSync(
  resolve(process.cwd(), "src/components/sections/AboutSection.tsx"),
  "utf8",
);

const readDictionary = (locale: "ko" | "en"): Dictionary =>
  JSON.parse(
    readFileSync(resolve(process.cwd(), `src/dictionaries/${locale}.json`), "utf8"),
  ) as Dictionary;

test("renders a locale-specific About heading instead of the hardcoded English slogan", () => {
  assert.doesNotMatch(aboutSectionSource, /I don(?:&apos;|')t just build software/i);
  assert.match(aboutSectionSource, /\{dict\.about\.heading_prefix\}/);
  assert.match(aboutSectionSource, /\{dict\.about\.heading_emphasis\}/);
  assert.match(aboutSectionSource, /\{dict\.about\.heading_suffix\}/);
  assert.match(
    aboutSectionSource,
    /<span className="inline-block whitespace-nowrap">\s*<span className="text-gray-500 italic">\s*\{dict\.about\.heading_emphasis\}\s*<\/span>\s*\{dict\.about\.heading_suffix\}\s*<\/span>/,
  );

  const ko = readDictionary("ko");
  const en = readDictionary("en");

  assert.deepEqual(
    [
      ko.about.heading_prefix,
      ko.about.heading_emphasis,
      ko.about.heading_suffix,
    ],
    ["고객과 팀의 일을 ", "더 편하게", " 합니다."],
  );
  assert.deepEqual(
    [
      en.about.heading_prefix,
      en.about.heading_emphasis,
      en.about.heading_suffix,
    ],
    ["I help customers and teams ", "work better", "."],
  );
});

test("lets the About heading wrap at natural word boundaries on desktop", () => {
  assert.doesNotMatch(aboutSectionSource, /<br className="hidden md:block"\s*\/>/);
});

test("renders each localized About heading with a safe no-wrap ending", () => {
  const cases = [
    ["ko", koDictionary, "고객과 팀의 일을 더 편하게 합니다."],
    ["en", enDictionary, "I help customers and teams work better."],
  ] as const;

  for (const [locale, dictionary, expectedHeading] of cases) {
    const html = renderToStaticMarkup(
      React.createElement(AboutSection, { dict: dictionary }),
    );
    const headingHtml = html.match(/<h2[^>]*>(.*?)<\/h2>/)?.[1];

    assert.ok(headingHtml, `${locale} About heading should render`);
    assert.equal(headingHtml.replace(/<[^>]+>/g, ""), expectedHeading);
    assert.match(
      headingHtml,
      /<span class="inline-block whitespace-nowrap"><span class="text-gray-500 italic">.+<\/span>.*<\/span>/,
    );
  }
});
