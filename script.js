// 2025-07-15, Cline @ Arclight App Refactor
// --- GLOBAL STATE AND CONFIGURATION ---

/**
 * @type {string[]} History stack for page navigation.
 */
const pageHistory = [];

/**
 * @type {'eyes' | 'ears'} Tracks the currently selected Table of Contents type.
 */
let currentTOCType = 'eyes';

/**
 * @type {HTMLElement | null} Holds the reference to the search container element.
 */
let searchContainer;

/**
 * @type {Event | null} Holds the deferred event for the PWA installation prompt.
 */
let deferredPrompt = null;

/**
 * @type {string | number | null} Tracks the last pause time in the video player to prevent repeated pauses.
 */
let lastPauseTime = null;

/**
 * @type {number} The current zoom level for the ear health image.
 */
let zoomLevel = 1;


// --- CORE INITIALIZATION ---

/**
 * Main entry point for the application.
 * Attaches all necessary event listeners when the DOM is fully loaded.
 */
document.addEventListener('DOMContentLoaded', () => {
  initializePageNavigation();
  initializeOnboarding();
  initializeDashboard();
  initializeLearningModules();
  initializeTOC();
  initializeToolbar();
  initializePWA();
  initializeQuizzes();
  initializeVideoPlayers();
  initializeMisc();
  initializeProfessionalInterest();
  initializeIntroPage();
  initializeLanguageInstallPage();
  initializeUnifiedDashboard();


  // Set the initial page to be the splash screen.
  showPage('splashScreen');
});


// --- PAGE NAVIGATION ---

/**
 * Handles all page switching logic.
 * @param {string} pageId - The ID of the page element to display.
 * @param {boolean} [skipHistory=false] - If true, the current page will not be added to the history stack.
 */
function showPage(pageId, skipHistory = false) {
  const currentActive = document.querySelector('.page.active');
  if (currentActive && currentActive.id !== pageId && !skipHistory) {
    pageHistory.push(currentActive.id);
  }

  // Pause all videos when switching pages.
  document.querySelectorAll('video').forEach(video => {
    if (!video.paused) {
      video.pause();
    }
  });

  // Hide all pages, then show the target page.
  document.querySelectorAll('.page').forEach(page => page.classList.remove('active'));
  const pageToShow = document.getElementById(pageId);
  if (pageToShow) {
    pageToShow.classList.add('active');
  }

  updateTitleBar(pageId);
  updateDashboardSwitch(pageId);
  updateBottomNavBar(pageId);
}

function initializeIntroPage() {
  const seeWhatBtn = document.getElementById('seeWhatBtn');
  const skipBtn = document.getElementById('skipBtn');

  if (seeWhatBtn) seeWhatBtn.addEventListener('click', () => showPage('unifiedDashboard'));
  if (skipBtn)   skipBtn.addEventListener('click', () => showPage('unifiedDashboard'));
}














/**
 * Initializes general page navigation buttons like the global back and home buttons.
 */
function initializePageNavigation() {
  const backBtnGlobal = document.getElementById('backBtnGlobal');
  if (backBtnGlobal) {
    backBtnGlobal.addEventListener('click', () => {
      if (pageHistory.length > 0) {
        const prevPage = pageHistory.pop();
        showPage(prevPage, true); // `true` to prevent pushing the page back to history
      } else {
        showPage('dashboard'); // Fallback to dashboard
      }
    });
  }

  const homeBtn = document.getElementById('homeBtn');
  if (homeBtn) {
    homeBtn.addEventListener('click', () => showPage('dashboard'));
  }
}

/**
 * Shows or hides the main title bar based on the current page.
 * @param {string} pageId - The ID of the current page.
 */
function updateTitleBar(pageId) {
  const hideTitleBarPages = ['splashScreen', 'registerPage'];
  const titleBar = document.getElementById('titleBar');
  const spacer = document.getElementById('titleBarSpacer');

  if (titleBar && spacer) {
    const shouldHide = hideTitleBarPages.includes(pageId);
    titleBar.style.display = shouldHide ? 'none' : 'flex';
    spacer.style.display = shouldHide ? 'none' : 'block';
  }
}

/**
 * Updates the state and visibility of the bottom navigation bar (Home/Back buttons).
 * @param {string} pageId - The ID of the current page.
 */
function updateBottomNavBar(pageId) {
  const homeBtnContainer = document.getElementById('homeButtonContainer');
  searchContainer = document.getElementById('fixedSearchContainer');

  const showHomePages = [
    'dashboard', 'earsDashboard', 'learningModules', 'coreClinicalOphthalmicExamination',
    'diseasesPage', 'arclightPage', 'childhoodEyeScreeningPage', 'howToUseArclightVideoPage',
    'directOphthalmoscopy', 'atomsCardPage', 'anteriorSegmentQuizPage', 'frontOfEyePage',
    'anteriorSegmentVideoPage', 'pupilsPage', 'rapdTestPage',
    'pupilExamPECPage', 'pupilPathwaysPage', 'howToArclightPage', 'assessmentVisionPage',
    'normalAbnormalPage', 'earsLearningModules', 'otoscopyPage', 'earHealthPage',
    'howToExamineEarPage', 'earConditionsPage', 'earFlowchartPage', 'pupilFullExamPage',
    'rapdPage', 'rapdTestVideoPage', 'phoneAttachmentVideoPage', 'visualAcuityPage',
    'fundalReflexPage', 'interactiveLearningPage', 'miresPage', 'morphPage',
    'squintPalsyPage', 'cataractPage', 'eyesCatalogPage', 'likedPage'
  ];

  const shouldShowNav = showHomePages.includes(pageId);
  if (homeBtnContainer) homeBtnContainer.style.display = shouldShowNav ? 'flex' : 'none';
  if (searchContainer) {
    searchContainer.style.display = ['dashboard', 'earsDashboard'].includes(pageId) ? 'block' : 'none';
  }
}

// --- ONBOARDING & SPLASH SCREEN ---
function initializeOnboarding() {
  // Splash: logo-only, then go to Language & Install page
  window.addEventListener('load', () => {
    setTimeout(() => {
      showPage('languageInstallPage');
    }, 1800); // ~1.8s splash
  });

  // Onboarding form logic
  const completeOnboardingBtn = document.getElementById('completeOnboardingBtn');
  if (completeOnboardingBtn) {
    completeOnboardingBtn.addEventListener('click', completeOnboarding);
  }

  const fieldSelect = document.getElementById('fieldSelect');
  if (fieldSelect) fieldSelect.addEventListener('change', handleFieldSelection);

  const jobSelect = document.getElementById('jobSelect');
  if (jobSelect) {
    jobSelect.addEventListener('change', () => {
      const studentYearField = document.getElementById('studentYearField');
      if (!studentYearField) return;
      const isMedStudent = jobSelect.value === 'Medical Student';
      studentYearField.classList.toggle('hidden', !isMedStudent);
      const inner = document.getElementById('studentYearSelect');
      if (inner) inner.classList.remove('hidden');
    });
  }
}


/**
 * Handles the logic for completing the onboarding form.
 */
function completeOnboarding() {
  const username = document.getElementById('username')?.value.trim();
  const job = document.getElementById('jobSelect')?.value;

  // Language is on the previous page now; it's optional here.
  // If you want to require it, read it from 'prefLang' instead:
  // const language = document.getElementById('prefLang')?.value;

  if (!username || !job) {
    alert("Please complete all fields.");
    return;
  }

  localStorage.setItem('username', username);
  // Go to "What is your professional interest?"
  showPage('proInterestPage');
}


/**
 * Populates the job role dropdown based on the selected field.
 */
function handleFieldSelection() {
  const fieldSelect = document.getElementById('fieldSelect');
  const jobSelect = document.getElementById('jobSelect');
  const studentYearSelect = document.getElementById('studentYearSelect');
  const selectedField = fieldSelect.value;

  // Hide all optgroups first
  jobSelect.querySelectorAll('optgroup').forEach(optgroup => {
    optgroup.style.display = 'none';
  });

  // Show the relevant optgroup
  const optgroupToShow = jobSelect.querySelector(`optgroup[label="${selectedField.charAt(0).toUpperCase() + selectedField.slice(1)}"]`);
  if (optgroupToShow) {
    optgroupToShow.style.display = 'block';
  }

  jobSelect.value = ""; // Reset selection
  jobSelect.classList.remove('hidden');
  studentYearSelect.classList.add('hidden');
}

// Make the visible text grey only when placeholder is selected
function paintSelectColor(el) {
  const opt = el.options[el.selectedIndex];
  const isPlaceholder = !opt || opt.disabled;
  el.style.color = isPlaceholder ? '#ccccd1' : '#000000';
}

['fieldSelect','jobSelect','studentYearSelect','location'].forEach(id => {
  const el = document.getElementById(id);
  if (el) {
    paintSelectColor(el);            // initial paint
    el.addEventListener('change', () => paintSelectColor(el));
  }
});


function initializeUnifiedDashboard() {
  // 1) Greeting
  const usernameDisplay = document.querySelector('#unifiedDashboard .hello');
  if (usernameDisplay) {
    const storedName = localStorage.getItem('username') || 'Guest';
    usernameDisplay.textContent = `Hello ${storedName}!`;
  }

  // 2) Carousel wiring
  const carousel = document.getElementById('categoryCarousel');
  if (!carousel) return;

  // Click routing
  carousel.querySelectorAll('.category-card').forEach(card => {
    card.addEventListener('click', () => {
      const target = card.dataset.target;
      if (target === 'learningModules') {
        showLearningModules();
      } else if (target === 'earsLearningModules') {
        showEarsLearningModules();
      } else {
        showPage(target);
      }
    });
  });

  // --- Dots: update on scroll and click ---
  const dots = Array.from(document.querySelectorAll('#carouselDots .dot'));

  const getActiveIndex = () => {
    const cards = Array.from(carousel.querySelectorAll('.category-card'));
    const mid = carousel.scrollLeft + carousel.offsetWidth / 2;
    let best = 0, bestDist = Infinity;
    cards.forEach((card, i) => {
      const center = card.offsetLeft + card.offsetWidth / 2;
      const d = Math.abs(center - mid);
      if (d < bestDist) { bestDist = d; best = i; }
    });
    return best;
  };

  const paintDots = (i) => {
    dots.forEach((d, idx) => d.classList.toggle('active', idx === i));
  };

  const centerCardByIndex = (i) => {
    const cards = carousel.querySelectorAll('.category-card');
    if (!cards.length) return;
    const clamped = Math.max(0, Math.min(i, cards.length - 1));
    const card = cards[clamped];
    const left = card.offsetLeft - (carousel.offsetWidth / 2) + (card.offsetWidth / 2);
    carousel.scrollTo({ left, behavior: 'smooth' });
  };

  // Scroll listener to update dots
  let rafId = null;
  const onScroll = () => {
    if (rafId) return;
    rafId = requestAnimationFrame(() => {
      rafId = null;
      paintDots(getActiveIndex());
    });
  };
  carousel.addEventListener('scroll', onScroll, { passive: true });

  // Click dots to center specific card
  dots.forEach((dot, i) => dot.addEventListener('click', () => centerCardByIndex(i)));

  // Start centered on the 2nd card (index 1) and paint dots
  requestAnimationFrame(() => {
    centerCardByIndex(1);
    paintDots(1);
  });
}


// === Recommended modules ===
const recommendedContainer = document.getElementById('recommendedPlaceholder');
if (recommendedContainer) {
  // Example: array of module objects (replace with your real list)
  const allModules = [
  { title: "Direct Ophthalmoscopy", img: "images/direct-ophthalmoscopy.jpg", target: "directOphthalmoscopy" },
  { title: "Cataract", img: "images/cataract.jpg", target: "cataractPage" },
  { title: "Pupil Exam", img: "images/pupil-exam.jpg", target: "pupilsPage" },
  { title: "Visual Acuity", img: "images/visual-acuity.jpg", target: "visualAcuityPage" }
];


  // Pick 2 random unique modules
  const shuffled = allModules.sort(() => Math.random() - 0.5);
const picks = shuffled.slice(0, 2);

// Add inside initializeUnifiedDashboard(), after the recommendedContainer code
document.querySelectorAll('.quick-actions .pill').forEach(btn => {
  if (btn.textContent.trim() === 'Atoms Card') {
    btn.addEventListener('click', () => goToAtomsCard('eyes')); // or 'ears' as needed
  }
});

document.querySelectorAll('.quick-actions .pill').forEach(btn => {
  if (btn.textContent.trim() === 'Download Contents') {
    btn.addEventListener('click', showOfflineContentModal);
  }
});



  // Render cards
  recommendedContainer.innerHTML = picks.map(m => `
    <div class="module-card" data-target="${m.target}">
      <img src="${m.img}" alt="${m.title}" />
      <div class="module-title">${m.title}</div>
    </div>
  `).join('');

  // Click events for cards
  recommendedContainer.querySelectorAll('.module-card').forEach(card => {
    card.addEventListener('click', () => {
      const target = card.dataset.target;
      if (target === 'learningModules') showLearningModules();
      else if (target === 'earsLearningModules') showEarsLearningModules();
      else showPage(target);
    });
  });
}

// replace the single getElementById block:
const menuButtons = document.querySelectorAll('.menuBtn');
const menuOverlay = document.getElementById('menuOverlay');
const closeMenuBtn = document.getElementById('closeMenuBtn');

if (menuButtons.length && menuOverlay && closeMenuBtn) {
  menuButtons.forEach(btn => {
    btn.addEventListener('click', () => menuOverlay.classList.remove('hidden'));
  });
  closeMenuBtn.addEventListener('click', () => {
    menuOverlay.classList.add('hidden');
  });
}


// Example: Set user's name in menu (assuming you store it in localStorage at registration)
const menuUsernameEl = document.getElementById('menuUsername');
const savedUsername = localStorage.getItem('username'); // e.g. set during registration

if (menuUsernameEl && savedUsername) {
  menuUsernameEl.textContent = `${savedUsername}`;
}


// Tab switching logic
const tabs = document.querySelectorAll('.menu-tabs .tab');
const tabContents = {
  'Learning': document.getElementById('learningTab'),
  'Community': document.getElementById('communityTab'),
  'Links': document.getElementById('linksTab'),
};

tabs.forEach(tab => {
  tab.addEventListener('click', () => {
    // Highlight active tab
    tabs.forEach(t => t.classList.remove('active'));
    tab.classList.add('active');

    // Hide all tab content
    Object.values(tabContents).forEach(section => {
      if (section) section.classList.add('hidden');
    });

    // Show selected tab content
    const label = tab.textContent.trim();
    if (tabContents[label]) {
      tabContents[label].classList.remove('hidden');
    }
  });
});


// Show download contents popup
document.getElementById('downloadedContentsBtn')?.addEventListener('click', () => {
  document.getElementById('offlineContentModal').style.display = 'block';
});

// Atoms Card: Eyes
document.getElementById('atomsCardEyesBtn')?.addEventListener('click', () => {
  showPage('atomsCardPage');
  document.getElementById('eyesTab')?.click();
  document.getElementById('menuOverlay')?.classList.add('hidden');
});

// Atoms Card: Ears
document.getElementById('atomsCardEarsBtn')?.addEventListener('click', () => {
  showPage('atomsCardPage');
  document.getElementById('earsTab')?.click();
  document.getElementById('menuOverlay')?.classList.add('hidden');
});




// --- DASHBOARD ---

/**
 * Initializes dashboard-specific elements like the eyes/ears toggle switch.
 */
function initializeDashboard() {
  const goToDashboardBtn = document.getElementById('goToDashboardBtn');
  if (goToDashboardBtn) {
    goToDashboardBtn.addEventListener('click', goToDashboard);
  }

  const goToEarsDashboardBtn = document.getElementById('goToEarsDashboardBtn');
  if (goToEarsDashboardBtn) {
    goToEarsDashboardBtn.addEventListener('click', goToEarsDashboard);
  }

  const eyesSwitch = document.getElementById('eyesToEarsSwitch');
  if (eyesSwitch) {
    eyesSwitch.addEventListener('change', function() {
      if (this.checked) {
        showPage('earsDashboard');
      }
    });
  }

  const earsSwitch = document.getElementById('earsToEyesSwitch');
  if (earsSwitch) {
    earsSwitch.addEventListener('change', function() {
      if (!this.checked) {
        showPage('dashboard');
      }
    });
  }
}

/**
 * Updates the eyes/ears toggle switch based on the current dashboard page.
 * @param {string} pageId - The ID of the current page.
 */
function updateDashboardSwitch(pageId) {
  const eyesSwitch = document.getElementById('eyesToEarsSwitch');
  const earsSwitch = document.getElementById('earsToEyesSwitch');

  if (pageId === 'dashboard' && eyesSwitch) {
    eyesSwitch.checked = false;
  }

  if (pageId === 'earsDashboard' && earsSwitch) {
    earsSwitch.checked = true;
  }
}

/**
 * Navigates to the main (eyes) dashboard.
 */
function goToDashboard() {
  showPage('dashboard');
}

/**
 * Navigates to the ears dashboard.
 */
function goToEarsDashboard() {
  showPage('earsDashboard');
}


// --- LEARNING MODULES ---

/**
 * Initializes click listeners for all learning module cards.
 */
function initializeLearningModules() {
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

/**
 * Navigates to the main learning modules page.
 */
function showLearningModules() {
  showPage('learningModules');
}

/**
 * Navigates to the ears learning modules page.
 */
function showEarsLearningModules() {
  showPage('earsLearningModules');
}

/**
 * Navigates to the core clinical examination page.
 */
function showCoreClinicalOphthalmicExamination() {
  showPage('coreClinicalOphthalmicExamination');
}

/**
 * Navigates to the Arclight usage page.
 */
function showArclight() {
  showPage('arclightPage');
}

/**
 * Navigates to the diseases page.
 */
function showDiseases() {
  showPage('diseasesPage');
}


// --- TABLE OF CONTENTS (TOC) for ATOMS ---

/**
 * Initializes the Table of Contents (TOC) functionality.
 */
function initializeTOC() {
  const tocToggleBtn = document.getElementById('tocToggleBtn');
  if (tocToggleBtn) {
    tocToggleBtn.addEventListener('click', openTOC);
  }

  const closeTOCBtn = document.getElementById('closeTOCBtn');
  if (closeTOCBtn) {
    closeTOCBtn.addEventListener('click', closeTOC);
  }

  const eyesBtn = document.getElementById('eyesTab');
  if (eyesBtn) {
    eyesBtn.addEventListener('click', () => showTOC('eyes'));
  }

  const earsBtn = document.getElementById('earsTab');
  if (earsBtn) {
    earsBtn.addEventListener('click', () => showTOC('ears'));
  }

  const tocList = document.getElementById('tocList');
  if (tocList) {
    tocList.addEventListener('click', handleTOCItemClick);
  }
}

/**
 * Navigates to the Atoms card page and initializes the TOC.
 * @param {'eyes' | 'ears'} [type='eyes'] - The type of content to show in the TOC.
 */
function goToAtomsCard(type = 'eyes') {
  showPage('atomsCardPage');
  openTOC();

  const atomsImageContainer = document.getElementById('atomsImageContainer');
  if (atomsImageContainer) atomsImageContainer.innerHTML = '';

  showTOC(type);
}

/**
 * Opens the TOC overlay.
 */
function openTOC() {
  const dropdown = document.getElementById('tocDropdown');
  if (!dropdown) return;
  dropdown.classList.remove('hidden', 'slide-up');
  dropdown.classList.add('active');

  document.getElementById('closeTOCBtn').style.display = 'block';
  document.getElementById('tocToggleBtn').style.display = 'none';
}

/**
 * Closes the TOC overlay.
 */
function closeTOC() {
  const dropdown = document.getElementById('tocDropdown');
  if (!dropdown) return;
  dropdown.classList.add('slide-up');
  dropdown.classList.remove('active');

  setTimeout(() => {
    dropdown.classList.add('hidden');
    dropdown.classList.remove('slide-up');
  }, 300);

  document.getElementById('closeTOCBtn').style.display = 'none';
  document.getElementById('tocToggleBtn').style.display = 'block';
}

/**
 * Populates and displays the TOC list based on the selected type.
 * @param {'eyes' | 'ears'} [type='eyes'] - The content type.
 */
function showTOC(type = 'eyes') {
  currentTOCType = type;
  setActiveTab(type);

  const tocList = document.getElementById('tocList');
  tocList.innerHTML = '';

  const content = {
    eyes: ['Anatomy', 'Arclight', 'Front of Eye Case Test', 'Child', 'Front of Eye', 'Fundal Reflex', 'Fundus', 'Glaucoma', 'How to Check for Eyeglasses', 'How to Use', 'Lens', 'Pupil', 'Red Eye', 'Summary', 'Vision Loss'],
    ears: ['Anatomy', 'Childhood Hearing Development', 'Ear Drum', 'External Ear: Pinna']
  };

  const items = (type === 'eyes' ? content.eyes : content.ears);
  items.sort().forEach(item => {
    const li = document.createElement('li');
    li.textContent = item;
    tocList.appendChild(li);
  });

  const imgBox = document.getElementById('atomsImageContainer');
  if (imgBox) imgBox.innerHTML = '';
}

/**
 * Handles clicks on TOC items to display the corresponding image.
 * @param {Event} e - The click event.
 */
function handleTOCItemClick(e) {
  if (e.target.tagName !== 'LI') return;

  const topic = e.target.textContent.trim();
  const container = document.getElementById('atomsImageContainer');
  container.innerHTML = ''; // Clear previous content

  // Special handling for Anatomy which has different images for eyes and ears
  if (topic === 'Anatomy') {
    if (currentTOCType === 'ears') {
      displayImage('images/EarAnatomy.png', 'Ear Anatomy', container);
    } else {
      displayImage('images/Anatomy1.png', 'Eye Anatomy 1', container);
      displayImage('images/Anatomy2.png', 'Eye Anatomy 2', container);
    }
  } else {
    // Default case for all other topics
    const filenameMap = {
      "Arclight": "Arclight.png",
      "Front of Eye Case Test": "CaseStudy.png",
      "Child": "Child.png",
      "Front of Eye": "FrontOfEye.png",
      "Fundal Reflex": "FundalReflex.png",
      "Fundus": "Fundus.png",
      "Glaucoma": "Glaucoma.png",
      "How to Check for Eyeglasses": "Refract.png",
      "How to Use": "HowToUse.png",
      "Lens": "Lens.png",
      "Pupil": "Pupil.png",
      "Red Eye": "RedEye.png",
      "Summary": "Summary.png",
      "Vision Loss": "Summary.png",
      "Ear Drum": "Drum.png",
      "External Ear: Pinna": "Ear.png",
      "Childhood Hearing Development": "EarChild.png",
    };
    const filename = filenameMap[topic] || `${topic.replace(/\s/g, '')}.png`;
    const img = displayImage(`images/${filename}`, topic, container);

    if (['CaseStudy', 'FundalReflex'].includes(topic.replace(/\s/g, ''))) {
      img.style.transform = 'rotate(90deg)';
    }
  }

  // ✅ KEEP THE TOC OPEN: Don't auto-close the dropdown
  // closeTOC(); ← removed
}


document.addEventListener('DOMContentLoaded', () => {
  const likedMenuItem = document.getElementById('likedMenuItem');
  likedMenuItem?.addEventListener('click', () => {
    showLikedPage();
    document.getElementById('menuOverlay')?.classList.add('hidden'); // close menu
  });

  // Back button on Liked page
  document.getElementById('likedBackBtn')?.addEventListener('click', () => {
    showPage('dashboard');
  });
});

// --- Likes (persisted) ---
  const LIKES_KEY = 'eyesLikes';
  const getLikes = () => new Set(JSON.parse(localStorage.getItem(LIKES_KEY) || '[]'));
  const saveLikes = (set) => localStorage.setItem(LIKES_KEY, JSON.stringify([...set]));


function getAllEyesItems() {
  const s = window.EYES_SECTIONS || {};
  return Object.values(s).flat(); // flatten core/disease/pec/extended/tools
}

function showLikedPage() {
  const mason = document.getElementById('likedMasonry');
  if (!mason) { showPage('likedPage'); return; }

  const likes = getLikes(); // uses LIKES_KEY = 'eyesLikes'  :contentReference[oaicite:3]{index=3}

  // Pull all Eyes items from your catalog (core/disease/pec/extended/tools)
  // getAllEyesItems() already exists and flattens EYES_SECTIONS for you. :contentReference[oaicite:4]{index=4}
  const allEyes = getAllEyesItems();

  // Keep only liked items
  let likedItems = allEyes.filter(i => likes.has(i.label));

  // Shuffle for a fresh look each time
  likedItems = likedItems.sort(() => Math.random() - 0.5);

  // Assign random size buckets for the masonry feel
  const pickSize = () => {
    const r = Math.random();
    if (r < 0.45) return 'size-s';   // ~45%
    if (r < 0.80) return 'size-m';   // ~35%
    return 'size-l';                 // ~20%
  };

  const renderCard = (item) => {
  const badges = (item.tags || []).slice(0,3).map(t => `<span class="ml-badge">${t}</span>`).join('');
  const size = pickSize();
  return `<button class="ml-card ${size}" data-target="${item.target || 'comingSoon'}">
    <div class="ml-card-header">
      <h4>${item.label}</h4>
      <span class="ml-heart">❤</span>
    </div>
    <div class="ml-badges">${badges}</div>
  </button>`;
};

  mason.innerHTML = likedItems.length
    ? likedItems.map(renderCard).join('')
    : `<p class="note">No liked items yet. Tap the heart on any Eyes card to add it here.</p>`;

  // Navigation
  mason.onclick = (e) => {
    const card = e.target.closest('.ml-card');
    if (!card) return;
    const target = card.getAttribute('data-target') || 'comingSoon';
    if (target === 'comingSoon') {
      const h = document.getElementById('comingSoonTitle');
      if (h) h.textContent = 'Coming soon';
    }
    showPage(target);
  };

  // Search filter (works across all cards now)
  const search = document.getElementById('mlSearch');
  if (search) {
    const filter = () => {
      const q = search.value.toLowerCase();
      mason.querySelectorAll('.ml-card').forEach(card => {
        const title = card.querySelector('h4').textContent.toLowerCase();
        card.style.display = title.includes(q) ? '' : 'none';
      });
    };
    search.oninput = filter;
  }

  // Chips – still cosmetic toggles for now
  document.querySelectorAll('.ml-chip').forEach(chip => {
    chip.addEventListener('click', () => {
      document.querySelectorAll('.ml-chip').forEach(c => c.classList.remove('active'));
      chip.classList.add('active');
    });
  });

  showPage('likedPage');
}





/**
 * Creates and appends an image to a container.
 * @param {string} src - The source URL of the image.
 * @param {string} alt - The alt text for the image.
 * @param {HTMLElement} container - The container to append the image to.
 * @returns {HTMLImageElement} The created image element.
 */
function displayImage(src, alt, container) {
  const img = document.createElement('img');
  img.src = src;
  img.alt = alt;
  img.style.maxWidth = '100%';
  img.style.maxHeight = '100%';
  img.style.objectFit = 'contain';
  img.style.borderRadius = '12px';
  img.style.marginBottom = '10px';
  container.appendChild(img);
  return img;
}

/**
 * Sets the active class on the correct TOC tab (Eyes/Ears).
 * @param {'eyes' | 'ears'} type - The active tab type.
 */
function setActiveTab(type) {
  const eyesBtn = document.getElementById('eyesTab');
  const earsBtn = document.getElementById('earsTab');
  if (eyesBtn && earsBtn) {
    eyesBtn.classList.toggle('active', type === 'eyes');
    earsBtn.classList.toggle('active', type === 'ears');
  }
}


// --- VIDEO PLAYER & TOOLBAR ---

/**
 * Initializes the video player and its associated toolbar.
 */
function initializeToolbar() {
  const toolbarButtonMappings = {
    'timestampBtn': showTimestamps,
    'noteBtn': showNote,
    'folderBtn': showFiles,
    'infoBtn': showDefaultInfo,
    'quizBtn': launchQuiz,
  };

  for (const [btnId, handler] of Object.entries(toolbarButtonMappings)) {
    const button = document.getElementById(btnId);
    if (button) button.addEventListener('click', handler);
  }
}

/**
 * Initializes the video player with time-based events.
 */
function initializeVideoPlayers() {
  const video = document.getElementById('customVideo');
  if (video) {
    video.addEventListener('timeupdate', handleVideoTimeUpdate);
  }
}

/**
 * Handles time updates for the main video player to show contextual info.
 */
function handleVideoTimeUpdate() {
  const video = document.getElementById('customVideo');
  if (!video) return;

  const time = Math.floor(video.currentTime);
  const contentBox = document.getElementById('contentBox');

  const pauseEvents = {
    22: {
      id: 'eye-info',
      handler: () => {
        contentBox.innerHTML = `
          <h4>Eye Anatomy</h4>
          <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/6/64/Eye_anatomy_diagram.svg/1200px-Eye_anatomy_diagram.svg.png" style="width: 100%; border-radius: 5px; margin-top: 10px;" />
          <ul><li>Periorbita</li><li>Eyelids</li><li>Eyes</li></ul>`;
      }
    },
    32: {
      id: 'device-info',
      handler: () => {
        contentBox.innerHTML = `
          <h4>Arclight Device Overview</h4>
          <img src="images/arclight_device.png" style="width: 100%; border-radius: 5px;" />`;
      }
    }
  };

  if (pauseEvents[time] && lastPauseTime !== pauseEvents[time].id) {
    lastPauseTime = pauseEvents[time].id;
    video.pause();
    pauseEvents[time].handler();
    setTimeout(() => video.play(), 5000); // Auto-resume after 5 seconds
  }
}

/**
 * Seeks the video to a specific time.
 * @param {number} sec - The time in seconds to seek to.
 */
function seekTo(sec) {
  const video = document.getElementById('customVideo');
  if (video) {
    video.currentTime = sec;
    video.play();
    lastPauseTime = null; // Reset pause tracking
  }
}

/**
 * Displays timestamps in the content box.
 */
function showTimestamps() {
  setActiveToolbarButton('timestampBtn');
  const contentBox = document.getElementById('contentBox');
  contentBox.innerHTML = `
    <h4>Time stamp</h4>
    <p><a href="#" onclick="seekTo(0)">0:00 General Inspection</a></p>
    <p><a href="#" onclick="seekTo(28)">0:28 Arclight Setup</a></p>
    <p><a href="#" onclick="seekTo(47)">0:47 Fundal Reflex</a></p>
    <p><a href="#" onclick="seekTo(67)">1:07 Optic Nerve</a></p>
    <p><a href="#" onclick="seekTo(102)">1:42 Retinal Vessels</a></p>`;
}

/**
 * Displays a textarea for notes.
 */
function showNote() {
  setActiveToolbarButton('noteBtn');
  document.getElementById('contentBox').innerHTML = '<textarea placeholder="Type your notes here..."></textarea>';
}

/**
 * Displays a list of attached files.
 */
function showFiles() {
  setActiveToolbarButton('folderBtn');
  document.getElementById('contentBox').innerHTML = `
    <h4>Attached Files</h4>
    <p><a class="link" href="#">Arclight_Device_Practice.pdf</a></p>
    <p><a class="link" href="#">Fundal_Reflex.pdf</a></p>
    <p><a class="link" href="#">Ophthalmoscopy_Exercise.docx</a></p>`;
}

/**
 * Displays default information about the video.
 */
function showDefaultInfo() {
  setActiveToolbarButton('infoBtn');
  document.getElementById('contentBox').innerHTML = `
    <h4>Additional Information</h4>
    <p>This video shows how to prepare and use the Arclight ophthalmoscope.</p>`;
}

/**
 * Sets the 'active' class on the clicked toolbar button.
 * @param {string} id - The ID of the button to activate.
 */
function setActiveToolbarButton(id) {
  document.querySelectorAll('.toolbar button').forEach(btn => btn.classList.remove('active'));
  const activeBtn = document.getElementById(id);
  if (activeBtn) activeBtn.classList.add('active');
}


// --- QUIZZES ---

/**
 * Initializes all quiz-related functionality.
 */
function initializeQuizzes() {
  // This function could be expanded if more quizzes are added.
  // For now, the quiz logic is self-contained in launchQuiz and the IIFE.
}

/**
 * Launches the Direct Ophthalmoscopy quiz.
 */
function launchQuiz() {
  const previousPage = document.querySelector('.page.active')?.id || 'dashboard';
  const quizPageId = 'directOphthalmoscopyQuizPage';

  // Avoid creating duplicate quiz pages
  if (document.getElementById(quizPageId)) {
    showPage(quizPageId);
    return;
  }

  const quizPage = document.createElement('div');
  quizPage.id = quizPageId;
  quizPage.className = 'page';
  quizPage.innerHTML = `
    <div class="quiz-container">
      <div class="quiz-header small">
        <div class="quiz-header-row centered">
          <button id="backToVideoBtn" class="back-icon" title="Go back">←</button>
          <h2>Quiz</h2>
        </div>
      </div>
      <div class="quiz-scroll"><form id="quizForm"></form></div>
      <div class="quiz-footer">
        <button type="submit" form="quizForm" class="start-btn">See Results</button>
      </div>
      <div id="quizModal" class="quiz-modal hidden">
        <div class="quiz-modal-content">
          <p id="quizScoreText"></p>
          <button id="seeWhyBtn">See why?</button>
        </div>
      </div>
    </div>`;
  document.getElementById('appRoot').appendChild(quizPage);

  const questions = [
    { q: "1. When starting direct ophthalmoscopy, what is the ideal distance between the examiner and the patient?", options: ["5 cm", "10 cm", "15 cm", "Arm’s length"], answer: 3 },
    { q: "2. Which of the options describe the best condition to get the view of the retina?", options: ["Outdoors with bright sunlight, dilated pupil", "Deem room with dilated pupil", "Indoors with bright light, dilated pupil", "Deem room with constricted pupil"], answer: 1 },
    { q: "3. Which eye should you use to examine the patient’s right eye?", options: ["Left eye", "Either eye", "Right eye", "Dominant eye"], answer: 2 },
    { q: "4. During ophthalmoscopy, which part of the back of the eye should you identify first?", options: ["Macula", "Optic disc", "Retinal periphery", "Fovea"], answer: 1 },
    { q: "5. What is the name given to pale optic disc?", options: ["Normal finding", "Cataract", "Optic atrophy", "Raised intraocular pressure"], answer: 2 },
    { q: "6. Which lighting condition is recommended for performing ophthalmoscopy with the Arclight?", options: ["Bright daylight", "Dim or darkened room", "Bright room", "Ambient light"], answer: 1 },
    { q: "7. What does a cup-to-disc ratio (CDR) of 0.7 or greater typically suggest on fundus examination?", options: ["Glaucoma", "Macular degeneration", "Diabetic retinopathy", "Retinal detachment"], answer: 0 }
  ];

  const quizForm = quizPage.querySelector('#quizForm');
  questions.forEach((q, i) => {
    let block = `<div class="quiz-block"><p>${q.q}</p>`;
    q.options.forEach((opt, j) => {
      block += `<label class="radio-label"><input type="radio" name="q${i}" value="${j}" /><span>${opt}</span></label>`;
    });
    block += `<p class="answer" style="display:none; margin-top:5px; font-style:italic;">Correct answer: ${q.options[q.answer]}</p></div>`;
    quizForm.innerHTML += block;
  });

  quizForm.onsubmit = (e) => {
    e.preventDefault();
    let correct = 0;
    questions.forEach((q, i) => {
      const radios = quizForm.querySelectorAll(`input[name="q${i}"]`);
      const answer = q.answer;
      let selected = null;
      radios.forEach(r => {
        r.disabled = true;
        if (r.checked) selected = parseInt(r.value);
      });
      const labels = radios[0].closest('.quiz-block').querySelectorAll('label');
      labels.forEach((label, index) => {
        if (index === answer) label.classList.add('correct');
        else if (parseInt(label.querySelector('input').value) === selected) label.classList.add('wrong');
      });
      if (selected === answer) correct++;
    });
    quizPage.querySelector('#quizScoreText').innerText = `You got ${correct} out of ${questions.length} correct.`;
    quizPage.querySelector('#quizModal').classList.remove('hidden');
  };

  quizPage.querySelector('#seeWhyBtn').addEventListener('click', () => {
    quizPage.querySelector('#quizModal').classList.add('hidden');
    quizPage.querySelectorAll('.answer').forEach(a => a.style.display = 'block');
  });

  quizPage.querySelector('#backToVideoBtn').addEventListener('click', () => {
    showPage(previousPage);
  });

  showPage(quizPageId);
}

/**
 * Anterior Segment Quiz Module (IIFE to encapsulate logic)
 */
(function() {
  const container = document.getElementById('anteriorSegmentQuizModule');
  if (!container) return;

  const elements = {
    caseTitle: container.querySelector("#caseTitle"),
    caseSubtitle: container.querySelector("#caseSubtitle"),
    caseImage: container.querySelector("#caseImage"),
    quizForm: container.querySelector("#quizForm"),
    prevQuestionBtn: container.querySelector("#prevQuestionBtn"),
    nextQuestionBtn: container.querySelector("#nextQuestionBtn"),
    nextCaseBtn: container.querySelector("#nextCaseBtn"),
    scoreCard: container.querySelector("#scoreCard"),
    quizCard: container.querySelector("#quizCard"),
    scoreText: container.querySelector("#scoreText"),
    restartBtn: container.querySelector("#restartBtn"),
    reviewBtn: container.querySelector("#reviewBtn"),
    reviewCard: container.querySelector("#reviewCard"),
    reviewContent: container.querySelector("#reviewContent"),
    closeReviewBtn: container.querySelector("#closeReviewBtn"),
    backBtn: container.querySelector("#anteriorQuizBackBtn"),
  };

  const cases = [
    { title: "6 month old baby: 'Eye looks funny'", image: "images/case1_eye.png", questions: [
        { question: "What is the dominant abnormal sign?", options: ["Hazey/grey cornea", "White pupil (leucocoria)", "Keratic precipitates", "Hypopyon"], correctIndex: 1 },
        { question: "What is the most likely diagnosis?", options: ["Corneal scar", "Congenital cataract", "Infective keratitis", "Limbal dermoid"], correctIndex: 1 },
        { question: "What should you do?", options: ["Prescribe topical antibiotics", "Refer urgently to an eye-care professional", "Reassure and discharge", "Assess for spectacles only"], correctIndex: 1 }
    ]},
    // ... Add all other cases here ...
  ];

  let currentCaseIndex = 0;
  let currentQuestionIndex = 0;
  let answers = [];

  function renderQuestion(caseIndex, questionIndex) {
    const c = cases[caseIndex];
    const q = c.questions[questionIndex];
    elements.caseTitle.textContent = `Case ${caseIndex + 1}`;
    elements.caseSubtitle.textContent = c.title;
    elements.caseImage.src = c.image;
    elements.quizForm.innerHTML = "";
    const div = document.createElement("div");
    div.className = "question";
    div.innerHTML = `<h3>${questionIndex + 1}. ${q.question}</h3><ul class="options"></ul>`;
    q.options.forEach((opt, optIndex) => {
      const li = document.createElement("li");
      li.innerHTML = `<input type="radio" name="q${questionIndex}" id="c${caseIndex}q${questionIndex}o${optIndex}" value="${optIndex}"><label for="c${caseIndex}q${questionIndex}o${optIndex}">${opt}</label>`;
      const input = li.querySelector('input');
      if (answers[caseIndex][questionIndex] === optIndex) input.checked = true;
      input.onchange = () => {
        answers[caseIndex][questionIndex] = parseInt(input.value);
        updateButtons();
      };
      div.querySelector('.options').appendChild(li);
    });
    elements.quizForm.appendChild(div);
    updateButtons();
  }

  function updateButtons() {
    elements.prevQuestionBtn.disabled = currentQuestionIndex === 0;
    elements.nextQuestionBtn.disabled = currentQuestionIndex === cases[currentCaseIndex].questions.length - 1;
    const allAnswered = !answers[currentCaseIndex].some(a => a === null);
    elements.nextCaseBtn.style.display = allAnswered ? "block" : "none";
  }

  function showScore() {
    elements.quizCard.style.display = "none";
    elements.scoreCard.style.display = "block";
    let correctCount = 0;
    cases.forEach((c, caseIdx) => {
      c.questions.forEach((q, qIdx) => {
        if (answers[caseIdx]?.[qIdx] === q.correctIndex) correctCount++;
      });
    });
    elements.scoreText.textContent = `You scored ${correctCount} out of ${cases.flatMap(c => c.questions).length} correct.`;
  }

  function buildReview() {
    elements.reviewContent.innerHTML = "";
    cases.forEach((c, caseIdx) => {
      const caseDiv = document.createElement("div");
      caseDiv.className = "review-case";
      caseDiv.innerHTML = `<h2>Case ${caseIdx + 1}</h2><div id="caseSubtitle">${c.title}</div><img class="case-image" src="${c.image}" alt="${c.title}">`;
      c.questions.forEach((q, qIdx) => {
        const qDiv = document.createElement("div");
        qDiv.className = "review-question";
        qDiv.innerHTML = `<h3>${qIdx + 1}. ${q.question}</h3><ul class="review-options"></ul>`;
        q.options.forEach((opt, optIdx) => {
          const li = document.createElement("li");
          li.textContent = opt;
          if (optIdx === q.correctIndex) li.classList.add("correct");
          if (answers[caseIdx][qIdx] === optIdx) li.classList.add("user-selected");
          qDiv.querySelector('ul').appendChild(li);
        });
        caseDiv.appendChild(qDiv);
      });
      elements.reviewContent.appendChild(caseDiv);
    });
  }

  window.startAnteriorSegmentQuiz = () => {
    currentCaseIndex = 0;
    currentQuestionIndex = 0;
    answers = cases.map(c => new Array(c.questions.length).fill(null));
    elements.scoreCard.style.display = "none";
    elements.reviewCard.style.display = "none";
    elements.quizCard.style.display = "block";
    renderQuestion(currentCaseIndex, currentQuestionIndex);
  };

  elements.prevQuestionBtn.onclick = () => { if (currentQuestionIndex > 0) renderQuestion(currentCaseIndex, --currentQuestionIndex); };
  elements.nextQuestionBtn.onclick = () => { if (currentQuestionIndex < cases[currentCaseIndex].questions.length - 1) renderQuestion(currentCaseIndex, ++currentQuestionIndex); };
  elements.nextCaseBtn.onclick = () => {
    currentCaseIndex++;
    currentQuestionIndex = 0;
    if (currentCaseIndex >= cases.length) showScore();
    else renderQuestion(currentCaseIndex, currentQuestionIndex);
  };
  elements.restartBtn.onclick = window.startAnteriorSegmentQuiz;
  elements.reviewBtn.onclick = () => {
    elements.scoreCard.style.display = "none";
    elements.reviewCard.style.display = "block";
    buildReview();
  };
  elements.closeReviewBtn.onclick = () => {
    elements.reviewCard.style.display = "none";
    elements.scoreCard.style.display = "block";
  };
  if (elements.backBtn) elements.backBtn.onclick = () => showPage('coreClinicalOphthalmicExamination');
})();


// --- PWA & OFFLINE ---

/**
 * Initializes Progressive Web App features like the install prompt and service worker.
 */
function initializePWA() {
  window.addEventListener('beforeinstallprompt', (e) => {
    e.preventDefault();
    deferredPrompt = e;
    const installBtn = document.getElementById('installBtn');
    if (installBtn) installBtn.style.display = 'block';
  });

  const installBtn = document.getElementById('installBtn');
  if (installBtn) installBtn.addEventListener('click', handleInstallPrompt);

  // Register Service Worker
  if ('serviceWorker' in navigator && (location.protocol === 'https:' || location.hostname === 'localhost')) {
    window.addEventListener('load', () => {
      navigator.serviceWorker.register('service-worker.js')
        .then(reg => {
          console.log('Service Worker registered successfully.', reg);

          reg.addEventListener('updatefound', () => {
            const newWorker = reg.installing;
            newWorker.addEventListener('statechange', () => {
              if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
                // New service worker is installed and waiting to activate
                // Prompt user to refresh for new content
                if (confirm('New content is available! Click OK to refresh and get the latest version.')) {
                  window.location.reload();
                }
              }
            });
          });
        })
        .catch(err => console.error('Service worker registration failed: ', err));
    });

    // Ensure the page reloads when a new service worker takes control
    navigator.serviceWorker.addEventListener('controllerchange', () => {
      window.location.reload();
    });

  } else {
    console.log('Service worker not registered (not on https or localhost).');
  }
}

/**
 * Handles the PWA installation prompt.
 */
async function handleInstallPrompt() {
  if (!deferredPrompt) {
    alert("App is already installed or this browser doesn't support installation.");
    return;
  }
  deferredPrompt.prompt();
  const { outcome } = await deferredPrompt.userChoice;
  console.log(`User ${outcome} the install prompt.`);
  deferredPrompt = null;
  const installBtn = document.getElementById('installBtn');
  if (installBtn) installBtn.style.display = 'none';
  const installIconBtn = document.getElementById('installIconBtn');
  if (installIconBtn) installIconBtn.style.display = 'none';
}

/**
 * Shows the modal for selecting offline content.
 */
function showOfflineContentModal() {
  document.getElementById('offlineContentModal').style.display = 'flex';
}

/**
 * Closes the modal for selecting offline content.
 */
function closeOfflineContentModal() {
  document.getElementById('offlineContentModal').style.display = 'none';
}

document.querySelectorAll('.showOfflineContentModalBtn').forEach(btn => {
  btn.addEventListener('click', showOfflineContentModal);
});

const closeOfflineContentModalBtn = document.getElementById('closeOfflineContentModalBtn');
if (closeOfflineContentModalBtn) {
  closeOfflineContentModalBtn.addEventListener('click', closeOfflineContentModal);
}

const downloadSelectedAssetsBtn = document.getElementById('downloadSelectedAssetsBtn');
if (downloadSelectedAssetsBtn) {
  downloadSelectedAssetsBtn.addEventListener('click', downloadSelectedAssets);
}

/**
 * Downloads selected assets for offline use via the service worker.
 */
async function downloadSelectedAssets() {
  const selected = Array.from(document.querySelectorAll('#offlineContentModal input:checked')).map(cb => cb.value);
  const assetMap = {
    cataract: ['./cataractPage.html', './videos/Cataract.mp4'],
    visualAcuity: ['./visualAcuityPage.html', './videos/VisualAcuity.mp4'],
    // ... Add all other asset mappings here ...
  };

  const assetsToCache = selected.flatMap(key => assetMap[key] || []);
  if (assetsToCache.length === 0) {
    alert("No assets selected for download.");
    return;
  }

  try {
    const sw = await navigator.serviceWorker.ready;
    sw.active.postMessage({ type: 'CACHE_ASSETS', payload: assetsToCache });
    alert('Download started in the background.');
    closeOfflineContentModal();
  } catch (error) {
    console.error("Failed to send message to service worker:", error);
    alert("Could not start download. Service worker not ready.");
  }
}


// --- MISCELLANEOUS ---

/**
 * Initializes miscellaneous event listeners that don't fit into other categories.
 */
function initializeMisc() {
  // Atom image zoom
  const atomsImgContainer = document.getElementById('atomsImageContainer');
  if (atomsImgContainer) {
    atomsImgContainer.addEventListener('click', (e) => {
      if (e.target.tagName === 'IMG') {
        e.target.classList.toggle('zoomed');
      }
    });
  }

  // Ear health image zoom
  const earHealthImage = document.getElementById('earHealthImage');
  if (earHealthImage) {
    document.addEventListener('wheel', function(e) {
      if (!earHealthImage.closest('.page.active')) return;
      e.preventDefault();
      zoomLevel = e.deltaY < 0 ? zoomLevel + 0.1 : Math.max(0.5, zoomLevel - 0.1);
      earHealthImage.style.transform = `scale(${zoomLevel})`;
    }, { passive: false });
  }
}

function initializeProfessionalInterest() {
  // Let user toggle chips on/off
  document.querySelectorAll('#proInterestPage .chip').forEach(chip => {
    chip.addEventListener('click', () => {
      chip.classList.toggle('selected');
    });
  });

  // When they click "Join us!", go to intro page
  const submit = document.getElementById('interestSubmitBtn');
  if (submit) {
    submit.addEventListener('click', () => {
      showPage('introPage');
    });
  }
}

function initializeLanguageInstallPage() {
  const installBtn = document.getElementById('installAppBtn');
  const useOnlineBtn = document.getElementById('useOnlineBtn');
  const langSelect = document.getElementById('prefLang');

  // (Optional) remember language choice
  if (langSelect) {
    langSelect.addEventListener('change', () => {
      // localStorage.setItem('prefLang', langSelect.value);
    });
  }

  // Install path → trigger your PWA install prompt, then proceed
  if (installBtn) {
    installBtn.addEventListener('click', async () => {
      try {
        if (typeof handleInstallPrompt === 'function') {
          await handleInstallPrompt();
        }
      } catch (e) {
        console.warn('Install prompt failed or was dismissed:', e);
      } finally {
        // After install (or dismissal), move to onboarding
        showPage('onboarding');
      }
    });
  }

  // Use without installing → go straight to Onboarding
  if (useOnlineBtn) {
    useOnlineBtn.addEventListener('click', () => showPage('onboarding'));
  }
}

document.addEventListener('DOMContentLoaded', () => {
  initializeEyesCatalog();
});

function initializeEyesCatalog() {
  // --- exact lists you already set up ---
  const sections = {
    coreCarousel: [
      { label: 'History Taking', target: 'comingSoon', soon: true, tags:['Quiz','Interactive'] },
      { label: 'Visual Acuity', target: 'visualAcuityPage', tags:['Case Study'] },
      { label: 'Pupils', target: 'pupilsPage', tags:['Video'] },
      { label: 'Front of Eye', target: 'frontOfEyePage', tags:['Video','Quiz'] },
      { label: 'Fundal Reflex', target: 'fundalReflexPage', tags:['Video'] },
      { label: 'Ophthalmoscopy', target: 'directOphthalmoscopy', tags:['Video','Quiz'] },
      { label: 'Interactive Learning', target: 'interactiveLearningPage', tags:['Simulation'] },
    ],
    diseaseCarousel: [
      { label: 'Uncorrected Refractive Error', target: 'comingSoon', soon:true, tags:['Quiz'] },
      { label: 'Cataract', target: 'cataractPage', tags:['Case Study','Interactive'] },
      { label: 'Glaucoma', target: 'comingSoon', soon:true },
      { label: 'Diabetic Retinopathy', target: 'comingSoon', soon:true },
      { label: 'Corneal Disease', target: 'comingSoon', soon:true },
      { label: 'Childhood Eye Screening', target: 'childhoodEyeScreeningPage', tags:['Video'] },
      { label: 'Retinopathy of Prematurity', target: 'comingSoon', soon:true },
      { label: 'Retinal Disease', target: 'comingSoon', soon:true },
      { label: 'Optic Nerve Disease', target: 'comingSoon', soon:true },
    ],
    pecCarousel: [
      { label: 'WHO PEC', target: 'comingSoon', soon:true },
    ],
    extendedCarousel: [
      { label: 'Ptosis', target: 'comingSoon', soon:true },
      { label: 'Proptosis', target: 'comingSoon', soon:true },
      { label: 'Eye Movements/Squint', target: 'squintPalsyPage' },
      { label: 'Cranial Nerve Examination', target: 'comingSoon', soon:true },
    ],
    toolsCarousel: [
      { label: 'Arclight Overview', target: 'howToUseArclightVideoPage' },
      { label: 'Binocular Indirect Ophthalmoscope Overview', target: 'comingSoon', soon:true },
    ],
  };

  window.EYES_SECTIONS = sections;

  // --- Render helper (adds heart icon) ---
  const render = (containerId, items) => {
    const el = document.getElementById(containerId);
    if (!el) return;
    const likes = getLikes();

    el.innerHTML = items.map(i => `
      <button class="eyes-card ${likes.has(i.label) ? 'liked' : ''}"
              data-target="${i.target}" data-title="${i.soon ? i.label : ''}"
              data-label="${i.label}">
        <span class="heart-btn" aria-label="Like ${i.label}" role="button" tabindex="-1">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 1 0-7.78 7.78L12 21.23l8.84-8.84a5.5 5.5 0 0 0 0-7.78z"/>
          </svg>
        </span>
        <span>${i.label}</span>
        ${i.tags?.length ? `<div class="tag-row">${i.tags.map(t=>`<span class="tag">${t}</span>`).join('')}</div>` : ''}
      </button>
    `).join('');
  };

  Object.entries(sections).forEach(([id, list]) => render(id, list));

  // --- Click handling (heart vs navigate) ---
  const page = document.getElementById('eyesCatalogPage');
  page?.addEventListener('click', (e) => {
    const heart = e.target.closest('.heart-btn');
    if (heart) {
      e.stopPropagation(); e.preventDefault();
      const card = heart.closest('.eyes-card');
      const label = card?.getAttribute('data-label');
      if (!label) return;
      const likes = getLikes();
      if (likes.has(label)) { likes.delete(label); card.classList.remove('liked'); }
      else { likes.add(label); card.classList.add('liked'); }
      saveLikes(likes);
      return;
    }

    const btn = e.target.closest('.eyes-card');
    if (!btn) return;
    const target = btn.getAttribute('data-target') || 'comingSoon';
    if (target === 'comingSoon') {
      const title = btn.getAttribute('data-title') || 'Coming soon';
      const h = document.getElementById('comingSoonTitle');
      if (h) h.textContent = title;
    }
    showPage(target);
  });
}
