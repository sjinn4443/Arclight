/**
 * @fileoverview This file contains intro related functions and logic, handling navigation to the dashboard when either the "See What's New" or "Skip" buttons are clicked.
 */

import { loadPage } from "./navigation.js";

/**
 * Initializes the introduction page.
 * Sets up click listeners for the 'See What's New' and 'Skip' buttons,
 * both of which navigate to the dashboard page.
 */
export function initializeIntro() {
  const seeWhatBtn = document.getElementById("seeWhatBtn");
  const skipBtn = document.getElementById("skipBtn");

  const go = () => loadPage("dashboard"); // pre-split behavior: both go to dashboard

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
    goToExplore();
  }

  ready(() => {
    const arrowRightBtn = document.querySelector(
      "#introPage .intro-arrow-right",
    );
    const arrowLeftBtn = document.querySelector("#introPage .intro-arrow-left");

    const introVideo = document.querySelector(
      "#introPage .intro-hero-frame video.intro-hero",
    );

    const introTitle = document.querySelector("#introPage .intro-title");
    const introSub = document.querySelector("#introPage .intro-sub");
    const progressFill = document.querySelector(
      "#introPage .intro-progress__fill",
    );

    let introState = "original"; // original → recommended → pickup

    // 원래 텍스트 저장
    const originalTitleHTML = introTitle?.innerHTML ?? "";
    const originalSubHTML = introSub?.innerHTML ?? "";

    // 추천 상태 텍스트
    const recommendedTitleHTML = "Recommended contents";
    const recommendedSubHTML =
      "On your first visit, we will recommend contents<br />tailored to your interests and role";

    // 상태 전환 함수들
    function showRecommended() {
      introState = "recommended";

      if (introTitle) introTitle.innerHTML = recommendedTitleHTML;
      if (introSub) introSub.innerHTML = recommendedSubHTML;

      // 오른쪽/왼쪽 화살표 모두 보이게
      arrowRightBtn?.classList.add("intro-arrow--visible");
      arrowLeftBtn?.classList.add("intro-arrow--visible");

      updateProgress();
    }

    function showOriginal() {
      introState = "original";

      if (introTitle) introTitle.innerHTML = originalTitleHTML;
      if (introSub) introSub.innerHTML = originalSubHTML;

      // “뒤로” 상태로 돌아왔으니 왼쪽 화살표는 다시 숨김
      arrowLeftBtn?.classList.remove("intro-arrow--visible");
      // 오른쪽 화살표는 계속 남겨 두면, 다시 추천 상태로 갈 수 있음

      updateProgress();
    }

    function showPickup() {
      introState = "pickup";

      if (introTitle) introTitle.innerHTML = "Pick Up Anytime";
      if (introSub)
        introSub.innerHTML =
          "We remember what you’ve completed,<br /> making it easy to continue whenever you come back.";

      // 영상 변경
      const sourceEl = introVideo.querySelector("source");
      sourceEl.setAttribute("src", "videos/Intro/GIFVideo_Comp.mp4");
      introVideo.load();
      introVideo.play().catch(() => {});

      // 화살표 둘 다 계속 보임
      arrowRightBtn?.classList.add("intro-arrow--visible");
      arrowLeftBtn?.classList.add("intro-arrow--visible");

      updateProgress();
    }

    function showQuiz() {
      introState = "quiz";

      if (introTitle) introTitle.innerHTML = "Strengthen your learning";
      if (introSub)
        introSub.innerHTML =
          "Follow each lesson with a quick quiz to review <br />key concepts and identify areas to revisit.";

      // 비디오 변경
      const sourceEl = introVideo.querySelector("source");
      sourceEl.setAttribute("src", "videos/Intro/GIFQuiz_Comp.mp4");
      introVideo.load();
      introVideo.play().catch(() => {});

      // 화살표 둘 다 유지
      arrowRightBtn?.classList.add("intro-arrow--visible");
      arrowLeftBtn?.classList.add("intro-arrow--visible");

      updateProgress();
    }

    function updateProgress() {
      if (!progressFill) return;

      if (introState === "original") {
        progressFill.style.width = "12%";
      } else if (introState === "recommended") {
        progressFill.style.width = "33%";
      } else if (introState === "pickup") {
        progressFill.style.width = "66%";
      } else if (introState === "quiz") {
        progressFill.style.width = "100%";
      }
    }

    function onIntroArrowRight(ev) {
      ev.preventDefault();

      if (introState === "original") {
        showRecommended(); // 1번째 클릭
      } else if (introState === "recommended") {
        showPickup(); // 2번째 클릭
      } else if (introState === "pickup") {
        showQuiz(); // ★ 3번째 클릭 → 새 슬라이드
      } else {
        // quiz에서는 또 누르면 quiz 유지
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

    // --- Intro video: show right arrow after ~90% of first play ---
    if (introVideo && arrowRightBtn) {
      let hasShownArrow = false;
      const SHOW_THRESHOLD = 0.9; // 90%

      // 혹시라도 loop가 안 켜져 있으면 켜두기 (한 번만 설정)
      introVideo.loop = true;

      introVideo.addEventListener("timeupdate", () => {
        if (hasShownArrow) return;

        const duration = introVideo.duration;
        if (!duration || !isFinite(duration)) return; // 아직 길이 모르면 패스

        const progress = introVideo.currentTime / duration;

        if (progress >= SHOW_THRESHOLD) {
          hasShownArrow = true;
          // 오른쪽 화살표만 먼저 등장
          arrowRightBtn.classList.add("intro-arrow--visible");
          // 왼쪽은 계속 숨김 (오른쪽 클릭하면 우리가 따로 켜줄 거야)
        }
      });
    }

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
