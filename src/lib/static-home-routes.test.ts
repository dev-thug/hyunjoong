import assert from "node:assert/strict";
import test from "node:test";
import { assertStaticHomeRoutes } from "./static-home-routes";

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
