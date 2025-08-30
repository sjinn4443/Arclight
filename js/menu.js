// js/menu.js
let overlay, closeBtn;

export async function initializeMenu() {
  if (overlay) return; // already initialized

  // Fetch the template
  const res = await fetch('html/menu.html');
  const html = await res.text();

  // Parse and extract the overlay element
  const tmp = document.createElement('div');
  tmp.innerHTML = html;
  const found = tmp.querySelector('#menuOverlay');
  if (!found) {
    console.error('[menu] #menuOverlay not found in html/menu.html');
    return;
  }

  // Ensure it starts hidden
  found.classList.add('hidden');

  // Append directly under <body> (critical for overlay)
  document.body.appendChild(found);

  // Wire refs & handlers
  overlay  = found;
  closeBtn = overlay.querySelector('#closeMenuBtn');

  closeBtn?.addEventListener('click', closeMenu);
  overlay.addEventListener('click', (e) => {
    // click outside the panel closes
    if (e.target === overlay) closeMenu();
  });

  // Esc to close
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeMenu();
  });

  // Close if any link-like element inside is clicked
  overlay.addEventListener('click', (e) => {
    const a = e.target.closest('a,[data-route],[data-close-menu]');
    if (a) closeMenu();
  });
}

export function openMenu() {
  if (!overlay) return;
  document.body.setAttribute('data-menu-open', 'true');
  overlay.classList.remove('hidden');
}

export function closeMenu() {
  if (!overlay) return;
  document.body.removeAttribute('data-menu-open');
  overlay.classList.add('hidden');
}
