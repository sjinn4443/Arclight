import {
  DEFAULT_REFLEX_BACKGROUND,
  REFRACTION_VALUES,
} from "./retinoscopy-case-metadata.js?v=20260506-2";

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
  flags,
  movementSign,
  retStreakOffset,
  timeSec,
}) {
  let background = DEFAULT_REFLEX_BACKGROUND;
  let shift = 0;
  let opacity = Math.abs(retStreakOffset) < 1 ? 1 : 0.6;
  let extraTransform = "";
  let blurPx = 0;

  if (flags.scissorsCase) {
    const lobeSpread = Math.min(25, 10 + Math.abs(retStreakOffset) * 0.4);
    const skew = Math.max(-16, Math.min(16, retStreakOffset * 0.22));
    const leftX = (50 - lobeSpread + skew).toFixed(1);
    const rightX = (50 + lobeSpread + skew).toFixed(1);
    const upperY = (37 - skew * 0.35).toFixed(1);
    const lowerY = (63 + skew * 0.35).toFixed(1);
    background = `
      radial-gradient(
        ellipse 46% 42% at ${leftX}% ${upperY}%,
        rgba(255, 255, 255, 0.86) 0%,
        rgba(255, 255, 255, 0.3) 34%,
        rgba(255, 255, 255, 0.05) 62%,
        rgba(255, 255, 255, 0) 76%
      ),
      radial-gradient(
        ellipse 46% 42% at ${rightX}% ${lowerY}%,
        rgba(255, 255, 255, 0.86) 0%,
        rgba(255, 255, 255, 0.3) 34%,
        rgba(255, 255, 255, 0.05) 62%,
        rgba(255, 255, 255, 0) 76%
      )
    `;
    shift = retStreakOffset * 0.05;
    extraTransform = " scale(1.06, 1.02)";
    blurPx = 0.62;
    opacity = Math.abs(retStreakOffset) < 1 ? 0.8 : 0.74;
  } else if (flags.keratoconusCase) {
    const coneOscillation = Math.sin(timeSec * 3.2 + axisDeltaRad * 1.35);
    const coneBias = 12 + 3.4 * Math.sin(timeSec * 0.65);
    const apexX = (50 - coneBias).toFixed(1);
    const apexY = (63 + coneOscillation * 4).toFixed(1);
    const tailX = (52 + coneBias * 0.35).toFixed(1);
    const tailY = (39 - coneOscillation * 2.6).toFixed(1);
    background = `
      radial-gradient(
        ellipse 58% 50% at ${apexX}% ${apexY}%,
        rgba(255, 255, 255, 0.98) 0%,
        rgba(255, 255, 255, 0.34) 28%,
        rgba(255, 255, 255, 0.06) 58%,
        rgba(255, 255, 255, 0) 74%
      ),
      radial-gradient(
        ellipse 48% 44% at ${tailX}% ${tailY}%,
        rgba(255, 255, 255, 0.62) 0%,
        rgba(255, 255, 255, 0.22) 34%,
        rgba(255, 255, 255, 0.04) 60%,
        rgba(255, 255, 255, 0) 74%
      ),
      radial-gradient(
        ellipse 28% 24% at 52% 53%,
        rgba(0, 0, 0, 0.72) 0%,
        rgba(0, 0, 0, 0.36) 44%,
        rgba(0, 0, 0, 0) 72%
      )
    `;
    shift =
      retStreakOffset * movementSign * 0.18 +
      Math.sin(timeSec * 5.9 + axisDeltaRad) * 1.3;
    extraTransform = " scale(1.26, 1.14)";
    blurPx = 1.12 + (1 - Math.abs(movementSign)) * 1.22;
    opacity = Math.abs(retStreakOffset) < 1 ? 0.84 : 0.7;
  } else if (flags.aphakiaCase) {
    background = `
      radial-gradient(
        ellipse 40% 48% at 50% 50%,
        rgba(255, 255, 255, 1) 0%,
        rgba(255, 255, 255, 1) 22%,
        rgba(255, 255, 255, 0.88) 42%,
        rgba(255, 255, 255, 0.28) 62%,
        rgba(255, 255, 255, 0) 74%
      ),
      radial-gradient(
        ellipse 96% 82% at 50% 50%,
        rgba(255, 255, 255, 0.82) 0%,
        rgba(255, 255, 255, 0.42) 38%,
        rgba(255, 255, 255, 0.14) 66%,
        rgba(255, 255, 255, 0) 88%
      )
    `;
    shift = retStreakOffset * 0.06;
    extraTransform = " scale(1.02, 1.06)";
    blurPx = 0.08;
    opacity = Math.abs(retStreakOffset) < 1 ? 1 : 0.96;
  } else if (flags.cornealScarCase) {
    const scarAngle = ((cylinderAxisDeg + 22) % 180) * 2;
    background = `
      conic-gradient(
        from ${scarAngle.toFixed(1)}deg at 50% 50%,
        rgba(0, 0, 0, 1) 0deg,
        rgba(0, 0, 0, 0.96) 64deg,
        rgba(0, 0, 0, 0.78) 108deg,
        rgba(0, 0, 0, 0.46) 148deg,
        rgba(18, 18, 18, 0) 360deg
      ),
      radial-gradient(
        ellipse 34% 48% at 50% 50%,
        rgba(0, 0, 0, 0.82) 0%,
        rgba(0, 0, 0, 0.46) 30%,
        rgba(0, 0, 0, 0.16) 56%,
        rgba(0, 0, 0, 0) 74%
      ),
      radial-gradient(
        ellipse at 50% 50%,
        rgba(255, 255, 255, 0.22) 16%,
        rgba(255, 255, 255, 0.06) 42%,
        rgba(255, 255, 255, 0.015) 74%,
        rgba(255, 255, 255, 0) 82%
      )
    `;
    shift = retStreakOffset * 0.12;
    extraTransform = " scale(1.09, 1.05)";
    blurPx = 1.35;
    opacity = Math.abs(retStreakOffset) < 1 ? 0.84 : 0.72;
  } else if (flags.vitreousHaemorrhageCase) {
    background = `
      radial-gradient(
        ellipse 82% 70% at 50% 50%,
        rgba(255, 255, 255, 0.72) 0%,
        rgba(255, 255, 255, 0.2) 34%,
        rgba(255, 255, 255, 0.04) 70%,
        rgba(255, 255, 255, 0) 86%
      )
    `;
    shift = retStreakOffset * 0.08;
    extraTransform = " scale(1.04, 1.02)";
    blurPx = 0.58;
    opacity = Math.abs(retStreakOffset) < 1 ? 0.8 : 0.68;
  } else if (flags.floatersCase) {
    background = `
      radial-gradient(
        ellipse 78% 66% at 50% 50%,
        rgba(255, 255, 255, 0.94) 0%,
        rgba(255, 255, 255, 0.34) 34%,
        rgba(255, 255, 255, 0.04) 68%,
        rgba(255, 255, 255, 0) 84%
      )
    `;
    shift = retStreakOffset * 0.16;
    extraTransform = " scale(1.03, 1.02)";
    blurPx = 0.08;
    opacity = Math.abs(retStreakOffset) < 1 ? 1 : 0.92;
  } else if (flags.partialRetinalDetachmentCase) {
    const rdOffsetAbs = Math.abs(retStreakOffset);
    background = `
      radial-gradient(
        ellipse 74% 60% at 56% 54%,
        rgba(255, 255, 255, 0.92) 0%,
        rgba(255, 255, 255, 0.28) 34%,
        rgba(255, 255, 255, 0.08) 64%,
        rgba(255, 255, 255, 0) 82%
      )
    `;
    shift = 0;
    extraTransform = " scale(1.06, 1.03)";
    blurPx = 0.1;
    if (rdOffsetAbs <= 20) {
      opacity = 0.88;
    } else if (rdOffsetAbs >= 42) {
      opacity = 0.05;
    } else {
      const fadeT = (rdOffsetAbs - 20) / 22;
      const smoothFadeT = fadeT * fadeT * (3 - 2 * fadeT);
      opacity = 0.88 - smoothFadeT * 0.83;
    }
  } else if (flags.poorTearFilmCase) {
    const shimmerX =
      50 +
      Math.sin(timeSec * 2.2) * 6 +
      Math.sin(timeSec * 3.7 + 1.2) * 2.2 +
      Math.sin(timeSec * 0.7 + 0.4) * 1.4;
    const shimmerY =
      50 +
      Math.cos(timeSec * 1.9 + 0.4) * 4 +
      Math.sin(timeSec * 3.1 + 0.9) * 1.3;
    const flickerRaw =
      0.55 +
      0.25 * Math.sin(timeSec * 2.6 + 0.9) +
      0.2 * Math.sin(timeSec * 4.9 + 0.2);
    const flicker = Math.max(0.08, Math.min(0.98, flickerRaw));
    background = `
      radial-gradient(
        ellipse at ${shimmerX.toFixed(1)}% ${shimmerY.toFixed(1)}%,
        rgba(255, 255, 255, 0.98) 14%,
        rgba(255, 255, 255, ${(0.22 + flicker * 0.24).toFixed(2)}) 36%,
        rgba(255, 255, 255, 0.04) 72%,
        rgba(255, 255, 255, 0) 82%
      )
    `;
    shift =
      retStreakOffset * 0.18 +
      Math.sin(timeSec * 3.8 + 0.6) * 1.2 +
      Math.sin(timeSec * 7.1 + 2.1) * 0.55;
    blurPx = 0.45 + flicker * 1.35;
    opacity = 0.34 + flicker * 0.5;
  } else if (flags.corticalCataractCase) {
    shift = retStreakOffset * 0.2;
    blurPx = flags.bigCorticalCataractCase ? 0.65 : 0.4;
    opacity =
      Math.abs(retStreakOffset) < 1
        ? flags.bigCorticalCataractCase
          ? 0.82
          : 0.88
        : flags.bigCorticalCataractCase
          ? 0.7
          : 0.78;
  } else if (flags.centralSubCorticalCataractCase) {
    background = `
      radial-gradient(
        ellipse 74% 68% at 50% 50%,
        rgba(255, 255, 255, 0.52) 0%,
        rgba(255, 255, 255, 0.18) 28%,
        rgba(255, 255, 255, 0.04) 58%,
        rgba(255, 255, 255, 0) 80%
      )
    `;
    shift = retStreakOffset * 0.2;
    blurPx = 0.88 + cataractLevel * 0.005;
    opacity = Math.abs(retStreakOffset) < 1 ? 0.64 : 0.5;
  } else if (flags.posteriorPoleCataractCase) {
    background = `
      radial-gradient(
        ellipse 74% 68% at 50% 50%,
        rgba(255, 255, 255, 0.58) 0%,
        rgba(255, 255, 255, 0.16) 26%,
        rgba(255, 255, 255, 0.04) 54%,
        rgba(255, 255, 255, 0) 76%
      )
    `;
    shift = retStreakOffset * 0.18;
    blurPx = 1;
    opacity = Math.abs(retStreakOffset) < 1 ? 0.54 : 0.44;
  } else if (flags.posteriorCapsularThickeningCase) {
    background = `
      radial-gradient(
        ellipse 104% 86% at 50% 50%,
        rgba(255, 255, 255, 0.56) 0%,
        rgba(255, 255, 255, 0.24) 34%,
        rgba(255, 255, 255, 0.08) 62%,
        rgba(255, 255, 255, 0) 78%
      ),
      linear-gradient(
        23deg,
        rgba(255, 255, 255, 0) 0%,
        rgba(255, 255, 255, 0) 36%,
        rgba(255, 255, 255, 0.34) 40%,
        rgba(255, 255, 255, 0.5) 42%,
        rgba(255, 255, 255, 0.14) 47%,
        rgba(255, 255, 255, 0) 54%
      ),
      linear-gradient(
        -18deg,
        rgba(255, 255, 255, 0) 0%,
        rgba(255, 255, 255, 0) 42%,
        rgba(255, 255, 255, 0.3) 46%,
        rgba(255, 255, 255, 0.46) 48%,
        rgba(255, 255, 255, 0.13) 53%,
        rgba(255, 255, 255, 0) 60%
      ),
      radial-gradient(
        ellipse 18% 14% at 34% 35%,
        rgba(255, 255, 255, 0.52) 0%,
        rgba(255, 255, 255, 0.22) 42%,
        rgba(255, 255, 255, 0) 68%
      ),
      radial-gradient(
        ellipse 16% 13% at 64% 60%,
        rgba(255, 255, 255, 0.48) 0%,
        rgba(255, 255, 255, 0.2) 40%,
        rgba(255, 255, 255, 0) 68%
      )
    `;
    shift = retStreakOffset * 0.08;
    blurPx = 0.24;
    opacity = Math.abs(retStreakOffset) < 1 ? 0.82 : 0.7;
  } else if (flags.denseCataractCase) {
    background = `
      radial-gradient(
        ellipse 96% 88% at 50% 50%,
        rgba(0, 0, 0, 0.96) 0%,
        rgba(0, 0, 0, 0.84) 46%,
        rgba(0, 0, 0, 0.48) 74%,
        rgba(0, 0, 0, 0) 92%
      ),
      radial-gradient(
        ellipse 38% 32% at 34% 38%,
        rgba(0, 0, 0, 0.98) 0%,
        rgba(0, 0, 0, 0.98) 28%,
        rgba(0, 0, 0, 0.88) 38%,
        rgba(0, 0, 0, 0.28) 56%,
        rgba(0, 0, 0, 0) 66%
      ),
      radial-gradient(
        ellipse 34% 28% at 64% 32%,
        rgba(0, 0, 0, 0.98) 0%,
        rgba(0, 0, 0, 0.98) 24%,
        rgba(0, 0, 0, 0.82) 34%,
        rgba(0, 0, 0, 0.24) 52%,
        rgba(0, 0, 0, 0) 64%
      ),
      radial-gradient(
        ellipse 40% 34% at 60% 66%,
        rgba(0, 0, 0, 0.96) 0%,
        rgba(0, 0, 0, 0.96) 26%,
        rgba(0, 0, 0, 0.78) 38%,
        rgba(0, 0, 0, 0.18) 56%,
        rgba(0, 0, 0, 0) 68%
      ),
      radial-gradient(
        ellipse 28% 22% at 44% 58%,
        rgba(0, 0, 0, 0.92) 0%,
        rgba(0, 0, 0, 0.92) 28%,
        rgba(0, 0, 0, 0.68) 40%,
        rgba(0, 0, 0, 0.14) 56%,
        rgba(0, 0, 0, 0) 66%
      ),
      radial-gradient(
        ellipse 24% 18% at 72% 54%,
        rgba(0, 0, 0, 0.88) 0%,
        rgba(0, 0, 0, 0.88) 24%,
        rgba(0, 0, 0, 0.56) 36%,
        rgba(0, 0, 0, 0.12) 50%,
        rgba(0, 0, 0, 0) 60%
      ),
      radial-gradient(
        ellipse 72% 68% at 50% 50%,
        rgba(255, 255, 255, 0.03) 0%,
        rgba(255, 255, 255, 0.01) 34%,
        rgba(255, 255, 255, 0.003) 56%,
        rgba(0, 0, 0, 0) 72%
      )
    `;
    shift = retStreakOffset * 0.08;
    extraTransform = " scale(1.02, 1.02)";
    blurPx = 1.16;
    opacity = 0.82;
  } else if (flags.leucocoriaCase) {
    background = `
      radial-gradient(
        ellipse 58% 52% at 51% 50%,
        rgba(255, 251, 238, 0.98) 0%,
        rgba(255, 246, 224, 0.9) 30%,
        rgba(255, 236, 206, 0.54) 58%,
        rgba(255, 232, 202, 0.18) 82%,
        rgba(255, 245, 228, 0) 92%
      ),
      radial-gradient(
        ellipse 88% 78% at 50% 50%,
        rgba(248, 240, 220, 0.8) 0%,
        rgba(240, 228, 202, 0.42) 42%,
        rgba(224, 208, 182, 0.14) 72%,
        rgba(255, 245, 228, 0) 90%
      )
    `;
    shift = retStreakOffset * 0.03;
    extraTransform = " scale(1.1, 1.08)";
    blurPx = 0.12;
    opacity = Math.abs(retStreakOffset) < 1 ? 0.9 : 0.74;
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
