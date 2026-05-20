/**
 * @fileoverview Core client-side logic for the Arclight app. Handles global initialization, navigation, splash screen flow, and dynamic page loading.
 */

import {
  loadPage,
  initializePageNavigation,
  wireGlobalNavigation,
  getRouteFromHash,
} from "./navigation.js";
import { initializeMenu, closeMenu, openMenu } from "./menu.js";
import { initializePWA } from "./pwa.js";
import { initializeVideoPlayers, initializeToolbar } from "./videoplayer.js";
import { initializeLocation } from "./location-service.js";
import { initializeExperimentalMiniAppNotice } from "./experimentalMiniAppNotice.js";
import {
  initializeFundalReflexPdf,
  initializeAtomsHandout1,
  initializeAtomsHandout2,
} from "./fundalReflexPdf.js";
import { initializeGlaucomaQuizCaseStudy } from "./glaucomaQuizCaseStudy.js";
import { captureClientError, installSafeConsole } from "./safe-logging.js";
import { buildTelemetryRequestHeaders } from "./telemetry.js";

installSafeConsole();

function withSentry(fn) {
  return (...args) => {
    try {
      return fn(...args);
    } catch (err) {
      captureClientError("[app] uncaught error in handler", err);
      throw err; // rethrow so normal behaviour stays the same
    }
  };
}

// --- Onboarding Persistence ---
const ONBOARDING_DONE_KEY = "arclight:onboarded";

function markOnboardingDone() {
  try {
    localStorage.setItem(ONBOARDING_DONE_KEY, "1");
  } catch (e) {
    console.warn("Failed to persist onboarding state", e);
  }
}

function isOnboardingDone() {
  try {
    return localStorage.getItem(ONBOARDING_DONE_KEY) === "1";
  } catch {
    return false;
  }
}

function resolveInitialRoute(onboarded) {
  const deepLink = getRouteFromHash();
  if (deepLink?.routeName) {
    return {
      ...deepLink,
      isDeepLink: true,
    };
  }

  return {
    routeName: onboarded ? "dashboard" : "languageinstall",
    subPageId: null,
    isDeepLink: false,
  };
}

function shouldSkipSplashForInitialRoute(initialRoute) {
  if (initialRoute?.isDeepLink) return true;
  if (typeof window === "undefined") return false;
  try {
    return window.matchMedia?.("(prefers-reduced-motion: reduce)")?.matches;
  } catch {
    return false;
  }
}
// --- End Onboarding Persistence ---

// === App bootstrap ===
/**
 * Initializes global systems and sets up event listeners for page loading.
 * This function runs once the DOM is fully loaded.
 */
document.addEventListener("DOMContentLoaded", () => {
  // Init global systems once
  initializeLocation().catch((e) => console.warn("[geo] init failed", e));
  initializeMenu();
  initializeExperimentalMiniAppNotice();

  document.addEventListener("click", (e) => {
    const btn = e.target.closest(".menuBtn");
    if (!btn) return;
    e.preventDefault();
    openMenu();
  });

  initializePageNavigation();
  initializePWA();
  // Keep workshop "Next >" flow available even on direct deep links.
  void import("./childhoodWorkshopNextFlow.js")
    .then((m) => m.initializeChildhoodWorkshopNextFlowInfra?.())
    .catch(() => {});
  void import("./glaucomaWorkshopNextFlow.js")
    .then((m) => m.initializeGlaucomaWorkshopNextFlowInfra?.())
    .catch(() => {});
  void import("./diabeticWorkshopNextFlow.js")
    .then((m) => m.initializeDiabeticWorkshopNextFlowInfra?.())
    .catch(() => {});

  /**
   * Event listener for 'page:loaded' custom event.
   * Dynamically imports and initializes page-specific JavaScript based on the route name.
   * @param {CustomEvent} e - The custom 'page:loaded' event.
   */
  window.addEventListener("page:loaded", async (e) => {
    const routeName = e?.detail?.routeName;
    if (routeName === "eyes") {
      const { initializeEyes } = await import("./eyes.js");
      initializeEyes?.(); // calls initializeEyesCatalog()
      return;
    }

    if (routeName === "mylearning") {
      const { initializeMyLearning } = await import("./mylearning.js");
      initializeMyLearning?.();
      return;
    }

    if (routeName === "videos") {
      const { initializeVideos } = await import("./videos.js");
      const { initializeDiabeticDemoQuizzes } =
        await import("./diabeticRetinopathyWorkshop.js");
      initializeDiabeticDemoQuizzes?.();
      initializeVideos?.();
      const { initializeGlaucomaWorkshopNextFlowInfra } =
        await import("./glaucomaWorkshopNextFlow.js");
      initializeGlaucomaWorkshopNextFlowInfra?.();
      const { initializeDiabeticWorkshopNextFlowInfra } =
        await import("./diabeticWorkshopNextFlow.js");
      initializeDiabeticWorkshopNextFlowInfra?.();
      const { initializeChildhoodWorkshopNextFlowInfra } =
        await import("./childhoodWorkshopNextFlow.js");
      initializeChildhoodWorkshopNextFlowInfra?.();

      // Also (re)attach toolbar + video listeners now that the fragment is in the DOM
      initializeToolbar();
      initializeVideoPlayers();
      return;
    }

    if (routeName === "childhoodEyeScreeningWorkshop") {
      const { initializeChildhoodEyeScreeningWorkshop } =
        await import("./childhoodEyeScreeningWorkshop.js");
      initializeChildhoodEyeScreeningWorkshop?.();
      return;
    }

    if (routeName === "glaucomaWorkshop") {
      const { initializeGlaucomaWorkshop } =
        await import("./glaucomaWorkshop.js");
      initializeGlaucomaWorkshop?.();
      return;
    }

    if (routeName === "diabeticRetinopathyWorkshop") {
      const { initializeDiabeticRetinopathyWorkshop } =
        await import("./diabeticRetinopathyWorkshop.js");
      initializeDiabeticRetinopathyWorkshop?.();
      const { initializeDiabeticWorkshopNextFlowInfra } =
        await import("./diabeticWorkshopNextFlow.js");
      initializeDiabeticWorkshopNextFlowInfra?.();
      return;
    }

    if (routeName === "glaucomaScrollImages") {
      const { initializeGlaucomaWorkshopProgressInfra } =
        await import("./glaucomaWorkshopProgress.js");
      initializeGlaucomaWorkshopProgressInfra?.();
      const { initializeGlaucomaWorkshopNextFlowInfra } =
        await import("./glaucomaWorkshopNextFlow.js");
      initializeGlaucomaWorkshopNextFlowInfra?.();
      return;
    }

    if (routeName === "glaucomaQuizCaseStudy") {
      const { initializeGlaucomaWorkshopNextFlowInfra } =
        await import("./glaucomaWorkshopNextFlow.js");
      initializeGlaucomaWorkshopNextFlowInfra?.();
      initializeGlaucomaQuizCaseStudy();
    }

    if (routeName === "glaucomaHistoryCaseStudy") {
      const { initializeGlaucomaWorkshopNextFlowInfra } =
        await import("./glaucomaWorkshopNextFlow.js");
      initializeGlaucomaWorkshopNextFlowInfra?.();
      const { initializeGlaucomaHistoryCaseStudy } =
        await import("./glaucomaHistoryCaseStudy.js");
      initializeGlaucomaHistoryCaseStudy();
      return;
    }

    if (routeName === "fundalReflexPdf") {
      initializeFundalReflexPdf();
      return;
    }

    if (routeName === "atomsHandout1") {
      initializeAtomsHandout1();
      return;
    }

    if (routeName === "atomsHandout2") {
      initializeAtomsHandout2();
      return;
    }

    // navigation.js 내부 혹은 관련 로직 위치
    if (routeName === "visualImpairment") {
      const { initializeVisualImpairment } =
        await import("./visualImpairment.js");
      const { initializeChildhoodScrollyPages } =
        await import("./childhoodScrolly.js");
      initializeVisualImpairment();
      initializeChildhoodScrollyPages();
    }

    if (routeName === "casestudy") {
      const { initializeCaseStudy } = await import("./casestudy.js");
      //const { initializeCaseStudyAdvanced } =
      //await import("./casestudy_advanced.js");

      const { initializeCaseStudyPrimary } =
        await import("./casestudy_primary.js");
      initializeCaseStudyPrimary();

      initializeCaseStudy(); // intermediate (기존)
      //initializeCaseStudyAdvanced(); // advanced (복사본)
      return;
    }

    if (
      routeName === "visualsystemeyesbrain" ||
      routeName === "childhoodEyeBrainImages" ||
      routeName === "childhoodIntroVisualDevelopmentPage" ||
      routeName === "childhoodNormalVisualDevelopmentPage" ||
      routeName === "childhoodAskQuestionsObservePage"
    ) {
      const { initializeVisualSystemEyesBrain } =
        await import("./visualsystemeyesbrain.js");
      const { initializeChildhoodScrollyPages } =
        await import("./childhoodScrolly.js");
      initializeVisualSystemEyesBrain?.();
      initializeChildhoodScrollyPages();
      return;
    }

    if (routeName === "childhoodRefer") {
      const { initializeChildhoodScrollyPages } =
        await import("./childhoodScrolly.js");
      initializeChildhoodScrollyPages();
      return;
    }

    const FUNDAL_REFLEX_SCROLL_ROUTES = new Set([
      "childhoodFundalPreparation",
      "childhoodFundalExamination",
      "childhoodFundalNewbornEyesOpen",
      "childhoodFundalNewbornEyesClosed",
      "childhoodFundalUnclearFindings",
      "childhoodFundalPossibleFinding",
      "childhoodFundalAfterExamination",
      "diabeticObservationFundalReflex",
      "diabeticPositioningFlightPath",
      "diabeticHowToExamine",
      "diabeticBioPreparation",
      "diabeticBioFundoscopySitting",
      "diabeticBioFundoscopyIndentation",
    ]);
    if (FUNDAL_REFLEX_SCROLL_ROUTES.has(routeName)) {
      const { initializeChildhoodFundalReflexScrollPage } =
        await import("./childhoodFundalPreparation.js");
      initializeChildhoodFundalReflexScrollPage?.(routeName);
      return;
    }

    if (routeName === "childhoodAssessment") {
      const { initializeChildhoodWorkshopNextFlowInfra } =
        await import("./childhoodWorkshopNextFlow.js");
      initializeChildhoodWorkshopNextFlowInfra?.();
      const { initializeChildhoodAssessment } =
        await import("./childhoodAssessment.js");
      initializeChildhoodAssessment?.();
      return;
    }

    if (routeName === "behavioursquiz") {
      const { initializeChildhoodWorkshopNextFlowInfra } =
        await import("./childhoodWorkshopNextFlow.js");
      initializeChildhoodWorkshopNextFlowInfra?.();
      const { initializeBehavioursQuiz } = await import("./behavioursquiz.js");
      initializeBehavioursQuiz?.();
      return;
    }
  });
});
// childhoodEyeScreeningWorkshop route init
window.addEventListener("page:loaded", async (e) => {
  const routeName = e?.detail?.routeName;
  if (routeName !== "childhoodEyeScreeningWorkshop") return;

  const { initializeChildhoodEyeScreeningWorkshop } =
    await import("./childhoodEyeScreeningWorkshop.js");
  initializeChildhoodEyeScreeningWorkshop?.();
});

/**
 * Another event listener for 'page:loaded' custom event, specifically for the 'liked' route.
 * Dynamically imports and initializes the 'My Learning' page.
 * @param {CustomEvent} e - The custom 'page:loaded' event.
 */
window.addEventListener("page:loaded", async (e) => {
  const routeName = e?.detail?.routeName;
  if (routeName === "mylearning" || routeName === "liked") {
    // support both names
    const { initializeMyLearning } = await import("./mylearning.js");
    initializeMyLearning?.();
  }
});

window.addEventListener("load", () => {
  fetch("/track", {
    method: "POST",
    credentials: "same-origin",
    headers: buildTelemetryRequestHeaders({
      "Content-Type": "application/json",
    }),
    body: JSON.stringify({ event: "pageview" }),
  }).catch((e) => captureClientError("track error", e));
});

document.addEventListener("DOMContentLoaded", () => {
  wireGlobalNavigation();

  const splashContainer = document.getElementById("splashScreenContainer");
  const pageContainer = document.getElementById("page-content");
  const onboarded = isOnboardingDone();
  const initialRoute = resolveInitialRoute(onboarded);
  const skipSplash = shouldSkipSplashForInitialRoute(initialRoute);

  // splash 컨테이너가 없으면 바로 fallback
  if (!splashContainer || skipSplash) {
    if (splashContainer) {
      splashContainer.classList.remove("active", "fade-out");
      splashContainer.innerHTML = "";
      splashContainer.setAttribute("aria-hidden", "true");
    }
    loadPage(initialRoute.routeName, {
      replace: true,
      subPageId: initialRoute.subPageId,
    });
    return;
  }

  const useMidSplash = onboarded;
  const splashUrl = useMidSplash
    ? "html/splashscreen_mid.html"
    : "html/splashscreen.html";

  fetch(splashUrl)
    .then((response) => response.text())
    .then((html) => {
      splashContainer.innerHTML = html;

      // IMPORTANT: hide app content while splash is active to prevent CLS being
      // attributed to <body> from the underlying route injection.
      if (pageContainer) pageContainer.style.display = "none";

      splashContainer.classList.add("active");

      const logo =
        splashContainer.querySelector(".logo-one.mid-only") ||
        splashContainer.querySelector(".logo-one");
      const splashAnimationTarget = useMidSplash
        ? logo
        : splashContainer.querySelector(".logo-one-wrap") || logo;

      // Keep splash bounded so slower devices and shared links are not delayed.
      const MAX_MAIN_WAIT_MS = 4700 + 300;
      const MID_EXPECTED_MS = 2600 + 250;
      let finished = false;

      const fallback = setTimeout(
        () => {
          done();
        },
        useMidSplash ? MID_EXPECTED_MS : MAX_MAIN_WAIT_MS,
      );

      function done() {
        if (finished) return;
        finished = true;
        clearTimeout(fallback);

        splashContainer.classList.add("fade-out");

        const nextRoute = initialRoute.routeName;

        loadPage(nextRoute, {
          replace: true,
          subPageId: initialRoute.subPageId,
        })
          .catch((err) => {
            captureClientError(`Failed to load ${nextRoute} route:`, err);
          })
          .finally(() => {
            // Reveal app content now that the route is in place
            if (pageContainer) pageContainer.style.display = "";

            requestAnimationFrame(() => {
              splashContainer.classList.remove("active");
              setTimeout(() => {
                // ✅ remove 하지 말고 비워두기만
                splashContainer.classList.remove(
                  "splash-full-screen",
                  "fade-out",
                );
                splashContainer.innerHTML = "";
                // (선택) 접근성/클릭 차단 방지용
                splashContainer.setAttribute("aria-hidden", "true");
              }, 300);
            });
          });
      }

      if (splashAnimationTarget) {
        splashAnimationTarget.addEventListener("animationend", (e) => {
          if (useMidSplash) {
            if (
              e.animationName !== "midHold" &&
              e.animationName !== "spinPause"
            ) {
              return;
            }
            done();
            return;
          }

          if (
            e.animationName !== "shiftRight" &&
            e.animationName !== "shiftRightDesktop"
          ) {
            return;
          }

          done();
        });
      } else {
        done();
      }
    })
    .catch((error) => {
      captureClientError("Failed to load splash:", error);
      loadPage(initialRoute.routeName, {
        replace: true,
        subPageId: initialRoute.subPageId,
      });
      if (pageContainer) pageContainer.style.display = "";
    });
});

const routeName =
  document.body?.dataset?.route ||
  (location.pathname.split("/").pop() || "index.html").replace(
    /\.html$/i,
    "",
  ) ||
  "index";

// === Per-route initializers ===
/**
 * Global event listener for 'page:loaded' custom event.
 * Closes the menu on navigation and dynamically imports and initializes
 * page-specific JavaScript based on the loaded page's route name.
 * @param {CustomEvent} e - The custom 'page:loaded' event.
 */
window.addEventListener("page:loaded", async (e) => {
  // Always close the overlay menu on navigation (baseline behavior)
  try {
    closeMenu();
  } catch {}

  const page = e.detail?.routeName;

  if (page === "languageinstall") {
    const { initializeLanguageInstall } = await import("./languageinstall.js");
    initializeLanguageInstall?.();
    return;
  }

  if (page === "onboarding") {
    const { initializeOnboarding } = await import("./onboarding.js");
    initializeOnboarding?.();

    // Add event listeners to mark onboarding as done when buttons are clicked
    const completeBtn = document.getElementById("completeOnboardingBtn");
    const skipBtn = document.getElementById("skipContinueBtn");

    const onFinishOnboarding = () => {
      markOnboardingDone();
    };

    if (completeBtn) {
      completeBtn.addEventListener("click", onFinishOnboarding);
    }
    if (skipBtn) {
      skipBtn.addEventListener("click", onFinishOnboarding);
    }

    return;
  }

  if (page === "interest") {
    const { initializeInterest } = await import("./interest.js");
    initializeInterest?.();
    return;
  }

  if (page === "intro") {
    const { initializeIntro } = await import("./intro.js");
    initializeIntro?.();
    return;
  }

  if (page === "dashboard") {
    const { initializeDashboard } = await import("./dashboard.js");
    initializeDashboard?.();
    return;
  }

  if (page === "eyes") {
    const { initializeEyes } = await import("./eyes.js");
    initializeEyes?.();
    return;
  }

  if (page === "offline") {
    const { initializeOffline } = await import("./offline.js");
    initializeOffline?.();
    return;
  }

  if (routeName === "mylearning") {
    const { initializeMyLearning } = await import("./mylearning.js");
    initializeMyLearning?.();
    return;
  }
});

/**
 * Event listener for 'page:loaded' custom event, specifically for the 'atomsCardPage'.
 * Dynamically imports and initializes the Atoms Card module.
 * @param {CustomEvent} e - The custom 'page:loaded' event.
 */
window.addEventListener("page:loaded", async (e) => {
  const routeName = e?.detail?.routeName;
  if (routeName === "atomscard") {
    const { initializeAtomsCard } = await import("./atomscard.js");
    initializeAtomsCard?.();
  }
});

window.addEventListener("page:loaded", async (e) => {
  const routeName = e?.detail?.routeName;

  if (routeName === "ears") {
    const { initializeEars } = await import("./ears.js");
    initializeEars?.();
  }
});

// ---- Sentry: navigation + context wiring ----
if (window.Sentry) {
  // Basic app tag so you can filter in Sentry
  Sentry.setTag("app", "arclight-browser");
}

// Whenever a route is loaded via your router, log it as breadcrumb + tag
window.addEventListener("page:loaded", (e) => {
  const routeName = e?.detail?.routeName || "unknown";
  if (!window.Sentry) return;

  Sentry.setTag("route", routeName);
  Sentry.addBreadcrumb({
    category: "navigation",
    message: `Route loaded: ${routeName}`,
    level: "info",
    data: { routeName },
  });
});

function initializePupilsMenu() {
  const root = document.getElementById("pupilsPage");
  if (!root || root.dataset.menuWired === "1") return;

  const menuBtn = root.querySelector(".menuBtn");
  if (menuBtn) {
    menuBtn.addEventListener("click", async (e) => {
      e.preventDefault();
      try {
        await initializeMenu(); // ensure #menuOverlay exists (fetch+append)
        openMenu(); // then show it
      } catch (err) {
        captureClientError("[pupils] openMenu failed:", err);
      }
    });
    root.dataset.menuWired = "1";
  }
}

document.addEventListener("DOMContentLoaded", initializePupilsMenu);

(function () {
  const IMAGES_BASE = "images/";
  const PREFIX = "car_";
  const EXT = ".webp";

  // Find the Eyes page container (covers a few common IDs), else fall back to document
  const eyesRoot =
    document.getElementById("eyesCatalogPage") ||
    document.getElementById("eyesPage") ||
    document.getElementById("eyes") ||
    document;

  const cards = eyesRoot.querySelectorAll(
    "[data-card-id], [data-key], [data-image-name], .eyes-card, .card",
  );

  function normalizeName(s) {
    return (s || "")
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "") // strip spaces, hyphens, etc.
      .trim();
  }

  function deriveNameFromTitle(card) {
    // Try a few common title locations
    const titleEl =
      card.querySelector("[data-title]") ||
      card.querySelector(".card-title") ||
      card.querySelector("h1, h2, h3, h4, h5, h6");

    return titleEl ? titleEl.textContent : "";
  }

  function chosenBaseName(card) {
    // 1) explicit override
    const explicit = card.getAttribute("data-image-name");
    if (explicit) {
      // allow either a raw base like "pupils" or full like "car_pupils.webp"
      const hasPrefix = explicit.startsWith(PREFIX);
      const hasExt = explicit.toLowerCase().endsWith(EXT);
      if (hasPrefix && hasExt) return explicit; // already full filename
      const base = hasPrefix ? explicit.slice(PREFIX.length) : explicit;
      const normalized = normalizeName(
        base.replace(new RegExp(EXT + "$", "i"), ""),
      );
      return PREFIX + normalized + EXT;
    }

    // 2) data-card-id / data-key
    const keyish =
      card.getAttribute("data-card-id") || card.getAttribute("data-key");
    if (keyish) return PREFIX + normalizeName(keyish) + EXT;

    // 3) fallback to visible title text
    const title = deriveNameFromTitle(card);
    return PREFIX + normalizeName(title) + EXT;
  }

  function applyImage(card, filename) {
    const fullPath = IMAGES_BASE + filename;

    // Prefer dedicated <img>
    const imgEl = card.querySelector("[data-card-img], .card-img, img");
    if (imgEl && imgEl.tagName === "IMG") {
      imgEl.setAttribute("src", fullPath);
      imgEl.setAttribute(
        "alt",
        imgEl.getAttribute("alt") ||
          filename.replace(/^car_/, "").replace(/\.webp$/i, ""),
      );
      return;
    }

    // Then a thumbnail div
    const thumbEl = card.querySelector(".card-thumb, [data-thumb]");
    if (thumbEl) {
      thumbEl.style.backgroundImage = `url("${fullPath}")`;
      thumbEl.style.backgroundSize = thumbEl.style.backgroundSize || "cover";
      thumbEl.style.backgroundPosition =
        thumbEl.style.backgroundPosition || "center";
      thumbEl.style.backgroundRepeat = "no-repeat";
      return;
    }

    // Finally, set on the card itself
    card.style.backgroundImage = `url("${fullPath}")`;
    card.style.backgroundSize = card.style.backgroundSize || "cover";
    card.style.backgroundPosition = card.style.backgroundPosition || "center";
    card.style.backgroundRepeat = "no-repeat";
  }

  function processCards() {
    cards.forEach((card) => {
      const filename = chosenBaseName(card);
      // Only touch cards that resolve to a "car_*.webp"
      if (!/^car_[a-z0-9]+\.webp$/i.test(filename)) return;
      applyImage(card, filename);
    });
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", processCards);
  } else {
    processCards();
  }
})();
