import { h as xe } from "./chunk-5FZC2BK5.js";
import { a as be } from "./chunk-6WVU3F6C.js";
import "./chunk-KOQD3NIP.js";
import { c as k, d as Ee } from "./chunk-KIQ7J7XB.js";
import "./chunk-724JZPMA.js";
import { a as O } from "./chunk-XB5IK5RI.js";
import "./chunk-VKQVMSQC.js";
import { l as Pe, s as I } from "./chunk-C3DWFWW5.js";
import "./chunk-P2HPNKQY.js";
import "./chunk-BGCC32GM.js";
import "./chunk-WOT6VMZA.js";
function Y(e, t) {
  let a = String(
    document.documentElement.lang || localStorage.getItem("prefLang") || "",
  )
    .toLowerCase()
    .split("-")[0];
  return {
    ha: {
      image: `Misalin gaban ido ${t}`,
      finish: "Kammala nazarin misali",
      next: `Je zuwa misali ${t}`,
      answers: `Nuna duk amsoshin misali ${t}`,
    },
    yo: {
      image: `\xC0p\u1EB9\u1EB9r\u1EB9 ap\xE1 iw\xE1j\xFA oj\xFA ${t}`,
      finish: "Par\xED \xECw\xE1d\xEC\xED \xE0p\u1EB9\u1EB9r\u1EB9",
      next: `L\u1ECD s\xED \xE0p\u1EB9\u1EB9r\u1EB9 ${t}`,
      answers: `Fi gbogbo \xECd\xE1h\xF9n \xE0p\u1EB9\u1EB9r\u1EB9 ${t} h\xE0n`,
    },
    ig: {
      image: `Ihe at\u1EE5 ak\u1EE5k\u1EE5 ihu anya ${t}`,
      finish: "Mechaa \u1ECDm\u1EE5m\u1EE5 ihe at\u1EE5",
      next: `Gaa na ihe at\u1EE5 ${t}`,
      answers: `Gosi az\u1ECBza niile nke ihe at\u1EE5 ${t}`,
    },
    ne: {
      image: `\u0906\u0901\u0916\u093E\u0915\u094B \u0905\u0917\u093E\u0921\u093F\u0915\u094B \u092D\u093E\u0917\u0915\u094B \u0915\u0947\u0938 ${t}`,
      finish:
        "\u0915\u0947\u0938 \u0905\u0927\u094D\u092F\u092F\u0928 \u0938\u092E\u093E\u092A\u094D\u0924 \u0917\u0930\u094D\u0928\u0941\u0939\u094B\u0938\u094D",
      next: `\u0915\u0947\u0938 ${t} \u092E\u093E \u091C\u093E\u0928\u0941\u0939\u094B\u0938\u094D`,
      answers: `\u0915\u0947\u0938 ${t} \u0915\u093E \u0938\u092C\u0948 \u0909\u0924\u094D\u0924\u0930 \u0926\u0947\u0916\u093E\u0909\u0928\u0941\u0939\u094B\u0938\u094D`,
    },
    fr: {
      image: `Cas du segment ant\xE9rieur ${t}`,
      finish: "Terminer l\u2019\xE9tude de cas",
      next: `Passer au cas ${t}`,
      answers: `Afficher toutes les r\xE9ponses du cas ${t}`,
    },
    lg: {
      image: `Ensonga y\u2019ekitundu ky\u2019eriiso eky\u2019omu maaso ${t}`,
      finish: "Maliriza okusoma ensonga",
      next: `Genda ku nsonga ${t}`,
      answers: `Laga eby\u2019okuddamu byonna eby\u2019ensonga ${t}`,
    },
  }[a]?.[e];
}
var H = Object.freeze([
    {
      id: 1,
      patient: [
        "6 month old baby",
        "Mum says right eye \u2018looks funny\u2019",
      ],
      signs: ["White Pupil"],
      diagnosis: ["Cataract", "Retinoblastoma"],
      action: ["Refer Investigations and Surgery"],
    },
    {
      id: 2,
      patient: [
        "6 month old baby",
        "Mum says right eye \u2018looks funny\u2019",
      ],
      signs: ["White/Pink Pupil and Blood Vessels"],
      diagnosis: ["Retinoblastoma"],
      action: ["Refer Investigations and Surgery/Chemotherapy"],
    },
    {
      id: 3,
      patient: [
        "2 week old baby",
        "Mum says eye sticky and red",
        "First one eye, now both",
      ],
      signs: ["Red Eye", "Sticky discharge"],
      diagnosis: ["Ophthalmia Neonatorum", "Gonococcus", "Chlamydia"],
      action: ["Refer Baby and Parents need Antibiotics - GUM"],
    },
    {
      id: 4,
      patient: [
        "34 year old man",
        "Painful gritty eye",
        "Blurred Vision",
        "6 months",
        "Getting worse",
      ],
      signs: ["Red Eye", "Lashes on cornea", "Cornea looks rough"],
      diagnosis: ["Trachoma"],
      action: ["Refer Surgery and Antibiotics"],
    },
    {
      id: 5,
      patient: [
        "34 year old man",
        "Painful gritty eye",
        "Blurred Vision",
        "Started after he scratched it on a tree",
        "Getting worse",
      ],
      signs: ["Red Eye", "Opacified Cornea", "Yellow Fluid Level", "Hypopyon"],
      diagnosis: ["Corneal Ulcer", "Bacterial +/- Fungi"],
      action: ["Refer Intensive Antibiotcs"],
    },
    {
      id: 6,
      patient: [
        "22 year old woman",
        "Painful gritty eye",
        "Watery",
        "Blurred Vision",
      ],
      signs: ["Dendritic Ulcer", "Staining with fluoresceine dye"],
      diagnosis: ["Herpes Simplex Keratitis"],
      action: ["Refer Anti-Viral Tx"],
    },
    {
      id: 7,
      patient: [
        "54 year old woman",
        "Photophobia",
        "Watery",
        "Blurred Vision",
        "",
        "Joint Problems \u2013 especially neck",
      ],
      signs: [
        "Red Eye especially limbus",
        "White patches on cornea",
        "Irregular Pupil",
      ],
      diagnosis: ["Anterior Uveitis"],
      action: ["Refer Steroids and Dilation"],
    },
    {
      id: 8,
      patient: [
        "74 year old man",
        "Gritty Eye",
        "Mild Blurred Vision",
        "",
        "Worked in fields all his life",
      ],
      signs: ["Pink fleshy lesion", "Extends from conjunctiva to cornea"],
      diagnosis: ["Pterygium"],
      action: ["Lubricants"],
    },
    {
      id: 9,
      patient: [
        "24 year old man",
        "Gritty Eye",
        "Watery",
        "",
        "Works as a mechanic",
      ],
      signs: ["Pink Eye", "Round brown lesion", "Surrounding yellow circle"],
      diagnosis: ["Foreign Body Metallic", "Infiltrate \u2013 early infection"],
      action: ["Remove + antibiotics"],
    },
    {
      id: 10,
      patient: [
        "24 year old man",
        "Loss of Vision",
        "Pain",
        "",
        "Drunk in a fight",
      ],
      signs: ["Red fluid level", "Misshapen Pupil", "Pink eye"],
      diagnosis: ["Blunt Trauma", "Hyphaema"],
      action: ["Shield + Analgesia", "Refer"],
    },
    {
      id: 11,
      patient: [
        "14 year old boy",
        "Loss of Vision",
        "Pain",
        "",
        "Playing with friends: \u2018sticks and stones\u2019",
      ],
      signs: [
        "Misshapen Pupil",
        "Brown \u2018blob\u2019 at limbus",
        "Yellow fluid level",
      ],
      diagnosis: ["Penetrating injury", "Corneal Laceration", "Iris Prolapse"],
      action: ["Analgesia, shield, refer"],
    },
    {
      id: 12,
      patient: [
        "12 year old boy",
        "Loss of Vision",
        "Pain",
        "",
        "Playing with friends: \u2018sticks and stones\u2019",
      ],
      signs: ["White Pupil", "Corneal line"],
      diagnosis: [
        "Penetrating injury",
        "Corneal Laceration",
        "Traumatic Cataract",
      ],
      action: ["Analgesia, shield, refer"],
    },
  ]),
  R = H.length;
function Ge(e, t) {
  t.forEach((a, o) => {
    (o > 0 && e.appendChild(document.createElement("br")),
      e.appendChild(document.createTextNode(a)));
  });
}
function je(e, t) {
  let a = document.createElement("div");
  a.className = "casechat-bubble casechat-bubble--system";
  let o = document.createElement("div");
  o.className = "casechat-system";
  let n = document.createElement("div");
  ((n.className = "casechat-caseindex"),
    n.appendChild(document.createTextNode(`Case ${t} `)));
  let c = document.createElement("span");
  ((c.className = "casechat-casecount"),
    (c.textContent = `(${t}/${R})`),
    n.appendChild(c));
  let s = document.createElement("div");
  ((s.className = "casechat-learning-prompt"),
    [
      { prefix: "SIGNS: Look for ", emphasis: "signs" },
      { prefix: "DIAGNOSIS: Make a differential ", emphasis: "diagnosis" },
      { prefix: "ACTION: Decide on an ", emphasis: "action", suffix: " plan" },
    ].forEach(({ prefix: p, emphasis: l, suffix: u = "" }) => {
      let m = document.createElement("span");
      ((m.className = "medical-anterior-prompt-line"),
        m.appendChild(document.createTextNode(p)));
      let d = document.createElement("strong");
      ((d.textContent = l),
        m.appendChild(d),
        m.appendChild(document.createTextNode(u)),
        s.appendChild(m));
    }),
    o.append(n, s),
    a.appendChild(o),
    e.appendChild(a));
}
function Ke(e, t) {
  let a = document.createElement("div");
  a.className =
    "casechat-bubble casechat-bubble--bot medical-anterior-image-bubble";
  let o = document.createElement("div");
  o.className = "casechat-botstack";
  let n = document.createElement("div");
  n.className = "casechat-imgwrap is-revealed";
  let c = document.createElement("img");
  ((c.className = "casechat-img"),
    (c.src = `/images/casestudy/case${t.id}_eyes.webp`),
    (c.alt = J()
      ? `\u0EAE\u0EB9\u0E9A\u0E81\u0ECD\u0EA5\u0EB0\u0E99\u0EB5\u0EAA\u0EC8\u0EA7\u0E99\u0EDC\u0EC9\u0EB2\u0E82\u0EAD\u0E87\u0E95\u0EB2 ${t.id}`
      : Q()
        ? `Caso de segmento anterior ${t.id}`
        : Y("image", t.id) || `Anterior segment case ${t.id}`),
    (c.decoding = "async"),
    n.appendChild(c),
    o.appendChild(n),
    a.appendChild(o),
    e.appendChild(a));
  let s = !1;
  t.patient.forEach((p) => {
    if (!p) {
      s = !0;
      return;
    }
    let l = document.createElement("div");
    ((l.className = "casechat-bubble casechat-bubble--bot"),
      s && (l.classList.add("medical-anterior-patient-group-start"), (s = !1)));
    let u = document.createElement("div");
    ((u.className = "casechat-text"),
      (u.textContent = p),
      l.appendChild(u),
      e.appendChild(l));
  });
}
function Ye(e, t, a) {
  let o = document.createElement("div");
  o.className = "medical-anterior-answer-section";
  let n = document.createElement("strong");
  ((n.textContent = t), o.appendChild(n));
  let c = document.createElement("span");
  (Ge(c, a), o.appendChild(c), e.appendChild(o));
}
var Ce = Object.freeze({
    signs: { heading: "Sign", caseKey: "signs" },
    diagnosis: { heading: "Diagnosis", caseKey: "diagnosis" },
    action: { heading: "Action", caseKey: "action" },
  }),
  F = Object.freeze(["signs", "diagnosis", "action"]);
function J() {
  let e = String(
    document.documentElement.lang || localStorage.getItem("prefLang") || "",
  ).toLowerCase();
  return e === "lo" || e.startsWith("lo-") || e === "lao";
}
function Q() {
  let e = String(
    document.documentElement.lang || localStorage.getItem("prefLang") || "",
  ).toLowerCase();
  return e === "es" || e.startsWith("es-") || e === "spanish";
}
function Ae(e, t, a) {
  let o = document.createElement("div");
  o.className = "casechat-bubble casechat-bubble--user";
  let n = document.createElement("div");
  ((n.className = "casechat-text medical-anterior-answer"),
    a.forEach((c) => {
      let s = Ce[c];
      s && Ye(n, s.heading, t[s.caseKey] || []);
    }),
    o.appendChild(n),
    e.appendChild(o));
}
function He(e) {
  let t = document.createElement("div");
  t.className = "casechat-bubble casechat-bubble--system";
  let a = document.createElement("div");
  ((a.className = "casechat-system medical-anterior-complete"),
    (a.textContent = "All cases completed."),
    t.appendChild(a),
    e.appendChild(t));
}
function ie(e) {
  (window.requestAnimationFrame || ((a) => a()))(() => {
    let a = e.lastElementChild;
    typeof a?.scrollIntoView == "function" &&
      a.scrollIntoView({ block: "end", behavior: "smooth" });
  });
}
function Te() {
  (window.requestAnimationFrame || ((t) => t()))(() => {
    typeof window.scrollTo == "function" &&
      window.scrollTo({ top: 0, left: 0, behavior: "smooth" });
  });
}
function Le() {
  let e = document.getElementById("medicalAnteriorSegmentPage"),
    t = e?.querySelector("#medicalAnteriorCaseChatLog"),
    a = e?.querySelector("#medicalAnteriorAnswerBtn"),
    o = Array.from(e?.querySelectorAll("[data-medical-answer-section]") || []);
  if (
    !e ||
    !t ||
    !a ||
    o.length !== F.length ||
    e.dataset.caseStudyInited === "1"
  )
    return;
  e.dataset.caseStudyInited = "1";
  let n = 0,
    c = new Set();
  function s(d, y, v = d) {
    ((a.dataset.i18n =
      y === "see-all"
        ? "medicalStudentsWorkshop.content.see_all_2941c5ce"
        : `i18nLiteral.${d}`),
      (a.textContent = d),
      window.I18N?.applyTranslations?.(a),
      (a.dataset.action = y),
      a.setAttribute("aria-label", v));
  }
  function p(d) {
    s(
      n === R - 1 ? "Finish" : "Next >",
      n === R - 1 ? "finish" : "next",
      n === R - 1
        ? J()
          ? "\u0EAA\u0EB4\u0EC9\u0E99\u0EAA\u0EB8\u0E94\u0E81\u0ECD\u0EA5\u0EB0\u0E99\u0EB5\u0EAA\u0EB6\u0E81\u0EAA\u0EB2"
          : Q()
            ? "Finalizar el estudio de casos"
            : Y("finish") || "Finish case study"
        : J()
          ? `\u0EC4\u0E9B\u0EAB\u0EB2\u0E81\u0ECD\u0EA5\u0EB0\u0E99\u0EB5 ${d.id + 1}`
          : Q()
            ? `Ir al caso ${d.id + 1}`
            : Y("next", d.id + 1) || `Go to case ${d.id + 1}`,
    );
  }
  function l() {
    ((c = new Set()),
      o.forEach((d) => {
        ((d.disabled = !1), d.setAttribute("aria-pressed", "false"));
      }));
  }
  function u(d, y) {
    let v = H[n];
    !v ||
      !Ce[d] ||
      c.has(d) ||
      (Ae(t, v, [d]),
      c.add(d),
      (y.disabled = !0),
      y.setAttribute("aria-pressed", "true"),
      k("medicalAnteriorSegmentPage", ((n + c.size / F.length) / R) * 99),
      c.size === F.length && p(v),
      ie(t));
  }
  function m() {
    let d = H[n];
    d &&
      (t.replaceChildren(),
      (e.dataset.currentCase = String(d.id)),
      (e.dataset.caseComplete = "false"),
      k("medicalAnteriorSegmentPage", (n / R) * 100),
      je(t, d.id),
      Ke(t, d),
      l(),
      s(
        "See all",
        "see-all",
        J()
          ? `\u0EAA\u0EB0\u0EC1\u0E94\u0E87\u0E84\u0EB3\u0E95\u0EAD\u0E9A\u0E97\u0EB1\u0E87\u0EDD\u0EBB\u0E94\u0E82\u0EAD\u0E87\u0E81\u0ECD\u0EA5\u0EB0\u0E99\u0EB5 ${d.id}`
          : Q()
            ? `Mostrar todas las respuestas del caso ${d.id}`
            : Y("answers", d.id) || `Show all answers for case ${d.id}`,
      ));
  }
  (o.forEach((d) => {
    d.addEventListener("click", () => {
      u(d.dataset.medicalAnswerSection, d);
    });
  }),
    a.addEventListener("click", () => {
      let d = a.dataset.action;
      if (d === "see-all") {
        let y = H[n];
        if (!y) return;
        (Ae(t, y, F),
          F.forEach((v) => {
            c.add(v);
          }),
          o.forEach((v) => {
            ((v.disabled = !0), v.setAttribute("aria-pressed", "true"));
          }),
          k("medicalAnteriorSegmentPage", ((n + 1) / R) * 99),
          p(y),
          ie(t));
        return;
      }
      if (d === "next") {
        ((n += 1), m(), Te());
        return;
      }
      if (d === "finish") {
        ((e.dataset.caseComplete = "true"),
          k("medicalAnteriorSegmentPage", 100),
          He(t),
          o.forEach((y) => {
            y.disabled = !0;
          }),
          s("Restart", "restart", "Restart case study"),
          ie(t));
        return;
      }
      d === "restart" && ((n = 0), m(), Te());
    }),
    m());
}
var Je = Object.freeze({
  visualAcuity: {
    pageId: "medicalVisualAcuityTestPage",
    questions: [
      {
        prompt:
          "The vision of a patient has been recorded as 6/60 in their right eye. What was the most likely distance between the patient and the chart when their vision was tested?",
        options: ["60 metres", "3 metres", "6 metres", "0.1 metres"],
        answerIndex: 2,
        explanation:
          "Snellen acuity is recorded as distance tested / line seen. Therefore, 6/60 means the patient was tested at 6 metres from the chart and saw line 60, typically the largest letter at the top of the chart.",
      },
      {
        prompt:
          "A patient was found to have visual acuity unaided of 6/24 but when tested with a pinhole it improved to 6/9. What is the most likely reason for this?",
        options: ["Myopia", "Cataract", "Glaucoma", "Presbyopia"],
        answerIndex: 0,
        explanation:
          "If visual acuity improves when looking through a pinhole, the most likely reason is a refractive error such as myopia. Narrow parallel rays of light entering the eye are much less affected by refractive surfaces, so they pass through to the retina still in focus.",
      },
      {
        prompt:
          "When testing vision the patient could not see the biggest letter on the top line. What is the next step in testing their vision?",
        options: [
          "Test the fellow eye",
          "Try counting fingers or hand movements",
          "Move the chart closer to the patient",
          "Ask the patient to look through a pinhole",
        ],
        answerIndex: 2,
        explanation:
          "If the patient cannot see the largest letter on the top line, halve the testing distance and see whether this allows them to see any letters. For example, if they cannot see line 60 at 6 metres, move to 3 metres. If they can then see the top line, record the visual acuity as 3/60.",
      },
      {
        prompt:
          "A patient read line \u20186\u2019 on a chart when tested at 3 metres. Which visual acuity below records this most accurately?",
        options: ["6/12", "3/12", "3/60", "6/3"],
        answerIndex: 0,
        explanation:
          "This patient has visual acuity of 3/6 (distance tested / line seen). The equivalent visual acuity would be 6/12, which is the same ratio and so is the most accurate.",
      },
      {
        prompt:
          "A patient\u2019s visual acuity was recorded as NPL in the right eye and 6/6 in the left eye. What sight impairment category would they meet?",
        options: [
          "Subnormal Vision",
          "Severely Sight Impaired (SSI)",
          "Normal Vision",
          "Blind",
        ],
        answerIndex: 2,
        explanation:
          "Sight impairment categories are based on binocular vision. Even if someone is \u2018blind\u2019 in one eye, if they have normal vision in the other eye they are categorised as having normal vision.",
      },
    ],
  },
  pupils: {
    pageId: "medicalPupilsTestPage",
    questions: [
      {
        prompt: "What is the technique used to test for an RAPD?",
        options: [
          "The direct light test",
          "The indirect light test",
          "The swinging light test",
          "The light test",
        ],
        answerIndex: 2,
        explanation:
          "There are three ways to test the pupil light response: direct, by viewing the pupil on which the light is shining; indirect or consensual, by observing the fellow pupil; and the swinging light test, by observing the pupil as the light arrives to look for an RAPD.",
      },
      {
        prompt: "What does RAPD stand for?",
        options: [
          "Rapid Afferent Pupil Defect",
          "Relatively Affective Pupil Defect",
          "Relative Afferent Pupil Defect",
          "Relative Affective Pupil Defective",
        ],
        answerIndex: 2,
        explanation:
          "RAPD is tested using the swinging light test. This lets the examiner compare the afferent systems of both eyes while examining one eye, making it a relative way to identify whether one afferent system is defective compared with the other.",
      },
      {
        prompt: "What is the clinical sign seen in an RAPD?",
        options: [
          "Poor constriction of the pupil when light is shone on it",
          "Dilation of the pupil when light is shone on it",
          "No constriction when the light is shone on it",
          "Dilation of the pupil when light is shone on the other eye",
        ],
        answerIndex: 1,
        explanation:
          "The pupil will typically constrict when light is shone on it. During the swinging light test, paradoxical dilation when the light reaches an eye indicates that an RAPD is present on that side.",
      },
      {
        prompt:
          "When we test for an RAPD what parts of the visual pathway are we assessing?",
        options: [
          "The occipital lobe (vision centre) of the brain",
          "The visual pathways from the midbrain to the occipital lobe",
          "The retina and optic nerve",
          "The lens, retina and optic nerve",
        ],
        answerIndex: 2,
        explanation:
          "The retina and optic nerve form the anterior parts of the afferent system, taking information from the eye to the midbrain to initiate the motor or efferent response that changes pupil size.",
      },
      {
        prompt: "What can cause an RAPD?",
        options: [
          "Cataract",
          "Cerebrovascular Accident (stroke)",
          "Posterior Capsule Opacification",
          "Central Retinal Vein Occlusion",
        ],
        answerIndex: 3,
        explanation:
          "Any disease of the retina or optic nerve that affects its afferent function can lead to an RAPD, including a vascular event affecting the retina.",
      },
    ],
  },
  fundalReflex: {
    pageId: "medicalFundalReflexTestPage",
    questions: [
      {
        prompt:
          "Which of the following is the main purpose of the fundal \u2018red\u2019 reflex test in a newborn baby?",
        options: [
          "Test visual acuity",
          "Identify disease obstructing the visual axis",
          "Assess the health of the optic nerve",
          "Look for ocular misalignment",
        ],
        answerIndex: 1,
        explanation:
          "In a newborn, the main purpose is to identify disease blocking light from entering the eye. This can include disease of the cornea, lens, vitreous, retina or optic nerve.",
      },
      {
        prompt:
          "A 3-month-old infant has a bright fundal \u2018red\u2019 reflex in the left eye but a much duller reflex in the right eye. What is the most appropriate action?",
        options: [
          "Reassure the parents",
          "Repeat the test in 3 months",
          "Arrange urgent referral to an eye specialist",
          "Arrange routine referral to an eye specialist",
        ],
        answerIndex: 2,
        explanation:
          "Any abnormality on this test requires urgent assessment by an eye specialist because serious disease, such as cataract or retinoblastoma, may be present.",
      },
      {
        prompt:
          "A 9-month-old baby born at 36 weeks\u2019 gestation presents with poor visual development and absent fundal reflexes in both eyes. What is the most likely cause of these findings?",
        options: [
          "Occipital lobe stroke",
          "Retinoblastoma",
          "Cataract",
          "Retinopathy of Prematurity",
        ],
        answerIndex: 2,
        explanation:
          "Loss of the fundal reflex is caused by something blocking light entering the eye. Retinopathy of Prematurity can cause retinal detachment, but is more common in babies born before 34 weeks. Retinoblastoma can cause loss of the reflex but is very rare, occurring in around 1 in 15,000 births. Cataract is the most common cause in babies and infants, occurring in around 1 in every 1,000 to 2,000 births.",
      },
      {
        prompt:
          "Which of the following conditions in an adult is least likely to cause an abnormal fundal \u2018red\u2019 reflex?",
        options: [
          "Cataract",
          "Vitreous Haemorrhage",
          "Corneal opacity",
          "Occipital lobe stroke",
        ],
        answerIndex: 3,
        explanation:
          "Occipital lobe stroke is least likely. Although it causes loss of vision, this results from brain damage rather than disease affecting the clarity of the ocular media.",
      },
      {
        prompt:
          "What structures, and in what order, does light pass through to illuminate the fundus and produce the fundal \u2018red\u2019 reflex?",
        options: [
          "Vitreous \u2013 Lens \u2013 Cornea",
          "Lens \u2013 Cornea \u2013 Vitreous",
          "Cornea \u2013 Lens \u2013 Vitreous \u2013 Retina",
          "Cornea \u2013 Lens \u2013 Vitreous",
        ],
        answerIndex: 2,
        explanation:
          "Light passes through the cornea, lens and vitreous to reach the retina, a clear membrane overlying the choroid of the fundus from which light is reflected. Disease of the cornea, lens, vitreous, retina or choroid can therefore cause an abnormal fundal reflex test.",
      },
    ],
  },
});
function ne(e) {
  try {
    window.I18N?.applyTranslations?.(e);
  } catch {}
}
function se(e, t, a = {}) {
  try {
    let o = window.I18N?.t?.(e, t, a) ?? t;
    return String(o).replace(/\{\{\s*([a-zA-Z0-9_]+)\s*\}\}/g, (n, c) =>
      String(a[c] ?? ""),
    );
  } catch {
    return String(t).replace(/\{\{\s*([a-zA-Z0-9_]+)\s*\}\}/g, (o, n) =>
      String(a[n] ?? ""),
    );
  }
}
function _(e, t, a) {
  e && (e.setAttribute("data-i18n", t), (e.textContent = se(t, a)));
}
function Qe(e, t, a) {
  e &&
    (e.textContent = se(
      "medicalStudentsWorkshop.quizUi.scoreTemplate",
      "You got {{correct}} out of {{total}} correct.",
      { correct: t, total: a },
    ));
}
function Ie() {
  let e = document.getElementById("medicalStudentsWorkshopPage");
  e && Ee(e);
}
function oe(e, t) {
  (k(e, t),
    Ie(),
    document.dispatchEvent(
      new CustomEvent("medicalStudentsWorkshop:progress-changed", {
        detail: { target: e, percent: t },
      }),
    ));
}
function Ze(e, t) {
  if (!e || !t || e.dataset.wired === "1") return;
  e.dataset.wired = "1";
  let a = e.querySelector(".medical-test-quiz-mount"),
    o = document.getElementById("medicalTestQuizLayoutTemplate"),
    n = document.getElementById("medicalTestQuizCardTemplate"),
    c = document.getElementById("medicalTestQuizOptionTemplate");
  if (!a || !o || !n || !c) return;
  let s = t.questions,
    p = new Array(s.length).fill(null),
    l = !1;
  ((a.textContent = ""), a.appendChild(o.content.cloneNode(!0)));
  let u = a.querySelector(".medical-test-quiz-progress"),
    m = a.querySelector(".medical-test-quiz-questions"),
    d = a.querySelector(".medical-test-quiz-results"),
    y = a.querySelector(".medical-test-quiz-modal"),
    v = a.querySelector(".medical-test-quiz-score"),
    i = a.querySelector(".medical-test-quiz-review"),
    g = a.querySelector(".medical-test-quiz-restart");
  if (!u || !m || !d || !y || !v || !i || !g) return;
  function P() {
    let h = p.filter((f) => f !== null).length;
    ((u.textContent = `${h} / ${s.length}`),
      (d.disabled = !1),
      oe(e.id, (h / s.length) * 90));
  }
  function E() {
    ((m.textContent = ""),
      _(
        d,
        l
          ? "medicalStudentsWorkshop.quizUi.seeResults"
          : "medicalStudentsWorkshop.quizUi.submitAnswers",
        l ? "See Results" : "Submit Answers",
      ),
      s.forEach((h, f) => {
        let A = `medicalStudentsWorkshop.quiz.${e.dataset.medicalTestTopic}.questions.${f}`,
          S = n.content.querySelector(".quiz-card").cloneNode(!0);
        S.dataset.questionIndex = String(f);
        let L = S.querySelector(".quiz-card-number"),
          N = S.querySelector(".quiz-question"),
          K = S.querySelector(".options"),
          ve = S.querySelector(".quiz-explanation-answer"),
          Fe = S.querySelector(".quiz-explanation-text");
        (L && (L.textContent = String(f + 1).padStart(2, "0")),
          _(N, `${A}.prompt`, h.prompt),
          ve &&
            (ve.textContent = `${String.fromCharCode(65 + h.answerIndex)}. ${h.options[h.answerIndex]}`),
          _(Fe, `${A}.explanation`, h.explanation),
          h.options.forEach(($e, q) => {
            let D = c.content.querySelector(".opt").cloneNode(!0),
              z = D.querySelector("input"),
              Se = D.querySelector(".opt-prefix"),
              Ue = D.querySelector(".opt-label"),
              we = `${e.id}-q${f}-o${q}`;
            (D.setAttribute("for", we),
              (D.dataset.optionIndex = String(q)),
              z &&
                ((z.id = we),
                (z.name = `${e.id}-q${f}`),
                (z.value = String(q)),
                (z.checked = p[f] === q)),
              Se && (Se.textContent = `${String.fromCharCode(65 + q)}.`),
              _(Ue, `${A}.options.${q}`, $e),
              K?.appendChild(D));
          }),
          m.appendChild(S),
          ne(S));
      }),
      m.querySelectorAll('input[type="radio"]').forEach((h) => {
        h.addEventListener("change", (f) => {
          let A = f.currentTarget,
            S = A.closest(".quiz-card"),
            L = Number(S?.dataset.questionIndex);
          Number.isInteger(L) && ((p[L] = Number(A.value)), P());
        });
      }),
      P());
  }
  function b() {
    y.style.display = "none";
  }
  function w(h) {
    window.alert(
      se(
        "medicalStudentsWorkshop.quizUi.incomplete",
        "Please answer all {{count}} questions before submitting.",
        { count: s.length },
      ),
    );
    let f = m.querySelector(`[data-question-index="${h}"]`);
    (f?.scrollIntoView?.({ block: "center", behavior: "smooth" }),
      f
        ?.querySelector?.('input[type="radio"]')
        ?.focus?.({ preventScroll: !0 }));
  }
  function x() {
    let h = p.reduce((f, A, S) => f + (A === s[S].answerIndex ? 1 : 0), 0);
    (Qe(v, h, s.length),
      _(
        i,
        h === s.length
          ? "medicalStudentsWorkshop.quizUi.review"
          : "medicalStudentsWorkshop.quizUi.seeWhy",
        h === s.length ? "Review" : "See why",
      ),
      ne(v),
      (y.style.display = "flex"),
      oe(e.id, 100));
  }
  function B() {
    ((l = !0),
      m.querySelectorAll('input[type="radio"]').forEach((h) => {
        h.disabled = !0;
      }),
      _(d, "medicalStudentsWorkshop.quizUi.seeResults", "See Results"),
      oe(e.id, 100));
  }
  function M() {
    (s.forEach((h, f) => {
      let A = p[f],
        S = m.querySelector(`[data-question-index="${f}"]`),
        L = S?.querySelector(".quiz-explanation");
      (L && (L.hidden = !1),
        S?.querySelectorAll(".opt").forEach((N) => {
          let K = Number(N.dataset.optionIndex);
          (N.classList.remove("correct", "wrong"),
            K === h.answerIndex && N.classList.add("correct"),
            K === A && A !== h.answerIndex && N.classList.add("wrong"));
        }));
    }),
      b());
  }
  (d.addEventListener("click", () => {
    if (l) {
      x();
      return;
    }
    let h = p.findIndex((f) => f === null);
    if (h !== -1) {
      w(h);
      return;
    }
    (B(), x());
  }),
    i.addEventListener("click", M),
    g.addEventListener("click", () => {
      (p.fill(null), (l = !1), b(), E());
    }),
    y.addEventListener("click", (h) => {
      h.target === y && b();
    }),
    E(),
    ne(e));
}
function ke() {
  (document.querySelectorAll(".medical-test-quiz-page").forEach((e) => {
    let t = Je[e.dataset.medicalTestTopic];
    Ze(e, t);
  }),
    Ie());
}
var Z = null;
async function Xe() {
  return (
    window.lottie ||
      (window.__lottieLoadPromise ||
        (window.__lottieLoadPromise = new Promise((e, t) => {
          let a = document.createElement("script");
          ((a.src = "/vendor/lottie.min.js"),
            (a.onload = e),
            (a.onerror = t),
            document.head.append(a));
        })),
      await window.__lottieLoadPromise),
    window.lottie
  );
}
function Re() {
  let e = document.querySelector("[data-medical-front-of-eye]");
  if (!e || e.dataset.inited === "1") return;
  (Z?.(), (e.dataset.inited = "1"));
  let t = [],
    a = !1,
    o = () => window.I18N?.getLanguage?.() || "en",
    n = (i, g) => window.I18N?.t?.(`pecWorkshop.${i}`, g) || g,
    c = () => {
      (t.forEach(({ index: i, copy: g, animation: P }) => {
        let E = O.getSegmentStartTexts(i, o()) || O.segmentStartTexts[i];
        (g.replaceChildren(
          ...E.map((b) => {
            let w = document.createElement("p");
            return ((w.textContent = b), w);
          }),
        ),
          s(i, g, P?.currentFrame || 0));
      }),
        t.forEach(p));
    };
  function s(i, g, P) {
    let E = O.segmentTextTriggerFramesByFile[i],
      b = 0;
    (E.forEach((w, x) => {
      P >= w && (b = x);
    }),
      [...g.children].forEach((w, x) =>
        w.classList.toggle("is-current", x === b),
      ));
  }
  O.paths.slice(0, 5).forEach((i, g) => {
    let P = document.createElement("section");
    ((P.className = "medical-front-of-eye-stage"),
      (P.dataset.stageIndex = String(g)));
    let E = document.createElement("div");
    E.className = "medical-front-of-eye-visual";
    let b = document.createElement("div");
    ((b.className = "medical-front-of-eye-animation"),
      (b.dataset.stageIndex = String(g)),
      b.setAttribute("role", "img"),
      b.setAttribute("aria-label", "Front of eye examination animation"));
    let w = document.createElement("button");
    ((w.type = "button"),
      (w.className = "medical-front-of-eye-toggle"),
      (w.dataset.i18nSkip = ""));
    let x = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    (x.setAttribute("viewBox", "0 0 24 24"),
      x.setAttribute("aria-hidden", "true"),
      x.setAttribute("focusable", "false"));
    let B = document.createElementNS(x.namespaceURI, "g");
    (B.classList.add("medical-animation-pause-icon"),
      [6, 14].forEach((A) => {
        let S = document.createElementNS(x.namespaceURI, "rect");
        (S.setAttribute("x", String(A)),
          S.setAttribute("y", "5"),
          S.setAttribute("width", "4"),
          S.setAttribute("height", "14"),
          S.setAttribute("rx", "1"),
          B.append(S));
      }));
    let M = document.createElementNS(x.namespaceURI, "path");
    (M.classList.add("medical-animation-play-icon"),
      M.setAttribute("d", "M8 5L19 12L8 19Z"),
      x.append(B, M),
      w.append(x),
      w.setAttribute("aria-pressed", "false"));
    let h = document.createElement("div");
    ((h.className = "medical-front-of-eye-copy"),
      (h.dataset.i18nSkip = ""),
      E.append(b, w),
      P.append(E, h),
      e.append(P));
    let f = {
      index: g,
      path: i,
      row: P,
      canvas: b,
      copy: h,
      toggle: w,
      animation: null,
      loading: !1,
      holding: !1,
      holdRemaining: 2e3,
      holdTimer: null,
      holdStarted: 0,
      visible: !1,
      paused:
        window.matchMedia?.("(prefers-reduced-motion: reduce)").matches || !1,
    };
    (t.push(f),
      w.addEventListener("click", () => {
        ((f.paused = !f.paused), p(f));
      }));
  });
  function p(i) {
    let g = i.paused || !i.visible || document.hidden;
    (g
      ? (i.animation?.pause(),
        i.holdTimer !== null &&
          (clearTimeout(i.holdTimer),
          (i.holdTimer = null),
          (i.holdRemaining = Math.max(
            0,
            i.holdRemaining - (Date.now() - i.holdStarted),
          ))))
      : i.holding
        ? i.holdTimer === null &&
          ((i.holdStarted = Date.now()),
          (i.holdTimer = setTimeout(() => {
            ((i.holdTimer = null),
              (i.holding = !1),
              (i.holdRemaining = 2e3),
              p(i),
              !i.paused &&
                i.visible &&
                !document.hidden &&
                i.animation?.goToAndPlay(0, !0));
          }, i.holdRemaining)))
        : i.animation?.play(),
      (i.canvas.dataset.playback = g
        ? "paused"
        : i.holding
          ? "holding"
          : "playing"),
      i.toggle.setAttribute(
        "aria-label",
        n(
          i.paused ? "animation_play" : "animation_pause",
          i.paused ? "Play animation" : "Pause animation",
        ),
      ),
      i.toggle.setAttribute("aria-pressed", String(i.paused)));
  }
  async function l(i) {
    if (!(i.animation || i.loading || a)) {
      i.loading = !0;
      try {
        let g = await Xe();
        if (a || !e.isConnected) return;
        ((i.animation = g.loadAnimation({
          container: i.canvas,
          renderer: "svg",
          loop: !1,
          autoplay: !1,
          path: i.path,
          rendererSettings: { preserveAspectRatio: "xMidYMid meet" },
        })),
          i.animation.addEventListener("DOMLoaded", () => {
            ((i.canvas.dataset.ready = "1"), p(i));
          }),
          i.animation.addEventListener("complete", () => {
            ((i.holding = !0), (i.holdRemaining = 2e3), p(i));
          }),
          i.animation.addEventListener("enterFrame", () =>
            s(i.index, i.copy, i.animation.currentFrame),
          ),
          i.animation.addEventListener("data_failed", () => {
            i.canvas.textContent = n(
              "animation_error",
              "Animation could not load. Please reopen this lesson to try again.",
            );
          }));
      } catch (g) {
        ((i.canvas.textContent = n(
          "animation_error",
          "Animation could not load. Please reopen this lesson to try again.",
        )),
          console.error("[medicalFrontOfEyePractice]", g));
      }
    }
  }
  let u = new IntersectionObserver(
      (i) => {
        i.forEach((g) => {
          g.isIntersecting && l(t[Number(g.target.dataset.stageIndex)]);
        });
      },
      { rootMargin: "120px 0px", threshold: 0 },
    ),
    m = null,
    d = () => {
      (m?.disconnect(),
        t.forEach((g) => {
          ((g.visible = !1), p(g));
        }));
      let i = Math.max(0, window.innerHeight / 2 - 1);
      ((m = new IntersectionObserver(
        (g) => {
          g.forEach((P) => {
            let E = t[Number(P.target.dataset.stageIndex)];
            ((E.visible = P.isIntersecting), E.visible && l(E), p(E));
          });
        },
        { rootMargin: `-${i}px 0px -${i}px 0px`, threshold: 0 },
      )),
        t.forEach((g) => m.observe(g.canvas)));
    };
  (t.forEach((i) => u.observe(i.canvas)),
    d(),
    window.addEventListener("resize", d),
    c(),
    O.loadText().then(() => {
      a || c();
    }),
    window.addEventListener("i18n:languageChanged", c));
  let y = () => t.forEach(p);
  document.addEventListener("visibilitychange", y);
  let v = () => {
    e.isConnected || Z?.();
  };
  (window.addEventListener("page:loaded", v),
    (Z = () => {
      ((a = !0),
        u.disconnect(),
        m?.disconnect(),
        window.removeEventListener("resize", d),
        t.forEach((i) => {
          (clearTimeout(i.holdTimer), i.animation?.destroy());
        }),
        window.removeEventListener("i18n:languageChanged", c),
        document.removeEventListener("visibilitychange", y),
        window.removeEventListener("page:loaded", v),
        (Z = null));
    }));
}
function ce(e) {
  try {
    let t = JSON.parse(
      sessionStorage.getItem("paediatricSurgicalEyeEarWorkshop:activeLesson") ||
        "null",
    );
    return xe.some(
      (a) =>
        a.id === t?.id &&
        a.route === "medicalStudentsWorkshop" &&
        a.target === e,
    );
  } catch {
    return !1;
  }
}
var et = "medicalStudentsWorkshopPage",
  tt = "medicalStudentsWorkshop:rapdReturn",
  j = "medicalStudentsWorkshop:restoreFolder",
  V = "medicalStudentsWorkshop:restoreNestedFolder",
  X = "medicalStudentsWorkshop:restoreTarget",
  le = "medicalStudentsWorkshop:nextFlowEnabled",
  at = "interactiveLearning:returnTarget",
  he = "medical-next-host",
  We = "medicalStudentsWorkshop:progress-changed",
  de = "pecWorkshop:medicalReuse";
function $() {
  try {
    return JSON.parse(sessionStorage.getItem(de) || "null");
  } catch {
    return null;
  }
}
function Ve() {
  let e = $()?.target;
  if (!e) return;
  let t = document.getElementById(e);
  if (
    (t?.classList.add("pec-reused-medical-page"),
    e === "medicalArclightScrollPage")
  ) {
    let a = t?.querySelector(
      '[data-i18n="medicalStudentsWorkshop.content.identify_the_loupe_and_otoscope_end_ophthalmoscope_aperture_light_switch"]',
    );
    a &&
      ((a.dataset.i18n = "pecWorkshop.arclight_eye_controls"),
      (a.textContent = window.I18N?.t?.(
        "pecWorkshop.arclight_eye_controls",
        "Identify the loupe, ophthalmoscope aperture, light switch, colour strip, lenses, pupil gauge, ruler, fixation targets, solar panel and USB-C charging point before examining a patient.",
      )),
      window.I18N?.applyTranslations?.(a));
  }
}
var Be = new Set([
    "medicalOverviewPage",
    "medicalObjectivesPage",
    "medicalPatientJourneyPage",
    "medicalBarriersPage",
    "medicalDiagnosisEyeDiseasePage",
    "medicalBlindnessPage",
    "medicalVisualSystemPage",
    "medicalVisualDevelopmentScrollPage",
    "medicalHistoryTakingPage",
    "medicalArclightScrollPage",
    "medicalVisualAcuityPracticePage",
    "medicalPupilsAnteriorPracticePage",
    "medicalFundalDirectPracticePage",
    "medicalAnteriorSegmentPage",
    "medicalVisualAcuityTestPage",
    "medicalPupilsTestPage",
    "medicalFundalReflexTestPage",
  ]),
  ae = Object.freeze({
    mumVisionPage: "videos",
    howToUseArclightVideoPage: "videos",
    visualAcuityPdfPage: "visualAcuityPdf",
    vaWhoPage: "videos",
    pupilsPecPdfPage: "pupilsPecPdf",
    pupilFullExamPage: "videos",
    pupilsAdvancedPdfPage: "pupilsAdvancedPdf",
    frontOfEyePdfPage: "frontOfEyePdf",
    feFullAnteriorSegmentPage: "videos",
    fundalExamPage: "videos",
    fundalReflexPdfPage: "fundalReflexPdf",
    directOphthalmoscopyVideoPage: "videos",
    directOphthalmoscopyPdfPage: "directOphthalmoscopyPdf",
    fundalReflexSimulatorPage: "videos",
    morphSimulatorPage: "videos",
    swollenDiscsInteractivePage: "videos",
  }),
  it = new Set(
    Object.entries(ae)
      .filter(([, e]) => e === "videos")
      .map(([e]) => e),
  ),
  nt = new Set([
    "medicalStudentsWorkshop",
    "glaucomaScrollImages",
    ...Object.values(ae),
  ]),
  r = {
    introductionOverview: {
      type: "focus",
      section: "introduction",
      nested: "introductionOverview",
    },
    eyeDiseaseBlindness: {
      type: "focus",
      section: "introduction",
      nested: "eyeDiseaseBlindness",
    },
    anatomyVision: {
      type: "focus",
      section: "introduction",
      nested: "anatomyVision",
    },
    historyTaking: {
      type: "focus",
      section: "introduction",
      target: "medicalHistoryTakingPage",
    },
    examinationTools: {
      type: "focus",
      section: "introduction",
      nested: "examinationTools",
    },
    visualAcuity: {
      type: "focus",
      section: "examineEachOther",
      nested: "visualAcuity",
    },
    pupilsAnterior: {
      type: "focus",
      section: "examineEachOther",
      nested: "pupilsAnterior",
    },
    fundalDirect: {
      type: "focus",
      section: "examineEachOther",
      nested: "fundalDirect",
    },
    training: { type: "focus", section: "trainOnSimTools" },
    pupilApp: { type: "focus", section: "trainOnSimTools", nested: "pupilApp" },
    discApp: { type: "focus", section: "trainOnSimTools", nested: "discApp" },
    test: { type: "focus", section: "test" },
  },
  Me = {
    glaucomaRAPDFullSwingInteractive: r.pupilApp,
    medicalAnteriorSegmentPage: r.training,
    fundalReflexSimulatorPage: r.training,
    morphSimulatorPage: r.discApp,
    swollenDiscsInteractivePage: r.discApp,
  },
  ot = new Set([
    "fundalReflexSimulatorPage",
    "morphSimulatorPage",
    "swollenDiscsInteractivePage",
  ]),
  ee = {
    medicalOverviewPage: {
      previous: r.introductionOverview,
      next: { type: "target", target: "medicalObjectivesPage" },
      home: r.introductionOverview,
    },
    medicalObjectivesPage: {
      previous: { type: "target", target: "medicalOverviewPage" },
      next: r.introductionOverview,
      home: r.introductionOverview,
    },
    medicalPatientJourneyPage: {
      previous: r.eyeDiseaseBlindness,
      next: { type: "target", target: "medicalBarriersPage" },
      home: r.eyeDiseaseBlindness,
    },
    medicalBarriersPage: {
      previous: { type: "target", target: "medicalPatientJourneyPage" },
      next: { type: "target", target: "medicalDiagnosisEyeDiseasePage" },
      home: r.eyeDiseaseBlindness,
    },
    medicalDiagnosisEyeDiseasePage: {
      previous: { type: "target", target: "medicalBarriersPage" },
      next: { type: "target", target: "medicalBlindnessPage" },
      home: r.eyeDiseaseBlindness,
    },
    medicalBlindnessPage: {
      previous: { type: "target", target: "medicalDiagnosisEyeDiseasePage" },
      next: r.eyeDiseaseBlindness,
      home: r.eyeDiseaseBlindness,
    },
    medicalVisualSystemPage: {
      previous: r.anatomyVision,
      next: { type: "target", target: "medicalVisualDevelopmentScrollPage" },
      home: r.anatomyVision,
    },
    medicalVisualDevelopmentScrollPage: {
      previous: { type: "target", target: "medicalVisualSystemPage" },
      next: { type: "target", target: "mumVisionPage" },
      home: r.anatomyVision,
    },
    mumVisionPage: {
      previous: {
        type: "target",
        target: "medicalVisualDevelopmentScrollPage",
      },
      next: r.anatomyVision,
      home: r.anatomyVision,
    },
    medicalHistoryTakingPage: {
      previous: r.historyTaking,
      next: r.historyTaking,
      home: r.historyTaking,
    },
    medicalArclightScrollPage: {
      previous: r.examinationTools,
      next: { type: "target", target: "howToUseArclightVideoPage" },
      home: r.examinationTools,
    },
    howToUseArclightVideoPage: {
      previous: { type: "target", target: "medicalArclightScrollPage" },
      next: r.examinationTools,
      home: r.examinationTools,
    },
    visualAcuityPdfPage: {
      previous: r.visualAcuity,
      next: { type: "target", target: "vaWhoPage" },
      home: r.visualAcuity,
    },
    vaWhoPage: {
      previous: { type: "target", target: "visualAcuityPdfPage" },
      next: { type: "target", target: "medicalVisualAcuityPracticePage" },
      home: r.visualAcuity,
    },
    medicalVisualAcuityPracticePage: {
      previous: { type: "target", target: "vaWhoPage" },
      next: r.visualAcuity,
      home: r.visualAcuity,
    },
    pupilsPecPdfPage: {
      previous: r.pupilsAnterior,
      next: { type: "target", target: "pupilFullExamPage" },
      home: r.pupilsAnterior,
    },
    pupilFullExamPage: {
      previous: { type: "target", target: "pupilsPecPdfPage" },
      next: { type: "target", target: "pupilsAdvancedPdfPage" },
      home: r.pupilsAnterior,
    },
    pupilsAdvancedPdfPage: {
      previous: { type: "target", target: "pupilFullExamPage" },
      next: { type: "target", target: "frontOfEyePdfPage" },
      home: r.pupilsAnterior,
    },
    frontOfEyePdfPage: {
      previous: { type: "target", target: "pupilsAdvancedPdfPage" },
      next: { type: "target", target: "feFullAnteriorSegmentPage" },
      home: r.pupilsAnterior,
    },
    feFullAnteriorSegmentPage: {
      previous: { type: "target", target: "frontOfEyePdfPage" },
      next: { type: "target", target: "medicalPupilsAnteriorPracticePage" },
      home: r.pupilsAnterior,
    },
    medicalPupilsAnteriorPracticePage: {
      previous: { type: "target", target: "feFullAnteriorSegmentPage" },
      next: r.pupilsAnterior,
      home: r.pupilsAnterior,
    },
    fundalExamPage: {
      previous: r.fundalDirect,
      next: { type: "target", target: "fundalReflexPdfPage" },
      home: r.fundalDirect,
    },
    fundalReflexPdfPage: {
      previous: { type: "target", target: "fundalExamPage" },
      next: { type: "target", target: "directOphthalmoscopyVideoPage" },
      home: r.fundalDirect,
    },
    directOphthalmoscopyVideoPage: {
      previous: { type: "target", target: "fundalReflexPdfPage" },
      next: { type: "target", target: "directOphthalmoscopyPdfPage" },
      home: r.fundalDirect,
    },
    directOphthalmoscopyPdfPage: {
      previous: { type: "target", target: "directOphthalmoscopyVideoPage" },
      next: { type: "target", target: "medicalFundalDirectPracticePage" },
      home: r.fundalDirect,
    },
    medicalFundalDirectPracticePage: {
      previous: { type: "target", target: "directOphthalmoscopyPdfPage" },
      next: r.fundalDirect,
      home: r.fundalDirect,
    },
    medicalAnteriorSegmentPage: {
      previous: { type: "rapd", mode: "test" },
      next: { type: "target", target: "fundalReflexSimulatorPage" },
      home: r.training,
    },
    fundalReflexSimulatorPage: {
      previous: { type: "target", target: "medicalAnteriorSegmentPage" },
      next: { type: "target", target: "morphSimulatorPage" },
      home: r.training,
    },
    morphSimulatorPage: {
      previous: { type: "target", target: "fundalReflexSimulatorPage" },
      next: { type: "target", target: "swollenDiscsInteractivePage" },
      home: r.discApp,
    },
    swollenDiscsInteractivePage: {
      previous: { type: "target", target: "morphSimulatorPage" },
      next: r.discApp,
      home: r.discApp,
    },
    medicalVisualAcuityTestPage: {
      previous: r.test,
      next: { type: "target", target: "medicalPupilsTestPage" },
      home: r.test,
    },
    medicalPupilsTestPage: {
      previous: { type: "target", target: "medicalVisualAcuityTestPage" },
      next: { type: "target", target: "medicalFundalReflexTestPage" },
      home: r.test,
    },
    medicalFundalReflexTestPage: {
      previous: { type: "target", target: "medicalPupilsTestPage" },
      next: r.test,
      home: r.test,
    },
  },
  Ne = !1;
function re(e, t) {
  (e.addEventListener("click", t),
    e.addEventListener("keydown", (a) => {
      (a.key === "Enter" || a.key === " ") && t(a);
    }));
}
function qe(e, t) {
  if (!e) return;
  e.querySelector(".see-all-toggle")?.remove();
  let a = e.getAttribute("data-i18n");
  if (a) {
    let n = document.createElement("span");
    ((n.className = "medical-section-heading-text"),
      (n.textContent = e.textContent.trim()),
      n.setAttribute("data-i18n", a),
      e.removeAttribute("data-i18n"),
      e.replaceChildren(n));
  }
  let o = document.createElement("button");
  ((o.type = "button"),
    (o.className = "see-all-toggle"),
    (o.textContent = "Close ^"),
    o.setAttribute("data-i18n", "i18nLiteral.Close ^"),
    o.addEventListener("click", (n) => {
      (n.preventDefault(), n.stopPropagation(), t());
    }),
    e.appendChild(o),
    window.I18N?.applyTranslations?.(e));
}
function ge() {
  try {
    return sessionStorage.getItem(le) === "1";
  } catch {
    return !1;
  }
}
function T(e) {
  try {
    e ? sessionStorage.setItem(le, "1") : sessionStorage.removeItem(le);
  } catch {}
}
function De() {
  try {
    let e = document.getElementById("page-content");
    (e && (e.scrollTop = 0),
      window.scrollTo(0, 0),
      (document.documentElement.scrollTop = 0),
      (document.body.scrollTop = 0));
  } catch {}
}
function U() {
  (De(), requestAnimationFrame(De));
}
function W() {
  return (
    Array.from(
      document.querySelectorAll("#page-content .page, body > .page"),
    ).find((a) => (a?.id ? getComputedStyle(a).display !== "none" : !1))?.id ||
    ""
  );
}
function G(e) {
  let t = document.getElementById(e);
  if (!t) return !1;
  let a = t;
  for (; a; ) {
    let o = getComputedStyle(a);
    if (o.display === "none" || o.visibility === "hidden") return !1;
    a = a.parentElement;
  }
  return !0;
}
function ue(e) {
  document.querySelectorAll("#page-content .page").forEach((a) => {
    (a.classList.remove("active"), (a.style.display = "none"));
  });
  let t = document.getElementById(e);
  t &&
    (t.classList.add("active"),
    (t.style.display = "block"),
    document.dispatchEvent(
      new CustomEvent("page:shown", { detail: { id: e } }),
    ));
}
function C() {
  document.querySelectorAll(".medical-next-wrap").forEach((e) => {
    e.closest("#pecEyeLessonPage") ||
      (e.parentElement?.classList.remove(he), e.remove());
  });
}
function me() {
  return !0;
}
function st(e) {
  let a = document.getElementById(e)?.querySelector(".medical-next-btn");
  if (!a) return;
  let o = me(e);
  (a.classList.toggle("is-ready", o),
    (a.disabled = !o),
    a.setAttribute("aria-disabled", o ? "false" : "true"));
}
function Oe(e, t, a = !1) {
  let o = Number(t?.duration || 0);
  if (!o) return;
  let n = {};
  try {
    n = JSON.parse(localStorage.getItem(`videoProgress:${e}`) || "null") || {};
  } catch {
    n = {};
  }
  let c = Math.max(Number(n.maxTime || 0), Number(t.currentTime || 0)),
    s = a
      ? 100
      : Math.max(
          Number(n.percent || 0),
          Math.min(99, Math.floor((c / o) * 100)),
        );
  try {
    localStorage.setItem(
      `videoProgress:${e}`,
      JSON.stringify({
        maxTime: c,
        duration: o,
        percent: s,
        updatedAt: Date.now(),
      }),
    );
  } catch {}
  document.dispatchEvent(
    new CustomEvent(We, { detail: { target: e, percent: s } }),
  );
}
function rt() {
  let e = document.querySelector(
    "#medicalVisualSystemPage .medical-learning-video",
  );
  !e ||
    e.dataset.medicalProgressWired === "1" ||
    ((e.dataset.medicalProgressWired = "1"),
    e.addEventListener("timeupdate", () => {
      Oe("medicalVisualSystemPage", e);
    }),
    e.addEventListener("ended", () => {
      Oe("medicalVisualSystemPage", e, !0);
    }));
}
function ze(e) {
  if (e !== "mumVisionPage") return;
  let t = document.getElementById("mumVisionVideo");
  if (!t || t.dataset.medicalStartOffsetWired === "1") return;
  t.dataset.medicalStartOffsetWired = "1";
  let a = () => {
    if (!(!ge() || t.currentTime >= 12.75))
      try {
        t.currentTime = 13;
      } catch {}
  };
  (t.addEventListener("loadedmetadata", a),
    t.addEventListener("durationchange", a),
    a());
}
async function ct(e) {
  try {
    let { goToVideosSection: t, showVideosPageById: a } =
      await import("./videos-YJRPAZ42.js");
    (t?.(e, { skipDefault: !0 }), G(e) || a?.(e));
  } catch {}
  (G(e) || ue(e),
    G(e) &&
      (ze(e),
      document.dispatchEvent(
        new CustomEvent("page:shown", { detail: { id: e } }),
      )));
}
async function lt(e) {
  ((window.__videosPendingTarget = e), (window.__videosSuppressFlash = !0));
  try {
    sessionStorage.setItem("gotoSubPage", e);
  } catch {}
  (await I("videos", { subPageId: e }), await ct(e));
}
function dt(e) {
  if (!ot.has(e)) return;
  let t = Me[e];
  try {
    (sessionStorage.setItem(
      at,
      JSON.stringify({ routeName: "medicalStudentsWorkshop" }),
    ),
      t?.section && sessionStorage.setItem(j, t.section),
      t?.nested && sessionStorage.setItem(V, t.nested));
  } catch {}
}
async function fe(e) {
  if (e) {
    try {
      (sessionStorage.setItem(j, e.section || "introduction"),
        e.nested
          ? sessionStorage.setItem(V, e.nested)
          : sessionStorage.removeItem(V),
        e.target
          ? sessionStorage.setItem(X, e.target)
          : sessionStorage.removeItem(X));
    } catch {}
    (C(),
      T(!1),
      await I("medicalStudentsWorkshop", { force: !0, replace: !0 }),
      U());
  }
}
async function te(e) {
  if ((C(), T(!0), Be.has(e))) {
    (await I("medicalStudentsWorkshop", { subPageId: e }), G(e) || ue(e), U());
    return;
  }
  let t = ae[e];
  if (it.has(e)) {
    (dt(e), await lt(e), U());
    return;
  }
  t && (await I(t, { subPageId: e }), G(e) || ue(e), U());
}
async function _e(e) {
  e &&
    (e.type === "target"
      ? await te(e.target)
      : e.type === "focus"
        ? await fe(e)
        : e.type === "rapd" &&
          (await ye(
            "glaucomaRAPDFullSwingInteractive",
            e.mode || "practice",
            r.pupilApp.section,
            r.pupilApp.nested,
          )));
}
function pe(e) {
  let t = ee[e];
  if (!t || !ge() || ce(e)) {
    C();
    return;
  }
  let a = document.getElementById(e);
  if (!a) return;
  ((a.dataset.medicalStudentsReturn = "true"),
    C(),
    document
      .querySelectorAll(
        ".childhood-next-wrap, .glaucoma-next-wrap, .diabetic-next-wrap",
      )
      .forEach((l) => l.remove()));
  let o =
    a.querySelector(".container.pupils-container") ||
    a.querySelector(".container") ||
    a;
  o.classList.add(he);
  let n = document.createElement("div");
  n.className = "medical-next-wrap";
  let c = document.createElement("button");
  ((c.type = "button"),
    (c.className = "medical-prev-btn"),
    (c.textContent = "< Previous"),
    c.setAttribute("data-i18n", "i18nLiteral.< Previous"),
    c.addEventListener("click", () => void _e(t.previous)));
  let s = document.createElement("button");
  ((s.type = "button"),
    (s.className = "medical-next-btn"),
    (s.textContent = "Next >"),
    s.setAttribute("data-i18n", "i18nLiteral.Next >"));
  let p = me(e);
  (s.classList.toggle("is-ready", p),
    (s.disabled = !p),
    s.setAttribute("aria-disabled", p ? "false" : "true"),
    s.addEventListener("click", () => {
      me(e) && _e(t.next);
    }),
    n.append(c, s),
    o.appendChild(n),
    window.I18N?.applyTranslations?.(n));
}
function ut(e, t) {
  let a = document.getElementById(e);
  if (!a || a.dataset.medicalStudentsReturn !== "true") return;
  (C(),
    document.querySelectorAll(".glaucoma-next-wrap").forEach((p) => {
      (p.parentElement?.classList.remove("glaucoma-next-host"), p.remove());
    }));
  let o =
    a.querySelector(".container.pupils-container") ||
    a.querySelector(".container") ||
    a;
  o.classList.add(he);
  let n = document.createElement("div");
  n.className = "medical-next-wrap medical-rapd-next-wrap";
  let c = document.createElement("button");
  ((c.type = "button"),
    (c.className = "medical-prev-btn"),
    (c.textContent = "< Previous"),
    c.setAttribute("data-i18n", "i18nLiteral.< Previous"),
    c.addEventListener("click", () => {
      fe(r.pupilApp);
    }));
  let s = document.createElement("button");
  ((s.type = "button"),
    (s.className = "medical-next-btn is-ready"),
    (s.textContent = "Next >"),
    s.setAttribute("data-i18n", "i18nLiteral.Next >"),
    s.addEventListener("click", () => {
      if (t === "practice") {
        ye(e, "test", r.pupilApp.section, r.pupilApp.nested);
        return;
      }
      te("medicalAnteriorSegmentPage");
    }),
    n.append(c, s),
    o.appendChild(n),
    window.I18N?.applyTranslations?.(n));
}
function mt() {
  Ne ||
    ((Ne = !0),
    document.addEventListener(
      "click",
      (e) => {
        let t = e.target;
        if (!(t instanceof Element) || !t.closest("#backBtnGlobal") || ce(W()))
          return;
        if ($()?.target === W()) {
          (e.preventDefault(),
            e.stopPropagation(),
            e.stopImmediatePropagation?.());
          try {
            sessionStorage.removeItem(de);
          } catch {}
          try {
            sessionStorage.removeItem("pecWorkshop:activeEntry");
          } catch {}
          (T(!1), I("pecWorkshop", { force: !0, replace: !0 }));
          return;
        }
        if (!ge()) return;
        let o = W(),
          c = ee[o]?.home || Me[o];
        c &&
          (e.preventDefault(),
          e.stopPropagation(),
          e.stopImmediatePropagation?.(),
          fe(c));
      },
      !0,
    ),
    document.addEventListener("page:shown", (e) => {
      let t = String(e.detail?.id || "");
      t &&
        (ze(t),
        $()?.target === t ? (Ve(), C(), T(!1)) : ce(t) ? (C(), T(!1)) : pe(t));
    }),
    [
      We,
      "diabeticWorkshop:progress-changed",
      "glaucomaWorkshop:progress-changed",
    ].forEach((e) => {
      document.addEventListener(e, (t) => {
        let a = String(t.detail?.target || W());
        a && st(a);
      });
    }),
    window.addEventListener("page:loaded", (e) => {
      let t = String(e.detail?.routeName || "");
      if (t === "medicalStudentsWorkshop" && $()) {
        (C(), T(!1));
        return;
      }
      if (!nt.has(t)) {
        try {
          sessionStorage.removeItem(de);
        } catch {}
        (C(), T(!1));
        return;
      }
      requestAnimationFrame(() => {
        let a = W();
        a && pe(a);
      });
    }));
}
function pt() {
  let e = document.getElementById("medicalBlindnessPage"),
    t = e?.querySelector("#medicalExternalLinkDialog"),
    a = t?.querySelector("[data-medical-external-continue]"),
    o = t?.querySelector("[data-medical-external-cancel]");
  if (!e || !t || !a || t.dataset.wired === "1") return;
  t.dataset.wired = "1";
  let n = null,
    c = ({ resetLink: s = !0 } = {}) => {
      ((t.hidden = !0),
        s && a.setAttribute("href", "#"),
        n?.focus?.(),
        (n = null));
    };
  (e.querySelectorAll("[data-medical-external-link]").forEach((s) => {
    s.addEventListener("click", (p) => {
      (p.preventDefault(),
        (n = s),
        a.setAttribute("href", s.href),
        (t.hidden = !1),
        a.focus());
    });
  }),
    o?.addEventListener("click", () => c()),
    a.addEventListener("click", () => {
      (c({ resetLink: !1 }),
        window.requestAnimationFrame(() => a.setAttribute("href", "#")));
    }),
    t.addEventListener("click", (s) => {
      s.target === t && c();
    }),
    document.addEventListener("keydown", (s) => {
      s.key === "Escape" && !t.hidden && c();
    }));
}
async function ye(e, t, a, o) {
  T(!0);
  try {
    (sessionStorage.setItem("rapdExperience:launchMode", t || "practice"),
      sessionStorage.setItem(tt, "1"),
      a && sessionStorage.setItem(j, a),
      o && sessionStorage.setItem(V, o));
  } catch {}
  await I("glaucomaScrollImages", { force: !0, replace: !0 });
  let n = document.getElementById(e);
  if (!n) return;
  n.dataset.medicalStudentsReturn = "true";
  let { initializeGlaucomaScrollInteractiveTarget: c } =
    await import("./glaucomaWorkshop-24ZGJOVU.js");
  (c?.(e),
    await new Promise((s) => window.requestAnimationFrame(s)),
    document.querySelectorAll(".page").forEach((s) => {
      (s.classList.remove("active"), (s.style.display = "none"));
    }),
    n.classList.add("active"),
    (n.style.display = "block"),
    document.dispatchEvent(
      new CustomEvent("page:shown", { detail: { id: e } }),
    ),
    ut(e, t || "practice"),
    U());
}
function Ct() {
  let e = document.getElementById(et);
  if (!e || e.dataset.inited === "1") return;
  ((e.dataset.inited = "1"),
    Ve(),
    Re(),
    mt(),
    be(),
    Le(),
    ke(),
    pt(),
    rt(),
    document
      .querySelectorAll(
        ".medical-students-workshop-page .menuBtn, .medical-students-scroll-page .menuBtn",
      )
      .forEach((l) => l.addEventListener("click", Pe)));
  let t = Array.from(e.querySelectorAll(".medical-folder-row")),
    a = Array.from(e.querySelectorAll(".medical-section-card")),
    o = () => {
      (a.forEach((l) => {
        (l.classList.remove("medical-nested-folder-open"),
          (l.hidden = !0),
          l.querySelector(":scope > h3 .see-all-toggle")?.remove(),
          l.querySelectorAll(".medical-nested-section-card").forEach((u) => {
            ((u.hidden = !0), u.querySelector("h3 .see-all-toggle")?.remove());
          }),
          l.querySelectorAll(".medical-nested-folder-row").forEach((u) => {
            u.hidden = !1;
          }));
      }),
        t.forEach((l) => (l.hidden = !1)),
        e.classList.remove("medical-folder-open"));
    },
    n = (l) => {
      if (!l || l.getAttribute("aria-disabled") === "true") return null;
      let u = e.querySelector(
        `.medical-section-card[data-section="${l?.dataset.folder}"]`,
      );
      return u
        ? (o(),
          (l.hidden = !0),
          l.insertAdjacentElement("afterend", u),
          (u.hidden = !1),
          e.classList.add("medical-folder-open"),
          qe(u.querySelector(":scope > h3"), o),
          u)
        : null;
    },
    c = (l) => {
      let u = l?.closest(".medical-section-card"),
        m = u?.querySelector(
          `.medical-nested-section-card[data-nested-section="${l?.dataset.nestedFolder}"]`,
        );
      return !u || !m
        ? null
        : (u.classList.add("medical-nested-folder-open"),
          u.querySelectorAll(".medical-nested-folder-row").forEach((d) => {
            d.hidden = d === l;
          }),
          u.querySelectorAll(".medical-nested-section-card").forEach((d) => {
            ((d.hidden = d !== m),
              d.querySelector("h3 .see-all-toggle")?.remove());
          }),
          l.insertAdjacentElement("afterend", m),
          (m.hidden = !1),
          qe(m.querySelector("h3"), () => {
            ((m.hidden = !0),
              m.querySelector("h3 .see-all-toggle")?.remove(),
              (l.hidden = !1),
              u.classList.remove("medical-nested-folder-open"));
          }),
          m);
    },
    s = ({ sectionKey: l, nestedKey: u, targetId: m } = {}) => {
      let d = t.find((v) => v.dataset.folder === l),
        y = n(d);
      y &&
        (u &&
          c(
            y.querySelector(
              `.medical-nested-folder-row[data-nested-folder="${u}"]`,
            ),
          ),
        m &&
          requestAnimationFrame(() => {
            let v = e.querySelector(`.lesson-row[data-target="${m}"]`);
            (v?.scrollIntoView?.({ block: "center" }),
              v?.focus?.({ preventScroll: !0 }));
          }));
    };
  (t.forEach((l) => {
    l.getAttribute("aria-disabled") !== "true" &&
      re(l, (u) => {
        (u.preventDefault(), n(l));
      });
  }),
    e.querySelectorAll(".medical-nested-folder-row").forEach((l) => {
      re(l, (u) => {
        (u.preventDefault(), u.stopPropagation(), c(l));
      });
    }),
    e.querySelectorAll(".lesson-row[data-target]").forEach((l) => {
      re(l, async (u) => {
        (u.preventDefault(), u.stopPropagation());
        let m = l.dataset.target,
          d = l.dataset.route;
        Be.has(m)
          ? (T(!0), await te(m))
          : m === "glaucomaRAPDFullSwingInteractive"
            ? await ye(
                m,
                l.dataset.rapdLaunchMode,
                l.closest(".medical-section-card")?.dataset.section,
                l.closest(".medical-nested-section-card")?.dataset
                  .nestedSection,
              )
            : ee[m] || ae[m]
              ? (T(!0), await te(m))
              : d && (await I(d));
      });
    }));
  try {
    let l = sessionStorage.getItem(j),
      u = sessionStorage.getItem(V),
      m = sessionStorage.getItem(X);
    (sessionStorage.removeItem(j),
      sessionStorage.removeItem(V),
      sessionStorage.removeItem(X),
      l && s({ sectionKey: l, nestedKey: u, targetId: m }));
  } catch {}
  let p = W();
  ee[p] && $()?.target !== p && (T(!0), pe(p));
}
export {
  pt as initializeMedicalExternalLinkDialog,
  Ct as initializeMedicalStudentsWorkshop,
  mt as initializeMedicalStudentsWorkshopFlowInfra,
};
