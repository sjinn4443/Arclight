"use strict";
(() => {
  // src/findings.js?v=20260518-findingdropdown
  var EYE_LABELS = {
    right: "RE",
    left: "LE",
  };
  var MODE_LABELS = {
    "arclight-do": "Arclight (DO)",
    "holo-bio": "Holo (BIO)",
  };
  var AREA_OPTIONS = {
    "arclight-do": [
      {
        value: "posterior-pole",
        label: "Posterior pole",
        shortLabel: "Post pole",
      },
      {
        value: "disc-macula",
        label: "Disc and macula",
        shortLabel: "Disc+mac",
      },
      {
        value: "limited",
        label: "Limited glimpses only",
        shortLabel: "Limited",
      },
    ],
    "holo-bio": [
      {
        value: "posterior-pole",
        label: "Posterior pole",
        shortLabel: "Post pole",
      },
      {
        value: "disc-macula",
        label: "Disc and macula",
        shortLabel: "Disc+mac",
      },
      {
        value: "four-quadrants",
        label: "Four-quadrant sweep",
        shortLabel: "4 quad",
      },
      {
        value: "limited",
        label: "Limited glimpses only",
        shortLabel: "Limited",
      },
    ],
  };
  var VA_OPTIONS = [
    { value: "", label: "" },
    { value: "6/6", label: "6/6" },
    { value: "6/12", label: "6/12" },
    { value: "6/36", label: "6/36" },
    { value: "6/60", label: "6/60" },
    { value: "HM", label: "HM" },
    { value: "unable_test", label: "No test" },
    { value: "fix_follow_good", label: "Fix/follow" },
    { value: "fix_follow_poor", label: "No fix" },
  ];
  var SYSTEMIC_CHECKS = [
    { key: "bp", label: "BP checked", note: "optimise BP" },
    { key: "lipids", label: "Lipids checked", note: "optimise lipids" },
    { key: "hba1c", label: "HbA1c checked", note: "optimise glucose control" },
  ];
  var FINDING_GROUPS = [
    {
      key: "clear",
      title: "No referable signs",
      tone: "neutral",
      findings: [
        {
          key: "noReferableSignsSeen",
          label: "No referable signs seen in view obtained",
          shortLabel: "No signs",
          group: "clear",
          detail:
            "Use only when no referable signs are seen in the view obtained. It does not replace routine diabetic eye screening.",
        },
      ],
    },
    {
      key: "npdr",
      title: "DR signs",
      tone: "green",
      findings: [
        {
          key: "microaneurysms",
          label: "Microaneurysms",
          shortLabel: "MA",
          group: "npdr",
          detail:
            "Tiny red dots, often the earliest visible diabetic retinopathy sign. Mark when small round red lesions are seen.",
        },
        {
          key: "dotBlotHaemorrhages",
          label: "Dot/blot haemorrhages",
          shortLabel: "D/B",
          group: "npdr",
          detail:
            "Intraretinal haemorrhages that look like red dots or blotches. Record when clearly seen away from the disc.",
        },
        {
          key: "cottonWoolSpots",
          label: "Cotton-wool spots",
          shortLabel: "CWS",
          group: "npdr",
          detail:
            "Soft-edged pale white patches from nerve fibre layer ischaemia. They suggest more active retinopathy.",
        },
        {
          key: "venousBeading",
          label: "Venous beading",
          shortLabel: "VB",
          group: "npdr",
          detail:
            "Irregular venous calibre or beading. This is a more severe ischaemic diabetic retinopathy sign.",
        },
      ],
    },
    {
      key: "macula",
      title: "Macula risk",
      tone: "orange",
      findings: [
        {
          key: "maculaHardExudates",
          label: "Hard exudates near macula",
          shortLabel: "Macula HE",
          group: "macula",
          detail:
            "Yellow hard exudates close to the macula. Circinate exudates or exudates near fixation are macula risk.",
        },
        {
          key: "fovealRisk",
          label: "Possible foveal involvement",
          shortLabel: "Fovea risk",
          group: "macula",
          detail:
            "Use when signs may involve the fovea, or reduced VA fits possible macular involvement. This needs prompt eye review.",
        },
      ],
    },
    {
      key: "pdr",
      title: "Proliferative signs",
      tone: "red",
      findings: [
        {
          key: "nvd",
          label: "New vessels at disc",
          shortLabel: "NVD",
          group: "pdr",
          detail:
            "Fine new vessels on or within one disc diameter of the disc. Treat as proliferative diabetic retinopathy.",
        },
        {
          key: "nve",
          label: "New vessels elsewhere",
          shortLabel: "NVE",
          group: "pdr",
          detail:
            "Fine new vessels away from the disc, often at vascular arcades or an ischaemic border. Treat as proliferative diabetic retinopathy.",
        },
        {
          key: "preretinalHaemorrhage",
          label: "Preretinal haemorrhage",
          shortLabel: "PR-H",
          group: "pdr",
          detail:
            "Superficial or boat-shaped blood in front of the retina. This is an urgent proliferative sign.",
        },
        {
          key: "vitreousHaemorrhage",
          label: "Vitreous haemorrhage",
          shortLabel: "Vit H",
          group: "pdr",
          detail:
            "Blood or dark haze in the vitreous with reduced retinal view. Treat as urgent until specialist assessment.",
        },
      ],
    },
  ];
  var FINDINGS = FINDING_GROUPS.flatMap((group) => group.findings);
  var FINDING_MAP = Object.fromEntries(
    FINDINGS.map((finding) => [finding.key, finding]),
  );
  var FINDING_KEYS = FINDINGS.map((finding) => finding.key);
  var LESION_FINDING_KEYS = FINDING_KEYS.filter(
    (key) => key !== "noReferableSignsSeen",
  );
  var NPDR_KEYS = FINDINGS.filter((finding) => finding.group === "npdr").map(
    (finding) => finding.key,
  );
  var MACULA_KEYS = FINDINGS.filter(
    (finding) => finding.group === "macula",
  ).map((finding) => finding.key);
  var PDR_KEYS = FINDINGS.filter((finding) => finding.group === "pdr").map(
    (finding) => finding.key,
  );
  function createEmptyFindings() {
    return Object.fromEntries(FINDING_KEYS.map((key) => [key, false]));
  }
  function getFindingLabels(findings) {
    return FINDINGS.filter((finding) => Boolean(findings[finding.key])).map(
      (finding) => finding.label,
    );
  }
  function getAreaLabel(mode, value) {
    var _a, _b;
    return (
      ((_b =
        (_a = AREA_OPTIONS[mode]) == null
          ? void 0
          : _a.find((option) => option.value === value)) == null
        ? void 0
        : _b.label) || "Not recorded"
    );
  }
  function getVaLabel(value) {
    var _a;
    return (
      ((_a = VA_OPTIONS.find((option) => option.value === value)) == null
        ? void 0
        : _a.label) || "Not recorded"
    );
  }

  // src/viewer-math.js
  function computeDrawGeometry({
    canvasWidth,
    canvasHeight,
    imageNaturalWidth,
    imageNaturalHeight,
    imageScale,
    zoomFactor,
    bgOffsetX,
    bgOffsetY,
    circleRadius,
    circleX,
    isRightEye,
  }) {
    const scaleFactor = canvasHeight / imageNaturalHeight;
    const drawnImageWidth = imageNaturalWidth * scaleFactor;
    const drawnImageHeight = canvasHeight;
    const imageDrawOffsetX = (canvasWidth - drawnImageWidth) / 2;
    const imageDrawOffsetY = 0;
    const backgroundScale = imageScale * zoomFactor;
    const scaledWidth = drawnImageWidth * backgroundScale;
    const scaledHeight = drawnImageHeight * backgroundScale;
    const offsetXPos =
      imageDrawOffsetX + (drawnImageWidth - scaledWidth) / 2 + bgOffsetX;
    const offsetYPos =
      imageDrawOffsetY + (drawnImageHeight - scaledHeight) / 2 + bgOffsetY;
    const windowScale = zoomFactor;
    const effectiveCircleRadius = circleRadius * windowScale * scaleFactor;
    const flippedCircleX = isRightEye ? circleX : canvasWidth - circleX;
    return {
      scaleFactor,
      drawnImageWidth,
      imageDrawOffsetX,
      scaledWidth,
      scaledHeight,
      offsetXPos,
      offsetYPos,
      windowScale,
      effectiveCircleRadius,
      flippedCircleX,
    };
  }
  function normaliseBoundsAxis(min, max) {
    if (min <= max) {
      return { min, max };
    }
    const centre = (min + max) / 2;
    return { min: centre, max: centre };
  }
  function computeViewerBounds({
    canvasWidth,
    canvasHeight,
    imageNaturalWidth,
    imageNaturalHeight,
    imageScale = 1,
    circleRadius,
    zoomFactor,
  }) {
    const scaleFactor = canvasHeight / imageNaturalHeight;
    const drawnImageWidth = imageNaturalWidth * scaleFactor;
    const imageDrawOffsetX = (canvasWidth - drawnImageWidth) / 2;
    const imageDrawOffsetY = 0;
    const backgroundScale = imageScale * zoomFactor;
    const scaledWidth = drawnImageWidth * backgroundScale;
    const scaledHeight = canvasHeight * backgroundScale;
    const offsetXPos = imageDrawOffsetX + (drawnImageWidth - scaledWidth) / 2;
    const offsetYPos = imageDrawOffsetY + (canvasHeight - scaledHeight) / 2;
    const effectiveCircleRadius = circleRadius * zoomFactor * scaleFactor;
    const minX = offsetXPos + effectiveCircleRadius;
    const maxX = offsetXPos + scaledWidth - effectiveCircleRadius;
    const minY = offsetYPos + effectiveCircleRadius;
    const maxY = offsetYPos + scaledHeight - effectiveCircleRadius;
    const xBounds = normaliseBoundsAxis(minX, maxX);
    const yBounds = normaliseBoundsAxis(minY, maxY);
    return {
      minX: xBounds.min,
      maxX: xBounds.max,
      minY: yBounds.min,
      maxY: yBounds.max,
    };
  }
  function clampCircleToBounds({
    circleX,
    circleY,
    velocityX,
    velocityY,
    bounds,
  }) {
    let nextX = circleX;
    let nextY = circleY;
    let nextVelocityX = velocityX;
    let nextVelocityY = velocityY;
    if (nextX < bounds.minX) {
      nextX = bounds.minX;
      nextVelocityX *= -0.5;
    }
    if (nextX > bounds.maxX) {
      nextX = bounds.maxX;
      nextVelocityX *= -0.5;
    }
    if (nextY < bounds.minY) {
      nextY = bounds.minY;
      nextVelocityY *= -0.5;
    }
    if (nextY > bounds.maxY) {
      nextY = bounds.maxY;
      nextVelocityY *= -0.5;
    }
    return {
      circleX: nextX,
      circleY: nextY,
      velocityX: nextVelocityX,
      velocityY: nextVelocityY,
    };
  }
  function computeReflexOpacity({ cataractLevel, darkTint, yellowTint }) {
    const minimumOpacity = cataractLevel === 3 ? 0.3 : 0.55;
    const tintAdjustedOpacity = 1 - darkTint * 2.8 - yellowTint * 1.2;
    return Math.max(minimumOpacity, tintAdjustedOpacity);
  }

  // src/viewer.js?v=20260519-viewer
  var TIMED_AUGMENTATION_DEFAULTS = Object.freeze({
    rotateDegrees: 0,
    scale: 1,
    panXRatio: 0,
    panYRatio: 0,
    brightness: 1,
    contrast: 1,
    saturation: 1,
    flipVertical: false,
  });
  var TIMED_AUGMENTATION_LIMITS = Object.freeze({
    rotateDegrees: { min: -7, max: 7 },
    scale: { min: 0.85, max: 1.2 },
    panRatio: { min: -0.08, max: 0.08 },
    brightness: { min: 0.78, max: 1.22 },
    contrast: { min: 0.78, max: 1.22 },
    saturation: { min: 0.78, max: 1.22 },
  });
  var TIMED_MOTION_DEFAULTS = Object.freeze({
    jitterMultiplier: 1,
    shiftDistanceMultiplier: 1,
    shiftDurationMs: 600,
  });
  var TIMED_MOTION_LIMITS = Object.freeze({
    jitterMultiplier: { min: 1, max: 4 },
    shiftDistanceMultiplier: { min: 1, max: 3.2 },
    shiftDurationMs: { min: 250, max: 2500 },
  });
  var NYSTAGMUS_DIRECTIONS = Object.freeze(["horizontal", "vertical", "mixed"]);
  var NYSTAGMUS_RATES = Object.freeze({
    slow: 1.05,
    med: 1.75,
    fast: 2.45,
  });
  var NYSTAGMUS_DEFAULTS = Object.freeze({
    enabled: false,
    direction: "horizontal",
    rate: "slow",
  });
  function buildViewerPerfProfile() {
    const hasWindow = typeof window !== "undefined";
    const hasCoarsePointer =
      hasWindow && typeof window.matchMedia === "function"
        ? window.matchMedia("(pointer: coarse)").matches
        : false;
    const viewportEdge = hasWindow
      ? Math.max(window.innerWidth || 0, window.innerHeight || 0)
      : 0;
    const isMobileLike = hasCoarsePointer || viewportEdge <= 1100;
    return {
      isMobileLike,
      canvasScale: isMobileLike ? 0.5 : 1,
      cataractBlurScale: isMobileLike ? 0.42 : 1,
      occlusionSpotRatio: isMobileLike ? 1 : 1,
      occlusionBlurScale: isMobileLike ? 0.45 : 1,
      baseJitterIntervalMs: isMobileLike ? 24 : 16,
      cataractJitterIntervalMs: isMobileLike ? 72 : 16,
    };
  }
  function extractImageFilename(path) {
    if (typeof path !== "string" || path.length === 0) {
      return "";
    }
    const withoutQuery = path.split("?")[0];
    return withoutQuery.split("/").pop() || "";
  }
  function getJpegFallbackPath(path) {
    return null;
  }
  function resolvePreferredImagePath(path, shouldFallbackFromWebp) {
    if (typeof path !== "string") {
      return "";
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
    const candidate =
      augmentation && typeof augmentation === "object" ? augmentation : {};
    return {
      rotateDegrees: clampNumber(
        candidate.rotateDegrees,
        TIMED_AUGMENTATION_LIMITS.rotateDegrees.min,
        TIMED_AUGMENTATION_LIMITS.rotateDegrees.max,
        TIMED_AUGMENTATION_DEFAULTS.rotateDegrees,
      ),
      scale: clampNumber(
        candidate.scale,
        TIMED_AUGMENTATION_LIMITS.scale.min,
        TIMED_AUGMENTATION_LIMITS.scale.max,
        TIMED_AUGMENTATION_DEFAULTS.scale,
      ),
      panXRatio: clampNumber(
        candidate.panXRatio,
        TIMED_AUGMENTATION_LIMITS.panRatio.min,
        TIMED_AUGMENTATION_LIMITS.panRatio.max,
        TIMED_AUGMENTATION_DEFAULTS.panXRatio,
      ),
      panYRatio: clampNumber(
        candidate.panYRatio,
        TIMED_AUGMENTATION_LIMITS.panRatio.min,
        TIMED_AUGMENTATION_LIMITS.panRatio.max,
        TIMED_AUGMENTATION_DEFAULTS.panYRatio,
      ),
      brightness: clampNumber(
        candidate.brightness,
        TIMED_AUGMENTATION_LIMITS.brightness.min,
        TIMED_AUGMENTATION_LIMITS.brightness.max,
        TIMED_AUGMENTATION_DEFAULTS.brightness,
      ),
      contrast: clampNumber(
        candidate.contrast,
        TIMED_AUGMENTATION_LIMITS.contrast.min,
        TIMED_AUGMENTATION_LIMITS.contrast.max,
        TIMED_AUGMENTATION_DEFAULTS.contrast,
      ),
      saturation: clampNumber(
        candidate.saturation,
        TIMED_AUGMENTATION_LIMITS.saturation.min,
        TIMED_AUGMENTATION_LIMITS.saturation.max,
        TIMED_AUGMENTATION_DEFAULTS.saturation,
      ),
      flipVertical: Boolean(candidate.flipVertical),
    };
  }
  function normalizeTimedMotionProfile(profile) {
    const candidate = profile && typeof profile === "object" ? profile : {};
    return {
      jitterMultiplier: clampNumber(
        candidate.jitterMultiplier,
        TIMED_MOTION_LIMITS.jitterMultiplier.min,
        TIMED_MOTION_LIMITS.jitterMultiplier.max,
        TIMED_MOTION_DEFAULTS.jitterMultiplier,
      ),
      shiftDistanceMultiplier: clampNumber(
        candidate.shiftDistanceMultiplier,
        TIMED_MOTION_LIMITS.shiftDistanceMultiplier.min,
        TIMED_MOTION_LIMITS.shiftDistanceMultiplier.max,
        TIMED_MOTION_DEFAULTS.shiftDistanceMultiplier,
      ),
      shiftDurationMs: clampNumber(
        candidate.shiftDurationMs,
        TIMED_MOTION_LIMITS.shiftDurationMs.min,
        TIMED_MOTION_LIMITS.shiftDurationMs.max,
        TIMED_MOTION_DEFAULTS.shiftDurationMs,
      ),
    };
  }
  function createViewer({
    state: state2,
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
    cataractOcclusionSpots,
    onDilationChange = null,
    onViewerCaseChange = null,
  }) {
    const ctx = canvas.getContext("2d");
    const initialDegree = 5;
    const initialRadius = 80;
    const VIEWER_MODE_CONFIGS = Object.freeze({
      "arclight-do": Object.freeze({
        levels: Object.freeze([4, 8, 15]),
        defaultIndex: 1,
        undilatedDegrees: 8,
        dilatedDegrees: 15,
        showCornealReflex: true,
        backgroundImageScale: 1,
        labels: Object.freeze({
          4: "Small (4\xB0)",
          8: "Normal (8\xB0)",
          15: "Dilated (15\xB0)",
        }),
      }),
      "holo-bio": Object.freeze({
        levels: Object.freeze([15, 25]),
        defaultIndex: 0,
        undilatedDegrees: 15,
        dilatedDegrees: 25,
        showCornealReflex: false,
        backgroundImageScale: 0.72,
        labels: Object.freeze({
          15: "Undilated (15\xB0)",
          25: "Dilated (25\xB0)",
        }),
      }),
    });
    const DEFAULT_VIEWER_MODE = "arclight-do";
    let circleRadius = (8 / 5) * initialRadius;
    let viewerMode = DEFAULT_VIEWER_MODE;
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
    let bioEdgeReflectionEnergy = 0;
    let bioEdgeReflectionAngle = 0;
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
    let nystagmusAnimationId = null;
    let nystagmusOffset = { x: 0, y: 0 };
    let nystagmusStartedAt = 0;
    const jitterAmplitude = 2;
    const occlusionTextureCache = /* @__PURE__ */ new Map();
    const mobileCataractLayerCache = /* @__PURE__ */ new Map();
    const bioRimLayerCache = /* @__PURE__ */ new Map();
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
      const fallbackPath = getJpegFallbackPath(state2.viewer.activeImageSrc);
      if (!fallbackPath || fallbackPath === state2.viewer.activeImageSrc) {
        return;
      }
      shouldFallbackFromWebp = true;
      if (state2.viewer.conditionImageSrc === state2.viewer.activeImageSrc) {
        state2.viewer.conditionImageSrc = fallbackPath;
      }
      state2.viewer.activeImageSrc = fallbackPath;
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
          VIEWER_PERF_PROFILE.isMobileLike && state2.viewer.cataractLevel > 0
            ? 34
            : 0;
        const now =
          typeof timestamp === "number"
            ? timestamp
            : typeof window !== "undefined" && window.performance
              ? window.performance.now()
              : Date.now();
        if (
          minDrawIntervalMs > 0 &&
          now - lastDrawRenderAt < minDrawIntervalMs
        ) {
          requestDraw();
          return;
        }
        lastDrawRenderAt = now;
        draw();
      });
    }
    function activateBioEdgeReflection(deltaX, deltaY, strength = 0.25) {
      if (viewerMode !== "holo-bio") {
        return;
      }
      const movement = Math.hypot(deltaX, deltaY);
      if (movement > 0.5) {
        bioEdgeReflectionAngle = Math.atan2(deltaY, deltaX);
      }
      const movementStrength = Math.min(1, movement / 70);
      const targetEnergy = Math.min(
        1,
        strength * 0.35 + movementStrength * 0.8,
      );
      bioEdgeReflectionEnergy = Math.max(
        bioEdgeReflectionEnergy * 0.7,
        targetEnergy,
      );
    }
    function decayBioEdgeReflection() {
      if (bioEdgeReflectionEnergy <= 0) {
        return;
      }
      bioEdgeReflectionEnergy *= state2.viewer.shiftInProgress ? 0.9 : 0.84;
      if (bioEdgeReflectionEnergy < 0.025) {
        bioEdgeReflectionEnergy = 0;
      }
    }
    function initialize() {
      var _a;
      const defaultCondition =
        ((_a = conditionButtons[0]) == null
          ? void 0
          : _a.getAttribute("data-condition")) ||
        state2.viewer.activeCondition ||
        "normal";
      state2.viewer.activeImageSrc = defaultImageSrc;
      state2.viewer.conditionImageSrc = defaultImageSrc;
      state2.viewer.activeCondition = defaultCondition;
      state2.viewer.isRightEye = true;
      state2.viewer.isDiscVisible = true;
      state2.viewer.cataractLevel = 0;
      state2.viewer.nystagmusEnabled = Boolean(state2.viewer.nystagmusEnabled);
      state2.viewer.nystagmusDirection = normalizeNystagmusDirection(
        state2.viewer.nystagmusDirection,
      );
      state2.viewer.nystagmusRate = normalizeNystagmusRate(
        state2.viewer.nystagmusRate,
      );
      state2.viewer.shiftInProgress = false;
      viewerMode = state2.mode || DEFAULT_VIEWER_MODE;
      timedAugmentation = { ...TIMED_AUGMENTATION_DEFAULTS };
      timedMotionProfile = { ...TIMED_MOTION_DEFAULTS };
      syncFovRange();
      fovToggleCheckbox.value = String(getCurrentFovConfig().defaultIndex);
      circleRadius = fovDegreesToCircleRadius(getCurrentFovDegrees());
      updateConditionButtonState(defaultCondition);
      setExplanation(defaultCondition);
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
      addDomListener(fovToggleCheckbox, "input", onFovChange);
      addDomListener(fovToggleCheckbox, "change", onFovChange);
      const onEyeChange = () => {
        state2.viewer.isRightEye = !eyeToggleCheckbox.checked;
        reCentreEverything();
        updateEyeLabels();
      };
      addDomListener(eyeToggleCheckbox, "change", onEyeChange);
      const onCataractInput = () => {
        state2.viewer.cataractLevel = Number(cataractSlider.value);
        updateCataractUi();
        requestDraw();
      };
      addDomListener(cataractSlider, "input", onCataractInput);
      conditionButtons.forEach((button) => {
        const onConditionClick = () => {
          if (button.disabled) {
            return;
          }
          const condition = button.getAttribute("data-condition") || "normal";
          const imagePath =
            button.getAttribute("data-image") || defaultImageSrc;
          updateConditionButtonState(condition);
          state2.viewer.activeCondition = condition;
          state2.viewer.conditionImageSrc = imagePath;
          state2.viewer.isDiscVisible = true;
          setImageSource(imagePath);
          setExplanation(condition);
          onViewerCaseChange == null
            ? void 0
            : onViewerCaseChange({ condition, imagePath });
        };
        addDomListener(button, "click", onConditionClick);
      });
    }
    function updateConditionButtonState(activeCondition) {
      conditionButtons.forEach((button) => {
        const condition = button.getAttribute("data-condition") || "normal";
        const isActive = condition === activeCondition;
        button.classList.toggle("active", isActive);
        button.setAttribute("aria-pressed", isActive ? "true" : "false");
      });
    }
    function setupCanvasPointerEvents() {
      addDomListener(canvas, "pointerdown", handlePointerDown);
      addDomListener(canvas, "pointermove", handlePointerMove);
      addDomListener(canvas, "pointerup", stopDragging);
      addDomListener(canvas, "pointercancel", stopDragging);
      const onPointerLeave = (event) => {
        if (event.pointerType === "mouse") {
          stopDragging(event);
        }
      };
      addDomListener(canvas, "pointerleave", onPointerLeave);
      addDomListener(window, "pointerup", stopDragging);
      if (typeof document !== "undefined") {
        addDomListener(document, "visibilitychange", handleVisibilityChange);
      }
    }
    function handleVisibilityChange() {
      if (typeof document === "undefined") {
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
      if (event.button !== void 0 && event.button !== 0) {
        return;
      }
      isDragging = true;
      activePointerId = event.pointerId;
      velocityX = 0;
      velocityY = 0;
      canvas.setPointerCapture(event.pointerId);
      canvas.style.cursor = "none";
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
      if (
        typeof event.pointerId === "number" &&
        event.pointerId !== activePointerId
      ) {
        return;
      }
      if (
        typeof event.pointerId === "number" &&
        canvas.hasPointerCapture(event.pointerId)
      ) {
        canvas.releasePointerCapture(event.pointerId);
      }
      isDragging = false;
      activePointerId = null;
      canvas.style.cursor = "crosshair";
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
      const dragAnchorExtraOffset = Math.max(
        18,
        Math.min(64, dragAnchorRadius * 0.12),
      );
      const previousCircleX = circleX;
      const previousCircleY = circleY;
      circleX = pointerX;
      circleY = pointerY - dragAnchorRadius - dragAnchorExtraOffset;
      activateBioEdgeReflection(
        circleX - previousCircleX,
        circleY - previousCircleY,
        0.55,
      );
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
      state2.viewer.activeImageSrc = nextPath;
      const loadedImageName = extractImageFilename(img.src);
      const requestedImageName = extractImageFilename(nextPath);
      if (img.complete && loadedImageName === requestedImageName) {
        reCentreEverything();
        return;
      }
      img.src = nextPath;
    }
    function setViewerCase2({
      condition,
      imagePath,
      imageScale: nextImageScaleRaw,
    } = {}) {
      const nextCondition =
        condition || state2.viewer.activeCondition || "normal";
      const nextImagePath = imagePath || defaultImageSrc;
      const nextImageScale = Number(nextImageScaleRaw);
      updateConditionButtonState(nextCondition);
      state2.viewer.activeCondition = nextCondition;
      state2.viewer.conditionImageSrc = nextImagePath;
      state2.viewer.caseImageScale =
        Number.isFinite(nextImageScale) && nextImageScale > 0
          ? nextImageScale
          : 1;
      state2.viewer.isDiscVisible = true;
      setImageSource(nextImagePath);
      setExplanation(nextCondition);
      onViewerCaseChange == null
        ? void 0
        : onViewerCaseChange({
            condition: nextCondition,
            imagePath: nextImagePath,
            imageScale: state2.viewer.caseImageScale,
          });
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
        centreY: offsetYPos + geometry.scaledHeight / 2,
      };
    }
    function applyTimedAugmentationTransform(augmentedGeometry) {
      const rotationRadians = (timedAugmentation.rotateDegrees * Math.PI) / 180;
      const isVerticalFlip = timedAugmentation.flipVertical === true;
      if (
        rotationRadians === 0 &&
        timedAugmentation.scale === 1 &&
        !isVerticalFlip
      ) {
        return;
      }
      ctx.translate(augmentedGeometry.centreX, augmentedGeometry.centreY);
      if (rotationRadians !== 0) {
        ctx.rotate(rotationRadians);
      }
      if (timedAugmentation.scale !== 1 || isVerticalFlip) {
        const yScale = isVerticalFlip
          ? timedAugmentation.scale * -1
          : timedAugmentation.scale;
        ctx.scale(timedAugmentation.scale, yScale);
      }
      ctx.translate(-augmentedGeometry.centreX, -augmentedGeometry.centreY);
    }
    function buildFundusFilter(cataract) {
      const isMobileCataract =
        VIEWER_PERF_PROFILE.isMobileLike && state2.viewer.cataractLevel > 0;
      const blurScale = isMobileCataract
        ? VIEWER_PERF_PROFILE.cataractBlurScale
        : 1;
      const blurPx = Math.max(
        0,
        Math.min(isMobileCataract ? 0.25 : 6, cataract.blurPx * blurScale),
      );
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
      if (!explanation) {
        return;
      }
      explanation.innerHTML =
        explanationTemplates[condition] || explanationTemplates.normal;
    }
    function getCurrentFovConfig() {
      return (
        VIEWER_MODE_CONFIGS[viewerMode] ||
        VIEWER_MODE_CONFIGS[DEFAULT_VIEWER_MODE]
      );
    }
    function syncFovRange() {
      const levels = getCurrentFovConfig().levels;
      fovToggleCheckbox.min = "0";
      fovToggleCheckbox.max = String(Math.max(0, levels.length - 1));
      fovToggleCheckbox.step = "1";
    }
    function getDilatedFovDegrees() {
      return getCurrentFovConfig().dilatedDegrees;
    }
    function getUndilatedFovDegrees() {
      return getCurrentFovConfig().undilatedDegrees;
    }
    function getBackgroundImageScale() {
      const caseScale = Number.isFinite(state2.viewer.caseImageScale)
        ? state2.viewer.caseImageScale
        : 1;
      return (
        imageScale *
        caseScale *
        (getCurrentFovConfig().backgroundImageScale || 1)
      );
    }
    function normalizeNystagmusDirection(direction) {
      return NYSTAGMUS_DIRECTIONS.includes(direction)
        ? direction
        : NYSTAGMUS_DEFAULTS.direction;
    }
    function normalizeNystagmusRate(rate) {
      return Object.prototype.hasOwnProperty.call(NYSTAGMUS_RATES, rate)
        ? rate
        : NYSTAGMUS_DEFAULTS.rate;
    }
    function updateFovLabels() {
      const fovIndex = getCurrentFovIndex();
      const levels = getCurrentFovConfig().levels;
      if (fovLabelSmall) {
        fovLabelSmall.classList.toggle("active", fovIndex === 0);
        fovLabelSmall.textContent = levels.length > 2 ? "Small" : "";
      }
      fovLabelLeft.textContent = levels.length > 2 ? "Norm" : "Undilated";
      fovLabelRight.textContent = "Dilated";
      fovLabelLeft.classList.toggle(
        "active",
        levels.length > 2 ? fovIndex === 1 : fovIndex === 0,
      );
      fovLabelRight.classList.toggle(
        "active",
        levels.length > 2 ? fovIndex === 2 : fovIndex === 1,
      );
      fovToggleCheckbox.setAttribute(
        "aria-valuetext",
        `${getCurrentFovDegrees()} degrees`,
      );
      updateViewSummary();
    }
    function normalizeFovIndex(index) {
      const levels = getCurrentFovConfig().levels;
      const numericIndex = Number(index);
      if (!Number.isFinite(numericIndex)) {
        return getCurrentFovConfig().defaultIndex;
      }
      return Math.max(0, Math.min(levels.length - 1, Math.round(numericIndex)));
    }
    function getCurrentFovIndex() {
      return normalizeFovIndex(fovToggleCheckbox.value);
    }
    function getCurrentFovDegrees() {
      const config = getCurrentFovConfig();
      return config.levels[getCurrentFovIndex()] || config.undilatedDegrees;
    }
    function resolveClosestFovIndex(degrees) {
      const numericDegrees = Number(degrees);
      if (!Number.isFinite(numericDegrees)) {
        return getCurrentFovConfig().defaultIndex;
      }
      let closestIndex = getCurrentFovConfig().defaultIndex;
      let smallestDistance = Infinity;
      getCurrentFovConfig().levels.forEach((candidateDegrees, index) => {
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
      const nextFov =
        getCurrentFovConfig().levels[normalizedIndex] ||
        getUndilatedFovDegrees();
      fovToggleCheckbox.value = String(normalizedIndex);
      circleRadius = fovDegreesToCircleRadius(nextFov);
      checkBoundaries();
      requestDraw();
      updateFovLabels();
      onDilationChange == null
        ? void 0
        : onDilationChange(getIsDilated(), getCurrentFovDegrees());
    }
    function setFovDegrees(degrees) {
      applyFovIndex(resolveClosestFovIndex(degrees));
    }
    function getFovDegrees() {
      return getCurrentFovDegrees();
    }
    function updateEyeLabels() {
      eyeLabelRight.classList.toggle("active", state2.viewer.isRightEye);
      eyeLabelLeft.classList.toggle("active", !state2.viewer.isRightEye);
      updateViewSummary();
    }
    function updateCataractUi() {
      const maxIndex = cataractPresets.length - 1;
      const clampedLevel = Math.max(
        0,
        Math.min(maxIndex, Number(cataractSlider.value) || 0),
      );
      state2.viewer.cataractLevel = clampedLevel;
      cataractSlider.value = String(clampedLevel);
      const preset = cataractPresets[state2.viewer.cataractLevel];
      cataractSlider.setAttribute("aria-valuetext", preset.label);
      cataractStops.forEach((stop, index) => {
        stop.classList.toggle("active", index === clampedLevel);
      });
      updateViewSummary();
    }
    function updateViewSummary() {
      if (!viewSummary) {
        return;
      }
      const eyeText = state2.viewer.isRightEye ? "RE" : "LE";
      const fovDegrees = getCurrentFovDegrees();
      const fovText =
        getCurrentFovConfig().labels[fovDegrees] || `${fovDegrees} degrees`;
      const cataractPreset =
        cataractPresets[state2.viewer.cataractLevel] || cataractPresets[0];
      const cataractText =
        cataractPreset.label === "None" ? "No cataract" : cataractPreset.label;
      const summaryText = `${eyeText} - ${fovText} - ${cataractText}`;
      viewSummary.textContent = summaryText;
      viewSummary.setAttribute(
        "aria-label",
        `Current viewing setup: ${summaryText}`,
      );
    }
    function buildOcclusionRenderConfig(level, minDimension) {
      const isDenseLevel = level === 3;
      const patchProfileLevel = level === 3 ? 2 : level;
      const spots = cataractOcclusionSpots[patchProfileLevel];
      if (!spots || spots.length === 0) {
        return null;
      }
      const spotRatio = Math.max(
        0.2,
        Math.min(1, VIEWER_PERF_PROFILE.occlusionSpotRatio),
      );
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
        coreBlurMultiplier: [0.45, 0.45, 0.28][patchProfileLevel] || 0.45,
      };
    }
    function drawOcclusionSpotsToContext(
      drawingContext,
      config,
      imageX,
      imageY,
      imageWidth,
      imageHeight,
    ) {
      const radiusBoost = config.radiusBoost || 1;
      const occlusionBlurScale =
        typeof config.occlusionBlurScaleOverride === "number"
          ? config.occlusionBlurScaleOverride
          : VIEWER_PERF_PROFILE.occlusionBlurScale;
      config.spotsToRender.forEach((spot) => {
        const spotX = imageX + (0.5 + spot.x * 0.5) * imageWidth;
        const spotY = imageY + (0.5 + spot.y * 0.5) * imageHeight;
        const patchSizeMultiplier = config.isDenseLevel ? 2 : 1;
        const spotRadius =
          spot.r *
          config.minDimension *
          0.3 *
          patchSizeMultiplier *
          radiusBoost;
        const stretchX = spot.stretchX || 1;
        const stretchY = spot.stretchY || 1;
        const angle = spot.angle || 0;
        const blurPxRaw =
          spot.blur *
          (config.minDimension / 900) *
          config.blurMultiplier *
          occlusionBlurScale;
        const blurPx = Math.max(0.45, Math.min(config.blurCap, blurPxRaw));
        const outerAlpha = Math.min(
          config.outerAlphaCap,
          spot.alpha * config.levelBoost,
        );
        const coreAlpha = Math.min(
          config.coreAlphaCap,
          spot.coreAlpha * config.levelBoost * config.coreBoost,
        );
        drawingContext.save();
        drawingContext.translate(spotX, spotY);
        drawingContext.rotate(angle);
        drawingContext.scale(stretchX, stretchY);
        drawingContext.filter = `blur(${blurPx}px)`;
        const outerGradient = drawingContext.createRadialGradient(
          0,
          0,
          0,
          0,
          0,
          spotRadius,
        );
        outerGradient.addColorStop(0, `rgba(4, 3, 2, ${outerAlpha})`);
        outerGradient.addColorStop(0.55, `rgba(8, 6, 4, ${outerAlpha * 0.82})`);
        outerGradient.addColorStop(1, "rgba(12, 8, 5, 0)");
        drawingContext.fillStyle = outerGradient;
        drawingContext.beginPath();
        drawingContext.arc(0, 0, spotRadius, 0, 2 * Math.PI);
        drawingContext.fill();
        if (coreAlpha > 0) {
          const coreGradient = drawingContext.createRadialGradient(
            0,
            0,
            0,
            0,
            0,
            spotRadius * 0.46,
          );
          coreGradient.addColorStop(0, `rgba(0, 0, 0, ${coreAlpha})`);
          coreGradient.addColorStop(0.8, `rgba(6, 4, 2, ${coreAlpha * 0.46})`);
          coreGradient.addColorStop(1, "rgba(8, 5, 2, 0)");
          drawingContext.fillStyle = coreGradient;
          drawingContext.beginPath();
          drawingContext.arc(0, 0, spotRadius * 0.46, 0, 2 * Math.PI);
          drawingContext.fill();
          drawingContext.filter = `blur(${Math.max(0.1, blurPx * config.coreBlurMultiplier)}px)`;
          drawingContext.fillStyle = `rgba(0, 0, 0, ${Math.min(0.88, coreAlpha * 0.95)})`;
          drawingContext.beginPath();
          drawingContext.ellipse(
            0,
            0,
            spotRadius * 0.26,
            spotRadius * 0.16,
            0,
            0,
            2 * Math.PI,
          );
          drawingContext.fill();
          const hardCoreStrength = VIEWER_PERF_PROFILE.isMobileLike
            ? config.hardCoreStrengthBase * 0.55
            : config.hardCoreStrengthBase;
          if (hardCoreStrength > 0) {
            drawingContext.filter = "none";
            drawingContext.fillStyle = `rgba(0, 0, 0, ${Math.min(
              hardCoreStrength,
              coreAlpha * 1.4,
            )})`;
            drawingContext.beginPath();
            drawingContext.ellipse(
              0,
              0,
              spotRadius * config.hardCoreRadiusX,
              spotRadius * config.hardCoreRadiusY,
              0,
              0,
              2 * Math.PI,
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
      if (
        typeof document === "undefined" ||
        typeof document.createElement !== "function"
      ) {
        occlusionTextureCache.set(level, null);
        return null;
      }
      const renderConfig = buildOcclusionRenderConfig(
        level,
        MOBILE_OCCLUSION_TEXTURE_SIZE,
      );
      if (!renderConfig) {
        occlusionTextureCache.set(level, null);
        return null;
      }
      const textureCanvas = document.createElement("canvas");
      textureCanvas.width = MOBILE_OCCLUSION_TEXTURE_SIZE;
      textureCanvas.height = MOBILE_OCCLUSION_TEXTURE_SIZE;
      const textureContext = textureCanvas.getContext("2d");
      if (!textureContext) {
        occlusionTextureCache.set(level, null);
        return null;
      }
      textureContext.save();
      textureContext.globalCompositeOperation = "source-over";
      drawOcclusionSpotsToContext(
        textureContext,
        renderConfig,
        0,
        0,
        MOBILE_OCCLUSION_TEXTURE_SIZE,
        MOBILE_OCCLUSION_TEXTURE_SIZE,
      );
      textureContext.filter = "none";
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
      if (
        typeof document === "undefined" ||
        typeof document.createElement !== "function"
      ) {
        mobileCataractLayerCache.set(cacheKey, null);
        return null;
      }
      const layerCanvas = document.createElement("canvas");
      layerCanvas.width = canvas.width;
      layerCanvas.height = canvas.height;
      const layerContext = layerCanvas.getContext("2d");
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
        Math.max(1, Math.min(virtualImageWidth, virtualImageHeight)),
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
          virtualImageHeight,
        );
        layerContext.filter = "none";
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
      ctx.globalCompositeOperation = "source-over";
      ctx.drawImage(layer, 0, 0, canvas.width, canvas.height);
      ctx.restore();
    }
    function drawCataractOcclusions(
      imageX,
      imageY,
      imageWidth,
      imageHeight,
      level,
    ) {
      const mobileTexture = getMobileOcclusionTexture(level);
      if (mobileTexture) {
        ctx.save();
        ctx.globalCompositeOperation = "source-over";
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
      ctx.globalCompositeOperation = "source-over";
      drawOcclusionSpotsToContext(
        ctx,
        renderConfig,
        imageX,
        imageY,
        imageWidth,
        imageHeight,
      );
      ctx.filter = "none";
      ctx.restore();
    }
    function resetNystagmusOffset() {
      if (nystagmusOffset.x === 0 && nystagmusOffset.y === 0) {
        return false;
      }
      nystagmusOffset = { x: 0, y: 0 };
      return true;
    }
    function updateNystagmusFrame(timestampMs) {
      if (!state2.viewer.nystagmusEnabled) {
        nystagmusStartedAt = 0;
        return resetNystagmusOffset();
      }
      if (nystagmusStartedAt === 0) {
        nystagmusStartedAt = timestampMs;
      }
      const direction = normalizeNystagmusDirection(
        state2.viewer.nystagmusDirection,
      );
      const rate = normalizeNystagmusRate(state2.viewer.nystagmusRate);
      const phaseCycles =
        ((timestampMs - nystagmusStartedAt) / 1e3) * NYSTAGMUS_RATES[rate];
      const cycleFraction = phaseCycles % 1;
      const amplitude = Math.max(10, Math.min(42, canvas.width * 0.018));
      const mixedAmplitudeY = amplitude * 0.55;
      const value =
        cycleFraction < 0.75
          ? -amplitude + (cycleFraction / 0.75) * (2 * amplitude)
          : amplitude - ((cycleFraction - 0.75) / 0.25) * (2 * amplitude);
      const nextOffset = {
        x: direction === "vertical" ? 0 : value,
        y:
          direction === "horizontal"
            ? 0
            : direction === "vertical"
              ? value
              : value >= 0
                ? mixedAmplitudeY
                : -mixedAmplitudeY,
      };
      if (
        Math.abs(nystagmusOffset.x - nextOffset.x) < 0.02 &&
        Math.abs(nystagmusOffset.y - nextOffset.y) < 0.02
      ) {
        return false;
      }
      nystagmusOffset = {
        x: parseFloat(nextOffset.x.toFixed(2)),
        y: parseFloat(nextOffset.y.toFixed(2)),
      };
      return true;
    }
    function startNystagmusLoop() {
      if (nystagmusAnimationId !== null) {
        return;
      }
      const animate = (timestampMs) => {
        nystagmusAnimationId = null;
        if (!state2.viewer.nystagmusEnabled) {
          if (resetNystagmusOffset()) {
            requestDraw();
          }
          return;
        }
        updateNystagmusFrame(timestampMs);
        requestDraw();
        nystagmusAnimationId = requestAnimationFrame(animate);
      };
      nystagmusAnimationId = requestAnimationFrame(animate);
    }
    function stopNystagmusLoop() {
      if (nystagmusAnimationId !== null) {
        cancelAnimationFrame(nystagmusAnimationId);
        nystagmusAnimationId = null;
      }
    }
    function jitter(timestamp) {
      const now =
        typeof timestamp === "number"
          ? timestamp
          : typeof window !== "undefined" && window.performance
            ? window.performance.now()
            : Date.now();
      const isMobileCataract =
        VIEWER_PERF_PROFILE.isMobileLike && state2.viewer.cataractLevel > 0;
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
      const damping = Math.max(
        0.72,
        0.85 - (timedMotionProfile.jitterMultiplier - 1) * 0.04,
      );
      const accelX = (Math.random() - 0.5) * activeJitterAmplitude;
      const accelY = (Math.random() - 0.5) * activeJitterAmplitude;
      velocityX += accelX;
      velocityY += accelY;
      velocityX *= damping;
      velocityY *= damping;
      bgOffsetX += velocityX;
      bgOffsetY += velocityY;
      updateNystagmusFrame(now);
      checkBoundaries();
      requestDraw();
      jitterAnimationId = requestAnimationFrame(jitter);
    }
    function doGazeShift(options = {}) {
      state2.viewer.shiftInProgress = true;
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
        timedMotionProfile.shiftDurationMs,
      );
      const angle = Math.random() * 2 * Math.PI;
      bgOffsetX += shiftDistance * Math.cos(angle);
      bgOffsetY += shiftDistance * Math.sin(angle);
      activateBioEdgeReflection(Math.cos(angle), Math.sin(angle), 0.7);
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
        state2.viewer.shiftInProgress = false;
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
            y: (Math.random() - 0.5) * 100,
          };
        }
        cornealJitterOffset.x +=
          (cornealTargetOffset.x - cornealJitterOffset.x) * 0.1;
        cornealJitterOffset.y +=
          (cornealTargetOffset.y - cornealJitterOffset.y) * 0.1;
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
      const renderScale = Math.max(
        0.45,
        Math.min(1, VIEWER_PERF_PROFILE.canvasScale),
      );
      canvas.width = Math.max(1, Math.round(img.naturalWidth * renderScale));
      canvas.height = Math.max(1, Math.round(img.naturalHeight * renderScale));
      ctx.imageSmoothingEnabled = true;
      ctx.imageSmoothingQuality = VIEWER_PERF_PROFILE.isMobileLike
        ? "medium"
        : "high";
      circleX = canvas.width / 2;
      circleY = canvas.height / 2;
      velocityX = 0;
      velocityY = 0;
      bgOffsetX = 0;
      bgOffsetY = 0;
      nystagmusOffset = { x: 0, y: 0 };
      nystagmusStartedAt = 0;
      mobileCataractLayerCache.clear();
      bioRimLayerCache.clear();
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
        imageScale: getBackgroundImageScale(),
        zoomFactor,
        bgOffsetX: bgOffsetX + nystagmusOffset.x,
        bgOffsetY: bgOffsetY + nystagmusOffset.y,
        circleRadius,
        circleX,
        isRightEye: state2.viewer.isRightEye,
      });
      const cataract =
        cataractPresets[state2.viewer.cataractLevel] || cataractPresets[0];
      drawFundusLayer(geometry, cataract);
      drawBioEdgeReflection(geometry);
      drawCornealReflexLayer(geometry, cataract);
      drawWindowRing(geometry);
      drawCanvasEdgeLabels();
      decayBioEdgeReflection();
    }
    function clipViewingWindow(centerX, centerY, radius) {
      ctx.beginPath();
      ctx.arc(centerX, centerY, radius, 0, 2 * Math.PI, true);
      ctx.closePath();
      ctx.clip();
    }
    function drawFundusLayer(geometry, cataract) {
      ctx.save();
      if (!state2.viewer.isRightEye) {
        ctx.translate(canvas.width, 0);
        ctx.scale(-1, 1);
      }
      clipViewingWindow(
        geometry.flippedCircleX,
        circleY,
        geometry.effectiveCircleRadius,
      );
      if (state2.viewer.isDiscVisible) {
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
          augmentedGeometry.scaledHeight,
        );
        ctx.filter = "none";
        ctx.restore();
        const isMobileCachedCataract =
          VIEWER_PERF_PROFILE.isMobileLike && state2.viewer.cataractLevel > 0;
        if (isMobileCachedCataract) {
          drawMobileCataractLayer(state2.viewer.cataractLevel, cataract);
        } else {
          applyCataractOverlays(cataract);
          ctx.save();
          applyTimedAugmentationTransform(augmentedGeometry);
          drawCataractOcclusions(
            augmentedGeometry.offsetXPos,
            augmentedGeometry.offsetYPos,
            augmentedGeometry.scaledWidth,
            augmentedGeometry.scaledHeight,
            state2.viewer.cataractLevel,
          );
          ctx.restore();
        }
      } else {
        ctx.fillStyle = "black";
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
      if (!getCurrentFovConfig().showCornealReflex) {
        return;
      }
      ctx.save();
      clipViewingWindow(circleX, circleY, geometry.effectiveCircleRadius);
      if (state2.viewer.isDiscVisible) {
        drawCornealReflex(geometry.effectiveCircleRadius, cataract);
      }
      ctx.restore();
    }
    function drawCornealReflex(effectiveCircleRadius, cataract) {
      const reflexOpacity = computeReflexOpacity({
        cataractLevel: state2.viewer.cataractLevel,
        darkTint: cataract.darkTint,
        yellowTint: cataract.yellowTint,
      });
      const renderResolutionScale =
        img.naturalHeight > 0
          ? Math.max(0.45, Math.min(1, canvas.height / img.naturalHeight))
          : 1;
      const reflexBaseRadius = 375 * renderResolutionScale;
      const reflexScaleFactor = 1.3;
      const ellipseWidth = 0.6 * reflexBaseRadius * reflexScaleFactor;
      const ellipseHeight = 0.5 * reflexBaseRadius * reflexScaleFactor;
      const smallerReflexScaleFactor = 0.7;
      const smallerEllipseWidth = ellipseWidth * smallerReflexScaleFactor;
      const smallerEllipseHeight = ellipseHeight * smallerReflexScaleFactor;
      const ellipseCenterX = circleX + cornealJitterOffset.x;
      const ellipseCenterY =
        circleY + 0.3 * effectiveCircleRadius + cornealJitterOffset.y;
      ctx.save();
      ctx.translate(ellipseCenterX, ellipseCenterY);
      ctx.scale(1, -1);
      ctx.translate(-ellipseCenterX, -ellipseCenterY);
      drawReflexEllipse(
        ellipseCenterX,
        ellipseCenterY,
        ellipseWidth,
        ellipseHeight,
        0.5 * reflexOpacity,
      );
      drawReflexEllipse(
        ellipseCenterX,
        ellipseCenterY,
        smallerEllipseWidth,
        smallerEllipseHeight,
        reflexOpacity,
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
    function drawBioEdgeReflection(geometry) {
      if (viewerMode !== "holo-bio" || !state2.viewer.isDiscVisible) {
        return;
      }
      const cataractDamping = Math.max(
        0.45,
        1 - state2.viewer.cataractLevel * 0.16,
      );
      const alpha = Math.min(
        0.96,
        bioEdgeReflectionEnergy * 1.25 * cataractDamping,
      );
      if (alpha < 0.03) {
        return;
      }
      const radius = geometry.effectiveCircleRadius;
      const centreX = circleX;
      const centreY = circleY;
      const angleOffset = Math.max(
        -0.06,
        Math.min(0.06, Math.sin(bioEdgeReflectionAngle) * 0.06),
      );
      const pulseTime =
        typeof window !== "undefined" && window.performance
          ? window.performance.now()
          : Date.now();
      const pulse =
        0.88 + 0.16 * Math.sin(pulseTime * 0.011 + bioEdgeReflectionAngle * 2);
      const layer = getCachedBioRimLayer(radius);
      if (!layer) {
        return;
      }
      ctx.save();
      clipViewingWindow(centreX, centreY, radius);
      ctx.globalCompositeOperation = "source-over";
      ctx.globalAlpha = Math.max(0, Math.min(0.96, alpha * pulse));
      ctx.translate(centreX, centreY);
      ctx.rotate(angleOffset);
      ctx.drawImage(layer.canvas, -layer.centre, -layer.centre);
      ctx.restore();
    }
    function getCachedBioRimLayer(radius) {
      if (typeof document === "undefined") {
        return null;
      }
      const layerRadius = Math.max(1, Math.round(radius));
      const isMobileLayer = VIEWER_PERF_PROFILE.isMobileLike;
      const cacheKey = `${isMobileLayer ? "m" : "d"}-${layerRadius}`;
      if (bioRimLayerCache.has(cacheKey)) {
        return bioRimLayerCache.get(cacheKey);
      }
      const padding = Math.ceil(layerRadius * 0.38);
      const layerCentre = layerRadius + padding;
      const layerSize = Math.ceil(layerCentre * 2);
      const layerCanvas = document.createElement("canvas");
      layerCanvas.width = layerSize;
      layerCanvas.height = layerSize;
      const layerCtx = layerCanvas.getContext("2d");
      if (!layerCtx) {
        bioRimLayerCache.set(cacheKey, null);
        return null;
      }
      const startAngle = -0.78;
      const endAngle = 1.22;
      const oppositeStartAngle = startAngle + Math.PI;
      const oppositeEndAngle = endAngle + Math.PI;
      const rimRadius = layerRadius * 0.87;
      const bandWidth = Math.max(14, layerRadius * 0.38);
      const oppositeBandWidth = Math.max(5, layerRadius * 0.13);
      const segmentCount = isMobileLayer ? 40 : 28;
      const segmentOverlap = isMobileLayer ? 0.018 : 0.012;
      const drawFadedArc = ({ arcRadius, lineWidth, start, end, colourAt }) => {
        for (let index = 0; index < segmentCount; index += 1) {
          const t0 = index / segmentCount;
          const t1 = (index + 1) / segmentCount;
          const midpoint = (t0 + t1) / 2;
          const fade = Math.pow(Math.sin(Math.PI * midpoint), 1.15);
          if (fade <= 0) {
            continue;
          }
          const segmentStart =
            start + (end - start) * Math.max(0, t0 - segmentOverlap);
          const segmentEnd =
            start + (end - start) * Math.min(1, t1 + segmentOverlap);
          layerCtx.strokeStyle = colourAt(midpoint, fade);
          layerCtx.lineWidth = lineWidth;
          layerCtx.beginPath();
          layerCtx.arc(
            layerCentre,
            layerCentre,
            arcRadius,
            segmentStart,
            segmentEnd,
          );
          layerCtx.stroke();
        }
      };
      layerCtx.imageSmoothingEnabled = true;
      layerCtx.imageSmoothingQuality = isMobileLayer ? "medium" : "high";
      layerCtx.globalCompositeOperation = "source-over";
      layerCtx.filter = isMobileLayer
        ? "none"
        : `blur(${Math.max(1.8, layerRadius * 0.014)}px)`;
      layerCtx.lineCap = "round";
      layerCtx.lineJoin = "round";
      drawFadedArc({
        arcRadius: rimRadius,
        lineWidth: bandWidth,
        start: startAngle,
        end: endAngle,
        colourAt: (t, fade) => {
          if (t > 0.76) {
            return `rgba(91, 207, 255, ${0.62 * fade})`;
          }
          if (t > 0.58) {
            return `rgba(255, 172, 52, ${0.76 * fade})`;
          }
          return `rgba(255, 223, 112, ${0.98 * fade})`;
        },
      });
      drawFadedArc({
        arcRadius: layerRadius * 0.94,
        lineWidth: Math.max(7, layerRadius * 0.16),
        start: 0.08,
        end: endAngle,
        colourAt: (t, fade) => {
          if (t < 0.28) {
            return "rgba(255, 255, 255, 0)";
          }
          return `rgba(43, 124, 255, ${0.76 * fade})`;
        },
      });
      drawFadedArc({
        arcRadius: rimRadius,
        lineWidth: oppositeBandWidth,
        start: oppositeStartAngle,
        end: oppositeEndAngle,
        colourAt: (t, fade) => {
          if (t > 0.7) {
            return `rgba(87, 196, 255, ${0.25 * fade})`;
          }
          if (t > 0.52) {
            return `rgba(255, 177, 58, ${0.24 * fade})`;
          }
          return `rgba(255, 228, 128, ${0.32 * fade})`;
        },
      });
      drawFadedArc({
        arcRadius: layerRadius * 0.94,
        lineWidth: Math.max(2, layerRadius * 0.042),
        start: oppositeStartAngle + 0.18,
        end: oppositeEndAngle - 0.08,
        colourAt: (_t, fade) => `rgba(78, 163, 255, ${0.2 * fade})`,
      });
      layerCtx.filter = "none";
      drawFadedArc({
        arcRadius: layerRadius * 0.985,
        lineWidth: Math.max(1, layerRadius * 0.012),
        start: startAngle + 0.08,
        end: endAngle - 0.08,
        colourAt: (_t, fade) => `rgba(255, 255, 255, ${0.22 * fade})`,
      });
      drawFadedArc({
        arcRadius: layerRadius * 0.985,
        lineWidth: Math.max(1, layerRadius * 7e-3),
        start: oppositeStartAngle + 0.16,
        end: oppositeEndAngle - 0.16,
        colourAt: (_t, fade) => `rgba(255, 255, 255, ${0.08 * fade})`,
      });
      const layer = {
        canvas: layerCanvas,
        centre: layerCentre,
      };
      bioRimLayerCache.set(cacheKey, layer);
      return layer;
    }
    function drawWindowRing(geometry) {
      const baseLineWidth = 18 * geometry.windowScale * geometry.scaleFactor;
      ctx.save();
      ctx.beginPath();
      ctx.arc(
        circleX,
        circleY,
        geometry.effectiveCircleRadius,
        0,
        2 * Math.PI,
        true,
      );
      ctx.strokeStyle = "rgba(255, 255, 255, 0.24)";
      ctx.lineWidth = baseLineWidth * 2;
      ctx.stroke();
      ctx.beginPath();
      ctx.arc(
        circleX,
        circleY,
        geometry.effectiveCircleRadius,
        0,
        2 * Math.PI,
        true,
      );
      ctx.strokeStyle = "rgba(255, 255, 255, 0.66)";
      ctx.lineWidth = baseLineWidth;
      ctx.stroke();
      ctx.beginPath();
      ctx.arc(
        circleX,
        circleY,
        geometry.effectiveCircleRadius,
        0,
        2 * Math.PI,
        true,
      );
      ctx.strokeStyle = "rgba(255, 255, 255, 0.92)";
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
      ctx.fillStyle = "rgba(148, 163, 184, 0.82)";
      ctx.font = `600 ${fontSize}px 'Inter', 'Segoe UI', 'Helvetica Neue', Arial, sans-serif`;
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      if (state2.viewer.isRightEye) {
        ctx.save();
        ctx.translate(sideOffset, centreY);
        ctx.rotate(-Math.PI / 2);
        ctx.fillText("Temporal", 0, 0);
        ctx.restore();
        ctx.save();
        ctx.translate(canvas.width - sideOffset, centreY);
        ctx.rotate(Math.PI / 2);
        ctx.fillText("Nasal", 0, 0);
        ctx.restore();
      } else {
        ctx.save();
        ctx.translate(sideOffset, centreY);
        ctx.rotate(-Math.PI / 2);
        ctx.fillText("Nasal", 0, 0);
        ctx.restore();
        ctx.save();
        ctx.translate(canvas.width - sideOffset, centreY);
        ctx.rotate(Math.PI / 2);
        ctx.fillText("Temporal", 0, 0);
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
        imageScale: getBackgroundImageScale(),
        circleRadius,
        zoomFactor,
      });
      const clamped = clampCircleToBounds({
        circleX,
        circleY,
        velocityX,
        velocityY,
        bounds,
      });
      circleX = clamped.circleX;
      circleY = clamped.circleY;
      velocityX = clamped.velocityX;
      velocityY = clamped.velocityY;
    }
    function ensureUndilated() {
      if (getCurrentFovDegrees() !== getUndilatedFovDegrees()) {
        setFovDegrees(getUndilatedFovDegrees());
      }
    }
    function setDilated(isDilated) {
      const nextIsDilated = Boolean(isDilated);
      const currentIsDilated = getIsDilated();
      if (currentIsDilated === nextIsDilated) {
        return;
      }
      setFovDegrees(
        nextIsDilated ? getDilatedFovDegrees() : getUndilatedFovDegrees(),
      );
    }
    function getIsDilated() {
      return getCurrentFovDegrees() === getDilatedFovDegrees();
    }
    function setViewerMode(mode) {
      const nextMode = VIEWER_MODE_CONFIGS[mode] ? mode : DEFAULT_VIEWER_MODE;
      if (viewerMode === nextMode) {
        return;
      }
      const wasDilated = getIsDilated();
      viewerMode = nextMode;
      syncFovRange();
      setFovDegrees(
        wasDilated ? getDilatedFovDegrees() : getUndilatedFovDegrees(),
      );
      requestDraw();
    }
    function setRightEye(isRightEye) {
      const nextIsRightEye = Boolean(isRightEye);
      if (state2.viewer.isRightEye === nextIsRightEye) {
        return;
      }
      eyeToggleCheckbox.checked = !nextIsRightEye;
      state2.viewer.isRightEye = nextIsRightEye;
      reCentreEverything();
      updateEyeLabels();
    }
    function getIsRightEye() {
      return state2.viewer.isRightEye;
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
    function setNystagmusEnabled(enabled) {
      const nextEnabled = Boolean(enabled);
      if (state2.viewer.nystagmusEnabled === nextEnabled) {
        return;
      }
      state2.viewer.nystagmusEnabled = nextEnabled;
      nystagmusStartedAt = 0;
      if (nextEnabled) {
        startNystagmusLoop();
      } else {
        stopNystagmusLoop();
        resetNystagmusOffset();
      }
      requestDraw();
    }
    function setNystagmusConfig({ direction, rate } = {}) {
      state2.viewer.nystagmusDirection = normalizeNystagmusDirection(
        direction || state2.viewer.nystagmusDirection,
      );
      state2.viewer.nystagmusRate = normalizeNystagmusRate(
        rate || state2.viewer.nystagmusRate,
      );
      nystagmusStartedAt = 0;
      if (state2.viewer.nystagmusEnabled) {
        startNystagmusLoop();
      }
      requestDraw();
    }
    function getNystagmusConfig() {
      return {
        enabled: Boolean(state2.viewer.nystagmusEnabled),
        direction: normalizeNystagmusDirection(
          state2.viewer.nystagmusDirection,
        ),
        rate: normalizeNystagmusRate(state2.viewer.nystagmusRate),
      };
    }
    function setDiscVisible(visible) {
      state2.viewer.isDiscVisible = visible;
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
      return state2.viewer.conditionImageSrc || defaultImageSrc;
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
      stopNystagmusLoop();
      resetNystagmusOffset();
      state2.viewer.shiftInProgress = false;
      occlusionTextureCache.clear();
      mobileCataractLayerCache.clear();
      bioRimLayerCache.clear();
    }
    return {
      initialize,
      doGazeShift,
      setDiscVisible,
      setImageSource,
      setViewerCase: setViewerCase2,
      setViewerMode,
      setViewerControlsDisabled,
      ensureUndilated,
      setDilated,
      getIsDilated,
      setRightEye,
      getIsRightEye,
      setCataractLevel,
      getCataractLevel,
      setNystagmusEnabled,
      setNystagmusConfig,
      getNystagmusConfig,
      setTimedAugmentation,
      clearTimedAugmentation,
      setTimedMotionProfile,
      clearTimedMotionProfile,
      setFovDegrees,
      getFovDegrees,
      getActiveConditionImagePath,
      destroy,
    };
  }

  // src/viewer-config.js?v=20260519-viewer
  var DIABETIC_IMAGE_CASES = Object.freeze([
    {
      id: "case-01",
      label: "1",
      title: "Case 1",
      summary: "Normal eye",
      description: [
        "Normal retinal image for comparison.",
        "No diabetic retinopathy signs are visible.",
        "Record the view and findings for each eye.",
      ],
      src: "assets/images/diabetic/case-01.webp?v=20260520-expanded2",
      thumbSrc: "assets/images/diabetic/case-01_thumb.webp?v=20260520-thumbs",
      darkSrc: "assets/images/diabetic/case-01_dark.webp?v=20260520-darkcases",
    },
    {
      id: "case-02",
      label: "2",
      title: "Case 2",
      viewScale: 0.86,
      summary: "Small NVD",
      description: [
        "Small new vessels at the disc.",
        "No definite new vessels elsewhere in this image.",
        "This is a proliferative DR sign.",
        "Urgent referral for laser panretinal photocoagulation (PRP).",
      ],
      src: "assets/images/diabetic/case-02.webp?v=20260520-expanded2",
      thumbSrc: "assets/images/diabetic/case-02_thumb.webp?v=20260520-thumbs",
      darkSrc: "assets/images/diabetic/case-02_dark.webp?v=20260520-darkcases",
    },
    {
      id: "case-03",
      label: "3",
      title: "Case 3",
      viewScale: 0.86,
      summary: "NVD + NVE",
      description: [
        "New vessels at the disc and elsewhere.",
        "This is proliferative diabetic retinopathy.",
        "Red-flag new vessels drive urgent action.",
      ],
      src: "assets/images/diabetic/case-03.webp?v=20260520-expanded2",
      thumbSrc: "assets/images/diabetic/case-03_thumb.webp?v=20260520-thumbs",
      darkSrc: "assets/images/diabetic/case-03_dark.webp?v=20260520-darkcases",
    },
    {
      id: "case-04",
      label: "4",
      title: "Case 4",
      viewScale: 0.86,
      summary: "NVE + maculopathy",
      description: [
        "New vessels elsewhere are present.",
        "There are macular changes as well.",
        "This is a mixed proliferative and macula-risk case.",
      ],
      src: "assets/images/diabetic/case-04.webp?v=20260520-expanded2",
      thumbSrc: "assets/images/diabetic/case-04_thumb.webp?v=20260520-thumbs",
      darkSrc: "assets/images/diabetic/case-04_dark.webp?v=20260520-darkcases",
    },
    {
      id: "case-05",
      label: "5",
      title: "Case 5",
      viewScale: 0.86,
      summary: "NVD + NVE + small PRH",
      description: [
        "New vessels are seen at the disc and elsewhere.",
        "There is also a small pre-retinal haemorrhage.",
        "This is proliferative DR with haemorrhage.",
      ],
      src: "assets/images/diabetic/case-05.webp?v=20260520-expanded2",
      thumbSrc: "assets/images/diabetic/case-05_thumb.webp?v=20260520-thumbs",
      darkSrc: "assets/images/diabetic/case-05_dark.webp?v=20260520-darkcases",
    },
    {
      id: "case-06",
      label: "6",
      title: "Case 6",
      viewScale: 0.86,
      summary: "Small inferior PRH",
      description: [
        "Small pre-retinal haemorrhage inferiorly.",
        "The rest of the view is easier to assess.",
        "The pre-retinal blood is the key finding.",
      ],
      src: "assets/images/diabetic/case-06.webp?v=20260520-expanded2",
      thumbSrc: "assets/images/diabetic/case-06_thumb.webp?v=20260520-thumbs",
      darkSrc: "assets/images/diabetic/case-06_dark.webp?v=20260520-darkcases",
    },
    {
      id: "case-07",
      label: "7",
      title: "Case 7",
      viewScale: 0.86,
      summary: "Medium PRH",
      description: [
        "Medium pre-retinal haemorrhage.",
        "Blood is sitting in front of the retina.",
        "Treat this as an urgent proliferative-risk sign.",
      ],
      src: "assets/images/diabetic/case-07.webp?v=20260520-expanded2",
      thumbSrc: "assets/images/diabetic/case-07_thumb.webp?v=20260520-thumbs",
      darkSrc: "assets/images/diabetic/case-07_dark.webp?v=20260520-darkcases",
    },
    {
      id: "case-08",
      label: "8",
      title: "Case 8",
      viewScale: 0.86,
      summary: "Vitreous haemorrhage",
      description: [
        "Very large vitreous or total haemorrhage.",
        "The retina cannot be assessed.",
        "This is an urgent same-day finding.",
      ],
      src: "assets/images/diabetic/case-08.webp?v=20260520-expanded2",
      thumbSrc: "assets/images/diabetic/case-08_thumb.webp?v=20260520-thumbs",
      darkSrc: "assets/images/diabetic/case-08.webp?v=20260520-expanded2",
    },
    {
      id: "case-09",
      label: "9",
      title: "Case 9",
      viewScale: 0.86,
      summary: "Mild mixed maculopathy",
      description: [
        "Mild macular changes are present.",
        "There are a few scattered diabetic changes.",
        "Macula risk is the main feature to notice.",
      ],
      src: "assets/images/diabetic/case-09.webp?v=20260520-expanded2",
      thumbSrc: "assets/images/diabetic/case-09_thumb.webp?v=20260520-thumbs",
      darkSrc: "assets/images/diabetic/case-09_dark.webp?v=20260520-darkcases",
    },
    {
      id: "case-10",
      label: "10",
      title: "Case 10",
      viewScale: 0.86,
      summary: "Extensive mixed maculopathy",
      description: [
        "More extensive macular changes.",
        "There are scattered haemorrhages as well.",
        "This is a mixed maculopathy case.",
      ],
      src: "assets/images/diabetic/case-10.webp?v=20260520-expanded2",
      thumbSrc: "assets/images/diabetic/case-10_thumb.webp?v=20260520-thumbs",
      darkSrc: "assets/images/diabetic/case-10_dark.webp?v=20260520-darkcases",
    },
  ]);
  var DEFAULT_VIEWER_IMAGE_SRC = DIABETIC_IMAGE_CASES[0].src;
  var VIEWER_EXPLANATION_TEMPLATES = Object.freeze({
    "case-01":
      "<p>Use the viewing window to scan the image, then record View and Findings.</p>",
    normal:
      "<p>Use the viewing window to scan the image, then record View and Findings.</p>",
  });
  var CATARACT_PRESETS = [
    {
      label: "None",
      blurPx: 0,
      brightness: 1,
      contrast: 1,
      saturation: 1,
      yellowTint: 0,
      darkTint: 0,
      hazeTint: 0,
    },
    {
      label: "Slight",
      blurPx: 0.45,
      brightness: 0.92,
      contrast: 0.95,
      saturation: 0.9,
      yellowTint: 0.05,
      darkTint: 0.06,
      hazeTint: 0.015,
    },
    {
      label: "Med",
      blurPx: 1.65,
      brightness: 0.7,
      contrast: 0.76,
      saturation: 0.58,
      yellowTint: 0.2,
      darkTint: 0.24,
      hazeTint: 0.05,
    },
    {
      label: "Dense",
      blurPx: 3.2,
      brightness: 0.56,
      contrast: 0.66,
      saturation: 0.46,
      yellowTint: 0.34,
      darkTint: 0.4,
      hazeTint: 0.14,
    },
  ];
  var CATARACT_OCCLUSION_SPOTS = [
    [],
    [
      {
        x: -0.34,
        y: -0.2,
        r: 0.2,
        alpha: 0.13,
        blur: 0.95,
        coreAlpha: 0.05,
        stretchX: 1.45,
        stretchY: 0.8,
        angle: -0.45,
      },
      {
        x: 0.4,
        y: 0.22,
        r: 0.16,
        alpha: 0.11,
        blur: 0.9,
        coreAlpha: 0.04,
        stretchX: 1.35,
        stretchY: 0.82,
        angle: 0.35,
      },
      {
        x: 0.06,
        y: 0.34,
        r: 0.13,
        alpha: 0.09,
        blur: 0.82,
        coreAlpha: 0.03,
        stretchX: 1.3,
        stretchY: 0.9,
        angle: -0.1,
      },
    ],
    [
      {
        x: -0.46,
        y: -0.3,
        r: 0.28,
        alpha: 0.26,
        blur: 1.2,
        coreAlpha: 0.1,
        stretchX: 1.75,
        stretchY: 0.74,
        angle: -0.62,
      },
      {
        x: 0.4,
        y: -0.16,
        r: 0.24,
        alpha: 0.23,
        blur: 1.12,
        coreAlpha: 0.09,
        stretchX: 1.6,
        stretchY: 0.78,
        angle: 0.52,
      },
      {
        x: 0.08,
        y: 0.34,
        r: 0.22,
        alpha: 0.21,
        blur: 1.08,
        coreAlpha: 0.08,
        stretchX: 1.55,
        stretchY: 0.8,
        angle: -0.22,
      },
      {
        x: -0.18,
        y: 0.02,
        r: 0.19,
        alpha: 0.18,
        blur: 1,
        coreAlpha: 0.07,
        stretchX: 1.5,
        stretchY: 0.85,
        angle: 0.12,
      },
      {
        x: 0.26,
        y: 0.1,
        r: 0.16,
        alpha: 0.16,
        blur: 0.94,
        coreAlpha: 0.06,
        stretchX: 1.4,
        stretchY: 0.88,
        angle: -0.35,
      },
    ],
    [
      {
        x: -0.5,
        y: -0.34,
        r: 0.34,
        alpha: 0.42,
        blur: 1.55,
        coreAlpha: 0.18,
        stretchX: 2,
        stretchY: 0.66,
        angle: -0.72,
      },
      {
        x: 0.42,
        y: -0.22,
        r: 0.31,
        alpha: 0.39,
        blur: 1.46,
        coreAlpha: 0.17,
        stretchX: 1.9,
        stretchY: 0.68,
        angle: 0.58,
      },
      {
        x: 0.14,
        y: 0.4,
        r: 0.29,
        alpha: 0.37,
        blur: 1.4,
        coreAlpha: 0.16,
        stretchX: 1.82,
        stretchY: 0.7,
        angle: -0.26,
      },
      {
        x: -0.1,
        y: 0.04,
        r: 0.27,
        alpha: 0.34,
        blur: 1.34,
        coreAlpha: 0.15,
        stretchX: 1.75,
        stretchY: 0.74,
        angle: 0.08,
      },
      {
        x: 0.32,
        y: 0.18,
        r: 0.24,
        alpha: 0.31,
        blur: 1.28,
        coreAlpha: 0.14,
        stretchX: 1.7,
        stretchY: 0.78,
        angle: -0.42,
      },
      {
        x: -0.3,
        y: 0.24,
        r: 0.21,
        alpha: 0.28,
        blur: 1.2,
        coreAlpha: 0.12,
        stretchX: 1.62,
        stretchY: 0.82,
        angle: 0.44,
      },
    ],
  ];

  // src/state.js?v=20260518-findingdropdown
  function createEyeState() {
    return {
      distanceVA: "",
      viewQuality: "",
      areaSeen: "",
      findings: createEmptyFindings(),
    };
  }
  function createInitialState() {
    return {
      mode: "arclight-do",
      dilation: "no",
      systemicChecks: {
        bp: false,
        lipids: false,
        hba1c: false,
      },
      viewer: {
        activeImageSrc: "",
        conditionImageSrc: "",
        activeCondition: "case-01",
        pigmentation: "light",
        isRightEye: true,
        isDiscVisible: true,
        cataractLevel: 0,
        caseImageScale: 1,
        nystagmusEnabled: false,
        nystagmusDirection: "horizontal",
        nystagmusRate: "slow",
        shiftInProgress: false,
      },
      eyes: {
        right: createEyeState(),
        left: createEyeState(),
      },
    };
  }
  function setMode(state2, mode) {
    state2.mode = mode;
    Object.keys(state2.eyes).forEach((eyeKey) => {
      const eye = state2.eyes[eyeKey];
      if (!AREA_OPTIONS[mode].some((option) => option.value === eye.areaSeen)) {
        eye.areaSeen = "";
      }
    });
  }
  function setDilation(state2, value) {
    state2.dilation = value;
  }
  function setSystemicCheck(state2, key, checked) {
    state2.systemicChecks[key] = checked;
  }
  function setDistanceVA(state2, eyeKey, value) {
    state2.eyes[eyeKey].distanceVA = value;
  }
  function setEyeField(state2, eyeKey, field, value) {
    state2.eyes[eyeKey][field] = value;
  }
  function setFinding(state2, eyeKey, findingKey, checked) {
    const findings = state2.eyes[eyeKey].findings;
    if (findingKey === "noReferableSignsSeen") {
      findings.noReferableSignsSeen = checked;
      if (checked) {
        LESION_FINDING_KEYS.forEach((key) => {
          findings[key] = false;
        });
      }
      return;
    }
    findings[findingKey] = checked;
    if (checked) {
      findings.noReferableSignsSeen = false;
    }
  }

  // src/triage.js?v=20260518-findingdropdown
  var PRIORITY = {
    incomplete: 0,
    routineScreen: 1,
    ungradable: 2,
    routineReferral: 3,
    referSoon: 4,
    urgent: 5,
  };
  var ACTION_COPY = {
    incomplete: {
      title: "Record both eyes",
      next: "Complete R/L VA, view and findings.",
      tone: "neutral",
    },
    routineScreen: {
      title: "Routine (screening)",
      next: "Continue local screening pathway.",
      tone: "green",
    },
    ungradable: {
      title: "Ungradable (repeat)",
      next: "Repeat dilated view/photo; refer if still poor.",
      tone: "orange",
    },
    routineReferral: {
      title: "Routine (weeks)",
      next: "Refer routinely when possible.",
      tone: "green",
    },
    referSoon: {
      title: "Soon (days)",
      next: "Refer within days.",
      tone: "orange",
    },
    urgent: {
      title: "Urgent (today)",
      next: "Same-day eye referral.",
      tone: "red",
    },
  };
  var REDUCED_VA_VALUES = /* @__PURE__ */ new Set([
    "6/36",
    "6/60",
    "HM",
    "fix_follow_poor",
  ]);
  var NO_TEST_VALUES = /* @__PURE__ */ new Set(["unable_test"]);
  var MILD_VA_VALUES = /* @__PURE__ */ new Set(["6/12", "fix_follow_good"]);
  function selectedKeys(findings, keys) {
    return keys.filter((key) => Boolean(findings[key]));
  }
  function formatFindings(keys) {
    return keys
      .map((key) => {
        var _a, _b;
        return (
          ((_a = FINDING_MAP[key]) == null ? void 0 : _a.shortLabel) ||
          ((_b = FINDING_MAP[key]) == null ? void 0 : _b.label)
        );
      })
      .filter(Boolean);
  }
  function getVaRisk(value) {
    if (REDUCED_VA_VALUES.has(value)) {
      return "reduced";
    }
    if (NO_TEST_VALUES.has(value)) {
      return "untestable";
    }
    if (MILD_VA_VALUES.has(value)) {
      return "mild";
    }
    return "none";
  }
  function isViewAdequate(eye) {
    return (
      eye.viewQuality === "clear" && eye.areaSeen && eye.areaSeen !== "limited"
    );
  }
  function isViewLimited(eye) {
    return (
      eye.viewQuality === "ungradable" ||
      eye.viewQuality === "partial" ||
      eye.viewQuality === "hazy" ||
      eye.areaSeen === "limited"
    );
  }
  function hasAnyRecordedEyeData(eye) {
    return Boolean(
      eye.distanceVA ||
      eye.viewQuality ||
      eye.areaSeen ||
      Object.values(eye.findings).some(Boolean),
    );
  }
  function evaluateEye(eyeKey, eye, state2) {
    const eyeLabel = EYE_LABELS[eyeKey];
    const findings = eye.findings;
    const pdrKeys = selectedKeys(findings, PDR_KEYS);
    const maculaKeys = selectedKeys(findings, MACULA_KEYS);
    const npdrKeys = selectedKeys(findings, NPDR_KEYS);
    const lesionKeys = [...pdrKeys, ...maculaKeys, ...npdrKeys];
    const hasDrContext = lesionKeys.length > 0;
    const vaRisk = getVaRisk(eye.distanceVA);
    const hasQualifyingVaRisk = vaRisk === "reduced" || vaRisk === "untestable";
    const hasMaculaRisk =
      maculaKeys.length > 0 || (hasQualifyingVaRisk && hasDrContext);
    const viewLimited = isViewLimited(eye);
    const viewAdequate = isViewAdequate(eye);
    const recorded = hasAnyRecordedEyeData(eye);
    const base = {
      eyeKey,
      eyeLabel,
      viewAdequate,
      viewLimited,
      selectedFindings: getFindingLabels(findings),
      vaRisk,
      priority: PRIORITY.incomplete,
      actionKey: "incomplete",
      reasons: [],
      limitations: [],
      summary: "Not recorded",
    };
    if (pdrKeys.length > 0) {
      return {
        ...base,
        priority: PRIORITY.urgent,
        actionKey: "urgent",
        reasons: formatFindings(pdrKeys),
        limitations: viewLimited ? ["limited view"] : [],
        summary: "Urgent",
      };
    }
    if (hasMaculaRisk) {
      const reasons = formatFindings(maculaKeys);
      if (hasQualifyingVaRisk) {
        reasons.push(
          `${getVaLabel(eye.distanceVA)} VA${maculaKeys.length === 0 ? " with DR signs" : ""}`,
        );
      }
      return {
        ...base,
        priority: PRIORITY.referSoon,
        actionKey: "referSoon",
        reasons,
        limitations: viewLimited ? ["limited view"] : [],
        summary: "Refer soon",
      };
    }
    if (npdrKeys.length > 0) {
      return {
        ...base,
        priority: PRIORITY.routineReferral,
        actionKey: "routineReferral",
        reasons: formatFindings(npdrKeys),
        limitations: viewLimited ? ["limited view"] : [],
        summary: "Routine referral",
      };
    }
    if (viewLimited) {
      return {
        ...base,
        priority: PRIORITY.ungradable,
        actionKey: "ungradable",
        reasons: [
          eye.viewQuality === "ungradable" ? "Ungradable view" : "Limited view",
        ],
        limitations: ["not reassuring"],
        summary: "Ungradable",
      };
    }
    if (hasQualifyingVaRisk) {
      return {
        ...base,
        priority: PRIORITY.routineReferral,
        actionKey: "routineReferral",
        reasons: [`${getVaLabel(eye.distanceVA)} VA without DR signs`],
        summary: "Review VA",
      };
    }
    if (viewAdequate && findings.noReferableSignsSeen) {
      return {
        ...base,
        priority: PRIORITY.routineScreen,
        actionKey: "routineScreen",
        reasons: ["No signs in view"],
        summary: "No referable signs",
      };
    }
    if (recorded) {
      return {
        ...base,
        reasons: ["Select no signs or DR findings"],
        summary: "Incomplete",
      };
    }
    return base;
  }
  function compareEyeResults(a, b) {
    if (a.priority !== b.priority) {
      return b.priority - a.priority;
    }
    if (a.eyeKey === "right") return -1;
    if (b.eyeKey === "right") return 1;
    return 0;
  }
  function buildDilationNotes(state2) {
    const notes = [];
    if (state2.dilation === "no") {
      notes.push("Not dilated.");
    }
    if (!state2.dilation) {
      notes.push("Dilation not recorded.");
    }
    if (state2.mode === "holo-bio" && state2.dilation !== "yes") {
      notes.push("Holo view limited without dilation.");
    }
    return notes;
  }
  function buildSystemicSummary(state2) {
    const checked = [];
    const unchecked = [];
    Object.entries(state2.systemicChecks).forEach(([key, value]) => {
      const label = key === "hba1c" ? "HbA1c" : key === "bp" ? "BP" : "lipids";
      if (value) {
        checked.push(label);
      } else {
        unchecked.push(label);
      }
    });
    return { checked, unchecked };
  }
  function buildSafety(systemic) {
    const safety = ["Screening required. View only."];
    if (systemic.unchecked.length > 0) {
      safety.push("Medical review if possible.");
    }
    return safety;
  }
  function evaluateTriage(state2) {
    const eyeResults = Object.entries(state2.eyes).map(([eyeKey, eye]) =>
      evaluateEye(eyeKey, eye, state2),
    );
    const sortedEyes = [...eyeResults].sort(compareEyeResults);
    const topEye = sortedEyes[0];
    const copy = ACTION_COPY[topEye.actionKey];
    const dilationNotes = buildDilationNotes(state2);
    const systemic = buildSystemicSummary(state2);
    const incompleteEyes = eyeResults.filter(
      (result) => result.actionKey === "incomplete",
    );
    const limitationEyes = eyeResults.filter(
      (result) => result.viewLimited && result.priority < PRIORITY.urgent,
    );
    const reasons = [];
    const limitations = [];
    if (topEye.priority === PRIORITY.incomplete) {
      reasons.push("R/L recording incomplete.");
    } else if (topEye.priority === PRIORITY.routineScreen) {
      const allRoutine = eyeResults.every(
        (result) => result.actionKey === "routineScreen",
      );
      if (allRoutine) {
        reasons.push(
          "Both eyes have adequate views and no referable signs selected.",
        );
      } else {
        const limitedEye = eyeResults.find((result) => result.viewLimited);
        if (limitedEye) {
          return evaluateWithForcedUngradable(
            state2,
            eyeResults,
            dilationNotes,
            systemic,
          );
        }
        const incompleteEye = eyeResults.find(
          (result) => result.actionKey === "incomplete",
        );
        if (incompleteEye) {
          return evaluateWithForcedIncomplete(
            eyeResults,
            dilationNotes,
            systemic,
          );
        }
      }
    } else {
      const grouped = sortedEyes.filter(
        (result) =>
          result.priority === topEye.priority &&
          result.priority > PRIORITY.incomplete,
      );
      grouped.forEach((result) => {
        reasons.push(
          `${result.eyeLabel}: ${result.reasons.join(", ") || ACTION_COPY[result.actionKey].title}.`,
        );
      });
    }
    limitationEyes
      .filter((result) => result.priority < topEye.priority)
      .forEach((result) => {
        const detail =
          result.reasons.join(", ") ||
          result.limitations.join(", ") ||
          "limited view";
        limitations.push(`${result.eyeLabel}: ${detail}.`);
      });
    incompleteEyes
      .filter((result) => topEye.priority > PRIORITY.incomplete)
      .forEach((result) => limitations.push(`${result.eyeLabel}: incomplete.`));
    dilationNotes.forEach((note) => limitations.push(note));
    return {
      actionKey: topEye.actionKey,
      priority: topEye.priority,
      title: copy.title,
      tone: copy.tone,
      reasons,
      limitations,
      next: copy.next,
      safety: buildSafety(systemic),
      systemic,
      eyes: eyeResults,
    };
  }
  function evaluateWithForcedUngradable(
    state2,
    eyeResults,
    dilationNotes,
    systemic,
  ) {
    const copy = ACTION_COPY.ungradable;
    const limitations = [];
    eyeResults
      .filter((result) => result.viewLimited)
      .forEach((result) =>
        limitations.push(
          `${result.eyeLabel}: ${result.reasons.join(", ") || "not assessable"}.`,
        ),
      );
    dilationNotes.forEach((note) => limitations.push(note));
    return {
      actionKey: "ungradable",
      priority: PRIORITY.ungradable,
      title: copy.title,
      tone: copy.tone,
      reasons: ["One eye not assessable."],
      limitations,
      next: copy.next,
      safety: [
        "Repeat dilated view/photo if possible.",
        "Screening still required.",
      ],
      systemic,
      eyes: eyeResults,
    };
  }
  function evaluateWithForcedIncomplete(eyeResults, dilationNotes, systemic) {
    const copy = ACTION_COPY.incomplete;
    const limitations = [];
    eyeResults
      .filter((result) => result.actionKey === "incomplete")
      .forEach((result) => limitations.push(`${result.eyeLabel}: incomplete.`));
    dilationNotes.forEach((note) => limitations.push(note));
    return {
      actionKey: "incomplete",
      priority: PRIORITY.incomplete,
      title: copy.title,
      tone: copy.tone,
      reasons: ["R/L recording incomplete."],
      limitations,
      next: copy.next,
      safety: buildSafety(systemic),
      systemic,
      eyes: eyeResults,
    };
  }

  // src/referral-note.js?v=20260518-findingdropdown
  function formatFindings2(eye) {
    const labels = getFindingLabels(eye.findings);
    return labels.length > 0 ? labels.join(", ") : "none";
  }
  function formatSystemicChecks(state2) {
    const labelFor = {
      bp: "BP",
      lipids: "lipids",
      hba1c: "HbA1c",
    };
    const checked = SYSTEMIC_CHECKS.filter(
      (check) => state2.systemicChecks[check.key],
    ).map(
      (check) => labelFor[check.key] || check.label.replace(/\s+checked$/i, ""),
    );
    return checked.length > 0 ? checked.join(", ") : "none recorded";
  }
  function formatEyeLine(label, eye, mode) {
    const parts = [
      `VA ${getVaLabel(eye.distanceVA)}`,
      `view ${eye.viewQuality || "not recorded"}`,
      `findings: ${formatFindings2(eye)}`,
    ];
    const area = getAreaLabel(mode, eye.areaSeen);
    if (area !== "Not recorded") {
      parts.splice(2, 0, area);
    }
    return `${label}: ${parts.join("; ")}.`;
  }
  function buildReferralNote(state2, triage) {
    const lines = [];
    lines.push(`Diabetic retinal triage: ${triage.title}.`);
    lines.push(
      `Mode: ${MODE_LABELS[state2.mode]}. Dilated: ${state2.dilation || "not recorded"}.`,
    );
    lines.push(formatEyeLine("RE", state2.eyes.right, state2.mode));
    lines.push(formatEyeLine("LE", state2.eyes.left, state2.mode));
    const reasonParts = [...triage.reasons, ...triage.limitations];
    if (reasonParts.length > 0) {
      lines.push(`Reason: ${reasonParts.join(" ")}`);
    }
    lines.push(`Plan: ${triage.next}`);
    lines.push(`Systemic: ${formatSystemicChecks(state2)}.`);
    lines.push("Screening still required.");
    return lines.join("\n");
  }

  // src/practice-cases.js?v=20260518-findingdropdown
  var PRACTICE_CASES = DIABETIC_IMAGE_CASES.map((item, index) => ({
    id: item.id,
    level: index === 0 ? "primary" : index < 4 ? "intermediate" : "advanced",
    title: `Case ${index + 1}`,
    imageLabel: `${index + 1}/10`,
    imageSrc: item.thumbSrc || item.src,
    prompt: item.summary,
    answer: item.description || [],
  }));

  // src/mcq-data.js?v=20260518-findingdropdown
  var MCQ_LEVEL_META = {
    primary: {
      title: "Primary",
      passMark: 3,
      questionCount: 5,
      targetBankSize: 16,
    },
    intermediate: {
      title: "Intermediate",
      passMark: 4,
      questionCount: 6,
      targetBankSize: 26,
    },
    advanced: {
      title: "Advanced",
      passMark: 6,
      questionCount: 8,
      targetBankSize: 26,
    },
  };
  var MCQ_BANKS = {
    primary: [
      {
        question: "What does an ungradable view mean?",
        options: [
          "Normal retina",
          "Cannot assess safely",
          "No screening needed",
          "Only BP review",
        ],
        answer: 1,
        topic: "view-quality",
      },
      {
        question:
          "What is the safest wording after a partial clear view with no lesions seen?",
        options: [
          "Normal",
          "No referable signs seen in the view obtained",
          "No DR ever",
          "Discharge forever",
        ],
        answer: 1,
        topic: "safety-copy",
      },
      {
        question: "Which finding is a DR sign?",
        options: [
          "Microaneurysms",
          "NVD",
          "Vitreous haemorrhage",
          "Preretinal haemorrhage",
        ],
        answer: 0,
        topic: "npdr",
      },
      {
        question: "Which finding is a red flag?",
        options: ["CWS", "Dot/blot haemorrhage", "NVE", "Microaneurysm"],
        answer: 2,
        topic: "pdr",
      },
      {
        question: "What should Holo (BIO) prompt before recording the view?",
        options: [
          "Local dilation check",
          "Anti-VEGF choice",
          "Laser choice",
          "Spectacle prescription",
        ],
        answer: 0,
        topic: "dilation",
      },
      {
        question: "Which action fits possible vitreous haemorrhage?",
        options: [
          "Routine screening only",
          "Urgent today",
          "Ignore if VA is good",
          "Medical review only",
        ],
        answer: 1,
        topic: "urgent",
      },
      {
        question:
          "What does Distance VA 6/36 suggest when DR signs are present?",
        options: [
          "Possible macula risk",
          "No concern",
          "Confirmed DMO",
          "Confirmed proliferative DR",
        ],
        answer: 0,
        topic: "va",
      },
      {
        question: "Which systemic check belongs in the Action panel?",
        options: ["HbA1c", "Shoe size", "Height only", "Hair colour"],
        answer: 0,
        topic: "systemic",
      },
      {
        question: "What should the app record for eyes?",
        options: [
          "Right and left eyes",
          "Only the better eye",
          "Only the first eye seen",
          "No eye label",
        ],
        answer: 0,
        topic: "both-eyes",
      },
      {
        question: "Which option belongs to Arclight (DO) area seen?",
        options: [
          "Limited glimpses only",
          "Four-quadrant sweep",
          "OCT cube",
          "Fluorescein frame",
        ],
        answer: 0,
        topic: "mode",
      },
      {
        question: "Which option belongs to Holo (BIO)?",
        options: [
          "Four-quadrant sweep",
          "Spectacle axis",
          "Near add",
          "K reading",
        ],
        answer: 0,
        topic: "mode",
      },
      {
        question: "What does no referable signs mean?",
        options: [
          "No referable signs seen in the view obtained",
          "No diabetes",
          "Full normal retina",
          "Discharge from screening",
        ],
        answer: 0,
        topic: "safety-copy",
      },
      {
        question: "What is the app mainly for?",
        options: [
          "DR triage and teaching",
          "OCT diagnosis",
          "Treatment selection",
          "AI grading",
        ],
        answer: 0,
        topic: "scope",
      },
      {
        question: "Which is a macula-risk clue?",
        options: [
          "Hard exudates near macula",
          "Normal disc colour",
          "No diabetes history",
          "Clear lens",
        ],
        answer: 0,
        topic: "macula",
      },
      {
        question:
          "If both eyes are adequate with no referable signs, what remains required?",
        options: [
          "Routine diabetic screening",
          "No future screening",
          "Laser today",
          "Ignore diabetes",
        ],
        answer: 0,
        topic: "safety-copy",
      },
      {
        question: "Which sign suggests proliferative DR?",
        options: [
          "New vessels",
          "Microaneurysms",
          "Cotton-wool spots",
          "Hard exudates",
        ],
        answer: 0,
        topic: "pdr",
      },
    ],
    intermediate: [
      {
        question: "An eye has MA and dot/blot haemorrhages only. Best action?",
        options: [
          "Routine (weeks)",
          "Urgent today",
          "No screening required",
          "Choose laser",
        ],
        answer: 0,
        topic: "npdr",
      },
      {
        question:
          "Hard exudates near macula with 6/36 VA should usually trigger:",
        options: [
          "Soon (days)",
          "Routine screening only",
          "No action",
          "Confirmed DMO treatment",
        ],
        answer: 0,
        topic: "macula",
      },
      {
        question:
          "Which VA value is a documented reduced-VA trigger when DR context is present?",
        options: ["6/36", "6/6", "Blank", "Fix/follow"],
        answer: 0,
        topic: "va",
      },
      {
        question: "Which VA value is mild and should not escalate by itself?",
        options: ["6/12", "6/60", "HM", "No fix"],
        answer: 0,
        topic: "va",
      },
      {
        question: "One eye is clear, the other ungradable. Best output?",
        options: [
          "Ungradable or limited, not reassuring",
          "Routine screening only",
          "Normal",
          "Urgent laser",
        ],
        answer: 0,
        topic: "view-quality",
      },
      {
        question: "NVE in one eye and ungradable fellow eye should trigger:",
        options: [
          "Urgent today",
          "Ungradable only",
          "Routine screening",
          "No referral",
        ],
        answer: 0,
        topic: "priority",
      },
      {
        question:
          "What should ungradable fellow-eye information become when proliferative signs are seen in the other eye?",
        options: [
          "Limitation note",
          "Main action overriding proliferative signs",
          "Deleted",
          "Treatment choice",
        ],
        answer: 0,
        topic: "priority",
      },
      {
        question:
          "Which finding is macula risk rather than proliferative disease?",
        options: [
          "Hard exudates near macula",
          "NVD",
          "NVE",
          "Vitreous haemorrhage",
        ],
        answer: 0,
        topic: "macula",
      },
      {
        question: "Which finding is proliferative?",
        options: [
          "New vessels at disc",
          "Cotton-wool spots",
          "Microaneurysms",
          "Hard exudates",
        ],
        answer: 0,
        topic: "pdr",
      },
      {
        question:
          "A brief Arclight (DO) glimpse should usually be recorded as:",
        options: [
          "Limited unless disc and macula are clearly seen",
          "Full four-quadrant view",
          "Confirmed normal retina",
          "Confirmed no maculopathy",
        ],
        answer: 0,
        topic: "mode",
      },
      {
        question: "BP, lipids and HbA1c tick-boxes should:",
        options: [
          "Support medical review without changing retinal urgency",
          "Always make urgent",
          "Replace eye findings",
          "Confirm DMO",
        ],
        answer: 0,
        topic: "systemic",
      },
      {
        question: "If CWS is seen, the safer finding is:",
        options: [
          "Record CWS as a DR sign",
          "Call no referable signs",
          "Ignore the lesion",
          "Record normal retina",
        ],
        answer: 0,
        topic: "npdr",
      },
      {
        question:
          "If lesions are visible, no referable signs is unsafe because:",
        options: [
          "A finding has been seen",
          "VA is always normal",
          "Dilation is impossible",
          "Macula is always clear",
        ],
        answer: 0,
        topic: "safety-copy",
      },
      {
        question:
          "What is a safe Action-panel phrase after no lesions in partial view?",
        options: [
          "No referable signs seen in the view obtained",
          "Normal retina",
          "No DR in either eye",
          "Discharge",
        ],
        answer: 0,
        topic: "safety-copy",
      },
      {
        question: "What should the referral note include?",
        options: [
          "Right and left eye sections",
          "Only one combined eye",
          "Treatment dose",
          "Laser plan",
        ],
        answer: 0,
        topic: "referral-note",
      },
      {
        question: "Reduced VA with hard exudates near the macula suggests:",
        options: [
          "Macula risk needing soon referral",
          "Confirmed PDR",
          "No retinal concern",
          "Systemic review only",
        ],
        answer: 0,
        topic: "macula",
      },
      {
        question: "Which sign belongs in proliferative signs?",
        options: ["NVE", "CWS", "Microaneurysm", "Hard exudate"],
        answer: 0,
        topic: "pdr",
      },
      {
        question: "Which wording is safest for suspected maculopathy?",
        options: [
          "Possible maculopathy or macula risk",
          "Confirmed DMO",
          "No DR",
          "Laser required",
        ],
        answer: 0,
        topic: "macula",
      },
      {
        question:
          "What should routine DR signs without macula or proliferative signs use?",
        options: [
          "Routine (weeks)",
          "Urgent today",
          "No follow-up ever",
          "Anti-VEGF decision",
        ],
        answer: 0,
        topic: "npdr",
      },
      {
        question: "What should suspected foveal involvement trigger?",
        options: ["Soon (days)", "Routine only", "Ignore", "Confirmed DMO"],
        answer: 0,
        topic: "macula",
      },
      {
        question: "What does No test VA mean?",
        options: [
          "A limitation",
          "Perfect vision",
          "Confirmed proliferative DR",
          "No referral possible",
        ],
        answer: 0,
        topic: "va",
      },
      {
        question:
          "Which viewing method usually needs dilation for wider assessment?",
        options: ["Holo (BIO)", "Referral note", "VA line", "Systemic checks"],
        answer: 0,
        topic: "dilation",
      },
      {
        question: "What should be stored if not dilated?",
        options: [
          "Reason if not dilated",
          "Laser type",
          "OCT thickness",
          "Lens power",
        ],
        answer: 0,
        topic: "dilation",
      },
      {
        question: "What wins in mixed-risk findings?",
        options: [
          "Highest-risk sign",
          "First ticked sign",
          "Lowest-risk sign",
          "Drawer order",
        ],
        answer: 0,
        topic: "priority",
      },
      {
        question: "What should the app avoid?",
        options: [
          "Treatment selection",
          "Referral note",
          "Both-eye recording",
          "VA recording",
        ],
        answer: 0,
        topic: "scope",
      },
      {
        question: "Which DR sign makes a routine case more concerning?",
        options: [
          "Venous beading",
          "Normal disc colour",
          "Clear lens",
          "Equal pupils",
        ],
        answer: 0,
        topic: "npdr",
      },
    ],
    advanced: [
      {
        question: "Right eye NVD, left eye ungradable. Overall action?",
        options: [
          "Urgent today, with left-eye limitation note",
          "Ungradable only",
          "Routine referral",
          "Routine screening",
        ],
        answer: 0,
        topic: "priority",
      },
      {
        question:
          "Right eye clear adequate, left eye ungradable. Overall action?",
        options: [
          "Ungradable or limited view",
          "Routine screening still required only",
          "Urgent today",
          "No note needed",
        ],
        answer: 0,
        topic: "priority",
      },
      {
        question:
          "Both eyes clear adequate with no referable signs selected. Overall action?",
        options: [
          "Routine screening still required",
          "Ungradable",
          "Urgent today",
          "Refer soon",
        ],
        answer: 0,
        topic: "routine",
      },
      {
        question: "6/12 VA without DR findings should:",
        options: [
          "Be recorded without escalation by itself",
          "Trigger urgent today",
          "Confirm DMO",
          "Clear all findings",
        ],
        answer: 0,
        topic: "va",
      },
      {
        question: "6/36 VA plus dot/blot haemorrhages should support:",
        options: [
          "Soon (days)",
          "No action",
          "Confirmed proliferative DR",
          "Treatment choice",
        ],
        answer: 0,
        topic: "va",
      },
      {
        question: "Fix/follow means:",
        options: [
          "Non-standard VA, no escalation by itself",
          "Always urgent",
          "Confirmed maculopathy",
          "Ignore all findings",
        ],
        answer: 0,
        topic: "va",
      },
      {
        question: "No fix with DR signs should be treated as:",
        options: [
          "Reduced VA supporting Soon (days)",
          "Normal VA",
          "Confirmed proliferative DR",
          "No test needed",
        ],
        answer: 0,
        topic: "va",
      },
      {
        question: "No test VA with DR signs should:",
        options: [
          "Prevent reassuring wording and support Soon (days)",
          "Confirm normal vision",
          "Delete DR signs",
          "Choose laser",
        ],
        answer: 0,
        topic: "va",
      },
      {
        question:
          "Which finding should never be downgraded by ungradable fellow-eye view?",
        options: ["NVE", "Microaneurysm only", "No signs", "Blank VA"],
        answer: 0,
        topic: "priority",
      },
      {
        question: "Which combination is macula risk?",
        options: [
          "Hard exudates near macula plus reduced VA",
          "Clear view plus 6/6",
          "No signs plus blank VA",
          "BP checked only",
        ],
        answer: 0,
        topic: "macula",
      },
      {
        question: "Why avoid confirmed DMO wording?",
        options: [
          "OCT or stereo assessment is needed",
          "VA is never relevant",
          "DR cannot affect macula",
          "Referral notes cannot mention macula",
        ],
        answer: 0,
        topic: "macula",
      },
      {
        question: "Why is no referable signs unsafe when NVD is present?",
        options: [
          "NVD is urgent proliferative disease",
          "NVD is a normal vessel",
          "NVD means routine review only",
          "NVD confirms DMO",
        ],
        answer: 0,
        topic: "pdr",
      },
      {
        question:
          "If one eye has no signs and the fellow eye has NVE, overall action is:",
        options: [
          "Urgent today",
          "Routine screening only",
          "No referral",
          "Medical review only",
        ],
        answer: 0,
        topic: "priority",
      },
      {
        question:
          "Arclight (DO) cannot see the far periphery well. The key limitation is:",
        options: [
          "Peripheral disease may be missed",
          "Macula is always invisible",
          "VA cannot be recorded",
          "Dilation is irrelevant",
        ],
        answer: 0,
        topic: "mode",
      },
      {
        question: "Which data belongs in the referral note?",
        options: [
          "Whether dilation was done",
          "Anti-VEGF dose",
          "Laser settings",
          "OCT map",
        ],
        answer: 0,
        topic: "referral-note",
      },
      {
        question: "Which systemic action is sensible in LMIC settings?",
        options: [
          "Arrange diabetes/medical review when possible",
          "Ignore BP",
          "Let HbA1c change retinal urgency",
          "Use lipids as proliferative sign",
        ],
        answer: 0,
        topic: "systemic",
      },
      {
        question:
          "Which output should be avoided for limited Arclight (DO) view?",
        options: [
          "Normal retina",
          "Limitation note",
          "Routine screening reminder",
          "Referral note",
        ],
        answer: 0,
        topic: "safety-copy",
      },
      {
        question:
          "Which finding is enough for same-day referral even if VA is not recorded?",
        options: ["NVD", "Microaneurysm only", "Mild hard exudate", "No signs"],
        answer: 0,
        topic: "urgent",
      },
      {
        question: "What does red-flags-win mean?",
        options: [
          "Proliferative signs drive urgent today",
          "Red title changes urgency",
          "BP tick-box means urgent",
          "Practice score changes referral",
        ],
        answer: 0,
        topic: "urgent",
      },
      {
        question: "What should an urgent proliferative output emphasise?",
        options: [
          "Same-day eye referral",
          "Routine annual screening only",
          "Spectacle prescription",
          "No follow-up",
        ],
        answer: 0,
        topic: "urgent",
      },
      {
        question: "When R/L findings conflict, triage should use:",
        options: [
          "The highest-risk eye finding",
          "The better eye only",
          "The first completed field",
          "VA alone",
        ],
        answer: 0,
        topic: "priority",
      },
      {
        question: "Which finding group contains venous beading?",
        options: ["DR signs", "Proliferative signs", "Macula-only", "Systemic"],
        answer: 0,
        topic: "npdr",
      },
      {
        question:
          "Which category should CWS plus venous beading enter if no macula or proliferative signs?",
        options: [
          "Routine (weeks) or Soon (days) if concerning",
          "Urgent today always",
          "Routine screening only",
          "Confirmed DMO",
        ],
        answer: 0,
        topic: "npdr",
      },
      {
        question: "Which statement about Holo (BIO) is safest?",
        options: [
          "It can record four-quadrant sweep but only reports selected findings",
          "It confirms no DR if clear",
          "It replaces screening forever",
          "It chooses treatment",
        ],
        answer: 0,
        topic: "mode",
      },
      {
        question: "Which statement about Arclight (DO) is safest?",
        options: [
          "It should not imply a complete peripheral assessment",
          "It always sees four quadrants",
          "It confirms no maculopathy",
          "It replaces referral",
        ],
        answer: 0,
        topic: "mode",
      },
      {
        question:
          "Ungradable view with suspected vitreous blood should be treated as:",
        options: [
          "Urgent today",
          "Routine screening only",
          "No DR",
          "Confirmed DMO",
        ],
        answer: 0,
        topic: "urgent",
      },
    ],
  };

  // src/mcq.js?v=20260518-findingdropdown
  function shuffle(items) {
    const copy = [...items];
    for (let index = copy.length - 1; index > 0; index -= 1) {
      const swapIndex = Math.floor(Math.random() * (index + 1));
      [copy[index], copy[swapIndex]] = [copy[swapIndex], copy[index]];
    }
    return copy;
  }
  function prepareQuestion(question) {
    const options = question.options.map((label, index) => ({
      label,
      originalIndex: index,
    }));
    const shuffledOptions = shuffle(options);
    return {
      ...question,
      options: shuffledOptions,
      answer: shuffledOptions.findIndex(
        (option) => option.originalIndex === question.answer,
      ),
    };
  }
  function makeElement(tagName, className, text) {
    const element = document.createElement(tagName);
    if (className) element.className = className;
    if (text) element.textContent = text;
    return element;
  }
  function validateMcqBanks() {
    return Object.entries(MCQ_LEVEL_META).map(([level, meta]) => {
      const bank = MCQ_BANKS[level] || [];
      const invalidAnswers = bank.filter((question) => {
        return (
          !Array.isArray(question.options) ||
          question.answer < 0 ||
          question.answer >= question.options.length
        );
      });
      return {
        level,
        expected: meta.targetBankSize,
        actual: bank.length,
        invalidAnswers: invalidAnswers.length,
      };
    });
  }
  function createMcqController(elements2) {
    let currentQuestions = [];
    let currentMeta = null;
    function close() {
      elements2.modal.setAttribute("aria-hidden", "true");
      elements2.modal.hidden = true;
    }
    function renderQuestion(question, questionIndex) {
      const card = makeElement("fieldset", "mcq-question");
      const legend = makeElement(
        "legend",
        "mcq-question-title",
        `${questionIndex + 1}. ${question.question}`,
      );
      card.append(legend);
      question.options.forEach((option, optionIndex) => {
        const label = makeElement("label", "mcq-option");
        const input = document.createElement("input");
        input.type = "radio";
        input.name = `mcq_${questionIndex}`;
        input.value = String(optionIndex);
        const text = makeElement("span", "", option.label);
        label.append(input, text);
        card.append(label);
      });
      return card;
    }
    function open(level) {
      const meta = MCQ_LEVEL_META[level];
      const bank = MCQ_BANKS[level];
      if (!meta || !bank) return;
      currentMeta = meta;
      currentQuestions = shuffle(bank)
        .slice(0, meta.questionCount)
        .map(prepareQuestion);
      elements2.title.textContent = `${meta.title} MCQ`;
      elements2.intro.textContent = `${meta.questionCount} questions. Pass mark ${meta.passMark}.`;
      elements2.result.textContent = "";
      elements2.result.className = "mcq-result";
      elements2.submit.disabled = false;
      elements2.container.replaceChildren(
        ...currentQuestions.map(renderQuestion),
      );
      elements2.modal.hidden = false;
      elements2.modal.setAttribute("aria-hidden", "false");
      elements2.modalContent.focus();
    }
    function submit() {
      if (!currentMeta) return;
      let score = 0;
      const missedTopics = /* @__PURE__ */ new Set();
      currentQuestions.forEach((question, questionIndex) => {
        const selected = elements2.container.querySelector(
          `input[name="mcq_${questionIndex}"]:checked`,
        );
        const selectedIndex = selected ? Number(selected.value) : -1;
        const optionLabels = elements2.container.querySelectorAll(
          `input[name="mcq_${questionIndex}"]`,
        );
        optionLabels.forEach((input) => {
          input.disabled = true;
          const label = input.closest(".mcq-option");
          label.classList.remove("is-correct", "is-wrong");
          const value = Number(input.value);
          if (value === question.answer) {
            label.classList.add("is-correct");
          }
          if (value === selectedIndex && value !== question.answer) {
            label.classList.add("is-wrong");
          }
        });
        if (selectedIndex === question.answer) {
          score += 1;
        } else {
          missedTopics.add(question.topic);
        }
      });
      const passed = score >= currentMeta.passMark;
      elements2.result.textContent = `Score ${score}/${currentMeta.questionCount}. ${passed ? "Pass." : "Review and retry."}`;
      if (missedTopics.size > 0) {
        const topics = makeElement(
          "p",
          "mcq-topics",
          `Review: ${[...missedTopics].join(", ")}.`,
        );
        elements2.result.append(topics);
      }
      elements2.result.classList.toggle("is-pass", passed);
      elements2.result.classList.toggle("is-review", !passed);
      elements2.submit.disabled = true;
    }
    elements2.close.addEventListener("click", close);
    elements2.submit.addEventListener("click", submit);
    return {
      open,
      close,
    };
  }

  // src/ui-shell.js?v=20260518-findingdropdown
  function setupDrawer({ menuButton, closeButton, drawer, overlay }) {
    function open() {
      overlay.hidden = false;
      drawer.classList.add("is-open");
      overlay.classList.add("is-visible");
      drawer.inert = false;
      drawer.removeAttribute("inert");
      drawer.setAttribute("aria-hidden", "false");
      menuButton.setAttribute("aria-expanded", "true");
    }
    function close() {
      drawer.classList.remove("is-open");
      overlay.classList.remove("is-visible");
      overlay.hidden = true;
      drawer.inert = true;
      drawer.setAttribute("inert", "");
      drawer.setAttribute("aria-hidden", "true");
      menuButton.setAttribute("aria-expanded", "false");
    }
    menuButton.addEventListener("click", open);
    closeButton.addEventListener("click", close);
    overlay.addEventListener("click", close);
    document.addEventListener("keydown", (event) => {
      if (event.key === "Escape") close();
    });
    return { open, close };
  }
  function setupInfoPopup({ button, popup, closeButton }) {
    function open() {
      popup.hidden = false;
      popup.setAttribute("aria-hidden", "false");
      button.setAttribute("aria-expanded", "true");
      popup.focus();
    }
    function close() {
      popup.hidden = true;
      popup.setAttribute("aria-hidden", "true");
      button.setAttribute("aria-expanded", "false");
    }
    button.addEventListener("click", () => {
      if (popup.hidden) {
        open();
      } else {
        close();
      }
    });
    closeButton.addEventListener("click", close);
    document.addEventListener("keydown", (event) => {
      if (event.key === "Escape") close();
    });
    return { open, close };
  }
  function setupTabs({ tabs, panels = [], onChange }) {
    const tabList = [...tabs];
    const panelList = [...panels];
    function activate(tab) {
      const targetId = tab.dataset.tabTarget;
      tabList.forEach((button) => {
        const selected = button === tab;
        button.classList.toggle("active", selected);
        button.setAttribute("aria-selected", String(selected));
        button.tabIndex = selected ? 0 : -1;
      });
      panelList.forEach((panel) => {
        const selected = panel.id === targetId;
        panel.classList.toggle("active", selected);
        panel.hidden = !selected;
      });
      onChange == null ? void 0 : onChange(tab.dataset.mode);
    }
    function handleKeydown(event) {
      const keys = ["ArrowLeft", "ArrowRight", "Home", "End"];
      if (!keys.includes(event.key)) return;
      event.preventDefault();
      const currentIndex = tabList.indexOf(event.currentTarget);
      let nextIndex = currentIndex;
      if (event.key === "ArrowRight") {
        nextIndex = (currentIndex + 1) % tabList.length;
      } else if (event.key === "ArrowLeft") {
        nextIndex = (currentIndex - 1 + tabList.length) % tabList.length;
      } else if (event.key === "Home") {
        nextIndex = 0;
      } else if (event.key === "End") {
        nextIndex = tabList.length - 1;
      }
      tabList[nextIndex].focus();
      activate(tabList[nextIndex]);
    }
    tabList.forEach((tab) => {
      tab.addEventListener("click", () => activate(tab));
      tab.addEventListener("keydown", handleKeydown);
    });
  }
  function openModal(modal, content) {
    modal.hidden = false;
    modal.setAttribute("aria-hidden", "false");
    content == null ? void 0 : content.focus();
  }
  function closeModal(modal) {
    modal.hidden = true;
    modal.setAttribute("aria-hidden", "true");
  }

  // script.js
  var state = createInitialState();
  var currentTriage = evaluateTriage(state);
  var actionExpanded = false;
  var examExpanded = false;
  var openFindingsEye = null;
  var openFindingDetailKey = null;
  var $ = (selector) => document.querySelector(selector);
  var $$ = (selector) => Array.from(document.querySelectorAll(selector));
  var elements = {
    canvas: $("#fundusCanvas"),
    fovToggle: $("#fovToggle"),
    fovLabelSmall: $("#fovLabelSmall"),
    fovLabelLeft: $("#fovLabelLeft"),
    fovLabelRight: $("#fovLabelRight"),
    eyeToggle: $("#eyeToggle"),
    eyeLabelRight: $("#eyeLabelRight"),
    eyeLabelLeft: $("#eyeLabelLeft"),
    cataractSlider: $("#cataractSlider"),
    cataractStops: $$(".cataract-stop"),
    viewerDilationToggle: $("#viewerDilationToggle"),
    gazeMoveToggle: $("#gazeMoveToggle"),
    viewerPigmentationToggle: $("#viewerPigmentationToggle"),
    viewerPigmentationText: $("#viewerPigmentationText"),
    viewerExplanation: $("#viewerExplanation"),
    previousCaseButton: $("#previousCaseButton"),
    nextCaseButton: $("#nextCaseButton"),
    viewerCaseLabel: $("#viewerCaseLabel"),
    viewerCaseShortLabel: $("#viewerCaseShortLabel"),
    viewerCaseSummaryToggle: $("#viewerCaseSummaryToggle"),
    viewerCaseDescription: $("#viewerCaseDescription"),
    viewerCaseDescriptionTitle: $("#viewerCaseDescriptionTitle"),
    viewerCaseDescriptionBody: $("#viewerCaseDescriptionBody"),
    rightDistanceVA: $("#rightDistanceVA"),
    leftDistanceVA: $("#leftDistanceVA"),
    rightViewStatusSelect: $("#rightViewStatusSelect"),
    leftViewStatusSelect: $("#leftViewStatusSelect"),
    findingsContainer: $("#findingsContainer"),
    recordingSystemPanel: $(".recording-system-panel"),
    recordingSystemContent: $("#recordingSystemContent"),
    recordingSystemToggle: $("#recordingSystemToggle"),
    actionPanel: $(".action-panel"),
    actionDetails: $("#actionDetails"),
    actionToggle: $("#actionToggle"),
    actionCard: $("#actionCard"),
    actionTone: $("#actionTone"),
    actionTitle: $("#actionTitle"),
    actionReasons: $("#actionReasons"),
    actionLimitations: $("#actionLimitations"),
    actionNext: $("#actionNext"),
    actionSafety: $("#actionSafety"),
    referralModal: $("#referralModal"),
    referralModalContent: $("#referralModalContent"),
    referralText: $("#referralText"),
    copyStatus: $("#copyStatus"),
    shareReferralButton: $("#shareReferralButton"),
    practiceModal: $("#practiceModal"),
    practiceModalContent: $("#practiceModalContent"),
    practiceCases: $("#practiceCases"),
    guideModal: $("#guideModal"),
    guideModalContent: $("#guideModalContent"),
    guideTitle: $("#guideTitle"),
    guideContent: $("#guideContent"),
  };
  var isSyncingViewerDilation = false;
  var activeViewerCaseIndex = 0;
  var gazeMoveIntervalId = null;
  var caseDescriptionOpen = false;
  var preloadedViewerImages = /* @__PURE__ */ new Map();
  function getViewerCaseImageSrc(caseItem) {
    return state.viewer.pigmentation === "dark"
      ? caseItem.darkSrc || caseItem.src
      : caseItem.src;
  }
  function getViewerCaseImageScale(caseItem) {
    return Number.isFinite(caseItem.viewScale) ? caseItem.viewScale : 1;
  }
  var viewer = createViewer({
    state,
    canvas: elements.canvas,
    fovToggleCheckbox: elements.fovToggle,
    fovLabelSmall: elements.fovLabelSmall,
    fovLabelLeft: elements.fovLabelLeft,
    fovLabelRight: elements.fovLabelRight,
    eyeToggleCheckbox: elements.eyeToggle,
    eyeLabelRight: elements.eyeLabelRight,
    eyeLabelLeft: elements.eyeLabelLeft,
    cataractSlider: elements.cataractSlider,
    cataractStops: elements.cataractStops,
    explanation: elements.viewerExplanation,
    conditionButtons: [],
    defaultImageSrc: DEFAULT_VIEWER_IMAGE_SRC,
    explanationTemplates: VIEWER_EXPLANATION_TEMPLATES,
    cataractPresets: CATARACT_PRESETS,
    cataractOcclusionSpots: CATARACT_OCCLUSION_SPOTS,
    onDilationChange: (isDilated) => {
      if (isSyncingViewerDilation) return;
      setClinicalDilation(isDilated, { syncViewer: false });
    },
  });
  var guideText = {
    cases: {
      label: "Practice cases",
      intro:
        "Use the 10 retinal images as recognition practice, then record the clinical exam below.",
      cues: [
        ["Cases", "< / > changes case"],
        ["Skin", "light or dark retina"],
        ["Eye", "R/L orientation"],
      ],
      detailTitle: "How to use",
      details: [
        ["Cases", "Use < and > to move through the 10 image cases."],
        [
          "Skin",
          "Switches between light and dark pigmentation versions of the same case.",
        ],
        [
          "R/L",
          "Changes viewing orientation only. Record RE and LE separately below.",
        ],
      ],
      footer: [
        "The image case is practice material. The Exam box is the record.",
      ],
    },
    viewing: {
      label: "Viewing controls",
      intro:
        "Choose the viewing method, then make the simulated view match what was actually seen.",
      cues: [
        ["DO", "small direct view"],
        ["BIO", "wider lens view"],
        ["Cat", "cataract blur"],
      ],
      detailTitle: "Controls",
      details: [
        ["Arclight", "Small direct view for disc and macula glimpses."],
        [
          "Holo",
          "Wider BIO-style lens view. Dilated increases the field when dilation is recorded.",
        ],
        [
          "Gaze",
          "Moves the viewing window. Cataract adds slight, medium or full blur.",
        ],
      ],
      footer: [
        "The controls are for viewing difficulty, not for changing the clinical finding.",
      ],
    },
    recording: {
      label: "Recording",
      intro: "Record each eye separately before relying on the Action wording.",
      cues: [
        ["VA", "vision level"],
        ["View", "quality and area"],
        ["Findings", "signs by eye"],
      ],
      detailTitle: "Exam fields",
      details: [
        ["VA", "Record VA separately for RE and LE."],
        [
          "View",
          "Use Disc+mac, Post pole, Limited, Hazy or Ungradable to describe the view.",
        ],
        [
          "Findings",
          "Record findings by eye. Complete both eyes where possible.",
        ],
      ],
      footer: ["Blank fields mean incomplete recording, not a normal result."],
    },
    findings: {
      label: "Findings",
      intro:
        "Use the finding groups to separate background DR, macula risk and proliferative red flags.",
      cues: [
        ["DR signs", "MA, D/B, CWS, VB"],
        ["Macula", "HE or fovea risk"],
        ["Urgent", "NVD, NVE, PR-H, Vit H"],
      ],
      detailTitle: "Finding groups",
      details: [
        [
          "DR signs",
          "Microaneurysm, dot/blot haemorrhage, cotton-wool spot or venous beading.",
        ],
        [
          "Macula risk",
          "Hard exudates near the macula, fovea risk or reduced VA with DR signs.",
        ],
        [
          "Urgent",
          "NVD, NVE, preretinal haemorrhage or vitreous haemorrhage means urgent today.",
        ],
      ],
      footer: [
        "Use the small chevrons beside each finding for short explanations.",
      ],
    },
    action: {
      label: "Action",
      intro:
        "Action combines the highest-risk finding with view quality, VA and whether both eyes are recorded.",
      cues: [
        ["Routine", "weeks"],
        ["Soon", "days"],
        ["Urgent", "today"],
      ],
      detailTitle: "Priority rules",
      details: [
        ["Routine", "DR signs without macula-risk or proliferative signs."],
        ["Soon", "Possible macula risk or reduced VA with DR signs."],
        [
          "Urgent",
          "NVD, NVE, preretinal haemorrhage or vitreous haemorrhage overrides other wording.",
        ],
      ],
      footer: [
        "Ungradable or incomplete fellow-eye recording is kept as a limitation.",
      ],
    },
    about: {
      label: "Safety",
      intro:
        "This app supports teaching and triage. It does not replace formal diabetic eye screening.",
      cues: [
        ["Scope", "teaching aid"],
        ["No signs", "view obtained only"],
        ["Pathway", "local rules"],
      ],
      detailTitle: "Safety wording",
      details: [
        [
          "Scope",
          "Use as a teaching and triage aid, not as a formal screening replacement.",
        ],
        [
          "No signs",
          "Means no referable signs were seen in the view obtained.",
        ],
        [
          "Referral",
          "Adapt referral wording to local pathways and clinical judgement.",
        ],
      ],
      footer: ["Routine diabetic eye screening is still required."],
    },
  };
  var VIEW_STATUS_OPTIONS = {
    "arclight-do": [
      { value: "", label: "", viewQuality: "", areaSeen: "" },
      {
        value: "disc-macula-clear",
        label: "Disc+mac",
        viewQuality: "clear",
        areaSeen: "disc-macula",
      },
      {
        value: "posterior-pole-clear",
        label: "Post pole",
        viewQuality: "clear",
        areaSeen: "posterior-pole",
      },
      {
        value: "limited",
        label: "Limited",
        viewQuality: "partial",
        areaSeen: "limited",
      },
      {
        value: "hazy",
        label: "Hazy",
        viewQuality: "hazy",
        areaSeen: "limited",
      },
      {
        value: "ungradable",
        label: "Ungradable",
        viewQuality: "ungradable",
        areaSeen: "limited",
      },
    ],
    "holo-bio": [
      { value: "", label: "", viewQuality: "", areaSeen: "" },
      {
        value: "four-quadrants-clear",
        label: "4 quad",
        viewQuality: "clear",
        areaSeen: "four-quadrants",
      },
      {
        value: "disc-macula-clear",
        label: "Disc+mac",
        viewQuality: "clear",
        areaSeen: "disc-macula",
      },
      {
        value: "posterior-pole-clear",
        label: "Post pole",
        viewQuality: "clear",
        areaSeen: "posterior-pole",
      },
      {
        value: "limited",
        label: "Limited",
        viewQuality: "partial",
        areaSeen: "limited",
      },
      {
        value: "hazy",
        label: "Hazy",
        viewQuality: "hazy",
        areaSeen: "limited",
      },
      {
        value: "ungradable",
        label: "Ungradable",
        viewQuality: "ungradable",
        areaSeen: "limited",
      },
    ],
  };
  function getViewStatusOptions(mode) {
    return VIEW_STATUS_OPTIONS[mode] || VIEW_STATUS_OPTIONS["arclight-do"];
  }
  function getViewStatusValue(mode, eye) {
    const options = getViewStatusOptions(mode);
    const exact = options.find(
      (option) =>
        option.viewQuality === eye.viewQuality &&
        option.areaSeen === eye.areaSeen,
    );
    if (exact) return exact.value;
    if (eye.viewQuality === "ungradable") return "ungradable";
    if (eye.viewQuality === "hazy") return "hazy";
    if (eye.viewQuality === "partial" || eye.areaSeen === "limited")
      return "limited";
    return "";
  }
  function applyViewStatus(eyeKey, value) {
    const option =
      getViewStatusOptions(state.mode).find((item) => item.value === value) ||
      getViewStatusOptions(state.mode)[0];
    setEyeField(state, eyeKey, "viewQuality", option.viewQuality);
    setEyeField(state, eyeKey, "areaSeen", option.areaSeen);
  }
  function getFindingSummary(eyeKey) {
    const findings = state.eyes[eyeKey].findings;
    const selected = FINDING_GROUPS.flatMap((group) => group.findings).filter(
      (finding) => Boolean(findings[finding.key]),
    );
    if (findings.noReferableSignsSeen) {
      return "No signs";
    }
    if (selected.length === 0) {
      return "Not recorded";
    }
    if (selected.length <= 2) {
      return selected
        .map((finding) => finding.shortLabel || finding.label)
        .join(", ");
    }
    return `${selected
      .slice(0, 2)
      .map((finding) => finding.shortLabel || finding.label)
      .join(", ")} +${selected.length - 2}`;
  }
  function makeElement2(tagName, className, text) {
    const element = document.createElement(tagName);
    if (className) element.className = className;
    if (text !== void 0) element.textContent = text;
    return element;
  }
  function populateVaSelect(select) {
    select.replaceChildren(
      ...VA_OPTIONS.map((option) => {
        const optionElement = document.createElement("option");
        optionElement.value = option.value;
        optionElement.textContent = option.label;
        return optionElement;
      }),
    );
  }
  function populateSelect(select, options, selectedValue) {
    select.replaceChildren(
      ...options.map((option) => {
        const optionElement = document.createElement("option");
        optionElement.value = option.value;
        optionElement.textContent = option.shortLabel || option.label;
        optionElement.title = option.label;
        return optionElement;
      }),
    );
    select.value = selectedValue || "";
  }
  function renderFindings() {
    const dropdowns = makeElement2("div", "findings-dropdowns");
    ["right", "left"].forEach((eyeKey) => {
      const details = makeElement2("details", "finding-dropdown");
      details.dataset.eye = eyeKey;
      details.open = openFindingsEye === eyeKey;
      const summary = makeElement2("summary", "finding-dropdown-summary");
      summary.append(
        makeElement2("span", "finding-dropdown-title", "Findings"),
        makeElement2(
          "span",
          "finding-dropdown-value",
          getFindingSummary(eyeKey),
        ),
      );
      const menu = makeElement2("div", "finding-dropdown-menu");
      FINDING_GROUPS.forEach((group) => {
        const groupWrap = makeElement2(
          "section",
          `finding-dropdown-group finding-dropdown-group--${group.tone}`,
        );
        groupWrap.append(makeElement2("h3", "", group.title));
        const options = makeElement2("div", "finding-dropdown-options");
        group.findings.forEach((finding) => {
          const detailKey = `${eyeKey}:${finding.key}`;
          const detailId = `findingDetail-${eyeKey}-${finding.key}`;
          const isDetailOpen = openFindingDetailKey === detailKey;
          const optionWrap = makeElement2(
            "div",
            `finding-detail-item${isDetailOpen ? " is-open" : ""}`,
          );
          const optionSummary = makeElement2("div", "finding-detail-summary");
          const label = makeElement2("label", "finding-dropdown-option");
          const input = document.createElement("input");
          input.type = "checkbox";
          input.name = `finding-${eyeKey}`;
          input.value = finding.key;
          input.setAttribute(
            "aria-label",
            `${eyeKey === "right" ? "Right" : "Left"} ${finding.label}`,
          );
          input.checked = Boolean(state.eyes[eyeKey].findings[finding.key]);
          label.title = finding.label;
          label.classList.toggle("is-selected", input.checked);
          input.addEventListener("change", () => {
            setFinding(state, eyeKey, finding.key, input.checked);
            openFindingsEye = eyeKey;
            render();
          });
          label.append(
            input,
            makeElement2("span", "", finding.shortLabel || finding.label),
          );
          const detailToggle = makeElement2("button", "finding-detail-toggle");
          detailToggle.type = "button";
          detailToggle.setAttribute("aria-expanded", String(isDetailOpen));
          detailToggle.setAttribute("aria-controls", detailId);
          detailToggle.setAttribute(
            "aria-label",
            `${isDetailOpen ? "Hide" : "Show"} ${finding.shortLabel || finding.label} explanation`,
          );
          detailToggle.append(
            makeElement2("span", "finding-detail-toggle-icon", "\u2304"),
          );
          detailToggle.addEventListener("click", () => {
            openFindingsEye = eyeKey;
            openFindingDetailKey = isDetailOpen ? null : detailKey;
            render();
          });
          const detail = makeElement2("div", "finding-detail-panel");
          detail.id = detailId;
          detail.hidden = !isDetailOpen;
          const detailText = makeElement2("p");
          detailText.append(
            makeElement2("strong", "", `${finding.label}.`),
            ` ${finding.detail || finding.label}`,
          );
          detail.append(detailText);
          optionSummary.append(label, detailToggle);
          optionWrap.append(optionSummary, detail);
          options.append(optionWrap);
        });
        groupWrap.append(options);
        menu.append(groupWrap);
      });
      details.addEventListener("toggle", () => {
        if (details.open) {
          openFindingsEye = eyeKey;
          dropdowns
            .querySelectorAll(".finding-dropdown[open]")
            .forEach((item) => {
              if (item !== details) item.open = false;
            });
        } else if (openFindingsEye === eyeKey) {
          openFindingsEye = null;
          openFindingDetailKey = null;
          details
            .querySelectorAll('.finding-detail-toggle[aria-expanded="true"]')
            .forEach((button) => {
              var _a;
              const detail = document.getElementById(
                button.getAttribute("aria-controls") || "",
              );
              button.setAttribute("aria-expanded", "false");
              detail == null ? void 0 : detail.setAttribute("hidden", "");
              (_a = button.closest(".finding-detail-item")) == null
                ? void 0
                : _a.classList.remove("is-open");
            });
        }
      });
      details.append(summary, menu);
      dropdowns.append(details);
    });
    elements.findingsContainer.replaceChildren(dropdowns);
  }
  function renderViewControls() {
    populateSelect(
      elements.rightViewStatusSelect,
      getViewStatusOptions(state.mode),
      getViewStatusValue(state.mode, state.eyes.right),
    );
    populateSelect(
      elements.leftViewStatusSelect,
      getViewStatusOptions(state.mode),
      getViewStatusValue(state.mode, state.eyes.left),
    );
  }
  function renderActionList(container, items) {
    const paragraphs =
      items.length > 0
        ? items.map((item) => makeElement2("p", "", item))
        : [makeElement2("p", "", "No reason recorded yet.")];
    container.replaceChildren(...paragraphs);
  }
  function renderAction() {
    currentTriage = evaluateTriage(state);
    elements.actionTitle.textContent = currentTriage.title;
    elements.actionTone.textContent = currentTriage.title;
    elements.actionTone.className = `action-tone tone-${currentTriage.tone}`;
    elements.actionCard.className = `action-card tone-${currentTriage.tone}`;
    elements.actionPanel.classList.toggle("is-collapsed", !actionExpanded);
    elements.actionPanel.classList.toggle("is-expanded", actionExpanded);
    elements.actionDetails.hidden = !actionExpanded;
    elements.actionDetails.setAttribute("aria-hidden", String(!actionExpanded));
    elements.actionToggle.textContent = actionExpanded ? "\xD7" : "+";
    elements.actionToggle.setAttribute(
      "aria-label",
      actionExpanded ? "Close action details" : "Show action details",
    );
    elements.actionToggle.setAttribute("aria-expanded", String(actionExpanded));
    renderActionList(elements.actionReasons, currentTriage.reasons);
    renderActionList(elements.actionLimitations, currentTriage.limitations);
    elements.actionNext.textContent = currentTriage.next;
    elements.actionSafety.textContent = currentTriage.safety.join(" ");
  }
  function renderExamCollapse() {
    elements.recordingSystemPanel.classList.toggle(
      "is-collapsed",
      !examExpanded,
    );
    elements.recordingSystemContent.hidden = !examExpanded;
    elements.recordingSystemContent.setAttribute(
      "aria-hidden",
      String(!examExpanded),
    );
    elements.recordingSystemToggle.textContent = examExpanded ? "-" : "+";
    elements.recordingSystemToggle.setAttribute(
      "aria-expanded",
      String(examExpanded),
    );
    elements.recordingSystemToggle.setAttribute(
      "aria-label",
      examExpanded ? "Collapse Exam" : "Expand Exam",
    );
  }
  function renderViewerCaseNavigation() {
    const caseNumber = activeViewerCaseIndex + 1;
    const caseItem = DIABETIC_IMAGE_CASES[activeViewerCaseIndex];
    const summary = caseItem.summary || `Case ${caseNumber}`;
    const descriptionLines = caseItem.description || [];
    elements.viewerCaseLabel.textContent = `${caseNumber}/${DIABETIC_IMAGE_CASES.length}`;
    elements.viewerCaseLabel.setAttribute(
      "aria-label",
      `Case ${caseNumber} of ${DIABETIC_IMAGE_CASES.length}`,
    );
    elements.viewerCaseShortLabel.textContent = "Case information";
    elements.viewerCaseSummaryToggle.setAttribute(
      "aria-expanded",
      String(caseDescriptionOpen),
    );
    elements.viewerCaseSummaryToggle.setAttribute(
      "aria-label",
      caseDescriptionOpen
        ? `Info: hide case ${caseNumber} description, ${summary}`
        : `Info: show case ${caseNumber} description`,
    );
    elements.viewerCaseDescription.hidden = !caseDescriptionOpen;
    elements.viewerCaseDescription.setAttribute(
      "aria-hidden",
      String(!caseDescriptionOpen),
    );
    elements.viewerCaseDescriptionTitle.textContent = `${caseNumber}/${DIABETIC_IMAGE_CASES.length}: ${summary}`;
    elements.viewerCaseDescriptionBody.replaceChildren(
      ...descriptionLines.map((line) => makeElement2("p", "", line)),
    );
  }
  function setViewerCase(index) {
    const totalCases = DIABETIC_IMAGE_CASES.length;
    activeViewerCaseIndex = (index + totalCases) % totalCases;
    caseDescriptionOpen = false;
    const caseItem = DIABETIC_IMAGE_CASES[activeViewerCaseIndex];
    viewer.setViewerCase({
      condition: caseItem.id,
      imagePath: getViewerCaseImageSrc(caseItem),
      imageScale: getViewerCaseImageScale(caseItem),
    });
    renderViewerCaseNavigation();
    prefetchViewerImages();
  }
  function setGazeMoveEnabled(enabled) {
    if (gazeMoveIntervalId !== null) {
      window.clearInterval(gazeMoveIntervalId);
      gazeMoveIntervalId = null;
    }
    elements.gazeMoveToggle.checked = Boolean(enabled);
    if (!enabled) return;
    viewer.doGazeShift();
    gazeMoveIntervalId = window.setInterval(() => {
      if (!state.viewer.shiftInProgress) {
        viewer.doGazeShift();
      }
    }, 3600);
  }
  function setClinicalDilation(isDilated, options = {}) {
    const nextValue = isDilated ? "yes" : "no";
    const syncViewer = options.syncViewer !== false;
    const hasChanged = state.dilation !== nextValue;
    setDilation(state, nextValue);
    if (syncViewer) {
      isSyncingViewerDilation = true;
      viewer.setDilated(isDilated);
      isSyncingViewerDilation = false;
    }
    if (hasChanged) {
      render();
    } else {
      renderDilation();
    }
  }
  function renderDilation() {
    const isDilated = state.dilation === "yes";
    elements.viewerDilationToggle.checked = isDilated;
  }
  function renderPigmentationControl() {
    const isDark = state.viewer.pigmentation === "dark";
    elements.viewerPigmentationToggle.disabled = false;
    elements.viewerPigmentationToggle.checked = isDark;
    elements.viewerPigmentationText.textContent = isDark ? "Dark" : "Light";
  }
  function renderVa() {
    elements.rightDistanceVA.value = state.eyes.right.distanceVA;
    elements.leftDistanceVA.value = state.eyes.left.distanceVA;
  }
  function render() {
    renderDilation();
    renderPigmentationControl();
    renderVa();
    renderViewControls();
    renderFindings();
    renderAction();
    renderExamCollapse();
  }
  function makeGuideCue([label, detail]) {
    const cue = makeElement2("span", "info-basics-cue");
    cue.append(
      makeElement2("strong", "", label),
      makeElement2("small", "", detail),
    );
    return cue;
  }
  function makeGuideDetail([label, detail]) {
    const paragraph = makeElement2("p");
    paragraph.append(makeElement2("strong", "", `${label}:`), ` ${detail}`);
    return paragraph;
  }
  function renderGuideContent(guide) {
    const definition = makeElement2("section", "info-guide-definition");
    definition.append(
      makeElement2("p", "info-look-title", guide.label),
      makeElement2("p", "", guide.intro),
    );
    const dividerTop = document.createElement("hr");
    const guideWrap = makeElement2("div", "info-look-guide");
    const basics = makeElement2(
      "section",
      "info-look-section info-look-section--basics",
    );
    basics.append(
      makeElement2("p", "info-look-title", "Basics"),
      makeElement2("div", "info-basics-grid"),
    );
    basics.lastElementChild.append(...guide.cues.map(makeGuideCue));
    const detail = makeElement2(
      "section",
      "info-look-section info-look-section--detail",
    );
    detail.append(
      makeElement2("p", "info-look-title", guide.detailTitle),
      ...guide.details.map(makeGuideDetail),
    );
    guideWrap.append(basics, detail);
    const dividerBottom = document.createElement("hr");
    const footer = makeElement2("div", "info-points");
    footer.append(...guide.footer.map((line) => makeElement2("p", "", line)));
    return [definition, dividerTop, guideWrap, dividerBottom, footer];
  }
  function openGuide(key) {
    const title =
      {
        cases: "Cases and skin",
        viewing: "Viewing controls",
        recording: "Record RE/LE",
        findings: "Findings guide",
        action: "Action wording",
        about: "Safety and local pathways",
      }[key] || "Guide";
    const guide = guideText[key] || guideText.about;
    elements.guideTitle.textContent = title;
    elements.guideContent.replaceChildren(...renderGuideContent(guide));
    openModal(elements.guideModal, elements.guideModalContent);
  }
  function renderPracticeCases() {
    const cards = PRACTICE_CASES.map((item, index) => {
      const card = makeElement2("article", "practice-card");
      card.tabIndex = 0;
      card.setAttribute("role", "button");
      card.setAttribute("aria-label", `Open ${item.title}: ${item.prompt}`);
      card.dataset.caseIndex = String(index);
      const preview = makeElement2("figure", "practice-image");
      const image = document.createElement("img");
      image.src = item.imageSrc;
      image.alt = "";
      image.loading = "lazy";
      image.decoding = "async";
      preview.append(image, makeElement2("figcaption", "", item.imageLabel));
      const content = makeElement2("div", "practice-card-copy");
      const answerLines = Array.isArray(item.answer)
        ? item.answer
        : [item.answer];
      content.append(
        makeElement2("h3", "", item.title),
        makeElement2("p", "practice-card-summary", item.prompt),
        ...answerLines.map((line) => makeElement2("p", "", line)),
        makeElement2("span", "practice-card-action", "Open case >"),
      );
      card.append(preview, content);
      return card;
    });
    elements.practiceCases.replaceChildren(...cards);
  }
  function openPracticeCase(caseIndex) {
    setViewerCase(caseIndex);
    closeModal(elements.practiceModal);
  }
  function openReferralNote() {
    elements.referralText.value = buildReferralNote(state, currentTriage);
    elements.copyStatus.textContent = "";
    elements.shareReferralButton.hidden = !navigator.share;
    openModal(elements.referralModal, elements.referralModalContent);
  }
  async function copyReferralNote() {
    elements.referralText.select();
    try {
      await navigator.clipboard.writeText(elements.referralText.value);
      elements.copyStatus.textContent = "Copied.";
    } catch (e) {
      document.execCommand("copy");
      elements.copyStatus.textContent = "Copied.";
    }
  }
  async function shareReferralNote() {
    if (!navigator.share) {
      elements.copyStatus.textContent = "Sharing is not available here.";
      return;
    }
    try {
      await navigator.share({
        title: "Diabetic referral note",
        text: elements.referralText.value,
      });
      elements.copyStatus.textContent = "Shared.";
    } catch (error) {
      if ((error == null ? void 0 : error.name) !== "AbortError") {
        elements.copyStatus.textContent = "Share failed.";
      }
    }
  }
  function prefetchViewerImages() {
    if (typeof window === "undefined" || typeof Image === "undefined") return;
    const totalCases = DIABETIC_IMAGE_CASES.length;
    const indices = [
      activeViewerCaseIndex,
      (activeViewerCaseIndex + totalCases - 1) % totalCases,
      (activeViewerCaseIndex + 1) % totalCases,
    ];
    const sources = new Set(
      indices
        .map((index) => getViewerCaseImageSrc(DIABETIC_IMAGE_CASES[index]))
        .filter(Boolean),
    );
    const preload = () => {
      sources.forEach((src) => {
        if (preloadedViewerImages.has(src)) return;
        const image = new Image();
        image.decoding = "async";
        preloadedViewerImages.set(src, image);
        image.src = src;
      });
    };
    if (typeof window.requestIdleCallback === "function") {
      window.requestIdleCallback(preload, { timeout: 1200 });
    } else {
      window.setTimeout(preload, 220);
    }
  }
  function setupEventHandlers() {
    const drawerController = setupDrawer({
      menuButton: $("#menuButton"),
      closeButton: $("#closeDrawerButton"),
      drawer: $("#sideMenu"),
      overlay: $("#drawerOverlay"),
    });
    setupInfoPopup({
      button: $("#infoButton"),
      popup: $("#infoPopup"),
      closeButton: $("#closeInfoButton"),
    });
    setupTabs({
      tabs: $$(".tab-btn[data-mode]"),
      onChange: (mode) => {
        setMode(state, mode);
        viewer.setViewerMode(mode);
        render();
      },
    });
    elements.viewerDilationToggle.addEventListener("change", () => {
      setClinicalDilation(elements.viewerDilationToggle.checked);
    });
    elements.gazeMoveToggle.addEventListener("change", () => {
      setGazeMoveEnabled(elements.gazeMoveToggle.checked);
    });
    elements.viewerPigmentationToggle.addEventListener("change", () => {
      state.viewer.pigmentation = elements.viewerPigmentationToggle.checked
        ? "dark"
        : "light";
      const caseItem = DIABETIC_IMAGE_CASES[activeViewerCaseIndex];
      viewer.setViewerCase({
        condition: caseItem.id,
        imagePath: getViewerCaseImageSrc(caseItem),
        imageScale: getViewerCaseImageScale(caseItem),
      });
      renderPigmentationControl();
      prefetchViewerImages();
    });
    elements.previousCaseButton.addEventListener("click", () => {
      setViewerCase(activeViewerCaseIndex - 1);
    });
    elements.nextCaseButton.addEventListener("click", () => {
      setViewerCase(activeViewerCaseIndex + 1);
    });
    elements.viewerCaseSummaryToggle.addEventListener("click", () => {
      caseDescriptionOpen = !caseDescriptionOpen;
      renderViewerCaseNavigation();
    });
    elements.rightDistanceVA.addEventListener("change", () => {
      setDistanceVA(state, "right", elements.rightDistanceVA.value);
      render();
    });
    elements.leftDistanceVA.addEventListener("change", () => {
      setDistanceVA(state, "left", elements.leftDistanceVA.value);
      render();
    });
    elements.rightViewStatusSelect.addEventListener("change", () => {
      applyViewStatus("right", elements.rightViewStatusSelect.value);
      render();
    });
    elements.leftViewStatusSelect.addEventListener("change", () => {
      applyViewStatus("left", elements.leftViewStatusSelect.value);
      render();
    });
    $$("[data-systemic]").forEach((input) => {
      input.addEventListener("change", () => {
        setSystemicCheck(state, input.dataset.systemic, input.checked);
        render();
      });
    });
    elements.actionToggle.addEventListener("click", () => {
      actionExpanded = !actionExpanded;
      renderAction();
    });
    elements.recordingSystemToggle.addEventListener("click", () => {
      examExpanded = !examExpanded;
      renderExamCollapse();
    });
    $("#referralNoteButton").addEventListener("click", openReferralNote);
    $("#closeReferralButton").addEventListener("click", () =>
      closeModal(elements.referralModal),
    );
    $("#copyReferralButton").addEventListener("click", copyReferralNote);
    elements.shareReferralButton.addEventListener("click", shareReferralNote);
    $("#closePracticeButton").addEventListener("click", () =>
      closeModal(elements.practiceModal),
    );
    $("#closeGuideButton").addEventListener("click", () =>
      closeModal(elements.guideModal),
    );
    $("[data-practice-open]").addEventListener("click", () => {
      drawerController.close();
      renderPracticeCases();
      openModal(elements.practiceModal, elements.practiceModalContent);
    });
    elements.practiceCases.addEventListener("click", (event) => {
      const card = event.target.closest(".practice-card");
      if (!card || !elements.practiceCases.contains(card)) return;
      openPracticeCase(Number(card.dataset.caseIndex || 0));
    });
    elements.practiceCases.addEventListener("keydown", (event) => {
      if (event.key !== "Enter" && event.key !== " ") return;
      const card = event.target.closest(".practice-card");
      if (!card || !elements.practiceCases.contains(card)) return;
      event.preventDefault();
      openPracticeCase(Number(card.dataset.caseIndex || 0));
    });
    $$("[data-guide]").forEach((button) => {
      button.addEventListener("click", () => {
        drawerController.close();
        openGuide(button.dataset.guide);
      });
    });
    const mcqController = createMcqController({
      modal: $("#mcqModal"),
      modalContent: $("#mcqModalContent"),
      title: $("#mcqTitle"),
      intro: $("#mcqIntro"),
      container: $("#mcqContainer"),
      submit: $("#submitMcqButton"),
      result: $("#mcqResult"),
      close: $("#closeMcqButton"),
    });
    $$("[data-mcq-level]").forEach((button) => {
      button.addEventListener("click", () => {
        drawerController.close();
        mcqController.open(button.dataset.mcqLevel);
      });
    });
    document.addEventListener("keydown", (event) => {
      if (event.key !== "Escape") return;
      caseDescriptionOpen = false;
      renderViewerCaseNavigation();
      [
        elements.referralModal,
        elements.practiceModal,
        elements.guideModal,
        $("#mcqModal"),
      ].forEach((modal) => closeModal(modal));
    });
  }
  function init() {
    populateVaSelect(elements.rightDistanceVA);
    populateVaSelect(elements.leftDistanceVA);
    try {
      viewer.initialize();
      renderViewerCaseNavigation();
      prefetchViewerImages();
    } catch (error) {
      console.error("Viewer initialisation failed", error);
    }
    setupEventHandlers();
    const mcqValidation = validateMcqBanks();
    mcqValidation.forEach((result) => {
      if (result.actual !== result.expected || result.invalidAnswers > 0) {
        console.warn("MCQ validation issue", result);
      }
    });
    render();
  }
  init();
})();
