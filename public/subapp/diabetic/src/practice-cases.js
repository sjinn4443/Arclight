export const PRACTICE_CASES = [
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
