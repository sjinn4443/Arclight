/*
 * MCQ question bank for Squint.
 */

(function attachMcqData(globalObj) {
  const MCQ_BANK = {
    primary: [
      {
        question:
          "One eye is suddenly down and out, lid droops, pupil is larger. Best answer?",
        options: [
          "3rd nerve palsy",
          "4th nerve palsy",
          "6th nerve palsy",
          "Horner's syndrome",
        ],
        answer: 0,
        explanation: "This is the classic 3rd nerve pattern.",
      },
      {
        question:
          "One eye turns in with new side-by-side double vision. Most likely?",
        options: [
          "4th nerve palsy",
          "6th nerve palsy",
          "Horner's syndrome",
          "Adie's pupil",
        ],
        answer: 1,
        explanation:
          "6th nerve weakness reduces outward movement, so the eye sits in.",
      },
      {
        question: "Slight lid droop plus a small pupil on one side fits:",
        options: [
          "3rd nerve palsy",
          "Horner's syndrome",
          "4th nerve palsy",
          "Benign anisocoria",
        ],
        answer: 1,
        explanation: "Horner's is usually subtle: ptosis + small pupil.",
      },
      {
        question: "Both pupils are large. Best description?",
        options: [
          "Unilateral 3rd nerve palsy",
          "Bilateral dilated pupils",
          "Bilateral constricted pupils",
          "Horner's syndrome",
        ],
        answer: 1,
        explanation:
          "Large pupils in both eyes is a bilateral dilated pattern.",
      },
      {
        question:
          "Small stable pupil size difference, normal reactions, no red flags. Most likely:",
        options: [
          "Benign anisocoria",
          "3rd nerve palsy",
          "Adie's pupil",
          "Acute Horner's syndrome",
        ],
        answer: 0,
        explanation: "A small stable asymmetry is often benign anisocoria.",
      },
    ],
    intermediate: [
      {
        question:
          "Eye is up and out with vertical diplopia and compensatory head tilt. Most likely:",
        options: [
          "3rd nerve palsy",
          "4th nerve palsy",
          "6th nerve palsy",
          "Horner's syndrome",
        ],
        answer: 1,
        explanation:
          "4th nerve palsy often gives hypertropia and torsional/vertical symptoms.",
      },
      {
        question:
          "One very large tonic pupil without major motility deficit suggests:",
        options: [
          "Adie's pupil",
          "6th nerve palsy",
          "Horner's syndrome",
          "Bilateral constricted pupils",
        ],
        answer: 0,
        explanation:
          "Adie's pupil is typically unilateral and larger with poor near/light response.",
      },
      {
        question: "Which feature makes 3rd nerve palsy more urgent?",
        options: [
          "Small ptosis only",
          "Pupil dilation with sudden onset",
          "Mild exotropia only",
          "Stable anisocoria",
        ],
        answer: 1,
        explanation:
          "Acute 3rd nerve palsy with pupil involvement is high-risk and urgent.",
      },
      {
        question:
          "Horizontal diplopia that worsens toward gaze on affected side best matches:",
        options: [
          "6th nerve palsy",
          "4th nerve palsy",
          "Horner's syndrome",
          "Adie's pupil",
        ],
        answer: 0,
        explanation: "Abduction deficit is classic for 6th nerve palsy.",
      },
      {
        question:
          "Ptosis without clear motility deficit plus miosis points to:",
        options: [
          "Horner's syndrome",
          "3rd nerve palsy",
          "4th nerve palsy",
          "Bilateral constricted pupils",
        ],
        answer: 0,
        explanation:
          "Horner's can look subtle but combines ptosis with a smaller pupil.",
      },
      {
        question: "Deviation is more inward in upgaze than downgaze. This is:",
        options: [
          "A-pattern esotropia",
          "V-pattern esotropia",
          "A-pattern exotropia",
          "Simple ptosis",
        ],
        answer: 0,
        explanation:
          "A-pattern means horizontal deviation is stronger in upgaze.",
      },
      {
        question: "Deviation is more outward in downgaze than upgaze. This is:",
        options: [
          "A-pattern exotropia",
          "V-pattern exotropia",
          "A-pattern esotropia",
          "Horner pattern",
        ],
        answer: 1,
        explanation:
          "V-pattern means horizontal deviation is stronger in downgaze.",
      },
    ],
    advanced: [
      {
        question:
          "Sudden painful diplopia, down-and-out eye, severe ptosis, dilated pupil. Strongest pattern?",
        options: [
          "Definite 3rd nerve palsy",
          "Definite 4th nerve palsy",
          "Definite 6th nerve palsy",
          "Benign anisocoria",
        ],
        answer: 0,
        explanation: "This is a high-confidence 3rd nerve palsy pattern.",
      },
      {
        question:
          "Large esotropia with sudden onset and little vertical element: strongest fit?",
        options: [
          "3rd nerve palsy",
          "6th nerve palsy",
          "4th nerve palsy",
          "Mixed squint only",
        ],
        answer: 1,
        explanation:
          "Large inward deviation in this model maps to stronger 6th nerve palsy likelihood.",
      },
      {
        question:
          "If both eyes show similar very large pupils, pupil logic should conclude:",
        options: [
          "Bilateral dilated pupils",
          "Unilateral Adie's likely",
          "Asymmetric urgent 3rd palsy",
          "Horner's syndrome",
        ],
        answer: 0,
        explanation:
          "The app treats equal very large pupils as a bilateral dilated pattern, not anisocoria.",
      },
      {
        question:
          "Subtle ptosis + miosis + faded iris flag, no major horizontal/vertical deviation. Best fit?",
        options: [
          "Possible 6th nerve palsy",
          "Probable/definite Horner pattern",
          "Definite 4th nerve palsy",
          "Mixed squint",
        ],
        answer: 1,
        explanation:
          "Combined ptosis/miosis/faded features increase Horner confidence.",
      },
      {
        question:
          "When signs point in multiple directions without clean cranial nerve pattern, app should output:",
        options: [
          "Single definitive palsy always",
          "Mixed pattern category",
          "No output",
          "Force Horner",
        ],
        answer: 1,
        explanation:
          "Mixed findings should remain mixed rather than over-forced.",
      },
      {
        question: "Cyclo IN/OUT tick on one side is most consistent with:",
        options: [
          "Torsional/4th nerve pattern",
          "Pure 6th nerve palsy only",
          "Benign anisocoria only",
          "No clinical relevance",
        ],
        answer: 0,
        explanation:
          "Cyclo signs support torsional involvement, often 4th nerve related.",
      },
      {
        question: "Horizontal jerk movement of both eyes best describes:",
        options: ["Nystagmus", "Ptosis", "Anisocoria", "Fixed ophthalmoplegia"],
        answer: 0,
        explanation: "Oscillatory eye movement is nystagmus.",
      },
      {
        question: "Cyclo IN on one side is best read as:",
        options: [
          "Torsional pattern (intorsion)",
          "Pure pupil problem only",
          "6th nerve pattern only",
          "No useful sign",
        ],
        answer: 0,
        explanation: "Cyclo IN/OUT supports torsional pattern recognition.",
      },
      {
        question: "Fast horizontal jerk nystagmus is most consistent with:",
        options: [
          "Jerk nystagmus",
          "Pendular nystagmus",
          "Isolated ptosis",
          "Benign anisocoria",
        ],
        answer: 0,
        explanation: "Fast phase plus slow drift pattern is jerk nystagmus.",
      },
      {
        question: "Vertical jerk nystagmus should prompt concern for:",
        options: [
          "Central pathway cause",
          "Simple refractive error",
          "Benign anisocoria",
          "Isolated dry eye",
        ],
        answer: 0,
        explanation:
          "Vertical nystagmus is a central warning sign until proven otherwise.",
      },
      {
        question:
          "Nystagmus mainly seen with cover testing in a child is most in keeping with:",
        options: [
          "Latent nystagmus-like pattern",
          "Isolated 6th nerve palsy",
          "Benign anisocoria",
          "Adie's pupil",
        ],
        answer: 0,
        explanation:
          "Latent nystagmus patterns are commonly linked to early binocular development disturbance.",
      },
      {
        question: "Gaze-dependent jerk nystagmus is most suggestive of:",
        options: [
          "Gaze-evoked nystagmus-like pattern",
          "Pure Horner pattern",
          "Simple ptosis only",
          "Retinal reflex asymmetry",
        ],
        answer: 0,
        explanation:
          "Gaze-evoked nystagmus patterns raise concern for central or medication-related causes.",
      },
      {
        question:
          "A/V cue appears only after up/down testing. Best interpretation:",
        options: [
          "Dynamic pattern clue from gaze testing",
          "Fixed anisocoria result",
          "No clinical value",
          "Only pupil-size artefact",
        ],
        answer: 0,
        explanation: "A/V cues are dynamic and need gaze-position comparison.",
      },
      {
        question: "A-pattern exotropia means:",
        options: [
          "Exotropia larger in upgaze than downgaze",
          "Exotropia larger in downgaze than upgaze",
          "Esotropia larger in upgaze",
          "Pure vertical pattern only",
        ],
        answer: 0,
        explanation:
          "For A-pattern, horizontal deviation is stronger in upgaze.",
      },
      {
        question:
          "Elevation limited mainly in adduction is most in keeping with:",
        options: [
          "Brown syndrome-like pattern",
          "Pure 6th nerve palsy",
          "Bilateral mydriasis",
          "Simple anisocoria",
        ],
        answer: 0,
        explanation:
          "Brown syndrome classically limits elevation in adduction.",
      },
      {
        question:
          "Marked abduction deficit with esotropic tendency and retraction-style pattern suggests:",
        options: [
          "Duane type I-like pattern",
          "4th nerve palsy only",
          "Horner pattern",
          "Acute Adie pupil",
        ],
        answer: 0,
        explanation:
          "Duane type I is abduction-limited and often esotropic in primary position.",
      },
      {
        question:
          "One eye drifting upward in a dissociated manner best matches:",
        options: [
          "DVD-like pattern",
          "Pure 6th nerve palsy",
          "Isolated miosis",
          "Retinal reflex asymmetry",
        ],
        answer: 0,
        explanation: "DVD is a dissociated vertical drift pattern.",
      },
    ],
  };

  globalObj.McqData = { MCQ_BANK };
})(typeof globalThis !== "undefined" ? globalThis : window);
