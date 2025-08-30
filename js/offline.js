// js/offline.js
export function initializeOffline() {
  wireOfflineModal();
  showOfflineContentModal();
}

export function showOfflineContentModal() {
  const el = document.getElementById('offlineContentModal');
  if (el) el.style.display = 'flex';
}
export function closeOfflineContentModal() {
  const el = document.getElementById('offlineContentModal');
  if (el) el.style.display = 'none';
}
export async function downloadSelectedAssets() {
  const selected = Array.from(document.querySelectorAll('#offlineContentModal input:checked')).map(cb => cb.value);
  const assetMap = {
    cataract: ['./cataractPage.html', './videos/Cataract.mp4'],
    visualAcuity: ['./visualAcuityPage.html', './videos/VisualAcuity.mp4'],
    directOphthalmoscopy: ['./directOphthalmoscopy.html', './videos/DirectOphthalmoscopy.mp4'],
    frontOfEye: ['./frontOfEye.html'],
    interactiveLearning: ['./interactiveLearning.html'],
    atomsCard: ['./atomscard.html'],
    pupils: ['./pupilsPage.html'],
    fundalReflex: ['./fundalReflexPage.html'],
  };
  const assetsToCache = selected.flatMap(k => assetMap[k] || []);
  if (!assetsToCache.length) {
    alert('No assets selected for download.');
    return;
  }
  try {
    const sw = await navigator.serviceWorker.ready;
    sw.active?.postMessage({ type: 'CACHE_ASSETS', payload: assetsToCache });
    alert('Download started in the background.');
    closeOfflineContentModal();
  } catch (err) {
    console.error(err);
    alert('Could not start download. Service worker not ready.');
  }
}

function wireOfflineModal() {
  document.getElementById('closeOfflineContentModalBtn')?.addEventListener('click', closeOfflineContentModal);
  document.getElementById('downloadSelectedAssetsBtn')?.addEventListener('click', downloadSelectedAssets);
  document.querySelectorAll('.showOfflineContentModalBtn').forEach(btn => {
    btn.addEventListener('click', showOfflineContentModal);
  });
}
