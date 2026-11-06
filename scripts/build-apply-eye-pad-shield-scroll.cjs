// Native Lottie artwork: shared procedure textures plus proportionate vector actors.
const fs = require("node:fs/promises");
const path = require("node:path");
const { pathToFileURL } = require("node:url");
const sharp = require("sharp");
const ROOT = path.resolve(__dirname, "..");
const OUT = path.join(
  ROOT,
  "public/scrolly/eyeprocedures/apply-eye-pad-shield",
);
const W = 1169,
  H = 1280;
const c = (k) => ({ a: 0, k });
const keys = (values) => ({
  a: 1,
  k: values.map(([t, s], i) => ({
    t,
    s: Array.isArray(s) ? s : [s],
    ...(i < values.length - 1
      ? {
          e: Array.isArray(values[i + 1][1])
            ? values[i + 1][1]
            : [values[i + 1][1]],
          i: { x: [0.67], y: [1] },
          o: { x: [0.33], y: [0] },
        }
      : {}),
  })),
});
let layers, assets, op;
function layer(nm, options = {}) {
  const l = {
    ddd: 0,
    ind: layers.length + 1,
    ty: 4,
    nm,
    sr: 1,
    ks: {
      o: options.o || c(100),
      r: options.r || c(0),
      p: options.p || c([0, 0, 0]),
      a: c([0, 0, 0]),
      s: c([100, 100, 100]),
    },
    ao: 0,
    ip: 0,
    op,
    st: 0,
    bm: 0,
    shapes: [],
  };
  layers.unshift(l);
  return l;
}
const color = (hex) =>
  hex
    .match(/\w\w/g)
    .map((v) => parseInt(v, 16) / 255)
    .concat(1);
function shape(nm, geometry, fill, options = {}) {
  const l = layer(nm, options);
  l.shapes = [
    {
      ty: "gr",
      it: [
        geometry,
        ...(fill ? [{ ty: "fl", c: c(color(fill)), o: c(100), r: 1 }] : []),
        ...(options.stroke
          ? [
              {
                ty: "st",
                c: c(color(options.stroke)),
                o: c(100),
                w: c(options.width || 5),
                lc: 2,
                lj: 2,
              },
            ]
          : []),
        {
          ty: "tr",
          p: c([0, 0]),
          a: c([0, 0]),
          s: c([100, 100]),
          r: c(0),
          o: c(100),
          sk: c(0),
          sa: c(0),
        },
      ],
    },
  ];
  return l;
}
const ellipse = (nm, x, y, w, h, fill, o = {}) =>
  shape(nm, { ty: "el", p: c([x, y]), s: c([w, h]), d: 1 }, fill, o);
const rect = (nm, x, y, w, h, r, fill, o = {}) =>
  shape(nm, { ty: "rc", p: c([x, y]), s: c([w, h]), r: c(r), d: 1 }, fill, o);
const line = (nm, points, fill, o = {}) =>
  shape(
    nm,
    {
      ty: "sh",
      ks: c({
        v: points,
        i: points.map(() => [0, 0]),
        o: points.map(() => [0, 0]),
        c: !!fill,
      }),
    },
    fill,
    o,
  );
async function texture(nm, file, x, y, w, options = {}) {
  const meta = await sharp(path.join(ROOT, "public", file)).metadata();
  const id = "image-" + assets.length;
  assets.push({
    id,
    w: meta.width,
    h: meta.height,
    u:
      path.posix.relative(
        "scrolly/eyeprocedures/apply-eye-pad-shield/1",
        path.posix.dirname(file.replaceAll("\\", "/")),
      ) + "/",
    p: path.basename(file),
    e: 0,
  });
  const l = layer(nm, options),
    scale = w / meta.width;
  l.ty = 2;
  delete l.shapes;
  l.refId = id;
  l.ks.a = c([meta.width / 2, meta.height / 2, 0]);
  l.ks.s = c([scale * 100, scale * 100, 100]);
  l.ks.p = options.p || c([x, y, 0]);
  return l;
}
const fadeIn = (frame = 20) =>
  keys([
    [0, 0],
    [frame, 0],
    [frame + 22, 100],
  ]);
function face(closed = true, animateClose = false) {
  rect("Shoulders", 585, 1270, 850, 420, 170, "526c72");
  rect("Neck", 585, 1000, 210, 300, 70, "a96742");
  ellipse("Left ear", 295, 690, 95, 190, "bd8056");
  ellipse("Right ear", 875, 690, 95, 190, "bd8056");
  ellipse("Face", 585, 665, 560, 760, "c58b61");
  line(
    "Hair",
    [
      [310, 555],
      [300, 365],
      [362, 275],
      [510, 226],
      [700, 245],
      [817, 325],
      [867, 445],
      [857, 560],
      [797, 403],
      [700, 368],
      [578, 395],
      [465, 361],
      [370, 431],
    ],
    "30231c",
  );
  for (const x of [455, 710]) {
    const eyeClosed = closed && x === 455;
    line(
      "Eyebrow",
      [
        [x - 72, 546],
        [x - 25, 530],
        [x + 37, 533],
        [x + 67, 547],
      ],
      null,
      { stroke: "473022", width: 13 },
    );
    if (!eyeClosed || animateClose) {
      const o =
        animateClose && eyeClosed
          ? keys([
              [0, 100],
              [65, 100],
              [92, 0],
            ])
          : c(100);
      ellipse("Open sclera", x, 610, 143, 68, "f4eadf", { o });
      ellipse("Iris", x, 611, 48, 55, "665137", { o });
      ellipse("Pupil", x, 611, 22, 30, "201c18", { o });
    }
    if (eyeClosed)
      line(
        "Closed eyelid",
        [
          [x - 72, 609],
          [x - 34, 624],
          [x + 15, 627],
          [x + 68, 611],
        ],
        null,
        {
          stroke: "71472f",
          width: 7,
          o: animateClose
            ? keys([
                [0, 0],
                [65, 0],
                [92, 100],
              ])
            : c(100),
        },
      );
  }
  line(
    "Nose",
    [
      [583, 607],
      [558, 754],
      [586, 770],
      [616, 754],
    ],
    null,
    { stroke: "a36c48", width: 6 },
  );
  line(
    "Mouth",
    [
      [492, 863],
      [550, 876],
      [610, 875],
      [660, 858],
    ],
    null,
    { stroke: "784d38", width: 8 },
  );
  line(
    "Lower lip",
    [
      [540, 898],
      [580, 905],
      [616, 896],
    ],
    null,
    { stroke: "b07854", width: 5 },
  );
}
function pad(x = 451, y = 657, w = 230, options = {}) {
  ellipse("Pad soft shadow", x + 8, y + 12, w + 8, w * 1.32, "a97653", options);
  ellipse("Oval gauze eye pad", x, y, w, w * 1.32, "f9f6ed", {
    ...options,
    stroke: "dedbd0",
    width: 4,
  });
  // Each weave line is clipped geometrically to the ellipse, avoiding canvas masks.
  for (let n = -4; n <= 4; n++) {
    const dx = (n * w) / 12,
      hh = w * 0.62 * Math.sqrt(1 - (dx / (w * 0.48)) ** 2);
    line(
      "Gauze weave",
      [
        [x + dx, y - hh],
        [x + dx, y + hh],
      ],
      null,
      { ...options, stroke: "e1e8e4", width: 2 },
    );
  }
}
function tape(x, y, angle = 32, options = {}) {
  const l = rect("Adhesive tape", 0, 0, 48, 540, 8, "eee8d5", {
    ...options,
    p: options.p || c([x, y, 0]),
    r: c(angle),
  });
  return l;
}
function shield(options = {}) {
  ellipse("Shield cast shadow", 462, 669, 303, 370, "a66e4c", options);
  line(
    "Shield cone",
    [
      [312, 530],
      [431, 466],
      [573, 535],
      [595, 729],
      [467, 833],
      [316, 733],
    ],
    "f1eee4",
    { ...options, stroke: "c8c2b2", width: 4 },
  );
  line(
    "Shield light face",
    [
      [431, 466],
      [467, 833],
      [316, 733],
      [312, 530],
    ],
    "fffdf5",
    options,
  );
  line(
    "Shield fold",
    [
      [431, 466],
      [467, 833],
    ],
    null,
    { ...options, stroke: "d4cebf", width: 4 },
  );
}
async function main() {
  const {
    APPLY_EYE_PAD_SHIELD_STAGES: stages,
    APPLY_EYE_PAD_SHIELD_CLIPS: clips,
  } = await import(
    pathToFileURL(path.join(ROOT, "public/js/applyEyePadShieldScroll.js"))
  );
  for (let i = 0; i < stages.length; i++) {
    layers = [];
    assets = [];
    op = stages[i].seconds * 30;
    rect("Warm procedure background", W / 2, H / 2, W, H, 0, "a8a292");
    if (i === 0) {
      rect("Equipment tray shadow", 585, 680, 970, 810, 75, "918b7d");
      rect("Equipment tray", 585, 650, 970, 810, 75, "d1cec2");
      pad(350, 450, 245);
      await texture(
        "Original finished shield",
        "scrolly/eyeprocedures/make-eye-pad-shield/images/12cone.webp",
        800,
        460,
        330,
        { o: fadeIn(20) },
      );
      ellipse("Tape roll", 350, 865, 190, 190, "f6f0e0", { o: fadeIn(50) });
      ellipse("Tape roll centre", 350, 865, 90, 90, "aaa698", {
        o: fadeIn(50),
      });
      line(
        "Scissor blade",
        [
          [710, 885],
          [895, 720],
        ],
        null,
        { stroke: "c1c7c7", width: 23, o: fadeIn(75) },
      );
      line(
        "Scissor blade",
        [
          [747, 920],
          [854, 704],
        ],
        null,
        { stroke: "e1e5e3", width: 23, o: fadeIn(75) },
      );
      ellipse("Scissor handle", 680, 916, 95, 72, null, {
        stroke: "363e37",
        width: 18,
        o: fadeIn(75),
      });
      ellipse("Scissor handle", 725, 968, 95, 72, null, {
        stroke: "363e37",
        width: 18,
        o: fadeIn(75),
      });
    } else if (i === 1) {
      face(false);
      rect("Explanation bubble", 800, 250, 490, 150, 45, "f4f1e6", {
        o: fadeIn(),
      });
      for (let y = 220; y <= 275; y += 27)
        line(
          "Explanation",
          [
            [635, y],
            [953, y],
          ],
          null,
          { stroke: "aaa798", width: 9, o: fadeIn() },
        );
    } else if (i === 2) {
      face(true);
      const motion = keys([
        [0, [160, 400, 0]],
        [60, [435, 520, 0]],
        [120, [345, 670, 0]],
        [170, [420, 790, 0]],
        [230, [200, 900, 0]],
        [270, [-300, 950, 0]],
      ]);
      await texture(
        "Cotton swab",
        "scrolly/eyeprocedures/make-eye-pad-shield/images/02cotton.webp",
        0,
        0,
        105,
        { p: motion },
      );
      await texture(
        "Cleaning hand",
        "scrolly/eyeprocedures/make-eye-pad-shield/images/02righthand.webp",
        0,
        0,
        480,
        {
          p: keys([
            [0, [-60, 420, 0]],
            [60, [205, 540, 0]],
            [120, [115, 690, 0]],
            [170, [190, 810, 0]],
            [230, [-30, 920, 0]],
            [270, [-530, 970, 0]],
          ]),
        },
      );
    } else if (i === 3) {
      rect("Preparation surface", 585, 660, 1000, 810, 60, "d1cec2");
      for (let n = 0; n < 3; n++)
        tape(310 + n * 270, 640, 0, { o: fadeIn(30 + n * 65) });
      line(
        "Measured cut",
        [
          [180, 960],
          [990, 960],
        ],
        null,
        { stroke: "6d7663", width: 4, o: fadeIn(10) },
      );
      for (let n = 0; n < 3; n++)
        line(
          "Tape cut edge",
          [
            [277 + n * 270, 910],
            [343 + n * 270, 910],
          ],
          null,
          { stroke: "a8a292", width: 7, o: fadeIn(85 + n * 65) },
        );
    } else if (i === 4) {
      rect("Preparation surface", 585, 660, 1000, 810, 60, "d1cec2");
      for (let n = 0; n < 3; n++)
        tape(455 + n * 105, 645, 0, { o: fadeIn(50 + n * 45) });
      await texture(
        "Original gauze texture",
        "scrolly/eyeprocedures/make-eye-pad-shield/images/03and04foldedgauze.webp",
        585,
        640,
        470,
      );
      await texture(
        "Holding hand",
        "scrolly/eyeprocedures/make-eye-pad-shield/images/holdinghand_top.webp",
        305,
        730,
        390,
        { o: fadeIn(15) },
      );
    } else {
      face(true, i === 5);
      if (i === 5) {
        pad(451, 657, 230, {
          p: keys([
            [0, [-580, 0, 0]],
            [110, [-580, 0, 0]],
            [210, [0, 0, 0]],
          ]),
        });
      } else {
        pad();
        for (let n = 0; n < 3; n++)
          tape(393 + n * 53, 654, 32, {
            o: i === 6 ? fadeIn(40 + n * 65) : c(100),
          });
        if (i === 7) {
          shield({
            p: keys([
              [0, [-700, -200, 0]],
              [75, [-700, -200, 0]],
              [180, [0, 0, 0]],
            ]),
          });
          tape(451, 650, 32, { o: fadeIn(220) });
        }
      }
    }
    const dir = path.join(OUT, String(i + 1));
    await fs.mkdir(dir, { recursive: true });
    await fs.writeFile(
      path.join(dir, "data.json"),
      JSON.stringify({
        v: "5.13.0",
        fr: 30,
        ip: 0,
        op,
        w: W,
        h: H,
        nm: stages[i].name,
        ddd: 0,
        assets,
        layers,
        markers: [],
      }),
    );
  }
  const dir = path.join(
    ROOT,
    "public/narration/apply-eye-pad-shield/full-animation",
  );
  await fs.mkdir(dir, { recursive: true });
  const script = {
    schemaVersion: 1,
    title: "Apply an Eye Pad and Eye Shield",
    sourceVideo: "/videos/Workshop/PEC/8.Applypadandshield_720p.mp4",
    durationSeconds: clips.at(-1).end,
    defaultLanguage: "en",
    languages: {
      en: {
        label: "English",
        locale: "en-US",
        voice: "Microsoft Zira Desktop",
      },
      ko: {
        label: "한국어",
        locale: "ko-KR",
        voice: "Microsoft Heami Desktop",
      },
    },
    cues: stages.map((s, i) => ({
      id: clips[i].cueIds[0],
      start: clips[i].start,
      end: clips[i].end,
      en: s.en,
      ko: s.ko,
    })),
    videoTitleCues: [
      { sourceText: "Preparation", translations: { ko: "준비" } },
      {
        sourceText: "Apply the eye pad",
        translations: { ko: "안대 패드 부착" },
      },
      {
        sourceText: "Apply the eye shield",
        translations: { ko: "눈 보호대 부착" },
      },
    ],
  };
  script.timedCues = Object.fromEntries(
    ["en", "ko"].map((language) => [
      language,
      script.cues.map((cue) => ({
        id: cue.id,
        start: cue.start,
        end: cue.end,
        text: cue[language],
      })),
    ]),
  );
  await fs.writeFile(
    path.join(dir, "script.json"),
    JSON.stringify(script, null, 2) + "\n",
  );
  console.log(
    "Built eight Apply Eye Pad / Shield scenes and narration script.",
  );
}
main().catch((e) => {
  console.error(e);
  process.exitCode = 1;
});
