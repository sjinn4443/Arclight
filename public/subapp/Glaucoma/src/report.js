const IOP_LABELS = {
  lte20: "\u226420 mmHg",
  "21-24": "21-24 mmHg",
  "25-29": "25-29 mmHg",
  gte30: "\u226530 mmHg",
};

const PALPATION_LABELS = {
  normal: "Normal by palpation (provisional, no tonometer)",
  firm: "Firm by palpation (provisional, no tonometer)",
  rock: "Rock-hard by palpation (emergency warning)",
};

function formatBritishDate(date) {
  return `${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()}`;
}

function formatAdditionalFindings(inputs) {
  const findings = [];
  if (inputs.thinRim) findings.push("Thin/notched rim or related disc sign");
  if (inputs.suspiciousFields) findings.push("Suspicious fields");
  if (inputs.suspiciousPupils) findings.push("Suspicious pupils");
  return findings.length > 0 ? findings.join("; ") : "None marked";
}

function formatPressure(inputs) {
  if (inputs.iop && IOP_LABELS[inputs.iop]) {
    return `Measured IOP ${IOP_LABELS[inputs.iop]}`;
  }
  if (inputs.palpation && PALPATION_LABELS[inputs.palpation]) {
    return PALPATION_LABELS[inputs.palpation];
  }
  return "Not recorded";
}

export function buildGlaucomaReport({ inputs, outcome, date = new Date() }) {
  if (!inputs || !outcome?.urgencyMessage) {
    return "";
  }

  const riskFactors =
    Array.isArray(inputs.riskFactors) && inputs.riskFactors.length > 0
      ? inputs.riskFactors.join("; ")
      : "None recorded";

  return [
    `Glaucoma report - ${formatBritishDate(date)}`,
    `Eye: ${inputs.eye || "Not recorded"}`,
    `Pressure: ${formatPressure(inputs)}`,
    `C/D ratio: ${inputs.cupDiscRatio || "Not recorded"}`,
    `Disc size: ${outcome.discSize || inputs.discSize || "Not recorded"}`,
    `Additional findings: ${formatAdditionalFindings(inputs)}`,
    `VA: ${inputs.vision || "Not recorded"}`,
    `Risk factors: ${riskFactors}`,
    "",
    `Output: ${outcome.urgencyMessage}`,
    ...(outcome.gridNote ? [outcome.gridNote] : []),
    `Supporting points (C/D shown on chart): ${outcome.riskScore}`,
    "",
    "Based only on the findings entered. Teaching and triage support, not a diagnosis.",
    "Painful red eye with sudden visual loss: emergency assessment. Do not use routine grid timescales.",
  ].join("\n");
}
