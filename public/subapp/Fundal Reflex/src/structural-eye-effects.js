import { REFRACTION_VALUES } from "./retinoscopy-case-metadata.js?v=20260430-3";

function clearMirroredReflex(reflexElement) {
  if (!reflexElement) {
    return;
  }

  reflexElement.style.opacity = "0";
  reflexElement.style.background = "none";
  reflexElement.style.transform = "none";
  reflexElement.style.filter = "none";
}

function syncMirroredReflex({
  eye,
  reflexSelector,
  shouldShow,
  reflexBackground,
  reflexTransform,
  reflexOpacity,
  reflexFilter,
}) {
  const reflexElement = eye?.querySelector(reflexSelector);
  if (!reflexElement) {
    return;
  }

  if (!shouldShow) {
    clearMirroredReflex(reflexElement);
    return;
  }

  reflexElement.style.background = reflexBackground;
  reflexElement.style.transform = reflexTransform;
  reflexElement.style.opacity = reflexOpacity;
  reflexElement.style.filter = reflexFilter;
}

export function applyStructuralEyeState({
  eye,
  eyeType,
  flags,
  isActiveEye,
  sceneRefraction,
  sizeProfile = "live",
}) {
  if (!eye) {
    return;
  }

  const applyDullReflexCornealDot =
    sceneRefraction === REFRACTION_VALUES.BILATERAL_DULL_REFLEX;
  const applyIolReflection =
    sceneRefraction ===
      REFRACTION_VALUES.RIGHT_IOL_LEFT_POSTERIOR_CAPSULAR_THICKENING &&
    eyeType === "left";
  const applyCornealOpacityReflex =
    sceneRefraction === REFRACTION_VALUES.RIGHT_NORMAL_LEFT_CORNEAL_OPACITY &&
    eyeType === "right";
  const applySubluxatedLensEdge =
    sceneRefraction === REFRACTION_VALUES.RIGHT_NORMAL_LEFT_SUBLUXATED_LENS &&
    eyeType === "right";
  const applyTechniqueUpperLidBlock =
    sceneRefraction === REFRACTION_VALUES.TECHNIQUE_UPPER_LID_BLOCKING;
  eye.classList.toggle(
    "is-corneal-scar",
    (flags.cornealScarCase || applyDullReflexCornealDot) && isActiveEye,
  );
  eye.classList.toggle(
    "is-technique-upper-lid-block",
    applyTechniqueUpperLidBlock && isActiveEye,
  );
  eye.classList.toggle("has-iol-reflection", applyIolReflection && isActiveEye);
  eye.classList.toggle(
    "has-corneal-opacity-reflex",
    applyCornealOpacityReflex && isActiveEye,
  );
  eye.classList.toggle(
    "has-subluxated-lens-edge",
    applySubluxatedLensEdge && isActiveEye,
  );

  const pupilElement = eye.querySelector(".pupil");
  const colobomaExtension = eye.querySelector(".coloboma-extension");
  const colobomaReflex = eye.querySelector(".coloboma-extension-reflex");
  const irisTransilluminationPatch = eye.querySelector(
    ".iris-transillumination-patch",
  );
  const irisTransilluminationReflex = eye.querySelector(
    ".iris-transillumination-reflex",
  );
  const baseSizePx = Math.max(
    10,
    parseFloat(pupilElement?.dataset.baseSizePx || "") ||
      pupilElement?.clientWidth ||
      32,
  );
  const applyAcg = flags.acgCase && isActiveEye;
  const applyAniridia = flags.aniridiaCase;
  const applyIrisTransillumination =
    flags.irisTransilluminationCase && isActiveEye;
  const applyNasalColoboma = flags.nasalColobomaCase && isActiveEye;
  const applySmallPupils = flags.smallPupilsCase;
  const applyLeftAnisocoria =
    sceneRefraction === REFRACTION_VALUES.RIGHT_NORMAL_LEFT_ANISOCORIA &&
    eyeType === "right";

  if (pupilElement) {
    let targetWidthPx = baseSizePx;
    let targetHeightPx = baseSizePx;

    if (sizeProfile === "preview") {
      if (applyAniridia) {
        const targetSizePx = Math.min(44, Math.max(41, baseSizePx * 2.6));
        targetWidthPx = targetSizePx;
        targetHeightPx = targetSizePx;
      } else if (applyLeftAnisocoria) {
        const targetSizePx = Math.max(11, Math.min(13, baseSizePx * 0.72));
        targetWidthPx = targetSizePx;
        targetHeightPx = targetSizePx;
      } else if (applySmallPupils) {
        const targetSizePx = Math.max(9, Math.min(11, baseSizePx * 0.6));
        targetWidthPx = targetSizePx;
        targetHeightPx = targetSizePx;
      } else if (applyAcg) {
        targetWidthPx = Math.min(21, Math.max(18, baseSizePx * 1.18));
        targetHeightPx = Math.min(25, Math.max(22, baseSizePx * 1.46));
      }
    } else if (applyAniridia) {
      const targetSizePx = Math.min(74, Math.max(66, baseSizePx * 2.25));
      targetWidthPx = targetSizePx;
      targetHeightPx = targetSizePx;
    } else if (applyLeftAnisocoria) {
      const targetSizePx = Math.max(24, Math.min(27, baseSizePx * 0.82));
      targetWidthPx = targetSizePx;
      targetHeightPx = targetSizePx;
    } else if (applySmallPupils) {
      const targetSizePx = Math.max(18, Math.min(22, baseSizePx * 0.62));
      targetWidthPx = targetSizePx;
      targetHeightPx = targetSizePx;
    } else if (applyAcg) {
      targetWidthPx = Math.min(38, Math.max(34, baseSizePx * 1.08));
      targetHeightPx = Math.min(46, Math.max(40, baseSizePx * 1.34));
    }

    pupilElement.style.width = `${targetWidthPx}px`;
    pupilElement.style.height = `${targetHeightPx}px`;
    pupilElement.style.left = `calc(50% - ${targetWidthPx / 2}px)`;
    pupilElement.style.top = `calc(50% - ${targetHeightPx / 2}px)`;
  }

  if (colobomaExtension) {
    colobomaExtension.classList.toggle("is-visible", applyNasalColoboma);
    colobomaExtension.classList.toggle(
      "is-screen-left",
      applyNasalColoboma && eyeType === "left",
    );
    colobomaExtension.classList.toggle(
      "is-screen-right",
      applyNasalColoboma && eyeType === "right",
    );
  }

  if (!applyNasalColoboma) {
    clearMirroredReflex(colobomaReflex);
  }

  if (irisTransilluminationPatch) {
    irisTransilluminationPatch.classList.toggle(
      "is-visible",
      applyIrisTransillumination,
    );
    irisTransilluminationPatch.classList.toggle(
      "is-screen-left",
      applyIrisTransillumination && eyeType === "left",
    );
    irisTransilluminationPatch.classList.toggle(
      "is-screen-right",
      applyIrisTransillumination && eyeType === "right",
    );
  }

  if (!applyIrisTransillumination) {
    clearMirroredReflex(irisTransilluminationReflex);
  }
}

export function syncStructuralReflexApertures({
  eye,
  flags,
  reflexBackground,
  reflexTransform,
  reflexOpacity,
  reflexFilter,
}) {
  syncMirroredReflex({
    eye,
    reflexSelector: ".coloboma-extension-reflex",
    shouldShow: flags.nasalColobomaCase,
    reflexBackground,
    reflexTransform,
    reflexOpacity,
    reflexFilter,
  });

  syncMirroredReflex({
    eye,
    reflexSelector: ".iris-transillumination-reflex",
    shouldShow: flags.irisTransilluminationCase,
    reflexBackground,
    reflexTransform,
    reflexOpacity,
    reflexFilter,
  });
}

export function updateLightResponsivePupilScale({
  eye,
  flags,
  isActiveEye,
  pupilRadiusPx,
  sweepX,
  sweepY,
  maxConstriction = 0.075,
}) {
  const iris = eye?.querySelector(".iris");
  if (!iris) {
    return;
  }

  if (flags.acgCase && isActiveEye) {
    iris.style.setProperty("--light-pupil-scale", "1");
    return;
  }

  const distancePx = Math.abs(sweepX);
  const responseRadiusPx = Math.max(1, pupilRadiusPx * 1.18);
  const rawT = Math.max(0, Math.min(1, distancePx / responseRadiusPx));
  const smoothT = rawT * rawT * (3 - 2 * rawT);
  const constrictionAmount = (1 - smoothT) * maxConstriction;
  const targetPupilScale = 1 - constrictionAmount;
  const previousPupilScale =
    parseFloat(iris.style.getPropertyValue("--light-pupil-scale")) || 1;
  const responseRate = targetPupilScale < previousPupilScale ? 0.28 : 0.16;
  const pupilScale =
    previousPupilScale + (targetPupilScale - previousPupilScale) * responseRate;
  iris.style.setProperty("--light-pupil-scale", pupilScale.toFixed(3));
}
