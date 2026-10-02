export const MCQ_SOURCE_REGISTRY = Object.freeze({
  "NICE-NG82": Object.freeze({
    title: "NICE NG82: Age-related macular degeneration",
    url: "https://www.nice.org.uk/guidance/ng82/chapter/Recommendations",
  }),
  "NCBI-AMSLER": Object.freeze({
    title: "NCBI Bookshelf: Amsler Grid",
    url: "https://www.ncbi.nlm.nih.gov/books/NBK538141/",
  }),
});

const MCQ_REVIEW_STATUS = "Independent clinical sign-off pending";

const MCQ_LEVEL_DEFINITIONS = [
  {
    id: "primary",
    label: "Primary",
    questionCount: 6,
    passScore: 4,
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
        prompt: "Which setup best supports a useful Amsler observation?",
        options: [
          "Good lighting, usual near correction and a consistent reading distance",
          "A dark room without near correction",
          "Both eyes open at an unmeasured distance",
          "Immediately after a bright fundus light",
        ],
        answerIndex: 0,
        explanation:
          "Consistent lighting, near correction and distance make subtle distortion or missing areas easier to compare.",
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
        prompt: "Which description best represents metamorphopsia?",
        options: [
          "Straight lines appear bent, bowed or warped",
          "The entire peripheral field is absent",
          "Eye pressure feels raised",
          "Colours are named incorrectly with an otherwise normal grid",
        ],
        answerIndex: 0,
        explanation:
          "Metamorphopsia is distortion of visible form, commonly described as straight grid lines appearing bent or warped.",
      },
      {
        prompt:
          "What should happen if a patient cannot see all four grid corners while fixating the centre?",
        options: [
          "Arrange broader clinical and visual-field assessment rather than assuming a central-only defect",
          "Record it as a normal Amsler result",
          "Open both eyes and repeat until the corners appear",
          "Treat the missing corners as proof of wet AMD",
        ],
        answerIndex: 0,
        explanation:
          "Failure to see all four corners can reflect field loss beyond the central macular question and needs wider assessment.",
      },
    ],
  },
  {
    id: "intermediate",
    label: "Intermediate",
    questionCount: 8,
    passScore: 6,
    questions: [
      {
        prompt: "Why does Amsler chart 4 use random dots without grid lines?",
        options: [
          "To help distinguish a missing area from distortion of visible form",
          "To measure intraocular pressure",
          "To test colour naming",
          "To map the far peripheral field",
        ],
        answerIndex: 0,
        explanation:
          "Without visible lines to bend, the random-dot chart can help separate scotoma from metamorphopsia.",
      },
      {
        prompt:
          "Why is the physiological blind spot usually outside a standard Amsler result?",
        options: [
          "The grid reaches about 10 degrees temporal to fixation while the blind spot is usually near 15 degrees",
          "The optic disc has no relationship to the visual field",
          "Both eyes are tested together",
          "The grid removes all physiological scotomas",
        ],
        answerIndex: 0,
        explanation:
          "At the standard distance, the grid covers roughly 10 degrees each side of fixation, short of the usual blind-spot location.",
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
        prompt: "What is an important limitation of an Amsler grid?",
        options: [
          "It is a subjective central-field screen and does not replace retinal examination or imaging",
          "It measures intraocular pressure only",
          "It reliably excludes all macular disease",
          "It is a complete peripheral-field test",
        ],
        answerIndex: 0,
        explanation:
          "Amsler findings depend on fixation and patient report. They should be interpreted with history and clinical assessment.",
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
          "While fixating centrally, what should the patient compare across the grid?",
        options: [
          "Whether lines remain straight and continuous and whether any area is blurred or missing",
          "Whether the pupil becomes larger",
          "Whether peripheral finger counting improves",
          "Whether the optic disc appears pale",
        ],
        answerIndex: 0,
        explanation:
          "The grid is used to report distortion, breaks, blur or missing areas while fixation stays on the centre.",
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
        prompt:
          "Why should the patient mark the location of an abnormal region on the grid?",
        options: [
          "A dated map can support comparison for progression, stability or improvement",
          "The mark directly diagnoses the retinal cause",
          "A drawing replaces the need to record symptoms",
          "Only the number of marks matters",
        ],
        answerIndex: 0,
        explanation:
          "Mapping the perceived area makes later change easier to compare, although the drawing remains subjective.",
      },
      {
        prompt:
          "Which description is most consistent with micropsia on an Amsler grid?",
        options: [
          "Squares appear smaller as nearby lines seem drawn towards one another",
          "Squares appear larger as lines curve away from one another",
          "The whole grid becomes a pressure scale",
          "Only the far peripheral field disappears",
        ],
        answerIndex: 0,
        explanation:
          "Micropsia can make grid spacing look compressed, while macropsia can make spacing appear widened.",
      },
      {
        prompt:
          "Why should the standard test usually be completed before pharmacological dilation?",
        options: [
          "Dilation can reduce near-task clarity and change the standard test conditions",
          "Dilation proves that a scotoma is absolute",
          "Dilation converts the grid into perimetry",
          "Dilation removes the need for monocular testing",
        ],
        answerIndex: 0,
        explanation:
          "Standard technique uses near correction without dilating the pupil so that near viewing conditions remain suitable.",
      },
      {
        prompt:
          "At 33 cm, approximately how much visual angle does one standard 5 mm grid square subtend?",
        options: ["1 degree", "10 degrees", "20 degrees", "45 degrees"],
        answerIndex: 0,
        explanation:
          "A standard 10 cm grid has 20 squares per side and spans about 20 degrees at 33 cm, so each square is about 1 degree.",
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
    passScore: 6,
    questions: [
      {
        prompt:
          "At the usual test distance, an Amsler grid primarily samples which field?",
        options: [
          "The central visual field around fixation",
          "The far peripheral field only",
          "The binocular field with both eyes open",
          "The field beyond the ora serrata",
        ],
        answerIndex: 0,
        explanation:
          "The standard grid is a central-field test designed to reveal distortion or scotoma near fixation.",
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
          "Which Amsler chart design is intended to reveal finer defects close to fixation?",
        options: [
          "A central area with smaller squares subtending about 0.5 degrees",
          "A chart with no fixation target",
          "A chart viewed with both eyes open",
          "A far-peripheral confrontation target",
        ],
        answerIndex: 0,
        explanation:
          "Amsler chart 7 uses smaller central squares to show fine metamorphopsia or small scotomas near fixation.",
      },
      {
        prompt: "Why can a central scotoma make the Amsler test less reliable?",
        options: [
          "The fixation target may be hard to see, encouraging eccentric fixation or scanning",
          "A central scotoma always straightens distorted lines",
          "It converts the test into a pressure measurement",
          "It guarantees that both eyes give the same result",
        ],
        answerIndex: 0,
        explanation:
          "If central fixation is unstable, the patient may look around the defect and under-report it.",
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
          "Why should Amsler testing not follow immediately after intense retinal illumination?",
        options: [
          "A transient photostress effect can alter central visual perception",
          "It permanently enlarges the optic cup",
          "It makes near correction unnecessary",
          "It converts metamorphopsia into a peripheral defect",
        ],
        answerIndex: 0,
        explanation:
          "Bright retinal illumination can briefly affect central vision and confound the observation.",
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
        prompt: "How may a relative scotoma appear on an Amsler grid?",
        options: [
          "As a veil or haze partly obscuring the smaller squares",
          "As a reliable intraocular-pressure value",
          "As an enlarged physiological blind spot on every test",
          "As a normal result whenever lines remain visible",
        ],
        answerIndex: 0,
        explanation:
          "A relative scotoma can reduce visibility without making the area completely absent.",
      },
      {
        prompt:
          "Which mechanism can make a small scotoma less noticeable during Amsler testing?",
        options: [
          "Perceptual completion can fill in missing visual information",
          "The grid directly restores photoreceptor function",
          "Near correction removes retinal disease",
          "Monocular viewing creates a new blind spot",
        ],
        answerIndex: 0,
        explanation:
          "Cortically mediated filling-in can make a defect seem complete and contributes to false-negative reports.",
      },
      {
        prompt:
          "When can glaucomatous field loss become visible on an Amsler grid?",
        options: [
          "When an advanced defect reaches close to fixation",
          "At the first microscopic retinal nerve fibre change",
          "Only when intraocular pressure is normal",
          "Whenever the physiological blind spot is plotted",
        ],
        answerIndex: 0,
        explanation:
          "The grid is a central test, so earlier peripheral glaucomatous defects may not be detected.",
      },
      {
        prompt:
          "Why is an Amsler grid not recommended as the sole screening test for hydroxychloroquine retinopathy?",
        options: [
          "Its sensitivity and mapping are insufficient for that screening purpose",
          "Hydroxychloroquine never affects central vision",
          "The grid only measures intraocular pressure",
          "Red lines confirm toxicity without another assessment",
        ],
        answerIndex: 0,
        explanation:
          "Amsler may show a central defect but does not replace recommended retinal-toxicity screening methods.",
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
          "Which additional assessment is appropriate when new metamorphopsia raises concern for wet active AMD?",
        options: [
          "Urgent macular assessment with fundus examination and OCT",
          "Amsler self-testing alone for twelve months",
          "Intraocular pressure measurement as the only test",
          "Peripheral confrontation fields instead of macular assessment",
        ],
        answerIndex: 0,
        explanation:
          "NICE recommends urgent referral for suspected wet active AMD and OCT as part of assessment.",
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
];

function getQuestionSources(question) {
  const wording = `${question.prompt} ${question.explanation}`.toLowerCase();
  const refersToUrgency =
    wording.includes("urgent") ||
    wording.includes("wet active") ||
    wording.includes("timely clinical") ||
    wording.includes("new or progressive");
  return refersToUrgency ? ["NICE-NG82", "NCBI-AMSLER"] : ["NCBI-AMSLER"];
}

export const MCQ_LEVELS = Object.freeze(
  MCQ_LEVEL_DEFINITIONS.map((level) =>
    Object.freeze({
      ...level,
      questions: Object.freeze(
        level.questions.map((question, index) =>
          Object.freeze({
            ...question,
            id: `amsler-${level.id}-${String(index + 1).padStart(2, "0")}`,
            sourceIds: Object.freeze(getQuestionSources(question)),
            reviewStatus: MCQ_REVIEW_STATUS,
          }),
        ),
      ),
    }),
  ),
);
