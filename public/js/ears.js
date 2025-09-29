/**
 * @fileoverview This file contains ears related functions and logic, which will be added later on

import { loadPage } from './navigation.js';
import { openMenu } from './menu.js';
import { readLikes as getLikes, toggleLike } from './likes.js';

// Navigate helper (same pattern as eyes.js)
function go(target) {
  if (!target) return;
  if (typeof window.showPage === 'function') window.showPage(target);
  else loadPage(target);
}

export function initializeEars() {
  const pageEl = document.getElementById('earsCatalogPage');
  if (!pageEl) return;

  // Menu button (identical behavior to Eyes)
  const menuBtn = pageEl.querySelector('.menuBtn');
  if (menuBtn) {
    menuBtn.addEventListener('click', (e) => {
      e.preventDefault();
      openMenu();
    }, { once: true });
  }

  // --- Sections: mirror Eyes layout but with Ears content targets you already have ---
  // Targets come from your existing ears subpages (otoscopyPage, earHealthPage, etc.) :contentReference[oaicite:4]{index=4}
  const sections = {
    earsCoreCarousel: [
      { label: 'Otoscopy',                 target: 'otoscopyPage',    tags: ['Video', 'Poster', 'Flowchart'] },
      { label: 'Ear Health & Hearing',     target: 'earHealthPage',   tags: ['Visual'] },
    ],
    earsDiseaseCarousel: [
      // Populate as you add disease content; placeholder example:
      { label: 'Otitis Media (Coming Soon)', target: 'comingSoon',    tags: ['Coming Soon'] },
    ],
    earsProceduresCarousel: [
      { label: 'How to Examine the Ear',  target: 'howToExamineEarPage', tags: ['Video'] },
      { label: 'Otoscopy Poster',         target: 'earConditionsPage',   tags: ['Visual'] },
      { label: 'Common Ear Conditions',   target: 'earFlowchartPage',    tags: ['Visual'] },
    ],
    earsToolsCarousel: [
      { label: 'Tuning Fork (Coming Soon)', target: 'comingSoon',     tags: ['Coming Soon'] },
    ],
  };

  // Render helper – identical markup/classes to Eyes for pixel parity :contentReference[oaicite:5]{index=5}
  const render = (containerId, items) => {
    const el = pageEl.querySelector(`#${containerId}`);
    if (!el) return;
    const likes = getLikes();

    el.classList.add('eyes-track'); // reuse same track class for styling

    el.innerHTML = items.map((i) => `
      <button type="button"
              class="eyes-card ${likes.has(i.label) ? 'liked' : ''}"
              data-target="${i.target}"
              data-label="${i.label}">
        <span class="heart-btn"
              aria-label="Like ${i.label}"
              role="button"
              tabindex="0"
              style="pointer-events:auto">
          <svg viewBox="0 0 24 24" aria-hidden="true" style="pointer-events:auto">
            <path style="pointer-events:auto"
                  d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 1 0-7.78 7.78L12 21.23l8.84-8.84a5.5 5.5 0 0 0 0-7.78z"/>
          </svg>
        </span>
        <span class="eyes-card__title">${i.label}</span>
        ${i.tags?.length ? `<div class="tag-row">${i.tags.map((t) => `<span class="tag">${t}</span>`).join('')}</div>` : ''}
      </button>
    `).join('');
  };

  Object.entries(sections).forEach(([id, list]) => render(id, list));

  // hearts: same behavior as Eyes (pointer-events + toggle like) :contentReference[oaicite:6]{index=6}
  pageEl.querySelectorAll('.heart-btn, .heart-btn *').forEach((n) => {
    try { n.style.pointerEvents = 'auto'; } catch {}
  });

  const consume = (e) => {
    e.preventDefault(); e.stopPropagation();
    if (typeof e.stopImmediatePropagation === 'function') e.stopImmediatePropagation();
  };

  const onHeartToggle = (e) => {
    consume(e);
    const heart = e.currentTarget;
    const card = heart.closest('.eyes-card');
    const label = card?.getAttribute('data-label');
    if (!label) return;
    const likes = toggleLike(label);
    card.classList.toggle('liked', likes.has(String(label)));
  };

  pageEl.querySelectorAll('.heart-btn').forEach((hb) => {
    hb.addEventListener('pointerdown', consume, { capture: true });
    hb.addEventListener('click', onHeartToggle, { capture: true });
    hb.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') onHeartToggle(e);
    });
  });

  // Card navigation (identical to Eyes’ non-video path) :contentReference[oaicite:7]{index=7}
  pageEl.addEventListener('click', async (e) => {
    const card = e.target.closest?.('.eyes-card');
    if (!card) return;
    e.preventDefault();

    const target =
      card.dataset?.target ||
      card.dataset?.route  ||
      card.dataset?.page   ||
      '';

    // All current Ears cards are non-video → show subpage directly
    if (target) {
      // If you keep Ears as part of the SPA, this will reveal the existing subpage from ears.html
      go(target);
    }
  }, { passive: false });
} */
