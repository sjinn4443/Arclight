import { REFRACTION_VALUE_SET } from "./constants.js";
import { updateCentralMediaMask } from "./central-media-masks.js?v=20260506-2";
import {
  buildPathologyOverlayVisual,
  buildActiveReflexVisual,
  buildCorticalCataractOverlay,
  createCorticalCataractPattern,
  getActiveRefractionForMode,
  getCataractVisualState,
  getCaseFlags,
  getEdgeVisualState,
  getMovementStatusHtml,
  isAxisDependentCase,
  normalizeTo180,
  randomCylinderAxisDeg,
  REFRACTION_VALUES,
  smallestAxisDifference,
} from "./retinoscopy-visuals.js?v=20260506-3";
import {
  applyStructuralEyeState,
  syncStructuralReflexApertures,
  updateLightResponsivePupilScale,
} from "./structural-eye-effects.js";

export function createRetinoscopyController({ state, dom }) {
  const GLOBAL_REFLEX_BRIGHTNESS_BOOST = 1.12;
  const GLOBAL_REFLEX_OPACITY_BOOST = 1.1;
  const FELLOW_EYE_REFLEX_BACKGROUND =
    "radial-gradient(ellipse at 50% 50%, rgba(94, 94, 94, 0.32) 14%, rgba(58, 58, 58, 0.08) 58%, rgba(40, 40, 40, 0.01) 76%, rgba(32, 32, 32, 0) 88%)";
  const FELLOW_EYE_REFLEX_BRIGHTNESS_SCALE = 0.22;
  const FELLOW_EYE_REFLEX_OPACITY_SCALE = 0.12;
  const FELLOW_EYE_REFLEX_BLUR_PX = 0.5;
  const CORNEAL_LIGHT_SHIFT_FACTOR = 0.02;
  const CORNEAL_LIGHT_SHIFT_X_LIMIT_PX = 0.8;
  const CORNEAL_LIGHT_SHIFT_Y_LIMIT_PX = 0.6;
  let lastMovementStatusHtml = "";
  let hasUserSweptSinceRefractionChange = false;

  function setMovementStatusVisible(isVisible) {
    if (!dom.movementStatusLabel) {
      return;
    }

    dom.movementStatusLabel.classList.toggle(
      "is-visible",
      !state.isTestMode && isVisible,
    );
  }

  function updateMovementStatusLabel(html) {
    if (!dom.movementStatusLabel || html === lastMovementStatusHtml) {
      return;
    }

    const emphasisMatch = html.match(/^<em>([^<]*)<\/em>\s*(.*)$/);
    if (!emphasisMatch) {
      dom.movementStatusLabel.textContent = html;
      lastMovementStatusHtml = html;
      return;
    }

    const emphasis = document.createElement("em");
    emphasis.textContent = emphasisMatch[1];
    dom.movementStatusLabel.replaceChildren(
      emphasis,
      document.createTextNode(` ${emphasisMatch[2]}`),
    );
    lastMovementStatusHtml = html;
  }

  function applyRetEyeClasses(activeEye) {
    dom.eyes.forEach((eye) => {
      const isActive = eye.dataset.eye === activeEye;
      eye.classList.toggle("is-ret-active", isActive);
      eye.classList.toggle("is-ret-fellow", !isActive);
    });
  }

  function clamp(value, min, max) {
    return Math.max(min, Math.min(max, value));
  }

  function getFellowEyeFocusBalance({
    beamCentre,
    eyeType,
    pupilRadiusPx,
    sweepX,
    sweepY,
    wrapperRect,
  }) {
    const currentDistancePx = Math.hypot(sweepX, sweepY);
    const fellowEye = eyeType === "left" ? dom.rightEye : dom.leftEye;
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

  function updateCornealReflex({
    beamCentre,
    eye,
    eyeType,
    lightOffsetX = 0,
    lightOffsetY = 0,
    pupilRadiusPx,
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
      pupilRadiusPx,
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

  function updateRetStreakPosition() {
    const { retStreak, eyesWrapper } = dom;
    if (!retStreak || !eyesWrapper) {
      return;
    }

    const targetEye =
      state.activeRetEye === "left" ? dom.leftEye : dom.rightEye;
    if (!targetEye) {
      return;
    }

    const pupil = targetEye.querySelector(".pupil");
    if (!pupil) {
      return;
    }

    const wrapperRect = eyesWrapper.getBoundingClientRect();
    const pupilRect = pupil.getBoundingClientRect();
    const pupilCentreX =
      (pupilRect.left + pupilRect.right) / 2 - wrapperRect.left;
    const pupilCentreY =
      (pupilRect.top + pupilRect.bottom) / 2 - wrapperRect.top;

    retStreak.style.left = `${pupilCentreX}px`;
    retStreak.style.top = `${pupilCentreY}px`;
  }

  function updateRetStreakTransform() {
    const { retStreak } = dom;
    if (!retStreak) {
      return;
    }

    retStreak.style.transform = `
    translate(-50%, -50%)
    rotate(${state.retStreakRotation}deg)
    translateX(${state.retStreakOffset}px)
  `;
  }

  function getPupilCentreInWrapper(pupilElement, wrapperRect) {
    if (!pupilElement || !wrapperRect) {
      return null;
    }

    const pupilRect = pupilElement.getBoundingClientRect();
    return {
      x: (pupilRect.left + pupilRect.right) / 2 - wrapperRect.left,
      y: (pupilRect.top + pupilRect.bottom) / 2 - wrapperRect.top,
    };
  }

  function getRetStreakCentreInWrapper(wrapperRect) {
    if (!dom.retStreak || !wrapperRect) {
      return null;
    }

    const streakRect = dom.retStreak.getBoundingClientRect();
    return {
      x: (streakRect.left + streakRect.right) / 2 - wrapperRect.left,
      y: (streakRect.top + streakRect.bottom) / 2 - wrapperRect.top,
    };
  }

  function updateCorticalCataractMask(maskElement, isActiveEye, flags) {
    if (!maskElement) {
      return;
    }

    const shouldShowMask = flags.corticalCataractCase && isActiveEye;
    if (!shouldShowMask) {
      maskElement.style.opacity = "0";
      maskElement.style.background = "none";
      maskElement.style.maskImage = "none";
      maskElement.style.webkitMaskImage = "none";
      return;
    }

    const isLargePattern = flags.bigCorticalCataractCase;
    const pattern =
      state.corticalCataractPattern ||
      createCorticalCataractPattern(isLargePattern);
    state.corticalCataractPattern = pattern;

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
          rgba(0, 0, 0, 0.9) 76%,
          rgba(0, 0, 0, 1) 100%
        )`;

    maskElement.style.maskImage = maskImage;
    maskElement.style.webkitMaskImage = maskImage;
    maskElement.style.filter = isLargePattern ? "blur(0.36px)" : "blur(0.24px)";
    maskElement.style.opacity = isLargePattern ? "0.94" : "0.9";
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
    const fadeEndPx =
      pupilRadiusPx * (flags.vitreousHaemorrhageCase ? 6.1 : 6.4);
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

  function updatePathologyOverlay({
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

    const overlayVisual = buildPathologyOverlayVisual({ flags, timeSec });
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

  function updateFellowEyeReflex({
    cataractVisual,
    pupilRadiusPx,
    reflex,
    reflexCompX,
    reflexCompY,
    sweepX,
    sweepY,
  }) {
    const distancePx = Math.hypot(sweepX, sweepY);
    const fadeStartPx = pupilRadiusPx * 0.02;
    const fadeEndPx = pupilRadiusPx * 0.62;
    const fadeRangePx = Math.max(1, fadeEndPx - fadeStartPx);
    const rawT = Math.max(
      0,
      Math.min(1, (distancePx - fadeStartPx) / fadeRangePx),
    );
    const smoothT = rawT * rawT * (3 - 2 * rawT);
    const sweepIllumination = 1 - smoothT;
    const opacityVisibility = Math.pow(sweepIllumination, 2.6);
    const brightnessVisibility = Math.pow(sweepIllumination, 2.15);

    reflex.style.background = FELLOW_EYE_REFLEX_BACKGROUND;
    reflex.style.transform = `translate(${-reflexCompX}px, ${-reflexCompY}px) rotate(${state.retStreakRotation}deg)`;
    reflex.style.opacity = Math.min(
      1,
      0.085 *
        opacityVisibility *
        cataractVisual.opacityScale *
        GLOBAL_REFLEX_OPACITY_BOOST *
        FELLOW_EYE_REFLEX_OPACITY_SCALE,
    );
    const brightnessScale =
      brightnessVisibility *
      cataractVisual.brightnessScale *
      GLOBAL_REFLEX_BRIGHTNESS_BOOST *
      FELLOW_EYE_REFLEX_BRIGHTNESS_SCALE;
    const filterParts = [`blur(${FELLOW_EYE_REFLEX_BLUR_PX.toFixed(2)}px)`];
    if (Math.abs(brightnessScale - 1) > 0.01) {
      filterParts.push(`brightness(${brightnessScale.toFixed(2)})`);
    }
    reflex.style.filter = filterParts.join(" ");
  }

  function updateActiveEyeReflex({
    angleRad,
    axisDeltaRad,
    beamOffsetX,
    beamOffsetY,
    cataractVisual,
    cylinderAxisDeg,
    eye,
    flags,
    movementSign,
    pupilRadiusPx,
    reflex,
    reflexCompX,
    reflexCompY,
    timeSec,
  }) {
    const reflexVisual = buildActiveReflexVisual({
      activeRefraction: getActiveRefractionForMode(
        state.currentRefraction,
        state.activeRetEye,
      ),
      axisDeltaRad,
      cataractLevel: state.cataractLevel,
      cylinderAxisDeg,
      currentRefraction: state.currentRefraction,
      flags,
      movementSign,
      retStreakOffset: state.retStreakOffset,
      timeSec,
    });

    reflex.style.background = reflexVisual.background;

    const shiftX = reflexVisual.shift * Math.cos(angleRad) - reflexCompX;
    const shiftY = reflexVisual.shift * Math.sin(angleRad) - reflexCompY;
    const sweepX = Number.isFinite(beamOffsetX)
      ? beamOffsetX
      : state.retStreakOffset * Math.cos(angleRad) - reflexCompX;
    const sweepY = Number.isFinite(beamOffsetY)
      ? beamOffsetY
      : state.retStreakOffset * Math.sin(angleRad) - reflexCompY;
    const { edgeBlurBoostPx, edgeBrightnessScale, edgeOpacityScale } =
      getEdgeVisualState({
        probeOffsetX: sweepX,
        probeOffsetY: sweepY,
        pupilRadiusPx,
      });

    let transformStr = `translate(${shiftX}px, ${shiftY}px) rotate(${state.retStreakRotation}deg)`;
    if (
      state.currentRefraction === REFRACTION_VALUES.HIGH_MINUS ||
      state.currentRefraction === REFRACTION_VALUES.HIGH_PLUS
    ) {
      transformStr += " scale(0.6)";
    }
    transformStr += reflexVisual.extraTransform;
    reflex.style.transform = transformStr;

    const adjustedOpacity =
      reflexVisual.opacity *
      edgeOpacityScale *
      cataractVisual.opacityScale *
      GLOBAL_REFLEX_OPACITY_BOOST;
    reflex.style.opacity = Math.max(0.015, Math.min(adjustedOpacity, 1));

    const totalBlurPx =
      reflexVisual.blurPx + cataractVisual.blurBoostPx + edgeBlurBoostPx;
    const filterParts = [];
    if (totalBlurPx > 0.01) {
      filterParts.push(`blur(${totalBlurPx.toFixed(2)}px)`);
    }

    const totalBrightnessScale =
      cataractVisual.brightnessScale *
      edgeBrightnessScale *
      GLOBAL_REFLEX_BRIGHTNESS_BOOST;
    if (Math.abs(totalBrightnessScale - 1) > 0.01) {
      filterParts.push(`brightness(${totalBrightnessScale.toFixed(2)})`);
    }

    reflex.style.filter = filterParts.length ? filterParts.join(" ") : "none";

    syncStructuralReflexApertures({
      eye,
      flags,
      reflexBackground: reflex.style.background,
      reflexTransform: reflex.style.transform,
      reflexOpacity: reflex.style.opacity,
      reflexFilter: reflex.style.filter,
    });
  }

  function updateRetReflex() {
    const activeRefraction = getActiveRefractionForMode(
      state.currentRefraction,
      state.activeRetEye,
    );
    const flags = getCaseFlags(state.currentRefraction);
    const cylinderAxisDeg =
      typeof state.cylinderAxisDeg === "number" ? state.cylinderAxisDeg : 0;
    const rotationNorm = normalizeTo180(state.retStreakRotation);
    const axisDeltaDeg = smallestAxisDifference(rotationNorm, cylinderAxisDeg);
    const axisDeltaRad = (axisDeltaDeg * Math.PI) / 180;
    const movementSign = Math.cos(axisDeltaRad * 2);
    const cataractVisual = getCataractVisualState(state.cataractLevel);
    const hasActiveSweep =
      hasUserSweptSinceRefractionChange && Math.abs(state.retStreakOffset) >= 1;
    const angleRad = state.retStreakRotation * (Math.PI / 180);
    const timeSec = performance.now() / 1000;
    const wrapperRect = dom.eyesWrapper?.getBoundingClientRect() || null;
    const activeEyeElement =
      state.activeRetEye === "left" ? dom.leftEye : dom.rightEye;
    const activePupilElement =
      activeEyeElement?.querySelector(".pupil") || null;
    const activePupilCentre = getPupilCentreInWrapper(
      activePupilElement,
      wrapperRect,
    );
    const renderedBeamCentre = getRetStreakCentreInWrapper(wrapperRect);
    const fallbackBeamCentre = activePupilCentre
      ? {
          x: activePupilCentre.x + state.retStreakOffset * Math.cos(angleRad),
          y: activePupilCentre.y + state.retStreakOffset * Math.sin(angleRad),
        }
      : null;
    const beamCentre = renderedBeamCentre || fallbackBeamCentre;

    setMovementStatusVisible(hasActiveSweep);
    updateMovementStatusLabel(
      getMovementStatusHtml({
        activeEye: state.activeRetEye,
        activeRefraction,
        currentRefraction: state.currentRefraction,
        flags,
        movementSign,
      }),
    );

    dom.retReflexElements.forEach((reflex) => {
      const eye = reflex.closest(".eye");
      const eyeType = eye?.dataset.eye;
      const isActiveEye = eyeType === state.activeRetEye;
      applyStructuralEyeState({ eye, eyeType, flags, isActiveEye });
      const iris = eye?.querySelector(".iris");
      const pupil = eye?.querySelector(".pupil");
      const corticalCataractMask = eye?.querySelector(
        ".cortical-cataract-mask",
      );
      const centralSubcorticalMask = eye?.querySelector(
        ".central-subcortical-mask",
      );
      const pathologyOverlay = eye?.querySelector(".pathology-overlay");
      const pupilRadiusPx = Math.max(8, (pupil?.clientWidth || 32) * 0.5);
      const pupilCentre = getPupilCentreInWrapper(pupil, wrapperRect);
      const totalEyeOffsetX =
        (iris?.nystagmusOffset?.x || 0) +
        (iris?.microOffset?.x || 0) +
        (iris?.backgroundOffset?.x || 0) +
        (iris?.gazeOffset?.x || 0);
      const totalEyeOffsetY =
        (iris?.nystagmusOffset?.y || 0) +
        (iris?.microOffset?.y || 0) +
        (iris?.backgroundOffset?.y || 0) +
        (iris?.gazeOffset?.y || 0);
      const shouldCompensateEyeMotion =
        state.nystagmusLevel > 0 || state.isGazeMode;
      const reflexCompX = shouldCompensateEyeMotion ? totalEyeOffsetX : 0;
      const reflexCompY = shouldCompensateEyeMotion ? totalEyeOffsetY : 0;
      const beamOffsetX =
        beamCentre && pupilCentre
          ? beamCentre.x - pupilCentre.x
          : state.retStreakOffset * Math.cos(angleRad) - reflexCompX;
      const beamOffsetY =
        beamCentre && pupilCentre
          ? beamCentre.y - pupilCentre.y
          : state.retStreakOffset * Math.sin(angleRad) - reflexCompY;

      updateLightResponsivePupilScale({
        eye,
        flags,
        isActiveEye,
        pupilRadiusPx,
        sweepX: beamOffsetX,
        sweepY: beamOffsetY,
      });
      updateCornealReflex({
        beamCentre,
        eye,
        eyeType,
        lightOffsetX: beamOffsetX,
        lightOffsetY: beamOffsetY,
        pupilRadiusPx,
        sweepX: beamOffsetX,
        sweepY: beamOffsetY,
        wrapperRect,
      });
      updateCentralMediaMask({
        maskElement: centralSubcorticalMask,
        flags,
        isActiveEye,
      });
      updateCorticalCataractMask(corticalCataractMask, isActiveEye, flags);
      updatePathologyOverlay({
        flags,
        isActiveEye,
        overlayElement: pathologyOverlay,
        pupilRadiusPx,
        sweepX: beamOffsetX,
        sweepY: beamOffsetY,
        timeSec,
      });

      if (!isActiveEye) {
        updateFellowEyeReflex({
          cataractVisual,
          pupilRadiusPx,
          reflex,
          reflexCompX,
          reflexCompY,
          sweepX: beamOffsetX,
          sweepY: beamOffsetY,
        });
        return;
      }

      updateActiveEyeReflex({
        angleRad,
        axisDeltaRad,
        beamOffsetX,
        beamOffsetY,
        cataractVisual,
        cylinderAxisDeg,
        eye,
        flags,
        movementSign,
        pupilRadiusPx,
        reflex,
        reflexCompX,
        reflexCompY,
        timeSec,
      });
    });
  }

  function updateRetinoscopy({ includePosition = true } = {}) {
    if (includePosition) {
      updateRetStreakPosition();
    }
    updateRetStreakTransform();
    updateRetReflex();
  }

  function renderNow(includePosition = true) {
    if (state.retinoscopyRafId) {
      cancelAnimationFrame(state.retinoscopyRafId);
      state.retinoscopyRafId = 0;
    }
    state.retinoscopyNeedsPosition = false;
    updateRetinoscopy({ includePosition });
  }

  function scheduleRetinoscopy(includePosition = false) {
    state.retinoscopyNeedsPosition =
      state.retinoscopyNeedsPosition || includePosition;
    if (state.retinoscopyRafId) {
      return;
    }

    state.retinoscopyRafId = requestAnimationFrame(() => {
      updateRetinoscopy({ includePosition: state.retinoscopyNeedsPosition });
      state.retinoscopyNeedsPosition = false;
      state.retinoscopyRafId = 0;
    });
  }

  function setActiveRetEye(nextEye) {
    if (nextEye !== "left" && nextEye !== "right") {
      return;
    }

    state.activeRetEye = nextEye;
    applyRetEyeClasses(nextEye);
    dom.retEyeButtons.forEach((button) => {
      button.classList.toggle("is-active", button.dataset.retEye === nextEye);
    });
    scheduleRetinoscopy(true);
  }

  function setRetStreakOffset(value) {
    state.retStreakOffset = value;
    hasUserSweptSinceRefractionChange = true;
    scheduleRetinoscopy(false);
  }

  function setRetStreakRotation(value) {
    state.retStreakRotation = value;
    scheduleRetinoscopy(false);
  }

  function setRefraction(value) {
    if (!REFRACTION_VALUE_SET.has(value)) {
      return;
    }

    state.currentRefraction = value;
    const flags = getCaseFlags(value);
    if (flags.corticalCataractCase) {
      state.corticalCataractPattern = createCorticalCataractPattern(
        value === REFRACTION_VALUES.BIG_CORTICAL_CATARACT,
      );
    } else {
      state.corticalCataractPattern = null;
    }

    if (isAxisDependentCase(value)) {
      state.cylinderAxisDeg = randomCylinderAxisDeg();
      state.retStreakRotation =
        state.cylinderAxisDeg > 90
          ? state.cylinderAxisDeg - 180
          : state.cylinderAxisDeg;
    } else {
      state.cylinderAxisDeg = null;
      state.retStreakRotation = 0;
    }

    state.retStreakOffset = 0;
    if (dom.retinoscopySlider) {
      dom.retinoscopySlider.value = "0";
    }
    if (dom.retinoscopyRotationSlider) {
      dom.retinoscopyRotationSlider.value = String(state.retStreakRotation);
    }

    hasUserSweptSinceRefractionChange = false;
    setMovementStatusVisible(false);
    scheduleRetinoscopy(true);
  }

  function setCataractLevel(value) {
    const parsed = Number.isFinite(value) ? value : parseInt(value, 10);
    if (Number.isNaN(parsed)) {
      return;
    }

    state.cataractLevel = Math.max(0, Math.min(100, parsed));
    scheduleRetinoscopy(false);
  }

  return {
    renderNow,
    scheduleRetinoscopy,
    setActiveRetEye,
    setRetStreakOffset,
    setRetStreakRotation,
    setRefraction,
    setCataractLevel,
  };
}
