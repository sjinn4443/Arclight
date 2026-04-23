/**
 * @fileoverview This file manages the "Eyes" learning module catalog page, including navigation, displaying content cards, handling 'like' functionality, and routing to video sections.
 */

import { loadPage, syncRouteHash } from "./navigation.js";
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
  "Childhood Eye Screening": "images/icon/eyes/disease/car_childhood.webp",
  "Retinopathy of Prematurity": "images/icon/eyes/disease/car_rop.webp",
  "Retinal Disease": "images/icon/eyes/disease/car_retinal.webp",
  "Optic Nerve Disease": "images/icon/eyes/disease/car_opticnerv.webp",

  // Primary Eye Care (PEC)
  // Primary Eye Care (PEC)
  "WHO PEC": "images/icon/eyes/workshop/car_who.webp",

  // Extended examination
  Ptosis: "images/icon/eyes/extended/car_ptosis.webp",
  Proptosis: "images/icon/eyes/extended/car_proptosis.webp",
  "Eye Movements/Squint": "images/icon/eyes/extended/car_squint.webp",
  "Cranial Nerve Examination": "images/icon/eyes/extended/car_cranial.webp",

  // Tools and Kits
  "Arclight Overview": "images/icon/eyes/tools/car_arclight.webp",
  "Holo Overview": "images/icon/eyes/tools/car_holo.webp",
};

const EYES_LABEL_I18N_KEYS = Object.freeze({
  "History Taking": "eyes.card_label.history_taking",
  "Visual Acuity": "eyes.card_label.visual_acuity",
  Pupils: "eyes.card_label.pupils",
  "Front of Eye": "eyes.card_label.front_of_eye",
  "Fundal Reflex": "eyes.card_label.fundal_reflex",
  Ophthalmoscopy: "eyes.card_label.ophthalmoscopy",
  "Interactive Learning": "eyes.card_label.interactive_learning",
  "Uncorrected Refractive Error":
    "eyes.card_label.uncorrected_refractive_error",
  Cataract: "eyes.card_label.cataract",
  Glaucoma: "eyes.card_label.glaucoma",
  "Diabetic Retinopathy": "eyes.card_label.diabetic_retinopathy",
  "Corneal Disease": "eyes.card_label.corneal_disease",
  "Childhood Eye Screening": "eyes.card_label.childhood_eye_screening",
  "Retinopathy of Prematurity": "eyes.card_label.retinopathy_of_prematurity",
  "Retinal Disease": "eyes.card_label.retinal_disease",
  "Optic Nerve Disease": "eyes.card_label.optic_nerve_disease",
  "WHO PEC": "eyes.card_label.who_pec",
  Ptosis: "eyes.card_label.ptosis",
  Proptosis: "eyes.card_label.proptosis",
  "Eye Movements/Squint": "eyes.card_label.eye_movements/squint",
  "Cranial Nerve Examination": "eyes.card_label.cranial_nerve_examination",
  "Arclight Overview": "eyes.card_label.arclight_overview",
  "Holo Overview": "eyes.card_label.holo_overview",
});

const EYES_TAG_I18N_KEYS = Object.freeze({
  "Coming Soon": "eyes.tag_coming_soon",
  Video: "eyes.tag_video",
  "Case Study": "eyes.tag_case_study",
  Quiz: "eyes.tag_quiz",
  "Mini Apps": "eyes.tag_mini_apps",
  "Mini App": "eyes.tag_mini_app",
});

const EYES_EXTRA_I18N_KEYS = Object.freeze({
  toggleLikeAria: "i18nExtra.eyes_toggle_like",
  likeTitle: "i18nExtra.eyes_like",
  goToItemPrefix: "i18nExtra.eyes_go_to_item",
});

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
  "fundalReflexExaminationScrollPage",
  "interactiveLearningPage",
  "assessmentVisionPage",
  "normalAbnormalPage",
  "fundalReflexInteractivePage",
  "traumaInteractivePage",
  "amslerInteractivePage",
  "miresPage",
  "morphPage",
  "squintPalsyPage",
  "cataractPage",
]);

const EYES_CAROUSEL_STATE_KEY = "arclight:eyes:carousel-state:v1";

function clampNumber(value, min, max) {
  return Math.min(max, Math.max(min, value));
}

function readEyesCarouselState() {
  try {
    const raw = sessionStorage.getItem(EYES_CAROUSEL_STATE_KEY);
    if (!raw) return {};
    const parsed = JSON.parse(raw);
    return parsed && typeof parsed === "object" ? parsed : {};
  } catch {
    return {};
  }
}

function writeEyesCarouselState(state) {
  try {
    sessionStorage.setItem(EYES_CAROUSEL_STATE_KEY, JSON.stringify(state));
  } catch {
    void 0;
  }
}

function getCenteredCardIndex(carouselEl, cards) {
  const mid = carouselEl.scrollLeft + carouselEl.offsetWidth / 2;
  let bestIndex = 0;
  let bestDistance = Infinity;
  cards.forEach((card, idx) => {
    const center = card.offsetLeft + card.offsetWidth / 2;
    const distance = Math.abs(center - mid);
    if (distance < bestDistance) {
      bestDistance = distance;
      bestIndex = idx;
    }
  });
  return bestIndex;
}

function saveEyesCarouselState(pageEl) {
  if (!pageEl) return;
  const nextState = {};
  pageEl
    .querySelectorAll(".eyes-carousel, .eyes-track")
    .forEach((carouselEl) => {
      const id = carouselEl.id;
      if (!id) return;
      const cards = Array.from(carouselEl.querySelectorAll(".eyes-card"));
      if (!cards.length) return;
      nextState[id] = {
        scrollLeft: Math.round(carouselEl.scrollLeft || 0),
        activeIndex: getCenteredCardIndex(carouselEl, cards),
      };
    });
  writeEyesCarouselState(nextState);
}

/* ---- PUBLIC: called by router on page 'eyes' ---- */
/**
 * Initializes the main "Eyes" page, primarily by calling `initializeEyesCatalog`.
 */
export function initializeEyes() {
  initializeEyesCatalog();

  const root = document; // delegate across the Eyes page

  root.addEventListener("click", async (_e) => {
    // Find the clicked Eyes card
    const card = _e.target.closest(".eyes-card");
    if (!card) return;

    // Work out what this card targets
    const target =
      card.dataset?.target || card.dataset?.page || card.dataset?.route || "";
    const label = (card.getAttribute("data-label") || "").toLowerCase();

    // Only handle the Pupils card
    if (target !== "pupilsPage" && label !== "pupils") return;

    _e.preventDefault();

    // Direct to Pupils without flashing Learning Modules
    // inside the Pupils click handler in eyes.js
    saveEyesCarouselState(document.getElementById("eyesCatalogPage"));
    window.__videosPendingTarget = "pupilsPage";
    window.__videosSuppressFlash = true;
    try {
      sessionStorage.setItem("gotoSubPage", "pupilsPage");
    } catch {
      void 0; // Intentionally empty
    }

    try {
      sessionStorage.setItem("fromRoute", window.currentPageName || "eyes");
    } catch {
      void 0; // Intentionally empty
    }
    await loadPage("videos");

    try {
      const { goToVideosSection } = await import("./videos.js");
      if (typeof goToVideosSection === "function") {
        goToVideosSection("pupilsPage");
      }
    } catch {
      void 0; // Intentionally empty
    }

    // Keep a shareable deep link to the exact videos subpage.
    syncRouteHash("videos", { replace: true, subPageId: "pupilsPage" });
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

  const resolveI18nText = (path, fallback) => {
    if (!path || typeof window.I18N?.applyTranslations !== "function") {
      return fallback;
    }

    const probe = document.createElement("span");
    probe.hidden = true;
    probe.setAttribute("data-i18n", path);
    probe.textContent = fallback;
    pageEl.appendChild(probe);

    try {
      window.I18N.applyTranslations(probe);
      return (probe.textContent || fallback).trim();
    } catch {
      return fallback;
    } finally {
      probe.remove();
    }
  };

  const localizedLikeTitle = resolveI18nText(
    EYES_EXTRA_I18N_KEYS.likeTitle,
    "Like",
  );
  const localizedGoToItemPrefix = resolveI18nText(
    EYES_EXTRA_I18N_KEYS.goToItemPrefix,
    "Go to item",
  );

  // menu (baseline parity)
  const menuBtn = pageEl.querySelector(".menuBtn");
  if (menuBtn) {
    menuBtn.addEventListener(
      "click",
      (_e) => {
        _e.preventDefault();
        openMenu();
      },
      { once: true },
    );
  }

  const sections = {
    coreCarousel: [
      {
        label: "History Taking",
        target: EYES_INDEX["History Taking"],
        tags: ["Quiz"],
      },
      {
        label: "Visual Acuity",
        target: "visualAcuityPage",
        tags: ["Video"],
      },
      { label: "Pupils", target: "pupilsPage", tags: ["Video"] },
      {
        label: "Front of Eye",
        target: "frontOfEyePage",
        tags: ["Video"],
      },

      {
        label: "Fundal Reflex",
        target: "fundalReflexPage",
        tags: ["Video"],
      },
      {
        label: "Ophthalmoscopy",
        target: "directOphthalmoscopy",
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
        label: "Childhood Eye Screening",
        target: "childhoodEyeScreeningWorkshop",
        tags: ["Video", "Quiz"],
      },
      {
        label: "Glaucoma",
        target: "glaucomaWorkshop",
        tags: ["Video", "Quiz"],
      },
      {
        label: "Diabetic Retinopathy",
        target: "diabeticRetinopathyWorkshop",
        tags: ["Video", "Interactive"],
      },
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
      (list || []).forEach((i) => out.push(i)),
    );
    return out;
  };

  // Renders a carousel with disabled states for missing targets
  const render = (containerId, items) => {
    const el = pageEl.querySelector(`#${containerId}`);
    if (!el) return;
    const likes = getLikes();

    // Helper: can this item actually navigate?
    const isNavigable = (target) => {
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

    const cardTemplate = document.getElementById("eyesCardTemplate");
    if (!cardTemplate) return;

    el.textContent = "";
    items.forEach((i) => {
      const disabled = !isNavigable(i.target, i.tags);
      const card = cardTemplate.content
        .querySelector(".eyes-card")
        .cloneNode(true);
      const labelI18nKey = EYES_LABEL_I18N_KEYS[i.label];

      card.classList.toggle("is-disabled", disabled);
      card.classList.toggle("liked", likes.has(i.label));
      card.dataset.target = i.target;
      card.dataset.label = i.label;

      if (disabled) {
        card.setAttribute("aria-disabled", "true");
        card.setAttribute("tabindex", "-1");
        card.setAttribute("data-disabled", "true");
      } else {
        card.setAttribute("tabindex", "0");
      }

      const heartBtn = card.querySelector(".heart-btn");
      if (heartBtn) {
        heartBtn.setAttribute(
          "data-i18n",
          `${EYES_EXTRA_I18N_KEYS.toggleLikeAria}:aria-label`,
        );
        heartBtn.setAttribute("title", localizedLikeTitle);
      }

      const img = card.querySelector(".eyes-card__bg");
      const imgSrc =
        i.target === "childhoodEyeScreeningWorkshop"
          ? "images/icon/eyes/workshop/car_childhoodscreen.webp"
          : EYES_IMAGE_MAP[i.label];
      if (img && imgSrc) {
        img.src = imgSrc;
        img.alt = i.label;
        if (labelI18nKey) {
          img.setAttribute("data-i18n", `${labelI18nKey}:alt`);
        }
      } else if (img) {
        img.remove();
      }

      const title = card.querySelector(".eyes-card__title");
      if (title) {
        title.textContent = i.label;
        if (labelI18nKey) title.setAttribute("data-i18n", labelI18nKey);
      }

      const tagRow = card.querySelector(".tag-row");
      if (tagRow) {
        if (disabled) {
          const tag = document.createElement("span");
          tag.className = "tag coming-tag";
          tag.textContent = "Coming Soon";
          tag.setAttribute(
            "data-i18n",
            EYES_TAG_I18N_KEYS["Coming Soon"] || "eyes.tag_coming_soon",
          );
          tagRow.appendChild(tag);
        } else if (i.tags?.length) {
          i.tags.forEach((t) => {
            const tag = document.createElement("span");
            tag.className = "tag";
            tag.textContent = t;
            const tagI18nKey = EYES_TAG_I18N_KEYS[t];
            if (tagI18nKey) tag.setAttribute("data-i18n", tagI18nKey);
            tagRow.appendChild(tag);
          });
        } else {
          tagRow.remove();
        }
      }

      el.appendChild(card);
    });
  };

  Object.entries(sections).forEach(([id, list]) => render(id, list));
  try {
    window.I18N?.applyTranslations?.(pageEl);
    pageEl.querySelectorAll(".heart-btn").forEach((btn) => {
      const aria = btn.getAttribute("aria-label");
      if (aria) btn.setAttribute("title", aria);
    });
  } catch {
    void 0;
  }

  // === Carousel dots per section ===
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
          `<button class="dot" type="button" aria-label="${localizedGoToItemPrefix} ${
            i + 1
          }"></button>`,
      )
      .join("");
    const dots = Array.from(dotsWrap.querySelectorAll(".dot"));
    const carouselId = carouselEl.id;

    // Helpers to compute which card is centered, paint dots, and center a card
    const getActiveIndex = () => getCenteredCardIndex(carouselEl, cards);

    const paintDots = (i) => {
      dots.forEach((d, idx) => d.classList.toggle("active", idx === i));
    };

    const centerCardByIndex = (i, behavior = "smooth") => {
      const clamped = Math.max(0, Math.min(i, cards.length - 1));
      const card = cards[clamped];
      const left =
        card.offsetLeft - carouselEl.offsetWidth / 2 + card.offsetWidth / 2;
      carouselEl.scrollTo({ left, behavior });
    };

    // Click any dot to center that item
    dots.forEach((dot, i) =>
      dot.addEventListener("click", () => centerCardByIndex(i)),
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

    // Initial sync: restore prior state when available.
    // Use activeIndex first because it is resilient to responsive width changes.
    requestAnimationFrame(() => {
      const savedState = carouselId
        ? readEyesCarouselState()[carouselId]
        : null;
      const savedLeft = Number(savedState?.scrollLeft);
      const savedIndex = Number(savedState?.activeIndex);

      if (Number.isFinite(savedIndex)) {
        const idx = clampNumber(savedIndex, 0, cards.length - 1);
        centerCardByIndex(idx, "auto");
        paintDots(idx);
        return;
      }

      if (Number.isFinite(savedLeft)) {
        const maxScroll = Math.max(
          0,
          carouselEl.scrollWidth - carouselEl.clientWidth,
        );
        carouselEl.scrollTo({
          left: clampNumber(savedLeft, 0, maxScroll),
          behavior: "auto",
        });
        paintDots(getActiveIndex());
        return;
      }

      paintDots(getActiveIndex());
    });
  };
  // This comment is intentionally placed here to satisfy the linter for the empty block statement.

  const setupMouseDragForCarousel = (carouselEl) => {
    if (!carouselEl || carouselEl.dataset.mouseDragBound === "true") return;
    carouselEl.dataset.mouseDragBound = "true";

    let activePointerId = null;
    let hasPointerCapture = false;
    let startX = 0;
    let lastX = 0;
    let lastTimestamp = 0;
    let velocityX = 0;
    let suppressClick = false;
    let isDragging = false;
    let inertiaRafId = null;

    const cancelInertia = () => {
      if (inertiaRafId === null) return;
      cancelAnimationFrame(inertiaRafId);
      inertiaRafId = null;
    };

    const finishFreeScroll = () => {
      carouselEl.classList.remove("is-pointer-dragging");
    };

    const snapToNearestCard = () => {
      const cards = Array.from(carouselEl.querySelectorAll(".eyes-card"));
      if (!cards.length) {
        finishFreeScroll();
        return;
      }

      const idx = getCenteredCardIndex(carouselEl, cards);
      const card = cards[idx];
      const left =
        card.offsetLeft - carouselEl.offsetWidth / 2 + card.offsetWidth / 2;

      finishFreeScroll();
      carouselEl.scrollTo({ left, behavior: "smooth" });
    };

    const startMomentumScroll = () => {
      const minimumVelocity = 0.02;
      if (Math.abs(velocityX) < minimumVelocity) {
        snapToNearestCard();
        return;
      }

      let momentumVelocity = velocityX;
      let previousTimestamp = performance.now();

      const step = (timestamp) => {
        const dt = Math.max(1, Math.min(32, timestamp - previousTimestamp));
        previousTimestamp = timestamp;

        carouselEl.scrollLeft -= momentumVelocity * dt;
        momentumVelocity *= Math.pow(0.94, dt / 16.67);

        if (Math.abs(momentumVelocity) < minimumVelocity) {
          inertiaRafId = null;
          snapToNearestCard();
          return;
        }

        inertiaRafId = requestAnimationFrame(step);
      };

      inertiaRafId = requestAnimationFrame(step);
    };

    const resetDragState = ({ keepFreeScroll = false } = {}) => {
      activePointerId = null;
      isDragging = false;
      hasPointerCapture = false;
      if (!keepFreeScroll) {
        finishFreeScroll();
      }
    };

    carouselEl.addEventListener("pointerdown", (_e) => {
      if (_e.pointerType !== "mouse") return;
      if (_e.button !== 0) return;
      if (_e.target.closest?.(".heart-btn")) return;

      cancelInertia();
      activePointerId = _e.pointerId;
      startX = _e.clientX;
      lastX = _e.clientX;
      lastTimestamp = performance.now();
      velocityX = 0;
      suppressClick = false;
      isDragging = false;
      hasPointerCapture = false;
    });

    carouselEl.addEventListener(
      "pointermove",
      (_e) => {
        if (_e.pointerId !== activePointerId) return;

        const totalDeltaX = _e.clientX - startX;
        if (!isDragging && Math.abs(totalDeltaX) < 4) return;

        if (!isDragging) {
          isDragging = true;
          suppressClick = true;
          carouselEl.classList.add("is-pointer-dragging");

          // Capture only after drag intent is clear so plain clicks stay
          // targeted on the card instead of being retargeted to the carousel.
          try {
            carouselEl.setPointerCapture(_e.pointerId);
            hasPointerCapture = true;
          } catch {
            hasPointerCapture = false;
          }
        }

        const now = performance.now();
        const deltaX = _e.clientX - lastX;
        const dt = Math.max(1, now - lastTimestamp);
        velocityX = deltaX / dt;
        lastX = _e.clientX;
        lastTimestamp = now;
        carouselEl.scrollLeft -= deltaX;
        _e.preventDefault();
      },
      { passive: false },
    );

    const endDrag = (_e) => {
      if (_e.pointerId !== activePointerId) return;

      if (hasPointerCapture) {
        try {
          carouselEl.releasePointerCapture(_e.pointerId);
        } catch {
          void 0;
        }
      }

      const didDrag = isDragging;
      resetDragState({ keepFreeScroll: didDrag });
      if (didDrag) {
        startMomentumScroll();
      }
    };

    carouselEl.addEventListener("pointerup", endDrag);
    carouselEl.addEventListener("pointercancel", endDrag);
    carouselEl.addEventListener("lostpointercapture", () => {
      if (activePointerId === null) return;
      cancelInertia();
      hasPointerCapture = false;
      resetDragState();
    });

    carouselEl.addEventListener(
      "click",
      (_e) => {
        if (!suppressClick) return;
        suppressClick = false;
        _e.preventDefault();
        _e.stopPropagation();
        if (typeof _e.stopImmediatePropagation === "function") {
          _e.stopImmediatePropagation();
        }
      },
      true,
    );
  };

  // Apply to every Eyes carousel section
  pageEl
    .querySelectorAll(".eyes-carousel, .eyes-track")
    .forEach((carouselEl) => {
      setupDotsForCarousel(carouselEl);
      setupMouseDragForCarousel(carouselEl);
    });

  // Persist state while users scroll so returning to Eyes restores the same position.
  pageEl
    .querySelectorAll(".eyes-carousel, .eyes-track")
    .forEach((carouselEl) => {
      let rafId = null;
      carouselEl.addEventListener(
        "scroll",
        () => {
          if (rafId) return;
          rafId = requestAnimationFrame(() => {
            rafId = null;
            saveEyesCarouselState(pageEl);
          });
        },
        { passive: true },
      );
    });

  /**
   * Consumes an event to prevent default behavior and stop propagation.
   * @param {Event} _e - The event object.
   */
  const consume = (_e) => {
    _e.preventDefault();
    _e.stopPropagation();
    if (typeof _e.stopImmediatePropagation === "function")
      _e.stopImmediatePropagation();
  };

  /**
   * Handles the toggling of a 'like' state for a module card.
   * Updates the card's visual state and persists the like status.
   * @param {Event} _e - The event object from the heart button click/keydown.
   */
  const onHeartToggle = (_e) => {
    consume(_e);
    const heart = _e.currentTarget; // .heart-btn
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
    hb.addEventListener("keydown", (_e) => {
      if (_e.key === "Enter" || _e.key === " ") onHeartToggle(_e);
    });
  });

  // Delegated handler for card navigation
  pageEl.addEventListener(
    "click",
    async (_e) => {
      const card = _e.target.closest?.(".eyes-card");
      if (!card) return;

      // If disabled, do nothing
      if (
        card.getAttribute("aria-disabled") === "true" ||
        card.dataset.disabled === "true"
      ) {
        _e.preventDefault();
        _e.stopPropagation();
        return;
      }

      // define target correctly from dataset
      const target =
        card.dataset?.target || card.dataset?.route || card.dataset?.page || "";

      const label = (card.getAttribute("data-label") || "").toLowerCase();

      _e.preventDefault();
      saveEyesCarouselState(pageEl);

      // Direct-open Pupils
      if (target === "pupilsPage" || label === "pupils") {
        try {
          window.__videosPendingTarget = "pupilsPage";
          window.__videosSuppressFlash = true;
          // Fallback for older code paths:
          sessionStorage.setItem("gotoSubPage", "pupilsPage");
        } catch {
          void 0; // Intentionally empty
        }
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

      // Direct-open other video pages from Eyes
      const VIDEO_TARGETS = new Set([
        "visualAcuityPage",
        "fundalReflexPage",
        "anteriorSegmentVideoPage",
        "directOphthalmoscopy",
      ]);

      if (VIDEO_TARGETS.has(target)) {
        try {
          window.__videosPendingTarget = target;
          window.__videosSuppressFlash = true;
          sessionStorage.setItem("gotoSubPage", target);
        } catch {
          void 0;
        }

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

      // Other video sections
      if (VIDEO_PAGE_IDS.has(target)) {
        try {
          window.__videosPendingTarget = target;
          window.__videosSuppressFlash = true;
          sessionStorage.setItem("gotoSubPage", target);
        } catch {
          void 0; // Intentionally empty
        }
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
    { passive: false },
  );
}
