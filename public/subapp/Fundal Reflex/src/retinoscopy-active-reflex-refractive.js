import { REFRACTION_VALUES } from "./retinoscopy-case-metadata.js?v=20260310-194";
import { getBeamLightState } from "./retinoscopy-active-reflex-common.js?v=20260308-135";

export function resolveRefractiveCustomActiveReflexVisual({
  activeRefraction,
  currentRefraction,
  flags,
  retStreakOffset,
  sceneRefraction,
}) {
  if (
    flags.normalDarkCase &&
    activeRefraction === REFRACTION_VALUES.NORMAL_DARK
  ) {
    const { focusedBeamBoost, localIlluminationFactor } = getBeamLightState({
      centredBase: 0.26,
      centredPower: 0.78,
      centredScale: 0.74,
      focusedRange: 52,
      retStreakOffset,
    });
    const warmCapAlpha = (0.002 + localIlluminationFactor * 0.028).toFixed(2);
    const warmCapMidAlpha = (0.001 + localIlluminationFactor * 0.015).toFixed(
      2,
    );
    const crescentAlpha = (0.003 + localIlluminationFactor * 0.022).toFixed(2);
    const crescentMidAlpha = (0.001 + localIlluminationFactor * 0.011).toFixed(
      2,
    );
    const baseGlowPeakAlpha = (
      0.006 +
      localIlluminationFactor * 0.032 +
      focusedBeamBoost * 0.011
    ).toFixed(2);
    const baseGlowMidAlpha = (
      0.002 +
      localIlluminationFactor * 0.014 +
      focusedBeamBoost * 0.006
    ).toFixed(2);

    return {
      background: `
      radial-gradient(
        ellipse 42% 22% at 50% 22%,
        rgba(255, 214, 92, ${warmCapAlpha}) 0%,
        rgba(255, 198, 60, ${warmCapMidAlpha}) 34%,
        rgba(255, 188, 42, 0) 64%
      ),
      radial-gradient(
        ellipse 54% 24% at 50% 28%,
        rgba(234, 236, 242, ${crescentAlpha}) 0%,
        rgba(234, 236, 242, ${crescentMidAlpha}) 44%,
        rgba(234, 236, 242, 0) 74%
      ),
      radial-gradient(
        ellipse 70% 62% at 50% 50%,
        rgba(255, 255, 255, ${baseGlowPeakAlpha}) 0%,
        rgba(255, 255, 255, ${baseGlowMidAlpha}) 46%,
        rgba(255, 255, 255, 0) 78%
      )
    `,
      blurPx: 0.1,
      extraTransform: "",
      opacity: Math.min(
        1,
        0.04 + localIlluminationFactor * 0.038 + focusedBeamBoost * 0.016,
      ),
      shift: 0,
    };
  }

  if (sceneRefraction === REFRACTION_VALUES.BILATERAL_HIGH_HYPERMETROPIA) {
    const hyperLayerBrightnessBoost = 1.34;
    const { focusedBeamBoost, localIlluminationFactor } = getBeamLightState({
      centredBase: 0.42,
      centredPower: 0.74,
      centredScale: 0.58,
      focusedRange: 52,
      retStreakOffset,
    });
    const warmCapAlpha = (
      (0.09 + localIlluminationFactor * 0.36) *
      hyperLayerBrightnessBoost
    ).toFixed(2);
    const warmCapMidAlpha = (
      (0.07 + localIlluminationFactor * 0.28) *
      hyperLayerBrightnessBoost
    ).toFixed(2);
    const warmCapTailAlpha = (
      (0.04 + localIlluminationFactor * 0.16) *
      hyperLayerBrightnessBoost
    ).toFixed(2);
    const bridgeGlowPeakAlpha = (
      (0.07 + localIlluminationFactor * 0.19 + focusedBeamBoost * 0.03) *
      hyperLayerBrightnessBoost
    ).toFixed(2);
    const bridgeGlowMidAlpha = (
      (0.04 + localIlluminationFactor * 0.1 + focusedBeamBoost * 0.02) *
      hyperLayerBrightnessBoost
    ).toFixed(2);
    const crescentCutoutPeakAlpha = (
      (0.08 + localIlluminationFactor * 0.1 + focusedBeamBoost * 0.02) *
      hyperLayerBrightnessBoost
    ).toFixed(2);
    const crescentCutoutMidAlpha = (
      (0.03 + localIlluminationFactor * 0.05 + focusedBeamBoost * 0.02) *
      hyperLayerBrightnessBoost
    ).toFixed(2);
    const crescentAlpha = (
      (0.18 + localIlluminationFactor * 0.44) *
      hyperLayerBrightnessBoost
    ).toFixed(2);
    const crescentMidAlpha = (
      (0.09 + localIlluminationFactor * 0.28) *
      hyperLayerBrightnessBoost
    ).toFixed(2);
    const baseGlowPeakAlpha = (
      (0.06 + localIlluminationFactor * 0.15 + focusedBeamBoost * 0.06) *
      hyperLayerBrightnessBoost
    ).toFixed(2);
    const baseGlowMidAlpha = (
      (0.03 + localIlluminationFactor * 0.08 + focusedBeamBoost * 0.03) *
      hyperLayerBrightnessBoost
    ).toFixed(2);

    return {
      background: `
      radial-gradient(
        ellipse 50% 24% at 50% 20%,
        rgba(255, 226, 98, ${warmCapAlpha}) 0%,
        rgba(255, 218, 76, ${warmCapMidAlpha}) 30%,
        rgba(255, 208, 56, ${warmCapTailAlpha}) 56%,
        rgba(255, 198, 42, 0) 70%
      ),
      radial-gradient(
        ellipse 60% 20% at 50% 34%,
        rgba(255, 236, 168, ${bridgeGlowPeakAlpha}) 0%,
        rgba(255, 246, 224, ${bridgeGlowMidAlpha}) 42%,
        rgba(255, 252, 242, 0) 72%
      ),
      radial-gradient(
        ellipse 46% 14% at 50% 39%,
        rgba(255, 240, 210, ${crescentCutoutPeakAlpha}) 0%,
        rgba(255, 246, 228, ${crescentCutoutMidAlpha}) 52%,
        rgba(255, 252, 242, 0) 84%
      ),
      radial-gradient(
        ellipse 124% 60% at 50% 23%,
        rgba(247, 248, 252, ${crescentAlpha}) 0%,
        rgba(247, 248, 252, ${crescentMidAlpha}) 44%,
        rgba(247, 248, 252, 0) 82%
      ),
      radial-gradient(
        ellipse 68% 60% at 50% 54%,
        rgba(255, 255, 255, ${baseGlowPeakAlpha}) 0%,
        rgba(255, 255, 255, ${baseGlowMidAlpha}) 46%,
        rgba(255, 255, 255, 0) 80%
      )
    `,
      blurPx: 0.08,
      extraTransform: "",
      opacity: Math.min(
        1,
        0.7 + localIlluminationFactor * 0.28 + focusedBeamBoost * 0.08,
      ),
      shift: 0,
    };
  }

  if (currentRefraction === REFRACTION_VALUES.NORMAL_HYPER) {
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
      (0.08 + localIlluminationFactor * 0.2 + focusedBeamBoost * 0.08) *
      hyperLayerBrightnessBoost
    ).toFixed(2);
    const baseGlowMidAlpha = (
      (0.04 + localIlluminationFactor * 0.1 + focusedBeamBoost * 0.04) *
      hyperLayerBrightnessBoost
    ).toFixed(2);

    return {
      background: `
      radial-gradient(
        ellipse 52% 28% at 50% 20%,
        rgba(255, 226, 98, ${warmCapAlpha}) 0%,
        rgba(255, 218, 76, ${warmCapMidAlpha}) 30%,
        rgba(255, 208, 56, ${warmCapTailAlpha}) 56%,
        rgba(255, 198, 42, 0) 70%
      ),
      radial-gradient(
        ellipse 56% 18% at 50% 34%,
        rgba(255, 236, 168, ${bridgeGlowPeakAlpha}) 0%,
        rgba(255, 246, 224, ${bridgeGlowMidAlpha}) 42%,
        rgba(255, 252, 242, 0) 72%
      ),
      radial-gradient(
        ellipse 50% 17% at 50% 37%,
        rgba(255, 240, 210, ${crescentCutoutPeakAlpha}) 0%,
        rgba(255, 246, 228, ${crescentCutoutMidAlpha}) 52%,
        rgba(255, 252, 242, 0) 84%
      ),
      radial-gradient(
        ellipse 98% 48% at 50% 24%,
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
        0.68 + localIlluminationFactor * 0.3 + focusedBeamBoost * 0.08,
      ),
      shift: 0,
    };
  }

  if (
    currentRefraction === REFRACTION_VALUES.ZERO ||
    (flags.normalDarkCase && activeRefraction !== REFRACTION_VALUES.NORMAL_DARK)
  ) {
    const neutralLayerBrightnessBoost = 1.3;
    const { focusedBeamBoost, localIlluminationFactor } = getBeamLightState({
      centredBase: 0.4,
      centredPower: 0.75,
      centredScale: 0.6,
      focusedRange: 48,
      retStreakOffset,
    });
    const warmCapAlpha = (
      (0.08 + localIlluminationFactor * 0.42) *
      neutralLayerBrightnessBoost
    ).toFixed(2);
    const warmCapMidAlpha = (
      (0.06 + localIlluminationFactor * 0.34) *
      neutralLayerBrightnessBoost
    ).toFixed(2);
    const crescentAlpha = (
      (0.08 + localIlluminationFactor * 0.24) *
      neutralLayerBrightnessBoost
    ).toFixed(2);
    const crescentMidAlpha = (
      (0.03 + localIlluminationFactor * 0.14) *
      neutralLayerBrightnessBoost
    ).toFixed(2);
    const warmCapTailAlpha = (
      (0.04 + localIlluminationFactor * 0.18) *
      neutralLayerBrightnessBoost
    ).toFixed(2);
    const bridgeGlowPeakAlpha = (
      (0.05 + localIlluminationFactor * 0.14 + focusedBeamBoost * 0.03) *
      neutralLayerBrightnessBoost
    ).toFixed(2);
    const bridgeGlowMidAlpha = (
      (0.02 + localIlluminationFactor * 0.07 + focusedBeamBoost * 0.02) *
      neutralLayerBrightnessBoost
    ).toFixed(2);
    const crescentCutoutPeakAlpha = (
      (0.14 + localIlluminationFactor * 0.18 + focusedBeamBoost * 0.03) *
      neutralLayerBrightnessBoost
    ).toFixed(2);
    const crescentCutoutMidAlpha = (
      (0.06 + localIlluminationFactor * 0.09 + focusedBeamBoost * 0.03) *
      neutralLayerBrightnessBoost
    ).toFixed(2);
    const baseGlowPeakAlpha = (
      (0.08 + localIlluminationFactor * 0.18 + focusedBeamBoost * 0.08) *
      neutralLayerBrightnessBoost
    ).toFixed(2);
    const baseGlowMidAlpha = (
      (0.04 + localIlluminationFactor * 0.08 + focusedBeamBoost * 0.04) *
      neutralLayerBrightnessBoost
    ).toFixed(2);

    return {
      background: `
      radial-gradient(
        ellipse 46% 26% at 50% 22%,
        rgba(255, 226, 98, ${warmCapAlpha}) 0%,
        rgba(255, 218, 76, ${warmCapMidAlpha}) 28%,
        rgba(255, 208, 56, ${warmCapTailAlpha}) 52%,
        rgba(255, 198, 42, 0) 68%
      ),
      radial-gradient(
        ellipse 48% 16% at 50% 34%,
        rgba(255, 236, 168, ${bridgeGlowPeakAlpha}) 0%,
        rgba(255, 246, 224, ${bridgeGlowMidAlpha}) 42%,
        rgba(255, 252, 242, 0) 70%
      ),
      radial-gradient(
        ellipse 44% 18% at 50% 36%,
        rgba(255, 240, 210, ${crescentCutoutPeakAlpha}) 0%,
        rgba(255, 246, 228, ${crescentCutoutMidAlpha}) 52%,
        rgba(255, 252, 242, 0) 82%
      ),
      radial-gradient(
        ellipse 62% 28% at 50% 27%,
        rgba(247, 248, 252, ${crescentAlpha}) 0%,
        rgba(247, 248, 252, ${crescentMidAlpha}) 40%,
        rgba(247, 248, 252, 0) 74%
      ),
      radial-gradient(
        ellipse 74% 68% at 50% 51%,
        rgba(255, 255, 255, ${baseGlowPeakAlpha}) 0%,
        rgba(255, 255, 255, ${baseGlowMidAlpha}) 46%,
        rgba(255, 255, 255, 0) 80%
      )
    `,
      blurPx: 0.08,
      extraTransform: "",
      opacity: Math.min(
        1,
        0.62 + localIlluminationFactor * 0.34 + focusedBeamBoost * 0.08,
      ),
      shift: 0,
    };
  }

  return null;
}
