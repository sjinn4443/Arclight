function clamp(value, min, max) {
  return Math.max(min, Math.min(max, value));
}

export function createStreakControlsController({
  state,
  dom,
  retinoscopyController,
}) {
  const { retStreak, retStreakRotateHandle, retStreakSweepHandle } = dom;

  const SWEEP_LIMIT = 50;
  const ROTATION_LIMIT = 90;
  const SWEEP_PIXELS_PER_UNIT = 2;
  const ROTATION_PIXELS_PER_DEG = 1.15;

  let hintTimerId = 0;

  function hideHint() {
    if (!retStreak) {
      return;
    }

    if (hintTimerId) {
      window.clearTimeout(hintTimerId);
      hintTimerId = 0;
    }

    retStreak.classList.remove("is-hint-visible");
  }

  function showHint() {
    if (!retStreak) {
      return;
    }

    retStreak.classList.add("is-hint-visible");
    hintTimerId = window.setTimeout(() => {
      retStreak.classList.remove("is-hint-visible");
      hintTimerId = 0;
    }, 3000);
  }

  function bindPointerDrag(
    handle,
    { getValue, max, min, pixelsPerUnit, setValue },
  ) {
    if (!handle) {
      return;
    }

    let activePointerId = null;
    let startX = 0;
    let startY = 0;
    let startAngleRad = 0;
    let startValue = 0;

    function endDrag(event) {
      if (activePointerId === null) {
        return;
      }

      if (event && event.pointerId !== activePointerId) {
        return;
      }

      activePointerId = null;
      (handle.closest?.(".ret-streak") || handle).classList.remove(
        "is-dragging",
      );
    }

    handle.addEventListener("pointerdown", (event) => {
      if (event.button !== undefined && event.button !== 0) {
        return;
      }

      hideHint();
      event.stopPropagation();
      activePointerId = event.pointerId;
      startX = event.clientX;
      startY = event.clientY;
      startAngleRad = (state.retStreakRotation * Math.PI) / 180;
      startValue = getValue();
      (handle.closest?.(".ret-streak") || handle).classList.add("is-dragging");
      handle.setPointerCapture?.(event.pointerId);
      event.preventDefault();
    });

    handle.addEventListener("pointermove", (event) => {
      if (event.pointerId !== activePointerId) {
        return;
      }

      const deltaX = event.clientX - startX;
      const deltaY = event.clientY - startY;
      const projectedDelta =
        deltaX * Math.cos(startAngleRad) + deltaY * Math.sin(startAngleRad);
      const nextValue = clamp(
        startValue + projectedDelta / pixelsPerUnit,
        min,
        max,
      );
      setValue(Math.round(nextValue));
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
        event.key !== "Home" &&
        event.key !== "End"
      ) {
        return;
      }

      hideHint();
      event.preventDefault();
      setNextValue(event.key, step);
    });
  }

  function init() {
    if (!retStreak || !retStreakRotateHandle || !retStreakSweepHandle) {
      return;
    }

    bindPointerDrag(retStreakSweepHandle, {
      getValue: () => state.retStreakOffset,
      max: SWEEP_LIMIT,
      min: -SWEEP_LIMIT,
      pixelsPerUnit: SWEEP_PIXELS_PER_UNIT,
      setValue: (value) => retinoscopyController.setRetStreakOffset(value),
    });

    bindPointerDrag(retStreak, {
      getValue: () => state.retStreakOffset,
      max: SWEEP_LIMIT,
      min: -SWEEP_LIMIT,
      pixelsPerUnit: SWEEP_PIXELS_PER_UNIT,
      setValue: (value) => retinoscopyController.setRetStreakOffset(value),
    });

    bindPointerDrag(retStreakRotateHandle, {
      getValue: () => state.retStreakRotation,
      max: ROTATION_LIMIT,
      min: -ROTATION_LIMIT,
      pixelsPerUnit: ROTATION_PIXELS_PER_DEG,
      setValue: (value) => retinoscopyController.setRetStreakRotation(value),
    });

    bindKeyboard(retStreakSweepHandle, {
      step: 5,
      setNextValue: (key, step) => {
        if (key === "Home") {
          retinoscopyController.setRetStreakOffset(0);
          return;
        }
        if (key === "End") {
          retinoscopyController.setRetStreakOffset(SWEEP_LIMIT);
          return;
        }

        const delta = key === "ArrowLeft" ? -step : step;
        retinoscopyController.setRetStreakOffset(
          clamp(state.retStreakOffset + delta, -SWEEP_LIMIT, SWEEP_LIMIT),
        );
      },
    });

    bindKeyboard(retStreakRotateHandle, {
      step: 6,
      setNextValue: (key, step) => {
        if (key === "Home") {
          retinoscopyController.setRetStreakRotation(0);
          return;
        }
        if (key === "End") {
          retinoscopyController.setRetStreakRotation(ROTATION_LIMIT);
          return;
        }

        const delta = key === "ArrowLeft" ? -step : step;
        retinoscopyController.setRetStreakRotation(
          clamp(
            state.retStreakRotation + delta,
            -ROTATION_LIMIT,
            ROTATION_LIMIT,
          ),
        );
      },
    });

    showHint();
  }

  return {
    hideHint,
    init,
  };
}
