// Shared PEC stages and audio are reused verbatim; Advanced artwork owns the rest.
import {
  PUPILS_PEC_STAGES,
  PUPILS_PEC_SCROLL_CONFIG,
} from "./pupilsPecScroll.js";
export const PUPILS_ADVANCED_SCROLL_PAGE = "pupilsAdvancedScrollPage";
export const PUPILS_ADVANCED_SCROLL_ROUTE = "pupilsAdvancedScroll";
export const PUPILS_ADVANCED_LANGUAGES = {
  en: { label: "English", locale: "en-GB", voice: "en-GB-SoniaNeural" },
  ko: { label: "한국어", locale: "ko-KR", voice: "ko-KR-SunHiNeural" },
  ur: { label: "اردو", locale: "ur-PK", voice: "ur-PK-UzmaNeural" },
  ny: {
    label: "Chichewa",
    locale: "ny-MW",
    voice: "facebook/mms-tts-nya",
    provider: "Meta MMS (local)",
    trimEdgeSilenceDb: -42,
  },
};
export const PUPILS_ADVANCED_SECTIONS = [
  { startIndex: 0, title: "Afferent and Efferent Pathways" },
  { startIndex: 4, title: "Direct and Consensual Light Response Explained" },
  { startIndex: 5, title: "Observation" },
  { startIndex: 6, title: "Direct Light Response" },
  { startIndex: 11, title: "Consensual Response" },
  { startIndex: 12, title: "Swinging Light Test" },
  { startIndex: 14, title: "Near Response" },
];
export const PUPILS_ADVANCED_TITLE_TRANSLATIONS = [
  "구심성 및 원심성 경로",
  "직접·간접 대광반사 경로",
  "관찰",
  "직접 대광반사",
  "간접 대광반사",
  "교대불빛검사",
  "근접반응",
];
const OWN_STAGES = [
  {
    name: "Afferent sensory pathway",
    assetNumber: 1,
    seconds: 22,
    cues: [
      {
        id: "afferent-light",
        offset: 0,
        end: 5.6,
        en: "Light entering the eye starts a signal in the afferent, or sensory pathway.",
        ko: "눈으로 들어온 빛은 구심성 감각 경로의 신호를 시작합니다.",
      },
      {
        id: "afferent-brain",
        offset: 5.6,
        end: 22,
        en: "Follow the coloured pathways (retina, optic nerve, chiasm, tract and nuclei).",
        ko: "색으로 표시된 경로(망막, 시신경, 시신경교차, 시삭, 신경핵)를 따라갑니다.",
      },
    ],
  },
  {
    name: "Efferent motor pathways",
    assetNumber: 16,
    seconds: 16,
    cues: [
      {
        id: "efferent-definition",
        offset: 0,
        end: 16,
        en: "Efferent signals go from the brain to the eye. There are two pathways, parasympathetic and sympathetic. Parasympathetic signals activate the constrictor muscle and sympathetic signals activate the dilator muscle.",
        ko: "원심성 신호는 뇌에서 눈으로 전달됩니다. 경로는 부교감신경과 교감신경 두 가지입니다. 부교감신경은 동공괄약근을, 교감신경은 동공산대근을 활성화합니다.",
      },
    ],
  },
  {
    name: "Parasympathetic motor pathway",
    assetNumber: 2,
    seconds: 24,
    cues: [
      {
        id: "parasympathetic",
        offset: 0,
        end: 10,
        en: "The third cranial nerve also carries the efferent signals for pupil constriction.",
        ko: "제3뇌신경은 동공을 수축시키는 원심성 신호도 전달합니다.",
      },
      {
        id: "constrictor",
        offset: 10,
        end: 17,
        en: "It supplies the iris sphincter to constrict the pupil and the ciliary muscle for focusing.",
        ko: "이 경로는 동공괄약근과 섬모체근에 연결됩니다.",
      },
      {
        id: "third-nerve",
        offset: 17,
        end: 24,
        en: "The third nerve controls most eye movements and lifts the lid. The facial nerve controls blinking.",
        ko: "제3뇌신경은 안구운동과 눈꺼풀을 올리는 주된 근육에도 연결됩니다.",
      },
    ],
  },
  {
    name: "Sympathetic motor pathway",
    assetNumber: 3,
    seconds: 20,
    cues: [
      {
        id: "sympathetic",
        offset: 0,
        end: 10,
        en: "The sympathetic pathway passes through the sympathetic chain and the superior cervical ganglion.",
        ko: "교감신경 경로는 교감신경줄기와 위목신경절을 지납니다.",
      },
      {
        id: "dilator",
        offset: 10,
        end: 20,
        en: "It supplies two muscles. First, the iris dilator muscle. Second, Müller's muscle, a minor elevator of the upper eyelid.",
        ko: "이 경로는 두 근육에 연결됩니다. 첫째는 동공산대근, 둘째는 위눈꺼풀을 들어 올리는 뮐러근입니다.",
      },
    ],
  },
  {
    name: "Direct and consensual reflex pathways",
    assetNumber: 4,
    seconds: 24,
    cues: [
      {
        id: "reflex-input",
        offset: 0,
        end: 8,
        en: "Light in one eye sends an afferent signal towards the brain.",
        ko: "한쪽 눈에 비친 빛은 구심성 신호를 뇌로 전달합니다.",
      },
      {
        id: "reflex-output",
        offset: 8,
        end: 16,
        en: "Signals from the midbrain reach both eyes, so both pupils constrict in response to light.",
        ko: "이어서 원심성 신호가 양쪽 동공으로 전달되어, 빛에 반응해 동공이 수축합니다.",
      },
      {
        id: "reflex-direct",
        offset: 16,
        end: 19.5,
        en: "The illuminated pupil has a direct response.",
        ko: "이것이 직접 대광반사입니다.",
      },
      {
        id: "reflex-consensual",
        offset: 19.5,
        end: 24,
        en: "The other pupil has a consensual response.",
        ko: "반대쪽 동공은 간접 대광반사를 보입니다.",
      },
    ],
  },
  {
    name: "Consensual response in both directions",
    assetNumber: 11,
    seconds: 22,
    cues: [
      {
        id: "consensual-first",
        offset: 0,
        end: 8,
        en: "Shine light into one eye and watch the other pupil constrict. This is the consensual response.",
        ko: "한쪽 눈에 빛을 비출 때 반대쪽 동공도 수축하는 것이 간접 대광반사입니다.",
      },
      {
        id: "consensual-other",
        offset: 8,
        end: 22,
        en: "Repeat on the other side and watch the pupil in the eye without the light.",
        ko: "반대쪽에서도 반복하며 빛을 직접 비추지 않은 눈의 동공을 관찰합니다.",
      },
    ],
  },
  {
    name: "Swinging the light between eyes",
    assetNumber: 12,
    seconds: 20,
    cues: [
      {
        id: "swing-method",
        offset: 0,
        end: 10,
        en: "Move the light between the eyes, pausing for two to three seconds on each side. Compare both pupils.",
        ko: "빛을 한쪽 눈에서 반대쪽 눈으로 옮기며 동공 반응을 비교합니다.",
      },
      {
        id: "swing-return",
        offset: 10,
        end: 20,
        en: "Swing the light back and watch both pupils as you change sides.",
        ko: "빛을 다시 옮기고, 빛을 비추는 눈이 바뀔 때마다 양쪽 동공을 관찰합니다.",
      },
    ],
  },
  {
    name: "Normal response and right RAPD",
    assetNumber: 13,
    seconds: 24,
    cues: [
      {
        id: "swing-normal",
        offset: 0,
        end: 10,
        en: "Normally, both pupils constrict equally when either eye is illuminated.",
        ko: "정상 예시에서는 빛이 이 눈으로 돌아와도 동공이 수축된 상태를 유지합니다.",
      },
      {
        id: "swing-rapd",
        offset: 10,
        end: 24,
        en: "A relative afferent pupillary defect, or RAPD, means one eye sends a weaker light signal than the other. Here, both pupils dilate when the light moves to the affected right eye.",
        caption: {
          en: "A relative afferent pupillary defect, or RAPD, means one eye sends a weaker light signal than the other.\nHere, both pupils dilate when the light moves to the affected right eye.",
        },
        ko: "상대구심동공운동장애, 즉 RAPD는 한쪽 눈의 빛 신호가 약해진 상태입니다. 빛을 이상이 있는 오른쪽 눈으로 옮기면 동공이 역설적으로 커집니다.",
      },
    ],
  },
  {
    name: "Near response examination",
    assetNumber: 14,
    seconds: 21,
    cues: [
      {
        id: "near-distance",
        offset: 0,
        end: 161.25 / 30,
        en: "First ask the patient to look at a distant target.",
        ko: "먼저 환자가 멀리 있는 목표물을 보게 합니다.",
      },
      {
        id: "near-target",
        offset: 161.25 / 30,
        end: 21,
        en: "Then ask them to look at a near target on the Arclight.",
        ko: "그다음 그림의 아크라이트처럼 가까이 있는 목표물을 보게 합니다.",
      },
    ],
  },
  {
    name: "Comparing near responses",
    assetNumber: 15,
    seconds: 20,
    cues: [
      {
        id: "near-normal",
        offset: 0,
        end: 10,
        en: "The eyes turn inwards to fix on the near target. This convergence accompanies pupil constriction and lens accommodation.",
        ko: "가까운 목표물을 볼 때 두 눈이 함께 안쪽으로 향하는 반응을 눈모음, 또는 폭주라고 합니다.",
      },
      {
        id: "near-abnormal",
        offset: 10,
        end: 20,
        en: "If the eyes do not turn inwards together for a near target, further examination is needed.",
        ko: "가까운 목표물을 볼 때 두 눈이 함께 안쪽으로 향하지 않으면 추가 검사가 필요합니다.",
      },
    ],
  },
];
// Advanced-specific English review; the shared PEC lesson keeps its own wording.
export const PUPILS_ADVANCED_ENGLISH_OVERRIDES = {
  "compare-observation":
    "Check for changes in pupil colour or shape, unequal pupil size and drooping eyelids.",
  "corresponding-examples":
    "These are possible associations. The pupil response alone does not identify the underlying eye condition.",
  "pupil-colour":
    "A grey or white appearance does not by itself mean the pupil cannot constrict.",
};
export const PUPILS_ADVANCED_STAGES = [
  ...OWN_STAGES.slice(0, 5),
  ...PUPILS_PEC_STAGES.map((stage, pecStageIndex) => ({
    ...stage,
    pecStageIndex,
    cues: stage.cues.map((cue) =>
      PUPILS_ADVANCED_ENGLISH_OVERRIDES[cue.id]
        ? {
            ...cue,
            en: PUPILS_ADVANCED_ENGLISH_OVERRIDES[cue.id],
            narrationOverrideLanguages: ["en"],
          }
        : cue,
    ),
  })),
  ...OWN_STAGES.slice(5),
];
let clock = 1;
// The original signal clock is retained; speech is paced to each structure.
export const PUPILS_ADVANCED_AFFERENT_WORD_FRAMES = {
  retina: 246,
  "optic nerve": 294,
  chiasm: 348,
  tract: 399,
  nuclei: 453,
};
// Original utterance segments, bounded by its existing silent pauses. Slow the
// voice by 15% and leave a deliberate pause between the named structures.
export const PUPILS_ADVANCED_AFFERENT_PACING = {
  speed: 0.85,
  segments: [
    { from: 0, to: 2.03, at: 5.6 },
    { from: 2.03, to: 2.87, at: 8.06035 },
    { from: 2.87, to: 4.07, at: 9.61965 },
    { from: 4.07, to: 5.07, at: 11.3661 },
    { from: 5.07, to: 5.76, at: 13.1219 },
    { from: 5.76, to: 7.01, at: 14.62094 },
  ],
};
export const PUPILS_ADVANCED_VISUAL_END_FRAMES = {
  0: 562,
  11: 390,
  14: 341.25,
};
export const PUPILS_ADVANCED_URDU_TITLES = [
  "واردی اور صادری عصبی راستے",
  "روشنی پر پتلی کا براہِ راست اور بالواسطہ ردِعمل",
  "مشاہدہ",
  "روشنی پر پتلی کا براہِ راست ردِعمل",
  "روشنی پر پتلی کا بالواسطہ ردِعمل",
  "روشنی باری باری دونوں آنکھوں پر ڈالنے کی جانچ",
  "قریب دیکھنے پر آنکھوں کا ردِعمل",
];
const PUPILS_ADVANCED_URDU_CUES = {
  "afferent-light": {
    ur: "آنکھ میں داخل ہونے والی روشنی افرینٹ، یا حسی راستے میں سگنل شروع کرتی ہے۔",
    caption: {
      ur: "آنکھ میں داخل ہونے والی روشنی سے واردی، یعنی حسی، عصبی راستے میں اشارہ پیدا ہوتا ہے۔",
    },
  },
  "afferent-brain": {
    ur: "رنگین راستوں کی پیروی کریں (شبکیہ، آپٹک اعصاب، چیاسم، نالی اور مرکزہ)۔",
  },
  "efferent-definition": {
    ur: "صادری اشارے دماغ سے آنکھ تک جاتے ہیں۔ ان کے دو راستے ہیں، پیراسیمپیتھیٹک اور سیمپیتھیٹک۔ پیراسیمپیتھیٹک اشارے پتلی کو سکیڑتے ہیں اور سیمپیتھیٹک اشارے اسے پھیلاتے ہیں۔",
  },
  parasympathetic: {
    ur: "تیسرا دماغی عصب پتلی کو سکیڑنے والے صادری اشارے بھی لے جاتا ہے۔",
  },
  constrictor: {
    ur: "یہ پتلی سکیڑنے والے عنبیہ کے عضلے اور فوکس کرنے والے مژگانی عضلے کو عصب دیتا ہے۔",
  },
  "third-nerve": {
    ur: "تیسرا عصب آنکھ کی بیشتر حرکات اور پلک اٹھانے کو کنٹرول کرتا ہے۔ چہرے کا عصب پلک جھپکاتا ہے۔",
    ttsText: {
      ur: "تیسرا عصب آنکھ کی بیشتر حرکت اور پلک اٹھاتا ہے۔ چہرے کا عصب پلک جھپکاتا ہے۔",
    },
  },
  sympathetic: {
    ur: "ہمدردی کا راستہ ہمدرد سلسلہ اور اعلیٰ سروائیکل گینگلیئن سے گزرتا ہے۔",
  },
  dilator: {
    ur: "یہ دو عضلوں کو اشارے دیتا ہے۔ پہلا پتلی پھیلاتا ہے۔ دوسرا مولر کا عضلہ ہے، جو اوپری پلک اٹھانے میں مدد دیتا ہے۔",
  },
  "reflex-input": {
    ur: "ایک آنکھ میں روشنی دماغ کی طرف متوازی سگنل بھیجتی ہے۔",
    caption: {
      ur: "ایک آنکھ پر روشنی ڈالنے سے واردی عصبی اشارہ دماغ کی طرف جاتا ہے۔",
    },
  },
  "reflex-output": {
    ur: "وسط دماغ سے سگنل دونوں آنکھوں تک پہنچتے ہیں، اس لیے دونوں پتلی روشنی کے جواب میں سکڑ جاتے ہیں۔",
  },
  "reflex-direct": {
    ur: "روشن آنکھ کی پتلی براہِ راست سکڑتی ہے۔",
    ttsText: {
      ur: "روشنی پر پتلی فوراً سکڑتی ہے۔",
    },
  },
  "reflex-consensual": {
    ur: "دوسرے پتلی کا متفقہ جواب ہے۔",
    caption: { ur: "دوسری آنکھ کی پتلی بالواسطہ ردِعمل دکھاتی ہے۔" },
  },
  "consensual-first": {
    ur: "ایک آنکھ میں روشنی ڈالیں اور دوسری پُتلی کو تنگ ہوتے دیکھیں۔ یہ متفقہ ردعمل ہے۔",
    caption: {
      ur: "ایک آنکھ پر روشنی ڈالیں اور دوسری آنکھ کی پتلی کو سکڑتے دیکھیں۔ یہ بالواسطہ ردِعمل ہے۔",
    },
  },
  "consensual-other": {
    ur: "دوسری طرف دہرائیں اور روشنی کے بغیر آنکھ میں پتلی کو دیکھیں۔",
  },
  "swing-method": {
    ur: "ہر طرف دو سے تین سیکنڈ کے لیے رک کر روشنی کو آنکھوں کے درمیان منتقل کریں۔ دونوں پتلیوں کا موازنہ کریں۔",
  },
  "swing-return": {
    ur: "لائٹ کو پیچھے کی طرف جھکائیں اور دونوں پتلیوں کو دیکھیں جب آپ رخ بدلتے ہیں۔",
  },
  "swing-normal": {
    ur: "عام طور پر، جب دونوں آنکھ روشن ہوتی ہے تو دونوں پتلی یکساں طور پر سکڑ جاتے ہیں۔",
  },
  "swing-rapd": {
    ur: "ایک رشتہ دار افیرینٹ پیپلری ڈیفیکٹ، یا RAPD، کا مطلب ہے کہ ایک آنکھ دوسری کے مقابلے میں کمزور روشنی کا سگنل بھیجتی ہے۔ یہاں، جب روشنی متاثرہ دائیں آنکھ تک جاتی ہے تو دونوں پُتلے پھیل جاتے ہیں۔",
    caption: {
      en: "A relative afferent pupillary defect, or RAPD, means one eye sends a weaker light signal than the other.\nHere, both pupils dilate when the light moves to the affected right eye.",
      ur: "نسبتی واردی پتلی کی خرابی (RAPD) میں ایک آنکھ روشنی کا کمزور سگنل بھیجتی ہے۔\nیہاں متاثرہ دائیں آنکھ پر روشنی پڑنے سے دونوں پتلیاں پھیل جاتی ہیں۔",
    },
  },
  "near-distance": {
    ur: "سب سے پہلے مریض سے کہیں کہ وہ دور کے ہدف کو دیکھے۔",
  },
  "near-target": {
    ur: "پھر ان سے Arclight پر قریبی ہدف کو دیکھنے کو کہیں۔",
  },
  "near-normal": {
    ur: "نزدیکی ہدف کو ٹھیک کرنے کے لیے آنکھیں اندر کی طرف مڑتی ہیں۔ یہ ہم آہنگی پتلیوں کی تنگی اور عینک کی رہائش کے ساتھ ہے۔",
  },
  "near-abnormal": {
    ur: "اگر قریبی ہدف کے لیے آنکھیں ایک ساتھ اندر کی طرف نہیں مڑتی ہیں تو مزید معائنے کی ضرورت ہے۔",
  },
};
export const PUPILS_ADVANCED_CHICHEWA_TITLES = [
  "Njira za uthenga wochokera m'diso ndi wobwerera m'diso",
  "Mmene maso onse amayankhira diso limodzi likaunikiridwa",
  "Kuyang'ana",
  "Mmene mwana wa diso amayankhira kuwala kolunjika",
  "Kuyankha kwa diso losaunikiridwa",
  "Kuyeza posuntha kuwala pakati pa maso",
  "Mmene maso amayankhira chinthu chapafupi",
];
const PUPILS_ADVANCED_CHICHEWA_CUES = {
  "afferent-light": {
    ny: "Kuwala kukalowa m'diso kumayambitsa uthenga m'njira ya minyewa yochokera m'diso kupita ku ubongo.",
  },
  "afferent-brain": {
    ny: "Tsatirani njira zamitunduzi kuchokera pa retina, kudzera mu mtsempha wa kuona, pamene mitsempha imadutsana, mpaka ku malo ake mu ubongo.",
  },
  "efferent-definition": {
    ny: "Uthenga wochokera muubongo umapita ku diso m'njira ziwiri. Parasympathetic imachepetsa mwana wa diso ndipo sympathetic imakulitsa.",
  },
  parasympathetic: {
    ny: "Mtsempha wachitatu wa muubongo umanyamulanso uthenga umene umachepetsa mwana wa diso.",
  },
  constrictor: {
    ny: "Imatumiza uthenga ku mnofu wa iris umene umachepetsa mwana wa diso, ndi ku mnofu umene umasintha mmene galasi la diso limalunjikira kuwala.",
  },
  "third-nerve": {
    ny: "Mtsempha wachitatu umayendetsa kayendedwe kambiri ka diso ndi kukweza chikope. Mtsempha wa nkhope umathandiza kutseka ndi kutsegula zikope.",
  },
  sympathetic: {
    ny: "Njira ya sympathetic imadutsa mndandanda wa magulu a minyewa ndi gulu lapamwamba la minyewa la m'khosi.",
  },
  dilator: {
    ny: "Imalumikiza minofu iwiri. Woyamba umakulitsa mwana wa diso. Wa Müller umathandiza kukweza chikope.",
  },
  "reflex-input": {
    ny: "Kuwala kukalowa m'diso limodzi, uthenga umapita ku ubongo kudzera m'njira yochokera m'disolo.",
  },
  "reflex-output": {
    ny: "Mauthenga ochokera pakati pa ubongo amafika m'maso onse awiri. Choncho ana a maso onse amachepa chifukwa cha kuwala.",
  },
  "reflex-direct": {
    ny: "Mwana wa diso lowunikidwa amayankha mwachindunji.",
  },
  "reflex-consensual": {
    ny: "Mwana wa diso lina nayenso amayankha ngakhale kuti sanaunikiridwe.",
  },
  observe: {
    ny: "Yang'anani kukula ndi kaonekedwe ka ana a maso onse awiri, ndipo muone ngati akufanana.",
  },
  "compare-observation": {
    ny: "Yang'anani kusintha kwa mtundu kapena kaonekedwe, kusiyana kwa kukula kwa ana a maso, ndi zikope zotsikira pansi.",
  },
  light: {
    ny: "Yatsani Arclight ndi kusankha kuwala kwamphamvu kwambiri. Gwiritsani ntchito chipinda chabata chokhala ndi kuwala kochepa.",
  },
  distance: {
    ny: "Pemphani wodwala kuti ayang'ane chinthu chakutali.",
  },
  "clear-view": {
    ny: "Onetsetsani kuti sakuyang'ana woyezayo",
    caption: "Onetsetsani kuti sakuyang'ana woyezayo",
  },
  "avoid-light": {
    ny: "kapena kuwala komweko.",
    caption: "",
  },
  "move-light": {
    ny: "Sunthani kuwala kuchokera pambali kulunjika pa mwana wa diso.",
  },
  watch: {
    ny: "Yang'anani mmene mwana wa diso amene waunikiridwa akuyankhira kuwalako.",
  },
  "shine-constrict": {
    ny: "Unikirani m'diso ndipo onani mwana wa diso akuchepa.",
  },
  "compare-responses": {
    ny: "Onani ngati mwana wa diso akuchepa pang'ono kapena sakuchepa n'komwe.",
  },
  "corresponding-examples": {
    ny: "Zimenezi zikhoza kugwirizana ndi matenda osiyanasiyana. Kuyankha kwa mwana wa diso kokha sikungasonyeze matenda amene ayambitsa vutolo.",
  },
  "pupil-colour": {
    ny: "Mwana wa diso kuoneka waimvi kapena woyera sikutanthauza kuti sangathe kuchepa.",
  },
  "cataract-constriction": {
    ny: "Ng'ala ingapangitse mwana wa diso kuoneka waimvi kapena woyera. Koma mwana wa disoyo ayenera kuchepabe ngati njira yoyendetsera kuyankha kuwala ikugwira ntchito.",
  },
  "consensual-first": {
    ny: "Unikirani diso limodzi ndipo onani mwana wa diso linalo akuchepa. Izi ndi kuyankha kwa diso losaunikiridwa.",
  },
  "consensual-other": {
    ny: "Bwerezani mbali inayo ndipo yang'anani mwana wa diso limene silinaunikiridwe.",
  },
  "swing-method": {
    ny: "Sunthani kuwala pakati pa maso awiriwo. Imani masekondi awiri mpaka atatu pa diso lililonse. Yerekezani ana a maso onse awiri.",
  },
  "swing-return": {
    ny: "Bwezerani kuwala ku diso lina ndipo yang'anani ana a maso onse pamene mukusintha mbali.",
  },
  "swing-normal": {
    ny: "Nthawi zambiri ana a maso onse amachepa mofanana mukaunikira diso lililonse.",
  },
  "swing-rapd": {
    ny: "Vuto lotchedwa RAPD limatanthauza kuti diso limodzi limatumiza uthenga wofooka wa kuwala kusiyana ndi lina. Apa ana a maso onse amakula kuwala kukasamukira ku diso lakumanja limene lili ndi vuto.",
    caption:
      "Vuto lotchedwa RAPD limatanthauza kuti diso limodzi limatumiza uthenga wofooka wa kuwala kusiyana ndi lina. Apa ana a maso onse amakula kuwala kukasamukira ku diso lakumanja limene lili ndi vuto.",
  },
  "near-distance": {
    ny: "Choyamba pemphani wodwalayo kuti ayang'ane chinthu chakutali.",
  },
  "near-target": {
    ny: "Kenako pemphani wodwalayo kuti ayang'ane chinthu chapafupi pa Arclight.",
  },
  "near-normal": {
    ny: "Maso amatembenukira mkati kuti ayang'ane chinthu chapafupi. Nthawi yomweyo ana a maso amachepa ndipo magalasi a m'maso amasintha kuti chinthucho chioneke bwino.",
  },
  "near-abnormal": {
    ny: "Ngati maso satembenukira mkati pamodzi poyang'ana chinthu chapafupi, wodwalayo afunika kuyezedwanso.",
  },
};
for (const stage of PUPILS_ADVANCED_STAGES) {
  for (const cue of stage.cues) {
    Object.assign(cue, PUPILS_ADVANCED_URDU_CUES[cue.id]);
    const chichewa = PUPILS_ADVANCED_CHICHEWA_CUES[cue.id];
    cue.ny = chichewa.ny;
    if (chichewa.caption !== undefined) {
      cue.caption = { ...cue.caption, ny: chichewa.caption };
    }
  }
}

const clips = PUPILS_ADVANCED_STAGES.map((stage, i) => {
  const clip = {
    start: clock,
    end: clock + stage.seconds,
    cueIds: stage.cues.map((c) => c.id),
  };
  clock = clip.end;
  if (i === 0)
    clip.endByLanguage = {
      en: clip.start + 562 / 30 + 1.5,
      ko: clip.start + 562 / 30 + 1.5,
    };
  // Keep the reused PEC recording intact and skip only its silent tail.
  if (i === 10)
    clip.endByLanguage = { en: clip.start + 17.76, ko: clip.start + 19.32 };
  if (i === 11)
    clip.endByLanguage = { en: clip.start + 14.5, ko: clip.start + 16.12 };
  if (i === 14)
    clip.endByLanguage = {
      en: clip.start + 341.25 / 30 + 1.5,
      ko: clip.start + 341.25 / 30 + 1.5,
    };
  return clip;
});
export const PUPILS_ADVANCED_SCROLL_TIMING = {
  folder: "pupils-advanced",
  route: "videos",
  languages: Object.keys(PUPILS_ADVANCED_LANGUAGES),
  stages: clips.map((clip, i) => [
    [clip.start, 0],
    ...(PUPILS_ADVANCED_VISUAL_END_FRAMES[i] == null
      ? []
      : [
          [
            clip.start + PUPILS_ADVANCED_VISUAL_END_FRAMES[i] / 30,
            PUPILS_ADVANCED_VISUAL_END_FRAMES[i],
          ],
        ]),
    [clip.end, PUPILS_ADVANCED_STAGES[i].seconds * 30 - 1],
  ]),
};
export const PUPILS_ADVANCED_SCROLL_CONFIG = {
  pageId: PUPILS_ADVANCED_SCROLL_PAGE,
  label: "Pupils",
  playMode: "stageAutoplay",
  enableReplay: true,
  stageAspectRatioByFile: PUPILS_ADVANCED_STAGES.map(({ assetNumber }) =>
    assetNumber === 4 ? "1169 / 1093" : "1169 / 1280",
  ),
  fitCaptionsInViewport: true,
  centerPlaybackGroup: true,
  topAlignedFirstStage: true,
  strictFrameLockNoFallback: true,
  strictFrameRemountOnBlank: true,
  persistentSettleSnapshotOverlay: true,
  lazyLoadStageAnimations: true,
  lazyInitialStageCount: 1,
  skipRouteImageWarmup: true,
  progressStoragePrefix: "lessonProgress:",
  paths: PUPILS_ADVANCED_STAGES.map((stage) =>
    stage.pecStageIndex == null
      ? `/scrolly/coreexam/pupils-advanced/${stage.assetNumber}/data.json`
      : PUPILS_PEC_SCROLL_CONFIG.paths[stage.pecStageIndex],
  ),
  sections: PUPILS_ADVANCED_SECTIONS,
  segmentRanges: PUPILS_ADVANCED_STAGES.map((stage) => [
    { from: 0, to: stage.seconds * 30 - 1 },
  ]),
  completionHoldFrameByFile: PUPILS_ADVANCED_STAGES.map(
    (stage) => stage.seconds * 30 - 1,
  ),
  segmentStartTexts: PUPILS_ADVANCED_STAGES.map((stage) =>
    stage.cues.map((c) => c.caption?.en ?? c.en),
  ),
  segmentTextModeByFile: PUPILS_ADVANCED_STAGES.map(() => "append"),
  narrationTracks: Object.fromEntries(
    Object.entries(PUPILS_ADVANCED_LANGUAGES).map(([language, { label }]) => [
      language,
      {
        label,
        src: "/narration/pupils-advanced/full-animation/" + language + ".m4a",
      },
    ]),
  ),
  narrationClipsByFile: clips,
};
