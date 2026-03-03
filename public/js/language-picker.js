// language-picker.js
(function () {
  const overlay = document.getElementById("languagePickerOverlay");
  const closeBtn = document.getElementById("closeLangPickerBtn");

  const selectEl = document.getElementById("languagePickerSelect"); // hidden source-of-truth
  const toggleBtn = document.getElementById("langPickerToggle"); // collapsed bar
  const currentEl = document.getElementById("langPickerCurrent"); // text in the bar
  const listEl = document.getElementById("languagePickerList"); // dropdown list

  function openModal() {
    overlay.hidden = false;
    document.body.style.overflow = "hidden";
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
      const native = (opt.getAttribute("data-native") || english).trim();

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
    if (installSelect) {
      installSelect.value = code;
      installSelect.dispatchEvent(new Event("change", { bubbles: true }));
      currentEl.textContent = englishLabel || currentEl.textContent;
      closeModal(); // close popup after selection
      return;
    }
    if (window.I18N?.setLanguage) {
      try {
        await window.I18N.setLanguage(code);
        window.I18N.applyTranslations?.();
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
      return;
    }
    // Minimal fallback
    try {
      localStorage.setItem("prefLang", code);
    } catch {
      void 0;
    }
    // Ensure applyTranslations is called from window.I18N if available
    window.I18N?.applyTranslations?.();
    document.documentElement.setAttribute("lang", code);
    currentEl.textContent = englishLabel || currentEl.textContent;
    closeModal();
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
