export const DEFAULT_READING_ADD_BANDS = [
  { min: 40, max: 43, add: 0.75 },
  { min: 44, max: 47, add: 1.25 },
  { min: 48, max: 51, add: 1.25 },
  { min: 52, max: 55, add: 1.5 },
  { min: 56, max: 59, add: 1.75 },
  { min: 60, max: 63, add: 2.25 },
  { min: 64, max: 68, add: 2.25 },
  { min: 69, max: 77, add: 2.5 },
  { min: 78, max: Number.POSITIVE_INFINITY, add: 2.75 },
];

export const DEFAULT_PRESCRIPTION_CONFIG = {
  confidence: {
    currentBase: 1,
    currentPrecise: 2,
    currentVaGood: 0.75,
    objectiveBase: 1,
    objectiveAccurate: 1.5,
    objectiveNoCurrent: 2.5,
  },
  sphere: {
    objectiveBias: 0.25,
    pullOffset: 1,
    pullScale: 4,
    quarterPull: 0.2,
    maxStep: 0.25,
  },
  cylinder: {
    objectiveReduction: 0.25,
    pullOffset: 1,
    pullScale: 2.6,
    quarterPull: 0.2,
    maxStep: 0.75,
    dropMagnitude: 0.25,
    introduceMagnitude: 0.25,
    tokenCurrentDrop: 0.25,
    corroboratedKeepGap: 8,
    corroboratedBlendGap: 20,
    lowCylHoldGap: 10,
  },
  axis: {
    lowCylRounding: 5,
    highCylCutoff: 1.75,
    pullOffset: 0,
    pullScale: 3,
    compromisePull: 0.3,
    objectiveFollowRatio: 0.5,
    nonPreciseFollowGap: 15,
  },
  add: {
    bands: DEFAULT_READING_ADD_BANDS,
    healthBoost: 0.25,
    ageGate: 46,
  },
};

export function resolvePrescriptionConfig(overrides = {}) {
  return {
    confidence: {
      ...DEFAULT_PRESCRIPTION_CONFIG.confidence,
      ...overrides.confidence,
    },
    sphere: {
      ...DEFAULT_PRESCRIPTION_CONFIG.sphere,
      ...overrides.sphere,
    },
    cylinder: {
      ...DEFAULT_PRESCRIPTION_CONFIG.cylinder,
      ...overrides.cylinder,
    },
    axis: {
      ...DEFAULT_PRESCRIPTION_CONFIG.axis,
      ...overrides.axis,
    },
    add: {
      ...DEFAULT_PRESCRIPTION_CONFIG.add,
      ...overrides.add,
      bands: overrides.add?.bands ?? DEFAULT_PRESCRIPTION_CONFIG.add.bands,
    },
  };
}
