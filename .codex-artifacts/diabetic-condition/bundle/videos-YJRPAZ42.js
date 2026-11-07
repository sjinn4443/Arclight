import { c as ae } from "./chunk-KIQ7J7XB.js";
import { a as Ue, b as oa, c as Ya } from "./chunk-YO55ZQHJ.js";
import { a as na, c as Ga, e as ot, f as Ua } from "./chunk-W6GCFL5V.js";
import { l as sa } from "./chunk-KNLC6FEO.js";
import "./chunk-KKOYVSFI.js";
import { b as ra } from "./chunk-YIIDTX3U.js";
import { b as ja } from "./chunk-VKQVMSQC.js";
import { n as $a, q as Qa, r as wt, s as ia } from "./chunk-C3DWFWW5.js";
import "./chunk-P2HPNKQY.js";
import "./chunk-BGCC32GM.js";
import { a as aa } from "./chunk-WOT6VMZA.js";
var la = {};
aa(la, {
  MCQ_LEVELS: () => Li,
  MCQ_SOURCE_REFERENCES: () => Pi,
  MCQ_STORAGE_KEY: () => ki,
});
var ki = "cataract_mcq_progress_v1",
  Pi = {
    "nhs-adult-cataract-2025": {
      label: "NHS cataracts in adults",
      url: "https://www.nhs.uk/conditions/cataracts/",
      status: "current-authoritative",
    },
    "nhs-childhood-cataract": {
      label: "NHS childhood cataracts",
      url: "https://www.nhs.uk/conditions/childhood-cataracts/",
      status: "current-authoritative",
    },
    "cataract-app-scope-v1": {
      label: "Cataract app scope and recording contract",
      url: null,
      status: "internal-engineering-contract",
    },
    "cataract-app-triage-v1": {
      label: "Cataract app triage and referral wording",
      url: null,
      status: "pending-independent-clinical-sign-off",
    },
  },
  Ti = [
    {
      name: "Primary",
      totalQuestions: 5,
      passScore: 4,
      timeSeconds: 90,
      questions: [
        {
          prompt: "What is the safest interpretation of a white pupil reflex?",
          options: [
            "An abnormal sign needing eye assessment",
            "Proof of mature cataract",
            "Normal ageing",
            "No action if painless",
          ],
          answerIndex: 0,
        },
        {
          prompt:
            "If fundal reflex is normal and VA is 6/6, the most likely action is:",
          options: [
            "Urgent surgery",
            "Routine surgery",
            "No cataract referral needed",
            "Immediate retinal referral",
          ],
          answerIndex: 2,
        },
        {
          prompt: "Best first step before deciding cataract referral is to:",
          options: [
            "Only inspect lens colour",
            "Check history and vision carefully",
            "Skip back-of-eye check",
            "Refer everyone with blur",
          ],
          answerIndex: 1,
        },
        {
          prompt:
            "Which VA indicates the poorest distance vision in this tool?",
          options: ["6/12", "6/36", "6/60", "HM"],
          answerIndex: 3,
        },
        {
          prompt: "Pain/red eye with sudden one-eye loss should trigger:",
          options: [
            "Routine cataract pathway",
            "No action",
            "Urgent investigation for other pathology",
            "Yearly review only",
          ],
          answerIndex: 2,
        },
        {
          prompt:
            "Which history is least typical of simple age-related cataract?",
          options: [
            "Gradual painless blur",
            "Glare and faded colours",
            "Sudden painful loss",
            "Slowly worsening distance vision",
          ],
          answerIndex: 2,
        },
        {
          prompt: "What does the Back of Eye section check for?",
          options: [
            "Only lens colour",
            "Other disease behind the lens",
            "Phone brightness",
            "Age band only",
          ],
          answerIndex: 1,
        },
        {
          prompt: "A normal fundal reflex usually means the pupil glow is:",
          options: [
            "Bright and clear",
            "Always white",
            "Always black",
            "Hidden by default",
          ],
          answerIndex: 0,
        },
        {
          prompt: "Which choice is a Back of Eye finding in this app?",
          options: ["Spots", "Patches", "Cupped", "Dense"],
          answerIndex: 2,
        },
        {
          prompt: "Which choice is a Fundal Reflex finding in this app?",
          options: ["Detached", "DR/Scar", "Patches", "Cupped"],
          answerIndex: 2,
        },
        {
          prompt: "Why does the app ask for Dist VA?",
          options: [
            "To judge vision severity",
            "To change the title",
            "To unlock the menu",
            "To replace all examination",
          ],
          answerIndex: 0,
        },
        {
          prompt:
            "If the result asks for re-checks, the safest response is to:",
          options: [
            "Ignore them",
            "Re-check the highlighted findings",
            "Clear the browser",
            "Choose the fastest referral only",
          ],
          answerIndex: 1,
        },
      ],
    },
    {
      name: "Intermediate",
      totalQuestions: 5,
      passScore: 4,
      timeSeconds: 80,
      questions: [
        {
          prompt: "White reflex with a poor back view means:",
          options: [
            "Posterior disease cannot be excluded",
            "Dense cataract is confirmed",
            "No eye assessment is needed",
            "The retina is normal",
          ],
          answerIndex: 0,
        },
        {
          prompt: "Back-of-eye finding of detached retina should usually be:",
          options: [
            "Routine cataract surgery",
            "No referral",
            "Managed as non-cataract urgent retinal disease",
            "Observed yearly",
          ],
          answerIndex: 2,
        },
        {
          prompt: "Near VA deterioration (e.g. N18/N36) in this app:",
          options: [
            "Is ignored completely",
            "Adds context to referral wording",
            "Cancels distance VA",
            "Always means no cataract",
          ],
          answerIndex: 1,
        },
        {
          prompt: "Abnormal pupils in this workflow are treated as:",
          options: [
            "Simple cataract only",
            "Possible non-cataract pathology",
            "Always normal",
            "Not relevant to triage",
          ],
          answerIndex: 1,
        },
        {
          prompt: "Front-of-eye scar/distortion should lead to:",
          options: [
            "Guarded outcome warning",
            "Automatic discharge",
            "No change",
            "Primary care only",
          ],
          answerIndex: 0,
        },
        {
          prompt:
            "If the reflex is white and the fundus cannot be seen, the safest record is:",
          options: [
            "Poor view; posterior disease not excluded",
            "Normal back of eye",
            "Definite mature cataract only",
            "No further assessment required",
          ],
          answerIndex: 0,
        },
        {
          prompt: "A dense reflex with relatively good VA should make you:",
          options: [
            "Ignore the mismatch",
            "Re-check reflex and VA",
            "Always discharge",
            "Skip Back of Eye",
          ],
          answerIndex: 1,
        },
        {
          prompt: "Distance poor but near good usually means:",
          options: [
            "The result is automatically normal",
            "VA method or refraction should be re-checked",
            "Cataract is impossible",
            "Age band should be deleted",
          ],
          answerIndex: 1,
        },
        {
          prompt: "A normal reflex with very poor VA should prompt:",
          options: [
            "No further thought",
            "Early specialist review for another cause",
            "Routine cataract surgery only",
            "Ignore the back view",
          ],
          answerIndex: 1,
        },
        {
          prompt: "Deep cupping in Back of Eye points towards:",
          options: [
            "Glaucoma review first",
            "Mature cataract only",
            "Normal result",
            "Near-vision testing only",
          ],
          answerIndex: 0,
        },
        {
          prompt: "DR/Scar in Back of Eye means:",
          options: [
            "Retinal disease may limit cataract benefit",
            "The lens is definitely clear",
            "No referral can be needed",
            "The result must be green",
          ],
          answerIndex: 0,
        },
        {
          prompt: "A child with cataract-pattern signs should usually get:",
          options: [
            "Yearly adult review",
            "Prompt paediatric referral",
            "No action until age 18",
            "Reading glasses only",
          ],
          answerIndex: 1,
        },
      ],
    },
    {
      name: "Advanced",
      totalQuestions: 5,
      passScore: 4,
      timeSeconds: 75,
      questions: [
        {
          prompt: "Most safety-critical trap in cataract triage is:",
          options: [
            "Over-documenting history",
            "Assuming all blur is cataract",
            "Checking pupils",
            "Using fundal images",
          ],
          answerIndex: 1,
        },
        {
          prompt:
            "If back-of-eye shows diabetic/retinal pathology, cataract surgery in this app is:",
          options: [
            "Always urgent",
            "Usually not the primary immediate pathway",
            "Guaranteed to restore vision",
            "Always first-line",
          ],
          answerIndex: 1,
        },
        {
          prompt: "Sudden + painful visual loss should bias toward:",
          options: [
            "Elective cataract list",
            "Urgent diagnostic escalation",
            "Annual follow-up only",
            "Reassure and discharge",
          ],
          answerIndex: 1,
        },
        {
          prompt: "The main role of this tool is to:",
          options: [
            "Replace specialist diagnosis",
            "Support rapid triage and safe signposting",
            "Provide final surgical booking",
            "Assess refractive error only",
          ],
          answerIndex: 1,
        },
        {
          prompt: "Best interpretation of poor Back of Eye view is:",
          options: [
            "Definitely simple cataract only",
            "Needs further assessment for alternate pathology",
            "Always normal",
            "Ignore if near VA is good",
          ],
          answerIndex: 1,
        },
        {
          prompt:
            "When two findings conflict (e.g. cataract-like reflex but retinal red flags), priority should be:",
          options: [
            "The least severe interpretation",
            "Safety-first escalation for red flags",
            "Ignore retinal signs",
            "Wait 12 months",
          ],
          answerIndex: 1,
        },
        {
          prompt: "RAPD or poor light direction should make the app consider:",
          options: [
            "Optic nerve or retinal disease first",
            "Only routine cataract",
            "No vision problem",
            "Near VA only",
          ],
          answerIndex: 0,
        },
        {
          prompt:
            "Why does the engine keep posterior override ahead of cataract type?",
          options: [
            "Posterior disease can be urgent or vision-limiting",
            "It makes the MCQ shorter",
            "It hides all cataract signs",
            "It avoids taking history",
          ],
          answerIndex: 0,
        },
        {
          prompt: "Sudden painful white reflex is handled as:",
          options: [
            "Routine cataract only",
            "Urgent same-day investigation",
            "No cataract pathway",
            "Back section hidden forever",
          ],
          answerIndex: 1,
        },
        {
          prompt: "Which wording is safest for a red-flag result?",
          options: [
            "Urgent action, brief reason and next step",
            "A long differential with no action",
            "Definite cataract diagnosis",
            "Reassurance before referral",
          ],
          answerIndex: 0,
        },
        {
          prompt:
            "If abnormal reflex and VA 6/6 appear together, the app should:",
          options: [
            "Show a re-check warning",
            "Force urgent surgery",
            "Delete the reflex choice",
            "Ignore VA",
          ],
          answerIndex: 0,
        },
        {
          prompt: "A non-cataract-first pathway should avoid:",
          options: [
            "Over-stating cataract as the definite cause",
            "Mentioning safety",
            "Checking the back of eye",
            "Using plain language",
          ],
          answerIndex: 0,
        },
      ],
    },
  ],
  Ii = {
    Primary: [
      "white-reflex",
      "routine",
      "assessment",
      "va",
      "acute-loss",
      "acute-loss",
      "posterior-view",
      "red-reflex",
      "posterior-view",
      "reflex-pattern",
      "va",
      "recheck",
    ],
    Intermediate: [
      "white-reflex",
      "retinal-red-flag",
      "near-va",
      "pupils",
      "cornea",
      "posterior-view",
      "recheck",
      "refraction",
      "posterior-view",
      "cupping",
      "retinal-comorbidity",
      "paediatric",
    ],
    Advanced: [
      "safety-scope",
      "retinal-comorbidity",
      "acute-loss",
      "safety-scope",
      "posterior-view",
      "retinal-red-flag",
      "rapd",
      "posterior-view",
      "acute-loss",
      "urgent-wording",
      "recheck",
      "safety-scope",
    ],
  },
  Ni = {
    "white-reflex": {
      explanation:
        "A white reflex is abnormal but does not prove mature cataract. Record the visual context and arrange eye assessment because posterior causes must not be missed.",
      source: "cataract-app-triage-v1",
    },
    routine: {
      explanation:
        "Cataract usually causes gradual visual difficulty. A normal reflex with good acuity does not by itself justify a cataract referral, though symptoms and daily function still matter.",
      source: "nhs-adult-cataract-2025",
    },
    assessment: {
      explanation:
        "History, visual acuity, anterior findings and the available posterior view must be considered together before choosing a pathway.",
      source: "cataract-app-scope-v1",
    },
    va: {
      explanation:
        "Visual acuity records functional severity and helps expose a mismatch between the reported vision and the observed reflex.",
      source: "cataract-app-scope-v1",
    },
    "acute-loss": {
      explanation:
        "Age-related cataract is usually gradual and painless. Sudden loss, pain or redness needs assessment for another cause rather than a routine cataract assumption.",
      source: "nhs-adult-cataract-2025",
    },
    "posterior-view": {
      explanation:
        "A limited or absent posterior view is a limitation, not a normal retinal finding. Cataract and posterior disease can coexist.",
      source: "cataract-app-triage-v1",
    },
    "red-reflex": {
      explanation:
        "A bright clear red reflex is the comparison pattern in this teaching app. It must still be interpreted with visual acuity and the rest of the examination.",
      source: "cataract-app-scope-v1",
    },
    "reflex-pattern": {
      explanation:
        "Patches are an anterior reflex pattern in this app. Back-of-eye choices are recorded separately to avoid mixing lens and posterior findings.",
      source: "cataract-app-scope-v1",
    },
    recheck: {
      explanation:
        "Conflicting visual acuity and examination findings should be rechecked before a referral conclusion is recorded.",
      source: "cataract-app-scope-v1",
    },
    "retinal-red-flag": {
      explanation:
        "A retinal red flag overrides a cataract-like reflex because delay could miss urgent or vision-limiting posterior disease.",
      source: "cataract-app-triage-v1",
    },
    "near-va": {
      explanation:
        "Near acuity adds functional context but does not replace distance acuity or the eye examination.",
      source: "cataract-app-scope-v1",
    },
    pupils: {
      explanation:
        "An abnormal pupil or light response is not explained safely by simple cataract alone and should prompt assessment for another cause.",
      source: "cataract-app-triage-v1",
    },
    cornea: {
      explanation:
        "Corneal scar or distortion can limit the expected visual outcome and should be recorded alongside any cataract finding.",
      source: "cataract-app-triage-v1",
    },
    refraction: {
      explanation:
        "A mismatch between distance and near acuity can reflect test method or refractive error, so the measurements should be checked before escalation.",
      source: "cataract-app-scope-v1",
    },
    cupping: {
      explanation:
        "Marked disc cupping suggests a possible glaucoma pathway and should not be explained by cataract alone.",
      source: "cataract-app-triage-v1",
    },
    "retinal-comorbidity": {
      explanation:
        "Retinal disease can coexist with cataract, alter urgency and limit the likely visual benefit from cataract surgery.",
      source: "cataract-app-triage-v1",
    },
    paediatric: {
      explanation:
        "A cataract affecting a child can impair visual development. Prompt paediatric eye assessment is important when vision may be affected.",
      source: "nhs-childhood-cataract",
    },
    "safety-scope": {
      explanation:
        "The app supports structured triage and signposting. It does not replace specialist diagnosis or prove that cataract is the cause of visual loss.",
      source: "cataract-app-scope-v1",
    },
    rapd: {
      explanation:
        "RAPD or an abnormal light response suggests retinal or optic-nerve dysfunction and should not be attributed to routine cataract without assessment.",
      source: "cataract-app-triage-v1",
    },
    "urgent-wording": {
      explanation:
        "Urgent results should put the action first, then give a brief reason and practical next step.",
      source: "cataract-app-triage-v1",
    },
  },
  Li = Ti.map((e) => ({
    ...e,
    questions: e.questions.map((t, a) => {
      let n = Ii[e.name][a],
        i = Ni[n];
      return {
        ...t,
        id: `cataract-${e.name.toLowerCase()}-${String(a + 1).padStart(2, "0")}`,
        topic: n,
        explanation: i.explanation,
        source: i.source,
      };
    }),
  }));
var ca = {};
aa(ca, {
  MCQ_LEVELS: () => Vi,
  MCQ_SOURCE_REFERENCES: () => Ka,
  MCQ_STORAGE_KEY: () => qi,
});
var qi = "glaucoma_mcq_progress_v1",
  Ka = {
    "nice-ng81-2022": {
      title: "NICE NG81: Glaucoma diagnosis and management",
      url: "https://www.nice.org.uk/guidance/ng81/chapter/Recommendations",
      reviewed: "2026-07-26",
      status: "primary-source-reviewed",
    },
    "glaucoma-risk-model-v1": {
      title: "Glaucoma app v1 risk model and referral wording",
      url: null,
      reviewed: "2026-07-26",
      status: "pending-independent-clinical-sign-off",
    },
    "glaucoma-app-scope-v1": {
      title: "Glaucoma app v1 assessment and teaching scope",
      url: null,
      reviewed: "2026-07-26",
      status: "internal-engineering-review",
    },
  },
  Ri = [
    {
      name: "Primary",
      passScore: 3,
      totalQuestions: 4,
      timeSeconds: 0,
      questions: [
        {
          prompt: "Higher IOP generally pushes risk:",
          options: ["Down", "Up", "No change"],
          answerIndex: 1,
        },
        {
          prompt: "A very large cup-disc ratio is usually:",
          options: ["Lower risk", "Higher risk", "Unrelated to risk"],
          answerIndex: 1,
        },
        {
          prompt: "A small crowded disc tends to:",
          options: ["Increase concern", "Always be normal", "Hide all risk"],
          answerIndex: 0,
        },
        {
          prompt:
            "Which method does NICE recommend for measuring IOP when deciding whether to refer?",
          options: [
            "Goldmann-type applanation tonometry",
            "Non-contact air-puff tonometry alone",
            "Digital palpation through the lid",
          ],
          answerIndex: 0,
        },
        {
          prompt: "Which assessment checks for glaucomatous functional loss?",
          options: [
            "Automated perimetry",
            "Central corneal thickness",
            "Gonioscopy",
            "Visual acuity alone",
          ],
          answerIndex: 0,
        },
        {
          prompt: "A cup-disc ratio describes:",
          options: [
            "Cup size relative to disc size",
            "Pressure relative to age",
            "VA relative to field",
            "Pupil size relative to cornea",
          ],
          answerIndex: 0,
        },
        {
          prompt: "A visible rim notch is recorded as:",
          options: [
            "A suspicious structural sign",
            "A normal pressure value",
            "A visual acuity category",
            "A pupil measurement",
          ],
          answerIndex: 0,
        },
        {
          prompt: "Family history belongs in:",
          options: [
            "Risk context",
            "Visual acuity",
            "IOP measurement",
            "Disc size",
          ],
          answerIndex: 0,
        },
        {
          prompt:
            "An initially abnormal visual field may be repeated before referral when:",
          options: [
            "There is no urgent concern and confirmation is needed",
            "It already agrees with clear disc damage",
            "The pressure is definitely high",
            "Visual acuity is reduced",
          ],
          answerIndex: 0,
        },
        {
          prompt: "The safest response to uncertain findings is to:",
          options: [
            "Record the uncertainty and use clinical judgement",
            "Mark every item normal",
            "Ignore the finding",
            "Use the lowest urgency",
          ],
          answerIndex: 0,
        },
      ],
    },
    {
      name: "Intermediate",
      passScore: 3,
      totalQuestions: 5,
      timeSeconds: 110,
      questions: [
        {
          prompt: "Thin rim/notch and disc haem together should usually:",
          options: [
            "Lower urgency",
            "Increase urgency",
            "Cancel each other out",
            "Only matter if VA is normal",
          ],
          answerIndex: 1,
        },
        {
          prompt: "Suspicious fields add risk because they may reflect:",
          options: [
            "Better perfusion",
            "Functional loss",
            "Normal variation only",
            "Lens artefact only",
          ],
          answerIndex: 1,
        },
        {
          prompt:
            "Which set best matches NICE case-finding assessment before referral?",
          options: [
            "Visual fields, optic nerve assessment, GAT and anterior chamber assessment",
            "Visual acuity, colour vision and pupil size only",
            "Non-contact tonometry and symptoms only",
            "Corneal thickness and family history only",
          ],
          answerIndex: 0,
        },
        {
          prompt:
            "Risk factors (age, family history, myopia, etc.) should be used to:",
          options: [
            "Ignore pressure and optic-disc findings",
            "Refine urgency",
            "Replace optic disc findings",
            "Avoid referral decisions",
          ],
          answerIndex: 1,
        },
        {
          prompt:
            "If unsure of disc signs but several risk factors are present:",
          options: [
            "Assume normal",
            "Treat as lower concern",
            "Escalate caution",
            "Remove all weighting",
          ],
          answerIndex: 2,
        },
        {
          prompt: "High IOP with a suspicious rim should be interpreted as:",
          options: [
            "Combined pressure and structural concern",
            "Pressure concern only",
            "A normal combination",
            "A visual acuity result",
          ],
          answerIndex: 0,
        },
        {
          prompt: "A normal-looking field does not by itself:",
          options: [
            "Exclude structural concern",
            "Provide useful context",
            "Need recording",
            "Support comparison",
          ],
          answerIndex: 0,
        },
        {
          prompt:
            "Why is stereoscopic optic nerve head assessment useful when available?",
          options: [
            "It helps evaluate cup and rim morphology",
            "It measures corneal thickness",
            "It replaces visual-field testing",
            "It determines visual acuity",
          ],
          answerIndex: 0,
        },
        {
          prompt: "If the view is not reliable, the result should:",
          options: [
            "Remain cautious rather than reassuring",
            "Automatically become low risk",
            "Discard all context",
            "Confirm glaucoma",
          ],
          answerIndex: 0,
        },
        {
          prompt: "Myopia and family history are best understood as:",
          options: [
            "Context that modifies concern",
            "Definitive diagnoses",
            "Visual field results",
            "IOP categories",
          ],
          answerIndex: 0,
        },
        {
          prompt: "Central corneal thickness is best used as:",
          options: [
            "Risk and diagnostic context, not a referral decision on its own",
            "A stand-alone diagnosis of glaucoma",
            "A replacement for visual fields",
            "A measure of optic nerve damage",
          ],
          answerIndex: 0,
        },
        {
          prompt:
            "After an accurate GAT reading of 24 mmHg or more during case finding, NICE advises:",
          options: [
            "Referral for further investigation",
            "Discharge if visual acuity is normal",
            "Reliance on non-contact tonometry instead",
            "Ignoring pressure unless pain is present",
          ],
          answerIndex: 0,
        },
      ],
    },
    {
      name: "Advanced",
      passScore: 5,
      totalQuestions: 7,
      timeSeconds: 140,
      questions: [
        {
          prompt:
            "Which measurement should not be used alone to decide glaucoma referral?",
          options: [
            "Non-contact air-puff tonometry",
            "Goldmann-type applanation tonometry",
            "Optic nerve head assessment",
            "Central visual-field testing",
            "Peripheral anterior chamber assessment",
          ],
          answerIndex: 0,
        },
        {
          prompt:
            "In the app\u2019s sparse-information LMIC triage model, a dark grey end-stage appearance should prompt:",
          options: [
            "No further assessment",
            "Escalation of the affected eye and assessment of the fellow eye",
            "Reassurance based on visual acuity",
            "Pressure measurement only",
            "Routine discharge",
          ],
          answerIndex: 1,
        },
        {
          prompt:
            "Why can a focal rim notch in a small optic disc be important?",
          options: [
            "Localised rim loss may be suspicious despite a modest cup-disc ratio",
            "Small discs cannot develop glaucoma",
            "Disc size determines IOP",
            "A notch confirms the visual field is normal",
            "Only large discs require comparison",
          ],
          answerIndex: 0,
        },
        {
          prompt:
            "Why should elevated IOP be interpreted alongside disc and field findings?",
          options: [
            "The findings provide complementary risk information",
            "IOP alone confirms glaucoma",
            "A normal field always excludes structural damage",
            "Disc size alone determines urgency",
            "The tests are interchangeable",
          ],
          answerIndex: 0,
        },
        {
          prompt:
            "A suspicious optic nerve appearance with a normal visual field should usually lead to:",
          options: [
            "Further assessment rather than dismissal",
            "Automatic discharge",
            "A diagnosis based on visual acuity",
            "Ignoring the optic nerve finding",
            "Treatment without confirmation",
          ],
          answerIndex: 0,
        },
        {
          prompt:
            "Which visual-field method does NICE include in glaucoma diagnosis?",
          options: [
            "Standard automated perimetry using a central thresholding test",
            "Confrontation alone in every case",
            "Amsler testing",
            "Colour vision plates",
            "Visual acuity alone",
          ],
          answerIndex: 0,
        },
        {
          prompt:
            "Which statement best separates triage support from diagnosis?",
          options: [
            "The estimate supports referral reasoning but does not diagnose glaucoma",
            "The estimate confirms glaucoma without examination",
            "The estimate selects treatment",
            "The estimate replaces specialist review",
            "The estimate makes uncertainty irrelevant",
          ],
          answerIndex: 0,
        },
        {
          prompt:
            "If the first visual field is unreliable and there is no urgent concern, the next step is usually to:",
          options: [
            "Repeat the field to seek a reliable result",
            "Record it as normal",
            "Replace it with visual acuity",
            "Ignore any disc abnormality",
          ],
          answerIndex: 0,
        },
        {
          prompt:
            "Can glaucoma-related optic nerve damage occur when IOP is not raised?",
          options: [
            "Yes, pressure must be interpreted with structural and functional findings",
            "No, raised IOP is always required",
            "Only when visual acuity is poor",
            "Only in a large optic disc",
          ],
          answerIndex: 0,
        },
        {
          prompt:
            "Why should the fellow eye still be assessed when one eye is high risk?",
          options: [
            "Bilateral comparison may alter interpretation and planning",
            "The high-risk eye becomes normal",
            "Only the fellow eye determines IOP",
            "It removes the need for referral",
          ],
          answerIndex: 0,
        },
        {
          prompt:
            "A strong family history with borderline structural findings should:",
          options: [
            "Increase caution without becoming a diagnosis by itself",
            "Confirm glaucoma automatically",
            "Be ignored",
            "Replace pressure measurement",
          ],
          answerIndex: 0,
        },
        {
          prompt:
            "What supports future comparison of optic nerve appearance after diagnosis?",
          options: [
            "A baseline optic nerve head image",
            "A colour vision score alone",
            "A single visual acuity result",
            "A symptom checklist without examination",
          ],
          answerIndex: 0,
        },
        {
          prompt:
            "Which examination is used to assess the anterior chamber angle at glaucoma diagnosis?",
          options: [
            "Gonioscopy",
            "Colour vision testing",
            "Retinoscopy",
            "Amsler testing",
          ],
          answerIndex: 0,
        },
        {
          prompt:
            "How often does NICE recommend measuring central corneal thickness?",
          options: [
            "At diagnosis, with repeat measurement only when clinically indicated",
            "At every pressure check",
            "Only after visual-field loss",
            "Never if gonioscopy is available",
          ],
          answerIndex: 0,
        },
        {
          prompt:
            "When uncertainty and red flags coexist, the safer principle is:",
          options: [
            "The higher concern should dominate",
            "Uncertainty should always downgrade",
            "Use the first field only",
            "Ignore red flags",
          ],
          answerIndex: 0,
        },
        {
          prompt:
            "Which group of tests forms an appropriate glaucoma diagnostic baseline?",
          options: [
            "GAT, gonioscopy, CCT, visual fields and optic nerve assessment",
            "Visual acuity and colour vision only",
            "Non-contact tonometry alone",
            "Symptoms and family history without examination",
          ],
          answerIndex: 0,
        },
      ],
    },
  ],
  Oi = {
    iop: {
      explanation:
        "Goldmann-type applanation IOP is one part of glaucoma case-finding. Higher pressure increases concern but must be interpreted with the rest of the assessment.",
      source: "nice-ng81-2022",
    },
    disc: {
      explanation:
        "Optic nerve head assessment looks for suspicious structural damage. Cup-disc ratio is contextual and does not establish risk safely on its own.",
      source: "nice-ng81-2022",
    },
    "disc-size": {
      explanation:
        "Disc size changes how cupping is interpreted in this app model. The weighting is app-specific and remains pending independent clinical sign-off.",
      source: "glaucoma-risk-model-v1",
    },
    scope: {
      explanation:
        "A transparent triage estimate based on recorded findings does not make a definitive diagnosis or replace specialist assessment.",
      source: "glaucoma-app-scope-v1",
    },
    "iop-measurement": {
      explanation:
        "NICE recommends Goldmann-type applanation tonometry for IOP measurement in glaucoma case finding and advises against basing referral decisions on non-contact tonometry alone.",
      source: "nice-ng81-2022",
    },
    "functional-testing": {
      explanation:
        "Central visual-field testing with standard automated perimetry assesses functional loss that may support referral or diagnosis.",
      source: "nice-ng81-2022",
    },
    "disc-examination": {
      explanation:
        "Stereoscopic optic nerve head assessment, through a dilated pupil when clinically appropriate, supports evaluation of cup and rim morphology.",
      source: "nice-ng81-2022",
    },
    "field-method": {
      explanation:
        "NICE includes standard automated perimetry using a central thresholding test in glaucoma diagnostic assessment.",
      source: "nice-ng81-2022",
    },
    "baseline-imaging": {
      explanation:
        "NICE recommends an optic nerve head image at diagnosis to provide a baseline for future comparison.",
      source: "nice-ng81-2022",
    },
    "repeat-confirmation": {
      explanation:
        "When there is no urgent concern, NICE allows repeat IOP or visual-field measurements on another occasion to confirm an abnormal finding.",
      source: "nice-ng81-2022",
    },
    "case-finding-set": {
      explanation:
        "NICE case finding combines visual fields, optic nerve assessment, Goldmann-type applanation tonometry and peripheral anterior chamber assessment.",
      source: "nice-ng81-2022",
    },
    cct: {
      explanation:
        "Central corneal thickness contributes to risk assessment and diagnostic context but should not determine referral on its own. NICE recommends measuring it at diagnosis and repeating only when clinically indicated.",
      source: "nice-ng81-2022",
    },
    "referral-iop": {
      explanation:
        "NICE recommends referral for further investigation when IOP is 24 mmHg or more using Goldmann-type applanation tonometry, while local pathways determine operational handling.",
      source: "nice-ng81-2022",
    },
    "disc-interpretation": {
      explanation:
        "Optic disc size affects the meaning of a cup-disc ratio. Focal rim loss may still be suspicious in a small disc and requires clinical interpretation.",
      source: "nice-ng81-2022",
    },
    "structural-functional": {
      explanation:
        "Structural optic nerve damage and functional visual-field loss may not appear at the same time. A suspicious finding should be assessed rather than cancelled by a normal companion test.",
      source: "nice-ng81-2022",
    },
    "normal-tension": {
      explanation:
        "Glaucoma-related optic nerve damage may occur without raised IOP, so pressure must be interpreted alongside optic nerve and visual-field findings.",
      source: "nice-ng81-2022",
    },
    gonioscopy: {
      explanation:
        "Gonioscopy is part of the diagnostic assessment because it evaluates the anterior chamber angle and helps distinguish glaucoma mechanisms.",
      source: "nice-ng81-2022",
    },
    "diagnostic-baseline": {
      explanation:
        "NICE diagnostic assessment includes Goldmann-type applanation tonometry, gonioscopy, central corneal thickness, visual fields and optic nerve assessment with imaging where available.",
      source: "nice-ng81-2022",
    },
    "risk-context": {
      explanation:
        "Age, family history and myopia add context to structural, pressure and field findings but do not diagnose glaucoma by themselves.",
      source: "glaucoma-risk-model-v1",
    },
    unassessed: {
      explanation:
        "Before findings are recorded, the safe state is not assessed rather than normal or low risk.",
      source: "glaucoma-app-scope-v1",
    },
    uncertainty: {
      explanation:
        "Unreliable or uncertain findings should be documented and repeated or escalated as clinically appropriate, not converted into reassurance.",
      source: "nice-ng81-2022",
    },
    "combined-risk": {
      explanation:
        "Pressure, optic nerve structure and visual field provide complementary information. Several concerning findings should not cancel one another out.",
      source: "nice-ng81-2022",
    },
    field: {
      explanation:
        "A glaucomatous visual field defect is functional evidence that can warrant referral even when another recorded feature appears less concerning.",
      source: "nice-ng81-2022",
    },
    triage: {
      explanation:
        "The app combines entered findings into a triage estimate. Its thresholds and timescales remain app-specific and need independent clinical sign-off.",
      source: "glaucoma-risk-model-v1",
    },
    severe: {
      explanation:
        "In this app\u2019s sparse-information LMIC triage model, a dark grey end-stage appearance prompts escalation of the affected eye and assessment of the fellow eye. This app-specific action remains pending independent clinical sign-off.",
      source: "glaucoma-risk-model-v1",
    },
    bilateral: {
      explanation:
        "Assessing both eyes supports comparison, identifies asymmetric disease and informs the overall clinical plan.",
      source: "nice-ng81-2022",
    },
    boundaries: {
      explanation:
        "Inclusive category boundaries make the app model predictable at threshold values. They are engineering contracts, not universal clinical cut-offs.",
      source: "glaucoma-risk-model-v1",
    },
    "data-integrity": {
      explanation:
        "The triage reasoning must correspond to the recorded findings. A mismatch is a reason to stop and recheck the assessment before use.",
      source: "glaucoma-app-scope-v1",
    },
  },
  Fi = [
    [
      "iop",
      "disc",
      "disc-size",
      "iop-measurement",
      "functional-testing",
      "disc",
      "disc",
      "risk-context",
      "repeat-confirmation",
      "uncertainty",
    ],
    [
      "combined-risk",
      "field",
      "case-finding-set",
      "risk-context",
      "uncertainty",
      "combined-risk",
      "field",
      "disc-examination",
      "uncertainty",
      "risk-context",
      "cct",
      "referral-iop",
    ],
    [
      "iop-measurement",
      "severe",
      "disc-interpretation",
      "combined-risk",
      "structural-functional",
      "field-method",
      "scope",
      "repeat-confirmation",
      "normal-tension",
      "bilateral",
      "risk-context",
      "baseline-imaging",
      "gonioscopy",
      "cct",
      "uncertainty",
      "diagnostic-baseline",
    ],
  ],
  Vi = Ri.map((e, t) => ({
    ...e,
    questions: e.questions.map((a, n) => {
      let i = Fi[t][n],
        o = Oi[i];
      return {
        id: `glaucoma-${e.name.toLowerCase()}-${String(n + 1).padStart(2, "0")}`,
        ...a,
        topic: i,
        ...o,
        reviewStatus: Ka[o.source].status,
      };
    }),
  }));
var vt = {};
aa(vt, {
  MCQ_BANK: () => Wi,
  MCQ_LEVEL_META: () => Mi,
  MCQ_SOURCE_REFERENCES: () => Xa,
});
var Mi = {
    primary: { title: "Primary", passMark: 3, questionCount: 5 },
    intermediate: { title: "Intermediate", passMark: 4, questionCount: 6 },
    advanced: { title: "Advanced", passMark: 6, questionCount: 8 },
  },
  Xa = {
    "nipe-eye-screening-2026": {
      title:
        "NHS Newborn and Infant Physical Examination screening programme handbook",
      url: "https://www.gov.uk/government/publications/newborn-and-infant-physical-examination-programme-handbook/newborn-and-infant-physical-examination-screening-programme-handbook",
      reviewed: "2026-07-26",
      status: "primary-source-reviewed",
    },
    "fundal-reflex-case-catalogue-v1": {
      title: "Fundal Reflex v1 simulator case catalogue and teaching scope",
      url: null,
      reviewed: "2026-07-26",
      status: "internal-engineering-review",
    },
    "fundal-reflex-safety-v1": {
      title: "Fundal Reflex v1 safety and escalation wording",
      url: null,
      reviewed: "2026-07-26",
      status: "pending-independent-clinical-sign-off",
    },
  },
  Di = {
    primary: [
      {
        question:
          "Both eyes show similar bright orange-red reflexes. Best match:",
        options: [
          "Normal eyes",
          "Dense cataracts",
          "Corneal opacity",
          "Dark reflex problem",
        ],
        answer: 0,
      },
      {
        question:
          "One eye has a much darker reflex than the other. The key first observation is:",
        options: [
          "Asymmetry between the eyes",
          "Equal bright reflexes",
          "A white reflex",
          "A corneal scar",
        ],
        answer: 0,
      },
      {
        question:
          "What can create a falsely unequal reflex during the examination?",
        options: [
          "Unequal gaze or partial lid obstruction",
          "Equal viewing distance",
          "Centred pupils with both eyes open",
          "A bright symmetrical reflex",
        ],
        answer: 0,
      },
      {
        question: "A creamy white pupil is most concerning for:",
        options: [
          "Retinoblastoma",
          "Normal blue reflex",
          "Large esotropia",
          "Poor tear film",
        ],
        answer: 0,
      },
      {
        question: "A baby with a white pupil needs:",
        options: [
          "Urgent eye referral via the local pathway",
          "Routine non-urgent review",
          "Watching only if both eyes move",
          "A colour-only check",
        ],
        answer: 0,
      },
      {
        question:
          "Both eyes have a blue-white but otherwise even reflex. Best label:",
        options: [
          "Normal blue reflex",
          "Dense cataract",
          "White reflex concern",
          "Dark reflex problem",
        ],
        answer: 0,
      },
      {
        question:
          "What must still be checked before an even blue-white reflex is called a colour variant?",
        options: [
          "Brightness, shape and symmetry",
          "Hair colour only",
          "One pupil only",
          "Age alone",
        ],
        answer: 0,
      },
      {
        question:
          "The child is looking away and the reflex view is poor. Best next step:",
        options: [
          "Repeat after improving the view",
          "Call it normal",
          "Refer as a white reflex",
          "Judge colour only",
        ],
        answer: 0,
      },
      {
        question:
          "Upper lids cover both pupils and the reflex cannot be judged. How should the finding be recorded?",
        options: [
          "View inadequate or unassessed",
          "Normal reflexes",
          "Bilateral cataracts",
          "Normal because both sides match",
        ],
        answer: 0,
      },
      {
        question:
          "One eye turns in towards the nose and its reflex appears brighter. This is:",
        options: [
          "Esotropia (eye turns in)",
          "Exotropia (eye turns out)",
          "Anisocoria (unequal pupils)",
          "Corneal opacity",
        ],
        answer: 0,
      },
      {
        question:
          "When one eye turns in, what should be assessed separately from reflex brightness?",
        options: [
          "Eye alignment",
          "Hair colour",
          "Lens surgery history only",
          "Tear-film shimmer only",
        ],
        answer: 0,
      },
      {
        question: "One eye turns out away from the nose. This is:",
        options: [
          "Esotropia (eye turns in)",
          "Exotropia (eye turns out)",
          "Anisocoria (unequal pupils)",
          "Coloboma (notched pupil)",
        ],
        answer: 1,
      },
      {
        question:
          "One eye turns out and has an obvious corneal scar. Best Primary match:",
        options: [
          "Large exotropia with corneal scar",
          "Large esotropia",
          "Retinoblastoma",
          "Normal blue reflex",
        ],
        answer: 0,
      },
      {
        question: "Which clue localises reduced reflex clarity to the cornea?",
        options: [
          "A visible anterior scar crossing the pupil",
          "A freely drifting dark dot",
          "A fixed posterior sector",
          "An equal blue-white reflex",
        ],
        answer: 0,
      },
      {
        question: "The simplest normal case should have:",
        options: [
          "Equal reflexes in right and left eyes",
          "A fixed dark sector",
          "Blood-like haze",
          "A lens edge",
        ],
        answer: 0,
      },
      {
        question:
          "If the two reflexes cannot be compared reliably, the safest next step is to:",
        options: [
          "Improve the view and repeat or seek eye assessment",
          "Record both as normal",
          "Judge colour alone",
          "Ignore the obscured eye",
        ],
        answer: 0,
      },
    ],
    intermediate: [
      {
        question: "Both eyes show a superior crescent. Best match:",
        options: [
          "High hypermetropia",
          "Myopia",
          "Poor tear film",
          "Anisocoria",
        ],
        answer: 0,
      },
      {
        question:
          "Why is a refractive crescent not a final spectacle prescription?",
        options: [
          "It is a screening cue that still needs formal refraction",
          "It measures the exact lens power",
          "It excludes astigmatism",
          "It confirms normal acuity",
        ],
        answer: 0,
      },
      {
        question:
          "Both eyes have a duller-than-normal corneal reflex. Best match:",
        options: [
          "Dull corneal reflex",
          "Retinal detachment",
          "Aphakia",
          "Keratoconus",
        ],
        answer: 0,
      },
      {
        question:
          "Which observation helps separate surface-related dullness from a fixed lens opacity?",
        options: [
          "The appearance changes after a blink",
          "The pupil becomes keyhole-shaped",
          "A lens edge is visible",
          "A fixed sector stays in place",
        ],
        answer: 0,
      },
      {
        question:
          "The reflex flickers and shimmers as the light moves. Best match:",
        options: [
          "Poor tear film",
          "Dense cataract",
          "Retinal detachment",
          "Vitreous haemorrhage",
        ],
        answer: 0,
      },
      {
        question:
          "When surface shimmer makes the reflex unstable, the next useful step is to:",
        options: [
          "Encourage a blink and reassess",
          "Record a retinal detachment",
          "Call the view normal",
          "Diagnose aphakia",
        ],
        answer: 0,
      },
      {
        question:
          "Right eye has a superior crescent; left eye has an inferior crescent. Best interpretation:",
        options: [
          "Bilateral myopia",
          "Bilateral hypermetropia",
          "Right hypermetropia with left myopia",
          "Keratoconus",
        ],
        answer: 2,
      },
      {
        question: "Different crescent directions between eyes should prompt:",
        options: [
          "A refractive comparison of both eyes",
          "A colour-only check",
          "Immediate labelling as cataract",
          "Ignoring the clearer eye",
        ],
        answer: 0,
      },
      {
        question:
          "An inferior keyhole-shaped pupil with an altered reflex is most typical of:",
        options: [
          "Coloboma",
          "Aniridia",
          "Acute angle closure",
          "Iridocyclitis",
        ],
        answer: 0,
      },
      {
        question:
          "Which feature separates an iris coloboma from a round central opacity?",
        options: [
          "A visible keyhole extension of the pupil margin",
          "A freely mobile dark dot",
          "A diffuse vitreous haze",
          "An equal round pupil",
        ],
        answer: 0,
      },
      {
        question: "Marked loss of iris tissue in both eyes is called:",
        options: [
          "Aniridia",
          "Small pupils",
          "Acute angle closure",
          "Iris transillumination",
        ],
        answer: 0,
      },
      {
        question: "Bilateral aniridia may also show:",
        options: [
          "Subtle nystagmus",
          "Retinal detachment",
          "A pseudophakic second reflex",
          "A lens edge",
        ],
        answer: 0,
      },
      {
        question: "One pupil is clearly smaller than the other. The term is:",
        options: ["Anisocoria", "Aniridia", "Coloboma", "Aphakia"],
        answer: 0,
      },
      {
        question: "Which finding is not explained safely by simple anisocoria?",
        options: [
          "A white or obscured reflex",
          "Unequal pupil size",
          "Equal clear reflexes",
          "A visible larger pupil",
        ],
        answer: 0,
      },
      {
        question:
          "A small extra patch of light is seen passing through the iris. Best match:",
        options: [
          "Anisocoria",
          "Posterior pole cataract",
          "Iris transillumination",
          "Aphakia",
        ],
        answer: 2,
      },
      {
        question: "Which feature favours iris transillumination over coloboma?",
        options: [
          "A light patch through the iris without a keyhole pupil margin",
          "A fixed retinal sector",
          "A dense central lens plaque",
          "A missing crystalline lens",
        ],
        answer: 0,
      },
      {
        question:
          "Both pupils are small, making the reflex harder to view. Best match:",
        options: [
          "Small pupils",
          "Aphakia",
          "Keratoconus",
          "Retinal detachment",
        ],
        answer: 0,
      },
      {
        question:
          "If small pupils prevent an adequate reflex view, the result should be:",
        options: [
          "Recorded as limited or unassessed",
          "Recorded as normal",
          "Called aphakia",
          "Called retinal detachment",
        ],
        answer: 0,
      },
      {
        question:
          "One eye has a dense central posterior opacity but the other is normal. Best match:",
        options: [
          "Retinal detachment",
          "Poor tear film",
          "Posterior pole cataract",
          "Floaters",
        ],
        answer: 2,
      },
      {
        question:
          "Which comparison helps distinguish a posterior lens opacity from a corneal scar?",
        options: [
          "A clear corneal surface with a deeper central shadow",
          "A freely moving opacity",
          "A keyhole pupil margin",
          "A changing tear-film shimmer",
        ],
        answer: 0,
      },
      {
        question:
          "In a baby, both reflexes are dull with lens-media haze. Most concerning for:",
        options: [
          "Poor tear film",
          "Keratoconus",
          "Congenital cataract",
          "Physiological anisocoria",
        ],
        answer: 2,
      },
      {
        question:
          "An infant with an obscured or markedly asymmetric reflex should receive:",
        options: [
          "Urgent eye referral through the local pathway",
          "Routine observation only",
          "A normal result if both eyes move",
          "Colour reassessment at adulthood",
        ],
        answer: 0,
      },
      {
        question:
          "A full grey reflex with only a faint hazy corneal reflection suggests:",
        options: [
          "Myopia",
          "Floaters",
          "Corneal opacity",
          "Posterior pole cataract",
        ],
        answer: 2,
      },
      {
        question:
          "When a visible corneal opacity limits the reflex, the record should include:",
        options: [
          "The anterior opacity and the limited fundal view",
          "A normal fundus",
          "Only pupil size",
          "Only eye alignment",
        ],
        answer: 0,
      },
      {
        question:
          "Left eye shows a sharp lens edge and reversed inferior crescent; right eye is normal. Best match:",
        options: [
          "Aphakia",
          "Posterior pole cataract",
          "Myopia",
          "Downward lens subluxation",
        ],
        answer: 3,
      },
      {
        question: "Which feature separates lens subluxation from aphakia?",
        options: [
          "A displaced lens edge is still visible",
          "The reflex is always white",
          "Both pupils are small",
          "The opacity drifts freely",
        ],
        answer: 0,
      },
    ],
    advanced: [
      {
        question:
          "One painful-looking eye has a vertically oval pupil and duller reflex. Treat as:",
        options: [
          "Benign anisocoria",
          "Acute angle closure",
          "Keratoconus",
          "Aphakia",
        ],
        answer: 1,
      },
      {
        question:
          "Why is a vertically oval pupil in a painful red eye not safely classified as simple anisocoria?",
        options: [
          "It may indicate an acute anterior-segment emergency",
          "It confirms a refractive error",
          "It is expected with normal pigmentation",
          "It excludes raised pressure",
        ],
        answer: 0,
      },
      {
        question:
          "What is the key limitation of using the fundal reflex in a painful red eye?",
        options: [
          "It cannot rule out an anterior-segment emergency",
          "It confirms angle closure by itself",
          "It replaces pressure assessment",
          "It makes the fellow eye irrelevant",
        ],
        answer: 0,
      },
      {
        question:
          "Small black dots sit on the reflex near the pupil margin. Best match:",
        options: [
          "Retinal detachment",
          "Iridocyclitis",
          "Acute angle closure",
          "Poor tear film",
        ],
        answer: 1,
      },
      {
        question:
          "Iridocyclitis is more likely than simple anisocoria when there are:",
        options: [
          "Inflammatory-looking pupil-margin changes",
          "Equal normal reflexes",
          "Both eyes blue-white only",
          "A drifting floater",
        ],
        answer: 0,
      },
      {
        question:
          "Both eyes show a large distorted scissors-like reflex. Best match:",
        options: [
          "High hypermetropia",
          "Dense cataract",
          "Keratoconus",
          "Small pupils",
        ],
        answer: 2,
      },
      {
        question: "A markedly distorted scissors reflex should prompt:",
        options: [
          "Corneal and refractive assessment",
          "A diagnosis from the reflex alone",
          "A retinal-detachment label",
          "A normal result if bilateral",
        ],
        answer: 0,
      },
      {
        question:
          "Spoke-like radial lens shadows cross the reflex. Best match:",
        options: [
          "Subcapsular cataract",
          "Cortical cataract",
          "Posterior pole cataract",
          "Aniridia",
        ],
        answer: 1,
      },
      {
        question:
          "Which feature separates cortical lens spokes from vitreous floaters?",
        options: [
          "Lens spokes remain fixed while floaters drift",
          "Lens spokes are always blue",
          "Floaters form a keyhole pupil",
          "Floaters create an IOL reflection",
        ],
        answer: 0,
      },
      {
        question:
          "A central posterior plaque causes glare and reduces the reflex. Best match:",
        options: [
          "Dense cataract",
          "Corneal opacity",
          "Subcapsular cataract",
          "Floaters",
        ],
        answer: 2,
      },
      {
        question:
          "Why can a small posterior subcapsular opacity cause marked symptoms?",
        options: [
          "Its central position can interfere with the visual axis and glare",
          "It always turns the eye out",
          "It makes floaters stationary",
          "It enlarges the iris",
        ],
        answer: 0,
      },
      {
        question:
          "A second corneal reflection appears in a pseudophakic eye. Best match:",
        options: [
          "IOL reflection",
          "Posterior vitreous detachment",
          "Corneal opacity",
          "Anisocoria",
        ],
        answer: 0,
      },
      {
        question:
          "In the IOL and capsular thickening case, the left-eye clue is:",
        options: [
          "Posterior capsule haze",
          "Retinal detachment",
          "Coloboma notch",
          "Large esotropia",
        ],
        answer: 0,
      },
      {
        question:
          "The crystalline lens is absent, giving a very bright altered reflex. This is:",
        options: ["Aniridia", "Anisometropia", "Aphakia", "Ametropia"],
        answer: 2,
      },
      {
        question: "Which clue favours pseudophakia rather than aphakia?",
        options: [
          "An intraocular-lens reflection or lens-surgery history",
          "No crystalline lens and no implant",
          "A changing tear-film shimmer",
          "A fixed retinal sector",
        ],
        answer: 0,
      },
      {
        question:
          "Mobile dark opacities drift across an otherwise present reflex. Best match:",
        options: [
          "Retinal detachment",
          "Floaters",
          "Vitreous haemorrhage",
          "Dense cataract",
        ],
        answer: 1,
      },
      {
        question:
          "New mobile opacities reported with flashes or visual loss should be:",
        options: [
          "Assessed clinically rather than dismissed as harmless floaters",
          "Recorded as normal",
          "Treated as a colour variant",
          "Explained by pupil size alone",
        ],
        answer: 0,
      },
      {
        question:
          "A diffuse blood-like haze obscures much of the reflex rather than forming small dots. Best match:",
        options: [
          "Poor tear film",
          "Floaters",
          "Vitreous haemorrhage",
          "Corneal opacity",
        ],
        answer: 2,
      },
      {
        question:
          "A diffuse blood-like haze behind a clear cornea should be recorded as:",
        options: [
          "A limited posterior view needing urgent assessment",
          "A normal fundus",
          "A tear-film problem only",
          "A refractive crescent",
        ],
        answer: 0,
      },
      {
        question:
          "A fixed dark sector stays in the same part of the pupil as the light moves. Best match:",
        options: ["Aniridia", "Aphakia", "Retinal detachment", "Floaters"],
        answer: 2,
      },
      {
        question: "A fixed dark sector with new visual symptoms should prompt:",
        options: [
          "Urgent eye assessment",
          "Routine colour review only",
          "A normal result if the other eye is clear",
          "A tear-film treatment assumption",
        ],
        answer: 0,
      },
      {
        question:
          "Retroillumination is useful for cortical lens opacity because it:",
        options: [
          "Outlines fixed spokes against the fundal reflex",
          "Makes floaters stationary",
          "Confirms retinal attachment",
          "Measures pupil alignment",
        ],
        answer: 0,
      },
      {
        question:
          "Why can vitreous haemorrhage not be assessed fully from the reflex pattern alone?",
        options: [
          "The haze can conceal the underlying retina",
          "It always clears after a blink",
          "It is identical to a corneal scar",
          "It proves the retina is attached",
        ],
        answer: 0,
      },
      {
        question:
          "What is the key limitation of a fixed retinal-sector reflex pattern?",
        options: [
          "It suggests posterior pathology but does not replace a retinal examination",
          "It confirms the exact retinal break",
          "It becomes normal when the fellow eye is clear",
          "It measures visual acuity",
        ],
        answer: 0,
      },
      {
        question:
          "Which history is most relevant when an IOL reflection or capsular haze is seen?",
        options: [
          "Previous cataract surgery",
          "Childhood eye colour",
          "Recent tear-film change",
          "Physiological anisocoria",
        ],
        answer: 0,
      },
      {
        question: "Aphakia and IOL/capsular thickening both point first to:",
        options: [
          "Lens status or previous lens surgery",
          "Primary alignment only",
          "Pupil size alone",
          "Tear-film shimmer",
        ],
        answer: 0,
      },
    ],
  },
  Bi = {
    normal: {
      explanation:
        "A reassuring screening comparison is bright, round and similar between the two eyes, while normal colour varies with pigmentation.",
      source: "nipe-eye-screening-2026",
    },
    asymmetry: {
      explanation:
        "A reflex that differs in colour or brightness from the fellow eye is an abnormal screening finding and needs further assessment.",
      source: "nipe-eye-screening-2026",
    },
    "white-reflex": {
      explanation:
        "A white reflex is abnormal. It can reflect cataract or a posterior cause, so it requires urgent eye referral rather than observation alone.",
      source: "nipe-eye-screening-2026",
    },
    "normal-variation": {
      explanation:
        "The simulator includes an even blue-white reflex as a pigmentation-related teaching variant. Symmetry and clarity remain essential comparisons.",
      source: "fundal-reflex-case-catalogue-v1",
    },
    "limited-view": {
      explanation:
        "A view obscured by gaze or eyelids is unassessed, not normal. Improve the view and repeat before interpreting the reflex.",
      source: "fundal-reflex-safety-v1",
    },
    "examination-quality": {
      explanation:
        "Compare both eyes from a centred, unobstructed position. Unequal gaze or partial lid coverage can create an apparent brightness difference that should be corrected before interpretation.",
      source: "fundal-reflex-safety-v1",
    },
    alignment: {
      explanation:
        "Esotropia turns an eye in and exotropia turns it out. Alignment changes the apparent position of the reflected light between the eyes.",
      source: "fundal-reflex-case-catalogue-v1",
    },
    "corneal-opacity": {
      explanation:
        "A corneal opacity or scar reduces reflex clarity at the anterior surface and should not be mistaken for an alignment or colour variant.",
      source: "fundal-reflex-case-catalogue-v1",
    },
    refractive: {
      explanation:
        "The simulator uses the direction and symmetry of crescents to teach refractive comparison, including different refractive states between eyes.",
      source: "fundal-reflex-case-catalogue-v1",
    },
    "refractive-limitation": {
      explanation:
        "A crescent is a qualitative screening cue. It does not measure an exact refractive correction and should not replace formal refraction.",
      source: "fundal-reflex-case-catalogue-v1",
    },
    "corneal-quality": {
      explanation:
        "A dull corneal reflection is an anterior-surface quality cue. It is distinct from a fixed posterior shadow or mobile vitreous opacity.",
      source: "fundal-reflex-case-catalogue-v1",
    },
    "tear-film": {
      explanation:
        "An irregular tear film changes as the light or blink changes, producing unstable shimmer rather than a fixed opacity.",
      source: "fundal-reflex-case-catalogue-v1",
    },
    iris: {
      explanation:
        "Iris findings alter pupil shape or permit light through an iris defect. Compare the pupil anatomy as well as the fundal reflex.",
      source: "fundal-reflex-case-catalogue-v1",
    },
    pupil: {
      explanation:
        "Pupil size changes the available view. Unequal or small pupils must be recorded rather than converted into a reflex diagnosis.",
      source: "fundal-reflex-case-catalogue-v1",
    },
    "lens-opacity": {
      explanation:
        "A central or dense lens opacity obscures the reflex in a fixed pattern and may limit the view of the fundus.",
      source: "fundal-reflex-case-catalogue-v1",
    },
    cataract: {
      explanation:
        "Cataract patterns are fixed lens opacities. Their position and shape help distinguish them from surface shimmer or vitreous movement.",
      source: "fundal-reflex-case-catalogue-v1",
    },
    "lens-position": {
      explanation:
        "A displaced lens can expose a visible lens edge and alter the crescent. Lens position is the key cue rather than retinal shadowing.",
      source: "fundal-reflex-case-catalogue-v1",
    },
    "acute-angle": {
      explanation:
        "A painful red eye with a vertically oval or poorly reactive pupil is an emergency pattern and must not be treated as benign anisocoria.",
      source: "fundal-reflex-safety-v1",
    },
    inflammation: {
      explanation:
        "Inflammatory pupil-margin changes are not explained by simple physiological anisocoria and require clinical assessment.",
      source: "fundal-reflex-safety-v1",
    },
    "corneal-shape": {
      explanation:
        "A scissors-like or markedly distorted reflex is a corneal-shape cue rather than a white-reflex or retinal-sector pattern.",
      source: "fundal-reflex-case-catalogue-v1",
    },
    "lens-surgery": {
      explanation:
        "Aphakia, an intraocular lens and posterior capsule haze are lens-status clues. Previous lens surgery should be considered when interpreting the reflex.",
      source: "fundal-reflex-case-catalogue-v1",
    },
    "lens-status": {
      explanation:
        "Aphakia means absence of the crystalline lens and produces a different optical pattern from a small pupil or retinal detachment.",
      source: "fundal-reflex-case-catalogue-v1",
    },
    vitreous: {
      explanation:
        "Small mobile opacities suggest floaters, while a diffuse blood-like haze suggests vitreous haemorrhage. Both differ from a fixed retinal sector.",
      source: "fundal-reflex-case-catalogue-v1",
    },
    retinal: {
      explanation:
        "A fixed sector that remains in the same position as the light moves is the simulator cue for retinal detachment and warrants urgent assessment.",
      source: "fundal-reflex-safety-v1",
    },
  },
  zi = {
    primary: [
      "normal",
      "asymmetry",
      "examination-quality",
      "white-reflex",
      "white-reflex",
      "normal-variation",
      "normal-variation",
      "limited-view",
      "limited-view",
      "alignment",
      "alignment",
      "alignment",
      "corneal-opacity",
      "corneal-opacity",
      "normal",
      "asymmetry",
    ],
    intermediate: [
      "refractive",
      "refractive-limitation",
      "corneal-quality",
      "corneal-quality",
      "tear-film",
      "tear-film",
      "refractive",
      "refractive",
      "iris",
      "iris",
      "iris",
      "iris",
      "pupil",
      "pupil",
      "iris",
      "iris",
      "pupil",
      "pupil",
      "lens-opacity",
      "lens-opacity",
      "cataract",
      "cataract",
      "corneal-opacity",
      "corneal-opacity",
      "lens-position",
      "lens-position",
    ],
    advanced: [
      "acute-angle",
      "acute-angle",
      "acute-angle",
      "inflammation",
      "inflammation",
      "corneal-shape",
      "corneal-shape",
      "cataract",
      "cataract",
      "cataract",
      "cataract",
      "lens-surgery",
      "lens-surgery",
      "lens-status",
      "lens-status",
      "vitreous",
      "vitreous",
      "vitreous",
      "vitreous",
      "retinal",
      "retinal",
      "cataract",
      "vitreous",
      "retinal",
      "lens-surgery",
      "lens-surgery",
    ],
  },
  Wi = Object.fromEntries(
    Object.entries(Di).map(([e, t]) => [
      e,
      t.map((a, n) => {
        let i = zi[e][n],
          o = Bi[i];
        return {
          id: `fundal-${e}-${String(n + 1).padStart(2, "0")}`,
          ...a,
          topic: i,
          ...o,
          reviewStatus: Xa[o.source].status,
        };
      }),
    ]),
  );
(function (t) {
  let a = {
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
          explanation:
            "An outward manifest alignment is described as exotropia.",
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
    },
    n = {
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
  function i(o) {
    return /cover|phoria|tropia|total deviation/i.test(o.question)
      ? "aao-cover-tests"
      : /pupil|anisocoria|RAPD|Horner|Adie|Argyll|angle closure|mydriasis|miosis|3rd nerve|light response|consensual/i.test(
            o.question,
          )
        ? "aao-neuro-pupil-reference"
        : /mixed pattern|output style|descriptive finding/i.test(o.question)
          ? "squint-app-scope-v1"
          : "aao-motility-reference";
  }
  (Object.entries(a).forEach(([o, r]) => {
    r.forEach((s, d) => {
      let p = i(s);
      ((s.id = `squint-${o}-${String(d + 1).padStart(2, "0")}`),
        (s.source = p),
        (s.reviewStatus = n[p].status),
        s.explanation.length < 40 &&
          (s.explanation = `${s.explanation} Interpret it with the complete examination.`));
    });
  }),
    (t.McqData = { MCQ_BANK: a, MCQ_SOURCE_REFERENCES: n }));
})(typeof globalThis < "u" ? globalThis : window);
var en = ["primary", "intermediate", "advanced"],
  tn = {
    primary: "Primary",
    intermediate: "Intermediate",
    advanced: "Advanced",
  },
  an = {
    cataract: "Cataract",
    glaucoma: "Glaucoma",
    fundalReflex: "Fundal Reflex",
    squint: "Squint / Palsy",
  };
function bt(e, t, a) {
  if (e && Object.prototype.hasOwnProperty.call(e, t)) return e[t];
  let n = e?.default;
  return n && Object.prototype.hasOwnProperty.call(n, t) ? n[t] : a;
}
function ua(e) {
  let t = String(e || "");
  return `${t.charAt(0).toUpperCase()}${t.slice(1)}`;
}
function Hi(e) {
  return {
    prompt: e.prompt || e.question || "",
    options: Array.isArray(e.options) ? e.options.slice() : [],
    answerIndex: Number.isInteger(e.answerIndex)
      ? e.answerIndex
      : Number.isInteger(e.answer)
        ? e.answer
        : -1,
    explanation: e.explanation || "",
  };
}
function nn(e, t) {
  let a = (e || []).map(Hi),
    n = Number(t);
  return !Number.isFinite(n) || n <= 0 ? a : a.slice(0, Math.min(a.length, n));
}
function Za(e, t) {
  return t.reduce((a, n, i) => {
    let o =
      en[i] ||
      String(n.name || "")
        .trim()
        .toLowerCase();
    if (!o) return a;
    let r = `${e}${ua(o)}QuizPage`;
    return (
      (a[r] = {
        pageId: r,
        topicKey: e,
        topicTitle: an[e],
        levelKey: o,
        levelTitle: tn[o] || n.name || ua(o),
        returnPageId: e === "glaucoma" ? "glaucomaInteractivePage" : `${e}Page`,
        questions: nn(n.questions, n.totalQuestions),
      }),
      a
    );
  }, {});
}
function Ja(e, t, a = {}) {
  return en.reduce((n, i) => {
    let o = a[i] || {},
      r = `${e}${ua(i)}QuizPage`;
    return (
      (n[r] = {
        pageId: r,
        topicKey: e,
        topicTitle: an[e],
        levelKey: i,
        levelTitle: o.title || tn[i],
        returnPageId:
          e === "fundalReflex"
            ? "fundalReflexInteractivePage"
            : `${e}PalsyPage`,
        questions: nn(t[i], o.questionCount),
      }),
      n
    );
  }, {});
}
var Gi = globalThis.McqData?.MCQ_BANK || {},
  Ui = bt(la, "MCQ_LEVELS", []),
  $i = bt(ca, "MCQ_LEVELS", []),
  Qi = bt(vt, "MCQ_BANK", {}),
  ji = bt(vt, "MCQ_LEVEL_META", {}),
  on = Object.freeze({
    ...Za("cataract", Ui),
    ...Za("glaucoma", $i),
    ...Ja("fundalReflex", Qi, ji),
    ...Ja("squint", Gi),
  });
function rn(e) {
  return on[String(e || "").trim()] || null;
}
function sn() {
  return Object.keys(on);
}
var Yi = "lessonProgress:",
  Ki = "arclight:lesson-progress-changed";
function Xi(e) {
  try {
    window.I18N?.applyTranslations?.(e);
  } catch {}
}
function ln(e) {
  let t = Number(e);
  return Number.isFinite(t) ? Math.max(0, Math.min(100, t)) : 0;
}
function Zi(e) {
  try {
    return JSON.parse(localStorage.getItem(e) || "null");
  } catch {
    return null;
  }
}
function cn(e, t, { mode: a = "max" } = {}) {
  if (!e) return 0;
  let n = `${Yi}${e}`,
    i = ln(t),
    o = Zi(n) || {},
    r = ln(o.percent),
    s = a === "replace" ? i : Math.max(r, i);
  if (s !== r || !Number.isFinite(Number(o.percent)) || s >= 100)
    try {
      localStorage.setItem(
        n,
        JSON.stringify({ percent: s, updatedAt: Date.now() }),
      );
    } catch {}
  return (
    document.dispatchEvent(
      new CustomEvent(Ki, { detail: { target: e, percent: s } }),
    ),
    s
  );
}
function Ji(e) {
  let t = e.querySelector(".quiz-question-heading"),
    a = e.querySelector(".quiz-question-badge"),
    n = e.querySelector(".quiz-question");
  return (
    n || ((n = document.createElement("p")), (n.className = "quiz-question")),
    t ||
      ((t = document.createElement("div")),
      (t.className = "quiz-question-heading"),
      e.prepend(t)),
    a ||
      ((a = document.createElement("span")),
      (a.className = "quiz-question-badge"),
      a.setAttribute("aria-hidden", "true")),
    t.contains(a) || t.prepend(a),
    t.contains(n) || t.appendChild(n),
    { badge: a, question: n }
  );
}
function eo(e, t, a) {
  e && (e.textContent = `You got ${t} out of ${a} correct.`);
}
function to(e, t) {
  if (!e) return;
  let a = t.options[t.answerIndex] || "";
  if (
    ((e.textContent = ""),
    e.appendChild(document.createTextNode("Correct answer: ")),
    e.appendChild(document.createTextNode(a)),
    t.explanation)
  ) {
    e.appendChild(document.createElement("br"));
    let n = document.createElement("span");
    ((n.textContent = t.explanation), e.appendChild(n));
  }
}
function ao(e, t, a) {
  if (!e || !a) return;
  let n = 0;
  for (let i = 0; i < a; i += 1)
    e.querySelector(`input[name="q${i}"]:checked`) && (n += 1);
  cn(t, (n / a) * 95);
}
function no(e) {
  let t = document.createDocumentFragment(),
    a = document.createElement("div");
  a.className = "eyes-topbar interactive-topic-quiz-topbar";
  let n = document.createElement("div");
  ((n.className = "eyes-topbar__title"),
    n.setAttribute("data-i18n", "auto.videos.eyes"),
    (n.textContent = "Eyes"));
  let i = document.createElement("div");
  i.className = "eyes-topbar__icons";
  let o = document.createElement("span");
  ((o.className = "icon menuBtn"),
    o.setAttribute("aria-label", "Menu"),
    o.setAttribute("data-i18n", "i18nExtra.menu_aria_label:aria-label"),
    (o.textContent = "\u2630"),
    i.appendChild(o),
    a.appendChild(n),
    a.appendChild(i));
  let r = document.createElement("div");
  r.className = "quiz-container";
  let s = document.createElement("div");
  s.className = "quiz-scroll";
  let d = document.createElement("form");
  s.appendChild(d);
  let p = document.createElement("div");
  p.className = "quiz-footer";
  let c = document.createElement("button");
  ((c.type = "submit"),
    (c.className = "start-btn"),
    (c.textContent = "Check Answer"),
    p.appendChild(c));
  let u = document.createElement("div");
  u.className = "quiz-modal hidden";
  let l = document.createElement("div");
  l.className = "quiz-modal-content";
  let g = document.createElement("p"),
    _ = document.createElement("button");
  ((_.textContent = "Check Answer"),
    l.appendChild(g),
    l.appendChild(_),
    u.appendChild(l),
    r.appendChild(s),
    r.appendChild(p),
    r.appendChild(u),
    t.appendChild(a),
    t.appendChild(r));
  let S = `${e}-`;
  return (
    (d.id = `${S}quizForm`),
    c.setAttribute("form", d.id),
    (u.id = `${S}quizModal`),
    (g.id = `${S}quizScoreText`),
    (_.id = `${S}seeWhyBtn`),
    t
  );
}
function io(e, t) {
  let a = `${t}-`,
    n = e.querySelector("#backToVideoBtn, .back-icon"),
    i = e.querySelector("#quizForm, form"),
    o = e.querySelector(".quiz-footer .start-btn"),
    r = e.querySelector("#quizModal, .quiz-modal"),
    s = e.querySelector("#quizScoreText, .quiz-modal-content p"),
    d = e.querySelector("#seeWhyBtn, .quiz-modal-content button");
  return (
    n && (n.id = `${a}backToVideoBtn`),
    i && (i.id = `${a}quizForm`),
    o &&
      i &&
      (o.setAttribute("form", i.id),
      (o.textContent = "Check Answer"),
      o.setAttribute("data-i18n", "i18nLiteral.Check Answer")),
    r && (r.id = `${a}quizModal`),
    s && (s.id = `${a}quizScoreText`),
    d && (d.id = `${a}seeWhyBtn`),
    { backBtn: n, form: i, modal: r, scoreText: s, seeWhyBtn: d }
  );
}
function oo(e, t, a) {
  let n = document.getElementById("quizLauncherBlockTemplate"),
    i = document.getElementById("quizLauncherOptionTemplate"),
    o =
      n?.content.firstElementChild?.cloneNode(!0) ||
      document.createElement("div");
  o.classList.add("quiz-block");
  let { badge: r, question: s } = Ji(o);
  ((r.textContent = String(t + 1).padStart(2, "0")),
    (s.textContent = e.prompt));
  let d = o.querySelector(".quiz-options");
  (d ||
    ((d = document.createElement("div")),
    (d.className = "quiz-options"),
    o.appendChild(d)),
    (d.textContent = ""),
    e.options.forEach((c, u) => {
      let l =
        i?.content.firstElementChild?.cloneNode(!0) ||
        document.createElement("label");
      l.classList.add("radio-label");
      let g = l.querySelector("input") || document.createElement("input");
      ((g.type = "radio"), (g.name = `q${t}`), (g.value = String(u)));
      let _ =
        l.querySelector(".quiz-option-text") ||
        l.querySelector("span") ||
        document.createElement("span");
      ((_.textContent = c),
        l.contains(g) || l.prepend(g),
        l.contains(_) || l.appendChild(_),
        d.appendChild(l));
    }));
  let p = o.querySelector(".answer");
  return (
    p ||
      ((p = document.createElement("p")),
      (p.className = "answer"),
      (p.style.display = "none"),
      (p.style.marginTop = "5px"),
      (p.style.fontStyle = "italic"),
      o.appendChild(p)),
    (p.id = `${a}-answer-${t}`),
    to(p, e),
    o
  );
}
function ro(e, t, a) {
  ((e.className = "page has-eyes-topbar interactive-topic-quiz-page"),
    (e.dataset.quizPageId = t.pageId),
    (e.dataset.quizTopic = t.topicKey),
    (e.dataset.quizLevel = t.levelKey),
    e.replaceChildren(no(t.pageId)));
  let {
    backBtn: n,
    form: i,
    modal: o,
    scoreText: r,
    seeWhyBtn: s,
  } = io(e, t.pageId);
  i &&
    ((i.textContent = ""),
    t.questions.forEach((d, p) => {
      i.appendChild(oo(d, p, t.pageId));
    }),
    i.addEventListener("change", () => {
      ao(i, t.pageId, t.questions.length);
    }),
    i.addEventListener("submit", (d) => {
      d.preventDefault();
      let p = 0;
      if (
        (t.questions.forEach((c, u) => {
          let l = i.querySelectorAll(`input[name="q${u}"]`),
            g = null;
          (l.forEach((P) => {
            ((P.disabled = !0),
              P.checked && (g = Number.parseInt(P.value, 10)));
          }),
            (
              l[0]?.closest(".quiz-block")?.querySelectorAll("label") || []
            ).forEach((P) => {
              let m = Number.parseInt(
                P.querySelector("input")?.value || "",
                10,
              );
              (P.classList.toggle("correct", m === c.answerIndex),
                P.classList.toggle(
                  "wrong",
                  Number.isInteger(g) && m === g && g !== c.answerIndex,
                ));
            }),
            g === c.answerIndex && (p += 1));
        }),
        r)
      ) {
        (eo(r, p, t.questions.length),
          r.appendChild(document.createElement("br")));
        let c = document.createElement("small");
        ((c.textContent = "Answers are highlighted in green."),
          r.appendChild(c));
      }
      (o?.classList.remove("hidden"), cn(t.pageId, 100));
    }),
    s?.addEventListener("click", () => {
      (o?.classList.add("hidden"),
        e
          .querySelectorAll(".answer")
          .forEach((d) => (d.style.display = "block")));
    }),
    n?.addEventListener("click", () => {
      typeof a == "function" && a(t.returnPageId);
    }),
    Xi(e));
}
function un({ showPage: e } = {}) {
  let t = document.getElementById("videos");
  t &&
    sn().forEach((a) => {
      let n = rn(a);
      if (!n) return;
      let i = document.getElementById(a);
      (i ||
        ((i = document.createElement("div")),
        (i.id = a),
        (i.style.display = "none"),
        t.appendChild(i)),
        ro(i, n, e));
    });
}
var _t = "eyeExaminationConnectPage",
  we = 7,
  At = we * we,
  mn = "eyeExaminationConnect:tutorialSeen:v5";
function ne(e, t = {}) {
  let a = window.I18N?.translateLiteral?.(e, e) ?? e;
  return (
    Object.entries(t).forEach(([n, i]) => {
      a = a.replaceAll(`{{${n}}}`, String(i));
    }),
    a
  );
}
var re = [
    {
      key: "history",
      label: "History Taking",
      row: 4,
      col: 0,
      image: "/images/quiz/connect/history.png",
    },
    {
      key: "va",
      label: "Visual Acuity",
      row: 0,
      col: 0,
      image: "/images/quiz/connect/va.png",
    },
    {
      key: "frontofeye",
      label: "Front of eye",
      row: 2,
      col: 6,
      image: "/images/quiz/connect/frontofeye.png",
    },
    {
      key: "pupils",
      label: "Pupils",
      row: 6,
      col: 6,
      image: "/images/quiz/connect/pupils.png",
    },
    {
      key: "fundalreflex",
      label: "Fundal reflex",
      row: 5,
      col: 1,
      image: "/images/quiz/connect/fundalreflex.png",
    },
    {
      key: "do",
      label: "Direct Ophthalmoscopy",
      row: 1,
      col: 5,
      image: "/images/quiz/connect/do.png",
    },
  ],
  ye = (e, t) => e * we + t,
  Te = (e) => ({ row: Math.floor(e / we), col: e % we }),
  qe = new Map(re.map((e, t) => [ye(e.row, e.col), t])),
  hs = [
    [4, 0],
    [3, 0],
    [2, 0],
    [2, 1],
    [2, 2],
    [1, 2],
    [1, 1],
    [1, 0],
    [0, 0],
    [0, 1],
    [0, 2],
    [0, 3],
    [0, 4],
    [0, 5],
    [0, 6],
    [1, 6],
    [2, 6],
    [3, 6],
    [4, 6],
    [5, 6],
    [6, 6],
    [6, 5],
    [6, 4],
    [6, 3],
    [6, 2],
    [6, 1],
    [6, 0],
    [5, 0],
    [5, 1],
    [5, 2],
    [5, 3],
    [5, 4],
    [5, 5],
    [4, 5],
    [4, 4],
    [4, 3],
    [4, 2],
    [4, 1],
    [3, 1],
    [3, 2],
    [3, 3],
    [3, 4],
    [3, 5],
    [2, 5],
    [2, 4],
    [2, 3],
    [1, 3],
    [1, 4],
    [1, 5],
  ].map(([e, t]) => ye(e, t));
function da(e, t) {
  if (!Number.isInteger(e) || !Number.isInteger(t)) return !1;
  let a = Te(e),
    n = Te(t);
  return Math.abs(a.row - n.row) + Math.abs(a.col - n.col) === 1;
}
function so(e = []) {
  let t = Array.isArray(e) ? e.filter((p) => Number.isInteger(p)) : [],
    a = t.map((p) => qe.get(p)).filter((p) => p !== void 0),
    n = a.every((p, c) => p === c),
    i = t.every((p, c) => c === 0 || da(t[c - 1], p)),
    o = new Set(t).size === t.length,
    r = t[0] === ye(re[0].row, re[0].col),
    s = t[t.length - 1] === ye(re.at(-1).row, re.at(-1).col),
    d = t.length === At && o;
  return {
    adjacent: i,
    complete: r && s && i && o && d && n && a.length === re.length,
    encounteredCheckpoints: a,
    endsCorrectly: s,
    fillsGrid: d,
    orderCorrect: n,
    startsCorrectly: r,
    unique: o,
  };
}
function lo() {
  try {
    return localStorage.getItem(mn) === "1";
  } catch {
    return !1;
  }
}
function co() {
  try {
    localStorage.setItem(mn, "1");
  } catch {}
}
function dn(e) {
  let t = 0;
  return (
    e.forEach((a) => {
      qe.get(a) === t && (t += 1);
    }),
    t
  );
}
function uo(e) {
  let t = [];
  e.replaceChildren();
  for (let a = 0; a < At; a += 1) {
    let n = document.createElement("div"),
      i = Te(a),
      o = qe.get(a);
    if (
      ((n.className = "exam-connect__cell"),
      (n.dataset.cell = String(a)),
      (n.dataset.row = String(i.row)),
      (n.dataset.col = String(i.col)),
      o !== void 0)
    ) {
      let r = re[o],
        s = document.createElement("span"),
        d = document.createElement("img"),
        p = document.createElement("span");
      (n.classList.add("has-checkpoint"),
        (s.className = "exam-connect__marker"),
        (d.src = r.image),
        (d.alt = ""),
        (d.draggable = !1),
        (p.className = "exam-connect__marker-label"),
        (p.textContent = ne(r.label)),
        (s.title = ne(r.longLabel || r.label)),
        s.append(d, p),
        n.appendChild(s));
    }
    (e.appendChild(n), t.push(n));
  }
  return t;
}
function po(e) {
  let t = e.querySelector("#examConnectBoard"),
    a = e.querySelector(".exam-connect__cells"),
    n = e.querySelector("#examConnectStatus"),
    i = e.querySelector("#examConnectFilled"),
    o = Array.from(
      e.querySelectorAll("#examConnectSequence [data-connect-step]"),
    ),
    r = Array.from(e.querySelectorAll("[data-connect-line]")),
    s = e.querySelector("#examConnectReset"),
    d = e.querySelector("#examConnectHelp"),
    p = e.querySelector("#examConnectPlayAgain"),
    c = e.querySelector("#examConnectComplete"),
    u = e.querySelector("#examConnectTutorial"),
    l = Array.from(e.querySelectorAll("[data-tutorial-slide]")),
    g = Array.from(e.querySelectorAll("[data-tutorial-dot]")),
    _ = e.querySelector("#examConnectTutorialBack"),
    S = e.querySelector("#examConnectTutorialNext");
  if (!t || !a || !n || !i || !s || !d || !p || !c || !u || !_ || !S)
    return null;
  let P = uo(a),
    m = {
      complete: !1,
      drawing: !1,
      errorTimer: 0,
      keyboardCell: 0,
      keyboardMode: !1,
      path: [],
      pointerId: null,
      tutorialIndex: 0,
      tutorialOpenedManually: !1,
    },
    I = "",
    L = (f, E = !1) => {
      (window.clearTimeout(m.errorTimer),
        (n.textContent = f),
        n.classList.toggle("is-error", E),
        E &&
          (m.errorTimer = window.setTimeout(() => {
            n.classList.remove("is-error");
          }, 700)));
    },
    B = (f) => {
      if (f === void 0) return;
      let E = re[f],
        x = P[ye(E.row, E.col)];
      (x?.classList.remove("is-invalid-step"),
        window.requestAnimationFrame(() => {
          (x?.classList.add("is-invalid-step"),
            window.setTimeout(
              () => x?.classList.remove("is-invalid-step"),
              420,
            ));
        }));
    },
    V = () => {
      let f = Array.from({ length: r.length }, () => []),
        E = 0;
      (m.path.length > 0 && f[0].push(m.path[0]),
        m.path.slice(1).forEach((x) => {
          f[E]?.push(x);
          let R = qe.get(x);
          R !== void 0 &&
            R > 0 &&
            R < re.length - 1 &&
            ((E = R), f[E]?.push(x));
        }),
        r.forEach((x, R) => {
          let D = f[R].map((M) => {
            let K = Te(M);
            return `${K.col * 100 + 50},${K.row * 100 + 50}`;
          }).join(" ");
          x.setAttribute("points", D);
        }));
    },
    z = (f) => {
      if (m.complete) {
        L(ne("Complete \xB7 49/49 squares filled"));
        return;
      }
      if (m.path.length === 0) {
        L(ne("Choose the first examination skill"));
        return;
      }
      if (f === re.length - 1) {
        L(
          ne(
            "{{count}}/49 \xB7 Fill every square, then finish with the last skill",
            { count: m.path.length },
          ),
        );
        return;
      }
      L(
        ne("{{count}}/49 \xB7 Find the next examination skill", {
          count: m.path.length,
        }),
      );
    },
    j = () => {
      let f = new Set(m.path),
        E = m.path[m.path.length - 1],
        x = dn(m.path);
      P.forEach((D, M) => {
        let K = qe.get(M);
        (D.classList.toggle("is-visited", f.has(M)),
          D.classList.toggle("is-endpoint", E === M),
          D.classList.toggle(
            "is-keyboard-cursor",
            m.keyboardMode && m.path.length === 0 && m.keyboardCell === M,
          ),
          D.classList.toggle("is-complete-step", K !== void 0 && K < x),
          D.classList.remove("is-current-step"));
      });
      let R = x - 1;
      (o.forEach((D, M) => {
        (D.classList.toggle("is-complete", m.complete || M < R),
          D.classList.toggle("is-current", M === R && !m.complete));
      }),
        (i.textContent = String(m.path.length)),
        t.classList.toggle("is-complete", m.complete),
        t.setAttribute(
          "aria-label",
          m.complete
            ? ne("Completed 7 by 7 Connect board. All 49 squares are filled.")
            : ne("7 by 7 Connect board. {{count}} of 49 squares filled.", {
                count: m.path.length,
              }),
        ),
        (c.hidden = !m.complete),
        V(),
        z(x));
    },
    T = () => {
      if (m.complete) {
        ae(_t, 100);
        return;
      }
      if (m.path.length === 0) return;
      let f = Math.max(5, Math.min(95, Math.round((m.path.length / At) * 95)));
      ae(_t, f);
    },
    C = ({ focus: f = !0 } = {}) => {
      ((m.complete = !1),
        (m.drawing = !1),
        (m.keyboardCell = 0),
        (m.keyboardMode = !1),
        (m.path = []),
        (m.pointerId = null),
        j(),
        f && t.focus({ preventScroll: !0 }));
    },
    W = () => {
      ((m.complete = !0),
        (m.drawing = !1),
        j(),
        T(),
        c.scrollIntoView?.({ behavior: "smooth", block: "nearest" }));
    },
    O = (f) => {
      if (m.complete || !Number.isInteger(f)) return !1;
      let E = ye(re[0].row, re[0].col);
      if (m.path.length === 0)
        return f !== E
          ? (L(
              ne("That is not the first examination skill. Try another one."),
              !0,
            ),
            B(qe.get(f)),
            !1)
          : (m.path.push(f), j(), T(), !0);
      let x = m.path[m.path.length - 1];
      if (f === x) return !0;
      if (!da(x, f)) return !1;
      let R = m.path[m.path.length - 2];
      if (f === R) return (m.path.pop(), j(), !0);
      if (m.path.includes(f))
        return (
          L(
            ne("That square is already filled. Move back one square to undo."),
            !0,
          ),
          !1
        );
      let D = dn(m.path),
        M = qe.get(f);
      return M !== void 0 && M !== D
        ? (L(
            ne("That is not the next examination skill. Try another route."),
            !0,
          ),
          B(M),
          !1)
        : M === re.length - 1 && m.path.length !== At - 1
          ? (L(
              ne(
                "Keep going \xB7 Every square must be filled before the final skill",
              ),
              !0,
            ),
            B(M),
            !1)
          : (m.path.push(f), so(m.path).complete ? W() : (j(), T()), !0);
    },
    ue = (f) => {
      if (m.path.length === 0) return O(f);
      let E = m.path[m.path.length - 1];
      if (f === E) return !0;
      if (da(E, f)) return O(f);
      let x = Te(E),
        R = Te(f);
      if (x.row !== R.row && x.col !== R.col) return !1;
      let D = Math.sign(R.row - x.row),
        M = Math.sign(R.col - x.col),
        K = x.row,
        oe = x.col;
      for (; K !== R.row || oe !== R.col; )
        if (((K += D), (oe += M), !O(ye(K, oe)))) return !1;
      return !0;
    },
    J = (f) => {
      let x = document
        .elementFromPoint?.(f.clientX, f.clientY)
        ?.closest?.("[data-cell]");
      return !x || !t.contains(x) ? null : Number(x.dataset.cell);
    };
  (t.addEventListener("pointerdown", (f) => {
    let E = f.target.closest?.("[data-cell]");
    !E ||
      m.complete ||
      (f.preventDefault(),
      t.focus({ preventScroll: !0 }),
      (m.keyboardMode = !1),
      (m.drawing = !0),
      (m.pointerId = f.pointerId),
      t.setPointerCapture?.(f.pointerId),
      ue(Number(E.dataset.cell)));
  }),
    t.addEventListener("pointermove", (f) => {
      if (!m.drawing || f.pointerId !== m.pointerId) return;
      f.preventDefault();
      let E = J(f);
      E !== null && ue(E);
    }));
  let A = (f) => {
    if (m.drawing) {
      if (((m.drawing = !1), m.pointerId !== null))
        try {
          t.releasePointerCapture?.(m.pointerId);
        } catch {}
      ((m.pointerId = null), f?.preventDefault?.());
    }
  };
  (t.addEventListener("pointerup", A),
    t.addEventListener("pointercancel", A),
    t.addEventListener("lostpointercapture", A),
    t.addEventListener("keydown", (f) => {
      if (m.complete) return;
      if (m.path.length === 0) {
        let oe = {
          ArrowDown: [1, 0],
          ArrowLeft: [0, -1],
          ArrowRight: [0, 1],
          ArrowUp: [-1, 0],
        }[f.key];
        if (oe) {
          (f.preventDefault(), (m.keyboardMode = !0));
          let Ee = Te(m.keyboardCell),
            Le = Math.max(0, Math.min(we - 1, Ee.row + oe[0])),
            Ce = Math.max(0, Math.min(we - 1, Ee.col + oe[1]));
          ((m.keyboardCell = ye(Le, Ce)), j());
          return;
        }
        (f.key === "Enter" || f.key === " ") &&
          (f.preventDefault(), (m.keyboardMode = !0), j(), O(m.keyboardCell));
        return;
      }
      let x = {
        ArrowDown: [1, 0],
        ArrowLeft: [0, -1],
        ArrowRight: [0, 1],
        ArrowUp: [-1, 0],
      }[f.key];
      if (!x) return;
      f.preventDefault();
      let R = Te(m.path[m.path.length - 1]),
        D = R.row + x[0],
        M = R.col + x[1];
      if (D < 0 || M < 0 || D >= we || M >= we) {
        L(ne("Stay inside the grid"), !0);
        return;
      }
      O(ye(D, M));
    }));
  let w = () => {
      (l.forEach((f, E) => {
        f.hidden = E !== m.tutorialIndex;
      }),
        g.forEach((f, E) => {
          f.classList.toggle("is-active", E === m.tutorialIndex);
        }),
        (_.disabled = m.tutorialIndex === 0),
        (S.textContent = ne(
          m.tutorialIndex === l.length - 1 ? "Start game" : "Next",
        )));
    },
    U = () => {
      ((u.hidden = !0),
        (document.body.style.overflow = I),
        co(),
        t.focus({ preventScroll: !0 }));
    },
    fe = ({ manual: f = !1 } = {}) => {
      ((m.tutorialIndex = 0),
        (m.tutorialOpenedManually = f),
        (I = document.body.style.overflow),
        (document.body.style.overflow = "hidden"),
        (u.hidden = !1),
        w(),
        window.setTimeout(() => S.focus(), 0));
    };
  return (
    _.addEventListener("click", () => {
      ((m.tutorialIndex = Math.max(0, m.tutorialIndex - 1)), w());
    }),
    S.addEventListener("click", () => {
      if (m.tutorialIndex < l.length - 1) {
        ((m.tutorialIndex += 1), w());
        return;
      }
      U();
    }),
    u.addEventListener("keydown", (f) => {
      f.key === "ArrowLeft" && m.tutorialIndex > 0
        ? (f.preventDefault(), (m.tutorialIndex -= 1), w())
        : f.key === "ArrowRight" && m.tutorialIndex < l.length - 1
          ? (f.preventDefault(), (m.tutorialIndex += 1), w())
          : f.key === "Escape" &&
            m.tutorialOpenedManually &&
            (f.preventDefault(), U());
    }),
    s.addEventListener("click", () => C()),
    p.addEventListener("click", () => C()),
    d.addEventListener("click", () => fe({ manual: !0 })),
    j(),
    {
      openForPage() {
        lo() || window.requestAnimationFrame(() => fe());
      },
      reset: C,
      state: m,
    }
  );
}
var $e = null,
  pn = !1;
function hn() {
  let e = document.getElementById(_t);
  if (!e) return null;
  if ($e?.page === e) return $e;
  let t = po(e);
  return t
    ? (($e = { ...t, page: e }),
      pn ||
        ((pn = !0),
        document.addEventListener("page:shown", (a) => {
          a.detail?.id === _t && $e?.openForPage();
        })),
      e.classList.contains("active") && $e.openForPage(),
      $e)
    : null;
}
var mo = {
    incomplete_input: "",
    posterior_disease_first: "Assess posterior disease first.",
    retinal_same_day: "Same-day retinal assessment.",
    normal_reflex_very_poor_va_early: "Early specialist assessment.",
    normal_reflex_untestable_va_early: "Specialist assessment advised.",
    normal_reflex_reduced_va_recheck: "Check non-cataract causes.",
    normal_reflex_mild_review: "Review vision and other causes.",
    normal_reflex_no_referral: "No cataract referral now.",
    normal_reflex_non_cataract_reframe: "Check non-cataract causes.",
    cataract_priority_white: "Prompt cataract assessment.",
    white_reflex_prompt_review: "Prompt eye assessment.",
    white_reflex_recheck: "Confirm white reflex promptly.",
    cataract_poor_view_assessment: "Further eye assessment needed.",
    cataract_routine: "Cataract assessment advised.",
    cataract_priority_very_poor_va: "Prompt cataract assessment.",
    cataract_untestable_va_assess: "Assess before cataract referral.",
    cataract_early_referral_reduced_va: "Early cataract assessment.",
    cataract_early_review_mild_va: "Cataract assessment advised.",
    cataract_early_review_va_6_6: "Review if function affected.",
    child_cataract_prompt_referral: "Paediatric eye review.",
    child_white_reflex_urgent: "Urgent paediatric eye review.",
    child_reduced_vision_early_assessment: "Early paediatric eye review.",
    rapd_non_cataract_first: "Check retinal or nerve cause.",
    recheck_investigate_first: "Re-check key findings.",
    complete_missing_checks: "Complete missing checks.",
    urgent_same_day_investigation: "Same-day eye assessment.",
  },
  pa = {
    fix_follow_with_non_child_age: "Re-check age or VA method.",
    normal_reflex_with_reduced_va: "Reduced VA needs another cause.",
    white_reflex_with_relatively_good_va: "VA and white reflex mismatch.",
    abnormal_reflex_with_va_6_6: "VA and reflex mismatch.",
    near_poor_with_good_distance: "Re-check near VA or refraction.",
    near_good_with_poor_distance: "Re-check VA method or refraction.",
    sudden_onset_with_cataract_pattern: "Sudden loss suggests another cause.",
    pain_with_cataract_pattern: "Pain/redness suggests another cause.",
    normal_reflex_with_poor_back_view: "Reflex and back view mismatch.",
    pain_without_eye_count: "Record one or two eyes.",
  },
  ho = {
    child_case_posterior_review:
      "Paediatric review after posterior assessment.",
    child_cataract_delay_risk: "Avoid delay: visual development risk.",
    child_reduced_vision_early_review: "Avoid delay: amblyopia risk.",
    child_white_reflex_causes: "Exclude other white-reflex causes.",
    age_unknown_caution: "Age affects urgency.",
    younger_age_secondary_causes:
      "Ask about trauma, steroids, diabetes and eye inflammation.",
    posterior_detached_same_day: "Same-day retinal assessment.",
    posterior_diabetic_first: "Retinal disease may limit outcome.",
    posterior_cupping_glaucoma: "Possible glaucoma: assess.",
    near_va_n8: "Near VA slightly reduced.",
    near_va_n12: "Near VA reduced.",
    near_va_n18: "Near VA poor.",
    near_va_n36: "Near VA very poor.",
    pupil_abnormal_review: "Abnormal pupil: prompt review.",
    front_abnormal_prognosis_limited: "Scar may limit visual outcome.",
    neuro_red_flags: "Possible retinal or nerve cause.",
    urgency_note_urgent: "Same-day eye assessment.",
    urgency_note_early: "Early review advised.",
    urgent_trigger_painful_one_or_sudden: "Sudden visual loss.",
    urgent_features_history_exam: "Urgent examination features.",
    assessment_incomplete_record_fields: "Complete missing checks.",
  },
  rt = {
    posterior_detached_same_day: 0,
    posterior_diabetic_first: 1,
    posterior_cupping_glaucoma: 2,
    child_cataract_delay_risk: 3,
    child_white_reflex_causes: 4,
    child_reduced_vision_early_review: 5,
    child_case_posterior_review: 6,
    age_unknown_caution: 7,
    urgent_trigger_painful_one_or_sudden: 6,
    urgency_note_urgent: 7,
    fix_follow_with_non_child_age: 8,
    normal_reflex_with_reduced_va: 8,
    white_reflex_with_relatively_good_va: 8,
    abnormal_reflex_with_va_6_6: 8,
    near_poor_with_good_distance: 9,
    near_good_with_poor_distance: 9,
    sudden_onset_with_cataract_pattern: 8,
    pain_with_cataract_pattern: 8,
    normal_reflex_with_poor_back_view: 8,
    urgency_note_early: 9,
    pain_without_eye_count: 10,
    assessment_incomplete_record_fields: 10,
    neuro_red_flags: -2,
    pupil_abnormal_review: -1,
    front_abnormal_prognosis_limited: 13,
    younger_age_secondary_causes: 14,
    near_va_n8: 15,
    near_va_n12: 15,
    near_va_n18: 15,
    near_va_n36: 15,
    urgent_features_history_exam: 16,
  },
  fn = {
    Nuclear:
      "<p>Nuclear: central lens opacity causing blur, usually age-related. Surgery usually helps.</p>",
    Cortical:
      "<p>Cortical: spoke-like peripheral opacities causing blur and glare. Surgery usually helps.</p>",
    Subcapsular:
      "<p>Subcapsular: posterior opacities causing glare and near blur. Surgery usually helps.</p>",
    Mature:
      "<p>Probable mature cataract: dense lens opacity with severe visual loss.</p>",
    "White reflex":
      "<p>White reflex: dense cataract or another cause. Prompt assessment is needed.</p>",
  },
  gn = {
    cupping:
      "<p>Disc cupping may indicate glaucoma. Confirm with appropriate assessment.</p>",
    diabetic: "<p>Retinal disease or scarring may limit visual outcome.</p>",
    "poor view": "<p>Poor view may have lens, retinal or vitreous causes.</p>",
    detached: "<p>Suspected retinal detachment needs same-day assessment.</p>",
  };
function xt(e) {
  return mo[e] || "";
}
function Qe(e) {
  return ho[e] || pa[e] || "";
}
function fo(e) {
  return (e || "").trim().toUpperCase();
}
var st = { black: 0, green: 1, orange: 2, red: 3 },
  yn = {
    observed: 0,
    definite: 0,
    probable: 1,
    possible_incomplete: 1.5,
    possible_pupil: 2,
    possible_competing: 3,
  },
  go = new Set([
    "cataract_routine",
    "cataract_early_review_va_6_6",
    "cataract_early_review_mild_va",
    "normal_reflex_mild_review",
    "normal_reflex_no_referral",
  ]),
  yo = { black: 0, green: 2, orange: 3, red: 3 },
  wn = ["onset", "eyes", "age", "distanceVA", "fundal", "back"],
  wo = {
    pain: "pain/redness",
    pupil: "pupil",
    front: "front eye",
    afferent: "RAPD/light response",
  };
function ve(e, t) {
  let a = st[e] ?? 0;
  return (st[t] ?? a) > a ? t : e;
}
function vo(e) {
  return e === "normal"
    ? "Normal"
    : e === "white"
      ? "White reflex"
      : e === "dark"
        ? "Nuclear"
        : e === "patches"
          ? "Cortical"
          : e === "spots"
            ? "Subcapsular"
            : "";
}
function bo(e) {
  switch (e) {
    case "N8":
      return "near_va_n8";
    case "N12":
      return "near_va_n12";
    case "N18":
      return "near_va_n18";
    case "N36":
      return "near_va_n36";
    default:
      return "";
  }
}
function _o(e, t) {
  return e === "Nil"
    ? "Nil"
    : e === "White reflex"
      ? "White reflex"
      : t === "probable"
        ? `Probable ${e}`
        : t === "possible_pupil" || t === "possible_incomplete"
          ? `Possible ${e}`
          : t === "possible_competing"
            ? `Possible ${e}`
            : e;
}
function Ao(e, t) {
  let a = yo[t] ?? 3,
    n = [...e];
  return (
    t === "red" && (n = n.filter((i) => !i.startsWith("near_va_"))),
    a <= 0 ? [] : n.slice(0, a)
  );
}
function xo(e) {
  return e.length <= 1
    ? e[0] || ""
    : e.length === 2
      ? `${e[0]} and ${e[1]}`
      : `${e.slice(0, -1).join(", ")} and ${e[e.length - 1]}`;
}
function So(e) {
  let t = e.map((a) => wo[a]).filter(Boolean);
  return t.length === 0
    ? Qe("assessment_incomplete_record_fields")
    : `Missing: ${xo(t)}.`;
}
function Eo({
  onsetValue: e,
  eyes: t,
  painYes: a,
  normalizedNearVa: n,
  isPresbyopicAge: i,
  hasNonPaediatricAgeBand: o,
  hasFixFollowDistanceVa: r,
  hasAbnormalFundal: s,
  hasWhiteFundal: d,
  hasPosteriorPriorityDisease: p,
  hasPoorView: c,
  hasMildDistanceLoss: u,
  hasModerateDistanceLoss: l,
  hasSevereDistanceLoss: g,
  hasGoodDistanceVision: _,
  hasPainfulSuddenUnilateral: S,
}) {
  let P = [],
    m = new Set();
  function I(C, W) {
    (P.push(C), W.forEach((O) => m.add(O)));
  }
  (o && r && I("fix_follow_with_non_child_age", ["distanceVA", "age"]),
    !s &&
      (l || g) &&
      I("normal_reflex_with_reduced_va", ["distanceVA", "fundal"]),
    d &&
      (_ || u) &&
      I("white_reflex_with_relatively_good_va", ["distanceVA", "fundal"]));
  let L = !!n,
    B = n === "N5" || n === "N8";
  (L &&
    _ &&
    (n === "N18" || n === "N36") &&
    !i &&
    I("near_poor_with_good_distance", ["distanceVA", "near"]),
    L &&
      B &&
      (g || l) &&
      I("near_good_with_poor_distance", ["distanceVA", "near"]),
    e === "sudden" &&
      s &&
      !p &&
      !S &&
      I("sudden_onset_with_cataract_pattern", ["onset"]),
    a && s && !p && !S && I("pain_with_cataract_pattern", ["pain", "fundal"]),
    !s && c && I("normal_reflex_with_poor_back_view", ["fundal", "back"]),
    a && !t && !p && I("pain_without_eye_count", ["eyes", "pain"]));
  let z = {
      pain_without_eye_count: 0,
      fix_follow_with_non_child_age: 1,
      normal_reflex_with_reduced_va: 2,
      normal_reflex_with_poor_back_view: 3,
      white_reflex_with_relatively_good_va: 4,
      abnormal_reflex_with_va_6_6: 5,
      near_poor_with_good_distance: 6,
      near_good_with_poor_distance: 6,
      sudden_onset_with_cataract_pattern: 7,
      pain_with_cataract_pattern: 8,
    },
    T = [...P]
      .sort((C, W) => {
        let O = z[C] ?? 99,
          ue = z[W] ?? 99;
        return O - ue;
      })
      .slice(0, 2);
  return {
    messages: T.map((C) => pa[C]).filter(Boolean),
    codes: P,
    displayCodes: T,
    fields: [...m],
  };
}
function Co(e) {
  return {
    hasResult: !1,
    actionCode: "incomplete_input",
    actionTextCode: "incomplete_input",
    severityRank: st.black,
    flags: ["incomplete_input"],
    ruleTrace: ["input:incomplete"],
    missingFields: e,
    requiredInputKeys: wn,
    cataractType: "",
    cataractPhenotype: "",
    cataractConfidenceLabel: "",
    actionText: "",
    actionNotes: [],
    actionNoteCodes: [],
    actionColour: "black",
    recheckFieldKeys: [],
    urgencyNote: "",
    urgencyNoteColour: "",
    explanations: { cataract: "", back: "" },
  };
}
function ko(e, t) {
  let a = fn[e] || "",
    n = gn[t] || "";
  return { cataract: a, back: n };
}
function vn({
  onsetValue: e,
  ageBand: t,
  distanceVA: a,
  nearVAValue: n,
  eyes: i,
  painYes: o,
  painRecorded: r,
  pupilSelected: s,
  pupilRecorded: d,
  pupilAbnormal: p,
  frontPresent: c,
  frontRecorded: u,
  afferentConcern: l,
  afferentRecorded: g,
  rapdPresent: _,
  rapdRecorded: S,
  directionLightPoor: P,
  lightRecorded: m,
  fundalSelection: I,
  backSelection: L,
}) {
  let B = [];
  if (
    (e || B.push("onset"),
    i || B.push("eyes"),
    t || B.push("age"),
    a || B.push("distanceVA"),
    I || B.push("fundal"),
    L || B.push("back"),
    B.length > 0)
  ) {
    let N = Co(B),
      Y =
        L === "detached"
          ? "retinal_same_day"
          : e === "sudden"
            ? "urgent_same_day_investigation"
            : ["baby", "child", "adolescent", "teenager"].includes(t) &&
                I === "white"
              ? "child_white_reflex_urgent"
              : I === "white"
                ? "white_reflex_prompt_review"
                : "";
    Y &&
      (Object.assign(N, {
        actionCode: Y,
        actionTextCode: Y,
        actionText: xt(Y),
        actionColour: "red",
        severityRank: 3,
      }),
      N.flags.push("urgent_signal"));
    let yt = typeof l == "boolean" ? l : !!_ || !!P,
      ea = ["cupping", "diabetic"].includes(L);
    if (!Y && (o || p || c || yt || ea)) {
      let ta = ea
        ? "posterior_disease_first"
        : yt
          ? "rapd_non_cataract_first"
          : "recheck_investigate_first";
      Object.assign(N, {
        actionCode: ta,
        actionTextCode: ta,
        actionText: xt(ta),
        actionColour: "orange",
        severityRank: 2,
      });
    }
    let ge = [];
    return (
      yt && ge.push("neuro_red_flags"),
      p && ge.push("pupil_abnormal_review"),
      o &&
        (ge.push("pain_with_cataract_pattern"),
        Y || ge.push("urgency_note_early")),
      c && ge.push("front_abnormal_prognosis_limited"),
      ea &&
        ge.push(
          L === "cupping"
            ? "posterior_cupping_glaucoma"
            : "posterior_diabetic_first",
        ),
      (N.actionNoteCodes = ge),
      (N.actionNotes = ge.map(Qe).filter(Boolean)),
      ge.length &&
        N.ruleTrace.push("safety:recorded_concerns_incomplete_input"),
      N
    );
  }
  let V = t === "teenager" ? "adolescent" : t,
    z = I === "white" && L === "normal" ? "poor view" : L,
    j = z !== L,
    T = typeof r == "boolean" ? r : !0,
    C = !!p || (typeof d == "boolean" ? d : !0),
    W = typeof u == "boolean" ? u : !0,
    O =
      typeof g == "boolean"
        ? g
        : typeof S == "boolean" || typeof m == "boolean"
          ? !!S && !!m
          : !0,
    ue = typeof l == "boolean" ? l : !!_ || !!P,
    J = [];
  (T || J.push("pain"),
    C || J.push("pupil"),
    W || J.push("front"),
    O || J.push("afferent"));
  let A = new Set(),
    w = ["input:complete"];
  j &&
    (A.add("normalized_white_back_forced_poor_view"),
    w.push("input:normalized_white_back"));
  let U = "",
    fe = "",
    f = vo(I),
    E = I === "white" ? "observed" : "definite",
    x = ["cupping", "diabetic", "detached"].includes(z),
    R = I === "white",
    D = I !== "normal",
    M = z === "poor view",
    K = a === "unable_test",
    oe = a === "fix_follow_good" || a === "fix_follow_poor",
    Ee = a === "HM" || a === "6/60" || a === "fix_follow_poor" || K,
    Le = a === "6/36",
    Ce = a === "6/12",
    it = a === "fix_follow_good",
    We = a === "6/6",
    He = ["baby", "child", "adolescent"].includes(V),
    h = V === "unknown",
    y = !!V && !He && !h,
    H = ["middle_aged", "elderly", "very_elderly"].includes(V),
    k = ["young_adult", "adult"].includes(V),
    G =
      R &&
      e === "gradual" &&
      y &&
      (a === "6/60" || a === "HM") &&
      T &&
      !o &&
      C &&
      !p &&
      W &&
      !c &&
      O &&
      !ue &&
      !x;
  (I === "normal"
    ? ((f = "Nil"), w.push("phenotype:normal_reflex"))
    : w.push("phenotype:abnormal_reflex"),
    G &&
      ((f = "Mature"),
      (E = "probable"),
      w.push("phenotype:probable_mature_pattern")));
  let v = "black",
    $ = [],
    X = new Map();
  function F(N, Y) {
    ((U = N), (fe = N), Y && (v = Y));
  }
  function q(N) {
    N && !$.includes(N) && $.push(N);
  }
  if (x) {
    let N = z === "detached" ? "red" : "orange";
    (F(z === "detached" ? "retinal_same_day" : "posterior_disease_first", N),
      A.add("posterior_priority"),
      f !== "Nil" &&
        f !== "White reflex" &&
        ((E = "possible_competing"), A.add("competing_pathology")),
      N === "red" && A.add("urgent_signal"),
      w.push("core:posterior_override"));
  } else
    D
      ? (w.push("core:abnormal_reflex_pathway"),
        R
          ? (F(
              G ? "cataract_priority_white" : "white_reflex_prompt_review",
              "red",
            ),
            A.add("urgent_signal"),
            w.push("reflex:white"))
          : M
            ? (F("cataract_poor_view_assessment", "orange"),
              w.push("reflex:poor_view"))
            : (F("cataract_routine", "green"),
              w.push("reflex:non_white_abnormal")),
        R ||
          (K
            ? (F("cataract_untestable_va_assess", "orange"),
              w.push("va:untestable"))
            : Ee
              ? (F("cataract_priority_very_poor_va", "orange"),
                w.push("va:severe_loss"))
              : Le && !M
                ? (F("cataract_early_referral_reduced_va", "orange"),
                  w.push("va:moderate_loss"))
                : Ce && !M
                  ? (F("cataract_early_review_mild_va", "orange"),
                    w.push("va:mild_loss"))
                  : We &&
                    !M &&
                    (F("cataract_early_review_va_6_6", "orange"),
                    w.push("va:good"))))
      : (w.push("core:normal_reflex_pathway"),
        K
          ? (F("normal_reflex_untestable_va_early", "orange"),
            A.add("non_cataract_consideration"),
            w.push("va:untestable"))
          : Ee
            ? (F("normal_reflex_very_poor_va_early", "orange"),
              A.add("non_cataract_consideration"),
              w.push("va:severe_loss"))
            : Le
              ? (F("normal_reflex_reduced_va_recheck", "orange"),
                A.add("non_cataract_consideration"),
                w.push("va:moderate_loss"))
              : Ce
                ? (F("normal_reflex_mild_review", "orange"),
                  w.push("va:mild_loss"))
                : (F("normal_reflex_no_referral", "black"), w.push("va:good")));
  let ee = fo(n);
  if (
    (He
      ? (A.add("age_child"),
        w.push("age:child"),
        x
          ? (q("child_case_posterior_review"),
            R &&
              (q("child_white_reflex_causes"),
              z !== "detached" && F("child_white_reflex_urgent", "red")),
            w.push("age:child_posterior_note"))
          : D
            ? ((v = ve(v, R ? "red" : "orange")),
              U !== "urgent_same_day_investigation" &&
                F(
                  R
                    ? "child_white_reflex_urgent"
                    : "child_cataract_prompt_referral",
                  v,
                ),
              q(R ? "child_white_reflex_causes" : "child_cataract_delay_risk"),
              w.push("age:child_cataract_adjustment"))
            : !We &&
              !it &&
              ((v = ve(v, "orange")),
              U !== "urgent_same_day_investigation" &&
                F("child_reduced_vision_early_assessment", v),
              q("child_reduced_vision_early_review"),
              w.push("age:child_reduced_vision_adjustment")))
      : k &&
        D &&
        !x &&
        (q("younger_age_secondary_causes"),
        A.add("age_younger_atypical"),
        w.push("age:younger_atypical_note")),
    h &&
      (D || !We) &&
      (q("age_unknown_caution"),
      A.add("age_unknown"),
      w.push("age:unknown_caution")),
    x &&
      (z === "detached"
        ? q("posterior_detached_same_day")
        : z === "diabetic"
          ? q("posterior_diabetic_first")
          : z === "cupping" && q("posterior_cupping_glaucoma")),
    ee && ee !== "N5")
  ) {
    let N = bo(ee);
    N && (q(N), A.add("near_va_modifier"), w.push("near_va:modifier_added"));
  }
  function Q(N) {
    let Y = yn[E] ?? 0;
    (yn[N] ?? Y) > Y && (E = N);
  }
  let Z = i === "one" && e === "sudden" && !!o;
  (Z &&
    ((v = ve(v, "red")),
    A.add("urgent_signal"),
    A.add("painful_sudden_unilateral"),
    w.push("safety:painful_sudden_unilateral"),
    f !== "Nil" && (Q("possible_competing"), A.add("competing_pathology"))),
    C
      ? p &&
        (q("pupil_abnormal_review"),
        (v = ve(v, "orange")),
        A.add("pupil_abnormal"),
        A.add("urgent_signal"),
        w.push("pupil:abnormal"),
        f !== "Nil" && Q("possible_pupil"))
      : D &&
        f !== "Nil" &&
        (A.add("pupil_not_recorded"), w.push("pupil:not_recorded")),
    c &&
      (q("front_abnormal_prognosis_limited"),
      (v = ve(v, "orange")),
      A.add("front_abnormal"),
      w.push("front:abnormal")));
  let Ge = ue;
  Ge &&
    (q("neuro_red_flags"),
    (v = ve(v, "orange")),
    A.add("neuro_red_flags"),
    A.add("afferent_concern"),
    w.push("neuro:red_flags"),
    !x &&
      !R &&
      U !== "urgent_same_day_investigation" &&
      (F("rapd_non_cataract_first", v), w.push("neuro:main_action_override")),
    f !== "Nil" &&
      !x &&
      (Q("possible_competing"),
      A.add("competing_pathology"),
      w.push("neuro:competing_confidence")));
  let de = Eo({
    onsetValue: e,
    eyes: i,
    painYes: o,
    normalizedNearVa: ee,
    isPresbyopicAge: H,
    hasNonPaediatricAgeBand: y,
    hasFixFollowDistanceVa: oe,
    hasAbnormalFundal: D,
    hasWhiteFundal: R,
    hasPosteriorPriorityDisease: x,
    hasPoorView: M,
    hasMildDistanceLoss: Ce,
    hasModerateDistanceLoss: Le,
    hasSevereDistanceLoss: Ee,
    hasGoodDistanceVision: We,
    hasPainfulSuddenUnilateral: Z,
  });
  (de.displayCodes.length > 0 &&
    (de.displayCodes.forEach((N) => q(N)),
    (v = ve(v, "orange")),
    A.add("consistency_warning"),
    A.add("requires_recheck"),
    de.codes.forEach((N) => A.add(`consistency:${N}`)),
    w.push("consistency:warnings_added")),
    de.codes.includes("white_reflex_with_relatively_good_va") &&
      ["white_reflex_prompt_review", "cataract_priority_white"].includes(U) &&
      e === "gradual" &&
      !o &&
      !p &&
      !c &&
      !Ge &&
      !He &&
      (F("white_reflex_recheck", "red"),
      A.add("white_relatively_good_va_recheck_override"),
      A.add("recheck_override"),
      w.push("consistency:white_relatively_good_va_override")));
  let Ha = new Set(de.fields);
  if (J.length > 0) {
    (f !== "Nil" &&
      f !== "White reflex" &&
      (Q("possible_incomplete"),
      w.push("phenotype:provisional_missing_checks")),
      A.add("incomplete_assessment"),
      J.forEach((Y) => {
        A.add(`missing_assessment:${Y}`);
      }),
      w.push("assessment:incomplete"),
      A.add("requires_recheck"),
      X.set("assessment_incomplete_record_fields", So(J)),
      q("assessment_incomplete_record_fields"),
      J.forEach((Y) => Ha.add(Y)),
      w.push("assessment:note_added"));
    let N = [
      "posterior_disease_first",
      "rapd_non_cataract_first",
      "child_cataract_prompt_referral",
      "child_reduced_vision_early_assessment",
    ].includes(U);
    v !== "red" &&
      !N &&
      (F("complete_missing_checks", "orange"),
      w.push("assessment:main_action_override"));
  }
  let Ai = e === "sudden" || !!o || !!p || !!c || ue;
  A.has("requires_recheck") &&
    Ai &&
    go.has(U) &&
    (F("recheck_investigate_first", v),
    (v = ve(v, "orange")),
    A.add("recheck_override"),
    w.push("consistency:high_risk_override"));
  let ke = "",
    Jt = "",
    Pe = "";
  (e === "sudden"
    ? ((ke = "urgency_note_urgent"),
      (Jt = Qe(ke)),
      (Pe = "red"),
      A.add("urgent_signal"),
      A.add("urgency_note"),
      w.push("urgency:urgent_note"))
    : o &&
      ((ke = "urgency_note_early"),
      (Jt = Qe(ke)),
      (Pe = "orange"),
      A.add("urgency_note"),
      w.push("urgency:early_note")),
    (Pe === "orange" || Pe === "red") &&
      ((v = ve(v, Pe)), w.push("urgency:colour_escalation")),
    Pe === "red" &&
      U !== "urgent_same_day_investigation" &&
      U !== "retinal_same_day" &&
      (F("urgent_same_day_investigation", "red"),
      A.add("urgent_main_action"),
      w.push("urgency:main_action_override")),
    U === "urgent_same_day_investigation" &&
      f !== "Nil" &&
      !x &&
      (Q("possible_competing"),
      A.add("competing_pathology"),
      w.push("urgency:competing_confidence")),
    U === "normal_reflex_no_referral" &&
      v !== "black" &&
      ((fe = "normal_reflex_non_cataract_reframe"),
      w.push("core:normal_reflex_non_cataract_reframe")),
    ke &&
      Pe &&
      !(
        ke === "urgency_note_urgent" && U === "urgent_same_day_investigation"
      ) &&
      !$.includes(ke) &&
      (q(ke), w.push("urgency:note_added_to_checks")),
    U === "urgent_same_day_investigation" &&
      !$.includes("urgent_trigger_painful_one_or_sudden") &&
      (q("urgent_trigger_painful_one_or_sudden"),
      w.push("urgency:trigger_note_added")),
    v === "red" && A.add("urgent_signal"),
    $.sort((N, Y) => (rt[N] ?? 99) - (rt[Y] ?? 99)),
    U === "urgent_same_day_investigation" &&
      $.length === 0 &&
      q("urgent_features_history_exam"),
    $.sort((N, Y) => (rt[N] ?? 99) - (rt[Y] ?? 99)));
  let xi = $.length;
  (($ = Ao($, v)),
    $.length < xi && (A.add("notes_trimmed"), w.push("notes:policy_trimmed")));
  let Si = xt(fe || U),
    Ei = $.map((N) => X.get(N) || Qe(N)).filter(Boolean),
    Ci = _o(f, E);
  return {
    hasResult: !0,
    actionCode: U,
    actionTextCode: fe || U,
    severityRank: st[v] ?? st.black,
    flags: [...A].sort(),
    ruleTrace: w,
    missingFields: [],
    requiredInputKeys: wn,
    cataractType: Ci,
    cataractPhenotype: f,
    cataractConfidenceLabel: E,
    actionText: Si,
    actionNotes: Ei,
    actionNoteCodes: $,
    actionColour: v,
    recheckFieldKeys: [...Ha],
    urgencyNote: Jt,
    urgencyNoteColour: Pe,
    explanations: ko(f, z),
  };
}
var Po = {
    onsetValue: "gradual",
    ageBand: "elderly",
    eyes: "two",
    distanceVA: "6/36",
    nearVAValue: "N18",
    painYes: !1,
    painRecorded: !0,
    pupilRecorded: !0,
    pupilAbnormal: !1,
    frontRecorded: !0,
    frontPresent: !1,
    afferentRecorded: !0,
    afferentConcern: !1,
    fundalSelection: "dark",
    backSelection: "normal",
  },
  ma = [
    {
      id: "child-white-reflex",
      retinalViews: { right: "obscured", left: "clear" },
      findings: {
        ageBand: "baby",
        eyes: "one",
        distanceVA: "fix_follow_poor",
        nearVAValue: "",
        fundalSelection: "white",
        backSelection: "poor view",
      },
      lines: [
        "This is a 1-year-old child. The mother is giving the history.",
        "Only the right eye is affected; the left eye appears normal.",
        "The mother says she noticed a white pupil when the child was very young.",
        "She says the child does not fix on or follow a toy well with that eye.",
        "She reports no pain or redness.",
      ],
      answer: "White reflex in a child \u2014 urgent paediatric eye review",
      distractors: [
        "Age-related nuclear cataract",
        "Normal eyes \u2014 no review needed",
        "Cortical cataract \u2014 routine adult referral",
      ],
      explanation:
        "A white pupil in a child needs urgent review by an eye specialist. It may be a cataract, but retinoblastoma must be ruled out. The retina cannot be seen clearly.",
      nextStep: "Arrange urgent review by a paediatric eye specialist.",
    },
    {
      id: "nuclear",
      retinalViews: { right: "diffuse", left: "diffuse" },
      findings: {},
      lines: [
        "This patient is 74 years old.",
        "Both eyes are affected.",
        "The patient reports that their vision has become cloudy slowly over many months.",
        "There is no pain or redness.",
        "Their worse eye reads 6/36 at distance and N18 near.",
      ],
      answer: "Nuclear cataract \u2014 early cataract assessment",
      distractors: [
        "Cortical cataract",
        "Subcapsular cataract",
        "Normal reflex \u2014 no cataract referral",
      ],
      explanation:
        "Slow, painless blur and a dull reflex suggest a nuclear cataract. The cloudy lens also makes the retina harder to see. Check the lens and ask how vision affects daily life. VA alone does not decide the need for surgery.",
      nextStep: "Arrange a cataract assessment and check the retina.",
    },
    {
      id: "cortical",
      retinalViews: { right: "mild", left: "clear" },
      findings: {
        fundalSelection: "patches",
        distanceVA: "6/12",
        nearVAValue: "N12",
      },
      lines: [
        "This patient is 68 years old.",
        "Both eyes are affected, one more than the other.",
        "The patient reports a gradual change in vision.",
        "They say glare makes seeing more difficult.",
        "There is no pain or redness. Their worse-eye distance VA is 6/12.",
      ],
      answer: "Cortical cataract \u2014 cataract assessment advised",
      distractors: [
        "Nuclear cataract",
        "Subcapsular cataract",
        "Retinal detachment \u2014 same-day assessment",
      ],
      explanation:
        "Spoke-like shadows suggest a cortical cataract. The retina may still be seen through clearer parts of the lens. Glare can make daily tasks difficult, so arrange a cataract assessment.",
      nextStep: "Arrange a cataract assessment and a full retinal check.",
    },
    {
      id: "subcapsular",
      retinalViews: { right: "central", left: "clear" },
      findings: {
        ageBand: "middle_aged",
        eyes: "one",
        fundalSelection: "spots",
      },
      lines: [
        "This patient is 52 years old.",
        "The right eye is affected; the left eye appears normal.",
        "The blur has developed gradually.",
        "The patient reports difficulty with glare and reading small print.",
        "There is no pain or redness. Distance VA is 6/36 and near VA is N18.",
      ],
      answer: "Posterior subcapsular cataract \u2014 early cataract assessment",
      distractors: [
        "Nuclear cataract",
        "Cortical cataract",
        "Normal eyes \u2014 no review needed",
      ],
      explanation:
        "A central shadow in the reflex with glare and reading difficulty suggests a posterior subcapsular cataract. The lens can blur the retinal view. Check the lens with a slit lamp and examine the retina.",
      nextStep: "Arrange an early cataract assessment.",
    },
    {
      id: "mature",
      retinalViews: { right: "obscured", left: "obscured" },
      findings: {
        fundalSelection: "white",
        backSelection: "poor view",
        distanceVA: "HM",
        nearVAValue: "",
      },
      lines: [
        "This patient is 79 years old.",
        "The patient reports that both eyes have slowly become worse over years.",
        "There is no pain or redness.",
        "They can only see hand movements with their worse eye.",
        "Both pupils look white and the back of each eye is difficult to see.",
      ],
      answer: "Probable mature cataract \u2014 prompt cataract assessment",
      distractors: [
        "Normal lens \u2014 no cataract referral",
        "Mild cortical cataract only",
        "Childhood white reflex",
      ],
      explanation:
        "A white lens and very poor vision suggest a mature cataract. The retina is hidden, so other eye disease cannot be ruled out. An eye specialist may need an ultrasound scan to check behind the lens.",
      nextStep: "Arrange prompt review by an eye specialist.",
    },
    {
      id: "detached",
      retinalViews: { right: "clear", left: "clear" },
      findings: {
        onsetValue: "sudden",
        eyes: "one",
        fundalSelection: "normal",
        backSelection: "detached",
        distanceVA: "6/60",
      },
      lines: [
        "This patient is 67 years old.",
        "Only the right eye is affected; the left eye appears normal.",
        "The patient reports a sudden change in vision today.",
        "They describe a shadow across their vision.",
        "There is no pain or redness. Their affected-eye VA is 6/60.",
      ],
      answer: "Suspected retinal detachment \u2014 same-day retinal assessment",
      distractors: [
        "Nuclear cataract \u2014 routine referral",
        "Cortical cataract",
        "Normal reflex \u2014 reassure without assessment",
      ],
      explanation:
        "Sudden loss of vision with a curtain-like shadow may be a retinal detachment. The edited right-eye image shows a raised, folded retina. A normal red reflex does not rule this out. The patient needs a retinal check today.",
      nextStep: "Arrange same-day assessment by a retinal specialist.",
    },
    {
      id: "cupping",
      retinalViews: { right: "diffuse", left: "diffuse" },
      findings: { fundalSelection: "dark", backSelection: "cupping" },
      lines: [
        "This patient is 72 years old.",
        "The patient reports a slow change in vision in both eyes.",
        "There is no pain or redness.",
        "Their worse-eye distance VA is 6/36.",
        "The examination also shows a cupped optic disc.",
      ],
      answer:
        "Possible cataract with disc cupping \u2014 assess posterior disease first",
      distractors: [
        "Nuclear cataract alone explains everything",
        "Retinal detachment",
        "Normal back of eye \u2014 no further assessment",
      ],
      explanation:
        "A cloudy lens may explain the dull reflex, but the large optic disc cup may be a sign of glaucoma. Check the eye pressure and visual fields. Do not assume the cataract explains all the vision loss.",
      nextStep:
        "Arrange a glaucoma assessment as well as a cataract assessment.",
    },
    {
      id: "retinal-disease",
      retinalViews: { right: "mild", left: "mild" },
      nextStep:
        "Arrange urgent review by a retinal specialist. Do not delay this for cataract treatment.",
      findings: { backSelection: "diabetic", fundalSelection: "patches" },
      lines: [
        "This patient is 70 years old.",
        "The patient reports gradually worsening blur in both eyes.",
        "They have longstanding diabetes and report no pain or redness.",
        "Their worse-eye distance VA is 6/36.",
        "The retinal examination shows new vessels at the disc and elsewhere.",
      ],
      answer:
        "Proliferative diabetic retinopathy with possible cataract \u2014 urgent retinal assessment",
      distractors: [
        "Cortical cataract alone \u2014 ignore the retina",
        "Normal retina",
        "Childhood cataract",
      ],
      explanation:
        "New blood vessels at the optic disc and elsewhere suggest proliferative diabetic retinopathy. This needs urgent treatment by a retinal specialist. A cataract does not explain these new vessels.",
    },
  ].map((e) => {
    let t = { ...Po, ...e.findings };
    return { ...e, findings: t, result: vn(t) };
  }),
  lt = "/subapp/Fundal Reflex/assets/case-thumbnails/",
  St = {
    fundal: {
      normal: `${lt}zero.webp`,
      dark: `${lt}bilateral-dull-reflex.webp`,
      patches: `${lt}right-big-cortical-left-small-cortical.webp`,
      spots: `${lt}bilateral-subcapsular-cataract.webp`,
      white: `${lt}zero.webp`,
    },
    back: {
      normal: "/subapp/diabetic/assets/images/diabetic/case-01_thumb.webp",
      cupping: "/subapp/Discs/assets/images/discs/case-04_thumb.webp",
      diabetic: "/subapp/diabetic/assets/images/diabetic/case-03_thumb.webp",
      detached: "/images/quiz/cataract/retinal-detachment-reference-v2.webp",
      "poor view": "/subapp/diabetic/assets/images/diabetic/case-01_thumb.webp",
    },
  },
  bn = {
    normal: "right",
    cupping: "right",
    diabetic: "right",
    detached: "right",
    "poor view": "right",
  };
function _n(e, t) {
  return e.retinalViews[t];
}
function An(e) {
  let t = {
    fundal: e.findings.fundalSelection,
    back: e.findings.backSelection,
  };
  return {
    right: { ...t },
    left:
      e.findings.eyes === "one"
        ? { fundal: "normal", back: "normal" }
        : { ...t },
  };
}
var ga = "cataractCaseQuizPage",
  Et = null;
function b(e, t, a) {
  let n = document.createElement(e);
  return (t && (n.className = t), a != null && (n.textContent = a), n);
}
function le(e, t, a) {
  let n = b("button", t, e);
  return ((n.type = "button"), n.addEventListener("click", a), n);
}
function ha(e, t = !1) {
  let a = b("p", "casechat-resultWhy");
  t && a.classList.add("cataract-quiz-feedback-summary");
  let n = t ? b("strong") : a,
    i =
      /\burgent review\b|\burgent\b|\breferrals?\b|\brefer(?:red|ring)?\b|\bsame-day\b/gi,
    o = 0;
  for (let r of e.matchAll(i))
    (n.append(document.createTextNode(e.slice(o, r.index))),
      n.append(b("span", "cataract-quiz-urgent-term", r[0])),
      (o = r.index + r[0].length));
  return (n.append(document.createTextNode(e.slice(o))), t && a.append(n), a);
}
function fa(e) {
  let t = [...e];
  for (let a = t.length - 1; a > 0; a -= 1) {
    let n = Math.floor(Math.random() * (a + 1));
    [t[a], t[n]] = [t[n], t[a]];
  }
  return t;
}
function xn(e) {
  Et?.setActive(e === ga);
}
function Sn({ showPage: e } = {}) {
  let t = document.getElementById(ga);
  if (!t || Et?.page === t) return;
  Et?.dispose();
  let a = t.querySelector(".casechat-log"),
    n = t.querySelector(".caseTimer"),
    i = n.querySelector("text"),
    o = n.querySelector(".caseTimer__fg"),
    r = t.querySelector(".casechat-modal"),
    s = r.querySelector(".casechat-modalCard");
  s.classList.add("casechat-modal__content");
  let d = b("div", "cataract-quiz-footer");
  a.after(d);
  let p = fa(ma),
    c = () =>
      p.map((h) => ({
        item: h,
        elapsed: 0,
        revealed: 0,
        attempts: 2,
        options: fa([h.answer, ...h.distractors]),
        wrongAnswers: [],
        selected: null,
        outcome: null,
      })),
    u = c(),
    l = 0,
    g = !1,
    _ = !1,
    S = null,
    P = 0,
    m,
    I = [],
    L,
    B = !1,
    V = "",
    z = () => u[l],
    j = () => u.filter((h) => h.outcome),
    T = () => j().filter((h) => h.outcome.ok).length;
  function C(h) {
    window.I18N?.applyTranslations?.(h);
  }
  function W(h, y = "system") {
    let H = b("div", `casechat-bubble casechat-bubble--${y}`);
    return (
      H.append(
        b("div", y === "system" ? "casechat-system" : "casechat-text", h),
      ),
      a.append(H),
      C(H),
      H
    );
  }
  function O() {
    (clearInterval(S), (S = null));
  }
  function ue() {
    let h = Math.max(0, 90 - Math.floor((z()?.elapsed || 0) / 1e3));
    ((i.textContent = String(h)),
      n.setAttribute("aria-label", `Case timer: ${h} seconds remaining`),
      (o.style.strokeDasharray = "100 100"),
      (o.style.strokeDashoffset = String((1 - h / 90) * 100)),
      (o.style.stroke = h <= 10 ? "#e41e26" : "#777"),
      (i.style.fill = h <= 10 ? "#e41e26" : "#777"));
  }
  function J({ restoreFocus: h = !0 } = {}) {
    ((r.hidden = !0), (V = ""), h && L?.isConnected && L.focus(), E());
  }
  function A(h, y, H = !1) {
    (r.hidden && (L = document.activeElement),
      O(),
      (V = y),
      s.classList.toggle("cataract-quiz-onboarding", y === "intro"),
      s.replaceChildren());
    let k = b("div", "casechat-modal__top"),
      G = b("h2", "casechat-modal__title", h);
    if (((G.id = "cataractQuizDialogTitle"), k.append(G), H)) {
      let v = le("\u2715", "casechat-modal__close", () => J());
      (v.setAttribute("aria-label", "Close"), k.append(v));
    }
    return (s.append(k), (r.hidden = !1), s);
  }
  function w() {
    (C(s),
      (
        s.querySelector('[role="radio"]:not(:disabled)') ||
        s.querySelector("button")
      )?.focus({ preventScroll: !0 }));
  }
  function U(h) {
    let y = b("div", "cataract-quiz-findings"),
      H = An(h);
    for (let [k, G] of [
      ["fundal", "Fundal Reflex"],
      ["back", "Back of Eye"],
    ]) {
      let v = b("figure");
      ((v.className = `cataract-quiz-exam cataract-quiz-exam--${k}`),
        v.append(b("figcaption", "", G)));
      let $ = b("div", "cataract-quiz-eye-pair");
      for (let [X, F] of [
        ["right", "Right eye"],
        ["left", "Left eye"],
      ]) {
        let q = H[X][k],
          ee = b("div", "cataract-quiz-eye");
        ((ee.dataset.eye = X), (ee.dataset.finding = q));
        let Q = b("div", `cataract-quiz-eye-view cataract-quiz-eye-view--${k}`),
          Z = b("img");
        ((Z.src = St[k][q]),
          (Z.alt = `${F}: ${G} examination image`),
          (Z.width = k === "fundal" ? 344 : 300),
          (Z.height = k === "fundal" ? 125 : 300),
          k === "fundal" &&
            (Z.className = X === "left" ? "is-left-half" : "is-right-half"),
          k === "back" && X !== bn[q] && Z.classList.add("is-mirrored"),
          k === "back" &&
            ((Q.dataset.clarity = _n(h, X)),
            Q.dataset.clarity === "obscured" &&
              (Q.setAttribute("role", "img"),
              Q.setAttribute("aria-label", `${F}: retinal view is obscured`))),
          Q.append(Z),
          ee.append(b("span", "cataract-quiz-eye-label", F), Q),
          $.append(ee));
      }
      (v.append($), y.append(v));
    }
    return y;
  }
  function fe() {
    let h = z();
    if (!(!h || h.outcome || B))
      for (
        ;
        h.revealed < h.item.lines.length && h.elapsed >= 1e3 + h.revealed * 2e3;
      )
        f(h);
  }
  function f(h) {
    let y = I[h.revealed++];
    (y.classList.remove("casechat-bubble--pending"),
      y.removeAttribute("aria-hidden"),
      _ &&
        r.hidden &&
        !h.outcome &&
        window.innerWidth <= 767 &&
        y.scrollIntoView({
          block: "end",
          behavior: window.matchMedia?.("(prefers-reduced-motion: reduce)")
            .matches
            ? "auto"
            : "smooth",
        }));
  }
  function E() {
    (O(),
      !(!_ || !g || !z() || z().outcome || !r.hidden || B || document.hidden) &&
        ((P = Date.now()),
        (S = setInterval(() => {
          let h = z();
          if (!t.isConnected || !_ || !h || h.outcome || B) {
            O();
            return;
          }
          let y = Date.now();
          ((h.elapsed += y - P),
            (P = y),
            fe(),
            ue(),
            h.elapsed >= 9e4 &&
              M(!1, "Time is up.", "No answer (time expired)"));
        }, 250))));
  }
  function x(h) {
    (O(),
      J({ restoreFocus: !1 }),
      (l = Math.max(0, l + h)),
      l >= u.length ? Le() : K());
  }
  function R(h) {
    let y = b("div", "casechat-case-navigation"),
      H = le("Previous Case", "casechat-nextcase casechat-previouscase", () =>
        x(-1),
      );
    ((H.disabled = l === 0),
      y.append(
        H,
        le("Next Case", "casechat-nextcase", () => x(1)),
      ),
      h.append(y));
  }
  function D({ focus: h = !0 } = {}) {
    let y = z();
    if (!y) return;
    let H = A("Submit Answer", "answer", !0);
    H.append(
      b(
        "div",
        "casechat-modal__dxHint",
        y.attempts === 2
          ? "You only get 2 attempts"
          : `Attempts left: ${y.attempts}`,
      ),
    );
    let k = b("div", "casechat-dxlist");
    (k.setAttribute("role", "radiogroup"),
      k.setAttribute("aria-label", "Choose your answer"),
      y.options.forEach((v) => {
        let $ = y.selected === v,
          X = y.wrongAnswers.includes(v),
          F = y.outcome && v === y.item.answer,
          q = le(null, "casechat-dxitem", () => {
            y.outcome ||
              X ||
              ((y.selected = v),
              v === y.item.answer
                ? M(!0, "Correct.", v)
                : ((y.attempts -= 1),
                  y.wrongAnswers.push(v),
                  y.attempts === 0 ? M(!1, "Incorrect.", v) : D()));
          });
        (q.setAttribute("role", "radio"),
          q.setAttribute("aria-checked", String($)),
          q.classList.toggle("is-selected", $),
          q.classList.toggle("is-wrong", X),
          q.classList.toggle("is-correct", !!F),
          (q.disabled = !!y.outcome || X),
          y.outcome && !F && !X && q.classList.add("is-disabled"));
        let ee = b("span", "casechat-radio");
        (ee.setAttribute("aria-hidden", "true"),
          q.append(ee, b("span", "casechat-dxlabel", v)),
          k.append(q));
      }));
    let G = b("div", "cataract-quiz-answer-feedback");
    (G.setAttribute("aria-live", "polite"),
      y.outcome
        ? (G.append(
            b(
              "div",
              y.outcome.ok ? "casechat-resultOk" : "casechat-tryagain",
              y.outcome.message,
            ),
            ha(`Correct answer: ${y.item.answer}.`, !0),
            ha(y.item.explanation),
            ha(`Next step: ${y.item.nextStep || y.item.result.actionText}`, !0),
          ),
          R(G))
        : y.wrongAnswers.length &&
          G.append(b("div", "casechat-tryagain", "Try again")),
      H.append(k, G),
      C(H),
      h &&
        (y.outcome
          ? H.querySelector(
              ".casechat-case-navigation button:not(:disabled)",
            )?.focus({ preventScroll: !0 })
          : w()));
  }
  function M(h, y, H) {
    let k = z();
    if (!(!k || k.outcome)) {
      for (
        O(), k.outcome = { ok: h, message: y, answer: H };
        k.revealed < k.item.lines.length;
      )
        f(k);
      (ae(ga, (j().length / p.length) * 100), D());
    }
  }
  function K() {
    (O(), a.replaceChildren(), (B = !1), (g = !0));
    let h = z();
    ((t.dataset.caseId = h.item.id),
      W(`Case ${l + 1} (${l + 1}/${p.length})`).classList.add(
        "cataract-quiz-case-heading",
      ),
      W(
        "Look at both eyes and read the patient's history. You have 2 attempts.",
      ),
      a.append(U(h.item)),
      (I = h.item.lines.map((H, k) => {
        let G = W(H, "bot");
        return (
          k >= h.revealed &&
            (G.classList.add("casechat-bubble--pending"),
            G.setAttribute("aria-hidden", "true")),
          G
        );
      })),
      (m = le(
        "Submit Answer",
        "casechat-confirm__btn is-ok cataract-quiz-submit",
        () => D(),
      )),
      d.replaceChildren(m),
      ue(),
      C(a),
      E(),
      t.scrollIntoView({ block: "start" }),
      h.outcome && D());
  }
  function oe() {
    (J({ restoreFocus: !1 }), e?.("interactiveLearningPage"));
    let h = document.querySelector(
      '#interactiveLearningPage [data-folder="cataract"]',
    );
    h?.getAttribute("aria-expanded") !== "true" && h?.click();
  }
  function Ee() {
    ((B = !0),
      J({ restoreFocus: !1 }),
      O(),
      a.replaceChildren(),
      d.replaceChildren(),
      W(`You got ${T()} out of ${p.length} correct.`),
      u.forEach(({ item: h, outcome: y }, H) => {
        let k = b("section", "cataract-quiz-review");
        (k.append(
          b("h3", "", `Case ${H + 1} \xB7 ${y?.ok ? "Correct" : "Incorrect"}`),
          U(h),
        ),
          h.lines.forEach((G) => k.append(b("p", "", G))),
          k.append(
            b("p", "", `Your answer: ${y?.answer || "No answer"}`),
            b("p", "", `Correct answer: ${h.answer}`),
            b("p", "", h.explanation),
          ),
          a.append(k));
      }),
      a.append(
        le("Restart", "casechat-nextcase", Ce),
        le("Back to Cataract", "casechat-nextcase", oe),
      ),
      C(a),
      t.scrollIntoView({ block: "start" }));
  }
  function Le() {
    O();
    let h = A("All Cases Completed", "completion");
    h.append(
      b(
        "p",
        "casechat-resultWhy",
        `You got ${T()} out of ${p.length} correct.`,
      ),
    );
    let y = b("div", "casechat-confirm__actions");
    (y.append(
      le("Review", "casechat-confirm__btn", Ee),
      le("Restart", "casechat-confirm__btn is-ok", Ce),
      le("Back to Cataract", "casechat-confirm__btn is-cancel", oe),
    ),
      h.append(y),
      w());
  }
  function Ce() {
    (J({ restoreFocus: !1 }), O(), (p = fa(ma)), (u = c()), (l = 0), K());
  }
  function it(h = 0) {
    let y = [
        ["Compare both eyes", "Check the reflex and retina", "eyes"],
        ["Read the history", "Look for the key clues", "history"],
        ["Choose your answer", "90 seconds \xB7 2 attempts per case", "answer"],
      ],
      [H, k, G] = y[h],
      v = A("Cataract Quiz", "intro");
    v.dataset.step = String(h + 1);
    let $ = b("div", "cataract-quiz-intro-dots");
    ($.setAttribute("aria-label", `Step ${h + 1} of ${y.length}`),
      y.forEach((Q, Z) => $.append(b("span", Z === h ? "is-current" : ""))));
    let X = b("div", `cataract-quiz-intro-visual is-${G}`);
    if ((X.setAttribute("aria-hidden", "true"), G === "eyes")) {
      let Q = b("img");
      ((Q.src = St.fundal.normal), (Q.alt = ""));
      let Z = b("div", "cataract-quiz-intro-retinas");
      for (let Ge of ["right", "left"]) {
        let de = b("img", Ge === "left" ? "is-mirrored" : "");
        ((de.src = St.back.normal), (de.alt = ""), Z.append(de));
      }
      X.append(Q, Z);
    } else if (G === "history")
      [
        "This patient is 74 years old",
        "Gradual blur in both eyes",
        "No pain or redness",
      ].forEach((Q) => X.append(b("div", "cataract-quiz-intro-bubble", Q)));
    else {
      let Q = b("div", "cataract-quiz-intro-stats");
      Q.append(
        b("span", "cataract-quiz-intro-clock", "90s"),
        b("span", "cataract-quiz-intro-attempts", "2 tries"),
      );
      let Z = b("div", "cataract-quiz-intro-options");
      ([
        "Nuclear cataract",
        "Cortical cataract",
        "Subcapsular cataract",
      ].forEach((Ge, de) => {
        let Zt = b(
          "div",
          `casechat-dxitem${de === 1 ? " is-demo-selected" : ""}`,
        );
        (Zt.append(
          b("span", "casechat-radio"),
          b("span", "casechat-dxlabel", Ge),
        ),
          Z.append(Zt));
      }),
        Z.append(b("span", "cataract-quiz-intro-pointer")),
        X.append(Q, Z));
    }
    v.append(
      $,
      X,
      b("span", "cataract-quiz-intro-step", `STEP ${h + 1}`),
      b("h3", "cataract-quiz-intro-title", H),
      b("p", "cataract-quiz-intro-hint", k),
    );
    let F = b("div", "cataract-quiz-intro-actions"),
      q = le("Back", "cataract-quiz-intro-back", () => it(h - 1));
    q.disabled = h === 0;
    let ee = le(
      h === 2 ? "Start" : "Next",
      "casechat-confirm__btn is-ok",
      () => {
        h < 2 ? it(h + 1) : (J({ restoreFocus: !1 }), K());
      },
    );
    (F.append(q, ee), v.append(F), C(v), ee.focus({ preventScroll: !0 }));
  }
  function We(h) {
    if (r.hidden) return;
    if (h.key === "Escape" && V === "answer") {
      (h.preventDefault(), J());
      return;
    }
    if (
      ["ArrowDown", "ArrowUp", "ArrowLeft", "ArrowRight"].includes(h.key) &&
      h.target.matches('[role="radio"]')
    ) {
      h.preventDefault();
      let G = [...s.querySelectorAll('[role="radio"]:not(:disabled)')],
        v = ["ArrowDown", "ArrowRight"].includes(h.key) ? 1 : -1;
      G[(G.indexOf(h.target) + v + G.length) % G.length]?.focus();
    }
    if (h.key !== "Tab") return;
    let y = [...s.querySelectorAll("button:not(:disabled)")],
      H = y[0],
      k = y.at(-1);
    h.shiftKey && document.activeElement === H
      ? (h.preventDefault(), k?.focus())
      : !h.shiftKey &&
        document.activeElement === k &&
        (h.preventDefault(), H?.focus());
  }
  r.addEventListener("keydown", We);
  function He() {
    document.hidden ? O() : E();
  }
  (document.addEventListener("visibilitychange", He),
    (Et = {
      page: t,
      setActive(h) {
        if (((_ = h), !h)) {
          O();
          return;
        }
        try {
          (sessionStorage.setItem(
            "interactiveLearning:returnTarget",
            JSON.stringify({
              routeName: "videos",
              subPageId: "interactiveLearningPage",
            }),
          ),
            sessionStorage.setItem(
              "interactiveLearning:cataractFolderOpen",
              "1",
            ));
        } catch {}
        g ? E() : it();
      },
      dispose() {
        (O(), document.removeEventListener("visibilitychange", He));
      },
    }));
}
var ce = null,
  Mt = "__videosGlobalBound";
window[Mt] == null && (window[Mt] = !1);
var Vn = new Set([
    "glaucomaACDInteractive",
    "glaucomaRAPDFullSwingInteractive",
  ]),
  ya = !1,
  To = "childhoodWorkshop:progress:",
  Io = "diabeticWorkshop:progress:",
  No = "glaucomaWorkshop:progress:",
  Lo = "lessonProgress:",
  qo = "interactiveLearning:returnTarget",
  Mn = "childhoodWorkshop:progress-changed",
  Ta = "diabeticWorkshop:progress-changed",
  Ro = "arclight:lesson-progress-changed",
  Oo = "childhoodWorkshop:route-complete",
  $t = "visualAcuityExaminationScrollPage",
  Qt = "frontOfEyeExaminationScrollPage",
  Xe = "pupilsPecScrollPage",
  Ae = "pupilsAdvancedScrollPage",
  Ze = "cataractScrollPage",
  ht = "fundalReflexExaminationScrollPage",
  Fo = "fundalReflexExaminationScroll",
  Je = "directOphthalmoscopyScrollPage",
  Vo = "directOphthalmoscopyScroll",
  et = "binocularIndirectOphthalmoscopyScrollPage",
  Mo = "binocularIndirectOphthalmoscopyScroll",
  En = 95,
  Do = 5,
  Bo = 15,
  zo = 0.1,
  Wo = 0.8;
function Ho(e) {
  (!Number.isFinite(e) || e < 0) && (e = 0);
  let t = Math.floor(e),
    a = Math.floor(t / 60),
    n = t % 60;
  return `${a}:${String(n).padStart(2, "0")}`;
}
function Se(e) {
  try {
    return JSON.parse(localStorage.getItem(e) || "null");
  } catch {
    return null;
  }
}
function Ia(e) {
  let t = Number(e);
  return Number.isFinite(t) ? Math.max(0, Math.min(100, t)) : 0;
}
function Go(e) {
  let t = Number(e);
  return !Number.isFinite(t) || t <= 0 ? 0 : Math.round(t);
}
function Uo(e) {
  let t = Number(e);
  if (!Number.isFinite(t) || t <= 0) return 0;
  let a = Math.min(Bo, Math.max(Do, t * zo));
  return Math.max(0, Math.max(t - a, t * Wo));
}
function Dn(e, t) {
  let a = Number(t);
  if (!Number.isFinite(a) || a <= 0) return 0;
  let n = Math.max(0, Math.min(a, Number(e) || 0));
  return n >= Uo(a) ? 100 : Math.min(100, (n / a) * 100);
}
function ze(e) {
  return { percent: Ia(e?.percent), updatedAt: Go(e?.updatedAt) };
}
function tt(e, t) {
  try {
    localStorage.setItem(e, JSON.stringify(t));
  } catch {}
}
function Bn(e) {
  return `${To}${e}`;
}
function $o(e) {
  return ze(Se(Bn(e)));
}
function zn(e) {
  return `${Io}${e}`;
}
function Qo(e) {
  return ze(Se(zn(e)));
}
function jo(e) {
  return `${No}${e}`;
}
function Yo(e) {
  return ze(Se(jo(e)));
}
function Ko(e) {
  return `${Lo}${e}`;
}
function Xo(e) {
  return ze(Se(Ko(e)));
}
function Wn(e, t, { mode: a = "max" } = {}) {
  if (!e) return 0;
  let n = Bn(e),
    i = Se(n),
    o = ze(i),
    r = Ia(t),
    s = a === "replace" ? r : Math.max(o.percent, r);
  return (
    (s !== o.percent || !Number.isFinite(Number(i?.percent))) &&
      tt(n, { percent: s, updatedAt: Date.now() }),
    document.dispatchEvent(
      new CustomEvent(Mn, { detail: { target: e, percent: s } }),
    ),
    s
  );
}
function Dt(e, t, { mode: a = "max" } = {}) {
  if (!e) return 0;
  let n = zn(e),
    i = Se(n),
    o = ze(i),
    r = Ia(t),
    s = a === "replace" ? r : Math.max(o.percent, r);
  return (
    (s !== o.percent || !Number.isFinite(Number(i?.percent))) &&
      tt(n, { percent: s, updatedAt: Date.now() }),
    document.dispatchEvent(
      new CustomEvent(Ta, { detail: { target: e, percent: s } }),
    ),
    s
  );
}
function Bt(e) {
  e &&
    (document.dispatchEvent(new CustomEvent(Ta, { detail: { target: e } })),
    document.dispatchEvent(
      new CustomEvent("glaucomaWorkshop:progress-changed", {
        detail: { target: e },
      }),
    ));
}
function Zo() {
  let e = document.getElementById("pupilFullExamVideo");
  if (!e || e.dataset.progressWired === "1") return;
  e.dataset.progressWired = "1";
  let t = zt("pupilFullExamPage"),
    a = () => {
      let n = e.duration || 0;
      if (!n) return;
      let i = Se(t) || {},
        o = Math.max(i.maxTime || 0, e.currentTime || 0);
      (tt(t, {
        maxTime: o,
        duration: n,
        percent: Dn(o, n),
        updatedAt: Date.now(),
      }),
        _e(),
        Bt("pupilFullExamPage"));
    };
  (e.addEventListener("loadedmetadata", a),
    e.addEventListener("timeupdate", a),
    e.addEventListener("ended", () => {
      e.duration &&
        (tt(t, {
          maxTime: e.duration,
          duration: e.duration,
          percent: 100,
          updatedAt: Date.now(),
        }),
        _e(),
        Bt("pupilFullExamPage"));
    }));
}
function zt(e) {
  return `videoProgress:${e}`;
}
function dt(e) {
  return [Xo(e), ze(Se(zt(e))), $o(e), Qo(e), Yo(e)].reduce((a, n) =>
    n.percent > a.percent
      ? n
      : n.percent < a.percent
        ? a
        : { percent: a.percent, updatedAt: Math.max(a.updatedAt, n.updatedAt) },
  );
}
function Jo() {
  let e = document.documentElement,
    t = document.body;
  return {
    scrollTop: window.scrollY ?? e?.scrollTop ?? t?.scrollTop ?? 0,
    viewport: window.innerHeight ?? e?.clientHeight ?? 0,
    fullHeight: Math.max(e?.scrollHeight || 0, t?.scrollHeight || 0),
  };
}
function er() {
  let e = Jo(),
    t = document.getElementById("page-content");
  if (!t) return e;
  let a = {
      scrollTop: t.scrollTop || 0,
      viewport: t.clientHeight || 0,
      fullHeight: t.scrollHeight || 0,
    },
    n = Math.max(0, a.fullHeight - a.viewport),
    i = Math.max(0, e.fullHeight - e.viewport);
  if (n > 1 && i <= 1) return a;
  if (i > 1 && n <= 1) return e;
  if (a.scrollTop > 0 && e.scrollTop <= 0) return a;
  if (e.scrollTop > 0 && a.scrollTop <= 0) return e;
  let o = n > 0 ? a.scrollTop / n : 0,
    r = i > 0 ? e.scrollTop / i : 0;
  return o >= r ? a : e;
}
function Ne(e, t) {
  let a = document.getElementById(e);
  if (!a || (ce?.id !== e && a.style.display === "none")) return;
  let { scrollTop: n, viewport: i, fullHeight: o } = er(),
    r = Math.max(0, o - i);
  if (r <= 1) return;
  let s = Math.min(En, (Math.max(0, n) / r) * En);
  t(e, s);
}
function Nt() {
  Ne(Qt, ae);
}
function Lt() {
  Ne(Xe, ae);
}
function qt() {
  Ne(Ae, ae);
}
function Rt() {
  Ne(Ze, ae);
}
var Ct = new WeakMap(),
  Cn = Promise.resolve();
function Hn() {
  let e = document.getElementById(Ze);
  if (!e) return;
  if (Ct.has(e)) return Ct.get(e);
  let t = Cn.catch(() => {})
    .then(async () => {
      let { initializeChildhoodFundalReflexScrollPage: a } =
        await import("./childhoodFundalPreparation-UM6E5EUU.js");
      document.body.dataset.currentRoute !== "videos" ||
        document.getElementById(Ze) !== e ||
        e.style.display === "none" ||
        (await a("cataractScroll"), requestAnimationFrame(Rt));
    })
    .catch((a) => console.error("[videos] Cataract guide failed", a));
  return ((Cn = t), Ct.set(e, t), t.finally(() => Ct.delete(e)));
}
var kt = new WeakMap(),
  kn = Promise.resolve();
function Gn() {
  let e = document.getElementById(Ae);
  if (!e) return;
  if (kt.has(e)) return kt.get(e);
  let t = kn
    .catch(() => {})
    .then(async () => {
      let { initializeChildhoodFundalReflexScrollPage: a } =
        await import("./childhoodFundalPreparation-UM6E5EUU.js");
      document.body.dataset.currentRoute !== "videos" ||
        document.getElementById(Ae) !== e ||
        e.style.display === "none" ||
        (await a("pupilsAdvancedScroll"), requestAnimationFrame(qt));
    })
    .catch((a) => console.error("[videos] Pupils Advanced guide failed", a));
  return ((kn = t), kt.set(e, t), t.finally(() => kt.delete(e)));
}
var Pt = new WeakMap(),
  Pn = Promise.resolve();
function Un() {
  let e = document.getElementById(Xe);
  if (!e) return;
  if (Pt.has(e)) return Pt.get(e);
  let t = Pn.catch(() => {})
    .then(async () => {
      let { initializeChildhoodFundalReflexScrollPage: a } =
        await import("./childhoodFundalPreparation-UM6E5EUU.js");
      document.body.dataset.currentRoute !== "videos" ||
        document.getElementById(Xe) !== e ||
        e.style.display === "none" ||
        (await a("pupilsPecScroll"), requestAnimationFrame(Lt));
    })
    .catch((a) => console.error("[videos] Pupils PEC guide failed", a));
  return ((Pn = t), Pt.set(e, t), t.finally(() => Pt.delete(e)));
}
function xa() {
  Ne(ht, Wn);
}
function Sa() {
  Ne(Je, Dt);
}
function Ea() {
  Ne(et, Dt);
}
function jt() {
  requestAnimationFrame(() => {
    xa();
  });
}
function Yt() {
  requestAnimationFrame(() => {
    Sa();
  });
}
function Kt() {
  requestAnimationFrame(() => {
    Ea();
  });
}
function tr(e) {
  let t = e.closest(".pupil-level");
  if (!t) return "";
  let a = getComputedStyle(t),
    n = a.getPropertyValue("--cap-from").trim(),
    i = a.getPropertyValue("--accent").trim();
  if (t.classList?.contains("pupil-level--primary")) return n || "#15e115";
  let o = t.querySelector(".pupil-level__cap");
  if (!o) return i;
  let r = getComputedStyle(o).backgroundColor;
  return !r || r === "rgba(0, 0, 0, 0)" || r === "transparent" ? i : r;
}
function _e() {
  document.querySelectorAll(".lesson-row[data-target]").forEach((t) => {
    let a = t.getAttribute("data-target");
    if (!a) return;
    if (
      document.getElementById("visualAcuityPage")?.classList.contains("active")
    )
      try {
        sessionStorage.setItem(
          "videos:contextualReturn:v1",
          JSON.stringify({ from: "visualAcuityPage", target: a }),
        );
      } catch {}
    let n = t.querySelector(".lesson-progress__fill");
    if (!n) return;
    let o = dt(a)?.percent ?? 0;
    ((n.style.width = `${o}%`),
      n.setAttribute("aria-valuenow", String(Math.round(o))),
      t
        .querySelector('.lesson-progress[role="progressbar"]')
        ?.setAttribute("aria-valuenow", String(Math.round(o))),
      (n.title = `${Math.round(o)}% watched`));
    let r = tr(t);
    (r && (n.style.backgroundColor = r), ja(t, o, r));
  });
}
var ar = !1;
function nr(e) {
  let t = e?.getAttribute?.("data-target") || "",
    n =
      (t ? document.getElementById(t) : null)?.classList?.contains(
        "interactive-subapp-page",
      ) === !0,
    i = e?.closest?.(".interactive-topic-page"),
    o = e?.closest?.("#videos .page"),
    r =
      i?.id ||
      (e?.closest?.("#interactiveLearningPage")
        ? "interactiveLearningPage"
        : n
          ? o?.id
          : null);
  if (r)
    try {
      sessionStorage.setItem(
        qo,
        JSON.stringify({ routeName: "videos", subPageId: r }),
      );
    } catch {}
}
function ir(e) {
  (e.querySelectorAll(".diabetic-folder-item-count").forEach((t) => {
    t.remove();
  }),
    e
      .querySelectorAll(".interactive-folder-row[data-item-count]")
      .forEach((t) => {
        t.removeAttribute("data-item-count");
      }));
}
function or(e) {
  if (!ar) {
    ir(e);
    return;
  }
  e.querySelectorAll(".interactive-folder-row[data-folder]").forEach((a) => {
    let n = a.getAttribute("data-folder");
    if (!n) return;
    let i = e.querySelector(`.interactive-section-card[data-section="${n}"]`);
    if (!i) return;
    let o = i.querySelectorAll(
        ".lesson-row[data-lesson], .lesson-row[data-target]",
      ).length,
      r = a.querySelector(".thumb");
    if (!r) return;
    let s = r.querySelector(".diabetic-folder-item-count");
    (s ||
      ((s = document.createElement("span")),
      (s.className = "diabetic-folder-item-count"),
      r.appendChild(s)),
      (s.textContent = String(o)),
      a.setAttribute("data-item-count", String(o)));
  });
}
function rr() {
  let e = document.getElementById("interactiveLearningPage");
  if (!e) return;
  let t = e.querySelectorAll(".interactive-folder-row"),
    a = e.querySelectorAll(".interactive-section-card"),
    n = e.querySelectorAll(
      ".interactive-folders, #interactiveDemoQuizzesFolders",
    );
  if (!t.length || !n.length) return;
  or(e);
  let i = () => {
      (t.forEach((r) => r.setAttribute("aria-expanded", "false")),
        a.forEach((r) => {
          ((r.style.display = "none"),
            r.querySelector("h3")?.querySelector(".see-all-toggle")?.remove());
        }));
    },
    o = (r) => {
      let s = e.querySelector(`.interactive-section-card[data-section="${r}"]`),
        d = e.querySelector(`.interactive-folder-row[data-folder="${r}"]`);
      if (!s || !d) return;
      if (
        (i(),
        t.forEach((l) => {
          l.style.display = "";
        }),
        (d.style.display = "none"),
        d.setAttribute("aria-expanded", "true"),
        r === "cataract")
      )
        try {
          sessionStorage.setItem("interactiveLearning:cataractFolderOpen", "1");
        } catch {}
      else
        try {
          sessionStorage.removeItem("interactiveLearning:cataractFolderOpen");
        } catch {}
      (e.classList.add("diabetic-folder-open"),
        (e.dataset.interactiveOpenFolder = r),
        d.insertAdjacentElement("afterend", s),
        (s.style.display = ""));
      let p = s.querySelector("h3");
      if (!p) return;
      ((p.style.display = "flex"), (p.style.alignItems = "center"));
      let c = document.createElement("span");
      ((c.className = "see-all-toggle"),
        c.setAttribute("role", "button"),
        c.setAttribute("tabindex", "0"),
        c.setAttribute("aria-expanded", "true"),
        (c.textContent = "Close ^"),
        c.setAttribute("data-i18n", "i18nLiteral.Close ^"),
        (c.style.whiteSpace = "nowrap"));
      let u = (l) => {
        if (
          (l.preventDefault(),
          l.stopPropagation(),
          (s.style.display = "none"),
          c.remove(),
          (d.style.display = ""),
          e.classList.remove("diabetic-folder-open"),
          delete e.dataset.interactiveOpenFolder,
          d.setAttribute("aria-expanded", "false"),
          r === "cataract")
        )
          try {
            sessionStorage.removeItem("interactiveLearning:cataractFolderOpen");
          } catch {}
        d.focus();
      };
      (c.addEventListener("click", u),
        c.addEventListener("keydown", (l) => {
          (l.key === "Enter" || l.key === " ") && u(l);
        }),
        p.appendChild(c),
        window.I18N?.applyTranslations?.(c));
    };
  (i(),
    t.forEach((r) => {
      r.style.display = "";
    }),
    n.forEach((r) => {
      r.style.display = "flex";
    }),
    e.classList.remove("diabetic-folder-open"),
    delete e.dataset.interactiveOpenFolder,
    t.forEach((r) => {
      if (r.dataset.interactiveFolderWired === "1") return;
      r.dataset.interactiveFolderWired = "1";
      let s = r.getAttribute("data-folder");
      if (!s) return;
      let d = (p) => {
        (p.preventDefault(), p.stopPropagation(), o(s));
      };
      (r.addEventListener("click", d),
        r.addEventListener("keydown", (p) => {
          (p.key === "Enter" || p.key === " ") && d(p);
        }));
    }));
  try {
    sessionStorage.getItem("interactiveLearning:cataractFolderOpen") === "1" &&
      o("cataract");
  } catch {}
}
function $n(e, t) {
  if (!e) return;
  let a = `progressWired_${String(t).replace(/[^a-zA-Z0-9_-]/g, "_")}`;
  if (e.dataset[a] === "1") return;
  e.dataset[a] = "1";
  let n = () => {
    let i = e.duration || 0;
    if (!i) return;
    let o = zt(t),
      r = Se(o) || {},
      s = Math.max(r.maxTime || 0, e.currentTime || 0);
    (tt(o, {
      maxTime: s,
      duration: i,
      percent: Dn(s, i),
      updatedAt: Date.now(),
    }),
      _e(),
      Bt(t));
  };
  (e.addEventListener("loadedmetadata", n),
    e.addEventListener("timeupdate", n),
    e.addEventListener("ended", () => {
      e.duration &&
        (tt(zt(t), {
          maxTime: e.duration,
          duration: e.duration,
          percent: 100,
          updatedAt: Date.now(),
        }),
        _e(),
        Bt(t));
    }));
}
function sr(e, t, a = []) {
  if (!e || !Array.isArray(a) || !a.length) return;
  let n = `timedHoldsWired_${String(t).replace(/[^a-zA-Z0-9_-]/g, "_")}`;
  if (e.dataset[n] === "1") return;
  e.dataset[n] = "1";
  let i = new Set(),
    o = Number(e.currentTime || 0),
    r = null,
    s = !1,
    d = !1,
    p = null,
    c = !1,
    u = (S) => {
      if (S) {
        e.dataset.timedNarrationHoldActive = "1";
        return;
      }
      delete e.dataset.timedNarrationHoldActive;
    },
    l = () => {
      be.get(e)?.audio?.pause();
    },
    g = (S) => {
      if (S) {
        e.dataset.timedNarrationLeadActive = "1";
        return;
      }
      (delete e.dataset.timedNarrationLeadActive,
        delete e.dataset.timedNarrationCatchupActive,
        (p = null),
        (c = !1));
    },
    _ = () => {
      r !== null && (window.clearTimeout(r), (r = null));
    };
  (e.addEventListener("seeking", () => {
    if (s) {
      o = Number(e.currentTime || 0);
      return;
    }
    (_(),
      u(!1),
      g(!1),
      l(),
      (o = Number(e.currentTime || 0)),
      a.forEach((S) => {
        o < Number(S?.at || 0) - 0.5 && i.delete(S.at);
      }));
  }),
    e.addEventListener("timeupdate", () => {
      let S = Number(e.currentTime || 0);
      if (!Number.isFinite(S)) return;
      if (e.dataset.timedNarrationLeadActive === "1" && Number.isFinite(p)) {
        let T = be.get(e),
          C = T?.audio,
          W = Number(C?.currentTime || 0);
        if (C && !c && W >= p) {
          ((c = !0), (e.dataset.timedNarrationCatchupActive = "1"), C.pause());
          try {
            C.currentTime = p;
          } catch {}
        }
        C &&
          c &&
          S >= p &&
          (g(!1), mt(e, C, { force: !0 }), !e.paused && T.enabled && Me(T));
      }
      let P = a.find((T) => {
        let C = Number(T?.at);
        return Number.isFinite(C) && !i.has(T.at) && o < C && S >= C;
      });
      if (((o = S), !P)) return;
      i.add(P.at);
      let m = P.continueNarration === !0;
      (u(m), e.pause());
      let I = Number(P.at);
      if ((Math.abs(S - I) > 0.01 && ((s = !0), (e.currentTime = I)), m)) {
        let T = be.get(e),
          C = e.dataset.timedNarrationCatchupActive === "1";
        if (
          T?.enabled &&
          T.audio?.src &&
          !(P.respectNarrationCatchup === !0 && C)
        ) {
          (mt(e, T.audio, { force: !0 }),
            (T.audio.playbackRate = e.playbackRate || 1),
            (T.audio.volume = e.volume),
            (T.audio.muted = e.muted));
          let W = T.audio.play();
          W && typeof W.catch == "function" && W.catch(() => {});
        }
      }
      let L = Math.max(0, Number(P.durationMs) || 0),
        B = () => {
          let T = document.getElementById(t);
          if (!T || T.style.display === "none" || e.ended) {
            (u(!1), l());
            return;
          }
          if (m)
            if (
              P.preserveMediaPosition === !0 ||
              P.preserveNarrationProgress === !0
            ) {
              u(!1);
              let W = Number(P.narrationCatchUpAt);
              Number.isFinite(W) &&
                ((p = W),
                (c = !1),
                (e.dataset.timedNarrationLeadActive = "1"),
                delete e.dataset.timedNarrationCatchupActive);
              let O = Number(P.resumeAt);
              P.preserveMediaPosition !== !0 &&
                Number.isFinite(O) &&
                ((s = !0),
                (e.currentTime = Math.min(
                  O,
                  Number.isFinite(e.duration) ? e.duration : O,
                )));
            } else {
              let W = Number(P.resumeAt),
                O = Number.isFinite(W) ? W : I + L / 1e3;
              ((d = !0),
                (s = !0),
                (e.currentTime = Math.min(
                  O,
                  Number.isFinite(e.duration) ? e.duration : O,
                )));
            }
          else u(!1);
          let C = e.play();
          C && typeof C.catch == "function" && C.catch(() => {});
        },
        V = Number(P.narrationResumeAt),
        z = Date.now(),
        j = () => {
          r = null;
          let T = be.get(e)?.audio;
          if (
            m &&
            Number.isFinite(V) &&
            T &&
            Number(T.currentTime || 0) < V &&
            Date.now() - z < L + 3e3
          ) {
            r = window.setTimeout(j, 50);
            return;
          }
          B();
        };
      r = window.setTimeout(j, L);
    }),
    e.addEventListener("seeked", () => {
      if (((s = !1), !d)) return;
      ((d = !1), u(!1));
      let S = be.get(e);
      !e.paused && S && Me(S, { forceSync: !0 });
    }),
    e.addEventListener("ended", () => {
      (_(), i.clear(), (o = 0), (s = !1), (d = !1), u(!1), g(!1));
    }));
}
var wa = new Map();
function lr(e, t) {
  document
    .querySelectorAll(`.lesson-row[data-target="${e}"] .lesson-meta`)
    .forEach((a) => {
      a.textContent = `| ${t}`;
    });
}
function cr(e) {
  let t = pe[e];
  if (t?.sources?.low) return t.sources.low;
  let a = document.getElementById(e);
  return (a && a.querySelector("video source[src]")?.getAttribute("src")) || "";
}
function ur(e) {
  return new Promise((t) => {
    if (!e) return t(0);
    if (wa.has(e)) return t(wa.get(e));
    let a = document.createElement("video");
    ((a.preload = "metadata"), (a.muted = !0), (a.playsInline = !0));
    let n = (i) => {
      let o = Number.isFinite(i) ? i : 0;
      (wa.set(e, o), t(o), a.removeAttribute("src"), a.load());
    };
    (a.addEventListener("loadedmetadata", () => n(a.duration || 0), {
      once: !0,
    }),
      a.addEventListener("error", () => n(0), { once: !0 }),
      (a.src = e));
  });
}
async function Qn() {
  let e = Array.from(document.querySelectorAll(".lesson-row[data-target]")),
    t = Array.from(
      new Set(e.map((a) => a.getAttribute("data-target")).filter(Boolean)),
    );
  for (let a of t) {
    let n = cr(a);
    if (!n) continue;
    let i = await ur(n);
    i > 0 && lr(a, Ho(i));
  }
}
function dr(e) {
  document.querySelectorAll(".page").forEach((a) => {
    a.style.display = "none";
  });
  let t = document.getElementById(e);
  (t && (t.style.display = "block"),
    document.dispatchEvent(
      new CustomEvent("page:shown", { detail: { id: e } }),
    ),
    e === "fundalReflexPage" &&
      (je(),
      requestAnimationFrame(() => je()),
      window.setTimeout(() => je(), 0)),
    e === $t && jn(),
    e === Xe && Un(),
    e === Ae && Gn(),
    e === Ze && Hn(),
    e === Qt && Yn(),
    e === ht && (Na(), Kn(), jt()),
    e === Je && (La(), Xn(), Yt()),
    e === et && (qa(), Zn(), Kt()));
}
async function pr(e) {
  if (Vn.has(e) && !ya) {
    ya = !0;
    try {
      try {
        (sessionStorage.removeItem("glaucomaWorkshop:nextFlowEnabled"),
          sessionStorage.removeItem("glaucomaWorkshop:nextFlowIndex"));
      } catch {}
      (document
        .querySelectorAll(".glaucoma-next-wrap")
        .forEach((t) => t.remove()),
        await ia("glaucomaScrollImages"),
        typeof window.showPage == "function" ? window.showPage(e) : dr(e),
        ra(e));
      try {
        let { initializeGlaucomaScrollInteractiveTarget: t } =
          await import("./glaucomaWorkshop-24ZGJOVU.js");
        t?.(e);
      } catch {}
      try {
        (window.scrollTo(0, 0),
          (document.documentElement.scrollTop = 0),
          (document.body.scrollTop = 0));
      } catch {}
    } finally {
      ya = !1;
    }
  }
}
function je() {
  let e = document.getElementById("fundalReflexPage");
  !e ||
    !e.closest("#videos") ||
    (e
      .querySelectorAll(".childhood-next-wrap, .glaucoma-next-wrap")
      .forEach((t) => t.remove()),
    e
      .querySelectorAll(".childhood-next-host, .glaucoma-next-host")
      .forEach((t) => {
        t.classList.remove("childhood-next-host", "glaucoma-next-host");
      }));
}
function Ot() {
  Ne($t, ae);
}
async function jn() {
  try {
    let { initializeChildhoodFundalReflexScrollPage: e } =
      await import("./childhoodFundalPreparation-UM6E5EUU.js");
    (await e("visualAcuityExaminationScroll"), requestAnimationFrame(Ot));
  } catch (e) {
    console.error("[videos] failed to initialize Visual Acuity guide", e);
  }
}
async function Yn() {
  try {
    let { initializeChildhoodFundalReflexScrollPage: e } =
      await import("./childhoodFundalPreparation-UM6E5EUU.js");
    (await e("frontOfEyeExaminationScroll"), requestAnimationFrame(Nt));
  } catch (e) {
    console.error(
      "[videos] failed to initialize Front of Eye Examination guide",
      e,
    );
  }
}
function Na() {
  let e = document.getElementById(ht);
  if (!e) return;
  let t = e.querySelector(".eyes-topbar__title");
  t &&
    (t.setAttribute("data-i18n", "auto.videos.fundal_reflex_examination"),
    (t.textContent = "Fundal Reflex Examination"));
  let a = e.querySelector(".icon.menuBtn");
  a && (a.textContent = "\u2630");
  let n = e.querySelector(
    ":scope > .container.pupils-container > .pupils-subtitle",
  );
  (n && (n.style.display = ""),
    window.I18N?.applyTranslations?.(e.querySelector(".eyes-topbar")));
}
async function Kn() {
  Na();
  try {
    let { initializeChildhoodFundalReflexScrollPage: e } =
      await import("./childhoodFundalPreparation-UM6E5EUU.js");
    (await e?.(Fo), jt());
  } catch (e) {
    console.error(
      "[videos] failed to initialize Fundal Reflex Examination guide",
      e,
    );
  }
}
function La() {
  let e = document.getElementById(Je);
  if (!e) return;
  let t = e.querySelector(".eyes-topbar__title");
  t && (t.textContent = "Direct Ophthalmoscopy");
  let a = e.querySelector(".icon.menuBtn");
  a && (a.textContent = "\u2630");
  let n = e.querySelector(
    ":scope > .container.pupils-container > .pupils-subtitle",
  );
  (n && (n.style.display = ""),
    window.I18N?.applyTranslations?.(e.querySelector(".eyes-topbar")));
}
async function Xn() {
  La();
  try {
    let { initializeChildhoodFundalReflexScrollPage: e } =
      await import("./childhoodFundalPreparation-UM6E5EUU.js");
    (await e?.(Vo), Yt());
  } catch (e) {
    console.error(
      "[videos] failed to initialize Direct Ophthalmoscopy guide",
      e,
    );
  }
}
function qa() {
  let e = document.getElementById(et);
  if (!e) return;
  let t = e.querySelector(".eyes-topbar__title");
  t && (t.textContent = "Binocular Indirect Ophthalmoscopy");
  let a = e.querySelector(".icon.menuBtn");
  a && (a.textContent = "\u2630");
  let n = e.querySelector(
    ":scope > .container.pupils-container > .pupils-subtitle",
  );
  (n && (n.style.display = ""),
    window.I18N?.applyTranslations?.(e.querySelector(".eyes-topbar")));
}
async function Zn() {
  qa();
  try {
    let { initializeChildhoodFundalReflexScrollPage: e } =
      await import("./childhoodFundalPreparation-UM6E5EUU.js");
    (await e?.(Mo), Kt());
  } catch (e) {
    console.error(
      "[videos] failed to initialize Binocular Indirect Ophthalmoscopy guide",
      e,
    );
  }
}
var Jn = "pupilFullExam:mode",
  Ra = ["low", "high", "online"];
function ei() {
  let e = localStorage.getItem(Jn);
  return Ra.includes(e) ? e : "low";
}
function mr(e) {
  (Ra.includes(e) || (e = "low"), localStorage.setItem(Jn, e));
}
function Be(e, t) {
  if (!e) return;
  ((e.dataset.active = t),
    e.querySelectorAll(".tri-toggle__btn").forEach((n) => {
      let i = n.dataset.mode === t;
      n.setAttribute("aria-checked", i ? "true" : "false");
    }));
}
var Re = {
    low: "videos/Core/Pupils/Pupils_Full_220p.mp4",
    high: "videos/Core/Pupils/Pupils_Full_720p.mp4",
    online: "https://www.youtube.com/embed/19pN7jSYHMw",
  },
  Oa = ["low", "high", "online"],
  ti = Object.freeze({
    vaWhoPage: {
      ne: "https://www.youtube.com/watch?v=xT3YChTq9Hw&list=PLGgJeAmXVYhYrF4j14zMBzhbdLmyWlHUQ&index=9",
    },
    vaNearVisionPage: {
      ne: "https://youtu.be/eU6zyT-SGTg?si=B-rLyEm95eyZEP6m",
    },
    assessmentVisionPage: {
      ne: "https://youtu.be/eU6zyT-SGTg?si=B-rLyEm95eyZEP6m",
    },
  }),
  hr = Object.freeze({
    english: "en",
    amharic: "am",
    arabic: "ar",
    bangla: "bn",
    chichewa: "ny",
    chinese: "zh",
    french: "fr",
    hausa: "ha",
    hindi: "hi",
    nepali: "ne",
    igbo: "ig",
    indonesian: "id",
    kinyarwanda: "rw",
    korean: "ko",
    telugu: "te",
    lingala: "ln",
    luganda: "lg",
    persian: "fa",
    portuguese: "pt",
    shona: "sn",
    spanish: "es",
    swahili: "sw",
    urdu: "ur",
    yoruba: "yo",
    zulu: "zu",
    lao: "lo",
  });
function va(e) {
  let t = String(e || "")
    .trim()
    .toLowerCase();
  return hr[t] || t;
}
function fr() {
  try {
    let e = window.I18N?.getLanguage?.();
    if (e) return va(e);
  } catch {}
  try {
    let e = localStorage.getItem("prefLang");
    if (e) return va(e);
  } catch {}
  return va(document.documentElement.getAttribute("lang") || "en");
}
function gr(e, t = "") {
  let a = fr();
  return ti[e]?.[a] || t;
}
var pe = {
    vaWhoPage: {
      key: "videoMode:vaWhoPage",
      containerSelector: "#vaWhoContainer",
      videoSelector: "#vaWhoVideo",
      sources: {
        low: "videos/Core/VisualAcuity/VA_PEC1_220p.mp4",
        high: "videos/Core/VisualAcuity/VA_PEC1_720p.mp4",
        online: "https://youtu.be/R7z8_VxOO1U?si=v8Ft8bIZwaHIyXFl",
      },
      onlineTitle: "WHO Visual Acuity (online)",
      iframeClass: "videos-yt-va-who",
    },
    vaNearVisionPage: {
      key: "videoMode:vaNearVisionPage",
      containerSelector: "#vaNearVisionContainer",
      videoSelector: "#vaNearVisionVideo",
      sources: {
        low: "videos/Core/VisualAcuity/VA_NearDIst_220p.mp4",
        high: "videos/Core/VisualAcuity/VA_NearDIst_720p.mp4",
        online: "https://youtu.be/ji-ddMKnBa0?si=eW_M4JGarrFvGNi2",
      },
      onlineTitle: "Near Vision (online)",
      iframeClass: "videos-yt-va-near",
    },
    assessmentVisionPage: {
      key: "videoMode:assessmentVisionPage",
      containerSelector: "#assessmentVisionContainer",
      videoSelector: "#assessmentVisionVideo",
      sources: {
        low: "videos/Core/VisualAcuity/VA_Assessment_220p.mp4",
        high: "videos/Core/VisualAcuity/VA_Assessment_720p.mp4",
        online: "https://youtu.be/y1FIuL0lsPI?si=wpZZPIgtArTmY8Vi",
      },
      onlineTitle: "Assessment of Eyes and Vision (online)",
      iframeClass: "videos-yt-assess",
    },
    mumVisionPage: {
      key: "videoMode:mumVisionPage",
      containerSelector: "#mumVisionContainer",
      videoSelector: "#mumVisionVideo",
      sources: {
        low: "videos/Core/VisualAcuity/VA_Mum_220p.mp4",
        high: "videos/Core/VisualAcuity/VA_Mum_720p.mp4",
        online: "https://www.youtube.com/watch?v=OU8ueHEyfBA",
      },
      onlineTitle: "Visual Development (online)",
      iframeClass: "videos-yt-mum",
    },
    assessingVisualFunctionPage: {
      key: "videoMode:assessingVisualFunctionPage",
      containerSelector: "#assessingVisualFunctionPage .video-container",
      videoSelector: "#assessingVisualFunctionVideo",
      sources: {
        low: "images/pdf/Workshop/Childhood/VisualDevelopment/01_ios.mp4",
        high: "images/pdf/Workshop/Childhood/VisualDevelopment/01_ios.mp4",
      },
      onlineTitle: "Assessing Visual Function (online)",
      iframeClass: "videos-yt-assessing-visual-function",
    },
    pupilExamPECPage: {
      key: "videoMode:pupilExamPECPage",
      containerSelector: "#pupilExamPECPage .video-container",
      videoSelector: "#pupilExamPECVideo",
      sources: {
        low: "videos/Core/Pupils/Pupils_PEC_220p.mp4",
        high: "videos/Core/Pupils/Pupils_PEC_720p.mp4",
      },
      onlineTitle: "Pupil Exam PEC (online)",
      iframeClass: "videos-yt-pec",
    },
    rapdTestVideoPage: {
      key: "videoMode:rapdTestVideoPage",
      containerSelector: "#rapdTestVideoPage .video-container",
      videoSelector: "#rapdTestVideo",
      sources: {
        low: "videos/Core/Pupils/Pupils_RAPD24_220p.mp4",
        high: "videos/Core/Pupils/Pupils_RAPD24_720p.mp4",
      },
      onlineTitle: "RAPD Test Video (online)",
      iframeClass: "videos-yt-rapd",
    },
    fundalExamPage: {
      key: "videoMode:fundalExamPage",
      containerSelector: "#fundalExamContainer",
      videoSelector: "#fundalExamVideo",
      sources: {
        low: "videos/Core/FundalReflex/FR_Scotland_220p.mp4",
        high: "videos/Core/FundalReflex/FR_Scotland_720p.mp4",
        online:
          "https://www.youtube.com/watch?v=wCdbRxsWa6U&list=PLkZBIZv_vTvnjaOebDsMcV2c9sRzXkyU-&index=3",
      },
      onlineTitle: "Fundal Reflex Examination (online)",
      iframeClass: "videos-yt-fundal-exam",
    },
    visualAcuityFullAnimationVideoPage: {
      key: "videoMode:visualAcuityFullAnimationVideoPage",
      containerSelector: "#visualAcuityFullAnimationVideoContainer",
      videoSelector: "#visualAcuityFullAnimationVideo",
      sources: {
        low: "videos/FullAnim/VisualAcuityFullAnim_220p.mp4",
        high: "videos/FullAnim/VisualAcuityFullAnim_720p.mp4",
      },
    },
    fundalReflexFullAnimationVideoPage: {
      key: "videoMode:fundalReflexFullAnimationVideoPage",
      containerSelector: "#fundalReflexFullAnimationVideoContainer",
      videoSelector: "#fundalReflexFullAnimationVideo",
      sources: {
        low: "videos/FullAnim/FundalReflexFullAnim_220p.mp4",
        high: "videos/FullAnim/FundalReflexFullAnim_720p.mp4",
      },
      playbackHolds: [
        { at: 19.19, durationMs: 1e3 },
        { at: 52.12, durationMs: 2e3 },
        { at: 99.39, durationMs: 1e3 },
        { at: 114.34, durationMs: 1e3 },
        { at: 179, durationMs: 2e3 },
      ],
    },
    fePecAnteriorSegmentPage: {
      key: "videoMode:fePecAnteriorSegmentPage",
      containerSelector: "#fePecAnteriorSegmentContainer",
      videoSelector: "#fePecAnteriorSegmentVideo",
      sources: {
        low: "videos/Core/FrontofEye/FE_PEC_220p.mp4",
        high: "videos/Core/FrontofEye/FE_PEC_720p.mp4",
      },
      onlineTitle: "PEC Anterior Segment (online)",
      iframeClass: "videos-yt-fe-pec",
    },
    feFullAnteriorSegmentPage: {
      key: "videoMode:feFullAnteriorSegmentPage",
      containerSelector: "#feFullAnteriorSegmentContainer",
      videoSelector: "#feFullAnteriorSegmentVideo",
      sources: {
        low: "videos/Core/FrontofEye/FE_Full_220p.mp4",
        high: "videos/Core/FrontofEye/FE_Full_720p.mp4",
      },
      onlineTitle: "Full Anterior Segment (online)",
      iframeClass: "videos-yt-fe-full",
    },
    pupilsAdvancedFullAnimationVideoPage: {
      key: "videoMode:pupilsAdvancedFullAnimationVideoPage",
      containerSelector: "#pupilsAdvancedFullAnimationVideoContainer",
      videoSelector: "#pupilsAdvancedFullAnimationVideo",
      sources: {
        low: "videos/FullAnim/PupilsAdvancedFullAnim_240p.mp4",
        high: "videos/FullAnim/PupilsAdvancedFullAnim_720p.mp4",
      },
    },
    pupilsPecFullAnimationVideoPage: {
      key: "videoMode:pupilsPecFullAnimationVideoPage",
      containerSelector: "#pupilsPecFullAnimationVideoContainer",
      videoSelector: "#pupilsPecFullAnimationVideo",
      sources: {
        low: "videos/FullAnim/PupilsPecFullAnim_240p.mp4",
        high: "videos/FullAnim/PupilsPecFullAnim_720p.mp4",
      },
    },
    makeEyePadShieldFullAnimationVideoPage: {
      key: "videoMode:makeEyePadShieldFullAnimationVideoPage",
      containerSelector: "#makeEyePadShieldFullAnimationVideoContainer",
      videoSelector: "#makeEyePadShieldFullAnimationVideo",
      sources: {
        low: "videos/FullAnim/MakeEyePadShieldFullAnim_240p.mp4",
        high: "videos/FullAnim/MakeEyePadShieldFullAnim_720p.mp4",
      },
    },
    frontOfEyeFullAnimationVideoPage: {
      key: "videoMode:frontOfEyeFullAnimationVideoPage",
      containerSelector: "#frontOfEyeFullAnimationVideoContainer",
      videoSelector: "#frontOfEyeFullAnimationVideo",
      sources: {
        low: "videos/FullAnim/FrontofEyeFullAnim_timed_220p.mp4",
        high: "videos/FullAnim/FrontofEyeFullAnim_timed_720p.mp4",
      },
    },
    fundalStillPage: {
      key: "videoMode:fundalStillPage",
      containerSelector: "#fundalStillContainer",
      videoSelector: "#fundalStillVideo",
      sources: {
        low: "videos/Core/FundalReflex/FRT Testing Tools/FR_Stillimg_220p.mp4",
        high: "videos/Core/FundalReflex/FRT Testing Tools/FR_Stillimg_720p.mp4",
      },
      onlineTitle: "Still Images (online)",
      iframeClass: "videos-yt-fundal-still",
    },
    fundalRealPage: {
      key: "videoMode:fundalRealPage",
      containerSelector: "#fundalRealContainer",
      videoSelector: "#fundalRealVideo",
      sources: {
        low: "videos/Core/FundalReflex/FRT Testing Tools/FR_SREN_220p.mp4",
        high: "videos/Core/FundalReflex/FRT Testing Tools/FR_SREN_720p.mp4",
      },
      onlineTitle: "Real Fundal Reflex Examinations (online)",
      iframeClass: "videos-yt-fundal-real",
    },
    directOphthalmoscopyVideoPage: {
      key: "videoMode:directOphthalmoscopyVideoPage",
      containerSelector: "#directOphthalmoscopyContainer",
      videoSelector: "#customVideo",
      sources: {
        low: "videos/Core/Ophthalmoscopy/DirectOphth_220p.mp4",
        high: "videos/Core/Ophthalmoscopy/DirectOphth_720p.mp4",
        online: "https://www.youtube.com/watch?v=rG99iRufXfU&t=41s",
      },
      onlineTitle: "Direct Ophthalmoscopy (online)",
      iframeClass: "videos-yt-do",
    },
    directOphthalmoscopyFullAnimationVideoPage: {
      key: "videoMode:directOphthalmoscopyFullAnimationVideoPage",
      containerSelector: "#directOphthalmoscopyFullAnimationVideoContainer",
      videoSelector: "#directOphthalmoscopyFullAnimationVideo",
      sources: {
        low: "videos/FullAnim/DOFullAnim_220p.mp4",
        high: "videos/FullAnim/DOFullAnim_720p.mp4",
      },
      playbackHolds: [
        {
          at: 46,
          continueNarration: !0,
          durationMs: 3e3,
          preserveMediaPosition: !0,
          narrationResumeAt: 49.1,
          narrationCatchUpAt: 55.2,
        },
        {
          at: 52.2,
          continueNarration: !0,
          durationMs: 5e3,
          preserveMediaPosition: !0,
          respectNarrationCatchup: !0,
        },
        {
          at: 141,
          continueNarration: !0,
          durationMs: 4e3,
          preserveNarrationProgress: !0,
          resumeAt: 142,
          narrationCatchUpAt: 144.95,
        },
      ],
    },
    howToUseArclightVideoPage: {
      key: "videoMode:howToUseArclightVideoPage",
      containerSelector: "#howToUseArclightVideoPage .video-container",
      videoSelector: "#howToUseArclightVideo",
      sources: {
        low: "videos/USAID Childhood eye screening/1. How to use the Arclight - ENGLISH - HD_220p.mp4",
        high: "videos/USAID Childhood eye screening/1. How to use the Arclight - ENGLISH - HD_220p.mp4",
      },
    },
    phoneAttachmentVideoPage: {
      key: "videoMode:phoneAttachmentVideoPage",
      containerSelector: "#phoneAttachmentVideoPage .video-container",
      videoSelector: "#phoneAttachmentVideo",
      sources: {
        low: "videos/Arclight/PhoneAttach.mp4",
        high: "videos/Arclight/PhoneAttach.mp4",
      },
    },
    usaidHowToUseArclightPage: {
      key: "videoMode:usaidHowToUseArclightPage",
      containerSelector: "#usaidHowToUseArclightContainer",
      videoSelector: "#usaidHowToUseArclightVideo",
      sources: {
        low: "videos/USAID Childhood eye screening/1. How to use the Arclight - ENGLISH - HD_220p.mp4",
        high: "videos/USAID Childhood eye screening/1. How to use the Arclight - ENGLISH - HD_720p.mp4",
        online: "https://youtu.be/ibzvXsRfLiI?si=DI2MKpa0nuCgGz-k",
      },
      onlineTitle: "How to use the Arclight (online)",
      iframeClass: "videos-yt-usaid-howto",
    },
    usaidFundalReflexExamPage: {
      key: "videoMode:usaidFundalReflexExamPage",
      containerSelector: "#usaidFundalReflexExamContainer",
      videoSelector: "#usaidFundalReflexExamVideo",
      sources: {
        low: "videos/USAID Childhood eye screening/FundalReflexUSAID_220p.mp4",
        high: "videos/USAID Childhood eye screening/FundalReflexUSAID_720p.mp4",
      },
      onlineTitle: "Fundal Reflex Exam (online)",
      iframeClass: "videos-yt-usaid-fundal",
    },
    usaidNormalAbnormalPage: {
      key: "videoMode:usaidNormalAbnormalPage",
      containerSelector: "#usaidNormalAbnormalContainer",
      videoSelector: "#usaidNormalAbnormalVideo",
      sources: {
        low: "videos/USAID Childhood eye screening/4. Normal and Abnormal findings - ENGLISH - HD_220p.mp4",
        high: "videos/USAID Childhood eye screening/4. Normal and Abnormal findings - ENGLISH - HD_720p.mp4",
        online: "https://youtu.be/n837_zt_Vaw?si=VnQDItAVB1tZx-M0",
      },
      onlineTitle: "Normal and Abnormal findings (online)",
      iframeClass: "videos-yt-usaid-normal",
    },
    diabeticIntroductionToArclightVideoPage: {
      key: "videoMode:diabeticIntroductionToArclightVideoPage",
      containerSelector: "#diabeticIntroductionToArclightVideoContainer",
      videoSelector: "#diabeticIntroductionToArclightVideo",
      sources: {
        low: "videos/Workshop/Diabetic/1.ArclightIntroduction_eyesOnly_220p.mp4",
        high: "videos/Workshop/Diabetic/1.ArclightIntroduction_eyesOnly_720p.mp4",
      },
    },
    diabeticCausesOfVisionLossVideoPage: {
      key: "videoMode:diabeticCausesOfVisionLossVideoPage",
      containerSelector: "#diabeticCausesOfVisionLossVideoContainer",
      videoSelector: "#diabeticCausesOfVisionLossVideo",
      sources: {
        low: "videos/Workshop/Diabetic/3.DR_LossofVisionCause_220p.mp4",
        high: "videos/Workshop/Diabetic/3.DR_LossofVisionCause_720p.mp4",
      },
    },
    diabeticSimpleSafeScalableVideoPage: {
      key: "videoMode:diabeticSimpleSafeScalableVideoPage",
      containerSelector: "#diabeticSimpleSafeScalableVideoContainer",
      videoSelector: "#diabeticSimpleSafeScalableVideo",
      sources: {
        low: "videos/Workshop/Diabetic/4.DRSinNCDClinicflow_220p.mp4",
        high: "videos/Workshop/Diabetic/4.DRSinNCDClinicflow_720p.mp4",
      },
    },
    binocularIndirectOphthalmoscopyVideoPage: {
      key: "videoMode:binocularIndirectOphthalmoscopyVideoPage",
      containerSelector: "#binocularIndirectOphthalmoscopyVideoContainer",
      videoSelector: "#binocularIndirectOphthalmoscopyVideo",
      sources: {
        low: "videos/Tools/BIOvideo_220p.mp4",
        high: "videos/Tools/BIOvideo_720p.mp4",
        online: "https://www.youtube.com/watch?v=XrczPv4HkwY",
      },
      onlineTitle: "Binocular Indirect Ophthalmoscopy (online)",
      iframeClass: "videos-yt-bio",
    },
    binocularIndirectOphthalmoscopyFullAnimationVideoPage: {
      key: "videoMode:binocularIndirectOphthalmoscopyFullAnimationVideoPage",
      containerSelector:
        "#binocularIndirectOphthalmoscopyFullAnimationVideoContainer",
      videoSelector: "#binocularIndirectOphthalmoscopyFullAnimationVideo",
      sources: {
        low: "videos/FullAnim/BIOFullAnim_220p.mp4",
        high: "videos/FullAnim/BIOFullAnim_720p.mp4",
      },
      playbackHolds: [
        {
          at: 43.7,
          continueNarration: !0,
          durationMs: 4e3,
          preserveMediaPosition: !0,
          narrationCatchUpAt: 130.68,
        },
        {
          at: 103.6,
          continueNarration: !0,
          durationMs: 7e3,
          preserveMediaPosition: !0,
          narrationCatchUpAt: 130.68,
        },
      ],
    },
    glaucomaPupilReactionsVideoPage: {
      key: "videoMode:glaucomaPupilReactionsVideoPage",
      videoMode: "triToggle",
      containerSelector: "#glaucomaPupilReactionsVideoContainer",
      videoSelector: "#glaucomaPupilReactionsVideo",
      sources: {
        low: "videos/Workshop/Glaucoma/pupilreaction_220p.mp4",
        high: "videos/Workshop/Glaucoma/pupilreaction_720p.mp4",
      },
    },
    glaucomaSignsOfGlaucomaVideoPage: {
      key: "videoMode:glaucomaSignsOfGlaucomaVideoPage",
      videoMode: "triToggle",
      containerSelector: "#glaucomaSignsOfGlaucomaVideoContainer",
      videoSelector: "#glaucomaSignsOfGlaucomaVideo",
      sources: {
        low: "videos/Workshop/Glaucoma/FRsignsglaucoma_220p.mp4",
        high: "videos/Workshop/Glaucoma/FRsignsglaucoma_720p.mp4",
      },
    },
    glaucomaAnteriorChamberDepthVideoPage: {
      key: "videoMode:glaucomaAnteriorChamberDepthVideoPage",
      videoMode: "triToggle",
      containerSelector: "#glaucomaAnteriorChamberDepthVideoContainer",
      videoSelector: "#glaucomaAnteriorChamberDepthVideo",
      sources: {
        low: "videos/Workshop/Glaucoma/FRACD_220p.mp4",
        high: "videos/Workshop/Glaucoma/FRACD_720p.mp4",
      },
    },
    glaucomaACAGCaseWorkshopVideoPage: {
      key: "videoMode:glaucomaACAGCaseWorkshopVideoPage",
      videoMode: "triToggle",
      containerSelector: "#glaucomaACAGCaseWorkshopVideoContainer",
      videoSelector: "#glaucomaACAGCaseWorkshopVideo",
      sources: {
        low: "videos/Workshop/Glaucoma/FRACAG_220p.mp4",
        high: "videos/Workshop/Glaucoma/FRACAG_720p.mp4",
      },
    },
    glaucomaFundalReflexDiseaseVideoPage: {
      key: "videoMode:glaucomaFundalReflexDiseaseVideoPage",
      videoMode: "triToggle",
      containerSelector: "#glaucomaFundalReflexDiseaseVideoContainer",
      videoSelector: "#glaucomaFundalReflexDiseaseVideo",
      sources: {
        low: "videos/Workshop/Glaucoma/FRDisease_220p.mp4",
        high: "videos/Workshop/Glaucoma/FRDisease_720p.mp4",
      },
    },
    glaucomaOtherOpticNerveDiseasesVideoPage: {
      key: "videoMode:glaucomaOtherOpticNerveDiseasesVideoPage",
      videoMode: "triToggle",
      containerSelector: "#glaucomaOtherOpticNerveDiseasesVideoContainer",
      videoSelector: "#glaucomaOtherOpticNerveDiseasesVideo",
      sources: {
        low: "videos/Workshop/Glaucoma/opticdiseases_220p.mp4",
        high: "videos/Workshop/Glaucoma/opticdiseases_720p.mp4",
      },
    },
    glaucomaVisualFieldExamVideoPage: {
      key: "videoMode:glaucomaVisualFieldExamVideoPage",
      videoMode: "triToggle",
      containerSelector: "#glaucomaVisualFieldExamVideoContainer",
      videoSelector: "#glaucomaVisualFieldExamVideo",
      sources: {
        low: "videos/Workshop/Glaucoma/opticdiseases_220p.mp4",
        high: "videos/Workshop/Glaucoma/opticdiseases_720p.mp4",
      },
    },
    glaucomaDirectOphthalmoscopyDiscsAnnotatedVideoPage: {
      key: "videoMode:glaucomaDirectOphthalmoscopyDiscsAnnotatedVideoPage",
      videoMode: "triToggle",
      containerSelector: "#directOphthalmoscopyDiscsAnnotatedVideoContainer",
      videoSelector: "#directOphthalmoscopyDiscsAnnotatedVideo",
      sources: {
        low: "videos/Workshop/Glaucoma/DO_discsannotated_220p.mp4",
        high: "videos/Workshop/Glaucoma/DO_discsannotated_720p.mp4",
      },
    },
    glaucomaOpticDiscAnatomyVideoPage: {
      key: "videoMode:glaucomaOpticDiscAnatomyVideoPage",
      videoMode: "triToggle",
      containerSelector: "#opticDiscAnatomyVideoContainer",
      videoSelector: "#opticDiscAnatomyVideo",
      sources: {
        low: "videos/Workshop/Glaucoma/BE_opticdiscanatomy_220p.mp4",
        high: "videos/Workshop/Glaucoma/BE_opticdiscanatomy_720p.mp4",
      },
    },
    glaucomaMarginVideoPage: {
      key: "videoMode:glaucomaMarginVideoPage",
      videoMode: "triToggle",
      containerSelector: "#marginVideoContainer",
      videoSelector: "#marginVideo",
      sources: {
        low: "videos/Workshop/Glaucoma/BE_Margin_220p.mp4",
        high: "videos/Workshop/Glaucoma/BE_Margin_720p.mp4",
      },
    },
    glaucomaDiscCuppingVideoPage: {
      key: "videoMode:glaucomaDiscCuppingVideoPage",
      videoMode: "triToggle",
      containerSelector: "#discCuppingVideoContainer",
      videoSelector: "#discCuppingVideo",
      sources: {
        low: "videos/Workshop/Glaucoma/BE_disccuppingonly_220p.mp4",
        high: "videos/Workshop/Glaucoma/BE_disccuppingonly_720p.mp4",
      },
    },
  },
  yr = "/video-localization/childhood-eye-screening.json",
  wr = "[data-video-page-actions='true']",
  Fa = new Set(Object.keys(pe)),
  vr = new Set([
    "pupilsAdvancedFullAnimationVideoPage",
    "pupilsPecFullAnimationVideoPage",
    "makeEyePadShieldFullAnimationVideoPage",
    "visualAcuityFullAnimationVideoPage",
    "fundalReflexFullAnimationVideoPage",
    "directOphthalmoscopyFullAnimationVideoPage",
    "binocularIndirectOphthalmoscopyFullAnimationVideoPage",
    "frontOfEyeFullAnimationVideoPage",
  ]),
  br = "dedicated-video-fullscreen-active",
  _r = new Set([
    "assessmentVisionPage",
    "mumVisionPage",
    "usaidHowToUseArclightPage",
    "usaidFundalReflexExamPage",
    "usaidNormalAbnormalPage",
  ]),
  Ca = {
    en: { label: "English" },
    am: { label: "Amharic" },
    ar: { label: "Arabic" },
    bn: { label: "Bangla" },
    ne: { label: "Nepali" },
    ny: { label: "Chichewa" },
    zh: { label: "Chinese" },
    fr: { label: "French" },
    ha: { label: "Hausa" },
    hi: { label: "Hindi" },
    ig: { label: "Igbo" },
    id: { label: "Indonesian" },
    rw: { label: "Kinyarwanda" },
    ko: { label: "Korean" },
    ln: { label: "Lingala" },
    lg: { label: "Luganda" },
    fa: { label: "Persian" },
    pt: { label: "Portuguese" },
    sn: { label: "Shona" },
    es: { label: "Spanish" },
    sw: { label: "Swahili" },
    te: { label: "Telugu" },
    ur: { label: "Urdu" },
    yo: { label: "Yoruba" },
    zu: { label: "Zulu" },
    lo: { label: "Lao" },
  },
  Tn = "application/vnd.apple.mpegurl",
  Ar = 0.2,
  xr = "videoNarration:",
  Sr = "videoNarrationLanguage:",
  Ft = null,
  Tt = new Map(),
  pt = new WeakMap(),
  Wt = new WeakMap(),
  be = new WeakMap(),
  Ht = new WeakMap();
function ai(e) {
  return e?.id === "videos" && e?.getAttribute?.("data-page") === "videos";
}
function te(e) {
  let t = String(e || "")
      .trim()
      .toLowerCase(),
    a = t.split("-")[0];
  return Object.prototype.hasOwnProperty.call(Ca, t)
    ? t
    : Object.prototype.hasOwnProperty.call(Ca, a)
      ? a
      : "en";
}
function xe(e) {
  return String(e || "")
    .trim()
    .toLowerCase()
    .replaceAll("_", "-");
}
function Er(e, { prefLang: t = se(), defaultLang: a = "en" } = {}) {
  let n = Array.from(new Set((e || []).map((o) => xe(o)).filter(Boolean)));
  if (!n.length) return "";
  let i = [t, a, "en"].map((o) => xe(o)).filter(Boolean);
  for (let o of i) {
    if (n.includes(o)) return o;
    let r = o.split("-")[0],
      s = n.find((d) => d.split("-")[0] === r);
    if (s) return s;
  }
  return n[0];
}
function at(e) {
  return Fa.has(String(e || "").trim());
}
function Cr(e) {
  return ft() && at(e);
}
function ni(e, t) {
  if (e) {
    if (gt(t) || Cr(t)) {
      ((e.dataset.preventAutoFullscreen = "true"),
        (e.dataset.preferContainerFullscreen = "true"));
      return;
    }
    (delete e.dataset.preventAutoFullscreen,
      delete e.dataset.preferContainerFullscreen);
  }
}
function se() {
  try {
    let e = window.I18N?.getLanguage?.();
    if (e) return te(e);
  } catch {}
  try {
    let e = localStorage.getItem("prefLang");
    if (e) return te(e);
  } catch {}
  return te(document.documentElement.getAttribute("lang") || "en");
}
function kr(e) {
  return Ca[te(e)]?.label || "English";
}
function Va(e, { prefLang: t = se(), defaultLang: a = "en" } = {}) {
  let n = Array.from(new Set((e || []).map((o) => te(o)).filter(Boolean)));
  if (!n.length) return te(a);
  let i = [t, a, "en"]
    .map((o) => {
      let r = String(o || "").trim();
      return r ? te(r) : "";
    })
    .filter(Boolean);
  for (let o of i) if (n.includes(o)) return o;
  return n[0];
}
function Pr(e = {}) {
  let t = {};
  return (
    Fa.forEach((a) => {
      let n = e?.[a];
      if (!n || typeof n != "object") return;
      let i = {};
      Object.entries(n.subtitles || {}).forEach(([d, p]) => {
        typeof p != "string" || !p.trim() || (i[te(d)] = p);
      });
      let o = {};
      if (
        (Object.entries(n.audioVariants || {}).forEach(([d, p]) => {
          let c = xe(d),
            u = typeof p == "string" ? { src: p } : p;
          !c ||
            !u ||
            typeof u != "object" ||
            typeof u.src != "string" ||
            !u.src.trim() ||
            (o[c] = {
              label: typeof u.label == "string" ? u.label : "",
              src: u.src,
            });
        }),
        !Object.keys(i).length && !Object.keys(o).length)
      )
        return;
      let r = Va(Object.keys(i), {
          prefLang: te(n.defaultSubtitleLang || "en"),
          defaultLang: "en",
        }),
        s = Array.from(
          new Set(
            (n.iosHls?.subtitleLanguages || Object.keys(i))
              .map((d) => te(d))
              .filter((d) => !!i[d]),
          ),
        );
      t[a] = {
        subtitles: i,
        audioVariants: o,
        defaultSubtitleLang: r,
        defaultAudioLang: xe(n.defaultAudioLang || "en"),
        iosHls:
          n.iosHls && typeof n.iosHls == "object"
            ? {
                masterManifest:
                  typeof n.iosHls.masterManifest == "string"
                    ? n.iosHls.masterManifest
                    : "",
                preferredMode:
                  n.iosHls.preferredMode === "online" ? "online" : "low",
                offlineFallbackMode:
                  n.iosHls.offlineFallbackMode === "high" ? "high" : "low",
                subtitleLanguages: s,
              }
            : {
                masterManifest: "",
                preferredMode: "low",
                offlineFallbackMode: "low",
                subtitleLanguages: Object.keys(i),
              },
        localSources:
          n.localSources && typeof n.localSources == "object"
            ? n.localSources
            : {},
      };
    }),
    t
  );
}
async function Tr() {
  return (
    Ft ||
      (Ft = (async () => {
        try {
          let e = await fetch(yr, { cache: "no-store" });
          if (!e.ok)
            throw new Error(`failed to load subtitle catalog: ${e.status}`);
          let t = await e.json();
          return Pr(t);
        } catch (e) {
          return (console.warn("[videos] subtitle catalog unavailable", e), {});
        }
      })()),
    Ft
  );
}
async function ii(e) {
  return (at(e) && (await Tr())?.[e]) || null;
}
function he(e) {
  return document.getElementById(e);
}
function oi(e) {
  let t = he(e);
  if (!t) return null;
  let a = pe[e]?.videoSelector;
  return a ? t.querySelector(a) : t.querySelector("video");
}
function Ir(e) {
  let t = he(e);
  if (!t) return null;
  let a = pe[e]?.containerSelector;
  return a ? t.querySelector(a) : t.querySelector(".video-container");
}
function Nr(e) {
  let t = e?.querySelector(".video-container");
  if (!t) return null;
  let a = Array.from(t.querySelectorAll("video, iframe"));
  return (
    a.find((n) => {
      let i = n.getBoundingClientRect();
      return i.width > 0 && i.height > 0 && n.offsetParent !== null;
    }) ||
    a[0] ||
    null
  );
}
function Lr(e) {
  let t = he(e);
  if (!t || t.style.display === "none") return;
  let a = t.querySelector(".video-container + .video-share-btn");
  if (!a) return;
  let n = Nr(t);
  if (!n) return;
  let i = Array.from(
    t.querySelectorAll(
      ".childhood-next-btn, .glaucoma-next-btn, .diabetic-next-btn, .childhood-prev-btn, .glaucoma-prev-btn, .diabetic-prev-btn",
    ),
  ).filter((g) => {
    let _ = g.getBoundingClientRect();
    return _.width > 0 && _.height > 0 && g.offsetParent !== null;
  });
  if (!i.length) return;
  a.dataset.baseMarginTop ||
    (a.dataset.baseMarginTop = String(
      parseFloat(getComputedStyle(a).marginTop) || 0,
    ));
  let o = parseFloat(a.dataset.baseMarginTop) || 0;
  a.style.marginTop = `${o}px`;
  let r = n.getBoundingClientRect(),
    s = a.getBoundingClientRect(),
    p =
      Math.min(...i.map((g) => g.getBoundingClientRect().top)) -
      r.bottom -
      s.height;
  if (!Number.isFinite(p)) return;
  let c = Math.max(0, p / 2),
    u = r.bottom + c,
    l = o + (u - s.top);
  a.style.marginTop = `${l}px`;
}
function Ma(e) {
  if (!e) return;
  let t = () => Lr(e);
  (t(),
    window.requestAnimationFrame(t),
    window.setTimeout(t, 0),
    window.setTimeout(t, 120));
}
function qr() {
  document.querySelectorAll("#videos .page").forEach((e) => {
    e.style.display !== "none" && Ma(e.id);
  });
}
function ri(e) {
  return e?.querySelector(wr) || null;
}
function Da(e) {
  let t = he(e);
  if (
    !t ||
    t.querySelector(".eyes-topbar") ||
    t.classList?.contains("interactive-subapp-page")
  )
    return null;
  let a =
    t.querySelector(".tri-toggle") ||
    t.querySelector(".video-header") ||
    t.querySelector(".video-container");
  if (!a?.parentNode) return null;
  let n = ri(t);
  n ||
    ((n = document.createElement("div")),
    (n.className = "video-page-actions"),
    n.setAttribute("data-video-page-actions", "true"),
    a.parentNode.insertBefore(n, a));
  let i = t.querySelector(".tri-toggle");
  i && i.parentNode !== n && n.appendChild(i);
  let o = n.querySelector(".menuBtn");
  return (
    o ||
      ((o = document.createElement("span")),
      (o.className = "icon menuBtn video-page-menu-btn"),
      o.setAttribute("aria-label", "Menu"),
      o.setAttribute("role", "button"),
      o.setAttribute("tabindex", "0"),
      (o.textContent = "\u2630"),
      n.appendChild(o)),
    n
  );
}
function si(e) {
  let t = he(e);
  if (t?.dataset?.currentVideoMode)
    return t.dataset.currentVideoMode === "online";
  let n = Ir(e)?.querySelector("iframe");
  return !!(n && n.style.display !== "none");
}
function Rr() {
  Object.keys(ti).forEach((e) => {
    si(e) && De(e, "online", { preserveTime: !1 });
  });
}
function ut(e) {
  if (e) {
    try {
      e.playsInline = !0;
    } catch {}
    (e.setAttribute("playsinline", ""),
      e.setAttribute("webkit-playsinline", ""),
      e.getAttribute("crossorigin") ||
        e.setAttribute("crossorigin", "anonymous"),
      e.getAttribute("controlslist") === "nofullscreen noremoteplayback" &&
        e.removeAttribute("controlslist"));
  }
}
function ft() {
  let e = window.navigator,
    t = String(e?.userAgent || ""),
    a = String(e?.platform || ""),
    n = Number(e?.maxTouchPoints || 0);
  return /iP(hone|od|ad)/i.test(t) || (/Mac/i.test(a) && n > 1);
}
function Or() {
  let e = window.navigator,
    t = String(e?.userAgent || ""),
    a = String(e?.platform || ""),
    n = Number(e?.maxTouchPoints || 0);
  return (
    /Safari/i.test(t) &&
    !/Chrome|Chromium|CriOS|Edg|OPR|Firefox|FxiOS|Android|Mobile|iP(hone|od|ad)/i.test(
      t,
    ) &&
    (/Macintosh/i.test(t) || (/Mac/i.test(a) && n === 0))
  );
}
function gt(e) {
  return vr.has(String(e || "").trim());
}
function li(e = "") {
  return gt(e) || Or();
}
function Ba() {
  return (
    document.fullscreenElement ||
    document.webkitFullscreenElement ||
    document.msFullscreenElement ||
    null
  );
}
function nt(e) {
  if (!e) return !1;
  let t = e.closest(".page")?.id || "";
  if (!gt(t)) return !1;
  let a = e.closest(".video-container");
  return a ? Ba() === a || a.classList.contains("is-app-fullscreen") : !1;
}
function ci(e = se()) {
  let t = xe(e).split("-")[0];
  return t === "es"
    ? {
        controls: "Controles de v\xEDdeo",
        enter: "Pantalla completa",
        exit: "Salir de pantalla completa",
        mute: "Silenciar",
        pause: "Pausar",
        play: "Reproducir",
        seek: "Posici\xF3n del v\xEDdeo",
        unmute: "Activar sonido",
      }
    : t === "ko"
      ? {
          controls: "\uB3D9\uC601\uC0C1 \uC7AC\uC0DD \uCEE8\uD2B8\uB864",
          enter: "\uC804\uCCB4 \uD654\uBA74",
          exit: "\uC804\uCCB4 \uD654\uBA74 \uC885\uB8CC",
          mute: "\uC74C\uC18C\uAC70",
          pause: "\uC77C\uC2DC\uC815\uC9C0",
          play: "\uC7AC\uC0DD",
          seek: "\uB3D9\uC601\uC0C1 \uC7AC\uC0DD \uC704\uCE58",
          unmute: "\uC74C\uC18C\uAC70 \uD574\uC81C",
        }
      : {
          controls: "Video controls",
          enter: "Full screen",
          exit: "Exit full screen",
          mute: "Mute",
          pause: "Pause",
          play: "Play",
          seek: "Video position",
          unmute: "Unmute",
        };
}
function It(e) {
  let t = Math.max(0, Number(e) || 0),
    a = Math.floor(t),
    n = Math.floor(a / 3600),
    i = Math.floor((a % 3600) / 60),
    o = a % 60,
    r = `${String(i).padStart(n ? 2 : 1, "0")}:${String(o).padStart(2, "0")}`;
  return n ? `${n}:${r}` : r;
}
function ct(e) {
  let t = Ht.get(e);
  if (!t) return;
  let a = ci(),
    n = Number.isFinite(e.duration) ? e.duration : 0,
    i = Math.min(
      Math.max(0, Number(e.currentTime) || 0),
      n || Number.MAX_SAFE_INTEGER,
    ),
    o = e.paused || e.ended;
  (t.controls.setAttribute("aria-label", a.controls),
    (t.playButton.textContent = o ? "\u25B6" : "\u275A\u275A"),
    t.playButton.setAttribute("aria-label", o ? a.play : a.pause),
    (t.playButton.title = o ? a.play : a.pause),
    (t.timeLabel.textContent = `${It(i)} / ${It(n)}`),
    (t.timeline.max = String(n || 0)),
    (t.timeline.value = String(i)),
    t.timeline.setAttribute("aria-label", a.seek),
    t.timeline.setAttribute("aria-valuetext", `${It(i)} / ${It(n)}`),
    (t.muteButton.textContent =
      e.muted || e.volume === 0 ? "\u{1F507}" : "\u{1F50A}"),
    t.muteButton.setAttribute(
      "aria-label",
      e.muted || e.volume === 0 ? a.unmute : a.mute,
    ),
    (t.muteButton.title = e.muted || e.volume === 0 ? a.unmute : a.mute));
}
function Oe(e) {
  let t = Ht.get(e);
  if (!t) return;
  let a = nt(e),
    n = ci();
  (t.fullscreenButton.setAttribute("aria-pressed", a ? "true" : "false"),
    t.fullscreenButton.setAttribute("aria-label", a ? n.exit : n.enter),
    (t.fullscreenButton.title = a ? n.exit : n.enter),
    me(e, Ie(e).lang),
    Ve(e),
    ct(e));
}
function za(e, t) {
  let a = e?.closest(".video-container");
  a &&
    (a.classList.toggle("is-app-fullscreen", t),
    document.body?.classList.toggle(br, t),
    Oe(e));
}
async function In(e) {
  let t = e?.closest(".video-container");
  if (!t || nt(e)) return;
  let a =
    t.requestFullscreen || t.webkitRequestFullscreen || t.msRequestFullscreen;
  if (typeof a == "function")
    try {
      if ((await a.call(t), Ba() === t)) {
        Oe(e);
        return;
      }
    } catch {}
  za(e, !0);
}
async function Nn(e) {
  let t = e?.closest(".video-container");
  if (!t) return;
  if (t.classList.contains("is-app-fullscreen")) {
    za(e, !1);
    return;
  }
  if (Ba() !== t) return;
  let a =
    document.exitFullscreen ||
    document.webkitExitFullscreen ||
    document.msExitFullscreen;
  if (typeof a == "function")
    try {
      await a.call(document);
    } catch {}
}
function Fr(e, t) {
  if (!t || !gt(e)) return null;
  let a = Ht.get(t);
  if (a) return (Oe(t), a);
  let n = t.closest(".video-container");
  if (!n) return null;
  ((t.controls = !1),
    t.removeAttribute("controls"),
    t.setAttribute("tabindex", "0"),
    n.classList.add("dedicated-video-player"));
  let i = document.createElement("div");
  ((i.className = "dedicated-video-controls"),
    i.setAttribute("role", "group"),
    i.setAttribute("data-dedicated-video-controls", "true"));
  let o = document.createElement("input");
  ((o.type = "range"),
    (o.className = "dedicated-video-controls__timeline"),
    (o.min = "0"),
    (o.max = "0"),
    (o.step = "0.01"),
    (o.value = "0"),
    i.appendChild(o));
  let r = document.createElement("div");
  ((r.className = "dedicated-video-controls__row"), i.appendChild(r));
  let s = document.createElement("button");
  ((s.type = "button"),
    (s.className =
      "dedicated-video-controls__button dedicated-video-controls__play"),
    s.setAttribute("data-video-play-toggle", "true"),
    r.appendChild(s));
  let d = document.createElement("span");
  ((d.className = "dedicated-video-controls__time"),
    d.setAttribute("aria-live", "off"),
    r.appendChild(d));
  let p = document.createElement("span");
  ((p.className = "dedicated-video-controls__spacer"),
    p.setAttribute("aria-hidden", "true"),
    r.appendChild(p));
  let c = document.createElement("button");
  ((c.type = "button"),
    (c.className =
      "dedicated-video-controls__button dedicated-video-controls__mute"),
    c.setAttribute("data-video-mute-toggle", "true"),
    r.appendChild(c));
  let u = document.createElement("button");
  ((u.type = "button"),
    (u.className =
      "dedicated-video-controls__button dedicated-video-controls__fullscreen"),
    u.setAttribute("data-video-fullscreen-toggle", "true"),
    u.setAttribute("aria-pressed", "false"),
    (u.textContent = "\u26F6"),
    r.appendChild(u),
    n.appendChild(i));
  let l = {
    container: n,
    controls: i,
    fullscreenButton: u,
    muteButton: c,
    playButton: s,
    timeLabel: d,
    timeline: o,
  };
  Ht.set(t, l);
  let g = () => {
    if (t.paused || t.ended) {
      t.ended && (t.currentTime = 0);
      try {
        t.play()?.catch?.(() => {});
      } catch {}
      return;
    }
    t.pause();
  };
  return (
    s.addEventListener("click", g),
    t.addEventListener("click", g),
    t.addEventListener("keydown", (_) => {
      (_.key !== " " && _.key.toLowerCase() !== "k") ||
        (_.preventDefault(), g());
    }),
    o.addEventListener("input", () => {
      let _ = Number(o.value);
      (Number.isFinite(_) && (t.currentTime = _), ct(t));
    }),
    c.addEventListener("click", () => {
      ((t.muted = !t.muted), ct(t));
    }),
    u.addEventListener("click", () => {
      nt(t) ? Nn(t) : In(t);
    }),
    t.addEventListener("dblclick", () => {
      nt(t) ? Nn(t) : In(t);
    }),
    [
      "durationchange",
      "ended",
      "loadedmetadata",
      "pause",
      "play",
      "playing",
      "ratechange",
      "seeked",
      "timeupdate",
      "volumechange",
    ].forEach((_) => {
      t.addEventListener(_, () => ct(t));
    }),
    document.addEventListener("fullscreenchange", () => Oe(t)),
    document.addEventListener("webkitfullscreenchange", () => Oe(t)),
    document.addEventListener("keydown", (_) => {
      _.key === "Escape" &&
        n.classList.contains("is-app-fullscreen") &&
        za(t, !1);
    }),
    ct(t),
    Oe(t),
    l
  );
}
function Wa() {
  return ft();
}
function ui(e, t = null) {
  let a = t?.iosHls || null;
  return !!(ft() && at(e) && a?.masterManifest);
}
function Vr(e) {
  return ft() && _r.has(String(e || "").trim());
}
function Gt() {
  return !na();
}
async function di() {
  return Ga();
}
function pi(e) {
  let t = Wt.get(e);
  return (
    t ||
    ((t = {
      fallbackTimer: 0,
      requestToken: 0,
      trackList: null,
      trackListHandler: null,
    }),
    Wt.set(e, t),
    t)
  );
}
function Vt(e) {
  let t = Wt.get(e);
  t?.fallbackTimer &&
    (window.clearTimeout(t.fallbackTimer), (t.fallbackTimer = 0));
}
function mi(e) {
  let t = Wt.get(e);
  if (!(!t?.trackList || !t.trackListHandler)) {
    try {
      (t.trackList.removeEventListener("addtrack", t.trackListHandler),
        t.trackList.removeEventListener("change", t.trackListHandler));
    } catch {}
    ((t.trackList = null), (t.trackListHandler = null));
  }
}
function ba(e) {
  (Vt(e), mi(e));
}
function Mr(e, t, a = se()) {
  if (!e) return "";
  let n = Va(t, { prefLang: a, defaultLang: "en" });
  try {
    let i = !1,
      o = Ut(e);
    if (
      (Array.from(e.textTracks || []).forEach((r) => {
        let s = String(r.kind || "").toLowerCase();
        if (s !== "subtitles" && s !== "captions") return;
        let p = te(r.language || r.srclang || "") === n;
        ((r.mode = p ? o : "disabled"), p && (i = !0));
      }),
      !i)
    ) {
      let r = Array.from(e.textTracks || []).find((s) => {
        let d = String(s.kind || "").toLowerCase();
        return d === "subtitles" || d === "captions";
      });
      r && (r.mode = o);
    }
  } catch {}
  return n;
}
function hi(e, t, a) {
  if (!e) return;
  let n = () => Mr(e, t, a);
  ([0, 120, 500, 1200, 2500].forEach((r) => {
    window.setTimeout(n, r);
  }),
    [
      "loadedmetadata",
      "loadeddata",
      "canplay",
      "play",
      "playing",
      "webkitbeginfullscreen",
    ].forEach((r) => {
      e.addEventListener(r, n, { once: !0 });
    }));
  let o = pi(e);
  (mi(e),
    e.textTracks &&
      typeof e.textTracks.addEventListener == "function" &&
      ((o.trackList = e.textTracks),
      (o.trackListHandler = n),
      o.trackList.addEventListener("addtrack", n),
      o.trackList.addEventListener("change", n)));
}
function Dr(e, t, a, n) {
  if (!e) return;
  let i = pi(e);
  (Vt(e), (i.requestToken = n));
  let o = () => Vt(e);
  (["loadedmetadata", "loadeddata", "canplay", "playing"].forEach((r) => {
    e.addEventListener(r, o, { once: !0 });
  }),
    (i.fallbackTimer = window.setTimeout(() => {
      let r = he(t);
      r &&
        r.dataset.videoModeRequestToken === n &&
        r.dataset.currentVideoMode === "online" &&
        De(t, a, { preserveTime: !0 });
    }, 8e3)),
    e.addEventListener(
      "error",
      () => {
        let r = he(t);
        r &&
          r.dataset.videoModeRequestToken === n &&
          r.dataset.currentVideoMode === "online" &&
          (Vt(e), De(t, a, { preserveTime: !0 }));
      },
      { once: !0 },
    ));
}
function Ie(e) {
  let t = pt.get(e);
  return (
    t ||
    ((t = {
      currentText: "",
      cues: [],
      enabled: !1,
      fullscreen: !1,
      lang: "en",
      overlay: null,
      panel: null,
      requestToken: 0,
      wired: !1,
    }),
    pt.set(e, t),
    t)
  );
}
function fi(e, t) {
  let a = Ie(e);
  if (a.wired) return;
  let n = () => Ve(e),
    i = () => {
      let o =
          document.fullscreenElement ||
          document.webkitFullscreenElement ||
          null,
        r = Ie(e);
      ((r.fullscreen = !!(o && (o === e || o === t || t.contains(o)))),
        me(e, r.lang),
        Ve(e),
        Oe(e));
    };
  ([
    "timeupdate",
    "seeking",
    "seeked",
    "loadedmetadata",
    "play",
    "pause",
    "ended",
  ].forEach((o) => {
    e.addEventListener(o, n);
  }),
    document.addEventListener("fullscreenchange", i),
    document.addEventListener("webkitfullscreenchange", i),
    e.addEventListener("webkitbeginfullscreen", () => {
      let o = Ie(e);
      ((o.fullscreen = !0), me(e, o.lang), Ve(e));
    }),
    e.addEventListener("webkitendfullscreen", () => {
      let o = Ie(e);
      ((o.fullscreen = !1), me(e, o.lang), Ve(e));
    }),
    (a.wired = !0));
}
function Br(e) {
  if (!e) return null;
  let t = Ie(e),
    a = e.closest(".video-container") || e.parentElement;
  if (!a) return null;
  a.classList.add("childhood-pilot-subtitle-host");
  let n = t.overlay;
  return (
    (!n || !n.isConnected) &&
      ((n = document.createElement("div")),
      (n.className = "childhood-pilot-subtitle-overlay"),
      n.setAttribute("data-childhood-pilot-subtitle-overlay", "true"),
      n.setAttribute("aria-hidden", "true"),
      (n.hidden = !0),
      a.appendChild(n),
      (t.overlay = n)),
    fi(e, a),
    n
  );
}
function zr(e) {
  if (!e) return null;
  let t = Ie(e),
    a = e.closest(".video-container") || e.parentElement;
  if (!a) return null;
  let n = t.panel,
    i =
      !n ||
      !n.isConnected ||
      n.parentElement !== a ||
      n.previousElementSibling !== e;
  return (
    (!n || !n.isConnected) &&
      ((n = document.createElement("div")),
      (n.className = "childhood-pilot-subtitle-panel"),
      n.setAttribute("data-childhood-pilot-subtitle-panel", "true"),
      n.setAttribute("aria-live", "polite"),
      n.setAttribute("aria-atomic", "true"),
      (t.panel = n)),
    i && e.insertAdjacentElement("afterend", n),
    fi(e, a),
    n
  );
}
function Fe(e) {
  if (!e) return;
  let t = pt.get(e);
  t &&
    ((t.currentText = ""),
    (t.cues = []),
    (t.enabled = !1),
    (t.requestToken += 1),
    t.overlay && ((t.overlay.hidden = !0), (t.overlay.textContent = "")),
    t.panel && ((t.panel.hidden = !0), (t.panel.textContent = "")));
}
function Ut(e) {
  let t = pt.get(e),
    a = nt(e);
  return t?.enabled && (!t.fullscreen || a) ? "hidden" : "showing";
}
function Ln(e) {
  let t = String(e || "").trim();
  if (!t) return Number.NaN;
  let a = t.split(":");
  if (a.length < 2 || a.length > 3) return Number.NaN;
  let n = String(a.pop() || "").split(".");
  if (n.length !== 2) return Number.NaN;
  let i = Number(n[0]),
    o = Number(n[1].padEnd(3, "0").slice(0, 3)),
    r = Number(a.pop() || 0),
    s = Number(a.pop() || 0);
  return [s, r, i, o].some((d) => !Number.isFinite(d))
    ? Number.NaN
    : s * 3600 + r * 60 + i + o / 1e3;
}
function Wr(e) {
  let t = String(e || "")
    .replace(/\uFEFF/g, "")
    .replace(
      /\r\n?/g,
      `
`,
    )
    .trim();
  if (!t) return [];
  let a = [];
  return (
    t.split(/\n{2,}/).forEach((n) => {
      let i = n
        .split(
          `
`,
        )
        .map((g) => g.trimEnd())
        .filter(Boolean);
      if (
        !i.length ||
        /^WEBVTT\b/i.test(i[0]) ||
        /^(NOTE|STYLE|REGION)\b/i.test(i[0])
      )
        return;
      let o = i.findIndex((g) => g.includes("-->"));
      if (o === -1) return;
      let r = i[o],
        [s, d] = r.split("-->");
      if (!s || !d) return;
      let p = Ln(s),
        c = Ln(d.trim().split(/\s+/)[0]);
      if (!Number.isFinite(p) || !Number.isFinite(c) || c <= p) return;
      let u = i
        .slice(o + 1)
        .map((g) => g.trim())
        .filter(Boolean).join(`
`);
      if (!u) return;
      let l = o > 0 && /^video-title-/.test(i[o - 1]);
      a.push({ start: p, end: c, text: u, videoTitle: l });
    }),
    a
  );
}
async function Hr(e) {
  let t = String(e || "").trim();
  return t
    ? (Tt.has(t) ||
        Tt.set(
          t,
          fetch(t)
            .then(async (a) => {
              if (!a.ok)
                throw new Error(`failed to load subtitles: ${a.status}`);
              return Wr(await a.text());
            })
            .catch(
              (a) => (
                Tt.delete(t),
                console.warn("[videos] subtitle cue overlay unavailable", a),
                []
              ),
            ),
        ),
      Tt.get(t))
    : [];
}
function Ve(e) {
  if (!e) return;
  let t = pt.get(e),
    a = t?.overlay,
    n = t?.panel;
  if (!t || (!a && !n)) return;
  if (!t.enabled || e.style.display === "none" || !t.cues.length) {
    ((t.currentText = ""),
      a && ((a.hidden = !0), (a.textContent = "")),
      n && ((n.hidden = !0), (n.textContent = "")));
    return;
  }
  let i = be.get(e),
    o =
      i?.enabled &&
      (e.dataset.timedNarrationHoldActive === "1" ||
        e.dataset.timedNarrationLeadActive === "1"),
    r = Math.max(0, Number(o ? i.audio?.currentTime : e.currentTime) || 0),
    s = Math.max(0, Number(e.currentTime) || 0),
    d = t.cues.filter((u) => u.videoTitle && s >= u.start && s < u.end),
    c = (
      d.length
        ? d
        : t.cues.filter((u) => !u.videoTitle && r >= u.start && r < u.end)
    ).map((u) => u.text).join(`
`);
  if (((t.currentText = c), a))
    if (t.fullscreen || !c) ((a.hidden = !0), (a.textContent = ""));
    else {
      a.textContent = "";
      let u = document.createElement("span");
      ((u.className = "childhood-pilot-subtitle-overlay__cue"),
        (u.textContent = c),
        a.appendChild(u),
        (a.hidden = !1));
    }
  if (n) {
    if (t.fullscreen && !nt(e)) {
      ((n.hidden = !0), (n.textContent = ""));
      return;
    }
    if (((n.hidden = !1), (n.textContent = ""), c)) {
      let u = document.createElement("span");
      ((u.className = "childhood-pilot-subtitle-panel__cue"),
        (u.textContent = c),
        n.appendChild(u));
    }
  }
}
async function ka(e, { lang: t, src: a }) {
  if (!e) return;
  let n = te(t),
    i = Ie(e);
  i.lang = n;
  let o = e.closest(".page")?.id || "",
    r = li(o),
    s = Wa();
  if (!r && !s) {
    (Fe(e), me(e, n));
    return;
  }
  if (!(r ? zr(e) : Br(e))) return;
  (r && i.overlay && ((i.overlay.hidden = !0), (i.overlay.textContent = "")),
    s && i.panel && ((i.panel.hidden = !0), (i.panel.textContent = "")));
  let p = i.requestToken + 1;
  i.requestToken = p;
  let c = await Hr(a);
  if (i.requestToken === p) {
    if (!c.length) {
      (Fe(e), me(e, n));
      return;
    }
    ((i.cues = c), (i.currentText = ""), (i.enabled = !0), me(e, n), Ve(e));
  }
}
function Gr(e, t) {
  if (!e) return;
  let a = () => {
    me(e, t);
  };
  ([0, 120, 360, 900].forEach((n) => {
    window.setTimeout(a, n);
  }),
    ["loadedmetadata", "canplay", "play", "loadeddata"].forEach((n) => {
      e.addEventListener(n, a, { once: !0 });
    }),
    e.addEventListener("webkitbeginfullscreen", a, { once: !0 }));
}
function Ur(e, t) {
  if (
    !e ||
    !Wa() ||
    e.dataset.preventAutoFullscreen === "true" ||
    !e.paused ||
    (Number(e.currentTime) || 0) > 0.1
  )
    return;
  let a = () => {
    (delete e.dataset.childhoodPilotNativeTrackPriming, me(e, t));
  };
  if (e.dataset.childhoodPilotNativeTrackPriming !== "1") {
    ((e.dataset.childhoodPilotNativeTrackPriming = "1"),
      e.addEventListener("loadedmetadata", a, { once: !0 }),
      e.addEventListener("loadeddata", a, { once: !0 }));
    try {
      e.load();
    } catch {
      a();
    }
  }
}
function Ye(e) {
  if (e) {
    (Fe(e),
      e
        .querySelectorAll(
          "track[data-childhood-pilot-subtitle='true'], track[data-localized-video-subtitle='true']",
        )
        .forEach((t) => t.remove()));
    try {
      Array.from(e.textTracks || []).forEach((t) => {
        t.mode = "disabled";
      });
    } catch {}
  }
}
function me(e, t) {
  if (!e) return;
  let a = te(t),
    n = !1;
  try {
    (Array.from(e.textTracks || []).forEach((i) => {
      let r = te(i.language || i.srclang || "") === a;
      ((i.mode = r ? Ut(e) : "disabled"), r && (n = !0));
    }),
      !n && e.textTracks?.[0] && (e.textTracks[0].mode = Ut(e)));
  } catch {}
}
function _a(e, { lang: t, src: a }) {
  if (!e || !a) return;
  (ut(e), Ye(e));
  let n = document.createElement("track");
  return (
    (n.kind = "captions"),
    (n.label = kr(t)),
    (n.srclang = te(t)),
    (n.src = a),
    (n.default = !0),
    n.setAttribute("kind", "captions"),
    n.setAttribute("default", ""),
    n.setAttribute("data-childhood-pilot-subtitle", "true"),
    n.addEventListener(
      "load",
      () => {
        me(e, t);
        try {
          n.track && (n.track.mode = Ut(e));
        } catch {}
      },
      { once: !0 },
    ),
    e.appendChild(n),
    me(e, t),
    Gr(e, t),
    Ur(e, t),
    ka(e, { lang: t, src: a })
  );
}
function gi(e) {
  return `${xr}${String(e || "").trim()}`;
}
function Pa(e) {
  return `${Sr}${String(e || "").trim()}`;
}
function Xt(e) {
  try {
    let t = xe(localStorage.getItem(Pa(e)));
    return t === "off" || t === "auto" || t
      ? t
      : localStorage.getItem(gi(e)) === "off"
        ? "off"
        : "auto";
  } catch {
    return "auto";
  }
}
function yi(e, t) {
  let a = xe(t) || "auto";
  try {
    (localStorage.setItem(gi(e), a === "off" ? "off" : "on"),
      a === "auto"
        ? localStorage.removeItem(Pa(e))
        : localStorage.setItem(Pa(e), a));
  } catch {}
}
function wi(e, { prefLang: t = se(), defaultLang: a = "en" } = {}) {
  if (!e || typeof e != "object") return null;
  let n = Er(Object.keys(e), { prefLang: t, defaultLang: a });
  if (!n) return null;
  let i = e[n],
    o = typeof i == "string" ? { src: i } : i;
  return !o || typeof o.src != "string" || !o.src.trim()
    ? null
    : {
        label:
          typeof o.label == "string" && o.label.trim() ? o.label.trim() : n,
        language: n,
        src: o.src.trim(),
      };
}
function mt(e, t, { force: a = !1 } = {}) {
  if (!e || !t || e.dataset.timedNarrationLeadActive === "1") return;
  let n = Number(e.currentTime || 0),
    i = Number(t.currentTime || 0);
  if (
    !(!Number.isFinite(n) || !Number.isFinite(i)) &&
    !(!a && Math.abs(n - i) <= Ar)
  )
    try {
      t.currentTime = Math.max(0, n);
    } catch {}
}
function Me(e, { forceSync: t = !1 } = {}) {
  if (
    !(!e?.enabled || !e.audio?.src || e.video?.paused) &&
    e.video.dataset.timedNarrationCatchupActive !== "1"
  ) {
    (mt(e.video, e.audio, { force: t }),
      (e.audio.playbackRate = e.video.playbackRate || 1),
      (e.audio.volume = e.video.volume),
      (e.audio.muted = e.video.muted));
    try {
      let a = e.audio.play();
      a &&
        typeof a.catch == "function" &&
        a.catch(() => {
          e.button?.setAttribute("data-narration-playback-blocked", "true");
        });
    } catch {
      e.button?.setAttribute("data-narration-playback-blocked", "true");
    }
  }
}
function $r(e, t = se()) {
  let a = e?.button;
  if (!a) return;
  let n = xe(t).split("-")[0],
    o =
      {
        ha: {
          active: "Bayani",
          auto: "Yi amfani da harshen manhaja",
          off: "An kashe bayani",
        },
        yo: {
          active: "Oh\xF9n",
          auto: "Lo \xE8d\xE8 \xEC\u1E63\xE0fil\u1ECD\u0301l\u1EB9\u0300",
          off: "Oh\xF9n ti pa",
        },
        ig: {
          active: "Nk\u1ECDwa",
          auto: "Jiri as\u1EE5s\u1EE5 ngwa",
          off: "Agbany\u1EE5r\u1EE5 nk\u1ECDwa",
        },
        ne: {
          active: "\u0935\u093E\u091A\u0928",
          auto: "\u090F\u092A\u0915\u094B \u092D\u093E\u0937\u093E \u092A\u094D\u0930\u092F\u094B\u0917 \u0917\u0930\u094D\u0928\u0941\u0939\u094B\u0938\u094D",
          off: "\u0935\u093E\u091A\u0928 \u092C\u0928\u094D\u0926",
        },
        fr: {
          active: "Narration",
          auto: "Utiliser la langue de l\u2019application",
          off: "Narration d\xE9sactiv\xE9e",
        },
        lg: {
          active: "Eddoboozi",
          auto: "Kozesa olulimi lwa pulogulaamu",
          off: "Eddoboozi lizikiddwa",
        },
      }[n] ||
      (n === "es"
        ? {
            active: "Narraci\xF3n",
            auto: "Usar idioma de la app",
            off: "Narraci\xF3n desactivada",
          }
        : n === "ko"
          ? {
              active: "\uB0B4\uB808\uC774\uC158",
              auto: "\uC571 \uC5B8\uC5B4 \uC0AC\uC6A9",
              off: "\uB0B4\uB808\uC774\uC158 \uB044\uAE30",
            }
          : {
              active: "Narration",
              auto: "Use app language",
              off: "Narration off",
            }),
    r = e.enabled
      ? `${o.active} \xB7 ${e.variant?.label || e.variant?.language || ""}`
      : o.off;
  ((a.textContent = r),
    (a.title = r),
    a.setAttribute("aria-label", r),
    (a.dataset.narrationLanguage = e.variant?.language || ""),
    a.classList.toggle("is-off", !e.enabled));
  let s = e.menu;
  if (!s || !e.entry) return;
  (s.setAttribute("aria-label", o.active), s.replaceChildren());
  let d = wi(e.entry.audioVariants, {
    prefLang: t,
    defaultLang: e.entry.defaultAudioLang || "en",
  });
  [
    { label: `${o.auto} \xB7 ${d?.label || "English"}`, value: "auto" },
    ...Object.entries(e.entry.audioVariants || {}).map(([c, u]) => ({
      label: typeof u?.label == "string" && u.label.trim() ? u.label.trim() : c,
      value: xe(c),
    })),
    { label: o.off, value: "off" },
  ].forEach((c) => {
    let u = document.createElement("button");
    ((u.type = "button"),
      (u.className = "video-narration-menu__item"),
      u.setAttribute("role", "menuitemradio"),
      u.setAttribute(
        "aria-checked",
        e.selection === c.value ? "true" : "false",
      ),
      (u.dataset.narrationSelection = c.value),
      (u.textContent = c.label),
      u.addEventListener("click", (l) => {
        (l.preventDefault(),
          l.stopPropagation(),
          yi(e.pageId, c.value),
          (e.selection = c.value),
          (e.menu.hidden = !0),
          e.button.setAttribute("aria-expanded", "false"),
          delete e.button.dataset.narrationPlaybackBlocked,
          vi(e.pageId, e.entry, { preferredLang: se() }),
          Ke(e.pageId, { preferredLang: se() }));
      }),
      s.appendChild(u));
  });
}
function Qr(e, t) {
  if (!t) return null;
  let a = be.get(t);
  if (a) return a;
  let n = he(e);
  if (!n) return null;
  let i = ri(n) || Da(e);
  if (!i) return null;
  let o = document.createElement("audio");
  ((o.hidden = !0),
    (o.preload = "auto"),
    o.setAttribute("aria-hidden", "true"),
    o.setAttribute("data-video-narration-audio", "true"),
    n.appendChild(o));
  let r = document.createElement("button");
  ((r.type = "button"),
    (r.className = "video-narration-toggle"),
    r.setAttribute("data-video-narration-toggle", "true"),
    r.setAttribute("aria-haspopup", "menu"),
    r.setAttribute("aria-expanded", "false"));
  let s = i.querySelector(".video-page-menu-btn");
  i.insertBefore(r, s || null);
  let d = document.createElement("div");
  return (
    (d.className = "video-narration-menu"),
    (d.hidden = !0),
    d.setAttribute("role", "menu"),
    d.setAttribute("data-video-narration-menu", "true"),
    i.appendChild(d),
    (a = {
      audio: o,
      button: r,
      enabled: !0,
      entry: null,
      menu: d,
      pageId: e,
      selection: Xt(e),
      variant: null,
      video: t,
    }),
    be.set(t, a),
    t.addEventListener("play", () => Me(a, { forceSync: !0 })),
    t.addEventListener("playing", () => {
      o.paused && Me(a, { forceSync: !0 });
    }),
    t.addEventListener("pause", () => {
      t.dataset.timedNarrationHoldActive !== "1" && o.pause();
    }),
    t.addEventListener("waiting", () => o.pause()),
    t.addEventListener("ended", () => o.pause()),
    t.addEventListener("seeking", () => {
      t.dataset.timedNarrationHoldActive === "1" ||
        t.dataset.timedNarrationLeadActive === "1" ||
        (o.pause(), mt(t, o, { force: !0 }));
    }),
    t.addEventListener("seeked", () => {
      t.dataset.timedNarrationHoldActive === "1" ||
        t.dataset.timedNarrationLeadActive === "1" ||
        Me(a, { forceSync: !0 });
    }),
    t.addEventListener("timeupdate", () => {
      !a.enabled || t.paused || (ft() || mt(t, o), o.paused && Me(a));
    }),
    t.addEventListener("ratechange", () => {
      o.playbackRate = t.playbackRate || 1;
    }),
    t.addEventListener("volumechange", () => {
      ((o.volume = t.volume), (o.muted = t.muted));
    }),
    o.addEventListener("timeupdate", () => {
      (t.dataset.timedNarrationHoldActive === "1" ||
        t.dataset.timedNarrationLeadActive === "1") &&
        Ve(t);
    }),
    r.addEventListener("click", (p) => {
      (p.preventDefault(), p.stopPropagation());
      let c = d.hidden;
      ((d.hidden = !c),
        r.setAttribute("aria-expanded", c ? "true" : "false"),
        c &&
          d
            .querySelector('[aria-checked="true"]')
            ?.focus({ preventScroll: !0 }));
    }),
    d.addEventListener("keydown", (p) => {
      p.key === "Escape" &&
        (p.preventDefault(),
        (d.hidden = !0),
        r.setAttribute("aria-expanded", "false"),
        r.focus({ preventScroll: !0 }));
    }),
    document.addEventListener("click", (p) => {
      d.hidden ||
        i.contains(p.target) ||
        ((d.hidden = !0), r.setAttribute("aria-expanded", "false"));
    }),
    a
  );
}
function vi(e, t, { preferredLang: a = se() } = {}) {
  let n = oi(e);
  if (!n) return "";
  let i = Xt(e),
    o = i === "auto" || i === "off" ? a : i,
    r = wi(t?.audioVariants, {
      prefLang: o,
      defaultLang: t?.defaultAudioLang || "en",
    }),
    s = be.get(n);
  if (!r) return (s && (s.audio.pause(), (s.button.hidden = !0)), "");
  let d = s || Qr(e, n);
  if (!d) return "";
  if (
    ((d.button.hidden = !1),
    (d.enabled = i !== "off"),
    (d.entry = t),
    (d.selection = i),
    (d.variant = r),
    (d.audio.getAttribute("src") || "") !== r.src)
  ) {
    (d.audio.pause(),
      d.audio.setAttribute("src", r.src),
      d.audio.setAttribute("lang", r.language));
    try {
      d.audio.load();
    } catch {}
  }
  return (
    (d.video.dataset.narrationLanguage = r.language),
    (d.video.dataset.narrationSelection = i),
    $r(d, a),
    d.enabled ? (Me(d, { forceSync: !0 }), r.language) : (d.audio.pause(), "")
  );
}
async function Ke(e, { preferredLang: t, subtitlePreferredLang: a } = {}) {
  if (!at(e) || !he(e)) return "";
  let i = oi(e);
  i && (ut(i), ni(i, e), Fr(e, i));
  let o = await ii(e);
  if (!o) return "";
  let r = vi(e, o, { preferredLang: t || se() }),
    s = Xt(e),
    d = s !== "auto" && s !== "off" ? r : "",
    p = Object.keys(o.subtitles || {});
  if (!p.length) return "";
  let c = Va(p, {
      prefLang: a || d || t || se(),
      defaultLang: o.defaultSubtitleLang || "en",
    }),
    u =
      o.subtitles[c] ||
      o.subtitles[o.defaultSubtitleLang] ||
      o.subtitles.en ||
      "",
    l = si(e),
    g = li(e),
    _ = Wa();
  return i
    ? l && ui(e, o)
      ? (Ye(i),
        u && (await ka(i, { lang: c, src: u })),
        hi(i, o.iosHls?.subtitleLanguages || p, c),
        c)
      : l
        ? (Ye(i), Fe(i), c)
        : g
          ? gt(e) && u
            ? (await _a(i, { lang: c, src: u }), c)
            : (Ye(i), u ? await ka(i, { lang: c, src: u }) : Fe(i), c)
          : _
            ? (ut(i), u ? (await _a(i, { lang: c, src: u }), c) : (Fe(i), c))
            : (ut(i), u ? (await _a(i, { lang: c, src: u }), c) : (Fe(i), c))
    : c;
}
async function jr(e) {
  return Ke(e);
}
async function Yr() {
  let e = se();
  for (let t of Fa)
    (Xt(t) !== "off" && yi(t, "auto"),
      he(t) && (await Ke(t, { preferredLang: e })));
}
function Fs() {
  Ft = null;
}
function Kr(e) {
  try {
    let t = localStorage.getItem(e);
    return Oa.includes(t) ? t : "low";
  } catch {
    return "low";
  }
}
function Aa(e, t) {
  try {
    (Oa.includes(t) || (t = "low"), localStorage.setItem(e, t));
  } catch {}
}
function Xr(e) {
  try {
    let t = new URL(e),
      a = t.hostname.replace(/^www\./, "");
    if (a === "youtube.com" && t.pathname.startsWith("/embed/"))
      return `https://www.youtube.com${t.pathname}`;
    if (a === "youtu.be") {
      let i = t.pathname.replace(/^\//, "");
      if (i) return `https://www.youtube.com/embed/${i}`;
    }
    let n = t.searchParams.get("v");
    if (n) return `https://www.youtube.com/embed/${n}`;
  } catch {}
  return e;
}
async function De(e, t, { preserveTime: a = !0 } = {}) {
  let n = pe[e];
  if (!n) return;
  (Oa.includes(t) || (t = "low"), t === "online" && !Gt() && (t = "low"));
  let i = document.getElementById(e);
  if (!i) return;
  let o = String((Number(i.dataset.videoModeRequestToken || 0) || 0) + 1);
  i.dataset.videoModeRequestToken = o;
  let r = await ot(i, n.sources);
  r?.offline &&
    (t === "online" || !r[t]) &&
    (t = r.low ? "low" : r.high ? "high" : "low");
  let s = t === "online" ? await ii(e) : null,
    d = ui(e, s);
  if (
    (t === "online" && !n.sources?.online && !d && (t = "low"),
    t === "online" && !(await di()) && (t = "low"),
    i.dataset.videoModeRequestToken !== o)
  )
    return;
  let p = s?.iosHls?.offlineFallbackMode || "low";
  (d && t === "high" && (t = p),
    d && t === "online" && !Gt() && (t = p),
    (i.dataset.currentVideoMode = t));
  let c = i.querySelector(".tri-toggle");
  c && Be(c, t);
  let u = i.querySelector(n.containerSelector);
  if (!u) return;
  let l = u.querySelector(n.videoSelector),
    g = u.querySelector(`iframe.${n.iframeClass}`);
  ni(l, e);
  let _ = 0;
  if ((a && l && (_ = l.currentTime || 0), t === "online")) {
    let I = gr(e, ""),
      L = s?.iosHls?.masterManifest || "";
    if (d && L && !I) {
      if ((g && g.remove(), !l)) return;
      ((l.style.display = "block"), ba(l), Ye(l));
      let V = l.querySelector("source");
      if (V) ((V.src = L), (V.type = Tn));
      else {
        let T = document.createElement("source");
        ((T.src = L), (T.type = Tn), l.prepend(T));
      }
      let z = await Ke(e, { preferredLang: se() });
      if (i.dataset.videoModeRequestToken !== o) return;
      Dr(l, e, p, o);
      try {
        l.load();
      } catch {}
      hi(l, s?.iosHls?.subtitleLanguages || [z, "en"], z);
      let j = () => {
        if (!a) return;
        let C = dt(e)?.maxTime ?? 0,
          W = C > 0 ? C : _;
        try {
          l.currentTime < 0.5 &&
            W > 0 &&
            (l.currentTime = Math.min(W, Math.max(0, (l.duration || W) - 1)));
        } catch {}
      };
      l.readyState >= 1
        ? j()
        : l.addEventListener("loadedmetadata", j, { once: !0 });
      return;
    }
    if (
      (n.sources?.online ||
        (console.warn(`[videos] ${e}: no online source, falling back to low`),
        (t = "low"),
        (i.dataset.currentVideoMode = t),
        c && Be(c, t)),
      l)
    ) {
      ba(l);
      try {
        l.pause();
      } catch {}
      l.style.display = "none";
    }
    let B = Xr(I || n.sources.online);
    if (g) ((g.src = B), (g.style.display = "block"));
    else {
      let V = document.createElement("iframe");
      ((V.className = n.iframeClass),
        (V.width = "100%"),
        (V.height = "100%"),
        (V.style.width = "100%"),
        (V.style.minHeight = "45vh"),
        (V.style.border = "none"),
        (V.allow =
          "accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"),
        (V.allowFullscreen = !0),
        (V.title = n.onlineTitle || `${e} (online)`),
        (V.src = B),
        u.appendChild(V));
    }
    Ke(e);
    return;
  }
  if ((g && g.remove(), !l)) return;
  ((l.style.display = "block"), ba(l), at(e) && ut(l));
  let S = l.querySelector("source"),
    P = n.sources[t];
  if (S) ((S.src = P), (S.type = "video/mp4"));
  else {
    let I = document.createElement("source");
    ((I.src = P), (I.type = "video/mp4"), l.prepend(I));
  }
  at(e) ? Ke(e) : Ye(l);
  try {
    l.load();
  } catch {}
  Ya(l);
  let m = () => {
    if (!a) return;
    let L = dt(e)?.maxTime ?? 0,
      B = L > 0 ? L : _;
    try {
      l.currentTime < 0.5 &&
        B > 0 &&
        (l.currentTime = Math.min(B, Math.max(0, (l.duration || B) - 1)));
    } catch {}
  };
  l.readyState >= 1
    ? m()
    : l.addEventListener("loadedmetadata", m, { once: !0 });
}
function bi(e) {
  let t = pe[e];
  if (!t) return;
  let a = document.getElementById(e);
  if (!a) return;
  let n = a.querySelector(".tri-toggle");
  if (!n) {
    De(e, "low", { preserveTime: !1 });
    return;
  }
  if (n.dataset.wired === "1") return;
  n.dataset.wired = "1";
  let i = Vr(e),
    o = n.querySelector('.tri-toggle__btn[data-mode="high"]'),
    r = n.querySelector('.tri-toggle__btn[data-mode="online"]'),
    s = !!(t.sources && t.sources.online) || i;
  (o && (o.hidden = i), r && (r.hidden = !s));
  let d = Array.from(n.querySelectorAll(".tri-toggle__btn")).filter(
    (u) => !u.hidden,
  ).length;
  n.style.setProperty("--tri-cols", String(Math.max(1, d)));
  let p = i ? (Gt() ? "online" : "low") : Kr(t.key);
  (p === "online" && !s && ((p = "high"), Aa(t.key, p)),
    i && Aa(t.key, p),
    Be(n, p),
    De(e, p, { preserveTime: !1 }));
  let c = (u) => {
    if (!u) return;
    i && u === "high" && (u = "low");
    let l = n.querySelector(`.tri-toggle__btn[data-mode="${u}"]`);
    (l && (l.hidden || l.disabled)) ||
      (Aa(t.key, u), Be(n, u), De(e, u, { preserveTime: !0 }));
  };
  (n.addEventListener("click", (u) => {
    let l = u.target.closest(".tri-toggle__btn");
    !l ||
      !n.contains(l) ||
      (u.preventDefault(), u.stopPropagation(), c(l.dataset.mode));
  }),
    n.addEventListener("keydown", (u) => {
      if (u.key !== "Enter" && u.key !== " " && u.key !== "Spacebar") return;
      let l = u.target.closest(".tri-toggle__btn");
      !l ||
        !n.contains(l) ||
        (u.preventDefault(), u.stopPropagation(), c(l.dataset.mode));
    }));
}
async function _i(e, { preserveTime: t = !0 } = {}) {
  (Ra.includes(e) || (e = "low"), e === "online" && !Gt() && (e = "low"));
  let a = document.getElementById("pupilFullExamPage");
  if (!a) return;
  let n = String((Number(a.dataset.videoModeRequestToken || 0) || 0) + 1);
  a.dataset.videoModeRequestToken = n;
  let i = await ot(a, Re);
  if (
    (i?.offline &&
      (e === "online" || !i[e]) &&
      (e = i.low ? "low" : i.high ? "high" : "low"),
    e === "online" && !(await di()) && (e = "low"),
    a.dataset.videoModeRequestToken !== n)
  )
    return;
  let o = a.querySelector(".tri-toggle");
  o && Be(o, e);
  let r = a.querySelector("#pupilFullExamContainer");
  if (!r) return;
  let s = r.querySelector("#pupilFullExamVideo"),
    d = r.querySelector("iframe.pupil-full-yt"),
    p = 0;
  if (
    (((t && s && !s.paused) || (t && s)) && (p = s.currentTime || 0),
    e === "online")
  ) {
    if (
      (Re.online ||
        (console.warn(
          "[videos] pupilFullExamPage: no online source, falling back to low",
        ),
        (e = "low")),
      s)
    ) {
      try {
        s.pause();
      } catch {}
      s.style.display = "none";
    }
    if (d) ((d.src = Re.online), (d.style.display = "block"));
    else {
      let l = document.createElement("iframe");
      ((l.className = "pupil-full-yt"),
        (l.width = "100%"),
        (l.height = "100%"),
        (l.style.width = "100%"),
        (l.style.minHeight = "45vh"),
        (l.style.border = "none"),
        (l.allow =
          "accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"),
        (l.allowFullscreen = !0),
        (l.title = "Pupil Full Examination (online)"),
        (l.src = Re.online),
        r.appendChild(l));
    }
    return;
  }
  if ((d && d.remove(), !s)) return;
  s.style.display = "block";
  let c = s.querySelector("source");
  if (c) c.src = Re[e];
  else {
    let l = document.createElement("source");
    ((l.src = Re[e]), (l.type = "video/mp4"), s.prepend(l));
  }
  try {
    s.load();
  } catch {}
  let u = () => {
    if (!t) return;
    let g = (dt("pupilFullExamPage")?.maxTime ?? p) || 0;
    try {
      s.currentTime < 0.5 &&
        g > 0 &&
        (s.currentTime = Math.min(g, Math.max(0, (s.duration || g) - 1)));
    } catch {}
  };
  s.readyState >= 1
    ? u()
    : s.addEventListener("loadedmetadata", u, { once: !0 });
}
window.addEventListener("arclight:connectivity", () => {
  for (let [t, a] of Object.entries(pe)) {
    let n = document.getElementById(t);
    !n ||
      n.style.display === "none" ||
      (na() && ["high", "online"].includes(n.dataset.currentVideoMode)
        ? De(t, n.dataset.currentVideoMode)
        : ot(n, a.sources));
  }
  let e = document.getElementById("pupilFullExamPage");
  e && e.style.display !== "none" && ot(e, Re);
});
function Zr() {
  let e = document.getElementById("pupilFullExamPage");
  if (!e) return;
  let t = e.querySelector(".tri-toggle");
  if (!t || t.dataset.wired === "1") return;
  t.dataset.wired = "1";
  let a = ei();
  (Be(t, a),
    t.addEventListener("click", (n) => {
      let i = n.target.closest(".tri-toggle__btn");
      if (!i) return;
      let o = i.dataset.mode;
      (mr(o),
        Be(t, o),
        _i(o),
        document.dispatchEvent(
          new CustomEvent("pupil:mode-changed", { detail: { mode: o } }),
        ));
    }));
}
function Jr() {
  let e = document.getElementById("pupilFullExamVideo");
  if (!e || e.dataset.autoResumed === "1") return;
  let a = dt("pupilFullExamPage")?.maxTime ?? 0;
  if (a <= 0) {
    e.dataset.autoResumed = "1";
    return;
  }
  let n = () => {
    let i = e.duration || 0;
    if (!i) return;
    let o = Math.min(a, Math.max(0, i - 1));
    if (e.currentTime < 0.5)
      try {
        e.currentTime = o;
      } catch {}
    e.dataset.autoResumed = "1";
  };
  e.readyState >= 1
    ? n()
    : e.addEventListener("loadedmetadata", n, { once: !0 });
}
function ie(e) {
  if (e === Ae && !document.getElementById(e)) {
    (wt("videos", { subPageId: "pupilsPage", replace: !0 }), ie("pupilsPage"));
    return;
  }
  if (Vn.has(e) && !document.getElementById(e)) {
    pr(e);
    return;
  }
  if (String(e || "").trim() === "videos") {
    ce && !ai(ce) && (ce.style.display = "block");
    return;
  }
  let t = document.getElementById(e);
  if (!t) {
    console.warn(`[videos.js] Page element with ID "${e}" not found.`);
    return;
  }
  let a = document.querySelector("[data-video-share-panel]");
  a && (a.hidden = !0);
  let n = document.querySelector("[data-video-share-native]");
  if (
    (n && (n.hidden = !0),
    t.querySelectorAll("iframe[data-src]").forEach((i) => {
      i.src || (i.src = i.getAttribute("data-src"));
    }),
    document.querySelectorAll("video").forEach((i) => {
      if (!t.contains(i) && !i.paused)
        try {
          i.pause();
        } catch {}
    }),
    [Je, et].includes(e) &&
      ["directOphthalmoscopy", "arclightPage", "holoOverviewPage"].includes(
        ce?.id,
      ))
  )
    try {
      sessionStorage.setItem(
        "videos:contextualReturn:v1",
        JSON.stringify({ from: ce.id, target: e }),
      );
    } catch {}
  (ce && ce !== t && (ce.style.display = "none"),
    (t.style.display = "block"),
    Ua(t),
    (ce = t),
    xn(e),
    wt("videos", { replace: !0, subPageId: e }),
    ra(e),
    document.dispatchEvent(
      new CustomEvent("page:shown", { detail: { id: e } }),
    ),
    e === "fundalReflexPage" &&
      (je(),
      requestAnimationFrame(() => je()),
      window.setTimeout(() => je(), 0)),
    e === $t && jn(),
    e === Xe && Un(),
    e === Ae && Gn(),
    e === Ze && Hn(),
    e === Qt && Yn(),
    e === ht && (Na(), Kn(), jt()),
    e === Je && (La(), Xn(), Yt()),
    e === et && (qa(), Zn(), Kt()));
  try {
    (window.scrollTo(0, 0),
      (document.documentElement.scrollTop = 0),
      (document.body.scrollTop = 0));
  } catch {}
  if ((Da(e), e === "pupilFullExamPage")) {
    Zr();
    let i = ei();
    (_i(i, { preserveTime: !1 }), i !== "online" && Jr());
  }
  if (Object.prototype.hasOwnProperty.call(pe, e)) {
    bi(e);
    let i = pe[e],
      r = document.getElementById(e)?.querySelector(i?.videoSelector || "");
    ($n(r, e), sr(r, e, i?.playbackHolds));
  }
  (Object.prototype.hasOwnProperty.call(pe, e) || jr(e),
    _e(e),
    Qn(),
    Ue(),
    Ma(e));
}
async function es() {
  document.getElementById("diabeticRetinopathyPage")?.removeAttribute("inert");
  let e = document.getElementById(Ae);
  if (e) {
    let [c, u] = await Promise.all([
      import("./pupilsAdvancedScroll-HXVNGCNF.js"),
      import("./childhoodFundalPreparation-UM6E5EUU.js"),
    ]);
    if (!e.isConnected) return;
    u.registerExaminationScrollRoute(
      "pupilsAdvancedScroll",
      c.PUPILS_ADVANCED_SCROLL_CONFIG,
      c.PUPILS_ADVANCED_SCROLL_TIMING,
    );
  }
  let t = document.querySelector(
      "#holoOverviewPage .pupil-level--intermediate",
    ),
    a = document.querySelector("#arclightPage .pupil-level--intermediate");
  t &&
    a &&
    !a.querySelector(".pupil-card") &&
    t.querySelectorAll(".pupil-card").forEach((c) => {
      let u = c.cloneNode(!0);
      (u.querySelectorAll("[id]").forEach((l) => {
        let g = l.id;
        ((l.id = `arclight-${g}`),
          u.querySelectorAll(`[aria-labelledby="${g}"]`).forEach((_) => {
            _.setAttribute("aria-labelledby", l.id);
          }));
      }),
        a.appendChild(u));
    });
  let n = document.querySelector(
      '#extendedExaminationPage .lesson-row--folder[data-folder="squint"]',
    ),
    i = document.getElementById("extendedSquintLessons");
  if (
    n &&
    i &&
    (i.querySelector(".lesson-row") ||
      document
        .querySelectorAll("#squintPalsyPage .lesson-row[data-target]")
        .forEach((c) => {
          let u = c.cloneNode(!0),
            l = c.closest(".pupil-level");
          ((u.dataset.sourceLevel = l?.classList.contains(
            "pupil-level--advanced",
          )
            ? "advanced"
            : l?.classList.contains("pupil-level--intermediate")
              ? "intermediate"
              : "primary"),
            i.appendChild(u));
        }),
    n.dataset.wired !== "1")
  ) {
    n.dataset.wired = "1";
    let c = (l) => {
        (l.preventDefault(),
          (n.style.display = "none"),
          n.setAttribute("aria-expanded", "true"),
          n.insertAdjacentElement("afterend", i),
          (i.style.display = "block"));
      },
      u = (l) => {
        (l.preventDefault(),
          l.stopPropagation(),
          (i.style.display = "none"),
          (n.style.display = ""),
          n.setAttribute("aria-expanded", "false"),
          n.focus());
      };
    (n.addEventListener("click", c),
      n.addEventListener("keydown", (l) => {
        (l.key === "Enter" || l.key === " ") && c(l);
      }),
      i.querySelector(".extended-folder-close")?.addEventListener("click", u));
  }
  let o =
    document.getElementById("videos") ||
    document.querySelector('[data-page="videos"]') ||
    document.body;
  o && (o.style.visibility = "visible");
  let r =
    document.getElementById("videos") ||
    document.querySelector('[data-page="videos"]');
  (r &&
    r.querySelectorAll(".page").forEach((c) => {
      c.style.display = "none";
    }),
    (ce = null),
    Zo(),
    rr(),
    Sn({ showPage: ie }),
    un({ showPage: ie }),
    hn());
  let s = window.__videosPendingTarget || "";
  if (!s)
    try {
      s = sessionStorage.getItem("gotoSubPage") || "";
    } catch {}
  if (!s) {
    let c = Qa();
    c?.routeName === "videos" && c.subPageId && (s = c.subPageId);
  }
  s === Ae &&
    !document.getElementById(s) &&
    ((s = "pupilsPage"), wt("videos", { subPageId: s, replace: !0 }));
  let d = (c, { timeout: u = 4e3 } = {}) =>
      new Promise((l, g) => {
        let _ = performance.now();
        (function S() {
          if (document.getElementById(c)) return l();
          if (performance.now() - _ > u)
            return g(new Error("timeout waiting for " + c));
          requestAnimationFrame(S);
        })();
      }),
    p = () => {
      try {
        sessionStorage.removeItem("gotoSubPage");
      } catch {}
      ((window.__videosPendingTarget = ""),
        (window.__videosSuppressFlash = !1),
        _e(),
        Qn(),
        o &&
          requestAnimationFrame(() => {
            o.style.visibility = "visible";
          }));
    };
  s
    ? d(s)
        .then(() => {
          (ie(s), p());
        })
        .catch(() => {
          p();
        })
    : p();
}
window[Mt] ||
  ((window[Mt] = !0),
  (document.getElementById("page-content") || document).addEventListener(
    "click",
    (a) => {
      let n = a.target && a.target.closest("[data-page]");
      if (!n) return;
      let i = n.getAttribute("data-page");
      !i ||
        ai(n) ||
        (sa(
          i,
          window.I18N?.getLanguage?.() ||
            localStorage.getItem("prefLang") ||
            "en",
        ),
        ie(i));
    },
    { passive: !0 },
  ),
  document.addEventListener("click", (a) => {
    a.target.closest("#caseBasedLearningCard") &&
      ss().catch((n) =>
        console.error("Failed to open Anterior Segment Quiz:", n),
      );
  }),
  document.addEventListener("click", (a) => {
    if (!document.getElementById("videos")) return;
    let n = a.target.closest(".lesson-row[data-target]");
    if (!n) return;
    let i = n.getAttribute("data-target");
    if (!i) return;
    if (n.closest("#extendedExaminationPage"))
      try {
        sessionStorage.setItem(
          "videos:contextualReturn:v1",
          JSON.stringify({ from: "extendedExaminationPage", target: i }),
        );
      } catch {}
    (n.closest("#diabeticRetinopathyPage") && (a.stopPropagation(), $a(n)),
      sa(
        i,
        window.I18N?.getLanguage?.() ||
          localStorage.getItem("prefLang") ||
          "en",
      ));
    let o = n.getAttribute("data-rapd-launch-mode");
    if (o)
      try {
        sessionStorage.setItem("rapdExperience:launchMode", o);
      } catch {}
    n.closest("#diabeticRetinopathyPage") || nr(n);
    let r = n.getAttribute("data-route");
    if (r && r !== "videos") {
      (a.preventDefault(), ia(r, { subPageId: i }));
      return;
    }
    ie(i);
  }),
  document.addEventListener("keydown", (a) => {
    let n = a.target.closest(".lesson-row[data-target]");
    n &&
      (a.key === "Enter" || a.key === " ") &&
      (a.preventDefault(), n.click());
  }),
  document.addEventListener("DOMContentLoaded", () => {
    try {
      Ue();
    } catch {}
  }),
  document.addEventListener("DOMContentLoaded", Fn),
  document.addEventListener(Mn, () => {
    _e();
  }),
  document.addEventListener(Ta, () => {
    _e();
  }),
  document.addEventListener(Ro, () => {
    _e();
  }),
  document.addEventListener(Oo, (a) => {
    let n = a?.detail?.target;
    if (n === $t) {
      ae(n, 100, { mode: "replace" });
      return;
    }
    if (n === Xe || n === Ae || n === Ze) {
      ae(n, 100);
      return;
    }
    if (n === Qt) {
      ae(n, 100, { mode: "replace" });
      return;
    }
    if (n === ht) {
      Wn(n, 100, { mode: "replace" });
      return;
    }
    if (n === Je) {
      Dt(n, 100, { mode: "replace" });
      return;
    }
    n === et && Dt(n, 100, { mode: "replace" });
  }),
  window.addEventListener("i18n:languageChanged", () => {
    (Yr(), Rr());
  }),
  window.addEventListener(
    "scroll",
    () => {
      (Ot(), Nt(), Lt(), qt(), Rt(), xa(), Sa(), Ea());
    },
    { passive: !0 },
  ),
  window.addEventListener(
    "resize",
    () => {
      (requestAnimationFrame(Ot),
        requestAnimationFrame(Nt),
        requestAnimationFrame(Lt),
        requestAnimationFrame(qt),
        requestAnimationFrame(Rt),
        jt(),
        Yt(),
        Kt(),
        qr());
    },
    { passive: !0 },
  ),
  window.addEventListener("arclight:video-fullscreen-exit", (a) => {
    let n = String(a?.detail?.pageId || "").trim();
    if (!n) return;
    let i = document.getElementById("videos"),
      o = document.getElementById(n);
    !i ||
      !o ||
      !i.contains(o) ||
      window.requestAnimationFrame(() => {
        (ce?.id === n && o.style.display !== "none") || ie(n);
      });
  }),
  document.getElementById("page-content")?.addEventListener(
    "scroll",
    () => {
      (Ot(), Nt(), Lt(), qt(), Rt(), xa(), Sa(), Ea());
    },
    { passive: !0 },
  ),
  window.addEventListener("page:loaded", (a) => {
    if (a?.detail?.pageId === "directOphthalmoscopyVideoPage") Fn();
    else {
      let i = document.querySelector("#directOphthalmoscopy #customVideo");
      i && !i.paused && i.pause();
    }
  }),
  document.addEventListener("DOMContentLoaded", () => {
    (oa(), Ue());
  }),
  window.addEventListener("page:loaded", (a) => {
    if (a?.detail?.pageId === "directOphthalmoscopyVideoPage") (oa(), Ue());
    else {
      let i = document.querySelector("#directOphthalmoscopy #customVideo");
      i && !i.paused && i.pause();
    }
  }));
var ts = (e) => document.getElementById(e),
  as = {
    visualacuityCard: "visualAcuityPage",
    pupilsCard: "pupilsPage",
    anteriorSegmentCard: "anteriorSegmentVideoPage",
    ophthalmoscopyCard: "directOphthalmoscopy",
    interactiveLearningCard: "interactiveLearningPage",
  };
Object.entries(as).forEach(([e, t]) => {
  let a = ts(e);
  a && (a.onclick = () => ie(t));
});
var qn = document.getElementById("showCoreClinicalOphthalmicExaminationBtn"),
  Rn = document.getElementById("showDiseasesBtn"),
  On = document.getElementById("showArclightBtn");
qn && (qn.onclick = () => ie("coreClinicalOphthalmicExamination"));
Rn && (Rn.onclick = () => ie("diseasesPage"));
On && (On.onclick = () => ie("arclightPage"));
function Vs(e, t = {}) {
  let { skipDefault: a = !1 } = t;
  e && document.getElementById(e)
    ? ie(e)
    : !a && document.getElementById("learningModules") && ie("learningModules");
  try {
    delete window.__videosPendingTarget;
  } catch {
    window.__videosPendingTarget = null;
  }
}
function Ms(e) {
  e && ie(e);
}
function Ds(e) {
  let t = pe[e],
    a = document.getElementById(e);
  !t ||
    !a ||
    (Da(e), bi(e), $n(a.querySelector(t.videoSelector), e), Ue(), Ma(e));
}
function Fn() {
  let e = document.getElementById("directOphthalmoscopyVideoPage");
  if (!e || e.style.display === "none") return;
  let t = e.querySelector("#customVideo"),
    a = e.querySelector("#timestampBtn"),
    n = e.querySelector("#noteBtn"),
    i = e.querySelector("#folderBtn"),
    o = (r, s) => {
      !r ||
        r.__wired ||
        ((r.__wired = !0),
        r.addEventListener("click", (d) => {
          (d.preventDefault(), t && t.pause(), s());
        }));
    };
  (o(a, () => {
    if (!t) return;
    let r = Math.floor(t.currentTime || 0);
    console.warn("Timestamp:", r);
    try {
      navigator.clipboard && navigator.clipboard.writeText(String(r));
    } catch {}
  }),
    o(n, () => {
      alert("Note-taking feature coming soon.");
    }),
    o(i, () => {
      alert("Learning folder feature coming soon.");
    }));
}
async function ns() {
  let t = [
    "AnteriorSegmentQuiz/html/index.html",
    "./AnteriorSegmentQuiz/html/index.html",
    window.location.pathname.replace(/\/[^/]*$/, "/") +
      "AnteriorSegmentQuiz/html/index.html",
    "/AnteriorSegmentQuiz/html/index.html",
  ];
  for (let a of t)
    try {
      if ((await fetch(a, { method: "HEAD" })).ok) return a;
    } catch {}
  return null;
}
async function is() {
  if (typeof window.loadPage != "function") return;
  let e = ["quizzes", "quiz", "quizzes.html", "quizPage"];
  for (let t of e)
    try {
      if (
        (await window.loadPage(t),
        await new Promise((a) => setTimeout(a, 0)),
        document.getElementById("anteriorSegmentQuizPage"))
      )
        return;
    } catch {}
}
function os() {
  return (
    document.querySelector("#pages") ||
    document.querySelector("#app") ||
    (document.querySelector(".page") &&
      document.querySelector(".page").parentElement) ||
    document.body
  );
}
function rs() {
  let e = document.getElementById("anteriorSegmentQuizPage");
  e ||
    ((e = document.createElement("section")),
    (e.id = "anteriorSegmentQuizPage"),
    (e.className = "page"),
    (e.style.height = "100vh"),
    (e.style.display = "none"),
    (e.innerHTML = `
      <iframe id="anteriorQuizFrame"
              title="Anterior Segment Quiz"
              data-i18n="quizzes.anteriorSegmentQuizTitle:title"
              style="width:100%;height:100%;border:none;"></iframe>
    `),
    os().appendChild(e));
  let t = e.querySelector("#anteriorQuizFrame") || e.querySelector("iframe");
  return { page: e, iframe: t };
}
async function ss() {
  await is();
  let { page: e, iframe: t } = rs(),
    a = await ns();
  if (a)
    ((t.onload = () => console.warn("Quiz iframe loaded:", a)),
      (t.onerror = () => console.error("Quiz iframe failed:", a)),
      (t.src = a));
  else {
    let n = document.createElement("div");
    ((n.style.padding = "16px"),
      n.appendChild(document.createTextNode("Couldn't find ")));
    let i = document.createElement("code");
    ((i.textContent = "AnteriorSegmentQuiz/html/index.html"),
      n.appendChild(i),
      n.appendChild(document.createTextNode(" from here.")),
      n.appendChild(document.createElement("br")),
      n.appendChild(document.createTextNode("Make sure the ")));
    let o = document.createElement("code");
    ((o.textContent = "AnteriorSegmentQuiz/"),
      n.appendChild(o),
      n.appendChild(
        document.createTextNode(" folder is deployed next to your app root."),
      ),
      e.replaceChildren(n));
  }
  typeof window.showPage == "function"
    ? window.showPage("anteriorSegmentQuizPage")
    : (document
        .querySelectorAll(".page")
        .forEach((n) => (n.style.display = "none")),
      (e.style.display = "block"));
}
window.initializeVideos = es;
window.__videosShow = (e) => {
  try {
    window.__videosPendingTarget = e;
  } catch {}
};
export {
  Dn as calculateVideoProgressPercent,
  jr as ensureChildhoodPilotSubtitleControlsForPage,
  Da as ensureVideoPageMenuButtonForPage,
  wi as getVideoNarrationVariant,
  Vs as goToVideosSection,
  Ds as initializeFullAnimationVideoPage,
  es as initializeVideos,
  at as isChildhoodEyeScreeningSubtitlePilotPage,
  Tr as loadChildhoodEyeScreeningSubtitleCatalog,
  Yr as refreshChildhoodPilotSubtitlesForLanguageChange,
  Fs as resetChildhoodPilotSubtitleCatalogForTests,
  Va as resolveChildhoodPilotSubtitleLanguage,
  Er as resolveVideoNarrationLanguage,
  Pr as sanitizeChildhoodEyeScreeningSubtitleCatalog,
  mt as setVideoNarrationAudioTime,
  Ms as showVideosPageById,
  Ke as syncChildhoodPilotSubtitlesForPage,
  vi as syncVideoNarrationForPage,
  sr as wireTimedPlaybackHolds,
};
