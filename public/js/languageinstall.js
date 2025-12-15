/**
 * @fileoverview This file manages the language selection and PWA installation process. Handles language preference persistence, custom dropdown UI, and triggers the PWA install prompt.
 */

import { loadPage } from "./navigation.js";
import { initializePWA, canInstall, promptInstall } from "./pwa.js";
import { setLanguage, getLanguage } from "./i18n.js";
import { saveProfile, bumpRefresh } from "./telemetry.js"; // Import bumpRefresh

initializePWA();

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

          alert(
            "To install, use your browser menu: “Install app” / “Add to Home screen”.",
          );
          return; // stay on language page
        }

        // Show native install prompt
        const result = await promptInstall();

        // Accept both possible shapes:
        // - boolean true/false
        // - { outcome: 'accepted' | 'dismissed' }
        const accepted =
          result === true ||
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
          const pagesToCache = [
            "index.html",
            "style.css",
            "html/languageinstall.html",
            "html/onboarding.html",
            "html/dashboard.html",
            "html/eyes.html",
            "html/ears.html",
            "html/menu.html",
            "html/quizzes.html",
            "html/videos.html",
          ];
          sw.active?.postMessage({
            type: "CACHE_ASSETS",
            payload: pagesToCache,
          });
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
      showLanguageHintModal(
        "install the app on your device for offline access",
      );
    });
  }

  if (onlineInfoBtn) {
    onlineInfoBtn.addEventListener("click", () => {
      showLanguageHintModal("continue using the app without installing");
    });
  }
}

/**
 * Shows a small info modal explaining the selected language install option.
 * Reuses the guest modal look and feel.
 * @param {string} message - Body text to show inside the modal.
 */
function showLanguageHintModal(message) {
  // Prevent duplicates
  if (document.getElementById("hintModalOverlay")) return;

  const modal = document.createElement("div");
  modal.id = "hintModalOverlay";
  modal.setAttribute("role", "dialog");
  modal.setAttribute("aria-modal", "true");

  modal.innerHTML = `
    <div class="guest-modal">
      <button class="guest-modal__close" aria-label="Close">&times;</button>
      <h2 class="guest-modal__title"></h2>
      <p class="guest-modal__text">${message}</p>
      <button class="guest-modal__cta" type="button">OK</button>
    </div>
  `;

  document.body.appendChild(modal);

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
  caret.innerHTML = "&#x25BE;";
  caret.style.position = "absolute";
  caret.style.right = "12px";
  caret.style.pointerEvents = "none";
  caret.style.fontSize = "22px";
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
      right.innerHTML = `<strong>${native}</strong>`;

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

    if (current.value === "en") {
      label.innerHTML = `<span>${english}</span>`; // single column
    } else {
      label.innerHTML = `
        <span>${english}</span>
        <span><strong>${native}</strong></span>
      `;
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
