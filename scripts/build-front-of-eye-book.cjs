// Render original PDF artwork at 8x the old PNG resolution before cropping.
// Crop coordinates stay in the original 1241 x 1754 reference coordinate space.
const sharp = require("sharp");
const fs = require("node:fs/promises");
const path = require("node:path");
const os = require("node:os");
const { execFileSync } = require("node:child_process");
const source = path.join(
  __dirname,
  "../public/images/pdf/Workshop/CoreExamination/FrontofEye.pdf",
);
const output = path.join(
  __dirname,
  "../public/images/pdf/Workshop/CoreExamination/front-of-eye-book",
);
const crops = [
  ["observation", 90, 240, 234, 328],
  ["illumination", 342, 240, 408, 328],
  ["eye-examination", 766, 239, 391, 330],
  ["outer-eye", 89, 583, 254, 330],
  ["inner-eye", 360, 583, 255, 330],
  ["chamber-1", 90, 1015, 525, 275],
  ["chamber-2", 633, 1015, 525, 275],
  ["fluorescein", 90, 1391, 195, 273],
  ["blue-light", 303, 1391, 171, 273],
  ["staining", 493, 1391, 255, 273],
  ["eversion-1", 766, 1391, 196, 137],
  ["eversion-2", 962, 1391, 196, 137],
  ["eversion-3", 766, 1528, 196, 136],
  ["eversion-4", 962, 1528, 196, 136],
];
for (let row = 0; row < 3; row++) {
  for (let col = 0; col < 4; col++) {
    const number = String(row * 4 + col + 1).padStart(2, "0");
    crops.push([
      `clinical-${number}`,
      [648, 773, 896, 1021][col],
      [614, 709, 804][row],
      117,
      80,
    ]);
  }
}

async function build() {
  await fs.mkdir(output, { recursive: true });
  const temporary = await fs.mkdtemp(
    path.join(os.tmpdir(), "front-of-eye-book-"),
  );
  try {
    const rendered = path.join(temporary, "handout");
    execFileSync(
      process.env.PDFTOPPM_PATH || "pdftoppm",
      [
        "-f",
        "1",
        "-singlefile",
        "-scale-to-x",
        "9928",
        "-scale-to-y",
        "-1",
        "-png",
        source,
        rendered,
      ],
      { windowsHide: true },
    );
    const image = `${rendered}.png`;
    const metadata = await sharp(image).metadata();
    const scaleX = metadata.width / 1241;
    const scaleY = metadata.height / 1754;
    // Sequential extraction keeps memory bounded for the large PDF render.
    for (const [name, left, top, width, height] of crops) {
      await sharp(image, { limitInputPixels: false })
        .extract({
          left: Math.round(left * scaleX),
          top: Math.round(top * scaleY),
          width: Math.round(width * scaleX),
          height: Math.round(height * scaleY),
        })
        .webp({ lossless: true })
        .toFile(path.join(output, `${name}-hd.webp`));
    }
  } finally {
    if (
      path.dirname(temporary) === path.resolve(os.tmpdir()) &&
      path.basename(temporary).startsWith("front-of-eye-book-")
    ) {
      await fs.rm(temporary, { recursive: true, force: true });
    }
  }
}
build().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
