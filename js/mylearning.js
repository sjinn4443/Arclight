// js/mylearning.js — Legacy-style "Liked" (My Learning) page
// Restores the previous behavior that renders into #likedMasonry inside #likedPage
// and uses localStorage('eyesLikes'). Compatible with the refactored modules.

import { showPage } from './navigation.js';
import * as Catalog from './catalog.js';

// Prefer Catalog.getAllEyesItems from the refactor; fall back to legacy global
const getAllEyesItems = Catalog.getAllEyesItems
  || (() => (window.EYES_SECTIONS ? Object.values(window.EYES_SECTIONS).flat() : []));

const EYES_LIKES_KEY = 'eyesLikes';

/* ------------------------------- storage -------------------------------- */

function getEyesLikes() {
  try { return new Set(JSON.parse(localStorage.getItem(EYES_LIKES_KEY) || '[]')); }
  catch { return new Set(); }
}
function saveEyesLikes(set) {
  localStorage.setItem(EYES_LIKES_KEY, JSON.stringify([...set]));
}

/* --------------------------------- UI ----------------------------------- */

function filterByDomain(items, domain) {
  // Tabs say Eyes / Ears / Skin / Teach — only Eyes is active for now
  if (!domain || domain === 'eyes') return items;
  return [];
}

/**
 * Render "Liked" items into #likedMasonry.
 * Expects #likedPage to contain #mlSearch (optional) and #likedMasonry.
 */
export function renderEyesLikes() {
  const mount = document.getElementById('likedMasonry');
  if (!mount) return;

  const q = (document.getElementById('mlSearch')?.value || '').trim().toLowerCase();
  const activeChip = document.querySelector('.ml-chip.active');
  const domain = activeChip?.dataset.filter || 'eyes';

  const likes = getEyesLikes();
  const allEyes = getAllEyesItems(); // unified catalog from refactor

  const likedList = allEyes.filter(i => likes.has(i.label));

  const filtered = filterByDomain(likedList, domain).filter(i => {
    if (!q) return true;
    const hay = (i.label + ' ' + (i.tags || []).join(' ')).toLowerCase();
    return hay.includes(q);
  });

  // Build text-only tiles like the legacy version (no thumbnails)
  mount.innerHTML = filtered.map(i => `
    <div class="module-card eyes-card liked"
         data-id="${i.label.toLowerCase().replace(/[^a-z0-9]+/g,'-')}"
         data-title="${i.label}" data-target="${i.target || 'comingSoon'}">
      <span class="heart-btn" aria-label="Unlike ${i.label}" role="button" tabindex="-1">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 1 0-7.78 7.78L12 21.23l8.84-8.84a5.5 5.5 0 0 0 0-7.78z"/>
        </svg>
      </span>
      <div class="module-title">${i.label}</div>
      ${i.tags?.length ? `
        <div class="tag-row">
          ${i.tags.map(t => `<span class="tag">${t}</span>`).join('')}
        </div>` : ''
      }
    </div>
  `).join('');

  if (!filtered.length) {
    mount.innerHTML = `<div class="empty-note">Nothing liked yet. Tap the heart on any Eyes card to add it here.</div>`;
  }
}

/* ------------------------------ initializer ----------------------------- */

export function initializeMyLearning() {
  const page = document.getElementById('likedPage');
  if (!page) return; // page not present

  // Initial render
  renderEyesLikes();

  // Search box
  const search = document.getElementById('mlSearch');
  if (search) search.addEventListener('input', () => renderEyesLikes());

  // Domain chips (Eyes / Ears / Skin / Teach) — only Eyes has data currently
  page.querySelectorAll('.ml-chip').forEach(chip => {
    chip.addEventListener('click', () => {
      page.querySelectorAll('.ml-chip').forEach(c => c.classList.remove('active'));
      chip.classList.add('active');
      renderEyesLikes();
    });
  });

  // Delegated clicks on the page: heart (unlike) + open target
  page.addEventListener('click', (e) => {
    const heart = e.target.closest('.heart-btn');
    if (heart) {
      e.preventDefault();
      const card = heart.closest('.module-card');
      const label = card?.dataset?.title;
      if (!label) return;
      const likes = getEyesLikes();
      likes.delete(label);
      saveEyesLikes(likes);
      renderEyesLikes(); // refresh list
      return;
    }

    const card = e.target.closest('.module-card');
    if (card && !e.target.closest('button,a,input,label,.heart-btn')) {
      const target = card.dataset.target || 'comingSoon';
      if (target === 'comingSoon') {
        const h = document.getElementById('comingSoonTitle');
        if (h) h.textContent = card.dataset.title || 'Coming soon';
      }
      showPage(target);
    }
  });

  // Re-render when the tab becomes visible (in case likes changed elsewhere)
  document.addEventListener('visibilitychange', () => {
    if (!document.hidden) renderEyesLikes();
  });
}

/* ------------------------------ legacy compat --------------------------- */

// Legacy-style helper used by the menu item and older code paths
window.showLikedPage = () => {
  showPage('likedPage');
  try { renderEyesLikes(); } catch {}
};
