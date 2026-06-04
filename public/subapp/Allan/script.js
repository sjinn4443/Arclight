let limbImage = "";
let closeImage = "";
let dermImage = "";
let activeExpandButton = null;
let activeTeachingCardTrigger = null;
let selectedLesionVariationKey = "";
let selectedDermoscopyExampleKey = "";

const referenceImageMap = {
  ABCDETab: {
    light: "assets/images/abcde-su_light.webp",
    dark: "assets/images/abcde-su_dark.webp",
  },
  BVPDSTab: {
    light: "assets/images/chaos_light.webp",
    dark: "assets/images/chaos_dark.webp",
  },
  DPICTab: {
    defaultPattern: "raised-bumps",
    patterns: {
      "raised-bumps": {
        light: "assets/images/dpic-r_raised-bumps_light.webp",
        dark: "assets/images/dpic-r_raised-bumps_dark.webp",
      },
      "blisters-pustules": {
        light: "assets/images/dpic-r_blisters-pustules_light.webp",
        dark: "assets/images/dpic-r_blisters-pustules_dark.webp",
      },
      "flat-patches": {
        light: "assets/images/dpic-r_flat-patches_light.webp",
        dark: "assets/images/dpic-r_flat-patches_dark.webp",
      },
      "eczema-dermatitis": {
        light: "assets/images/dpic-r_eczema-dermatitis_light.webp",
        dark: "assets/images/dpic-r_eczema-dermatitis_dark.webp",
      },
      "psoriasis-plaques": {
        light: "assets/images/dpic-r_psoriasis-plaques_light.webp",
        dark: "assets/images/dpic-r_psoriasis-plaques_dark.webp",
      },
    },
  },
  UVTab: "assets/images/uv-reference.webp",
};

const DEFAULT_REFERENCE_IMAGE = referenceImageMap.ABCDETab.light;
const LESION_VARIATION_KEYS = ["", "01", "02", "03", "04", "05"];
const DERMOSCOPY_EXAMPLE_KEYS = ["", "01", "02", "03", "04", "05"];
const DPIC_SELECT_IDS = [
  "dpicDuration",
  "dpicPattern",
  "dpicItch",
  "dpicColour",
  "dpicRedFlags",
];

const MCQ_LEVEL_META = {
  primary: {
    title: "Primary MCQ",
    label: "Primary",
    starClass: "primary-star",
    levelIndex: 0,
    passMark: 3,
    questionCount: 5,
    intro: "Core dermatology workflow, image set and referral basics.",
  },
  intermediate: {
    title: "Intermediate MCQ",
    label: "Intermediate",
    starClass: "intermediate-star",
    levelIndex: 1,
    passMark: 4,
    questionCount: 6,
    intro: "Rash route, Wood's lamp clues and common GP pattern checks.",
  },
  advanced: {
    title: "Advanced MCQ",
    label: "Advanced",
    starClass: "advanced-star",
    levelIndex: 2,
    passMark: 6,
    questionCount: 8,
    intro:
      "Urgency overrides, skin cancer route and higher-risk rash decisions.",
  },
};

const MCQ_LEVEL_ORDER = ["primary", "intermediate", "advanced"];
const MCQ_LEVEL_PROGRESS_STORAGE_KEY = "allan-mcq-level-progress-v2";
const CUP_ACHIEVEMENT_STORAGE_KEY = "allan-cup-achievement-v2";
const DEFAULT_MCQ_PROGRESS_STATE = {
  nextTierIndex: 0,
  unlockedTierIndex: -1,
};
const DEFAULT_CUP_ACHIEVEMENT_STATE = {
  unlocked: false,
  code: "",
  unlockedAt: "",
};
const LOCKED_CUP_TEXT = "Cup locked: complete Advanced MCQ";
const UNLOCKED_CUP_TEXT = "Dermatology cup unlocked";

const MCQ_BANK = window.ALLAN_MCQ_BANK || {};

const REFERRAL_RULES = {
  abcde: {
    urgentScore: 3,
    soonScore: 1,
    urgentDriver: "ABCDE-SU suspicious lesion score 3 or more",
    reviewDriver: "ABCDE-SU low-level lesion concern",
  },
  bvpds: {
    urgentDriver: "dermoscopy chaos plus malignant clue",
    exceptionDriver: "dermoscopy exception",
    clueDriver: "dermoscopy clue recorded without chaos",
    chaosDriver: "dermoscopy chaos recorded; clues not yet recorded",
  },
  dpic: {
    emergencyRedFlagScore: 6,
    sameDayRedFlagScore: 4,
    sameDayScore: 4,
    soonScore: 2,
    emergencyDriver: "rash emergency signs",
    sameDayRedFlagDriver: "rash same-day concern",
    sameDayScoreDriver: "rash triage score 4 or more",
    soonDriver: "rash triage concern",
  },
};

let activeMcqQuestions = [];
let activeMcqMeta = null;
let activeMcqLevel = "";
let mcqProgressState = { ...DEFAULT_MCQ_PROGRESS_STATE };
let cupAchievementState = { ...DEFAULT_CUP_ACHIEVEMENT_STATE };

function setImageWithFallback(
  imgEl,
  src,
  fallbackSrc = DEFAULT_REFERENCE_IMAGE,
) {
  if (!imgEl) return;
  if (!src) {
    imgEl.dataset.pendingSrc = fallbackSrc;
    imgEl.src = fallbackSrc;
    return;
  }

  imgEl.dataset.pendingSrc = src;
  const testImage = new Image();
  testImage.onload = () => {
    if (imgEl.dataset.pendingSrc === src) {
      imgEl.src = src;
    }
  };
  testImage.onerror = () => {
    if (imgEl.dataset.pendingSrc === src) {
      imgEl.src = fallbackSrc;
    }
  };
  testImage.src = src;
}

function openTab(event, tabId) {
  const tabButtons = document.querySelectorAll(".tab-btn");
  const tabContents = document.querySelectorAll(".tab-content");
  const menuButtons = document.querySelectorAll(
    ".reference-menu-card[data-tab]",
  );
  const selectedButton =
    event?.currentTarget ||
    document.querySelector(`.tab-btn[data-tab-target="${tabId}"]`);
  const selectedTab = document.getElementById(tabId);
  if (!selectedButton || !selectedTab) return;

  closeTermInfoPopover();
  closeDermoscopyBucketDetails();
  tabButtons.forEach((button) => {
    const isSelected = button === selectedButton;
    button.classList.toggle("active", isSelected);
    button.setAttribute("aria-selected", String(isSelected));
    button.tabIndex = isSelected ? 0 : -1;
  });
  tabContents.forEach((tab) => {
    const isSelected = tab === selectedTab;
    tab.classList.toggle("active", isSelected);
    tab.hidden = !isSelected;
  });
  menuButtons.forEach((button) =>
    button.classList.toggle("is-active", button.dataset.tab === tabId),
  );
  syncDermoscopyExampleMenuState(tabId);
  syncLesionVariationControls(tabId);
  syncDermoscopyReferenceControls(tabId);

  setReferencePreviewImage(tabId);
  setUserPreviewImage(tabId);
  updateCaptureRelevance(tabId);
  updateRiskReferral();
}

function handleRouteTabKeydown(event) {
  const navigationKeys = ["ArrowLeft", "ArrowRight", "Home", "End"];
  if (!navigationKeys.includes(event.key)) return;

  const tabs = Array.from(
    document.querySelectorAll(".tab-btn[data-tab-target]"),
  );
  const currentIndex = tabs.indexOf(event.currentTarget);
  if (currentIndex === -1) return;

  event.preventDefault();

  let nextIndex = currentIndex;
  if (event.key === "ArrowRight") {
    nextIndex = (currentIndex + 1) % tabs.length;
  } else if (event.key === "ArrowLeft") {
    nextIndex = (currentIndex - 1 + tabs.length) % tabs.length;
  } else if (event.key === "Home") {
    nextIndex = 0;
  } else if (event.key === "End") {
    nextIndex = tabs.length - 1;
  }

  const nextTab = tabs[nextIndex];
  nextTab.focus();
  openTab({ currentTarget: nextTab }, nextTab.dataset.tabTarget);
}

function setReferencePreviewImage(tabId) {
  const referencePreview = document.getElementById("referencePreview");
  if (!referencePreview) return;

  setImageWithFallback(referencePreview, getReferenceImageSource(tabId));
}

function getReferenceImageSource(tabId) {
  const referenceEntry = referenceImageMap[tabId];
  if (!referenceEntry || typeof referenceEntry === "string") {
    return referenceEntry;
  }

  const toneKey = getSkinToneContext().toLowerCase();
  if (tabId === "ABCDETab" && selectedLesionVariationKey) {
    return getLesionVariationImageSource(selectedLesionVariationKey, toneKey);
  }

  if (tabId === "BVPDSTab" && selectedDermoscopyExampleKey) {
    return getDermoscopyExampleImageSource(
      selectedDermoscopyExampleKey,
      toneKey,
    );
  }

  if (tabId === "DPICTab") {
    const patternKey = getDPICPatternKey(referenceEntry.defaultPattern);
    return (
      referenceEntry.patterns?.[patternKey]?.[toneKey] ||
      referenceEntry.patterns?.[referenceEntry.defaultPattern]?.[toneKey] ||
      referenceEntry.patterns?.[referenceEntry.defaultPattern]?.light
    );
  }

  return referenceEntry[toneKey] || referenceEntry.light;
}

function getLesionVariationImageSource(
  exampleKey,
  toneKey = getSkinToneContext().toLowerCase(),
) {
  const normalisedKey = String(exampleKey || "").padStart(2, "0");
  const normalisedTone = toneKey === "dark" ? "dark" : "light";
  return `variations/abcde-su-variation-${normalisedKey}_${normalisedTone}.webp`;
}

function getLesionVariationIndex() {
  const currentIndex = LESION_VARIATION_KEYS.indexOf(
    selectedLesionVariationKey,
  );
  return currentIndex >= 0 ? currentIndex : 0;
}

function syncLesionVariationControls(
  activeTabId = document.querySelector(".tab-content.active")?.id || "",
) {
  const controls = document.getElementById("lesionReferenceControls");
  if (!controls) return;

  const isLesionTab = activeTabId === "ABCDETab";
  controls.hidden = !isLesionTab;
  if (isLesionTab) {
    const currentIndex = getLesionVariationIndex();
    controls.setAttribute(
      "aria-label",
      currentIndex === 0
        ? "Lesion illustrative examples: base"
        : `Lesion illustrative examples: ${currentIndex} of 5`,
    );
  }
}

function selectLesionVariationByOffset(offset) {
  const nextIndex =
    (getLesionVariationIndex() + offset + LESION_VARIATION_KEYS.length) %
    LESION_VARIATION_KEYS.length;
  selectedLesionVariationKey = LESION_VARIATION_KEYS[nextIndex];

  const lesionTabButton = document.getElementById("abcdeBtn");
  if (lesionTabButton && !lesionTabButton.classList.contains("active")) {
    openTab({ currentTarget: lesionTabButton }, "ABCDETab");
  } else {
    setReferencePreviewImage("ABCDETab");
    syncLesionVariationControls("ABCDETab");
  }
}

function getDermoscopyExampleImageSource(
  exampleKey,
  toneKey = getSkinToneContext().toLowerCase(),
) {
  const normalisedKey = String(exampleKey || "").padStart(2, "0");
  const normalisedTone = toneKey === "dark" ? "dark" : "light";
  return `dermoscopy-examples/chaos-clues-${normalisedKey}_${normalisedTone}.webp`;
}

function syncDermoscopyExampleMenuImages() {
  const toneKey = getSkinToneContext().toLowerCase();
  document
    .querySelectorAll(".dermoscopy-example-card[data-dermoscopy-example-key]")
    .forEach((button) => {
      const image = button.querySelector("img");
      if (!image) return;

      image.src = getDermoscopyExampleImageSource(
        button.dataset.dermoscopyExampleKey,
        toneKey,
      );
    });
}

function getDermoscopyExampleIndex() {
  const currentIndex = DERMOSCOPY_EXAMPLE_KEYS.indexOf(
    selectedDermoscopyExampleKey,
  );
  return currentIndex >= 0 ? currentIndex : 0;
}

function syncDermoscopyReferenceControls(
  activeTabId = document.querySelector(".tab-content.active")?.id || "",
) {
  const controls = document.getElementById("dermoscopyReferenceControls");
  if (!controls) return;

  const isDermoscopyTab = activeTabId === "BVPDSTab";
  controls.hidden = !isDermoscopyTab;
  if (isDermoscopyTab) {
    const currentIndex = getDermoscopyExampleIndex();
    controls.setAttribute(
      "aria-label",
      currentIndex === 0
        ? "Dermoscopy illustrative examples: base"
        : `Dermoscopy illustrative examples: ${currentIndex} of 5`,
    );
  }
}

function selectDermoscopyExampleByOffset(offset) {
  const nextIndex =
    (getDermoscopyExampleIndex() + offset + DERMOSCOPY_EXAMPLE_KEYS.length) %
    DERMOSCOPY_EXAMPLE_KEYS.length;
  selectedDermoscopyExampleKey = DERMOSCOPY_EXAMPLE_KEYS[nextIndex];

  const dermoscopyTabButton = document.getElementById("bvpdsBtn");
  if (
    dermoscopyTabButton &&
    !dermoscopyTabButton.classList.contains("active")
  ) {
    openTab({ currentTarget: dermoscopyTabButton }, "BVPDSTab");
  } else {
    setReferencePreviewImage("BVPDSTab");
    syncDermoscopyExampleMenuState("BVPDSTab");
    syncDermoscopyReferenceControls("BVPDSTab");
  }
}

function getAbcdeTeachingCardSource(
  toneKey = getSkinToneContext().toLowerCase(),
) {
  return toneKey === "dark"
    ? "assets/images/abcde-su-card_dark.webp"
    : "assets/images/abcde-su-card_light.webp";
}

function getChaosTeachingCardSource(
  toneKey = getSkinToneContext().toLowerCase(),
) {
  return toneKey === "dark"
    ? "assets/images/chaos-card_dark.webp"
    : "assets/images/chaos-card_light.webp";
}

function syncAbcdeTeachingCardImages() {
  const source = getAbcdeTeachingCardSource();
  const thumbnail = document.getElementById("abcdeCardMenuThumb");
  const modalImage = document.getElementById("abcdeCardImage");

  if (thumbnail) {
    thumbnail.src = source;
  }

  if (modalImage) {
    modalImage.src = source;
  }
}

function syncChaosTeachingCardImages() {
  const source = getChaosTeachingCardSource();
  const thumbnail = document.getElementById("chaosCardMenuThumb");
  const modalImage = document.getElementById("chaosCardImage");

  if (thumbnail) {
    thumbnail.src = source;
  }

  if (modalImage) {
    modalImage.src = source;
  }
}

function syncDermoscopyExampleMenuState(
  activeTabId = document.querySelector(".tab-content.active")?.id || "",
) {
  document
    .querySelectorAll(".dermoscopy-example-card[data-dermoscopy-example-key]")
    .forEach((button) => {
      const isActive =
        activeTabId === "BVPDSTab" &&
        Boolean(selectedDermoscopyExampleKey) &&
        button.dataset.dermoscopyExampleKey === selectedDermoscopyExampleKey;
      button.classList.toggle("is-active", isActive);
      button.setAttribute("aria-pressed", String(isActive));
    });
}

function clearDermoscopyExampleSelection() {
  selectedDermoscopyExampleKey = "";
  syncDermoscopyExampleMenuState();
  syncDermoscopyReferenceControls();
}

function selectDermoscopyExample(button) {
  const exampleKey = button?.dataset?.dermoscopyExampleKey;
  if (!exampleKey) return;

  selectedDermoscopyExampleKey = exampleKey;
  syncDermoscopyExampleMenuState("BVPDSTab");

  const dermoscopyTabButton = document.getElementById("bvpdsBtn");
  if (dermoscopyTabButton) {
    openTab({ currentTarget: dermoscopyTabButton }, "BVPDSTab");
  } else {
    setReferencePreviewImage("BVPDSTab");
    syncDermoscopyReferenceControls("BVPDSTab");
  }
}

function openAbcdeTeachingCard(triggerButton = null) {
  const modal = document.getElementById("abcdeCardModal");
  const modalImage = document.getElementById("abcdeCardImage");
  const closeButton = document.getElementById("abcdeCardClose");
  if (!modal || !modalImage) return;

  activeTeachingCardTrigger = triggerButton;
  modalImage.src = getAbcdeTeachingCardSource();
  modal.hidden = false;
  modal.classList.add("open");
  modal.setAttribute("aria-hidden", "false");
  document.body.classList.add("modal-open");
  closeButton?.focus({ preventScroll: true });
}

function closeAbcdeTeachingCard() {
  const modal = document.getElementById("abcdeCardModal");
  if (!modal || modal.hidden) return;

  modal.classList.remove("open");
  modal.hidden = true;
  modal.setAttribute("aria-hidden", "true");
  document.body.classList.remove("modal-open");
  activeTeachingCardTrigger?.focus({ preventScroll: true });
  activeTeachingCardTrigger = null;
}

function openChaosTeachingCard(triggerButton = null) {
  const modal = document.getElementById("chaosCardModal");
  const modalImage = document.getElementById("chaosCardImage");
  const closeButton = document.getElementById("chaosCardClose");
  if (!modal || !modalImage) return;

  activeTeachingCardTrigger = triggerButton;
  modalImage.src = getChaosTeachingCardSource();
  modal.hidden = false;
  modal.classList.add("open");
  modal.setAttribute("aria-hidden", "false");
  document.body.classList.add("modal-open");
  closeButton?.focus({ preventScroll: true });
}

function closeChaosTeachingCard() {
  const modal = document.getElementById("chaosCardModal");
  if (!modal || modal.hidden) return;

  modal.classList.remove("open");
  modal.hidden = true;
  modal.setAttribute("aria-hidden", "true");
  document.body.classList.remove("modal-open");
  activeTeachingCardTrigger?.focus({ preventScroll: true });
  activeTeachingCardTrigger = null;
}

function getDPICPatternKey(defaultPattern = "raised-bumps") {
  const patternSelect = document.getElementById("dpicPattern");
  const selectedOption = patternSelect?.selectedOptions?.[0];
  return selectedOption?.dataset.referenceKey || defaultPattern;
}

function handleDPICPatternChange() {
  markDPICFieldTouched("dpicPattern");
  const activeTabId = document.querySelector(".tab-content.active")?.id || "";
  if (activeTabId === "DPICTab") {
    setReferencePreviewImage(activeTabId);
  }

  markRiskAssessmentStarted();
}

function setUserPreviewImage(tabId) {
  const userPreview = document.getElementById("userPreview");
  const userPreviewPlaceholder = document.getElementById(
    "userPreviewPlaceholder",
  );
  const userImageFrame = userPreview?.closest(".user-image-frame");
  if (!userPreview) return;

  const setUserImage = (src) => {
    const hasImage = Boolean(src);
    userPreview.hidden = !hasImage;
    if (hasImage) {
      userPreview.src = src;
    } else {
      userPreview.removeAttribute("src");
    }

    if (userPreviewPlaceholder) {
      userPreviewPlaceholder.hidden = hasImage;
    }
    userImageFrame?.classList.toggle("is-empty", !hasImage);
  };

  switch (tabId) {
    case "ABCDETab":
      setUserImage(closeImage);
      break;
    case "BVPDSTab":
      setUserImage(dermImage);
      break;
    case "DPICTab":
      setUserImage(closeImage);
      break;
    case "UVTab":
      setUserImage(closeImage);
      break;
    default:
      setUserImage("");
  }
}

function updateCaptureRelevance(tabId) {
  const capturePurposeMap = {
    limbCapture: "context",
    closeCapture: "supporting",
    dermatCapture: "supporting",
  };
  const activeCaptureMap = {
    ABCDETab: "closeCapture",
    BVPDSTab: "dermatCapture",
    DPICTab: "closeCapture",
    UVTab: "closeCapture",
  };
  const captureHasImageMap = {
    limbCapture: Boolean(limbImage),
    closeCapture: Boolean(closeImage),
    dermatCapture: Boolean(dermImage),
  };
  const activeCaptureId = activeCaptureMap[tabId] || "";

  Object.keys(capturePurposeMap).forEach((captureId) => {
    const captureBox = document.getElementById(captureId);
    if (!captureBox) return;

    const isActive = captureId === activeCaptureId;
    const hasImage = captureHasImageMap[captureId];
    const isContext = capturePurposeMap[captureId] === "context";
    captureBox.classList.toggle(
      "capture-box--active-source",
      isActive && hasImage,
    );
    captureBox.classList.toggle(
      "capture-box--context-source",
      isContext && hasImage && !isActive,
    );
    captureBox.classList.toggle(
      "capture-box--muted-source",
      hasImage && !isActive && !isContext,
    );
  });
}

function toggleSkinTone() {
  const toneToggle = document.getElementById("skinToneToggle");
  const toneLabel = document.getElementById("skinToneLabel");
  if (!toneToggle || !toneLabel) return;

  const isDark = toneToggle.checked;
  toneLabel.textContent = isDark ? "Dark" : "Light";
  document.body.classList.toggle("skin-tone-dark", isDark);
  updateSkinToneGuidance(isDark);
  syncDermoscopyExampleMenuImages();
  syncAbcdeTeachingCardImages();
  syncChaosTeachingCardImages();
  setReferencePreviewImage(
    document.querySelector(".tab-content.active")?.id || "ABCDETab",
  );
}

function updateSkinToneGuidance(isDark) {
  const colourConcern = document.getElementById("dpicColourConcern");
  const skinToneHint = document.getElementById("skinToneHint");

  if (colourConcern) {
    colourConcern.textContent = isDark
      ? "Darkening, purple-grey change or swelling"
      : "Redness or swelling";
  }

  if (skinToneHint) {
    skinToneHint.hidden = !isDark;
  }
}

function getSkinToneContext() {
  const toneToggle = document.getElementById("skinToneToggle");
  return toneToggle?.checked ? "Dark" : "Light";
}

function triggerFileDialog(type) {
  document.getElementById(`${type}Input`)?.click();
}

function handleFileSelection(event, type) {
  const file = event.target.files && event.target.files[0];
  if (file) {
    readImageFile(file, type);
  }
}

function readImageFile(file, type) {
  const reader = new FileReader();
  reader.onload = function (event) {
    const dataURL = event.target.result;
    const previewMap = {
      limb: ["limbPreview", "#limbCapture .capture-label"],
      close: ["closePreview", "#closeCapture .capture-label"],
      dermoscope: ["dermoscopePreview", "#dermatCapture .capture-label"],
    };

    if (type === "limb") {
      limbImage = dataURL;
    } else if (type === "close") {
      closeImage = dataURL;
    } else if (type === "dermoscope") {
      dermImage = dataURL;
    }

    const previewConfig = previewMap[type];
    if (previewConfig) {
      updateTopPreview(previewConfig[0], dataURL);
      const label = document.querySelector(previewConfig[1]);
      if (label) {
        label.hidden = true;
      }
    }

    const activeTabId = document.querySelector(".tab-content.active")?.id || "";
    setUserPreviewImage(activeTabId);
  };
  reader.readAsDataURL(file);
}

function updateTopPreview(previewId, dataURL) {
  const imgEl = document.getElementById(previewId);
  if (!imgEl) return;

  imgEl.src = dataURL;
  imgEl.hidden = false;
  imgEl.closest(".capture-box")?.classList.add("capture-box--complete");
  updateCaptureRelevance(
    document.querySelector(".tab-content.active")?.id || "ABCDETab",
  );
}

function setTeachingMode(isOn) {
  const teachingToggle = document.getElementById("holdExpandTeachingToggle");
  const activeTabId = document.querySelector(".tab-content.active")?.id || "";
  const enabled = Boolean(isOn && teachingToggle && !teachingToggle.hidden);
  const teachingTargets = {
    ABCDETab: {
      overlay: document.getElementById("abcdeTeachingOverlay"),
      legend: document.getElementById("abcdeTeachingLegend"),
    },
    BVPDSTab: {
      overlay: document.getElementById("bvpdsTeachingOverlay"),
      legend: document.getElementById("bvpdsTeachingLegend"),
    },
  };

  teachingToggle?.setAttribute("aria-pressed", String(enabled));
  teachingToggle?.classList.toggle("is-active", enabled);
  Object.values(teachingTargets).forEach((target) => {
    if (target.overlay) {
      target.overlay.hidden = true;
      target.overlay.setAttribute("aria-hidden", "true");
    }
    if (target.legend) {
      target.legend.hidden = true;
    }
  });

  const activeTarget = teachingTargets[activeTabId];
  if (!enabled || !activeTarget) return;

  if (activeTarget.overlay) {
    activeTarget.overlay.hidden = false;
    activeTarget.overlay.setAttribute("aria-hidden", "false");
  }
  if (activeTarget.legend) {
    activeTarget.legend.hidden = false;
  }
}

function openImageExpand(button) {
  const referenceImage = document.getElementById("referencePreview");
  const userImage = document.getElementById("userPreview");
  const overlay = document.getElementById("holdExpandOverlay");
  const expandedReferenceImage = document.getElementById(
    "holdExpandReferenceImage",
  );
  const expandedUserImage = document.getElementById("holdExpandUserImage");
  const expandedUserEmpty = document.getElementById("holdExpandUserEmpty");
  const teachingToggle = document.getElementById("holdExpandTeachingToggle");
  const expandedLabel = document.getElementById("holdExpandLabel");
  const closeButton = document.getElementById("holdExpandClose");
  if (
    !referenceImage ||
    !overlay ||
    !expandedReferenceImage ||
    !expandedUserImage ||
    !expandedLabel ||
    !referenceImage.src
  )
    return;

  activeExpandButton = button;
  expandedReferenceImage.src = referenceImage.currentSrc || referenceImage.src;
  expandedReferenceImage.alt =
    referenceImage.alt || "Expanded illustrative reference image";
  expandedLabel.textContent = "Teaching view";

  const hasUserImage = Boolean(userImage && !userImage.hidden && userImage.src);
  expandedUserImage.hidden = !hasUserImage;
  if (hasUserImage) {
    expandedUserImage.src = userImage.currentSrc || userImage.src;
    expandedUserImage.alt = userImage.alt || "Expanded user image";
  } else {
    expandedUserImage.removeAttribute("src");
  }
  if (expandedUserEmpty) {
    expandedUserEmpty.hidden = hasUserImage;
  }

  const activeTabId = document.querySelector(".tab-content.active")?.id || "";
  if (teachingToggle) {
    const teachingAvailable =
      activeTabId === "BVPDSTab" ||
      (activeTabId === "ABCDETab" && !selectedLesionVariationKey);
    teachingToggle.hidden = !teachingAvailable;
  }
  setTeachingMode(false);

  overlay.hidden = false;
  overlay.setAttribute("aria-hidden", "false");
  document.body.classList.add("modal-open");
  closeButton?.focus({ preventScroll: true });
}

function closeImageExpand() {
  const overlay = document.getElementById("holdExpandOverlay");
  if (!overlay || overlay.hidden) return;

  overlay.hidden = true;
  overlay.setAttribute("aria-hidden", "true");
  setTeachingMode(false);
  document.body.classList.remove("modal-open");
  activeExpandButton?.focus({ preventScroll: true });
  activeExpandButton = null;
}

function initImageHoldExpand() {
  document.querySelectorAll(".image-expand-hold").forEach((button) => {
    button.addEventListener("click", (event) => {
      event.preventDefault();
      openImageExpand(button);
    });
  });

  document
    .getElementById("holdExpandClose")
    ?.addEventListener("click", closeImageExpand);
  document
    .getElementById("holdExpandTeachingToggle")
    ?.addEventListener("click", (event) => {
      const button = event.currentTarget;
      setTeachingMode(button.getAttribute("aria-pressed") !== "true");
    });
  document
    .getElementById("holdExpandOverlay")
    ?.addEventListener("click", (event) => {
      if (event.target === event.currentTarget) {
        closeImageExpand();
      }
    });
}

function dragOverHandler(event) {
  event.preventDefault();
  if (event.currentTarget.classList.contains("capture-box")) {
    event.currentTarget.classList.add("drag-over");
  }
}

function dropHandler(event, type) {
  event.preventDefault();
  event.currentTarget.classList.remove("drag-over");
  const file = event.dataTransfer?.files[0];
  if (file) {
    readImageFile(file, type);
  }
}

function getSelectText(selectId) {
  const select = document.getElementById(selectId);
  return select?.selectedOptions?.[0]?.textContent?.trim() || "";
}

function getCheckedLabelText(selector) {
  return Array.from(document.querySelectorAll(selector))
    .filter((input) => input.checked)
    .map((input) => input.closest("label")?.textContent?.trim())
    .filter(Boolean);
}

function formatList(items) {
  if (!items.length) return "none";
  return items.map((item) => `- ${item}`).join("\n");
}

function formatInlineList(items) {
  return items.length ? items.join("; ") : "none recorded";
}

function getImageStatus() {
  return [
    `Area/limb: ${limbImage ? "attached" : "missing"}`,
    `Close-up: ${closeImage ? "attached" : "missing"}`,
    `Dermoscopy: ${dermImage ? "attached" : "missing"}`,
  ].join("\n");
}

function getReportImageEntries() {
  return [
    { label: "Area/limb", slug: "area-limb", dataUrl: limbImage },
    { label: "Close-up", slug: "close-up", dataUrl: closeImage },
    { label: "Dermoscopy", slug: "dermoscopy", dataUrl: dermImage },
  ].filter((entry) => Boolean(entry.dataUrl));
}

function getReportPhotoSummary() {
  const entries = getReportImageEntries();
  const ready = entries.map((entry) => entry.label).join("; ") || "none";
  return `Photos ready in app: ${ready}. Expected set: area/limb, close-up and dermoscopy.`;
}

function getReportRoute(abcdeItems, bvpdsItems) {
  const activeTabId = document.querySelector(".tab-content.active")?.id || "";
  const hasSkinCancerAssessment =
    abcdeItems.length > 0 || bvpdsItems.length > 0;
  const hasRashAssessment = hasCurrentDPICConcern();
  const usedWoodLamp = activeTabId === "UVTab";

  if (hasSkinCancerAssessment && hasRashAssessment) {
    return usedWoodLamp
      ? "skin cancer + rash/Wood's lamp routes"
      : "skin cancer + rash routes";
  }
  if (hasSkinCancerAssessment) return "skin cancer route";
  if (hasRashAssessment)
    return usedWoodLamp ? "rash + Wood's lamp route" : "rash route";
  return "not selected";
}

function getReportLogicNote() {
  return [
    "Logic: ABCDE-SU and dermoscopy are assessed separately; referral uses the highest urgency, not an added total.",
    "ABCDE-SU 1-2 means safety-net review; ABCDE-SU 3 or more triggers the Susp cancer pathway (2 week wait).",
    "Dermoscopy uses a frontline Chaos + Clues compression: chaos plus any clue, or an exception, triggers the Susp cancer pathway (2 week wait). Chaos alone means check dermoscopy clues before relying on the route.",
    "Rash triage sets rash urgency. DPIC-R is a dermatology teaching prompt, not a recognised formal score. Wood's lamp is linked to the rash route as a supportive fluorescence clue and does not change urgency by itself.",
  ].join(" ");
}

function getBVPDSFindings() {
  const checkedInputs = Array.from(
    document.querySelectorAll(".bvpds-input:checked"),
  );
  const hasKind = (input, kind) =>
    (input.dataset.bvpdsKind || "").split(/\s+/).filter(Boolean).includes(kind);
  const toText = (input) => input.closest("label")?.innerText.trim() || "";

  const chaosItems = checkedInputs
    .filter((input) => hasKind(input, "chaos"))
    .map(toText)
    .filter(Boolean);
  const clueItems = checkedInputs
    .filter((input) => hasKind(input, "clue"))
    .map(toText)
    .filter(Boolean);
  const exceptionItems = checkedInputs
    .filter((input) => hasKind(input, "exception"))
    .map(toText)
    .filter(Boolean);

  return {
    checkedInputs,
    chaosItems,
    clueItems,
    exceptionItems,
    hasChaos: chaosItems.length > 0,
    hasClue: clueItems.length > 0,
    hasException: exceptionItems.length > 0,
  };
}

function getDermoscopyReportLines() {
  const findings = getBVPDSFindings();

  if (!findings.checkedInputs.length) {
    return ["Dermoscopy: not assessed"];
  }

  return [
    "Dermoscopy route: Chaos + Clues",
    `Chaos: ${findings.hasChaos ? "present" : "not recorded"}`,
    `Clue buckets: ${findings.clueItems.length ? formatInlineList(findings.clueItems) : "none recorded"}`,
    `Exceptions: ${findings.exceptionItems.length ? formatInlineList(findings.exceptionItems) : "none recorded"}`,
  ];
}

function buildReportText() {
  const referralEvaluation = getReferralEvaluation();
  applyReferralEvaluation(referralEvaluation);

  const location =
    document.getElementById("lesionLocation")?.value || "Not set";
  const skinToneContext = getSkinToneContext();
  const abcdeScore = calculateABCDEScore();
  const dpicScore = calculateDPICScore();
  const abcdeItems = getCheckedLabelText(".abcde-input");
  const bvpdsItems = getCheckedLabelText(".bvpds-input");
  const hasAssessmentInput = hasCurrentRiskAssessmentInput();
  const hasSkinCancerAssessment =
    abcdeItems.length > 0 || bvpdsItems.length > 0;
  const hasRashAssessment = hasCurrentDPICConcern();
  const requestedUrgency = hasAssessmentInput
    ? referralEvaluation.action
    : "Not assessed yet";
  const urgencyDriver = !hasAssessmentInput
    ? "assessment not started"
    : referralEvaluation.drivers.length
      ? referralEvaluation.drivers.join("; ")
      : "none recorded";
  const activeRoute = hasAssessmentInput
    ? getReportRoute(abcdeItems, bvpdsItems)
    : "not selected";
  const abcdeReportLine = abcdeItems.length
    ? `ABCDE-SU ${abcdeScore}: ${formatInlineList(abcdeItems)}`
    : "ABCDE-SU: not assessed";
  const skinCancerPromptLines = hasSkinCancerAssessment
    ? [abcdeReportLine, ...getDermoscopyReportLines()]
    : ["ABCDE-SU: not assessed", "Dermoscopy: not assessed"];
  const rashPromptLines = hasRashAssessment
    ? [
        `Rash triage ${dpicScore}`,
        `Duration: ${getSelectText("dpicDuration")}`,
        `Pattern: ${getSelectText("dpicPattern")}`,
        `Itch: ${getSelectText("dpicItch")}`,
        `Colour: ${getSelectText("dpicColour")}`,
        `Red flags: ${getSelectText("dpicRedFlags")}`,
      ]
    : ["Rash triage: not assessed"];

  return [
    "Dermatology mini referral note",
    "",
    `Requested urgency: ${requestedUrgency}`,
    `Reason: ${urgencyDriver}`,
    `Route used: ${activeRoute}`,
    `Location: ${location}`,
    `Skin context: ${skinToneContext}`,
    "",
    "Photos",
    getImageStatus(),
    getReportPhotoSummary(),
    "",
    "Skin cancer prompts",
    ...skinCancerPromptLines,
    "",
    "Rash triage prompts",
    ...rashPromptLines,
    "",
    getReportLogicNote(),
    "Sources: see in-app Logic + sources.",
    "Note: referral-aide only, not a final diagnosis.",
  ].join("\n");
}

function appendReportLine(container, line) {
  const paragraph = document.createElement("p");
  const separatorIndex = line.indexOf(":");

  if (separatorIndex > 0 && separatorIndex < 32) {
    const label = document.createElement("strong");
    label.textContent = `${line.slice(0, separatorIndex)}:`;
    paragraph.append(label, ` ${line.slice(separatorIndex + 1).trim()}`);
  } else {
    paragraph.textContent = line;
  }

  container.appendChild(paragraph);
}

function renderReportPreview(reportValue) {
  const reportPreview = document.getElementById("reportPreview");
  if (!reportPreview) return;

  reportPreview.textContent = "";
  String(reportValue || "")
    .split(/\n{2,}/)
    .map((block) => block.trim())
    .filter(Boolean)
    .forEach((block, blockIndex) => {
      const lines = block
        .split("\n")
        .map((line) => line.trim())
        .filter(Boolean);
      if (!lines.length) return;

      const section = document.createElement("section");
      section.className = "report-preview-section";

      if (blockIndex === 0) {
        const title = document.createElement("p");
        title.className = "report-preview-title";
        title.textContent = lines[0];
        section.appendChild(title);
        lines.slice(1).forEach((line) => appendReportLine(section, line));
      } else if (lines.length > 1 && !lines[0].includes(":")) {
        const heading = document.createElement("h3");
        heading.textContent = lines[0];
        section.appendChild(heading);
        lines.slice(1).forEach((line) => appendReportLine(section, line));
      } else {
        lines.forEach((line) => appendReportLine(section, line));
      }

      reportPreview.appendChild(section);
    });
}

function generateReport() {
  const reportModal = document.getElementById("reportModal");
  const reportText = document.getElementById("reportText");
  const reportPreview = document.getElementById("reportPreview");
  const closeReportButton = document.getElementById("closeReportModal");
  const reportModalContent = document.querySelector(".report-modal-content");
  if (!reportModal || !reportText || !reportPreview) return;

  closeSideMenu();
  closeInfoModal();
  closeMcqModal();
  closeLocationPicker();
  closeTermInfoPopover();
  setReportStatus("");
  resetReportActions();
  const reportValue = buildReportText();
  reportText.value = reportValue;
  renderReportPreview(reportValue);
  reportPreview.scrollTop = 0;
  reportModal.classList.add("open");
  reportModal.setAttribute("aria-hidden", "false");
  document.body.classList.add("modal-open");
  (closeReportButton || reportModalContent)?.focus({ preventScroll: true });
  reportPreview.scrollTop = 0;
}

function updateRiskReferral() {
  updateRedFlagControlState();
  applyReferralEvaluation(getReferralEvaluation());
}

function markRiskAssessmentStarted() {
  updateRiskReferral();
}

function markDPICFieldTouched(selectId) {
  const select = document.getElementById(selectId);
  if (select) {
    select.dataset.touched = "true";
  }
}

function updateRedFlagControlState() {
  const redFlagsSelect = document.getElementById("dpicRedFlags");
  const redFlagsItem = document.getElementById("dpicRedFlagsItem");
  if (!redFlagsSelect || !redFlagsItem) return;

  const redFlagsVal = parseInt(redFlagsSelect.value, 10);
  const rules = REFERRAL_RULES.dpic;
  redFlagsItem.classList.toggle(
    "is-same-day",
    redFlagsVal >= rules.sameDayRedFlagScore &&
      redFlagsVal < rules.emergencyRedFlagScore,
  );
  redFlagsItem.classList.toggle(
    "is-emergency",
    redFlagsVal >= rules.emergencyRedFlagScore,
  );
}

function getReferralEvaluation() {
  const abcdeScore = calculateABCDEScore();
  const dpicScore = calculateDPICScore();

  const evaluations = [
    getABCDEReferral(abcdeScore),
    getBVPDSReferral(),
    getDPICReferral(dpicScore),
  ];
  const finalEvaluation = evaluations.reduce(
    (highest, evaluation) =>
      evaluation.priority > highest.priority ? evaluation : highest,
    evaluations[0],
  );
  const drivers = evaluations
    .filter(
      (evaluation) =>
        evaluation.priority === finalEvaluation.priority &&
        evaluation.priority > 0,
    )
    .map((evaluation) => evaluation.driver);

  return { ...finalEvaluation, drivers };
}

function applyReferralEvaluation(evaluation) {
  const isAssessed = hasCurrentRiskAssessmentInput();
  const riskState = isAssessed
    ? evaluation?.riskState || "routine"
    : "unassessed";
  const action = isAssessed
    ? evaluation?.action || "Routine (weeks)"
    : "Not assessed yet";

  const riskIndicator = document.getElementById("riskIndicator");
  riskIndicator.className = `risk-dot ${riskState}`;
  riskIndicator.setAttribute("aria-label", action);
  document.getElementById("actionText").textContent = action;
}

function referralEvaluation(priority, riskState, action, driver) {
  return { priority, riskState, action, driver };
}

function calculateCheckedScore(selector) {
  let score = 0;
  const inputs = document.querySelectorAll(selector);
  inputs.forEach((input) => {
    if (input.checked) {
      score += parseInt(input.getAttribute("data-score"), 10);
    }
  });
  return score;
}

function hasCheckedInput(selector) {
  return Array.from(document.querySelectorAll(selector)).some(
    (input) => input.checked,
  );
}

function calculateABCDEScore() {
  return calculateCheckedScore(".abcde-input");
}

function getABCDEReferral(score) {
  const rules = REFERRAL_RULES.abcde;
  if (score >= rules.urgentScore) {
    return referralEvaluation(
      2,
      "urgent",
      "Susp cancer pathway (2 week wait)",
      rules.urgentDriver,
    );
  }
  if (score >= rules.soonScore) {
    return referralEvaluation(
      1,
      "soon",
      "Safety-net review",
      rules.reviewDriver,
    );
  }

  return referralEvaluation(0, "routine", "Routine (weeks)", "");
}

function getBVPDSReferral() {
  const rules = REFERRAL_RULES.bvpds;
  const findings = getBVPDSFindings();

  if (findings.hasException) {
    return referralEvaluation(
      2,
      "urgent",
      "Susp cancer pathway (2 week wait)",
      rules.exceptionDriver,
    );
  }
  if (findings.hasChaos && findings.hasClue) {
    return referralEvaluation(
      2,
      "urgent",
      "Susp cancer pathway (2 week wait)",
      rules.urgentDriver,
    );
  }
  if (findings.hasClue) {
    return referralEvaluation(
      1,
      "soon",
      "Check dermoscopy sequence",
      rules.clueDriver,
    );
  }
  if (findings.hasChaos) {
    return referralEvaluation(
      1,
      "soon",
      "Check dermoscopy clues",
      rules.chaosDriver,
    );
  }

  return referralEvaluation(0, "routine", "Routine (weeks)", "");
}

function calculateDPICScore() {
  const durationVal = parseInt(
    document.getElementById("dpicDuration").value,
    10,
  );
  const patternVal = parseInt(document.getElementById("dpicPattern").value, 10);
  const itchVal = parseInt(document.getElementById("dpicItch").value, 10);
  const colourVal = parseInt(document.getElementById("dpicColour").value, 10);
  const redFlagsVal = parseInt(
    document.getElementById("dpicRedFlags").value,
    10,
  );

  return durationVal + patternVal + itchVal + colourVal + redFlagsVal;
}

function hasCurrentDPICConcern() {
  const durationVal = parseInt(
    document.getElementById("dpicDuration")?.value || "0",
    10,
  );
  const patternVal = parseInt(
    document.getElementById("dpicPattern")?.value || "0",
    10,
  );
  const itchVal = parseInt(
    document.getElementById("dpicItch")?.value || "0",
    10,
  );
  const colourVal = parseInt(
    document.getElementById("dpicColour")?.value || "0",
    10,
  );
  const redFlagsVal = parseInt(
    document.getElementById("dpicRedFlags")?.value || "0",
    10,
  );
  const hasTouchedRashField = DPIC_SELECT_IDS.some(
    (selectId) => document.getElementById(selectId)?.dataset.touched === "true",
  );

  return (
    hasTouchedRashField ||
    durationVal > 0 ||
    patternVal > 1 ||
    itchVal > 0 ||
    colourVal > 0 ||
    redFlagsVal > 0
  );
}

function hasCurrentRiskAssessmentInput() {
  return (
    hasCheckedInput(".abcde-input") ||
    hasCheckedInput(".bvpds-input") ||
    hasCurrentDPICConcern()
  );
}

function getDPICReferral(score) {
  const redFlagsVal = parseInt(
    document.getElementById("dpicRedFlags").value,
    10,
  );
  const rules = REFERRAL_RULES.dpic;

  if (redFlagsVal >= rules.emergencyRedFlagScore) {
    return referralEvaluation(
      4,
      "emergency",
      "Emergency (now)",
      rules.emergencyDriver,
    );
  }
  if (redFlagsVal >= rules.sameDayRedFlagScore) {
    return referralEvaluation(
      3,
      "urgent",
      "Same day",
      rules.sameDayRedFlagDriver,
    );
  }
  if (score >= rules.sameDayScore) {
    return referralEvaluation(
      3,
      "urgent",
      "Same day",
      rules.sameDayScoreDriver,
    );
  }
  if (score >= rules.soonScore) {
    return referralEvaluation(
      1,
      "soon",
      "Soon (within a week)",
      rules.soonDriver,
    );
  }

  return referralEvaluation(0, "routine", "Routine (weeks)", "");
}

function closeSideMenu() {
  const sideMenu = document.getElementById("sideMenu");
  const burgerIcon = document.getElementById("burger-icon");
  if (!sideMenu || !burgerIcon) return;

  sideMenu.classList.remove("open");
  sideMenu.setAttribute("aria-hidden", "true");
  sideMenu.setAttribute("inert", "");
  burgerIcon.setAttribute("aria-expanded", "false");
  document.body.classList.remove("menu-open");
}

function openSideMenu() {
  const sideMenu = document.getElementById("sideMenu");
  const burgerIcon = document.getElementById("burger-icon");
  if (!sideMenu || !burgerIcon) return;

  sideMenu.classList.add("open");
  sideMenu.setAttribute("aria-hidden", "false");
  sideMenu.removeAttribute("inert");
  burgerIcon.setAttribute("aria-expanded", "true");
  document.body.classList.add("menu-open");
}

function closeInfoModal() {
  const infoModal = document.getElementById("infoModal");
  const infoIcon = document.getElementById("info-icon");
  if (!infoModal || !infoIcon) return;

  infoModal.classList.remove("open");
  infoModal.setAttribute("aria-hidden", "true");
  infoIcon.setAttribute("aria-expanded", "false");
  document.body.classList.remove("modal-open");
}

function openInfoModal() {
  const infoModal = document.getElementById("infoModal");
  const infoIcon = document.getElementById("info-icon");
  if (!infoModal || !infoIcon) return;

  closeSideMenu();
  closeMcqModal();
  closeReportModal();
  closeLocationPicker();
  closeTermInfoPopover();
  infoModal.classList.add("open");
  infoModal.setAttribute("aria-hidden", "false");
  infoIcon.setAttribute("aria-expanded", "true");
  document.body.classList.add("modal-open");
}

function closeReportModal() {
  const reportModal = document.getElementById("reportModal");
  if (!reportModal) return;

  reportModal.classList.remove("open");
  reportModal.setAttribute("aria-hidden", "true");
  document.body.classList.remove("modal-open");
}

function hasLocalStorage() {
  return typeof window !== "undefined" && Boolean(window.localStorage);
}

function loadJsonStorage(storageKey) {
  if (!hasLocalStorage()) return null;

  try {
    const rawValue = window.localStorage.getItem(storageKey);
    return rawValue ? JSON.parse(rawValue) : null;
  } catch {
    return null;
  }
}

function saveJsonStorage(storageKey, value) {
  if (!hasLocalStorage()) return;

  try {
    window.localStorage.setItem(storageKey, JSON.stringify(value));
  } catch {
    // Storage failure should not block practice mode.
  }
}

function loadMcqProgressState() {
  const parsedValue = loadJsonStorage(MCQ_LEVEL_PROGRESS_STORAGE_KEY);
  if (!parsedValue || typeof parsedValue !== "object") {
    return { ...DEFAULT_MCQ_PROGRESS_STATE };
  }

  const maxLevelIndex = MCQ_LEVEL_ORDER.length;
  const nextTierIndex = Number.isFinite(Number(parsedValue.nextTierIndex))
    ? Math.max(
        0,
        Math.min(maxLevelIndex, Math.floor(Number(parsedValue.nextTierIndex))),
      )
    : 0;
  const unlockedTierIndex = Number.isFinite(
    Number(parsedValue.unlockedTierIndex),
  )
    ? Math.max(
        -1,
        Math.min(
          maxLevelIndex - 1,
          Math.floor(Number(parsedValue.unlockedTierIndex)),
        ),
      )
    : -1;

  return {
    nextTierIndex,
    unlockedTierIndex: Math.min(
      unlockedTierIndex,
      Math.max(-1, nextTierIndex - 1),
    ),
  };
}

function saveMcqProgressState() {
  saveJsonStorage(MCQ_LEVEL_PROGRESS_STORAGE_KEY, mcqProgressState);
}

function loadCupAchievementState() {
  const parsedValue = loadJsonStorage(CUP_ACHIEVEMENT_STORAGE_KEY);
  if (!parsedValue || typeof parsedValue !== "object") {
    return { ...DEFAULT_CUP_ACHIEVEMENT_STATE };
  }

  return {
    unlocked: Boolean(parsedValue.unlocked),
    code: typeof parsedValue.code === "string" ? parsedValue.code : "",
    unlockedAt:
      typeof parsedValue.unlockedAt === "string" ? parsedValue.unlockedAt : "",
  };
}

function saveCupAchievementState() {
  saveJsonStorage(CUP_ACHIEVEMENT_STORAGE_KEY, cupAchievementState);
}

function getMcqLevelIndex(level) {
  return MCQ_LEVEL_ORDER.indexOf(level);
}

function isMcqLevelUnlocked(levelIndex) {
  return levelIndex >= 0 && levelIndex <= mcqProgressState.nextTierIndex;
}

function generateAchievementCode(length = 6) {
  const alphabet = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  let code = "";
  for (let index = 0; index < length; index += 1) {
    code += alphabet[Math.floor(Math.random() * alphabet.length)];
  }
  return code;
}

function createCupAchievementCode() {
  const timestamp = new Date()
    .toISOString()
    .replace(/[-:.TZ]/g, "")
    .slice(0, 14);
  return `ALLAN-CUP-${timestamp}-${generateAchievementCode(6)}`;
}

function renderUnlockedMcqStars() {
  return MCQ_LEVEL_ORDER.slice(0, mcqProgressState.unlockedTierIndex + 1)
    .map((level) => {
      const meta = MCQ_LEVEL_META[level];
      return `<span class="${meta.starClass}" aria-label="${meta.label} star">&#9733; ${meta.label}</span>`;
    })
    .join(" ");
}

function updateMcqProgress(passed) {
  const levelIndex = getMcqLevelIndex(activeMcqLevel);
  if (levelIndex < 0 || !activeMcqMeta) {
    return "";
  }

  let progressLine = "";
  if (passed && levelIndex === mcqProgressState.nextTierIndex) {
    mcqProgressState.unlockedTierIndex = Math.max(
      mcqProgressState.unlockedTierIndex,
      levelIndex,
    );
    mcqProgressState.nextTierIndex = Math.min(
      levelIndex + 1,
      MCQ_LEVEL_ORDER.length,
    );
    progressLine = `Unlocked ${activeMcqMeta.label} star.`;
  } else if (passed && levelIndex <= mcqProgressState.unlockedTierIndex) {
    progressLine = `${activeMcqMeta.label} star already unlocked.`;
  } else {
    const nextLevel =
      MCQ_LEVEL_ORDER[
        Math.min(mcqProgressState.nextTierIndex, MCQ_LEVEL_ORDER.length - 1)
      ];
    progressLine = `Need ${activeMcqMeta.passMark}/${activeMcqQuestions.length} to unlock ${MCQ_LEVEL_META[nextLevel].label} star.`;
  }

  saveMcqProgressState();
  renderMcqAchievementMenu();
  return progressLine;
}

function unlockCupAchievementIfNeeded() {
  const advancedComplete =
    mcqProgressState.unlockedTierIndex >= MCQ_LEVEL_ORDER.length - 1;
  if (!advancedComplete || cupAchievementState.unlocked) return;

  cupAchievementState = {
    unlocked: true,
    code: createCupAchievementCode(),
    unlockedAt: new Date().toISOString(),
  };
  saveCupAchievementState();
}

function renderCupAchievement() {
  const cupAchievement = document.getElementById("cupAchievement");
  const cupAchievementLabel = document.getElementById("cupAchievementLabel");
  const cupAchievementCode = document.getElementById("cupAchievementCode");
  const downloadButton = document.getElementById(
    "downloadCupCertificateButton",
  );
  if (!cupAchievement) return;

  unlockCupAchievementIfNeeded();
  cupAchievement.hidden = false;
  cupAchievement.setAttribute("aria-hidden", "false");
  cupAchievement.classList.toggle("is-unlocked", cupAchievementState.unlocked);
  cupAchievement.classList.toggle("is-locked", !cupAchievementState.unlocked);

  if (cupAchievementLabel) {
    cupAchievementLabel.textContent = cupAchievementState.unlocked
      ? UNLOCKED_CUP_TEXT
      : LOCKED_CUP_TEXT;
  }

  if (cupAchievementCode) {
    if (cupAchievementState.unlocked && cupAchievementState.code) {
      cupAchievementCode.hidden = false;
      cupAchievementCode.textContent = `Code: ${cupAchievementState.code}`;
    } else {
      cupAchievementCode.hidden = true;
      cupAchievementCode.textContent = "";
    }
  }

  if (downloadButton) {
    const isLocked = !cupAchievementState.unlocked;
    downloadButton.disabled = isLocked;
    downloadButton.dataset.locked = isLocked ? "true" : "false";
    downloadButton.setAttribute("aria-disabled", isLocked ? "true" : "false");
  }
}

function renderMcqAchievementMenu() {
  document.querySelectorAll(".mcq-level-button").forEach((button) => {
    const level = button.dataset.level;
    const levelIndex = getMcqLevelIndex(level);
    const meta = MCQ_LEVEL_META[level];
    if (!meta || levelIndex < 0) return;

    const isUnlocked = isMcqLevelUnlocked(levelIndex);
    const isComplete = levelIndex <= mcqProgressState.unlockedTierIndex;
    button.dataset.locked = isUnlocked ? "false" : "true";
    button.classList.toggle("is-locked", !isUnlocked);
    button.classList.toggle("is-complete", isComplete);
    button.setAttribute("aria-disabled", isUnlocked ? "false" : "true");
    button.textContent = `${meta.label} MCQ`;
    button.title = isUnlocked
      ? `${meta.label} MCQ`
      : `Pass ${MCQ_LEVEL_META[MCQ_LEVEL_ORDER[levelIndex - 1]]?.label || "the previous"} MCQ first`;
  });

  renderCupAchievement();
}

function downloadCupCertificate() {
  if (!cupAchievementState.unlocked || !cupAchievementState.code) return;

  const unlockedAtDate = cupAchievementState.unlockedAt
    ? new Date(cupAchievementState.unlockedAt)
    : null;
  const issuedAtText =
    unlockedAtDate && !Number.isNaN(unlockedAtDate.valueOf())
      ? unlockedAtDate.toLocaleString()
      : new Date().toLocaleString();
  const certificateText = [
    "Dermatology",
    "Dermatology MCQ Certificate of Achievement",
    "(Local certificate - not externally verified)",
    "",
    "Awarded for completing Advanced MCQ.",
    `Achievement code: ${cupAchievementState.code}`,
    `Issued: ${issuedAtText}`,
    "",
    "Keep this code for your records.",
  ].join("\n");
  const blob = new Blob([certificateText], { type: "text/plain" });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement("a");
  const safeCode = cupAchievementState.code
    .toLowerCase()
    .replace(/[^a-z0-9-]/g, "");

  anchor.href = url;
  anchor.download = `dermatology_certificate_${safeCode}.txt`;
  document.body.appendChild(anchor);
  anchor.click();
  document.body.removeChild(anchor);
  URL.revokeObjectURL(url);
}

function shuffledCopy(items) {
  const result = [...items];
  for (let index = result.length - 1; index > 0; index -= 1) {
    const swapIndex = Math.floor(Math.random() * (index + 1));
    [result[index], result[swapIndex]] = [result[swapIndex], result[index]];
  }
  return result;
}

function sampleMcqQuestions(level) {
  const meta = MCQ_LEVEL_META[level];
  const bank = MCQ_BANK[level] || [];
  if (!meta || !bank.length) return [];

  return shuffledCopy(bank)
    .slice(0, meta.questionCount)
    .map((question) => ({
      ...question,
      options: shuffledCopy(question.options),
    }));
}

function renderMcqQuestions(questions) {
  const container = document.getElementById("mcqContainer");
  if (!container) return;

  container.textContent = "";
  questions.forEach((question, questionIndex) => {
    const fieldset = document.createElement("fieldset");
    fieldset.className = "question";
    fieldset.dataset.correctAnswer = question.answer;

    const legend = document.createElement("legend");
    legend.textContent = `${questionIndex + 1}. ${question.question}`;
    fieldset.appendChild(legend);

    const options = document.createElement("div");
    options.className = "options";

    question.options.forEach((option, optionIndex) => {
      const optionId = `mcq-${questionIndex}-${optionIndex}`;
      const label = document.createElement("label");
      label.setAttribute("for", optionId);

      const input = document.createElement("input");
      input.type = "radio";
      input.id = optionId;
      input.name = `mcq-${questionIndex}`;
      input.value = option;

      const optionText = document.createElement("span");
      optionText.textContent = option;

      label.append(input, optionText);
      options.appendChild(label);
    });

    fieldset.appendChild(options);
    container.appendChild(fieldset);
  });
}

function getMcqAnswers() {
  return activeMcqQuestions.map((_, questionIndex) => {
    const selected = document.querySelector(
      `input[name="mcq-${questionIndex}"]:checked`,
    );
    return selected?.value || null;
  });
}

function gradeMcq(answers) {
  return activeMcqQuestions.reduce(
    (score, question, questionIndex) =>
      answers[questionIndex] === question.answer ? score + 1 : score,
    0,
  );
}

function revealMcqFeedback() {
  document
    .querySelectorAll("#mcqContainer .question")
    .forEach((fieldset, questionIndex) => {
      const question = activeMcqQuestions[questionIndex];
      fieldset.querySelectorAll("label").forEach((label) => {
        const input = label.querySelector("input");
        if (!input) return;

        if (input.value === question.answer) {
          label.classList.add("correct-answer-label");
        } else if (input.checked) {
          label.classList.add("wrong-answer-label");
        }
        input.disabled = true;
      });
    });
}

function handleMcqSubmit() {
  const submitButton = document.getElementById("submitMcqButton");
  const result = document.getElementById("mcqResult");
  if (!activeMcqQuestions.length || !activeMcqMeta || !result) return;

  const answers = getMcqAnswers();
  if (answers.some((answer) => answer === null)) {
    result.textContent = "Answer every question before submitting.";
    return;
  }

  const score = gradeMcq(answers);
  const passed = score >= activeMcqMeta.passMark;
  const progressLine = updateMcqProgress(passed);
  const unlockedStars = renderUnlockedMcqStars();
  revealMcqFeedback();
  if (submitButton) {
    submitButton.disabled = true;
  }
  result.innerHTML = [
    `Score ${score}/${activeMcqQuestions.length} - ${passed ? "Pass" : "Needs more practice"}.`,
    progressLine,
    unlockedStars ? `<br>${unlockedStars}` : "",
  ].join(" ");
}

function closeMcqModal() {
  const mcqModal = document.getElementById("mcqModal");
  if (!mcqModal) return;

  mcqModal.classList.remove("open");
  mcqModal.setAttribute("aria-hidden", "true");
  document.body.classList.remove("modal-open");
}

function openMcqLevel(level) {
  const meta = MCQ_LEVEL_META[level];
  const levelIndex = getMcqLevelIndex(level);
  const modal = document.getElementById("mcqModal");
  const title = document.getElementById("mcqTitle");
  const intro = document.getElementById("mcqIntro");
  const submitButton = document.getElementById("submitMcqButton");
  const result = document.getElementById("mcqResult");
  const closeButton = document.getElementById("closeMcqModal");
  const modalContent = document.getElementById("mcqModalContent");
  if (!meta || !modal || !title || !intro) return;
  if (!isMcqLevelUnlocked(levelIndex)) {
    renderMcqAchievementMenu();
    return;
  }

  activeMcqMeta = meta;
  activeMcqLevel = level;
  activeMcqQuestions = sampleMcqQuestions(level);
  title.textContent = meta.title;
  intro.textContent = `${meta.intro} Answer all ${activeMcqQuestions.length}; pass mark ${meta.passMark}.`;
  renderMcqQuestions(activeMcqQuestions);
  if (result) {
    result.textContent = "";
  }
  if (submitButton) {
    submitButton.disabled = false;
  }

  closeSideMenu();
  closeInfoModal();
  closeReportModal();
  closeLocationPicker();
  closeTermInfoPopover();
  modal.classList.add("open");
  modal.setAttribute("aria-hidden", "false");
  document.body.classList.add("modal-open");
  (closeButton || modalContent)?.focus({ preventScroll: true });
}

function initMcqUi() {
  const mcqModal = document.getElementById("mcqModal");
  const closeButton = document.getElementById("closeMcqModal");
  const submitButton = document.getElementById("submitMcqButton");
  const downloadButton = document.getElementById(
    "downloadCupCertificateButton",
  );

  mcqProgressState = loadMcqProgressState();
  cupAchievementState = loadCupAchievementState();
  renderMcqAchievementMenu();
  closeButton?.addEventListener("click", closeMcqModal);
  submitButton?.addEventListener("click", handleMcqSubmit);
  downloadButton?.addEventListener("click", downloadCupCertificate);
  mcqModal?.addEventListener("click", (event) => {
    if (event.target === mcqModal) {
      closeMcqModal();
    }
  });
}

function setReportStatus(message) {
  const status = document.getElementById("reportShareStatus");
  if (status) {
    status.textContent = message || "";
  }
}

function resetReportActions() {
  const copyButton = document.getElementById("copyReportButton");
  const shareButton = document.getElementById("shareReportButton");

  if (copyButton) {
    copyButton.textContent = "Copy note";
    copyButton.classList.remove("is-success");
  }

  if (shareButton) {
    shareButton.textContent = "Share note + photos";
    shareButton.classList.remove("is-success");
  }
}

function getReportTextValue() {
  const reportText = document.getElementById("reportText");
  if (!reportText) return "";

  if (!reportText.value.trim()) {
    reportText.value = buildReportText();
    renderReportPreview(reportText.value);
  }

  return reportText.value;
}

function selectReportPreviewText() {
  const reportPreview = document.getElementById("reportPreview");
  if (!reportPreview) return false;

  const selection = window.getSelection();
  const range = document.createRange();
  range.selectNodeContents(reportPreview);
  selection.removeAllRanges();
  selection.addRange(range);
  reportPreview.focus({ preventScroll: true });
  return true;
}

function copyTextWithTemporarySelection(text) {
  const temporaryText = document.createElement("textarea");
  temporaryText.value = text;
  temporaryText.style.position = "fixed";
  temporaryText.style.top = "-1000px";
  temporaryText.style.left = "-1000px";
  temporaryText.style.opacity = "0";
  temporaryText.setAttribute("aria-hidden", "true");
  document.body.appendChild(temporaryText);
  temporaryText.focus();
  temporaryText.select();

  let copied = false;
  try {
    copied = document.execCommand("copy");
  } catch {
    copied = false;
  }

  temporaryText.remove();
  return copied;
}

async function copyReportText() {
  const reportText = document.getElementById("reportText");
  const copyButton = document.getElementById("copyReportButton");
  if (!reportText || !copyButton) return;

  const reportValue = getReportTextValue();
  let copied = false;

  copied = copyTextWithTemporarySelection(reportValue);

  try {
    if (!copied && navigator.clipboard) {
      await navigator.clipboard.writeText(reportValue);
      copied = true;
    }
  } catch {
    copied = false;
  }

  if (!copied) {
    selectReportPreviewText();
  }

  if (copied) {
    copyButton.textContent = "Copied";
    copyButton.classList.add("is-success");
    setReportStatus("Report copied.");
  } else {
    selectReportPreviewText();
    copyButton.textContent = "Text selected";
    copyButton.classList.remove("is-success");
    setReportStatus("Text selected. Use your device copy command.");
  }

  window.setTimeout(() => {
    copyButton.textContent = "Copy note";
    copyButton.classList.remove("is-success");
  }, 1400);
}

function getImageFileExtension(mimeType) {
  if (mimeType === "image/png") return "png";
  if (mimeType === "image/webp") return "webp";
  return "jpg";
}

function reportImageEntryToFile(entry) {
  if (!entry?.dataUrl || typeof File === "undefined") return null;

  const match = entry.dataUrl.match(/^data:([^;]+);base64,(.+)$/);
  if (!match) return null;

  const mimeType = match[1];
  const binary = atob(match[2]);
  const bytes = new Uint8Array(binary.length);
  for (let index = 0; index < binary.length; index += 1) {
    bytes[index] = binary.charCodeAt(index);
  }

  return new File(
    [bytes],
    `dermatology-${entry.slug}.${getImageFileExtension(mimeType)}`,
    { type: mimeType },
  );
}

function getReportPhotoFiles() {
  return getReportImageEntries().map(reportImageEntryToFile).filter(Boolean);
}

async function shareReportText() {
  const shareButton = document.getElementById("shareReportButton");
  const reportText = getReportTextValue();
  if (!shareButton || !reportText) return;

  if (!navigator.share) {
    setReportStatus("Sharing is not available here. Use copy.");
    return;
  }

  const photoFiles = getReportPhotoFiles();
  const canSharePhotos =
    photoFiles.length > 0 &&
    typeof navigator.canShare === "function" &&
    navigator.canShare({ files: photoFiles });
  const sharePayload = {
    title: "Dermatology referral note",
    text: reportText,
  };
  if (canSharePhotos) {
    sharePayload.files = photoFiles;
  }

  try {
    await navigator.share(sharePayload);
    shareButton.textContent = "Shared";
    shareButton.classList.add("is-success");
    setReportStatus(
      canSharePhotos
        ? `Share sheet opened with ${photoFiles.length} photo${photoFiles.length === 1 ? "" : "s"}.`
        : photoFiles.length
          ? "Share sheet opened. This browser did not attach photos; add them separately."
          : "Share sheet opened. No photos uploaded yet.",
    );
    window.setTimeout(() => {
      shareButton.textContent = "Share note + photos";
      shareButton.classList.remove("is-success");
    }, 1400);
  } catch (error) {
    if (canSharePhotos && error?.name !== "AbortError") {
      try {
        await navigator.share({
          title: "Dermatology referral note",
          text: reportText,
        });
        shareButton.textContent = "Shared";
        shareButton.classList.add("is-success");
        setReportStatus("Shared note only. Attach photos separately.");
        window.setTimeout(() => {
          shareButton.textContent = "Share note + photos";
          shareButton.classList.remove("is-success");
        }, 1400);
        return;
      } catch {
        // Fall through to the standard share failure message.
      }
    }
    setReportStatus(
      error?.name === "AbortError"
        ? "Share cancelled."
        : "Sharing failed here. Use copy.",
    );
  }
}

function closeLocationPicker() {
  const pickerButton = document.getElementById("locationPickerButton");
  const pickerMenu = document.getElementById("locationPickerMenu");
  if (!pickerButton || !pickerMenu) return;

  pickerButton.setAttribute("aria-expanded", "false");
  pickerMenu.hidden = true;
}

function openLocationPicker() {
  const pickerButton = document.getElementById("locationPickerButton");
  const pickerMenu = document.getElementById("locationPickerMenu");
  if (!pickerButton || !pickerMenu) return;

  closeTermInfoPopover();
  pickerButton.setAttribute("aria-expanded", "true");
  pickerMenu.hidden = false;
}

function toggleLocationPicker() {
  const pickerButton = document.getElementById("locationPickerButton");
  if (!pickerButton) return;

  if (pickerButton.getAttribute("aria-expanded") === "true") {
    closeLocationPicker();
  } else {
    openLocationPicker();
  }
}

function selectLocationOption(optionButton) {
  const nativeSelect = document.getElementById("lesionLocation");
  const pickerLabel = document.getElementById("locationPickerLabel");
  const pickerIconWrap = document.querySelector(
    "#locationPickerButton .location-option-icon",
  );
  const pickerIcon = document.querySelector(
    "#locationPickerButton .location-option-icon i",
  );
  if (!nativeSelect || !pickerLabel || !pickerIconWrap || !pickerIcon) return;

  const value = optionButton.dataset.value || optionButton.textContent.trim();
  const icon = optionButton.dataset.icon || "fa-ellipsis-h";
  const iconStyle = optionButton.dataset.iconStyle || "";
  nativeSelect.value = value;
  pickerLabel.textContent = value;
  pickerIcon.className = `fas ${icon}`;
  pickerIconWrap.classList.remove(
    "location-option-icon--elbow",
    "location-option-icon--single-foot",
  );
  if (iconStyle) {
    pickerIconWrap.classList.add(`location-option-icon--${iconStyle}`);
  }

  document.querySelectorAll(".location-option").forEach((button) => {
    const isSelected = button === optionButton;
    button.classList.toggle("is-selected", isSelected);
    button.setAttribute("aria-selected", String(isSelected));
  });

  nativeSelect.dispatchEvent(new Event("change", { bubbles: true }));
  closeLocationPicker();
}

function closeTermInfoPopover() {
  const popover = document.getElementById("termInfoPopover");
  if (!popover) return;

  popover.hidden = true;
  popover.setAttribute("aria-hidden", "true");
  document
    .querySelectorAll(
      '.term-info-button[aria-expanded="true"], .term-info-trigger[aria-expanded="true"]',
    )
    .forEach((button) => {
      button.setAttribute("aria-expanded", "false");
    });
}

function closeDermoscopyBucketDetails(exceptButton = null) {
  document
    .querySelectorAll('.bucket-detail-toggle[aria-expanded="true"]')
    .forEach((button) => {
      if (button === exceptButton) return;
      const detail = document.getElementById(button.dataset.detailTarget || "");
      button.setAttribute("aria-expanded", "false");
      detail?.setAttribute("hidden", "");
      button.closest(".bucket-item")?.classList.remove("is-open");
    });
}

function syncDermoscopyClueAvailability() {
  const chaosInput = document.querySelector(
    '.bvpds-input[data-bvpds-kind~="chaos"]',
  );
  const clueGroup = document.querySelector(".bucket-group--clues");
  if (!clueGroup) return;

  const hasChaos = Boolean(chaosInput?.checked);
  clueGroup.classList.toggle("is-disabled", !hasChaos);
  clueGroup.setAttribute("aria-disabled", String(!hasChaos));

  clueGroup
    .querySelectorAll('.bvpds-input[data-bvpds-kind~="clue"]')
    .forEach((input) => {
      if (!hasChaos) input.checked = false;
      input.disabled = !hasChaos;
    });

  clueGroup.querySelectorAll(".bucket-detail-toggle").forEach((button) => {
    button.disabled = !hasChaos;
    if (!hasChaos) {
      const detail = document.getElementById(button.dataset.detailTarget || "");
      button.setAttribute("aria-expanded", "false");
      detail?.setAttribute("hidden", "");
      button.closest(".bucket-item")?.classList.remove("is-open");
    }
  });
}

function toggleDermoscopyBucketDetail(button) {
  if (button.disabled) return;

  const detail = document.getElementById(button.dataset.detailTarget || "");
  if (!detail) return;

  const shouldOpen = button.getAttribute("aria-expanded") !== "true";
  closeTermInfoPopover();
  closeDermoscopyBucketDetails(button);

  button.setAttribute("aria-expanded", String(shouldOpen));
  detail.hidden = !shouldOpen;
  button.closest(".bucket-item")?.classList.toggle("is-open", shouldOpen);
}

function renderTermInfoBody(body, text) {
  body.textContent = "";
  String(text || "")
    .split("|")
    .map((section) => section.trim())
    .filter(Boolean)
    .forEach((section) => {
      const paragraph = document.createElement("p");
      const labelBreak = section.indexOf(":");

      if (labelBreak > 0 && labelBreak < 28) {
        const label = document.createElement("strong");
        label.textContent = `${section.slice(0, labelBreak)}:`;
        paragraph.append(label, ` ${section.slice(labelBreak + 1).trim()}`);
      } else {
        paragraph.textContent = section;
      }

      body.appendChild(paragraph);
    });
}

function openTermInfoPopover(button) {
  const popover = document.getElementById("termInfoPopover");
  const body = document.getElementById("termInfoBody");
  if (!popover || !body) return;

  if (button.getAttribute("aria-expanded") === "true") {
    closeTermInfoPopover();
    return;
  }

  closeTermInfoPopover();
  renderTermInfoBody(body, button.dataset.termBody || "");
  button.setAttribute("aria-expanded", "true");
  popover.hidden = false;
  popover.setAttribute("aria-hidden", "false");

  const viewportPadding = 8;
  const popoverWidth = Math.min(286, window.innerWidth - viewportPadding * 2);
  const buttonRect = button.getBoundingClientRect();
  popover.style.width = `${popoverWidth}px`;
  popover.style.left = `${Math.min(
    window.innerWidth - popoverWidth - viewportPadding,
    Math.max(viewportPadding, buttonRect.right - popoverWidth),
  )}px`;

  const popoverRect = popover.getBoundingClientRect();
  let top = buttonRect.bottom + 6;
  if (top + popoverRect.height > window.innerHeight - viewportPadding) {
    top = buttonRect.top - popoverRect.height - 6;
  }

  popover.style.top = `${Math.max(viewportPadding, top)}px`;
}

function initShellUi() {
  const burgerIcon = document.getElementById("burger-icon");
  const sideMenu = document.getElementById("sideMenu");
  const infoIcon = document.getElementById("info-icon");
  const infoModal = document.getElementById("infoModal");
  const closeModal = document.getElementById("closeModal");
  const termInfoPopover = document.getElementById("termInfoPopover");
  const termInfoClose = document.getElementById("termInfoClose");
  const locationPickerButton = document.getElementById("locationPickerButton");
  const locationPickerMenu = document.getElementById("locationPickerMenu");
  const reportModal = document.getElementById("reportModal");
  const closeReportButton = document.getElementById("closeReportModal");
  const copyReportButton = document.getElementById("copyReportButton");
  const shareReportButton = document.getElementById("shareReportButton");
  const skinToneToggle = document.getElementById("skinToneToggle");
  const generateReportButton = document.getElementById("generateReportButton");

  if (burgerIcon && sideMenu) {
    burgerIcon.addEventListener("click", (event) => {
      event.stopPropagation();
      if (sideMenu.classList.contains("open")) {
        closeSideMenu();
      } else {
        openSideMenu();
      }
    });

    sideMenu.addEventListener("click", (event) => {
      const menuButton = event.target.closest("button");
      if (!menuButton) return;

      const tabId = menuButton.dataset.tab;
      const dermoscopyExampleKey = menuButton.dataset.dermoscopyExampleKey;
      const sectionId = menuButton.dataset.section;
      const action = menuButton.dataset.action;
      const mcqLevel = menuButton.classList.contains("mcq-level-button")
        ? menuButton.dataset.level
        : "";

      if (mcqLevel) {
        openMcqLevel(mcqLevel);
        return;
      }

      if (dermoscopyExampleKey) {
        selectDermoscopyExample(menuButton);
        closeSideMenu();
        return;
      }

      if (action === "abcde-card") {
        closeSideMenu();
        openAbcdeTeachingCard(burgerIcon);
        return;
      }

      if (action === "chaos-card") {
        closeSideMenu();
        openChaosTeachingCard(burgerIcon);
        return;
      }

      if (tabId) {
        const tabButtonMap = {
          ABCDETab: "abcdeBtn",
          BVPDSTab: "bvpdsBtn",
          DPICTab: "dpicBtn",
          UVTab: "uvBtn",
        };
        if (
          tabId === "ABCDETab" &&
          menuButton.classList.contains("reference-menu-card")
        ) {
          selectedLesionVariationKey = "";
          syncLesionVariationControls("ABCDETab");
        }
        if (
          tabId === "BVPDSTab" &&
          menuButton.classList.contains("reference-menu-card")
        ) {
          clearDermoscopyExampleSelection();
        }
        document.getElementById(tabButtonMap[tabId])?.click();
      } else if (sectionId) {
        document
          .getElementById(sectionId)
          ?.scrollIntoView({ block: "start", behavior: "smooth" });
      } else if (action === "report") {
        generateReport();
      }

      closeSideMenu();
    });

    document.addEventListener("click", (event) => {
      const clickedInsideMenu = sideMenu.contains(event.target);
      const clickedBurger = burgerIcon.contains(event.target);
      if (!clickedInsideMenu && !clickedBurger) {
        closeSideMenu();
      }
    });
  }

  if (locationPickerButton && locationPickerMenu) {
    locationPickerButton.addEventListener("click", (event) => {
      event.stopPropagation();
      toggleLocationPicker();
    });

    locationPickerMenu.addEventListener("click", (event) => {
      event.stopPropagation();
      const optionButton = event.target.closest(".location-option");
      if (optionButton) {
        selectLocationOption(optionButton);
      }
    });
  }

  if (infoIcon && infoModal && closeModal) {
    infoIcon.addEventListener("click", (event) => {
      event.stopPropagation();
      if (infoModal.classList.contains("open")) {
        closeInfoModal();
      } else {
        openInfoModal();
      }
    });

    closeModal.addEventListener("click", closeInfoModal);

    infoModal.addEventListener("click", (event) => {
      if (event.target === infoModal) {
        closeInfoModal();
      }
    });
  }

  closeReportButton?.addEventListener("click", closeReportModal);
  document
    .getElementById("abcdeCardClose")
    ?.addEventListener("click", closeAbcdeTeachingCard);
  document
    .getElementById("abcdeCardModal")
    ?.addEventListener("click", (event) => {
      if (event.target === event.currentTarget) {
        closeAbcdeTeachingCard();
      }
    });
  document
    .getElementById("chaosCardClose")
    ?.addEventListener("click", closeChaosTeachingCard);
  document
    .getElementById("chaosCardModal")
    ?.addEventListener("click", (event) => {
      if (event.target === event.currentTarget) {
        closeChaosTeachingCard();
      }
    });
  document
    .getElementById("lesionRefPrev")
    ?.addEventListener("click", (event) => {
      event.stopPropagation();
      selectLesionVariationByOffset(-1);
    });
  document
    .getElementById("lesionRefNext")
    ?.addEventListener("click", (event) => {
      event.stopPropagation();
      selectLesionVariationByOffset(1);
    });
  document
    .getElementById("dermoscopyRefPrev")
    ?.addEventListener("click", (event) => {
      event.stopPropagation();
      selectDermoscopyExampleByOffset(-1);
    });
  document
    .getElementById("dermoscopyRefNext")
    ?.addEventListener("click", (event) => {
      event.stopPropagation();
      selectDermoscopyExampleByOffset(1);
    });
  copyReportButton?.addEventListener("click", copyReportText);
  shareReportButton?.addEventListener("click", shareReportText);
  generateReportButton?.addEventListener("click", generateReport);
  skinToneToggle?.addEventListener("change", toggleSkinTone);

  document.querySelectorAll(".tab-btn[data-tab-target]").forEach((button) => {
    button.addEventListener("click", (event) => {
      openTab(event, button.dataset.tabTarget);
    });
    button.addEventListener("keydown", handleRouteTabKeydown);
  });

  document.querySelectorAll(".abcde-input").forEach((input) => {
    input.addEventListener("change", markRiskAssessmentStarted);
  });

  document.querySelectorAll(".bvpds-input").forEach((input) => {
    input.addEventListener("change", () => {
      syncDermoscopyClueAvailability();
      markRiskAssessmentStarted();
    });
  });

  document.querySelectorAll(".bucket-detail-toggle").forEach((button) => {
    button.addEventListener("click", (event) => {
      event.stopPropagation();
      toggleDermoscopyBucketDetail(button);
    });
  });

  document
    .getElementById("dpicPattern")
    ?.addEventListener("change", handleDPICPatternChange);
  ["dpicDuration", "dpicItch", "dpicColour", "dpicRedFlags"].forEach(
    (selectId) => {
      document.getElementById(selectId)?.addEventListener("change", () => {
        markDPICFieldTouched(selectId);
        markRiskAssessmentStarted();
      });
    },
  );

  if (reportModal) {
    reportModal.addEventListener("click", (event) => {
      if (event.target === reportModal) {
        closeReportModal();
      }
    });
  }

  document
    .querySelectorAll(".term-info-button, .term-info-trigger")
    .forEach((button) => {
      button.addEventListener("click", (event) => {
        event.stopPropagation();
        openTermInfoPopover(button);
      });
    });

  if (termInfoPopover) {
    termInfoPopover.addEventListener("click", (event) => {
      event.stopPropagation();
    });
  }

  termInfoClose?.addEventListener("click", (event) => {
    event.stopPropagation();
    closeTermInfoPopover();
  });

  document.querySelectorAll(".capture-box").forEach((box) => {
    const captureType = box.dataset.captureType || "";

    box.addEventListener("click", () => {
      triggerFileDialog(captureType);
    });

    box.addEventListener("dragover", dragOverHandler);
    box.addEventListener("drop", (event) => {
      dropHandler(event, captureType);
    });

    box.addEventListener("dragleave", () => {
      box.classList.remove("drag-over");
    });

    box.addEventListener("keydown", (event) => {
      if (event.key === "Enter" || event.key === " ") {
        event.preventDefault();
        box.click();
      }
    });
  });

  document
    .querySelectorAll('input[type="file"][data-capture-type]')
    .forEach((input) => {
      input.addEventListener("change", (event) => {
        handleFileSelection(event, input.dataset.captureType);
      });
    });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") {
      closeSideMenu();
      closeInfoModal();
      closeMcqModal();
      closeReportModal();
      closeLocationPicker();
      closeTermInfoPopover();
      closeDermoscopyBucketDetails();
      closeImageExpand();
      closeAbcdeTeachingCard();
      closeChaosTeachingCard();
    }
  });

  document.addEventListener("click", closeLocationPicker);
  document.addEventListener("click", closeTermInfoPopover);
  window.addEventListener("resize", closeLocationPicker);
  window.addEventListener("resize", closeTermInfoPopover);
  window.addEventListener("scroll", closeLocationPicker, true);
  window.addEventListener("scroll", closeTermInfoPopover, true);

  toggleSkinTone();
  initMcqUi();
  initImageHoldExpand();
  syncDermoscopyClueAvailability();
  const activeTabId =
    document.querySelector(".tab-content.active")?.id || "ABCDETab";
  syncLesionVariationControls(activeTabId);
  syncDermoscopyReferenceControls(activeTabId);
  setReferencePreviewImage(activeTabId);
  setUserPreviewImage(activeTabId);
  updateCaptureRelevance(activeTabId);
  updateRiskReferral();
}

document.addEventListener("DOMContentLoaded", initShellUi);
