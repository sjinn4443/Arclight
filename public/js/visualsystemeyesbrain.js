// public/js/visualsystemeyesbrain.js
// 라우터가 페이지를 DOM에 붙인 다음 initializeVisualSystemEyesBrain()를 호출해줘야 함

export async function initializeVisualSystemEyesBrain() {
  const page = document.getElementById("visualsystemeyesbrainPage");
  if (!page) return;

  // ✅ 중복 초기화 방지 (라우터가 여러 번 호출할 수 있음)
  if (page.dataset.vsWired === "1") return;
  page.dataset.vsWired = "1";

  const lottieEl = page.querySelector("#vs_lottie");
  const statusEl = page.querySelector("#vs_status");
  const stageEl = page.querySelector(".visualsystem-stage") || page;

  const SEGMENTS = [
    { from: 0, to: 57, step: 0 },
    { from: 58, to: 268, step: 1 },
    { from: 269, to: 320, step: 2 },
    { from: 321, to: 400, step: 3 },
    { from: 401, to: 598, step: 4 },
  ];

  let targetEndFrame = null;

  let anim = null;
  let segIndex = 0;
  let isPlaying = false;

  let lastTriggerTs = 0;
  const TRIGGER_COOLDOWN_MS = 250;

  function setStatus(text) {
    if (statusEl) statusEl.textContent = text;
  }

  function setCopyStep(step) {
    page.querySelectorAll(".vs-line").forEach((p) => {
      const pStep = Number(p.getAttribute("data-step"));
      p.classList.toggle("is-active", pStep === step);
    });
  }

  function playSegmentByIndex(i) {
    if (!anim) return;
    const idx = Math.max(0, Math.min(SEGMENTS.length - 1, i));
    const seg = SEGMENTS[idx];

    isPlaying = true;
    segIndex = idx;
    targetEndFrame = seg.to;

    setCopyStep(seg.step);
    setStatus(`Playing ${seg.from}–${seg.to}`);

    anim.goToAndStop(seg.from, true);
    anim.playSegments([seg.from, seg.to], true);
  }

  function stopAtEndOfCurrentSegment() {
    if (!anim) return;
    const seg = SEGMENTS[segIndex];
    anim.goToAndStop(seg.to, true);
    isPlaying = false;
    setStatus(`Paused @ ${seg.to}`);
  }

  function next() {
    const now = Date.now();
    if (isPlaying) return;
    if (now - lastTriggerTs < TRIGGER_COOLDOWN_MS) return;
    lastTriggerTs = now;

    if (segIndex >= SEGMENTS.length - 1) {
      setStatus(`End · Paused @ ${SEGMENTS[segIndex].to}`);
      return;
    }
    playSegmentByIndex(segIndex + 1);
  }

  function prev() {
    const now = Date.now();
    if (isPlaying) return;
    if (now - lastTriggerTs < TRIGGER_COOLDOWN_MS) return;
    lastTriggerTs = now;

    if (segIndex <= 0) {
      playSegmentByIndex(0);
      return;
    }
    playSegmentByIndex(segIndex - 1);
  }

  function onWheel(e) {
    e.preventDefault();
    if (Math.abs(e.deltaY) < 5) return;
    if (e.deltaY > 0) next();
    else if (e.deltaY < 0) prev();
  }

  function onKeyDown(e) {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      next();
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      prev();
    }
  }

  // 터치 스와이프(모바일)
  let touchStartY = null;
  function onTouchStart(e) {
    if (!e.touches || e.touches.length !== 1) return;
    touchStartY = e.touches[0].clientY;
  }
  function onTouchEnd(e) {
    if (touchStartY == null) return;
    const endY = e.changedTouches?.[0]?.clientY ?? touchStartY;
    const dy = touchStartY - endY;
    touchStartY = null;
    if (Math.abs(dy) < 20) return;
    if (dy > 0) next();
    else prev();
  }

  // ✅ lottie-web가 전역으로 로드돼 있어야 함
  async function ensureLottie() {
    if (window.lottie) return true;

    await new Promise((resolve, reject) => {
      const s = document.createElement("script");

      s.src =
        "https://cdnjs.cloudflare.com/ajax/libs/bodymovin/5.12.2/lottie.min.js";

      s.onload = resolve;
      s.onerror = reject;
      document.head.appendChild(s);
    });

    return !!window.lottie;
  }

  const ok = await ensureLottie();
  if (!ok) {
    setStatus("Error: lottie-web not loaded");
    console.error(
      "[visualsystemeyesbrain] lottie-web not loaded (failed to load script)",
    );
    return;
  }

  if (!lottieEl) {
    setStatus("Error: #vs_lottie not found");
    console.error("[visualsystemeyesbrain] #vs_lottie not found");
    return;
  }

  setStatus("Loading…");

  anim = window.lottie.loadAnimation({
    container: lottieEl,
    renderer: "svg",
    loop: false,
    autoplay: false,
    path: "/scrolls/workshop/childhood/visualsystemeyesbrain/VisualSystemEyesBrain.json",
  });

  anim.addEventListener("DOMLoaded", () => {
    console.warn("[visualsystemeyesbrain] DOMLoaded");
    segIndex = 0;
    setCopyStep(SEGMENTS[0].step);
    playSegmentByIndex(0); // 첫 진입 0-57 재생
  });

  anim.addEventListener("enterFrame", () => {
    if (!isPlaying || targetEndFrame == null) return;

    // currentFrame은 소수로 움직일 수 있어서 약간의 여유를 둠
    if (anim.currentFrame >= targetEndFrame - 0.5) {
      stopAtEndOfCurrentSegment();
      targetEndFrame = null;
    }
  });

  stageEl.addEventListener("wheel", onWheel, { passive: false });
  window.addEventListener("keydown", onKeyDown, { passive: false });
  stageEl.addEventListener("touchstart", onTouchStart, { passive: true });
  stageEl.addEventListener("touchend", onTouchEnd, { passive: true });
}
