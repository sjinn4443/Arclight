// Source-derived Kids OR curriculum. Shared lessons retain their owners.
export const PAEDIATRIC_ROUTE = "paediatricSurgicalEyeEarWorkshop";

export const PAEDIATRIC_PAGE = "paediatricSurgicalEyeEarWorkshopPage";

export const PAEDIATRIC_TITLE = "Paediatric Surgical Eye & Ear";

export const PAEDIATRIC_COPY_PREFIX = "paediatricSurgicalEyeEarWorkshop";

export const PAEDIATRIC_COPY = {
  title: "Paediatric Surgical Eye & Ear",
  carousel_title: "Paediatric Surgical\nEye & Ear",
  coming_soon: "coming soon",
  introduction: "Introduction",
  overview: "Workshop overview",
  arclight: "What is the Arclight?",
  arclight_video: "How to use the Arclight",
  front: "Front of Eye Examination",
  fundal: "Fundal Reflex Examination",
  direct: "Direct Ophthalmoscopy",
  otoscopy: "Otoscopy",
  front_animation: "Front of Eye Examination Animation",
  front_pdf: "Front of Eye Examination PDF",
  fundal_animation: "Fundal Reflex Examination Animation",
  fundal_pdf: "Fundal Reflex Examination PDF",
  direct_animation: "Direct Ophthalmoscopy Animation",
  direct_pdf: "Direct Ophthalmoscopy PDF",
  otoscopy_animation: "Otoscopy Animation",
  otoscopy_pdf: "Otoscopy PDF",
  objectives: "Learning objectives",
  how: "How to perform",
  train_test: "Train and Test",
  anterior_cases: "Front of eye: image cases",
  fundal_test: "Fundal Reflex Test",
  ear_hearing: "Testing hearing in children",
  ear_examination: "Ear examination",
  ear_practice: "Otoscopy practice",
  membranes: "Tympanic membranes",
  image_practice: "Tympanic Membranes Quiz",
  structure: "Workshop structure",
  structure_intro:
    "Start with the Arclight, then work through four examinations.",
  formats: "Learn, practise and test",
  formats_copy:
    "Each examination includes learning objectives and existing examination resources. Work through the animated guide, animation video, downloadable PDF and examination video, then use the cases and tests to check your understanding.",
  children: "Eye and ear examination in children",
  children_copy:
    "This workshop brings together front of eye examination, fundal red reflex testing, direct ophthalmoscopy and otoscopy for paediatric surgical care.",
  common_red: "Common causes of red eye",
  common_red_copy:
    "Be able to identify common, less serious causes of red eye, such as infective and allergic conjunctivitis.",
  serious_red: "More serious causes of red eye",
  serious_red_copy:
    "Be able to identify less common but more serious causes of red eye, such as corneal ulcer and foreign body.",
  injury: "Penetrating injury and ruptured globe",
  injury_copy:
    "Be able to identify signs of penetrating injury and ruptured globe.",
  all_children: "All children attending a health facility",
  all_children_copy:
    "All children attending a health facility need this test performed.",
  exclude: "Exclude cataract and retinoblastoma",
  exclude_copy:
    "Use the fundal red reflex test to exclude cataract and retinoblastoma.",
  timing: "Birth and immunisation visits",
  timing_copy:
    "Ideally, the test is performed at birth and at every immunisation visit.",
  neurological: "Headache and neurological disorders",
  neurological_copy:
    "Children with headache and neurological disorders benefit from examination of the back of the eye, especially the optic disc.",
  healthy_disc: "Identify a healthy optic disc",
  healthy_disc_copy:
    "Be able to identify a healthy optic disc and differentiate it from a swollen or pale nerve.",
  abnormal_disc: "Swollen and pale nerves",
  abnormal_disc_copy:
    "A swollen nerve is suggestive of raised intracranial pressure. A pale nerve suggests major neurological disease.",
  ear_symptoms: "Headache, fever, ear pain or poor hearing",
  ear_symptoms_copy:
    "Children with headache, fever, ear pain or poor hearing benefit from a hearing check as well as ear and otoscopy examination.",
  safe_otoscopy: "Safely perform otoscopy",
  safe_otoscopy_copy:
    "Be able to safely perform otoscopy on a range of ages of children.",
  recognise_ear: "Normal and abnormal eardrums",
  recognise_ear_copy:
    "Be able to tell a normal eardrum from an abnormal one and recognise active infection, ‘glue ear’ or a hole in the eardrum.",
  compare: "Compare the appearances",
  compare_copy:
    "Study the tympanic membrane images, then check your understanding in the quiz.",
  reference: "Tympanic membranes: source comparison",
  practice_heading: "Choose the correct answer",
  practice_copy:
    "Choose the description that best matches each tympanic membrane image.",
  normal: "Normal",
  hole: "Hole",
  csom: "Chronic Suppurative Otitis Media (CSOM)",
  csom_hole: "CSOM & Hole",
  ome: "Otitis Media with Effusion (OME)",
  image_case: "Tympanic membrane image",
  intermediate_cases: "Case Study",
  direct_test: "Direct Ophthalmoscopy Test",
  image_question: "Which option best describes this image?",
  infective_image: "Infective red eye: neonatal conjunctivitis",
  ulcer_image: "Corneal ulcer",
  injury_image: "Penetrating injury",
  healthy_reflex_image: "Healthy, symmetrical fundal reflex",
  cataract_image: "Cataract",
  retinoblastoma_image: "Retinoblastoma",
  pathway_image: "Visual pathway",
  normal_disc_image: "Normal optic disc",
  swollen_disc_image: "Swollen optic disc",
  pale_disc_image: "Pale optic disc",
};

export const PAEDIATRIC_FOLDERS = [
  {
    id: "introduction",
    label: "introduction",
    lessons: [
      {
        id: "paediatricOverviewPage",
        label: "overview",
        type: "scroll",
        route: "paediatricSurgicalEyeEarWorkshop",
        target: "paediatricOverviewPage",
      },
      {
        id: "paediatricArclightGuide",
        label: "arclight",
        type: "scroll",
        route: "medicalStudentsWorkshop",
        target: "medicalArclightScrollPage",
      },
      {
        id: "paediatricArclightVideo",
        label: "arclight_video",
        type: "video",
        route: "videos",
        target: "howToUseArclightVideoPage",
      },
    ],
    sections: [],
  },
  {
    id: "front",
    label: "front",
    lessons: [
      {
        id: "paediatricFrontObjectivesPage",
        label: "objectives",
        type: "scroll",
        route: "paediatricSurgicalEyeEarWorkshop",
        target: "paediatricFrontObjectivesPage",
      },
    ],
    sections: [
      {
        id: "front-how",
        label: "how",
        lessons: [
          {
            id: "paediatricFrontScroll",
            label: "front",
            type: "scroll",
            route: "videos",
            target: "frontOfEyeExaminationScrollPage",
          },
          {
            id: "paediatricFrontAnimation",
            label: "front_animation",
            type: "video",
            route: "videos",
            target: "frontOfEyeFullAnimationVideoPage",
          },
          {
            id: "paediatricFrontPdf",
            label: "front_pdf",
            type: "pdf",
            route: "frontOfEyePdf",
            target: "frontOfEyePdfPage",
          },
          {
            id: "paediatricFrontVideo",
            label: "front",
            type: "video",
            route: "videos",
            target: "feFullAnteriorSegmentPage",
          },
        ],
      },
      {
        id: "front-train",
        label: "train_test",
        lessons: [
          {
            id: "paediatricFrontCases",
            label: "anterior_cases",
            type: "interactive",
            route: "medicalStudentsWorkshop",
            target: "medicalAnteriorSegmentPage",
          },
          {
            id: "paediatricIntermediateCases",
            label: "intermediate_cases",
            type: "interactive",
            route: "casestudy",
            target: "caseStudyChatPage",
            caseStudy: "intermediate",
          },
        ],
      },
    ],
  },
  {
    id: "fundal",
    label: "fundal",
    lessons: [
      {
        id: "paediatricFundalObjectivesPage",
        label: "objectives",
        type: "scroll",
        route: "paediatricSurgicalEyeEarWorkshop",
        target: "paediatricFundalObjectivesPage",
      },
    ],
    sections: [
      {
        id: "fundal-how",
        label: "how",
        lessons: [
          {
            id: "paediatricFundalScroll",
            label: "fundal",
            type: "scroll",
            route: "videos",
            target: "fundalReflexExaminationScrollPage",
          },
          {
            id: "paediatricFundalAnimation",
            label: "fundal_animation",
            type: "video",
            route: "videos",
            target: "fundalReflexFullAnimationVideoPage",
          },
          {
            id: "paediatricFundalPdf",
            label: "fundal_pdf",
            type: "pdf",
            route: "fundalReflexPdf",
            target: "fundalReflexPdfPage",
          },
          {
            id: "paediatricFundalVideo",
            label: "fundal",
            type: "video",
            route: "videos",
            target: "fundalExamPage",
          },
        ],
      },
      {
        id: "fundal-train",
        label: "train_test",
        lessons: [
          {
            id: "paediatricFundalTest",
            label: "fundal_test",
            type: "quiz",
            route: "fundalReflexQuiz",
            target: "fundalReflexQuizPage",
          },
        ],
      },
    ],
  },
  {
    id: "direct",
    label: "direct",
    lessons: [
      {
        id: "paediatricDirectObjectivesPage",
        label: "objectives",
        type: "scroll",
        route: "paediatricSurgicalEyeEarWorkshop",
        target: "paediatricDirectObjectivesPage",
      },
    ],
    sections: [
      {
        id: "direct-how",
        label: "how",
        lessons: [
          {
            id: "paediatricDirectScroll",
            label: "direct",
            type: "scroll",
            route: "videos",
            target: "directOphthalmoscopyScrollPage",
          },
          {
            id: "paediatricDirectAnimation",
            label: "direct_animation",
            type: "video",
            route: "videos",
            target: "directOphthalmoscopyFullAnimationVideoPage",
          },
          {
            id: "paediatricDirectPdf",
            label: "direct_pdf",
            type: "pdf",
            route: "directOphthalmoscopyPdf",
            target: "directOphthalmoscopyPdfPage",
          },
          {
            id: "paediatricDirectVideo",
            label: "direct",
            type: "video",
            route: "videos",
            target: "directOphthalmoscopyVideoPage",
          },
        ],
      },
      {
        id: "direct-train",
        label: "train_test",
        lessons: [
          {
            id: "paediatricDirectTest",
            label: "direct_test",
            type: "quiz",
            route: "videos",
            target: "diabeticCaseQuizPage",
          },
        ],
      },
    ],
  },
  {
    id: "otoscopy",
    label: "otoscopy",
    lessons: [
      {
        id: "paediatricOtoscopyObjectivesPage",
        label: "objectives",
        type: "scroll",
        route: "paediatricSurgicalEyeEarWorkshop",
        target: "paediatricOtoscopyObjectivesPage",
      },
    ],
    sections: [
      {
        id: "otoscopy-how",
        label: "how",
        lessons: [
          {
            id: "paediatricEarHearing",
            label: "ear_hearing",
            type: "scroll",
            route: "primaryEarCareWorkshop",
            target: "primaryEarCareLessonPage",
            earLesson: "hearing",
          },
          {
            id: "paediatricEarExamination",
            label: "ear_examination",
            type: "scroll",
            route: "primaryEarCareWorkshop",
            target: "primaryEarCareLessonPage",
            earLesson: "examination",
          },
          {
            id: "paediatricOtoscopyAnimation",
            label: "otoscopy_animation",
            type: "video",
            unavailable: true,
          },
          {
            id: "paediatricOtoscopyPdf",
            label: "otoscopy_pdf",
            type: "pdf",
            route: "primaryEarCareWorkshop",
            target: "primaryEarCareLessonPage",
            earLesson: "otoscopyGuide",
          },
          {
            id: "paediatricOtoscopyVideo",
            label: "otoscopy",
            type: "video",
            route: "primaryEarCareWorkshop",
            target: "primaryEarCareLessonPage",
            earLesson: "otoscopyVideo",
          },
        ],
      },
      {
        id: "otoscopy-train",
        label: "train_test",
        lessons: [
          {
            id: "paediatricTympanicMembranesPage",
            label: "membranes",
            type: "scroll",
            route: "paediatricSurgicalEyeEarWorkshop",
            target: "paediatricTympanicMembranesPage",
          },
          {
            id: "paediatricEarImagePracticePage",
            label: "image_practice",
            type: "quiz",
            route: "paediatricSurgicalEyeEarWorkshop",
            target: "paediatricEarImagePracticePage",
          },
          {
            id: "paediatricOtoscopyPractice",
            label: "ear_practice",
            type: "scroll",
            route: "primaryEarCareWorkshop",
            target: "primaryEarCareLessonPage",
            earLesson: "otoscopyPractice",
          },
        ],
      },
    ],
  },
];

export const PAEDIATRIC_LOCAL_PAGES = {
  paediatricOverviewPage: {
    title: "overview",
    panels: [
      ["children", "children_copy"],
      ["structure", "structure_intro"],
      ["formats", "formats_copy"],
    ],
    structure: true,
  },
  paediatricFrontObjectivesPage: {
    title: "front",
    panels: [
      ["common_red", "common_red_copy"],
      ["serious_red", "serious_red_copy"],
      ["injury", "injury_copy"],
    ],
  },
  paediatricFundalObjectivesPage: {
    title: "fundal",
    panels: [
      ["all_children", "all_children_copy"],
      ["exclude", "exclude_copy"],
      ["timing", "timing_copy"],
    ],
  },
  paediatricDirectObjectivesPage: {
    title: "direct",
    panels: [
      ["neurological", "neurological_copy"],
      ["healthy_disc", "healthy_disc_copy"],
      ["abnormal_disc", "abnormal_disc_copy"],
    ],
  },
  paediatricOtoscopyObjectivesPage: {
    title: "otoscopy",
    panels: [
      ["ear_symptoms", "ear_symptoms_copy"],
      ["safe_otoscopy", "safe_otoscopy_copy"],
      ["recognise_ear", "recognise_ear_copy"],
    ],
  },
  paediatricTympanicMembranesPage: {
    title: "membranes",
    panels: [["compare", "compare_copy"]],
    gallery: true,
  },
  paediatricEarImagePracticePage: {
    title: "image_practice",
    quiz: true,
  },
};

export const PAEDIATRIC_EAR_IMAGES = [
  {
    id: "normal",
    label: "normal",
    src: "/images/learning/PaediatricSurgicalEyeEar/normal.webp",
  },
  {
    id: "hole",
    label: "hole",
    src: "/images/learning/PaediatricSurgicalEyeEar/hole.webp",
  },
  {
    id: "csom",
    label: "csom",
    src: "/images/learning/PaediatricSurgicalEyeEar/csom.webp",
  },
  {
    id: "csom-hole",
    label: "csom_hole",
    src: "/images/learning/PaediatricSurgicalEyeEar/csom-hole.webp",
  },
  {
    id: "ome",
    label: "ome",
    src: "/images/learning/PaediatricSurgicalEyeEar/ome.webp",
  },
];

export const PAEDIATRIC_OBJECTIVE_ILLUSTRATIONS = {
  common_red: [
    {
      src: "/images/casestudy/case3_eyes.webp",
      caption: "infective_image",
    },
  ],
  serious_red: [
    {
      src: "/images/casestudy/case5_eyes.webp",
      caption: "ulcer_image",
    },
  ],
  injury: [
    {
      src: "/images/casestudy/case12_eyes.webp",
      caption: "injury_image",
    },
  ],
  all_children: [
    {
      src: "/images/quiz/fundal-reflex/case-2.webp",
      caption: "healthy_reflex_image",
    },
  ],
  exclude: [
    {
      src: "/images/learning/MedicalStudents/Introduction/diagnosis-cataract.png",
      caption: "cataract_image",
    },
    {
      src: "/images/learning/MedicalStudents/Introduction/diagnosis-retinoblastoma.png",
      caption: "retinoblastoma_image",
    },
  ],
  neurological: [
    {
      src: "/images/learning/MedicalStudents/Introduction/visual-pathway.jpg",
      caption: "pathway_image",
    },
  ],
  healthy_disc: [
    {
      src: "/subapp/Discs/assets/images/discs/case-01.webp",
      caption: "normal_disc_image",
    },
  ],
  abnormal_disc: [
    {
      src: "/subapp/Discs/assets/images/discs/case-02.webp",
      caption: "swollen_disc_image",
    },
    {
      src: "/subapp/Discs/assets/images/discs/case-03.webp",
      caption: "pale_disc_image",
    },
  ],
  ear_symptoms: [
    {
      src: "/images/learning/PrimaryEarCare/image121.png",
      caption: "ear_hearing",
    },
  ],
  safe_otoscopy: [
    {
      src: "/images/learning/PrimaryEarCare/image119.png",
      caption: "ear_examination",
    },
  ],
  recognise_ear: [
    {
      src: "/images/learning/PaediatricSurgicalEyeEar/normal.webp",
      caption: "normal",
    },
    {
      src: "/images/learning/PaediatricSurgicalEyeEar/ome.webp",
      caption: "ome",
    },
  ],
};

export const PAEDIATRIC_LESSONS = PAEDIATRIC_FOLDERS.flatMap((folder) => [
  ...folder.lessons.map((entry) => ({
    ...entry,
    folder: folder.id,
    nested: null,
  })),
  ...folder.sections.flatMap((section) =>
    section.lessons.map((entry) => ({
      ...entry,
      folder: folder.id,
      nested: section.lessons.length === 1 ? null : section.id,
    })),
  ),
]);
