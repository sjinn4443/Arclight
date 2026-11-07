import { b as we } from "./chunk-O2SRWS2B.js";
import { b as ge, k as ye, l as be } from "./chunk-7FFUJP4M.js";
import { a as ie, b as oe, d as re } from "./chunk-YO55ZQHJ.js";
import {
  a as se,
  b as le,
  c as ce,
  d as de,
  e as ue,
  f as pe,
  g as me,
  h as fe,
  i as he,
} from "./chunk-VCI44EBL.js";
import { a as G } from "./chunk-724JZPMA.js";
import { a as Y } from "./chunk-EMS3ZYZ5.js";
import { a as j, b as W, c as K } from "./chunk-UEXRDOY7.js";
import "./chunk-W6GCFL5V.js";
import { a as ne } from "./chunk-YIIDTX3U.js";
import { c as F, f as B } from "./chunk-6B6F2TRH.js";
import { c as ae } from "./chunk-VKQVMSQC.js";
import {
  a as U,
  c as X,
  k as O,
  l as D,
  m as J,
  p as Z,
  q as ee,
  s as A,
  t as te,
} from "./chunk-C3DWFWW5.js";
import "./chunk-P2HPNKQY.js";
import "./chunk-BGCC32GM.js";
import "./chunk-WOT6VMZA.js";
var Se = ".eyes-topbar__title, #eyesCatalogPage .eyes-title";
function ke() {
  let e = document.createElement("a");
  ((e.className = "topbar-home-logo"),
    (e.href = "#/dashboard"),
    (e.dataset.route = "dashboard"),
    e.setAttribute("aria-label", "Go to dashboard"),
    e.addEventListener("click", (o) => {
      (o.preventDefault(), o.stopPropagation(), A("dashboard"));
    }));
  let t = document.createElement("img");
  return (
    (t.className = "topbar-home-logo__image"),
    (t.src = "/images/logo/pwainstall.png"),
    (t.alt = "Arclight Project"),
    (t.decoding = "async"),
    e.appendChild(t),
    e
  );
}
function ze(e) {
  e instanceof Element &&
    (e.querySelector(":scope > .topbar-home-logo") ||
      (e.removeAttribute("data-i18n"),
      e.setAttribute("data-i18n-skip", ""),
      e.replaceChildren(ke())));
}
function T(e = document) {
  e?.querySelectorAll &&
    (e.matches?.(Se) && ze(e), e.querySelectorAll(Se).forEach(ze));
}
function Ee() {
  (T(document),
    document.addEventListener("page:shown", (t) => {
      let o = document.getElementById(String(t.detail?.id || ""));
      T(o || document);
    }),
    window.addEventListener("page:loaded", () => T(document)),
    window.addEventListener("page:rendered", () => T(document)),
    new MutationObserver((t) => {
      for (let o of t)
        o.type === "childList" &&
          (T(o.target), o.addedNodes.forEach((i) => T(i)));
    }).observe(document.body, { childList: !0, subtree: !0 }));
}
function k(e) {
  try {
    window.I18N?.applyTranslations?.(e);
  } catch {}
}
function ve() {
  try {
    return window.I18N?.getLanguage?.() === "ne";
  } catch {
    return document.documentElement?.getAttribute?.("lang") === "ne";
  }
}
function Pe(e, t, o) {
  if (!e) return;
  if (((e.textContent = ""), ve())) {
    let u = document.createElement("b");
    ((u.textContent = String(o)),
      e.appendChild(u),
      e.appendChild(
        document.createTextNode(" \u092E\u0927\u094D\u092F\u0947 "),
      ));
    let b = document.createElement("b");
    ((b.textContent = String(t)),
      e.appendChild(b),
      e.appendChild(
        document.createTextNode(
          " \u0938\u0939\u0940 \u0917\u0930\u094D\u0928\u0941\u092D\u092F\u094B\u0964",
        ),
      ));
    return;
  }
  (e.appendChild(document.createTextNode("You got")),
    e.appendChild(document.createTextNode(" ")));
  let i = document.createElement("b");
  ((i.textContent = String(t)),
    e.appendChild(i),
    e.appendChild(document.createTextNode(" ")),
    e.appendChild(document.createTextNode("out of")),
    e.appendChild(document.createTextNode(" ")));
  let s = document.createElement("b");
  ((s.textContent = String(o)),
    e.appendChild(s),
    e.appendChild(document.createTextNode(" ")),
    e.appendChild(document.createTextNode("correct.")));
}
function Le(e, t, o) {
  if (!e) return;
  if (((e.textContent = ""), ve())) {
    let u = document.createElement("b");
    ((u.textContent = String(o)),
      e.appendChild(u),
      e.appendChild(
        document.createTextNode(" \u092E\u0927\u094D\u092F\u0947 "),
      ));
    let b = document.createElement("b");
    ((b.textContent = String(t)),
      e.appendChild(b),
      e.appendChild(
        document.createTextNode(
          " \u092E\u093E\u0924\u094D\u0930\u0948 \u0938\u0939\u0940 \u092D\u092F\u094B\u0964",
        ),
      ));
    return;
  }
  (e.appendChild(document.createTextNode("Not quite:")),
    e.appendChild(document.createTextNode(" ")));
  let i = document.createElement("b");
  ((i.textContent = String(t)),
    e.appendChild(i),
    e.appendChild(document.createTextNode(" / ")));
  let s = document.createElement("b");
  ((s.textContent = String(o)),
    e.appendChild(s),
    e.appendChild(document.createTextNode(" ")),
    e.appendChild(document.createTextNode("correct.")));
}
function Ce() {
  let e = document.getElementById("glaucomaQuizCaseStudy");
  if (!e || (B(), xe(), e.dataset.wired === "1")) return;
  e.dataset.wired = "1";
  let t = e.querySelector("#glaucomaQuizMount");
  if (!t) return;
  let o = [
      "Normal",
      "Cupped disc",
      "New vessels at disc",
      "Temporal pallor",
      "Swollen disc",
      "Optic atrophy/pale disc-total",
      "Hypoplastic disc",
      "Myelinated nerve fibres",
    ],
    i = [
      {
        video: "/videos/Workshop/Glaucoma/NormalAbnormal/case1_720p.mp4",
        answer: "Normal",
      },
      {
        video: "/videos/Workshop/Glaucoma/NormalAbnormal/case2_720p.mp4",
        answer: "Optic atrophy/pale disc-total",
      },
      {
        video: "/videos/Workshop/Glaucoma/NormalAbnormal/case3_720p.mp4",
        answer: "Swollen disc",
      },
      {
        video: "/videos/Workshop/Glaucoma/NormalAbnormal/case4_720p.mp4",
        answer: "Cupped disc",
      },
      {
        video: "/videos/Workshop/Glaucoma/NormalAbnormal/case5_720p.mp4",
        answer: "Swollen disc",
      },
      {
        video: "/videos/Workshop/Glaucoma/NormalAbnormal/case6_720p.mp4",
        answer: "New vessels at disc",
      },
      {
        video: "/videos/Workshop/Glaucoma/NormalAbnormal/case7_720p.mp4",
        answer: "Normal",
      },
      {
        video: "/videos/Workshop/Glaucoma/NormalAbnormal/case8_720p.mp4",
        answer: "Hypoplastic disc",
      },
      {
        video: "/videos/Workshop/Glaucoma/NormalAbnormal/case9_720p.mp4",
        answer: "Cupped disc",
      },
      {
        video: "/videos/Workshop/Glaucoma/NormalAbnormal/case10_720p.mp4",
        answer: "Temporal pallor",
      },
      {
        video: "/videos/Workshop/Glaucoma/NormalAbnormal/case11_720p.mp4",
        answer: "Myelinated nerve fibres",
      },
      {
        video: "/videos/Workshop/Glaucoma/NormalAbnormal/case12_720p.mp4",
        answer: "Optic atrophy/pale disc-total",
      },
    ];
  function s(l) {
    let m = l.slice();
    for (let c = m.length - 1; c > 0; c--) {
      let g = Math.floor(Math.random() * (c + 1));
      [m[c], m[g]] = [m[g], m[c]];
    }
    return m;
  }
  function u(l) {
    let m = o.filter((g) => g !== l),
      c = s(m).slice(0, 3);
    return s([l, ...c]);
  }
  let b = i.map((l) => u(l.answer)),
    p = new Array(i.length).fill(null),
    E = document.getElementById("glaucomaQuizLayoutTemplate");
  if (!E) return;
  ((t.textContent = ""), t.appendChild(E.content.cloneNode(!0)));
  let v = t.querySelector("#gqProgress"),
    r = t.querySelector("#gqAllQuestions"),
    h = t.querySelector("#gqResults"),
    w = t.querySelector("#gqModal"),
    z = t.querySelector("#gqScoreText"),
    y = t.querySelector("#gqReview"),
    a = t.querySelector("#gqRestart");
  function n() {
    let l = p.filter(Boolean).length;
    ((v.textContent = `${l} / ${i.length}`), (h.disabled = !1));
    let m = (l / i.length) * 90;
    F("glaucomaQuizCaseStudy", m);
  }
  function d() {
    let l = document.getElementById("glaucomaQuizCardTemplate"),
      m = document.getElementById("glaucomaQuizOptionTemplate");
    !l ||
      !m ||
      ((r.textContent = ""),
      i.forEach((c, g) => {
        let q = b[g],
          N = `gq_${g}`,
          P = p[g],
          L = l.content.querySelector(".quiz-card").cloneNode(!0);
        L.dataset.qwrap = String(g);
        let Q = L.querySelector(".quiz-card-number");
        Q && (Q.textContent = String(g + 1).padStart(2, "0"));
        let $ = L.querySelector("source");
        $ && ($.src = c.video);
        let R = L.querySelector(".options");
        (R &&
          ((R.dataset.qopts = String(g)),
          q.forEach((M, Ne) => {
            let V = `${N}_${Ne}`,
              x = m.content.querySelector(".opt").cloneNode(!0);
            (x.setAttribute("for", V),
              (x.dataset.q = String(g)),
              (x.dataset.value = M));
            let I = x.querySelector("input");
            I &&
              ((I.id = V),
              (I.type = "radio"),
              (I.name = N),
              (I.value = M),
              (I.checked = P === M));
            let H = x.querySelector(".opt-label");
            (H && (H.textContent = M), R.appendChild(x));
          })),
          r.appendChild(L),
          k(L));
      }),
      r.querySelectorAll('input[type="radio"]').forEach((c) => {
        c.addEventListener("change", (g) => {
          let N = g.target.name.replace("gq_", ""),
            P = Number(N);
          ((p[P] = g.target.value), n());
        });
      }),
      n(),
      r.querySelectorAll("video.quiz-video").forEach((c) => {
        ((c.loop = !0),
          (c.muted = !0),
          (c.autoplay = !0),
          (c.playsInline = !0),
          (c.controls = !1),
          (c.playbackRate = 1),
          c.addEventListener("loadedmetadata", () => {
            c.paused && c.play().catch(() => {});
          }),
          c.play().catch(() => {}));
      }));
  }
  function f() {
    let l = i.length,
      m = p.reduce((c, g, q) => c + (g === i[q].answer ? 1 : 0), 0);
    (Pe(z, m, l),
      k(z),
      (w.style.display = "flex"),
      F("glaucomaQuizCaseStudy", 100));
  }
  function S() {
    w.style.display = "none";
  }
  function C(l) {
    window.alert(`Please answer all ${i.length} questions before submitting.`);
    let m = r.querySelector(`[data-qwrap="${l}"]`);
    (m?.scrollIntoView?.({ block: "center", behavior: "smooth" }),
      m
        ?.querySelector?.('input[type="radio"]')
        ?.focus?.({ preventScroll: !0 }));
  }
  function _() {
    for (let l = 0; l < i.length; l++) {
      let m = i[l].answer,
        c = p[l],
        g = r.querySelector(`[data-qopts="${l}"]`);
      if (!g) continue;
      g.querySelectorAll(".opt").forEach((N) => {
        let P = N.getAttribute("data-value");
        (N.classList.remove("correct", "wrong"),
          P === m && N.classList.add("correct"),
          c && P === c && c !== m && N.classList.add("wrong"));
      });
    }
    S();
  }
  (h.addEventListener("click", () => {
    let l = p.findIndex((m) => !m);
    if (l !== -1) {
      C(l);
      return;
    }
    f();
  }),
    y.addEventListener("click", () => {
      _();
    }),
    a.addEventListener("click", () => {
      (p.fill(null), S(), d());
    }),
    w.addEventListener("click", (l) => {
      l.target === w && S();
    }),
    d(),
    k(e));
}
function xe() {
  let e = document.getElementById("glaucomaSecondaryCauseQuizPage");
  if (!e || (B(), e.dataset.wired === "1")) return;
  e.dataset.wired = "1";
  let t = e.querySelector("#glaucomaSecondaryQuizMount"),
    o = e.querySelector("#glaucomaSecondaryQuizTemplate");
  if (!t || !o) return;
  let i = [
    { id: "lens", label: "Lens dislocation", zone: "secondary" },
    { id: "hyphaema", label: "Hyphaema", zone: "secondary" },
    { id: "uveitis", label: "Anterior uveitis", zone: "secondary" },
    { id: "irisBombe", label: "Iris bombe", zone: "secondary" },
    { id: "pigment", label: "Pigment dispersion", zone: "secondary" },
    { id: "pxf", label: "Pseudo-exfoliation", zone: "secondary" },
    { id: "shallow", label: "Shallow chamber", zone: "secondary" },
    { id: "irisNV", label: "Iris new vessels", zone: "secondary" },
    { id: "deep", label: "Deep chamber", zone: "not" },
    { id: "normalIris", label: "Normal iris", zone: "not" },
    { id: "cupping", label: "Optic disc cupping", zone: "not" },
    { id: "largeCDR", label: "Large cup-disc ratio", zone: "not" },
  ];
  t.textContent = "";
  let s = o.content.cloneNode(!0);
  t.appendChild(s);
  let u = Array.from(t.querySelectorAll(".gsec-zone")),
    b = t.querySelector(".gsec-bank"),
    p = t.querySelector("#gsecSubmit"),
    E = t.querySelector("#gsecFeedback");
  if (!b || !p || !E || u.length !== 2) return;
  let v = new Map();
  i.forEach((a) => v.set(a.id, "bank"));
  function r() {
    let n = (i.filter((d) => v.get(d.id) !== "bank").length / i.length) * 90;
    (F("glaucomaSecondaryCauseQuizPage", n),
      G("glaucomaSecondaryCauseQuizPage", n));
  }
  function h(a) {
    let n = a.slice();
    for (let d = n.length - 1; d > 0; d--) {
      let f = Math.floor(Math.random() * (d + 1));
      [n[d], n[f]] = [n[f], n[d]];
    }
    return n;
  }
  function w(a) {
    let n = document.createElement("button");
    ((n.type = "button"),
      (n.className = "gsec-chip"),
      (n.textContent = a.label),
      n.setAttribute("draggable", "true"),
      (n.dataset.itemId = a.id),
      (n.dataset.correctZone = a.zone),
      n.addEventListener("dragstart", (f) => {
        p.disabled ||
          (f.dataTransfer?.setData("text/plain", a.id),
          f.dataTransfer?.setDragImage?.(n, 10, 10));
      }));
    let d = !1;
    return (
      n.addEventListener("pointerdown", (f) => {
        p.disabled ||
          ((d = !0),
          n.setPointerCapture(f.pointerId),
          (n.style.position = "relative"),
          (n.style.zIndex = "5"),
          (n.dataset.dx = "0"),
          (n.dataset.dy = "0"));
      }),
      n.addEventListener("pointermove", (f) => {
        if (!d || p.disabled) return;
        let S = parseFloat(n.dataset.dx || "0") + f.movementX || 0,
          C = parseFloat(n.dataset.dy || "0") + f.movementY || 0;
        ((n.dataset.dx = String(S)),
          (n.dataset.dy = String(C)),
          (n.style.transform = `translate(${S}px, ${C}px)`));
      }),
      n.addEventListener("pointerup", (f) => {
        if (!d) return;
        d = !1;
        let S = f.clientX,
          C = f.clientY,
          _ = u
            .map((l) => {
              let m = l.querySelector(".gsec-zone__body");
              if (!m) return null;
              let c = m.getBoundingClientRect();
              return S >= c.left && S <= c.right && C >= c.top && C <= c.bottom
                ? l
                : null;
            })
            .find(Boolean);
        if (
          ((n.style.transform = ""),
          (n.style.zIndex = ""),
          (n.dataset.dx = "0"),
          (n.dataset.dy = "0"),
          _)
        ) {
          let l = _.getAttribute("data-zone");
          (l === "secondary" || l === "not") && z(n, l);
        }
      }),
      k(n),
      n
    );
  }
  function z(a, n) {
    let d = a.dataset.itemId;
    if (!d) return;
    if (n === "bank") {
      (b.appendChild(a), v.set(d, "bank"), r());
      return;
    }
    let S = u
      .find((C) => C.getAttribute("data-zone") === n)
      ?.querySelector(".gsec-zone__body");
    S && (S.appendChild(a), v.set(d, n), r());
  }
  (h(i).forEach((a) => b.appendChild(w(a))), r());
  function y(a, n) {
    (a.addEventListener("dragover", (d) => {
      p.disabled || d.preventDefault();
    }),
      a.addEventListener("drop", (d) => {
        if (p.disabled) return;
        d.preventDefault();
        let f = d.dataTransfer?.getData("text/plain");
        if (!f) return;
        let S = t.querySelector(`.gsec-chip[data-item-id="${f}"]`);
        S && z(S, n);
      }));
  }
  (u.forEach((a) => {
    let n = a.querySelector(".gsec-zone__body");
    n &&
      (y(n, a.getAttribute("data-zone")),
      n.addEventListener("dragenter", () => a.classList.add("is-over")),
      n.addEventListener("dragleave", () => a.classList.remove("is-over")),
      n.addEventListener("drop", () => a.classList.remove("is-over")));
  }),
    y(b, "bank"),
    p.addEventListener("click", () => {
      if (i.filter((d) => v.get(d.id) === "bank").length > 0) {
        ((E.textContent = "Place all findings before submitting."), k(E));
        return;
      }
      ((p.disabled = !0),
        r(),
        F("glaucomaSecondaryCauseQuizPage", 100),
        G("glaucomaSecondaryCauseQuizPage", 100));
      let n = 0;
      (i.forEach((d) => {
        let f = t.querySelector(`.gsec-chip[data-item-id="${d.id}"]`);
        if (!f) return;
        (f.classList.remove("is-correct", "is-wrong"),
          v.get(d.id) === d.zone
            ? ((n += 1), f.classList.add("is-correct"))
            : f.classList.add("is-wrong"));
      }),
        n === i.length ? (E.textContent = "Correct!") : Le(E, n, i.length),
        k(E));
    }),
    k(e));
}
j();
Ee();
var Ie = "arclight:onboarded";
function Ae() {
  try {
    return localStorage.getItem(Ie) === "1" || ge();
  } catch {
    return !1;
  }
}
function Te(e) {
  let t = ee();
  return t?.routeName
    ? { ...t, isDeepLink: !0 }
    : {
        routeName: e ? "dashboard" : "languageinstall",
        subPageId: null,
        isDeepLink: !1,
      };
}
function qe(e) {
  if (e?.isDeepLink) return !0;
  if (typeof window > "u") return !1;
  try {
    return window.matchMedia?.("(prefers-reduced-motion: reduce)")?.matches;
  } catch {
    return !1;
  }
}
function We() {
  let e = window.navigator || {},
    t = String(e.userAgent || ""),
    o = String(e.platform || ""),
    i = Number(e.maxTouchPoints || 0),
    s = /iP(hone|od|ad)/i.test(t) || (/Mac/i.test(o) && i > 1),
    u =
      /Safari/i.test(t) &&
      !/Chrome|Chromium|CriOS|Edg|OPR|Firefox|FxiOS|Android/i.test(t) &&
      (/Macintosh/i.test(t) || /Mac/i.test(o));
  document.documentElement.classList.toggle("is-apple-ui", s || u);
}
document.addEventListener("DOMContentLoaded", () => {
  (We(),
    ye(),
    X().catch((e) => console.warn("[geo] init failed", e)),
    O(),
    ne(),
    ae(),
    re(),
    document.addEventListener("click", (e) => {
      e.target.closest(".menuBtn") && (e.preventDefault(), D());
    }),
    te(),
    Y(),
    we(),
    import("./paediatricSurgicalEyeEarWorkshop-HQ2DBHX3.js")
      .then((e) => e.initializePaediatricWorkshopFlowInfra?.())
      .catch(() => {}),
    import("./childhoodWorkshopNextFlow-3YOUVB4X.js")
      .then((e) => e.initializeChildhoodWorkshopNextFlowInfra?.())
      .catch(() => {}),
    import("./glaucomaWorkshopNextFlow-3CY5XFYD.js")
      .then((e) => e.initializeGlaucomaWorkshopNextFlowInfra?.())
      .catch(() => {}),
    import("./diabeticWorkshopNextFlow-462N4F3C.js")
      .then((e) => e.initializeDiabeticWorkshopNextFlowInfra?.())
      .catch(() => {}),
    import("./medicalStudentsWorkshop-G7XUEK7U.js")
      .then((e) => e.initializeMedicalStudentsWorkshopFlowInfra?.())
      .catch(() => {}),
    window.addEventListener("page:loaded", async (e) => {
      let t = e?.detail?.routeName;
      try {
        sessionStorage.getItem("pecWorkshop:activeEntry") &&
          import("./pecWorkshop-G5GUOASG.js").then((i) =>
            i.restorePecNavigation?.(),
          );
      } catch {}
      if (t === "eyes") {
        let { initializeEyes: i } = await import("./eyes-5IIJFVHH.js");
        i?.();
        return;
      }
      if (t === "mylearning") {
        let { initializeMyLearning: i } =
          await import("./mylearning-3DDYUIKG.js");
        i?.();
        return;
      }
      if (t === "videos") {
        let { initializeVideos: i } = await import("./videos-YJRPAZ42.js"),
          { initializeDiabeticDemoQuizzes: s } =
            await import("./diabeticRetinopathyWorkshop-U6HOFGNY.js");
        (s?.(), await i?.());
        let { initializeGlaucomaWorkshopNextFlowInfra: u } =
          await import("./glaucomaWorkshopNextFlow-3CY5XFYD.js");
        u?.();
        let { initializeDiabeticWorkshopNextFlowInfra: b } =
          await import("./diabeticWorkshopNextFlow-462N4F3C.js");
        b?.();
        let { initializeChildhoodWorkshopNextFlowInfra: p } =
          await import("./childhoodWorkshopNextFlow-3YOUVB4X.js");
        (p?.(), oe(), ie());
        return;
      }
      if (t === "childhoodEyeScreeningWorkshop") {
        let { initializeChildhoodEyeScreeningWorkshop: i } =
          await import("./childhoodEyeScreeningWorkshop-7UD63ESP.js");
        i?.();
        return;
      }
      if (t === "medicalStudentsWorkshop") {
        let { initializeMedicalStudentsWorkshop: i } =
          await import("./medicalStudentsWorkshop-G7XUEK7U.js");
        i?.();
        return;
      }
      if (t === "primaryEarCareWorkshop") {
        let { initializePrimaryEarCareWorkshop: i } =
          await import("./primaryEarCareWorkshop-M6B6XZX3.js");
        i();
        return;
      }
      if (t === "paediatricSurgicalEyeEarWorkshop") {
        let { initializePaediatricSurgicalEyeEarWorkshop: i } =
          await import("./paediatricSurgicalEyeEarWorkshop-HQ2DBHX3.js");
        i();
        return;
      }
      if (Object.prototype.hasOwnProperty.call(U, t)) {
        let { initializeEyeCareProcedure: i } =
          await import("./eyeCareProcedure-HIBLXFV4.js");
        await i(t);
        return;
      }
      if (t === "pecWorkshop") {
        let { initializePecWorkshop: i } =
          await import("./pecWorkshop-G5GUOASG.js");
        i?.();
        return;
      }
      if (t === "glaucomaWorkshop") {
        let { initializeGlaucomaWorkshop: i } =
          await import("./glaucomaWorkshop-24ZGJOVU.js");
        i?.();
        return;
      }
      if (t === "diabeticRetinopathyWorkshop") {
        let { initializeDiabeticRetinopathyWorkshop: i } =
          await import("./diabeticRetinopathyWorkshop-U6HOFGNY.js");
        i?.();
        let { initializeDiabeticWorkshopNextFlowInfra: s } =
          await import("./diabeticWorkshopNextFlow-462N4F3C.js");
        s?.();
        return;
      }
      if (t === "glaucomaScrollImages") {
        let {
          initializeGlaucomaScrollyPages: i,
          initializeGlaucomaWorkshopProgressInfra: s,
        } = await import("./glaucomaWorkshopProgress-YP7KEFTK.js");
        (s?.(), i?.());
        let { initializeGlaucomaWorkshopNextFlowInfra: u } =
          await import("./glaucomaWorkshopNextFlow-3CY5XFYD.js");
        u?.();
        return;
      }
      if (t === "glaucomaQuizCaseStudy") {
        let { initializeGlaucomaWorkshopNextFlowInfra: i } =
          await import("./glaucomaWorkshopNextFlow-3CY5XFYD.js");
        (i?.(), Ce());
      }
      if (t === "glaucomaHistoryCaseStudy") {
        let { initializeGlaucomaWorkshopNextFlowInfra: i } =
          await import("./glaucomaWorkshopNextFlow-3CY5XFYD.js");
        i?.();
        let { initializeGlaucomaHistoryCaseStudy: s } =
          await import("./glaucomaHistoryCaseStudy-K77M3WBI.js");
        s();
        return;
      }
      if (t === "fundalReflexPdf") {
        se();
        return;
      }
      if (t === "fundalReflexQuiz") {
        let { initializeFundalReflexQuiz: i } =
          await import("./fundalReflexQuiz-52C72EVX.js");
        i();
        return;
      }
      if (t === "directOphthalmoscopyPdf") {
        de();
        return;
      }
      if (t === "binocularIndirectOphthalmoscopyPdf") {
        ue();
        return;
      }
      if (t === "visualAcuityPdf") {
        pe();
        return;
      }
      if (t === "pupilsPecPdf") {
        me();
        return;
      }
      if (t === "pupilsAdvancedPdf") {
        fe();
        return;
      }
      if (t === "frontOfEyePdf") {
        he();
        return;
      }
      if (t === "atomsHandout1") {
        le();
        return;
      }
      if (t === "atomsHandout2") {
        ce();
        return;
      }
      if (t === "visualImpairment") {
        let { initializeVisualImpairment: i } =
            await import("./visualImpairment-7YAE7TGC.js"),
          { initializeChildhoodScrollyPages: s } =
            await import("./childhoodScrolly-HWTLGBYD.js");
        (i(), s());
      }
      if (t === "casestudy") {
        let { initializeCaseStudy: i } =
            await import("./casestudy-C2EPXCSL.js"),
          { initializeCaseStudyPrimary: s } =
            await import("./casestudy_primary-R6M6MAH3.js");
        (s(), i());
        return;
      }
      if (
        t === "visualsystemeyesbrain" ||
        t === "childhoodEyeBrainImages" ||
        t === "childhoodIntroVisualDevelopmentPage" ||
        t === "childhoodNormalVisualDevelopmentPage" ||
        t === "childhoodAskQuestionsObservePage"
      ) {
        let { initializeVisualSystemEyesBrain: i } =
            await import("./visualsystemeyesbrain-YTEXKUKI.js"),
          { initializeChildhoodScrollyPages: s } =
            await import("./childhoodScrolly-HWTLGBYD.js");
        (i?.(), s());
        return;
      }
      if (t === "childhoodRefer") {
        let { initializeChildhoodScrollyPages: i } =
          await import("./childhoodScrolly-HWTLGBYD.js");
        i();
        return;
      }
      if (t === "signsVICases") {
        let { initializeChildhoodScrollyPages: i } =
          await import("./childhoodScrolly-HWTLGBYD.js");
        i();
        return;
      }
      if (
        new Set([
          "childhoodFundalPreparation",
          "childhoodFundalExamination",
          "childhoodFundalNewbornEyesOpen",
          "childhoodFundalNewbornEyesClosed",
          "childhoodFundalUnclearFindings",
          "childhoodFundalPossibleFinding",
          "childhoodFundalAfterExamination",
          "diabeticObservationFundalReflex",
          "diabeticPositioningFlightPath",
          "diabeticHowToExamine",
          "diabeticBioPreparation",
          "diabeticBioFundoscopySitting",
          "diabeticBioFundoscopyIndentation",
        ]).has(t)
      ) {
        let { initializeChildhoodFundalReflexScrollPage: i } =
          await import("./childhoodFundalPreparation-UM6E5EUU.js");
        i?.(t);
        return;
      }
      if (t === "childhoodAssessment") {
        let { initializeChildhoodWorkshopNextFlowInfra: i } =
          await import("./childhoodWorkshopNextFlow-3YOUVB4X.js");
        i?.();
        let { initializeChildhoodAssessment: s } =
          await import("./childhoodAssessment-ECB7BER6.js");
        s?.();
        return;
      }
      if (t === "behavioursquiz") {
        let { initializeChildhoodWorkshopNextFlowInfra: i } =
          await import("./childhoodWorkshopNextFlow-3YOUVB4X.js");
        i?.();
        let { initializeBehavioursQuiz: s } =
          await import("./behavioursquiz-ZZ2OWDAK.js");
        s?.();
        return;
      }
    }));
});
window.addEventListener("page:loaded", async (e) => {
  if (e?.detail?.routeName !== "childhoodEyeScreeningWorkshop") return;
  let { initializeChildhoodEyeScreeningWorkshop: o } =
    await import("./childhoodEyeScreeningWorkshop-7UD63ESP.js");
  o?.();
});
window.addEventListener("page:loaded", async (e) => {
  let t = e?.detail?.routeName;
  if (t === "mylearning" || t === "liked") {
    let { initializeMyLearning: o } = await import("./mylearning-3DDYUIKG.js");
    o?.();
  }
});
window.addEventListener("load", () => {
  fetch("/track", {
    method: "POST",
    credentials: "same-origin",
    headers: K({ "Content-Type": "application/json" }),
    body: JSON.stringify({ event: "pageview" }),
  }).catch((e) => W("track error", e));
});
document.addEventListener("DOMContentLoaded", () => {
  Z();
  let e = document.getElementById("splashScreenContainer"),
    t = document.getElementById("page-content"),
    o = Ae(),
    i = Te(o),
    s = qe(i);
  if (!e || s) {
    (e &&
      (e.classList.remove("active", "fade-out"),
      (e.innerHTML = ""),
      e.setAttribute("aria-hidden", "true")),
      A(i.routeName, { replace: !0, subPageId: i.subPageId }));
    return;
  }
  let u = o;
  fetch(u ? "html/splashscreen_mid.html" : "html/splashscreen.html")
    .then((p) => p.text())
    .then((p) => {
      ((e.innerHTML = p),
        t && (t.style.display = "none"),
        e.classList.add("active"));
      let E =
          e.querySelector(".logo-one.mid-only") || e.querySelector(".logo-one"),
        v = u ? E : e.querySelector(".logo-one-wrap") || E,
        r = 5e3,
        h = 2850,
        w = !1,
        z = setTimeout(
          () => {
            y();
          },
          u ? h : r,
        );
      function y() {
        if (w) return;
        ((w = !0), clearTimeout(z), e.classList.add("fade-out"));
        let a = i.routeName;
        A(a, { replace: !0, subPageId: i.subPageId })
          .catch((n) => {
            W(`Failed to load ${a} route:`, n);
          })
          .finally(() => {
            (t && (t.style.display = ""),
              requestAnimationFrame(() => {
                (e.classList.remove("active"),
                  setTimeout(() => {
                    (e.classList.remove("splash-full-screen", "fade-out"),
                      (e.innerHTML = ""),
                      e.setAttribute("aria-hidden", "true"));
                  }, 300));
              }));
          });
      }
      v
        ? v.addEventListener("animationend", (a) => {
            if (u) {
              if (
                a.animationName !== "midHold" &&
                a.animationName !== "spinPause"
              )
                return;
              y();
              return;
            }
            (a.animationName !== "shiftRight" &&
              a.animationName !== "shiftRightDesktop") ||
              y();
          })
        : y();
    })
    .catch((p) => {
      (W("Failed to load splash:", p),
        A(i.routeName, { replace: !0, subPageId: i.subPageId }),
        t && (t.style.display = ""));
    });
});
var Fe =
  document.body?.dataset?.route ||
  (location.pathname.split("/").pop() || "index.html").replace(
    /\.html$/i,
    "",
  ) ||
  "index";
window.addEventListener("page:loaded", async (e) => {
  try {
    J();
  } catch {}
  let t = e.detail?.routeName;
  if (t === "account") {
    be();
    return;
  }
  if (t === "languageinstall") {
    let { initializeLanguageInstall: o } =
      await import("./languageinstall-W7N72ZJU.js");
    o?.();
    return;
  }
  if (t === "onboarding") {
    let { initializeOnboarding: o } = await import("./onboarding-KHSH72GR.js");
    o?.();
    return;
  }
  if (t === "myprofile") {
    let { initializeMyProfile: o } = await import("./myprofile-IFEN4ZP6.js");
    o?.();
    return;
  }
  if (t === "editProfile") {
    let { initializeEditProfile: o } =
      await import("./editProfile-53QP72TF.js");
    o?.();
    return;
  }
  if (t === "settings") {
    let { initializeSettings: o } = await import("./settings-RQGPOP56.js");
    o?.();
    return;
  }
  if (t === "interest") {
    let { initializeInterest: o } = await import("./interest-5SQHD2JM.js");
    o?.();
    return;
  }
  if (t === "intro") {
    let { initializeIntro: o } = await import("./intro-65WMBYZE.js");
    o?.();
    return;
  }
  if (t === "dashboard") {
    let { initializeDashboard: o } = await import("./dashboard-NUU4JEAQ.js");
    o?.();
    return;
  }
  if (t === "eyes") {
    let { initializeEyes: o } = await import("./eyes-5IIJFVHH.js");
    o?.();
    return;
  }
  if (t === "offline") {
    let { initializeOffline: o } = await import("./offline-OIWD27CG.js");
    o?.();
    return;
  }
  if (Fe === "mylearning") {
    let { initializeMyLearning: o } = await import("./mylearning-3DDYUIKG.js");
    o?.();
    return;
  }
});
window.addEventListener("page:loaded", async (e) => {
  if (e?.detail?.routeName === "atomscard") {
    let { initializeAtomsCard: o } = await import("./atomscard-R7BCX62O.js");
    o?.();
  }
});
window.addEventListener("page:loaded", async (e) => {
  let t = e?.detail?.routeName;
  if (t === "ears") {
    let { initializeEars: o } = await import("./ears-EGMTYKLO.js");
    o?.();
  } else if (t?.startsWith("ears")) {
    let { initializeEarsContent: o } =
      await import("./earsContent-YPRIJLYI.js");
    await o(t);
  }
});
window.Sentry && Sentry.setTag("app", "arclight-browser");
window.addEventListener("page:loaded", (e) => {
  let t = e?.detail?.routeName || "unknown";
  window.Sentry &&
    (Sentry.setTag("route", t),
    Sentry.addBreadcrumb({
      category: "navigation",
      message: `Route loaded: ${t}`,
      level: "info",
      data: { routeName: t },
    }));
});
function _e() {
  let e = document.getElementById("pupilsPage");
  if (!e || e.dataset.menuWired === "1") return;
  let t = e.querySelector(".menuBtn");
  t &&
    (t.addEventListener("click", async (o) => {
      o.preventDefault();
      try {
        (await O(), D());
      } catch (i) {
        W("[pupils] openMenu failed:", i);
      }
    }),
    (e.dataset.menuWired = "1"));
}
document.addEventListener("DOMContentLoaded", _e);
(function () {
  let e = "images/",
    t = "car_",
    o = ".webp",
    s = (
      document.getElementById("eyesCatalogPage") ||
      document.getElementById("eyesPage") ||
      document.getElementById("eyes") ||
      document
    ).querySelectorAll(
      "[data-card-id], [data-key], [data-image-name], .eyes-card, .card",
    );
  function u(r) {
    return (r || "")
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "")
      .trim();
  }
  function b(r) {
    let h =
      r.querySelector("[data-title]") ||
      r.querySelector(".card-title") ||
      r.querySelector("h1, h2, h3, h4, h5, h6");
    return h ? h.textContent : "";
  }
  function p(r) {
    let h = r.getAttribute("data-image-name");
    if (h) {
      let y = h.startsWith(t),
        a = h.toLowerCase().endsWith(o);
      if (y && a) return h;
      let n = y ? h.slice(t.length) : h,
        d = u(n.replace(new RegExp(o + "$", "i"), ""));
      return t + d + o;
    }
    let w = r.getAttribute("data-card-id") || r.getAttribute("data-key");
    if (w) return t + u(w) + o;
    let z = b(r);
    return t + u(z) + o;
  }
  function E(r, h) {
    let w = e + h,
      z = r.querySelector("[data-card-img], .card-img, img");
    if (z && z.tagName === "IMG") {
      (z.setAttribute("src", w),
        z.setAttribute(
          "alt",
          z.getAttribute("alt") ||
            h.replace(/^car_/, "").replace(/\.webp$/i, ""),
        ));
      return;
    }
    let y = r.querySelector(".card-thumb, [data-thumb]");
    if (y) {
      ((y.style.backgroundImage = `url("${w}")`),
        (y.style.backgroundSize = y.style.backgroundSize || "cover"),
        (y.style.backgroundPosition = y.style.backgroundPosition || "center"),
        (y.style.backgroundRepeat = "no-repeat"));
      return;
    }
    ((r.style.backgroundImage = `url("${w}")`),
      (r.style.backgroundSize = r.style.backgroundSize || "cover"),
      (r.style.backgroundPosition = r.style.backgroundPosition || "center"),
      (r.style.backgroundRepeat = "no-repeat"));
  }
  function v() {
    s.forEach((r) => {
      let h = p(r);
      /^car_[a-z0-9]+\.webp$/i.test(h) && E(r, h);
    });
  }
  document.readyState === "loading"
    ? document.addEventListener("DOMContentLoaded", v)
    : v();
})();
