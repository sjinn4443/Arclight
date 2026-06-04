/*
 * Gaze test pad controller.
 * Drag anywhere in the pad to simulate gaze to full extremes.
 */

(function attachGazeController(globalObj) {
  const AppStateRef = globalObj.AppState;
  const EyeControllerRef = globalObj.EyeController;
  const OutputWriterRef = globalObj.OutputWriter;

  // Approximate physiological ductions used for mapping:
  // Horizontal ~45-50 deg each side, elevation ~25 deg, depression ~35 deg.
  const GAZE_DEG_LEFT = 50;
  const GAZE_DEG_RIGHT = 50;
  const GAZE_DEG_UP = 25;
  const GAZE_DEG_DOWN = 35;

  const GAZE_MAX_X_LEFT = 34;
  const GAZE_MAX_X_RIGHT = 34;
  const GAZE_MAX_Y_UP = 24;
  const GAZE_MAX_Y_DOWN = 24;
  const AV_CUE_THRESHOLD = 4;

  const NAMED_VECTORS = {
    primary: { x: 0, y: 0 },
    up: { x: 0, y: -1 },
    down: { x: 0, y: 1 },
    left: { x: -1, y: 0 },
    right: { x: 1, y: 0 },
    "up-left": { x: -0.75, y: -0.75 },
    "up-right": { x: 0.75, y: -0.75 },
    "down-left": { x: -0.75, y: 0.75 },
    "down-right": { x: 0.75, y: 0.75 },
  };

  function clamp(value, min, max) {
    return Math.min(Math.max(value, min), max);
  }

  function getDynamicGazeLimits(eye, iris) {
    if (!eye || !iris) {
      return {
        xLeft: GAZE_MAX_X_LEFT,
        xRight: GAZE_MAX_X_RIGHT,
        yUp: GAZE_MAX_Y_UP,
        yDown: GAZE_MAX_Y_DOWN,
      };
    }

    const eyeWidth = eye.clientWidth || eye.getBoundingClientRect().width || 0;
    const irisWidth =
      iris.clientWidth || iris.getBoundingClientRect().width || 0;
    const maxX = Math.max(8, (eyeWidth / 2 - irisWidth / 2) * 0.8);

    return {
      xLeft: maxX,
      xRight: maxX,
      yUp: GAZE_MAX_Y_UP,
      yDown: GAZE_MAX_Y_DOWN,
    };
  }

  function inwardShiftForEye(eyeType, amount) {
    return eyeType === "left" ? amount : -amount;
  }

  function outwardShiftForEye(eyeType, amount) {
    return eyeType === "left" ? -amount : amount;
  }

  function applyPresetProfile(eyeType, presetKey, baseX, baseY) {
    let x = baseX;
    let y = baseY;
    const key = String(presetKey || "").toLowerCase();

    // 6th palsy family: dynamic abduction deficit of affected eye.
    if (key === "6th nerve palsy" && eyeType === "right" && x > 0) x *= 0.18;
    if (
      key === "partial 6th nerve palsy (medium)" &&
      eyeType === "right" &&
      x > 0
    )
      x *= 0.42;
    if (
      key === "partial 6th nerve palsy (small)" &&
      eyeType === "right" &&
      x > 0
    )
      x *= 0.66;

    // 4th palsy: make over-elevation in adduction clearly visible.
    // Strongest in adduction + downgaze (classic SO underaction with IO overaction),
    // but still present across adduction positions.
    if (key === "4th nerve palsy" && eyeType === "right") {
      const adductionWeight = Math.max(-x, 0) / Math.max(GAZE_MAX_X_LEFT, 1);
      const downgazeWeight = Math.max(y, 0) / Math.max(GAZE_MAX_Y_DOWN, 1);
      const upgazeWeight = Math.max(-y, 0) / Math.max(GAZE_MAX_Y_UP, 1);
      const adductionLift =
        16 * adductionWeight +
        22 * adductionWeight * downgazeWeight +
        12 * adductionWeight * upgazeWeight;
      y -= Math.min(adductionLift, 34);
    }

    if (key === "thyroid restrictive pattern" && eyeType === "right" && y < 0)
      y *= 0.32;
    if (key === "ino-like pattern" && eyeType === "right" && x < 0) x *= 0.38;

    // Brown syndrome-like: limitation of elevation in adduction.
    if (key === "brown syndrome-like" && eyeType === "right") {
      const adductionWeight = Math.max(-x, 0) / Math.max(GAZE_MAX_X_LEFT, 1);
      const upgazeWeight = Math.max(-y, 0) / Math.max(GAZE_MAX_Y_UP, 1);
      y += 16 * adductionWeight * upgazeWeight;
      y += 2;
    }

    // Duane type I-like: marked abduction deficit with mild adduction limitation.
    if (key === "duane type i-like" && eyeType === "right") {
      if (x > 0) x *= 0.15;
      if (x < 0) x *= 0.72;
    }

    // DVD-like: spontaneous/upgaze vertical drift of one eye.
    if (key === "dvd-like pattern" && eyeType === "right") {
      const upgazeWeight = Math.max(-y, 0) / Math.max(GAZE_MAX_Y_UP, 1);
      y -= 8 + 4 * upgazeWeight;
    }

    const upWeight = Math.max(-baseY, 0) / Math.max(GAZE_MAX_Y_UP, 1);
    const downWeight = Math.max(baseY, 0) / Math.max(GAZE_MAX_Y_DOWN, 1);

    if (key === "a-pattern esotropia") {
      const inShift = 8 * upWeight + 2 * downWeight;
      x += inwardShiftForEye(eyeType, inShift);
    }
    if (key === "v-pattern esotropia") {
      const inShift = 2 * upWeight + 8 * downWeight;
      x += inwardShiftForEye(eyeType, inShift);
    }
    if (key === "a-pattern exotropia") {
      const outShift = 8 * upWeight + 2 * downWeight;
      x += outwardShiftForEye(eyeType, outShift);
    }
    if (key === "v-pattern exotropia") {
      const outShift = 2 * upWeight + 8 * downWeight;
      x += outwardShiftForEye(eyeType, outShift);
    }

    return { x, y };
  }

  function getHorizontalSignedDeviation() {
    const leftEye = document.querySelector('.eye[data-eye="left"]');
    const rightEye = document.querySelector('.eye[data-eye="right"]');
    const leftIris = leftEye?.querySelector(".iris");
    const rightIris = rightEye?.querySelector(".iris");
    if (!leftEye || !rightEye || !leftIris || !rightIris) return null;

    const leftDx =
      (leftIris.manualOffset?.x || 0) +
      (leftIris.presetOffset?.x || 0) +
      (leftIris.gazeOffset?.x || 0) +
      (leftIris.coverOffset?.x || 0);
    const rightDx =
      (rightIris.manualOffset?.x || 0) +
      (rightIris.presetOffset?.x || 0) +
      (rightIris.gazeOffset?.x || 0) +
      (rightIris.coverOffset?.x || 0);

    const esoMag = Math.max(leftDx, 0) + Math.max(-rightDx, 0);
    const exoMag = Math.max(-leftDx, 0) + Math.max(rightDx, 0);
    if (exoMag - esoMag > 1) return exoMag;
    if (esoMag - exoMag > 1) return -esoMag;
    return 0;
  }

  function computeAvCue() {
    const samples = AppStateRef.state.gazeSamples || {};
    const up = samples.up;
    const down = samples.down;
    if (typeof up !== "number" || typeof down !== "number") return "";
    if (up === 0 || down === 0) return "";
    if (Math.sign(up) !== Math.sign(down)) return "";

    const absUp = Math.abs(up);
    const absDown = Math.abs(down);
    const isEso = up < 0;

    if (absUp >= absDown + AV_CUE_THRESHOLD) {
      return `A-pattern cue (${isEso ? "esotropia" : "exotropia"})`;
    }
    if (absDown >= absUp + AV_CUE_THRESHOLD) {
      return `V-pattern cue (${isEso ? "esotropia" : "exotropia"})`;
    }
    return "";
  }

  function classifyDirection(vectorX, vectorY) {
    const x = Number(vectorX || 0);
    const y = Number(vectorY || 0);
    const absX = Math.abs(x);
    const absY = Math.abs(y);
    const magnitude = Math.sqrt(x * x + y * y);
    if (magnitude < 0.14) return "primary";

    if (y <= -0.35 && absX < 0.35) return "up";
    if (y >= 0.35 && absX < 0.35) return "down";
    if (x <= -0.35 && absY < 0.35) return "left";
    if (x >= 0.35 && absY < 0.35) return "right";

    if (x < 0 && y < 0) return "up-left";
    if (x > 0 && y < 0) return "up-right";
    if (x < 0 && y > 0) return "down-left";
    if (x > 0 && y > 0) return "down-right";
    return "primary";
  }

  function directionLabel(directionKey) {
    if (directionKey === "up-left") return "Up-left";
    if (directionKey === "up-right") return "Up-right";
    if (directionKey === "down-left") return "Down-left";
    if (directionKey === "down-right") return "Down-right";
    if (directionKey === "up") return "Up";
    if (directionKey === "down") return "Down";
    if (directionKey === "left") return "Left";
    if (directionKey === "right") return "Right";
    return "Primary";
  }

  function setGazeStatus(directionKey) {
    const statusEl = document.getElementById("gaze-status");
    if (!statusEl) return;
    statusEl.textContent = directionLabel(directionKey);
    statusEl.classList.toggle("is-active", directionKey !== "primary");
  }

  function clearMuscleReadout() {
    document.querySelectorAll(".gaze-muscle-chip").forEach((chip) => {
      chip.classList.remove("is-on", "is-mid");
      chip.style.setProperty("--act", "0");
    });
  }

  function setMuscleActivation(readoutEye, muscle, value) {
    const selector = `.gaze-muscle-row[data-eye="${readoutEye}"] .gaze-muscle-chip[data-muscle="${muscle}"]`;
    const chip = document.querySelector(selector);
    if (!chip) return;
    const v = clamp(Number(value || 0), 0, 1);
    chip.classList.remove("is-on", "is-mid");
    chip.style.setProperty("--act", v.toFixed(3));
    if (v >= 0.66) chip.classList.add("is-on");
    else if (v >= 0.12) chip.classList.add("is-mid");
  }

  function updateMuscleReadout(vectorX, vectorY) {
    const x = clamp(Number(vectorX || 0), -1, 1);
    const y = clamp(Number(vectorY || 0), -1, 1);

    clearMuscleReadout();

    [
      { domEye: "left", readoutEye: "RE" },
      { domEye: "right", readoutEye: "LE" },
    ].forEach(({ domEye, readoutEye }) => {
      // Patient-facing mapping:
      // DOM left eye = RE, DOM right eye = LE.
      const adductDemand = domEye === "left" ? Math.max(x, 0) : Math.max(-x, 0);
      const abductDemand = domEye === "left" ? Math.max(-x, 0) : Math.max(x, 0);
      const upDemand = Math.max(-y, 0);
      const downDemand = Math.max(y, 0);

      setMuscleActivation(readoutEye, "MR", adductDemand);
      setMuscleActivation(readoutEye, "LR", abductDemand);

      // Vertical pair weighting by horizontal position:
      // Up: abducted -> SR, adducted -> IO
      // Down: abducted -> IR, adducted -> SO
      const hTotal = adductDemand + abductDemand;
      const adductBias = hTotal > 0.001 ? adductDemand / hTotal : 0.5;
      const abductBias = hTotal > 0.001 ? abductDemand / hTotal : 0.5;

      const sr = upDemand * (0.4 + 0.6 * abductBias);
      const io = upDemand * (0.4 + 0.6 * adductBias);
      const ir = downDemand * (0.4 + 0.6 * abductBias);
      const so = downDemand * (0.4 + 0.6 * adductBias);

      setMuscleActivation(readoutEye, "SR", sr);
      setMuscleActivation(readoutEye, "IO", io);
      setMuscleActivation(readoutEye, "IR", ir);
      setMuscleActivation(readoutEye, "SO", so);
    });
  }

  function getNeutralFractions() {
    const totalX = GAZE_DEG_LEFT + GAZE_DEG_RIGHT;
    const totalY = GAZE_DEG_UP + GAZE_DEG_DOWN;
    return {
      x: GAZE_DEG_LEFT / Math.max(totalX, 1),
      y: GAZE_DEG_UP / Math.max(totalY, 1),
    };
  }

  function applyNeutralGuide(trackpad) {
    if (!trackpad) return;
    const neutral = getNeutralFractions();
    trackpad.style.setProperty(
      "--gaze-neutral-x",
      `${(neutral.x * 100).toFixed(2)}%`,
    );
    trackpad.style.setProperty(
      "--gaze-neutral-y",
      `${(neutral.y * 100).toFixed(2)}%`,
    );
  }

  function constrainPointToRoundedRect(
    x,
    y,
    width,
    height,
    cornerRadius,
    thumbRadius,
  ) {
    const minX = thumbRadius;
    const maxX = width - thumbRadius;
    const minY = thumbRadius;
    const maxY = height - thumbRadius;

    let cx = clamp(x, minX, maxX);
    let cy = clamp(y, minY, maxY);

    const effectiveRadius = Math.max(0, cornerRadius - thumbRadius);
    if (effectiveRadius <= 0) {
      return { x: cx, y: cy };
    }

    const leftLimit = minX + effectiveRadius;
    const rightLimit = maxX - effectiveRadius;
    const topLimit = minY + effectiveRadius;
    const bottomLimit = maxY - effectiveRadius;

    let cornerCenterX = null;
    let cornerCenterY = null;

    if (cx < leftLimit && cy < topLimit) {
      cornerCenterX = leftLimit;
      cornerCenterY = topLimit;
    } else if (cx > rightLimit && cy < topLimit) {
      cornerCenterX = rightLimit;
      cornerCenterY = topLimit;
    } else if (cx < leftLimit && cy > bottomLimit) {
      cornerCenterX = leftLimit;
      cornerCenterY = bottomLimit;
    } else if (cx > rightLimit && cy > bottomLimit) {
      cornerCenterX = rightLimit;
      cornerCenterY = bottomLimit;
    }

    if (cornerCenterX === null || cornerCenterY === null) {
      return { x: cx, y: cy };
    }

    const dx = cx - cornerCenterX;
    const dy = cy - cornerCenterY;
    const dist = Math.sqrt(dx * dx + dy * dy);
    if (dist <= effectiveRadius || dist < 1e-6) {
      return { x: cx, y: cy };
    }

    const scale = effectiveRadius / dist;
    cx = cornerCenterX + dx * scale;
    cy = cornerCenterY + dy * scale;
    return { x: cx, y: cy };
  }

  function setThumbFromVector(trackpad, vectorX, vectorY) {
    if (!trackpad) return;
    const rect = trackpad.getBoundingClientRect();
    const neutral = getNeutralFractions();
    const neutralX = rect.width * neutral.x;
    const neutralY = rect.height * neutral.y;
    const leftSpan = neutralX;
    const rightSpan = rect.width - neutralX;
    const upSpan = neutralY;
    const downSpan = rect.height - neutralY;

    const safeX = clamp(vectorX, -1, 1);
    const safeY = clamp(vectorY, -1, 1);
    const pxX = safeX < 0 ? safeX * leftSpan * 0.94 : safeX * rightSpan * 0.94;
    const pxY = safeY < 0 ? safeY * upSpan * 0.94 : safeY * downSpan * 0.94;

    const thumb = document.getElementById("gaze-thumb");
    const thumbRadius = (thumb?.offsetWidth || 18) / 2;
    const cornerRadius =
      parseFloat(getComputedStyle(trackpad).borderTopLeftRadius) || 0;
    const rawCenterX = neutralX + pxX;
    const rawCenterY = neutralY + pxY;
    const constrained = constrainPointToRoundedRect(
      rawCenterX,
      rawCenterY,
      rect.width,
      rect.height,
      cornerRadius,
      thumbRadius,
    );

    trackpad.style.setProperty(
      "--gaze-thumb-x",
      `${(constrained.x - neutralX).toFixed(2)}px`,
    );
    trackpad.style.setProperty(
      "--gaze-thumb-y",
      `${(constrained.y - neutralY).toFixed(2)}px`,
    );
  }

  function recordGazeSamples(vectorX, vectorY) {
    const signed = getHorizontalSignedDeviation();
    if (typeof signed !== "number") return;
    const y = Number(vectorY || 0);
    const magnitude = Math.sqrt(vectorX * vectorX + vectorY * vectorY);

    if (magnitude < 0.16) {
      AppStateRef.state.gazeSamples.primary = signed;
    }
    if (y <= -0.72) {
      AppStateRef.state.gazeSamples.up = signed;
    }
    if (y >= 0.72) {
      AppStateRef.state.gazeSamples.down = signed;
    }
    AppStateRef.state.gazePatternCue = computeAvCue();
  }

  function applyVector(vectorX, vectorY, options = {}) {
    const safeX = clamp(Number(vectorX || 0), -1, 1);
    const safeY = clamp(Number(vectorY || 0), -1, 1);
    const presetKey = AppStateRef.state.activePresetKey || "";

    document.querySelectorAll(".eye").forEach((eye) => {
      const eyeType = eye.getAttribute("data-eye");
      const iris = eye.querySelector(".iris");
      if (!iris) return;
      const limits = getDynamicGazeLimits(eye, iris);
      const baseX = safeX < 0 ? safeX * limits.xLeft : safeX * limits.xRight;
      const baseY = safeY < 0 ? safeY * limits.yUp : safeY * limits.yDown;
      const adjusted = applyPresetProfile(eyeType, presetKey, baseX, baseY);
      iris.gazeOffset = { x: adjusted.x, y: adjusted.y };
      EyeControllerRef?.updateIrisTransform?.(iris);
    });

    const directionKey = classifyDirection(safeX, safeY);
    AppStateRef.state.gazeDirection = directionKey;
    AppStateRef.state.gazeVector = { x: safeX, y: safeY };
    setGazeStatus(directionKey);
    updateMuscleReadout(safeX, safeY);
    recordGazeSamples(safeX, safeY);

    const trackpad = document.getElementById("gaze-trackpad");
    setThumbFromVector(trackpad, safeX, safeY);

    if (!options.silent) {
      OutputWriterRef?.updateAllOutputs?.();
    }
  }

  function applyDirection(direction, options = {}) {
    const key = String(direction || "primary").toLowerCase();
    const v = NAMED_VECTORS[key] || NAMED_VECTORS.primary;
    applyVector(v.x, v.y, options);
  }

  function resetToPrimary(options = {}) {
    applyDirection("primary", options);
  }

  function vectorFromPointer(trackpad, clientX, clientY) {
    const rect = trackpad.getBoundingClientRect();
    const neutral = getNeutralFractions();
    const cx = rect.left + rect.width * neutral.x;
    const cy = rect.top + rect.height * neutral.y;
    const leftSpan = rect.width * neutral.x;
    const rightSpan = rect.width - leftSpan;
    const upSpan = rect.height * neutral.y;
    const downSpan = rect.height - upSpan;

    const dx = clientX - cx;
    const dy = clientY - cy;
    const normX =
      dx < 0 ? dx / Math.max(leftSpan, 1) : dx / Math.max(rightSpan, 1);
    const normY =
      dy < 0 ? dy / Math.max(upSpan, 1) : dy / Math.max(downSpan, 1);
    return {
      x: clamp(normX, -1, 1),
      y: clamp(normY, -1, 1),
    };
  }

  function setupGazePad() {
    const trackpad = document.getElementById("gaze-trackpad");
    if (!trackpad) return;
    applyNeutralGuide(trackpad);

    let pointerId = null;

    function applyFromClient(clientX, clientY) {
      const v = vectorFromPointer(trackpad, clientX, clientY);
      applyVector(v.x, v.y);
    }

    trackpad.addEventListener("pointerdown", (event) => {
      event.preventDefault();
      pointerId = event.pointerId;
      trackpad.setPointerCapture(pointerId);
      trackpad.classList.add("is-active");
      applyFromClient(event.clientX, event.clientY);
    });

    trackpad.addEventListener("pointermove", (event) => {
      if (pointerId === null || event.pointerId !== pointerId) return;
      event.preventDefault();
      applyFromClient(event.clientX, event.clientY);
    });

    function endPointer(event) {
      if (pointerId === null || event.pointerId !== pointerId) return;
      try {
        trackpad.releasePointerCapture(pointerId);
      } catch (_) {
        // no-op
      }
      pointerId = null;
      trackpad.classList.remove("is-active");
      resetToPrimary();
    }

    trackpad.addEventListener("pointerup", endPointer);
    trackpad.addEventListener("pointercancel", endPointer);
    trackpad.addEventListener("pointerleave", (event) => {
      if (pointerId === null || event.pointerId !== pointerId) return;
      endPointer(event);
    });

    window.addEventListener("resize", () => {
      applyNeutralGuide(trackpad);
      const current = AppStateRef.state.gazeDirection || "primary";
      applyDirection(current, { silent: true });
    });

    resetToPrimary({ silent: true });
  }

  function randomBetween(min, max) {
    return min + Math.random() * (max - min);
  }

  function isBabyMode() {
    return Boolean(
      AppStateRef.state.isBabyMode ||
      document.body.classList.contains("is-baby-mode") ||
      document.querySelector(".eyes-card")?.classList.contains("is-baby-mode"),
    );
  }

  function getEyesContainer() {
    return document.querySelector(".eyes-container");
  }

  function applyGazeFacePose({ x = 0, y = 0, tilt = 0 } = {}) {
    const container = getEyesContainer();
    if (!container) return;
    container.style.setProperty(
      "--gaze-face-x",
      `${Number(x || 0).toFixed(2)}px`,
    );
    container.style.setProperty(
      "--gaze-face-y",
      `${Number(y || 0).toFixed(2)}px`,
    );
    container.style.setProperty(
      "--gaze-face-tilt",
      `${Number(tilt || 0).toFixed(2)}deg`,
    );
  }

  function resetGazeFacePose() {
    applyGazeFacePose();
  }

  function clearLiveGazeTimers(iris) {
    if (iris.liveGazeSettleTimerId) {
      window.clearTimeout(iris.liveGazeSettleTimerId);
      iris.liveGazeSettleTimerId = 0;
    }
    if (iris.liveGazeStartTimerId) {
      window.clearTimeout(iris.liveGazeStartTimerId);
      iris.liveGazeStartTimerId = 0;
    }
  }

  function applyIrisLiveGazePose(
    resolveOffset,
    { overshoot = 0, settleMs = 0, staggerMs = 0 } = {},
  ) {
    document.querySelectorAll(".iris").forEach((iris, index) => {
      if (iris.isDragging) return;
      clearLiveGazeTimers(iris);

      const targetOffset = resolveOffset(iris, index) || { x: 0, y: 0 };
      const previousOffset = iris.liveGazeOffset || { x: 0, y: 0 };
      const applyOffset = (offset) => {
        iris.liveGazeOffset = {
          x: parseFloat(Number(offset.x || 0).toFixed(2)),
          y: parseFloat(Number(offset.y || 0).toFixed(2)),
        };
        EyeControllerRef?.updateIrisTransform?.(iris);
      };
      const startDelay = index * staggerMs;

      const startMove = () => {
        if (!AppStateRef.state.isLiveMotionEnabled) return;
        if (overshoot > 0 && settleMs > 0) {
          applyOffset({
            x: targetOffset.x + (targetOffset.x - previousOffset.x) * overshoot,
            y: targetOffset.y + (targetOffset.y - previousOffset.y) * overshoot,
          });
          iris.liveGazeSettleTimerId = window.setTimeout(() => {
            applyOffset(targetOffset);
            iris.liveGazeSettleTimerId = 0;
          }, settleMs);
          return;
        }

        applyOffset(targetOffset);
      };

      if (startDelay > 0) {
        iris.liveGazeStartTimerId = window.setTimeout(() => {
          iris.liveGazeStartTimerId = 0;
          startMove();
        }, startDelay);
      } else {
        startMove();
      }
    });
  }

  function resetTemporaryLiveGazeLids() {
    document.querySelectorAll(".eye").forEach((eye) => {
      const upperEyelid = eye.querySelector(".upper-eyelid");
      if (!upperEyelid) return;
      if (upperEyelid.liveGazeDroopTimerId) {
        window.clearTimeout(upperEyelid.liveGazeDroopTimerId);
        upperEyelid.liveGazeDroopTimerId = 0;
      }
      if (upperEyelid.dataset.liveGazeRestingHeightPx) {
        upperEyelid.style.height = upperEyelid.dataset.liveGazeRestingHeightPx;
        delete upperEyelid.dataset.liveGazeRestingHeightPx;
      }
    });
  }

  function applyTemporaryLiveGazeLidDroop(holdDuration, strength = 0.18) {
    document.querySelectorAll(".eye").forEach((eye) => {
      const upperEyelid = eye.querySelector(".upper-eyelid");
      if (!upperEyelid) return;
      if (upperEyelid.liveGazeDroopTimerId) {
        window.clearTimeout(upperEyelid.liveGazeDroopTimerId);
      }

      if (!upperEyelid.dataset.liveGazeRestingHeightPx) {
        upperEyelid.dataset.liveGazeRestingHeightPx =
          upperEyelid.style.height || "0px";
      }
      const restingHeight =
        parseFloat(upperEyelid.dataset.liveGazeRestingHeightPx) || 0;
      const targetHeight = Math.max(restingHeight, eye.clientHeight * strength);
      upperEyelid.style.height = `${targetHeight}px`;

      upperEyelid.liveGazeDroopTimerId = window.setTimeout(() => {
        upperEyelid.liveGazeDroopTimerId = 0;
        upperEyelid.style.height =
          upperEyelid.dataset.liveGazeRestingHeightPx || "0px";
        delete upperEyelid.dataset.liveGazeRestingHeightPx;
      }, holdDuration);
    });
  }

  function clearLiveGazeShiftTimer() {
    if (AppStateRef.state.gazeShiftTimerId) {
      window.clearTimeout(AppStateRef.state.gazeShiftTimerId);
      AppStateRef.state.gazeShiftTimerId = 0;
    }
  }

  function resetLiveGazeOffsets() {
    clearLiveGazeShiftTimer();
    resetGazeFacePose();
    resetTemporaryLiveGazeLids();
    document.querySelectorAll(".iris").forEach((iris) => {
      clearLiveGazeTimers(iris);
      iris.liveGazeOffset = { x: 0, y: 0 };
      EyeControllerRef?.updateIrisTransform?.(iris);
    });
  }

  function startLiveGazeShifts() {
    clearLiveGazeShiftTimer();

    let isFirstShift = true;
    let restingGazeX = 0;
    let restingGazeY = 0;

    const applyRestingGaze = () => {
      const babyGaze = isBabyMode();
      const side = Math.random() < 0.5 ? -1 : 1;
      restingGazeX = parseFloat((side * randomBetween(2.2, 4.4)).toFixed(2));
      restingGazeY = parseFloat(randomBetween(-1.1, 1.1).toFixed(2));
      applyGazeFacePose({
        x: side * randomBetween(0.6, 1.3),
        y: randomBetween(-0.2, 0.6),
        tilt: side * randomBetween(0.24, 0.46),
      });

      applyIrisLiveGazePose(
        () => ({
          x: restingGazeX + randomBetween(-0.18, 0.17),
          y: restingGazeY + randomBetween(-0.13, 0.12),
        }),
        {
          overshoot: babyGaze ? 0.07 : 0.045,
          settleMs: babyGaze ? 210 : 250,
          staggerMs: babyGaze ? 14 : 10,
        },
      );
    };

    const scheduleNextGazeShift = () => {
      const babyGaze = isBabyMode();
      const delay = isFirstShift
        ? randomBetween(450, 1100)
        : babyGaze
          ? randomBetween(820, 1670)
          : randomBetween(1250, 2400);
      isFirstShift = false;

      AppStateRef.state.gazeShiftTimerId = window.setTimeout(() => {
        if (!AppStateRef.state.isLiveMotionEnabled) {
          AppStateRef.state.gazeShiftTimerId = 0;
          return;
        }

        const largeLook = Math.random() < (babyGaze ? 0.4 : 0.28);
        const holdDuration = largeLook
          ? babyGaze
            ? randomBetween(760, 1520)
            : randomBetween(1200, 2050)
          : babyGaze
            ? randomBetween(620, 1260)
            : randomBetween(1100, 1900);
        const side = Math.random() < 0.5 ? -1 : 1;
        const sharedX = parseFloat(
          (
            side * (largeLook ? randomBetween(15, 21) : randomBetween(8.5, 14))
          ).toFixed(2),
        );
        const sharedY = parseFloat(
          (largeLook
            ? randomBetween(7.5, 12)
            : randomBetween(-3.5, 3.5)
          ).toFixed(2),
        );
        const faceShiftX =
          side *
          (largeLook ? randomBetween(2.4, 3.6) : randomBetween(1.4, 2.3));
        const faceShiftY = largeLook
          ? randomBetween(1.8, 2.9)
          : clamp(sharedY * 0.2, -0.8, 1.2);
        const tiltChance = Math.random();
        const hasLargeHeadTilt = largeLook && tiltChance < 0.16;
        const hasBiggerHeadTilt = largeLook && tiltChance < 0.42;
        const faceTilt =
          side *
          (hasLargeHeadTilt
            ? randomBetween(1.02, 1.36)
            : hasBiggerHeadTilt
              ? randomBetween(1.05, 1.35)
              : largeLook
                ? randomBetween(0.76, 1.1)
                : randomBetween(0.44, 0.72));

        applyGazeFacePose({ x: faceShiftX, y: faceShiftY, tilt: faceTilt });

        if (largeLook) {
          applyTemporaryLiveGazeLidDroop(
            holdDuration,
            randomBetween(0.16, 0.22),
          );
        }

        if (largeLook && Math.random() < (babyGaze ? 0.46 : 0.22)) {
          window.setTimeout(
            () => globalObj.EyeEffectsController?.blinkEyes?.(),
            babyGaze ? 80 : 140,
          );
        }

        applyIrisLiveGazePose(
          () => ({
            x:
              sharedX +
              randomBetween(babyGaze ? -0.6 : -0.4, babyGaze ? 0.6 : 0.4),
            y:
              sharedY +
              randomBetween(babyGaze ? -0.38 : -0.25, babyGaze ? 0.37 : 0.25),
          }),
          {
            overshoot: babyGaze ? 0.1 : 0.065,
            settleMs: babyGaze ? 160 : 200,
            staggerMs: babyGaze ? 16 : 12,
          },
        );

        AppStateRef.state.gazeShiftTimerId = window.setTimeout(() => {
          applyRestingGaze();
          if (AppStateRef.state.isLiveMotionEnabled) {
            scheduleNextGazeShift();
          } else {
            AppStateRef.state.gazeShiftTimerId = 0;
          }
        }, holdDuration);
      }, delay);
    };

    AppStateRef.state.isLiveMotionEnabled = true;
    applyRestingGaze();
    scheduleNextGazeShift();
  }

  function setLiveMotionEnabled(isEnabled) {
    const enabled = Boolean(isEnabled);
    AppStateRef.state.isLiveMotionEnabled = enabled;
    document.body.classList.toggle("is-live-gaze-enabled", enabled);

    if (!enabled) {
      resetLiveGazeOffsets();
      OutputWriterRef?.updateAllOutputs?.();
      return;
    }

    resetLiveGazeOffsets();
    AppStateRef.state.isLiveMotionEnabled = true;
    startLiveGazeShifts();
    OutputWriterRef?.updateAllOutputs?.();
  }

  globalObj.GazeController = {
    setupGazePad,
    applyDirection,
    applyDirectionFromPreset: applyDirection,
    resetToPrimary,
    setLiveMotionEnabled,
  };
})(typeof globalThis !== "undefined" ? globalThis : window);
