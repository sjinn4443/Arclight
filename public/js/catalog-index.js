/**
 * @fileoverview This file contains catalog-index related functions and logic, and defines the mapping between "Eyes" card labels and their corresponding page IDs within the Arclight application.
 */

/**
 * EYES_INDEX maps display labels for "Eyes" related content cards to their respective page IDs.
 * This allows for dynamic navigation based on user selection in the catalog.
 * 'comingSoon' is used as a placeholder for pages not yet implemented.
 */
export const EYES_INDEX = {
  // Core Examination
  "History Taking": "casestudy",
  "Visual Acuity": "visualAcuityPage",
  Pupils: "pupilsPage",
  "Front of Eye": "frontOfEyePage",
  "Fundal Reflex": "comingSoon",
  Ophthalmoscopy: "directOphthalmoscopy",
  "Interactive Learning": "interactiveLearningPage",

  // Disease
  "Uncorrected Refractive Error": "comingSoon",
  Cataract: "cataractPage",
  Glaucoma: "comingSoon",
  "Diabetic Retinopathy": "comingSoon",
  "Corneal Disease": "comingSoon",
  "Childhood Eye Screening": "childhoodEyeScreeningPage",
  "Retinopathy of Prematurity": "comingSoon",
  "Retinal Disease": "comingSoon",
  "Optic Nerve Disease": "comingSoon",

  // Primary Eye Care procedures
  "WHO PEC": "comingSoon",

  // Extended examination
  Ptosis: "comingSoon",
  Proptosis: "comingSoon",
  "Eye Movements/Squint": "squintPalsyPage",
  "Cranial Nerve Examination": "comingSoon",

  // Tools
  "Arclight Overview": "comingSoon",
  "Holo Overview": "comingSoon",
};
