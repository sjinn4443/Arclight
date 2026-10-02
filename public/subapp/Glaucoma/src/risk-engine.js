import {
  CD_RATIO_COL_MAP,
  DEFAULT_DISC_SIZE,
  GRID_CELL_COLOURS,
  IOP_ROW_MAP,
  PALPATION_TO_IOP_MAP,
  PROVISIONAL_URGENCY_PREFIX,
  RISK_FACTOR_POINT,
  RISK_FACTOR_VALUES,
  ROCK_PALPATION_WARNING,
  TOGGLE_ROW_SHIFT_THRESHOLD,
  URGENCY_BY_COLOUR,
  VISION_POINTS,
} from "./risk-config.js";
import { clamp } from "./dom-utils.js";

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

  if (discSize === "Large" && colNum < 4) {
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

export function canCalculateRisk({
  iop,
  palpation,
  cupDiscRatio,
  thinRim,
  suspiciousFields,
  suspiciousPupils,
  vision,
}) {
  const hasValidIop = isValidIopBand(iop);
  const hasValidPalpation = isValidPalpation(palpation);
  const hasValidCupDiscRatio = isValidCupDiscRatio(cupDiscRatio);

  if (!hasValidIop && palpation === "rock" && hasValidPalpation) {
    return true;
  }

  const pressure = resolvePressureInput({ iop, palpation });
  if (
    thinRim ||
    suspiciousFields ||
    suspiciousPupils ||
    (VISION_POINTS[vision] ?? 0) > 0 ||
    cupDiscRatio === "0.9-1" ||
    ["25-29", "gte30"].includes(pressure.iopBand)
  )
    return true;

  return Boolean((hasValidIop || hasValidPalpation) && hasValidCupDiscRatio);
}

export function calculateRiskOutcome({
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
    reasoningDetails.push("IOP ≥30: +3");
  } else if (pressure.iopBand === "25-29") {
    riskScore += 2;
    reasoningDetails.push("IOP 25-29: +2");
  } else if (pressure.iopBand === "21-24") {
    riskScore += 1;
    reasoningDetails.push("IOP 21-24: +1");
  }

  if (suspiciousFields) {
    riskScore += 1;
    reasoningDetails.push("Suspect Fields: +1");
  }

  if (suspiciousPupils) {
    riskScore += 0.5;
    reasoningDetails.push("Suspect Pupils: +0.5");
  }

  const visionPoints = VISION_POINTS[vision] ?? 0;
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
    ? (IOP_ROW_MAP[pressure.iopBand] ?? null)
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
  let urgency = URGENCY_BY_COLOUR[cellColour] ?? URGENCY_BY_COLOUR.white;
  const cellId = rowNum && colNum ? `cell_r${rowNum}_c${colNum}` : null;
  const hasGridPlacement = rowNum !== null && colNum !== null;
  const isRockAcuteWarning = pressure.isProvisional && palpation === "rock";
  const isEndStage = validCupDiscRatio === "0.9-1";
  const hasReferralRedFlag = thinRim || suspiciousFields;
  const hasReferralFloor =
    hasReferralRedFlag && (cellColour === "white" || cellColour === "green");
  if (hasReferralFloor) {
    urgency = URGENCY_BY_COLOUR.orange;
    reasoningDetails.push(
      "Referral floor applied: suspicious rim or field finding",
    );
  }
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

  // A missing grid axis must not hide an independently concerning finding.
  if (!isRockAcuteWarning && !hasGridPlacement) {
    if (hasReferralRedFlag || ["25-29", "gte30"].includes(pressure.iopBand)) {
      urgencyMessage = `${pressure.isProvisional ? PROVISIONAL_URGENCY_PREFIX : ""}${URGENCY_BY_COLOUR.orange.message}`;
      urgencyTextColour = URGENCY_BY_COLOUR.orange.textColour;
    } else if (!pressure.iopBand && !pressure.hasInvalidInput) {
      urgencyMessage = "INCOMPLETE: Record pressure and C/D where available";
    }
  }
  // Structural status persists independently of pressure and referral urgency.
  if (isEndStage) {
    if (isRockAcuteWarning || cellColour === "red") {
      urgencyMessage += " · END-STAGE: Assess fellow eye";
    } else {
      urgencyMessage = `${pressure.isProvisional ? PROVISIONAL_URGENCY_PREFIX : ""}${URGENCY_BY_COLOUR.darkgrey.message}`;
      urgencyTextColour = URGENCY_BY_COLOUR.darkgrey.textColour;
    }
  }
  const hasOtherConcern = suspiciousPupils || visionPoints > 0;
  if (hasOtherConcern) {
    const cue =
      "Assess reduced vision or abnormal pupils; cause may not be glaucoma.";
    if (
      !isRockAcuteWarning &&
      !isEndStage &&
      ((!hasGridPlacement &&
        !hasReferralRedFlag &&
        !["25-29", "gte30"].includes(pressure.iopBand)) ||
        (hasGridPlacement &&
          !hasReferralFloor &&
          ["white", "green"].includes(cellColour)))
    ) {
      urgencyMessage = `CHECK: ${cue}`;
      urgencyTextColour = "orange";
    } else {
      urgencyMessage += ` · ${cue}`;
    }
  }
  const gridNote = !hasGridPlacement
    ? "Grid incomplete — advice uses available findings."
    : hasReferralFloor ||
        (hasOtherConcern && ["white", "green"].includes(cellColour))
      ? "Grid position shown; additional findings override routine advice."
      : "";

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
    hasReferralFloor,
    isEndStage,
    gridNote,
    pressureSource,
    resolvedIopBand: pressure.iopBand,
    togglePoints: roundScore(togglePoints),
    cupDiscRatio: validCupDiscRatio,
    discSize: safeDiscSize,
  };
}

export function buildReasoningHtml({
  eye = null,
  cupDiscRatio,
  discSize,
  reasoningDetails,
  riskFactorStrings,
  riskScore,
  gridNote = "",
}) {
  const parts = [];

  if (eye) {
    parts.push(`Eye: ${escapeHtml(eye)}`);
  }

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
  return `${gridNote ? `${escapeHtml(gridNote)}<br>` : ""}${head}; Supporting points (C/D shown on chart): <b>${formatScore(riskScore)}</b>`;
}
