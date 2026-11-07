import { b as F } from "./chunk-6B6F2TRH.js";
import { s as l } from "./chunk-C3DWFWW5.js";
var p = "__glaucomaWorkshopHome__",
  v = "glaucomaWorkshop:nextFlowIndex",
  I = "glaucomaWorkshop:nextFlowEnabled",
  r = "glaucomaWorkshop:nextflow-changed",
  D = "glaucomaWorkshop:progress-changed",
  O = "glaucoma-next-host",
  _ = { glaucomaVisualFieldExamVideo: "glaucomaVisualFieldExamVideoPage" },
  W = new Set([
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
    "glaucomaACDInteractive",
    "glaucomaACDScroll",
    "glaucomaHighIOP",
    "fundalReflexPage",
    "glaucomaOpticNerve",
    "glaucomaCupping",
    "glaucomaSummaryScrolly",
  ]),
  R = new Set([
    "vaWhoPage",
    "vaNearVisionPage",
    "glaucomaVisualFieldExamVideoPage",
    "pupilFullExamPage",
    "glaucomaPupilReactionsVideoPage",
    "feFullAnteriorSegmentPage",
    "glaucomaSignsOfGlaucomaVideoPage",
    "glaucomaAnteriorChamberDepthVideoPage",
    "glaucomaACAGCaseWorkshopVideoPage",
    "glaucomaFundalReflexDiseaseVideoPage",
    "directOphthalmoscopyVideoPage",
    "glaucomaDirectOphthalmoscopyDiscsAnnotatedVideoPage",
    "glaucomaOpticDiscAnatomyVideoPage",
    "glaucomaMarginVideoPage",
    "glaucomaDiscCuppingVideoPage",
    "glaucomaOtherOpticNerveDiseasesVideoPage",
  ]),
  k = new Set(["glaucomaQuizCaseStudy", "glaucomaSecondaryCauseQuizPage"]),
  L = new Set(["glaucomaHistoryCaseStudy"]),
  G = new Set([
    "glaucomaFundusSummaryAtomsPage",
    "glaucomaGlaucomaSummaryAtomsPage",
  ]),
  B = [
    ["glaucomaWhatIs", "glaucomaTypes", "glaucomaDiagnosis"],
    ["glaucomaIntro", "glaucomaPOAGACAG", "glaucomaHistoryCaseStudy"],
    [
      "glaucomaVisionIntro",
      "glaucomaTestingVisualAcuity",
      "vaWhoPage",
      "vaNearVisionPage",
    ],
    [
      "glaucomaFieldsIntro",
      "glaucomaFieldsExam",
      "glaucomaQuadrantsFingers",
      "glaucomaQuadrantsRed",
      "glaucomaAssessRecord",
      "glaucomaVisualFieldExamVideoPage",
      "glaucomaPupilReactions",
      "pupilFullExamPage",
      "glaucomaPupilReactionsVideoPage",
      "glaucomaSwingRAPD",
      "glaucomaRAPDFullSwingInteractive",
    ],
    [
      "frontOfEyePage",
      "feFullAnteriorSegmentPage",
      "glaucomaFrontFindings",
      "glaucomaSignsOfGlaucomaVideoPage",
      "glaucomaACDInteractive",
      "glaucomaAnteriorChamberDepthVideoPage",
      "glaucomaSecondaryCauseQuizPage",
      "glaucomaACDScroll",
      "glaucomaHighIOP",
      "glaucomaACAGCaseWorkshopVideoPage",
    ],
    [
      "fundalReflexPage",
      "glaucomaFundalReflexDiseaseVideoPage",
      "directOphthalmoscopyVideoPage",
      "glaucomaDirectOphthalmoscopyDiscsAnnotatedVideoPage",
      "glaucomaOpticNerve",
      "glaucomaOpticDiscAnatomyVideoPage",
      "glaucomaMarginVideoPage",
      "glaucomaDiscCuppingVideoPage",
      "glaucomaCupping",
      "glaucomaDiscCuppingVideoPage",
      "glaucomaOtherOpticNerveDiseasesVideoPage",
      "glaucomaQuizCaseStudy",
    ],
    [
      "glaucomaSummaryScrolly",
      "glaucomaFundusSummaryAtomsPage",
      "glaucomaGlaucomaSummaryAtomsPage",
    ],
  ],
  i = [],
  g = new Map();
for (let e of B)
  for (let o = 0; o < e.length; o += 1) {
    let a = e[o];
    i.push({ target: a, previous: e[o - 1] || p, next: e[o + 1] || p });
  }
i.forEach((e, o) => {
  let a = g.get(e.target) || [];
  (a.push(o), g.set(e.target, a));
});
var x = !1;
function C() {
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
function d() {
  (C(),
    requestAnimationFrame(() => {
      C();
    }));
}
function P(e) {
  return e ? _[e] || e : "";
}
function H() {
  try {
    let e = sessionStorage.getItem(v),
      o = Number(e);
    if (Number.isInteger(o) && o >= 0 && o < i.length) return o;
  } catch {}
  return null;
}
function s(e) {
  try {
    Number.isInteger(e) && e >= 0 && e < i.length
      ? sessionStorage.setItem(v, String(e))
      : sessionStorage.removeItem(v);
  } catch {}
}
function q() {
  try {
    return sessionStorage.getItem(I) === "1";
  } catch {
    return !1;
  }
}
function A(e) {
  try {
    e ? sessionStorage.setItem(I, "1") : sessionStorage.removeItem(I);
  } catch {}
}
function Q(e, o) {
  return (g.get(e) || [])[o - 1] ?? null;
}
function z(e) {
  let o = P(e);
  if (!o) return null;
  let t = (g.get(o) || [])[0] ?? null;
  if (t == null) return null;
  if (!q()) return (A(!0), s(t), t);
  let n = H();
  return n != null && i[n]?.target === o ? n : (s(t), t);
}
function S(e) {
  document.querySelectorAll(".page").forEach((a) => {
    a.style.display = "none";
  });
  let o = document.getElementById(e);
  (o && (o.style.display = "block"),
    document.dispatchEvent(
      new CustomEvent("page:shown", { detail: { id: e } }),
    ));
}
function E() {
  return (
    Array.from(document.querySelectorAll(".page")).find((a) =>
      a?.id ? getComputedStyle(a).display !== "none" : !1,
    )?.id || ""
  );
}
function V(e) {
  if (!e) return !1;
  let o = document.getElementById(e);
  return o ? getComputedStyle(o).display !== "none" : !1;
}
async function M(e) {
  try {
    let { goToVideosSection: o, showVideosPageById: a } =
      await import("./videos-YJRPAZ42.js");
    (typeof o == "function" && o(e, { skipDefault: !0 }),
      !V(e) && typeof a == "function" && a(e));
  } catch {}
  if (!V(e)) {
    let o = document.getElementById("videos");
    o &&
      o.querySelectorAll(".page").forEach((t) => {
        t.style.display = "none";
      });
    let a = document.getElementById(e);
    a &&
      ((a.style.display = "block"),
      document.dispatchEvent(
        new CustomEvent("page:shown", { detail: { id: e } }),
      ));
  }
}
async function T(e) {
  if (e === p) {
    (await l("glaucomaWorkshop"),
      d(),
      document.dispatchEvent(new CustomEvent(r)));
    return;
  }
  if (W.has(e)) {
    (await l("glaucomaScrollImages"),
      typeof window.showPage == "function" ? window.showPage(e) : S(e),
      d(),
      document.dispatchEvent(new CustomEvent(r)));
    return;
  }
  if (R.has(e)) {
    try {
      ((window.__videosPendingTarget = e),
        (window.__videosSuppressFlash = !0),
        sessionStorage.setItem("gotoSubPage", e));
    } catch {}
    (document.getElementById("videos") || (await l("videos")),
      await M(e),
      d(),
      document.dispatchEvent(new CustomEvent(r)));
    return;
  }
  if (L.has(e)) {
    (await l("glaucomaHistoryCaseStudy"),
      typeof window.showPage == "function" ? window.showPage(e) : S(e),
      d(),
      document.dispatchEvent(new CustomEvent(r)));
    return;
  }
  if (k.has(e)) {
    (await l("glaucomaQuizCaseStudy"),
      typeof window.showPage == "function" ? window.showPage(e) : S(e),
      d(),
      document.dispatchEvent(new CustomEvent(r)));
    return;
  }
  if (G.has(e)) {
    (await l("glaucomaWorkshop"),
      typeof window.showPage == "function" ? window.showPage(e) : S(e),
      d(),
      document.dispatchEvent(new CustomEvent(r)));
    return;
  }
}
function y() {
  (document.querySelectorAll(".glaucoma-workshop-video").forEach((e) => {
    e.classList.remove("glaucoma-workshop-video");
  }),
    document.querySelectorAll(".glaucoma-next-wrap").forEach((e) => {
      try {
        e.parentElement?.classList.remove(O);
      } catch {}
      e.remove();
    }));
}
function w(e) {
  let o = P(e),
    a = document.getElementById(o) || document.getElementById(e);
  if (!a) return;
  if (a.dataset.medicalStudentsReturn === "true") {
    y();
    return;
  }
  let t = z(e);
  if (t == null) {
    y();
    return;
  }
  let n = i[t];
  (y(), a.classList.toggle("glaucoma-workshop-video", R.has(o)));
  let f =
    a.querySelector(".container.pupils-container") ||
    a.querySelector(".container") ||
    a;
  f.classList.add(O);
  let c = document.createElement("div");
  c.className = "glaucoma-next-wrap";
  let m = document.createElement("button");
  ((m.type = "button"),
    (m.className = "glaucoma-prev-btn"),
    (m.textContent = "< Previous"),
    m.setAttribute("data-i18n", "i18nLiteral.< Previous"),
    m.addEventListener("click", async () => {
      try {
        sessionStorage.setItem("glaucomaWorkshop:restoreOpenFolder", "1");
      } catch {}
      if (n.previous === p) s(null);
      else if (i[t - 1] && i[t - 1].target === n.previous) s(t - 1);
      else {
        let h = g.get(n.previous) || [];
        s(h[0] ?? null);
      }
      await T(n.previous);
    }));
  let u = document.createElement("button");
  ((u.type = "button"),
    (u.className = "glaucoma-next-btn"),
    (u.textContent = (n.next === p, "Next >")),
    u.setAttribute("data-i18n", "i18nLiteral.Next >"));
  let b = F(o) >= 100;
  (u.classList.toggle("is-ready", b),
    u.addEventListener("click", async () => {
      try {
        sessionStorage.setItem("glaucomaWorkshop:restoreOpenFolder", "1");
      } catch {}
      let h = t + 1;
      if (i[h] && i[h].target === n.next) s(h);
      else if (n.next === p) s(null);
      else {
        let N = g.get(n.next) || [];
        s(N[0] ?? null);
      }
      await T(n.next);
    }),
    c.appendChild(m),
    c.appendChild(u),
    f.appendChild(c),
    window.I18N?.applyTranslations?.(c));
}
function Y() {
  x ||
    ((x = !0),
    document.addEventListener("page:shown", (e) => {
      let o = e?.detail?.id;
      o && w(o);
    }),
    window.addEventListener("page:loaded", (e) => {
      let o = e?.detail?.routeName;
      if (
        !new Set([
          "glaucomaWorkshop",
          "glaucomaScrollImages",
          "videos",
          "glaucomaQuizCaseStudy",
          "glaucomaHistoryCaseStudy",
        ]).has(o)
      ) {
        (A(!1), s(null), y());
        return;
      }
      (o === "glaucomaWorkshop" && y(),
        requestAnimationFrame(() => {
          let t = E();
          t && w(t);
        }));
    }),
    document.addEventListener(r, () => {
      let e = E();
      e && w(e);
    }),
    document.addEventListener(D, () => {
      let e = E();
      e && w(e);
    }),
    requestAnimationFrame(() => {
      let e = E();
      e && w(e);
    }));
}
function X(e) {
  if (!e) return;
  let o = new Map();
  e.querySelectorAll(".lesson-row[data-target]").forEach((a) => {
    let t = a.getAttribute("data-target"),
      n = P(t);
    if (!n) return;
    let f = (o.get(n) || 0) + 1;
    o.set(n, f);
    let c = Q(n, f);
    c != null && (a.dataset.nextFlowIndex = String(c));
  });
}
function Z(e) {
  if (!e) return;
  A(!0);
  let o = Number(e.dataset.nextFlowIndex);
  if (Number.isInteger(o) && o >= 0 && o < i.length) {
    s(o);
    return;
  }
  let a = e.getAttribute("data-target"),
    t = P(a);
  if (!t) return;
  let n = g.get(t) || [];
  s(n[0] ?? null);
}
export { Y as a, X as b, Z as c };
