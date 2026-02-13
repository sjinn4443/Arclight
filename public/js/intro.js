/**
 * @fileoverview This file contains intro related functions and logic, handling navigation to the dashboard when either the "See What's New" or "Skip" buttons are clicked.
 */

import { loadPage } from "./navigation.js";

function runMidSplashThen(routeName) {
  const splashContainer = document.getElementById("splashScreenContainer");
  const pageContainer = document.getElementById("page-content");

  // splash 컨테이너가 없으면 바로 이동 (fallback)
  if (!splashContainer) {
    loadPage(routeName);
    return;
  }

  splashContainer.classList.remove("fade-out");
  splashContainer.innerHTML = "";

  fetch("html/splashscreen_mid.html")
    .then((r) => r.text())
    .then((html) => {
      splashContainer.innerHTML = html;

      if (pageContainer) pageContainer.style.display = "none";
      splashContainer.classList.add("splash-full-screen"); // 추가
      splashContainer.classList.add("active");

      const logo =
        splashContainer.querySelector(".logo-one.mid-only") ||
        splashContainer.querySelector(".logo-one");

      const holdBufferMs = 220;
      const postFadeDelayMs = 140;

      // Expected timing: 2 * 1.3s spins = 2.6s (+small buffer)
      const EXPECTED_MS = 2600 + holdBufferMs;

      let finished = false;

      function finish() {
        if (finished) return;
        finished = true;

        splashContainer.classList.add("fade-out");

        // splash fade-out 후 목적지로 이동
        setTimeout(() => {
          loadPage(routeName)
            .catch((err) => console.error(`Failed to load ${routeName}:`, err))
            .finally(() => {
              if (pageContainer) pageContainer.style.display = "";
              splashContainer.classList.remove("active", "fade-out");
              splashContainer.innerHTML = "";
            });
        }, postFadeDelayMs);
      }

      // 애니메이션 기반 종료 (없으면 timeout fallback)
      const fallback = setTimeout(finish, EXPECTED_MS);

      function onAnimationEnd(e) {
        if (e.animationName === "midHold") {
          clearTimeout(fallback);
          logo.removeEventListener("animationend", onAnimationEnd);
          finish();
        }
      }

      if (logo) logo.addEventListener("animationend", onAnimationEnd);
      else {
        clearTimeout(fallback);
        finish();
      }
    })
    .catch(() => {
      // 실패 시 유저를 멈춰두지 말고 바로 이동
      if (pageContainer) pageContainer.style.display = "";
      loadPage(routeName);
    });
}

/**
 * Initializes the introduction page.
 * Sets up click listeners for the 'See What's New' and 'Skip' buttons,
 * both of which navigate to the dashboard page.
 */
export function initializeIntro() {
  const seeWhatBtn = document.getElementById("seeWhatBtn");
  const skipBtn = document.getElementById("skipBtn");
  console.log("[INTRO] intro.js loaded");

  const go = (ev) => {
    ev?.preventDefault?.();
    ev?.stopImmediatePropagation?.();
    runMidSplashThen("dashboard");
  };

  if (seeWhatBtn) seeWhatBtn.addEventListener("click", go);
  if (skipBtn) skipBtn.addEventListener("click", go);
}

/*Placeholder Page*/
(function () {
  const EXPLORE_BTN_ID = "exploreBtn";
  const TARGET_ID = "introExplorePage";

  function ready(fn) {
    if (document.readyState !== "loading") fn();
    else document.addEventListener("DOMContentLoaded", fn);
  }

  async function goToExplore() {
    console.log("[INTRO] Start/Skip clicked");
    runMidSplashThen("dashboard");

    // Prefer router if available
    if (typeof window.showPage === "function") {
      window.showPage(TARGET_ID);
      return;
    }
    if (typeof window.loadPage === "function") {
      await window.loadPage(TARGET_ID);
      return;
    }

    // Fallback: manual show/hide (no router)
    const target = document.getElementById(TARGET_ID);
    if (!target) return;
    document.querySelectorAll(".page").forEach((el) => {
      if (el === target) {
        el.removeAttribute("hidden");
        // Force visibility even if global CSS sets `.page { display: none; }`
        el.style.display = "block";
      } else {
        el.setAttribute("hidden", "");
        el.style.display = "none";
      }
    });

    // Update helpers
    try {
      window.currentPageName = TARGET_ID;
    } catch (_) {
      void 0;
    }
    try {
      window.historyStack && window.historyStack.push(TARGET_ID);
    } catch (_) {
      void 0;
    }
    try {
      typeof window.updateBottomNavBar === "function" &&
        window.updateBottomNavBar(TARGET_ID);
    } catch (_) {
      void 0;
    }
  }

  function onExploreClick(ev) {
    ev.preventDefault();
    ev?.stopImmediatePropagation?.();
    runMidSplashThen("dashboard");
  }

  ready(() => {
    const arrowRightBtn = document.querySelector(
      "#introPage .intro-arrow-right",
    );
    const arrowLeftBtn = document.querySelector("#introPage .intro-arrow-left");
    const skipBtn = document.getElementById("skipBtn");

    const introVideo = document.querySelector(
      "#introPage .intro-hero-frame video.intro-hero",
    );

    const introTitle = document.querySelector("#introPage .intro-title");
    const introSub = document.querySelector("#introPage .intro-sub");
    const progressSegs = Array.from(
      document.querySelectorAll("#introPage .intro-progress__seg"),
    );

    let introState = "original"; // original → recommended → pickup
    const progressFills = progressSegs.map((seg) =>
      seg.querySelector(".intro-progress__fill"),
    );

    // 각 세그먼트의 누적 진행률 (0~1)
    const segmentProgress = [0, 0, 0, 0];

    function clamp01(n) {
      if (n < 0) return 0;
      if (n > 1) return 1;
      return n;
    }

    function getStepIndexFromState() {
      return introState === "original"
        ? 0
        : introState === "recommended"
          ? 1
          : introState === "pickup"
            ? 2
            : 3; // quiz
    }

    function renderProgress() {
      if (!progressSegs.length) return;

      const activeIdx = getStepIndexFromState();

      progressSegs.forEach((seg, idx) => {
        // 기존 is-active 의미(이전 단계 포함 “활성화”)는 유지
        seg.classList.toggle("is-active", idx <= activeIdx);

        const fill = progressFills[idx];
        if (!fill) return;

        const pct =
          idx < activeIdx ? 1 : idx === activeIdx ? segmentProgress[idx] : 0;

        fill.style.width = `${pct * 100}%`;
      });
    }

    function setActiveStep(stepIndex) {
      // stepIndex 이전은 완료(100%)
      for (let i = 0; i < stepIndex; i++) segmentProgress[i] = 1;

      // stepIndex부터 뒤는 초기화(0%)
      for (let i = stepIndex; i < segmentProgress.length; i++) {
        segmentProgress[i] = 0;
      }

      renderProgress();
    }

    function updateActiveStepFromVideo() {
      const idx = getStepIndexFromState();

      const duration = introVideo?.duration;
      if (!duration || !isFinite(duration)) return;

      const p = clamp01(introVideo.currentTime / duration);

      // loop 영상에서도 채움이 되돌아가지 않게 최대값 유지
      segmentProgress[idx] = Math.max(segmentProgress[idx], p);

      renderProgress();
    }

    function setSkipBtnPrimary(isPrimary) {
      if (!skipBtn) return;

      if (isPrimary) {
        skipBtn.classList.remove("btn-outline", "intro-outline");
        skipBtn.classList.add("onb-cta", "intro-primary");
        skipBtn.textContent = "Start Exploring";
      } else {
        skipBtn.classList.remove("onb-cta", "intro-primary");
        skipBtn.classList.add("btn-outline", "intro-outline");
        skipBtn.textContent = "Skip and Start";
      }
    }

    function playIntroVideo(src, { loop = true, onEnded = null } = {}) {
      if (!introVideo) return;

      const sourceEl = introVideo.querySelector("source");
      if (sourceEl) sourceEl.setAttribute("src", src);

      introVideo.loop = loop;

      // ended 핸들러는 quiz에서만 쓰고 싶으니, 매번 초기화
      introVideo.onended = null;
      if (typeof onEnded === "function") introVideo.onended = onEnded;

      introVideo.load();
      introVideo.currentTime = 0;
      introVideo.play().catch(() => {});
    }

    const originalTitleNodes = introTitle
      ? Array.from(introTitle.childNodes).map((n) => n.cloneNode(true))
      : [];
    const originalSubNodes = introSub
      ? Array.from(introSub.childNodes).map((n) => n.cloneNode(true))
      : [];

    const recommendedTitleText = "Tailored for You";
    const recommendedSubLines = [
      "On your first visit, we will recommend content",
      "that suits your interests and role",
    ];

    function appendLines(target, lines) {
      const parts = Array.isArray(lines) ? lines : [lines];
      parts.forEach((part, index) => {
        if (index > 0) target.appendChild(document.createElement("br"));
        target.appendChild(document.createTextNode(String(part)));
      });
    }

    function setText(el, text) {
      if (!el) return;
      el.textContent = text;
    }

    function setLines(el, lines) {
      if (!el) return;
      el.textContent = "";
      appendLines(el, lines);
    }

    function restoreNodes(el, nodes) {
      if (!el) return;
      el.textContent = "";
      nodes.forEach((n) => el.appendChild(n.cloneNode(true)));
    }

    function showRecommended() {
      introState = "recommended";
      arrowPopDone.recommended = false;

      setText(introTitle, recommendedTitleText);
      setLines(introSub, recommendedSubLines);

      setSkipBtnPrimary(false);

      playIntroVideo("videos/Intro/GIFRecommended_Comp.mp4", { loop: true });

      arrowRightBtn?.classList.add("intro-arrow--visible");
      arrowLeftBtn?.classList.add("intro-arrow--visible");

      setActiveStep(getStepIndexFromState());
    }

    function showOriginal() {
      introState = "original";
      arrowPopDone.original = false;

      restoreNodes(introTitle, originalTitleNodes);
      restoreNodes(introSub, originalSubNodes);

      setSkipBtnPrimary(false);

      playIntroVideo("videos/Intro/GIFRecommended_Comp.mp4", { loop: true });

      arrowLeftBtn?.classList.remove("intro-arrow--visible");

      setActiveStep(getStepIndexFromState());
    }

    function showPickup() {
      introState = "pickup";
      arrowPopDone.pickup = false;

      setText(introTitle, "Pick Up Anytime");
      setLines(introSub, [
        "We remember what you’ve completed,",
        "making it easy to continue where you left off",
      ]);

      playIntroVideo("videos/Intro/GIFVideo_Comp.mp4", { loop: true });

      arrowRightBtn?.classList.add("intro-arrow--visible");
      arrowLeftBtn?.classList.add("intro-arrow--visible");

      setActiveStep(getStepIndexFromState());
    }

    function showQuiz() {
      introState = "quiz";

      setText(introTitle, "Strengthen Your Learning");
      setLines(introSub, [
        "Follow each lesson with a quick quiz to review",
        "concepts and identify areas to revisit.",
      ]);

      setSkipBtnPrimary(false);

      playIntroVideo("videos/Intro/GIFQuiz_Comp.mp4", {
        loop: false,
        onEnded: () => {
          setSkipBtnPrimary(true);
        },
      });

      // ✅ 마지막 페이지: left만 보여주고 right는 숨김
      arrowLeftBtn?.classList.add("intro-arrow--visible");
      arrowRightBtn?.classList.remove("intro-arrow--visible");

      setActiveStep(getStepIndexFromState());
    }

    function onIntroArrowRight(ev) {
      ev.preventDefault();

      if (introState === "original") {
        showRecommended();
      } else if (introState === "recommended") {
        showPickup();
      } else if (introState === "pickup") {
        showQuiz();
      } else {
        showQuiz();
      }
    }

    function onIntroArrowLeft(ev) {
      ev.preventDefault();

      if (introState === "quiz") {
        showPickup(); // quiz → pickup
      } else if (introState === "pickup") {
        showRecommended(); // pickup → recommended
      } else if (introState === "recommended") {
        showOriginal(); // recommended → original
      } else {
        showOriginal();
      }
    }

    const arrowPopDone = {
      original: false,
      recommended: false,
      pickup: false,
    };

    function restartArrowAnimation(className) {
      if (!arrowRightBtn) return;
      arrowRightBtn.classList.remove(
        "intro-arrow--pop",
        "intro-arrow--pop-appear",
      );
      // reflow로 animation 재시작
      void arrowRightBtn.offsetWidth;
      arrowRightBtn.classList.add(className);
    }

    // --- Intro video: arrow visibility + pop animation ---
    if (introVideo && arrowRightBtn) {
      const SHOW_THRESHOLD = 0.9; // 90%

      introVideo.loop = true;

      introVideo.addEventListener("timeupdate", () => {
        const duration = introVideo.duration;
        if (!duration || !isFinite(duration)) return;

        const progress = introVideo.currentTime / duration;

        // 1) original: 90%에 처음 보이게 + (0 -> 4.7rem -> 원래) 애니메이션
        if (introState === "original") {
          if (progress >= SHOW_THRESHOLD && !arrowPopDone.original) {
            arrowPopDone.original = true;

            arrowRightBtn.classList.add("intro-arrow--visible");
            restartArrowAnimation("intro-arrow--pop-appear");
          }
          return;
        }

        // 2) recommended / pickup: 화살표는 이미 보이지만,
        //    영상이 끝날 때(90%) 1번 (4.7rem -> 원래) 팝 애니메이션
        if (
          (introState === "recommended" || introState === "pickup") &&
          progress >= SHOW_THRESHOLD
        ) {
          if (!arrowPopDone[introState]) {
            arrowPopDone[introState] = true;
            restartArrowAnimation("intro-arrow--pop");
          }
        }
      });
    }

    if (introVideo) {
      introVideo.addEventListener("timeupdate", updateActiveStepFromVideo);
    }

    setActiveStep(getStepIndexFromState());

    function isGuestMode() {
      return localStorage.getItem("guestMode") === "true";
    }

    function ensureGuestButtons() {
      const skipBtn = document.getElementById("skipBtn");
      if (!skipBtn) return;

      // If not guest, strip guest UI if it exists
      if (!isGuestMode()) {
        document.getElementById("createAccountBtn")?.remove();
        document.getElementById("continueAsGuestBtn")?.remove();
        document.getElementById(EXPLORE_BTN_ID)?.remove();
        return;
      }

      // Guest mode: remove Explore button if still around
      document.getElementById(EXPLORE_BTN_ID)?.remove();

      // Don’t duplicate if already inserted
      if (document.getElementById("createAccountBtn")) return;

      // Create Account button
      const createBtn = document.createElement("button");
      createBtn.id = "createAccountBtn";
      createBtn.className = "onb-cta intro-primary";
      createBtn.setAttribute("data-i18n", "intro.create_account_button");
      createBtn.textContent = "Create Account";
      createBtn.addEventListener("click", () => {
        // Optional: keep behaviour consistent with onboarding skip-path
        localStorage.setItem("cameFromSkipPath", "true");
        loadPage("onboarding");
      });

      // Continue as Guest button (same as Explore / > arrow)
      const guestBtn = document.createElement("button");
      guestBtn.id = "continueAsGuestBtn";
      guestBtn.className = "btn-outline intro-outline";
      guestBtn.setAttribute("data-i18n", "intro.continue_as_guest_button");
      guestBtn.textContent = "Continue as Guest";
      guestBtn.addEventListener("click", onExploreClick, { passive: false });

      // Insert both where Explore used to be (before skipBtn)
      skipBtn.parentNode.insertBefore(createBtn, skipBtn);
      skipBtn.parentNode.insertBefore(guestBtn, skipBtn);
    }

    // Run on load
    ensureGuestButtons();

    // Also re-run whenever intro page is shown via router/showPage
    document.addEventListener("page:shown", (e) => {
      if (e?.detail?.id === "introPage") ensureGuestButtons();
    });

    // Intro page: arrows stay on this page and just change content
    if (arrowRightBtn) {
      arrowRightBtn.addEventListener("click", onIntroArrowRight, {
        passive: false,
      });
    }
    if (arrowLeftBtn) {
      arrowLeftBtn.addEventListener("click", onIntroArrowLeft, {
        passive: false,
      });
    }
  });
})();
