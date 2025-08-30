// js/menu.js
import { loadPage, goBack } from './navigation.js';

const wired = new WeakSet();

export function initializeMenu() {
  const overlay = document.getElementById('menuOverlay');
  if (!overlay || wired.has(overlay)) return;
  wired.add(overlay);

  // Show overlay
  overlay.classList.remove('hidden');

  // Close → go back
  document.getElementById('closeMenuBtn')?.addEventListener('click', (e) => {
    e.preventDefault();
    goBack();
  });

  // Username
  const el = document.getElementById('menuUsername');
  if (el) el.textContent = localStorage.getItem('username') || '';

  // Common routes
  document.getElementById('atomsCardEyesBtn')?.addEventListener('click', () => loadPage('atomscard'));
  document.getElementById('atomsCardEarsBtn')?.addEventListener('click', () => loadPage('atomscard'));
  document.getElementById('downloadedContentsBtn')?.addEventListener('click', () => loadPage('offline'));
}
