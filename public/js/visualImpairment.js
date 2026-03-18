function clamp(value, min = 0, max = 1) {
  return Math.min(max, Math.max(min, value));
}

function lerp(from, to, progress) {
  return from + (to - from) * progress;
}

function easeOutCubic(t) {
  return 1 - (1 - t) ** 3;
}

function easeInOutCubic(t) {
  return t < 0.5 ? 4 * t ** 3 : 1 - (-2 * t + 2) ** 3 / 2;
}

function mix(progress, start, end, ease = (t) => t) {
  if (end <= start) return progress >= end ? 1 : 0;
  return ease(clamp((progress - start) / (end - start)));
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

function setMotionState(
  element,
  {
    opacity = 0,
    x = 0,
    y = 0,
    scale = 1,
    leftPercent = null,
    topPercent = null,
  } = {},
) {
  if (!element) return;

  const visible = opacity > 0.001;
  element.style.setProperty("--opacity", formatNumber(clamp(opacity)));
  element.style.setProperty("--x", `${formatNumber(x)}px`);
  element.style.setProperty("--y", `${formatNumber(y)}px`);
  element.style.setProperty("--scale", formatNumber(scale));

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

  element.style.visibility = visible ? "visible" : "hidden";
}

function renderScene(elements, progress, prefersReducedMotion) {
  const p = prefersReducedMotion ? Math.round(progress * 16) / 16 : progress;
  const overviewShift = mix(p, 0.48, 0.66, easeInOutCubic);
  const scrollCueOut = mix(p, 0.008, 0.05, easeOutCubic);

  setMotionState(elements.scrollCue, {
    opacity: 1 - scrollCueOut,
  });

  const nodeConfigs = [
    {
      element: elements.nodeLight,
      start: 0.06,
      end: 0.18,
      initialLeft: 50,
      initialTop: 27,
      finalLeft: 31,
      finalTop: 24.5,
      finalScale: 0.73,
    },
    {
      element: elements.nodeRetina,
      start: 0.18,
      end: 0.3,
      initialLeft: 50,
      initialTop: 52,
      finalLeft: 31,
      finalTop: 50.5,
      finalScale: 0.73,
    },
    {
      element: elements.nodeBrain,
      start: 0.3,
      end: 0.42,
      initialLeft: 50,
      initialTop: 78,
      finalLeft: 31,
      finalTop: 84,
      finalScale: 0.73,
    },
  ];

  nodeConfigs.forEach((config) => {
    const appear = mix(p, config.start, config.end, easeOutCubic);
    const startScale = lerp(0.72, 1, appear);

    setMotionState(config.element, {
      opacity: appear,
      leftPercent: lerp(config.initialLeft, config.finalLeft, overviewShift),
      topPercent: lerp(config.initialTop, config.finalTop, overviewShift),
      y: lerp(42, 0, appear),
      scale: lerp(startScale, config.finalScale, overviewShift),
    });
  });

  const cardConfigs = [
    {
      element: elements.cardCataract,
      link: elements.linkCataract,
      start: 0.58,
      end: 0.65,
      cardLeft: 79.5,
      cardTop: 17.5,
      linkLeft: 57.5,
      linkTop: 20.1,
    },
    {
      element: elements.cardNeedGlasses,
      link: elements.linkNeedGlasses,
      start: 0.64,
      end: 0.71,
      cardLeft: 79.5,
      cardTop: 30.5,
      linkLeft: 57.8,
      linkTop: 31.3,
    },
    {
      element: elements.cardCornealScar,
      link: elements.linkCornealScar,
      start: 0.7,
      end: 0.77,
      cardLeft: 79.5,
      cardTop: 43.8,
      linkLeft: 57.5,
      linkTop: 42.8,
    },
    {
      element: elements.cardRetinoblastoma,
      link: elements.linkRetinoblastoma,
      start: 0.76,
      end: 0.83,
      cardLeft: 79.5,
      cardTop: 50.8,
      linkLeft: 57.5,
      linkTop: 51.8,
    },
    {
      element: elements.cardRop,
      link: elements.linkRop,
      start: 0.82,
      end: 0.89,
      cardLeft: 79.5,
      cardTop: 63.4,
      linkLeft: 57.8,
      linkTop: 63.4,
    },
    {
      element: elements.cardMalnourishment,
      link: elements.linkMalnourishment,
      start: 0.88,
      end: 0.95,
      cardLeft: 79.5,
      cardTop: 76,
      linkLeft: 57.5,
      linkTop: 75,
    },
    {
      element: elements.cardProblems,
      link: elements.linkProblems,
      start: 0.94,
      end: 1,
      cardLeft: 79.5,
      cardTop: 90.6,
      linkLeft: 57.8,
      linkTop: 90.6,
    },
  ];

  cardConfigs.forEach((config) => {
    const reveal = mix(p, config.start, config.end, easeOutCubic);
    setMotionState(config.element, {
      opacity: reveal,
      leftPercent: config.cardLeft,
      topPercent: config.cardTop,
      x: lerp(46, 0, reveal),
      y: lerp(12, 0, reveal),
      scale: lerp(0.92, 1, reveal),
    });
    setMotionState(config.link, {
      opacity: reveal,
      leftPercent: config.linkLeft,
      topPercent: config.linkTop,
      x: lerp(20, 0, reveal),
      scale: lerp(0.96, 1, reveal),
    });
  });
}

export function initializeVisualImpairment() {
  const page = document.getElementById("visualImpairmentPage");
  if (!page) return;

  if (typeof page._viCleanup === "function") {
    page._viCleanup();
  }

  const story = page.querySelector(".vi-story");
  if (!story) return;

  const elements = {
    scrollCue: page.querySelector('[data-vi="scrollCue"]'),
    nodeLight: page.querySelector('[data-vi="nodeLight"]'),
    nodeRetina: page.querySelector('[data-vi="nodeRetina"]'),
    nodeBrain: page.querySelector('[data-vi="nodeBrain"]'),
    cardCataract: page.querySelector('[data-vi="cardCataract"]'),
    cardNeedGlasses: page.querySelector('[data-vi="cardNeedGlasses"]'),
    cardCornealScar: page.querySelector('[data-vi="cardCornealScar"]'),
    cardRetinoblastoma: page.querySelector('[data-vi="cardRetinoblastoma"]'),
    cardRop: page.querySelector('[data-vi="cardRop"]'),
    cardMalnourishment: page.querySelector('[data-vi="cardMalnourishment"]'),
    cardProblems: page.querySelector('[data-vi="cardProblems"]'),
    linkCataract: page.querySelector('[data-vi="linkCataract"]'),
    linkNeedGlasses: page.querySelector('[data-vi="linkNeedGlasses"]'),
    linkCornealScar: page.querySelector('[data-vi="linkCornealScar"]'),
    linkRetinoblastoma: page.querySelector('[data-vi="linkRetinoblastoma"]'),
    linkRop: page.querySelector('[data-vi="linkRop"]'),
    linkMalnourishment: page.querySelector('[data-vi="linkMalnourishment"]'),
    linkProblems: page.querySelector('[data-vi="linkProblems"]'),
  };

  const controller = new AbortController();
  const { signal } = controller;
  const scrollRoot = getScrollRoot(page);
  const prefersReducedMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)",
  );

  let rafId = 0;
  let lastProgress = -1;
  let detachMotionPreference = () => {};
  let revealObserver = null;
  let videoObserver = null;

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
      renderScene(elements, progress, prefersReducedMotion.matches);
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

  page
    .querySelectorAll(".vi-node img, .vi-card img, .vi-link img")
    .forEach((img) => {
      if (img.complete) return;
      listen(img, "load", scheduleRender, { once: true });
    });

  const intersectionRoot = scrollRoot === window ? null : scrollRoot;
  const revealTargets = page.querySelectorAll("[data-vi-reveal]");
  const revealPanels = page.querySelectorAll(".vi-detail-panel");
  if ("IntersectionObserver" in window && revealPanels.length) {
    revealObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          entry.target
            .querySelectorAll("[data-vi-reveal]")
            .forEach((target) => target.classList.add("is-visible"));
          revealObserver?.unobserve(entry.target);
        });
      },
      {
        root: intersectionRoot,
        threshold: 0.12,
        rootMargin: "0px 0px -10% 0px",
      },
    );
    revealPanels.forEach((panel) => revealObserver.observe(panel));
  } else {
    revealTargets.forEach((target) => target.classList.add("is-visible"));
  }

  const videos = page.querySelectorAll("video");
  if ("IntersectionObserver" in window && videos.length) {
    videoObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) {
            entry.target.pause();
          }
        });
      },
      {
        root: intersectionRoot,
        threshold: 0.12,
      },
    );
    videos.forEach((video) => videoObserver.observe(video));
  }

  page._viCleanup = () => {
    controller.abort();
    detachMotionPreference();
    revealObserver?.disconnect();
    videoObserver?.disconnect();
    if (rafId) {
      window.cancelAnimationFrame(rafId);
      rafId = 0;
    }
    delete page._viCleanup;
  };

  renderScene(elements, 0, prefersReducedMotion.matches);
  scheduleRender();
  window.requestAnimationFrame(scheduleRender);
}
