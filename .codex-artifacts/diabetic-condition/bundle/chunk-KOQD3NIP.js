import { o as b, s as n } from "./chunk-C3DWFWW5.js";
var w = "__diabeticWorkshopHome__",
  d = "diabeticRetinopathyWorkshopPage",
  O = "diabetic-next-host",
  y = "diabeticWorkshop:nextFlowEnabled",
  D = "diabeticWorkshop:restoreOpenFolder",
  A = "diabeticWorkshop:openFolderKey",
  h = "diabeticWorkshop:focusSelector",
  F = new Set([
    "diabeticPragmaticScreeningPage",
    "diabeticNcdClinicScreeningPage",
    "diabeticOtherEyeDiseasesScreeningPage",
    "diabeticWhatIsDiabetesPage",
    "diabeticTypesOfDiabetesPage",
    "diabeticWhatIsRetinopathyPage",
    "diabeticVisionLossInDiabetesPage",
    "diabeticNcdFlowIntroductionPage",
    "diabeticProliferativeOtherDiseasePage",
    "diabeticSimpleSafeScalableScrollPage",
    "diabeticArclightPackagePage",
    "diabeticProtocolOverviewPage",
    "diabeticProtocolPhaseAPage",
    "diabeticProtocolPhaseBPage",
    "diabeticProtocolNcdConsultationPage",
    "diabeticProtocolPhaseCPage",
    "diabeticProtocolFinalDecisionsPage",
  ]),
  N = new Set([
    "diabeticIntroductionToArclightVideoPage",
    "diabeticCausesOfVisionLossVideoPage",
    "diabeticSimpleSafeScalableVideoPage",
    "diabeticCaseQuizPage",
  ]),
  W = new Set([
    "diabeticObservationFundalReflexPage",
    "diabeticPositioningFlightPathPage",
    "diabeticHowToExaminePage",
    "diabeticBioPreparationPage",
    "diabeticBioFundoscopySittingPage",
    "diabeticBioFundoscopyIndentationPage",
  ]),
  _ = new Set(["diabeticRetinopathyWorkshop", "videos"]),
  v = {
    diabeticPragmaticScreeningPage: {
      previous: { type: "home" },
      next: { type: "target", target: "diabeticArclightPackagePage" },
    },
    diabeticArclightPackagePage: {
      previous: { type: "target", target: "diabeticPragmaticScreeningPage" },
      next: {
        type: "target",
        target: "diabeticIntroductionToArclightVideoPage",
      },
    },
    diabeticIntroductionToArclightVideoPage: {
      previous: { type: "target", target: "diabeticArclightPackagePage" },
      next: { type: "target", target: "diabeticNcdClinicScreeningPage" },
    },
    diabeticNcdClinicScreeningPage: {
      previous: {
        type: "target",
        target: "diabeticIntroductionToArclightVideoPage",
      },
      next: { type: "target", target: "diabeticOtherEyeDiseasesScreeningPage" },
    },
    diabeticOtherEyeDiseasesScreeningPage: {
      previous: { type: "target", target: "diabeticNcdClinicScreeningPage" },
      next: { type: "focus", folderKey: "introduction" },
    },
    diabeticWhatIsDiabetesPage: {
      previous: { type: "home" },
      next: { type: "target", target: "diabeticTypesOfDiabetesPage" },
    },
    diabeticTypesOfDiabetesPage: {
      previous: { type: "target", target: "diabeticWhatIsDiabetesPage" },
      next: { type: "target", target: "diabeticWhatIsRetinopathyPage" },
    },
    diabeticWhatIsRetinopathyPage: {
      previous: { type: "target", target: "diabeticTypesOfDiabetesPage" },
      next: { type: "target", target: "diabeticVisionLossInDiabetesPage" },
    },
    diabeticVisionLossInDiabetesPage: {
      previous: { type: "target", target: "diabeticWhatIsRetinopathyPage" },
      next: { type: "focus", folderKey: "whatIsDiabetes" },
    },
    diabeticCaseQuizPage: {
      previous: { type: "focus", folderKey: "assessment" },
      next: { type: "focus", folderKey: "assessment" },
    },
    diabeticNcdFlowIntroductionPage: {
      previous: { type: "home" },
      next: { type: "target", target: "diabeticProliferativeOtherDiseasePage" },
    },
    diabeticProliferativeOtherDiseasePage: {
      previous: { type: "target", target: "diabeticNcdFlowIntroductionPage" },
      next: { type: "target", target: "diabeticSimpleSafeScalableScrollPage" },
    },
    diabeticSimpleSafeScalableScrollPage: {
      previous: {
        type: "target",
        target: "diabeticProliferativeOtherDiseasePage",
      },
      next: { type: "target", target: "diabeticSimpleSafeScalableVideoPage" },
    },
    diabeticSimpleSafeScalableVideoPage: {
      previous: {
        type: "target",
        target: "diabeticSimpleSafeScalableScrollPage",
      },
      next: { type: "focus", folderKey: "ncdClinicFlow" },
    },
    diabeticProtocolOverviewPage: {
      previous: { type: "home" },
      next: { type: "target", target: "diabeticProtocolPhaseAPage" },
    },
    diabeticProtocolPhaseAPage: {
      previous: { type: "target", target: "diabeticProtocolOverviewPage" },
      next: { type: "target", target: "diabeticProtocolPhaseBPage" },
    },
    diabeticProtocolPhaseBPage: {
      previous: { type: "target", target: "diabeticProtocolPhaseAPage" },
      next: { type: "target", target: "diabeticProtocolNcdConsultationPage" },
    },
    diabeticProtocolNcdConsultationPage: {
      previous: { type: "target", target: "diabeticProtocolPhaseBPage" },
      next: { type: "target", target: "diabeticProtocolPhaseCPage" },
    },
    diabeticProtocolPhaseCPage: {
      previous: {
        type: "target",
        target: "diabeticProtocolNcdConsultationPage",
      },
      next: { type: "target", target: "diabeticProtocolFinalDecisionsPage" },
    },
    diabeticProtocolFinalDecisionsPage: {
      previous: { type: "target", target: "diabeticProtocolPhaseCPage" },
      next: { type: "focus", folderKey: "protocol" },
    },
  },
  E = !1;
function m() {
  try {
    (sessionStorage.removeItem(D),
      sessionStorage.removeItem(A),
      sessionStorage.removeItem(h));
  } catch {}
}
function B() {
  try {
    return sessionStorage.getItem(y) === "1";
  } catch {
    return !1;
  }
}
function k() {
  try {
    return (
      sessionStorage.getItem("medicalStudentsWorkshop:nextFlowEnabled") === "1"
    );
  } catch {
    return !1;
  }
}
function a(e) {
  try {
    e ? sessionStorage.setItem(y, "1") : sessionStorage.removeItem(y);
  } catch {}
}
function I() {
  try {
    let e = document.getElementById("page-content");
    e && (e.scrollTop = 0);
  } catch {}
  try {
    (window.scrollTo(0, 0),
      (document.documentElement.scrollTop = 0),
      (document.body.scrollTop = 0));
  } catch {}
}
function g() {
  (I(),
    requestAnimationFrame(() => {
      I();
    }));
}
function r() {
  document.querySelectorAll(".diabetic-next-wrap").forEach((e) => {
    if (e.getAttribute("data-fundal-inline-nav") !== "1") {
      try {
        e.parentElement?.classList.remove(O);
      } catch {}
      e.remove();
    }
  });
}
function p() {
  return (
    Array.from(document.querySelectorAll(".page")).find((i) =>
      i?.id ? getComputedStyle(i).display !== "none" : !1,
    )?.id || ""
  );
}
function u(e) {
  if (!e) return !1;
  let t = document.getElementById(e);
  if (!t) return !1;
  let i = t;
  for (; i; ) {
    let o = getComputedStyle(i);
    if (o.display === "none" || o.visibility === "hidden") return !1;
    i = i.parentElement;
  }
  return !0;
}
function x(e) {
  document.querySelectorAll(".page").forEach((i) => {
    i.style.display = "none";
  });
  let t = document.getElementById(e);
  t &&
    ((t.style.display = "block"),
    document.dispatchEvent(
      new CustomEvent("page:shown", { detail: { id: e } }),
    ));
}
function P(e) {
  e &&
    document.dispatchEvent(
      new CustomEvent("page:shown", { detail: { id: e } }),
    );
}
async function R(e, t) {
  try {
    (sessionStorage.setItem(D, "1"),
      sessionStorage.setItem(A, e),
      t ? sessionStorage.setItem(h, t) : sessionStorage.removeItem(h));
  } catch {}
  (r(),
    a(!1),
    await n("diabeticRetinopathyWorkshop", { force: !0, replace: !0 }),
    g());
}
async function T(e) {
  try {
    let { goToVideosSection: t, showVideosPageById: i } =
      await import("./videos-YJRPAZ42.js");
    (typeof t == "function" && t(e, { skipDefault: !0 }),
      !u(e) && typeof i == "function" && i(e));
  } catch {}
  if (!u(e)) {
    let t = document.getElementById("videos");
    t &&
      t.querySelectorAll(".page").forEach((o) => {
        o.style.display = "none";
      });
    let i = document.getElementById(e);
    i && ((i.style.display = "block"), P(e));
  }
  u(e) && P(e);
}
async function S(e) {
  if ((r(), e === w)) {
    (m(),
      a(!1),
      await n("diabeticRetinopathyWorkshop", { force: !0, replace: !0 }),
      typeof window.showPage == "function"
        ? window.showPage(d)
        : typeof window.minimalShowPage == "function"
          ? (window.minimalShowPage(d), P(d))
          : x(d),
      g());
    return;
  }
  if (F.has(e)) {
    (a(!0),
      m(),
      await n("diabeticRetinopathyWorkshop"),
      typeof window.showPage == "function"
        ? window.showPage(e)
        : typeof window.minimalShowPage == "function"
          ? (window.minimalShowPage(e), P(e))
          : x(e),
      g());
    return;
  }
  if (N.has(e)) {
    a(!0);
    try {
      ((window.__videosPendingTarget = e),
        (window.__videosSuppressFlash = !0),
        sessionStorage.setItem("gotoSubPage", e));
    } catch {}
    (document.getElementById("videos") || (await n("videos", { subPageId: e })),
      await T(e),
      u(e) || (await n("videos", { replace: !0, subPageId: e }), await T(e)),
      g());
  }
}
function L() {
  if (k()) return !1;
  let e = p();
  return b(e) || e === "diabeticCaseQuizPage"
    ? !1
    : e === d || F.has(e) || N.has(e) || W.has(e);
}
async function V() {
  let e = p();
  if ((r(), a(!1), e === d)) {
    (m(), await n("eyes", { replace: !0, force: !0 }), g());
    return;
  }
  await S(w);
}
async function C(e) {
  if (e) {
    if (e.type === "home") {
      await S(w);
      return;
    }
    if (e.type === "target" && e.target) {
      await S(e.target);
      return;
    }
    e.type === "focus" && (await R(e.folderKey, e.focusSelector));
  }
}
function f(e) {
  if (k() || b(e)) {
    r();
    return;
  }
  let t = v[e];
  if (!t || !B()) {
    r();
    return;
  }
  let i = document.getElementById(e);
  if (!i) return;
  r();
  let o =
    i.querySelector(".container.pupils-container") ||
    i.querySelector(".container") ||
    i;
  o.classList.add(O);
  let l = document.createElement("div");
  l.className = "diabetic-next-wrap";
  let c = document.createElement("button");
  ((c.type = "button"),
    (c.className = "diabetic-prev-btn"),
    (c.textContent = "< Previous"),
    c.setAttribute("data-i18n", "i18nLiteral.< Previous"),
    c.addEventListener("click", async () => {
      await C(t.previous);
    }));
  let s = document.createElement("button");
  ((s.type = "button"),
    (s.className = "diabetic-next-btn is-ready"),
    (s.textContent = "Next >"),
    s.setAttribute("data-i18n", "i18nLiteral.Next >"),
    s.addEventListener("click", async () => {
      await C(t.next);
    }),
    l.appendChild(c),
    l.appendChild(s),
    o.appendChild(l),
    window.I18N?.applyTranslations?.(l));
}
function G() {
  E ||
    ((E = !0),
    document.addEventListener(
      "click",
      (e) => {
        let t = e.target;
        t instanceof Element &&
          t.closest("#backBtnGlobal") &&
          L() &&
          (e.preventDefault(),
          e.stopPropagation(),
          typeof e.stopImmediatePropagation == "function" &&
            e.stopImmediatePropagation(),
          V());
      },
      !0,
    ),
    document.addEventListener("page:shown", (e) => {
      let t = String(e.detail?.id || "");
      t && f(t);
    }),
    window.addEventListener("page:loaded", (e) => {
      let t = String(e.detail?.routeName || "");
      if (!_.has(t)) {
        (r(), a(!1));
        return;
      }
      requestAnimationFrame(() => {
        let i = p();
        i && (t === "diabeticRetinopathyWorkshop" && v[i] && a(!0), f(i));
      });
    }),
    f(p()));
}
function H(e) {
  if (!e) return;
  let t = String(e.getAttribute("data-target") || "").trim();
  v[t] && a(!0);
}
export { G as a, H as b };
