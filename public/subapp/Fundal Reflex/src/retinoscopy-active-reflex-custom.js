import { resolveRefractiveCustomActiveReflexVisual } from "./retinoscopy-active-reflex-refractive.js?v=20260308-135";
import { resolveSpecialCustomActiveReflexVisual } from "./retinoscopy-active-reflex-special.js?v=20260426-3";

export function resolveCustomActiveReflexVisual({
  activeRefraction,
  currentRefraction,
  eyeType,
  flags,
  retStreakOffset,
  sceneRefraction,
}) {
  return (
    resolveRefractiveCustomActiveReflexVisual({
      activeRefraction,
      currentRefraction,
      flags,
      retStreakOffset,
      sceneRefraction,
    }) ||
    resolveSpecialCustomActiveReflexVisual({
      currentRefraction,
      eyeType,
      retStreakOffset,
      sceneRefraction,
    })
  );
}
