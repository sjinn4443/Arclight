/**
 * @fileoverview This file contains dashboard related functions and logic, including user greetings, navigation to various modules, quick actions, and dynamic recommendations.
 */

import { loadPage } from "./navigation.js";
import { openMenu } from "./menu.js";

const wired = new WeakSet();

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

  // 1) Hello <username>!
  const helloEl = root.querySelector(".hello");
  const username = (localStorage.getItem("username") || "").trim();
  if (helloEl) helloEl.textContent = `Hello ${username || "there"}!`;

  // 2) ☰ → Menu route (overlay lives in menu.html)
  const menuBtn = root.querySelector(".menuBtn");
  if (menuBtn) {
    menuBtn.addEventListener("click", (e) => {
      e.preventDefault();
      openMenu();
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
      page: "directOphthalmoscopy",
      img: "images/icon/eyes/core/ophth.webp",
      subtitle: "Video • Quiz",
      progress: 0,
    },
    {
      title: "Visual Acuity",
      page: "visualAcuityPage",
      img: "images/icon/eyes/core/visualacuity.webp",
      subtitle: "Video",
      progress: 0,
    },
    {
      title: "Pupils",
      page: "pupilsPage",
      img: "images/icon/eyes/core/pupils.webp",
      subtitle: "Video • Quiz",
      progress: 0,
    },
    {
      title: "Front of Eye",
      page: "anteriorSegmentVideoPage",
      img: "images/icon/eyes/core/frontofeye.webp",
      subtitle: "Video • Case Study",
      progress: 0,
    },
    {
      title: "Interactive Learning",
      page: "interactiveLearningPage",
      img: "images/icon/eyes/core/miniapp.webp",
      subtitle: "Mini Apps",
      progress: 0,
    },
  ];

  const picks = shuffle(ALL).slice(0, 2);

  host.innerHTML = picks
    .map(
      (m) => `
    <div class="module-card" data-route="${m.route || ""}" ${
      m.page ? `data-page="${m.page}"` : ""
    }>
      <img src="${m.img}" alt="${m.title}" />
      <div class="module-info">
        <h3>${m.title}</h3>
        ${m.subtitle ? `<p>${m.subtitle}</p>` : ""}
        <div class="progress-bar"><div class="progress" style="width: ${
          m.progress || 0
        }%;"></div></div>
      </div>
    </div>
  `,
    )
    .join("");

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
