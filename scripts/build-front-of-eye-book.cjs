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
    const prepared = path.join(temporary, "squared-panels.pdf");
    execFileSync(
      process.env.BOOK_PYTHON || "python",
      [path.join(__dirname, "prepare-front-of-eye-book.py"), source, prepared],
      { windowsHide: true, stdio: "inherit" },
    );
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
        prepared,
        rendered,
      ],
      { windowsHide: true },
    );
    const image = `${rendered}.png`;
    const metadata = await sharp(image).metadata();
    const scaleX = metadata.width / 1241;
    const scaleY = metadata.height / 1754;
    const eversionBounds = [
      [368.122, 108.793, 461.506, 173.586],
      [461.506, 108.793, 554.889, 173.586],
      [368.122, 44, 461.154, 108.528],
      [461.506, 44, 554.889, 108.793],
    ];
    // Sequential extraction keeps memory bounded for the large PDF render.
    for (const [name, left, top, width, height] of crops) {
      let crop = {
        left: Math.round(left * scaleX),
        top: Math.round(top * scaleY),
        width: Math.round(width * scaleX),
        height: Math.round(height * scaleY),
      };
      if (name.startsWith("eversion-")) {
        const [x0, y0, x1, y1] = eversionBounds[Number(name.split("-")[1]) - 1];
        const x = Math.ceil((x0 / 595.276) * metadata.width);
        const y = Math.ceil(((841.89 - y1) / 841.89) * metadata.height);
        crop = {
          left: x,
          top: y,
          width: Math.floor((x1 / 595.276) * metadata.width) - x,
          height: Math.floor(((841.89 - y0) / 841.89) * metadata.height) - y,
        };
      }
      let pixels = await sharp(image, { limitInputPixels: false })
        .extract(crop)
        .toBuffer();
      if (name.startsWith("clinical-")) pixels = await trimPhotoMatte(pixels);
      const asset = sharp(pixels);
      // The PDF also paints thin white grid dividers over the panel edges.
      if (name.startsWith("eversion-"))
        asset.trim({ background: "#fff", threshold: 8 });
      await asset
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

// Remove only near-solid black edge strips left by the PDF's contact sheet.
async function trimPhotoMatte(image) {
  const { data, info } = await sharp(image)
    .removeAlpha()
    .raw()
    .toBuffer({ resolveWithObject: true });
  const dark = (x, y) => {
    const offset = (y * info.width + x) * info.channels;
    return Math.max(data[offset], data[offset + 1], data[offset + 2]) < 30;
  };
  const row = (y) => {
    let n = 0;
    for (let x = 0; x < info.width; x++) n += dark(x, y);
    return n / info.width;
  };
  const col = (x) => {
    let n = 0;
    for (let y = 0; y < info.height; y++) n += dark(x, y);
    return n / info.height;
  };
  let left = 0,
    top = 0,
    right = info.width - 1,
    bottom = info.height - 1;
  while (top < info.height / 8 && row(top) > 0.9) top++;
  while (bottom > (info.height * 7) / 8 && row(bottom) > 0.9) bottom--;
  while (left < info.width / 8 && col(left) > 0.9) left++;
  while (right > (info.width * 7) / 8 && col(right) > 0.9) right--;
  // Clear antialiasing at the matte boundary without changing the eye itself.
  left += 2;
  top += 2;
  right -= 2;
  bottom -= 2;
  return sharp(image)
    .extract({ left, top, width: right - left + 1, height: bottom - top + 1 })
    .toBuffer();
}
build().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
