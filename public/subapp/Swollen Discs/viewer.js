import {
  clampCircleToBounds,
  computeDrawGeometry,
  computeReflexOpacity,
  computeViewerBounds
} from './viewer-math.js';

const TIMED_AUGMENTATION_DEFAULTS = Object.freeze({
  rotateDegrees: 0,
  scale: 1,
  panXRatio: 0,
  panYRatio: 0,
  brightness: 1,
  contrast: 1,
  saturation: 1,
  flipVertical: false
});
const TIMED_AUGMENTATION_LIMITS = Object.freeze({
  rotateDegrees: { min: -7, max: 7 },
  scale: { min: 0.85, max: 1.2 },
  panRatio: { min: -0.08, max: 0.08 },
  brightness: { min: 0.78, max: 1.22 },
  contrast: { min: 0.78, max: 1.22 },
  saturation: { min: 0.78, max: 1.22 }
});
const TIMED_MOTION_DEFAULTS = Object.freeze({
  jitterMultiplier: 1,
  shiftDistanceMultiplier: 1,
  shiftDurationMs: 600
});
const TIMED_MOTION_LIMITS = Object.freeze({
  jitterMultiplier: { min: 1, max: 4 },
  shiftDistanceMultiplier: { min: 1, max: 3.2 },
  shiftDurationMs: { min: 250, max: 2500 }
});

function buildViewerPerfProfile() {
  const hasWindow = typeof window !== 'undefined';
  const hasCoarsePointer =
    hasWindow && typeof window.matchMedia === 'function'
      ? window.matchMedia('(pointer: coarse)').matches
      : false;
  const viewportEdge = hasWindow ? Math.max(window.innerWidth || 0, window.innerHeight || 0) : 0;
  const isMobileLike = hasCoarsePointer || viewportEdge <= 1100;

  return {
    isMobileLike,
    canvasScale: isMobileLike ? 0.5 : 1,
    cataractBlurScale: isMobileLike ? 0.42 : 1,
    occlusionSpotRatio: isMobileLike ? 1 : 1,
    occlusionBlurScale: isMobileLike ? 0.45 : 1,
    baseJitterIntervalMs: isMobileLike ? 24 : 16,
    cataractJitterIntervalMs: isMobileLike ? 72 : 16
  };
}

function extractImageFilename(path) {
  if (typeof path !== 'string' || path.length === 0) {
    return '';
  }

  const withoutQuery = path.split('?')[0];
  return withoutQuery.split('/').pop() || '';
}

function getJpegFallbackPath(path) {
  return null;
}

function resolvePreferredImagePath(path, shouldFallbackFromWebp) {
  if (typeof path !== 'string') {
    return '';
  }

  if (!shouldFallbackFromWebp) {
    return path;
  }

  return getJpegFallbackPath(path) || path;
}

function clampNumber(value, min, max, fallback) {
  const numeric = Number(value);
  if (!Number.isFinite(numeric)) {
    return fallback;
  }

  return Math.max(min, Math.min(max, numeric));
}

function normalizeTimedAugmentation(augmentation) {
  const candidate = augmentation && typeof augmentation === 'object' ? augmentation : {};
  return {
    rotateDegrees: clampNumber(
      candidate.rotateDegrees,
      TIMED_AUGMENTATION_LIMITS.rotateDegrees.min,
      TIMED_AUGMENTATION_LIMITS.rotateDegrees.max,
      TIMED_AUGMENTATION_DEFAULTS.rotateDegrees
    ),
    scale: clampNumber(
      candidate.scale,
      TIMED_AUGMENTATION_LIMITS.scale.min,
      TIMED_AUGMENTATION_LIMITS.scale.max,
      TIMED_AUGMENTATION_DEFAULTS.scale
    ),
    panXRatio: clampNumber(
      candidate.panXRatio,
      TIMED_AUGMENTATION_LIMITS.panRatio.min,
      TIMED_AUGMENTATION_LIMITS.panRatio.max,
      TIMED_AUGMENTATION_DEFAULTS.panXRatio
    ),
    panYRatio: clampNumber(
      candidate.panYRatio,
      TIMED_AUGMENTATION_LIMITS.panRatio.min,
      TIMED_AUGMENTATION_LIMITS.panRatio.max,
      TIMED_AUGMENTATION_DEFAULTS.panYRatio
    ),
    brightness: clampNumber(
      candidate.brightness,
      TIMED_AUGMENTATION_LIMITS.brightness.min,
      TIMED_AUGMENTATION_LIMITS.brightness.max,
      TIMED_AUGMENTATION_DEFAULTS.brightness
    ),
    contrast: clampNumber(
      candidate.contrast,
      TIMED_AUGMENTATION_LIMITS.contrast.min,
      TIMED_AUGMENTATION_LIMITS.contrast.max,
      TIMED_AUGMENTATION_DEFAULTS.contrast
    ),
    saturation: clampNumber(
      candidate.saturation,
      TIMED_AUGMENTATION_LIMITS.saturation.min,
      TIMED_AUGMENTATION_LIMITS.saturation.max,
      TIMED_AUGMENTATION_DEFAULTS.saturation
    ),
    flipVertical: Boolean(candidate.flipVertical)
  };
}

function normalizeTimedMotionProfile(profile) {
  const candidate = profile && typeof profile === 'object' ? profile : {};
  return {
    jitterMultiplier: clampNumber(
      candidate.jitterMultiplier,
      TIMED_MOTION_LIMITS.jitterMultiplier.min,
      TIMED_MOTION_LIMITS.jitterMultiplier.max,
      TIMED_MOTION_DEFAULTS.jitterMultiplier
    ),
    shiftDistanceMultiplier: clampNumber(
      candidate.shiftDistanceMultiplier,
      TIMED_MOTION_LIMITS.shiftDistanceMultiplier.min,
      TIMED_MOTION_LIMITS.shiftDistanceMultiplier.max,
      TIMED_MOTION_DEFAULTS.shiftDistanceMultiplier
    ),
    shiftDurationMs: clampNumber(
      candidate.shiftDurationMs,
      TIMED_MOTION_LIMITS.shiftDurationMs.min,
      TIMED_MOTION_LIMITS.shiftDurationMs.max,
      TIMED_MOTION_DEFAULTS.shiftDurationMs
    )
  };
}

export function createViewer({
  state,
  canvas,
  fovToggleCheckbox,
  fovLabelSmall,
  fovLabelLeft,
  fovLabelRight,
  eyeToggleCheckbox,
  eyeLabelRight,
  eyeLabelLeft,
  cataractSlider,
  cataractStops,
  viewSummary,
  explanation,
  conditionButtons,
  defaultImageSrc,
  explanationTemplates,
  cataractPresets,
  cataractOcclusionSpots
}) {
  const ctx = canvas.getContext('2d');

  const initialDegree = 5;
  const initialRadius = 80;
  const FOV_LEVELS = Object.freeze([4, 8, 15]);
  const FOV_SUMMARY_LABELS = Object.freeze({
    4: 'Normal (4\u00b0)',
    8: 'Nil (8\u00b0)',
    15: 'Dilated (15\u00b0)'
  });
  const DEFAULT_FOV_INDEX = 1;

  let circleRadius = (8 / 5) * initialRadius;
  let circleX = 0;
  let circleY = 0;

  let bgOffsetX = 0;
  let bgOffsetY = 0;

  let isDragging = false;
  let activePointerId = null;
  let velocityX = 0;
  let velocityY = 0;

  let cornealJitterOffset = { x: 0, y: 0 };
  let cornealTargetOffset = { x: 0, y: 0 };
  let cornealAnimationId = null;

  const imageScale = 1;
  const zoomFactor = 3;
  const VIEWER_PERF_PROFILE = buildViewerPerfProfile();
  let timedAugmentation = { ...TIMED_AUGMENTATION_DEFAULTS };
  let timedMotionProfile = { ...TIMED_MOTION_DEFAULTS };

  const SHIFT_DISTANCE = 400;
  let shiftTimeoutId = null;

  let jitterAnimationId = null;
  let drawAnimationId = null;
  let lastJitterRenderAt = 0;
  let lastDrawRenderAt = 0;
  const jitterAmplitude = 2;
  const occlusionTextureCache = new Map();
  const mobileCataractLayerCache = new Map();
  const MOBILE_OCCLUSION_TEXTURE_SIZE = 640;
  const listenerDisposers = [];
  let shouldFallbackFromWebp = false;

  const img = new Image();
  img.onload = () => {
    reCentreEverything();
    if (jitterAnimationId === null) {
      jitterAnimationId = requestAnimationFrame(jitter);
    }
  };
  img.onerror = () => {
    const fallbackPath = getJpegFallbackPath(state.viewer.activeImageSrc);
    if (!fallbackPath || fallbackPath === state.viewer.activeImageSrc) {
      return;
    }

    shouldFallbackFromWebp = true;
    if (state.viewer.conditionImageSrc === state.viewer.activeImageSrc) {
      state.viewer.conditionImageSrc = fallbackPath;
    }
    state.viewer.activeImageSrc = fallbackPath;
    img.src = fallbackPath;
  };

  function addDomListener(target, eventName, handler, options) {
    target.addEventListener(eventName, handler, options);
    listenerDisposers.push(() => {
      target.removeEventListener(eventName, handler, options);
    });
  }

  function requestDraw() {
    if (drawAnimationId !== null) {
      return;
    }

    drawAnimationId = requestAnimationFrame((timestamp) => {
      drawAnimationId = null;
      const minDrawIntervalMs =
        VIEWER_PERF_PROFILE.isMobileLike && state.viewer.cataractLevel > 0 ? 34 : 0;
      const now =
        typeof timestamp === 'number'
          ? timestamp
          : typeof window !== 'undefined' && window.performance
            ? window.performance.now()
            : Date.now();
      if (minDrawIntervalMs > 0 && now - lastDrawRenderAt < minDrawIntervalMs) {
        requestDraw();
        return;
      }
      lastDrawRenderAt = now;
      draw();
    });
  }

  function initialize() {
    state.viewer.activeImageSrc = defaultImageSrc;
    state.viewer.conditionImageSrc = defaultImageSrc;
    state.viewer.activeCondition = 'normal';
    state.viewer.isRightEye = true;
    state.viewer.isDiscVisible = true;
    state.viewer.cataractLevel = 0;
    state.viewer.shiftInProgress = false;
    timedAugmentation = { ...TIMED_AUGMENTATION_DEFAULTS };
    timedMotionProfile = { ...TIMED_MOTION_DEFAULTS };
    fovToggleCheckbox.value = String(DEFAULT_FOV_INDEX);
    circleRadius = fovDegreesToCircleRadius(FOV_LEVELS[DEFAULT_FOV_INDEX]);

    updateConditionButtonState('normal');
    setExplanation('normal');
    setImageSource(defaultImageSrc);
    updateFovLabels();
    updateEyeLabels();
    updateCataractUi();

    bindViewerControlEvents();
    setupCanvasPointerEvents();
  }

  function bindViewerControlEvents() {
    const onFovChange = () => {
      applyFovIndex(getCurrentFovIndex());
    };
    addDomListener(fovToggleCheckbox, 'input', onFovChange);
    addDomListener(fovToggleCheckbox, 'change', onFovChange);

    const onEyeChange = () => {
      state.viewer.isRightEye = !eyeToggleCheckbox.checked;
      reCentreEverything();
      updateEyeLabels();
    };
    addDomListener(eyeToggleCheckbox, 'change', onEyeChange);

    const onCataractInput = () => {
      state.viewer.cataractLevel = Number(cataractSlider.value);
      updateCataractUi();
      requestDraw();
    };
    addDomListener(cataractSlider, 'input', onCataractInput);

    conditionButtons.forEach((button) => {
      const onConditionClick = () => {
        if (button.disabled) {
          return;
        }

        const condition = button.getAttribute('data-condition') || 'normal';
        const imagePath = button.getAttribute('data-image') || defaultImageSrc;

        updateConditionButtonState(condition);
        state.viewer.activeCondition = condition;
        state.viewer.conditionImageSrc = imagePath;
        state.viewer.isDiscVisible = true;
        setImageSource(imagePath);
        setExplanation(condition);
      };

      addDomListener(button, 'click', onConditionClick);
    });
  }

  function updateConditionButtonState(activeCondition) {
    conditionButtons.forEach((button) => {
      const condition = button.getAttribute('data-condition') || 'normal';
      const isActive = condition === activeCondition;
      button.classList.toggle('active', isActive);
      button.setAttribute('aria-pressed', isActive ? 'true' : 'false');
    });
  }

  function setupCanvasPointerEvents() {
    addDomListener(canvas, 'pointerdown', handlePointerDown);
    addDomListener(canvas, 'pointermove', handlePointerMove);
    addDomListener(canvas, 'pointerup', stopDragging);
    addDomListener(canvas, 'pointercancel', stopDragging);

    const onPointerLeave = (event) => {
      if (event.pointerType === 'mouse') {
        stopDragging(event);
      }
    };
    addDomListener(canvas, 'pointerleave', onPointerLeave);
    addDomListener(window, 'pointerup', stopDragging);
    if (typeof document !== 'undefined') {
      addDomListener(document, 'visibilitychange', handleVisibilityChange);
    }
  }

  function handleVisibilityChange() {
    if (typeof document === 'undefined') {
      return;
    }

    if (document.hidden) {
      if (jitterAnimationId !== null) {
        cancelAnimationFrame(jitterAnimationId);
        jitterAnimationId = null;
      }
      if (drawAnimationId !== null) {
        cancelAnimationFrame(drawAnimationId);
        drawAnimationId = null;
      }
      if (cornealAnimationId !== null) {
        cancelAnimationFrame(cornealAnimationId);
        cornealAnimationId = null;
      }
      return;
    }

    if (img.complete && jitterAnimationId === null) {
      jitterAnimationId = requestAnimationFrame(jitter);
    }
    requestDraw();
  }

  function handlePointerDown(event) {
    if (event.button !== undefined && event.button !== 0) {
      return;
    }

    isDragging = true;
    activePointerId = event.pointerId;
    velocityX = 0;
    velocityY = 0;

    canvas.setPointerCapture(event.pointerId);
    canvas.style.cursor = 'none';

    updatePositionFromPointer(event);
    startCornealReflexAnimation();
  }

  function handlePointerMove(event) {
    if (!isDragging || event.pointerId !== activePointerId) {
      return;
    }
    updatePositionFromPointer(event);
  }

  function stopDragging(event) {
    if (!isDragging) {
      return;
    }

    if (typeof event.pointerId === 'number' && event.pointerId !== activePointerId) {
      return;
    }

    if (typeof event.pointerId === 'number' && canvas.hasPointerCapture(event.pointerId)) {
      canvas.releasePointerCapture(event.pointerId);
    }

    isDragging = false;
    activePointerId = null;
    canvas.style.cursor = 'crosshair';
    stopCornealReflexAnimation();
  }

  function updatePositionFromPointer(event) {
    const rect = canvas.getBoundingClientRect();
    if (rect.width === 0 || rect.height === 0) {
      return;
    }

    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;

    const pointerX = (event.clientX - rect.left) * scaleX;
    const pointerY = (event.clientY - rect.top) * scaleY;
    const dragAnchorRadius = getDragAnchorRadius();
    const dragAnchorExtraOffset = Math.max(18, Math.min(64, dragAnchorRadius * 0.12));

    circleX = pointerX;
    circleY = pointerY - dragAnchorRadius - dragAnchorExtraOffset;

    checkBoundaries();
    requestDraw();
  }

  function getDragAnchorRadius() {
    if (!img.naturalHeight || canvas.height <= 0) {
      return circleRadius * zoomFactor;
    }

    const scaleFactor = canvas.height / img.naturalHeight;
    return circleRadius * zoomFactor * scaleFactor;
  }

  function setImageSource(path) {
    const nextPath = resolvePreferredImagePath(path, shouldFallbackFromWebp);
    state.viewer.activeImageSrc = nextPath;

    const loadedImageName = extractImageFilename(img.src);
    const requestedImageName = extractImageFilename(nextPath);
    if (img.complete && loadedImageName === requestedImageName) {
      reCentreEverything();
      return;
    }

    img.src = nextPath;
  }

  function buildTimedAugmentedDrawGeometry(geometry) {
    const panX = timedAugmentation.panXRatio * geometry.scaledWidth;
    const panY = timedAugmentation.panYRatio * geometry.scaledHeight;
    const offsetXPos = geometry.offsetXPos + panX;
    const offsetYPos = geometry.offsetYPos + panY;

    return {
      offsetXPos,
      offsetYPos,
      scaledWidth: geometry.scaledWidth,
      scaledHeight: geometry.scaledHeight,
      centreX: offsetXPos + geometry.scaledWidth / 2,
      centreY: offsetYPos + geometry.scaledHeight / 2
    };
  }

  function applyTimedAugmentationTransform(augmentedGeometry) {
    const rotationRadians = (timedAugmentation.rotateDegrees * Math.PI) / 180;
    const isVerticalFlip = timedAugmentation.flipVertical === true;
    if (rotationRadians === 0 && timedAugmentation.scale === 1 && !isVerticalFlip) {
      return;
    }

    ctx.translate(augmentedGeometry.centreX, augmentedGeometry.centreY);
    if (rotationRadians !== 0) {
      ctx.rotate(rotationRadians);
    }
    if (timedAugmentation.scale !== 1 || isVerticalFlip) {
      const yScale = isVerticalFlip ? timedAugmentation.scale * -1 : timedAugmentation.scale;
      ctx.scale(timedAugmentation.scale, yScale);
    }
    ctx.translate(-augmentedGeometry.centreX, -augmentedGeometry.centreY);
  }

  function buildFundusFilter(cataract) {
    const isMobileCataract = VIEWER_PERF_PROFILE.isMobileLike && state.viewer.cataractLevel > 0;
    const blurScale = isMobileCataract ? VIEWER_PERF_PROFILE.cataractBlurScale : 1;
    const blurPx = Math.max(0, Math.min(isMobileCataract ? 0.25 : 6, cataract.blurPx * blurScale));
    const brightness = cataract.brightness * timedAugmentation.brightness;
    const contrast = cataract.contrast * timedAugmentation.contrast;
    const saturation = cataract.saturation * timedAugmentation.saturation;
    if (isMobileCataract) {
      return `brightness(${brightness})`;
    }
    return `blur(${blurPx}px) brightness(${brightness}) contrast(${contrast}) saturate(${saturation})`;
  }

  function setTimedAugmentation(augmentation) {
    timedAugmentation = normalizeTimedAugmentation(augmentation);
  }

  function clearTimedAugmentation() {
    timedAugmentation = { ...TIMED_AUGMENTATION_DEFAULTS };
  }

  function setTimedMotionProfile(profile) {
    timedMotionProfile = normalizeTimedMotionProfile(profile);
  }

  function clearTimedMotionProfile() {
    timedMotionProfile = { ...TIMED_MOTION_DEFAULTS };
  }

  function setExplanation(condition) {
    explanation.innerHTML = explanationTemplates[condition] || explanationTemplates.normal;
  }

  function updateFovLabels() {
    const fovIndex = getCurrentFovIndex();
    if (fovLabelSmall) {
      fovLabelSmall.classList.toggle('active', fovIndex === 0);
    }
    fovLabelLeft.classList.toggle('active', fovIndex === 1);
    fovLabelRight.classList.toggle('active', fovIndex === 2);
    fovToggleCheckbox.setAttribute('aria-valuetext', `${getCurrentFovDegrees()} degrees`);
    updateViewSummary();
  }

  function normalizeFovIndex(index) {
    const numericIndex = Number(index);
    if (!Number.isFinite(numericIndex)) {
      return DEFAULT_FOV_INDEX;
    }

    return Math.max(0, Math.min(FOV_LEVELS.length - 1, Math.round(numericIndex)));
  }

  function getCurrentFovIndex() {
    return normalizeFovIndex(fovToggleCheckbox.value);
  }

  function getCurrentFovDegrees() {
    return FOV_LEVELS[getCurrentFovIndex()] || 8;
  }

  function resolveClosestFovIndex(degrees) {
    const numericDegrees = Number(degrees);
    if (!Number.isFinite(numericDegrees)) {
      return DEFAULT_FOV_INDEX;
    }

    let closestIndex = DEFAULT_FOV_INDEX;
    let smallestDistance = Infinity;
    FOV_LEVELS.forEach((candidateDegrees, index) => {
      const distance = Math.abs(candidateDegrees - numericDegrees);
      if (distance < smallestDistance) {
        smallestDistance = distance;
        closestIndex = index;
      }
    });

    return closestIndex;
  }

  function fovDegreesToCircleRadius(degrees) {
    return (degrees / initialDegree) * initialRadius;
  }

  function applyFovIndex(index) {
    const normalizedIndex = normalizeFovIndex(index);
    const nextFov = FOV_LEVELS[normalizedIndex] || 8;
    fovToggleCheckbox.value = String(normalizedIndex);
    circleRadius = fovDegreesToCircleRadius(nextFov);
    checkBoundaries();
    requestDraw();
    updateFovLabels();
  }

  function setFovDegrees(degrees) {
    applyFovIndex(resolveClosestFovIndex(degrees));
  }

  function getFovDegrees() {
    return getCurrentFovDegrees();
  }

  function updateEyeLabels() {
    eyeLabelRight.classList.toggle('active', state.viewer.isRightEye);
    eyeLabelLeft.classList.toggle('active', !state.viewer.isRightEye);
    updateViewSummary();
  }

  function updateCataractUi() {
    const maxIndex = cataractPresets.length - 1;
    const clampedLevel = Math.max(0, Math.min(maxIndex, Number(cataractSlider.value) || 0));
    state.viewer.cataractLevel = clampedLevel;
    cataractSlider.value = String(clampedLevel);

    const preset = cataractPresets[state.viewer.cataractLevel];
    cataractSlider.setAttribute('aria-valuetext', preset.label);

    cataractStops.forEach((stop, index) => {
      stop.classList.toggle('active', index === clampedLevel);
    });
    updateViewSummary();
  }

  function updateViewSummary() {
    if (!viewSummary) {
      return;
    }

    const eyeText = state.viewer.isRightEye ? 'RE' : 'LE';
    const fovDegrees = getCurrentFovDegrees();
    const fovText = FOV_SUMMARY_LABELS[fovDegrees] || `${fovDegrees} degrees`;
    const cataractPreset = cataractPresets[state.viewer.cataractLevel] || cataractPresets[0];
    const cataractText = cataractPreset.label === 'None' ? 'No cataract' : cataractPreset.label;
    const summaryText = `${eyeText} - ${fovText} - ${cataractText}`;

    viewSummary.textContent = summaryText;
    viewSummary.setAttribute('aria-label', `Current viewing setup: ${summaryText}`);
  }

  function buildOcclusionRenderConfig(level, minDimension) {
    const isDenseLevel = level === 3;
    const patchProfileLevel = level === 3 ? 2 : level;
    const spots = cataractOcclusionSpots[patchProfileLevel];
    if (!spots || spots.length === 0) {
      return null;
    }

    const spotRatio = Math.max(0.2, Math.min(1, VIEWER_PERF_PROFILE.occlusionSpotRatio));
    const maxSpots = Math.max(1, Math.round(spots.length * spotRatio));
    const spotsToRender = spotRatio >= 1 ? spots : spots.slice(0, maxSpots);

    return {
      isDenseLevel,
      patchProfileLevel,
      spotsToRender,
      minDimension,
      levelBoost: [1, 1.3, 1.75][patchProfileLevel] || 1,
      blurMultiplier: [1, 1, 0.68][patchProfileLevel] || 1,
      blurCap: [14, 14, 11][patchProfileLevel] || 14,
      outerAlphaCap: [0.72, 0.76, 0.8][patchProfileLevel] || 0.72,
      coreAlphaCap: [0.8, 0.84, 0.88][patchProfileLevel] || 0.8,
      coreBoost: [1.7, 1.9, 2.25][patchProfileLevel] || 1.7,
      hardCoreStrengthBase: [0, 0, 0.36][patchProfileLevel] || 0,
      hardCoreRadiusX: [0, 0, 0.3][patchProfileLevel] || 0,
      hardCoreRadiusY: [0, 0, 0.2][patchProfileLevel] || 0,
      coreBlurMultiplier: [0.45, 0.45, 0.28][patchProfileLevel] || 0.45
    };
  }

  function drawOcclusionSpotsToContext(
    drawingContext,
    config,
    imageX,
    imageY,
    imageWidth,
    imageHeight
  ) {
    const radiusBoost = config.radiusBoost || 1;
    const occlusionBlurScale =
      typeof config.occlusionBlurScaleOverride === 'number'
        ? config.occlusionBlurScaleOverride
        : VIEWER_PERF_PROFILE.occlusionBlurScale;
    config.spotsToRender.forEach((spot) => {
      const spotX = imageX + (0.5 + spot.x * 0.5) * imageWidth;
      const spotY = imageY + (0.5 + spot.y * 0.5) * imageHeight;
      const patchSizeMultiplier = config.isDenseLevel ? 2 : 1;
      const spotRadius = spot.r * config.minDimension * 0.3 * patchSizeMultiplier * radiusBoost;
      const stretchX = spot.stretchX || 1;
      const stretchY = spot.stretchY || 1;
      const angle = spot.angle || 0;
      const blurPxRaw =
        spot.blur * (config.minDimension / 900) * config.blurMultiplier * occlusionBlurScale;
      const blurPx = Math.max(0.45, Math.min(config.blurCap, blurPxRaw));
      const outerAlpha = Math.min(config.outerAlphaCap, spot.alpha * config.levelBoost);
      const coreAlpha = Math.min(
        config.coreAlphaCap,
        spot.coreAlpha * config.levelBoost * config.coreBoost
      );

      drawingContext.save();
      drawingContext.translate(spotX, spotY);
      drawingContext.rotate(angle);
      drawingContext.scale(stretchX, stretchY);
      drawingContext.filter = `blur(${blurPx}px)`;

      const outerGradient = drawingContext.createRadialGradient(0, 0, 0, 0, 0, spotRadius);
      outerGradient.addColorStop(0, `rgba(4, 3, 2, ${outerAlpha})`);
      outerGradient.addColorStop(0.55, `rgba(8, 6, 4, ${outerAlpha * 0.82})`);
      outerGradient.addColorStop(1, 'rgba(12, 8, 5, 0)');

      drawingContext.fillStyle = outerGradient;
      drawingContext.beginPath();
      drawingContext.arc(0, 0, spotRadius, 0, 2 * Math.PI);
      drawingContext.fill();

      if (coreAlpha > 0) {
        const coreGradient = drawingContext.createRadialGradient(0, 0, 0, 0, 0, spotRadius * 0.46);
        coreGradient.addColorStop(0, `rgba(0, 0, 0, ${coreAlpha})`);
        coreGradient.addColorStop(0.8, `rgba(6, 4, 2, ${coreAlpha * 0.46})`);
        coreGradient.addColorStop(1, 'rgba(8, 5, 2, 0)');

        drawingContext.fillStyle = coreGradient;
        drawingContext.beginPath();
        drawingContext.arc(0, 0, spotRadius * 0.46, 0, 2 * Math.PI);
        drawingContext.fill();

        drawingContext.filter = `blur(${Math.max(0.1, blurPx * config.coreBlurMultiplier)}px)`;
        drawingContext.fillStyle = `rgba(0, 0, 0, ${Math.min(0.88, coreAlpha * 0.95)})`;
        drawingContext.beginPath();
        drawingContext.ellipse(0, 0, spotRadius * 0.26, spotRadius * 0.16, 0, 0, 2 * Math.PI);
        drawingContext.fill();

        const hardCoreStrength = VIEWER_PERF_PROFILE.isMobileLike
          ? config.hardCoreStrengthBase * 0.55
          : config.hardCoreStrengthBase;
        if (hardCoreStrength > 0) {
          drawingContext.filter = 'none';
          drawingContext.fillStyle = `rgba(0, 0, 0, ${Math.min(
            hardCoreStrength,
            coreAlpha * 1.4
          )})`;
          drawingContext.beginPath();
          drawingContext.ellipse(
            0,
            0,
            spotRadius * config.hardCoreRadiusX,
            spotRadius * config.hardCoreRadiusY,
            0,
            0,
            2 * Math.PI
          );
          drawingContext.fill();
        }
      }

      drawingContext.restore();
    });
  }

  function getMobileOcclusionTexture(level) {
    if (!VIEWER_PERF_PROFILE.isMobileLike || level <= 0) {
      return null;
    }

    if (occlusionTextureCache.has(level)) {
      return occlusionTextureCache.get(level);
    }

    if (typeof document === 'undefined' || typeof document.createElement !== 'function') {
      occlusionTextureCache.set(level, null);
      return null;
    }

    const renderConfig = buildOcclusionRenderConfig(level, MOBILE_OCCLUSION_TEXTURE_SIZE);
    if (!renderConfig) {
      occlusionTextureCache.set(level, null);
      return null;
    }

    const textureCanvas = document.createElement('canvas');
    textureCanvas.width = MOBILE_OCCLUSION_TEXTURE_SIZE;
    textureCanvas.height = MOBILE_OCCLUSION_TEXTURE_SIZE;
    const textureContext = textureCanvas.getContext('2d');
    if (!textureContext) {
      occlusionTextureCache.set(level, null);
      return null;
    }

    textureContext.save();
    textureContext.globalCompositeOperation = 'source-over';
    drawOcclusionSpotsToContext(
      textureContext,
      renderConfig,
      0,
      0,
      MOBILE_OCCLUSION_TEXTURE_SIZE,
      MOBILE_OCCLUSION_TEXTURE_SIZE
    );
    textureContext.filter = 'none';
    textureContext.restore();

    occlusionTextureCache.set(level, textureCanvas);
    return textureCanvas;
  }

  function getMobileCataractLayer(level, cataract) {
    if (
      !VIEWER_PERF_PROFILE.isMobileLike ||
      level <= 0 ||
      canvas.width <= 0 ||
      canvas.height <= 0
    ) {
      return null;
    }

    const cacheKey = `${level}:${canvas.width}x${canvas.height}`;
    if (mobileCataractLayerCache.has(cacheKey)) {
      return mobileCataractLayerCache.get(cacheKey);
    }

    if (typeof document === 'undefined' || typeof document.createElement !== 'function') {
      mobileCataractLayerCache.set(cacheKey, null);
      return null;
    }

    const layerCanvas = document.createElement('canvas');
    layerCanvas.width = canvas.width;
    layerCanvas.height = canvas.height;
    const layerContext = layerCanvas.getContext('2d');
    if (!layerContext) {
      mobileCataractLayerCache.set(cacheKey, null);
      return null;
    }

    if (cataract.yellowTint > 0) {
      layerContext.fillStyle = `rgba(226, 188, 92, ${cataract.yellowTint})`;
      layerContext.fillRect(0, 0, layerCanvas.width, layerCanvas.height);
    }
    if (cataract.darkTint > 0) {
      layerContext.fillStyle = `rgba(35, 24, 5, ${cataract.darkTint})`;
      layerContext.fillRect(0, 0, layerCanvas.width, layerCanvas.height);
    }
    if (cataract.hazeTint > 0) {
      layerContext.fillStyle = `rgba(250, 236, 208, ${cataract.hazeTint})`;
      layerContext.fillRect(0, 0, layerCanvas.width, layerCanvas.height);
    }

    const virtualImageScale = zoomFactor * 1.12;
    const virtualImageWidth = layerCanvas.width * virtualImageScale;
    const virtualImageHeight = layerCanvas.height * virtualImageScale;
    const virtualImageX = (layerCanvas.width - virtualImageWidth) / 2;
    const virtualImageY = (layerCanvas.height - virtualImageHeight) / 2;
    const renderConfig = buildOcclusionRenderConfig(
      level,
      Math.max(1, Math.min(virtualImageWidth, virtualImageHeight))
    );
    if (renderConfig) {
      renderConfig.radiusBoost = 1.08;
      renderConfig.occlusionBlurScaleOverride = 0.92;
      drawOcclusionSpotsToContext(
        layerContext,
        renderConfig,
        virtualImageX,
        virtualImageY,
        virtualImageWidth,
        virtualImageHeight
      );
      layerContext.filter = 'none';
    }

    mobileCataractLayerCache.set(cacheKey, layerCanvas);
    return layerCanvas;
  }

  function drawMobileCataractLayer(level, cataract) {
    const layer = getMobileCataractLayer(level, cataract);
    if (!layer) {
      return;
    }

    ctx.save();
    ctx.globalCompositeOperation = 'source-over';
    ctx.drawImage(layer, 0, 0, canvas.width, canvas.height);
    ctx.restore();
  }

  function drawCataractOcclusions(imageX, imageY, imageWidth, imageHeight, level) {
    const mobileTexture = getMobileOcclusionTexture(level);
    if (mobileTexture) {
      ctx.save();
      ctx.globalCompositeOperation = 'source-over';
      ctx.drawImage(mobileTexture, imageX, imageY, imageWidth, imageHeight);
      ctx.restore();
      return;
    }

    const minDimension = Math.min(imageWidth, imageHeight);
    const renderConfig = buildOcclusionRenderConfig(level, minDimension);
    if (!renderConfig) {
      return;
    }

    ctx.save();
    ctx.globalCompositeOperation = 'source-over';
    drawOcclusionSpotsToContext(ctx, renderConfig, imageX, imageY, imageWidth, imageHeight);
    ctx.filter = 'none';
    ctx.restore();
  }

  function jitter(timestamp) {
    const now =
      typeof timestamp === 'number'
        ? timestamp
        : typeof window !== 'undefined' && window.performance
          ? window.performance.now()
          : Date.now();
    const isMobileCataract = VIEWER_PERF_PROFILE.isMobileLike && state.viewer.cataractLevel > 0;
    const minJitterIntervalMs = isMobileCataract
      ? VIEWER_PERF_PROFILE.cataractJitterIntervalMs
      : VIEWER_PERF_PROFILE.baseJitterIntervalMs;
    if (isMobileCataract && isDragging) {
      jitterAnimationId = requestAnimationFrame(jitter);
      return;
    }
    if (now - lastJitterRenderAt < minJitterIntervalMs) {
      jitterAnimationId = requestAnimationFrame(jitter);
      return;
    }
    lastJitterRenderAt = now;

    const jitterStrength = isMobileCataract ? 0.58 : 1;
    const activeJitterAmplitude =
      jitterAmplitude * timedMotionProfile.jitterMultiplier * jitterStrength;
    const damping = Math.max(0.72, 0.85 - (timedMotionProfile.jitterMultiplier - 1) * 0.04);
    const accelX = (Math.random() - 0.5) * activeJitterAmplitude;
    const accelY = (Math.random() - 0.5) * activeJitterAmplitude;

    velocityX += accelX;
    velocityY += accelY;

    velocityX *= damping;
    velocityY *= damping;

    bgOffsetX += velocityX;
    bgOffsetY += velocityY;

    checkBoundaries();
    requestDraw();

    jitterAnimationId = requestAnimationFrame(jitter);
  }

  function doGazeShift(options = {}) {
    state.viewer.shiftInProgress = true;

    const previousDragging = isDragging;
    const previousVelocityX = velocityX;
    const previousVelocityY = velocityY;

    isDragging = false;
    velocityX = 0;
    velocityY = 0;

    const originalX = bgOffsetX;
    const originalY = bgOffsetY;

    const distanceMultiplier =
      clampNumber(options.distanceMultiplier, 0.25, 4, 1) *
      timedMotionProfile.shiftDistanceMultiplier;
    const shiftDistance = SHIFT_DISTANCE * distanceMultiplier;
    const returnDelayMs = clampNumber(
      options.returnDelayMs,
      TIMED_MOTION_LIMITS.shiftDurationMs.min,
      TIMED_MOTION_LIMITS.shiftDurationMs.max,
      timedMotionProfile.shiftDurationMs
    );

    const angle = Math.random() * 2 * Math.PI;
    bgOffsetX += shiftDistance * Math.cos(angle);
    bgOffsetY += shiftDistance * Math.sin(angle);

    checkBoundaries();
    requestDraw();

    if (shiftTimeoutId !== null) {
      clearTimeout(shiftTimeoutId);
      shiftTimeoutId = null;
    }

    shiftTimeoutId = setTimeout(() => {
      bgOffsetX = originalX;
      bgOffsetY = originalY;

      checkBoundaries();
      requestDraw();

      isDragging = previousDragging;
      velocityX = previousVelocityX;
      velocityY = previousVelocityY;
      state.viewer.shiftInProgress = false;
      shiftTimeoutId = null;
    }, returnDelayMs);
  }

  function startCornealReflexAnimation() {
    if (VIEWER_PERF_PROFILE.isMobileLike) {
      return;
    }

    if (cornealAnimationId !== null) {
      return;
    }

    const animateReflex = () => {
      if (!isDragging) {
        cornealTargetOffset = { x: 0, y: 0 };
      } else {
        cornealTargetOffset = {
          x: (Math.random() - 0.5) * 100,
          y: (Math.random() - 0.5) * 100
        };
      }

      cornealJitterOffset.x += (cornealTargetOffset.x - cornealJitterOffset.x) * 0.1;
      cornealJitterOffset.y += (cornealTargetOffset.y - cornealJitterOffset.y) * 0.1;

      requestDraw();
      cornealAnimationId = requestAnimationFrame(animateReflex);
    };

    animateReflex();
  }

  function stopCornealReflexAnimation() {
    if (cornealAnimationId !== null) {
      cancelAnimationFrame(cornealAnimationId);
      cornealAnimationId = null;
    }

    cornealJitterOffset = { x: 0, y: 0 };
    requestDraw();
  }

  function reCentreEverything() {
    if (!img.naturalWidth || !img.naturalHeight) {
      return;
    }

    const renderScale = Math.max(0.45, Math.min(1, VIEWER_PERF_PROFILE.canvasScale));
    canvas.width = Math.max(1, Math.round(img.naturalWidth * renderScale));
    canvas.height = Math.max(1, Math.round(img.naturalHeight * renderScale));
    ctx.imageSmoothingEnabled = true;
    ctx.imageSmoothingQuality = VIEWER_PERF_PROFILE.isMobileLike ? 'medium' : 'high';

    circleX = canvas.width / 2;
    circleY = canvas.height / 2;

    velocityX = 0;
    velocityY = 0;

    bgOffsetX = 0;
    bgOffsetY = 0;
    mobileCataractLayerCache.clear();

    requestDraw();
  }

  function draw() {
    if (!img.naturalWidth || !img.naturalHeight) {
      return;
    }

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    const geometry = computeDrawGeometry({
      canvasWidth: canvas.width,
      canvasHeight: canvas.height,
      imageNaturalWidth: img.naturalWidth,
      imageNaturalHeight: img.naturalHeight,
      imageScale,
      zoomFactor,
      bgOffsetX,
      bgOffsetY,
      circleRadius,
      circleX,
      isRightEye: state.viewer.isRightEye
    });
    const cataract = cataractPresets[state.viewer.cataractLevel] || cataractPresets[0];

    drawFundusLayer(geometry, cataract);
    drawCornealReflexLayer(geometry, cataract);
    drawWindowRing(geometry);
    drawCanvasEdgeLabels();
  }

  function clipViewingWindow(centerX, centerY, radius) {
    ctx.beginPath();
    ctx.arc(centerX, centerY, radius, 0, 2 * Math.PI, true);
    ctx.closePath();
    ctx.clip();
  }

  function drawFundusLayer(geometry, cataract) {
    ctx.save();

    if (!state.viewer.isRightEye) {
      ctx.translate(canvas.width, 0);
      ctx.scale(-1, 1);
    }

    clipViewingWindow(geometry.flippedCircleX, circleY, geometry.effectiveCircleRadius);

    if (state.viewer.isDiscVisible) {
      const augmentedGeometry = buildTimedAugmentedDrawGeometry(geometry);

      ctx.save();
      applyTimedAugmentationTransform(augmentedGeometry);

      ctx.filter = buildFundusFilter(cataract);
      ctx.drawImage(
        img,
        0,
        0,
        img.naturalWidth,
        img.naturalHeight,
        augmentedGeometry.offsetXPos,
        augmentedGeometry.offsetYPos,
        augmentedGeometry.scaledWidth,
        augmentedGeometry.scaledHeight
      );
      ctx.filter = 'none';
      ctx.restore();

      const isMobileCachedCataract =
        VIEWER_PERF_PROFILE.isMobileLike && state.viewer.cataractLevel > 0;
      if (isMobileCachedCataract) {
        drawMobileCataractLayer(state.viewer.cataractLevel, cataract);
      } else {
        applyCataractOverlays(cataract);

        ctx.save();
        applyTimedAugmentationTransform(augmentedGeometry);
        drawCataractOcclusions(
          augmentedGeometry.offsetXPos,
          augmentedGeometry.offsetYPos,
          augmentedGeometry.scaledWidth,
          augmentedGeometry.scaledHeight,
          state.viewer.cataractLevel
        );
        ctx.restore();
      }
    } else {
      ctx.fillStyle = 'black';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
    }

    ctx.restore();
  }

  function applyCataractOverlays(cataract) {
    if (cataract.yellowTint > 0) {
      ctx.fillStyle = `rgba(226, 188, 92, ${cataract.yellowTint})`;
      ctx.fillRect(0, 0, canvas.width, canvas.height);
    }

    if (cataract.darkTint > 0) {
      ctx.fillStyle = `rgba(35, 24, 5, ${cataract.darkTint})`;
      ctx.fillRect(0, 0, canvas.width, canvas.height);
    }

    if (cataract.hazeTint > 0) {
      ctx.fillStyle = `rgba(250, 236, 208, ${cataract.hazeTint})`;
      ctx.fillRect(0, 0, canvas.width, canvas.height);
    }
  }

  function drawCornealReflexLayer(geometry, cataract) {
    ctx.save();
    clipViewingWindow(circleX, circleY, geometry.effectiveCircleRadius);

    if (state.viewer.isDiscVisible) {
      drawCornealReflex(geometry.effectiveCircleRadius, cataract);
    }

    ctx.restore();
  }

  function drawCornealReflex(effectiveCircleRadius, cataract) {
    const reflexOpacity = computeReflexOpacity({
      cataractLevel: state.viewer.cataractLevel,
      darkTint: cataract.darkTint,
      yellowTint: cataract.yellowTint
    });
    const renderResolutionScale =
      img.naturalHeight > 0 ? Math.max(0.45, Math.min(1, canvas.height / img.naturalHeight)) : 1;
    const reflexBaseRadius = 375 * renderResolutionScale;
    const reflexScaleFactor = 1.3;

    const ellipseWidth = 0.6 * reflexBaseRadius * reflexScaleFactor;
    const ellipseHeight = 0.5 * reflexBaseRadius * reflexScaleFactor;

    const smallerReflexScaleFactor = 0.7;
    const smallerEllipseWidth = ellipseWidth * smallerReflexScaleFactor;
    const smallerEllipseHeight = ellipseHeight * smallerReflexScaleFactor;

    const ellipseCenterX = circleX + cornealJitterOffset.x;
    const ellipseCenterY = circleY + 0.3 * effectiveCircleRadius + cornealJitterOffset.y;

    ctx.save();
    ctx.translate(ellipseCenterX, ellipseCenterY);
    ctx.scale(1, -1);
    ctx.translate(-ellipseCenterX, -ellipseCenterY);

    drawReflexEllipse(
      ellipseCenterX,
      ellipseCenterY,
      ellipseWidth,
      ellipseHeight,
      0.5 * reflexOpacity
    );
    drawReflexEllipse(
      ellipseCenterX,
      ellipseCenterY,
      smallerEllipseWidth,
      smallerEllipseHeight,
      reflexOpacity
    );

    ctx.restore();
  }

  function drawReflexEllipse(centerX, centerY, width, height, alpha) {
    const rx = width / 2;
    const ry = height / 2;
    const flatterRy = ry * 0.6;

    ctx.beginPath();
    ctx.ellipse(centerX, centerY, rx, ry, 0, Math.PI, 2 * Math.PI, false);
    ctx.ellipse(centerX, centerY, rx, flatterRy, 0, 0, Math.PI, false);
    ctx.closePath();
    ctx.fillStyle = `rgba(255,255,255,${alpha})`;
    ctx.fill();
  }

  function drawWindowRing(geometry) {
    const baseLineWidth = 18 * geometry.windowScale * geometry.scaleFactor;

    ctx.save();

    ctx.beginPath();
    ctx.arc(circleX, circleY, geometry.effectiveCircleRadius, 0, 2 * Math.PI, true);
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.24)';
    ctx.lineWidth = baseLineWidth * 2;
    ctx.stroke();

    ctx.beginPath();
    ctx.arc(circleX, circleY, geometry.effectiveCircleRadius, 0, 2 * Math.PI, true);
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.66)';
    ctx.lineWidth = baseLineWidth;
    ctx.stroke();

    ctx.beginPath();
    ctx.arc(circleX, circleY, geometry.effectiveCircleRadius, 0, 2 * Math.PI, true);
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.92)';
    ctx.lineWidth = Math.max(2, baseLineWidth * 0.5);
    ctx.stroke();

    ctx.restore();
  }

  function drawCanvasEdgeLabels() {
    const displayWidth = Math.max(1, canvas.clientWidth || canvas.width);
    const displayHeight = Math.max(1, canvas.clientHeight || canvas.height);
    const canvasScaleX = canvas.width / displayWidth;
    const canvasScaleY = canvas.height / displayHeight;
    const sideOffsetCss = Math.max(10, Math.min(16, displayWidth * 0.02));
    const fontSizeCss = Math.max(10, Math.min(13, displayWidth * 0.011));
    const sideOffset = sideOffsetCss * canvasScaleX;
    const centreY = displayHeight * 0.5 * canvasScaleY;
    const fontSize = fontSizeCss * canvasScaleX;

    ctx.save();
    ctx.fillStyle = 'white';
    ctx.font = `600 ${fontSize}px 'Inter', 'Segoe UI', 'Helvetica Neue', Arial, sans-serif`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';

    if (state.viewer.isRightEye) {
      ctx.save();
      ctx.translate(sideOffset, centreY);
      ctx.rotate(-Math.PI / 2);
      ctx.fillText('Temporal', 0, 0);
      ctx.restore();

      ctx.save();
      ctx.translate(canvas.width - sideOffset, centreY);
      ctx.rotate(Math.PI / 2);
      ctx.fillText('Nasal', 0, 0);
      ctx.restore();
    } else {
      ctx.save();
      ctx.translate(sideOffset, centreY);
      ctx.rotate(-Math.PI / 2);
      ctx.fillText('Nasal', 0, 0);
      ctx.restore();

      ctx.save();
      ctx.translate(canvas.width - sideOffset, centreY);
      ctx.rotate(Math.PI / 2);
      ctx.fillText('Temporal', 0, 0);
      ctx.restore();
    }

    ctx.restore();
  }

  function checkBoundaries() {
    if (!img.naturalWidth || !img.naturalHeight) {
      return;
    }

    const bounds = computeViewerBounds({
      canvasWidth: canvas.width,
      canvasHeight: canvas.height,
      imageNaturalWidth: img.naturalWidth,
      imageNaturalHeight: img.naturalHeight,
      circleRadius,
      zoomFactor
    });

    const clamped = clampCircleToBounds({
      circleX,
      circleY,
      velocityX,
      velocityY,
      bounds
    });

    circleX = clamped.circleX;
    circleY = clamped.circleY;
    velocityX = clamped.velocityX;
    velocityY = clamped.velocityY;
  }

  function ensureUndilated() {
    if (getCurrentFovDegrees() !== 8) {
      setFovDegrees(8);
    }
  }

  function setDilated(isDilated) {
    const nextIsDilated = Boolean(isDilated);
    const currentIsDilated = getCurrentFovDegrees() === 15;
    if (currentIsDilated === nextIsDilated) {
      return;
    }

    setFovDegrees(nextIsDilated ? 15 : 8);
  }

  function getIsDilated() {
    return getCurrentFovDegrees() === 15;
  }

  function setRightEye(isRightEye) {
    const nextIsRightEye = Boolean(isRightEye);
    if (state.viewer.isRightEye === nextIsRightEye) {
      return;
    }

    eyeToggleCheckbox.checked = !nextIsRightEye;
    state.viewer.isRightEye = nextIsRightEye;
    reCentreEverything();
    updateEyeLabels();
  }

  function getIsRightEye() {
    return state.viewer.isRightEye;
  }

  function setCataractLevel(level) {
    const maxIndex = cataractPresets.length - 1;
    const nextLevel = Math.max(0, Math.min(maxIndex, Number(level) || 0));
    if (Number(cataractSlider.value) === nextLevel) {
      return;
    }

    cataractSlider.value = String(nextLevel);
    updateCataractUi();
    requestDraw();
  }

  function getCataractLevel() {
    return Number(cataractSlider.value) || 0;
  }

  function setDiscVisible(visible) {
    state.viewer.isDiscVisible = visible;
    requestDraw();
  }

  function setViewerControlsDisabled(disabled) {
    conditionButtons.forEach((button) => {
      button.disabled = disabled;
    });

    fovToggleCheckbox.disabled = disabled;
    eyeToggleCheckbox.disabled = disabled;
    cataractSlider.disabled = disabled;
  }

  function getActiveConditionImagePath() {
    return state.viewer.conditionImageSrc || defaultImageSrc;
  }

  function destroy() {
    listenerDisposers.splice(0).forEach((dispose) => {
      dispose();
    });

    if (jitterAnimationId !== null) {
      cancelAnimationFrame(jitterAnimationId);
      jitterAnimationId = null;
    }

    if (drawAnimationId !== null) {
      cancelAnimationFrame(drawAnimationId);
      drawAnimationId = null;
    }

    if (cornealAnimationId !== null) {
      cancelAnimationFrame(cornealAnimationId);
      cornealAnimationId = null;
    }

    if (shiftTimeoutId !== null) {
      clearTimeout(shiftTimeoutId);
      shiftTimeoutId = null;
    }

    state.viewer.shiftInProgress = false;
    occlusionTextureCache.clear();
    mobileCataractLayerCache.clear();
  }

  return {
    initialize,
    doGazeShift,
    setDiscVisible,
    setImageSource,
    setViewerControlsDisabled,
    ensureUndilated,
    setDilated,
    getIsDilated,
    setRightEye,
    getIsRightEye,
    setCataractLevel,
    getCataractLevel,
    setTimedAugmentation,
    clearTimedAugmentation,
    setTimedMotionProfile,
    clearTimedMotionProfile,
    setFovDegrees,
    getFovDegrees,
    getActiveConditionImagePath,
    destroy
  };
}
