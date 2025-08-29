import { loadPage, initializePageNavigation } from './navigation.js';
import { initializeOnboarding } from './onboarding.js';
import { initializeDashboard } from './dashboard.js';
import { initializeLearningModules } from './learningModules.js';
import { initializeTOC } from './toc.js';
import { initializePWA } from './pwa.js';
import { initializeQuizzes } from './quizzes.js';
import { initializeVideoPlayers, initializeToolbar } from './video.js';
import { initializeMisc } from './misc.js';
import { initializeEars } from './ears.js';
import { initializeVideos } from './videos.js';
import { initializeEyes } from './eyes.js';

initializePageNavigation();
initializePWA();

// bootstrap: go to onboarding or dashboard (simplified)
loadPage('dashboard');

// hook initializers on page load
window.addEventListener('page:loaded', (e) => {
  const page = e.detail.routeName;
  if (page === 'onboarding') initializeOnboarding();
  if (page === 'dashboard') initializeDashboard();
  if (page === 'videos') initializeVideos();
  if (page === 'ears') initializeEars();
  if (page === 'eyes') initializeEyes();
  initializeLearningModules();
  initializeTOC();
  initializeQuizzes();
  initializeVideoPlayers();
  initializeToolbar();
  initializeMisc();
});
