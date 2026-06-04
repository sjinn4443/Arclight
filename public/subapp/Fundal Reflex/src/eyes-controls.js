export function initDraggable({
  draggable,
  state,
  applyIrisLayoutPosition,
  applyPupilFill,
  getBrightenedDragFillValue,
  notifyEyeGeometryChange,
  syncDeviationDrivenReflexBoost,
}) {
  let dragging = false;
  const eye = draggable.closest(".eye");
  let eyeRect;
  let centreX;
  let centreY;
  let maxOffsetX;
  let maxOffsetY;
  let eyeScaleX = 1;
  let eyeScaleY = 1;

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
    const draggableRect = draggable.getBoundingClientRect();
    centreX = eyeRect.left + eyeRect.width / 2;
    centreY = eyeRect.top + eyeRect.height / 2;
    eyeScaleX = eye.offsetWidth > 0 ? eyeRect.width / eye.offsetWidth : 1;
    eyeScaleY = eye.offsetHeight > 0 ? eyeRect.height / eye.offsetHeight : 1;
    maxOffsetX = (eyeRect.width / 2 - draggableRect.width / 2) * 0.8;
    maxOffsetY = 30 * eyeScaleY * 0.8;

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

    const layoutDx = eyeScaleX > 0 ? dx / eyeScaleX : dx;
    const layoutDy = eyeScaleY > 0 ? dy / eyeScaleY : dy;

    draggable.manualOffset = { x: layoutDx, y: layoutDy };
    applyIrisLayoutPosition(draggable);

    const pupil = draggable.querySelector(".pupil");
    if (pupil) {
      const factor = syncDeviationDrivenReflexBoost(draggable);
      applyPupilFill(draggable, getBrightenedDragFillValue(factor));
    }

    notifyEyeGeometryChange({ includePosition: true, immediate: true });
  }

  function endDrag() {
    finishDrag();
  }

  draggable.cancelManualDrag = finishDrag;
  draggable.addEventListener("mousedown", startDrag);
  draggable.addEventListener("touchstart", startDrag, { passive: false });
}

export function initPupilSlider({ slider, notifyEyeGeometryChange }) {
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

export function initVerticalEyelidSliders({
  eyelidSliders,
  notifyEyeGeometryChange,
}) {
  eyelidSliders.forEach((slider) => {
    slider.addEventListener("input", () => {
      const eyeData = slider.getAttribute("data-eye");
      const eye = document.querySelector(`.eye[data-eye="${eyeData}"]`);
      if (!eye) {
        return;
      }

      const upperEyelid = eye.querySelector(".upper-eyelid");
      if (upperEyelid) {
        const heightPx = `${slider.value * 1.5}px`;
        upperEyelid.dataset.restingHeightPx = heightPx;
        if (
          upperEyelid.dataset.isBlinking !== "true" &&
          !upperEyelid.dataset.gazeLidDroopHeightPx
        ) {
          upperEyelid.style.height = heightPx;
        }
      }
      notifyEyeGeometryChange(false);
    });
  });
}
