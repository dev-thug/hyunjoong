import assert from "node:assert/strict";
import test from "node:test";
import type { ReactNode } from "react";
import { useMDXComponents } from "./mdx-components";

test("does not render MDX h1 content because detail routes own the page h1", () => {
  const components = useMDXComponents({});
  const Heading = components.h1 as (props: { children: ReactNode }) => ReactNode;

  assert.equal(Heading({ children: "Article title" }), null);
});
