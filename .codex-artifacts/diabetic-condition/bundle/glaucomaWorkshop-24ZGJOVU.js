import { b as te } from "./chunk-YIIDTX3U.js";
import { a as ie, b as re, c as ae } from "./chunk-JGF26N2L.js";
import { e as ee, f as ne } from "./chunk-6B6F2TRH.js";
import "./chunk-VKQVMSQC.js";
import { b as Jt, s as ft } from "./chunk-C3DWFWW5.js";
import "./chunk-P2HPNKQY.js";
import "./chunk-BGCC32GM.js";
import "./chunk-WOT6VMZA.js";
var nt = Object.freeze({
    1: Object.freeze({
      key: "mild",
      label: "Mild",
      dilationTarget: 1,
      directResponseRatio: 0.8,
      hippusScale: 1,
    }),
    2: Object.freeze({
      key: "moderate",
      label: "Moderate",
      dilationTarget: 1.1,
      directResponseRatio: 0.8,
      hippusScale: 1,
    }),
    3: Object.freeze({
      key: "severe",
      label: "Severe",
      dilationTarget: 1.2,
      directResponseRatio: 0.5,
      hippusScale: 0.5,
    }),
  }),
  pt = Object.freeze([
    Object.freeze({ side: null, severity: null }),
    ...["left", "right"].flatMap((n) =>
      [1, 2, 3].map((r) => Object.freeze({ side: n, severity: r })),
    ),
  ]),
  je = Object.freeze([...pt]);
function xt(n = Math.random) {
  let r = Number(n()),
    a = Number.isFinite(r) ? r : 0,
    l = Math.min(pt.length - 1, Math.max(0, Math.floor(a * pt.length)));
  return { ...pt[l] };
}
function oe(n) {
  return n === "left" ? "right" : n === "right" ? "left" : null;
}
function mt(n) {
  return oe(n);
}
function Et(n, r) {
  let a = oe(n);
  return a ? { side: a, severity: Number(r) } : { side: null, severity: null };
}
function se(n) {
  return nt[n]?.dilationTarget || nt[3].dilationTarget;
}
function le(n) {
  return nt[n]?.directResponseRatio ?? nt[1].directResponseRatio;
}
function ce(n) {
  return nt[n]?.hippusScale ?? nt[1].hippusScale;
}
function lt(n, r) {
  return n?.side === r?.side && n?.severity === r?.severity;
}
function de(n = [], r = []) {
  return n.reduce((a, l, s) => a + (r[s] && lt(r[s], l) ? 1 : 0), 0);
}
function ue(n = Math.random) {
  let a = [...je.map((l) => ({ ...l }))];
  for (; a.length < 10; ) a.push(xt(n));
  for (let l = a.length - 1; l > 0; l -= 1) {
    let s = Number(n()),
      o = Number.isFinite(s) ? s : 0,
      p = Math.min(l, Math.max(0, Math.floor(o * (l + 1))));
    [a[l], a[p]] = [a[p], a[l]];
  }
  return a;
}
function Ke(n) {
  if (!n) return null;
  let r = String(n).trim();
  if (!r) return null;
  r.startsWith("#") && (r = r.slice(1));
  let a = {
    visualAcuity: "visualAcuityPage",
    vaNearVision: "vaNearVisionPage",
    pupils: "pupilsPage",
    pupilExamPEC: "pupilExamPECPage",
    rapdTestVideo: "rapdTestVideoPage",
    frontOfEye: "frontOfEyePage",
    fundalReflex: "fundalReflexPage",
    opticNerveDisease: "opticNerveDiseasePage",
  };
  return a[r] ? a[r] : r.endsWith("Page") ? r : `${r}Page`;
}
function pe(n = document) {
  window.I18N?.applyTranslations?.(n);
}
function T(n, r, a = {}) {
  return window.I18N?.t?.(n, r, a) ?? r;
}
function gt(n) {
  if (!n?.side) return T("i18nExtra.interactive_notice_no_rapd", "No RAPD");
  let a =
      mt(n.side) === "left"
        ? T("i18nExtra.interactive_notice_left", "Left")
        : T("i18nExtra.interactive_notice_right", "Right"),
    l = {
      1: T("i18nExtra.interactive_notice_mild", "Mild"),
      2: T("i18nLiteral.Moderate", "Moderate"),
      3: T("i18nExtra.interactive_notice_severe", "Severe"),
    }[n.severity];
  return l ? `${a} ${l} RAPD` : `${a} RAPD`;
}
function Ze(n) {
  n?.querySelectorAll?.(".glaucoma-section-card, .module-card")?.forEach(
    (r) => {
      Array.from(r.children)
        .filter((l) =>
          l.matches?.(".lesson-row[data-target]")
            ? String(l.getAttribute("data-target") || "")
                .toLowerCase()
                .includes("atoms")
            : !1,
        )
        .forEach((l) => r.appendChild(l));
    },
  );
}
var Je = Object.freeze({
    introduction: "1.",
    history: "2.",
    vision: "3.",
    fieldsPupils: "4.",
    frontOfEye: "5.",
    backOfEye: "6.",
    summary: "7.",
    visualFields: "4.",
  }),
  tn = !1;
function en(n) {
  return String(n || "").replace(/^\s*\d+\.\s*/, "");
}
function me(n, r) {
  let a = Je[n],
    l = en(r);
  return !a || !l ? l : `${a} ${l}`;
}
function nn(n) {
  return n
    ? Array.from(n.children).filter((r) => r.classList?.contains("lesson-row"))
    : [];
}
function rn(n) {
  let r = n?.querySelector(".thumb");
  if (!r) return "";
  let a = String(r.getAttribute("style") || ""),
    l = String(r.style?.backgroundImage || ""),
    s = "";
  try {
    s = String(window.getComputedStyle(r).backgroundImage || "");
  } catch {
    s = "";
  }
  return `${a} ${l} ${s}`.toLowerCase();
}
function an(n) {
  let r = String(n?.getAttribute("data-level") || "")
    .trim()
    .toLowerCase();
  if (r === "primary" || r === "intermediate") return r;
  let a = rn(n);
  return a.includes("intermediate_")
    ? "intermediate"
    : a.includes("primary_")
      ? "primary"
      : n?.classList?.contains("glaucoma-subfolder-row")
        ? "intermediate"
        : "primary";
}
function on(n) {
  return nn(n).reduce(
    (r, a) => (
      an(a) === "intermediate" ? (r.intermediate += 1) : (r.primary += 1),
      r
    ),
    { primary: 0, intermediate: 0 },
  );
}
function It(n, r) {
  let a = document.createElement("span");
  return (
    (a.className = `glaucoma-folder-item-count glaucoma-folder-item-count--${n}`),
    a.setAttribute("aria-hidden", "true"),
    (a.textContent = String(r)),
    a
  );
}
function sn(n) {
  (n
    .querySelectorAll(
      ".glaucoma-folder-item-counts, .glaucoma-folder-item-count",
    )
    .forEach((r) => {
      r.remove();
    }),
    n
      .querySelectorAll(
        ".glaucoma-folder-row[data-item-count], .glaucoma-folder-row[data-primary-count], .glaucoma-folder-row[data-intermediate-count]",
      )
      .forEach((r) => {
        (r.removeAttribute("data-primary-count"),
          r.removeAttribute("data-intermediate-count"),
          r.removeAttribute("data-item-count"));
      }));
}
function ln(n) {
  if (!tn) {
    sn(n);
    return;
  }
  n.querySelectorAll(
    "#glaucomaWorkshopFolders .glaucoma-folder-row[data-folder]",
  ).forEach((a) => {
    let l = a.getAttribute("data-folder");
    if (!l) return;
    let s = n.querySelector(`.glaucoma-section-card[data-section="${l}"]`),
      o = on(s),
      p = o.primary + o.intermediate,
      y = a.querySelector(".thumb");
    if (!y) return;
    let d = y.querySelector(".glaucoma-folder-item-counts");
    d ||
      ((d = document.createElement("span")),
      (d.className = "glaucoma-folder-item-counts"),
      d.setAttribute("aria-hidden", "true"),
      y.appendChild(d));
    let b = o.primary > 0 && o.intermediate > 0;
    for (
      d.classList.toggle("glaucoma-folder-item-counts--dual", b);
      d.firstChild;
    )
      d.removeChild(d.firstChild);
    if (b)
      (d.appendChild(It("primary", o.primary)),
        d.appendChild(It("intermediate", o.intermediate)));
    else if (p > 0) {
      let C = o.intermediate > 0 ? "intermediate" : "primary";
      d.appendChild(It(C, p));
    }
    (a.setAttribute("data-primary-count", String(o.primary)),
      a.setAttribute("data-intermediate-count", String(o.intermediate)),
      a.setAttribute("data-item-count", String(p)));
  });
}
function cn(n) {
  let r = n.querySelectorAll("#glaucomaWorkshopFolders .glaucoma-folder-row"),
    a = n.querySelectorAll(".glaucoma-section-card"),
    l = n.querySelector("#glaucomaWorkshopFolders");
  if (!l) return;
  ln(n);
  let s = "glaucomaWorkshop:openFolderKey",
    o = "glaucomaWorkshop:restoreOpenFolder",
    p = (h) => {
      try {
        return sessionStorage.getItem(h);
      } catch {
        return null;
      }
    },
    y = (h, v) => {
      try {
        sessionStorage.setItem(h, v);
      } catch {}
    },
    d = (h) => {
      try {
        sessionStorage.removeItem(h);
      } catch {}
    },
    b = () => {
      (r.forEach((h) => h.setAttribute("aria-expanded", "false")),
        a.forEach((h) => {
          h.style.display = "none";
          let v = h.querySelector("h3");
          if (!v) return;
          let w = v.querySelector(".see-all-toggle");
          w && w.remove();
          let f = v.dataset.i18nRestore;
          f &&
            (v.setAttribute("data-i18n", f),
            delete v.dataset.i18nRestore,
            v.removeAttribute("data-i18n-skip"));
        }));
    },
    C = (h) => {
      let v = n.querySelector(`.glaucoma-section-card[data-section="${h}"]`);
      if (!v) return;
      let w = n.querySelector(
        `#glaucomaWorkshopFolders .glaucoma-folder-row[data-folder="${h}"]`,
      );
      if (!w) return;
      (b(),
        r.forEach((I) => (I.style.display = "")),
        (w.style.display = "none"),
        w.setAttribute("aria-expanded", "true"),
        y(s, h),
        n.classList.add("glaucoma-folder-open"),
        w.insertAdjacentElement("afterend", v),
        (v.style.display = ""));
      let f = v.querySelector("h3");
      if (!f) return;
      let S = f.getAttribute("data-i18n");
      (pe(f),
        (f.textContent = me(h, f.textContent)),
        S &&
          ((f.dataset.i18nRestore = S),
          f.removeAttribute("data-i18n"),
          f.setAttribute("data-i18n-skip", "true")),
        (f.style.display = "flex"),
        (f.style.alignItems = "center"),
        (f.style.width = "100%"));
      let L = document.createElement("button");
      ((L.type = "button"),
        (L.className = "see-all-toggle"),
        L.setAttribute("role", "button"),
        L.setAttribute("tabindex", "0"),
        L.setAttribute("aria-expanded", "true"),
        (L.textContent = "Close ^"),
        (L.style.marginLeft = "auto"),
        (L.style.marginRight = "15px"),
        (L.style.whiteSpace = "nowrap"));
      let U = (I) => {
        (I.preventDefault(), I.stopPropagation(), (v.style.display = "none"));
        let z = f.querySelector(".see-all-toggle");
        z && z.remove();
        let H = f.dataset.i18nRestore;
        (H &&
          (f.setAttribute("data-i18n", H),
          delete f.dataset.i18nRestore,
          f.removeAttribute("data-i18n-skip")),
          (w.style.display = ""),
          w.setAttribute("aria-expanded", "false"),
          w.focus({ preventScroll: !0 }),
          d(s),
          d(o),
          n.classList.remove("glaucoma-folder-open"));
      };
      (L.addEventListener("click", U),
        L.addEventListener("keydown", (I) => {
          (I.key === "Enter" || I.key === " ") && U(I);
        }),
        f.appendChild(L));
    };
  (b(),
    r.forEach((h) => (h.style.display = "")),
    (l.style.display = ""),
    n.classList.remove("glaucoma-folder-open"));
  let O = p(o) === "1",
    W = p(s);
  (O && W
    ? (d(o), C(W))
    : (d(s), d(o), n.classList.remove("glaucoma-folder-open")),
    r.forEach((h) => {
      if (h.dataset.wired === "1") return;
      h.dataset.wired = "1";
      let v = h.getAttribute("data-folder");
      if (!v) return;
      let w = (f) => {
        (f.preventDefault(), f.stopPropagation(), C(v));
      };
      (h.addEventListener("click", w),
        h.addEventListener("keydown", (f) => {
          (f.key === "Enter" || f.key === " ") && w(f);
        }));
    }));
}
function dn(n) {
  let r = n.querySelector(
    '.glaucoma-subfolder-row[data-subfolder="visualFields"]',
  );
  if (!r) return;
  let a = n.querySelector(
    '.glaucoma-subsection-card[data-subsection="visualFields"]',
  );
  if (!a || r.dataset.wired === "1") return;
  r.dataset.wired = "1";
  let l = () => {
      ((a.style.display = "none"), r.setAttribute("aria-expanded", "false"));
      let o = a.querySelector("h3");
      if (o) {
        let y = o.querySelector(".see-all-toggle");
        y && y.remove();
      }
      let p = n.querySelector("#visualFieldsSubsectionAnchor");
      (p && p.insertAdjacentElement("afterend", a), (r.style.display = ""));
    },
    s = (o) => {
      (o.preventDefault(),
        o.stopPropagation(),
        l(),
        (r.style.display = "none"),
        r.setAttribute("aria-expanded", "true"));
      let p = n.querySelector("#visualFieldsSubsectionAnchor");
      (p
        ? p.insertAdjacentElement("afterend", a)
        : r.insertAdjacentElement("afterend", a),
        (a.style.display = ""));
      let y = a.querySelector("h3");
      if (!y) return;
      (pe(y),
        (y.textContent = me("visualFields", y.textContent)),
        (y.style.display = "flex"),
        (y.style.alignItems = "center"),
        (y.style.width = "100%"));
      let d = document.createElement("button");
      ((d.type = "button"),
        (d.className = "see-all-toggle"),
        d.setAttribute("role", "button"),
        d.setAttribute("tabindex", "0"),
        d.setAttribute("aria-expanded", "true"),
        (d.textContent = "Close ^"),
        (d.style.marginLeft = "auto"),
        (d.style.marginRight = "15px"),
        (d.style.whiteSpace = "nowrap"));
      let b = (C) => {
        (C.preventDefault(),
          C.stopPropagation(),
          l(),
          r.focus({ preventScroll: !0 }));
      };
      (d.addEventListener("click", b),
        d.addEventListener("keydown", (C) => {
          (C.key === "Enter" || C.key === " ") && b(C);
        }),
        y.appendChild(d));
    };
  (r.addEventListener("click", s),
    r.addEventListener("keydown", (o) => {
      (o.key === "Enter" || o.key === " ") && s(o);
    }));
}
function un(n, r) {
  let a = 1,
    l = document.createElement("div");
  ((l.className = "workshop-atoms-zoom-controls"),
    (l.innerHTML = `
    <span aria-hidden="true"></span>
    <button type="button" data-atoms-zoom-out aria-label="Zoom out">-</button>
    <button type="button" data-atoms-zoom-in aria-label="Zoom in">+</button>
  `),
    n.prepend(l),
    fn(n, l));
  let s = () => {
      ((r.style.width = `${Math.round(a * 100)}%`),
        (r.style.maxWidth = `${Math.round(a * 980)}px`));
    },
    o = (p) => {
      ((a = Math.max(0.72, Math.min(2.6, p))), s());
    };
  (l
    .querySelector("[data-atoms-zoom-out]")
    ?.addEventListener("click", () => o(a - 0.18)),
    l
      .querySelector("[data-atoms-zoom-in]")
      ?.addEventListener("click", () => o(a + 0.18)),
    (r.style.transform = "none"),
    (r.style.transformOrigin = "50% 0"),
    (n.style.touchAction = "auto"),
    s());
}
function fn(n, r) {
  let a = n.closest(".page"),
    l = a?.querySelector(".eyes-topbar .icon.menuBtn");
  if (!l || !r) return;
  let s = () => {
    let o = l.getBoundingClientRect(),
      y = r.getBoundingClientRect().width || 128,
      d = Math.max(
        8,
        Math.min(
          (window.innerWidth || document.documentElement.clientWidth || y) -
            y -
            8,
          o.left + o.width / 2 - y / 2,
        ),
      );
    ((r.style.left = `${Math.round(d)}px`),
      (r.style.right = "auto"),
      (r.style.top = `${Math.round(o.bottom + 10)}px`));
  };
  (window.requestAnimationFrame(s),
    window.addEventListener("resize", s, { passive: !0 }),
    document.addEventListener("page:shown", (o) => {
      o?.detail?.id === a?.id && window.requestAnimationFrame(s);
    }));
}
function pn(n, r) {
  if (!n || !r) return;
  let a = () => {
      if (n.dataset.heightLocked === "1") return;
      let s = Math.ceil(n.scrollHeight);
      s &&
        ((n.style.height = `${s}px`),
        (n.style.overflowY = "auto"),
        (n.dataset.heightLocked = "1"));
    },
    l = () =>
      window.requestAnimationFrame(() => window.requestAnimationFrame(a));
  r.complete ? l() : r.addEventListener("load", l, { once: !0 });
}
function fe(n, r, a) {
  let l = document.getElementById(n),
    s = document.getElementById(r);
  if (!l || !s || s.dataset.inited === "1") return;
  ((s.style.position = "relative"),
    (s.style.top = "auto"),
    (s.style.left = "auto"),
    (s.style.right = "auto"),
    (s.style.bottom = "auto"),
    (s.style.width = "100%"),
    (s.style.minHeight = "0"),
    (s.style.overflowX = "auto"),
    (s.style.overflowY = "visible"),
    (s.style.padding = "62px 0 12px"),
    (s.style.background = "#fff"),
    (s.innerHTML = `
    <div class="atoms-handout-container" style="
      width: 100%;
      overflow: visible;
      position: relative;
      touch-action: auto;
    ">
      <div class="atoms-handout-stage" style="
        width: 100%;
        max-width: 980px;
        margin: 0 auto 48px;
        transform-origin: 50% 0;
      ">
        <img src="${a}" alt="ATOMS handout" data-i18n="i18nLiteral.ATOMS handout:alt" style="
          display: block;
          width: 100%;
          max-width: none;
          height: auto;
          margin: 0 auto;
        " />
      </div>
    </div>
  `));
  let o = s.querySelector(".atoms-handout-stage"),
    p = s.querySelector(".atoms-handout-stage img");
  o &&
    (window.I18N?.applyTranslations?.(s),
    un(s, o),
    pn(s, p),
    (s.dataset.inited = "1"));
}
function mn() {
  (fe(
    "glaucomaFundusSummaryAtomsPage",
    "glaucomaFundusSummaryAtomsViewer",
    "/images/pdf/Workshop/Glaucoma/07Summary/Atoms/01.png",
  ),
    fe(
      "glaucomaGlaucomaSummaryAtomsPage",
      "glaucomaGlaucomaSummaryAtomsViewer",
      "/images/pdf/Workshop/Glaucoma/07Summary/Atoms/02.png",
    ));
}
function bn() {
  let n = document.getElementById("glaucomaWorkshopPage");
  if (!n) return;
  (ne(),
    ie(),
    cn(n),
    dn(n),
    Ze(n),
    mn(),
    re(n),
    ee(),
    n.querySelectorAll(".lesson-row[data-target]").forEach((a) => {
      if (a.dataset.wired === "1") return;
      a.dataset.wired = "1";
      let l = async (s) => {
        s.preventDefault();
        let o = a.getAttribute("data-target");
        if (!o) return;
        ae(a);
        try {
          sessionStorage.setItem("glaucomaWorkshop:restoreOpenFolder", "1");
        } catch {}
        let p = {
          glaucomaWhatIs: "glaucomaScrollImages",
          glaucomaTypes: "glaucomaScrollImages",
          glaucomaDiagnosis: "glaucomaScrollImages",
          glaucomaIntro: "glaucomaScrollImages",
          glaucomaPOAGACAG: "glaucomaScrollImages",
          glaucomaVisionIntro: "glaucomaScrollImages",
          glaucomaTestingVisualAcuity: "glaucomaScrollImages",
          glaucomaFieldsIntro: "glaucomaScrollImages",
          glaucomaFieldsExam: "glaucomaScrollImages",
          glaucomaQuadrantsFingers: "glaucomaScrollImages",
          glaucomaQuadrantsRed: "glaucomaScrollImages",
          glaucomaAssessRecord: "glaucomaScrollImages",
          glaucomaPupilReactions: "glaucomaScrollImages",
          glaucomaSwingRAPD: "glaucomaScrollImages",
          glaucomaRAPDFullSwingInteractive: "glaucomaScrollImages",
          frontOfEyePage: "glaucomaScrollImages",
          glaucomaFrontFindings: "glaucomaScrollImages",
          glaucomaACDScroll: "glaucomaScrollImages",
          glaucomaHighIOP: "glaucomaScrollImages",
          glaucomaACDInteractive: "glaucomaScrollImages",
          fundalReflexPage: "glaucomaScrollImages",
          glaucomaOpticNerve: "glaucomaScrollImages",
          glaucomaCupping: "glaucomaScrollImages",
          glaucomaSummaryScrolly: "glaucomaScrollImages",
          glaucomaFundusSummaryAtomsPage: "glaucomaWorkshop",
          glaucomaGlaucomaSummaryAtomsPage: "glaucomaWorkshop",
          glaucomaQuizCaseStudy: "glaucomaQuizCaseStudy",
          glaucomaSecondaryCauseQuizPage: "glaucomaQuizCaseStudy",
          glaucomaHistoryCaseStudy: "glaucomaHistoryCaseStudy",
        };
        if (p[o]) {
          let d = p[o];
          if ((await ft(d), typeof window.showPage == "function"))
            window.showPage(o);
          else {
            document
              .querySelectorAll(".page")
              .forEach((O) => (O.style.display = "none"));
            let C = document.getElementById(o);
            (C && (C.style.display = "block"),
              document.dispatchEvent(
                new CustomEvent("page:shown", { detail: { id: o } }),
              ));
          }
          (te(o),
            o === "glaucomaACDInteractive"
              ? ge()
              : o === "glaucomaRAPDFullSwingInteractive" && ye(),
            document.getElementById(o) ||
              console.warn(
                "[glaucomaWorkshop] Scroll target not found in loaded route:",
                { route: d, targetRaw: o },
              ));
          try {
            window.scrollTo(0, 0);
          } catch {}
          return;
        }
        if (Jt[o]) {
          await ft(o);
          return;
        }
        let y = Ke(o);
        if (y) {
          try {
            sessionStorage.setItem("gotoSubPage", y);
          } catch {}
          try {
            window.__videosPendingTarget = y;
          } catch {}
          await ft("videos");
          return;
        }
        console.warn("[glaucomaWorkshop] Unhandled target:", o);
      };
      (a.addEventListener("click", l),
        a.addEventListener("keydown", (s) => {
          (s.key === "Enter" || s.key === " ") && l(s);
        }));
    }));
}
function ge() {
  let n = document.getElementById("glaucomaACDInteractive");
  if (!n) return;
  if (n.dataset.inited === "1") {
    gn();
    return;
  }
  n.dataset.inited = "1";
  let r = n.querySelector("#acdStage"),
    a = n.querySelector("#acdHint"),
    l = n.querySelector("#acdFlashlightOff"),
    s = n.querySelector("#acdBubble"),
    o = n.querySelector("#acdFlashlightLeft"),
    p = n.querySelector("#acdFlashlightRight"),
    y = n.querySelector("#acdCrescentRight"),
    d = n.querySelector("#acdShadowImg"),
    b = n.querySelector("#acdNormalFlashImg"),
    C = n.querySelector("#acdNormalArrowImg"),
    O = n.querySelector("#acdShallowFlashImg"),
    W = n.querySelector("#acdShallowArrowImg"),
    h = n.querySelector("#acdNormalImg"),
    v = n.querySelector("#acdShallowImg"),
    w = n.querySelector("#acdLabelLeft .acd-label-text"),
    f = n.querySelector("#acdLabelRight .acd-label-text");
  if (!r || !l || !s || !o || !p || !y) return;
  let S = {
    pickedUp: !1,
    imagesUnlocked: !1,
    nx: 0.85,
    ny: 0,
    dragging: !1,
    pointerId: null,
  };
  function L(m, P, q) {
    return Math.max(P, Math.min(q, m));
  }
  function U(m) {
    let P = [d, b, C, O, W].filter(Boolean),
      q = m > 0;
    P.forEach((_) => {
      ((_.style.opacity = q ? `${m}` : "0"),
        (_.style.display = q ? "block" : "none"));
    });
  }
  function I() {
    let m = r.getBoundingClientRect();
    if (!S.pickedUp) {
      ((o.style.display = "none"),
        (p.style.display = "none"),
        (y.style.opacity = "0"),
        U(0),
        h && (h.style.opacity = "0"),
        v && (v.style.opacity = "0"),
        w && (w.style.opacity = "0"),
        f && (f.style.opacity = "0"),
        a && (a.style.opacity = "1"),
        (l.style.display = ""),
        (s.style.display = ""));
      return;
    }
    ((l.style.display = "none"),
      (s.style.display = "none"),
      (o.style.display = "block"),
      (p.style.display = "block"));
    let P = m.width * 0.06,
      q = m.width * 0.2,
      _ = P - q * S.nx,
      M = m.width - P + q * S.nx,
      yt = m.height * 0.52,
      x = (o.getBoundingClientRect().width || 0) / 2;
    ((_ = L(_, x, m.width - x)), (M = L(M, x, m.width - x)));
    let Y = 273,
      J = Y - 236.8,
      X = J > 0 ? L((Y - M) / J, 0, 1) : 0;
    ((o.style.left = `${_}px`),
      (p.style.left = `${M}px`),
      (y.style.opacity = `${X}`),
      X >= 1
        ? (w && (w.style.opacity = "1"), f && (f.style.opacity = "1"))
        : (w && (w.style.opacity = "0"), f && (f.style.opacity = "0")),
      !S.imagesUnlocked && X >= 1 && (S.imagesUnlocked = !0),
      S.imagesUnlocked
        ? (h && (h.style.opacity = "1"), v && (v.style.opacity = "1"))
        : (h && (h.style.opacity = "0"), v && (v.style.opacity = "0")),
      U(X),
      a && (a.style.opacity = `${1 - X}`));
  }
  function z(m) {
    let q = n.querySelector("#acdStage").getBoundingClientRect(),
      _ = q.left + q.width / 2;
    return { nx: L((m.clientX - _) / (q.width * 0.45), -1, 1), ny: 0 };
  }
  function H() {
    S.pickedUp || ((S.nx = 0), (S.ny = 0), (S.pickedUp = !0), I());
  }
  function K(m) {
    if (!S.pickedUp) {
      m.target === l &&
        (H(),
        (S.dragging = !0),
        (S.pointerId = m.pointerId),
        m.target.setPointerCapture(m.pointerId));
      return;
    }
    if (m.target !== o && m.target !== p) return;
    ((S.dragging = !0),
      (S.pointerId = m.pointerId),
      m.target.setPointerCapture(m.pointerId));
    let P = z(m);
    ((S.nx = P.nx), (S.ny = P.ny), I());
  }
  function Z(m) {
    if (!S.dragging || S.pointerId !== m.pointerId) return;
    let P = z(m);
    ((S.nx = P.nx), (S.ny = P.ny), I());
  }
  function V(m) {
    S.pointerId === m.pointerId &&
      ((S.dragging = !1), (S.pointerId = null), I());
  }
  ([l, o, p].forEach((m) => {
    ((m.style.touchAction = "none"),
      m.addEventListener("pointerdown", K),
      m.addEventListener("pointermove", Z),
      m.addEventListener("pointerup", V),
      m.addEventListener("pointercancel", V));
  }),
    window.addEventListener("resize", I),
    I());
}
function gn() {
  let n = document.getElementById("glaucomaACDInteractive");
  if (!n) return;
  let r = n.querySelector("#acdCrescentRight");
  r && r.style.opacity === "" && (r.style.opacity = "0");
}
function ye() {
  let n = document.getElementById("glaucomaRAPDFullSwingInteractive");
  if (!n) return;
  if (n.dataset.inited === "1") {
    yn();
    return;
  }
  n.dataset.inited = "1";
  let r = n.querySelector("#rapdStage"),
    a = n.querySelector("#rapdHint"),
    l = n.querySelector("#rapdEyesImg"),
    s = n.querySelector("#rapdFlashlightOff"),
    o = n.querySelector("#rapdFlashlight"),
    p = n.querySelector("#rapdBeam"),
    y = n.querySelector("#rapdBubble"),
    d = n.querySelector("#rapdPupilLeft"),
    b = n.querySelector("#rapdPupilRight"),
    C = n.querySelector("#rapdPageTitle"),
    O = Array.from(n.querySelectorAll("[data-rapd-severity]")),
    W = Array.from(n.querySelectorAll("[data-rapd-patient-side]")),
    h = n.querySelector("#rapdApplyRandom"),
    v = n.querySelector("#rapdRevealPanel"),
    w = n.querySelector("#rapdReveal"),
    f = n.querySelector("#rapdRandomNext"),
    S = n.querySelector(".rapd-randomPanel"),
    L = n.querySelector("#rapdTestControls"),
    U = n.querySelector("#rapdTestProgress"),
    I = n.querySelector("#rapdSubmitAnswer"),
    z = n.querySelector("#rapdTestPrevious"),
    H = n.querySelector("#rapdTestNext"),
    K = n.querySelector("#rapdAnswerDialog"),
    Z = n.querySelector("#rapdAnswerFeedback"),
    V = n.querySelector("#rapdAnswerClose"),
    m = n.querySelector("#rapdScoreDialog"),
    P = n.querySelector("#rapdScoreResult"),
    q = n.querySelector("#rapdScoreClose"),
    _ = "practice";
  try {
    _ =
      sessionStorage.getItem("rapdExperience:launchMode") === "test"
        ? "test"
        : "practice";
  } catch {
    _ = "practice";
  }
  let M = _ === "test";
  if (
    ((n.dataset.rapdExperienceMode = _),
    C &&
      (C.textContent = M
        ? T("medicalStudentsWorkshop.content.test", "Test")
        : T("medicalStudentsWorkshop.content.practice", "Practice")),
    S && (S.hidden = M),
    L && (L.hidden = !M),
    !r || !l || !s || !o || !p || !d || !b)
  )
    return;
  o.style.transition = "opacity 120ms linear";
  let yt = 250,
    G = 0.82,
    x = 1.2,
    Y = 85,
    ct = 620,
    J = 140,
    X = 1800,
    he = 0.92,
    Se = 3e3,
    ve = 0.045,
    bt = 520,
    Ae = yt + 220,
    we = 160,
    xe = 0.008,
    Lt = 0.016,
    Ee = 670.23 / 1807,
    Ie = 1161.34 / 1807,
    be = 1116.46 / 2283,
    Le = 320 * 1.67,
    Ce = 15,
    Ct = 36,
    e = {
      pickedUp: !1,
      dragging: !1,
      pointerId: null,
      nx: 0,
      ny: 0,
      flashlightOpacity: 1,
      lastSide: "centre",
      rapdPulseStart: null,
      manualSide: "right",
      manualSeverity: 3,
      manualEnabled: !1,
      randomCase: null,
      test: M
        ? {
            questions: ue(),
            answers: Array(10).fill(null),
            selections: Array(10).fill(null),
            index: 0,
            scoreShown: !1,
            reviewMode: !1,
          }
        : null,
      centerEnteredAt: null,
      lastLightMoveAt: null,
      lastLitNx: null,
      lastLitNy: null,
      renderTicker: null,
      geometryObserver: null,
      eyes: { left: null, right: null },
    };
  function D(t, i, c) {
    return Math.max(i, Math.min(c, t));
  }
  function B(t, i, c) {
    return t + (i - t) * c;
  }
  function Re(t) {
    let i = D(t, 0, 1);
    return 1 - (1 - i) * (1 - i) * (1 - i);
  }
  function it(t) {
    let i = D(t, 0, 1);
    return -(Math.cos(Math.PI * i) - 1) / 2;
  }
  function Rt(t) {
    return {
      desiredConstricted: !1,
      desiredChangedAt: performance.now(),
      effectiveConstricted: !1,
      constrictStartedAt: null,
      dilateStartedAt: null,
      dilateStartScale: x,
      constrictMinTarget: G,
      constrictMinActive: G,
      dilateTarget: x,
      escapeStartedAt: null,
      hippusSeedA: t,
      hippusSeedB: t + 1.73,
      hippusSeedC: t + 3.41,
    };
  }
  ((e.eyes.left = Rt(0.61)), (e.eyes.right = Rt(2.14)));
  function ht(t, i) {
    t.style.transform = `translate(-50%, -50%) scale(${i})`;
  }
  function dt(t, i) {
    t.style.transition = `transform ${i}ms cubic-bezier(0.22, 0.61, 0.36, 1)`;
  }
  function Te(t) {
    let i = l.getBoundingClientRect(),
      c = i.left - t.left,
      u = i.top - t.top,
      g = c + i.width * Ee,
      E = c + i.width * Ie,
      A = u + i.height * be,
      N = D(i.width / Le, 1, 1.8),
      k = Ce * N,
      R = 3 * N;
    return (
      (d.style.left = `${g}px`),
      (d.style.top = `${A}px`),
      (b.style.left = `${E}px`),
      (b.style.top = `${A}px`),
      [d, b].forEach(($) => {
        (($.style.width = `${k}px`),
          ($.style.height = `${k}px`),
          ($.style.boxShadow = `0 0 0 ${R}px rgba(0, 0, 0, 0.25)`));
      }),
      {
        leftEyeX: g,
        rightEyeX: E,
        eyeY: A,
        activationRadius: D(i.width * 0.14, 58, 132),
      }
    );
  }
  function Pe(t, i, c) {
    let u = t,
      g = i - 50,
      E = Math.hypot(u - c.leftEyeX, g - c.eyeY),
      A = Math.hypot(u - c.rightEyeX, g - c.eyeY);
    return { dLeft: E, dRight: A, lightHeadX: u, lightHeadY: g };
  }
  function Me(t, i) {
    let { dLeft: c, dRight: u } = i,
      g = Math.min(c, u),
      E = t.width * 0.09,
      A = t.width * 0.16,
      N = t.width * 0.28,
      k = 0.42,
      R = 0.62,
      $ = 1;
    if (g <= E) $ = k;
    else if (g <= A) {
      let st = (g - E) / (A - E);
      $ = B(k, R, it(st));
    } else if (g <= N) {
      let st = (g - A) / (N - A);
      $ = B(R, 1, it(st));
    }
    (Number.isFinite(e.flashlightOpacity) || (e.flashlightOpacity = 1),
      (e.flashlightOpacity = B(e.flashlightOpacity, $, 0.18)),
      (o.style.opacity = String(D(e.flashlightOpacity, k, 1))));
  }
  function ut(t, i) {
    ((t.desiredConstricted = !1),
      (t.desiredChangedAt = i),
      (t.effectiveConstricted = !1),
      (t.constrictStartedAt = null),
      (t.dilateStartedAt = null),
      (t.dilateStartScale = x),
      (t.constrictMinTarget = G),
      (t.constrictMinActive = G),
      (t.dilateTarget = x),
      (t.escapeStartedAt = null));
  }
  function Tt(t, i) {
    if (!t.effectiveConstricted) return x;
    let c = t.constrictStartedAt ?? i,
      u = Math.max(0, i - c),
      g = t.constrictMinActive,
      E = x - g,
      A = x - (E * 2) / 3;
    if (u < Y) {
      let R = u / Y;
      return B(x, A, Re(R));
    }
    if (u < Y + ct) {
      let R = (u - Y) / ct;
      return B(A, g, it(R));
    }
    let N = Math.max(g, he);
    if (t.escapeStartedAt === null) return g;
    let k = Math.max(0, i - t.escapeStartedAt);
    if (k < J) return g;
    if (k < J + X) {
      let R = (k - J) / X;
      return B(g, N, it(R));
    }
    return N;
  }
  function Pt(t, i) {
    if (t.effectiveConstricted || t.dilateStartedAt === null)
      return t.dilateTarget;
    let c = Math.max(0, i - t.dilateStartedAt);
    if (c >= bt) return t.dilateTarget;
    let u = it(c / bt);
    return B(t.dilateStartScale, t.dilateTarget, u);
  }
  function Mt(t, i, c, u, g = x) {
    let E = t.dilateTarget,
      A = t.effectiveConstricted ? null : Pt(t, c);
    if (
      ((t.dilateTarget = g),
      A !== null &&
        Math.abs(E - g) > 0.001 &&
        ((t.dilateStartScale = A), (t.dilateStartedAt = c)),
      (t.constrictMinTarget = u),
      (t.constrictMinActive = B(
        t.constrictMinActive,
        t.constrictMinTarget,
        0.22,
      )),
      t.desiredConstricted !== i &&
        ((t.desiredConstricted = i), (t.desiredChangedAt = c)),
      t.effectiveConstricted !== t.desiredConstricted &&
        c - t.desiredChangedAt >= yt)
    )
      if (t.desiredConstricted)
        ((t.effectiveConstricted = !0),
          (t.constrictStartedAt = c),
          (t.dilateStartedAt = null),
          (t.dilateStartScale = x),
          (t.escapeStartedAt = null));
      else {
        let N = Tt(t, c);
        ((t.effectiveConstricted = !1),
          (t.constrictStartedAt = null),
          (t.dilateStartedAt = c),
          (t.dilateStartScale = N),
          (t.escapeStartedAt = null));
      }
  }
  function kt(t, i, c, u) {
    if (!c || !t.effectiveConstricted) {
      t.escapeStartedAt = null;
      return;
    }
    let g = (t.constrictStartedAt ?? i) + Y + ct,
      E = Number.isFinite(u) ? u : i,
      A = Math.max(g, E) + Se;
    i >= A
      ? t.escapeStartedAt === null && (t.escapeStartedAt = i)
      : (t.escapeStartedAt = null);
  }
  function ke(t, i, c = 1) {
    let u = i / 1e3,
      g =
        0.62 * Math.sin(2 * Math.PI * 0.87 * u + t.hippusSeedA) +
        0.38 * Math.sin(2 * Math.PI * 1.33 * u + t.hippusSeedB),
      E = 0.7 + 0.3 * Math.sin(2 * Math.PI * 0.12 * u + t.hippusSeedC);
    return (t.effectiveConstricted ? xe : Lt) * c * g * E;
  }
  function qt(t, i, c, u = 1) {
    let g = i.effectiveConstricted ? Tt(i, c) : Pt(i, c),
      E = ke(i, c, u),
      A = D(g + E, G, x + Lt);
    ht(t, A);
  }
  function F() {
    let t = performance.now(),
      i = r.getBoundingClientRect(),
      c = Te(i);
    if (!e.pickedUp) {
      ((o.style.display = "none"),
        (p.style.display = "none"),
        (s.style.display = ""),
        y && (y.style.display = ""),
        a && (a.style.opacity = "1"),
        (e.rapdPulseStart = null),
        (e.centerEnteredAt = null),
        (e.lastLightMoveAt = null),
        (e.lastLitNx = null),
        (e.lastLitNy = null),
        ut(e.eyes.left, t),
        ut(e.eyes.right, t),
        dt(d, 120),
        dt(b, 120),
        (e.flashlightOpacity = 1),
        (o.style.opacity = "1"),
        ht(d, x),
        ht(b, x));
      return;
    }
    ((s.style.display = "none"),
      y && (y.style.display = "none"),
      (o.style.display = "block"),
      (p.style.display = "block"),
      a && (a.style.opacity = e.dragging ? "0" : "1"));
    let u = i.width / 2,
      g = i.width * 0.38,
      E = u + g * e.nx,
      A = D(E, 24, i.width - 24),
      N = i.height * 0.54,
      k = D(N + i.height * 0.22 * e.ny, 24, i.height - 24);
    ((o.style.left = `${A}px`), (o.style.top = `${k + Ct}px`));
    let R = Pe(A, k, c),
      $ = Math.min(R.dLeft, R.dRight),
      st = (c.leftEyeX + c.rightEyeX) / 2,
      We = c.rightEyeX - c.leftEyeX,
      Ue = Math.max(18, We * 0.08),
      ze = Math.abs(R.lightHeadX - st) <= Ue,
      At = $ <= c.activationRadius && !ze,
      tt = At ? (R.dLeft <= R.dRight ? "left" : "right") : "centre";
    tt === "centre"
      ? (e.lastSide !== "centre" || e.centerEnteredAt === null) &&
        (e.centerEnteredAt = t)
      : (e.centerEnteredAt = null);
    let Ge =
        tt === "centre" && e.centerEnteredAt !== null
          ? t - e.centerEnteredAt
          : 0,
      He = At && tt === "centre" && Ge >= we,
      et = At && !He;
    et
      ? e.lastLitNx === null ||
        e.lastLitNy === null ||
        Math.hypot(e.nx - e.lastLitNx, e.ny - e.lastLitNy) > ve
        ? ((e.lastLightMoveAt = t), (e.lastLitNx = e.nx), (e.lastLitNy = e.ny))
        : ((e.lastLitNx = B(e.lastLitNx, e.nx, 0.08)),
          (e.lastLitNy = B(e.lastLitNy, e.ny, 0.08)))
      : ((e.lastLightMoveAt = t), (e.lastLitNx = null), (e.lastLitNy = null));
    let Ye = A,
      Xe = k - 50;
    ((p.style.left = `${Ye}px`), (p.style.top = `${Xe}px`), Me(i, R));
    let zt = i.width * 0.315;
    ((p.style.width = `${zt}px`),
      (p.style.height = `${zt}px`),
      (p.style.transform = "translate(-50%, -50%)"),
      (p.style.opacity = tt === "centre" ? "0.85" : "0.9"));
    let j = M
        ? e.test.questions[e.test.index]
        : e.randomCase || {
            side: e.manualEnabled ? e.manualSide : null,
            severity: e.manualSeverity,
          },
      Gt = j.side ? ce(j.severity) : 1;
    (dt(d, 90), dt(b, 90));
    let Ht = et,
      Yt = et,
      Xt = G,
      Vt = G,
      Qt = x,
      jt = x;
    if (j.side && et && tt === j.side) {
      (e.lastSide !== j.side || e.rapdPulseStart === null) &&
        (e.rapdPulseStart = t);
      let wt = t - e.rapdPulseStart < Ae;
      ((Ht = wt), (Yt = wt));
      let Qe = le(j.severity),
        Kt = x - (x - G) * Qe;
      if (((Xt = Kt), (Vt = Kt), !wt)) {
        let Zt = se(j.severity);
        ((Qt = Zt), (jt = Zt));
      }
    } else e.rapdPulseStart = null;
    (Mt(e.eyes.left, Ht, t, Xt, Qt),
      Mt(e.eyes.right, Yt, t, Vt, jt),
      kt(e.eyes.left, t, et, e.lastLightMoveAt),
      kt(e.eyes.right, t, et, e.lastLightMoveAt),
      qt(d, e.eyes.left, t, Gt),
      qt(b, e.eyes.right, t, Gt),
      (e.lastSide = tt));
  }
  function St(t) {
    let i = r.getBoundingClientRect(),
      c = i.left + i.width / 2,
      u = i.top + i.height * 0.54,
      g = D((t.clientX - c) / (i.width * 0.38), -1, 1),
      E = D((t.clientY - Ct - u) / (i.height * 0.22), -1, 1);
    return { nx: g, ny: E };
  }
  function qe(t) {
    if (e.pickedUp) return;
    let i = St(t);
    ((e.nx = i.nx), (e.ny = i.ny), (e.pickedUp = !0), F());
  }
  function _e(t) {
    if (!e.pickedUp) {
      t.target === s &&
        (qe(t),
        (e.dragging = !0),
        (e.pointerId = t.pointerId),
        t.target.setPointerCapture(t.pointerId),
        F());
      return;
    }
    if (t.target !== o) return;
    ((e.dragging = !0),
      (e.pointerId = t.pointerId),
      t.target.setPointerCapture(t.pointerId));
    let i = St(t);
    ((e.nx = i.nx), (e.ny = i.ny), F());
  }
  function Fe(t) {
    if (!e.dragging || e.pointerId !== t.pointerId) return;
    let i = St(t);
    ((e.nx = i.nx), (e.ny = i.ny), F());
  }
  function _t(t) {
    e.pointerId === t.pointerId &&
      ((e.dragging = !1), (e.pointerId = null), F());
  }
  [s, o].forEach((t) => {
    ((t.style.touchAction = "none"),
      t.addEventListener("pointerdown", _e),
      t.addEventListener("pointermove", Fe),
      t.addEventListener("pointerup", _t),
      t.addEventListener("pointercancel", _t));
  });
  function Ft(t, i = !0) {
    O.forEach((c) => {
      let u = i && Number(c.dataset.rapdSeverity) === t;
      c.setAttribute("aria-pressed", String(u));
    });
  }
  function Nt(t, i = !0) {
    let c = t ? mt(t) : "none";
    W.forEach((u) => {
      u.setAttribute(
        "aria-pressed",
        String(i && u.dataset.rapdPatientSide === c),
      );
    });
  }
  function Q(t, i = !0) {
    (Nt(t?.side || null, i), Ft(t?.severity, i && !!t?.side));
  }
  let Ne = ["is-review-user", "is-review-correct", "is-review-correct-missed"];
  function Dt(t) {
    let i = t?.side ? mt(t.side) : "none",
      c = W.filter((u) => u.dataset.rapdPatientSide === i);
    return (
      t?.side &&
        c.push(
          ...O.filter((u) => Number(u.dataset.rapdSeverity) === t.severity),
        ),
      c
    );
  }
  function Ot() {
    [...W, ...O].forEach((t) => {
      t.classList.remove(...Ne, "is-reveal-flash");
    });
  }
  function vt(t, i) {
    Dt(t).forEach((c) => {
      c.classList.add(i);
    });
  }
  function De(t, i) {
    if ((Ot(), Q(null, !1), lt(t, i))) {
      vt(i, "is-review-correct");
      return;
    }
    (vt(t, "is-review-user"), vt(i, "is-review-correct-missed"));
  }
  function Bt() {
    ((e.randomCase = null),
      (e.rapdPulseStart = null),
      v && (v.hidden = !0),
      f && (f.hidden = !0));
  }
  function Oe() {
    let t = performance.now();
    ((e.pickedUp = !1),
      (e.dragging = !1),
      (e.pointerId = null),
      (e.nx = 0),
      (e.ny = 0),
      (e.rapdPulseStart = null),
      (e.lastSide = "centre"),
      ut(e.eyes.left, t),
      ut(e.eyes.right, t));
  }
  function $t() {
    return de(e.test.questions, e.test.answers);
  }
  function rt() {
    if (!e.test) return;
    let t = e.test.answers[e.test.index],
      i = e.test.selections[e.test.index],
      c = e.test.questions[e.test.index];
    if (
      U &&
      ((U.textContent = T(
        "i18nLiteral.Question {{current}} of {{total}}",
        `Question ${e.test.index + 1} of ${e.test.questions.length}`,
        { current: e.test.index + 1, total: e.test.questions.length },
      )),
      t)
    ) {
      let u = lt(t, c),
        g = document.createElement("span");
      ((g.className = `rapd-testProgress__status ${u ? "is-correct" : "is-incorrect"}`),
        g.setAttribute(
          "aria-label",
          u
            ? T("i18nLiteral.Correct answer", "Correct answer")
            : T("i18nLiteral.Incorrect answer", "Incorrect answer"),
        ),
        (g.textContent = u ? "\u2713" : "\xD7"),
        U.appendChild(g));
    }
    if (
      (z && (z.disabled = e.test.index === 0),
      H && (H.disabled = e.test.index === e.test.questions.length - 1),
      I)
    ) {
      ((I.hidden = e.test.reviewMode),
        (I.textContent = t
          ? T("i18nLiteral.View result", "View result")
          : T("i18nLiteral.Submit answer", "Submit answer")));
      let u = i && (!i.side || [1, 2, 3].includes(i.severity));
      I.disabled = !t && !u;
    }
    e.test.reviewMode && t ? De(t, c) : (Ot(), Q(t || i, !!(t || i)));
  }
  function Wt() {
    K && (K.hidden = !0);
  }
  function Be() {
    !e.test ||
      e.test.answers.some((t) => t === null) ||
      (P &&
        (P.textContent = T(
          "i18nLiteral.You scored {{score}} out of {{total}}.",
          `You scored ${$t()} out of ${e.test.questions.length}.`,
          { score: $t(), total: e.test.questions.length },
        )),
      m && (m.hidden = !1),
      (e.test.scoreShown = !0));
  }
  function $e() {
    if (!e.test || !Z || !K) return;
    let t = e.test.answers[e.test.index],
      i = e.test.questions[e.test.index];
    if (t) {
      let c = lt(t, i);
      ((Z.textContent = c
        ? T(
            "i18nLiteral.Correct. The answer is {{answer}}.",
            `Correct. The answer is ${gt(i)}.`,
            { answer: gt(i) },
          )
        : T(
            "i18nLiteral.Incorrect. The correct answer is {{answer}}.",
            `Incorrect. The correct answer is ${gt(i)}.`,
            { answer: gt(i) },
          )),
        (Z.className = `rapd-answerFeedback ${c ? "is-correct" : "is-incorrect"}`),
        (Z.hidden = !1));
    } else return;
    (V && ((V.disabled = !1), (V.textContent = T("i18nLiteral.Next", "Next"))),
      (K.hidden = !1));
  }
  function at(t) {
    e.test &&
      ((e.test.index = D(t, 0, e.test.questions.length - 1)),
      Wt(),
      Oe(),
      rt(),
      F());
  }
  (W.forEach((t) => {
    t.addEventListener("click", () => {
      let i = t.dataset.rapdPatientSide;
      if (M) {
        if (e.test.answers[e.test.index]) return;
        let c = e.test.selections[e.test.index];
        ((e.test.selections[e.test.index] =
          i === "none"
            ? { side: null, severity: null }
            : Et(i, c?.severity || null)),
          rt());
        return;
      }
      (Bt(),
        i === "none"
          ? ((e.manualEnabled = !1), Q({ side: null, severity: null }))
          : ((e.manualSide = Et(i, e.manualSeverity).side),
            (e.manualEnabled = !0),
            Q({ side: e.manualSide, severity: e.manualSeverity })),
        F());
    });
  }),
    O.forEach((t) => {
      t.addEventListener("click", () => {
        let i = Number(t.dataset.rapdSeverity);
        if ([1, 2, 3].includes(i)) {
          if (M) {
            if (e.test.answers[e.test.index]) return;
            let c = e.test.selections[e.test.index];
            if (!c?.side) return;
            ((e.test.selections[e.test.index] = { side: c.side, severity: i }),
              rt());
            return;
          }
          (Bt(),
            (e.manualSeverity = i),
            e.manualSide || (e.manualSide = "right"),
            (e.manualEnabled = !0),
            Q({ side: e.manualSide, severity: i }),
            F());
        }
      });
    }));
  function Ut() {
    ((e.randomCase = xt()),
      (e.rapdPulseStart = null),
      Ft(e.manualSeverity, !1),
      Nt(null, !1),
      v && (v.hidden = !1),
      f && (f.hidden = !0),
      F());
  }
  (h?.addEventListener("click", Ut),
    w?.addEventListener("click", () => {
      if (!e.randomCase) return;
      Q(e.randomCase);
      let t = Dt(e.randomCase);
      (t.forEach((i) => i.classList.remove("is-reveal-flash")),
        window.requestAnimationFrame(() => {
          t.forEach((i) => i.classList.add("is-reveal-flash"));
        }),
        window.setTimeout(() => {
          t.forEach((i) => i.classList.remove("is-reveal-flash"));
        }, 1450),
        f && (f.hidden = !1));
    }),
    f?.addEventListener("click", Ut),
    M
      ? (I?.addEventListener("click", () => {
          if (!e.test.answers[e.test.index]) {
            let i = e.test.selections[e.test.index];
            if (!i) return;
            ((e.test.answers[e.test.index] = { ...i }), rt());
          }
          $e();
        }),
        V?.addEventListener("click", () => {
          if (!e.test?.answers[e.test.index]) return;
          if (e.test.index < e.test.questions.length - 1) {
            at(e.test.index + 1);
            return;
          }
          let t = e.test.answers.findIndex((i) => i === null);
          if (t >= 0) {
            at(t);
            return;
          }
          (Wt(), Be());
        }),
        q?.addEventListener("click", () => {
          (m && (m.hidden = !0), (e.test.reviewMode = !0), at(0));
        }),
        z?.addEventListener("click", () => {
          at(e.test.index - 1);
        }),
        H?.addEventListener("click", () => {
          at(e.test.index + 1);
        }),
        rt())
      : Q({ side: null, severity: null }, !0));
  let ot = () => {
    getComputedStyle(n).display !== "none" && window.requestAnimationFrame(F);
  };
  (window.addEventListener("resize", ot),
    l.complete ? ot() : l.addEventListener("load", ot, { once: !0 }),
    typeof ResizeObserver == "function" &&
      ((e.geometryObserver = new ResizeObserver(ot)),
      e.geometryObserver.observe(r),
      e.geometryObserver.observe(l)),
    (e.renderTicker = window.setInterval(() => {
      if (!document.body.contains(n)) {
        (e.renderTicker !== null &&
          (clearInterval(e.renderTicker), (e.renderTicker = null)),
          e.geometryObserver?.disconnect(),
          window.removeEventListener("resize", ot));
        return;
      }
      getComputedStyle(n).display !== "none" && F();
    }, 33)),
    F());
}
function yn() {
  let n = document.getElementById("glaucomaRAPDFullSwingInteractive");
  if (!(!n || !n.querySelector("#rapdStage")))
    try {
      window.dispatchEvent(new Event("resize"));
    } catch {}
}
function Ln(n) {
  if (n === "glaucomaACDInteractive") {
    ge();
    return;
  }
  n === "glaucomaRAPDFullSwingInteractive" && ye();
}
export {
  Ln as initializeGlaucomaScrollInteractiveTarget,
  bn as initializeGlaucomaWorkshop,
};
