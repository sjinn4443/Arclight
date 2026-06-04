import {
  EYE_LABELS,
  MODE_LABELS,
  SYSTEMIC_CHECKS,
  getAreaLabel,
  getFindingLabels,
  getVaLabel,
} from "./findings.js?v=20260518-findingdropdown";

function formatFindings(eye) {
  const labels = getFindingLabels(eye.findings);
  return labels.length > 0 ? labels.join(", ") : "none recorded";
}

function formatSystemicChecks(state) {
  return SYSTEMIC_CHECKS.map((check) => {
    const status = state.systemicChecks[check.key] ? "checked" : "not checked";
    return `- ${check.label}: ${status}`;
  });
}

export function buildReferralNote(state, triage) {
  const lines = [];

  lines.push("Diabetic retinal triage - Diabetic app");
  lines.push("");
  lines.push(`Equipment: ${MODE_LABELS[state.mode]}`);
  lines.push(`Dilation: ${state.dilation || "not recorded"}`);
  lines.push("");

  Object.entries(state.eyes).forEach(([eyeKey, eye]) => {
    lines.push(`${EYE_LABELS[eyeKey]}:`);
    lines.push(`- Distance VA: ${getVaLabel(eye.distanceVA)}`);
    lines.push(`- View quality: ${eye.viewQuality || "not recorded"}`);
    lines.push(`- Area seen: ${getAreaLabel(state.mode, eye.areaSeen)}`);
    lines.push(`- Findings selected: ${formatFindings(eye)}`);
    lines.push("");
  });

  lines.push("Systemic checks:");
  lines.push(...formatSystemicChecks(state));
  lines.push("");
  lines.push("Action:");
  lines.push(triage.title);
  lines.push("");
  lines.push("Reason:");
  if (triage.reasons.length > 0) {
    triage.reasons.forEach((reason) => lines.push(`- ${reason}`));
  } else {
    lines.push("- none recorded");
  }
  if (triage.limitations.length > 0) {
    lines.push("");
    lines.push("Limitations:");
    triage.limitations.forEach((note) => lines.push(`- ${note}`));
  }
  lines.push("");
  lines.push("Next step:");
  lines.push(triage.next);
  lines.push("");
  lines.push("Medical review:");
  lines.push(
    "Arrange diabetes/medical review when possible if routine diabetes care is not available.",
  );
  lines.push("");
  lines.push("Comment:");
  lines.push(
    "No signs seen only applies to the view obtained. Routine diabetic eye screening remains required.",
  );

  return lines.join("\n");
}
