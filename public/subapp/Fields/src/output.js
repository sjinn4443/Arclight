const RESULT_MODE_STORAGE_KEY = "fields_result_mode_v1";
const RESULT_STATUS_CLASSES = [
  "status-normal",
  "status-caution",
  "status-urgent",
];

function getResultModeToggle() {
  return document.getElementById("result-mode-toggle");
}

function getResultLanguageMode() {
  const toggle = getResultModeToggle();
  if (!toggle) return "advanced";
  return toggle.checked ? "advanced" : "simple";
}

function updateResultModeUi() {
  const toggle = getResultModeToggle();
  const root = toggle ? toggle.closest(".mode-toggle") : null;
  if (!toggle || !root) return;

  const simpleLabel = root.querySelector('[data-mode="simple"]');
  const advancedLabel = root.querySelector('[data-mode="advanced"]');
  const isAdvanced = toggle.checked;

  if (simpleLabel) {
    simpleLabel.classList.toggle("mode-active", !isAdvanced);
  }
  if (advancedLabel) {
    advancedLabel.classList.toggle("mode-active", isAdvanced);
  }
}

function initResultCalcToggle() {
  const button = document.getElementById("calc-toggle");
  const output = document.getElementById("output");
  const panel = document.getElementById("result-panel");
  if (!button || !output || !panel || button.dataset.initialized === "true")
    return;

  function setCalcOpen(isOpen) {
    button.setAttribute("aria-expanded", isOpen ? "true" : "false");
    button.classList.toggle("is-active", isOpen);
    panel.classList.toggle("is-calc-open", isOpen);
    output.hidden = !isOpen;
  }

  button.addEventListener("click", () => {
    setCalcOpen(button.getAttribute("aria-expanded") !== "true");
  });

  document.addEventListener("keydown", (event) => {
    if (
      event.key === "Escape" &&
      button.getAttribute("aria-expanded") === "true"
    ) {
      setCalcOpen(false);
      button.focus();
    }
  });

  button.dataset.initialized = "true";
  setCalcOpen(false);
}

function initResultModeToggle() {
  initResultCalcToggle();

  const toggle = getResultModeToggle();
  if (!toggle || toggle.dataset.initialized === "true") return;
  const root = toggle.closest(".mode-toggle");

  try {
    const saved = localStorage.getItem(RESULT_MODE_STORAGE_KEY);
    if (saved === "advanced") {
      toggle.checked = true;
    } else if (saved === "simple") {
      toggle.checked = false;
    }
  } catch (_error) {
    // Ignore storage read errors (private mode / denied access).
  }

  function onModeChanged() {
    updateResultModeUi();
    try {
      localStorage.setItem(
        RESULT_MODE_STORAGE_KEY,
        toggle.checked ? "advanced" : "simple",
      );
    } catch (_error) {
      // Ignore storage write errors.
    }

    const eyeState = typeof updateOutput === "function" ? updateOutput() : null;
    updateAnalysisOutput(eyeState);
  }

  toggle.addEventListener("change", onModeChanged);
  toggle.addEventListener("input", onModeChanged);

  if (root) {
    root.querySelectorAll("[data-mode]").forEach((modeButton) => {
      modeButton.addEventListener("click", () => {
        const targetMode = modeButton.getAttribute("data-mode");
        const shouldBeAdvanced = targetMode === "advanced";
        if (toggle.checked === shouldBeAdvanced) return;
        toggle.checked = shouldBeAdvanced;
        onModeChanged();
      });
    });
  }

  toggle.dataset.initialized = "true";
  updateResultModeUi();
}

function applyTextRules(source, rules) {
  let output = String(source || "");
  rules.forEach(([pattern, replacement]) => {
    output = output.replace(pattern, replacement);
  });
  return output;
}

function stripHtml(value) {
  return String(value || "")
    .replace(/<[^>]*>/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function setResultSeverityClasses(analysisEl, siteEl, severity) {
  const className =
    severity === "normal"
      ? "status-normal"
      : severity === "urgent"
        ? "status-urgent"
        : "status-caution";
  [analysisEl, siteEl].forEach((el) => {
    if (!el) return;
    RESULT_STATUS_CLASSES.forEach((name) => el.classList.remove(name));
    el.classList.add(className);
  });
}

function detectResultSeverity(primaryCondition, lesionSiteText, modifiers) {
  const conditionText = stripHtml(primaryCondition).toLowerCase();
  const lesionText = String(lesionSiteText || "").toLowerCase();

  if (
    modifiers.neuroFlags === "yes" ||
    modifiers.onset === "sudden" ||
    modifiers.flashesCurtain === "yes"
  ) {
    return "urgent";
  }

  if (
    lesionText.includes("urgent") ||
    lesionText.includes("same-day") ||
    lesionText.includes("same day")
  ) {
    return "urgent";
  }

  if (conditionText.includes("full fields of vision")) {
    return "normal";
  }

  return "caution";
}

function toSimpleCondition(conditionHtml) {
  const rules =
    (window.OUTPUT_TEXT_RULES && window.OUTPUT_TEXT_RULES.simpleCondition) ||
    [];
  return applyTextRules(conditionHtml, rules);
}

function toSimpleLesion(lesionText) {
  const rules =
    (window.OUTPUT_TEXT_RULES && window.OUTPUT_TEXT_RULES.simpleLesion) || [];
  return applyTextRules(lesionText, rules);
}

function normalizeSentenceKey(sentence) {
  return String(sentence || "")
    .replace(/<[^>]*>/g, " ")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, " ")
    .trim();
}

function sentenceMentionsRetinaAndOpticNerve(sentence) {
  const key = normalizeSentenceKey(sentence);
  const hasRetina = key.includes("retina") || key.includes("retinal");
  const hasOpticNerve = key.includes("optic nerve");
  return hasRetina && hasOpticNerve;
}

function sentenceExpressesRetinaSource(sentence) {
  const key = normalizeSentenceKey(sentence);
  return (
    key.includes("retinal source") ||
    key.includes("likely retina") ||
    key.includes("retina optic nerve") ||
    key.includes("retina or optic nerve")
  );
}

function sentenceExpressesOpticNerveSource(sentence) {
  const key = normalizeSentenceKey(sentence);
  return (
    key.includes("optic nerve involvement") ||
    key.includes("likely optic nerve") ||
    key.includes("optic nerve problem") ||
    key.includes("retina optic nerve") ||
    key.includes("retina or optic nerve")
  );
}

function dedupeOutputSentences(text) {
  const fragments = String(text || "").match(/[^.!?]+[.!?]?/g);
  if (!fragments) return String(text || "").trim();

  const kept = [];
  const seenKeys = new Set();

  fragments.forEach((fragment) => {
    const sentence = fragment.trim();
    if (!sentence) return;

    const key = normalizeSentenceKey(sentence);
    if (!key || seenKeys.has(key)) return;

    const genericRetinaOptic =
      key === "retina or optic nerve" || key === "retina optic nerve";
    if (genericRetinaOptic && kept.some(sentenceMentionsRetinaAndOpticNerve)) {
      return;
    }

    if (
      /^more likely retina\b/i.test(sentence) &&
      kept.some(sentenceExpressesRetinaSource)
    ) {
      return;
    }

    if (
      /^more likely optic nerve\b/i.test(sentence) &&
      kept.some(sentenceExpressesOpticNerveSource)
    ) {
      return;
    }

    seenKeys.add(key);
    kept.push(sentence);
  });

  return kept
    .join(" ")
    .replace(/\s{2,}/g, " ")
    .trim();
}

function compactOutputWording(text) {
  let out = String(text || "").trim();
  if (!out) return "";

  out = out.replace(
    /(^|[.!?]\s+)Likely\s+([a-z])/g,
    (_match, prefix, firstLetter) => `${prefix}${firstLetter.toUpperCase()}`,
  );
  out = out.replace(/(^|[.!?]\s+)Likely\s+/g, "$1");
  out = out.replace(/\bOccipital likely\b/g, "Occipital");
  out = out.replace(/\boptic nerve likely\./gi, "optic nerve.");
  out = dedupeOutputSentences(out);
  out = out.replace(/\s{2,}/g, " ").trim();
  return out;
}

function resolveRapdStateForOutput(eyeState) {
  if (
    eyeState &&
    typeof eyeState === "object" &&
    typeof eyeState.rapd === "string"
  ) {
    return eyeState.rapd;
  }
  if (typeof getRapdState === "function") {
    return getRapdState();
  }
  return "none";
}

function resolveClinicalModifiersForOutput(eyeState) {
  const onset =
    eyeState && typeof eyeState.onset === "string"
      ? eyeState.onset
      : typeof getOnsetState === "function"
        ? getOnsetState()
        : "none";
  const neuroFlags =
    eyeState && typeof eyeState.neuroFlags === "string"
      ? eyeState.neuroFlags
      : typeof getNeuroFlagsState === "function"
        ? getNeuroFlagsState()
        : "no";
  const knownOldDefect =
    eyeState && typeof eyeState.knownOldDefect === "string"
      ? eyeState.knownOldDefect
      : typeof getKnownOldDefectState === "function"
        ? getKnownOldDefectState()
        : "no";
  const nightVisionPoor =
    eyeState && typeof eyeState.nightVisionPoor === "string"
      ? eyeState.nightVisionPoor
      : typeof getNightVisionPoorState === "function"
        ? getNightVisionPoorState()
        : "no";
  const flashesCurtain =
    eyeState && typeof eyeState.flashesCurtain === "string"
      ? eyeState.flashesCurtain
      : typeof getFlashesCurtainState === "function"
        ? getFlashesCurtainState()
        : "no";
  const colourFade =
    eyeState && typeof eyeState.colourFade === "string"
      ? eyeState.colourFade
      : typeof getColourFadeState === "function"
        ? getColourFadeState()
        : "no";

  return {
    onset: onset === "sudden" || onset === "gradual" ? onset : "none",
    neuroFlags: neuroFlags === "yes" ? "yes" : "no",
    knownOldDefect: knownOldDefect === "yes" ? "yes" : "no",
    nightVisionPoor: nightVisionPoor === "yes" ? "yes" : "no",
    flashesCurtain: flashesCurtain === "yes" ? "yes" : "no",
    colourFade: colourFade === "yes" ? "yes" : "no",
  };
}

function applyClinicalModifierNotes(
  baseText,
  modifiers,
  primaryCondition = "",
) {
  const text = String(baseText || "").trim();
  if (!text) return "";
  const conditionText = String(primaryCondition || "");
  const isTunnelVisionPattern = conditionText.includes("Tunnel Vision");
  const notes = [];

  if (modifiers.neuroFlags === "yes") {
    notes.push("Neuro red flags: urgent neuro review.");
  }
  if (modifiers.flashesCurtain === "yes") {
    notes.push("Flashes/curtain: urgent retina review.");
  }
  if (modifiers.onset === "sudden") {
    notes.push("Sudden onset: same-day review.");
  }
  if (isTunnelVisionPattern && modifiers.nightVisionPoor === "yes") {
    notes.push("Night vision poor: retinal degeneration possible.");
  }
  if (modifiers.colourFade === "yes") {
    notes.push("Colour fade: optic nerve.");
  }
  if (!isTunnelVisionPattern && modifiers.nightVisionPoor === "yes") {
    notes.push("Night vision poor: retinal degeneration possible.");
  }
  if (modifiers.onset === "gradual") {
    notes.push("Gradual onset: compare history.");
  }
  if (modifiers.knownOldDefect === "yes") {
    notes.push("Old known defect: compare old records.");
  }

  if (!notes.length) return text;
  const uniqueNotes = [...new Set(notes)].slice(0, 2);
  return `${text} ${uniqueNotes.join(" ")}`.trim();
}

function hasBilateralCentralSparing(inputState) {
  if (
    typeof resolveEyesForSummary !== "function" ||
    typeof codeToScore !== "function"
  ) {
    return false;
  }
  const eyes = resolveEyesForSummary(inputState);
  if (!eyes || !eyes.right || !eyes.left) return false;
  return codeToScore(eyes.right.c) === 0 && codeToScore(eyes.left.c) === 0;
}

function buildAdvancedLocationHint(
  primaryCondition,
  lesionSiteText,
  rapdState,
  inputState,
) {
  const conditionText = String(primaryCondition || "");
  const lesionText = String(lesionSiteText || "");

  const isHomonymousHemianopia = conditionText.includes(
    "Homonymous Hemianopia",
  );
  const isIncongruous = conditionText.includes("Incongruous");
  const isTractLikely =
    lesionText.includes("optic tract lesion") ||
    lesionText.includes("optic tract involvement");
  const hasPostChiasmalLanguage = lesionText.includes("post-chiasmal");
  const hasPosteriorLanguage =
    lesionText.includes("radiations/occipital") ||
    lesionText.includes("occipital") ||
    lesionText.includes("calcarine") ||
    lesionText.includes("Meyer") ||
    lesionText.includes("parietal");
  const centralSpared = hasBilateralCentralSparing(inputState);

  const tags = [];
  if (
    isHomonymousHemianopia &&
    !isIncongruous &&
    hasPostChiasmalLanguage &&
    !isTractLikely
  ) {
    if (centralSpared || hasPosteriorLanguage) {
      tags.push("Occipital");
    }
    if (rapdState === "none") {
      tags.push("LGN possible");
    }
  }

  if (!tags.length) return "";
  return `${tags.join("; ")}.`;
}

function buildAdvancedEtiologyHint(primaryCondition, modifiers = null) {
  const conditionText = String(primaryCondition || "");
  const flashesCurtain = modifiers && modifiers.flashesCurtain === "yes";
  const nightVisionPoor = modifiers && modifiers.nightVisionPoor === "yes";
  const colourFade = modifiers && modifiers.colourFade === "yes";
  if (flashesCurtain && isSingleEyePattern(conditionText)) {
    return "";
  }
  if (conditionText.includes("Tunnel Vision") && nightVisionPoor) {
    return "RP/retinal degeneration possible.";
  }
  if (
    conditionText.includes("Bitemporal Hemianopia") ||
    conditionText.includes("Bitemporal Quadrantanopia")
  ) {
    return "Pituitary/chiasmal mass possible.";
  }
  if (
    conditionText.includes("Homonymous Hemianopia") ||
    conditionText.includes("Homonymous Quadrantanopia")
  ) {
    return "Stroke possible.";
  }
  if (conditionText.includes("Glaucoma-like")) {
    if (flashesCurtain) {
      return "";
    }
    return "Glaucoma pattern possible.";
  }
  if (conditionText.includes("Monocular Central Scotoma") && colourFade) {
    return "Optic neuritis possible (including demyelination/MS).";
  }
  if (conditionText.includes("Cecocentral-like Defect") && colourFade) {
    return "Optic neuritis/toxic optic neuropathy possible.";
  }
  if (conditionText.includes("Monocular Blind Eye")) {
    return "Retina or optic-nerve cause possible.";
  }
  if (!conditionText.includes("Altitudinal")) return "";

  const isMonocular =
    conditionText.includes("Right ") || conditionText.includes("Left ");
  if (!isMonocular) return "";

  return "AION/NAION possible.";
}

function isAnteriorFamilyCondition(primaryCondition) {
  const text = String(primaryCondition || "");
  if (!text) return false;

  return (
    text.includes("Monocular Blind Eye") ||
    text.includes("Monocular Central Scotoma") ||
    text.includes("Monocular Temporal Hemianopia") ||
    text.includes("Monocular Nasal Hemianopia") ||
    text.includes("Monocular Cecocentral-like Defect") ||
    text.includes("Monocular Partial") ||
    text.includes("Monocular Large Defect") ||
    text.includes("Glaucoma-like") ||
    text.includes("Altitudinal")
  );
}

function isSingleEyePattern(primaryCondition) {
  const text = String(primaryCondition || "");
  if (!text) return false;

  if (
    text.includes("Homonymous") ||
    text.includes("Bitemporal") ||
    text.includes("Binasal") ||
    text.includes("Binocular") ||
    text.includes("Bilateral") ||
    text.includes("Junctional Scotoma") ||
    text.includes("Mixed/Unclassified")
  ) {
    return false;
  }

  if (text.includes("Monocular")) return true;
  if (
    text.includes("Glaucoma-like Changes (Right Eye)") ||
    text.includes("Glaucoma-like Changes (Left Eye)")
  ) {
    return true;
  }
  if (
    text.includes("Right Advanced Glaucoma (Tunnel Vision)") ||
    text.includes("Left Advanced Glaucoma (Tunnel Vision)")
  ) {
    return true;
  }
  if (
    text.includes("Right Superior Altitudinal") ||
    text.includes("Right Inferior Altitudinal") ||
    text.includes("Left Superior Altitudinal") ||
    text.includes("Left Inferior Altitudinal")
  ) {
    return true;
  }

  return false;
}

function isPosteriorFamilyCondition(primaryCondition) {
  const text = String(primaryCondition || "");
  if (!text) return false;

  if (text.includes("Homonymous Hemianopia")) return true;
  if (
    text.includes("Quadrantanopia") &&
    !text.includes("Monocular") &&
    !text.includes("Bitemporal")
  ) {
    return true;
  }
  return false;
}

function isChiasmalFamilyCondition(primaryCondition) {
  const text = String(primaryCondition || "");
  if (!text) return false;

  return (
    text.includes("Bitemporal") ||
    text.includes("Binasal") ||
    text.includes("Junctional Scotoma")
  );
}

function classifySourceAssessment(primaryCondition, rapdState, modifiers) {
  const conditionText = String(primaryCondition || "");
  const side = getConditionSide(conditionText);
  const unilateral = side === "left" || side === "right";
  const singleEyePattern = isSingleEyePattern(conditionText);
  const onset = modifiers && modifiers.onset ? modifiers.onset : "none";
  const nightVisionPoor = modifiers && modifiers.nightVisionPoor === "yes";
  const flashesCurtain = modifiers && modifiers.flashesCurtain === "yes";
  const colourFade = modifiers && modifiers.colourFade === "yes";

  if (isChiasmalFamilyCondition(conditionText)) {
    return {
      category: "chiasmal",
      side: "both",
      confidence: "high",
      text: "Likely at the chiasm.",
    };
  }

  if (isPosteriorFamilyCondition(conditionText)) {
    return {
      category: "posterior",
      side,
      confidence: "high",
      text: "Likely behind the chiasm.",
    };
  }

  if (singleEyePattern && flashesCurtain) {
    return {
      category: "retina_likely",
      side,
      confidence: onset === "sudden" ? "high" : "moderate",
      text:
        onset === "sudden"
          ? "More likely retina (sudden + flash/curtain)."
          : "More likely retina (flash/curtain).",
    };
  }

  if (conditionText.includes("Tunnel Vision")) {
    if (nightVisionPoor) {
      return {
        category: "retina_likely",
        side,
        confidence: "moderate",
        text: "More likely retina (night vision poor).",
      };
    }
    if (colourFade) {
      return {
        category: "optic_nerve_likely",
        side,
        confidence: "low",
        text: "More likely optic nerve (colour fade).",
      };
    }
  }

  if (!isAnteriorFamilyCondition(conditionText)) {
    return {
      category: "unknown",
      side,
      confidence: "low",
      text: "",
    };
  }

  if (conditionText.includes("Glaucoma-like")) {
    if (flashesCurtain) {
      return {
        category: "retina_likely",
        side,
        confidence: onset === "sudden" ? "high" : "moderate",
        text:
          onset === "sudden"
            ? "More likely retina (sudden + flash/curtain)."
            : "More likely retina (flash/curtain).",
      };
    }
    if (onset === "sudden" && rapdState === "none") {
      return {
        category: "retina_likely",
        side,
        confidence: "moderate",
        text: "More likely retina (sudden, no RAPD).",
      };
    }
    if (colourFade) {
      return {
        category: "optic_nerve_likely",
        side,
        confidence: "moderate",
        text: "More likely optic nerve (colour fade).",
      };
    }
    return {
      category: "optic_nerve_likely",
      side,
      confidence: "moderate",
      text: "More likely optic nerve.",
    };
  }

  if (unilateral && rapdMatchesConditionSide(side, rapdState)) {
    return {
      category: "optic_nerve_likely",
      side,
      confidence: "high",
      text: "More likely optic nerve (RAPD match).",
    };
  }

  if (
    unilateral &&
    isUnilateralRapd(rapdState) &&
    !rapdMatchesConditionSide(side, rapdState)
  ) {
    return {
      category: "anterior_mixed",
      side,
      confidence: "low",
      text: "RAPD side mismatch: retina or optic nerve.",
    };
  }

  const unilateralAnteriorPattern =
    conditionText.includes("Monocular Blind Eye") ||
    conditionText.includes("Monocular Partial") ||
    conditionText.includes("Monocular Large Defect") ||
    conditionText.includes("Monocular Temporal Hemianopia") ||
    conditionText.includes("Monocular Nasal Hemianopia") ||
    conditionText.includes("Monocular Central Scotoma") ||
    conditionText.includes("Monocular Cecocentral-like Defect");
  if (unilateral && unilateralAnteriorPattern && flashesCurtain) {
    return {
      category: "retina_likely",
      side,
      confidence: "high",
      text: "More likely retina (flash/curtain).",
    };
  }

  if (unilateral && unilateralAnteriorPattern && colourFade) {
    return {
      category: "optic_nerve_likely",
      side,
      confidence: "moderate",
      text: "More likely optic nerve (colour fade).",
    };
  }

  const suddenMonocularPattern =
    unilateral &&
    onset === "sudden" &&
    (conditionText.includes("Monocular Blind Eye") ||
      conditionText.includes("Monocular Partial") ||
      conditionText.includes("Monocular Large Defect") ||
      conditionText.includes("Monocular Temporal Hemianopia") ||
      conditionText.includes("Monocular Nasal Hemianopia"));
  if (suddenMonocularPattern && rapdState === "none") {
    return {
      category: "retina_likely",
      side,
      confidence: "moderate",
      text: "More likely retina (sudden, no RAPD).",
    };
  }

  return {
    category: "anterior_mixed",
    side,
    confidence: "low",
    text: "Retina or optic nerve.",
  };
}

function buildAdvancedSourceHint(primaryCondition, rapdState, modifiers) {
  return classifySourceAssessment(primaryCondition, rapdState, modifiers).text;
}

function isQuadrantDrivenPrimary(conditionText) {
  const cond = String(conditionText || "");
  if (!cond) return false;

  if (
    cond.includes("Central Scotoma") ||
    cond.includes("Cecocentral-like") ||
    cond.includes("Monocular Blind Eye") ||
    cond.includes("Binocular Blindness")
  ) {
    return false;
  }

  return (
    cond.includes("Hemianopia") ||
    cond.includes("Quadrantanopia") ||
    cond.includes("Altitudinal") ||
    cond.includes("Tunnel Vision") ||
    cond.includes("Glaucoma-like")
  );
}

function buildCentralQualifierNote(primaryCondition, inputState) {
  if (!isQuadrantDrivenPrimary(primaryCondition)) return "";
  if (typeof resolveEyesForSummary !== "function") return "";

  const eyes = resolveEyesForSummary(inputState);
  if (!eyes || !eyes.right || !eyes.left) return "";

  const rightCenter = codeToScore(eyes.right.c);
  const leftCenter = codeToScore(eyes.left.c);

  if (rightCenter === 0 && leftCenter === 0) return "";
  if (rightCenter > 0 && leftCenter > 0) {
    return "Central points reduced: family based on quadrants; re-check centre.";
  }
  return "One central point reduced: family based on quadrants; re-check centre.";
}

function rapdSupportsTractLocalization(conditionText, rapdState) {
  if (rapdState !== "left" && rapdState !== "right") return false;
  if (conditionText.includes("Left Homonymous Hemianopia"))
    return rapdState === "left";
  if (conditionText.includes("Right Homonymous Hemianopia"))
    return rapdState === "right";
  return false;
}

function isUnilateralRapd(rapdState) {
  return rapdState === "left" || rapdState === "right";
}

function getConditionSide(conditionText) {
  const hasRight = conditionText.includes("Right");
  const hasLeft = conditionText.includes("Left");
  if (hasRight && !hasLeft) return "right";
  if (hasLeft && !hasRight) return "left";
  if (hasLeft && hasRight) return "both";
  return "both";
}

function rapdMatchesConditionSide(conditionSide, rapdState) {
  if (!isUnilateralRapd(rapdState)) return false;
  if (conditionSide !== "left" && conditionSide !== "right") return false;
  return conditionSide === rapdState;
}

function applyAnteriorRapdModifier(
  baseText,
  conditionText,
  rapdState,
  options = {},
) {
  if (!isUnilateralRapd(rapdState)) return baseText;

  const conditionSide = getConditionSide(conditionText);
  if (conditionSide !== "left" && conditionSide !== "right") return baseText;

  if (rapdMatchesConditionSide(conditionSide, rapdState)) {
    const severeTriageSuffix =
      options && options.severeMonocular
        ? " High-confidence anterior pattern; urgent referral."
        : "";
    return `${baseText} RAPD supports optic nerve involvement.${severeTriageSuffix}`;
  }
  return `${baseText} RAPD side does not match field pattern; re-check.`;
}

function applyBilateralRapdConsistencyNote(baseText, rapdState) {
  if (!isUnilateralRapd(rapdState)) return baseText;
  return `${baseText} RAPD is unilateral with this bilateral/chiasmal pattern; possible mixed lesion or test inconsistency.`;
}

function getPrimaryLevelWord(primaryCondition) {
  const match = String(primaryCondition || "").match(/<em>([^<]+)<\/em>/i);
  return match && match[1] ? match[1] : "Probable";
}

function buildRetinaPriorityCondition(conditionHtml, mode) {
  const primary = String(conditionHtml || "").split("<br")[0];
  const levelWord = getPrimaryLevelWord(primary);
  const side = getConditionSide(stripHtml(primary));
  const sideLabel =
    side === "right" ? "Right eye" : side === "left" ? "Left eye" : "One eye";
  const patternRaw = mode === "simple" ? toSimpleCondition(primary) : primary;
  const patternText = stripHtml(patternRaw);
  return `<em>${levelWord}</em> <strong>${sideLabel} retinal detachment</strong><br><small>Pattern: ${patternText}</small>`;
}

function updateAnalysisOutput(eyeState) {
  initResultCalcToggle();
  initResultModeToggle();
  updateResultModeUi();

  const outEl = document.getElementById("output");
  const analysisEl = document.getElementById("analysis-output");
  const siteEl = document.getElementById("analysis-site");
  if (!analysisEl || !siteEl || !outEl) return;

  let inputState = eyeState || outEl.textContent || outEl.innerText;
  let condition = summarizeCondition(inputState);

  // Startup hardening: if parsing from text fails, recalculate from live controls.
  if (
    condition === "Condition not identified" &&
    typeof updateOutput === "function"
  ) {
    inputState = updateOutput();
    condition = summarizeCondition(inputState);
  }
  if (condition === "Condition not identified") {
    condition = "<em>Normal</em> <strong>Full Fields of Vision</strong>";
  }

  const primaryCondition = String(condition).split("<br")[0];
  const rapdState = resolveRapdStateForOutput(eyeState);
  const baseLesionSiteText = mapConditionToLesion(primaryCondition, rapdState);
  const clinicalModifiers = resolveClinicalModifiersForOutput(eyeState);
  const sourceAssessment = classifySourceAssessment(
    primaryCondition,
    rapdState,
    clinicalModifiers,
  );
  let lesionSeedText = baseLesionSiteText;
  if (
    sourceAssessment.category === "retina_likely" &&
    isSingleEyePattern(primaryCondition)
  ) {
    lesionSeedText = "Likely retinal source.";
  }
  let lesionSiteText = applyClinicalModifierNotes(
    lesionSeedText,
    clinicalModifiers,
    primaryCondition,
  );
  const centralQualifier = buildCentralQualifierNote(
    primaryCondition,
    inputState,
  );
  if (centralQualifier) {
    lesionSiteText = `${lesionSiteText} ${centralQualifier}`;
  }
  const mode = getResultLanguageMode();
  const retinaPriorityHeadline =
    clinicalModifiers.flashesCurtain === "yes" &&
    sourceAssessment.category === "retina_likely" &&
    isSingleEyePattern(primaryCondition);
  let conditionForDisplay =
    mode === "simple" ? toSimpleCondition(condition) : condition;
  if (retinaPriorityHeadline) {
    conditionForDisplay = buildRetinaPriorityCondition(condition, mode);
  }
  const advancedLocationHint =
    mode === "advanced"
      ? buildAdvancedLocationHint(
          primaryCondition,
          lesionSiteText,
          rapdState,
          inputState,
        )
      : "";
  const advancedEtiologyHint =
    mode === "advanced"
      ? buildAdvancedEtiologyHint(primaryCondition, clinicalModifiers)
      : "";
  const advancedSourceHint =
    mode === "advanced"
      ? buildAdvancedSourceHint(primaryCondition, rapdState, clinicalModifiers)
      : "";
  const baseLesionForDisplay =
    mode === "simple" ? toSimpleLesion(lesionSiteText) : lesionSiteText;
  const includeAdvancedSourceHint =
    mode === "advanced" &&
    !retinaPriorityHeadline &&
    (sourceAssessment.category === "anterior_mixed" ||
      sourceAssessment.category === "unknown");
  const advancedHints = [
    advancedLocationHint,
    advancedEtiologyHint,
    includeAdvancedSourceHint ? advancedSourceHint : "",
  ]
    .filter(Boolean)
    .join(" ");
  const lesionForDisplayRaw = advancedHints
    ? `${baseLesionForDisplay} ${advancedHints}`.trim()
    : baseLesionForDisplay;
  const lesionForDisplay = compactOutputWording(lesionForDisplayRaw);
  const severity = detectResultSeverity(
    primaryCondition,
    lesionSiteText,
    clinicalModifiers,
  );

  analysisEl.innerHTML = conditionForDisplay;
  siteEl.innerHTML = lesionForDisplay;
  setResultSeverityClasses(analysisEl, siteEl, severity);
  if (typeof updatePathwayDiagram === "function") {
    updatePathwayDiagram(
      primaryCondition,
      lesionSiteText,
      rapdState,
      sourceAssessment,
    );
  }
}

function mapConditionToLesion(cond, rapdState = "none") {
  const globalScope = typeof window !== "undefined" ? window : globalThis;
  const core = globalScope.mapConditionToLesionCore;
  if (typeof core === "function") {
    return core(cond, rapdState);
  }
  return "";
}
