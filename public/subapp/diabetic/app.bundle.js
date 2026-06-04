"use strict";
(() => {
  // src/findings.js?v=20260518-findingdropdown
  var EYE_LABELS = {
    right: "Right eye",
    left: "Left eye",
  };
  var MODE_LABELS = {
    "arclight-do": "Arclight (DO)",
    "holo-bio": "Holo (BIO)",
  };
  var AREA_OPTIONS = {
    "arclight-do": [
      {
        value: "posterior-pole",
        label: "Posterior pole",
        shortLabel: "Post pole",
      },
      {
        value: "disc-macula",
        label: "Disc and macula",
        shortLabel: "Disc+mac",
      },
      {
        value: "limited",
        label: "Limited glimpses only",
        shortLabel: "Limited",
      },
    ],
    "holo-bio": [
      {
        value: "posterior-pole",
        label: "Posterior pole",
        shortLabel: "Post pole",
      },
      {
        value: "disc-macula",
        label: "Disc and macula",
        shortLabel: "Disc+mac",
      },
      {
        value: "four-quadrants",
        label: "Four-quadrant sweep",
        shortLabel: "4 quad",
      },
      {
        value: "limited",
        label: "Limited glimpses only",
        shortLabel: "Limited",
      },
    ],
  };
  var VA_OPTIONS = [
    { value: "", label: "" },
    { value: "6/6", label: "6/6" },
    { value: "6/12", label: "6/12" },
    { value: "6/36", label: "6/36" },
    { value: "6/60", label: "6/60" },
    { value: "HM", label: "HM" },
    { value: "unable_test", label: "No test" },
    { value: "fix_follow_good", label: "Fix/follow" },
    { value: "fix_follow_poor", label: "No fix" },
  ];
  var SYSTEMIC_CHECKS = [
    { key: "bp", label: "BP checked", note: "optimise BP" },
    { key: "lipids", label: "Lipids checked", note: "optimise lipids" },
    { key: "hba1c", label: "HbA1c checked", note: "optimise glucose control" },
  ];
  var FINDING_GROUPS = [
    {
      key: "clear",
      title: "No referable signs",
      tone: "neutral",
      findings: [
        {
          key: "noReferableSignsSeen",
          label: "No referable signs seen in view obtained",
          shortLabel: "No signs",
          group: "clear",
        },
      ],
    },
    {
      key: "npdr",
      title: "DR signs",
      tone: "green",
      findings: [
        {
          key: "microaneurysms",
          label: "Microaneurysms",
          shortLabel: "MA",
          group: "npdr",
        },
        {
          key: "dotBlotHaemorrhages",
          label: "Dot/blot haemorrhages",
          shortLabel: "D/B",
          group: "npdr",
        },
        {
          key: "cottonWoolSpots",
          label: "Cotton-wool spots",
          shortLabel: "CWS",
          group: "npdr",
        },
        {
          key: "venousBeading",
          label: "Venous beading",
          shortLabel: "VB",
          group: "npdr",
        },
      ],
    },
    {
      key: "macula",
      title: "Macula risk",
      tone: "orange",
      findings: [
        {
          key: "maculaHardExudates",
          label: "Hard exudates near macula",
          shortLabel: "Macula HE",
          group: "macula",
        },
        {
          key: "fovealRisk",
          label: "Possible foveal involvement",
          shortLabel: "Fovea risk",
          group: "macula",
        },
      ],
    },
    {
      key: "pdr",
      title: "Proliferative signs",
      tone: "red",
      findings: [
        {
          key: "nvd",
          label: "New vessels at disc",
          shortLabel: "NVD",
          group: "pdr",
        },
        {
          key: "nve",
          label: "New vessels elsewhere",
          shortLabel: "NVE",
          group: "pdr",
        },
        {
          key: "preretinalHaemorrhage",
          label: "Preretinal haemorrhage",
          shortLabel: "PR-H",
          group: "pdr",
        },
        {
          key: "vitreousHaemorrhage",
          label: "Vitreous haemorrhage",
          shortLabel: "Vit H",
          group: "pdr",
        },
      ],
    },
  ];
  var FINDINGS = FINDING_GROUPS.flatMap((group) => group.findings);
  var FINDING_MAP = Object.fromEntries(
    FINDINGS.map((finding) => [finding.key, finding]),
  );
  var FINDING_KEYS = FINDINGS.map((finding) => finding.key);
  var LESION_FINDING_KEYS = FINDING_KEYS.filter(
    (key) => key !== "noReferableSignsSeen",
  );
  var NPDR_KEYS = FINDINGS.filter((finding) => finding.group === "npdr").map(
    (finding) => finding.key,
  );
  var MACULA_KEYS = FINDINGS.filter(
    (finding) => finding.group === "macula",
  ).map((finding) => finding.key);
  var PDR_KEYS = FINDINGS.filter((finding) => finding.group === "pdr").map(
    (finding) => finding.key,
  );
  function createEmptyFindings() {
    return Object.fromEntries(FINDING_KEYS.map((key) => [key, false]));
  }
  function getFindingLabels(findings) {
    return FINDINGS.filter((finding) => Boolean(findings[finding.key])).map(
      (finding) => finding.label,
    );
  }
  function getAreaLabel(mode, value) {
    var _a, _b;
    return (
      ((_b =
        (_a = AREA_OPTIONS[mode]) == null
          ? void 0
          : _a.find((option) => option.value === value)) == null
        ? void 0
        : _b.label) || "Not recorded"
    );
  }
  function getVaLabel(value) {
    var _a;
    return (
      ((_a = VA_OPTIONS.find((option) => option.value === value)) == null
        ? void 0
        : _a.label) || "Not recorded"
    );
  }

  // src/state.js?v=20260518-findingdropdown
  function createEyeState() {
    return {
      distanceVA: "",
      viewQuality: "",
      areaSeen: "",
      findings: createEmptyFindings(),
    };
  }
  function createInitialState() {
    return {
      mode: "arclight-do",
      dilation: "no",
      systemicChecks: {
        bp: false,
        lipids: false,
        hba1c: false,
      },
      eyes: {
        right: createEyeState(),
        left: createEyeState(),
      },
    };
  }
  function setMode(state2, mode) {
    state2.mode = mode;
    Object.keys(state2.eyes).forEach((eyeKey) => {
      const eye = state2.eyes[eyeKey];
      if (!AREA_OPTIONS[mode].some((option) => option.value === eye.areaSeen)) {
        eye.areaSeen = "";
      }
    });
  }
  function setDilation(state2, value) {
    state2.dilation = value;
  }
  function setSystemicCheck(state2, key, checked) {
    state2.systemicChecks[key] = checked;
  }
  function setDistanceVA(state2, eyeKey, value) {
    state2.eyes[eyeKey].distanceVA = value;
  }
  function setEyeField(state2, eyeKey, field, value) {
    state2.eyes[eyeKey][field] = value;
  }
  function setFinding(state2, eyeKey, findingKey, checked) {
    const findings = state2.eyes[eyeKey].findings;
    if (findingKey === "noReferableSignsSeen") {
      findings.noReferableSignsSeen = checked;
      if (checked) {
        LESION_FINDING_KEYS.forEach((key) => {
          findings[key] = false;
        });
      }
      return;
    }
    findings[findingKey] = checked;
    if (checked) {
      findings.noReferableSignsSeen = false;
    }
  }

  // src/triage.js?v=20260518-findingdropdown
  var PRIORITY = {
    incomplete: 0,
    routineScreen: 1,
    ungradable: 2,
    routineReferral: 3,
    referSoon: 4,
    urgent: 5,
  };
  var ACTION_COPY = {
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
  var REDUCED_VA_VALUES = /* @__PURE__ */ new Set([
    "6/36",
    "6/60",
    "HM",
    "fix_follow_poor",
  ]);
  var NO_TEST_VALUES = /* @__PURE__ */ new Set(["unable_test"]);
  var MILD_VA_VALUES = /* @__PURE__ */ new Set(["6/12", "fix_follow_good"]);
  function selectedKeys(findings, keys) {
    return keys.filter((key) => Boolean(findings[key]));
  }
  function formatFindings(keys) {
    return keys
      .map((key) => {
        var _a, _b;
        return (
          ((_a = FINDING_MAP[key]) == null ? void 0 : _a.shortLabel) ||
          ((_b = FINDING_MAP[key]) == null ? void 0 : _b.label)
        );
      })
      .filter(Boolean);
  }
  function getVaRisk(value) {
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
  function evaluateEye(eyeKey, eye, state2) {
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
  function buildDilationNotes(state2) {
    const notes = [];
    if (state2.dilation === "no") {
      notes.push("Not dilated.");
    }
    if (!state2.dilation) {
      notes.push("Dilation not recorded.");
    }
    if (state2.mode === "holo-bio" && state2.dilation !== "yes") {
      notes.push("Holo view limited without dilation.");
    }
    return notes;
  }
  function buildSystemicSummary(state2) {
    const checked = [];
    const unchecked = [];
    Object.entries(state2.systemicChecks).forEach(([key, value]) => {
      const label = key === "hba1c" ? "HbA1c" : key === "bp" ? "BP" : "lipids";
      if (value) {
        checked.push(label);
      } else {
        unchecked.push(label);
      }
    });
    return { checked, unchecked };
  }
  function evaluateTriage(state2) {
    const eyeResults = Object.entries(state2.eyes).map(([eyeKey, eye]) =>
      evaluateEye(eyeKey, eye, state2),
    );
    const sortedEyes = [...eyeResults].sort(compareEyeResults);
    const topEye = sortedEyes[0];
    const copy = ACTION_COPY[topEye.actionKey];
    const dilationNotes = buildDilationNotes(state2);
    const systemic = buildSystemicSummary(state2);
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
            state2,
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
    state2,
    eyeResults,
    dilationNotes,
    systemic,
  ) {
    const copy = ACTION_COPY.ungradable;
    const limitations = [];
    eyeResults
      .filter(
        (result) => result.viewLimited || result.actionKey === "incomplete",
      )
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

  // src/referral-note.js?v=20260518-findingdropdown
  function formatFindings2(eye) {
    const labels = getFindingLabels(eye.findings);
    return labels.length > 0 ? labels.join(", ") : "none recorded";
  }
  function formatSystemicChecks(state2) {
    return SYSTEMIC_CHECKS.map((check) => {
      const status = state2.systemicChecks[check.key]
        ? "checked"
        : "not checked";
      return `- ${check.label}: ${status}`;
    });
  }
  function buildReferralNote(state2, triage) {
    const lines = [];
    lines.push("Diabetic retinal triage - Diabetic app");
    lines.push("");
    lines.push(`Equipment: ${MODE_LABELS[state2.mode]}`);
    lines.push(`Dilation: ${state2.dilation || "not recorded"}`);
    lines.push("");
    Object.entries(state2.eyes).forEach(([eyeKey, eye]) => {
      lines.push(`${EYE_LABELS[eyeKey]}:`);
      lines.push(`- Distance VA: ${getVaLabel(eye.distanceVA)}`);
      lines.push(`- View quality: ${eye.viewQuality || "not recorded"}`);
      lines.push(`- Area seen: ${getAreaLabel(state2.mode, eye.areaSeen)}`);
      lines.push(`- Findings selected: ${formatFindings2(eye)}`);
      lines.push("");
    });
    lines.push("Systemic checks:");
    lines.push(...formatSystemicChecks(state2));
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

  // src/practice-cases.js?v=20260518-findingdropdown
  var PRACTICE_CASES = [
    {
      id: "normal-clear",
      level: "primary",
      title: "Clear posterior pole",
      imageLabel: "Normal placeholder",
      prompt: "Clear view with no selected referable DR signs.",
      answer:
        "Record no referable signs seen in the view obtained, but routine diabetic eye screening remains required.",
    },
    {
      id: "npdr-basic",
      level: "primary",
      title: "Small red dots",
      imageLabel: "MA and D/B placeholder",
      prompt: "Microaneurysms and dot/blot haemorrhages are present.",
      answer:
        "This is a DR signs pattern: routine referral when possible unless macula or proliferative signs are present.",
    },
    {
      id: "cws-vb",
      level: "intermediate",
      title: "Concerning DR signs",
      imageLabel: "CWS and VB placeholder",
      prompt: "Cotton-wool spots with venous beading.",
      answer:
        "Concerning DR signs: refer soon if widespread or local pathway treats this as higher risk.",
    },
    {
      id: "macula-he",
      level: "intermediate",
      title: "Hard exudates near macula",
      imageLabel: "Macula HE placeholder",
      prompt: "Hard exudates near the macula with reduced distance VA.",
      answer:
        "Possible maculopathy: refer soon (2 weeks). Do not diagnose DMO without OCT or stereo assessment.",
    },
    {
      id: "nvd",
      level: "advanced",
      title: "New vessels at disc",
      imageLabel: "NVD placeholder",
      prompt: "Fine abnormal vessels at the disc.",
      answer: "Possible proliferative DR: urgent today.",
    },
    {
      id: "vit-haem",
      level: "advanced",
      title: "Vitreous haemorrhage",
      imageLabel: "Vit H placeholder",
      prompt: "Poor view with suspected vitreous haemorrhage.",
      answer:
        "Urgent today if vitreous haemorrhage is suspected. The red flag wins.",
    },
    {
      id: "ungradable",
      level: "primary",
      title: "Ungradable view",
      imageLabel: "Ungradable placeholder",
      prompt: "Media opacity prevents assessment.",
      answer:
        "Repeat dilated view or photo if possible; refer if still inadequate or repeat is not possible.",
    },
    {
      id: "bio-sweep",
      level: "intermediate",
      title: "Holo (BIO) sweep",
      imageLabel: "BIO sweep placeholder",
      prompt: "Dilated four-quadrant sweep completed.",
      answer:
        "Record Holo (BIO), dilation status, area seen and selected findings only.",
    },
  ];

  // src/mcq-data.js?v=20260518-findingdropdown
  var MCQ_LEVEL_META = {
    primary: {
      title: "Primary",
      passMark: 3,
      questionCount: 5,
      targetBankSize: 16,
    },
    intermediate: {
      title: "Intermediate",
      passMark: 4,
      questionCount: 6,
      targetBankSize: 26,
    },
    advanced: {
      title: "Advanced",
      passMark: 6,
      questionCount: 8,
      targetBankSize: 26,
    },
  };
  var MCQ_BANKS = {
    primary: [
      {
        question: "What does an ungradable view mean?",
        options: [
          "Normal retina",
          "Cannot assess safely",
          "No screening needed",
          "Only BP review",
        ],
        answer: 1,
        topic: "view-quality",
      },
      {
        question:
          "What is the safest wording after a partial clear view with no lesions seen?",
        options: [
          "Normal",
          "No referable signs seen in the view obtained",
          "No DR ever",
          "Discharge forever",
        ],
        answer: 1,
        topic: "safety-copy",
      },
      {
        question: "Which finding is a DR sign?",
        options: [
          "Microaneurysms",
          "NVD",
          "Vitreous haemorrhage",
          "Preretinal haemorrhage",
        ],
        answer: 0,
        topic: "npdr",
      },
      {
        question: "Which finding is a red flag?",
        options: ["CWS", "Dot/blot haemorrhage", "NVE", "Microaneurysm"],
        answer: 2,
        topic: "pdr",
      },
      {
        question: "What should Holo (BIO) prompt before recording the view?",
        options: [
          "Local dilation check",
          "Anti-VEGF choice",
          "Laser choice",
          "Spectacle prescription",
        ],
        answer: 0,
        topic: "dilation",
      },
      {
        question: "Which action fits possible vitreous haemorrhage?",
        options: [
          "Routine screening only",
          "Urgent today",
          "Ignore if VA is good",
          "Medical review only",
        ],
        answer: 1,
        topic: "urgent",
      },
      {
        question:
          "What does Distance VA 6/36 suggest when DR signs are present?",
        options: [
          "Possible macula risk",
          "No concern",
          "Confirmed DMO",
          "Confirmed proliferative DR",
        ],
        answer: 0,
        topic: "va",
      },
      {
        question: "Which systemic check belongs in the Action panel?",
        options: ["HbA1c", "Shoe size", "Height only", "Hair colour"],
        answer: 0,
        topic: "systemic",
      },
      {
        question: "What should the app record for eyes?",
        options: [
          "Right and left eyes",
          "Only the better eye",
          "Only the first eye seen",
          "No eye label",
        ],
        answer: 0,
        topic: "both-eyes",
      },
      {
        question: "Which option belongs to Arclight (DO) area seen?",
        options: [
          "Limited glimpses only",
          "Four-quadrant sweep",
          "OCT cube",
          "Fluorescein frame",
        ],
        answer: 0,
        topic: "mode",
      },
      {
        question: "Which option belongs to Holo (BIO)?",
        options: [
          "Four-quadrant sweep",
          "Spectacle axis",
          "Near add",
          "K reading",
        ],
        answer: 0,
        topic: "mode",
      },
      {
        question:
          "What should no referable signs do when a lesion is selected?",
        options: [
          "Stay selected",
          "Clear because findings conflict",
          "Become urgent",
          "Open MCQ",
        ],
        answer: 1,
        topic: "state",
      },
      {
        question: "What is the app mainly for?",
        options: [
          "DR triage and teaching",
          "OCT diagnosis",
          "Treatment selection",
          "AI grading",
        ],
        answer: 0,
        topic: "scope",
      },
      {
        question: "Which is a macula-risk clue?",
        options: [
          "Hard exudates near macula",
          "Normal disc colour",
          "No diabetes history",
          "Clear lens",
        ],
        answer: 0,
        topic: "macula",
      },
      {
        question:
          "If both eyes are adequate with no referable signs, what remains required?",
        options: [
          "Routine diabetic screening",
          "No future screening",
          "Laser today",
          "Ignore diabetes",
        ],
        answer: 0,
        topic: "safety-copy",
      },
      {
        question: "Where should practice live in this app?",
        options: [
          "Side drawer",
          "Main clinical tab rail",
          "Referral note only",
          "Dilation dropdown",
        ],
        answer: 0,
        topic: "practice",
      },
    ],
    intermediate: [
      {
        question: "An eye has MA and dot/blot haemorrhages only. Best action?",
        options: [
          "Routine referral when possible",
          "Urgent today",
          "No screening required",
          "Choose laser",
        ],
        answer: 0,
        topic: "npdr",
      },
      {
        question:
          "Hard exudates near macula with 6/36 VA should usually trigger:",
        options: [
          "Refer soon (2 weeks)",
          "Routine screening only",
          "No action",
          "Confirmed DMO treatment",
        ],
        answer: 0,
        topic: "macula",
      },
      {
        question:
          "Which VA value is a documented reduced-VA trigger when DR context is present?",
        options: ["6/36", "6/6", "Blank", "Fix/follow"],
        answer: 0,
        topic: "va",
      },
      {
        question: "Which VA value is mild and should not escalate by itself?",
        options: ["6/12", "6/60", "HM", "No fix"],
        answer: 0,
        topic: "va",
      },
      {
        question: "One eye is clear, the other ungradable. Best output?",
        options: [
          "Ungradable or limited, not reassuring",
          "Routine screening only",
          "Normal",
          "Urgent laser",
        ],
        answer: 0,
        topic: "view-quality",
      },
      {
        question: "NVE in one eye and ungradable fellow eye should trigger:",
        options: [
          "Urgent today",
          "Ungradable only",
          "Routine screening",
          "No referral",
        ],
        answer: 0,
        topic: "priority",
      },
      {
        question:
          "What should ungradable fellow-eye information become when proliferative signs are seen in the other eye?",
        options: [
          "Limitation note",
          "Main action overriding proliferative signs",
          "Deleted",
          "Treatment choice",
        ],
        answer: 0,
        topic: "priority",
      },
      {
        question:
          "Which finding is macula risk rather than proliferative disease?",
        options: [
          "Hard exudates near macula",
          "NVD",
          "NVE",
          "Vitreous haemorrhage",
        ],
        answer: 0,
        topic: "macula",
      },
      {
        question: "Which finding is proliferative?",
        options: [
          "New vessels at disc",
          "Cotton-wool spots",
          "Microaneurysms",
          "Hard exudates",
        ],
        answer: 0,
        topic: "pdr",
      },
      {
        question:
          "For Holo (BIO), four-quadrant sweep should be removed when switching to:",
        options: ["Arclight (DO)", "Practice drawer", "Referral note", "MCQ"],
        answer: 0,
        topic: "mode",
      },
      {
        question: "BP, lipids and HbA1c tick-boxes should:",
        options: [
          "Support medical review without changing retinal urgency",
          "Always make urgent",
          "Replace eye findings",
          "Confirm DMO",
        ],
        answer: 0,
        topic: "systemic",
      },
      {
        question:
          "If no referable signs is selected then CWS is ticked, the app should:",
        options: [
          "Clear no referable signs",
          "Clear CWS",
          "Ignore CWS",
          "Submit MCQ",
        ],
        answer: 0,
        topic: "state",
      },
      {
        question:
          "If no referable signs is selected after lesions, the app should:",
        options: [
          "Clear lesion findings for that eye",
          "Keep all lesions",
          "Mark urgent",
          "Switch mode",
        ],
        answer: 0,
        topic: "state",
      },
      {
        question:
          "What is a safe Action-panel phrase after no lesions in partial view?",
        options: [
          "No referable signs seen in the view obtained",
          "Normal retina",
          "No DR in either eye",
          "Discharge",
        ],
        answer: 0,
        topic: "safety-copy",
      },
      {
        question: "What should the referral note include?",
        options: [
          "Right and left eye sections",
          "Only one combined eye",
          "Treatment dose",
          "Laser plan",
        ],
        answer: 0,
        topic: "referral-note",
      },
      {
        question: "Which app pattern should VA reuse?",
        options: [
          "Cataract compact select",
          "Large text area",
          "Slider",
          "Freehand drawing",
        ],
        answer: 0,
        topic: "ui",
      },
      {
        question: "What is the main clinical tab rail?",
        options: [
          "Arclight (DO) and Holo (BIO)",
          "Primary and Advanced",
          "Right and Left only",
          "BP and HbA1c",
        ],
        answer: 0,
        topic: "ui",
      },
      {
        question: "Where should longer teaching text live?",
        options: [
          "Popup or drawer",
          "Crowded main panel",
          "Action title",
          "VA dropdown",
        ],
        answer: 0,
        topic: "ui",
      },
      {
        question:
          "What should routine DR signs without macula or proliferative signs use?",
        options: [
          "Routine referral when possible",
          "Urgent today",
          "No follow-up ever",
          "Anti-VEGF decision",
        ],
        answer: 0,
        topic: "npdr",
      },
      {
        question: "What should suspected foveal involvement trigger?",
        options: [
          "Refer soon (2 weeks)",
          "Routine only",
          "Ignore",
          "Confirmed DMO",
        ],
        answer: 0,
        topic: "macula",
      },
      {
        question: "What does No test VA mean?",
        options: [
          "A limitation",
          "Perfect vision",
          "Confirmed proliferative DR",
          "No referral possible",
        ],
        answer: 0,
        topic: "va",
      },
      {
        question: "Which mode should visibly prompt dilation before recording?",
        options: [
          "Holo (BIO)",
          "MCQ only",
          "Practice only",
          "Referral note only",
        ],
        answer: 0,
        topic: "dilation",
      },
      {
        question: "What should be stored if not dilated?",
        options: [
          "Reason if not dilated",
          "Laser type",
          "OCT thickness",
          "Lens power",
        ],
        answer: 0,
        topic: "dilation",
      },
      {
        question: "What wins in mixed-risk findings?",
        options: [
          "Highest-risk sign",
          "First ticked sign",
          "Lowest-risk sign",
          "Drawer order",
        ],
        answer: 0,
        topic: "priority",
      },
      {
        question: "What should the app avoid?",
        options: [
          "Treatment selection",
          "Referral note",
          "Both-eye recording",
          "VA recording",
        ],
        answer: 0,
        topic: "scope",
      },
      {
        question: "What should a 360 x 740 layout avoid?",
        options: [
          "Two full duplicated eye panels",
          "Compact chips",
          "A small popup",
          "Short labels",
        ],
        answer: 0,
        topic: "ui",
      },
    ],
    advanced: [
      {
        question: "Right eye NVD, left eye ungradable. Overall action?",
        options: [
          "Urgent today, with left-eye limitation note",
          "Ungradable only",
          "Routine referral",
          "Routine screening",
        ],
        answer: 0,
        topic: "priority",
      },
      {
        question:
          "Right eye clear adequate, left eye ungradable. Overall action?",
        options: [
          "Ungradable or limited view",
          "Routine screening still required only",
          "Urgent today",
          "No note needed",
        ],
        answer: 0,
        topic: "priority",
      },
      {
        question:
          "Both eyes clear adequate with no referable signs selected. Overall action?",
        options: [
          "Routine screening still required",
          "Ungradable",
          "Urgent today",
          "Refer soon",
        ],
        answer: 0,
        topic: "routine",
      },
      {
        question: "6/12 VA without DR findings should:",
        options: [
          "Be recorded without escalation by itself",
          "Trigger urgent today",
          "Confirm DMO",
          "Clear all findings",
        ],
        answer: 0,
        topic: "va",
      },
      {
        question: "6/36 VA plus dot/blot haemorrhages should support:",
        options: [
          "Refer soon (2 weeks)",
          "No action",
          "Confirmed proliferative DR",
          "Treatment choice",
        ],
        answer: 0,
        topic: "va",
      },
      {
        question: "Fix/follow means:",
        options: [
          "Non-standard VA, no escalation by itself",
          "Always urgent",
          "Confirmed maculopathy",
          "Ignore all findings",
        ],
        answer: 0,
        topic: "va",
      },
      {
        question: "No fix with DR signs should be treated as:",
        options: [
          "Reduced VA supporting refer soon",
          "Normal VA",
          "Confirmed proliferative DR",
          "No test needed",
        ],
        answer: 0,
        topic: "va",
      },
      {
        question: "No test VA with DR signs should:",
        options: [
          "Prevent reassuring wording and support refer soon",
          "Confirm normal vision",
          "Delete DR signs",
          "Choose laser",
        ],
        answer: 0,
        topic: "va",
      },
      {
        question:
          "Which finding should never be downgraded by ungradable fellow-eye view?",
        options: ["NVE", "Microaneurysm only", "No signs", "Blank VA"],
        answer: 0,
        topic: "priority",
      },
      {
        question: "Which combination is macula risk?",
        options: [
          "Hard exudates near macula plus reduced VA",
          "Clear view plus 6/6",
          "No signs plus blank VA",
          "BP checked only",
        ],
        answer: 0,
        topic: "macula",
      },
      {
        question: "Why avoid confirmed DMO wording?",
        options: [
          "OCT or stereo assessment is needed",
          "VA is never relevant",
          "DR cannot affect macula",
          "Referral notes cannot mention macula",
        ],
        answer: 0,
        topic: "macula",
      },
      {
        question:
          "What should happen to no referable signs when NVD is selected?",
        options: [
          "It clears for that eye",
          "It stays selected",
          "It becomes the action",
          "It hides VA",
        ],
        answer: 0,
        topic: "state",
      },
      {
        question:
          "What should happen to lesions when no referable signs is selected?",
        options: [
          "They clear for that eye",
          "They remain active",
          "They become systemic checks",
          "They move to fellow eye",
        ],
        answer: 0,
        topic: "state",
      },
      {
        question:
          "A user changes Holo (BIO) to Arclight (DO) after four-quadrant sweep. The app should:",
        options: [
          "Reset or require new valid area for that eye",
          "Keep four quadrants",
          "Delete all findings",
          "Open practice",
        ],
        answer: 0,
        topic: "mode",
      },
      {
        question: "Which data belongs in the referral note?",
        options: [
          "Whether dilation was done",
          "Anti-VEGF dose",
          "Laser settings",
          "OCT map",
        ],
        answer: 0,
        topic: "referral-note",
      },
      {
        question: "Which systemic action is sensible in LMIC settings?",
        options: [
          "Arrange diabetes/medical review when possible",
          "Ignore BP",
          "Let HbA1c change retinal urgency",
          "Use lipids as proliferative sign",
        ],
        answer: 0,
        topic: "systemic",
      },
      {
        question:
          "Which output should be avoided for limited Arclight (DO) view?",
        options: [
          "Normal retina",
          "Limitation note",
          "Routine screening reminder",
          "Referral note",
        ],
        answer: 0,
        topic: "safety-copy",
      },
      {
        question: "Which should remain in the drawer?",
        options: [
          "Image practice cases",
          "Clinical equipment mode",
          "Action panel",
          "Right/Left eye switcher",
        ],
        answer: 0,
        topic: "practice",
      },
      {
        question: "What does red-flags-win mean?",
        options: [
          "Proliferative signs drive urgent today",
          "Red title changes urgency",
          "BP tick-box means urgent",
          "Practice score changes referral",
        ],
        answer: 0,
        topic: "urgent",
      },
      {
        question: "What should an urgent output suppress?",
        options: [
          "Long low-yield teaching text",
          "Reason text",
          "Eye label",
          "Referral note",
        ],
        answer: 0,
        topic: "ui",
      },
      {
        question: "Which first-screen layout rule is safest?",
        options: [
          "R/L VA and R/L view in the View panel",
          "Two large eye panels stacked",
          "Practice as main tab",
          "Long manual text before controls",
        ],
        answer: 0,
        topic: "ui",
      },
      {
        question: "Which finding group contains venous beading?",
        options: ["DR signs", "Proliferative signs", "Macula-only", "Systemic"],
        answer: 0,
        topic: "npdr",
      },
      {
        question:
          "Which category should CWS plus venous beading enter if no macula or proliferative signs?",
        options: [
          "Routine referral when possible or soon if concerning",
          "Urgent today always",
          "Routine screening only",
          "Confirmed DMO",
        ],
        answer: 0,
        topic: "npdr",
      },
      {
        question: "Which statement about Holo (BIO) is safest?",
        options: [
          "It can record four-quadrant sweep but only reports selected findings",
          "It confirms no DR if clear",
          "It replaces screening forever",
          "It chooses treatment",
        ],
        answer: 0,
        topic: "mode",
      },
      {
        question: "Which statement about Arclight (DO) is safest?",
        options: [
          "It should not imply a complete peripheral assessment",
          "It always sees four quadrants",
          "It confirms no maculopathy",
          "It replaces referral",
        ],
        answer: 0,
        topic: "mode",
      },
      {
        question: "What should pure triage tests include?",
        options: [
          "Mixed-eye priority edge cases",
          "Only colour checks",
          "Only drawer clicks",
          "Only image filenames",
        ],
        answer: 0,
        topic: "testing",
      },
    ],
  };

  // src/mcq.js?v=20260518-findingdropdown
  function shuffle(items) {
    const copy = [...items];
    for (let index = copy.length - 1; index > 0; index -= 1) {
      const swapIndex = Math.floor(Math.random() * (index + 1));
      [copy[index], copy[swapIndex]] = [copy[swapIndex], copy[index]];
    }
    return copy;
  }
  function prepareQuestion(question) {
    const options = question.options.map((label, index) => ({
      label,
      originalIndex: index,
    }));
    const shuffledOptions = shuffle(options);
    return {
      ...question,
      options: shuffledOptions,
      answer: shuffledOptions.findIndex(
        (option) => option.originalIndex === question.answer,
      ),
    };
  }
  function makeElement(tagName, className, text) {
    const element = document.createElement(tagName);
    if (className) element.className = className;
    if (text) element.textContent = text;
    return element;
  }
  function validateMcqBanks() {
    return Object.entries(MCQ_LEVEL_META).map(([level, meta]) => {
      const bank = MCQ_BANKS[level] || [];
      const invalidAnswers = bank.filter((question) => {
        return (
          !Array.isArray(question.options) ||
          question.answer < 0 ||
          question.answer >= question.options.length
        );
      });
      return {
        level,
        expected: meta.targetBankSize,
        actual: bank.length,
        invalidAnswers: invalidAnswers.length,
      };
    });
  }
  function createMcqController(elements2) {
    let currentQuestions = [];
    let currentMeta = null;
    function close() {
      elements2.modal.setAttribute("aria-hidden", "true");
      elements2.modal.hidden = true;
    }
    function renderQuestion(question, questionIndex) {
      const card = makeElement("fieldset", "mcq-question");
      const legend = makeElement(
        "legend",
        "mcq-question-title",
        `${questionIndex + 1}. ${question.question}`,
      );
      card.append(legend);
      question.options.forEach((option, optionIndex) => {
        const label = makeElement("label", "mcq-option");
        const input = document.createElement("input");
        input.type = "radio";
        input.name = `mcq_${questionIndex}`;
        input.value = String(optionIndex);
        const text = makeElement("span", "", option.label);
        label.append(input, text);
        card.append(label);
      });
      return card;
    }
    function open(level) {
      const meta = MCQ_LEVEL_META[level];
      const bank = MCQ_BANKS[level];
      if (!meta || !bank) return;
      currentMeta = meta;
      currentQuestions = shuffle(bank)
        .slice(0, meta.questionCount)
        .map(prepareQuestion);
      elements2.title.textContent = `${meta.title} MCQ`;
      elements2.intro.textContent = `${meta.questionCount} questions. Pass mark ${meta.passMark}.`;
      elements2.result.textContent = "";
      elements2.result.className = "mcq-result";
      elements2.submit.disabled = false;
      elements2.container.replaceChildren(
        ...currentQuestions.map(renderQuestion),
      );
      elements2.modal.hidden = false;
      elements2.modal.setAttribute("aria-hidden", "false");
      elements2.modalContent.focus();
    }
    function submit() {
      if (!currentMeta) return;
      let score = 0;
      const missedTopics = /* @__PURE__ */ new Set();
      currentQuestions.forEach((question, questionIndex) => {
        const selected = elements2.container.querySelector(
          `input[name="mcq_${questionIndex}"]:checked`,
        );
        const selectedIndex = selected ? Number(selected.value) : -1;
        const optionLabels = elements2.container.querySelectorAll(
          `input[name="mcq_${questionIndex}"]`,
        );
        optionLabels.forEach((input) => {
          input.disabled = true;
          const label = input.closest(".mcq-option");
          label.classList.remove("is-correct", "is-wrong");
          const value = Number(input.value);
          if (value === question.answer) {
            label.classList.add("is-correct");
          }
          if (value === selectedIndex && value !== question.answer) {
            label.classList.add("is-wrong");
          }
        });
        if (selectedIndex === question.answer) {
          score += 1;
        } else {
          missedTopics.add(question.topic);
        }
      });
      const passed = score >= currentMeta.passMark;
      elements2.result.textContent = `Score ${score}/${currentMeta.questionCount}. ${passed ? "Pass." : "Review and retry."}`;
      if (missedTopics.size > 0) {
        const topics = makeElement(
          "p",
          "mcq-topics",
          `Review: ${[...missedTopics].join(", ")}.`,
        );
        elements2.result.append(topics);
      }
      elements2.result.classList.toggle("is-pass", passed);
      elements2.result.classList.toggle("is-review", !passed);
      elements2.submit.disabled = true;
    }
    elements2.close.addEventListener("click", close);
    elements2.submit.addEventListener("click", submit);
    return {
      open,
      close,
    };
  }

  // src/ui-shell.js?v=20260518-findingdropdown
  function setupDrawer({ menuButton, closeButton, drawer, overlay }) {
    function open() {
      overlay.hidden = false;
      drawer.classList.add("is-open");
      overlay.classList.add("is-visible");
      drawer.setAttribute("aria-hidden", "false");
      menuButton.setAttribute("aria-expanded", "true");
    }
    function close() {
      drawer.classList.remove("is-open");
      overlay.classList.remove("is-visible");
      overlay.hidden = true;
      drawer.setAttribute("aria-hidden", "true");
      menuButton.setAttribute("aria-expanded", "false");
    }
    menuButton.addEventListener("click", open);
    closeButton.addEventListener("click", close);
    overlay.addEventListener("click", close);
    document.addEventListener("keydown", (event) => {
      if (event.key === "Escape") close();
    });
    return { open, close };
  }
  function setupInfoPopup({ button, popup, closeButton }) {
    function open() {
      popup.hidden = false;
      popup.setAttribute("aria-hidden", "false");
      button.setAttribute("aria-expanded", "true");
      popup.focus();
    }
    function close() {
      popup.hidden = true;
      popup.setAttribute("aria-hidden", "true");
      button.setAttribute("aria-expanded", "false");
    }
    button.addEventListener("click", () => {
      if (popup.hidden) {
        open();
      } else {
        close();
      }
    });
    closeButton.addEventListener("click", close);
    document.addEventListener("keydown", (event) => {
      if (event.key === "Escape") close();
    });
    return { open, close };
  }
  function setupTabs({ tabs, panels, onChange }) {
    const tabList = [...tabs];
    function activate(tab) {
      const targetId = tab.dataset.tabTarget;
      tabList.forEach((button) => {
        const selected = button === tab;
        button.classList.toggle("active", selected);
        button.setAttribute("aria-selected", String(selected));
        button.tabIndex = selected ? 0 : -1;
      });
      panels.forEach((panel) => {
        const selected = panel.id === targetId;
        panel.classList.toggle("active", selected);
        panel.hidden = !selected;
      });
      onChange == null ? void 0 : onChange(tab.dataset.mode);
    }
    function handleKeydown(event) {
      const keys = ["ArrowLeft", "ArrowRight", "Home", "End"];
      if (!keys.includes(event.key)) return;
      event.preventDefault();
      const currentIndex = tabList.indexOf(event.currentTarget);
      let nextIndex = currentIndex;
      if (event.key === "ArrowRight") {
        nextIndex = (currentIndex + 1) % tabList.length;
      } else if (event.key === "ArrowLeft") {
        nextIndex = (currentIndex - 1 + tabList.length) % tabList.length;
      } else if (event.key === "Home") {
        nextIndex = 0;
      } else if (event.key === "End") {
        nextIndex = tabList.length - 1;
      }
      tabList[nextIndex].focus();
      activate(tabList[nextIndex]);
    }
    tabList.forEach((tab) => {
      tab.addEventListener("click", () => activate(tab));
      tab.addEventListener("keydown", handleKeydown);
    });
  }
  function openModal(modal, content) {
    modal.hidden = false;
    modal.setAttribute("aria-hidden", "false");
    content == null ? void 0 : content.focus();
  }
  function closeModal(modal) {
    modal.hidden = true;
    modal.setAttribute("aria-hidden", "true");
  }

  // script.js
  var state = createInitialState();
  var currentTriage = evaluateTriage(state);
  var actionExpanded = false;
  var openFindingsEye = null;
  var $ = (selector) => document.querySelector(selector);
  var $$ = (selector) => Array.from(document.querySelectorAll(selector));
  var elements = {
    dilationSwitch: $(".diabetic-dilation-switch"),
    dilationToggle: $("#dilationToggle"),
    rightDistanceVA: $("#rightDistanceVA"),
    leftDistanceVA: $("#leftDistanceVA"),
    rightViewStatusSelect: $("#rightViewStatusSelect"),
    leftViewStatusSelect: $("#leftViewStatusSelect"),
    findingsContainer: $("#findingsContainer"),
    actionPanel: $(".action-panel"),
    actionDetails: $("#actionDetails"),
    actionToggle: $("#actionToggle"),
    actionCard: $("#actionCard"),
    actionTone: $("#actionTone"),
    actionTitle: $("#actionTitle"),
    actionReasons: $("#actionReasons"),
    actionLimitations: $("#actionLimitations"),
    actionNext: $("#actionNext"),
    actionSafety: $("#actionSafety"),
    referralModal: $("#referralModal"),
    referralModalContent: $("#referralModalContent"),
    referralText: $("#referralText"),
    copyStatus: $("#copyStatus"),
    practiceModal: $("#practiceModal"),
    practiceModalContent: $("#practiceModalContent"),
    practiceCases: $("#practiceCases"),
    guideModal: $("#guideModal"),
    guideModalContent: $("#guideModalContent"),
    guideTitle: $("#guideTitle"),
    guideContent: $("#guideContent"),
  };
  var guideText = {
    dilation: [
      "Record dilation as Yes or No.",
      "Yes means the retinal view was obtained after dilation.",
      "No means the Action panel and referral note will state that the view was not dilated.",
    ],
    arclight: [
      "Use Arclight (DO) to inspect the posterior pole, disc and macula where possible.",
      "Do not imply a complete peripheral assessment from a limited direct view.",
      "Record limited glimpses when the view is brief or incomplete.",
    ],
    holo: [
      "Holo (BIO) should prompt dilation before recording the view.",
      "Four-quadrant sweep belongs to Holo (BIO), not Arclight (DO).",
      "Record only what was actually seen.",
    ],
    lesions: [
      "DR signs: microaneurysms, dot/blot haemorrhages, cotton-wool spots and venous beading.",
      "Macula risk: hard exudates near macula, possible foveal involvement or reduced VA with DR signs.",
      "Red flags: NVD, NVE, preretinal haemorrhage or vitreous haemorrhage.",
    ],
    referral: [
      "Routine referral when possible: DR signs without macula-risk or proliferative signs.",
      "Refer soon (2 weeks): possible maculopathy, reduced VA with DR context or concerning DR signs.",
      "Urgent today: NVD, NVE, preretinal haemorrhage or vitreous haemorrhage.",
    ],
    about: [
      "Default referral wording is deliberately simple and should follow local pathways.",
      "Systemic checks support diabetes/medical review, but do not change retinal urgency.",
      "This app is a teaching and triage aid, not a formal screening replacement.",
    ],
  };
  var VIEW_STATUS_OPTIONS = {
    "arclight-do": [
      { value: "", label: "", viewQuality: "", areaSeen: "" },
      {
        value: "disc-macula-clear",
        label: "Disc+mac",
        viewQuality: "clear",
        areaSeen: "disc-macula",
      },
      {
        value: "posterior-pole-clear",
        label: "Post pole",
        viewQuality: "clear",
        areaSeen: "posterior-pole",
      },
      {
        value: "limited",
        label: "Limited",
        viewQuality: "partial",
        areaSeen: "limited",
      },
      {
        value: "hazy",
        label: "Hazy",
        viewQuality: "hazy",
        areaSeen: "limited",
      },
      {
        value: "ungradable",
        label: "Ungradable",
        viewQuality: "ungradable",
        areaSeen: "limited",
      },
    ],
    "holo-bio": [
      { value: "", label: "", viewQuality: "", areaSeen: "" },
      {
        value: "four-quadrants-clear",
        label: "4 quad",
        viewQuality: "clear",
        areaSeen: "four-quadrants",
      },
      {
        value: "disc-macula-clear",
        label: "Disc+mac",
        viewQuality: "clear",
        areaSeen: "disc-macula",
      },
      {
        value: "posterior-pole-clear",
        label: "Post pole",
        viewQuality: "clear",
        areaSeen: "posterior-pole",
      },
      {
        value: "limited",
        label: "Limited",
        viewQuality: "partial",
        areaSeen: "limited",
      },
      {
        value: "hazy",
        label: "Hazy",
        viewQuality: "hazy",
        areaSeen: "limited",
      },
      {
        value: "ungradable",
        label: "Ungradable",
        viewQuality: "ungradable",
        areaSeen: "limited",
      },
    ],
  };
  function getViewStatusOptions(mode) {
    return VIEW_STATUS_OPTIONS[mode] || VIEW_STATUS_OPTIONS["arclight-do"];
  }
  function getViewStatusValue(mode, eye) {
    const options = getViewStatusOptions(mode);
    const exact = options.find(
      (option) =>
        option.viewQuality === eye.viewQuality &&
        option.areaSeen === eye.areaSeen,
    );
    if (exact) return exact.value;
    if (eye.viewQuality === "ungradable") return "ungradable";
    if (eye.viewQuality === "hazy") return "hazy";
    if (eye.viewQuality === "partial" || eye.areaSeen === "limited")
      return "limited";
    return "";
  }
  function applyViewStatus(eyeKey, value) {
    const option =
      getViewStatusOptions(state.mode).find((item) => item.value === value) ||
      getViewStatusOptions(state.mode)[0];
    setEyeField(state, eyeKey, "viewQuality", option.viewQuality);
    setEyeField(state, eyeKey, "areaSeen", option.areaSeen);
  }
  function getFindingSummary(eyeKey) {
    const findings = state.eyes[eyeKey].findings;
    const selected = FINDING_GROUPS.flatMap((group) => group.findings).filter(
      (finding) => Boolean(findings[finding.key]),
    );
    if (findings.noReferableSignsSeen) {
      return "No signs";
    }
    if (selected.length === 0) {
      return "Not recorded";
    }
    if (selected.length <= 2) {
      return selected
        .map((finding) => finding.shortLabel || finding.label)
        .join(", ");
    }
    return `${selected
      .slice(0, 2)
      .map((finding) => finding.shortLabel || finding.label)
      .join(", ")} +${selected.length - 2}`;
  }
  function makeElement2(tagName, className, text) {
    const element = document.createElement(tagName);
    if (className) element.className = className;
    if (text !== void 0) element.textContent = text;
    return element;
  }
  function populateVaSelect(select) {
    select.replaceChildren(
      ...VA_OPTIONS.map((option) => {
        const optionElement = document.createElement("option");
        optionElement.value = option.value;
        optionElement.textContent = option.label;
        return optionElement;
      }),
    );
  }
  function populateSelect(select, options, selectedValue) {
    select.replaceChildren(
      ...options.map((option) => {
        const optionElement = document.createElement("option");
        optionElement.value = option.value;
        optionElement.textContent = option.shortLabel || option.label;
        optionElement.title = option.label;
        return optionElement;
      }),
    );
    select.value = selectedValue || "";
  }
  function renderFindings() {
    const dropdowns = makeElement2("div", "findings-dropdowns");
    ["right", "left"].forEach((eyeKey) => {
      const details = makeElement2("details", "finding-dropdown");
      details.dataset.eye = eyeKey;
      details.open = openFindingsEye === eyeKey;
      const summary = makeElement2("summary", "finding-dropdown-summary");
      summary.append(
        makeElement2(
          "span",
          "finding-dropdown-title",
          eyeKey === "right" ? "Right findings" : "Left findings",
        ),
        makeElement2(
          "span",
          "finding-dropdown-value",
          getFindingSummary(eyeKey),
        ),
      );
      const menu = makeElement2("div", "finding-dropdown-menu");
      FINDING_GROUPS.forEach((group) => {
        const groupWrap = makeElement2(
          "section",
          `finding-dropdown-group finding-dropdown-group--${group.tone}`,
        );
        groupWrap.append(makeElement2("h3", "", group.title));
        const options = makeElement2("div", "finding-dropdown-options");
        group.findings.forEach((finding) => {
          const label = makeElement2("label", "finding-dropdown-option");
          const input = document.createElement("input");
          input.type = "checkbox";
          input.name = `finding-${eyeKey}`;
          input.value = finding.key;
          input.setAttribute(
            "aria-label",
            `${eyeKey === "right" ? "Right" : "Left"} ${finding.label}`,
          );
          input.checked = Boolean(state.eyes[eyeKey].findings[finding.key]);
          label.title = finding.label;
          label.classList.toggle("is-selected", input.checked);
          input.addEventListener("change", () => {
            setFinding(state, eyeKey, finding.key, input.checked);
            openFindingsEye = eyeKey;
            render();
          });
          label.append(
            input,
            makeElement2("span", "", finding.shortLabel || finding.label),
          );
          options.append(label);
        });
        groupWrap.append(options);
        menu.append(groupWrap);
      });
      details.addEventListener("toggle", () => {
        if (details.open) {
          openFindingsEye = eyeKey;
          dropdowns
            .querySelectorAll(".finding-dropdown[open]")
            .forEach((item) => {
              if (item !== details) item.open = false;
            });
        } else if (openFindingsEye === eyeKey) {
          openFindingsEye = null;
        }
      });
      details.append(summary, menu);
      dropdowns.append(details);
    });
    elements.findingsContainer.replaceChildren(dropdowns);
  }
  function renderViewControls() {
    populateSelect(
      elements.rightViewStatusSelect,
      getViewStatusOptions(state.mode),
      getViewStatusValue(state.mode, state.eyes.right),
    );
    populateSelect(
      elements.leftViewStatusSelect,
      getViewStatusOptions(state.mode),
      getViewStatusValue(state.mode, state.eyes.left),
    );
  }
  function renderActionList(container, items) {
    const paragraphs =
      items.length > 0
        ? items.map((item) => makeElement2("p", "", item))
        : [makeElement2("p", "", "No reason recorded yet.")];
    container.replaceChildren(...paragraphs);
  }
  function renderAction() {
    currentTriage = evaluateTriage(state);
    elements.actionTitle.textContent = currentTriage.title;
    elements.actionTone.textContent = currentTriage.title;
    elements.actionCard.className = `action-card tone-${currentTriage.tone}`;
    elements.actionPanel.classList.toggle("is-collapsed", !actionExpanded);
    elements.actionPanel.classList.toggle("is-expanded", actionExpanded);
    elements.actionDetails.hidden = !actionExpanded;
    elements.actionDetails.setAttribute("aria-hidden", String(!actionExpanded));
    elements.actionToggle.textContent = actionExpanded ? "Hide" : "More";
    elements.actionToggle.setAttribute("aria-expanded", String(actionExpanded));
    renderActionList(elements.actionReasons, currentTriage.reasons);
    renderActionList(elements.actionLimitations, currentTriage.limitations);
    elements.actionNext.textContent = currentTriage.next;
    elements.actionSafety.textContent = currentTriage.safety.join(" ");
  }
  function renderDilation() {
    elements.dilationToggle.checked = state.dilation === "yes";
  }
  function renderVa() {
    elements.rightDistanceVA.value = state.eyes.right.distanceVA;
    elements.leftDistanceVA.value = state.eyes.left.distanceVA;
  }
  function render() {
    renderDilation();
    renderVa();
    renderViewControls();
    renderFindings();
    renderAction();
  }
  function openGuide(key) {
    const title =
      {
        dilation: "Dilation",
        arclight: "Arclight (DO) sweep",
        holo: "Holo (BIO) sweep",
        lesions: "Lesion guide",
        referral: "Referral wording",
        about: "About local wording",
      }[key] || "Guide";
    elements.guideTitle.textContent = title;
    elements.guideContent.replaceChildren(
      ...(guideText[key] || []).map((line) => makeElement2("p", "", line)),
    );
    openModal(elements.guideModal, elements.guideModalContent);
  }
  function renderPracticeCases() {
    const cards = PRACTICE_CASES.map((item) => {
      const card = makeElement2("article", "practice-card");
      const placeholder = makeElement2("figure", "placeholder-image");
      const image = document.createElement("img");
      image.src =
        item.imageSrc || "./assets/placeholders/fundus-placeholder.svg";
      image.alt = "";
      image.loading = "eager";
      placeholder.append(
        image,
        makeElement2("figcaption", "", item.imageLabel),
      );
      const content = makeElement2("div", "practice-card-copy");
      content.append(
        makeElement2("h3", "", item.title),
        makeElement2("p", "", item.prompt),
        makeElement2("p", "", item.answer),
      );
      card.append(placeholder, content);
      return card;
    });
    elements.practiceCases.replaceChildren(...cards);
  }
  function openReferralNote() {
    elements.referralText.value = buildReferralNote(state, currentTriage);
    elements.copyStatus.textContent = "";
    openModal(elements.referralModal, elements.referralModalContent);
  }
  async function copyReferralNote() {
    elements.referralText.select();
    try {
      await navigator.clipboard.writeText(elements.referralText.value);
      elements.copyStatus.textContent = "Copied.";
    } catch (e) {
      document.execCommand("copy");
      elements.copyStatus.textContent = "Copied.";
    }
  }
  function setupEventHandlers() {
    const drawerController = setupDrawer({
      menuButton: $("#menuButton"),
      closeButton: $("#closeDrawerButton"),
      drawer: $("#sideMenu"),
      overlay: $("#drawerOverlay"),
    });
    setupInfoPopup({
      button: $("#infoButton"),
      popup: $("#infoPopup"),
      closeButton: $("#closeInfoButton"),
    });
    setupTabs({
      tabs: $$(".tab-btn[data-tab-target]"),
      panels: $$(".mode-panel"),
      onChange: (mode) => {
        setMode(state, mode);
        render();
      },
    });
    elements.dilationSwitch.addEventListener("click", (event) => {
      event.preventDefault();
      setDilation(state, state.dilation === "yes" ? "no" : "yes");
      render();
    });
    elements.dilationToggle.addEventListener("change", () => {
      setDilation(state, elements.dilationToggle.checked ? "yes" : "no");
      render();
    });
    elements.rightDistanceVA.addEventListener("change", () => {
      setDistanceVA(state, "right", elements.rightDistanceVA.value);
      render();
    });
    elements.leftDistanceVA.addEventListener("change", () => {
      setDistanceVA(state, "left", elements.leftDistanceVA.value);
      render();
    });
    elements.rightViewStatusSelect.addEventListener("change", () => {
      applyViewStatus("right", elements.rightViewStatusSelect.value);
      render();
    });
    elements.leftViewStatusSelect.addEventListener("change", () => {
      applyViewStatus("left", elements.leftViewStatusSelect.value);
      render();
    });
    $$("[data-systemic]").forEach((input) => {
      input.addEventListener("change", () => {
        setSystemicCheck(state, input.dataset.systemic, input.checked);
        render();
      });
    });
    elements.actionToggle.addEventListener("click", () => {
      actionExpanded = !actionExpanded;
      renderAction();
    });
    $("#referralNoteButton").addEventListener("click", openReferralNote);
    $("#closeReferralButton").addEventListener("click", () =>
      closeModal(elements.referralModal),
    );
    $("#copyReferralButton").addEventListener("click", copyReferralNote);
    $("#closePracticeButton").addEventListener("click", () =>
      closeModal(elements.practiceModal),
    );
    $("#closeGuideButton").addEventListener("click", () =>
      closeModal(elements.guideModal),
    );
    $("[data-practice-open]").addEventListener("click", () => {
      drawerController.close();
      renderPracticeCases();
      openModal(elements.practiceModal, elements.practiceModalContent);
    });
    $$("[data-guide]").forEach((button) => {
      button.addEventListener("click", () => {
        drawerController.close();
        openGuide(button.dataset.guide);
      });
    });
    const mcqController = createMcqController({
      modal: $("#mcqModal"),
      modalContent: $("#mcqModalContent"),
      title: $("#mcqTitle"),
      intro: $("#mcqIntro"),
      container: $("#mcqContainer"),
      submit: $("#submitMcqButton"),
      result: $("#mcqResult"),
      close: $("#closeMcqButton"),
    });
    $$("[data-mcq-level]").forEach((button) => {
      button.addEventListener("click", () => {
        drawerController.close();
        mcqController.open(button.dataset.mcqLevel);
      });
    });
    document.addEventListener("keydown", (event) => {
      if (event.key !== "Escape") return;
      [
        elements.referralModal,
        elements.practiceModal,
        elements.guideModal,
        $("#mcqModal"),
      ].forEach((modal) => closeModal(modal));
    });
  }
  function init() {
    populateVaSelect(elements.rightDistanceVA);
    populateVaSelect(elements.leftDistanceVA);
    setupEventHandlers();
    const mcqValidation = validateMcqBanks();
    mcqValidation.forEach((result) => {
      if (result.actual !== result.expected || result.invalidAnswers > 0) {
        console.warn("MCQ validation issue", result);
      }
    });
    render();
  }
  init();
})();
