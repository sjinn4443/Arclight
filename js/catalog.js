// Logic for the "Eyes Catalog" page

// js/catalog.js (ES module)
import { showPage } from './navigation.js';

/**
 * Call once on DOMContentLoaded from main.js.
 * Enhances the Eyes Catalog with:
 * - Text search (local)
 * - Category / tag filter (buttons)
 * - A–Z filter bar
 * - Optional sorting
 * - Card routing + save/unsave (localStorage)
 */
export function initializeCatalog() {
  const page = document.getElementById('eyesCatalogPage');
  if (!page) return;

  const list = page.querySelector('#catalogList') || page;

  // State
  const state = {
    q: '',
    tag: 'All',
    alpha: 'All',
    sort: 'az',
  };

  // Wire controls
  const searchInput = page.querySelector('#catalogSearch') || document.getElementById('fixedSearchInput');
  if (searchInput) {
    const handler = () => {
      state.q = (searchInput.value || '').trim().toLowerCase();
      applyFilters(list, state);
    };
    searchInput.addEventListener('input', handler, { passive: true });
    handler(); // initial pass
  }

  page.querySelectorAll('.catalog-filter[data-filter]').forEach(btn => {
    btn.addEventListener('click', () => {
      page.querySelectorAll('.catalog-filter').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      state.tag = btn.getAttribute('data-filter') || 'All';
      applyFilters(list, state);
    });
  });

  page.querySelectorAll('#alphaBar .alpha-letter[data-letter]').forEach(letterBtn => {
    letterBtn.addEventListener('click', () => {
      page.querySelectorAll('#alphaBar .alpha-letter').forEach(b => b.classList.remove('active'));
      letterBtn.classList.add('active');
      state.alpha = letterBtn.getAttribute('data-letter') || 'All';
      applyFilters(list, state);
    });
  });

  const sortSelect = page.querySelector('#catalogSort');
  if (sortSelect) {
    sortSelect.addEventListener('change', () => {
      state.sort = sortSelect.value || 'az';
      applyFilters(list, state);
    });
  }

  // Delegate clicks for routing and save/unsave
  list.addEventListener('click', (e) => {
    const saveBtn = e.target.closest('.save-btn');
    const card = e.target.closest('.catalog-card');
    if (!card) return;

    if (saveBtn) {
      toggleSave(card);
      e.stopPropagation();
      return;
    }

    // Open target unless user clicked interactive UI
    if (!e.target.closest('button,a,input,label')) {
      routeCard(card);
    }
  });

  // Initial painting of save-state
  list.querySelectorAll('.catalog-card').forEach(updateCardSaveVisual);

  // Run first filter pass (also sorts if you have a default selected)
  applyFilters(list, state);
}

/* -------------------------------------------------------------------------- */
/*                                  Routing                                   */
/* -------------------------------------------------------------------------- */

function routeCard(cardEl) {
  const { target } = readCardData(cardEl);
  showPage(target || 'atomsCardPage');
}

/* -------------------------------------------------------------------------- */
/*                                 Filtering                                  */
/* -------------------------------------------------------------------------- */

function applyFilters(list, state) {
  const cards = Array.from(list.querySelectorAll('.catalog-card'));

  // Filter
  const filtered = cards.filter(card => {
    const data = readCardData(card);
    const title = data.title.toLowerCase();
    const tags = data.tags.join('|');

    const passText = !state.q || title.includes(state.q) || tags.toLowerCase().includes(state.q);
    const passTag  = state.tag === 'All' || data.tags.includes(state.tag);
    const passAlpha = (state.alpha === 'All') ||
                      (title.charAt(0).toUpperCase() === state.alpha.toUpperCase());

    const show = passText && passTag && passAlpha;
    card.style.display = show ? '' : 'none';
    return show;
  });

  // Sort (DOM reorder)
  const parent = filtered[0]?.parentElement;
  if (parent) {
    const sorted = filtered.slice().sort((a, b) => {
      if (state.sort === 'recent') {
        const da = parseDateSafe(a.dataset.updatedAt || a.dataset.date || '');
        const db = parseDateSafe(b.dataset.updatedAt || b.dataset.date || '');
        return db - da; // newest first
      }
      const ta = (a.dataset.title || a.querySelector('.module-title')?.textContent || '').toLowerCase();
      const tb = (b.dataset.title || b.querySelector('.module-title')?.textContent || '').toLowerCase();
      return state.sort === 'za' ? (tb.localeCompare(ta)) : (ta.localeCompare(tb));
    });

    // Move nodes in new order
    sorted.forEach(node => parent.appendChild(node));
  }
}

function parseDateSafe(s) {
  const t = Date.parse(s);
  return Number.isFinite(t) ? t : 0;
}

/* -------------------------------------------------------------------------- */
/*                             Save / Unsave (local)                          */
/* -------------------------------------------------------------------------- */

const STORAGE_KEY = 'myLearningItems';

function readCardData(cardEl) {
  const id = cardEl?.dataset?.id || inferId(cardEl);
  const title = cardEl?.dataset?.title || cardEl?.querySelector('.module-title, .card-title')?.textContent?.trim() || '';
  const target = cardEl?.dataset?.target || cardEl?.getAttribute('data-target') || 'atomsCardPage';
  const thumb = cardEl?.dataset?.thumb || cardEl?.querySelector('img')?.getAttribute('src') || '';
  const tagsRaw = cardEl?.dataset?.tags || cardEl?.getAttribute('data-tags') || '';
  const tags = tagsRaw ? tagsRaw.split(',').map(s => s.trim()) : [];
  return { id, title, target, thumb, tags };
}

function inferId(cardEl) {
  const t = cardEl?.dataset?.title || cardEl?.querySelector('.module-title, .card-title')?.textContent || 'catalog-item';
  return slugify(t);
}

function slugify(s) {
  return (s || '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '')
    .slice(0, 64);
}

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
  cardEl.classList.toggle('saved', saved);
  const btn = cardEl.querySelector('.save-btn');
  if (btn) btn.textContent = saved ? 'Saved' : 'Save';
}
