var H = "lessonProgress:",
  B = "arclight:lesson-progress-changed",
  R = "diabeticWorkshop:progress:",
  D = "diabeticWorkshop:progress-changed";
function z(n, t) {
  if (!(!n || !t))
    try {
      localStorage.setItem(
        `${n}${t}`,
        JSON.stringify({ percent: 100, updatedAt: Date.now() }),
      );
    } catch {}
}
function I(n, t) {
  !n ||
    !t ||
    document.dispatchEvent(
      new CustomEvent(n, { detail: { target: t, percent: 100 } }),
    );
}
function S(n, t = "") {
  (z(H, n), I(B, n), t && (z(t, n), I(D, n)));
}
function E(n) {
  (document.getElementById("page-content") || document)
    .querySelectorAll(".page")
    .forEach((e) => {
      ((e.style.display = "none"), e.classList.remove("active"));
    });
  let s = document.getElementById(n);
  s && ((s.style.display = ""), s.classList.add("active"));
}
function L(n, t, a = {}) {
  let s = a.minScale ?? 0.6,
    e = a.maxScale ?? 6,
    o = 1,
    l = 0,
    i = 0;
  function u() {
    t.style.transform = `translate(${l}px, ${i}px) scale(${o})`;
  }
  function g(d) {
    return Math.max(s, Math.min(e, d));
  }
  n.addEventListener(
    "wheel",
    (d) => {
      d.preventDefault();
      let c = n.getBoundingClientRect(),
        m = d.clientX - c.left,
        v = d.clientY - c.top,
        f = o,
        h = g(f * (d.deltaY > 0 ? 0.9 : 1.1));
      if (h === f) return;
      let x = h / f;
      ((l = m - x * (m - l)), (i = v - x * (v - i)), (o = h), u());
    },
    { passive: !1 },
  );
  let p = new Map(),
    w = (d, c) => Math.hypot(d.x - c.x, d.y - c.y),
    r = null,
    y = null;
  (n.addEventListener("pointerdown", (d) => {
    if (
      (n.setPointerCapture(d.pointerId),
      p.set(d.pointerId, { x: d.clientX, y: d.clientY }),
      p.size === 1)
    )
      ((r = { x: d.clientX, y: d.clientY, tx: l, ty: i }), (y = null));
    else if (p.size === 2) {
      let [c, m] = [...p.values()];
      ((y = { d: w(c, m) }), (r = null));
    }
  }),
    n.addEventListener("pointermove", (d) => {
      if (p.has(d.pointerId)) {
        if (
          (p.set(d.pointerId, { x: d.clientX, y: d.clientY }),
          p.size === 1 && r)
        ) {
          let c = [...p.values()][0];
          ((l = r.tx + (c.x - r.x)), (i = r.ty + (c.y - r.y)), u());
        }
        if (p.size === 2 && y) {
          let [c, m] = [...p.values()],
            v = w(c, m),
            f = n.getBoundingClientRect(),
            h = { x: (c.x + m.x) / 2, y: (c.y + m.y) / 2 },
            x = h.x - f.left,
            C = h.y - f.top,
            k = o,
            O = g(k * (v / y.d));
          if (O === k) return;
          let W = O / k;
          ((l = x - W * (x - l)), (i = C - W * (C - i)), (o = O), u());
        }
      }
    }));
  function A(d) {
    if ((p.delete(d.pointerId), p.size === 0)) {
      ((r = null), (y = null));
      return;
    }
    if (p.size === 1) {
      let c = [...p.values()][0];
      ((r = { x: c.x, y: c.y, tx: l, ty: i }), (y = null));
    }
  }
  (n.addEventListener("pointerup", A),
    n.addEventListener("pointercancel", A),
    (n.style.touchAction = "none"),
    (t.style.transformOrigin = a.transformOrigin || "0 0"),
    u());
}
function F(n, t) {
  let a = 1,
    s = document.createElement("div");
  ((s.className = "workshop-atoms-zoom-controls"),
    (s.innerHTML = `
    <span aria-hidden="true"></span>
    <button type="button" data-atoms-zoom-out aria-label="Zoom out">-</button>
    <button type="button" data-atoms-zoom-in aria-label="Zoom in">+</button>
  `),
    n.prepend(s),
    V(n, s));
  let e = () => {
      ((t.style.width = `${Math.round(a * 100)}%`),
        (t.style.maxWidth = `${Math.round(a * 980)}px`));
    },
    o = (l) => {
      ((a = Math.max(0.72, Math.min(2.6, l))), e());
    };
  (s
    .querySelector("[data-atoms-zoom-out]")
    ?.addEventListener("click", () => o(a - 0.18)),
    s
      .querySelector("[data-atoms-zoom-in]")
      ?.addEventListener("click", () => o(a + 0.18)),
    (t.style.transform = "none"),
    (t.style.transformOrigin = "50% 0"),
    (n.style.touchAction = "auto"),
    e());
}
function V(n, t) {
  let a = n.closest(".page"),
    s = a?.querySelector(".eyes-topbar .icon.menuBtn");
  if (!s || !t) return;
  let e = () => {
    let o = s.getBoundingClientRect(),
      i = t.getBoundingClientRect().width || 128,
      u = Math.max(
        8,
        Math.min(
          (window.innerWidth || document.documentElement.clientWidth || i) -
            i -
            8,
          o.left + o.width / 2 - i / 2,
        ),
      );
    ((t.style.left = `${Math.round(u)}px`),
      (t.style.right = "auto"),
      (t.style.top = `${Math.round(o.bottom + 10)}px`));
  };
  (window.requestAnimationFrame(e),
    window.addEventListener("resize", e, { passive: !0 }),
    document.addEventListener("page:shown", (o) => {
      o?.detail?.id === a?.id && window.requestAnimationFrame(e);
    }));
}
function $(n, t, a) {
  if (!a || !n || !t) return;
  let s = () => {
      if (n.dataset.heightLocked === "1") return;
      let o = Math.ceil(n.scrollHeight);
      o &&
        ((n.style.height = `${o}px`),
        (n.style.overflowY = "auto"),
        (n.dataset.heightLocked = "1"));
    },
    e = () =>
      window.requestAnimationFrame(() => window.requestAnimationFrame(s));
  t.complete ? e() : t.addEventListener("load", e, { once: !0 });
}
function b(n, t, a, s = {}) {
  E(n);
  let e = document.getElementById(n);
  if (!e) return;
  let o = e.querySelector(`#${t}`);
  if (o) {
    if (o.dataset.inited !== "1") {
      ((o.dataset.inited = "1"), (o.textContent = ""));
      let l = window.matchMedia?.("(min-width: 1024px)")?.matches,
        i = document.createElement("div");
      ((i.className = "workshop-pdf-stage"),
        (i.style.position = l ? "relative" : "absolute"),
        (i.style.left = l ? "auto" : "0"),
        (i.style.top = l ? "auto" : "0"),
        (i.style.width = l ? s.desktopWidth || "min(74vw, 980px)" : "100%"),
        (i.style.margin = l ? "0 auto 32px" : "0"));
      let u = Array.isArray(a) ? a : [a],
        g = e.getAttribute("data-pdf-title") || "PDF";
      (u.forEach((p, w) => {
        let r = document.createElement("img");
        ((r.src = p),
          (r.alt = u.length > 1 ? `${g}, page ${w + 1}` : g),
          (r.draggable = !1),
          (r.style.display = "block"),
          (r.style.width = "100%"),
          (r.style.height = "auto"),
          (r.style.maxWidth = "none"),
          (r.style.userSelect = "none"),
          (r.style.webkitUserDrag = "none"),
          (r.style.pointerEvents = "none"),
          i.appendChild(r));
      }),
        o.appendChild(i),
        L(o, i, { transformOrigin: l ? "50% 0" : "0 0" }));
    }
    ((o.style.position = "relative"),
      (o.style.left = "auto"),
      (o.style.right = "auto"),
      (o.style.top = "auto"),
      (o.style.bottom = "auto"),
      (o.style.width = "100%"),
      window.matchMedia?.("(min-width: 1024px)")?.matches
        ? ((o.style.height = "auto"),
          (o.style.minHeight = "calc(100vh - 62px)"),
          (o.style.overflow = "visible"),
          (o.style.padding = "20px 0 48px"))
        : ((o.style.height = "calc(100vh - 62px)"),
          (o.style.overflow = "hidden"),
          (o.style.padding = "0")),
      (o.style.background = "#fff"));
  }
}
function q() {
  E("fundalReflexPdfPage");
  let n = document.getElementById("fundalReflexPdfPage");
  if (!n) return;
  let t = n.querySelector("#fundalPdfViewer");
  if (!t) return;
  t.textContent = "";
  let a = window.matchMedia?.("(min-width: 1024px)")?.matches,
    s = document.createElement("div");
  ((s.id = "fundalPdfStage"),
    (s.style.position = a ? "relative" : "absolute"),
    (s.style.left = a ? "auto" : "0"),
    (s.style.top = a ? "auto" : "0"),
    (s.style.width = a ? "min(58vw, 760px)" : "100%"),
    (s.style.margin = a ? "0 auto 28px" : "0"));
  let e = document.createElement("img");
  ((e.src = "images/pdf/Workshop/Childhood/FundalPDF.svg"),
    (e.alt = "Fundal reflex PDF viewer"),
    e.setAttribute("data-i18n", "i18nLiteral.Fundal reflex PDF viewer:alt"),
    (e.draggable = !1),
    (e.style.display = "block"),
    (e.style.width = "100%"),
    (e.style.height = "auto"),
    (e.style.maxWidth = "none"),
    (e.style.userSelect = "none"),
    (e.style.webkitUserDrag = "none"),
    (e.style.pointerEvents = "none"),
    s.appendChild(e),
    t.appendChild(s),
    window.I18N?.applyTranslations?.(s),
    (t.style.position = "relative"),
    (t.style.left = "auto"),
    (t.style.right = "auto"),
    (t.style.top = "auto"),
    (t.style.bottom = "auto"),
    (t.style.width = "100%"),
    a
      ? ((t.style.height = "auto"),
        (t.style.minHeight = "calc(100vh - 62px)"),
        (t.style.overflow = "visible"),
        (t.style.padding = "20px 0 32px"))
      : ((t.style.height = "calc(100vh - 62px)"),
        (t.style.overflow = "hidden"),
        (t.style.padding = "0")),
    (t.style.background = "#fff"),
    (t.style.touchAction = "none"),
    L(t, s, { minScale: a ? 1 : 0.6, transformOrigin: a ? "50% 0" : "0 0" }));
  let o = n.querySelector("#fundalPdfDownloadBtn");
  o && o.addEventListener("click", () => {});
}
function M(n, t, a) {
  let s = document.getElementById(n);
  if (!s) return;
  let e = s.querySelector(`#${t}`);
  if (!e || e.dataset.inited === "1") return;
  e.dataset.inited = "1";
  let o = window.matchMedia?.("(min-width: 1024px)")?.matches;
  ((e.style.position = "relative"),
    (e.style.left = "auto"),
    (e.style.right = "auto"),
    (e.style.top = "auto"),
    (e.style.bottom = "auto"),
    (e.style.width = "100%"),
    (e.style.minHeight = o ? "0" : "calc(100vh - 62px)"),
    (e.style.overflowX = "auto"),
    (e.style.overflowY = "visible"),
    (e.style.padding = o ? "62px 0 12px" : "62px 0 48px"),
    (e.style.background = "#fff"),
    (e.textContent = ""));
  let l = document.createElement("div");
  ((l.className = "atoms-stage"),
    (l.style.position = "relative"),
    (l.style.left = "auto"),
    (l.style.top = "auto"),
    (l.style.width = "100%"),
    (l.style.maxWidth = o ? "980px" : "100vw"),
    (l.style.margin = "0 auto 16px"));
  let i = document.createElement("img");
  ((i.src = a),
    (i.alt = "ATOMS handout"),
    (i.draggable = !1),
    (i.style.display = "block"),
    (i.style.width = "100%"),
    (i.style.height = "auto"),
    (i.style.maxWidth = "none"),
    (i.style.userSelect = "none"),
    (i.style.webkitUserDrag = "none"),
    (i.style.pointerEvents = "none"),
    l.appendChild(i),
    e.appendChild(l),
    l && (F(e, l), $(e, i, o)));
}
function N() {
  (E("atomsHandout1Page"),
    M(
      "atomsHandout1Page",
      "atomsHandout1Viewer",
      "images/pdf/Workshop/Childhood/AtomsHandout1.png",
    ));
}
function _() {
  (E("atomsHandout2Page"),
    M(
      "atomsHandout2Page",
      "atomsHandout2Viewer",
      "images/pdf/Workshop/Childhood/AtomsHandout2.png",
    ));
}
function T() {
  (S("directOphthalmoscopyPdfPage", R),
    b(
      "directOphthalmoscopyPdfPage",
      "directOphthalmoscopyPdfViewer",
      "images/pdf/Workshop/DO/DO.png",
    ));
}
function X() {
  (S("binocularIndirectOphthalmoscopyPdfPage", R),
    b(
      "binocularIndirectOphthalmoscopyPdfPage",
      "binocularIndirectOphthalmoscopyPdfViewer",
      "images/pdf/Workshop/BIO/BIO.png",
    ));
}
function P(n, t, a) {
  (S(n), b(n, t, a, { desktopWidth: "min(58vw, 760px)" }));
}
function Y() {
  P("visualAcuityPdfPage", "visualAcuityPdfViewer", [
    "images/pdf/Workshop/CoreExamination/rendered/VisualAcuity-1.png",
    "images/pdf/Workshop/CoreExamination/rendered/VisualAcuity-2.png",
  ]);
}
function Z() {
  P("pupilsPecPdfPage", "pupilsPecPdfViewer", [
    "images/pdf/Workshop/CoreExamination/rendered/PupilsPEC-1.png",
  ]);
}
function G() {
  P("pupilsAdvancedPdfPage", "pupilsAdvancedPdfViewer", [
    "images/pdf/Workshop/CoreExamination/rendered/PupilsAdvanced-1.png",
    "images/pdf/Workshop/CoreExamination/rendered/PupilsAdvanced-2.png",
  ]);
}
function U() {
  P("frontOfEyePdfPage", "frontOfEyePdfViewer", [
    "images/pdf/Workshop/CoreExamination/rendered/FrontofEye-1.png",
  ]);
}
function K() {
  P("primaryEarCareLessonPage", "primaryEarCarePdfViewer", [
    "/images/pdf/Workshop/ENT/Otoscope/Otoscope-1.png",
    "/images/pdf/Workshop/ENT/Otoscope/Otoscope-2.png",
  ]);
}
export {
  q as a,
  N as b,
  _ as c,
  T as d,
  X as e,
  Y as f,
  Z as g,
  G as h,
  U as i,
  K as j,
};
