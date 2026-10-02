"use strict";
(() => {
  function g(e, t = document) {
    return t.querySelector(e);
  }
  function S(e, t = document) {
    return Array.from(t.querySelectorAll(e));
  }
  function W(e, t, n) {
    return Math.min(n, Math.max(t, e));
  }
  function ae(e, t = Math.random) {
    let n = [...e];
    for (let s = n.length - 1; s > 0; s -= 1) {
      let i = Number(t()),
        u = 1 - Number.EPSILON,
        m = Number.isFinite(i) ? W(i, 0, u) : 0,
        d = Math.floor(m * (s + 1)),
        h = n[s];
      ((n[s] = n[d]), (n[d] = h));
    }
    return n;
  }
  function Ve(e) {
    if (e == null || (typeof e == "string" && e.trim() === "")) return null;
    let t = Number(e);
    return Number.isInteger(t) && t >= 0 ? t : null;
  }
  function ye({ questions: e, selectedAnswers: t, allowUnanswered: n = !1 }) {
    if (!Array.isArray(e) || !Array.isArray(t))
      return { isComplete: !1, score: 0, total: 0 };
    let s = 0;
    for (let i = 0; i < e.length; i += 1) {
      let u = Ve(t[i]);
      if (u == null) {
        if (!n) return { isComplete: !1, score: 0, total: e.length };
        continue;
      }
      u === e[i].answerIndex && (s += 1);
    }
    return { isComplete: !0, score: s, total: e.length };
  }
  function re(e, t) {
    let n = Math.max(1, Number(t) || 1);
    if (!e || typeof e != "object")
      return { unlockedLevelIndex: 0, completedLevels: [] };
    let s = Number.isInteger(e.unlockedLevelIndex)
        ? W(e.unlockedLevelIndex, 0, n - 1)
        : 0,
      i = Array.isArray(e.completedLevels)
        ? e.completedLevels
            .filter((u) => Number.isInteger(u) && u >= 0 && u < n)
            .filter((u, m, d) => d.indexOf(u) === m)
        : [];
    return { unlockedLevelIndex: s, completedLevels: i };
  }
  function ve(e, t, n) {
    let s = re(e, n),
      i = Math.max(1, Number(n) || 1);
    return (
      !Number.isInteger(t) ||
        t < 0 ||
        t >= i ||
        (s.completedLevels.includes(t) || s.completedLevels.push(t),
        (s.unlockedLevelIndex = Math.max(
          s.unlockedLevelIndex,
          W(t + 1, 0, Math.max(0, i - 1)),
        ))),
      s
    );
  }
  var ce = "glaucoma_mcq_progress_v1",
    We = {
      "nice-ng81-2022": {
        title: "NICE NG81: Glaucoma diagnosis and management",
        url: "https://www.nice.org.uk/guidance/ng81/chapter/Recommendations",
        reviewed: "2026-07-26",
        status: "primary-source-reviewed",
      },
      "glaucoma-risk-model-v1": {
        title: "Glaucoma app v1 risk model and referral wording",
        url: null,
        reviewed: "2026-07-26",
        status: "pending-independent-clinical-sign-off",
      },
      "glaucoma-app-scope-v1": {
        title: "Glaucoma app v1 assessment and teaching scope",
        url: null,
        reviewed: "2026-07-26",
        status: "internal-engineering-review",
      },
    },
    He = [
      {
        name: "Primary",
        passScore: 3,
        totalQuestions: 4,
        timeSeconds: 0,
        questions: [
          {
            prompt: "Higher IOP generally pushes risk:",
            options: ["Down", "Up", "No change"],
            answerIndex: 1,
          },
          {
            prompt: "A very large cup-disc ratio is usually:",
            options: ["Lower risk", "Higher risk", "Unrelated to risk"],
            answerIndex: 1,
          },
          {
            prompt: "A small crowded disc tends to:",
            options: ["Increase concern", "Always be normal", "Hide all risk"],
            answerIndex: 0,
          },
          {
            prompt:
              "Which method does NICE recommend for measuring IOP when deciding whether to refer?",
            options: [
              "Goldmann-type applanation tonometry",
              "Non-contact air-puff tonometry alone",
              "Digital palpation through the lid",
            ],
            answerIndex: 0,
          },
          {
            prompt: "Which assessment checks for glaucomatous functional loss?",
            options: [
              "Automated perimetry",
              "Central corneal thickness",
              "Gonioscopy",
              "Visual acuity alone",
            ],
            answerIndex: 0,
          },
          {
            prompt: "A cup-disc ratio describes:",
            options: [
              "Cup size relative to disc size",
              "Pressure relative to age",
              "VA relative to field",
              "Pupil size relative to cornea",
            ],
            answerIndex: 0,
          },
          {
            prompt: "A visible rim notch is recorded as:",
            options: [
              "A suspicious structural sign",
              "A normal pressure value",
              "A visual acuity category",
              "A pupil measurement",
            ],
            answerIndex: 0,
          },
          {
            prompt: "Family history belongs in:",
            options: [
              "Risk context",
              "Visual acuity",
              "IOP measurement",
              "Disc size",
            ],
            answerIndex: 0,
          },
          {
            prompt:
              "An initially abnormal visual field may be repeated before referral when:",
            options: [
              "There is no urgent concern and confirmation is needed",
              "It already agrees with clear disc damage",
              "The pressure is definitely high",
              "Visual acuity is reduced",
            ],
            answerIndex: 0,
          },
          {
            prompt: "The safest response to uncertain findings is to:",
            options: [
              "Record the uncertainty and use clinical judgement",
              "Mark every item normal",
              "Ignore the finding",
              "Use the lowest urgency",
            ],
            answerIndex: 0,
          },
        ],
      },
      {
        name: "Intermediate",
        passScore: 3,
        totalQuestions: 5,
        timeSeconds: 110,
        questions: [
          {
            prompt: "Thin rim/notch and disc haem together should usually:",
            options: [
              "Lower urgency",
              "Increase urgency",
              "Cancel each other out",
              "Only matter if VA is normal",
            ],
            answerIndex: 1,
          },
          {
            prompt: "Suspicious fields add risk because they may reflect:",
            options: [
              "Better perfusion",
              "Functional loss",
              "Normal variation only",
              "Lens artefact only",
            ],
            answerIndex: 1,
          },
          {
            prompt:
              "Which set best matches NICE case-finding assessment before referral?",
            options: [
              "Visual fields, optic nerve assessment, GAT and anterior chamber assessment",
              "Visual acuity, colour vision and pupil size only",
              "Non-contact tonometry and symptoms only",
              "Corneal thickness and family history only",
            ],
            answerIndex: 0,
          },
          {
            prompt:
              "Risk factors (age, family history, myopia, etc.) should be used to:",
            options: [
              "Ignore pressure and optic-disc findings",
              "Refine urgency",
              "Replace optic disc findings",
              "Avoid referral decisions",
            ],
            answerIndex: 1,
          },
          {
            prompt:
              "If unsure of disc signs but several risk factors are present:",
            options: [
              "Assume normal",
              "Treat as lower concern",
              "Escalate caution",
              "Remove all weighting",
            ],
            answerIndex: 2,
          },
          {
            prompt: "High IOP with a suspicious rim should be interpreted as:",
            options: [
              "Combined pressure and structural concern",
              "Pressure concern only",
              "A normal combination",
              "A visual acuity result",
            ],
            answerIndex: 0,
          },
          {
            prompt: "A normal-looking field does not by itself:",
            options: [
              "Exclude structural concern",
              "Provide useful context",
              "Need recording",
              "Support comparison",
            ],
            answerIndex: 0,
          },
          {
            prompt:
              "Why is stereoscopic optic nerve head assessment useful when available?",
            options: [
              "It helps evaluate cup and rim morphology",
              "It measures corneal thickness",
              "It replaces visual-field testing",
              "It determines visual acuity",
            ],
            answerIndex: 0,
          },
          {
            prompt: "If the view is not reliable, the result should:",
            options: [
              "Remain cautious rather than reassuring",
              "Automatically become low risk",
              "Discard all context",
              "Confirm glaucoma",
            ],
            answerIndex: 0,
          },
          {
            prompt: "Myopia and family history are best understood as:",
            options: [
              "Context that modifies concern",
              "Definitive diagnoses",
              "Visual field results",
              "IOP categories",
            ],
            answerIndex: 0,
          },
          {
            prompt: "Central corneal thickness is best used as:",
            options: [
              "Risk and diagnostic context, not a referral decision on its own",
              "A stand-alone diagnosis of glaucoma",
              "A replacement for visual fields",
              "A measure of optic nerve damage",
            ],
            answerIndex: 0,
          },
          {
            prompt:
              "After an accurate GAT reading of 24 mmHg or more during case finding, NICE advises:",
            options: [
              "Referral for further investigation",
              "Discharge if visual acuity is normal",
              "Reliance on non-contact tonometry instead",
              "Ignoring pressure unless pain is present",
            ],
            answerIndex: 0,
          },
        ],
      },
      {
        name: "Advanced",
        passScore: 5,
        totalQuestions: 7,
        timeSeconds: 140,
        questions: [
          {
            prompt:
              "Which measurement should not be used alone to decide glaucoma referral?",
            options: [
              "Non-contact air-puff tonometry",
              "Goldmann-type applanation tonometry",
              "Optic nerve head assessment",
              "Central visual-field testing",
              "Peripheral anterior chamber assessment",
            ],
            answerIndex: 0,
          },
          {
            prompt:
              "In the app\u2019s sparse-information LMIC triage model, a dark grey end-stage appearance should prompt:",
            options: [
              "No further assessment",
              "Escalation of the affected eye and assessment of the fellow eye",
              "Reassurance based on visual acuity",
              "Pressure measurement only",
              "Routine discharge",
            ],
            answerIndex: 1,
          },
          {
            prompt:
              "Why can a focal rim notch in a small optic disc be important?",
            options: [
              "Localised rim loss may be suspicious despite a modest cup-disc ratio",
              "Small discs cannot develop glaucoma",
              "Disc size determines IOP",
              "A notch confirms the visual field is normal",
              "Only large discs require comparison",
            ],
            answerIndex: 0,
          },
          {
            prompt:
              "Why should elevated IOP be interpreted alongside disc and field findings?",
            options: [
              "The findings provide complementary risk information",
              "IOP alone confirms glaucoma",
              "A normal field always excludes structural damage",
              "Disc size alone determines urgency",
              "The tests are interchangeable",
            ],
            answerIndex: 0,
          },
          {
            prompt:
              "A suspicious optic nerve appearance with a normal visual field should usually lead to:",
            options: [
              "Further assessment rather than dismissal",
              "Automatic discharge",
              "A diagnosis based on visual acuity",
              "Ignoring the optic nerve finding",
              "Treatment without confirmation",
            ],
            answerIndex: 0,
          },
          {
            prompt:
              "Which visual-field method does NICE include in glaucoma diagnosis?",
            options: [
              "Standard automated perimetry using a central thresholding test",
              "Confrontation alone in every case",
              "Amsler testing",
              "Colour vision plates",
              "Visual acuity alone",
            ],
            answerIndex: 0,
          },
          {
            prompt:
              "Which statement best separates triage support from diagnosis?",
            options: [
              "The estimate supports referral reasoning but does not diagnose glaucoma",
              "The estimate confirms glaucoma without examination",
              "The estimate selects treatment",
              "The estimate replaces specialist review",
              "The estimate makes uncertainty irrelevant",
            ],
            answerIndex: 0,
          },
          {
            prompt:
              "If the first visual field is unreliable and there is no urgent concern, the next step is usually to:",
            options: [
              "Repeat the field to seek a reliable result",
              "Record it as normal",
              "Replace it with visual acuity",
              "Ignore any disc abnormality",
            ],
            answerIndex: 0,
          },
          {
            prompt:
              "Can glaucoma-related optic nerve damage occur when IOP is not raised?",
            options: [
              "Yes, pressure must be interpreted with structural and functional findings",
              "No, raised IOP is always required",
              "Only when visual acuity is poor",
              "Only in a large optic disc",
            ],
            answerIndex: 0,
          },
          {
            prompt:
              "Why should the fellow eye still be assessed when one eye is high risk?",
            options: [
              "Bilateral comparison may alter interpretation and planning",
              "The high-risk eye becomes normal",
              "Only the fellow eye determines IOP",
              "It removes the need for referral",
            ],
            answerIndex: 0,
          },
          {
            prompt:
              "A strong family history with borderline structural findings should:",
            options: [
              "Increase caution without becoming a diagnosis by itself",
              "Confirm glaucoma automatically",
              "Be ignored",
              "Replace pressure measurement",
            ],
            answerIndex: 0,
          },
          {
            prompt:
              "What supports future comparison of optic nerve appearance after diagnosis?",
            options: [
              "A baseline optic nerve head image",
              "A colour vision score alone",
              "A single visual acuity result",
              "A symptom checklist without examination",
            ],
            answerIndex: 0,
          },
          {
            prompt:
              "Which examination is used to assess the anterior chamber angle at glaucoma diagnosis?",
            options: [
              "Gonioscopy",
              "Colour vision testing",
              "Retinoscopy",
              "Amsler testing",
            ],
            answerIndex: 0,
          },
          {
            prompt:
              "How often does NICE recommend measuring central corneal thickness?",
            options: [
              "At diagnosis, with repeat measurement only when clinically indicated",
              "At every pressure check",
              "Only after visual-field loss",
              "Never if gonioscopy is available",
            ],
            answerIndex: 0,
          },
          {
            prompt:
              "When uncertainty and red flags coexist, the safer principle is:",
            options: [
              "The higher concern should dominate",
              "Uncertainty should always downgrade",
              "Use the first field only",
              "Ignore red flags",
            ],
            answerIndex: 0,
          },
          {
            prompt:
              "Which group of tests forms an appropriate glaucoma diagnostic baseline?",
            options: [
              "GAT, gonioscopy, CCT, visual fields and optic nerve assessment",
              "Visual acuity and colour vision only",
              "Non-contact tonometry alone",
              "Symptoms and family history without examination",
            ],
            answerIndex: 0,
          },
        ],
      },
    ],
    ze = {
      iop: {
        explanation:
          "Goldmann-type applanation IOP is one part of glaucoma case-finding. Higher pressure increases concern but must be interpreted with the rest of the assessment.",
        source: "nice-ng81-2022",
      },
      disc: {
        explanation:
          "Optic nerve head assessment looks for suspicious structural damage. Cup-disc ratio is contextual and does not establish risk safely on its own.",
        source: "nice-ng81-2022",
      },
      "disc-size": {
        explanation:
          "Disc size changes how cupping is interpreted in this app model. The weighting is app-specific and remains pending independent clinical sign-off.",
        source: "glaucoma-risk-model-v1",
      },
      scope: {
        explanation:
          "A transparent triage estimate based on recorded findings does not make a definitive diagnosis or replace specialist assessment.",
        source: "glaucoma-app-scope-v1",
      },
      "iop-measurement": {
        explanation:
          "NICE recommends Goldmann-type applanation tonometry for IOP measurement in glaucoma case finding and advises against basing referral decisions on non-contact tonometry alone.",
        source: "nice-ng81-2022",
      },
      "functional-testing": {
        explanation:
          "Central visual-field testing with standard automated perimetry assesses functional loss that may support referral or diagnosis.",
        source: "nice-ng81-2022",
      },
      "disc-examination": {
        explanation:
          "Stereoscopic optic nerve head assessment, through a dilated pupil when clinically appropriate, supports evaluation of cup and rim morphology.",
        source: "nice-ng81-2022",
      },
      "field-method": {
        explanation:
          "NICE includes standard automated perimetry using a central thresholding test in glaucoma diagnostic assessment.",
        source: "nice-ng81-2022",
      },
      "baseline-imaging": {
        explanation:
          "NICE recommends an optic nerve head image at diagnosis to provide a baseline for future comparison.",
        source: "nice-ng81-2022",
      },
      "repeat-confirmation": {
        explanation:
          "When there is no urgent concern, NICE allows repeat IOP or visual-field measurements on another occasion to confirm an abnormal finding.",
        source: "nice-ng81-2022",
      },
      "case-finding-set": {
        explanation:
          "NICE case finding combines visual fields, optic nerve assessment, Goldmann-type applanation tonometry and peripheral anterior chamber assessment.",
        source: "nice-ng81-2022",
      },
      cct: {
        explanation:
          "Central corneal thickness contributes to risk assessment and diagnostic context but should not determine referral on its own. NICE recommends measuring it at diagnosis and repeating only when clinically indicated.",
        source: "nice-ng81-2022",
      },
      "referral-iop": {
        explanation:
          "NICE recommends referral for further investigation when IOP is 24 mmHg or more using Goldmann-type applanation tonometry, while local pathways determine operational handling.",
        source: "nice-ng81-2022",
      },
      "disc-interpretation": {
        explanation:
          "Optic disc size affects the meaning of a cup-disc ratio. Focal rim loss may still be suspicious in a small disc and requires clinical interpretation.",
        source: "nice-ng81-2022",
      },
      "structural-functional": {
        explanation:
          "Structural optic nerve damage and functional visual-field loss may not appear at the same time. A suspicious finding should be assessed rather than cancelled by a normal companion test.",
        source: "nice-ng81-2022",
      },
      "normal-tension": {
        explanation:
          "Glaucoma-related optic nerve damage may occur without raised IOP, so pressure must be interpreted alongside optic nerve and visual-field findings.",
        source: "nice-ng81-2022",
      },
      gonioscopy: {
        explanation:
          "Gonioscopy is part of the diagnostic assessment because it evaluates the anterior chamber angle and helps distinguish glaucoma mechanisms.",
        source: "nice-ng81-2022",
      },
      "diagnostic-baseline": {
        explanation:
          "NICE diagnostic assessment includes Goldmann-type applanation tonometry, gonioscopy, central corneal thickness, visual fields and optic nerve assessment with imaging where available.",
        source: "nice-ng81-2022",
      },
      "risk-context": {
        explanation:
          "Age, family history and myopia add context to structural, pressure and field findings but do not diagnose glaucoma by themselves.",
        source: "glaucoma-risk-model-v1",
      },
      unassessed: {
        explanation:
          "Before findings are recorded, the safe state is not assessed rather than normal or low risk.",
        source: "glaucoma-app-scope-v1",
      },
      uncertainty: {
        explanation:
          "Unreliable or uncertain findings should be documented and repeated or escalated as clinically appropriate, not converted into reassurance.",
        source: "nice-ng81-2022",
      },
      "combined-risk": {
        explanation:
          "Pressure, optic nerve structure and visual field provide complementary information. Several concerning findings should not cancel one another out.",
        source: "nice-ng81-2022",
      },
      field: {
        explanation:
          "A glaucomatous visual field defect is functional evidence that can warrant referral even when another recorded feature appears less concerning.",
        source: "nice-ng81-2022",
      },
      triage: {
        explanation:
          "The app combines entered findings into a triage estimate. Its thresholds and timescales remain app-specific and need independent clinical sign-off.",
        source: "glaucoma-risk-model-v1",
      },
      severe: {
        explanation:
          "In this app\u2019s sparse-information LMIC triage model, a dark grey end-stage appearance prompts escalation of the affected eye and assessment of the fellow eye. This app-specific action remains pending independent clinical sign-off.",
        source: "glaucoma-risk-model-v1",
      },
      bilateral: {
        explanation:
          "Assessing both eyes supports comparison, identifies asymmetric disease and informs the overall clinical plan.",
        source: "nice-ng81-2022",
      },
      boundaries: {
        explanation:
          "Inclusive category boundaries make the app model predictable at threshold values. They are engineering contracts, not universal clinical cut-offs.",
        source: "glaucoma-risk-model-v1",
      },
      "data-integrity": {
        explanation:
          "The triage reasoning must correspond to the recorded findings. A mismatch is a reason to stop and recheck the assessment before use.",
        source: "glaucoma-app-scope-v1",
      },
    },
    Ue = [
      [
        "iop",
        "disc",
        "disc-size",
        "iop-measurement",
        "functional-testing",
        "disc",
        "disc",
        "risk-context",
        "repeat-confirmation",
        "uncertainty",
      ],
      [
        "combined-risk",
        "field",
        "case-finding-set",
        "risk-context",
        "uncertainty",
        "combined-risk",
        "field",
        "disc-examination",
        "uncertainty",
        "risk-context",
        "cct",
        "referral-iop",
      ],
      [
        "iop-measurement",
        "severe",
        "disc-interpretation",
        "combined-risk",
        "structural-functional",
        "field-method",
        "scope",
        "repeat-confirmation",
        "normal-tension",
        "bilateral",
        "risk-context",
        "baseline-imaging",
        "gonioscopy",
        "cct",
        "uncertainty",
        "diagnostic-baseline",
      ],
    ],
    X = He.map((e, t) => ({
      ...e,
      questions: e.questions.map((n, s) => {
        let i = Ue[t][s],
          u = ze[i];
        return {
          id: `glaucoma-${e.name.toLowerCase()}-${String(s + 1).padStart(2, "0")}`,
          ...n,
          topic: i,
          ...u,
          reviewStatus: We[u.source].status,
        };
      }),
    }));
  function Qe(e) {
    let t = ae(e.options.map((n, s) => ({ label: n, originalIndex: s })));
    return {
      ...e,
      options: t.map((n) => n.label),
      answerIndex: t.findIndex((n) => n.originalIndex === e.answerIndex),
    };
  }
  function je() {
    let e = { unlockedLevelIndex: 0, completedLevels: [] };
    try {
      let t = localStorage.getItem(ce);
      return t ? re(JSON.parse(t), X.length) : e;
    } catch (t) {
      return e;
    }
  }
  function Ke(e) {
    try {
      localStorage.setItem(ce, JSON.stringify(e));
    } catch (t) {}
  }
  function Ie(e = document) {
    let t = g("#burger-icon", e),
      n = g("#sideMenu", e),
      s = S(".mcq-level-button", e),
      i = g("#mcqModal", e),
      u = g("#closeMcqModal", e),
      m = g("#mcqTitle", e),
      d = g("#mcqTimer", e),
      h = g("#mcqContainer", e),
      w = g("#submitMcqButton", e),
      b = g("#retryMcqButton", e),
      x = g("#mcqResult", e),
      r = g("#info-popup", e),
      o = g("#info-icon", e);
    if (!n || !i || !h || !w || !x) return;
    let l = je(),
      f = null,
      L = [],
      R = null,
      E = 0,
      k = null,
      A = null;
    function C(c) {
      return c <= l.unlockedLevelIndex;
    }
    function _(c) {
      return l.completedLevels.includes(c);
    }
    function a() {
      s.forEach((c) => {
        let p = Number(c.dataset.levelIndex),
          I = C(p),
          O = _(p);
        ((c.disabled = !I), c.classList.toggle("is-complete", O));
      });
    }
    function y(c) {
      var p;
      (c &&
        r &&
        (r.classList.remove("active"),
        o == null || o.setAttribute("aria-expanded", "false")),
        n.classList.toggle("open", c),
        n.setAttribute("aria-hidden", c ? "false" : "true"),
        c ? n.removeAttribute("inert") : n.setAttribute("inert", ""),
        (n.inert = !c),
        t == null || t.setAttribute("aria-expanded", c ? "true" : "false"),
        t == null ||
          t.setAttribute("aria-label", c ? "Close menu" : "Open menu"),
        c
          ? ((A = e.activeElement),
            (p = s.find((I) => !I.disabled)) == null || p.focus())
          : A instanceof HTMLElement && (A.focus(), (A = null)));
    }
    function v() {
      y(!n.classList.contains("open"));
    }
    function M() {
      var c;
      (i.classList.contains("open") || (k = e.activeElement),
        i.classList.add("open"),
        i.setAttribute("aria-hidden", "false"),
        (c = i.querySelector(".modal-content")) == null || c.focus());
    }
    function q() {
      R !== null && (clearInterval(R), (R = null));
    }
    function D() {
      (q(),
        i.classList.remove("open"),
        i.setAttribute("aria-hidden", "true"),
        (f = null),
        (L = []),
        k instanceof HTMLElement && k.focus(),
        (k = null));
    }
    function P() {
      if (!d) return;
      let c = Math.floor(E / 60),
        p = E % 60;
      d.textContent = `Time: ${String(c).padStart(2, "0")}:${String(p).padStart(2, "0")}`;
    }
    function B(c) {
      if ((q(), !d)) return;
      let p = Number(c.timeSeconds) || 0;
      if (p <= 0) {
        ((d.hidden = !0), (d.textContent = ""));
        return;
      }
      ((E = p),
        (d.hidden = !1),
        P(),
        (R = setInterval(() => {
          ((E -= 1), P(), E <= 0 && (q(), K({ allowUnanswered: !0 })));
        }, 1e3)));
    }
    function J(c) {
      let p = c.map((I, O) => {
        let $ = document.createElement("fieldset");
        (($.className = "mcq-question"), ($.dataset.questionId = I.id));
        let Y = document.createElement("legend");
        return (
          (Y.textContent = `${O + 1}. ${I.prompt}`),
          $.appendChild(Y),
          I.options.forEach((T, z) => {
            let N = document.createElement("label");
            N.className = "mcq-option";
            let F = document.createElement("input");
            ((F.type = "radio"),
              (F.name = `mcq_q_${O}`),
              (F.value = String(z)));
            let V = document.createElement("span");
            ((V.textContent = T),
              N.appendChild(F),
              N.appendChild(V),
              $.appendChild(N));
          }),
          $
        );
      });
      h.replaceChildren(...p);
    }
    function ee(c) {
      let p = X[c];
      p &&
        ((f = c),
        (L = ae(p.questions).slice(0, p.totalQuestions).map(Qe)),
        (m.textContent = `MCQ - ${p.name}`),
        (x.textContent = ""),
        (w.disabled = !1),
        b && (b.hidden = !0),
        J(L),
        M(),
        B(p));
    }
    function ie() {
      return L.map((c, p) => {
        let I = e.querySelector(`input[name="mcq_q_${p}"]:checked`);
        return I ? Number(I.value) : null;
      });
    }
    function K(c = {}) {
      var Y;
      let p = X[f];
      if (!p) return;
      let I = ie(),
        O = ye({
          questions: L,
          selectedAnswers: I,
          allowUnanswered: !!c.allowUnanswered,
        });
      if (!O.isComplete) {
        ((x.textContent = "Please answer all questions before submitting."),
          (x.className = "mcq-result is-review"));
        let T = I.findIndex((z) => z === null);
        (Y = e.querySelector(`input[name="mcq_q_${T}"]`)) == null || Y.focus();
        return;
      }
      q();
      let $ = O.score >= p.passScore;
      ($ && ((l = ve(l, f, X.length)), Ke(l), a()),
        (x.textContent = `${p.name}: ${O.score}/${O.total}. ${$ ? "Pass." : "Review the feedback and try a new set."}`),
        (x.className = `mcq-result ${$ ? "is-pass" : "is-review"}`),
        h.querySelectorAll('input[type="radio"]').forEach((T) => {
          T.disabled = !0;
        }),
        h.querySelectorAll(".mcq-question").forEach((T, z) => {
          var ge, he;
          let N = L[z],
            F = I[z],
            V = F === N.answerIndex;
          (T.classList.toggle("is-correct", V),
            T.classList.toggle("is-incorrect", !V));
          let fe = [...T.querySelectorAll(".mcq-option")];
          ((ge = fe[N.answerIndex]) == null || ge.classList.add("is-correct"),
            Number.isInteger(F) &&
              !V &&
              ((he = fe[F]) == null || he.classList.add("is-wrong")));
          let oe = document.createElement("p");
          ((oe.className = "mcq-answer-review"),
            (oe.textContent = V
              ? `Correct. Why: ${N.explanation}`
              : `Incorrect. Correct answer: ${N.options[N.answerIndex]}. Why: ${N.explanation}`),
            T.appendChild(oe));
        }),
        (w.disabled = !0),
        b && (b.hidden = !1),
        x.focus({ preventScroll: !0 }));
    }
    (t &&
      t.addEventListener("click", (c) => {
        (c.stopPropagation(), v());
      }),
      s.forEach((c) => {
        c.addEventListener("click", () => {
          let p = Number(c.dataset.levelIndex);
          C(p) && (y(!1), ee(p));
        });
      }),
      w.addEventListener("click", () => K()),
      b == null ||
        b.addEventListener("click", () => {
          var c;
          f !== null &&
            (ee(f),
            (c = h.querySelector('input[type="radio"]')) == null ||
              c.focus({ preventScroll: !0 }));
        }),
      u && u.addEventListener("click", D),
      e.addEventListener("click", (c) => {
        if (n.classList.contains("open")) {
          let p = n.contains(c.target),
            I = !!(t && t.contains(c.target));
          !p && !I && y(!1);
        }
        i.classList.contains("open") && c.target === i && D();
      }),
      e.addEventListener("keydown", (c) => {
        if (c.key === "Tab" && i.classList.contains("open")) {
          let p = [
              ...i.querySelectorAll(
                'button:not([disabled]), input:not([disabled]), [tabindex]:not([tabindex="-1"])',
              ),
            ],
            I = p[0],
            O = p[p.length - 1];
          c.shiftKey && e.activeElement === I
            ? (c.preventDefault(), O == null || O.focus())
            : !c.shiftKey &&
              e.activeElement === O &&
              (c.preventDefault(), I == null || I.focus());
          return;
        }
        if (c.key === "Escape") {
          if (i.classList.contains("open")) {
            D();
            return;
          }
          n.classList.contains("open") && y(!1);
        }
      }),
      a());
  }
  var H = "Medium",
    le = { gte30: 1, "25-29": 2, "21-24": 3, lte20: 4 },
    de = { "0-0.2": 1, "0.3-0.5": 2, "0.6-0.8": 3, "0.9-1": 4 },
    te = { "6/12": 0.25, "6/36": 0.5, "6/60": 0.75, HM: 1 },
    U = {
      normal: {
        iopBand: "21-24",
        points: 1,
        note: "Palpation normal: provisional IOP \u226424 (conservatively scored as 21-24)",
      },
      firm: {
        iopBand: "gte30",
        points: 3,
        note: "Palpation firm: provisional IOP \u226530",
      },
      rock: {
        iopBand: "gte30",
        points: 3,
        note: "Palpation rock-hard: provisional IOP \u226530",
      },
    },
    Z = "PROVISIONAL (No tonometer): ",
    ue = {
      message:
        "EMERGENCY WARNING: Rock-hard eye on palpation - suspect acute glaucoma. Immediate specialist review.",
      textColour: "red",
    },
    ne = 0.2,
    xe = ["Age", "Race", "Family Hist", "Myopia", "Diabetes/BP"],
    pe = 2;
  function Q(e) {
    return Number.isInteger(e) ? String(e) : e.toFixed(2).replace(/\.?0+$/, "");
  }
  var Ye = [
      `Normal +${Q(U.normal.points)} (treated as 21-24)`,
      `Firm +${Q(U.firm.points)}`,
      `Rock +${Q(U.rock.points)}`,
    ].join(", "),
    Xe = Object.entries(te)
      .filter(([, e]) => e > 0)
      .map(([e, t]) => `${e} +${Q(t)}`)
      .join(", "),
    we = [
      "Grid needs pressure + C/D. Concerning findings still give advice if the grid is incomplete.",
      "Pressure points: \u226420 +0, 21-24 +1, 25-29 +2, \u226530 +3.",
      `Without tonometer, palp substitutes pressure: ${Ye}.`,
      `Add-ons: Thin rim +1, Susp fields +1, Susp pupils +0.5, VA up to +1 (${Xe}), each risk factor +${Q(ne)}.`,
      `If add-ons (not pressure/disc size) total >=${Q(pe)}, one IOP row shifts up.`,
      "Disc size: Small +2 and right-shift from low C/D bands; Large -2 and left-shift except C/D 0.9-1. Measured IOP overrides palpation.",
    ],
    be = "v1 \xB7 30/9/2026",
    Ce = [
      ["orange", "red", "red", "red"],
      ["orange", "orange", "red", "darkgrey"],
      ["white", "green", "orange", "darkgrey"],
      ["white", "white", "green", "darkgrey"],
    ],
    G = {
      red: {
        message: "URGENT: See specialist within 3 weeks",
        textColour: "red",
      },
      orange: {
        message: "SOON: See specialist within 2 months",
        textColour: "orange",
      },
      green: { message: "REVIEW: Check in 1 year", textColour: "green" },
      darkgrey: {
        message: "END-STAGE: Escalate affected eye and assess fellow eye",
        textColour: "black",
      },
      white: {
        message: "LOW GRID CONCERN: Routine check-up",
        textColour: "black",
      },
    };
  function Ee(e, t) {
    let n = t.getBoundingClientRect(),
      s = window.scrollY + n.bottom + 5,
      i = e.offsetWidth,
      u = n.width,
      m = window.scrollX + n.left - (i - u) - 5,
      d = window.scrollX + 8,
      h = window.scrollX + window.innerWidth - i - 8;
    ((m = Math.max(d, Math.min(m, h))),
      (e.style.top = `${s}px`),
      (e.style.left = `${m}px`));
  }
  function Ze(e) {
    var i;
    let t = g("#info-logic-list", e),
      n = g("#info-logic-version", e),
      s = (i = e.ownerDocument) != null ? i : e;
    if (t) {
      let u = we.map((m) => {
        let d = s.createElement("li");
        return ((d.textContent = m), d);
      });
      t.replaceChildren(...u);
    }
    n && (n.textContent = be);
  }
  function ke(e = document) {
    let t = g("#info-icon", e),
      n = g("#info-popup", e),
      s = g("#sideMenu", e),
      i = g("#burger-icon", e),
      u = S(".popup", e),
      m = null,
      d = null;
    if ((Ze(e), !t && u.length === 0)) return;
    function h() {
      (u.forEach((o) => o.classList.remove("active")),
        S(".info-icon[data-popup-target]", e).forEach((o) =>
          o.setAttribute("aria-expanded", "false"),
        ));
    }
    function w() {
      n &&
        (n.classList.remove("active"),
        t == null || t.setAttribute("aria-expanded", "false"),
        m instanceof HTMLElement && m.focus(),
        (m = null));
    }
    function b() {
      s &&
        (s.classList.remove("open"),
        s.setAttribute("aria-hidden", "true"),
        s.setAttribute("inert", ""),
        (s.inert = !0),
        i == null || i.setAttribute("aria-expanded", "false"),
        i == null || i.setAttribute("aria-label", "Open menu"));
    }
    function x() {
      (h(), w());
    }
    function r(o) {
      var R;
      let l = o.dataset.popupTarget;
      if (!l) return;
      let f = e.getElementById(l);
      if (!f) return;
      let L = f.classList.contains("active");
      (x(),
        !L &&
          (f.classList.add("active"),
          o.setAttribute("aria-expanded", "true"),
          (d = o),
          Ee(f, o),
          (R = f.querySelector(".popup-close-button")) == null || R.focus()));
    }
    (t &&
      n &&
      t.addEventListener("click", (o) => {
        var f;
        (o.preventDefault(), o.stopPropagation());
        let l = n.classList.contains("active");
        (h(),
          b(),
          n.classList.toggle("active", !l),
          t.setAttribute("aria-expanded", l ? "false" : "true"),
          l ||
            ((m = t),
            (f = n.querySelector(".popup-close-button")) == null || f.focus()));
      }),
      e.addEventListener("click", (o) => {
        var A;
        let l = o.target,
          f = l.closest(".popup-close-button");
        if (f) {
          (o.preventDefault(), o.stopPropagation());
          let C =
            (A = f.closest(".popup")) != null ? A : f.closest("#info-popup");
          C === n
            ? w()
            : C &&
              (C.classList.remove("active"),
              d instanceof HTMLElement && d.focus(),
              (d = null));
          return;
        }
        let L = l.closest(".info-icon[data-popup-target]");
        if (L) {
          (o.preventDefault(), o.stopPropagation(), r(L));
          return;
        }
        let R = !!l.closest(".popup"),
          E = !!l.closest("#info-popup"),
          k = !!(t && (l === t || t.contains(l)));
        (R || h(), !E && !k && w());
      }),
      window.addEventListener("resize", () => {
        let o = e.querySelector(".popup.active");
        if (!o) return;
        let l = e.querySelector(`.info-icon[data-popup-target="${o.id}"]`);
        l && Ee(o, l);
      }),
      e.addEventListener("keydown", (o) => {
        if (o.key !== "Escape") return;
        let l = !!(n != null && n.classList.contains("active")),
          f = !!e.querySelector(".popup.active");
        (x(),
          f && d instanceof HTMLElement && d.focus(),
          (d = null),
          (l || f) && o.preventDefault());
      }));
  }
  function Le(e) {
    return Math.round(e * 100) / 100;
  }
  function se(e) {
    return Number.isInteger(e) ? String(e) : e.toFixed(2).replace(/\.?0+$/, "");
  }
  function j(e) {
    return String(e).replace(/[&<>"']/g, (t) => {
      switch (t) {
        case "&":
          return "&amp;";
        case "<":
          return "&lt;";
        case ">":
          return "&gt;";
        case '"':
          return "&quot;";
        case "'":
          return "&#39;";
        default:
          return t;
      }
    });
  }
  function Je(e, t) {
    return !e || !t ? "white" : Ce[e - 1][t - 1];
  }
  function et(e, t) {
    return e === null
      ? null
      : t === "Small" && (e === 1 || e === 2)
        ? e + 1
        : t === "Large" && e < 4
          ? e - 1
          : e;
  }
  function Ae(e) {
    return typeof e == "string" && Object.prototype.hasOwnProperty.call(le, e);
  }
  function Se(e) {
    return typeof e == "string" && Object.prototype.hasOwnProperty.call(U, e);
  }
  function Re(e) {
    return typeof e == "string" && Object.prototype.hasOwnProperty.call(de, e);
  }
  function tt(e) {
    return ["Small", "Medium", "Large"].includes(e) ? e : H;
  }
  function nt(e) {
    return Array.isArray(e)
      ? e.filter((t, n, s) => xe.includes(t) && s.indexOf(t) === n)
      : [];
  }
  function Pe({ iop: e, palpation: t }) {
    let n = Ae(e),
      s = Se(t);
    if (n)
      return {
        iopBand: e,
        isProvisional: !1,
        reasoning: null,
        points: 0,
        hasConflict: s,
        hasInvalidInput: !1,
      };
    let i = s ? U[t] : null;
    return i
      ? {
          iopBand: i.iopBand,
          isProvisional: !0,
          reasoning: i.note,
          points: i.points,
          hasConflict: !1,
          hasInvalidInput: !1,
        }
      : {
          iopBand: null,
          isProvisional: !1,
          reasoning: null,
          points: 0,
          hasConflict: !1,
          hasInvalidInput: !!(e || t),
        };
  }
  function Oe({
    iop: e,
    palpation: t,
    cupDiscRatio: n,
    thinRim: s,
    suspiciousFields: i,
    suspiciousPupils: u,
    vision: m,
  }) {
    var x;
    let d = Ae(e),
      h = Se(t),
      w = Re(n);
    if (!d && t === "rock" && h) return !0;
    let b = Pe({ iop: e, palpation: t });
    return s ||
      i ||
      u ||
      ((x = te[m]) != null ? x : 0) > 0 ||
      n === "0.9-1" ||
      ["25-29", "gte30"].includes(b.iopBand)
      ? !0
      : !!((d || h) && w);
  }
  function Me({
    iop: e = null,
    palpation: t = null,
    cupDiscRatio: n = null,
    discSize: s = "Medium",
    thinRim: i = !1,
    suspiciousFields: u = !1,
    suspiciousPupils: m = !1,
    vision: d = "",
    riskFactors: h = [],
  }) {
    var K, c, p;
    let w = nt(h),
      b = Re(n) ? n : null,
      x = tt(s),
      r = Pe({ iop: e, palpation: t }),
      o = 0,
      l = [],
      f = [];
    (i && ((o += 1), l.push("Thin Rim: +1")),
      r.hasConflict && l.push("Measured IOP selected; palpation ignored"),
      r.isProvisional && r.reasoning
        ? ((o += r.points), l.push(`${r.reasoning}: +${se(r.points)}`))
        : r.iopBand === "gte30"
          ? ((o += 3), l.push("IOP \u226530: +3"))
          : r.iopBand === "25-29"
            ? ((o += 2), l.push("IOP 25-29: +2"))
            : r.iopBand === "21-24" && ((o += 1), l.push("IOP 21-24: +1")),
      u && ((o += 1), l.push("Suspect Fields: +1")),
      m && ((o += 0.5), l.push("Suspect Pupils: +0.5")));
    let L = (K = te[d]) != null ? K : 0;
    L > 0 && ((o += L), l.push(`Vision ${d}: +${se(L)}`));
    let R = w.length * ne;
    (w.length > 0 &&
      ((o += R),
      w.forEach((I) => {
        f.push(`${I}: +${se(ne)}`);
      })),
      x === "Small"
        ? ((o += 2), l.push("Small disc: +2"))
        : x === "Large" && ((o -= 2), l.push("Large disc: -2")));
    let E = r.iopBand && (c = le[r.iopBand]) != null ? c : null,
      k = b ? de[b] : null,
      A = 0;
    (i && (A += 1),
      u && (A += 1),
      m && (A += 0.5),
      (A += L),
      (A += R),
      A >= pe && E !== null && (E -= 1),
      E !== null && (E = W(E, 1, 4)),
      (k = et(k, x)),
      k !== null && (k = W(k, 1, 4)));
    let C = Je(E, k),
      _ = (p = G[C]) != null ? p : G.white,
      a = E && k ? `cell_r${E}_c${k}` : null,
      y = E !== null && k !== null,
      v = r.isProvisional && t === "rock",
      M = b === "0.9-1",
      q = i || u,
      D = q && (C === "white" || C === "green");
    D &&
      ((_ = G.orange),
      l.push("Referral floor applied: suspicious rim or field finding"));
    let P = "",
      B = "black";
    (v
      ? ((P = ue.message), (B = ue.textColour))
      : y
        ? ((P = r.isProvisional ? `${Z}${_.message}` : _.message),
          (B = _.textColour))
        : r.hasInvalidInput
          ? (P = "INCOMPLETE: Select a valid pressure input")
          : (P = r.isProvisional
              ? `${Z}Select C/D to complete risk grid`
              : "INCOMPLETE: Select C/D to complete risk grid"),
      !v &&
        !y &&
        (q || ["25-29", "gte30"].includes(r.iopBand)
          ? ((P = `${r.isProvisional ? Z : ""}${G.orange.message}`),
            (B = G.orange.textColour))
          : !r.iopBand &&
            !r.hasInvalidInput &&
            (P = "INCOMPLETE: Record pressure and C/D where available")),
      M &&
        (v || C === "red"
          ? (P += " \xB7 END-STAGE: Assess fellow eye")
          : ((P = `${r.isProvisional ? Z : ""}${G.darkgrey.message}`),
            (B = G.darkgrey.textColour))));
    let J = m || L > 0;
    if (J) {
      let I =
        "Assess reduced vision or abnormal pupils; cause may not be glaucoma.";
      !v &&
      !M &&
      ((!y && !q && !["25-29", "gte30"].includes(r.iopBand)) ||
        (y && !D && ["white", "green"].includes(C)))
        ? ((P = `CHECK: ${I}`), (B = "orange"))
        : (P += ` \xB7 ${I}`);
    }
    let ee = y
        ? D || (J && ["white", "green"].includes(C))
          ? "Grid position shown; additional findings override routine advice."
          : ""
        : "Grid incomplete \u2014 advice uses available findings.",
      ie =
        r.iopBand === null
          ? "none"
          : r.isProvisional
            ? "palpation"
            : "tonometry";
    return {
      riskScore: Le(o),
      reasoningDetails: l,
      riskFactorStrings: f,
      rowNum: E,
      colNum: k,
      cellId: a,
      cellColour: C,
      urgencyMessage: P,
      urgencyTextColour: B,
      isProvisionalPressure: r.isProvisional,
      isRockAcuteWarning: v,
      hasPressureConflict: r.hasConflict,
      hasReferralFloor: D,
      isEndStage: M,
      gridNote: ee,
      pressureSource: ie,
      resolvedIopBand: r.iopBand,
      togglePoints: Le(A),
      cupDiscRatio: b,
      discSize: x,
    };
  }
  function Ne({
    eye: e = null,
    cupDiscRatio: t,
    discSize: n,
    reasoningDetails: s,
    riskFactorStrings: i,
    riskScore: u,
    gridNote: m = "",
  }) {
    let d = [];
    (e && d.push(`Eye: ${j(e)}`),
      t && d.push(`C/D: ${j(t)}`),
      d.push(`DS: ${j(n)}`),
      s.length > 0 && d.push(s.map(j).join("; ")),
      i.length > 0 && d.push(`Risks: (${i.map(j).join(", ")})`));
    let h = d.length > 0 ? d.join("; ") : "";
    return `${m ? `${j(m)}<br>` : ""}${h}; Supporting points (C/D shown on chart): <b>${se(u)}</b>`;
  }
  function st(e, t) {
    let n = t.querySelector(`input[name="${e}"]:checked`);
    return n ? n.value : null;
  }
  function me(e, t) {
    let n = t.querySelector(`input[name="${e}"]`);
    return !!(n && n.checked);
  }
  function it(e, t) {
    return S(`input[name="${e}"]:checked`, t).map((n) => n.value);
  }
  function ot(e) {
    S('input[type="radio"][data-toggleable="true"]', e).forEach((n) => {
      n.addEventListener("click", () => {
        if (n.checked && n.dataset.toggled === "true") {
          ((n.checked = !1),
            (n.dataset.toggled = "false"),
            n.dispatchEvent(new Event("change", { bubbles: !0 })));
          return;
        }
        (S(`input[name="${n.name}"]`, e).forEach((s) => {
          s.dataset.toggled = "false";
        }),
          (n.dataset.toggled = "true"));
      });
    });
  }
  function at({ clearPalpationSelection: e, recalculateRisk: t }) {
    return (n) => {
      let s = n == null ? void 0 : n.target;
      ((s == null ? void 0 : s.name) === "iop" && s.checked && e(), t());
    };
  }
  function Te(e = document) {
    var _;
    let t = g(".questionnaire", e),
      n = g("#final-message", e),
      s = g("#reasoning-window", e),
      i = g("#reportButton", e),
      u = S('input[name="iop"]', e),
      m = S(".eye-button", e),
      d = S(".ratio-button", e),
      h = S(".disc-button", e),
      w = S(".palpation-button", e),
      b = S(".risk-cell", e),
      x = g("#vision", e);
    if (!t || !n || !s) return;
    let r = h.find((a) => a.classList.contains("selected")),
      o = {
        selectedEye: null,
        selectedRatio: null,
        selectedSize: (_ = r == null ? void 0 : r.dataset.size) != null ? _ : H,
        selectedPalpation: null,
      },
      l = null;
    ot(e);
    function f() {
      (b.forEach((a) => a.classList.remove("highlight")),
        (n.textContent = ""),
        (n.style.color = "black"),
        (s.textContent = ""),
        (l = null),
        i && (i.disabled = !0));
    }
    function L() {
      ((o.selectedPalpation = null),
        w.forEach((a) => {
          (a.classList.remove("is-active"),
            a.setAttribute("aria-pressed", "false"));
        }));
    }
    function R() {
      u.forEach((a) => {
        a.checked = !1;
      });
    }
    function E() {
      ((o.selectedEye = null),
        (o.selectedRatio = null),
        (o.selectedSize = H),
        (o.selectedPalpation = null),
        m.forEach((a) => {
          (a.classList.remove("selected"),
            a.setAttribute("aria-pressed", "false"));
        }),
        delete t.dataset.eye,
        d.forEach((a) => {
          (a.classList.remove("selected"),
            a.setAttribute("aria-pressed", "false"));
        }),
        h.forEach((a) => {
          let y = a.dataset.size === H;
          (a.classList.toggle("selected", y),
            a.setAttribute("aria-pressed", String(y)));
        }),
        w.forEach((a) => {
          (a.classList.remove("is-active"),
            a.setAttribute("aria-pressed", "false"));
        }),
        S("input", t).forEach((a) => {
          ((a.type === "radio" || a.type === "checkbox") && (a.checked = !1),
            a.dataset.toggled && (a.dataset.toggled = "false"));
        }),
        x && (x.value = ""),
        f());
    }
    function k() {
      return {
        eye: o.selectedEye,
        iop: st("iop", e),
        palpation: o.selectedPalpation,
        cupDiscRatio: o.selectedRatio,
        discSize: o.selectedSize,
        thinRim: me("thin_rims", e),
        suspiciousFields: me("field_of_vision_problem", e),
        suspiciousPupils: me("suspect_pupils", e),
        vision: x ? x.value : "",
        riskFactors: it("other_risk_factors", e),
      };
    }
    function A(a, y) {
      if ((b.forEach((v) => v.classList.remove("highlight")), a.cellId)) {
        let v = e.getElementById(a.cellId);
        v && v.classList.add("highlight");
      }
      ((n.textContent = a.urgencyMessage),
        (n.style.color = a.urgencyTextColour),
        (s.innerHTML = Ne({ ...a, eye: o.selectedEye })),
        (l = {
          inputs: { ...y, riskFactors: [...y.riskFactors] },
          outcome: {
            ...a,
            reasoningDetails: [...a.reasoningDetails],
            riskFactorStrings: [...a.riskFactorStrings],
          },
        }),
        i && (i.disabled = !1));
    }
    function C() {
      let a = k();
      if (!Oe(a)) {
        f();
        return;
      }
      let y = Me(a);
      A(y, a);
    }
    return (
      m.forEach((a) => {
        a.addEventListener("click", () => {
          var y;
          (m.forEach((v) => {
            let M = v === a;
            (v.classList.toggle("selected", M),
              v.setAttribute("aria-pressed", String(M)));
          }),
            (o.selectedEye = (y = a.dataset.eye) != null ? y : null),
            o.selectedEye
              ? (t.dataset.eye = o.selectedEye)
              : delete t.dataset.eye,
            C());
        });
      }),
      d.forEach((a) => {
        a.addEventListener("click", () => {
          (d.forEach((y) => {
            let v = y === a;
            (y.classList.toggle("selected", v),
              y.setAttribute("aria-pressed", String(v)));
          }),
            (o.selectedRatio = a.dataset.ratio),
            C());
        });
      }),
      h.forEach((a) => {
        a.addEventListener("click", () => {
          var y;
          (h.forEach((v) => v.classList.remove("selected")),
            h.forEach((v) => v.setAttribute("aria-pressed", "false")),
            a.classList.add("selected"),
            a.setAttribute("aria-pressed", "true"),
            (o.selectedSize = (y = a.dataset.size) != null ? y : H),
            C());
        });
      }),
      w.forEach((a) => {
        a.addEventListener("click", () => {
          var v;
          let y = (v = a.dataset.palpation) != null ? v : null;
          (o.selectedPalpation === y
            ? ((o.selectedPalpation = null),
              a.classList.remove("is-active"),
              a.setAttribute("aria-pressed", "false"))
            : (R(),
              w.forEach((M) => {
                (M.classList.remove("is-active"),
                  M.setAttribute("aria-pressed", "false"));
              }),
              a.classList.add("is-active"),
              a.setAttribute("aria-pressed", "true"),
              (o.selectedPalpation = y)),
            C());
        });
      }),
      t.addEventListener(
        "change",
        at({ clearPalpationSelection: L, recalculateRisk: C }),
      ),
      C(),
      { resetAssessment: E, readRiskInputs: k, getReportData: () => l }
    );
  }
  var _e = {
      lte20: "\u226420 mmHg",
      "21-24": "21-24 mmHg",
      "25-29": "25-29 mmHg",
      gte30: "\u226530 mmHg",
    },
    $e = {
      normal: "Normal by palpation (provisional, no tonometer)",
      firm: "Firm by palpation (provisional, no tonometer)",
      rock: "Rock-hard by palpation (emergency warning)",
    };
  function rt(e) {
    return `${e.getDate()}/${e.getMonth() + 1}/${e.getFullYear()}`;
  }
  function ct(e) {
    let t = [];
    return (
      e.thinRim && t.push("Thin/notched rim or related disc sign"),
      e.suspiciousFields && t.push("Suspicious fields"),
      e.suspiciousPupils && t.push("Suspicious pupils"),
      t.length > 0 ? t.join("; ") : "None marked"
    );
  }
  function lt(e) {
    return e.iop && _e[e.iop]
      ? `Measured IOP ${_e[e.iop]}`
      : e.palpation && $e[e.palpation]
        ? $e[e.palpation]
        : "Not recorded";
  }
  function qe({ inputs: e, outcome: t, date: n = new Date() }) {
    if (!e || !(t != null && t.urgencyMessage)) return "";
    let s =
      Array.isArray(e.riskFactors) && e.riskFactors.length > 0
        ? e.riskFactors.join("; ")
        : "None recorded";
    return [
      `Glaucoma report - ${rt(n)}`,
      `Eye: ${e.eye || "Not recorded"}`,
      `Pressure: ${lt(e)}`,
      `C/D ratio: ${e.cupDiscRatio || "Not recorded"}`,
      `Disc size: ${t.discSize || e.discSize || "Not recorded"}`,
      `Additional findings: ${ct(e)}`,
      `VA: ${e.vision || "Not recorded"}`,
      `Risk factors: ${s}`,
      "",
      `Output: ${t.urgencyMessage}`,
      ...(t.gridNote ? [t.gridNote] : []),
      `Supporting points (C/D shown on chart): ${t.riskScore}`,
      "",
      "Based only on the findings entered. Teaching and triage support, not a diagnosis.",
      "Painful red eye with sudden visual loss: emergency assessment. Do not use routine grid timescales.",
    ].join(`
`);
  }
  function De(e, t) {
    var i;
    let n = (i = t.ownerDocument) != null ? i : t,
      s = n.createElement("textarea");
    try {
      return (
        (s.value = e),
        s.setAttribute("readonly", ""),
        (s.style.position = "fixed"),
        (s.style.opacity = "0"),
        n.body.appendChild(s),
        s.select(),
        !!n.execCommand("copy")
      );
    } catch (u) {
      return !1;
    } finally {
      s.remove();
    }
  }
  function Be(e, t = document) {
    let n = g("#reportButton", t),
      s = g("#reportModal", t),
      i = g("#closeReportModal", t),
      u = g("#copyReportButton", t),
      m = g("#reportText", t),
      d = g("#reportCopyStatus", t);
    if (!e || !n || !s || !m) return;
    let h = null;
    function w() {
      (s.classList.remove("open"),
        s.setAttribute("aria-hidden", "true"),
        d && (d.textContent = ""),
        h instanceof HTMLElement && h.focus(),
        (h = null));
    }
    function b() {
      var l;
      let r = e.getReportData(),
        o = qe(r != null ? r : {});
      o &&
        ((h = t.activeElement),
        (m.textContent = o),
        d && (d.textContent = ""),
        s.classList.add("open"),
        s.setAttribute("aria-hidden", "false"),
        (l = s.querySelector(".modal-content")) == null || l.focus());
    }
    async function x() {
      let r = m.textContent;
      if (!r) return;
      let o = !1;
      try {
        navigator.clipboard && window.isSecureContext
          ? (await navigator.clipboard.writeText(r), (o = !0))
          : (o = De(r, t));
      } catch (l) {
        o = De(r, t);
      }
      d && (d.textContent = o ? "Copied." : "Copy unavailable.");
    }
    (n.addEventListener("click", b),
      i == null || i.addEventListener("click", w),
      u == null || u.addEventListener("click", x),
      s.addEventListener("click", (r) => {
        r.target === s && w();
      }),
      t.addEventListener("keydown", (r) => {
        if (!s.classList.contains("open")) return;
        if (r.key === "Escape") {
          (r.preventDefault(), w());
          return;
        }
        if (r.key !== "Tab") return;
        let o = [
            ...s.querySelectorAll(
              'button:not([disabled]), [tabindex]:not([tabindex="-1"])',
            ),
          ],
          l = o[0],
          f = o[o.length - 1];
        r.shiftKey && t.activeElement === l
          ? (r.preventDefault(), f == null || f.focus())
          : !r.shiftKey &&
            t.activeElement === f &&
            (r.preventDefault(), l == null || l.focus());
      }));
  }
  function dt(e = window.location, t = navigator) {
    return "serviceWorker" in t && ["http:", "https:"].includes(e.protocol);
  }
  function Fe() {
    dt() &&
      window.addEventListener(
        "load",
        () => {
          navigator.serviceWorker
            .register("./sw.js", { scope: "./" })
            .catch((e) => {
              console.warn("Glaucoma offline support could not start.", e);
            });
        },
        { once: !0 },
      );
  }
  function ut(e) {
    let t = document.getElementById("newAssessmentButton"),
      n = document.getElementById("newAssessmentStatus");
    if (!t || !n || !e) return;
    let s = !1,
      i = null,
      u = () => {
        ((s = !1),
          (t.textContent = "New assessment"),
          (n.textContent = ""),
          i && window.clearTimeout(i),
          (i = null));
      };
    t.addEventListener("click", () => {
      if (!s) {
        ((s = !0),
          (t.textContent = "Confirm new assessment"),
          (n.textContent = "Press again to clear the assessment."),
          (i = window.setTimeout(u, 8e3)));
        return;
      }
      (i && window.clearTimeout(i),
        (i = null),
        e.resetAssessment(),
        (s = !1),
        (t.textContent = "New assessment"),
        (n.textContent = "Assessment cleared."));
    });
  }
  function Ge() {
    let e = Te(document);
    (Be(e, document), ke(document), Ie(document), ut(e), Fe());
  }
  document.readyState === "loading"
    ? document.addEventListener("DOMContentLoaded", Ge, { once: !0 })
    : Ge();
})();
