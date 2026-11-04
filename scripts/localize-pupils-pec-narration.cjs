const fs = require("node:fs");
const path = require("node:path");
const { pathToFileURL } = require("node:url");
const { writeCaptions } = require("./lib/pupils-caption-authoring.cjs");
const root = path.resolve(__dirname, "..");
async function main() {
  const {
    PUPILS_PEC_LANGUAGES: languages,
    PUPILS_PEC_STAGES: stages,
    PUPILS_PEC_TITLE_TRANSLATIONS: titles,
  } = await import(
    pathToFileURL(path.join(root, "public/js/pupilsPecScroll.js"))
  );
  const folder = path.join(root, "public/narration/pupils-pec/full-animation");
  const file = path.join(folder, "script.json");
  const script = JSON.parse(fs.readFileSync(file));
  script.languages = languages;
  for (const cue of script.cues) {
    const original = stages
      .flatMap((stage) => stage.cues)
      .find((c) => c.id === cue.id);
    if (!original) throw new Error(`Unknown cue ${cue.id}`);
    for (const language of Object.keys(languages)) {
      if (!original[language])
        throw new Error(`Missing ${language}: ${cue.id}`);
      cue[language] = original[language];
    }
    if (original.caption) cue.caption = original.caption;
    if (original.captionUntil) cue.captionUntil = original.captionUntil;
    if (original.ttsText) cue.ttsText = original.ttsText;
  }
  script.videoTitleCues.forEach((cue) => {
    cue.translations = titles[cue.sourceText];
  });
  fs.writeFileSync(file, JSON.stringify(script, null, 2) + "\n");
  writeCaptions(script, folder);
  if (process.argv.includes("--connect")) {
    const catalogFile = path.join(
      root,
      "public/video-localization/childhood-eye-screening.json",
    );
    const catalog = JSON.parse(fs.readFileSync(catalogFile));
    const entry = catalog.pupilsPecFullAnimationVideoPage;
    entry.subtitles = {};
    entry.audioVariants = {};
    for (const [language, voice] of Object.entries(languages)) {
      for (const relative of ["", "video/"]) {
        for (const ext of ["m4a", "vtt"]) {
          if (
            !fs.existsSync(path.join(folder, `${relative}${language}.${ext}`))
          )
            throw new Error(`Missing ${relative}${language}.${ext}`);
        }
      }
      const base = "/narration/pupils-pec/full-animation/video/";
      entry.subtitles[language === "es-419" ? "es" : language] =
        `${base}${language}.vtt`;
      entry.audioVariants[language] = {
        label: voice.label,
        src: `${base}${language}.m4a`,
      };
    }
    fs.writeFileSync(catalogFile, JSON.stringify(catalog, null, 2) + "\n");
  }
}
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
