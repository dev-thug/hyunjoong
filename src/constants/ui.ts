/**
 * 스크롤 관련 상수
 */
// in pixels
export const SCROLL_THRESHOLD_PX = 50;

/**
 * SpotlightText 효과 상수
 */
export const SPOTLIGHT = {
  INNER_RADIUS: 120,
  OUTER_RADIUS: 130,
  OPACITY_TRANSITION: 0.2,
} as const;

/**
 * LiquidBackground WebGL 상수
 */
export const LIQUID_BACKGROUND = {
  TIME_MULTIPLIER: 0.0002,
  MOUSE_LERP: 0.02,
  MOUSE_EFFECT_STRENGTH: 0.3,
} as const;
