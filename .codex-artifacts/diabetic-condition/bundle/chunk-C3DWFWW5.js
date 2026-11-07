import { a as pe, d as ge, n as fe } from "./chunk-P2HPNKQY.js";
import { a as D, b as J, c as he } from "./chunk-BGCC32GM.js";
var z = Object.freeze({
  lidHygiene: {
    label: "Lid Hygeine",
    titleKey: "eyes.card_label.lid_hygiene",
    folder: "lid_hygiene",
    videos: ["clean_eye", "warm_compress"],
  },
  eyeIrrigation: {
    label: "Eye Irrigation",
    titleKey: "eyes.card_label.eye_irrigation",
    videos: ["irrigate_eye"],
  },
  eyelashRemoval: {
    label: "Eyelash Removal",
    titleKey: "eyes.card_label.eyelash_removal",
    videos: ["remove_eyelashes"],
  },
  foreignBodyRemoval: {
    label: "Foreign Body Removal",
    titleKey: "eyes.card_label.foreign_body_removal",
    videos: ["remove_foreign_body"],
  },
  dropsOintment: {
    label: "Drops & Ointment",
    titleKey: "eyes.card_label.drops_ointment",
    videos: ["instil_medication"],
  },
  eyePadShield: {
    label: "Eye Pad / Shield",
    titleKey: "eyes.card_label.eye_pad_shield",
    videos: ["make_eye_pad", "apply_eye_pad"],
  },
  sightLossGuidance: {
    label: "Sight Loss Guidance",
    titleKey: "eyes.card_label.sight_loss_guidance",
    videos: ["guide_sight_loss"],
  },
});
var ye = {
    earsAnatomy: [
      "earsHowWeHear",
      "earsArclightIntroduction",
      "earsHealthPoster",
      "earsAnatomyReference",
    ],
    earsExamination: [
      "earsAssessmentSequence",
      "earsHistoryGuide",
      "earsExaminationGuide",
    ],
    earsOtoscopy: [
      "earsOtoscopyVideo",
      "earsOtoscopeHandout",
      "earsOtoscopyReference",
      "earsOtoscopySignsVideo",
      "earsOtoscopyOsceVideo",
    ],
    earsTympanicMembrane: [
      "earsTympanicBasics",
      "earsNormalAbnormal",
      "earsTympanicDetailed",
    ],
    earsConditions: [
      "earsExternalPoster",
      "earsOtoscopyPoster",
      "earsOuterEarReference",
      "earsMiddleEarReference",
    ],
    earsVideoSimulation: ["earsVideoOtoscopy", "earsSimulation"],
    earsHearingLoss: [
      "earsHearingOverview",
      "earsHealthyEars",
      "earsSafeListening",
      "earsHearingLossReference",
    ],
    earsHearingChildren: [
      "earsChildHearing",
      "earsChildFlyer",
      "earsChildMilestones",
      "earsDistractionTest",
      "earsChildVoiceTest",
    ],
    earsHearingAdults: [
      "earsAdultFlyer",
      "earsWhisperTest",
      "earsAdultAssessment",
    ],
    earsHearingSupport: ["earsHearingAidCare", "earsRehabilitation"],
    earsIrrigation: ["earsWashout"],
    earsMopping: ["earsDryMopping", "earsDischargeCare"],
    earsDrops: ["earsEarDrops"],
    earsWhoTraining: [
      "earsWhoManual",
      "earsHealthWorkers",
      "earsWhoTrainer",
      "earsWhoResources",
      "earsWhoAnnex",
      "earsWhoResolution",
    ],
    earsTeachingResources: [
      "earsFieldFront",
      "earsFieldBack",
      "earsTeachingSlides",
      "earsSimplifiedSlides",
      "earsDetailedSlides",
      "earsWebsiteDocument",
    ],
  },
  q = Object.freeze({
    ...Object.fromEntries(Object.keys(ye).map((e) => [e, "ears"])),
    ...Object.fromEntries(
      Object.entries(ye).flatMap(([e, t]) => t.map((n) => [n, e])),
    ),
  }),
  be = Object.freeze(Object.keys(q));
var Q = {
  ...Object.fromEntries(be.map((e) => [e, "html/earsContent.html"])),
  ...Object.fromEntries(
    Object.keys(z).map((e) => [e, "html/eyeCareProcedure.html"]),
  ),
  splashscreen: "html/splashscreen.html",
  languageinstall: "html/languageinstall.html",
  onboarding: "html/onboarding.html",
  account: "html/account.html",
  interest: "html/interest.html",
  intro: "html/intro.html",
  dashboard: "html/dashboard.html",
  mylearning: "html/mylearning.html",
  myprofile: "html/myprofile.html",
  editProfile: "html/editProfile.html",
  settings: "html/settings.html",
  eyes: "html/eyes.html",
  ears: "html/ears.html",
  videos: "html/videos.html",
  atomscard: "html/atomscard.html",
  quizzes: "html/quizzes.html",
  menu: "html/menu.html",
  offline: "html/offline.html",
  reports: "html/reports.html",
  casestudy: "html/casestudy.html",
  childhoodEyeScreeningWorkshop: "html/childhoodEyeScreeningWorkshop.html",
  medicalStudentsWorkshop: "html/medicalStudentsWorkshop.html",
  pecWorkshop: "html/pecWorkshop.html",
  primaryEarCareWorkshop: "html/primaryEarCareWorkshop.html",
  paediatricSurgicalEyeEarWorkshop:
    "html/paediatricSurgicalEyeEarWorkshop.html",
  fundalReflexPdf: "/html/fundalReflexPdf.html",
  fundalReflexQuiz: "/html/fundalReflexQuiz.html",
  directOphthalmoscopyPdf: "html/fundalReflexPdf.html",
  binocularIndirectOphthalmoscopyPdf: "html/fundalReflexPdf.html",
  visualAcuityPdf: "html/fundalReflexPdf.html",
  pupilsPecPdf: "html/fundalReflexPdf.html",
  pupilsAdvancedPdf: "html/fundalReflexPdf.html",
  frontOfEyePdf: "html/fundalReflexPdf.html",
  visualsystemeyesbrain: "html/visualsystemeyesbrain.html",
  childhoodAssessment: "html/childhoodAssessment.html",
  behavioursquiz: "html/behavioursquiz.html",
  atomsHandout1: "html/fundalReflexPdf.html",
  atomsHandout2: "html/fundalReflexPdf.html",
  visualImpairment: "html/visualImpairment.html",
  signsVICases: "html/signsVICases.html",
  childhoodRefer: "html/childhoodRefer.html",
  childhoodEyeBrainImages: "html/childhoodEyeBrainImages.html",
  childhoodIntroVisualDevelopmentPage: "html/childhoodEyeBrainImages.html",
  childhoodNormalVisualDevelopmentPage: "html/childhoodEyeBrainImages.html",
  childhoodAskQuestionsObservePage: "html/childhoodEyeBrainImages.html",
  childhoodFundalPreparation: "html/childhoodFundalPreparation.html",
  childhoodFundalExamination: "html/childhoodFundalExamination.html",
  childhoodFundalNewbornEyesOpen: "html/childhoodFundalNewbornEyesOpen.html",
  childhoodFundalNewbornEyesClosed:
    "html/childhoodFundalNewbornEyesClosed.html",
  childhoodFundalUnclearFindings: "html/childhoodFundalUnclearFindings.html",
  childhoodFundalPossibleFinding: "html/childhoodFundalPossibleFinding.html",
  childhoodFundalAfterExamination: "html/childhoodFundalAfterExamination.html",
  diabeticObservationFundalReflex: "html/diabeticObservationFundalReflex.html",
  diabeticPositioningFlightPath: "html/diabeticPositioningFlightPath.html",
  diabeticHowToExamine: "html/diabeticHowToExamine.html",
  diabeticBioPreparation: "html/diabeticBioPreparation.html",
  diabeticBioFundoscopySitting: "html/diabeticBioFundoscopySitting.html",
  diabeticBioFundoscopyIndentation:
    "html/diabeticBioFundoscopyIndentation.html",
  glaucomaWorkshop: "html/glaucomaWorkshop.html",
  diabeticRetinopathyWorkshop: "html/diabeticRetinopathyWorkshop.html",
  glaucomaQuizCaseStudy: "html/glaucomaQuizCaseStudy.html",
  glaucomaScrollImages: "html/glaucomascrollImages.html",
  glaucomaHistoryCaseStudy: "html/glaucomaHistoryCaseStudy.html",
};
var Y = "diabeticRetinopathyPage",
  X = "diabeticCondition:lessonOrigin";
function ve() {
  try {
    return JSON.parse(sessionStorage.getItem(X) || "null");
  } catch {
    return null;
  }
}
function mn(e) {
  if (e?.closest(`#${Y}`))
    try {
      (sessionStorage.setItem(
        X,
        JSON.stringify({
          routeName: e.dataset.route || "videos",
          target: e.dataset.target,
        }),
      ),
        sessionStorage.removeItem("diabeticWorkshop:nextFlowEnabled"),
        sessionStorage.removeItem("interactiveLearning:returnTarget"));
    } catch {}
}
function we(e, t) {
  let n = ve();
  return !!(e && n?.target === e && (!t || n.routeName === t));
}
function Se(e, t) {
  let n = ve();
  if (n && !(n.routeName === e && n.target === t))
    try {
      sessionStorage.removeItem(X);
    } catch {}
}
var it = [
  "splashscreen",
  "languageinstall",
  "onboarding",
  "interest",
  "intro",
  "dashboard",
];
function st(e) {
  let t = document.getElementById("backBtnGlobal");
  t && (t.style.display = it.includes(e) ? "none" : "flex");
}
window.addEventListener("page:loaded", (e) => {
  let t = e?.detail?.routeName;
  (document.body?.removeAttribute("data-interactive-subapp-open"), st(t));
});
function Be(e) {
  e?.querySelectorAll?.("iframe[data-src]").forEach((t) => {
    (t.getAttribute("src") || t.setAttribute("src", t.getAttribute("data-src")),
      lt(t));
  });
}
function Oe(e) {
  if (!document.body) return;
  e?.classList?.contains("interactive-subapp-page") === !0
    ? document.body.setAttribute(
        "data-interactive-subapp-open",
        e.classList.contains("interactive-subapp-page--host-topbar")
          ? "host-topbar"
          : "true",
      )
    : document.body.removeAttribute("data-interactive-subapp-open");
}
function ct(e) {
  let t = window.innerWidth || 0,
    n = e?.getBoundingClientRect?.() || { left: 0, right: t, width: t },
    o = e?.closest?.(".page")?.getBoundingClientRect?.() || { left: 0 },
    r = t >= 1024,
    a = r ? (t >= 1440 ? t * 0.22 : t * 0.07) - 4 : 0,
    i = r ? o.left + a + 10 : 12,
    s = r ? t - (a + 20) : t - 12,
    l = Math.max(12, i - n.left),
    m = Math.max(12, n.right - s),
    c = r ? 36 : 44,
    h = document.getElementById("backBtnGlobal"),
    p = h ? getComputedStyle(h, "::before") : null,
    E =
      document.querySelector(
        "#interactiveLearningPage .eyes-topbar .menuBtn",
      ) ||
      document.querySelector("#videos .page .eyes-topbar .menuBtn") ||
      document.querySelector(".eyes-topbar .menuBtn, .eyes-top .menuBtn"),
    d = E ? getComputedStyle(E) : null;
  return {
    topbarHeight: r ? "62px" : "58px",
    leftInset: `${Math.round(l)}px`,
    rightInset: `${Math.round(m)}px`,
    controlSize: `${c}px`,
    backIcon: {
      width: p?.width || (r ? "33px" : "24px"),
      height: p?.height || (r ? "33px" : "24px"),
      webkitMaskImage:
        p?.webkitMaskImage && p.webkitMaskImage !== "none"
          ? p.webkitMaskImage
          : Ee,
      webkitMaskPosition: p?.webkitMaskPosition || "center",
      webkitMaskSize: p?.webkitMaskSize || "contain",
      webkitMaskRepeat: p?.webkitMaskRepeat || "no-repeat",
      maskImage: p?.maskImage && p.maskImage !== "none" ? p.maskImage : Ee,
      maskPosition: p?.maskPosition || "center",
      maskSize: p?.maskSize || "contain",
      maskRepeat: p?.maskRepeat || "no-repeat",
    },
    menuGlyph: E?.textContent?.trim() || "\u2630",
    menuFont: {
      family: d?.fontFamily || "Arial, sans-serif",
      size: d?.fontSize || (r ? "20px" : "25px"),
      weight: d?.fontWeight || "400",
      lineHeight: d?.lineHeight || "1",
      letterSpacing: d?.letterSpacing || "normal",
    },
    gap: "8px",
  };
}
var Ee = `url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24'><path fill='%23000' d='M15.41 7.41 14 6l-6 6 6 6 1.41-1.41L10.83 12z'/></svg>")`;
function Pe(e) {
  let t = null;
  try {
    t = e.contentDocument;
  } catch {
    return;
  }
  if (!t?.documentElement || !t.body) return;
  let n =
    t.querySelector(".app-bar, #appBar") ||
    t.getElementById("burger-icon")?.closest("header");
  if (!n) return;
  let o = (I, ot) => {
    I &&
      Object.entries(ot).forEach(([at, rt]) => {
        I.style.setProperty(at, rt, "important");
      });
  };
  (t.documentElement.classList.add("arclight-embedded-subapp"),
    t.body.classList.add("arclight-embedded-subapp"));
  let r = t.getElementById("arclightEmbeddedSubappChromeStyle");
  if (!r) {
    ((r = t.createElement("style")),
      (r.id = "arclightEmbeddedSubappChromeStyle"));
    let I = t.querySelector("script[nonce], style[nonce]")?.nonce;
    (I && (r.nonce = I),
      (r.textContent = `
      html.arclight-embedded-subapp,
      body.arclight-embedded-subapp {
        margin: 0 !important;
      }

      .app-bar {
        position: sticky !important;
        top: 0 !important;
        left: 0 !important;
        right: 0 !important;
        width: 100% !important;
        z-index: 1000 !important;
        display: grid !important;
        grid-template-columns: var(--arclight-embedded-control-size, 36px) minmax(0, 1fr) auto !important;
        grid-template-rows: 1fr !important;
        align-items: center !important;
        height: var(--arclight-embedded-topbar-height, 62px) !important;
        min-height: var(--arclight-embedded-topbar-height, 62px) !important;
        padding: 0 var(--arclight-embedded-right-inset, 20px) 0 var(--arclight-embedded-left-inset, 20px) !important;
        box-sizing: border-box !important;
      }

      .app-bar h1 {
        grid-column: 2 !important;
        justify-self: center !important;
        min-width: 0 !important;
        margin: 0 !important;
        text-align: center !important;
      }

      .arclight-embedded-back,
      .app-bar .icon-button {
        position: static !important;
      }

      .arclight-embedded-back {
        grid-column: 1 !important;
        grid-row: 1 !important;
        justify-self: start !important;
        appearance: none !important;
        border: 0 !important;
        background: transparent !important;
        color: var(--arclight-embedded-control-color, currentColor) !important;
        font: inherit !important;
        font-size: 0 !important;
        line-height: 0 !important;
        cursor: pointer !important;
        display: inline-flex !important;
        align-items: center !important;
        justify-content: center !important;
      }

      .arclight-embedded-actions {
        grid-column: 3 !important;
        grid-row: 1 !important;
        display: flex !important;
        flex-direction: row !important;
        align-items: center !important;
        justify-content: flex-end !important;
        gap: var(--arclight-embedded-action-gap, 8px) !important;
        justify-self: end !important;
        align-self: center !important;
        width: auto !important;
        height: auto !important;
      }

      .arclight-embedded-actions [data-arclight-embedded-info-button="true"] {
        order: 1 !important;
        color: var(--arclight-embedded-control-color, currentColor) !important;
      }

      .arclight-embedded-actions [data-arclight-embedded-menu-button="true"] {
        order: 2 !important;
      }

      .arclight-embedded-actions [data-arclight-embedded-info-button="true"],
      .arclight-embedded-actions [data-arclight-embedded-menu-button="true"] {
        position: static !important;
        inset: auto !important;
        grid-column: auto !important;
        grid-row: auto !important;
        justify-self: center !important;
        align-self: center !important;
        flex: 0 0 var(--arclight-embedded-control-size, 36px) !important;
        width: var(--arclight-embedded-control-size, 36px) !important;
        height: var(--arclight-embedded-control-size, 36px) !important;
        margin: 0 !important;
        transform: none !important;
      }

      .arclight-embedded-actions [data-arclight-embedded-menu-button="true"] {
        appearance: none !important;
        border: 0 !important;
        background: transparent !important;
        color: var(--arclight-embedded-control-color, currentColor) !important;
        font-size: 0 !important;
        line-height: 0 !important;
        display: inline-flex !important;
        align-items: center !important;
        justify-content: center !important;
        overflow: hidden !important;
      }

      .arclight-embedded-actions [data-arclight-embedded-menu-button="true"] > :not(.arclight-embedded-menu-icon) {
        display: none !important;
      }
    `),
      t.head?.appendChild(r));
  }
  let a = t.getElementById("arclightEmbeddedBackButton");
  a ||
    ((a = t.createElement("button")),
    (a.id = "arclightEmbeddedBackButton"),
    (a.className = "icon-button arclight-embedded-back"),
    (a.type = "button"),
    (a.textContent = ""),
    a.setAttribute("aria-label", "Back"),
    a.setAttribute("data-i18n", "i18nLiteral.Back:aria-label"),
    a.addEventListener("click", (I) => {
      (I.preventDefault(),
        !ze() &&
          y("videos", {
            replace: !0,
            force: C === "videos",
            recordHistory: !1,
            subPageId: "interactiveLearningPage",
          }));
    }),
    n.insertBefore(a, n.firstChild));
  let i = a.querySelector(":scope > .arclight-embedded-back-icon");
  i ||
    ((i = t.createElement("span")),
    (i.className = "arclight-embedded-back-icon"),
    i.setAttribute("aria-hidden", "true"),
    a.appendChild(i));
  let s = n.querySelector(".arclight-embedded-actions");
  s ||
    ((s = t.createElement("div")),
    (s.className = "arclight-embedded-actions"),
    n.appendChild(s));
  let l = n.querySelector(
    '#info-icon, #info-toggle, #infoButton, [aria-label="Open quick guide"], [aria-label="Open information"]',
  );
  l?.setAttribute("data-arclight-embedded-info-button", "true");
  let m =
    t.getElementById("burger-icon") ||
    t.getElementById("sidebar-toggle") ||
    t.getElementById("menuButton") ||
    t.getElementById("menu-icon") ||
    n.querySelector(
      '[aria-label="Open menu"], [aria-label="Open MCQ menu"], .appbar-button-left',
    );
  (m?.setAttribute("data-arclight-embedded-menu-button", "true"),
    l && l.parentElement !== s && s.appendChild(l),
    m && m.parentElement !== s && s.appendChild(m));
  let c = ct(e),
    h = null;
  m &&
    ((h = m.querySelector(":scope > .arclight-embedded-menu-icon")),
    h ||
      ((h = t.createElement("span")),
      (h.className = "arclight-embedded-menu-icon"),
      h.setAttribute("aria-hidden", "true"),
      m.appendChild(h)),
    (h.textContent = c.menuGlyph),
    Array.from(m.children).forEach((I) => {
      I !== h && I.style.setProperty("display", "none", "important");
    }));
  let p = n.querySelector("h1"),
    E = t.defaultView?.getComputedStyle?.(n, "::after"),
    d = E?.content && !["none", "normal", '""', "''"].includes(E.content),
    b = p || l || n,
    v =
      (d ? E.color : null) ||
      t.defaultView?.getComputedStyle?.(b)?.color ||
      "currentColor";
  (t.documentElement.style.setProperty(
    "--arclight-embedded-topbar-height",
    c.topbarHeight,
  ),
    t.documentElement.style.setProperty(
      "--arclight-embedded-left-inset",
      c.leftInset,
    ),
    t.documentElement.style.setProperty(
      "--arclight-embedded-right-inset",
      c.rightInset,
    ),
    t.documentElement.style.setProperty(
      "--arclight-embedded-control-size",
      c.controlSize,
    ),
    t.documentElement.style.setProperty(
      "--arclight-embedded-action-gap",
      c.gap,
    ),
    t.documentElement.style.setProperty("--arclight-embedded-control-color", v),
    o(t.documentElement, { margin: "0", padding: "0" }),
    o(t.body, { margin: "0", padding: "0", "padding-top": "0" }),
    o(n, {
      position: "sticky",
      top: "0",
      left: "0",
      right: "0",
      width: "100%",
      "z-index": "1000",
      display: "grid",
      "grid-template-columns": `${c.controlSize} minmax(0, 1fr) auto`,
      "grid-template-rows": "1fr",
      "align-items": "center",
      height: c.topbarHeight,
      "min-height": c.topbarHeight,
      padding: `0 ${c.rightInset} 0 ${c.leftInset}`,
      "box-sizing": "border-box",
    }),
    o(p, {
      "grid-column": "2",
      "grid-row": "1",
      "justify-self": "center",
      "min-width": "0",
      margin: "0",
      "text-align": "center",
    }),
    o(a, {
      position: "static",
      inset: "auto",
      "grid-column": "1",
      "grid-row": "1",
      "justify-self": "start",
      appearance: "none",
      border: "0",
      background: "transparent",
      color: v,
      cursor: "pointer",
      display: "inline-flex",
      "align-items": "center",
      "justify-content": "center",
      "font-size": "0",
      "line-height": "0",
      width: c.controlSize,
      height: c.controlSize,
      margin: "0",
      padding: "0",
      transform: "none",
    }),
    o(i, {
      display: "block",
      width: c.backIcon.width,
      height: c.backIcon.height,
      background: "currentColor",
      "-webkit-mask-image": c.backIcon.webkitMaskImage,
      "-webkit-mask-position": c.backIcon.webkitMaskPosition,
      "-webkit-mask-size": c.backIcon.webkitMaskSize,
      "-webkit-mask-repeat": c.backIcon.webkitMaskRepeat,
      "mask-image": c.backIcon.maskImage,
      "mask-position": c.backIcon.maskPosition,
      "mask-size": c.backIcon.maskSize,
      "mask-repeat": c.backIcon.maskRepeat,
    }),
    o(s, {
      "grid-column": "3",
      "grid-row": "1",
      display: "flex",
      "flex-direction": "row",
      "align-items": "center",
      "justify-content": "flex-end",
      gap: c.gap,
      "justify-self": "end",
      "align-self": "center",
      width: "auto",
      height: "auto",
    }),
    o(l, {
      order: "1",
      color: v,
      position: "static",
      inset: "auto",
      "grid-column": "auto",
      "grid-row": "auto",
      "justify-self": "center",
      "align-self": "center",
      flex: `0 0 ${c.controlSize}`,
      width: c.controlSize,
      height: c.controlSize,
      margin: "0",
      transform: "none",
    }),
    o(m, {
      order: "2",
      position: "static",
      inset: "auto",
      "grid-column": "auto",
      "grid-row": "auto",
      "justify-self": "center",
      "align-self": "center",
      flex: `0 0 ${c.controlSize}`,
      width: c.controlSize,
      height: c.controlSize,
      margin: "0",
      transform: "none",
      appearance: "none",
      border: "0",
      background: "transparent",
      color: v,
      "font-size": "0",
      "line-height": "0",
      overflow: "hidden",
    }),
    o(h, {
      display: "inline-block",
      width: "auto",
      height: "auto",
      background: "transparent",
      color: "currentColor",
      "font-family": c.menuFont.family,
      "font-size": c.menuFont.size,
      "font-weight": c.menuFont.weight,
      "line-height": c.menuFont.lineHeight,
      "letter-spacing": c.menuFont.letterSpacing,
      "-webkit-mask": "none",
      mask: "none",
    }));
}
function lt(e) {
  e?.closest?.(".interactive-subapp-container") &&
    (e.dataset.interactiveSubappChromeWired !== "1" &&
      ((e.dataset.interactiveSubappChromeWired = "1"),
      e.addEventListener("load", () => Pe(e))),
    Pe(e));
}
function R(e) {
  document.querySelectorAll(".page").forEach((o) => {
    (o.classList.remove("active"), (o.style.display = "none"));
  });
  let n = document.getElementById(e);
  n && (n.classList.add("active"), (n.style.display = "block"), Be(n), Oe(n));
}
window.minimalShowPage = window.minimalShowPage || R;
(function () {
  if (window.__pageShownPatched) return;
  let e = window.showPage;
  typeof e == "function" &&
    ((window.showPage = function (t) {
      let n = e.apply(this, arguments);
      return (
        document.dispatchEvent(
          new CustomEvent("page:shown", { detail: { id: t } }),
        ),
        n
      );
    }),
    (window.__pageShownPatched = !0));
})();
document.addEventListener("page:shown", (e) => {
  let t = String(e.detail?.id || "");
  if (!t) return;
  let n = document.getElementById(t);
  (Be(n), Oe(n), bt(t));
});
function Ie(e) {
  let t = e.target.closest("[data-page]");
  if (!t) return;
  let n = t.getAttribute("data-page");
  n &&
    ((n === "videos" && t.id === "videos") ||
      (e.preventDefault(),
      typeof window.showPage == "function" ? window.showPage(n) : R(n)));
}
function dt() {
  (document.removeEventListener("click", Ie, !1),
    document.addEventListener("click", Ie, !1));
}
document.addEventListener("DOMContentLoaded", () => {
  dt();
});
var N = null,
  P = [],
  u = [],
  Z = "myLearningReturnTarget",
  Ce = "interactiveLearning:returnTarget",
  ke = "medicalStudentsWorkshop:rapdReturn",
  ee = "profileReturnTarget",
  C = null,
  te = !1,
  f = !1,
  M = null,
  Le = "#/";
function ut(e) {
  let t = String(e ?? "");
  if (!t) return "";
  try {
    return decodeURIComponent(t);
  } catch {
    return t;
  }
}
function w(e) {
  let t = String(e ?? "").trim();
  return t && Object.prototype.hasOwnProperty.call(Q, t) ? t : null;
}
function S(e) {
  return String(e ?? "").trim() || null;
}
function H(e, t) {
  return e?.routeName === t?.routeName && S(e?.subPageId) === S(t?.subPageId);
}
function _e(e, t) {
  if (e) {
    if (t && P.length > 0) {
      ((P[P.length - 1] = e), P.length > 1 && P[P.length - 2] === e && P.pop());
      return;
    }
    P[P.length - 1] !== e && P.push(e);
  }
}
function ne(e, t = null, n = !1) {
  let o = w(e);
  if (!o) return;
  let r = { routeName: o, subPageId: S(t) };
  if (n && u.length > 0) {
    ((u[u.length - 1] = r), u.length > 1 && H(u[u.length - 2], r) && u.pop());
    return;
  }
  H(u[u.length - 1], r) || u.push(r);
}
function De(e) {
  if (!e?.routeName) return;
  let t = { routeName: w(e.routeName), subPageId: S(e.subPageId) };
  if (t.routeName) {
    for (let n = u.length - 1; n >= 0; n -= 1)
      if (H(u[n], t)) {
        u.splice(n, 1);
        return;
      }
  }
}
function mt(e) {
  if (w(e) !== "mylearning") return;
  let t = w(N || C);
  if (!t || t === "mylearning") return;
  let n = W(),
    o = n && n !== "likedPage" ? n : null;
  try {
    sessionStorage.setItem(Z, JSON.stringify({ routeName: t, subPageId: o }));
  } catch {}
}
function ht(e) {
  if (w(e) !== "myprofile") return;
  let t = w(N || C);
  if (!t || qe.has(t)) return;
  let n = F(),
    o = W(),
    r = n?.routeName === t ? n.subPageId : o && o !== t ? o : null;
  try {
    sessionStorage.setItem(ee, JSON.stringify({ routeName: t, subPageId: r }));
  } catch {}
}
function pt() {
  try {
    let e = sessionStorage.getItem(Z);
    sessionStorage.removeItem(Z);
    let t = JSON.parse(e || "null");
    return T(t);
  } catch {
    return null;
  }
}
function gt() {
  try {
    let e = sessionStorage.getItem(ee);
    sessionStorage.removeItem(ee);
    let t = JSON.parse(e || "null");
    return T(t);
  } catch {
    return null;
  }
}
function ft() {
  try {
    let e = sessionStorage.getItem(Ce);
    sessionStorage.removeItem(Ce);
    let t = JSON.parse(e || "null");
    return T(t);
  } catch {
    return null;
  }
}
function yt() {
  let e =
    document.getElementById("glaucomaRAPDFullSwingInteractive")?.dataset
      .medicalStudentsReturn === "true";
  try {
    let t = sessionStorage.getItem(ke) === "1";
    return (sessionStorage.removeItem(ke), e || t);
  } catch {
    return e;
  }
}
function ze() {
  let e = ft();
  if (!e?.routeName) return !1;
  let t = F();
  return (
    De({ routeName: t?.routeName || N, subPageId: t?.subPageId || W() }),
    (f = !0),
    y(e.routeName, {
      replace: !0,
      force: e.routeName === C,
      recordHistory: !1,
      subPageId: e.subPageId,
    }).finally(() => {
      f = !1;
    }),
    !0
  );
}
function bt(e) {
  if (f) return;
  let t = w(N);
  if (!t || !e) return;
  let n = S(e);
  if (!n) return;
  let o = u[u.length - 1],
    r = { routeName: t, subPageId: n };
  if (H(o, r)) return;
  if (
    o?.routeName === t &&
    !o.subPageId &&
    M?.routeName === t &&
    Date.now() - M.time < 1200
  ) {
    u[u.length - 1] = r;
    return;
  }
  u.push(r);
}
var vt = {
    atomscard: { routeName: "dashboard" },
    atomsHandout1: { routeName: "childhoodEyeScreeningWorkshop" },
    atomsHandout2: { routeName: "childhoodEyeScreeningWorkshop" },
    behavioursquiz: { routeName: "childhoodEyeScreeningWorkshop" },
    binocularIndirectOphthalmoscopyPdf: {
      routeName: "diabeticRetinopathyWorkshop",
    },
    visualAcuityPdf: { routeName: "videos", subPageId: "visualAcuityPage" },
    pupilsPecPdf: { routeName: "videos", subPageId: "pupilsPage" },
    pupilsAdvancedPdf: { routeName: "videos", subPageId: "pupilsPage" },
    frontOfEyePdf: { routeName: "videos", subPageId: "frontOfEyePage" },
    childhoodAskQuestionsObservePage: {
      routeName: "childhoodEyeScreeningWorkshop",
    },
    childhoodEyeBrainImages: { routeName: "childhoodEyeScreeningWorkshop" },
    childhoodEyeScreeningWorkshop: { routeName: "eyes" },
    childhoodFundalAfterExamination: {
      routeName: "childhoodEyeScreeningWorkshop",
    },
    childhoodFundalExamination: { routeName: "childhoodEyeScreeningWorkshop" },
    childhoodFundalNewbornEyesClosed: {
      routeName: "childhoodEyeScreeningWorkshop",
    },
    childhoodFundalNewbornEyesOpen: {
      routeName: "childhoodEyeScreeningWorkshop",
    },
    childhoodFundalPossibleFinding: {
      routeName: "childhoodEyeScreeningWorkshop",
    },
    childhoodFundalPreparation: { routeName: "childhoodEyeScreeningWorkshop" },
    childhoodFundalUnclearFindings: {
      routeName: "childhoodEyeScreeningWorkshop",
    },
    childhoodIntroVisualDevelopmentPage: {
      routeName: "childhoodEyeScreeningWorkshop",
    },
    childhoodNormalVisualDevelopmentPage: {
      routeName: "childhoodEyeScreeningWorkshop",
    },
    childhoodRefer: { routeName: "childhoodEyeScreeningWorkshop" },
    diabeticRetinopathyWorkshop: { routeName: "eyes" },
    directOphthalmoscopyPdf: { routeName: "diabeticRetinopathyWorkshop" },
    editProfile: { routeName: "myprofile" },
    ears: { routeName: "dashboard" },
    eyes: { routeName: "dashboard" },
    fundalReflexPdf: { routeName: "childhoodEyeScreeningWorkshop" },
    fundalReflexQuiz: { routeName: "pecWorkshop" },
    glaucomaHistoryCaseStudy: { routeName: "glaucomaWorkshop" },
    glaucomaQuizCaseStudy: { routeName: "glaucomaWorkshop" },
    glaucomaScrollImages: { routeName: "glaucomaWorkshop" },
    glaucomaWorkshop: { routeName: "eyes" },
    medicalStudentsWorkshop: { routeName: "eyes" },
    paediatricSurgicalEyeEarWorkshop: { routeName: "eyes" },
    pecWorkshop: { routeName: "eyes" },
    primaryEarCareWorkshop: { routeName: "ears" },
    settings: { routeName: "myprofile" },
    signsVICases: { routeName: "childhoodEyeScreeningWorkshop" },
    visualImpairment: { routeName: "childhoodEyeScreeningWorkshop" },
    visualsystemeyesbrain: { routeName: "childhoodEyeScreeningWorkshop" },
  },
  wt = {
    diabeticRetinopathyPage: { routeName: "eyes" },
    applyEyePadShieldScrollPage: { routeName: "eyePadShield" },
    extendedExaminationPage: { routeName: "eyes" },
    squintPalsyPage: {
      routeName: "videos",
      subPageId: "extendedExaminationPage",
    },
    visualAcuityPage: { routeName: "eyes" },
    pupilsPage: { routeName: "eyes" },
    pupilsAdvancedFullAnimationVideoPage: {
      routeName: "videos",
      subPageId: "pupilsPage",
    },
    pupilsPecFullAnimationVideoPage: {
      routeName: "videos",
      subPageId: "pupilsPage",
    },
    pupilsPecScrollPage: { routeName: "videos", subPageId: "pupilsPage" },
    pupilsAdvancedScrollPage: { routeName: "videos", subPageId: "pupilsPage" },
    cataractScrollPage: { routeName: "videos", subPageId: "cataractPage" },
    frontOfEyePage: { routeName: "eyes" },
    fundalExamPage: { routeName: "videos", subPageId: "fundalReflexPage" },
    directOphthalmoscopyScrollPage: {
      routeName: "videos",
      subPageId: "arclightPage",
    },
    visualAcuityExaminationScrollPage: {
      routeName: "videos",
      subPageId: "visualAcuityPage",
    },
    frontOfEyeExaminationScrollPage: {
      routeName: "videos",
      subPageId: "frontOfEyePage",
    },
    fundalReflexExaminationScrollPage: {
      routeName: "videos",
      subPageId: "fundalReflexPage",
    },
    binocularIndirectOphthalmoscopyScrollPage: {
      routeName: "videos",
      subPageId: "holoOverviewPage",
    },
    assessmentVisionPage: { routeName: "childhoodEyeScreeningWorkshop" },
    mumVisionPage: { routeName: "childhoodEyeScreeningWorkshop" },
    usaidHowToUseArclightPage: { routeName: "childhoodEyeScreeningWorkshop" },
    usaidFundalReflexExamPage: { routeName: "childhoodEyeScreeningWorkshop" },
    usaidNormalAbnormalPage: { routeName: "childhoodEyeScreeningWorkshop" },
  };
function St(e) {
  if (!e) return null;
  try {
    let t = "videos:contextualReturn:v1",
      n = JSON.parse(sessionStorage.getItem(t) || "null");
    return S(n?.target) !== e
      ? null
      : (sessionStorage.removeItem(t), S(n?.from) || null);
  } catch {
    return null;
  }
}
var Et = new Set([
    "binocularIndirectOphthalmoscopyPdf",
    "directOphthalmoscopyPdf",
    "fundalReflexPdf",
  ]),
  qe = new Set(["myprofile", "editProfile", "settings"]);
function Ne() {
  return u.length <= 1 ? null : (u.pop(), u[u.length - 1] || null);
}
function xe(e) {
  let t = w(e);
  if (t) for (; u.length && u[u.length - 1]?.routeName === t; ) u.pop();
}
function Pt(e) {
  let t = w(e);
  if (!t || u.length <= 1) return null;
  for (; u.length > 1; ) {
    u.pop();
    let n = u[u.length - 1] || null;
    if (n?.routeName && n.routeName !== t) return n;
  }
  return null;
}
function W() {
  let e = Array.from(document.querySelectorAll("#page-content .page.active")),
    t = e[e.length - 1];
  return S(t?.id);
}
function It() {
  return !!(
    typeof window < "u" && window.matchMedia?.("(min-width: 1024px)")?.matches
  );
}
function T(e) {
  if (!e) return null;
  let t = w(e.routeName || e);
  return t ? { routeName: t, subPageId: S(e.subPageId) } : null;
}
function Ct(e, t = null) {
  let n = w(e);
  if (!n) return null;
  if (q[n]) return { routeName: q[n] };
  let o = S(t);
  return Object.prototype.hasOwnProperty.call(z, n)
    ? o && o !== n
      ? { routeName: n, subPageId: n }
      : { routeName: "eyes" }
    : T(wt[o] || vt[n]);
}
function kt(e) {
  let t = T(e);
  t?.routeName &&
    (_e(t.routeName, !0),
    ne(t.routeName, t.subPageId, !0),
    (M = { routeName: t.routeName, time: Date.now() }));
}
function Lt(e, t = null) {
  let n = w(e);
  if (!n) return "";
  let o = S(t);
  return o
    ? `${Le}${encodeURIComponent(n)}/${encodeURIComponent(o)}`
    : `${Le}${encodeURIComponent(n)}`;
}
function F(e = typeof window < "u" ? window.location.hash : "") {
  let t = String(e ?? "").trim();
  if (!t || t === "#") return null;
  let n = t.startsWith("#") ? t.slice(1) : t;
  if ((n.startsWith("/") && (n = n.slice(1)), !n)) return null;
  let [o, r] = n
      .split("/")
      .filter(Boolean)
      .map((i) => ut(i)),
    a = w(o);
  return a ? { routeName: a, subPageId: S(r) } : null;
}
function Nt(e) {
  let t = S(e);
  if (t)
    try {
      ((window.__videosPendingTarget = t),
        sessionStorage.setItem("gotoSubPage", t));
    } catch {}
}
function Ae(e) {
  let t = S(e);
  return !t || !document.getElementById(t)
    ? !1
    : (typeof window.showPage == "function"
        ? window.showPage(t)
        : (R(t),
          document.dispatchEvent(
            new CustomEvent("page:shown", { detail: { id: t } }),
          )),
      !0);
}
function Re(e) {
  let t = w(e);
  if (!t) return !1;
  let n = document.getElementById(t);
  return !n || !n.classList?.contains("page")
    ? !1
    : (typeof window.showPage == "function"
        ? window.showPage(t)
        : (R(t),
          document.dispatchEvent(
            new CustomEvent("page:shown", { detail: { id: t } }),
          )),
      !0);
}
function Te(e, t = {}) {
  if (typeof window > "u") return;
  let n = w(e);
  if (!n) return;
  let o = t?.replace === !0,
    r = Lt(n, t?.subPageId);
  !r ||
    window.location.hash === r ||
    ((te = !0),
    o
      ? history.replaceState(
          history.state,
          "",
          `${window.location.pathname}${window.location.search}${r}`,
        )
      : (window.location.hash = r),
    window.setTimeout(() => {
      te = !1;
    }, 0));
}
async function y(e, t = {}) {
  let n = t?.replace === !0,
    o = t?.force === !0,
    r = t?.recordHistory !== !1,
    a = t?.syncHash !== !1,
    i = S(t?.subPageId);
  if ((Se(e, i), r && (mt(e), ht(e)), !n && !o && e === C)) {
    (Ae(i) || Re(e),
      a && Te(e, { replace: n, subPageId: i }),
      r && i && ne(e, i, n));
    return;
  }
  ((C = e), e === "videos" && i && Nt(i));
  let s = document.getElementById("page-content"),
    l = Q[e];
  if (
    ((N = e),
    document.body &&
      (delete document.body.dataset.route,
      (document.body.dataset.currentRoute = e)),
    !s)
  ) {
    (console.error("#page-content not found"),
      window.dispatchEvent(
        new CustomEvent("page:loaded", { detail: { routeName: e, error: !0 } }),
      ),
      window.dispatchEvent(
        new CustomEvent("page:rendered", {
          detail: { routeName: e, error: !0 },
        }),
      ));
    return;
  }
  if (!l) {
    (console.error(`Route "${e}" not found in ROUTES.`), (s.textContent = ""));
    let d = document.createElement("div");
    d.className = "container";
    let b = document.createElement("p");
    ((b.textContent = `Page not found: ${e}`),
      d.appendChild(b),
      s.appendChild(d),
      window.dispatchEvent(
        new CustomEvent("page:loaded", { detail: { routeName: e, error: !0 } }),
      ),
      window.dispatchEvent(
        new CustomEvent("page:rendered", {
          detail: { routeName: e, error: !0 },
        }),
      ));
    return;
  }
  let m = "";
  try {
    let d = await fetch(l, { cache: "no-store" });
    if (!d.ok) throw new Error(`HTTP error! status: ${d.status}`);
    m = await d.text();
  } catch (d) {
    (console.error("Failed to load route", e, l, d), (s.textContent = ""));
    let b = document.createElement("div");
    b.className = "container";
    let v = document.createElement("p");
    ((v.textContent = `Failed to load page: ${e}`),
      b.appendChild(v),
      s.appendChild(b),
      window.dispatchEvent(
        new CustomEvent("page:loaded", { detail: { routeName: e, error: !0 } }),
      ),
      window.dispatchEvent(
        new CustomEvent("page:rendered", {
          detail: { routeName: e, error: !0 },
        }),
      ));
    return;
  }
  s.innerHTML = m;
  try {
    s.scrollTop = 0;
  } catch {}
  try {
    (window.scrollTo(0, 0),
      (document.documentElement.scrollTop = 0),
      (document.body.scrollTop = 0));
  } catch {}
  try {
    x();
  } catch {}
  (console.warn("[router] loaded route:", e, "bytes=", m.length),
    console.warn("[router] .page count:", s.querySelectorAll(".page").length));
  let c = s.querySelector(".page");
  if (!c) {
    let d = document.createElement("div");
    for (d.className = "page"; s.firstChild; ) d.appendChild(s.firstChild);
    (s.appendChild(d),
      (c = d),
      console.warn(
        "[router] No .page found; wrapped content in a new .page element.",
      ));
  }
  let h = e === "videos" && !!i;
  if (h) {
    let d = c.id === "videos" ? c : c.querySelector("#videos");
    d &&
      ((d.style.visibility = "hidden"),
      d.querySelectorAll(".page").forEach((b) => {
        (b.classList.remove("active"), (b.style.display = "none"));
      }));
  }
  let p = c.querySelector('[data-default="true"]');
  (p && !h ? p.classList.add("active") : c.classList.add("active"),
    r && (_e(e, n), ne(e, i, n), (M = { routeName: e, time: Date.now() })),
    (N = e),
    a && Te(e, { replace: n, subPageId: i }),
    window.dispatchEvent(
      new CustomEvent("page:loaded", { detail: { routeName: e } }),
    ),
    window.dispatchEvent(
      new CustomEvent("page:rendered", { detail: { routeName: e } }),
    ),
    Ae(i) || Re(e));
  let E = document.getElementById("fixedSearchContainer");
  E &&
    (E.style.display = ["dashboard", "earsDashboard"].includes(e)
      ? "block"
      : "none");
}
function xt() {
  if (N === "mylearning") {
    let s = pt();
    if (s?.routeName) {
      ((f = !0),
        y(s.routeName, {
          replace: !0,
          force: s.routeName === C,
          recordHistory: !1,
          subPageId: s.subPageId,
        }).finally(() => {
          f = !1;
        }));
      return;
    }
  }
  let e = W(),
    t = w(N);
  if (we(e, t)) {
    (De({ routeName: t, subPageId: e }),
      (f = !0),
      y("videos", {
        replace: !0,
        force: !0,
        recordHistory: !1,
        subPageId: Y,
      }).finally(() => {
        f = !1;
      }));
    return;
  }
  try {
    let s = JSON.parse(
      sessionStorage.getItem("pecWorkshop:externalReuse") || "null",
    );
    if (s?.route === t && s.target === e) {
      (sessionStorage.removeItem("pecWorkshop:externalReuse"),
        sessionStorage.removeItem("pecWorkshop:activeEntry"),
        y("pecWorkshop", { replace: !0, recordHistory: !1 }));
      return;
    }
  } catch {}
  if (t === "videos") {
    let s = St(e);
    if (s) {
      ((f = !0),
        y("videos", {
          replace: !0,
          force: !0,
          recordHistory: !1,
          subPageId: s,
        }).finally(() => {
          f = !1;
        }));
      return;
    }
  }
  if (
    t === "glaucomaScrollImages" &&
    e === "glaucomaRAPDFullSwingInteractive" &&
    yt()
  ) {
    (xe(t),
      (f = !0),
      y("medicalStudentsWorkshop", { replace: !0, recordHistory: !1 }).finally(
        () => {
          f = !1;
        },
      ));
    return;
  }
  let n = F();
  if (
    !(
      n?.routeName === "videos" && S(n?.subPageId) === "interactiveLearningPage"
    ) &&
    ze()
  )
    return;
  if (t === "myprofile") {
    let s = gt();
    if (s?.routeName) {
      (xe(t),
        (f = !0),
        y(s.routeName, {
          replace: !0,
          force: s.routeName === C,
          recordHistory: !1,
          subPageId: s.subPageId,
        }).finally(() => {
          f = !1;
        }));
      return;
    }
  }
  if (qe.has(t)) {
    let s = Pt(t);
    if (s?.routeName) {
      ((f = !0),
        y(s.routeName, {
          replace: !0,
          force: s.routeName === C,
          recordHistory: !1,
          subPageId: s.subPageId,
        }).finally(() => {
          f = !1;
        }));
      return;
    }
  }
  if (Et.has(t)) {
    let s = Ne();
    if (s?.routeName) {
      ((f = !0),
        y(s.routeName, {
          replace: !0,
          force: s.routeName === C,
          recordHistory: !1,
          subPageId: s.subPageId,
        }).finally(() => {
          f = !1;
        }));
      return;
    }
  }
  let r = Ct(N, e);
  if (r?.routeName) {
    (kt(r),
      (f = !0),
      y(r.routeName, {
        replace: !0,
        force: r.routeName === C,
        recordHistory: !1,
        subPageId: r.subPageId,
      }).finally(() => {
        f = !1;
      }));
    return;
  }
  if (N === "videos") {
    if (e === "fundalReflexPage" && It()) {
      y("eyes", { replace: !0, recordHistory: !1 });
      return;
    }
    try {
      let s = sessionStorage.getItem("fromRoute");
      if (s) {
        (sessionStorage.removeItem("fromRoute"),
          y(s, { replace: !0, recordHistory: !1 }));
        return;
      }
    } catch {}
  }
  let a = Ne();
  if (a?.routeName) {
    ((f = !0),
      y(a.routeName, {
        replace: !0,
        force: a.routeName === C,
        recordHistory: !1,
        subPageId: a.subPageId,
      }).finally(() => {
        f = !1;
      }));
    return;
  }
  P.length > 1 && P.pop();
  let i = P[P.length - 1] || "dashboard";
  y(i, { replace: !0, recordHistory: !1 });
}
function vn() {
  (window.addEventListener("hashchange", () => {
    if (te) return;
    let t = F();
    t?.routeName &&
      y(t.routeName, {
        replace: !0,
        force: t.routeName === C || (t.routeName === "videos" && !!t.subPageId),
        subPageId: t.subPageId,
        syncHash: !1,
      });
  }),
    window.addEventListener("click", (t) => {
      let n = t.target.closest?.("[data-route]");
      if (!n) return;
      let o = n.getAttribute("data-route");
      if (o) {
        t.preventDefault();
        let r = n.getAttribute("data-my-learning-tab");
        if (o === "mylearning" && r)
          try {
            (sessionStorage.setItem("myLearningActiveTab", r),
              localStorage.setItem("myLearningActiveTab", r));
          } catch {}
        y(o);
      }
    }),
    document.getElementById("backBtnGlobal")?.addEventListener("click", (t) => {
      (t.preventDefault(), xt());
    }));
}
(function () {
  let e = "directOphthalmoscopyQuizPage";
  async function t() {
    if (typeof window.loadPage == "function") await y("quizzes");
    else {
      console.warn("loadPage() not found; cannot navigate to quizzes");
      return;
    }
    (typeof window.launchQuiz == "function" && window.launchQuiz(),
      document.querySelectorAll("#page-content .page").forEach((a) => {
        (a.classList.remove("active"), (a.style.display = "none"));
      }));
    let o = document.getElementById(e);
    return (
      o
        ? (o.classList.add("active"), (o.style.display = "block"))
        : console.warn("Quiz target not found:", e),
      ((a) => {
        if (typeof window.showPage == "function") return window.showPage(a);
        if (typeof window.minimalShowPage == "function")
          return window.minimalShowPage(a);
        console.warn("No showPage() available");
      })("directOphthalmoscopyQuizPage")
    );
  }
  (document.addEventListener(
    "click",
    function (n) {
      let o = n.target;
      if (!(o instanceof Element)) return;
      let r = o.closest?.('#quizBtn, [data-action="take-quiz"]'),
        i = (typeof n.composedPath == "function" ? n.composedPath() : []).find(
          (l) =>
            l instanceof Element &&
            l.matches?.('#quizBtn, [data-action="take-quiz"]'),
        );
      (r || i) &&
        (n.preventDefault(),
        n.stopPropagation(),
        n.stopImmediatePropagation(),
        t());
    },
    !0,
  ),
    document.addEventListener(
      "keydown",
      function (n) {
        let o = n.target;
        if (!(o instanceof Element)) return;
        let r = o.closest?.('#quizBtn, [data-action="take-quiz"]'),
          i = (
            typeof n.composedPath == "function" ? n.composedPath() : []
          ).find(
            (l) =>
              l instanceof Element &&
              l.matches?.('#quizBtn, [data-action="take-quiz"]'),
          );
        (r || i) &&
          ((n.key !== "Enter" && n.key !== " ") ||
            (n.preventDefault(),
            n.stopPropagation(),
            n.stopImmediatePropagation(),
            t()));
      },
      !0,
    ),
    (window.launchQuiz = window.launchQuiz || (() => t())));
})();
document.addEventListener("page:loaded", (e) => {
  e.detail?.routeName === "myprofile" &&
    (typeof window.showPage == "function"
      ? window.showPage("myProfilePage")
      : R("myProfilePage"),
    window.dispatchEvent(
      new CustomEvent("app:navigate", { detail: { pageId: "myProfilePage" } }),
    ));
});
window.loadPage = window.loadPage || y;
var B = "profileGeo";
var We = "userLocation";
function U(e, t) {
  return window.I18N?.t?.(`i18nExtra.${e}`, t) || t;
}
function At() {
  return (
    document.getElementById("preciseLocationConsentOverlay")?.remove(),
    new Promise((t) => {
      let n = document.createElement("div");
      ((n.id = "preciseLocationConsentOverlay"),
        n.setAttribute("role", "dialog"),
        n.setAttribute("aria-modal", "true"),
        n.setAttribute("aria-labelledby", "preciseLocationConsentTitle"),
        n.setAttribute("aria-describedby", "preciseLocationConsentText"));
      let o = document.createElement("div");
      o.className = "guest-modal precise-location-consent";
      let r = document.createElement("h2");
      ((r.id = "preciseLocationConsentTitle"),
        (r.className = "guest-modal__title"),
        (r.textContent = U(
          "location_precise_title",
          "Share precise location?",
        )));
      let a = document.createElement("p");
      ((a.id = "preciseLocationConsentText"),
        (a.className = "guest-modal__text"),
        (a.textContent = U(
          "location_precise_disclosure",
          "With your permission, this device sends your precise coordinates directly to BigDataCloud to name the area. Arclight does not send or store those coordinates on its server.",
        )));
      let i = document.createElement("div");
      i.className = "precise-location-consent__actions";
      let s = document.createElement("button");
      ((s.type = "button"),
        (s.className = "precise-location-consent__cancel"),
        (s.textContent = U("location_precise_cancel", "Cancel")));
      let l = document.createElement("button");
      ((l.type = "button"),
        (l.className =
          "guest-modal__cta btn-primary precise-location-consent__continue"),
        (l.textContent = U("location_precise_continue", "Continue")),
        i.append(s, l),
        o.append(r, a, i),
        n.appendChild(o),
        document.body.appendChild(n));
      let m = (h) => {
          (document.removeEventListener("keydown", c), n.remove(), t(h));
        },
        c = (h) => {
          h.key === "Escape" && m(!1);
        };
      (s.addEventListener("click", () => m(!1), { once: !0 }),
        l.addEventListener("click", () => m(!0), { once: !0 }),
        document.addEventListener("keydown", c),
        l.focus());
    })
  );
}
function Fe(e) {
  if (!e) return "MI";
  let t = new Set([
      "UK",
      "US",
      "CA",
      "DE",
      "FR",
      "SE",
      "NO",
      "DK",
      "NL",
      "FI",
      "AU",
      "NZ",
      "JP",
      "KR",
      "SG",
      "IE",
      "CH",
      "AT",
      "BE",
      "LU",
      "IS",
      "IT",
      "ES",
      "PT",
    ]),
    n = new Set([
      "AF",
      "CF",
      "SO",
      "SS",
      "ML",
      "NE",
      "TD",
      "BI",
      "CD",
      "ET",
      "LR",
      "MG",
      "MW",
      "MZ",
      "NI",
      "PK",
      "SL",
      "SY",
      "UG",
      "YE",
      "ZM",
    ]);
  return new Set(["SS", "SO", "YE"]).has(e)
    ? "VLI"
    : n.has(e)
      ? "LI"
      : t.has(e)
        ? "HI"
        : "MI";
}
function Ue() {
  try {
    return JSON.parse(localStorage.getItem(B) || "null");
  } catch {
    return null;
  }
}
function Me(e) {
  try {
    localStorage.setItem(B, JSON.stringify(e));
  } catch {}
}
async function Rt(e, t, n = "en") {
  let o = `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${encodeURIComponent(e)}&longitude=${encodeURIComponent(t)}&localityLanguage=${encodeURIComponent(n)}`,
    r = await fetch(o, { method: "GET" });
  if (!r.ok) throw new Error("reverse geocode failed");
  let a = await r.json();
  return {
    area: [
      a.locality || a.city || a.localityInfo?.administrative?.[0]?.name,
      a.principalSubdivision || a.region,
      a.countryCode,
    ]
      .filter(Boolean)
      .join(", "),
    countryName: a.countryName,
    countryCode: a.countryCode,
    city: a.city || a.locality || a.principalSubdivisionLocality || null,
    locality: a.locality ?? null,
    principalSubdivisionLocality: a.principalSubdivisionLocality ?? null,
    region: a.principalSubdivision || a.region || null,
    raw: a,
  };
}
async function Sn() {
  let e = Ue();
  if (e?.isPrecise) return (oe(e), e);
  try {
    let t = await fetch("/api/location/ip", { credentials: "same-origin" });
    if (!t.ok) throw new Error("ip lookup failed");
    let n = await t.json(),
      o = (
        n && (n.countryCode || n.country)
          ? String(n.countryCode || n.country)
          : "GB"
      ).toUpperCase(),
      r = String(n?.countryName || "").trim() || null;
    try {
      r ||= new Intl.DisplayNames(["en"], { type: "region" }).of(o);
    } catch {
      r ||= o;
    }
    let a = {
      iso2: o,
      country: r || o,
      city: null,
      lat: null,
      lon: null,
      area: null,
      classification: Fe(o),
      ts: Date.now(),
    };
    return (Me(a), oe(a), a);
  } catch {
    let t = {
      iso2: "GB",
      country: "United Kingdom",
      city: null,
      lat: null,
      lon: null,
      area: null,
      classification: "HI",
      ts: Date.now(),
    };
    return (Me(t), oe(t), t);
  }
}
function $e() {
  return Ue()?.iso2 || "GB";
}
function oe(e) {
  document.dispatchEvent(new CustomEvent("location:updated", { detail: e }));
}
function He(e) {
  let t = document.querySelector(
    '#checkLocationBtn, [data-action="checklocation"]',
  );
  t &&
    ((t.disabled = !!e),
    (t.dataset.loading = e ? "1" : "0"),
    e
      ? t.classList.add("checking-location")
      : t.classList.remove("checking-location"));
}
function A(e, t = "gps") {
  let n = [
      document.querySelector("#ipLocationText"),
      document.querySelector('[data-role="ip-location-text"]'),
      document.querySelector(".ip-location .text"),
      document.querySelector("#locationText"),
      document.querySelector("#profileLocation"),
    ].filter(Boolean),
    o = Ve(e) || "Location unavailable",
    r = zt(e);
  n.forEach((i) => {
    (i.id === "profileLocation"
      ? (i.removeAttribute("data-i18n"),
        i.setAttribute("data-i18n-skip", ""),
        (i.textContent = r))
      : (i.textContent = o),
      i.id === "profileLocation" && (i.style.visibility = "visible"));
  });
  let a = document.createElement("span");
  if (
    ((a.textContent = t === "gps" ? " \u2713 updated" : " \u2713"),
    (a.style.marginLeft = "6px"),
    (a.style.opacity = "0.85"),
    n.length > 0 && (n[0].appendChild(a), setTimeout(() => a.remove(), 1500)),
    t === "gps" && e)
  ) {
    let i = document.querySelector("#profileLocation");
    i &&
      (i.classList.add("highlighted"),
      setTimeout(() => {
        i.classList.remove("highlighted");
      }, 1e3));
  }
}
function Tt({ lat: e, lon: t, area: n, source: o }) {
  try {
    let r = { lat: e, lon: t, area: n, source: o, ts: Date.now() };
    localStorage.setItem(We, JSON.stringify(r));
  } catch {}
}
async function Bt() {
  try {
    He(!0);
    let e = await _t();
    if (!e) return;
    let {
      area: t,
      countryCode: n,
      countryName: o,
      city: r,
    } = await Rt(e.latitude, e.longitude);
    Tt({ lat: e.latitude, lon: e.longitude, area: t, source: "gps" });
    let a = JSON.parse(localStorage.getItem(B) || "{}"),
      i = (n || a.iso2 || "GB").toUpperCase(),
      s;
    try {
      s = new Intl.DisplayNames(["en"], { type: "region" }).of(i) || i;
    } catch {
      s = i;
    }
    let l = {
      ...a,
      iso2: i,
      country: o || s,
      city: r || a.city || null,
      lat: e.latitude,
      lon: e.longitude,
      area: t ?? a.area ?? null,
      classification: Fe(i),
      ts: Date.now(),
      isPrecise: !0,
    };
    (localStorage.setItem(B, JSON.stringify(l)),
      document.dispatchEvent(
        new CustomEvent("location:updated", { detail: l }),
      ),
      A(t, "gps"),
      Ot());
  } catch (e) {
    (console.error("checklocation failed:", e),
      A("Unable to get precise location"));
  } finally {
    He(!1);
  }
}
var Ge = "preciseLocationButtonUsed";
function Ot() {
  try {
    localStorage.setItem(Ge, "1");
  } catch {}
  let e = document.querySelector("#checkLocationBtn");
  e &&
    (e.classList.add("fading-out"),
    setTimeout(() => {
      e.classList.add("is-hidden");
    }, 420));
}
document.addEventListener("click", (e) => {
  e.target.matches('#checkLocationBtn, [data-action="checklocation"]') &&
    (e.preventDefault(), Bt());
});
async function _t() {
  if (!("geolocation" in navigator))
    throw new Error("Geolocation not supported");
  return (await At())
    ? new Promise((e, t) => {
        navigator.geolocation.getCurrentPosition(
          (n) => e(n.coords),
          (n) => t(n),
          { enableHighAccuracy: !0, timeout: 15e3, maximumAge: 0 },
        );
      })
    : null;
}
function Dt() {
  try {
    let e = JSON.parse(localStorage.getItem(We) || "null"),
      t = JSON.parse(localStorage.getItem(B) || "null"),
      n = (t?.isPrecise && t?.area) || e?.area || t?.area || t?.city || null,
      o = (t?.iso2 || t?.countryCode || "").toUpperCase(),
      r = t?.region || t?.state || t?.admin1 || t?.admin || null,
      a = [n, r, o].filter(Boolean).join(", ");
    (a && A(a, "cache"),
      (t?.isPrecise || localStorage.getItem(Ge) === "1") &&
        document
          .querySelector("#checkLocationBtn")
          ?.classList.add("is-hidden"));
  } catch (e) {
    console.error("Failed to hydrate profile location from cache:", e);
  }
}
document.addEventListener("DOMContentLoaded", Dt);
document.addEventListener("location:updated", (e) => {
  let t = e?.detail;
  if (!t) return;
  let n = t.area || t.city || null,
    o = t.region || t.state || t.admin1 || t.admin || null,
    r = (t.iso2 || t.countryCode || "").toUpperCase(),
    a = [n, o, r].filter(Boolean).join(", ");
  if (a) {
    let i = t.isPrecise ? "cache" : "event";
    A(a, i);
  }
});
function zt(e) {
  let t = Ve(e);
  if (!t)
    return (
      window.I18N?.t?.(
        "i18nLiteral.Location unavailable",
        "Location unavailable",
      ) || "Location unavailable"
    );
  let n = t.replace(/^Location:\s*/i, ""),
    o =
      window.I18N?.t?.("i18nLiteral.Location: \u2026", "Location: \u2026") ||
      "Location: \u2026";
  return /…|\.\.\./.test(o) ? o.replace(/…|\.\.\./, n) : `${o} ${n}`;
}
function Ve(e) {
  return e && e.replace(/,\s*GB\b/g, ", UK").replace(/\bGB\b/g, "UK");
}
var qt = /[\u0300-\u036f]/g,
  O = null;
function Mt() {
  if (O) return O;
  try {
    O = new RegExp("[^\\p{L}\\p{N}]+", "gu");
  } catch {
    O = /[^a-z0-9]+/gi;
  }
  return O;
}
function $(e, t, n) {
  let o = String(n ?? "")
    .replace(/\s+/g, " ")
    .trim();
  !o || t.has(o) || (t.add(o), e.push(o));
}
function je(e, t = []) {
  return (
    e.forEach((n) => {
      Array.isArray(n) ? je(n, t) : n != null && t.push(n);
    }),
    t
  );
}
function ae(e) {
  return String(e || "")
    .normalize("NFKD")
    .toLocaleLowerCase()
    .replace(qt, "")
    .replace(Mt(), " ")
    .replace(/\s+/g, " ")
    .trim();
}
function re(e = []) {
  return ae(je(e).join(" "));
}
function Ht(e) {
  return String(e || "")
    .split(";")
    .map((t) => t.trim())
    .filter(Boolean)
    .map((t) => t.split(":")[0]?.trim())
    .filter(Boolean);
}
async function Ke() {
  let e = J(),
    t = e === "en" ? ["en"] : ["en", e];
  return Promise.all(
    t.map(async (n) => ({ lang: n, dict: (await he(n)) || {} })),
  );
}
function Wt(e, t = [], n = "") {
  let o = [],
    r = new Set();
  return (
    $(o, r, n),
    e &&
      t.forEach(({ dict: a }) => {
        $(o, r, D(a, e));
      }),
    o
  );
}
function In(e, t = [], n = "") {
  if (!e) return String(n || "");
  let o = J(),
    r = t.find((s) => s.lang === o),
    a = D(r?.dict, e);
  if (a != null) return String(a);
  let i = D(t.find((s) => s.lang === "en")?.dict, e);
  return i != null ? String(i) : String(n || "");
}
function Ft(e, t = []) {
  let n = [],
    o = new Set();
  return (
    Ht(e).forEach((r) => {
      Wt(r, t).forEach((a) => {
        $(n, o, a);
      });
    }),
    n
  );
}
function ie(e, t = []) {
  if (!e) return [];
  let n = [],
    o = new Set(),
    r = [];
  return (
    e.matches?.("[data-i18n]") && r.push(e),
    typeof e.querySelectorAll == "function" &&
      r.push(...e.querySelectorAll("[data-i18n]")),
    r.forEach((a) => {
      Ft(a.getAttribute("data-i18n"), t).forEach((i) => {
        $(n, o, i);
      });
    }),
    n
  );
}
var g,
  Je,
  G = null,
  V = null,
  _ = null,
  Qe = !1,
  ce = 0;
function me(e = g) {
  if (!e) return;
  let t = e.querySelector("#menuUsername"),
    n = e.querySelector(".user-profile"),
    o = ge();
  (t && (t.textContent = o || "Your name"),
    fe(n),
    document.dispatchEvent(new CustomEvent("arclight:account-ui-ready")));
}
function Ut(e) {
  if (!e || typeof e != "string") return null;
  let t = /^(\d{4})-(\d{2})-(\d{2})$/.exec(e);
  return t ? `${t[3]}.${t[2]}.${t[1]}` : null;
}
function Xe(e) {
  let t = String(e ?? "").trim();
  if (!/^\d+$/.test(t)) return null;
  let n = Number(t);
  return !Number.isSafeInteger(n) || n <= 0 ? null : n;
}
function $t(e) {
  let t = typeof e?.versionDate == "string" ? e.versionDate.slice(0, 10) : "";
  if (!/^\d{4}-\d{2}-\d{2}$/.test(t)) return null;
  let n = Xe(e?.versionSequence ?? e?.pushNumber ?? e?.buildNumber) || 1;
  return { versionDateIso: t, versionSequence: n };
}
async function Gt() {
  let e = ["/api/app/version", "/version.json"],
    t = null,
    n = Date.now();
  for (let o of e) {
    let r = o.includes("?") ? "&" : "?",
      a = `${o}${r}vts=${n}`;
    try {
      let i = await fetch(a, { credentials: "same-origin", cache: "no-store" });
      if (!i.ok) continue;
      let s = await i.json(),
        l = $t(s);
      if (!l) continue;
      if (!t) {
        t = l;
        continue;
      }
      if (l.versionDateIso > t.versionDateIso) {
        t = l;
        continue;
      }
      l.versionDateIso === t.versionDateIso &&
        l.versionSequence > t.versionSequence &&
        (t = l);
    } catch (i) {
      console.error(`[menu] version metadata fetch failed (${a}):`, i);
    }
  }
  return t;
}
async function Vt(e = {}) {
  if ((e?.forceRefresh === !0 && (G = null), G)) return G;
  V ||
    (V = Gt().finally(() => {
      V = null;
    }));
  let n = await V;
  return (n && (G = n), n);
}
async function Ze() {
  let e = g?.querySelector("#menuVersionDate");
  if (!e) return;
  let t = await Vt({ forceRefresh: !0 }),
    n = t?.versionDateIso || null,
    o = Ut(n);
  if (!o) {
    ((e.textContent = "ver --.--.----"), e.removeAttribute("datetime"));
    return;
  }
  let r = Xe(t?.versionSequence) || 1;
  ((e.textContent = `ver ${o}.${r}`), (e.dateTime = n));
}
function K() {
  let e =
    document.getElementById("profileLocation") ||
    document.querySelector(".profile-location");
  if (!e) return;
  (e.removeAttribute("data-i18n"), e.setAttribute("data-i18n-skip", ""));
  let t = null,
    n = null;
  try {
    ((t = JSON.parse(localStorage.getItem("profileGeo") || "null")),
      (n = JSON.parse(localStorage.getItem("userLocation") || "null")));
  } catch {}
  let o = (t?.iso2 || $e() || "GB").toUpperCase(),
    r =
      (t?.isPrecise && (t?.area || t?.city)) ||
      n?.area ||
      t?.area ||
      t?.city ||
      null,
    a = t?.region || t?.state || t?.admin1 || t?.admin || null,
    i = [r, a, o].filter(Boolean),
    s = i.length ? i.join(", ") : o;
  (A(s, "cache"),
    e.id === "profileLocation" && (e.style.visibility = "visible"));
}
function le(e) {
  if (!e) return;
  (e
    .querySelector("#atomsCardEyesBtn, #atomsCardEarsBtn")
    ?.closest(".menu-section")
    ?.remove(),
    e
      .querySelector('[data-i18n="menu.alan_section_title"]')
      ?.closest(".menu-section")
      ?.classList.add("menu-section--tight-top"),
    e
      .querySelector('[data-route="languageinstall"]')
      ?.closest(".menu-section")
      ?.classList.add("menu-section--tight-top"));
}
function de(e, t) {
  !e ||
    !t ||
    !Array.from(e.querySelectorAll(".menu-tab-content")).find(
      (o) => o.id === t,
    ) ||
    (e
      .querySelectorAll(".menu-tabs .tab[data-menu-tab-target]")
      .forEach((o) => {
        o.classList.toggle(
          "active",
          o.getAttribute("data-menu-tab-target") === t,
        );
      }),
    e.querySelectorAll(".menu-tab-content").forEach((o) => {
      o.classList.toggle("hidden", o.id !== t);
    }));
}
function jt(e) {
  return ae(e);
}
function Kt(e, t = [], n) {
  let o = e.querySelector("a");
  return re([
    t,
    e.textContent,
    e.getAttribute("aria-label"),
    e.getAttribute("data-route"),
    e.getAttribute("data-i18n"),
    ie(e, n),
    o?.getAttribute("href"),
    o?.textContent,
  ]);
}
function Jt(e, t) {
  let n = e?.querySelector("strong");
  return [n?.textContent, ie(n, t)];
}
function Qt(e) {
  return (
    e?.querySelector(".menu-tab-content:not(.hidden)") ||
    e?.querySelector(".menu-tab-content")
  );
}
function Ye(e) {
  if (!e) return null;
  let t = e.querySelector(":scope > .menu-search-empty");
  return (
    t ||
      ((t = document.createElement("div")),
      (t.className = "menu-search-empty"),
      t.setAttribute("role", "status"),
      t.setAttribute("aria-live", "polite"),
      (t.textContent = "No matching menu items"),
      e.appendChild(t)),
    t
  );
}
function et(e) {
  e &&
    ((ce += 1),
    e.removeAttribute("data-menu-search-active"),
    e
      .querySelectorAll(".menu-search-hidden")
      .forEach((t) => t.classList.remove("menu-search-hidden")),
    e
      .querySelectorAll(".menu-search-empty")
      .forEach((t) => t.classList.add("menu-search-hidden")));
}
async function j(e, t) {
  if (!e) return [];
  let n = ++ce,
    o = jt(t);
  if (!o) return (et(e), []);
  let r = await Ke();
  if (n !== ce) return [];
  e.setAttribute("data-menu-search-active", "true");
  let a = [];
  if (
    (Array.from(e.querySelectorAll(".menu-tab-content")).forEach((s) => {
      let l = !1;
      (Array.from(s.querySelectorAll(".menu-section")).forEach((h) => {
        let p = Jt(h, r),
          E = re(p).includes(o),
          d = !1;
        (Array.from(h.querySelectorAll(".menu-item")).forEach((v) => {
          let I = E || Kt(v, p, r).includes(o);
          (v.classList.toggle("menu-search-hidden", !I),
            I && ((d = !0), (l = !0), a.push({ item: v, tabId: s.id })));
        }),
          h.classList.toggle("menu-search-hidden", !d));
      }),
        Ye(s)?.classList.toggle("menu-search-hidden", l));
    }),
    a[0]?.tabId)
  )
    de(e, a[0].tabId);
  else {
    let s = Qt(e);
    Ye(s)?.classList.remove("menu-search-hidden");
  }
  return a;
}
function ue(e, t = {}) {
  let n = e?.querySelector(".menu-search-wrap.search-wrap--compact"),
    o = n?.querySelector('input[type="search"]');
  n &&
    (n.classList.remove("search-expanded"),
    n.classList.add("search-collapsed"),
    t.clear !== !1 && o && (o.value = ""),
    o?.blur(),
    et(e));
}
async function Yt(e, t) {
  let o = (await j(e, t))[0]?.item;
  if (!o) return !1;
  let r = o.querySelector("a");
  return r ? (r.click(), !0) : (o.click(), !0);
}
function tt(e) {
  if (!e) return;
  let t = e.querySelectorAll(".menu-tabs .tab[data-menu-tab-target]");
  if (!t.length) return;
  t.forEach((o) => {
    o.dataset.menuTabWired !== "1" &&
      ((o.dataset.menuTabWired = "1"),
      o.addEventListener("click", () => {
        de(e, o.getAttribute("data-menu-tab-target"));
      }));
  });
  let n =
    e
      .querySelector(".menu-tabs .tab.active[data-menu-tab-target]")
      ?.getAttribute("data-menu-tab-target") ||
    t[0]?.getAttribute("data-menu-tab-target");
  de(e, n);
}
async function Xt() {
  x();
  let {
    cacheOfflineUrls: e,
    fetchAllOfflineAssetUrls: t,
    resolveOfflineDownloadSelection: n,
    showDownloadAppModal: o,
    showDownloadErrorModal: r,
  } = await import("./languageinstall-W7N72ZJU.js");
  try {
    let a = await t(),
      i = await o(a);
    if (!i) return;
    let s = n(a, i);
    (await navigator.serviceWorker.ready, await e(s));
  } catch (a) {
    (console.warn("[menu] could not download offline content:", a), r(a));
  }
}
function Zt() {
  let e = document.getElementById("downloadedContentsModal");
  if (e) return e;
  ((e = document.createElement("div")),
    (e.id = "downloadedContentsModal"),
    (e.className = "modal-overlay hidden"),
    e.setAttribute("role", "dialog"),
    e.setAttribute("aria-modal", "true"),
    e.setAttribute("aria-labelledby", "downloadedContentsTitle"),
    (e.innerHTML = `
    <div class="modal-box download-modal">
      <div class="modal-header">
        <span id="downloadedContentsTitle">${k(L("Downloaded Contents"))}</span>
        <button
          type="button"
          class="modal-close"
          id="closeDownloadedContentsModalBtn"
          aria-label="${k(L("Close"))}"
        >&times;</button>
      </div>
      <div class="modal-content"></div>
      <div class="modal-footer">
        <button type="button" id="downloadedContentsCloseBtn">${k(L("Close"))}</button>
      </div>
    </div>
  `),
    document.body.appendChild(e));
  let t = () => e.classList.add("hidden");
  return (
    e
      .querySelector("#closeDownloadedContentsModalBtn")
      ?.addEventListener("click", t),
    e
      .querySelector("#downloadedContentsCloseBtn")
      ?.addEventListener("click", t),
    e.addEventListener("click", (n) => {
      n.target === e && t();
    }),
    e
  );
}
function se(e) {
  let t = Zt(),
    n = t.querySelector(".modal-content");
  (n && (n.innerHTML = e), t.classList.remove("hidden"));
}
async function en(e) {
  let t = new Set();
  if (!("caches" in window)) return t;
  let n = 50;
  for (let o = 0; o < e.length; o += n) {
    let r = e.slice(o, o + n);
    (
      await Promise.all(
        r.map(async (i) => {
          try {
            let s = new URL(i.url, window.location.origin).href;
            return (await caches.match(s, { ignoreSearch: !0 })) ? i.url : "";
          } catch {
            return "";
          }
        }),
      )
    )
      .filter(Boolean)
      .forEach((i) => t.add(i));
  }
  return t;
}
function k(e) {
  return String(e ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}
function L(e, t = e, n = {}) {
  let o = window.I18N?.translateLiteral?.(e, t) || t;
  return String(o).replace(/\{\{(\w+)\}\}/g, (r, a) =>
    Object.prototype.hasOwnProperty.call(n, a) ? String(n[a]) : r,
  );
}
function tn(e, t, n) {
  let o = e.filter((a) => a.cachedCount > 0);
  if (!o.length)
    return `
      <p>${k(L("No downloaded contents found."))}</p>
      <p>${k(L("Downloaded files: {{cached}} of {{total}}.", void 0, { cached: t, total: n }))}</p>
    `;
  let r = o
    .map((a) => {
      let i = a.cachedCount >= a.totalCount,
        s = L(i ? "Downloaded" : "Partly downloaded");
      return `
        <li class="downloaded-content-item${i ? " is-complete" : ""}">
          <span class="downloaded-content-item__title">${k(a.label)}</span>
          <span class="downloaded-content-item__meta">${k(L("{{status}} - {{cached}} of {{total}} files", void 0, { status: s, cached: a.cachedCount, total: a.totalCount }))}</span>
        </li>
      `;
    })
    .join("");
  return `
    <p>${k(L("Downloaded files: {{cached}} of {{total}}.", void 0, { cached: t, total: n }))}</p>
    <ul class="downloaded-content-list">${r}</ul>
  `;
}
async function nn() {
  (x(),
    se(`
    <div class="downloaded-content-loading" role="status" aria-live="polite">
      <span class="downloaded-content-spinner" aria-hidden="true"></span>
      <span>${k(L("Checking downloaded contents..."))}</span>
    </div>
  `));
  try {
    let {
        OFFLINE_CATALOG_OPTIONS: e,
        fetchAllOfflineAssetUrls: t,
        formatDownloadSize: n,
        getOfflineManifestAssets: o,
        matchesOfflineCatalog: r,
      } = await import("./languageinstall-W7N72ZJU.js"),
      a = await t(),
      i = o(a),
      s = await en(i),
      l = new Set(),
      m = e
        .map((d) => {
          let b = i.filter((v) => r(v.url, d.id));
          return (
            b.forEach((v) => l.add(v.url)),
            {
              cachedCount: b.filter((v) => s.has(v.url)).length,
              label: d.label,
              totalCount: b.length,
            }
          );
        })
        .filter((d) => d.totalCount > 0),
      c = i.filter((d) => !l.has(d.url)),
      h = c.filter((d) => s.has(d.url)).length;
    c.length &&
      m.unshift({
        cachedCount: h,
        label: L("App shell and shared assets"),
        totalCount: c.length,
      });
    let p = i
        .filter((d) => s.has(d.url))
        .reduce((d, b) => d + (Number(b.bytes) || 0), 0),
      E = `${tn(m, s.size, i.length)}<p class="downloaded-content-size">${k(L("Approx. cached size: {{size}}.", void 0, { size: n(p) }))}</p>`;
    se(E);
  } catch (e) {
    (console.warn("[menu] could not inspect downloaded contents:", e),
      se(
        `<p>${k(L("Could not check downloaded contents."))}</p><p>${k(e?.message || e)}</p>`,
      ));
  }
}
function nt(e) {
  if (!e) return;
  let t = e.querySelector("#startDownloadBtn");
  t &&
    t.dataset.wired !== "1" &&
    ((t.dataset.wired = "1"),
    t.addEventListener("click", () => {
      Xt();
    }));
  let n = e.querySelector("#downloadedContentsBtn");
  n &&
    n.dataset.wired !== "1" &&
    ((n.dataset.wired = "1"),
    n.addEventListener("click", () => {
      nn();
    }));
}
async function on() {
  if (g) {
    le(g);
    return;
  }
  return (
    _ ||
    ((_ = (async () => {
      let t = await (
          await fetch("html/menu.html", {
            credentials: "same-origin",
            cache: "no-store",
          })
        ).text(),
        n = document.createElement("div");
      n.innerHTML = t;
      let o = n.querySelector("#menuOverlay");
      if (!o) {
        console.error("[menu] #menuOverlay not found in html/menu.html");
        return;
      }
      (le(o),
        tt(o),
        nt(o),
        o.classList.add("hidden"),
        document.body.appendChild(o),
        (g = o),
        (Je = g.querySelector("#closeMenuBtn")),
        me(g),
        window.I18N?.applyTranslations?.(g),
        Ze(),
        g.querySelector(".info-icon")?.addEventListener("click", (a) => {
          (a.preventDefault(), rn());
        }),
        Je?.addEventListener("click", x),
        g.addEventListener("click", (a) => {
          a.target === g && x();
        }),
        Qe ||
          (document.addEventListener("keydown", (a) => {
            a.key === "Escape" && x();
          }),
          (Qe = !0)),
        g.addEventListener("click", (a) => {
          let i = a.target.closest("[data-route]"),
            s = a.target.closest("a,[data-close-menu]");
          if (i) {
            let l = i.getAttribute("data-route");
            if (!l) return;
            let m = i.getAttribute("data-my-learning-tab");
            if (l === "mylearning" && m)
              try {
                (sessionStorage.setItem("myLearningActiveTab", m),
                  localStorage.setItem("myLearningActiveTab", m));
              } catch {}
            (y(l), x());
            return;
          }
          s && x();
        }));
    })().finally(() => {
      _ = null;
    })),
    _)
  );
}
document.addEventListener("page:shown", () => {
  K();
});
document.addEventListener("DOMContentLoaded", K);
document.addEventListener("location:updated", () => {
  K();
});
document.addEventListener(pe, () => {
  me(g);
});
async function An() {
  if ((g || (await on()), !g)) return;
  (le(g),
    tt(g),
    nt(g),
    me(g),
    window.I18N?.applyTranslations?.(g),
    K(),
    Ze(),
    document.body.setAttribute("data-menu-open", "true"),
    g.classList.remove("hidden"));
  let e = g?.querySelector(".menu-panel");
  e && an(e);
}
function x() {
  g &&
    (document.body.removeAttribute("data-menu-open"),
    g.classList.add("hidden"),
    ue(g));
}
function an(e) {
  let t = e.querySelector(".menu-search-wrap.search-wrap--compact"),
    n = e.querySelector("#menuSearchToggle");
  if (!t || !n || n.dataset.wired === "1") return;
  n.dataset.wired = "1";
  let o = t.querySelector('input[type="search"]'),
    r = () => {
      (t.classList.remove("search-collapsed"),
        t.classList.add("search-expanded"),
        o?.focus(),
        j(e, o?.value || ""));
    },
    a = () => {
      t.classList.contains("search-collapsed") ? r() : ue(e);
    };
  (n.addEventListener("click", a),
    n.addEventListener("keydown", (i) => {
      (i.key !== "Enter" && i.key !== " ") || (i.preventDefault(), a());
    }),
    o?.addEventListener("input", () => {
      j(e, o.value);
    }),
    o?.addEventListener("keydown", (i) => {
      if (i.key === "Escape") {
        (i.preventDefault(), ue(e));
        return;
      }
      i.key === "Enter" && (i.preventDefault(), Yt(e, o.value));
    }),
    o?.addEventListener("focus", () => {
      j(e, o.value);
    }));
}
function rn() {
  if (document.getElementById("infoModalOverlay")) return;
  let e = document.getElementById("menuInfoModalTemplate");
  if (!e) return;
  let t = e.content.querySelector("#infoModalOverlay")?.cloneNode(!0);
  if (!t) return;
  (document.body.appendChild(t), window.I18N?.applyTranslations?.(t));
  let n = () => {
    (t.classList.add("fade-out"), setTimeout(() => t.remove(), 250));
  };
  (t.querySelector(".guest-modal__close")?.addEventListener("click", n),
    t.querySelector(".guest-modal__cta")?.addEventListener("click", n),
    t.addEventListener("click", (o) => {
      o.target === t && n();
    }));
}
export {
  z as a,
  Q as b,
  Sn as c,
  ae as d,
  re as e,
  Ke as f,
  Wt as g,
  In as h,
  ie as i,
  nn as j,
  on as k,
  An as l,
  x as m,
  mn as n,
  we as o,
  dt as p,
  F as q,
  Te as r,
  y as s,
  vn as t,
};
