/*
 * Squint analysis engine
 * Converts RE/LE simulator output text into concise clinical interpretation.
 */

const AnalysisCoreRef = globalThis.AnalysisCore;
if (!AnalysisCoreRef) {
  throw new Error("AnalysisCore module missing");
}

function splitTokens(content) {
  return AnalysisCoreRef.splitTokens(content);
}

const TRANSFORM_IGNORED_EXACT = new Set([
  "sudden",
  "pain",
  "trauma",
  "fatigable",
  "diplopia",
]);
const TRANSFORM_IGNORED_PREFIX = [
  "hint:",
  "headtilt:",
  "cyclo:",
  "nyst:",
  "reflex",
  "iris",
  "light:",
  "rapd:",
];
const SEVERE_VERTICAL_UP = ["med up", "medium up", "large up"];
const SEVERE_VERTICAL_DOWN = ["med down", "medium down", "large down"];
const ANALYSIS_REFRESH_MS = 500;

function startsWithAny(text, prefixes) {
  return prefixes.some((prefix) => text.startsWith(prefix));
}

function includesAny(text, parts) {
  return parts.some((part) => text.includes(part));
}

function shouldIgnoreTransformToken(token) {
  return (
    TRANSFORM_IGNORED_EXACT.has(token) ||
    startsWithAny(token, TRANSFORM_IGNORED_PREFIX)
  );
}

function transformOutput(text, prefix) {
  const colonIndex = String(text || "").indexOf(":");
  if (colonIndex === -1) return `${prefix}: nil`;

  const content = String(text)
    .substring(colonIndex + 1)
    .trim()
    .toLowerCase();
  if (!content || content === "neutral" || content === "normal") {
    return `${prefix}: nil`;
  }

  const diagnoses = [];
  const tokens = splitTokens(content);

  tokens.forEach((token) => {
    if (shouldIgnoreTransformToken(token)) return;

    let grade = "";
    if (token.startsWith("small")) grade = "Small";
    else if (token.startsWith("medium") || token.startsWith("med"))
      grade = "Medium";
    else if (token.startsWith("large")) grade = "Large";

    if (token.includes(" in") && !token.includes("out")) {
      diagnoses.push(`${grade} Esotropia`.trim());
      return;
    }
    if (token.includes(" out")) {
      diagnoses.push(`${grade} Exotropia`.trim());
      return;
    }
    if (token.includes(" up")) {
      diagnoses.push(`${grade} Hypertropia`.trim());
      return;
    }
    if (token.includes(" down")) {
      diagnoses.push(`${grade} Hypotropia`.trim());
      return;
    }
    if (token.includes("ptosis")) {
      if (grade === "Small") diagnoses.push("Slight ptosis");
      else diagnoses.push(`${grade} ptosis`.trim());
      return;
    }
    if (token.includes("dilated pupil")) {
      diagnoses.push("Dilated pupil");
      return;
    }
    if (token.includes("pinhole pupil")) {
      diagnoses.push("Pinhole pupil");
      return;
    }
    if (token.includes("larger pupil")) {
      diagnoses.push("Larger pupil");
      return;
    }
    if (token.includes("smaller pupil")) {
      diagnoses.push("Smaller pupil");
      return;
    }
    if (token === "faded") diagnoses.push("Faded iris");
  });

  const unique = [...new Set(diagnoses)];
  return `${prefix}: ${unique.length ? unique.join(", ") : "nil"}`;
}

function getHintCondition(content) {
  return AnalysisCoreRef.getHintCondition(content);
}

function determineCondition(text) {
  const content = String(text || "").toLowerCase();
  if (
    !content ||
    content.includes("nil") ||
    content.includes("neutral") ||
    content.includes("normal")
  ) {
    return "";
  }

  const hintCondition = getHintCondition(content);
  if (hintCondition) return hintCondition;

  const hasPtosis = content.includes("ptosis") || content.includes("lid");
  const hasSudden = content.includes("sudden");
  const hasPain = content.includes("pain");
  const hasLargePupil =
    content.includes("larger pupil") || content.includes("dilated pupil");

  const hasMedOrLargePtosis =
    content.includes("med ptosis") || content.includes("large ptosis");

  let horizontal = null;
  if (content.includes(" in") && !content.includes("out")) horizontal = "eso";
  else if (content.includes(" out")) horizontal = "exo";

  let vertical = null;
  if (content.includes(" up")) vertical = "hyper";
  else if (content.includes(" down")) vertical = "hypo";

  if (
    vertical === "hypo" &&
    horizontal === "exo" &&
    !content.includes(" in ")
  ) {
    let info = "; classic down-and-out pattern";
    if (hasSudden && hasPain) {
      info =
        "; sudden diplopia + pain - <span style='color:red;'>urgent aneurysm exclusion</span>";
    } else if (hasSudden) {
      info =
        "; sudden diplopia - <span style='color:red;'>urgent aneurysm exclusion</span>";
    } else if (hasPain) {
      info =
        "; painful diplopia - <span style='color:red;'>urgent aneurysm exclusion</span>";
    }
    if (!hasPtosis)
      return `<span style='color:red;'>possible 3rd nerve palsy</span>${info}`;
    if (hasLargePupil && hasMedOrLargePtosis)
      return `<span style='color:red;'>definite 3rd nerve palsy</span>${info}`;
    return `<span style='color:red;'>probable 3rd nerve palsy</span>${info}`;
  }

  if (vertical === "hyper" && horizontal === "exo") {
    const info = "; vertical diplopia/head-tilt pattern";
    if (content.includes("small up")) return `possible 4th nerve palsy${info}`;
    if (content.includes("med up") || content.includes("medium up"))
      return `probable 4th nerve palsy${info}`;
    if (content.includes("large up")) return `definite 4th nerve palsy${info}`;
    return `4th nerve palsy${info}`;
  }

  if (
    horizontal === "eso" &&
    !includesAny(content, SEVERE_VERTICAL_UP) &&
    !includesAny(content, SEVERE_VERTICAL_DOWN)
  ) {
    const isAcute = hasSudden || hasPain;
    const info = isAcute
      ? "; acute horizontal diplopia - <span style='color:red;'>raised ICP/SOL</span> possible"
      : "; abduction-deficit pattern";
    if (content.includes("small in"))
      return `<span style='color:red;'>possible 6th nerve palsy</span>${info}`;
    if (content.includes("med in") || content.includes("medium in"))
      return `<span style='color:red;'>probable 6th nerve palsy</span>${info}`;
    if (content.includes("large in"))
      return `<span style='color:red;'>definite 6th nerve palsy</span>${info}`;
    return `<span style='color:red;'>6th nerve palsy</span>${info}`;
  }

  if (content.includes("smaller pupil")) {
    const info = "; carotid/stroke/apical lung causes; correlate clinically";
    if (hasPtosis && content.includes("faded")) return `definite Horner${info}`;
    if (hasPtosis) return `probable Horner${info}`;
    return `possible Horner${info}`;
  }

  if (horizontal && vertical)
    return `Mixed ${horizontal.toUpperCase()} & ${vertical.toUpperCase()}`;
  if (horizontal) return horizontal.toUpperCase();
  if (vertical) return vertical.toUpperCase();
  if (hasPtosis) return "Ptosis pattern";
  return "";
}

function getPupilScore(text) {
  return AnalysisCoreRef.getPupilScore(text);
}

function determinePupilCondition(rightText, leftText) {
  const rText = String(rightText || "").toLowerCase();
  const lText = String(leftText || "").toLowerCase();

  if (rText.includes("pinhole pupil") && lText.includes("pinhole pupil")) {
    return "Bilateral pinhole - <i>likely age/drug related</i>";
  }
  if (rText.includes("pinhole pupil")) {
    return "Right pinhole pupil - <i>severe miosis; consider drug, Horner or ocular cause</i>";
  }
  if (lText.includes("pinhole pupil")) {
    return "Left pinhole pupil - <i>severe miosis; consider drug, Horner or ocular cause</i>";
  }
  if (rText.includes("dilated pupil") && lText.includes("dilated pupil")) {
    return "Bilateral dilated - <i>consider drugs or trauma</i>";
  }

  const scoreRight = getPupilScore(rText);
  const scoreLeft = getPupilScore(lText);
  if (scoreRight < 0 && scoreLeft < 0) {
    return "Bilateral small pupils - <i>consider physiological/drug causes</i>";
  }
  if (scoreRight === scoreLeft) return "";

  const diff = Math.abs(scoreRight - scoreLeft);
  if (diff === 1) {
    return "Small asymmetry - <i>benign anisocoria likely</i>";
  }
  if (scoreRight <= -1 && scoreLeft >= 0) {
    return "Right smaller pupil - <i>possible Horner/drug effect</i>";
  }
  if (scoreLeft <= -1 && scoreRight >= 0) {
    return "Left smaller pupil - <i>possible Horner/drug effect</i>";
  }
  if (scoreRight > scoreLeft) {
    return "Right larger pupil - <i>possible Adie's/3rd nerve pattern</i>";
  }
  if (scoreLeft > scoreRight) {
    return "Left larger pupil - <i>possible Adie's/3rd nerve pattern</i>";
  }
  return "";
}

function extractModifierState(rightText, leftText) {
  return AnalysisCoreRef.extractModifierState(rightText, leftText);
}

function buildModifierSummary(modifiers) {
  return AnalysisCoreRef.buildModifierSummary(modifiers);
}

function buildModifierGuidance(modifiers, conditionRight, conditionLeft) {
  return AnalysisCoreRef.buildModifierGuidance(
    modifiers,
    conditionRight,
    conditionLeft,
  );
}

function formatGazeDirectionLabel(value) {
  const key = String(value || "primary").toLowerCase();
  if (key === "up-left") return "Up-left";
  if (key === "up-right") return "Up-right";
  if (key === "down-left") return "Down-left";
  if (key === "down-right") return "Down-right";
  if (key === "up") return "Up";
  if (key === "down") return "Down";
  if (key === "left") return "Left";
  if (key === "right") return "Right";
  return "Primary";
}

let lastAnalysisHTML = "";
let lastPalsyCueKey = "";

function createPalsyCueIcon(className) {
  const icon = document.createElement("span");
  icon.className = className;
  icon.setAttribute("aria-hidden", "true");
  return icon;
}

function createContactCueIcon() {
  const ns = "http://www.w3.org/2000/svg";
  const icon = document.createElement("span");
  icon.className = "palsy-contact-icon";
  icon.setAttribute("aria-hidden", "true");

  const svg = document.createElementNS(ns, "svg");
  svg.setAttribute("viewBox", "0 0 48 34");
  svg.setAttribute("focusable", "false");

  const phone = document.createElementNS(ns, "path");
  phone.setAttribute(
    "d",
    "M15.2 30.8C9.5 28.3 5 23.8 2.5 18.1c-.5-1.1-.2-2.4.7-3.2l4-3.6c.9-.8 2.3-.7 3.1.2l3.2 3.6c.7.8.8 1.9.2 2.8l-1.3 1.9c1.3 2 3 3.7 5.1 5.1l1.9-1.3c.9-.6 2-.5 2.8.2l3.6 3.2c.9.8 1 2.2.2 3.1l-3.6 4c-.8.9-2.1 1.2-3.2.7-1.4-.6-2.7-1.2-4-2z",
  );

  const bubble = document.createElementNS(ns, "path");
  bubble.setAttribute(
    "d",
    "M29 4c8.7 0 15 4.1 15 9.7s-6.3 9.7-15 9.7c-1.5 0-2.9-.1-4.2-.4l-5.1 3.1 1.3-4.5c-4.2-1.7-7-4.6-7-7.9C14 8.1 20.3 4 29 4z",
  );

  const dotA = document.createElementNS(ns, "circle");
  dotA.setAttribute("cx", "25");
  dotA.setAttribute("cy", "14");
  dotA.setAttribute("r", "1.7");
  dotA.setAttribute("fill", "#ffffff");

  const dotB = document.createElementNS(ns, "circle");
  dotB.setAttribute("cx", "31");
  dotB.setAttribute("cy", "14");
  dotB.setAttribute("r", "1.7");
  dotB.setAttribute("fill", "#ffffff");

  const dotC = document.createElementNS(ns, "circle");
  dotC.setAttribute("cx", "37");
  dotC.setAttribute("cy", "14");
  dotC.setAttribute("r", "1.7");
  dotC.setAttribute("fill", "#ffffff");

  svg.append(phone, bubble, dotA, dotB, dotC);
  icon.appendChild(svg);
  return icon;
}

function createPalsyCue(cueKey) {
  const cue = document.createElement("div");
  cue.className = `palsy-cue palsy-cue-${cueKey}`;
  cue.setAttribute("role", "img");

  const label = document.createElement("span");
  label.className = "palsy-nerve-badge";

  if (cueKey === "3rd") {
    cue.setAttribute("aria-label", "3rd nerve palsy urgent review cue");
    label.textContent = "3rd";
    cue.append(
      createPalsyCueIcon("palsy-warning-icon"),
      label,
      createContactCueIcon(),
    );
  } else if (cueKey === "6th") {
    cue.setAttribute("aria-label", "6th nerve palsy urgent review cue");
    label.textContent = "6th";
    cue.append(
      createPalsyCueIcon("palsy-warning-icon"),
      label,
      createContactCueIcon(),
    );
  } else if (cueKey === "4th") {
    cue.setAttribute("aria-label", "4th nerve palsy cue");
    label.textContent = "4th";
    cue.appendChild(label);
  }

  return cue;
}

function updateAnalysisOutput() {
  const rightOutputElement = document.getElementById("right-output");
  const leftOutputElement = document.getElementById("left-output");
  const analysisTextElement = document.getElementById("analysis-output");
  const palsyImgContainer = document.getElementById("palsy-img-container");
  const rawOutputLineElement = document.getElementById("raw-output-line");
  if (!rightOutputElement || !leftOutputElement || !analysisTextElement) return;

  const rightText = rightOutputElement.innerText;
  const leftText = leftOutputElement.innerText;
  if (rawOutputLineElement)
    rawOutputLineElement.textContent = `${rightText} | ${leftText}`;

  const conditionRight = determineCondition(rightText);
  const conditionLeft = determineCondition(leftText);
  const clinicalRight = transformOutput(rightText, "RE");
  const clinicalLeft = transformOutput(leftText, "LE");
  const modifiers = extractModifierState(rightText, leftText);

  const scoreRight = getPupilScore(rightText);
  const scoreLeft = getPupilScore(leftText);
  const isReCovered = rightText.toLowerCase().includes("covered");
  const isLeCovered = leftText.toLowerCase().includes("covered");

  let finalConditionRight = conditionRight;
  let finalConditionLeft = conditionLeft;
  if (
    conditionRight.toLowerCase().includes("horner") &&
    conditionLeft.toLowerCase().includes("horner")
  ) {
    if (scoreRight === scoreLeft) {
      finalConditionRight = "";
      finalConditionLeft = "";
    } else if (Math.abs(scoreRight - scoreLeft) === 1) {
      if (scoreRight < scoreLeft) finalConditionLeft = "";
      else finalConditionRight = "";
    }
  }

  const pupilCondition = determinePupilCondition(rightText, leftText);

  const patternParts = [];
  if (finalConditionRight) patternParts.push(`RE: ${finalConditionRight}`);
  if (finalConditionLeft) patternParts.push(`LE: ${finalConditionLeft}`);

  const fallbackPattern = `${clinicalRight.replace("RE: ", "")} | ${clinicalLeft.replace("LE: ", "")}`;
  const patternHTML = patternParts.length
    ? patternParts.join(" / ")
    : fallbackPattern;

  const hasThird = [finalConditionRight, finalConditionLeft]
    .map((val) => String(val || "").toLowerCase())
    .some((val) => val.includes("3rd nerve palsy"));

  const modifierSummary = buildModifierSummary(modifiers);
  const modifierGuidance = buildModifierGuidance(
    modifiers,
    finalConditionRight,
    finalConditionLeft,
  );
  const gazeDirection = globalThis.AppState?.state?.gazeDirection || "primary";
  const gazeCue = globalThis.AppState?.state?.gazePatternCue || "";

  const notes = [];
  if (pupilCondition && !hasThird) notes.push(pupilCondition);
  if (gazeDirection !== "primary")
    notes.push(`Gaze: ${formatGazeDirectionLabel(gazeDirection)}`);
  if (gazeCue) notes.push(gazeCue);
  if (isReCovered || isLeCovered)
    notes.push(`Cover test: ${isReCovered ? "RE" : "LE"} covered`);
  if (!modifierGuidance && modifierSummary)
    notes.push(`Modifiers: ${modifierSummary}`);
  if (modifierGuidance) notes.push(modifierGuidance);
  if (!notes.length) notes.push("No high-risk modifiers flagged.");

  const outputHTML = `<strong>Pattern:</strong> ${patternHTML}<br><strong>Notes:</strong> ${notes.join(" ")}`;

  if (lastAnalysisHTML !== outputHTML) {
    analysisTextElement.innerHTML = outputHTML;
    lastAnalysisHTML = outputHTML;
  }

  const fullConditionText =
    `${finalConditionRight} ${finalConditionLeft}`.toLowerCase();
  let palsyCueKey = "";
  if (fullConditionText.includes("3rd nerve palsy")) {
    palsyCueKey = "3rd";
  } else if (fullConditionText.includes("4th nerve palsy")) {
    palsyCueKey = "4th";
  } else if (fullConditionText.includes("6th nerve palsy")) {
    palsyCueKey = "6th";
  }

  if (palsyImgContainer && lastPalsyCueKey !== palsyCueKey) {
    palsyImgContainer.replaceChildren();
    if (palsyCueKey) palsyImgContainer.appendChild(createPalsyCue(palsyCueKey));
    lastPalsyCueKey = palsyCueKey;
  }
}

document.addEventListener("DOMContentLoaded", () => {
  updateAnalysisOutput();
  document.addEventListener("squint:outputs-updated", updateAnalysisOutput);
  setInterval(updateAnalysisOutput, ANALYSIS_REFRESH_MS);
});
