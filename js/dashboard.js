// js/dashboard.js
import { loadPage } from './navigation.js';
import { openMenu } from './menu.js';

const wired = new WeakSet();

export function initializeDashboard() {
  const root = document.getElementById('unifiedDashboard');
  if (!root || wired.has(root)) return;
  wired.add(root);

  // 1) Hello <username>!
  const helloEl = root.querySelector('.hello');
  const username = (localStorage.getItem('username') || '').trim();
  if (helloEl) helloEl.textContent = `Hello ${username || 'there'}!`;

  // 2) ☰ → Menu route (overlay lives in menu.html)
   const menuBtn = root.querySelector('.menuBtn');
 if (menuBtn) {
   menuBtn.addEventListener('click', (e) => {
    e.preventDefault();
    openMenu();
   });
 }

  // 3) Category cards
  // inside initializeDashboard()
const LEGACY_TO_ROUTE = {
  eyesModules:  'eyes', 
  earsModules:  'ears',
  skinModules:  'videos',
  teachModules: 'videos',
  eyesCatalogPage: 'eyes',
  earsLearningModules: 'ears'
};

root.querySelectorAll('.category-card').forEach(card => {
    card.addEventListener('click', () => {
      const legacy = card.getAttribute('data-target') || '';
      loadPage(LEGACY_TO_ROUTE[legacy] || legacy);
    });
  });

  // 4 & 5) Quick actions: Atoms Card + Download Contents
  root.querySelectorAll('.quick-actions .pill').forEach(pill => {
    const label = (pill.textContent || '').toLowerCase().trim();
    if (label.includes('atoms')) {
      pill.addEventListener('click', () => loadPage('atomscard'), { once: true });
    } else if (label.includes('download')) {
      pill.addEventListener('click', () => loadPage('offline'), { once: true });
    }
  });

  // 6) Recommended for you (2 random)
  const host = document.getElementById('recommendedPlaceholder');
  if (host) renderRecommendations(host);
}

function shuffle(arr) {
  const a = arr.slice();
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}
function renderRecommendations(host) {
  const ALL = [
    { title: 'Direct Ophthalmoscopy',  route: 'videos',  tag: 'Video • Quiz' },
    { title: 'Visual Acuity',          route: 'videos',  tag: 'Video' },
    { title: 'Pupil Exam',             route: 'videos',  tag: 'Video' },
    { title: 'Cataract',               route: 'videos',  tag: 'Case Study' },
  ];

  const picks = shuffle(ALL).slice(0, 2);
  host.innerHTML = picks.map(m => `
    <div class="module-card" data-route="${m.route}">
      <div class="module-title">${m.title}</div>
    </div>
  `).join('');
  host.querySelectorAll('.module-card').forEach(card => {
    card.addEventListener('click', () => {
      const route = card.getAttribute('data-route');
      if (route) loadPage(route);
    });
  });
}