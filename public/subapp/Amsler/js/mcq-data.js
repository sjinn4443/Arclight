export const MCQ_LEVELS = Object.freeze([
  {
    id: "primary",
    label: "Primary",
    questionCount: 6,
    questions: [
      {
        prompt: "What is the main purpose of an Amsler grid test?",
        options: [
          "To check central vision changes from the macula",
          "To measure blood pressure in the eye",
          "To replace full peripheral field testing",
          "To check colour vision only",
        ],
        answerIndex: 0,
        explanation:
          "Amsler is mainly for central vision symptoms linked to the macula, such as distortion or missing patches.",
      },
      {
        prompt: "How should the patient fixate during the test?",
        options: [
          "Keep looking at the central dot",
          "Look around all corners continuously",
          "Close both eyes between each line",
          "Look only at the edge of the grid",
        ],
        answerIndex: 0,
        explanation:
          "Fixation on the central dot is key. If gaze drifts, findings become less reliable.",
      },
      {
        prompt: "What does a wavy line on the grid usually suggest?",
        options: [
          "Possible metamorphopsia from macular change",
          "A normal finding in everyone",
          "Only lens dryness",
          "Peripheral retinal tear",
        ],
        answerIndex: 0,
        explanation:
          "Waviness can reflect metamorphopsia, often from macular pathology.",
      },
      {
        prompt: "Why might red mode help some users?",
        options: [
          "It can improve contrast for subtle central changes",
          "It guarantees a diagnosis",
          "It tests eye pressure directly",
          "It removes all fixation errors",
        ],
        answerIndex: 0,
        explanation:
          "Red mode is a contrast aid only. It can make subtle abnormalities easier to notice for some patients.",
      },
      {
        prompt:
          "Which area of the retina is mainly being assessed in Amsler testing?",
        options: [
          "Macula",
          "Ora serrata",
          "Optic cup only",
          "Peripheral far retina only",
        ],
        answerIndex: 0,
        explanation:
          "Amsler testing is centred on macular function and central visual perception.",
      },
      {
        prompt: "Why should each eye be tested separately?",
        options: [
          "One eye can hide the other eye's central defect",
          "It makes the pupil larger",
          "It replaces refraction",
          "It removes the need for fixation",
        ],
        answerIndex: 0,
        explanation:
          "Binocular viewing can mask a monocular problem. Testing one eye at a time gives a clearer result.",
      },
      {
        prompt:
          "What should the patient wear if they normally need near correction?",
        options: [
          "Their usual reading correction",
          "Distance glasses only in every case",
          "No correction at all",
          "Sunglasses to reduce the grid",
        ],
        answerIndex: 0,
        explanation:
          "The grid is a near task, so good near correction helps the patient inspect the lines accurately.",
      },
      {
        prompt: "What can a dark or missing patch on the grid represent?",
        options: [
          "A possible scotoma or missing area",
          "A normal blind spot in every central test",
          "A direct pressure reading",
          "A lid-position measurement",
        ],
        answerIndex: 0,
        explanation:
          "A dark or missing region can represent a perceived central scotoma and should be documented.",
      },
      {
        prompt: "When should a new Amsler change be escalated?",
        options: [
          "When it is new, worsening or affecting central vision",
          "Only after a year",
          "Only if both eyes are perfect",
          "Never, because Amsler is only a drawing task",
        ],
        answerIndex: 0,
        explanation:
          "New or progressive central distortion or missing vision needs timely clinical assessment.",
      },
      {
        prompt: "What do the diagonal lines help with?",
        options: [
          "Maintaining fixation when central loss makes the dot harder to use",
          "Measuring intraocular pressure",
          "Testing far peripheral field only",
          "Making all results diagnostic",
        ],
        answerIndex: 0,
        explanation:
          "Diagonals can help some patients keep oriented toward the centre when central vision is reduced.",
      },
      {
        prompt: "Which tool is best for marking haemorrhage-like red areas?",
        options: [
          "The red haemorrhage tool",
          "The erase tool",
          "The patient details button",
          "The report button",
        ],
        answerIndex: 0,
        explanation:
          "The red tool is intended for red or blood-like marks while black is for dark or wavy marks.",
      },
      {
        prompt: "What does Nil mean in the result area?",
        options: [
          "No drawn defect has been detected for that eye",
          "The eye has perfect macular health",
          "The test is invalid",
          "The patient has no need for glasses",
        ],
        answerIndex: 0,
        explanation:
          "Nil means the app has not found a drawn defect for that eye. It is not a clinical all-clear by itself.",
      },
    ],
  },
  {
    id: "intermediate",
    label: "Intermediate",
    questionCount: 8,
    questions: [
      {
        prompt:
          "Amsler abnormalities are most sensitive for dysfunction in which pathway segment?",
        options: [
          "Central macular visual processing",
          "Vestibular pathways",
          "Auditory cortex",
          "Extraocular muscle tendon reflexes",
        ],
        answerIndex: 0,
        explanation:
          "The tool targets central visual perception linked to macular function.",
      },
      {
        prompt: "Why test one eye at a time with correction?",
        options: [
          "To avoid binocular compensation masking monocular defects",
          "Because binocular testing is always invalid",
          "To increase pupil size",
          "To reduce retinal blood-flow artefact",
        ],
        answerIndex: 0,
        explanation:
          "Binocular viewing can conceal unilateral deficits, while monocular testing improves detection.",
      },
      {
        prompt:
          "Which symptom pattern should raise concern for possible active wet AMD?",
        options: [
          "Recent-onset central distortion with progression over days to weeks",
          "Stable mild blur unchanged for years",
          "Transient itch after eye drops",
          "Peripheral flashes only with no central complaints",
        ],
        answerIndex: 0,
        explanation:
          "Rapidly changing central distortion is a key red flag and needs timely assessment.",
      },
      {
        prompt:
          "In diabetic retinopathy follow-up, Amsler changes are most useful as:",
        options: [
          "A patient-facing functional symptom tracker between visits",
          "A replacement for retinal imaging",
          "A pressure measurement substitute",
          "A complete staging system",
        ],
        answerIndex: 0,
        explanation:
          "It supports symptom monitoring but does not replace structural clinical assessment.",
      },
      {
        prompt:
          "What is a practical reason to compare standard and red mode findings?",
        options: [
          "Concordant defects across modes increase confidence in a true perceptual change",
          "One mode should always be ignored",
          "Red mode should replace standard mode completely",
          "Only standard mode can detect central loss",
        ],
        answerIndex: 0,
        explanation:
          "Cross-mode consistency can reduce noise from attention or contrast preference effects.",
      },
      {
        prompt: "Which history detail best supports urgency stratification?",
        options: [
          "Exact onset trend: sudden, stepwise or slowly progressive",
          "Favourite television channel",
          "Dominant foot",
          "Usual coffee order",
        ],
        answerIndex: 0,
        explanation: "Temporal pattern helps estimate risk and urgency.",
      },
      {
        prompt: "Amsler reports can underestimate defects when:",
        options: [
          "Fixation is unstable or the patient scans rather than fixates",
          "Lighting is moderate",
          "The chart is square",
          "The patient is seated",
        ],
        answerIndex: 0,
        explanation:
          "Scanning behaviour can blur local distortions and reduce mapping accuracy.",
      },
      {
        prompt: "Best wording to ask about subtle change is:",
        options: [
          "Are any lines less clear, bent, faded or missing compared with your usual view?",
          "You have no changes, right?",
          "Is everything perfect?",
          "Do you only see red lines?",
        ],
        answerIndex: 0,
        explanation:
          "Neutral, descriptive prompts reduce leading bias and improve symptom capture.",
      },
      {
        prompt: "Why document which eye was tested?",
        options: [
          "Macular symptoms and drawings can be very different between eyes",
          "The right eye is always worse",
          "Left-eye findings cannot matter clinically",
          "Eye labels only change the report colour",
        ],
        answerIndex: 0,
        explanation:
          "Eye-specific documentation helps compare symptoms and avoids losing unilateral changes.",
      },
      {
        prompt:
          "What does a central percentage in the result aim to summarise?",
        options: [
          "How much of the defect overlaps the central zone",
          "The patient's visual acuity",
          "The intraocular pressure",
          "The size of the optic disc",
        ],
        answerIndex: 0,
        explanation:
          "The central value estimates how much drawn defect burden lies in the central grid region.",
      },
      {
        prompt:
          "What is the safest interpretation of a normal-looking Amsler test?",
        options: [
          "No defect was reported or drawn during this test",
          "Macular disease is impossible",
          "OCT is unnecessary forever",
          "Peripheral retina is fully normal",
        ],
        answerIndex: 0,
        explanation:
          "A normal Amsler result can be reassuring but does not exclude all macular or retinal disease.",
      },
      {
        prompt: "Which patient instruction reduces false reassurance?",
        options: [
          "Keep looking at the dot and report if lines disappear rather than chasing them",
          "Follow every wavy line with your eyes",
          "Blink only after the test is finished",
          "Ignore missing areas if they move",
        ],
        answerIndex: 0,
        explanation:
          "Patients may compensate by scanning; fixation instructions help keep the test meaningful.",
      },
      {
        prompt:
          "What does a newly enlarged central missing patch suggest in follow-up?",
        options: [
          "Possible progression needing clinical review",
          "Improved central vision",
          "A better lighting condition only",
          "A normal learning effect",
        ],
        answerIndex: 0,
        explanation:
          "Increasing central involvement is a meaningful change and should be correlated clinically.",
      },
      {
        prompt: "Why does the app store drawings separately for RE and LE?",
        options: [
          "To preserve monocular findings for comparison",
          "To make the report longer",
          "To force both eyes to look identical",
          "To hide left-eye defects",
        ],
        answerIndex: 0,
        explanation:
          "Separate stroke stores keep each eye's perceived defects distinct.",
      },
      {
        prompt: "Which symptom is most aligned with metamorphopsia?",
        options: [
          "Straight grid lines appearing bent or warped",
          "A gritty lid sensation only",
          "A headache without visual change",
          "A brief sneeze during testing",
        ],
        answerIndex: 0,
        explanation:
          "Metamorphopsia is perceived distortion, often described as bending or warping of straight lines.",
      },
      {
        prompt: "Why might poor near correction reduce test quality?",
        options: [
          "Blur can make grid detail harder to judge",
          "It changes the macula's anatomy",
          "It improves fixation reliability",
          "It makes colour testing unnecessary",
        ],
        answerIndex: 0,
        explanation:
          "Uncorrected near blur can make subtle distortion or missing areas harder to report.",
      },
      {
        prompt: "What does a report screenshot mainly provide?",
        options: [
          "A record of the drawn defects and computed summary",
          "A definitive diagnosis",
          "A replacement for visual acuity",
          "A guarantee that fixation was perfect",
        ],
        answerIndex: 0,
        explanation:
          "The screenshot is documentation of the app session, not a diagnostic endpoint.",
      },
      {
        prompt: "Which defect description is most useful in notes?",
        options: [
          "New central waviness in RE, worse than last week",
          "Looks odd",
          "Patient unsure, no eye recorded",
          "Amsler done",
        ],
        answerIndex: 0,
        explanation:
          "Eye, location, symptom type and time course make the note more actionable.",
      },
    ],
  },
  {
    id: "advanced",
    label: "Advanced",
    questionCount: 8,
    questions: [
      {
        prompt:
          "For longitudinal monitoring, which parameter is most clinically useful from this app output?",
        options: [
          "Trend in central involvement percentage over serial tests",
          "Single-session screenshot colour tone",
          "Screen brightness at time of test only",
          "Whether the patient used left or right hand",
        ],
        answerIndex: 0,
        explanation:
          "Serial trend in central burden can support progression assessment alongside exam findings.",
      },
      {
        prompt:
          "Why should Amsler findings be integrated with history rather than interpreted in isolation?",
        options: [
          "Perceptual reports are subjective and influenced by fixation, cognition and contrast conditions",
          "Amsler is objective enough to replace all retinal workup",
          "History does not alter risk interpretation",
          "Only OCT is subjective",
        ],
        answerIndex: 0,
        explanation:
          "Amsler is symptom-driven, so contextual history is essential for meaningful interpretation.",
      },
      {
        prompt:
          "A patient reports subtle new central metamorphopsia over 48 hours. Most appropriate next step is:",
        options: [
          "Escalate for timely retinal assessment and document progression details",
          "Reassure and defer for 12 months",
          "Repeat Amsler only and avoid referral",
          "Switch to peripheral-only testing",
        ],
        answerIndex: 0,
        explanation:
          "Rapid central change requires prompt clinical correlation and triage.",
      },
      {
        prompt:
          "Which question best differentiates stable chronic from active evolving macular symptoms?",
        options: [
          "Has the distortion changed in size or intensity since it first appeared, and over what interval?",
          "Do you prefer dark mode?",
          "Have you had recent dental work?",
          "Is one eye dominant?",
        ],
        answerIndex: 0,
        explanation: "Progression trajectory is central to risk assessment.",
      },
      {
        prompt:
          "In structured follow-up, what improves reproducibility the most?",
        options: [
          "Consistent test distance, correction, fixation instruction and monocular sequence",
          "Changing chart size each visit",
          "Alternating random viewing angles",
          "Testing only after prolonged dark adaptation",
        ],
        answerIndex: 0,
        explanation:
          "Protocol consistency reduces measurement noise and improves comparability.",
      },
      {
        prompt:
          "Why can a central lesion be under-represented by purely centroid-based labelling?",
        options: [
          "A straddling defect may have centroid outside fixation while still involving central retina",
          "Centroids always overestimate central involvement",
          "Centroids cannot be computed for polygons",
          "Centroids only work in 3D retinal maps",
        ],
        answerIndex: 0,
        explanation:
          "Overlap-based zone analysis better captures central involvement for irregular shapes.",
      },
      {
        prompt: "Which statement about red-grid mode is most defensible?",
        options: [
          "It is an adjunctive perceptual contrast strategy, not a diagnostic endpoint",
          "It confirms wet AMD when lines look curved",
          "It invalidates standard mode findings",
          "It is only useful for glaucoma staging",
        ],
        answerIndex: 0,
        explanation:
          "Red mode can aid detection but does not independently diagnose cause.",
      },
      {
        prompt:
          "For diabetic macular risk discussions, what phrasing is most useful?",
        options: [
          "Ask for new central blur or distortion, progression pace and effect on reading or faces",
          "Ask only if pain is severe",
          "Ask only about floaters",
          "Avoid discussing functional impact",
        ],
        answerIndex: 0,
        explanation:
          "Function-focused symptom history supports triage and patient-centred decision making.",
      },
      {
        prompt:
          "Why is convex-hull area only an approximation of Amsler defect burden?",
        options: [
          "It encloses the drawn shape and may include space the patient did not mark",
          "It measures photoreceptor density directly",
          "It excludes every central defect",
          "It cannot use two-dimensional points",
        ],
        answerIndex: 0,
        explanation:
          "Hull methods are fast and useful for summaries but can overestimate irregular or crescent-shaped marks.",
      },
      {
        prompt: "Which scenario most risks a false negative Amsler result?",
        options: [
          "A patient with poor fixation scans across the grid to find missing areas",
          "A patient uses near correction",
          "Each eye is covered in turn",
          "The patient reports new distortion",
        ],
        answerIndex: 0,
        explanation:
          "Scanning can compensate for a defect and make the grid seem more complete than it is.",
      },
      {
        prompt: "Which documentation best supports clinical handover?",
        options: [
          "Eye, onset, progression, defect location and screenshot",
          "Only the button colour used",
          "Only whether the app opened",
          "Only the patient's device type",
        ],
        answerIndex: 0,
        explanation:
          "Handover is stronger when the symptom, time course and mapped defect are all recorded.",
      },
      {
        prompt: "What is the main limitation of using percentage area alone?",
        options: [
          "Small central defects can matter more than larger peripheral marks",
          "Percentages cannot be displayed",
          "Percentages always identify the diagnosis",
          "Peripheral marks are always urgent",
        ],
        answerIndex: 0,
        explanation:
          "Location and symptom context matter; central involvement can carry high functional significance.",
      },
      {
        prompt: "When comparing serial tests, which change is most concerning?",
        options: [
          "A new or enlarging central defect with matching symptoms",
          "A different random option order in MCQs",
          "A report generated on a different weekday",
          "A patient using the same near glasses",
        ],
        answerIndex: 0,
        explanation:
          "A reproducible central change with symptoms is more clinically meaningful than app-session details.",
      },
      {
        prompt:
          "Why should clinical advice avoid saying the app has diagnosed wet AMD?",
        options: [
          "Amsler suggests functional change but cannot establish the cause",
          "Wet AMD never causes distortion",
          "Only colour mode can diagnose it",
          "Amsler results are unrelated to the macula",
        ],
        answerIndex: 0,
        explanation:
          "The app can flag concerning symptoms but diagnosis requires clinical examination and imaging where appropriate.",
      },
      {
        prompt:
          "Which factor can reduce comparability between two Amsler sessions?",
        options: [
          "Different viewing distance or correction",
          "Recording the eye label",
          "Using the same fixation instruction",
          "Testing in the same sequence",
        ],
        answerIndex: 0,
        explanation:
          "Changes in distance or correction can alter perceived grid size and clarity.",
      },
      {
        prompt:
          "What is the safest use of the app's central and peripheral split?",
        options: [
          "As a structured documentation aid alongside clinical judgement",
          "As a stand-alone referral rule for every patient",
          "As a replacement for symptoms",
          "As proof that peripheral retina has been fully examined",
        ],
        answerIndex: 0,
        explanation:
          "The split helps organise findings but should be interpreted with symptoms and examination.",
      },
      {
        prompt: "Which patient group may need extra care with instructions?",
        options: [
          "Patients with cognitive, fixation or communication difficulty",
          "Patients who can read the chart clearly",
          "Patients tested one eye at a time",
          "Patients using their usual near correction",
        ],
        answerIndex: 0,
        explanation:
          "The test depends on understanding, steady fixation and accurate symptom reporting.",
      },
      {
        prompt:
          "Which finding is most consistent with metamorphopsia rather than a pure absolute scotoma?",
        options: [
          "Lines bend around a region but remain visible",
          "The entire grid is absent",
          "Only eye pressure is high",
          "The peripheral far field is missing with no central symptom",
        ],
        answerIndex: 0,
        explanation:
          "Metamorphopsia is distortion of visible structure, while a scotoma is a missing or dark area.",
      },
    ],
  },
]);
