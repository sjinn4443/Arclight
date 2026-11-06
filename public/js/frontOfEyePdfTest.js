import { setLessonProgress } from "./lessonProgress.js";

const ASSET_ROOT = "images/pdf/Workshop/CoreExamination/front-of-eye-book/";
const BOOKMARK_KEY = "frontOfEyePdfTest:page";
const SECTIONS = [
  "Observation and Magnified Examination",
  "Anterior Chamber Depth",
  "Fluorescein Corneal Staining and Upper Eyelid Eversion",
];

// Crops preserve the original handout's reading order and all illustrations.
const PAGES = [
  {
    section: 0,
    title: "Observation and illumination",
    images: [
      ["observation", "Eyes shown in the observation panel"],
      ["illumination", "Arclight illumination and magnified examination"],
      ["eye-examination", "Examination of the eye and eyelids"],
    ],
  },
  {
    section: 0,
    title: "Magnified examination",
    images: [
      ["outer-eye", "Highlighted areas around the eye and eyelids"],
      ["inner-eye", "Highlighted areas of the front of the eye"],
    ],
  },
  {
    section: 0,
    title: "Clinical photographs",
    gallery: true,
    images: Array.from({ length: 12 }, (_, i) => [
      `clinical-${String(i + 1).padStart(2, "0")}`,
      `Clinical photograph ${i + 1} from the Front of Eye handout`,
    ]),
  },
  {
    section: 1,
    title: "Anterior Chamber Depth",
    images: [
      ["chamber-1", "Anterior chamber depth illustration with a green tick"],
      [
        "chamber-2",
        "Anterior chamber depth illustration with a red warning symbol",
      ],
    ],
  },
  {
    section: 2,
    title: "Fluorescein Corneal Staining",
    images: [
      ["fluorescein", "Fluorescein application illustrations"],
      ["blue-light", "Arclight blue light setting"],
      [
        "staining",
        "Corneal staining illustrations with the original result symbols",
      ],
    ],
  },
  {
    section: 2,
    title: "Upper Eyelid Eversion",
    images: [
      ["eversion-1", "Upper eyelid eversion: first illustration"],
      ["eversion-2", "Upper eyelid eversion: second illustration"],
      ["eversion-3", "Upper eyelid eversion: third illustration"],
      ["eversion-4", "Upper eyelid eversion: fourth illustration"],
    ],
  },
];

export function initializeFrontOfEyePdfTest() {
  const page = document.getElementById("frontOfEyePdfTestPage");
  if (!page || page.dataset.bookReady) return;
  page.dataset.bookReady = "true";

  const heading = page.querySelector("#foeBookHeading");
  const panels = page.querySelector(".foe-book__panels");
  const sectionSelect = page.querySelector("#foeBookSection");
  const previous = page.querySelector("[data-book-previous]");
  const next = page.querySelector("[data-book-next]");
  const zoom = page.querySelector("dialog");
  let index = 0;
  try {
    const saved = Number(sessionStorage.getItem(BOOKMARK_KEY));
    if (Number.isInteger(saved) && saved >= 0 && saved < PAGES.length)
      index = saved;
  } catch {
    /* Reading remains available when storage is blocked. */
  }

  function render(moveFocus = false) {
    const current = PAGES[index];
    const sectionPages = PAGES.filter(
      (item) => item.section === current.section,
    );
    const sectionIndex = sectionPages.indexOf(current);
    heading.textContent = current.title;
    sectionSelect.value = String(
      PAGES.findIndex((item) => item.section === current.section),
    );
    page.querySelector(".foe-book__position").textContent =
      `Section ${current.section + 1} of ${SECTIONS.length} · ${sectionIndex + 1} of ${sectionPages.length} · Page ${index + 1} of ${PAGES.length}`;
    page.querySelector(".foe-book__page-number").textContent =
      `${index + 1} / ${PAGES.length}`;
    panels.classList.toggle(
      "foe-book__panels--gallery",
      Boolean(current.gallery),
    );
    panels.replaceChildren(
      ...current.images.map(([name, alt]) => {
        const button = document.createElement("button");
        button.type = "button";
        button.className = "foe-book__image";
        button.setAttribute("aria-label", `Enlarge: ${alt}`);
        const img = document.createElement("img");
        img.src = `${ASSET_ROOT}${name}-hd.webp`;
        img.alt = alt;
        img.draggable = false;
        button.append(img);
        button.addEventListener("click", () => {
          const enlarged = zoom.querySelector("img");
          enlarged.src = img.src;
          enlarged.alt = img.alt;
          zoom.showModal();
        });
        return button;
      }),
    );
    previous.disabled = index === 0;
    next.disabled = index === PAGES.length - 1;
    try {
      sessionStorage.setItem(BOOKMARK_KEY, String(index));
    } catch {
      /* Optional bookmark. */
    }
    setLessonProgress(
      "frontOfEyePdfTestPage",
      ((index + 1) / PAGES.length) * 100,
    );
    if (moveFocus) {
      heading.focus({ preventScroll: true });
      window.scrollTo({ top: 0, behavior: "instant" });
    }
  }

  function turnPage(direction) {
    const target = index + direction;
    if (target < 0 || target >= PAGES.length) return;
    index = target;
    render(true);
  }

  previous.addEventListener("click", () => turnPage(-1));
  next.addEventListener("click", () => turnPage(1));
  sectionSelect.addEventListener("change", () => {
    index = Number(sectionSelect.value);
    render(true);
  });
  page.addEventListener("keydown", (event) => {
    if (
      zoom.open ||
      event.target.closest("select") ||
      event.altKey ||
      event.ctrlKey ||
      event.metaKey
    )
      return;
    if (event.key !== "ArrowRight" && event.key !== "ArrowLeft") return;
    event.preventDefault();
    turnPage(event.key === "ArrowRight" ? 1 : -1);
  });
  render();
}
