import { a as p, b as u } from "./chunk-VKQVMSQC.js";
var C = "diabeticWorkshop:progress:",
  w = "diabeticWorkshop:progress-changed",
  b = "#f25600",
  P = "#15e115",
  O = new Set(["diabeticPragmaticScreeningPage"]),
  S = new Set([
    "diabeticArclightPackagePage",
    "diabeticNcdClinicScreeningPage",
    "diabeticOtherEyeDiseasesScreeningPage",
    "diabeticWhatIsDiabetesPage",
    "diabeticTypesOfDiabetesPage",
    "diabeticWhatIsRetinopathyPage",
    "diabeticVisionLossInDiabetesPage",
    "diabeticNcdFlowIntroductionPage",
    "diabeticProliferativeOtherDiseasePage",
    "diabeticSimpleSafeScalableScrollPage",
    "diabeticProtocolOverviewPage",
    "diabeticProtocolPhaseAPage",
    "diabeticProtocolPhaseBPage",
    "diabeticProtocolNcdConsultationPage",
    "diabeticProtocolPhaseCPage",
    "diabeticProtocolFinalDecisionsPage",
    "diabeticObservationFundalReflexPage",
    "diabeticPositioningFlightPathPage",
    "diabeticHowToExaminePage",
    "diabeticBioPreparationPage",
    "diabeticBioFundoscopySittingPage",
    "diabeticBioFundoscopyIndentationPage",
  ]),
  y = !1,
  c = null;
function l(e) {
  let t = Number(e);
  return Number.isFinite(t) ? Math.max(0, Math.min(100, t)) : 0;
}
function x(e) {
  let t = Number(e);
  return !Number.isFinite(t) || t <= 0 ? 0 : Math.round(t);
}
function E(e) {
  try {
    return JSON.parse(localStorage.getItem(e) || "null");
  } catch {
    return null;
  }
}
function F(e, t) {
  try {
    localStorage.setItem(e, JSON.stringify(t));
  } catch {}
}
function T(e) {
  return `${C}${e}`;
}
function k(e) {
  return `videoProgress:${e}`;
}
function v(e) {
  let t = E(e);
  return { percent: l(t?.percent ?? 0), updatedAt: x(t?.updatedAt) };
}
function D(e) {
  if (!e) return { percent: 0, updatedAt: 0 };
  let t = v(T(e)),
    o = v(k(e));
  return t.percent > o.percent
    ? t
    : o.percent > t.percent
      ? o
      : { percent: t.percent, updatedAt: Math.max(t.updatedAt, o.updatedAt) };
}
function m(e) {
  return D(e).percent;
}
function A(e, t, { mode: o = "max" } = {}) {
  if (!e) return 0;
  let r = l(t),
    n = T(e),
    i = E(n) || {},
    a = l(i?.percent ?? 0),
    s = o === "replace" ? r : Math.max(a, r),
    g = r >= 100 && s >= 100;
  return (
    (s !== a || !Number.isFinite(i?.percent) || g) &&
      F(n, { percent: s, updatedAt: Date.now() }),
    document.dispatchEvent(
      new CustomEvent(w, { detail: { target: e, percent: s } }),
    ),
    s
  );
}
function h(e) {
  return A(e, 100);
}
function N(e, t) {
  if (!e) return;
  let o = l(t),
    r = Math.round(o),
    n =
      e.querySelector(".lesson-progress__fill") ||
      e.querySelector(".progress-fill");
  n &&
    ((n.style.width = `${o}%`),
    (n.style.backgroundColor = b),
    n.setAttribute("aria-valuenow", String(r)),
    (n.title = `${r}% complete`));
  let i = e.querySelector('.lesson-progress[role="progressbar"]');
  (i && i.setAttribute("aria-valuenow", String(r)), u(e, o, b));
}
function R(e) {
  return e
    ? Array.from(e.querySelectorAll(".lesson-row[data-target]"))
        .map((t) => t.getAttribute("data-target"))
        .filter(Boolean)
    : [];
}
function H(e, t) {
  if (!e || !t) return [];
  let o = e.querySelector(`.diabetic-section-card[data-section="${t}"]`);
  return R(o);
}
function I(e, t) {
  if (!e || !t) return [];
  let o = e.querySelector(
    `.diabetic-nested-section-card[data-nested-section="${t}"]`,
  );
  return R(o);
}
function W(e) {
  e &&
    (e
      .querySelectorAll(
        "#diabeticWorkshopFolders .diabetic-folder-row[data-folder]",
      )
      .forEach((t) => {
        let o = H(e, t.getAttribute("data-folder")),
          r = o.length > 0 && o.every((i) => m(i) >= 100);
        t.classList.toggle("is-complete", r);
        let n = t.querySelector(".lesson-meta");
        (n && (n.textContent = ""), u(t, r ? 100 : 0, p(t, P)));
      }),
    e
      .querySelectorAll(".diabetic-nested-folder-row[data-nested-folder]")
      .forEach((t) => {
        let o = I(e, t.getAttribute("data-nested-folder")),
          r = o.length > 0 && o.every((i) => m(i) >= 100);
        t.classList.toggle("is-complete", r);
        let n = t.querySelector(".lesson-meta");
        (n && (n.textContent = ""), u(t, r ? 100 : 0, p(t, P)));
      }));
}
function f(e = document) {
  let t =
    e?.querySelector?.("#diabeticRetinopathyWorkshopPage") ||
    document.getElementById("diabeticRetinopathyWorkshopPage");
  t &&
    (t.querySelectorAll(".lesson-row[data-target]").forEach((o) => {
      let r = o.getAttribute("data-target");
      r && N(o, m(r));
    }),
    W(t));
}
function q() {
  let e = document.documentElement,
    t = document.body;
  return {
    scrollTop: window.scrollY ?? e?.scrollTop ?? t?.scrollTop ?? 0,
    viewport: window.innerHeight ?? e?.clientHeight ?? 0,
    fullHeight: Math.max(e?.scrollHeight || 0, t?.scrollHeight || 0),
  };
}
function L() {
  let e = q(),
    t = document.getElementById("page-content");
  if (!t) return e;
  let o = {
      scrollTop: t.scrollTop || 0,
      viewport: t.clientHeight || 0,
      fullHeight: t.scrollHeight || 0,
    },
    r = Math.max(0, o.fullHeight - o.viewport),
    n = Math.max(0, e.fullHeight - e.viewport),
    i = r > 1,
    a = n > 1;
  if (i && !a) return o;
  if (a && !i) return e;
  if (o.scrollTop > 0 && e.scrollTop <= 0) return o;
  if ((e.scrollTop > 0 && o.scrollTop <= 0) || (!i && !a)) return e;
  let s = i ? o.scrollTop / r : 0,
    g = a ? e.scrollTop / n : 0;
  return s >= g ? o : e;
}
function _(e = 8) {
  let { scrollTop: t, viewport: o, fullHeight: r } = L();
  return t + o >= r - e;
}
function B() {
  let { scrollTop: e, viewport: t, fullHeight: o } = L();
  return o <= 0 || t <= 0 ? 0 : o <= t + 1 ? 100 : l(((e + t) / o) * 100);
}
function d() {
  if (!c) return;
  let e = B();
  if (!(e <= 0)) {
    if (_()) {
      h(c);
      return;
    }
    A(c, Math.min(99, e));
  }
}
function $() {
  if (y) return;
  ((y = !0),
    window.addEventListener("page:loaded", (t) => {
      let o = t?.detail?.routeName;
      if (o === "diabeticRetinopathyWorkshop") {
        f();
        return;
      }
      o !== "videos" && o !== "glaucomaQuizCaseStudy" && (c = null);
    }),
    document.addEventListener("page:shown", (t) => {
      let o = t?.detail?.id;
      if (o) {
        if (O.has(o)) {
          (h(o), (c = null));
          return;
        }
        if (S.has(o)) {
          ((c = o),
            requestAnimationFrame(() => {
              d();
            }));
          return;
        }
        (o === "diabeticRetinopathyWorkshopPage" && f(), (c = null));
      }
    }),
    document.addEventListener(w, () => {
      f();
    }),
    document.addEventListener("childhoodWorkshop:route-complete", (t) => {
      let o = String(t?.detail?.target || "").trim();
      S.has(o) && h(o);
    }),
    window.addEventListener("scroll", d, { passive: !0 }),
    window.addEventListener("resize", d, { passive: !0 }),
    document
      .getElementById("page-content")
      ?.addEventListener("scroll", d, { passive: !0 }));
}
export { A as a, f as b, $ as c };
