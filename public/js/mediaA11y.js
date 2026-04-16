function isDecorativeVideo(el) {
  return (
    el &&
    typeof el.hasAttribute === "function" &&
    !el.hasAttribute("controls") &&
    el.hasAttribute("autoplay") &&
    el.hasAttribute("muted") &&
    el.hasAttribute("loop")
  );
}

function hasAccessibleName(el) {
  return Boolean(
    el.getAttribute("aria-label") ||
    el.getAttribute("aria-labelledby") ||
    el.getAttribute("title"),
  );
}

function ensureId(el, prefix = "media-label") {
  if (el.id) return el.id;
  const suffix = Math.random().toString(36).slice(2, 10);
  el.id = `${prefix}-${suffix}`;
  return el.id;
}

function getLabelElement(el) {
  const directContainer = el.closest(
    ".video-container, .pdf-container, .intro-hero-frame, figure, .card, .lesson-card, .container",
  );

  const candidates = [
    directContainer?.previousElementSibling,
    directContainer,
    el.parentElement?.previousElementSibling,
    el.parentElement,
    el.closest(".page"),
  ].filter(Boolean);

  for (const candidate of candidates) {
    const labelEl = candidate.querySelector?.(
      "[data-a11y-media-label], figcaption, h1, h2, h3, h4, h5, h6, .video-title, .page-title, .eyes-topbar__title, .pupils-subtitle",
    );
    if (labelEl && (labelEl.textContent || "").trim()) return labelEl;
  }

  const fallbackLabel = el.ownerDocument?.querySelector?.(
    "[data-a11y-media-label], h1, h2, h3, .page-title, .eyes-topbar__title",
  );
  return fallbackLabel && (fallbackLabel.textContent || "").trim()
    ? fallbackLabel
    : null;
}

function applyMediaLabel(el, prefix) {
  if (hasAccessibleName(el)) return;

  const labelEl = getLabelElement(el);
  if (labelEl) {
    el.setAttribute("aria-labelledby", ensureId(labelEl, prefix));
    return;
  }

  if (el.tagName === "VIDEO" && isDecorativeVideo(el)) {
    el.setAttribute("aria-hidden", "true");
    el.setAttribute("tabindex", "-1");
  }
}

function applyImageAlt(el) {
  if (el.hasAttribute("alt") || el.hasAttribute("aria-label")) return;

  const labelEl = getLabelElement(el);
  if (labelEl) {
    const text = (labelEl.textContent || "").replace(/\s+/g, " ").trim();
    if (text) el.setAttribute("alt", text);
  }
}

export function applyMediaA11y(root = document) {
  if (!root || typeof root.querySelectorAll !== "function") return;

  root.querySelectorAll("video, iframe").forEach((el) => {
    applyMediaLabel(el, "media-heading");
  });

  root.querySelectorAll("img").forEach((el) => {
    applyImageAlt(el);
  });
}
