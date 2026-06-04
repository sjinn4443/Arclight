import {
  AXIS_DEPENDENT_REFRACTION_VALUES,
  CYLINDER_REFRACTION_VALUES,
  DEFAULT_REFRACTION_VALUE,
} from "./constants.js";

export const REFRACTION_VALUES = {
  ACG: "acg",
  ANIRIDIA: "aniridia",
  APHAKIA: "aphakia",
  ANISOMETROPIA: "anisometropia",
  BIG_CORTICAL_CATARACT: "big-cortical-cataract",
  CENTRAL_SUB_CORTICAL_CATARACT: "central-sub-cortical-cataract",
  CORNEAL_SCAR: "corneal-scar",
  DENSE_CATARACT: "dense-cataract",
  FLOATERS: "floaters",
  HIGH_CYLINDER: "high-cylinder",
  HIGH_MINUS: "high-minus",
  HIGH_PLUS: "high-plus",
  KERATOCONUS: "keratoconus",
  IRIS_TRANSILLUMINATION: "iris-transillumination",
  LEUCOCORIA: "leucocoria",
  MINUS: "minus",
  NASAL_COLOBOMA: "nasal-coloboma",
  PARTIAL_RETINAL_DETACHMENT: "partial-retinal-detachment",
  POSTERIOR_CAPSULAR_THICKENING: "posterior-capsular-thickening",
  POSTERIOR_POLE_CATARACT: "posterior-pole-cataract",
  PLUS: "plus",
  POOR_TEAR_FILM: "poor-tear-film",
  SMALL_CORTICAL_CATARACT: "small-cortical-cataract",
  SMALL_PUPILS: "small-pupils",
  SMALL_SCISSORS: "small-scissors",
  VITREOUS_HAEMORRHAGE: "vitreous-haemorrhage",
  ZERO: DEFAULT_REFRACTION_VALUE,
};

const EDGE_DIMMING_PROFILE = Object.freeze({
  minimumFactor: 0.12,
  fadeDistanceRatio: 1.35,
  softness: 1.15,
});

const EDGE_VISUAL_BLEND = Object.freeze({
  brightnessFloor: 0.4,
  blurBoostPx: 0.5,
  opacityFloor: 0.25,
});

export const DEFAULT_REFLEX_BACKGROUND =
  "radial-gradient(ellipse 72% 62% at 50% 50%, rgba(255, 255, 255, 0.98) 0%, rgba(255, 255, 255, 0.52) 28%, rgba(255, 255, 255, 0.16) 56%, rgba(255, 255, 255, 0.04) 72%, rgba(255, 255, 255, 0) 84%)";

function isWithMovement(currentRefraction) {
  if (currentRefraction === REFRACTION_VALUES.ZERO) {
    return null;
  }

  return currentRefraction.includes(REFRACTION_VALUES.PLUS);
}

function randomIntInRange(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function randomFloatInRange(min, max) {
  return Math.random() * (max - min) + min;
}

function smallestCircularDifference(aDeg, bDeg) {
  const delta = Math.abs(aDeg - bDeg) % 360;
  return delta > 180 ? 360 - delta : delta;
}

function getReflexScale(currentRefraction) {
  switch (currentRefraction) {
    case REFRACTION_VALUES.HIGH_MINUS:
    case REFRACTION_VALUES.HIGH_PLUS:
      return 0.1;
    case REFRACTION_VALUES.MINUS:
    case REFRACTION_VALUES.PLUS:
      return 0.3;
    default:
      return 0.2;
  }
}

function getEdgeDimmingFactor({
  probeOffsetX,
  probeOffsetY,
  pupilRadiusPx,
  profile = EDGE_DIMMING_PROFILE,
}) {
  const centreDistance = Math.hypot(probeOffsetX, probeOffsetY);
  const startDistancePx = pupilRadiusPx;
  const { minimumFactor, fadeDistanceRatio, softness } = profile;

  if (centreDistance <= startDistancePx) {
    return 1;
  }

  const fadeDistancePx = Math.max(1.5, pupilRadiusPx * fadeDistanceRatio);
  const overshootPx = centreDistance - startDistancePx;
  const t = Math.max(0, Math.min(1, overshootPx / fadeDistancePx));
  const smoothT = t * t * (3 - 2 * t);
  const shapedT = Math.pow(smoothT, softness);
  return 1 - shapedT * (1 - Math.max(0, minimumFactor));
}

export function getCaseFlags(currentRefraction) {
  const acgCase = currentRefraction === REFRACTION_VALUES.ACG;
  const aniridiaCase = currentRefraction === REFRACTION_VALUES.ANIRIDIA;
  const aphakiaCase = currentRefraction === REFRACTION_VALUES.APHAKIA;
  const cylinderCase = CYLINDER_REFRACTION_VALUES.has(currentRefraction);
  const scissorsCase = currentRefraction === REFRACTION_VALUES.SMALL_SCISSORS;
  const keratoconusCase = currentRefraction === REFRACTION_VALUES.KERATOCONUS;
  const cornealScarCase = currentRefraction === REFRACTION_VALUES.CORNEAL_SCAR;
  const denseCataractCase =
    currentRefraction === REFRACTION_VALUES.DENSE_CATARACT;
  const floatersCase = currentRefraction === REFRACTION_VALUES.FLOATERS;
  const anisometropiaCase =
    currentRefraction === REFRACTION_VALUES.ANISOMETROPIA;
  const irisTransilluminationCase =
    currentRefraction === REFRACTION_VALUES.IRIS_TRANSILLUMINATION;
  const leucocoriaCase = currentRefraction === REFRACTION_VALUES.LEUCOCORIA;
  const nasalColobomaCase =
    currentRefraction === REFRACTION_VALUES.NASAL_COLOBOMA;
  const partialRetinalDetachmentCase =
    currentRefraction === REFRACTION_VALUES.PARTIAL_RETINAL_DETACHMENT;
  const posteriorCapsularThickeningCase =
    currentRefraction === REFRACTION_VALUES.POSTERIOR_CAPSULAR_THICKENING;
  const poorTearFilmCase =
    currentRefraction === REFRACTION_VALUES.POOR_TEAR_FILM;
  const smallCorticalCataractCase =
    currentRefraction === REFRACTION_VALUES.SMALL_CORTICAL_CATARACT;
  const smallPupilsCase = currentRefraction === REFRACTION_VALUES.SMALL_PUPILS;
  const bigCorticalCataractCase =
    currentRefraction === REFRACTION_VALUES.BIG_CORTICAL_CATARACT;
  const centralSubCorticalCataractCase =
    currentRefraction === REFRACTION_VALUES.CENTRAL_SUB_CORTICAL_CATARACT;
  const posteriorPoleCataractCase =
    currentRefraction === REFRACTION_VALUES.POSTERIOR_POLE_CATARACT;
  const vitreousHaemorrhageCase =
    currentRefraction === REFRACTION_VALUES.VITREOUS_HAEMORRHAGE;

  return {
    acgCase,
    aniridiaCase,
    aphakiaCase,
    anisometropiaCase,
    bigCorticalCataractCase,
    centralSubCorticalCataractCase,
    cornealScarCase,
    corticalCataractCase: smallCorticalCataractCase || bigCorticalCataractCase,
    cylinderCase,
    denseCataractCase,
    floatersCase,
    irisTransilluminationCase,
    keratoconusCase,
    leucocoriaCase,
    nasalColobomaCase,
    partialRetinalDetachmentCase,
    posteriorCapsularThickeningCase,
    posteriorPoleCataractCase,
    poorTearFilmCase,
    scissorsCase,
    smallCorticalCataractCase,
    smallPupilsCase,
    vitreousHaemorrhageCase,
  };
}

export function isAxisDependentCase(currentRefraction) {
  return AXIS_DEPENDENT_REFRACTION_VALUES.has(currentRefraction);
}

export function getActiveRefractionForMode(currentRefraction, activeEye) {
  if (currentRefraction === REFRACTION_VALUES.ANISOMETROPIA) {
    return activeEye === "left"
      ? REFRACTION_VALUES.PLUS
      : REFRACTION_VALUES.MINUS;
  }

  if (currentRefraction === REFRACTION_VALUES.ACG) {
    return REFRACTION_VALUES.ZERO;
  }

  if (currentRefraction === REFRACTION_VALUES.ANIRIDIA) {
    return REFRACTION_VALUES.ZERO;
  }

  if (currentRefraction === REFRACTION_VALUES.IRIS_TRANSILLUMINATION) {
    return REFRACTION_VALUES.ZERO;
  }

  if (currentRefraction === REFRACTION_VALUES.NASAL_COLOBOMA) {
    return REFRACTION_VALUES.ZERO;
  }

  if (currentRefraction === REFRACTION_VALUES.POSTERIOR_CAPSULAR_THICKENING) {
    return REFRACTION_VALUES.ZERO;
  }

  if (currentRefraction === REFRACTION_VALUES.SMALL_PUPILS) {
    return REFRACTION_VALUES.ZERO;
  }

  return currentRefraction;
}

export function normalizeTo180(angleDeg) {
  const normalized = angleDeg % 180;
  return normalized < 0 ? normalized + 180 : normalized;
}

export function smallestAxisDifference(aDeg, bDeg) {
  const delta = Math.abs(aDeg - bDeg) % 180;
  return delta > 90 ? 180 - delta : delta;
}

export function createCorticalCataractPattern(isLarge) {
  const wedgeCount = randomIntInRange(3, 4);
  const minSeparationDeg = isLarge ? 30 : 34;
  const wedgeAngles = [];
  let guard = 0;

  while (wedgeAngles.length < wedgeCount && guard < 500) {
    const candidate = randomIntInRange(0, 359);
    const hasCollision = wedgeAngles.some(
      (existingAngle) =>
        smallestCircularDifference(existingAngle, candidate) < minSeparationDeg,
    );
    if (!hasCollision) {
      wedgeAngles.push(candidate);
    }
    guard += 1;
  }

  while (wedgeAngles.length < wedgeCount) {
    wedgeAngles.push(randomIntInRange(0, 359));
  }

  return {
    wedges: wedgeAngles.map((angleDeg) => ({
      angleDeg,
      opacity: isLarge
        ? randomFloatInRange(0.82, 0.93)
        : randomFloatInRange(0.72, 0.86),
      widthDeg: isLarge
        ? randomFloatInRange(28, 40)
        : randomFloatInRange(20, 30),
    })),
  };
}

function normalizeTo360(angleDeg) {
  const normalized = angleDeg % 360;
  return normalized < 0 ? normalized + 360 : normalized;
}

export function buildCorticalCataractOverlay(pattern) {
  return pattern.wedges
    .map((wedge) => {
      const startDeg = normalizeTo360(wedge.angleDeg - wedge.widthDeg * 0.5);
      const spanDeg = wedge.widthDeg.toFixed(1);
      const opacity = wedge.opacity.toFixed(2);
      return `
      conic-gradient(
        from ${startDeg.toFixed(1)}deg at 50% 50%,
        rgba(0, 0, 0, ${opacity}) 0deg,
        rgba(0, 0, 0, ${opacity}) ${spanDeg}deg,
        rgba(0, 0, 0, 0) ${spanDeg}deg,
        rgba(0, 0, 0, 0) 360deg
      )`;
    })
    .join(",\n");
}

export function randomCylinderAxisDeg() {
  const weightedRanges = [
    { min: 20, max: 70, weight: 4 },
    { min: 110, max: 160, weight: 4 },
    { min: 0, max: 19, weight: 1 },
    { min: 71, max: 109, weight: 1 },
    { min: 161, max: 179, weight: 1 },
  ];

  const totalWeight = weightedRanges.reduce(
    (sum, range) => sum + range.weight,
    0,
  );
  let roll = Math.random() * totalWeight;

  for (const range of weightedRanges) {
    roll -= range.weight;
    if (roll <= 0) {
      return randomIntInRange(range.min, range.max);
    }
  }

  return randomIntInRange(20, 70);
}

export function getCataractVisualState(cataractLevel) {
  const normalized = Math.max(0, Math.min(100, cataractLevel)) / 100;
  return {
    brightnessScale: 1 - normalized * 0.24,
    blurBoostPx: normalized * 0.8,
    opacityScale: 1 - normalized * 0.55,
  };
}

export function getEdgeVisualState({
  probeOffsetX,
  probeOffsetY,
  pupilRadiusPx,
}) {
  const edgeDimmingFactor = getEdgeDimmingFactor({
    probeOffsetX,
    probeOffsetY,
    pupilRadiusPx,
    profile: EDGE_DIMMING_PROFILE,
  });

  return {
    edgeBlurBoostPx: (1 - edgeDimmingFactor) * EDGE_VISUAL_BLEND.blurBoostPx,
    edgeBrightnessScale:
      EDGE_VISUAL_BLEND.brightnessFloor +
      edgeDimmingFactor * (1 - EDGE_VISUAL_BLEND.brightnessFloor),
    edgeOpacityScale:
      EDGE_VISUAL_BLEND.opacityFloor +
      edgeDimmingFactor * (1 - EDGE_VISUAL_BLEND.opacityFloor),
  };
}

export function getMovementStatusHtml({
  activeEye,
  activeRefraction,
  currentRefraction,
  flags,
  movementSign,
}) {
  if (currentRefraction === REFRACTION_VALUES.ZERO) {
    return "Neutral (0)";
  }

  if (flags.anisometropiaCase) {
    const eyeLabel = activeEye === "left" ? "RE" : "LE";
    const withDirection = activeRefraction.includes(REFRACTION_VALUES.PLUS);
    return withDirection
      ? `<em>${eyeLabel}</em> Fast With movement`
      : `<em>${eyeLabel}</em> Fast Against movement`;
  }

  if (flags.aphakiaCase) {
    return "<em>Very slow</em> With movement (aphakia)";
  }

  if (flags.acgCase) {
    return "<em>Vertical</em> Oval pupil (ACG)";
  }

  if (flags.aniridiaCase) {
    return "<em>Large</em> Pupil (aniridia)";
  }

  if (flags.smallPupilsCase) {
    return "<em>Small</em> Pupils";
  }

  if (flags.scissorsCase) {
    return "<em>Small</em> Scissors reflex";
  }

  if (flags.keratoconusCase) {
    return "<em>Irregular</em> Scissors reflex";
  }

  if (flags.cornealScarCase) {
    return "<em>Diffuse</em> Corneal scar reflex";
  }

  if (flags.vitreousHaemorrhageCase) {
    return "<em>Diffuse</em> Vitreous haemorrhage reflex";
  }

  if (flags.floatersCase) {
    return "<em>Mobile</em> Floater shadows";
  }

  if (flags.partialRetinalDetachmentCase) {
    return "<em>Sectoral</em> Dull reflex";
  }

  if (flags.poorTearFilmCase) {
    return "<em>Variable</em> Tear film reflex";
  }

  if (flags.smallCorticalCataractCase) {
    return "<em>Dull</em> Small cortical cataract reflex";
  }

  if (flags.bigCorticalCataractCase) {
    return "<em>Dull</em> Big cortical cataract reflex";
  }

  if (flags.centralSubCorticalCataractCase) {
    return "<em>Dull</em> Posterior subcapsular cataract reflex";
  }

  if (flags.posteriorPoleCataractCase) {
    return "<em>Very dull</em> Posterior pole cataract reflex";
  }

  if (flags.posteriorCapsularThickeningCase) {
    return "<em>Dull</em> Posterior capsular thickening reflex";
  }

  if (flags.denseCataractCase) {
    return "<em>Very dull</em> Dense cataract reflex";
  }

  if (flags.leucocoriaCase) {
    return "<em>White</em> Pupil reflex";
  }

  if (flags.irisTransilluminationCase) {
    return "<em>Normal</em> Iris transillumination";
  }

  if (flags.nasalColobomaCase) {
    return "<em>Normal</em> Nasal coloboma pupil";
  }

  if (flags.cylinderCase) {
    if (Math.abs(movementSign) < 0.08) {
      return "Neutral meridian (astigmatism)";
    }

    const highCylinder = currentRefraction === REFRACTION_VALUES.HIGH_CYLINDER;
    const movementStrength =
      Math.pow(Math.abs(movementSign), 0.9) * (highCylinder ? 0.75 : 0.58);
    const speedWord = movementStrength >= 0.38 ? "Fast" : "Slow";

    return movementSign > 0
      ? `<em>${speedWord}</em> With movement (astigmatism)`
      : `<em>${speedWord}</em> Against movement (astigmatism)`;
  }

  if (activeRefraction === REFRACTION_VALUES.HIGH_PLUS) {
    return "<em>Slow</em> With movement (+)";
  }

  if (activeRefraction === REFRACTION_VALUES.HIGH_MINUS) {
    return "<em>Slow</em> Against movement (-)";
  }

  if (activeRefraction === REFRACTION_VALUES.PLUS) {
    return "<em>Fast</em> With movement (+)";
  }

  if (activeRefraction === REFRACTION_VALUES.MINUS) {
    return "<em>Fast</em> Against movement (-)";
  }

  return "Neutral (0)";
}
