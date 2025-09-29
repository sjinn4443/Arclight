/**
 * @fileoverview This file manages the application's global overlay menu. Handles menu initialization, opening, and closing, including fetching menu content and setting up event listeners.
 */

let overlay, closeBtn;

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
