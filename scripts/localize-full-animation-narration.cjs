// Maintained translations of the existing English scenes; native clinical review pending.
const fs = require("node:fs");
const path = require("node:path");
const translations = require("./full-animation-translations.json");
const {
  applyVideoTitleCaptions,
} = require("./full-animation-title-captions.cjs");
const root = path.resolve(__dirname, "..");
const read = (file) =>
  JSON.parse(fs.readFileSync(path.join(root, file), "utf8"));
const write = (file, value) =>
  fs.writeFileSync(
    path.join(root, file),
    JSON.stringify(value, null, 2) + "\n",
  );
const voices = read(
  "public/narration/fundal-reflex/full-animation/script.json",
).languages;
const pages = {
  "front-of-eye": "frontOfEyeFullAnimationVideoPage",
  "binocular-indirect-ophthalmoscopy":
    "binocularIndirectOphthalmoscopyFullAnimationVideoPage",
};
const catalogPath = "public/video-localization/childhood-eye-screening.json";
const catalog = read(catalogPath);
for (const [lesson, pageId] of Object.entries(pages)) {
  const base = `/narration/${lesson}/full-animation/`;
  const scriptPath = `public${base}script.json`;
  const script = read(scriptPath);
  for (const language of Object.keys(voices).filter((code) => code !== "en")) {
    const lines = translations[lesson][language];
    if (
      lines?.length !== script.cues.length ||
      lines.some((line) => !line.trim())
    ) {
      throw new Error(`${lesson}/${language}: missing translated cues`);
    }
    script.languages[language] = voices[language];
    script.cues.forEach((cue, index) => {
      cue[language] = lines[index];
    });
  }
  applyVideoTitleCaptions(script, lesson);
  write(scriptPath, script);
  if (process.argv.includes("--connect")) {
    const entry = catalog[pageId];
    for (const language of Object.keys(script.languages)) {
      for (const ext of ["m4a", "vtt"]) {
        if (
          !fs.existsSync(path.join(root, `public${base}${language}.${ext}`))
        ) {
          throw new Error(
            `Generate ${lesson}/${language}.${ext} before connecting.`,
          );
        }
      }
      entry.subtitles[language === "es-419" ? "es" : language] =
        `${base}${language}.vtt`;
      entry.audioVariants[language] = {
        label: script.languages[language].label,
        src: `${base}${language}.m4a`,
      };
    }
    entry.iosHls.subtitleLanguages = Object.keys(entry.subtitles);
  }
  console.log(
    `${lesson}: ${script.cues.length} cues in ${Object.keys(script.languages).length} languages`,
  );
}
if (process.argv.includes("--connect")) write(catalogPath, catalog);
