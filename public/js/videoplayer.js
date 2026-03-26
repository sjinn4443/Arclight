/**
 * @fileoverview This file manages video player functionalities, including ensuring single video playback, handling time-based content updates, and initializing interactive toolbars.
 */

let lastPauseTime = null;

function replaceContentWithTemplate(target, templateId) {
  if (!target) return;
  const template = document.getElementById(templateId);
  if (!template) return;
  target.replaceChildren(template.content.cloneNode(true));
}

async function handleQuizClick() {
  // If an old global exists, use it
  if (typeof window.launchQuiz === "function") {
    return window.launchQuiz();
  }

  // Try to load the quiz launcher if it wasn't executed yet
  try {
    await import("./quiz-launcher.js");
  } catch (err) {
    console.warn("Failed to import quiz launcher:", err);
  }

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
    const smallScreen = Math.min(window.innerWidth, window.innerHeight) < 1024;
    return (coarse || touchPoints > 0) && smallScreen;
  };

  const shouldSkipAutoFullscreen = (videoEl) => {
    return videoEl?.dataset?.preventAutoFullscreen === "true";
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
    if (shouldSkipAutoFullscreen(videoEl)) return;

    // 이미 fullscreen이면 중복 진입 방지
    if (getFsElement()) return;

    arclightFsActive = true;

    // 1) iOS Safari: video.webkitEnterFullscreen()이 "비디오 전용 fullscreen"이라 가장 안정적
    //    (document fullscreenchange가 안 뜨는 경우가 많아서 아래에 별도 이벤트도 붙일 예정)
    if (typeof videoEl.webkitEnterFullscreen === "function") {
      try {
        videoEl.webkitEnterFullscreen();
      } catch (_) {
        // 실패 시 아래 표준 fullscreen으로 fallback
      }
    }

    // 2) 표준 Fullscreen API: video 자체를 fullscreen 대상으로
    if (!getFsElement()) {
      await requestFs(videoEl);
    }

    // 3) fullscreen 진입 직후에 orientation lock 시도 (일부 기기에서 타이밍 이슈가 있어 1회 재시도)
    await requestLandscapeLock();
    setTimeout(() => {
      requestLandscapeLock();
    }, 250);
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
      // iOS video fullscreen 전용 이벤트 (document fullscreenchange가 안 뜰 수 있음)
      if (!v.__wiredIosFsEvents) {
        v.__wiredIosFsEvents = true;

        v.addEventListener("webkitbeginfullscreen", async () => {
          if (!isMobileOrTablet()) return;
          arclightFsActive = true;
          await requestLandscapeLock();
        });

        v.addEventListener("webkitendfullscreen", async () => {
          await restoreAfterFullscreenExit();
        });
      }

      videos.forEach((other) => {
        if (other !== v) other.pause();
      });
      if (!shouldSkipAutoFullscreen(v)) {
        enterVideoFullscreen(v);
      }
    });
  });

  // === Share UI wiring (button below video) ===
  const shareBtns = Array.from(
    document.querySelectorAll("[data-video-share-btn]"),
  );

  // If there are no share buttons on this page, do nothing.
  if (!shareBtns.length) return;

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
    const explicit = btn.getAttribute("data-video-share-url");
    if (explicit && explicit.trim()) return explicit.trim();

    const container = btn.closest(".video-container");
    const video = container ? container.querySelector("video") : null;

    if (video && video.currentSrc) return video.currentSrc;

    if (video) {
      const source = video.querySelector("source");
      const src =
        (source && source.getAttribute("src")) ||
        video.getAttribute("src") ||
        "";
      const abs = resolveToAbsoluteUrl(src);
      if (abs) return abs;
    }

    return window.location.href;
  };

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

  const getOrCreateShareMenu = () => {
    let menu = document.getElementById("videoShareMenu");
    if (menu) return menu;

    const menuTemplate = document.getElementById("videoShareMenuTemplate");
    menu = menuTemplate?.content.firstElementChild?.cloneNode(true);
    if (!menu) {
      menu = document.createElement("div");
      menu.className = "video-share-menu";

      const shareBtn = document.createElement("button");
      shareBtn.type = "button";
      shareBtn.className = "video-share-menu__item";
      shareBtn.setAttribute("data-video-share-action", "share-video");
      shareBtn.textContent = "Share video";

      const shopBtn = document.createElement("button");
      shopBtn.type = "button";
      shopBtn.className = "video-share-menu__item";
      shopBtn.setAttribute("data-video-share-action", "shop");
      shopBtn.textContent = "Arclight Shop";

      menu.appendChild(shareBtn);
      menu.appendChild(shopBtn);
    }

    menu.id = "videoShareMenu";
    menu.hidden = true;

    // Keep current context here
    menu.dataset.videoUrl = "";
    menu.dataset.anchorBtnId = "";

    document.body.appendChild(menu);

    // Close helpers (wired once)
    if (!menu.__wiredClose) {
      menu.__wiredClose = true;

      const closeMenu = () => {
        menu.hidden = true;
        menu.dataset.videoUrl = "";
        menu.dataset.anchorBtnId = "";
      };

      // Click outside closes
      document.addEventListener("mousedown", (e) => {
        if (menu.hidden) return;

        const target = e.target;
        if (!(target instanceof Element)) return;

        const anchorBtnId = menu.dataset.anchorBtnId;
        const anchorBtn = anchorBtnId
          ? document.getElementById(anchorBtnId)
          : null;

        const clickedInsideMenu = menu.contains(target);
        const clickedOnAnchorBtn = anchorBtn
          ? anchorBtn.contains(target)
          : false;

        if (!clickedInsideMenu && !clickedOnAnchorBtn) closeMenu();
      });

      // Page changes should close (same intent as existing modal logic)
      document.addEventListener("page:shown", closeMenu);
      window.addEventListener("page:loaded", closeMenu);

      // Scroll/resize closes to avoid “floating in wrong place”
      window.addEventListener("scroll", closeMenu, { passive: true });
      window.addEventListener("resize", closeMenu);

      // Menu item actions
      menu.addEventListener("click", async (e) => {
        const btn = e.target.closest("[data-video-share-action]");
        if (!btn) return;

        const action = btn.getAttribute("data-video-share-action");
        const videoUrl = menu.dataset.videoUrl || window.location.href;

        if (action === "shop") {
          // Direct redirect (requirement)
          window.location.href = SHOP_URL;
          return;
        }

        if (action === "share-video") {
          // Prefer native share, fallback to clipboard copy
          if (navigator && typeof navigator.share === "function") {
            try {
              await navigator.share({
                title: document.title || "Arclight video",
                url: videoUrl,
              });
            } catch (_) {
              await copyToClipboard(videoUrl);
            }
          } else {
            await copyToClipboard(videoUrl);
          }

          closeMenu();
        }
      });
    }

    return menu;
  };

  const positionMenuNearButton = (menu, btn) => {
    // Use fixed positioning relative to viewport
    menu.style.position = "fixed";

    // Make it measurable while still “hidden” to the user
    const wasHidden = menu.hidden;
    if (wasHidden) menu.hidden = false;
    menu.style.visibility = "hidden";

    const r = btn.getBoundingClientRect();
    const menuRect = menu.getBoundingClientRect();

    // Default: below the button, left-aligned
    let top = r.bottom + 8;
    let left = r.left;

    // Keep inside viewport with small padding
    const pad = 8;
    const vw = window.innerWidth;
    const vh = window.innerHeight;

    // If overflowing right, shift left
    if (left + menuRect.width > vw - pad) {
      left = Math.max(pad, vw - pad - menuRect.width);
    }

    // If overflowing bottom, open upward
    if (top + menuRect.height > vh - pad) {
      top = Math.max(pad, r.top - 8 - menuRect.height);
    }

    menu.style.left = `${left}px`;
    menu.style.top = `${top}px`;

    // Restore visibility
    menu.style.visibility = "";
    if (wasHidden) menu.hidden = true;
  };

  shareBtns.forEach((btn, idx) => {
    // Ensure each share button has a stable id (for outside-click logic)
    if (!btn.id) btn.id = `videoShareBtn_${idx}`;

    if (btn.__wiredShareMenuOpen) return;
    btn.__wiredShareMenuOpen = true;

    btn.addEventListener("click", (e) => {
      e.preventDefault();
      e.stopPropagation();
      e.stopImmediatePropagation();

      const menu = getOrCreateShareMenu();

      // Toggle behaviour: if same anchor and open, close it
      const isSameAnchor = menu.dataset.anchorBtnId === btn.id;
      if (!menu.hidden && isSameAnchor) {
        menu.hidden = true;
        menu.dataset.videoUrl = "";
        menu.dataset.anchorBtnId = "";
        return;
      }

      const videoUrl = getVideoUrlForButton(btn);
      menu.dataset.videoUrl = videoUrl;
      menu.dataset.anchorBtnId = btn.id;

      // Position then show
      positionMenuNearButton(menu, btn);
      menu.hidden = false;
    });
  });
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

  replaceContentWithTemplate(contentBox, "videoTimestampsTemplate");

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
  replaceContentWithTemplate(contentBox, "videoNoteTemplate");
}

function showFiles() {
  setActiveToolbarButton("folderBtn");
  const contentBox = document.getElementById("contentBox");
  if (!contentBox) return;
  replaceContentWithTemplate(contentBox, "videoFilesTemplate");
}

function showDefaultInfo() {
  setActiveToolbarButton("infoBtn");
  const contentBox = document.getElementById("contentBox");
  if (!contentBox) return;
  replaceContentWithTemplate(contentBox, "videoInfoTemplate");
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
        replaceContentWithTemplate(contentBox, "videoEyeAnatomyTemplate");
      },
    },
    32: {
      id: "device-info",
      handler: () => {
        replaceContentWithTemplate(contentBox, "videoDeviceOverviewTemplate");
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
