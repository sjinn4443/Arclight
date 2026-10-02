const q = (prompt, options, answerIndex, explanation) => ({
  prompt,
  options,
  answerIndex,
  explanation,
});

export const MCQ_STORAGE_KEY = "refract_mcq_progress_v1";

export const MCQ_SOURCE_REFERENCES = {
  "college-routine-eye-examination": {
    label: "College of Optometrists: conducting the routine eye examination",
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
};

const RAW_MCQ_LEVELS = [
  {
    name: "Primary",
    questionCount: 4,
    passScore: 3,
    questions: [
      q(
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
      q(
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
      q(
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
      q(
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
      q(
        "CYL is used to record:",
        ["Cylinder power", "Near addition", "Visual acuity", "Pupil diameter"],
        0,
        "CYL records the cylindrical component.",
      ),
      q(
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
      q(
        "ADD is most closely associated with:",
        ["Near addition", "Cylinder axis", "Distance acuity", "Pupil reaction"],
        0,
        "ADD records the near addition.",
      ),
      q(
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
      q(
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
      q(
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
      q(
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
      q(
        "When transposing, the cylinder sign should:",
        ["Reverse", "Stay unchanged", "Become zero", "Match the axis"],
        0,
        "The cylinder changes sign.",
      ),
      q(
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
      q(
        "Transpose +2.00 / -1.00 × 90:",
        [
          "+1.00 / +1.00 × 180",
          "+3.00 / +1.00 × 90",
          "+1.00 / -1.00 × 180",
          "+2.00 / +1.00 × 90",
        ],
        0,
        "Add cylinder to sphere, reverse cylinder sign and rotate the axis by 90 degrees.",
      ),
      q(
        "Transpose -1.00 / +2.00 × 180:",
        [
          "+1.00 / -2.00 × 90",
          "-3.00 / -2.00 × 90",
          "+1.00 / +2.00 × 90",
          "-1.00 / -2.00 × 180",
        ],
        0,
        "The transposed form is +1.00 / -2.00 × 90.",
      ),
      q(
        "If cylinder is blank, axis should generally be:",
        ["Blank", "Automatically 180", "Automatically 90", "Copied from age"],
        0,
        "Axis has no useful meaning without cylinder.",
      ),
      q(
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
      q(
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
      q(
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
      q(
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
      q(
        "Transpose plano / -1.50 × 45:",
        [
          "-1.50 / +1.50 × 135",
          "+1.50 / -1.50 × 135",
          "Plano / +1.50 × 45",
          "-1.50 / -1.50 × 90",
        ],
        0,
        "Plano plus -1.50 gives -1.50 sphere, the cylinder reverses and the axis rotates 90 degrees.",
      ),
      q(
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
      q(
        "Transpose -2.50 / -1.50 × 170:",
        [
          "-4.00 / +1.50 × 80",
          "-1.00 / +1.50 × 80",
          "-4.00 / -1.50 × 80",
          "-2.50 / +1.50 × 170",
        ],
        0,
        "Add -1.50 to the sphere, reverse cylinder and rotate the axis.",
      ),
      q(
        "Transpose +3.25 / +0.75 × 20:",
        [
          "+4.00 / -0.75 × 110",
          "+2.50 / -0.75 × 110",
          "+4.00 / +0.75 × 110",
          "+3.25 / -0.75 × 20",
        ],
        0,
        "The equivalent minus-cylinder form is +4.00 / -0.75 × 110.",
      ),
      q(
        "Transpose -0.50 / -2.00 × 100:",
        [
          "-2.50 / +2.00 × 10",
          "+1.50 / +2.00 × 10",
          "-2.50 / -2.00 × 10",
          "-0.50 / +2.00 × 100",
        ],
        0,
        "The new sphere is -2.50 and the wrapped axis is 10 degrees.",
      ),
      q(
        "An axis of 175 moved by 90 degrees becomes:",
        ["85 degrees", "265 degrees", "95 degrees", "5 degrees"],
        0,
        "Axis wraps within 1 to 180, giving 85 degrees.",
      ),
      q(
        "An axis of 15 moved by 90 degrees becomes:",
        ["105 degrees", "75 degrees", "165 degrees", "15 degrees"],
        0,
        "Adding 90 gives 105 degrees.",
      ),
      q(
        "Which pair is optically equivalent?",
        [
          "+1.00 / -2.00 × 180 and -1.00 / +2.00 × 90",
          "+1.00 / -2.00 × 180 and +3.00 / +2.00 × 180",
          "+1.00 / -2.00 × 180 and -1.00 / -2.00 × 90",
          "+1.00 DS and -1.00 DS",
        ],
        0,
        "The second form is the transposition of the first.",
      ),
      q(
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
      q(
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
      q(
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
      q(
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
      q(
        "Transpose +0.75 / -0.25 × 5:",
        [
          "+0.50 / +0.25 × 95",
          "+1.00 / +0.25 × 95",
          "+0.50 / -0.25 × 95",
          "+0.75 / +0.25 × 5",
        ],
        0,
        "The new sphere is +0.50, cylinder +0.25 and axis 95.",
      ),
      q(
        "Transpose -6.00 / +1.00 × 135:",
        [
          "-5.00 / -1.00 × 45",
          "-7.00 / -1.00 × 45",
          "-5.00 / +1.00 × 45",
          "-6.00 / -1.00 × 135",
        ],
        0,
        "The new sphere is -5.00, cylinder -1.00 and axis 45.",
      ),
      q(
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
      q(
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
      q(
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
      q(
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

function getQuestionSource(prompt) {
  if (
    /transpose|transposition|SPH|CYL|cylinder|axis|sphere|plano|ADD|optically equivalent|dioptres/i.test(
      prompt,
    )
  ) {
    return "refract-optics-contract-v1";
  }
  if (
    /objective|current prescription|proposed prescription change|subjective refinement|full refraction/i.test(
      prompt,
    )
  ) {
    return "college-routine-eye-examination";
  }
  return "refract-app-scope-v1";
}

function expandShortExplanation(explanation, source) {
  if (explanation.length >= 40) return explanation;
  if (source === "refract-optics-contract-v1") {
    return `${explanation} This keeps the equivalent optical notation explicit.`;
  }
  if (source === "college-routine-eye-examination") {
    return `${explanation} It should be checked within the complete refraction.`;
  }
  return `${explanation} It does not establish a final prescription.`;
}

export const MCQ_LEVELS = RAW_MCQ_LEVELS.map((level) => ({
  ...level,
  questions: level.questions.map((question, questionIndex) => {
    const source = getQuestionSource(question.prompt);
    return {
      ...question,
      id: `refract-${level.name.toLowerCase()}-${String(questionIndex + 1).padStart(2, "0")}`,
      explanation: expandShortExplanation(question.explanation, source),
      source,
      reviewStatus: MCQ_SOURCE_REFERENCES[source].status,
    };
  }),
}));
