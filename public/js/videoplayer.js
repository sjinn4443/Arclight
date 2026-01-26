/**
 * @fileoverview This file manages video player functionalities, including ensuring single video playback, handling time-based content updates, and initializing interactive toolbars.
 */

let lastPauseTime = null;

async function handleQuizClick() {
  // If an old global exists, use it
  if (typeof window.launchQuiz === "function") {
    return window.launchQuiz();
  }

  // Otherwise, navigate to the quiz page directly
  try {
    if (typeof loadPage === "function") {
      await loadPage("quizzes"); // ensure quizzes fragment is loaded
    }
    if (typeof window.showPage === "function") {
      window.showPage("directOphthalmoscopyQuizPage");
    } else if (typeof minimalShowPage === "function") {
      minimalShowPage("directOphthalmoscopyQuizPage");
    }
  } catch (err) {
    console.error("Failed to launch quiz:", err);
  }
}

export function seekTo(sec) {
  const video = document.getElementById("customVideo");
  if (video) {
    video.currentTime = sec;
    video.play();
    lastPauseTime = null; // reset pause tracking
  }
}

export function initializeVideoPlayers() {
  // === Fullscreen + orientation (mobile/tablet only) ===
  let arclightFsActive = false;

  const isMobileOrTablet = () => {
    const coarse =
      window.matchMedia && window.matchMedia("(pointer: coarse)").matches;
    const touchPoints = navigator.maxTouchPoints || 0;
    const smallScreen = Math.min(window.innerWidth, window.innerHeight) <= 1024;
    return (coarse || touchPoints > 0) && smallScreen;
  };

  const requestLandscapeLock = async () => {
    try {
      if (screen.orientation && typeof screen.orientation.lock === "function") {
        await screen.orientation.lock("landscape");
      }
    } catch (_) {
      // ignore (iOS Safari 등에서 실패 가능)
    }
  };

  const unlockOrientation = async () => {
    try {
      if (
        screen.orientation &&
        typeof screen.orientation.unlock === "function"
      ) {
        screen.orientation.unlock();
      }
    } catch (_) {
      // ignore
    }
  };

  const requestFs = async (el) => {
    const anyEl = el;
    if (anyEl.requestFullscreen) return anyEl.requestFullscreen();
    if (anyEl.webkitRequestFullscreen) return anyEl.webkitRequestFullscreen();
    if (anyEl.msRequestFullscreen) return anyEl.msRequestFullscreen();
  };

  const exitFs = async () => {
    const d = document;
    if (d.exitFullscreen) return d.exitFullscreen();
    if (d.webkitExitFullscreen) return d.webkitExitFullscreen();
    if (d.msExitFullscreen) return d.msExitFullscreen();
  };

  const getFsElement = () => {
    return (
      document.fullscreenElement ||
      document.webkitFullscreenElement ||
      document.msFullscreenElement ||
      null
    );
  };

  const enterVideoFullscreen = async (videoEl) => {
    if (!isMobileOrTablet()) return;

    // 이미 fullscreen이면 중복 진입 방지
    if (getFsElement()) return;

    // video가 들어있는 컨테이너를 fullscreen 대상으로
    const container = videoEl.closest(".video-container") || videoEl;

    arclightFsActive = true;
    await requestFs(container);
    await requestLandscapeLock();
  };

  const restoreAfterFullscreenExit = async () => {
    if (!arclightFsActive) return;
    arclightFsActive = false;
    await unlockOrientation();
  };

  const onFullscreenChange = async () => {
    const fsEl = getFsElement();
    if (!fsEl) {
      await restoreAfterFullscreenExit();
    }
  };

  document.addEventListener("fullscreenchange", onFullscreenChange);
  document.addEventListener("webkitfullscreenchange", onFullscreenChange);
  document.addEventListener("MSFullscreenChange", onFullscreenChange);

  // Attach contextual timeupdate to the Direct Ophthalmoscopy video
  const main = document.getElementById("customVideo");
  if (main && !main.__wiredTimeupdate) {
    main.__wiredTimeupdate = true;
    main.addEventListener("timeupdate", handleVideoTimeUpdate);
  }

  // Ensure only one video plays at a time
  const videos = document.querySelectorAll("video");
  videos.forEach((v) => {
    if (v.__wiredPlayOnce) return;
    v.__wiredPlayOnce = true;
    v.addEventListener("play", () => {
      videos.forEach((other) => {
        if (other !== v) other.pause();
      });
      enterVideoFullscreen(v);
    });
  });

  // === Share UI wiring (button below video) ===
  const shareBtns = Array.from(
    document.querySelectorAll("[data-video-share-btn]"),
  );
  const sharePanel = document.querySelector("[data-video-share-panel]");
  const shopCopyBtn = document.querySelector("[data-video-share-copy-shop]");
  const videoCopyBtn = document.querySelector("[data-video-share-copy-video]");
  const nativeShareBtn = document.querySelector("[data-video-share-native]");
  const closeBtn = document.querySelector("[data-video-share-close]");
  const shopLinkEl = document.querySelector("[data-video-share-shop-link]");
  const videoLinkEl = document.querySelector("[data-video-share-video-link]");

  // If the page does not have share UI, skip safely
  if (shareBtns.length && sharePanel && shopLinkEl && videoLinkEl) {
    const SHOP_URL = "https://arclightprojectshop.co.uk/";

    const resolveToAbsoluteUrl = (maybeRelativeUrl) => {
      if (!maybeRelativeUrl) return "";
      try {
        return new URL(maybeRelativeUrl, window.location.href).href;
      } catch (_) {
        return String(maybeRelativeUrl);
      }
    };

    const getVideoUrlForButton = (btn) => {
      // 1) 버튼에 명시적으로 data-video-share-url이 있으면 그걸 사용
      const explicit = btn.getAttribute("data-video-share-url");
      if (explicit && explicit.trim()) return explicit.trim();

      // 2) 버튼이 들어있는 video-container 안의 video.currentSrc 사용
      const container = btn.closest(".video-container");
      const video = container ? container.querySelector("video") : null;

      if (video && video.currentSrc) return video.currentSrc;

      // 3) currentSrc가 비어있으면 <source src> 또는 video.src를 절대경로로 변환
      if (video) {
        const source = video.querySelector("source");
        const src =
          (source && source.getAttribute("src")) ||
          video.getAttribute("src") ||
          "";
        const abs = resolveToAbsoluteUrl(src);
        if (abs) return abs;
      }

      // 4) 최후: 현재 페이지 URL
      return window.location.href;
    };

    const openPanel = (btn) => {
      const videoUrl = getVideoUrlForButton(btn);
      shopLinkEl.value = SHOP_URL;
      videoLinkEl.value = videoUrl;

      sharePanel.hidden = false;

      // native share 지원 여부에 따라 버튼 표시
      if (nativeShareBtn) {
        nativeShareBtn.hidden = !(
          navigator && typeof navigator.share === "function"
        );
      }
    };

    const closePanel = () => {
      sharePanel.hidden = true;
    };

    sharePanel.addEventListener("click", (e) => {
      if (e.target === sharePanel) closePanel();
    });

    const copyToClipboard = async (text) => {
      try {
        await navigator.clipboard.writeText(text);
        return true;
      } catch (_) {
        const ta = document.createElement("textarea");
        ta.value = text;
        ta.setAttribute("readonly", "");
        ta.style.position = "fixed";
        ta.style.left = "-9999px";
        document.body.appendChild(ta);
        ta.select();
        const ok = document.execCommand("copy");
        document.body.removeChild(ta);
        return ok;
      }
    };

    shareBtns.forEach((btn) => {
      btn.addEventListener("click", (e) => {
        e.preventDefault();
        openPanel(btn);
      });
    });

    if (closeBtn) {
      closeBtn.addEventListener("click", (e) => {
        e.preventDefault();
        closePanel();
      });
    }

    if (shopCopyBtn) {
      shopCopyBtn.addEventListener("click", async (e) => {
        e.preventDefault();
        await copyToClipboard(shopLinkEl.value);
      });
    }

    if (videoCopyBtn) {
      videoCopyBtn.addEventListener("click", async (e) => {
        e.preventDefault();
        await copyToClipboard(videoLinkEl.value);
      });
    }

    if (nativeShareBtn) {
      nativeShareBtn.addEventListener("click", async (e) => {
        e.preventDefault();

        const videoUrl = videoLinkEl.value;
        const shopUrl = shopLinkEl.value;

        try {
          await navigator.share({
            title: document.title || "Arclight video",
            text: `Video: ${videoUrl}\nShop: ${shopUrl}`,
            url: videoUrl,
          });
        } catch (_) {
          await copyToClipboard(videoUrl);
        }
      });
    }
  }
}

let __toolbarInitialized = false;

export function initializeToolbar() {
  if (__toolbarInitialized) return;
  __toolbarInitialized = true;

  const toolbarButtonMappings = {
    timestampBtn: showTimestamps,
    noteBtn: showNote,
    folderBtn: showFiles,
    infoBtn: showDefaultInfo,
    quizBtn: handleQuizClick,
  };

  for (const [btnId, handler] of Object.entries(toolbarButtonMappings)) {
    const button = document.getElementById(btnId);
    if (button && !button.__wired) {
      button.__wired = true;
      button.addEventListener("click", (e) => {
        e.preventDefault();
        const video = document.getElementById("customVideo");
        if (video) video.pause(); // pause first
        handler(); // then run the action
      });
    }
  }
}

function showTimestamps() {
  setActiveToolbarButton("timestampBtn");
  const contentBox = document.getElementById("contentBox");
  if (!contentBox) return;

  contentBox.innerHTML = `
    <h4>Time stamp</h4>
    <p><a href="#" data-ts="0">0:00 General Inspection</a></p>
    <p><a href="#" data-ts="28">0:28 Arclight Setup</a></p>
    <p><a href="#" data-ts="47">0:47 Fundal Reflex</a></p>
    <p><a href="#" data-ts="67">1:07 Optic Nerve</a></p>
    <p><a href="#" data-ts="102">1:42 Retinal Vessels</a></p>`;

  contentBox.querySelectorAll("[data-ts]").forEach((a) => {
    a.addEventListener("click", (ev) => {
      ev.preventDefault();
      const sec = parseInt(a.getAttribute("data-ts"), 10) || 0;
      seekTo(sec);
    });
  });
}

function showNote() {
  setActiveToolbarButton("noteBtn");
  const contentBox = document.getElementById("contentBox");
  if (!contentBox) return;
  contentBox.innerHTML =
    '<textarea placeholder="Type your notes here..."></textarea>';
}

function showFiles() {
  setActiveToolbarButton("folderBtn");
  const contentBox = document.getElementById("contentBox");
  if (!contentBox) return;
  contentBox.innerHTML = `
    <h4>Attached Files</h4>
    <p><a class="link" href="#">Arclight_Device_Practice.pdf</a></p>
    <p><a class="link" href="#">Fundal_Reflex.pdf</a></p>
    <p><a class="link" href="#">Ophthalmoscopy_Exercise.docx</a></p>`;
}

function showDefaultInfo() {
  setActiveToolbarButton("infoBtn");
  const contentBox = document.getElementById("contentBox");
  if (!contentBox) return;
  contentBox.innerHTML = `
    <h4>Additional Information</h4>
    <p>This video shows how to prepare and use the Arclight ophthalmoscope.</p>`;
}

function setActiveToolbarButton(id) {
  document
    .querySelectorAll(".toolbar button")
    .forEach((btn) => btn.classList.remove("active"));
  const activeBtn = document.getElementById(id);
  if (activeBtn) activeBtn.classList.add("active");
}

// ==== AUTO-MIGRATED FROM legacy script.js (2025-07-15) ====
// The following functions were ported automatically. Review selectors and
// ensure they are invoked from main.js on `page:loaded` where relevant.
// Functions: handleVideoTimeUpdate

function handleVideoTimeUpdate() {
  const video = document.getElementById("customVideo");
  if (!video) return;

  const time = Math.floor(video.currentTime);
  const contentBox = document.getElementById("contentBox");

  const pauseEvents = {
    22: {
      id: "eye-info",
      handler: () => {
        contentBox.innerHTML = `
          <h4>Eye Anatomy</h4>
          <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/6/64/Eye_anatomy_diagram.svg/1200px-Eye_anatomy_diagram.svg.png" style="width: 100%; border-radius: 5px; margin-top: 10px;" />
          <ul><li>Periorbita</li><li>Eyelids</li><li>Eyes</li></ul>`;
      },
    },
    32: {
      id: "device-info",
      handler: () => {
        contentBox.innerHTML = `
          <h4>Arclight Device Overview</h4>
          <img src="images/learning/arclight_device.webp" style="width: 100%; border-radius: 5px;" />`;
      },
    },
  };

  if (pauseEvents[time] && lastPauseTime !== pauseEvents[time].id) {
    lastPauseTime = pauseEvents[time].id;
    video.pause();
    pauseEvents[time].handler();
    setTimeout(() => video.play(), 5000); // Auto-resume after 5 seconds
  }
}
