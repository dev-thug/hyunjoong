import assert from "node:assert/strict";
import test from "node:test";
import { renderToStaticMarkup } from "react-dom/server";
import LocalizedNotFound from "./LocalizedNotFound";

test("renders the server-provided locale without waiting for pathname hydration", () => {
  const markup = renderToStaticMarkup(<LocalizedNotFound locale="en" />);

  assert.match(markup, /Beyond the Reach/);
  assert.match(markup, /href="\/en"/);
});

test("keeps the server fallback 404 compact until the client selects a locale from the pathname", () => {
  const markup = renderToStaticMarkup(<LocalizedNotFound />);

  assert.match(markup, /href="\/ko"/);
  assert.doesNotMatch(markup, /href="\/en"/);
});
