/***********************************************************
 * QUESTION BANK
 * 30 varied questions about normal, suspicious,
 * and definitely swollen discs, including the Frisén scale.
 * Revised to ensure distractors are less obviously wrong.
 ***********************************************************/
const questionBank = [
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
    question: 'Which feature typically indicates definite swelling (Frisén Grade 3 or more)?',
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
    question: "Which disc appearance is most consistent with a 'normal' Frisén Grade 0?",
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
      b: 'Only the nasal vessels can be identified – temporal side is generally obscured',
      c: 'Major vessels crossing the disc margin without significant blurring',
      d: 'No vessels cross the disc margin in normal eyes',
      e: 'All vessels except the superior vein become indistinct'
    },
    correct: 'c'
  },
  {
    id: 'q09',
    question: 'Which Frisén grade usually indicates moderate papilloedema with some haemorrhages?',
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
    question: 'Frisén Grade 2 is often associated with:',
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
    question: 'A definitely swollen disc (Grade 3–5) often includes:',
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
      b: 'Still a normal variant – some healthy eyes lack venous pulsations',
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
    question: 'Definite papilloedema with Frisén Grade 3 or more may exhibit:',
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
      e: 'Frisén scale findings exceed Grade 4 in some quadrants'
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
      e: 'A Frisén Grade 2 halo without haemorrhages'
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
      d: 'Frisén scale spontaneously reverts to Grade 0',
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
      c: 'Significant oedema with or without haemorrhages, typically Grade ≥3',
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

export default questionBank;
