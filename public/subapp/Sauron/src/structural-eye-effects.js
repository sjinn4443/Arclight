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

export function applyStructuralEyeState({ eye, eyeType, flags, isActiveEye }) {
  if (!eye) {
    return;
  }

  eye.classList.toggle("is-corneal-scar", flags.cornealScarCase && isActiveEye);

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

  if (pupilElement) {
    let targetWidthPx = baseSizePx;
    let targetHeightPx = baseSizePx;

    if (applyAniridia) {
      const targetSizePx = Math.min(74, Math.max(66, baseSizePx * 2.25));
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

  const distancePx = Math.hypot(sweepX, sweepY);
  const responseRadiusPx = Math.max(1, pupilRadiusPx * 1.18);
  const rawT = Math.max(0, Math.min(1, distancePx / responseRadiusPx));
  const smoothT = rawT * rawT * (3 - 2 * rawT);
  const constrictionAmount = (1 - smoothT) * maxConstriction;
  const pupilScale = 1 - constrictionAmount;
  iris.style.setProperty("--light-pupil-scale", pupilScale.toFixed(3));
}
