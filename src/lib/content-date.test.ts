import assert from "node:assert/strict";
import test from "node:test";
import { parseContentDate } from "./content-date";

test("content freshness accepts calendar dates rather than normalized invalid days", () => {
  assert.equal(parseContentDate("2026-10-09"), "2026-10-09");
  assert.equal(parseContentDate("2024-02-29"), "2024-02-29");
  for (const value of [undefined, "", "2026-02-29", "2026-04-31", "10/09/2026", "2026-10-09T00:00:00Z"]) {
    assert.equal(parseContentDate(value), undefined);
  }
});
