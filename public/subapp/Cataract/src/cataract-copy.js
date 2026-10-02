export const UI_COPY = {
  result: {
    cataractTypeLabel: "Cataract Type",
    nextStepLabel: "Next Step",
    checkLabel: "Check",
  },
  fundalHint: "Dilate pupils for best view",
  infoPopup: {
    intro:
      "Use this while examining the patient: you enter the history, VA, safety findings, fundal reflex and back-of-eye view. It suggests a cataract pattern and next step; it does not make a final diagnosis.",
    bullets: [
      "History + VA: onset, one or two eyes, age and affected or worse-eye VA.",
      "Safety checks: pain/redness, pupils, front eye and RAPD/light response.",
      "Reflex: Normal, Dull, Patches, Spots or Dense.",
      "Back: Normal, Cupped, DR/Scar, Detached or Poor view.",
      "Result: cataract type, next step and short re-checks.",
    ],
    outro:
      "Teaching aid, not final diagnosis. Look for non-cataract disease when features are atypical or urgent.",
  },
};

export const ACTION_TEXT_BY_CODE = {
  incomplete_input: "",
  posterior_disease_first: "Assess posterior disease first.",
  retinal_same_day: "Same-day retinal assessment.",
  normal_reflex_very_poor_va_early: "Early specialist assessment.",
  normal_reflex_untestable_va_early: "Specialist assessment advised.",
  normal_reflex_reduced_va_recheck: "Check non-cataract causes.",
  normal_reflex_mild_review: "Review vision and other causes.",
  normal_reflex_no_referral: "No cataract referral now.",
  normal_reflex_non_cataract_reframe: "Check non-cataract causes.",
  cataract_priority_white: "Prompt cataract assessment.",
  white_reflex_prompt_review: "Prompt eye assessment.",
  white_reflex_recheck: "Confirm white reflex promptly.",
  cataract_poor_view_assessment: "Further eye assessment needed.",
  cataract_routine: "Cataract assessment advised.",
  cataract_priority_very_poor_va: "Prompt cataract assessment.",
  cataract_untestable_va_assess: "Assess before cataract referral.",
  cataract_early_referral_reduced_va: "Early cataract assessment.",
  cataract_early_review_mild_va: "Cataract assessment advised.",
  cataract_early_review_va_6_6: "Review if function affected.",
  child_cataract_prompt_referral: "Paediatric eye review.",
  child_white_reflex_urgent: "Urgent paediatric eye review.",
  child_reduced_vision_early_assessment: "Early paediatric eye review.",
  rapd_non_cataract_first: "Check retinal or nerve cause.",
  recheck_investigate_first: "Re-check key findings.",
  complete_missing_checks: "Complete missing checks.",
  urgent_same_day_investigation: "Same-day eye assessment.",
};

export const CONSISTENCY_WARNING_TEXT_BY_CODE = {
  fix_follow_with_non_child_age: "Re-check age or VA method.",
  normal_reflex_with_reduced_va: "Reduced VA needs another cause.",
  white_reflex_with_relatively_good_va: "VA and white reflex mismatch.",
  abnormal_reflex_with_va_6_6: "VA and reflex mismatch.",
  near_poor_with_good_distance: "Re-check near VA or refraction.",
  near_good_with_poor_distance: "Re-check VA method or refraction.",
  sudden_onset_with_cataract_pattern: "Sudden loss suggests another cause.",
  pain_with_cataract_pattern: "Pain/redness suggests another cause.",
  normal_reflex_with_poor_back_view: "Reflex and back view mismatch.",
  pain_without_eye_count: "Record one or two eyes.",
};

export const NOTE_TEXT_BY_CODE = {
  child_case_posterior_review: "Paediatric review after posterior assessment.",
  child_cataract_delay_risk: "Avoid delay: visual development risk.",
  child_reduced_vision_early_review: "Avoid delay: amblyopia risk.",
  child_white_reflex_causes: "Exclude other white-reflex causes.",
  age_unknown_caution: "Age affects urgency.",
  younger_age_secondary_causes:
    "Ask about trauma, steroids, diabetes and eye inflammation.",
  posterior_detached_same_day: "Same-day retinal assessment.",
  posterior_diabetic_first: "Retinal disease may limit outcome.",
  posterior_cupping_glaucoma: "Possible glaucoma: assess.",
  near_va_n8: "Near VA slightly reduced.",
  near_va_n12: "Near VA reduced.",
  near_va_n18: "Near VA poor.",
  near_va_n36: "Near VA very poor.",
  pupil_abnormal_review: "Abnormal pupil: prompt review.",
  front_abnormal_prognosis_limited: "Scar may limit visual outcome.",
  neuro_red_flags: "Possible retinal or nerve cause.",
  urgency_note_urgent: "Same-day eye assessment.",
  urgency_note_early: "Early review advised.",
  urgent_trigger_painful_one_or_sudden: "Sudden visual loss.",
  urgent_features_history_exam: "Urgent examination features.",
  assessment_incomplete_record_fields: "Complete missing checks.",
};

export const NOTE_PRIORITY_BY_CODE = {
  posterior_detached_same_day: 0,
  posterior_diabetic_first: 1,
  posterior_cupping_glaucoma: 2,
  child_cataract_delay_risk: 3,
  child_white_reflex_causes: 4,
  child_reduced_vision_early_review: 5,
  child_case_posterior_review: 6,
  age_unknown_caution: 7,
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
  neuro_red_flags: -2,
  pupil_abnormal_review: -1,
  front_abnormal_prognosis_limited: 13,
  younger_age_secondary_causes: 14,
  near_va_n8: 15,
  near_va_n12: 15,
  near_va_n18: 15,
  near_va_n36: 15,
  urgent_features_history_exam: 16,
};

export const CATARACT_EXPLANATION_HTML_BY_PHENOTYPE = {
  Nuclear:
    "<p>Nuclear: central lens opacity causing blur, usually age-related. Surgery usually helps.</p>",
  Cortical:
    "<p>Cortical: spoke-like peripheral opacities causing blur and glare. Surgery usually helps.</p>",
  Subcapsular:
    "<p>Subcapsular: posterior opacities causing glare and near blur. Surgery usually helps.</p>",
  Mature:
    "<p>Probable mature cataract: dense lens opacity with severe visual loss.</p>",
  "White reflex":
    "<p>White reflex: dense cataract or another cause. Prompt assessment is needed.</p>",
};

export const BACK_EXPLANATION_HTML_BY_SELECTION = {
  cupping:
    "<p>Disc cupping may indicate glaucoma. Confirm with appropriate assessment.</p>",
  diabetic: "<p>Retinal disease or scarring may limit visual outcome.</p>",
  "poor view": "<p>Poor view may have lens, retinal or vitreous causes.</p>",
  detached: "<p>Suspected retinal detachment needs same-day assessment.</p>",
};

export function getActionText(actionCode) {
  return ACTION_TEXT_BY_CODE[actionCode] || "";
}

export function getNoteText(noteCode) {
  return (
    NOTE_TEXT_BY_CODE[noteCode] ||
    CONSISTENCY_WARNING_TEXT_BY_CODE[noteCode] ||
    ""
  );
}
