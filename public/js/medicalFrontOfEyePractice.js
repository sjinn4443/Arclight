import { FRONT_OF_EYE_EXAMINATION_SCROLL_CONFIG as config } from "./frontOfEyeExaminationScroll.js";

let disposePrevious = null;

async function loadLottie() {
  if (window.lottie) return window.lottie;
  if (!window.__lottieLoadPromise) {
    window.__lottieLoadPromise = new Promise((resolve, reject) => {
      const script = document.createElement("script");
      script.src = "/vendor/lottie.min.js";
      script.onload = resolve;
      script.onerror = reject;
      document.head.append(script);
    });
  }
  await window.__lottieLoadPromise;
  return window.lottie;
}

// Reuse the examination's visual stages and translated guidance only.
// This practice component never creates narration/audio players.
export function initializeMedicalFrontOfEyePractice() {
  const host = document.querySelector("[data-medical-front-of-eye]");
  if (!host || host.dataset.inited === "1") return;
  disposePrevious?.();
  host.dataset.inited = "1";
  const stages = [];
  let disposed = false;
  const language = () => window.I18N?.getLanguage?.() || "en";
  const label = (key, fallback) =>
    window.I18N?.t?.(`pecWorkshop.${key}`, fallback) || fallback;
  const updateText = () => {
    stages.forEach(({ index, copy, animation }) => {
      const texts =
        config.getSegmentStartTexts(index, language()) ||
        config.segmentStartTexts[index];
      copy.replaceChildren(
        ...texts.map((text) => {
          const p = document.createElement("p");
          p.textContent = text;
          return p;
        }),
      );
      highlight(index, copy, animation?.currentFrame || 0);
    });
    stages.forEach(syncPlayback);
  };
  function highlight(index, copy, frame) {
    const starts = config.segmentTextTriggerFramesByFile[index];
    let current = 0;
    starts.forEach((start, i) => {
      if (frame >= start) current = i;
    });
    [...copy.children].forEach((p, i) =>
      p.classList.toggle("is-current", i === current),
    );
  }
  config.paths.slice(0, 5).forEach((path, index) => {
    const row = document.createElement("section");
    row.className = "medical-front-of-eye-stage";
    row.dataset.stageIndex = String(index);
    const visual = document.createElement("div");
    visual.className = "medical-front-of-eye-visual";
    const canvas = document.createElement("div");
    canvas.className = "medical-front-of-eye-animation";
    canvas.dataset.stageIndex = String(index);
    canvas.setAttribute("role", "img");
    canvas.setAttribute("aria-label", "Front of eye examination animation");
    const toggle = document.createElement("button");
    toggle.type = "button";
    toggle.className = "medical-front-of-eye-toggle";
    toggle.dataset.i18nSkip = "";
    const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    svg.setAttribute("viewBox", "0 0 24 24");
    svg.setAttribute("aria-hidden", "true");
    svg.setAttribute("focusable", "false");
    const pauseIcon = document.createElementNS(svg.namespaceURI, "g");
    pauseIcon.classList.add("medical-animation-pause-icon");
    [6, 14].forEach((x) => {
      const bar = document.createElementNS(svg.namespaceURI, "rect");
      bar.setAttribute("x", String(x));
      bar.setAttribute("y", "5");
      bar.setAttribute("width", "4");
      bar.setAttribute("height", "14");
      bar.setAttribute("rx", "1");
      pauseIcon.append(bar);
    });
    const playIcon = document.createElementNS(svg.namespaceURI, "path");
    playIcon.classList.add("medical-animation-play-icon");
    playIcon.setAttribute("d", "M8 5L19 12L8 19Z");
    svg.append(pauseIcon, playIcon);
    toggle.append(svg);
    toggle.setAttribute("aria-pressed", "false");
    const copy = document.createElement("div");
    copy.className = "medical-front-of-eye-copy";
    copy.dataset.i18nSkip = "";
    visual.append(canvas, toggle);
    row.append(visual, copy);
    host.append(row);
    const stage = {
      index,
      path,
      row,
      canvas,
      copy,
      toggle,
      animation: null,
      loading: false,
      holding: false,
      holdRemaining: 2000,
      holdTimer: null,
      holdStarted: 0,
      visible: false,
      paused:
        window.matchMedia?.("(prefers-reduced-motion: reduce)").matches ||
        false,
    };
    stages.push(stage);
    toggle.addEventListener("click", () => {
      stage.paused = !stage.paused;
      syncPlayback(stage);
    });
  });
  function syncPlayback(stage) {
    const inactive = stage.paused || !stage.visible || document.hidden;
    if (inactive) {
      stage.animation?.pause();
      if (stage.holdTimer !== null) {
        clearTimeout(stage.holdTimer);
        stage.holdTimer = null;
        stage.holdRemaining = Math.max(
          0,
          stage.holdRemaining - (Date.now() - stage.holdStarted),
        );
      }
    } else if (stage.holding) {
      if (stage.holdTimer === null) {
        stage.holdStarted = Date.now();
        stage.holdTimer = setTimeout(() => {
          stage.holdTimer = null;
          stage.holding = false;
          stage.holdRemaining = 2000;
          syncPlayback(stage);
          if (!stage.paused && stage.visible && !document.hidden)
            stage.animation?.goToAndPlay(0, true);
        }, stage.holdRemaining);
      }
    } else stage.animation?.play();
    stage.canvas.dataset.playback = inactive
      ? "paused"
      : stage.holding
        ? "holding"
        : "playing";

    stage.toggle.setAttribute(
      "aria-label",
      label(
        stage.paused ? "animation_play" : "animation_pause",
        stage.paused ? "Play animation" : "Pause animation",
      ),
    );
    stage.toggle.setAttribute("aria-pressed", String(stage.paused));
  }
  async function mount(stage) {
    if (stage.animation || stage.loading || disposed) return;
    stage.loading = true;
    try {
      const lottie = await loadLottie();
      if (disposed || !host.isConnected) return;
      stage.animation = lottie.loadAnimation({
        container: stage.canvas,
        renderer: "svg",
        loop: false,
        autoplay: false,
        path: stage.path,
        rendererSettings: { preserveAspectRatio: "xMidYMid meet" },
      });
      stage.animation.addEventListener("DOMLoaded", () => {
        stage.canvas.dataset.ready = "1";
        syncPlayback(stage);
      });
      stage.animation.addEventListener("complete", () => {
        stage.holding = true;
        stage.holdRemaining = 2000;
        syncPlayback(stage);
      });
      stage.animation.addEventListener("enterFrame", () =>
        highlight(stage.index, stage.copy, stage.animation.currentFrame),
      );
      stage.animation.addEventListener("data_failed", () => {
        stage.canvas.textContent = label(
          "animation_error",
          "Animation could not load. Please reopen this lesson to try again.",
        );
      });
    } catch (error) {
      stage.canvas.textContent = label(
        "animation_error",
        "Animation could not load. Please reopen this lesson to try again.",
      );
      console.error("[medicalFrontOfEyePractice]", error);
    }
  }
  // Load a still frame near the viewport; playback starts only at its centre.
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting)
          void mount(stages[Number(entry.target.dataset.stageIndex)]);
      });
    },
    { rootMargin: "120px 0px", threshold: 0 },
  );
  let centerObserver = null;
  const observeCenter = () => {
    centerObserver?.disconnect();
    stages.forEach((stage) => {
      stage.visible = false;
      syncPlayback(stage);
    });
    const inset = Math.max(0, window.innerHeight / 2 - 1);
    centerObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const stage = stages[Number(entry.target.dataset.stageIndex)];
          stage.visible = entry.isIntersecting;
          if (stage.visible) void mount(stage);
          syncPlayback(stage);
        });
      },
      { rootMargin: `-${inset}px 0px -${inset}px 0px`, threshold: 0 },
    );
    stages.forEach((stage) => centerObserver.observe(stage.canvas));
  };
  stages.forEach((stage) => observer.observe(stage.canvas));
  observeCenter();
  window.addEventListener("resize", observeCenter);
  updateText();
  void config.loadText().then(() => {
    if (!disposed) updateText();
  });
  window.addEventListener("i18n:languageChanged", updateText);
  const onVisibility = () => stages.forEach(syncPlayback);
  document.addEventListener("visibilitychange", onVisibility);
  const onRoute = () => {
    if (!host.isConnected) disposePrevious?.();
  };
  window.addEventListener("page:loaded", onRoute);
  disposePrevious = () => {
    disposed = true;
    observer.disconnect();
    centerObserver?.disconnect();
    window.removeEventListener("resize", observeCenter);
    stages.forEach((stage) => {
      clearTimeout(stage.holdTimer);
      stage.animation?.destroy();
    });
    window.removeEventListener("i18n:languageChanged", updateText);
    document.removeEventListener("visibilitychange", onVisibility);
    window.removeEventListener("page:loaded", onRoute);
    disposePrevious = null;
  };
}
