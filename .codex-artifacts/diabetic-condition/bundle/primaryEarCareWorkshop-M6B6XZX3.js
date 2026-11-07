import { a as z } from "./chunk-I7EOAFUN.js";
import { a as H, c as q, d as R } from "./chunk-Y4ULCW5I.js";
import { a as F } from "./chunk-6WVU3F6C.js";
import "./chunk-KOQD3NIP.js";
import "./chunk-KIQ7J7XB.js";
import { j as M } from "./chunk-VCI44EBL.js";
import "./chunk-724JZPMA.js";
import "./chunk-VKQVMSQC.js";
import { l as V, s as A } from "./chunk-C3DWFWW5.js";
import "./chunk-P2HPNKQY.js";
import "./chunk-BGCC32GM.js";
import "./chunk-WOT6VMZA.js";
var m = "primaryEarCareWorkshop",
  O = `${m}:lesson`,
  j = `${m}:restore`,
  $ = `${m}:completedFolders`,
  G = !1,
  p = (e, a) => ({
    src: `/images/learning/PrimaryEarCare/${e}.png`,
    caption: a,
  }),
  Y = (e) => `/videos/Workshop/Shared/${e}_220p.mp4`,
  B = {
    objectives: {
      sections: [
        ["objectives", ["objective_one", "objective_two"]],
        [
          "ear_examination",
          ["history", "test_hearing", "examine_ears", "diagnosis", "action"],
        ],
        ["care_procedures", ["ear_irrigation", "dry_mopping", "ear_drops"]],
      ],
    },
    aim: {
      sections: [
        ["aim", ["aim_competent", "aim_hear", "aim_engagement", "aim_formula"]],
      ],
    },
    arclight: {
      sections: [["arclight", ["arclight_guide"]]],
      images: [p("image5", "arclight_package")],
      videos: ["/videos/Workshop/PEC/WhatisArclight.mp4"],
    },
    earHealth: {
      images: [
        { src: "/images/Ears/HealthandDeafness.jpg", caption: "ear_health" },
        p("image104", "hearing_loss_causes"),
      ],
    },
    earAnatomy: {
      images: [
        p("image105", "ear_anatomy"),
        p("image108", "tympanic_membrane"),
      ],
    },
    history: {
      sections: [
        [
          "assessment_sequence",
          ["history", "test_hearing", "examine_ears", "diagnosis", "action"],
        ],
      ],
      images: [p("image118", "assessment_sequence")],
    },
    hearing: {
      sections: [["test_hearing", ["hearing_practice"]]],
      images: [
        p("image123", "child_hearing_development"),
        p("image121", "child_hearing_test"),
      ],
    },
    hearingVideo: {
      videos: [
        "/videos/Workshop/PrimaryEarCare/ChildVisualDevelopment_220p.mp4",
      ],
    },
    examination: {
      sections: [["examination", ["observe", "palpate", "otoscopy"]]],
      images: [p("image119", "examination")],
    },
    otoscopyVideo: {
      videos: ["/videos/Otoscopy/Otoscopy_Instructional_Video_051124_720p.mp4"],
    },
    otoscopyGuide: { pdf: !0 },
    earConditions: {
      images: [
        { src: "/images/Ears/TeachingPoster.jpg", caption: "ear_conditions" },
        p("image130", "external_ear_findings"),
      ],
    },
    otoscopyPractice: {
      sections: [
        [
          "otoscopy_practice",
          ["practice_each_other", "practice_structures", "practice_discuss"],
        ],
      ],
      images: [
        p("image128", "tympanic_membrane"),
        p("image130", "external_ear_findings"),
      ],
    },
    simulation: {
      sections: [
        [
          "simulation_stations",
          [
            "station_reflex",
            "station_fundoscopy",
            "station_otoscopy",
            "station_duration",
          ],
        ],
      ],
      videos: [Y("SimulationStations"), Y("SimulationFindings")],
    },
    earIrrigation: {
      sections: [
        [
          "ear_irrigation",
          [
            "irrigation_practice",
            "procedure_demonstration",
            "procedure_practice",
          ],
        ],
      ],
    },
    dryMopping: {
      sections: [
        [
          "dry_mopping",
          ["mopping_practice", "procedure_demonstration", "procedure_practice"],
        ],
      ],
    },
    earDrops: {
      sections: [
        [
          "ear_drops",
          ["drops_practice", "procedure_demonstration", "procedure_practice"],
        ],
      ],
    },
  },
  k = [
    [
      "introduction",
      "introduction",
      [
        [
          "gettingStarted",
          "getting_started",
          [
            ["objectives", "objectives"],
            ["aim", "aim"],
            ["arclight", "arclight", "video"],
          ],
        ],
        [
          "earHealth",
          "ear_health",
          [
            ["earHealth", "ear_health"],
            ["earAnatomy", "ear_anatomy"],
          ],
        ],
      ],
    ],
    [
      "earExamination",
      "ear_examination_folder",
      [
        ["history", "history", [["history", "history"]]],
        [
          "hearing",
          "test_hearing",
          [
            ["hearing", "child_hearing_test"],
            ["hearingVideo", "hearing_video", "video"],
          ],
        ],
        [
          "otoscopy",
          "otoscopy",
          [
            ["otoscopyGuide", "otoscope_pdf", "pdf"],
            ["examination", "examination"],
            ["otoscopyVideo", "otoscopy_video", "video"],
            ["earConditions", "ear_conditions", "pdf"],
            ["otoscopyPractice", "otoscopy_practice"],
            ["simulation", "simulation_stations", "video"],
          ],
        ],
      ],
    ],
    [
      "procedures",
      "procedures_folder",
      [
        [
          "earIrrigation",
          "ear_irrigation",
          [["earIrrigation", "ear_irrigation"]],
        ],
        ["dryMopping", "dry_mopping", [["dryMopping", "dry_mopping"]]],
        ["earDrops", "ear_drops", [["earDrops", "ear_drops"]]],
      ],
    ],
  ];
function _(e) {
  return (
    window.I18N?.t?.(`primaryEarCareWorkshop.${e}`, e.replaceAll("_", " ")) || e
  );
}
function E(e, a, n) {
  let r = document.createElement(e);
  return (
    (r.dataset.i18n = `primaryEarCareWorkshop.${a}`),
    (r.textContent = _(a)),
    n && (r.className = n),
    r
  );
}
function P(e, a) {
  try {
    return JSON.parse(sessionStorage.getItem(e)) || a;
  } catch {
    return a;
  }
}
function I(e, a) {
  try {
    sessionStorage.setItem(e, JSON.stringify(a));
  } catch {}
}
function N(e, a) {
  (e.addEventListener("click", a),
    e.addEventListener("keydown", (n) => {
      (n.key === "Enter" || n.key === " ") && (n.preventDefault(), a());
    }));
}
function W(e, a, n) {
  let r = document.createElement("div");
  ((r.className = `lesson-row lesson-row--${a}`),
    Object.assign(r.dataset, n),
    r.setAttribute("role", "button"),
    (r.tabIndex = 0));
  let t = document.createElement("div");
  ((t.className = "thumb"), t.setAttribute("aria-hidden", "true"));
  let i = document.createElement("div");
  i.className = "lesson-main";
  let d = document.createElement("div");
  return (
    (d.className = "lesson-top"),
    d.append(E("span", e, "lesson-type")),
    i.append(d),
    r.append(
      t,
      i,
      E(
        "span",
        a === "folder" ? "see_all" : a === "video" ? "watch" : "start",
        "lesson-cta",
      ),
    ),
    a === "folder" && r.setAttribute("aria-expanded", "false"),
    r
  );
}
function J(e, a, n, r) {
  let t = document.createElement("div");
  ((t.className = a), Object.assign(t.dataset, n), (t.hidden = !0));
  let i = document.createElement("h3"),
    d = E("button", "close", "see-all-toggle");
  return (
    (d.type = "button"),
    d.addEventListener("click", r),
    i.append(E("span", e), d),
    t.append(i),
    t
  );
}
function U(e) {
  let a = P(j, null);
  a &&
    (e.querySelector(`[data-folder="${a.section}"]`)?.click(),
    e.querySelector(`[data-nested-folder="${a.nested}"]`)?.click());
}
async function Q() {
  (document
    .querySelectorAll("#primaryEarCareLessonPage video")
    .forEach((a) => a.pause()),
    await A(m, {
      subPageId: "primaryEarCareWorkshopPage",
      replace: !0,
      recordHistory: !1,
    }));
  let e = document.getElementById("primaryEarCareWorkshopPage");
  e && U(e);
}
async function X(e, a, n) {
  let r = k
    .find((t) => t[0] === a)?.[2]
    .find((t) => t[0] === n)?.[2]
    .find((t) => t[0] === e);
  (H({
    workshop: m,
    key: `ear-${e}`,
    route: m,
    target: "primaryEarCareLessonPage",
    type: r?.[2] || "scroll",
  }),
    I(O, e),
    I(j, { section: a, nested: n }),
    document
      .querySelectorAll("#primaryEarCareLessonPage video")
      .forEach((t) => t.pause()),
    await A(m, { subPageId: "primaryEarCareLessonPage" }),
    D(e),
    window.scrollTo(0, 0),
    R());
}
async function ne(e) {
  B[e] &&
    (I(O, e), await A(m, { subPageId: "primaryEarCareLessonPage" }), Z(), D(e));
}
function D(e) {
  let a = B[e],
    n = document.getElementById("primaryEarCareLessonPage"),
    r = n?.querySelector(".primary-ear-lesson-content");
  if (!a || !r) return;
  r.replaceChildren();
  let t = !!a.pdf;
  (n.classList.toggle("core-examination-pdf-page", t),
    n.classList.toggle("pec-eye-lesson-page", !t),
    n.classList.toggle("primary-ear-lesson-page", !t),
    r.classList.toggle("pec-eye-lesson-content", !t));
  let i = n.querySelector(".container.pupils-container");
  (i.classList.toggle("diabetic-screening-page", !t),
    i.classList.toggle("medical-students-screening-page", !t),
    (n.querySelector(".primary-ear-pdf-download").hidden = !t));
  let d = n.querySelector(".eyes-topbar__title");
  ((d.dataset.i18n = `primaryEarCareWorkshop.${t ? "otoscope_pdf" : "title"}`),
    (d.textContent = _(t ? "otoscope_pdf" : "title")),
    t && (n.dataset.pdfTitle = _("otoscope_pdf")));
  let u = document.createElement("section");
  ((u.className =
    "diabetic-screening-lesson diabetic-screening-lesson--tight-hero"),
    (u.dataset.diabeticScrollLesson = ""));
  let l = document.createElement("header");
  ((l.className = "diabetic-screening-hero"),
    (l.dataset.diabeticScrollStep = ""));
  let w = k
    .flatMap((o) => o[2])
    .flatMap((o) => o[2])
    .find((o) => o[0] === e)?.[1];
  l.append(E("p", "title", "diabetic-screening-eyebrow"), E("h2", w || e));
  let c = document.createElement("div");
  if (
    ((c.className = "diabetic-screening-stack"),
    (a.sections || []).forEach(([o, S], g) => {
      let s = document.createElement("article");
      ((s.className = "diabetic-screening-panel"),
        (s.dataset.diabeticScrollStep = ""));
      let f = document.createElement("div");
      f.className = "diabetic-screening-panel__text";
      let L = document.createElement("span");
      ((L.className = "diabetic-screening-step"),
        (L.textContent = String(g + 1).padStart(2, "0")),
        f.append(L, E("h3", o)));
      let b = document.createElement("ul");
      ((b.className = "medical-overview-list"),
        S.forEach((C) => {
          let T = document.createElement("li");
          (T.append(E("span", C)), b.append(T));
        }),
        s.append(f, b),
        c.append(s));
    }),
    z(c, a.images || [], _, "primaryEarCareWorkshop"),
    (a.videos || []).forEach((o, S) => {
      let g = document.createElement("article");
      ((g.className =
        "diabetic-screening-panel diabetic-screening-panel--content-fit"),
        (g.dataset.diabeticScrollStep = ""));
      let s = document.createElement("video");
      ((s.controls = !0),
        (s.playsInline = !0),
        (s.preload = "metadata"),
        (s.className = "medical-learning-video"),
        s.setAttribute("aria-label", `${_(w)} ${S + 1}`));
      let f = document.createElement("source");
      ((f.src = o),
        (f.type = "video/mp4"),
        s.append(f),
        g.append(s),
        c.append(g));
    }),
    u.append(l, c),
    t)
  ) {
    let o = document.createElement("div");
    ((o.id = "primaryEarCarePdfViewer"),
      (o.className = "core-examination-pdf-viewer"),
      o.setAttribute("aria-label", _("otoscope_pdf")),
      r.append(o),
      M());
  } else r.append(u);
  let h = P(j, {}),
    x =
      k
        .find((o) => o[0] === h.section)?.[2]
        .find((o) => o[0] === h.nested)?.[2] || [],
    y = x.findIndex((o) => o[0] === e),
    v = document.createElement("nav");
  ((v.className = "pec-flow-nav"),
    v.setAttribute("aria-label", _("lesson_navigation")),
    [
      [-1, "previous", "pec-flow-prev"],
      [1, "next", "pec-flow-next"],
    ].forEach(([o, S, g]) => {
      let s = E("button", S, g);
      ((s.type = "button"),
        s.addEventListener("click", () => {
          let f = x[y + o];
          if (f) X(f[0], h.section, h.nested);
          else {
            if (o > 0) {
              let L = new Set(P($, []));
              (L.add(h.nested), I($, [...L]));
              let b = document.querySelector(
                `#primaryEarCareWorkshopPage [data-nested-folder="${h.nested}"]`,
              );
              if (
                (b?.classList.add("is-pec-complete"),
                b && !b.querySelector(".pec-folder-complete"))
              ) {
                let C = document.createElement("span");
                ((C.className = "pec-folder-complete"),
                  (C.textContent = "\u2713"),
                  C.setAttribute("aria-label", _("completed")),
                  b.querySelector(".lesson-top")?.append(C));
              }
            }
            Q();
          }
        }),
        v.append(s));
    }),
    r.append(v),
    window.I18N?.applyTranslations?.(n),
    t || F());
}
function Z() {
  let e = document.getElementById("primaryEarCareWorkshopPage");
  if (!e) return;
  if (e.dataset.inited === "1") {
    q(m);
    return;
  }
  e.dataset.inited = "1";
  let a = e.querySelector(".pec-workshop-folders"),
    n = () => {
      (a
        .querySelectorAll(".pec-section-card, .pec-nested-section-card")
        .forEach((t) => {
          t.hidden = !0;
        }),
        a
          .querySelectorAll(".pec-folder-row, .pec-nested-folder-row")
          .forEach((t) => {
            ((t.hidden = !1), t.setAttribute("aria-expanded", "false"));
          }),
        a
          .querySelectorAll(".pec-section-card")
          .forEach((t) => t.classList.remove("pec-nested-folder-open")),
        e.classList.remove("pec-folder-open"));
    };
  (k.forEach(([t, i, d]) => {
    let u = W(i, "folder", { folder: t });
    u.classList.add("pec-folder-row");
    let l = J(i, "pec-section-card", { section: t }, n),
      w = () => {
        (l.querySelectorAll(".pec-nested-section-card").forEach((c) => {
          c.hidden = !0;
        }),
          l.querySelectorAll(".pec-nested-folder-row").forEach((c) => {
            ((c.hidden = !1), c.setAttribute("aria-expanded", "false"));
          }),
          l.classList.remove("pec-nested-folder-open"));
      };
    (N(u, () => {
      (n(),
        (u.hidden = !0),
        u.setAttribute("aria-expanded", "true"),
        (l.hidden = !1),
        e.classList.add("pec-folder-open"));
    }),
      d.forEach(([c, h, x]) => {
        let y = W(h, "folder", { nestedFolder: c });
        y.classList.add("pec-nested-folder-row");
        let v = J(h, "pec-nested-section-card", { nestedSection: c }, w);
        if (
          (N(y, () => {
            (w(),
              (y.hidden = !0),
              y.setAttribute("aria-expanded", "true"),
              (v.hidden = !1),
              l.classList.add("pec-nested-folder-open"));
          }),
          x.forEach(([o, S, g = "scroll"]) => {
            let s = W(S, g, { lesson: `ear-${o}`, earLesson: o });
            (N(s, () => void X(o, t, c)), v.append(s));
          }),
          P($, []).includes(c))
        ) {
          y.classList.add("is-pec-complete");
          let o = document.createElement("span");
          ((o.className = "pec-folder-complete"),
            (o.textContent = "\u2713"),
            o.setAttribute("aria-label", _("completed")),
            y.querySelector(".lesson-top").append(o));
        }
        l.append(y, v);
      }),
      a.append(u, l));
  }),
    document
      .querySelectorAll(
        "#primaryEarCareWorkshopPage .menuBtn, #primaryEarCareLessonPage .menuBtn",
      )
      .forEach((t) => N(t, V)),
    G ||
      ((G = !0),
      document.addEventListener(
        "click",
        (t) => {
          if (
            !t.target.closest?.("#backBtnGlobal") ||
            document.body.dataset.currentRoute !== m ||
            P("paediatricSurgicalEyeEarWorkshop:activeLesson", null)
          )
            return;
          let i = document.getElementById("primaryEarCareLessonPage");
          !i ||
            getComputedStyle(i).display === "none" ||
            (t.preventDefault(), t.stopImmediatePropagation(), Q());
        },
        !0,
      ),
      document.addEventListener("page:shown", (t) => {
        t.detail?.id !== "primaryEarCareLessonPage" &&
          document
            .querySelectorAll("#primaryEarCareLessonPage video")
            .forEach((i) => i.pause());
      })));
  let r = P(O, null);
  (r &&
    (!B[r]?.pdf ||
      getComputedStyle(document.getElementById("primaryEarCareLessonPage"))
        .display !== "none") &&
    D(r),
    U(e),
    window.I18N?.applyTranslations?.(e),
    q(m));
}
export {
  Z as initializePrimaryEarCareWorkshop,
  ne as openPrimaryEarCareSharedLesson,
};
