const path = require("path");
const fs = require("fs");
const fsp = require("fs").promises;
const sharp = require("sharp");

async function ensureDir(p) {
  await fsp.mkdir(path.dirname(p), { recursive: true });
}

async function generateVariants(
  inputPath,
  widths,
  outPattern,
  webpOptions = { quality: 75 },
) {
  if (!fs.existsSync(inputPath)) {
    console.warn(`[skip] missing: ${inputPath}`);
    return [];
  }
  const generated = [];
  for (const w of widths) {
    const outPath = outPattern.replace("{w}", String(w));
    await ensureDir(outPath);
    await sharp(inputPath)
      .resize({ width: w, withoutEnlargement: true })
      .webp(webpOptions)
      .toFile(outPath);
    generated.push(outPath);
    console.log(
      `[ok] ${path.basename(inputPath)} → ${path.basename(outPath)} (${w}w)`,
    );
  }
  return generated;
}

(async () => {
  try {
    const root = path.join(__dirname, "..", "public", "images");

    // Dashboard category cards (display ~260px wide; generate 1x/2x)
    const dashDir = path.join(root, "icon", "dashboard");
    await generateVariants(
      path.join(dashDir, "eyes.webp"),
      [260, 520],
      path.join(dashDir, "eyes-{w}.webp"),
    );
    await generateVariants(
      path.join(dashDir, "ears.webp"),
      [260, 520],
      path.join(dashDir, "ears-{w}.webp"),
    );
    await generateVariants(
      path.join(dashDir, "skin.webp"),
      [260, 520],
      path.join(dashDir, "skin-{w}.webp"),
    );
    await generateVariants(
      path.join(dashDir, "teach.webp"),
      [260, 520],
      path.join(dashDir, "teach-{w}.webp"),
    );

    // Intro hero (sizes specify 120px on small, 220px otherwise)
    const onbDir = path.join(root, "onboarding");
    await generateVariants(
      path.join(onbDir, "onboarding.webp"),
      [120, 220],
      path.join(onbDir, "onboarding-{w}.webp"),
      { quality: 72 },
    );

    console.log("Responsive image variants generated.");
  } catch (err) {
    console.error("gen-responsive failed:", err);
    process.exit(1);
  }
})();
