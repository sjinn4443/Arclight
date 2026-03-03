// language-picker.js
(function () {
  const overlay = document.getElementById("languagePickerOverlay");
  const closeBtn = document.getElementById("closeLangPickerBtn");

  const selectEl = document.getElementById("languagePickerSelect"); // hidden source-of-truth
  const toggleBtn = document.getElementById("langPickerToggle"); // collapsed bar
  const currentEl = document.getElementById("langPickerCurrent"); // text in the bar
  const listEl = document.getElementById("languagePickerList"); // dropdown list
  let pickerOptionsHydratePromise = null;
  let pickerOptionsHydrated = false;
  const nativeByCode = {
    en: "English",
    am: "\u12A0\u121B\u122D\u129B",
    ar: "\u0627\u0644\u0639\u0631\u0628\u064A\u0629",
    bn: "\u09AC\u09BE\u0982\u09B2\u09BE",
    ny: "Chinyanja",
    zh: "\u4E2D\u6587",
    fr: "Fran\u00E7ais",
    ha: "Hausa",
    hi: "\u0939\u093F\u0928\u094D\u0926\u0940",
    ig: "\u00CDgb\u00F2",
    id: "Bahasa Indonesia",
    rw: "Ikinyarwanda",
    ko: "\uD55C\uAD6D\uC5B4",
    te: "\u0C24\u0C46\u0C32\u0C41\u0C17\u0C41",
    ln: "Ling\u00E1la",
    fa: "\u0641\u0627\u0631\u0633\u06CC",
    sn: "ChiShona",
    es: "Espa\u00F1ol",
    sw: "Kiswahili",
    ur: "\u0627\u0631\u062F\u0648",
    yo: "Yor\u00F9b\u00E1",
    zu: "isiZulu",
  };

  async function hydratePickerOptionsFromLanguageInstall() {
    if (!selectEl) return;
    if (pickerOptionsHydrated) return;
    if (pickerOptionsHydratePromise) {
      await pickerOptionsHydratePromise;
      return;
    }

    pickerOptionsHydratePromise = (async () => {
      const candidates = [
        "/html/languageinstall.html",
        "html/languageinstall.html",
      ];
      let res = null;

      for (const url of candidates) {
        try {
          const attempt = await fetch(url, {
            credentials: "same-origin",
            cache: "no-store",
          });
          if (attempt.ok) {
            res = attempt;
            break;
          }
        } catch {
          // Try the next candidate.
        }
      }
      if (!res) return;

      const html = await res.text();
      const doc = new DOMParser().parseFromString(html, "text/html");
      const pref = doc.querySelector("#prefLang");
      if (!pref) return;

      const options = [...pref.querySelectorAll("option")];
      if (!options.length) return;

      selectEl.innerHTML = "";
      options.forEach((opt) => {
        selectEl.appendChild(opt.cloneNode(true));
      });
      pickerOptionsHydrated = true;
    })()
      .catch(() => {
        // Keep existing fallback options if fetch/parse fails.
      })
      .finally(() => {
        pickerOptionsHydratePromise = null;
      });

    await pickerOptionsHydratePromise;
  }

  async function openModal() {
    overlay.hidden = false;
    document.body.style.overflow = "hidden";
    await hydratePickerOptionsFromLanguageInstall();
    buildListFromInstallSelect();
    setBarLabelFromCurrent();
    collapseDropdown();
  }

  function closeModal() {
    overlay.hidden = true;
    document.body.style.overflow = "";
    collapseDropdown();
  }

  function closeMenuOverlayIfOpen() {
    const menuOverlay = document.querySelector("#menuOverlay.menu-overlay");
    if (!menuOverlay) return;
    menuOverlay.classList.add("hidden");
    menuOverlay.classList.remove("open", "is-visible");
    document.body.removeAttribute("data-menu-open");
  }

  function expandDropdown() {
    listEl.hidden = false;
    toggleBtn.setAttribute("aria-expanded", "true");
  }

  function collapseDropdown() {
    listEl.hidden = true;
    toggleBtn.setAttribute("aria-expanded", "false");
  }

  function setBarLabelFromCurrent() {
    // Prefer current selection from #prefLang if present; else from hidden select; else default 'English'
    const installSelect = document.getElementById("prefLang");
    const src = installSelect || selectEl;
    let label = "English";
    if (src) {
      const opt = src.options[src.selectedIndex] || src.options[0];
      if (opt) label = (opt.textContent || "English").trim();
    }
    currentEl.textContent = label;
  }

  // Build two-column list from Language Install select, falling back to hidden select
  function buildListFromInstallSelect() {
    const installSelect = document.getElementById("prefLang");
    const source = installSelect || selectEl;
    if (!source || !listEl) return;

    listEl.textContent = "";
    [...source.options].forEach((opt) => {
      const code = opt.value;
      const english = (opt.textContent || "").trim();
      const attrNative = (opt.getAttribute("data-native") || "").trim();
      const englishNorm = english.toLocaleLowerCase();
      const nativeAttrNorm = attrNative.toLocaleLowerCase();
      const nativeLooksFallback = !attrNative || nativeAttrNorm === englishNorm;
      const native = (
        nativeLooksFallback ? nativeByCode[code] || english : attrNative
      ).trim();

      const li = document.createElement("li");
      li.className = "lang-install__item";
      li.setAttribute("role", "option");
      li.setAttribute("tabindex", "0");
      li.dataset.code = code;
      const en = document.createElement("span");
      en.className = "lang-install__item-en";
      en.textContent = english;
      const nativeEl = document.createElement("span");
      nativeEl.className = "lang-install__item-native";
      nativeEl.textContent = native;
      li.appendChild(en);
      li.appendChild(nativeEl);

      const choose = () => applyLanguage(code, installSelect, english);
      li.addEventListener("click", choose);
      li.addEventListener("keydown", (e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          choose();
        }
      });

      listEl.appendChild(li);
    });
  }

  // Apply language exactly like the Language Install page
  async function applyLanguage(code, installSelect, englishLabel) {
    try {
      if (installSelect) {
        installSelect.value = code;
        installSelect.dispatchEvent(new Event("change", { bubbles: true }));
      }

      if (window.I18N?.setLanguage) {
        await window.I18N.setLanguage(code);
        window.I18N.applyTranslations?.();
      } else {
        window.I18N?.applyTranslations?.();
      }

      try {
        localStorage.setItem("prefLang", code);
      } catch {
        void 0;
      }

      document.documentElement.setAttribute("lang", code);
      currentEl.textContent = englishLabel || currentEl.textContent;
    } finally {
      closeModal();
    }
  }

  // --- Events ---
  closeBtn?.addEventListener("click", closeModal);

  // Bar toggles dropdown open/close
  toggleBtn?.addEventListener("click", (e) => {
    e.preventDefault();
    if (listEl.hidden) expandDropdown();
    else collapseDropdown();
  });

  // Click outside to close dropdown (or close modal if outside panel)
  overlay?.addEventListener("click", (e) => {
    const panel = e.target.closest(".lang-install__modal");
    if (!panel) {
      closeModal();
      return;
    }
    // If clicking outside the dropdown while it’s open, just collapse list
    if (!e.target.closest(".lang-picker")) collapseDropdown();
  });

  // Close on Escape (dropdown first, then modal)
  document.addEventListener("keydown", (e) => {
    if (e.key !== "Escape" || overlay.hidden) return;
    if (!listEl.hidden) {
      collapseDropdown();
      e.stopPropagation();
      return;
    }
    closeModal();
  });

  // Intercept only the menu "Language" item to open modal.
  // Use capture so we stop menu route navigation before it runs.
  document.addEventListener(
    "click",
    (e) => {
      const btn = e.target.closest(
        '#menuOverlay .menu-item[data-route="languageinstall"]',
      );
      if (!btn) return;
      e.preventDefault();
      e.stopPropagation();
      closeMenuOverlayIfOpen();
      openModal();
    },
    true,
  );
})();
