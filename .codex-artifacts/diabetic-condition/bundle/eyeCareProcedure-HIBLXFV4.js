import { b as x } from "./chunk-IJSU6RRK.js";
import "./chunk-UZPUTDTM.js";
import "./chunk-I7EOAFUN.js";
import "./chunk-Y4ULCW5I.js";
import "./chunk-6WVU3F6C.js";
import "./chunk-KOQD3NIP.js";
import { a as z, c as N, d as R } from "./chunk-KIQ7J7XB.js";
import "./chunk-724JZPMA.js";
import { b as h, c as W, e as c, f as $, l as q } from "./chunk-KNLC6FEO.js";
import "./chunk-KKOYVSFI.js";
import "./chunk-VKQVMSQC.js";
import { a as O, l as V, q as Y, s as A } from "./chunk-C3DWFWW5.js";
import "./chunk-P2HPNKQY.js";
import "./chunk-BGCC32GM.js";
import "./chunk-WOT6VMZA.js";
var U = Promise.resolve(),
  b = "makeEyePadShieldFullAnimationVideoPage",
  I = null;
function D() {
  I?.querySelectorAll("video, audio").forEach((e) => e.pause());
}
document.addEventListener("page:shown", (e) => {
  e.detail?.id !== b && D();
});
window.addEventListener("page:loaded", () => {
  (!I?.isConnected || document.body.dataset.currentRoute !== "eyePadShield") &&
    D();
});
async function G() {
  let { initializeFullAnimationVideoPage: e } =
    await import("./videos-YJRPAZ42.js");
  if (document.body.dataset.currentRoute !== "eyePadShield") return;
  let t = document.getElementById(b);
  (I !== t && D(), (I = t), e(b));
}
var _ = new WeakMap();
function H(e = h) {
  let t = document.getElementById(e);
  if (!t) return Promise.resolve();
  if (_.has(t)) return _.get(t);
  let n = U.catch(() => {}).then(async () => {
    let { initializeChildhoodFundalReflexScrollPage: o } =
      await import("./childhoodFundalPreparation-UM6E5EUU.js");
    document.body.dataset.currentRoute !== "eyePadShield" ||
      document.getElementById(e) !== t ||
      t.style.display === "none" ||
      (await o(e === c ? $ : W));
  });
  return ((U = n), _.set(t, n), n.finally(() => _.delete(t)));
}
document.addEventListener("childhoodWorkshop:route-complete", (e) => {
  [h, c].includes(e.detail?.target) && N(e.detail.target, 100);
});
document.addEventListener(z, () => {
  R(document.getElementById("eyePadShield"));
});
var T = !1;
function B() {
  T ||
    ((T = !0),
    requestAnimationFrame(() => {
      T = !1;
      let e = [h, c]
        .map((p) => document.getElementById(p))
        .find((p) => p && p.style.display !== "none");
      if (
        document.body.dataset.currentRoute !== "eyePadShield" ||
        !e ||
        e.style.display === "none"
      )
        return;
      let t = document.getElementById("page-content"),
        n = t && t.scrollHeight > t.clientHeight + 1,
        o = n ? t.scrollTop : window.scrollY,
        u = n
          ? t.scrollHeight - t.clientHeight
          : document.documentElement.scrollHeight - window.innerHeight;
      u > 1 && N(e.id, Math.min(95, (95 * o) / u));
    }));
}
window.addEventListener("scroll", B, { passive: !0 });
window.addEventListener("resize", B, { passive: !0 });
document.addEventListener("scroll", B, { passive: !0, capture: !0 });
function C(e) {
  typeof window.showPage == "function"
    ? window.showPage(e)
    : (window.minimalShowPage(e),
      document.dispatchEvent(
        new CustomEvent("page:shown", { detail: { id: e } }),
      ));
}
function w(e, t, n) {
  let o = document.createElement("span");
  return (
    (o.dataset.i18n = e),
    (o.textContent = window.I18N?.t?.(e, t) || t),
    (o.className = n),
    o
  );
}
function v(e, t, n) {
  let o = document.createElement("button");
  ((o.type = "button"),
    (o.className = `lesson-row lesson-row--${t}`),
    (o.dataset.lesson = `pec-${e.replaceAll("_", "-")}`));
  let u = document.createElement("div");
  ((u.className = "thumb"), u.setAttribute("aria-hidden", "true"));
  let p = document.createElement("div");
  p.className = "lesson-main";
  let s = document.createElement("div");
  return (
    (s.className = "lesson-top"),
    s.append(w(`pecWorkshop.${e}`, e.replaceAll("_", " "), "lesson-type")),
    p.append(s),
    o.append(
      u,
      p,
      w(
        `pecWorkshop.${t === "folder" ? "see_all" : "watch"}`,
        t === "folder" ? "See all >" : "Watch >",
        "lesson-cta",
      ),
    ),
    o.addEventListener("click", n),
    o
  );
}
async function te(e) {
  let t = O[e],
    n = document.getElementById("eyeCareProcedurePage");
  if (!t || !n || document.body.dataset.currentRoute !== e) return;
  n.id = e;
  let o = n.querySelector(".eye-care-procedure-cap");
  ((o.dataset.i18n = t.titleKey), (o.textContent = t.label));
  let u = n.querySelector(".eye-care-procedure-lessons"),
    p = document.getElementById("eyeCareProcedureVideoTemplate"),
    s = document.createElement("div");
  if (
    ((s.className = "eye-care-procedure-video-rows"),
    t.videos.forEach((a) => {
      let l = p.content.firstElementChild.cloneNode(!0);
      l.id = `eyeCareVideo-${a}`;
      let S = l.querySelector(".eye-care-procedure-video-category");
      ((S.dataset.i18n = t.titleKey),
        (S.textContent = t.label),
        n.parentElement.append(l));
      let E = v(a, "video", async () => {
        (await A(e, { subPageId: l.id }), x(a, l.id));
      });
      if (
        ((E.dataset.pecVideo = a),
        s.append(E),
        e === "eyePadShield" && a === "apply_eye_pad")
      ) {
        let P = document
          .getElementById("eyePadShieldScrollTemplate")
          .content.firstElementChild.cloneNode(!0);
        P.id = c;
        let m = P.querySelector(".eyes-topbar__title");
        (m.removeAttribute("data-i18n"),
          (m.textContent = "Apply an Eye Pad and Eye Shield"),
          P.querySelector(".childhood-fundal-prep-list").setAttribute(
            "aria-label",
            "Apply an Eye Pad and Eye Shield guide",
          ),
          n.parentElement.append(P));
        let d = v(a, "scroll", async () => {
          (q(
            c,
            window.I18N?.getLanguage?.() ||
              localStorage.getItem("prefLang") ||
              "en",
          ),
            await A(e, { subPageId: c }),
            await H(c));
        });
        (d.classList.add("lesson-row--scrollytelling"),
          (d.dataset.lesson = "apply-eye-pad-shield-scroll"),
          (d.dataset.target = c),
          (d.dataset.page = c));
        let f = d.querySelector(".lesson-type");
        (f.removeAttribute("data-i18n"),
          (f.textContent = "Apply an Eye Pad and Eye Shield"),
          (f.id = "apply-eye-pad-shield-lesson-title"));
        let i = d.querySelector(".lesson-cta");
        (i.removeAttribute("data-i18n"),
          i.replaceChildren(
            w("auto.diabeticretinopathyworkshop.scroll", "scroll", ""),
            document.createTextNode(" >"),
          ));
        let r = document.createElement("div");
        ((r.className = "lesson-progress"),
          r.setAttribute("role", "progressbar"),
          r.setAttribute("aria-labelledby", f.id),
          r.setAttribute("aria-valuemin", "0"),
          r.setAttribute("aria-valuemax", "100"),
          r.setAttribute("aria-valuenow", "0"));
        let g = document.createElement("div");
        ((g.className = "lesson-progress__fill"),
          r.append(g),
          d.querySelector(".lesson-main").append(r),
          s.append(d));
      }
      if (e === "eyePadShield" && a === "make_eye_pad") {
        let P = document.getElementById("eyePadShieldScrollTemplate");
        n.parentElement.append(P.content.firstElementChild.cloneNode(!0));
        let m = v(a, "scroll", async () => {
          (q(
            h,
            window.I18N?.getLanguage?.() ||
              localStorage.getItem("prefLang") ||
              "en",
          ),
            await A(e, { subPageId: h }),
            await H());
        });
        ((m.dataset.lesson = "make-eye-pad-shield-scroll"),
          (m.dataset.target = h));
        let d = m.querySelector(".lesson-type");
        d.id = "eyePadShield-scroll-lesson-title";
        let f = m.querySelector(".lesson-cta");
        (f.removeAttribute("data-i18n"),
          f.replaceChildren(
            w("auto.diabeticretinopathyworkshop.scroll", "scroll", ""),
            document.createTextNode(" >"),
          ));
        let i = document.createElement("div");
        ((i.className = "lesson-progress"),
          i.setAttribute("role", "progressbar"),
          i.setAttribute("aria-labelledby", d.id),
          i.setAttribute("aria-valuemin", "0"),
          i.setAttribute("aria-valuemax", "100"),
          i.setAttribute("aria-valuenow", "0"));
        let r = document.createElement("div");
        ((r.className = "lesson-progress__fill"),
          i.append(r),
          m.querySelector(".lesson-main").append(i),
          s.append(m));
        let g = v("full_animation", "video", async () => {
          (await A(e, { subPageId: b }), await G());
        });
        ((g.dataset.lesson = "make-eye-pad-shield-full-animation"),
          (g.dataset.target = b));
        let L = g.querySelector(".lesson-type");
        (L.removeAttribute("data-i18n"),
          (L.textContent = "Full animation"),
          (L.id = "eyePadShield-full-animation-lesson-title"));
        let k = i.cloneNode(!0);
        (k.setAttribute("aria-labelledby", L.id),
          g.querySelector(".lesson-main").append(k),
          s.append(g));
      }
    }),
    t.folder)
  ) {
    let a = v(t.folder, "folder", () => {
      ((a.hidden = !0),
        a.setAttribute("aria-expanded", "true"),
        (l.hidden = !1));
    });
    ((a.dataset.nestedFolder = "lidHygiene"),
      a.setAttribute("aria-expanded", "false"),
      a.setAttribute("aria-controls", "eyeCareLidHygieneLessons"));
    let l = document.createElement("div");
    ((l.id = "eyeCareLidHygieneLessons"),
      (l.className = "eye-care-procedure-folder-content"),
      (l.hidden = !0));
    let S = document.createElement("h2");
    S.append(w(`pecWorkshop.${t.folder}`, t.label, ""));
    let E = document.createElement("button");
    ((E.type = "button"),
      (E.className = "see-all-toggle"),
      E.append(w("pecWorkshop.close", "Close ^", "")),
      E.addEventListener("click", () => {
        ((l.hidden = !0),
          (a.hidden = !1),
          a.setAttribute("aria-expanded", "false"),
          a.focus());
      }),
      S.append(E),
      l.append(S, s),
      u.append(a, l));
  } else u.append(s);
  (n.parentElement.querySelectorAll(".menuBtn").forEach((a) => {
    (a.addEventListener("click", V),
      a.addEventListener("keydown", (l) => {
        (l.key !== "Enter" && l.key !== " ") || (l.preventDefault(), a.click());
      }));
  }),
    window.I18N?.applyTranslations?.(n.parentElement),
    R(n));
  let y = Y()?.subPageId,
    F = t.videos.find((a) => y === `eyeCareVideo-${a}`);
  e === "eyePadShield" && [h, c].includes(y)
    ? (C(y), await H(y))
    : e === "eyePadShield" && y === b
      ? (C(y), await G())
      : F
        ? (t.folder && u.querySelector("[data-nested-folder]").click(),
          C(y),
          x(F, y))
        : C(e);
}
export { te as initializeEyeCareProcedure };
