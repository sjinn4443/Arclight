// language-picker.js
(function () {
  const DEFAULT_LANGUAGE_CODE = "en";
  const overlay = document.getElementById("languagePickerOverlay");
  const closeBtn = document.getElementById("closeLangPickerBtn");

  const selectEl = document.getElementById("languagePickerSelect"); // hidden source-of-truth
  const toggleBtn = document.getElementById("langPickerToggle"); // collapsed bar
  const currentEl = document.getElementById("langPickerCurrent"); // text in the bar
  const listEl = document.getElementById("languagePickerList"); // dropdown list
  let pickerOptionsHydratePromise = null;
  let pickerOptionsHydrated = false;
  currentEl?.setAttribute("data-i18n-skip", "true");
  listEl?.setAttribute("data-i18n-skip", "true");
  function getCurrentLanguageCode() {
    return (
      window.I18N?.getLanguage?.() ||
      localStorage.getItem("prefLang") ||
      document.documentElement.getAttribute("lang") ||
      DEFAULT_LANGUAGE_CODE
    );
  }

  function syncSelectToLanguage(select, code) {
    if (!select) return;
    const next = String(code || "").trim() || DEFAULT_LANGUAGE_CODE;
    if ([...select.options].some((opt) => opt.value === next)) {
      select.value = next;
    }
  }

  function syncPickerSelection(code = getCurrentLanguageCode()) {
    syncSelectToLanguage(selectEl, code);
    syncSelectToLanguage(document.getElementById("prefLang"), code);
  }

  function markSelectedLanguage(code = getCurrentLanguageCode()) {
    if (!listEl) return;
    [...listEl.children].forEach((item) => {
      const selected = item.dataset.code === code;
      item.setAttribute("aria-selected", selected ? "true" : "false");
      item.classList.toggle("is-selected", selected);
    });
  }

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
    if (!overlay) return;
    overlay.hidden = false;
    document.body.style.overflow = "hidden";
    await hydratePickerOptionsFromLanguageInstall();
    syncPickerSelection();
    buildListFromInstallSelect();
    setBarLabelFromCurrent();
    collapseDropdown();
  }

  function closeModal() {
    if (!overlay) return;
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
    syncPickerSelection();

    // Prefer current selection from #prefLang if present; else from hidden select.
    const installSelect = document.getElementById("prefLang");
    const src = installSelect || selectEl;
    const option = src?.selectedOptions[0];
    currentEl.lang = option?.value || DEFAULT_LANGUAGE_CODE;
    currentEl.dir = "auto";
    currentEl.textContent =
      (option?.dataset.native || option?.textContent)?.trim() || "English";
    markSelectedLanguage(src?.value || getCurrentLanguageCode());
  }

  function buildListFromInstallSelect() {
    const installSelect = document.getElementById("prefLang");
    const source = installSelect || selectEl;
    if (!source || !listEl) return;

    listEl.setAttribute("data-i18n-skip", "true");
    listEl.textContent = "";
    [...source.options].forEach((opt) => {
      const code = String(opt.value || "").trim();
      const li = document.createElement("li");
      li.className = "lang-install__item";
      li.setAttribute("role", "option");
      li.setAttribute("tabindex", "0");
      li.setAttribute("data-i18n-skip", "true");
      li.setAttribute(
        "aria-selected",
        code === getCurrentLanguageCode() ? "true" : "false",
      );
      li.dataset.code = code;
      li.lang = code;
      li.dir = "auto";
      li.textContent = (opt.dataset.native || opt.textContent).trim();

      const choose = () => applyLanguage(code, installSelect);
      li.addEventListener("click", choose);
      li.addEventListener("keydown", (e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          choose();
        }
      });

      listEl.appendChild(li);
    });

    markSelectedLanguage(source.value || getCurrentLanguageCode());
  }

  // Apply language exactly like the Language Install page
  async function applyLanguage(code, installSelect) {
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
      syncPickerSelection(code);
      setBarLabelFromCurrent();
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
    if (e.key !== "Escape" || !overlay || overlay.hidden) return;
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
      const target = e.target;
      if (!(target instanceof Element)) return;
      const btn = target.closest('[data-route="languageinstall"]');
      if (!btn) return;
      if (btn === document.body || btn === document.documentElement) return;
      const opensLanguagePicker =
        btn.id === "openLanguageModal" ||
        btn.matches("[data-dashboard-language]") ||
        btn.closest("#menuOverlay, #myProfilePage");
      if (!opensLanguagePicker) return;
      if (!overlay) return;
      e.preventDefault();
      e.stopPropagation();
      closeMenuOverlayIfOpen();
      void openModal();
    },
    true,
  );

  window.addEventListener("i18n:languageChanged", () => {
    syncPickerSelection();
    setBarLabelFromCurrent();
  });

  window.addEventListener("storage", (e) => {
    if (e.key !== "prefLang") return;
    syncPickerSelection();
    setBarLabelFromCurrent();
  });
})();
