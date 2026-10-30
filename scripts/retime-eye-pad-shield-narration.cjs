// Remove the retired 6s hygiene slot without synthesising any remaining voice.
// Rebuild video narration from the retained scrolly delivery and silent cards.
const fs = require("node:fs");
const path = require("node:path");
const crypto = require("node:crypto");
const { spawnSync } = require("node:child_process");
const root = path.resolve(__dirname, "..");
const folder = path.join(
  root,
  "public/narration/make-eye-pad-shield/full-animation",
);
const work = path.join(root, "tmp/eye-pad-hygiene-removal");
const ffmpeg =
  process.env.FFMPEG_PATH ||
  path.join(
    root,
    "tmp/fundal-narration-tools/imageio_ffmpeg/binaries/ffmpeg-win-x86_64-v7.1.exe",
  );
const read = (p) => JSON.parse(fs.readFileSync(p, "utf8"));
const write = (p, v) => fs.writeFileSync(p, JSON.stringify(v, null, 2) + "\n");
function encode(input, output, filter) {
  const result = spawnSync(
    ffmpeg,
    [
      "-hide_banner",
      "-loglevel",
      "error",
      "-y",
      "-i",
      input,
      "-filter_complex",
      filter,
      "-map",
      "[out]",
      "-c:a",
      "aac",
      "-b:a",
      "48k",
      "-ar",
      "48000",
      "-ac",
      "1",
      "-movflags",
      "+faststart",
      output,
    ],
    { encoding: "utf8" },
  );
  if (result.error || result.status) throw result.error || Error(result.stderr);
}
const stamp = (seconds) => {
  const ms = Math.round(seconds * 1000);
  return `${String(Math.floor(ms / 3600000)).padStart(2, "0")}:${String(Math.floor(ms / 60000) % 60).padStart(2, "0")}:${String(Math.floor(ms / 1000) % 60).padStart(2, "0")}.${String(ms % 1000).padStart(3, "0")}`;
};
fs.mkdirSync(work, { recursive: true });
const scroll = read(path.join(folder, "script.json"));
const video = read(path.join(folder, "video/script.json"));
const manifest = read(path.join(folder, "manifest.json"));
if (
  ![125, 119].includes(manifest.durationSeconds) ||
  scroll.durationSeconds !== 119
)
  throw Error("Unexpected source narration clock");
const videoManifest = read(path.join(folder, "video/manifest.json"));
const titleTimes = video.videoTitleCues.map((t) => t.start);
// Card starts are expressed on the video clock; remove preceding card offsets.
const cuts = [
  0,
  ...titleTimes.slice(1).map((time, i) => time - (i + 1) * 3),
  119,
];
for (const language of Object.keys(scroll.languages)) {
  const source = path.join(folder, `${language}.m4a`);
  if (manifest.durationSeconds === 125) {
    const backup = path.join(work, `${language}.original.m4a`);
    if (!fs.existsSync(backup)) fs.copyFileSync(source, backup);
    const trimmed = path.join(work, `${language}.trimmed.m4a`);
    encode(
      backup,
      trimmed,
      "[0:a]atrim=start=6:end=125,asetpts=PTS-STARTPTS[out]",
    );
    fs.copyFileSync(trimmed, source);
  }
  const parts = [];
  for (let i = 0; i < cuts.length - 1; i++) {
    parts.push(`anullsrc=r=48000:cl=mono,atrim=duration=3[s${i}]`);
    parts.push(
      `[0:a]atrim=start=${cuts[i]}:end=${cuts[i + 1]},asetpts=PTS-STARTPTS[a${i}]`,
    );
  }
  parts.push("[s0][a0][s1][a1][s2][a2]concat=n=6:v=0:a=1[out]");
  encode(source, path.join(folder, `video/${language}.m4a`), parts.join(";"));
  for (const [sub, script, m] of [
    ["", scroll, manifest],
    ["video/", video, videoManifest],
  ]) {
    delete m.tracks[language].loudness; // Old measurements describe the pre-trim delivery.
    const audio = fs.readFileSync(path.join(folder, `${sub}${language}.m4a`));
    Object.assign(m.tracks[language], {
      bytes: audio.length,
      sha256: crypto.createHash("sha256").update(audio).digest("hex"),
    });
    const cues = script.cues.map((c) => ({
      id: c.id,
      start: c.start,
      end: c.end,
      text: c.caption?.[language] || c[language] || c.en,
    }));
    if (language !== "en")
      for (const title of script.videoTitleCues)
        cues.push({
          id: title.id,
          start: title.start,
          end: title.end,
          text: title.translations[language],
        });
    cues.sort((a, b) => a.start - b.start || a.end - b.end);
    fs.writeFileSync(
      path.join(folder, `${sub}${language}.vtt`),
      "WEBVTT\n\n" +
        cues
          .map(
            (c) =>
              `${c.id}\n${stamp(c.start)} --> ${stamp(c.end)}\n${c.text}\n`,
          )
          .join("\n"),
    );
  }
  console.log(`Retimed ${language}: 119s scroll / 128s video`);
}
manifest.durationSeconds = 119;
videoManifest.durationSeconds = 128;
write(path.join(folder, "manifest.json"), manifest);
write(path.join(folder, "video/manifest.json"), videoManifest);
