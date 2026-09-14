const fs = require("node:fs");
const path = require("node:path");
const read = (p) => JSON.parse(fs.readFileSync(p, "utf8"));
const write = (p, o) => fs.writeFileSync(p, JSON.stringify(o, null, 2) + "\n");
const selectedCodes = process.argv.slice(2).length
  ? process.argv.slice(2)
  : ["ne", "fr", "lg", "ha", "yo", "ig"];
for (const file of fs
  .readdirSync("public/translation")
  .filter((f) => f.endsWith(".json"))) {
  const p = path.join("public/translation", file),
    d = read(p);
  d.languageInstall.luganda =
    file === "nepali.json"
      ? "लुगान्डा"
      : file === "french.json"
        ? "Louganda"
        : "Luganda";
  write(p, d);
}
for (const p of [
  "public/video-localization/app-video-subtitles.json",
  "public/video-localization/childhood-eye-screening.json",
]) {
  const catalog = read(p);
  for (const entry of Object.values(catalog)) {
    for (const code of selectedCodes) {
      const source = entry.subtitles?.es;
      if (source) {
        const target = source.replace(
          /\/(?:es|es-419)\.vtt$/,
          "/" + code + ".vtt",
        );
        if (fs.existsSync("public" + target)) entry.subtitles[code] = target;
      }
      if (entry.audioVariants?.["es-419"]) {
        const src = "/narration/fundal-reflex/full-animation/" + code + ".m4a";
        if (fs.existsSync("public" + src))
          entry.audioVariants[code] = {
            label: {
              ne: "नेपाली",
              fr: "Français",
              lg: "Luganda",
              ha: "Hausa",
              yo: "Yorùbá",
              ig: "Igbo",
            }[code],
            src,
          };
      }
      if (
        entry.iosHls?.subtitleLanguages &&
        entry.subtitles?.[code] &&
        !entry.iosHls.subtitleLanguages.includes(code)
      )
        entry.iosHls.subtitleLanguages.push(code);
    }
  }
  write(p, catalog);
}
