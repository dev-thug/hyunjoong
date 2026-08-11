import assert from "node:assert/strict";
import test from "node:test";
import { renderToStaticMarkup } from "react-dom/server";
import koDictionary from "@/dictionaries/ko.json";
import enDictionary from "@/dictionaries/en.json";
import HeroSection from "./HeroSection";

const authoredPhilosophy = "I don't just build software. I build leverage.";

const toPlainText = (markup: string): string =>
  markup
    .replace(/<[^>]+>/g, "")
    .replaceAll("&#x27;", "'")
    .replaceAll("&apos;", "'");

test("renders the LCP hero title without an opacity-zero reveal animation", () => {
  const markup = renderToStaticMarkup(
    <HeroSection
      dict={
        {
          hero: {
            architecture: "ARCHITECTURE",
            intelligence_subtitle: "INTELLIGENCE",
            title_beyond: "BEYOND",
            title_code: "CODE",
            role_title: "ROLE",
            role_description: "DESCRIPTION",
            open_for_ventures: "OPEN",
            scroll: "SCROLL",
          },
        } as never
      }
    />
  );

  assert.match(markup, /BEYOND/);
  assert.doesNotMatch(markup, /animate-reveal/);
});

test("renders Hyunjoong's authored philosophy verbatim in the landing Hero for every locale", () => {
  for (const [locale, dictionary] of [
    ["ko", koDictionary],
    ["en", enDictionary],
  ] as const) {
    assert.equal(
      dictionary.hero.role_title,
      authoredPhilosophy,
      `${locale} Hero dictionary should preserve the authored philosophy`,
    );

    const markup = renderToStaticMarkup(
      <HeroSection dict={dictionary as never} />,
    );
    const heroTitleHtml = markup.match(/<h2[^>]*>(.*?)<\/h2>/)?.[1];

    assert.ok(heroTitleHtml, `${locale} Hero manifesto title should render`);
    assert.equal(
      toPlainText(heroTitleHtml),
      authoredPhilosophy,
      `${locale} Hero manifesto title should be visible verbatim`,
    );
  }
});
