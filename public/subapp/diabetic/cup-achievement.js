(function () {
  const DEFAULT_LOCKED_TEXT = "Cup locked: complete Advanced quiz";
  const DEFAULT_MODE = "advanced-mcq";
  const ADVANCED_SELECTORS = [
    '[data-level="advanced"]',
    '[data-level-index="2"]',
    '[data-mcq-level="advanced"]',
    ".mcq-advanced",
  ];
  const RESULT_SELECTORS = [
    "#mcqProgress",
    "#mcqFeedback",
    "#mcq-result",
    "#mcqResult",
    ".mcq-progress",
    ".mcq-feedback",
    ".mcq-result",
    ".result-text",
  ];

  function onReady(callback) {
    if (document.readyState === "loading") {
      document.addEventListener("DOMContentLoaded", callback, { once: true });
    } else {
      callback();
    }
  }

  function slugify(value) {
    return (
      String(value || "app")
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-+|-+$/g, "") || "app"
    );
  }

  function getText(element) {
    return element ? element.textContent.trim().replace(/\s+/g, " ") : "";
  }

  function getStorage(key) {
    try {
      return JSON.parse(window.localStorage.getItem(key) || "null") || null;
    } catch {
      return null;
    }
  }

  function setStorage(key, value) {
    try {
      window.localStorage.setItem(key, JSON.stringify(value));
    } catch {
      // Local files can be opened with restricted storage in some browsers.
    }
  }

  function makeCode(slug) {
    const stamp = new Date().toISOString().slice(0, 10).replace(/-/g, "");
    const random = Math.random().toString(36).slice(2, 6).toUpperCase();
    return `CUP-${slug.toUpperCase().slice(0, 6)}-${stamp}-${random}`;
  }

  onReady(() => {
    const cup = document.getElementById("cupAchievement");
    if (!cup) return;

    const appName = cup.dataset.cupApp || document.title || "App";
    const appSlug = slugify(appName);
    const mode = cup.dataset.cupMode || DEFAULT_MODE;
    const storageKey =
      cup.dataset.cupStorageKey || `arclight-${appSlug}-cup-achievement-v1`;
    const lockedText = cup.dataset.cupLockedText || DEFAULT_LOCKED_TEXT;
    const unlockedText =
      cup.dataset.cupUnlockedText || `${appName} cup unlocked`;
    const label = document.getElementById("cupAchievementLabel");
    const code = document.getElementById("cupAchievementCode");
    const saveButton = document.getElementById("downloadCupCertificateButton");
    let state = getStorage(storageKey) || {
      unlocked: false,
      code: "",
      unlockedAt: "",
    };
    let advancedActive = false;

    function unlock() {
      if (state.unlocked) return;
      state = {
        unlocked: true,
        code: makeCode(appSlug),
        unlockedAt: new Date().toISOString(),
      };
      setStorage(storageKey, state);
      render();
    }

    function render() {
      cup.hidden = false;
      cup.setAttribute("aria-hidden", "false");
      cup.classList.toggle("is-unlocked", state.unlocked);
      cup.classList.toggle("is-locked", !state.unlocked);
      if (label) label.textContent = state.unlocked ? unlockedText : lockedText;
      if (code) {
        code.hidden = !state.unlocked || !state.code;
        code.textContent =
          state.unlocked && state.code ? `Code: ${state.code}` : "";
      }
      if (saveButton) {
        saveButton.disabled = !state.unlocked;
        saveButton.dataset.locked = state.unlocked ? "false" : "true";
        saveButton.setAttribute(
          "aria-disabled",
          state.unlocked ? "false" : "true",
        );
      }
    }

    function getAdvancedButtons() {
      return ADVANCED_SELECTORS.flatMap((selector) =>
        Array.from(document.querySelectorAll(selector)),
      ).filter((button, index, buttons) => buttons.indexOf(button) === index);
    }

    function advancedButtonIsComplete() {
      return getAdvancedButtons().some(
        (button) =>
          button.classList.contains("is-complete") ||
          button.dataset.complete === "true" ||
          button.getAttribute("aria-label")?.toLowerCase().includes("complete"),
      );
    }

    function selectedAdvancedLevel() {
      return getAdvancedButtons().some(
        (button) =>
          button.classList.contains("is-active") ||
          button.getAttribute("aria-pressed") === "true" ||
          button.matches(":focus"),
      );
    }

    function visibleResultSuggestsCompletion() {
      if (!advancedActive && !selectedAdvancedLevel()) return false;
      return RESULT_SELECTORS.some((selector) => {
        const element = document.querySelector(selector);
        if (!element) return false;
        const rect = element.getBoundingClientRect();
        if (rect.width === 0 && rect.height === 0) return false;
        const text = getText(element).toLowerCase();
        return (
          text.includes("complete") ||
          text.includes("score") ||
          text.includes("passed")
        );
      });
    }

    function checkAdvancedCompletion() {
      if (advancedButtonIsComplete() || visibleResultSuggestsCompletion())
        unlock();
    }

    function setupAdvancedMode() {
      getAdvancedButtons().forEach((button) => {
        button.addEventListener("click", () => {
          advancedActive = true;
          window.setTimeout(checkAdvancedCompletion, 300);
        });
      });

      document.getElementById("open-mcq-btn")?.addEventListener("click", () => {
        advancedActive = selectedAdvancedLevel();
        window.setTimeout(checkAdvancedCompletion, 300);
      });

      const observer = new MutationObserver(checkAdvancedCompletion);
      observer.observe(document.body, {
        attributes: true,
        childList: true,
        subtree: true,
        characterData: true,
      });
      checkAdvancedCompletion();
    }

    function setupConditionsMode() {
      const selector = cup.dataset.cupTargetSelector || ".condition-button";
      const targets = Array.from(document.querySelectorAll(selector));
      const visitedKey = `${storageKey}-visited`;
      const visited = new Set(getStorage(visitedKey) || []);

      targets.forEach((target) => {
        if (target.classList.contains("active")) {
          visited.add(target.dataset.conditionName || getText(target));
        }
        target.addEventListener("click", () => {
          visited.add(target.dataset.conditionName || getText(target));
          setStorage(visitedKey, Array.from(visited));
          if (
            targets.every((item) =>
              visited.has(item.dataset.conditionName || getText(item)),
            )
          ) {
            unlock();
          }
        });
      });

      if (
        targets.length > 0 &&
        targets.every((item) =>
          visited.has(item.dataset.conditionName || getText(item)),
        )
      ) {
        unlock();
      }
    }

    saveButton?.addEventListener("click", () => {
      if (!state.unlocked || !state.code) return;
      const unlockedAt = state.unlockedAt
        ? new Date(state.unlockedAt)
        : new Date();
      const lines = [
        `${appName} Cup`,
        "Local Certificate of Achievement",
        "",
        mode === "conditions"
          ? "Awarded for exploring every practice condition."
          : "Awarded for completing Advanced quiz practice.",
        `Achievement code: ${state.code}`,
        `Date: ${unlockedAt.toLocaleDateString()}`,
      ];
      const blob = new Blob([lines.join("\n")], { type: "text/plain" });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `${appSlug}-cup-${state.code.toLowerCase()}.txt`;
      link.click();
      URL.revokeObjectURL(url);
    });

    render();
    if (mode === "conditions") {
      setupConditionsMode();
    } else {
      setupAdvancedMode();
    }
  });
})();
