import { ROUTES } from './config.js';

export let currentPageName = null;
const historyStack = [];

export async function loadPage(routeName, options = {}) {
  const container = document.getElementById('page-content');
  const url = ROUTES[routeName];
  if (!url) {
    container.innerHTML = `<div class="container"><p>Page not found: ${routeName}</p></div>`;
    return;
  }
  const html = await fetch(url).then(r => r.text());
  container.innerHTML = html;
  currentPageName = routeName;

  if (options.push !== false) {
    historyStack.push(routeName);
  }

  // global back/home
  const backBtnGlobal = document.getElementById('backBtnGlobal');
  if (backBtnGlobal) {
    backBtnGlobal.onclick = () => navigateBack();
  }
  const homeBtn = document.getElementById('homeBtn');
  if (homeBtn) {
    homeBtn.onclick = () => loadPage('dashboard');
  }

  // run per-page initializer if provided
  if (typeof options.afterLoad === 'function') options.afterLoad();

  // expose a simple event to let page scripts bootstrap
  window.dispatchEvent(new CustomEvent('page:loaded', { detail: { routeName } }));
}

export function navigateBack() {
  // pop current
  historyStack.pop();
  const prev = historyStack.pop();
  if (prev) {
    loadPage(prev);
  } else {
    loadPage('dashboard');
  }
}

export function initializePageNavigation() {
  // simple sample: dashboard cards with data-route
  window.addEventListener('click', (e) => {
    const el = e.target.closest('[data-route]');
    if (el) {
      const route = el.getAttribute('data-route');
      loadPage(route);
    }
  });
}


// ==== AUTO-MIGRATED FROM legacy script.js (2025-07-15) ====
// The following functions were ported automatically. Review selectors and
// ensure they are invoked from main.js on `page:loaded` where relevant.
// Functions: showPage, initializePageNavigation, updateTitleBar, updateBottomNavBar

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

function initializePageNavigationImpl() {
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