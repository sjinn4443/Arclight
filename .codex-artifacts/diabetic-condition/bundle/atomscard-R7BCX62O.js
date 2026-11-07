import "./chunk-WOT6VMZA.js";
var p = "eyes",
  d = 1,
  c = "",
  C = {
    eyes: [
      "Red Eye",
      "Vision Changes",
      "Trauma",
      "Eyelids",
      "How to Check for Eyeglasses",
      "Cornea",
      "Lens",
      "Fundal Reflex",
      "Fundus",
      "Fundus 2",
      "Child",
      "Glaucoma",
      "Neurology",
      "Squint",
      "Tropical",
      "Anatomy",
    ],
    ears: [
      "ENT",
      "External Ear: Pinna",
      "Canal",
      "Ear Drum",
      "Childhood Hearing Development",
      "Hearing Loss",
      "Hearing Aids",
      "Anatomy",
    ],
  },
  A = {
    Arclight: "Arclight.webp",
    "Front of Eye Case Test": "CaseStudy.webp",
    Child: "Child.webp",
    Cornea: "Cornea.webp",
    Eyelids: "Eyelids.webp",
    "Front of Eye": "FrontOfEye.webp",
    "Fundal Reflex": "FundalReflex.webp",
    Fundus: "Fundus.webp",
    "Fundus 2": "Fundus2.webp",
    Glaucoma: "Glaucoma.webp",
    "How to Check for Eyeglasses": "Refract.webp",
    "How to Use": "HowToUse.webp",
    Lens: "Lens.webp",
    Neurology: "Neurology.webp",
    Pupil: "Pupil.webp",
    "Red Eye": "RedEye.webp",
    Summary: "Summary.webp",
    Squint: "Squint.webp",
    Trauma: "Trauma.webp",
    Tropical: "Tropical.webp",
    "Vision Changes": "VisionChanges.webp",
    "Vision Loss": "Summary.webp",
    ENT: "EarENT.webp",
    Canal: "EarCanal.webp",
    "Ear Drum": "Drum.webp",
    "External Ear: Pinna": "Ear.webp",
    "Childhood Hearing Development": "EarChildDevelopment.webp",
    "Hearing Loss": "HearingLoss.webp",
    "Hearing Aids": "HearingAids.webp",
  };
function b() {
  return C[p] || C.eyes;
}
function L(e) {
  return Math.max(0.6, Math.min(2.6, e));
}
function r() {
  let e = document.getElementById("atomsImageContainer");
  e &&
    e.querySelectorAll(".atoms-card-image-frame").forEach((t) => {
      let n = t.classList.contains("atoms-card-image-frame--rotated"),
        a = Math.max(320, window.innerHeight - 126),
        o = n
          ? Math.min(Math.round(a * d), Math.round(d * 1200))
          : Math.round(d * 1200);
      ((t.style.width = `${(d * 100).toFixed(0)}%`),
        (t.style.maxWidth = `${o}px`));
    });
}
function v() {
  ((d = 1), r());
}
function B(e) {
  ((d = L(d + e)), r());
}
function x(e) {
  let t = document.getElementById("eyesTab"),
    n = document.getElementById("earsTab");
  t &&
    n &&
    (t.classList.toggle("active", e === "eyes"),
    n.classList.toggle("active", e === "ears"));
}
function H(e = c) {
  let t = document.querySelector("#atomsCardPage .atoms-title-bar");
  if (!t) return;
  (e
    ? (t.removeAttribute("data-i18n"), t.setAttribute("data-i18n-skip", "true"))
    : (t.setAttribute("data-i18n", "atomsCardTitle"),
      t.removeAttribute("data-i18n-skip")),
    (t.textContent = ""));
  let n = document.createElement("span");
  if (
    ((n.className = "atoms-title-bar__base"),
    (n.textContent = i("Atoms Card")),
    t.appendChild(n),
    !e)
  )
    return;
  let a = document.createElement("span");
  ((a.className = "atoms-title-bar__selected"),
    (a.textContent = ` - ${i(e)}`),
    t.appendChild(a));
}
function i(e) {
  return window.I18N?.translateLiteral?.(e, e) || e;
}
function k() {
  let e = document.getElementById("tocList");
  e &&
    e.querySelectorAll("li").forEach((t) => {
      t.classList.toggle("is-selected", t.dataset.topic === c);
    });
}
function g(e) {
  let t = b(),
    n = t.indexOf(c);
  return n === -1 ? "" : t[n + e] || "";
}
function T() {
  let e = document.getElementById("atomsCardPage"),
    t = document.getElementById("atomsPrevCardBtn"),
    n = document.getElementById("atomsNextCardBtn");
  if (!e || !t || !n) return;
  let a = !!c;
  e.classList.toggle("atoms-card-page--has-topic", a);
  let o = g(-1),
    s = g(1),
    E = o ? `Previous: ${i(o)}` : "Previous Atoms card",
    f = s ? `Next: ${i(s)}` : "Next Atoms card";
  ((t.disabled = !o),
    t.setAttribute("aria-label", E),
    (t.title = E),
    (n.disabled = !s),
    n.setAttribute("aria-label", f),
    (n.title = f));
}
function I(e = "") {
  ((c = e), H(e), k(), T());
}
function y() {
  let e = document.getElementById("tocDropdown");
  if (!e) return;
  (e.classList.remove("hidden", "slide-up"), e.classList.add("active"));
  let t = document.getElementById("closeTOCBtn"),
    n = document.getElementById("tocToggleBtn");
  (t && (t.style.display = "block"), n && (n.style.display = "none"));
}
function m() {
  let e = document.getElementById("tocDropdown");
  if (!e) return;
  (e.classList.add("slide-up"),
    e.classList.remove("active"),
    setTimeout(() => {
      (e.classList.add("hidden"), e.classList.remove("slide-up"));
    }, 300));
  let t = document.getElementById("closeTOCBtn"),
    n = document.getElementById("tocToggleBtn");
  (t && (t.style.display = "none"), n && (n.style.display = "block"));
}
function u(e, t, n) {
  let a = document.createElement("div");
  a.className = "atoms-card-image-frame";
  let o = document.createElement("img");
  return (
    (o.src = e),
    (o.alt = t),
    (o.style.width = "100%"),
    (o.style.maxWidth = "100%"),
    (o.style.maxHeight = "100%"),
    (o.style.objectFit = "contain"),
    (o.style.borderRadius = "12px"),
    (o.style.marginBottom = "10px"),
    a.appendChild(o),
    n.appendChild(a),
    r(),
    o
  );
}
function l(e = "eyes") {
  ((p = e), x(e));
  let t = document.getElementById("tocList");
  if (!t) return;
  ((t.innerHTML = ""),
    b().forEach((o) => {
      let s = document.createElement("li");
      ((s.dataset.topic = o), (s.textContent = i(o)), t.appendChild(s));
    }));
  try {
    window.I18N?.applyTranslations?.(t);
  } catch {}
  let a = document.getElementById("atomsImageContainer");
  (a && (a.innerHTML = ""), I(""), v());
}
function h(e) {
  I(e);
  let t = document.getElementById("atomsImageContainer");
  if (t)
    if (((t.innerHTML = ""), e === "Anatomy"))
      p === "ears"
        ? u("images/atoms/EarAnatomy.webp", i("Ear Anatomy"), t)
        : u("images/atoms/Anatomy1.webp", i("Eye Anatomy"), t);
    else {
      let n = A[e] || `${e.replace(/\s/g, "")}.png`,
        a = u(`images/atoms/${n}`, i(e), t);
      e.replace(/\s/g, "") === "CaseStudy" &&
        (a.parentElement?.classList.add("atoms-card-image-frame--rotated"),
        (a.style.transform = "rotate(90deg)"),
        (a.style.marginBottom = "0"),
        r());
    }
}
function N(e) {
  let t = e?.target?.closest?.("li");
  if (!t) return;
  let n = t.dataset.topic || t.textContent.trim();
  (h(n), m());
}
function w(e) {
  let t = g(e);
  t && (h(t), m());
}
function O() {
  let e = document.getElementById("atomsImageContainer");
  e && (e.dataset.buttonZoom = "1");
  let t = document.getElementById("atomsZoomOutBtn"),
    n = document.getElementById("atomsZoomInBtn");
  (t &&
    t.dataset.wired !== "1" &&
    ((t.dataset.wired = "1"), t.addEventListener("click", () => B(-0.18))),
    n &&
      n.dataset.wired !== "1" &&
      ((n.dataset.wired = "1"), n.addEventListener("click", () => B(0.18))));
}
function M() {
  let e = document.getElementById("atomsPrevCardBtn"),
    t = document.getElementById("atomsNextCardBtn");
  (e &&
    e.dataset.wired !== "1" &&
    ((e.dataset.wired = "1"), e.addEventListener("click", () => w(-1))),
    t &&
      t.dataset.wired !== "1" &&
      ((t.dataset.wired = "1"), t.addEventListener("click", () => w(1))),
    T());
}
function F() {
  let e = document.getElementById("tocToggleBtn");
  e && e.addEventListener("click", y);
  let t = document.getElementById("closeTOCBtn");
  t && t.addEventListener("click", m);
  let n = document.getElementById("tocInlineCloseBtn");
  n && n.addEventListener("click", m);
  let a = document.getElementById("eyesTab");
  a && a.addEventListener("click", () => l("eyes"));
  let o = document.getElementById("earsTab");
  o && o.addEventListener("click", () => l("ears"));
  let s = document.getElementById("tocList");
  s && s.addEventListener("click", N);
}
function S() {
  let e = document.getElementById("atomsCardPage");
  if (!e || e.dataset.init === "1") return;
  ((e.dataset.init = "1"),
    F(),
    O(),
    M(),
    window.addEventListener("resize", r, { passive: !0 }),
    y(),
    l("eyes"));
  let t = document.getElementById("atomsImageContainer");
  t && (t.innerHTML = "");
}
function P(e = "eyes") {
  let t = new CustomEvent("page:navigate", {
    detail: { pageId: "atomsCardPage" },
  });
  (window.dispatchEvent(t), y());
  let n = document.getElementById("atomsImageContainer");
  (n && (n.innerHTML = ""), l(e));
}
export { P as goToAtomsCard, S as initializeAtomsCard };
