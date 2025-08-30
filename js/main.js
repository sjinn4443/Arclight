// js/main.js
import { loadPage, initializePageNavigation } from './navigation.js';
import { initializeMenu, closeMenu } from './menu.js';
import { initializePWA } from './pwa.js';

// === App bootstrap ===
document.addEventListener('DOMContentLoaded', () => {
  // Init global systems once
  initializeMenu();
  initializePageNavigation();
  initializePWA();

  // Baseline parity: Splash → LanguageInstall after ~1.8s
  const splash = document.getElementById('splashScreen');
  if (splash) {
    // ensure splash is visible (in case CSS hid it)
    splash.style.display = '';
    setTimeout(() => {
      splash.style.display = 'none';
      loadPage('languageinstall');
    }, 1800); // baseline anchor: 1800 ms
  } else {
    // fallback if no splash present
    loadPage('languageinstall');
  }
});

// === Per-route initializers ===
window.addEventListener('page:loaded', async (e) => {
  // Always close the overlay menu on navigation (baseline behavior)
  try { closeMenu(); } catch {}

  const page = e.detail?.routeName;

  if (page === 'languageinstall') {
    const { initializeLanguageInstall } = await import('./languageinstall.js');
    initializeLanguageInstall?.();
    return;
  }

  if (page === 'onboarding') {
    const { initializeOnboarding } = await import('./onboarding.js');
    initializeOnboarding?.();
    return;
  }

  if (page === 'interest') {
    const { initializeInterest } = await import('./interest.js');
    initializeInterest?.();
    return;
  }

  if (page === 'intro') {
    const { initializeIntro } = await import('./intro.js');
    initializeIntro?.();
    return;
  }

  if (page === 'dashboard') {
    const { initializeDashboard } = await import('./dashboard.js');
    initializeDashboard?.();
    return;
  }

  if (page === 'eyes') {
    const { initializeEyes } = await import('./eyes.js');
    initializeEyes?.();
    return;
  }

  if (page === 'offline') {
    const { initializeOffline } = await import('./offline.js');
    initializeOffline?.();
    return;
  }

  // If you had a 'menu' route before, it's no longer used—menu is a global overlay now.
});
