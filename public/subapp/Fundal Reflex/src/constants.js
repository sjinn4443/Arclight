export const DEFAULT_BASE_REFLEX_COLOR = {
  r: Math.round(218 * 0.7),
  g: Math.round(58 * 0.7),
  b: Math.round(0 * 0.7),
};

export const DEFAULT_REFRACTION_VALUE = "zero";

export const DEFAULT_RETINOSCOPY_STATE = {
  retStreakOffset: 0,
  retStreakOffsetY: 0,
  currentRefraction: DEFAULT_REFRACTION_VALUE,
  cylinderAxisDeg: null,
  cataractLevel: 0, // 0 to 100
  nystagmusLevel: 0, // 0 to 100
  nystagmusDirection: "horizontal",
  nystagmusWave: "jerk",
  nystagmusRate: "slow",
};

export {
  BABY_REFRACTION_OPTIONS,
  BABY_REFRACTION_VALUES,
  BABY_REFRACTION_VALUE_SET,
  CASE_LEVELS,
  REFRACTION_GROUPS,
  REFRACTION_OPTIONS,
  TEST_REFRACTION_OPTIONS,
  REFRACTION_VALUE_SET,
} from "./case-catalog.js?v=20260430-6";

export const CYLINDER_REFRACTION_VALUES = new Set([
  "low-cylinder",
  "high-cylinder",
]);

export const AXIS_DEPENDENT_REFRACTION_VALUES = new Set([
  ...CYLINDER_REFRACTION_VALUES,
  "small-scissors",
  "keratoconus",
  "corneal-scar",
]);

export const TEST_COUNTDOWN_SEQUENCE = [20, 15, 10, 8, 6];
