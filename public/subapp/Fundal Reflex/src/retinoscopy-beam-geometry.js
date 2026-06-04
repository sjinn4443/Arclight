export function getRetStreakVisual(doc = document) {
  return doc.getElementById("ret-streak-visual");
}

export function getPupilCentreInWrapper(pupilElement, wrapperRect) {
  if (!pupilElement || !wrapperRect) {
    return null;
  }

  const pupilRect = pupilElement.getBoundingClientRect();
  return {
    x: (pupilRect.left + pupilRect.right) / 2 - wrapperRect.left,
    y: (pupilRect.top + pupilRect.bottom) / 2 - wrapperRect.top,
  };
}

export function getElementCentreInWrapper(element, wrapperRect) {
  if (!element || !wrapperRect) {
    return null;
  }

  const rect = element.getBoundingClientRect();
  return {
    x: (rect.left + rect.right) / 2 - wrapperRect.left,
    y: (rect.top + rect.bottom) / 2 - wrapperRect.top,
  };
}

export function getBeamAnchorInWrapper({ wrapperRect, leftEye, rightEye }) {
  if (!wrapperRect) {
    return null;
  }

  const leftEyeCentre = getElementCentreInWrapper(leftEye, wrapperRect);
  const rightEyeCentre = getElementCentreInWrapper(rightEye, wrapperRect);

  if (leftEyeCentre && rightEyeCentre) {
    return {
      x: (leftEyeCentre.x + rightEyeCentre.x) * 0.5,
      y: (leftEyeCentre.y + rightEyeCentre.y) * 0.5,
    };
  }

  return leftEyeCentre || rightEyeCentre;
}

export function updateRetStreakPosition({
  retStreak,
  retStreakVisual,
  eyesWrapper,
  leftEye,
  rightEye,
}) {
  if (!retStreak || !eyesWrapper) {
    return;
  }

  const wrapperRect = eyesWrapper.getBoundingClientRect();
  const beamAnchor = getBeamAnchorInWrapper({
    wrapperRect,
    leftEye,
    rightEye,
  });
  if (!beamAnchor) {
    return;
  }

  retStreak.style.left = `${beamAnchor.x}px`;
  retStreak.style.top = `${beamAnchor.y}px`;
  if (retStreakVisual) {
    retStreakVisual.style.left = `${beamAnchor.x}px`;
    retStreakVisual.style.top = `${beamAnchor.y}px`;
  }
}

export function updateRetStreakTransform({
  retStreak,
  retStreakVisual,
  retStreakOffset,
  retStreakOffsetY = 0,
}) {
  if (!retStreak) {
    return;
  }

  retStreak.style.transform = `translate(-50%, -50%) translate(${retStreakOffset}px, ${retStreakOffsetY}px)`;
  if (retStreakVisual) {
    retStreakVisual.style.transform = `translate(-50%, -50%) translate(${retStreakOffset}px, ${retStreakOffsetY}px)`;
    retStreakVisual.classList.toggle(
      "is-emphasized",
      retStreak.classList.contains("is-hint-visible") ||
        retStreak.matches(":focus-visible"),
    );
  }
}

export function getRetStreakOffsetBounds({
  eyesWrapper,
  leftEye,
  rightEye,
  defaultLimit,
}) {
  const wrapperRect = eyesWrapper?.getBoundingClientRect();
  const beamAnchor = getBeamAnchorInWrapper({
    wrapperRect,
    leftEye,
    rightEye,
  });
  if (!wrapperRect || !beamAnchor) {
    return {
      min: -defaultLimit,
      max: defaultLimit,
    };
  }

  const pupilOffsets = [leftEye, rightEye]
    .map((eye) => eye?.querySelector(".pupil"))
    .map((pupil) => getPupilCentreInWrapper(pupil, wrapperRect))
    .filter(Boolean)
    .map((centre) => centre.x - beamAnchor.x);

  if (!pupilOffsets.length) {
    return {
      min: -defaultLimit,
      max: defaultLimit,
    };
  }

  return {
    min: Math.ceil(Math.min(...pupilOffsets)),
    max: Math.floor(Math.max(...pupilOffsets)),
  };
}

export function getRetStreakOffsetYBounds({
  eyesWrapper,
  leftEye,
  rightEye,
  defaultLimit,
}) {
  const eyeHeights = [leftEye, rightEye]
    .map((eye) => eye?.getBoundingClientRect?.().height)
    .filter((height) => Number.isFinite(height) && height > 0);
  const measuredLimit = eyeHeights.length
    ? Math.round(Math.min(...eyeHeights) * 0.24)
    : defaultLimit;
  const wrapperHeight = eyesWrapper?.getBoundingClientRect?.().height;
  const wrapperLimit = Number.isFinite(wrapperHeight)
    ? Math.max(8, Math.round(wrapperHeight * 0.04))
    : defaultLimit;
  const limit = Math.max(
    8,
    Math.min(defaultLimit, measuredLimit, wrapperLimit),
  );

  return {
    min: -limit,
    max: limit,
  };
}

export function clampRetStreakOffset({
  value,
  currentValue,
  eyesWrapper,
  leftEye,
  rightEye,
  defaultLimit,
}) {
  const numericValue = Number.isFinite(value)
    ? value
    : Number.parseFloat(value);
  if (Number.isNaN(numericValue)) {
    return currentValue;
  }

  const { min, max } = getRetStreakOffsetBounds({
    eyesWrapper,
    leftEye,
    rightEye,
    defaultLimit,
  });
  return Math.max(min, Math.min(max, Math.round(numericValue)));
}

export function clampRetStreakOffsetY({
  value,
  currentValue,
  eyesWrapper,
  leftEye,
  rightEye,
  defaultLimit,
}) {
  const numericValue = Number.isFinite(value)
    ? value
    : Number.parseFloat(value);
  if (Number.isNaN(numericValue)) {
    return currentValue;
  }

  const { min, max } = getRetStreakOffsetYBounds({
    eyesWrapper,
    leftEye,
    rightEye,
    defaultLimit,
  });
  return Math.max(min, Math.min(max, Math.round(numericValue)));
}

export function getFellowEyeFocusBalance({
  beamCentre,
  eyeType,
  pupilRadiusPx,
  sweepX,
  sweepY,
  wrapperRect,
  leftEye,
  rightEye,
}) {
  const currentDistancePx = Math.hypot(sweepX, sweepY);
  const fellowEye = eyeType === "left" ? rightEye : leftEye;
  const fellowPupilCentre = getPupilCentreInWrapper(
    fellowEye?.querySelector(".pupil"),
    wrapperRect,
  );
  const fellowDistancePx =
    beamCentre && fellowPupilCentre
      ? Math.hypot(
          beamCentre.x - fellowPupilCentre.x,
          beamCentre.y - fellowPupilCentre.y,
        )
      : currentDistancePx;
  const distanceGapPx = Math.max(0, currentDistancePx - fellowDistancePx);
  const responseRadiusPx = Math.max(72, pupilRadiusPx * 4.8);
  const rawT = Math.max(0, Math.min(1, distanceGapPx / responseRadiusPx));
  const smoothT = rawT * rawT * (3 - 2 * rawT);

  return {
    currentDistancePx,
    fellowDistancePx,
    smoothT,
  };
}
