/**
 * @fileoverview This file manages the "Eyes" learning module catalog page, including navigation, displaying content cards, handling 'like' functionality, and routing to video sections.
 */

import { loadPage } from "./navigation.js";
import { openMenu } from "./menu.js";
import { readLikes as getLikes, toggleLike } from "./likes.js";
import { EYES_INDEX } from "./catalog-index.js";
import { ROUTES } from "./config.js";

/**
 * Navigates to a specified target page.
 * Prefers `window.showPage` if available (for baseline compatibility), otherwise uses `loadPage`.
 * @param {string} target - The ID or route name of the page to navigate to.
 */
function go(target) {
  if (typeof window.showPage === "function") window.showPage(target);
  else loadPage(target);
}

// Map Eyes card labels to background images (Core, Disease, PEC, Extended, Tools)
const EYES_IMAGE_MAP = {
  // Core Examination
  "History Taking": "images/icon/eyes/core/car_history.webp",
  "Visual Acuity": "images/icon/eyes/core/car_visualacuity.webp",
  Pupils: "images/icon/eyes/core/car_pupils.webp",
  "Front of Eye": "images/icon/eyes/core/car_frontofeye.webp",
  "Fundal Reflex": "images/icon/eyes/core/car_fundalreflex.webp",
  Ophthalmoscopy: "images/icon/eyes/core/car_ophth.webp",
  "Interactive Learning": "images/icon/eyes/core/car_miniapp.webp",

  // Disease
  "Uncorrected Refractive Error": "images/icon/eyes/disease/car_uncor.webp",
  Cataract: "images/icon/eyes/disease/car_cataract.webp",
  Glaucoma: "images/icon/eyes/disease/car_glaucoma.webp",
  "Diabetic Retinopathy": "images/icon/eyes/disease/car_diabetic.webp",
  "Corneal Disease": "images/icon/eyes/disease/car_corneal.webp",
  "Childhood Eye Screening": "images/icon/eyes/disease/car_childhood.png",
  "Retinopathy of Prematurity": "images/icon/eyes/disease/car_rop.png",
  "Retinal Disease": "images/icon/eyes/disease/car_retinal.webp",
  "Optic Nerve Disease": "images/icon/eyes/disease/car_opticnerv.webp",

  // Primary Eye Care (PEC)
  "WHO PEC": "images/icon/eyes/who/car_who.webp",

  // Extended examination
  Ptosis: "images/icon/eyes/extended/car_ptosis.webp",
  Proptosis: "images/icon/eyes/extended/car_proptosis.webp",
  "Eye Movements/Squint": "images/icon/eyes/extended/car_squint.webp",
  "Cranial Nerve Examination": "images/icon/eyes/extended/car_cranial.webp",

  // Tools
  "Arclight Overview": "images/icon/eyes/tools/car_arclight.webp",
  "Holo Overview": "images/icon/eyes/tools/car_holo.webp",
};

/**
 * Authoritative list of baseline video-section IDs shown inside the Videos route.
 * These IDs are used to determine if a card click should navigate to the 'videos' page
 * and then to a specific section within it.
 */
const VIDEO_PAGE_IDS = new Set([
  "learningModules",
  "coreClinicalOphthalmicExamination",
  "diseasesPage",
  "arclightPage",
  "childhoodEyeScreeningPage",
  "howToUseArclightVideoPage",
  "directOphthalmoscopy",
  "anteriorSegmentVideoPage",
  "frontOfEyePage",
  "pupilsPage",
  "rapdTestVideoPage",
  "phoneAttachmentVideoPage",
  "visualAcuityPage",
  "fundalReflexPage",
  "interactiveLearningPage",
  "assessmentVisionPage",
  "normalAbnormalPage",
  "miresPage",
  "morphPage",
  "squintPalsyPage",
  "cataractPage",
]);

/* ---- PUBLIC: called by router on page 'eyes' ---- */
/**
 * Initializes the main "Eyes" page, primarily by calling `initializeEyesCatalog`.
 */
export function initializeEyes() {
  initializeEyesCatalog();

  const root = document; // delegate across the Eyes page

  root.addEventListener("click", async (e) => {
    // Find the clicked Eyes card
    const card = e.target.closest(".eyes-card");
    if (!card) return;

    // Work out what this card targets
    const target =
      card.dataset?.target || card.dataset?.page || card.dataset?.route || "";
    const label = (card.getAttribute("data-label") || "").toLowerCase();

    // Only handle the Pupils card
    if (target !== "pupilsPage" && label !== "pupils") return;

    e.preventDefault();

    // Direct to Pupils without flashing Learning Modules
    // inside the Pupils click handler in eyes.js
    window.__videosPendingTarget = "pupilsPage";
    window.__videosSuppressFlash = true;
    try {
      sessionStorage.setItem("gotoSubPage", "pupilsPage");
    } catch (e) {}

    try {
      sessionStorage.setItem("fromRoute", window.currentPageName || "eyes");
    } catch (e) {}
    await loadPage("videos");

    try {
      const { goToVideosSection } = await import("./videos.js");
      if (typeof goToVideosSection === "function") {
        goToVideosSection("pupilsPage");
      }
    } catch {
      /* ok, sessionStorage fallback will take over */
    }

    // Compress the history so Back goes straight to the previous page (no blank Videos root)
    try {
      const st = {
        ...(history.state || {}),
        page: "videos",
        subpage: "pupilsPage",
      };
      const base = location.pathname + location.search;
      const hash = "#videos/pupilsPage";
      history.replaceState(st, "", base + hash);
    } catch {}
  });
}

/* ---- Baseline-parity initializer (with heart icons) ---- */
/**
 * Initializes the "Eyes" catalog page.
 * Sets up the menu button, renders content cards for various sections (Core Examination, Disease, etc.),
 * handles 'like' functionality for each card, and manages navigation based on card clicks.
 */
export function initializeEyesCatalog() {
  const pageEl = document.getElementById("eyesCatalogPage");
  if (!pageEl) return;

  // menu (baseline parity)
  const menuBtn = pageEl.querySelector(".menuBtn");
  if (menuBtn) {
    menuBtn.addEventListener(
      "click",
      (e) => {
        e.preventDefault();
        openMenu();
      },
      { once: true }
    );
  }

  const sections = {
    coreCarousel: [
      {
        label: "History Taking",
        target: EYES_INDEX["History Taking"],
        tags: ["Coming Soon"],
      },
      {
        label: "Visual Acuity",
        target: EYES_INDEX["Visual Acuity"],
        tags: ["Video"],
      },
      { label: "Pupils", target: "pupilsPage", tags: ["Video"] },
      {
        label: "Front of Eye",
        target: EYES_INDEX["Front of Eye"],
        tags: ["Video", "Case Study"],
      },
      {
        label: "Fundal Reflex",
        target: EYES_INDEX["Fundal Reflex"],
        tags: ["Coming Soon"],
      },
      {
        label: "Ophthalmoscopy",
        target: EYES_INDEX["Ophthalmoscopy"],
        tags: ["Video", "Quiz"],
      },
      {
        label: "Interactive Learning",
        target: EYES_INDEX["Interactive Learning"],
        tags: ["Mini Apps"],
      },
    ],
    diseaseCarousel: [
      {
        label: "Uncorrected Refractive Error",
        target: EYES_INDEX["Uncorrected Refractive Error"],
        tags: ["Coming Soon"],
      },
      { label: "Cataract", target: EYES_INDEX["Cataract"], tags: ["Mini App"] },
      {
        label: "Glaucoma",
        target: EYES_INDEX["Glaucoma"],
        tags: ["Coming Soon"],
      },
      {
        label: "Diabetic Retinopathy",
        target: EYES_INDEX["Diabetic Retinopathy"],
        tags: ["Coming Soon"],
      },
      {
        label: "Corneal Disease",
        target: EYES_INDEX["Corneal Disease"],
        tags: ["Coming Soon"],
      },
      {
        label: "Childhood Eye Screening",
        target: EYES_INDEX["Childhood Eye Screening"],
        tags: ["Video"],
      },
      {
        label: "Retinopathy of Prematurity",
        target: EYES_INDEX["Retinopathy of Prematurity"],
        tags: ["Coming Soon"],
      },
      {
        label: "Retinal Disease",
        target: EYES_INDEX["Retinal Disease"],
        tags: ["Coming Soon"],
      },
      {
        label: "Optic Nerve Disease",
        target: EYES_INDEX["Optic Nerve Disease"],
        tags: ["Coming Soon"],
      },
    ],
    pecCarousel: [
      {
        label: "WHO PEC",
        target: EYES_INDEX["WHO PEC"],
        tags: ["Coming Soon"],
      },
    ],
    extendedCarousel: [
      { label: "Ptosis", target: EYES_INDEX["Ptosis"], tags: ["Coming Soon"] },
      {
        label: "Proptosis",
        target: EYES_INDEX["Proptosis"],
        tags: ["Coming Soon"],
      },
      {
        label: "Eye Movements/Squint",
        target: EYES_INDEX["Eye Movements/Squint"],
        tags: ["Mini App"],
      },
      {
        label: "Cranial Nerve Examination",
        target: EYES_INDEX["Cranial Nerve Examination"],
        tags: ["Coming Soon"],
      },
    ],
    toolsCarousel: [
      {
        label: "Arclight Overview",
        target: EYES_INDEX["Arclight Overview"],
        tags: ["Coming Soon"],
      },
      {
        label: "Holo Overview",
        target: EYES_INDEX["Holo Overview"],
        tags: ["Coming Soon"],
      },
    ],
  };

  // Make Eyes catalog available to other modules (e.g., My Learning)
  window.EYES_SECTIONS = sections;
  window.getAllEyesItems = () => {
    const out = [];
    Object.values(sections).forEach((list) =>
      (list || []).forEach((i) => out.push(i))
    );
    return out;
  };

  /**
   * Navigates to a specific video section. If already on the videos page, it uses `window.showPage`.
   * Otherwise, it constructs a URL to navigate to the videos page with the target section.
   * @param {string} targetId - The ID of the video section to navigate to.
   */
  function goToVideos(targetId) {
    if (!targetId) return;
    const onVideos =
      /\/videos\.html(\?|#|$)/i.test(location.pathname) ||
      /videos\.html/i.test(location.href);
    if (onVideos && typeof window.showPage === "function") {
      window.showPage(targetId); // baseline behavior when already there
    } else {
      location.href = `videos.html#${encodeURIComponent(targetId)}`; // bridge
    }
  }

  // --- Render helper (heart INSIDE the button, baseline-style) ---
  /**
   * Renders a list of items into a specified container as clickable cards with 'like' functionality.
   * @param {string} containerId - The ID of the container element to render items into.
   * @param {Array<Object>} items - An array of item objects, each with `label`, `target`, and optional `tags`.
   */
  // Renders a carousel with disabled states for missing targets
  const render = (containerId, items) => {
    const el = pageEl.querySelector(`#${containerId}`);
    if (!el) return;
    const likes = getLikes();

    // Helper: can this item actually navigate?
    const isNavigable = (target, tags = []) => {
      if (!target || target === "comingSoon") return false;

      // Video sections handled on /videos via goToVideosSection
      if (VIDEO_PAGE_IDS.has(target)) return true;

      // Route-based pages (separate HTML file) must exist in ROUTES
      if (Object.prototype.hasOwnProperty.call(ROUTES, String(target)))
        return true;

      // Otherwise, treat as missing
      return false;
    };

    el.classList.add("eyes-track");

    el.innerHTML = items
      .map((i) => {
        const disabled = !isNavigable(i.target, i.tags);
        const disabledAttrs = disabled
          ? 'aria-disabled="true" tabindex="-1" data-disabled="true"'
          : 'tabindex="0"';

        return `
      <button type="button"
              class="eyes-card ${disabled ? "is-disabled" : ""} ${
          likes.has(i.label) ? "liked" : ""
        }"
              data-target="${i.target}"
              data-label="${i.label}"
              ${disabledAttrs}>
              ${
                EYES_IMAGE_MAP[i.label]
                  ? `<img class="eyes-card__bg" src="${
                      EYES_IMAGE_MAP[i.label]
                    }" alt="${i.label}">`
                  : ""
              }
        <span class="heart-btn" aria-label="Toggle like" title="Like"
              role="button"
              tabindex="0"
              style="pointer-events:auto">
          <svg viewBox="0 0 24 24" aria-hidden="true" style="pointer-events:auto">
            <path style="pointer-events:auto"
                  d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 1 0-7.78 7.78L12 21.23l8.84-8.84a5.5 5.5 0 0 0 0-7.78z"/>
          </svg>
        </span>
        <span class="eyes-card__title">${i.label}</span>
        <div class="tag-row">
          ${
            disabled
              ? `<span class="tag coming-tag">Coming Soon</span>`
              : i.tags?.map((t) => `<span class="tag">${t}</span>`).join("") ||
                ""
          }
        </div>
        </button>
    `;
      })
      .join("");
  };

  Object.entries(sections).forEach(([id, list]) => render(id, list));

  // === Carousel dots per section (like Dashboard) ===
  // For each carousel on the Eyes page, inject a dot strip above "See all >"
  const setupDotsForCarousel = (carouselEl) => {
    if (!carouselEl) return;

    // Find the header just above this carousel (each h2 precedes its carousel)
    const header = carouselEl.previousElementSibling;
    if (!header || !header.classList.contains("catalog-h2")) return;

    // Create (or reuse) the dots container, placed before the "See all >" span
    let dotsWrap = header.querySelector(".carousel-dots");
    if (!dotsWrap) {
      dotsWrap = document.createElement("span");
      dotsWrap.className = "carousel-dots";
      const seeAll = header.querySelector(".see-all");
      header.insertBefore(dotsWrap, seeAll || null);
    }

    // Count how many cards are present in this carousel and (re)build dots
    const cards = Array.from(carouselEl.querySelectorAll(".eyes-card"));
    if (!cards.length) {
      dotsWrap.innerHTML = "";
      return;
    }
    dotsWrap.innerHTML = cards
      .map(
        (_, i) =>
          `<button class="dot" type="button" aria-label="Go to item ${
            i + 1
          }"></button>`
      )
      .join("");
    const dots = Array.from(dotsWrap.querySelectorAll(".dot"));

    // Helpers to compute which card is centered, paint dots, and center a card
    const getActiveIndex = () => {
      const mid = carouselEl.scrollLeft + carouselEl.offsetWidth / 2;
      let best = 0,
        bestDist = Infinity;
      cards.forEach((card, i) => {
        const center = card.offsetLeft + card.offsetWidth / 2;
        const d = Math.abs(center - mid);
        if (d < bestDist) {
          bestDist = d;
          best = i;
        }
      });
      return best;
    };

    const paintDots = (i) => {
      dots.forEach((d, idx) => d.classList.toggle("active", idx === i));
    };

    const centerCardByIndex = (i) => {
      const clamped = Math.max(0, Math.min(i, cards.length - 1));
      const card = cards[clamped];
      const left =
        card.offsetLeft - carouselEl.offsetWidth / 2 + card.offsetWidth / 2;
      carouselEl.scrollTo({ left, behavior: "smooth" });
    };

    // Click any dot to center that item
    dots.forEach((dot, i) =>
      dot.addEventListener("click", () => centerCardByIndex(i))
    );

    // Sync the active dot while scrolling (throttled with rAF)
    let rafId = null;
    const onScroll = () => {
      if (rafId) return;
      rafId = requestAnimationFrame(() => {
        rafId = null;
        paintDots(getActiveIndex());
      });
    };
    carouselEl.addEventListener("scroll", onScroll, { passive: true });

    // Initial sync once layout has settled
    requestAnimationFrame(() => paintDots(getActiveIndex()));
  };

  // Apply to every Eyes carousel section
  pageEl
    .querySelectorAll(".eyes-carousel, .eyes-track")
    .forEach((carouselEl) => setupDotsForCarousel(carouselEl));

  // Enforce pointer-events on heart & its children (override any CSS without touching style.css)
  pageEl.querySelectorAll(".heart-btn, .heart-btn *").forEach((n) => {
    try {
      n.style.pointerEvents = "auto";
    } catch {}
  });

  /**
   * Consumes an event to prevent default behavior and stop propagation.
   * @param {Event} e - The event object.
   */
  const consume = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (typeof e.stopImmediatePropagation === "function")
      e.stopImmediatePropagation();
  };

  /**
   * Handles the toggling of a 'like' state for a module card.
   * Updates the card's visual state and persists the like status.
   * @param {Event} e - The event object from the heart button click/keydown.
   */
  const onHeartToggle = (e) => {
    consume(e);
    const heart = e.currentTarget; // .heart-btn
    const card = heart.closest(".eyes-card");
    const label = card?.getAttribute("data-label");
    if (!label) return;
    const likes = toggleLike(label);
    card.classList.toggle("liked", likes.has(String(label)));
  };

  // click + pointerdown (prevents iOS ghost-click) + keyboard
  pageEl.querySelectorAll(".heart-btn").forEach((hb) => {
    hb.addEventListener("pointerdown", consume, { capture: true });
    hb.addEventListener("click", onHeartToggle, { capture: true });
    hb.addEventListener("keydown", (e) => {
      if (e.key === "Enter" || e.key === " ") onHeartToggle(e);
    });
  });

  // Delegated handler for card navigation
  pageEl.addEventListener(
    "click",
    async (e) => {
      const card = e.target.closest?.(".eyes-card");
      if (!card) return;

      // If disabled, do nothing
      if (
        card.getAttribute("aria-disabled") === "true" ||
        card.dataset.disabled === "true"
      ) {
        e.preventDefault();
        e.stopPropagation();
        return;
      }

      // define target correctly from dataset
      const target =
        card.dataset?.target || card.dataset?.route || card.dataset?.page || "";

      const label = (card.getAttribute("data-label") || "").toLowerCase();

      e.preventDefault();

      // Direct-open Pupils
      if (target === "pupilsPage" || label === "pupils") {
        try {
          window.__videosPendingTarget = "pupilsPage";
          window.__videosSuppressFlash = true;
          // Fallback for older code paths:
          sessionStorage.setItem("gotoSubPage", "pupilsPage");
        } catch {}
        await loadPage("videos");

        try {
          const { goToVideosSection } = await import("./videos.js");
          if (typeof goToVideosSection === "function") {
            goToVideosSection("pupilsPage", { skipDefault: true }); // show the Pupils section
          } else {
            sessionStorage.setItem("gotoSubPage", "pupilsPage"); // fallback used by main.js
          }
        } catch {
          sessionStorage.setItem("gotoSubPage", "pupilsPage"); // fallback
        }
        return;
      }

      // Other video sections
      if (VIDEO_PAGE_IDS.has(target)) {
        try {
          window.__videosPendingTarget = target;
          window.__videosSuppressFlash = true;
          sessionStorage.setItem("gotoSubPage", target);
        } catch {}
        await loadPage("videos");

        try {
          const { goToVideosSection } = await import("./videos.js");
          if (typeof goToVideosSection === "function") {
            goToVideosSection(target, { skipDefault: true });
          } else {
            sessionStorage.setItem("gotoSubPage", target);
          }
        } catch {
          sessionStorage.setItem("gotoSubPage", target);
        }
        return;
      }

      // Non-video targets
      go(target);
    },
    { passive: false }
  );
}
