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
  const stageEl = page.querySelector(".visualsystem-stage");
  if (!stageEl) {
    console.error("[visualsystemeyesbrain] .visualsystem-stage not found");
    return;
  }
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
  let isReady = false;

  let lastTriggerTs = 0;
  const TRIGGER_COOLDOWN_MS = 250;

  let wheelAccum = 0;
  const WHEEL_THRESHOLD = 30; // 필요하면 20~60 사이로 조절

  let pendingDir = 0;

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

  let isSnapping = false;

  function stopAtEndOfCurrentSegment() {
    if (!anim) return;
    if (isSnapping) return;
    isSnapping = true;

    const seg = SEGMENTS[segIndex];
    const end = seg.to;

    // ✅ 먼저 상태를 내려서 enterFrame/next/prev 재진입을 끊음
    isPlaying = false;
    targetEndFrame = null;
    setStatus(`Paused @ ${end}`);

    // ✅ goToAndStop은 콜스택 밖에서 (enterFrame 루프와 분리)
    requestAnimationFrame(() => {
      try {
        anim.goToAndStop(end, true);
      } finally {
        isSnapping = false;

        // ✅ 스냅이 끝난 뒤, 예약된 이동이 있으면 한 번만 실행
        if (pendingDir !== 0) {
          const dir = pendingDir;
          pendingDir = 0;

          // cooldown 무시하고 즉시 이동시키면 UX가 더 자연스러움
          if (dir > 0 && segIndex < SEGMENTS.length - 1) {
            playSegmentByIndex(segIndex + 1);
          } else if (dir < 0 && segIndex > 0) {
            playSegmentByIndex(segIndex - 1);
          }
        }
      }
    });
  }

  function next() {
    const now = Date.now();
    if (now - lastTriggerTs < TRIGGER_COOLDOWN_MS) return;
    lastTriggerTs = now;

    // ✅ 재생 중이면: 현재 세그먼트를 끝으로 스냅하고 진행
    if (isPlaying) {
      pendingDir = 1; // 끝나면 다음으로
      return;
    }

    if (segIndex >= SEGMENTS.length - 1) {
      setStatus(`End · Paused @ ${SEGMENTS[segIndex].to}`);
      return;
    }
    playSegmentByIndex(segIndex + 1);
  }

  function prev() {
    const now = Date.now();
    if (now - lastTriggerTs < TRIGGER_COOLDOWN_MS) return;
    lastTriggerTs = now;

    // ✅ 재생 중이면: 현재 세그먼트를 끝으로 스냅하고 진행
    if (isPlaying) {
      pendingDir = -1; // 끝나면 다음으로
      return;
    }

    if (segIndex <= 0) {
      playSegmentByIndex(0);
      return;
    }
    playSegmentByIndex(segIndex - 1);
  }

  function onKeyDown(e) {
    // 입력이 폼 요소에서 일어날 땐 방해하지 않기
    const tag =
      e.target && e.target.tagName ? e.target.tagName.toLowerCase() : "";
    if (tag === "input" || tag === "textarea" || tag === "select") return;

    // 이 화면은 키로도 단계 이동을 하므로 기본 스크롤(화살표) 등을 막음
    const k = e.key;

    if (k === "ArrowDown" || k === "PageDown") {
      e.preventDefault();
      next();
      return;
    }
    if (k === "ArrowUp" || k === "PageUp") {
      e.preventDefault();
      prev();
      return;
    }
    if (k === " " || k === "Spacebar") {
      e.preventDefault();
      // 현재 세그먼트 다시 재생
      playSegmentByIndex(segIndex);
      return;
    }
  }

  function onWheel(e) {
    // 1) 애니메이션 준비 전엔 기본 스크롤을 막지 않음
    if (!isReady) return;

    // 2) 이 페이지는 wheel을 ‘단계 전환’으로 쓰므로 기본 스크롤은 막음
    e.preventDefault();

    // (디버그용 로그가 필요하면 여기 두기)
    console.log("[VS wheel]", {
      deltaY: e.deltaY,
      isReady,
      segIndex,
      isPlaying,
      pendingDir,
      wheelAccum,
    });

    // 3) 트랙패드/마우스 모두 대응하려고 누적
    wheelAccum += e.deltaY;

    // 4) 아직 threshold 미만이면 아무 것도 하지 않음
    if (Math.abs(wheelAccum) < WHEEL_THRESHOLD) return;

    // 5) threshold 넘었으면 이번 제스처의 방향만 결정
    const goingDown = wheelAccum > 0;

    // 6) 의도는 pendingDir에만 저장 (재생 중에도 의도는 남김)
    pendingDir = goingDown ? 1 : -1;

    // 7) 이번 제스처는 처리했으니 누적 초기화 (중요!)
    wheelAccum = 0;

    // 8) 현재 재생 중이 아니라면 바로 실행
    if (!isPlaying) {
      if (goingDown) next();
      else prev();
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

  anim.addEventListener("data_failed", () => {
    setStatus("Error: animation data failed to load");
    isReady = false; // 스크롤 가로채지 않게
  });

  anim.addEventListener("DOMLoaded", () => {
    console.warn("[visualsystemeyesbrain] DOMLoaded");
    isReady = true;
    segIndex = 0;
    setCopyStep(SEGMENTS[0].step);
    playSegmentByIndex(0); // 첫 진입 0-57 재생
  });

  anim.addEventListener("enterFrame", () => {
    if (!isPlaying || targetEndFrame == null) return;

    // currentFrame은 소수로 움직일 수 있어서 약간의 여유를 둠
    if (anim.currentFrame >= targetEndFrame - 0.5) {
      stopAtEndOfCurrentSegment();
    }
  });

  stageEl.addEventListener("wheel", onWheel, { passive: false });
  window.addEventListener("keydown", onKeyDown, { passive: false });
  stageEl.addEventListener("touchstart", onTouchStart, { passive: true });
  stageEl.addEventListener("touchend", onTouchEnd, { passive: true });
}
