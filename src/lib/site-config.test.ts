import assert from "node:assert/strict";
import { execFileSync } from "node:child_process";
import test from "node:test";

test("normalizes a configured origin before emitting canonical URLs", () => {
  for (const configured of ["https://dev.hyunjoong.kim\n", "  https://dev.hyunjoong.kim/  "]) {
    const actual = execFileSync(process.execPath, [
      "--import", "tsx", "--input-type=module", "-e",
      "import { getSiteBaseUrl } from './src/lib/site-config.ts'; process.stdout.write(getSiteBaseUrl());",
    ], { env: { ...process.env, NEXT_PUBLIC_BASE_URL: configured }, encoding: "utf8" });
    assert.equal(actual, "https://dev.hyunjoong.kim");
  }
});
