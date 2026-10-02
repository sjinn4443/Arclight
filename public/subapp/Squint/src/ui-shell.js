/*
 * Sidebar/info/preset-list UI shell controller.
 */

(function attachUiShell(globalObj) {
  const AppStateRef = globalObj.AppState;
  const ControlsControllerRef = globalObj.ControlsController;
  const OutputWriterRef = globalObj.OutputWriter;
  const LEVEL_LABELS = {
    primary: "Primary",
    intermediate: "Intermediate",
    advanced: "Advanced",
  };
  const PUPIL_PRESET_VALUES = new Set([
    "horner's syndrome",
    "adie's pupil",
    "benign anisocoria",
    "unilateral dilated pupil",
    "bilateral dilated pupils",
    "unilateral constricted pupil",
    "bilateral constricted pupils",
    "traumatic mydriasis",
    "traumatic miotic pupil",
    "traumatic peaked pupil",
    "argyll robertson pupils",
    "acute angle-closure pupil",
    "pharmacological mydriasis",
    "pharmacological miosis",
    "rapd (re subtle)",
    "rapd (re marked)",
    "rapd (le subtle)",
    "rapd (le marked)",
  ]);
  const FOCUSABLE_SELECTOR =
    'button:not([disabled]), input:not([disabled]), select:not([disabled]), summary, [href], [tabindex]:not([tabindex="-1"])';
  let sidebarReturnFocus = null;
  let infoReturnFocus = null;
  let presetFilterSnapshot = null;

  function scheduleFocus(callback) {
    if (typeof globalObj.requestAnimationFrame === "function") {
      globalObj.requestAnimationFrame(callback);
    } else {
      callback();
    }
  }

  function focusFirst(container, preferred) {
    scheduleFocus(() => {
      const firstVisible = [
        ...(container?.querySelectorAll(FOCUSABLE_SELECTOR) || []),
      ].find((element) => element.offsetParent !== null);
      (preferred?.offsetParent !== null ? preferred : firstVisible)?.focus();
    });
  }

  function restoreFocus(element) {
    if (element?.isConnected) {
      scheduleFocus(() => element.focus());
    }
  }

  function trapFocus(event, container) {
    if (event.key !== "Tab" || !container) return;
    const controls = [...container.querySelectorAll(FOCUSABLE_SELECTOR)].filter(
      (element) => element.offsetParent !== null,
    );
    if (!controls.length) return;
    const first = controls[0];
    const last = controls[controls.length - 1];
    if (event.shiftKey && document.activeElement === first) {
      event.preventDefault();
      last.focus();
    } else if (!event.shiftKey && document.activeElement === last) {
      event.preventDefault();
      first.focus();
    }
  }

  function levelLabel(level) {
    return LEVEL_LABELS[level] || LEVEL_LABELS.primary;
  }

  function randomInt(max) {
    const safeMax = Math.max(0, Number(max) || 0);
    if (safeMax <= 1) return 0;
    const cryptoRef = globalObj.crypto;
    if (cryptoRef && typeof cryptoRef.getRandomValues === "function") {
      const arr = new Uint32Array(1);
      cryptoRef.getRandomValues(arr);
      return arr[0] % safeMax;
    }
    return Math.floor(Math.random() * safeMax);
  }

  function buildShuffledIndexQueue(length) {
    const queue = Array.from({ length }, (_, i) => i);
    for (let i = queue.length - 1; i > 0; i -= 1) {
      const j = randomInt(i + 1);
      [queue[i], queue[j]] = [queue[j], queue[i]];
    }
    return queue;
  }

  function showConditionFlashLabel(label, options = {}) {
    const flashLabel = document.getElementById("preset-flash-label");
    const safeLabel = String(label || "").trim();
    const isTestAnswer = Boolean(options.isTestAnswer);
    if (!flashLabel || !safeLabel) return;

    clearTimeout(AppStateRef.state.presetFlashHoldTimer);
    clearTimeout(AppStateRef.state.presetFlashClearTimer);

    flashLabel.classList.toggle("is-test-answer", isTestAnswer);
    flashLabel.textContent = safeLabel;
    flashLabel.classList.add("is-visible");

    AppStateRef.state.presetFlashHoldTimer = setTimeout(() => {
      flashLabel.classList.remove("is-visible");
      AppStateRef.state.presetFlashClearTimer = setTimeout(() => {
        if (!flashLabel.classList.contains("is-visible")) {
          flashLabel.classList.remove("is-test-answer");
          flashLabel.textContent = "";
        }
      }, 800);
    }, 2000);
  }

  function updateTestMeUi() {
    const nextTestBtn = document.getElementById("nextTestBtn");
    const testLevelLine = document.getElementById("testLevelLine");
    const isActive = Boolean(AppStateRef.state.testMeActive);
    if (nextTestBtn) nextTestBtn.hidden = !isActive;
    if (testLevelLine) {
      if (isActive) {
        testLevelLine.hidden = false;
        testLevelLine.textContent = `Level: ${levelLabel(AppStateRef.state.testMeCurrentLevel)} (random)`;
      } else {
        testLevelLine.hidden = true;
        testLevelLine.textContent = "";
      }
    }
  }

  function hideAnalysisUntilShown() {
    const resultCard = document.querySelector(".result-card");
    const analysisContainer = document.getElementById("analysisContainer");
    const analysisPlaceholder = document.getElementById("analysisPlaceholder");
    const rawOutputLine = document.getElementById("raw-output-line");
    const resultBadge = document.getElementById("result-urgency-badge");
    const resultTitle = document.querySelector(".result-title");
    if (!analysisContainer || !analysisPlaceholder) return;
    resultCard?.classList.add("test-hidden");
    analysisContainer.hidden = true;
    analysisPlaceholder.hidden = false;
    if (rawOutputLine) rawOutputLine.hidden = true;
    if (resultBadge) resultBadge.hidden = true;
    if (resultTitle) {
      const lvl = levelLabel(AppStateRef.state.testMeCurrentLevel);
      resultTitle.textContent = `Test Me (${lvl})`;
    }
    updateTestMeUi();
  }

  function showAnalysisNow() {
    const resultCard = document.querySelector(".result-card");
    const analysisContainer = document.getElementById("analysisContainer");
    const analysisPlaceholder = document.getElementById("analysisPlaceholder");
    const rawOutputLine = document.getElementById("raw-output-line");
    const resultBadge = document.getElementById("result-urgency-badge");
    const resultTitle = document.querySelector(".result-title");
    if (!analysisContainer || !analysisPlaceholder) return;
    // Ensure analysis text/image reflects the latest preset state before reveal.
    OutputWriterRef?.updateAllOutputs?.();
    if (
      AppStateRef.state.testMeActive &&
      AppStateRef.state.testMeCurrentLabel
    ) {
      showConditionFlashLabel(AppStateRef.state.testMeCurrentLabel, {
        isTestAnswer: true,
      });
    }
    resultCard?.classList.remove("test-hidden");
    analysisContainer.hidden = false;
    analysisPlaceholder.hidden = true;
    if (rawOutputLine) rawOutputLine.hidden = false;
    if (resultBadge) resultBadge.hidden = false;
    if (resultTitle) resultTitle.textContent = "Results:";
    updateTestMeUi();
  }

  function pickRandomCondition(level) {
    const items = AppStateRef.CONDITION_LIBRARY[level] || [];
    if (!items.length) return null;
    const queueMap = AppStateRef.state.testMeQueueByLevel || {};
    if (!Array.isArray(queueMap[level]) || queueMap[level].length === 0) {
      queueMap[level] = buildShuffledIndexQueue(items.length);
      const prev = AppStateRef.state.testMeLastIndexByLevel[level];
      if (queueMap[level].length > 1 && queueMap[level][0] === prev) {
        const swapIndex = 1 + randomInt(queueMap[level].length - 1);
        [queueMap[level][0], queueMap[level][swapIndex]] = [
          queueMap[level][swapIndex],
          queueMap[level][0],
        ];
      }
    }
    const idx = queueMap[level].shift();
    AppStateRef.state.testMeLastIndexByLevel[level] = idx;
    return items[idx];
  }

  function runTestMeRound() {
    const level = AppStateRef.state.activePresetLevel || "primary";
    const random = pickRandomCondition(level);
    if (!random) return;

    AppStateRef.state.testMeActive = true;
    AppStateRef.state.testMeCurrentLevel = level;
    AppStateRef.state.testMeCurrentLabel = random.label;

    ControlsControllerRef.applyCondition(random.value, random.label, {
      suppressFlash: true,
    });
    hideAnalysisUntilShown();
    updateTestMeUi();
  }

  function renderPresetList() {
    function isPupilPreset(value) {
      const key = String(value || "")
        .toLowerCase()
        .trim();
      return PUPIL_PRESET_VALUES.has(key);
    }

    function isPhoriaPreset(value) {
      return String(value || "")
        .toLowerCase()
        .includes("phoria");
    }

    function makePresetButton(item, level) {
      const button = document.createElement("button");
      button.type = "button";
      button.className = "preset-button";
      if (isPhoriaPreset(item.value)) {
        button.classList.add("preset-button-phoria");
      }
      button.textContent = item.label;
      button.dataset.condition = item.value;
      button.dataset.level = level;
      button.dataset.searchText = `${item.label} ${item.value}`.toLowerCase();
      button.addEventListener("click", () => {
        AppStateRef.state.activePresetLevel = level;
        AppStateRef.state.testMeActive = false;
        AppStateRef.state.testMeCurrentLabel = "";
        ControlsControllerRef.applyCondition(item.value, item.label);
        showAnalysisNow();
        closeSidebar();
      });
      return button;
    }

    const levels = ["primary", "intermediate", "advanced"];
    levels.forEach((level) => {
      const items = AppStateRef.CONDITION_LIBRARY[level] || [];
      const alignmentItems = items.filter((item) => !isPupilPreset(item.value));
      const pupilItems = items.filter((item) => isPupilPreset(item.value));

      const alignmentContainer = document.getElementById(
        `preset-list-alignment-${level}`,
      );
      if (alignmentContainer) {
        alignmentContainer.innerHTML = "";
        alignmentItems.forEach((item) =>
          alignmentContainer.appendChild(makePresetButton(item, level)),
        );
      }

      const pupilContainer = document.getElementById(
        `preset-list-pupil-${level}`,
      );
      if (pupilContainer) {
        pupilContainer.innerHTML = "";
        pupilItems.forEach((item) =>
          pupilContainer.appendChild(makePresetButton(item, level)),
        );
      }
    });
    applyPresetFilter();
  }

  function applyPresetFilter() {
    const input = document.getElementById("preset-filter");
    const status = document.getElementById("preset-filter-status");
    const buttons = [...document.querySelectorAll(".preset-button")];
    const query = String(input?.value || "")
      .trim()
      .toLowerCase();

    if (query && !presetFilterSnapshot) {
      presetFilterSnapshot = new Map(
        [
          ...document.querySelectorAll(".preset-group-shell, .preset-folder"),
        ].map((details) => [details, details.open]),
      );
    }

    buttons.forEach((button) => {
      const searchText = String(
        button.dataset.searchText || button.textContent || "",
      ).toLowerCase();
      button.hidden = Boolean(query) && !searchText.includes(query);
    });

    const folders = [...document.querySelectorAll(".preset-folder")];
    folders.forEach((folder) => {
      const hasVisiblePreset = [
        ...folder.querySelectorAll(".preset-button"),
      ].some((button) => !button.hidden);
      folder.hidden = Boolean(query) && !hasVisiblePreset;
      if (query && hasVisiblePreset) folder.open = true;
    });

    const groups = [...document.querySelectorAll(".preset-group-shell")];
    groups.forEach((group) => {
      const hasVisibleFolder = [
        ...group.querySelectorAll(".preset-folder"),
      ].some((folder) => !folder.hidden);
      group.hidden = Boolean(query) && !hasVisibleFolder;
      if (query && hasVisibleFolder) group.open = true;
    });

    if (!query) {
      buttons.forEach((button) => {
        button.hidden = false;
      });
      folders.forEach((folder) => {
        folder.hidden = false;
      });
      groups.forEach((group) => {
        group.hidden = false;
      });
      if (presetFilterSnapshot) {
        presetFilterSnapshot.forEach((wasOpen, details) => {
          details.open = wasOpen;
        });
        presetFilterSnapshot = null;
      }
    }

    const visibleCount = buttons.filter((button) => !button.hidden).length;
    if (status) {
      status.textContent = query
        ? visibleCount
          ? `${visibleCount} of ${buttons.length} presets`
          : "No matching presets"
        : `${buttons.length} presets`;
      status.classList.toggle("is-empty", Boolean(query) && visibleCount === 0);
    }
  }

  function setActiveButtonState(selector, activeValue, attributeName) {
    document.querySelectorAll(selector).forEach((button) => {
      button.classList.toggle(
        "is-active",
        button.getAttribute(attributeName) === activeValue,
      );
    });
  }

  function openSidebar() {
    const sidebar = document.getElementById("sidebar");
    const backdrop = document.getElementById("menu-backdrop");
    const toggle = document.getElementById("sidebar-toggle");
    if (!sidebar || !backdrop) return;
    sidebarReturnFocus = document.activeElement;
    sidebar.classList.add("is-open");
    sidebar.setAttribute("aria-hidden", "false");
    toggle?.setAttribute("aria-expanded", "true");
    toggle?.setAttribute("aria-label", "Close menu");
    backdrop.hidden = false;
    focusFirst(sidebar, document.getElementById("close-sidebar"));
  }

  function closeSidebar() {
    const sidebar = document.getElementById("sidebar");
    const backdrop = document.getElementById("menu-backdrop");
    const toggle = document.getElementById("sidebar-toggle");
    if (!sidebar || !backdrop) return;
    sidebar.classList.remove("is-open");
    sidebar.setAttribute("aria-hidden", "true");
    toggle?.setAttribute("aria-expanded", "false");
    toggle?.setAttribute("aria-label", "Open menu");
    backdrop.hidden = true;
    if (
      !document.body.classList.contains("mcq-open") &&
      sidebarReturnFocus &&
      sidebar.contains(document.activeElement)
    ) {
      restoreFocus(sidebarReturnFocus);
    }
    sidebarReturnFocus = null;
  }

  function setInfoPopupState(isOpen) {
    const popup = document.getElementById("info-popup");
    const toggle = document.getElementById("info-toggle");
    if (!popup) return;
    AppStateRef.state.infoPopupOpen = Boolean(isOpen);
    popup.hidden = !AppStateRef.state.infoPopupOpen;
    popup.setAttribute("aria-hidden", String(!AppStateRef.state.infoPopupOpen));
    toggle?.setAttribute(
      "aria-expanded",
      String(AppStateRef.state.infoPopupOpen),
    );
    if (AppStateRef.state.infoPopupOpen) {
      infoReturnFocus = document.activeElement;
      focusFirst(popup, document.getElementById("info-close"));
    } else if (infoReturnFocus && popup.contains(document.activeElement)) {
      restoreFocus(infoReturnFocus);
      infoReturnFocus = null;
    }
  }

  function setupInfoPopup() {
    const infoToggle = document.getElementById("info-toggle");
    const infoClose = document.getElementById("info-close");
    const popup = document.getElementById("info-popup");

    infoToggle?.addEventListener("click", () => {
      setInfoPopupState(!AppStateRef.state.infoPopupOpen);
    });

    infoClose?.addEventListener("click", () => setInfoPopupState(false));

    document.addEventListener("click", (event) => {
      if (!AppStateRef.state.infoPopupOpen || !popup || !infoToggle) return;
      const clickedInside =
        popup.contains(event.target) || infoToggle.contains(event.target);
      if (!clickedInside) setInfoPopupState(false);
    });

    document.addEventListener("keydown", (event) => {
      if (AppStateRef.state.infoPopupOpen) {
        trapFocus(event, popup);
      } else if (
        document.getElementById("sidebar")?.classList.contains("is-open")
      ) {
        trapFocus(event, document.getElementById("sidebar"));
      }
      if (event.key === "Escape") {
        setInfoPopupState(false);
        closeSidebar();
      }
    });
  }

  function setupSidebar() {
    const sidebarToggle = document.getElementById("sidebar-toggle");
    const sidebarClose = document.getElementById("close-sidebar");
    const backdrop = document.getElementById("menu-backdrop");
    const testMeBtn = document.getElementById("testMeBtn");
    const openMcqBtn = document.getElementById("open-mcq-btn");
    const showAnswerBtn = document.getElementById("showAnswerBtn");
    const nextTestBtn = document.getElementById("nextTestBtn");
    const presetFilter = document.getElementById("preset-filter");

    sidebarToggle?.addEventListener("click", () => {
      const sidebar = document.getElementById("sidebar");
      if (sidebar?.classList.contains("is-open")) closeSidebar();
      else openSidebar();
    });
    sidebarClose?.addEventListener("click", closeSidebar);
    backdrop?.addEventListener("click", closeSidebar);
    presetFilter?.addEventListener("input", applyPresetFilter);
    presetFilter?.addEventListener("search", applyPresetFilter);
    presetFilter?.addEventListener("keydown", (event) => {
      if (event.key !== "Escape" || !presetFilter.value) return;
      event.preventDefault();
      event.stopPropagation();
      presetFilter.value = "";
      applyPresetFilter();
    });

    document.querySelectorAll(".preset-group-shell").forEach((group) => {
      group.addEventListener("toggle", () => {
        if (presetFilter?.value.trim()) return;
        if (!group.open) return;
        document.querySelectorAll(".preset-group-shell").forEach((other) => {
          if (other !== group) other.open = false;
        });
      });
    });

    document.querySelectorAll(".preset-folder").forEach((folder) => {
      folder.addEventListener("toggle", () => {
        if (presetFilter?.value.trim()) return;
        if (!folder.open) return;
        const level = folder.getAttribute("data-preset-folder");
        const group = folder.getAttribute("data-preset-group");
        if (level) {
          AppStateRef.state.activePresetLevel = level;
        }
        document
          .querySelectorAll(`.preset-folder[data-preset-group="${group}"]`)
          .forEach((other) => {
            if (other !== folder) other.open = false;
          });
      });
    });

    document.querySelectorAll("[data-mcq-level]").forEach((button) => {
      button.addEventListener("click", () => {
        AppStateRef.state.activeMcqLevel =
          button.getAttribute("data-mcq-level");
        setActiveButtonState(
          "[data-mcq-level]",
          AppStateRef.state.activeMcqLevel,
          "data-mcq-level",
        );
      });
    });

    testMeBtn?.addEventListener("click", () => {
      runTestMeRound();
      closeSidebar();
    });

    showAnswerBtn?.addEventListener("click", (event) => {
      event.preventDefault();
      showAnalysisNow();
    });

    nextTestBtn?.addEventListener("click", () => {
      runTestMeRound();
    });

    openMcqBtn?.addEventListener("click", () => {
      if (typeof window.openMcqLevel === "function") {
        window.openMcqLevel(AppStateRef.state.activeMcqLevel);
      }
      closeSidebar();
    });

    updateTestMeUi();
  }

  globalObj.UiShell = {
    showConditionFlashLabel,
    hideAnalysisUntilShown,
    showAnalysisNow,
    renderPresetList,
    applyPresetFilter,
    setupInfoPopup,
    setupSidebar,
    runTestMeRound,
    openSidebar,
    closeSidebar,
  };
})(typeof globalThis !== "undefined" ? globalThis : window);
