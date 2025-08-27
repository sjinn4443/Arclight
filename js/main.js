// Core app initialization and global state

// js/main.js
import { showPage, initializePageNavigation, initializeIntroPage } from './navigation.js';
import { initializeOnboarding } from './onboarding.js';
import { initializeDashboard } from './dashboard.js';
import { initializeTOC } from './toc.js';
import { initializeVideo } from './video.js';
import { initializeQuizzes } from './quiz.js';
import { initializeLearning } from './learning.js';
import { initializeCatalog } from './catalog.js';
import { initializePWA } from './pwa.js';

document.addEventListener('DOMContentLoaded', () => {
  initializePWA();              // ← register SW + install + offline
  initializePageNavigation();
  initializeOnboarding();
  initializeIntroPage();
  initializeDashboard();
  initializeTOC();
  initializeVideo();
  initializeQuizzes();
  initializeLearning();
  initializeCatalog();
  showPage('splashScreen');
});
