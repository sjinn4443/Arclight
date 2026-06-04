import { $, $$ } from "./dom-utils.js";
import { evaluateCataractDecision } from "./cataract-engine.js?v=20260511-1";
import { UI_COPY } from "./cataract-copy.js?v=20260511-2";

const NEUTRAL_BORDER_COLOR = "#ccc";

const FUNDAL_BORDER_COLORS = {
  normal: "green",
  dark: "orange",
  patches: "orange",
  spots: "orange",
  white: "red",
};

const BACK_BORDER_COLORS = {
  normal: "green",
  detached: "red",
  cupping: "orange",
  diabetic: "orange",
  "poor view": "orange",
};

const MAX_DISPLAY_NOTES = 3;
const NOTE_DEDUP_STOPWORDS = new Set([
  "a",
  "an",
  "and",
  "are",
  "as",
  "at",
  "be",
  "before",
  "both",
  "by",
  "can",
  "consider",
  "for",
  "first",
  "from",
  "in",
  "is",
  "it",
  "key",
  "needed",
  "no",
  "not",
  "now",
  "of",
  "on",
  "or",
  "re",
  "review",
  "same",
  "step",
  "the",
  "to",
  "up",
  "with",
]);

function normalizeSnippet(text) {
  return String(text || "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, " ")
    .trim();
}

function compactNoteText(note) {
  const trimmed = String(note || "").trim();
  return trimmed;
}

function getMeaningfulTokenSet(text) {
  const tokens = String(text || "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, " ")
    .split(" ")
    .map((token) => token.trim())
    .filter((token) => token.length >= 3 && !NOTE_DEDUP_STOPWORDS.has(token));
  return new Set(tokens);
}

function isMostlyRepeatOfAction(noteText, actionText, actionTokenSet) {
  const noteTokens = getMeaningfulTokenSet(noteText);
  const actionTokens = actionTokenSet || getMeaningfulTokenSet(actionText);
  if (noteTokens.size < 2 || actionTokens.size < 2) {
    return false;
  }

  let shared = 0;
  noteTokens.forEach((token) => {
    if (actionTokens.has(token)) {
      shared += 1;
    }
  });

  const noteCoverage = shared / noteTokens.size;
  const actionCoverage = shared / actionTokens.size;
  return noteCoverage >= 0.67 || (noteCoverage >= 0.5 && actionCoverage >= 0.5);
}

function buildDisplayNotes(decision) {
  const actionNotes = Array.isArray(decision.actionNotes)
    ? decision.actionNotes
    : [];
  if (actionNotes.length === 0) {
    return [];
  }

  const actionNorm = normalizeSnippet(decision.actionText);
  const actionTokenSet = getMeaningfulTokenSet(decision.actionText);
  const noteCodes = Array.isArray(decision.actionNoteCodes)
    ? decision.actionNoteCodes
    : [];
  const showNotes = [];
  const seenByCode = new Set();
  const seenByText = new Set();

  for (let index = 0; index < actionNotes.length; index += 1) {
    const rawNote = actionNotes[index];
    const noteCode = noteCodes[index] || "";
    const compact = compactNoteText(rawNote);
    const noteNorm = normalizeSnippet(compact);
    if (!noteNorm) {
      continue;
    }

    if (noteNorm === actionNorm) {
      continue;
    }

    if (isMostlyRepeatOfAction(compact, decision.actionText, actionTokenSet)) {
      continue;
    }

    if (noteCode && seenByCode.has(noteCode)) {
      continue;
    }

    if (seenByText.has(noteNorm)) {
      continue;
    }

    if (noteCode) {
      seenByCode.add(noteCode);
    }
    seenByText.add(noteNorm);
    showNotes.push(compact);
    if (showNotes.length >= MAX_DISPLAY_NOTES) {
      break;
    }
  }

  return showNotes;
}

export function initCataractController() {
  const fundalSection = $("#fundal-section");
  const backSection = $("#back-section");
  const resultSection = $("#result-section");
  const resultDiv = $("#result");
  const ageBandSelect = $("#ageBand");
  const distanceVASelect = $("#distanceVA");
  const onsetInputs = $$('#top-section input[name="onset"]');
  const eyesInputs = $$('#top-section input[name="eyes"]');
  const painLabel = $("#pain-label");
  const neuroLabel = $("#neuro-label");
  const fundalButtons = $$(".fundal-btn");
  const backButtons = $$(".back-btn");
  const topInputs = $$("#top-section input, #top-section select");
  const nearVAInput = $("#nearVA");
  const fundalLockHint = $("#fundal-lock-hint");
  const backLockHint = $("#back-lock-hint");
  const resultLockHint = $("#result-lock-hint");
  let hasShownFundalHint = false;

  function setButtonGroupSelection(buttons, selectedButton, colorMap) {
    buttons.forEach((button) => {
      button.classList.remove("selected");
      button.style.borderColor = NEUTRAL_BORDER_COLOR;
      button.setAttribute("aria-pressed", "false");
    });
    selectedButton.classList.add("selected");
    const value = selectedButton.getAttribute("data-value")?.trim();
    selectedButton.style.borderColor = colorMap[value] || NEUTRAL_BORDER_COLOR;
    selectedButton.setAttribute("aria-pressed", "true");
  }

  function checkTopSectionCompletion() {
    const onsetSelected = $('#top-section input[name="onset"]:checked');
    const distanceVA = $("#distanceVA")?.value;
    const eyesSelected = $('#top-section input[name="eyes"]:checked');
    return Boolean(onsetSelected && distanceVA !== "" && eyesSelected);
  }

  function clearButtonGroupSelection(buttons) {
    buttons.forEach((button) => {
      button.classList.remove("selected");
      button.style.borderColor = NEUTRAL_BORDER_COLOR;
      button.setAttribute("aria-pressed", "false");
    });
  }

  function setSectionDisabledState(
    section,
    isDisabled,
    hintElement,
    hintText = "",
  ) {
    if (!section) {
      return;
    }

    section.classList.toggle("disabled", isDisabled);
    section.setAttribute("aria-disabled", isDisabled ? "true" : "false");

    $$("button, input, select, textarea", section).forEach((control) => {
      if ("disabled" in control) {
        control.disabled = isDisabled;
      }
    });

    if (hintElement) {
      hintElement.textContent = isDisabled ? hintText : "";
      hintElement.hidden = !isDisabled;
    }
  }

  function setupClearableTopRadios() {
    const topRadios = $$('#top-section input[type="radio"]');
    if (topRadios.length === 0) {
      return;
    }

    topRadios.forEach((radio) => {
      const markWasChecked = () => {
        radio.dataset.wasChecked = radio.checked ? "1" : "0";
      };

      radio.addEventListener("pointerdown", markWasChecked);
      radio.addEventListener("mousedown", markWasChecked);
      radio.addEventListener(
        "touchstart",
        () => {
          markWasChecked();
        },
        { passive: true },
      );

      const parentLabel = radio.closest("label");
      if (parentLabel) {
        parentLabel.addEventListener("pointerdown", markWasChecked);
        parentLabel.addEventListener("mousedown", markWasChecked);
        parentLabel.addEventListener(
          "touchstart",
          () => {
            markWasChecked();
          },
          { passive: true },
        );
      }

      radio.addEventListener("keydown", (event) => {
        if (
          (event.key === " " ||
            event.key === "Spacebar" ||
            event.key === "Enter") &&
          radio.checked
        ) {
          radio.dataset.wasChecked = "1";
        }
      });

      radio.addEventListener("click", (event) => {
        const wasChecked = radio.dataset.wasChecked === "1";
        radio.dataset.wasChecked = "0";
        if (!wasChecked) {
          return;
        }
        event.stopPropagation();
        // Let native click complete first, then clear selection.
        window.requestAnimationFrame(() => {
          radio.checked = false;
          radio.dispatchEvent(new Event("change", { bubbles: true }));
        });
      });
    });
  }

  function showFundalGuidanceMessage() {
    const fundalTitle = fundalSection?.querySelector("h2");
    if (!fundalTitle) {
      return;
    }

    const existingMessage = fundalTitle.querySelector("#fundal-message");
    if (existingMessage) {
      return;
    }

    const message = document.createElement("span");
    message.textContent = UI_COPY.fundalHint;
    message.style.color = "black";
    message.style.fontSize = "14px";
    message.style.marginLeft = "20px";
    message.style.display = "inline-block";
    message.id = "fundal-message";
    message.style.animation = "zoomAnimation 4s forwards";
    fundalTitle.appendChild(message);

    window.setTimeout(() => {
      message.remove();
    }, 4000);
  }

  function clearRecheckHighlights() {
    $$(".recheck-flash").forEach((element) => {
      element.classList.remove("recheck-flash");
    });
  }

  function applyRecheckHighlights(recheckFieldKeys) {
    clearRecheckHighlights();

    if (!Array.isArray(recheckFieldKeys) || recheckFieldKeys.length === 0) {
      return;
    }

    const targetMap = {
      age: [ageBandSelect],
      distanceVA: [distanceVASelect],
      near: [nearVAInput],
      fundal: [fundalSection],
      back: [backSection],
      onset: onsetInputs.map((input) => input.parentElement),
      eyes: eyesInputs.map((input) => input.parentElement),
      pain: [painLabel],
      rapd: [neuroLabel],
      light: [neuroLabel],
    };

    const uniqueTargets = new Set();
    recheckFieldKeys.forEach((fieldKey) => {
      const targets = targetMap[fieldKey] || [];
      targets.forEach((target) => {
        if (target) {
          uniqueTargets.add(target);
        }
      });
    });

    uniqueTargets.forEach((target) => {
      target.classList.remove("recheck-flash");
      void target.offsetWidth;
      target.classList.add("recheck-flash");
    });
  }

  function calculateResult() {
    const onsetElem = $('#top-section input[name="onset"]:checked');
    if (!onsetElem || !resultDiv) {
      if (resultDiv) {
        resultDiv.innerHTML = "";
      }
      clearRecheckHighlights();
      return false;
    }

    const fundalBtn = $(".fundal-btn.selected");
    const backBtn = $(".back-btn.selected");
    if (!fundalBtn || !backBtn) {
      resultDiv.innerHTML = "";
      clearRecheckHighlights();
      return false;
    }

    const fundalSelection = fundalBtn.getAttribute("data-value");
    const backSelection = backBtn.getAttribute("data-value");
    const eyesElem = $('#top-section input[name="eyes"]:checked');
    const eyes = eyesElem ? eyesElem.value : "";
    const painElem = $('#top-section input[name="pain"]:checked');
    const pupilElem = $('#top-section input[name="pupil"]:checked');
    const frontElem = $('#top-section input[name="front"]:checked');
    const neuroElem = $('#top-section input[name="neuro"]:checked');

    const decision = evaluateCataractDecision({
      onsetValue: onsetElem.value,
      ageBand: $("#ageBand")?.value || "",
      distanceVA: $("#distanceVA")?.value || "",
      nearVAValue: $("#nearVA")?.value || "",
      eyes,
      painYes: Boolean(painElem && painElem.value === "yes"),
      painRecorded: true,
      pupilSelected: true,
      pupilRecorded: true,
      pupilAbnormal: Boolean(pupilElem && pupilElem.value === "abnormal"),
      frontPresent: Boolean(frontElem && frontElem.value === "present"),
      frontRecorded: true,
      rapdPresent: Boolean(neuroElem && neuroElem.value === "yes"),
      rapdRecorded: true,
      directionLightPoor: Boolean(neuroElem && neuroElem.value === "yes"),
      lightRecorded: true,
      fundalSelection,
      backSelection,
    });

    if (!decision.hasResult) {
      resultDiv.innerHTML = "";
      clearRecheckHighlights();
      return false;
    }

    let resultHTML = '<div class="result-summary result-summary--compact">';
    resultHTML += `
      <div class="result-card result-pattern">
        <p class="result-label">${UI_COPY.result.cataractTypeLabel}</p>
        <p class="result-value">${decision.cataractType}</p>
      </div>
    `;
    resultHTML += `
      <div class="result-card result-action">
        <p class="result-label">${UI_COPY.result.nextStepLabel}</p>
        <p class="result-value action-text action-${decision.actionColour}">${decision.actionText}</p>
      </div>
    `;
    resultHTML += "</div>";

    const displayNotes = buildDisplayNotes(decision);
    if (displayNotes.length > 0) {
      const notesHtml = displayNotes
        .map((note) => `<p class="action-note-line">${note}</p>`)
        .join("");
      resultHTML += `
        <div class="result-detail-block result-note-block checks-${decision.actionColour}">
          <p class="result-label">${UI_COPY.result.checkLabel}</p>
          <div class="action-notes">${notesHtml}</div>
        </div>
      `;
    }

    resultDiv.innerHTML = resultHTML;
    applyRecheckHighlights(decision.recheckFieldKeys);
    return true;
  }

  function syncProgressiveState() {
    const wasFundalDisabled = Boolean(
      fundalSection?.classList.contains("disabled"),
    );
    const isTopComplete = checkTopSectionCompletion();

    if (!isTopComplete) {
      clearButtonGroupSelection(fundalButtons);
      clearButtonGroupSelection(backButtons);
      resultDiv.innerHTML = "";
      clearRecheckHighlights();

      setSectionDisabledState(
        fundalSection,
        true,
        fundalLockHint,
        "Complete Vision Loss and Dist VA to unlock.",
      );
      setSectionDisabledState(
        backSection,
        true,
        backLockHint,
        "Complete top details first.",
      );
      setSectionDisabledState(
        resultSection,
        true,
        resultLockHint,
        "Complete required fields to show result.",
      );
      return;
    }

    setSectionDisabledState(fundalSection, false, fundalLockHint);
    if (wasFundalDisabled && !hasShownFundalHint) {
      showFundalGuidanceMessage();
      hasShownFundalHint = true;
    }

    const selectedFundalButton = $(".fundal-btn.selected");
    if (!selectedFundalButton) {
      clearButtonGroupSelection(backButtons);
      resultDiv.innerHTML = "";
      clearRecheckHighlights();
      setSectionDisabledState(
        backSection,
        true,
        backLockHint,
        "Select one fundal reflex to unlock.",
      );
      setSectionDisabledState(
        resultSection,
        true,
        resultLockHint,
        "Select fundal reflex and back of eye.",
      );
      return;
    }

    const fundalValue = selectedFundalButton.getAttribute("data-value")?.trim();
    if (fundalValue === "white") {
      const poorViewButton = $('.back-btn[data-value="poor view"]');
      if (poorViewButton && !poorViewButton.classList.contains("selected")) {
        setButtonGroupSelection(
          backButtons,
          poorViewButton,
          BACK_BORDER_COLORS,
        );
      }
      setSectionDisabledState(
        backSection,
        true,
        backLockHint,
        "Dense reflex auto-sets back to Poor view.",
      );
    } else {
      setSectionDisabledState(backSection, false, backLockHint);
    }

    const hasResult = calculateResult();
    if (hasResult) {
      setSectionDisabledState(resultSection, false, resultLockHint);
      return;
    }

    const hasBackSelection = Boolean($(".back-btn.selected"));
    setSectionDisabledState(
      resultSection,
      true,
      resultLockHint,
      hasBackSelection
        ? "Complete required fields to show result."
        : "Select one back-of-eye finding.",
    );
  }

  function updateCriticalStyling() {
    const suddenRadio = $("#onset-sudden");
    if (suddenRadio) {
      const suddenSpan = suddenRadio.parentElement;
      if (suddenRadio.checked) {
        suddenSpan?.classList.add("serious");
      } else {
        suddenSpan?.classList.remove("serious");
      }
    }

    const painRadio = $("#pain-yes");
    const painLabel = $("#pain-label");
    const painYesLabel = $("#pain-yes-label");
    if (painRadio && painLabel && painYesLabel) {
      if (painRadio.checked) {
        painLabel.classList.add("serious");
        painYesLabel.classList.add("serious");
      } else {
        painLabel.classList.remove("serious");
        painYesLabel.classList.remove("serious");
      }
    }

    const pupilAbnormalRadio = $("#pupil-abnormal");
    const pupilLabel = $("#pupil-label");
    const pupilYesLabel = $("#pupil-yes-label");
    if (pupilLabel && pupilAbnormalRadio && pupilYesLabel) {
      if (pupilAbnormalRadio.checked) {
        pupilLabel.classList.add("serious");
        pupilYesLabel.classList.add("serious");
        pupilLabel.classList.remove("good");
      } else {
        pupilLabel.classList.remove("good");
        pupilLabel.classList.remove("serious");
        pupilYesLabel.classList.remove("serious");
      }
    }

    const frontRadio = $("#front-present");
    const frontLabel = $("#front-label");
    const frontYesLabel = $("#front-yes-label");
    if (frontRadio && frontLabel && frontYesLabel) {
      if (frontRadio.checked) {
        frontLabel.classList.add("warning");
        frontYesLabel.classList.add("warning");
      } else {
        frontLabel.classList.remove("warning");
        frontYesLabel.classList.remove("warning");
      }
    }

    const neuroRadio = $("#neuro-red-yes");
    const neuroLabel = $("#neuro-label");
    const neuroYesLabel = $("#neuro-yes-label");
    if (neuroRadio && neuroLabel && neuroYesLabel) {
      if (neuroRadio.checked) {
        neuroLabel.classList.add("serious");
        neuroYesLabel.classList.add("serious");
      } else {
        neuroLabel.classList.remove("serious");
        neuroYesLabel.classList.remove("serious");
      }
    }
  }

  topInputs.forEach((input) => {
    input.addEventListener("change", () => {
      updateCriticalStyling();
      syncProgressiveState();
    });
  });

  fundalButtons.forEach((button) => {
    button.addEventListener("click", () => {
      setButtonGroupSelection(fundalButtons, button, FUNDAL_BORDER_COLORS);
      syncProgressiveState();
    });
  });

  backButtons.forEach((button) => {
    button.addEventListener("click", () => {
      if (backSection?.classList.contains("disabled")) {
        return;
      }
      setButtonGroupSelection(backButtons, button, BACK_BORDER_COLORS);
      syncProgressiveState();
    });
  });

  if (nearVAInput) {
    nearVAInput.addEventListener("change", syncProgressiveState);
  }

  setupClearableTopRadios();
  updateCriticalStyling();
  syncProgressiveState();
}
