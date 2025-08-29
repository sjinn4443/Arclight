export function initializeLearningModules() {
  // placeholder for shared learning modules logic
}


// ==== AUTO-MIGRATED FROM legacy script.js (2025-07-15) ====
// The following functions were ported automatically. Review selectors and
// ensure they are invoked from main.js on `page:loaded` where relevant.
// Functions: initializeLearningModules, showLearningModules, showEarsLearningModules, showCoreClinicalOphthalmicExamination, showArclight, showDiseases

function initializeLearningModulesImpl() {
  const buttonMappings = {
    'showLearningModulesBtn': showLearningModules,
    'showEarsLearningModulesBtn': showEarsLearningModules,
    'showCoreClinicalOphthalmicExaminationBtn': showCoreClinicalOphthalmicExamination,
    'showDiseasesBtn': showDiseases,
    'showArclightBtn': showArclight,
    'goToAtomsCardEyesBtn': () => goToAtomsCard('eyes'),
    'goToAtomsCardEarsBtn': () => goToAtomsCard('ears'),
  };

  for (const [btnId, handler] of Object.entries(buttonMappings)) {
    const button = document.getElementById(btnId);
    if (button) {
      button.addEventListener('click', handler);
    }
  }

  const cardMappings = {
    'ophthalmoscopyCard': 'directOphthalmoscopy',
    'visualacuityCard': 'visualAcuityPage',
    'fundalreflexFRT': 'fundalReflexPage',
    'interactiveLearningCard': 'interactiveLearningPage',
    'miresCard': 'miresPage',
    'morphCard': 'morphPage',
    'squintPalsyCard': 'squintPalsyPage',
    'cataractCard': 'cataractPage',
    'anteriorSegmentCard': 'frontOfEyePage',
    'anteriorSegmentVideoCard': 'anteriorSegmentVideoPage',
    'caseBasedLearningCard': 'anteriorSegmentQuizPage',
    'pupilsCard': 'pupilsPage',
    'childhoodEyeScreeningCard': 'childhoodEyeScreeningPage',
    'howToUseArclightCard': 'howToUseArclightVideoPage',
    'phoneAttachmentCard': 'phoneAttachmentVideoPage',
    'rapdVideoCard': 'rapdTestVideoPage',
    'earsLearningModules': 'earsLearningModules',
  };

  for (const [elementId, pageId] of Object.entries(cardMappings)) {
    const card = document.getElementById(elementId);
    if (card) {
      card.addEventListener('click', () => showPage(pageId));
    }
  }

  document.querySelectorAll('[data-page]').forEach(element => {
    element.addEventListener('click', () => {
      showPage(element.dataset.page);
    });
  });

  // Special cases with more complex logic
  document.querySelectorAll('#pupilsPage .module-card').forEach(card => {
    card.addEventListener('click', () => {
      const title = card.querySelector('h3').textContent.trim();
      const pageMap = {
        'Pupil Full Examination': 'pupilFullExamPage',
        'Primary Eye Care Examination': 'pupilExamPECPage',
        'RAPD Test': 'rapdPage',
        'Pupil Pathways Explained': 'pupilPathwaysPage',
      };
      if (pageMap[title]) showPage(pageMap[title]);
    });
  });

  document.querySelectorAll('#childhoodEyeScreeningPage .module-card').forEach(card => {
    card.addEventListener('click', () => {
      const title = card.querySelector('h3').textContent.trim();
      const pageMap = {
        'How to Use the Arclight': 'howToArclightPage',
        'Assessment of Eyes and Vision': 'assessmentVisionPage',
        'Normal and Abnormal Findings': 'normalAbnormalPage',
      };
      if (pageMap[title]) showPage(pageMap[title]);
    });
  });
}

function showLearningModules() {
  showPage('learningModules');
}

function showEarsLearningModules() {
  showPage('earsLearningModules');
}

function showCoreClinicalOphthalmicExamination() {
  showPage('coreClinicalOphthalmicExamination');
}

function showArclight() {
  showPage('arclightPage');
}

function showDiseases() {
  showPage('diseasesPage');
}