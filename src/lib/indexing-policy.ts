interface DeploymentEnvironment {
  VERCEL_ENV?: string;
  NODE_ENV?: string;
}

/** Crawlers must be able to read noindex; robots.txt is not an access-control mechanism. */
export const shouldNoIndexDeployment = (environment: DeploymentEnvironment = process.env): boolean => {
  if (environment.VERCEL_ENV) return environment.VERCEL_ENV !== "production";
  return environment.NODE_ENV === "development";
};
