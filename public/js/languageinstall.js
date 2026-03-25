/**
 * @fileoverview This file manages the language selection and PWA installation process. Handles language preference persistence, custom dropdown UI, and triggers the PWA install prompt.
 */

import { loadPage } from "./navigation.js";
import { initializePWA, canInstall, promptInstall } from "./pwa.js";
import { setLanguage, getLanguage } from "./i18n.js";
import { saveProfile, bumpRefresh } from "./telemetry.js"; // Import bumpRefresh

const STATIC_CACHE_NAME = "arclight-static-v4";
const CHILDHOOD_EYE_SCREENING_PILOT_PAGE_IDS = [
  "assessmentVisionPage",
  "mumVisionPage",
  "usaidHowToUseArclightPage",
  "usaidFundalReflexExamPage",
  "usaidNormalAbnormalPage",
];
const CHILDHOOD_EYE_SCREENING_PILOT_VIDEO_URLS = [
  "/videos/Core/VisualAcuity/VA_Assessment_220p.mp4",
  "/videos/Core/VisualAcuity/VA_Assessment_720p.mp4",
  "/videos/Core/VisualAcuity/VA_Mum_220p.mp4",
  "/videos/Core/VisualAcuity/VA_Mum_720p.mp4",
  "/videos/USAID Childhood eye screening/1. How to use the Arclight - ENGLISH - HD_220p.mp4",
  "/videos/USAID Childhood eye screening/1. How to use the Arclight - ENGLISH - HD_720p.mp4",
  "/videos/USAID Childhood eye screening/FundalReflexUSAID_220p.mp4",
  "/videos/USAID Childhood eye screening/FundalReflexUSAID_720p.mp4",
  "/videos/USAID Childhood eye screening/4. Normal and Abnormal findings - ENGLISH - HD_220p.mp4",
  "/videos/USAID Childhood eye screening/4. Normal and Abnormal findings - ENGLISH - HD_720p.mp4",
];
const CHILDHOOD_EYE_SCREENING_SUBTITLE_LANGUAGES = new Set([
  "en",
  "am",
  "ar",
  "bn",
  "ny",
  "zh",
  "fr",
  "ha",
  "hi",
  "ig",
  "id",
  "rw",
  "ko",
  "ln",
  "fa",
  "pt",
  "sn",
  "es",
  "sw",
  "te",
  "ur",
  "yo",
  "zu",
]);

initializePWA();

function normalizeChildhoodPilotSubtitleCacheLanguage(lang) {
  const normalized = String(lang || "")
    .trim()
    .toLowerCase();
  return CHILDHOOD_EYE_SCREENING_SUBTITLE_LANGUAGES.has(normalized)
    ? normalized
    : "en";
}

export function buildChildhoodEyeScreeningPilotCacheUrls(lang = "en") {
  const chosenLang = normalizeChildhoodPilotSubtitleCacheLanguage(lang);
  const subtitleLangs = Array.from(new Set(["en", chosenLang]));
  const subtitleUrls = [];

  CHILDHOOD_EYE_SCREENING_PILOT_PAGE_IDS.forEach((pageId) => {
    subtitleLangs.forEach((subtitleLang) => {
      subtitleUrls.push(
        `/video-subtitles/childhood-eye-screening/${pageId}/${subtitleLang}.vtt`,
      );
    });
  });

  return Array.from(
    new Set([
      "/video-localization/childhood-eye-screening.json",
      ...CHILDHOOD_EYE_SCREENING_PILOT_VIDEO_URLS,
      ...subtitleUrls,
    ]),
  );
}

/**
 * Initializes the language installation page.
 * Sets up language preference handling, builds a custom language selection dropdown,
 * and configures event listeners for the 'Install App' and 'Use Online' buttons.
 */
export function initializeLanguageInstall() {
  const installBtn = document.getElementById("installAppBtn");
  const useOnlineBtn = document.getElementById("useOnlineBtn");
  const langSelect = document.getElementById("prefLang"); // matches HTML

  // ——— keep English as default unless previously chosen ———
  if (langSelect) {
    const saved = localStorage.getItem("prefLang");

    if (
      saved &&
      Array.from(langSelect.options).some((o) => o.value === saved)
    ) {
      // user had chosen before → restore it
      langSelect.value = saved;
    } else {
      // first run (no saved pref) → force English
      langSelect.value = "en";
      localStorage.setItem("prefLang", "en"); // baseline default
    }

    // Persist future user choices
    langSelect.addEventListener("change", async () => {
      localStorage.setItem("prefLang", langSelect.value);
      try {
        await saveProfile({ language: langSelect.value });
        // Tell the rest of the app immediately (Dev Dashboard can listen to this)
        document.dispatchEvent(
          new CustomEvent("language:updated", {
            detail: { code: langSelect.value },
          }),
        );

        // Best effort: ping backend to speed up visibility server-side.
        // But don't block the UI if the server 500s.
        try {
          await bumpRefresh();
          document.dispatchEvent(new CustomEvent("telemetry:refreshed"));
        } catch (err) {
          console.warn("bumpRefresh failed after language update:", err);
        }
      } catch {
        void 0;
      }
    });
  }

  // ——— build custom dropdown UI inside .lang-install__select-wrap ———
  if (langSelect && langSelect.closest(".lang-install__select-wrap")) {
    buildCustomLangSelect(langSelect);

    const refreshCustomLangSelect = () => {
      buildCustomLangSelect(langSelect);
    };

    window.addEventListener("i18n:languageChanged", refreshCustomLangSelect);
    document.addEventListener("language:updated", refreshCustomLangSelect);
  }

  // Set initial select value from saved pref
  if (langSelect) {
    const saved = getLanguage();
    if (saved) langSelect.value = saved;
    // Update app language immediately when changed
    langSelect.addEventListener("change", async (e) => {
      await setLanguage(e.target.value);
    });
  }

  function isIOS() {
    const ua = navigator.userAgent || "";
    const iOSDevice = /iPad|iPhone|iPod/.test(ua);
    const iPadOS13Plus = /Macintosh/.test(ua) && "ontouchend" in document;
    return iOSDevice || iPadOS13Plus;
  }

  function isAndroid() {
    const ua = navigator.userAgent || "";
    return /Android/.test(ua);
  }

  function getInstallHelpTemplateId() {
    if (isIOS()) {
      return "languageInstallHelpIos";
    }
    if (isAndroid()) {
      return "languageInstallHelpAndroid";
    }
    return "languageInstallHelpDefault";
  }
  // Install flow
  if (installBtn) {
    installBtn.addEventListener("click", async () => {
      try {
        if (!canInstall()) {
          const isStandalone =
            window.matchMedia?.("(display-mode: standalone)")?.matches ||
            window.navigator.standalone === true;
          if (isStandalone) {
            loadPage("onboarding");
            return;
          }

          showLanguageHintModal(getInstallHelpTemplateId());
          return; // stay on language page
        }

        // Show native install prompt
        const result = await promptInstall();

        // promptInstall() in pwa.js returns a string: 'accepted' | 'dismissed'
        const accepted =
          result === true ||
          result === "accepted" ||
          (typeof result === "object" &&
            result &&
            result.outcome === "accepted");

        if (!accepted) {
          // User cancelled → stay on language page
          console.warn(
            "[install] user dismissed install prompt; staying on page",
          );
          return;
        }

        // Accepted → warm cache (best-effort) then advance
        try {
          const sw = await navigator.serviceWorker.ready;
          const chosen =
            (langSelect && langSelect.value) || getLanguage() || "en";

          const pagesToCache = [
            "/index.html",
            "/html/languageinstall.html",
            "/html/onboarding.html",
            "/html/dashboard.html",
            "/html/eyes.html",
            "/html/ears.html",
            "/html/menu.html",
            "/html/quizzes.html",
            "/html/videos.html",

            // Glaucoma workshop html pages
            "/html/glaucomaWorkshop.html",
            "/html/glaucomascrollImages.html",
            "/html/glaucomaQuizCaseStudy.html",

            // JS needed for glaucoma workshop + videos
            "/js/glaucomaWorkshop.js",
            "/js/videos.js",
            "/js/videoplayer.js",
          ];

          // Glaucoma workshop + learning assets (explicit list)
          const glaucomaAssetsToCache = [
            "/images/learning/GlaucomaACD/flashlight.webp",
            "/images/learning/GlaucomaACD/eyes.webp",
            "/images/learning/GlaucomaACD/flashlightoff.webp",
            "/images/learning/GlaucomaACD/normalflash.webp",
            "/images/learning/GlaucomaACD/normalarrow.webp",
            "/images/learning/GlaucomaACD/shallowflash.webp",
            "/images/learning/GlaucomaACD/shallowarrow.webp",
            "/images/learning/GlaucomaRAPD/flashlight.webp",
            "/images/learning/GlaucomaRAPD/eyes.webp",

            // Glaucoma workshop images (match glaucomaWorkshop.js exactly)

            // 01 Introduction
            "/images/pdf/Workshop/Glaucoma/01Introduction/01.jpg",
            "/images/pdf/Workshop/Glaucoma/01Introduction/02.jpg",
            "/images/pdf/Workshop/Glaucoma/01Introduction/03.jpg",
            "/images/pdf/Workshop/Glaucoma/01Introduction/04.jpg",
            "/images/pdf/Workshop/Glaucoma/01Introduction/05.jpg",

            // 02 Anatomy
            "/images/pdf/Workshop/Glaucoma/02Anatomy/01.jpg",
            "/images/pdf/Workshop/Glaucoma/02Anatomy/02.jpg",
            "/images/pdf/Workshop/Glaucoma/02Anatomy/03.jpg",
            "/images/pdf/Workshop/Glaucoma/02Anatomy/04.jpg",
            "/images/pdf/Workshop/Glaucoma/02Anatomy/05.jpg",
            "/images/pdf/Workshop/Glaucoma/02Anatomy/06.jpg",
            "/images/pdf/Workshop/Glaucoma/02Anatomy/07.jpg",

            // 03 Diagnosis
            "/images/pdf/Workshop/Glaucoma/03Diagnosis/01.jpg",
            "/images/pdf/Workshop/Glaucoma/03Diagnosis/02.jpg",
            "/images/pdf/Workshop/Glaucoma/03Diagnosis/03.jpg",
            "/images/pdf/Workshop/Glaucoma/03Diagnosis/04.jpg",
            "/images/pdf/Workshop/Glaucoma/03Diagnosis/05.jpg",
            "/images/pdf/Workshop/Glaucoma/03Diagnosis/06.jpg",
            "/images/pdf/Workshop/Glaucoma/03Diagnosis/07.jpg",
            "/images/pdf/Workshop/Glaucoma/03Diagnosis/08.jpg",
            "/images/pdf/Workshop/Glaucoma/03Diagnosis/09.jpg",
            "/images/pdf/Workshop/Glaucoma/03Diagnosis/10.jpg",
            "/images/pdf/Workshop/Glaucoma/03Diagnosis/11.jpg",
            "/images/pdf/Workshop/Glaucoma/03Diagnosis/12.jpg",
            "/images/pdf/Workshop/Glaucoma/03Diagnosis/13.jpg",
            "/images/pdf/Workshop/Glaucoma/03Diagnosis/14.jpg",
            "/images/pdf/Workshop/Glaucoma/03Diagnosis/15.jpg",

            // 04 Types
            "/images/pdf/Workshop/Glaucoma/04Types/01.jpg",
            "/images/pdf/Workshop/Glaucoma/04Types/02.jpg",
            "/images/pdf/Workshop/Glaucoma/04Types/03.jpg",
            "/images/pdf/Workshop/Glaucoma/04Types/04.jpg",
            "/images/pdf/Workshop/Glaucoma/04Types/05.jpg",
            "/images/pdf/Workshop/Glaucoma/04Types/06.jpg",
            "/images/pdf/Workshop/Glaucoma/04Types/07.jpg",
            "/images/pdf/Workshop/Glaucoma/04Types/08.jpg",
            "/images/pdf/Workshop/Glaucoma/04Types/09.jpg",
            "/images/pdf/Workshop/Glaucoma/04Types/10.jpg",

            // 05 Cupping
            "/images/pdf/Workshop/Glaucoma/05Cupping/01.jpg",
            "/images/pdf/Workshop/Glaucoma/05Cupping/02.jpg",
            "/images/pdf/Workshop/Glaucoma/05Cupping/03.jpg",
            "/images/pdf/Workshop/Glaucoma/05Cupping/04.jpg",
            "/images/pdf/Workshop/Glaucoma/05Cupping/05.jpg",
            "/images/pdf/Workshop/Glaucoma/05Cupping/06.jpg",

            // 06 Summary
            "/images/pdf/Workshop/Glaucoma/06Summary/01.jpg",
            "/images/pdf/Workshop/Glaucoma/06Summary/02.jpg",
            "/images/pdf/Workshop/Glaucoma/06Summary/03.jpg",
            "/images/pdf/Workshop/Glaucoma/06Summary/04.jpg",
            "/images/pdf/Workshop/Glaucoma/06Summary/05.jpg",
            "/images/pdf/Workshop/Glaucoma/06Summary/06.jpg",
            "/images/pdf/Workshop/Glaucoma/06Summary/07.jpg",
            "/images/pdf/Workshop/Glaucoma/06Summary/08.jpg",

            // Glaucoma workshop videos (match videos.js sources exactly)
            "/videos/Workshop/Glaucoma/pupilreaction_220p.mp4",
            "/videos/Workshop/Glaucoma/pupilreaction_720p.mp4",

            "/videos/Workshop/Glaucoma/FRsignsglaucoma_220p.mp4",
            "/videos/Workshop/Glaucoma/FRsignsglaucoma_720p.mp4",

            "/videos/Workshop/Glaucoma/FRACD_220p.mp4",
            "/videos/Workshop/Glaucoma/FRACD_720p.mp4",

            "/videos/Workshop/Glaucoma/FRACAG_220p.mp4",
            "/videos/Workshop/Glaucoma/FRACAG_720p.mp4",

            "/videos/Workshop/Glaucoma/FRDisease_220p.mp4",
            "/videos/Workshop/Glaucoma/FRDisease_720p.mp4",

            "/videos/Workshop/Glaucoma/opticdiseases_220p.mp4",
            "/videos/Workshop/Glaucoma/opticdiseases_720p.mp4",

            "/videos/Workshop/Glaucoma/DO_discsannotated_220p.mp4",
            "/videos/Workshop/Glaucoma/DO_discsannotated_720p.mp4",

            "/videos/Workshop/Glaucoma/BE_opticdiscanatomy_220p.mp4",
            "/videos/Workshop/Glaucoma/BE_opticdiscanatomy_720p.mp4",

            "/videos/Workshop/Glaucoma/BE_Margin_220p.mp4",
            "/videos/Workshop/Glaucoma/BE_Margin_720p.mp4",

            "/videos/Workshop/Glaucoma/BE_disccuppingonly_220p.mp4",
            "/videos/Workshop/Glaucoma/BE_disccuppingonly_720p.mp4",
          ];

          const childhoodPilotAssetsToCache =
            buildChildhoodEyeScreeningPilotCacheUrls(chosen);
          const urlsToCache = Array.from(
            new Set([
              ...pagesToCache,
              ...glaucomaAssetsToCache,
              ...childhoodPilotAssetsToCache,
            ]),
          );

          sw.active?.postMessage({
            type: "CACHE_URLS",
            payload: urlsToCache,
            cacheName: STATIC_CACHE_NAME,
          });
          console.warn("[install] sent CACHE_URLS to SW:", urlsToCache.length);

          console.warn(
            "[install] sent CACHE_ASSETS to SW:",
            pagesToCache.length,
          );
        } catch (err) {
          console.warn("[install] could not warm cache:", err);
        }

        try {
          const chosen =
            (langSelect && langSelect.value) || getLanguage() || "en";
          await saveProfile({ language: chosen });
          // Tell the rest of the app immediately (Dev Dashboard can listen to this)
          document.dispatchEvent(
            new CustomEvent("language:updated", {
              detail: { code: chosen },
            }),
          );

          // Best effort: ping backend to speed up visibility server-side.
          // But don't block the UI if the server 500s.
          try {
            await bumpRefresh();
            document.dispatchEvent(new CustomEvent("telemetry:refreshed"));
          } catch (err) {
            console.warn("bumpRefresh failed after language update:", err);
          }
        } catch {
          void 0;
        }
        loadPage("onboarding");
        return;
      } catch (e) {
        console.warn("Install prompt failed or not available:", e);

        // Fallback: if we’re already installed, proceed to onboarding
        const isStandalone =
          window.matchMedia?.("(display-mode: standalone)")?.matches ||
          window.navigator.standalone === true;
        if (isStandalone) {
          loadPage("onboarding");
          return;
        }

        // Otherwise, stay on this page
        return;
      }
    });
  }
  if (useOnlineBtn) {
    useOnlineBtn.addEventListener("click", async () => {
      try {
        const chosen =
          (langSelect && langSelect.value) || getLanguage() || "en";
        await saveProfile({ language: chosen });
        // Tell the rest of the app immediately (Dev Dashboard can listen to this)
        document.dispatchEvent(
          new CustomEvent("language:updated", {
            detail: { code: chosen },
          }),
        );

        // Best effort: ping backend to speed up visibility server-side.
        // But don't block the UI if the server 500s.
        try {
          await bumpRefresh();
          document.dispatchEvent(new CustomEvent("telemetry:refreshed"));
        } catch (err) {
          console.warn("bumpRefresh failed after language update:", err);
        }
      } catch {
        void 0;
      }
      loadPage("onboarding");
    });
  }

  // --- Info buttons for offline vs online hint text ---
  const offlineInfoBtn = document.getElementById("offlineInfoBtn");
  const onlineInfoBtn = document.getElementById("onlineInfoBtn");

  if (offlineInfoBtn) {
    offlineInfoBtn.addEventListener("click", () => {
      showLanguageHintModal("languageInstallHintOffline");
    });
  }

  if (onlineInfoBtn) {
    onlineInfoBtn.addEventListener("click", () => {
      showLanguageHintModal("languageInstallHintOnline");
    });
  }
}

/**
 * Shows a small info modal explaining the selected language install option.
 * Reuses the guest modal look and feel.
 * @param {string} templateId - Template id to render inside the modal body.
 */
function showLanguageHintModal(templateId) {
  // Prevent duplicates
  if (document.getElementById("hintModalOverlay")) return;

  const modalTemplate = document.getElementById(
    "languageInstallHintModalTemplate",
  );
  if (!modalTemplate) return;

  const modal = modalTemplate.content
    .querySelector("#hintModalOverlay")
    ?.cloneNode(true);

  if (!modal) return;

  const messageHost = modal.querySelector(".guest-modal__text");
  const messageTemplate = document.getElementById(templateId);
  if (messageHost && messageTemplate) {
    messageHost.appendChild(messageTemplate.content.cloneNode(true));
  }

  document.body.appendChild(modal);
  window.I18N?.applyTranslations?.(modal);

  const close = () => {
    modal.classList.add("fade-out");
    setTimeout(() => modal.remove(), 250);
  };

  modal.querySelector(".guest-modal__close")?.addEventListener("click", close);
  modal.querySelector(".guest-modal__cta")?.addEventListener("click", close);

  modal.addEventListener("click", (e) => {
    if (e.target === modal) close();
  });
}

/**
 * Builds a custom styled dropdown UI for language selection, replacing the native <select> element.
 * The native <select> is hidden but kept in the DOM for accessibility and form value handling.
 * @param {HTMLSelectElement} selectEl - The native <select> element to be replaced by the custom UI.
 */
function buildCustomLangSelect(selectEl) {
  const wrap = selectEl.closest(".lang-install__select-wrap");
  if (!wrap) return;

  wrap
    .querySelectorAll("[data-custom-lang-select]")
    .forEach((el) => el.remove());

  // Hide native select but keep it in the DOM for accessibility
  selectEl.style.position = "absolute";
  selectEl.style.opacity = "0";
  selectEl.style.pointerEvents = "none";
  selectEl.style.width = "0";
  selectEl.style.height = "0";

  // Control (closed state)
  const ctrl = document.createElement("button");
  ctrl.type = "button";
  ctrl.setAttribute("aria-haspopup", "listbox");
  ctrl.setAttribute("aria-expanded", "false");
  ctrl.setAttribute("data-custom-lang-select", "true");

  // Match black page style
  ctrl.style.width = "100%";
  ctrl.style.height = "40px";
  ctrl.style.borderRadius = "13px";
  ctrl.style.background = "transparent";
  ctrl.style.border = "1px solid #fff";
  ctrl.style.color = "#fff";
  ctrl.style.padding = "8px 40px 8px 14px";
  ctrl.style.fontSize = "12px";
  ctrl.style.display = "flex";
  ctrl.style.alignItems = "center";
  ctrl.style.justifyContent = "space-between";
  ctrl.style.position = "relative";

  // Chevron
  const caret = document.createElement("span");
  caret.textContent = "\u25BE";
  caret.style.position = "absolute";
  caret.style.right = "12px";
  caret.style.pointerEvents = "none";
  caret.style.fontSize = "25px";
  caret.style.width = "17px";

  // Label (two-column inside the "select" box)
  const label = document.createElement("div");
  label.style.width = "100%";
  label.style.display = "flex";
  label.style.justifyContent = "space-between";
  label.style.gap = "12px";

  // Dropdown list
  const list = document.createElement("ul");
  list.setAttribute("role", "listbox");
  list.setAttribute("data-custom-lang-select", "true");
  list.style.position = "absolute";
  list.style.left = "0";
  list.style.right = "0";
  list.style.top = "calc(100% + 6px)";
  list.style.background = "#fff";
  list.style.color = "#111";
  list.style.borderRadius = "12px";
  list.style.padding = "6px 0";
  list.style.margin = "0";
  list.style.listStyle = "none";
  list.style.maxHeight = "210px";
  list.style.overflowY = "auto";
  list.style.boxShadow = "0 4px 10px rgba(0,0,0,0.12)";
  list.style.zIndex = "10000";
  list.style.display = "none";

  // Build options (li)
  Array.from(selectEl.options).forEach((opt) => {
    const li = document.createElement("li");
    li.setAttribute("role", "option");
    li.dataset.value = opt.value;

    li.style.padding = "10px 12px";
    li.style.cursor = "pointer";

    const row = document.createElement("div");
    row.style.display = "flex";
    row.style.justifyContent = "space-between";
    row.style.alignItems = "center";
    row.style.gap = "12px";
    row.style.fontSize = "12px";

    const english = (opt.textContent || "").replace(/\s*\(.*\)\s*/g, "").trim();
    const native = opt.getAttribute("data-native") || english;

    if (opt.value === "en") {
      row.textContent = english; // only left side
    } else {
      const left = document.createElement("span");
      left.textContent = english;

      const right = document.createElement("span");
      const rightStrong = document.createElement("strong");
      rightStrong.textContent = native;
      right.appendChild(rightStrong);

      row.appendChild(left);
      row.appendChild(right);
    }

    li.appendChild(row);

    li.addEventListener("mouseenter", () => {
      li.style.background = "#f5f5f5";
    });
    li.addEventListener("mouseleave", () => {
      li.style.background = "transparent";
    });
    li.addEventListener("click", () => {
      selectEl.value = opt.value;
      updateLabel();
      list.style.display = "none";
      ctrl.setAttribute("aria-expanded", "false");
      selectEl.dispatchEvent(new Event("change", { bubbles: true }));
    });

    list.appendChild(li);
  });

  /**
   * Updates the displayed label of the custom language select control
   * to reflect the currently selected language, showing both English and native names.
   */
  function updateLabel() {
    const current = selectEl.options[selectEl.selectedIndex];
    const english = (current.textContent || "")
      .replace(/\s*\(.*\)\s*/g, "")
      .trim();
    const native = current.getAttribute("data-native") || english;

    label.textContent = "";
    const left = document.createElement("span");
    left.textContent = english;
    label.appendChild(left);

    if (current.value !== "en") {
      const right = document.createElement("span");
      const rightStrong = document.createElement("strong");
      rightStrong.textContent = native;
      right.appendChild(rightStrong);
      label.appendChild(right);
    }
  }

  ctrl.addEventListener("click", () => {
    const open = list.style.display === "block";
    list.style.display = open ? "none" : "block";
    ctrl.setAttribute("aria-expanded", String(!open));
  });

  // Click-away to close
  document.addEventListener("click", (e) => {
    if (!wrap.contains(e.target)) {
      list.style.display = "none";
      ctrl.setAttribute("aria-expanded", "false");
    }
  });

  updateLabel();
  ctrl.appendChild(label);
  ctrl.appendChild(caret);
  wrap.style.position = "relative"; // ensure absolute list anchors to wrapper
  wrap.appendChild(ctrl);
  wrap.appendChild(list);
}
