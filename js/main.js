// js/main.js
import { loadPage, initializePageNavigation } from './navigation.js';
import { initializePWA } from './pwa.js';

document.addEventListener('DOMContentLoaded', () => {
  initializePageNavigation();
  initializePWA();
  loadPage('languageinstall');
});

let splashDismissed = false;
window.addEventListener('page:loaded', async (e) => {
  const page = e.detail?.routeName;

  if (page === 'languageinstall') {
    const { initializeLanguageInstall } = await import('./languageinstall.js');
    initializeLanguageInstall?.();
  }

  if (!splashDismissed) {
    splashDismissed = true;
    const splash = document.getElementById('splashScreen');
    if (splash) setTimeout(() => (splash.style.display = 'none'), 1400); // your doubled delay
  }

  if (page === 'languageinstall') {
    const { initializeLanguageInstall } = await import('./languageinstall.js');
    initializeLanguageInstall?.();
  }

  if (page === 'onboarding') {
    const { initializeOnboarding } = await import('./onboarding.js');
    initializeOnboarding?.();
  }

  if (page === 'interest') {
    const { initializeInterest } = await import('./interest.js');
    initializeInterest?.();
  }

  if (page === 'intro') {
  const { initializeIntro } = await import('./intro.js');
  initializeIntro?.();
}

  if (page === 'dashboard') {
  const { initializeDashboard } = await import('./dashboard.js');
  initializeDashboard?.();
}

if (page === 'eyes') {
    const { initializeEyes } = await import('./eyes.js');
    initializeEyes?.();
  }

  if (page === 'menu') {
    const { initializeMenu } = await import('./menu.js');
    initializeMenu?.();
  }

  if (page === 'offline') {
    const { initializeOffline } = await import('./offline.js');
    initializeOffline?.();
  }


});

