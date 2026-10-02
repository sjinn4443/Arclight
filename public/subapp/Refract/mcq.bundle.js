"use strict";
(() => {
  var t = (e, a, n, s) => ({
      prompt: e,
      options: a,
      answerIndex: n,
      explanation: s,
    }),
    I = "refract_mcq_progress_v1",
    k = {
      "college-routine-eye-examination": {
        label:
          "College of Optometrists: conducting the routine eye examination",
        url: "https://www.college-optometrists.org/clinical-guidance/guidance/knowledge%2C-skills-and-performance/the-routine-eye-examination/conducting-the-routine-eye-examination",
        status: "current-professional-guidance",
      },
      "refract-optics-contract-v1": {
        label: "Refract optical notation and transposition contract",
        url: null,
        status: "engineering-formula-reviewed",
      },
      "refract-app-scope-v1": {
        label: "Refract teaching scope and output limitations",
        url: null,
        status: "pending-independent-clinical-sign-off",
      },
    },
    W = [
      {
        name: "Primary",
        questionCount: 4,
        passScore: 3,
        questions: [
          t(
            "Current prescription means:",
            [
              "The spectacles worn now",
              "The objective finding",
              "The generated output",
              "The near addition only",
            ],
            0,
            "Current records the prescription being worn now.",
          ),
          t(
            "Objective prescription means:",
            [
              "The AR or retinoscopy finding",
              "The final dispensing order",
              "The old near addition",
              "The visual acuity category",
            ],
            0,
            "Objective records the measured starting finding.",
          ),
          t(
            "In refraction notation, a plano sphere means:",
            [
              "Zero spherical power",
              "A +1.00 D sphere",
              "A -1.00 D sphere",
              "No cylinder axis",
            ],
            0,
            "Plano records zero spherical lens power; any cylinder component is recorded separately.",
          ),
          t(
            "SPH is the abbreviation for:",
            [
              "Sphere",
              "Spherical equivalent only",
              "Sighted pupil height",
              "Spectacle hinge",
            ],
            0,
            "SPH records spherical lens power.",
          ),
          t(
            "CYL is used to record:",
            [
              "Cylinder power",
              "Near addition",
              "Visual acuity",
              "Pupil diameter",
            ],
            0,
            "CYL records the cylindrical component.",
          ),
          t(
            "Axis is normally recorded between:",
            [
              "1 and 180 degrees",
              "0 and 10 degrees",
              "1 and 90 dioptres",
              "20 and 40 millimetres",
            ],
            0,
            "Cylinder axis is expressed over a 1 to 180 degree range.",
          ),
          t(
            "ADD is most closely associated with:",
            [
              "Near addition",
              "Cylinder axis",
              "Distance acuity",
              "Pupil reaction",
            ],
            0,
            "ADD records the near addition.",
          ),
          t(
            "A non-zero cylinder value should be recorded with:",
            [
              "An axis",
              "A near addition only",
              "Pupil size",
              "A referral category",
            ],
            0,
            "Cylinder power needs an axis to describe its orientation.",
          ),
          t(
            "Why compare visual acuity before and after a proposed prescription change?",
            [
              "To check whether the change improves vision and fits the examination",
              "To calculate pupil size",
              "To assign a referral category automatically",
              "To replace subjective acceptance",
            ],
            0,
            "Visual acuity helps verify that a proposed change improves vision and remains consistent with the complete examination.",
          ),
          t(
            "Best use of Refract is:",
            [
              "Teaching support alongside full refraction and judgement",
              "Automatic prescribing",
              "Replacing subjective refraction",
              "Diagnosing eye disease",
            ],
            0,
            "The app is a teaching aid and does not replace full refraction.",
          ),
        ],
      },
      {
        name: "Intermediate",
        questionCount: 5,
        passScore: 4,
        questions: [
          t(
            "When transposing a prescription, the new sphere is:",
            [
              "Sphere plus cylinder",
              "Sphere minus axis",
              "Cylinder plus axis",
              "Sphere unchanged in every case",
            ],
            0,
            "Transposition adds the cylinder power to the sphere.",
          ),
          t(
            "When transposing, the cylinder sign should:",
            ["Reverse", "Stay unchanged", "Become zero", "Match the axis"],
            0,
            "The cylinder changes sign.",
          ),
          t(
            "When transposing, the axis should move by:",
            [
              "90 degrees",
              "45 degrees",
              "10 degrees",
              "180 degrees without wrapping",
            ],
            0,
            "The axis moves by 90 degrees and wraps within 1 to 180.",
          ),
          t(
            "Transpose +2.00 / -1.00 \xD7 90:",
            [
              "+1.00 / +1.00 \xD7 180",
              "+3.00 / +1.00 \xD7 90",
              "+1.00 / -1.00 \xD7 180",
              "+2.00 / +1.00 \xD7 90",
            ],
            0,
            "Add cylinder to sphere, reverse cylinder sign and rotate the axis by 90 degrees.",
          ),
          t(
            "Transpose -1.00 / +2.00 \xD7 180:",
            [
              "+1.00 / -2.00 \xD7 90",
              "-3.00 / -2.00 \xD7 90",
              "+1.00 / +2.00 \xD7 90",
              "-1.00 / -2.00 \xD7 180",
            ],
            0,
            "The transposed form is +1.00 / -2.00 \xD7 90.",
          ),
          t(
            "If cylinder is blank, axis should generally be:",
            [
              "Blank",
              "Automatically 180",
              "Automatically 90",
              "Copied from age",
            ],
            0,
            "Axis has no useful meaning without cylinder.",
          ),
          t(
            "A large proposed prescription change should be:",
            [
              "Checked against acuity, acceptance and tolerance",
              "Dispensed without subjective review",
              "Based on age alone",
              "Applied equally to both eyes",
            ],
            0,
            "Large changes need reconciliation with vision, acceptance and the full examination.",
          ),
          t(
            "An objective refraction is best treated as:",
            [
              "A starting point for subjective refinement",
              "A guaranteed final prescription",
              "A diagnosis of eye disease",
              "A substitute for visual acuity",
            ],
            0,
            "Objective findings support the refraction but do not replace subjective refinement.",
          ),
          t(
            "Why are Current and Objective entered separately?",
            [
              "To compare the worn prescription with the measured finding",
              "To duplicate the same field",
              "To calculate IOP",
              "To grade a retina",
            ],
            0,
            "The comparison is central to the teaching estimate.",
          ),
          t(
            "After transposition, the optical prescription should be:",
            [
              "Equivalent in power",
              "A stronger unrelated prescription",
              "A weaker unrelated prescription",
              "A near-only prescription",
            ],
            0,
            "Transposition changes notation rather than the optical effect.",
          ),
          t(
            "Transpose plano / -1.50 \xD7 45:",
            [
              "-1.50 / +1.50 \xD7 135",
              "+1.50 / -1.50 \xD7 135",
              "Plano / +1.50 \xD7 45",
              "-1.50 / -1.50 \xD7 90",
            ],
            0,
            "Plano plus -1.50 gives -1.50 sphere, the cylinder reverses and the axis rotates 90 degrees.",
          ),
          t(
            "Before using an estimate, the safest check is:",
            [
              "Compare it with all entered values and clinical findings",
              "Accept it without review",
              "Ignore current glasses",
              "Use age alone",
            ],
            0,
            "The estimate must be reconciled with the complete refraction and clinical context.",
          ),
        ],
      },
      {
        name: "Advanced",
        questionCount: 7,
        passScore: 6,
        questions: [
          t(
            "Transpose -2.50 / -1.50 \xD7 170:",
            [
              "-4.00 / +1.50 \xD7 80",
              "-1.00 / +1.50 \xD7 80",
              "-4.00 / -1.50 \xD7 80",
              "-2.50 / +1.50 \xD7 170",
            ],
            0,
            "Add -1.50 to the sphere, reverse cylinder and rotate the axis.",
          ),
          t(
            "Transpose +3.25 / +0.75 \xD7 20:",
            [
              "+4.00 / -0.75 \xD7 110",
              "+2.50 / -0.75 \xD7 110",
              "+4.00 / +0.75 \xD7 110",
              "+3.25 / -0.75 \xD7 20",
            ],
            0,
            "The equivalent minus-cylinder form is +4.00 / -0.75 \xD7 110.",
          ),
          t(
            "Transpose -0.50 / -2.00 \xD7 100:",
            [
              "-2.50 / +2.00 \xD7 10",
              "+1.50 / +2.00 \xD7 10",
              "-2.50 / -2.00 \xD7 10",
              "-0.50 / +2.00 \xD7 100",
            ],
            0,
            "The new sphere is -2.50 and the wrapped axis is 10 degrees.",
          ),
          t(
            "An axis of 175 moved by 90 degrees becomes:",
            ["85 degrees", "265 degrees", "95 degrees", "5 degrees"],
            0,
            "Axis wraps within 1 to 180, giving 85 degrees.",
          ),
          t(
            "An axis of 15 moved by 90 degrees becomes:",
            ["105 degrees", "75 degrees", "165 degrees", "15 degrees"],
            0,
            "Adding 90 gives 105 degrees.",
          ),
          t(
            "Which pair is optically equivalent?",
            [
              "+1.00 / -2.00 \xD7 180 and -1.00 / +2.00 \xD7 90",
              "+1.00 / -2.00 \xD7 180 and +3.00 / +2.00 \xD7 180",
              "+1.00 / -2.00 \xD7 180 and -1.00 / -2.00 \xD7 90",
              "+1.00 DS and -1.00 DS",
            ],
            0,
            "The second form is the transposition of the first.",
          ),
          t(
            "Why must axis wrap after adding 90 degrees?",
            [
              "Axis notation remains within 1 to 180 degrees",
              "Cylinder becomes spherical",
              "The add changes sign",
              "Visual acuity resets",
            ],
            0,
            "Cylinder axes are conventionally expressed within the 180-degree range.",
          ),
          t(
            "If current and objective cylinder agree closely, the app may:",
            [
              "Retain more of the corroborated cylinder",
              "Delete cylinder automatically",
              "Ignore both axes",
              "Convert the result to an IOP",
            ],
            0,
            "The existing engine treats corroborated cylinder as a stronger signal.",
          ),
          t(
            "A large disagreement between Current and Objective should prompt:",
            [
              "Careful reconciliation rather than blind acceptance",
              "Automatic use of Objective",
              "Automatic use of Current",
              "Removal of both eyes",
            ],
            0,
            "Large differences need full subjective and clinical reconciliation.",
          ),
          t(
            "Why is a generated prescription not a treatment mandate?",
            [
              "Tolerance and full examination still matter",
              "Axis is never useful",
              "Sphere cannot be measured",
              "The app diagnoses retinal disease",
            ],
            0,
            "A prescription decision requires the full refraction and clinical context.",
          ),
          t(
            "Transpose +0.75 / -0.25 \xD7 5:",
            [
              "+0.50 / +0.25 \xD7 95",
              "+1.00 / +0.25 \xD7 95",
              "+0.50 / -0.25 \xD7 95",
              "+0.75 / +0.25 \xD7 5",
            ],
            0,
            "The new sphere is +0.50, cylinder +0.25 and axis 95.",
          ),
          t(
            "Transpose -6.00 / +1.00 \xD7 135:",
            [
              "-5.00 / -1.00 \xD7 45",
              "-7.00 / -1.00 \xD7 45",
              "-5.00 / +1.00 \xD7 45",
              "-6.00 / -1.00 \xD7 135",
            ],
            0,
            "The new sphere is -5.00, cylinder -1.00 and axis 45.",
          ),
          t(
            "When cylinder magnitude is zero, transposition should:",
            [
              "Leave a spherical prescription without a meaningful axis",
              "Create a 90-degree cylinder",
              "Create a near add",
              "Change visual acuity",
            ],
            0,
            "A zero-cylinder prescription is spherical.",
          ),
          t(
            "Which notation most clearly needs rechecking?",
            [
              "Cylinder sign or axis does not match an equivalent transposition",
              "Zero cylinder is recorded without an axis",
              "A transposed form preserves optical equivalence",
              "Sphere and cylinder are written in dioptres",
            ],
            0,
            "A transposition must preserve optical power while reversing cylinder sign and rotating the axis.",
          ),
          t(
            "Why preserve the original Current values while reviewing Objective?",
            [
              "They provide tolerance and change context",
              "They determine IOP",
              "They diagnose cataract",
              "They replace visual acuity",
            ],
            0,
            "Current wear provides important comparison and tolerance context.",
          ),
          t(
            "A substantial inter-eye difference in a proposed prescription change should be reviewed for:",
            [
              "Binocular acceptance and tolerance",
              "Automatic matching of both eyes",
              "Removal of all cylinder",
              "A fixed 90-degree axis",
            ],
            0,
            "Large unequal changes should be reconciled with binocular acceptance, tolerance and the complete refraction.",
          ),
        ],
      },
    ];
  function Q(e) {
    return /transpose|transposition|SPH|CYL|cylinder|axis|sphere|plano|ADD|optically equivalent|dioptres/i.test(
      e,
    )
      ? "refract-optics-contract-v1"
      : /objective|current prescription|proposed prescription change|subjective refinement|full refraction/i.test(
            e,
          )
        ? "college-routine-eye-examination"
        : "refract-app-scope-v1";
  }
  function z(e, a) {
    return e.length >= 40
      ? e
      : a === "refract-optics-contract-v1"
        ? `${e} This keeps the equivalent optical notation explicit.`
        : a === "college-routine-eye-examination"
          ? `${e} It should be checked within the complete refraction.`
          : `${e} It does not establish a final prescription.`;
  }
  var T = W.map((e) => ({
    ...e,
    questions: e.questions.map((a, n) => {
      let s = Q(a.prompt);
      return {
        ...a,
        id: `refract-${e.name.toLowerCase()}-${String(n + 1).padStart(2, "0")}`,
        explanation: z(a.explanation, s),
        source: s,
        reviewStatus: k[s].status,
      };
    }),
  }));
  var B = (e) => {
      let a = [...e];
      for (let n = a.length - 1; n > 0; n -= 1) {
        let s = Math.floor(Math.random() * (n + 1));
        [a[n], a[s]] = [a[s], a[n]];
      }
      return a;
    },
    V = (e) => {
      let a = B(e.options.map((n, s) => ({ label: n, originalIndex: s })));
      return {
        ...e,
        options: a.map((n) => n.label),
        answerIndex: a.findIndex((n) => n.originalIndex === e.answerIndex),
      };
    };
  function Y() {
    try {
      let e = JSON.parse(localStorage.getItem(I) || "null");
      return {
        unlockedLevelIndex: Math.max(
          0,
          Math.min(2, Number(e == null ? void 0 : e.unlockedLevelIndex) || 0),
        ),
        completedLevels: Array.isArray(e == null ? void 0 : e.completedLevels)
          ? e.completedLevels
          : [],
      };
    } catch (e) {
      return { unlockedLevelIndex: 0, completedLevels: [] };
    }
  }
  function H(e) {
    try {
      localStorage.setItem(I, JSON.stringify(e));
    } catch (a) {}
  }
  function j(e = document) {
    let a = [...e.querySelectorAll(".mcq-level-button")],
      n = e.getElementById("mcqModal"),
      s = n == null ? void 0 : n.querySelector(".mcq-modal-content"),
      E = e.getElementById("closeMcqModal"),
      D = e.getElementById("mcqModalTitle"),
      N = e.getElementById("mcqModalIntro"),
      f = e.getElementById("mcqForm"),
      C = e.getElementById("submitMcqButton"),
      h = e.getElementById("newMcqButton"),
      m = e.getElementById("mcqResult"),
      O = e.getElementById("burger-icon");
    if (!n || !f || !C || !m) return;
    let p = Y(),
      v = 0,
      b = [],
      y = null;
    function M() {
      a.forEach((i, r) => {
        let o = r <= p.unlockedLevelIndex,
          l = p.completedLevels.includes(r);
        ((i.disabled = !o),
          i.classList.toggle("is-complete", l),
          (i.dataset.complete = l ? "true" : "false"));
      });
    }
    function S() {
      (n.classList.remove("open"),
        n.setAttribute("aria-hidden", "true"),
        y != null && y.isConnected && y.focus(),
        (y = null));
    }
    function P() {
      ((f.innerHTML = ""),
        b.forEach((i, r) => {
          let o = document.createElement("fieldset");
          ((o.className = "mcq-question"), (o.dataset.questionId = i.id));
          let l = document.createElement("legend");
          ((l.textContent = `${r + 1}. ${i.prompt}`),
            o.appendChild(l),
            i.options.forEach((x, w) => {
              let A = document.createElement("label");
              A.className = "mcq-option";
              let g = document.createElement("input");
              ((g.type = "radio"),
                (g.name = `refract-mcq-${r}`),
                (g.value = String(w)),
                A.append(g, document.createTextNode(x)),
                o.appendChild(A));
            }));
          let u = document.createElement("p");
          ((u.className = "mcq-item-feedback"),
            (u.hidden = !0),
            o.appendChild(u));
          let c = document.createElement("p");
          c.className = "mcq-item-source";
          let d = k[i.source];
          ((c.textContent = `Source: ${(d == null ? void 0 : d.label) || i.source}. Status: ${i.reviewStatus}.`),
            (c.hidden = !0),
            o.appendChild(c),
            f.appendChild(o));
        }));
    }
    function $(i) {
      let r = T[i];
      !r ||
        i > p.unlockedLevelIndex ||
        ((v = i),
        (b = B(r.questions).slice(0, r.questionCount).map(V)),
        (y = O || a[i]),
        (D.textContent = `${r.name} MCQ`),
        (N.textContent = `${r.questionCount} questions. Pass mark ${r.passScore}/${r.questionCount}.`),
        (m.textContent = ""),
        (m.className = "mcq-result"),
        (h.hidden = !0),
        (h.textContent = "Try again"),
        (C.disabled = !1),
        P(),
        n.classList.add("open"),
        n.setAttribute("aria-hidden", "false"),
        (n.scrollTop = 0),
        requestAnimationFrame(() => {
          n.classList.contains("open") && (s == null || s.focus());
        }));
    }
    function _() {
      var u;
      let i = b.map((c, d) =>
        f.querySelector(`input[name="refract-mcq-${d}"]:checked`),
      );
      if (i.some((c) => !c)) {
        ((m.textContent = "Answer all questions before submitting."),
          (m.className = "mcq-result is-review"));
        let c = i.findIndex((d) => !d);
        (u = f.querySelector(`input[name="refract-mcq-${c}"]`)) == null ||
          u.focus();
        return;
      }
      let r = 0;
      b.forEach((c, d) => {
        let x = Number(i[d].value),
          w = f.children[d];
        ([...w.querySelectorAll(".mcq-option")].forEach((q, L) => {
          (q.classList.toggle("is-correct", L === c.answerIndex),
            q.classList.toggle("is-incorrect", L === x && L !== c.answerIndex),
            (q.querySelector("input").disabled = !0));
        }),
          x === c.answerIndex && (r += 1));
        let g = w.querySelector(".mcq-item-feedback");
        ((g.hidden = !1),
          (g.textContent = `${x === c.answerIndex ? "Correct." : "Incorrect."} Why: ${c.explanation}`));
        let R = w.querySelector(".mcq-item-source");
        R && (R.hidden = !1);
      });
      let o = T[v],
        l = r >= o.passScore;
      ((m.textContent = `${o.name}: ${r}/${b.length}. ${l ? "Pass." : "Review and retry."}`),
        (m.className = `mcq-result ${l ? "is-pass" : "is-review"}`),
        l &&
          ((p.completedLevels = [...new Set([...p.completedLevels, v])]),
          (p.unlockedLevelIndex = Math.max(
            p.unlockedLevelIndex,
            Math.min(T.length - 1, v + 1),
          )),
          H(p),
          M()),
        (C.disabled = !0),
        (h.hidden = !1),
        (h.textContent = l ? "New attempt" : "Try again"));
    }
    (a.forEach((i, r) => i.addEventListener("click", () => $(r))),
      E == null || E.addEventListener("click", S),
      C.addEventListener("click", _),
      h == null || h.addEventListener("click", () => $(v)),
      n.addEventListener("click", (i) => {
        i.target === n && S();
      }),
      n.addEventListener("keydown", (i) => {
        if (i.key !== "Tab" || !n.classList.contains("open")) return;
        let r = [
          ...n.querySelectorAll(
            'button:not([disabled]), input:not([disabled]), [href], [tabindex]:not([tabindex="-1"])',
          ),
        ].filter((u) => u.getClientRects().length > 0);
        if (!r.length) {
          (i.preventDefault(), s == null || s.focus());
          return;
        }
        let o = r[0],
          l = r[r.length - 1];
        i.shiftKey && document.activeElement === o
          ? (i.preventDefault(), l.focus())
          : !i.shiftKey &&
            document.activeElement === l &&
            (i.preventDefault(), o.focus());
      }),
      e.addEventListener("keydown", (i) => {
        i.key === "Escape" && n.classList.contains("open") && S();
      }),
      M());
  }
  document.readyState === "loading"
    ? document.addEventListener("DOMContentLoaded", () => j(), { once: !0 })
    : j();
})();
