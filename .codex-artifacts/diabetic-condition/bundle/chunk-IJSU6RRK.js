import { a as B } from "./chunk-UZPUTDTM.js";
import { a as Q } from "./chunk-I7EOAFUN.js";
import { a as j, c as z, d as J } from "./chunk-Y4ULCW5I.js";
import { a as Y } from "./chunk-6WVU3F6C.js";
import { l as D, s as A } from "./chunk-C3DWFWW5.js";
var X = "pecWorkshop:fundalInterpretationAnswers";
function Z(t, r) {
  let e;
  try {
    e = JSON.parse(localStorage.getItem(X) || "null");
  } catch {}
  let n = B.map((b, m) =>
      ["Normal", "Abnormal"].includes(e?.answers?.[m]) ? e.answers[m] : null,
    ),
    a = !!(e?.submitted && n.every(Boolean)),
    o = [],
    s = (b, m, _) => {
      let E = document.createElement(b);
      return ((E.className = m), _ && (E.textContent = _), E);
    },
    c = () => {
      try {
        localStorage.setItem(X, JSON.stringify({ answers: n, submitted: a }));
      } catch {}
    };
  B.forEach((b, m) => {
    let _ = s(
      "article",
      "diabetic-screening-panel diabetic-screening-panel--content-fit pec-interpretation-card",
    );
    ((_.dataset.diabeticScrollStep = ""), (_.dataset.question = String(m + 1)));
    let E = s("h3", "pec-interpretation-number", String(m + 1));
    E.setAttribute("aria-label", `${r("question")} ${m + 1}`);
    let y = s("img", "pec-interpretation-image");
    ((y.src = `/images/quiz/fundal-reflex/case-${m + 1}.webp`),
      (y.alt = `${r("fundal_test_images")} ${m + 1}`),
      (y.width = 640),
      (y.height = 360),
      (y.loading = "lazy"));
    let S = s("div", "pec-interpretation-choices");
    (S.setAttribute("role", "group"),
      S.setAttribute("aria-label", `${r("question")} ${m + 1}`),
      ["Normal", "Abnormal"].forEach((F) => {
        let R = s("button", "pec-interpretation-choice", r(F.toLowerCase()));
        ((R.type = "button"),
          (R.dataset.answer = F),
          R.addEventListener("click", () => {
            a || ((n[m] = F), c(), h());
          }),
          S.append(R));
      }));
    let x = s("p", "pec-interpretation-result");
    (x.setAttribute("role", "status"),
      _.append(E, y, S, x),
      t.append(_),
      o.push({
        choices: S,
        result: x,
        correct: b.normal === "Yes" ? "Normal" : "Abnormal",
      }));
  });
  let i = s("div", "pec-interpretation-actions frq-mount"),
    d = s("p", "pec-interpretation-status");
  d.setAttribute("role", "status");
  let l = s(
    "button",
    "pec-interpretation-submit frq-button frq-primary",
    r("submit_answers"),
  );
  l.type = "button";
  let u = s("button", "pec-interpretation-retry frq-button", r("try_again"));
  u.type = "button";
  let g = s("div", "frq-actions");
  (g.append(l, u), i.append(d, g), t.append(i));
  let p = () =>
    i.style.setProperty(
      "--pec-quiz-container-width",
      `${document.body.clientWidth}px`,
    );
  p();
  let f = new ResizeObserver(p);
  f.observe(document.body);
  let v = new AbortController();
  window.addEventListener(
    "page:loaded",
    () => {
      i.isConnected || (f.disconnect(), v.abort());
    },
    { signal: v.signal },
  );
  function h() {
    o.forEach(({ choices: m, result: _, correct: E }, y) => {
      (m.querySelectorAll("button").forEach((x) => {
        (x.setAttribute("aria-pressed", String(n[y] === x.dataset.answer)),
          (x.disabled = a));
      }),
        (_.hidden = !a));
      let S = n[y] === E;
      (_.classList.toggle("is-correct", a && S),
        _.classList.toggle("is-incorrect", a && !S),
        (_.textContent = a
          ? `${S ? "\u2713" : "\u2715"} ${r(S ? "correct" : "incorrect")} \xB7 ${r("correct_answer")}: ${r(E.toLowerCase())}`
          : ""));
    });
    let b = n.every(Boolean);
    ((l.disabled = !b),
      (l.hidden = a),
      (u.hidden = !a),
      (d.hidden = a || b),
      (d.textContent = r("answer_all_images")));
  }
  (l.addEventListener("click", () => {
    !n.every(Boolean) ||
      a ||
      ((a = !0),
      c(),
      h(),
      document.dispatchEvent(
        new CustomEvent("primaryWorkshop:worksheet-saved", {
          detail: { key: "fundalInterpretation", percent: 100 },
        }),
      ));
  }),
    u.addEventListener("click", () => {
      ((a = !1), n.fill(null), c(), h());
    }),
    h());
}
var ye = "/images/workshop/PEC/FundalReflexes/";
var ge = [
  {
    name: "Normal",
    key: "normal",
    description: [
      "A normal eye reflects light from the retina, producing a visible fundal reflex.",
    ],
    reflex: !0,
  },
  {
    name: "Cataract",
    key: "cataract",
    description: [
      "A cataract clouds the eye\u2019s natural lens, blocking light travelling to and from the retina and reducing or obscuring the fundal reflex.",
    ],
  },
  {
    name: "Retinoblastoma",
    key: "retinoblastoma",
    description: [
      "Retinoblastoma is a malignant tumour arising from immature retinal cells. As it grows, a pale mass covers the normal red retinal background.",
      "Light reflects from the tumour instead of the normal retina, producing a white or yellow pupil reflex.",
    ],
    reflex: !0,
  },
];
function P(t, r, e) {
  let n = document.createElement(t);
  return (
    (n.dataset.i18n = `pecWorkshop.${r}`),
    (n.textContent = window.I18N?.t?.(n.dataset.i18n, e) || e),
    n
  );
}
function _e(t, r, e, n) {
  let a = document.createElement("article");
  ((a.className = "diabetic-screening-panel pec-reflex-panel"),
    (a.dataset.diabeticScrollStep = ""));
  let o = document.createElement("div");
  o.className = "diabetic-screening-panel__text";
  let s = document.createElement("span");
  return (
    (s.className = "diabetic-screening-step"),
    (s.textContent = String(n + 1).padStart(2, "0")),
    o.append(s, P("h3", e, r)),
    a.append(o),
    t.append(a),
    a
  );
}
function I(t, r, e, n, a, o, s) {
  let c = document.createElement("img");
  return (
    (c.src = `${ye}${r}.webp`),
    (c.alt = ""),
    (c.draggable = !1),
    (c.className = `pec-reflex-layer pec-reflex-layer--${e}`),
    (c.style.cssText = `left:${(n / 2382) * 100}%;top:${(a / 1700) * 100}%;width:${(o / 2382) * 100}%;height:${(s / 1700) * 100}%`),
    t.append(c),
    c
  );
}
function ee(t, r, e, n) {
  let a = document.createElement("button");
  ((a.type = "button"),
    (a.className = "childhood-fundal-stage-replay-btn pec-reflex-control"),
    (a.disabled = !0));
  let o = {
      replay:
        '<img class="childhood-fundal-stage-replay-btn__icon" src="/images/icon/base/replay.webp" alt="" aria-hidden="true" draggable="false">',
      pause:
        '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M6 5h4v14H6zM14 5h4v14h-4z"/></svg>',
      play: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M8 5l11 7-11 7z"/></svg>',
    },
    s = !1,
    c = !1,
    i = !1,
    d = !1,
    l = !1,
    u = (p) => {
      if (a.dataset.playback === p) return;
      ((a.dataset.playback = p), (a.innerHTML = o[p]));
      let f = `pecWorkshop.reflex_${p}`,
        v =
          window.I18N?.t?.(f, `${p[0].toUpperCase()}${p.slice(1)} animation`) ||
          p;
      ((a.dataset.i18n = `${f}:aria-label;${f}:title`),
        a.setAttribute("aria-label", v),
        (a.title = v));
    },
    g = () => {
      s &&
        (d || !c || i
          ? (e.pause(), u(d ? "replay" : "play"))
          : n && !l
            ? ((d = !0), e.finish(), u("replay"))
            : (e.play(), u("pause")));
    };
  return (
    a.addEventListener(
      "click",
      () => {
        ((l = !0),
          a.dataset.playback === "pause"
            ? (i = !0)
            : ((i = !1), d && ((d = !1), e.restart())),
          g());
      },
      { signal: r },
    ),
    u("play"),
    t.append(a),
    {
      setVisible(p) {
        ((c = p), g());
      },
      ready() {
        ((s = !0), (a.disabled = !1), g());
      },
      complete() {
        ((d = !0), g());
      },
      destroy() {
        e.destroy();
      },
    }
  );
}
function q(t, r) {
  let e = t.animate(
    r.map(([n, a, o = 1]) => ({ offset: n / 4200, clipPath: a, opacity: o })),
    { duration: 4200, fill: "both", easing: "linear" },
  );
  return (e.pause(), e);
}
function te(t) {
  let r = new AbortController(),
    { signal: e } = r,
    n = window.matchMedia("(prefers-reduced-motion: reduce)").matches,
    a = new Map(),
    o = new IntersectionObserver(
      (c) => {
        c.forEach(({ target: i, isIntersecting: d, intersectionRatio: l }) => {
          a.get(i)?.setVisible(d && l >= 0.35);
        });
      },
      { threshold: [0, 0.35] },
    );
  for (let [c, i] of ge.entries()) {
    let d = _e(t, i.name, `reflex_${i.key}_title`, c);
    d.dataset.reflexCase = i.key;
    let l = document.createElement("div");
    ((l.className = "pec-reflex-stage"),
      l.setAttribute("role", "group"),
      l.setAttribute(
        "aria-label",
        `${i.name}: light travelling from the Arclight into the eye and reflecting back`,
      ),
      d.append(l),
      I(l, `${i.name}Background`, "background", 0, 0, 2382, 1700));
    let u = i.key === "cataract",
      g = I(
        l,
        u ? "CataractLight" : "NormalandRetinoblastomaLight",
        "light",
        u ? 170 : 110,
        770,
        u ? 491 : 993,
        154,
      ),
      p = I(l, `${i.name}Arrow1`, "incoming", 256, 776, u ? 318 : 859, 142),
      f = I(
        l,
        `${i.name}Arrow2`,
        "outgoing",
        250,
        776,
        u ? 318 : i.key === "normal" ? 859 : 761,
        i.key === "normal" ? 143 : 142,
      ),
      v = i.reflex
        ? I(
            l,
            `${i.name}Reflex`,
            "reflex",
            1805,
            785,
            i.key === "normal" ? 127 : 128,
            127,
          )
        : null;
    I(l, "Arclight", "arclight", 82, 480, 112, 1477);
    let h = "inset(0 100% 0 0)",
      b = "inset(0 0 0 100%)",
      m = "inset(0 0 0 0)",
      _ = [
        q(g, [
          [0, h],
          [500, h],
          [1300, m],
          [4200, m],
        ]),
        q(p, [
          [0, h],
          [800, h],
          [1600, m],
          [2100, m],
          [2700, b],
          [4200, b],
        ]),
        q(f, [
          [0, b],
          [2400, b],
          [3400, m],
          [4200, m],
        ]),
      ];
    v &&
      _.push(
        q(v, [
          [0, m, 0],
          [2900, m, 0],
          [3300, m, 1],
          [4200, m, 1],
        ]),
      );
    let E = ee(
      l,
      e,
      {
        play: () => _.forEach((y) => y.play()),
        pause: () => _.forEach((y) => y.pause()),
        restart: () => _.forEach((y) => y.cancel()),
        finish: () => _.forEach((y) => y.finish()),
        destroy: () => _.forEach((y) => y.cancel()),
      },
      n,
    );
    (_[0].addEventListener("finish", () => E.complete(), { signal: e }),
      a.set(l, E),
      i.description.forEach((y, S) =>
        d.append(P("p", `reflex_${i.key}_description_${S + 1}`, y)),
      ),
      Promise.all(Array.from(l.querySelectorAll("img"), (y) => y.decode()))
        .then(() => {
          e.aborted || (E.ready(), o.observe(l));
        })
        .catch(() => {
          e.aborted ||
            d.append(
              P(
                "p",
                "reflex_load_error",
                "The animation could not load. Please reopen this lesson to try again.",
              ),
            );
        }),
      i.key === "normal" && he(d, a, o, e, n));
  }
  let s = () => {
    (r.abort(), o.disconnect(), a.forEach((c) => c.destroy()), a.clear());
  };
  return (
    window.addEventListener(
      "page:loaded",
      () => {
        t.isConnected || s();
      },
      { signal: e },
    ),
    s
  );
}
function he(t, r, e, n, a) {
  let o = P("h3", "reflex_colours_title", "Normal reflex colours");
  ((o.className = "pec-reflex-colours-heading"), t.append(o));
  let s = document.createElement("div");
  s.className = "pec-reflex-variations-frame";
  let c = document.createElement("div");
  ((c.className = "pec-reflex-variations"),
    c.setAttribute("role", "img"),
    c.setAttribute(
      "aria-label",
      "Normal fundal reflex colours with different pigmentation",
    ),
    s.append(c),
    t.append(s));
  let i,
    d = ee(
      s,
      n,
      {
        play: () => i?.play(),
        pause: () => i?.pause(),
        restart: () => i?.goToAndStop(0, !0),
        finish: () => i?.goToAndStop(i.totalFrames - 1, !0),
        destroy: () => i?.destroy(),
      },
      a,
    );
  (r.set(c, d),
    t.append(
      P(
        "p",
        "reflex_colours_intro",
        "The normal fundal reflex varies with pigmentation.",
      ),
    ));
  let l = document.createElement("ul");
  ((l.className = "pec-reflex-colour-list"),
    [
      "Black: yellow / white / blue reflex",
      "White: orange / red reflex",
      "Asian: orange / yellow reflex",
    ].forEach((u, g) => l.append(P("li", `reflex_colours_${g + 1}`, u))),
    t.append(l),
    import("./childhoodFundalPreparation-UM6E5EUU.js")
      .then(async ({ ensureLottie: u }) => {
        if (!(await u())) throw new Error("Lottie unavailable");
        n.aborted ||
          ((i = window.lottie.loadAnimation({
            container: c,
            renderer: "svg",
            loop: !1,
            autoplay: !1,
            path: "/scrolly/coreexam/fundalreflex/exam/5/data.json",
            rendererSettings: {
              preserveAspectRatio: "xMidYMid meet",
              hideOnTransparent: !1,
            },
          })),
          i.addEventListener("complete", () => d.complete()),
          i.addEventListener("DOMLoaded", () => {
            n.aborted || (d.ready(), e.observe(c));
          }),
          i.addEventListener("data_failed", () => {
            n.aborted ||
              t.append(
                P(
                  "p",
                  "reflex_load_error",
                  "The animation could not load. Please reopen this lesson to try again.",
                ),
              );
          }));
      })
      .catch(() => {
        n.aborted ||
          t.append(
            P(
              "p",
              "reflex_load_error",
              "The animation could not load. Please reopen this lesson to try again.",
            ),
          );
      }));
}
var re = "pecWorkshop:restore",
  M = "pecWorkshop:medicalReuse",
  T = "pecWorkshop:externalReuse",
  ie = "pecWorkshop:lesson",
  ce = "pecWorkshop:sequence",
  O = "pecWorkshop:activeEntry",
  U = "pecWorkshop:completedFolders",
  le = "pecWorkshop:procedureVideo",
  ae = Object.freeze({
    pupil_presentation_video: "PupilExaminationPresentation",
    front_presentation_video: "FrontOfEyePresentation",
    fundal_interpretation_video: "FundalReflexInterpretation",
    fundal_demonstration_video: "FundalReflexDemonstration",
    fundal_simulation_video: "FundalReflexSimulation",
    live_fundoscopy_video: "LiveFundoscopy",
    optic_disc_cases_video: "OpticDiscCases",
    cup_to_disc_video: "CupToDiscAssessment",
    optic_disc_appearances_video: "OpticDiscAppearances",
    simulation_stations_video: "/videos/Workshop/Shared/SimulationStations",
    simulation_findings_video: "/videos/Workshop/Shared/SimulationFindings",
    clean_eye: "1.Cleananeye",
    warm_compress: "2.Warmcompress",
    irrigate_eye: "3.Irrigateaneye",
    remove_foreign_body: "4.ForeignBodyRemoval",
    remove_eyelashes: "5.RemoveEyeLash",
    instil_medication: "6.InstileyedropsNointment",
    make_eye_pad: "7.MakepadNshield",
    apply_eye_pad: "8.Applypadandshield",
    visual_acuity_procedure: "9.VisualAcuity",
    assess_near_vision: "10.AssessNearVisionNDispenseGlasses",
    guide_sight_loss: "11.GuideBlindPerson",
  }),
  de = [
    "irrigate_eye",
    "remove_eyelashes",
    "remove_foreign_body",
    "instil_medication",
    "make_eye_pad",
    "apply_eye_pad",
    "visual_acuity_procedure",
    "assess_near_vision",
    "guide_sight_loss",
  ],
  oe = !1,
  se = !1,
  W = [],
  V = null;
function C(t) {
  try {
    return JSON.parse(sessionStorage.getItem(t) || "null");
  } catch {
    return null;
  }
}
function G() {
  document
    .getElementById("glaucomaQuizCaseStudy")
    ?.classList.remove("pec-primary-quiz");
  try {
    sessionStorage.removeItem(O);
  } catch {}
}
function L(t) {
  return `${t?.section || ""}:${t?.nested || ""}`;
}
function ve(t) {
  let r = new Set(C(U) || []);
  r.add(L(t));
  try {
    sessionStorage.setItem(U, JSON.stringify([...r]));
  } catch {}
}
function be(t) {
  let r = new Set(C(U) || []),
    e = (n, a) => {
      if (
        (n.classList.toggle("is-pec-complete", r.has(a)),
        n.querySelector(":scope > .pec-folder-complete")?.remove(),
        !r.has(a))
      )
        return;
      let o = document.createElement("span");
      ((o.className = "pec-folder-complete"),
        (o.textContent = "\u2713"),
        o.setAttribute("aria-label", w("completed")),
        n.insertBefore(o, n.querySelector(":scope > .see-all-toggle")));
    };
  t.querySelectorAll(".pec-folder-row, .pec-nested-folder-row").forEach((n) => {
    let a = n.closest("[data-section]")?.dataset.section,
      o = n.matches(".pec-nested-folder-row")
        ? L({ section: a, nested: n.dataset.nestedFolder })
        : L({ section: n.dataset.folder }),
      s = n.querySelector(".lesson-top");
    (s && e(s, o), n.classList.toggle("is-pec-complete", r.has(o)));
    let i = (
      n.matches(".pec-nested-folder-row")
        ? t.querySelector(`[data-nested-section="${n.dataset.nestedFolder}"]`)
        : t.querySelector(`[data-section="${n.dataset.folder}"]`)
    )?.querySelector(":scope > h3");
    i && e(i, o);
  });
}
async function $() {
  G();
  try {
    (sessionStorage.removeItem(M), sessionStorage.removeItem(T));
  } catch {}
  await A("pecWorkshop", {
    subPageId: "pecWorkshopPage",
    replace: !0,
    recordHistory: !1,
  });
}
function Ee() {
  oe ||
    ((oe = !0),
    document.addEventListener(
      "click",
      (t) => {
        if (
          !(t.target instanceof Element) ||
          !t.target.closest("#backBtnGlobal")
        )
          return;
        let r = ["pecEyeLessonPage", "pecProcedureVideoPage"].some((a) => {
          let o = document.getElementById(a);
          return o && getComputedStyle(o).display !== "none";
        });
        if (document.body.dataset.currentRoute === "pecWorkshop" && r) {
          (t.preventDefault(),
            t.stopPropagation(),
            t.stopImmediatePropagation?.(),
            $());
          return;
        }
        let e;
        try {
          e = JSON.parse(sessionStorage.getItem(T) || "null");
        } catch {
          return;
        }
        if (!e || document.body.dataset.currentRoute !== e.route) return;
        let n = document.getElementById(e.target);
        !n ||
          getComputedStyle(n).display === "none" ||
          (t.preventDefault(),
          t.stopPropagation(),
          t.stopImmediatePropagation?.(),
          $());
      },
      !0,
    ));
}
var Se = Object.freeze({
    pupilsAnterior: [
      {
        label: "pupil_presentation_video",
        video: "pupil_presentation_video",
        type: "video",
      },
      {
        label: "front_presentation_video",
        video: "front_presentation_video",
        type: "video",
      },
      {
        label: "front_of_eye_video",
        target: "feFullAnteriorSegmentPage",
        route: "videos",
        type: "video",
      },
      {
        label: "front_of_eye_guide",
        target: "frontOfEyePdfPage",
        route: "frontOfEyePdf",
        type: "pdf",
      },
      {
        label: "front_of_eye_cases",
        target: "medicalAnteriorSegmentPage",
        type: "interactive",
      },
      {
        label: "pupil_examination_video",
        target: "pupilFullExamPage",
        route: "videos",
        type: "video",
      },
      {
        label: "pupil_examination_guide",
        target: "pupilsPecPdfPage",
        route: "pupilsPecPdf",
        type: "pdf",
      },
      {
        label: "pupils_practice",
        target: "medicalPupilsAnteriorPracticePage",
        type: "scroll",
      },
    ],
    historyTaking: [
      {
        label: "medical_history_taking",
        target: "medicalHistoryTakingPage",
        type: "scroll",
      },
      { label: "eye_history_checklist", lesson: "history", type: "scroll" },
      {
        label: "case_study",
        target: "caseStudyChatPagePrimary",
        route: "casestudy",
        type: "interactive",
        caseStudy: "primary",
      },
      {
        label: "case_study",
        target: "caseStudyChatPage",
        route: "casestudy",
        type: "interactive",
        caseStudy: "intermediate",
      },
    ],
    visualAcuity: [
      {
        label: "visual_acuity_guide",
        target: "visualAcuityPdfPage",
        route: "visualAcuityPdf",
        type: "pdf",
      },
      {
        label: "visual_acuity_practice",
        target: "medicalVisualAcuityPracticePage",
        type: "scroll",
      },
      {
        label: "visual_acuity_animation",
        target: "visualAcuityFullAnimationVideoPage",
        route: "videos",
        type: "video",
      },
      {
        label: "visual_acuity_checklist",
        lesson: "visualAcuity",
        type: "scroll",
      },
    ],
    fundalReflex: [
      {
        label: "fundal_reflex_animation",
        target: "fundalReflexExaminationScrollPage",
        route: "videos",
        type: "scroll",
      },
      {
        label: "fundal_source_guide",
        lesson: "fundalSourceGuide",
        type: "scroll",
      },
      { label: "real_cases", lesson: "realCases", type: "video" },
      {
        label: "fundal_interpretation_test",
        lesson: "fundalInterpretation",
        type: "quiz",
      },
      {
        label: "Test",
        target: "fundalReflexQuizPage",
        route: "fundalReflexQuiz",
        type: "quiz",
      },
      {
        label: "fundal_demonstration_video",
        video: "fundal_demonstration_video",
        type: "video",
      },
      {
        label: "fundal_simulation_video",
        video: "fundal_simulation_video",
        type: "video",
      },
      {
        label: "fundal_reflex_video",
        target: "fundalExamPage",
        route: "videos",
        type: "video",
      },
      {
        label: "fundal_reflex_guide",
        target: "fundalReflexPdfPage",
        route: "fundalReflexPdf",
        type: "pdf",
      },
      {
        label: "fundal_reflex_practice",
        target: "medicalFundalDirectPracticePage",
        type: "scroll",
      },
    ],
    fundoscopy: [
      {
        label: "fundoscopy_video",
        target: "directOphthalmoscopyVideoPage",
        route: "videos",
        type: "video",
      },
      {
        label: "fundoscopy_guide",
        target: "directOphthalmoscopyPdfPage",
        route: "directOphthalmoscopyPdf",
        type: "pdf",
      },
      { label: "fundoscopy_findings", lesson: "fundoscopy", type: "scroll" },
      {
        label: "fundoscopy_practice",
        target: "medicalFundalDirectPracticePage",
        type: "scroll",
      },
      {
        label: "live_fundoscopy_video",
        video: "live_fundoscopy_video",
        type: "video",
      },
      {
        label: "optic_nerve_quiz",
        target: "glaucomaQuizCaseStudy",
        route: "glaucomaQuizCaseStudy",
        type: "quiz",
      },
      { label: "cup_to_disc_video", video: "cup_to_disc_video", type: "video" },
      {
        label: "optic_disc_appearances_video",
        video: "optic_disc_appearances_video",
        type: "video",
      },
      {
        label: "simulation_stations_video",
        video: "simulation_stations_video",
        type: "video",
      },
      {
        label: "simulation_findings_video",
        video: "simulation_findings_video",
        type: "video",
      },
      {
        label: "cataract_identification_video",
        lesson: "cataractIdentification",
        type: "video",
      },
    ],
    lidHygiene: ["clean_eye", "warm_compress"].map((t) => ({
      label: t,
      video: t,
      type: "video",
    })),
    procedures: de.map((t) => ({ label: t, video: t, type: "video" })),
  }),
  ke = Object.freeze({
    objectives: {
      title: "objectives",
      sections: [
        ["objectives", ["objective_one", "objective_two"]],
        [
          "exam_objectives",
          [
            "history",
            "visual_acuity",
            "pupils",
            "front_of_eye",
            "fundal_reflex",
            "fundoscopy",
            "diagnosis_and_action",
          ],
        ],
        [
          "care_procedures",
          [
            "warm_compress",
            "irrigate_eye",
            "remove_eyelashes",
            "remove_foreign_body",
            "instil_medication",
            "make_eye_pad",
            "apply_eye_pad",
            "guide_sight_loss",
          ],
        ],
      ],
    },
    aim: {
      title: "aim",
      sections: [
        [
          "aim_heading",
          ["aim_competent", "aim_see", "aim_engagement", "aim_formula"],
        ],
      ],
    },
    history: {
      title: "eye_history_checklist",
      sections: [
        [
          "history_questions",
          [
            "history_problem",
            "history_when",
            "history_how",
            "history_pain",
            "history_redness",
            "history_vision",
            "history_progress",
            "history_treatment",
            "history_else",
          ],
        ],
      ],
    },
    visualAcuity: {
      title: "visual_acuity_checklist",
      sections: [
        [
          "visual_acuity_practice",
          [
            "acuity_cover",
            "acuity_pinhole",
            "acuity_record",
            "acuity_near",
            "acuity_reading_glasses",
          ],
        ],
      ],
    },
    fundoscopy: {
      title: "fundoscopy_findings",
      sections: [
        [
          "disc_appearances",
          [
            "disc_normal",
            "disc_swollen",
            "disc_pale",
            "disc_cupped",
            "disc_new_vessels",
          ],
        ],
        [
          "fundoscopy_practice",
          ["fundoscopy_each_other", "fundoscopy_simulation"],
        ],
      ],
    },
    realCases: {
      title: "real_cases",
      videos: ["Realcase1", "Realcase2", "Realcase3"],
    },
    fundalSourceGuide: { title: "fundal_source_guide" },
    fundalInterpretation: {
      title: "fundal_interpretation_test",
      videos: ["FundalReflexInterpretationQuestions_220p"],
      trailingVideos: ["FundalReflexInterpretationAnswers_220p"],
      interpretationQuiz: !0,
    },
    cataractIdentification: {
      title: "cataract_identification_video",
      videos: ["/videos/Cataract/Cataract Identification PEC 20MB.mp4"],
    },
  });
function w(t) {
  let r = `pecWorkshop.${t}`,
    e = t.replaceAll("_", " ");
  return window.I18N?.t?.(r, e) || e;
}
function k(t, r) {
  let e = document.createElement(t);
  return ((e.dataset.i18n = `pecWorkshop.${r}`), (e.textContent = w(r)), e);
}
function Pe(t) {
  W = Array.from(
    t.querySelectorAll(
      ".pec-workshop-folders [data-pec-lesson], .pec-workshop-folders [data-medical-target], .pec-workshop-folders [data-pec-route]",
    ),
  ).map((e, n) => {
    e.dataset.pecIndex = String(n);
    let a =
      e.dataset.pecLesson || e.dataset.pecVideo
        ? null
        : e.dataset.pecCaseStudy === "primary"
          ? "caseStudyChatPagePrimary"
          : e.dataset.pecCaseStudy === "intermediate"
            ? "caseStudyChatPage"
            : e.dataset.pecTarget || e.dataset.medicalTarget;
    return (
      a && (e.dataset.primaryProgressTarget = a),
      {
        key: e.dataset.lesson,
        type: /lesson-row--(\w+)/.exec(e.className)?.[1] || "scroll",
        externalTarget: a,
        lesson: e.dataset.pecLesson || null,
        video: e.dataset.pecVideo || null,
        route:
          e.dataset.pecRoute ||
          (e.dataset.medicalTarget ? "medicalStudentsWorkshop" : "pecWorkshop"),
        target:
          e.dataset.pecTarget || e.dataset.medicalTarget || "pecEyeLessonPage",
        caseStudy: e.dataset.pecCaseStudy || null,
        restore: {
          section: e.closest("[data-section]")?.dataset.section || null,
          nested:
            e.closest(".pec-nested-section-card")?.dataset.nestedSection ||
            null,
        },
      }
    );
  });
  try {
    sessionStorage.setItem(ce, JSON.stringify(W));
  } catch {}
}
function K() {
  return W.length ? W : C(ce) || [];
}
function N() {
  let t = C(O),
    r = K();
  if (!t || !r[t.index] || document.body.dataset.currentRoute !== t.route)
    return;
  let e = document.getElementById(t.target);
  if (!e || getComputedStyle(e).display === "none") return;
  (t.target === "glaucomaQuizCaseStudy" && e.classList.add("pec-primary-quiz"),
    t.caseStudy === "primary" && e.classList.add("pec-case-study-primary"));
  let n =
    t.caseStudy === "intermediate"
      ? e.querySelector(".casechat-footer")
      : e.querySelector(".container.pupils-container") ||
        e.querySelector(".container") ||
        e;
  if (!n) return;
  let a = n.querySelector(":scope > .pec-flow-nav");
  if (a?.dataset.pecIndex === String(t.index)) return;
  (a?.remove(), e.classList.add("pec-flow-target"));
  let o = document.createElement("nav");
  ((o.className = "pec-flow-nav"),
    (o.dataset.pecIndex = String(t.index)),
    o.setAttribute("aria-label", w("lesson_navigation")));
  let s = document.createElement("button");
  ((s.type = "button"),
    (s.className = "pec-flow-prev"),
    s.append(document.createTextNode("< "), k("span", "previous")),
    s.addEventListener("click", () => void ne(t.index, -1)));
  let c = document.createElement("button");
  ((c.type = "button"),
    (c.className = "pec-flow-next"),
    c.append(k("span", "next"), document.createTextNode(" >")),
    c.addEventListener("click", () => void ne(t.index, 1)),
    o.append(s, c),
    n.append(o),
    window.I18N?.applyTranslations?.(o));
}
function pe() {
  (se ||
    ((se = !0),
    document.addEventListener("page:shown", (t) => {
      t.detail?.id === "pecWorkshopPage" ? G() : requestAnimationFrame(N);
    }),
    window.addEventListener("page:loaded", (t) => {
      let r = C(O);
      r &&
        t.detail?.routeName !== r.route &&
        t.detail?.routeName !== "pecWorkshop" &&
        G();
    })),
    requestAnimationFrame(N));
}
async function ne(t, r) {
  let e = K(),
    n = e[t],
    a = e[t + r];
  if (a && L(n?.restore) === L(a.restore)) {
    await ue(t + r);
    return;
  }
  (n && r > 0 && ve(n.restore), await $());
}
async function ue(t) {
  let e = K()[t];
  if (!e) {
    await $();
    return;
  }
  j({
    workshop: "pecWorkshop",
    key: e.key,
    route: e.route,
    target: e.target,
    type: e.type,
    externalTarget: e.externalTarget,
  });
  let n = {
    index: t,
    route: e.route,
    target: e.target,
    caseStudy: e.caseStudy,
  };
  try {
    (sessionStorage.setItem(O, JSON.stringify(n)),
      sessionStorage.setItem(re, JSON.stringify(e.restore)),
      sessionStorage.removeItem(M),
      sessionStorage.removeItem(T));
  } catch {}
  if ((pe(), e.video)) {
    try {
      sessionStorage.setItem(le, e.video);
    } catch {}
    (await A("pecWorkshop", { subPageId: "pecProcedureVideoPage" }),
      me(e.video),
      N());
  } else if (e.lesson) {
    try {
      sessionStorage.setItem(ie, e.lesson);
    } catch {}
    (await A("pecWorkshop", { subPageId: "pecEyeLessonPage" }),
      fe(e.lesson),
      N());
  } else if (e.route === "medicalStudentsWorkshop") {
    try {
      sessionStorage.setItem(
        M,
        JSON.stringify({ ...e.restore, target: e.target }),
      );
    } catch {}
    (await A(e.route, { subPageId: e.target }),
      document
        .getElementById(e.target)
        ?.classList.add("pec-reused-medical-page"),
      N());
  } else {
    try {
      sessionStorage.setItem(
        T,
        JSON.stringify({ route: e.route, target: e.target }),
      );
    } catch {}
    if (e.caseStudy) {
      if (
        (await A("casestudy", { subPageId: "casestudyPage" }),
        e.caseStudy === "primary")
      ) {
        let { initializeCaseStudyPrimary: a } =
          await import("./casestudy_primary-R6M6MAH3.js");
        a();
      } else {
        let { initializeCaseStudy: a } =
          await import("./casestudy-C2EPXCSL.js");
        a();
      }
      (await new Promise((a) => requestAnimationFrame(a)),
        document
          .getElementById(
            e.caseStudy === "primary"
              ? "caseStudyPrimaryCard"
              : "caseStudyIntermediateCard",
          )
          ?.click());
    } else await A(e.route, { subPageId: e.target });
    N();
  }
  (window.scrollTo(0, 0), J());
}
function xe(t) {
  Object.entries(Se).forEach(([r, e]) => {
    let n = t.querySelector(`[data-nested-section="${r}"]`);
    n &&
      e.forEach((a) => {
        let o = document.createElement("div");
        ((o.className = `lesson-row lesson-row--${a.type}`),
          (o.dataset.lesson = `pec-${a.label.replaceAll("_", "-")}`),
          a.video
            ? ((o.dataset.pecVideo = a.video),
              (o.dataset.pecRoute = "pecWorkshop"),
              (o.dataset.pecTarget = "pecProcedureVideoPage"))
            : a.lesson
              ? (o.dataset.pecLesson = a.lesson)
              : a.route
                ? ((o.dataset.pecRoute = a.route),
                  (o.dataset.pecTarget = a.target),
                  a.caseStudy && (o.dataset.pecCaseStudy = a.caseStudy))
                : (o.dataset.medicalTarget = a.target),
          o.setAttribute("role", "button"),
          (o.tabIndex = 0));
        let s = document.createElement("div");
        ((s.className = "thumb"), s.setAttribute("aria-hidden", "true"));
        let c = document.createElement("div");
        c.className = "lesson-main";
        let i = document.createElement("div");
        i.className = "lesson-top";
        let d = k("span", a.label);
        ((d.className = "lesson-type"),
          a.caseStudy && i.append(k("span", a.caseStudy)),
          i.append(d),
          a.caseStudy &&
            ((i.firstElementChild.className = "pec-case-study-level"),
            i.classList.add("pec-case-study-label"),
            (o.dataset.pecCaseStudy = a.caseStudy)),
          c.append(i));
        let l = k("span", a.type === "video" ? "watch" : "start");
        ((l.className = "lesson-cta"), o.append(s, c, l), n.append(o));
      });
  });
}
function me(t, r = "pecProcedureVideoPage") {
  let e = ae[t],
    n = document.getElementById(r),
    a = n?.querySelector(".pec-procedure-video"),
    o = a?.querySelector("source"),
    s = n?.querySelector(".tri-toggle");
  if (!e || !n || !a || !o || !s) return;
  ((n.dataset.pecRenderedVideo = t),
    ["clean_eye", "warm_compress", ...de].includes(t)
      ? (n.dataset.pecProcedureLayout = "landscape")
      : delete n.dataset.pecProcedureLayout);
  let c = n.querySelector(".pec-procedure-video-title");
  c &&
    ((c.dataset.i18n = `pecWorkshop.${t}`),
    (c.textContent = w(t)),
    window.I18N?.applyTranslations?.(c));
  let i = (d, l = !0) => {
    if (d !== "low" && d !== "high") return;
    let u = ae[n.dataset.pecRenderedVideo],
      p = `${u.startsWith("/") ? u : `/videos/Workshop/PEC/${u}`}_${d === "low" ? "220p" : "720p"}.mp4`,
      f = (l && a.currentTime) || 0,
      v = l && !a.paused;
    ((s.dataset.active = d),
      s.style.setProperty("--tri-cols", "2"),
      s.querySelectorAll(".tri-toggle__btn").forEach((h) => {
        h.setAttribute("aria-checked", String(h.dataset.mode === d));
      }),
      o.getAttribute("src") !== p &&
        ((o.src = p),
        a.load(),
        f > 0 &&
          a.addEventListener(
            "loadedmetadata",
            () => {
              ((a.currentTime = Math.min(f, a.duration || f)),
                v && a.play().catch(() => {}));
            },
            { once: !0 },
          )));
  };
  (s.dataset.pecWired !== "1" &&
    ((s.dataset.pecWired = "1"),
    s.addEventListener("click", (d) => {
      let l = d.target.closest(".tri-toggle__btn");
      l && i(l.dataset.mode);
    })),
    i("low", !1));
}
function fe(t) {
  let r = ke[t],
    e = document.getElementById("pecEyeLessonPage"),
    n = e?.querySelector(".pec-eye-lesson-content");
  if (!r || !n) return !1;
  (V?.(), (V = null), n.replaceChildren());
  let a = document.createElement("section");
  ((a.className =
    "diabetic-screening-lesson diabetic-screening-lesson--tight-hero pec-scroll-lesson"),
    (a.dataset.diabeticScrollLesson = ""));
  let o = document.createElement("div");
  ((o.className = "diabetic-screening-scroll-cue"),
    (o.dataset.diabeticScrollCue = ""),
    o.setAttribute("aria-hidden", "true"),
    a.append(o));
  let s = document.createElement("header");
  ((s.className = "diabetic-screening-hero"),
    (s.dataset.diabeticScrollStep = ""));
  let c = k("p", "title");
  ((c.className = "diabetic-screening-eyebrow"),
    s.append(c, k("h2", r.title)),
    a.append(s));
  let i = document.createElement("div");
  if (
    ((i.className = "diabetic-screening-stack"),
    (r.sections || []).forEach(([l, u], g) => {
      let p = document.createElement("article");
      ((p.className = "diabetic-screening-panel"),
        (p.dataset.diabeticScrollStep = ""));
      let f = document.createElement("div");
      f.className = "diabetic-screening-panel__text";
      let v = document.createElement("span");
      ((v.className = "diabetic-screening-step"),
        (v.textContent = String(g + 1).padStart(2, "0")),
        f.append(v, k("h3", l)),
        p.append(f));
      let h = document.createElement("ul");
      ((h.className = "medical-overview-list"),
        u.forEach((b) => {
          let m = document.createElement("li");
          (m.append(k("span", b)), h.append(m));
        }),
        p.append(h),
        i.append(p));
    }),
    t === "aim" || t === "visualAcuity")
  ) {
    let l = document.createElement("article");
    ((l.className = "diabetic-screening-panel"),
      (l.dataset.diabeticScrollStep = ""));
    let u = document.createElement("div");
    ((u.className = "medical-workshop-arc"),
      (t === "aim"
        ? ["aim_competent", "aim_see", "aim_engagement", "aim_formula"]
        : ["acuity_cover", "acuity_pinhole", "acuity_record"]
      ).forEach((p) => {
        let f = k("span", p);
        ((f.className = "medical-workshop-arc__stage"), u.append(f));
      }),
      l.append(u),
      i.append(l));
  }
  let d = (l, u) => {
    let g = document.createElement("article");
    ((g.className = "diabetic-screening-panel pec-real-case-panel"),
      (g.dataset.diabeticScrollStep = ""));
    let p = document.createElement("video");
    ((p.className = "medical-learning-video"),
      (p.controls = !0),
      (p.playsInline = !0),
      (p.preload = "metadata"),
      p.setAttribute("aria-label", `${w("real_cases")} ${u + 1}`));
    let f = document.createElement("source");
    ((f.src = l.startsWith("/") ? l : `/videos/Workshop/PEC/${l}.mp4`),
      (f.type = "video/mp4"),
      p.append(f),
      g.append(p),
      i.append(g));
  };
  return (
    (r.videos || []).forEach(d),
    Q(i, r.images || [], w),
    r.interpretationQuiz && Z(i, w),
    (r.trailingVideos || []).forEach(d),
    a.append(i),
    n.append(a),
    t === "fundalSourceGuide" && (V = te(i)),
    (e.dataset.pecRenderedLesson = t),
    window.I18N?.applyTranslations?.(e),
    Y(),
    !0
  );
}
function H(t, r) {
  (t.addEventListener("click", r),
    t.addEventListener("keydown", (e) => {
      (e.key !== "Enter" && e.key !== " ") || (e.preventDefault(), r(e));
    }));
}
function $e() {
  let t = document.getElementById("pecWorkshopPage");
  if (!t) return;
  if (t.dataset.inited === "1") {
    z("pecWorkshop");
    return;
  }
  ((t.dataset.inited = "1"), Ee(), xe(t), Pe(t), be(t), pe());
  try {
    let o = sessionStorage.getItem(ie);
    o &&
      document.getElementById("pecEyeLessonPage")?.dataset.pecRenderedLesson !==
        o &&
      fe(o);
    let s = sessionStorage.getItem(le);
    s &&
      document.getElementById("pecProcedureVideoPage")?.dataset
        .pecRenderedVideo !== s &&
      me(s);
  } catch {}
  (t.querySelectorAll(".menuBtn").forEach((o) => {
    (o.addEventListener("click", D),
      o.addEventListener("keydown", (s) => {
        (s.key !== "Enter" && s.key !== " ") || (s.preventDefault(), o.click());
      }));
  }),
    document
      .getElementById("pecEyeLessonPage")
      ?.querySelectorAll(".menuBtn")
      .forEach((o) => {
        (o.addEventListener("click", D),
          o.addEventListener("keydown", (s) => {
            (s.key !== "Enter" && s.key !== " ") ||
              (s.preventDefault(), o.click());
          }));
      }));
  let r = Array.from(t.querySelectorAll(".pec-folder-row")),
    e = Array.from(t.querySelectorAll(".pec-section-card")),
    n = (o) => {
      (o.querySelectorAll(".pec-nested-section-card").forEach((s) => {
        s.hidden = !0;
      }),
        o.querySelectorAll(".pec-nested-folder-row").forEach((s) => {
          ((s.hidden = !1), s.setAttribute("aria-expanded", "false"));
        }),
        o.classList.remove("pec-nested-folder-open"));
    },
    a = () => {
      (e.forEach((o) => {
        (n(o), (o.hidden = !0));
      }),
        r.forEach((o) => {
          ((o.hidden = !1), o.setAttribute("aria-expanded", "false"));
        }),
        t.classList.remove("pec-folder-open"));
    };
  (r.forEach((o) => {
    H(o, () => {
      let s = e.find((c) => c.dataset.section === o.dataset.folder);
      s &&
        (a(),
        (o.hidden = !0),
        o.setAttribute("aria-expanded", "true"),
        o.insertAdjacentElement("afterend", s),
        (s.hidden = !1),
        t.classList.add("pec-folder-open"));
    });
  }),
    e.forEach((o) => {
      (o.querySelector("[data-close-section]")?.addEventListener("click", a),
        o.querySelectorAll(".pec-nested-folder-row").forEach((s) => {
          H(s, () => {
            let c = Array.from(
              o.querySelectorAll(".pec-nested-section-card"),
            ).find((i) => i.dataset.nestedSection === s.dataset.nestedFolder);
            c &&
              (n(o),
              (s.hidden = !0),
              s.setAttribute("aria-expanded", "true"),
              s.insertAdjacentElement("afterend", c),
              (c.hidden = !1),
              o.classList.add("pec-nested-folder-open"));
          });
        }),
        o.querySelectorAll("[data-close-nested]").forEach((s) => {
          s.addEventListener("click", () => n(o));
        }));
    }),
    t
      .querySelectorAll(
        "[data-pec-lesson], [data-medical-target], [data-pec-route]",
      )
      .forEach((o) => {
        H(o, () => void ue(Number(o.dataset.pecIndex)));
      }));
  try {
    let o = JSON.parse(sessionStorage.getItem(re) || "null");
    o?.section &&
      (t.querySelector(`[data-folder="${o.section}"]`)?.click(),
      o.nested &&
        t.querySelector(`[data-nested-folder="${o.nested}"]`)?.click());
  } catch {}
  z("pecWorkshop");
}
export { pe as a, me as b, $e as c };
