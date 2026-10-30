const fs = require("node:fs");
const path = require("node:path");
const { pathToFileURL } = require("node:url");
const translations = require("./eye-pad-shield-translations.json");
const root = path.resolve(__dirname, "..");
const folder = path.join(
  root,
  "public/narration/make-eye-pad-shield/full-animation",
);
const read = (file) => JSON.parse(fs.readFileSync(file, "utf8"));
const write = (file, value) =>
  fs.writeFileSync(file, JSON.stringify(value, null, 2) + "\n");

function applyEyePadShieldTranslations(script, sections, clips) {
  const voices = read(
    path.join(root, "public/narration/front-of-eye/full-animation/script.json"),
  ).languages;
  for (const [language, translation] of Object.entries(translations)) {
    if (
      translation.cues.length !== script.cues.length ||
      translation.titles.length !== sections.length
    )
      throw new Error(`Incomplete ${language} translations`);
    script.languages[language] = voices[language];
    script.cues.forEach((cue, i) => {
      cue[language] = translation.cues[i];
    });
  }
  script.videoTitleCues = sections.map((section, i) => ({
    id: `video-title-${["preparation", "eye-pad", "eye-shield"][i]}`,
    start: i === 0 ? 0 : clips[section.startIndex].start,
    end: (i === 0 ? 0 : clips[section.startIndex].start) + 3,
    sourceText: section.title,
    translations: Object.fromEntries(
      Object.entries(translations).map(([language, value]) => [
        language,
        value.titles[i],
      ]),
    ),
  }));
  return script;
}

async function main() {
  const {
    EYE_PAD_SHIELD_SECTIONS: sections,
    EYE_PAD_SHIELD_SCROLL_CLIPS: clips,
    EYE_PAD_SHIELD_TITLE_SECONDS: seconds,
  } = await import(
    pathToFileURL(path.join(root, "public/js/eyePadShieldScroll.js"))
  );
  const script = applyEyePadShieldTranslations(
    read(path.join(folder, "script.json")),
    sections,
    clips,
  );
  write(path.join(folder, "script.json"), script);
  const video = structuredClone(script);
  video.sourceVideo = "/videos/FullAnim/MakeEyePadShieldFullAnim_720p.mp4";
  video.durationSeconds += sections.length * seconds;
  video.timingSource = `The ${script.durationSeconds}s scrolly with three silent ${seconds}s section cards; video is ${video.durationSeconds}s. Hand hygiene is omitted.`;
  const offsetAt = (time) =>
    seconds *
    script.videoTitleCues.filter((title) => title.start <= time).length;
  video.cues.forEach((cue) => {
    const offset = offsetAt(cue.start);
    cue.start += offset;
    cue.end += offset;
  });
  video.videoTitleCues.forEach((title, i) => {
    title.start += i * seconds;
    title.end = title.start + seconds;
  });
  fs.mkdirSync(path.join(folder, "video"), { recursive: true });
  write(path.join(folder, "video/script.json"), video);
  if (process.argv.includes("--connect")) {
    const catalogFile = path.join(
      root,
      "public/video-localization/childhood-eye-screening.json",
    );
    const catalog = read(catalogFile);
    const entry = catalog.makeEyePadShieldFullAnimationVideoPage;
    entry.subtitles = {};
    entry.audioVariants = {};
    for (const [language, voice] of Object.entries(script.languages)) {
      for (const subfolder of ["", "video/"]) {
        for (const ext of ["m4a", "vtt"])
          if (
            !fs.existsSync(path.join(folder, `${subfolder}${language}.${ext}`))
          )
            throw new Error(`Missing ${subfolder}${language}.${ext}`);
      }
      const base = "/narration/make-eye-pad-shield/full-animation/video/";
      entry.subtitles[language === "es-419" ? "es" : language] =
        `${base}${language}.vtt`;
      entry.audioVariants[language] = {
        label: voice.label,
        src: `${base}${language}.m4a`,
      };
    }
    entry.localSources.low =
      "/videos/FullAnim/MakeEyePadShieldFullAnim_240p.mp4";
    write(catalogFile, catalog);
  }
  console.log(
    `Prepared ${Object.keys(script.languages).length} languages: scrolly ${script.durationSeconds}s; video ${video.durationSeconds}s`,
  );
}
if (require.main === module)
  main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
  });
module.exports = { applyEyePadShieldTranslations };
