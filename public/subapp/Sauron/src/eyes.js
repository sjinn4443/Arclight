import { brightenColor } from "./color.js";
import { prefersReducedMotion } from "./motion.js";

export function createEyesController({ state, dom, onEyeGeometryChange }) {
  function applyPupilFill(target, fillValue) {
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

  function applyManualEyeMoveState() {
    dom.irises.forEach((iris) => {
      iris.classList.toggle(
        "is-manual-drag-enabled",
        state.isManualEyeMoveEnabled,
      );
    });
  }

  function getCataractPupilFilter(level) {
    const normalized = Math.max(0, Math.min(100, level)) / 100;
    const brightness = 1 - normalized * 0.72;
    const saturation = 1 - normalized * 0.64;
    const contrast = 1 - normalized * 0.18;
    return `brightness(${brightness.toFixed(2)}) saturate(${saturation.toFixed(2)}) contrast(${contrast.toFixed(2)})`;
  }

  function applyCataractToPupils() {
    const filterValue = getCataractPupilFilter(state.cataractLevel);
    dom.irises.forEach((iris) => {
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

  function notifyEyeGeometryChange(includePosition = true) {
    if (typeof onEyeGeometryChange === "function") {
      onEyeGeometryChange({ includePosition });
    }
  }

  function notifyAmbientEyeGeometryChange(
    includePosition = state.nystagmusLevel === 0,
  ) {
    notifyEyeGeometryChange(state.isGazeMode ? false : includePosition);
  }

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

  function updateIrisTransform(iris) {
    const totalX =
      (iris.microOffset?.x || 0) +
      (iris.backgroundOffset?.x || 0) +
      (iris.gazeOffset?.x || 0) +
      (iris.nystagmusOffset?.x || 0);
    const totalY =
      (iris.microOffset?.y || 0) +
      (iris.backgroundOffset?.y || 0) +
      (iris.gazeOffset?.y || 0) +
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

  function dispatchInput(element) {
    if (!element) {
      return;
    }

    element.dispatchEvent(new Event("input", { bubbles: true }));
  }

  function setPupilSliderValues(values) {
    dom.pupilSizeSliders.forEach((slider, index) => {
      const nextValue = values[index] ?? values[0];
      if (nextValue === undefined) {
        return;
      }

      slider.value = String(nextValue);
      dispatchInput(slider);
    });
  }

  function clearGazeTimers() {
    if (state.gazeIntervalId) {
      window.clearInterval(state.gazeIntervalId);
      state.gazeIntervalId = 0;
    }

    if (state.gazeReturnTimeoutId) {
      window.clearTimeout(state.gazeReturnTimeoutId);
      state.gazeReturnTimeoutId = 0;
    }

    if (state.gazeShiftTimerId) {
      window.clearTimeout(state.gazeShiftTimerId);
      state.gazeShiftTimerId = 0;
    }

    dom.irises.forEach((iris) => {
      if (iris.gazeSettleTimerId) {
        window.clearTimeout(iris.gazeSettleTimerId);
        iris.gazeSettleTimerId = 0;
      }
      if (iris.gazeStartTimerId) {
        window.clearTimeout(iris.gazeStartTimerId);
        iris.gazeStartTimerId = 0;
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

      const startDelay = index * staggerMs;
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

  function resetGazeOffset() {
    dom.irises.forEach((iris) => {
      iris.gazeOffset = { x: 0, y: 0 };
      updateIrisTransform(iris);
    });
    notifyEyeGeometryChange(false);
  }

  function startGazeShifts() {
    clearGazeTimers();

    if (!state.isGazeMode || prefersReducedMotion()) {
      return;
    }

    let isFirstShift = true;

    const applyRestingGaze = () => {
      const side = Math.random() < 0.5 ? -1 : 1;
      const restingGazeX = parseFloat(
        (side * (2.2 + Math.random() * 2.2)).toFixed(2),
      );
      const restingGazeY = parseFloat((Math.random() * 2.2 - 1.1).toFixed(2));
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
        if (!state.isGazeMode) {
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

          if (state.isGazeMode) {
            scheduleNextGazeShift();
          } else {
            state.gazeShiftTimerId = 0;
          }
        }, holdDuration);
      }, delay);
    };

    applyRestingGaze();
    scheduleNextGazeShift();
  }

  function startGazeLoop() {
    startGazeShifts();
  }

  function initDraggable(draggable) {
    let dragging = false;
    const eye = draggable.closest(".eye");
    let eyeRect;
    let centreX;
    let centreY;
    let maxOffsetX;
    let maxOffsetY;

    function removePointerListeners() {
      document.removeEventListener("touchmove", onDrag);
      document.removeEventListener("touchend", endDrag);
      document.removeEventListener("touchcancel", endDrag);
      document.removeEventListener("mousemove", onDrag);
      document.removeEventListener("mouseup", endDrag);
    }

    function finishDrag() {
      dragging = false;
      draggable.isDragging = false;
      removePointerListeners();
    }

    function startDrag(event) {
      if (!state.isManualEyeMoveEnabled || state.isTestMode) {
        return;
      }

      event.preventDefault();
      dragging = true;
      draggable.isDragging = true;

      eyeRect = eye.getBoundingClientRect();
      centreX = eyeRect.left + eyeRect.width / 2;
      centreY = eyeRect.top + eyeRect.height / 2;
      maxOffsetX = (eyeRect.width / 2 - draggable.offsetWidth / 2) * 0.8;
      maxOffsetY = 30 * 0.8;

      if (event.type === "touchstart") {
        document.addEventListener("touchmove", onDrag, { passive: false });
        document.addEventListener("touchend", endDrag);
        document.addEventListener("touchcancel", endDrag);
      } else {
        document.addEventListener("mousemove", onDrag);
        document.addEventListener("mouseup", endDrag);
      }
    }

    function onDrag(event) {
      if (!dragging) {
        return;
      }

      if (!state.isManualEyeMoveEnabled || state.isTestMode) {
        finishDrag();
        return;
      }

      let pointerX;
      let pointerY;
      if (event.type === "touchmove") {
        pointerX = event.touches[0].clientX;
        pointerY = event.touches[0].clientY;
      } else {
        pointerX = event.clientX;
        pointerY = event.clientY;
      }

      let dx = pointerX - centreX;
      let dy = pointerY - centreY;
      if (Math.abs(dx) > maxOffsetX) {
        dx = Math.sign(dx) * maxOffsetX;
      }
      if (Math.abs(dy) > maxOffsetY) {
        dy = Math.sign(dy) * maxOffsetY;
      }

      draggable.style.left = `calc(50% + ${dx}px - ${draggable.offsetWidth / 2}px)`;
      draggable.style.top = `calc(50% + ${dy}px - ${draggable.offsetHeight / 2}px)`;

      const pupil = draggable.querySelector(".pupil");
      if (pupil) {
        const distance = Math.sqrt(dx * dx + dy * dy);
        const maxDistance = Math.sqrt(maxOffsetX ** 2 + maxOffsetY ** 2);
        const factor = 1 + Math.min(distance / maxDistance, 1);
        const brightColor = brightenColor(state.baseReflexColor, factor);
        applyPupilFill(
          draggable,
          `rgb(${brightColor.r}, ${brightColor.g}, ${brightColor.b})`,
        );
      }

      notifyEyeGeometryChange();
    }

    function endDrag() {
      finishDrag();
    }

    draggable.cancelManualDrag = finishDrag;
    draggable.addEventListener("mousedown", startDrag);
    draggable.addEventListener("touchstart", startDrag, { passive: false });
  }

  function initPupilSlider(slider) {
    function updatePupil() {
      const eyeData = slider.getAttribute("data-eye");
      const eye = document.querySelector(`.eye[data-eye="${eyeData}"]`);
      if (!eye) {
        return;
      }

      const pupil = eye.querySelector(".pupil");
      const newSize = parseInt(slider.value, 10);
      pupil.dataset.baseSizePx = String(newSize);
      pupil.style.width = `${newSize}px`;
      pupil.style.height = `${newSize}px`;
      pupil.style.left = `calc(50% - ${newSize / 2}px)`;
      pupil.style.top = `calc(50% - ${newSize / 2}px)`;
      notifyEyeGeometryChange(false);
    }

    function snapToCentre() {
      const centre = 32;
      const tolerance = 3;
      const current = parseInt(slider.value, 10);
      if (Math.abs(current - centre) <= tolerance) {
        slider.value = centre;
        updatePupil();
      }
    }

    slider.addEventListener("input", updatePupil);
    slider.addEventListener("change", snapToCentre);
    slider.addEventListener("mouseup", snapToCentre);
    slider.addEventListener("touchend", snapToCentre);
    updatePupil();
  }

  function initVerticalEyelidSlider() {
    dom.eyelidSliders.forEach((slider) => {
      slider.addEventListener("input", () => {
        const eyeData = slider.getAttribute("data-eye");
        const eye = document.querySelector(`.eye[data-eye="${eyeData}"]`);
        if (!eye) {
          return;
        }

        const upperEyelid = eye.querySelector(".upper-eyelid");
        if (upperEyelid) {
          const restingHeight = `${slider.value * 1.5}px`;
          upperEyelid.dataset.restingHeightPx = restingHeight;
          if (
            upperEyelid.dataset.isBlinking !== "true" &&
            !upperEyelid.dataset.gazeLidDroopHeightPx
          ) {
            upperEyelid.style.height = restingHeight;
          }
        }
        notifyEyeGeometryChange(false);
      });
    });
  }

  function startMicroSaccades() {
    const saccadeInterval = 2300;
    const saccadeDuration = 120;

    dom.irises.forEach((iris) => {
      iris.microOffset = { x: 0, y: 0 };
    });

    state.microSaccadeIntervalId = window.setInterval(() => {
      const hasLargerShift = state.isGazeMode && Math.random() < 0.18;
      const horizontalRange = state.isGazeMode
        ? hasLargerShift
          ? 4.8
          : 2.6
        : 2;
      const verticalRange = state.isGazeMode ? (hasLargerShift ? 2.6 : 1.4) : 2;
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

  function startBackgroundJitter() {
    dom.irises.forEach((iris) => {
      iris.backgroundOffset = { x: 0, y: 0 };
    });

    const applyBackgroundJitter = () => {
      dom.irises.forEach((iris) => {
        if (!iris.isDragging) {
          const jitterRangeX = state.isGazeMode ? 0.62 : 0.4;
          const jitterRangeY = state.isGazeMode ? 0.52 : 0.4;
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

    const amplitudeX = normalizedLevel * 9.5;
    const amplitudeY = normalizedLevel * 1.3;
    const frequencyHz = 0.45 + normalizedLevel * 3.9;
    const phaseBase = (timestampMs / 1000) * Math.PI * 2 * frequencyHz;
    let didMove = false;

    dom.irises.forEach((iris, index) => {
      if (iris.isDragging) {
        return;
      }

      const eyePhaseOffset = index * 0.22;
      const phase = phaseBase + eyePhaseOffset;
      const fastComponent = Math.sin(phase);
      const slowComponent = Math.sin(phase * 0.5);
      const x =
        amplitudeX *
        (0.82 * fastComponent +
          0.18 * Math.sign(fastComponent) * slowComponent);
      const y = amplitudeY * Math.sin(phase * 2 + 0.8);

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
      // Keep examiner-owned streak anchor fixed while eyes move with nystagmus.
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

    const isBabyBlink = Boolean(state.isBabyMode && state.isGazeMode);
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
      window.setTimeout(
        () => blinkEyes({ doubleBlink: false }),
        isBabyBlink ? 320 : 210,
      );
    }
  }

  function scheduleNextBlink() {
    const usesBabyGazeBlink = state.isBabyMode && state.isGazeMode;
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
    if (state.nystagmusLevel > 0) {
      startNystagmusLoop();
    }
    if (state.isGazeMode && !state.gazeShiftTimerId) {
      startGazeLoop();
    }
  }

  function applyReflexColor(color) {
    dom.irises.forEach((iris) => {
      applyPupilFill(iris, color);
    });
    applyCataractToPupils();
  }

  function setCataractLevel(value) {
    const parsed = Number.isFinite(value) ? value : parseInt(value, 10);
    if (Number.isNaN(parsed)) {
      return;
    }

    state.cataractLevel = Math.max(0, Math.min(100, parsed));
    applyCataractToPupils();
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
      let resetNeeded = false;
      dom.irises.forEach((iris) => {
        const previous = iris.nystagmusOffset || { x: 0, y: 0 };
        if (Math.abs(previous.x) > 0.02 || Math.abs(previous.y) > 0.02) {
          iris.nystagmusOffset = { x: 0, y: 0 };
          updateIrisTransform(iris);
          resetNeeded = true;
        }
      });

      if (resetNeeded) {
        notifyEyeGeometryChange(true);
      }
    }
  }

  function setManualEyeMoveEnabled(isEnabled) {
    state.isManualEyeMoveEnabled = Boolean(isEnabled);
    if (!state.isManualEyeMoveEnabled || state.isTestMode) {
      dom.irises.forEach((iris) => {
        if (typeof iris.cancelManualDrag === "function") {
          iris.cancelManualDrag();
        }
      });
    }
    applyManualEyeMoveState();
  }

  function setGazeMode(isEnabled) {
    const nextEnabled = Boolean(isEnabled);
    if (nextEnabled === state.isGazeMode) {
      return;
    }

    state.isGazeMode = nextEnabled;
    resetBlinkLids();
    resetBlinkSchedule();

    if (nextEnabled) {
      startGazeShifts();
      return;
    }

    clearGazeTimers();
    resetTemporaryGazeLids();
    resetGazeFacePose();
    resetGazeOffset();
  }

  function setDilatedMode(isEnabled) {
    const nextEnabled = Boolean(isEnabled);
    if (nextEnabled === state.isDilatedMode) {
      return;
    }

    if (nextEnabled) {
      state.dilatedPreviousPupilValues = dom.pupilSizeSliders.map(
        (slider) => slider.value,
      );
      setPupilSliderValues([44, 44]);
    } else if (state.dilatedPreviousPupilValues) {
      setPupilSliderValues(state.dilatedPreviousPupilValues);
      state.dilatedPreviousPupilValues = null;
    } else {
      setPupilSliderValues([32, 32]);
    }

    state.isDilatedMode = nextEnabled;
    notifyEyeGeometryChange(false);
  }

  function setBabyMode(isEnabled) {
    const nextEnabled = Boolean(isEnabled);
    const previousEnabled = state.isBabyMode;
    state.isBabyMode = nextEnabled;
    if (dom.eyesWrapper) {
      dom.eyesWrapper.classList.toggle("is-baby-mode", state.isBabyMode);
    }
    if (previousEnabled !== nextEnabled) {
      resetBlinkLids();
      resetBlinkSchedule();
    }
    notifyEyeGeometryChange(true);
  }

  function init() {
    dom.irises.forEach((iris) => {
      iris.nystagmusOffset = { x: 0, y: 0 };
      iris.gazeOffset = { x: 0, y: 0 };
      iris.microOffset = { x: 0, y: 0 };
      iris.backgroundOffset = { x: 0, y: 0 };
    });
    dom.irises.forEach(initDraggable);
    dom.pupilSizeSliders.forEach(initPupilSlider);
    initVerticalEyelidSlider();
    applyCataractToPupils();
    applyManualEyeMoveState();
    if (dom.eyesWrapper) {
      dom.eyesWrapper.classList.toggle("is-baby-mode", state.isBabyMode);
    }
  }

  return {
    init,
    applyReflexColor,
    setCataractLevel,
    setBabyMode,
    setDilatedMode,
    setGazeMode,
    setManualEyeMoveEnabled,
    setNystagmusLevel,
    startAmbientAnimations,
  };
}
