import assert from "node:assert/strict";
import test from "node:test";
import {
  transitionLiquidBackgroundLoad,
  type LiquidBackgroundLoadState,
} from "./liquid-background-loader-state";

test("does not schedule or import the background again after a visibility cycle", () => {
  let state: LiquidBackgroundLoadState = "idle";

  state = transitionLiquidBackgroundLoad(state, "schedule");
  assert.equal(state, "scheduled");

  state = transitionLiquidBackgroundLoad(state, "beginImport");
  assert.equal(state, "loading");

  // A hidden tab cannot cancel a module import already in flight.
  state = transitionLiquidBackgroundLoad(state, "cancelSchedule");
  assert.equal(state, "loading");

  state = transitionLiquidBackgroundLoad(state, "importSucceeded");
  assert.equal(state, "loaded");

  state = transitionLiquidBackgroundLoad(state, "schedule");
  assert.equal(state, "loaded");
});

test("allows a hidden tab to cancel only work that has not started importing", () => {
  assert.equal(
    transitionLiquidBackgroundLoad("scheduled", "cancelSchedule"),
    "idle"
  );
  assert.equal(
    transitionLiquidBackgroundLoad("loading", "importFailed"),
    "failed"
  );
});
