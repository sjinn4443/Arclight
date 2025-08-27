// Handles learning modules and the "My Learning" page

// js/learning.js (ES module)
import { showPage } from './navigation.js';

/**
 * Call once on DOMContentLoaded from main.js.
 * Wires:
 * - Eyes/Ears Learning grids: open module, save/unsave to My Learning
 * - My Learning page: renders saved items, remove/continue actions
 * - Optional global search: filters visible learning cards by title
 */
export function initializeLearning() {
  wireLearningGrid('learningModules');
  wireLearningGrid('earsLearningModules');
  wireMyLearningPage();
  wireGlobalSearch();
}

/* -------------------------------------------------------------------------- */
/*                              Learning Modules                              */
/* -------------------------------------------------------------------------- */

function wireLearningGrid(pageId) {
  const page = document.getElementById(pageId);
  if (!page) return;

  // Open a module when a card is clicked
  page.addEventListener('click', (e) => {
    const card = e.target.closest('.module-card');
    if (!card || !page.contains(card)) return;

    // Save button?
    const saveBtn = e.target.closest('.save-btn');
    if (saveBtn) {
      toggleSave(card);
      e.stopPropagation();
      return;
    }

    // If user clicked a "start/open" button, prefer its action
    const openBtn = e.target.closest('.start-btn, .open-btn');
    if (openBtn) {
      routeCard(card);
      return;
    }

    // Otherwise clicking the card opens it
    if (!e.target.closest('button,a,input,label')) {
      routeCard(card);
    }
  });

  // Paint initial "saved" state for any cards visible on load
  page.querySelectorAll('.module-card').forEach(updateCardSaveVisual);
}

function routeCard(cardEl) {
  const { target } = readCardData(cardEl);
  showPage(target || 'learningModules');
}

/* -------------------------------------------------------------------------- */
/*                                 My Learning                                */
/* -------------------------------------------------------------------------- */

function wireMyLearningPage() {
  const page = document.getElementById('likedPage');
  if (!page) return;

  renderMyLearning();

  // Delegated actions: continue/open, remove
  page.addEventListener('click', (e) => {
    const removeBtn = e.target.closest('.remove-btn');
    const contBtn   = e.target.closest('.continue-btn,.open-btn,.start-btn');

    // Remove from saved list
    if (removeBtn) {
      const card = e.target.closest('.module-card');
      const { id } = readCardData(card);
      unsaveItem(id);
      renderMyLearning();
      // Also update any learning grids that may be showing the same card
      document.querySelectorAll(`.module-card[data-id="${cssEscape(id)}"]`).forEach(updateCardSaveVisual);
      return;
    }

    // Continue/open module
    if (contBtn) {
      const card = e.target.closest('.module-card');
      routeCard(card);
    }
  });
}

function renderMyLearning() {
  const page = document.getElementById('likedPage');
  if (!page) return;

  const list = page.querySelector('#myLearningList') || page.querySelector('.my-learning-list') || page;
  const saved = getSavedItems();

  if (!saved.length) {
    list.innerHTML = `<div class="empty-state">
      <p>No saved modules yet.</p>
      <button class="start-btn go-discover">Discover modules</button>
    </div>`;
    list.querySelector('.go-discover')?.addEventListener('click', () => showPage('learningModules'));
    return;
  }

  list.innerHTML = '';
  saved.forEach(item => {
    const card = document.createElement('div');
    card.className = 'module-card';
    card.dataset.id = item.id;
    card.dataset.target = item.target || '';
    card.dataset.title = item.title || '';
    card.dataset.thumb = item.thumb || '';

    card.innerHTML = `
      <div class="thumb-wrap">
        ${item.thumb ? `<img class="thumb" src="${item.thumb}" alt="">` : ''}
      </div>
      <div class="module-title">${escapeHTML(item.title || 'Untitled')}</div>
      <div class="actions">
        <button class="continue-btn start-btn">Continue</button>
        <button class="remove-btn pill">Remove</button>
      </div>
    `;
    list.appendChild(card);
  });
}

/* -------------------------------------------------------------------------- */
/*                                Save / Unsave                               */
/* -------------------------------------------------------------------------- */

function toggleSave(cardEl) {
  const data = readCardData(cardEl);
  const exists = isSaved(data.id);
  if (exists) unsaveItem(data.id);
  else saveItem(data);
  updateCardSaveVisual(cardEl);
}

function updateCardSaveVisual(cardEl) {
  const data = readCardData(cardEl);
  const saved = isSaved(data.id);
  // Toggle a CSS class and button label if a .save-btn exists
  cardEl.classList.toggle('saved', saved);
  const btn = cardEl.querySelector('.save-btn');
  if (btn) btn.textContent = saved ? 'Saved' : 'Save';
}

/* -------------------------------------------------------------------------- */
/*                               Global Search                                */
/* -------------------------------------------------------------------------- */

function wireGlobalSearch() {
  const input = document.getElementById('fixedSearchInput');
  if (!input) return;

  const filter = () => {
    const q = (input.value || '').trim().toLowerCase();
    ['learningModules','earsLearningModules'].forEach(pid => {
      const page = document.getElementById(pid);
      if (!page) return;
      page.querySelectorAll('.module-card').forEach(card => {
        const title = (card.dataset.title || card.querySelector('.module-title')?.textContent || '').toLowerCase();
        const match = !q || title.includes(q);
        card.style.display = match ? '' : 'none';
      });
    });
  };

  input.addEventListener('input', filter, { passive: true });
  // Run once at start to ensure consistency if input is prefilled
  filter();
}

/* -------------------------------------------------------------------------- */
/*                                   Storage                                  */
/* -------------------------------------------------------------------------- */

const STORAGE_KEY = 'myLearningItems';

function getSavedItems() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function isSaved(id) {
  if (!id) return false;
  return getSavedItems().some(x => x.id === id);
}

function saveItem(item) {
  if (!item?.id) return;
  const next = getSavedItems();
  if (!next.some(x => x.id === item.id)) {
    next.push({
      id: item.id,
      title: item.title || 'Untitled',
      target: item.target || '',
      thumb: item.thumb || '',
    });
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(next)); } catch {}
  }
}

function unsaveItem(id) {
  if (!id) return;
  const next = getSavedItems().filter(x => x.id !== id);
  try { localStorage.setItem(STORAGE_KEY, JSON.stringify(next)); } catch {}
}

/* -------------------------------------------------------------------------- */
/*                                   Helpers                                  */
/* -------------------------------------------------------------------------- */

function readCardData(cardEl) {
  const id = cardEl?.dataset?.id || inferId(cardEl);
  const title = cardEl?.dataset?.title || cardEl?.querySelector('.module-title')?.textContent?.trim() || '';
  const target = cardEl?.dataset?.target || cardEl?.getAttribute('data-target') || '';
  const thumb = cardEl?.dataset?.thumb || cardEl?.querySelector('img')?.getAttribute('src') || '';
  return { id, title, target, thumb };
}

function inferId(cardEl) {
  // Try to turn the title into a slug as a stable ID
  const t = cardEl?.querySelector('.module-title')?.textContent || 'module';
  return slugify(t);
}

function slugify(s) {
  return (s || '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '')
    .slice(0, 64);
}

function escapeHTML(s) {
  return String(s)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
}

/** Escape selector values for use in querySelectorAll */
function cssEscape(s) {
  // minimal escape for attribute selector usage
  return String(s).replace(/("|'|\\|]|\[|=)/g, '\\$1');
}

/* -------------------------------------------------------------------------- */
/*                      Optional: public helper for others                    */
/* -------------------------------------------------------------------------- */

/**
 * Save a learning item from anywhere:
 * saveToMyLearning({ id, title, target, thumb })
 */
export function saveToMyLearning(item) {
  saveItem(item);
  renderMyLearning();
}
