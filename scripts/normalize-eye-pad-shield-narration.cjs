// Match translated delivery levels to English after regenerating either timeline.
const fs = require("node:fs");
const path = require("node:path");
const crypto = require("node:crypto");
const { spawnSync } = require("node:child_process");
const root = path.resolve(__dirname, "..");
const ffmpeg =
  process.env.FFMPEG_PATH ||
  path.join(
    root,
    "tmp/fundal-narration-tools/imageio_ffmpeg/binaries/ffmpeg-win-x86_64-v7.1.exe",
  );
const folder = path.join(
  root,
  "public/narration/make-eye-pad-shield/full-animation",
);
const work = path.join(root, "tmp/make-eye-pad-shield-narration/normalised");
fs.mkdirSync(work, { recursive: true });
const read = (file) => JSON.parse(fs.readFileSync(file, "utf8"));
const write = (file, value) =>
  fs.writeFileSync(file, JSON.stringify(value, null, 2) + "\n");
function run(args) {
  const result = spawnSync(ffmpeg, ["-hide_banner", "-nostats", ...args], {
    encoding: "utf8",
    cwd: root,
  });
  if (result.error || result.status !== 0)
    throw result.error || new Error(result.stderr);
  return result.stderr;
}
function measure(file) {
  const output = run([
    "-i",
    file,
    "-af",
    "loudnorm=print_format=json",
    "-f",
    "null",
    "-",
  ]);
  return JSON.parse(output.match(/\{\s*"input_i"[\s\S]*?\}/)[0]);
}
for (const [subfolder, artifacts] of [
  ["", "make-eye-pad-shield-narration"],
  ["video", "make-eye-pad-shield-video-narration"],
]) {
  const directory = path.join(folder, subfolder);
  const manifestFile = path.join(directory, "manifest.json");
  const qaFile = path.join(
    root,
    ".codex-artifacts",
    artifacts,
    "qa-report.json",
  );
  const manifest = read(manifestFile);
  const qa = read(qaFile);
  const target = Number(measure(path.join(directory, "en.m4a")).input_i);
  for (const [language, track] of Object.entries(manifest.tracks)) {
    if (language === "en") continue;
    const destination = path.join(directory, track.src);
    const before = measure(destination);
    let gain = target - Number(before.input_i);
    if (Math.abs(gain) <= 0.5 && Number(before.input_tp) <= -1) continue;
    const temporary = path.join(
      work,
      `${subfolder || "scroll"}-${language}.m4a`,
    );
    let after;
    // Always encode from the original input, avoiding cumulative AAC losses.
    // Reserve 5 dB for reconstruction peaks and compensate the limiter latency.
    for (let attempt = 0; attempt < 4; attempt++) {
      run([
        "-y",
        "-i",
        destination,
        "-af",
        `volume=${gain.toFixed(3)}dB,alimiter=limit=0.56:level=false:latency=true`,
        "-t",
        String(manifest.durationSeconds),
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
        temporary,
      ]);
      after = measure(temporary);
      const correction = target - Number(after.input_i);
      if (Math.abs(correction) <= 0.5) break;
      gain += correction;
    }
    if (
      Math.abs(Number(after.input_i) - target) > 0.5 ||
      Number(after.input_tp) > -1
    )
      throw new Error(
        `Level check failed for ${subfolder}/${language}: ${JSON.stringify(after)}`,
      );
    fs.copyFileSync(temporary, destination);
    const audio = fs.readFileSync(destination);
    track.bytes = audio.length;
    track.sha256 = crypto.createHash("sha256").update(audio).digest("hex");
    track.loudness = {
      referenceLanguage: "en",
      integratedLUFS: Number(after.input_i),
      truePeakDbTP: Number(after.input_tp),
    };
    Object.assign(qa.tracks[language].delivery, {
      bytes: track.bytes,
      sha256: track.sha256,
    });
    qa.tracks[language].loudnessNormalization = {
      before,
      after,
      targetLUFS: target,
    };
    console.log(
      `${subfolder || "scroll"}/${language}: ${before.input_i} -> ${after.input_i} LUFS`,
    );
  }
  write(manifestFile, manifest);
  write(qaFile, qa);
}
