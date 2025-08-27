// Page switching and history management

// js/navigation.js (ES module)
// Page history + search container live here for nav-only concerns
let pageHistory = [];
let searchContainer = null;

// If other legacy code defines updateDashboardSwitch, use it; otherwise noop
function forwardDashboardSwitch(pageId) {
   if (typeof window.updateDashboardSwitch === 'function') {
     window.forwardDashboardSwitch(pageId);
   }
 }

/**
 * Page switcher. Keeps history, pauses videos, toggles title + bottom bar.
 */
export function showPage(pageId, skipHistory = false) {
  const currentActive = document.querySelector('.page.active');
  if (currentActive && currentActive.id !== pageId && !skipHistory) {
    pageHistory.push(currentActive.id);
  }

  // Pause all videos when switching pages (matches existing behavior)
  document.querySelectorAll('video').forEach(v => { if (!v.paused) v.pause(); });

  // Hide all pages, show target
  document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
  const pageToShow = document.getElementById(pageId);
  if (pageToShow) pageToShow.classList.add('active');

  updateTitleBar(pageId);
  forwardDashboardSwitch(pageId);
  updateBottomNavBar(pageId);
}

// Intro page: both buttons go to unified dashboard
export function initializeIntroPage() {
  const seeWhatBtn = document.getElementById('seeWhatBtn');
  const skipBtn = document.getElementById('skipBtn');
  if (seeWhatBtn) seeWhatBtn.addEventListener('click', () => showPage('unifiedDashboard'));
  if (skipBtn)   skipBtn.addEventListener('click', () => showPage('unifiedDashboard'));
}

/** Global Back/Home buttons */
export function initializePageNavigation() {
  const backBtnGlobal = document.getElementById('backBtnGlobal');
  if (backBtnGlobal) {
    backBtnGlobal.addEventListener('click', () => {
      if (pageHistory.length > 0) {
        const prevPage = pageHistory.pop();
        showPage(prevPage, true); // do not re-push
      } else {
        showPage('dashboard');    // fallback
      }
    });
  }

  const homeBtn = document.getElementById('homeBtn');
  if (homeBtn) homeBtn.addEventListener('click', () => showPage('dashboard'));
}

/** Title bar show/hide */
function updateTitleBar(pageId) {
  const hideTitleBarPages = ['splashScreen', 'registerPage'];
  const titleBar = document.getElementById('titleBar');
  const spacer = document.getElementById('titleBarSpacer');
  if (!titleBar || !spacer) return;

  const shouldHide = hideTitleBarPages.includes(pageId);
  titleBar.style.display = shouldHide ? 'none' : 'flex';
  spacer.style.display   = shouldHide ? 'none' : 'block';
}

/** Bottom nav (Back/Home) & fixed search visibility */
function updateBottomNavBar(pageId) {
  const homeBtnContainer = document.getElementById('homeButtonContainer');
  searchContainer = document.getElementById('fixedSearchContainer');

  const showHomePages = [
    'dashboard','earsDashboard','learningModules','coreClinicalOphthalmicExamination','diseasesPage',
    'arclightPage','childhoodEyeScreeningPage','howToUseArclightVideoPage','directOphthalmoscopy',
    'atomsCardPage','anteriorSegmentQuizPage','frontOfEyePage','anteriorSegmentVideoPage','pupilsPage',
    'rapdTestPage','pupilExamPECPage','pupilPathwaysPage','howToArclightPage','assessmentVisionPage',
    'normalAbnormalPage','earsLearningModules','otoscopyPage','earHealthPage','howToExamineEarPage',
    'earConditionsPage','earFlowchartPage','pupilFullExamPage','rapdPage','rapdTestVideoPage',
    'phoneAttachmentVideoPage','visualAcuityPage','fundalReflexPage','interactiveLearningPage',
    'miresPage','morphPage','squintPalsyPage','cataractPage','eyesCatalogPage','likedPage'
  ];

  const shouldShowNav = showHomePages.includes(pageId);
  if (homeBtnContainer) homeBtnContainer.style.display = shouldShowNav ? 'flex' : 'none';
  if (searchContainer)  searchContainer.style.display  = ['dashboard','earsDashboard'].includes(pageId) ? 'block' : 'none';
}

// Keep a global for legacy inline uses (e.g., other pages calling showPage)
window.showPage = showPage;
