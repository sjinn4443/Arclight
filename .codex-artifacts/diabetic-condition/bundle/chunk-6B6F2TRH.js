import { a as P, b as v } from "./chunk-VKQVMSQC.js";
var W = "glaucomaWorkshop:progress:",
  O = "glaucomaWorkshop:progress-changed",
  $ = "glaucomaWorkshop:folderCompletedAt:",
  z = "#15e115",
  K = new Set([
    "glaucomaWhatIs",
    "glaucomaTypes",
    "glaucomaDiagnosis",
    "glaucomaIntro",
    "glaucomaPOAGACAG",
    "glaucomaVisionIntro",
    "glaucomaTestingVisualAcuity",
    "glaucomaFieldsIntro",
    "glaucomaFieldsExam",
    "glaucomaQuadrantsFingers",
    "glaucomaQuadrantsRed",
    "glaucomaAssessRecord",
    "glaucomaPupilReactions",
    "glaucomaSwingRAPD",
    "glaucomaRAPDFullSwingInteractive",
    "frontOfEyePage",
    "glaucomaFrontFindings",
    "glaucomaACDScroll",
    "glaucomaHighIOP",
    "glaucomaACDInteractive",
    "fundalReflexPage",
    "glaucomaOpticNerve",
    "glaucomaCupping",
    "glaucomaSummaryScrolly",
  ]),
  J = new Set([
    "glaucomaFieldsExam",
    "glaucomaQuadrantsFingers",
    "glaucomaQuadrantsRed",
    "glaucomaAssessRecord",
    "glaucomaSwingRAPD",
    "glaucomaRAPDFullSwingInteractive",
    "glaucomaACDScroll",
    "glaucomaHighIOP",
    "glaucomaOpticNerve",
    "glaucomaCupping",
  ]),
  Q = new Set([
    "glaucomaFundusSummaryAtomsPage",
    "glaucomaGlaucomaSummaryAtomsPage",
  ]),
  L = !1,
  p = null,
  y = "glaucoma-scroll-fit";
function T(e) {
  let t = e?.parentElement ?? null;
  for (; t && t !== document.body; ) {
    let o = window.getComputedStyle(t),
      n = o.overflowY || o.overflow;
    if (/(auto|scroll|overlay)/.test(n)) return t;
    t = t.parentElement;
  }
  return window;
}
function V(e) {
  if (e === window)
    return {
      top: 0,
      height: window.innerHeight || document.documentElement.clientHeight || 1,
    };
  let t = e.getBoundingClientRect();
  return { top: t.top, height: e.clientHeight || t.height || 1 };
}
function Y(e) {
  let t = e;
  for (; t; ) {
    let o = window.getComputedStyle(t);
    if (o.display === "none" || o.visibility === "hidden") return !1;
    t = t.parentElement;
  }
  return !0;
}
function U(e) {
  e.dataset.glaucomaLevel = J.has(e.id) ? "intermediate" : "primary";
}
function H(e) {
  if (!e?.classList?.contains("glaucoma-scrolly-page")) return;
  (U(e),
    typeof e._glaucomaScrollyCleanup == "function" &&
      e._glaucomaScrollyCleanup());
  let t = Array.from(e.querySelectorAll("[data-glaucoma-scroll-step]"));
  if (!t.length) return;
  let o = new AbortController(),
    { signal: n } = o,
    l = T(e),
    r = 0,
    a = () => {
      if (((r = 0), !Y(e))) return;
      let i = T(e),
        u = V(i),
        d = u.top + u.height * 0.12,
        g = u.top + u.height * 0.84,
        R = !1;
      t.forEach((h, D) => {
        let A = h.getBoundingClientRect(),
          F = A.top < g && A.bottom > d;
        ((F || (D === 0 && A.top < g)) && h.classList.add("is-visible"),
          F && !R
            ? (h.classList.add("is-current"), (R = !0))
            : h.classList.remove("is-current"));
      });
    },
    c = () => {
      r || (r = window.requestAnimationFrame(a));
    },
    s = (i, u, d, g = {}) => {
      i?.addEventListener && i.addEventListener(u, d, { ...g, signal: n });
    };
  s(window, "scroll", c, { passive: !0 });
  let m = document.getElementById("page-content");
  (s(m, "scroll", c, { passive: !0 }),
    l !== window && l !== m && s(l, "scroll", c, { passive: !0 }),
    s(window, "resize", c, { passive: !0 }),
    s(window, "orientationchange", c, { passive: !0 }),
    e.querySelectorAll("img").forEach((i) => {
      i.complete ||
        (s(i, "load", c, { once: !0 }), s(i, "error", c, { once: !0 }));
    }),
    (e._glaucomaScrollyCleanup = () => {
      (o.abort(),
        r && window.cancelAnimationFrame(r),
        delete e._glaucomaScrollyCleanup);
    }),
    window.requestAnimationFrame(c));
}
function X(e = document) {
  e.querySelectorAll?.(".glaucoma-scrolly-page").forEach((t) => H(t));
}
function f(e) {
  let t = Number(e);
  return Number.isFinite(t) ? Math.max(0, Math.min(100, t)) : 0;
}
function C(e) {
  let t = Number(e);
  return !Number.isFinite(t) || t <= 0 ? 0 : Math.round(t);
}
function q(e) {
  let t = Number(e);
  return !Number.isFinite(t) || t <= 0 ? 0 : Math.floor(t);
}
function E(e) {
  try {
    return JSON.parse(localStorage.getItem(e) || "null");
  } catch {
    return null;
  }
}
function B(e, t) {
  try {
    localStorage.setItem(e, JSON.stringify(t));
  } catch {}
}
function M(e) {
  return `${W}${e}`;
}
function j(e) {
  return `videoProgress:${e}`;
}
function N(e) {
  return `${$}${e}`;
}
function I(e) {
  let t = E(e);
  return { percent: f(t?.percent ?? 0), updatedAt: C(t?.updatedAt) };
}
function _(e) {
  if (!e) return { percent: 0, updatedAt: 0 };
  let t = I(M(e)),
    o = I(j(e));
  return t.percent > o.percent
    ? t
    : o.percent > t.percent
      ? o
      : { percent: t.percent, updatedAt: Math.max(t.updatedAt, o.updatedAt) };
}
function Z(e) {
  if (!e) return { count: 0, completedAt: 0 };
  let t = E(N(e)),
    o = C(t?.completedAt);
  return { count: q(t?.count) || (o ? 1 : 0), completedAt: o };
}
function ee(e, { count: t, completedAt: o }) {
  if (!e) return;
  let n = q(t),
    l = C(o);
  !n || !l || B(N(e), { count: n, completedAt: l });
}
function te(e) {
  e &&
    ((e.textContent = ""), e.classList.remove("glaucoma-folder-complete-meta"));
}
function oe(e, t) {
  let o = e?.querySelector(".lesson-meta");
  (o && te(o), v(e, t ? 100 : 0, P(e, z)));
}
function ne(e) {
  e?.querySelectorAll?.(".glaucoma-folder-complete-rank-date").forEach((t) =>
    t.remove(),
  );
}
function re(e) {
  ne(e);
}
function le(e) {
  return _(e).percent;
}
function k(e, t, { mode: o = "max" } = {}) {
  if (!e) return 0;
  let n = f(t),
    l = M(e),
    r = E(l) || {},
    a = f(r?.percent ?? 0),
    c = o === "replace" ? n : Math.max(a, n),
    s = n >= 100 && c >= 100;
  return (
    (c !== a || !Number.isFinite(r?.percent) || s) &&
      B(l, { percent: c, updatedAt: Date.now() }),
    document.dispatchEvent(
      new CustomEvent(O, { detail: { target: e, percent: c } }),
    ),
    c
  );
}
function x(e) {
  return k(e, 100);
}
function ae(e, t) {
  if (!e) return;
  let o = f(t),
    n = Math.round(o),
    l =
      e.querySelector(".lesson-progress__fill") ||
      e.querySelector(".progress-fill");
  l &&
    ((l.style.width = `${o}%`),
    l.setAttribute("aria-valuenow", String(n)),
    (l.title = `${n}% complete`));
  let r = e.querySelector('.lesson-progress[role="progressbar"]');
  (r && r.setAttribute("aria-valuenow", String(n)), v(e, o));
}
function ce(e, t) {
  if (!e || !t) return [];
  let o = e.querySelector(`.glaucoma-section-card[data-section="${t}"]`);
  return o
    ? Array.from(o.querySelectorAll(".lesson-row[data-target]"))
        .map((n) => n.getAttribute("data-target"))
        .filter(Boolean)
    : [];
}
function se(e) {
  if (!e) return;
  e.querySelectorAll(
    "#glaucomaWorkshopFolders .glaucoma-folder-row[data-folder]",
  ).forEach((o) => {
    let n = o.getAttribute("data-folder"),
      l = ce(e, n),
      r = l.map((d) => _(d)),
      a = l.length > 0 && r.every((d) => d.percent >= 100),
      c = r.reduce((d, g) => Math.max(d, g.updatedAt), 0),
      s = Z(n),
      m = s.count,
      i = s.completedAt,
      u = !1;
    (a &&
      (!m || !i
        ? ((m = 1), (i = c || Date.now()), (u = !0))
        : r.length > 0 &&
          r.every((g) => g.updatedAt > i) &&
          ((m += 1), (i = c || Date.now()), (u = !0))),
      u && ee(n, { count: m, completedAt: i }),
      o.classList.toggle("is-complete", a),
      oe(o, a),
      re(o, a, i, m));
  });
}
function b(e = document) {
  let t =
    e?.querySelector?.("#glaucomaWorkshopPage") ||
    document.getElementById("glaucomaWorkshopPage");
  t &&
    (t.querySelectorAll(".lesson-row[data-target]").forEach((o) => {
      let n = o.getAttribute("data-target");
      n && ae(o, le(n));
    }),
    se(t));
}
function ie() {
  let e = document.documentElement,
    t = document.body;
  return {
    scrollTop: window.scrollY ?? e?.scrollTop ?? t?.scrollTop ?? 0,
    viewport: window.innerHeight ?? e?.clientHeight ?? 0,
    fullHeight: Math.max(e?.scrollHeight || 0, t?.scrollHeight || 0),
  };
}
function G() {
  let e = ie(),
    t = document.getElementById("page-content");
  if (!t) return e;
  let o = {
      scrollTop: t.scrollTop || 0,
      viewport: t.clientHeight || 0,
      fullHeight: t.scrollHeight || 0,
    },
    n = Math.max(0, o.fullHeight - o.viewport),
    l = Math.max(0, e.fullHeight - e.viewport),
    r = n > 1,
    a = l > 1;
  if (r && !a) return o;
  if (a && !r) return e;
  if (o.scrollTop > 0 && e.scrollTop <= 0) return o;
  if ((e.scrollTop > 0 && o.scrollTop <= 0) || (!r && !a)) return e;
  let c = r ? o.scrollTop / n : 0,
    s = a ? e.scrollTop / l : 0;
  return c >= s ? o : e;
}
function ue(e = 8) {
  let { scrollTop: t, viewport: o, fullHeight: n } = G();
  return t + o >= n - e;
}
function de() {
  let { scrollTop: e, viewport: t, fullHeight: o } = G();
  return o <= 0 || t <= 0 ? 0 : o <= t + 1 ? 100 : f(((e + t) / o) * 100);
}
function S() {
  if (!p) return;
  let e = de();
  if (!(e <= 0)) {
    if (ue()) {
      x(p);
      return;
    }
    k(p, Math.min(99, e));
  }
}
function me() {
  document.querySelectorAll(`.${y}`).forEach((e) => {
    e.classList.remove(y);
  });
}
function ge(e) {
  if (!e) return null;
  let t = e.querySelector(".container.pupils-container");
  if (!t) return null;
  let o = Array.from(t.children).filter(
    (a) =>
      !a.classList.contains("eyes-topbar") &&
      a.tagName !== "STYLE" &&
      a.tagName !== "SCRIPT",
  );
  if (o.length !== 1) return null;
  let n = o[0];
  return !Array.from(n.querySelectorAll(":scope > img")).length ||
    Array.from(n.children).filter((a) => a.tagName !== "IMG").length
    ? null
    : n;
}
function pe(e) {
  let t = document.getElementById(e);
  if (!t) return;
  t.classList.remove(y);
  let o = ge(t);
  if (!o) return;
  let n = t.querySelector(".container.pupils-container"),
    l = n?.querySelector(".eyes-topbar"),
    r = getComputedStyle(t),
    a = l?.getBoundingClientRect().height || 0,
    c = getComputedStyle(n),
    s = getComputedStyle(o),
    m = 0;
  (o.querySelectorAll(":scope > img").forEach((u) => {
    let d = u.getBoundingClientRect(),
      g = getComputedStyle(u);
    m +=
      d.height +
      (parseFloat(g.marginTop) || 0) +
      (parseFloat(g.marginBottom) || 0);
  }),
    (parseFloat(r.paddingTop) || 0) +
      (parseFloat(r.paddingBottom) || 0) +
      a +
      (parseFloat(c.paddingTop) || 0) +
      (parseFloat(c.paddingBottom) || 0) +
      (parseFloat(s.paddingTop) || 0) +
      (parseFloat(s.paddingBottom) || 0) +
      m <=
      (window.innerHeight || 0) - 8 && t.classList.add(y));
}
function w(e) {
  e &&
    requestAnimationFrame(() => {
      (pe(e), S());
    });
}
function fe(e) {
  let t = document.getElementById(e);
  t &&
    t.querySelectorAll("img").forEach((o) => {
      o.complete ||
        (o.addEventListener(
          "load",
          () => {
            w(e);
          },
          { once: !0 },
        ),
        o.addEventListener(
          "error",
          () => {
            w(e);
          },
          { once: !0 },
        ));
    });
}
function ye() {
  if (L) return;
  ((L = !0),
    window.addEventListener("page:loaded", (t) => {
      let o = t?.detail?.routeName;
      (o !== "glaucomaScrollImages" && ((p = null), me()),
        o === "glaucomaScrollImages" && X(),
        o === "glaucomaWorkshop" && b());
    }),
    document.addEventListener("page:shown", (t) => {
      let o = t?.detail?.id;
      if (o) {
        if ((Q.has(o) && x(o), K.has(o))) {
          ((p = o), H(document.getElementById(o)), w(o), fe(o));
          return;
        }
        p = null;
      }
    }),
    document.addEventListener(O, () => {
      b();
    }),
    window.addEventListener("scroll", S, { passive: !0 }),
    window.addEventListener("resize", S, { passive: !0 }),
    window.addEventListener(
      "resize",
      () => {
        w(p);
      },
      { passive: !0 },
    ),
    document
      .getElementById("page-content")
      ?.addEventListener("scroll", S, { passive: !0 }));
}
export { X as a, le as b, k as c, x as d, b as e, ye as f };
