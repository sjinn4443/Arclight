// Custom video player and toolbar logic

// js/pwa.js (ES module)

/**
 * Public initializer — call once on DOMContentLoaded.
 * - Registers the service worker
 * - Wires install prompt + "Download contents" popup
 * - Sets up online/offline badge updates
 */
export function initializePWA() {
  registerServiceWorker();
  setupInstallPromptHandling();
  setupOfflinePopup();
  setupConnectivityBadge();
}

/* -------------------------------------------------------------------------- */
/*                           Service Worker Registration                      */
/* -------------------------------------------------------------------------- */

const SW_URL = 'sw.js';
const CACHE_NAME = 'arclight-static-v1'; // keep in sync with sw.js

async function registerServiceWorker() {
  // Only register when served over http(s)
  if (!('serviceWorker' in navigator) || !/^https?:$/.test(location.protocol)) return;
  try {
    await navigator.serviceWorker.register(SW_URL);
  } catch (err) {
    console.warn('SW registration failed:', err);
  }
}

/* -------------------------------------------------------------------------- */
/*                                Install Prompt                              */
/* -------------------------------------------------------------------------- */

let deferredPrompt = null;

// Expose a global that other modules already call:
window.handleInstallPrompt = async () => {
  if (!deferredPrompt) {
    // If we don't have the event yet, show a hint and bail gracefully
    alert('If you don’t see a browser install prompt, try “Add to Home Screen” from your browser menu.');
    return;
  }
  deferredPrompt.prompt();
  const { outcome } = await deferredPrompt.userChoice;
  // Chrome returns { outcome: "accepted" | "dismissed" }
  deferredPrompt = null;
  return outcome;
};

function setupInstallPromptHandling() {
  window.addEventListener('beforeinstallprompt', (e) => {
    // Stop Chrome from showing the mini-infobar
    e.preventDefault();
    deferredPrompt = e;
    // You could surface a subtle “Install” hint UI here if you want
  });

  window.addEventListener('appinstalled', () => {
    // Installed! You could hide install UI, toast success, etc.
    deferredPrompt = null;
  });
}

/* -------------------------------------------------------------------------- */
/*                         “Download contents”  (offline)                     */
/* -------------------------------------------------------------------------- */

function setupOfflinePopup() {
  const popup = document.getElementById('installPopup');
  const downloadBtn = document.getElementById('downloadAllBtn');
  const closeBtn = document.getElementById('closeInstallPopupBtn');

  if (closeBtn && popup) {
    closeBtn.addEventListener('click', () => (popup.style.display = 'none'));
  }

  if (!downloadBtn) return;

  downloadBtn.addEventListener('click', async () => {
    downloadBtn.disabled = true;
    const original = downloadBtn.textContent;
    downloadBtn.textContent = 'Downloading…';

    try {
      await preCacheContent(ASSETS_TO_CACHE);
      downloadBtn.textContent = 'Ready to use offline';
      // Hide the popup a beat later
      setTimeout(() => { if (popup) popup.style.display = 'none'; }, 600);
    } catch (err) {
      console.error('Pre-cache failed:', err);
      alert('Some items could not be cached. Check your connection and try again.');
      downloadBtn.textContent = original;
    } finally {
      downloadBtn.disabled = false;
    }
  });
}

/**
 * Add a list of URLs to our cache. Works whether the SW is active or not.
 * Falls back to "manual" caching via the Cache Storage API.
 */
async function preCacheContent(urls) {
  if (!urls || !urls.length) return;
  // Prefer asking the service worker (so it can apply its strategies)
  const sw = await getActiveServiceWorker();
  if (sw) {
    await new Promise((resolve, reject) => {
      const channel = new MessageChannel();
      channel.port1.onmessage = (event) => {
        if (event.data?.type === 'CACHE_DONE') resolve();
        else if (event.data?.type === 'CACHE_ERROR') reject(event.data?.error || 'CACHE_ERROR');
      };
      sw.postMessage({ type: 'CACHE_URLS', payload: urls, cacheName: CACHE_NAME }, [channel.port2]);
      // Fallback timeout in case messaging fails silently
      setTimeout(resolve, 6000);
    });
    return;
  }

  // Fallback: cache directly
  if (!('caches' in window)) return;
  const cache = await caches.open(CACHE_NAME);
  // Fetch each; ignore failures so one broken URL doesn't block the rest
  await Promise.all(
    urls.map(async (url) => {
      try {
        const res = await fetch(url, { mode: 'no-cors' }); // tolerate opaque for CDNs
        if (res && (res.ok || res.type === 'opaque')) await cache.put(url, res.clone());
      } catch {}
    })
  );
}

async function getActiveServiceWorker() {
  if (!('serviceWorker' in navigator)) return null;
  const reg = await navigator.serviceWorker.getRegistration();
  return reg?.active || null;
}

/* -------------------------------------------------------------------------- */
/*                          Connectivity badge (optional)                     */
/* -------------------------------------------------------------------------- */

function setupConnectivityBadge() {
  const badge = document.getElementById('offlineBadge');
  if (!badge) return;
  const paint = () => {
    const online = navigator.onLine;
    badge.classList.toggle('hidden', online);
    badge.textContent = online ? '' : 'Offline';
  };
  window.addEventListener('online', paint);
  window.addEventListener('offline', paint);
  paint();
}

/* -------------------------------------------------------------------------- */
/*                             Asset list to cache                            */
/* -------------------------------------------------------------------------- */

/**
 * Tweak this list for your project. It’s intentionally conservative; you can
 * add videos or large PDFs later. Duplicates are fine — Cache Storage ignores them.
 * Use relative paths (they’ll resolve from your site root).
 */
const ASSETS_TO_CACHE = [
  // Core shell
  '.', 'index.html', 'style.css',
  'js/main.js','js/navigation.js','js/onboarding.js',
  'js/dashboard.js','js/toc.js','js/video.js',
  'js/quiz.js','js/learning.js','js/catalog.js','js/pwa.js',

  // Fonts/images you rely on in the early flow
  '/images/logo.png', '/images/placeholder1.jpg', '/images/placeholder2.jpg',

  // Atoms Card images (add/remove as needed)
  '/images/Anatomy1.png', '/images/Anatomy2.png', '/images/Arclight.png',
  '/images/FrontOfEye.png', '/images/CaseStudy.png', '/images/FundalReflex.png',
  '/images/Fundus.png', '/images/Glaucoma.png', '/images/Refract.png',
  '/images/HowToUse.png', '/images/Lens.png', '/images/Pupil.png',
  '/images/RedEye.png', '/images/Summary.png', '/images/EarAnatomy.png',
  '/images/Drum.png', '/images/Ear.png', '/images/EarChild.png',

  // Video page demo asset(s)
  '/images/arclight_device.png'
];
