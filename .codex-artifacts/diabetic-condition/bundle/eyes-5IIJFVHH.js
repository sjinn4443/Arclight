import { a as P } from "./chunk-S3Y4YK3U.js";
import { d as M, e as W } from "./chunk-5FZC2BK5.js";
import { b as G, l as B, r as z, s as D } from "./chunk-C3DWFWW5.js";
import "./chunk-P2HPNKQY.js";
import "./chunk-BGCC32GM.js";
import "./chunk-WOT6VMZA.js";
var $ = "likedItems",
  Z = ["likedEyes_v1", "eyesLikes"];
function Y(a) {
  try {
    return JSON.parse(a);
  } catch {
    return null;
  }
}
function N() {
  let a = localStorage.getItem($);
  if (a !== null) {
    let i = Y(a) || [];
    return Array.isArray(i) ? new Set(i.map(String)) : new Set();
  }
  for (let i of Z) {
    let l = localStorage.getItem(i);
    if (l !== null) {
      let v = Y(l) || [];
      if (Array.isArray(v)) return new Set(v.map(String));
    }
  }
  return new Set();
}
function ee(a) {
  let i = Array.from(a).map(String);
  (localStorage.setItem($, JSON.stringify(i)),
    window.dispatchEvent(new CustomEvent("likes:changed", { detail: i })));
}
function X(a) {
  let i = String(a),
    l = N();
  return (l.has(i) ? l.delete(i) : l.add(i), ee(l), l);
}
function te(a) {
  typeof window.showPage == "function" ? window.showPage(a) : D(a);
}
var ae = {
    "History Taking": "images/icon/eyes/core/car_history.webp",
    "Visual Acuity": "images/icon/eyes/core/car_visualacuity.webp",
    Pupils: "images/icon/eyes/core/car_pupils.webp",
    "Front of Eye": "images/icon/eyes/core/car_frontofeye.webp",
    "Fundal Reflex": "images/icon/eyes/core/car_fundalreflex.webp",
    Ophthalmoscopy: "images/icon/eyes/core/car_ophth.webp",
    "Interactive Learning": "images/icon/eyes/core/car_miniapp.webp",
    "Uncorrected Refractive Error": "images/icon/eyes/disease/car_uncor.webp",
    Cataract: "images/icon/eyes/disease/car_cataract.webp",
    Glaucoma: "images/icon/eyes/disease/car_glaucoma.webp",
    "Diabetic Retinopathy": "images/icon/eyes/disease/car_diabetic.webp",
    "Corneal Disease": "images/icon/eyes/disease/car_corneal.webp",
    "Childhood Eye Screening": "images/icon/eyes/disease/car_childhood.webp",
    "Retinopathy of Prematurity": "images/icon/eyes/disease/car_rop.webp",
    "Retinal Disease": "images/icon/eyes/disease/car_retinal.webp",
    "Optic Nerve Disease": "images/icon/eyes/disease/car_opticnerv.webp",
    PEC: "images/icon/eyes/workshop/car_who.webp",
    "Paediatric Surgical Eye & Ear":
      "images/icon/eyes/workshop/car_paediatric.webp",
    Ptosis: "images/icon/eyes/extended/car_ptosis.webp",
    Proptosis: "images/icon/eyes/extended/car_proptosis.webp",
    "Eye Movements/Squint": "images/icon/eyes/extended/car_squint.webp",
    "Cranial Nerve Examination": "images/icon/eyes/extended/car_cranial.webp",
    "Arclight Overview": "images/icon/eyes/tools/car_arclight.webp",
    "Holo Overview": "images/icon/eyes/tools/car_holo.webp",
    "Tools and Kits": "images/icon/eyes/tools/car_arclight.webp",
  },
  ie = Object.freeze({
    "History Taking": "eyes.card_label.history_taking",
    "Visual Acuity": "eyes.card_label.visual_acuity",
    Pupils: "eyes.card_label.pupils",
    "Front of Eye": "eyes.card_label.front_of_eye",
    "Fundal Reflex": "eyes.card_label.fundal_reflex",
    Ophthalmoscopy: "eyes.card_label.ophthalmoscopy",
    "Interactive Learning": "eyes.card_label.interactive_learning",
    "Uncorrected Refractive Error":
      "eyes.card_label.uncorrected_refractive_error",
    Cataract: "eyes.card_label.cataract",
    Glaucoma: "eyes.card_label.glaucoma",
    "Diabetic Retinopathy": "eyes.card_label.diabetic_retinopathy",
    "Corneal Disease": "eyes.card_label.corneal_disease",
    "Childhood Eye Screening": "eyes.card_label.childhood_eye_screening",
    "Retinopathy of Prematurity": "eyes.card_label.retinopathy_of_prematurity",
    "Retinal Disease": "eyes.card_label.retinal_disease",
    "Optic Nerve Disease": "eyes.card_label.optic_nerve_disease",
    PEC: "eyes.card_label.pec",
    Ptosis: "eyes.card_label.ptosis",
    Proptosis: "eyes.card_label.proptosis",
    "Eye Movements/Squint": "eyes.card_label.eye_movements/squint",
    "Cranial Nerve Examination": "eyes.card_label.cranial_nerve_examination",
    "Arclight Overview": "eyes.card_label.arclight_overview",
    "Holo Overview": "eyes.card_label.holo_overview",
    "Tools and Kits": "eyes.card_label.tools_and_kits",
    Extended: "eyes.card_label.extended",
    "Lid Hygeine": "eyes.card_label.lid_hygiene",
    "Eye Irrigation": "eyes.card_label.eye_irrigation",
    "Eyelash Removal": "eyes.card_label.eyelash_removal",
    "Foreign Body Removal": "eyes.card_label.foreign_body_removal",
    "Drops & Ointment": "eyes.card_label.drops_ointment",
    "Eye Pad / Shield": "eyes.card_label.eye_pad_shield",
    "Sight Loss Guidance": "eyes.card_label.sight_loss_guidance",
    "Medical Students": "eyes.card_label.medical_students",
    "Paediatric Surgical Eye & Ear": `${M}.title`,
  }),
  H = Object.freeze({
    "Coming Soon": "eyes.tag_coming_soon",
    Video: "eyes.tag_video",
    "Case Study": "eyes.tag_case_study",
    Quiz: "eyes.tag_quiz",
    "Mini Apps": "eyes.tag_mini_apps",
    "Mini App": "eyes.tag_mini_app",
    Interactive: "eyes.tag_interactive",
    PDF: "eyes.tag_pdf",
    Scroll: "eyes.tag_scroll",
    Scrolly: "i18nLiteral.Scrollytelling",
  }),
  q = Object.freeze({
    toggleLikeAria: "i18nExtra.eyes_toggle_like",
    likeTitle: "i18nExtra.eyes_like",
    goToItemPrefix: "i18nExtra.eyes_go_to_item",
  }),
  K = new Set([
    "learningModules",
    "coreClinicalOphthalmicExamination",
    "diseasesPage",
    "arclightPage",
    "holoOverviewPage",
    "extendedExaminationPage",
    "childhoodEyeScreeningPage",
    "howToUseArclightVideoPage",
    "directOphthalmoscopy",
    "anteriorSegmentVideoPage",
    "frontOfEyePage",
    "pupilsPage",
    "rapdTestVideoPage",
    "phoneAttachmentVideoPage",
    "visualAcuityPage",
    "fundalReflexPage",
    "visualAcuityExaminationScrollPage",
    "frontOfEyeExaminationScrollPage",
    "fundalReflexExaminationScrollPage",
    "binocularIndirectOphthalmoscopyScrollPage",
    "interactiveLearningPage",
    "assessmentVisionPage",
    "normalAbnormalPage",
    "fundalReflexInteractivePage",
    "traumaInteractivePage",
    "amslerInteractivePage",
    "miresPage",
    "morphPage",
    "glaucomaInteractivePage",
    "fieldsInteractivePage",
    "refractInteractivePage",
    "sauronInteractivePage",
    "discsInteractivePage",
    "swollenDiscsInteractivePage",
    "squintPalsyPage",
    "cataractPage",
    "diabeticRetinopathyPage",
    "cataractScrollPage",
  ]),
  U = "arclight:eyes:carousel-state:v1",
  j = "arclight:eyes:carousel-guide-seen:v2",
  J = !1;
function re(a, i, l) {
  return Math.min(l, Math.max(i, a));
}
function se() {
  try {
    let a = sessionStorage.getItem(U);
    if (!a) return {};
    let i = JSON.parse(a);
    return i && typeof i == "object" ? i : {};
  } catch {
    return {};
  }
}
function oe(a) {
  try {
    sessionStorage.setItem(U, JSON.stringify(a));
  } catch {}
}
function F(a, i) {
  if (!i.length) return 0;
  let l = a.getBoundingClientRect(),
    v = i[0].getBoundingClientRect(),
    h = i[i.length - 1].getBoundingClientRect(),
    C = getComputedStyle(a).direction === "rtl",
    x = 2,
    k = C ? v.right <= l.right + x : v.left >= l.left - x,
    T = C ? h.left >= l.left - x : h.right <= l.right + x;
  if (k) return 0;
  if (T) return i.length - 1;
  let R = l.left + l.width / 2,
    b = 0,
    e = 1 / 0;
  return (
    i.forEach((r, t) => {
      let u = r.getBoundingClientRect(),
        _ = u.left + u.width / 2,
        g = Math.abs(_ - R);
      g < e && ((e = g), (b = t));
    }),
    b
  );
}
function O(a) {
  if (!a) return;
  let i = {};
  (a.querySelectorAll(".eyes-carousel, .eyes-track").forEach((l) => {
    let v = l.id;
    if (!v) return;
    let h = Array.from(l.querySelectorAll(".eyes-card"));
    h.length &&
      (i[v] = {
        scrollLeft: Math.round(l.scrollLeft || 0),
        activeIndex: F(l, h),
      });
  }),
    oe(i));
}
function ne() {
  if (J) return !0;
  try {
    return localStorage.getItem(j) === "1";
  } catch {
    return !1;
  }
}
function Q() {
  J = !0;
  try {
    localStorage.setItem(j, "1");
  } catch {}
}
function le(a) {
  if (!a?.isConnected || ne()) return;
  let i = a.querySelector("#coreCarousel"),
    l = i?.querySelector(".eyes-card");
  if (!l || i.querySelectorAll(".eyes-card").length < 2) return;
  let v = Math.max(0, i.scrollWidth - i.clientWidth);
  if (v < 20) return;
  if (Math.abs(i.scrollLeft) > 2) {
    Q();
    return;
  }
  let h = i.getBoundingClientRect();
  if (h.width < 1 || h.height < 1) return;
  let C = getComputedStyle(i).direction === "rtl",
    x = window.matchMedia("(prefers-reduced-motion: reduce)").matches,
    k = i.scrollLeft,
    T = Math.min(v, l.offsetWidth * 0.55, 140),
    R = k + (C ? -T : T),
    b = document.createElement("div");
  ((b.className = "eyes-carousel-guide-spotlight"),
    (b.style.left = `${h.left}px`),
    (b.style.top = `${h.top}px`),
    (b.style.width = `${h.width}px`),
    (b.style.height = `${h.height}px`),
    b.setAttribute("aria-hidden", "true"));
  let e = document.createElement("div");
  ((e.className = "eyes-carousel-guide"),
    (e.dataset.direction = C ? "rtl" : "ltr"),
    e.setAttribute("role", "status"),
    (e.innerHTML =
      '<div class="eyes-carousel-guide__pill"><span class="eyes-carousel-guide__label eyes-carousel-guide__label--touch" data-i18n="i18nExtra.eyes_swipe_to_see_more">Swipe to see more</span><span class="eyes-carousel-guide__label eyes-carousel-guide__label--mouse" data-i18n="i18nExtra.eyes_drag_to_see_more">Drag to see more</span><div class="eyes-carousel-guide__gesture" aria-hidden="true"><span class="eyes-carousel-guide__arrows eyes-carousel-guide__arrows--left"><span class="eyes-carousel-guide__chev"></span><span class="eyes-carousel-guide__chev"></span><span class="eyes-carousel-guide__chev"></span></span><img class="eyes-carousel-guide__hand" src="/scrolly/workshop/childhood/eyesbrain/hand.png" alt="" aria-hidden="true" /><span class="eyes-carousel-guide__arrows eyes-carousel-guide__arrows--right"><span class="eyes-carousel-guide__chev"></span><span class="eyes-carousel-guide__chev"></span><span class="eyes-carousel-guide__chev"></span></span></div></div>'));
  let r = 0,
    t = 0,
    u = () => {
      let c = i.getBoundingClientRect();
      for (let y of [b, e])
        ((y.style.left = `${c.left - r}px`),
          (y.style.top = `${c.top - t}px`),
          (y.style.width = `${c.width}px`),
          (y.style.height = `${c.height}px`));
    };
  (document.body.append(b, e), u());
  let _ = e.getBoundingClientRect();
  ((r = _.left - h.left), (t = _.top - h.top), u());
  try {
    window.I18N?.applyTranslations?.(e);
  } catch {}
  Q();
  let g = new AbortController(),
    { signal: o } = g,
    f = 0,
    d = 0,
    m = !1,
    I = performance.now(),
    p = (c) => c * c * (3 - 2 * c),
    n = () => {
      m ||
        ((m = !0),
        g.abort(),
        cancelAnimationFrame(f),
        clearTimeout(d),
        i.classList.remove("is-demo-scrolling"),
        b.remove(),
        e.remove(),
        a._eyesGuideCleanup === n && delete a._eyesGuideCleanup,
        O(a));
    };
  a._eyesGuideCleanup = n;
  let S = () => {
    ((i.scrollLeft = k),
      i.classList.remove("is-demo-scrolling"),
      O(a),
      e.classList.add("is-fading"),
      b.classList.add("is-fading"),
      (d = window.setTimeout(n, 250)));
  };
  if (
    (window.addEventListener("pointerdown", n, { capture: !0, signal: o }),
    window.addEventListener("touchstart", n, {
      capture: !0,
      passive: !0,
      signal: o,
    }),
    window.addEventListener("wheel", n, {
      capture: !0,
      passive: !0,
      signal: o,
    }),
    window.addEventListener("keydown", n, { capture: !0, signal: o }),
    window.addEventListener("resize", n, { signal: o }),
    window.addEventListener(
      "page:loaded",
      (c) => {
        c.detail?.routeName !== "eyes" && n();
      },
      { signal: o },
    ),
    document.addEventListener(
      "visibilitychange",
      () => {
        document.hidden && n();
      },
      { signal: o },
    ),
    x)
  ) {
    let c = () => {
      if (!m) {
        if (!a.isConnected) {
          n();
          return;
        }
        (u(), (f = requestAnimationFrame(c)));
      }
    };
    ((f = requestAnimationFrame(c)), (d = window.setTimeout(n, 6500)));
    return;
  }
  i.classList.add("is-demo-scrolling");
  let E = 2100,
    w = 3,
    s = (c) => {
      if (m) return;
      if (!a.isConnected) {
        n();
        return;
      }
      u();
      let y = c - I - 350,
        A = 0;
      if (y >= E * w) {
        S();
        return;
      } else if (y >= 0) {
        let L = y % E;
        L < 650
          ? (A = p(L / 650))
          : L < 950
            ? (A = 1)
            : L < 1600 && (A = 1 - p((L - 950) / 650));
      }
      ((i.scrollLeft = k + (R - k) * A), (f = requestAnimationFrame(s)));
    };
  f = requestAnimationFrame(s);
}
function he() {
  (ce(),
    document.addEventListener("click", async (i) => {
      let l = i.target.closest(".eyes-card");
      if (!l) return;
      let v = l.dataset?.target || l.dataset?.page || l.dataset?.route || "",
        h = (l.getAttribute("data-label") || "").toLowerCase();
      if (!(v !== "pupilsPage" && h !== "pupils")) {
        (i.preventDefault(),
          O(document.getElementById("eyesCatalogPage")),
          (window.__videosPendingTarget = "pupilsPage"),
          (window.__videosSuppressFlash = !0));
        try {
          sessionStorage.setItem("gotoSubPage", "pupilsPage");
        } catch {}
        try {
          sessionStorage.setItem("fromRoute", window.currentPageName || "eyes");
        } catch {}
        await D("videos");
        try {
          let { goToVideosSection: C } = await import("./videos-YJRPAZ42.js");
          typeof C == "function" && C("pupilsPage");
        } catch {}
        z("videos", { replace: !0, subPageId: "pupilsPage" });
      }
    }));
}
function ce() {
  let a = document.getElementById("eyesCatalogPage");
  if (!a) return;
  a._eyesGuideCleanup?.();
  let i = (e, r) => {
      if (!e || typeof window.I18N?.applyTranslations != "function") return r;
      let t = document.createElement("span");
      ((t.hidden = !0),
        t.setAttribute("data-i18n", e),
        (t.textContent = r),
        a.appendChild(t));
      try {
        return (window.I18N.applyTranslations(t), (t.textContent || r).trim());
      } catch {
        return r;
      } finally {
        t.remove();
      }
    },
    l = i(q.likeTitle, "Like"),
    v = i(q.goToItemPrefix, "Go to item"),
    h = a.querySelector(".menuBtn");
  h &&
    h.addEventListener(
      "click",
      (e) => {
        (e.preventDefault(), B());
      },
      { once: !0 },
    );
  let C = {
    coreCarousel: [
      {
        label: "Tools and Kits",
        target: "arclightPage",
        tags: ["Video", "PDF"],
      },
      { label: "History Taking", target: P["History Taking"], tags: ["Quiz"] },
      { label: "Visual Acuity", target: "visualAcuityPage", tags: ["Video"] },
      { label: "Pupils", target: "pupilsPage", tags: ["Video"] },
      { label: "Front of Eye", target: "frontOfEyePage", tags: ["Video"] },
      {
        label: "Fundal Reflex",
        target: P["Fundal Reflex"],
        tags: ["Mini App", "Quiz"],
      },
      {
        label: "Ophthalmoscopy",
        target: "directOphthalmoscopy",
        tags: ["Video", "Quiz", "PDF"],
      },
      {
        label: "Interactive Learning",
        target: P["Interactive Learning"],
        tags: ["Mini Apps"],
      },
      {
        label: "Extended",
        target: "extendedExaminationPage",
        tags: ["Interactive", "Quiz"],
        blank: !0,
      },
    ],
    procedureCarousel: [
      "Lid Hygeine",
      "Eye Irrigation",
      "Eyelash Removal",
      "Foreign Body Removal",
      "Drops & Ointment",
      "Eye Pad / Shield",
      "Sight Loss Guidance",
    ].map((e) => ({ label: e, target: P[e], tags: ["Video"], blank: !0 })),
    diseaseCarousel: [
      {
        label: "Uncorrected Refractive Error",
        target: P["Uncorrected Refractive Error"],
        tags: ["Coming Soon"],
      },
      { label: "Cataract", target: P.Cataract, tags: ["Mini App"] },
      { label: "Glaucoma", target: P.Glaucoma, tags: ["Mini App", "Quiz"] },
      {
        label: "Diabetic Retinopathy",
        target: P["Diabetic Retinopathy"],
        tags: ["Scroll", "Video", "Quiz"],
      },
      {
        label: "Corneal Disease",
        target: P["Corneal Disease"],
        tags: ["Coming Soon"],
      },
      {
        label: "Childhood Eye Screening",
        target: P["Childhood Eye Screening"],
        tags: ["Video"],
      },
      {
        label: "Retinopathy of Prematurity",
        target: P["Retinopathy of Prematurity"],
        tags: ["Coming Soon"],
      },
      {
        label: "Retinal Disease",
        target: P["Retinal Disease"],
        tags: ["Coming Soon"],
      },
      {
        label: "Optic Nerve Disease",
        target: P["Optic Nerve Disease"],
        tags: ["Coming Soon"],
      },
    ],
    pecCarousel: [
      {
        label: "Paediatric Surgical Eye & Ear",
        target: "paediatricSurgicalEyeEarWorkshop",
        tags: ["Scroll", "Video", "PDF"],
        blank: !0,
      },
      { label: "PEC", target: P.PEC, tags: ["Scroll"] },
      {
        label: "Medical Students",
        target: "medicalStudentsWorkshop",
        tags: ["Interactive", "Quiz", "PDF"],
      },
      {
        label: "Childhood Eye Screening",
        target: "childhoodEyeScreeningWorkshop",
        tags: ["Video", "Quiz"],
      },
      {
        label: "Glaucoma",
        target: "glaucomaWorkshop",
        tags: ["Video", "Quiz"],
      },
      {
        label: "Diabetic Retinopathy",
        target: "diabeticRetinopathyWorkshop",
        tags: ["Video", "Interactive"],
      },
    ],
  };
  ((window.EYES_SECTIONS = C),
    (window.getAllEyesItems = () => {
      let e = [];
      return (
        Object.values(C).forEach((r) => (r || []).forEach((t) => e.push(t))),
        e
      );
    }));
  let x = (e, r) => {
    let t = a.querySelector(`#${e}`);
    if (!t) return;
    let u = N(),
      _ = (o) =>
        !o || o === "comingSoon"
          ? !1
          : !!(K.has(o) || Object.prototype.hasOwnProperty.call(G, String(o)));
    t.classList.add("eyes-track");
    let g = document.getElementById("eyesCardTemplate");
    g &&
      ((t.textContent = ""),
      r.forEach((o) => {
        let f = !_(o.target, o.tags),
          d = g.content.querySelector(".eyes-card").cloneNode(!0),
          m = ie[o.label];
        (d.classList.toggle("is-disabled", f),
          d.classList.toggle("liked", u.has(o.label)),
          d.classList.toggle(
            "eyes-card--blank-black",
            o.blank || o.label === "Medical Students",
          ),
          (d.dataset.target = o.target),
          (d.dataset.label = o.label));
        let I = d.querySelector(".eyes-card__open");
        ((I.disabled = f),
          I.setAttribute("aria-label", o.label),
          m && I.setAttribute("data-i18n", `${m}:aria-label`),
          f
            ? (d.setAttribute("aria-disabled", "true"),
              d.setAttribute("tabindex", "-1"),
              d.setAttribute("data-disabled", "true"))
            : d.removeAttribute("tabindex"));
        let p = d.querySelector(".heart-btn");
        p &&
          (p.setAttribute("data-i18n", `${q.toggleLikeAria}:aria-label`),
          p.setAttribute("title", l));
        let n = d.querySelector(".eyes-card__bg"),
          S =
            o.target === "childhoodEyeScreeningWorkshop"
              ? "images/icon/eyes/workshop/car_childhoodscreen.webp"
              : ae[o.label];
        n && S
          ? ((n.src = S),
            (n.alt = o.label),
            m && n.setAttribute("data-i18n", `${m}:alt`))
          : n && n.remove();
        let E = d.querySelector(".eyes-card__title");
        if (E) {
          let s = o.target === "paediatricSurgicalEyeEarWorkshop";
          ((E.textContent = s ? W.carousel_title : o.label),
            m && E.setAttribute("data-i18n", s ? `${M}.carousel_title` : m));
        }
        let w = d.querySelector(".tag-row");
        if (w)
          if (f) {
            let s = document.createElement("span");
            ((s.className = "tag coming-tag"),
              (s.textContent = "Coming Soon"),
              s.setAttribute(
                "data-i18n",
                H["Coming Soon"] || "eyes.tag_coming_soon",
              ),
              w.appendChild(s));
          } else
            o.tags?.length
              ? o.tags.forEach((s) => {
                  let c = document.createElement("span");
                  ((c.className = "tag"), (c.textContent = s));
                  let y = H[s];
                  (y && c.setAttribute("data-i18n", y), w.appendChild(c));
                })
              : w.remove();
        t.appendChild(d);
      }));
  };
  Object.entries(C).forEach(([e, r]) => x(e, r));
  try {
    (window.I18N?.applyTranslations?.(a),
      a.querySelectorAll(".heart-btn").forEach((e) => {
        let r = e.getAttribute("aria-label");
        r && e.setAttribute("title", r);
      }));
  } catch {}
  let k = (e) => {
      if (!e) return;
      let r = e.previousElementSibling;
      if (!r || !r.classList.contains("catalog-h2")) return;
      let t = r.querySelector(".carousel-dots");
      if (!t) {
        ((t = document.createElement("span")), (t.className = "carousel-dots"));
        let p = r.querySelector(".see-all");
        r.insertBefore(t, p || null);
      }
      let u = Array.from(e.querySelectorAll(".eyes-card"));
      if (!u.length) {
        t.innerHTML = "";
        return;
      }
      t.innerHTML = u
        .map(
          (p, n) =>
            `<button class="dot" type="button" aria-label="${v} ${n + 1}"></button>`,
        )
        .join("");
      let _ = Array.from(t.querySelectorAll(".dot")),
        g = e.id,
        o = () => F(e, u),
        f = (p) => {
          _.forEach((n, S) => n.classList.toggle("active", S === p));
        },
        d = (p, n = "smooth") => {
          let S = Math.max(0, Math.min(p, u.length - 1)),
            E = getComputedStyle(e).direction === "rtl",
            w = Math.max(0, e.scrollWidth - e.clientWidth);
          if (S === 0 || S === u.length - 1) {
            let y = S === u.length - 1;
            e.scrollTo({ left: E ? (y ? -w : 0) : y ? w : 0, behavior: n });
            return;
          }
          let s = u[S],
            c =
              e.scrollLeft +
              s.getBoundingClientRect().left -
              e.getBoundingClientRect().left -
              e.clientWidth / 2 +
              s.offsetWidth / 2;
          e.scrollTo({ left: c, behavior: n });
        };
      _.forEach((p, n) => p.addEventListener("click", () => d(n)));
      let m = null,
        I = () => {
          m ||
            (m = requestAnimationFrame(() => {
              ((m = null), f(o()));
            }));
        };
      (e.addEventListener("scroll", I, { passive: !0 }),
        requestAnimationFrame(() => {
          let p = g ? se()[g] : null,
            n = p ? Number(p.scrollLeft) : NaN,
            S = p ? Number(p.activeIndex) : NaN;
          if (Number.isFinite(n)) {
            let E = Math.max(0, e.scrollWidth - e.clientWidth),
              w = getComputedStyle(e).direction === "rtl";
            (e.scrollTo({
              left: re(n, w ? -E : 0, w ? 0 : E),
              behavior: "auto",
            }),
              f(o()));
            return;
          }
          if (Number.isFinite(S)) {
            (d(S, "auto"), f(o()));
            return;
          }
          f(o());
        }));
    },
    T = (e) => {
      if (!e || e.dataset.mouseDragBound === "true") return;
      e.dataset.mouseDragBound = "true";
      let r = null,
        t = !1,
        u = 0,
        _ = 0,
        g = 0,
        o = 0,
        f = !1,
        d = !1,
        m = null,
        I = () => {
          m !== null && (cancelAnimationFrame(m), (m = null));
        },
        p = () => {
          e.classList.remove("is-pointer-dragging");
        },
        n = () => {
          let s = Array.from(e.querySelectorAll(".eyes-card"));
          if (!s.length) {
            p();
            return;
          }
          let c = F(e, s),
            y = s[c],
            A =
              e.scrollLeft +
              y.getBoundingClientRect().left -
              e.getBoundingClientRect().left -
              e.clientWidth / 2 +
              y.offsetWidth / 2;
          (p(), e.scrollTo({ left: A, behavior: "smooth" }));
        },
        S = () => {
          if (Math.abs(o) < 0.02) {
            n();
            return;
          }
          let c = o,
            y = performance.now(),
            A = (L) => {
              let V = Math.max(1, Math.min(32, L - y));
              if (
                ((y = L),
                (e.scrollLeft -= c * V),
                (c *= Math.pow(0.94, V / 16.67)),
                Math.abs(c) < 0.02)
              ) {
                ((m = null), n());
                return;
              }
              m = requestAnimationFrame(A);
            };
          m = requestAnimationFrame(A);
        },
        E = ({ keepFreeScroll: s = !1 } = {}) => {
          ((r = null), (d = !1), (t = !1), s || p());
        };
      (e.addEventListener("pointerdown", (s) => {
        s.pointerType === "mouse" &&
          s.button === 0 &&
          (s.target.closest?.(".heart-btn") ||
            (I(),
            (r = s.pointerId),
            (u = s.clientX),
            (_ = s.clientX),
            (g = performance.now()),
            (o = 0),
            (f = !1),
            (d = !1),
            (t = !1)));
      }),
        e.addEventListener(
          "pointermove",
          (s) => {
            if (s.pointerId !== r) return;
            let c = s.clientX - u;
            if (!d && Math.abs(c) < 4) return;
            if (!d) {
              ((d = !0), (f = !0), e.classList.add("is-pointer-dragging"));
              try {
                (e.setPointerCapture(s.pointerId), (t = !0));
              } catch {
                t = !1;
              }
            }
            let y = performance.now(),
              A = s.clientX - _,
              L = Math.max(1, y - g);
            ((o = A / L),
              (_ = s.clientX),
              (g = y),
              (e.scrollLeft -= A),
              s.preventDefault());
          },
          { passive: !1 },
        ));
      let w = (s) => {
        if (s.pointerId !== r) return;
        if (t)
          try {
            e.releasePointerCapture(s.pointerId);
          } catch {}
        let c = d;
        (E({ keepFreeScroll: c }), c && S());
      };
      (e.addEventListener("pointerup", w),
        e.addEventListener("pointercancel", w),
        e.addEventListener("lostpointercapture", () => {
          r !== null && (I(), (t = !1), E());
        }),
        e.addEventListener(
          "click",
          (s) => {
            f &&
              ((f = !1),
              s.preventDefault(),
              s.stopPropagation(),
              typeof s.stopImmediatePropagation == "function" &&
                s.stopImmediatePropagation());
          },
          !0,
        ));
    };
  (a.querySelectorAll(".eyes-carousel, .eyes-track").forEach((e) => {
    (k(e), T(e));
  }),
    a.querySelectorAll(".eyes-carousel, .eyes-track").forEach((e) => {
      let r = null;
      e.addEventListener(
        "scroll",
        () => {
          r ||
            (r = requestAnimationFrame(() => {
              ((r = null), !e.classList.contains("is-demo-scrolling") && O(a));
            }));
        },
        { passive: !0 },
      );
    }),
    requestAnimationFrame(() => {
      requestAnimationFrame(() => le(a));
    }));
  let R = (e) => {
      (e.preventDefault(),
        e.stopPropagation(),
        typeof e.stopImmediatePropagation == "function" &&
          e.stopImmediatePropagation());
    },
    b = (e) => {
      R(e);
      let t = e.currentTarget.closest(".eyes-card"),
        u = t?.getAttribute("data-label");
      if (!u) return;
      let _ = X(u);
      t.classList.toggle("liked", _.has(String(u)));
    };
  (a.querySelectorAll(".heart-btn").forEach((e) => {
    (e.addEventListener("pointerdown", R, { capture: !0 }),
      e.addEventListener("click", b, { capture: !0 }),
      e.addEventListener("keydown", (r) => {
        (r.key === "Enter" || r.key === " ") && b(r);
      }));
  }),
    a.addEventListener(
      "click",
      async (e) => {
        let r = e.target.closest?.(".eyes-card");
        if (!r) return;
        if (
          r.getAttribute("aria-disabled") === "true" ||
          r.dataset.disabled === "true"
        ) {
          (e.preventDefault(), e.stopPropagation());
          return;
        }
        let t = r.dataset?.target || r.dataset?.route || r.dataset?.page || "",
          u = (r.getAttribute("data-label") || "").toLowerCase();
        if ((e.preventDefault(), O(a), t === "pupilsPage" || u === "pupils")) {
          try {
            ((window.__videosPendingTarget = "pupilsPage"),
              (window.__videosSuppressFlash = !0),
              sessionStorage.setItem("gotoSubPage", "pupilsPage"));
          } catch {}
          await D("videos");
          try {
            let { goToVideosSection: g } = await import("./videos-YJRPAZ42.js");
            typeof g == "function"
              ? g("pupilsPage", { skipDefault: !0 })
              : sessionStorage.setItem("gotoSubPage", "pupilsPage");
          } catch {
            sessionStorage.setItem("gotoSubPage", "pupilsPage");
          }
          return;
        }
        if (
          new Set([
            "visualAcuityPage",
            "fundalReflexPage",
            "anteriorSegmentVideoPage",
            "directOphthalmoscopy",
          ]).has(t)
        ) {
          try {
            ((window.__videosPendingTarget = t),
              (window.__videosSuppressFlash = !0),
              sessionStorage.setItem("gotoSubPage", t));
          } catch {}
          await D("videos");
          try {
            let { goToVideosSection: g } = await import("./videos-YJRPAZ42.js");
            typeof g == "function"
              ? g(t, { skipDefault: !0 })
              : sessionStorage.setItem("gotoSubPage", t);
          } catch {
            sessionStorage.setItem("gotoSubPage", t);
          }
          return;
        }
        if (K.has(t)) {
          try {
            ((window.__videosPendingTarget = t),
              (window.__videosSuppressFlash = !0),
              sessionStorage.setItem("gotoSubPage", t));
          } catch {}
          await D("videos");
          try {
            let { goToVideosSection: g } = await import("./videos-YJRPAZ42.js");
            typeof g == "function"
              ? g(t, { skipDefault: !0 })
              : sessionStorage.setItem("gotoSubPage", t);
          } catch {
            sessionStorage.setItem("gotoSubPage", t);
          }
          return;
        }
        te(t);
      },
      { passive: !1 },
    ));
}
export { he as initializeEyes, ce as initializeEyesCatalog };
