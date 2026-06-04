import {
  BLUE_END_REFLEX_COLOR,
  brightenColor,
} from "./color.js?v=20260308-103";
import { REFRACTION_VALUE_SET } from "./constants.js?v=20260430-6";
import { updateCentralMediaMask } from "./central-media-masks.js?v=20260427-19";
import {
  buildActiveReflexVisual,
  getActiveRefractionForMode,
  getCataractVisualState,
  getCaseFlags,
  getVisualFlagsForEye,
  getEdgeVisualState,
  REFRACTION_VALUES,
} from "./retinoscopy-visuals.js?v=20260430-4";
import {
  clampRetStreakOffset as clampRetStreakOffsetWithinBounds,
  clampRetStreakOffsetY as clampRetStreakOffsetYWithinBounds,
  getBeamAnchorInWrapper as measureBeamAnchorInWrapper,
  getFellowEyeFocusBalance as measureFellowEyeFocusBalance,
  getPupilCentreInWrapper as measurePupilCentreInWrapper,
  getRetStreakOffsetBounds as measureRetStreakOffsetBounds,
  getRetStreakOffsetYBounds as measureRetStreakOffsetYBounds,
  getRetStreakVisual as getRetStreakVisualElement,
  updateRetStreakPosition as syncRetStreakPosition,
  updateRetStreakTransform as syncRetStreakTransform,
} from "./retinoscopy-beam-geometry.js?v=20260428-1";
import {
  createCorticalPatternStateForRefraction as buildCorticalPatternStateForRefraction,
  updateCornealReflexState as syncCornealReflexState,
  updateCorticalCataractMask as syncCorticalCataractMask,
  updatePathologyOverlay as syncPathologyOverlay,
} from "./retinoscopy-overlays.js?v=20260428-8";
import {
  applyStructuralEyeState,
  syncStructuralReflexApertures,
  updateLightResponsivePupilScale,
} from "./structural-eye-effects.js?v=20260430-4";

export function createRetinoscopyController({ state, dom }) {
  const GLOBAL_REFLEX_BRIGHTNESS_BOOST = 1.752;
  const GLOBAL_REFLEX_OPACITY_BOOST = 1.1;
  const RIGHT_ANTERIOR_SEGMENT_DULL_BRIGHTNESS_SCALE = 0.62;
  const RIGHT_ANTERIOR_SEGMENT_DULL_OPACITY_SCALE = 0.84;
  const DEFAULT_RET_STREAK_LIMIT = 100;
  const DEFAULT_RET_STREAK_Y_LIMIT = 18;
  const LIGHT_JITTER_MIN_OFFSET_PX = 2;

  function getCaseSpecificDullingScale(eyeType) {
    const isAffectedRightEye =
      eyeType === "left" &&
      (state.currentRefraction === REFRACTION_VALUES.RIGHT_ACG_LEFT_NORMAL ||
        state.currentRefraction ===
          REFRACTION_VALUES.RIGHT_IRIDOCYCLITIS_LEFT_NORMAL);

    return {
      brightness: isAffectedRightEye
        ? RIGHT_ANTERIOR_SEGMENT_DULL_BRIGHTNESS_SCALE
        : 1,
      opacity: isAffectedRightEye
        ? RIGHT_ANTERIOR_SEGMENT_DULL_OPACITY_SCALE
        : 1,
    };
  }

  function createCorticalPatternStateForRefraction(value) {
    return buildCorticalPatternStateForRefraction(value);
  }

  function getManualDragFillFactor(eye) {
    if (!eye) {
      return 1;
    }

    const rawValue = parseFloat(
      eye.style.getPropertyValue("--manual-drag-pupil-fill-factor"),
    );
    return Number.isFinite(rawValue) ? Math.max(1, rawValue) : 1;
  }

  function getEffectiveBaseReflexColor() {
    if (state.currentRefraction === REFRACTION_VALUES.BILATERAL_BLUE_NORMAL) {
      return BLUE_END_REFLEX_COLOR;
    }

    return state.baseReflexColor;
  }

  function getBasePupilFill(eye, flags, fillFactorOverride = null) {
    if (flags.normalDarkCase) {
      return "rgb(44, 44, 44)";
    }

    if (flags.leucocoriaCase) {
      return `
        radial-gradient(
          circle at 50% 44%,
          rgb(255, 249, 234) 0%,
          rgb(247, 238, 214) 40%,
          rgb(232, 221, 194) 72%,
          rgb(206, 193, 165) 100%
        )
      `;
    }

    const { r, g, b } = getEffectiveBaseReflexColor();
    const fillFactor = Number.isFinite(fillFactorOverride)
      ? fillFactorOverride
      : getManualDragFillFactor(eye);
    const boostedColor = brightenColor({ r, g, b }, fillFactor);
    return `rgb(${boostedColor.r}, ${boostedColor.g}, ${boostedColor.b})`;
  }

  function getLiveEyeOffset(iris) {
    return {
      x:
        (iris?.caseOffset?.x || 0) +
        (iris?.manualOffset?.x || 0) +
        (iris?.gazeOffset?.x || 0),
      y:
        (iris?.caseOffset?.y || 0) +
        (iris?.manualOffset?.y || 0) +
        (iris?.gazeOffset?.y || 0),
    };
  }

  function getAlignmentDeviationBoostWeight({ eyeType, iris, pupilRadiusPx }) {
    const isDeviationEye =
      (state.currentRefraction ===
        REFRACTION_VALUES.RIGHT_NORMAL_LEFT_LARGE_ESOTROPIA &&
        eyeType === "right") ||
      (state.currentRefraction ===
        REFRACTION_VALUES.RIGHT_LARGE_EXOTROPIA_LEFT_CORNEAL_SCAR &&
        eyeType === "left");

    if (!isDeviationEye) {
      return 1;
    }

    const { x, y } = getLiveEyeOffset(iris);
    const distancePx = Math.hypot(x, y * 0.65);
    const fadeStartPx = Math.max(2, pupilRadiusPx * 0.12);
    const fadeEndPx = Math.max(fadeStartPx + 1, pupilRadiusPx * 0.95);
    const rawT = Math.max(
      0,
      Math.min(1, (distancePx - fadeStartPx) / (fadeEndPx - fadeStartPx)),
    );
    return rawT * rawT * (3 - 2 * rawT);
  }

  function applyAlignmentDeviationBoost(baseBoost, boostWeight) {
    return 1 + (Math.max(1, baseBoost) - 1) * boostWeight;
  }

  function getGazeFixationResponse(iris) {
    if (!state.isLiveMotionEnabled || !iris) {
      return {
        brightness: 1,
        fillFactor: 1,
        opacity: 1,
      };
    }

    const { x } = getLiveEyeOffset(iris);
    const horizontalT = Math.max(0, Math.min(1, Math.abs(x) / 18));
    const smoothT = horizontalT * horizontalT * (3 - 2 * horizontalT);
    return {
      brightness: 1 + smoothT * 0.24,
      fillFactor: 1 + smoothT * 0.34,
      opacity: 1 + smoothT * 0.08,
    };
  }

  function getNystagmusVisibilityResponse(iris, flags = {}) {
    const normalizedLevel =
      Math.max(0, Math.min(100, state.nystagmusLevel || 0)) / 100;
    if (normalizedLevel <= 0 || !iris) {
      return {
        blurPx: 0,
        brightness: 1,
        opacity: 1,
      };
    }

    const caseVisibilityWeight =
      flags.aniridiaCase || flags.bilateralAniridiaCase ? 0 : 1;

    const offset = iris.nystagmusOffset || { x: 0, y: 0 };
    const expectedAmplitude = Math.max(1, normalizedLevel * 9.2);
    const motionT = Math.max(
      0,
      Math.min(1, Math.hypot(offset.x || 0, offset.y || 0) / expectedAmplitude),
    );
    const smoothT = motionT * motionT * (3 - 2 * motionT);

    return {
      blurPx: smoothT * normalizedLevel * 0.28 * caseVisibilityWeight,
      brightness: 1 - smoothT * normalizedLevel * 0.08 * caseVisibilityWeight,
      opacity: 1 - smoothT * normalizedLevel * 0.1 * caseVisibilityWeight,
    };
  }

  function getLastBlinkAgeSec(timeSec) {
    return state.lastBlinkAtMs
      ? Math.max(0, timeSec - state.lastBlinkAtMs / 1000)
      : Infinity;
  }

  function getRetStreakVisual() {
    return getRetStreakVisualElement(document);
  }

  function updateRetStreakPosition() {
    syncRetStreakPosition({
      retStreak: dom.retStreak,
      retStreakVisual: getRetStreakVisual(),
      eyesWrapper: dom.eyesWrapper,
      leftEye: dom.leftEye,
      rightEye: dom.rightEye,
    });
  }

  function updateRetStreakTransform() {
    const timeSec = performance.now() / 1000;
    const lightJitter = getLightJitterOffset(timeSec);
    syncRetStreakTransform({
      retStreak: dom.retStreak,
      retStreakVisual: getRetStreakVisual(),
      retStreakOffset: state.retStreakOffset + lightJitter.x,
      retStreakOffsetY: (state.retStreakOffsetY || 0) + lightJitter.y,
    });
  }

  function getLightJitterOffset(timeSec) {
    if (!state.lightHoldActive) {
      return { x: 0, y: 0 };
    }

    const offsetX = state.retStreakOffset || 0;
    const offsetY = state.retStreakOffsetY || 0;
    const distancePx = Math.hypot(offsetX, offsetY);
    if (distancePx < LIGHT_JITTER_MIN_OFFSET_PX) {
      return { x: 0, y: 0 };
    }

    const intensity = Math.min(1, distancePx / 52);
    const babyFactor = state.isBabyMode ? 1.14 : 1;
    const jitterX =
      (Math.sin(timeSec * 9.4 + 0.7) * 0.52 +
        Math.sin(timeSec * 16.8 + 1.9) * 0.12) *
      intensity *
      babyFactor;
    const jitterY =
      (Math.cos(timeSec * 8.2 + 0.2) * 0.34 +
        Math.sin(timeSec * 15.5 + 2.6) * 0.08) *
      intensity *
      babyFactor;

    return {
      x: Math.max(-1, Math.min(1, jitterX)),
      y: Math.max(-0.75, Math.min(0.75, jitterY)),
    };
  }

  function getPupilCentreInWrapper(pupilElement, wrapperRect) {
    return measurePupilCentreInWrapper(pupilElement, wrapperRect);
  }

  function getBeamAnchorInWrapper(wrapperRect) {
    return measureBeamAnchorInWrapper({
      wrapperRect,
      leftEye: dom.leftEye,
      rightEye: dom.rightEye,
    });
  }

  function getRetStreakOffsetBounds() {
    return measureRetStreakOffsetBounds({
      eyesWrapper: dom.eyesWrapper,
      leftEye: dom.leftEye,
      rightEye: dom.rightEye,
      defaultLimit: DEFAULT_RET_STREAK_LIMIT,
    });
  }

  function getRetStreakOffsetYBounds() {
    return measureRetStreakOffsetYBounds({
      eyesWrapper: dom.eyesWrapper,
      leftEye: dom.leftEye,
      rightEye: dom.rightEye,
      defaultLimit: DEFAULT_RET_STREAK_Y_LIMIT,
    });
  }

  function clampRetStreakOffset(value) {
    return clampRetStreakOffsetWithinBounds({
      value,
      currentValue: state.retStreakOffset,
      eyesWrapper: dom.eyesWrapper,
      leftEye: dom.leftEye,
      rightEye: dom.rightEye,
      defaultLimit: DEFAULT_RET_STREAK_LIMIT,
    });
  }

  function clampRetStreakOffsetY(value) {
    return clampRetStreakOffsetYWithinBounds({
      value,
      currentValue: state.retStreakOffsetY || 0,
      eyesWrapper: dom.eyesWrapper,
      leftEye: dom.leftEye,
      rightEye: dom.rightEye,
      defaultLimit: DEFAULT_RET_STREAK_Y_LIMIT,
    });
  }

  function getFellowEyeFocusBalance({
    beamCentre,
    eyeType,
    pupilRadiusPx,
    sweepX,
    sweepY,
    wrapperRect,
  }) {
    return measureFellowEyeFocusBalance({
      beamCentre,
      eyeType,
      leftEye: dom.leftEye,
      pupilRadiusPx,
      rightEye: dom.rightEye,
      sweepX,
      sweepY,
      wrapperRect,
    });
  }

  function updateCornealReflexState({
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
    syncCornealReflexState({
      beamCentre,
      eye,
      eyeType,
      leftEye: dom.leftEye,
      lightOffsetX,
      lightOffsetY,
      pupilRadiusPx,
      rightEye: dom.rightEye,
      sweepX,
      sweepY,
      wrapperRect,
    });
  }

  function updateCorticalCataractMask({
    maskElement,
    isActiveEye,
    flags,
    eyeType,
    sweepY,
  }) {
    state.corticalCataractPattern = syncCorticalCataractMask({
      maskElement,
      isActiveEye,
      flags,
      eyeType,
      corticalCataractPattern: state.corticalCataractPattern,
      sweepY,
    });
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
    syncPathologyOverlay({
      flags,
      isActiveEye,
      overlayElement,
      pupilRadiusPx,
      sweepX,
      sweepY,
      timeSec,
    });
  }

  function updateActiveEyeReflex({
    activeRefraction,
    beamCentre,
    beamOffsetX,
    beamOffsetY,
    cataractVisual,
    eye,
    eyeType,
    flags,
    iris,
    pupilRadiusPx,
    reflex,
    reflexCompX,
    reflexCompY,
    timeSec,
    wrapperRect,
  }) {
    const alignmentBoostWeight = getAlignmentDeviationBoostWeight({
      eyeType,
      iris,
      pupilRadiusPx,
    });
    const reflexVisual = buildActiveReflexVisual({
      activeRefraction,
      axisDeltaRad: 0,
      cataractLevel: state.cataractLevel,
      cylinderAxisDeg: 0,
      currentRefraction: activeRefraction,
      eyeType,
      flags,
      globalLightOffset: state.retStreakOffset,
      lastBlinkAgeSec: getLastBlinkAgeSec(timeSec),
      movementSign: 1,
      retStreakOffset: beamOffsetX,
      retStreakOffsetY: beamOffsetY,
      sceneRefraction: state.currentRefraction,
      timeSec,
    });

    reflex.style.background = reflexVisual.background;

    const shiftX = reflexVisual.shift - reflexCompX;
    const shiftY = -reflexCompY;
    const sweepX = beamOffsetX;
    const sweepY = beamOffsetY;
    const lampDrivenSweepY = sweepY + reflexCompY;
    const { edgeBlurBoostPx, edgeBrightnessScale, edgeOpacityScale } =
      getEdgeVisualState({
        probeOffsetX: sweepX,
        probeOffsetY: lampDrivenSweepY,
        pupilRadiusPx,
      });
    const isAniridiaReflex =
      flags.aniridiaCase ||
      flags.bilateralAniridiaCase ||
      activeRefraction === REFRACTION_VALUES.ANIRIDIA;
    const isNeutralCase =
      state.currentRefraction === REFRACTION_VALUES.BILATERAL_MYOPIA ||
      state.currentRefraction === REFRACTION_VALUES.RIGHT_HYPER_LEFT_MYOPIA ||
      activeRefraction === REFRACTION_VALUES.ZERO ||
      activeRefraction === REFRACTION_VALUES.ANIRIDIA ||
      activeRefraction === REFRACTION_VALUES.NORMAL_DARK ||
      activeRefraction === REFRACTION_VALUES.NORMAL_HYPER;
    const effectiveEdgeBlurBoostPx = isAniridiaReflex
      ? 0
      : isNeutralCase
        ? edgeBlurBoostPx * 0.2
        : edgeBlurBoostPx;
    const effectiveEdgeBrightnessScale = isAniridiaReflex
      ? 1
      : isNeutralCase
        ? 0.86 + edgeBrightnessScale * 0.14
        : edgeBrightnessScale;
    const effectiveEdgeOpacityScale = isAniridiaReflex
      ? 1
      : isNeutralCase
        ? 0.72 + edgeOpacityScale * 0.28
        : edgeOpacityScale;
    const verticalReflexT = Math.max(-1, Math.min(1, lampDrivenSweepY / 18));
    const verticalReflexShiftPx = verticalReflexT * 1.25;
    const verticalReflexScaleY = 1 + Math.abs(verticalReflexT) * 0.018;

    let transformStr = `translate(${shiftX}px, ${(shiftY + verticalReflexShiftPx).toFixed(2)}px)`;
    if (
      state.currentRefraction === REFRACTION_VALUES.HIGH_MINUS ||
      state.currentRefraction === REFRACTION_VALUES.HIGH_PLUS
    ) {
      transformStr += " scale(0.6)";
    }
    transformStr += reflexVisual.extraTransform;
    transformStr += ` scale(1, ${verticalReflexScaleY.toFixed(3)})`;
    reflex.style.transform = transformStr;

    const { smoothT: rawFellowEyeFocusT } = getFellowEyeFocusBalance({
      beamCentre,
      eyeType,
      pupilRadiusPx,
      sweepX,
      sweepY,
      wrapperRect,
    });
    const fellowEyeFocusT = isAniridiaReflex ? 0 : rawFellowEyeFocusT;

    const reflexEdgeOpacityScale = flags.denseCataractCase
      ? 0.18 + (1 - edgeOpacityScale) * 0.7
      : effectiveEdgeOpacityScale;
    const reflexVisualOpacity = isAniridiaReflex ? 0.6 : reflexVisual.opacity;
    const adjustedOpacity =
      reflexVisualOpacity *
      reflexEdgeOpacityScale *
      cataractVisual.opacityScale *
      GLOBAL_REFLEX_OPACITY_BOOST *
      (1 - fellowEyeFocusT * 0.3);
    const cornealOpacityOpacityScale =
      state.currentRefraction ===
        REFRACTION_VALUES.RIGHT_NORMAL_LEFT_CORNEAL_OPACITY &&
      eyeType === "right"
        ? 0.82
        : 1;
    const caseSpecificDullingScale = getCaseSpecificDullingScale(eyeType);
    const dullReflexOpacityScale =
      state.currentRefraction === REFRACTION_VALUES.BILATERAL_DULL_REFLEX
        ? 0.5
        : 1;
    const manualDragOpacityBoost = Math.max(
      1,
      parseFloat(
        eye?.style.getPropertyValue("--manual-drag-reflex-opacity-boost"),
      ) || 1,
    );
    const effectiveManualDragOpacityBoost = applyAlignmentDeviationBoost(
      manualDragOpacityBoost,
      alignmentBoostWeight,
    );
    const gazeFixationResponse = getGazeFixationResponse(iris);
    const nystagmusVisibilityResponse = getNystagmusVisibilityResponse(
      iris,
      flags,
    );
    reflex.style.opacity = Math.max(
      0.015,
      Math.min(
        adjustedOpacity *
          effectiveManualDragOpacityBoost *
          gazeFixationResponse.opacity *
          nystagmusVisibilityResponse.opacity *
          dullReflexOpacityScale *
          caseSpecificDullingScale.opacity *
          cornealOpacityOpacityScale,
        1,
      ),
    );

    const totalBlurPx =
      reflexVisual.blurPx +
      cataractVisual.blurBoostPx +
      effectiveEdgeBlurBoostPx +
      nystagmusVisibilityResponse.blurPx +
      (state.currentRefraction === REFRACTION_VALUES.BILATERAL_DULL_REFLEX
        ? 0.34
        : 0);
    const filterParts = [];
    if (totalBlurPx > 0.01) {
      filterParts.push(`blur(${totalBlurPx.toFixed(2)}px)`);
    }

    const totalBrightnessScale =
      cataractVisual.brightnessScale *
      effectiveEdgeBrightnessScale *
      GLOBAL_REFLEX_BRIGHTNESS_BOOST;
    const cornealOpacityBrightnessScale =
      state.currentRefraction ===
        REFRACTION_VALUES.RIGHT_NORMAL_LEFT_CORNEAL_OPACITY &&
      eyeType === "right"
        ? 0.54
        : 1;
    const fellowEyeBrightnessScale = 1 - fellowEyeFocusT * 0.5;
    const manualDragBrightnessBoost = Math.max(
      1,
      parseFloat(
        eye?.style.getPropertyValue("--manual-drag-reflex-brightness-boost"),
      ) || 1,
    );
    const effectiveManualDragBrightnessBoost = applyAlignmentDeviationBoost(
      manualDragBrightnessBoost,
      alignmentBoostWeight,
    );
    const adjustedBrightnessScale =
      totalBrightnessScale *
      cornealOpacityBrightnessScale *
      caseSpecificDullingScale.brightness *
      fellowEyeBrightnessScale *
      gazeFixationResponse.brightness *
      nystagmusVisibilityResponse.brightness *
      effectiveManualDragBrightnessBoost *
      (state.currentRefraction === REFRACTION_VALUES.BILATERAL_DULL_REFLEX
        ? 0.64
        : 1);
    if (Math.abs(adjustedBrightnessScale - 1) > 0.01) {
      filterParts.push(`brightness(${adjustedBrightnessScale.toFixed(2)})`);
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
    const flags = getCaseFlags(state.currentRefraction);
    const cataractVisual = getCataractVisualState(state.cataractLevel);
    const timeSec = performance.now() / 1000;
    const lightJitter = getLightJitterOffset(timeSec);
    const wrapperRect = dom.eyesWrapper?.getBoundingClientRect() || null;
    const beamAnchor = getBeamAnchorInWrapper(wrapperRect);
    const beamCentre = beamAnchor
      ? {
          x: beamAnchor.x + state.retStreakOffset + lightJitter.x,
          y: beamAnchor.y + (state.retStreakOffsetY || 0) + lightJitter.y,
        }
      : null;

    dom.retReflexElements.forEach((reflex) => {
      const eye = reflex.closest(".eye");
      const eyeType = eye?.dataset.eye;
      const activeRefraction = getActiveRefractionForMode(
        state.currentRefraction,
        eyeType,
      );
      const eyeFlags = getVisualFlagsForEye(state.currentRefraction, eyeType);
      applyStructuralEyeState({
        eye,
        eyeType,
        flags: eyeFlags,
        isActiveEye: true,
        sceneRefraction: state.currentRefraction,
      });
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
        (iris?.backgroundOffset?.x || 0);
      const totalEyeOffsetY =
        (iris?.nystagmusOffset?.y || 0) +
        (iris?.microOffset?.y || 0) +
        (iris?.backgroundOffset?.y || 0);
      const reflexCompX = state.nystagmusLevel > 0 ? totalEyeOffsetX : 0;
      const reflexCompY = state.nystagmusLevel > 0 ? totalEyeOffsetY : 0;
      const beamOffsetX =
        beamCentre && pupilCentre
          ? beamCentre.x - pupilCentre.x
          : state.retStreakOffset - reflexCompX;
      const beamOffsetY =
        beamCentre && pupilCentre ? beamCentre.y - pupilCentre.y : -reflexCompY;
      if (pupil) {
        const alignmentBoostWeight = getAlignmentDeviationBoostWeight({
          eyeType,
          iris,
          pupilRadiusPx,
        });
        const gazeFixationResponse = getGazeFixationResponse(iris);
        const effectiveFillFactor =
          applyAlignmentDeviationBoost(
            getManualDragFillFactor(eye),
            alignmentBoostWeight,
          ) * gazeFixationResponse.fillFactor;
        pupil.style.background = getBasePupilFill(
          eye,
          eyeFlags,
          effectiveFillFactor,
        );
      }

      updateLightResponsivePupilScale({
        eye,
        flags: eyeFlags,
        isActiveEye: true,
        pupilRadiusPx,
        sweepX: beamOffsetX,
        sweepY: beamOffsetY,
      });
      updateCornealReflexState({
        beamCentre,
        eye,
        eyeType,
        lightOffsetX: state.retStreakOffset + lightJitter.x,
        lightOffsetY: (state.retStreakOffsetY || 0) + lightJitter.y,
        pupilRadiusPx,
        sweepX: beamOffsetX,
        sweepY: beamOffsetY,
        wrapperRect,
      });
      updateCentralMediaMask({
        maskElement: centralSubcorticalMask,
        flags: eyeFlags,
        isActiveEye: true,
      });
      updateCorticalCataractMask({
        maskElement: corticalCataractMask,
        isActiveEye: true,
        flags: eyeFlags,
        eyeType,
      });
      updatePathologyOverlay({
        flags: eyeFlags,
        isActiveEye: true,
        overlayElement: pathologyOverlay,
        pupilRadiusPx,
        sweepX: beamOffsetX,
        sweepY: beamOffsetY,
        timeSec,
      });

      updateActiveEyeReflex({
        activeRefraction,
        beamCentre,
        beamOffsetX,
        beamOffsetY,
        cataractVisual,
        eye,
        eyeType,
        flags: eyeFlags,
        iris,
        pupilRadiusPx,
        reflex,
        reflexCompX,
        reflexCompY,
        timeSec,
        wrapperRect,
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

  function renderNow(includePosition = false) {
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

  function setRetStreakOffset(
    value,
    verticalValue = state.retStreakOffsetY || 0,
  ) {
    state.retStreakOffset = clampRetStreakOffset(value);
    state.retStreakOffsetY = clampRetStreakOffsetY(verticalValue);
    if (state.lightHoldActive) {
      startLightJitterLoop();
    }
    scheduleRetinoscopy(false);
  }

  function startLightJitterLoop() {
    if (state.lightJitterRafId) {
      return;
    }

    const loop = () => {
      const isOffCentre =
        Math.hypot(state.retStreakOffset || 0, state.retStreakOffsetY || 0) >=
        LIGHT_JITTER_MIN_OFFSET_PX;
      if (!state.lightHoldActive || !isOffCentre) {
        state.lightJitterRafId = 0;
        scheduleRetinoscopy(false);
        return;
      }

      updateRetinoscopy({ includePosition: false });
      state.lightJitterRafId = requestAnimationFrame(loop);
    };

    state.lightJitterRafId = requestAnimationFrame(loop);
  }

  function setLightHoldActive(isActive) {
    state.lightHoldActive = Boolean(isActive);
    if (state.lightHoldActive) {
      startLightJitterLoop();
      return;
    }

    if (state.lightJitterRafId) {
      cancelAnimationFrame(state.lightJitterRafId);
      state.lightJitterRafId = 0;
    }
    scheduleRetinoscopy(false);
  }

  function setRefraction(value) {
    if (!REFRACTION_VALUE_SET.has(value)) {
      return;
    }

    state.currentRefraction = value;
    state.corticalCataractPattern =
      createCorticalPatternStateForRefraction(value);

    state.cylinderAxisDeg = null;
    state.retStreakOffset = 0;
    state.retStreakOffsetY = 0;

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
    getRetStreakOffsetBounds,
    getRetStreakOffsetYBounds,
    renderNow,
    scheduleRetinoscopy,
    setLightHoldActive,
    setRetStreakOffset,
    setRefraction,
    setCataractLevel,
  };
}
