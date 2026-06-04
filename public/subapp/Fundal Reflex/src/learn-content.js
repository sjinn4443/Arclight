export const HANDOUT_ASSETS = {
  pdf: {
    filename: "fundal-reflex-universal-handout.pdf",
    title: "Fundal reflex handout PDF",
    type: "application/pdf",
    url: "assets/handouts/fundal-reflex-universal-handout.pdf",
  },
  image: {
    filename: "fundal-reflex-universal-handout.webp",
    title: "Fundal reflex handout image",
    type: "image/webp",
    url: "assets/handouts/fundal-reflex-universal-handout.webp",
  },
};

export const LEARN_PANELS = [
  {
    id: "preparation",
    image: "assets/handouts/panels/preparation.webp?v=20260501-1",
    title: "Get a good view",
    text: "Dim light. Calm or swaddle. Start at arm's length, then move side to side and closer.",
  },
  {
    id: "looking-away",
    image: "assets/handouts/panels/looking-away.webp?v=20260501-1",
    title: "Looking away",
    text: "If the child is not looking, adjust and repeat before judging.",
    caseLinks: [{ label: "Try case 3", value: "technique-child-looking-away" }],
  },
  {
    id: "eyelids",
    image: "assets/handouts/panels/eyelids.webp?v=20260501-1",
    title: "Lids blocking",
    text: "If the pupil is partly covered, open gently and repeat.",
    caseLinks: [{ label: "Try case 4", value: "technique-upper-lid-blocking" }],
  },
  {
    id: "normal-variation",
    image: "assets/handouts/panels/normal-variation.webp?v=20260501-1",
    title: "Normal can vary",
    text: "In those with darker pigmentation, a normal reflex may look orange-yellow or blue-white. Bright, equal and round is reassuring.",
    caseLinks: [
      { label: "Case 1", value: "zero" },
      { label: "Case 2", value: "bilateral-blue-normal" },
    ],
  },
  {
    id: "unclear-repeat",
    image: "assets/handouts/panels/unclear-repeat.webp?v=20260501-1",
    title: "Unclear is active",
    text: "Do not guess. Improve the view, repeat or ask for help.",
  },
  {
    id: "ask-help",
    image: "assets/handouts/panels/ask-help.webp?v=20260501-1",
    title: "Ask for help",
    text: "A photo or another trained person can help decide repeat or refer.",
  },
  {
    id: "possible-findings",
    image: "assets/handouts/panels/possible-findings.webp?v=20260501-1",
    title: "Refer when abnormal",
    text: "White, dull, absent, black or very unequal reflexes may mean scar, cataract or haemorrhage.",
    caseLinks: [
      { label: "Try case 7", value: "right-retinoblastoma-left-normal" },
      { label: "Try case 5", value: "right-normal-left-large-esotropia" },
      { label: "Try case 8", value: "normal-dark" },
    ],
  },
];
