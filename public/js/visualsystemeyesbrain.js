function clamp(value, min = 0, max = 1) {
  return Math.min(max, Math.max(min, value));
}

function lerp(from, to, progress) {
  return from + (to - from) * progress;
}

function mix(progress, start, end, ease = (t) => t) {
  if (end <= start) return progress >= end ? 1 : 0;
  return ease(clamp((progress - start) / (end - start)));
}

function easeOutCubic(t) {
  return 1 - (1 - t) ** 3;
}

function easeInOutCubic(t) {
  return t < 0.5 ? 4 * t ** 3 : 1 - (-2 * t + 2) ** 3 / 2;
}

function mapStoryProgress(rawProgress) {
  const raw = clamp(rawProgress);
  const earlyRawEnd = 0.4424;
  const middleRawEnd = 0.5878;
  const earlySceneEnd = 0.86;
  const middleSceneEnd = 0.932;

  if (raw <= earlyRawEnd) {
    return (raw / earlyRawEnd) * earlySceneEnd;
  }

  if (raw <= middleRawEnd) {
    return (
      earlySceneEnd +
      ((raw - earlyRawEnd) / (middleRawEnd - earlyRawEnd)) *
        (middleSceneEnd - earlySceneEnd)
    );
  }

  return (
    middleSceneEnd +
    ((raw - middleRawEnd) / (1 - middleRawEnd)) * (1 - middleSceneEnd)
  );
}

function stepped(progress, steps) {
  if (progress <= 0) return 0;
  if (progress >= 1) return 1;
  return Math.floor(progress * steps) / steps;
}

function getScrollRoot(node) {
  let current = node?.parentElement ?? null;

  while (current && current !== document.body) {
    const style = window.getComputedStyle(current);
    const overflowY = style.overflowY || style.overflow;
    if (/(auto|scroll|overlay)/.test(overflowY)) {
      return current;
    }
    current = current.parentElement;
  }

  return window;
}

function getRootMetrics(scrollRoot) {
  if (scrollRoot === window) {
    return {
      top: 0,
      height: window.innerHeight || document.documentElement.clientHeight || 1,
    };
  }

  const rect = scrollRoot.getBoundingClientRect();
  return {
    top: rect.top,
    height: scrollRoot.clientHeight || rect.height || 1,
  };
}

function formatNumber(value) {
  return Number.isFinite(value) ? value.toFixed(4) : "0";
}

function setLayerState(
  element,
  {
    opacity = 0,
    x = 0,
    y = 0,
    scale = 1,
    rotate = 0,
    leftPercent = null,
    topPercent = null,
    clipTop = null,
    clipBottom = null,
  } = {},
) {
  if (!element) return;

  const visible = opacity > 0.001;
  element.style.setProperty("--opacity", formatNumber(clamp(opacity)));
  element.style.setProperty("--x", `${formatNumber(x)}px`);
  element.style.setProperty("--y", `${formatNumber(y)}px`);
  element.style.setProperty("--scale", formatNumber(scale));
  element.style.setProperty("--rotate", `${formatNumber(rotate)}deg`);
  if (leftPercent == null) {
    element.style.removeProperty("--left");
  } else {
    element.style.setProperty("--left", `${formatNumber(leftPercent)}%`);
  }
  if (topPercent == null) {
    element.style.removeProperty("--top");
  } else {
    element.style.setProperty("--top", `${formatNumber(topPercent)}%`);
  }
  if (clipTop == null) {
    element.style.removeProperty("--clip-top");
  } else {
    element.style.setProperty(
      "--clip-top",
      `${formatNumber(clamp(clipTop, 0, 100))}%`,
    );
  }
  if (clipBottom == null) {
    element.style.removeProperty("--clip-bottom");
  } else {
    element.style.setProperty(
      "--clip-bottom",
      `${formatNumber(clamp(clipBottom, 0, 100))}%`,
    );
  }
  element.style.visibility = visible ? "visible" : "hidden";
}

function setLabelState(element, { opacity = 0, x = 0, y = 0 } = {}) {
  if (!element) return;

  const visible = opacity > 0.001;
  element.style.setProperty("--opacity", formatNumber(clamp(opacity)));
  element.style.setProperty("--x", `${formatNumber(x)}px`);
  element.style.setProperty("--y", `${formatNumber(y)}px`);
  element.style.visibility = visible ? "visible" : "hidden";
}

function setTextContent(element, text) {
  if (!element) return;
  if (element.textContent === text) return;
  element.textContent = text;
}

const INTRO_CAPTION_TEXT =
  "Eyes collect light and turn it into signals for the brain";
const WORLD_CAPTION_TEXT_FOCUS =
  "Cornea and lens focus light onto the back of the eye";
const WORLD_CAPTION_TEXT_RETINA = "At the back of the eye\nis the retina";
const FINAL_CAPTION_TEXT_SENSOR = "The retina works like a camera sensor";
const FINAL_CAPTION_TEXT_SIGNAL = "It changes light into electrical signals";
const FINAL_CAPTION_TEXT_OPTIC_NERVE =
  "These signals travel through the optic nerve to the brain";
const FINAL_CAPTION_TEXT_VISION = "The brain creates vision from these signals";

function renderScene(
  elements,
  progress,
  prefersReducedMotion,
  isMobileViewport = false,
) {
  const mappedProgress = mapStoryProgress(progress);
  const p = prefersReducedMotion
    ? Math.round(mappedProgress * 14) / 14
    : mappedProgress;
  const mobileIntroShift = isMobileViewport ? 0.02 : 0;

  const intro = mix(
    p,
    Math.max(0, 0.02 - mobileIntroShift),
    Math.max(0, 0.16 - mobileIntroShift),
    easeInOutCubic,
  );
  const envIn = mix(p, 0.4, 0.5, easeOutCubic);
  const worldLightIn = mix(p, 0.55, 0.66, easeOutCubic);
  const worldOut = mix(p, 0.7, 0.78, easeInOutCubic);
  const worldLightOut = mix(p, 0.7, 0.78, easeInOutCubic);
  const manIn = mix(p, 0.79, 0.85, easeOutCubic);
  const manOut = mix(p, 0.885, 0.92, easeInOutCubic);
  const faceIn = mix(p, 0.86, 0.895, easeOutCubic);
  const bgOut = mix(p, 0.905, 0.928, easeInOutCubic);
  const finalIn = mix(p, 0.932, 0.955, easeInOutCubic);
  const endPhase = mix(p, 0.958, 1);
  const tractRaw = mix(endPhase, 0.08, 0.48, easeInOutCubic);
  const tractOut = mix(endPhase, 0.55, 0.62, easeInOutCubic);
  const tract2Raw = mix(endPhase, 0.72, 0.97, easeInOutCubic);
  const finalTail = mix(endPhase, 0.985, 1, easeOutCubic);
  const tractProgress = prefersReducedMotion
    ? Math.round(tractRaw * 28) / 28
    : stepped(tractRaw, 28);
  const tract2Progress = clamp(tract2Raw);
  const facebrainIn = mix(tract2Progress, 0.45, 0.62, easeInOutCubic);

  const worldOpacity = clamp(1 - worldOut);
  const backgroundOpacity = clamp(envIn * (1 - bgOut));
  const lightOpacity = clamp(worldLightIn * (1 - worldLightOut));
  const manOpacity = clamp(manIn * (1 - manOut));
  const faceOpacity = clamp(faceIn);
  const finalOpacity = clamp(finalIn);
  const finalTailY = lerp(0, -140, finalTail);

  const corneaIn = mix(
    p,
    Math.max(0, 0.18 - mobileIntroShift),
    Math.max(0, 0.24 - mobileIntroShift),
    easeOutCubic,
  );
  const lensIn = mix(
    p,
    Math.max(0, 0.2 - mobileIntroShift),
    Math.max(0, 0.26 - mobileIntroShift),
    easeOutCubic,
  );
  const retinaIn = mix(
    p,
    Math.max(0, 0.23 - mobileIntroShift),
    Math.max(0, 0.29 - mobileIntroShift),
    easeOutCubic,
  );
  const opticNerveIn = mix(
    p,
    Math.max(0, 0.245 - mobileIntroShift),
    Math.max(0, 0.305 - mobileIntroShift),
    easeOutCubic,
  );
  const labelOut = clamp(1 - worldOut);
  const scrollCueOut = mix(progress, 0.001, 0.018, easeOutCubic);
  const introCaptionOut = mix(p, 0.405, 0.47, easeInOutCubic);
  const introCaptionOpacity = clamp(1 - introCaptionOut);
  const worldCaptionIn = mix(p, 0.56, 0.6, easeOutCubic);
  const worldCaptionOpacity = clamp(worldCaptionIn * (1 - worldOut));
  const finalCaptionOpacity = finalOpacity;

  setLayerState(elements.scrollCue, {
    opacity: 1 - scrollCueOut,
    y: 0,
  });

  setTextContent(elements.introCaptionText, INTRO_CAPTION_TEXT);
  setLayerState(elements.introCaption, {
    opacity: introCaptionOpacity,
    y: lerp(0, -12, introCaptionOut),
  });

  setLayerState(elements.background, {
    opacity: backgroundOpacity,
    y: lerp(-180, 0, envIn) + lerp(0, -170, bgOut),
  });

  const cloudAlpha = backgroundOpacity;
  setLayerState(elements.cloud1, {
    opacity: cloudAlpha,
    x: lerp(-96, 0, envIn) + lerp(0, -96, bgOut),
    y: lerp(-18, 0, envIn),
    scale: 0.98,
  });
  setLayerState(elements.cloud2, {
    opacity: cloudAlpha,
    x: lerp(-64, 0, envIn) + lerp(0, -64, bgOut),
    y: lerp(-10, 0, envIn),
    scale: 0.84,
  });
  setLayerState(elements.cloud3, {
    opacity: cloudAlpha,
    x: lerp(72, 0, envIn) + lerp(0, 72, bgOut),
    y: lerp(-8, 0, envIn),
    scale: 0.86,
  });
  setLayerState(elements.cloud4, {
    opacity: cloudAlpha,
    x: lerp(112, 0, envIn) + lerp(0, 112, bgOut),
    y: lerp(-16, 0, envIn),
    scale: 1.02,
  });
  setLayerState(elements.cloud5, {
    opacity: cloudAlpha,
    x: lerp(92, 0, envIn) + lerp(0, 92, bgOut),
    y: lerp(-10, 0, envIn),
    scale: 1.04,
  });

  setLayerState(elements.sun, {
    opacity: backgroundOpacity,
    y: lerp(-120, 0, envIn) + lerp(0, -120, bgOut),
    scale: lerp(0.88, 1, envIn),
  });

  setLayerState(elements.grass1, {
    opacity: backgroundOpacity,
    x: lerp(-120, 0, envIn) + lerp(0, -120, bgOut),
    y: lerp(14, 0, envIn),
  });
  setLayerState(elements.grass2, {
    opacity: backgroundOpacity,
    x: lerp(-78, 0, envIn) + lerp(0, -78, bgOut),
    y: lerp(10, 0, envIn),
  });
  setLayerState(elements.grass3, {
    opacity: backgroundOpacity,
    x: lerp(86, 0, envIn) + lerp(0, 86, bgOut),
    y: lerp(12, 0, envIn),
  });
  setLayerState(elements.grass4, {
    opacity: backgroundOpacity,
    x: lerp(118, 0, envIn) + lerp(0, 118, bgOut),
    y: lerp(8, 0, envIn),
  });

  setLayerState(elements.worldLight, {
    opacity: lightOpacity,
    y: lerp(-12, 0, worldLightIn),
    scale: 0.8,
    clipBottom: 100 - worldLightIn * 100,
  });

  setLayerState(elements.worldEye, {
    opacity: worldOpacity,
    x: 0,
    y: 0,
    scale: lerp(0.82, 0.98, intro),
    rotate: lerp(-90, 0, intro),
  });

  setTextContent(
    elements.worldCaptionText,
    p < 0.685 ? WORLD_CAPTION_TEXT_FOCUS : WORLD_CAPTION_TEXT_RETINA,
  );
  setLayerState(elements.worldCaption, {
    opacity: worldCaptionOpacity,
    y: lerp(12, 0, worldCaptionIn),
  });

  setLabelState(elements.corneaLabel, {
    opacity: corneaIn * labelOut,
    x: lerp(-10, 0, corneaIn),
    y: lerp(16, 0, corneaIn),
  });
  setLabelState(elements.lensLabel, {
    opacity: lensIn * labelOut,
    x: lerp(-8, 0, lensIn),
    y: lerp(14, 0, lensIn),
  });
  setLabelState(elements.retinaLabel, {
    opacity: retinaIn * labelOut,
    x: lerp(-8, 0, retinaIn),
    y: lerp(14, 0, retinaIn),
  });
  setLabelState(elements.opticNerveLabel, {
    opacity: opticNerveIn * labelOut,
    x: lerp(8, 0, opticNerveIn),
    y: lerp(14, 0, opticNerveIn),
  });

  setLayerState(elements.man, {
    opacity: manOpacity,
    y: lerp(180, 0, manIn) + lerp(0, -22, manOut),
    scale: lerp(0.92, 1, manIn),
  });

  setLayerState(elements.face, {
    opacity: faceOpacity,
    y: lerp(16, 0, faceIn) + finalTailY,
    leftPercent: lerp(50, 43.5, finalIn),
    topPercent: lerp(44, 11, finalIn),
    scale: lerp(0.86, 1, faceIn),
  });

  setLayerState(elements.finalLight, {
    opacity: finalOpacity,
    y: lerp(-18, 0, finalIn) + finalTailY,
    scale: 0.8,
    clipBottom: 100 - finalIn * 100,
  });

  setLayerState(elements.finalEye, {
    opacity: finalOpacity,
    y: lerp(18, 0, finalIn) + finalTailY,
    scale: lerp(0.92, 0.98, finalIn),
    rotate: 0,
  });

  setLayerState(elements.brain, {
    opacity: finalOpacity,
    y: lerp(260, -820, finalIn) + finalTailY,
    scale: lerp(0.92, 1, finalIn),
  });

  setLayerState(elements.facebrain, {
    opacity: finalOpacity * facebrainIn,
    y: lerp(18, 0, facebrainIn) + finalTailY,
    scale: lerp(0.92, 1, facebrainIn),
  });

  setLayerState(elements.tract, {
    opacity: finalOpacity * (1 - tractOut),
    y: finalTailY,
    clipBottom: 100 - tractProgress * 100,
  });

  let finalCaptionText = FINAL_CAPTION_TEXT_SENSOR;
  if (tract2Progress > 0.03) {
    finalCaptionText = FINAL_CAPTION_TEXT_VISION;
  } else if (tractProgress > 0.03 || tractOut > 0.01) {
    finalCaptionText = FINAL_CAPTION_TEXT_OPTIC_NERVE;
  } else if (p > 0.952) {
    finalCaptionText = FINAL_CAPTION_TEXT_SIGNAL;
  }
  setTextContent(elements.finalCaptionText, finalCaptionText);
  setLayerState(elements.finalCaption, {
    opacity: finalCaptionOpacity,
    y: lerp(10, 0, finalIn) + finalTailY,
  });

  setLayerState(elements.tract2, {
    opacity: finalOpacity * (tract2Progress > 0.001 ? 1 : 0),
    y: finalTailY,
    clipBottom: 100 - tract2Progress * 100,
  });
}

export function initializeVisualSystemEyesBrain() {
  const page =
    document.getElementById("visualsystemeyesbrainPage") ||
    document.getElementById("childhoodEyeBrainImagesPage");
  if (!page) return;

  if (typeof page._vsCleanup === "function") {
    page._vsCleanup();
  }

  const story = page.querySelector(".vs-story");
  if (!story) return;

  const elements = {
    scrollCue: page.querySelector('[data-vs="scrollCue"]'),
    introCaption: page.querySelector('[data-vs="introCaption"]'),
    introCaptionText: page.querySelector(
      '[data-vs="introCaption"] .vs-caption__body',
    ),
    worldCaption: page.querySelector('[data-vs="worldCaption"]'),
    worldCaptionText: page.querySelector('[data-vs="worldCaptionText"]'),
    finalCaption: page.querySelector('[data-vs="finalCaption"]'),
    finalCaptionText: page.querySelector('[data-vs="finalCaptionText"]'),
    background: page.querySelector('[data-vs="background"]'),
    cloud1: page.querySelector('[data-vs="cloud1"]'),
    cloud2: page.querySelector('[data-vs="cloud2"]'),
    cloud3: page.querySelector('[data-vs="cloud3"]'),
    cloud4: page.querySelector('[data-vs="cloud4"]'),
    cloud5: page.querySelector('[data-vs="cloud5"]'),
    sun: page.querySelector('[data-vs="sun"]'),
    grass1: page.querySelector('[data-vs="grass1"]'),
    grass2: page.querySelector('[data-vs="grass2"]'),
    grass3: page.querySelector('[data-vs="grass3"]'),
    grass4: page.querySelector('[data-vs="grass4"]'),
    worldLight: page.querySelector('[data-vs="worldLight"]'),
    worldEye: page.querySelector('[data-vs="worldEye"]'),
    corneaLabel: page.querySelector('[data-vs="corneaLabel"]'),
    lensLabel: page.querySelector('[data-vs="lensLabel"]'),
    retinaLabel: page.querySelector('[data-vs="retinaLabel"]'),
    opticNerveLabel: page.querySelector('[data-vs="opticNerveLabel"]'),
    man: page.querySelector('[data-vs="man"]'),
    face: page.querySelector('[data-vs="face"]'),
    finalLight: page.querySelector('[data-vs="finalLight"]'),
    finalEye: page.querySelector('[data-vs="finalEye"]'),
    brain: page.querySelector('[data-vs="brain"]'),
    facebrain: page.querySelector('[data-vs="facebrain"]'),
    tract: page.querySelector('[data-vs="tract"]'),
    tract2: page.querySelector('[data-vs="tract2"]'),
  };

  const controller = new AbortController();
  const { signal } = controller;
  const scrollRoot = getScrollRoot(page);
  const prefersReducedMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)",
  );
  const mobileViewport = window.matchMedia("(max-width: 767px)");

  let rafId = 0;
  let lastProgress = -1;
  let detachMotionPreference = () => {};

  function scheduleRender() {
    if (rafId) return;
    rafId = window.requestAnimationFrame(() => {
      rafId = 0;

      const rootMetrics = getRootMetrics(scrollRoot);
      const storyRect = story.getBoundingClientRect();
      const travel = Math.max(storyRect.height - rootMetrics.height, 1);
      const progress = clamp((rootMetrics.top - storyRect.top) / travel);

      if (Math.abs(progress - lastProgress) < 0.0005) return;
      lastProgress = progress;

      // Keep the scene scroll-driven instead of timeline-driven.
      renderScene(
        elements,
        progress,
        prefersReducedMotion.matches,
        mobileViewport.matches,
      );
    });
  }

  const listen = (target, type, handler, options = {}) => {
    if (!target?.addEventListener) return;
    target.addEventListener(type, handler, { ...options, signal });
  };

  if (scrollRoot === window) {
    listen(window, "scroll", scheduleRender, { passive: true });
  } else {
    listen(scrollRoot, "scroll", scheduleRender, { passive: true });
  }

  listen(window, "resize", scheduleRender, { passive: true });
  listen(window, "orientationchange", scheduleRender, { passive: true });

  if (typeof prefersReducedMotion.addEventListener === "function") {
    prefersReducedMotion.addEventListener("change", scheduleRender, { signal });
  } else if (typeof prefersReducedMotion.addListener === "function") {
    prefersReducedMotion.addListener(scheduleRender);
    detachMotionPreference = () =>
      prefersReducedMotion.removeListener(scheduleRender);
  }

  page.querySelectorAll("img").forEach((img) => {
    if (img.complete) return;
    listen(img, "load", scheduleRender, { once: true });
  });

  page._vsCleanup = () => {
    controller.abort();
    detachMotionPreference();
    if (rafId) {
      window.cancelAnimationFrame(rafId);
      rafId = 0;
    }
    delete page._vsCleanup;
  };

  renderScene(
    elements,
    0,
    prefersReducedMotion.matches,
    mobileViewport.matches,
  );
  scheduleRender();
  window.requestAnimationFrame(scheduleRender);
}
