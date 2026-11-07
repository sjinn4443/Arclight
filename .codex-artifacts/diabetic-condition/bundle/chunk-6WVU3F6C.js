import { b as ze } from "./chunk-KOQD3NIP.js";
import { a as me, b as Me, c as qe } from "./chunk-724JZPMA.js";
import { s as Pe } from "./chunk-C3DWFWW5.js";
import { d as De } from "./chunk-BGCC32GM.js";
var xe = "diabeticWorkshop:openFolderKey",
  Ee = "diabeticWorkshop:restoreOpenFolder",
  Re = "diabeticWorkshop:focusSelector";
function $(e, o = e) {
  return De(e, o);
}
var Le = Object.freeze([
    {
      id: "case1",
      label: "Cataract",
      imageSrc: "/images/casestudy/case1_eyes.webp",
      historyLines: ["Slow vision loss over months", "No pain, only shadows"],
      answerLines: [
        "Vision worsened slowly without pain.",
        "No red eye or discharge suggests cataract.",
      ],
    },
    {
      id: "case2",
      label: "Retinoblastoma",
      imageSrc: "/images/casestudy/case2_eyes.webp",
      historyLines: ["White pupil in a baby", "Poor visual attention"],
      answerLines: [
        "A white pupil in a baby is a danger sign.",
        "Poor visual attention supports retinoblastoma.",
      ],
    },
    {
      id: "case3",
      label: "Gonococcal/Chlamydial conjunctivitis",
      imageSrc: "/images/casestudy/case3_eyes.webp",
      historyLines: [
        "Pink sticky eyes, yellow discharge",
        "Started in one eye, then both",
      ],
      answerLines: [
        "Thick yellow discharge suggests bacterial conjunctivitis.",
        "This pattern fits gonococcal/chlamydial infection.",
      ],
    },
    {
      id: "case4",
      label: "Trachomatous trichiasis with corneal scarring",
      imageSrc: "/images/casestudy/case4_eyes.webp",
      historyLines: [
        "Long gritty painful eyes",
        "Blur + chronic surface damage",
      ],
      answerLines: [
        "Long gritty pain suggests chronic surface damage.",
        "This pattern fits trichiasis with corneal scarring.",
      ],
    },
    {
      id: "case5",
      label: "Bacterial / fungal corneal ulcer",
      imageSrc: "/images/casestudy/case5_eyes.webp",
      historyLines: [
        "Bush scratch before pain",
        "Sticky red eye, only shadows",
      ],
      answerLines: [
        "Severe pain after bush trauma suggests corneal ulcer.",
        "Discharge and very poor vision support infection.",
      ],
    },
    {
      id: "case6",
      label: "Herpes simplex keratitis",
      imageSrc: "/images/casestudy/case6_eyes.webp",
      historyLines: ["Painful photophobic red eye", "Recent lip sores"],
      answerLines: [
        "One painful light-sensitive eye suggests keratitis.",
        "Recent lip sores support herpes simplex keratitis.",
      ],
    },
    {
      id: "case7",
      label: "Anterior Uveitis",
      imageSrc: "/images/casestudy/case7_eyes.webp",
      historyLines: [
        "One painful photophobic eye",
        "Blur, similar episodes before",
      ],
      answerLines: [
        "Photophobia and pain suggest uveitis.",
        "Repeated similar episodes support anterior uveitis.",
      ],
    },
    {
      id: "case8",
      label: "Pterygium",
      imageSrc: "/images/casestudy/case8_eyes.webp",
      historyLines: ["Slow pink growth on eye", "Outdoor UV exposure"],
      answerLines: [
        "A slow-growing pink patch suggests pterygium.",
        "Long outdoor work makes this diagnosis likely.",
      ],
    },
    {
      id: "case9",
      label: "Corneal foreign body with early infection",
      imageSrc: "/images/casestudy/case9_eyes.webp",
      historyLines: [
        "Metal work before symptoms",
        "Photophobia, blur, infection",
      ],
      answerLines: [
        "Metal work suggests a corneal foreign body.",
        "Blur and photophobia suggest early infection.",
      ],
    },
    {
      id: "case10",
      label: "Traumatic hyphaema",
      imageSrc: "/images/casestudy/case10_eyes.webp",
      historyLines: ["Blunt trauma, sudden blur", "Red eye, shadow vision"],
      answerLines: [
        "Sudden blur after blunt trauma suggests hyphaema.",
        "Painful red watering eye supports the diagnosis.",
      ],
    },
    {
      id: "case11",
      label: "Penetrating corneal laceration with iris prolapse",
      imageSrc: "/images/casestudy/case11_eyes.webp",
      historyLines: [
        "Stick injury, worsening pain",
        "Open globe / iris prolapse",
      ],
      answerLines: [
        "Stick injury with worsening blur suggests open globe.",
        "This pattern fits corneal laceration with iris prolapse.",
      ],
    },
    {
      id: "case12",
      label: "Penetrating injury causing traumatic cataract",
      imageSrc: "/images/casestudy/case12_eyes.webp",
      historyLines: [
        "Recent stick injury",
        "Painful red eye, fast vision loss",
      ],
      answerLines: [
        "Severe vision loss after stick trauma suggests penetration.",
        "Painful red eye with fast decline supports traumatic cataract.",
      ],
    },
  ]),
  ve = new Map(Le.map((e) => [e.id, e])),
  Ye = 4,
  ce = Object.freeze([
    {
      id: "optic-disc",
      label: "Optic Disc",
      tip: "The optic disc is the bright circular area where the vessels meet.",
      explanation:
        "The optic disc is the pale nerve head on the nasal side of the retina.",
      target: { cx: 0.286, cy: 0.441, rx: 0.104, ry: 0.122 },
    },
    {
      id: "fovea",
      label: "Fovea",
      tip: "The fovea is the darker spot temporal to the optic disc.",
      explanation:
        "The fovea is the small dark central pit temporal to the optic disc.",
      target: { cx: 0.884, cy: 0.482, rx: 0.075, ry: 0.075 },
    },
    {
      id: "nasal-retina",
      label: "Nasal Retina",
      tip: "Nasal retina sits on the same side as the optic disc.",
      explanation:
        "The nasal retina is the retinal area on the optic-disc side of the fundus.",
      target: { cx: 0.109, cy: 0.63, rx: 0.15, ry: 0.2 },
    },
    {
      id: "superior-temporal-vessels",
      label: "Superior Temporal Vessels",
      tip: "Follow the upper vascular arcade running temporally from the disc.",
      explanation:
        "The superior temporal vessels form the upper arcade curving away from the disc.",
      target: { cx: 0.515, cy: 0.145, rx: 0.205, ry: 0.095 },
    },
    {
      id: "inferior-temporal-vessels",
      label: "Inferior Temporal Vessels",
      tip: "Follow the lower vascular arcade running temporally from the disc.",
      explanation:
        "The inferior temporal vessels form the lower arcade curving away from the disc.",
      target: { cx: 0.64, cy: 0.79, rx: 0.25, ry: 0.11 },
    },
  ]),
  Xe = 2834,
  Ge = 5,
  Ue = 8,
  Ze = 80,
  je = 3,
  Ne = 1,
  Ke = 38,
  Je = 96,
  et = 42,
  Se = Object.freeze([
    {
      id: "case-1",
      image: "1.png",
      disc: "Ldisc",
      patientInfo: [
        "Age: 47",
        "Diabetes: 16 years",
        "Loss of Vision: No",
        "VA: 6/6",
      ],
      questions: [
        {
          type: "multi",
          label: "Signs",
          prompt: "Select the signs seen in this case.",
          correct: ["New Vessels at Disc (NVD)", "Dot & Blot Haemorrhage"],
          options: [
            "New Vessels at Disc (NVD)",
            "Dot & Blot Haemorrhage",
            "Mild hard exudate not involving fovea",
            "No new vessels",
          ],
        },
        {
          type: "single",
          label: "Diagnosis",
          prompt: "Select the best diagnosis.",
          correct: ["Proliferative Diabetic Retinopathy (PDR)"],
          options: [
            "Proliferative Diabetic Retinopathy (PDR)",
            "Pre-retinal haemorrhage, presumably PDR",
            "Maculopathy \u2013 sight threatening",
            "Maculopathy - not sight threatening",
          ],
        },
        {
          type: "single",
          label: "Outcome",
          prompt: "Select the correct outcome.",
          correct: ["Refer"],
          options: [
            "Refer",
            "Routine review",
            "Repeat routine screening",
            "Reassure",
          ],
        },
      ],
    },
    {
      id: "case-2",
      image: "2.png",
      disc: "Rdisc",
      patientInfo: [
        "Age: 52",
        "Diabetes: 11 years",
        "Loss of Vision: No",
        "VA: 6/6",
      ],
      questions: [
        {
          type: "multi",
          label: "Signs",
          prompt: "Select the signs seen in this case.",
          correct: ["New vessels at disc and elsewhere (NVD & NVE)"],
          options: [
            "New vessels at disc and elsewhere (NVD & NVE)",
            "Dark red patch on retina inferiorly",
            "Microaneurysms",
            "Mild hard exudate not involving fovea",
          ],
        },
        {
          type: "single",
          label: "Diagnosis",
          prompt: "Select the best diagnosis.",
          correct: ["Proliferative Diabetic Retinopathy (PDR)"],
          options: [
            "Proliferative Diabetic Retinopathy (PDR)",
            "Viterous Haemorrhage, Presumably PDR",
            "Maculopathy \u2013 sight threatening",
            "Maculopathy - not sight threatening",
          ],
        },
        {
          type: "single",
          label: "Outcome",
          prompt: "Select the correct outcome.",
          correct: ["Refer"],
          options: [
            "Refer",
            "Routine review",
            "Repeat routine screening",
            "Reassure",
          ],
        },
      ],
    },
    {
      id: "case-3",
      image: "3.png",
      disc: "Rdisc",
      patientInfo: [
        "Age: 31",
        "Diabetes: 17 years",
        "Loss of Vision: No",
        "VA: 6/6",
      ],
      questions: [
        {
          type: "multi",
          label: "Signs",
          prompt: "Select the signs seen in this case.",
          correct: [
            "New vessels at disc and elsewhere",
            "Mild hard exudate close to fovea",
          ],
          options: [
            "New vessels at disc and elsewhere",
            "Mild hard exudate close to fovea",
            "Dark red patches on retina",
            "No new vessels",
          ],
        },
        {
          type: "single",
          label: "Diagnosis",
          prompt: "Select the best diagnosis.",
          correct: ["Proliferative Diabetic Retinopathy (PDR)"],
          options: [
            "Proliferative Diabetic Retinopathy (PDR)",
            "Pre-retinal haemorrhage, presumably PDR",
            "Maculopathy \u2013 sight threatening",
            "Maculopathy - not sight threatening",
          ],
        },
        {
          type: "single",
          label: "Outcome",
          prompt: "Select the correct outcome.",
          correct: ["Refer"],
          options: [
            "Refer",
            "Routine review",
            "Repeat routine screening",
            "Reassure",
          ],
        },
      ],
    },
    {
      id: "case-4",
      image: "4.png",
      disc: "Ldisc",
      patientInfo: [
        "Age: 41",
        "Diabetes: 13 years",
        "Loss of Vision: No",
        "VA: 6/6",
      ],
      questions: [
        {
          type: "multi",
          label: "Signs",
          prompt: "Select the signs seen in this case.",
          correct: [
            "New vessels at disc and elsewhere",
            "Small area of vitreous haemorrhage",
            "Tortuous dilated veins",
          ],
          options: [
            "New vessels at disc and elsewhere",
            "Small area of vitreous haemorrhage",
            "Tortuous dilated veins",
            "Hard exudates close to fovea",
          ],
        },
        {
          type: "single",
          label: "Diagnosis",
          prompt: "Select the best diagnosis.",
          correct: ["Proliferative Diabetic Retinopathy (PDR)"],
          options: [
            "Proliferative Diabetic Retinopathy (PDR)",
            "Viterous Haemorrhage, Presumably PDR",
            "Maculopathy \u2013 sight threatening",
            "Maculopathy - not sight threatening",
          ],
        },
        {
          type: "single",
          label: "Outcome",
          prompt: "Select the correct outcome.",
          correct: ["Refer"],
          options: [
            "Refer",
            "Routine review",
            "Repeat routine screening",
            "Reassure",
          ],
        },
      ],
    },
    {
      id: "case-5",
      image: "5.png",
      disc: "Ldisc",
      patientInfo: [
        "Age: 57",
        "Diabetes: 12 years",
        "Loss of Vision: Sudden painless peripheral visual disturbance",
        "VA: 6/6",
      ],
      questions: [
        {
          type: "multi",
          label: "Signs",
          prompt: "Select the signs seen in this case.",
          correct: ["Dark red patch on retina inferiorly"],
          options: [
            "Dark red patch on retina inferiorly",
            "Dot & Blot Haemorrhage",
            "Mild hard exudate close to fovea",
            "Tortuous dilated veins",
          ],
        },
        {
          type: "single",
          label: "Diagnosis",
          prompt: "Select the best diagnosis.",
          correct: ["Pre-retinal haemorrhage, presumably PDR"],
          options: [
            "Pre-retinal haemorrhage, presumably PDR",
            "Proliferative Diabetic Retinopathy (PDR)",
            "Viterous Haemorrhage, Presumably PDR",
            "Maculopathy \u2013 sight threatening",
          ],
        },
        {
          type: "single",
          label: "Outcome",
          prompt: "Select the correct outcome.",
          correct: ["Refer"],
          options: [
            "Refer",
            "Routine review",
            "Repeat routine screening",
            "Reassure",
          ],
        },
      ],
    },
    {
      id: "case-6",
      image: "6.png",
      disc: "Rdisc",
      patientInfo: [
        "Age: 43",
        "Diabetes: 15 years",
        "Loss of Vision: Sudden painless patches of vision missing",
        "VA: 6/6",
      ],
      questions: [
        {
          type: "multi",
          label: "Signs",
          prompt: "Select the signs seen in this case.",
          correct: ["Dark red patches on retina"],
          options: [
            "Dark red patches on retina",
            "Dark red patch on retina inferiorly",
            "Hard exudates close to fovea",
            "New Vessels at Disc (NVD)",
          ],
        },
        {
          type: "single",
          label: "Diagnosis",
          prompt: "Select the best diagnosis.",
          correct: ["Pre-retinal haemorrhage, presumably PDR"],
          options: [
            "Pre-retinal haemorrhage, presumably PDR",
            "Proliferative Diabetic Retinopathy (PDR)",
            "Maculopathy - not sight threatening",
            "Viterous Haemorrhage, Presumably PDR",
          ],
        },
        {
          type: "single",
          label: "Outcome",
          prompt: "Select the correct outcome.",
          correct: ["Refer"],
          options: [
            "Refer",
            "Routine review",
            "Repeat routine screening",
            "Reassure",
          ],
        },
      ],
    },
    {
      id: "case-7",
      image: "7.png",
      disc: "Rdisc",
      patientInfo: [
        "Age: 38",
        "Diabetes: 20 years",
        "Loss of Vision: Yes sudden painless",
        "VA: PL",
      ],
      questions: [
        {
          type: "multi",
          label: "Signs",
          prompt: "Select the signs seen in this case.",
          correct: ["Loss of fundal reflex. No retinal detail seen."],
          options: [
            "Loss of fundal reflex. No retinal detail seen.",
            "No new vessels",
            "Microaneurysms",
            "Mild hard exudate not involving fovea",
          ],
        },
        {
          type: "single",
          label: "Diagnosis",
          prompt: "Select the best diagnosis.",
          correct: ["Viterous Haemorrhage, Presumably PDR"],
          options: [
            "Viterous Haemorrhage, Presumably PDR",
            "Pre-retinal haemorrhage, presumably PDR",
            "Proliferative Diabetic Retinopathy (PDR)",
            "Maculopathy \u2013 sight threatening",
          ],
        },
        {
          type: "single",
          label: "Outcome",
          prompt: "Select the correct outcome.",
          correct: ["Refer"],
          options: [
            "Refer",
            "Routine review",
            "Repeat routine screening",
            "Reassure",
          ],
        },
      ],
    },
    {
      id: "case-8",
      image: "8.png",
      disc: "Rdisc",
      patientInfo: [
        "Age: 44",
        "Diabetes: 8 years",
        "Loss of Vision: No",
        "VA: 6/6",
      ],
      questions: [
        {
          type: "multi",
          label: "Signs",
          prompt: "Select the signs seen in this case.",
          correct: ["Mild hard exudate not involving fovea"],
          options: [
            "Mild hard exudate not involving fovea",
            "Mild hard exudate close to fovea",
            "New vessels at disc and elsewhere",
            "Dot & Blot Haemorrhage",
          ],
        },
        {
          type: "single",
          label: "Diagnosis",
          prompt: "Select the best diagnosis.",
          correct: ["Maculopathy - not sight threatening"],
          options: [
            "Maculopathy - not sight threatening",
            "Maculopathy \u2013 sight threatening",
            "Proliferative Diabetic Retinopathy (PDR)",
            "Pre-retinal haemorrhage, presumably PDR",
          ],
        },
        {
          type: "single",
          label: "Outcome",
          prompt: "Select the correct outcome.",
          correct: ["Routine review"],
          options: [
            "Routine review",
            "Refer",
            "Repeat routine screening",
            "Reassure",
          ],
        },
      ],
    },
    {
      id: "case-9",
      image: "9.png",
      disc: "Ldisc",
      patientInfo: [
        "Age: 54",
        "Diabetes: 20 years",
        "Loss of Vision: Yes, painless and gradual over 1 year",
        "VA: 6/36",
      ],
      questions: [
        {
          type: "multi",
          label: "Signs",
          prompt: "Select the signs seen in this case.",
          correct: [
            "Microaneurysms",
            "Dot-blot haemorrhages",
            "Hard exudates close to fovea",
            "No new vessels",
          ],
          options: [
            "Microaneurysms",
            "Dot-blot haemorrhages",
            "Hard exudates close to fovea",
            "No new vessels",
          ],
        },
        {
          type: "single",
          label: "Diagnosis",
          prompt: "Select the best diagnosis.",
          correct: ["Maculopathy \u2013 sight threatening"],
          options: [
            "Maculopathy \u2013 sight threatening",
            "Maculopathy - not sight threatening",
            "Proliferative Diabetic Retinopathy (PDR)",
            "Viterous Haemorrhage, Presumably PDR",
          ],
        },
        {
          type: "single",
          label: "Outcome",
          prompt: "Select the correct outcome.",
          correct: ["Refer"],
          options: [
            "Refer",
            "Routine review",
            "Repeat routine screening",
            "Reassure",
          ],
        },
      ],
    },
  ]),
  Te = Object.freeze([
    "Margin",
    "Neuro-retinal rim",
    "Fovea",
    "Cup",
    "Blood vessels (veins and arteries)",
  ]),
  le = Object.freeze([
    {
      id: "main-parts",
      pauseAt: 13,
      question:
        "Which of the following is NOT a main part of the optic nerve head?",
      options: Te,
      correctIndex: 2,
      explanation: "Fovea belongs to the macula, not to the optic nerve head.",
    },
    {
      id: "highlighted-margin",
      pauseAt: 18,
      question: "What is the name of the highlighted area?",
      options: Te,
      correctIndex: 0,
      explanation: "The highlighted edge of the optic disc is the margin.",
    },
  ]),
  fe = Object.freeze([
    {
      id: "patient-a-va",
      label: "Visual acuity: perception of light",
      zone: "patient-a",
    },
    { id: "patient-a-white-pupil", label: "White pupil", zone: "patient-a" },
    {
      id: "patient-a-white-conjunctiva",
      label: "White conjunctiva",
      zone: "patient-a",
    },
    { id: "patient-a-clear-cornea", label: "Clear cornea", zone: "patient-a" },
    { id: "patient-b-va", label: "Visual acuity: 6/9", zone: "patient-b" },
    { id: "patient-b-photophobia", label: "Photophobia", zone: "patient-b" },
    { id: "patient-b-watery", label: "Watery", zone: "patient-b" },
    {
      id: "patient-b-pink-conjunctiva",
      label: "Pink conjunctiva",
      zone: "patient-b",
    },
    {
      id: "patient-b-white-spots",
      label: "White spots on inner cornea",
      zone: "patient-b",
    },
  ]),
  he = Object.freeze([
    {
      id: "mature-cataract",
      diagnosisId: "diag-mature-cataract",
      diagnosis: "Mature Cataract",
      findings: [
        { id: "finding-all-vision", label: "Painless loss of all vision" },
        { id: "finding-white-pupil", label: "White Pupil" },
        { id: "finding-loss-red-reflex", label: "Loss of fundal reflex" },
      ],
      tone: "violet",
    },
    {
      id: "primary-open-glaucoma",
      diagnosisId: "diag-primary-open-glaucoma",
      diagnosis: "Primary Open Glaucoma",
      findings: [
        {
          id: "finding-peripheral-vision",
          label: "Painless loss of peripheral vision",
        },
        { id: "finding-cupped-disc", label: "Cupped Optic Disc" },
        { id: "finding-rim-thinning", label: "Neuroretinal rim thinning" },
      ],
      tone: "gold",
    },
    {
      id: "diabetic-maculopathy",
      diagnosisId: "diag-diabetic-maculopathy",
      diagnosis: "Diabetic Maculopathy",
      findings: [
        {
          id: "finding-central-vision",
          label: "Painless loss of central vision",
        },
        { id: "finding-hard-exudate", label: "Hard Exudate at macula" },
        { id: "finding-microaneurysms", label: "Microaneurysms near macula" },
      ],
      tone: "teal",
    },
  ]),
  _e = Object.freeze(
    he.flatMap((e) =>
      e.findings.map((o) => ({
        ...o,
        diagnosisId: e.diagnosisId,
        tone: e.tone,
      })),
    ),
  ),
  Oe = new Map(_e.map((e) => [e.id, e]));
function ke(e) {
  let o = [...e];
  for (let r = o.length - 1; r > 0; r -= 1) {
    let a = Math.floor(Math.random() * (r + 1));
    [o[r], o[a]] = [o[a], o[r]];
  }
  return o;
}
function tt(e, o) {
  let r = [];
  for (let a = 0; a < e.length; a += o) r.push(e.slice(a, a + o));
  return r;
}
function ge(e, o = 0, r = 1) {
  return Math.min(r, Math.max(o, e));
}
function ae(e, o, r) {
  return r <= o ? (e >= r ? 1 : 0) : ge((e - o) / (r - o));
}
function He(e, o, r, a, p) {
  return ae(e, o, r) * (1 - ae(e, a, p));
}
function Be(e) {
  let o = e?.parentElement ?? null;
  for (; o && o !== document.body; ) {
    let r = window.getComputedStyle(o),
      a = r.overflowY || r.overflow;
    if (/(auto|scroll|overlay)/.test(a)) return o;
    o = o.parentElement;
  }
  return window;
}
function $e(e) {
  if (e === window)
    return {
      top: 0,
      height: window.innerHeight || document.documentElement.clientHeight || 1,
    };
  let o = e.getBoundingClientRect();
  return { top: o.top, height: e.clientHeight || o.height || 1 };
}
function be(e) {
  return Number.isFinite(e) ? e.toFixed(4) : "0";
}
function Ie(e, { opacity: o = 0, x: r = 0, y: a = 0, scale: p = 1 } = {}) {
  if (!e) return;
  let n = o > 0.001;
  (e.style.setProperty("--opacity", be(ge(o))),
    e.style.setProperty("--x", `${be(r)}px`),
    e.style.setProperty("--y", `${be(a)}px`),
    e.style.setProperty("--scale", be(p)),
    (e.style.visibility = n ? "visible" : "hidden"));
}
function Ce(e, { opacity: o = 0, x: r = 0, y: a = 0 } = {}) {
  if (!e) return;
  let p = o > 0.001;
  (e.style.setProperty("--opacity", be(ge(o))),
    e.style.setProperty("--x", `${be(r)}px`),
    e.style.setProperty("--y", `${be(a)}px`),
    (e.style.visibility = p ? "visible" : "hidden"));
}
function Fe(e, o) {
  let r = ge(o),
    a = ae(o, -0.006, 0.012),
    p = 1 - ae(r, 0.045, 0.075),
    n = a * p,
    y = 1,
    N = ae(r, 0.04, 0.58),
    _ = ae(r, 0.62, 1),
    s = He(N, 0.02, 0.16, 0.26, 0.4),
    b = ae(N, 0.42, 0.56),
    I = ae(N, 0.82, 0.88),
    E = Math.max(s, I),
    v = b,
    i = He(_, 0.02, 0.16, 0.3, 0.44),
    L = ae(_, 0.34, 0.48),
    C = ae(_, 0.9, 0.99),
    h = Math.max(i, C),
    m = L;
  (Ie(e.scrollCue, { opacity: n, y: 16 * (1 - n), scale: 0.98 + n * 0.02 }),
    Ie(e.toolsCopy, { opacity: y, y: 0, scale: 1 }),
    Ie(e.nearFigure, { opacity: y, y: 0, scale: 1 }),
    Ce(e.distanceLabel, { opacity: E, x: -6 * (1 - E), y: 10 * (1 - E) }),
    Ce(e.nearLabel, { opacity: v, x: 6 * (1 - v), y: 10 * (1 - v) }),
    Ie(e.deviceCopy, { opacity: y, y: 0, scale: 1 }),
    Ie(e.deviceFigure, { opacity: y, y: 0, scale: 1 }),
    Ce(e.loupeHighlight, { opacity: h, x: -4 * (1 - h), y: 8 * (1 - h) }),
    Ce(e.ophthalmoscopeHighlight, {
      opacity: m,
      x: 4 * (1 - m),
      y: 8 * (1 - m),
    }),
    Ce(e.loupeLabel, { opacity: h, x: -10 * (1 - h), y: 10 * (1 - h) }),
    Ce(e.ophthalmoscopeLabel, {
      opacity: m,
      x: 10 * (1 - m),
      y: 10 * (1 - m),
    }));
}
var Qe = !1;
function it() {
  Qe ||
    ((Qe = !0),
    document.addEventListener("page:shown", (e) => {
      if (e.detail?.id !== "diabeticArclightPackagePage") return;
      let r = document.getElementById(
        "diabeticArclightPackagePage",
      )?._diabeticArclightPackageScheduleRender;
      typeof r == "function" &&
        window.requestAnimationFrame(() => {
          window.requestAnimationFrame(() => {
            r();
          });
        });
    }));
}
function nt() {
  let e = document.getElementById("diabeticArclightPackagePage");
  if (!e) return;
  typeof e._diabeticArclightPackageCleanup == "function" &&
    e._diabeticArclightPackageCleanup();
  let o = e.querySelector("[data-dr-package-story]");
  if (!o) return;
  let r = {
    scrollCue: e.querySelector('[data-dr-package="scrollCue"]'),
    toolsCopy: e.querySelector('[data-dr-package="toolsCopy"]'),
    nearFigure: e.querySelector('[data-dr-package="nearFigure"]'),
    distanceLabel: e.querySelector('[data-dr-package="distanceLabel"]'),
    nearLabel: e.querySelector('[data-dr-package="nearLabel"]'),
    deviceCopy: e.querySelector('[data-dr-package="deviceCopy"]'),
    deviceFigure: e.querySelector('[data-dr-package="deviceFigure"]'),
    loupeHighlight: e.querySelector('[data-dr-package="loupeHighlight"]'),
    ophthalmoscopeHighlight: e.querySelector(
      '[data-dr-package="ophthalmoscopeHighlight"]',
    ),
    loupeLabel: e.querySelector('[data-dr-package="loupeLabel"]'),
    ophthalmoscopeLabel: e.querySelector(
      '[data-dr-package="ophthalmoscopeLabel"]',
    ),
  };
  if (
    [
      r.scrollCue,
      r.toolsCopy,
      r.nearFigure,
      r.distanceLabel,
      r.nearLabel,
      r.deviceCopy,
      r.deviceFigure,
      r.loupeHighlight,
      r.ophthalmoscopeHighlight,
      r.loupeLabel,
      r.ophthalmoscopeLabel,
    ].some((I) => !I)
  )
    return;
  let p = new AbortController(),
    { signal: n } = p,
    y = Be(e),
    N = 0,
    _ = -1,
    s = () => {
      N ||
        (N = window.requestAnimationFrame(() => {
          N = 0;
          let I = $e(y),
            E = o.getBoundingClientRect(),
            v = Math.max(E.height - I.height, 1),
            i = (I.top - E.top) / v,
            L = ge(i);
          Math.abs(i - _) < 5e-4 || ((_ = i), Fe(r, i));
        }));
    },
    b = (I, E, v, i = {}) => {
      I?.addEventListener && I.addEventListener(E, v, { ...i, signal: n });
    };
  (y === window
    ? b(window, "scroll", s, { passive: !0 })
    : b(y, "scroll", s, { passive: !0 }),
    b(window, "resize", s, { passive: !0 }),
    b(window, "orientationchange", s, { passive: !0 }),
    e.querySelectorAll("img").forEach((I) => {
      I.complete || b(I, "load", s, { once: !0 });
    }),
    (e._diabeticArclightPackageScheduleRender = () => {
      ((_ = -1), s());
    }),
    (e._diabeticArclightPackageCleanup = () => {
      (p.abort(),
        N && (window.cancelAnimationFrame(N), (N = 0)),
        delete e._diabeticArclightPackageCleanup,
        delete e._diabeticArclightPackageScheduleRender);
    }),
    Fe(r, -1),
    it());
}
function st() {
  document.querySelectorAll("[data-diabetic-scroll-lesson]").forEach((o) => {
    if (o.dataset.diabeticScrollInited === "1") return;
    let r = o.closest(".page"),
      a = Array.from(o.querySelectorAll("[data-diabetic-scroll-step]")),
      p = Array.from(o.querySelectorAll("[data-ncd-check-step]"));
    if (!r || a.length === 0) return;
    o.dataset.diabeticScrollInited = "1";
    let n = Be(o),
      y = o.querySelector("[data-diabetic-scroll-cue]"),
      N = new AbortController(),
      { signal: _ } = N,
      s = 0;
    y &&
      y.dataset.diabeticCueUpgraded !== "1" &&
      ((y.dataset.diabeticCueUpgraded = "1"),
      (y.innerHTML = `
        <div class="diabetic-screening-scroll-cue__pill">
          <span class="diabetic-screening-scroll-cue__label">scroll<br>down</span>
          <div class="diabetic-screening-scroll-cue__stack">
            <img
              class="diabetic-screening-scroll-cue__down"
              src="/scrolly/workshop/childhood/eyesbrain/down.png"
              alt=""
              loading="eager"
              draggable="false"
            >
            <img
              class="diabetic-screening-scroll-cue__hand"
              src="/scrolly/workshop/childhood/eyesbrain/hand.png"
              alt=""
              loading="eager"
              draggable="false"
            >
            <span class="diabetic-screening-scroll-cue__chev"></span>
            <span class="diabetic-screening-scroll-cue__chev"></span>
            <span class="diabetic-screening-scroll-cue__chev"></span>
          </div>
        </div>
      `));
    let b = () => {
        let i = r;
        for (; i; ) {
          let L = window.getComputedStyle(i);
          if (L.display === "none" || L.visibility === "hidden") return !1;
          i = i.parentElement;
        }
        return !0;
      },
      I = () => {
        if (((s = 0), !b())) return;
        let i = $e(n),
          L = i.top + i.height * 0.12,
          C = i.top + i.height * 0.84,
          h = !1,
          m = 0;
        if (
          (a.forEach((d, t) => {
            let k = d.getBoundingClientRect(),
              l = k.top < C && k.bottom > L;
            ((l || (t === 0 && k.top < C)) && d.classList.add("is-visible"),
              l && !h
                ? (d.classList.add("is-current"), (h = !0), (m = t))
                : d.classList.remove("is-current"));
          }),
          o.querySelectorAll("[data-diabetic-visible-class]").forEach((d) => {
            let t = d.dataset.diabeticVisibleClass;
            if (!t) return;
            let k = d.getBoundingClientRect();
            (d.closest("[data-diabetic-scroll-step]") || d).classList.toggle(
              t,
              k.top < C && k.bottom > L,
            );
          }),
          (o.dataset.diabeticCurrentStep = String(m)),
          p.length)
        ) {
          let d = i.top + i.height * 0.5,
            t = o.querySelector(".diabetic-screening-panel--ncd-checks"),
            k = t?.getBoundingClientRect(),
            l = k && k.top < C && k.bottom > L,
            g = null,
            O = Number.POSITIVE_INFINITY;
          (l &&
            (p.forEach((R) => {
              let H = R.getBoundingClientRect();
              if (!(H.top < C && H.bottom > L)) return;
              let S = Math.abs(H.top + H.height * 0.5 - d);
              S < O && ((O = S), (g = R));
            }),
            g || (g = p[0])),
            t?.classList.toggle("is-ncd-checking", !!g),
            p.forEach((R) => {
              R.classList.toggle("is-ncd-check-current", R === g);
            }));
        }
        if (y) {
          let d = o.getBoundingClientRect(),
            t = Math.max(d.height - i.height, 1),
            k = ge((i.top - d.top) / t);
          y.classList.toggle("is-hidden", k > 0.035);
        }
        o.querySelectorAll("[data-diabetic-zoom]").forEach((d) => {
          let t = d.getBoundingClientRect(),
            k = ge(
              (i.height * 0.78 - t.top + i.top) /
                Math.max(t.height + i.height * 0.28, 1),
            );
          d.style.setProperty("--zoom-progress", k.toFixed(4));
        });
      },
      E = () => {
        s || (s = window.requestAnimationFrame(I));
      },
      v = (i, L, C, h = {}) => {
        i?.addEventListener && i.addEventListener(L, C, { ...h, signal: _ });
      };
    (o.querySelectorAll("[data-diabetic-wheel-zoom]").forEach((i) => {
      i.dataset.diabeticWheelZoomWired !== "1" &&
        ((i.dataset.diabeticWheelZoomWired = "1"),
        i.style.setProperty("--zoom-progress", "0"),
        v(
          i,
          "wheel",
          (L) => {
            L.preventDefault();
            let C = Number.parseFloat(
                i.style.getPropertyValue("--zoom-progress") || "0",
              ),
              h = L.deltaY > 0 ? 1 : -1,
              m = ge(C + h * 0.08);
            i.style.setProperty("--zoom-progress", m.toFixed(4));
          },
          { passive: !1 },
        ));
    }),
      o.querySelectorAll("video[data-diabetic-video-start]").forEach((i) => {
        if (i.dataset.diabeticClipWired === "1") return;
        i.dataset.diabeticClipWired = "1";
        let L = Number.parseFloat(i.dataset.diabeticVideoStart || "0"),
          C = Number.parseFloat(i.dataset.diabeticVideoEnd || "0"),
          h = () => {
            if (
              !(!Number.isFinite(L) || L <= 0) &&
              !(
                i.currentTime >= L - 0.1 &&
                (!Number.isFinite(C) || C <= 0 || i.currentTime < C)
              )
            )
              try {
                i.currentTime = L;
              } catch {}
          };
        (v(i, "loadedmetadata", h),
          v(i, "play", h),
          v(i, "timeupdate", () => {
            if (!(!Number.isFinite(C) || C <= 0) && !(i.currentTime < C))
              try {
                (i.pause(), (i.currentTime = C));
              } catch {}
          }));
      }),
      a[0]?.classList.add("is-visible"),
      n === window
        ? v(window, "scroll", E, { passive: !0 })
        : v(n, "scroll", E, { passive: !0 }),
      v(window, "resize", E, { passive: !0 }),
      v(window, "orientationchange", E, { passive: !0 }),
      v(document, "page:shown", (i) => {
        i.detail?.id === r.id &&
          (a[0]?.classList.add("is-visible"),
          y?.classList.remove("is-hidden"),
          o
            .querySelectorAll("video[data-diabetic-video-start]")
            .forEach((L) => {
              let C = Number.parseFloat(L.dataset.diabeticVideoStart || "0");
              if (!(!Number.isFinite(C) || C <= 0))
                try {
                  (L.pause(), (L.currentTime = C));
                } catch {}
            }),
          E(),
          window.requestAnimationFrame(E));
      }),
      (r._diabeticScreeningScrollCleanup = () => {
        (N.abort(),
          s && (window.cancelAnimationFrame(s), (s = 0)),
          delete r._diabeticScreeningScrollCleanup);
      }),
      E());
  });
}
function rt() {
  if (
    (document.querySelectorAll("[data-diabetic-panzoom]").forEach((a) => {
      if (a.dataset.diabeticPanzoomWired === "1") return;
      a.dataset.diabeticPanzoomWired = "1";
      let p = a.querySelector(".diabetic-protocol-algorithm-window"),
        n = a.querySelector(".diabetic-protocol-algorithm-map"),
        y = a.querySelector("[data-diabetic-zoom-in]"),
        N = a.querySelector("[data-diabetic-zoom-out]");
      if (!p || !n) return;
      let _ = !!a.closest("#diabeticProtocolOverviewPage");
      a.classList.toggle("diabetic-protocol-algorithm-viewer--full-scroll", _);
      let s = {
          scale: 1,
          x: 0,
          y: 0,
          dragging: !1,
          startX: 0,
          startY: 0,
          baseX: 0,
          baseY: 0,
        },
        b = () => {
          if (_) {
            let O = p.clientWidth || a.clientWidth || 1,
              R = n.offsetWidth * s.scale;
            ((s.x = Math.max(0, (O - R) / 2)), (s.y = 0));
            return;
          }
          let d = p.getBoundingClientRect(),
            t = n.offsetWidth * s.scale,
            k = n.offsetHeight * s.scale,
            l = Math.min(d.width - t - 18, 18),
            g = Math.min(d.height - k - 18, 18);
          ((s.x = Math.min(18, Math.max(l, s.x))),
            (s.y = Math.min(18, Math.max(g, s.y))));
        },
        I = n.querySelectorAll(
          ".diabetic-protocol-algorithm-phase, .diabetic-protocol-algorithm-ncd",
        ),
        E = () => {
          let d = _
              ? {
                  top: 0,
                  left: 0,
                  right:
                    window.innerWidth ||
                    document.documentElement.clientWidth ||
                    1,
                  bottom:
                    window.innerHeight ||
                    document.documentElement.clientHeight ||
                    1,
                  width:
                    window.innerWidth ||
                    document.documentElement.clientWidth ||
                    1,
                  height:
                    window.innerHeight ||
                    document.documentElement.clientHeight ||
                    1,
                }
              : p.getBoundingClientRect(),
            t = Math.max(d.width * d.height, 1);
          I.forEach((k) => {
            let l = k.getBoundingClientRect(),
              g = Math.max(
                0,
                Math.min(l.right, d.right) - Math.max(l.left, d.left),
              ),
              O = Math.max(
                0,
                Math.min(l.bottom, d.bottom) - Math.max(l.top, d.top),
              ),
              R = (g * O) / t;
            k.classList.toggle("is-map-phase-visible", R >= 0.12);
          });
        },
        v = () => {
          if (
            (b(),
            n.style.setProperty("--map-scale", s.scale.toFixed(2)),
            n.style.setProperty("--pan-x", `${s.x.toFixed(1)}px`),
            n.style.setProperty("--pan-y", `${s.y.toFixed(1)}px`),
            _)
          ) {
            let d = Math.ceil(n.offsetHeight * s.scale);
            d > 0
              ? p.style.setProperty("--map-layout-height", `${d}px`)
              : p.style.removeProperty("--map-layout-height");
          }
          window.requestAnimationFrame(E);
        };
      if ("IntersectionObserver" in window && I.length) {
        let d = new IntersectionObserver(
          (t) => {
            t.forEach((k) => {
              k.target.classList.toggle(
                "is-map-phase-visible",
                k.isIntersecting && k.intersectionRatio >= 0.28,
              );
            });
          },
          { root: _ ? null : p, threshold: [0, 0.28, 0.45, 0.7] },
        );
        I.forEach((t) => d.observe(t));
      } else I.forEach((d) => d.classList.add("is-map-phase-visible"));
      let i = 0,
        L = () => {
          let d = p.clientWidth,
            t = n.offsetWidth;
          if (d < 80 || t < 1) return !1;
          let k = (d - 24) / Math.max(t, 1);
          return (
            (s.scale = Math.min(1.18, Math.max(0.46, k))),
            (s.x = Math.max(0, (d - t * s.scale) / 2)),
            (s.y = 0),
            (i = d),
            !0
          );
        },
        C = () => {
          L() && v();
        },
        h = () => {
          window.requestAnimationFrame(() => {
            (C(), window.requestAnimationFrame(C));
          });
        },
        m = (d) => {
          let t = s.scale;
          ((s.scale = Math.min(1.6, Math.max(0.46, s.scale + d))),
            s.scale !== t &&
              (_ ||
                ((s.x -= (n.offsetWidth * (s.scale - t)) / 2),
                (s.y -= (n.offsetHeight * (s.scale - t)) / 5)),
              v()));
        };
      if (
        (y?.addEventListener("click", () => m(0.12)),
        N?.addEventListener("click", () => m(-0.12)),
        !_)
      ) {
        (p.addEventListener("pointerdown", (t) => {
          t.target.closest(".diabetic-protocol-algorithm-controls") ||
            ((s.dragging = !0),
            (s.startX = t.clientX),
            (s.startY = t.clientY),
            (s.baseX = s.x),
            (s.baseY = s.y),
            p.classList.add("is-dragging"),
            p.setPointerCapture?.(t.pointerId));
        }),
          p.addEventListener("pointermove", (t) => {
            s.dragging &&
              ((s.x = s.baseX + t.clientX - s.startX),
              (s.y = s.baseY + t.clientY - s.startY),
              v());
          }));
        let d = (t) => {
          s.dragging &&
            ((s.dragging = !1),
            p.classList.remove("is-dragging"),
            p.releasePointerCapture?.(t.pointerId),
            v());
        };
        (p.addEventListener("pointerup", d),
          p.addEventListener("pointercancel", d));
      }
      (window.addEventListener(
        "resize",
        () => {
          C();
        },
        { passive: !0 },
      ),
        _ &&
          document.addEventListener("page:shown", (d) => {
            d.detail?.id === "diabeticProtocolOverviewPage" && h();
          }),
        "ResizeObserver" in window &&
          new ResizeObserver(() => {
            let t = p.clientWidth;
            t > 0 && Math.abs(t - i) > 2 && C();
          }).observe(p),
        C(),
        h());
    }),
    document.body.dataset.diabeticProliferativeLightboxWired === "1")
  )
    return;
  document.body.dataset.diabeticProliferativeLightboxWired = "1";
  let e = null,
    o = () => {
      (e?.remove(),
        (e = null),
        document.body.classList.remove("diabetic-proliferative-lightbox-open"));
    },
    r = (a) => {
      if (!a) return null;
      let p = null,
        n = -1;
      return (
        a.querySelectorAll("figure").forEach((y) => {
          let N = y.querySelector("img");
          if (!N) return;
          let _ = Number.parseFloat(getComputedStyle(y).opacity || "0");
          _ > n && ((p = N), (n = _));
        }),
        p
      );
    };
  (document.addEventListener("click", (a) => {
    let p = a.target.closest?.(
      'img[src*="/images/learning/Diabetic/Diabetes/ProliferativeAndOtherDisease/"]',
    );
    p &&
      (a.preventDefault(),
      (p = r(p.closest(".diabetic-protocol-looping-gallery")) || p),
      o(),
      document.body.classList.add("diabetic-proliferative-lightbox-open"),
      (e = document.createElement("div")),
      (e.className = "diabetic-proliferative-lightbox"),
      e.setAttribute("role", "dialog"),
      e.setAttribute("aria-modal", "true"),
      (e.innerHTML = `
      <button type="button" aria-label="Close" data-i18n="languageInstall.closeButton:aria-label">x</button>
      <img src="${p.currentSrc || p.src}" alt="${p.alt || ""}">
    `),
      document.body.appendChild(e),
      window.I18N?.applyTranslations?.(e));
  }),
    document.addEventListener("click", (a) => {
      e &&
        (a.target === e ||
          a.target.closest(".diabetic-proliferative-lightbox button")) &&
        o();
    }),
    document.addEventListener("keydown", (a) => {
      a.key === "Escape" && o();
    }));
}
function We(e) {
  if (e) {
    if (typeof window.showPage == "function") window.showPage(e);
    else if (typeof window.minimalShowPage == "function")
      (window.minimalShowPage(e),
        document.dispatchEvent(
          new CustomEvent("page:shown", { detail: { id: e } }),
        ));
    else {
      document.querySelectorAll(".page").forEach((r) => {
        (r.classList.remove("active"), (r.style.display = "none"));
      });
      let o = document.getElementById(e);
      if (!o) return;
      (o.classList.add("active"),
        (o.style.display = "block"),
        document.dispatchEvent(
          new CustomEvent("page:shown", { detail: { id: e } }),
        ));
    }
    try {
      window.scrollTo(0, 0);
    } catch {}
  }
}
function Ae(e) {
  try {
    return sessionStorage.getItem(e);
  } catch {
    return null;
  }
}
function at(e, o) {
  try {
    sessionStorage.setItem(e, o);
  } catch {}
}
function ye(e) {
  try {
    sessionStorage.removeItem(e);
  } catch {}
}
function ot(e) {
  let o = Ae(Re);
  if (!o || !e) return;
  let r = e.querySelector(o);
  (ye(Re),
    r &&
      window.requestAnimationFrame(() => {
        try {
          r.scrollIntoView({ block: "center", behavior: "smooth" });
        } catch {
          r.scrollIntoView();
        }
        (r.classList.add("diabetic-restored-focus"),
          window.setTimeout(() => {
            r.classList.remove("diabetic-restored-focus");
          }, 1800),
          r.focus?.({ preventScroll: !0 }));
      }));
}
async function ct(e) {
  if (e) {
    try {
      ((window.__videosPendingTarget = e),
        (window.__videosSuppressFlash = !0),
        sessionStorage.setItem("gotoSubPage", e));
    } catch {}
    await Pe("videos", { subPageId: e });
    try {
      let { goToVideosSection: o } = await import("./videos-YJRPAZ42.js");
      if (typeof o == "function") {
        o(e, { skipDefault: !0 });
        return;
      }
    } catch {}
    We(e);
  }
}
function lt(e) {
  (e.querySelectorAll(".diabetic-folder-item-count").forEach((o) => {
    o.remove();
  }),
    e.querySelectorAll(".diabetic-folder-row[data-item-count]").forEach((o) => {
      o.removeAttribute("data-item-count");
    }));
}
function dt(e) {
  let o = e.querySelectorAll("#diabeticWorkshopFolders .diabetic-folder-row"),
    r = e.querySelectorAll(".diabetic-section-card"),
    a = e.querySelector("#diabeticWorkshopFolders");
  if (!a) return;
  lt(e);
  let p = (b) => {
      b &&
        (b.classList.remove("diabetic-nested-folder-open"),
        b.querySelectorAll(".diabetic-nested-section-card").forEach((I) => {
          ((I.style.display = "none"),
            I.querySelector("h3")?.querySelector(".see-all-toggle")?.remove());
        }),
        b.querySelectorAll(".diabetic-nested-folder-row").forEach((I) => {
          ((I.style.display = ""),
            I.classList.remove("is-nested-sibling-dimmed"));
        }));
    },
    n = () => {
      e.querySelectorAll(".diabetic-nested-folder-row").forEach((b) => {
        if (b.dataset.wired === "1") return;
        b.dataset.wired = "1";
        let I = b.getAttribute("data-nested-folder");
        if (!I) return;
        let E = (v) => {
          (v.preventDefault(), v.stopPropagation());
          let i = b.closest(".diabetic-section-card");
          if (!i) return;
          let L = i.querySelector(
            `.diabetic-nested-section-card[data-nested-section="${I}"]`,
          );
          if (!L) return;
          (p(i),
            i.classList.add("diabetic-nested-folder-open"),
            i.querySelectorAll(".diabetic-nested-folder-row").forEach((d) => {
              d !== b && d.classList.add("is-nested-sibling-dimmed");
            }),
            (b.style.display = "none"),
            b.insertAdjacentElement("afterend", L),
            (L.style.display = ""));
          let C = L.querySelector("h3");
          if (!C) return;
          ((C.style.display = "flex"),
            (C.style.alignItems = "center"),
            (C.style.width = "100%"));
          let h = document.createElement("span");
          ((h.className = "see-all-toggle"),
            h.setAttribute("role", "button"),
            h.setAttribute("tabindex", "0"),
            h.setAttribute("aria-expanded", "true"),
            (h.textContent = "Close ^"),
            (h.style.marginLeft = "auto"),
            (h.style.marginRight = "30px"),
            (h.style.whiteSpace = "nowrap"));
          let m = (d) => {
            (d.preventDefault(), d.stopPropagation(), p(i));
          };
          (h.addEventListener("click", m),
            h.addEventListener("keydown", (d) => {
              (d.key === "Enter" || d.key === " ") && m(d);
            }),
            C.appendChild(h));
        };
        (b.addEventListener("click", E),
          b.addEventListener("keydown", (v) => {
            (v.key === "Enter" || v.key === " ") && E(v);
          }));
      });
    },
    y = () => {
      r.forEach((b) => {
        ((b.style.display = "none"),
          b.querySelector("h3")?.querySelector(".see-all-toggle")?.remove(),
          p(b));
      });
    },
    N = (b) => {
      let I = e.querySelector(`.diabetic-section-card[data-section="${b}"]`),
        E = e.querySelector(
          `#diabeticWorkshopFolders .diabetic-folder-row[data-folder="${b}"]`,
        );
      if (!I || !E) return;
      (y(),
        o.forEach((C) => {
          C.style.display = "";
        }),
        (E.style.display = "none"),
        at(xe, b),
        e.classList.add("diabetic-folder-open"),
        E.insertAdjacentElement("afterend", I),
        (I.style.display = ""),
        p(I));
      let v = I.querySelector("h3");
      if (!v) return;
      ((v.style.display = "flex"),
        (v.style.alignItems = "center"),
        (v.style.width = "100%"));
      let i = document.createElement("span");
      ((i.className = "see-all-toggle"),
        i.setAttribute("role", "button"),
        i.setAttribute("tabindex", "0"),
        i.setAttribute("aria-expanded", "true"),
        (i.textContent = "Close ^"),
        (i.style.marginLeft = "auto"),
        (i.style.marginRight = "30px"),
        (i.style.whiteSpace = "nowrap"));
      let L = (C) => {
        (C.preventDefault(),
          C.stopPropagation(),
          (I.style.display = "none"),
          i.remove(),
          (E.style.display = ""),
          ye(xe),
          ye(Ee),
          e.classList.remove("diabetic-folder-open"));
      };
      (i.addEventListener("click", L),
        i.addEventListener("keydown", (C) => {
          (C.key === "Enter" || C.key === " ") && L(C);
        }),
        v.appendChild(i),
        ot(I));
    };
  ((e.__showSectionByKey = N),
    n(),
    y(),
    o.forEach((b) => {
      b.style.display = "";
    }),
    (a.style.display = ""),
    e.classList.remove("diabetic-folder-open"));
  let _ = Ae(Ee) === "1",
    s = Ae(xe);
  (_ && s ? (ye(Ee), N(s)) : (ye(xe), ye(Ee), ye(Re)),
    o.forEach((b) => {
      if (b.dataset.wired === "1") return;
      b.dataset.wired = "1";
      let I = b.getAttribute("data-folder");
      if (!I) return;
      let E = (v) => {
        (v.preventDefault(), v.stopPropagation(), N(I));
      };
      (b.addEventListener("click", E),
        b.addEventListener("keydown", (v) => {
          (v.key === "Enter" || v.key === " ") && E(v);
        }));
    }));
}
function ut() {
  let e = document.getElementById("diabeticHistoryImageMatchPage");
  if (!e || e.dataset.inited === "1") return;
  let o = e.querySelector("#diabeticHistoryImageMatchBank"),
    r = e.querySelector("#diabeticHistoryImageMatchSlots"),
    a = e.querySelector("#diabeticHistoryImageMatchHint"),
    p = e.querySelector("#diabeticHistoryImageMatchProgress"),
    n = e.querySelector("#diabeticHistoryImageMatchProgressLabel"),
    y = e.querySelector("#diabeticHistoryImageMatchSubmit"),
    N = e.querySelector("#diabeticHistoryImageMatchFeedback"),
    _ = e.querySelector("#diabeticHistoryImageMatchIntroModal"),
    s = e.querySelector("#diabeticHistoryImageMatchResultsModal"),
    b = e.querySelector("#diabeticHistoryImageMatchResultsSummary"),
    I = e.querySelector("#diabeticHistoryImageMatchResultsList"),
    E = e.querySelectorAll("[data-history-match-modal-close]"),
    v = e.querySelectorAll("[data-history-match-results-close]");
  if (!o || !r || !a || !p || !n || !y || !N || !_ || !s || !b || !I) return;
  ((e.dataset.inited = "1"),
    e.querySelectorAll(".diabetic-history-match__modal-close").forEach((u) => {
      u.innerHTML = "&times;";
    }));
  let i = {
      rounds: [],
      currentRoundIndex: 0,
      hasCompletedQuiz: !1,
      dragImageId: null,
      dragPointerId: null,
      dragSourceEl: null,
      dragGhostEl: null,
      dragCleanup: null,
      dropPromptId: null,
      dropRowEl: null,
    },
    L = () =>
      tt(Le, Ye).map((u) => ({
        items: u,
        imageOrder: u.map((w) => w.id),
        promptOrder: ke(u.map((w) => w.id)),
        assignments: new Map(),
      })),
    C = () => i.rounds[i.currentRoundIndex] || null,
    h = (u) => {
      let w = C();
      if (!w) return null;
      for (let [A, M] of w.assignments.entries()) if (M === u) return A;
      return null;
    },
    m = (u) => {
      let w = h(u);
      w && C()?.assignments.delete(w);
    },
    d = (u = "", w = "") => {
      ((N.textContent = ""),
        (N.className = "diabetic-history-match__feedback"),
        u && ((N.textContent = u), w && N.classList.add(w)));
    },
    t = (u, w = !1) => {
      ((a.textContent = u), a.classList.toggle("is-active", w));
    },
    k = () => {
      (_.classList.add("is-open"), _.setAttribute("aria-hidden", "false"));
    },
    l = () => {
      (_.classList.remove("is-open"), _.setAttribute("aria-hidden", "true"));
    },
    g = () => {
      (s.classList.add("is-open"), s.setAttribute("aria-hidden", "false"));
    },
    O = () => {
      (s.classList.remove("is-open"), s.setAttribute("aria-hidden", "true"));
    },
    R = () => {
      (i.dropRowEl && i.dropRowEl.classList.remove("is-drop-target"),
        (i.dropRowEl = null),
        (i.dropPromptId = null));
    },
    H = () => {
      (i.dragGhostEl?.remove(), (i.dragGhostEl = null));
    },
    c = (u) => {
      i.dragGhostEl &&
        ((i.dragGhostEl.style.left = `${u.clientX - 42}px`),
        (i.dragGhostEl.style.top = `${u.clientY - 42}px`));
    },
    S = (u) => {
      let w = ve.get(u);
      if (!w) return null;
      let A = document.createElement("div");
      A.className = "diabetic-history-match__drag-ghost";
      let M = document.createElement("img");
      return (
        (M.src = w.imageSrc),
        (M.alt = ""),
        M.setAttribute("aria-hidden", "true"),
        A.appendChild(M),
        document.body.appendChild(A),
        (i.dragGhostEl = A),
        A
      );
    },
    x = (u) => {
      let w = C();
      return w ? w.imageOrder.indexOf(u) + 1 : 0;
    },
    P = () => {
      ((p.innerHTML = ""),
        i.rounds.forEach((w, A) => {
          let M = document.createElement("span");
          ((M.className = "diabetic-history-match__progress-step"),
            i.hasCompletedQuiz || A < i.currentRoundIndex
              ? M.classList.add("is-complete")
              : A === i.currentRoundIndex && M.classList.add("is-active"),
            p.appendChild(M));
        }));
      let u = Math.min(i.currentRoundIndex + 1, i.rounds.length || 1);
      n.textContent = `Set ${u} of ${i.rounds.length}`;
    },
    W = () => {
      let u = Le.length || 1,
        w = i.rounds.reduce((M, Q) => M + Q.assignments.size, 0),
        A = i.hasCompletedQuiz ? 100 : (w / u) * 90;
      me("diabeticHistoryImageMatchPage", A);
    },
    V = (u, w) => {
      let M = document
        .elementFromPoint(u, w)
        ?.closest?.(".diabetic-history-match__row[data-prompt-id]");
      if (!M || !r.contains(M)) {
        R();
        return;
      }
      let Q = M.getAttribute("data-prompt-id");
      if (!Q) {
        R();
        return;
      }
      (i.dropRowEl === M && i.dropPromptId === Q) ||
        (R(),
        (i.dropRowEl = M),
        (i.dropPromptId = Q),
        M.classList.add("is-drop-target"));
    },
    T = (u, w) => {
      let A = C();
      A &&
        (m(u),
        A.assignments.set(w, u),
        d(""),
        t("Placed. Drag a filled photo to change a match.", !0),
        G());
    },
    J = ({ applyDrop: u }) => {
      (u && i.dragImageId && i.dropPromptId
        ? T(i.dragImageId, i.dropPromptId)
        : i.hasCompletedQuiz ||
          t("Drag an image onto the matching history card."),
        i.dragCleanup?.(),
        (i.dragCleanup = null),
        i.dragSourceEl && i.dragSourceEl.classList.remove("is-dragging"),
        H(),
        R(),
        (i.dragImageId = null),
        (i.dragPointerId = null),
        (i.dragSourceEl = null));
    },
    j = (u, w, A) => {
      if (typeof w.button == "number" && w.button !== 0) return;
      (w.preventDefault(),
        J({ applyDrop: !1 }),
        (i.dragImageId = u),
        (i.dragPointerId = w.pointerId),
        (i.dragSourceEl = A),
        A.classList.add("is-dragging"),
        S(u),
        c(w),
        V(w.clientX, w.clientY),
        t("Drop on the matching history card.", !0));
      try {
        A.setPointerCapture(w.pointerId);
      } catch {}
      let M = (F) => {
          F.pointerId === i.dragPointerId && (c(F), V(F.clientX, F.clientY));
        },
        Q = (F) => {
          F.pointerId === i.dragPointerId &&
            (c(F), V(F.clientX, F.clientY), J({ applyDrop: !0 }));
        },
        B = (F) => {
          F.pointerId === i.dragPointerId && J({ applyDrop: !1 });
        };
      (window.addEventListener("pointermove", M),
        window.addEventListener("pointerup", Q),
        window.addEventListener("pointercancel", B),
        (i.dragCleanup = () => {
          (window.removeEventListener("pointermove", M),
            window.removeEventListener("pointerup", Q),
            window.removeEventListener("pointercancel", B));
          try {
            A.releasePointerCapture?.(w.pointerId);
          } catch {}
        }));
    },
    te = () => {
      o.innerHTML = "";
      let u = C();
      if (!u) return;
      let w = (A, M = "") => {
        let Q = ve.get(A);
        if (!Q) return null;
        let B = document.createElement("button");
        ((B.type = "button"),
          (B.className = `diabetic-history-match__image-button ${M}`.trim()),
          B.setAttribute("aria-label", `Drag image ${x(A)}`),
          (B.draggable = !1),
          B.addEventListener("pointerdown", (K) => j(A, K, B)),
          B.addEventListener("dragstart", (K) => K.preventDefault()));
        let F = document.createElement("span");
        ((F.className = "diabetic-history-match__image-order"),
          (F.textContent = String(x(A))));
        let Y = document.createElement("img");
        return (
          (Y.className = "diabetic-history-match__image"),
          (Y.src = Q.imageSrc),
          (Y.alt = Q.label),
          (Y.loading = "lazy"),
          (Y.draggable = !1),
          B.appendChild(F),
          B.appendChild(Y),
          B
        );
      };
      u.imageOrder.forEach((A) => {
        if (h(A)) return;
        let M = w(A, "diabetic-history-match__image-button--bank");
        M && o.appendChild(M);
      });
    },
    ie = () => {
      r.innerHTML = "";
      let u = C();
      u &&
        u.promptOrder.forEach((w, A) => {
          let M = ve.get(w);
          if (!M) return;
          let Q = u.assignments.get(w) || null,
            B = Q ? ve.get(Q) : null,
            F = document.createElement("div");
          ((F.className = "diabetic-history-match__row"),
            F.setAttribute("data-prompt-id", w),
            F.setAttribute("aria-label", `History card ${A + 1}`),
            B && F.classList.add("is-filled"));
          let Y = document.createElement("div");
          if (((Y.className = "diabetic-history-match__slot"), B)) {
            let f = document.createElement("button");
            ((f.type = "button"),
              (f.className =
                "diabetic-history-match__image-button diabetic-history-match__image-button--slot"),
              f.setAttribute("aria-label", `Drag image ${x(Q)}`),
              (f.draggable = !1),
              f.addEventListener("pointerdown", (X) => j(Q, X, f)),
              f.addEventListener("dragstart", (X) => X.preventDefault()));
            let D = document.createElement("span");
            ((D.className = "diabetic-history-match__image-order"),
              (D.textContent = String(x(Q))));
            let z = document.createElement("img");
            ((z.className = "diabetic-history-match__image"),
              (z.src = B.imageSrc),
              (z.alt = B.label),
              (z.loading = "lazy"),
              (z.draggable = !1),
              f.appendChild(D),
              f.appendChild(z),
              Y.appendChild(f));
          } else {
            let f = document.createElement("span");
            ((f.className = "diabetic-history-match__slot-placeholder"),
              (f.textContent = "Drop"),
              Y.appendChild(f));
          }
          let K = document.createElement("div");
          K.className = "diabetic-history-match__card";
          let de = document.createElement("div");
          de.className = "diabetic-history-match__card-meta";
          let se = document.createElement("span");
          ((se.className = "diabetic-history-match__card-label"),
            (se.textContent = `History ${A + 1}`),
            de.appendChild(se));
          let ne = document.createElement("ul");
          ((ne.className = "diabetic-history-match__history-list"),
            M.historyLines.forEach((f) => {
              let D = document.createElement("li");
              ((D.textContent = f), ne.appendChild(D));
            }),
            K.appendChild(de),
            K.appendChild(ne),
            F.appendChild(Y),
            F.appendChild(K),
            r.appendChild(F));
        });
    },
    G = () => {
      (P(),
        te(),
        ie(),
        W(),
        (y.textContent =
          i.currentRoundIndex === i.rounds.length - 1
            ? "Submit answer"
            : "Next case"));
    },
    oe = (u, w, A) => {
      ((u.textContent = ""),
        u.appendChild(document.createTextNode("You got ")));
      let M = document.createElement("b");
      ((M.textContent = String(w)),
        u.appendChild(M),
        u.appendChild(document.createTextNode(" out of ")));
      let Q = document.createElement("b");
      ((Q.textContent = String(A)),
        u.appendChild(Q),
        u.appendChild(document.createTextNode(" correct.")));
    },
    we = () => {
      let u = 0,
        w = Le.length;
      return (
        (I.innerHTML = ""),
        i.rounds.forEach((A, M) => {
          let Q = document.createElement("section");
          Q.className = "diabetic-history-match__results-section";
          let B = document.createElement("h4");
          ((B.className = "diabetic-history-match__results-section-title"),
            (B.textContent = `Set ${M + 1}`),
            Q.appendChild(B),
            A.promptOrder.forEach((F) => {
              let Y = ve.get(F);
              if (!Y) return;
              let de = (A.assignments.get(F) || null) === F;
              de && (u += 1);
              let se = document.createElement("div");
              se.className = "diabetic-history-match__result-row";
              let ne = document.createElement("img");
              ((ne.className = "diabetic-history-match__result-thumb"),
                (ne.src = Y.imageSrc),
                (ne.alt = Y.label),
                (ne.loading = "lazy"));
              let f = document.createElement("div");
              f.className = "diabetic-history-match__result-body";
              let D = document.createElement("div");
              D.className = "diabetic-history-match__result-head";
              let z = document.createElement("p");
              ((z.className = "diabetic-history-match__result-title"),
                (z.textContent = Y.label));
              let X = document.createElement("span");
              ((X.className = "diabetic-history-match__result-status"),
                de
                  ? (X.classList.add("is-correct"), (X.textContent = "Correct"))
                  : (X.classList.add("is-wrong"), (X.textContent = "Wrong")));
              let U = document.createElement("ul");
              ((U.className = "diabetic-history-match__result-list"),
                Y.answerLines.forEach((ee) => {
                  let Z = document.createElement("li");
                  ((Z.textContent = ee), U.appendChild(Z));
                }),
                D.appendChild(z),
                D.appendChild(X),
                f.appendChild(D),
                f.appendChild(U),
                se.appendChild(ne),
                se.appendChild(f),
                Q.appendChild(se));
            }),
            I.appendChild(Q));
        }),
        oe(b, u, w),
        u
      );
    },
    q = () => {
      (J({ applyDrop: !1 }),
        (i.rounds = L()),
        (i.currentRoundIndex = 0),
        (i.hasCompletedQuiz = !1),
        O(),
        d(""),
        t("Drag an image onto the matching history card."),
        G());
    };
  (y.addEventListener("click", () => {
    let u = C();
    if (u) {
      if (u.assignments.size !== u.items.length) {
        (d(
          `Match all ${u.items.length} histories before continuing.`,
          "is-reviewed",
        ),
          t("Complete all matches to continue.", !0));
        return;
      }
      if ((d(""), i.currentRoundIndex < i.rounds.length - 1)) {
        ((i.currentRoundIndex += 1),
          t("Drag an image onto the matching history card."),
          G());
        try {
          window.scrollTo(0, 0);
        } catch {}
        return;
      }
      ((i.hasCompletedQuiz = !0), G(), we(), g());
    }
  }),
    E.forEach((u) => {
      u.dataset.wired !== "1" &&
        ((u.dataset.wired = "1"), u.addEventListener("click", l));
    }),
    _.addEventListener("click", (u) => {
      u.target === _ && l();
    }),
    v.forEach((u) => {
      u.dataset.wired !== "1" &&
        ((u.dataset.wired = "1"), u.addEventListener("click", O));
    }),
    s.addEventListener("click", (u) => {
      u.target === s && O();
    }),
    e.dataset.shownWired !== "1" &&
      ((e.dataset.shownWired = "1"),
      document.addEventListener("page:shown", (u) => {
        u.detail?.id === "diabeticHistoryImageMatchPage" && (q(), k());
      })),
    q());
}
function pt() {
  let e = document.getElementById("diabeticRetinalStructureTapPage");
  if (!e || e.dataset.inited === "1") return;
  let o = e.querySelector("#retinalStructureTapProgress"),
    r = e.querySelector("#retinalStructureTapProgressLabel"),
    a = e.querySelector("#retinalStructureTapPrompt"),
    p = e.querySelector("#retinalStructureTapPromptCard"),
    n = e.querySelector("#retinalStructureTapStage"),
    y = e.querySelector("#retinalStructureTapOverlay"),
    N = e.querySelector("#retinalStructureTapIdle"),
    _ = e.querySelector("#retinalStructureTapTip"),
    s = e.querySelector("#retinalStructureTapResult"),
    b = e.querySelector("#retinalStructureTapBanner"),
    I = e.querySelector("#retinalStructureTapBannerBadge"),
    E = e.querySelector("#retinalStructureTapBannerTitle"),
    v = e.querySelector("#retinalStructureTapBannerCopy"),
    i = e.querySelector("#retinalStructureTapExplanation"),
    L = e.querySelector("#retinalStructureTapNext"),
    C = e.querySelector("#retinalStructureTapIntroModal"),
    h = e.querySelector("#retinalStructureTapResultsModal"),
    m = e.querySelector("#retinalStructureTapResultsSummary"),
    d = e.querySelector("#retinalStructureTapResultsList"),
    t = e.querySelectorAll("[data-retinal-structure-modal-close]"),
    k = e.querySelectorAll("[data-retinal-structure-results-close]");
  if (
    !o ||
    !r ||
    !a ||
    !p ||
    !n ||
    !y ||
    !N ||
    !_ ||
    !s ||
    !b ||
    !I ||
    !E ||
    !v ||
    !i ||
    !L ||
    !C ||
    !h ||
    !m ||
    !d
  )
    return;
  ((e.dataset.inited = "1"),
    e.querySelectorAll(".retinal-structure-tap__modal-close").forEach((q) => {
      q.innerHTML = "&times;";
    }));
  let l = {
      currentIndex: 0,
      answers: [],
      hasAnsweredCurrent: !1,
      isComplete: !1,
    },
    g = () => ce[l.currentIndex],
    O = () => l.answers[l.currentIndex] || null,
    R = (q, u) => {
      ((q.hidden = !u),
        q.classList.toggle("is-open", u),
        q.setAttribute("aria-hidden", u ? "false" : "true"));
    },
    H = () => R(C, !0),
    c = () => R(C, !1),
    S = () => R(h, !0),
    x = () => R(h, !1),
    P = () => {
      ((o.innerHTML = ""),
        ce.forEach((u, w) => {
          let A = document.createElement("span");
          ((A.className = "retinal-structure-tap__progress-step"),
            l.isComplete || w < l.currentIndex
              ? A.classList.add("is-complete")
              : w === l.currentIndex && A.classList.add("is-active"),
            o.appendChild(A));
        }));
      let q = Math.min(l.currentIndex + 1, ce.length);
      r.textContent = `Structure ${q} of ${ce.length}`;
    },
    W = () => {
      let q = l.answers.filter(Boolean).length,
        u = l.isComplete ? 100 : (q / ce.length) * 90;
      me("diabeticRetinalStructureTapPage", u);
    },
    V = (q, u) => {
      let w = document.createElement("span");
      ((w.className = `retinal-structure-tap__target ${u}`.trim()),
        (w.style.left = `${(q.cx - q.rx) * 100}%`),
        (w.style.top = `${(q.cy - q.ry) * 100}%`),
        (w.style.width = `${q.rx * 200}%`),
        (w.style.height = `${q.ry * 200}%`),
        y.appendChild(w));
    },
    T = (q, u) => {
      let w = document.createElement("span");
      ((w.className = "retinal-structure-tap__tap-marker"),
        (w.style.left = `${q * 100}%`),
        (w.style.top = `${u * 100}%`),
        y.appendChild(w));
    },
    J = () => {
      if (((y.innerHTML = ""), !l.hasAnsweredCurrent)) return;
      let q = g(),
        u = O();
      !q ||
        !u ||
        (V(
          q.target,
          u.correct
            ? "retinal-structure-tap__target--correct"
            : "retinal-structure-tap__target--answer",
        ),
        T(u.tapX, u.tapY));
    },
    j = () => {
      let q = g(),
        u = O();
      !q ||
        !u ||
        (b.classList.remove("is-correct", "is-wrong"),
        I.classList.remove("is-correct", "is-wrong"),
        u.correct
          ? (b.classList.add("is-correct"),
            I.classList.add("is-correct"),
            (I.textContent = "\u2713"),
            (E.textContent = "Correct!"),
            (v.textContent = "You tapped the correct structure."))
          : (b.classList.add("is-wrong"),
            I.classList.add("is-wrong"),
            (I.textContent = "!"),
            (E.textContent = "Not quite"),
            (v.textContent = "Your tap was outside the correct area.")),
        (i.textContent = q.explanation),
        (L.textContent =
          l.currentIndex === ce.length - 1 ? "See results" : "Next >"));
    },
    te = () => {
      let q = g();
      q &&
        ((a.textContent = q.label),
        (_.textContent = q.tip),
        p.classList.toggle("is-answered", l.hasAnsweredCurrent));
    },
    ie = () => {
      let q = 0;
      ((d.innerHTML = ""),
        ce.forEach((u, w) => {
          let A = l.answers[w];
          A?.correct && (q += 1);
          let M = document.createElement("div");
          M.className = "retinal-structure-tap__results-row";
          let Q = document.createElement("span");
          ((Q.className = "retinal-structure-tap__results-number"),
            (Q.textContent = String(w + 1)));
          let B = document.createElement("div");
          B.className = "retinal-structure-tap__results-body";
          let F = document.createElement("p");
          ((F.className = "retinal-structure-tap__results-title"),
            (F.textContent = u.label));
          let Y = document.createElement("p");
          ((Y.className = "retinal-structure-tap__results-copy"),
            (Y.textContent = u.explanation));
          let K = document.createElement("span");
          ((K.className = "retinal-structure-tap__results-status"),
            A?.correct
              ? (K.classList.add("is-correct"), (K.textContent = "Correct"))
              : (K.classList.add("is-wrong"), (K.textContent = "Wrong")),
            B.appendChild(F),
            B.appendChild(Y),
            M.appendChild(Q),
            M.appendChild(B),
            M.appendChild(K),
            d.appendChild(M));
        }),
        (m.textContent = `You got ${q} out of ${ce.length} correct.`));
    },
    G = () => {
      (P(),
        te(),
        J(),
        W(),
        (N.style.display = l.hasAnsweredCurrent ? "none" : ""),
        (s.style.display = l.hasAnsweredCurrent ? "" : "none"),
        (L.style.display = l.hasAnsweredCurrent ? "" : "none"),
        (n.disabled = l.hasAnsweredCurrent),
        l.hasAnsweredCurrent && j());
    },
    oe = (q, u, w) => {
      let A = (q - w.cx) / w.rx,
        M = (u - w.cy) / w.ry;
      return A * A + M * M <= 1;
    },
    we = () => {
      ((l.currentIndex = 0),
        (l.answers = []),
        (l.hasAnsweredCurrent = !1),
        (l.isComplete = !1),
        x(),
        G());
    };
  (n.addEventListener("pointerup", (q) => {
    if (l.hasAnsweredCurrent) return;
    let u = n.getBoundingClientRect();
    if (!u.width || !u.height) return;
    let w = (q.clientX - u.left) / u.width,
      A = (q.clientY - u.top) / u.height,
      M = g();
    M &&
      ((l.answers[l.currentIndex] = {
        tapX: w,
        tapY: A,
        correct: oe(w, A, M.target),
      }),
      (l.hasAnsweredCurrent = !0),
      G());
  }),
    L.addEventListener("click", () => {
      if (l.hasAnsweredCurrent) {
        if (l.currentIndex < ce.length - 1) {
          ((l.currentIndex += 1), (l.hasAnsweredCurrent = !1), G());
          try {
            window.scrollTo(0, 0);
          } catch {}
          return;
        }
        ((l.isComplete = !0), G(), ie(), S());
      }
    }),
    t.forEach((q) => {
      q.dataset.wired !== "1" &&
        ((q.dataset.wired = "1"), q.addEventListener("click", c));
    }),
    k.forEach((q) => {
      q.dataset.wired !== "1" &&
        ((q.dataset.wired = "1"), q.addEventListener("click", x));
    }),
    C.addEventListener("click", (q) => {
      q.target === C && c();
    }),
    h.addEventListener("click", (q) => {
      q.target === h && x();
    }),
    e.dataset.shownWired !== "1" &&
      ((e.dataset.shownWired = "1"),
      document.addEventListener("page:shown", (q) => {
        q.detail?.id === "diabeticRetinalStructureTapPage" && (we(), H());
      })),
    we());
}
function ht({ page: e, stage: o, canvas: r }) {
  let a = null;
  try {
    a = r.getContext("2d");
  } catch {
    a = null;
  }
  if (!a)
    return {
      setCase() {},
      setSubmitted(c) {
        r.hidden = !!c;
      },
      resetPosition() {},
    };
  let p = new Image();
  p.decoding = "async";
  let n = {
      imageSrc: "",
      isRightEye: !0,
      isSubmitted: !1,
      isActive: !1,
      isDragging: !1,
      activePointerId: null,
      circleX: 0,
      circleY: 0,
      bgOffsetX: 0,
      bgOffsetY: 0,
      velocityX: 0,
      velocityY: 0,
      drawFrameId: null,
      motionFrameId: null,
      resizeObserver: null,
      lastMotionAt: 0,
    },
    y = (c) =>
      typeof window.requestAnimationFrame == "function"
        ? window.requestAnimationFrame(c)
        : window.setTimeout(() => c(Date.now()), 16),
    N = (c) => {
      typeof window.cancelAnimationFrame == "function"
        ? window.cancelAnimationFrame(c)
        : window.clearTimeout(c);
    },
    _ = (c, S, x) => (S > x ? (S + x) / 2 : Math.max(S, Math.min(x, c))),
    s = () => {
      let c = r.getBoundingClientRect(),
        S = Math.max(0, c.width),
        x = Math.max(0, c.height);
      if (S <= 0 || x <= 0) return null;
      let P = Math.max(1, Math.min(2, Number(window.devicePixelRatio) || 1)),
        W = Math.max(1, Math.round(S * P)),
        V = Math.max(1, Math.round(x * P));
      return (
        (r.width !== W || r.height !== V) && ((r.width = W), (r.height = V)),
        a.setTransform(P, 0, 0, P, 0, 0),
        { width: S, height: x }
      );
    },
    b = (c, S) => {
      let x = Math.min(c, S),
        P = (Ue / Ge) * Ze * je * (x / Xe);
      return _(P, Ke, Je);
    },
    I = (c) => {
      let S = b(c.width, c.height),
        x = Math.max(2, S * 0.08);
      ((n.circleX = _(n.circleX || c.width / 2, S + x, c.width - S - x)),
        (n.circleY = _(n.circleY || c.height / 2, S + x, c.height - S - x)));
    },
    E = () => {
      let c = s();
      c &&
        ((n.circleX = c.width / 2),
        (n.circleY = c.height / 2),
        (n.bgOffsetX = 0),
        (n.bgOffsetY = 0),
        (n.velocityX = 0),
        (n.velocityY = 0),
        t());
    },
    v = (c) => {
      if (!p.naturalWidth || !p.naturalHeight) return null;
      let S = Math.max(c.width / p.naturalWidth, c.height / p.naturalHeight),
        x = p.naturalWidth * S,
        P = p.naturalHeight * S;
      return {
        scale: S,
        drawnWidth: x,
        drawnHeight: P,
        imageX: (c.width - x) / 2,
        imageY: (c.height - P) / 2,
      };
    },
    i = (c, S) => {
      let x = v(c);
      if (!x) return;
      let P = x.drawnWidth * Ne,
        W = x.drawnHeight * Ne,
        V = x.imageX + (x.drawnWidth - P) / 2 + n.bgOffsetX,
        T = x.imageY + (x.drawnHeight - W) / 2 + n.bgOffsetY;
      (a.save(),
        a.beginPath(),
        a.arc(n.circleX, n.circleY, S, 0, 2 * Math.PI, !0),
        a.closePath(),
        a.clip(),
        (a.imageSmoothingEnabled = !0),
        (a.imageSmoothingQuality = "high"),
        a.drawImage(p, 0, 0, p.naturalWidth, p.naturalHeight, V, T, P, W),
        a.restore());
    },
    L = (c) => {
      let S = n.circleX,
        x = n.circleY + c * 0.34;
      (a.save(),
        a.beginPath(),
        a.ellipse(S, x, c * 0.34, c * 0.18, 0, 0, 2 * Math.PI),
        (a.fillStyle = "rgba(255, 255, 255, 0.34)"),
        a.fill(),
        a.beginPath(),
        a.ellipse(S, x, c * 0.24, c * 0.12, 0, 0, 2 * Math.PI),
        (a.fillStyle = "rgba(255, 255, 255, 0.94)"),
        a.fill(),
        a.restore());
    },
    C = (c) => {
      let S = Math.max(5, c * 0.14);
      (a.save(),
        a.beginPath(),
        a.arc(n.circleX, n.circleY, c, 0, 2 * Math.PI, !0),
        (a.strokeStyle = "rgba(255, 255, 255, 0.24)"),
        (a.lineWidth = S * 2.2),
        a.stroke(),
        a.beginPath(),
        a.arc(n.circleX, n.circleY, c, 0, 2 * Math.PI, !0),
        (a.strokeStyle = "rgba(255, 255, 255, 0.66)"),
        (a.lineWidth = S),
        a.stroke(),
        a.beginPath(),
        a.arc(n.circleX, n.circleY, c, 0, 2 * Math.PI, !0),
        (a.strokeStyle = "rgba(255, 255, 255, 0.94)"),
        (a.lineWidth = Math.max(2, S * 0.52)),
        a.stroke(),
        a.restore());
    },
    h = (c, S, x, P) => {
      (a.save(),
        a.translate(S, x),
        a.rotate(P),
        a.fillText(c, 0, 0),
        a.restore());
    },
    m = (c) => {
      let S = Math.max(10, Math.min(16, c.width * 0.02)),
        x = Math.max(10, Math.min(13, c.width * 0.011)),
        P = c.height * 0.5;
      (a.save(),
        (a.fillStyle = "rgba(148, 163, 184, 0.82)"),
        (a.font = `600 ${x}px 'Inter', 'Segoe UI', 'Helvetica Neue', Arial, sans-serif`),
        (a.textAlign = "center"),
        (a.textBaseline = "middle"),
        n.isRightEye
          ? (h("Temporal", S, P, -Math.PI / 2),
            h("Nasal", c.width - S, P, Math.PI / 2))
          : (h("Nasal", S, P, -Math.PI / 2),
            h("Temporal", c.width - S, P, Math.PI / 2)),
        a.restore());
    };
  function d() {
    let c = s();
    if (!c) return;
    I(c);
    let S = b(c.width, c.height);
    (a.clearRect(0, 0, c.width, c.height),
      (a.fillStyle = "#030406"),
      a.fillRect(0, 0, c.width, c.height),
      i(c, S),
      L(S),
      C(S),
      m(c));
  }
  function t() {
    n.drawFrameId === null &&
      (n.drawFrameId = y(() => {
        ((n.drawFrameId = null), d());
      }));
  }
  let k = (c) => {
      let S = Math.max(8, c * 0.24),
        x = _(n.bgOffsetX, -S, S),
        P = _(n.bgOffsetY, -S, S);
      (x !== n.bgOffsetX && ((n.velocityX *= -0.35), (n.bgOffsetX = x)),
        P !== n.bgOffsetY && ((n.velocityY *= -0.35), (n.bgOffsetY = P)));
    },
    l = (c) => {
      if (
        ((n.motionFrameId = null),
        !n.isActive || n.isSubmitted || r.hidden || e.offsetParent === null)
      )
        return;
      let S = typeof c == "number" ? c : Date.now();
      if (S - n.lastMotionAt >= et) {
        let x = s();
        if (x) {
          let P = b(x.width, x.height),
            W = n.isDragging ? 0.14 : 0.46;
          ((n.velocityX += (Math.random() - 0.5) * W),
            (n.velocityY += (Math.random() - 0.5) * W),
            (n.velocityX *= 0.86),
            (n.velocityY *= 0.86),
            (n.bgOffsetX += n.velocityX),
            (n.bgOffsetY += n.velocityY),
            k(P),
            t());
        }
        n.lastMotionAt = S;
      }
      n.motionFrameId = y(l);
    },
    g = () => {
      n.motionFrameId !== null ||
        n.isSubmitted ||
        ((n.isActive = !0), (n.motionFrameId = y(l)));
    },
    O = () => {
      ((n.isActive = !1),
        n.motionFrameId !== null &&
          (N(n.motionFrameId), (n.motionFrameId = null)));
    },
    R = (c) => {
      let S = s();
      if (!S) return;
      let x = r.getBoundingClientRect(),
        P = b(S.width, S.height),
        W = c.clientX - x.left,
        V = c.clientY - x.top,
        T = Math.max(18, Math.min(64, P * 0.12));
      ((n.circleX = W), (n.circleY = V - P - T), I(S), t());
    };
  (r.addEventListener("pointerdown", (c) => {
    n.isSubmitted ||
      (c.button !== void 0 && c.button !== 0) ||
      (c.preventDefault(),
      (n.isDragging = !0),
      (n.activePointerId = c.pointerId),
      (n.velocityX = 0),
      (n.velocityY = 0),
      r.setPointerCapture?.(c.pointerId),
      (r.style.cursor = "none"),
      R(c));
  }),
    r.addEventListener("pointermove", (c) => {
      !n.isDragging ||
        c.pointerId !== n.activePointerId ||
        (c.preventDefault(), R(c));
    }));
  let H = (c) => {
    n.isDragging &&
      ((c &&
        typeof c.pointerId == "number" &&
        c.pointerId !== n.activePointerId) ||
        (c &&
          typeof c.pointerId == "number" &&
          r.hasPointerCapture?.(c.pointerId) &&
          r.releasePointerCapture(c.pointerId),
        (n.isDragging = !1),
        (n.activePointerId = null),
        (r.style.cursor = "crosshair")));
  };
  return (
    r.addEventListener("pointerup", H),
    r.addEventListener("pointercancel", H),
    r.addEventListener("pointerleave", (c) => {
      c.pointerType === "mouse" && H(c);
    }),
    window.addEventListener("pointerup", H),
    window.addEventListener("resize", t),
    typeof ResizeObserver < "u" &&
      ((n.resizeObserver = new ResizeObserver(() => {
        t();
      })),
      n.resizeObserver.observe(o)),
    p.addEventListener("load", () => {
      (E(), g());
    }),
    p.addEventListener("error", () => {
      t();
    }),
    {
      setCase({ src: c, isRightEye: S }) {
        ((n.isRightEye = !!S),
          (r.dataset.eye = n.isRightEye ? "right" : "left"),
          c && n.imageSrc !== c ? ((n.imageSrc = c), (p.src = c), E()) : t(),
          n.isSubmitted || ((r.hidden = !1), g()));
      },
      setSubmitted(c) {
        ((n.isSubmitted = !!c),
          (r.hidden = n.isSubmitted),
          n.isSubmitted ? O() : (g(), t()));
      },
      resetPosition: E,
    }
  );
}
function gt() {
  let e = document.getElementById("diabeticCaseQuizPage");
  if (!e || e.dataset.inited === "1") return;
  let o = e.querySelector("#diabeticCaseQuizTitle"),
    r = e.querySelector("#diabeticCaseQuizStage"),
    a = e.querySelector("#diabeticCaseQuizProgressLabel"),
    p = e.querySelector("#diabeticCaseQuizPatientInfo"),
    n = e.querySelector("#diabeticCaseQuizImage"),
    y = e.querySelector("#diabeticCaseQuizSightCanvas"),
    N = e.querySelector("#diabeticCaseQuizQuestion"),
    _ = e.querySelector("#diabeticCaseQuizQuestionHint"),
    s = e.querySelector("#diabeticCaseQuizOptions"),
    b = e.querySelector("#diabeticCaseQuizFeedback"),
    I = Array.from(e.querySelectorAll("[data-diabetic-case-question]")),
    E = e.querySelector("#diabeticCaseQuizCaseSummary"),
    v = e.querySelector("#diabeticCaseQuizSubmit"),
    i = e.querySelector("#diabeticCaseQuizIntroModal"),
    L = e.querySelector("#diabeticCaseQuizResultsModal"),
    C = e.querySelector("#diabeticCaseQuizResultsSummary"),
    h = e.querySelector("#diabeticCaseQuizResultsList"),
    m = e.querySelectorAll("[data-diabetic-case-intro-close]"),
    d = e.querySelectorAll("[data-diabetic-case-results-close]");
  if (
    !o ||
    !r ||
    !a ||
    !p ||
    !n ||
    !y ||
    !N ||
    !_ ||
    !s ||
    !b ||
    I.length !== 3 ||
    !E ||
    !v ||
    !i ||
    !L ||
    !C ||
    !h
  )
    return;
  ((e.dataset.inited = "1"),
    (n.style.width = "100%"),
    (n.style.height = "auto"),
    (n.style.objectFit = "contain"));
  let t = {
      caseIndex: 0,
      questionIndex: 0,
      selections: [],
      caseResults: [],
      submitted: !1,
      isComplete: !1,
      renderedCaseIndex: -1,
    },
    k = ht({ page: e, stage: r, canvas: y }),
    l = Se.reduce((f, D) => f + D.questions.length, 0),
    g = () => Se[t.caseIndex],
    O = () => g()?.questions[t.questionIndex] || null,
    R = () => g().questions.map(() => new Set()),
    H = () => (
      t.selections[t.questionIndex] ||
        (t.selections[t.questionIndex] = new Set()),
      t.selections[t.questionIndex]
    ),
    c = () => t.caseResults[t.caseIndex] || null,
    S = () => c()?.answers[t.questionIndex] || null,
    x = (f, D) => {
      ((f.hidden = !D),
        f.classList.toggle("is-open", D),
        f.setAttribute("aria-hidden", D ? "false" : "true"));
    },
    P = () => x(L, !0),
    W = () => x(L, !1),
    V = () => x(i, !0),
    T = () => x(i, !1),
    J = (f, D) =>
      D.length !== f.correct.length
        ? !1
        : f.correct.every((z) => D.includes(z)),
    j = () => g().questions.every((f, D) => t.selections[D]?.size > 0),
    te = () => {
      if (t.submitted) {
        ((v.disabled = !1),
          (v.textContent =
            t.caseIndex === Se.length - 1
              ? $("See results")
              : $("Next case >")));
        return;
      }
      ((v.textContent = $("Submit")), (v.disabled = !j()));
    },
    ie = () => {
      let f = t.caseResults.reduce((z, X) => z + (X?.answers?.length || 0), 0),
        D = t.isComplete ? 100 : (f / l) * 90;
      me("diabeticCaseQuizPage", D);
    },
    G = () => {
      a.textContent = `${$("Quiz")} ${t.questionIndex + 1} ${$("of")} 3`;
    },
    oe = () => {
      let f = g();
      ((p.innerHTML = ""),
        f.patientInfo.forEach((D) => {
          let z = document.createElement("p"),
            X = $(D);
          if (X !== D) {
            ((z.textContent = X), p.appendChild(z));
            return;
          }
          let [U, ...ee] = D.split(":"),
            Z = ee.join(":").trim();
          if (U && Z) {
            let re = document.createElement("strong");
            re.textContent = `${$(U)}:`;
            let ue = document.createElement("span");
            ((ue.textContent = $(Z)), z.appendChild(re), z.appendChild(ue));
          } else z.textContent = X;
          p.appendChild(z);
        }));
    },
    we = () => {
      ((o.textContent = `${$("Case")} (${t.caseIndex + 1}/${Se.length})`),
        oe());
    },
    q = () => {
      let f = g(),
        D = `/images/quiz/workshop/DR/Cases/${f.image}`;
      (t.renderedCaseIndex !== t.caseIndex &&
        ((n.src = D),
        (n.alt = `${$("Diabetic retinopathy case")} ${t.caseIndex + 1}`),
        (r.dataset.caseId = f.id),
        (r.dataset.caseImage = f.image.replace(/\.[^.]+$/, "")),
        (r.dataset.overlay = "sight-hole"),
        (r.dataset.disc = f.disc),
        k.setCase({ src: D, isRightEye: f.disc === "Rdisc" }),
        (t.renderedCaseIndex = t.caseIndex)),
        k.setSubmitted(t.submitted));
    },
    u = () => {
      let f = O(),
        D = H();
      ((s.innerHTML = ""),
        f.options.forEach((z, X) => {
          let U = `diabeticCaseQuiz-${g().id}-${t.questionIndex}-${X}`,
            ee = document.createElement("label");
          ee.className = "diabetic-case-quiz__option";
          let Z = document.createElement("input");
          ((Z.type = f.type === "multi" ? "checkbox" : "radio"),
            (Z.name = `diabeticCaseQuiz-${g().id}-${t.questionIndex}`),
            (Z.value = z),
            (Z.id = U),
            (Z.checked = D.has(z)),
            (Z.disabled = t.submitted));
          let re = document.createElement("span");
          if (
            ((re.className = "diabetic-case-quiz__option-text"),
            (re.textContent = $(z)),
            t.submitted)
          ) {
            let ue = f.correct.includes(z),
              pe = D.has(z);
            ue
              ? ee.classList.add("is-correct")
              : pe && ee.classList.add("is-wrong");
          }
          (Z.addEventListener("change", () => {
            (f.type === "single"
              ? (t.selections[t.questionIndex] = new Set([z]))
              : Z.checked
                ? D.add(z)
                : D.delete(z),
              G(),
              te());
          }),
            ee.setAttribute("for", U),
            ee.appendChild(Z),
            ee.appendChild(re),
            s.appendChild(ee));
        }));
    },
    w = () => {
      let f = O();
      ((N.textContent = $(f.prompt)),
        (_.textContent =
          f.type === "multi" ? $("More than one answer may be correct.") : ""),
        (_.hidden = f.type !== "multi"),
        u());
    },
    A = () => {
      if (!t.submitted) {
        ((b.hidden = !0),
          (b.textContent = ""),
          (b.className = "diabetic-case-quiz__feedback"));
        return;
      }
      let f = S();
      f &&
        ((b.hidden = !1),
        (b.className = `diabetic-case-quiz__feedback ${f.correct ? "is-correct" : "is-wrong"}`),
        (b.textContent = f.correct
          ? $("Correct.")
          : `${$("Correct answer:")} ${f.correctAnswers.map((D) => $(D)).join("; ")}`));
    },
    M = () => {
      I.forEach((f, D) => {
        let z = String.fromCharCode(65 + D),
          X = `${t.caseIndex + 1}${z}`,
          U = D === t.questionIndex;
        ((f.textContent = X),
          f.setAttribute(
            "aria-label",
            `${$("Case")} ${t.caseIndex + 1}, ${$("Quiz")} ${z}`,
          ),
          f.setAttribute("aria-pressed", U ? "true" : "false"),
          f.classList.toggle("is-active", U));
      });
    },
    Q = () => {
      let f = c();
      if (
        ((E.hidden = !t.submitted || !f),
        (E.className = "diabetic-case-quiz__case-summary"),
        !f)
      ) {
        E.textContent = "";
        return;
      }
      let D = f.answers.length || g().questions.length,
        z = f.correctCount === D;
      (E.classList.add(z ? "is-correct" : "is-wrong"),
        (E.textContent = `${$("Case score:")} ${f.correctCount} ${$("of")} ${D} ${$("correct.")}`));
    },
    B = () => {
      (G(), we(), q(), w(), A(), M(), Q(), te(), ie());
    },
    F = () => {
      let f = t.caseResults.flatMap((z) => z?.answers || []),
        D = f.filter((z) => z.correct).length;
      ((C.textContent = `${$("You answered")} ${D} ${$("out of")} ${l} ${$("correctly.")}`),
        (h.innerHTML = ""),
        f.forEach((z, X) => {
          let U = document.createElement("div");
          U.className = "retinal-structure-tap__results-row";
          let ee = document.createElement("span");
          ((ee.className = "retinal-structure-tap__results-number"),
            (ee.textContent = String(X + 1)));
          let Z = document.createElement("div");
          Z.className = "retinal-structure-tap__results-body";
          let re = document.createElement("p");
          ((re.className = "retinal-structure-tap__results-title"),
            (re.textContent = `${$("Case")} ${z.caseNumber}: ${$(z.label)}`));
          let ue = document.createElement("p");
          ((ue.className = "retinal-structure-tap__results-copy"),
            (ue.textContent = `${$("Answer:")} ${z.correctAnswers.map((Ve) => $(Ve)).join("; ")}`));
          let pe = document.createElement("span");
          ((pe.className = "retinal-structure-tap__results-status"),
            z.correct
              ? (pe.classList.add("is-correct"),
                (pe.textContent = $("Correct")))
              : (pe.classList.add("is-wrong"), (pe.textContent = $("Wrong"))),
            Z.appendChild(re),
            Z.appendChild(ue),
            U.appendChild(ee),
            U.appendChild(Z),
            U.appendChild(pe),
            h.appendChild(U));
        }));
    },
    Y = () => {
      ((t.selections = R()), (t.submitted = !1));
    },
    K = () => {
      ((t.caseIndex = 0),
        (t.questionIndex = 0),
        (t.caseResults = []),
        (t.isComplete = !1),
        (t.renderedCaseIndex = -1),
        Y(),
        T(),
        W(),
        B());
    };
  I.forEach((f, D) => {
    f.addEventListener("click", () => {
      t.questionIndex !== D && ((t.questionIndex = D), B());
    });
  });
  let de = () => {
      if (!j()) return;
      let D = g().questions.map((z, X) => {
        let U = [...(t.selections[X] || new Set())];
        return {
          caseNumber: t.caseIndex + 1,
          label: z.label,
          selected: U,
          correctAnswers: z.correct,
          correct: J(z, U),
        };
      });
      ((t.caseResults[t.caseIndex] = {
        caseNumber: t.caseIndex + 1,
        answers: D,
        correctCount: D.filter((z) => z.correct).length,
      }),
        (t.submitted = !0),
        B());
    },
    se = () => {
      if (t.caseIndex === Se.length - 1) {
        ((t.isComplete = !0), ie(), F(), P());
        return;
      }
      ((t.caseIndex += 1), (t.questionIndex = 0), Y(), B());
      try {
        window.scrollTo(0, 0);
      } catch {}
    };
  (v.addEventListener("click", () => {
    if (t.submitted) {
      se();
      return;
    }
    de();
  }),
    m.forEach((f) => {
      f.dataset.wired !== "1" &&
        ((f.dataset.wired = "1"), f.addEventListener("click", T));
    }),
    d.forEach((f) => {
      f.dataset.wired !== "1" &&
        ((f.dataset.wired = "1"), f.addEventListener("click", W));
    }),
    i.addEventListener("click", (f) => {
      f.target === i && T();
    }),
    L.addEventListener("click", (f) => {
      f.target === L && W();
    }),
    e.dataset.shownWired !== "1" &&
      ((e.dataset.shownWired = "1"),
      document.addEventListener("page:shown", (f) => {
        f.detail?.id === "diabeticCaseQuizPage" && (K(), V());
      })));
  let ne = () =>
    window.getComputedStyle(e).display !== "none" ? (V(), !0) : !1;
  (K(),
    window.requestAnimationFrame(() => {
      ne() || window.setTimeout(ne, 250);
    }));
}
function mt() {
  let e = document.getElementById("diabeticReviewVideoQuizPage");
  if (!e || e.dataset.inited === "1") return;
  let o = e.querySelector("#reviewVideoQuizPlayer"),
    r = e.querySelector("#reviewVideoQuizProgress"),
    a = e.querySelector("#reviewVideoQuizProgressLabel"),
    p = e.querySelector("#reviewVideoQuizStatus"),
    n = e.querySelector("#reviewVideoQuizWaiting"),
    y = e.querySelector("#reviewVideoQuizWaitingLabel"),
    N = e.querySelector("#reviewVideoQuizWaitingTitle"),
    _ = e.querySelector("#reviewVideoQuizWaitingCopy"),
    s = e.querySelector("#reviewVideoQuizQuestionCard"),
    b = e.querySelector("#reviewVideoQuizQuestionLabel"),
    I = e.querySelector("#reviewVideoQuizQuestion"),
    E = e.querySelector("#reviewVideoQuizOptions"),
    v = e.querySelector("#reviewVideoQuizFeedback"),
    i = e.querySelector("#reviewVideoQuizFeedbackTitle"),
    L = e.querySelector("#reviewVideoQuizFeedbackCopy"),
    C = e.querySelector("#reviewVideoQuizAction"),
    h = e.querySelector("#reviewVideoQuizComplete"),
    m = e.querySelector("#reviewVideoQuizSummary"),
    d = e.querySelector("#reviewVideoQuizReplay");
  if (
    !o ||
    !r ||
    !a ||
    !p ||
    !n ||
    !y ||
    !N ||
    !_ ||
    !s ||
    !b ||
    !I ||
    !E ||
    !v ||
    !i ||
    !L ||
    !C ||
    !h ||
    !m ||
    !d
  )
    return;
  e.dataset.inited = "1";
  let t = {
      nextIndex: 0,
      activeIndex: null,
      selectedIndex: null,
      answers: [],
      hasCheckedCurrent: !1,
      isComplete: !1,
    },
    k = (T) => le[T] || null,
    l = (T, J = "") => {
      ((p.textContent = T),
        (p.className = "review-video-quiz__status"),
        J && p.classList.add(J));
    },
    g = () => t.answers.filter((T) => T?.correct).length,
    O = () => {
      if (
        ((r.innerHTML = ""),
        le.forEach((J, j) => {
          let te = document.createElement("span");
          ((te.className = "review-video-quiz__progress-step"),
            t.answers[j]
              ? te.classList.add("is-complete")
              : (t.activeIndex === j || t.nextIndex === j) &&
                te.classList.add("is-active"),
            r.appendChild(te));
        }),
        t.isComplete)
      ) {
        a.textContent = "Review complete";
        return;
      }
      let T = t.activeIndex ?? Math.min(t.nextIndex, le.length - 1);
      a.textContent = `Question ${T + 1} of ${le.length}`;
    },
    R = () => {
      let T = t.answers.filter(Boolean).length,
        J = t.isComplete ? 100 : (T / le.length) * 90;
      me("diabeticReviewVideoQuizPage", J);
    },
    H = () => {
      if (t.nextIndex === 0 && o.currentTime < 0.25) {
        ((y.textContent = "Video prompt"),
          (N.textContent = "Start the video"),
          (_.textContent =
            "Press play to begin. The video will pause automatically for each review question."));
        return;
      }
      ((y.textContent = "Keep watching"),
        (N.textContent = "Continue to the next pause"),
        (_.textContent =
          "The video will stop again when the next question is ready."));
    },
    c = (T) => {
      ((E.innerHTML = ""),
        T.options.forEach((J, j) => {
          let te = `reviewVideoQuizOption-${T.id}-${j}`,
            ie = document.createElement("label");
          ie.className = "review-video-quiz__option";
          let G = document.createElement("input");
          ((G.type = "radio"),
            (G.name = "reviewVideoQuizAnswer"),
            (G.id = te),
            (G.value = String(j)),
            (G.checked = t.selectedIndex === j),
            (G.disabled = t.hasCheckedCurrent),
            G.addEventListener("change", () => {
              t.hasCheckedCurrent || ((t.selectedIndex = j), (C.disabled = !1));
            }));
          let oe = document.createElement("span");
          ((oe.className = "review-video-quiz__option-text"),
            (oe.textContent = J),
            t.hasCheckedCurrent && j === T.correctIndex
              ? ie.classList.add("is-correct")
              : t.hasCheckedCurrent &&
                t.selectedIndex === j &&
                j !== T.correctIndex &&
                ie.classList.add("is-wrong"),
            ie.appendChild(G),
            ie.appendChild(oe),
            E.appendChild(ie));
        }));
    },
    S = () => {
      let T = k(t.activeIndex);
      T &&
        ((b.textContent = `Question ${t.activeIndex + 1}`),
        (I.textContent = T.question),
        c(T),
        (v.hidden = !t.hasCheckedCurrent),
        (v.className = "review-video-quiz__feedback"),
        t.hasCheckedCurrent &&
          (t.answers[t.activeIndex]?.correct
            ? (v.classList.add("is-correct"),
              (i.textContent = "Correct"),
              (L.textContent = T.explanation))
            : (v.classList.add("is-wrong"),
              (i.textContent = `Correct answer: ${T.options[T.correctIndex]}`),
              (L.textContent = T.explanation))),
        (C.disabled = !t.hasCheckedCurrent && t.selectedIndex == null),
        (C.textContent = t.hasCheckedCurrent
          ? t.activeIndex === le.length - 1
            ? "See results"
            : "Next >"
          : "Check answer"));
    },
    x = () => {
      m.textContent = `You answered ${g()} out of ${le.length} correctly.`;
    },
    P = () => {
      if (
        (O(),
        R(),
        (n.hidden = t.activeIndex !== null || t.isComplete),
        (s.hidden = t.activeIndex === null),
        (h.hidden = !t.isComplete),
        !t.isComplete && t.activeIndex === null && H(),
        t.activeIndex !== null)
      ) {
        (S(), l("Video paused for a question.", "is-alert"));
        return;
      }
      if (t.isComplete) {
        (x(),
          l(
            "Review complete. Replay the clip if you want to go through it again.",
            "is-complete",
          ));
        return;
      }
      l(
        t.nextIndex === 0 && o.currentTime < 0.25
          ? "Press play. The video will pause when a question appears."
          : "Continue the video to reach the next question.",
      );
    },
    W = () => {
      if (t.isComplete || t.activeIndex !== null) return;
      let T = k(t.nextIndex);
      !T ||
        o.currentTime + 0.05 < T.pauseAt ||
        (o.pause(),
        (t.activeIndex = t.nextIndex),
        (t.selectedIndex = null),
        (t.hasCheckedCurrent = !1),
        P());
    },
    V = () => {
      ((t.nextIndex = 0),
        (t.activeIndex = null),
        (t.selectedIndex = null),
        (t.answers = []),
        (t.hasCheckedCurrent = !1),
        (t.isComplete = !1));
      try {
        o.pause();
      } catch {}
      try {
        o.currentTime = 0;
      } catch {}
      P();
    };
  (C.addEventListener("click", () => {
    let T = k(t.activeIndex);
    if (T) {
      if (!t.hasCheckedCurrent) {
        if (t.selectedIndex == null) return;
        ((t.answers[t.activeIndex] = {
          selectedIndex: t.selectedIndex,
          correct: t.selectedIndex === T.correctIndex,
        }),
          (t.hasCheckedCurrent = !0),
          P());
        return;
      }
      if (t.activeIndex < le.length - 1) {
        ((t.nextIndex = t.activeIndex + 1),
          (t.activeIndex = null),
          (t.selectedIndex = null),
          (t.hasCheckedCurrent = !1),
          P());
        try {
          window.scrollTo(0, 0);
        } catch {}
        o.play()?.catch?.(() => {});
        return;
      }
      ((t.nextIndex = le.length),
        (t.activeIndex = null),
        (t.selectedIndex = null),
        (t.hasCheckedCurrent = !1),
        (t.isComplete = !0));
      try {
        o.pause();
      } catch {}
      P();
    }
  }),
    d.addEventListener("click", () => {
      V();
    }),
    o.addEventListener("timeupdate", W),
    o.addEventListener("seeked", W),
    o.addEventListener("play", () => {
      if (t.activeIndex === null) return;
      let T = () => {
        try {
          o.pause();
        } catch {}
      };
      typeof window.requestAnimationFrame == "function"
        ? window.requestAnimationFrame(T)
        : window.setTimeout(T, 0);
    }),
    e.dataset.shownWired !== "1" &&
      ((e.dataset.shownWired = "1"),
      document.addEventListener("page:shown", (T) => {
        T.detail?.id === "diabeticReviewVideoQuizPage" && V();
      })),
    V());
}
function ft() {
  let e = document.getElementById("diabeticFindingsGroupTwoPage");
  if (!e || e.dataset.inited === "1") return;
  let o = e.querySelector("#findingsGroupQuizBank"),
    r = e.querySelector("#findingsGroupQuizSubmit"),
    a = e.querySelector("#findingsGroupQuizFeedback"),
    p = Array.from(e.querySelectorAll(".findings-group-quiz__zone-body"));
  if (!o || !r || !a || p.length !== 2) return;
  e.dataset.inited = "1";
  let n = new Map(),
    y = {
      chip: null,
      pointerId: null,
      startX: 0,
      startY: 0,
      hoverZone: null,
      cleanup: null,
    },
    N = (h = "", m = "") => {
      ((a.textContent = h),
        (a.className = "findings-group-quiz__feedback"),
        m && a.classList.add(m));
    },
    _ = () => {
      let h = fe.filter((d) => n.get(d.id) && n.get(d.id) !== "bank").length,
        m = r.disabled ? 100 : (h / fe.length) * 90;
      me("diabeticFindingsGroupTwoPage", m);
    },
    s = () => {
      (p.forEach((h) => {
        let m = !!h.querySelector(".findings-group-quiz__chip");
        h.classList.toggle("is-filled", m);
      }),
        _());
    },
    b = () => {
      (e
        .querySelectorAll(".findings-group-quiz__zone")
        .forEach((h) => h.classList.remove("is-over")),
        (y.hoverZone = null));
    },
    I = (h, m) =>
      Array.from(e.querySelectorAll(".findings-group-quiz__zone")).find((t) => {
        let k = t.querySelector(".findings-group-quiz__zone-body");
        if (!k) return !1;
        let l = k.getBoundingClientRect();
        return h >= l.left && h <= l.right && m >= l.top && m <= l.bottom;
      }) || null,
    E = (h, m) => {
      let d = I(h, m);
      return (
        y.hoverZone === d ||
          (b(), d && (d.classList.add("is-over"), (y.hoverZone = d))),
        d
      );
    },
    v = (h, m) => {
      let d = h.getAttribute("data-item-id");
      if (!d) return;
      if (m === "bank") {
        (o.appendChild(h), n.set(d, "bank"), s());
        return;
      }
      let t = e.querySelector(
        `.findings-group-quiz__zone[data-zone="${m}"] .findings-group-quiz__zone-body`,
      );
      t && (t.appendChild(h), n.set(d, m), s());
    },
    i = (h) => {
      let m = document.createElement("button");
      return (
        (m.type = "button"),
        (m.className = "findings-group-quiz__chip"),
        (m.textContent = h.label),
        m.setAttribute("data-item-id", h.id),
        m.setAttribute("data-correct-zone", h.zone),
        m.addEventListener("pointerdown", (d) => {
          if (r.disabled) return;
          (d.preventDefault(),
            (y.chip = m),
            (y.pointerId = d.pointerId),
            (y.startX = d.clientX),
            (y.startY = d.clientY),
            (m.style.zIndex = "5"),
            (m.style.position = "relative"),
            (m.style.transform = "translate(0, 0)"),
            m.classList.add("is-dragging"));
          try {
            m.setPointerCapture(d.pointerId);
          } catch {}
          let t = (g) => {
              if (y.pointerId !== g.pointerId || y.chip !== m || r.disabled)
                return;
              let O = g.clientX - y.startX,
                R = g.clientY - y.startY;
              ((m.style.transform = `translate(${O}px, ${R}px)`),
                E(g.clientX, g.clientY));
            },
            k = (g) => {
              if (y.pointerId !== g.pointerId || y.chip !== m) return;
              ((m.style.transform = ""),
                (m.style.zIndex = ""),
                (m.style.position = ""),
                m.classList.remove("is-dragging"));
              let O = E(g.clientX, g.clientY);
              if (O) v(m, O.getAttribute("data-zone"));
              else {
                let R = o.getBoundingClientRect();
                g.clientX >= R.left &&
                  g.clientX <= R.right &&
                  g.clientY >= R.top &&
                  g.clientY <= R.bottom &&
                  v(m, "bank");
              }
              b();
              try {
                m.releasePointerCapture(g.pointerId);
              } catch {}
              (y.cleanup?.(),
                (y.cleanup = null),
                (y.chip = null),
                (y.pointerId = null));
            },
            l = (g) => {
              if (!(y.pointerId !== g.pointerId || y.chip !== m)) {
                ((m.style.transform = ""),
                  (m.style.zIndex = ""),
                  (m.style.position = ""),
                  m.classList.remove("is-dragging"),
                  b());
                try {
                  m.releasePointerCapture(g.pointerId);
                } catch {}
                (y.cleanup?.(),
                  (y.cleanup = null),
                  (y.chip = null),
                  (y.pointerId = null));
              }
            };
          (window.addEventListener("pointermove", t),
            window.addEventListener("pointerup", k),
            window.addEventListener("pointercancel", l),
            (y.cleanup = () => {
              (window.removeEventListener("pointermove", t),
                window.removeEventListener("pointerup", k),
                window.removeEventListener("pointercancel", l));
            }));
        }),
        m
      );
    },
    L = (h, m) => {
      (h.addEventListener("dragover", (d) => {
        r.disabled || d.preventDefault();
      }),
        h.addEventListener("drop", (d) => {
          if (r.disabled) return;
          d.preventDefault();
          let t = d.dataTransfer?.getData("text/plain");
          if (!t) return;
          let k = e.querySelector(
            `.findings-group-quiz__chip[data-item-id="${t}"]`,
          );
          k &&
            (v(k, m),
            e
              .querySelectorAll(".findings-group-quiz__zone")
              .forEach((l) => l.classList.remove("is-over")));
        }));
    };
  (p.forEach((h) => {
    let m = h.closest(".findings-group-quiz__zone"),
      d = m?.getAttribute("data-zone");
    !m ||
      !d ||
      (L(h, d),
      h.addEventListener("dragenter", () => m.classList.add("is-over")),
      h.addEventListener("dragleave", () => m.classList.remove("is-over")),
      h.addEventListener("drop", () => m.classList.remove("is-over")));
  }),
    L(o, "bank"));
  let C = () => {
    (y.cleanup?.(),
      (y.cleanup = null),
      (y.chip = null),
      (y.pointerId = null),
      b(),
      n.clear(),
      (o.innerHTML = ""),
      p.forEach((h) => {
        h.innerHTML =
          '<span class="findings-group-quiz__zone-placeholder">Drag findings here</span>';
      }),
      ke(fe).forEach((h) => {
        (n.set(h.id, "bank"), o.appendChild(i(h)));
      }),
      (r.disabled = !1),
      N(""),
      s());
  };
  (r.addEventListener("click", () => {
    if (fe.filter((d) => n.get(d.id) === "bank").length > 0) {
      N("Place all findings before submitting.", "is-warning");
      return;
    }
    let m = 0;
    (fe.forEach((d) => {
      let t = e.querySelector(
        `.findings-group-quiz__chip[data-item-id="${d.id}"]`,
      );
      if (!t) return;
      (t.classList.remove("is-correct", "is-wrong"),
        n.get(d.id) === d.zone
          ? ((m += 1), t.classList.add("is-correct"))
          : t.classList.add("is-wrong"));
    }),
      (r.disabled = !0),
      m === fe.length
        ? N("Correct!", "is-success")
        : N(`You got ${m} out of ${fe.length} correct.`, "is-warning"));
  }),
    e.dataset.shownWired !== "1" &&
      ((e.dataset.shownWired = "1"),
      document.addEventListener("page:shown", (h) => {
        h.detail?.id === "diabeticFindingsGroupTwoPage" && C();
      })),
    C());
}
function yt() {
  let e = document.getElementById("diabeticConnectQuizPage");
  if (!e || e.dataset.inited === "1") return;
  let o = e.querySelector("#connectQuizHint"),
    r = e.querySelector("#connectQuizBoard"),
    a = e.querySelector("#connectQuizDiagnoses"),
    p = e.querySelector("#connectQuizAnswers"),
    n = e.querySelector("#connectQuizSummary"),
    y = e.querySelector("#connectQuizAnswerList"),
    N = e.querySelector("#connectQuizSubmit"),
    _ = e.querySelector("#connectQuizFeedback");
  if (!o || !r || !a || !p || !n || !y || !N || !_) return;
  e.dataset.inited = "1";
  let s = {
      findingOrder: [],
      activeDiagnosisId: null,
      assignments: new Map(),
      findingOwners: new Map(),
      submitted: !1,
    },
    b = (l = "", g = "") => {
      ((_.textContent = l),
        (_.className = "connect-quiz__feedback"),
        g && _.classList.add(g));
    },
    I = (l) => he.find((g) => g.diagnosisId === l) || null,
    E = (l) => s.assignments.get(l) || [],
    v = (l) => {
      let g = s.findingOwners.get(l);
      if (!g) return;
      let O = E(g).filter((R) => R !== l);
      (s.assignments.set(g, O), s.findingOwners.delete(l));
    },
    i = (l, g) => {
      v(l);
      let O = [...E(g), l];
      (s.assignments.set(g, O), s.findingOwners.set(l, g));
    },
    L = () =>
      he.filter((l) => {
        let g = E(l.diagnosisId),
          O = new Set(l.findings.map((R) => R.id));
        return g.length === l.findings.length && g.every((R) => O.has(R));
      }).length,
    C = () => {
      let l = s.findingOwners.size,
        g = s.submitted ? 100 : (l / _e.length) * 90;
      me("diabeticConnectQuizPage", g);
    },
    h = () => {
      ((y.innerHTML = ""),
        he.forEach((l) => {
          let g = document.createElement("article");
          g.className = `connect-quiz__answer-card connect-quiz__answer-card--${l.tone}`;
          let O = document.createElement("p");
          ((O.className = "connect-quiz__answer-title"),
            (O.textContent = l.diagnosis));
          let R = document.createElement("div");
          R.className = "connect-quiz__answer-findings";
          let H = document.createElement("p");
          ((H.className = "connect-quiz__answer-kicker"),
            (H.textContent = "Your findings"),
            R.appendChild(H));
          let c = E(l.diagnosisId),
            S = new Set(l.findings.map((P) => P.id)),
            x = c.length === l.findings.length && c.every((P) => S.has(P));
          if (
            (c.forEach((P) => {
              let W = Oe.get(P);
              if (!W) return;
              let V = document.createElement("p");
              ((V.className = "connect-quiz__answer-line"),
                (V.textContent = W.label),
                V.classList.add(S.has(P) ? "is-correct" : "is-wrong"),
                R.appendChild(V));
            }),
            !c.length)
          ) {
            let P = document.createElement("p");
            ((P.className = "connect-quiz__answer-line is-empty"),
              (P.textContent = "No findings selected."),
              R.appendChild(P));
          }
          if ((g.appendChild(O), g.appendChild(R), !x)) {
            let P = document.createElement("div");
            P.className = "connect-quiz__correct-block";
            let W = document.createElement("p");
            ((W.className = "connect-quiz__answer-kicker"),
              (W.textContent = "Correct findings"),
              P.appendChild(W),
              l.findings.forEach((V) => {
                let T = document.createElement("p");
                ((T.className = "connect-quiz__correct-line"),
                  (T.textContent = V.label),
                  P.appendChild(T));
              }),
              g.appendChild(P));
          }
          y.appendChild(g);
        }),
        (n.textContent = `You connected ${L()} out of ${he.length} diagnoses correctly.`));
    },
    m = () => {
      ((a.innerHTML = ""),
        he.forEach((l) => {
          let g = document.createElement("button");
          ((g.type = "button"),
            (g.className = `connect-quiz__diagnosis connect-quiz__diagnosis--${l.tone}`),
            s.activeDiagnosisId === l.diagnosisId &&
              !s.submitted &&
              g.classList.add("is-active"),
            E(l.diagnosisId).length === l.findings.length &&
              g.classList.add("is-complete"),
            g.setAttribute(
              "aria-pressed",
              s.activeDiagnosisId === l.diagnosisId ? "true" : "false",
            ));
          let O = document.createElement("span");
          ((O.className = "connect-quiz__diagnosis-label"),
            (O.textContent = l.diagnosis));
          let R = document.createElement("span");
          ((R.className = "connect-quiz__diagnosis-toggle"),
            R.setAttribute("aria-hidden", "true"));
          let H = document.createElement("span");
          ((H.className = "connect-quiz__diagnosis-thumb"),
            R.appendChild(H),
            g.appendChild(O),
            g.appendChild(R),
            g.addEventListener("click", () => {
              s.submitted ||
                ((s.activeDiagnosisId =
                  s.activeDiagnosisId === l.diagnosisId ? null : l.diagnosisId),
                b(
                  s.activeDiagnosisId
                    ? `Now choosing findings for ${l.diagnosis}.`
                    : "Choose a diagnosis, then tap 3 matching findings.",
                  s.activeDiagnosisId ? "is-success" : "",
                ),
                t());
            }),
            a.appendChild(g));
        }));
    },
    d = () => {
      ((r.innerHTML = ""),
        s.findingOrder.forEach((l) => {
          let g = Oe.get(l);
          if (!g) return;
          let O = document.createElement("button");
          ((O.type = "button"),
            (O.className = "connect-quiz__card"),
            (O.textContent = g.label));
          let R = s.findingOwners.get(l) || null;
          if (R) {
            let H = I(R);
            H && O.classList.add("is-assigned", `is-tone-${H.tone}`);
          }
          (O.addEventListener("click", () => {
            if (s.submitted) return;
            if (!s.activeDiagnosisId) {
              b("Choose a diagnosis first.", "is-warning");
              return;
            }
            let H = I(s.activeDiagnosisId);
            if (!H) return;
            let c = s.findingOwners.get(l) || null,
              S = E(s.activeDiagnosisId);
            if (c === s.activeDiagnosisId) {
              (v(l), b(`Removed from ${H.diagnosis}.`, "is-warning"), t());
              return;
            }
            if (S.length >= H.findings.length) {
              b(
                `${H.diagnosis} already has 3 findings. Tap one of its colored findings to remove it first.`,
                "is-warning",
              );
              return;
            }
            i(l, s.activeDiagnosisId);
            let x = E(s.activeDiagnosisId).length;
            (x === H.findings.length
              ? ((s.activeDiagnosisId = null),
                b(
                  `${H.diagnosis} saved. Choose the next diagnosis.`,
                  "is-success",
                ))
              : b(`${H.diagnosis}: ${x} of 3 findings selected.`, "is-success"),
              t());
          }),
            r.appendChild(O));
        }));
    },
    t = () => {
      if (
        (m(),
        (o.textContent = s.submitted
          ? "Your selected findings are shown below. Red means wrong, green means correct."
          : s.activeDiagnosisId
            ? `Selected diagnosis: ${I(s.activeDiagnosisId)?.diagnosis || ""}. Tap 3 findings.`
            : "Tap a diagnosis below, then choose 3 matching findings."),
        (r.hidden = s.submitted),
        (a.hidden = s.submitted),
        (p.hidden = !s.submitted),
        (N.textContent = s.submitted ? "Try again" : "Submit"),
        C(),
        s.submitted)
      ) {
        h();
        return;
      }
      d();
    },
    k = () => {
      ((s.findingOrder = ke(_e.map((l) => l.id))),
        (s.activeDiagnosisId = null),
        s.assignments.clear(),
        s.findingOwners.clear(),
        (s.submitted = !1),
        he.forEach((l) => {
          s.assignments.set(l.diagnosisId, []);
        }),
        b(""),
        t());
    };
  (N.addEventListener("click", () => {
    if (s.submitted) {
      k();
      return;
    }
    if (
      !he.every((g) => E(g.diagnosisId).length === g.findings.length) ||
      s.findingOwners.size !== _e.length
    ) {
      b("Assign 3 findings to each diagnosis before submitting.", "is-warning");
      return;
    }
    ((s.activeDiagnosisId = null), (s.submitted = !0), b(""), t());
  }),
    e.dataset.shownWired !== "1" &&
      ((e.dataset.shownWired = "1"),
      document.addEventListener("page:shown", (l) => {
        l.detail?.id === "diabeticConnectQuizPage" && k();
      })),
    k());
}
function bt() {
  (qe(), ut(), pt(), gt(), mt(), ft(), yt());
}
function It() {
  let e = document.getElementById("diabeticRetinopathyWorkshopPage");
  if (!e) return;
  (qe(),
    dt(e),
    Me(),
    e.querySelectorAll(".lesson-row[data-target]").forEach((r) => {
      if (r.dataset.wired === "1") return;
      r.dataset.wired = "1";
      let a = async (p) => {
        (p.preventDefault(), p.stopPropagation());
        let n = r.getAttribute("data-target");
        if (!n) return;
        ze(r);
        let y = r.getAttribute("data-route");
        if (y === "videos") {
          await ct(n);
          return;
        }
        (y && (await Pe(y)), document.getElementById(n) && We(n));
      };
      (r.addEventListener("click", a),
        r.addEventListener("keydown", (p) => {
          (p.key === "Enter" || p.key === " ") && a(p);
        }));
    }),
    bt(),
    nt(),
    st(),
    rt());
}
export { st as a, bt as b, It as c };
