// js/languageinstall.js
import { loadPage } from './navigation.js';
import { promptInstall, canInstall } from './pwa.js';

export function initializeLanguageInstall() {
  const installBtn   = document.getElementById('installAppBtn');
  const useOnlineBtn = document.getElementById('useOnlineBtn');
  const langSelect   = document.getElementById('prefLang');

  // (Optional) remember language
  if (langSelect) {
    const saved = localStorage.getItem('prefLang');
    if (saved) langSelect.value = saved;
    langSelect.addEventListener('change', () => {
      localStorage.setItem('prefLang', langSelect.value);
    });
  }

  // Install → show native PWA prompt; then warm the cache; then continue
  if (installBtn) {
    installBtn.addEventListener('click', async () => {
      try {
        if (!canInstall()) {
          // Fallback UX when prompt isn't available yet
          alert('To install, use your browser menu: “Install app” / “Add to Home screen”.');
        } else {
          await promptInstall(); // native “Install app?” dialog
        }
        // After prompt (accepted or dismissed), kick off asset caching
        try {
          const sw = await navigator.serviceWorker.ready;
          const pagesToCache = [
            'index.html','style.css',
            'html/languageinstall.html','html/onboarding.html','html/dashboard.html',
            'html/eyes.html','html/ears.html','html/menu.html','html/quizzes.html','html/videos.html'
          ];
          sw.active?.postMessage({ type: 'CACHE_ASSETS', payload: pagesToCache });
          console.log('[install] sent CACHE_ASSETS to SW:', pagesToCache.length);
        } catch (err) {
          console.warn('[install] could not warm cache:', err);
        }
      } catch (e) {
        console.warn('Install prompt failed or not available:', e);
      } finally {
        // Proceed in flow regardless of outcome (matches your pre-split behavior)
        loadPage('onboarding');
      }
    });
  }

  // Use without installing → straight to onboarding
  if (useOnlineBtn) {
    useOnlineBtn.addEventListener('click', () => loadPage('onboarding'));
  }
}
