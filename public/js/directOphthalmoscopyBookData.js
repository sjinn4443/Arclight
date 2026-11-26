// Boxes are [left, top, right, bottom] on the 1200 × 1698 reference render.
// Each page keeps related comparisons together in the handout's reading order.
export const sections = [
  "Observation and Fundal Reflex",
  "Positioning and Flight Path",
  "How to Examine",
];

export const pages = [
  {
    section: 0,
    title: "Observation and light settings",
    panels: [
      ["observation", "Three external eye observations", [85, 231, 288, 498]],
      [
        "settings",
        "Arclight light and aperture settings with room-light and sound symbols",
        [303, 231, 522, 498],
      ],
    ],
  },
  {
    section: 0,
    title: "Observation and Fundal Reflex",
    panels: [
      [
        "viewing",
        "Viewing through the instrument and two crossed-out positions",
        [534, 231, 763, 498],
      ],
      [
        "reflex",
        "Examiner alignment, paired reflexes and four comparison examples",
        [775, 229, 1122, 498],
      ],
    ],
  },
  {
    section: 1,
    title: "Positioning",
    panels: [
      [
        "fixation",
        "Patient fixation and two illustrated lines of sight",
        [85, 596, 315, 917],
      ],
      [
        "laterality",
        "Matching eyes and instrument hands with tick and cross examples",
        [328, 595, 728, 917],
      ],
    ],
  },
  {
    section: 1,
    title: "Flight path",
    panels: [
      [
        "angle",
        "The labelled 10–15° approach above two crossed-out approaches",
        [741, 595, 1122, 917],
      ],
      [
        "alignment",
        "Following the reflex with aligned and misaligned fundus views",
        [85, 930, 603, 1253],
      ],
    ],
  },
  {
    section: 1,
    title: "Margin, Colour NRR and Cup",
    panels: [
      [
        "disc",
        "Optic disc reference beside the labelled Margin, Colour NRR and Cup comparison photographs",
        [617, 930, 1122, 1253],
      ],
    ],
  },
  {
    section: 2,
    title: "How to Examine",
    panels: [
      [
        "dilation",
        "Pupil before and after the illustrated eye drop",
        [85, 1337, 317, 1606],
      ],
      [
        "disc-view",
        "Start at the highlighted optic disc",
        [333, 1340, 534, 1603],
      ],
      [
        "upper-field",
        "Original arrows from the disc towards the upper field",
        [534, 1340, 729, 1603],
      ],
    ],
  },
  {
    section: 2,
    title: "Completing the examination",
    panels: [
      [
        "lower-field",
        "Original arrows from the disc towards the lower field",
        [729, 1340, 923, 1603],
      ],
      [
        "macula",
        "Original horizontal arrow towards the macula",
        [923, 1340, 1120, 1603],
      ],
      [
        "credits",
        "Arclight Project and YouTube QR codes from the handout",
        [798, 74, 1179, 139],
      ],
    ],
  },
];
