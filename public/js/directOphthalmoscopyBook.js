import { sections, pages } from "./directOphthalmoscopyBookData.js";
import { setLessonProgress } from "./lessonProgress.js";

const bookmark = "directOphthalmoscopyMobile:page";
const assetRoot = "images/pdf/Workshop/DO/mobile/";

export function initializeDirectOphthalmoscopyBook() {
  const page = document.getElementById("directOphthalmoscopyMobilePage");
  if (!page || page.dataset.bookReady) return;
  page.dataset.bookReady = "true";
  const heading = page.querySelector("h1");
  const sectionTitle = page.querySelector("h2");
  const chooser = page.querySelector(".foe-book__sections");
  const previous = page.querySelector("[data-book-previous]");
  const next = page.querySelector("[data-book-next]");
  const zoom = page.querySelector("dialog");
  let opener;
  zoom.addEventListener("close", () => opener?.focus({ preventScroll: true }));
  const enlarged = zoom.querySelector("img");
  const magnify = zoom.querySelector("[data-book-magnify]");
  const detail = zoom.querySelector(".direct-book-detail");
  function setMagnification(on) {
    magnify.setAttribute("aria-pressed", String(on));
    magnify.textContent = on ? "Fit image" : "Zoom in";
    detail.classList.toggle("is-magnified", on);
    detail.scrollTo(0, 0);
  }
  magnify.onclick = () =>
    setMagnification(!detail.classList.contains("is-magnified"));
  const panels = page.querySelector(".foe-book__panels");
  const sectionButtons = sections.map((title, section) => {
    const button = document.createElement("button");
    button.type = "button";
    button.textContent = String(section + 1);
    button.setAttribute("aria-label", `Section ${section + 1}: ${title}`);
    button.onclick = () =>
      render(pages.findIndex((p) => p.section === section));
    return button;
  });
  chooser.replaceChildren(...sectionButtons);
  let index = 0;
  try {
    const value = Number(sessionStorage.getItem(bookmark));
    if (Number.isInteger(value) && pages[value]) index = value;
  } catch {
    // Reading and turning pages also work with storage disabled.
  }

  function render(target, focus = true) {
    if (!pages[target]) return;
    index = target;
    const { title, section, panels: illustrations } = pages[index];
    heading.textContent = title;
    sectionTitle.textContent = sections[section];
    sectionButtons.forEach((button, i) => {
      if (i === section) button.setAttribute("aria-current", "true");
      else button.removeAttribute("aria-current");
    });
    const position = `Page ${index + 1} of ${pages.length}`;
    page.querySelector(".foe-book__position").textContent =
      `Section ${section + 1} of ${sections.length} · ${position}`;
    page.querySelector(".foe-book__page-number").textContent = position;
    panels.replaceChildren(
      ...illustrations.map(([name, alt]) => {
        const button = document.createElement("button");
        button.type = "button";
        button.className = "foe-book__image";
        button.setAttribute("aria-label", `Enlarge: ${alt}`);
        const img = document.createElement("img");
        img.alt = alt;
        img.src = assetRoot + name + "-hd.webp";
        button.append(img);
        button.onclick = () => {
          opener = button;
          enlarged.src = img.src;
          enlarged.alt = alt;
          setMagnification(false);
          zoom.showModal();
        };
        return button;
      }),
    );
    previous.disabled = index === 0;
    next.disabled = index === pages.length - 1;
    try {
      sessionStorage.setItem(bookmark, String(index));
    } catch {
      // Keep the current page in memory.
    }
    setLessonProgress(page.id, (100 * (index + 1)) / pages.length);
    if (focus) {
      heading.focus({ preventScroll: true });
      heading.closest(".foe-book").scrollIntoView({ block: "start" });
    }
  }
  previous.onclick = () => render(index - 1);
  next.onclick = () => render(index + 1);
  page.addEventListener("keydown", (event) => {
    if (zoom.open || event.altKey || event.ctrlKey || event.metaKey) return;
    if (event.key === "ArrowLeft" || event.key === "ArrowRight") {
      event.preventDefault();
      render(index + (event.key === "ArrowRight" ? 1 : -1));
    }
  });
  render(index, false);
}
