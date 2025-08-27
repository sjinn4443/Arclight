// Logic for the "Eyes Catalog" page

// js/catalog.js (ES module)
import { showPage } from './navigation.js';
const EYES_LIKES_KEY = 'eyesLikes';



function eyesGetLikes() {
  try { return new Set(JSON.parse(localStorage.getItem(EYES_LIKES_KEY) || '[]')); }
  catch { return new Set(); }
}
function eyesSaveLikes(set) {
  localStorage.setItem(EYES_LIKES_KEY, JSON.stringify([...set]));
}

// Original items (no images): label, target, soon?, tags?
const EYES_SECTIONS = {
  coreCarousel: [
    { label: 'History Taking', target: 'comingSoon', soon: true, tags:['Quiz','Interactive'] },
    { label: 'Visual Acuity', target: 'visualAcuityPage', tags:['Case Study'] },
    { label: 'Pupils', target: 'pupilsPage', tags:['Video'] },
    { label: 'Front of Eye', target: 'frontOfEyePage', tags:['Video','Quiz'] },
    { label: 'Fundal Reflex', target: 'fundalReflexPage', tags:['Video'] },
    { label: 'Ophthalmoscopy', target: 'directOphthalmoscopy', tags:['Video','Quiz'] },
    { label: 'Interactive Learning', target: 'interactiveLearningPage', tags:['Simulation'] },
  ],
  diseaseCarousel: [
    { label: 'Uncorrected Refractive Error', target: 'comingSoon', soon:true, tags:['Quiz'] },
    { label: 'Cataract', target: 'cataractPage', tags:['Case Study','Interactive'] },
    { label: 'Glaucoma', target: 'comingSoon', soon:true },
    { label: 'Red Eye', target: 'comingSoon', soon:true },
    { label: 'Trauma', target: 'comingSoon', soon:true },
    { label: 'Infections', target: 'comingSoon', soon:true },
  ],
  pecCarousel: [
    { label: 'Refraction', target: 'comingSoon', soon:true },
    { label: 'Near Vision', target: 'comingSoon', soon:true },
    { label: 'Pinhole', target: 'comingSoon', soon:true },
  ],
  extendedCarousel: [
    { label: 'Fundus Exam', target: 'fundusExamPage', tags:['Video'] },
    { label: 'Visual Fields', target: 'comingSoon', soon:true },
    { label: 'Colour Vision', target: 'comingSoon', soon:true },
  ],
  toolsCarousel: [
    { label: 'How to Use Arclight', target: 'comingSoon', soon:true },
    { label: 'Torch Techniques', target: 'comingSoon', soon:true },
  ],
};

// Flatten all Eyes catalog items into one array (label, target, tags, soon?)
export function getAllEyesItems() {
   return Object.values(EYES_SECTIONS).flat();
}


function renderEyesCarousel(containerId, items = []) {
  const el = document.getElementById(containerId);
  if (!el) return;
  const likes = eyesGetLikes();

    el.innerHTML = items.map(i => `
    <button class="eyes-card ${likes.has(i.label) ? 'liked' : ''}"
            data-target="${i.target}" data-title="${i.soon ? i.label : ''}"
            data-label="${i.label}">
      <span class="heart-btn" aria-label="Like ${i.label}" role="button" tabindex="-1">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 1 0-7.78 7.78L12 21.23l8.84-8.84a5.5 5.5 0 0 0 0-7.78z"/>
        </svg>
      </span>
      <span>${i.label}</span>
      ${i.tags?.length ? (
        '<div class="tag-row">' + i.tags.map(t => '<span class="tag">' + t + '</span>').join('') + '</div>'
      ) : ''}
    </button>
  `).join('');
}

function renderAllEyesCarousels() {
  try {
    Object.entries(EYES_SECTIONS).forEach(([id, list]) => renderEyesCarousel(id, list));
  } catch (e) {
    console.error('Eyes carousels failed to render:', e);
  }
}

// Event delegation (heart + navigate), scoped to Eyes page only
function wireEyesClicks() {
  const eyesPage = document.getElementById('eyesCatalogPage');
  if (!eyesPage) return;

  eyesPage.addEventListener('click', (e) => {
    // heart toggle
    const heart = e.target.closest?.('.heart-btn');
    if (heart) {
      e.preventDefault();
      const card = heart.closest('.eyes-card');
      const label = card?.getAttribute('data-label');
      if (!label) return;
      const likes = eyesGetLikes();
      if (likes.has(label)) { likes.delete(label); card.classList.remove('liked'); }
      else { likes.add(label); card.classList.add('liked'); }
      eyesSaveLikes(likes);
      return; // don’t fall through to navigation
    }
    // navigate
    const btn = e.target.closest?.('.eyes-card');
    if (!btn) return;
    const target = btn.getAttribute('data-target') || 'comingSoon';
    if (target === 'comingSoon') {
      const title = btn.getAttribute('data-title') || 'Coming soon';
      const h = document.getElementById('comingSoonTitle');
      if (h) h.textContent = title;
    }
    showPage(target);
  });
}

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
   renderAllEyesCarousels();
  wireEyesClicks();
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
