import { loadPage } from "./navigation.js";

const TOPBAR_TITLE_SELECTOR =
  ".eyes-topbar__title, #eyesCatalogPage .eyes-title";

function createTopbarLogoLink() {
  const link = document.createElement("a");
  link.className = "topbar-home-logo";
  link.href = "#/dashboard";
  link.dataset.route = "dashboard";
  link.setAttribute("aria-label", "Go to dashboard");
  link.addEventListener("click", (event) => {
    event.preventDefault();
    event.stopPropagation();
    void loadPage("dashboard");
  });

  const image = document.createElement("img");
  image.className = "topbar-home-logo__image";
  image.src = "images/logo/pwainstall.png";
  image.alt = "Arclight Project";
  image.decoding = "async";

  link.appendChild(image);
  return link;
}

function applyTopbarLogo(title) {
  if (!(title instanceof Element)) return;
  if (title.querySelector(":scope > .topbar-home-logo")) return;

  title.removeAttribute("data-i18n");
  title.setAttribute("data-i18n-skip", "");
  title.replaceChildren(createTopbarLogoLink());
}

export function applyTopbarLogos(root = document) {
  if (!root?.querySelectorAll) return;

  if (root.matches?.(TOPBAR_TITLE_SELECTOR)) applyTopbarLogo(root);
  root.querySelectorAll(TOPBAR_TITLE_SELECTOR).forEach(applyTopbarLogo);
}

export function initializeTopbarLogos() {
  applyTopbarLogos(document);

  document.addEventListener("page:shown", (event) => {
    const shownPage = document.getElementById(String(event.detail?.id || ""));
    applyTopbarLogos(shownPage || document);
  });

  window.addEventListener("page:loaded", () => applyTopbarLogos(document));
  window.addEventListener("page:rendered", () => applyTopbarLogos(document));

  const observer = new MutationObserver((mutations) => {
    for (const mutation of mutations) {
      if (mutation.type === "childList") {
        applyTopbarLogos(mutation.target);
        mutation.addedNodes.forEach((node) => applyTopbarLogos(node));
      }
    }
  });

  observer.observe(document.body, { childList: true, subtree: true });
}
