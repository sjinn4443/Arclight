/**
 * @fileoverview This file contains pwa related functions and logic. Including service worker registration and handling the 'beforeinstallprompt' event for app installation.
 */

let deferredPrompt = null;

export function initializePWA() {
  // 1) Capture beforeinstallprompt so we can trigger later
  window.addEventListener("beforeinstallprompt", (e) => {
    e.preventDefault();
    deferredPrompt = e;
    // document.getElementById('installPopup')?.style && (document.getElementById('installPopup').style.display = 'block');
    console.warn("[pwa] beforeinstallprompt captured");
  });

  // 2) Register Service Worker (required for install prompt on Chrome)
  if (
    "serviceWorker" in navigator &&
    (location.protocol === "https:" || location.hostname === "localhost")
  ) {
    navigator.serviceWorker
      .register("sw.js")
      .then((reg) => console.warn("[pwa] SW registered", reg.scope))
      .catch((err) => console.warn("[pwa] SW register failed", err));
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
    throw new Error("Install prompt not available");
  }
  deferredPrompt.prompt();
  try {
    const { outcome } = await deferredPrompt.userChoice; // 'accepted' | 'dismissed'
    console.warn("[pwa] userChoice:", outcome);
    return outcome;
  } finally {
    deferredPrompt = null; // can only be used once
  }
}
