/**
 * @fileoverview This file contains a placeholder for shared logic across various learning modules and handles navigation within these modules.
 */

/**
 * Placeholder function for shared learning modules logic.
 * Currently, it does not contain any specific implementation but serves as an entry point.
 */
export function initializeLearningModules() {
  // placeholder for shared learning modules logic
}

// ==== AUTO-MIGRATED FROM legacy script.js (2025-07-15) ====
// The following functions were ported automatically. Review selectors and
// ensure they are invoked from main.js on `page:loaded` where relevant.
// Functions: initializeLearningModules, showLearningModules, showEarsLearningModules, showCoreClinicalOphthalmicExamination, showArclight, showDiseases

/**
 * Initializes event listeners for various buttons and cards within the learning modules.
 * This function maps button IDs to their respective handlers and card IDs to page navigation.
 */
function _initializeLearningModulesImpl() {
  const buttonMappings = {
    showLearningModulesBtn: showLearningModules,
    showEarsLearningModulesBtn: showEarsLearningModules,
    showCoreClinicalOphthalmicExaminationBtn:
      showCoreClinicalOphthalmicExamination,
    showDiseasesBtn: showDiseases,
    showArclightBtn: showArclight,
    goToAtomsCardEyesBtn: () => goToAtomsCard("eyes"),
    goToAtomsCardEarsBtn: () => goToAtomsCard("ears"),
  };

  for (const [btnId, handler] of Object.entries(buttonMappings)) {
    const button = document.getElementById(btnId);
    if (button) {
      button.addEventListener("click", handler);
    }
  }

  const cardMappings = {
    ophthalmoscopyCard: "directOphthalmoscopy",
    visualacuityCard: "visualAcuityPage",
    fundalreflexFRT: "fundalReflexPage",
    interactiveLearningCard: "interactiveLearningPage",
    miresCard: "miresPage",
    morphCard: "morphPage",
    squintPalsyCard: "squintPalsyPage",
    cataractCard: "cataractPage",
    anteriorSegmentCard: "frontOfEyePage",
    anteriorSegmentVideoCard: "anteriorSegmentVideoPage",
    caseBasedLearningCard: "anteriorSegmentQuizPage",
    pupilsCard: "pupilsPage",
    childhoodEyeScreeningCard: "childhoodEyeScreeningPage",
    howToUseArclightCard: "howToUseArclightVideoPage",
    phoneAttachmentCard: "phoneAttachmentVideoPage",
    rapdVideoCard: "rapdTestVideoPage",
    earsLearningModules: "earsLearningModules",
  };

  // --- Auto-wiring for video/learning cards (ported from baseline behavior) ---
  document.addEventListener("click", (e) => {
    const card = e.target.closest(".module-card");
    if (!card) return;
    const id = card.id;
    if (id && cardMappings[id]) {
      show(cardMappings[id]); // e.g., ophthalmoscopyCard -> directOphthalmoscopy
    }
  });

  // Also attach direct handlers in case delegation fails (older browsers)
  Object.keys(cardMappings).forEach((cardId) => {
    const el = document.getElementById(cardId);
    if (el) {
      el.addEventListener("click", () => show(cardMappings[cardId]));
    }
  });
  // --- end auto-wiring ---//

  // --- Back button wiring for video subpages ---//
  (function wireBackBtn() {
    function attach() {
      const btn = document.getElementById("backBtn");
      if (btn && !btn.__wired) {
        btn.__wired = true;
        // Return to the learning modules hub (matches previous app flow)
        btn.addEventListener("click", () => show("learningModules"));
      }
    }
    document.addEventListener("DOMContentLoaded", attach);
    attach();
  })();
  // --- end back button wiring ---//

  for (const [elementId, pageId] of Object.entries(cardMappings)) {
    const card = document.getElementById(elementId);
    if (card) {
      card.addEventListener("click", () => showPage(pageId));
    }
  }

  document.querySelectorAll("[data-page]").forEach((element) => {
    element.addEventListener("click", () => {
      showPage(element.dataset.page);
    });
  });

  // Special cases with more complex logic
  document.querySelectorAll("#pupilsPage .module-card").forEach((card) => {
    card.addEventListener("click", () => {
      const title = card.querySelector("h3").textContent.trim();
      const pageMap = {
        "Pupil Full Examination": "pupilFullExamPage",
        "Primary Eye Care Examination": "pupilExamPECPage",
        "RAPD Test": "rapdPage",
        "Pupil Pathways Explained": "pupilPathwaysPage",
      };
      if (pageMap[title]) showPage(pageMap[title]);
    });
  });

  document
    .querySelectorAll("#childhoodEyeScreeningPage .module-card")
    .forEach((card) => {
      card.addEventListener("click", () => {
        const title = card.querySelector("h3").textContent.trim();
        const pageMap = {
          "How to Use the Arclight": "howToArclightPage",
          "Assessment of Eyes and Vision": "assessmentVisionPage",
          "Normal and Abnormal Findings": "normalAbnormalPage",
        };
        if (pageMap[title]) showPage(pageMap[title]);
      });
    });
}

/**
 * Displays the 'learningModules' page.
 */
function showLearningModules() {
  showPage("learningModules");
}

/**
 * Displays the 'earsLearningModules' page.
 */
function showEarsLearningModules() {
  showPage("earsLearningModules");
}

/**
 * Displays the 'coreClinicalOphthalmicExamination' page.
 */
function showCoreClinicalOphthalmicExamination() {
  showPage("coreClinicalOphthalmicExamination");
}

/**
 * Displays the 'arclightPage' page.
 */
function showArclight() {
  showPage("arclightPage");
}

/**
 * Displays the 'diseasesPage' page.
 */
function showDiseases() {
  showPage("diseasesPage");
}
