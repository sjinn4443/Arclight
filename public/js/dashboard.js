/**
 * @fileoverview This file contains dashboard related functions and logic, including user greetings, navigation to various modules, quick actions, and dynamic recommendations.
 */

import { loadPage } from "./navigation.js";
import { openMenu } from "./menu.js";
import { fetchDictionary, get, getLanguage } from "./i18n.js";

const wired = new WeakSet();
let dashboardI18nDict = {};
let dashboardI18nLang = null;
let dashboardSearchRenderToken = 0;

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

async function translateDashboard(
  path,
  fallback,
  vars = {},
  fallbackPaths = [],
) {
  await ensureDashboardI18nDictionary();
  const translated = get(dashboardI18nDict, path);
  const fallbackTranslated = fallbackPaths
    .map((candidate) => get(dashboardI18nDict, candidate))
    .find((candidate) => candidate != null);
  return interpolateTemplate(
    translated == null ? (fallbackTranslated ?? fallback) : translated,
    vars,
  );
}

async function translateDashboardParts(parts = []) {
  if (!parts.length) return "";
  await ensureDashboardI18nDictionary();
  return parts
    .map(({ path, fallback }) => get(dashboardI18nDict, path) ?? fallback)
    .join(" | ");
}

async function openDashboardDownloadModal() {
  const {
    cacheOfflineUrls,
    fetchAllOfflineAssetUrls,
    resolveOfflineDownloadSelection,
    showDownloadAppModal,
    showDownloadErrorModal,
  } = await import("./languageinstall.js");

  try {
    const manifest = await fetchAllOfflineAssetUrls();
    const downloadChoice = await showDownloadAppModal(manifest);
    if (!downloadChoice) return;

    const downloadSelection = resolveOfflineDownloadSelection(
      manifest,
      downloadChoice,
    );
    await navigator.serviceWorker.ready;
    await cacheOfflineUrls(downloadSelection);
  } catch (err) {
    console.warn("[dashboard] could not download offline content:", err);
    showDownloadErrorModal(err);
  }
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
      helloEl.textContent = await translateDashboard(
        key,
        fallback,
        {
          name: username,
        },
        ["dashboard.greeting"],
      );
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
      img.className = "dashboard-greeting__install-mark";
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
  const searchInput = root.querySelector("#dashboardSearchInput");
  const searchPanel = root.querySelector("#dashboardSearchPanel");

  if (searchWrap && toggleBtn) {
    toggleBtn.addEventListener("click", () => {
      if (searchWrap.classList.contains("search-collapsed")) {
        searchWrap.classList.remove("search-collapsed");
        searchWrap.classList.add("search-expanded");
        searchInput?.focus();
        void renderDashboardSearch(searchInput, searchPanel);
      } else {
        searchWrap.classList.remove("search-expanded");
        searchWrap.classList.add("search-collapsed");
        if (searchPanel) searchPanel.hidden = true;
        searchInput?.blur();
      }
    });
  }

  if (searchInput && searchPanel) {
    searchInput.addEventListener("input", () => {
      void renderDashboardSearch(searchInput, searchPanel);
    });
    searchInput.addEventListener("focus", () => {
      void renderDashboardSearch(searchInput, searchPanel);
    });
    searchInput.addEventListener("keydown", (event) => {
      if (event.key === "Escape") {
        searchPanel.hidden = true;
        searchInput.blur();
      }
    });
    root.addEventListener("click", (event) => {
      if (!event.target.closest?.(".search-wrap--compact")) {
        searchPanel.hidden = true;
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
      card.classList.add("category-card--disabled");
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
    const action = (pill.getAttribute("data-action") || "").trim();
    if (action === "atomscard") {
      pill.addEventListener("click", () => loadPage("atomscard"));
    } else if (action === "offline") {
      pill.addEventListener("click", () => {
        void openDashboardDownloadModal();
      });
    }
  });

  // 6) Recommended for you (2 random)
  const host = document.getElementById("recommendedPlaceholder");
  if (host) {
    void renderRecommendations(host);
    window.addEventListener("i18n:languageChanged", () => {
      void renderRecommendations(host);
    });
  }
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

function getDashboardContentItems() {
  return [
    {
      title: "Ophthalmoscopy",
      titleI18n: "eyes.card_label.ophthalmoscopy",
      page: "directOphthalmoscopy",
      img: "images/icon/eyes/core/ophth.webp",
      subtitle: "Video | Quiz",
      subtitleParts: [
        { path: "eyes.tag_video", fallback: "Video" },
        { path: "eyes.tag_quiz", fallback: "Quiz" },
      ],
      keywords: ["direct ophthalmoscopy", "fundoscopy", "optic disc", "do"],
      progress: 0,
    },
    {
      title: "Visual Acuity",
      titleI18n: "eyes.card_label.visual_acuity",
      page: "visualAcuityPage",
      img: "images/icon/eyes/core/visualacuity.webp",
      subtitle: "Video",
      subtitleParts: [{ path: "eyes.tag_video", fallback: "Video" }],
      keywords: ["vision", "va", "acuity", "visual"],
      progress: 0,
    },
    {
      title: "Pupils",
      titleI18n: "eyes.card_label.pupils",
      page: "pupilsPage",
      img: "images/icon/eyes/core/pupils.webp",
      subtitle: "Video | Quiz",
      subtitleParts: [
        { path: "eyes.tag_video", fallback: "Video" },
        { path: "eyes.tag_quiz", fallback: "Quiz" },
      ],
      keywords: ["rapd", "pupil", "swinging flashlight"],
      progress: 0,
    },
    {
      title: "Front of Eye",
      titleI18n: "eyes.card_label.front_of_eye",
      page: "anteriorSegmentVideoPage",
      img: "images/icon/eyes/core/frontofeye.webp",
      subtitle: "Video | Case Study",
      subtitleParts: [
        { path: "eyes.tag_video", fallback: "Video" },
        { path: "eyes.tag_case_study", fallback: "Case Study" },
      ],
      keywords: ["anterior segment", "cornea", "red eye"],
      progress: 0,
    },
    {
      title: "Fundal Reflex",
      titleI18n: "eyes.card_label.fundal_reflex",
      page: "fundalReflexPage",
      img: "images/icon/eyes/core/car_fundalreflex.webp",
      subtitle: "Video | PDF | Scrollytelling",
      keywords: ["red reflex", "media opacity", "childhood screening"],
      progress: 0,
    },
    {
      title: "Interactive Learning",
      titleI18n: "eyes.card_label.interactive_learning",
      page: "interactiveLearningPage",
      img: "images/icon/eyes/core/miniapp.webp",
      subtitle: "Mini Apps",
      subtitleParts: [{ path: "eyes.tag_mini_apps", fallback: "Mini Apps" }],
      keywords: ["mini apps", "simulation", "interactive"],
      progress: 0,
    },
    {
      title: "Arclight Overview",
      titleI18n: "eyes.card_label.arclight_overview",
      page: "arclightPage",
      img: "images/icon/eyes/tools/car_arclight.webp",
      subtitle: "Tools and kits",
      keywords: ["how to use arclight", "phone attachment", "device"],
      progress: 0,
    },
    {
      title: "Holo Overview",
      titleI18n: "eyes.card_label.holo_overview",
      page: "holoOverviewPage",
      img: "images/icon/eyes/tools/car_holo.webp",
      subtitle: "Tools and kits",
      keywords: ["binocular indirect ophthalmoscopy", "bio", "holo"],
      progress: 0,
    },
    {
      title: "Childhood Eye Screening",
      route: "childhoodEyeScreeningWorkshop",
      img: "images/icon/eyes/disease/car_childhood.webp",
      subtitle: "Workshop",
      keywords: ["children", "screening", "fundal reflex"],
      progress: 0,
    },
    {
      title: "Glaucoma",
      route: "glaucomaWorkshop",
      img: "images/icon/eyes/disease/car_glaucoma.webp",
      subtitle: "Workshop",
      keywords: ["optic nerve", "cup disc", "iop"],
      progress: 0,
    },
    {
      title: "Diabetic Retinopathy",
      route: "diabeticRetinopathyWorkshop",
      img: "images/icon/eyes/disease/car_diabetic.webp",
      subtitle: "Workshop",
      keywords: ["diabetes", "retina", "screening"],
      progress: 0,
    },
    {
      title: "Cataract",
      page: "cataractPage",
      img: "images/icon/eyes/disease/car_cataract.webp",
      subtitle: "Mini App",
      keywords: ["lens", "opacity", "simulation"],
      progress: 0,
    },
    {
      title: "Mires",
      page: "miresPage",
      img: "images/icon/eyes/core/miniapp.webp",
      subtitle: "Mini App",
      keywords: ["keratometry", "cornea"],
      progress: 0,
    },
    {
      title: "Morph",
      page: "morphPage",
      img: "images/icon/eyes/core/miniapp.webp",
      subtitle: "Mini App",
      keywords: ["face", "simulation"],
      progress: 0,
    },
    {
      title: "Squint / Palsy",
      page: "squintPalsyPage",
      img: "images/icon/eyes/extended/car_squint.webp",
      subtitle: "Mini App",
      keywords: ["eye movements", "palsy", "strabismus"],
      progress: 0,
    },
  ];
}

function normalizeSearchText(value) {
  return String(value || "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, " ")
    .trim();
}

function scoreDashboardSearchItem(item, query) {
  const normalizedQuery = normalizeSearchText(query);
  if (!normalizedQuery) return 0;

  const title = normalizeSearchText(item.title);
  const subtitle = normalizeSearchText(item.subtitle);
  const keywords = (item.keywords || []).map(normalizeSearchText);
  const haystack = [title, subtitle, ...keywords].join(" ");

  if (title === normalizedQuery) return 120;
  if (title.startsWith(normalizedQuery)) return 100;
  if (title.split(" ").some((word) => word.startsWith(normalizedQuery))) {
    return 82;
  }
  if (title.includes(normalizedQuery)) return 70;
  if (keywords.some((keyword) => keyword.startsWith(normalizedQuery))) {
    return 62;
  }
  if (haystack.includes(normalizedQuery)) return 45;

  return 0;
}

function getDashboardSearchMatches(query) {
  return getDashboardContentItems()
    .map((item) => ({ item, score: scoreDashboardSearchItem(item, query) }))
    .filter((entry) => entry.score > 0)
    .sort(
      (a, b) => b.score - a.score || a.item.title.localeCompare(b.item.title),
    )
    .map((entry) => entry.item);
}

async function createDashboardModuleCard(cardTemplate, item) {
  const card = cardTemplate.content
    .querySelector(".module-card")
    .cloneNode(true);

  if (item.route) card.setAttribute("data-route", item.route);
  if (item.page) card.setAttribute("data-page", item.page);

  const img = card.querySelector("img");
  if (img) {
    img.src = item.img;
    img.alt = item.title;
    if (item.titleI18n) img.setAttribute("data-i18n", `${item.titleI18n}:alt`);
  }

  const title = card.querySelector(".module-title");
  if (title) {
    title.textContent = item.title;
    if (item.titleI18n) title.setAttribute("data-i18n", item.titleI18n);
  }

  const subtitle = card.querySelector(".module-subtitle");
  if (subtitle) {
    if (item.subtitle) {
      subtitle.textContent = item.subtitleParts?.length
        ? await translateDashboardParts(item.subtitleParts)
        : item.subtitle;
    } else {
      subtitle.remove();
    }
  }

  const progress = card.querySelector(".progress");
  if (progress) progress.style.width = `${item.progress || 0}%`;

  card.addEventListener("click", () => {
    const page = card.getAttribute("data-page");
    const route = card.getAttribute("data-route");
    if (page) {
      openVideosSubpage(page);
      return;
    }
    if (route) loadPage(route);
  });

  return card;
}

async function renderDashboardSearch(input, panel) {
  if (!input || !panel) return;

  const query = input.value.trim();
  if (!query) {
    panel.hidden = true;
    return;
  }

  const token = ++dashboardSearchRenderToken;
  const cardTemplate = document.getElementById(
    "dashboardRecommendedCardTemplate",
  );
  if (!cardTemplate) return;

  const suggestionsEl = panel.querySelector(".dashboard-search-suggestions");
  const resultsEl = panel.querySelector(".dashboard-search-results");
  if (!suggestionsEl || !resultsEl) return;

  const matches = getDashboardSearchMatches(query);
  suggestionsEl.replaceChildren();
  resultsEl.replaceChildren();

  matches.slice(0, 4).forEach((item) => {
    const chip = document.createElement("button");
    chip.type = "button";
    chip.className = "dashboard-search-suggestion";
    chip.textContent = item.title;
    chip.addEventListener("click", () => {
      input.value = item.title;
      void renderDashboardSearch(input, panel);
    });
    suggestionsEl.appendChild(chip);
  });

  if (!matches.length) {
    const empty = document.createElement("div");
    empty.className = "dashboard-search-empty";
    empty.textContent = "No matching content";
    resultsEl.appendChild(empty);
    panel.hidden = false;
    return;
  }

  for (const item of matches.slice(0, 5)) {
    const card = await createDashboardModuleCard(cardTemplate, item);
    if (token !== dashboardSearchRenderToken) return;
    card.classList.add("dashboard-search-result-card");
    resultsEl.appendChild(card);
  }

  try {
    window.I18N?.applyTranslations?.(panel);
  } catch {
    void 0;
  }

  panel.hidden = false;
}

async function renderRecommendations(host) {
  const picks = shuffle(getDashboardContentItems()).slice(0, 2);

  const cardTemplate = document.getElementById(
    "dashboardRecommendedCardTemplate",
  );
  if (!cardTemplate) return;

  host.textContent = "";
  for (const m of picks) {
    const card = await createDashboardModuleCard(cardTemplate, m);
    host.appendChild(card);
  }

  try {
    window.I18N?.applyTranslations?.(host);
  } catch {
    void 0;
  }
}
