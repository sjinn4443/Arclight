import {
  buildCorticalCataractOverlay,
  createCorticalCataractPattern,
} from "./retinoscopy-cortical-utils.js?v=20260308-133";
import { buildPathologyOverlayVisual } from "./retinoscopy-pathology-overlays.js?v=20260428-5";
import { REFRACTION_VALUES } from "./retinoscopy-refraction-values.js?v=20260310-194";
import { getFellowEyeFocusBalance } from "./retinoscopy-beam-geometry.js?v=20260308-133";

const CORNEAL_LIGHT_SHIFT_FACTOR = 0.02;
const CORNEAL_LIGHT_SHIFT_X_LIMIT_PX = 0.8;
const CORNEAL_LIGHT_SHIFT_Y_LIMIT_PX = 0.6;

function clamp(value, min, max) {
  return Math.max(min, Math.min(max, value));
}

export function createEmptyCorticalPatternState() {
  return {
    left: null,
    right: null,
  };
}

export function createCorticalPatternStateForRefraction(value) {
  if (value === REFRACTION_VALUES.BIG_CORTICAL_CATARACT) {
    return {
      left: createCorticalCataractPattern(true),
      right: createCorticalCataractPattern(true),
    };
  }

  if (value === REFRACTION_VALUES.SMALL_CORTICAL_CATARACT) {
    return {
      left: createCorticalCataractPattern(false),
      right: createCorticalCataractPattern(false),
    };
  }

  if (value === REFRACTION_VALUES.RIGHT_BIG_CORTICAL_LEFT_SMALL_CORTICAL) {
    return {
      left: createCorticalCataractPattern(true),
      right: createCorticalCataractPattern(false),
    };
  }

  return null;
}

export function updateCornealReflexState({
  beamCentre,
  eye,
  eyeType,
  leftEye,
  lightOffsetX = 0,
  lightOffsetY = 0,
  pupilRadiusPx,
  rightEye,
  sweepX,
  sweepY,
  wrapperRect,
}) {
  if (!eye) {
    return;
  }

  const { currentDistancePx, fellowDistancePx } = getFellowEyeFocusBalance({
    beamCentre,
    eyeType,
    leftEye,
    pupilRadiusPx,
    rightEye,
    sweepX,
    sweepY,
    wrapperRect,
  });
  const responseRadiusPx = Math.max(72, pupilRadiusPx * 4.8);
  const directionalGapPx = fellowDistancePx - currentDistancePx;
  const rawT = Math.max(
    0,
    Math.min(1, Math.abs(directionalGapPx) / responseRadiusPx),
  );
  const smoothT = rawT * rawT * (3 - 2 * rawT);
  const cornealReflexScale =
    directionalGapPx > 0 ? 1 + smoothT * 0.2 : 1 - smoothT * 0.14;

  eye.style.setProperty(
    "--corneal-reflex-scale",
    cornealReflexScale.toFixed(3),
  );
  eye.style.setProperty(
    "--corneal-reflex-light-x",
    `${clamp(
      lightOffsetX * CORNEAL_LIGHT_SHIFT_FACTOR,
      -CORNEAL_LIGHT_SHIFT_X_LIMIT_PX,
      CORNEAL_LIGHT_SHIFT_X_LIMIT_PX,
    ).toFixed(2)}px`,
  );
  eye.style.setProperty(
    "--corneal-reflex-light-y",
    `${clamp(
      lightOffsetY * CORNEAL_LIGHT_SHIFT_FACTOR,
      -CORNEAL_LIGHT_SHIFT_Y_LIMIT_PX,
      CORNEAL_LIGHT_SHIFT_Y_LIMIT_PX,
    ).toFixed(2)}px`,
  );
}

export function updateCorticalCataractMask({
  maskElement,
  isActiveEye,
  flags,
  eyeType,
  corticalCataractPattern,
}) {
  if (!maskElement) {
    return corticalCataractPattern;
  }

  const shouldShowMask = flags.corticalCataractCase && isActiveEye;
  if (!shouldShowMask) {
    maskElement.style.opacity = "0";
    maskElement.style.background = "none";
    maskElement.style.maskImage = "none";
    maskElement.style.webkitMaskImage = "none";
    maskElement.style.transform = "none";
    return corticalCataractPattern;
  }

  const isLargePattern = flags.bigCorticalCataractCase;
  const patternState =
    corticalCataractPattern && typeof corticalCataractPattern === "object"
      ? corticalCataractPattern
      : createEmptyCorticalPatternState();
  const patternKey = eyeType === "right" ? "right" : "left";
  const pattern =
    patternState[patternKey] || createCorticalCataractPattern(isLargePattern);
  patternState[patternKey] = pattern;

  maskElement.style.background = buildCorticalCataractOverlay(pattern);
  const maskImage = isLargePattern
    ? `radial-gradient(
        circle at 50% 50%,
        rgba(0, 0, 0, 0) 0%,
        rgba(0, 0, 0, 0) 18%,
        rgba(0, 0, 0, 0.36) 42%,
        rgba(0, 0, 0, 0.92) 74%,
        rgba(0, 0, 0, 1) 100%
      )`
    : `radial-gradient(
        circle at 50% 50%,
        rgba(0, 0, 0, 0) 0%,
        rgba(0, 0, 0, 0) 18%,
        rgba(0, 0, 0, 0.34) 46%,
        rgba(0, 0, 0, 0.92) 74%,
        rgba(0, 0, 0, 1) 100%
      )`;

  maskElement.style.maskImage = maskImage;
  maskElement.style.webkitMaskImage = maskImage;
  maskElement.style.filter = isLargePattern ? "blur(0.36px)" : "blur(0.24px)";
  maskElement.style.transform = "none";
  maskElement.style.opacity = isLargePattern ? "0.94" : "0.9";

  return patternState;
}

function clearPathologyOverlay(overlayElement) {
  if (!overlayElement) {
    return;
  }

  overlayElement.style.opacity = "0";
  overlayElement.style.background = "none";
  overlayElement.style.transform = "none";
  overlayElement.style.filter = "none";
}

function getPathologyIlluminationFactor({
  flags,
  pupilRadiusPx,
  sweepX,
  sweepY,
}) {
  if (flags.partialRetinalDetachmentCase) {
    return 1;
  }

  if (flags.iridocyclitisKpsCase) {
    return 1;
  }

  if (flags.leucocoriaCase) {
    const distancePx = Math.hypot(sweepX, sweepY);
    const fadeStartPx = pupilRadiusPx * 0.55;
    const fadeEndPx = pupilRadiusPx * 2.8;
    const fadeRangePx = Math.max(1, fadeEndPx - fadeStartPx);
    const rawT = Math.max(
      0,
      Math.min(1, (distancePx - fadeStartPx) / fadeRangePx),
    );
    const smoothT = rawT * rawT * (3 - 2 * rawT);
    const shapedT = Math.pow(smoothT, 1.45);
    return 0.8 + (1 - shapedT) * 0.16;
  }

  if (!flags.floatersCase && !flags.vitreousHaemorrhageCase) {
    return 0;
  }

  const distancePx = Math.hypot(sweepX, sweepY);
  const fadeStartPx =
    pupilRadiusPx * (flags.vitreousHaemorrhageCase ? 0.74 : 0.84);
  const fadeEndPx = pupilRadiusPx * (flags.vitreousHaemorrhageCase ? 6.1 : 6.4);
  const fadeRangePx = Math.max(1, fadeEndPx - fadeStartPx);
  const rawT = Math.max(
    0,
    Math.min(1, (distancePx - fadeStartPx) / fadeRangePx),
  );
  const smoothT = rawT * rawT * (3 - 2 * rawT);
  const shapedT = Math.pow(
    smoothT,
    flags.vitreousHaemorrhageCase ? 1.35 : 1.55,
  );
  const minimumVisibility = flags.vitreousHaemorrhageCase ? 0.26 : 0.18;
  return minimumVisibility + (1 - shapedT) * (1 - minimumVisibility);
}

export function updatePathologyOverlay({
  flags,
  isActiveEye,
  overlayElement,
  pupilRadiusPx,
  sweepX,
  sweepY,
  timeSec,
}) {
  if (!overlayElement || !isActiveEye) {
    clearPathologyOverlay(overlayElement);
    return;
  }

  const overlayVisual = buildPathologyOverlayVisual({
    flags,
    sweepX,
    sweepY,
    timeSec,
  });
  if (overlayVisual.opacity <= 0 || overlayVisual.background === "none") {
    clearPathologyOverlay(overlayElement);
    return;
  }

  const illuminationFactor = getPathologyIlluminationFactor({
    flags,
    pupilRadiusPx,
    sweepX,
    sweepY,
  });
  if (illuminationFactor <= 0.01) {
    clearPathologyOverlay(overlayElement);
    return;
  }

  overlayElement.style.background = overlayVisual.background;
  overlayElement.style.transform = overlayVisual.transform || "none";
  overlayElement.style.filter =
    overlayVisual.blurPx > 0.01
      ? `blur(${overlayVisual.blurPx.toFixed(2)}px)`
      : "none";
  overlayElement.style.opacity = Math.min(
    1,
    overlayVisual.opacity * illuminationFactor,
  ).toFixed(3);
}
