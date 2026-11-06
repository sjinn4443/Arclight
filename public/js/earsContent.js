import {
  EAR_LESSONS,
  EAR_TOPICS,
  EAR_LESSON_PARENTS,
  earTitle,
} from "./earsContentData.js";
import { loadPage } from "./navigation.js";
import {
  setLessonProgress,
  updateLessonProgressRows,
  LESSON_PROGRESS_EVENT,
} from "./lessonProgress.js";

let manifestRequest;
let cleanupActive = () => {};
const text = (key, fallback) => window.I18N?.t?.(key, fallback) || fallback;
const sourceText = (value) =>
  window.I18N?.translateLiteral?.(value, value) || value;
const create = (tag, className, content) => {
  const node = document.createElement(tag);
  if (className) node.className = className;
  if (content) node.textContent = content;
  return node;
};
function translated(node, key, fallback) {
  node.dataset.i18n = key;
  node.textContent = text(key, fallback);
  return node;
}
function loadManifest() {
  if (!manifestRequest) {
    manifestRequest = fetch("/data/ears-assets.json")
      .then((response) => {
        if (!response.ok) throw new Error("Ears materials unavailable");
        return response.json();
      })
      .catch((error) => {
        manifestRequest = null;
        throw error;
      });
  }
  return manifestRequest;
}
function button(label, action, className = "") {
  const node = create("button", className, label);
  node.type = "button";
  node.addEventListener("click", action);
  return node;
}
function renderTopic(route, root) {
  const levels = create("div", "pupils-levels");
  EAR_TOPICS[route].groups.forEach((group, index) => {
    if (index > 0) {
      const dots = create("div", "pupils-dots");
      dots.setAttribute("aria-hidden", "true");
      dots.append(create("span"), create("span"));
      levels.append(dots);
    }
    const section = create(
      "section",
      `pupil-level pupil-level--${group.level}`,
    );
    const cap = translated(
      create("div", "pupil-level__cap"),
      `auto.videos.${group.level}`,
      group.level === "primary" ? "Primary" : "Intermediate",
    );
    section.setAttribute("aria-label", cap.textContent);
    const list = create("div", "ear-lesson-list");
    group.lessons.forEach((id) => {
      const lesson = EAR_LESSONS[id];
      const type =
        lesson.type === "pdf" || lesson.type === "download"
          ? "pdf"
          : lesson.type === "video"
            ? "video"
            : "scrollytelling";
      const row = button(
        "",
        () => loadPage(id),
        `lesson-row lesson-row--${type}`,
      );
      row.dataset.target = id;
      row.dataset.route = id;
      const thumb = create("span", "thumb");
      thumb.setAttribute("aria-hidden", "true");
      const main = create("span", "lesson-main");
      const top = create("span", "lesson-top");
      const title = translated(
        create("span", "lesson-type"),
        `ears.content.${id}`,
        lesson.title,
      );
      title.id = `${id}-label`;
      top.append(title);
      if (lesson.duration)
        top.append(create("span", "lesson-meta", `| ${lesson.duration}`));
      row.title = earTitle(id);
      const progress = create("span", "lesson-progress");
      progress.setAttribute("role", "progressbar");
      progress.setAttribute("aria-labelledby", title.id);
      progress.setAttribute("aria-valuemin", "0");
      progress.setAttribute("aria-valuemax", "100");
      progress.setAttribute("aria-valuenow", "0");
      progress.append(create("span", "lesson-progress__fill"));
      main.append(top, progress);
      const cta = translated(
        create("span", "lesson-cta"),
        "primaryEarCareWorkshop.start",
        "Start >",
      );
      row.append(thumb, main, cta);
      list.append(row);
    });
    section.append(cap, list);
    levels.append(section);
  });
  root.append(levels);
  updateLessonProgressRows(root);
}

function renderFlow(route, root) {
  const parent = EAR_LESSON_PARENTS[route];
  const lessons =
    EAR_TOPICS[parent]?.groups.flatMap((group) => group.lessons) || [];
  const index = lessons.indexOf(route);
  const nav = create("nav", "ear-flow medical-next-wrap");
  nav.setAttribute(
    "aria-label",
    text("primaryEarCareWorkshop.lesson_navigation", "Lesson navigation"),
  );
  const previous = translated(
    button(
      "",
      () => loadPage(lessons[index - 1] || parent),
      "medical-prev-btn",
    ),
    "i18nLiteral.< Previous",
    "< Previous",
  );
  const next = translated(
    button(
      "",
      () => loadPage(lessons[index + 1] || parent),
      "medical-next-btn is-ready",
    ),
    "i18nLiteral.Next >",
    "Next >",
  );
  nav.append(previous, next);
  root.append(nav);
}

function openImage(image, signal) {
  const dialog = create("dialog", "ear-image-dialog");
  dialog.setAttribute("aria-label", image.alt);
  const tools = create("div", "ear-image-tools");
  const frame = create("div", "ear-image-frame");
  const preview = image.cloneNode();
  preview.loading = "eager";
  let zoom = 1;
  const out = button("−", () => {
    zoom = Math.max(1, zoom - 0.5);
    preview.style.width = `${100 * zoom}%`;
  });
  out.setAttribute("aria-label", text("ears.viewer.zoomOut", "Zoom out"));
  const enlarge = button("+", () => {
    zoom = Math.min(4, zoom + 0.5);
    preview.style.width = `${100 * zoom}%`;
  });
  enlarge.setAttribute("aria-label", text("ears.viewer.zoomIn", "Zoom in"));
  const close = button(text("primaryEarCareWorkshop.close", "Close"), () =>
    dialog.close(),
  );
  const onAbort = () => {
    dialog.close();
    dialog.remove();
  };
  signal.addEventListener("abort", onAbort, { once: true });
  dialog.addEventListener(
    "close",
    () => {
      signal.removeEventListener("abort", onAbort);
      dialog.remove();
    },
    { once: true },
  );
  tools.append(out, enlarge, close);
  frame.append(preview);
  dialog.append(tools, frame);
  document.body.append(dialog);
  dialog.showModal();
}

function renderGuide(route, root, sections, signal) {
  const lesson = create(
    "section",
    "diabetic-screening-lesson diabetic-screening-lesson--tight-hero",
  );
  const hero = create("header", "diabetic-screening-hero");
  const parent = EAR_LESSON_PARENTS[route];
  hero.append(
    translated(
      create("p", "diabetic-screening-eyebrow"),
      `ears.content.${parent}`,
      EAR_TOPICS[parent].title,
    ),
    translated(create("h2"), `ears.content.${route}`, EAR_LESSONS[route].title),
  );
  const stack = create("div", "ear-learning-stack diabetic-screening-stack");
  sections.forEach((section, index) => {
    const article = create(
      "article",
      "ear-learning-panel diabetic-screening-panel",
    );
    const copy = create("div", "diabetic-screening-panel__text");
    copy.append(
      create(
        "span",
        "ear-step diabetic-screening-step",
        String(index + 1).padStart(2, "0"),
      ),
    );
    if (section.title) copy.append(create("h3", "", sourceText(section.title)));
    if (section.text) copy.append(create("p", "", sourceText(section.text)));
    article.append(copy);
    if (section.image) {
      const figure = create("figure", "medical-learning-image");
      const image = create("img");
      image.src = section.image;
      image.alt = sourceText(
        section.caption || section.title || EAR_LESSONS[route].title,
      );
      image.loading = index === 0 ? "eager" : "lazy";
      const open = button(
        "",
        () => openImage(image, signal),
        "ear-figure-open",
      );
      open.setAttribute(
        "aria-label",
        `${text("ears.viewer.zoomIn", "Zoom in")}: ${image.alt}`,
      );
      open.append(image);
      figure.append(open);
      if (section.caption)
        figure.append(create("figcaption", "", sourceText(section.caption)));
      article.append(figure);
    }
    stack.append(article);
  });
  lesson.append(hero, stack);
  root.append(lesson);
  const seen = new Set();
  const observer = new IntersectionObserver(
    (entries) => {
      entries
        .filter((entry) => entry.isIntersecting)
        .forEach((entry) => {
          seen.add(entry.target);
          stack
            .querySelectorAll(".is-current")
            .forEach((panel) => panel.classList.remove("is-current"));
          entry.target.classList.add("is-current");
        });
      setLessonProgress(route, (seen.size / sections.length) * 100);
    },
    { threshold: 0.35 },
  );
  stack
    .querySelectorAll("article")
    .forEach((article) => observer.observe(article));
  signal.addEventListener("abort", () => observer.disconnect(), { once: true });
}

function renderDocument(route, root, lesson, manifest, signal) {
  const asset = manifest.documents[lesson.asset];
  if (!asset) throw new Error("Document unavailable");
  const pages = lesson.pages || asset.pages.map((_, index) => index + 1);
  const reader = create("section", "ear-reader");
  const toolbar = create("div", "ear-reader-toolbar");
  const frame = create("div", "ear-reader-frame");
  frame.tabIndex = 0;
  frame.setAttribute("role", "region");
  frame.setAttribute("aria-label", earTitle(route));
  const image = create("img");
  image.draggable = false;
  const status = create("p", "ear-reader-status");
  status.setAttribute("role", "status");
  const select = create("select");
  select.setAttribute("aria-label", text("ears.viewer.page", "Page"));
  pages.forEach((number) => {
    const option = create(
      "option",
      "",
      `${text("ears.viewer.page", "Page")} ${number}`,
    );
    option.value = String(number);
    select.append(option);
  });
  let position = 0;
  let zoom = 1;
  const seen = new Set();
  try {
    const remembered = Number(sessionStorage.getItem(`ears:reader:${route}`));
    if (pages.includes(remembered)) position = pages.indexOf(remembered);
    JSON.parse(
      localStorage.getItem(`ears:read-pages:${route}`) || "[]",
    ).forEach((page) => {
      if (pages.includes(page)) seen.add(page);
    });
  } catch {
    /* Reading stays available without storage. */
  }
  const paint = () => {
    const number = pages[position];
    image.alt = `${earTitle(route)} — ${text("ears.viewer.page", "Page")} ${number}`;
    image.src = asset.pages[number - 1];
    image.style.width = `${zoom * 100}%`;
    frame.scrollTop = 0;
    frame.scrollLeft = 0;
    select.value = String(number);
    previous.disabled = position === 0;
    next.disabled = position === pages.length - 1;
    status.textContent = `${position + 1} / ${pages.length} · ${text("ears.viewer.sourcePage", "Source page")} ${number}`;
    try {
      sessionStorage.setItem(`ears:reader:${route}`, String(number));
    } catch {
      /* Optional. */
    }
  };
  const previous = button(
    text("primaryEarCareWorkshop.previous", "Previous"),
    () => {
      position--;
      paint();
    },
  );
  const next = button(text("primaryEarCareWorkshop.next", "Next"), () => {
    position++;
    paint();
  });
  select.addEventListener("change", () => {
    position = pages.indexOf(Number(select.value));
    paint();
  });
  const zoomOut = button("−", () => {
    zoom = Math.max(1, zoom - 0.5);
    image.style.width = `${zoom * 100}%`;
  });
  zoomOut.setAttribute("aria-label", text("ears.viewer.zoomOut", "Zoom out"));
  const zoomIn = button("+", () => {
    zoom = Math.min(4, zoom + 0.5);
    image.style.width = `${zoom * 100}%`;
  });
  zoomIn.setAttribute("aria-label", text("ears.viewer.zoomIn", "Zoom in"));
  const download = create(
    "a",
    "",
    text("ears.viewer.download", "Download original"),
  );
  download.href = asset.pdf;
  download.download = "";
  image.addEventListener("load", () => {
    if (signal.aborted) return;
    seen.add(pages[position]);
    try {
      localStorage.setItem(
        `ears:read-pages:${route}`,
        JSON.stringify([...seen]),
      );
    } catch {
      /* Optional. */
    }
    setLessonProgress(route, (seen.size / pages.length) * 100);
  });
  image.addEventListener("error", () => {
    status.textContent = text(
      "ears.viewer.unavailable",
      "This page could not be loaded. Try again or download the original.",
    );
  });
  frame.addEventListener("keydown", (event) => {
    if (event.key === "ArrowRight" && !next.disabled) {
      event.preventDefault();
      next.click();
    }
    if (event.key === "ArrowLeft" && !previous.disabled) {
      event.preventDefault();
      previous.click();
    }
  });
  toolbar.append(previous, select, next, zoomOut, zoomIn, download);
  frame.append(image);
  reader.append(toolbar, frame, status);
  root.append(reader);
  paint();
}

function renderVideo(route, root, lesson, manifest, signal) {
  const sources = manifest.videos[lesson.asset];
  if (!sources) throw new Error("Video unavailable");
  const wrapper = create("div", "ear-video-wrap");
  const quality = create("div", "ear-quality tri-toggle");
  quality.setAttribute("role", "radiogroup");
  quality.setAttribute(
    "aria-label",
    text("i18nExtra.video_mode", "Video quality"),
  );
  const video = create("video");
  video.controls = true;
  video.playsInline = true;
  video.preload = "metadata";
  video.setAttribute("aria-label", earTitle(route));
  const status = create("p", "ear-reader-status");
  status.setAttribute("role", "status");
  let current = "low";
  let fallbackTried = false;
  try {
    current =
      localStorage.getItem(`videoMode:${route}`) === "high" ? "high" : "low";
  } catch {
    /* Default low. */
  }
  const apply = (mode) => {
    const time = video.currentTime || 0;
    const playing = !video.paused;
    current = mode;
    quality.dataset.active = mode;
    quality.querySelectorAll("button").forEach((button) => {
      const selected = button.dataset.mode === mode;
      button.setAttribute("aria-checked", String(selected));
      button.tabIndex = selected ? 0 : -1;
    });
    video.addEventListener(
      "loadedmetadata",
      () => {
        if (signal.aborted) return;
        video.currentTime = Math.min(
          time,
          Number.isFinite(video.duration) ? video.duration : time,
        );
        if (playing) video.play().catch(() => {});
      },
      { once: true, signal },
    );
    video.src = sources[mode];
    video.load();
    try {
      localStorage.setItem(`videoMode:${route}`, mode);
    } catch {
      /* Optional. */
    }
  };
  ["low", "high"].forEach((mode) => {
    const control = translated(
      button(
        "",
        () => {
          fallbackTried = false;
          apply(mode);
        },
        "tri-toggle__btn",
      ),
      `i18nExtra.video_mode_${mode}`,
      mode,
    );
    control.dataset.mode = mode;
    control.setAttribute("role", "radio");
    quality.append(control);
  });
  quality.append(create("div", "tri-toggle__knob"));
  quality.lastElementChild.setAttribute("aria-hidden", "true");
  quality.addEventListener("keydown", (event) => {
    if (!["ArrowLeft", "ArrowRight", "Home", "End"].includes(event.key)) return;
    event.preventDefault();
    const mode =
      event.key === "Home"
        ? "low"
        : event.key === "End"
          ? "high"
          : current === "low"
            ? "high"
            : "low";
    quality.querySelector(`[data-mode="${mode}"]`).click();
    quality.querySelector(`[data-mode="${mode}"]`).focus();
  });
  video.addEventListener(
    "timeupdate",
    () => {
      if (video.duration > 0)
        setLessonProgress(
          route,
          Math.min(99, (video.currentTime / video.duration) * 100),
        );
    },
    { signal },
  );
  video.addEventListener("ended", () => setLessonProgress(route, 100), {
    signal,
  });
  video.addEventListener(
    "error",
    () => {
      if (!fallbackTried) {
        fallbackTried = true;
        apply(current === "low" ? "high" : "low");
      } else
        status.textContent = text(
          "ears.viewer.videoUnavailable",
          "This video could not be loaded. Check your connection or downloaded content.",
        );
    },
    { signal },
  );
  signal.addEventListener(
    "abort",
    () => {
      video.pause();
      video.removeAttribute("src");
      video.load();
    },
    { once: true },
  );
  const icons = root.closest(".page").querySelector(".eyes-topbar__icons");
  icons.insertBefore(quality, icons.querySelector(".menuBtn"));
  signal.addEventListener("abort", () => quality.remove(), { once: true });
  const heading = create("div", "video-header");
  heading.append(
    translated(create("h3"), `ears.content.${route}`, lesson.title),
  );
  const container = create("div", "video-container");
  container.append(video);
  wrapper.append(heading, container, status);
  root.append(wrapper);
  apply(current);
}

export async function initializeEarsContent(route) {
  cleanupActive();
  const page = document.getElementById("earsContentPage");
  if (!page || (!EAR_TOPICS[route] && !EAR_LESSONS[route])) return;
  const controller = new AbortController();
  const { signal } = controller;
  cleanupActive = () => controller.abort();
  const root = page.querySelector(".ear-content-body");
  page.classList.toggle("ears-topic-page", Boolean(EAR_TOPICS[route]));
  const lessonType = EAR_LESSONS[route]?.type;
  const isGuide = lessonType === "scroll" || lessonType === "diagram";
  page.classList.toggle("ears-lesson-page", Boolean(lessonType));
  page.classList.toggle("ears-guide-page", isGuide);
  page.classList.toggle("ears-video-page", lessonType === "video");
  page.classList.toggle("ears-pdf-page", lessonType === "pdf");
  const container = page.querySelector(".container.pupils-container");
  container.classList.toggle("diabetic-screening-page", isGuide);
  container.classList.toggle(
    "medical-students-screening-page",
    Boolean(lessonType),
  );
  const group = EAR_TOPICS[EAR_LESSON_PARENTS[route]]?.groups.find((group) =>
    group.lessons.includes(route),
  );
  page.dataset.earLevel = group?.level || "primary";
  delete page.dataset.earReady;
  const menu = page.querySelector(".menuBtn");
  menu?.addEventListener(
    "keydown",
    (event) => {
      if (event.key === "Enter" || event.key === " ") {
        event.preventDefault();
        menu.click();
      }
    },
    { signal },
  );
  root.replaceChildren();
  translated(
    page.querySelector(".ear-content-title"),
    `ears.content.${route}`,
    EAR_TOPICS[route]?.title || EAR_LESSONS[route]?.title,
  );
  page.dataset.earRoute = route;
  if (EAR_TOPICS[route]) {
    renderTopic(route, root);
  } else {
    const lesson = EAR_LESSONS[route];
    try {
      if (lesson.type === "scroll")
        renderGuide(route, root, lesson.sections, signal);
      else if (lesson.type === "download") {
        const link = create(
          "a",
          "ear-download",
          text("ears.viewer.download", "Download original"),
        );
        link.href = lesson.asset;
        link.download = "";
        link.addEventListener("click", () => setLessonProgress(route, 100));
        root.append(link);
      } else {
        const manifest = await loadManifest();
        if (signal.aborted || !page.isConnected) return;
        if (lesson.type === "pdf")
          renderDocument(route, root, lesson, manifest, signal);
        else if (lesson.type === "video")
          renderVideo(route, root, lesson, manifest, signal);
        else if (lesson.type === "diagram") {
          const sections = (manifest.decks[lesson.asset] || []).map(
            (image, index) => ({
              image,
              title: lesson.captions[index] || lesson.title,
            }),
          );
          if (!sections.length) throw new Error("Diagrams unavailable");
          renderGuide(route, root, sections, signal);
        }
      }
    } catch {
      if (signal.aborted) return;
      const error = create("div", "ear-load-error");
      error.setAttribute("role", "alert");
      error.append(
        create(
          "p",
          "",
          text(
            "ears.viewer.unavailable",
            "This page could not be loaded. Try again or download the original.",
          ),
        ),
        button(text("ears.viewer.retry", "Try again"), () =>
          initializeEarsContent(route),
        ),
      );
      root.append(error);
    }
    renderFlow(route, root);
    root.append(create("p", "ear-source", lesson.source));
  }
  window.I18N?.applyTranslations?.(page);
  page.dataset.earReady = "true";
}

window.addEventListener("page:loaded", () => cleanupActive());
document.addEventListener(LESSON_PROGRESS_EVENT, () =>
  updateLessonProgressRows(document.getElementById("earsContentPage")),
);
