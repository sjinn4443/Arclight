import { prefersReducedMotion } from "./motion.js";

const OBSERVATION_GUIDE_COLLAPSE_DELAY_MS = 5000;
const TEACHING_REPLAY_OPEN_DELAY_MS = 900;
const TEACHING_REPLAY_FINAL_HOLD_MS = 3000;
const PRIMARY_TEACHING_REPLAY_CUES = ["Match", "Bright", "Straight"];
const FULL_TEACHING_REPLAY_CUES = [
  "Light",
  "Colour",
  "Shape",
  "Crescent",
  "Cornea",
  "Compare",
];
const TEACHING_REPLAY_CUE_DURATIONS = {
  Bright: 2400,
  Crescent: 2600,
  Compare: 2600,
  Colour: 2400,
  Cornea: 2400,
  Light: 2400,
  Match: 2400,
  Shape: 2400,
  Straight: 2400,
};

export function createObservationGuideController({
  dom,
  isPrimaryCase,
  state,
}) {
  if (
    !dom.observationGuide ||
    !dom.observationGuideToggle ||
    !dom.observationGuideItems?.length ||
    !dom.observationGuideDetail
  ) {
    return null;
  }

  let selectedKey = "";
  let hoveredKey = "";
  let teachingKey = "";
  let hintTimerId = 0;
  let collapseTimerId = 0;
  let teachingReplayTimerIds = [];
  let isObservationGuideUserControlled = false;

  const getGuideMode = () =>
    isPrimaryCase(state.currentRefraction) ? "primary" : "full";

  const getActiveGuideKeys = () =>
    getGuideMode() === "primary"
      ? PRIMARY_TEACHING_REPLAY_CUES
      : FULL_TEACHING_REPLAY_CUES;

  const hideTeachingOverlay = () => {
    dom.observationTeachingOverlay?.classList.remove("is-visible");
    dom.observationTeachingTargets?.forEach((target) => {
      target.classList.remove(
        "is-visible",
        "is-crescent-top",
        "is-crescent-bottom",
      );
      target.dataset.guideCue = "";
      target.removeAttribute("style");
    });
    dom.observationTeachingConnector?.classList.remove("is-visible");
    dom.observationTeachingConnector?.removeAttribute("style");
  };

  const syncObservationGuideMode = () => {
    const mode = getGuideMode();
    const activeKeys = getActiveGuideKeys();
    dom.observationGuide.classList.toggle(
      "is-primary-guide",
      mode === "primary",
    );
    dom.observationGuide.classList.toggle("is-full-guide", mode === "full");

    if (selectedKey && !activeKeys.includes(selectedKey)) {
      selectedKey = "";
    }

    if (hoveredKey && !activeKeys.includes(hoveredKey)) {
      hoveredKey = "";
    }

    if (teachingKey && !activeKeys.includes(teachingKey)) {
      teachingKey = "";
      hideTeachingOverlay();
    }
  };

  const getGuideItemByKey = (key) =>
    dom.observationGuideItems.find((item) => item.dataset.guideLabel === key) ||
    null;

  const clearObservationGuideCollapseTimer = () => {
    if (collapseTimerId) {
      window.clearTimeout(collapseTimerId);
      collapseTimerId = 0;
    }
  };

  const hideObservationGuideHint = () => {
    if (hintTimerId) {
      window.clearTimeout(hintTimerId);
      hintTimerId = 0;
    }

    dom.observationGuide.classList.remove("is-hint-visible");
  };

  const clearTeachingReplay = () => {
    teachingReplayTimerIds.forEach((timerId) => window.clearTimeout(timerId));
    teachingReplayTimerIds = [];
    teachingKey = "";
    hideTeachingOverlay();
  };

  const queueTeachingReplayTimer = (callback, delay) => {
    const timerId = window.setTimeout(() => {
      teachingReplayTimerIds = teachingReplayTimerIds.filter(
        (id) => id !== timerId,
      );
      callback();
    }, delay);
    teachingReplayTimerIds.push(timerId);
  };

  const showObservationGuideHint = () => {
    if (prefersReducedMotion()) {
      return;
    }

    hideObservationGuideHint();
    dom.observationGuide.classList.add("is-hint-visible");
    hintTimerId = window.setTimeout(() => {
      dom.observationGuide.classList.remove("is-hint-visible");
      hintTimerId = 0;
    }, 3000);
  };

  const getStageRelativeRect = (element) => {
    const wrapperRect = dom.eyesWrapper?.getBoundingClientRect();
    const elementRect = element?.getBoundingClientRect?.();

    if (!wrapperRect || !elementRect) {
      return null;
    }

    return {
      bottom: elementRect.bottom - wrapperRect.top,
      height: elementRect.height,
      left: elementRect.left - wrapperRect.left,
      right: elementRect.right - wrapperRect.left,
      top: elementRect.top - wrapperRect.top,
      width: elementRect.width,
    };
  };

  const setTeachingTargetBox = (
    target,
    rect,
    {
      cue,
      expandX = 0,
      expandY = expandX,
      extraClass = "",
      forceCircle = false,
    } = {},
  ) => {
    if (!target || !rect) {
      return false;
    }

    let targetRect = rect;
    if (forceCircle) {
      const centreX = rect.left + rect.width * 0.5;
      const centreY = rect.top + rect.height * 0.5;
      const size = Math.max(
        rect.width + expandX * 2,
        rect.height + expandY * 2,
      );
      targetRect = {
        height: size,
        left: centreX - size * 0.5,
        top: centreY - size * 0.5,
        width: size,
      };
      expandX = 0;
      expandY = 0;
    }

    target.className = `observation-teaching-target ${target.classList.contains("observation-teaching-target--secondary") ? "observation-teaching-target--secondary" : "observation-teaching-target--primary"}`;
    if (extraClass) {
      target.classList.add(extraClass);
    }
    target.dataset.guideCue = cue || "";
    const renderedRect = {
      height: targetRect.height + expandY * 2,
      left: targetRect.left - expandX,
      top: targetRect.top - expandY,
      width: targetRect.width + expandX * 2,
    };

    target.style.left = `${renderedRect.left}px`;
    target.style.top = `${renderedRect.top}px`;
    target.style.width = `${renderedRect.width}px`;
    target.style.height = `${renderedRect.height}px`;
    target.classList.add("is-visible");
    return renderedRect;
  };

  const getInsetRect = (rect, insetRatio) => {
    if (!rect) {
      return null;
    }

    const insetX = rect.width * insetRatio;
    const insetY = rect.height * insetRatio;
    return {
      bottom: rect.bottom - insetY,
      height: Math.max(1, rect.height - insetY * 2),
      left: rect.left + insetX,
      right: rect.right - insetX,
      top: rect.top + insetY,
      width: Math.max(1, rect.width - insetX * 2),
    };
  };

  const getCornealDotRect = (eye) => {
    const eyeRect = getStageRelativeRect(eye);
    if (!eyeRect) {
      return null;
    }

    const size = 16;
    const direction = eye?.dataset.eye === "left" ? 1 : -1;
    const centreX = eyeRect.left + eyeRect.width * 0.5 + direction * 8;
    const centreY = eyeRect.top + eyeRect.height * 0.5;
    return {
      bottom: centreY + size * 0.5,
      height: size,
      left: centreX - size * 0.5,
      right: centreX + size * 0.5,
      top: centreY - size * 0.5,
      width: size,
    };
  };

  const getCrescentGuideRect = (pupilRect, isBottomCrescent) => {
    if (!pupilRect) {
      return null;
    }

    const width = pupilRect.width * 0.94;
    const height = pupilRect.height * 0.48;
    return {
      bottom: isBottomCrescent
        ? pupilRect.top + pupilRect.height
        : pupilRect.top + height,
      height,
      left: pupilRect.left + (pupilRect.width - width) * 0.5,
      right: pupilRect.left + (pupilRect.width + width) * 0.5,
      top: isBottomCrescent
        ? pupilRect.top + pupilRect.height - height
        : pupilRect.top,
      width,
    };
  };

  const setTeachingGuideConnector = (key, targetRectOverride = null) => {
    const connector = dom.observationTeachingConnector;
    const guideItem = getGuideItemByKey(key);
    const wrapperRect = dom.eyesWrapper?.getBoundingClientRect();
    const guideRect = guideItem?.getBoundingClientRect?.();
    const primaryTarget = dom.observationTeachingTargets?.[0];
    const targetRect =
      targetRectOverride || primaryTarget?.getBoundingClientRect?.();

    if (!connector || !wrapperRect || !guideRect || !targetRect) {
      return;
    }

    const start = {
      x: (guideRect.left + guideRect.right) * 0.5 - wrapperRect.left,
      y: guideRect.bottom - wrapperRect.top + 5,
    };
    const targetCentreX = targetRectOverride
      ? targetRect.left + targetRect.width * 0.5
      : (targetRect.left + targetRect.right) * 0.5 - wrapperRect.left;
    const targetTopY = targetRectOverride
      ? targetRect.top - 4
      : targetRect.top - wrapperRect.top - 4;
    const minEndY = start.y + 28;
    const end = {
      x: targetCentreX,
      y: Math.max(targetTopY, minEndY),
    };
    const dx = end.x - start.x;
    const dy = end.y - start.y;
    const length = Math.hypot(dx, dy);
    const angleDeg = Math.atan2(dy, dx) * (180 / Math.PI);

    connector.style.left = `${start.x}px`;
    connector.style.top = `${start.y}px`;
    connector.style.width = `${length}px`;
    connector.style.transform = `rotate(${angleDeg}deg)`;
    connector.classList.add("is-visible");
  };

  const showTeachingTarget = (key) => {
    if (
      !dom.observationTeachingOverlay ||
      !dom.observationTeachingTargets?.length ||
      !dom.eyesWrapper
    ) {
      return;
    }

    hideTeachingOverlay();

    const [primaryTarget, secondaryTarget] = dom.observationTeachingTargets;
    const leftPupil = dom.leftEye?.querySelector(".pupil");
    const rightPupil = dom.rightEye?.querySelector(".pupil");
    const leftPupilRect = getStageRelativeRect(leftPupil);
    const rightPupilRect = getStageRelativeRect(rightPupil);
    const leftEyeRect = getStageRelativeRect(dom.leftEye);
    const rightEyeRect = getStageRelativeRect(dom.rightEye);
    const leftReflexRect = getStageRelativeRect(
      dom.leftEye?.querySelector(".ret-reflex"),
    );
    const rightReflexRect = getStageRelativeRect(
      dom.rightEye?.querySelector(".ret-reflex"),
    );
    const leftCornealRect = getCornealDotRect(dom.leftEye);
    const rightCornealRect = getCornealDotRect(dom.rightEye);
    const isBottomCrescent =
      state.currentRefraction.includes("myopia") ||
      state.currentRefraction.includes("minus");
    const leftCrescentRect = getCrescentGuideRect(
      leftPupilRect,
      isBottomCrescent,
    );
    const rightCrescentRect = getCrescentGuideRect(
      rightPupilRect,
      isBottomCrescent,
    );
    const crescentClass = isBottomCrescent
      ? "is-crescent-bottom"
      : "is-crescent-top";

    dom.observationTeachingOverlay.classList.add("is-visible");

    if (key === "Match") {
      const connectorRect = setTeachingTargetBox(primaryTarget, leftEyeRect, {
        cue: key,
        expandX: 8,
        expandY: 8,
      });
      setTeachingTargetBox(secondaryTarget, rightEyeRect, {
        cue: key,
        expandX: 8,
        expandY: 8,
      });
      setTeachingGuideConnector(key, connectorRect);
      return;
    }

    if (key === "Bright") {
      const connectorRect = setTeachingTargetBox(
        primaryTarget,
        getInsetRect(leftReflexRect || leftPupilRect, 0.16),
        {
          cue: key,
          expandX: 6,
          expandY: 6,
        },
      );
      setTeachingTargetBox(
        secondaryTarget,
        getInsetRect(rightReflexRect || rightPupilRect, 0.16),
        {
          cue: key,
          expandX: 6,
          expandY: 6,
        },
      );
      setTeachingGuideConnector(key, connectorRect);
      return;
    }

    if (key === "Straight") {
      const connectorRect = setTeachingTargetBox(
        primaryTarget,
        leftCornealRect,
        { cue: key, forceCircle: true, expandX: 2, expandY: 2 },
      );
      setTeachingTargetBox(secondaryTarget, rightCornealRect, {
        cue: key,
        forceCircle: true,
        expandX: 2,
        expandY: 2,
      });
      setTeachingGuideConnector(key, connectorRect);
      return;
    }

    if (key === "Light") {
      const connectorRect = setTeachingTargetBox(primaryTarget, leftPupilRect, {
        cue: key,
        expandX: 11,
        expandY: 9,
      });
      setTeachingTargetBox(secondaryTarget, rightPupilRect, {
        cue: key,
        expandX: 11,
        expandY: 9,
      });
      setTeachingGuideConnector(key, connectorRect);
      return;
    }

    if (key === "Shape") {
      const connectorRect = setTeachingTargetBox(primaryTarget, leftPupilRect, {
        cue: key,
        expandX: 4,
        expandY: 4,
      });
      setTeachingTargetBox(secondaryTarget, rightPupilRect, {
        cue: key,
        expandX: 4,
        expandY: 4,
      });
      setTeachingGuideConnector(key, connectorRect);
      return;
    }

    if (key === "Crescent") {
      const connectorRect = setTeachingTargetBox(
        primaryTarget,
        leftCrescentRect,
        {
          cue: key,
          extraClass: crescentClass,
        },
      );
      setTeachingTargetBox(secondaryTarget, rightCrescentRect, {
        cue: key,
        extraClass: crescentClass,
      });
      setTeachingGuideConnector(key, connectorRect);
      return;
    }

    if (key === "Colour") {
      const connectorRect = setTeachingTargetBox(
        primaryTarget,
        getInsetRect(leftReflexRect || leftPupilRect, 0.2),
        {
          cue: key,
          expandX: 3,
          expandY: 3,
        },
      );
      setTeachingTargetBox(
        secondaryTarget,
        getInsetRect(rightReflexRect || rightPupilRect, 0.2),
        {
          cue: key,
          expandX: 3,
          expandY: 3,
        },
      );
      setTeachingGuideConnector(key, connectorRect);
      return;
    }

    if (key === "Cornea") {
      const connectorRect = setTeachingTargetBox(
        primaryTarget,
        leftCornealRect,
        { cue: key, forceCircle: true },
      );
      setTeachingTargetBox(secondaryTarget, rightCornealRect, {
        cue: key,
        forceCircle: true,
      });
      setTeachingGuideConnector(key, connectorRect);
      return;
    }

    if (key === "Compare") {
      const connectorRect = setTeachingTargetBox(primaryTarget, leftEyeRect, {
        cue: key,
        expandX: 8,
        expandY: 8,
      });
      setTeachingTargetBox(secondaryTarget, rightEyeRect, {
        cue: key,
        expandX: 8,
        expandY: 8,
      });
      setTeachingGuideConnector(key, connectorRect);
    }
  };

  const setObservationGuideCollapsed = (isCollapsed) => {
    dom.observationGuide.classList.toggle("is-collapsed", isCollapsed);
    dom.observationGuideToggle.setAttribute(
      "aria-expanded",
      isCollapsed ? "false" : "true",
    );
    dom.observationGuideToggle.setAttribute(
      "aria-label",
      isCollapsed ? "Open observation guide" : "Close observation guide",
    );
    dom.observationGuideToggle.title = isCollapsed
      ? "Open observation guide"
      : "Close observation guide";
  };

  const scheduleObservationGuideCollapse = ({
    delay = OBSERVATION_GUIDE_COLLAPSE_DELAY_MS,
  } = {}) => {
    if (
      isObservationGuideUserControlled ||
      teachingKey ||
      teachingReplayTimerIds.length
    ) {
      return;
    }

    clearObservationGuideCollapseTimer();

    collapseTimerId = window.setTimeout(() => {
      const activeElement = document.activeElement;
      const isGuideFocused =
        activeElement instanceof Element &&
        dom.observationGuide.contains(activeElement) &&
        activeElement !== dom.observationGuideToggle;
      const isGuideHovered = dom.observationGuide.matches(":hover");

      if (isGuideFocused || isGuideHovered) {
        scheduleObservationGuideCollapse({ delay });
        return;
      }

      hoveredKey = "";
      hideObservationGuideHint();
      setObservationGuideCollapsed(true);
      renderObservationGuide();
    }, delay);
  };

  const expandObservationGuide = ({ replayHint = false } = {}) => {
    clearObservationGuideCollapseTimer();
    setObservationGuideCollapsed(false);

    if (replayHint) {
      showObservationGuideHint();
    }

    if (!isObservationGuideUserControlled) {
      scheduleObservationGuideCollapse();
    }
  };

  const renderObservationGuide = () => {
    syncObservationGuideMode();
    const activeKey = teachingKey || hoveredKey || selectedKey;
    const activeItem = getGuideItemByKey(activeKey);

    dom.observationGuideItems.forEach((item) => {
      const isSelected = item.dataset.guideLabel === selectedKey;
      const isActive = item.dataset.guideLabel === activeKey;
      item.classList.toggle("is-selected", isSelected);
      item.classList.toggle("is-active", isActive);
      item.setAttribute("aria-pressed", isSelected ? "true" : "false");
    });

    if (!activeItem) {
      dom.observationGuideDetail.replaceChildren();
      dom.observationGuideDetail.classList.remove("is-visible");
      return;
    }

    const detail = activeItem.dataset.guideDetail || "";
    const detailText = document.createElement("em");
    detailText.textContent = detail;
    dom.observationGuideDetail.replaceChildren(detailText);
    dom.observationGuideDetail.classList.add("is-visible");
  };

  const startTeachingReplay = () => {
    clearTeachingReplay();
    clearObservationGuideCollapseTimer();
    hideObservationGuideHint();

    if (prefersReducedMotion()) {
      teachingKey = getActiveGuideKeys()[0] || "";
      renderObservationGuide();
      showTeachingTarget(teachingKey);
      queueTeachingReplayTimer(() => {
        teachingKey = "";
        hideTeachingOverlay();
        renderObservationGuide();
        setObservationGuideCollapsed(true);
      }, OBSERVATION_GUIDE_COLLAPSE_DELAY_MS);
      return;
    }

    let elapsedMs = TEACHING_REPLAY_OPEN_DELAY_MS;
    getActiveGuideKeys().forEach((key) => {
      queueTeachingReplayTimer(() => {
        teachingKey = key;
        renderObservationGuide();
        showTeachingTarget(key);
      }, elapsedMs);

      elapsedMs += TEACHING_REPLAY_CUE_DURATIONS[key] || 2400;
    });

    queueTeachingReplayTimer(() => {
      teachingKey = "";
      hideTeachingOverlay();
      renderObservationGuide();
    }, elapsedMs);

    queueTeachingReplayTimer(() => {
      hoveredKey = "";
      selectedKey = "";
      hideObservationGuideHint();
      setObservationGuideCollapsed(true);
      renderObservationGuide();
    }, elapsedMs + TEACHING_REPLAY_FINAL_HOLD_MS);
  };

  function init() {
    dom.observationGuide.addEventListener("mouseenter", () => {
      if (!dom.observationGuide.classList.contains("is-collapsed")) {
        clearObservationGuideCollapseTimer();
      }
    });

    dom.observationGuide.addEventListener("mouseleave", () => {
      hoveredKey = "";
      renderObservationGuide();
      if (!dom.observationGuide.classList.contains("is-collapsed")) {
        scheduleObservationGuideCollapse();
      }
    });

    dom.observationGuideToggle.addEventListener("click", () => {
      isObservationGuideUserControlled = true;
      const isCollapsed =
        dom.observationGuide.classList.contains("is-collapsed");

      if (isCollapsed) {
        isObservationGuideUserControlled = false;
        expandObservationGuide({ replayHint: true });
        startTeachingReplay();
        return;
      }

      clearObservationGuideCollapseTimer();
      hoveredKey = "";
      clearTeachingReplay();
      hideObservationGuideHint();
      setObservationGuideCollapsed(true);
      renderObservationGuide();
    });

    dom.observationGuideItems.forEach((item) => {
      item.addEventListener("mouseenter", () => {
        clearObservationGuideCollapseTimer();
        hoveredKey = item.dataset.guideLabel || "";
        renderObservationGuide();
      });

      item.addEventListener("mouseleave", () => {
        hoveredKey = "";
        renderObservationGuide();
        scheduleObservationGuideCollapse();
      });

      item.addEventListener("focus", () => {
        clearTeachingReplay();
        hideObservationGuideHint();
        expandObservationGuide();
        hoveredKey = item.dataset.guideLabel || "";
        renderObservationGuide();
      });

      item.addEventListener("blur", () => {
        hoveredKey = "";
        renderObservationGuide();
        scheduleObservationGuideCollapse();
      });

      item.addEventListener("click", () => {
        clearTeachingReplay();
        hideObservationGuideHint();
        clearObservationGuideCollapseTimer();
        const clickedKey = item.dataset.guideLabel || "";
        selectedKey = selectedKey === clickedKey ? "" : clickedKey;
        hoveredKey = clickedKey;
        renderObservationGuide();
        scheduleObservationGuideCollapse();
      });
    });

    setObservationGuideCollapsed(false);
    renderObservationGuide();
    showObservationGuideHint();
    scheduleObservationGuideCollapse();
  }

  return {
    init,
    syncForCurrentCase: () => {
      clearTeachingReplay();
      renderObservationGuide();
      scheduleObservationGuideCollapse();
    },
  };
}
