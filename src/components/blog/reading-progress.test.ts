import assert from "node:assert/strict";
import test from "node:test";

import { calculateReadingProgress } from "./reading-progress";

test("calculates reading progress and remaining percent", () => {
  const result = calculateReadingProgress(250, 1000);

  assert.equal(result.readPercent, 25);
  assert.equal(result.remainingPercent, 75);
});

test("clamps read percent to 0 when current is negative", () => {
  const result = calculateReadingProgress(-10, 1000);

  assert.equal(result.readPercent, 0);
  assert.equal(result.remainingPercent, 100);
});

test("clamps read percent to 100 when current exceeds total", () => {
  const result = calculateReadingProgress(1500, 1000);

  assert.equal(result.readPercent, 100);
  assert.equal(result.remainingPercent, 0);
});

test("handles zero or negative total safely", () => {
  const zeroTotal = calculateReadingProgress(100, 0);
  const negativeTotal = calculateReadingProgress(100, -1);

  assert.deepEqual(zeroTotal, { readPercent: 0, remainingPercent: 100 });
  assert.deepEqual(negativeTotal, { readPercent: 0, remainingPercent: 100 });
});
