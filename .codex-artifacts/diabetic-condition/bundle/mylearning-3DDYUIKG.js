import { a as H, b as U, d as j } from "./chunk-5O6BKJQI.js";
import { a as R } from "./chunk-S3Y4YK3U.js";
import { a as _, c as x, d as F, h as M } from "./chunk-5FZC2BK5.js";
import { a as B, b as z } from "./chunk-KIQ7J7XB.js";
import "./chunk-VKQVMSQC.js";
import {
  b as I,
  d as N,
  e as f,
  f as Y,
  g as b,
  i as k,
  s as E,
} from "./chunk-C3DWFWW5.js";
import "./chunk-P2HPNKQY.js";
import { d as Q } from "./chunk-BGCC32GM.js";
import "./chunk-WOT6VMZA.js";
var W = "likedItems",
  te = ["eyesLikes", "likedItems", "liked"],
  le = "No saved items yet. Tap the heart on any Eyes card to add it here.",
  de = "Your saved items couldn't be matched. Try liking a new item.",
  ue = "i18nExtra.my_learning_empty",
  ge = "i18nExtra.my_learning_unmatched",
  v = "myLearningActiveTab",
  ae = "liked",
  me = "No in-progress items yet. Start any lesson and it will appear here.",
  pe = Object.freeze(["inProgress", "liked", "notes"]),
  Pe = "(min-width: 600.02px) and (max-width: 1023.98px)",
  he = Object.freeze([
    B,
    "childhoodWorkshop:progress-changed",
    "diabeticWorkshop:progress-changed",
    "glaucomaWorkshop:progress-changed",
  ]);
function ye(e) {
  return Q(e, e);
}
var fe = Object.freeze([
    "lessonProgress:",
    "videoProgress:",
    "childhoodWorkshop:progress:",
    "diabeticWorkshop:progress:",
    "glaucomaWorkshop:progress:",
  ]),
  K = Object.freeze({
    [x]: `${F}.title`,
    "Eye Movements/Squint": "eyes.card_label.eye_movements/squint",
    PEC: "eyes.card_label.pec",
    "Tools and Kits": "eyes.card_label.tools_and_kits",
    Extended: "eyes.card_label.extended",
    "Lid Hygeine": "eyes.card_label.lid_hygiene",
    "Eye Irrigation": "eyes.card_label.eye_irrigation",
    "Eyelash Removal": "eyes.card_label.eyelash_removal",
    "Foreign Body Removal": "eyes.card_label.foreign_body_removal",
    "Drops & Ointment": "eyes.card_label.drops_ointment",
    "Eye Pad / Shield": "eyes.card_label.eye_pad_shield",
    "Sight Loss Guidance": "eyes.card_label.sight_loss_guidance",
  }),
  $ = Object.freeze({
    "Coming Soon": "eyes.tag_coming_soon",
    Video: "eyes.tag_video",
    "Case Study": "eyes.tag_case_study",
    Quiz: "eyes.tag_quiz",
    "Mini Apps": "eyes.tag_mini_apps",
    "Mini App": "eyes.tag_mini_app",
  }),
  Se = Object.freeze({
    [x]: "images/icon/eyes/workshop/car_paediatric.webp",
    "History Taking": "images/icon/eyes/core/car_history.webp",
    "Visual Acuity": "images/icon/eyes/core/car_visualacuity.webp",
    Pupils: "images/icon/eyes/core/car_pupils.webp",
    "Front of Eye": "images/icon/eyes/core/car_frontofeye.webp",
    "Fundal Reflex": "images/icon/eyes/core/car_fundalreflex.webp",
    Ophthalmoscopy: "images/icon/eyes/core/car_ophth.webp",
    "Interactive Learning": "images/icon/eyes/core/car_miniapp.webp",
    "Uncorrected Refractive Error": "images/icon/eyes/disease/car_uncor.webp",
    Cataract: "images/icon/eyes/disease/car_cataract.webp",
    Glaucoma: "images/icon/eyes/disease/car_glaucoma.webp",
    "Diabetic Retinopathy": "images/icon/eyes/disease/car_diabetic.webp",
    "Corneal Disease": "images/icon/eyes/disease/car_corneal.webp",
    "Childhood Eye Screening": "images/icon/eyes/disease/car_childhood.webp",
    "Retinopathy of Prematurity": "images/icon/eyes/disease/car_rop.webp",
    "Retinal Disease": "images/icon/eyes/disease/car_retinal.webp",
    "Optic Nerve Disease": "images/icon/eyes/disease/car_opticnerv.webp",
    PEC: "images/icon/eyes/workshop/car_who.webp",
    Ptosis: "images/icon/eyes/extended/car_ptosis.webp",
    Proptosis: "images/icon/eyes/extended/car_proptosis.webp",
    "Eye Movements/Squint": "images/icon/eyes/extended/car_squint.webp",
    "Cranial Nerve Examination": "images/icon/eyes/extended/car_cranial.webp",
    "Arclight Overview": "images/icon/eyes/tools/car_arclight.webp",
    "Holo Overview": "images/icon/eyes/tools/car_holo.webp",
    "Tools and Kits": "images/icon/eyes/tools/car_arclight.webp",
  }),
  oe = Object.freeze([
    {
      route: "ears",
      title: "Ears",
      titleI18n: "ears.earsCatalogTitle",
      image: "images/icon/dashboard/ears.webp",
    },
    {
      route: _,
      title: x,
      titleI18n: `${F}.title`,
      image: "images/icon/eyes/workshop/car_paediatric.webp",
    },
    {
      route: "eyePadShield",
      title: "Eye Pad / Shield",
      titleI18n: "eyes.card_label.eye_pad_shield",
      image: "images/icon/eyes/moduleicons/primary_scrollytell.webp",
    },
    {
      route: "childhoodEyeScreeningWorkshop",
      title: "Childhood Eye Screening Workshop",
      titleI18n: "mylearning.progress_childhood_workshop",
      image: "images/icon/eyes/workshop/car_childhoodscreen.webp",
    },
    {
      route: "diabeticRetinopathyWorkshop",
      title: "Diabetic Retinopathy Workshop",
      titleI18n: "mylearning.progress_diabetic_workshop",
      image: "images/icon/eyes/disease/car_diabetic.webp",
    },
    {
      route: "glaucomaWorkshop",
      title: "Glaucoma Workshop",
      titleI18n: "mylearning.progress_glaucoma_workshop",
      image: "images/icon/eyes/disease/car_glaucoma.webp",
    },
    {
      route: "casestudy",
      title: "Case Studies",
      titleI18n: "mylearning.progress_case_studies",
      image: "images/icon/eyes/core/car_history.webp",
    },
    {
      route: "videos",
      title: "Core Examinations and Quizzes",
      titleI18n: "mylearning.progress_core_exams_quizzes",
      image: "images/icon/eyes/core/car_pupils.webp",
    },
  ]),
  re = Object.freeze({
    assessmentVisionPage: {
      route: "videos",
      subPageId: "assessmentVisionPage",
    },
    childhoodAskQuestionsObservePage: {
      route: "childhoodAskQuestionsObservePage",
    },
    childhoodEyeBrainImagesPage: {
      route: "childhoodEyeBrainImages",
      subPageId: "childhoodEyeBrainImagesPage",
    },
    childhoodFundalAfterExaminationPage: {
      route: "childhoodFundalAfterExamination",
    },
    childhoodFundalExaminationPage: { route: "childhoodFundalExamination" },
    childhoodFundalNewbornEyesClosedPage: {
      route: "childhoodFundalNewbornEyesClosed",
    },
    childhoodFundalNewbornEyesOpenPage: {
      route: "childhoodFundalNewbornEyesOpen",
    },
    childhoodFundalPossibleFindingPage: {
      route: "childhoodFundalPossibleFinding",
    },
    childhoodFundalPreparationPage: { route: "childhoodFundalPreparation" },
    childhoodFundalUnclearFindingsPage: {
      route: "childhoodFundalUnclearFindings",
    },
    childhoodIntroVisualDevelopmentPage: {
      route: "childhoodIntroVisualDevelopmentPage",
      subPageId: "childhoodIntroVisualDevelopmentPage",
    },
    childhoodNormalVisualDevelopmentPage: {
      route: "childhoodNormalVisualDevelopmentPage",
      subPageId: "childhoodNormalVisualDevelopmentPage",
    },
    childhoodReferPage: { route: "childhoodRefer" },
    fundalReflexPdfPage: { route: "fundalReflexPdf" },
    signsVICasesPage: { route: "signsVICases" },
    atomsHandout1Page: { route: "atomsHandout1" },
    atomsHandout2Page: { route: "atomsHandout2" },
    visualImpairmentPage: { route: "visualImpairment" },
  }),
  ne = Object.freeze({
    glaucomaACDInteractive: {
      route: "glaucomaScrollImages",
      subPageId: "glaucomaACDInteractive",
    },
    glaucomaACDScroll: {
      route: "glaucomaScrollImages",
      subPageId: "glaucomaACDScroll",
    },
    glaucomaAssessRecord: {
      route: "glaucomaScrollImages",
      subPageId: "glaucomaAssessRecord",
    },
    glaucomaCupping: {
      route: "glaucomaScrollImages",
      subPageId: "glaucomaCupping",
    },
    glaucomaDiagnosis: {
      route: "glaucomaScrollImages",
      subPageId: "glaucomaDiagnosis",
    },
    glaucomaFieldsExam: {
      route: "glaucomaScrollImages",
      subPageId: "glaucomaFieldsExam",
    },
    glaucomaFieldsIntro: {
      route: "glaucomaScrollImages",
      subPageId: "glaucomaFieldsIntro",
    },
    glaucomaFrontFindings: {
      route: "glaucomaScrollImages",
      subPageId: "glaucomaFrontFindings",
    },
    glaucomaFundusSummaryAtomsPage: { route: "glaucomaWorkshop" },
    glaucomaGlaucomaSummaryAtomsPage: { route: "glaucomaWorkshop" },
    glaucomaHighIOP: {
      route: "glaucomaScrollImages",
      subPageId: "glaucomaHighIOP",
    },
    glaucomaHistoryCaseStudy: {
      route: "glaucomaHistoryCaseStudy",
      subPageId: "glaucomaHistoryCaseStudy",
    },
    glaucomaIntro: {
      route: "glaucomaScrollImages",
      subPageId: "glaucomaIntro",
    },
    glaucomaOpticNerve: {
      route: "glaucomaScrollImages",
      subPageId: "glaucomaOpticNerve",
    },
    glaucomaPOAGACAG: {
      route: "glaucomaScrollImages",
      subPageId: "glaucomaPOAGACAG",
    },
    glaucomaPupilReactions: {
      route: "glaucomaScrollImages",
      subPageId: "glaucomaPupilReactions",
    },
    glaucomaQuadrantsFingers: {
      route: "glaucomaScrollImages",
      subPageId: "glaucomaQuadrantsFingers",
    },
    glaucomaQuadrantsRed: {
      route: "glaucomaScrollImages",
      subPageId: "glaucomaQuadrantsRed",
    },
    glaucomaQuizCaseStudy: {
      route: "glaucomaQuizCaseStudy",
      subPageId: "glaucomaQuizCaseStudy",
    },
    glaucomaRAPDFullSwingInteractive: {
      route: "glaucomaScrollImages",
      subPageId: "glaucomaRAPDFullSwingInteractive",
    },
    glaucomaSecondaryCauseQuizPage: {
      route: "glaucomaQuizCaseStudy",
      subPageId: "glaucomaSecondaryCauseQuizPage",
    },
    glaucomaSummaryScrolly: {
      route: "glaucomaScrollImages",
      subPageId: "glaucomaSummaryScrolly",
    },
    glaucomaSwingRAPD: {
      route: "glaucomaScrollImages",
      subPageId: "glaucomaSwingRAPD",
    },
    glaucomaTestingVisualAcuity: {
      route: "glaucomaScrollImages",
      subPageId: "glaucomaTestingVisualAcuity",
    },
    glaucomaTypes: {
      route: "glaucomaScrollImages",
      subPageId: "glaucomaTypes",
    },
    glaucomaVisionIntro: {
      route: "glaucomaScrollImages",
      subPageId: "glaucomaVisionIntro",
    },
    glaucomaWhatIs: {
      route: "glaucomaScrollImages",
      subPageId: "glaucomaWhatIs",
    },
    fundalReflexPage: {
      route: "glaucomaScrollImages",
      subPageId: "fundalReflexPage",
    },
  }),
  A = Object.freeze({
    pupilsAdvancedFullAnimationVideoPage: {
      route: "videos",
      subPageId: "pupilsAdvancedFullAnimationVideoPage",
    },
    pupilsPecFullAnimationVideoPage: {
      route: "videos",
      subPageId: "pupilsPecFullAnimationVideoPage",
    },
    pupilsPecScrollPage: { route: "videos", subPageId: "pupilsPecScrollPage" },
    cataractScrollPage: { route: "videos", subPageId: "cataractScrollPage" },
    pupilsAdvancedScrollPage: {
      route: "videos",
      subPageId: "pupilsAdvancedScrollPage",
    },
    makeEyePadShieldFullAnimationVideoPage: {
      route: "eyePadShield",
      subPageId: "makeEyePadShieldFullAnimationVideoPage",
    },
    makeEyePadShieldScrollPage: {
      route: "eyePadShield",
      subPageId: "makeEyePadShieldScrollPage",
    },
    applyEyePadShieldScrollPage: {
      route: "eyePadShield",
      subPageId: "applyEyePadShieldScrollPage",
    },
    ...re,
    ...ne,
    atomsHandout1Page: { route: "atomsHandout1" },
    atomsHandout2Page: { route: "atomsHandout2" },
    binocularIndirectOphthalmoscopyPdfPage: {
      route: "binocularIndirectOphthalmoscopyPdf",
    },
    binocularIndirectOphthalmoscopyScrollPage: {
      route: "videos",
      subPageId: "binocularIndirectOphthalmoscopyScrollPage",
    },
    directOphthalmoscopyPdfPage: { route: "directOphthalmoscopyPdf" },
    visualAcuityPdfPage: { route: "visualAcuityPdf" },
    pupilsPecPdfPage: { route: "pupilsPecPdf" },
    pupilsAdvancedPdfPage: { route: "pupilsAdvancedPdf" },
    frontOfEyePdfPage: { route: "frontOfEyePdf" },
    directOphthalmoscopyScrollPage: {
      route: "videos",
      subPageId: "directOphthalmoscopyScrollPage",
    },
    directOphthalmoscopyQuizPage: {
      route: "quizzes",
      subPageId: "directOphthalmoscopyQuizPage",
    },
    visualAcuityExaminationScrollPage: {
      route: "videos",
      subPageId: "visualAcuityExaminationScrollPage",
    },
    frontOfEyeExaminationScrollPage: {
      route: "videos",
      subPageId: "frontOfEyeExaminationScrollPage",
    },
    fundalReflexExaminationScrollPage: {
      route: "videos",
      subPageId: "fundalReflexExaminationScrollPage",
    },
    fundalReflexPdfPage: { route: "fundalReflexPdf" },
  }),
  X = !1,
  T = 0;
function J(e) {
  try {
    return new Set(JSON.parse(localStorage.getItem(e)) || []);
  } catch {
    return new Set();
  }
}
function Ie(e) {
  try {
    localStorage.setItem(W, JSON.stringify([...e]));
  } catch {}
}
function be() {
  let e = new Set();
  for (let t of J(W)) e.add(String(t));
  for (let t of te) for (let a of J(t)) e.add(String(a));
  return (Ie(e), e);
}
function Ee() {
  return typeof window.getLikes == "function"
    ? () => window.getLikes()
    : typeof window.readLikes == "function"
      ? () => window.readLikes()
      : () => be();
}
var _e = Ee();
function Ae(e) {
  let t = String(e || "").trim();
  if (!t) return;
  if (
    t === "pupilsPage" ||
    new Set([
      "learningModules",
      "coreClinicalOphthalmicExamination",
      "diseasesPage",
      "arclightPage",
      "holoOverviewPage",
      "extendedExaminationPage",
      "childhoodEyeScreeningPage",
      "howToUseArclightVideoPage",
      "directOphthalmoscopy",
      "anteriorSegmentVideoPage",
      "frontOfEyePage",
      "pupilsPage",
      "pupilsPecScrollPage",
      "pupilsAdvancedScrollPage",
      "pupilsAdvancedFullAnimationVideoPage",
      "pupilsPecFullAnimationVideoPage",
      "rapdTestVideoPage",
      "phoneAttachmentVideoPage",
      "visualAcuityPage",
      "fundalReflexPage",
      "visualAcuityExaminationScrollPage",
      "frontOfEyeExaminationScrollPage",
      "fundalReflexExaminationScrollPage",
      "directOphthalmoscopyScrollPage",
      "binocularIndirectOphthalmoscopyScrollPage",
      "interactiveLearningPage",
      "assessmentVisionPage",
      "normalAbnormalPage",
      "fundalReflexInteractivePage",
      "fundalReflexSimulatorPage",
      "fundalReflexPrimaryQuizPage",
      "fundalReflexIntermediateQuizPage",
      "fundalReflexAdvancedQuizPage",
      "traumaInteractivePage",
      "amslerInteractivePage",
      "miresPage",
      "morphPage",
      "morphSimulatorPage",
      "glaucomaInteractivePage",
      "glaucomaSimulatorPage",
      "glaucoma3DInteractivePage",
      "glaucomaPrimaryQuizPage",
      "glaucomaIntermediateQuizPage",
      "glaucomaAdvancedQuizPage",
      "fieldsInteractivePage",
      "refractInteractivePage",
      "sauronInteractivePage",
      "discsInteractivePage",
      "swollenDiscsInteractivePage",
      "squintPalsyPage",
      "squintPalsySimulatorPage",
      "squintPrimaryQuizPage",
      "squintIntermediateQuizPage",
      "squintAdvancedQuizPage",
      "cataractPage",
      "diabeticRetinopathyPage",
      "cataractScrollPage",
      "cataractSimulatorPage",
      "cataractCaseQuizPage",
      "cataractPrimaryQuizPage",
      "cataractIntermediateQuizPage",
      "cataractAdvancedQuizPage",
    ]).has(t)
  ) {
    try {
      sessionStorage.setItem(
        "fromRoute",
        window.currentPageName || "mylearning",
      );
    } catch {}
    (async () => {
      await E("videos");
      try {
        let o = await import("./videos-YJRPAZ42.js");
        t === "pupilsPage" && typeof o.goToPupilsSection == "function"
          ? o.goToPupilsSection()
          : typeof o.goToVideosSection == "function"
            ? o.goToVideosSection(t)
            : sessionStorage.setItem("gotoSubPage", t);
      } catch {
        sessionStorage.setItem("gotoSubPage", t);
      }
    })();
    return;
  }
  typeof window.showPage == "function" ? window.showPage(t) : E(t);
}
async function ve(e, t = "") {
  let a = String(e || "").trim(),
    o = String(t || "").trim();
  if (a) {
    if (a === "videos" && o) {
      try {
        ((window.__videosPendingTarget = o),
          sessionStorage.setItem("gotoSubPage", o));
      } catch {}
      await E("videos", { subPageId: o });
      try {
        (await import("./videos-YJRPAZ42.js")).goToVideosSection?.(o, {
          skipDefault: !0,
        });
      } catch {
        try {
          sessionStorage.setItem("gotoSubPage", o);
        } catch {}
      }
      return;
    }
    if (
      (await E(a, o ? { subPageId: o } : void 0),
      o && typeof window.showPage == "function" && window.showPage(o),
      a === "quizzes" && o === "directOphthalmoscopyQuizPage")
    )
      try {
        (await import("./quiz-launcher-2V3LREYB.js")).launchQuiz?.();
      } catch {
        window.launchQuiz?.();
      }
  }
}
function we() {
  if (typeof window.getAllEyesItems == "function")
    try {
      return window.getAllEyesItems() || [];
    } catch {}
  if (typeof R == "object" && R)
    return Object.entries(R).map(([a, o]) => ({ label: a, target: o }));
  let e = window.EYES_SECTIONS || {},
    t = [];
  return (
    Object.values(e).forEach((a) => {
      (a || []).forEach((o) => t.push(o));
    }),
    t
  );
}
function D(e) {
  return e == null ? "" : String(e).trim().toLowerCase();
}
function Le(e) {
  let t = String(e || "").trim();
  if (!t) return null;
  if (K[t]) return K[t];
  let a = t
    .toLowerCase()
    .replace(/&/g, "and")
    .replace(/[^a-z0-9/]+/g, "_")
    .replace(/^_+|_+$/g, "")
    .replace(/_+/g, "_");
  return a ? `eyes.card_label.${a}` : null;
}
function ke(e) {
  return D(e?.label || e?.id || e?.key || e?.slug || e?.dataLabel);
}
function xe() {
  let e = Math.random();
  return e < 0.45 ? "size-s" : e < 0.8 ? "size-m" : "size-l";
}
function Re(e, t, a) {
  return e?.image
    ? e.image
    : a === "childhoodEyeScreeningWorkshop"
      ? "images/icon/eyes/workshop/car_childhoodscreen.webp"
      : Se[t] || "";
}
function Te(e) {
  let t = e.querySelector("#likedMasonry, #myLearningsList, #m1-masonry");
  return (
    t ||
    ((t = document.createElement("div")),
    (t.id = "myLearningsList"),
    e.appendChild(t),
    t)
  );
}
function q(e) {
  let t = String(e || "").trim();
  return pe.includes(t) ? t : ae;
}
function Ce() {
  try {
    return q(sessionStorage.getItem(v) || localStorage.getItem(v));
  } catch {
    return ae;
  }
}
function Oe(e) {
  let t = q(e);
  try {
    (sessionStorage.setItem(v, t), localStorage.setItem(v, t));
  } catch {}
  return t;
}
function Ne() {
  return !!window.matchMedia?.(Pe).matches;
}
function ze(e) {
  if (e) {
    if ((e.setAttribute("aria-hidden", "true"), (e.textContent = ""), !Ne())) {
      e.textContent = "\u2665";
      return;
    }
    e.innerHTML = `
    <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
      <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 1 0-7.78 7.78L12 21.23l8.84-8.84a5.5 5.5 0 0 0 0-7.78z" />
    </svg>
  `;
  }
}
function Fe(e, t) {
  e.querySelectorAll(".ml-tab").forEach((a) => {
    let o = q(a.dataset.mlTab);
    (a.classList.toggle("active", o === t),
      a.setAttribute("aria-selected", String(o === t)));
  });
}
function Me(e) {
  e.querySelectorAll(".ml-tab").forEach((t) => {
    t.dataset.mlBound !== "1" &&
      ((t.dataset.mlBound = "1"),
      t.addEventListener("click", () => {
        (Oe(t.dataset.mlTab), y());
      }));
  });
}
function nt() {
  if ((y(), X)) return;
  ((X = !0),
    window.addEventListener("storage", (t) => {
      (!t.key ||
        t.key === W ||
        t.key === v ||
        te.includes(t.key) ||
        t.key.startsWith?.("lessonProgress:") ||
        t.key.startsWith?.("videoProgress:") ||
        t.key.startsWith?.("childhoodWorkshop:progress:") ||
        t.key.startsWith?.("diabeticWorkshop:progress:") ||
        t.key.startsWith?.("glaucomaWorkshop:progress:")) &&
        y();
    }),
    window.addEventListener("likes:changed", () => void y()),
    window.addEventListener("i18n:languageChanged", () => void y()),
    he.forEach((t) => {
      document.addEventListener(t, () => void y());
    }),
    window.addEventListener("app:navigate", (t) => {
      let a = t?.detail?.pageId || t?.detail;
      (a === "likedPage" || a === "myLearnings") && y();
    }));
  let e =
    document.getElementById("likedPage") ||
    document.getElementById("myLearnings");
  (e &&
    window.MutationObserver &&
    new MutationObserver(() => {
      (e.classList.contains("active") || e.style.display !== "none") && y();
    }).observe(e, { attributes: !0, attributeFilter: ["class", "style"] }),
    document.addEventListener("DOMContentLoaded", () => {
      let t = document.querySelector(".page.active");
      t && (t.id === "likedPage" || t.id === "myLearnings") && y();
    }));
}
function C(e, t, a = "") {
  e.textContent = "";
  let o = document.createElement("p");
  ((o.className = "note"),
    o.setAttribute("role", "status"),
    o.setAttribute("aria-live", "polite"),
    (o.textContent = t),
    a && o.setAttribute("data-i18n", a),
    e.appendChild(o));
  try {
    window.I18N?.applyTranslations?.(o);
  } catch {}
}
function Ve(e, t, a) {
  let o = e.label || e.name || "Untitled",
    i = e.target || e.pageId || "comingSoon",
    l = xe(),
    n = t.content.querySelector(".ml-card").cloneNode(!0);
  (n.classList.add(l), (n.dataset.target = i));
  let r = Le(o);
  n.dataset.mlSearchText = f([
    o,
    i,
    b(r, a, o),
    (e.tags || []).flatMap((m) => b($[m], a, m)),
  ]);
  let s = Re(e, o, i),
    d = n.querySelector(".ml-card-bg");
  d && s
    ? (n.classList.add("ml-card--image"),
      (d.src = s),
      (d.alt = o),
      r && d.setAttribute("data-i18n", `${r}:alt`))
    : d && d.remove();
  let c = n.querySelector("h4");
  c && ((c.textContent = o), r && c.setAttribute("data-i18n", r));
  let P = n.querySelector(".ml-heart");
  P && (ze(P), n.appendChild(P));
  let u = n.querySelector(".ml-badges");
  return (
    u &&
      ((u.textContent = ""),
      (e.tags || []).slice(0, 3).forEach((m) => {
        let h = document.createElement("span");
        ((h.className = "ml-badge"), (h.textContent = m));
        let p = $[m];
        (p && h.setAttribute("data-i18n", p), u.appendChild(h));
      })),
    n
  );
}
function De(e, t) {
  let a = _e(),
    o = Array.isArray(a)
      ? a.map((r) => D(r))
      : Array.from(a instanceof Set ? a : new Set(), (r) => D(r)),
    i = document.getElementById("mlCardTemplate");
  if (!i) return;
  if (!o.length) {
    C(e, le, ue);
    return;
  }
  let l = new Set(o),
    n = we().filter((r) => l.has(ke(r)));
  ((e.textContent = ""),
    n.length
      ? n.map((r) => Ve(r, i, t)).forEach((r) => e.appendChild(r))
      : C(e, de, ge));
}
function O(e) {
  if (!e) return "";
  let t = e.cloneNode(!0);
  return (
    t.querySelectorAll?.(".lesson-complete-tick").forEach((a) => {
      a.remove();
    }),
    String(t.textContent || "")
      .replace(/\s+/g, " ")
      .trim()
  );
}
function We(e, t) {
  let o =
      t.closest("[data-section], [data-nested-section]")?.querySelector("h3") ||
      null,
    i = String(t.parentElement?.id || "").trim(),
    l = null;
  i &&
    (l =
      Array.from(e.querySelectorAll("[aria-controls]"))
        .find((s) => s.getAttribute("aria-controls") === i)
        ?.querySelector(".lesson-type") || null);
  let n = new Set();
  return [o, l]
    .filter(Boolean)
    .map((r) => ({
      text: O(r),
      i18n: String(r.getAttribute("data-i18n") || "").trim(),
    }))
    .filter((r) => r.text && !n.has(r.text) && n.add(r.text));
}
function qe(e, t, a) {
  let i = t
      .closest("[data-section], [data-nested-section]")
      ?.querySelector("h3"),
    l = String(t.parentElement?.id || "").trim(),
    n = null;
  return (
    l &&
      (n =
        Array.from(e.querySelectorAll("[aria-controls]"))
          .find((s) => s.getAttribute("aria-controls") === l)
          ?.querySelector(".lesson-type") || null),
    [O(i), O(n), k(i, a), k(n, a)]
  );
}
function Ge(e) {
  return e.classList.contains("lesson-row--pdf")
    ? "PDF"
    : e.classList.contains("lesson-row--video")
      ? "Video"
      : e.classList.contains("lesson-row--quiz")
        ? "Quiz"
        : e.matches(".lesson-row--scroll, .lesson-row--scrollytelling")
          ? "Scrolly"
          : "Lesson";
}
function ie(e, t = "") {
  if (A[e]) return A[e];
  if (I[e]) return { route: e, subPageId: "" };
  let a = e.replace(/Page$/, "");
  return I[a]
    ? { route: a, subPageId: e }
    : t === "videos"
      ? { route: "videos", subPageId: e }
      : t && I[t]
        ? { route: t, subPageId: e }
        : { route: "videos", subPageId: e };
}
function Qe(e, t, a) {
  if (t.route === _) {
    let i = M.find((l) => l.id === e.dataset.paediatricLesson);
    if (i && !i.unavailable) return { route: i.route, subPageId: i.target };
  }
  let o = String(e.getAttribute("data-route") || "").trim();
  return o === "videos"
    ? { route: "videos", subPageId: a }
    : o
      ? { route: o, subPageId: "" }
      : ie(a, t.route);
}
async function Ye(e) {
  let t = I[e.route];
  if (!t) return null;
  try {
    let a = await fetch(t, { cache: "no-store" });
    if (!a.ok) return null;
    let o = await a.text();
    return new DOMParser().parseFromString(o, "text/html");
  } catch {
    return null;
  }
}
function g(e) {
  return oe.find((t) => t.route === e) || null;
}
function Be(e) {
  return e === "childhoodWorkshop:progress:"
    ? g("childhoodEyeScreeningWorkshop")
    : e === "diabeticWorkshop:progress:"
      ? g("diabeticRetinopathyWorkshop")
      : e === "glaucomaWorkshop:progress:"
        ? g("glaucomaWorkshop")
        : e === "videoProgress:"
          ? g("videos")
          : null;
}
function Z(e, t, a) {
  let o = Be(t);
  return o && t !== "videoProgress:"
    ? o
    : re[e] ||
        e.startsWith("childhood") ||
        e === "fundalReflexPdfPage" ||
        e === "fundalReflexExaminationScrollPage" ||
        e.startsWith("atomsHandout")
      ? g("childhoodEyeScreeningWorkshop")
      : e.startsWith("diabetic") ||
          e === "directOphthalmoscopyPdfPage" ||
          e === "directOphthalmoscopyScrollPage" ||
          e === "directOphthalmoscopyQuizPage" ||
          e === "binocularIndirectOphthalmoscopyPdfPage" ||
          e === "binocularIndirectOphthalmoscopyScrollPage"
        ? g("diabeticRetinopathyWorkshop")
        : ne[e] ||
            e.startsWith("glaucoma") ||
            e === "frontOfEyePage" ||
            e === "fundalReflexPage"
          ? g("glaucomaWorkshop")
          : e.startsWith("caseStudy") || a.route === "casestudy"
            ? g("casestudy")
            : g(a.route) || o || g("videos");
}
function V(e) {
  return String(e || "Lesson")
    .replace(/Page$/, "")
    .replace(/([a-z0-9])([A-Z])/g, "$1 $2")
    .replace(/[-_]+/g, " ")
    .replace(/\bdr\b/gi, "DR")
    .replace(/\bncd\b/gi, "NCD")
    .replace(/\bbio\b/gi, "BIO")
    .replace(/\s+/g, " ")
    .trim()
    .replace(/^./, (t) => t.toUpperCase());
}
function He() {
  let e = [];
  try {
    for (let t = 0; t < localStorage.length; t += 1) {
      let a = localStorage.key(t) || "",
        o = fe.find((l) => a.startsWith(l));
      if (!o) continue;
      let i = a.slice(o.length).trim();
      i && e.push({ target: i, prefix: o });
    }
  } catch {
    return e;
  }
  return e;
}
async function Ue(e) {
  let t = new Set(),
    a = new Map();
  (Object.entries(H).forEach(([r, s]) => {
    a.set(r, {
      target: r,
      route: r,
      subPageId: "",
      title: s.title,
      titleI18n: `ears.content.${r}`,
      kind: s.type === "video" ? "Video" : s.type === "pdf" ? "PDF" : "Scrolly",
      section: U[j[r]]?.title || "Ears",
      source: g("ears"),
    });
  }),
    a.set("makeEyePadShieldFullAnimationVideoPage", {
      title: "Full animation",
      kind: "Video",
      source: g("eyePadShield"),
      ...A.makeEyePadShieldFullAnimationVideoPage,
    }),
    a.set("makeEyePadShieldScrollPage", {
      title: "Make an eye pad and eye shield",
      titleI18n: "pecWorkshop.make_eye_pad",
      kind: "Scrolly",
      source: g("eyePadShield"),
      ...A.makeEyePadShieldScrollPage,
    }),
    a.set("applyEyePadShieldScrollPage", {
      title: "Apply an Eye Pad and Eye Shield",
      kind: "Scrolly",
      source: g("eyePadShield"),
      ...A.applyEyePadShieldScrollPage,
    }));
  let o = new Map(),
    i = await Promise.all(
      oe.map(async (r) => ({ source: r, doc: await Ye(r) })),
    );
  function l(r) {
    let s = r?.route || r?.title || "videos";
    return (
      o.has(s) ||
        o.set(s, {
          ...(r || g("videos")),
          items: [],
          searchText: f([r?.title, b(r?.titleI18n, e, r?.title)]),
        }),
      o.get(s)
    );
  }
  function n(r, s) {
    !r?.target ||
      t.has(r.target) ||
      r.percent <= 0 ||
      r.percent >= 100 ||
      (t.add(r.target), l(s).items.push(r));
  }
  return (
    i.forEach(({ source: r, doc: s }) => {
      s &&
        Array.from(s.querySelectorAll(".lesson-row[data-target]")).forEach(
          (d) => {
            if (r.route === _) {
              let L = M.find((ce) => ce.id === d.dataset.paediatricLesson);
              if (!L || L.route !== _) return;
            }
            let c = String(d.getAttribute("data-target") || "").trim();
            if (!c) return;
            let P = Qe(d, r, c),
              u = d.querySelector(".lesson-type"),
              m = O(u) || V(c),
              h = We(s, d),
              p = h.map((L) => L.text).join(" - "),
              w = Ge(d),
              S = f([c, m, p, w, k(u, e), qe(s, d, e)]),
              G = {
                target: c,
                title: m,
                titleI18n: String(u?.getAttribute("data-i18n") || "").trim(),
                section: p,
                sectionParts: h,
                kind: w,
                searchText: S,
                source: r,
                route: P.route,
                subPageId: P.subPageId || "",
              };
            (a.has(c) || a.set(c, G), n({ ...G, percent: z(c).percent }, r));
          },
        );
    }),
    He().forEach(({ target: r, prefix: s }) => {
      if (t.has(r)) return;
      let d = z(r).percent;
      if (d <= 0 || d >= 100) return;
      let c = a.get(r),
        P = c?.source || Z(r, s, { route: "", subPageId: "" }),
        u = c ? { route: c.route, subPageId: c.subPageId } : ie(r, P?.route),
        m = c?.source || Z(r, s, u);
      n(
        {
          target: r,
          title: c?.title || V(r),
          titleI18n: c?.titleI18n || "",
          section: c?.section || "",
          kind: c?.kind || "Lesson",
          searchText:
            c?.searchText || f([r, c?.title, c?.section, c?.kind, V(r)]),
          percent: d,
          route: u.route,
          subPageId: u.subPageId || "",
        },
        m,
      );
    }),
    Array.from(o.values())
      .filter((r) => r.items.length)
      .map((r) => ({
        ...r,
        searchText: f([
          r.searchText,
          r.title,
          b(r.titleI18n, e, r.title),
          r.items.map((s) => s.searchText),
        ]),
        percent: r.items.reduce((s, d) => s + d.percent, 0) / r.items.length,
      }))
  );
}
function je(e) {
  let t = document.createElement("article");
  if (
    ((t.className = "ml-card ml-progress-card size-m"),
    (t.dataset.mlSearchText = f([
      e.searchText,
      e.title,
      e.items.flatMap((n) => [n.searchText, n.title, n.section, n.kind]),
    ])),
    e.image)
  ) {
    t.classList.add("ml-card--image");
    let n = document.createElement("img");
    ((n.className = "ml-card-bg"),
      (n.alt = ""),
      (n.decoding = "async"),
      (n.draggable = !1),
      (n.src = e.image),
      t.appendChild(n));
  }
  let a = document.createElement("button");
  ((a.type = "button"),
    (a.className = "ml-progress-card__summary"),
    a.setAttribute("aria-expanded", "false"));
  let o = document.createElement("h4");
  ((o.textContent = e.title),
    e.titleI18n && o.setAttribute("data-i18n", e.titleI18n));
  let i = document.createElement("span");
  ((i.className = "ml-progress-card__meta"),
    (i.textContent = `${e.items.length} ${ye("in progress")}`),
    a.append(o, i));
  let l = document.createElement("div");
  return (
    (l.className = "ml-progress-items"),
    (l.hidden = !0),
    e.items.forEach((n) => {
      let r = document.createElement("button");
      ((r.type = "button"),
        (r.className = "ml-progress-item"),
        (r.dataset.route = n.route),
        (r.dataset.subPageId = n.subPageId));
      let s = document.createElement("span");
      s.className = "ml-progress-item__text";
      let d = document.createElement("span");
      ((d.className = "ml-progress-item__title"),
        (d.textContent = n.title),
        n.titleI18n && d.setAttribute("data-i18n", n.titleI18n));
      let c = document.createElement("span");
      c.className = "ml-progress-item__meta";
      let P = (n.sectionParts || []).map((p) => ({ ...p }));
      (P.push({ text: n.kind, i18n: `i18nLiteral.${n.kind}` }),
        P.filter((p) => p.text).forEach((p, w) => {
          w && c.appendChild(document.createTextNode(" - "));
          let S = document.createElement("span");
          ((S.textContent = p.text),
            p.i18n && S.setAttribute("data-i18n", p.i18n),
            c.appendChild(S));
        }),
        s.append(d, c));
      let u = document.createElement("span");
      ((u.className = "ml-progress-item__percent"),
        (u.textContent = `${Math.round(n.percent)}%`));
      let m = document.createElement("span");
      m.className = "ml-progress-item__track";
      let h = document.createElement("span");
      ((h.className = "ml-progress-item__fill"),
        (h.style.width = `${Math.max(0, Math.min(100, n.percent))}%`),
        m.appendChild(h),
        r.append(s, u, m),
        l.appendChild(r));
    }),
    t.append(a, l),
    t
  );
}
function ee(e) {
  if (!e) return;
  let t = e.querySelector(".ml-progress-card__summary"),
    a = e.querySelector(".ml-progress-items"),
    o = !e.classList.contains("is-open");
  (e.classList.toggle("is-open", o),
    t?.setAttribute("aria-expanded", String(o)),
    a && (a.hidden = !o));
}
async function Ke(e, t = () => !0, a) {
  e.textContent = "";
  let o = document.createElement("p");
  ((o.className = "note"),
    (o.textContent = "Loading in-progress items..."),
    e.appendChild(o));
  let i = await Ue(a);
  if (t()) {
    if (((e.textContent = ""), !i.length)) {
      C(e, me);
      return;
    }
    i.map(je).forEach((l) => e.appendChild(l));
  }
}
function se(e, t) {
  let a = e.querySelector("#mlSearch"),
    o = N(a?.value || "");
  t.querySelectorAll(".ml-card, .ml-progress-card").forEach((i) => {
    let l =
      i.dataset.mlSearchText || N(i.querySelector("h4")?.textContent || "");
    i.style.display = l.includes(o) ? "" : "none";
  });
}
function $e(e, t) {
  let a = e.querySelector("#mlSearch");
  a &&
    !a._mlBound &&
    ((a._mlBound = !0), a.addEventListener("input", () => se(e, t)));
  let o = e.querySelectorAll(".ml-chip");
  o.forEach((i) => {
    i._mlBound ||
      ((i._mlBound = !0),
      i.addEventListener("click", () => {
        (o.forEach((l) => l.classList.remove("active")),
          i.classList.add("active"));
      }));
  });
}
async function y() {
  let e =
    document.getElementById("likedPage") ||
    document.getElementById("myLearnings");
  if (!e) return;
  let t = ++T,
    a = Te(e),
    o = Ce(),
    i = await Y();
  if (
    t === T &&
    (Me(e),
    Fe(e, o),
    $e(e, a),
    o === "inProgress"
      ? await Ke(a, () => t === T, i)
      : o === "liked"
        ? De(a, i)
        : C(a, "Notes are not available yet."),
    t === T)
  ) {
    try {
      window.I18N?.applyTranslations?.(a);
    } catch {}
    (se(e, a),
      (a.onclick = (l) => {
        let n = l.target.closest?.(".ml-progress-item");
        if (n) {
          ve(n.dataset.route, n.dataset.subPageId);
          return;
        }
        let r = l.target.closest?.(".ml-progress-card__summary");
        if (r) {
          ee(r.closest(".ml-progress-card"));
          return;
        }
        let s = l.target.closest?.(".ml-progress-card");
        if (s) {
          ee(s);
          return;
        }
        let d = l.target.closest?.(".ml-card[data-target]");
        if (!d) return;
        let c = d.getAttribute("data-target") || "comingSoon";
        Ae(c);
      }));
  }
}
export { nt as initializeMyLearning };
