var e = (n, i) => `/images/learning/Ears/${n}/${i}.webp`,
  s = (n, i, o, c) => ({ title: n, text: i, image: o, caption: c }),
  h = "Arclight \u2014 Ears Only teaching slides",
  m = "Arclight \u2014 Website ENT teaching resources",
  l = (n, i, o = h) => ({ title: n, type: "scroll", sections: i, source: o }),
  a = (
    n,
    i,
    o,
    c = "World Health Organization \u2014 Primary ear and hearing care training manual (2023)",
  ) => ({ title: n, type: "pdf", asset: i, pages: o, source: c }),
  g = {
    earsHowWeHear: l("How We Hear", [
      s(
        "The hearing pathway",
        "Outer ear \u2192 middle ear \u2192 inner ear \u2192 brain.",
        e("ears", "image20"),
        "The outer ear collects sound, the middle ear makes it louder, the inner ear changes it into electrical signals, and the brain processes the sound.",
      ),
      s(
        "Parts of the ear",
        "Follow the numbered structures from the pinna to the hearing nerve.",
        e("ears", "image8"),
      ),
      s(
        "Anatomy reference",
        "Outer, middle and inner ear; ear canal and tympanic membrane.",
        e("ears", "image25"),
      ),
    ]),
    earsArclightIntroduction: l(
      "The Arclight Otoscope",
      [
        s(
          "The Arclight otoscope",
          "An integrated, solar-rechargeable otoscope designed for primary care and low-resource settings, enabling combined eye and ear examinations.",
          e("website", "image1"),
        ),
        s(
          "Training resources",
          "Instructional otoscopy video, universal otoscopy handout, simulation ears and video otoscopy.",
          e("website", "image9"),
        ),
      ],
      m,
    ),
    earsHealthPoster: a(
      "Ear Health & Hearing Impairment",
      "ear-health",
      null,
      "Arclight \u2014 Ear Health & Hearing Impairment (2024)",
    ),
    earsAnatomyReference: a(
      "Mechanism of Hearing & Anatomy",
      "who-manual",
      [16, 17, 18, 19, 20, 21, 22, 23, 24],
    ),
    earsAssessmentSequence: l("History, Hearing & Examination", [
      s(
        "Assess ear and hearing problems",
        "Take a history, test hearing and examine the ears.",
        e("ears", "image24"),
      ),
      s("Observe", "Swelling, redness and pus.", e("ears", "image10")),
      s(
        "Palpate and examine",
        "Palpate the mastoid, pinna and tragus. Otoscopy examines the canal and tympanic membrane.",
        e("ears", "image6"),
      ),
    ]),
    earsHistoryGuide: a(
      "Taking a Patient\u2019s History",
      "who-manual",
      [29, 30, 31, 32],
    ),
    earsExaminationGuide: a(
      "Examination of Both Ears",
      "who-manual",
      [33, 34, 35, 36, 37, 38],
    ),
    earsOtoscopyVideo: {
      title: "Otoscopy \u2014 Arclight",
      type: "video",
      asset: "otoscopy-arclight",
      duration: "02:48",
      source: "Arclight \u2014 Otoscopy Video, 2026 App",
    },
    earsOtoscopySignsVideo: {
      title: "Otoscopy & Clinical Signs",
      type: "video",
      asset: "otoscopy-signs",
      duration: "02:50",
      source: "Arclight \u2014 Otoscopy Short + Clinical Signs",
    },
    earsOtoscopyOsceVideo: {
      title: "Otoscopy OSCE \u2014 Traditional & Arclight",
      type: "video",
      asset: "otoscopy-osce",
      duration: "04:17",
      source: "Arclight \u2014 Otoscopy Instructional Video OSCE",
    },
    earsOtoscopeHandout: a(
      "How to Use the Arclight Otoscope",
      "otoscope-handout",
      null,
      "Arclight \u2014 Otoscope Handout (2026)",
    ),
    earsOtoscopyReference: a(
      "Otoscopy Technique & Precautions",
      "who-manual",
      [33, 34, 35, 36],
    ),
    earsTympanicBasics: {
      title: "Tympanic Membrane \u2014 Key Landmarks",
      type: "diagram",
      asset: "tm-simple",
      captions: [
        "Cone of light, tympanic membrane and handle of malleus.",
        "Review the key landmarks on the original teaching image.",
      ],
      source: "Arclight \u2014 Tympanic Membrane Simplified",
    },
    earsTympanicDetailed: {
      title: "Tympanic Membrane \u2014 Detailed Landmarks",
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
        "Arclight \u2014 Tympanic Membrane normal video with movement v2 (slide sequence)",
    },
    earsNormalAbnormal: l(
      "Normal & Abnormal Tympanic Membranes",
      [
        s(
          "Normal landmarks",
          "Tympanic membrane, handle of malleus and cone of light.",
          e("ears", "image2"),
        ),
        s(
          "Compare appearances",
          "Normal, otitis media with effusion, acute otitis media, chronic otitis media with perforation and dry perforation.",
          e("website", "image10"),
        ),
        s(
          "Compare the teaching examples",
          "Dry hole, acute otitis media, wet hole and glue ear are shown in the original teaching reference.",
          e("ears", "image11"),
        ),
      ],
      "Arclight \u2014 Ears Only and Website ENT teaching images",
    ),
    earsExternalPoster: a(
      "External Ear & Ear Canal Findings",
      "external-ear-poster",
      null,
      "Arclight \u2014 External Ears Teaching Poster (2024)",
    ),
    earsOtoscopyPoster: a(
      "Otoscopy Teaching Poster",
      "otoscopy-poster",
      null,
      "Arclight \u2014 Otoscopy ENT Poster",
    ),
    earsOuterEarReference: a(
      "Outer Ear \u2014 Diagnose, Treat, Refer",
      "who-manual",
      Array.from({ length: 20 }, (n, i) => i + 40),
    ),
    earsMiddleEarReference: a(
      "Middle Ear \u2014 Diagnose, Treat, Refer",
      "who-manual",
      Array.from({ length: 22 }, (n, i) => i + 60),
    ),
    earsVideoOtoscopy: l(
      "Video Otoscopy",
      [
        s(
          "Mobile phone attachment",
          "The Arclight Otoscope can attach to a mobile phone camera to acquire video of the ear canal and tympanic membrane for teaching and telemedicine.",
          e("website", "image1"),
        ),
        s(
          "Teaching together",
          "Video otoscopy allows the ear canal and tympanic membrane to be viewed during teaching.",
          e("website", "image11"),
        ),
      ],
      m,
    ),
    earsSimulation: l(
      "Simulation Ear Practice",
      [
        s(
          "Simulation ears",
          "The simulation ear has a range of tympanic membrane options to train, then test participants in workshops.",
          e("website", "image7"),
        ),
        s(
          "Practise the examination",
          "Use the supplied simulation ear and tympanic membrane options for workshop practice.",
          e("website", "image8"),
        ),
      ],
      m,
    ),
    earsHearingOverview: l("Hearing Loss & Prevention", [
      s(
        "Ear health and hearing impairment",
        "Hearing loss can affect communication, speech and language development, education, employment and relationships.",
        e("ears", "image4"),
      ),
      s(
        "Causes of hearing loss",
        "Use the source diagram to review causes across the life course.",
        e("ears", "image9"),
      ),
      s(
        "Prevention in children",
        "The teaching slides highlight immunization, maternal and neonatal care, screening and early management of otitis media.",
        e("ears", "image17"),
      ),
    ]),
    earsSafeListening: a(
      "Safe Listening & Unsafe Noise",
      "safe-listening",
      null,
      "World Health Organization \u2014 Unsafe noise flyer",
    ),
    earsHealthyEars: a(
      "Tips for Healthy Ears",
      "healthy-ears",
      null,
      "World Health Organization \u2014 Tips for healthy ears",
    ),
    earsHearingLossReference: a(
      "Hearing Loss \u2014 Grades, Causes & Prevention",
      "who-manual",
      Array.from({ length: 12 }, (n, i) => i + 84),
    ),
    earsChildHearing: l("Hearing Development in Children", [
      s(
        "Hearing and speech development",
        "Review the hearing-development and speech/language-development information in the source teaching chart.",
        e("ears", "image27"),
      ),
      s(
        "Testing hearing in children",
        "The teaching images introduce observation and voice testing. The WHO practicals below provide the complete age-specific test instructions.",
        e("ears", "image13"),
      ),
      s(
        "Voice test",
        "Review the demonstration image, then open the age-appropriate WHO practical.",
        e("ears", "image14"),
      ),
    ]),
    earsChildFlyer: a(
      "Hearing Loss in Children",
      "hearing-children",
      null,
      "World Health Organization \u2014 Hearing loss in children",
    ),
    earsChildMilestones: a(
      "Hearing & Language Milestones",
      "who-manual",
      [97, 98, 99],
    ),
    earsDistractionTest: a(
      "Distraction Test \u2014 Young Children",
      "who-manual",
      [100, 101, 102, 103],
    ),
    earsChildVoiceTest: a(
      "Voice Test \u2014 Children Aged 3\u20137 Years",
      "who-manual",
      [104, 105],
    ),
    earsAdultFlyer: a(
      "Hearing Loss in Adults",
      "hearing-adults",
      null,
      "World Health Organization \u2014 Hearing loss in adults",
    ),
    earsWhisperTest: a(
      "Whispered Voice Test \u2014 Adults & Older Children",
      "who-manual",
      [106, 107, 108],
    ),
    earsAdultAssessment: a(
      "Identifying Hearing Loss in Adults",
      "who-manual",
      [108, 109, 110, 111, 112, 113, 114, 115],
    ),
    earsHearingAidCare: a(
      "Tips for Hearing Aid Users",
      "hearing-aids",
      null,
      "World Health Organization \u2014 Tips for hearing aid users",
    ),
    earsRehabilitation: a(
      "Hearing Rehabilitation & Support",
      "who-manual",
      [116, 117, 118, 119, 120, 121, 122, 123],
    ),
    earsWashout: a(
      "Washout of the Ear \u2014 WHO Practical C",
      "who-manual",
      [52, 53, 54],
    ),
    earsDryMopping: a(
      "Dry Mopping \u2014 WHO Practical D",
      "who-manual",
      [55, 56],
    ),
    earsEarDrops: a(
      "Instilling Ear Drops \u2014 WHO Practical E",
      "who-manual",
      [57, 58],
    ),
    earsDischargeCare: a(
      "Care of Discharging Ears",
      "discharging-ears",
      null,
      "World Health Organization \u2014 Care of discharging ears",
    ),
    earsHealthWorkers: a(
      "Ear & Hearing Care \u2014 Role of Health Workers",
      "health-workers",
      null,
      "World Health Organization \u2014 Hearing loss and role of health care providers",
    ),
    earsWhoManual: a("WHO Training Manual", "who-manual"),
    earsWhoTrainer: a(
      "WHO Trainer\u2019s Handbook",
      "who-trainer",
      null,
      "World Health Organization \u2014 Primary ear and hearing care trainer\u2019s handbook (2023)",
    ),
    earsWhoResources: a(
      "WHO Trainer\u2019s Resources & Annexures",
      "who-resources",
      null,
      "World Health Organization \u2014 Trainer\u2019s handbook annexures",
    ),
    earsWhoAnnex: a(
      "WHO Manual \u2014 Sources & Development",
      "who-annex",
      null,
      "World Health Organization \u2014 Training manual web annex",
    ),
    earsWhoResolution: a(
      "WHO Assembly \u2014 Prevention of Deafness & Hearing Loss",
      "who-resolution",
      null,
      "World Health Organization \u2014 World Health Assembly resolution WHA70.13 (2017)",
    ),
    earsFieldFront: a(
      "Madagascar Arclight Handout \u2014 Front",
      "field-handout-front",
      null,
      "Arclight \u2014 Madagascar handout (2026), front",
    ),
    earsFieldBack: a(
      "Madagascar Arclight Handout \u2014 Back",
      "field-handout-back",
      null,
      "Arclight \u2014 Madagascar handout (2026), back",
    ),
    earsTeachingSlides: {
      title: "Ears Teaching Slides",
      type: "download",
      asset: "/documents/ears/ears.pptx",
      source: h,
    },
    earsSimplifiedSlides: {
      title: "Tympanic Membrane \u2014 Simplified Slides",
      type: "download",
      asset: "/documents/ears/tm-simple.pptx",
      source: "Arclight \u2014 Tympanic Membrane Simplified",
    },
    earsDetailedSlides: {
      title: "Tympanic Membrane \u2014 Detailed Slides",
      type: "download",
      asset: "/documents/ears/tm-detailed.pptx",
      source: "Arclight \u2014 Tympanic Membrane landmark slides",
    },
    earsWebsiteDocument: {
      title: "Arclight Otoscope \u2014 Original Resource Document",
      type: "download",
      asset: "/documents/ears/website-ent.docx",
      source: m,
    },
  },
  t = (n, i, o, c) => ({ title: n, category: i, image: o, groups: c }),
  r = (n, i) => ({ level: n, lessons: i }),
  d = {
    earsAnatomy: t("Ear Health & Anatomy", "exam", e("ears", "image8"), [
      r("primary", [
        "earsHowWeHear",
        "earsArclightIntroduction",
        "earsHealthPoster",
      ]),
      r("intermediate", ["earsAnatomyReference"]),
    ]),
    earsExamination: t("History & Examination", "exam", e("ears", "image24"), [
      r("primary", [
        "earsAssessmentSequence",
        "earsHistoryGuide",
        "earsExaminationGuide",
      ]),
    ]),
    earsOtoscopy: t("Otoscopy", "exam", e("website", "image3"), [
      r("primary", [
        "earsOtoscopyVideo",
        "earsOtoscopeHandout",
        "earsOtoscopyReference",
      ]),
      r("intermediate", ["earsOtoscopySignsVideo", "earsOtoscopyOsceVideo"]),
    ]),
    earsTympanicMembrane: t("Tympanic Membrane", "exam", e("ears", "image7"), [
      r("primary", ["earsTympanicBasics", "earsNormalAbnormal"]),
      r("intermediate", ["earsTympanicDetailed"]),
    ]),
    earsConditions: t(
      "Common Ear Conditions",
      "exam",
      e("website", "image10"),
      [
        r("primary", ["earsExternalPoster", "earsOtoscopyPoster"]),
        r("intermediate", ["earsOuterEarReference", "earsMiddleEarReference"]),
      ],
    ),
    earsVideoSimulation: t(
      "Video Otoscopy & Simulation",
      "exam",
      e("website", "image8"),
      [r("intermediate", ["earsVideoOtoscopy", "earsSimulation"])],
    ),
    earsHearingLoss: t(
      "Hearing Loss & Prevention",
      "hearing",
      e("ears", "image9"),
      [
        r("primary", [
          "earsHearingOverview",
          "earsHealthyEars",
          "earsSafeListening",
        ]),
        r("intermediate", ["earsHearingLossReference"]),
      ],
    ),
    earsHearingChildren: t(
      "Hearing in Children",
      "hearing",
      e("ears", "image13"),
      [
        r("primary", [
          "earsChildHearing",
          "earsChildFlyer",
          "earsChildMilestones",
        ]),
        r("intermediate", ["earsDistractionTest", "earsChildVoiceTest"]),
      ],
    ),
    earsHearingAdults: t("Hearing in Adults", "hearing", e("ears", "image14"), [
      r("primary", ["earsAdultFlyer", "earsWhisperTest"]),
      r("intermediate", ["earsAdultAssessment"]),
    ]),
    earsHearingSupport: t(
      "Hearing Support & Aids",
      "hearing",
      e("ears", "image15"),
      [
        r("primary", ["earsHearingAidCare"]),
        r("intermediate", ["earsRehabilitation"]),
      ],
    ),
    earsIrrigation: t("Ear Irrigation", "procedures", e("ears", "image6"), [
      r("primary", ["earsWashout"]),
    ]),
    earsMopping: t("Dry Mopping", "procedures", e("website", "image3"), [
      r("primary", ["earsDryMopping", "earsDischargeCare"]),
    ]),
    earsDrops: t("Ear Drops", "procedures", e("ears", "image10"), [
      r("primary", ["earsEarDrops"]),
    ]),
    earsWhoTraining: t(
      "WHO Training Resources",
      "workshops",
      e("website", "image5"),
      [
        r("primary", ["earsWhoManual", "earsHealthWorkers"]),
        r("intermediate", [
          "earsWhoTrainer",
          "earsWhoResources",
          "earsWhoAnnex",
          "earsWhoResolution",
        ]),
      ],
    ),
    earsTeachingResources: t(
      "Arclight Teaching Resources",
      "workshops",
      e("ears", "image22"),
      [
        r("primary", ["earsFieldFront", "earsFieldBack"]),
        r("intermediate", [
          "earsTeachingSlides",
          "earsSimplifiedSlides",
          "earsDetailedSlides",
          "earsWebsiteDocument",
        ]),
      ],
    ),
  },
  p = {
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
  },
  u = Object.freeze([...Object.keys(d), ...Object.keys(g)]),
  y = Object.freeze(
    Object.fromEntries(
      Object.entries(d).flatMap(([n, i]) =>
        i.groups.flatMap(({ lessons: o }) => o.map((c) => [c, n])),
      ),
    ),
  );
function H(n) {
  let i = d[n]?.title || g[n]?.title || "Ears";
  return window.I18N?.t?.(`ears.content.${n}`, i) || i;
}
export { g as a, d as b, p as c, y as d, H as e };
