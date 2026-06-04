import {
  DEFAULT_REFLEX_BACKGROUND,
  REFRACTION_VALUES,
} from "./retinoscopy-case-metadata.js?v=20260310-194";
import { resolveCustomActiveReflexVisual } from "./retinoscopy-active-reflex-custom.js?v=20260426-3";
import { resolveMediaActiveReflexVisual } from "./retinoscopy-active-reflex-media.js?v=20260430-1";

function isWithMovement(currentRefraction) {
  if (currentRefraction === REFRACTION_VALUES.ZERO) {
    return null;
  }

  return currentRefraction.includes(REFRACTION_VALUES.PLUS);
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

export function buildActiveReflexVisual({
  activeRefraction,
  axisDeltaRad,
  cataractLevel,
  cylinderAxisDeg,
  currentRefraction,
  eyeType,
  flags,
  globalLightOffset = 0,
  lastBlinkAgeSec = Infinity,
  movementSign,
  retStreakOffset,
  retStreakOffsetY = 0,
  sceneRefraction = currentRefraction,
  timeSec,
}) {
  let background = DEFAULT_REFLEX_BACKGROUND;
  let shift = 0;
  let opacity = Math.abs(retStreakOffset) < 1 ? 1 : 0.6;
  let extraTransform = "";
  let blurPx = 0;

  const mediaVisual = resolveMediaActiveReflexVisual({
    axisDeltaRad,
    cataractLevel,
    cylinderAxisDeg,
    flags,
    lastBlinkAgeSec,
    movementSign,
    retStreakOffset,
    retStreakOffsetY,
    timeSec,
  });
  const customVisual = resolveCustomActiveReflexVisual({
    activeRefraction,
    currentRefraction,
    eyeType,
    flags,
    retStreakOffset,
    sceneRefraction,
  });

  if (mediaVisual) {
    if (mediaVisual.background) {
      background = mediaVisual.background;
    }
    shift = mediaVisual.shift;
    opacity = mediaVisual.opacity;
    extraTransform = mediaVisual.extraTransform;
    blurPx = mediaVisual.blurPx;
  } else if (customVisual) {
    background = customVisual.background;
    shift = customVisual.shift;
    opacity = customVisual.opacity;
    extraTransform = customVisual.extraTransform;
    blurPx = customVisual.blurPx;
  } else if (
    currentRefraction === REFRACTION_VALUES.HIGH_PLUS ||
    currentRefraction === REFRACTION_VALUES.HIGH_MINUS
  ) {
    const hotspotY =
      currentRefraction === REFRACTION_VALUES.HIGH_PLUS ? 28 : 72;
    const hotspotX = (
      50 + Math.max(-8, Math.min(8, retStreakOffset * 0.06))
    ).toFixed(1);
    background = `
      radial-gradient(
        ellipse 46% 30% at ${hotspotX}% ${hotspotY}%,
        rgba(255, 255, 255, 1) 0%,
        rgba(255, 255, 255, 0.64) 24%,
        rgba(255, 255, 255, 0.18) 52%,
        rgba(255, 255, 255, 0) 74%
      ),
      radial-gradient(
        ellipse 74% 64% at 50% 50%,
        rgba(255, 255, 255, 0.92) 0%,
        rgba(255, 255, 255, 0.28) 42%,
        rgba(255, 255, 255, 0.06) 70%,
        rgba(255, 255, 255, 0) 84%
      )
    `;
    const shiftBase = retStreakOffset * getReflexScale(activeRefraction);
    const withMovement = isWithMovement(activeRefraction);
    shift =
      withMovement === true
        ? shiftBase
        : withMovement === false
          ? -shiftBase
          : 0;
    blurPx = 0.12;
    opacity = Math.abs(retStreakOffset) < 1 ? 1 : 0.76;
  } else if (flags.cylinderCase) {
    const highCylinder = currentRefraction === REFRACTION_VALUES.HIGH_CYLINDER;
    const movementMagnitude =
      Math.pow(Math.abs(movementSign), 0.9) * (highCylinder ? 0.75 : 0.58);
    shift = retStreakOffset * movementSign * movementMagnitude;

    const axisAlignment = Math.abs(Math.cos(axisDeltaRad));
    const minScaleX = highCylinder ? 0.34 : 0.52;
    const maxScaleX = highCylinder ? 1.45 : 1.24;
    const scaleX = minScaleX + (1 - axisAlignment) * (maxScaleX - minScaleX);
    const scaleY = highCylinder
      ? 1.08 + (1 - axisAlignment) * 0.24
      : 1.04 + (1 - axisAlignment) * 0.14;
    extraTransform = ` scale(${scaleX.toFixed(3)}, ${scaleY.toFixed(3)})`;
    blurPx = (1 - axisAlignment) * (highCylinder ? 1.6 : 1.05);
    opacity =
      Math.abs(retStreakOffset) < 1
        ? 1
        : (highCylinder ? 0.28 : 0.38) +
          axisAlignment * (highCylinder ? 0.62 : 0.46);
  } else {
    const shiftBase = retStreakOffset * getReflexScale(activeRefraction);
    const withMovement = isWithMovement(activeRefraction);
    shift =
      withMovement === true
        ? shiftBase
        : withMovement === false
          ? -shiftBase
          : 0;
  }

  return {
    background,
    blurPx,
    extraTransform,
    opacity,
    shift,
  };
}
