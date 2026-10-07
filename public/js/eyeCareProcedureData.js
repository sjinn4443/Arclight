// Procedure catalog entries reuse the video keys from PEC Workshop section 3.
export const EYE_CARE_PROCEDURES = Object.freeze({
  lidHygiene: {
    label: "Lid Hygeine",
    titleKey: "eyes.card_label.lid_hygiene",
    folder: "lid_hygiene",
    videos: ["clean_eye", "warm_compress"],
  },
  eyeIrrigation: {
    label: "Eye Irrigation",
    titleKey: "eyes.card_label.eye_irrigation",
    videos: ["irrigate_eye"],
  },
  eyelashRemoval: {
    label: "Eyelash Removal",
    titleKey: "eyes.card_label.eyelash_removal",
    videos: ["remove_eyelashes"],
  },
  foreignBodyRemoval: {
    label: "Foreign Body Removal",
    titleKey: "eyes.card_label.foreign_body_removal",
    videos: ["remove_foreign_body"],
  },
  dropsOintment: {
    label: "Drops & Ointment",
    titleKey: "eyes.card_label.drops_ointment",
    videos: ["instil_medication"],
  },
  eyePadShield: {
    label: "Eye Pad / Shield",
    titleKey: "eyes.card_label.eye_pad_shield",
    videos: ["make_eye_pad", "apply_eye_pad"],
  },
  sightLossGuidance: {
    label: "Sight Loss Guidance",
    titleKey: "eyes.card_label.sight_loss_guidance",
    videos: ["guide_sight_loss"],
  },
});
