import { a as x, b as I, c as _ } from "./chunk-JQTOVBXQ.js";
import { c as R, d as k } from "./chunk-YXB63DKV.js";
import "./chunk-VKQVMSQC.js";
import { s as E } from "./chunk-C3DWFWW5.js";
import "./chunk-P2HPNKQY.js";
import "./chunk-BGCC32GM.js";
import "./chunk-WOT6VMZA.js";
function B(e) {
  if (!e) return "";
  let o = String(e).trim();
  o.startsWith("#") && (o = o.slice(1));
  let t = {
    visualAcuity: "visualAcuityPage",
    vaWho: "vaWhoPage",
    vaNearVision: "vaNearVisionPage",
    mumVision: "mumVisionPage",
    fundalReflex: "fundalReflexPage",
    fundalExam: "fundalExamPage",
    fundalStill: "fundalStillPage",
    fundalReal: "fundalRealPage",
    pupils: "pupilsPage",
    pupilExamPEC: "pupilExamPECPage",
    pupilFullExam: "pupilFullExamPage",
    pupilPathways: "pupilPathwaysPage",
    rapdTestVideo: "rapdTestVideoPage",
    directOphthalmoscopy: "directOphthalmoscopyVideoPage",
    directOphthalmoscopyVideo: "directOphthalmoscopyVideoPage",
    childhoodEyeScreening: "childhoodEyeScreeningPage",
    howToArclight: "howToArclightPage",
    assessmentVision: "assessmentVisionPage",
    normalAbnormal: "normalAbnormalPage",
    frontOfEye: "frontOfEyePage",
    assessingVisualFunction: "assessingVisualFunctionPage",
  };
  return t[o] ? t[o] : o.endsWith("Page") ? o : `${o}Page`;
}
function P(e) {
  if (!e) return !1;
  let o = document.getElementById(e);
  if (!o) return !1;
  let n =
    !(typeof window.showPage == "function") || window.__pageShownPatched !== !0;
  return (
    typeof window.showPage == "function"
      ? window.showPage(e)
      : (document.querySelectorAll(".page").forEach((i) => {
          i.style.display = "none";
        }),
        (o.style.display = "block")),
    n &&
      document.dispatchEvent(
        new CustomEvent("page:shown", { detail: { id: e } }),
      ),
    !0
  );
}
function T(e = document) {
  window.I18N?.applyTranslations?.(e);
}
function U(e) {
  e?.querySelectorAll?.(".childhood-section-card, .module-card")?.forEach(
    (o) => {
      Array.from(o.children)
        .filter((n) =>
          n.matches?.(".lesson-row[data-target]")
            ? String(n.getAttribute("data-target") || "")
                .toLowerCase()
                .includes("atoms")
            : !1,
        )
        .forEach((n) => o.appendChild(n));
    },
  );
}
var M = [
    "auto.childhoodeyescreeningworkshop.the_visual_system",
    "auto.childhoodeyescreeningworkshop.visual_development",
    "auto.childhoodeyescreeningworkshop.causes_of_visual_impairment",
    "auto.childhoodeyescreeningworkshop.signs_of_visual_impairment",
    "auto.childhoodeyescreeningworkshop.childhood_eye_screening",
  ],
  D = !1;
function S(e) {
  return String(e || "").replace(/^\s*\d+\.\s*/, "");
}
function L(e = document) {
  let o = M.map((n) => `[data-i18n="${n}"]`).join(", ");
  if (!o) return;
  e.querySelectorAll(o).forEach((n) => {
    if (n.closest("#childhoodWorkshopFolders .childhood-folder-row")) return;
    let i = S(n.textContent);
    i !== n.textContent && (n.textContent = i);
  });
  let t = e.querySelector(
    "#childhoodEyeScreeningWorkshopPage .pupil-level__cap--childhood-workshop",
  );
  if (t) {
    let n = S(t.textContent);
    n !== t.textContent && (t.textContent = n);
  }
}
function z(e) {
  return e
    ? Array.from(e.children).filter((o) => o.classList?.contains("lesson-row"))
        .length
    : 0;
}
function K(e) {
  (e.querySelectorAll(".childhood-folder-item-count").forEach((o) => {
    o.remove();
  }),
    e
      .querySelectorAll(
        ".childhood-folder-row[data-item-count], #fundalReflexFolderRow[data-item-count]",
      )
      .forEach((o) => {
        o.removeAttribute("data-item-count");
      }));
}
function H(e) {
  if (!D) {
    K(e);
    return;
  }
  e.querySelectorAll(
    "#childhoodWorkshopFolders .childhood-folder-row[data-folder]",
  ).forEach((t) => {
    let n = t.getAttribute("data-folder");
    if (!n) return;
    let i = e.querySelector(`.childhood-section-card[data-section="${n}"]`),
      d = z(i),
      u = t.querySelector(".thumb");
    if (!u) return;
    let c = u.querySelector(".childhood-folder-item-count");
    (c ||
      ((c = document.createElement("span")),
      (c.className = "childhood-folder-item-count"),
      c.setAttribute("aria-hidden", "true"),
      u.appendChild(c)),
      (c.textContent = String(d)),
      t.setAttribute("data-item-count", String(d)));
  });
}
function Q(e) {
  let o = e.querySelector("#fundalReflexFolderRow"),
    t = e.querySelector("#fundalReflexSubRows");
  if (!o || !t) return;
  if (!D) {
    (o.querySelector(".childhood-folder-item-count")?.remove(),
      o.removeAttribute("data-item-count"));
    return;
  }
  let n = Array.from(t.children).filter((u) =>
      u.classList?.contains("lesson-row"),
    ).length,
    i = o.querySelector(".thumb");
  if (!i) return;
  let d = i.querySelector(".childhood-folder-item-count");
  if (n <= 0) {
    (d && d.remove(), o.removeAttribute("data-item-count"));
    return;
  }
  (d ||
    ((d = document.createElement("span")),
    (d.className = "childhood-folder-item-count"),
    d.setAttribute("aria-hidden", "true"),
    i.appendChild(d)),
    (d.textContent = String(n)),
    o.setAttribute("data-item-count", String(n)));
}
function $(e) {
  let o = e.querySelectorAll("#childhoodWorkshopFolders .childhood-folder-row"),
    t = e.querySelectorAll(".childhood-section-card"),
    n = e.querySelector("#childhoodWorkshopFolders");
  if (!n) return;
  (H(e), Q(e));
  let i = "childhoodWorkshop:openFolderKey",
    d = "childhoodWorkshop:restoreOpenFolder",
    u = (r) => {
      try {
        return sessionStorage.getItem(r);
      } catch {
        return null;
      }
    },
    c = (r, l) => {
      try {
        sessionStorage.setItem(r, l);
      } catch {}
    },
    a = (r) => {
      try {
        sessionStorage.removeItem(r);
      } catch {}
    },
    y = () => {
      t.forEach((r) => {
        r.style.display = "none";
        let l = r.querySelector("h3");
        if (!l) return;
        let m = l.querySelector(".see-all-toggle");
        m && m.remove();
        let s = l.dataset.i18nRestore;
        s &&
          (l.setAttribute("data-i18n", s),
          delete l.dataset.i18nRestore,
          l.removeAttribute("data-i18n-skip"));
      });
    },
    w = (r) => {
      let l = e.querySelector(`.childhood-section-card[data-section="${r}"]`);
      if (!l) return;
      let m = e.querySelector(
        `#childhoodWorkshopFolders .childhood-folder-row[data-folder="${r}"]`,
      );
      if (!m) return;
      (y(),
        o.forEach((p) => (p.style.display = "")),
        (m.style.display = "none"),
        c(i, r),
        e.classList.add("childhood-folder-open"),
        m.insertAdjacentElement("afterend", l),
        (l.style.display = ""));
      let s = l.querySelector("h3");
      if (!s) return;
      let b = s.getAttribute("data-i18n");
      (T(s),
        (s.textContent = S(s.textContent)),
        b &&
          ((s.dataset.i18nRestore = b),
          s.removeAttribute("data-i18n"),
          s.setAttribute("data-i18n-skip", "true")),
        (s.style.display = "flex"),
        (s.style.alignItems = "center"),
        (s.style.width = "100%"));
      let h = document.createElement("span");
      ((h.className = "see-all-toggle"),
        h.setAttribute("role", "button"),
        h.setAttribute("tabindex", "0"),
        h.setAttribute("aria-expanded", "true"),
        (h.textContent = "Close ^"),
        (h.style.marginLeft = "auto"),
        (h.style.marginRight = "15px"),
        (h.style.whiteSpace = "nowrap"));
      let v = (p) => {
        (p.preventDefault(), p.stopPropagation(), (l.style.display = "none"));
        let A = s.querySelector(".see-all-toggle");
        A && A.remove();
        let C = s.dataset.i18nRestore;
        (C &&
          (s.setAttribute("data-i18n", C),
          delete s.dataset.i18nRestore,
          s.removeAttribute("data-i18n-skip")),
          (m.style.display = ""),
          a(i),
          a(d),
          e.classList.remove("childhood-folder-open"));
      };
      (h.addEventListener("click", v),
        h.addEventListener("keydown", (p) => {
          (p.key === "Enter" || p.key === " ") && v(p);
        }),
        s.appendChild(h));
    };
  (y(),
    o.forEach((r) => (r.style.display = "")),
    (n.style.display = ""),
    e.classList.remove("childhood-folder-open"));
  let g = u(d) === "1",
    f = u(i);
  (g && f
    ? (a(d), w(f))
    : (a(i), a(d), e.classList.remove("childhood-folder-open")),
    o.forEach((r) => {
      if (r.dataset.wired === "1") return;
      r.dataset.wired = "1";
      let l = r.getAttribute("data-folder");
      if (!l) return;
      let m = (s) => {
        (s.preventDefault(), s.stopPropagation(), w(l));
      };
      (r.addEventListener("click", m),
        r.addEventListener("keydown", (s) => {
          (s.key === "Enter" || s.key === " ") && m(s);
        }));
    }));
}
function G() {
  try {
    sessionStorage.setItem("childhoodWorkshop:restoreOpenFolder", "1");
  } catch {}
}
var N = !1,
  O = [
    "childhoodFundalPreparation",
    "childhoodFundalExamination",
    "childhoodFundalNewbornEyesOpen",
  ],
  V = new Set([
    "childhoodFundalPreparation",
    "childhoodFundalExamination",
    "childhoodFundalNewbornEyesOpen",
    "childhoodFundalNewbornEyesClosed",
    "childhoodFundalUnclearFindings",
    "childhoodFundalPossibleFinding",
    "childhoodFundalAfterExamination",
  ]),
  W = {
    childhoodFundalPreparationPage: "childhoodFundalPreparation",
    childhoodFundalExaminationPage: "childhoodFundalExamination",
    childhoodFundalNewbornEyesOpenPage: "childhoodFundalNewbornEyesOpen",
    childhoodFundalNewbornEyesClosedPage: "childhoodFundalNewbornEyesClosed",
    childhoodFundalUnclearFindingsPage: "childhoodFundalUnclearFindings",
    childhoodFundalPossibleFindingPage: "childhoodFundalPossibleFinding",
    childhoodFundalAfterExaminationPage: "childhoodFundalAfterExamination",
  },
  q = new Set();
function Y() {
  if (
    typeof window > "u" ||
    typeof navigator > "u" ||
    !(typeof window.matchMedia == "function"
      ? window.matchMedia("(max-width: 37.5em)").matches
      : Number(window.innerWidth || 0) <= 600)
  )
    return !1;
  let o =
      navigator.connection ||
      navigator.mozConnection ||
      navigator.webkitConnection,
    t = String(o?.effectiveType || "").toLowerCase(),
    n = o?.saveData === !0,
    i = t.includes("2g") || t.includes("3g"),
    d = Number(navigator.deviceMemory || 0),
    u = Number.isFinite(d) && d > 0 && d <= 2,
    c = Number(navigator.hardwareConcurrency || 0),
    a = Number.isFinite(c) && c > 0 && c <= 4;
  return n || i || u || a;
}
function F(e) {
  let o = String(e || "").trim();
  V.has(o) &&
    (q.has(o) ||
      (q.add(o),
      import("./childhoodFundalPreparation-UM6E5EUU.js")
        .then((t) => {
          t.prewarmChildhoodFundalRouteAssets?.([o], {
            mode: "route",
            loadLottie: !0,
          });
        })
        .catch((t) => {
          console.warn("[childhoodWorkshop] fundal intent warmup skipped", t);
        })));
}
function j() {
  if (N) return;
  N = !0;
  let e = Y(),
    o = e ? [O[0]] : O,
    t = () => {
      import("./childhoodFundalPreparation-UM6E5EUU.js")
        .then((n) => {
          n.prewarmChildhoodFundalRouteAssets?.(o, {
            mode: "idle",
            loadLottie: !e,
          });
        })
        .catch((n) => {
          console.warn("[childhoodWorkshop] fundal warmup skipped", n);
        });
    };
  if (typeof window.requestIdleCallback == "function") {
    window.requestIdleCallback(() => t(), { timeout: 320 });
    return;
  }
  window.setTimeout(t, 80);
}
function ee() {
  let e = document.getElementById("childhoodEyeScreeningWorkshopPage");
  if (!e) return;
  (k(),
    x(),
    $(e),
    U(e),
    I(e),
    R(),
    j(),
    L(document),
    typeof window.requestAnimationFrame == "function" &&
      window.requestAnimationFrame(() => L(document)),
    e.querySelectorAll(".lesson-row[data-target]").forEach((i) => {
      if (i.dataset.wired === "1") return;
      i.dataset.wired = "1";
      let d = String(i.getAttribute("data-target") || "").trim(),
        u = W[d];
      if (u) {
        let c = () => {
          F(u);
        };
        (i.addEventListener("pointerdown", c, { passive: !0 }),
          i.addEventListener("touchstart", c, { passive: !0 }));
      }
      i.addEventListener("click", async (c) => {
        c.preventDefault();
        let a = i.getAttribute("data-target");
        if (!a) return;
        let y = W[a];
        if (
          (y && F(y),
          _(i),
          G(),
          a === "childhoodAssessmentPage" ||
            a === "childhoodAssessmentQuizPage")
        ) {
          (await E("childhoodAssessment"), P("childhoodAssessmentQuizPage"));
          return;
        }
        if (a === "behavioursquizPage") {
          (await E("behavioursquiz"), P("behavioursquizPage"));
          return;
        }
        let w = {
          visualsystemeyesbrainPage: "visualsystemeyesbrain",
          childhoodEyeBrainImagesPage: "childhoodEyeBrainImages",
          childhoodIntroVisualDevelopmentPage:
            "childhoodIntroVisualDevelopmentPage",
          childhoodNormalVisualDevelopmentPage:
            "childhoodNormalVisualDevelopmentPage",
          childhoodAskQuestionsObservePage: "childhoodAskQuestionsObservePage",
          childhoodFundalPreparationPage: "childhoodFundalPreparation",
          childhoodFundalExaminationPage: "childhoodFundalExamination",
          childhoodFundalNewbornEyesOpenPage: "childhoodFundalNewbornEyesOpen",
          childhoodFundalNewbornEyesClosedPage:
            "childhoodFundalNewbornEyesClosed",
          childhoodFundalUnclearFindingsPage: "childhoodFundalUnclearFindings",
          childhoodFundalPossibleFindingPage: "childhoodFundalPossibleFinding",
          childhoodFundalAfterExaminationPage:
            "childhoodFundalAfterExamination",
          signsVICasesPage: "signsVICases",
          childhoodReferPage: "childhoodRefer",
          atomsHandout1Page: "atomsHandout1",
          atomsHandout2Page: "atomsHandout2",
          fundalReflexPdfPage: "fundalReflexPdf",
          visualImpairmentPage: "visualImpairment",
        };
        if (w[a]) {
          let f = w[a],
            r =
              a === "childhoodAssessmentPage"
                ? "childhoodAssessmentQuizPage"
                : a,
            l = f === "childhoodEyeBrainImages" ? r : null;
          (V.has(f) && F(f),
            await E(f, l ? { subPageId: l } : void 0),
            l || P(r));
          try {
            window.scrollTo(0, 0);
          } catch {}
          return;
        }
        let g = B(a);
        if (g && g.endsWith("Page")) {
          try {
            ((window.__videosPendingTarget = g),
              (window.__videosSuppressFlash = !0),
              sessionStorage.setItem("gotoSubPage", g));
          } catch {}
          await E("videos");
          try {
            let { goToVideosSection: f } = await import("./videos-YJRPAZ42.js");
            typeof f == "function"
              ? f(g, { skipDefault: !0 })
              : sessionStorage.setItem("gotoSubPage", g);
          } catch {
            try {
              sessionStorage.setItem("gotoSubPage", g);
            } catch {}
          }
          return;
        }
      });
    }));
  let t = document.getElementById("fundalReflexFolderRow"),
    n = document.getElementById("fundalReflexSubRows");
  if (t && n && t.dataset.wiredFolder !== "1") {
    t.dataset.wiredFolder = "1";
    let i = t.querySelector(".lesson-cta"),
      d = "auto.childhoodeyescreeningworkshop.see_all",
      u = (a) => {
        ((n.style.display = a ? "" : "none"),
          t.setAttribute("aria-expanded", a ? "true" : "false"),
          i &&
            (a
              ? (i.removeAttribute("data-i18n"), (i.textContent = "Close ^"))
              : (i.setAttribute("data-i18n", d),
                (i.textContent = "See all >"))),
          e.classList.toggle("fundal-reflex-open", a),
          T(t));
      };
    u(!1);
    let c = (a) => {
      (a.preventDefault(), a.stopPropagation());
      let y = n.style.display !== "none";
      u(!y);
    };
    (t.addEventListener("click", c),
      t.addEventListener("keydown", (a) => {
        (a.key === "Enter" || a.key === " ") && c(a);
      }));
  }
}
export { ee as initializeChildhoodEyeScreeningWorkshop };
