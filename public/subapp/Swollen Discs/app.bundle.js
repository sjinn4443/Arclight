'use strict';
(() => {
  // questions.js
  var questionBank = [
    {
      id: 'q01',
      question: 'Which sign is commonly observed in a completely normal disc?',
      options: {
        a: 'Mild peripapillary halo that slightly obscures vessels',
        b: 'Blurred nasal edge with mild haemorrhages in the nerve fibre layer',
        c: 'Clearly visible physiological cup with sharp margins',
        d: 'High disc elevation suggestive of optic disc drusen',
        e: 'Prominent cotton wool spots near the disc margin'
      },
      correct: 'c'
    },
    {
      id: 'q02',
      question: 'A suspicious disc often shows:',
      options: {
        a: 'Completely clear margins and spontaneous venous pulsations',
        b: 'Mild nasal blurring without major vessel obscuration',
        c: 'Absolutely no rim blur or any signs of oedema',
        d: 'Deep, well-demarcated physiological cup with no swelling',
        e: 'Severe haemorrhages with total vessel obscuration'
      },
      correct: 'b'
    },
    {
      id: 'q03',
      question: 'Which feature typically indicates definite swelling (Fris\xE9n Grade 3 or more)?',
      options: {
        a: 'Slight blur confined to one segment of the nasal rim only',
        b: 'Totally sharp disc margins with normal colour and vessels',
        c: 'At least partial obscuration of the major vessels crossing the margin',
        d: 'A vertically tilted disc with normal neuroretinal rim',
        e: 'A shallow but still visible physiological cup in all quadrants'
      },
      correct: 'c'
    },
    {
      id: 'q04',
      question: 'What might you see in advanced papilloedema (Grade 4-5)?',
      options: {
        a: 'Edges largely crisp with subtle nasal elevation only',
        b: "Severe disc elevation, possible Paton's lines and scattered haemorrhages",
        c: 'A well-defined rim and normal colour despite slight tilt',
        d: 'Minimal nerve fibre elevation but clear vessel pathways',
        e: 'A shallow cup and normal ocular pressure readings'
      },
      correct: 'b'
    },
    {
      id: 'q05',
      question: "Which disc appearance is most consistent with a 'normal' Fris\xE9n Grade 0?",
      options: {
        a: 'Diffuse blurred margins across all quadrants with a full halo',
        b: 'Swelling of at least 1 dioptre nasally plus haemorrhages temporally',
        c: 'Total obscuration of the lamina cribrosa with fluid exudates',
        d: 'Sharp, well-defined boundary and a clearly visible physiological cup',
        e: 'Extensive peripapillary haemorrhages around the disc'
      },
      correct: 'd'
    },
    {
      id: 'q06',
      question: 'What is an early indicator that a disc is suspicious (not fully swollen)?',
      options: {
        a: 'Large haemorrhages bridging the macula and disc margins',
        b: 'Partial rim blur with no major obscuration of vessels',
        c: 'Completely crisp disc margin with robust venous pulsations',
        d: 'Marked circumferential swelling in all quadrants',
        e: 'Full disc elevation with exudates in the peripapillary region'
      },
      correct: 'b'
    },
    {
      id: 'q07',
      question: 'Which finding strongly suggests definite disc swelling?',
      options: {
        a: 'Slight blurring only at the nasal pole but vessels remain distinct',
        b: 'Fully obscured vessels as they cross the disc margin',
        c: 'A large but normal physiological cup with sharp edges',
        d: 'Disc pallor with no obvious oedema or haemorrhages',
        e: 'No haemorrhages or exudates near the disc margin'
      },
      correct: 'b'
    },
    {
      id: 'q08',
      question: 'In normal discs, which vessels should remain clearly visible?',
      options: {
        a: 'All veins are hidden by mild halo, but arteries remain visible',
        b: 'Only the nasal vessels can be identified \u2013 temporal side is generally obscured',
        c: 'Major vessels crossing the disc margin without significant blurring',
        d: 'No vessels cross the disc margin in normal eyes',
        e: 'All vessels except the superior vein become indistinct'
      },
      correct: 'c'
    },
    {
      id: 'q09',
      question:
        'Which Fris\xE9n grade usually indicates moderate papilloedema with some haemorrhages?',
      options: {
        a: 'Grade 0 (completely normal)',
        b: 'Grade 1 (minimal nasal blur only)',
        c: 'Grade 2 (partial halo or mild swelling)',
        d: 'Grade 3 or higher',
        e: 'Grade 5 only (most severe form)'
      },
      correct: 'd'
    },
    {
      id: 'q10',
      question: 'A suspicious disc might be described if:',
      options: {
        a: 'All vessels and disc margins are fully distinct with no haze',
        b: 'Severe swelling in all quadrants plus large haemorrhages',
        c: 'Minimal oedema, usually nasal, without major haemorrhages',
        d: 'A near-complete halo with exudates partially obscuring vessels',
        e: 'Disc drusen creating a pseudo-oedema that looks elevated'
      },
      correct: 'c'
    },
    {
      id: 'q11',
      question: 'One hallmark of a definitely swollen disc is:',
      options: {
        a: 'Sharp cup and healthy pinkish colour without any blur',
        b: 'Full halo or definite rim swelling around most of the disc',
        c: 'A tilt that gives the appearance of mild nasal elevation',
        d: 'Zero dioptre difference between disc and retina on direct measurement',
        e: 'Multiple spontaneous arterial pulsations near the rim'
      },
      correct: 'b'
    },
    {
      id: 'q12',
      question: 'Which is least likely in a normal optic disc examination?',
      options: {
        a: 'Clear boundary between disc and retina when viewed directly',
        b: 'Visible spontaneous venous pulsations in some eyes',
        c: 'A crisp physiological cup with a healthy neuroretinal rim',
        d: 'Significant obscuration of the nerve fibre layer by fluid',
        e: 'Absence of haemorrhages in or around the disc'
      },
      correct: 'd'
    },
    {
      id: 'q13',
      question: 'An elevated disc with haemorrhages but no visible cup might indicate:',
      options: {
        a: 'A normal Grade 0 disc or physiological variant',
        b: 'A suspicious disc with borderline swelling only',
        c: 'Advanced papilloedema or a very swollen disc',
        d: 'A hyperopic disc tilt without true swelling',
        e: 'A normal variation found in many healthy individuals'
      },
      correct: 'c'
    },
    {
      id: 'q14',
      question: 'Which description fits a suspicious disc rather than definitely swollen?',
      options: {
        a: 'Complete obscuration of vessels in all quadrants with haemorrhages',
        b: 'Full disc halo and exudates around the margin',
        c: 'Mild blur, often nasally, without extensive haemorrhages',
        d: 'Diffuse swelling so severe that no margin is visible',
        e: 'Deep physiological cup with absolutely no rim blur'
      },
      correct: 'c'
    },
    {
      id: 'q15',
      question: 'Fris\xE9n Grade 2 is often associated with:',
      options: {
        a: 'Zero disc swelling with totally crisp edges and normal vasculature',
        b: 'Massive haemorrhages overshadowing the entire optic nerve',
        c: 'Minimal nasal blur or an incomplete halo around the disc margin',
        d: 'Extensive swelling and obscured vessels across all quadrants',
        e: 'Significantly deeper physiological cup than in Grade 0'
      },
      correct: 'c'
    },
    {
      id: 'q16',
      question: "When do we classify a disc as 'normal'?",
      options: {
        a: 'Edges are crisp, vessels remain clearly visible at the margin, and there is no oedema',
        b: 'Minor blur only in one quadrant with scattered haemorrhages',
        c: 'Partial halo around the entire disc boundary with fluid exudates',
        d: 'Elevated disc by 2 dioptres nasally but no haemorrhages present',
        e: 'Obscuration of vessels crossing the superior and inferior rims'
      },
      correct: 'a'
    },
    {
      id: 'q17',
      question: 'A definitely swollen disc (Grade 3\u20135) often includes:',
      options: {
        a: 'Only very slight nasal elevation, with no haemorrhages or exudates',
        b: 'A full or nearly full halo and partially obscured vessels crossing the rim',
        c: 'A large, distinct cup with absolutely no margin blur',
        d: 'Complete absence of any disc swelling or vessel changes',
        e: 'Minimal tilt or drusen giving a pseudo-swelling appearance'
      },
      correct: 'b'
    },
    {
      id: 'q18',
      question: 'Which sign is NOT a common feature of a suspicious disc?',
      options: {
        a: 'Minor nasal blurring that does not extend temporally',
        b: 'Mild or questionable swelling raising clinical concern',
        c: 'Completely sharp margin with normal vessels throughout',
        d: 'Lack of any large haemorrhages at this stage',
        e: 'Partial halo suggesting borderline papilloedema'
      },
      correct: 'c'
    },
    {
      id: 'q19',
      question: 'Grade 4 papilloedema typically shows:',
      options: {
        a: 'Marked disc elevation with a near-complete halo and possible haemorrhages',
        b: 'Crisp edges and a deep physiological cup in the centre',
        c: 'No haemorrhages or exudates anywhere on the disc',
        d: 'Mild tilt creating slight nasal blur only',
        e: 'Barely elevated rim but normal overall disc colour'
      },
      correct: 'a'
    },
    {
      id: 'q20',
      question: 'If a disc appears normal but has no spontaneous venous pulsations, it could be:',
      options: {
        a: 'Mild papilloedema that is always present in normal eyes',
        b: 'Still a normal variant \u2013 some healthy eyes lack venous pulsations',
        c: 'Definite papilloedema if the disc colour is also pale',
        d: 'High-grade swelling completely blocking venous outflow',
        e: 'An artefact from improper ophthalmoscopic technique'
      },
      correct: 'b'
    },
    {
      id: 'q21',
      question: 'A normal disc rarely shows:',
      options: {
        a: 'A distinct edge around the physiological cup',
        b: 'A clearly visible central cup with a pinkish neuroretinal rim',
        c: 'No significant haemorrhages anywhere near the disc',
        d: 'Major vessel obscuration at the rim, indicating fluid',
        e: 'Minimal pallor that remains within normal limits'
      },
      correct: 'd'
    },
    {
      id: 'q22',
      question: 'Which sign suggests borderline suspicious rather than fully swollen?',
      options: {
        a: 'A large haemorrhage bridging the temporal disc margin',
        b: 'Obscured vessels in nearly all quadrants with massive exudates',
        c: 'Faint or partial blur at the nasal boundary only, with normal macula',
        d: 'A ring of exudates concealing the rim entirely',
        e: 'Severe disc elevation so no clear cup is visible'
      },
      correct: 'c'
    },
    {
      id: 'q23',
      question: 'Definite papilloedema with Fris\xE9n Grade 3 or more may exhibit:',
      options: {
        a: 'No difference from a normal disc, except mild tilt',
        b: 'A fully visible lamina cribrosa and normal disc margins',
        c: 'Multiple haemorrhages, exudates, or clearly obscured vessels',
        d: 'A crisp boundary with a healthy, deep cup centrally',
        e: 'A subtle halo only nasally, with no vascular changes'
      },
      correct: 'c'
    },
    {
      id: 'q24',
      question: 'Suspicious discs are sometimes confused with normal variants if:',
      options: {
        a: 'All edges are heavily blurred with large peripapillary haemorrhages',
        b: 'Minimal nasal blur is subtle, and no haemorrhages are present',
        c: 'Vessels appear almost completely obscured by dense exudates',
        d: 'There is a staphyloma or high myopia giving the illusion of swelling',
        e: 'Fris\xE9n scale findings exceed Grade 4 in some quadrants'
      },
      correct: 'b'
    },
    {
      id: 'q25',
      question: 'A definitely swollen disc often leads to:',
      options: {
        a: 'Improved visual acuity due to better vascular perfusion',
        b: 'Partial or complete loss of the physiological cup contour',
        c: 'A reduction in intracranial pressure for each eye individually',
        d: 'Absolutely no change in the retina surrounding the disc',
        e: 'Spontaneous venous pulsations becoming more prominent'
      },
      correct: 'b'
    },
    {
      id: 'q26',
      question: 'Which change is characteristic of Grade 1 papilloedema?',
      options: {
        a: 'Slight nasal blur without total vessel obscuration',
        b: 'Extensive swelling in all quadrants plus haemorrhages',
        c: 'Multiple exudates near the disc margin in every quadrant',
        d: 'Very sharp margins with a deep and obvious cup',
        e: 'Marked pallor of the disc overshadowing any swelling'
      },
      correct: 'a'
    },
    {
      id: 'q27',
      question: 'When describing normal discs, one should expect:',
      options: {
        a: 'Thick exudates on the rim blocking major vessels',
        b: 'Moderate blurring of boundaries in at least one quadrant',
        c: 'Clearly visible vessels crossing an undistorted margin',
        d: 'Peripapillary flame haemorrhages overshadowing the cup',
        e: 'A Fris\xE9n Grade 2 halo without haemorrhages'
      },
      correct: 'c'
    },
    {
      id: 'q28',
      question: 'Suspicious disc changes can progress if:',
      options: {
        a: 'Intracranial pressure remains elevated and untreated',
        b: 'They were entirely normal variants in the first place',
        c: 'The disc is already fully swollen and cannot progress further',
        d: 'Fris\xE9n scale spontaneously reverts to Grade 0',
        e: 'Mild venous pulsations become more pronounced'
      },
      correct: 'a'
    },
    {
      id: 'q29',
      question: 'Which statement accurately describes definite papilloedema?',
      options: {
        a: 'No overshadowing of any part of the disc or vessels at all',
        b: 'Minimal or questionable rim blur exclusively in the nasal quadrant',
        c: 'Significant oedema with or without haemorrhages, typically Grade \u22653',
        d: 'A normal ocular pressure with crisp, unwavering disc margins',
        e: 'A faint halo that spares the vessels crossing the temporal side'
      },
      correct: 'c'
    },
    {
      id: 'q30',
      question: 'A normal disc always shows:',
      options: {
        a: 'Severe disc elevation if the cup is shallow',
        b: 'Multiple haemorrhages near the macula or rim',
        c: 'Cotton wool spots in at least one quadrant',
        d: 'A dense peripapillary halo completely hiding vessels',
        e: 'A crisp boundary with no fluid obscuration'
      },
      correct: 'e'
    }
  ];
  var questions_default = questionBank;

  // mcq-engine.mjs
  var DEFAULT_PASS_RATIO = 0.7;
  function shuffleArray(items, randomFn = Math.random) {
    const shuffled = [...items];
    for (let i = shuffled.length - 1; i > 0; i -= 1) {
      const j = Math.floor(randomFn() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
  }
  function pickTierOptions(optionEntries, correctKey, optionCount, randomFn) {
    if (!Number.isInteger(optionCount) || optionCount <= 0 || optionCount >= optionEntries.length) {
      return shuffleArray(optionEntries, randomFn);
    }
    const correctEntry = optionEntries.find(([optionKey]) => optionKey === correctKey);
    if (!correctEntry) {
      return shuffleArray(optionEntries, randomFn).slice(0, optionCount);
    }
    const distractors = optionEntries.filter(([optionKey]) => optionKey !== correctKey);
    const selectedDistractors = shuffleArray(distractors, randomFn).slice(
      0,
      Math.max(0, optionCount - 1)
    );
    return shuffleArray([correctEntry, ...selectedDistractors], randomFn);
  }
  function buildMcqTest(
    questionBank2,
    questionCount = 7,
    randomFn = Math.random,
    optionCount = null
  ) {
    if (!Array.isArray(questionBank2) || questionBank2.length === 0) {
      return [];
    }
    const remainingQuestions = [...questionBank2];
    const totalQuestions = Math.max(0, Math.min(questionCount, remainingQuestions.length));
    const hasOptionCount = optionCount !== null && optionCount !== void 0;
    const normalizedOptionCount = hasOptionCount
      ? Number.isInteger(optionCount)
        ? Math.max(2, optionCount)
        : Number.isFinite(Number(optionCount))
          ? Math.max(2, Math.floor(Number(optionCount)))
          : null
      : null;
    const pickedQuestions = [];
    for (let i = 0; i < totalQuestions; i += 1) {
      const randomIndex = Math.floor(randomFn() * remainingQuestions.length);
      pickedQuestions.push(remainingQuestions.splice(randomIndex, 1)[0]);
    }
    return pickedQuestions.map((sourceQuestion, questionIndex) => {
      const optionEntries = Object.entries(sourceQuestion.options || {});
      const shuffledOptionEntries = pickTierOptions(
        optionEntries,
        sourceQuestion.correct,
        normalizedOptionCount,
        randomFn
      );
      const choices = shuffledOptionEntries.map(([sourceKey, text], optionIndex) => {
        return {
          id: `q${questionIndex}o${optionIndex}${sourceKey}`,
          text
        };
      });
      const correctChoice = shuffledOptionEntries.find(([sourceKey]) => {
        return sourceKey === sourceQuestion.correct;
      });
      const correctChoiceIndex = correctChoice
        ? shuffledOptionEntries.findIndex(([sourceKey]) => sourceKey === sourceQuestion.correct)
        : -1;
      return {
        id: `q${questionIndex}`,
        prompt: sourceQuestion.question,
        choices,
        correctChoiceId:
          correctChoice && correctChoiceIndex >= 0 ? choices[correctChoiceIndex].id : null
      };
    });
  }
  function evaluateMcqSubmission(testQuestions, selectedChoiceIds, passRatio = DEFAULT_PASS_RATIO) {
    const questions = Array.isArray(testQuestions) ? testQuestions : [];
    const selected = Array.isArray(selectedChoiceIds) ? selectedChoiceIds : [];
    let score = 0;
    const details = questions.map((question, index) => {
      const selectedChoiceId = selected[index] || null;
      const selectedChoice =
        question.choices.find((choice) => choice.id === selectedChoiceId) || null;
      const correctChoice =
        question.choices.find((choice) => choice.id === question.correctChoiceId) || null;
      const isCorrect = selectedChoiceId !== null && selectedChoiceId === question.correctChoiceId;
      if (isCorrect) {
        score += 1;
      }
      return {
        index,
        prompt: question.prompt,
        selectedChoiceId,
        selectedChoiceText: selectedChoice ? selectedChoice.text : null,
        correctChoiceId: question.correctChoiceId,
        correctChoiceText: correctChoice ? correctChoice.text : null,
        isCorrect
      };
    });
    const maxScore = questions.length;
    const passThreshold = maxScore === 0 ? 0 : Math.max(1, Math.ceil(maxScore * passRatio));
    const passed = maxScore > 0 && score >= passThreshold;
    return {
      score,
      maxScore,
      passThreshold,
      passed,
      details
    };
  }
  function generatePassCode(length = 8, randomFn = Math.random) {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let result = '';
    for (let i = 0; i < length; i += 1) {
      const randomIndex = Math.floor(randomFn() * chars.length);
      result += chars.charAt(randomIndex);
    }
    return result;
  }
  function formatMcqResultText(result) {
    if (!result) {
      return '';
    }
    const lines = [];
    const completedAt = result.completedAt || /* @__PURE__ */ new Date().toISOString();
    const takenAtLocal = new Date(completedAt);
    const takenAtLine = Number.isNaN(takenAtLocal.valueOf())
      ? completedAt
      : takenAtLocal.toLocaleString();
    lines.push('Swollen Discs - MCQ Test Result');
    lines.push(`Taken: ${takenAtLine}`);
    lines.push(`Score: ${result.score}/${result.maxScore}`);
    lines.push(`Result: ${result.passed ? 'PASS' : 'FAIL'}`);
    lines.push(`Pass threshold: ${result.passThreshold}/${result.maxScore}`);
    if (typeof result.tierName === 'string' && result.tierName.length > 0) {
      lines.push(`Level: ${result.tierName}`);
    }
    if (result.timed) {
      lines.push(`Timed: ${result.timedOut ? 'Yes (time expired)' : 'Yes'}`);
    } else {
      lines.push('Timed: No');
    }
    if (result.passCode) {
      lines.push(`Code: ${result.passCode}`);
    }
    lines.push('');
    lines.push('Question breakdown:');
    result.details.forEach((detail) => {
      const selectedText = detail.selectedChoiceText || 'No answer selected';
      const correctText = detail.correctChoiceText || 'Unknown';
      lines.push(`${detail.index + 1}. ${detail.prompt}`);
      lines.push(`Your answer: ${selectedText}`);
      lines.push(`Correct answer: ${correctText}`);
      lines.push(`Status: ${detail.isCorrect ? 'Correct' : 'Incorrect'}`);
      lines.push('');
    });
    return lines.join('\n').trimEnd();
  }

  // app-constants.js
  var IMAGE_ASSET_SETS = Object.freeze({
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
  });
  var DEFAULT_IMAGE_SRC = IMAGE_ASSET_SETS.full.normal;
  var TIMED_IMAGES = [
    { src: IMAGE_ASSET_SETS.full.normal, label: 'normal' },
    { src: IMAGE_ASSET_SETS.full.suspicious, label: 'suspicious' },
    { src: IMAGE_ASSET_SETS.full.swollen, label: 'swollen' }
  ];
  var TIMED_ROUNDS_PER_CATEGORY = 4;
  var TIMED_SET_SIZE = 4;
  var MCQ_TIER_CONFIGS = [
    {
      name: 'Primary',
      className: 'primary-star',
      questionCount: 4,
      optionCount: 3,
      passRatio: 0.5,
      timeLimitSeconds: 0,
      questionIds: ['q01', 'q02', 'q06', 'q08', 'q11', 'q16', 'q26', 'q30']
    },
    {
      name: 'Intermediate',
      className: 'intermediate-star',
      questionCount: 5,
      optionCount: 4,
      passRatio: 0.6,
      timeLimitSeconds: 110,
      questionIds: ['q03', 'q05', 'q07', 'q10', 'q12', 'q14', 'q18', 'q22', 'q25', 'q27']
    },
    {
      name: 'Advanced',
      className: 'advanced-star',
      questionCount: 7,
      optionCount: 5,
      passRatio: 0.7,
      timeLimitSeconds: 80,
      questionIds: [
        'q04',
        'q09',
        'q13',
        'q15',
        'q17',
        'q19',
        'q20',
        'q21',
        'q23',
        'q24',
        'q28',
        'q29'
      ]
    }
  ];
  var TIMED_ROUND_PROFILES = [
    { seconds: 8, isDilated: true, cataractLevel: 0 },
    { seconds: 6, isDilated: false, cataractLevel: 0 },
    { seconds: 5, isDilated: false, cataractLevel: 1 }
  ];
  var SHIFT_INTERVAL = 4e3;
  var CATARACT_PRESETS = [
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
  ];
  var CATARACT_OCCLUSION_SPOTS = [
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
  ];
  var EXPLANATION_TEMPLATES = {
    normal: `
    <div class="interpretation-summary interpretation-summary--normal">
      <span class="interpretation-kicker">Referral</span>
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
      <span class="interpretation-kicker">Referral</span>
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
      <span class="interpretation-kicker">Referral</span>
      <strong class="interpretation-referral text-red">Emergency now</strong>
    </div>
    <p class="interpretation-detail">
      Why: elevated disc with obscured major vessels or haemorrhages around the disc.
    </p>
    <div class="interpretation-meta">
      <span>Likely: definite disc swelling</span>
      <span>Next: arrange emergency review</span>
    </div>
  `
  };

  // image-assets.js
  var IMAGE_SET_QUERY_PARAM = 'images';
  var MOBILE_IMAGE_MAX_VIEWPORT_EDGE = 1100;
  function resolveImageAssetSet({
    imageAssetSets,
    queryValue: queryValue2,
    hasCoarsePointer: hasCoarsePointer2,
    viewportEdge: viewportEdge2
  }) {
    const normalizedQueryValue =
      typeof queryValue2 === 'string' ? queryValue2.trim().toLowerCase() : '';
    if (normalizedQueryValue === 'full') {
      return imageAssetSets.full;
    }
    if (normalizedQueryValue === 'mobile') {
      return imageAssetSets.mobile;
    }
    const safeViewportEdge = Number.isFinite(Number(viewportEdge2)) ? Number(viewportEdge2) : 0;
    const shouldUseMobileAssets =
      Boolean(hasCoarsePointer2) || safeViewportEdge <= MOBILE_IMAGE_MAX_VIEWPORT_EDGE;
    return shouldUseMobileAssets ? imageAssetSets.mobile : imageAssetSets.full;
  }
  function buildTimedImagesFromSet(imageSet, fallbackTimedImages) {
    if (!imageSet || typeof imageSet !== 'object') {
      return fallbackTimedImages;
    }
    return [
      { src: imageSet.normal || fallbackTimedImages[0].src, label: 'normal' },
      { src: imageSet.suspicious || fallbackTimedImages[1].src, label: 'suspicious' },
      { src: imageSet.swollen || fallbackTimedImages[2].src, label: 'swollen' }
    ];
  }
  function applyConditionButtonImageSet(imageSet, conditionButtons2) {
    if (!imageSet || typeof imageSet !== 'object') {
      return;
    }
    conditionButtons2.forEach((button) => {
      const condition = button.getAttribute('data-condition');
      const nextSource = imageSet[condition];
      if (typeof nextSource === 'string' && nextSource.length > 0) {
        button.setAttribute('data-image', nextSource);
      }
    });
  }

  // app-state.js
  function createAppState({ defaultImageSrc }) {
    return {
      ui: {
        sideMenuOpen: false,
        activeModal: null
      },
      viewer: {
        activeImageSrc: defaultImageSrc,
        conditionImageSrc: defaultImageSrc,
        activeCondition: 'normal',
        isRightEye: true,
        isDiscVisible: true,
        cataractLevel: 0,
        shiftInProgress: false
      },
      mcq: {
        selectedQuestions: [],
        lastResult: null
      },
      timed: {
        isActive: false,
        round: 0,
        score: 0,
        currentLabel: '',
        countdownTimer: null,
        feedbackTimer: null
      }
    };
  }

  // state-machine.js
  function createStateMachine(state) {
    function setSideMenuOpen(isOpen) {
      state.ui.sideMenuOpen = Boolean(isOpen);
      return state.ui.sideMenuOpen;
    }
    function setActiveModal(modalName) {
      state.ui.activeModal = modalName || null;
    }
    function beginMcqSession() {
      if (state.timed.isActive) {
        return false;
      }
      state.mcq.selectedQuestions = [];
      state.mcq.lastResult = null;
      return true;
    }
    function endMcqSession() {
      state.mcq.selectedQuestions = [];
    }
    function beginTimedSession() {
      if (state.timed.isActive) {
        return false;
      }
      state.timed.isActive = true;
      state.timed.round = 0;
      state.timed.score = 0;
      state.timed.currentLabel = '';
      return true;
    }
    function endTimedSession() {
      if (!state.timed.isActive) {
        return false;
      }
      state.timed.isActive = false;
      state.timed.currentLabel = '';
      return true;
    }
    function setTimedCountdownTimer(timerId) {
      state.timed.countdownTimer = timerId || null;
    }
    function setTimedFeedbackTimer(timerId) {
      state.timed.feedbackTimer = timerId || null;
    }
    return {
      setSideMenuOpen,
      setActiveModal,
      beginMcqSession,
      endMcqSession,
      beginTimedSession,
      endTimedSession,
      setTimedCountdownTimer,
      setTimedFeedbackTimer
    };
  }

  // viewer-math.js
  function computeDrawGeometry({
    canvasWidth,
    canvasHeight,
    imageNaturalWidth,
    imageNaturalHeight,
    imageScale,
    zoomFactor,
    bgOffsetX,
    bgOffsetY,
    circleRadius,
    circleX,
    isRightEye
  }) {
    const scaleFactor = canvasHeight / imageNaturalHeight;
    const drawnImageWidth = imageNaturalWidth * scaleFactor;
    const drawnImageHeight = canvasHeight;
    const imageDrawOffsetX = (canvasWidth - drawnImageWidth) / 2;
    const imageDrawOffsetY = 0;
    const backgroundScale = imageScale * zoomFactor;
    const scaledWidth = drawnImageWidth * backgroundScale;
    const scaledHeight = drawnImageHeight * backgroundScale;
    const offsetXPos = imageDrawOffsetX + (drawnImageWidth - scaledWidth) / 2 + bgOffsetX;
    const offsetYPos = imageDrawOffsetY + (drawnImageHeight - scaledHeight) / 2 + bgOffsetY;
    const windowScale = zoomFactor;
    const effectiveCircleRadius = circleRadius * windowScale * scaleFactor;
    const flippedCircleX = isRightEye ? circleX : canvasWidth - circleX;
    return {
      scaleFactor,
      drawnImageWidth,
      imageDrawOffsetX,
      scaledWidth,
      scaledHeight,
      offsetXPos,
      offsetYPos,
      windowScale,
      effectiveCircleRadius,
      flippedCircleX
    };
  }
  function normaliseBoundsAxis(min, max) {
    if (min <= max) {
      return { min, max };
    }
    const centre = (min + max) / 2;
    return { min: centre, max: centre };
  }
  function computeViewerBounds({
    canvasWidth,
    canvasHeight,
    imageNaturalWidth,
    imageNaturalHeight,
    circleRadius,
    zoomFactor
  }) {
    const scaleFactor = canvasHeight / imageNaturalHeight;
    const drawnImageWidth = imageNaturalWidth * scaleFactor;
    const imageDrawOffsetX = (canvasWidth - drawnImageWidth) / 2;
    const effectiveCircleRadius = circleRadius * zoomFactor * scaleFactor;
    const minX = imageDrawOffsetX + effectiveCircleRadius;
    const maxX = imageDrawOffsetX + drawnImageWidth - effectiveCircleRadius;
    const minY = effectiveCircleRadius;
    const maxY = canvasHeight - effectiveCircleRadius;
    const xBounds = normaliseBoundsAxis(minX, maxX);
    const yBounds = normaliseBoundsAxis(minY, maxY);
    return {
      minX: xBounds.min,
      maxX: xBounds.max,
      minY: yBounds.min,
      maxY: yBounds.max
    };
  }
  function clampCircleToBounds({ circleX, circleY, velocityX, velocityY, bounds }) {
    let nextX = circleX;
    let nextY = circleY;
    let nextVelocityX = velocityX;
    let nextVelocityY = velocityY;
    if (nextX < bounds.minX) {
      nextX = bounds.minX;
      nextVelocityX *= -0.5;
    }
    if (nextX > bounds.maxX) {
      nextX = bounds.maxX;
      nextVelocityX *= -0.5;
    }
    if (nextY < bounds.minY) {
      nextY = bounds.minY;
      nextVelocityY *= -0.5;
    }
    if (nextY > bounds.maxY) {
      nextY = bounds.maxY;
      nextVelocityY *= -0.5;
    }
    return {
      circleX: nextX,
      circleY: nextY,
      velocityX: nextVelocityX,
      velocityY: nextVelocityY
    };
  }
  function computeReflexOpacity({ cataractLevel, darkTint, yellowTint }) {
    const minimumOpacity = cataractLevel === 3 ? 0.3 : 0.55;
    const tintAdjustedOpacity = 1 - darkTint * 2.8 - yellowTint * 1.2;
    return Math.max(minimumOpacity, tintAdjustedOpacity);
  }

  // viewer.js
  var TIMED_AUGMENTATION_DEFAULTS = Object.freeze({
    rotateDegrees: 0,
    scale: 1,
    panXRatio: 0,
    panYRatio: 0,
    brightness: 1,
    contrast: 1,
    saturation: 1,
    flipVertical: false
  });
  var TIMED_AUGMENTATION_LIMITS = Object.freeze({
    rotateDegrees: { min: -7, max: 7 },
    scale: { min: 0.85, max: 1.2 },
    panRatio: { min: -0.08, max: 0.08 },
    brightness: { min: 0.78, max: 1.22 },
    contrast: { min: 0.78, max: 1.22 },
    saturation: { min: 0.78, max: 1.22 }
  });
  var TIMED_MOTION_DEFAULTS = Object.freeze({
    jitterMultiplier: 1,
    shiftDistanceMultiplier: 1,
    shiftDurationMs: 600
  });
  var TIMED_MOTION_LIMITS = Object.freeze({
    jitterMultiplier: { min: 1, max: 4 },
    shiftDistanceMultiplier: { min: 1, max: 3.2 },
    shiftDurationMs: { min: 250, max: 2500 }
  });
  function buildViewerPerfProfile() {
    const hasWindow = typeof window !== 'undefined';
    const hasCoarsePointer2 =
      hasWindow && typeof window.matchMedia === 'function'
        ? window.matchMedia('(pointer: coarse)').matches
        : false;
    const viewportEdge2 = hasWindow ? Math.max(window.innerWidth || 0, window.innerHeight || 0) : 0;
    const isMobileLike = hasCoarsePointer2 || viewportEdge2 <= 1100;
    return {
      isMobileLike,
      canvasScale: isMobileLike ? 0.5 : 1,
      cataractBlurScale: isMobileLike ? 0.42 : 1,
      occlusionSpotRatio: isMobileLike ? 1 : 1,
      occlusionBlurScale: isMobileLike ? 0.45 : 1,
      baseJitterIntervalMs: isMobileLike ? 24 : 16,
      cataractJitterIntervalMs: isMobileLike ? 72 : 16
    };
  }
  function extractImageFilename(path) {
    if (typeof path !== 'string' || path.length === 0) {
      return '';
    }
    const withoutQuery = path.split('?')[0];
    return withoutQuery.split('/').pop() || '';
  }
  function getJpegFallbackPath(path) {
    return null;
  }
  function resolvePreferredImagePath(path, shouldFallbackFromWebp) {
    if (typeof path !== 'string') {
      return '';
    }
    if (!shouldFallbackFromWebp) {
      return path;
    }
    return getJpegFallbackPath(path) || path;
  }
  function clampNumber(value, min, max, fallback) {
    const numeric = Number(value);
    if (!Number.isFinite(numeric)) {
      return fallback;
    }
    return Math.max(min, Math.min(max, numeric));
  }
  function normalizeTimedAugmentation(augmentation) {
    const candidate = augmentation && typeof augmentation === 'object' ? augmentation : {};
    return {
      rotateDegrees: clampNumber(
        candidate.rotateDegrees,
        TIMED_AUGMENTATION_LIMITS.rotateDegrees.min,
        TIMED_AUGMENTATION_LIMITS.rotateDegrees.max,
        TIMED_AUGMENTATION_DEFAULTS.rotateDegrees
      ),
      scale: clampNumber(
        candidate.scale,
        TIMED_AUGMENTATION_LIMITS.scale.min,
        TIMED_AUGMENTATION_LIMITS.scale.max,
        TIMED_AUGMENTATION_DEFAULTS.scale
      ),
      panXRatio: clampNumber(
        candidate.panXRatio,
        TIMED_AUGMENTATION_LIMITS.panRatio.min,
        TIMED_AUGMENTATION_LIMITS.panRatio.max,
        TIMED_AUGMENTATION_DEFAULTS.panXRatio
      ),
      panYRatio: clampNumber(
        candidate.panYRatio,
        TIMED_AUGMENTATION_LIMITS.panRatio.min,
        TIMED_AUGMENTATION_LIMITS.panRatio.max,
        TIMED_AUGMENTATION_DEFAULTS.panYRatio
      ),
      brightness: clampNumber(
        candidate.brightness,
        TIMED_AUGMENTATION_LIMITS.brightness.min,
        TIMED_AUGMENTATION_LIMITS.brightness.max,
        TIMED_AUGMENTATION_DEFAULTS.brightness
      ),
      contrast: clampNumber(
        candidate.contrast,
        TIMED_AUGMENTATION_LIMITS.contrast.min,
        TIMED_AUGMENTATION_LIMITS.contrast.max,
        TIMED_AUGMENTATION_DEFAULTS.contrast
      ),
      saturation: clampNumber(
        candidate.saturation,
        TIMED_AUGMENTATION_LIMITS.saturation.min,
        TIMED_AUGMENTATION_LIMITS.saturation.max,
        TIMED_AUGMENTATION_DEFAULTS.saturation
      ),
      flipVertical: Boolean(candidate.flipVertical)
    };
  }
  function normalizeTimedMotionProfile(profile) {
    const candidate = profile && typeof profile === 'object' ? profile : {};
    return {
      jitterMultiplier: clampNumber(
        candidate.jitterMultiplier,
        TIMED_MOTION_LIMITS.jitterMultiplier.min,
        TIMED_MOTION_LIMITS.jitterMultiplier.max,
        TIMED_MOTION_DEFAULTS.jitterMultiplier
      ),
      shiftDistanceMultiplier: clampNumber(
        candidate.shiftDistanceMultiplier,
        TIMED_MOTION_LIMITS.shiftDistanceMultiplier.min,
        TIMED_MOTION_LIMITS.shiftDistanceMultiplier.max,
        TIMED_MOTION_DEFAULTS.shiftDistanceMultiplier
      ),
      shiftDurationMs: clampNumber(
        candidate.shiftDurationMs,
        TIMED_MOTION_LIMITS.shiftDurationMs.min,
        TIMED_MOTION_LIMITS.shiftDurationMs.max,
        TIMED_MOTION_DEFAULTS.shiftDurationMs
      )
    };
  }
  function createViewer({
    state,
    canvas: canvas2,
    fovToggleCheckbox: fovToggleCheckbox2,
    fovLabelSmall: fovLabelSmall2,
    fovLabelLeft: fovLabelLeft2,
    fovLabelRight: fovLabelRight2,
    eyeToggleCheckbox: eyeToggleCheckbox2,
    eyeLabelRight: eyeLabelRight2,
    eyeLabelLeft: eyeLabelLeft2,
    cataractSlider: cataractSlider2,
    cataractStops: cataractStops2,
    viewSummary: viewSummary2,
    explanation: explanation2,
    conditionButtons: conditionButtons2,
    defaultImageSrc,
    explanationTemplates,
    cataractPresets,
    cataractOcclusionSpots
  }) {
    const ctx = canvas2.getContext('2d');
    const initialDegree = 5;
    const initialRadius = 80;
    const FOV_LEVELS = Object.freeze([4, 8, 15]);
    const FOV_SUMMARY_LABELS = Object.freeze({
      4: 'Normal (4\xB0)',
      8: 'Nil (8\xB0)',
      15: 'Dilated (15\xB0)'
    });
    const DEFAULT_FOV_INDEX = 1;
    let circleRadius = (8 / 5) * initialRadius;
    let circleX = 0;
    let circleY = 0;
    let bgOffsetX = 0;
    let bgOffsetY = 0;
    let isDragging = false;
    let activePointerId = null;
    let velocityX = 0;
    let velocityY = 0;
    let cornealJitterOffset = { x: 0, y: 0 };
    let cornealTargetOffset = { x: 0, y: 0 };
    let cornealAnimationId = null;
    const imageScale = 1;
    const zoomFactor = 3;
    const VIEWER_PERF_PROFILE = buildViewerPerfProfile();
    let timedAugmentation = { ...TIMED_AUGMENTATION_DEFAULTS };
    let timedMotionProfile = { ...TIMED_MOTION_DEFAULTS };
    const SHIFT_DISTANCE = 400;
    let shiftTimeoutId = null;
    let jitterAnimationId = null;
    let drawAnimationId = null;
    let lastJitterRenderAt = 0;
    let lastDrawRenderAt = 0;
    const jitterAmplitude = 2;
    const occlusionTextureCache = /* @__PURE__ */ new Map();
    const mobileCataractLayerCache = /* @__PURE__ */ new Map();
    const MOBILE_OCCLUSION_TEXTURE_SIZE = 640;
    const listenerDisposers = [];
    let shouldFallbackFromWebp = false;
    const img = new Image();
    img.onload = () => {
      reCentreEverything();
      if (jitterAnimationId === null) {
        jitterAnimationId = requestAnimationFrame(jitter);
      }
    };
    img.onerror = () => {
      const fallbackPath = getJpegFallbackPath(state.viewer.activeImageSrc);
      if (!fallbackPath || fallbackPath === state.viewer.activeImageSrc) {
        return;
      }
      shouldFallbackFromWebp = true;
      if (state.viewer.conditionImageSrc === state.viewer.activeImageSrc) {
        state.viewer.conditionImageSrc = fallbackPath;
      }
      state.viewer.activeImageSrc = fallbackPath;
      img.src = fallbackPath;
    };
    function addDomListener(target, eventName, handler, options) {
      target.addEventListener(eventName, handler, options);
      listenerDisposers.push(() => {
        target.removeEventListener(eventName, handler, options);
      });
    }
    function requestDraw() {
      if (drawAnimationId !== null) {
        return;
      }
      drawAnimationId = requestAnimationFrame((timestamp) => {
        drawAnimationId = null;
        const minDrawIntervalMs =
          VIEWER_PERF_PROFILE.isMobileLike && state.viewer.cataractLevel > 0 ? 34 : 0;
        const now =
          typeof timestamp === 'number'
            ? timestamp
            : typeof window !== 'undefined' && window.performance
              ? window.performance.now()
              : Date.now();
        if (minDrawIntervalMs > 0 && now - lastDrawRenderAt < minDrawIntervalMs) {
          requestDraw();
          return;
        }
        lastDrawRenderAt = now;
        draw();
      });
    }
    function initialize2() {
      state.viewer.activeImageSrc = defaultImageSrc;
      state.viewer.conditionImageSrc = defaultImageSrc;
      state.viewer.activeCondition = 'normal';
      state.viewer.isRightEye = true;
      state.viewer.isDiscVisible = true;
      state.viewer.cataractLevel = 0;
      state.viewer.shiftInProgress = false;
      timedAugmentation = { ...TIMED_AUGMENTATION_DEFAULTS };
      timedMotionProfile = { ...TIMED_MOTION_DEFAULTS };
      fovToggleCheckbox2.value = String(DEFAULT_FOV_INDEX);
      circleRadius = fovDegreesToCircleRadius(FOV_LEVELS[DEFAULT_FOV_INDEX]);
      updateConditionButtonState('normal');
      setExplanation('normal');
      setImageSource(defaultImageSrc);
      updateFovLabels();
      updateEyeLabels();
      updateCataractUi();
      bindViewerControlEvents();
      setupCanvasPointerEvents();
    }
    function bindViewerControlEvents() {
      const onFovChange = () => {
        applyFovIndex(getCurrentFovIndex());
      };
      addDomListener(fovToggleCheckbox2, 'input', onFovChange);
      addDomListener(fovToggleCheckbox2, 'change', onFovChange);
      const onEyeChange = () => {
        state.viewer.isRightEye = !eyeToggleCheckbox2.checked;
        reCentreEverything();
        updateEyeLabels();
      };
      addDomListener(eyeToggleCheckbox2, 'change', onEyeChange);
      const onCataractInput = () => {
        state.viewer.cataractLevel = Number(cataractSlider2.value);
        updateCataractUi();
        requestDraw();
      };
      addDomListener(cataractSlider2, 'input', onCataractInput);
      conditionButtons2.forEach((button) => {
        const onConditionClick = () => {
          if (button.disabled) {
            return;
          }
          const condition = button.getAttribute('data-condition') || 'normal';
          const imagePath = button.getAttribute('data-image') || defaultImageSrc;
          updateConditionButtonState(condition);
          state.viewer.activeCondition = condition;
          state.viewer.conditionImageSrc = imagePath;
          state.viewer.isDiscVisible = true;
          setImageSource(imagePath);
          setExplanation(condition);
        };
        addDomListener(button, 'click', onConditionClick);
      });
    }
    function updateConditionButtonState(activeCondition) {
      conditionButtons2.forEach((button) => {
        const condition = button.getAttribute('data-condition') || 'normal';
        const isActive = condition === activeCondition;
        button.classList.toggle('active', isActive);
        button.setAttribute('aria-pressed', isActive ? 'true' : 'false');
      });
    }
    function setupCanvasPointerEvents() {
      addDomListener(canvas2, 'pointerdown', handlePointerDown);
      addDomListener(canvas2, 'pointermove', handlePointerMove);
      addDomListener(canvas2, 'pointerup', stopDragging);
      addDomListener(canvas2, 'pointercancel', stopDragging);
      const onPointerLeave = (event) => {
        if (event.pointerType === 'mouse') {
          stopDragging(event);
        }
      };
      addDomListener(canvas2, 'pointerleave', onPointerLeave);
      addDomListener(window, 'pointerup', stopDragging);
      if (typeof document !== 'undefined') {
        addDomListener(document, 'visibilitychange', handleVisibilityChange);
      }
    }
    function handleVisibilityChange() {
      if (typeof document === 'undefined') {
        return;
      }
      if (document.hidden) {
        if (jitterAnimationId !== null) {
          cancelAnimationFrame(jitterAnimationId);
          jitterAnimationId = null;
        }
        if (drawAnimationId !== null) {
          cancelAnimationFrame(drawAnimationId);
          drawAnimationId = null;
        }
        if (cornealAnimationId !== null) {
          cancelAnimationFrame(cornealAnimationId);
          cornealAnimationId = null;
        }
        return;
      }
      if (img.complete && jitterAnimationId === null) {
        jitterAnimationId = requestAnimationFrame(jitter);
      }
      requestDraw();
    }
    function handlePointerDown(event) {
      if (event.button !== void 0 && event.button !== 0) {
        return;
      }
      isDragging = true;
      activePointerId = event.pointerId;
      velocityX = 0;
      velocityY = 0;
      canvas2.setPointerCapture(event.pointerId);
      canvas2.style.cursor = 'none';
      updatePositionFromPointer(event);
      startCornealReflexAnimation();
    }
    function handlePointerMove(event) {
      if (!isDragging || event.pointerId !== activePointerId) {
        return;
      }
      updatePositionFromPointer(event);
    }
    function stopDragging(event) {
      if (!isDragging) {
        return;
      }
      if (typeof event.pointerId === 'number' && event.pointerId !== activePointerId) {
        return;
      }
      if (typeof event.pointerId === 'number' && canvas2.hasPointerCapture(event.pointerId)) {
        canvas2.releasePointerCapture(event.pointerId);
      }
      isDragging = false;
      activePointerId = null;
      canvas2.style.cursor = 'crosshair';
      stopCornealReflexAnimation();
    }
    function updatePositionFromPointer(event) {
      const rect = canvas2.getBoundingClientRect();
      if (rect.width === 0 || rect.height === 0) {
        return;
      }
      const scaleX = canvas2.width / rect.width;
      const scaleY = canvas2.height / rect.height;
      const pointerX = (event.clientX - rect.left) * scaleX;
      const pointerY = (event.clientY - rect.top) * scaleY;
      const dragAnchorRadius = getDragAnchorRadius();
      const dragAnchorExtraOffset = Math.max(18, Math.min(64, dragAnchorRadius * 0.12));
      circleX = pointerX;
      circleY = pointerY - dragAnchorRadius - dragAnchorExtraOffset;
      checkBoundaries();
      requestDraw();
    }
    function getDragAnchorRadius() {
      if (!img.naturalHeight || canvas2.height <= 0) {
        return circleRadius * zoomFactor;
      }
      const scaleFactor = canvas2.height / img.naturalHeight;
      return circleRadius * zoomFactor * scaleFactor;
    }
    function setImageSource(path) {
      const nextPath = resolvePreferredImagePath(path, shouldFallbackFromWebp);
      state.viewer.activeImageSrc = nextPath;
      const loadedImageName = extractImageFilename(img.src);
      const requestedImageName = extractImageFilename(nextPath);
      if (img.complete && loadedImageName === requestedImageName) {
        reCentreEverything();
        return;
      }
      img.src = nextPath;
    }
    function buildTimedAugmentedDrawGeometry(geometry) {
      const panX = timedAugmentation.panXRatio * geometry.scaledWidth;
      const panY = timedAugmentation.panYRatio * geometry.scaledHeight;
      const offsetXPos = geometry.offsetXPos + panX;
      const offsetYPos = geometry.offsetYPos + panY;
      return {
        offsetXPos,
        offsetYPos,
        scaledWidth: geometry.scaledWidth,
        scaledHeight: geometry.scaledHeight,
        centreX: offsetXPos + geometry.scaledWidth / 2,
        centreY: offsetYPos + geometry.scaledHeight / 2
      };
    }
    function applyTimedAugmentationTransform(augmentedGeometry) {
      const rotationRadians = (timedAugmentation.rotateDegrees * Math.PI) / 180;
      const isVerticalFlip = timedAugmentation.flipVertical === true;
      if (rotationRadians === 0 && timedAugmentation.scale === 1 && !isVerticalFlip) {
        return;
      }
      ctx.translate(augmentedGeometry.centreX, augmentedGeometry.centreY);
      if (rotationRadians !== 0) {
        ctx.rotate(rotationRadians);
      }
      if (timedAugmentation.scale !== 1 || isVerticalFlip) {
        const yScale = isVerticalFlip ? timedAugmentation.scale * -1 : timedAugmentation.scale;
        ctx.scale(timedAugmentation.scale, yScale);
      }
      ctx.translate(-augmentedGeometry.centreX, -augmentedGeometry.centreY);
    }
    function buildFundusFilter(cataract) {
      const isMobileCataract = VIEWER_PERF_PROFILE.isMobileLike && state.viewer.cataractLevel > 0;
      const blurScale = isMobileCataract ? VIEWER_PERF_PROFILE.cataractBlurScale : 1;
      const blurPx = Math.max(
        0,
        Math.min(isMobileCataract ? 0.25 : 6, cataract.blurPx * blurScale)
      );
      const brightness = cataract.brightness * timedAugmentation.brightness;
      const contrast = cataract.contrast * timedAugmentation.contrast;
      const saturation = cataract.saturation * timedAugmentation.saturation;
      if (isMobileCataract) {
        return `brightness(${brightness})`;
      }
      return `blur(${blurPx}px) brightness(${brightness}) contrast(${contrast}) saturate(${saturation})`;
    }
    function setTimedAugmentation(augmentation) {
      timedAugmentation = normalizeTimedAugmentation(augmentation);
    }
    function clearTimedAugmentation() {
      timedAugmentation = { ...TIMED_AUGMENTATION_DEFAULTS };
    }
    function setTimedMotionProfile(profile) {
      timedMotionProfile = normalizeTimedMotionProfile(profile);
    }
    function clearTimedMotionProfile() {
      timedMotionProfile = { ...TIMED_MOTION_DEFAULTS };
    }
    function setExplanation(condition) {
      explanation2.innerHTML = explanationTemplates[condition] || explanationTemplates.normal;
    }
    function updateFovLabels() {
      const fovIndex = getCurrentFovIndex();
      if (fovLabelSmall2) {
        fovLabelSmall2.classList.toggle('active', fovIndex === 0);
      }
      fovLabelLeft2.classList.toggle('active', fovIndex === 1);
      fovLabelRight2.classList.toggle('active', fovIndex === 2);
      fovToggleCheckbox2.setAttribute('aria-valuetext', `${getCurrentFovDegrees()} degrees`);
      updateViewSummary();
    }
    function normalizeFovIndex(index) {
      const numericIndex = Number(index);
      if (!Number.isFinite(numericIndex)) {
        return DEFAULT_FOV_INDEX;
      }
      return Math.max(0, Math.min(FOV_LEVELS.length - 1, Math.round(numericIndex)));
    }
    function getCurrentFovIndex() {
      return normalizeFovIndex(fovToggleCheckbox2.value);
    }
    function getCurrentFovDegrees() {
      return FOV_LEVELS[getCurrentFovIndex()] || 8;
    }
    function resolveClosestFovIndex(degrees) {
      const numericDegrees = Number(degrees);
      if (!Number.isFinite(numericDegrees)) {
        return DEFAULT_FOV_INDEX;
      }
      let closestIndex = DEFAULT_FOV_INDEX;
      let smallestDistance = Infinity;
      FOV_LEVELS.forEach((candidateDegrees, index) => {
        const distance = Math.abs(candidateDegrees - numericDegrees);
        if (distance < smallestDistance) {
          smallestDistance = distance;
          closestIndex = index;
        }
      });
      return closestIndex;
    }
    function fovDegreesToCircleRadius(degrees) {
      return (degrees / initialDegree) * initialRadius;
    }
    function applyFovIndex(index) {
      const normalizedIndex = normalizeFovIndex(index);
      const nextFov = FOV_LEVELS[normalizedIndex] || 8;
      fovToggleCheckbox2.value = String(normalizedIndex);
      circleRadius = fovDegreesToCircleRadius(nextFov);
      checkBoundaries();
      requestDraw();
      updateFovLabels();
    }
    function setFovDegrees(degrees) {
      applyFovIndex(resolveClosestFovIndex(degrees));
    }
    function getFovDegrees() {
      return getCurrentFovDegrees();
    }
    function updateEyeLabels() {
      eyeLabelRight2.classList.toggle('active', state.viewer.isRightEye);
      eyeLabelLeft2.classList.toggle('active', !state.viewer.isRightEye);
      updateViewSummary();
    }
    function updateCataractUi() {
      const maxIndex = cataractPresets.length - 1;
      const clampedLevel = Math.max(0, Math.min(maxIndex, Number(cataractSlider2.value) || 0));
      state.viewer.cataractLevel = clampedLevel;
      cataractSlider2.value = String(clampedLevel);
      const preset = cataractPresets[state.viewer.cataractLevel];
      cataractSlider2.setAttribute('aria-valuetext', preset.label);
      cataractStops2.forEach((stop, index) => {
        stop.classList.toggle('active', index === clampedLevel);
      });
      updateViewSummary();
    }
    function updateViewSummary() {
      if (!viewSummary2) {
        return;
      }
      const eyeText = state.viewer.isRightEye ? 'RE' : 'LE';
      const fovDegrees = getCurrentFovDegrees();
      const fovText = FOV_SUMMARY_LABELS[fovDegrees] || `${fovDegrees} degrees`;
      const cataractPreset = cataractPresets[state.viewer.cataractLevel] || cataractPresets[0];
      const cataractText = cataractPreset.label === 'None' ? 'No cataract' : cataractPreset.label;
      const summaryText = `${eyeText} - ${fovText} - ${cataractText}`;
      viewSummary2.textContent = summaryText;
      viewSummary2.setAttribute('aria-label', `Current viewing setup: ${summaryText}`);
    }
    function buildOcclusionRenderConfig(level, minDimension) {
      const isDenseLevel = level === 3;
      const patchProfileLevel = level === 3 ? 2 : level;
      const spots = cataractOcclusionSpots[patchProfileLevel];
      if (!spots || spots.length === 0) {
        return null;
      }
      const spotRatio = Math.max(0.2, Math.min(1, VIEWER_PERF_PROFILE.occlusionSpotRatio));
      const maxSpots = Math.max(1, Math.round(spots.length * spotRatio));
      const spotsToRender = spotRatio >= 1 ? spots : spots.slice(0, maxSpots);
      return {
        isDenseLevel,
        patchProfileLevel,
        spotsToRender,
        minDimension,
        levelBoost: [1, 1.3, 1.75][patchProfileLevel] || 1,
        blurMultiplier: [1, 1, 0.68][patchProfileLevel] || 1,
        blurCap: [14, 14, 11][patchProfileLevel] || 14,
        outerAlphaCap: [0.72, 0.76, 0.8][patchProfileLevel] || 0.72,
        coreAlphaCap: [0.8, 0.84, 0.88][patchProfileLevel] || 0.8,
        coreBoost: [1.7, 1.9, 2.25][patchProfileLevel] || 1.7,
        hardCoreStrengthBase: [0, 0, 0.36][patchProfileLevel] || 0,
        hardCoreRadiusX: [0, 0, 0.3][patchProfileLevel] || 0,
        hardCoreRadiusY: [0, 0, 0.2][patchProfileLevel] || 0,
        coreBlurMultiplier: [0.45, 0.45, 0.28][patchProfileLevel] || 0.45
      };
    }
    function drawOcclusionSpotsToContext(
      drawingContext,
      config,
      imageX,
      imageY,
      imageWidth,
      imageHeight
    ) {
      const radiusBoost = config.radiusBoost || 1;
      const occlusionBlurScale =
        typeof config.occlusionBlurScaleOverride === 'number'
          ? config.occlusionBlurScaleOverride
          : VIEWER_PERF_PROFILE.occlusionBlurScale;
      config.spotsToRender.forEach((spot) => {
        const spotX = imageX + (0.5 + spot.x * 0.5) * imageWidth;
        const spotY = imageY + (0.5 + spot.y * 0.5) * imageHeight;
        const patchSizeMultiplier = config.isDenseLevel ? 2 : 1;
        const spotRadius = spot.r * config.minDimension * 0.3 * patchSizeMultiplier * radiusBoost;
        const stretchX = spot.stretchX || 1;
        const stretchY = spot.stretchY || 1;
        const angle = spot.angle || 0;
        const blurPxRaw =
          spot.blur * (config.minDimension / 900) * config.blurMultiplier * occlusionBlurScale;
        const blurPx = Math.max(0.45, Math.min(config.blurCap, blurPxRaw));
        const outerAlpha = Math.min(config.outerAlphaCap, spot.alpha * config.levelBoost);
        const coreAlpha = Math.min(
          config.coreAlphaCap,
          spot.coreAlpha * config.levelBoost * config.coreBoost
        );
        drawingContext.save();
        drawingContext.translate(spotX, spotY);
        drawingContext.rotate(angle);
        drawingContext.scale(stretchX, stretchY);
        drawingContext.filter = `blur(${blurPx}px)`;
        const outerGradient = drawingContext.createRadialGradient(0, 0, 0, 0, 0, spotRadius);
        outerGradient.addColorStop(0, `rgba(4, 3, 2, ${outerAlpha})`);
        outerGradient.addColorStop(0.55, `rgba(8, 6, 4, ${outerAlpha * 0.82})`);
        outerGradient.addColorStop(1, 'rgba(12, 8, 5, 0)');
        drawingContext.fillStyle = outerGradient;
        drawingContext.beginPath();
        drawingContext.arc(0, 0, spotRadius, 0, 2 * Math.PI);
        drawingContext.fill();
        if (coreAlpha > 0) {
          const coreGradient = drawingContext.createRadialGradient(
            0,
            0,
            0,
            0,
            0,
            spotRadius * 0.46
          );
          coreGradient.addColorStop(0, `rgba(0, 0, 0, ${coreAlpha})`);
          coreGradient.addColorStop(0.8, `rgba(6, 4, 2, ${coreAlpha * 0.46})`);
          coreGradient.addColorStop(1, 'rgba(8, 5, 2, 0)');
          drawingContext.fillStyle = coreGradient;
          drawingContext.beginPath();
          drawingContext.arc(0, 0, spotRadius * 0.46, 0, 2 * Math.PI);
          drawingContext.fill();
          drawingContext.filter = `blur(${Math.max(0.1, blurPx * config.coreBlurMultiplier)}px)`;
          drawingContext.fillStyle = `rgba(0, 0, 0, ${Math.min(0.88, coreAlpha * 0.95)})`;
          drawingContext.beginPath();
          drawingContext.ellipse(0, 0, spotRadius * 0.26, spotRadius * 0.16, 0, 0, 2 * Math.PI);
          drawingContext.fill();
          const hardCoreStrength = VIEWER_PERF_PROFILE.isMobileLike
            ? config.hardCoreStrengthBase * 0.55
            : config.hardCoreStrengthBase;
          if (hardCoreStrength > 0) {
            drawingContext.filter = 'none';
            drawingContext.fillStyle = `rgba(0, 0, 0, ${Math.min(
              hardCoreStrength,
              coreAlpha * 1.4
            )})`;
            drawingContext.beginPath();
            drawingContext.ellipse(
              0,
              0,
              spotRadius * config.hardCoreRadiusX,
              spotRadius * config.hardCoreRadiusY,
              0,
              0,
              2 * Math.PI
            );
            drawingContext.fill();
          }
        }
        drawingContext.restore();
      });
    }
    function getMobileOcclusionTexture(level) {
      if (!VIEWER_PERF_PROFILE.isMobileLike || level <= 0) {
        return null;
      }
      if (occlusionTextureCache.has(level)) {
        return occlusionTextureCache.get(level);
      }
      if (typeof document === 'undefined' || typeof document.createElement !== 'function') {
        occlusionTextureCache.set(level, null);
        return null;
      }
      const renderConfig = buildOcclusionRenderConfig(level, MOBILE_OCCLUSION_TEXTURE_SIZE);
      if (!renderConfig) {
        occlusionTextureCache.set(level, null);
        return null;
      }
      const textureCanvas = document.createElement('canvas');
      textureCanvas.width = MOBILE_OCCLUSION_TEXTURE_SIZE;
      textureCanvas.height = MOBILE_OCCLUSION_TEXTURE_SIZE;
      const textureContext = textureCanvas.getContext('2d');
      if (!textureContext) {
        occlusionTextureCache.set(level, null);
        return null;
      }
      textureContext.save();
      textureContext.globalCompositeOperation = 'source-over';
      drawOcclusionSpotsToContext(
        textureContext,
        renderConfig,
        0,
        0,
        MOBILE_OCCLUSION_TEXTURE_SIZE,
        MOBILE_OCCLUSION_TEXTURE_SIZE
      );
      textureContext.filter = 'none';
      textureContext.restore();
      occlusionTextureCache.set(level, textureCanvas);
      return textureCanvas;
    }
    function getMobileCataractLayer(level, cataract) {
      if (
        !VIEWER_PERF_PROFILE.isMobileLike ||
        level <= 0 ||
        canvas2.width <= 0 ||
        canvas2.height <= 0
      ) {
        return null;
      }
      const cacheKey = `${level}:${canvas2.width}x${canvas2.height}`;
      if (mobileCataractLayerCache.has(cacheKey)) {
        return mobileCataractLayerCache.get(cacheKey);
      }
      if (typeof document === 'undefined' || typeof document.createElement !== 'function') {
        mobileCataractLayerCache.set(cacheKey, null);
        return null;
      }
      const layerCanvas = document.createElement('canvas');
      layerCanvas.width = canvas2.width;
      layerCanvas.height = canvas2.height;
      const layerContext = layerCanvas.getContext('2d');
      if (!layerContext) {
        mobileCataractLayerCache.set(cacheKey, null);
        return null;
      }
      if (cataract.yellowTint > 0) {
        layerContext.fillStyle = `rgba(226, 188, 92, ${cataract.yellowTint})`;
        layerContext.fillRect(0, 0, layerCanvas.width, layerCanvas.height);
      }
      if (cataract.darkTint > 0) {
        layerContext.fillStyle = `rgba(35, 24, 5, ${cataract.darkTint})`;
        layerContext.fillRect(0, 0, layerCanvas.width, layerCanvas.height);
      }
      if (cataract.hazeTint > 0) {
        layerContext.fillStyle = `rgba(250, 236, 208, ${cataract.hazeTint})`;
        layerContext.fillRect(0, 0, layerCanvas.width, layerCanvas.height);
      }
      const virtualImageScale = zoomFactor * 1.12;
      const virtualImageWidth = layerCanvas.width * virtualImageScale;
      const virtualImageHeight = layerCanvas.height * virtualImageScale;
      const virtualImageX = (layerCanvas.width - virtualImageWidth) / 2;
      const virtualImageY = (layerCanvas.height - virtualImageHeight) / 2;
      const renderConfig = buildOcclusionRenderConfig(
        level,
        Math.max(1, Math.min(virtualImageWidth, virtualImageHeight))
      );
      if (renderConfig) {
        renderConfig.radiusBoost = 1.08;
        renderConfig.occlusionBlurScaleOverride = 0.92;
        drawOcclusionSpotsToContext(
          layerContext,
          renderConfig,
          virtualImageX,
          virtualImageY,
          virtualImageWidth,
          virtualImageHeight
        );
        layerContext.filter = 'none';
      }
      mobileCataractLayerCache.set(cacheKey, layerCanvas);
      return layerCanvas;
    }
    function drawMobileCataractLayer(level, cataract) {
      const layer = getMobileCataractLayer(level, cataract);
      if (!layer) {
        return;
      }
      ctx.save();
      ctx.globalCompositeOperation = 'source-over';
      ctx.drawImage(layer, 0, 0, canvas2.width, canvas2.height);
      ctx.restore();
    }
    function drawCataractOcclusions(imageX, imageY, imageWidth, imageHeight, level) {
      const mobileTexture = getMobileOcclusionTexture(level);
      if (mobileTexture) {
        ctx.save();
        ctx.globalCompositeOperation = 'source-over';
        ctx.drawImage(mobileTexture, imageX, imageY, imageWidth, imageHeight);
        ctx.restore();
        return;
      }
      const minDimension = Math.min(imageWidth, imageHeight);
      const renderConfig = buildOcclusionRenderConfig(level, minDimension);
      if (!renderConfig) {
        return;
      }
      ctx.save();
      ctx.globalCompositeOperation = 'source-over';
      drawOcclusionSpotsToContext(ctx, renderConfig, imageX, imageY, imageWidth, imageHeight);
      ctx.filter = 'none';
      ctx.restore();
    }
    function jitter(timestamp) {
      const now =
        typeof timestamp === 'number'
          ? timestamp
          : typeof window !== 'undefined' && window.performance
            ? window.performance.now()
            : Date.now();
      const isMobileCataract = VIEWER_PERF_PROFILE.isMobileLike && state.viewer.cataractLevel > 0;
      const minJitterIntervalMs = isMobileCataract
        ? VIEWER_PERF_PROFILE.cataractJitterIntervalMs
        : VIEWER_PERF_PROFILE.baseJitterIntervalMs;
      if (isMobileCataract && isDragging) {
        jitterAnimationId = requestAnimationFrame(jitter);
        return;
      }
      if (now - lastJitterRenderAt < minJitterIntervalMs) {
        jitterAnimationId = requestAnimationFrame(jitter);
        return;
      }
      lastJitterRenderAt = now;
      const jitterStrength = isMobileCataract ? 0.58 : 1;
      const activeJitterAmplitude =
        jitterAmplitude * timedMotionProfile.jitterMultiplier * jitterStrength;
      const damping = Math.max(0.72, 0.85 - (timedMotionProfile.jitterMultiplier - 1) * 0.04);
      const accelX = (Math.random() - 0.5) * activeJitterAmplitude;
      const accelY = (Math.random() - 0.5) * activeJitterAmplitude;
      velocityX += accelX;
      velocityY += accelY;
      velocityX *= damping;
      velocityY *= damping;
      bgOffsetX += velocityX;
      bgOffsetY += velocityY;
      checkBoundaries();
      requestDraw();
      jitterAnimationId = requestAnimationFrame(jitter);
    }
    function doGazeShift(options = {}) {
      state.viewer.shiftInProgress = true;
      const previousDragging = isDragging;
      const previousVelocityX = velocityX;
      const previousVelocityY = velocityY;
      isDragging = false;
      velocityX = 0;
      velocityY = 0;
      const originalX = bgOffsetX;
      const originalY = bgOffsetY;
      const distanceMultiplier =
        clampNumber(options.distanceMultiplier, 0.25, 4, 1) *
        timedMotionProfile.shiftDistanceMultiplier;
      const shiftDistance = SHIFT_DISTANCE * distanceMultiplier;
      const returnDelayMs = clampNumber(
        options.returnDelayMs,
        TIMED_MOTION_LIMITS.shiftDurationMs.min,
        TIMED_MOTION_LIMITS.shiftDurationMs.max,
        timedMotionProfile.shiftDurationMs
      );
      const angle = Math.random() * 2 * Math.PI;
      bgOffsetX += shiftDistance * Math.cos(angle);
      bgOffsetY += shiftDistance * Math.sin(angle);
      checkBoundaries();
      requestDraw();
      if (shiftTimeoutId !== null) {
        clearTimeout(shiftTimeoutId);
        shiftTimeoutId = null;
      }
      shiftTimeoutId = setTimeout(() => {
        bgOffsetX = originalX;
        bgOffsetY = originalY;
        checkBoundaries();
        requestDraw();
        isDragging = previousDragging;
        velocityX = previousVelocityX;
        velocityY = previousVelocityY;
        state.viewer.shiftInProgress = false;
        shiftTimeoutId = null;
      }, returnDelayMs);
    }
    function startCornealReflexAnimation() {
      if (VIEWER_PERF_PROFILE.isMobileLike) {
        return;
      }
      if (cornealAnimationId !== null) {
        return;
      }
      const animateReflex = () => {
        if (!isDragging) {
          cornealTargetOffset = { x: 0, y: 0 };
        } else {
          cornealTargetOffset = {
            x: (Math.random() - 0.5) * 100,
            y: (Math.random() - 0.5) * 100
          };
        }
        cornealJitterOffset.x += (cornealTargetOffset.x - cornealJitterOffset.x) * 0.1;
        cornealJitterOffset.y += (cornealTargetOffset.y - cornealJitterOffset.y) * 0.1;
        requestDraw();
        cornealAnimationId = requestAnimationFrame(animateReflex);
      };
      animateReflex();
    }
    function stopCornealReflexAnimation() {
      if (cornealAnimationId !== null) {
        cancelAnimationFrame(cornealAnimationId);
        cornealAnimationId = null;
      }
      cornealJitterOffset = { x: 0, y: 0 };
      requestDraw();
    }
    function reCentreEverything() {
      if (!img.naturalWidth || !img.naturalHeight) {
        return;
      }
      const renderScale = Math.max(0.45, Math.min(1, VIEWER_PERF_PROFILE.canvasScale));
      canvas2.width = Math.max(1, Math.round(img.naturalWidth * renderScale));
      canvas2.height = Math.max(1, Math.round(img.naturalHeight * renderScale));
      ctx.imageSmoothingEnabled = true;
      ctx.imageSmoothingQuality = VIEWER_PERF_PROFILE.isMobileLike ? 'medium' : 'high';
      circleX = canvas2.width / 2;
      circleY = canvas2.height / 2;
      velocityX = 0;
      velocityY = 0;
      bgOffsetX = 0;
      bgOffsetY = 0;
      mobileCataractLayerCache.clear();
      requestDraw();
    }
    function draw() {
      if (!img.naturalWidth || !img.naturalHeight) {
        return;
      }
      ctx.clearRect(0, 0, canvas2.width, canvas2.height);
      const geometry = computeDrawGeometry({
        canvasWidth: canvas2.width,
        canvasHeight: canvas2.height,
        imageNaturalWidth: img.naturalWidth,
        imageNaturalHeight: img.naturalHeight,
        imageScale,
        zoomFactor,
        bgOffsetX,
        bgOffsetY,
        circleRadius,
        circleX,
        isRightEye: state.viewer.isRightEye
      });
      const cataract = cataractPresets[state.viewer.cataractLevel] || cataractPresets[0];
      drawFundusLayer(geometry, cataract);
      drawCornealReflexLayer(geometry, cataract);
      drawWindowRing(geometry);
      drawCanvasEdgeLabels();
    }
    function clipViewingWindow(centerX, centerY, radius) {
      ctx.beginPath();
      ctx.arc(centerX, centerY, radius, 0, 2 * Math.PI, true);
      ctx.closePath();
      ctx.clip();
    }
    function drawFundusLayer(geometry, cataract) {
      ctx.save();
      if (!state.viewer.isRightEye) {
        ctx.translate(canvas2.width, 0);
        ctx.scale(-1, 1);
      }
      clipViewingWindow(geometry.flippedCircleX, circleY, geometry.effectiveCircleRadius);
      if (state.viewer.isDiscVisible) {
        const augmentedGeometry = buildTimedAugmentedDrawGeometry(geometry);
        ctx.save();
        applyTimedAugmentationTransform(augmentedGeometry);
        ctx.filter = buildFundusFilter(cataract);
        ctx.drawImage(
          img,
          0,
          0,
          img.naturalWidth,
          img.naturalHeight,
          augmentedGeometry.offsetXPos,
          augmentedGeometry.offsetYPos,
          augmentedGeometry.scaledWidth,
          augmentedGeometry.scaledHeight
        );
        ctx.filter = 'none';
        ctx.restore();
        const isMobileCachedCataract =
          VIEWER_PERF_PROFILE.isMobileLike && state.viewer.cataractLevel > 0;
        if (isMobileCachedCataract) {
          drawMobileCataractLayer(state.viewer.cataractLevel, cataract);
        } else {
          applyCataractOverlays(cataract);
          ctx.save();
          applyTimedAugmentationTransform(augmentedGeometry);
          drawCataractOcclusions(
            augmentedGeometry.offsetXPos,
            augmentedGeometry.offsetYPos,
            augmentedGeometry.scaledWidth,
            augmentedGeometry.scaledHeight,
            state.viewer.cataractLevel
          );
          ctx.restore();
        }
      } else {
        ctx.fillStyle = 'black';
        ctx.fillRect(0, 0, canvas2.width, canvas2.height);
      }
      ctx.restore();
    }
    function applyCataractOverlays(cataract) {
      if (cataract.yellowTint > 0) {
        ctx.fillStyle = `rgba(226, 188, 92, ${cataract.yellowTint})`;
        ctx.fillRect(0, 0, canvas2.width, canvas2.height);
      }
      if (cataract.darkTint > 0) {
        ctx.fillStyle = `rgba(35, 24, 5, ${cataract.darkTint})`;
        ctx.fillRect(0, 0, canvas2.width, canvas2.height);
      }
      if (cataract.hazeTint > 0) {
        ctx.fillStyle = `rgba(250, 236, 208, ${cataract.hazeTint})`;
        ctx.fillRect(0, 0, canvas2.width, canvas2.height);
      }
    }
    function drawCornealReflexLayer(geometry, cataract) {
      ctx.save();
      clipViewingWindow(circleX, circleY, geometry.effectiveCircleRadius);
      if (state.viewer.isDiscVisible) {
        drawCornealReflex(geometry.effectiveCircleRadius, cataract);
      }
      ctx.restore();
    }
    function drawCornealReflex(effectiveCircleRadius, cataract) {
      const reflexOpacity = computeReflexOpacity({
        cataractLevel: state.viewer.cataractLevel,
        darkTint: cataract.darkTint,
        yellowTint: cataract.yellowTint
      });
      const renderResolutionScale =
        img.naturalHeight > 0 ? Math.max(0.45, Math.min(1, canvas2.height / img.naturalHeight)) : 1;
      const reflexBaseRadius = 375 * renderResolutionScale;
      const reflexScaleFactor = 1.3;
      const ellipseWidth = 0.6 * reflexBaseRadius * reflexScaleFactor;
      const ellipseHeight = 0.5 * reflexBaseRadius * reflexScaleFactor;
      const smallerReflexScaleFactor = 0.7;
      const smallerEllipseWidth = ellipseWidth * smallerReflexScaleFactor;
      const smallerEllipseHeight = ellipseHeight * smallerReflexScaleFactor;
      const ellipseCenterX = circleX + cornealJitterOffset.x;
      const ellipseCenterY = circleY + 0.3 * effectiveCircleRadius + cornealJitterOffset.y;
      ctx.save();
      ctx.translate(ellipseCenterX, ellipseCenterY);
      ctx.scale(1, -1);
      ctx.translate(-ellipseCenterX, -ellipseCenterY);
      drawReflexEllipse(
        ellipseCenterX,
        ellipseCenterY,
        ellipseWidth,
        ellipseHeight,
        0.5 * reflexOpacity
      );
      drawReflexEllipse(
        ellipseCenterX,
        ellipseCenterY,
        smallerEllipseWidth,
        smallerEllipseHeight,
        reflexOpacity
      );
      ctx.restore();
    }
    function drawReflexEllipse(centerX, centerY, width, height, alpha) {
      const rx = width / 2;
      const ry = height / 2;
      const flatterRy = ry * 0.6;
      ctx.beginPath();
      ctx.ellipse(centerX, centerY, rx, ry, 0, Math.PI, 2 * Math.PI, false);
      ctx.ellipse(centerX, centerY, rx, flatterRy, 0, 0, Math.PI, false);
      ctx.closePath();
      ctx.fillStyle = `rgba(255,255,255,${alpha})`;
      ctx.fill();
    }
    function drawWindowRing(geometry) {
      const baseLineWidth = 18 * geometry.windowScale * geometry.scaleFactor;
      ctx.save();
      ctx.beginPath();
      ctx.arc(circleX, circleY, geometry.effectiveCircleRadius, 0, 2 * Math.PI, true);
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.24)';
      ctx.lineWidth = baseLineWidth * 2;
      ctx.stroke();
      ctx.beginPath();
      ctx.arc(circleX, circleY, geometry.effectiveCircleRadius, 0, 2 * Math.PI, true);
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.66)';
      ctx.lineWidth = baseLineWidth;
      ctx.stroke();
      ctx.beginPath();
      ctx.arc(circleX, circleY, geometry.effectiveCircleRadius, 0, 2 * Math.PI, true);
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.92)';
      ctx.lineWidth = Math.max(2, baseLineWidth * 0.5);
      ctx.stroke();
      ctx.restore();
    }
    function drawCanvasEdgeLabels() {
      const displayWidth = Math.max(1, canvas2.clientWidth || canvas2.width);
      const displayHeight = Math.max(1, canvas2.clientHeight || canvas2.height);
      const canvasScaleX = canvas2.width / displayWidth;
      const canvasScaleY = canvas2.height / displayHeight;
      const sideOffsetCss = Math.max(10, Math.min(16, displayWidth * 0.02));
      const fontSizeCss = Math.max(10, Math.min(13, displayWidth * 0.011));
      const sideOffset = sideOffsetCss * canvasScaleX;
      const centreY = displayHeight * 0.5 * canvasScaleY;
      const fontSize = fontSizeCss * canvasScaleX;
      ctx.save();
      ctx.fillStyle = 'white';
      ctx.font = `600 ${fontSize}px 'Inter', 'Segoe UI', 'Helvetica Neue', Arial, sans-serif`;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      if (state.viewer.isRightEye) {
        ctx.save();
        ctx.translate(sideOffset, centreY);
        ctx.rotate(-Math.PI / 2);
        ctx.fillText('Temporal', 0, 0);
        ctx.restore();
        ctx.save();
        ctx.translate(canvas2.width - sideOffset, centreY);
        ctx.rotate(Math.PI / 2);
        ctx.fillText('Nasal', 0, 0);
        ctx.restore();
      } else {
        ctx.save();
        ctx.translate(sideOffset, centreY);
        ctx.rotate(-Math.PI / 2);
        ctx.fillText('Nasal', 0, 0);
        ctx.restore();
        ctx.save();
        ctx.translate(canvas2.width - sideOffset, centreY);
        ctx.rotate(Math.PI / 2);
        ctx.fillText('Temporal', 0, 0);
        ctx.restore();
      }
      ctx.restore();
    }
    function checkBoundaries() {
      if (!img.naturalWidth || !img.naturalHeight) {
        return;
      }
      const bounds = computeViewerBounds({
        canvasWidth: canvas2.width,
        canvasHeight: canvas2.height,
        imageNaturalWidth: img.naturalWidth,
        imageNaturalHeight: img.naturalHeight,
        circleRadius,
        zoomFactor
      });
      const clamped = clampCircleToBounds({
        circleX,
        circleY,
        velocityX,
        velocityY,
        bounds
      });
      circleX = clamped.circleX;
      circleY = clamped.circleY;
      velocityX = clamped.velocityX;
      velocityY = clamped.velocityY;
    }
    function ensureUndilated() {
      if (getCurrentFovDegrees() !== 8) {
        setFovDegrees(8);
      }
    }
    function setDilated(isDilated) {
      const nextIsDilated = Boolean(isDilated);
      const currentIsDilated = getCurrentFovDegrees() === 15;
      if (currentIsDilated === nextIsDilated) {
        return;
      }
      setFovDegrees(nextIsDilated ? 15 : 8);
    }
    function getIsDilated() {
      return getCurrentFovDegrees() === 15;
    }
    function setRightEye(isRightEye) {
      const nextIsRightEye = Boolean(isRightEye);
      if (state.viewer.isRightEye === nextIsRightEye) {
        return;
      }
      eyeToggleCheckbox2.checked = !nextIsRightEye;
      state.viewer.isRightEye = nextIsRightEye;
      reCentreEverything();
      updateEyeLabels();
    }
    function getIsRightEye() {
      return state.viewer.isRightEye;
    }
    function setCataractLevel(level) {
      const maxIndex = cataractPresets.length - 1;
      const nextLevel = Math.max(0, Math.min(maxIndex, Number(level) || 0));
      if (Number(cataractSlider2.value) === nextLevel) {
        return;
      }
      cataractSlider2.value = String(nextLevel);
      updateCataractUi();
      requestDraw();
    }
    function getCataractLevel() {
      return Number(cataractSlider2.value) || 0;
    }
    function setDiscVisible(visible) {
      state.viewer.isDiscVisible = visible;
      requestDraw();
    }
    function setViewerControlsDisabled(disabled) {
      conditionButtons2.forEach((button) => {
        button.disabled = disabled;
      });
      fovToggleCheckbox2.disabled = disabled;
      eyeToggleCheckbox2.disabled = disabled;
      cataractSlider2.disabled = disabled;
    }
    function getActiveConditionImagePath() {
      return state.viewer.conditionImageSrc || defaultImageSrc;
    }
    function destroy() {
      listenerDisposers.splice(0).forEach((dispose) => {
        dispose();
      });
      if (jitterAnimationId !== null) {
        cancelAnimationFrame(jitterAnimationId);
        jitterAnimationId = null;
      }
      if (drawAnimationId !== null) {
        cancelAnimationFrame(drawAnimationId);
        drawAnimationId = null;
      }
      if (cornealAnimationId !== null) {
        cancelAnimationFrame(cornealAnimationId);
        cornealAnimationId = null;
      }
      if (shiftTimeoutId !== null) {
        clearTimeout(shiftTimeoutId);
        shiftTimeoutId = null;
      }
      state.viewer.shiftInProgress = false;
      occlusionTextureCache.clear();
      mobileCataractLayerCache.clear();
    }
    return {
      initialize: initialize2,
      doGazeShift,
      setDiscVisible,
      setImageSource,
      setViewerControlsDisabled,
      ensureUndilated,
      setDilated,
      getIsDilated,
      setRightEye,
      getIsRightEye,
      setCataractLevel,
      getCataractLevel,
      setTimedAugmentation,
      clearTimedAugmentation,
      setTimedMotionProfile,
      clearTimedMotionProfile,
      setFovDegrees,
      getFovDegrees,
      getActiveConditionImagePath,
      destroy
    };
  }

  // modal-manager.js
  var FOCUSABLE_SELECTOR = [
    'a[href]',
    'button:not([disabled])',
    'input:not([disabled]):not([type="hidden"])',
    'select:not([disabled])',
    'textarea:not([disabled])',
    '[tabindex]:not([tabindex="-1"])'
  ].join(',');
  function createModalManager({
    state,
    stateMachine: stateMachine2,
    sideMenu: sideMenu2,
    sideMenuButtons: sideMenuButtons2,
    burgerIcon: burgerIcon2,
    infoIcon: infoIcon2,
    infoModal: infoModal2,
    testModal: testModal2
  }) {
    function setSideMenuOpen(isOpen) {
      stateMachine2.setSideMenuOpen(isOpen);
      sideMenu2.classList.toggle('open', isOpen);
      sideMenu2.setAttribute('aria-hidden', isOpen ? 'false' : 'true');
      burgerIcon2.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
      sideMenu2.inert = !isOpen;
      sideMenuButtons2.forEach((button) => {
        var _a2;
        const isLocked = ((_a2 = button.dataset) == null ? void 0 : _a2.locked) === 'true';
        button.disabled = !isOpen || isLocked;
        button.tabIndex = isOpen && !isLocked ? 0 : -1;
      });
    }
    function toggleSideMenu() {
      setSideMenuOpen(!state.ui.sideMenuOpen);
    }
    function isModalOpen(modal) {
      return modal.classList.contains('is-open');
    }
    function setModalState(modal, isOpen, triggerButton) {
      if (isOpen) {
        const returnFocusEl2 =
          triggerButton ||
          (document.activeElement instanceof HTMLElement ? document.activeElement : null);
        modal.returnFocusEl = returnFocusEl2;
      }
      modal.classList.toggle('is-open', isOpen);
      modal.setAttribute('aria-hidden', isOpen ? 'false' : 'true');
      stateMachine2.setActiveModal(isOpen ? modal.id : null);
      if (triggerButton) {
        triggerButton.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
      }
      const hasOpenModal = isModalOpen(infoModal2) || isModalOpen(testModal2);
      document.body.classList.toggle('modal-open', hasOpenModal);
      if (isOpen) {
        queueMicrotask(() => {
          focusFirstElement(modal);
        });
        return;
      }
      const returnFocusEl = modal.returnFocusEl;
      modal.returnFocusEl = null;
      if (returnFocusEl && typeof returnFocusEl.focus === 'function' && returnFocusEl.isConnected) {
        returnFocusEl.focus();
      }
    }
    function getTopOpenModal() {
      if (isModalOpen(testModal2)) {
        return testModal2;
      }
      if (isModalOpen(infoModal2)) {
        return infoModal2;
      }
      return null;
    }
    function getFocusableElements(container) {
      return Array.from(container.querySelectorAll(FOCUSABLE_SELECTOR)).filter((element) => {
        return element.getClientRects().length > 0;
      });
    }
    function focusFirstElement(modal) {
      const focusableElements = getFocusableElements(modal);
      if (focusableElements.length > 0) {
        focusableElements[0].focus();
        return;
      }
      modal.setAttribute('tabindex', '-1');
      modal.focus();
    }
    function trapFocusInModal(event, modal) {
      const focusableElements = getFocusableElements(modal);
      if (focusableElements.length === 0) {
        event.preventDefault();
        modal.focus();
        return;
      }
      const first = focusableElements[0];
      const last = focusableElements[focusableElements.length - 1];
      const activeElement = document.activeElement;
      if (!modal.contains(activeElement)) {
        event.preventDefault();
        if (event.shiftKey) {
          last.focus();
        } else {
          first.focus();
        }
        return;
      }
      if (event.shiftKey && activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    }
    function handleDocumentClick(event, { closeTestModal }) {
      const target = event.target;
      if (target === infoModal2) {
        setModalState(infoModal2, false, infoIcon2);
      }
      if (target === testModal2) {
        closeTestModal();
      }
      if (state.ui.sideMenuOpen && !sideMenu2.contains(target) && !burgerIcon2.contains(target)) {
        setSideMenuOpen(false);
      }
    }
    function handleDocumentKeyDown(event, { closeTestModal }) {
      if (event.key === 'Tab') {
        const openModal = getTopOpenModal();
        if (openModal) {
          trapFocusInModal(event, openModal);
        }
      }
      if (event.key !== 'Escape') {
        return;
      }
      if (isModalOpen(infoModal2)) {
        setModalState(infoModal2, false, infoIcon2);
      }
      if (isModalOpen(testModal2)) {
        closeTestModal();
      }
      if (state.ui.sideMenuOpen) {
        setSideMenuOpen(false);
      }
    }
    return {
      setSideMenuOpen,
      toggleSideMenu,
      isModalOpen,
      setModalState,
      handleDocumentClick,
      handleDocumentKeyDown,
      destroy: () => {}
    };
  }

  // mcq-controller.js
  var DEFAULT_MCQ_TIER = {
    name: 'Advanced',
    className: 'advanced-star',
    questionCount: 7,
    optionCount: 5,
    passRatio: 0.7,
    timeLimitSeconds: 0,
    questionIds: [],
    questionPrompts: []
  };
  function normalizeTierConfig(rawTier, index) {
    const tier = rawTier && typeof rawTier === 'object' ? rawTier : {};
    const normalizedName = String(tier.name || `Level ${index + 1}`);
    const normalizedClassName = String(tier.className || '');
    const normalizedQuestionCount = Math.max(1, Number(tier.questionCount) || 7);
    const normalizedOptionCount = Math.max(2, Number(tier.optionCount) || 5);
    const normalizedPassRatio = Math.min(1, Math.max(0.5, Number(tier.passRatio) || 0.7));
    const normalizedTimeLimitSeconds = Math.max(0, Number(tier.timeLimitSeconds) || 0);
    const normalizedQuestionIds = Array.isArray(tier.questionIds)
      ? tier.questionIds.filter(
          (questionId) => typeof questionId === 'string' && questionId.trim().length > 0
        )
      : [];
    const normalizedQuestionPrompts = Array.isArray(tier.questionPrompts)
      ? tier.questionPrompts.filter(
          (prompt) => typeof prompt === 'string' && prompt.trim().length > 0
        )
      : [];
    return {
      name: normalizedName,
      className: normalizedClassName,
      questionCount: normalizedQuestionCount,
      optionCount: normalizedOptionCount,
      passRatio: normalizedPassRatio,
      timeLimitSeconds: normalizedTimeLimitSeconds,
      questionIds: normalizedQuestionIds,
      questionPrompts: normalizedQuestionPrompts
    };
  }
  function normalizeProgressState(rawState, tierCount) {
    const safeTierCount = Math.max(1, Number(tierCount) || 1);
    const rawNextTierIndex = Number(rawState == null ? void 0 : rawState.nextTierIndex);
    const rawUnlockedTierIndex = Number(rawState == null ? void 0 : rawState.unlockedTierIndex);
    const nextTierIndex = Number.isFinite(rawNextTierIndex)
      ? Math.max(0, Math.min(safeTierCount, Math.floor(rawNextTierIndex)))
      : 0;
    const maxUnlockedForNext =
      nextTierIndex >= safeTierCount ? safeTierCount - 1 : Math.max(-1, nextTierIndex - 1);
    const unlockedTierIndex = Number.isFinite(rawUnlockedTierIndex)
      ? Math.min(
          maxUnlockedForNext,
          Math.max(-1, Math.min(safeTierCount - 1, Math.floor(rawUnlockedTierIndex)))
        )
      : -1;
    return {
      nextTierIndex,
      unlockedTierIndex
    };
  }
  function buildQuestionCatalog(questionBank2) {
    if (!Array.isArray(questionBank2)) {
      return [];
    }
    return questionBank2
      .map((sourceQuestion, index) => {
        if (!sourceQuestion || typeof sourceQuestion !== 'object') {
          return null;
        }
        const fallbackId = `q${String(index + 1).padStart(2, '0')}`;
        const id =
          typeof sourceQuestion.id === 'string' && sourceQuestion.id.trim().length > 0
            ? sourceQuestion.id
            : fallbackId;
        const prompt = typeof sourceQuestion.question === 'string' ? sourceQuestion.question : '';
        return {
          id,
          prompt,
          sourceQuestion
        };
      })
      .filter(Boolean);
  }
  function formatSeconds(totalSeconds) {
    const safeSeconds = Math.max(0, Number(totalSeconds) || 0);
    const minutes = Math.floor(safeSeconds / 60)
      .toString()
      .padStart(2, '0');
    const seconds = Math.floor(safeSeconds % 60)
      .toString()
      .padStart(2, '0');
    return `${minutes}:${seconds}`;
  }
  function createMcqController({
    state,
    stateMachine: stateMachine2,
    questionBank: questionBank2,
    buildMcqTest: buildMcqTest2,
    evaluateMcqSubmission: evaluateMcqSubmission2,
    generatePassCode: generatePassCode2,
    formatMcqResultText: formatMcqResultText2,
    setModalState,
    testModal: testModal2,
    triggerButton,
    testContainer: testContainer2,
    submitTestButton: submitTestButton2,
    saveResultButton: saveResultButton2,
    testResultDiv: testResultDiv2,
    testModalTitle: testModalTitle2,
    mcqTimer: mcqTimer2,
    mcqTierConfigs,
    initialProgressState,
    onProgressChange
  }) {
    const doc = testContainer2.ownerDocument || document;
    const tierConfigs =
      Array.isArray(mcqTierConfigs) && mcqTierConfigs.length > 0
        ? mcqTierConfigs.map((tier, index) => normalizeTierConfig(tier, index))
        : [DEFAULT_MCQ_TIER];
    const questionCatalog = buildQuestionCatalog(questionBank2);
    const normalizedInitialProgress = normalizeProgressState(
      initialProgressState,
      tierConfigs.length
    );
    let activeTierIndex = Math.min(normalizedInitialProgress.nextTierIndex, tierConfigs.length - 1);
    let unlockedTierIndex = normalizedInitialProgress.unlockedTierIndex;
    let nextTierIndex = normalizedInitialProgress.nextTierIndex;
    let mcqCountdownTimerId = null;
    let secondsRemaining = 0;
    function getQuestionsByIds(questionIds) {
      if (questionCatalog.length === 0) {
        return [];
      }
      const allowedIds = new Set(questionIds);
      return questionCatalog
        .filter((entry) => allowedIds.has(entry.id))
        .map((entry) => entry.sourceQuestion);
    }
    function getQuestionsByPrompts(questionPrompts) {
      if (questionCatalog.length === 0) {
        return [];
      }
      const allowedPrompts = new Set(questionPrompts);
      return questionCatalog
        .filter((entry) => allowedPrompts.has(entry.prompt))
        .map((entry) => entry.sourceQuestion);
    }
    function validateTierQuestionPools() {
      tierConfigs.forEach((tierConfig) => {
        const hasQuestionIds =
          Array.isArray(tierConfig.questionIds) && tierConfig.questionIds.length > 0;
        const hasQuestionPrompts =
          Array.isArray(tierConfig.questionPrompts) && tierConfig.questionPrompts.length > 0;
        if (!hasQuestionIds && !hasQuestionPrompts) {
          return;
        }
        const configuredPool = hasQuestionIds
          ? getQuestionsByIds(tierConfig.questionIds)
          : getQuestionsByPrompts(tierConfig.questionPrompts);
        if (configuredPool.length < tierConfig.questionCount) {
          throw new Error(
            `MCQ tier "${tierConfig.name}" has ${configuredPool.length} configured questions but requires at least ${tierConfig.questionCount}.`
          );
        }
      });
    }
    validateTierQuestionPools();
    function notifyProgressChange() {
      if (typeof onProgressChange === 'function') {
        onProgressChange(getLevelProgress());
      }
    }
    function resolveRequestedTierIndex(tierIndex) {
      const fallbackTierIndex = Math.min(nextTierIndex, tierConfigs.length - 1);
      const requestedTierIndex = typeof tierIndex === 'number' ? tierIndex : fallbackTierIndex;
      if (!Number.isInteger(requestedTierIndex)) {
        return null;
      }
      if (requestedTierIndex < 0 || requestedTierIndex >= tierConfigs.length) {
        return null;
      }
      if (requestedTierIndex > nextTierIndex) {
        return null;
      }
      return requestedTierIndex;
    }
    function getActiveTierConfig() {
      return tierConfigs[Math.min(activeTierIndex, tierConfigs.length - 1)] || DEFAULT_MCQ_TIER;
    }
    function clearMcqTimer() {
      if (mcqCountdownTimerId) {
        clearInterval(mcqCountdownTimerId);
        mcqCountdownTimerId = null;
      }
    }
    function updateTimerDisplay() {
      if (!mcqTimer2) {
        return;
      }
      const tierConfig = getActiveTierConfig();
      if (tierConfig.timeLimitSeconds <= 0 || state.mcq.lastResult) {
        mcqTimer2.hidden = true;
        mcqTimer2.textContent = '';
        mcqTimer2.classList.remove('is-warning');
        return;
      }
      mcqTimer2.hidden = false;
      mcqTimer2.textContent = `Time left: ${formatSeconds(secondsRemaining)}`;
      mcqTimer2.classList.toggle('is-warning', secondsRemaining <= 15);
    }
    function startMcqTimer() {
      clearMcqTimer();
      const tierConfig = getActiveTierConfig();
      secondsRemaining = Math.max(0, Number(tierConfig.timeLimitSeconds) || 0);
      updateTimerDisplay();
      if (secondsRemaining <= 0) {
        return;
      }
      mcqCountdownTimerId = setInterval(() => {
        secondsRemaining -= 1;
        updateTimerDisplay();
        if (secondsRemaining > 0) {
          return;
        }
        clearMcqTimer();
        handleSubmitTest({ autoSubmitted: true });
      }, 1e3);
    }
    function applyTierUiState() {
      if (!testModalTitle2) {
        return;
      }
      const tierConfig = getActiveTierConfig();
      testModalTitle2.textContent = `MCQ Test - ${tierConfig.name}`;
    }
    function openTestModal({ beforeOpen, tierIndex } = {}) {
      if (typeof beforeOpen === 'function') {
        beforeOpen();
      }
      if (!stateMachine2.beginMcqSession()) {
        return false;
      }
      const requestedTierIndex = resolveRequestedTierIndex(tierIndex);
      if (requestedTierIndex === null) {
        stateMachine2.endMcqSession();
        return false;
      }
      activeTierIndex = requestedTierIndex;
      testResultDiv2.textContent = '';
      submitTestButton2.hidden = false;
      submitTestButton2.disabled = false;
      saveResultButton2.hidden = true;
      applyTierUiState();
      generateTest();
      startMcqTimer();
      notifyProgressChange();
      setModalState(testModal2, true, triggerButton);
      return true;
    }
    function closeTestModal() {
      stateMachine2.endMcqSession();
      clearMcqTimer();
      setModalState(testModal2, false, null);
      testContainer2.innerHTML = '';
      updateTimerDisplay();
    }
    function generateTest() {
      const tierConfig = getActiveTierConfig();
      const sourceQuestionPool = getQuestionPoolForTier(tierConfig);
      state.mcq.selectedQuestions = buildMcqTest2(
        sourceQuestionPool,
        tierConfig.questionCount,
        Math.random,
        tierConfig.optionCount
      );
      renderQuestions();
    }
    function getQuestionPoolForTier(tierConfig) {
      if (!Array.isArray(questionBank2) || questionBank2.length === 0) {
        return [];
      }
      if (Array.isArray(tierConfig.questionIds) && tierConfig.questionIds.length > 0) {
        return getQuestionsByIds(tierConfig.questionIds);
      }
      if (!Array.isArray(tierConfig.questionPrompts) || tierConfig.questionPrompts.length === 0) {
        return questionBank2;
      }
      return getQuestionsByPrompts(tierConfig.questionPrompts);
    }
    function renderQuestions() {
      testContainer2.innerHTML = '';
      state.mcq.selectedQuestions.forEach((question, index) => {
        const questionFieldset = doc.createElement('fieldset');
        questionFieldset.className = 'question';
        const prompt = doc.createElement('legend');
        prompt.textContent = `${index + 1}. ${question.prompt}`;
        questionFieldset.appendChild(prompt);
        const optionsDiv = doc.createElement('div');
        optionsDiv.className = 'options';
        question.choices.forEach((choice, choiceIndex) => {
          const label = doc.createElement('label');
          const radio = doc.createElement('input');
          const optionPrefix = String.fromCharCode(65 + choiceIndex);
          const optionText = doc.createElement('span');
          radio.type = 'radio';
          radio.name = `question${index}`;
          radio.value = choice.id;
          label.appendChild(radio);
          optionText.textContent = ` ${optionPrefix}) ${choice.text}`;
          label.appendChild(optionText);
          optionsDiv.appendChild(label);
        });
        questionFieldset.appendChild(optionsDiv);
        testContainer2.appendChild(questionFieldset);
      });
    }
    function calculateTierProgression({ passed, score, maxScore, passThreshold }) {
      let starLine = '';
      let progressionChanged = false;
      if (passed && activeTierIndex === nextTierIndex && nextTierIndex < tierConfigs.length) {
        unlockedTierIndex = Math.max(unlockedTierIndex, nextTierIndex);
        starLine = `Unlocked ${tierConfigs[nextTierIndex].name} star.`;
        nextTierIndex += 1;
        progressionChanged = true;
      } else if (nextTierIndex >= tierConfigs.length) {
        unlockedTierIndex = tierConfigs.length - 1;
        starLine = 'All MCQ levels already unlocked.';
      } else {
        const nextTier = tierConfigs[Math.min(nextTierIndex, tierConfigs.length - 1)];
        starLine = `Need ${passThreshold}/${maxScore} to unlock ${nextTier.name}.`;
      }
      if (!passed) {
        starLine = `Scored ${score}/${maxScore}. ${starLine}`;
      }
      if (progressionChanged) {
        notifyProgressChange();
      }
      return { starLine };
    }
    function renderUnlockedTierStars() {
      const unlockedTiers = tierConfigs.slice(0, unlockedTierIndex + 1);
      return unlockedTiers
        .map((tier) => {
          return `<span class="${tier.className}" aria-label="${tier.name} star">&#9733; ${tier.name}</span>`;
        })
        .join(' ');
    }
    function handleSubmitTest({ autoSubmitted = false } = {}) {
      if (state.mcq.selectedQuestions.length === 0 || state.mcq.lastResult) {
        return;
      }
      const selectedChoiceIds = state.mcq.selectedQuestions.map((_, index) => {
        const chosen = testContainer2.querySelector(`input[name="question${index}"]:checked`);
        return chosen ? chosen.value : null;
      });
      const tierConfig = getActiveTierConfig();
      const evaluation = evaluateMcqSubmission2(
        state.mcq.selectedQuestions,
        selectedChoiceIds,
        tierConfig.passRatio
      );
      evaluation.details.forEach((detail) => {
        if (detail.selectedChoiceId && !detail.isCorrect) {
          const selectedRadio = testContainer2.querySelector(
            `input[name="question${detail.index}"][value="${detail.selectedChoiceId}"]`
          );
          if (selectedRadio) {
            selectedRadio.parentElement.classList.add('wrong-answer-label');
          }
        }
        const correctRadio = testContainer2.querySelector(
          `input[name="question${detail.index}"][value="${detail.correctChoiceId}"]`
        );
        if (correctRadio) {
          correctRadio.parentElement.classList.add('correct-answer-label');
        }
      });
      const allRadios = testContainer2.querySelectorAll('input[type="radio"]');
      allRadios.forEach((radio) => {
        radio.disabled = true;
      });
      clearMcqTimer();
      state.mcq.lastResult = {
        ...evaluation,
        passCode: evaluation.passed ? generatePassCode2(8) : null,
        completedAt: /* @__PURE__ */ new Date().toISOString(),
        tierName: tierConfig.name,
        tierIndex: activeTierIndex,
        timed: tierConfig.timeLimitSeconds > 0,
        timedOut: autoSubmitted
      };
      const progression = calculateTierProgression({
        passed: evaluation.passed,
        score: evaluation.score,
        maxScore: evaluation.maxScore,
        passThreshold: evaluation.passThreshold
      });
      submitTestButton2.hidden = true;
      showTestResult(state.mcq.lastResult, progression.starLine);
      saveResultButton2.hidden = false;
      updateTimerDisplay();
    }
    function handleSaveResult() {
      if (!state.mcq.lastResult) {
        return;
      }
      const content = formatMcqResultText2(state.mcq.lastResult);
      const blob = new Blob([content], { type: 'text/plain' });
      const url = URL.createObjectURL(blob);
      const a = doc.createElement('a');
      a.href = url;
      a.download = getResultFilename(state.mcq.lastResult.completedAt);
      doc.body.appendChild(a);
      a.click();
      doc.body.removeChild(a);
      URL.revokeObjectURL(url);
    }
    function showTestResult(result, starLine) {
      const unlockedStarsMarkup = renderUnlockedTierStars();
      let resultText = `Level ${result.tierIndex + 1} (${result.tierName}): ${result.score}/${result.maxScore}. `;
      if (result.passed) {
        resultText += 'Pass. ';
        if (result.passCode) {
          resultText += `Code: ${result.passCode}. `;
        }
      } else {
        resultText += 'Fail. ';
      }
      if (result.timed && result.timedOut) {
        resultText += 'Time expired. ';
      }
      resultText += starLine;
      if (unlockedStarsMarkup) {
        resultText += `<br>${unlockedStarsMarkup}`;
      }
      testResultDiv2.innerHTML = resultText;
    }
    function getResultFilename(completedAtIsoString) {
      const timestamp = completedAtIsoString
        ? completedAtIsoString.replace(/[:-]/g, '').replace(/\.\d{3}Z$/, 'Z')
        : 'unknown';
      return `mcq_result_${timestamp}.txt`;
    }
    function getLevelProgress() {
      return tierConfigs.map((tier, index) => ({
        index,
        name: tier.name,
        unlocked: index <= nextTierIndex,
        completed: index <= unlockedTierIndex,
        active: index === Math.min(nextTierIndex, tierConfigs.length - 1)
      }));
    }
    function getProgressState() {
      return {
        nextTierIndex,
        unlockedTierIndex
      };
    }
    return {
      openTestModal,
      closeTestModal,
      handleSubmitTest,
      handleSaveResult,
      getLevelProgress,
      getProgressState,
      destroy: () => {
        clearMcqTimer();
        stateMachine2.endMcqSession();
        testContainer2.innerHTML = '';
        testResultDiv2.textContent = '';
        updateTimerDisplay();
        unlockedTierIndex = -1;
        nextTierIndex = 0;
        activeTierIndex = 0;
        notifyProgressChange();
      }
    };
  }

  // timed-test.js
  var PASS_RATIO = 0.75;
  var ROUNDS_PER_SET = 4;
  var STAR_TIERS = Object.freeze([
    { name: 'Primary', className: 'primary-star' },
    { name: 'Intermediate', className: 'intermediate-star' },
    { name: 'Advanced', className: 'advanced-star' }
  ]);
  var DEFAULT_ROUND_SECONDS = 5;
  var TIMED_SAFE_FOV_DEGREES = Object.freeze({
    undilated: 8,
    dilated: 15
  });
  var TIMED_TEST_MAX_CATARACT_LEVEL = 1;
  var DEFAULT_ROUND_PROFILE = Object.freeze({
    seconds: DEFAULT_ROUND_SECONDS,
    isDilated: false,
    fovDegrees: TIMED_SAFE_FOV_DEGREES.undilated,
    cataractLevel: 0
  });
  var TIMED_AUGMENTATION_PROFILES = Object.freeze([
    {
      rotateMaxDegrees: 2.4,
      rotateMinDegrees: 0.9,
      scaleMin: 0.94,
      scaleMax: 1.07,
      minScaleDelta: 0.02,
      panMaxRatio: 0.025,
      panMinRatio: 8e-3,
      brightnessJitter: 0.035,
      brightnessMinJitter: 0.015,
      contrastJitter: 0.035,
      contrastMinJitter: 0.015,
      saturationJitter: 0.03,
      saturationMinJitter: 0.01,
      verticalFlipChance: 0.18
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
      saturationMinJitter: 0.025,
      verticalFlipChance: 0.28
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
      saturationMinJitter: 0.03,
      verticalFlipChance: 0.38
    }
  ]);
  var TIMED_MOTION_PROFILES = Object.freeze([
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
  function randomInRange(min, max) {
    return min + Math.random() * (max - min);
  }
  function randomSignedWithMinimum(maxAbs, minAbs) {
    const safeMax = Math.max(0, Number(maxAbs) || 0);
    const safeMin = Math.max(0, Math.min(safeMax, Number(minAbs) || 0));
    if (safeMax === 0) {
      return 0;
    }
    const magnitude = randomInRange(safeMin, safeMax);
    return Math.random() >= 0.5 ? magnitude : -magnitude;
  }
  function randomScaleWithMinimumDelta(minScale, maxScale, minDelta) {
    const lower = Math.min(Number(minScale) || 1, Number(maxScale) || 1);
    const upper = Math.max(Number(minScale) || 1, Number(maxScale) || 1);
    const requiredDelta = Math.max(0, Number(minDelta) || 0);
    if (lower === upper) {
      return lower;
    }
    for (let attempt = 0; attempt < 10; attempt += 1) {
      const candidate = randomInRange(lower, upper);
      if (Math.abs(candidate - 1) >= requiredDelta) {
        return candidate;
      }
    }
    return Math.abs(lower - 1) >= Math.abs(upper - 1) ? lower : upper;
  }
  function randomToneValue(maxJitter, minJitter) {
    return 1 + randomSignedWithMinimum(maxJitter, minJitter);
  }
  function clampTimedCataractLevel(level) {
    const numericLevel = Number(level);
    const roundedLevel = Number.isFinite(numericLevel)
      ? Math.round(numericLevel)
      : DEFAULT_ROUND_PROFILE.cataractLevel;
    return Math.max(0, Math.min(TIMED_TEST_MAX_CATARACT_LEVEL, roundedLevel));
  }
  function normalizeProgressState2(rawState, tierCount) {
    const safeTierCount = Math.max(1, Number(tierCount) || 1);
    const rawNextTierIndex = Number(rawState == null ? void 0 : rawState.nextTierIndex);
    const rawUnlockedTierIndex = Number(rawState == null ? void 0 : rawState.unlockedTierIndex);
    const next = Number.isFinite(rawNextTierIndex)
      ? Math.max(0, Math.min(safeTierCount, Math.floor(rawNextTierIndex)))
      : 0;
    const maxUnlockedForNext = next >= safeTierCount ? safeTierCount - 1 : Math.max(-1, next - 1);
    const unlocked = Number.isFinite(rawUnlockedTierIndex)
      ? Math.min(
          maxUnlockedForNext,
          Math.max(-1, Math.min(safeTierCount - 1, Math.floor(rawUnlockedTierIndex)))
        )
      : -1;
    return {
      nextTierIndex: next,
      unlockedTierIndex: unlocked
    };
  }
  function createTimedTestController({
    state,
    stateMachine: stateMachine2,
    timedImages,
    timedRoundsPerCategory,
    timedTotalRounds,
    timedRoundProfiles,
    initialProgressState,
    onProgressChange,
    closeTestModal,
    setModalState,
    infoModal: infoModal2,
    infoIcon: infoIcon2,
    explanationDiv: explanationDiv2,
    timedGuessBox: timedGuessBox2,
    timedMessage: timedMessage2,
    timedCountdown: timedCountdown2,
    submitTimedGuessButton: submitTimedGuessButton2,
    timedTestResult: timedTestResult2,
    viewer: viewer2
  }) {
    const guessQuery = 'input[name="timedGuess"]';
    const roundProfiles = Array.isArray(timedRoundProfiles) ? timedRoundProfiles : [];
    const totalRounds = Math.max(1, Number(timedTotalRounds) || ROUNDS_PER_SET);
    const roundsPerCategory = Math.max(1, Number(timedRoundsPerCategory) || 1);
    const normalizedInitialProgress = normalizeProgressState2(
      initialProgressState,
      STAR_TIERS.length
    );
    let viewerStateBeforeTimed = null;
    let timedRoundQueue = [];
    let timedRoundEyes = [];
    let unlockedTierIndex = normalizedInitialProgress.unlockedTierIndex;
    let nextTierIndex = normalizedInitialProgress.nextTierIndex;
    let activeTierIndex = Math.min(normalizedInitialProgress.nextTierIndex, STAR_TIERS.length - 1);
    let revealIsActive = false;
    let timedSetFlipApplied = false;
    const timedGuessListenerDisposers = [];
    function notifyProgressChange() {
      if (typeof onProgressChange === 'function') {
        onProgressChange(getLevelProgress());
      }
    }
    function startTimedTest({ tierIndex } = {}) {
      if (!stateMachine2.beginTimedSession()) {
        return false;
      }
      closeTestModal();
      setModalState(infoModal2, false, infoIcon2);
      clearTimedTimers();
      clearTimedGuessSelections();
      if (typeof viewer2.clearTimedAugmentation === 'function') {
        viewer2.clearTimedAugmentation();
      }
      if (typeof viewer2.clearTimedMotionProfile === 'function') {
        viewer2.clearTimedMotionProfile();
      }
      viewerStateBeforeTimed = {
        fovDegrees: typeof viewer2.getFovDegrees === 'function' ? viewer2.getFovDegrees() : null,
        isDilated: typeof viewer2.getIsDilated === 'function' ? viewer2.getIsDilated() : false,
        cataractLevel:
          typeof viewer2.getCataractLevel === 'function' ? viewer2.getCataractLevel() : 0,
        isRightEye: typeof viewer2.getIsRightEye === 'function' ? viewer2.getIsRightEye() : true
      };
      const requestedTierIndex = resolveRequestedTierIndex(tierIndex);
      if (requestedTierIndex === null) {
        stateMachine2.endTimedSession();
        return false;
      }
      timedRoundQueue = buildTimedRoundQueue(timedImages, roundsPerCategory, totalRounds);
      timedRoundEyes = buildTimedEyeSequence(timedRoundQueue.length || totalRounds);
      activeTierIndex = requestedTierIndex;
      revealIsActive = false;
      timedSetFlipApplied = false;
      viewer2.setDiscVisible(true);
      timedTestResult2.innerHTML = '';
      timedMessage2.textContent = '';
      timedCountdown2.textContent = '';
      timedGuessBox2.hidden = false;
      explanationDiv2.hidden = true;
      viewer2.setViewerControlsDisabled(true);
      disableTimedGuess(true);
      notifyProgressChange();
      nextTimedRound();
      return true;
    }
    function nextTimedRound() {
      state.timed.round += 1;
      const activeTotalRounds = getTotalRounds();
      if (state.timed.round > activeTotalRounds) {
        finishTimedTest();
        return;
      }
      const roundProfile = getRoundProfile();
      const roundEye = timedRoundEyes[state.timed.round - 1];
      applyRoundProfile(roundProfile, roundEye);
      const roundSeconds = Math.max(1, Number(roundProfile.seconds) || DEFAULT_ROUND_SECONDS);
      const pick =
        timedRoundQueue[state.timed.round - 1] ||
        timedImages[Math.floor(Math.random() * timedImages.length)];
      state.timed.currentLabel = pick.label;
      if (typeof viewer2.setTimedAugmentation === 'function') {
        viewer2.setTimedAugmentation(
          buildTimedRoundAugmentation(activeTierIndex, state.timed.round - 1, activeTotalRounds)
        );
      }
      if (typeof viewer2.setTimedMotionProfile === 'function') {
        viewer2.setTimedMotionProfile(buildTimedRoundMotionProfile(activeTierIndex));
      }
      viewer2.setDiscVisible(true);
      viewer2.setImageSource(pick.src);
      if (typeof viewer2.doGazeShift === 'function' && !state.viewer.shiftInProgress) {
        viewer2.doGazeShift();
      }
      timedMessage2.textContent = `Round ${state.timed.round}/${activeTotalRounds}`;
      timedCountdown2.textContent = String(roundSeconds);
      revealIsActive = true;
      disableTimedGuess(false);
      let remain = roundSeconds;
      const countdownId = setInterval(() => {
        remain -= 1;
        timedCountdown2.textContent = String(remain);
        if (remain <= 0) {
          clearCountdownTimer();
          viewer2.setDiscVisible(false);
          revealIsActive = false;
          timedMessage2.textContent = 'Which disc was shown?';
          timedCountdown2.textContent = '';
        }
      }, 1e3);
      stateMachine2.setTimedCountdownTimer(countdownId);
    }
    function submitTimedGuess() {
      if (!state.timed.isActive) {
        return;
      }
      const guess = getSelectedTimedGuess();
      if (!guess) {
        timedMessage2.textContent = 'Select an answer before submitting.';
        syncSubmitGuessAvailability();
        return;
      }
      if (revealIsActive) {
        clearCountdownTimer();
        viewer2.setDiscVisible(false);
        revealIsActive = false;
        timedCountdown2.textContent = '';
      }
      const isCorrect = guess.value === state.timed.currentLabel;
      if (isCorrect) {
        state.timed.score += 1;
        guess.parentElement.classList.add('correct-answer-label');
      } else {
        guess.parentElement.classList.add('wrong-answer-label');
        const correctRadio = timedGuessBox2.querySelector(
          `input[name="timedGuess"][value="${state.timed.currentLabel}"]`
        );
        if (correctRadio) {
          correctRadio.parentElement.classList.add('correct-answer-label');
        }
      }
      disableTimedGuess(true);
      const feedbackId = setTimeout(() => {
        clearTimedGuessSelections();
        nextTimedRound();
      }, 1200);
      stateMachine2.setTimedFeedbackTimer(feedbackId);
    }
    function finishTimedTest() {
      clearTimedTimers();
      clearTimedGuessSelections();
      disableTimedGuess(true);
      timedGuessBox2.hidden = true;
      revealIsActive = false;
      const resultSummary = buildTimedResultSummary(
        state.timed.score,
        getTotalRounds(),
        activeTierIndex
      );
      timedTestResult2.innerHTML = resultSummary.html;
      if (!stateMachine2.endTimedSession()) {
        return;
      }
      restoreStandardView({ clearResult: false });
    }
    function exitTimedMode() {
      if (!stateMachine2.endTimedSession()) {
        return;
      }
      restoreStandardView({ clearResult: true });
    }
    function restoreStandardView({ clearResult }) {
      viewer2.setDiscVisible(true);
      clearTimedTimers();
      clearTimedGuessSelections();
      disableTimedGuess(true);
      timedGuessBox2.hidden = true;
      explanationDiv2.hidden = false;
      timedMessage2.textContent = '';
      timedCountdown2.textContent = '';
      revealIsActive = false;
      if (clearResult) {
        timedTestResult2.innerHTML = '';
      }
      restoreViewerStateAfterTimed();
      viewer2.setViewerControlsDisabled(false);
      viewer2.setImageSource(viewer2.getActiveConditionImagePath());
    }
    function resolveRequestedTierIndex(tierIndex) {
      const fallbackTierIndex = Math.min(nextTierIndex, STAR_TIERS.length - 1);
      const requestedTierIndex = typeof tierIndex === 'number' ? tierIndex : fallbackTierIndex;
      if (!Number.isInteger(requestedTierIndex)) {
        return null;
      }
      if (requestedTierIndex < 0 || requestedTierIndex >= STAR_TIERS.length) {
        return null;
      }
      if (requestedTierIndex > nextTierIndex) {
        return null;
      }
      return requestedTierIndex;
    }
    function getRoundProfile() {
      if (roundProfiles.length === 0) {
        return DEFAULT_ROUND_PROFILE;
      }
      const profileIndex = Math.min(activeTierIndex, roundProfiles.length - 1);
      const profile = roundProfiles[profileIndex];
      if (!profile || typeof profile !== 'object') {
        return DEFAULT_ROUND_PROFILE;
      }
      const isDilated = Boolean(profile.isDilated);
      return {
        seconds: Number(profile.seconds) || DEFAULT_ROUND_PROFILE.seconds,
        isDilated,
        fovDegrees: isDilated ? TIMED_SAFE_FOV_DEGREES.dilated : TIMED_SAFE_FOV_DEGREES.undilated,
        cataractLevel: clampTimedCataractLevel(profile.cataractLevel)
      };
    }
    function getTotalRounds() {
      return timedRoundQueue.length > 0 ? timedRoundQueue.length : totalRounds;
    }
    function buildTimedRoundAugmentation(tierIndex, roundIndex, setTotalRounds) {
      const profileIndex = Math.max(
        0,
        Math.min(
          Number.isInteger(tierIndex) ? tierIndex : 0,
          TIMED_AUGMENTATION_PROFILES.length - 1
        )
      );
      const profile = TIMED_AUGMENTATION_PROFILES[profileIndex];
      const verticalFlipChance = Math.max(0, Math.min(1, Number(profile.verticalFlipChance) || 0));
      const safeTotalRounds = Math.max(1, Number(setTotalRounds) || 1);
      const safeRoundIndex = Math.max(
        0,
        Math.min(safeTotalRounds - 1, Number.isFinite(Number(roundIndex)) ? Number(roundIndex) : 0)
      );
      let flipVertical = Math.random() < verticalFlipChance;
      if (!timedSetFlipApplied && safeRoundIndex >= safeTotalRounds - 1) {
        flipVertical = true;
      }
      if (flipVertical) {
        timedSetFlipApplied = true;
      }
      return {
        rotateDegrees: randomSignedWithMinimum(
          profile.rotateMaxDegrees,
          profile.rotateMinDegrees || 0
        ),
        scale: randomScaleWithMinimumDelta(
          profile.scaleMin,
          profile.scaleMax,
          profile.minScaleDelta || 0
        ),
        panXRatio: randomSignedWithMinimum(profile.panMaxRatio, profile.panMinRatio || 0),
        panYRatio: randomSignedWithMinimum(profile.panMaxRatio, profile.panMinRatio || 0),
        brightness: randomToneValue(profile.brightnessJitter, profile.brightnessMinJitter || 0),
        contrast: randomToneValue(profile.contrastJitter, profile.contrastMinJitter || 0),
        saturation: randomToneValue(profile.saturationJitter, profile.saturationMinJitter || 0),
        flipVertical
      };
    }
    function buildTimedRoundMotionProfile(tierIndex) {
      const profileIndex = Math.max(
        0,
        Math.min(Number.isInteger(tierIndex) ? tierIndex : 0, TIMED_MOTION_PROFILES.length - 1)
      );
      const profile = TIMED_MOTION_PROFILES[profileIndex];
      return {
        jitterMultiplier: randomInRange(profile.jitterMultiplierMin, profile.jitterMultiplierMax),
        shiftDistanceMultiplier: randomInRange(profile.shiftDistanceMin, profile.shiftDistanceMax),
        shiftDurationMs: Math.round(
          randomInRange(profile.shiftDurationMinMs, profile.shiftDurationMaxMs)
        )
      };
    }
    function buildTimedRoundQueue(images, perCategory, targetRounds) {
      if (!Array.isArray(images) || images.length === 0) {
        return [];
      }
      const desiredCount = Math.max(1, Number(targetRounds) || ROUNDS_PER_SET);
      const inventory = images.map((image) => ({
        image,
        remaining: Math.max(1, Number(perCategory) || 1)
      }));
      const queue = [];
      let previousLabel = null;
      while (queue.length < desiredCount) {
        let candidates = inventory.filter(
          (entry) => entry.remaining > 0 && entry.image.label !== previousLabel
        );
        if (candidates.length === 0) {
          candidates = inventory.filter((entry) => entry.remaining > 0);
        }
        if (candidates.length === 0) {
          inventory.forEach((entry) => {
            entry.remaining = Math.max(1, Number(perCategory) || 1);
          });
          candidates = inventory.filter(
            (entry) => entry.remaining > 0 && entry.image.label !== previousLabel
          );
          if (candidates.length === 0) {
            candidates = inventory.filter((entry) => entry.remaining > 0);
          }
        }
        const pick = candidates[Math.floor(Math.random() * candidates.length)];
        queue.push(pick.image);
        pick.remaining -= 1;
        previousLabel = pick.image.label;
      }
      return queue;
    }
    function buildTimedEyeSequence(targetRounds) {
      const desiredCount = Math.max(1, Number(targetRounds) || ROUNDS_PER_SET);
      const startingEye =
        typeof viewer2.getIsRightEye === 'function'
          ? !viewer2.getIsRightEye()
          : Math.random() >= 0.5;
      const sequence = [];
      let nextIsRightEye = startingEye;
      for (let round = 0; round < desiredCount; round += 1) {
        sequence.push(nextIsRightEye);
        nextIsRightEye = !nextIsRightEye;
      }
      return sequence;
    }
    function applyRoundProfile(roundProfile, isRightEye) {
      applyViewerFovState(roundProfile);
      if (typeof viewer2.setCataractLevel === 'function') {
        viewer2.setCataractLevel(clampTimedCataractLevel(roundProfile.cataractLevel));
      }
      if (typeof isRightEye === 'boolean' && typeof viewer2.setRightEye === 'function') {
        viewer2.setRightEye(isRightEye);
      }
    }
    function restoreViewerStateAfterTimed() {
      if (typeof viewer2.clearTimedAugmentation === 'function') {
        viewer2.clearTimedAugmentation();
      }
      if (typeof viewer2.clearTimedMotionProfile === 'function') {
        viewer2.clearTimedMotionProfile();
      }
      if (!viewerStateBeforeTimed) {
        return;
      }
      applyViewerFovState(viewerStateBeforeTimed);
      if (typeof viewer2.setCataractLevel === 'function') {
        viewer2.setCataractLevel(viewerStateBeforeTimed.cataractLevel);
      }
      if (typeof viewer2.setRightEye === 'function') {
        viewer2.setRightEye(viewerStateBeforeTimed.isRightEye);
      }
      viewerStateBeforeTimed = null;
    }
    function buildTimedResultSummary(score, total, tierIndex) {
      const ratio = total > 0 ? score / total : 0;
      const passThreshold = Math.ceil(total * PASS_RATIO);
      const passedSet = score >= passThreshold;
      let guidance = 'Revise vessel obscuration and disc margin blur, then retry.';
      if (ratio === 1) {
        guidance = 'Excellent recognition. Keep this speed and consistency.';
      } else if (ratio >= PASS_RATIO) {
        guidance = 'Strong result. One more round should lock this in.';
      } else if (ratio >= 0.5) {
        guidance = 'Good start. Focus on swollen vs suspicious differences.';
      }
      const activeTier = STAR_TIERS[Math.min(tierIndex, STAR_TIERS.length - 1)];
      let starLine = '';
      let progressionChanged = false;
      if (passedSet && tierIndex === nextTierIndex && nextTierIndex < STAR_TIERS.length) {
        unlockedTierIndex = Math.max(unlockedTierIndex, nextTierIndex);
        starLine = `Unlocked ${STAR_TIERS[nextTierIndex].name} star.`;
        nextTierIndex += 1;
        progressionChanged = true;
      } else if (nextTierIndex >= STAR_TIERS.length) {
        unlockedTierIndex = STAR_TIERS.length - 1;
        starLine = 'All star tiers already unlocked.';
      } else {
        const nextTier = STAR_TIERS[Math.min(nextTierIndex, STAR_TIERS.length - 1)];
        starLine = `Need ${passThreshold}/${total} to unlock ${nextTier.name} star.`;
      }
      const unlockedTiers = STAR_TIERS.slice(0, unlockedTierIndex + 1);
      const starsMarkup = unlockedTiers
        .map(
          (tier) =>
            `<span class="${tier.className}" aria-label="${tier.name} star">&#9733; ${tier.name}</span>`
        )
        .join(' ');
      if (progressionChanged) {
        notifyProgressChange();
      }
      return {
        html: `Set ${Math.min(tierIndex + 1, STAR_TIERS.length)}/${STAR_TIERS.length} (${activeTier.name}): ${score}/${total}. ${guidance}<br>${starLine}${starsMarkup ? ` ${starsMarkup}` : ''}`
      };
    }
    function getLevelProgress() {
      return STAR_TIERS.map((tier, index) => ({
        index,
        name: tier.name,
        unlocked: index <= nextTierIndex,
        completed: index <= unlockedTierIndex,
        active: index === Math.min(nextTierIndex, STAR_TIERS.length - 1)
      }));
    }
    function getProgressState() {
      return {
        nextTierIndex,
        unlockedTierIndex
      };
    }
    function applyViewerFovState(viewerProfile) {
      const isDilated = Boolean(viewerProfile == null ? void 0 : viewerProfile.isDilated);
      const fovDegrees = Number(viewerProfile == null ? void 0 : viewerProfile.fovDegrees);
      if (typeof viewer2.setFovDegrees === 'function') {
        const fallbackFov = isDilated
          ? TIMED_SAFE_FOV_DEGREES.dilated
          : TIMED_SAFE_FOV_DEGREES.undilated;
        viewer2.setFovDegrees(Number.isFinite(fovDegrees) ? fovDegrees : fallbackFov);
        return;
      }
      if (typeof viewer2.setDilated === 'function') {
        viewer2.setDilated(isDilated);
        return;
      }
      if (!isDilated && typeof viewer2.ensureUndilated === 'function') {
        viewer2.ensureUndilated();
      }
    }
    function clearCountdownTimer() {
      if (state.timed.countdownTimer) {
        clearInterval(state.timed.countdownTimer);
        stateMachine2.setTimedCountdownTimer(null);
      }
    }
    function clearTimedTimers() {
      clearCountdownTimer();
      if (state.timed.feedbackTimer) {
        clearTimeout(state.timed.feedbackTimer);
        stateMachine2.setTimedFeedbackTimer(null);
      }
    }
    function disableTimedGuess(disable) {
      timedGuessBox2.querySelectorAll(guessQuery).forEach((radio) => {
        radio.disabled = disable;
      });
      if (disable) {
        submitTimedGuessButton2.disabled = true;
        return;
      }
      syncSubmitGuessAvailability();
    }
    function getSelectedTimedGuess() {
      return timedGuessBox2.querySelector(`${guessQuery}:checked`);
    }
    function syncSubmitGuessAvailability() {
      const radios = timedGuessBox2.querySelectorAll(guessQuery);
      const hasEnabledOptions = Array.from(radios).some((radio) => !radio.disabled);
      if (!hasEnabledOptions) {
        submitTimedGuessButton2.disabled = true;
        return;
      }
      submitTimedGuessButton2.disabled = getSelectedTimedGuess() === null;
    }
    timedGuessBox2.querySelectorAll(guessQuery).forEach((radio) => {
      if (typeof radio.addEventListener === 'function') {
        radio.addEventListener('change', syncSubmitGuessAvailability);
        timedGuessListenerDisposers.push(() => {
          if (typeof radio.removeEventListener === 'function') {
            radio.removeEventListener('change', syncSubmitGuessAvailability);
          }
        });
      }
    });
    function clearTimedGuessSelections() {
      timedGuessBox2.querySelectorAll(guessQuery).forEach((radio) => {
        radio.checked = false;
        radio.parentElement.classList.remove('correct-answer-label', 'wrong-answer-label');
      });
      syncSubmitGuessAvailability();
    }
    return {
      startTimedTest,
      submitTimedGuess,
      exitTimedMode,
      getLevelProgress,
      getProgressState,
      destroy: () => {
        timedGuessListenerDisposers.splice(0).forEach((dispose) => {
          dispose();
        });
        stateMachine2.endTimedSession();
        restoreStandardView({ clearResult: true });
        timedRoundQueue = [];
        timedRoundEyes = [];
        unlockedTierIndex = -1;
        nextTierIndex = 0;
        activeTierIndex = 0;
        revealIsActive = false;
        timedSetFlipApplied = false;
        state.timed.round = 0;
        state.timed.score = 0;
        state.timed.currentLabel = '';
        notifyProgressChange();
      }
    };
  }

  // script.js
  var canvas = document.getElementById('fundusCanvas');
  var fovToggleCheckbox = document.getElementById('fovToggle');
  var fovLabelSmall = document.getElementById('fovLabelSmall');
  var fovLabelLeft = document.getElementById('fovLabelLeft');
  var fovLabelRight = document.getElementById('fovLabelRight');
  var eyeToggleCheckbox = document.getElementById('eyeToggle');
  var eyeLabelRight = document.getElementById('eyeLabelRight');
  var eyeLabelLeft = document.getElementById('eyeLabelLeft');
  var cataractSlider = document.getElementById('cataractSlider');
  var cataractStops = document.querySelectorAll('.cataract-stop');
  var viewSummary = document.getElementById('viewSummary');
  var phonePreviewControl = document.getElementById('phonePreviewControl');
  var phoneViewToggleCheckbox = document.getElementById('phoneViewToggle');
  var explanation = document.querySelector('.explanation');
  var conditionButtons = document.querySelectorAll('.condition-button');
  var burgerIcon = document.getElementById('burger-icon');
  var sideMenu = document.getElementById('sideMenu');
  var sideMenuButtons = sideMenu.querySelectorAll('button');
  var infoIcon = document.getElementById('info-icon');
  var infoModal = document.getElementById('infoModal');
  var closeInfoModalButton = document.getElementById('closeInfoModal');
  var testModal = document.getElementById('testModal');
  var testModalTitle = document.getElementById('testModalTitle');
  var mcqTimer = document.getElementById('mcqTimer');
  var closeTestModalButton = document.getElementById('closeTestModal');
  var testContainer = document.getElementById('testContainer');
  var submitTestButton = document.getElementById('submitTestButton');
  var saveResultButton = document.getElementById('saveResultButton');
  var testResultDiv = document.getElementById('testResult');
  var explanationDiv = document.querySelector('.explanation');
  var mcqLevelButtons = sideMenu.querySelectorAll('.mcq-level-button');
  var timedLevelButtons = sideMenu.querySelectorAll('.timed-level-button');
  var cupAchievement = document.getElementById('cupAchievement');
  var cupAchievementLabel = document.getElementById('cupAchievementLabel');
  var cupAchievementCode = document.getElementById('cupAchievementCode');
  var downloadCupCertificateButton = document.getElementById('downloadCupCertificateButton');
  var timedGuessBox = document.getElementById('timedGuessBox');
  var timedMessage = document.getElementById('timedMessage');
  var timedCountdown = document.getElementById('timedCountdown');
  var submitTimedGuessButton = document.getElementById('submitTimedGuessButton');
  var timedTestResult = document.getElementById('timedTestResult');
  var CUP_ACHIEVEMENT_STORAGE_KEY = 'swollen_discs_cup_achievement_v1';
  var MCQ_LEVEL_PROGRESS_STORAGE_KEY = 'swollen_discs_mcq_progress_v1';
  var TIMED_LEVEL_PROGRESS_STORAGE_KEY = 'swollen_discs_timed_progress_v1';
  var LOCKED_CUP_TEXT = 'Cup Locked: Complete Advanced in MCQ and Timed Sets';
  var UNLOCKED_CUP_TEXT = 'Cup Unlocked: Advanced in MCQ and Timed Sets';
  var PHONE_VIEW_STORAGE_KEY = 'swollen_discs_phone_view_v1';
  var DEFAULT_CUP_ACHIEVEMENT_STATE = Object.freeze({
    unlocked: false,
    code: '',
    unlockedAt: ''
  });
  var DEFAULT_LEVEL_PROGRESS_STATE = Object.freeze({
    nextTierIndex: 0,
    unlockedTierIndex: -1
  });
  var _a;
  var queryValue =
    (_a = new window.URLSearchParams(window.location.search).get(IMAGE_SET_QUERY_PARAM)) == null
      ? void 0
      : _a.toLowerCase();
  var hasCoarsePointer =
    typeof window.matchMedia === 'function' && window.matchMedia('(pointer: coarse)').matches;
  var viewportEdge = Math.max(window.innerWidth || 0, window.innerHeight || 0);
  var selectedImageSet = resolveImageAssetSet({
    imageAssetSets: IMAGE_ASSET_SETS,
    queryValue,
    hasCoarsePointer,
    viewportEdge
  });
  applyConditionButtonImageSet(selectedImageSet, conditionButtons);
  var resolvedDefaultImageSrc =
    typeof selectedImageSet.normal === 'string' && selectedImageSet.normal.length > 0
      ? selectedImageSet.normal
      : DEFAULT_IMAGE_SRC;
  var resolvedTimedImages = buildTimedImagesFromSet(selectedImageSet, TIMED_IMAGES);
  scheduleImagePrefetch(
    [
      selectedImageSet.normal,
      selectedImageSet.suspicious,
      selectedImageSet.swollen,
      ...resolvedTimedImages.map((image) => (image == null ? void 0 : image.src))
    ].filter((src) => typeof src === 'string' && src.length > 0)
  );
  var appState = createAppState({ defaultImageSrc: resolvedDefaultImageSrc });
  var stateMachine = createStateMachine(appState);
  var teardownCallbacks = [];
  var gazeIntervalId = null;
  var isAppDestroyed = false;
  var mcqLevelProgressState = [];
  var timedLevelProgressState = [];
  var cupAchievementState = loadCupAchievementState();
  var initialMcqProgressState = loadLevelProgressState(MCQ_LEVEL_PROGRESS_STORAGE_KEY);
  var initialTimedProgressState = loadLevelProgressState(TIMED_LEVEL_PROGRESS_STORAGE_KEY);
  var viewer = createViewer({
    state: appState,
    canvas,
    fovToggleCheckbox,
    fovLabelSmall,
    fovLabelLeft,
    fovLabelRight,
    eyeToggleCheckbox,
    eyeLabelRight,
    eyeLabelLeft,
    cataractSlider,
    cataractStops,
    viewSummary,
    explanation,
    conditionButtons,
    defaultImageSrc: resolvedDefaultImageSrc,
    explanationTemplates: EXPLANATION_TEMPLATES,
    cataractPresets: CATARACT_PRESETS,
    cataractOcclusionSpots: CATARACT_OCCLUSION_SPOTS
  });
  var modalManager = createModalManager({
    state: appState,
    stateMachine,
    sideMenu,
    sideMenuButtons,
    burgerIcon,
    infoIcon,
    infoModal,
    testModal
  });
  var mcqController = createMcqController({
    state: appState,
    stateMachine,
    questionBank: questions_default,
    buildMcqTest,
    evaluateMcqSubmission,
    generatePassCode,
    formatMcqResultText,
    setModalState: modalManager.setModalState,
    testModal,
    triggerButton: burgerIcon,
    testContainer,
    submitTestButton,
    saveResultButton,
    testResultDiv,
    testModalTitle,
    mcqTimer,
    mcqTierConfigs: MCQ_TIER_CONFIGS,
    initialProgressState: initialMcqProgressState,
    onProgressChange: renderMcqLevelMenu
  });
  var timedTestController = createTimedTestController({
    state: appState,
    stateMachine,
    timedImages: resolvedTimedImages,
    timedRoundsPerCategory: TIMED_ROUNDS_PER_CATEGORY,
    timedTotalRounds: TIMED_SET_SIZE,
    timedRoundProfiles: TIMED_ROUND_PROFILES,
    initialProgressState: initialTimedProgressState,
    onProgressChange: renderTimedLevelMenu,
    closeTestModal: mcqController.closeTestModal,
    setModalState: modalManager.setModalState,
    infoModal,
    infoIcon,
    explanationDiv,
    timedGuessBox,
    timedMessage,
    timedCountdown,
    submitTimedGuessButton,
    timedTestResult,
    viewer
  });
  function scheduleImagePrefetch(imageSources) {
    if (typeof window === 'undefined' || typeof Image === 'undefined') {
      return;
    }
    const uniqueSources = [...new Set(imageSources)];
    const prefetch = () => {
      uniqueSources.forEach((src) => {
        const image = new Image();
        image.decoding = 'async';
        image.src = src;
      });
    };
    if (typeof window.requestIdleCallback === 'function') {
      window.requestIdleCallback(prefetch, { timeout: 1200 });
    } else {
      window.setTimeout(prefetch, 220);
    }
  }
  function normalizeLevelProgress(levelProgress) {
    return Array.isArray(levelProgress) ? levelProgress : [];
  }
  function renderLevelButtons(levelButtons, levelProgress) {
    levelButtons.forEach((button) => {
      const levelIndex = Number(button.dataset.levelIndex);
      const levelState = levelProgress[levelIndex];
      if (!levelState) {
        return;
      }
      button.dataset.locked = levelState.unlocked ? 'false' : 'true';
      button.classList.toggle('is-locked', !levelState.unlocked);
      button.classList.toggle('is-complete', levelState.completed);
      button.textContent = `Level ${levelIndex + 1}: ${levelState.name}`;
      button.setAttribute('aria-disabled', levelState.unlocked ? 'false' : 'true');
    });
  }
  function renderTimedLevelMenu(levelProgress = timedTestController.getLevelProgress()) {
    timedLevelProgressState = normalizeLevelProgress(levelProgress);
    renderLevelButtons(timedLevelButtons, timedLevelProgressState);
    saveLevelProgressState(
      TIMED_LEVEL_PROGRESS_STORAGE_KEY,
      deriveProgressStateFromLevelProgress(timedLevelProgressState)
    );
    renderCupAchievement();
  }
  function renderMcqLevelMenu(levelProgress = mcqController.getLevelProgress()) {
    mcqLevelProgressState = normalizeLevelProgress(levelProgress);
    renderLevelButtons(mcqLevelButtons, mcqLevelProgressState);
    saveLevelProgressState(
      MCQ_LEVEL_PROGRESS_STORAGE_KEY,
      deriveProgressStateFromLevelProgress(mcqLevelProgressState)
    );
    renderCupAchievement();
  }
  function isFinalTierCompleted(levelProgressState) {
    var _a2;
    if (!Array.isArray(levelProgressState) || levelProgressState.length === 0) {
      return false;
    }
    return Boolean(
      (_a2 = levelProgressState[levelProgressState.length - 1]) == null ? void 0 : _a2.completed
    );
  }
  function renderCupAchievement() {
    if (!cupAchievement) {
      return;
    }
    const hasMcqFinalTier = isFinalTierCompleted(mcqLevelProgressState);
    const hasTimedFinalTier = isFinalTierCompleted(timedLevelProgressState);
    const hasCompletedBothFinalTiers = hasMcqFinalTier && hasTimedFinalTier;
    if (!hasCompletedBothFinalTiers && cupAchievementState.unlocked) {
      cupAchievementState = {
        unlocked: false,
        code: '',
        unlockedAt: ''
      };
      saveCupAchievementState(cupAchievementState);
    } else {
      unlockCupAchievementIfNeeded(hasCompletedBothFinalTiers);
    }
    cupAchievement.hidden = false;
    cupAchievement.setAttribute('aria-hidden', 'false');
    cupAchievement.classList.toggle('is-unlocked', cupAchievementState.unlocked);
    cupAchievement.classList.toggle('is-locked', !cupAchievementState.unlocked);
    if (cupAchievementLabel) {
      cupAchievementLabel.textContent = cupAchievementState.unlocked
        ? UNLOCKED_CUP_TEXT
        : LOCKED_CUP_TEXT;
    }
    if (cupAchievementCode) {
      if (cupAchievementState.unlocked && cupAchievementState.code) {
        cupAchievementCode.hidden = false;
        cupAchievementCode.textContent = `Code: ${cupAchievementState.code}`;
      } else {
        cupAchievementCode.hidden = true;
        cupAchievementCode.textContent = '';
      }
    }
    if (downloadCupCertificateButton) {
      const isCertificateLocked = !cupAchievementState.unlocked;
      downloadCupCertificateButton.disabled = isCertificateLocked;
      downloadCupCertificateButton.dataset.locked = isCertificateLocked ? 'true' : 'false';
      downloadCupCertificateButton.setAttribute(
        'aria-disabled',
        isCertificateLocked ? 'true' : 'false'
      );
    }
  }
  function unlockCupAchievementIfNeeded(hasCompletedBothFinalTiers) {
    if (!hasCompletedBothFinalTiers || cupAchievementState.unlocked) {
      return;
    }
    cupAchievementState = {
      unlocked: true,
      code: createCupAchievementCode(),
      unlockedAt: /* @__PURE__ */ new Date().toISOString()
    };
    saveCupAchievementState(cupAchievementState);
  }
  function hasLocalStorage() {
    return typeof window !== 'undefined' && Boolean(window.localStorage);
  }
  function loadJsonStorage(storageKey) {
    if (!hasLocalStorage()) {
      return null;
    }
    try {
      const rawValue = window.localStorage.getItem(storageKey);
      return rawValue ? JSON.parse(rawValue) : null;
    } catch (e) {
      return null;
    }
  }
  function saveJsonStorage(storageKey, value) {
    if (!hasLocalStorage()) {
      return;
    }
    try {
      window.localStorage.setItem(storageKey, JSON.stringify(value));
    } catch (e) {}
  }
  function loadStringStorage(storageKey) {
    if (!hasLocalStorage()) {
      return null;
    }
    try {
      return window.localStorage.getItem(storageKey);
    } catch (e) {
      return null;
    }
  }
  function saveStringStorage(storageKey, value) {
    if (!hasLocalStorage()) {
      return;
    }
    try {
      window.localStorage.setItem(storageKey, value);
    } catch (e) {}
  }
  function loadCupAchievementState() {
    const parsedValue = loadJsonStorage(CUP_ACHIEVEMENT_STORAGE_KEY);
    if (!parsedValue || typeof parsedValue !== 'object') {
      return { ...DEFAULT_CUP_ACHIEVEMENT_STATE };
    }
    return {
      unlocked: Boolean(parsedValue.unlocked),
      code: typeof parsedValue.code === 'string' ? parsedValue.code : '',
      unlockedAt: typeof parsedValue.unlockedAt === 'string' ? parsedValue.unlockedAt : ''
    };
  }
  function loadLevelProgressState(storageKey) {
    const parsedValue = loadJsonStorage(storageKey);
    if (!parsedValue || typeof parsedValue !== 'object') {
      return { ...DEFAULT_LEVEL_PROGRESS_STATE };
    }
    const nextTierIndex = Number.isFinite(Number(parsedValue.nextTierIndex))
      ? Math.max(0, Math.floor(Number(parsedValue.nextTierIndex)))
      : 0;
    const unlockedTierIndex = Number.isFinite(Number(parsedValue.unlockedTierIndex))
      ? Math.max(-1, Math.floor(Number(parsedValue.unlockedTierIndex)))
      : -1;
    return {
      nextTierIndex,
      unlockedTierIndex
    };
  }
  function isDesktopPhonePreviewAvailable() {
    if (typeof window === 'undefined') {
      return false;
    }
    const hasCoarsePointer2 =
      typeof window.matchMedia === 'function' && window.matchMedia('(pointer: coarse)').matches;
    const viewportWidth = window.innerWidth || 0;
    return !hasCoarsePointer2 && viewportWidth > 900;
  }
  function loadPhoneViewPreference() {
    return loadStringStorage(PHONE_VIEW_STORAGE_KEY) === 'true';
  }
  function savePhoneViewPreference(enabled) {
    saveStringStorage(PHONE_VIEW_STORAGE_KEY, enabled ? 'true' : 'false');
  }
  function setPhoneViewPreviewEnabled(enabled) {
    document.body.classList.toggle('simulate-phone-frame', Boolean(enabled));
    if (phoneViewToggleCheckbox) {
      phoneViewToggleCheckbox.checked = Boolean(enabled);
    }
  }
  function saveLevelProgressState(storageKey, progressState) {
    saveJsonStorage(storageKey, progressState);
  }
  function deriveProgressStateFromLevelProgress(levelProgress) {
    if (!Array.isArray(levelProgress) || levelProgress.length === 0) {
      return {
        nextTierIndex: 0,
        unlockedTierIndex: -1
      };
    }
    const completedIndices = levelProgress
      .filter((level) => level && level.completed)
      .map((level) => Number(level.index))
      .filter((index) => Number.isFinite(index));
    const unlockedIndices = levelProgress
      .filter((level) => level && level.unlocked)
      .map((level) => Number(level.index))
      .filter((index) => Number.isFinite(index));
    const activeLevel = levelProgress.find((level) => level && level.active);
    const maxCompletedIndex = completedIndices.length > 0 ? Math.max(...completedIndices) : -1;
    const maxUnlockedIndex = unlockedIndices.length > 0 ? Math.max(...unlockedIndices) : -1;
    const allCompleted = levelProgress.every((level) =>
      Boolean(level == null ? void 0 : level.completed)
    );
    let nextTierIndex = 0;
    if (allCompleted) {
      nextTierIndex = levelProgress.length;
    } else if (activeLevel && Number.isFinite(Number(activeLevel.index))) {
      nextTierIndex = Math.max(0, Math.floor(Number(activeLevel.index)));
    } else if (maxUnlockedIndex >= 0) {
      nextTierIndex = Math.max(0, Math.min(levelProgress.length - 1, maxUnlockedIndex));
    }
    return {
      nextTierIndex,
      unlockedTierIndex: maxCompletedIndex
    };
  }
  function saveCupAchievementState(nextState) {
    saveJsonStorage(CUP_ACHIEVEMENT_STORAGE_KEY, nextState);
  }
  function createCupAchievementCode() {
    const timestamp = /* @__PURE__ */ new Date()
      .toISOString()
      .replace(/[-:.TZ]/g, '')
      .slice(0, 14);
    return `SDCUP-${timestamp}-${generatePassCode(6)}`;
  }
  function downloadCupCertificate() {
    if (!cupAchievementState.unlocked || !cupAchievementState.code) {
      return;
    }
    const unlockedAtDate = cupAchievementState.unlockedAt
      ? new Date(cupAchievementState.unlockedAt)
      : null;
    const issuedAtText =
      unlockedAtDate && !Number.isNaN(unlockedAtDate.valueOf())
        ? unlockedAtDate.toLocaleString()
        : /* @__PURE__ */ new Date().toLocaleString();
    const certificateText = [
      'Swollen Discs',
      'Practice Certificate of Achievement',
      '(Local Certificate - Not Externally Verified)',
      '',
      'Awarded for completing:',
      '- MCQ Advanced Level',
      '- Timed Set Advanced Level',
      '',
      `Achievement Code: ${cupAchievementState.code}`,
      `Issued: ${issuedAtText}`,
      '',
      'Keep this code for your records.'
    ].join('\n');
    const blob = new Blob([certificateText], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement('a');
    const safeCode = cupAchievementState.code.toLowerCase().replace(/[^a-z0-9-]/g, '');
    anchor.href = url;
    anchor.download = `swollen_discs_certificate_${safeCode}.txt`;
    document.body.appendChild(anchor);
    anchor.click();
    document.body.removeChild(anchor);
    URL.revokeObjectURL(url);
  }
  initialize();
  function initialize() {
    if (typeof window !== 'undefined' && typeof window.__swollenDiscsDestroy === 'function') {
      window.__swollenDiscsDestroy();
    }
    viewer.initialize();
    renderMcqLevelMenu();
    renderTimedLevelMenu();
    modalManager.setSideMenuOpen(false);
    const canUsePhoneViewPreview = isDesktopPhonePreviewAvailable();
    if (phonePreviewControl) {
      phonePreviewControl.hidden = !canUsePhoneViewPreview;
    }
    if (phoneViewToggleCheckbox) {
      const initialPhoneViewPreviewEnabled = canUsePhoneViewPreview && loadPhoneViewPreference();
      setPhoneViewPreviewEnabled(initialPhoneViewPreviewEnabled);
      phoneViewToggleCheckbox.disabled = !canUsePhoneViewPreview;
      const onPhoneViewToggleChange = () => {
        const shouldEnablePhoneView = canUsePhoneViewPreview && phoneViewToggleCheckbox.checked;
        setPhoneViewPreviewEnabled(shouldEnablePhoneView);
        savePhoneViewPreference(shouldEnablePhoneView);
        viewer.setDiscVisible(appState.viewer.isDiscVisible);
      };
      addAppListener(phoneViewToggleCheckbox, 'change', onPhoneViewToggleChange);
    } else {
      setPhoneViewPreviewEnabled(false);
    }
    const onBurgerClick = () => {
      modalManager.toggleSideMenu();
    };
    addAppListener(burgerIcon, 'click', onBurgerClick);
    const onInfoClick = () => {
      modalManager.setModalState(infoModal, !modalManager.isModalOpen(infoModal), infoIcon);
    };
    addAppListener(infoIcon, 'click', onInfoClick);
    const onCloseInfoClick = () => {
      modalManager.setModalState(infoModal, false, infoIcon);
    };
    addAppListener(closeInfoModalButton, 'click', onCloseInfoClick);
    addAppListener(closeTestModalButton, 'click', mcqController.closeTestModal);
    addAppListener(submitTestButton, 'click', mcqController.handleSubmitTest);
    addAppListener(saveResultButton, 'click', mcqController.handleSaveResult);
    addAppListener(downloadCupCertificateButton, 'click', downloadCupCertificate);
    mcqLevelButtons.forEach((button) => {
      const onTakeMcqLevelClick = () => {
        const levelIndex = Number(button.dataset.levelIndex);
        const started = mcqController.openTestModal({
          tierIndex: levelIndex,
          beforeOpen: () => {
            if (appState.timed.isActive) {
              timedTestController.exitTimedMode();
            }
          }
        });
        if (!started) {
          return;
        }
        modalManager.setSideMenuOpen(false);
      };
      addAppListener(button, 'click', onTakeMcqLevelClick);
    });
    timedLevelButtons.forEach((button) => {
      const onTakeTimedLevelClick = () => {
        const levelIndex = Number(button.dataset.levelIndex);
        const started = timedTestController.startTimedTest({ tierIndex: levelIndex });
        if (!started) {
          return;
        }
        modalManager.setSideMenuOpen(false);
      };
      addAppListener(button, 'click', onTakeTimedLevelClick);
    });
    addAppListener(submitTimedGuessButton, 'click', timedTestController.submitTimedGuess);
    const onDocumentClick = (event) => {
      modalManager.handleDocumentClick(event, {
        closeTestModal: mcqController.closeTestModal
      });
    };
    addAppListener(document, 'click', onDocumentClick);
    const onDocumentKeyDown = (event) => {
      modalManager.handleDocumentKeyDown(event, {
        closeTestModal: mcqController.closeTestModal
      });
    };
    addAppListener(document, 'keydown', onDocumentKeyDown);
    gazeIntervalId = setInterval(() => {
      if (!appState.viewer.shiftInProgress && !appState.timed.isActive) {
        viewer.doGazeShift();
      }
    }, SHIFT_INTERVAL);
    teardownCallbacks.push(() => {
      if (gazeIntervalId !== null) {
        clearInterval(gazeIntervalId);
        gazeIntervalId = null;
      }
    });
    if (typeof window !== 'undefined') {
      window.__swollenDiscsDestroy = destroyApp;
    }
  }
  function addAppListener(target, eventName, handler, options) {
    target.addEventListener(eventName, handler, options);
    teardownCallbacks.push(() => {
      target.removeEventListener(eventName, handler, options);
    });
  }
  function destroyApp() {
    if (isAppDestroyed) {
      return;
    }
    isAppDestroyed = true;
    teardownCallbacks.splice(0).forEach((dispose) => {
      dispose();
    });
    timedTestController.destroy();
    mcqController.destroy();
    modalManager.destroy();
    viewer.destroy();
    if (typeof window !== 'undefined' && window.__swollenDiscsDestroy === destroyApp) {
      window.__swollenDiscsDestroy = null;
    }
  }
})();
