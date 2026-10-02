'use strict';
(() => {
  var _i = Object.freeze({
      'frisen-1982': Object.freeze({
        title: 'Swelling of the optic nerve head: a staging scheme',
        url: 'https://pmc.ncbi.nlm.nih.gov/articles/PMC491259/',
        status: 'primary-source-reviewed'
      }),
      'modified-frisen-2010': Object.freeze({
        title: 'Diagnosis and grading of papilledema using OCT versus the Modified Fris\xE9n Scale',
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
    }),
    Fi = [
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
          d: 'It fixes the Fris\xE9n grade at 2',
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
        question: 'What does a Fris\xE9n grade describe?',
        options: {
          a: 'The cause of raised intracranial pressure',
          b: 'The patient\u2019s visual acuity',
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
        question: 'Which feature defines Grade 3 on the Modified Fris\xE9n Scale?',
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
        question: 'Which feature defines Grade 5 on the Modified Fris\xE9n Scale?',
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
        question: 'How should haemorrhages and exudates affect Fris\xE9n grading?',
        options: {
          a: 'Any haemorrhage makes the disc Grade 3',
          b: 'Exudates make the disc Grade 4',
          c: 'Both are required for Grade 5',
          d: 'They may occur but do not define the grade',
          e: 'Their absence proves Grade 0'
        },
        correct: 'd',
        explanation:
          'Fris\xE9n grade is defined mainly by halo, elevation and vessel obscuration. Haemorrhages and exudates can occur but are not grade thresholds.',
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
        question: 'What is an important limitation of Fris\xE9n grading?',
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
          e: 'Fris\xE9n grading identifies the underlying cause'
        },
        correct: 'd',
        explanation:
          'Crowded discs or optic disc drusen can mimic swelling. A teaching photograph alone cannot confirm pseudopapilloedema or exclude true oedema.',
        source: 'swollen-discs-teaching-scope-v1'
      },
      {
        id: 'q25',
        question: 'What separates Grade 5 from Grade 4 in the Modified Fris\xE9n Scale?',
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
        question: 'Which conclusion cannot be made from the Fris\xE9n grade alone?',
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
          'Haemorrhages may accompany papilloedema but are not required. Vessel obscuration, halo and elevation determine the Modified Fris\xE9n grade.',
        source: 'modified-frisen-2010'
      },
      {
        id: 'q30',
        question:
          'If visible features do not fit one grade confidently, what is the safest approach?',
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
    ].map((e) =>
      Object.freeze({
        ...e,
        legacyId: e.id,
        id: `swollen-discs-${e.id}`,
        clinicalSignOff: 'pending-independent-review',
        reviewStatus: _i[e.source].status
      })
    ),
    Bt = Object.freeze(Fi);
  function lt(e, t = Math.random) {
    let r = [...e];
    for (let a = r.length - 1; a > 0; a -= 1) {
      let l = Math.floor(t() * (a + 1));
      [r[a], r[l]] = [r[l], r[a]];
    }
    return r;
  }
  function $i(e, t, r, a) {
    if (!Number.isInteger(r) || r <= 0 || r >= e.length) return lt(e, a);
    let l = e.find(([b]) => b === t);
    if (!l) return lt(e, a).slice(0, r);
    let m = e.filter(([b]) => b !== t),
      f = lt(m, a).slice(0, Math.max(0, r - 1));
    return lt([l, ...f], a);
  }
  function jt(e, t = 7, r = Math.random, a = null) {
    if (!Array.isArray(e) || e.length === 0) return [];
    let l = [...e],
      m = Math.max(0, Math.min(t, l.length)),
      b =
        a != null
          ? Number.isInteger(a)
            ? Math.max(2, a)
            : Number.isFinite(Number(a))
              ? Math.max(2, Math.floor(Number(a)))
              : null
          : null,
      p = [];
    for (let y = 0; y < m; y += 1) {
      let I = Math.floor(r() * l.length);
      p.push(l.splice(I, 1)[0]);
    }
    return p.map((y, I) => {
      let N = Object.entries(y.options || {}),
        R = $i(N, y.correct, b, r),
        k = R.map(([q, Y], i) => ({ id: `q${I}o${i}${q}`, text: Y })),
        T = R.find(([q]) => q === y.correct),
        B = T ? R.findIndex(([q]) => q === y.correct) : -1;
      return {
        id: y.id || `q${I}`,
        prompt: y.question,
        choices: k,
        correctChoiceId: T && B >= 0 ? k[B].id : null,
        explanation: y.explanation || '',
        source: y.source || '',
        reviewStatus: y.reviewStatus || ''
      };
    });
  }
  function Gt(e, t, r = 0.7) {
    let a = Array.isArray(e) ? e : [],
      l = Array.isArray(t) ? t : [],
      m = 0,
      f = a.map((R, k) => {
        let T = l[k] || null,
          B = R.choices.find((i) => i.id === T) || null,
          q = R.choices.find((i) => i.id === R.correctChoiceId) || null,
          Y = T !== null && T === R.correctChoiceId;
        return (
          Y && (m += 1),
          {
            index: k,
            prompt: R.prompt,
            selectedChoiceId: T,
            selectedChoiceText: B ? B.text : null,
            correctChoiceId: R.correctChoiceId,
            correctChoiceText: q ? q.text : null,
            isCorrect: Y,
            explanation: R.explanation || '',
            source: R.source || '',
            reviewStatus: R.reviewStatus || ''
          }
        );
      }),
      b = a.length,
      p = b === 0 ? 0 : Math.max(1, Math.ceil(b * r)),
      y = f.filter((R) => R.selectedChoiceId === null).length,
      I = b > 0 && y === 0,
      N = I && m >= p;
    return {
      score: m,
      maxScore: b,
      passThreshold: p,
      unansweredCount: y,
      isComplete: I,
      passed: N,
      details: f
    };
  }
  function It(e = 8, t = Math.random) {
    let r = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789',
      a = '';
    for (let l = 0; l < e; l += 1) {
      let m = Math.floor(t() * r.length);
      a += r.charAt(m);
    }
    return a;
  }
  function Wt(e) {
    if (!e) return '';
    let t = [],
      r = e.completedAt || new Date().toISOString(),
      a = new Date(r),
      l = Number.isNaN(a.valueOf()) ? r : a.toLocaleString();
    return (
      t.push('Swollen Discs - MCQ Test Result'),
      t.push(`Taken: ${l}`),
      t.push(`Score: ${e.score}/${e.maxScore}`),
      t.push(`Result: ${e.passed ? 'PASS' : 'FAIL'}`),
      t.push(`Pass threshold: ${e.passThreshold}/${e.maxScore}`),
      typeof e.tierName == 'string' && e.tierName.length > 0 && t.push(`Level: ${e.tierName}`),
      e.timed ? t.push(`Timed: ${e.timedOut ? 'Yes (time expired)' : 'Yes'}`) : t.push('Timed: No'),
      e.passCode && t.push(`Code: ${e.passCode}`),
      t.push(''),
      t.push('Question breakdown:'),
      e.details.forEach((m) => {
        let f = m.selectedChoiceText || 'No answer selected',
          b = m.correctChoiceText || 'Unknown';
        (t.push(`${m.index + 1}. ${m.prompt}`),
          t.push(`Your answer: ${f}`),
          t.push(`Correct answer: ${b}`),
          t.push(`Status: ${m.isCorrect ? 'Correct' : 'Incorrect'}`),
          m.explanation && t.push(`Why: ${m.explanation}`),
          t.push(''));
      }),
      t
        .join(
          `
`
        )
        .trimEnd()
    );
  }
  var Ge = Object.freeze({
      full: Object.freeze({
        normal: 'assets/images/ret180.webp',
        suspicious: 'assets/images/ret180_2.webp',
        swollen: 'assets/images/ret180_4.webp'
      }),
      mobile: Object.freeze({
        normal: 'assets/images/ret180_2048.webp',
        suspicious: 'assets/images/ret180_2_2048.webp',
        swollen: 'assets/images/ret180_4_2048.webp'
      })
    }),
    Ut = Ge.full.normal,
    Vt = [
      { src: Ge.full.normal, label: 'normal' },
      { src: Ge.full.suspicious, label: 'suspicious' },
      { src: Ge.full.swollen, label: 'swollen' }
    ],
    Yt = 4,
    Xt = 4,
    zt = [
      {
        name: 'Primary',
        className: 'primary-star',
        questionCount: 4,
        optionCount: 3,
        passRatio: 0.75,
        timeLimitSeconds: 0,
        questionIds: ['q01', 'q02', 'q03', 'q04', 'q05', 'q06', 'q07', 'q08', 'q09', 'q10'].map(
          (e) => `swollen-discs-${e}`
        )
      },
      {
        name: 'Intermediate',
        className: 'intermediate-star',
        questionCount: 5,
        optionCount: 4,
        passRatio: 0.8,
        timeLimitSeconds: 0,
        questionIds: ['q11', 'q12', 'q13', 'q14', 'q15', 'q16', 'q17', 'q18', 'q19', 'q20'].map(
          (e) => `swollen-discs-${e}`
        )
      },
      {
        name: 'Advanced',
        className: 'advanced-star',
        questionCount: 7,
        optionCount: 5,
        passRatio: 0.8,
        timeLimitSeconds: 0,
        questionIds: ['q21', 'q22', 'q23', 'q24', 'q25', 'q26', 'q27', 'q28', 'q29', 'q30'].map(
          (e) => `swollen-discs-${e}`
        )
      }
    ],
    Ht = [
      { seconds: 8, isDilated: !0, cataractLevel: 0 },
      { seconds: 6, isDilated: !1, cataractLevel: 0 },
      { seconds: 5, isDilated: !1, cataractLevel: 1 }
    ],
    Jt = 4e3,
    Qt = [
      {
        label: 'None',
        blurPx: 0,
        brightness: 1,
        contrast: 1,
        saturation: 1,
        yellowTint: 0,
        darkTint: 0,
        hazeTint: 0
      },
      {
        label: 'Slight',
        blurPx: 0.45,
        brightness: 0.92,
        contrast: 0.95,
        saturation: 0.9,
        yellowTint: 0.05,
        darkTint: 0.06,
        hazeTint: 0.015
      },
      {
        label: 'Medium',
        blurPx: 1.65,
        brightness: 0.7,
        contrast: 0.76,
        saturation: 0.58,
        yellowTint: 0.2,
        darkTint: 0.24,
        hazeTint: 0.05
      },
      {
        label: 'Dense',
        blurPx: 3.2,
        brightness: 0.56,
        contrast: 0.66,
        saturation: 0.46,
        yellowTint: 0.34,
        darkTint: 0.4,
        hazeTint: 0.14
      }
    ],
    Kt = [
      [],
      [
        {
          x: -0.34,
          y: -0.2,
          r: 0.2,
          alpha: 0.13,
          blur: 0.95,
          coreAlpha: 0.05,
          stretchX: 1.45,
          stretchY: 0.8,
          angle: -0.45
        },
        {
          x: 0.4,
          y: 0.22,
          r: 0.16,
          alpha: 0.11,
          blur: 0.9,
          coreAlpha: 0.04,
          stretchX: 1.35,
          stretchY: 0.82,
          angle: 0.35
        },
        {
          x: 0.06,
          y: 0.34,
          r: 0.13,
          alpha: 0.09,
          blur: 0.82,
          coreAlpha: 0.03,
          stretchX: 1.3,
          stretchY: 0.9,
          angle: -0.1
        }
      ],
      [
        {
          x: -0.46,
          y: -0.3,
          r: 0.28,
          alpha: 0.26,
          blur: 1.2,
          coreAlpha: 0.1,
          stretchX: 1.75,
          stretchY: 0.74,
          angle: -0.62
        },
        {
          x: 0.4,
          y: -0.16,
          r: 0.24,
          alpha: 0.23,
          blur: 1.12,
          coreAlpha: 0.09,
          stretchX: 1.6,
          stretchY: 0.78,
          angle: 0.52
        },
        {
          x: 0.08,
          y: 0.34,
          r: 0.22,
          alpha: 0.21,
          blur: 1.08,
          coreAlpha: 0.08,
          stretchX: 1.55,
          stretchY: 0.8,
          angle: -0.22
        },
        {
          x: -0.18,
          y: 0.02,
          r: 0.19,
          alpha: 0.18,
          blur: 1,
          coreAlpha: 0.07,
          stretchX: 1.5,
          stretchY: 0.85,
          angle: 0.12
        },
        {
          x: 0.26,
          y: 0.1,
          r: 0.16,
          alpha: 0.16,
          blur: 0.94,
          coreAlpha: 0.06,
          stretchX: 1.4,
          stretchY: 0.88,
          angle: -0.35
        }
      ],
      [
        {
          x: -0.5,
          y: -0.34,
          r: 0.34,
          alpha: 0.42,
          blur: 1.55,
          coreAlpha: 0.18,
          stretchX: 2,
          stretchY: 0.66,
          angle: -0.72
        },
        {
          x: 0.42,
          y: -0.22,
          r: 0.31,
          alpha: 0.39,
          blur: 1.46,
          coreAlpha: 0.17,
          stretchX: 1.9,
          stretchY: 0.68,
          angle: 0.58
        },
        {
          x: 0.14,
          y: 0.4,
          r: 0.29,
          alpha: 0.37,
          blur: 1.4,
          coreAlpha: 0.16,
          stretchX: 1.82,
          stretchY: 0.7,
          angle: -0.26
        },
        {
          x: -0.1,
          y: 0.04,
          r: 0.27,
          alpha: 0.34,
          blur: 1.34,
          coreAlpha: 0.15,
          stretchX: 1.75,
          stretchY: 0.74,
          angle: 0.08
        },
        {
          x: 0.32,
          y: 0.18,
          r: 0.24,
          alpha: 0.31,
          blur: 1.28,
          coreAlpha: 0.14,
          stretchX: 1.7,
          stretchY: 0.78,
          angle: -0.42
        },
        {
          x: -0.3,
          y: 0.24,
          r: 0.21,
          alpha: 0.28,
          blur: 1.2,
          coreAlpha: 0.12,
          stretchX: 1.62,
          stretchY: 0.82,
          angle: 0.44
        }
      ]
    ],
    Zt = {
      normal: `
    <div class="interpretation-summary interpretation-summary--normal">
      <span class="interpretation-kicker">Teaching example</span>
      <strong class="interpretation-referral text-green">No urgent referral</strong>
    </div>
    <p class="interpretation-detail">
      Why: crisp disc margins, visible cup and healthy vessels.
    </p>
    <div class="interpretation-meta">
      <span>Likely: normal optic disc</span>
      <span>Next: compare with suspicious and swollen</span>
    </div>
  `,
      suspicious: `
    <div class="interpretation-summary interpretation-summary--suspicious">
      <span class="interpretation-kicker">Teaching example</span>
      <strong class="interpretation-referral text-orange">Same-day advice</strong>
    </div>
    <p class="interpretation-detail">
      Why: C-shaped or full halo, nasal elevation and no major vessel obscuration.
    </p>
    <div class="interpretation-meta">
      <span>Likely: suspicious disc swelling</span>
      <span>Next: seek urgent advice today</span>
    </div>
  `,
      swollen: `
    <div class="interpretation-summary interpretation-summary--swollen">
      <span class="interpretation-kicker">Teaching example</span>
      <strong class="interpretation-referral text-red">Emergency now</strong>
    </div>
    <p class="interpretation-detail">
      Why: disc elevation and vessel obscuration; haemorrhages may accompany swelling.
    </p>
    <div class="interpretation-meta">
      <span>Likely: definite disc swelling</span>
      <span>Next: arrange emergency review</span>
    </div>
  `
    };
  var en = 'images';
  function tn({ imageAssetSets: e, queryValue: t, hasCoarsePointer: r, viewportEdge: a }) {
    let l = typeof t == 'string' ? t.trim().toLowerCase() : '';
    if (l === 'full') return e.full;
    if (l === 'mobile') return e.mobile;
    let m = Number.isFinite(Number(a)) ? Number(a) : 0;
    return !!r || m <= 1100 ? e.mobile : e.full;
  }
  function nn(e, t) {
    return !e || typeof e != 'object'
      ? t
      : [
          { src: e.normal || t[0].src, label: 'normal' },
          { src: e.suspicious || t[1].src, label: 'suspicious' },
          { src: e.swollen || t[2].src, label: 'swollen' }
        ];
  }
  function on(e, t) {
    !e ||
      typeof e != 'object' ||
      t.forEach((r) => {
        let a = r.getAttribute('data-condition'),
          l = e[a];
        typeof l == 'string' && l.length > 0 && r.setAttribute('data-image', l);
      });
  }
  function rn({ defaultImageSrc: e }) {
    return {
      ui: { sideMenuOpen: !1, activeModal: null },
      viewer: {
        activeImageSrc: e,
        conditionImageSrc: e,
        activeCondition: 'normal',
        isRightEye: !0,
        isDiscVisible: !0,
        cataractLevel: 0,
        shiftInProgress: !1
      },
      mcq: { selectedQuestions: [], lastResult: null },
      timed: {
        isActive: !1,
        round: 0,
        score: 0,
        currentLabel: '',
        countdownTimer: null,
        feedbackTimer: null
      }
    };
  }
  function an(e) {
    function t(y) {
      return ((e.ui.sideMenuOpen = !!y), e.ui.sideMenuOpen);
    }
    function r(y) {
      e.ui.activeModal = y || null;
    }
    function a() {
      return e.timed.isActive
        ? !1
        : ((e.mcq.selectedQuestions = []), (e.mcq.lastResult = null), !0);
    }
    function l() {
      e.mcq.selectedQuestions = [];
    }
    function m() {
      return e.timed.isActive
        ? !1
        : ((e.timed.isActive = !0),
          (e.timed.round = 0),
          (e.timed.score = 0),
          (e.timed.currentLabel = ''),
          !0);
    }
    function f() {
      return e.timed.isActive ? ((e.timed.isActive = !1), (e.timed.currentLabel = ''), !0) : !1;
    }
    function b(y) {
      e.timed.countdownTimer = y || null;
    }
    function p(y) {
      e.timed.feedbackTimer = y || null;
    }
    return {
      setSideMenuOpen: t,
      setActiveModal: r,
      beginMcqSession: a,
      endMcqSession: l,
      beginTimedSession: m,
      endTimedSession: f,
      setTimedCountdownTimer: b,
      setTimedFeedbackTimer: p
    };
  }
  function ln({
    canvasWidth: e,
    canvasHeight: t,
    imageNaturalWidth: r,
    imageNaturalHeight: a,
    imageScale: l,
    zoomFactor: m,
    bgOffsetX: f,
    bgOffsetY: b,
    circleRadius: p,
    circleX: y,
    isRightEye: I
  }) {
    let N = t / a,
      R = r * N,
      k = t,
      T = (e - R) / 2,
      B = 0,
      q = l * m,
      Y = R * q,
      i = k * q,
      C = T + (R - Y) / 2 + f,
      w = B + (k - i) / 2 + b,
      S = m,
      J = p * S * N,
      U = I ? y : e - y;
    return {
      scaleFactor: N,
      drawnImageWidth: R,
      imageDrawOffsetX: T,
      scaledWidth: Y,
      scaledHeight: i,
      offsetXPos: C,
      offsetYPos: w,
      windowScale: S,
      effectiveCircleRadius: J,
      flippedCircleX: U
    };
  }
  function sn(e, t) {
    if (e <= t) return { min: e, max: t };
    let r = (e + t) / 2;
    return { min: r, max: r };
  }
  function cn({
    canvasWidth: e,
    canvasHeight: t,
    imageNaturalWidth: r,
    imageNaturalHeight: a,
    circleRadius: l,
    zoomFactor: m
  }) {
    let f = t / a,
      b = r * f,
      p = (e - b) / 2,
      y = l * m * f,
      I = p + y,
      N = p + b - y,
      R = y,
      k = t - y,
      T = sn(I, N),
      B = sn(R, k);
    return { minX: T.min, maxX: T.max, minY: B.min, maxY: B.max };
  }
  function un({ circleX: e, circleY: t, velocityX: r, velocityY: a, bounds: l }) {
    let m = e,
      f = t,
      b = r,
      p = a;
    return (
      m < l.minX && ((m = l.minX), (b *= -0.5)),
      m > l.maxX && ((m = l.maxX), (b *= -0.5)),
      f < l.minY && ((f = l.minY), (p *= -0.5)),
      f > l.maxY && ((f = l.maxY), (p *= -0.5)),
      { circleX: m, circleY: f, velocityX: b, velocityY: p }
    );
  }
  function dn({ cataractLevel: e, darkTint: t, yellowTint: r }) {
    let a = e === 3 ? 0.3 : 0.55,
      l = 1 - t * 2.8 - r * 1.2;
    return Math.max(a, l);
  }
  var Ee = Object.freeze({
      rotateDegrees: 0,
      scale: 1,
      panXRatio: 0,
      panYRatio: 0,
      brightness: 1,
      contrast: 1,
      saturation: 1,
      flipVertical: !1
    }),
    me = Object.freeze({
      rotateDegrees: { min: -7, max: 7 },
      scale: { min: 0.85, max: 1.2 },
      panRatio: { min: -0.08, max: 0.08 },
      brightness: { min: 0.78, max: 1.22 },
      contrast: { min: 0.78, max: 1.22 },
      saturation: { min: 0.78, max: 1.22 }
    }),
    We = Object.freeze({ jitterMultiplier: 1, shiftDistanceMultiplier: 1, shiftDurationMs: 600 }),
    Pe = Object.freeze({
      jitterMultiplier: { min: 1, max: 4 },
      shiftDistanceMultiplier: { min: 1, max: 3.2 },
      shiftDurationMs: { min: 250, max: 2500 }
    });
  function Bi() {
    let e = typeof window != 'undefined',
      t =
        e && typeof window.matchMedia == 'function'
          ? window.matchMedia('(pointer: coarse)').matches
          : !1,
      r = e ? Math.max(window.innerWidth || 0, window.innerHeight || 0) : 0,
      a = t || r <= 1100;
    return {
      isMobileLike: a,
      canvasScale: a ? 0.5 : 1,
      cataractBlurScale: a ? 0.42 : 1,
      occlusionSpotRatio: 1,
      occlusionBlurScale: a ? 0.45 : 1,
      baseJitterIntervalMs: a ? 24 : 16,
      cataractJitterIntervalMs: a ? 72 : 16
    };
  }
  function mn(e) {
    return typeof e != 'string' || e.length === 0 ? '' : e.split('?')[0].split('/').pop() || '';
  }
  function hn(e) {
    return null;
  }
  function ji(e, t) {
    return typeof e != 'string' ? '' : (t && hn(e)) || e;
  }
  function xe(e, t, r, a) {
    let l = Number(e);
    return Number.isFinite(l) ? Math.max(t, Math.min(r, l)) : a;
  }
  function Gi(e) {
    let t = e && typeof e == 'object' ? e : {};
    return {
      rotateDegrees: xe(
        t.rotateDegrees,
        me.rotateDegrees.min,
        me.rotateDegrees.max,
        Ee.rotateDegrees
      ),
      scale: xe(t.scale, me.scale.min, me.scale.max, Ee.scale),
      panXRatio: xe(t.panXRatio, me.panRatio.min, me.panRatio.max, Ee.panXRatio),
      panYRatio: xe(t.panYRatio, me.panRatio.min, me.panRatio.max, Ee.panYRatio),
      brightness: xe(t.brightness, me.brightness.min, me.brightness.max, Ee.brightness),
      contrast: xe(t.contrast, me.contrast.min, me.contrast.max, Ee.contrast),
      saturation: xe(t.saturation, me.saturation.min, me.saturation.max, Ee.saturation),
      flipVertical: !!t.flipVertical
    };
  }
  function Wi(e) {
    let t = e && typeof e == 'object' ? e : {};
    return {
      jitterMultiplier: xe(
        t.jitterMultiplier,
        Pe.jitterMultiplier.min,
        Pe.jitterMultiplier.max,
        We.jitterMultiplier
      ),
      shiftDistanceMultiplier: xe(
        t.shiftDistanceMultiplier,
        Pe.shiftDistanceMultiplier.min,
        Pe.shiftDistanceMultiplier.max,
        We.shiftDistanceMultiplier
      ),
      shiftDurationMs: xe(
        t.shiftDurationMs,
        Pe.shiftDurationMs.min,
        Pe.shiftDurationMs.max,
        We.shiftDurationMs
      )
    };
  }
  function fn({
    state: e,
    canvas: t,
    fovToggleCheckbox: r,
    fovLabelSmall: a,
    fovLabelLeft: l,
    fovLabelRight: m,
    eyeToggleCheckbox: f,
    eyeLabelRight: b,
    eyeLabelLeft: p,
    cataractSlider: y,
    cataractStops: I,
    viewSummary: N,
    explanation: R,
    conditionButtons: k,
    defaultImageSrc: T,
    explanationTemplates: B,
    cataractPresets: q,
    cataractOcclusionSpots: Y
  }) {
    let i = t.getContext('2d'),
      C = 5,
      w = 80,
      S = Object.freeze([4, 8, 15]),
      J = Object.freeze({ 4: 'Normal (4\xB0)', 8: 'Nil (8\xB0)', 15: 'Dilated (15\xB0)' }),
      U = 1,
      Q = (8 / 5) * w,
      j = 0,
      _ = 0,
      K = 0,
      F = 0,
      Z = !1,
      le = null,
      re = 0,
      X = 0,
      ye = { x: 0, y: 0 },
      de = { x: 0, y: 0 },
      z = null,
      we = 1,
      Se = 3,
      ie = Bi(),
      V = { ...Ee },
      fe = { ...We },
      Ve = 400,
      pe = null,
      oe = null,
      ge = null,
      _e = 0,
      Fe = 0,
      $e = 2,
      Te = new Map(),
      Ie = new Map(),
      Le = 640,
      Ne = [],
      Oe = !1,
      D = new Image(),
      c = !1,
      M = {},
      x = document.getElementById('imageStatus'),
      L = document.getElementById('imageStatusText'),
      W = document.getElementById('retryImage');
    function ae(n, o = !1) {
      (x && (x.hidden = !n), L && (L.textContent = n), W && (W.hidden = !o));
    }
    ((D.onload = () => {
      var o;
      ((c = !0), ae(''), rt(), oe === null && (oe = requestAnimationFrame(Ye)));
      let n = M;
      ((M = {}), (o = n.onReady) == null || o.call(n));
    }),
      (D.onerror = () => {
        var o;
        let n = hn(e.viewer.activeImageSrc);
        if (!n || n === e.viewer.activeImageSrc) {
          ((c = !1), i.clearRect(0, 0, t.width, t.height), ae('Image unavailable', !0));
          let s = M;
          ((M = {}), (o = s.onError) == null || o.call(s));
          return;
        }
        ((Oe = !0),
          e.viewer.conditionImageSrc === e.viewer.activeImageSrc &&
            (e.viewer.conditionImageSrc = n),
          (e.viewer.activeImageSrc = n),
          (D.src = n));
      }));
    function u(n, o, s, d) {
      (n.addEventListener(o, s, d),
        Ne.push(() => {
          n.removeEventListener(o, s, d);
        }));
    }
    function h() {
      ge === null &&
        (ge = requestAnimationFrame((n) => {
          ge = null;
          let o = ie.isMobileLike && e.viewer.cataractLevel > 0 ? 34 : 0,
            s =
              typeof n == 'number'
                ? n
                : typeof window != 'undefined' && window.performance
                  ? window.performance.now()
                  : Date.now();
          if (o > 0 && s - Fe < o) {
            h();
            return;
          }
          ((Fe = s), pi());
        }));
    }
    function g() {
      (W && u(W, 'click', () => Ae(e.viewer.activeImageSrc)),
        (e.viewer.activeImageSrc = T),
        (e.viewer.conditionImageSrc = T),
        (e.viewer.activeCondition = 'normal'),
        (e.viewer.isRightEye = !0),
        (e.viewer.isDiscVisible = !0),
        (e.viewer.cataractLevel = 0),
        (e.viewer.shiftInProgress = !1),
        (V = { ...Ee }),
        (fe = { ...We }),
        (r.value = String(U)),
        (Q = Pt(S[U])),
        O('normal'),
        Rt('normal'),
        Ae(T),
        qt(),
        yt(),
        Mt(),
        A(),
        G());
    }
    function A() {
      let n = () => {
        kt(gt());
      };
      (u(r, 'input', n),
        u(r, 'change', n),
        u(f, 'change', () => {
          ((e.viewer.isRightEye = !f.checked), rt(), yt());
        }),
        u(y, 'input', () => {
          ((e.viewer.cataractLevel = Number(y.value)), Mt(), h());
        }),
        k.forEach((d) => {
          u(d, 'click', () => {
            if (d.disabled) return;
            let E = d.getAttribute('data-condition') || 'normal',
              P = d.getAttribute('data-image') || T;
            (O(E),
              (e.viewer.activeCondition = E),
              (e.viewer.conditionImageSrc = P),
              (e.viewer.isDiscVisible = !0),
              Ae(P),
              Rt(E));
          });
        }));
    }
    function O(n) {
      k.forEach((o) => {
        let d = (o.getAttribute('data-condition') || 'normal') === n;
        (o.classList.toggle('active', d), o.setAttribute('aria-pressed', d ? 'true' : 'false'));
      });
    }
    function G() {
      (u(t, 'pointerdown', Me),
        u(t, 'pointermove', te),
        u(t, 'pointerup', ce),
        u(t, 'pointercancel', ce),
        u(t, 'pointerleave', (o) => {
          o.pointerType === 'mouse' && ce(o);
        }),
        u(window, 'pointerup', ce),
        typeof document != 'undefined' && u(document, 'visibilitychange', ee));
    }
    function ee() {
      if (typeof document != 'undefined') {
        if (document.hidden) {
          (oe !== null && (cancelAnimationFrame(oe), (oe = null)),
            ge !== null && (cancelAnimationFrame(ge), (ge = null)),
            z !== null && (cancelAnimationFrame(z), (z = null)));
          return;
        }
        (D.complete && oe === null && (oe = requestAnimationFrame(Ye)), h());
      }
    }
    function Me(n) {
      (n.button !== void 0 && n.button !== 0) ||
        ((Z = !0),
        (le = n.pointerId),
        (re = 0),
        (X = 0),
        t.setPointerCapture(n.pointerId),
        (t.style.cursor = 'none'),
        ue(n),
        hi());
    }
    function te(n) {
      !Z || n.pointerId !== le || ue(n);
    }
    function ce(n) {
      Z &&
        ((typeof n.pointerId == 'number' && n.pointerId !== le) ||
          (typeof n.pointerId == 'number' &&
            t.hasPointerCapture(n.pointerId) &&
            t.releasePointerCapture(n.pointerId),
          (Z = !1),
          (le = null),
          (t.style.cursor = 'crosshair'),
          fi()));
    }
    function ue(n) {
      let o = t.getBoundingClientRect();
      if (o.width === 0 || o.height === 0) return;
      let s = t.width / o.width,
        d = t.height / o.height,
        v = (n.clientX - o.left) * s,
        E = (n.clientY - o.top) * d,
        P = ot(),
        $ = Math.max(18, Math.min(64, P * 0.12));
      ((j = v), (_ = E - P - $), Xe(), h());
    }
    function ot() {
      if (!D.naturalHeight || t.height <= 0) return Q * Se;
      let n = t.height / D.naturalHeight;
      return Q * Se * n;
    }
    function Ae(n, o = {}) {
      var E;
      let s = ji(n, Oe);
      e.viewer.activeImageSrc = s;
      let d = mn(D.src),
        v = mn(s);
      if (c && D.complete && D.naturalWidth && d === v) {
        (rt(), (E = o.onReady) == null || E.call(o));
        return;
      }
      ((c = !1),
        (M = o),
        i.clearRect(0, 0, t.width, t.height),
        ae('Loading image\u2026'),
        (D.src = s));
    }
    function ei(n) {
      let o = V.panXRatio * n.scaledWidth,
        s = V.panYRatio * n.scaledHeight,
        d = n.offsetXPos + o,
        v = n.offsetYPos + s;
      return {
        offsetXPos: d,
        offsetYPos: v,
        scaledWidth: n.scaledWidth,
        scaledHeight: n.scaledHeight,
        centreX: d + n.scaledWidth / 2,
        centreY: v + n.scaledHeight / 2
      };
    }
    function Lt(n) {
      let o = (V.rotateDegrees * Math.PI) / 180,
        s = V.flipVertical === !0;
      if (!(o === 0 && V.scale === 1 && !s)) {
        if ((i.translate(n.centreX, n.centreY), o !== 0 && i.rotate(o), V.scale !== 1 || s)) {
          let d = s ? V.scale * -1 : V.scale;
          i.scale(V.scale, d);
        }
        i.translate(-n.centreX, -n.centreY);
      }
    }
    function ti(n) {
      let o = Math.max(0, Math.min(6, n.blurPx)),
        s = n.brightness * V.brightness,
        d = n.contrast * V.contrast,
        v = n.saturation * V.saturation;
      return `blur(${o}px) brightness(${s}) contrast(${d}) saturate(${v})`;
    }
    function ni(n) {
      V = Gi(n);
    }
    function ii() {
      V = { ...Ee };
    }
    function oi(n) {
      fe = Wi(n);
    }
    function ri() {
      fe = { ...We };
    }
    function Rt(n) {
      R.innerHTML = B[n] || B.normal;
    }
    function qt() {
      let n = gt();
      (a && a.classList.toggle('active', n === 0),
        l.classList.toggle('active', n === 1),
        m.classList.toggle('active', n === 2),
        r.setAttribute('aria-valuetext', `${Be()} degrees`),
        xt());
    }
    function Dt(n) {
      let o = Number(n);
      return Number.isFinite(o) ? Math.max(0, Math.min(S.length - 1, Math.round(o))) : U;
    }
    function gt() {
      return Dt(r.value);
    }
    function Be() {
      return S[gt()] || 8;
    }
    function ai(n) {
      let o = Number(n);
      if (!Number.isFinite(o)) return U;
      let s = U,
        d = 1 / 0;
      return (
        S.forEach((v, E) => {
          let P = Math.abs(v - o);
          P < d && ((d = P), (s = E));
        }),
        s
      );
    }
    function Pt(n) {
      return (n / C) * w;
    }
    function kt(n) {
      let o = Dt(n),
        s = S[o] || 8;
      ((r.value = String(o)), (Q = Pt(s)), Xe(), h(), qt());
    }
    function bt(n) {
      kt(ai(n));
    }
    function si() {
      return Be();
    }
    function yt() {
      (b.classList.toggle('active', e.viewer.isRightEye),
        p.classList.toggle('active', !e.viewer.isRightEye),
        xt());
    }
    function Mt() {
      let n = q.length - 1,
        o = Math.max(0, Math.min(n, Number(y.value) || 0));
      ((e.viewer.cataractLevel = o), (y.value = String(o)));
      let s = q[e.viewer.cataractLevel];
      (y.setAttribute('aria-valuetext', s.label),
        I.forEach((d, v) => {
          d.classList.toggle('active', v === o);
        }),
        xt());
    }
    function xt() {
      if (!N) return;
      let n = e.viewer.isRightEye ? 'RE' : 'LE',
        o = Be(),
        s = J[o] || `${o} degrees`,
        d = q[e.viewer.cataractLevel] || q[0],
        v = d.label === 'None' ? 'No cataract' : d.label,
        E = `${n} - ${s} - ${v}`;
      ((N.textContent = E), N.setAttribute('aria-label', `Current viewing setup: ${E}`));
    }
    function vt(n, o) {
      let s = n === 3,
        d = n === 3 ? 2 : n,
        v = Y[d];
      if (!v || v.length === 0) return null;
      let E = Math.max(0.2, Math.min(1, ie.occlusionSpotRatio)),
        P = Math.max(1, Math.round(v.length * E)),
        $ = E >= 1 ? v : v.slice(0, P);
      return {
        isDenseLevel: s,
        patchProfileLevel: d,
        spotsToRender: $,
        minDimension: o,
        levelBoost: [1, 1.3, 1.75][d] || 1,
        blurMultiplier: [1, 1, 0.68][d] || 1,
        blurCap: [14, 14, 11][d] || 14,
        outerAlphaCap: [0.72, 0.76, 0.8][d] || 0.72,
        coreAlphaCap: [0.8, 0.84, 0.88][d] || 0.8,
        coreBoost: [1.7, 1.9, 2.25][d] || 1.7,
        hardCoreStrengthBase: [0, 0, 0.36][d] || 0,
        hardCoreRadiusX: [0, 0, 0.3][d] || 0,
        hardCoreRadiusY: [0, 0, 0.2][d] || 0,
        coreBlurMultiplier: [0.45, 0.45, 0.28][d] || 0.45
      };
    }
    function Tt(n, o, s, d, v, E) {
      let P = o.radiusBoost || 1,
        $ =
          typeof o.occlusionBlurScaleOverride == 'number'
            ? o.occlusionBlurScaleOverride
            : ie.occlusionBlurScale;
      o.spotsToRender.forEach((H) => {
        let qe = s + (0.5 + H.x * 0.5) * v,
          De = d + (0.5 + H.y * 0.5) * E,
          je = o.isDenseLevel ? 2 : 1,
          be = H.r * o.minDimension * 0.3 * je * P,
          Pi = H.stretchX || 1,
          ki = H.stretchY || 1,
          Ni = H.angle || 0,
          Oi = H.blur * (o.minDimension / 900) * o.blurMultiplier * $,
          _t = Math.max(0.45, Math.min(o.blurCap, Oi)),
          Ft = Math.min(o.outerAlphaCap, H.alpha * o.levelBoost),
          ze = Math.min(o.coreAlphaCap, H.coreAlpha * o.levelBoost * o.coreBoost);
        (n.save(),
          n.translate(qe, De),
          n.rotate(Ni),
          n.scale(Pi, ki),
          (n.filter = `blur(${_t}px)`));
        let at = n.createRadialGradient(0, 0, 0, 0, 0, be);
        if (
          (at.addColorStop(0, `rgba(4, 3, 2, ${Ft})`),
          at.addColorStop(0.55, `rgba(8, 6, 4, ${Ft * 0.82})`),
          at.addColorStop(1, 'rgba(12, 8, 5, 0)'),
          (n.fillStyle = at),
          n.beginPath(),
          n.arc(0, 0, be, 0, 2 * Math.PI),
          n.fill(),
          ze > 0)
        ) {
          let st = n.createRadialGradient(0, 0, 0, 0, 0, be * 0.46);
          (st.addColorStop(0, `rgba(0, 0, 0, ${ze})`),
            st.addColorStop(0.8, `rgba(6, 4, 2, ${ze * 0.46})`),
            st.addColorStop(1, 'rgba(8, 5, 2, 0)'),
            (n.fillStyle = st),
            n.beginPath(),
            n.arc(0, 0, be * 0.46, 0, 2 * Math.PI),
            n.fill(),
            (n.filter = `blur(${Math.max(0.1, _t * o.coreBlurMultiplier)}px)`),
            (n.fillStyle = `rgba(0, 0, 0, ${Math.min(0.88, ze * 0.95)})`),
            n.beginPath(),
            n.ellipse(0, 0, be * 0.26, be * 0.16, 0, 0, 2 * Math.PI),
            n.fill());
          let $t = ie.isMobileLike ? o.hardCoreStrengthBase * 0.55 : o.hardCoreStrengthBase;
          $t > 0 &&
            ((n.filter = 'none'),
            (n.fillStyle = `rgba(0, 0, 0, ${Math.min($t, ze * 1.4)})`),
            n.beginPath(),
            n.ellipse(0, 0, be * o.hardCoreRadiusX, be * o.hardCoreRadiusY, 0, 0, 2 * Math.PI),
            n.fill());
        }
        n.restore();
      });
    }
    function li(n) {
      if (!ie.isMobileLike || n <= 0) return null;
      if (Te.has(n)) return Te.get(n);
      if (typeof document == 'undefined' || typeof document.createElement != 'function')
        return (Te.set(n, null), null);
      let o = vt(n, Le);
      if (!o) return (Te.set(n, null), null);
      let s = document.createElement('canvas');
      ((s.width = Le), (s.height = Le));
      let d = s.getContext('2d');
      return d
        ? (d.save(),
          (d.globalCompositeOperation = 'source-over'),
          Tt(d, o, 0, 0, Le, Le),
          (d.filter = 'none'),
          d.restore(),
          Te.set(n, s),
          s)
        : (Te.set(n, null), null);
    }
    function ci(n, o) {
      if (!ie.isMobileLike || n <= 0 || t.width <= 0 || t.height <= 0) return null;
      let s = `${n}:${t.width}x${t.height}`;
      if (Ie.has(s)) return Ie.get(s);
      if (typeof document == 'undefined' || typeof document.createElement != 'function')
        return (Ie.set(s, null), null);
      let d = document.createElement('canvas');
      ((d.width = t.width), (d.height = t.height));
      let v = d.getContext('2d');
      if (!v) return (Ie.set(s, null), null);
      (o.yellowTint > 0 &&
        ((v.fillStyle = `rgba(226, 188, 92, ${o.yellowTint})`),
        v.fillRect(0, 0, d.width, d.height)),
        o.darkTint > 0 &&
          ((v.fillStyle = `rgba(35, 24, 5, ${o.darkTint})`), v.fillRect(0, 0, d.width, d.height)),
        o.hazeTint > 0 &&
          ((v.fillStyle = `rgba(250, 236, 208, ${o.hazeTint})`),
          v.fillRect(0, 0, d.width, d.height)));
      let E = Se * 1.12,
        P = d.width * E,
        $ = d.height * E,
        H = (d.width - P) / 2,
        qe = (d.height - $) / 2,
        De = vt(n, Math.max(1, Math.min(P, $)));
      return (
        De &&
          ((De.radiusBoost = 1.08),
          (De.occlusionBlurScaleOverride = 0.92),
          Tt(v, De, H, qe, P, $),
          (v.filter = 'none')),
        Ie.set(s, d),
        d
      );
    }
    function ui(n, o) {
      let s = ci(n, o);
      s &&
        (i.save(),
        (i.globalCompositeOperation = 'source-over'),
        i.drawImage(s, 0, 0, t.width, t.height),
        i.restore());
    }
    function di(n, o, s, d, v) {
      let E = li(v);
      if (E) {
        (i.save(),
          (i.globalCompositeOperation = 'source-over'),
          i.drawImage(E, n, o, s, d),
          i.restore());
        return;
      }
      let P = Math.min(s, d),
        $ = vt(v, P);
      $ &&
        (i.save(),
        (i.globalCompositeOperation = 'source-over'),
        Tt(i, $, n, o, s, d),
        (i.filter = 'none'),
        i.restore());
    }
    function Ye(n) {
      let o =
          typeof n == 'number'
            ? n
            : typeof window != 'undefined' && window.performance
              ? window.performance.now()
              : Date.now(),
        s = ie.isMobileLike && e.viewer.cataractLevel > 0,
        d = s ? ie.cataractJitterIntervalMs : ie.baseJitterIntervalMs;
      if (s && Z) {
        oe = requestAnimationFrame(Ye);
        return;
      }
      if (o - _e < d) {
        oe = requestAnimationFrame(Ye);
        return;
      }
      _e = o;
      let v = s ? 0.58 : 1,
        E = $e * fe.jitterMultiplier * v,
        P = Math.max(0.72, 0.85 - (fe.jitterMultiplier - 1) * 0.04),
        $ = (Math.random() - 0.5) * E,
        H = (Math.random() - 0.5) * E;
      ((re += $),
        (X += H),
        (re *= P),
        (X *= P),
        (K += re),
        (F += X),
        Xe(),
        h(),
        (oe = requestAnimationFrame(Ye)));
    }
    function mi(n = {}) {
      e.viewer.shiftInProgress = !0;
      let o = Z,
        s = re,
        d = X;
      ((Z = !1), (re = 0), (X = 0));
      let v = K,
        E = F,
        P = xe(n.distanceMultiplier, 0.25, 4, 1) * fe.shiftDistanceMultiplier,
        $ = Ve * P,
        H = xe(n.returnDelayMs, Pe.shiftDurationMs.min, Pe.shiftDurationMs.max, fe.shiftDurationMs),
        qe = Math.random() * 2 * Math.PI;
      ((K += $ * Math.cos(qe)),
        (F += $ * Math.sin(qe)),
        Xe(),
        h(),
        pe !== null && (clearTimeout(pe), (pe = null)),
        (pe = setTimeout(() => {
          ((K = v),
            (F = E),
            Xe(),
            h(),
            (Z = o),
            (re = s),
            (X = d),
            (e.viewer.shiftInProgress = !1),
            (pe = null));
        }, H)));
    }
    function hi() {
      if (ie.isMobileLike || z !== null) return;
      let n = () => {
        (Z
          ? (de = { x: (Math.random() - 0.5) * 100, y: (Math.random() - 0.5) * 100 })
          : (de = { x: 0, y: 0 }),
          (ye.x += (de.x - ye.x) * 0.1),
          (ye.y += (de.y - ye.y) * 0.1),
          h(),
          (z = requestAnimationFrame(n)));
      };
      n();
    }
    function fi() {
      (z !== null && (cancelAnimationFrame(z), (z = null)), (ye = { x: 0, y: 0 }), h());
    }
    function rt() {
      if (!D.naturalWidth || !D.naturalHeight) return;
      let n = Math.max(0.45, Math.min(1, ie.canvasScale));
      ((t.width = Math.max(1, Math.round(D.naturalWidth * n))),
        (t.height = Math.max(1, Math.round(D.naturalHeight * n))),
        (i.imageSmoothingEnabled = !0),
        (i.imageSmoothingQuality = ie.isMobileLike ? 'medium' : 'high'),
        (j = t.width / 2),
        (_ = t.height / 2),
        (re = 0),
        (X = 0),
        (K = 0),
        (F = 0),
        Ie.clear(),
        h());
    }
    function pi() {
      if (!c || !D.naturalWidth || !D.naturalHeight) return;
      i.clearRect(0, 0, t.width, t.height);
      let n = ln({
          canvasWidth: t.width,
          canvasHeight: t.height,
          imageNaturalWidth: D.naturalWidth,
          imageNaturalHeight: D.naturalHeight,
          imageScale: we,
          zoomFactor: Se,
          bgOffsetX: K,
          bgOffsetY: F,
          circleRadius: Q,
          circleX: j,
          isRightEye: e.viewer.isRightEye
        }),
        o = q[e.viewer.cataractLevel] || q[0];
      (gi(n, o), yi(n, o), xi(n), vi());
    }
    function Nt(n, o, s) {
      (i.beginPath(), i.arc(n, o, s, 0, 2 * Math.PI, !0), i.closePath(), i.clip());
    }
    function gi(n, o) {
      if (
        (i.save(),
        e.viewer.isRightEye || (i.translate(t.width, 0), i.scale(-1, 1)),
        Nt(n.flippedCircleX, _, n.effectiveCircleRadius),
        e.viewer.isDiscVisible)
      ) {
        let s = ei(n);
        (i.save(),
          Lt(s),
          (i.filter = ti(o)),
          i.drawImage(
            D,
            0,
            0,
            D.naturalWidth,
            D.naturalHeight,
            s.offsetXPos,
            s.offsetYPos,
            s.scaledWidth,
            s.scaledHeight
          ),
          (i.filter = 'none'),
          i.restore(),
          ie.isMobileLike && e.viewer.cataractLevel > 0
            ? ui(e.viewer.cataractLevel, o)
            : (bi(o),
              i.save(),
              Lt(s),
              di(s.offsetXPos, s.offsetYPos, s.scaledWidth, s.scaledHeight, e.viewer.cataractLevel),
              i.restore()));
      } else ((i.fillStyle = 'black'), i.fillRect(0, 0, t.width, t.height));
      i.restore();
    }
    function bi(n) {
      (n.yellowTint > 0 &&
        ((i.fillStyle = `rgba(226, 188, 92, ${n.yellowTint})`),
        i.fillRect(0, 0, t.width, t.height)),
        n.darkTint > 0 &&
          ((i.fillStyle = `rgba(35, 24, 5, ${n.darkTint})`), i.fillRect(0, 0, t.width, t.height)),
        n.hazeTint > 0 &&
          ((i.fillStyle = `rgba(250, 236, 208, ${n.hazeTint})`),
          i.fillRect(0, 0, t.width, t.height)));
    }
    function yi(n, o) {
      (i.save(),
        Nt(j, _, n.effectiveCircleRadius),
        e.viewer.isDiscVisible && Mi(n.effectiveCircleRadius, o),
        i.restore());
    }
    function Mi(n, o) {
      let s = dn({
          cataractLevel: e.viewer.cataractLevel,
          darkTint: o.darkTint,
          yellowTint: o.yellowTint
        }),
        v =
          375 * (D.naturalHeight > 0 ? Math.max(0.45, Math.min(1, t.height / D.naturalHeight)) : 1),
        E = 1.3,
        P = 0.6 * v * E,
        $ = 0.5 * v * E,
        H = 0.7,
        qe = P * H,
        De = $ * H,
        je = j + ye.x,
        be = _ + 0.3 * n + ye.y;
      (i.save(),
        i.translate(je, be),
        i.scale(1, -1),
        i.translate(-je, -be),
        Ot(je, be, P, $, 0.5 * s),
        Ot(je, be, qe, De, s),
        i.restore());
    }
    function Ot(n, o, s, d, v) {
      let E = s / 2,
        P = d / 2,
        $ = P * 0.6;
      (i.beginPath(),
        i.ellipse(n, o, E, P, 0, Math.PI, 2 * Math.PI, !1),
        i.ellipse(n, o, E, $, 0, 0, Math.PI, !1),
        i.closePath(),
        (i.fillStyle = `rgba(255,255,255,${v})`),
        i.fill());
    }
    function xi(n) {
      let o = 18 * n.windowScale * n.scaleFactor;
      (i.save(),
        i.beginPath(),
        i.arc(j, _, n.effectiveCircleRadius, 0, 2 * Math.PI, !0),
        (i.strokeStyle = 'rgba(255, 255, 255, 0.24)'),
        (i.lineWidth = o * 2),
        i.stroke(),
        i.beginPath(),
        i.arc(j, _, n.effectiveCircleRadius, 0, 2 * Math.PI, !0),
        (i.strokeStyle = 'rgba(255, 255, 255, 0.66)'),
        (i.lineWidth = o),
        i.stroke(),
        i.beginPath(),
        i.arc(j, _, n.effectiveCircleRadius, 0, 2 * Math.PI, !0),
        (i.strokeStyle = 'rgba(255, 255, 255, 0.92)'),
        (i.lineWidth = Math.max(2, o * 0.5)),
        i.stroke(),
        i.restore());
    }
    function vi() {
      let n = Math.max(1, t.clientWidth || t.width),
        o = Math.max(1, t.clientHeight || t.height),
        s = t.width / n,
        d = t.height / o,
        v = Math.max(10, Math.min(16, n * 0.02)),
        E = Math.max(10, Math.min(13, n * 0.011)),
        P = v * s,
        $ = o * 0.5 * d,
        H = E * s;
      (i.save(),
        (i.fillStyle = 'white'),
        (i.font = `600 ${H}px 'Inter', 'Segoe UI', 'Helvetica Neue', Arial, sans-serif`),
        (i.textAlign = 'center'),
        (i.textBaseline = 'middle'),
        e.viewer.isRightEye
          ? (i.save(),
            i.translate(P, $),
            i.rotate(-Math.PI / 2),
            i.fillText('Temporal', 0, 0),
            i.restore(),
            i.save(),
            i.translate(t.width - P, $),
            i.rotate(Math.PI / 2),
            i.fillText('Nasal', 0, 0),
            i.restore())
          : (i.save(),
            i.translate(P, $),
            i.rotate(-Math.PI / 2),
            i.fillText('Nasal', 0, 0),
            i.restore(),
            i.save(),
            i.translate(t.width - P, $),
            i.rotate(Math.PI / 2),
            i.fillText('Temporal', 0, 0),
            i.restore()),
        i.restore());
    }
    function Xe() {
      if (!D.naturalWidth || !D.naturalHeight) return;
      let n = cn({
          canvasWidth: t.width,
          canvasHeight: t.height,
          imageNaturalWidth: D.naturalWidth,
          imageNaturalHeight: D.naturalHeight,
          circleRadius: Q,
          zoomFactor: Se
        }),
        o = un({ circleX: j, circleY: _, velocityX: re, velocityY: X, bounds: n });
      ((j = o.circleX), (_ = o.circleY), (re = o.velocityX), (X = o.velocityY));
    }
    function Ti() {
      Be() !== 8 && bt(8);
    }
    function Ii(n) {
      let o = !!n;
      (Be() === 15) !== o && bt(o ? 15 : 8);
    }
    function wi() {
      return Be() === 15;
    }
    function Si(n) {
      let o = !!n;
      e.viewer.isRightEye !== o && ((f.checked = !o), (e.viewer.isRightEye = o), rt(), yt());
    }
    function Ai() {
      return e.viewer.isRightEye;
    }
    function Ei(n) {
      let o = q.length - 1,
        s = Math.max(0, Math.min(o, Number(n) || 0));
      Number(y.value) !== s && ((y.value = String(s)), Mt(), h());
    }
    function Ci() {
      return Number(y.value) || 0;
    }
    function Li(n) {
      ((e.viewer.isDiscVisible = n), h());
    }
    function Ri(n) {
      (k.forEach((o) => {
        o.disabled = n;
      }),
        (r.disabled = n),
        (f.disabled = n),
        (y.disabled = n));
    }
    function qi() {
      return e.viewer.conditionImageSrc || T;
    }
    function Di() {
      ((c = !1),
        (M = {}),
        (D.onload = null),
        (D.onerror = null),
        Ne.splice(0).forEach((n) => {
          n();
        }),
        oe !== null && (cancelAnimationFrame(oe), (oe = null)),
        ge !== null && (cancelAnimationFrame(ge), (ge = null)),
        z !== null && (cancelAnimationFrame(z), (z = null)),
        pe !== null && (clearTimeout(pe), (pe = null)),
        (e.viewer.shiftInProgress = !1),
        Te.clear(),
        Ie.clear());
    }
    return {
      initialize: g,
      doGazeShift: mi,
      setDiscVisible: Li,
      setImageSource: Ae,
      setViewerControlsDisabled: Ri,
      ensureUndilated: Ti,
      setDilated: Ii,
      getIsDilated: wi,
      setRightEye: Si,
      getIsRightEye: Ai,
      setCataractLevel: Ei,
      getCataractLevel: Ci,
      setTimedAugmentation: ni,
      clearTimedAugmentation: ii,
      setTimedMotionProfile: oi,
      clearTimedMotionProfile: ri,
      setFovDegrees: bt,
      getFovDegrees: si,
      getActiveConditionImagePath: qi,
      destroy: Di
    };
  }
  var Ui = [
    'a[href]',
    'button:not([disabled])',
    'input:not([disabled]):not([type="hidden"])',
    'select:not([disabled])',
    'textarea:not([disabled])',
    '[tabindex]:not([tabindex="-1"])'
  ].join(',');
  function pn({
    state: e,
    stateMachine: t,
    sideMenu: r,
    sideMenuButtons: a,
    burgerIcon: l,
    infoIcon: m,
    infoModal: f,
    testModal: b
  }) {
    function p(i) {
      (t.setSideMenuOpen(i),
        r.classList.toggle('open', i),
        r.setAttribute('aria-hidden', i ? 'false' : 'true'),
        l.setAttribute('aria-expanded', i ? 'true' : 'false'),
        (r.inert = !i),
        a.forEach((C) => {
          var S;
          let w = ((S = C.dataset) == null ? void 0 : S.locked) === 'true';
          ((C.disabled = !i || w), (C.tabIndex = i && !w ? 0 : -1));
        }),
        i
          ? queueMicrotask(() => {
              T(r);
            })
          : r.contains(document.activeElement) && l.focus());
    }
    function y() {
      p(!e.ui.sideMenuOpen);
    }
    function I(i) {
      return i.classList.contains('is-open');
    }
    function N(i, C, w) {
      if (C) {
        let U =
          w || (document.activeElement instanceof HTMLElement ? document.activeElement : null);
        i.returnFocusEl = U;
      }
      (i.classList.toggle('is-open', C),
        i.setAttribute('aria-hidden', C ? 'false' : 'true'),
        t.setActiveModal(C ? i.id : null),
        w && w.setAttribute('aria-expanded', C ? 'true' : 'false'));
      let S = I(f) || I(b);
      if ((document.body.classList.toggle('modal-open', S), C)) {
        requestAnimationFrame(() => {
          I(i) && T(i);
        });
        return;
      }
      let J = i.returnFocusEl;
      ((i.returnFocusEl = null), J && typeof J.focus == 'function' && J.isConnected && J.focus());
    }
    function R() {
      return I(b) ? b : I(f) ? f : null;
    }
    function k(i) {
      return Array.from(i.querySelectorAll(Ui)).filter((C) => C.getClientRects().length > 0);
    }
    function T(i) {
      let C = k(i);
      if (C.length > 0) {
        C[0].focus();
        return;
      }
      (i.setAttribute('tabindex', '-1'), i.focus());
    }
    function B(i, C) {
      let w = k(C);
      if (w.length === 0) {
        (i.preventDefault(), C.focus());
        return;
      }
      let S = w[0],
        J = w[w.length - 1],
        U = document.activeElement;
      if (!C.contains(U)) {
        (i.preventDefault(), i.shiftKey ? J.focus() : S.focus());
        return;
      }
      i.shiftKey && U === S
        ? (i.preventDefault(), J.focus())
        : !i.shiftKey && U === J && (i.preventDefault(), S.focus());
    }
    function q(i, { closeTestModal: C }) {
      let w = i.target;
      (w === f && N(f, !1, m),
        w === b && C(),
        e.ui.sideMenuOpen && !r.contains(w) && !l.contains(w) && p(!1));
    }
    function Y(i, { closeTestModal: C }) {
      if (i.key === 'Tab') {
        let w = R();
        w && B(i, w);
      }
      i.key === 'Escape' && (I(f) && N(f, !1, m), I(b) && C(), e.ui.sideMenuOpen && p(!1));
    }
    return {
      setSideMenuOpen: p,
      toggleSideMenu: y,
      isModalOpen: I,
      setModalState: N,
      handleDocumentClick: q,
      handleDocumentKeyDown: Y,
      destroy: () => {}
    };
  }
  var gn = {
    name: 'Advanced',
    className: 'advanced-star',
    questionCount: 7,
    optionCount: 5,
    passRatio: 0.7,
    timeLimitSeconds: 0,
    questionIds: [],
    questionPrompts: []
  };
  function Vi(e, t) {
    let r = e && typeof e == 'object' ? e : {},
      a = String(r.name || `Level ${t + 1}`),
      l = String(r.className || ''),
      m = Math.max(1, Number(r.questionCount) || 7),
      f = Math.max(2, Number(r.optionCount) || 5),
      b = Math.min(1, Math.max(0.5, Number(r.passRatio) || 0.7)),
      p = Math.max(0, Number(r.timeLimitSeconds) || 0),
      y = Array.isArray(r.questionIds)
        ? r.questionIds.filter((N) => typeof N == 'string' && N.trim().length > 0)
        : [],
      I = Array.isArray(r.questionPrompts)
        ? r.questionPrompts.filter((N) => typeof N == 'string' && N.trim().length > 0)
        : [];
    return {
      name: a,
      className: l,
      questionCount: m,
      optionCount: f,
      passRatio: b,
      timeLimitSeconds: p,
      questionIds: y,
      questionPrompts: I
    };
  }
  function Yi(e, t) {
    let r = Math.max(1, Number(t) || 1),
      a = Number(e == null ? void 0 : e.nextTierIndex),
      l = Number(e == null ? void 0 : e.unlockedTierIndex),
      m = Number.isFinite(a) ? Math.max(0, Math.min(r, Math.floor(a))) : 0,
      f = m >= r ? r - 1 : Math.max(-1, m - 1),
      b = Number.isFinite(l) ? Math.min(f, Math.max(-1, Math.min(r - 1, Math.floor(l)))) : -1;
    return { nextTierIndex: m, unlockedTierIndex: b };
  }
  function Xi(e) {
    return Array.isArray(e)
      ? e
          .map((t, r) => {
            if (!t || typeof t != 'object') return null;
            let a = `q${String(r + 1).padStart(2, '0')}`,
              l = typeof t.id == 'string' && t.id.trim().length > 0 ? t.id : a,
              m = typeof t.question == 'string' ? t.question : '';
            return { id: l, prompt: m, sourceQuestion: t };
          })
          .filter(Boolean)
      : [];
  }
  function zi(e) {
    let t = Math.max(0, Number(e) || 0),
      r = Math.floor(t / 60)
        .toString()
        .padStart(2, '0'),
      a = Math.floor(t % 60)
        .toString()
        .padStart(2, '0');
    return `${r}:${a}`;
  }
  function bn({
    state: e,
    stateMachine: t,
    questionBank: r,
    buildMcqTest: a,
    evaluateMcqSubmission: l,
    generatePassCode: m,
    formatMcqResultText: f,
    setModalState: b,
    testModal: p,
    triggerButton: y,
    testContainer: I,
    submitTestButton: N,
    retryTestButton: R,
    saveResultButton: k,
    testResultDiv: T,
    testModalTitle: B,
    mcqTimer: q,
    mcqTierConfigs: Y,
    initialProgressState: i,
    onProgressChange: C
  }) {
    let w = I.ownerDocument || document,
      S = Array.isArray(Y) && Y.length > 0 ? Y.map((c, M) => Vi(c, M)) : [gn],
      J = Xi(r),
      U = Yi(i, S.length),
      Q = Math.min(U.nextTierIndex, S.length - 1),
      j = U.unlockedTierIndex,
      _ = U.nextTierIndex,
      K = null,
      F = 0;
    function Z(c) {
      if (J.length === 0) return [];
      let M = new Set(c);
      return J.filter((x) => M.has(x.id)).map((x) => x.sourceQuestion);
    }
    function le(c) {
      if (J.length === 0) return [];
      let M = new Set(c);
      return J.filter((x) => M.has(x.prompt)).map((x) => x.sourceQuestion);
    }
    function re() {
      S.forEach((c) => {
        let M = Array.isArray(c.questionIds) && c.questionIds.length > 0,
          x = Array.isArray(c.questionPrompts) && c.questionPrompts.length > 0;
        if (!M && !x) return;
        let L = M ? Z(c.questionIds) : le(c.questionPrompts);
        if (L.length < c.questionCount)
          throw new Error(
            `MCQ tier "${c.name}" has ${L.length} configured questions but requires at least ${c.questionCount}.`
          );
      });
    }
    re();
    function X() {
      typeof C == 'function' && C(Oe());
    }
    function ye(c) {
      let M = Math.min(_, S.length - 1),
        x = typeof c == 'number' ? c : M;
      return !Number.isInteger(x) || x < 0 || x >= S.length || x > _ ? null : x;
    }
    function de() {
      return S[Math.min(Q, S.length - 1)] || gn;
    }
    function z() {
      K && (clearInterval(K), (K = null));
    }
    function we() {
      if (!q) return;
      let c = de();
      if (e.mcq.lastResult) {
        ((q.hidden = !0), (q.textContent = ''), q.classList.remove('is-warning'));
        return;
      }
      let M = Math.max(1, Math.ceil(c.questionCount * c.passRatio));
      if (((q.hidden = !1), c.timeLimitSeconds <= 0)) {
        ((q.textContent = `Pass mark ${M}/${c.questionCount} \xB7 Untimed`),
          q.classList.remove('is-warning'));
        return;
      }
      ((q.textContent = `Pass mark ${M}/${c.questionCount} \xB7 ${zi(F)} left`),
        q.classList.toggle('is-warning', F <= 15));
    }
    function Se() {
      z();
      let c = de();
      ((F = Math.max(0, Number(c.timeLimitSeconds) || 0)),
        we(),
        !(F <= 0) &&
          (K = setInterval(() => {
            ((F -= 1), we(), !(F > 0) && (z(), $e({ autoSubmitted: !0 })));
          }, 1e3)));
    }
    function ie() {
      if (!B) return;
      let c = de();
      B.textContent = `${c.name} MCQ`;
    }
    function V() {
      var c;
      ((T.textContent = ''),
        (T.className = 'result-text'),
        (c = T.removeAttribute) == null || c.call(T, 'tabindex'),
        (N.hidden = !1),
        (N.disabled = !1),
        R && (R.hidden = !0),
        (k.hidden = !0));
    }
    function fe({ beforeOpen: c, tierIndex: M } = {}) {
      if ((typeof c == 'function' && c(), !t.beginMcqSession())) return !1;
      let x = ye(M);
      return x === null
        ? (t.endMcqSession(), !1)
        : ((Q = x), V(), ie(), pe(), Se(), X(), b(p, !0, y), !0);
    }
    function Ve() {
      (t.endMcqSession(), z(), b(p, !1, null), (I.innerHTML = ''), we());
    }
    function pe() {
      let c = de(),
        M = oe(c);
      ((e.mcq.selectedQuestions = a(M, c.questionCount, Math.random, c.optionCount)), ge());
    }
    function oe(c) {
      return !Array.isArray(r) || r.length === 0
        ? []
        : Array.isArray(c.questionIds) && c.questionIds.length > 0
          ? Z(c.questionIds)
          : !Array.isArray(c.questionPrompts) || c.questionPrompts.length === 0
            ? r
            : le(c.questionPrompts);
    }
    function ge() {
      ((I.innerHTML = ''),
        e.mcq.selectedQuestions.forEach((c, M) => {
          let x = w.createElement('fieldset');
          ((x.className = 'question'), (x.dataset.questionId = c.id));
          let L = w.createElement('legend');
          ((L.textContent = `${M + 1}. ${c.prompt}`), x.appendChild(L));
          let W = w.createElement('div');
          ((W.className = 'options'),
            c.choices.forEach((u, h) => {
              let g = w.createElement('label'),
                A = w.createElement('input'),
                O = String.fromCharCode(65 + h),
                G = w.createElement('span');
              ((A.type = 'radio'),
                (A.name = `question${M}`),
                (A.value = u.id),
                g.appendChild(A),
                (G.textContent = ` ${O}) ${u.text}`),
                g.appendChild(G),
                W.appendChild(g));
            }),
            x.appendChild(W));
          let ae = w.createElement('p');
          ((ae.className = 'answer-explanation'),
            (ae.hidden = !0),
            x.appendChild(ae),
            I.appendChild(x));
        }));
    }
    function _e({ passed: c, score: M, maxScore: x, passThreshold: L }) {
      let W = '',
        ae = !1;
      if (c && Q === _ && _ < S.length)
        ((j = Math.max(j, _)), (W = `Unlocked ${S[_].name} star.`), (_ += 1), (ae = !0));
      else if (_ >= S.length) ((j = S.length - 1), (W = 'All MCQ levels already unlocked.'));
      else {
        let u = S[Math.min(_, S.length - 1)];
        W = `Need ${L}/${x} to unlock ${u.name}.`;
      }
      return (c || (W = `Scored ${M}/${x}. ${W}`), ae && X(), { starLine: W });
    }
    function Fe() {
      return S.slice(0, j + 1)
        .map(
          (M) => `<span class="${M.className}" aria-label="${M.name} star">&#9733; ${M.name}</span>`
        )
        .join(' ');
    }
    function $e({ autoSubmitted: c = !1 } = {}) {
      var u, h, g;
      if (e.mcq.selectedQuestions.length === 0 || e.mcq.lastResult) return;
      let M = e.mcq.selectedQuestions.map((A, O) => {
          let G = I.querySelector(`input[name="question${O}"]:checked`);
          return G ? G.value : null;
        }),
        x = de(),
        L = l(e.mcq.selectedQuestions, M, x.passRatio);
      if (!L.isComplete && !c) {
        let A = M.findIndex((O) => !O);
        ((T.textContent = 'Please answer all questions before submitting.'),
          (T.className = 'test-result is-review'),
          (u = I.querySelector(`input[name="question${A}"]`)) == null || u.focus());
        return;
      }
      (L.details.forEach((A) => {
        let O = I.querySelectorAll('.question')[A.index];
        if (A.selectedChoiceId && !A.isCorrect) {
          let Me = I.querySelector(
            `input[name="question${A.index}"][value="${A.selectedChoiceId}"]`
          );
          Me && Me.parentElement.classList.add('wrong-answer-label');
        }
        let G = I.querySelector(`input[name="question${A.index}"][value="${A.correctChoiceId}"]`);
        G && G.parentElement.classList.add('correct-answer-label');
        let ee = O == null ? void 0 : O.querySelector('.answer-explanation');
        ee && ((ee.textContent = A.explanation), (ee.hidden = !1));
      }),
        I.querySelectorAll('input[type="radio"]').forEach((A) => {
          A.disabled = !0;
        }),
        z(),
        (e.mcq.lastResult = {
          ...L,
          passCode: L.passed ? m(8) : null,
          completedAt: new Date().toISOString(),
          tierName: x.name,
          tierIndex: Q,
          timed: x.timeLimitSeconds > 0,
          timedOut: c
        }));
      let ae = _e({
        passed: L.passed,
        score: L.score,
        maxScore: L.maxScore,
        passThreshold: L.passThreshold
      });
      ((N.hidden = !0),
        R && ((R.hidden = !1), (R.textContent = 'Try again')),
        Le(e.mcq.lastResult, ae.starLine),
        (k.hidden = !1),
        we(),
        (h = T.setAttribute) == null || h.call(T, 'tabindex', '-1'),
        (g = T.focus) == null || g.call(T));
    }
    function Te() {
      var c;
      return t.beginMcqSession()
        ? (z(),
          V(),
          ie(),
          pe(),
          Se(),
          (c = I.querySelector('input[type="radio"]')) == null || c.focus(),
          !0)
        : !1;
    }
    function Ie() {
      if (!e.mcq.lastResult) return;
      let c = f(e.mcq.lastResult),
        M = new Blob([c], { type: 'text/plain' }),
        x = URL.createObjectURL(M),
        L = w.createElement('a');
      ((L.href = x),
        (L.download = Ne(e.mcq.lastResult.completedAt)),
        w.body.appendChild(L),
        L.click(),
        w.body.removeChild(L),
        URL.revokeObjectURL(x));
    }
    function Le(c, M) {
      let x = Fe(),
        L = `Level ${c.tierIndex + 1} (${c.tierName}): ${c.score}/${c.maxScore}. `;
      (c.passed ? ((L += 'Pass. '), c.passCode && (L += `Code: ${c.passCode}. `)) : (L += 'Fail. '),
        c.timed && c.timedOut && (L += 'Time expired. '),
        (L += M),
        x && (L += `<br>${x}`),
        (T.innerHTML = L));
    }
    function Ne(c) {
      return `mcq_result_${c ? c.replace(/[:-]/g, '').replace(/\.\d{3}Z$/, 'Z') : 'unknown'}.txt`;
    }
    function Oe() {
      return S.map((c, M) => ({
        index: M,
        name: c.name,
        unlocked: M <= _,
        completed: M <= j,
        active: M === Math.min(_, S.length - 1)
      }));
    }
    function D() {
      return { nextTierIndex: _, unlockedTierIndex: j };
    }
    return {
      openTestModal: fe,
      closeTestModal: Ve,
      handleSubmitTest: $e,
      handleRetryTest: Te,
      handleSaveResult: Ie,
      getLevelProgress: Oe,
      getProgressState: D,
      destroy: () => {
        (z(),
          t.endMcqSession(),
          (I.innerHTML = ''),
          (T.textContent = ''),
          we(),
          (j = -1),
          (_ = 0),
          (Q = 0),
          X());
      }
    };
  }
  var se = Object.freeze([
      { name: 'Primary', className: 'primary-star' },
      { name: 'Intermediate', className: 'intermediate-star' },
      { name: 'Advanced', className: 'advanced-star' }
    ]),
    vn = 5,
    He = Object.freeze({ undilated: 8, dilated: 15 }),
    Hi = 1,
    ct = Object.freeze({ seconds: vn, isDilated: !1, fovDegrees: He.undilated, cataractLevel: 0 }),
    yn = Object.freeze([
      {
        rotateMaxDegrees: 2.4,
        rotateMinDegrees: 0.9,
        scaleMin: 0.94,
        scaleMax: 1.07,
        minScaleDelta: 0.02,
        panMaxRatio: 0.025,
        panMinRatio: 0.008,
        brightnessJitter: 0.035,
        brightnessMinJitter: 0.015,
        contrastJitter: 0.035,
        contrastMinJitter: 0.015,
        saturationJitter: 0.03,
        saturationMinJitter: 0.01
      },
      {
        rotateMaxDegrees: 4.2,
        rotateMinDegrees: 1.6,
        scaleMin: 0.91,
        scaleMax: 1.1,
        minScaleDelta: 0.03,
        panMaxRatio: 0.04,
        panMinRatio: 0.012,
        brightnessJitter: 0.06,
        brightnessMinJitter: 0.025,
        contrastJitter: 0.06,
        contrastMinJitter: 0.025,
        saturationJitter: 0.06,
        saturationMinJitter: 0.025
      },
      {
        rotateMaxDegrees: 5.2,
        rotateMinDegrees: 1.9,
        scaleMin: 0.89,
        scaleMax: 1.12,
        minScaleDelta: 0.04,
        panMaxRatio: 0.048,
        panMinRatio: 0.015,
        brightnessJitter: 0.07,
        brightnessMinJitter: 0.03,
        contrastJitter: 0.07,
        contrastMinJitter: 0.03,
        saturationJitter: 0.07,
        saturationMinJitter: 0.03
      }
    ]),
    Mn = Object.freeze([
      {
        jitterMultiplierMin: 1.9,
        jitterMultiplierMax: 2.4,
        shiftDistanceMin: 1.15,
        shiftDistanceMax: 1.45,
        shiftDurationMinMs: 580,
        shiftDurationMaxMs: 800
      },
      {
        jitterMultiplierMin: 2.3,
        jitterMultiplierMax: 2.9,
        shiftDistanceMin: 1.35,
        shiftDistanceMax: 1.7,
        shiftDurationMinMs: 540,
        shiftDurationMaxMs: 760
      },
      {
        jitterMultiplierMin: 2.6,
        jitterMultiplierMax: 3.1,
        shiftDistanceMin: 1.45,
        shiftDistanceMax: 1.9,
        shiftDurationMinMs: 520,
        shiftDurationMaxMs: 740
      }
    ]);
  function Je(e, t) {
    return e + Math.random() * (t - e);
  }
  function ut(e, t) {
    let r = Math.max(0, Number(e) || 0),
      a = Math.max(0, Math.min(r, Number(t) || 0));
    if (r === 0) return 0;
    let l = Je(a, r);
    return Math.random() >= 0.5 ? l : -l;
  }
  function Ji(e, t, r) {
    let a = Math.min(Number(e) || 1, Number(t) || 1),
      l = Math.max(Number(e) || 1, Number(t) || 1),
      m = Math.max(0, Number(r) || 0);
    if (a === l) return a;
    for (let f = 0; f < 10; f += 1) {
      let b = Je(a, l);
      if (Math.abs(b - 1) >= m) return b;
    }
    return Math.abs(a - 1) >= Math.abs(l - 1) ? a : l;
  }
  function wt(e, t) {
    return 1 + ut(e, t);
  }
  function xn(e) {
    let t = Number(e),
      r = Number.isFinite(t) ? Math.round(t) : ct.cataractLevel;
    return Math.max(0, Math.min(Hi, r));
  }
  function Qi(e, t) {
    let r = Math.max(1, Number(t) || 1),
      a = Number(e == null ? void 0 : e.nextTierIndex),
      l = Number(e == null ? void 0 : e.unlockedTierIndex),
      m = Number.isFinite(a) ? Math.max(0, Math.min(r, Math.floor(a))) : 0,
      f = m >= r ? r - 1 : Math.max(-1, m - 1),
      b = Number.isFinite(l) ? Math.min(f, Math.max(-1, Math.min(r - 1, Math.floor(l)))) : -1;
    return { nextTierIndex: m, unlockedTierIndex: b };
  }
  function Tn({
    state: e,
    stateMachine: t,
    timedImages: r,
    timedRoundsPerCategory: a,
    timedTotalRounds: l,
    timedRoundProfiles: m,
    initialProgressState: f,
    onProgressChange: b,
    closeTestModal: p,
    setModalState: y,
    infoModal: I,
    infoIcon: N,
    explanationDiv: R,
    timedGuessBox: k,
    timedMessage: T,
    timedCountdown: B,
    submitTimedGuessButton: q,
    timedTestResult: Y,
    viewer: i
  }) {
    let C = 'input[name="timedGuess"]',
      w = Array.isArray(m) ? m : [],
      S = Math.max(1, Number(l) || 4),
      J = Math.max(1, Number(a) || 1),
      U = Qi(f, se.length),
      Q = null,
      j = [],
      _ = [],
      K = U.unlockedTierIndex,
      F = U.nextTierIndex,
      Z = Math.min(U.nextTierIndex, se.length - 1),
      le = !1,
      re = 0,
      X = !1,
      ye = [];
    function de() {
      typeof b == 'function' && b(Ne());
    }
    function z({ tierIndex: u } = {}) {
      if (!t.beginTimedSession()) return !1;
      (p(),
        y(I, !1, N),
        M(),
        ae(),
        typeof i.clearTimedAugmentation == 'function' && i.clearTimedAugmentation(),
        typeof i.clearTimedMotionProfile == 'function' && i.clearTimedMotionProfile(),
        (Q = {
          fovDegrees: typeof i.getFovDegrees == 'function' ? i.getFovDegrees() : null,
          isDilated: typeof i.getIsDilated == 'function' ? i.getIsDilated() : !1,
          cataractLevel: typeof i.getCataractLevel == 'function' ? i.getCataractLevel() : 0,
          isRightEye: typeof i.getIsRightEye == 'function' ? i.getIsRightEye() : !0
        }));
      let h = Ve(u);
      return h === null
        ? (t.endTimedSession(), !1)
        : ((j = Fe(r, J, S)),
          (_ = $e(j.length || S)),
          (Z = h),
          (le = !1),
          i.setDiscVisible(!0),
          (Y.innerHTML = ''),
          (T.textContent = ''),
          (B.textContent = ''),
          (k.hidden = !1),
          (R.hidden = !0),
          i.setViewerControlsDisabled(!0),
          x(!0),
          de(),
          we(),
          !0);
    }
    function we() {
      e.timed.round += 1;
      let u = oe();
      if (e.timed.round > u) {
        ie();
        return;
      }
      let h = pe(),
        g = _[e.timed.round - 1];
      Te(h, g);
      let A = Math.max(1, Number(h.seconds) || vn),
        O = j[e.timed.round - 1] || r[Math.floor(Math.random() * r.length)];
      ((e.timed.currentLabel = O.label),
        typeof i.setTimedAugmentation == 'function' &&
          i.setTimedAugmentation(ge(Z, e.timed.round - 1, u)),
        typeof i.setTimedMotionProfile == 'function' && i.setTimedMotionProfile(_e(Z)),
        i.setDiscVisible(!0));
      let G = ++re;
      ((X = !1),
        x(!0),
        (T.textContent = 'Loading image\u2026'),
        (B.textContent = ''),
        i.setImageSource(O.src, {
          onError: () => {
            !e.timed.isActive ||
              G !== re ||
              (V(), (Y.textContent = 'Image unavailable. Set not scored; retry from Timed sets.'));
          },
          onReady: () => {
            if (!e.timed.isActive || G !== re) return;
            (typeof i.doGazeShift == 'function' && !e.viewer.shiftInProgress && i.doGazeShift(),
              (T.textContent = `Round ${e.timed.round}/${u}`),
              (B.textContent = String(A)),
              (le = !0),
              (X = !0),
              x(!1));
            let ee = A,
              Me = setInterval(() => {
                ((ee -= 1),
                  (B.textContent = String(ee)),
                  ee <= 0 &&
                    (c(),
                    i.setDiscVisible(!1),
                    (le = !1),
                    (T.textContent = 'Which disc was shown?'),
                    (B.textContent = '')));
              }, 1e3);
            t.setTimedCountdownTimer(Me);
          }
        }));
    }
    function Se() {
      if (!e.timed.isActive || !X) return;
      let u = L();
      if (!u) {
        ((T.textContent = 'Select an answer before submitting.'), W());
        return;
      }
      le && (c(), i.setDiscVisible(!1), (le = !1), (B.textContent = ''));
      let h = u.value === e.timed.currentLabel;
      if (((X = !1), h))
        ((e.timed.score += 1), u.parentElement.classList.add('correct-answer-label'));
      else {
        u.parentElement.classList.add('wrong-answer-label');
        let A = k.querySelector(`input[name="timedGuess"][value="${e.timed.currentLabel}"]`);
        A && A.parentElement.classList.add('correct-answer-label');
      }
      x(!0);
      let g = setTimeout(() => {
        (ae(), we());
      }, 1200);
      t.setTimedFeedbackTimer(g);
    }
    function ie() {
      (M(), ae(), x(!0), (k.hidden = !0), (le = !1));
      let u = Le(e.timed.score, oe(), Z);
      ((Y.innerHTML = u.html), t.endTimedSession() && fe({ clearResult: !1 }));
    }
    function V() {
      t.endTimedSession() && fe({ clearResult: !0 });
    }
    function fe({ clearResult: u }) {
      (i.setDiscVisible(!0),
        M(),
        ae(),
        x(!0),
        (k.hidden = !0),
        (R.hidden = !1),
        (T.textContent = ''),
        (B.textContent = ''),
        (le = !1),
        u && (Y.innerHTML = ''),
        Ie(),
        i.setViewerControlsDisabled(!1),
        i.setImageSource(i.getActiveConditionImagePath()));
    }
    function Ve(u) {
      let h = Math.min(F, se.length - 1),
        g = typeof u == 'number' ? u : h;
      return !Number.isInteger(g) || g < 0 || g >= se.length || g > F ? null : g;
    }
    function pe() {
      if (w.length === 0) return ct;
      let u = Math.min(Z, w.length - 1),
        h = w[u];
      if (!h || typeof h != 'object') return ct;
      let g = !!h.isDilated;
      return {
        seconds: Number(h.seconds) || ct.seconds,
        isDilated: g,
        fovDegrees: g ? He.dilated : He.undilated,
        cataractLevel: xn(h.cataractLevel)
      };
    }
    function oe() {
      return j.length > 0 ? j.length : S;
    }
    function ge(u) {
      let h = Math.max(0, Math.min(Number.isInteger(u) ? u : 0, yn.length - 1)),
        g = yn[h];
      return {
        rotateDegrees: ut(g.rotateMaxDegrees, g.rotateMinDegrees || 0),
        scale: Ji(g.scaleMin, g.scaleMax, g.minScaleDelta || 0),
        panXRatio: ut(g.panMaxRatio, g.panMinRatio || 0),
        panYRatio: ut(g.panMaxRatio, g.panMinRatio || 0),
        brightness: wt(g.brightnessJitter, g.brightnessMinJitter || 0),
        contrast: wt(g.contrastJitter, g.contrastMinJitter || 0),
        saturation: wt(g.saturationJitter, g.saturationMinJitter || 0),
        flipVertical: !1
      };
    }
    function _e(u) {
      let h = Math.max(0, Math.min(Number.isInteger(u) ? u : 0, Mn.length - 1)),
        g = Mn[h];
      return {
        jitterMultiplier: Je(g.jitterMultiplierMin, g.jitterMultiplierMax),
        shiftDistanceMultiplier: Je(g.shiftDistanceMin, g.shiftDistanceMax),
        shiftDurationMs: Math.round(Je(g.shiftDurationMinMs, g.shiftDurationMaxMs))
      };
    }
    function Fe(u, h, g) {
      if (!Array.isArray(u) || u.length === 0) return [];
      let A = Math.max(1, Number(g) || 4),
        O = u.map((te) => ({ image: te, remaining: Math.max(1, Number(h) || 1) })),
        G = [],
        ee = null,
        Me = [...O];
      for (; Me.length && G.length < A; ) {
        let te = Math.floor(Math.random() * Me.length),
          ce = Me.splice(te, 1)[0];
        (G.push(ce.image), (ce.remaining -= 1), (ee = ce.image.label));
      }
      for (; G.length < A; ) {
        let te = O.filter((ue) => ue.remaining > 0 && ue.image.label !== ee);
        (te.length === 0 && (te = O.filter((ue) => ue.remaining > 0)),
          te.length === 0 &&
            (O.forEach((ue) => {
              ue.remaining = Math.max(1, Number(h) || 1);
            }),
            (te = O.filter((ue) => ue.remaining > 0 && ue.image.label !== ee)),
            te.length === 0 && (te = O.filter((ue) => ue.remaining > 0))));
        let ce = te[Math.floor(Math.random() * te.length)];
        (G.push(ce.image), (ce.remaining -= 1), (ee = ce.image.label));
      }
      return G;
    }
    function $e(u) {
      let h = Math.max(1, Number(u) || 4),
        g = typeof i.getIsRightEye == 'function' ? !i.getIsRightEye() : Math.random() >= 0.5,
        A = [],
        O = g;
      for (let G = 0; G < h; G += 1) (A.push(O), (O = !O));
      return A;
    }
    function Te(u, h) {
      (D(u),
        typeof i.setCataractLevel == 'function' && i.setCataractLevel(xn(u.cataractLevel)),
        typeof h == 'boolean' && typeof i.setRightEye == 'function' && i.setRightEye(h));
    }
    function Ie() {
      (typeof i.clearTimedAugmentation == 'function' && i.clearTimedAugmentation(),
        typeof i.clearTimedMotionProfile == 'function' && i.clearTimedMotionProfile(),
        Q &&
          (D(Q),
          typeof i.setCataractLevel == 'function' && i.setCataractLevel(Q.cataractLevel),
          typeof i.setRightEye == 'function' && i.setRightEye(Q.isRightEye),
          (Q = null)));
    }
    function Le(u, h, g) {
      let A = h > 0 ? u / h : 0,
        O = Math.ceil(h * 0.75),
        G = u >= O,
        ee = 'Revise vessel obscuration and disc margin blur, then retry.';
      A === 1
        ? (ee = 'Excellent recognition. Keep this speed and consistency.')
        : A >= 0.75
          ? (ee = 'Strong result. One more round should lock this in.')
          : A >= 0.5 && (ee = 'Good start. Focus on swollen vs suspicious differences.');
      let Me = se[Math.min(g, se.length - 1)],
        te = '',
        ce = !1;
      if (G && g === F && F < se.length)
        ((K = Math.max(K, F)), (te = `Unlocked ${se[F].name} star.`), (F += 1), (ce = !0));
      else if (F >= se.length) ((K = se.length - 1), (te = 'All star tiers already unlocked.'));
      else {
        let Ae = se[Math.min(F, se.length - 1)];
        te = `Need ${O}/${h} to unlock ${Ae.name} star.`;
      }
      let ot = se
        .slice(0, K + 1)
        .map(
          (Ae) =>
            `<span class="${Ae.className}" aria-label="${Ae.name} star">&#9733; ${Ae.name}</span>`
        )
        .join(' ');
      return (
        ce && de(),
        {
          html: `Set ${Math.min(g + 1, se.length)}/${se.length} (${Me.name}): ${u}/${h}. ${ee}<br>${te}${ot ? ` ${ot}` : ''}`
        }
      );
    }
    function Ne() {
      return se.map((u, h) => ({
        index: h,
        name: u.name,
        unlocked: h <= F,
        completed: h <= K,
        active: h === Math.min(F, se.length - 1)
      }));
    }
    function Oe() {
      return { nextTierIndex: F, unlockedTierIndex: K };
    }
    function D(u) {
      let h = !!(u != null && u.isDilated),
        g = Number(u == null ? void 0 : u.fovDegrees);
      if (typeof i.setFovDegrees == 'function') {
        let A = h ? He.dilated : He.undilated;
        i.setFovDegrees(Number.isFinite(g) ? g : A);
        return;
      }
      if (typeof i.setDilated == 'function') {
        i.setDilated(h);
        return;
      }
      !h && typeof i.ensureUndilated == 'function' && i.ensureUndilated();
    }
    function c() {
      e.timed.countdownTimer &&
        (clearInterval(e.timed.countdownTimer), t.setTimedCountdownTimer(null));
    }
    function M() {
      ((re += 1),
        (X = !1),
        c(),
        e.timed.feedbackTimer &&
          (clearTimeout(e.timed.feedbackTimer), t.setTimedFeedbackTimer(null)));
    }
    function x(u) {
      if (
        (k.querySelectorAll(C).forEach((h) => {
          h.disabled = u;
        }),
        u)
      ) {
        q.disabled = !0;
        return;
      }
      W();
    }
    function L() {
      return k.querySelector(`${C}:checked`);
    }
    function W() {
      let u = k.querySelectorAll(C);
      if (!Array.from(u).some((g) => !g.disabled)) {
        q.disabled = !0;
        return;
      }
      q.disabled = L() === null;
    }
    k.querySelectorAll(C).forEach((u) => {
      typeof u.addEventListener == 'function' &&
        (u.addEventListener('change', W),
        ye.push(() => {
          typeof u.removeEventListener == 'function' && u.removeEventListener('change', W);
        }));
    });
    function ae() {
      (k.querySelectorAll(C).forEach((u) => {
        ((u.checked = !1),
          u.parentElement.classList.remove('correct-answer-label', 'wrong-answer-label'));
      }),
        W());
    }
    return {
      startTimedTest: z,
      submitTimedGuess: Se,
      exitTimedMode: V,
      getLevelProgress: Ne,
      getProgressState: Oe,
      destroy: () => {
        (ye.splice(0).forEach((u) => {
          u();
        }),
          t.endTimedSession(),
          fe({ clearResult: !0 }),
          (j = []),
          (_ = []),
          (K = -1),
          (F = 0),
          (Z = 0),
          (le = !1),
          (e.timed.round = 0),
          (e.timed.score = 0),
          (e.timed.currentLabel = ''),
          de());
      }
    };
  }
  var Ki = document.getElementById('fundusCanvas'),
    Zi = document.getElementById('fovToggle'),
    eo = document.getElementById('fovLabelSmall'),
    to = document.getElementById('fovLabelLeft'),
    no = document.getElementById('fovLabelRight'),
    io = document.getElementById('eyeToggle'),
    oo = document.getElementById('eyeLabelRight'),
    ro = document.getElementById('eyeLabelLeft'),
    ao = document.getElementById('cataractSlider'),
    so = document.querySelectorAll('.cataract-stop'),
    lo = document.getElementById('viewSummary'),
    In = document.getElementById('phonePreviewControl'),
    Ue = document.getElementById('phoneViewToggle'),
    co = document.querySelector('.explanation'),
    Cn = document.querySelectorAll('.condition-button'),
    At = document.getElementById('burger-icon'),
    ft = document.getElementById('sideMenu'),
    uo = ft.querySelectorAll('button'),
    et = document.getElementById('info-icon'),
    tt = document.getElementById('infoModal'),
    mo = document.getElementById('closeInfoModal'),
    Ln = document.getElementById('testModal'),
    ho = document.getElementById('testModalTitle'),
    fo = document.getElementById('mcqTimer'),
    po = document.getElementById('closeTestModal'),
    go = document.getElementById('testContainer'),
    Rn = document.getElementById('submitTestButton'),
    qn = document.getElementById('retryTestButton'),
    Dn = document.getElementById('saveResultButton'),
    bo = document.getElementById('testResult'),
    yo = document.querySelector('.explanation'),
    Pn = ft.querySelectorAll('.mcq-level-button'),
    kn = ft.querySelectorAll('.timed-level-button'),
    Qe = document.getElementById('cupAchievement'),
    wn = document.getElementById('cupAchievementLabel'),
    Ke = document.getElementById('cupAchievementCode'),
    Ze = document.getElementById('downloadCupCertificateButton'),
    Mo = document.getElementById('timedGuessBox'),
    xo = document.getElementById('timedMessage'),
    vo = document.getElementById('timedCountdown'),
    Nn = document.getElementById('submitTimedGuessButton'),
    To = document.getElementById('timedTestResult'),
    On = 'swollen_discs_cup_achievement_v1',
    _n = 'swollen_discs_mcq_progress_v1',
    Fn = 'swollen_discs_timed_progress_v1',
    Io = 'Cup Locked: Complete Advanced in MCQ and Timed Sets',
    wo = 'Cup Unlocked: Advanced in MCQ and Timed Sets',
    $n = 'swollen_discs_phone_view_v1',
    So = Object.freeze({ unlocked: !1, code: '', unlockedAt: '' }),
    Ao = Object.freeze({ nextTierIndex: 0, unlockedTierIndex: -1 }),
    En,
    Eo =
      (En = new window.URLSearchParams(window.location.search).get(en)) == null
        ? void 0
        : En.toLowerCase(),
    Co = typeof window.matchMedia == 'function' && window.matchMedia('(pointer: coarse)').matches,
    Lo = Math.max(window.innerWidth || 0, window.innerHeight || 0),
    ke = tn({ imageAssetSets: Ge, queryValue: Eo, hasCoarsePointer: Co, viewportEdge: Lo });
  on(ke, Cn);
  var Bn = typeof ke.normal == 'string' && ke.normal.length > 0 ? ke.normal : Ut,
    jn = nn(ke, Vt);
  Do(
    [ke.normal, ke.suspicious, ke.swollen, ...jn.map((e) => (e == null ? void 0 : e.src))].filter(
      (e) => typeof e == 'string' && e.length > 0
    )
  );
  var Re = rn({ defaultImageSrc: Bn }),
    Et = an(Re),
    Ct = [],
    dt = null,
    Sn = !1,
    mt = [],
    ht = [],
    ne = Oo(),
    Ro = Hn(_n),
    qo = Hn(Fn),
    nt = fn({
      state: Re,
      canvas: Ki,
      fovToggleCheckbox: Zi,
      fovLabelSmall: eo,
      fovLabelLeft: to,
      fovLabelRight: no,
      eyeToggleCheckbox: io,
      eyeLabelRight: oo,
      eyeLabelLeft: ro,
      cataractSlider: ao,
      cataractStops: so,
      viewSummary: lo,
      explanation: co,
      conditionButtons: Cn,
      defaultImageSrc: Bn,
      explanationTemplates: Zt,
      cataractPresets: Qt,
      cataractOcclusionSpots: Kt
    }),
    ve = pn({
      state: Re,
      stateMachine: Et,
      sideMenu: ft,
      sideMenuButtons: uo,
      burgerIcon: At,
      infoIcon: et,
      infoModal: tt,
      testModal: Ln
    }),
    Ce = bn({
      state: Re,
      stateMachine: Et,
      questionBank: Bt,
      buildMcqTest: jt,
      evaluateMcqSubmission: Gt,
      generatePassCode: It,
      formatMcqResultText: Wt,
      setModalState: ve.setModalState,
      testModal: Ln,
      triggerButton: At,
      testContainer: go,
      submitTestButton: Rn,
      retryTestButton: qn,
      saveResultButton: Dn,
      testResultDiv: bo,
      testModalTitle: ho,
      mcqTimer: fo,
      mcqTierConfigs: zt,
      initialProgressState: Ro,
      onProgressChange: Vn
    }),
    it = Tn({
      state: Re,
      stateMachine: Et,
      timedImages: jn,
      timedRoundsPerCategory: Yt,
      timedTotalRounds: Xt,
      timedRoundProfiles: Ht,
      initialProgressState: qo,
      onProgressChange: Un,
      closeTestModal: Ce.closeTestModal,
      setModalState: ve.setModalState,
      infoModal: tt,
      infoIcon: et,
      explanationDiv: yo,
      timedGuessBox: Mo,
      timedMessage: xo,
      timedCountdown: vo,
      submitTimedGuessButton: Nn,
      timedTestResult: To,
      viewer: nt
    });
  function Do(e) {
    if (typeof window == 'undefined' || typeof Image == 'undefined') return;
    let t = [...new Set(e)],
      r = () => {
        t.forEach((a) => {
          let l = new Image();
          ((l.decoding = 'async'), (l.src = a));
        });
      };
    typeof window.requestIdleCallback == 'function'
      ? window.requestIdleCallback(r, { timeout: 1200 })
      : window.setTimeout(r, 220);
  }
  function Gn(e) {
    return Array.isArray(e) ? e : [];
  }
  function Wn(e, t) {
    e.forEach((r) => {
      let a = Number(r.dataset.levelIndex),
        l = t[a];
      l &&
        ((r.dataset.locked = l.unlocked ? 'false' : 'true'),
        r.classList.toggle('is-locked', !l.unlocked),
        r.classList.toggle('is-complete', l.completed),
        (r.textContent = l.name),
        r.setAttribute('aria-disabled', l.unlocked ? 'false' : 'true'));
    });
  }
  function Un(e = it.getLevelProgress()) {
    ((ht = Gn(e)), Wn(kn, ht), Jn(Fn, Qn(ht)), Yn());
  }
  function Vn(e = Ce.getLevelProgress()) {
    ((mt = Gn(e)), Wn(Pn, mt), Jn(_n, Qn(mt)), Yn());
  }
  function An(e) {
    var t;
    return !Array.isArray(e) || e.length === 0
      ? !1
      : !!((t = e[e.length - 1]) != null && t.completed);
  }
  function Yn() {
    if (!Qe) return;
    let e = An(mt),
      t = An(ht),
      r = e && t;
    if (
      (!r && ne.unlocked ? ((ne = { unlocked: !1, code: '', unlockedAt: '' }), Kn(ne)) : Po(r),
      (Qe.hidden = !1),
      Qe.setAttribute('aria-hidden', 'false'),
      Qe.classList.toggle('is-unlocked', ne.unlocked),
      Qe.classList.toggle('is-locked', !ne.unlocked),
      wn && (wn.textContent = ne.unlocked ? wo : Io),
      Ke &&
        (ne.unlocked && ne.code
          ? ((Ke.hidden = !1), (Ke.textContent = `Code: ${ne.code}`))
          : ((Ke.hidden = !0), (Ke.textContent = ''))),
      Ze)
    ) {
      let a = !ne.unlocked;
      ((Ze.disabled = a),
        (Ze.dataset.locked = a ? 'true' : 'false'),
        Ze.setAttribute('aria-disabled', a ? 'true' : 'false'));
    }
  }
  function Po(e) {
    !e ||
      ne.unlocked ||
      ((ne = { unlocked: !0, code: Bo(), unlockedAt: new Date().toISOString() }), Kn(ne));
  }
  function pt() {
    try {
      return typeof window != 'undefined' && !!window.localStorage;
    } catch (e) {
      return !1;
    }
  }
  function Xn(e) {
    if (!pt()) return null;
    try {
      let t = window.localStorage.getItem(e);
      return t ? JSON.parse(t) : null;
    } catch (t) {
      return null;
    }
  }
  function zn(e, t) {
    if (pt())
      try {
        window.localStorage.setItem(e, JSON.stringify(t));
      } catch (r) {}
  }
  function ko(e) {
    if (!pt()) return null;
    try {
      return window.localStorage.getItem(e);
    } catch (t) {
      return null;
    }
  }
  function No(e, t) {
    if (pt())
      try {
        window.localStorage.setItem(e, t);
      } catch (r) {}
  }
  function Oo() {
    let e = Xn(On);
    return !e || typeof e != 'object'
      ? { ...So }
      : {
          unlocked: !!e.unlocked,
          code: typeof e.code == 'string' ? e.code : '',
          unlockedAt: typeof e.unlockedAt == 'string' ? e.unlockedAt : ''
        };
  }
  function Hn(e) {
    let t = Xn(e);
    if (!t || typeof t != 'object') return { ...Ao };
    let r = Number.isFinite(Number(t.nextTierIndex))
        ? Math.max(0, Math.floor(Number(t.nextTierIndex)))
        : 0,
      a = Number.isFinite(Number(t.unlockedTierIndex))
        ? Math.max(-1, Math.floor(Number(t.unlockedTierIndex)))
        : -1;
    return { nextTierIndex: r, unlockedTierIndex: a };
  }
  function _o() {
    if (typeof window == 'undefined') return !1;
    let e =
        typeof window.matchMedia == 'function' && window.matchMedia('(pointer: coarse)').matches,
      t = window.innerWidth || 0;
    return !e && t > 900;
  }
  function Fo() {
    return ko($n) === 'true';
  }
  function $o(e) {
    No($n, e ? 'true' : 'false');
  }
  function St(e) {
    (document.body.classList.toggle('simulate-phone-frame', !!e), Ue && (Ue.checked = !!e));
  }
  function Jn(e, t) {
    zn(e, t);
  }
  function Qn(e) {
    if (!Array.isArray(e) || e.length === 0) return { nextTierIndex: 0, unlockedTierIndex: -1 };
    let t = e
        .filter((p) => p && p.completed)
        .map((p) => Number(p.index))
        .filter((p) => Number.isFinite(p)),
      r = e
        .filter((p) => p && p.unlocked)
        .map((p) => Number(p.index))
        .filter((p) => Number.isFinite(p)),
      a = e.find((p) => p && p.active),
      l = t.length > 0 ? Math.max(...t) : -1,
      m = r.length > 0 ? Math.max(...r) : -1,
      f = e.every((p) => !!(p != null && p.completed)),
      b = 0;
    return (
      f
        ? (b = e.length)
        : a && Number.isFinite(Number(a.index))
          ? (b = Math.max(0, Math.floor(Number(a.index))))
          : m >= 0 && (b = Math.max(0, Math.min(e.length - 1, m))),
      { nextTierIndex: b, unlockedTierIndex: l }
    );
  }
  function Kn(e) {
    zn(On, e);
  }
  function Bo() {
    return `SDCUP-${new Date()
      .toISOString()
      .replace(/[-:.TZ]/g, '')
      .slice(0, 14)}-${It(6)}`;
  }
  function jo() {
    if (!ne.unlocked || !ne.code) return;
    let e = ne.unlockedAt ? new Date(ne.unlockedAt) : null,
      t = e && !Number.isNaN(e.valueOf()) ? e.toLocaleString() : new Date().toLocaleString(),
      r = [
        'Swollen Discs',
        'Practice Certificate of Achievement',
        '(Local Certificate - Not Externally Verified)',
        '',
        'Awarded for completing:',
        '- MCQ Advanced Level',
        '- Timed Set Advanced Level',
        '',
        `Achievement Code: ${ne.code}`,
        `Issued: ${t}`,
        '',
        'Keep this code for your records.'
      ].join(`
`),
      a = new Blob([r], { type: 'text/plain' }),
      l = URL.createObjectURL(a),
      m = document.createElement('a'),
      f = ne.code.toLowerCase().replace(/[^a-z0-9-]/g, '');
    ((m.href = l),
      (m.download = `swollen_discs_certificate_${f}.txt`),
      document.body.appendChild(m),
      m.click(),
      document.body.removeChild(m),
      URL.revokeObjectURL(l));
  }
  Go();
  function Go() {
    (typeof window != 'undefined' &&
      typeof window.__swollenDiscsDestroy == 'function' &&
      window.__swollenDiscsDestroy(),
      nt.initialize(),
      Vn(),
      Un(),
      ve.setSideMenuOpen(!1));
    let e = _o();
    if ((In && (In.hidden = !e), Ue)) {
      let f = e && Fo();
      (St(f),
        (Ue.disabled = !e),
        he(Ue, 'change', () => {
          let p = e && Ue.checked;
          (St(p), $o(p), nt.setDiscVisible(Re.viewer.isDiscVisible));
        }));
    } else St(!1);
    (he(At, 'click', () => {
      ve.toggleSideMenu();
    }),
      he(et, 'click', () => {
        ve.setModalState(tt, !ve.isModalOpen(tt), et);
      }),
      he(mo, 'click', () => {
        ve.setModalState(tt, !1, et);
      }),
      he(po, 'click', Ce.closeTestModal),
      he(Rn, 'click', Ce.handleSubmitTest),
      he(qn, 'click', Ce.handleRetryTest),
      he(Dn, 'click', Ce.handleSaveResult),
      he(Ze, 'click', jo),
      Pn.forEach((f) => {
        he(f, 'click', () => {
          let p = Number(f.dataset.levelIndex);
          Ce.openTestModal({
            tierIndex: p,
            beforeOpen: () => {
              Re.timed.isActive && it.exitTimedMode();
            }
          }) && ve.setSideMenuOpen(!1);
        });
      }),
      kn.forEach((f) => {
        he(f, 'click', () => {
          let p = Number(f.dataset.levelIndex);
          it.startTimedTest({ tierIndex: p }) && ve.setSideMenuOpen(!1);
        });
      }),
      he(Nn, 'click', it.submitTimedGuess),
      he(document, 'click', (f) => {
        ve.handleDocumentClick(f, { closeTestModal: Ce.closeTestModal });
      }),
      he(document, 'keydown', (f) => {
        ve.handleDocumentKeyDown(f, { closeTestModal: Ce.closeTestModal });
      }),
      (dt = setInterval(() => {
        !Re.viewer.shiftInProgress && !Re.timed.isActive && nt.doGazeShift();
      }, Jt)),
      Ct.push(() => {
        dt !== null && (clearInterval(dt), (dt = null));
      }),
      typeof window != 'undefined' && (window.__swollenDiscsDestroy = Zn));
  }
  function he(e, t, r, a) {
    (e.addEventListener(t, r, a),
      Ct.push(() => {
        e.removeEventListener(t, r, a);
      }));
  }
  function Zn() {
    Sn ||
      ((Sn = !0),
      Ct.splice(0).forEach((e) => {
        e();
      }),
      it.destroy(),
      Ce.destroy(),
      ve.destroy(),
      nt.destroy(),
      typeof window != 'undefined' &&
        window.__swollenDiscsDestroy === Zn &&
        (window.__swollenDiscsDestroy = null));
  }
})();
