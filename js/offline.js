export function initializeOffline() {}


// ==== AUTO-MIGRATED FROM legacy script.js (2025-07-15) ====
// The following functions were ported automatically. Review selectors and
// ensure they are invoked from main.js on `page:loaded` where relevant.
// Functions: showOfflineContentModal, closeOfflineContentModal, downloadSelectedAssets

function showOfflineContentModal() {
  document.getElementById('offlineContentModal').style.display = 'flex';
}

function closeOfflineContentModal() {
  document.getElementById('offlineContentModal').style.display = 'none';
}

async function downloadSelectedAssets() {
  const selected = Array.from(document.querySelectorAll('#offlineContentModal input:checked')).map(cb => cb.value);
  const assetMap = {
    cataract: ['./cataractPage.html', './videos/Cataract.mp4'],
    visualAcuity: ['./visualAcuityPage.html', './videos/VisualAcuity.mp4'],
    // ... Add all other asset mappings here ...
  };

  const assetsToCache = selected.flatMap(key => assetMap[key] || []);
  if (assetsToCache.length === 0) {
    alert("No assets selected for download.");
    return;
  }

  try {
    const sw = await navigator.serviceWorker.ready;
    sw.active.postMessage({ type: 'CACHE_ASSETS', payload: assetsToCache });
    alert('Download started in the background.');
    closeOfflineContentModal();
  } catch (error) {
    console.error("Failed to send message to service worker:", error);
    alert("Could not start download. Service worker not ready.");
  }
}