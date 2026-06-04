/******************************************************
 * state.js
 *
 * Button cycle:
 * seen -> suspect -> absent
 *
 * Field codes used by the engine:
 * R = normal/seen, ? = suspect/partial, W = absent/definite loss
 ******************************************************/

const APP_GLOBAL = typeof window !== "undefined" ? window : globalThis;
const FIELD_CORE = APP_GLOBAL.FIELD_CORE || {};

const createDefaultEyeState =
  FIELD_CORE.createDefaultEyeState ||
  function fallbackDefaultEyeState() {
    return { st: "R", sn: "R", it: "R", in: "R", c: "R" };
  };
const toDisplaySymbol =
  FIELD_CORE.codeToDisplaySymbol ||
  function fallbackDisplaySymbol(code) {
    if (code === "?") return "?";
    if (code === "W") return "X";
    return "+";
  };
const toScore =
  FIELD_CORE.codeToScore ||
  function fallbackCodeToScore(code) {
    if (code === "W") return 2;
    if (code === "?") return 1;
    return 0;
  };
const eyeIsNormal =
  FIELD_CORE.isEyeNormal ||
  function fallbackIsEyeNormal(eye) {
    return (
      eye.st === "R" &&
      eye.sn === "R" &&
      eye.it === "R" &&
      eye.in === "R" &&
      eye.c === "R"
    );
  };
const classifyFive =
  FIELD_CORE.classifyFiveSum ||
  function fallbackClassifyFiveSum(sum) {
    if (sum === 5) return "Possible";
    if (sum === 10) return "Definite";
    return "Probable";
  };

if (typeof APP_GLOBAL.codeToDisplaySymbol !== "function")
  APP_GLOBAL.codeToDisplaySymbol = toDisplaySymbol;
if (typeof APP_GLOBAL.codeToScore !== "function")
  APP_GLOBAL.codeToScore = toScore;
if (typeof APP_GLOBAL.isEyeNormal !== "function")
  APP_GLOBAL.isEyeNormal = eyeIsNormal;
if (typeof APP_GLOBAL.classifyFiveSum !== "function")
  APP_GLOBAL.classifyFiveSum = classifyFive;

const BUTTON_STATES = [
  {
    key: "seen",
    bg: "#f4fbf6",
    iconColor: "#166534",
    symbol: "+",
    code: "R",
    glyph: "\u2713",
  },
  {
    key: "suspect",
    bg: "#fff7e8",
    iconColor: "#a15c00",
    symbol: "?",
    code: "?",
    glyph: "?",
  },
  {
    key: "absent",
    bg: "#fff1f2",
    iconColor: "#b91c1c",
    symbol: "X",
    code: "W",
    glyph: "\u00D7",
  },
];
const RAPD_STATES = ["left", "none", "right"];
const ONSET_STATES = ["none", "gradual", "sudden"];
const BINARY_STATES = ["no", "yes"];
const FIELD_SEGMENT_SHADES = {
  seen: "#eef1ef",
  suspect: "#858d98",
  absent: "#080b0f",
};
const CONTEXT_MODIFIER_LABELS = {
  gradual: "Gradual",
  sudden: "Sudden",
  neuroFlags: "Stroke/HA",
  knownOldDefect: "Old known",
  nightVisionPoor: "Night vision",
  flashesCurtain: "Flash/curtain",
  colourFade: "Colour fade",
};
let sectionLocksEnabled = true;

function getStateIndexByKey(key) {
  const idx = BUTTON_STATES.findIndex((state) => state.key === key);
  return idx >= 0 ? idx : 0;
}

function getStateIndexFromButton(button) {
  if (button?.dataset?.state) {
    return getStateIndexByKey(button.dataset.state);
  }

  const bg = (button.style.backgroundColor || "").toLowerCase();
  if (bg.startsWith("p")) return 1;
  if (bg.startsWith("w")) return 2;
  return 0;
}

function applyButtonState(button, stateIndex) {
  const state = BUTTON_STATES[stateIndex] || BUTTON_STATES[0];
  button.dataset.state = state.key;
  button.style.backgroundColor = state.bg;

  const iconEl = button.querySelector("i");
  if (!iconEl) return;

  iconEl.textContent = state.glyph;
  iconEl.style.color = state.iconColor;
}

function getSegmentShadeFromButton(button) {
  const idx = getStateIndexFromButton(button);
  const state = BUTTON_STATES[idx] || BUTTON_STATES[0];
  return FIELD_SEGMENT_SHADES[state.key] || FIELD_SEGMENT_SHADES.seen;
}

function applyEyeFieldShading(eyeId) {
  const eye = document.getElementById(eyeId);
  if (!eye) return;

  const shades = {
    st: FIELD_SEGMENT_SHADES.seen,
    sn: FIELD_SEGMENT_SHADES.seen,
    it: FIELD_SEGMENT_SHADES.seen,
    in: FIELD_SEGMENT_SHADES.seen,
    c: FIELD_SEGMENT_SHADES.seen,
  };

  eye.querySelectorAll(".color-button").forEach((button) => {
    const pos = button.getAttribute("data-position");
    if (!Object.prototype.hasOwnProperty.call(shades, pos)) return;
    shades[pos] = getSegmentShadeFromButton(button);
  });

  if (eyeId === "right-eye") {
    eye.style.setProperty("--shade-top-left", shades.st);
    eye.style.setProperty("--shade-top-right", shades.sn);
    eye.style.setProperty("--shade-bottom-left", shades.it);
    eye.style.setProperty("--shade-bottom-right", shades.in);
  } else {
    eye.style.setProperty("--shade-top-left", shades.sn);
    eye.style.setProperty("--shade-top-right", shades.st);
    eye.style.setProperty("--shade-bottom-left", shades.in);
    eye.style.setProperty("--shade-bottom-right", shades.it);
  }

  const maculaCircle = eye.querySelector(".macula-circle");
  if (maculaCircle) {
    maculaCircle.style.backgroundColor = shades.c;
  }
}

function cycleColor(button) {
  const currentIndex = getStateIndexFromButton(button);
  const nextIndex = (currentIndex + 1) % BUTTON_STATES.length;
  applyButtonState(button, nextIndex);

  const eyeState = updateOutput();
  updateAnalysisOutput(eyeState);
}

function getEyeState(eyeId) {
  const eye = document.getElementById(eyeId);
  const result = createDefaultEyeState();
  if (!eye) return result;

  eye.querySelectorAll(".color-button").forEach((button) => {
    const pos = button.getAttribute("data-position");
    const idx = getStateIndexFromButton(button);
    const state = BUTTON_STATES[idx] || BUTTON_STATES[0];
    if (Object.prototype.hasOwnProperty.call(result, pos)) {
      result[pos] = state.code;
    }
  });

  return result;
}

function eyeToOutputString(label, eye) {
  const order = ["st", "sn", "it", "in", "c"];
  const body = order
    .map((pos) => `${pos}${toDisplaySymbol(eye[pos])}`)
    .join(", ");
  return `${label}: ${body}`;
}

function rapdToOutputToken(rapd) {
  if (rapd === "left") return "L+";
  if (rapd === "right") return "R+";
  return "0";
}

function onsetToOutputLabel(onset) {
  if (onset === "sudden") return "S";
  if (onset === "gradual") return "G";
  return "";
}

function getRapdState() {
  const switchEl = document.getElementById("rapd-switch");
  const rapdFromSwitch = switchEl?.getAttribute("data-rapd");
  const activeButton = document.querySelector(".rapd-segment.is-active");
  const rapd =
    rapdFromSwitch || activeButton?.getAttribute("data-rapd") || "none";
  return RAPD_STATES.includes(rapd) ? rapd : "none";
}

function setRapdState(nextState) {
  const rapd = RAPD_STATES.includes(nextState) ? nextState : "none";
  const switchEl = document.getElementById("rapd-switch");
  if (switchEl) {
    switchEl.setAttribute("data-rapd", rapd);
  }
  document.querySelectorAll(".rapd-segment").forEach((button) => {
    const isActive = button.getAttribute("data-rapd") === rapd;
    button.classList.toggle("is-active", isActive);
    button.setAttribute("aria-checked", isActive ? "true" : "false");
  });
  return rapd;
}

function getOnsetState() {
  const switchEl = document.getElementById("onset-switch");
  const onset = switchEl?.getAttribute("data-onset") || "none";
  return ONSET_STATES.includes(onset) ? onset : "none";
}

function setOnsetState(nextState) {
  const onset = ONSET_STATES.includes(nextState) ? nextState : "none";
  const switchEl = document.getElementById("onset-switch");
  if (switchEl) {
    switchEl.setAttribute("data-onset", onset);
  }
  document
    .querySelectorAll("#onset-switch .modifier-option[data-onset]")
    .forEach((button) => {
      const isActive =
        onset !== "none" && button.getAttribute("data-onset") === onset;
      button.classList.toggle("is-active", isActive);
      button.setAttribute("aria-pressed", isActive ? "true" : "false");
    });
  const row = switchEl?.closest(".modifier-row");
  if (row) {
    row.classList.toggle("modifier-row-has-active", onset !== "none");
  }
  renderContextSummary();
  return onset;
}

function getBinaryModifierState(switchId) {
  const switchEl = document.getElementById(switchId);
  const active = switchEl?.querySelector(".modifier-option.is-active");
  const value = active?.getAttribute("data-value") || "no";
  return BINARY_STATES.includes(value) ? value : "no";
}

function setBinaryModifierState(switchId, nextState) {
  const value = BINARY_STATES.includes(nextState) ? nextState : "no";
  const switchEl = document.getElementById(switchId);
  if (!switchEl) return value;

  switchEl
    .querySelectorAll(".modifier-option[data-value]")
    .forEach((button) => {
      const isActive = button.getAttribute("data-value") === value;
      button.classList.toggle("is-active", isActive);
      button.setAttribute("aria-pressed", isActive ? "true" : "false");
    });
  const row = switchEl.closest(".modifier-row");
  if (row) {
    row.classList.toggle("modifier-row-has-active", value === "yes");
  }
  renderContextSummary();
  return value;
}

function setModifierRowAlertClass(switchId, alertClassName, isActive) {
  const switchEl = document.getElementById(switchId);
  const row = switchEl?.closest(".modifier-row");
  if (!row) return;
  row.classList.toggle(alertClassName, Boolean(isActive));
}

function getNeuroFlagsState() {
  return getBinaryModifierState("neuro-flags-switch");
}

function setNeuroFlagsState(nextState) {
  const value = setBinaryModifierState("neuro-flags-switch", nextState);
  setModifierRowAlertClass(
    "neuro-flags-switch",
    "modifier-row-neuro-active",
    value === "yes",
  );
  return value;
}

function getKnownOldDefectState() {
  return getBinaryModifierState("old-defect-switch");
}

function setKnownOldDefectState(nextState) {
  const value = setBinaryModifierState("old-defect-switch", nextState);
  setModifierRowAlertClass(
    "old-defect-switch",
    "modifier-row-old-active",
    value === "yes",
  );
  return value;
}

function getNightVisionPoorState() {
  return getBinaryModifierState("night-vision-switch");
}

function setNightVisionPoorState(nextState) {
  const value = setBinaryModifierState("night-vision-switch", nextState);
  setModifierRowAlertClass(
    "night-vision-switch",
    "modifier-row-night-active",
    value === "yes",
  );
  return value;
}

function getFlashesCurtainState() {
  return getBinaryModifierState("flashes-curtain-switch");
}

function setFlashesCurtainState(nextState) {
  const value = setBinaryModifierState("flashes-curtain-switch", nextState);
  setModifierRowAlertClass(
    "flashes-curtain-switch",
    "modifier-row-retina-active",
    value === "yes",
  );
  return value;
}

function getColourFadeState() {
  return getBinaryModifierState("colour-fade-switch");
}

function setColourFadeState(nextState) {
  const value = setBinaryModifierState("colour-fade-switch", nextState);
  setModifierRowAlertClass(
    "colour-fade-switch",
    "modifier-row-colour-active",
    value === "yes",
  );
  return value;
}

function getSelectedContextLabels() {
  const labels = [];
  const onset = getOnsetState();

  if (onset === "gradual") {
    labels.push(CONTEXT_MODIFIER_LABELS.gradual);
  } else if (onset === "sudden") {
    labels.push(CONTEXT_MODIFIER_LABELS.sudden);
  }
  if (getNeuroFlagsState() === "yes") {
    labels.push(CONTEXT_MODIFIER_LABELS.neuroFlags);
  }
  if (getFlashesCurtainState() === "yes") {
    labels.push(CONTEXT_MODIFIER_LABELS.flashesCurtain);
  }
  if (getColourFadeState() === "yes") {
    labels.push(CONTEXT_MODIFIER_LABELS.colourFade);
  }
  if (getNightVisionPoorState() === "yes") {
    labels.push(CONTEXT_MODIFIER_LABELS.nightVisionPoor);
  }
  if (getKnownOldDefectState() === "yes") {
    labels.push(CONTEXT_MODIFIER_LABELS.knownOldDefect);
  }

  return labels;
}

function renderContextSummary() {
  const summaryEl = document.getElementById("context-summary-text");
  const contextCard = document.querySelector(".context-card");
  if (!summaryEl) return [];

  const labels = getSelectedContextLabels();
  summaryEl.replaceChildren();

  if (!labels.length) {
    summaryEl.textContent = "None selected";
  } else {
    labels.forEach((label) => {
      const chip = document.createElement("span");
      chip.className = "context-chip";
      chip.textContent = label;
      summaryEl.appendChild(chip);
    });
  }

  if (contextCard) {
    contextCard.classList.toggle("context-has-active", labels.length > 0);
  }

  return labels;
}

function hasAnyHistoryModifierSelected() {
  return (
    getOnsetState() !== "none" ||
    getNeuroFlagsState() === "yes" ||
    getKnownOldDefectState() === "yes" ||
    getNightVisionPoorState() === "yes" ||
    getFlashesCurtainState() === "yes" ||
    getColourFadeState() === "yes"
  );
}

function hasAnyFieldInputChanged() {
  const right = getEyeState("right-eye");
  const left = getEyeState("left-eye");
  return !eyeIsNormal(right) || !eyeIsNormal(left);
}

function setLockStateForPanel(panelId, isLocked) {
  const panel = document.getElementById(panelId);
  if (!panel) return;

  panel.classList.toggle("is-locked", Boolean(isLocked));
  panel.setAttribute("aria-disabled", isLocked ? "true" : "false");
}

function setSectionLocksEnabled(enabled) {
  sectionLocksEnabled = Boolean(enabled);

  if (!sectionLocksEnabled) {
    setLockStateForPanel("field-entry-panel", false);
    setLockStateForPanel("result-panel", false);
    setLockStateForPanel("pathway-panel", false);
    return sectionLocksEnabled;
  }

  updateSectionLocks();
  return sectionLocksEnabled;
}

function updateSectionLocks() {
  if (!sectionLocksEnabled) {
    setLockStateForPanel("field-entry-panel", false);
    setLockStateForPanel("result-panel", false);
    setLockStateForPanel("pathway-panel", false);
    return;
  }

  const hasFieldInput = hasAnyFieldInputChanged();

  setLockStateForPanel("field-entry-panel", false);
  setLockStateForPanel("result-panel", false);

  const pathwayLocked = !hasFieldInput;
  setLockStateForPanel("pathway-panel", pathwayLocked);
}

function updateOutput() {
  const outputEl = document.getElementById("output");
  const right = getEyeState("right-eye");
  const left = getEyeState("left-eye");
  const rapd = getRapdState();
  const rapdToken = rapdToOutputToken(rapd);
  const onset = getOnsetState();
  const onsetLabel = onsetToOutputLabel(onset);
  const neuroFlags = getNeuroFlagsState();
  const knownOldDefect = getKnownOldDefectState();
  const nightVisionPoor = getNightVisionPoorState();
  const flashesCurtain = getFlashesCurtainState();
  const colourFade = getColourFadeState();

  applyEyeFieldShading("right-eye");
  applyEyeFieldShading("left-eye");
  renderContextSummary();

  if (outputEl) {
    const tokens = [
      eyeToOutputString("R", right),
      eyeToOutputString("L", left),
    ];
    if (rapdToken !== "0") {
      tokens.push(`RAPD: ${rapdToken}`);
    }
    if (onsetLabel) {
      tokens.push(`O: ${onsetLabel}`);
    }
    if (neuroFlags === "yes") {
      tokens.push("N: Y");
    }
    if (knownOldDefect === "yes") {
      tokens.push("K: Y");
    }
    if (nightVisionPoor === "yes") {
      tokens.push("NV: Y");
    }
    if (flashesCurtain === "yes") {
      tokens.push("FC: Y");
    }
    if (colourFade === "yes") {
      tokens.push("CF: Y");
    }
    outputEl.innerText = tokens.join(" | ");
  }

  updateSectionLocks();

  return {
    right,
    left,
    rapd,
    onset,
    neuroFlags,
    knownOldDefect,
    nightVisionPoor,
    flashesCurtain,
    colourFade,
  };
}
