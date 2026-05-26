import {
  MODE_LABELS,
  SYSTEMIC_CHECKS,
  getAreaLabel,
  getFindingLabels,
  getVaLabel,
} from "./findings.js?v=20260518-findingdropdown";

function formatFindings(eye) {
  const labels = getFindingLabels(eye.findings);
  return labels.length > 0 ? labels.join(", ") : "none";
}

function formatSystemicChecks(state) {
  const labelFor = {
    bp: "BP",
    lipids: "lipids",
    hba1c: "HbA1c",
  };
  const checked = SYSTEMIC_CHECKS.filter(
    (check) => state.systemicChecks[check.key],
  ).map(
    (check) => labelFor[check.key] || check.label.replace(/\s+checked$/i, ""),
  );
  return checked.length > 0 ? checked.join(", ") : "none recorded";
}

function formatEyeLine(label, eye, mode) {
  const parts = [
    `VA ${getVaLabel(eye.distanceVA)}`,
    `view ${eye.viewQuality || "not recorded"}`,
    `findings: ${formatFindings(eye)}`,
  ];
  const area = getAreaLabel(mode, eye.areaSeen);
  if (area !== "Not recorded") {
    parts.splice(2, 0, area);
  }
  return `${label}: ${parts.join("; ")}.`;
}

export function buildReferralNote(state, triage) {
  const lines = [];

  lines.push(`Diabetic retinal triage: ${triage.title}.`);
  lines.push(
    `Mode: ${MODE_LABELS[state.mode]}. Dilated: ${state.dilation || "not recorded"}.`,
  );
  lines.push(formatEyeLine("RE", state.eyes.right, state.mode));
  lines.push(formatEyeLine("LE", state.eyes.left, state.mode));
  const reasonParts = [...triage.reasons, ...triage.limitations];
  if (reasonParts.length > 0) {
    lines.push(`Reason: ${reasonParts.join(" ")}`);
  }
  lines.push(`Plan: ${triage.next}`);
  lines.push(`Systemic: ${formatSystemicChecks(state)}.`);
  lines.push("Screening still required.");

  return lines.join("\n");
}
