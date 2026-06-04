"use strict";
(() => {
  // src/dom-utils.js
  function $(selector, root = document) {
    return root.querySelector(selector);
  }
  function $$(selector, root = document) {
    return Array.from(root.querySelectorAll(selector));
  }

  // src/cataract-copy.js
  var ACTION_TEXT_BY_CODE = {
    incomplete_input: "",
    posterior_disease_first: "Treat posterior eye disease first.",
    normal_reflex_very_poor_va_early:
      "Very poor VA, normal reflex: early specialist review.",
    normal_reflex_untestable_va_early:
      "Distance VA not testable: early specialist review.",
    normal_reflex_reduced_va_recheck:
      "Reduced VA, normal reflex: check non-cataract causes.",
    normal_reflex_mild_review:
      "Mild VA drop, normal reflex: review and re-check.",
    normal_reflex_no_referral: "No cataract referral.",
    normal_reflex_non_cataract_reframe:
      "No cataract referral now. Investigate non-cataract causes.",
    cataract_priority_white: "Priority cataract referral.",
    cataract_poor_view_assessment: "Assess further before cataract referral.",
    cataract_routine: "Routine cataract referral.",
    cataract_priority_very_poor_va:
      "Early cataract referral: very poor distance VA.",
    cataract_untestable_va_assess:
      "Distance VA not testable: assess before cataract referral.",
    cataract_early_referral_reduced_va:
      "Early cataract referral: reduced distance VA.",
    cataract_early_review_mild_va: "Early cataract review: mild VA reduction.",
    cataract_early_review_va_6_6:
      "Review in 12 months: cataract changes with VA 6/6.",
    child_cataract_prompt_referral:
      "Child cataract signs: prompt paediatric referral.",
    child_reduced_vision_early_assessment:
      "Child reduced vision: early specialist assessment.",
    rapd_non_cataract_first: "Neuro red flags: investigate non-cataract cause.",
    recheck_investigate_first: "Re-check key findings first.",
    urgent_same_day_investigation: "Urgent same-day investigation needed.",
  };
  var CONSISTENCY_WARNING_TEXT_BY_CODE = {
    fix_follow_with_non_child_age:
      "Fix/Follow is usually for young children; re-check age or VA method.",
    normal_reflex_with_reduced_va:
      "VA low but reflex normal; check other causes.",
    white_reflex_with_relatively_good_va:
      "Dense reflex with relatively good VA is unusual; re-check both.",
    abnormal_reflex_with_va_6_6:
      "Reflex change + VA 6/6 is unusual; re-check both.",
    near_poor_with_good_distance:
      "Distance good but near poor: check presbyopia/refract.",
    near_good_with_poor_distance:
      "Distance poor but near good: re-check VA method/refraction.",
    sudden_onset_with_cataract_pattern:
      "Cataract is usually gradual; re-check onset.",
    pain_with_cataract_pattern: "Pain/redness may mean another cause.",
    normal_reflex_with_poor_back_view:
      "Normal reflex with poor back view is unusual; re-check both.",
    pain_without_eye_count: "Set one eye or two eyes to interpret pain.",
  };
  var NOTE_TEXT_BY_CODE = {
    child_case_posterior_review:
      "Child case: paediatric ophthalmology after posterior review.",
    child_cataract_delay_risk: "Can affect visual development; avoid delay.",
    child_reduced_vision_early_review: "Risk of amblyopia; avoid delay.",
    younger_age_secondary_causes:
      "Younger age is less typical for cataract; check other causes.",
    posterior_detached_same_day:
      "Detached retina suspected: same-day retinal assessment.",
    posterior_diabetic_first:
      "Treat retinal disease/scarring before cataract decisions.",
    posterior_cupping_glaucoma:
      "Deep cupping suggests glaucoma; prioritise glaucoma review.",
    near_va_n8: "Near VA slightly reduced.",
    near_va_n12: "Near VA reduced.",
    near_va_n18: "Near VA poor.",
    near_va_n36: "Near VA very poor.",
    pupil_abnormal_review: "Abnormal pupils: prompt specialist review.",
    front_abnormal_prognosis_limited:
      "Front eye scar/distortion may limit vision gain.",
    neuro_red_flags: "Check retina/optic nerve before cataract pathway.",
    urgency_note_urgent: "Urgent same-day investigation needed.",
    urgency_note_early: "Early review advised.",
    urgent_trigger_painful_one_or_sudden:
      "Urgent trigger: sudden painful vision loss.",
    urgent_features_history_exam: "Urgent features on history/exam.",
    assessment_incomplete_record_fields: "Record missing checks.",
  };
  var NOTE_PRIORITY_BY_CODE = {
    posterior_detached_same_day: 0,
    posterior_diabetic_first: 1,
    posterior_cupping_glaucoma: 2,
    child_cataract_delay_risk: 3,
    child_reduced_vision_early_review: 4,
    child_case_posterior_review: 5,
    urgent_trigger_painful_one_or_sudden: 6,
    urgency_note_urgent: 7,
    fix_follow_with_non_child_age: 8,
    normal_reflex_with_reduced_va: 8,
    white_reflex_with_relatively_good_va: 8,
    abnormal_reflex_with_va_6_6: 8,
    near_poor_with_good_distance: 9,
    near_good_with_poor_distance: 9,
    sudden_onset_with_cataract_pattern: 8,
    pain_with_cataract_pattern: 8,
    normal_reflex_with_poor_back_view: 8,
    urgency_note_early: 9,
    pain_without_eye_count: 10,
    assessment_incomplete_record_fields: 10,
    neuro_red_flags: 11,
    pupil_abnormal_review: 12,
    front_abnormal_prognosis_limited: 13,
    younger_age_secondary_causes: 14,
    near_va_n8: 15,
    near_va_n12: 15,
    near_va_n18: 15,
    near_va_n36: 15,
    urgent_features_history_exam: 16,
  };
  var CATARACT_EXPLANATION_HTML_BY_PHENOTYPE = {
    Nuclear:
      "<p>Nuclear: central lens opacity causing blur, usually age-related. Surgery usually helps.</p>",
    Cortical:
      "<p>Cortical: spoke-like peripheral opacities causing blur and glare. Surgery usually helps.</p>",
    Subcapsular:
      "<p>Subcapsular: posterior opacities causing glare and near blur. Surgery usually helps.</p>",
    Mature:
      "<p>Mature: dense white lens with severe vision loss. Prompt surgery helps avoid complications.</p>",
  };
  var BACK_EXPLANATION_HTML_BY_SELECTION = {
    cupping:
      "<p>Deep disc cupping suggests advanced glaucoma. Urgent glaucoma review is needed.</p>",
    diabetic:
      "<p>Diabetic retinopathy needs treatment to protect vision. Cataract surgery may not help now.</p>",
    "poor view":
      "<p>Poor view may be due to dense cataract, retinal detachment, or vitreous haemorrhage. Review further.</p>",
    detached:
      "<p>Fresh retinal detachment needs immediate repair. Cataract surgery is unlikely to help first.</p>",
  };
  function getActionText(actionCode) {
    return ACTION_TEXT_BY_CODE[actionCode] || "";
  }
  function getNoteText(noteCode) {
    return (
      NOTE_TEXT_BY_CODE[noteCode] ||
      CONSISTENCY_WARNING_TEXT_BY_CODE[noteCode] ||
      ""
    );
  }

  // src/cataract-engine.js?v=20260511-1
  function normalizeNearVaValue(value) {
    return (value || "").trim().toUpperCase();
  }
  var ACTION_COLOUR_RANK = {
    black: 0,
    green: 1,
    orange: 2,
    red: 3,
  };
  var CATARACT_CONFIDENCE_RANK = {
    definite: 0,
    probable: 1,
    possible_pupil: 2,
    possible_competing: 3,
  };
  var ROUTINE_REVIEW_ACTION_CODES = /* @__PURE__ */ new Set([
    "cataract_routine",
    "cataract_early_review_va_6_6",
    "cataract_early_review_mild_va",
    "normal_reflex_mild_review",
    "normal_reflex_no_referral",
  ]);
  var MAX_ACTION_NOTES_BY_COLOUR = {
    black: 0,
    green: 2,
    orange: 3,
    red: 3,
  };
  var REQUIRED_INPUT_KEYS = ["onset", "eyes", "distanceVA", "fundal", "back"];
  var ASSESSMENT_FIELD_LABELS = {
    pain: "pain/redness",
    front: "front eye",
    rapd: "RAPD",
    light: "light direction",
  };
  function escalateActionColour(currentColour, nextColour) {
    var _a, _b;
    const currentRank =
      (_a = ACTION_COLOUR_RANK[currentColour]) != null ? _a : 0;
    const nextRank =
      (_b = ACTION_COLOUR_RANK[nextColour]) != null ? _b : currentRank;
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
    var _a;
    const maxNotes =
      (_a = MAX_ACTION_NOTES_BY_COLOUR[actionColour]) != null ? _a : 3;
    let filteredCodes = [...actionNoteCodes];
    if (actionColour === "red") {
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
    const warningFields = /* @__PURE__ */ new Set();
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
      var _a, _b;
      const leftPriority = (_a = WARNING_PRIORITY[left]) != null ? _a : 99;
      const rightPriority = (_b = WARNING_PRIORITY[right]) != null ? _b : 99;
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
  function evaluateCataractDecision({
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
    var _a;
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
    const flags = /* @__PURE__ */ new Set();
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
    const dynamicNoteTextByCode = /* @__PURE__ */ new Map();
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
      var _a2, _b;
      const currentRank =
        (_a2 = CATARACT_CONFIDENCE_RANK[cataractConfidenceLabel]) != null
          ? _a2
          : 0;
      const nextRank =
        (_b = CATARACT_CONFIDENCE_RANK[nextConfidenceLabel]) != null
          ? _b
          : currentRank;
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
    const hasNeuroRedFlags =
      Boolean(rapdPresent) || Boolean(directionLightPoor);
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
    if (
      actionCode === "normal_reflex_no_referral" &&
      actionColour !== "black"
    ) {
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
    actionNoteCodes.sort((left, right) => {
      var _a2, _b;
      return (
        ((_a2 = NOTE_PRIORITY_BY_CODE[left]) != null ? _a2 : 99) -
        ((_b = NOTE_PRIORITY_BY_CODE[right]) != null ? _b : 99)
      );
    });
    if (
      actionCode === "urgent_same_day_investigation" &&
      actionNoteCodes.length === 0
    ) {
      pushNoteCode("urgent_features_history_exam");
    }
    actionNoteCodes.sort((left, right) => {
      var _a2, _b;
      return (
        ((_a2 = NOTE_PRIORITY_BY_CODE[left]) != null ? _a2 : 99) -
        ((_b = NOTE_PRIORITY_BY_CODE[right]) != null ? _b : 99)
      );
    });
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
      severityRank:
        (_a = ACTION_COLOUR_RANK[actionColour]) != null
          ? _a
          : ACTION_COLOUR_RANK.black,
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
      explanations: buildExplanations(
        cataractPhenotype,
        normalizedBackSelection,
      ),
    };
  }

  // src/cataract-copy.js?v=20260511-2
  var UI_COPY = {
    result: {
      cataractTypeLabel: "Cataract Type",
      nextStepLabel: "Next Step",
      checkLabel: "Check",
    },
    fundalHint: "Dilate pupils for best view",
    infoPopup: {
      intro: "Quick cataract triage in seconds.",
      bullets: [
        "History + VA: onset, one or two eyes, pain, age, distance VA and near VA.",
        "Front: pupils, cornea/scar and RAPD or poor light direction.",
        "Reflex: Normal, Dull, Patches, Spots or Dense.",
        "Back: Normal, Cupped, DR/Scar, Detached or Poor view.",
        "Result: cataract type, next step and short re-checks.",
      ],
      outro:
        "Teaching aid, not final diagnosis. Look for non-cataract disease when features are atypical or urgent.",
    },
  };

  // src/cataract-controller.js?v=20260511-6
  var NEUTRAL_BORDER_COLOR = "#ccc";
  var FUNDAL_BORDER_COLORS = {
    normal: "green",
    dark: "orange",
    patches: "orange",
    spots: "orange",
    white: "red",
  };
  var BACK_BORDER_COLORS = {
    normal: "green",
    detached: "red",
    cupping: "orange",
    diabetic: "orange",
    "poor view": "orange",
  };
  var MAX_DISPLAY_NOTES = 3;
  var NOTE_DEDUP_STOPWORDS = /* @__PURE__ */ new Set([
    "a",
    "an",
    "and",
    "are",
    "as",
    "at",
    "be",
    "before",
    "both",
    "by",
    "can",
    "consider",
    "for",
    "first",
    "from",
    "in",
    "is",
    "it",
    "key",
    "needed",
    "no",
    "not",
    "now",
    "of",
    "on",
    "or",
    "re",
    "review",
    "same",
    "step",
    "the",
    "to",
    "up",
    "with",
  ]);
  function normalizeSnippet(text) {
    return String(text || "")
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, " ")
      .trim();
  }
  function compactNoteText(note) {
    const trimmed = String(note || "").trim();
    return trimmed;
  }
  function getMeaningfulTokenSet(text) {
    const tokens = String(text || "")
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, " ")
      .split(" ")
      .map((token) => token.trim())
      .filter((token) => token.length >= 3 && !NOTE_DEDUP_STOPWORDS.has(token));
    return new Set(tokens);
  }
  function isMostlyRepeatOfAction(noteText, actionText, actionTokenSet) {
    const noteTokens = getMeaningfulTokenSet(noteText);
    const actionTokens = actionTokenSet || getMeaningfulTokenSet(actionText);
    if (noteTokens.size < 2 || actionTokens.size < 2) {
      return false;
    }
    let shared = 0;
    noteTokens.forEach((token) => {
      if (actionTokens.has(token)) {
        shared += 1;
      }
    });
    const noteCoverage = shared / noteTokens.size;
    const actionCoverage = shared / actionTokens.size;
    return (
      noteCoverage >= 0.67 || (noteCoverage >= 0.5 && actionCoverage >= 0.5)
    );
  }
  function buildDisplayNotes(decision) {
    const actionNotes = Array.isArray(decision.actionNotes)
      ? decision.actionNotes
      : [];
    if (actionNotes.length === 0) {
      return [];
    }
    const actionNorm = normalizeSnippet(decision.actionText);
    const actionTokenSet = getMeaningfulTokenSet(decision.actionText);
    const noteCodes = Array.isArray(decision.actionNoteCodes)
      ? decision.actionNoteCodes
      : [];
    const showNotes = [];
    const seenByCode = /* @__PURE__ */ new Set();
    const seenByText = /* @__PURE__ */ new Set();
    for (let index = 0; index < actionNotes.length; index += 1) {
      const rawNote = actionNotes[index];
      const noteCode = noteCodes[index] || "";
      const compact = compactNoteText(rawNote);
      const noteNorm = normalizeSnippet(compact);
      if (!noteNorm) {
        continue;
      }
      if (noteNorm === actionNorm) {
        continue;
      }
      if (
        isMostlyRepeatOfAction(compact, decision.actionText, actionTokenSet)
      ) {
        continue;
      }
      if (noteCode && seenByCode.has(noteCode)) {
        continue;
      }
      if (seenByText.has(noteNorm)) {
        continue;
      }
      if (noteCode) {
        seenByCode.add(noteCode);
      }
      seenByText.add(noteNorm);
      showNotes.push(compact);
      if (showNotes.length >= MAX_DISPLAY_NOTES) {
        break;
      }
    }
    return showNotes;
  }
  function initCataractController() {
    const fundalSection = $("#fundal-section");
    const backSection = $("#back-section");
    const resultSection = $("#result-section");
    const resultDiv = $("#result");
    const ageBandSelect = $("#ageBand");
    const distanceVASelect = $("#distanceVA");
    const onsetInputs = $$('#top-section input[name="onset"]');
    const eyesInputs = $$('#top-section input[name="eyes"]');
    const painLabel = $("#pain-label");
    const neuroLabel = $("#neuro-label");
    const fundalButtons = $$(".fundal-btn");
    const backButtons = $$(".back-btn");
    const topInputs = $$("#top-section input, #top-section select");
    const nearVAInput = $("#nearVA");
    const fundalLockHint = $("#fundal-lock-hint");
    const backLockHint = $("#back-lock-hint");
    const resultLockHint = $("#result-lock-hint");
    let hasShownFundalHint = false;
    function setButtonGroupSelection(buttons, selectedButton, colorMap) {
      var _a;
      buttons.forEach((button) => {
        button.classList.remove("selected");
        button.style.borderColor = NEUTRAL_BORDER_COLOR;
        button.setAttribute("aria-pressed", "false");
      });
      selectedButton.classList.add("selected");
      const value =
        (_a = selectedButton.getAttribute("data-value")) == null
          ? void 0
          : _a.trim();
      selectedButton.style.borderColor =
        colorMap[value] || NEUTRAL_BORDER_COLOR;
      selectedButton.setAttribute("aria-pressed", "true");
    }
    function checkTopSectionCompletion() {
      var _a;
      const onsetSelected = $('#top-section input[name="onset"]:checked');
      const distanceVA = (_a = $("#distanceVA")) == null ? void 0 : _a.value;
      const eyesSelected = $('#top-section input[name="eyes"]:checked');
      return Boolean(onsetSelected && distanceVA !== "" && eyesSelected);
    }
    function clearButtonGroupSelection(buttons) {
      buttons.forEach((button) => {
        button.classList.remove("selected");
        button.style.borderColor = NEUTRAL_BORDER_COLOR;
        button.setAttribute("aria-pressed", "false");
      });
    }
    function setSectionDisabledState(
      section,
      isDisabled,
      hintElement,
      hintText = "",
    ) {
      if (!section) {
        return;
      }
      section.classList.toggle("disabled", isDisabled);
      section.setAttribute("aria-disabled", isDisabled ? "true" : "false");
      $$("button, input, select, textarea", section).forEach((control) => {
        if ("disabled" in control) {
          control.disabled = isDisabled;
        }
      });
      if (hintElement) {
        hintElement.textContent = isDisabled ? hintText : "";
        hintElement.hidden = !isDisabled;
      }
    }
    function setupClearableTopRadios() {
      const topRadios = $$('#top-section input[type="radio"]');
      if (topRadios.length === 0) {
        return;
      }
      topRadios.forEach((radio) => {
        const markWasChecked = () => {
          radio.dataset.wasChecked = radio.checked ? "1" : "0";
        };
        radio.addEventListener("pointerdown", markWasChecked);
        radio.addEventListener("mousedown", markWasChecked);
        radio.addEventListener(
          "touchstart",
          () => {
            markWasChecked();
          },
          { passive: true },
        );
        const parentLabel = radio.closest("label");
        if (parentLabel) {
          parentLabel.addEventListener("pointerdown", markWasChecked);
          parentLabel.addEventListener("mousedown", markWasChecked);
          parentLabel.addEventListener(
            "touchstart",
            () => {
              markWasChecked();
            },
            { passive: true },
          );
        }
        radio.addEventListener("keydown", (event) => {
          if (
            (event.key === " " ||
              event.key === "Spacebar" ||
              event.key === "Enter") &&
            radio.checked
          ) {
            radio.dataset.wasChecked = "1";
          }
        });
        radio.addEventListener("click", (event) => {
          const wasChecked = radio.dataset.wasChecked === "1";
          radio.dataset.wasChecked = "0";
          if (!wasChecked) {
            return;
          }
          event.stopPropagation();
          window.requestAnimationFrame(() => {
            radio.checked = false;
            radio.dispatchEvent(new Event("change", { bubbles: true }));
          });
        });
      });
    }
    function showFundalGuidanceMessage() {
      const fundalTitle =
        fundalSection == null ? void 0 : fundalSection.querySelector("h2");
      if (!fundalTitle) {
        return;
      }
      const existingMessage = fundalTitle.querySelector("#fundal-message");
      if (existingMessage) {
        return;
      }
      const message = document.createElement("span");
      message.textContent = UI_COPY.fundalHint;
      message.style.color = "black";
      message.style.fontSize = "14px";
      message.style.marginLeft = "20px";
      message.style.display = "inline-block";
      message.id = "fundal-message";
      message.style.animation = "zoomAnimation 4s forwards";
      fundalTitle.appendChild(message);
      window.setTimeout(() => {
        message.remove();
      }, 4e3);
    }
    function clearRecheckHighlights() {
      $$(".recheck-flash").forEach((element) => {
        element.classList.remove("recheck-flash");
      });
    }
    function applyRecheckHighlights(recheckFieldKeys) {
      clearRecheckHighlights();
      if (!Array.isArray(recheckFieldKeys) || recheckFieldKeys.length === 0) {
        return;
      }
      const targetMap = {
        age: [ageBandSelect],
        distanceVA: [distanceVASelect],
        near: [nearVAInput],
        fundal: [fundalSection],
        back: [backSection],
        onset: onsetInputs.map((input) => input.parentElement),
        eyes: eyesInputs.map((input) => input.parentElement),
        pain: [painLabel],
        rapd: [neuroLabel],
        light: [neuroLabel],
      };
      const uniqueTargets = /* @__PURE__ */ new Set();
      recheckFieldKeys.forEach((fieldKey) => {
        const targets = targetMap[fieldKey] || [];
        targets.forEach((target) => {
          if (target) {
            uniqueTargets.add(target);
          }
        });
      });
      uniqueTargets.forEach((target) => {
        target.classList.remove("recheck-flash");
        void target.offsetWidth;
        target.classList.add("recheck-flash");
      });
    }
    function calculateResult() {
      var _a, _b, _c;
      const onsetElem = $('#top-section input[name="onset"]:checked');
      if (!onsetElem || !resultDiv) {
        if (resultDiv) {
          resultDiv.innerHTML = "";
        }
        clearRecheckHighlights();
        return false;
      }
      const fundalBtn = $(".fundal-btn.selected");
      const backBtn = $(".back-btn.selected");
      if (!fundalBtn || !backBtn) {
        resultDiv.innerHTML = "";
        clearRecheckHighlights();
        return false;
      }
      const fundalSelection = fundalBtn.getAttribute("data-value");
      const backSelection = backBtn.getAttribute("data-value");
      const eyesElem = $('#top-section input[name="eyes"]:checked');
      const eyes = eyesElem ? eyesElem.value : "";
      const painElem = $('#top-section input[name="pain"]:checked');
      const pupilElem = $('#top-section input[name="pupil"]:checked');
      const frontElem = $('#top-section input[name="front"]:checked');
      const neuroElem = $('#top-section input[name="neuro"]:checked');
      const decision = evaluateCataractDecision({
        onsetValue: onsetElem.value,
        ageBand: ((_a = $("#ageBand")) == null ? void 0 : _a.value) || "",
        distanceVA: ((_b = $("#distanceVA")) == null ? void 0 : _b.value) || "",
        nearVAValue: ((_c = $("#nearVA")) == null ? void 0 : _c.value) || "",
        eyes,
        painYes: Boolean(painElem && painElem.value === "yes"),
        painRecorded: true,
        pupilSelected: true,
        pupilRecorded: true,
        pupilAbnormal: Boolean(pupilElem && pupilElem.value === "abnormal"),
        frontPresent: Boolean(frontElem && frontElem.value === "present"),
        frontRecorded: true,
        rapdPresent: Boolean(neuroElem && neuroElem.value === "yes"),
        rapdRecorded: true,
        directionLightPoor: Boolean(neuroElem && neuroElem.value === "yes"),
        lightRecorded: true,
        fundalSelection,
        backSelection,
      });
      if (!decision.hasResult) {
        resultDiv.innerHTML = "";
        clearRecheckHighlights();
        return false;
      }
      let resultHTML = '<div class="result-summary result-summary--compact">';
      resultHTML += `
      <div class="result-card result-pattern">
        <p class="result-label">${UI_COPY.result.cataractTypeLabel}</p>
        <p class="result-value">${decision.cataractType}</p>
      </div>
    `;
      resultHTML += `
      <div class="result-card result-action">
        <p class="result-label">${UI_COPY.result.nextStepLabel}</p>
        <p class="result-value action-text action-${decision.actionColour}">${decision.actionText}</p>
      </div>
    `;
      resultHTML += "</div>";
      const displayNotes = buildDisplayNotes(decision);
      if (displayNotes.length > 0) {
        const notesHtml = displayNotes
          .map((note) => `<p class="action-note-line">${note}</p>`)
          .join("");
        resultHTML += `
        <div class="result-detail-block result-note-block checks-${decision.actionColour}">
          <p class="result-label">${UI_COPY.result.checkLabel}</p>
          <div class="action-notes">${notesHtml}</div>
        </div>
      `;
      }
      resultDiv.innerHTML = resultHTML;
      applyRecheckHighlights(decision.recheckFieldKeys);
      return true;
    }
    function syncProgressiveState() {
      var _a;
      const wasFundalDisabled = Boolean(
        fundalSection == null
          ? void 0
          : fundalSection.classList.contains("disabled"),
      );
      const isTopComplete = checkTopSectionCompletion();
      if (!isTopComplete) {
        clearButtonGroupSelection(fundalButtons);
        clearButtonGroupSelection(backButtons);
        resultDiv.innerHTML = "";
        clearRecheckHighlights();
        setSectionDisabledState(
          fundalSection,
          true,
          fundalLockHint,
          "Complete Vision Loss and Dist VA to unlock.",
        );
        setSectionDisabledState(
          backSection,
          true,
          backLockHint,
          "Complete top details first.",
        );
        setSectionDisabledState(
          resultSection,
          true,
          resultLockHint,
          "Complete required fields to show result.",
        );
        return;
      }
      setSectionDisabledState(fundalSection, false, fundalLockHint);
      if (wasFundalDisabled && !hasShownFundalHint) {
        showFundalGuidanceMessage();
        hasShownFundalHint = true;
      }
      const selectedFundalButton = $(".fundal-btn.selected");
      if (!selectedFundalButton) {
        clearButtonGroupSelection(backButtons);
        resultDiv.innerHTML = "";
        clearRecheckHighlights();
        setSectionDisabledState(
          backSection,
          true,
          backLockHint,
          "Select one fundal reflex to unlock.",
        );
        setSectionDisabledState(
          resultSection,
          true,
          resultLockHint,
          "Select fundal reflex and back of eye.",
        );
        return;
      }
      const fundalValue =
        (_a = selectedFundalButton.getAttribute("data-value")) == null
          ? void 0
          : _a.trim();
      if (fundalValue === "white") {
        const poorViewButton = $('.back-btn[data-value="poor view"]');
        if (poorViewButton && !poorViewButton.classList.contains("selected")) {
          setButtonGroupSelection(
            backButtons,
            poorViewButton,
            BACK_BORDER_COLORS,
          );
        }
        setSectionDisabledState(
          backSection,
          true,
          backLockHint,
          "Dense reflex auto-sets back to Poor view.",
        );
      } else {
        setSectionDisabledState(backSection, false, backLockHint);
      }
      const hasResult = calculateResult();
      if (hasResult) {
        setSectionDisabledState(resultSection, false, resultLockHint);
        return;
      }
      const hasBackSelection = Boolean($(".back-btn.selected"));
      setSectionDisabledState(
        resultSection,
        true,
        resultLockHint,
        hasBackSelection
          ? "Complete required fields to show result."
          : "Select one back-of-eye finding.",
      );
    }
    function updateCriticalStyling() {
      const suddenRadio = $("#onset-sudden");
      if (suddenRadio) {
        const suddenSpan = suddenRadio.parentElement;
        if (suddenRadio.checked) {
          suddenSpan == null ? void 0 : suddenSpan.classList.add("serious");
        } else {
          suddenSpan == null ? void 0 : suddenSpan.classList.remove("serious");
        }
      }
      const painRadio = $("#pain-yes");
      const painLabel2 = $("#pain-label");
      const painYesLabel = $("#pain-yes-label");
      if (painRadio && painLabel2 && painYesLabel) {
        if (painRadio.checked) {
          painLabel2.classList.add("serious");
          painYesLabel.classList.add("serious");
        } else {
          painLabel2.classList.remove("serious");
          painYesLabel.classList.remove("serious");
        }
      }
      const pupilAbnormalRadio = $("#pupil-abnormal");
      const pupilLabel = $("#pupil-label");
      const pupilYesLabel = $("#pupil-yes-label");
      if (pupilLabel && pupilAbnormalRadio && pupilYesLabel) {
        if (pupilAbnormalRadio.checked) {
          pupilLabel.classList.add("serious");
          pupilYesLabel.classList.add("serious");
          pupilLabel.classList.remove("good");
        } else {
          pupilLabel.classList.remove("good");
          pupilLabel.classList.remove("serious");
          pupilYesLabel.classList.remove("serious");
        }
      }
      const frontRadio = $("#front-present");
      const frontLabel = $("#front-label");
      const frontYesLabel = $("#front-yes-label");
      if (frontRadio && frontLabel && frontYesLabel) {
        if (frontRadio.checked) {
          frontLabel.classList.add("warning");
          frontYesLabel.classList.add("warning");
        } else {
          frontLabel.classList.remove("warning");
          frontYesLabel.classList.remove("warning");
        }
      }
      const neuroRadio = $("#neuro-red-yes");
      const neuroLabel2 = $("#neuro-label");
      const neuroYesLabel = $("#neuro-yes-label");
      if (neuroRadio && neuroLabel2 && neuroYesLabel) {
        if (neuroRadio.checked) {
          neuroLabel2.classList.add("serious");
          neuroYesLabel.classList.add("serious");
        } else {
          neuroLabel2.classList.remove("serious");
          neuroYesLabel.classList.remove("serious");
        }
      }
    }
    topInputs.forEach((input) => {
      input.addEventListener("change", () => {
        updateCriticalStyling();
        syncProgressiveState();
      });
    });
    fundalButtons.forEach((button) => {
      button.addEventListener("click", () => {
        setButtonGroupSelection(fundalButtons, button, FUNDAL_BORDER_COLORS);
        syncProgressiveState();
      });
    });
    backButtons.forEach((button) => {
      button.addEventListener("click", () => {
        if (
          backSection == null
            ? void 0
            : backSection.classList.contains("disabled")
        ) {
          return;
        }
        setButtonGroupSelection(backButtons, button, BACK_BORDER_COLORS);
        syncProgressiveState();
      });
    });
    if (nearVAInput) {
      nearVAInput.addEventListener("change", syncProgressiveState);
    }
    setupClearableTopRadios();
    updateCriticalStyling();
    syncProgressiveState();
  }

  // src/image-preview-controller.js?v=20260511-5
  var POPUP_DELAY_MS = 500;
  function initImagePreviewController() {
    let popupTimer;
    function showImagePopup(button) {
      let popup = document.getElementById("image-popup");
      if (!popup) {
        popup = document.createElement("div");
        popup.id = "image-popup";
        popup.style.position = "fixed";
        popup.style.top = "50%";
        popup.style.left = "50%";
        popup.style.transform = "translate(-50%, -50%)";
        popup.style.zIndex = "1000";
        popup.style.backgroundColor = "#fff";
        popup.style.border = "2px solid #ccc";
        popup.style.borderRadius = "20px";
        popup.style.padding = "10px";
        popup.addEventListener("contextmenu", (event) => {
          event.preventDefault();
        });
        document.body.appendChild(popup);
      }
      popup.innerHTML = "";
      const image = button.querySelector("img");
      if (image) {
        const enlargedImage = image.cloneNode(true);
        enlargedImage.draggable = false;
        enlargedImage.addEventListener("contextmenu", (event) =>
          event.preventDefault(),
        );
        enlargedImage.style.maxWidth = "80vw";
        enlargedImage.style.height = "auto";
        enlargedImage.style.display = "block";
        enlargedImage.style.animation = "zoomImage 3s forwards";
        popup.appendChild(enlargedImage);
        popup.style.display = "block";
      }
    }
    function hideImagePopup() {
      clearTimeout(popupTimer);
      const popup = document.getElementById("image-popup");
      if (popup) {
        popup.style.display = "none";
      }
    }
    const buttons = $$(".button-item button");
    buttons.forEach((button) => {
      button.addEventListener("contextmenu", (event) => {
        event.preventDefault();
      });
      button.addEventListener("mousedown", () => {
        popupTimer = setTimeout(() => showImagePopup(button), POPUP_DELAY_MS);
      });
      button.addEventListener("mouseup", hideImagePopup);
      button.addEventListener("mouseleave", hideImagePopup);
      button.addEventListener("touchstart", () => {
        popupTimer = setTimeout(() => showImagePopup(button), POPUP_DELAY_MS);
      });
      button.addEventListener("touchend", hideImagePopup);
      button.addEventListener("touchcancel", hideImagePopup);
    });
  }

  // src/cataract-copy.js?v=20260511-1
  var UI_COPY2 = {
    result: {
      cataractTypeLabel: "Cataract Type",
      nextStepLabel: "Next Step",
      checkLabel: "Check",
    },
    fundalHint: "Dilate pupils for best view",
    infoPopup: {
      intro: "Quick cataract triage in seconds.",
      bullets: [
        "History + VA: onset, one or two eyes, pain, age, distance VA and near VA.",
        "Front: pupils, cornea/scar and RAPD or poor light direction.",
        "Reflex: Normal, Dull, Patches, Spots or Dense.",
        "Back: Normal, Cupped, DR/Scar, Detached or Poor view.",
        "Result: cataract type, next step and short re-checks.",
      ],
      outro:
        "Teaching aid, not final diagnosis. Look for non-cataract disease when features are atypical or urgent.",
    },
  };

  // src/info-popup-controller.js?v=20260511-6
  function initInfoPopupController() {
    const infoIcon = $("#info-icon");
    const infoPopup = $("#info-popup");
    const infoClose = $("#info-close");
    const sideMenu = $("#sideMenu");
    const burgerIcon = $("#burger-icon");
    function hydrateInfoCopy() {
      const intro = $("#info-copy-intro");
      const outro = $("#info-copy-outro");
      const bulletEls = [
        $("#info-copy-bullet-1"),
        $("#info-copy-bullet-2"),
        $("#info-copy-bullet-3"),
        $("#info-copy-bullet-4"),
        $("#info-copy-bullet-5"),
      ];
      if (intro) {
        intro.textContent = UI_COPY2.infoPopup.intro;
      }
      UI_COPY2.infoPopup.bullets.forEach((text, index) => {
        const bulletEl = bulletEls[index];
        if (bulletEl) {
          bulletEl.textContent = text;
        }
      });
      if (outro) {
        outro.textContent = UI_COPY2.infoPopup.outro;
      }
    }
    function setInfoPopupOpen(isOpen) {
      if (!infoPopup) {
        return;
      }
      if (isOpen && sideMenu) {
        sideMenu.classList.remove("open");
        sideMenu.setAttribute("aria-hidden", "true");
        sideMenu.setAttribute("inert", "");
        if (burgerIcon) {
          burgerIcon.setAttribute("aria-expanded", "false");
        }
      }
      infoPopup.hidden = !isOpen;
      if (infoIcon) {
        infoIcon.setAttribute("aria-expanded", isOpen ? "true" : "false");
      }
    }
    if (infoIcon && infoPopup) {
      infoIcon.addEventListener("click", (event) => {
        event.preventDefault();
        event.stopPropagation();
        setInfoPopupOpen(infoPopup.hidden);
      });
    }
    if (infoClose) {
      infoClose.addEventListener("click", () => {
        setInfoPopupOpen(false);
      });
    }
    document.addEventListener("click", (event) => {
      if (!infoPopup || infoPopup.hidden) {
        return;
      }
      const clickedInsidePopup = infoPopup.contains(event.target);
      const clickedInfoIcon = infoIcon && infoIcon.contains(event.target);
      if (!clickedInsidePopup && !clickedInfoIcon) {
        setInfoPopupOpen(false);
      }
    });
    document.addEventListener("keydown", (event) => {
      if (event.key === "Escape") {
        setInfoPopupOpen(false);
      }
    });
    hydrateInfoCopy();
    return {
      close: () => setInfoPopupOpen(false),
    };
  }

  // src/mcq-data.js?v=20260511-2
  var MCQ_STORAGE_KEY = "cataract_mcq_progress_v1";
  var MCQ_LEVELS = [
    {
      name: "Primary",
      totalQuestions: 5,
      passScore: 4,
      timeSeconds: 90,
      questions: [
        {
          prompt:
            "Which reflex pattern most strongly suggests a mature cataract?",
          options: [
            "Normal red reflex",
            "White reflex",
            "Dark reflex only",
            "Patchy peripheral reflex",
          ],
          answerIndex: 1,
        },
        {
          prompt:
            "If fundal reflex is normal and VA is 6/6, the most likely action is:",
          options: [
            "Urgent surgery",
            "Routine surgery",
            "No cataract referral needed",
            "Immediate retinal referral",
          ],
          answerIndex: 2,
        },
        {
          prompt: "Best first step before deciding cataract referral is to:",
          options: [
            "Only inspect lens colour",
            "Check history and vision carefully",
            "Skip back-of-eye check",
            "Refer everyone with blur",
          ],
          answerIndex: 1,
        },
        {
          prompt:
            "Which VA indicates the poorest distance vision in this tool?",
          options: ["6/12", "6/36", "6/60", "HM"],
          answerIndex: 3,
        },
        {
          prompt: "Pain/red eye with sudden one-eye loss should trigger:",
          options: [
            "Routine cataract pathway",
            "No action",
            "Urgent investigation for other pathology",
            "Yearly review only",
          ],
          answerIndex: 2,
        },
        {
          prompt: "Fundal Reflex unlocks when the app has:",
          options: [
            "Age only",
            "Onset, eyes and Dist VA",
            "Near VA only",
            "Back of Eye first",
          ],
          answerIndex: 1,
        },
        {
          prompt: "What does the Back of Eye section check for?",
          options: [
            "Only lens colour",
            "Other disease behind the lens",
            "Phone brightness",
            "Age band only",
          ],
          answerIndex: 1,
        },
        {
          prompt: "A normal fundal reflex usually means the pupil glow is:",
          options: [
            "Bright and clear",
            "Always white",
            "Always black",
            "Hidden by default",
          ],
          answerIndex: 0,
        },
        {
          prompt: "Which choice is a Back of Eye finding in this app?",
          options: ["Spots", "Patches", "Cupped", "Dense"],
          answerIndex: 2,
        },
        {
          prompt: "Which choice is a Fundal Reflex finding in this app?",
          options: ["Detached", "DR/Scar", "Patches", "Cupped"],
          answerIndex: 2,
        },
        {
          prompt: "Why does the app ask for Dist VA?",
          options: [
            "To judge vision severity",
            "To change the title",
            "To unlock the menu",
            "To replace all examination",
          ],
          answerIndex: 0,
        },
        {
          prompt:
            "If the result asks for re-checks, the safest response is to:",
          options: [
            "Ignore them",
            "Re-check the highlighted findings",
            "Clear the browser",
            "Choose the fastest referral only",
          ],
          answerIndex: 1,
        },
      ],
    },
    {
      name: "Intermediate",
      totalQuestions: 5,
      passScore: 4,
      timeSeconds: 80,
      questions: [
        {
          prompt: "White reflex with poor back view generally indicates:",
          options: [
            "No visual relevance",
            "Priority surgery / dense cataract pathway",
            "Normal ageing only",
            "Always glaucoma only",
          ],
          answerIndex: 1,
        },
        {
          prompt: "Back-of-eye finding of detached retina should usually be:",
          options: [
            "Routine cataract surgery",
            "No referral",
            "Managed as non-cataract urgent retinal disease",
            "Observed yearly",
          ],
          answerIndex: 2,
        },
        {
          prompt: "Near VA deterioration (e.g. N18/N36) in this app:",
          options: [
            "Is ignored completely",
            "Adds context to referral wording",
            "Cancels distance VA",
            "Always means no cataract",
          ],
          answerIndex: 1,
        },
        {
          prompt: "Abnormal pupils in this workflow are treated as:",
          options: [
            "Simple cataract only",
            "Possible non-cataract pathology",
            "Always normal",
            "Not relevant to triage",
          ],
          answerIndex: 1,
        },
        {
          prompt: "Front-of-eye scar/distortion should lead to:",
          options: [
            "Guarded outcome warning",
            "Automatic discharge",
            "No change",
            "Primary care only",
          ],
          answerIndex: 0,
        },
        {
          prompt: "If fundal reflex is white, the back section becomes:",
          options: [
            "Forced open",
            "Disabled with poor-view preselection",
            "Hidden permanently",
            "Unchanged but irrelevant",
          ],
          answerIndex: 1,
        },
        {
          prompt: "A dense reflex with relatively good VA should make you:",
          options: [
            "Ignore the mismatch",
            "Re-check reflex and VA",
            "Always discharge",
            "Skip Back of Eye",
          ],
          answerIndex: 1,
        },
        {
          prompt: "Distance poor but near good usually means:",
          options: [
            "The result is automatically normal",
            "VA method or refraction should be re-checked",
            "Cataract is impossible",
            "Age band should be deleted",
          ],
          answerIndex: 1,
        },
        {
          prompt: "A normal reflex with very poor VA should prompt:",
          options: [
            "No further thought",
            "Early specialist review for another cause",
            "Routine cataract surgery only",
            "Ignore the back view",
          ],
          answerIndex: 1,
        },
        {
          prompt: "Deep cupping in Back of Eye points towards:",
          options: [
            "Glaucoma review first",
            "Mature cataract only",
            "Normal result",
            "Near-vision testing only",
          ],
          answerIndex: 0,
        },
        {
          prompt: "DR/Scar in Back of Eye means:",
          options: [
            "Retinal disease may limit cataract benefit",
            "The lens is definitely clear",
            "No referral can be needed",
            "The result must be green",
          ],
          answerIndex: 0,
        },
        {
          prompt: "A child with cataract-pattern signs should usually get:",
          options: [
            "Yearly adult review",
            "Prompt paediatric referral",
            "No action until age 18",
            "Reading glasses only",
          ],
          answerIndex: 1,
        },
      ],
    },
    {
      name: "Advanced",
      totalQuestions: 5,
      passScore: 4,
      timeSeconds: 75,
      questions: [
        {
          prompt: "Most safety-critical trap in cataract triage is:",
          options: [
            "Over-documenting history",
            "Assuming all blur is cataract",
            "Checking pupils",
            "Using fundal images",
          ],
          answerIndex: 1,
        },
        {
          prompt:
            "If back-of-eye shows diabetic/retinal pathology, cataract surgery in this app is:",
          options: [
            "Always urgent",
            "Usually not the primary immediate pathway",
            "Guaranteed to restore vision",
            "Always first-line",
          ],
          answerIndex: 1,
        },
        {
          prompt: "Sudden + painful visual loss should bias toward:",
          options: [
            "Elective cataract list",
            "Urgent diagnostic escalation",
            "Annual follow-up only",
            "Reassure and discharge",
          ],
          answerIndex: 1,
        },
        {
          prompt: "The main role of this tool is to:",
          options: [
            "Replace specialist diagnosis",
            "Support rapid triage and safe signposting",
            "Provide final surgical booking",
            "Assess refractive error only",
          ],
          answerIndex: 1,
        },
        {
          prompt: "Best interpretation of poor Back of Eye view is:",
          options: [
            "Definitely simple cataract only",
            "Needs further assessment for alternate pathology",
            "Always normal",
            "Ignore if near VA is good",
          ],
          answerIndex: 1,
        },
        {
          prompt:
            "When two findings conflict (e.g. cataract-like reflex but retinal red flags), priority should be:",
          options: [
            "The least severe interpretation",
            "Safety-first escalation for red flags",
            "Ignore retinal signs",
            "Wait 12 months",
          ],
          answerIndex: 1,
        },
        {
          prompt: "RAPD or poor light direction should make the app consider:",
          options: [
            "Optic nerve or retinal disease first",
            "Only routine cataract",
            "No vision problem",
            "Near VA only",
          ],
          answerIndex: 0,
        },
        {
          prompt:
            "Why does the engine keep posterior override ahead of cataract type?",
          options: [
            "Posterior disease can be urgent or vision-limiting",
            "It makes the MCQ shorter",
            "It hides all cataract signs",
            "It avoids taking history",
          ],
          answerIndex: 0,
        },
        {
          prompt: "Sudden painful white reflex is handled as:",
          options: [
            "Routine cataract only",
            "Urgent same-day investigation",
            "No cataract pathway",
            "Back section hidden forever",
          ],
          answerIndex: 1,
        },
        {
          prompt: "Why are red outputs kept short?",
          options: [
            "Urgent action should be clear",
            "Near VA is never useful",
            "The result is less important",
            "The app cannot show notes",
          ],
          answerIndex: 0,
        },
        {
          prompt:
            "If abnormal reflex and VA 6/6 appear together, the app should:",
          options: [
            "Show a re-check warning",
            "Force urgent surgery",
            "Delete the reflex choice",
            "Ignore VA",
          ],
          answerIndex: 0,
        },
        {
          prompt: "A non-cataract-first pathway should avoid:",
          options: [
            "Over-stating cataract as the definite cause",
            "Mentioning safety",
            "Checking the back of eye",
            "Using plain language",
          ],
          answerIndex: 0,
        },
      ],
    },
  ];

  // src/mcq-engine.js
  function shuffleArray(items) {
    const nextItems = items.slice();
    for (let index = nextItems.length - 1; index > 0; index -= 1) {
      const swapIndex = Math.floor(Math.random() * (index + 1));
      const currentValue = nextItems[index];
      nextItems[index] = nextItems[swapIndex];
      nextItems[swapIndex] = currentValue;
    }
    return nextItems;
  }
  function normalizeProgress(rawProgress, levelCount) {
    if (!rawProgress || typeof rawProgress !== "object") {
      return { unlockedLevelIndex: 0, completedLevels: [] };
    }
    const unlockedLevelIndex = Number.isInteger(rawProgress.unlockedLevelIndex)
      ? Math.max(0, Math.min(levelCount - 1, rawProgress.unlockedLevelIndex))
      : 0;
    const completedLevels = Array.isArray(rawProgress.completedLevels)
      ? rawProgress.completedLevels
          .filter(
            (index) =>
              Number.isInteger(index) && index >= 0 && index < levelCount,
          )
          .filter((value, index, arr) => arr.indexOf(value) === index)
      : [];
    return { unlockedLevelIndex, completedLevels };
  }
  function evaluateMcqAnswers(questions, selectedAnswers, allowUnanswered) {
    let score = 0;
    for (
      let questionIndex = 0;
      questionIndex < questions.length;
      questionIndex += 1
    ) {
      const selectedOptionIndex = selectedAnswers[questionIndex];
      if (selectedOptionIndex === null || selectedOptionIndex === void 0) {
        if (!allowUnanswered) {
          return { isComplete: false, score: 0, total: questions.length };
        }
        continue;
      }
      if (
        Number(selectedOptionIndex) === questions[questionIndex].answerIndex
      ) {
        score += 1;
      }
    }
    return { isComplete: true, score, total: questions.length };
  }

  // src/storage-utils.js
  function safeLoadJson(storageKey, fallbackValue) {
    try {
      const rawValue = window.localStorage.getItem(storageKey);
      if (!rawValue) {
        return fallbackValue;
      }
      return JSON.parse(rawValue);
    } catch (e) {
      return fallbackValue;
    }
  }
  function safeSaveJson(storageKey, value) {
    try {
      window.localStorage.setItem(storageKey, JSON.stringify(value));
    } catch (e) {}
  }

  // src/mcq-controller.js?v=20260511-6
  var DEFAULT_PROGRESS = { unlockedLevelIndex: 0, completedLevels: [] };
  function initMcqController() {
    const burgerIcon = $("#burger-icon");
    const sideMenu = $("#sideMenu");
    const mcqLevelButtons = $$(".mcq-level-button");
    const mcqModal = $("#mcqModal");
    const closeMcqModalButton = $("#closeMcqModal");
    const mcqTitle = $("#mcqTitle");
    const mcqTimer = $("#mcqTimer");
    const mcqContainer = $("#mcqContainer");
    const submitMcqButton = $("#submitMcqButton");
    const mcqResult = $("#mcqResult");
    const infoPopup = $("#info-popup");
    const infoIcon = $("#info-icon");
    let mcqProgress = normalizeProgress(
      safeLoadJson(MCQ_STORAGE_KEY, DEFAULT_PROGRESS),
      MCQ_LEVELS.length,
    );
    let activeMcqLevelIndex = null;
    let activeMcqQuestions = [];
    let mcqTimerId = null;
    let mcqRemainingSeconds = 0;
    function saveMcqProgress() {
      safeSaveJson(MCQ_STORAGE_KEY, mcqProgress);
    }
    function isMcqLevelUnlocked(levelIndex) {
      return levelIndex <= mcqProgress.unlockedLevelIndex;
    }
    function isMcqLevelCompleted(levelIndex) {
      return mcqProgress.completedLevels.includes(levelIndex);
    }
    function renderMcqLevelButtons() {
      mcqLevelButtons.forEach((button) => {
        const levelIndex = Number(button.dataset.levelIndex);
        const unlocked = isMcqLevelUnlocked(levelIndex);
        const completed = isMcqLevelCompleted(levelIndex);
        button.disabled = !unlocked;
        button.classList.toggle("is-complete", completed);
      });
    }
    function setSideMenuOpen(isOpen) {
      if (!sideMenu) {
        return;
      }
      if (isOpen && infoPopup) {
        infoPopup.hidden = true;
        if (infoIcon) {
          infoIcon.setAttribute("aria-expanded", "false");
        }
      }
      sideMenu.classList.toggle("open", isOpen);
      sideMenu.setAttribute("aria-hidden", isOpen ? "false" : "true");
      if (isOpen) {
        sideMenu.removeAttribute("inert");
      } else {
        sideMenu.setAttribute("inert", "");
      }
      if (burgerIcon) {
        burgerIcon.setAttribute("aria-expanded", isOpen ? "true" : "false");
        burgerIcon.setAttribute(
          "aria-label",
          isOpen ? "Close menu" : "Open menu",
        );
      }
    }
    function toggleSideMenu() {
      if (!sideMenu) {
        return;
      }
      setSideMenuOpen(!sideMenu.classList.contains("open"));
    }
    function stopMcqTimer() {
      if (mcqTimerId !== null) {
        clearInterval(mcqTimerId);
        mcqTimerId = null;
      }
    }
    function updateMcqTimerText() {
      if (!mcqTimer) {
        return;
      }
      const mins = Math.floor(mcqRemainingSeconds / 60);
      const secs = mcqRemainingSeconds % 60;
      mcqTimer.textContent = `Time: ${String(mins).padStart(2, "0")}:${String(secs).padStart(2, "0")}`;
    }
    function handleSubmitMcq(allowUnanswered = false) {
      const level = MCQ_LEVELS[activeMcqLevelIndex];
      if (!level || !mcqResult) {
        return;
      }
      const evaluation = evaluateMcqAnswers(
        activeMcqQuestions,
        collectSelectedAnswers(),
        Boolean(allowUnanswered),
      );
      if (!evaluation.isComplete) {
        mcqResult.textContent =
          "Please answer all questions before submitting.";
        return;
      }
      stopMcqTimer();
      const passed = evaluation.score >= level.passScore;
      if (passed) {
        markLevelComplete(activeMcqLevelIndex);
        renderMcqLevelButtons();
      }
      mcqResult.textContent = `${level.name}: ${evaluation.score}/${evaluation.total}. ${passed ? "Pass." : "Try again."}`;
    }
    function startMcqTimer(level) {
      stopMcqTimer();
      if (!mcqTimer) {
        return;
      }
      const timeSeconds = Number(level.timeSeconds) || 0;
      if (timeSeconds <= 0) {
        mcqTimer.hidden = true;
        mcqTimer.textContent = "";
        return;
      }
      mcqRemainingSeconds = timeSeconds;
      mcqTimer.hidden = false;
      updateMcqTimerText();
      mcqTimerId = setInterval(() => {
        mcqRemainingSeconds -= 1;
        updateMcqTimerText();
        if (mcqRemainingSeconds <= 0) {
          stopMcqTimer();
          handleSubmitMcq(true);
        }
      }, 1e3);
    }
    function openMcqModal() {
      if (!mcqModal) {
        return;
      }
      mcqModal.classList.add("open");
      mcqModal.setAttribute("aria-hidden", "false");
    }
    function closeMcqModal() {
      if (!mcqModal) {
        return;
      }
      stopMcqTimer();
      mcqModal.classList.remove("open");
      mcqModal.setAttribute("aria-hidden", "true");
      activeMcqLevelIndex = null;
      activeMcqQuestions = [];
    }
    function renderMcqQuestions(questions) {
      if (!mcqContainer) {
        return;
      }
      mcqContainer.innerHTML = "";
      questions.forEach((question, questionIndex) => {
        const fieldset = document.createElement("fieldset");
        fieldset.className = "mcq-question";
        const legend = document.createElement("legend");
        legend.textContent = `${questionIndex + 1}. ${question.prompt}`;
        fieldset.appendChild(legend);
        question.options.forEach((optionText, optionIndex) => {
          const optionLabel = document.createElement("label");
          optionLabel.className = "mcq-option";
          const optionInput = document.createElement("input");
          optionInput.type = "radio";
          optionInput.name = `mcq_q_${questionIndex}`;
          optionInput.value = String(optionIndex);
          const optionSpan = document.createElement("span");
          optionSpan.textContent = optionText;
          optionLabel.appendChild(optionInput);
          optionLabel.appendChild(optionSpan);
          fieldset.appendChild(optionLabel);
        });
        mcqContainer.appendChild(fieldset);
      });
    }
    function openMcqLevel(levelIndex) {
      const level = MCQ_LEVELS[levelIndex];
      if (!level) {
        return;
      }
      activeMcqLevelIndex = levelIndex;
      activeMcqQuestions = shuffleArray(level.questions).slice(
        0,
        level.totalQuestions,
      );
      if (mcqTitle) {
        mcqTitle.textContent = `MCQ - ${level.name}`;
      }
      if (mcqResult) {
        mcqResult.textContent = "";
      }
      renderMcqQuestions(activeMcqQuestions);
      openMcqModal();
      startMcqTimer(level);
    }
    function collectSelectedAnswers() {
      return activeMcqQuestions.map((question, questionIndex) => {
        const selectedInput = document.querySelector(
          `input[name="mcq_q_${questionIndex}"]:checked`,
        );
        return selectedInput ? Number(selectedInput.value) : null;
      });
    }
    function markLevelComplete(levelIndex) {
      if (!mcqProgress.completedLevels.includes(levelIndex)) {
        mcqProgress.completedLevels.push(levelIndex);
      }
      mcqProgress.unlockedLevelIndex = Math.max(
        mcqProgress.unlockedLevelIndex,
        Math.min(MCQ_LEVELS.length - 1, levelIndex + 1),
      );
      saveMcqProgress();
    }
    if (burgerIcon) {
      burgerIcon.addEventListener("click", (event) => {
        event.preventDefault();
        event.stopPropagation();
        toggleSideMenu();
      });
    }
    mcqLevelButtons.forEach((button) => {
      button.addEventListener("click", () => {
        const levelIndex = Number(button.dataset.levelIndex);
        if (!isMcqLevelUnlocked(levelIndex)) {
          return;
        }
        setSideMenuOpen(false);
        openMcqLevel(levelIndex);
      });
    });
    if (submitMcqButton) {
      submitMcqButton.addEventListener("click", () => {
        handleSubmitMcq(false);
      });
    }
    if (closeMcqModalButton) {
      closeMcqModalButton.addEventListener("click", closeMcqModal);
    }
    document.addEventListener("keydown", (event) => {
      if (event.key !== "Escape") {
        return;
      }
      if (mcqModal && mcqModal.classList.contains("open")) {
        closeMcqModal();
        return;
      }
      if (sideMenu && sideMenu.classList.contains("open")) {
        setSideMenuOpen(false);
      }
    });
    document.addEventListener("click", (event) => {
      if (sideMenu && sideMenu.classList.contains("open")) {
        const clickedInsideMenu = sideMenu.contains(event.target);
        const clickedMenuIcon = burgerIcon && burgerIcon.contains(event.target);
        if (!clickedInsideMenu && !clickedMenuIcon) {
          setSideMenuOpen(false);
        }
      }
      if (
        mcqModal &&
        mcqModal.classList.contains("open") &&
        event.target === mcqModal
      ) {
        closeMcqModal();
      }
    });
    renderMcqLevelButtons();
    return {
      closeMcqModal,
      setSideMenuOpen,
    };
  }

  // src/app.js?v=20260511-7
  function initializeApp() {
    initInfoPopupController();
    initMcqController();
    initCataractController();
    initImagePreviewController();
  }
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initializeApp, {
      once: true,
    });
  } else {
    initializeApp();
  }
})();
