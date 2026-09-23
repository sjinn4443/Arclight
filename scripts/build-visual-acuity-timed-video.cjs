// Keep original scene anchors and bake speech overruns into both video qualities.
// Generate cue MP3s with --tts-only first; then run this before mixing narration.
const fs = require("node:fs");
const path = require("node:path");
const { execFileSync } = require("node:child_process");

const root = path.resolve(__dirname, "..");
const scriptPath = path.join(
  root,
  "public/narration/visual-acuity/full-animation/script.json",
);
const sourceDir = path.join(
  root,
  ".codex-artifacts/visual-acuity-narration/source",
);
const workDir = path.join(root, "tmp/visual-acuity-narration");
const fps = 15;
const round = (value) => Math.round(value * 1e6) / 1e6;
const probe = (file) =>
  JSON.parse(
    execFileSync(
      process.env.FFPROBE_PATH || "ffprobe",
      [
        "-v",
        "error",
        "-show_entries",
        "format=duration:stream=codec_type,nb_frames,r_frame_rate",
        "-of",
        "json",
        file,
      ],
      { encoding: "utf8" },
    ),
  );

function build() {
  const script = JSON.parse(fs.readFileSync(scriptPath, "utf8"));
  fs.mkdirSync(sourceDir, { recursive: true });
  fs.mkdirSync(workDir, { recursive: true });
  for (const quality of ["220p", "720p"]) {
    const name = `VisualAcuityFullAnim_${quality}.mp4`;
    const original = path.join(sourceDir, name);
    if (!fs.existsSync(original)) {
      const delivery = path.join(root, "public/videos/FullAnim", name);
      if (Math.abs(Number(probe(delivery).format.duration) - 198.57) > 0.1) {
        throw new Error(
          "Restore the original 198.57-second source before rebuilding; never add holds twice.",
        );
      }
      fs.copyFileSync(delivery, original);
    }
    const stream = probe(original).streams.find(
      (s) => s.codec_type === "video",
    );
    if (stream.r_frame_rate !== "15/1" || Number(stream.nb_frames) !== 2978) {
      throw new Error(`Unexpected source timeline: ${original}`);
    }
  }

  const holds = [];
  let addedFrames = 0;
  for (const cue of script.cues) {
    const duration = Number(
      probe(path.join(workDir, "cues/en", `${cue.id}.mp3`)).format.duration,
    );
    const slot = cue.sourceEnd - cue.sourceStart;
    cue.start = round(cue.sourceStart + addedFrames / fps);
    const holdAtFrame = cue.manualHold
      ? Math.round(cue.manualHold.at * fps)
      : Math.floor(cue.sourceEnd * fps) - 1;
    const holdStart = (holdAtFrame + addedFrames) / fps;
    if (
      holdAtFrame / fps < cue.sourceStart ||
      holdAtFrame / fps >= cue.sourceEnd
    ) {
      throw new Error(`Hold must stay inside its scene: ${cue.id}`);
    }
    const extraFrames = Math.max(
      0,
      cue.minimumHoldFrames || 0,
      Math.ceil((duration + 0.35 - slot) * fps),
      cue.manualHold ? Math.ceil(cue.manualHold.minimumSeconds * fps) : 0,
      cue.manualHold?.finishCueAtHoldEnd
        ? Math.ceil((cue.start + duration + 0.35 - holdStart) * fps)
        : 0,
    );
    if (extraFrames) {
      holds.push({
        cueId: cue.id,
        atFrame: holdAtFrame,
        frames: extraFrames,
      });
      addedFrames += extraFrames;
    }
    cue.end = round(
      cue.manualHold?.finishCueAtHoldEnd
        ? holdStart + extraFrames / fps
        : cue.sourceEnd + addedFrames / fps,
    );
  }
  script.sourceDurationSeconds = 198.57;
  script.durationSeconds = round((2978 + addedFrames) / fps);
  script.encodedHolds = holds.map((h) => ({
    ...h,
    at: round(h.atFrame / fps),
    seconds: round(h.frames / fps),
  }));

  const segments = [{ atFrame: 0, frames: 0 }, ...holds];
  const filters = [
    `[0:v]split=${segments.length}${segments.map((_, i) => `[s${i}]`).join("")}`,
  ];
  segments.forEach((s, i) => {
    const next = segments[i + 1];
    filters.push(
      `[s${i}]trim=start_frame=${s.atFrame}${next ? `:end_frame=${next.atFrame}` : ""},setpts=PTS-STARTPTS,tpad=start_mode=clone:start=${s.frames},setpts=N/(${fps}*TB)[v${i}]`,
    );
  });
  filters.push(
    `${segments.map((_, i) => `[v${i}]`).join("")}concat=n=${segments.length}:v=1:a=0[out]`,
  );

  for (const quality of ["220p", "720p"]) {
    const name = `VisualAcuityFullAnim_${quality}.mp4`;
    const output = path.join(workDir, name);
    execFileSync(
      process.env.FFMPEG_PATH || "ffmpeg",
      [
        "-hide_banner",
        "-loglevel",
        "error",
        "-y",
        "-i",
        path.join(sourceDir, name),
        "-filter_complex",
        filters.join(";"),
        "-map",
        "[out]",
        "-an",
        "-c:v",
        "libx264",
        "-preset",
        "fast",
        "-crf",
        "20",
        "-pix_fmt",
        "yuv420p",
        "-r",
        String(fps),
        "-g",
        String(fps),
        "-movflags",
        "+faststart",
        output,
      ],
      { stdio: "inherit" },
    );
    if (
      Math.abs(Number(probe(output).format.duration) - script.durationSeconds) >
      0.05
    ) {
      throw new Error(
        `Encoded duration does not match the narration timeline: ${output}`,
      );
    }
  }
  // Publish only after both qualities have passed duration checks.
  for (const quality of ["220p", "720p"]) {
    const name = `VisualAcuityFullAnim_${quality}.mp4`;
    fs.copyFileSync(
      path.join(workDir, name),
      path.join(root, "public/videos/FullAnim", name),
    );
  }
  fs.writeFileSync(scriptPath, JSON.stringify(script, null, 2) + "\n");
  console.log(
    JSON.stringify(
      { duration: script.durationSeconds, holds: script.encodedHolds },
      null,
      2,
    ),
  );
}

if (require.main === module) build();
