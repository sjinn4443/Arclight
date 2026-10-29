// Caption groups may appear together while spoken cues retain their own clock.
const fs = require("node:fs");
const path = require("node:path");
const stamp = (seconds) =>
  new Date(Math.round(seconds * 1000)).toISOString().slice(11, 23);
function writeCaptions(script, folder) {
  for (const language of Object.keys(script.languages)) {
    const cues = script.cues.flatMap((cue) => {
      const text = cue.caption?.[language] ?? cue[language];
      if (!text) return [];
      const last = script.cues.find((c) => c.id === cue.captionUntil);
      return [
        { id: cue.id, start: cue.start, end: last?.end ?? cue.end, text },
      ];
    });
    cues.push(
      ...(script.videoTitleCues || [])
        .filter((c) => c.translations?.[language] && Number.isFinite(c.start))
        .map((c) => ({ ...c, text: c.translations[language] })),
    );
    cues.sort((a, b) => a.start - b.start);
    fs.writeFileSync(
      path.join(folder, language + ".vtt"),
      "WEBVTT\n\n" +
        cues
          .map(
            (c) =>
              `${c.id}\n${stamp(c.start)} --> ${stamp(c.end)}\n${c.text}\n`,
          )
          .join("\n"),
    );
  }
}
module.exports = { writeCaptions };
if (require.main === module) {
  const root = path.resolve(__dirname, "../..");
  const sourceFolder = path.join(
    root,
    "public/narration/pupils-pec/full-animation",
  );
  const source = JSON.parse(
    fs.readFileSync(path.join(sourceFolder, "script.json")),
  );
  for (const relative of [
    "public/narration/pupils-pec/full-animation",
    "public/narration/pupils-pec/full-animation/video",
    "public/narration/pupils-advanced/full-animation",
  ]) {
    const folder = path.join(root, relative),
      file = path.join(folder, "script.json");
    if (!fs.existsSync(file)) continue; // Optional local lesson may be absent.
    const script = JSON.parse(fs.readFileSync(file));
    for (const cue of script.cues) {
      const original = source.cues.find((c) => c.id === cue.id);
      if (original?.caption) {
        cue.caption = original.caption;
        if (original.captionUntil) cue.captionUntil = original.captionUntil;
      }
    }
    const updated = JSON.stringify(script, null, 2) + "\n";
    if (fs.readFileSync(file, "utf8") !== updated)
      fs.writeFileSync(file, updated);
    writeCaptions(script, folder);
  }
}
