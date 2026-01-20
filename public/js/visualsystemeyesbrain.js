// public/js/visualsystemeyesbrain.js

const wired = new WeakSet();

const JSON_PATH =
  "scrolls/workshop/childhood/visualsystemeyesbrain/VisualSystemEyesBrain.json";

// 요청한 세그먼트
const SEGMENTS = [
  [0, 57], // auto on enter (그대로)
  [58, 268], // scroll 1: 안정 구간까지만
  [269, 320], // scroll 2: 등장(269~285) + 다음 등장(304~320)까지 한 번에
  [321, 400], // scroll 3: 뇌 등장 시작(330~390)을 포함
  [401, 598], // scroll 4 (그대로)
];

async function ensureLottieLoaded() {
  if (window.lottie && typeof window.lottie.loadAnimation === "function")
    return;

  await new Promise((resolve, reject) => {
    const existing = document.querySelector('script[data-lottie="bodymovin"]');
    if (existing) {
      existing.addEventListener("load", resolve, { once: true });
      existing.addEventListener("error", reject, { once: true });
      return;
    }

    const s = document.createElement("script");
    s.src =
      "https://cdnjs.cloudflare.com/ajax/libs/bodymovin/5.12.2/lottie.min.js";
    s.async = true;
    s.dataset.lottie = "bodymovin";
    s.onload = resolve;
    s.onerror = reject;
    document.head.appendChild(s);
  });
}

export async function initializeVisualSystemEyesBrain() {
  const pageEl = document.getElementById("visualsystemeyesbrainPage");
  if (!pageEl || wired.has(pageEl)) return;
  wired.add(pageEl);

  const container = pageEl.querySelector("#vs_lottie");
  const statusEl = pageEl.querySelector("#vs_status");
  // HTML에 박아둔 문장들: <p class="vs-line" data-step="0..">
  const textLines = Array.from(pageEl.querySelectorAll(".vs-line"));
  const setText = (step) => {
    // step은 0~(SEGMENTS.length-1) 이라고 가정
    const stepStr = String(step);

    textLines.forEach((el) => {
      const match = el.getAttribute("data-step") === stepStr;
      el.classList.toggle("is-active", match);

      if (match) {
        el.classList.remove("vs-animate");
        void el.offsetWidth; // restart animation
        el.classList.add("vs-animate");
      }
    });
  };

  const setStatus = (t) => {
    if (statusEl) statusEl.textContent = t;
  };

  // Lottie 로드
  try {
    await ensureLottieLoaded();
  } catch (e) {
    console.error("Failed to load lottie library:", e);
    setStatus("❌ Lottie library load failed (check network)");
    return;
  }

  if (!container) {
    setStatus("❌ Missing #vs_lottie container");
    return;
  }

  let anim = null;
  let currentIndex = 0;
  let isPlaying = false;
  let isThrottled = false;

  const clampIndex = (i) => Math.max(0, Math.min(SEGMENTS.length - 1, i));
  const throttle = (ms = 250) => {
    isThrottled = true;
    window.setTimeout(() => (isThrottled = false), ms);
  };

  // ---------------------------------------------------------------------------
  // ✅ (4) "다음 세그먼트 마지막 프레임이 잠깐 보였다가 시작 프레임으로 점프" 버그 방지
  // ---------------------------------------------------------------------------
  // 원인: Lottie가 playSegments 시작 타이밍에 현재 프레임 렌더 상태에 따라
  // 다음 세그먼트의 끝 프레임이 잠깐 그려지는 경우가 있음.
  // 해결: 재생 전 반드시 start 프레임으로 '먼저' goToAndStop 한 뒤,
  // requestAnimationFrame에서 playSegments를 시작해 start 프레임이 확실히 먼저 렌더되게 함.
  let playingIndex = 0;

  const playIndex = (i, force = true) => {
    if (!anim) return;

    const next = clampIndex(i);
    const [start, end] = SEGMENTS[next];

    const clampFrame = (f) => {
      if (maxFrame == null) return f;
      return Math.max(0, Math.min(maxFrame, f));
    };

    const startSafe = clampFrame(start);
    const endSafe = clampFrame(end);

    currentIndex = next;
    playingIndex = next;
    isPlaying = true;

    setText(currentIndex);

    const pad = (n) => String(n).padStart(5, "0");
    setStatus(`frames ${pad(startSafe)}→${pad(endSafe)}`);
    anim.goToAndStop(startSafe, true);
    requestAnimationFrame(() => {
      if (!anim) return;
      anim.playSegments([startSafe, endSafe], force);
    });
  };

  const next = () => {
    if (!anim || isPlaying || isThrottled) return;

    // ✅ 마지막 세그먼트에서는 더 이상 앞으로 안 감 (00598에서 유지)
    if (currentIndex >= SEGMENTS.length - 1) {
      const [, end] = SEGMENTS[SEGMENTS.length - 1];
      anim.goToAndStop(end, true);
      setStatus("End · 00598");
      setText(SEGMENTS.length - 1);
      return;
    }

    throttle(250);
    playIndex(currentIndex + 1, true);
  };

  const prev = () => {
    if (!anim || isPlaying || isThrottled) return;
    throttle(250);
    playIndex(currentIndex - 1, true);
  };

  const replay = () => {
    if (!anim || isPlaying) return;
    playIndex(currentIndex, true);
  };

  // ---------------------------------------------------------------------------
  // ✅ (2) 데스크톱: wheel 스크롤로 애니메이션 제어 (기존 구조 유지)
  // ---------------------------------------------------------------------------
  const onWheel = (e) => {
    // 페이지 안에서만 스크롤을 소비
    e.preventDefault();
    if (!anim || isPlaying || isThrottled) return;

    if (e.deltaY > 0) next();
    else if (e.deltaY < 0) prev();
  };

  // ---------------------------------------------------------------------------
  // ✅ (3) 모바일: 터치 스크롤(스와이프)로 애니메이션 변경 + 화면은 입력으로는 안 움직이게
  // ---------------------------------------------------------------------------
  // - 사용자가 손가락으로 아래로 스와이프하면 next()
  // - 위로 스와이프하면 prev()
  // - 기본 스크롤은 막고(페이지가 그냥 내려가 버리는 문제 해결),
  //   대신 autoScrollToFrame이 애니메이션 진행에 맞춰 뷰포트를 이동시킴
  let touchStartY = null;
  let touchLastY = null;

  const SWIPE_THRESHOLD_PX = 22; // 너무 민감하면 오작동, 너무 크면 반응 느림

  const onTouchStart = (e) => {
    if (!anim) return;
    if (!e.touches || e.touches.length !== 1) return;

    touchStartY = e.touches[0].clientY;
    touchLastY = touchStartY;
  };

  const onTouchMove = (e) => {
    if (!anim) return;
    if (!e.touches || e.touches.length !== 1) return;

    // ✅ 모바일에서 화면만 내려가는 기본 동작 차단
    e.preventDefault();

    if (touchStartY == null) return;

    const y = e.touches[0].clientY;
    const dy = y - touchLastY;
    touchLastY = y;

    // dy가 누적돼 threshold 넘는 순간에 한 번만 next/prev 실행
    const totalDy = y - touchStartY;

    if (!isPlaying && !isThrottled) {
      if (totalDy <= -SWIPE_THRESHOLD_PX) {
        // 위로 스와이프(손가락이 위로) => 페이지는 아래로 가려는 입력 => next
        next();
        touchStartY = y; // 리셋해서 연속 스와이프 가능
      } else if (totalDy >= SWIPE_THRESHOLD_PX) {
        // 아래로 스와이프 => prev
        prev();
        touchStartY = y;
      }
    }
  };

  const onTouchEnd = () => {
    touchStartY = null;
    touchLastY = null;
  };

  const onKeyDown = (e) => {
    if (!anim) return;

    if (e.key === "ArrowDown" || e.key === "PageDown") {
      e.preventDefault();
      next();
    } else if (e.key === "ArrowUp" || e.key === "PageUp") {
      e.preventDefault();
      prev();
    } else if (e.key === " " || e.key === "Spacebar") {
      e.preventDefault();
      replay();
    }
  };

  // 애니메이션 생성
  anim = window.lottie.loadAnimation({
    container,
    renderer: "canvas",
    loop: false,
    autoplay: false,
    path: JSON_PATH,
    rendererSettings: {
      clearCanvas: true,
    },
  });

  anim.addEventListener("data_failed", () => {
    setStatus("❌ JSON load failed (check path and server)");
  });

  let maxFrame = null;

  anim.addEventListener("DOMLoaded", () => {
    anim.setSubframe(false);

    // ✅ 총 프레임(마지막 프레임 인덱스) 계산
    maxFrame = Math.floor(anim.getDuration(true)) - 1;

    setText(0);
    setStatus("Auto playing 00000→00059…");
    playIndex(0, true);
  });

  const dbg = (...args) => console.log("[VS]", ...args);

  anim.addEventListener("enterFrame", () => {
    // 너무 많이 찍히면 주석 처리하고, 문제 구간에서만 잠깐 켜
    dbg(
      "frame",
      Math.round(anim.currentFrame),
      "seg",
      playingIndex,
      "isPlaying",
      isPlaying,
    );
  });

  anim.addEventListener("complete", () => {
    isPlaying = false;

    const snapIndex = playingIndex;
    const [, end] = SEGMENTS[snapIndex];

    console.log(
      "[VS] COMPLETE seg",
      snapIndex,
      "at",
      Math.round(anim.currentFrame),
      "end",
      end,
    );

    for (let k = 1; k <= 3; k++) {
      requestAnimationFrame(() => {
        console.log(
          "[VS] post-complete frame",
          k,
          Math.round(anim.currentFrame),
        );
      });
    }

    requestAnimationFrame(() => {
      if (!anim) return;

      // stop()은 프레임을 0으로 리셋해서 '튐'이 생길 수 있음
      // 끝 프레임을 먼저 고정하고, pause로 상태만 멈춰두는 게 안전함
      anim.goToAndStop(end, true);
      anim.pause();
    });

    setText(snapIndex);

    if (snapIndex === SEGMENTS.length - 1) {
      setStatus("End · 00598");
      return;
    }

    if (snapIndex === 0) setStatus("Ready · scroll to play (1/4)");
    else setStatus(`Ready · scroll again (${snapIndex}/4 done)`);
  });

  // ---------------------------------------------------------------------------
  // 이벤트 바인딩
  // ---------------------------------------------------------------------------

  // ✅ 터치에서 preventDefault가 동작하려면 passive:false 필요
  pageEl.addEventListener("wheel", onWheel, { passive: false });
  pageEl.addEventListener("touchstart", onTouchStart, { passive: true });
  pageEl.addEventListener("touchmove", onTouchMove, { passive: false });
  pageEl.addEventListener("touchend", onTouchEnd, { passive: true });
  pageEl.addEventListener("touchcancel", onTouchEnd, { passive: true });

  window.addEventListener("keydown", onKeyDown);

  // ✅ 일부 모바일 브라우저에서 터치 스크롤이 계속 살아있을 수 있어서 CSS 힌트도 줌
  // (JS에서 style로 주면 별도 CSS 파일 수정 없이 적용 가능)
  pageEl.style.touchAction = "none";
}
