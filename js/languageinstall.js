import { loadPage } from './navigation.js';
export function initializeLanguageInstall() { initializeLanguageInstallPage(); }


// ==== AUTO-MIGRATED FROM legacy script.js (2025-07-15) ====
// The following functions were ported automatically. Review selectors and
// ensure they are invoked from main.js on `page:loaded` where relevant.
// Functions: initializeLanguageInstallPage

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
        loadPage('onboarding');
      }
    });
  }

  // Use without installing → go straight to Onboarding
  if (useOnlineBtn) {
    useOnlineBtn.addEventListener('click', () => loadPage('onboarding'));
  }
}