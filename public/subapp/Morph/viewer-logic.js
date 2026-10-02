(function exposeMorphViewerLogic(root) {
  const FOV_RADIUS_BY_DEGREE = Object.freeze({
    5: 38,
    8: 48,
    15: 68,
    25: 92,
    35: 114,
    45: 136,
  });

  const CATARACT_PRESETS = Object.freeze([
    Object.freeze({
      label: "None",
      blurPx: 0,
      brightness: 1,
      contrast: 1,
      saturation: 1,
      yellowTint: 0,
      darkTint: 0,
      hazeTint: 0,
    }),
    Object.freeze({
      label: "Slight",
      blurPx: 0.45,
      brightness: 0.92,
      contrast: 0.95,
      saturation: 0.9,
      yellowTint: 0.05,
      darkTint: 0.06,
      hazeTint: 0.015,
    }),
    Object.freeze({
      label: "Medium",
      blurPx: 1.65,
      brightness: 0.7,
      contrast: 0.76,
      saturation: 0.58,
      yellowTint: 0.2,
      darkTint: 0.24,
      hazeTint: 0.05,
    }),
    Object.freeze({
      label: "Dense",
      blurPx: 3.2,
      brightness: 0.56,
      contrast: 0.66,
      saturation: 0.46,
      yellowTint: 0.34,
      darkTint: 0.4,
      hazeTint: 0.14,
    }),
  ]);

  function clamp(value, min, max) {
    return Math.min(max, Math.max(min, value));
  }

  function getApertureRadius({
    selectedDegree,
    canvasWidth,
    canvasHeight,
    radiusByDegree = FOV_RADIUS_BY_DEGREE,
  }) {
    const requestedRadius = radiusByDegree[selectedDegree] || radiusByDegree[5];
    const maxRadius = Math.max(28, Math.min(canvasWidth, canvasHeight) * 0.43);
    return Math.min(requestedRadius, maxRadius);
  }

  function getImageGeometry({
    naturalWidth,
    naturalHeight,
    canvasWidth,
    canvasHeight,
    imageScale,
    baseScale,
    patientOffsetX,
    patientOffsetY,
  }) {
    if (!naturalWidth || !canvasWidth || !canvasHeight) {
      return {
        x: 0,
        y: 0,
        width: canvasWidth,
        height: canvasHeight,
      };
    }

    const coverScale = Math.max(
      canvasWidth / naturalWidth,
      canvasHeight / naturalHeight,
    );
    const renderScale = coverScale * imageScale * baseScale;
    const width = naturalWidth * renderScale;
    const height = naturalHeight * renderScale;
    return {
      x: (canvasWidth - width) / 2 + patientOffsetX,
      y: (canvasHeight - height) / 2 + patientOffsetY,
      width,
      height,
    };
  }

  function getCataractPresetIndex(level, presets = CATARACT_PRESETS) {
    return Math.round(clamp(Number(level) || 0, 0, presets.length - 1));
  }

  function getCataractPreset(level, presets = CATARACT_PRESETS) {
    return presets[getCataractPresetIndex(level, presets)] || presets[0];
  }

  function stepCornealJitter({
    offset,
    isDragging,
    random = Math.random,
    response = 0.1,
  }) {
    const target = isDragging
      ? {
          x: (random() - 0.5) * 100,
          y: (random() - 0.5) * 100,
        }
      : { x: 0, y: 0 };
    return {
      x: offset.x + (target.x - offset.x) * response,
      y: offset.y + (target.y - offset.y) * response,
    };
  }

  function createAnimationLoop({
    onFrame,
    requestFrame = (callback) => root.requestAnimationFrame(callback),
    cancelFrame = (id) => root.cancelAnimationFrame(id),
  }) {
    let running = false;
    let frameId = null;

    function frame(now) {
      if (!running) return;
      onFrame(now);
      frameId = requestFrame(frame);
    }

    return {
      start() {
        if (running) return;
        running = true;
        frameId = requestFrame(frame);
      },
      stop() {
        running = false;
        if (frameId !== null) cancelFrame(frameId);
        frameId = null;
      },
      isRunning() {
        return running;
      },
    };
  }

  root.MorphViewerLogic = Object.freeze({
    CATARACT_PRESETS,
    FOV_RADIUS_BY_DEGREE,
    clamp,
    createAnimationLoop,
    getApertureRadius,
    getCataractPreset,
    getCataractPresetIndex,
    getImageGeometry,
    stepCornealJitter,
  });
})(globalThis);
