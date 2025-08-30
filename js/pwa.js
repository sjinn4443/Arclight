// js/pwa.js
let deferredPrompt = null;

export function initializePWA() {
  // 1) Capture beforeinstallprompt so we can trigger later
  window.addEventListener('beforeinstallprompt', (e) => {
    e.preventDefault();
    deferredPrompt = e;
    // (optional) show any in-app “Install” UI if you have it
    // document.getElementById('installPopup')?.style && (document.getElementById('installPopup').style.display = 'block');
    console.log('[pwa] beforeinstallprompt captured');
  });

  // 2) Register Service Worker (required for install prompt on Chrome)
  if ('serviceWorker' in navigator && (location.protocol === 'https:' || location.hostname === 'localhost')) {
    navigator.serviceWorker.register('sw.js')
      .then((reg) => console.log('[pwa] SW registered', reg.scope))
      .catch((err) => console.warn('[pwa] SW register failed', err));
  }
}

// Query if prompt is available
export function canInstall() {
  return !!deferredPrompt;
}

// Trigger the native install prompt; resolves when user accepts/dismisses
export async function promptInstall() {
  if (!deferredPrompt) {
    // On some platforms, prompt may not be available (already installed, not eligible, etc.)
    throw new Error('Install prompt not available');
  }
  deferredPrompt.prompt();
  try {
    const { outcome } = await deferredPrompt.userChoice; // 'accepted' | 'dismissed'
    console.log('[pwa] userChoice:', outcome);
    return outcome;
  } finally {
    deferredPrompt = null; // can only be used once
  }
}
