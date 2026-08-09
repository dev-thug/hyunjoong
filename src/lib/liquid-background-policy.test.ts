import assert from "node:assert/strict";
import test from "node:test";
import {
  LIQUID_BACKGROUND_INITIAL_DELAY_MS,
  getLiquidBackgroundCanvasSize,
  isSoftwareWebGLRenderer,
  shouldEnableLiquidBackground,
  shouldRenderLiquidBackgroundFrame,
  shouldRenderStaticLiquidBackgroundFrame,
} from "./liquid-background-policy";

test("keeps optional WebGL outside the initial interactive window", () => {
  assert.ok(LIQUID_BACKGROUND_INITIAL_DELAY_MS >= 6000);
});

test("uses the static background for reduced motion, Save-Data, unsupported WebGL, low-capability devices, and slow connections", () => {
  const capableDevice = {
    prefersReducedMotion: false,
    saveData: false,
    webglSupported: true,
    deviceMemory: 8,
    hardwareConcurrency: 8,
  };
  const twoGDevice = { ...capableDevice, effectiveConnectionType: "2g" };
  const slowTwoGDevice = {
    ...capableDevice,
    effectiveConnectionType: "slow-2g",
  };

  assert.equal(
    shouldEnableLiquidBackground({ ...capableDevice, prefersReducedMotion: true }),
    false
  );
  assert.equal(
    shouldEnableLiquidBackground({ ...capableDevice, saveData: true }),
    false
  );
  assert.equal(
    shouldEnableLiquidBackground({ ...capableDevice, webglSupported: false }),
    false
  );
  assert.equal(
    shouldEnableLiquidBackground({ ...capableDevice, deviceMemory: 4 }),
    false
  );
  assert.equal(
    shouldEnableLiquidBackground({ ...capableDevice, hardwareConcurrency: 2 }),
    false
  );
  assert.equal(shouldEnableLiquidBackground(twoGDevice), false);
  assert.equal(shouldEnableLiquidBackground(slowTwoGDevice), false);
});

test("enables the enhancement for a capable device and accepts unavailable optional device hints", () => {
  assert.equal(
    shouldEnableLiquidBackground({
      prefersReducedMotion: false,
      saveData: false,
      webglSupported: true,
      deviceMemory: 8,
      hardwareConcurrency: 8,
    }),
    true
  );
  assert.equal(
    shouldEnableLiquidBackground({
      prefersReducedMotion: false,
      saveData: false,
      webglSupported: true,
      deviceMemory: 8,
      hardwareConcurrency: 4,
    }),
    true
  );
  assert.equal(
    shouldEnableLiquidBackground({
      prefersReducedMotion: false,
      saveData: false,
      webglSupported: true,
    }),
    true
  );
});

test("treats known software WebGL renderers as fallback-only", () => {
  assert.equal(
    isSoftwareWebGLRenderer("ANGLE (Google, Vulkan 1.3.0 (SwiftShader Device))"),
    true
  );
  assert.equal(isSoftwareWebGLRenderer("llvmpipe (LLVM 18.1.0)"), true);
  assert.equal(isSoftwareWebGLRenderer("NVIDIA GeForce RTX 4090/PCIe/SSE2"), false);
});

test("scales the WebGL drawing buffer down while preserving nonzero dimensions", () => {
  assert.deepEqual(getLiquidBackgroundCanvasSize(1920, 1080), {
    width: 1248,
    height: 702,
  });
  assert.deepEqual(getLiquidBackgroundCanvasSize(1, 1), {
    width: 1,
    height: 1,
  });
});

test("redraws a static frame only for visible reduced-motion rendering", () => {
  assert.equal(shouldRenderStaticLiquidBackgroundFrame(true, true), true);
  assert.equal(shouldRenderStaticLiquidBackgroundFrame(true, false), false);
  assert.equal(shouldRenderStaticLiquidBackgroundFrame(false, true), false);
});

test("limits animation draws to the configured frame budget", () => {
  assert.equal(shouldRenderLiquidBackgroundFrame(0, null), true);
  assert.equal(shouldRenderLiquidBackgroundFrame(20, 0), false);
  assert.equal(shouldRenderLiquidBackgroundFrame(34, 0), true);
});
