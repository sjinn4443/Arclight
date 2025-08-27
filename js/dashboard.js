// Dashboard, carousels, and recommendations

// js/dashboard.js (ES module)
import { showPage } from './navigation.js';

/**
 * Call from main.js after DOMContentLoaded.
 * Wires up Unified Dashboard + legacy Eyes/Ears dashboards + menu overlay.
 */
export function initializeDashboard() {
  initializeUnifiedDashboard();
  initializeLegacyDashboards();
  initializeMenuOverlay();
}

/* ------------------------------------------------------------------------- */
/*                              Unified Dashboard                             */
/* ------------------------------------------------------------------------- */

function initializeUnifiedDashboard() {
  const root = document.getElementById('unifiedDashboard');
  if (!root) return;

  // 1) Greeting: "Hello <name>!"
  const usernameDisplay = root.querySelector('.hello');
  if (usernameDisplay) {
    const storedName = localStorage.getItem('username') || 'Sujin';
    usernameDisplay.textContent = `Hello ${storedName}!`;
  }

  // 2) Category carousel: card clicks → navigate
  const carousel = document.getElementById('categoryCarousel');
  if (carousel) {
    carousel.querySelectorAll('.category-card').forEach(card => {
      card.addEventListener('click', () => {
        const target = card.getAttribute('data-target') || 'dashboard';
        showPage(target);
      });
    });

    // Dots: follow scroll position + click to jump
    const dots = Array.from(document.querySelectorAll('#carouselDots .dot'));
    const getActiveIndex = () => {
      const cards = Array.from(carousel.querySelectorAll('.category-card'));
      const mid = carousel.scrollLeft + carousel.offsetWidth / 2;
      let best = 0, bestDist = Infinity;
      cards.forEach((card, i) => {
        const center = card.offsetLeft + card.offsetWidth / 2;
        const d = Math.abs(center - mid);
        if (d < bestDist) { bestDist = d; best = i; }
      });
      return best;
    };
    const paintDots = (i) => dots.forEach((d, idx) => d.classList.toggle('active', idx === i));
    const centerCardByIndex = (i) => {
      const cards = carousel.querySelectorAll('.category-card');
      if (!cards.length) return;
      const clamped = Math.max(0, Math.min(i, cards.length - 1));
      const card = cards[clamped];
      const left = card.offsetLeft - (carousel.offsetWidth / 2) + (card.offsetWidth / 2);
      carousel.scrollTo({ left, behavior: 'smooth' });
    };

    // Initial state + listeners
    paintDots(getActiveIndex());
    carousel.addEventListener('scroll', () => paintDots(getActiveIndex()), { passive: true });
    dots.forEach((dot, i) => dot.addEventListener('click', () => centerCardByIndex(i)));
  }

  // 3) Quick actions (simple routing that matches current pages)
  // - Atoms Card -> atomsCardPage (existing)
  // - My Notes   -> likedPage (renamed "My Learning")
  // - ALAN       -> teachModules (placeholder page)
  // - Download   -> open the existing offline/install popup if present
  const qa = root.querySelector('.quick-actions');
  if (qa) {
    const map = {
      'Atoms Card': () => showPage('atomsCardPage'),
      'My Notes':   () => showPage('likedPage'),
      'ALAN':       () => showPage('teachModules'),
      'Download Contents': () => {
        // Try existing popup if present; otherwise fall back to PWA flow
        const pop = document.getElementById('installPopup');
        if (pop) pop.style.display = 'block';
        else if (typeof window.handleInstallPrompt === 'function') window.handleInstallPrompt().catch(()=>{});
      },
    };
    qa.addEventListener('click', (e) => {
      const pill = e.target.closest('.pill');
      if (!pill) return;
      const label = pill.textContent.trim();
      const fn = map[label];
      if (fn) fn();
    });
  }

  // 4) “Recommended for you” placeholder content (safe to replace later)
  const rec = document.getElementById('recommendedPlaceholder');
  if (rec) {
    rec.innerHTML = `
      <div class="module-card" data-target="learningModules">
        <img src="images/placeholder1.jpg" alt="" />
        <div class="module-title">Core Clinical Ophthalmic Examination</div>
      </div>
      <div class="module-card" data-target="eyesCatalogPage">
        <img src="images/placeholder2.jpg" alt="" />
        <div class="module-title">Primary Eye Care Procedures</div>
      </div>
    `;
    rec.addEventListener('click', (e) => {
      const card = e.target.closest('.module-card');
      if (!card) return;
      const target = card.getAttribute('data-target') || 'learningModules';
      showPage(target);
    });
  }
}

/* ------------------------------------------------------------------------- */
/*                           Legacy Eyes / Ears pages                         */
/* ------------------------------------------------------------------------- */

function initializeLegacyDashboards() {
  // Eyes page buttons
  const showLM = document.getElementById('showLearningModulesBtn');
  if (showLM) showLM.addEventListener('click', () => showPage('learningModules'));

  const atomsEyes = document.getElementById('goToAtomsCardEyesBtn');
  if (atomsEyes) atomsEyes.addEventListener('click', () => showPage('atomsCardPage'));

  // Ears page buttons
  const showEarsLM = document.getElementById('showEarsLearningModulesBtn');
  if (showEarsLM) showEarsLM.addEventListener('click', () => showPage('earsLearningModules'));

  const atomsEars = document.getElementById('goToAtomsCardEarsBtn');
  if (atomsEars) atomsEars.addEventListener('click', () => showPage('atomsCardPage'));

  // “Offline contents” buttons (both pages share the same class)
  document.querySelectorAll('.showOfflineContentModalBtn').forEach(btn => {
    btn.addEventListener('click', () => {
      const pop = document.getElementById('installPopup');
      if (pop) pop.style.display = 'block';
    });
  });
}

/* ------------------------------------------------------------------------- */
/*                                Menu Overlay                               */
/* ------------------------------------------------------------------------- */

function initializeMenuOverlay() {
  const overlay = document.getElementById('menuOverlay');
  const closeBtn = document.getElementById('closeMenuBtn');
  const username = document.getElementById('menuUsername');

  // Open from any .menuBtn
  document.querySelectorAll('.menuBtn').forEach(btn => {
    btn.addEventListener('click', () => {
      if (username) {
        username.textContent = localStorage.getItem('username') || 'Guest';
      }
      overlay?.classList.remove('hidden');
    });
  });

  // Close (X)
  if (closeBtn) {
    closeBtn.addEventListener('click', () => {
      overlay?.classList.add('hidden');
    });
  }

  // Click outside panel to close
  if (overlay) {
    overlay.addEventListener('click', (e) => {
      // only close when clicking the dim backdrop, not inside the panel
      if (e.target === overlay) overlay.classList.add('hidden');
    });
  }
}
