function clamp(value, min, max) {
  return Math.max(min, Math.min(max, value));
}

export function createStreakControlsController({
  state,
  dom,
  onLargeLightMove,
  retinoscopyController,
}) {
  const { retStreak } = dom;

  const DEFAULT_SWEEP_LIMIT = 100;
  const DEFAULT_VERTICAL_SWEEP_LIMIT = 18;
  const SNAP_BACK_DURATION_MS = 130;
  const SWEEP_PIXELS_PER_UNIT = 2;

  let snapTimerId = 0;
  let hasDismissedHint = false;
  let lastLightBlinkAtMs = 0;

  function getBeamElements() {
    return [retStreak, document.getElementById("ret-streak-visual")].filter(
      Boolean,
    );
  }

  function disableSnapBack() {
    if (snapTimerId) {
      window.clearTimeout(snapTimerId);
      snapTimerId = 0;
    }

    getBeamElements().forEach((element) => {
      element.classList.remove("is-snapping");
    });
  }

  function enableSnapBack() {
    disableSnapBack();
    getBeamElements().forEach((element) => {
      element.classList.add("is-snapping");
    });
    snapTimerId = window.setTimeout(() => {
      getBeamElements().forEach((element) => {
        element.classList.remove("is-snapping");
      });
      snapTimerId = 0;
    }, SNAP_BACK_DURATION_MS + 40);
  }

  function hideHint() {
    if (!retStreak) {
      return;
    }

    hasDismissedHint = true;
    retStreak.classList.remove("is-hint-visible");
  }

  function showHint() {
    if (!retStreak || hasDismissedHint) {
      return;
    }

    retStreak.classList.add("is-hint-visible");
  }

  function getSweepBounds() {
    const boundsX = retinoscopyController.getRetStreakOffsetBounds?.();
    const boundsY = retinoscopyController.getRetStreakOffsetYBounds?.();
    return {
      minX: Number.isFinite(boundsX?.min) ? boundsX.min : -DEFAULT_SWEEP_LIMIT,
      maxX: Number.isFinite(boundsX?.max) ? boundsX.max : DEFAULT_SWEEP_LIMIT,
      minY: Number.isFinite(boundsY?.min)
        ? boundsY.min
        : -DEFAULT_VERTICAL_SWEEP_LIMIT,
      maxY: Number.isFinite(boundsY?.max)
        ? boundsY.max
        : DEFAULT_VERTICAL_SWEEP_LIMIT,
    };
  }

  function bindPointerDrag(
    handle,
    { getValue, getBounds, pixelsPerUnit, setValue },
  ) {
    if (!handle) {
      return;
    }

    let activePointerId = null;
    let startX = 0;
    let startY = 0;
    let startValueX = 0;
    let startValueY = 0;
    let hasDragged = false;

    function resetToCentre() {
      const { x, y } = getValue();
      if (x !== 0 || y !== 0) {
        enableSnapBack();
        setValue(0, 0);
      }
    }

    function endDrag(event) {
      if (activePointerId === null) {
        return;
      }

      if (event && event.pointerId !== activePointerId) {
        return;
      }

      activePointerId = null;
      retinoscopyController.setLightHoldActive?.(false);
      resetToCentre();
    }

    handle.addEventListener("pointerdown", (event) => {
      if (event.button !== undefined && event.button !== 0) {
        return;
      }

      disableSnapBack();
      retinoscopyController.setLightHoldActive?.(true);
      activePointerId = event.pointerId;
      startX = event.clientX;
      startY = event.clientY;
      const startValue = getValue();
      startValueX = startValue.x || 0;
      startValueY = startValue.y || 0;
      hasDragged = false;
      handle.setPointerCapture?.(event.pointerId);
      event.preventDefault();
    });

    handle.addEventListener("pointermove", (event) => {
      if (event.pointerId !== activePointerId) {
        return;
      }

      const { minX, maxX, minY, maxY } = getBounds();
      const nextValueX = clamp(
        startValueX + (event.clientX - startX) / pixelsPerUnit,
        minX,
        maxX,
      );
      const nextValueY = clamp(
        startValueY + (event.clientY - startY) / pixelsPerUnit,
        minY,
        maxY,
      );
      const roundedValueX = Math.round(nextValueX);
      const roundedValueY = Math.round(nextValueY);
      const dragDistance = Math.hypot(
        roundedValueX - startValueX,
        roundedValueY - startValueY,
      );
      const nowMs = performance.now();
      if (
        dragDistance > 28 &&
        nowMs - lastLightBlinkAtMs > 2400 &&
        typeof onLargeLightMove === "function"
      ) {
        lastLightBlinkAtMs = nowMs;
        onLargeLightMove();
      }
      if (
        !hasDragged &&
        (roundedValueX !== startValueX || roundedValueY !== startValueY)
      ) {
        hasDragged = true;
        hideHint();
      }
      setValue(roundedValueX, roundedValueY);
    });

    handle.addEventListener("pointerup", endDrag);
    handle.addEventListener("pointercancel", endDrag);
    handle.addEventListener("lostpointercapture", endDrag);
  }

  function bindKeyboard(handle, { step, setNextValue }) {
    if (!handle) {
      return;
    }

    handle.addEventListener("keydown", (event) => {
      if (
        event.key !== "ArrowLeft" &&
        event.key !== "ArrowRight" &&
        event.key !== "ArrowUp" &&
        event.key !== "ArrowDown" &&
        event.key !== "Home" &&
        event.key !== "End"
      ) {
        return;
      }

      event.preventDefault();
      const didMove = setNextValue(event.key, step);
      if (didMove) {
        hideHint();
      }
    });
  }

  function init() {
    if (!retStreak) {
      return;
    }

    const dragHandle =
      retStreak.querySelector(".fundal-light-probe__handle") || retStreak;

    bindPointerDrag(dragHandle, {
      getValue: () => ({
        x: state.retStreakOffset || 0,
        y: state.retStreakOffsetY || 0,
      }),
      getBounds: getSweepBounds,
      pixelsPerUnit: SWEEP_PIXELS_PER_UNIT,
      setValue: (xValue, yValue) =>
        retinoscopyController.setRetStreakOffset(xValue, yValue),
    });

    bindKeyboard(retStreak, {
      step: 5,
      setNextValue: (key, step) => {
        const { minX, maxX, minY, maxY } = getSweepBounds();
        if (key === "Home") {
          if (state.retStreakOffset === 0 && state.retStreakOffsetY === 0) {
            return false;
          }
          retinoscopyController.setRetStreakOffset(0, 0);
          return true;
        }
        if (key === "End") {
          if (state.retStreakOffset === maxX && state.retStreakOffsetY === 0) {
            return false;
          }
          retinoscopyController.setRetStreakOffset(maxX, 0);
          return true;
        }

        const deltaX =
          key === "ArrowLeft" ? -step : key === "ArrowRight" ? step : 0;
        const deltaY =
          key === "ArrowUp" ? -step : key === "ArrowDown" ? step : 0;
        const currentValueX = state.retStreakOffset || 0;
        const nextValueX = clamp(currentValueX + deltaX, minX, maxX);
        const currentValueY = state.retStreakOffsetY || 0;
        const nextValueY = clamp(currentValueY + deltaY, minY, maxY);
        if (nextValueX === currentValueX && nextValueY === currentValueY) {
          return false;
        }
        retinoscopyController.setRetStreakOffset(nextValueX, nextValueY);
        return true;
      },
    });

    showHint();
  }

  return {
    hideHint,
    init,
  };
}
