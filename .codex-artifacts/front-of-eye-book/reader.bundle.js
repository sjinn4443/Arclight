// public/js/lessonCompletionTick.js
var FOLDER_LEVEL_COLOURS = Object.freeze({
  primary: "#15e115",
  intermediate: "#f25600",
  advanced: "#e41e26",
});

// public/js/lessonProgress.js
var LESSON_PROGRESS_PREFIX = "lessonProgress:";
var LESSON_PROGRESS_EVENT = "arclight:lesson-progress-changed";
function clampProgressPercent(value) {
  const n = Number(value);
  if (!Number.isFinite(n)) return 0;
  return Math.max(0, Math.min(100, n));
}
function clampProgressTimestamp(value) {
  const n = Number(value);
  if (!Number.isFinite(n) || n <= 0) return 0;
  return Math.round(n);
}
function readJSON(key) {
  try {
    return JSON.parse(localStorage.getItem(key) || "null");
  } catch {
    return null;
  }
}
function writeJSON(key, value) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {}
}
function normalizeProgressRecord(record) {
  return {
    percent: clampProgressPercent(record?.percent),
    updatedAt: clampProgressTimestamp(record?.updatedAt),
  };
}
function setLessonProgress(
  target,
  percent,
  { mode = "max", prefix = LESSON_PROGRESS_PREFIX } = {},
) {
  if (!target) return 0;
  const key = `${prefix}${target}`;
  const previousRaw = readJSON(key) || {};
  const previous = normalizeProgressRecord(previousRaw);
  const next = clampProgressPercent(percent);
  const finalPercent =
    mode === "replace" ? next : Math.max(previous.percent, next);
  if (
    finalPercent !== previous.percent ||
    !Number.isFinite(Number(previousRaw.percent)) ||
    finalPercent >= 100
  ) {
    writeJSON(key, {
      percent: finalPercent,
      updatedAt: Date.now(),
    });
  }
  document.dispatchEvent(
    new CustomEvent(LESSON_PROGRESS_EVENT, {
      detail: {
        target,
        percent: finalPercent,
        advanced: next > previous.percent,
      },
    }),
  );
  return finalPercent;
}

// public/js/frontOfEyePdfTest.js
var ASSET_ROOT = "images/pdf/Workshop/CoreExamination/front-of-eye-book/";
var BOOKMARK_KEY = "frontOfEyePdfTest:page";
var SECTIONS = [
  "Observation and Magnified Examination",
  "Anterior Chamber Depth",
  "Fluorescein Corneal Staining and Upper Eyelid Eversion",
];
var PAGES = [
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
function initializeFrontOfEyePdfTest() {
  const page = document.getElementById("frontOfEyePdfTestPage");
  if (!page || page.dataset.bookReady) return;
  page.dataset.bookReady = "true";
  const heading = page.querySelector("#foeBookHeading");
  const panels = page.querySelector(".foe-book__panels");
  const sectionHeading = page.querySelector("#foeBookSection");
  const previous = page.querySelector("[data-book-previous]");
  const next = page.querySelector("[data-book-next]");
  const zoom = page.querySelector("dialog");
  const sectionButtons = SECTIONS.map((title, section) => {
    const button = document.createElement("button");
    button.type = "button";
    button.textContent = String(section + 1);
    button.setAttribute("aria-label", `Section ${section + 1}: ${title}`);
    button.addEventListener("click", () => {
      index = PAGES.findIndex((item) => item.section === section);
      render(true);
    });
    return button;
  });
  page.querySelector(".foe-book__sections").replaceChildren(...sectionButtons);
  let index = 0;
  try {
    const saved = Number(sessionStorage.getItem(BOOKMARK_KEY));
    if (Number.isInteger(saved) && saved >= 0 && saved < PAGES.length)
      index = saved;
  } catch {}
  function render(moveFocus = false) {
    const current = PAGES[index];
    const sectionPages = PAGES.filter(
      (item) => item.section === current.section,
    );
    const sectionIndex = sectionPages.indexOf(current);
    heading.textContent = current.title;
    sectionHeading.textContent = SECTIONS[current.section];
    sectionButtons.forEach((button, section) => {
      if (section === current.section)
        button.setAttribute("aria-current", "true");
      else button.removeAttribute("aria-current");
    });
    page.querySelector(".foe-book__position").textContent =
      `Section ${current.section + 1} of ${SECTIONS.length} \xB7 ${sectionIndex + 1} of ${sectionPages.length} \xB7 Page ${index + 1} of ${PAGES.length}`;
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
    } catch {}
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
  page.addEventListener("keydown", (event) => {
    if (zoom.open || event.altKey || event.ctrlKey || event.metaKey) return;
    if (event.key !== "ArrowRight" && event.key !== "ArrowLeft") return;
    event.preventDefault();
    turnPage(event.key === "ArrowRight" ? 1 : -1);
  });
  render();
}
export { initializeFrontOfEyePdfTest };
