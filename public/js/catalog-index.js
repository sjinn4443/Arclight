/**
 * @fileoverview This file contains catalog-index related functions and logic, and defines the mapping between "Eyes" card labels and their corresponding page IDs within the Arclight application.
 */

/**
 * EYES_INDEX maps display labels for "Eyes" related content cards to their respective page IDs.
 * This allows for dynamic navigation based on user selection in the catalog.
 * 'comingSoon' is used as a placeholder for pages not yet implemented.
 */
import { EYE_CARE_PROCEDURES } from "./eyeCareProcedureData.js";

export const EYES_INDEX = {
  ...Object.fromEntries(
    Object.entries(EYE_CARE_PROCEDURES).map(([route, procedure]) => [
      procedure.label,
      route,
    ]),
  ),
  // Core Examination
  "History Taking": "casestudy",
  "Visual Acuity": "visualAcuityPage",
  Pupils: "pupilsPage",
  "Front of Eye": "frontOfEyePage",
  "Fundal Reflex": "fundalReflexInteractivePage",
  Ophthalmoscopy: "directOphthalmoscopy",
  "Interactive Learning": "interactiveLearningPage",
  "Tools and Kits": "arclightPage",
  Extended: "extendedExaminationPage",

  // Disease
  "Uncorrected Refractive Error": "comingSoon",
  Cataract: "cataractPage",
  Glaucoma: "glaucomaInteractivePage",
  "Diabetic Retinopathy": "comingSoon",
  "Corneal Disease": "comingSoon",
  "Childhood Eye Screening": "childhoodEyeScreeningPage",
  "Retinopathy of Prematurity": "comingSoon",
  "Retinal Disease": "comingSoon",
  "Optic Nerve Disease": "comingSoon",

  // Primary Eye Care procedures
  PEC: "pecWorkshop",
  "Paediatric Surgical Eye & Ear": "paediatricSurgicalEyeEarWorkshop",

  // Extended examination
  Ptosis: "comingSoon",
  Proptosis: "comingSoon",
  "Eye Movements/Squint": "squintPalsyPage",
  "Cranial Nerve Examination": "comingSoon",

  // Tools
  "Arclight Overview": "arclightPage",
  "Holo Overview": "holoOverviewPage",
};
