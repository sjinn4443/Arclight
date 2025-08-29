export function initializeEyes() {
  // placeholder specific to eyes.html
}


// ==== AUTO-MIGRATED FROM legacy script.js (2025-07-15) ====
// The following functions were ported automatically. Review selectors and
// ensure they are invoked from main.js on `page:loaded` where relevant.
// Functions: getAllEyesItems, initializeEyesCatalog

function getAllEyesItems() {
  const s = window.EYES_SECTIONS || {};
  return Object.values(s).flat(); // flatten core/disease/pec/extended/tools
}

function initializeEyesCatalog() {
  // --- exact lists you already set up ---
  const sections = {
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
      { label: 'Diabetic Retinopathy', target: 'comingSoon', soon:true },
      { label: 'Corneal Disease', target: 'comingSoon', soon:true },
      { label: 'Childhood Eye Screening', target: 'childhoodEyeScreeningPage', tags:['Video'] },
      { label: 'Retinopathy of Prematurity', target: 'comingSoon', soon:true },
      { label: 'Retinal Disease', target: 'comingSoon', soon:true },
      { label: 'Optic Nerve Disease', target: 'comingSoon', soon:true },
    ],
    pecCarousel: [
      { label: 'WHO PEC', target: 'comingSoon', soon:true },
    ],
    extendedCarousel: [
      { label: 'Ptosis', target: 'comingSoon', soon:true },
      { label: 'Proptosis', target: 'comingSoon', soon:true },
      { label: 'Eye Movements/Squint', target: 'squintPalsyPage' },
      { label: 'Cranial Nerve Examination', target: 'comingSoon', soon:true },
    ],
    toolsCarousel: [
      { label: 'Arclight Overview', target: 'howToUseArclightVideoPage' },
      { label: 'Binocular Indirect Ophthalmoscope Overview', target: 'comingSoon', soon:true },
    ],
  };

  window.EYES_SECTIONS = sections;

  // --- Render helper (adds heart icon) ---
  const render = (containerId, items) => {
    const el = document.getElementById(containerId);
    if (!el) return;
    const likes = getLikes();

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
        ${i.tags?.length ? `<div class="tag-row">${i.tags.map(t=>`<span class="tag">${t}</span>`).join('')}</div>` : ''}
      </button>
    `).join('');
  };

  Object.entries(sections).forEach(([id, list]) => render(id, list));

  // --- Click handling (heart vs navigate) ---
  const page = document.getElementById('eyesCatalogPage');
  page?.addEventListener('click', (e) => {
    const heart = e.target.closest('.heart-btn');
    if (heart) {
      e.stopPropagation(); e.preventDefault();
      const card = heart.closest('.eyes-card');
      const label = card?.getAttribute('data-label');
      if (!label) return;
      const likes = getLikes();
      if (likes.has(label)) { likes.delete(label); card.classList.remove('liked'); }
      else { likes.add(label); card.classList.add('liked'); }
      saveLikes(likes);
      return;
    }

    const btn = e.target.closest('.eyes-card');
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