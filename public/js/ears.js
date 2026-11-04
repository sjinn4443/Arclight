/** Ears catalog navigation and carousel controls. */
import { loadPage } from "./navigation.js";
import { openMenu } from "./menu.js";

function initializeCarousel(carousel) {
  const cards = Array.from(carousel.querySelectorAll(".eyes-card"));
  if (cards.length < 2) return;

  const dots = document.createElement("span");
  dots.className = "carousel-dots";
  cards.forEach((card, index) => {
    const dot = document.createElement("button");
    dot.type = "button";
    dot.className = "dot";
    const prefix =
      window.I18N?.t?.("i18nExtra.eyes_go_to_item") || "Go to item";
    dot.setAttribute("aria-label", `${prefix} ${index + 1}`);
    dot.addEventListener("click", () => {
      const rtl = getComputedStyle(carousel).direction === "rtl";
      const maxScroll = carousel.scrollWidth - carousel.clientWidth;
      const left =
        index === 0
          ? 0
          : index === cards.length - 1
            ? rtl
              ? -maxScroll
              : maxScroll
            : carousel.scrollLeft +
              card.getBoundingClientRect().left -
              carousel.getBoundingClientRect().left -
              (carousel.clientWidth - card.offsetWidth) / 2;
      carousel.scrollTo({ left, behavior: "smooth" });
    });
    dots.appendChild(dot);
  });
  carousel.previousElementSibling.appendChild(dots);

  const updateDots = () => {
    const maxScroll = carousel.scrollWidth - carousel.clientWidth;
    const position = Math.abs(carousel.scrollLeft);
    const bounds = carousel.getBoundingClientRect();
    const center = bounds.left + bounds.width / 2;
    let active = 0;
    if (position >= maxScroll - 2 && maxScroll > 0) {
      active = cards.length - 1;
    } else if (position > 2) {
      let distance = Infinity;
      cards.forEach((card, index) => {
        const rect = card.getBoundingClientRect();
        const nextDistance = Math.abs(rect.left + rect.width / 2 - center);
        if (nextDistance < distance) {
          distance = nextDistance;
          active = index;
        }
      });
    }
    Array.from(dots.children).forEach((dot, index) => {
      dot.classList.toggle("active", index === active);
      dot.setAttribute("aria-pressed", String(index === active));
    });
  };
  carousel.addEventListener("scroll", updateDots, { passive: true });
  updateDots();

  // Touch scrolling is native; mouse users can drag the empty slots as in Eyes.
  let drag = null;
  carousel.addEventListener("pointerdown", (event) => {
    if (event.pointerType !== "mouse" || event.button !== 0) return;
    drag = { id: event.pointerId, x: event.clientX, left: carousel.scrollLeft };
  });
  carousel.addEventListener("pointermove", (event) => {
    if (!drag || drag.id !== event.pointerId) return;
    const delta = event.clientX - drag.x;
    if (Math.abs(delta) < 5 && !carousel.hasPointerCapture(drag.id)) return;
    carousel.setPointerCapture(drag.id);
    carousel.classList.add("is-pointer-dragging");
    carousel.scrollLeft = drag.left - delta;
    event.preventDefault();
  });
  const endDrag = () => {
    if (drag && carousel.hasPointerCapture(drag.id)) {
      carousel.releasePointerCapture(drag.id);
    }
    drag = null;
    carousel.classList.remove("is-pointer-dragging");
  };
  carousel.addEventListener("pointerup", endDrag);
  carousel.addEventListener("pointercancel", endDrag);
  carousel.addEventListener("lostpointercapture", endDrag);
  carousel.addEventListener("pointerleave", () => {
    if (drag && !carousel.hasPointerCapture(drag.id)) endDrag();
  });
}

export function initializeEars() {
  const page = document.getElementById("earsCatalogPage");
  if (!page || page.dataset.earsInitialized === "true") return;
  page.dataset.earsInitialized = "true";

  const menu = page.querySelector(".menuBtn");
  menu?.addEventListener("click", () => openMenu());
  menu?.addEventListener("keydown", (event) => {
    if (event.key !== "Enter" && event.key !== " ") return;
    event.preventDefault();
    openMenu();
  });
  page.querySelectorAll(".eyes-carousel").forEach(initializeCarousel);
  page.querySelector(".eyes-card__open")?.addEventListener("click", () => {
    loadPage("primaryEarCareWorkshop");
  });
  window.I18N?.applyTranslations?.(page);
}
