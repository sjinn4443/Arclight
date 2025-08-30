// js/eyes.js
import { loadPage } from './navigation.js';

export function initializeEyes() {
  const page = document.getElementById('eyesCatalogPage');
  if (!page) return;

  page.querySelector('.menuBtn')?.addEventListener('click', (e) => {
    e.preventDefault();
    loadPage('menu');
  }, { once: true });

  const sections = {
    coreCarousel: [
      { label: 'History Taking',         target: 'atomscard',  soon: true, tags:['Quiz','Interactive'] },
      { label: 'Visual Acuity',          target: 'videos',                 tags:['Case Study'] },
      { label: 'Pupils',                 target: 'videos',                 tags:['Video'] },
      { label: 'Front of Eye',           target: 'videos',                 tags:['Video','Quiz'] },
      { label: 'Fundal Reflex',          target: 'atomscard',  soon: true, tags:['Video'] },
      { label: 'Direct Ophthalmoscopy',  target: 'videos',                 tags:['Video','Quiz'] },
      { label: 'Interactive Learning',   target: 'quizzes',                tags:['Simulation'] },
    ],
    diseaseCarousel: [
      { label: 'Uncorrected Refractive Error', target: 'quizzes', soon: true, tags: ['Quiz'] },
      { label: 'Cataract',                      target: 'videos',                tags: ['Case Study','Interactive'] },
      { label: 'Glaucoma',                      target: 'quizzes', soon: true },
      { label: 'Diabetic Retinopathy',          target: 'quizzes', soon: true },
    ],
    pecCarousel: [
      { label: 'CAPOS',                         target: 'videos',                tags: ['Video'] },
      { label: 'Lid Eversion',                  target: 'videos',                tags: ['Video'] },
      { label: 'Instillation of Eye Drops',     target: 'videos',                tags: ['Video'] },
      { label: 'Fluorescein Staining',          target: 'videos',                tags: ['Video'] },
    ],
  };

  setupCarousel('coreCarousel', sections.coreCarousel);
  setupCarousel('diseaseCarousel', sections.diseaseCarousel);
  setupCarousel('pecCarousel', sections.pecCarousel);
}

/* === Baseline-parity carousel with dots and centered start === */
function setupCarousel(containerId, items) {
  const container = document.getElementById(containerId);
  if (!container) return;

  // track
  const track = document.createElement('div');
  track.className = 'eyes-track';
  Object.assign(track.style, {
    display: 'flex',
    overflowX: 'auto',
    scrollSnapType: 'x mandatory',
    gap: '10px',
    padding: '4px',
  });

  // cards
  items.forEach((it) => {
    const card = document.createElement('button');
    card.type = 'button';
    card.className = 'eyes-card';
    Object.assign(card.style, {
      minWidth: '220px',
      scrollSnapAlign: 'center',
      border: '1px solid #e3e3e6',
      borderRadius: '12px',
      padding: '12px',
      background: '#fff',
      textAlign: 'left',
    });
    card.innerHTML = `
      <div style="font-weight:600;margin-bottom:4px">${escapeHTML(it.label)}</div>
      <div style="font-size:12px;color:#666">${escapeHTML((it.tags||[]).join(' • '))}${it.soon ? ' — <i>Coming soon</i>' : ''}</div>
    `;
    if (!it.soon && it.target) {
      card.addEventListener('click', () => loadPage(it.target));
    } else {
      card.disabled = true;
      card.style.opacity = '0.6';
      card.style.cursor = 'not-allowed';
    }
    track.appendChild(card);
  });

  // dots
  const dotsWrap = document.createElement('div');
  Object.assign(dotsWrap.style, { display: 'flex', gap: '6px', justifyContent: 'center', marginTop: '8px' });

  const cards = Array.from(track.children);
  const dots  = cards.map((_, i) => {
    const d = document.createElement('button');
    d.type = 'button';
    Object.assign(d.style, {
      width: '8px', height: '8px',
      borderRadius: '50%',
      border: '0',
      background: '#d3d3d8',
    });
    d.addEventListener('click', () => centerCardByIndex(i));
    dotsWrap.appendChild(d);
    return d;
  });

  // helpers
  const getActiveIndex = () => {
    if (!cards.length) return 0;
    let min = Infinity, idx = 0;
    const center = track.scrollLeft + track.clientWidth / 2;
    cards.forEach((card, i) => {
      const left = card.offsetLeft + card.offsetWidth / 2;
      const dist = Math.abs(left - center);
      if (dist < min) { min = dist; idx = i; }
    });
    return idx;
  };

  const paintDots = (i) => {
    dots.forEach((d, j) => d.style.background = (i === j) ? '#666' : '#d3d3d8');
  };

  const centerCardByIndex = (i) => {
    const card = cards[i];
    if (!card) return;
    const left = card.offsetLeft - (track.offsetWidth / 2) + (card.offsetWidth / 2);
    track.scrollTo({ left, behavior: 'smooth' });
  };

  // scroll listener with rAF (baseline pattern)
  let rafId = null;
  const onScroll = () => {
    if (rafId) return;
    rafId = requestAnimationFrame(() => {
      rafId = null;
      paintDots(getActiveIndex());
    });
  };
  track.addEventListener('scroll', onScroll, { passive: true });

  // mount
  container.innerHTML = '';
  container.appendChild(track);
  container.appendChild(dotsWrap);

  // start centered on 2nd card like baseline
  requestAnimationFrame(() => {
    centerCardByIndex(Math.min(1, cards.length - 1));
    paintDots(Math.min(1, cards.length - 1));
  });
}

function escapeHTML(s) {
  return String(s).replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
}
