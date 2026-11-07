import { a as S } from "./chunk-YXB63DKV.js";
import { s as h } from "./chunk-C3DWFWW5.js";
var E = "__childhoodWorkshopHome__",
  A = "childhoodWorkshop:nextFlowIndex",
  N = "childhoodWorkshop:nextFlowEnabled",
  v = "childhoodWorkshop:nextFlowAuto",
  P = "childhoodWorkshop:nextflow-changed",
  H = "childhoodWorkshop:progress-changed",
  q = "glaucomaWorkshop:progress-changed",
  V = "childhood-next-host",
  U = { childhoodAssessmentPage: "childhoodAssessmentQuizPage" },
  z = new Set([
    "mumVisionPage",
    "assessingVisualFunctionPage",
    "assessmentVisionPage",
    "usaidHowToUseArclightPage",
    "usaidFundalReflexExamPage",
    "usaidNormalAbnormalPage",
  ]),
  G = new Set([
    "childhoodFundalPreparationPage",
    "childhoodFundalExaminationPage",
    "childhoodFundalNewbornEyesOpenPage",
    "childhoodFundalNewbornEyesClosedPage",
    "childhoodFundalUnclearFindingsPage",
    "childhoodFundalPossibleFindingPage",
    "childhoodFundalAfterExaminationPage",
  ]),
  Q = {
    childhoodEyeBrainImagesPage: "childhoodEyeBrainImages",
    childhoodIntroVisualDevelopmentPage: "childhoodIntroVisualDevelopmentPage",
    childhoodNormalVisualDevelopmentPage:
      "childhoodNormalVisualDevelopmentPage",
    childhoodAskQuestionsObservePage: "childhoodAskQuestionsObservePage",
    visualImpairmentPage: "visualImpairment",
    signsVICasesPage: "signsVICases",
    childhoodReferPage: "childhoodRefer",
    childhoodFundalPreparationPage: "childhoodFundalPreparation",
    childhoodFundalExaminationPage: "childhoodFundalExamination",
    childhoodFundalNewbornEyesOpenPage: "childhoodFundalNewbornEyesOpen",
    childhoodFundalNewbornEyesClosedPage: "childhoodFundalNewbornEyesClosed",
    childhoodFundalUnclearFindingsPage: "childhoodFundalUnclearFindings",
    childhoodFundalPossibleFindingPage: "childhoodFundalPossibleFinding",
    childhoodFundalAfterExaminationPage: "childhoodFundalAfterExamination",
    atomsHandout1Page: "atomsHandout1",
    atomsHandout2Page: "atomsHandout2",
    fundalReflexPdfPage: "fundalReflexPdf",
    behavioursquizPage: "behavioursquiz",
    childhoodAssessmentQuizPage: "childhoodAssessment",
  },
  K = [
    ["childhoodEyeBrainImagesPage"],
    [
      "atomsHandout1Page",
      "childhoodIntroVisualDevelopmentPage",
      "childhoodNormalVisualDevelopmentPage",
      "mumVisionPage",
      "assessingVisualFunctionPage",
    ],
    ["visualImpairmentPage"],
    ["signsVICasesPage", "behavioursquizPage"],
    [
      "childhoodAskQuestionsObservePage",
      "assessmentVisionPage",
      "atomsHandout2Page",
      "childhoodReferPage",
      "usaidHowToUseArclightPage",
      "usaidFundalReflexExamPage",
      "fundalReflexPdfPage",
      "childhoodFundalPreparationPage",
      "childhoodFundalExaminationPage",
      "childhoodFundalNewbornEyesOpenPage",
      "childhoodFundalNewbornEyesClosedPage",
      "childhoodFundalUnclearFindingsPage",
      "childhoodFundalPossibleFindingPage",
      "childhoodFundalAfterExaminationPage",
      "usaidNormalAbnormalPage",
      "childhoodAssessmentQuizPage",
    ],
  ],
  a = [],
  c = new Map();
for (let e of K)
  for (let o = 0; o < e.length; o += 1) {
    let n = e[o];
    a.push({ target: n, previous: e[o - 1] || E, next: e[o + 1] || E });
  }
a.forEach((e, o) => {
  let n = c.get(e.target) || [];
  (n.push(o), c.set(e.target, n));
});
var M = new Set([
    "childhoodEyeScreeningWorkshop",
    "videos",
    "childhoodEyeBrainImages",
    "childhoodIntroVisualDevelopmentPage",
    "childhoodNormalVisualDevelopmentPage",
    "childhoodAskQuestionsObservePage",
    "visualImpairment",
    "signsVICases",
    "childhoodRefer",
    "childhoodFundalPreparation",
    "childhoodFundalExamination",
    "childhoodFundalNewbornEyesOpen",
    "childhoodFundalNewbornEyesClosed",
    "childhoodFundalUnclearFindings",
    "childhoodFundalPossibleFinding",
    "childhoodFundalAfterExamination",
    "atomsHandout1",
    "atomsHandout2",
    "fundalReflexPdf",
    "behavioursquiz",
    "childhoodAssessment",
  ]),
  T = !1;
function k() {
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
function x() {
  (k(),
    requestAnimationFrame(() => {
      k();
    }));
}
function y(e) {
  return e ? U[e] || e : "";
}
function X() {
  try {
    let e = sessionStorage.getItem(A),
      o = Number(e);
    if (Number.isInteger(o) && o >= 0 && o < a.length) return o;
  } catch {}
  return null;
}
function s(e) {
  try {
    Number.isInteger(e) && e >= 0 && e < a.length
      ? sessionStorage.setItem(A, String(e))
      : sessionStorage.removeItem(A);
  } catch {}
}
function W() {
  try {
    return sessionStorage.getItem(N) === "1";
  } catch {
    return !1;
  }
}
function R() {
  try {
    return (
      sessionStorage.getItem("medicalStudentsWorkshop:nextFlowEnabled") === "1"
    );
  } catch {
    return !1;
  }
}
function w(e) {
  try {
    e
      ? sessionStorage.setItem(N, "1")
      : (sessionStorage.removeItem(N), sessionStorage.removeItem(v));
  } catch {}
}
function O() {
  try {
    return sessionStorage.getItem(v) === "1";
  } catch {
    return !1;
  }
}
function I(e) {
  try {
    e ? sessionStorage.setItem(v, "1") : sessionStorage.removeItem(v);
  } catch {}
}
function Y(e, o) {
  return (c.get(e) || [])[o - 1] ?? null;
}
function L(e) {
  let o = y(e);
  if (!o) return null;
  let t = (c.get(o) || [])[0] ?? null;
  if (t == null) return null;
  if (!W()) return (w(!0), I(!0), s(t), t);
  let i = X();
  return i != null && a[i]?.target === o ? i : (s(t), t);
}
function j(e) {
  document.querySelectorAll(".page").forEach((n) => {
    n.style.display = "none";
  });
  let o = document.getElementById(e);
  (o && (o.style.display = "block"),
    document.dispatchEvent(
      new CustomEvent("page:shown", { detail: { id: e } }),
    ));
}
function B(e) {
  e &&
    window.__pageShownPatched !== !0 &&
    document.dispatchEvent(
      new CustomEvent("page:shown", { detail: { id: e } }),
    );
}
function J() {
  try {
    (sessionStorage.removeItem("childhoodWorkshop:restoreOpenFolder"),
      sessionStorage.removeItem("childhoodWorkshop:openFolderKey"));
  } catch {}
}
function Z() {
  if (R() || !W()) return !1;
  let e = m();
  return !e || e === "childhoodEyeScreeningWorkshopPage" ? !1 : L(e) != null;
}
async function $() {
  (s(null),
    w(!1),
    I(!1),
    J(),
    l(),
    await h("childhoodEyeScreeningWorkshop", { replace: !0 }));
}
function m() {
  return (
    Array.from(document.querySelectorAll(".page")).find((n) =>
      n?.id ? getComputedStyle(n).display !== "none" : !1,
    )?.id || ""
  );
}
function F(e) {
  if (!e) return !1;
  let o = document.getElementById(e);
  if (!o) return !1;
  let n = o;
  for (; n; ) {
    let t = getComputedStyle(n);
    if (t.display === "none" || t.visibility === "hidden") return !1;
    n = n.parentElement;
  }
  return !0;
}
function ee() {
  let e = document.getElementById("videos");
  e &&
    getComputedStyle(e).visibility === "hidden" &&
    (e.style.visibility = "visible");
}
async function _(e) {
  try {
    let { goToVideosSection: o, showVideosPageById: n } =
      await import("./videos-YJRPAZ42.js");
    (typeof o == "function" && o(e, { skipDefault: !0 }),
      !F(e) && typeof n == "function" && n(e));
  } catch {}
  if (!F(e)) {
    let o = document.getElementById("videos");
    o &&
      o.querySelectorAll(".page").forEach((t) => {
        t.style.display = "none";
      });
    let n = document.getElementById(e);
    n &&
      ((n.style.display = "block"),
      document.dispatchEvent(
        new CustomEvent("page:shown", { detail: { id: e } }),
      ));
  }
  (F(e) && B(e), ee());
}
async function C(e) {
  if (e === E) {
    (await h("childhoodEyeScreeningWorkshop"),
      x(),
      document.dispatchEvent(new CustomEvent(P)));
    return;
  }
  if (z.has(e)) {
    try {
      ((window.__videosPendingTarget = e),
        (window.__videosSuppressFlash = !0),
        sessionStorage.setItem("gotoSubPage", e));
    } catch {}
    if (
      (document.getElementById("videos") || (await h("videos")),
      await _(e),
      !F(e))
    ) {
      try {
        ((window.__videosPendingTarget = e),
          sessionStorage.setItem("gotoSubPage", e));
      } catch {}
      (await h("videos", { replace: !0 }), await _(e));
    }
    (x(), document.dispatchEvent(new CustomEvent(P)));
    return;
  }
  let o = Q[e];
  if (o) {
    let n = o === "childhoodEyeBrainImages" ? e : null;
    (await h(o, n ? { subPageId: n } : void 0),
      !n && typeof window.showPage == "function"
        ? (window.showPage(e), B(e))
        : n || j(e),
      x(),
      document.dispatchEvent(new CustomEvent(P)));
  }
}
function l() {
  document.querySelectorAll(".childhood-next-wrap").forEach((e) => {
    try {
      e.parentElement?.classList.remove(V);
    } catch {}
    e.remove();
  });
}
function g(e) {
  if (R()) {
    l();
    return;
  }
  let o = L(e);
  if (o == null) {
    l();
    return;
  }
  let n = a[o],
    t = y(e);
  if (G.has(t)) {
    l();
    return;
  }
  let i = document.getElementById(t) || document.getElementById(e);
  if (!i) return;
  l();
  let f =
    i.querySelector(".container.pupils-container") ||
    i.querySelector(".container") ||
    i;
  f.classList.add(V);
  let r = document.createElement("div");
  r.className = "childhood-next-wrap";
  let u = document.createElement("button");
  ((u.type = "button"),
    (u.className = "childhood-prev-btn"),
    (u.textContent = "< Previous"),
    u.setAttribute("data-i18n", "i18nLiteral.< Previous"),
    u.addEventListener("click", async () => {
      try {
        sessionStorage.setItem("childhoodWorkshop:restoreOpenFolder", "1");
      } catch {}
      if (n.previous === E) s(null);
      else if (a[o - 1] && a[o - 1].target === n.previous) s(o - 1);
      else {
        let p = c.get(n.previous) || [];
        s(p[0] ?? null);
      }
      await C(n.previous);
    }));
  let d = document.createElement("button");
  ((d.type = "button"),
    (d.className = "childhood-next-btn"),
    (d.textContent = "Next >"),
    d.setAttribute("data-i18n", "i18nLiteral.Next >"));
  let b = S(t) || O();
  (d.classList.toggle("is-ready", b),
    (d.disabled = !b),
    d.setAttribute("aria-disabled", b ? "false" : "true"),
    d.addEventListener("click", async () => {
      if (!S(t) && !O()) return;
      try {
        sessionStorage.setItem("childhoodWorkshop:restoreOpenFolder", "1");
      } catch {}
      let p = o + 1;
      if (a[p] && a[p].target === n.next) s(p);
      else if (n.next === E) s(null);
      else {
        let D = c.get(n.next) || [];
        s(D[0] ?? null);
      }
      await C(n.next);
    }),
    r.appendChild(u),
    r.appendChild(d),
    f.appendChild(r),
    window.I18N?.applyTranslations?.(r));
}
function te() {
  T ||
    ((T = !0),
    document.addEventListener(
      "click",
      (e) => {
        let o = e.target;
        o instanceof Element &&
          o.closest("#backBtnGlobal") &&
          Z() &&
          (e.preventDefault(),
          e.stopPropagation(),
          typeof e.stopImmediatePropagation == "function" &&
            e.stopImmediatePropagation(),
          $());
      },
      !0,
    ),
    document.addEventListener("page:shown", (e) => {
      let o = e?.detail?.id;
      o && g(o);
    }),
    window.addEventListener("page:loaded", (e) => {
      let o = e?.detail?.routeName;
      if (!M.has(o)) {
        (w(!1), s(null), I(!1), l());
        return;
      }
      (o === "childhoodEyeScreeningWorkshop" && l(),
        requestAnimationFrame(() => {
          let n = m();
          n && g(n);
        }));
    }),
    document.addEventListener(P, () => {
      let e = m();
      e && g(e);
    }),
    document.addEventListener(H, () => {
      let e = m();
      e && g(e);
    }),
    document.addEventListener(q, () => {
      let e = m();
      e && g(e);
    }),
    requestAnimationFrame(() => {
      let e = m();
      e && g(e);
    }));
}
function ie(e) {
  if (!e) return;
  let o = new Map();
  e.querySelectorAll(".lesson-row[data-target]").forEach((n) => {
    let t = n.getAttribute("data-target"),
      i = y(t);
    if (!i) return;
    let f = (o.get(i) || 0) + 1;
    o.set(i, f);
    let r = Y(i, f);
    r != null && (n.dataset.nextFlowIndex = String(r));
  });
}
function se(e) {
  if (!e) return;
  (w(!0), I(!1));
  let o = Number(e.dataset.nextFlowIndex);
  if (Number.isInteger(o) && o >= 0 && o < a.length) {
    s(o);
    return;
  }
  let n = e.getAttribute("data-target"),
    t = y(n);
  if (!t) return;
  let i = c.get(t) || [];
  s(i[0] ?? null);
}
export { te as a, ie as b, se as c };
