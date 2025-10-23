/**
 * @fileoverview This file manages the application's global overlay menu. Handles menu initialization, opening, and closing, including fetching menu content and setting up event listeners.
 */

let overlay, closeBtn;

// --- Render the profile location from localStorage (or fallback) ---
function renderProfileLocation() {
  // Try ID first; fall back to class (in case ID changed)
  const el =
    document.getElementById("profileLocation") ||
    document.querySelector(".profile-location");
  if (!el) return;

  // Read cached geo
  let iso = "GB";
  let area = null;
  try {
    const data = JSON.parse(localStorage.getItem("profileGeo") || "null");
    if (data) {
      if (data.iso2) iso = data.iso2;
      if (data.area) area = data.area;
    }
  } catch {
    /* ignore */
  }

  // Write text + make visible (in case you hid it while loading)
  el.textContent = area ? `Location: ${area}, ${iso}` : `Location: ${iso}`;
  el.style.visibility = "visible";
}

/**
 * Initializes the global overlay menu.
 * Fetches the menu HTML, appends it to the body, and sets up event listeners
 * for closing the menu (via button, outside click, or Escape key).
 * Ensures the menu is initialized only once.
 */
export async function initializeMenu() {
  if (overlay) return; // already initialized

  // 1) Fetch the template
  const res = await fetch("html/menu.html");
  const html = await res.text();

  // 2) Parse and extract the overlay element
  const tmp = document.createElement("div");
  tmp.innerHTML = html;
  const found = tmp.querySelector("#menuOverlay");
  if (!found) {
    console.error("[menu] #menuOverlay not found in html/menu.html");
    return;
  }

  // 3) Ensure it starts hidden & append under <body>
  found.classList.add("hidden");
  document.body.appendChild(found);

  // 4) Wire refs AFTER appending
  overlay = found;
  closeBtn = overlay.querySelector("#closeMenuBtn");

  // 5) Populate username now that overlay exists
  const nameEl = overlay.querySelector("#menuUsername");
  const name = (localStorage.getItem("username") || "").trim();
  if (nameEl) {
    nameEl.textContent = name || "Your name";
  }

  // 5b) Wire the "i" info button to open the info popup
  const infoBtn = overlay.querySelector(".info-icon");
  infoBtn?.addEventListener("click", (e) => {
    e.preventDefault();
    showInfoModal();
  });

  // Removed: const locEl = document.getElementById("profileLocation"); if (locEl) locEl.textContent = "Location: GB";
  // This is now handled by renderProfileLocation called by listeners.

  // 6) Handlers
  closeBtn?.addEventListener("click", closeMenu);

  overlay.addEventListener("click", (e) => {
    // click outside the panel closes
    if (e.target === overlay) closeMenu();
  });

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") closeMenu();
  });

  overlay.addEventListener("click", (e) => {
    const a = e.target.closest("a,[data-route],[data-close-menu]");
    if (a) closeMenu();
  });
}

// ---- Event listeners for location updates and rendering ----

// A) When the app fires our custom "location:updated" event (IP seed or precise GPS)
document.addEventListener("location:updated", renderProfileLocation);

// B) When pages/partials are shown (your app’s nav lifecycle).
// If your app emits 'page:shown' with detail.pageId === 'menu' (or similar),
// update when the menu overlay appears.
document.addEventListener("page:shown", (e) => {
  // If you know the page/overlay id, check it here; otherwise just render if the node exists.
  // Example guard (adjust to your real page id if you have one):
  // if (e.detail?.pageId !== 'menu') return;
  renderProfileLocation();
});

// C) Also try right after DOM is ready (covers cases where menu HTML is already in DOM)
document.addEventListener("DOMContentLoaded", renderProfileLocation);

/**
 * Opens the global overlay menu.
 * Adds a 'data-menu-open' attribute to the body and removes the 'hidden' class from the overlay.
 */
export function openMenu() {
  if (!overlay) return;

  const nameEl = overlay.querySelector("#menuUsername");
  const name = (localStorage.getItem("username") || "").trim();
  if (nameEl) {
    nameEl.textContent = name || "Your name";
  }

  // D) Call renderProfileLocation at the end of openMenu()
  renderProfileLocation();

  document.body.setAttribute("data-menu-open", "true");
  overlay.classList.remove("hidden");
}

/**
 * Closes the global overlay menu.
 * Removes the 'data-menu-open' attribute from the body and adds the 'hidden' class to the overlay.
 */
export function closeMenu() {
  if (!overlay) return;
  document.body.removeAttribute("data-menu-open");
  overlay.classList.add("hidden");
}

function showInfoModal() {
  // Prevent duplicates
  if (document.getElementById("infoModalOverlay")) return;

  const modal = document.createElement("div");
  modal.id = "infoModalOverlay";
  modal.setAttribute("role", "dialog");
  modal.setAttribute("aria-modal", "true");
  modal.setAttribute("aria-labelledby", "infoModalTitle");

  modal.innerHTML = `
    <div class="guest-modal">
      <button class="guest-modal__close" aria-label="Close">&times;</button>
      <h2 id="infoModalTitle" class="guest-modal__title">About location data</h2>
      <p class="guest-modal__text">
        Location data helps us understand usage and improve Arclight App. Your IP address provides an approximate
        country/city on first load. <br> You can optionally provide more precise GPS data using the 'Check Location'
        button. This data is handled as per our privacy guidelines.
      </p>
       </div>
  `;

  document.body.appendChild(modal);

  const close = () => {
    modal.classList.add("fade-out");
    setTimeout(() => modal.remove(), 250); // match guest modal timing
  };

  // Close on ×, OK, or clicking the dim background
  modal.querySelector(".guest-modal__close")?.addEventListener("click", close);
  modal.querySelector(".guest-modal__cta")?.addEventListener("click", close);
  modal.addEventListener("click", (e) => {
    if (e.target === modal) close();
  });
}
