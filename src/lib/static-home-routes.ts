export interface PrerenderedRoute {
  readonly compute?: string;
}

export interface PrerenderManifest {
  readonly routes?: Readonly<Record<string, PrerenderedRoute>>;
}

const REQUIRED_STATIC_HOME_ROUTES = ["/ko", "/en"] as const;

export const assertStaticHomeRoutes = (manifest: PrerenderManifest): void => {
  const missingOrDynamic = REQUIRED_STATIC_HOME_ROUTES.filter(
    (route) => manifest.routes?.[route]?.compute !== "static"
  );

  if (missingOrDynamic.length > 0) {
    throw new Error(
      `Expected static prerendered home routes: ${missingOrDynamic.join(", ")}`
    );
  }
};

export const assertStaticContentRoutes = (manifest: PrerenderManifest, paths: readonly string[]): void => {
  const missing = paths.filter(path => manifest.routes?.[path]?.compute !== "static");
  if (missing.length) throw new Error("Published content must be statically prerendered: " + missing.join(", "));
};
