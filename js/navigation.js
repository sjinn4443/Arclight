// js/navigation.js
import { ROUTES } from './config.js';
import { closeMenu } from './menu.js';

export let currentPageName = null;
const historyStack = [];

export async function loadPage(routeName, options = {}) {
  const container = document.getElementById('page-content');
  const url = ROUTES[routeName];

  if (!container) {
    console.error('#page-content not found');
    return;
  }
  if (!url) {
    container.innerHTML = `<div class="container"><p>Page not found: ${routeName}</p></div>`;
    return;
  }

  // Load the page fragment
  let html = '';
  try {
    const res = await fetch(url, { cache: 'no-store' });
    html = await res.text();
  } catch (err) {
    console.error('Failed to load route', routeName, err);
    container.innerHTML = `<div class="container"><p>Failed to load page: ${routeName}</p></div>`;
    return;
  }

  // Inject
  container.innerHTML = html;
  currentPageName = routeName;

  try { closeMenu(); } catch {}

  // Debug (optional)
  console.log('[router] loaded route:', routeName, 'bytes=', html.length);
  console.log('[router] .page count:', container.querySelectorAll('.page').length);

  // 🔑 Make something visible
  const firstActive =
    container.querySelector('.page[data-default="true"]') ||
    container.querySelector('.page');
  if (firstActive) {
    firstActive.classList.add('active');
  } else {
    // Fallback: ensure something is visible even if fragment lacks .page
    const wrapper = document.createElement('div');
    wrapper.className = 'page active';
    while (container.firstChild) wrapper.appendChild(container.firstChild);
    container.appendChild(wrapper);
    console.warn('[router] No .page found; wrapped content in .page.active');
  }

  // Basic history
  if (!options.replace) historyStack.push(routeName);

  // Notify initializers
  window.dispatchEvent(new CustomEvent('page:loaded', { detail: { routeName } }));

  // Toggle fixed UI (optional)
  const homeBtnContainer = document.getElementById('homeButtonContainer');
  const searchContainer  = document.getElementById('fixedSearchContainer');
  const showHomePages = [
     'earsDashboard', 'videos',
    'eyes', 'ears'
  ];
  const shouldShowNav = showHomePages.includes(routeName);
  if (homeBtnContainer) homeBtnContainer.style.display = shouldShowNav ? 'flex' : 'none';
  if (searchContainer) {
    searchContainer.style.display = ['dashboard', 'earsDashboard'].includes(routeName) ? 'block' : 'none';
  }
}

export function goBack() {
  historyStack.pop();              // current
  const prev = historyStack.pop(); // previous
  if (prev) loadPage(prev, { replace: true });
  else loadPage('dashboard', { replace: true });
}

export function initializePageNavigation() {
  window.addEventListener('click', (e) => {
    const el = e.target.closest?.('[data-route]');
    if (!el) return;
    const route = el.getAttribute('data-route');
    if (route) {
      e.preventDefault();
      loadPage(route);
    }
  });

  const backBtn = document.getElementById('backBtnGlobal');
  backBtn?.addEventListener('click', (e) => {
    e.preventDefault();
    goBack();
  });
}
