/*
 * MCQ question bank for Squint.
 */

(function attachMcqData(globalObj) {
  const MCQ_BANK = {
    primary: [
      {
        question:
          "During cover-uncover testing, covering the fixing eye makes the fellow uncovered eye move to take fixation. What does this demonstrate?",
        options: [
          "A manifest deviation (tropia)",
          "A latent deviation only",
          "An RAPD",
          "Normal near convergence",
        ],
        answer: 0,
        explanation:
          "Movement of the uncovered eye to take fixation demonstrates a manifest deviation.",
      },
      {
        question:
          "Which test most fully dissociates the eyes to reveal a latent deviation?",
        options: [
          "Alternate cover test",
          "Near pupil test",
          "Direct light test",
          "Corneal reflex inspection alone",
        ],
        answer: 0,
        explanation:
          "Alternating the cover breaks fusion and reveals the total latent plus manifest deviation.",
      },
      {
        question:
          "One eye is suddenly down and out with ptosis and a larger poorly reactive pupil. Best response?",
        options: [
          "Emergency assessment for a pupil-involving 3rd nerve palsy",
          "Routine review for benign anisocoria",
          "Observe as a simple phoria",
          "Treat as isolated ptosis",
        ],
        answer: 0,
        explanation:
          "An acute pupil-involving 3rd nerve pattern requires emergency neurovascular assessment.",
      },
      {
        question:
          "One eye turns in, cannot abduct fully and has new horizontal diplopia. Most likely pattern?",
        options: [
          "4th nerve palsy",
          "6th nerve palsy",
          "Horner syndrome",
          "Adie's pupil",
        ],
        answer: 1,
        explanation:
          "6th nerve weakness reduces outward movement, so the eye sits in.",
      },
      {
        question:
          "An eye sits clearly outward in primary position without a named nerve pattern. Best description?",
        options: ["Exotropia", "Esotropia", "Hypertropia", "Ptosis"],
        answer: 0,
        explanation: "An outward manifest alignment is described as exotropia.",
      },
      {
        question: "Both pupils are clearly large. Best descriptive finding?",
        options: [
          "Bilateral dilated pupils",
          "Unilateral anisocoria",
          "Bilateral constricted pupils",
          "RAPD",
        ],
        answer: 0,
        explanation:
          "Large pupils in both eyes is a bilateral dilated pattern.",
      },
      {
        question:
          "One pupil is smaller but no other condition has been established. Best initial description?",
        options: [
          "Unilateral miosis",
          "Definite Horner syndrome",
          "Definite 3rd nerve palsy",
          "RAPD",
        ],
        answer: 0,
        explanation:
          "Pupil size alone should remain a descriptive finding until reactions and context are checked.",
      },
      {
        question: "A markedly drooping upper lid is best described as:",
        options: ["Severe ptosis", "Exotropia", "Mydriasis", "Nystagmus"],
        answer: 0,
        explanation: "Ptosis describes drooping of the upper eyelid.",
      },
      {
        question:
          "A small stable pupil difference with normal reactions and no red flags is most consistent with:",
        options: [
          "Physiological anisocoria",
          "Pupil-involving 3rd nerve palsy",
          "Acute angle closure",
          "Marked RAPD",
        ],
        answer: 0,
        explanation:
          "Small stable anisocoria with normal reactions is commonly physiological.",
      },
      {
        question:
          "In a normal light response, shining the torch into one eye should:",
        options: [
          "Constrict both pupils",
          "Constrict only the illuminated pupil",
          "Dilate both pupils",
          "Move both eyes outward",
        ],
        answer: 0,
        explanation:
          "The illuminated pupil has a direct response and the fellow pupil has a consensual response.",
      },
    ],
    intermediate: [
      {
        question:
          "Hypertropia worsens in adduction and downgaze, with extorsion and compensatory head tilt. Most likely:",
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
          "One large tonic pupil with poor light reaction but better near response suggests:",
        options: [
          "Adie's pupil",
          "6th nerve palsy",
          "Horner's syndrome",
          "Bilateral constricted pupils",
        ],
        answer: 0,
        explanation:
          "Adie's pupil typically reacts poorly to light but constricts more clearly to a near target.",
      },
      {
        question:
          "Mild ptosis and miosis become more noticeable in the dark because the smaller pupil dilates slowly. Best fit?",
        options: [
          "Horner syndrome",
          "Adie's pupil",
          "6th nerve palsy",
          "Physiological mydriasis",
        ],
        answer: 0,
        explanation:
          "Miosis, mild ptosis and dilation lag form a Horner pattern.",
      },
      {
        question:
          "When the torch swings to an eye with a marked RAPD, what should happen?",
        options: [
          "Both pupils dilate relative to the previous constriction",
          "Only the affected pupil constricts further",
          "The pupils become unequal in size permanently",
          "Both eyes converge",
        ],
        answer: 0,
        explanation:
          "The weaker afferent signal causes both pupils to dilate when the light reaches the affected eye.",
      },
      {
        question:
          "A moderate abduction deficit with horizontal diplopia is most consistent with:",
        options: [
          "Partial 6th nerve palsy",
          "Adie pupil",
          "Exophoria only",
          "Isolated ptosis",
        ],
        answer: 0,
        explanation:
          "A partial 6th nerve pattern produces an incomplete rather than total abduction deficit.",
      },
      {
        question:
          "An eye drifts outward under cover then moves inward when uncovered. This demonstrates:",
        options: [
          "Exophoria",
          "Esophoria",
          "Exotropia present throughout",
          "A pupil defect",
        ],
        answer: 0,
        explanation:
          "An outward latent drift which recovers inward is an exophoria pattern.",
      },
      {
        question:
          "An eye drifts inward under cover then moves outward when uncovered. This demonstrates:",
        options: ["Esophoria", "Exophoria", "Hypertropia", "RAPD"],
        answer: 0,
        explanation:
          "An inward latent drift which recovers outward is an esophoria pattern.",
      },
      {
        question:
          "One eye is moderately higher in primary position. Best descriptive finding?",
        options: ["Hypertropia", "Hypotropia", "Exotropia", "Miosis"],
        answer: 0,
        explanation:
          "An eye positioned higher than its fellow has a hypertropia.",
      },
      {
        question:
          "A repeated slow drift with a corrective fast phase describes:",
        options: ["Jerk nystagmus", "Pendular nystagmus", "Ptosis", "Phoria"],
        answer: 0,
        explanation:
          "Jerk nystagmus has a slow phase and a corrective fast phase.",
      },
      {
        question: "Equal-speed oscillation in both directions describes:",
        options: ["Pendular nystagmus", "Jerk nystagmus", "DVD", "RAPD"],
        answer: 0,
        explanation:
          "Pendular nystagmus has broadly similar movement in each direction.",
      },
      {
        question:
          "Why should the patient maintain fixation on an appropriate target during cover testing?",
        options: [
          "To make refixation movements interpretable",
          "To change pupil size",
          "To induce a latent deviation",
          "To replace motility testing",
        ],
        answer: 0,
        explanation:
          "Stable fixation makes movement on covering or uncovering an eye interpretable as an alignment response.",
      },
      {
        question:
          "Anisocoria is greater in bright light. Which pupil is more likely abnormal?",
        options: [
          "The larger pupil",
          "The smaller pupil",
          "Neither pupil",
          "Only the covered pupil",
        ],
        answer: 0,
        explanation:
          "Greater anisocoria in bright light suggests that the larger pupil is failing to constrict normally.",
      },
      {
        question:
          "Anisocoria is greater in the dark. Which pupil is more likely abnormal?",
        options: [
          "The smaller pupil",
          "The larger pupil",
          "Both pupils equally",
          "Only the illuminated pupil",
        ],
        answer: 0,
        explanation:
          "Greater anisocoria in the dark suggests that the smaller pupil is failing to dilate normally.",
      },
      {
        question: "What is the usual order for qualitative cover testing?",
        options: [
          "Cover-uncover first, then alternate cover",
          "Alternate cover only",
          "Near test before alignment",
          "RAPD test before fixation",
        ],
        answer: 0,
        explanation:
          "Cover-uncover first assesses manifest deviation, then alternate cover dissociates fusion further.",
      },
    ],
    advanced: [
      {
        question:
          "A new 3rd nerve palsy appears pupil-sparing. Which safety statement is most appropriate?",
        options: [
          "Pupil sparing does not exclude compression",
          "No imaging is ever required",
          "It proves a benign cause",
          "It excludes aneurysm completely",
        ],
        answer: 0,
        explanation:
          "Pupil sparing may occur in ischaemic palsy but does not safely exclude a compressive cause.",
      },
      {
        question:
          "Sudden painful ophthalmoplegia, ptosis and a dilated poorly reactive pupil is most concerning for:",
        options: [
          "A compressive 3rd nerve process",
          "Physiological anisocoria",
          "Simple exophoria",
          "Isolated refractive error",
        ],
        answer: 0,
        explanation:
          "This pupil-involving 3rd nerve pattern requires emergency neurovascular assessment.",
      },
      {
        question:
          "Pain, halos, nausea, ciliary injection and a fixed mid-dilated oval pupil suggest:",
        options: [
          "Acute angle closure",
          "Adie's pupil",
          "Benign anisocoria",
          "Exophoria",
        ],
        answer: 0,
        explanation:
          "This is an acute angle-closure pattern requiring immediate ophthalmic assessment.",
      },
      {
        question:
          "Small irregular pupils react poorly to light but constrict for near. Best pattern?",
        options: [
          "Argyll Robertson pupils",
          "Pharmacological mydriasis",
          "Marked RAPD",
          "6th nerve palsy",
        ],
        answer: 0,
        explanation:
          "Argyll Robertson pupils demonstrate light-near dissociation with small pupils.",
      },
      {
        question:
          "A large pupil has no light response and no near response, with no motility deficit. Strongest pattern?",
        options: [
          "Pharmacological mydriasis",
          "Adie's pupil",
          "Horner syndrome",
          "RAPD alone",
        ],
        answer: 0,
        explanation:
          "Failure of both light and near constriction supports pharmacological blockade more than a tonic pupil.",
      },
      {
        question:
          "Bilateral very small sluggish pupils after a miotic drug exposure are most consistent with:",
        options: [
          "Pharmacological miosis",
          "Pupil-involving 3rd nerve palsy",
          "Adie pupils",
          "Acute angle closure",
        ],
        answer: 0,
        explanation:
          "A miotic agent can produce bilateral small pupils with reduced reactivity.",
      },
      {
        question:
          "A large irregular or semi-fixed pupil after blunt trauma most strongly suggests:",
        options: [
          "Traumatic mydriasis from sphincter injury",
          "Physiological anisocoria",
          "Horner syndrome",
          "Exophoria",
        ],
        answer: 0,
        explanation:
          "Blunt trauma can tear the iris sphincter and leave a large poorly reactive pupil.",
      },
      {
        question:
          "A pupil peaked towards a traumatic wound should be treated as:",
        options: [
          "Possible open-globe injury requiring emergency assessment",
          "Benign anisocoria",
          "Isolated Adie pupil",
          "Simple phoria",
        ],
        answer: 0,
        explanation:
          "A peaked pupil after trauma is a major open-globe warning sign.",
      },
      {
        question:
          "Pain and photophobia with a small sluggish pupil after blunt trauma most strongly suggest:",
        options: [
          "Traumatic iritis",
          "Pharmacological mydriasis",
          "Physiological anisocoria",
          "6th nerve palsy",
        ],
        answer: 0,
        explanation:
          "Iris and ciliary inflammation after blunt trauma can cause painful sustained miosis.",
      },
      {
        question: "A subtle RAPD is best confirmed by:",
        options: [
          "Repeated controlled swinging-light comparison",
          "Comparing pupil size alone",
          "Cover-uncover testing",
          "Near convergence alone",
        ],
        answer: 0,
        explanation:
          "RAPD is a relative afferent response difference and may be subtle during a single swing.",
      },
      {
        question: "A-pattern exotropia means:",
        options: [
          "Exotropia is greater in downgaze than upgaze",
          "Exotropia is greater in upgaze than downgaze",
          "Esotropia is greater in downgaze",
          "Only a vertical deviation is present",
        ],
        answer: 0,
        explanation:
          "In A-pattern exotropia the outward deviation widens in downgaze.",
      },
      {
        question: "V-pattern esotropia means:",
        options: [
          "Esotropia is greater in downgaze than upgaze",
          "Esotropia is greater in upgaze than downgaze",
          "Exotropia is greater in downgaze",
          "Only ptosis varies",
        ],
        answer: 0,
        explanation:
          "In V-pattern esotropia the inward deviation is greater in downgaze.",
      },
      {
        question:
          "Elevation limited mainly in adduction is most consistent with:",
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
          "Abduction limitation with globe retraction and fissure narrowing on adduction suggests:",
        options: [
          "Duane type I-like pattern",
          "Horner syndrome",
          "Adie pupil",
          "Isolated 4th nerve palsy",
        ],
        answer: 0,
        explanation:
          "Duane type I combines reduced abduction with co-contraction signs during adduction.",
      },
      {
        question:
          "A dissociated upward drift with extorsion during occlusion is most consistent with:",
        options: [
          "DVD-like pattern",
          "Simple hypertropia only",
          "RAPD",
          "Pharmacological miosis",
        ],
        answer: 0,
        explanation:
          "Dissociated vertical deviation produces an occlusion-related upward drift and may include extorsion.",
      },
      {
        question:
          "Adduction deficit with nystagmus of the abducting fellow eye suggests:",
        options: [
          "INO-like pattern",
          "Isolated 6th nerve palsy",
          "Horner syndrome",
          "Acute angle closure",
        ],
        answer: 0,
        explanation:
          "Internuclear ophthalmoplegia combines an adduction deficit with abducting nystagmus in the fellow eye.",
      },
      {
        question:
          "Variable ptosis and motility which worsen with fatigue while pupils remain normal suggests:",
        options: [
          "Ocular myasthenia pattern",
          "Pupil-involving 3rd nerve palsy",
          "Horner syndrome",
          "RAPD",
        ],
        answer: 0,
        explanation:
          "Variability, fatigability and pupil sparing are characteristic teaching clues for ocular myasthenia.",
      },
      {
        question:
          "Restricted elevation with an otherwise pupil-sparing restrictive pattern most strongly suggests:",
        options: [
          "Thyroid eye disease pattern",
          "Adie pupil",
          "Exophoria",
          "RAPD",
        ],
        answer: 0,
        explanation:
          "Thyroid-associated restriction commonly limits elevation through inferior rectus restriction.",
      },
      {
        question:
          "Nystagmus becomes prominent when one eye is covered and its fast phase changes with the fixing eye. Best pattern?",
        options: [
          "Latent nystagmus-like pattern",
          "Gaze-evoked nystagmus",
          "Pendular nystagmus only",
          "RAPD",
        ],
        answer: 0,
        explanation:
          "Latent nystagmus is linked to disrupted binocular viewing and changes with the fixing eye.",
      },
      {
        question:
          "Jerk nystagmus appears mainly in eccentric gaze and reverses with gaze direction. Best pattern?",
        options: [
          "Gaze-evoked nystagmus-like pattern",
          "Latent nystagmus only",
          "Simple ptosis",
          "Physiological anisocoria",
        ],
        answer: 0,
        explanation:
          "Gaze-evoked nystagmus changes with eccentric gaze and can indicate central or drug-related causes.",
      },
      {
        question:
          "Persistent vertical jerk nystagmus should raise concern for:",
        options: [
          "A central pathway cause",
          "Simple refractive error",
          "Benign anisocoria",
          "Isolated dry eye",
        ],
        answer: 0,
        explanation:
          "Vertical nystagmus is a central warning pattern until assessed clinically.",
      },
      {
        question:
          "During a prism alternate cover test, the deviation is neutralised when:",
        options: [
          "No refixation movement is seen as the cover alternates",
          "Both pupils become equal",
          "The patient closes one eye",
          "The corneal reflex becomes brighter",
        ],
        answer: 0,
        explanation:
          "Prism neutralisation is reached when alternating the cover no longer produces a refixation movement.",
      },
      {
        question:
          "Multiple alignment signs do not form a clean nerve or restrictive pattern. Best output style?",
        options: [
          "Describe a mixed pattern without forcing one diagnosis",
          "Always label a 3rd nerve palsy",
          "Suppress all findings",
          "Always label Horner syndrome",
        ],
        answer: 0,
        explanation:
          "Mixed findings should remain descriptive rather than be forced into a single diagnosis.",
      },
    ],
  };

  const MCQ_SOURCE_REFERENCES = {
    "aao-cover-tests": {
      label: "AAO EyeWiki: Cover Tests",
      url: "https://eyewiki.aao.org/Cover_Tests",
      status: "current-clinical-reference",
    },
    "aao-neuro-pupil-reference": {
      label: "AAO EyeWiki: Anisocoria and acquired oculomotor nerve palsy",
      url: "https://eyewiki.aao.org/Anisocoria",
      status: "current-clinical-reference",
    },
    "aao-motility-reference": {
      label: "AAO EyeWiki: Basic Approach to Diplopia",
      url: "https://eyewiki.aao.org/Basic_Approach_to_Diplopia",
      status: "current-clinical-reference",
    },
    "squint-app-scope-v1": {
      label: "Squint simulator descriptive-output contract",
      url: null,
      status: "pending-independent-clinical-sign-off",
    },
  };

  function getQuestionSource(question) {
    if (/cover|phoria|tropia|total deviation/i.test(question.question)) {
      return "aao-cover-tests";
    }
    if (
      /pupil|anisocoria|RAPD|Horner|Adie|Argyll|angle closure|mydriasis|miosis|3rd nerve|light response|consensual/i.test(
        question.question,
      )
    ) {
      return "aao-neuro-pupil-reference";
    }
    if (
      /mixed pattern|output style|descriptive finding/i.test(question.question)
    ) {
      return "squint-app-scope-v1";
    }
    return "aao-motility-reference";
  }

  Object.entries(MCQ_BANK).forEach(([level, questions]) => {
    questions.forEach((question, questionIndex) => {
      const source = getQuestionSource(question);
      question.id = `squint-${level}-${String(questionIndex + 1).padStart(2, "0")}`;
      question.source = source;
      question.reviewStatus = MCQ_SOURCE_REFERENCES[source].status;
      if (question.explanation.length < 40) {
        question.explanation = `${question.explanation} Interpret it with the complete examination.`;
      }
    });
  });

  globalObj.McqData = { MCQ_BANK, MCQ_SOURCE_REFERENCES };
})(typeof globalThis !== "undefined" ? globalThis : window);
