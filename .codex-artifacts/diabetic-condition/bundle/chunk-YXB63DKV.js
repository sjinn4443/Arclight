import { a as L, b as P } from "./chunk-VKQVMSQC.js";
var B = "childhoodWorkshop:progress:",
  O = "childhoodWorkshop:progress-changed",
  W = "childhoodWorkshop:folderCompletedAt:",
  D = "childhoodWorkshop:route-complete",
  V = "glaucomaWorkshop:progress-changed",
  $ = "#15e115",
  x = new Set([
    "childhoodEyeBrainImagesPage",
    "childhoodIntroVisualDevelopmentPage",
    "childhoodNormalVisualDevelopmentPage",
    "childhoodAskQuestionsObservePage",
    "visualImpairmentPage",
    "signsVICasesPage",
    "childhoodReferPage",
    "childhoodFundalPreparationPage",
    "childhoodFundalExaminationPage",
    "childhoodFundalNewbornEyesOpenPage",
    "childhoodFundalNewbornEyesClosedPage",
    "childhoodFundalUnclearFindingsPage",
    "childhoodFundalPossibleFindingPage",
    "childhoodFundalAfterExaminationPage",
    "fundalReflexExaminationScrollPage",
  ]),
  U = new Set([
    "childhoodFundalPreparationPage",
    "childhoodFundalExaminationPage",
    "childhoodFundalNewbornEyesOpenPage",
    "childhoodFundalNewbornEyesClosedPage",
    "childhoodFundalUnclearFindingsPage",
    "childhoodFundalPossibleFindingPage",
    "childhoodFundalAfterExaminationPage",
    "fundalReflexExaminationScrollPage",
  ]),
  G = new Set([
    "atomsHandout1Page",
    "atomsHandout2Page",
    "fundalReflexPdfPage",
  ]),
  K = new Set([
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
    "fundalReflexExaminationScroll",
  ]),
  T = !1,
  a = null,
  w = new Set(),
  S = "childhood-scroll-fit";
function g(e) {
  let t = Number(e);
  return Number.isFinite(t) ? Math.max(0, Math.min(100, t)) : 0;
}
function v(e) {
  let t = Number(e);
  return !Number.isFinite(t) || t <= 0 ? 0 : Math.round(t);
}
function I(e) {
  let t = Number(e);
  return !Number.isFinite(t) || t <= 0 ? 0 : Math.floor(t);
}
function R(e) {
  try {
    return JSON.parse(localStorage.getItem(e) || "null");
  } catch {
    return null;
  }
}
function N(e, t) {
  try {
    localStorage.setItem(e, JSON.stringify(t));
  } catch {}
}
function H(e) {
  return `${B}${e}`;
}
function J(e) {
  return `videoProgress:${e}`;
}
function k(e) {
  return `${W}${e}`;
}
function b(e) {
  let t = R(e);
  return { percent: g(t?.percent ?? 0), updatedAt: v(t?.updatedAt) };
}
function _(e) {
  if (!e) return { percent: 0, updatedAt: 0 };
  let t = b(H(e)),
    o = b(J(e));
  return t.percent > o.percent
    ? t
    : o.percent > t.percent
      ? o
      : { percent: t.percent, updatedAt: Math.max(t.updatedAt, o.updatedAt) };
}
function z(e) {
  if (!e) return { count: 0, completedAt: 0 };
  let t = R(k(e)),
    o = v(t?.completedAt);
  return { count: I(t?.count) || (o ? 1 : 0), completedAt: o };
}
function X(e, { count: t, completedAt: o }) {
  if (!e) return;
  let n = I(t),
    r = v(o);
  !n || !r || N(k(e), { count: n, completedAt: r });
}
function Y(e) {
  e &&
    ((e.textContent = ""),
    e.classList.remove("childhood-folder-complete-meta"));
}
function Q(e, t) {
  let o = e?.querySelector(".lesson-meta");
  (o && Y(o), P(e, t ? 100 : 0, L(e, $)));
}
function j(e) {
  e?.querySelectorAll?.(".childhood-folder-complete-rank-date").forEach((t) =>
    t.remove(),
  );
}
function Z(e) {
  j(e);
}
function F(e) {
  return _(e).percent;
}
function ee(e) {
  return x.has(e);
}
function fe(e) {
  return e ? (ee(e) && w.has(e)) || F(e) >= 100 : !1;
}
function y(e, t, { mode: o = "max" } = {}) {
  if (!e) return 0;
  let n = g(t),
    r = H(e),
    l = R(r) || {},
    i = g(l?.percent ?? 0),
    s = o === "replace" ? n : Math.max(i, n),
    c = n >= 100 && s >= 100;
  return (
    (s !== i || !Number.isFinite(l?.percent) || c) &&
      N(r, { percent: s, updatedAt: Date.now() }),
    document.dispatchEvent(
      new CustomEvent(O, { detail: { target: e, percent: s } }),
    ),
    s
  );
}
function A(e) {
  return y(e, 100);
}
function te(e, t) {
  if (!e) return;
  let o = g(t),
    n = Math.round(o),
    r =
      e.querySelector(".lesson-progress__fill") ||
      e.querySelector(".progress-fill");
  r &&
    ((r.style.width = `${o}%`),
    r.setAttribute("aria-valuenow", String(n)),
    (r.title = `${n}% complete`));
  let l = e.querySelector('.lesson-progress[role="progressbar"]');
  (l && l.setAttribute("aria-valuenow", String(n)), P(e, o));
}
function oe(e, t) {
  if (!e || !t) return [];
  let o = e.querySelector(`.childhood-section-card[data-section="${t}"]`);
  return M(o);
}
function M(e) {
  return e
    ? Array.from(e.querySelectorAll(".lesson-row[data-target]"))
        .map((t) => t.getAttribute("data-target"))
        .filter(Boolean)
    : [];
}
function ne(e) {
  if (!e) return [];
  let t = Array.from(
      e.querySelectorAll(
        "#childhoodWorkshopFolders .childhood-folder-row[data-folder]",
      ),
    ).map((n) => {
      let r = n.getAttribute("data-folder");
      return { row: n, sectionKey: r, targets: oe(e, r) };
    }),
    o = Array.from(e.querySelectorAll(".lesson-row--folder[aria-controls]"))
      .map((n) => {
        let r = String(n.getAttribute("aria-controls") || "").trim();
        if (!r) return null;
        let l = document.getElementById(r);
        if (!l || !e.contains(l)) return null;
        let i = String(
          n.getAttribute("data-folder-progress-key") || n.id || r,
        ).trim();
        return i ? { row: n, sectionKey: i, targets: M(l) } : null;
      })
      .filter(Boolean);
  return [...t, ...o];
}
function re(e) {
  if (!e) return;
  ne(e).forEach(({ row: o, sectionKey: n, targets: r }) => {
    let l = r.map((u) => _(u)),
      i = r.length > 0 && l.every((u) => u.percent >= 100),
      s = l.reduce((u, f) => Math.max(u, f.updatedAt), 0),
      c = z(n),
      d = c.count,
      h = c.completedAt,
      p = !1;
    (i &&
      (!d || !h
        ? ((d = 1), (h = s || Date.now()), (p = !0))
        : l.length > 0 &&
          l.every((f) => f.updatedAt > h) &&
          ((d += 1), (h = s || Date.now()), (p = !0))),
      p && X(n, { count: d, completedAt: h }),
      o.classList.toggle("is-complete", i),
      Q(o, i),
      Z(o, i, h, d));
  });
}
function C(e = document) {
  let t =
    e?.querySelector?.("#childhoodEyeScreeningWorkshopPage") ||
    document.getElementById("childhoodEyeScreeningWorkshopPage");
  t &&
    (t.querySelectorAll(".lesson-row[data-target]").forEach((o) => {
      let n = o.getAttribute("data-target");
      n && te(o, F(n));
    }),
    re(t));
}
function le() {
  let e = document.documentElement,
    t = document.body;
  return {
    scrollTop: window.scrollY ?? e?.scrollTop ?? t?.scrollTop ?? 0,
    viewport: window.innerHeight ?? e?.clientHeight ?? 0,
    fullHeight: Math.max(e?.scrollHeight || 0, t?.scrollHeight || 0),
  };
}
function q() {
  let e = le(),
    t = document.getElementById("page-content");
  if (!t) return e;
  let o = {
      scrollTop: t.scrollTop || 0,
      viewport: t.clientHeight || 0,
      fullHeight: t.scrollHeight || 0,
    },
    n = Math.max(0, o.fullHeight - o.viewport),
    r = Math.max(0, e.fullHeight - e.viewport),
    l = n > 1,
    i = r > 1;
  if (l && !i) return o;
  if (i && !l) return e;
  if (o.scrollTop > 0 && e.scrollTop <= 0) return o;
  if ((e.scrollTop > 0 && o.scrollTop <= 0) || (!l && !i)) return e;
  let s = l ? o.scrollTop / n : 0,
    c = i ? e.scrollTop / r : 0;
  return s >= c ? o : e;
}
function ie(e = 8) {
  let { scrollTop: t, viewport: o, fullHeight: n } = q();
  return t + o >= n - e;
}
function se() {
  let { scrollTop: e, viewport: t, fullHeight: o } = q();
  return o <= 0 || t <= 0 ? 0 : o <= t + 1 ? 100 : g(((e + t) / o) * 100);
}
function m() {
  if (!a) return;
  let e = se();
  if (!(e <= 0)) {
    if (U.has(a)) {
      y(a, Math.min(99, e));
      return;
    }
    if (ie()) {
      (w.add(a), A(a));
      return;
    }
    y(a, Math.min(99, e));
  }
}
function ae() {
  document.querySelectorAll(`.${S}`).forEach((e) => {
    e.classList.remove(S);
  });
}
function ce(e) {
  if (!e) return null;
  let t = e.querySelector(".container.pupils-container");
  if (!t) return null;
  let o = Array.from(t.children).filter(
    (i) =>
      !i.classList.contains("eyes-topbar") &&
      i.tagName !== "STYLE" &&
      i.tagName !== "SCRIPT",
  );
  if (o.length !== 1) return null;
  let n = o[0];
  return !Array.from(n.querySelectorAll(":scope > img")).length ||
    Array.from(n.children).filter((i) => i.tagName !== "IMG").length
    ? null
    : n;
}
function de(e) {
  let t = document.getElementById(e);
  if (!t) return;
  t.classList.remove(S);
  let o = ce(t);
  if (!o) return;
  let n = t.querySelector(".container.pupils-container"),
    r = n?.querySelector(".eyes-topbar"),
    l = getComputedStyle(t),
    i = r?.getBoundingClientRect().height || 0,
    s = getComputedStyle(n),
    c = getComputedStyle(o),
    d = 0;
  (o.querySelectorAll(":scope > img").forEach((p) => {
    let u = p.getBoundingClientRect(),
      f = getComputedStyle(p);
    d +=
      u.height +
      (parseFloat(f.marginTop) || 0) +
      (parseFloat(f.marginBottom) || 0);
  }),
    (parseFloat(l.paddingTop) || 0) +
      (parseFloat(l.paddingBottom) || 0) +
      i +
      (parseFloat(s.paddingTop) || 0) +
      (parseFloat(s.paddingBottom) || 0) +
      (parseFloat(c.paddingTop) || 0) +
      (parseFloat(c.paddingBottom) || 0) +
      d <=
      (window.innerHeight || 0) - 8 && t.classList.add(S));
}
function E(e) {
  e &&
    requestAnimationFrame(() => {
      (de(e), m());
    });
}
function ue(e) {
  let t = document.getElementById(e);
  t &&
    t.querySelectorAll("img").forEach((o) => {
      o.complete ||
        (o.addEventListener(
          "load",
          () => {
            E(e);
          },
          { once: !0 },
        ),
        o.addEventListener(
          "error",
          () => {
            E(e);
          },
          { once: !0 },
        ));
    });
}
function he() {
  C();
}
function ge() {
  if (T) return;
  ((T = !0),
    window.addEventListener("page:loaded", (t) => {
      let o = t?.detail?.routeName;
      (K.has(o) || ((a = null), ae()),
        o === "childhoodEyeScreeningWorkshop" && C());
    }),
    document.addEventListener("page:shown", (t) => {
      let o = t?.detail?.id;
      if (o) {
        if ((G.has(o) && A(o), x.has(o))) {
          (w.delete(o), (a = o), E(o), ue(o));
          return;
        }
        a = null;
      }
    }),
    document.addEventListener(D, (t) => {
      let o = t?.detail?.target;
      o && A(o);
    }),
    document.addEventListener(O, () => {
      C();
    }),
    document.addEventListener(V, he),
    window.addEventListener("scroll", m, { passive: !0 }),
    window.addEventListener("resize", m, { passive: !0 }),
    window.addEventListener(
      "resize",
      () => {
        E(a);
      },
      { passive: !0 },
    ),
    document
      .getElementById("page-content")
      ?.addEventListener("scroll", m, { passive: !0 }));
}
export { fe as a, y as b, C as c, ge as d };
