const LOTTIE_SRC =
  "https://cdnjs.cloudflare.com/ajax/libs/bodymovin/5.12.2/lottie.min.js";

const ROUTE_CONFIG = {
  childhoodFundalPreparation: {
    pageId: "childhoodFundalPreparationPage",
    label: "Preparation",
    enableReplay: true,
    paths: [
      "/scrolly/coreexam/fundalreflex/prep/1/data.json",
      "/scrolly/coreexam/fundalreflex/prep/2/data.json",
      "/scrolly/coreexam/fundalreflex/prep/3/data.json",
      "/scrolly/coreexam/fundalreflex/prep/4/data.json",
    ],
    playMode: "segmentScroll",
    // User-provided segment plan (inclusive frame ranges).
    // file1: one full segment (0 -> END).
    segmentRanges: [
      [{ from: 37, to: 239 }],
      [{ from: 0, to: 120 }, { from: 121, to: 207 }, { from: 208 }],
      [
        { from: 0, to: 110 },
        { from: 111, to: 238 },
        { from: 239, to: 378 },
        { from: 379 },
      ],
      [
        { from: 0, to: 270 },
        { from: 271, to: 357 },
        { from: 358, to: 453 },
        { from: 454 },
      ],
    ],
    settleFrameOverrides: [
      [239],
      [120, 207, "last"],
      [110, 238, 378, "last"],
      [270, 357, 453, "last"],
    ],
  },
  childhoodFundalExamination: {
    pageId: "childhoodFundalExaminationPage",
    label: "Examination",
    enableReplay: true,
    paths: [
      "/scrolly/coreexam/fundalreflex/exam/1/data.json",
      "/scrolly/coreexam/fundalreflex/exam/2/data.json",
      "/scrolly/coreexam/fundalreflex/exam/3/data.json",
      "/scrolly/coreexam/fundalreflex/exam/4/data.json",
      "/scrolly/coreexam/fundalreflex/exam/5/data.json",
    ],
    playMode: "segmentScroll",
    segmentRanges: [
      [{ from: 16 }],
      [{ from: 0, to: 186 }, { from: 186 }],
      [
        { from: 0, to: 78 },
        { from: 79, to: 209 },
        { from: 210, to: 351 },
        { from: 352 },
      ],
      [{ from: 0, to: 114 }, { from: 115 }],
      [{ from: 0, to: 138 }, { from: 139, to: 265 }, { from: 266 }],
    ],
    settleFrameOverrides: [
      ["last"],
      [186, "last"],
      [78, 209, 351, "last"],
      [114, "last"],
      [138, 265, "last"],
    ],
  },
  childhoodFundalNewbornEyesOpen: {
    pageId: "childhoodFundalNewbornEyesOpenPage",
    label: "Newborn - Eyes Open",
    enableReplay: true,
    paths: [
      "/scrolly/coreexam/fundalreflex/eyesopen/1/data.json",
      "/scrolly/coreexam/fundalreflex/eyesopen/2/data.json",
      "/scrolly/coreexam/fundalreflex/eyesopen/3/data.json",
      "/scrolly/coreexam/fundalreflex/eyesopen/4/data.json",
    ],
    playMode: "segmentScroll",
    segmentRanges: [
      [{ from: 16 }],
      [{ from: 0, to: 146 }, { from: 147, to: 382 }, { from: 383 }],
      [{ from: 0, to: 119 }, { from: 120 }],
      [{ from: 0, to: 61 }, { from: 62, to: 106 }, { from: 107 }],
    ],
    settleFrameOverrides: [
      ["last"],
      [146, 382, "last"],
      [119, "last"],
      [61, 106, "last"],
    ],
  },
  childhoodFundalNewbornEyesClosed: {
    pageId: "childhoodFundalNewbornEyesClosedPage",
    label: "Newborn - Eyes Closed",
    enableReplay: true,
    paths: [
      "/scrolly/coreexam/fundalreflex/eyesclosed/1/data.json",
      "/scrolly/coreexam/fundalreflex/eyesclosed/2/data.json",
      "/scrolly/coreexam/fundalreflex/eyesclosed/3/data.json",
    ],
    playMode: "segmentScroll",
    segmentRanges: [
      [{ from: 16 }],
      [{ from: 0, to: 240 }, { from: 241 }],
      [{ from: 0, to: 61 }, { from: 62, to: 106 }, { from: 107 }],
    ],
    settleFrameOverrides: [["last"], [240, "last"], [61, 106, "last"]],
  },
  childhoodFundalUnclearFindings: {
    pageId: "childhoodFundalUnclearFindingsPage",
    label: "Unclear Findings",
    enableReplay: true,
    paths: [
      "/scrolly/coreexam/fundalreflex/unclear/0/data.json",
      "/scrolly/coreexam/fundalreflex/unclear/1/data.json",
      "/scrolly/coreexam/fundalreflex/unclear/2/data.json",
      "/scrolly/coreexam/fundalreflex/unclear/3/data.json",
    ],
    playMode: "segmentScroll",
    segmentRanges: [
      [{ from: 16 }],
      [{ from: 0, to: 172 }, { from: 172 }],
      [{ from: 0, to: 82 }, { from: 83, to: 135 }, { from: 136 }],
      [{ from: 0, to: 160 }, { from: 161, to: 564 }, { from: 565 }],
    ],
    settleFrameOverrides: [
      ["last"],
      [172, "last"],
      [82, 135, "last"],
      [160, 564, "last"],
    ],
  },
  childhoodFundalPossibleFinding: {
    pageId: "childhoodFundalPossibleFindingPage",
    label: "Possible Findings",
    enableReplay: true,
    paths: ["/scrolly/coreexam/fundalreflex/findings/data.json"],
    playMode: "segmentScroll",
    segmentRanges: [
      [
        { from: 0, to: 87 },
        { from: 87, to: 145 },
        { from: 146, to: 265 },
        { from: 265, to: 385 },
        { from: 386 },
      ],
    ],
    settleFrameOverrides: [[87, 145, 265, 385, "last"]],
  },
  childhoodFundalAfterExamination: {
    pageId: "childhoodFundalAfterExaminationPage",
    label: "After Examination",
    enableReplay: true,
    paths: [
      "/scrolly/coreexam/fundalreflex/afterexam/1/data.json",
      "/scrolly/coreexam/fundalreflex/afterexam/2/data.json",
    ],
    playMode: "segmentScroll",
    segmentRanges: [[{ from: 0, to: 89 }, { from: 90 }], [{ from: 0 }]],
    settleFrameOverrides: [[89, "last"], ["last"]],
  },
};

let activeSession = null;
const IS_IOS_WEBKIT = (() => {
  if (typeof navigator === "undefined") return false;
  const ua = navigator.userAgent || "";
  const iOSDevice = /iPad|iPhone|iPod/.test(ua);
  const iPadOSDesktopUA =
    navigator.platform === "MacIntel" &&
    Number(navigator.maxTouchPoints || 0) > 1;
  return iOSDevice || iPadOSDesktopUA;
})();

function cleanupActiveSession() {
  if (!activeSession) return;

  try {
    activeSession.observer?.disconnect();
  } catch {}

  try {
    activeSession.removeInputListeners?.();
  } catch {}

  activeSession.animations?.forEach((anim) => {
    try {
      anim.destroy();
    } catch {}
  });

  activeSession = null;
}

function buildAnimationSlots(listEl, label, count) {
  if (!listEl) return [];

  listEl.innerHTML = "";
  const stages = [];

  for (let i = 0; i < count; i += 1) {
    const item = document.createElement("div");
    item.className = "childhood-fundal-prep-item";

    const stage = document.createElement("div");
    stage.className = "childhood-fundal-prep-stage";
    stage.setAttribute("role", "img");
    stage.setAttribute("aria-label", `${label} animation ${i + 1}`);
    stage.dataset.fileIndex = String(i);

    const downArrow = document.createElement("div");
    downArrow.className = "childhood-fundal-scroll-down-arrow";
    downArrow.setAttribute("aria-hidden", "true");
    downArrow.innerHTML =
      '<div class="childhood-fundal-scroll-down-arrow__stack">' +
      '<span class="childhood-fundal-scroll-down-arrow__chev"></span>' +
      '<span class="childhood-fundal-scroll-down-arrow__chev"></span>' +
      '<span class="childhood-fundal-scroll-down-arrow__chev"></span>' +
      "</div>";

    item.appendChild(stage);
    item.appendChild(downArrow);
    listEl.appendChild(item);
    stages.push(stage);
  }

  return stages;
}

async function ensureLottie() {
  if (window.lottie) return true;

  if (!window.__lottieLoadPromise) {
    window.__lottieLoadPromise = new Promise((resolve, reject) => {
      const existing = document.querySelector(`script[src="${LOTTIE_SRC}"]`);
      if (existing) {
        existing.addEventListener("load", resolve, { once: true });
        existing.addEventListener("error", reject, { once: true });
        return;
      }

      const script = document.createElement("script");
      script.src = LOTTIE_SRC;
      script.onload = resolve;
      script.onerror = reject;
      document.head.appendChild(script);
    });
  }

  try {
    await window.__lottieLoadPromise;
  } catch (err) {
    console.error("[fundalScroll] failed to load lottie", err);
  }

  return !!window.lottie;
}

function createViewportController(stages, animations) {
  if (!("IntersectionObserver" in window)) {
    animations.forEach((anim) => anim.play());
    return null;
  }

  const stageToAnimation = new Map();
  stages.forEach((stage, idx) => {
    stageToAnimation.set(stage, animations[idx]);
  });

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        const anim = stageToAnimation.get(entry.target);
        if (!anim) return;
        if (entry.isIntersecting && entry.intersectionRatio >= 0.35) {
          anim.play();
        } else {
          anim.pause();
        }
      });
    },
    {
      threshold: [0, 0.35, 0.7, 1],
      root: null,
      rootMargin: "0px",
    },
  );

  stages.forEach((stage) => observer.observe(stage));
  return observer;
}

function getAnimationLastFrame(anim) {
  const op = Number(anim?.animationData?.op);
  if (Number.isFinite(op) && op > 0) return Math.max(0, Math.floor(op - 1));

  const total = Number(anim?.totalFrames);
  if (Number.isFinite(total) && total > 0)
    return Math.max(0, Math.floor(total - 1));

  return 0;
}

function normaliseSegment(rawSegment, lastFrame) {
  let from = 0;
  let to = lastFrame;

  if (Array.isArray(rawSegment)) {
    from = Number(rawSegment[0]);
    to = rawSegment[1] == null ? lastFrame : Number(rawSegment[1]);
  } else if (rawSegment && typeof rawSegment === "object") {
    from = Number(rawSegment.from);
    to = rawSegment.to == null ? lastFrame : Number(rawSegment.to);
  }

  if (!Number.isFinite(from)) from = 0;
  if (!Number.isFinite(to)) to = lastFrame;

  from = Math.max(0, Math.min(lastFrame, Math.floor(from)));
  to = Math.max(from, Math.min(lastFrame, Math.floor(to)));

  return { from, to };
}

function resolveSegmentsForFile(cfg, fileIndex, anim) {
  const lastFrame = getAnimationLastFrame(anim);
  const rawList = cfg.segmentRanges?.[fileIndex];

  if (!Array.isArray(rawList) || rawList.length === 0) {
    return [{ from: 0, to: lastFrame }];
  }

  return rawList.map((raw) => normaliseSegment(raw, lastFrame));
}

function getSegmentEndFrame(segment) {
  if (!segment) return 0;
  const safeFrom = Number.isFinite(Number(segment.from))
    ? Math.floor(Number(segment.from))
    : 0;
  const safeTo = Number.isFinite(Number(segment.to))
    ? Math.floor(Number(segment.to))
    : safeFrom;
  return Math.max(safeFrom, safeTo);
}

function resolvePreferredSettleFrame(cfg, fileIndex, segmentIndex, segment) {
  const fallback = getSegmentEndFrame(segment);
  const fileOverrides = cfg?.settleFrameOverrides?.[fileIndex];
  if (!Array.isArray(fileOverrides)) return fallback;

  const raw = fileOverrides[segmentIndex];
  if (raw == null || raw === "last") return fallback;

  const numeric = Number(raw);
  if (!Number.isFinite(numeric)) return fallback;

  const safeFrom = Number.isFinite(Number(segment?.from))
    ? Math.floor(Number(segment.from))
    : 0;
  const safeEnd = Number.isFinite(Number(segment?.to))
    ? Math.floor(Number(segment.to))
    : safeFrom;
  return Math.max(safeFrom, Math.min(safeEnd, Math.floor(numeric)));
}

function isStageFrameBlank(controller) {
  const svgEl =
    controller?.anim?.renderer?.svgElement ||
    controller?.stage?.querySelector?.("svg");
  if (!svgEl) return true;

  const svgRect = svgEl.getBoundingClientRect?.();
  if (!svgRect || svgRect.width <= 0.5 || svgRect.height <= 0.5) return true;

  const nodes = svgEl.querySelectorAll(
    "image,path,rect,circle,ellipse,polygon,polyline,line,use,text",
  );
  if (!nodes.length) return true;

  for (let i = 0; i < nodes.length; i += 1) {
    const node = nodes[i];
    const style = window.getComputedStyle(node);
    if (!style) continue;
    if (style.display === "none" || style.visibility === "hidden") continue;

    const opacity = Number.parseFloat(style.opacity || "1");
    if (Number.isFinite(opacity) && opacity <= 0.02) continue;

    try {
      const rect = node.getBoundingClientRect?.();
      if (!IS_IOS_WEBKIT) {
        if (!rect) continue;
        if (rect.width <= 0.5 || rect.height <= 0.5) continue;
        const intersectsViewport =
          rect.right > svgRect.left &&
          rect.left < svgRect.right &&
          rect.bottom > svgRect.top &&
          rect.top < svgRect.bottom;
        if (!intersectsViewport) continue;
        return false;
      }

      if (rect && rect.width > 0.5 && rect.height > 0.5) return false;
    } catch {}

    // iOS Safari can intermittently report 0x0 client rects for SVG nodes.
    // Fall back to SVG-local bounds/attributes before treating the frame as blank.
    try {
      if (typeof node.getBBox === "function") {
        const box = node.getBBox();
        if (box && box.width > 0.5 && box.height > 0.5) return false;
      }
    } catch {}

    const widthAttr = Number(node.getAttribute?.("width"));
    const heightAttr = Number(node.getAttribute?.("height"));
    if (
      Number.isFinite(widthAttr) &&
      Number.isFinite(heightAttr) &&
      widthAttr > 0.5 &&
      heightAttr > 0.5
    ) {
      return false;
    }
  }

  return true;
}

function forceSvgVisibleForController(controller) {
  const svgEl =
    controller?.anim?.renderer?.svgElement ||
    controller?.stage?.querySelector?.("svg");
  if (!svgEl) return;

  svgEl.style.display = "block";
  svgEl.style.visibility = "visible";
  svgEl.style.opacity = "1";
}

function clampFrameToAnimation(controller, frame) {
  const lastFrame = getAnimationLastFrame(controller?.anim);
  const numeric = Number(frame);
  if (!Number.isFinite(numeric)) return 0;
  return Math.max(0, Math.min(lastFrame, Math.floor(numeric)));
}

function resolveAnyVisibleFrame(controller, preferredFrame) {
  const lastFrame = getAnimationLastFrame(controller?.anim);
  const start = clampFrameToAnimation(controller, preferredFrame);

  for (let offset = 0; offset <= lastFrame; offset += 1) {
    const backward = start - offset;
    if (backward >= 0) {
      try {
        controller.anim.goToAndStop(backward, true);
        forceSvgVisibleForController(controller);
      } catch {}
      if (!isStageFrameBlank(controller)) {
        controller.lastVisibleFrame = backward;
        controller.lastVisibleFrameEver = backward;
        return backward;
      }
    }

    const forward = start + offset;
    if (offset === 0 || forward > lastFrame) continue;
    try {
      controller.anim.goToAndStop(forward, true);
      forceSvgVisibleForController(controller);
    } catch {}
    if (!isStageFrameBlank(controller)) {
      controller.lastVisibleFrame = forward;
      controller.lastVisibleFrameEver = forward;
      return forward;
    }
  }

  return start;
}

function resolveSettledFrame(controller, segment, preferredFrame) {
  const safeFrom = Number.isFinite(Number(segment?.from))
    ? Math.floor(Number(segment.from))
    : 0;
  const safeEnd = Number.isFinite(Number(segment?.to))
    ? Math.floor(Number(segment.to))
    : safeFrom;

  let candidate = Number.isFinite(Number(preferredFrame))
    ? Math.floor(Number(preferredFrame))
    : safeEnd;
  candidate = Math.max(safeFrom, Math.min(safeEnd, candidate));

  const maxLookback = Math.max(0, candidate - safeFrom);

  for (let offset = 0; offset <= maxLookback; offset += 1) {
    const frame = candidate - offset;
    try {
      controller.anim.goToAndStop(frame, true);
      forceSvgVisibleForController(controller);
    } catch {}
    if (!isStageFrameBlank(controller)) {
      controller.lastVisibleFrame = frame;
      controller.lastVisibleFrameEver = frame;
      return frame;
    }
  }

  const rememberedInSegment = Number(controller?.lastVisibleFrame);
  if (Number.isFinite(rememberedInSegment)) {
    return Math.max(
      safeFrom,
      Math.min(safeEnd, Math.floor(rememberedInSegment)),
    );
  }

  const rememberedAny = Number(controller?.lastVisibleFrameEver);
  if (Number.isFinite(rememberedAny)) {
    return clampFrameToAnimation(controller, rememberedAny);
  }

  return resolveAnyVisibleFrame(controller, candidate);
}

function playSegment(controller, segmentIndex) {
  const seg = controller.segments[segmentIndex];
  if (!seg) return false;

  controller.hideDownArrow?.();
  controller.playingSegmentIndex = segmentIndex;
  controller.targetEndFrame = seg.to;
  controller.isPlaying = true;
  controller.lastRenderedFrame = seg.from;

  try {
    controller.startCenterLock?.();
  } catch {}

  forceSvgVisibleForController(controller);
  controller.anim.goToAndStop(seg.from, true);
  controller.anim.playSegments([seg.from, seg.to], true);
  return true;
}

function playPreviousOrNextSegment(controller, dir) {
  if (!controller.ready || controller.segments.length === 0) return false;

  if (dir > 0) {
    const nextIndex = controller.segmentIndex + 1;
    if (nextIndex < controller.segments.length) {
      return playSegment(controller, nextIndex);
    }
    return false;
  }

  const prevIndex = controller.segmentIndex - 1;
  if (prevIndex >= 0) {
    return playSegment(controller, prevIndex);
  }

  return false;
}

function stopAtSegmentEnd(controller, cfg) {
  if (!controller.isPlaying || controller.isSnapping) return;
  controller.isSnapping = true;

  const finishedSegIndex = controller.playingSegmentIndex;
  const finishedSeg =
    controller.segments[controller.playingSegmentIndex] || null;
  const preferredFrame = finishedSeg
    ? resolvePreferredSettleFrame(
        cfg,
        controller.fileIndex,
        finishedSegIndex,
        finishedSeg,
      )
    : null;
  let holdFrame = 0;
  if (!finishedSeg && Number.isFinite(controller.targetEndFrame)) {
    holdFrame = Math.max(0, Math.floor(controller.targetEndFrame));
  }

  controller.isPlaying = false;
  controller.segmentIndex = controller.playingSegmentIndex;
  controller.targetEndFrame = null;
  try {
    controller.stopCenterLock?.();
  } catch {}
  try {
    controller.anim.pause();
  } catch {}

  requestAnimationFrame(() => {
    try {
      if (finishedSeg) {
        holdFrame = resolveSettledFrame(
          controller,
          finishedSeg,
          preferredFrame,
        );
        controller.resolvedFrameBySegment?.set(finishedSegIndex, holdFrame);
      }
      controller.anim.goToAndStop(holdFrame, true);
      forceSvgVisibleForController(controller);
      if (isStageFrameBlank(controller)) {
        holdFrame = resolveAnyVisibleFrame(controller, holdFrame);
        controller.anim.goToAndStop(holdFrame, true);
        forceSvgVisibleForController(controller);
      }
      if (!isStageFrameBlank(controller)) {
        controller.lastVisibleFrame = holdFrame;
        controller.lastVisibleFrameEver = holdFrame;
      }
    } finally {
      controller.isSnapping = false;
      try {
        controller.onSegmentSettled?.();
      } catch {}
      const pendingDir = controller.pendingDir;
      controller.pendingDir = 0;
      if (pendingDir !== 0) {
        playPreviousOrNextSegment(controller, pendingDir);
      }
    }
  });
}

function getNearestVisibleControllerIndex(controllers) {
  const vh = window.innerHeight || document.documentElement.clientHeight || 0;
  const viewportCenter = vh / 2;

  let bestIndex = -1;
  let bestDistance = Number.POSITIVE_INFINITY;

  controllers.forEach((controller, idx) => {
    if (!controller.ready) return;
    const rect = controller.stage.getBoundingClientRect();
    if (rect.bottom <= 0 || rect.top >= vh) return;

    const center = (rect.top + rect.bottom) / 2;
    const distance = Math.abs(center - viewportCenter);
    if (distance < bestDistance) {
      bestDistance = distance;
      bestIndex = idx;
    }
  });

  return bestIndex;
}

function initializeSegmentScrollMode(cfg, page, stages) {
  let activeFileIndex = 0;
  let hasAnchoredStart = false;

  const getTopbarHeight = () => {
    const topbar = page.querySelector(".eyes-topbar");
    const raw = topbar?.getBoundingClientRect?.().height;
    return Number.isFinite(raw) && raw > 0 ? raw : 56;
  };

  const getCenteredScrollTopForStage = (stage) => {
    const rect = stage.getBoundingClientRect();
    const absoluteTop = window.scrollY + rect.top;
    const stageCenterAbs = absoluteTop + rect.height / 2;
    const vh = window.innerHeight || document.documentElement.clientHeight || 0;
    const topbarHeight = getTopbarHeight();
    const effectiveViewportCenter =
      topbarHeight + Math.max(0, (vh - topbarHeight) / 2);
    return Math.max(0, stageCenterAbs - effectiveViewportCenter);
  };

  const centerStage = (stage) => {
    const targetTop = getCenteredScrollTopForStage(stage);
    const currentTop = window.scrollY || window.pageYOffset || 0;
    if (Math.abs(targetTop - currentTop) <= 1) return;
    window.scrollTo({ top: targetTop, behavior: "auto" });
  };

  const scrollToFirstFileStart = () => {
    const firstStage = stages[0];
    if (!firstStage) return;

    const topbarHeight = getTopbarHeight();
    const extraTopGap = 18;
    const rect = firstStage.getBoundingClientRect();
    const absoluteTop = window.scrollY + rect.top;
    const targetTop = Math.max(0, absoluteTop - topbarHeight - extraTopGap);

    window.scrollTo({
      top: targetTop,
      behavior: "auto",
    });
    activeFileIndex = 0;
  };

  const anchorToFirstFile = () => {
    if (hasAnchoredStart) return;
    hasAnchoredStart = true;
    requestAnimationFrame(() => requestAnimationFrame(scrollToFirstFileStart));
  };

  const controllers = stages.map((stage, idx) => {
    const anim = window.lottie.loadAnimation({
      container: stage,
      renderer: "svg",
      loop: false,
      autoplay: false,
      path: cfg.paths[idx],
      rendererSettings: {
        preserveAspectRatio: "xMidYMid meet",
        hideOnTransparent: false,
      },
    });

    const controller = {
      stage,
      anim,
      fileIndex: idx,
      arrowEl:
        stage.parentElement?.querySelector(
          ".childhood-fundal-scroll-down-arrow",
        ) || null,
      segments: [],
      ready: false,
      isPlaying: false,
      isSnapping: false,
      segmentIndex: -1, // last fully completed segment
      playingSegmentIndex: -1,
      targetEndFrame: null,
      pendingDir: 0,
      failed: false,
      lastRenderedFrame: null,
      lastVisibleFrame: null,
      lastVisibleFrameEver: null,
      resolvedFrameBySegment: new Map(),
      centerLockRafId: null,
      startCenterLock: null,
      stopCenterLock: null,
      onSegmentSettled: null,
      showDownArrow: null,
      hideDownArrow: null,
    };

    controller.showDownArrow = () => {
      if (!controller.arrowEl) return;
      controller.arrowEl.classList.add("is-visible");
    };

    controller.hideDownArrow = () => {
      if (!controller.arrowEl) return;
      controller.arrowEl.classList.remove("is-visible");
    };

    controller.hideDownArrow();

    controller.stopCenterLock = () => {
      if (!Number.isFinite(controller.centerLockRafId)) return;
      try {
        cancelAnimationFrame(controller.centerLockRafId);
      } catch {}
      controller.centerLockRafId = null;
    };

    controller.startCenterLock = () => {
      controller.stopCenterLock();
      centerStage(controller.stage);

      const tick = () => {
        if (!controller.isPlaying) {
          controller.centerLockRafId = null;
          return;
        }
        centerStage(controller.stage);
        controller.centerLockRafId = requestAnimationFrame(tick);
      };

      controller.centerLockRafId = requestAnimationFrame(tick);
    };

    const onReady = () => {
      if (controller.ready) return;
      controller.segments = resolveSegmentsForFile(cfg, idx, anim);
      controller.ready = true;

      const first = controller.segments[0];
      if (first) {
        anim.goToAndStop(first.from, true);
        forceSvgVisibleForController(controller);
        if (isStageFrameBlank(controller)) {
          const recovered = resolveAnyVisibleFrame(controller, first.from);
          anim.goToAndStop(recovered, true);
          forceSvgVisibleForController(controller);
        }
        if (!isStageFrameBlank(controller)) {
          const currentFrame = clampFrameToAnimation(
            controller,
            Math.floor(Number(anim.currentFrame)),
          );
          controller.lastVisibleFrame = currentFrame;
          controller.lastVisibleFrameEver = currentFrame;
        }
      }

      if (idx === 0) {
        anchorToFirstFile();
      }
    };

    anim.addEventListener("data_ready", onReady);
    anim.addEventListener("DOMLoaded", onReady);
    anim.addEventListener("data_failed", () => {
      controller.failed = true;
      console.error("[fundalScroll] animation data failed:", cfg.paths[idx]);
    });
    anim.addEventListener("enterFrame", () => {
      if (controller.isPlaying) {
        const activeSeg = controller.segments[controller.playingSegmentIndex];
        if (activeSeg) {
          const current = Math.floor(Number(anim.currentFrame));
          if (Number.isFinite(current)) {
            controller.lastRenderedFrame = Math.max(
              activeSeg.from,
              Math.min(activeSeg.to, current),
            );
            if (!isStageFrameBlank(controller)) {
              controller.lastVisibleFrame = controller.lastRenderedFrame;
              controller.lastVisibleFrameEver = controller.lastRenderedFrame;
            }
          }
        }
      }

      if (!controller.isPlaying || controller.targetEndFrame == null) return;
      if (Math.floor(Number(anim.currentFrame)) >= controller.targetEndFrame) {
        stopAtSegmentEnd(controller, cfg);
      }
    });
    anim.addEventListener("complete", () => {
      if (controller.isPlaying) {
        stopAtSegmentEnd(controller, cfg);
      }
    });

    return controller;
  });

  let replayBtn = null;
  const shouldSupportReplay = cfg.enableReplay === true;
  const hideAllDownArrows = () => {
    controllers.forEach((controller) => controller.hideDownArrow?.());
  };
  const showDownArrowForController = (target) => {
    hideAllDownArrows();
    target?.showDownArrow?.();
  };

  function isControllerComplete(controller) {
    return (
      !!controller &&
      controller.ready &&
      controller.segments.length > 0 &&
      controller.segmentIndex >= controller.segments.length - 1
    );
  }

  function areAllControllersComplete() {
    if (!controllers.length) return false;
    return controllers.every((controller) => isControllerComplete(controller));
  }

  let finalPinRafId = null;
  let finalPinPassesRemaining = 0;
  let deferredFinalPinRafId = null;

  function stopFinalPinLoop() {
    if (Number.isFinite(finalPinRafId)) {
      try {
        cancelAnimationFrame(finalPinRafId);
      } catch {}
      finalPinRafId = null;
    }
    if (Number.isFinite(deferredFinalPinRafId)) {
      try {
        cancelAnimationFrame(deferredFinalPinRafId);
      } catch {}
      deferredFinalPinRafId = null;
    }
    finalPinPassesRemaining = 0;
  }

  function pinControllerToSettledFrame(controller) {
    if (!controller?.ready || !controller.segments.length) return;

    const segIndex =
      controller.segmentIndex >= 0
        ? Math.min(controller.segmentIndex, controller.segments.length - 1)
        : controller.segments.length - 1;
    const seg = controller.segments[segIndex];
    if (!seg) return;
    const preferredFrame = resolvePreferredSettleFrame(
      cfg,
      controller.fileIndex,
      segIndex,
      seg,
    );

    const cached = controller.resolvedFrameBySegment?.get(segIndex);
    const holdFrame = Number.isFinite(cached)
      ? cached
      : resolveSettledFrame(controller, seg, preferredFrame);
    let safeHoldFrame = holdFrame;
    controller.resolvedFrameBySegment?.set(segIndex, safeHoldFrame);
    try {
      controller.anim.pause();
      controller.anim.goToAndStop(safeHoldFrame, true);
    } catch {}
    forceSvgVisibleForController(controller);
    if (isStageFrameBlank(controller)) {
      safeHoldFrame = resolveAnyVisibleFrame(controller, safeHoldFrame);
      controller.resolvedFrameBySegment?.set(segIndex, safeHoldFrame);
      try {
        controller.anim.goToAndStop(safeHoldFrame, true);
      } catch {}
      forceSvgVisibleForController(controller);
    }
    if (!isStageFrameBlank(controller)) {
      controller.lastVisibleFrame = safeHoldFrame;
      controller.lastVisibleFrameEver = safeHoldFrame;
    }
  }

  function pinAllAnimationsToSettledFrames() {
    controllers.forEach((controller) => {
      pinControllerToSettledFrame(controller);
    });
  }

  function startFinalPinLoop(passCount = 4) {
    if (!areAllControllersComplete()) return;

    // Keep original desktop behavior: continuously pin settled frames.
    if (!IS_IOS_WEBKIT) {
      if (Number.isFinite(finalPinRafId)) return;

      const tick = () => {
        if (!areAllControllersComplete()) {
          finalPinRafId = null;
          return;
        }

        pinAllAnimationsToSettledFrames();
        finalPinRafId = requestAnimationFrame(tick);
      };

      finalPinRafId = requestAnimationFrame(tick);
      return;
    }

    // iOS/mobile-safe behavior: bounded pin passes to avoid white-screen lockups.
    finalPinPassesRemaining = Math.max(
      finalPinPassesRemaining,
      Math.max(1, Math.floor(Number(passCount) || 0)),
    );

    if (Number.isFinite(deferredFinalPinRafId)) return;
    deferredFinalPinRafId = requestAnimationFrame(() => {
      deferredFinalPinRafId = null;
      if (!areAllControllersComplete()) return;
      if (Number.isFinite(finalPinRafId)) return;

      const tick = () => {
        if (!areAllControllersComplete()) {
          finalPinRafId = null;
          finalPinPassesRemaining = 0;
          return;
        }

        pinAllAnimationsToSettledFrames();
        finalPinPassesRemaining -= 1;
        if (finalPinPassesRemaining > 0) {
          finalPinRafId = requestAnimationFrame(tick);
          return;
        }
        finalPinRafId = null;
      };

      finalPinRafId = requestAnimationFrame(tick);
    });
  }

  function applyReplayButtonTitleOffset(buttonEl, titleEl) {
    if (!buttonEl) return;
    const normalizedTitle = String(titleEl?.textContent || "")
      .replace(/\s+/g, " ")
      .trim();
    const isLongTitle = normalizedTitle.length >= 18;
    buttonEl.classList.toggle(
      "childhood-fundal-replay-btn--compact-offset",
      isLongTitle,
    );
  }

  function ensureReplayButton() {
    if (!shouldSupportReplay) return null;
    if (replayBtn) {
      const topbar = page.querySelector(".eyes-topbar");
      const titleEl = topbar?.querySelector(".eyes-topbar__title");
      applyReplayButtonTitleOffset(replayBtn, titleEl);
      return replayBtn;
    }

    const topbar = page.querySelector(".eyes-topbar");
    if (!topbar) return null;

    let titleGroup = topbar.querySelector("[data-fundal-title-group]");
    if (!titleGroup) {
      titleGroup = document.createElement("div");
      titleGroup.dataset.fundalTitleGroup = "1";
      titleGroup.className = "childhood-fundal-title-group";

      const titleEl = topbar.querySelector(".eyes-topbar__title");
      const topbarIcons = topbar.querySelector(".eyes-topbar__icons");
      if (topbarIcons) {
        topbar.insertBefore(titleGroup, topbarIcons);
      } else {
        topbar.prepend(titleGroup);
      }
      if (titleEl && titleEl.parentElement !== titleGroup) {
        titleGroup.appendChild(titleEl);
      }
    }

    const titleEl = topbar.querySelector(".eyes-topbar__title");
    if (titleEl && titleEl.parentElement !== titleGroup) {
      titleGroup.appendChild(titleEl);
    }

    const existing = titleGroup.querySelector("[data-fundal-replay-btn]");
    if (existing) {
      replayBtn = existing;
      applyReplayButtonTitleOffset(replayBtn, titleEl);
      return replayBtn;
    }

    const topbarIcons = page.querySelector(".eyes-topbar__icons");
    if (!topbarIcons && !titleGroup) return null;

    const btn = document.createElement("button");
    btn.type = "button";
    btn.dataset.fundalReplayBtn = "1";
    btn.className = "childhood-fundal-replay-btn";
    btn.textContent = "Replay";
    btn.style.display = "none";

    if (titleGroup) {
      titleGroup.appendChild(btn);
    } else {
      topbarIcons.prepend(btn);
    }
    applyReplayButtonTitleOffset(btn, titleEl);
    replayBtn = btn;
    return replayBtn;
  }

  function showReplayButton() {
    const btn = ensureReplayButton();
    if (!btn) return;
    btn.style.display = "inline-flex";
    btn.style.alignItems = "center";
    btn.style.justifyContent = "center";
  }

  function hideReplayButton() {
    if (!replayBtn) return;
    replayBtn.style.display = "none";
  }

  function resetAllAnimationsToStart() {
    stopFinalPinLoop();
    hideAllDownArrows();
    controllers.forEach((controller) => {
      try {
        controller.stopCenterLock?.();
      } catch {}
      controller.isPlaying = false;
      controller.isSnapping = false;
      controller.segmentIndex = -1;
      controller.playingSegmentIndex = -1;
      controller.targetEndFrame = null;
      controller.pendingDir = 0;
      controller.lastRenderedFrame = null;
      controller.lastVisibleFrame = null;
      controller.lastVisibleFrameEver = null;
      controller.resolvedFrameBySegment?.clear?.();

      const firstSeg = controller.segments[0];
      if (controller.ready && firstSeg) {
        try {
          controller.anim.pause();
        } catch {}
        controller.anim.goToAndStop(firstSeg.from, true);
        forceSvgVisibleForController(controller);
        if (isStageFrameBlank(controller)) {
          const recovered = resolveAnyVisibleFrame(controller, firstSeg.from);
          controller.anim.goToAndStop(recovered, true);
          forceSvgVisibleForController(controller);
        }
        if (!isStageFrameBlank(controller)) {
          const currentFrame = clampFrameToAnimation(
            controller,
            Math.floor(Number(controller.anim.currentFrame)),
          );
          controller.lastVisibleFrame = currentFrame;
          controller.lastVisibleFrameEver = currentFrame;
        }
      }
    });

    hideReplayButton();
    requestAnimationFrame(() =>
      requestAnimationFrame(() => {
        scrollToFirstFileStart();
      }),
    );
  }

  if (shouldSupportReplay) {
    const btn = ensureReplayButton();
    if (btn && btn.dataset.wiredReplay !== "1") {
      btn.dataset.wiredReplay = "1";
      btn.addEventListener("click", (e) => {
        e.preventDefault();
        e.stopPropagation();
        resetAllAnimationsToStart();
      });
    }
  }

  controllers.forEach((controller) => {
    controller.onSegmentSettled = () => {
      if (!areAllControllersComplete()) {
        showDownArrowForController(controller);
        return;
      }
      hideAllDownArrows();
      startFinalPinLoop();
    };
  });

  let wheelAccum = 0;
  let touchStartY = null;
  let lastTriggerAt = 0;
  const WHEEL_THRESHOLD = 30;
  const TOUCH_THRESHOLD = 24;
  const TOUCH_MOVE_LOCK_THRESHOLD = 8;
  const TRIGGER_COOLDOWN_MS = 120;

  function getGateController() {
    const playingIndex = controllers.findIndex((c) => c.isPlaying);
    if (playingIndex >= 0) {
      activeFileIndex = playingIndex;
      return controllers[playingIndex];
    }

    const nearestIndex = getNearestVisibleControllerIndex(controllers);
    if (nearestIndex >= 0) {
      activeFileIndex = nearestIndex;
    }

    return controllers[activeFileIndex] || null;
  }

  function canConsumeDirection(dir) {
    if (areAllControllersComplete()) return false;

    const controller = getGateController();
    if (!controller) return false;
    if (controller.failed) return false;
    if (controller.isPlaying) return true;

    // Never consume upward input when not actively playing.
    if (dir < 0) return false;

    if (!controller.ready) return true;
    if (!controller.segments.length) return false;
    return controller.segmentIndex < controller.segments.length - 1;
  }

  function handleDirection(dir) {
    if (areAllControllersComplete()) {
      if (dir < 0) {
        showReplayButton();
      }
      startFinalPinLoop();
      return false;
    }

    const controller = getGateController();
    if (!controller) return false;
    if (controller.failed) return false;
    if (!controller.ready) return dir > 0;

    if (controller.isPlaying) {
      // Never reverse while a segment is running.
      controller.pendingDir = dir > 0 ? 1 : 0;
      return true;
    }

    // Upward input should not trigger reverse segment playback.
    if (dir < 0) {
      if (areAllControllersComplete()) {
        showReplayButton();
      }
      return false;
    }

    if (playPreviousOrNextSegment(controller, dir)) return true;
    return false;
  }

  function onWheel(e) {
    if (!Number.isFinite(e.deltaY) || e.deltaY === 0) return;
    hideAllDownArrows();

    const instantaneousDir = e.deltaY > 0 ? 1 : -1;
    if (canConsumeDirection(instantaneousDir)) {
      e.preventDefault();
      e.stopPropagation();
    }

    if (wheelAccum !== 0 && Math.sign(wheelAccum) !== Math.sign(e.deltaY)) {
      wheelAccum = 0;
    }
    wheelAccum += e.deltaY;
    if (Math.abs(wheelAccum) < WHEEL_THRESHOLD) return;

    const now = Date.now();
    if (now - lastTriggerAt < TRIGGER_COOLDOWN_MS) return;
    lastTriggerAt = now;

    const dir = wheelAccum > 0 ? 1 : -1;
    wheelAccum = 0;

    const consumed = handleDirection(dir);
    if (!consumed && dir < 0 && areAllControllersComplete()) {
      showReplayButton();
    }
    if (consumed) {
      e.preventDefault();
      e.stopPropagation();
    }
  }

  function onTouchStart(e) {
    if (!e.touches || e.touches.length !== 1) return;
    touchStartY = e.touches[0].clientY;
  }

  function onTouchMove(e) {
    if (touchStartY == null) return;
    const currentY = e.touches?.[0]?.clientY;
    if (!Number.isFinite(currentY)) return;

    const dy = touchStartY - currentY;
    if (Math.abs(dy) < TOUCH_MOVE_LOCK_THRESHOLD) return;
    hideAllDownArrows();

    const dir = dy > 0 ? 1 : -1;
    if (canConsumeDirection(dir)) {
      e.preventDefault();
      e.stopPropagation();
    }
  }

  function onTouchEnd(e) {
    if (touchStartY == null) return;
    const endY = e.changedTouches?.[0]?.clientY ?? touchStartY;
    const dy = touchStartY - endY;
    touchStartY = null;

    if (Math.abs(dy) < TOUCH_THRESHOLD) return;
    hideAllDownArrows();

    const now = Date.now();
    if (now - lastTriggerAt < TRIGGER_COOLDOWN_MS) return;
    lastTriggerAt = now;

    const dir = dy > 0 ? 1 : -1;
    const consumed = handleDirection(dir);
    if (!consumed && dir < 0 && areAllControllersComplete()) {
      showReplayButton();
    }
    if (consumed) {
      e.preventDefault();
      e.stopPropagation();
    }
  }

  function onViewportChangeAfterCompletion() {
    if (!areAllControllersComplete()) return;
    startFinalPinLoop(2);
  }

  page.addEventListener("wheel", onWheel, { passive: false });
  page.addEventListener("touchstart", onTouchStart, { passive: true });
  page.addEventListener("touchmove", onTouchMove, { passive: false });
  page.addEventListener("touchend", onTouchEnd, { passive: false });
  window.addEventListener("scroll", onViewportChangeAfterCompletion, {
    passive: true,
  });
  window.addEventListener("resize", onViewportChangeAfterCompletion, {
    passive: true,
  });
  window.addEventListener("pageshow", onViewportChangeAfterCompletion);
  window.addEventListener("orientationchange", onViewportChangeAfterCompletion);

  return {
    animations: controllers.map((c) => c.anim),
    observer: null,
    removeInputListeners: () => {
      stopFinalPinLoop();
      controllers.forEach((c) => {
        try {
          c.stopCenterLock?.();
        } catch {}
      });
      page.removeEventListener("wheel", onWheel);
      page.removeEventListener("touchstart", onTouchStart);
      page.removeEventListener("touchmove", onTouchMove);
      page.removeEventListener("touchend", onTouchEnd);
      window.removeEventListener("scroll", onViewportChangeAfterCompletion);
      window.removeEventListener("resize", onViewportChangeAfterCompletion);
      window.removeEventListener("pageshow", onViewportChangeAfterCompletion);
      window.removeEventListener(
        "orientationchange",
        onViewportChangeAfterCompletion,
      );
    },
  };
}

export async function initializeChildhoodFundalReflexScrollPage(routeName) {
  const cfg = ROUTE_CONFIG[routeName];
  if (!cfg) return;

  const page = document.getElementById(cfg.pageId);
  if (!page) return;

  cleanupActiveSession();

  const listEl = page.querySelector(".childhood-fundal-prep-list");
  const stages = buildAnimationSlots(listEl, cfg.label, cfg.paths.length);
  if (!stages.length) return;

  const isLottieReady = await ensureLottie();
  if (!isLottieReady) {
    console.error("[fundalScroll] lottie is not available");
    return;
  }

  if (cfg.playMode === "segmentScroll") {
    activeSession = initializeSegmentScrollMode(cfg, page, stages);
    return;
  }

  const animations = stages.map((stage, idx) =>
    window.lottie.loadAnimation({
      container: stage,
      renderer: "svg",
      loop: true,
      autoplay: false,
      path: cfg.paths[idx],
      rendererSettings: {
        preserveAspectRatio: "xMidYMid meet",
        hideOnTransparent: false,
      },
    }),
  );

  const observer = createViewportController(stages, animations);
  activeSession = { observer, animations };
}

if (!window.__fundalScrollCleanupWired) {
  window.__fundalScrollCleanupWired = true;
  window.addEventListener("page:loaded", (e) => {
    const routeName = e?.detail?.routeName || "";
    if (!ROUTE_CONFIG[routeName]) cleanupActiveSession();
  });
}
