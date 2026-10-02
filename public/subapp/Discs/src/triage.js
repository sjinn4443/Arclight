import {
  CONTEXT_KEYS,
  EYE_LABELS,
  FINDING_MAP,
  GLAUCOMA_HIGH_KEYS,
  MACULA_KEYS,
  NPDR_KEYS,
  URGENT_KEYS,
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
  fastGlaucoma: 5,
  urgent: 6,
};

const ACTION_COPY = {
  incomplete: {
    title: "Record both eyes",
    next: "Complete R/L VA, view and findings.",
    tone: "neutral",
  },
  routineScreen: {
    title: "Routine disc check",
    next: "Continue local review pathway.",
    tone: "green",
  },
  ungradable: {
    title: "Ungradable (repeat)",
    next: "Repeat dilated view/photo. Refer if still poor.",
    tone: "orange",
  },
  routineReferral: {
    title: "Routine review",
    next: "Refer routinely when possible.",
    tone: "green",
  },
  referSoon: {
    title: "Soon",
    next: "Specialist review soon; escalate if acute symptoms, pupil or field concern.",
    tone: "orange",
  },
  fastGlaucoma: {
    title: "Fast glaucoma review",
    next: "Arrange rapid glaucoma or eye review.",
    tone: "red",
  },
  urgent: {
    title: "Urgent",
    next: "Same-day or rapid eye referral.",
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
  const urgentKeys = selectedKeys(findings, URGENT_KEYS);
  const glaucomaHighKeys = selectedKeys(findings, GLAUCOMA_HIGH_KEYS);
  const maculaKeys = selectedKeys(findings, MACULA_KEYS);
  const npdrKeys = selectedKeys(findings, NPDR_KEYS);
  const contextKeys = selectedKeys(findings, CONTEXT_KEYS);
  const lesionKeys = [
    ...urgentKeys,
    ...glaucomaHighKeys,
    ...maculaKeys,
    ...npdrKeys,
  ];
  const hasDiscFindingContext = lesionKeys.length > 0;
  const vaRisk = getVaRisk(eye.distanceVA);
  const hasQualifyingVaRisk = vaRisk === "reduced" || vaRisk === "untestable";
  const hasMaculaRisk =
    maculaKeys.length > 0 || (hasQualifyingVaRisk && hasDiscFindingContext);
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

  if (urgentKeys.length > 0) {
    return {
      ...base,
      priority: PRIORITY.urgent,
      actionKey: "urgent",
      reasons: formatFindings(urgentKeys),
      limitations: viewLimited ? ["limited view"] : [],
      summary: "Urgent",
    };
  }

  if (glaucomaHighKeys.length > 0) {
    return {
      ...base,
      priority: PRIORITY.fastGlaucoma,
      actionKey: "fastGlaucoma",
      reasons: formatFindings(glaucomaHighKeys),
      limitations: viewLimited ? ["limited view"] : [],
      summary: "Fast glaucoma review",
    };
  }

  if (hasMaculaRisk) {
    const reasons = formatFindings(maculaKeys);
    if (hasQualifyingVaRisk) {
      reasons.push(
        `${getVaLabel(eye.distanceVA)} VA${maculaKeys.length === 0 ? " with disc signs" : ""}`,
      );
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
      priority: PRIORITY.referSoon,
      actionKey: "referSoon",
      reasons: [`${getVaLabel(eye.distanceVA)} VA without disc signs`],
      summary: "Review VA",
    };
  }

  if (findings.cupDisc03 && viewAdequate && eye.distanceVA) {
    return {
      ...base,
      priority: PRIORITY.routineScreen,
      actionKey: "routineScreen",
      reasons: formatFindings(contextKeys),
      summary: "Cup context only",
    };
  }

  if (viewAdequate && findings.noReferableSignsSeen && eye.distanceVA) {
    return {
      ...base,
      priority: PRIORITY.routineScreen,
      actionKey: "routineScreen",
      reasons: ["No disc signs in view"],
      summary: "No referable signs",
    };
  }

  if (recorded) {
    return {
      ...base,
      reasons: [
        !eye.distanceVA
          ? "VA not recorded"
          : "Select no signs or disc findings",
      ],
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
  if (state.mode === "holo-bio" && state.dilation !== "yes") {
    notes.push(
      state.dilation
        ? "Holo view not dilated."
        : "Dilation not recorded for Holo view.",
    );
  }
  return notes;
}

function formatList(items) {
  if (items.length <= 1) {
    return items[0] || "";
  }
  return `${items.slice(0, -1).join(", ")} and ${items[items.length - 1]}`;
}

function buildSystemicSummary(state) {
  const checked = [];
  const unchecked = [];
  Object.entries(state.systemicChecks).forEach(([key, value]) => {
    const label =
      key === "hba1c" ? "high myopia" : key === "bp" ? "IOP" : "family history";
    if (value) {
      checked.push(label);
    } else {
      unchecked.push(label);
    }
  });
  return { checked, unchecked };
}

function buildSafety(systemic) {
  const safety = ["Check symptoms, pupils, fields and local pathway."];

  if (systemic.unchecked.length > 0) {
    safety.push(`Add context: ${formatList(systemic.unchecked)}.`);
  }

  return safety;
}

export function evaluateTriage(state) {
  const eyeResults = Object.entries(state.eyes).map(([eyeKey, eye]) =>
    evaluateEye(eyeKey, eye, state),
  );
  const sortedEyes = [...eyeResults].sort(compareEyeResults);
  const topEye = sortedEyes[0];
  const copy = ACTION_COPY[topEye.actionKey];
  const dilationNotes =
    topEye.priority === PRIORITY.incomplete ? [] : buildDilationNotes(state);
  const systemic = buildSystemicSummary(state);
  const incompleteEyes = eyeResults.filter(
    (result) => result.actionKey === "incomplete",
  );
  const limitationEyes = eyeResults.filter((result) => result.viewLimited);
  const reasons = [];
  const limitations = [];

  Object.entries(state.eyes).forEach(([key, eye]) => {
    if (eye.findings.discDrusen)
      limitations.push(
        `${EYE_LABELS[key]}: if symptomatic or uncertain, manage as swelling.`,
      );
    if (eye.findings.visibleLaminaCribrosa)
      limitations.push(
        `${EYE_LABELS[key]}: interpret lamina with rim loss and fields.`,
      );
  });

  if (topEye.priority === PRIORITY.incomplete) {
    reasons.push("R/L recording incomplete.");
  } else if (topEye.priority === PRIORITY.routineScreen) {
    const allRoutine = eyeResults.every(
      (result) => result.actionKey === "routineScreen",
    );
    if (allRoutine) {
      const contextResults = eyeResults.filter((result) =>
        result.reasons.some((reason) => reason !== "No disc signs in view"),
      );
      if (contextResults.length > 0) {
        eyeResults.forEach((result) => {
          const findingText = result.reasons.some(
            (reason) => reason !== "No disc signs in view",
          )
            ? result.reasons.join(", ")
            : "no referable disc signs";
          reasons.push(`${result.eyeLabel}: ${findingText}.`);
        });
      } else {
        reasons.push(
          "Both eyes have adequate views and no referable signs selected.",
        );
      }
    } else {
      const limitedEye = eyeResults.find((result) => result.viewLimited);
      if (limitedEye) {
        return evaluateWithForcedUngradable(
          state,
          eyeResults,
          dilationNotes,
          systemic,
        );
      }
      const incompleteEye = eyeResults.find(
        (result) => result.actionKey === "incomplete",
      );
      if (incompleteEye) {
        return evaluateWithForcedIncomplete(
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

  limitationEyes.forEach((result) => {
    const detail = "limited view";
    limitations.push(`${result.eyeLabel}: ${detail}.`);
  });

  incompleteEyes
    .filter((result) => topEye.priority > PRIORITY.incomplete)
    .forEach((result) => limitations.push(`${result.eyeLabel}: incomplete.`));

  dilationNotes.forEach((note) => limitations.push(note));

  return {
    actionKey: topEye.actionKey,
    priority: topEye.priority,
    title: copy.title,
    tone: copy.tone,
    reasons,
    limitations,
    next: copy.next,
    safety: buildSafety(systemic),
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
    .filter((result) => result.viewLimited)
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
      "Disc assessment still needs clinical context.",
    ],
    systemic,
    eyes: eyeResults,
  };
}

function evaluateWithForcedIncomplete(eyeResults, dilationNotes, systemic) {
  const copy = ACTION_COPY.incomplete;
  const limitations = [];
  eyeResults
    .filter((result) => result.actionKey === "incomplete")
    .forEach((result) => limitations.push(`${result.eyeLabel}: incomplete.`));
  dilationNotes.forEach((note) => limitations.push(note));
  return {
    actionKey: "incomplete",
    priority: PRIORITY.incomplete,
    title: copy.title,
    tone: copy.tone,
    reasons: ["R/L recording incomplete."],
    limitations,
    next: copy.next,
    safety: buildSafety(systemic),
    systemic,
    eyes: eyeResults,
  };
}
