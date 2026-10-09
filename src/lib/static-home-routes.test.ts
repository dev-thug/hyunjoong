import assert from "node:assert/strict";
import test from "node:test";
import { assertStaticContentRoutes, assertStaticHomeRoutes } from "./static-home-routes";

test("accepts a prerender manifest with static Korean and English home routes", () => {
  assert.doesNotThrow(() =>
    assertStaticHomeRoutes({
      routes: {
        "/ko": { compute: "static" },
        "/en": { compute: "static" },
      },
    })
  );
});

test("fails closed when either locale home route is absent or dynamic", () => {
  assert.throws(
    () =>
      assertStaticHomeRoutes({
        routes: {
          "/ko": { compute: "static" },
          "/en": { compute: "dynamic" },
        },
      }),
    /\/en/
  );

  assert.throws(() => assertStaticHomeRoutes({ routes: {} }), /\/ko.*\/en/);
});


test("published content must be prerendered, not silently left dynamic", () => {
  const paths = ["/ko/blog/example", "/en/projects/example"];
  assert.doesNotThrow(() => assertStaticContentRoutes({ routes: {
    "/ko/blog/example": { compute: "static" }, "/en/projects/example": { compute: "static" },
  } }, paths));
  assert.throws(() => assertStaticContentRoutes({ routes: {
    "/ko/blog/example": { compute: "dynamic" },
  } }, paths), /\/ko\/blog\/example.*\/en\/projects\/example/);
});
