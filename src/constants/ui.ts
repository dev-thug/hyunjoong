/**
 * 스크롤 관련 상수
 */
export const SCROLL_THRESHOLD = 50;

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

/**
 * 애니메이션 딜레이 (초 단위)
 */
export const ANIMATION_DELAYS = {
  NONE: 0,
  SHORT: 0.2,
  MEDIUM: 0.5,
  LONG: 0.8,
  EXTRA_LONG: 1.0,
} as const;
