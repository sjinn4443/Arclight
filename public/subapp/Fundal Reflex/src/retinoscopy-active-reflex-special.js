import { REFRACTION_VALUES } from "./retinoscopy-case-metadata.js?v=20260310-194";
import { getBeamLightState } from "./retinoscopy-active-reflex-common.js?v=20260308-135";

export function resolveSpecialCustomActiveReflexVisual({
  currentRefraction,
  eyeType,
  retStreakOffset,
  sceneRefraction,
}) {
  if (
    sceneRefraction === REFRACTION_VALUES.BILATERAL_MYOPIA ||
    (sceneRefraction === REFRACTION_VALUES.RIGHT_HYPER_LEFT_MYOPIA &&
      eyeType === "right")
  ) {
    const hyperLayerBrightnessBoost = 1.32;
    const { focusedBeamBoost, localIlluminationFactor } = getBeamLightState({
      centredBase: 0.42,
      centredPower: 0.74,
      centredScale: 0.58,
      focusedRange: 52,
      retStreakOffset,
    });
    const warmCapAlpha = (
      (0.1 + localIlluminationFactor * 0.4) *
      hyperLayerBrightnessBoost
    ).toFixed(2);
    const warmCapMidAlpha = (
      (0.08 + localIlluminationFactor * 0.32) *
      hyperLayerBrightnessBoost
    ).toFixed(2);
    const warmCapTailAlpha = (
      (0.05 + localIlluminationFactor * 0.18) *
      hyperLayerBrightnessBoost
    ).toFixed(2);
    const bridgeGlowPeakAlpha = (
      (0.06 + localIlluminationFactor * 0.17 + focusedBeamBoost * 0.03) *
      hyperLayerBrightnessBoost
    ).toFixed(2);
    const bridgeGlowMidAlpha = (
      (0.03 + localIlluminationFactor * 0.09 + focusedBeamBoost * 0.02) *
      hyperLayerBrightnessBoost
    ).toFixed(2);
    const crescentCutoutPeakAlpha = (
      (0.1 + localIlluminationFactor * 0.14 + focusedBeamBoost * 0.03) *
      hyperLayerBrightnessBoost
    ).toFixed(2);
    const crescentCutoutMidAlpha = (
      (0.04 + localIlluminationFactor * 0.07 + focusedBeamBoost * 0.03) *
      hyperLayerBrightnessBoost
    ).toFixed(2);
    const crescentAlpha = (
      (0.14 + localIlluminationFactor * 0.38) *
      hyperLayerBrightnessBoost
    ).toFixed(2);
    const crescentMidAlpha = (
      (0.07 + localIlluminationFactor * 0.24) *
      hyperLayerBrightnessBoost
    ).toFixed(2);
    const baseGlowPeakAlpha = (
      (0.08 + localIlluminationFactor * 0.2 + focusedBeamBoost * 0.06) *
      hyperLayerBrightnessBoost
    ).toFixed(2);
    const baseGlowMidAlpha = (
      (0.04 + localIlluminationFactor * 0.1 + focusedBeamBoost * 0.04) *
      hyperLayerBrightnessBoost
    ).toFixed(2);

    return {
      background: `
      radial-gradient(
        ellipse 52% 28% at 50% 80%,
        rgba(255, 226, 98, ${warmCapAlpha}) 0%,
        rgba(255, 218, 76, ${warmCapMidAlpha}) 30%,
        rgba(255, 208, 56, ${warmCapTailAlpha}) 56%,
        rgba(255, 198, 42, 0) 70%
      ),
      radial-gradient(
        ellipse 56% 18% at 50% 66%,
        rgba(255, 236, 168, ${bridgeGlowPeakAlpha}) 0%,
        rgba(255, 246, 224, ${bridgeGlowMidAlpha}) 42%,
        rgba(255, 252, 242, 0) 72%
      ),
      radial-gradient(
        ellipse 50% 17% at 50% 63%,
        rgba(255, 240, 210, ${crescentCutoutPeakAlpha}) 0%,
        rgba(255, 246, 228, ${crescentCutoutMidAlpha}) 52%,
        rgba(255, 252, 242, 0) 84%
      ),
      radial-gradient(
        ellipse 98% 48% at 50% 76%,
        rgba(247, 248, 252, ${crescentAlpha}) 0%,
        rgba(247, 248, 252, ${crescentMidAlpha}) 44%,
        rgba(247, 248, 252, 0) 82%
      ),
      radial-gradient(
        ellipse 76% 70% at 50% 50%,
        rgba(255, 255, 255, ${baseGlowPeakAlpha}) 0%,
        rgba(255, 255, 255, ${baseGlowMidAlpha}) 46%,
        rgba(255, 255, 255, 0) 80%
      )
    `,
      blurPx: 0.08,
      extraTransform: "",
      opacity: Math.min(
        1,
        0.68 + localIlluminationFactor * 0.26 + focusedBeamBoost * 0.08,
      ),
      shift: 0,
    };
  }

  if (
    sceneRefraction === REFRACTION_VALUES.RIGHT_NORMAL_LEFT_SUBLUXATED_LENS &&
    eyeType === "right" &&
    currentRefraction === REFRACTION_VALUES.ZERO
  ) {
    const subluxatedLayerBrightnessBoost = 1.72;
    const { focusedBeamBoost, localIlluminationFactor } = getBeamLightState({
      centredBase: 0.4,
      centredPower: 0.75,
      centredScale: 0.6,
      focusedRange: 48,
      retStreakOffset,
    });
    const warmCapAlpha = (
      (0.06 + localIlluminationFactor * 0.28) *
      subluxatedLayerBrightnessBoost
    ).toFixed(2);
    const warmCapMidAlpha = (
      (0.04 + localIlluminationFactor * 0.18) *
      subluxatedLayerBrightnessBoost
    ).toFixed(2);
    const warmCapTailAlpha = (
      (0.02 + localIlluminationFactor * 0.1) *
      subluxatedLayerBrightnessBoost
    ).toFixed(2);
    const borderPeakAlpha = (
      (0.28 + localIlluminationFactor * 0.4 + focusedBeamBoost * 0.1) *
      subluxatedLayerBrightnessBoost
    ).toFixed(2);
    const borderMidAlpha = (
      (0.14 + localIlluminationFactor * 0.24 + focusedBeamBoost * 0.06) *
      subluxatedLayerBrightnessBoost
    ).toFixed(2);
    const upperBorderPeakAlpha = (
      (0.24 + localIlluminationFactor * 0.34 + focusedBeamBoost * 0.08) *
      subluxatedLayerBrightnessBoost
    ).toFixed(2);
    const upperBorderMidAlpha = (
      (0.12 + localIlluminationFactor * 0.18 + focusedBeamBoost * 0.05) *
      subluxatedLayerBrightnessBoost
    ).toFixed(2);
    const bridgeGlowPeakAlpha = (
      (0.03 + localIlluminationFactor * 0.08 + focusedBeamBoost * 0.03) *
      subluxatedLayerBrightnessBoost
    ).toFixed(2);
    const bridgeGlowMidAlpha = (
      (0.01 + localIlluminationFactor * 0.04 + focusedBeamBoost * 0.02) *
      subluxatedLayerBrightnessBoost
    ).toFixed(2);
    const crescentAlpha = (
      (0.18 + localIlluminationFactor * 0.44) *
      subluxatedLayerBrightnessBoost
    ).toFixed(2);
    const crescentMidAlpha = (
      (0.08 + localIlluminationFactor * 0.22) *
      subluxatedLayerBrightnessBoost
    ).toFixed(2);
    const crescentCutoutPeakAlpha = (
      (0.18 + localIlluminationFactor * 0.18 + focusedBeamBoost * 0.04) *
      subluxatedLayerBrightnessBoost
    ).toFixed(2);
    const crescentCutoutMidAlpha = (
      (0.08 + localIlluminationFactor * 0.1 + focusedBeamBoost * 0.03) *
      subluxatedLayerBrightnessBoost
    ).toFixed(2);
    const baseGlowPeakAlpha = (
      (0.06 + localIlluminationFactor * 0.14 + focusedBeamBoost * 0.06) *
      subluxatedLayerBrightnessBoost
    ).toFixed(2);
    const baseGlowMidAlpha = (
      (0.02 + localIlluminationFactor * 0.06 + focusedBeamBoost * 0.03) *
      subluxatedLayerBrightnessBoost
    ).toFixed(2);

    return {
      background: `
      radial-gradient(
        ellipse 94% 88% at 50% 50%,
        rgba(255, 255, 255, 0) 50%,
        rgba(255, 255, 255, ${borderPeakAlpha}) 58%,
        rgba(255, 255, 255, ${borderPeakAlpha}) 61%,
        rgba(255, 255, 255, ${borderMidAlpha}) 70%,
        rgba(255, 255, 255, 0) 82%
      ),
      radial-gradient(
        ellipse 86% 52% at 50% 85%,
        rgba(255, 255, 255, 0) 38%,
        rgba(255, 255, 255, ${upperBorderPeakAlpha}) 49%,
        rgba(255, 255, 255, ${upperBorderPeakAlpha}) 53%,
        rgba(255, 255, 255, ${upperBorderMidAlpha}) 63%,
        rgba(255, 255, 255, 0) 76%
      ),
      linear-gradient(
        84deg,
        rgba(255, 255, 255, 0) 0%,
        rgba(255, 255, 255, 0) 45%,
        rgba(255, 248, 220, ${borderPeakAlpha}) 48%,
        rgba(255, 255, 255, ${borderPeakAlpha}) 49.5%,
        rgba(255, 255, 255, ${borderMidAlpha}) 51.5%,
        rgba(255, 255, 255, 0) 55%,
        rgba(255, 255, 255, 0) 100%
      ),
      radial-gradient(
        ellipse 46% 24% at 50% 80%,
        rgba(255, 226, 98, ${warmCapAlpha}) 0%,
        rgba(255, 218, 76, ${warmCapMidAlpha}) 30%,
        rgba(255, 208, 56, ${warmCapTailAlpha}) 54%,
        rgba(255, 198, 42, 0) 70%
      ),
      radial-gradient(
        ellipse 52% 16% at 50% 56%,
        rgba(255, 236, 168, ${bridgeGlowPeakAlpha}) 0%,
        rgba(255, 246, 224, ${bridgeGlowMidAlpha}) 42%,
        rgba(255, 252, 242, 0) 72%
      ),
      radial-gradient(
        ellipse 72% 32% at 50% 70%,
        rgba(247, 248, 252, ${crescentAlpha}) 0%,
        rgba(247, 248, 252, ${crescentMidAlpha}) 40%,
        rgba(247, 248, 252, 0) 74%
      ),
      radial-gradient(
        ellipse 54% 20% at 50% 86%,
        rgba(255, 240, 210, ${crescentCutoutPeakAlpha}) 0%,
        rgba(255, 246, 228, ${crescentCutoutMidAlpha}) 52%,
        rgba(255, 252, 242, 0) 82%
      ),
      radial-gradient(
        ellipse 74% 68% at 50% 49%,
        rgba(255, 255, 255, ${baseGlowPeakAlpha}) 0%,
        rgba(255, 255, 255, ${baseGlowMidAlpha}) 46%,
        rgba(255, 255, 255, 0) 80%
      )
    `,
      blurPx: 0,
      extraTransform: "",
      opacity: Math.min(
        1,
        0.74 + localIlluminationFactor * 0.26 + focusedBeamBoost * 0.08,
      ),
      shift: 0,
    };
  }

  if (
    sceneRefraction === REFRACTION_VALUES.RIGHT_NORMAL_LEFT_CORNEAL_OPACITY &&
    eyeType === "right" &&
    currentRefraction === REFRACTION_VALUES.ZERO
  ) {
    const { focusedBeamBoost, localIlluminationFactor } = getBeamLightState({
      centredBase: 0.46,
      centredPower: 0.72,
      centredScale: 0.54,
      focusedRange: 58,
      retStreakOffset,
    });
    const outerGreyAlpha = (0.18 + localIlluminationFactor * 0.34).toFixed(2);
    const midGreyAlpha = (
      0.12 +
      localIlluminationFactor * 0.24 +
      focusedBeamBoost * 0.04
    ).toFixed(2);
    const innerGreyAlpha = (
      0.18 +
      localIlluminationFactor * 0.28 +
      focusedBeamBoost * 0.05
    ).toFixed(2);
    const softWhiteAlpha = (
      0.06 +
      localIlluminationFactor * 0.16 +
      focusedBeamBoost * 0.04
    ).toFixed(2);
    const shadowPeakAlpha = (
      0.14 +
      localIlluminationFactor * 0.08 -
      focusedBeamBoost * 0.03
    ).toFixed(2);
    const shadowMidAlpha = (
      0.08 +
      localIlluminationFactor * 0.04 -
      focusedBeamBoost * 0.02
    ).toFixed(2);

    return {
      background: `
      radial-gradient(
        ellipse 100% 94% at 50% 50%,
        rgba(232, 236, 242, ${innerGreyAlpha}) 0%,
        rgba(220, 224, 230, ${midGreyAlpha}) 34%,
        rgba(188, 194, 202, ${outerGreyAlpha}) 66%,
        rgba(160, 166, 176, 0.08) 88%,
        rgba(160, 166, 176, 0) 98%
      ),
      radial-gradient(
        ellipse 38% 28% at 61% 43%,
        rgba(58, 62, 70, ${shadowPeakAlpha}) 0%,
        rgba(74, 79, 88, ${shadowMidAlpha}) 38%,
        rgba(92, 98, 108, 0) 72%
      ),
      radial-gradient(
        ellipse 74% 68% at 50% 50%,
        rgba(248, 250, 252, ${softWhiteAlpha}) 0%,
        rgba(240, 244, 248, ${midGreyAlpha}) 42%,
        rgba(224, 228, 234, 0) 78%
      )
    `,
      blurPx: 0.52,
      extraTransform: " scale(1.08, 1.05)",
      opacity: Math.min(
        1,
        0.74 + localIlluminationFactor * 0.14 + focusedBeamBoost * 0.02,
      ),
      shift: retStreakOffset * 0.04,
    };
  }

  return null;
}
