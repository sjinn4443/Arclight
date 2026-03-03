/**
 * @fileoverview This file contains dashboard related functions and logic, including user greetings, navigation to various modules, quick actions, and dynamic recommendations.
 */

import { loadPage } from "./navigation.js";
import { openMenu } from "./menu.js";
import { fetchDictionary, get, getLanguage } from "./i18n.js";

const wired = new WeakSet();
let dashboardI18nDict = {};
let dashboardI18nLang = null;

function interpolateTemplate(template, vars = {}) {
  return String(template || "").replace(
    /\{\{\s*([a-zA-Z0-9_]+)\s*\}\}/g,
    (_, key) => String(vars[key] ?? ""),
  );
}

async function ensureDashboardI18nDictionary() {
  const lang = getLanguage();
  if (dashboardI18nLang === lang && dashboardI18nDict) return;
  dashboardI18nDict = await fetchDictionary(lang);
  dashboardI18nLang = lang;
}

async function translateDashboard(path, fallback, vars = {}) {
  await ensureDashboardI18nDictionary();
  const translated = get(dashboardI18nDict, path);
  return interpolateTemplate(translated == null ? fallback : translated, vars);
}
/**
 * Initializes the unified dashboard page.
 * Sets up user greetings, event listeners for menu button, category cards,
 * quick action pills (Atoms Card, Download Contents), and renders recommended modules.
 * Ensures the dashboard is initialized only once.
 */
export function initializeDashboard() {
  const root = document.getElementById("unifiedDashboard");
  if (!root || wired.has(root)) return;
  wired.add(root);

  // On touch devices, block long-press context menus on clickable dashboard cards.
  if (window.matchMedia?.("(pointer: coarse)")?.matches) {
    root.addEventListener("contextmenu", (e) => {
      const target = e.target;
      if (!(target instanceof Element)) return;
      if (target.closest(".category-card, .module-card")) {
        e.preventDefault();
      }
    });
  }

  // 1) Greeting rotation by refresh count
  const helloEl = root.querySelector(".hello");
  const username = (localStorage.getItem("username") || "").trim();

  const KEY = "dashboard_greeting_load_count";
  const prev = Number(localStorage.getItem(KEY) || "0");
  const count = prev + 1;
  localStorage.setItem(KEY, String(count));

  if (helloEl) {
    // reset content (in case we previously inserted an image)
    helloEl.textContent = "";
    helloEl.innerHTML = "";

    const applyLocalizedGreeting = async () => {
      const hasName = Boolean(username);
      let key = "";
      let fallback = "";

      if (count === 1) {
        key = hasName
          ? "dashboard.greeting_hello_name"
          : "dashboard.greeting_hello_generic";
        fallback = hasName ? `Hello ${username}!` : "Hello!";
      } else if (count === 2) {
        key = hasName
          ? "dashboard.greeting_welcome_back_name"
          : "dashboard.greeting_welcome_back_generic";
        fallback = hasName ? `Welcome back ${username}!` : "Welcome back!";
      } else if (count === 3) {
        key = hasName
          ? "dashboard.greeting_nice_to_see_again_name"
          : "dashboard.greeting_nice_to_see_again_generic";
        fallback = hasName
          ? `Nice to see you again ${username}!`
          : "Nice to see you again!";
      }

      if (!key) return;
      helloEl.textContent = await translateDashboard(key, fallback, {
        name: username,
      });
    };

    if (count === 1) {
      void applyLocalizedGreeting();
    } else if (count === 2) {
      void applyLocalizedGreeting();
    } else if (count === 3) {
      void applyLocalizedGreeting();
    } else {
      const img = document.createElement("img");
      img.src = "images/logo/pwainstall.png";
      img.alt = "PWA install";
      img.decoding = "async";
      img.style.height = "28px";
      img.style.width = "auto";
      img.style.marginLeft = "2px";
      helloEl.appendChild(img);
    }

    window.addEventListener("i18n:languageChanged", () => {
      if (count >= 1 && count <= 3) {
        void applyLocalizedGreeting();
      }
    });
  }
  // 2) Menu route (overlay lives in menu.html)
  const menuBtn = root.querySelector(".menuBtn");
  if (menuBtn) {
    menuBtn.addEventListener("click", (e) => {
      e.preventDefault();
      openMenu();
    });
  }

  // 2b) Compact search toggle (icon -> show/hide box)
  const searchWrap = root.querySelector(".search-wrap--compact");
  const toggleBtn = root.querySelector("#dashboardSearchToggle");

  if (searchWrap && toggleBtn) {
    toggleBtn.addEventListener("click", () => {
      if (searchWrap.classList.contains("search-collapsed")) {
        searchWrap.classList.remove("search-collapsed");
        searchWrap.classList.add("search-expanded");
      } else {
        searchWrap.classList.remove("search-expanded");
        searchWrap.classList.add("search-collapsed");
      }
    });
  }

  // 3) Category cards
  const LEGACY_TO_ROUTE = {
    eyesModules: "eyes",
    earsModules: "ears",
    skinModules: "videos",
    teachModules: "videos",
    eyesCatalogPage: "eyes",
    earsLearningModules: "ears",
  };

  const DISABLED_TARGETS = new Set([
    "earsLearningModules",
    "skinModules",
    "teachModules",
  ]);

  // Wire category cards
  root.querySelectorAll(".category-card").forEach((card) => {
    const legacy = card.getAttribute("data-target") || "";

    // Visual disabled state
    if (DISABLED_TARGETS.has(legacy)) {
      card.style.opacity = "0.5";
      card.style.cursor = "not-allowed";
      // defensively remove any stray routing attrs
      card.removeAttribute("data-route");
      card.removeAttribute("data-page");
    }

    card.addEventListener("click", (e) => {
      // Block navigation for disabled targets
      if (DISABLED_TARGETS.has(legacy)) {
        e.preventDefault();
        e.stopPropagation();
        return; // do nothing, stay on dashboard
      }

      // Navigate for allowed targets
      const route = LEGACY_TO_ROUTE[legacy] || legacy; // NOTE: use logical OR, not bitwise
      if (route) loadPage(route);
    });
  });

  // 3b) Carousel dots: keep dots in sync with the centered card
  const carousel = root.querySelector("#categoryCarousel");
  const dots = Array.from(root.querySelectorAll("#carouselDots .dot"));

  if (carousel && dots.length) {
    // Helper to get the live list of cards
    const cards = () => Array.from(carousel.querySelectorAll(".category-card"));
    const getActiveIndex = () => {
      const cs = cards();
      if (!cs.length) return 0;
      const mid = carousel.scrollLeft + carousel.offsetWidth / 2;
      let best = 0,
        bestDist = Infinity;
      cs.forEach((card, i) => {
        const center = card.offsetLeft + card.offsetWidth / 2;
        const d = Math.abs(center - mid);
        if (d < bestDist) {
          bestDist = d;
          best = i;
        }
      });
      return best;
    };

    // Paint the active dot
    const paintDots = (i) => {
      dots.forEach((d, idx) => d.classList.toggle("active", idx === i));
    };

    // Smoothly center a given card index
    const centerCardByIndex = (i) => {
      const cs = cards();
      if (!cs.length) return;
      const clamped = Math.max(0, Math.min(i, cs.length - 1));
      const card = cs[clamped];
      const left =
        card.offsetLeft - carousel.offsetWidth / 2 + card.offsetWidth / 2;
      carousel.scrollTo({ left, behavior: "smooth" });
    };

    // Update dots on scroll (throttled via rAF)
    let rafId = null;
    const onScroll = () => {
      if (rafId) return;
      rafId = requestAnimationFrame(() => {
        rafId = null;
        paintDots(getActiveIndex());
      });
    };
    carousel.addEventListener("scroll", onScroll, { passive: true });

    // Clicking a dot recenters to that card
    dots.forEach((dot, i) =>
      dot.addEventListener("click", () => centerCardByIndex(i)),
    );

    // Initial sync once the layout is ready
    requestAnimationFrame(() => paintDots(getActiveIndex()));
  }

  // 4 & 5) Quick actions: Atoms Card + Download Contents
  root.querySelectorAll(".quick-actions .pill").forEach((pill) => {
    const label = (pill.textContent || "").toLowerCase().trim();
    if (label.includes("atoms")) {
      pill.addEventListener("click", () => loadPage("atomscard"), {
        once: true,
      });
    } else if (label.includes("download")) {
      pill.addEventListener("click", () => loadPage("offline"), { once: true });
    }
  });

  // 6) Recommended for you (2 random)
  const host = document.getElementById("recommendedPlaceholder");
  if (host) renderRecommendations(host);
}

/**
 * Shuffles an array randomly using the Fisher-Yates (Knuth) algorithm.
 * Creates a shallow copy of the array to avoid modifying the original.
 * @param {Array} arr - The array to shuffle.
 * @returns {Array} A new, shuffled array.
 */
function shuffle(arr) {
  const a = arr.slice();
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

/**
 * Renders a list of two random recommended modules into the specified host element.
 * Cards use the "module-card" look (image + title + subtitle + progress).
 * @param {HTMLElement} host
 */

function openVideosSubpage(pageId) {
  if (!pageId) return;
  window.__videosPendingTarget = pageId;
  window.__videosSuppressFlash = true;

  loadPage("videos");
}

function renderRecommendations(host) {
  const ALL = [
    {
      title: "Ophthalmoscopy",
      titleI18n: "eyes.card_label.ophthalmoscopy",
      page: "directOphthalmoscopy",
      img: "images/icon/eyes/core/ophth.webp",
      subtitle: "Video | Quiz",
      subtitleI18n: "dashboard.recommended_subtitle_video_quiz",
      progress: 0,
    },
    {
      title: "Visual Acuity",
      titleI18n: "eyes.card_label.visual_acuity",
      page: "visualAcuityPage",
      img: "images/icon/eyes/core/visualacuity.webp",
      subtitle: "Video",
      subtitleI18n: "dashboard.recommended_subtitle_video",
      progress: 0,
    },
    {
      title: "Pupils",
      titleI18n: "eyes.card_label.pupils",
      page: "pupilsPage",
      img: "images/icon/eyes/core/pupils.webp",
      subtitle: "Video | Quiz",
      subtitleI18n: "dashboard.recommended_subtitle_video_quiz",
      progress: 0,
    },
    {
      title: "Front of Eye",
      titleI18n: "eyes.card_label.front_of_eye",
      page: "anteriorSegmentVideoPage",
      img: "images/icon/eyes/core/frontofeye.webp",
      subtitle: "Video | Case Study",
      subtitleI18n: "dashboard.recommended_subtitle_video_case_study",
      progress: 0,
    },
    {
      title: "Interactive Learning",
      titleI18n: "eyes.card_label.interactive_learning",
      page: "interactiveLearningPage",
      img: "images/icon/eyes/core/miniapp.webp",
      subtitle: "Mini Apps",
      subtitleI18n: "dashboard.recommended_subtitle_mini_apps",
      progress: 0,
    },
  ];

  const picks = shuffle(ALL).slice(0, 2);

  const cardTemplate = document.getElementById(
    "dashboardRecommendedCardTemplate",
  );
  if (!cardTemplate) return;

  host.textContent = "";
  picks.forEach((m) => {
    const card = cardTemplate.content
      .querySelector(".module-card")
      .cloneNode(true);

    if (m.route) {
      card.setAttribute("data-route", m.route);
    }
    if (m.page) {
      card.setAttribute("data-page", m.page);
    }

    const img = card.querySelector("img");
    if (img) {
      img.src = m.img;
      img.alt = m.title;
      if (m.titleI18n) img.setAttribute("data-i18n", `${m.titleI18n}:alt`);
    }

    const title = card.querySelector(".module-title");
    if (title) {
      title.textContent = m.title;
      if (m.titleI18n) title.setAttribute("data-i18n", m.titleI18n);
    }

    const subtitle = card.querySelector(".module-subtitle");
    if (subtitle) {
      if (m.subtitle) {
        subtitle.textContent = m.subtitle;
        if (m.subtitleI18n) subtitle.setAttribute("data-i18n", m.subtitleI18n);
      } else {
        subtitle.remove();
      }
    }

    const progress = card.querySelector(".progress");
    if (progress) {
      progress.style.width = `${m.progress || 0}%`;
    }

    host.appendChild(card);
  });

  try {
    window.I18N?.applyTranslations?.(host);
  } catch {
    void 0;
  }

  // Click behavior: prefer page deep-link into Videos, else use route
  host.querySelectorAll(".module-card").forEach((card) => {
    card.addEventListener("click", () => {
      const page = card.getAttribute("data-page");
      const route = card.getAttribute("data-route");

      if (page) {
        openVideosSubpage(page);
        return;
      }
      if (route) {
        loadPage(route);
      }
    });
  });
}

// Disable navigation for certain category cards
["earsLearningModules", "skinModules", "teachModules"].forEach((id) => {
  const card = document.getElementById(id);
  if (card) {
    // visually indicate disabled
    card.style.opacity = "0.5";
    card.style.cursor = "not-allowed";

    // strip navigation attributes if any
    card.removeAttribute("data-route");
    card.removeAttribute("data-page");

    // block clicks completely
    card.addEventListener("click", (e) => {
      e.preventDefault();
      e.stopPropagation();
    });
  }
});
