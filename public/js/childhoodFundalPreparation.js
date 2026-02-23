const LOTTIE_SRC =
  "https://cdnjs.cloudflare.com/ajax/libs/bodymovin/5.12.2/lottie.min.js";

const ROUTE_CONFIG = {
  childhoodFundalPreparation: {
    pageId: "childhoodFundalPreparationPage",
    label: "Preparation",
    paths: [
      "/scrolly/coreexam/fundalreflex/prep/1/data.json",
      "/scrolly/coreexam/fundalreflex/prep/2/data.json",
      "/scrolly/coreexam/fundalreflex/prep/3/data.json",
      "/scrolly/coreexam/fundalreflex/prep/4/data.json",
    ],
  },
  childhoodFundalExamination: {
    pageId: "childhoodFundalExaminationPage",
    label: "Examination",
    paths: [
      "/scrolly/coreexam/fundalreflex/exam/1/data.json",
      "/scrolly/coreexam/fundalreflex/exam/2/data.json",
      "/scrolly/coreexam/fundalreflex/exam/3/data.json",
      "/scrolly/coreexam/fundalreflex/exam/4/data.json",
      "/scrolly/coreexam/fundalreflex/exam/5/data.json",
    ],
  },
  childhoodFundalNewbornEyesOpen: {
    pageId: "childhoodFundalNewbornEyesOpenPage",
    label: "Newborn - Eyes Open",
    paths: [
      "/scrolly/coreexam/fundalreflex/eyesopen/1/data.json",
      "/scrolly/coreexam/fundalreflex/eyesopen/2/data.json",
      "/scrolly/coreexam/fundalreflex/eyesopen/3/data.json",
      "/scrolly/coreexam/fundalreflex/eyesopen/4/data.json",
    ],
  },
  childhoodFundalNewbornEyesClosed: {
    pageId: "childhoodFundalNewbornEyesClosedPage",
    label: "Newborn - Eyes Closed",
    paths: [
      "/scrolly/coreexam/fundalreflex/eyesclosed/1/data.json",
      "/scrolly/coreexam/fundalreflex/eyesclosed/2/data.json",
      "/scrolly/coreexam/fundalreflex/eyesclosed/3/data.json",
    ],
  },
  childhoodFundalUnclearFindings: {
    pageId: "childhoodFundalUnclearFindingsPage",
    label: "Unclear Findings",
    paths: [
      "/scrolly/coreexam/fundalreflex/unclear/0/data.json",
      "/scrolly/coreexam/fundalreflex/unclear/1/data.json",
      "/scrolly/coreexam/fundalreflex/unclear/2/data.json",
      "/scrolly/coreexam/fundalreflex/unclear/3/data.json",
    ],
  },
  childhoodFundalPossibleFinding: {
    pageId: "childhoodFundalPossibleFindingPage",
    label: "Possible Finding",
    paths: ["/scrolly/coreexam/fundalreflex/findings/data.json"],
  },
  childhoodFundalAfterExamination: {
    pageId: "childhoodFundalAfterExaminationPage",
    label: "After Examination",
    paths: [
      "/scrolly/coreexam/fundalreflex/afterexam/1/data.json",
      "/scrolly/coreexam/fundalreflex/afterexam/2/data.json",
    ],
  },
};

let activeSession = null;

function cleanupActiveSession() {
  if (!activeSession) return;
  try {
    activeSession.observer?.disconnect();
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

    item.appendChild(stage);
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

  const animations = stages.map((stage, idx) =>
    window.lottie.loadAnimation({
      container: stage,
      renderer: "svg",
      loop: true,
      autoplay: false,
      path: cfg.paths[idx],
      rendererSettings: {
        preserveAspectRatio: "xMidYMid meet",
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
