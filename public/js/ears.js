/** Ears catalog navigation and carousel controls. */
import { loadPage } from "./navigation.js";
import { openMenu } from "./menu.js";
import {
  EAR_CATALOG,
  EAR_TOPICS,
  EAR_LESSONS,
  earTitle,
} from "./earsContentData.js";

function renderCatalog(page) {
  for (const [id, routes] of Object.entries(EAR_CATALOG)) {
    const carousel = page.querySelector(`#${id}`);
    carousel.replaceChildren();
    for (const route of routes) {
      const topic = EAR_TOPICS[route];
      const label = topic
        ? earTitle(route)
        : window.I18N?.t?.("ears.pecWorkshopTitle", "PEC workshop") ||
          "PEC workshop";
      const card = document.createElement("div");
      card.className = "eyes-card eyes-card--blank-black";
      card.dataset.target = route;
      card.dataset.label = label;
      const open = document.createElement("button");
      open.type = "button";
      open.className = "eyes-card__open";
      open.setAttribute("aria-label", label);
      open.dataset.i18n = `${topic ? `ears.content.${route}` : "ears.pecWorkshopTitle"}:aria-label`;
      open.addEventListener("click", () => loadPage(route));
      const title = document.createElement("span");
      title.className = "eyes-card__title";
      title.dataset.i18n = topic
        ? `ears.content.${route}`
        : "ears.pecWorkshopTitle";
      title.textContent = label;
      if (topic?.image) {
        const image = document.createElement("img");
        image.className = "ear-card-art";
        image.src = topic.image;
        image.alt = "";
        image.loading = "lazy";
        card.append(image);
      }
      const tags = document.createElement("div");
      tags.className = "tag-row";
      const types = topic
        ? [
            ...new Set(
              topic.groups
                .flatMap((group) => group.lessons)
                .map((id) => EAR_LESSONS[id].type),
            ),
          ]
        : ["scroll"];
      const labels = types.map((type) =>
        type === "pdf"
          ? "PDF"
          : type === "video"
            ? "Video"
            : type === "download"
              ? "Slides"
              : "Scroll",
      );
      [...new Set(labels)].slice(0, 3).forEach((label) => {
        const tag = document.createElement("span");
        tag.className = "tag";
        tag.textContent = label;
        if (label !== "Slides")
          tag.dataset.i18n = `eyes.tag_${label.toLowerCase()}`;
        tags.append(tag);
      });
      card.append(open, title, tags);
      carousel.append(card);
    }
  }
}

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
  carousel.addEventListener(
    "scroll",
    () => {
      updateDots();
      try {
        sessionStorage.setItem(
          `ears:carousel:${carousel.id}`,
          String(carousel.scrollLeft),
        );
      } catch {
        /* Optional. */
      }
    },
    { passive: true },
  );
  updateDots();
  requestAnimationFrame(() => {
    try {
      carousel.scrollLeft =
        Number(sessionStorage.getItem(`ears:carousel:${carousel.id}`)) || 0;
    } catch {
      /* Optional. */
    }
    updateDots();
  });

  // Touch scrolling is native; mouse users can drag the empty slots as in Eyes.
  let drag = null;
  let suppressClick = false;
  carousel.addEventListener(
    "click",
    (event) => {
      if (!suppressClick) return;
      suppressClick = false;
      event.preventDefault();
      event.stopImmediatePropagation();
    },
    { capture: true },
  );
  carousel.addEventListener("pointerdown", (event) => {
    if (event.pointerType !== "mouse" || event.button !== 0) return;
    suppressClick = false;
    drag = { id: event.pointerId, x: event.clientX, left: carousel.scrollLeft };
  });
  carousel.addEventListener("pointermove", (event) => {
    if (!drag || drag.id !== event.pointerId) return;
    const delta = event.clientX - drag.x;
    if (Math.abs(delta) < 5 && !carousel.hasPointerCapture(drag.id)) return;
    carousel.setPointerCapture(drag.id);
    suppressClick = true;
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
  renderCatalog(page);

  const menu = page.querySelector(".menuBtn");
  menu?.addEventListener("click", () => openMenu());
  menu?.addEventListener("keydown", (event) => {
    if (event.key !== "Enter" && event.key !== " ") return;
    event.preventDefault();
    openMenu();
  });
  page.querySelectorAll(".eyes-carousel").forEach(initializeCarousel);
  window.I18N?.applyTranslations?.(page);
}
