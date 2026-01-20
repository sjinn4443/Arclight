// public/js/visualsystemeyesbrain.js

const wired = new WeakSet();

const JSON_PATH =
  "scrolls/workshop/childhood/visualsystemeyesbrain/VisualSystemEyesBrain.json";

// 요청한 세그먼트
const SEGMENTS = [
  [0, 59], // auto on enter
  [60, 119], // scroll 1
  [120, 207], // scroll 2
  [208, 400], // scroll 3
  [401, 598], // scroll 4
];

const TEXTS = [
  "The eyes collect light from the world and turn this into signals for the brain to create ‘vision’.",
  "Light is focused onto the back of the eye by the cornea and lens.",
  "At the back of the eye is the retina.",
  "This is like a sensor or film in a camera which turns the light into electrical signals that are passed to the brain down the optic nerve. The brain then creates vision from these signals.",
  // scroll 4 텍스트는 요청이 없어서, 마지막도 scroll 3 문장을 유지
  "This is like a sensor or film in a camera which turns the light into electrical signals that are passed to the brain down the optic nerve. The brain then creates vision from these signals.",
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
  const textEl = pageEl.querySelector("#vs_text");

  const setText = (index) => {
    if (!textEl) return;
    const i = Math.max(0, Math.min(TEXTS.length - 1, index));
    textEl.textContent = TEXTS[i];
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

  const playIndex = (i, force = true) => {
    if (!anim) return;

    const next = clampIndex(i);
    const [start, end] = SEGMENTS[next];

    currentIndex = next;
    isPlaying = true;

    setText(currentIndex);

    const pad = (n) => String(n).padStart(5, "0");
    setStatus(`frames ${pad(start)}→${pad(end)}`);

    anim.playSegments([start, end], force);
  };

  const next = () => {
    if (!anim || isPlaying || isThrottled) return;

    // ✅ 마지막 세그먼트(스크롤4)에서는 더 이상 앞으로 안 감 (00598에서 유지)
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

  const onWheel = (e) => {
    // 페이지 안에서만 스크롤을 소비
    e.preventDefault();
    if (!anim || isPlaying || isThrottled) return;

    if (e.deltaY > 0) next();
    else if (e.deltaY < 0) prev();
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
    renderer: "svg",
    loop: false,
    autoplay: false,
    path: JSON_PATH,
  });

  anim.addEventListener("data_failed", () => {
    setStatus("❌ JSON load failed (check path and server)");
  });

  anim.addEventListener("DOMLoaded", () => {
    setText(0);
    setStatus("Auto playing 00000→00059…");
    playIndex(0, true); // 진입 자동 재생
  });

  anim.addEventListener("complete", () => {
    isPlaying = false;

    const [, end] = SEGMENTS[currentIndex];
    anim.goToAndStop(end, true); // ✅ 항상 끝 프레임에 고정
    setText(currentIndex);

    // ✅ 마지막 구간이면 "End · 00598"로 고정 표시
    if (currentIndex === SEGMENTS.length - 1) {
      setStatus("End · 00598");
      return;
    }

    if (currentIndex === 0) setStatus("Ready · scroll to play (1/4)");
    else setStatus(`Ready · scroll again (${currentIndex}/4 done)`);
  });

  // 이벤트는 페이지 엘리먼트에 붙여서, 다른 페이지에서 wheel이 막히는 일을 최소화
  pageEl.addEventListener("wheel", onWheel, { passive: false });
  window.addEventListener("keydown", onKeyDown);
}
