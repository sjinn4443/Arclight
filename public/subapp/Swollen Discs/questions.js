/**
 * Swollen Discs MCQ bank
 *
 * The Modified Frisén Scale grades the severity of papilloedema. It does not
 * identify the cause of optic disc swelling and haemorrhages or exudates do
 * not define a particular grade.
 */

export const MCQ_SOURCE_REFERENCES = Object.freeze({
  'frisen-1982': Object.freeze({
    title: 'Swelling of the optic nerve head: a staging scheme',
    url: 'https://pmc.ncbi.nlm.nih.gov/articles/PMC491259/',
    status: 'primary-source-reviewed'
  }),
  'modified-frisen-2010': Object.freeze({
    title: 'Diagnosis and grading of papilledema using OCT versus the Modified Frisén Scale',
    url: 'https://jamanetwork.com/journals/jamaophthalmology/fullarticle/425762',
    status: 'primary-source-reviewed'
  }),
  'iihtt-reading-centre-2015': Object.freeze({
    title: 'IIHTT Photographic Reading Center methods and baseline results',
    url: 'https://pmc.ncbi.nlm.nih.gov/articles/PMC4453296/',
    status: 'primary-source-reviewed'
  }),
  'svp-icp-2019': Object.freeze({
    title: 'Association of intracranial pressure and spontaneous retinal venous pulsation',
    url: 'https://pubmed.ncbi.nlm.nih.gov/31498376/',
    status: 'primary-source-reviewed'
  }),
  'svp-frequency-2007': Object.freeze({
    title: 'Frequency of spontaneous pulsations of the central retinal vein',
    url: 'https://pmc.ncbi.nlm.nih.gov/articles/PMC1857679/',
    status: 'primary-source-reviewed'
  }),
  'swollen-discs-teaching-scope-v1': Object.freeze({
    title: 'Swollen Discs teaching-state and documentation contract',
    url: null,
    status: 'app-aligned-pending-independent-clinical-review'
  })
});

const questionBank = [
  {
    id: 'q01',
    question: 'Which finding best supports the Grade 0 comparison state?',
    options: {
      a: 'A circumferential grey halo',
      b: 'A major vessel segment obscured at the rim',
      c: 'No disc oedema or peripapillary halo',
      d: 'Elevation of every disc border',
      e: 'A vessel segment obscured on the disc'
    },
    correct: 'c',
    explanation:
      'Grade 0 means no papilloedema. Disc anatomy varies, so the absence of oedema is safer than requiring one cup shape.',
    source: 'modified-frisen-2010'
  },
  {
    id: 'q02',
    question: 'Which finding should make a disc look suspicious for early swelling?',
    options: {
      a: 'A sharp temporal and nasal margin with no halo',
      b: 'Subtle nasal blur or a C-shaped halo with a temporal gap',
      c: 'Complete obscuration of every major vessel',
      d: 'A deep cup with no rim change',
      e: 'An isolated macular pigment change'
    },
    correct: 'b',
    explanation:
      'Minimal papilloedema begins with nasal margin change and a subtle C-shaped halo that spares the temporal side.',
    source: 'modified-frisen-2010'
  },
  {
    id: 'q03',
    question: 'What is the defining Grade 1 pattern?',
    options: {
      a: 'A subtle C-shaped halo with a temporal gap',
      b: 'A complete halo with all vessels obscured',
      c: 'Total obscuration of a vessel on the disc',
      d: 'Elevation of the whole nerve head including the cup',
      e: 'A normal margin with a deep physiological cup'
    },
    correct: 'a',
    explanation:
      'Grade 1 is minimal papilloedema: a subtle C-shaped halo, disrupted nerve-fibre striations and a normal temporal margin.',
    source: 'modified-frisen-2010'
  },
  {
    id: 'q04',
    question: 'Which feature best distinguishes Grade 2 from Grade 1?',
    options: {
      a: 'Haemorrhage becomes compulsory',
      b: 'Every vessel becomes hidden',
      c: 'The physiological cup becomes deeper',
      d: 'The halo becomes circumferential',
      e: 'The disc becomes pale'
    },
    correct: 'd',
    explanation:
      'At Grade 2 the halo closes around the full circumference. Major vessel obscuration is not a defining feature.',
    source: 'modified-frisen-2010'
  },
  {
    id: 'q05',
    question: 'What does the term papilloedema mean?',
    options: {
      a: 'Any blurred optic disc margin',
      b: 'Any swollen optic disc from any cause',
      c: 'A small physiological cup',
      d: 'Optic disc pallor after visual loss',
      e: 'Optic disc swelling caused by raised intracranial pressure'
    },
    correct: 'e',
    explanation:
      'Papilloedema is optic disc swelling caused by raised intracranial pressure. Other causes of disc oedema need a differential diagnosis.',
    source: 'swollen-discs-teaching-scope-v1'
  },
  {
    id: 'q06',
    question: 'At Grade 2, what should happen to the major vessels?',
    options: {
      a: 'All must be totally hidden',
      b: 'One must disappear on the disc',
      c: 'No major vessel should be totally obscured',
      d: 'Only arteries should remain visible',
      e: 'Only veins should remain visible'
    },
    correct: 'c',
    explanation:
      'Grade 2 has a circumferential halo and nasal elevation but no defining total obscuration of a major vessel.',
    source: 'modified-frisen-2010'
  },
  {
    id: 'q07',
    question: 'What is the safest interpretation of absent spontaneous venous pulsation?',
    options: {
      a: 'It proves severe papilloedema',
      b: 'It raises concern but is not diagnostic by itself',
      c: 'It proves that intracranial pressure is normal',
      d: 'It fixes the Frisén grade at 2',
      e: 'It excludes pseudopapilloedema'
    },
    correct: 'b',
    explanation:
      'Absent venous pulsation is associated with higher intracranial pressure but it can also be absent in healthy eyes.',
    source: 'svp-icp-2019'
  },
  {
    id: 'q08',
    question: 'If the disc margin cannot be seen clearly, what is the safest record?',
    options: {
      a: 'Grade 0 because swelling is unconfirmed',
      b: 'Grade 5 because the vessels are hard to see',
      c: 'Normal because the cup is uncertain',
      d: 'Poor view or uncertain, then seek a better examination',
      e: 'Papilloedema excluded'
    },
    correct: 'd',
    explanation:
      'Poor image quality must not be converted into a normal or swollen finding. Record the limitation and improve the view.',
    source: 'swollen-discs-teaching-scope-v1'
  },
  {
    id: 'q09',
    question: 'Which feature is most useful when separating Grade 1 from Grade 2?',
    options: {
      a: 'Whether the peripapillary halo has a temporal gap',
      b: 'Whether the physiological cup is large',
      c: 'Whether one small haemorrhage is present',
      d: 'Whether the pupil is round',
      e: 'Whether visual acuity is written in Snellen notation'
    },
    correct: 'a',
    explanation:
      'Grade 1 has a C-shaped halo with a temporal gap. At Grade 2 the halo becomes circumferential.',
    source: 'modified-frisen-2010'
  },
  {
    id: 'q10',
    question: 'What does a Frisén grade describe?',
    options: {
      a: 'The cause of raised intracranial pressure',
      b: 'The patient’s visual acuity',
      c: 'The duration of symptoms',
      d: 'The correct treatment',
      e: 'The visible severity of papilloedema'
    },
    correct: 'e',
    explanation:
      'The scale describes visible papilloedema severity. It does not diagnose the cause, measure vision or choose treatment.',
    source: 'frisen-1982'
  },
  {
    id: 'q11',
    question: 'Which feature defines Grade 3 on the Modified Frisén Scale?',
    options: {
      a: 'A segment of a major vessel is obscured as it leaves the disc',
      b: 'Every major vessel is obscured on the disc',
      c: 'A temporal gap remains in the halo',
      d: 'The disc is normal apart from absent venous pulsation',
      e: 'Haemorrhage is present without disc oedema'
    },
    correct: 'a',
    explanation:
      'Grade 3 adds obscuration of at least one major vessel segment as it leaves the disc, with elevation of all borders.',
    source: 'modified-frisen-2010'
  },
  {
    id: 'q12',
    question: 'Which feature defines Grade 4 rather than Grade 3?',
    options: {
      a: 'A C-shaped halo with a temporal gap',
      b: 'A major vessel segment is totally obscured on the disc',
      c: 'No major vessel is obscured',
      d: 'A normal temporal margin',
      e: 'An isolated flame haemorrhage'
    },
    correct: 'b',
    explanation:
      'Grade 4 includes total obscuration of a segment of a major vessel on the disc, not only as it leaves the disc.',
    source: 'modified-frisen-2010'
  },
  {
    id: 'q13',
    question: 'Which feature defines Grade 5 on the Modified Frisén Scale?',
    options: {
      a: 'One vessel is obscured at the nasal rim',
      b: 'The halo first becomes circumferential',
      c: 'All major vessels have obscured segments on and leaving the disc',
      d: 'A physiological cup is clearly visible',
      e: 'A single haemorrhage is present'
    },
    correct: 'c',
    explanation:
      'Grade 5 is severe papilloedema with obscuration of all major vessels on the disc and as they leave it.',
    source: 'modified-frisen-2010'
  },
  {
    id: 'q14',
    question: 'How should haemorrhages and exudates affect Frisén grading?',
    options: {
      a: 'Any haemorrhage makes the disc Grade 3',
      b: 'Exudates make the disc Grade 4',
      c: 'Both are required for Grade 5',
      d: 'They may occur but do not define the grade',
      e: 'Their absence proves Grade 0'
    },
    correct: 'd',
    explanation:
      'Frisén grade is defined mainly by halo, elevation and vessel obscuration. Haemorrhages and exudates can occur but are not grade thresholds.',
    source: 'modified-frisen-2010'
  },
  {
    id: 'q15',
    question: 'What is the safest interpretation of a poorly visible physiological cup?',
    options: {
      a: 'It proves Grade 5',
      b: 'It proves raised intracranial pressure',
      c: 'It proves the disc was previously normal',
      d: 'It excludes pseudopapilloedema',
      e: 'It can accompany swelling but is not diagnostic alone'
    },
    correct: 'e',
    explanation:
      'Cup filling can accompany more marked swelling, but cup size varies. Grade the defining disc and vessel features instead.',
    source: 'modified-frisen-2010'
  },
  {
    id: 'q16',
    question: 'Which description best separates suspicious early change from Grade 3?',
    options: {
      a: 'Early change lacks the defining major-vessel obscuration of Grade 3',
      b: 'Early change always has more haemorrhages',
      c: 'Grade 3 has a normal temporal margin',
      d: 'Grade 3 has no halo',
      e: 'Early change always has a visible venous pulsation'
    },
    correct: 'a',
    explanation:
      'Grade 3 requires obscuration of a major vessel segment as it leaves the disc. Subtle early change does not meet that defining feature.',
    source: 'modified-frisen-2010'
  },
  {
    id: 'q17',
    question: 'Which is a recognised reason for a raised-looking disc without papilloedema?',
    options: {
      a: 'A normal blood pressure reading',
      b: 'Optic disc drusen or a crowded disc',
      c: 'A clear cornea',
      d: 'A normal macula',
      e: 'A round pupil'
    },
    correct: 'b',
    explanation:
      'Pseudopapilloedema from optic disc drusen or a crowded disc can mimic swelling. Appearance alone may not establish the cause.',
    source: 'swollen-discs-teaching-scope-v1'
  },
  {
    id: 'q18',
    question: 'Which statement about optic disc oedema is most accurate?',
    options: {
      a: 'Every oedematous disc is papilloedema',
      b: 'Only bilateral discs can swell',
      c: 'Papilloedema is one cause-specific form of optic disc oedema',
      d: 'A normal visual acuity excludes disc swelling',
      e: 'Disc oedema always causes a relative afferent pupil defect'
    },
    correct: 'c',
    explanation:
      'Optic disc oedema has several causes. The term papilloedema is reserved for swelling caused by raised intracranial pressure.',
    source: 'swollen-discs-teaching-scope-v1'
  },
  {
    id: 'q19',
    question: 'What is an important limitation of Frisén grading?',
    options: {
      a: 'It cannot be used with photographs',
      b: 'It has no ordered severity levels',
      c: 'It requires haemorrhage at every grade',
      d: 'Observers may disagree, especially by one grade',
      e: 'It directly measures intracranial pressure'
    },
    correct: 'd',
    explanation:
      'In the IIHTT reading centre, exact agreement was imperfect although most assessments were within one grade.',
    source: 'iihtt-reading-centre-2015'
  },
  {
    id: 'q20',
    question: 'What makes serial disc comparison most dependable?',
    options: {
      a: 'Changing camera and view each time',
      b: 'Judging colour alone',
      c: 'Using only the cup-to-disc ratio',
      d: 'Ignoring the fellow eye',
      e: 'Using comparable views and recording the defining features'
    },
    correct: 'e',
    explanation:
      'Standardised photographs and explicit feature recording reduce variation when severity is compared over time.',
    source: 'iihtt-reading-centre-2015'
  },
  {
    id: 'q21',
    question:
      'A hazy photograph hides vessels both on and away from the disc. What is the best next step before grading?',
    options: {
      a: 'Improve the view and reassess the defining features',
      b: 'Record Grade 5 because vessels are hard to see',
      c: 'Record Grade 0 because no halo is clear',
      d: 'Grade using disc colour alone',
      e: 'Use the haemorrhage count instead'
    },
    correct: 'a',
    explanation:
      'Poor image quality can obscure vessels without oedema. Improve the view and record uncertainty rather than treating optical blur as swelling.',
    source: 'swollen-discs-teaching-scope-v1'
  },
  {
    id: 'q22',
    question:
      'A disc has a circumferential halo and nasal elevation. All major vessels remain visible. Which finding would support progression to Grade 3?',
    options: {
      a: 'A brighter photographic exposure',
      b: 'Obscuration of a major-vessel segment leaving the disc',
      c: 'A single haemorrhage with unchanged vessels',
      d: 'A change in pupil size',
      e: 'A smaller visible cup without vessel obscuration'
    },
    correct: 'b',
    explanation:
      'The starting features fit Grade 2. Obscuration of a major-vessel segment leaving the disc is the defining additional feature of Grade 3.',
    source: 'modified-frisen-2010'
  },
  {
    id: 'q23',
    question:
      'Serial photographs differ in exposure and apparent grade by one step. What best supports a reliable comparison?',
    options: {
      a: 'Accept the higher grade without checking features',
      b: 'Compare disc colour alone',
      c: 'Obtain comparable views and document changes in defining features',
      d: 'Assume any one-grade change proves deterioration',
      e: 'Discard the earlier photograph'
    },
    correct: 'c',
    explanation:
      'Image quality and observer variation affect grading. Comparable views and recorded structural features strengthen interpretation of a small serial change.',
    source: 'iihtt-reading-centre-2015'
  },
  {
    id: 'q24',
    question:
      'A crowded elevated disc resembles swelling, but the photograph does not establish its cause. Which interpretation is most appropriate?',
    options: {
      a: 'Raised intracranial pressure is confirmed',
      b: 'The disc is normal because it is crowded',
      c: 'Disc colour alone distinguishes the cause',
      d: 'Pseudopapilloedema is possible, but further assessment is needed',
      e: 'Frisén grading identifies the underlying cause'
    },
    correct: 'd',
    explanation:
      'Crowded discs or optic disc drusen can mimic swelling. A teaching photograph alone cannot confirm pseudopapilloedema or exclude true oedema.',
    source: 'swollen-discs-teaching-scope-v1'
  },
  {
    id: 'q25',
    question: 'What separates Grade 5 from Grade 4 in the Modified Frisén Scale?',
    options: {
      a: 'The first appearance of a halo',
      b: 'Nasal border elevation',
      c: 'The first obscured vessel leaving the disc',
      d: 'The presence of any haemorrhage',
      e: 'Obscured segments of all major vessels on and leaving the disc'
    },
    correct: 'e',
    explanation:
      'Grade 5 requires obscuration of all major vessels on the disc and as they leave it.',
    source: 'modified-frisen-2010'
  },
  {
    id: 'q26',
    question: 'Which observation favours Grade 3 over Grade 4?',
    options: {
      a: 'A vessel is obscured leaving the disc but remains visible on the disc',
      b: 'All major vessels are obscured on the disc',
      c: 'The halo still has a temporal gap',
      d: 'No disc border is elevated',
      e: 'There is no peripapillary halo'
    },
    correct: 'a',
    explanation:
      'Grade 3 obscures a vessel segment as it leaves the disc. Grade 4 extends defining obscuration onto the disc itself.',
    source: 'modified-frisen-2010'
  },
  {
    id: 'q27',
    question: 'Which conclusion cannot be made from the Frisén grade alone?',
    options: {
      a: 'Whether vessel obscuration is present',
      b: 'The cause of raised intracranial pressure',
      c: 'Whether a halo is circumferential',
      d: 'Whether the whole nerve head is elevated',
      e: 'Whether all major vessels are obscured'
    },
    correct: 'b',
    explanation:
      'The grade describes optic disc appearance. Identifying why intracranial pressure is raised requires clinical assessment and investigation.',
    source: 'frisen-1982'
  },
  {
    id: 'q28',
    question: 'Why should a one-grade change be interpreted cautiously?',
    options: {
      a: 'The scale is unordered',
      b: 'The scale uses visual acuity only',
      c: 'Observer grading can vary by about one grade',
      d: 'Grade 0 and Grade 5 are identical',
      e: 'Photographs cannot be graded'
    },
    correct: 'c',
    explanation:
      'Photographic grading is useful but observer variation is real. Comparable images and recorded features strengthen serial interpretation.',
    source: 'iihtt-reading-centre-2015'
  },
  {
    id: 'q29',
    question: 'Can severe papilloedema be present without haemorrhages?',
    options: {
      a: 'No, haemorrhage defines every severe grade',
      b: 'No, Grade 4 requires exudates',
      c: 'Only when venous pulsation is present',
      d: 'Yes, vessel obscuration and elevation define the grade',
      e: 'Only in a Grade 0 disc'
    },
    correct: 'd',
    explanation:
      'Haemorrhages may accompany papilloedema but are not required. Vessel obscuration, halo and elevation determine the Modified Frisén grade.',
    source: 'modified-frisen-2010'
  },
  {
    id: 'q30',
    question: 'If visible features do not fit one grade confidently, what is the safest approach?',
    options: {
      a: 'Choose Grade 0 automatically',
      b: 'Choose the highest grade without explanation',
      c: 'Ignore vessel visibility',
      d: 'Use haemorrhage count as the grade',
      e: 'Record the features, the uncertainty and seek review'
    },
    correct: 'e',
    explanation:
      'The app is a teaching aid. Uncertainty should remain visible rather than being converted into false certainty.',
    source: 'swollen-discs-teaching-scope-v1'
  }
].map((question) =>
  Object.freeze({
    ...question,
    legacyId: question.id,
    id: `swollen-discs-${question.id}`,
    clinicalSignOff: 'pending-independent-review',
    reviewStatus: MCQ_SOURCE_REFERENCES[question.source].status
  })
);

export default Object.freeze(questionBank);
