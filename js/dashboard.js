import { loadPage } from './navigation.js';

export function initializeDashboard() {
  // Cards already wired via [data-route] in navigation.js
}


// ==== AUTO-MIGRATED FROM legacy script.js (2025-07-15) ====
// The following functions were ported automatically. Review selectors and
// ensure they are invoked from main.js on `page:loaded` where relevant.
// Functions: initializeUnifiedDashboard, initializeDashboard, updateDashboardSwitch, goToDashboard

function initializeUnifiedDashboard() {
  // 1) Greeting
  const usernameDisplay = document.querySelector('#unifiedDashboard .hello');
  if (usernameDisplay) {
    const storedName = localStorage.getItem('username') || 'Guest';
    usernameDisplay.textContent = `Hello ${storedName}!`;
  }

  // 2) Carousel wiring
  const carousel = document.getElementById('categoryCarousel');
  if (!carousel) return;

  // Click routing
  carousel.querySelectorAll('.category-card').forEach(card => {
    card.addEventListener('click', () => {
      const target = card.dataset.target;
      if (target === 'learningModules') {
        showLearningModules();
      } else if (target === 'earsLearningModules') {
        showEarsLearningModules();
      } else {
        showPage(target);
      }
    });
  });

  // --- Dots: update on scroll and click ---
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

  const paintDots = (i) => {
    dots.forEach((d, idx) => d.classList.toggle('active', idx === i));
  };

  const centerCardByIndex = (i) => {
    const cards = carousel.querySelectorAll('.category-card');
    if (!cards.length) return;
    const clamped = Math.max(0, Math.min(i, cards.length - 1));
    const card = cards[clamped];
    const left = card.offsetLeft - (carousel.offsetWidth / 2) + (card.offsetWidth / 2);
    carousel.scrollTo({ left, behavior: 'smooth' });
  };

  // Scroll listener to update dots
  let rafId = null;
  const onScroll = () => {
    if (rafId) return;
    rafId = requestAnimationFrame(() => {
      rafId = null;
      paintDots(getActiveIndex());
    });
  };
  carousel.addEventListener('scroll', onScroll, { passive: true });

  // Click dots to center specific card
  dots.forEach((dot, i) => dot.addEventListener('click', () => centerCardByIndex(i)));

  // Start centered on the 2nd card (index 1) and paint dots
  requestAnimationFrame(() => {
    centerCardByIndex(1);
    paintDots(1);
  });
}

function initializeDashboardImpl() {
  const goToDashboardBtn = document.getElementById('goToDashboardBtn');
  if (goToDashboardBtn) {
    goToDashboardBtn.addEventListener('click', goToDashboard);
  }

  const goToEarsDashboardBtn = document.getElementById('goToEarsDashboardBtn');
  if (goToEarsDashboardBtn) {
    goToEarsDashboardBtn.addEventListener('click', goToEarsDashboard);
  }

  const eyesSwitch = document.getElementById('eyesToEarsSwitch');
  if (eyesSwitch) {
    eyesSwitch.addEventListener('change', function() {
      if (this.checked) {
        showPage('earsDashboard');
      }
    });
  }

  const earsSwitch = document.getElementById('earsToEyesSwitch');
  if (earsSwitch) {
    earsSwitch.addEventListener('change', function() {
      if (!this.checked) {
        showPage('dashboard');
      }
    });
  }
}

function updateDashboardSwitch(pageId) {
  const eyesSwitch = document.getElementById('eyesToEarsSwitch');
  const earsSwitch = document.getElementById('earsToEyesSwitch');

  if (pageId === 'dashboard' && eyesSwitch) {
    eyesSwitch.checked = false;
  }

  if (pageId === 'earsDashboard' && earsSwitch) {
    earsSwitch.checked = true;
  }
}

function goToDashboard() {
  showPage('dashboard');
}