export function initializePWA() {
  // basic install prompt handlers
  let deferredPrompt = null;
  const installPopup = document.getElementById('installPopup');
  const confirmBtn = document.getElementById('installConfirmBtn');
  const dismissBtn = document.getElementById('installDismissBtn');

  window.addEventListener('beforeinstallprompt', (e) => {
    e.preventDefault();
    deferredPrompt = e;
    if (installPopup) installPopup.style.display = 'block';
  });

  if (confirmBtn) {
    confirmBtn.onclick = async () => {
      if (deferredPrompt) {
        deferredPrompt.prompt();
        await deferredPrompt.userChoice;
        installPopup.style.display = 'none';
        deferredPrompt = null;
      }
    };
  }
  if (dismissBtn) {
    dismissBtn.onclick = () => {
      if (installPopup) installPopup.style.display = 'none';
    };
  }
}


// ==== AUTO-MIGRATED FROM legacy script.js (2025-07-15) ====
// The following functions were ported automatically. Review selectors and
// ensure they are invoked from main.js on `page:loaded` where relevant.
// Functions: initializePWA, handleInstallPrompt

function initializePWAImpl() {
  window.addEventListener('beforeinstallprompt', (e) => {
    e.preventDefault();
    deferredPrompt = e;
    const installBtn = document.getElementById('installBtn');
    if (installBtn) installBtn.style.display = 'block';
  });

  const installBtn = document.getElementById('installBtn');
  if (installBtn) installBtn.addEventListener('click', handleInstallPrompt);

  // Register Service Worker
  if ('serviceWorker' in navigator && (location.protocol === 'https:' || location.hostname === 'localhost')) {
    window.addEventListener('load', () => {
      navigator.serviceWorker.register('service-worker.js')
        .then(reg => {
          console.log('Service Worker registered successfully.', reg);

          reg.addEventListener('updatefound', () => {
            const newWorker = reg.installing;
            newWorker.addEventListener('statechange', () => {
              if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
                // New service worker is installed and waiting to activate
                // Prompt user to refresh for new content
                if (confirm('New content is available! Click OK to refresh and get the latest version.')) {
                  window.location.reload();
                }
              }
            });
          });
        })
        .catch(err => console.error('Service worker registration failed: ', err));
    });

    // Ensure the page reloads when a new service worker takes control
    navigator.serviceWorker.addEventListener('controllerchange', () => {
      window.location.reload();
    });

  } else {
    console.log('Service worker not registered (not on https or localhost).');
  }
}

async function handleInstallPrompt() {
  if (!deferredPrompt) {
    alert("App is already installed or this browser doesn't support installation.");
    return;
  }
  deferredPrompt.prompt();
  const { outcome } = await deferredPrompt.userChoice;
  console.log(`User ${outcome} the install prompt.`);
  deferredPrompt = null;
  const installBtn = document.getElementById('installBtn');
  if (installBtn) installBtn.style.display = 'none';
  const installIconBtn = document.getElementById('installIconBtn');
  if (installIconBtn) installIconBtn.style.display = 'none';
}
