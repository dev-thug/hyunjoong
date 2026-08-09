export const LIQUID_BACKGROUND_RENDER_SCALE = 0.65;
export const LIQUID_BACKGROUND_TARGET_FPS = 30;

export interface LiquidBackgroundCapabilities {
  readonly prefersReducedMotion: boolean;
  readonly saveData: boolean;
  readonly webglSupported: boolean;
  readonly deviceMemory?: number;
  readonly hardwareConcurrency?: number;
  readonly effectiveConnectionType?: string;
}

export interface CanvasSize {
  readonly width: number;
  readonly height: number;
}

export const shouldEnableLiquidBackground = ({
  prefersReducedMotion,
  saveData,
  webglSupported,
  deviceMemory,
  hardwareConcurrency,
  effectiveConnectionType,
}: LiquidBackgroundCapabilities): boolean => {
  const hasSlowConnection =
    effectiveConnectionType === "slow-2g" || effectiveConnectionType === "2g";

  if (prefersReducedMotion || saveData || hasSlowConnection || !webglSupported) {
    return false;
  }

  if (deviceMemory !== undefined && deviceMemory <= 4) {
    return false;
  }

  if (hardwareConcurrency !== undefined && hardwareConcurrency <= 2) {
    return false;
  }

  return true;
};

export const isSoftwareWebGLRenderer = (renderer: string): boolean =>
  /swiftshader|llvmpipe|software rasterizer|mesa offscreen/i.test(renderer);

export const getLiquidBackgroundCanvasSize = (
  viewportWidth: number,
  viewportHeight: number,
  renderScale = LIQUID_BACKGROUND_RENDER_SCALE
): CanvasSize => {
  const scale = Math.min(1, Math.max(0.25, renderScale));
  const normalizeDimension = (value: number): number =>
    Math.max(1, Math.round(Math.max(0, Number.isFinite(value) ? value : 0) * scale));

  return {
    width: normalizeDimension(viewportWidth),
    height: normalizeDimension(viewportHeight),
  };
};

export const shouldRenderStaticLiquidBackgroundFrame = (
  prefersReducedMotion: boolean,
  isVisible: boolean
): boolean => prefersReducedMotion && isVisible;

export const shouldRenderLiquidBackgroundFrame = (
  timestamp: number,
  previousFrameTimestamp: number | null,
  targetFramesPerSecond = LIQUID_BACKGROUND_TARGET_FPS
): boolean => {
  if (previousFrameTimestamp === null) {
    return true;
  }

  const frameInterval = 1000 / targetFramesPerSecond;
  return timestamp - previousFrameTimestamp >= frameInterval;
};
