export const UI_COPY = {
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

export const ACTION_TEXT_BY_CODE = {
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

export const CONSISTENCY_WARNING_TEXT_BY_CODE = {
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

export const NOTE_TEXT_BY_CODE = {
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

export const NOTE_PRIORITY_BY_CODE = {
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

export const CATARACT_EXPLANATION_HTML_BY_PHENOTYPE = {
  Nuclear:
    "<p>Nuclear: central lens opacity causing blur, usually age-related. Surgery usually helps.</p>",
  Cortical:
    "<p>Cortical: spoke-like peripheral opacities causing blur and glare. Surgery usually helps.</p>",
  Subcapsular:
    "<p>Subcapsular: posterior opacities causing glare and near blur. Surgery usually helps.</p>",
  Mature:
    "<p>Mature: dense white lens with severe vision loss. Prompt surgery helps avoid complications.</p>",
};

export const BACK_EXPLANATION_HTML_BY_SELECTION = {
  cupping:
    "<p>Deep disc cupping suggests advanced glaucoma. Urgent glaucoma review is needed.</p>",
  diabetic:
    "<p>Diabetic retinopathy needs treatment to protect vision. Cataract surgery may not help now.</p>",
  "poor view":
    "<p>Poor view may be due to dense cataract, retinal detachment, or vitreous haemorrhage. Review further.</p>",
  detached:
    "<p>Fresh retinal detachment needs immediate repair. Cataract surgery is unlikely to help first.</p>",
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

export function getConsistencyWarningText(code) {
  return CONSISTENCY_WARNING_TEXT_BY_CODE[code] || "";
}
