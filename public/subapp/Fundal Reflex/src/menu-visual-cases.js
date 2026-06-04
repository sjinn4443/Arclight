import { getSimilarCaseOptions } from "./case-teaching-metadata.js?v=20260430-6";
import {
  BABY_REFRACTION_VALUE_SET,
  CASE_LEVELS,
  REFRACTION_GROUPS,
} from "./case-catalog.js?v=20260430-6";
import { createModalController } from "./modal.js";

const CASE_THUMBNAIL_VERSION = "20260430-6";
const CASE_PHOTO_VERSION = "20260426-10";

const CASE_REFERENCE_PHOTOS = {
  zero: "1normal.webp",
  "normal-dark": "2dark.webp",
  "right-hyper-left-posterior-pole": "3postpole.webp",
  "right-normal-left-large-esotropia": "4eso.webp",
  "right-large-exotropia-left-corneal-scar": "5exo.webp",
  "bilateral-high-hypermetropia": "6phyper.webp",
  "bilateral-myopia": "7myopia.webp",
};

const FLAT_CASE_OPTIONS = REFRACTION_GROUPS.flatMap(
  (group) => group.options || [],
);
const CASE_OPTION_BY_VALUE = new Map(
  FLAT_CASE_OPTIONS.map((optionConfig) => [optionConfig.value, optionConfig]),
);

function uniqueCaseOptions(options) {
  const seenValues = new Set();
  return options.filter((optionConfig) => {
    if (!optionConfig || seenValues.has(optionConfig.value)) {
      return false;
    }

    seenValues.add(optionConfig.value);
    return true;
  });
}

const LEVEL_ORDERED_CASE_OPTIONS = uniqueCaseOptions(
  CASE_LEVELS.flatMap((level) => level.values).map((caseValue) =>
    CASE_OPTION_BY_VALUE.get(caseValue),
  ),
);
const LEVEL_ORDERED_BABY_CASE_OPTIONS = LEVEL_ORDERED_CASE_OPTIONS.filter(
  (optionConfig) => BABY_REFRACTION_VALUE_SET.has(optionConfig.value),
);
const CASE_LEVEL_BY_VALUE = new Map(
  CASE_LEVELS.flatMap((level) =>
    level.values.map((caseValue) => [caseValue, level]),
  ),
);

function parseCaseLabel(label) {
  const match = /^(\d+)\.\s*(.*)$/.exec(String(label || "").trim());
  if (!match) {
    return { index: "", text: String(label || "").trim() };
  }

  return {
    index: match[1],
    text: match[2],
  };
}

function getCaseLabel(caseValue) {
  for (const group of REFRACTION_GROUPS) {
    const match = group.options?.find(
      (optionConfig) => optionConfig.value === caseValue,
    );
    if (match) {
      return match.label;
    }
  }

  return "";
}

function getCaseTriggerLabel(caseValue) {
  for (const group of REFRACTION_GROUPS) {
    const match = group.options?.find(
      (optionConfig) => optionConfig.value === caseValue,
    );
    if (match) {
      return match.triggerLabel || match.label;
    }
  }

  return "";
}

function getCaseGroup(caseValue) {
  for (const group of REFRACTION_GROUPS) {
    const match = group.options?.find(
      (optionConfig) => optionConfig.value === caseValue,
    );
    if (match) {
      return group;
    }
  }

  return null;
}

function getCaseLevel(caseValue) {
  return CASE_LEVEL_BY_VALUE.get(caseValue) || null;
}

function getCaseIndex(caseValue) {
  return FLAT_CASE_OPTIONS.findIndex(
    (optionConfig) => optionConfig.value === caseValue,
  );
}

function getCaseIndexInOptions(caseValue, options) {
  return options.findIndex((optionConfig) => optionConfig.value === caseValue);
}

function getCaseThumbnailSrc(caseValue) {
  return `assets/case-thumbnails/${caseValue}.webp?v=${CASE_THUMBNAIL_VERSION}`;
}

function getCasePhotoSrc(caseValue) {
  const filename = CASE_REFERENCE_PHOTOS[caseValue];
  if (!filename) {
    return "";
  }

  return `assets/images/${filename}?v=${CASE_PHOTO_VERSION}`;
}

function openVisualCaseModal({ modalController, triggerButton }) {
  if (!modalController || !triggerButton) {
    return;
  }

  triggerButton.setAttribute("aria-expanded", "true");
  modalController.open({ triggerElement: triggerButton });
}

function closeVisualCaseModal({
  modalController,
  triggerButton,
  restoreFocus = false,
}) {
  if (!modalController || !triggerButton) {
    return;
  }

  triggerButton.setAttribute("aria-expanded", "false");
  modalController.close({ restoreFocus });
}

function openVisualCasePhotoModal({
  modalController,
  title,
  image,
  caseLabel,
  caseValue,
  triggerButton = null,
}) {
  const photoSrc = getCasePhotoSrc(caseValue);
  if (!modalController || !title || !image || !photoSrc) {
    return false;
  }

  title.textContent = caseLabel || "Case photo";
  image.src = photoSrc;
  image.alt = caseLabel
    ? `Reference photo for ${caseLabel}`
    : "Reference photo";
  modalController.open({ triggerElement: triggerButton });
  return true;
}

function closeVisualCasePhotoModal({
  modalController,
  title,
  image,
  restoreFocus = false,
}) {
  if (!modalController || !title || !image) {
    return;
  }

  modalController.close({ restoreFocus });
  title.textContent = "Case photo";
  image.src = "";
  image.alt = "";
}

function buildCaseCard(optionConfig, selectedValue) {
  const { index, text } = parseCaseLabel(optionConfig.label);
  const hasPhoto = Boolean(getCasePhotoSrc(optionConfig.value));
  const shell = document.createElement("div");
  shell.className = "visual-case-card-shell";

  const card = document.createElement("button");
  card.type = "button";
  card.className = "visual-case-card";
  if (hasPhoto) {
    card.classList.add("has-photo");
  }
  card.dataset.value = optionConfig.value;
  card.setAttribute(
    "aria-pressed",
    String(optionConfig.value === selectedValue),
  );
  if (optionConfig.value === selectedValue) {
    card.classList.add("is-selected");
  }

  const header = document.createElement("div");
  header.className = "visual-case-header";

  const indexBadge = document.createElement("span");
  indexBadge.className = "visual-case-index";
  indexBadge.textContent = index;

  const label = document.createElement("span");
  label.className = "visual-case-label";
  label.textContent = text;

  header.append(indexBadge, label);

  const preview = document.createElement("div");
  preview.className = "visual-case-preview";

  const image = document.createElement("img");
  image.className = "visual-case-preview-image";
  image.src = getCaseThumbnailSrc(optionConfig.value);
  image.alt = "";
  image.loading = "lazy";
  image.decoding = "async";
  image.draggable = false;

  preview.appendChild(image);
  card.append(header, preview);
  shell.appendChild(card);

  if (hasPhoto) {
    const photoButton = document.createElement("button");
    photoButton.type = "button";
    photoButton.className = "visual-case-photo-button";
    photoButton.dataset.value = optionConfig.value;
    photoButton.title = `Open reference photo for ${optionConfig.label}`;
    photoButton.setAttribute(
      "aria-label",
      `Open reference photo for ${optionConfig.label}`,
    );
    photoButton.setAttribute("aria-haspopup", "dialog");

    const photoIcon = document.createElement("span");
    photoIcon.className = "visual-case-photo-icon";
    photoIcon.setAttribute("aria-hidden", "true");

    photoButton.appendChild(photoIcon);
    shell.appendChild(photoButton);
  }

  return shell;
}

function syncSelectedCase(container, selectedValue) {
  if (!container) {
    return;
  }

  container.querySelectorAll(".visual-case-card").forEach((card) => {
    const isSelected = card.dataset.value === selectedValue;
    card.classList.toggle("is-selected", isSelected);
    card.setAttribute("aria-pressed", String(isSelected));
  });
}

export function initVisualCaseMenu({ dom, state, onBeforeSelectCase }) {
  const {
    body,
    refractionStateSelect,
    visualCaseTrigger,
    visualCaseCurrentLabel,
    casePrevButton,
    caseNextButton,
    visualCaseModal,
    visualCaseModalContent,
    closeVisualCaseModalButton,
    visualCaseSimilar,
    visualCaseSimilarList,
    visualCaseModalList,
    visualCasePhotoModal,
    visualCasePhotoModalContent,
    closeVisualCasePhotoModalButton,
    visualCasePhotoTitle,
    visualCasePhotoImage,
  } = dom;

  if (
    !body ||
    !refractionStateSelect ||
    !visualCaseTrigger ||
    !visualCaseCurrentLabel ||
    !visualCaseModal ||
    !visualCaseModalContent ||
    !closeVisualCaseModalButton ||
    !visualCaseSimilar ||
    !visualCaseSimilarList ||
    !visualCaseModalList ||
    !visualCasePhotoModal ||
    !visualCasePhotoModalContent ||
    !closeVisualCasePhotoModalButton ||
    !visualCasePhotoTitle ||
    !visualCasePhotoImage
  ) {
    return;
  }

  const visualCaseModalController = createModalController({
    body,
    focusRoot: visualCaseModalContent,
    initialFocusElement: closeVisualCaseModalButton,
    modal: visualCaseModal,
  });
  const visualCasePhotoModalController = createModalController({
    body,
    focusRoot: visualCasePhotoModalContent,
    initialFocusElement: closeVisualCasePhotoModalButton,
    modal: visualCasePhotoModal,
  });

  function setParentModalActiveForAssistiveTech(isActive) {
    if (visualCaseModal.getAttribute("aria-hidden") === "false") {
      visualCaseModal.setAttribute("aria-modal", String(isActive));
    }
  }

  function buildCaseLevelDetails({ level, isOpen = false }) {
    const details = document.createElement("details");
    details.className = "visual-case-level";
    details.dataset.level = level.value;
    details.open = isOpen;

    const summary = document.createElement("summary");
    summary.className = "visual-case-level-summary";
    summary.textContent = `${level.label} cases (${level.options.length})`;

    const cards = document.createElement("div");
    cards.className = "visual-case-group-cards";

    level.options.forEach((optionConfig) => {
      cards.appendChild(buildCaseCard(optionConfig, state.currentRefraction));
    });

    details.append(summary, cards);
    return details;
  }

  function getAvailableCaseOptions() {
    return state.isBabyMode
      ? LEVEL_ORDERED_BABY_CASE_OPTIONS
      : LEVEL_ORDERED_CASE_OPTIONS;
  }

  function isCaseAvailable(caseValue) {
    return !state.isBabyMode || BABY_REFRACTION_VALUE_SET.has(caseValue);
  }

  function getAvailableLevelGroups() {
    return CASE_LEVELS.map((level) => {
      const options = level.values
        .map((caseValue) => CASE_OPTION_BY_VALUE.get(caseValue))
        .filter(
          (optionConfig) =>
            optionConfig &&
            (!state.isBabyMode ||
              BABY_REFRACTION_VALUE_SET.has(optionConfig.value)),
        );

      return {
        label: level.label,
        value: level.value,
        options,
      };
    }).filter((level) => level.options.length);
  }

  function renderCasePickerOptions() {
    const groups = getAvailableLevelGroups();
    const fragment = document.createDocumentFragment();

    groups.forEach((level, index) => {
      fragment.appendChild(
        buildCaseLevelDetails({
          level,
          isOpen: index === 0,
        }),
      );
    });

    visualCaseModalList.replaceChildren(fragment);
    syncSelectedCase(visualCaseModalList, refractionStateSelect.value);
  }

  function syncCaseStepperState(caseValue) {
    const options = getAvailableCaseOptions();
    const currentIndex = getCaseIndexInOptions(caseValue, options);
    const hasCases = currentIndex !== -1;

    if (casePrevButton) {
      casePrevButton.disabled = !hasCases || options.length < 2;
    }

    if (caseNextButton) {
      caseNextButton.disabled = !hasCases || options.length < 2;
    }
  }

  function renderSimilarCases(caseValue) {
    const similarOptions = getSimilarCaseOptions(caseValue).filter(
      (optionConfig) => isCaseAvailable(optionConfig.value),
    );
    if (!similarOptions.length) {
      visualCaseSimilar.hidden = true;
      visualCaseSimilar.open = false;
      visualCaseSimilarList.replaceChildren();
      return;
    }

    const similarFragment = document.createDocumentFragment();

    similarOptions.forEach((optionConfig) => {
      const { index, text } = parseCaseLabel(optionConfig.label);
      const chip = document.createElement("button");
      chip.type = "button";
      chip.className = "visual-case-similar-chip";
      chip.dataset.value = optionConfig.value;
      chip.textContent = index ? `${index}. ${text}` : text;
      similarFragment.appendChild(chip);
    });

    visualCaseSimilarList.replaceChildren(similarFragment);
    visualCaseSimilar.hidden = false;
    visualCaseSimilar.open = false;
  }

  function syncTriggerLabel(caseValue) {
    const fullLabel = getCaseLabel(caseValue) || "Select a case";
    const triggerLabel = getCaseTriggerLabel(caseValue) || fullLabel;
    const caseLevel = getCaseLevel(caseValue);
    visualCaseCurrentLabel.textContent = triggerLabel;
    visualCaseCurrentLabel.title = fullLabel;
    visualCaseCurrentLabel.dataset.level = caseLevel?.value || "";
    visualCaseCurrentLabel.dataset.levelLabel = caseLevel?.label || "";
    visualCaseTrigger.dataset.level = caseLevel?.value || "";
    visualCaseTrigger.title = fullLabel;
    visualCaseTrigger.setAttribute(
      "aria-label",
      caseLevel ? `${caseLevel.label} case: ${fullLabel}` : fullLabel,
    );
    renderSimilarCases(caseValue);
    syncCaseStepperState(caseValue);
  }

  function openCasePicker() {
    const selectedValue = refractionStateSelect.value;
    renderCasePickerOptions();
    syncSelectedCase(visualCaseModalList, selectedValue);
    openVisualCaseModal({
      modalController: visualCaseModalController,
      triggerButton: visualCaseTrigger,
    });
  }

  function openPhotoForCase(caseValue, triggerButton = null) {
    const didOpen = openVisualCasePhotoModal({
      modalController: visualCasePhotoModalController,
      title: visualCasePhotoTitle,
      image: visualCasePhotoImage,
      caseLabel: getCaseLabel(caseValue),
      caseValue,
      triggerButton,
    });

    if (didOpen) {
      setParentModalActiveForAssistiveTech(false);
    }

    return didOpen;
  }

  function selectAdjacentCase(step) {
    const options = getAvailableCaseOptions();
    const currentIndex = getCaseIndexInOptions(
      refractionStateSelect.value,
      options,
    );
    if (!options.length) {
      return;
    }

    if (currentIndex === -1) {
      selectVisualCase(options[0]?.value);
      return;
    }

    const lastIndex = options.length - 1;
    let nextIndex = currentIndex + step;
    if (nextIndex < 0) {
      nextIndex = lastIndex;
    } else if (nextIndex > lastIndex) {
      nextIndex = 0;
    }

    selectVisualCase(options[nextIndex]?.value);
  }

  function selectVisualCase(nextValue) {
    if (!nextValue || !isCaseAvailable(nextValue)) {
      return;
    }

    if (typeof onBeforeSelectCase === "function") {
      onBeforeSelectCase();
    }

    closeVisualCasePhotoModal({
      modalController: visualCasePhotoModalController,
      title: visualCasePhotoTitle,
      image: visualCasePhotoImage,
      restoreFocus: false,
    });

    refractionStateSelect.value = nextValue;
    refractionStateSelect.dispatchEvent(new Event("change", { bubbles: true }));
    renderCasePickerOptions();
    syncSelectedCase(visualCaseModalList, nextValue);
    syncTriggerLabel(nextValue);
    closeVisualCaseModal({
      modalController: visualCaseModalController,
      triggerButton: visualCaseTrigger,
      restoreFocus: false,
    });
    visualCaseModal.setAttribute("aria-modal", "true");
  }

  visualCaseTrigger.addEventListener("click", () => {
    if (visualCaseTrigger.disabled) {
      return;
    }

    openCasePicker();
  });

  casePrevButton?.addEventListener("click", () => {
    if (casePrevButton.disabled) {
      return;
    }

    selectAdjacentCase(-1);
  });

  caseNextButton?.addEventListener("click", () => {
    if (caseNextButton.disabled) {
      return;
    }

    selectAdjacentCase(1);
  });

  closeVisualCaseModalButton.addEventListener("click", () => {
    closeVisualCasePhotoModal({
      modalController: visualCasePhotoModalController,
      title: visualCasePhotoTitle,
      image: visualCasePhotoImage,
      restoreFocus: false,
    });
    closeVisualCaseModal({
      modalController: visualCaseModalController,
      triggerButton: visualCaseTrigger,
      restoreFocus: true,
    });
    visualCaseModal.setAttribute("aria-modal", "true");
  });

  visualCaseModal.addEventListener("click", (event) => {
    if (event.target !== visualCaseModal) {
      return;
    }

    closeVisualCasePhotoModal({
      modalController: visualCasePhotoModalController,
      title: visualCasePhotoTitle,
      image: visualCasePhotoImage,
      restoreFocus: false,
    });
    closeVisualCaseModal({
      modalController: visualCaseModalController,
      triggerButton: visualCaseTrigger,
      restoreFocus: false,
    });
    visualCaseModal.setAttribute("aria-modal", "true");
  });

  visualCaseModal.addEventListener("keydown", (event) => {
    if (event.key !== "Escape" || !event.defaultPrevented) {
      return;
    }

    closeVisualCaseModal({
      modalController: visualCaseModalController,
      triggerButton: visualCaseTrigger,
      restoreFocus: true,
    });
    visualCaseModal.setAttribute("aria-modal", "true");
  });

  closeVisualCasePhotoModalButton.addEventListener("click", () => {
    closeVisualCasePhotoModal({
      modalController: visualCasePhotoModalController,
      title: visualCasePhotoTitle,
      image: visualCasePhotoImage,
      restoreFocus: true,
    });
    setParentModalActiveForAssistiveTech(true);
  });

  visualCasePhotoModal.addEventListener("keydown", (event) => {
    if (event.key !== "Escape" || !event.defaultPrevented) {
      return;
    }

    closeVisualCasePhotoModal({
      modalController: visualCasePhotoModalController,
      title: visualCasePhotoTitle,
      image: visualCasePhotoImage,
      restoreFocus: true,
    });
    setParentModalActiveForAssistiveTech(true);
  });

  visualCasePhotoModal.addEventListener("click", (event) => {
    if (event.target !== visualCasePhotoModal) {
      return;
    }

    closeVisualCasePhotoModal({
      modalController: visualCasePhotoModalController,
      title: visualCasePhotoTitle,
      image: visualCasePhotoImage,
      restoreFocus: false,
    });
    setParentModalActiveForAssistiveTech(true);
  });

  window.addEventListener("keydown", (event) => {
    if (event.defaultPrevented) {
      return;
    }

    if (event.key !== "Escape") {
      return;
    }

    if (visualCasePhotoModal.getAttribute("aria-hidden") === "false") {
      closeVisualCasePhotoModal({
        modalController: visualCasePhotoModalController,
        title: visualCasePhotoTitle,
        image: visualCasePhotoImage,
        restoreFocus: true,
      });
      setParentModalActiveForAssistiveTech(true);
      return;
    }

    if (visualCaseModal.getAttribute("aria-hidden") === "true") {
      return;
    }

    closeVisualCaseModal({
      modalController: visualCaseModalController,
      triggerButton: visualCaseTrigger,
      restoreFocus: true,
    });
    visualCaseModal.setAttribute("aria-modal", "true");
  });

  visualCaseModalList.addEventListener("click", (event) => {
    const photoButton =
      event.target instanceof Element
        ? event.target.closest(".visual-case-photo-button")
        : null;
    if (photoButton) {
      openPhotoForCase(photoButton.dataset.value, photoButton);
      return;
    }

    const button =
      event.target instanceof Element
        ? event.target.closest(".visual-case-card")
        : null;
    if (!button) {
      return;
    }

    selectVisualCase(button.dataset.value);
  });

  visualCaseSimilarList.addEventListener("click", (event) => {
    const button =
      event.target instanceof Element
        ? event.target.closest(".visual-case-similar-chip")
        : null;
    if (!button) {
      return;
    }

    selectVisualCase(button.dataset.value);
  });

  refractionStateSelect.addEventListener("change", (event) => {
    if (!isCaseAvailable(event.target.value)) {
      const fallback = getAvailableCaseOptions()[0]?.value;
      if (fallback) {
        refractionStateSelect.value = fallback;
        refractionStateSelect.dispatchEvent(
          new Event("change", { bubbles: true }),
        );
      }
      return;
    }

    syncSelectedCase(visualCaseModalList, event.target.value);
    syncTriggerLabel(event.target.value);
  });

  function setBabyMode() {
    renderCasePickerOptions();
    if (!isCaseAvailable(refractionStateSelect.value)) {
      const fallback = getAvailableCaseOptions()[0]?.value;
      if (fallback) {
        refractionStateSelect.value = fallback;
        refractionStateSelect.dispatchEvent(
          new Event("change", { bubbles: true }),
        );
      }
      return;
    }

    syncSelectedCase(visualCaseModalList, refractionStateSelect.value);
    syncTriggerLabel(refractionStateSelect.value);
  }

  renderCasePickerOptions();
  syncSelectedCase(visualCaseModalList, refractionStateSelect.value);
  syncTriggerLabel(refractionStateSelect.value);
  closeVisualCaseModal({
    modalController: visualCaseModalController,
    triggerButton: visualCaseTrigger,
    restoreFocus: false,
  });
  closeVisualCasePhotoModal({
    modalController: visualCasePhotoModalController,
    title: visualCasePhotoTitle,
    image: visualCasePhotoImage,
    restoreFocus: false,
  });
  visualCaseModal.setAttribute("aria-modal", "true");

  return {
    hasPhotoForCase: (caseValue = refractionStateSelect.value) =>
      Boolean(getCasePhotoSrc(caseValue)),
    openCasePicker,
    selectAdjacentCase,
    selectCase: selectVisualCase,
    setBabyMode,
  };
}
