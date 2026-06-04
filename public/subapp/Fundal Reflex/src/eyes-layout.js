import {
  BLUE_END_REFLEX_COLOR,
  brightenColor,
} from "./color.js?v=20260308-103";
import { REFRACTION_VALUES } from "./retinoscopy-case-metadata.js?v=20260430-3";

export function getEffectiveBaseReflexColor(
  currentRefraction,
  baseReflexColor,
) {
  if (currentRefraction === REFRACTION_VALUES.BILATERAL_BLUE_NORMAL) {
    return BLUE_END_REFLEX_COLOR;
  }

  return baseReflexColor;
}

export function getEffectiveBaseReflexColorCss(
  currentRefraction,
  baseReflexColor,
) {
  const { r, g, b } = getEffectiveBaseReflexColor(
    currentRefraction,
    baseReflexColor,
  );
  return `rgb(${r}, ${g}, ${b})`;
}

export function getBrightenedReflexFillValue({
  currentRefraction,
  baseReflexColor,
  factor,
}) {
  const brightColor = brightenColor(
    getEffectiveBaseReflexColor(currentRefraction, baseReflexColor),
    factor,
  );

  return `rgb(${brightColor.r}, ${brightColor.g}, ${brightColor.b})`;
}

export function getIrisHalfSize(iris) {
  return {
    halfWidthPx: (iris.offsetWidth || 80) / 2,
    halfHeightPx: (iris.offsetHeight || 80) / 2,
  };
}

export function getDeviationBoostFactor(iris) {
  if (!iris) {
    return 1;
  }

  const eye = iris.closest(".eye");
  if (!eye) {
    return 1;
  }

  const caseOffset = iris.caseOffset || { x: 0, y: 0 };
  const manualOffset = iris.manualOffset || { x: 0, y: 0 };
  const totalX = caseOffset.x + manualOffset.x;
  const totalY = caseOffset.y + manualOffset.y;
  const distance = Math.hypot(totalX, totalY);
  const maxOffsetX = Math.max(
    1,
    (eye.clientWidth / 2 - (iris.offsetWidth || 80) / 2) * 0.8,
  );
  const maxOffsetY = 30 * 0.8;
  const maxDistance = Math.max(1, Math.hypot(maxOffsetX, maxOffsetY));
  return 1 + Math.min(distance / maxDistance, 1);
}

export function applyIrisLayoutPosition(iris) {
  if (!iris) {
    return;
  }

  const caseOffset = iris.caseOffset || { x: 0, y: 0 };
  const manualOffset = iris.manualOffset || { x: 0, y: 0 };
  const { halfWidthPx, halfHeightPx } = getIrisHalfSize(iris);

  iris.style.left = `calc(50% - ${halfWidthPx}px + ${caseOffset.x + manualOffset.x}px)`;
  iris.style.top = `calc(50% - ${halfHeightPx}px + ${caseOffset.y + manualOffset.y}px)`;
}

export function setManualDragReflexBoost(iris, factor) {
  const eye = iris?.closest(".eye");
  if (!eye) {
    return;
  }

  const safeFactor = Math.max(1, factor);
  const reflexBrightnessBoost = 1 + (safeFactor - 1) * 1.25;
  const reflexOpacityBoost = 1 + (safeFactor - 1) * 0.45;

  eye.style.setProperty(
    "--manual-drag-reflex-brightness-boost",
    reflexBrightnessBoost.toFixed(3),
  );
  eye.style.setProperty(
    "--manual-drag-reflex-opacity-boost",
    reflexOpacityBoost.toFixed(3),
  );
  eye.style.setProperty(
    "--manual-drag-pupil-fill-factor",
    safeFactor.toFixed(3),
  );
}

export function syncDeviationDrivenReflexBoost(iris) {
  const factor = getDeviationBoostFactor(iris);
  setManualDragReflexBoost(iris, factor);
  return factor;
}

export function getCaseEyeOffset(currentRefraction, eyeType) {
  if (currentRefraction === REFRACTION_VALUES.TECHNIQUE_CHILD_LOOKING_AWAY) {
    return { x: 26, y: -2 };
  }

  if (
    currentRefraction ===
      REFRACTION_VALUES.RIGHT_LARGE_EXOTROPIA_LEFT_CORNEAL_SCAR &&
    eyeType === "left"
  ) {
    return { x: -20, y: 0 };
  }

  if (
    currentRefraction === REFRACTION_VALUES.RIGHT_NORMAL_LEFT_LARGE_ESOTROPIA &&
    eyeType === "right"
  ) {
    return { x: -20, y: 0 };
  }

  return { x: 0, y: 0 };
}

export function getIrisColourValue(irisColour) {
  const root = getComputedStyle(document.documentElement);

  switch (irisColour) {
    case "light-brown":
      return root.getPropertyValue("--iris-light-brown").trim();
    case "green":
      return root.getPropertyValue("--iris-green").trim();
    case "blue":
      return root.getPropertyValue("--iris-blue").trim();
    case "dark-brown":
    default:
      return root.getPropertyValue("--iris-dark-brown").trim();
  }
}

export function applyPupilFill(target, fillValue) {
  if (!target) {
    return;
  }

  const pupil = target.querySelector(".pupil");
  if (pupil) {
    pupil.style.background = fillValue;
  }

  const colobomaExtension = target.querySelector(".coloboma-extension");
  if (colobomaExtension) {
    colobomaExtension.style.background = fillValue;
  }

  const irisTransilluminationPatch = target.querySelector(
    ".iris-transillumination-patch",
  );
  if (irisTransilluminationPatch) {
    irisTransilluminationPatch.style.background = fillValue;
  }
}

export function applyManualEyeMoveState({ irises, isManualEyeMoveEnabled }) {
  irises.forEach((iris) => {
    iris.classList.toggle("is-manual-drag-enabled", isManualEyeMoveEnabled);
  });
}

export function applyBabyModeState({ eyesWrapper, isBabyMode }) {
  eyesWrapper?.classList.toggle("is-baby-mode", isBabyMode);
}

export function getCataractPupilFilter(level) {
  const normalized = Math.max(0, Math.min(100, level)) / 100;
  const brightness = 1 - normalized * 0.72;
  const saturation = 1 - normalized * 0.64;
  const contrast = 1 - normalized * 0.18;
  return `brightness(${brightness.toFixed(2)}) saturate(${saturation.toFixed(2)}) contrast(${contrast.toFixed(2)})`;
}

export function applyCataractToPupils({ irises, cataractLevel }) {
  const filterValue = getCataractPupilFilter(cataractLevel);
  irises.forEach((iris) => {
    const pupil = iris.querySelector(".pupil");
    if (pupil) {
      pupil.style.filter = filterValue;
    }

    const colobomaExtension = iris.querySelector(".coloboma-extension");
    if (colobomaExtension) {
      colobomaExtension.style.filter = filterValue;
    }

    const irisTransilluminationPatch = iris.querySelector(
      ".iris-transillumination-patch",
    );
    if (irisTransilluminationPatch) {
      irisTransilluminationPatch.style.filter = filterValue;
    }
  });
}

export function updateIrisTransform(iris) {
  const totalX =
    (iris.gazeOffset?.x || 0) +
    (iris.microOffset?.x || 0) +
    (iris.backgroundOffset?.x || 0) +
    (iris.nystagmusOffset?.x || 0);
  const totalY =
    (iris.gazeOffset?.y || 0) +
    (iris.microOffset?.y || 0) +
    (iris.backgroundOffset?.y || 0) +
    (iris.nystagmusOffset?.y || 0);
  iris.style.transform = `translate(${totalX}px, ${totalY}px)`;

  const eye = iris.closest(".eye");
  if (eye) {
    eye.style.setProperty(
      "--corneal-reflex-micro-x",
      `${(totalX * 0.08).toFixed(2)}px`,
    );
    eye.style.setProperty(
      "--corneal-reflex-micro-y",
      `${(totalY * 0.06).toFixed(2)}px`,
    );
  }
}
