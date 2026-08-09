import assert from "node:assert/strict";
import test from "node:test";
import { renderToStaticMarkup } from "react-dom/server";
import HeroSection from "./HeroSection";

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
