import {
  CASE_LEVELS,
  getCaseByValue,
  getCaseList,
} from "./case-catalog.js?v=20260507-1";
import { createModalController } from "./modal.js";

function createElement(tagName, className, textContent) {
  const element = document.createElement(tagName);
  if (className) {
    element.className = className;
  }
  if (textContent !== undefined) {
    element.textContent = textContent;
  }
  return element;
}

function getCurrentCaseIndex(caseList, currentValue) {
  const index = caseList.findIndex(
    (caseItem) => caseItem.value === currentValue,
  );
  return index >= 0 ? index : 0;
}

function scrollCardIntoView(card) {
  if (!(card instanceof HTMLElement)) {
    return;
  }

  requestAnimationFrame(() => {
    card.scrollIntoView({
      block: "nearest",
      inline: "nearest",
    });
  });
}

function buildFallbackPreview(caseItem) {
  const preview = createElement("div", "case-card-fallback-preview");
  preview.dataset.caseCategory = caseItem.category;
  preview.dataset.caseLevel = caseItem.level;

  const leftEye = createElement("span", "case-preview-eye");
  const rightEye = createElement("span", "case-preview-eye");
  preview.append(leftEye, rightEye);
  return preview;
}

export function createVisualCasesController({
  state,
  dom,
  onSelectCase,
  onBeforeOpen,
} = {}) {
  const {
    body,
    caseModal,
    caseModalContent,
    closeCaseModalButton,
    caseSectionsContainer,
    caseSimilarTool,
    caseSimilarList,
    casePicker,
    casePreviousButton,
    caseNextButton,
    caseTriggerButton,
    caseTriggerLabel,
    caseTriggerLevel,
  } = dom;

  if (
    !body ||
    !caseModal ||
    !caseModalContent ||
    !closeCaseModalButton ||
    !caseSectionsContainer ||
    !casePicker ||
    !casePreviousButton ||
    !caseNextButton ||
    !caseTriggerButton ||
    !caseTriggerLabel ||
    !caseTriggerLevel
  ) {
    return {
      init() {},
      update() {},
      selectNextCase() {},
      selectPreviousCase() {},
    };
  }

  const modalController = createModalController({
    body,
    focusRoot: caseModalContent,
    initialFocusElement: closeCaseModalButton,
    modal: caseModal,
  });

  function getVisibleCases() {
    return getCaseList({ babyOnly: state.isBabyMode });
  }

  function selectCase(value, triggerElement) {
    const caseItem = getCaseByValue(value);
    if (!caseItem || typeof onSelectCase !== "function") {
      return;
    }

    onSelectCase(caseItem.value);
    modalController.close({ restoreFocus: false });
    update();
    if (triggerElement instanceof HTMLElement) {
      triggerElement.focus();
    }
  }

  function selectByDelta(delta) {
    const caseList = getVisibleCases();
    if (!caseList.length || state.isTestMode) {
      return;
    }

    const currentIndex = getCurrentCaseIndex(caseList, state.currentRefraction);
    const nextIndex =
      (currentIndex + delta + caseList.length) % caseList.length;
    selectCase(caseList[nextIndex].value);
  }

  function renderCaseCard(caseItem) {
    const button = createElement("button", "case-card");
    button.type = "button";
    button.dataset.caseValue = caseItem.value;
    button.dataset.level = caseItem.level;
    button.setAttribute(
      "aria-pressed",
      String(caseItem.value === state.currentRefraction),
    );

    const header = createElement("span", "case-card-header");
    const badge = createElement(
      "span",
      "case-card-badge",
      String(caseItem.index),
    );
    const text = createElement("span", "case-card-text");
    const title = createElement("span", "case-card-title", caseItem.label);
    const summary = createElement(
      "span",
      "case-card-summary",
      caseItem.summary,
    );
    text.append(title, summary);
    header.append(badge, text);

    const media = createElement("span", "case-card-media");
    const image = document.createElement("img");
    image.src = caseItem.thumbnailSrc;
    image.alt = "";
    image.loading = "lazy";
    image.decoding = "async";
    image.addEventListener(
      "error",
      () => {
        media.replaceChildren(buildFallbackPreview(caseItem));
      },
      { once: true },
    );
    media.appendChild(image);

    button.append(header, media);
    button.addEventListener("click", () => selectCase(caseItem.value, button));
    button.addEventListener("focus", () => scrollCardIntoView(button));
    return button;
  }

  function renderSimilarCases() {
    if (!caseSimilarTool || !caseSimilarList) {
      return;
    }

    const visibleCases = getVisibleCases();
    const currentIndex = getCurrentCaseIndex(
      visibleCases,
      state.currentRefraction,
    );
    const currentCase = visibleCases[currentIndex];
    if (!currentCase) {
      caseSimilarTool.hidden = true;
      caseSimilarList.replaceChildren();
      return;
    }

    const adjacentCases = [-1, 1]
      .map((delta) => {
        const index = currentIndex + delta;
        return visibleCases[index] || null;
      })
      .filter((caseItem) => caseItem && caseItem.level === currentCase.level);

    if (!adjacentCases.length) {
      caseSimilarTool.hidden = true;
      caseSimilarList.replaceChildren();
      return;
    }

    const fragment = document.createDocumentFragment();
    adjacentCases.forEach((caseItem) => {
      const chip = createElement(
        "button",
        "case-similar-chip",
        `${caseItem.index}. ${caseItem.label}`,
      );
      chip.type = "button";
      chip.dataset.caseValue = caseItem.value;
      chip.addEventListener("click", () => selectCase(caseItem.value, chip));
      fragment.appendChild(chip);
    });

    caseSimilarList.replaceChildren(fragment);
    caseSimilarTool.hidden = false;
    caseSimilarTool.open = false;
  }

  function renderCaseSections() {
    const visibleCases = getVisibleCases();
    const fragment = document.createDocumentFragment();

    CASE_LEVELS.forEach((level) => {
      const levelCases = visibleCases.filter(
        (caseItem) => caseItem.level === level.value,
      );
      if (!levelCases.length) {
        return;
      }

      const details = document.createElement("details");
      details.className = "case-level-section";
      details.dataset.level = level.value;
      details.open = level.value === "primary";

      const summary = createElement("summary", "case-level-summary");
      const label = createElement("span", "case-level-label", level.label);
      const count = createElement(
        "span",
        "case-level-count",
        `(${levelCases.length})`,
      );
      summary.append(label, count);

      const grid = createElement("div", "case-card-grid");
      levelCases.forEach((caseItem) => {
        grid.appendChild(renderCaseCard(caseItem));
      });

      details.append(summary, grid);
      fragment.appendChild(details);
    });

    caseSectionsContainer.replaceChildren(fragment);
  }

  function update() {
    const currentCase = getCaseByValue(state.currentRefraction);
    if (!currentCase) {
      return;
    }

    caseTriggerLabel.textContent = currentCase.label;
    caseTriggerLevel.textContent = "";
    caseTriggerLevel.dataset.level = currentCase.level;
    caseTriggerButton.dataset.level = currentCase.level;

    const visibleCases = getVisibleCases();
    const hasMultipleCases = visibleCases.length > 1;
    casePreviousButton.disabled = state.isTestMode || !hasMultipleCases;
    caseNextButton.disabled = state.isTestMode || !hasMultipleCases;
    caseTriggerButton.disabled = state.isTestMode;

    if (modalController.isOpen()) {
      renderCaseSections();
      renderSimilarCases();
    }
  }

  function openCases(triggerElement) {
    if (state.isTestMode) {
      return;
    }

    if (typeof onBeforeOpen === "function") {
      onBeforeOpen();
    }

    renderCaseSections();
    renderSimilarCases();
    modalController.open({ triggerElement });
    const selectedCard = caseSectionsContainer.querySelector(
      `.case-card[data-case-value="${CSS.escape(state.currentRefraction)}"]`,
    );
    scrollCardIntoView(selectedCard);
  }

  function init() {
    casePreviousButton.addEventListener("click", () => selectByDelta(-1));
    caseNextButton.addEventListener("click", () => selectByDelta(1));
    caseTriggerButton.addEventListener("click", () =>
      openCases(caseTriggerButton),
    );
    closeCaseModalButton.addEventListener("click", () =>
      modalController.close(),
    );

    caseModal.addEventListener("click", (event) => {
      if (event.target === caseModal) {
        modalController.close();
      }
    });

    update();
  }

  return {
    init,
    selectNextCase: () => selectByDelta(1),
    selectPreviousCase: () => selectByDelta(-1),
    update,
  };
}
