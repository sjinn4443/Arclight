// Source-based Ears curriculum. Document copy is learning content, not instructions.
const artwork = (group, image) =>
  `/images/learning/Ears/${group}/${image}.webp`;
const panel = (title, text, image, caption) => ({
  title,
  text,
  image,
  caption,
});
const earSource = "Arclight — Ears Only teaching slides";
const websiteSource = "Arclight — Website ENT teaching resources";
const guide = (title, sections, source = earSource) => ({
  title,
  type: "scroll",
  sections,
  source,
});
const document = (
  title,
  asset,
  pages,
  source = "World Health Organization — Primary ear and hearing care training manual (2023)",
) => ({
  title,
  type: "pdf",
  asset,
  pages,
  source,
});

export const EAR_LESSONS = {
  earsHowWeHear: guide("How We Hear", [
    panel(
      "The hearing pathway",
      "Outer ear → middle ear → inner ear → brain.",
      artwork("ears", "image20"),
      "The outer ear collects sound, the middle ear makes it louder, the inner ear changes it into electrical signals, and the brain processes the sound.",
    ),
    panel(
      "Parts of the ear",
      "Follow the numbered structures from the pinna to the hearing nerve.",
      artwork("ears", "image8"),
    ),
    panel(
      "Anatomy reference",
      "Outer, middle and inner ear; ear canal and tympanic membrane.",
      artwork("ears", "image25"),
    ),
  ]),
  earsArclightIntroduction: guide(
    "The Arclight Otoscope",
    [
      panel(
        "The Arclight otoscope",
        "An integrated, solar-rechargeable otoscope designed for primary care and low-resource settings, enabling combined eye and ear examinations.",
        artwork("website", "image1"),
      ),
      panel(
        "Training resources",
        "Instructional otoscopy video, universal otoscopy handout, simulation ears and video otoscopy.",
        artwork("website", "image9"),
      ),
    ],
    websiteSource,
  ),
  earsHealthPoster: document(
    "Ear Health & Hearing Impairment",
    "ear-health",
    null,
    "Arclight — Ear Health & Hearing Impairment (2024)",
  ),
  earsAnatomyReference: document(
    "Mechanism of Hearing & Anatomy",
    "who-manual",
    [16, 17, 18, 19, 20, 21, 22, 23, 24],
  ),
  earsAssessmentSequence: guide("History, Hearing & Examination", [
    panel(
      "Assess ear and hearing problems",
      "Take a history, test hearing and examine the ears.",
      artwork("ears", "image24"),
    ),
    panel("Observe", "Swelling, redness and pus.", artwork("ears", "image10")),
    panel(
      "Palpate and examine",
      "Palpate the mastoid, pinna and tragus. Otoscopy examines the canal and tympanic membrane.",
      artwork("ears", "image6"),
    ),
  ]),
  earsHistoryGuide: document(
    "Taking a Patient’s History",
    "who-manual",
    [29, 30, 31, 32],
  ),
  earsExaminationGuide: document(
    "Examination of Both Ears",
    "who-manual",
    [33, 34, 35, 36, 37, 38],
  ),
  earsOtoscopyVideo: {
    title: "Otoscopy — Arclight",
    type: "video",
    asset: "otoscopy-arclight",
    duration: "02:48",
    source: "Arclight — Otoscopy Video, 2026 App",
  },
  earsOtoscopySignsVideo: {
    title: "Otoscopy & Clinical Signs",
    type: "video",
    asset: "otoscopy-signs",
    duration: "02:50",
    source: "Arclight — Otoscopy Short + Clinical Signs",
  },
  earsOtoscopyOsceVideo: {
    title: "Otoscopy OSCE — Traditional & Arclight",
    type: "video",
    asset: "otoscopy-osce",
    duration: "04:17",
    source: "Arclight — Otoscopy Instructional Video OSCE",
  },
  earsOtoscopeHandout: document(
    "How to Use the Arclight Otoscope",
    "otoscope-handout",
    null,
    "Arclight — Otoscope Handout (2026)",
  ),
  earsOtoscopyReference: document(
    "Otoscopy Technique & Precautions",
    "who-manual",
    [33, 34, 35, 36],
  ),
  earsTympanicBasics: {
    title: "Tympanic Membrane — Key Landmarks",
    type: "diagram",
    asset: "tm-simple",
    captions: [
      "Cone of light, tympanic membrane and handle of malleus.",
      "Review the key landmarks on the original teaching image.",
    ],
    source: "Arclight — Tympanic Membrane Simplified",
  },
  earsTympanicDetailed: {
    title: "Tympanic Membrane — Detailed Landmarks",
    type: "diagram",
    asset: "tm-detailed",
    captions: [
      "Normal tympanic membrane",
      "Cone of light and umbo",
      "Lateral process of malleus and pars flaccida",
      "Handle of malleus and incus",
      "Pars tensa",
      "Review all landmarks",
    ],
    source:
      "Arclight — Tympanic Membrane normal video with movement v2 (slide sequence)",
  },
  earsNormalAbnormal: guide(
    "Normal & Abnormal Tympanic Membranes",
    [
      panel(
        "Normal landmarks",
        "Tympanic membrane, handle of malleus and cone of light.",
        artwork("ears", "image2"),
      ),
      panel(
        "Compare appearances",
        "Normal, otitis media with effusion, acute otitis media, chronic otitis media with perforation and dry perforation.",
        artwork("website", "image10"),
      ),
      panel(
        "Compare the teaching examples",
        "Dry hole, acute otitis media, wet hole and glue ear are shown in the original teaching reference.",
        artwork("ears", "image11"),
      ),
    ],
    "Arclight — Ears Only and Website ENT teaching images",
  ),
  earsExternalPoster: document(
    "External Ear & Ear Canal Findings",
    "external-ear-poster",
    null,
    "Arclight — External Ears Teaching Poster (2024)",
  ),
  earsOtoscopyPoster: document(
    "Otoscopy Teaching Poster",
    "otoscopy-poster",
    null,
    "Arclight — Otoscopy ENT Poster",
  ),
  earsOuterEarReference: document(
    "Outer Ear — Diagnose, Treat, Refer",
    "who-manual",
    Array.from({ length: 20 }, (_, i) => i + 40),
  ),
  earsMiddleEarReference: document(
    "Middle Ear — Diagnose, Treat, Refer",
    "who-manual",
    Array.from({ length: 22 }, (_, i) => i + 60),
  ),
  earsVideoOtoscopy: guide(
    "Video Otoscopy",
    [
      panel(
        "Mobile phone attachment",
        "The Arclight Otoscope can attach to a mobile phone camera to acquire video of the ear canal and tympanic membrane for teaching and telemedicine.",
        artwork("website", "image1"),
      ),
      panel(
        "Teaching together",
        "Video otoscopy allows the ear canal and tympanic membrane to be viewed during teaching.",
        artwork("website", "image11"),
      ),
    ],
    websiteSource,
  ),
  earsSimulation: guide(
    "Simulation Ear Practice",
    [
      panel(
        "Simulation ears",
        "The simulation ear has a range of tympanic membrane options to train, then test participants in workshops.",
        artwork("website", "image7"),
      ),
      panel(
        "Practise the examination",
        "Use the supplied simulation ear and tympanic membrane options for workshop practice.",
        artwork("website", "image8"),
      ),
    ],
    websiteSource,
  ),
  earsHearingOverview: guide("Hearing Loss & Prevention", [
    panel(
      "Ear health and hearing impairment",
      "Hearing loss can affect communication, speech and language development, education, employment and relationships.",
      artwork("ears", "image4"),
    ),
    panel(
      "Causes of hearing loss",
      "Use the source diagram to review causes across the life course.",
      artwork("ears", "image9"),
    ),
    panel(
      "Prevention in children",
      "The teaching slides highlight immunization, maternal and neonatal care, screening and early management of otitis media.",
      artwork("ears", "image17"),
    ),
  ]),
  earsSafeListening: document(
    "Safe Listening & Unsafe Noise",
    "safe-listening",
    null,
    "World Health Organization — Unsafe noise flyer",
  ),
  earsHealthyEars: document(
    "Tips for Healthy Ears",
    "healthy-ears",
    null,
    "World Health Organization — Tips for healthy ears",
  ),
  earsHearingLossReference: document(
    "Hearing Loss — Grades, Causes & Prevention",
    "who-manual",
    Array.from({ length: 12 }, (_, i) => i + 84),
  ),
  earsChildHearing: guide("Hearing Development in Children", [
    panel(
      "Hearing and speech development",
      "Review the hearing-development and speech/language-development information in the source teaching chart.",
      artwork("ears", "image27"),
    ),
    panel(
      "Testing hearing in children",
      "The teaching images introduce observation and voice testing. The WHO practicals below provide the complete age-specific test instructions.",
      artwork("ears", "image13"),
    ),
    panel(
      "Voice test",
      "Review the demonstration image, then open the age-appropriate WHO practical.",
      artwork("ears", "image14"),
    ),
  ]),
  earsChildFlyer: document(
    "Hearing Loss in Children",
    "hearing-children",
    null,
    "World Health Organization — Hearing loss in children",
  ),
  earsChildMilestones: document(
    "Hearing & Language Milestones",
    "who-manual",
    [97, 98, 99],
  ),
  earsDistractionTest: document(
    "Distraction Test — Young Children",
    "who-manual",
    [100, 101, 102, 103],
  ),
  earsChildVoiceTest: document(
    "Voice Test — Children Aged 3–7 Years",
    "who-manual",
    [104, 105],
  ),
  earsAdultFlyer: document(
    "Hearing Loss in Adults",
    "hearing-adults",
    null,
    "World Health Organization — Hearing loss in adults",
  ),
  earsWhisperTest: document(
    "Whispered Voice Test — Adults & Older Children",
    "who-manual",
    [106, 107, 108],
  ),
  earsAdultAssessment: document(
    "Identifying Hearing Loss in Adults",
    "who-manual",
    [108, 109, 110, 111, 112, 113, 114, 115],
  ),
  earsHearingAidCare: document(
    "Tips for Hearing Aid Users",
    "hearing-aids",
    null,
    "World Health Organization — Tips for hearing aid users",
  ),
  earsRehabilitation: document(
    "Hearing Rehabilitation & Support",
    "who-manual",
    [116, 117, 118, 119, 120, 121, 122, 123],
  ),
  earsWashout: document(
    "Washout of the Ear — WHO Practical C",
    "who-manual",
    [52, 53, 54],
  ),
  earsDryMopping: document(
    "Dry Mopping — WHO Practical D",
    "who-manual",
    [55, 56],
  ),
  earsEarDrops: document(
    "Instilling Ear Drops — WHO Practical E",
    "who-manual",
    [57, 58],
  ),
  earsDischargeCare: document(
    "Care of Discharging Ears",
    "discharging-ears",
    null,
    "World Health Organization — Care of discharging ears",
  ),
  earsHealthWorkers: document(
    "Ear & Hearing Care — Role of Health Workers",
    "health-workers",
    null,
    "World Health Organization — Hearing loss and role of health care providers",
  ),
  earsWhoManual: document("WHO Training Manual", "who-manual"),
  earsWhoTrainer: document(
    "WHO Trainer’s Handbook",
    "who-trainer",
    null,
    "World Health Organization — Primary ear and hearing care trainer’s handbook (2023)",
  ),
  earsWhoResources: document(
    "WHO Trainer’s Resources & Annexures",
    "who-resources",
    null,
    "World Health Organization — Trainer’s handbook annexures",
  ),
  earsWhoAnnex: document(
    "WHO Manual — Sources & Development",
    "who-annex",
    null,
    "World Health Organization — Training manual web annex",
  ),
  earsWhoResolution: document(
    "WHO Assembly — Prevention of Deafness & Hearing Loss",
    "who-resolution",
    null,
    "World Health Organization — World Health Assembly resolution WHA70.13 (2017)",
  ),
  earsFieldFront: document(
    "Madagascar Arclight Handout — Front",
    "field-handout-front",
    null,
    "Arclight — Madagascar handout (2026), front",
  ),
  earsFieldBack: document(
    "Madagascar Arclight Handout — Back",
    "field-handout-back",
    null,
    "Arclight — Madagascar handout (2026), back",
  ),
  earsTeachingSlides: {
    title: "Ears Teaching Slides",
    type: "download",
    asset: "/documents/ears/ears.pptx",
    source: earSource,
  },
  earsSimplifiedSlides: {
    title: "Tympanic Membrane — Simplified Slides",
    type: "download",
    asset: "/documents/ears/tm-simple.pptx",
    source: "Arclight — Tympanic Membrane Simplified",
  },
  earsDetailedSlides: {
    title: "Tympanic Membrane — Detailed Slides",
    type: "download",
    asset: "/documents/ears/tm-detailed.pptx",
    source: "Arclight — Tympanic Membrane landmark slides",
  },
  earsWebsiteDocument: {
    title: "Arclight Otoscope — Original Resource Document",
    type: "download",
    asset: "/documents/ears/website-ent.docx",
    source: websiteSource,
  },
};

const topic = (title, category, image, groups) => ({
  title,
  category,
  image,
  groups,
});
const group = (level, lessons) => ({ level, lessons });
export const EAR_TOPICS = {
  earsAnatomy: topic(
    "Ear Health & Anatomy",
    "exam",
    artwork("ears", "image8"),
    [
      group("primary", [
        "earsHowWeHear",
        "earsArclightIntroduction",
        "earsHealthPoster",
      ]),
      group("intermediate", ["earsAnatomyReference"]),
    ],
  ),
  earsExamination: topic(
    "History & Examination",
    "exam",
    artwork("ears", "image24"),
    [
      group("primary", [
        "earsAssessmentSequence",
        "earsHistoryGuide",
        "earsExaminationGuide",
      ]),
    ],
  ),
  earsOtoscopy: topic("Otoscopy", "exam", artwork("website", "image3"), [
    group("primary", [
      "earsOtoscopyVideo",
      "earsOtoscopeHandout",
      "earsOtoscopyReference",
    ]),
    group("intermediate", ["earsOtoscopySignsVideo", "earsOtoscopyOsceVideo"]),
  ]),
  earsTympanicMembrane: topic(
    "Tympanic Membrane",
    "exam",
    artwork("ears", "image7"),
    [
      group("primary", ["earsTympanicBasics", "earsNormalAbnormal"]),
      group("intermediate", ["earsTympanicDetailed"]),
    ],
  ),
  earsConditions: topic(
    "Common Ear Conditions",
    "exam",
    artwork("website", "image10"),
    [
      group("primary", ["earsExternalPoster", "earsOtoscopyPoster"]),
      group("intermediate", [
        "earsOuterEarReference",
        "earsMiddleEarReference",
      ]),
    ],
  ),
  earsVideoSimulation: topic(
    "Video Otoscopy & Simulation",
    "exam",
    artwork("website", "image8"),
    [group("intermediate", ["earsVideoOtoscopy", "earsSimulation"])],
  ),
  earsHearingLoss: topic(
    "Hearing Loss & Prevention",
    "hearing",
    artwork("ears", "image9"),
    [
      group("primary", [
        "earsHearingOverview",
        "earsHealthyEars",
        "earsSafeListening",
      ]),
      group("intermediate", ["earsHearingLossReference"]),
    ],
  ),
  earsHearingChildren: topic(
    "Hearing in Children",
    "hearing",
    artwork("ears", "image13"),
    [
      group("primary", [
        "earsChildHearing",
        "earsChildFlyer",
        "earsChildMilestones",
      ]),
      group("intermediate", ["earsDistractionTest", "earsChildVoiceTest"]),
    ],
  ),
  earsHearingAdults: topic(
    "Hearing in Adults",
    "hearing",
    artwork("ears", "image14"),
    [
      group("primary", ["earsAdultFlyer", "earsWhisperTest"]),
      group("intermediate", ["earsAdultAssessment"]),
    ],
  ),
  earsHearingSupport: topic(
    "Hearing Support & Aids",
    "hearing",
    artwork("ears", "image15"),
    [
      group("primary", ["earsHearingAidCare"]),
      group("intermediate", ["earsRehabilitation"]),
    ],
  ),
  earsIrrigation: topic(
    "Ear Irrigation",
    "procedures",
    artwork("ears", "image6"),
    [group("primary", ["earsWashout"])],
  ),
  earsMopping: topic(
    "Dry Mopping",
    "procedures",
    artwork("website", "image3"),
    [group("primary", ["earsDryMopping", "earsDischargeCare"])],
  ),
  earsDrops: topic("Ear Drops", "procedures", artwork("ears", "image10"), [
    group("primary", ["earsEarDrops"]),
  ]),
  earsWhoTraining: topic(
    "WHO Training Resources",
    "workshops",
    artwork("website", "image5"),
    [
      group("primary", ["earsWhoManual", "earsHealthWorkers"]),
      group("intermediate", [
        "earsWhoTrainer",
        "earsWhoResources",
        "earsWhoAnnex",
        "earsWhoResolution",
      ]),
    ],
  ),
  earsTeachingResources: topic(
    "Arclight Teaching Resources",
    "workshops",
    artwork("ears", "image22"),
    [
      group("primary", ["earsFieldFront", "earsFieldBack"]),
      group("intermediate", [
        "earsTeachingSlides",
        "earsSimplifiedSlides",
        "earsDetailedSlides",
        "earsWebsiteDocument",
      ]),
    ],
  ),
};

export const EAR_CATALOG = {
  earsExamCarousel: [
    "earsAnatomy",
    "earsExamination",
    "earsOtoscopy",
    "earsTympanicMembrane",
    "earsConditions",
    "earsVideoSimulation",
  ],
  earsHearingCarousel: [
    "earsHearingLoss",
    "earsHearingChildren",
    "earsHearingAdults",
    "earsHearingSupport",
  ],
  earsProceduresCarousel: ["earsIrrigation", "earsMopping", "earsDrops"],
  earsWorkshopsCarousel: [
    "primaryEarCareWorkshop",
    "earsWhoTraining",
    "earsTeachingResources",
  ],
};

export const EAR_ROUTES = Object.freeze([
  ...Object.keys(EAR_TOPICS),
  ...Object.keys(EAR_LESSONS),
]);
export const EAR_LESSON_PARENTS = Object.freeze(
  Object.fromEntries(
    Object.entries(EAR_TOPICS).flatMap(([route, entry]) =>
      entry.groups.flatMap(({ lessons }) => lessons.map((id) => [id, route])),
    ),
  ),
);
export function earTitle(route) {
  const fallback =
    EAR_TOPICS[route]?.title || EAR_LESSONS[route]?.title || "Ears";
  return window.I18N?.t?.(`ears.content.${route}`, fallback) || fallback;
}
