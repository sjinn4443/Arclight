"use strict";
(() => {
  // src/dom-utils.js
  function $(selector, root = document) {
    return root.querySelector(selector);
  }
  function $$(selector, root = document) {
    return Array.from(root.querySelectorAll(selector));
  }
  function clamp(value, min, max) {
    return Math.min(max, Math.max(min, value));
  }

  // src/mcq-engine.js
  function shuffleArray(items, randomFn = Math.random) {
    const nextItems = [...items];
    for (let index = nextItems.length - 1; index > 0; index -= 1) {
      const randomValue = Number(randomFn());
      const maxRandom = 1 - Number.EPSILON;
      const boundedRandom = Number.isFinite(randomValue)
        ? clamp(randomValue, 0, maxRandom)
        : 0;
      const swapIndex = Math.floor(boundedRandom * (index + 1));
      const currentValue = nextItems[index];
      nextItems[index] = nextItems[swapIndex];
      nextItems[swapIndex] = currentValue;
    }
    return nextItems;
  }
  function normaliseSelectedOptionIndex(value) {
    if (value === null || value === void 0) {
      return null;
    }
    if (typeof value === "string" && value.trim() === "") {
      return null;
    }
    const numericValue = Number(value);
    return Number.isInteger(numericValue) && numericValue >= 0
      ? numericValue
      : null;
  }
  function evaluateMcqAnswers({
    questions,
    selectedAnswers,
    allowUnanswered = false,
  }) {
    if (!Array.isArray(questions) || !Array.isArray(selectedAnswers)) {
      return { isComplete: false, score: 0, total: 0 };
    }
    let score = 0;
    for (
      let questionIndex = 0;
      questionIndex < questions.length;
      questionIndex += 1
    ) {
      const selectedOptionIndex = normaliseSelectedOptionIndex(
        selectedAnswers[questionIndex],
      );
      if (selectedOptionIndex === null || selectedOptionIndex === void 0) {
        if (!allowUnanswered) {
          return { isComplete: false, score: 0, total: questions.length };
        }
        continue;
      }
      if (selectedOptionIndex === questions[questionIndex].answerIndex) {
        score += 1;
      }
    }
    return { isComplete: true, score, total: questions.length };
  }
  function normalizeProgress(rawProgress, levelCount) {
    const safeLevelCount = Math.max(1, Number(levelCount) || 1);
    if (!rawProgress || typeof rawProgress !== "object") {
      return {
        unlockedLevelIndex: 0,
        completedLevels: [],
      };
    }
    const unlockedLevelIndex = Number.isInteger(rawProgress.unlockedLevelIndex)
      ? clamp(rawProgress.unlockedLevelIndex, 0, safeLevelCount - 1)
      : 0;
    const completedLevels = Array.isArray(rawProgress.completedLevels)
      ? rawProgress.completedLevels
          .filter(
            (index) =>
              Number.isInteger(index) && index >= 0 && index < safeLevelCount,
          )
          .filter((value, index, arr) => arr.indexOf(value) === index)
      : [];
    return {
      unlockedLevelIndex,
      completedLevels,
    };
  }
  function markLevelComplete(progress, levelIndex, levelCount) {
    const next = normalizeProgress(progress, levelCount);
    const safeLevelCount = Math.max(1, Number(levelCount) || 1);
    if (
      !Number.isInteger(levelIndex) ||
      levelIndex < 0 ||
      levelIndex >= safeLevelCount
    ) {
      return next;
    }
    if (!next.completedLevels.includes(levelIndex)) {
      next.completedLevels.push(levelIndex);
    }
    next.unlockedLevelIndex = Math.max(
      next.unlockedLevelIndex,
      clamp(levelIndex + 1, 0, Math.max(0, safeLevelCount - 1)),
    );
    return next;
  }

  // src/mcq-data.js
  var MCQ_STORAGE_KEY = "glaucoma_mcq_progress_v1";
  var MCQ_LEVELS = [
    {
      name: "Primary",
      passScore: 2,
      totalQuestions: 4,
      timeSeconds: 0,
      questions: [
        {
          prompt: "Higher IOP generally pushes risk:",
          options: ["Down", "Up", "No change"],
          answerIndex: 1,
        },
        {
          prompt: "A very large cup-disc ratio is usually:",
          options: ["Lower risk", "Higher risk", "Unrelated to risk"],
          answerIndex: 1,
        },
        {
          prompt: "A small crowded disc tends to:",
          options: ["Increase concern", "Always be normal", "Hide all risk"],
          answerIndex: 0,
        },
        {
          prompt: "Best use of this tool is:",
          options: [
            "Triage support",
            "Final diagnosis alone",
            "Replace specialist review",
          ],
          answerIndex: 0,
        },
      ],
    },
    {
      name: "Intermediate",
      passScore: 3,
      totalQuestions: 5,
      timeSeconds: 110,
      questions: [
        {
          prompt: "Thin rim/notch and disc haem together should usually:",
          options: [
            "Lower urgency",
            "Increase urgency",
            "Cancel each other out",
            "Only matter if VA is normal",
          ],
          answerIndex: 1,
        },
        {
          prompt: "Suspicious fields add risk because they may reflect:",
          options: [
            "Better perfusion",
            "Functional loss",
            "Normal variation only",
            "Lens artefact only",
          ],
          answerIndex: 1,
        },
        {
          prompt:
            "When C/D is high and IOP is 25-29, the grid trend is usually:",
          options: [
            "Toward green",
            "Toward orange/red",
            "Always white",
            "Unchanged by C/D",
          ],
          answerIndex: 1,
        },
        {
          prompt:
            "Risk factors (age, family history, myopia, etc.) should be used to:",
          options: [
            "Ignore grid result",
            "Refine urgency",
            "Replace optic disc findings",
            "Avoid referral decisions",
          ],
          answerIndex: 1,
        },
        {
          prompt:
            "If unsure of disc signs but several risk factors are present:",
          options: [
            "Assume normal",
            "Treat as lower concern",
            "Escalate caution",
            "Remove all weighting",
          ],
          answerIndex: 2,
        },
      ],
    },
    {
      name: "Advanced",
      passScore: 5,
      totalQuestions: 7,
      timeSeconds: 80,
      questions: [
        {
          prompt: "Which combination is most concerning for urgent pathway?",
          options: [
            "Low C/D + <=20 + no signs",
            "High C/D + >=30 + suspicious signs",
            "Mid C/D + <=20 + no risk factors",
            "Low C/D + 20-24 + good VA",
            "Large disc + no findings",
          ],
          answerIndex: 1,
        },
        {
          prompt: "Best interpretation of a dark grey (end-stage) zone is:",
          options: [
            "No follow-up needed",
            "Likely severe damage; assess fellow eye and escalate",
            "Safer than green",
            "Equivalent to white",
            "Normal with age",
          ],
          answerIndex: 1,
        },
        {
          prompt: "In this calculator, disc size modifies risk by:",
          options: [
            "Small tends to increase and large tends to reduce",
            "Always reducing risk",
            "Always increasing risk",
            "No effect",
            "Only changing VA weighting",
          ],
          answerIndex: 0,
        },
        {
          prompt: "Why keep the reasoning line visible?",
          options: [
            "For cosmetic reasons only",
            "To hide uncertainty",
            "To show weighted contributors behind urgency",
            "To replace clinical judgement",
            "To avoid specialist input",
          ],
          answerIndex: 2,
        },
        {
          prompt: "If signs and grid disagree, safest approach is usually:",
          options: [
            "Pick lower urgency",
            "Ignore structural signs",
            "Use clinical caution and escalate when suspicious",
            "Delete risk factors",
            "Retest in 5 years",
          ],
          answerIndex: 2,
        },
        {
          prompt: "Suspicious pupils plus suspicious fields should generally:",
          options: [
            "Reduce concern",
            "Increase concern",
            "Have no effect",
            "Only matter if IOP <20",
            "Only matter in large discs",
          ],
          answerIndex: 1,
        },
        {
          prompt: "Core purpose of the 3-level MCQ progression is to:",
          options: [
            "Test memory only",
            "Build from basic recognition to safer decisions",
            "Replace bedside assessment",
            "Minimise use of all referrals",
            "Ignore uncertainty",
          ],
          answerIndex: 1,
        },
      ],
    },
  ];

  // src/mcq-controller.js?v=20260511-2
  function loadMcqProgress() {
    const fallback = { unlockedLevelIndex: 0, completedLevels: [] };
    try {
      const rawValue = localStorage.getItem(MCQ_STORAGE_KEY);
      if (!rawValue) {
        return fallback;
      }
      return normalizeProgress(JSON.parse(rawValue), MCQ_LEVELS.length);
    } catch (e) {
      return fallback;
    }
  }
  function saveMcqProgress(progress) {
    try {
      localStorage.setItem(MCQ_STORAGE_KEY, JSON.stringify(progress));
    } catch (e) {}
  }
  function initMcqController(root = document) {
    const burgerIcon = $("#burger-icon", root);
    const sideMenu = $("#sideMenu", root);
    const mcqLevelButtons = $$(".mcq-level-button", root);
    const mcqModal = $("#mcqModal", root);
    const closeMcqModalButton = $("#closeMcqModal", root);
    const mcqTitle = $("#mcqTitle", root);
    const mcqTimer = $("#mcqTimer", root);
    const mcqContainer = $("#mcqContainer", root);
    const submitMcqButton = $("#submitMcqButton", root);
    const mcqResult = $("#mcqResult", root);
    const infoPopup = $("#info-popup", root);
    const infoIcon = $("#info-icon", root);
    if (
      !sideMenu ||
      !mcqModal ||
      !mcqContainer ||
      !submitMcqButton ||
      !mcqResult
    ) {
      return;
    }
    let mcqProgress = loadMcqProgress();
    let activeMcqLevelIndex = null;
    let activeMcqQuestions = [];
    let mcqTimerId = null;
    let mcqRemainingSeconds = 0;
    function isMcqLevelUnlocked(levelIndex) {
      return levelIndex <= mcqProgress.unlockedLevelIndex;
    }
    function isMcqLevelCompleted(levelIndex) {
      return mcqProgress.completedLevels.includes(levelIndex);
    }
    function renderMcqLevelButtons() {
      mcqLevelButtons.forEach((button) => {
        const levelIndex = Number(button.dataset.levelIndex);
        const unlocked = isMcqLevelUnlocked(levelIndex);
        const completed = isMcqLevelCompleted(levelIndex);
        button.disabled = !unlocked;
        button.classList.toggle("is-complete", completed);
      });
    }
    function setSideMenuOpen(isOpen) {
      if (isOpen && infoPopup) {
        infoPopup.classList.remove("active");
        infoIcon == null
          ? void 0
          : infoIcon.setAttribute("aria-expanded", "false");
      }
      sideMenu.classList.toggle("open", isOpen);
      sideMenu.setAttribute("aria-hidden", isOpen ? "false" : "true");
      if (isOpen) {
        sideMenu.removeAttribute("inert");
      } else {
        sideMenu.setAttribute("inert", "");
      }
      sideMenu.inert = !isOpen;
      burgerIcon == null
        ? void 0
        : burgerIcon.setAttribute("aria-expanded", isOpen ? "true" : "false");
      burgerIcon == null
        ? void 0
        : burgerIcon.setAttribute(
            "aria-label",
            isOpen ? "Close menu" : "Open menu",
          );
    }
    function toggleSideMenu() {
      setSideMenuOpen(!sideMenu.classList.contains("open"));
    }
    function openMcqModal() {
      mcqModal.classList.add("open");
      mcqModal.setAttribute("aria-hidden", "false");
    }
    function stopMcqTimer() {
      if (mcqTimerId !== null) {
        clearInterval(mcqTimerId);
        mcqTimerId = null;
      }
    }
    function closeMcqModal() {
      stopMcqTimer();
      mcqModal.classList.remove("open");
      mcqModal.setAttribute("aria-hidden", "true");
      activeMcqLevelIndex = null;
      activeMcqQuestions = [];
    }
    function updateMcqTimerText() {
      if (!mcqTimer) {
        return;
      }
      const mins = Math.floor(mcqRemainingSeconds / 60);
      const secs = mcqRemainingSeconds % 60;
      mcqTimer.textContent = `Time: ${String(mins).padStart(2, "0")}:${String(secs).padStart(2, "0")}`;
    }
    function startMcqTimer(level) {
      stopMcqTimer();
      if (!mcqTimer) {
        return;
      }
      const timeSeconds = Number(level.timeSeconds) || 0;
      if (timeSeconds <= 0) {
        mcqTimer.hidden = true;
        mcqTimer.textContent = "";
        return;
      }
      mcqRemainingSeconds = timeSeconds;
      mcqTimer.hidden = false;
      updateMcqTimerText();
      mcqTimerId = setInterval(() => {
        mcqRemainingSeconds -= 1;
        updateMcqTimerText();
        if (mcqRemainingSeconds <= 0) {
          stopMcqTimer();
          handleSubmitMcq({ allowUnanswered: true });
        }
      }, 1e3);
    }
    function renderMcqQuestions(questions) {
      const renderedQuestions = questions.map((question, questionIndex) => {
        const fieldset = document.createElement("fieldset");
        fieldset.className = "mcq-question";
        const legend = document.createElement("legend");
        legend.textContent = `${questionIndex + 1}. ${question.prompt}`;
        fieldset.appendChild(legend);
        question.options.forEach((optionText, optionIndex) => {
          const optionLabel = document.createElement("label");
          optionLabel.className = "mcq-option";
          const optionInput = document.createElement("input");
          optionInput.type = "radio";
          optionInput.name = `mcq_q_${questionIndex}`;
          optionInput.value = String(optionIndex);
          const optionSpan = document.createElement("span");
          optionSpan.textContent = optionText;
          optionLabel.appendChild(optionInput);
          optionLabel.appendChild(optionSpan);
          fieldset.appendChild(optionLabel);
        });
        return fieldset;
      });
      mcqContainer.replaceChildren(...renderedQuestions);
    }
    function openMcqLevel(levelIndex) {
      const level = MCQ_LEVELS[levelIndex];
      if (!level) {
        return;
      }
      activeMcqLevelIndex = levelIndex;
      activeMcqQuestions = shuffleArray(level.questions).slice(
        0,
        level.totalQuestions,
      );
      mcqTitle.textContent = `MCQ - ${level.name}`;
      mcqResult.textContent = "";
      renderMcqQuestions(activeMcqQuestions);
      openMcqModal();
      startMcqTimer(level);
    }
    function collectSelectedAnswers() {
      return activeMcqQuestions.map((question, questionIndex) => {
        const selectedInput = root.querySelector(
          `input[name="mcq_q_${questionIndex}"]:checked`,
        );
        if (!selectedInput) {
          return null;
        }
        return Number(selectedInput.value);
      });
    }
    function handleSubmitMcq(options = {}) {
      const level = MCQ_LEVELS[activeMcqLevelIndex];
      if (!level) {
        return;
      }
      const evaluation = evaluateMcqAnswers({
        questions: activeMcqQuestions,
        selectedAnswers: collectSelectedAnswers(),
        allowUnanswered: Boolean(options.allowUnanswered),
      });
      if (!evaluation.isComplete) {
        mcqResult.textContent =
          "Please answer all questions before submitting.";
        return;
      }
      stopMcqTimer();
      const passed = evaluation.score >= level.passScore;
      if (passed) {
        mcqProgress = markLevelComplete(
          mcqProgress,
          activeMcqLevelIndex,
          MCQ_LEVELS.length,
        );
        saveMcqProgress(mcqProgress);
        renderMcqLevelButtons();
      }
      mcqResult.textContent = `${level.name}: ${evaluation.score}/${evaluation.total}. ${passed ? "Pass." : "Try again."}`;
    }
    if (burgerIcon) {
      burgerIcon.addEventListener("click", (event) => {
        event.stopPropagation();
        toggleSideMenu();
      });
    }
    mcqLevelButtons.forEach((button) => {
      button.addEventListener("click", () => {
        const levelIndex = Number(button.dataset.levelIndex);
        if (!isMcqLevelUnlocked(levelIndex)) {
          return;
        }
        setSideMenuOpen(false);
        openMcqLevel(levelIndex);
      });
    });
    submitMcqButton.addEventListener("click", () => handleSubmitMcq());
    if (closeMcqModalButton) {
      closeMcqModalButton.addEventListener("click", closeMcqModal);
    }
    root.addEventListener("click", (event) => {
      if (sideMenu.classList.contains("open")) {
        const clickedInsideMenu = sideMenu.contains(event.target);
        const clickedMenuIcon = Boolean(
          burgerIcon && burgerIcon.contains(event.target),
        );
        if (!clickedInsideMenu && !clickedMenuIcon) {
          setSideMenuOpen(false);
        }
      }
      if (mcqModal.classList.contains("open") && event.target === mcqModal) {
        closeMcqModal();
      }
    });
    root.addEventListener("keydown", (event) => {
      if (event.key !== "Escape") {
        return;
      }
      if (mcqModal.classList.contains("open")) {
        closeMcqModal();
        return;
      }
      if (sideMenu.classList.contains("open")) {
        setSideMenuOpen(false);
      }
    });
    renderMcqLevelButtons();
  }

  // src/risk-config.js
  var DEFAULT_DISC_SIZE = "Medium";
  var IOP_ROW_MAP = {
    gte30: 1,
    "25-29": 2,
    "20-24": 3,
    lte20: 4,
  };
  var CD_RATIO_COL_MAP = {
    "0-0.2": 1,
    "0.3-0.5": 2,
    "0.6-0.8": 3,
    "0.9-1": 4,
  };
  var VISION_POINTS = {
    "6/12": 0.25,
    "6/36": 0.5,
    "6/60": 0.75,
    HM: 1,
  };
  var PALPATION_TO_IOP_MAP = {
    normal: {
      iopBand: "20-24",
      points: 1,
      note: "Palpation normal: provisional IOP <=24 (scored as 20-24)",
    },
    firm: {
      iopBand: "gte30",
      points: 3,
      note: "Palpation firm: provisional IOP >=30",
    },
    rock: {
      iopBand: "gte30",
      points: 3,
      note: "Palpation rock-hard: provisional IOP >=30",
    },
  };
  var PROVISIONAL_URGENCY_PREFIX = "PROVISIONAL (No tonometer): ";
  var ROCK_PALPATION_WARNING = {
    message:
      "EMERGENCY WARNING: Rock-hard eye on palpation - suspect acute glaucoma. Immediate specialist review.",
    textColour: "red",
  };
  var RISK_FACTOR_POINT = 0.2;
  var RISK_FACTOR_VALUES = [
    "Age",
    "Race",
    "Family Hist",
    "Myopia",
    "Diabetes/BP",
  ];
  var TOGGLE_ROW_SHIFT_THRESHOLD = 2;
  function formatPointValue(value) {
    if (Number.isInteger(value)) {
      return String(value);
    }
    return value.toFixed(2).replace(/\.?0+$/, "");
  }
  var palpationSummary = [
    `Normal +${formatPointValue(PALPATION_TO_IOP_MAP.normal.points)} (treated as 20-24)`,
    `Firm +${formatPointValue(PALPATION_TO_IOP_MAP.firm.points)}`,
    `Rock +${formatPointValue(PALPATION_TO_IOP_MAP.rock.points)}`,
  ].join(", ");
  var visionSummary = Object.entries(VISION_POINTS)
    .filter(([, points]) => points > 0)
    .map(([label, points]) => `${label} +${formatPointValue(points)}`)
    .join(", ");
  var INFO_LOGIC_ITEMS = [
    "Main grid needs pressure + C/D; exception: Rock palp triggers emergency warning even without C/D.",
    "Pressure points: <=20 +0, 20-24 +1, 25-29 +2, >=30 +3.",
    `Without tonometer, palp substitutes pressure: ${palpationSummary}.`,
    `Add-ons: Thin rim +1, Susp fields +1, Susp pupils +0.5, VA up to +1 (${visionSummary}), each risk factor +${formatPointValue(RISK_FACTOR_POINT)}.`,
    `If add-ons (not pressure/disc size) total >=${formatPointValue(TOGGLE_ROW_SHIFT_THRESHOLD)}, one IOP row shifts up.`,
    "Disc size: Small +2 and right-shift from low C/D bands; Large -2 and left-shift. Measured IOP overrides palpation.",
  ];
  var INFO_LOGIC_VERSION = "v1 - 18/5/2026";
  var GRID_CELL_COLOURS = [
    ["orange", "red", "red", "red"],
    ["orange", "orange", "red", "darkgrey"],
    ["white", "green", "orange", "darkgrey"],
    ["white", "white", "green", "darkgrey"],
  ];
  var URGENCY_BY_COLOUR = {
    red: {
      message: "URGENT: See specialist within 3 weeks",
      textColour: "red",
    },
    orange: {
      message: "SOON: See specialist within 2 months",
      textColour: "orange",
    },
    green: {
      message: "REVIEW: Check in 1 year",
      textColour: "green",
    },
    darkgrey: {
      message: "END-STAGE: Check other eye",
      textColour: "black",
    },
    white: {
      message: "NORMAL: Routine check-up only",
      textColour: "black",
    },
  };

  // src/popup-controller.js?v=20260511-2
  function positionPopupNearTrigger(popup, trigger) {
    const triggerRect = trigger.getBoundingClientRect();
    const top = window.scrollY + triggerRect.bottom + 5;
    const popupWidth = popup.offsetWidth;
    const iconWidth = triggerRect.width;
    let left = window.scrollX + triggerRect.left - (popupWidth - iconWidth) - 5;
    const minLeft = window.scrollX + 8;
    const maxLeft = window.scrollX + window.innerWidth - popupWidth - 8;
    left = Math.max(minLeft, Math.min(left, maxLeft));
    popup.style.top = `${top}px`;
    popup.style.left = `${left}px`;
  }
  function renderInfoLogicSection(root) {
    var _a;
    const logicList = $("#info-logic-list", root);
    const logicVersion = $("#info-logic-version", root);
    const doc = (_a = root.ownerDocument) != null ? _a : root;
    if (logicList) {
      const lines = INFO_LOGIC_ITEMS.map((item) => {
        const line = doc.createElement("li");
        line.textContent = item;
        return line;
      });
      logicList.replaceChildren(...lines);
    }
    if (logicVersion) {
      logicVersion.textContent = INFO_LOGIC_VERSION;
    }
  }
  function initPopupController(root = document) {
    const infoIcon = $("#info-icon", root);
    const infoPopup = $("#info-popup", root);
    const sideMenu = $("#sideMenu", root);
    const burgerIcon = $("#burger-icon", root);
    const anchoredPopups = $$(".popup", root);
    renderInfoLogicSection(root);
    if (!infoIcon && anchoredPopups.length === 0) {
      return;
    }
    function closeAnchoredPopups() {
      anchoredPopups.forEach((popup) => popup.classList.remove("active"));
    }
    function closeInfoPopup() {
      if (infoPopup) {
        infoPopup.classList.remove("active");
        infoIcon == null
          ? void 0
          : infoIcon.setAttribute("aria-expanded", "false");
      }
    }
    function closeSideMenu() {
      if (!sideMenu) {
        return;
      }
      sideMenu.classList.remove("open");
      sideMenu.setAttribute("aria-hidden", "true");
      sideMenu.setAttribute("inert", "");
      sideMenu.inert = true;
      burgerIcon == null
        ? void 0
        : burgerIcon.setAttribute("aria-expanded", "false");
      burgerIcon == null
        ? void 0
        : burgerIcon.setAttribute("aria-label", "Open menu");
    }
    function closeAllPopups() {
      closeAnchoredPopups();
      closeInfoPopup();
    }
    function openAnchoredPopup(trigger) {
      const popupId = trigger.dataset.popupTarget;
      if (!popupId) {
        return;
      }
      const popup = root.getElementById(popupId);
      if (!popup) {
        return;
      }
      const wasOpen = popup.classList.contains("active");
      closeAllPopups();
      if (wasOpen) {
        return;
      }
      popup.classList.add("active");
      positionPopupNearTrigger(popup, trigger);
    }
    if (infoIcon && infoPopup) {
      infoIcon.addEventListener("click", (event) => {
        event.preventDefault();
        event.stopPropagation();
        const wasOpen = infoPopup.classList.contains("active");
        closeAnchoredPopups();
        closeSideMenu();
        infoPopup.classList.toggle("active", !wasOpen);
        infoIcon.setAttribute("aria-expanded", !wasOpen ? "true" : "false");
      });
    }
    root.addEventListener("click", (event) => {
      var _a;
      const target = event.target;
      const closeButton = target.closest(".popup-close-button");
      if (closeButton) {
        event.preventDefault();
        event.stopPropagation();
        const popup =
          (_a = closeButton.closest(".popup")) != null
            ? _a
            : closeButton.closest("#info-popup");
        if (popup === infoPopup) {
          closeInfoPopup();
        } else if (popup) {
          popup.classList.remove("active");
        }
        return;
      }
      const anchoredTrigger = target.closest(".info-icon[data-popup-target]");
      if (anchoredTrigger) {
        event.preventDefault();
        event.stopPropagation();
        openAnchoredPopup(anchoredTrigger);
        return;
      }
      const insideAnchoredPopup = Boolean(target.closest(".popup"));
      const insideInfoPopup = Boolean(target.closest("#info-popup"));
      const clickedInfoIcon = Boolean(
        infoIcon && (target === infoIcon || infoIcon.contains(target)),
      );
      if (!insideAnchoredPopup) {
        closeAnchoredPopups();
      }
      if (!insideInfoPopup && !clickedInfoIcon) {
        closeInfoPopup();
      }
    });
    window.addEventListener("resize", () => {
      const activePopup = root.querySelector(".popup.active");
      if (!activePopup) {
        return;
      }
      const trigger = root.querySelector(
        `.info-icon[data-popup-target="${activePopup.id}"]`,
      );
      if (!trigger) {
        return;
      }
      positionPopupNearTrigger(activePopup, trigger);
    });
  }

  // src/risk-engine.js
  function roundScore(value) {
    return Math.round(value * 100) / 100;
  }
  function formatScore(value) {
    if (Number.isInteger(value)) {
      return String(value);
    }
    return value.toFixed(2).replace(/\.?0+$/, "");
  }
  function escapeHtml(value) {
    return String(value).replace(/[&<>"']/g, (char) => {
      switch (char) {
        case "&":
          return "&amp;";
        case "<":
          return "&lt;";
        case ">":
          return "&gt;";
        case '"':
          return "&quot;";
        case "'":
          return "&#39;";
        default:
          return char;
      }
    });
  }
  function resolveCellColour(rowNum, colNum) {
    if (!rowNum || !colNum) {
      return "white";
    }
    return GRID_CELL_COLOURS[rowNum - 1][colNum - 1];
  }
  function shiftColumnForDiscSize(colNum, discSize) {
    if (colNum === null) {
      return null;
    }
    if (discSize === "Small" && (colNum === 1 || colNum === 2)) {
      return colNum + 1;
    }
    if (discSize === "Large") {
      return colNum - 1;
    }
    return colNum;
  }
  function isValidIopBand(iop) {
    return (
      typeof iop === "string" &&
      Object.prototype.hasOwnProperty.call(IOP_ROW_MAP, iop)
    );
  }
  function isValidPalpation(palpation) {
    return (
      typeof palpation === "string" &&
      Object.prototype.hasOwnProperty.call(PALPATION_TO_IOP_MAP, palpation)
    );
  }
  function isValidCupDiscRatio(cupDiscRatio) {
    return (
      typeof cupDiscRatio === "string" &&
      Object.prototype.hasOwnProperty.call(CD_RATIO_COL_MAP, cupDiscRatio)
    );
  }
  function normaliseDiscSize(discSize) {
    return ["Small", "Medium", "Large"].includes(discSize)
      ? discSize
      : DEFAULT_DISC_SIZE;
  }
  function normaliseRiskFactors(riskFactors) {
    if (!Array.isArray(riskFactors)) {
      return [];
    }
    return riskFactors.filter(
      (factor, index, list) =>
        RISK_FACTOR_VALUES.includes(factor) && list.indexOf(factor) === index,
    );
  }
  function resolvePressureInput({ iop, palpation }) {
    const hasValidIop = isValidIopBand(iop);
    const hasValidPalpation = isValidPalpation(palpation);
    if (hasValidIop) {
      return {
        iopBand: iop,
        isProvisional: false,
        reasoning: null,
        points: 0,
        hasConflict: hasValidPalpation,
        hasInvalidInput: false,
      };
    }
    const mapped = hasValidPalpation ? PALPATION_TO_IOP_MAP[palpation] : null;
    if (!mapped) {
      return {
        iopBand: null,
        isProvisional: false,
        reasoning: null,
        points: 0,
        hasConflict: false,
        hasInvalidInput: Boolean(iop || palpation),
      };
    }
    return {
      iopBand: mapped.iopBand,
      isProvisional: true,
      reasoning: mapped.note,
      points: mapped.points,
      hasConflict: false,
      hasInvalidInput: false,
    };
  }
  function canCalculateRisk({ iop, palpation, cupDiscRatio }) {
    const hasValidIop = isValidIopBand(iop);
    const hasValidPalpation = isValidPalpation(palpation);
    const hasValidCupDiscRatio = isValidCupDiscRatio(cupDiscRatio);
    if (!hasValidIop && palpation === "rock" && hasValidPalpation) {
      return true;
    }
    return Boolean((hasValidIop || hasValidPalpation) && hasValidCupDiscRatio);
  }
  function calculateRiskOutcome({
    iop = null,
    palpation = null,
    cupDiscRatio = null,
    discSize = "Medium",
    thinRim = false,
    suspiciousFields = false,
    suspiciousPupils = false,
    vision = "",
    riskFactors = [],
  }) {
    var _a, _b, _c;
    const riskFactorList = normaliseRiskFactors(riskFactors);
    const validCupDiscRatio = isValidCupDiscRatio(cupDiscRatio)
      ? cupDiscRatio
      : null;
    const safeDiscSize = normaliseDiscSize(discSize);
    const pressure = resolvePressureInput({ iop, palpation });
    let riskScore = 0;
    const reasoningDetails = [];
    const riskFactorStrings = [];
    if (thinRim) {
      riskScore += 1;
      reasoningDetails.push("Thin Rim: +1");
    }
    if (pressure.hasConflict) {
      reasoningDetails.push("Measured IOP selected; palpation ignored");
    }
    if (pressure.isProvisional && pressure.reasoning) {
      riskScore += pressure.points;
      reasoningDetails.push(
        `${pressure.reasoning}: +${formatScore(pressure.points)}`,
      );
    } else if (pressure.iopBand === "gte30") {
      riskScore += 3;
      reasoningDetails.push("IOP >=30: +3");
    } else if (pressure.iopBand === "25-29") {
      riskScore += 2;
      reasoningDetails.push("IOP 25-29: +2");
    } else if (pressure.iopBand === "20-24") {
      riskScore += 1;
      reasoningDetails.push("IOP 20-24: +1");
    }
    if (suspiciousFields) {
      riskScore += 1;
      reasoningDetails.push("Suspect Fields: +1");
    }
    if (suspiciousPupils) {
      riskScore += 0.5;
      reasoningDetails.push("Suspect Pupils: +0.5");
    }
    const visionPoints = (_a = VISION_POINTS[vision]) != null ? _a : 0;
    if (visionPoints > 0) {
      riskScore += visionPoints;
      reasoningDetails.push(`Vision ${vision}: +${formatScore(visionPoints)}`);
    }
    const riskFactorPoints = riskFactorList.length * RISK_FACTOR_POINT;
    if (riskFactorList.length > 0) {
      riskScore += riskFactorPoints;
      riskFactorList.forEach((factor) => {
        riskFactorStrings.push(`${factor}: +${formatScore(RISK_FACTOR_POINT)}`);
      });
    }
    if (safeDiscSize === "Small") {
      riskScore += 2;
      reasoningDetails.push("Small disc: +2");
    } else if (safeDiscSize === "Large") {
      riskScore -= 2;
      reasoningDetails.push("Large disc: -2");
    }
    let rowNum = pressure.iopBand
      ? (_b = IOP_ROW_MAP[pressure.iopBand]) != null
        ? _b
        : null
      : null;
    let colNum = validCupDiscRatio ? CD_RATIO_COL_MAP[validCupDiscRatio] : null;
    let togglePoints = 0;
    if (thinRim) togglePoints += 1;
    if (suspiciousFields) togglePoints += 1;
    if (suspiciousPupils) togglePoints += 0.5;
    togglePoints += visionPoints;
    togglePoints += riskFactorPoints;
    if (togglePoints >= TOGGLE_ROW_SHIFT_THRESHOLD && rowNum !== null) {
      rowNum -= 1;
    }
    if (rowNum !== null) {
      rowNum = clamp(rowNum, 1, 4);
    }
    colNum = shiftColumnForDiscSize(colNum, safeDiscSize);
    if (colNum !== null) {
      colNum = clamp(colNum, 1, 4);
    }
    const cellColour = resolveCellColour(rowNum, colNum);
    const urgency =
      (_c = URGENCY_BY_COLOUR[cellColour]) != null
        ? _c
        : URGENCY_BY_COLOUR.white;
    const cellId = rowNum && colNum ? `cell_r${rowNum}_c${colNum}` : null;
    const hasGridPlacement = rowNum !== null && colNum !== null;
    const isRockAcuteWarning = pressure.isProvisional && palpation === "rock";
    let urgencyMessage = "";
    let urgencyTextColour = "black";
    if (isRockAcuteWarning) {
      urgencyMessage = ROCK_PALPATION_WARNING.message;
      urgencyTextColour = ROCK_PALPATION_WARNING.textColour;
    } else if (hasGridPlacement) {
      urgencyMessage = pressure.isProvisional
        ? `${PROVISIONAL_URGENCY_PREFIX}${urgency.message}`
        : urgency.message;
      urgencyTextColour = urgency.textColour;
    } else if (pressure.hasInvalidInput) {
      urgencyMessage = "INCOMPLETE: Select a valid pressure input";
    } else {
      urgencyMessage = pressure.isProvisional
        ? `${PROVISIONAL_URGENCY_PREFIX}Select C/D to complete risk grid`
        : "INCOMPLETE: Select C/D to complete risk grid";
    }
    const pressureSource =
      pressure.iopBand === null
        ? "none"
        : pressure.isProvisional
          ? "palpation"
          : "tonometry";
    return {
      riskScore: roundScore(riskScore),
      reasoningDetails,
      riskFactorStrings,
      rowNum,
      colNum,
      cellId,
      cellColour,
      urgencyMessage,
      urgencyTextColour,
      isProvisionalPressure: pressure.isProvisional,
      isRockAcuteWarning,
      hasPressureConflict: pressure.hasConflict,
      pressureSource,
      resolvedIopBand: pressure.iopBand,
      togglePoints: roundScore(togglePoints),
      cupDiscRatio: validCupDiscRatio,
      discSize: safeDiscSize,
    };
  }
  function buildReasoningHtml({
    cupDiscRatio,
    discSize,
    reasoningDetails,
    riskFactorStrings,
    riskScore,
  }) {
    const parts = [];
    if (cupDiscRatio) {
      parts.push(`C/D: ${escapeHtml(cupDiscRatio)}`);
    }
    parts.push(`DS: ${escapeHtml(discSize)}`);
    if (reasoningDetails.length > 0) {
      parts.push(reasoningDetails.map(escapeHtml).join("; "));
    }
    if (riskFactorStrings.length > 0) {
      parts.push(`Risks: (${riskFactorStrings.map(escapeHtml).join(", ")})`);
    }
    const head = parts.length > 0 ? parts.join("; ") : "";
    return `${head}; Total Risk Score: <b>${formatScore(riskScore)}</b>`;
  }

  // src/risk-calculator-controller.js?v=20260511-2
  function readCheckedValue(name, root) {
    const selected = root.querySelector(`input[name="${name}"]:checked`);
    return selected ? selected.value : null;
  }
  function readToggleableFlag(name, root) {
    const selected = root.querySelector(`input[name="${name}"]`);
    return Boolean(selected && selected.checked);
  }
  function readCheckedValues(name, root) {
    return $$(`input[name="${name}"]:checked`, root).map(
      (input) => input.value,
    );
  }
  function initializeToggleableRadios(root) {
    const toggleableRadios = $$(
      'input[type="radio"][data-toggleable="true"]',
      root,
    );
    toggleableRadios.forEach((radio) => {
      radio.addEventListener("click", () => {
        if (radio.checked && radio.dataset.toggled === "true") {
          radio.checked = false;
          radio.dataset.toggled = "false";
          radio.dispatchEvent(new Event("change", { bubbles: true }));
          return;
        }
        $$(`input[name="${radio.name}"]`, root).forEach((peer) => {
          peer.dataset.toggled = "false";
        });
        radio.dataset.toggled = "true";
      });
    });
  }
  function initRiskCalculator(root = document) {
    var _a;
    const questionnaire = $(".questionnaire", root);
    const finalMessage = $("#final-message", root);
    const reasoningWindow = $("#reasoning-window", root);
    const iopRadios = $$('input[name="iop"]', root);
    const ratioButtons = $$(".ratio-button", root);
    const discButtons = $$(".disc-button", root);
    const palpationButtons = $$(".palpation-button", root);
    const riskCells = $$(".risk-cell", root);
    const visionSelect = $("#vision", root);
    if (!questionnaire || !finalMessage || !reasoningWindow) {
      return;
    }
    const selectedDiscButton = discButtons.find((button) =>
      button.classList.contains("selected"),
    );
    const state = {
      selectedRatio: null,
      selectedSize:
        (_a =
          selectedDiscButton == null
            ? void 0
            : selectedDiscButton.dataset.size) != null
          ? _a
          : DEFAULT_DISC_SIZE,
      selectedPalpation: null,
    };
    initializeToggleableRadios(root);
    function clearRenderedRisk() {
      riskCells.forEach((cell) => cell.classList.remove("highlight"));
      finalMessage.textContent = "";
      finalMessage.style.color = "black";
      reasoningWindow.textContent = "";
    }
    function clearPalpationSelection() {
      state.selectedPalpation = null;
      palpationButtons.forEach((button) =>
        button.classList.remove("is-active"),
      );
    }
    function clearMeasuredIopSelection() {
      iopRadios.forEach((radio) => {
        radio.checked = false;
      });
    }
    function readRiskInputs() {
      return {
        iop: readCheckedValue("iop", root),
        palpation: state.selectedPalpation,
        cupDiscRatio: state.selectedRatio,
        discSize: state.selectedSize,
        thinRim: readToggleableFlag("thin_rims", root),
        suspiciousFields: readToggleableFlag("field_of_vision_problem", root),
        suspiciousPupils: readToggleableFlag("suspect_pupils", root),
        vision: visionSelect ? visionSelect.value : "",
        riskFactors: readCheckedValues("other_risk_factors", root),
      };
    }
    function renderRiskOutcome(outcome) {
      riskCells.forEach((cell) => cell.classList.remove("highlight"));
      if (outcome.cellId) {
        const targetCell = root.getElementById(outcome.cellId);
        if (targetCell) {
          targetCell.classList.add("highlight");
        }
      }
      finalMessage.textContent = outcome.urgencyMessage;
      finalMessage.style.color = outcome.urgencyTextColour;
      reasoningWindow.innerHTML = buildReasoningHtml(outcome);
    }
    function maybeRecalculateRisk() {
      const inputs = readRiskInputs();
      if (!canCalculateRisk(inputs)) {
        clearRenderedRisk();
        return;
      }
      const outcome = calculateRiskOutcome(inputs);
      renderRiskOutcome(outcome);
    }
    ratioButtons.forEach((button) => {
      button.addEventListener("click", () => {
        ratioButtons.forEach((peer) => peer.classList.remove("selected"));
        button.classList.add("selected");
        state.selectedRatio = button.dataset.ratio;
        maybeRecalculateRisk();
      });
    });
    discButtons.forEach((button) => {
      button.addEventListener("click", () => {
        var _a2;
        discButtons.forEach((peer) => peer.classList.remove("selected"));
        button.classList.add("selected");
        state.selectedSize =
          (_a2 = button.dataset.size) != null ? _a2 : DEFAULT_DISC_SIZE;
        maybeRecalculateRisk();
      });
    });
    palpationButtons.forEach((button) => {
      button.addEventListener("click", () => {
        var _a2;
        const value = (_a2 = button.dataset.palpation) != null ? _a2 : null;
        if (state.selectedPalpation === value) {
          state.selectedPalpation = null;
          button.classList.remove("is-active");
        } else {
          clearMeasuredIopSelection();
          palpationButtons.forEach((peer) =>
            peer.classList.remove("is-active"),
          );
          button.classList.add("is-active");
          state.selectedPalpation = value;
        }
        maybeRecalculateRisk();
      });
    });
    iopRadios.forEach((radio) => {
      radio.addEventListener("change", () => {
        if (radio.checked) {
          clearPalpationSelection();
        }
        maybeRecalculateRisk();
      });
    });
    questionnaire.addEventListener("change", maybeRecalculateRisk);
    maybeRecalculateRisk();
  }

  // scripts.js
  function initializeApp() {
    initRiskCalculator(document);
    initPopupController(document);
    initMcqController(document);
  }
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initializeApp, {
      once: true,
    });
  } else {
    initializeApp();
  }
})();
