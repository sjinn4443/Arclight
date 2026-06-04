import {
  BACK_EXPLANATION_HTML_BY_SELECTION,
  CATARACT_EXPLANATION_HTML_BY_PHENOTYPE,
  CONSISTENCY_WARNING_TEXT_BY_CODE,
  NOTE_PRIORITY_BY_CODE,
  getActionText,
  getNoteText,
} from "./cataract-copy.js";

function normalizeNearVaValue(value) {
  return (value || "").trim().toUpperCase();
}

const ACTION_COLOUR_RANK = {
  black: 0,
  green: 1,
  orange: 2,
  red: 3,
};

const CATARACT_CONFIDENCE_RANK = {
  definite: 0,
  probable: 1,
  possible_pupil: 2,
  possible_competing: 3,
};

const ROUTINE_REVIEW_ACTION_CODES = new Set([
  "cataract_routine",
  "cataract_early_review_va_6_6",
  "cataract_early_review_mild_va",
  "normal_reflex_mild_review",
  "normal_reflex_no_referral",
]);

const MAX_ACTION_NOTES_BY_COLOUR = {
  black: 0,
  green: 2,
  orange: 3,
  red: 3,
};

const REQUIRED_INPUT_KEYS = ["onset", "eyes", "distanceVA", "fundal", "back"];

const ASSESSMENT_FIELD_LABELS = {
  pain: "pain/redness",
  front: "front eye",
  rapd: "RAPD",
  light: "light direction",
};

function escalateActionColour(currentColour, nextColour) {
  const currentRank = ACTION_COLOUR_RANK[currentColour] ?? 0;
  const nextRank = ACTION_COLOUR_RANK[nextColour] ?? currentRank;
  return nextRank > currentRank ? nextColour : currentColour;
}

function deriveInitialCataractType(fundalSelection) {
  if (fundalSelection === "normal") {
    return "Normal";
  }
  if (fundalSelection === "white") {
    return "Mature";
  }
  if (fundalSelection === "dark") {
    return "Nuclear";
  }
  if (fundalSelection === "patches") {
    return "Cortical";
  }
  if (fundalSelection === "spots") {
    return "Subcapsular";
  }
  return "";
}

function deriveNearVaNoteCode(nearVAValue) {
  switch (nearVAValue) {
    case "N8":
      return "near_va_n8";
    case "N12":
      return "near_va_n12";
    case "N18":
      return "near_va_n18";
    case "N36":
      return "near_va_n36";
    default:
      return "";
  }
}

function deriveCataractDisplayType(cataractPhenotype, confidenceLabel) {
  if (cataractPhenotype === "Nil") {
    return "Nil";
  }

  if (confidenceLabel === "probable") {
    return `Probable ${cataractPhenotype}`;
  }

  if (confidenceLabel === "possible_pupil") {
    return `Possible ${cataractPhenotype} (also pupil abnormality)`;
  }

  if (confidenceLabel === "possible_competing") {
    return `Possible ${cataractPhenotype} (other urgent pathology suspected)`;
  }

  return cataractPhenotype;
}

function applyActionNotePolicy(actionNoteCodes, actionColour) {
  const maxNotes = MAX_ACTION_NOTES_BY_COLOUR[actionColour] ?? 3;
  let filteredCodes = [...actionNoteCodes];

  if (actionColour === "red") {
    // In urgent outputs, hide low-yield near-VA detail to keep messages snappy.
    filteredCodes = filteredCodes.filter(
      (code) => !code.startsWith("near_va_"),
    );
  }

  if (maxNotes <= 0) {
    return [];
  }

  return filteredCodes.slice(0, maxNotes);
}

function formatPlainList(items) {
  if (items.length <= 1) {
    return items[0] || "";
  }

  if (items.length === 2) {
    return `${items[0]} and ${items[1]}`;
  }

  return `${items.slice(0, -1).join(", ")} and ${items[items.length - 1]}`;
}

function buildMissingAssessmentNote(missingAssessmentFieldKeys) {
  const labels = missingAssessmentFieldKeys
    .map((fieldKey) => ASSESSMENT_FIELD_LABELS[fieldKey])
    .filter(Boolean);

  if (labels.length === 0) {
    return getNoteText("assessment_incomplete_record_fields");
  }

  const checkLabel = labels.length === 1 ? "check" : "checks";
  return `Record missing ${checkLabel}: ${formatPlainList(labels)}.`;
}

function deriveConsistencyWarnings({
  onsetValue,
  eyes,
  painYes,
  normalizedNearVa,
  isPresbyopicAge,
  hasNonPaediatricAgeBand,
  hasFixFollowDistanceVa,
  hasAbnormalFundal,
  hasWhiteFundal,
  hasPosteriorPriorityDisease,
  hasPoorView,
  hasMildDistanceLoss,
  hasModerateDistanceLoss,
  hasSevereDistanceLoss,
  hasGoodDistanceVision,
  hasPainfulSuddenUnilateral,
}) {
  const warnings = [];
  const warningFields = new Set();

  function addWarning(code, fields) {
    warnings.push(code);
    fields.forEach((field) => warningFields.add(field));
  }

  if (hasNonPaediatricAgeBand && hasFixFollowDistanceVa) {
    addWarning("fix_follow_with_non_child_age", ["distanceVA", "age"]);
  }

  if (
    !hasAbnormalFundal &&
    (hasModerateDistanceLoss || hasSevereDistanceLoss)
  ) {
    addWarning("normal_reflex_with_reduced_va", ["distanceVA", "fundal"]);
  }

  if (hasWhiteFundal && (hasGoodDistanceVision || hasMildDistanceLoss)) {
    addWarning("white_reflex_with_relatively_good_va", [
      "distanceVA",
      "fundal",
    ]);
  } else if (
    hasAbnormalFundal &&
    hasGoodDistanceVision &&
    !hasPosteriorPriorityDisease
  ) {
    addWarning("abnormal_reflex_with_va_6_6", ["distanceVA", "fundal"]);
  }

  const hasNearRecorded = Boolean(normalizedNearVa);
  const hasGoodNearVision =
    normalizedNearVa === "N5" || normalizedNearVa === "N8";
  const hasPoorNearVision =
    normalizedNearVa === "N18" || normalizedNearVa === "N36";
  if (
    hasNearRecorded &&
    hasGoodDistanceVision &&
    hasPoorNearVision &&
    !isPresbyopicAge
  ) {
    addWarning("near_poor_with_good_distance", ["distanceVA", "near"]);
  }
  if (
    hasNearRecorded &&
    hasGoodNearVision &&
    (hasSevereDistanceLoss || hasModerateDistanceLoss)
  ) {
    addWarning("near_good_with_poor_distance", ["distanceVA", "near"]);
  }

  if (
    onsetValue === "sudden" &&
    hasAbnormalFundal &&
    !hasPosteriorPriorityDisease &&
    !hasPainfulSuddenUnilateral
  ) {
    addWarning("sudden_onset_with_cataract_pattern", ["onset"]);
  }

  if (
    Boolean(painYes) &&
    hasAbnormalFundal &&
    !hasPosteriorPriorityDisease &&
    !hasPainfulSuddenUnilateral
  ) {
    addWarning("pain_with_cataract_pattern", ["pain", "fundal"]);
  }

  if (!hasAbnormalFundal && hasPoorView) {
    addWarning("normal_reflex_with_poor_back_view", ["fundal", "back"]);
  }

  if (Boolean(painYes) && !eyes && !hasPosteriorPriorityDisease) {
    addWarning("pain_without_eye_count", ["eyes", "pain"]);
  }

  const WARNING_PRIORITY = {
    pain_without_eye_count: 0,
    fix_follow_with_non_child_age: 1,
    normal_reflex_with_reduced_va: 2,
    normal_reflex_with_poor_back_view: 3,
    white_reflex_with_relatively_good_va: 4,
    abnormal_reflex_with_va_6_6: 5,
    near_poor_with_good_distance: 6,
    near_good_with_poor_distance: 6,
    sudden_onset_with_cataract_pattern: 7,
    pain_with_cataract_pattern: 8,
  };

  const sortedWarningCodes = [...warnings].sort((left, right) => {
    const leftPriority = WARNING_PRIORITY[left] ?? 99;
    const rightPriority = WARNING_PRIORITY[right] ?? 99;
    return leftPriority - rightPriority;
  });

  const displayCodes = sortedWarningCodes.slice(0, 2);

  return {
    messages: displayCodes
      .map((code) => CONSISTENCY_WARNING_TEXT_BY_CODE[code])
      .filter(Boolean),
    codes: warnings,
    displayCodes,
    fields: [...warningFields],
  };
}

function buildNoResultDecision(missingFields) {
  return {
    hasResult: false,
    actionCode: "incomplete_input",
    actionTextCode: "incomplete_input",
    severityRank: ACTION_COLOUR_RANK.black,
    flags: ["incomplete_input"],
    ruleTrace: ["input:incomplete"],
    missingFields,
    requiredInputKeys: REQUIRED_INPUT_KEYS,
    cataractType: "",
    cataractPhenotype: "",
    cataractConfidenceLabel: "",
    actionText: "",
    actionNotes: [],
    actionNoteCodes: [],
    actionColour: "black",
    recheckFieldKeys: [],
    urgencyNote: "",
    urgencyNoteColour: "",
    explanations: { cataract: "", back: "" },
  };
}

function buildExplanations(cataractPhenotype, backSelection) {
  const cataract =
    CATARACT_EXPLANATION_HTML_BY_PHENOTYPE[cataractPhenotype] || "";
  const back = BACK_EXPLANATION_HTML_BY_SELECTION[backSelection] || "";
  return { cataract, back };
}

export function evaluateCataractDecision({
  onsetValue,
  ageBand,
  distanceVA,
  nearVAValue,
  eyes,
  painYes,
  painRecorded,
  pupilSelected,
  pupilRecorded,
  pupilAbnormal,
  frontPresent,
  frontRecorded,
  rapdPresent,
  rapdRecorded,
  directionLightPoor,
  lightRecorded,
  fundalSelection,
  backSelection,
}) {
  const missingFields = [];
  if (!onsetValue) {
    missingFields.push("onset");
  }
  if (!eyes) {
    missingFields.push("eyes");
  }
  if (!distanceVA) {
    missingFields.push("distanceVA");
  }
  if (!fundalSelection) {
    missingFields.push("fundal");
  }
  if (!backSelection) {
    missingFields.push("back");
  }
  if (missingFields.length > 0) {
    return buildNoResultDecision(missingFields);
  }

  const normalizedAgeBand = ageBand === "teenager" ? "adolescent" : ageBand;

  const normalizedBackSelection =
    fundalSelection === "white" && backSelection !== "poor view"
      ? "poor view"
      : backSelection;
  const wasWhiteBackNormalized = normalizedBackSelection !== backSelection;
  const isPainRecorded =
    typeof painRecorded === "boolean" ? painRecorded : true;
  const isPupilRecorded =
    Boolean(pupilAbnormal) ||
    (typeof pupilRecorded === "boolean" ? pupilRecorded : true);
  const isFrontRecorded =
    typeof frontRecorded === "boolean" ? frontRecorded : true;
  const isRapdRecorded =
    typeof rapdRecorded === "boolean" ? rapdRecorded : true;
  const isLightRecorded =
    typeof lightRecorded === "boolean" ? lightRecorded : true;
  const missingAssessmentFieldKeys = [];
  if (!isPainRecorded) {
    missingAssessmentFieldKeys.push("pain");
  }
  if (!isFrontRecorded) {
    missingAssessmentFieldKeys.push("front");
  }
  if (!isRapdRecorded) {
    missingAssessmentFieldKeys.push("rapd");
  }
  if (!isLightRecorded) {
    missingAssessmentFieldKeys.push("light");
  }

  const flags = new Set();
  const ruleTrace = ["input:complete"];
  if (wasWhiteBackNormalized) {
    flags.add("normalized_white_back_forced_poor_view");
    ruleTrace.push("input:normalized_white_back");
  }
  let actionCode = "";
  let actionTextCode = "";
  let cataractPhenotype = deriveInitialCataractType(fundalSelection);
  let cataractConfidenceLabel = "definite";
  const hasPosteriorPriorityDisease = [
    "cupping",
    "diabetic",
    "detached",
  ].includes(normalizedBackSelection);
  const hasWhiteFundal = fundalSelection === "white";
  const hasAbnormalFundal = fundalSelection !== "normal";
  const hasPoorView = normalizedBackSelection === "poor view";
  const isDistanceVaUntestable = distanceVA === "unable_test";
  const hasFixFollowDistanceVa =
    distanceVA === "fix_follow_good" || distanceVA === "fix_follow_poor";
  const hasSevereDistanceLoss =
    distanceVA === "HM" ||
    distanceVA === "6/60" ||
    distanceVA === "fix_follow_poor" ||
    isDistanceVaUntestable;
  const hasModerateDistanceLoss = distanceVA === "6/36";
  const hasMildDistanceLoss =
    distanceVA === "6/12" || distanceVA === "fix_follow_good";
  const hasGoodDistanceVision = distanceVA === "6/6";
  const isPaediatric = ["baby", "child", "adolescent"].includes(
    normalizedAgeBand,
  );
  const hasNonPaediatricAgeBand = Boolean(normalizedAgeBand) && !isPaediatric;
  const isPresbyopicAge = ["middle_aged", "elderly", "very_elderly"].includes(
    normalizedAgeBand,
  );
  const isYoungerAdult = ["young_adult", "adult"].includes(normalizedAgeBand);

  if (fundalSelection === "normal") {
    cataractPhenotype = "Nil";
    ruleTrace.push("phenotype:normal_reflex");
  } else {
    ruleTrace.push("phenotype:abnormal_reflex");
  }

  let actionColour = "black";
  let actionNoteCodes = [];
  const dynamicNoteTextByCode = new Map();

  function setAction(code, colour) {
    actionCode = code;
    actionTextCode = code;
    if (colour) {
      actionColour = colour;
    }
  }

  function pushNoteCode(code) {
    if (code && !actionNoteCodes.includes(code)) {
      actionNoteCodes.push(code);
    }
  }

  if (hasPosteriorPriorityDisease) {
    // Posterior pathology dominates the current decision; avoid mixed cataract-type messaging.
    cataractPhenotype = "Nil";
    cataractConfidenceLabel = "definite";
    const posteriorBaseColour =
      normalizedBackSelection === "detached" ? "red" : "orange";
    setAction("posterior_disease_first", posteriorBaseColour);
    flags.add("posterior_priority");
    if (posteriorBaseColour === "red") {
      flags.add("urgent_signal");
    }
    ruleTrace.push("core:posterior_override");
  } else if (!hasAbnormalFundal) {
    ruleTrace.push("core:normal_reflex_pathway");
    if (isDistanceVaUntestable) {
      setAction("normal_reflex_untestable_va_early", "orange");
      flags.add("non_cataract_consideration");
      ruleTrace.push("va:untestable");
    } else if (hasSevereDistanceLoss) {
      setAction("normal_reflex_very_poor_va_early", "orange");
      flags.add("non_cataract_consideration");
      ruleTrace.push("va:severe_loss");
    } else if (hasModerateDistanceLoss) {
      setAction("normal_reflex_reduced_va_recheck", "orange");
      flags.add("non_cataract_consideration");
      ruleTrace.push("va:moderate_loss");
    } else if (hasMildDistanceLoss) {
      setAction("normal_reflex_mild_review", "orange");
      ruleTrace.push("va:mild_loss");
    } else {
      setAction("normal_reflex_no_referral", "black");
      ruleTrace.push("va:good");
    }
  } else {
    ruleTrace.push("core:abnormal_reflex_pathway");
    if (hasWhiteFundal) {
      setAction("cataract_priority_white", "red");
      flags.add("urgent_signal");
      ruleTrace.push("reflex:white");
    } else if (hasPoorView) {
      setAction("cataract_poor_view_assessment", "orange");
      ruleTrace.push("reflex:poor_view");
    } else {
      setAction("cataract_routine", "green");
      ruleTrace.push("reflex:non_white_abnormal");
    }

    if (!hasWhiteFundal) {
      if (isDistanceVaUntestable) {
        setAction("cataract_untestable_va_assess", "orange");
        ruleTrace.push("va:untestable");
      } else if (hasSevereDistanceLoss) {
        setAction("cataract_priority_very_poor_va", "orange");
        ruleTrace.push("va:severe_loss");
      } else if (hasModerateDistanceLoss && !hasPoorView) {
        setAction("cataract_early_referral_reduced_va", "orange");
        ruleTrace.push("va:moderate_loss");
      } else if (hasMildDistanceLoss && !hasPoorView) {
        setAction("cataract_early_review_mild_va", "orange");
        ruleTrace.push("va:mild_loss");
      } else if (hasGoodDistanceVision && !hasPoorView) {
        setAction("cataract_early_review_va_6_6", "orange");
        ruleTrace.push("va:good");
      }
    }
  }

  const normalizedNearVa = normalizeNearVaValue(nearVAValue);

  if (isPaediatric) {
    flags.add("age_child");
    ruleTrace.push("age:child");

    if (hasPosteriorPriorityDisease) {
      pushNoteCode("child_case_posterior_review");
      ruleTrace.push("age:child_posterior_note");
    } else if (hasAbnormalFundal) {
      actionColour = escalateActionColour(
        actionColour,
        hasWhiteFundal ? "red" : "orange",
      );
      if (actionCode !== "urgent_same_day_investigation") {
        setAction("child_cataract_prompt_referral", actionColour);
      }
      pushNoteCode("child_cataract_delay_risk");
      ruleTrace.push("age:child_cataract_adjustment");
    } else if (!hasGoodDistanceVision) {
      actionColour = escalateActionColour(actionColour, "orange");
      if (actionCode !== "urgent_same_day_investigation") {
        setAction("child_reduced_vision_early_assessment", actionColour);
      }
      pushNoteCode("child_reduced_vision_early_review");
      ruleTrace.push("age:child_reduced_vision_adjustment");
    }
  } else if (
    isYoungerAdult &&
    hasAbnormalFundal &&
    !hasPosteriorPriorityDisease
  ) {
    pushNoteCode("younger_age_secondary_causes");
    flags.add("age_younger_atypical");
    ruleTrace.push("age:younger_atypical_note");
  }

  if (hasPosteriorPriorityDisease) {
    if (normalizedBackSelection === "detached") {
      pushNoteCode("posterior_detached_same_day");
    } else if (normalizedBackSelection === "diabetic") {
      pushNoteCode("posterior_diabetic_first");
    } else if (normalizedBackSelection === "cupping") {
      pushNoteCode("posterior_cupping_glaucoma");
    }
  }

  if (normalizedNearVa && normalizedNearVa !== "N5") {
    const nearVaNoteCode = deriveNearVaNoteCode(normalizedNearVa);
    if (nearVaNoteCode) {
      pushNoteCode(nearVaNoteCode);
      flags.add("near_va_modifier");
      ruleTrace.push("near_va:modifier_added");
    }
  }

  function escalateCataractConfidence(nextConfidenceLabel) {
    const currentRank = CATARACT_CONFIDENCE_RANK[cataractConfidenceLabel] ?? 0;
    const nextRank =
      CATARACT_CONFIDENCE_RANK[nextConfidenceLabel] ?? currentRank;
    if (nextRank > currentRank) {
      cataractConfidenceLabel = nextConfidenceLabel;
    }
  }

  const hasPainfulSuddenUnilateral =
    eyes === "one" && onsetValue === "sudden" && Boolean(painYes);
  if (hasPainfulSuddenUnilateral) {
    actionColour = escalateActionColour(actionColour, "red");
    flags.add("urgent_signal");
    flags.add("painful_sudden_unilateral");
    ruleTrace.push("safety:painful_sudden_unilateral");
    if (cataractPhenotype !== "Nil") {
      escalateCataractConfidence("possible_competing");
      flags.add("competing_pathology");
    }
  }

  if (!isPupilRecorded) {
    if (hasAbnormalFundal && cataractPhenotype !== "Nil") {
      escalateCataractConfidence("probable");
      flags.add("pupil_not_recorded");
      ruleTrace.push("pupil:not_recorded");
    }
  } else if (pupilAbnormal) {
    pushNoteCode("pupil_abnormal_review");
    actionColour = escalateActionColour(actionColour, "orange");
    flags.add("pupil_abnormal");
    flags.add("urgent_signal");
    ruleTrace.push("pupil:abnormal");
    if (cataractPhenotype !== "Nil") {
      escalateCataractConfidence("possible_pupil");
    }
  }

  if (frontPresent) {
    pushNoteCode("front_abnormal_prognosis_limited");
    actionColour = escalateActionColour(actionColour, "orange");
    flags.add("front_abnormal");
    ruleTrace.push("front:abnormal");
  }

  const hasNeuroRedFlags = Boolean(rapdPresent) || Boolean(directionLightPoor);
  if (hasNeuroRedFlags) {
    pushNoteCode("neuro_red_flags");
    actionColour = escalateActionColour(actionColour, "orange");
    flags.add("neuro_red_flags");
    if (rapdPresent) {
      flags.add("rapd_present");
    }
    if (directionLightPoor) {
      flags.add("direction_light_poor");
    }
    ruleTrace.push("neuro:red_flags");

    if (
      !hasPosteriorPriorityDisease &&
      !hasWhiteFundal &&
      actionCode !== "urgent_same_day_investigation"
    ) {
      setAction("rapd_non_cataract_first", actionColour);
      ruleTrace.push("neuro:main_action_override");
    }

    if (cataractPhenotype !== "Nil" && !hasPosteriorPriorityDisease) {
      escalateCataractConfidence("possible_competing");
      flags.add("competing_pathology");
      ruleTrace.push("neuro:competing_confidence");
    }
  }

  const consistencyWarnings = deriveConsistencyWarnings({
    onsetValue,
    eyes,
    painYes,
    normalizedNearVa,
    isPresbyopicAge,
    hasNonPaediatricAgeBand,
    hasFixFollowDistanceVa,
    hasAbnormalFundal,
    hasWhiteFundal,
    hasPosteriorPriorityDisease,
    hasPoorView,
    hasMildDistanceLoss,
    hasModerateDistanceLoss,
    hasSevereDistanceLoss,
    hasGoodDistanceVision,
    hasPainfulSuddenUnilateral,
  });
  if (consistencyWarnings.displayCodes.length > 0) {
    consistencyWarnings.displayCodes.forEach((code) => pushNoteCode(code));
    actionColour = escalateActionColour(actionColour, "orange");
    flags.add("consistency_warning");
    flags.add("requires_recheck");
    consistencyWarnings.codes.forEach((code) =>
      flags.add(`consistency:${code}`),
    );
    ruleTrace.push("consistency:warnings_added");
  }

  const hasWhiteRelativelyGoodVaMismatch = consistencyWarnings.codes.includes(
    "white_reflex_with_relatively_good_va",
  );
  const shouldUseWhiteMismatchRecheckOverride =
    hasWhiteRelativelyGoodVaMismatch &&
    actionCode === "cataract_priority_white" &&
    onsetValue === "gradual" &&
    !Boolean(painYes) &&
    !Boolean(pupilAbnormal) &&
    !Boolean(frontPresent) &&
    !hasNeuroRedFlags &&
    !isPaediatric;

  if (shouldUseWhiteMismatchRecheckOverride) {
    setAction("recheck_investigate_first", "orange");
    flags.add("white_relatively_good_va_recheck_override");
    flags.add("recheck_override");
    ruleTrace.push("consistency:white_relatively_good_va_override");
  }

  const recheckFieldSet = new Set(consistencyWarnings.fields);
  if (missingAssessmentFieldKeys.length > 0) {
    flags.add("incomplete_assessment");
    missingAssessmentFieldKeys.forEach((fieldKey) => {
      flags.add(`missing_assessment:${fieldKey}`);
    });
    ruleTrace.push("assessment:incomplete");

    if (actionColour !== "black") {
      flags.add("requires_recheck");
      dynamicNoteTextByCode.set(
        "assessment_incomplete_record_fields",
        buildMissingAssessmentNote(missingAssessmentFieldKeys),
      );
      pushNoteCode("assessment_incomplete_record_fields");
      missingAssessmentFieldKeys.forEach((fieldKey) =>
        recheckFieldSet.add(fieldKey),
      );
      ruleTrace.push("assessment:note_added");
    }
  }

  const hasHighRiskContext =
    onsetValue === "sudden" ||
    Boolean(painYes) ||
    Boolean(pupilAbnormal) ||
    Boolean(frontPresent) ||
    Boolean(rapdPresent) ||
    Boolean(directionLightPoor);
  if (
    flags.has("requires_recheck") &&
    hasHighRiskContext &&
    ROUTINE_REVIEW_ACTION_CODES.has(actionCode)
  ) {
    setAction("recheck_investigate_first", actionColour);
    actionColour = escalateActionColour(actionColour, "orange");
    flags.add("recheck_override");
    ruleTrace.push("consistency:high_risk_override");
  }

  let urgencyNoteCode = "";
  let urgencyNote = "";
  let urgencyNoteColour = "";
  if (Boolean(painYes) && onsetValue === "sudden") {
    urgencyNoteCode = "urgency_note_urgent";
    urgencyNote = getNoteText(urgencyNoteCode);
    urgencyNoteColour = "red";
    flags.add("urgent_signal");
    flags.add("urgency_note");
    ruleTrace.push("urgency:urgent_note");
  } else if (painYes || onsetValue === "sudden") {
    urgencyNoteCode = "urgency_note_early";
    urgencyNote = getNoteText(urgencyNoteCode);
    urgencyNoteColour = "orange";
    flags.add("urgency_note");
    ruleTrace.push("urgency:early_note");
  }

  if (urgencyNoteColour === "orange" || urgencyNoteColour === "red") {
    actionColour = escalateActionColour(actionColour, urgencyNoteColour);
    ruleTrace.push("urgency:colour_escalation");
  }

  if (
    urgencyNoteColour === "red" &&
    !hasPosteriorPriorityDisease &&
    actionCode !== "urgent_same_day_investigation"
  ) {
    setAction("urgent_same_day_investigation", "red");
    flags.add("urgent_main_action");
    ruleTrace.push("urgency:main_action_override");
  }

  if (
    actionCode === "urgent_same_day_investigation" &&
    cataractPhenotype !== "Nil" &&
    !hasPosteriorPriorityDisease
  ) {
    escalateCataractConfidence("possible_competing");
    flags.add("competing_pathology");
    ruleTrace.push("urgency:competing_confidence");
  }

  if (actionCode === "normal_reflex_no_referral" && actionColour !== "black") {
    actionTextCode = "normal_reflex_non_cataract_reframe";
    ruleTrace.push("core:normal_reflex_non_cataract_reframe");
  }

  if (
    urgencyNoteCode &&
    urgencyNoteColour &&
    !(
      urgencyNoteCode === "urgency_note_urgent" &&
      actionCode === "urgent_same_day_investigation"
    ) &&
    !actionNoteCodes.includes(urgencyNoteCode)
  ) {
    pushNoteCode(urgencyNoteCode);
    ruleTrace.push("urgency:note_added_to_checks");
  }

  if (
    actionCode === "urgent_same_day_investigation" &&
    !actionNoteCodes.includes("urgent_trigger_painful_one_or_sudden")
  ) {
    pushNoteCode("urgent_trigger_painful_one_or_sudden");
    ruleTrace.push("urgency:trigger_note_added");
  }

  if (actionColour === "red") {
    flags.add("urgent_signal");
  }

  actionNoteCodes.sort(
    (left, right) =>
      (NOTE_PRIORITY_BY_CODE[left] ?? 99) -
      (NOTE_PRIORITY_BY_CODE[right] ?? 99),
  );

  if (
    actionCode === "urgent_same_day_investigation" &&
    actionNoteCodes.length === 0
  ) {
    pushNoteCode("urgent_features_history_exam");
  }

  actionNoteCodes.sort(
    (left, right) =>
      (NOTE_PRIORITY_BY_CODE[left] ?? 99) -
      (NOTE_PRIORITY_BY_CODE[right] ?? 99),
  );

  const actionNoteCountBeforePolicy = actionNoteCodes.length;
  actionNoteCodes = applyActionNotePolicy(actionNoteCodes, actionColour);
  if (actionNoteCodes.length < actionNoteCountBeforePolicy) {
    flags.add("notes_trimmed");
    ruleTrace.push("notes:policy_trimmed");
  }

  const actionText = getActionText(actionTextCode || actionCode);
  const actionNotes = actionNoteCodes
    .map((code) => dynamicNoteTextByCode.get(code) || getNoteText(code))
    .filter(Boolean);
  const cataractType = deriveCataractDisplayType(
    cataractPhenotype,
    cataractConfidenceLabel,
  );

  return {
    hasResult: true,
    actionCode,
    actionTextCode: actionTextCode || actionCode,
    severityRank: ACTION_COLOUR_RANK[actionColour] ?? ACTION_COLOUR_RANK.black,
    flags: [...flags].sort(),
    ruleTrace,
    missingFields: [],
    requiredInputKeys: REQUIRED_INPUT_KEYS,
    cataractType,
    cataractPhenotype,
    cataractConfidenceLabel,
    actionText,
    actionNotes,
    actionNoteCodes,
    actionColour,
    recheckFieldKeys: [...recheckFieldSet],
    urgencyNote,
    urgencyNoteColour,
    explanations: buildExplanations(cataractPhenotype, normalizedBackSelection),
  };
}
