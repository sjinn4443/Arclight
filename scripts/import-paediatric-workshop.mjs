// Rebuild source-derived HTML, or additionally import extracted ppt/media PNGs.
// node scripts/import-paediatric-workshop.mjs [extracted-ppt-media-directory]
import fs from "node:fs/promises";
import path from "node:path";
import sharp from "sharp";
import {
  PAEDIATRIC_PAGE,
  PAEDIATRIC_TITLE,
  PAEDIATRIC_COPY as copy,
  PAEDIATRIC_FOLDERS,
  PAEDIATRIC_LOCAL_PAGES,
  PAEDIATRIC_EAR_IMAGES,
  PAEDIATRIC_OBJECTIVE_ILLUSTRATIONS,
} from "../public/js/paediatricWorkshopData.js";

const escape = (value) =>
  String(value)
    .replaceAll("&", "&amp;")
    .replaceAll('"', "&quot;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;");
const text = (tag, key, attrs = "") =>
  `<${tag} data-paediatric-copy="${key}" ${attrs}>${escape(copy[key])}</${tag}>`;
const menu = `<span class="icon menuBtn" role="button" tabindex="0" aria-label="Menu" data-i18n="i18nExtra.menu_aria_label:aria-label">&#9776;</span>`;
const topbar = (key = "title") =>
  `<div class="eyes-topbar">${text("div", key, 'class="eyes-topbar__title"')}<div class="eyes-topbar__icons">${menu}</div></div>`;

function row(entry, folder = false, nested = false) {
  const type = folder ? "folder" : entry.type;
  const data = folder
    ? `class="lesson-row lesson-row--folder ${nested ? "pec-nested-folder-row" : "pec-folder-row"}" data-${nested ? "nested-folder" : "folder"}="${entry.id}" aria-expanded="false" aria-controls="paediatric-folder-${entry.id}"`
    : `class="lesson-row lesson-row--${type}" data-paediatric-lesson="${entry.id}"${entry.unavailable ? ' aria-disabled="true"' : ` data-lesson="${entry.id}" data-target="${entry.target}"${entry.route === "paediatricSurgicalEyeEarWorkshop" ? ` data-primary-progress-target="${entry.target}"` : entry.earLesson ? "" : ` data-primary-progress-target="${entry.target}"`}`}`;
  const title = `paediatric-title-${entry.id}`;
  const ctaKey = folder ? "seeAll" : "videos.startCta";
  const bar = !folder
    ? `<div class="lesson-progress" role="progressbar" aria-labelledby="${title}" aria-valuemin="0" aria-valuemax="100" aria-valuenow="0"><div class="lesson-progress__fill"></div></div>`
    : "";
  return `<div ${data} role="button" tabindex="${entry.unavailable ? -1 : 0}"><div class="thumb" aria-hidden="true"></div><div class="lesson-main"><div class="lesson-top">${text("span", entry.label, `class="lesson-type" id="${title}"`)}${entry.unavailable ? text("span", "coming_soon", 'class="paediatric-coming-soon"') : ""}</div>${bar}</div>${entry.unavailable ? '<span class="lesson-cta" aria-hidden="true">Watch &gt;</span>' : `<span class="lesson-cta" ${type === "video" ? 'data-paediatric-common="watch"' : `data-i18n="${ctaKey}"`}>${folder ? "See all >" : type === "video" ? "Watch >" : "Start >"}</span>`}</div>`;
}
function card(section, nested = false) {
  const key = nested ? "nested-section" : "section";
  return `<div class="${nested ? "pec-nested-section-card" : "pec-section-card"}" id="paediatric-folder-${section.id}" data-${key}="${section.id}" hidden><h3>${text("span", section.label)}<button type="button" class="see-all-toggle" data-paediatric-close="${section.id}" data-i18n="i18nLiteral.Close ^">Close ^</button></h3>${section.lessons.map((entry) => row(entry)).join("\n")}${(section.sections || []).map((child) => (child.lessons.length === 1 ? row(child.lessons[0]) : row(child, true, true) + card(child, true))).join("\n")}</div>`;
}
const folderMarkup = PAEDIATRIC_FOLDERS.map(
  (folder) => row(folder, true) + card(folder),
).join("\n");
let html = `<!-- Source-derived Kids OR workshop. Regenerate with scripts/import-paediatric-workshop.mjs. -->
<div id="${PAEDIATRIC_PAGE}" class="page pupils-like has-eyes-topbar pec-workshop-page paediatric-workshop-page">
  <div class="container pupils-container">${topbar()}
    <div class="pupils-levels"><section class="pupil-level pupil-level--intermediate" aria-label="${escape(PAEDIATRIC_TITLE)}">
      ${text("div", "title", 'class="pupil-level__cap pupil-level__cap--pec-workshop"')}
      <div class="pec-workshop-folders">${folderMarkup}</div>
    </section></div>
  </div>
</div>`;

for (const [id, lesson] of Object.entries(PAEDIATRIC_LOCAL_PAGES)) {
  if (lesson.quiz) {
    const questions = PAEDIATRIC_EAR_IMAGES.map(
      (item, index) =>
        `<fieldset class="quiz-card" data-ear-question="${item.id}"><legend class="quiz-card-heading"><span class="quiz-card-number" aria-hidden="true">${String(index + 1).padStart(2, "0")}</span>${text("span", "image_question", 'class="quiz-question"')}</legend><img class="paediatric-quiz-image" src="${item.src}" alt="${escape(copy.image_case)} ${index + 1}" width="${item.id === "normal" ? 640 : 220}" height="${item.id === "normal" ? 601 : 220}" loading="lazy"><div class="options">${PAEDIATRIC_EAR_IMAGES.map((option, i) => `<label class="opt"><input type="radio" name="ear-${item.id}" value="${option.id}"><span class="opt-prefix" aria-hidden="true">${String.fromCharCode(65 + i)}.</span>${text("span", option.label, 'class="opt-label"')}</label>`).join("")}</div><p class="quiz-explanation" hidden></p></fieldset>`,
    ).join("");
    html += `\n<div id="${id}" class="page pupils-like has-eyes-topbar paediatric-quiz-page medical-test-quiz-page" style="display:none"><div class="container pupils-container">${topbar(lesson.title)}<main class="medical-test-quiz-mount">${text("h1", lesson.title, 'class="paediatric-quiz-title"')}<header class="paediatric-quiz-heading">${text("h2", "practice_heading")}<span class="quiz-progress" data-ear-quiz-progress aria-live="polite">0 / 5</span></header>${text("p", "practice_copy", 'class="paediatric-quiz-instructions"')}<form data-ear-quiz-form><div class="medical-test-quiz-questions">${questions}</div><p data-ear-quiz-status role="status"></p><div class="quiz-actions"><button class="btn primary" type="submit" data-ear-quiz-submit>Submit Answers</button></div></form><dialog class="modal paediatric-quiz-results" aria-labelledby="paediatric-quiz-results-title"><h3 id="paediatric-quiz-results-title">Results</h3><p data-ear-quiz-score></p><div class="quiz-actions"><button class="btn secondary" type="button" data-ear-quiz-review>Review</button><button class="btn primary" type="button" data-ear-quiz-restart>Restart</button></div></dialog></main></div></div>`;
    continue;
  }
  const panels = lesson.panels
    .map(([heading, body], index) => {
      const illustrations =
        id === "paediatricFrontObjectivesPage"
          ? []
          : PAEDIATRIC_OBJECTIVE_ILLUSTRATIONS[heading] || [];
      const figures = illustrations.length
        ? `<div class="paediatric-objective-images${illustrations.length > 1 ? " paediatric-objective-images--pair" : ""}">${illustrations.map((item) => `<figure class="medical-clinical-image medical-practice-poster paediatric-objective-figure"><img src="${item.src}" alt="${escape(copy[item.caption])}" data-paediatric-alt="${item.caption}" loading="lazy">${text("figcaption", item.caption)}</figure>`).join("")}</div>`
        : "";
      return `<article class="diabetic-screening-panel${illustrations.length ? " paediatric-objective-panel" : ""}" data-diabetic-scroll-step><div class="diabetic-screening-panel__text"><span class="diabetic-screening-step">${String(index + 1).padStart(2, "0")}</span>${text("h3", heading)}${text("p", body)}</div>${lesson.structure && heading === "structure" ? `<ul class="paediatric-structure-list">${["arclight", "front", "fundal", "direct", "otoscopy"].map((key) => text("li", key)).join("")}</ul>` : ""}${figures}</article>`;
    })
    .join("\n");
  const images = lesson.gallery
    ? PAEDIATRIC_EAR_IMAGES.map(
        (item, index) =>
          `<article class="diabetic-screening-panel diabetic-screening-panel--content-fit paediatric-image-panel" data-diabetic-scroll-step><div class="diabetic-screening-panel__text"><span class="diabetic-screening-step">${String(index + 2).padStart(2, "0")}</span>${text("p", item.label)}</div><figure class="workshop-source-figure"><img src="${item.src}" alt="${escape(copy[item.label])}" loading="lazy" width="${item.id === "normal" ? 640 : 220}" height="${item.id === "normal" ? 601 : 220}" data-paediatric-alt="${item.label}"></figure></article>`,
      ).join("\n")
    : "";
  const reference = lesson.gallery
    ? `<article class="diabetic-screening-panel diabetic-screening-panel--content-fit" data-diabetic-scroll-step><figure class="workshop-source-figure"><img src="/images/learning/PaediatricSurgicalEyeEar/source-comparison.webp" alt="${escape(copy.reference)}" data-paediatric-alt="reference" loading="lazy" width="1173" height="337">${text("figcaption", "reference")}</figure></article>`
    : "";
  html += `\n<div id="${id}" class="page pupils-like has-eyes-topbar paediatric-scrolly-page${id.endsWith("ObjectivesPage") ? " paediatric-objectives-page" : ""}" style="display: none"><div class="container pupils-container diabetic-screening-page">${topbar(lesson.title)}<div class="pupils-subtitle"></div><main><section class="diabetic-screening-lesson diabetic-screening-lesson--tight-hero" data-diabetic-scroll-lesson aria-label="${escape(copy[lesson.title])}"><div class="diabetic-screening-scroll-cue" data-diabetic-scroll-cue aria-hidden="true"></div><header class="diabetic-screening-hero" data-diabetic-scroll-step>${text("p", "title", 'class="diabetic-screening-eyebrow"')}${text("h2", lesson.title)}</header><div class="diabetic-screening-stack">${panels}${images}${reference}</div></section></main></div></div>`;
}
await fs.writeFile(
  "public/html/paediatricSurgicalEyeEarWorkshop.html",
  html + "\n",
);

const sourceDir = process.argv[2];
if (sourceDir) {
  const destination = "public/images/learning/PaediatricSurgicalEyeEar";
  await fs.mkdir(destination, { recursive: true });
  // The labels stay HTML text. These exact crops remove slide labels/borders,
  // retaining the photographic content; the complete comparison is also kept.
  const inputs = [
    ["image2.png", "normal", null],
    ["image4.png", "hole", { left: 25, top: 96, width: 220, height: 220 }],
    ["image5.png", "csom", { left: 32, top: 103, width: 220, height: 220 }],
    [
      "image6.png",
      "csom-hole",
      { left: 32, top: 104, width: 220, height: 220 },
    ],
    ["image7.png", "ome", { left: 27, top: 98, width: 220, height: 220 }],
    ["image1.png", "source-comparison", null],
  ];
  for (const [filename, name, crop] of inputs) {
    let asset = sharp(path.join(sourceDir, filename));
    if (crop) asset = asset.extract(crop);
    if (name === "normal")
      asset = asset.resize({ width: 640, withoutEnlargement: true });
    await asset
      .webp({ quality: 90 })
      .toFile(path.join(destination, `${name}.webp`));
  }
}
console.log(
  `Generated ${PAEDIATRIC_FOLDERS.length} folders and ${Object.keys(PAEDIATRIC_LOCAL_PAGES).length} local lessons${sourceDir ? ", with six source-derived WebP images" : ""}.`,
);
