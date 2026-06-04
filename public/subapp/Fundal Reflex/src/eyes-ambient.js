import { prefersReducedMotion } from "./motion.js";

export function createAmbientEyeController({
  dom,
  notifyEyeGeometryChange,
  state,
  updateIrisTransform,
}) {
  function applyGazeFacePose({ x = 0, y = 0, tilt = 0 } = {}) {
    if (!dom.eyesContainer) {
      return;
    }

    dom.eyesContainer.style.setProperty("--gaze-face-x", `${x.toFixed(2)}px`);
    dom.eyesContainer.style.setProperty("--gaze-face-y", `${y.toFixed(2)}px`);
    dom.eyesContainer.style.setProperty(
      "--gaze-face-tilt",
      `${tilt.toFixed(2)}deg`,
    );
  }

  function resetGazeFacePose() {
    applyGazeFacePose();
  }

  function notifyAmbientEyeGeometryChange(
    includePosition = state.nystagmusLevel === 0,
  ) {
    notifyEyeGeometryChange(
      state.isLiveMotionEnabled ? false : includePosition,
    );
  }

  function getRestingUpperLidHeight(upperEyelid) {
    return upperEyelid?.dataset.restingHeightPx || "0px";
  }

  function getActiveUpperLidHeight(upperEyelid) {
    return (
      upperEyelid?.dataset.gazeLidDroopHeightPx ||
      getRestingUpperLidHeight(upperEyelid)
    );
  }

  function resetTemporaryGazeLids() {
    dom.eyes.forEach((eye) => {
      const upperEyelid = eye.querySelector(".upper-eyelid");
      if (!upperEyelid) {
        return;
      }

      if (upperEyelid.gazeLidDroopTimerId) {
        window.clearTimeout(upperEyelid.gazeLidDroopTimerId);
        upperEyelid.gazeLidDroopTimerId = 0;
      }
      delete upperEyelid.dataset.gazeLidDroopHeightPx;

      if (upperEyelid.dataset.isBlinking !== "true") {
        upperEyelid.style.height = getRestingUpperLidHeight(upperEyelid);
      }
    });
  }

  function resetBlinkLids() {
    dom.eyes.forEach((eye) => {
      const upperEyelid = eye.querySelector(".upper-eyelid");
      const lowerEyelid = eye.querySelector(".lower-eyelid");

      if (upperEyelid?.blinkTimerId) {
        window.clearTimeout(upperEyelid.blinkTimerId);
        upperEyelid.blinkTimerId = 0;
      }
      if (lowerEyelid?.blinkTimerId) {
        window.clearTimeout(lowerEyelid.blinkTimerId);
        lowerEyelid.blinkTimerId = 0;
      }

      if (upperEyelid) {
        delete upperEyelid.dataset.isBlinking;
        upperEyelid.style.height = getActiveUpperLidHeight(upperEyelid);
      }
      if (lowerEyelid) {
        lowerEyelid.style.height = "0px";
      }
    });
  }

  function applyIrisGazePose(
    resolveOffset,
    { overshoot = 0, settleMs = 0, staggerMs = 0 } = {},
  ) {
    dom.irises.forEach((iris, index) => {
      if (iris.isDragging) {
        return;
      }

      if (iris.gazeSettleTimerId) {
        window.clearTimeout(iris.gazeSettleTimerId);
        iris.gazeSettleTimerId = 0;
      }
      if (iris.gazeStartTimerId) {
        window.clearTimeout(iris.gazeStartTimerId);
        iris.gazeStartTimerId = 0;
      }

      const targetOffset = resolveOffset(iris, index);
      const previousOffset = iris.gazeOffset || { x: 0, y: 0 };
      const applyOffset = (offset) => {
        iris.gazeOffset = {
          x: parseFloat(offset.x.toFixed(2)),
          y: parseFloat(offset.y.toFixed(2)),
        };
        updateIrisTransform(iris);
      };
      const startDelay = index * staggerMs;

      const startMove = () => {
        if (overshoot > 0 && settleMs > 0) {
          applyOffset({
            x: targetOffset.x + (targetOffset.x - previousOffset.x) * overshoot,
            y: targetOffset.y + (targetOffset.y - previousOffset.y) * overshoot,
          });
          notifyAmbientEyeGeometryChange(false);
          iris.gazeSettleTimerId = window.setTimeout(() => {
            applyOffset(targetOffset);
            iris.gazeSettleTimerId = 0;
            notifyAmbientEyeGeometryChange(false);
          }, settleMs);
          return;
        }

        applyOffset(targetOffset);
        notifyAmbientEyeGeometryChange(false);
      };

      if (startDelay > 0) {
        iris.gazeStartTimerId = window.setTimeout(() => {
          iris.gazeStartTimerId = 0;
          startMove();
        }, startDelay);
      } else {
        startMove();
      }
    });
  }

  function getNystagmusSettings() {
    const allowedDirections = new Set(["horizontal", "vertical", "mixed"]);
    const allowedWaves = new Set(["jerk", "pendular"]);
    const allowedRates = new Set(["slow", "med", "fast"]);

    const direction = allowedDirections.has(state.nystagmusDirection)
      ? state.nystagmusDirection
      : "horizontal";
    const wave = allowedWaves.has(state.nystagmusWave)
      ? state.nystagmusWave
      : "jerk";
    const rate = allowedRates.has(state.nystagmusRate)
      ? state.nystagmusRate
      : "slow";

    return { direction, wave, rate };
  }

  function startMicroSaccades() {
    const saccadeInterval = 2300;
    const saccadeDuration = 120;

    dom.irises.forEach((iris) => {
      iris.microOffset = { x: 0, y: 0 };
    });

    state.microSaccadeIntervalId = window.setInterval(() => {
      const hasLargerShift = state.isLiveMotionEnabled && Math.random() < 0.18;
      const horizontalRange = state.isLiveMotionEnabled
        ? hasLargerShift
          ? 4.8
          : 2.6
        : 2;
      const verticalRange = state.isLiveMotionEnabled
        ? hasLargerShift
          ? 2.6
          : 1.4
        : 2;
      const sharedOffsetX =
        Math.random() * horizontalRange - horizontalRange / 2;
      const sharedOffsetY = Math.random() * verticalRange - verticalRange / 2;

      dom.irises.forEach((iris) => {
        if (!iris.isDragging) {
          const offsetX = parseFloat(
            (sharedOffsetX + (Math.random() * 0.28 - 0.14)).toFixed(2),
          );
          const offsetY = parseFloat(
            (sharedOffsetY + (Math.random() * 0.22 - 0.11)).toFixed(2),
          );
          iris.microOffset = { x: offsetX, y: offsetY };
          updateIrisTransform(iris);
        }
      });
      notifyAmbientEyeGeometryChange();

      setTimeout(() => {
        dom.irises.forEach((iris) => {
          if (!iris.isDragging) {
            iris.microOffset = { x: 0, y: 0 };
            updateIrisTransform(iris);
          }
        });
        notifyAmbientEyeGeometryChange();
      }, saccadeDuration);
    }, saccadeInterval);
  }

  function startGazeShifts() {
    if (state.gazeShiftTimerId) {
      clearTimeout(state.gazeShiftTimerId);
      state.gazeShiftTimerId = 0;
    }

    let isFirstShift = true;
    let restingGazeX = 0;
    let restingGazeY = 0;

    const applyRestingGaze = () => {
      const side = Math.random() < 0.5 ? -1 : 1;
      restingGazeX = parseFloat(
        (side * (2.2 + Math.random() * 2.2)).toFixed(2),
      );
      restingGazeY = parseFloat((Math.random() * 2.2 - 1.1).toFixed(2));
      applyGazeFacePose({
        x: side * (0.6 + Math.random() * 0.7),
        y: Math.random() * 0.8 - 0.2,
        tilt: side * (0.24 + Math.random() * 0.22),
      });

      applyIrisGazePose(
        () => ({
          x: restingGazeX + (Math.random() * 0.35 - 0.18),
          y: restingGazeY + (Math.random() * 0.25 - 0.13),
        }),
        {
          overshoot: state.isBabyMode ? 0.07 : 0.045,
          settleMs: state.isBabyMode ? 210 : 250,
          staggerMs: state.isBabyMode ? 14 : 10,
        },
      );
    };

    applyRestingGaze();

    const applyTemporaryGazeLidDroop = (holdDuration, strength = 0.18) => {
      dom.eyes.forEach((eye) => {
        const upperEyelid = eye.querySelector(".upper-eyelid");
        if (!upperEyelid) {
          return;
        }

        if (upperEyelid.gazeLidDroopTimerId) {
          window.clearTimeout(upperEyelid.gazeLidDroopTimerId);
        }

        const restingHeight =
          parseFloat(getRestingUpperLidHeight(upperEyelid)) || 0;
        const targetHeight = Math.max(
          restingHeight,
          eye.clientHeight * strength,
        );
        const targetHeightPx = `${targetHeight}px`;
        upperEyelid.dataset.gazeLidDroopHeightPx = targetHeightPx;

        if (upperEyelid.dataset.isBlinking !== "true") {
          upperEyelid.style.height = targetHeightPx;
        }

        upperEyelid.gazeLidDroopTimerId = window.setTimeout(() => {
          delete upperEyelid.dataset.gazeLidDroopHeightPx;
          upperEyelid.gazeLidDroopTimerId = 0;
          if (upperEyelid.dataset.isBlinking !== "true") {
            upperEyelid.style.height = getRestingUpperLidHeight(upperEyelid);
          }
        }, holdDuration);
      });
    };

    const scheduleNextGazeShift = () => {
      const babyGaze = state.isBabyMode;
      const delay = isFirstShift
        ? 450 + Math.random() * 650
        : babyGaze
          ? 820 + Math.random() * 850
          : 1250 + Math.random() * 1150;
      isFirstShift = false;

      state.gazeShiftTimerId = window.setTimeout(() => {
        if (!state.isLiveMotionEnabled) {
          state.gazeShiftTimerId = 0;
          return;
        }

        const isLargeDistractedLook = Math.random() < (babyGaze ? 0.4 : 0.28);
        const holdDuration = isLargeDistractedLook
          ? babyGaze
            ? 760 + Math.random() * 760
            : 1200 + Math.random() * 850
          : babyGaze
            ? 620 + Math.random() * 640
            : 1100 + Math.random() * 800;
        const side = Math.random() < 0.5 ? -1 : 1;
        const sharedX = isLargeDistractedLook
          ? parseFloat((side * (15 + Math.random() * 6)).toFixed(2))
          : parseFloat((side * (8.5 + Math.random() * 5.5)).toFixed(2));
        const sharedY = isLargeDistractedLook
          ? parseFloat((7.5 + Math.random() * 4.5).toFixed(2))
          : parseFloat((Math.random() * 7 - 3.5).toFixed(2));
        const faceShiftX =
          side *
          (isLargeDistractedLook
            ? 2.4 + Math.random() * 1.2
            : 1.4 + Math.random() * 0.9);
        const faceShiftY = isLargeDistractedLook
          ? 1.8 + Math.random() * 1.1
          : Math.max(-0.8, Math.min(1.2, sharedY * 0.2));
        const headTiltRandom = Math.random();
        const hasLargeHeadTilt = isLargeDistractedLook && headTiltRandom < 0.16;
        const hasBiggerHeadTilt =
          isLargeDistractedLook && headTiltRandom < 0.42;
        const faceTilt =
          side *
          (hasLargeHeadTilt
            ? 1.02 + Math.random() * 0.34
            : hasBiggerHeadTilt
              ? 1.05 + Math.random() * 0.3
              : isLargeDistractedLook
                ? 0.76 + Math.random() * 0.34
                : 0.44 + Math.random() * 0.28);

        applyGazeFacePose({
          x: faceShiftX,
          y: faceShiftY,
          tilt: faceTilt,
        });

        if (isLargeDistractedLook) {
          applyTemporaryGazeLidDroop(holdDuration, 0.16 + Math.random() * 0.06);
        }

        if (isLargeDistractedLook && Math.random() < (babyGaze ? 0.46 : 0.22)) {
          window.setTimeout(
            () => blinkEyes({ doubleBlink: false }),
            babyGaze ? 80 : 140,
          );
        }

        applyIrisGazePose(
          () => ({
            x:
              sharedX +
              (Math.random() * (babyGaze ? 1.2 : 0.8) - (babyGaze ? 0.6 : 0.4)),
            y:
              sharedY +
              (Math.random() * (babyGaze ? 0.75 : 0.5) -
                (babyGaze ? 0.38 : 0.25)),
          }),
          {
            overshoot: babyGaze ? 0.1 : 0.065,
            settleMs: babyGaze ? 160 : 200,
            staggerMs: babyGaze ? 16 : 12,
          },
        );

        state.gazeShiftTimerId = window.setTimeout(() => {
          applyRestingGaze();

          if (state.isLiveMotionEnabled) {
            scheduleNextGazeShift();
          } else {
            state.gazeShiftTimerId = 0;
          }
        }, holdDuration);
      }, delay);
    };

    scheduleNextGazeShift();
  }

  function startBackgroundJitter() {
    dom.irises.forEach((iris) => {
      iris.backgroundOffset = { x: 0, y: 0 };
    });

    const applyBackgroundJitter = () => {
      dom.irises.forEach((iris) => {
        if (!iris.isDragging) {
          const jitterRangeX = state.isLiveMotionEnabled ? 0.62 : 0.4;
          const jitterRangeY = state.isLiveMotionEnabled ? 0.52 : 0.4;
          const jitterX = parseFloat(
            (Math.random() * jitterRangeX - jitterRangeX / 2).toFixed(2),
          );
          const jitterY = parseFloat(
            (Math.random() * jitterRangeY - jitterRangeY / 2).toFixed(2),
          );
          iris.backgroundOffset = { x: jitterX, y: jitterY };
          updateIrisTransform(iris);
        }
      });
      notifyAmbientEyeGeometryChange();
    };

    const scheduleNextJitter = () => {
      const jitterInterval = 170 + Math.random() * 95;
      state.backgroundJitterIntervalId = window.setTimeout(() => {
        applyBackgroundJitter();
        scheduleNextJitter();
      }, jitterInterval);
    };

    scheduleNextJitter();
  }

  function applyNystagmusFrame(timestampMs) {
    const normalizedLevel =
      Math.max(0, Math.min(100, state.nystagmusLevel)) / 100;
    if (normalizedLevel <= 0) {
      return;
    }

    const { direction, wave, rate } = getNystagmusSettings();
    const rateCyclesByValue = {
      slow: 1.05,
      med: 1.75,
      fast: 2.45,
    };
    const amplitude = normalizedLevel * 9.2;
    const mixedAmplitudeY = amplitude * 0.58;
    const phaseCycles = (timestampMs / 1000) * rateCyclesByValue[rate];
    const phaseRadians = phaseCycles * Math.PI * 2;
    const cycleFraction = phaseCycles % 1;
    let didMove = false;

    dom.irises.forEach((iris) => {
      if (iris.isDragging) {
        return;
      }

      let valueX = 0;
      let valueY = 0;

      if (wave === "pendular") {
        valueX = amplitude * Math.sin(phaseRadians);
        if (direction === "mixed") {
          valueY = mixedAmplitudeY * Math.sin(phaseRadians + Math.PI / 2);
        }
      } else {
        valueX =
          cycleFraction < 0.75
            ? -amplitude + (cycleFraction / 0.75) * (2 * amplitude)
            : amplitude - ((cycleFraction - 0.75) / 0.25) * (2 * amplitude);

        if (direction === "mixed") {
          valueY = valueX >= 0 ? mixedAmplitudeY : -mixedAmplitudeY;
        }
      }

      const x = direction === "vertical" ? 0 : valueX;
      const y =
        direction === "horizontal"
          ? 0
          : direction === "vertical"
            ? valueX
            : valueY;

      const previous = iris.nystagmusOffset || { x: 0, y: 0 };
      if (Math.abs(previous.x - x) > 0.02 || Math.abs(previous.y - y) > 0.02) {
        iris.nystagmusOffset = {
          x: parseFloat(x.toFixed(2)),
          y: parseFloat(y.toFixed(2)),
        };
        updateIrisTransform(iris);
        didMove = true;
      }
    });

    if (didMove) {
      notifyEyeGeometryChange(false);
    }
  }

  function startNystagmusLoop() {
    if (state.nystagmusRafId) {
      return;
    }

    const loop = (timestampMs) => {
      applyNystagmusFrame(timestampMs);
      if (state.nystagmusLevel > 0) {
        state.nystagmusRafId = requestAnimationFrame(loop);
      } else {
        state.nystagmusRafId = 0;
      }
    };

    state.nystagmusRafId = requestAnimationFrame(loop);
  }

  function blinkEyes({ doubleBlink = false } = {}) {
    state.lastBlinkAtMs = performance.now();

    const isBabyBlink = Boolean(state.isBabyMode && state.isLiveMotionEnabled);
    const isLongBabyBlink = isBabyBlink && Math.random() < 0.26;
    const closeTransition = isBabyBlink
      ? `height ${isLongBabyBlink ? 0.34 : 0.28}s ease-in`
      : "";
    const openTransition = isBabyBlink
      ? `height ${isLongBabyBlink ? 0.38 : 0.3}s ease-out`
      : "";
    const blinkHoldMs = isLongBabyBlink
      ? 560 + Math.random() * 520
      : isBabyBlink
        ? 190 + Math.random() * 130
        : 115;

    dom.eyes.forEach((eye) => {
      const upperEyelid = eye.querySelector(".upper-eyelid");
      const lowerEyelid = eye.querySelector(".lower-eyelid");

      if (upperEyelid) {
        if (upperEyelid.blinkTimerId) {
          window.clearTimeout(upperEyelid.blinkTimerId);
        }
        upperEyelid.dataset.isBlinking = "true";
        upperEyelid.style.transition = closeTransition;
        upperEyelid.style.height = `${eye.clientHeight * 0.7}px`;
      }
      if (lowerEyelid) {
        if (lowerEyelid.blinkTimerId) {
          window.clearTimeout(lowerEyelid.blinkTimerId);
        }
        lowerEyelid.style.transition = closeTransition;
        lowerEyelid.style.height = `${eye.clientHeight * 0.3}px`;
      }

      const blinkRestoreTimerId = window.setTimeout(() => {
        if (upperEyelid) {
          delete upperEyelid.dataset.isBlinking;
          upperEyelid.blinkTimerId = 0;
          upperEyelid.style.transition = openTransition;
          upperEyelid.style.height = getActiveUpperLidHeight(upperEyelid);
          window.setTimeout(
            () => {
              if (upperEyelid.dataset.isBlinking !== "true") {
                upperEyelid.style.transition = "";
              }
            },
            isBabyBlink ? 440 : 0,
          );
        }
        if (lowerEyelid) {
          lowerEyelid.blinkTimerId = 0;
          lowerEyelid.style.transition = openTransition;
          lowerEyelid.style.height = "0px";
          window.setTimeout(
            () => {
              if (!lowerEyelid.blinkTimerId) {
                lowerEyelid.style.transition = "";
              }
            },
            isBabyBlink ? 440 : 0,
          );
        }
      }, blinkHoldMs);

      if (upperEyelid) {
        upperEyelid.blinkTimerId = blinkRestoreTimerId;
      }
      if (lowerEyelid) {
        lowerEyelid.blinkTimerId = blinkRestoreTimerId;
      }
    });

    if (doubleBlink && !isLongBabyBlink) {
      setTimeout(
        () => blinkEyes({ doubleBlink: false }),
        isBabyBlink ? 320 : 210,
      );
    }
  }

  function scheduleNextBlink() {
    const usesBabyGazeBlink = state.isBabyMode && state.isLiveMotionEnabled;
    const nextBlinkDelay = usesBabyGazeBlink
      ? 2800 + Math.random() * 3200
      : 4200 + Math.random() * 3300;
    state.blinkIntervalId = window.setTimeout(() => {
      blinkEyes({
        doubleBlink: Math.random() < (usesBabyGazeBlink ? 0.1 : 0.14),
      });
      scheduleNextBlink();
    }, nextBlinkDelay);
  }

  function resetBlinkSchedule() {
    if (state.blinkIntervalId) {
      window.clearTimeout(state.blinkIntervalId);
      state.blinkIntervalId = 0;
    }

    if (!prefersReducedMotion()) {
      scheduleNextBlink();
    }
  }

  function startAmbientAnimations() {
    if (prefersReducedMotion()) {
      return;
    }

    if (!state.microSaccadeIntervalId) {
      startMicroSaccades();
    }
    if (!state.backgroundJitterIntervalId) {
      startBackgroundJitter();
    }
    if (!state.blinkIntervalId) {
      scheduleNextBlink();
    }
    if (state.isLiveMotionEnabled && !state.gazeShiftTimerId) {
      startGazeShifts();
    }
    if (state.nystagmusLevel > 0) {
      startNystagmusLoop();
    }
  }

  function resetMotionOffsets({ includeNystagmus = true } = {}) {
    let resetNeeded = false;
    dom.irises.forEach((iris) => {
      if (iris.gazeSettleTimerId) {
        window.clearTimeout(iris.gazeSettleTimerId);
        iris.gazeSettleTimerId = 0;
      }
      if (iris.gazeStartTimerId) {
        window.clearTimeout(iris.gazeStartTimerId);
        iris.gazeStartTimerId = 0;
      }

      const previousNystagmus = iris.nystagmusOffset || { x: 0, y: 0 };
      const previousMicro = iris.microOffset || { x: 0, y: 0 };
      const previousJitter = iris.backgroundOffset || { x: 0, y: 0 };
      const previousGaze = iris.gazeOffset || { x: 0, y: 0 };

      if (
        Math.abs(previousMicro.x) > 0.02 ||
        Math.abs(previousMicro.y) > 0.02 ||
        Math.abs(previousJitter.x) > 0.02 ||
        Math.abs(previousJitter.y) > 0.02 ||
        Math.abs(previousGaze.x) > 0.02 ||
        Math.abs(previousGaze.y) > 0.02 ||
        (includeNystagmus &&
          (Math.abs(previousNystagmus.x) > 0.02 ||
            Math.abs(previousNystagmus.y) > 0.02))
      ) {
        iris.microOffset = { x: 0, y: 0 };
        iris.backgroundOffset = { x: 0, y: 0 };
        iris.gazeOffset = { x: 0, y: 0 };
        if (includeNystagmus) {
          iris.nystagmusOffset = { x: 0, y: 0 };
        }
        updateIrisTransform(iris);
        resetNeeded = true;
      }
    });

    if (resetNeeded) {
      notifyEyeGeometryChange(true);
    }
  }

  function setNystagmusLevel(value) {
    const parsed = Number.isFinite(value) ? value : parseInt(value, 10);
    if (Number.isNaN(parsed)) {
      return;
    }

    state.nystagmusLevel = Math.max(0, Math.min(100, parsed));

    if (state.nystagmusLevel > 0) {
      startNystagmusLoop();
      notifyEyeGeometryChange(false);
    }

    if (state.nystagmusLevel === 0) {
      resetMotionOffsets({ includeNystagmus: true });
    }
  }

  function setNystagmusConfig({ direction, wave, rate } = {}) {
    if (direction) {
      state.nystagmusDirection = ["horizontal", "vertical", "mixed"].includes(
        direction,
      )
        ? direction
        : state.nystagmusDirection;
    }

    if (wave) {
      state.nystagmusWave = ["jerk", "pendular"].includes(wave)
        ? wave
        : state.nystagmusWave;
    }

    if (rate) {
      state.nystagmusRate = ["slow", "med", "fast"].includes(rate)
        ? rate
        : state.nystagmusRate;
    }

    if (state.nystagmusLevel > 0) {
      startNystagmusLoop();
      notifyEyeGeometryChange(false);
    }
  }

  function setNystagmusEnabled(isEnabled) {
    setNystagmusLevel(isEnabled ? 60 : 0);
  }

  function setLiveMotionEnabled(isEnabled) {
    state.isLiveMotionEnabled = Boolean(isEnabled);
    if (!state.isLiveMotionEnabled && state.gazeShiftTimerId) {
      clearTimeout(state.gazeShiftTimerId);
      state.gazeShiftTimerId = 0;
    }
    if (!state.isLiveMotionEnabled) {
      resetTemporaryGazeLids();
      resetGazeFacePose();
    }
    resetBlinkLids();
    resetMotionOffsets({ includeNystagmus: false });
    if (state.isBabyMode) {
      resetBlinkSchedule();
    }
    startAmbientAnimations();
  }

  return {
    blinkOnce: () => blinkEyes({ doubleBlink: false }),
    setLiveMotionEnabled,
    setNystagmusConfig,
    setNystagmusEnabled,
    setNystagmusLevel,
    resetBlinkSchedule,
    startAmbientAnimations,
  };
}
