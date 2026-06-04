import {
  EYE_LABELS,
  FINDING_MAP,
  MACULA_KEYS,
  NPDR_KEYS,
  PDR_KEYS,
  getAreaLabel,
  getFindingLabels,
  getVaLabel,
} from "./findings.js?v=20260518-findingdropdown";

const PRIORITY = {
  incomplete: 0,
  routineScreen: 1,
  ungradable: 2,
  routineReferral: 3,
  referSoon: 4,
  urgent: 5,
};

const ACTION_COPY = {
  incomplete: {
    title: "Record both eyes",
    next: "Complete R/L VA, view and findings.",
    tone: "neutral",
  },
  routineScreen: {
    title: "Routine screening still required",
    next: "Continue local screening pathway.",
    tone: "green",
  },
  ungradable: {
    title: "Ungradable",
    next: "Repeat dilated view/photo; refer if still poor.",
    tone: "orange",
  },
  routineReferral: {
    title: "Routine referral when possible",
    next: "Refer routinely when possible.",
    tone: "blue",
  },
  referSoon: {
    title: "Refer soon (2 weeks)",
    next: "Refer within 2 weeks.",
    tone: "orange",
  },
  urgent: {
    title: "Urgent (today)",
    next: "Same-day eye referral.",
    tone: "red",
  },
};

const REDUCED_VA_VALUES = new Set(["6/36", "6/60", "HM", "fix_follow_poor"]);
const NO_TEST_VALUES = new Set(["unable_test"]);
const MILD_VA_VALUES = new Set(["6/12", "fix_follow_good"]);

function selectedKeys(findings, keys) {
  return keys.filter((key) => Boolean(findings[key]));
}

function formatFindings(keys) {
  return keys
    .map((key) => FINDING_MAP[key]?.shortLabel || FINDING_MAP[key]?.label)
    .filter(Boolean);
}

export function getVaRisk(value) {
  if (REDUCED_VA_VALUES.has(value)) {
    return "reduced";
  }
  if (NO_TEST_VALUES.has(value)) {
    return "untestable";
  }
  if (MILD_VA_VALUES.has(value)) {
    return "mild";
  }
  return "none";
}

function isViewAdequate(eye) {
  return (
    eye.viewQuality === "clear" && eye.areaSeen && eye.areaSeen !== "limited"
  );
}

function isViewLimited(eye) {
  return (
    eye.viewQuality === "ungradable" ||
    eye.viewQuality === "partial" ||
    eye.viewQuality === "hazy" ||
    eye.areaSeen === "limited"
  );
}

function hasAnyRecordedEyeData(eye) {
  return Boolean(
    eye.distanceVA ||
    eye.viewQuality ||
    eye.areaSeen ||
    Object.values(eye.findings).some(Boolean),
  );
}

export function evaluateEye(eyeKey, eye, state) {
  const eyeLabel = EYE_LABELS[eyeKey];
  const findings = eye.findings;
  const pdrKeys = selectedKeys(findings, PDR_KEYS);
  const maculaKeys = selectedKeys(findings, MACULA_KEYS);
  const npdrKeys = selectedKeys(findings, NPDR_KEYS);
  const lesionKeys = [...pdrKeys, ...maculaKeys, ...npdrKeys];
  const hasDrContext = lesionKeys.length > 0;
  const vaRisk = getVaRisk(eye.distanceVA);
  const hasQualifyingVaRisk = vaRisk === "reduced" || vaRisk === "untestable";
  const hasMaculaRisk =
    maculaKeys.length > 0 || (hasQualifyingVaRisk && hasDrContext);
  const viewLimited = isViewLimited(eye);
  const viewAdequate = isViewAdequate(eye);
  const recorded = hasAnyRecordedEyeData(eye);

  const base = {
    eyeKey,
    eyeLabel,
    viewAdequate,
    viewLimited,
    selectedFindings: getFindingLabels(findings),
    vaRisk,
    priority: PRIORITY.incomplete,
    actionKey: "incomplete",
    reasons: [],
    limitations: [],
    summary: "Not recorded",
  };

  if (pdrKeys.length > 0) {
    return {
      ...base,
      priority: PRIORITY.urgent,
      actionKey: "urgent",
      reasons: formatFindings(pdrKeys),
      limitations: viewLimited ? ["limited view"] : [],
      summary: "Urgent",
    };
  }

  if (hasMaculaRisk) {
    const reasons = formatFindings(maculaKeys);
    if (hasQualifyingVaRisk) {
      reasons.push(`${getVaLabel(eye.distanceVA)} VA`);
    }
    return {
      ...base,
      priority: PRIORITY.referSoon,
      actionKey: "referSoon",
      reasons,
      limitations: viewLimited ? ["limited view"] : [],
      summary: "Refer soon",
    };
  }

  if (npdrKeys.length > 0) {
    return {
      ...base,
      priority: PRIORITY.routineReferral,
      actionKey: "routineReferral",
      reasons: formatFindings(npdrKeys),
      limitations: viewLimited ? ["limited view"] : [],
      summary: "Routine referral",
    };
  }

  if (viewLimited) {
    return {
      ...base,
      priority: PRIORITY.ungradable,
      actionKey: "ungradable",
      reasons: [
        eye.viewQuality === "ungradable" ? "Ungradable view" : "Limited view",
      ],
      limitations: ["not reassuring"],
      summary: "Ungradable",
    };
  }

  if (hasQualifyingVaRisk) {
    return {
      ...base,
      priority: PRIORITY.routineReferral,
      actionKey: "routineReferral",
      reasons: [`${getVaLabel(eye.distanceVA)} VA without DR signs`],
      summary: "Review VA",
    };
  }

  if (viewAdequate && findings.noReferableSignsSeen) {
    return {
      ...base,
      priority: PRIORITY.routineScreen,
      actionKey: "routineScreen",
      reasons: ["No signs in view"],
      summary: "No referable signs",
    };
  }

  if (recorded) {
    return {
      ...base,
      reasons: ["Select no signs or DR findings"],
      summary: "Incomplete",
    };
  }

  return base;
}

function compareEyeResults(a, b) {
  if (a.priority !== b.priority) {
    return b.priority - a.priority;
  }
  if (a.eyeKey === "right") return -1;
  if (b.eyeKey === "right") return 1;
  return 0;
}

function buildDilationNotes(state) {
  const notes = [];
  if (state.dilation === "no") {
    notes.push("Not dilated.");
  }
  if (!state.dilation) {
    notes.push("Dilation not recorded.");
  }
  if (state.mode === "holo-bio" && state.dilation !== "yes") {
    notes.push("Holo view limited without dilation.");
  }
  return notes;
}

function buildSystemicSummary(state) {
  const checked = [];
  const unchecked = [];
  Object.entries(state.systemicChecks).forEach(([key, value]) => {
    const label = key === "hba1c" ? "HbA1c" : key === "bp" ? "BP" : "lipids";
    if (value) {
      checked.push(label);
    } else {
      unchecked.push(label);
    }
  });
  return { checked, unchecked };
}

export function evaluateTriage(state) {
  const eyeResults = Object.entries(state.eyes).map(([eyeKey, eye]) =>
    evaluateEye(eyeKey, eye, state),
  );
  const sortedEyes = [...eyeResults].sort(compareEyeResults);
  const topEye = sortedEyes[0];
  const copy = ACTION_COPY[topEye.actionKey];
  const dilationNotes = buildDilationNotes(state);
  const systemic = buildSystemicSummary(state);
  const incompleteEyes = eyeResults.filter(
    (result) => result.actionKey === "incomplete",
  );
  const limitationEyes = eyeResults.filter(
    (result) => result.viewLimited && result.priority < PRIORITY.urgent,
  );
  const reasons = [];
  const limitations = [];

  if (topEye.priority === PRIORITY.incomplete) {
    reasons.push("R/L recording incomplete.");
  } else if (topEye.priority === PRIORITY.routineScreen) {
    const allRoutine = eyeResults.every(
      (result) => result.actionKey === "routineScreen",
    );
    if (allRoutine) {
      reasons.push(
        "Both eyes have adequate views and no referable signs selected.",
      );
    } else {
      const limitedEye = eyeResults.find(
        (result) => result.viewLimited || result.actionKey === "incomplete",
      );
      if (limitedEye) {
        return evaluateWithForcedUngradable(
          state,
          eyeResults,
          dilationNotes,
          systemic,
        );
      }
    }
  } else {
    const grouped = sortedEyes.filter(
      (result) =>
        result.priority === topEye.priority &&
        result.priority > PRIORITY.incomplete,
    );
    grouped.forEach((result) => {
      reasons.push(
        `${result.eyeLabel}: ${result.reasons.join(", ") || ACTION_COPY[result.actionKey].title}.`,
      );
    });
  }

  limitationEyes
    .filter((result) => result.priority < topEye.priority)
    .forEach((result) =>
      limitations.push(
        `${result.eyeLabel}: ${result.limitations.join(", ") || "limited view"}.`,
      ),
    );

  incompleteEyes
    .filter((result) => topEye.priority > PRIORITY.incomplete)
    .forEach((result) => limitations.push(`${result.eyeLabel}: incomplete.`));

  dilationNotes.forEach((note) => limitations.push(note));

  const safety = ["Screening required. View only."];

  if (systemic.unchecked.length > 0) {
    safety.push("Medical review if possible.");
  }

  return {
    actionKey: topEye.actionKey,
    priority: topEye.priority,
    title: copy.title,
    tone: copy.tone,
    reasons,
    limitations,
    next: copy.next,
    safety,
    systemic,
    eyes: eyeResults,
  };
}

function evaluateWithForcedUngradable(
  state,
  eyeResults,
  dilationNotes,
  systemic,
) {
  const copy = ACTION_COPY.ungradable;
  const limitations = [];
  eyeResults
    .filter((result) => result.viewLimited || result.actionKey === "incomplete")
    .forEach((result) =>
      limitations.push(
        `${result.eyeLabel}: ${result.reasons.join(", ") || "not assessable"}.`,
      ),
    );
  dilationNotes.forEach((note) => limitations.push(note));
  return {
    actionKey: "ungradable",
    priority: PRIORITY.ungradable,
    title: copy.title,
    tone: copy.tone,
    reasons: ["One eye not assessable."],
    limitations,
    next: copy.next,
    safety: [
      "Repeat dilated view/photo if possible.",
      "Screening still required.",
    ],
    systemic,
    eyes: eyeResults,
  };
}

export function getSummaryForEye(eyeResult) {
  return eyeResult.summary;
}

export function describeEyeState(mode, eye) {
  return {
    va: getVaLabel(eye.distanceVA),
    view: eye.viewQuality || "Not recorded",
    area: getAreaLabel(mode, eye.areaSeen),
  };
}
