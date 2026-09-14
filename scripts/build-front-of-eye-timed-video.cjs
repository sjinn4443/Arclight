// Bake the visual holds into a seekable video. No runtime timer history is needed.
const fs = require("node:fs");
const path = require("node:path");
const { spawnSync } = require("node:child_process");

const root = path.resolve(__dirname, "..");
const source = "public/videos/FullAnim/New_FrontofEyeFullAnim.mp4";
const output = "public/videos/FullAnim/New_FrontofEyeFullAnim_timed.mp4";
const holds = [
  { at: 6, seconds: 4 },
  { at: 16, seconds: 5.5 },
  { at: 40.5, seconds: 5 },
  { at: 72.5, seconds: 7 },
  { at: 77, seconds: 4 },
  { at: 83.5, seconds: 4 },
  { at: 87.5, seconds: 3.1 },
  { at: 103.4, seconds: 7.5 },
  { at: 113.9, seconds: 1.1 },
  { at: 121, seconds: 3 },
];

function buildFilter() {
  const segments = [{ at: 0, seconds: 0 }, ...holds];
  const count = segments.length;
  const filters = [
    `[0:v]fps=30,split=${count}${segments.map((_, i) => `[s${i}]`).join("")}`,
  ];
  segments.forEach((segment, i) => {
    const next = segments[i + 1];
    const end = next ? `:end_frame=${Math.round(next.at * 30)}` : "";
    filters.push(
      `[s${i}]trim=start_frame=${Math.round(segment.at * 30)}${end},setpts=PTS-STARTPTS,tpad=start_mode=clone:start=${segment.seconds * 30},setpts=N/(30*TB)[v${i}]`,
    );
  });
  filters.push(
    `${segments.map((_, i) => `[v${i}]`).join("")}concat=n=${count}:v=1:a=0[out]`,
  );
  return filters.join(";");
}

if (require.main === module) {
  const bundled = path.join(
    root,
    "tmp/fundal-narration-tools/imageio_ffmpeg/binaries",
  );
  const ffmpeg =
    process.env.FFMPEG_PATH ||
    path.join(
      bundled,
      fs.readdirSync(bundled).find((name) => /^ffmpeg.*\.exe$/.test(name)),
    );
  const args = [
    "-hide_banner",
    "-loglevel",
    "error",
    "-y",
    "-i",
    source,
    "-filter_complex",
    buildFilter(),
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
    "-g",
    "30",
    "-movflags",
    "+faststart",
    output,
  ];
  const result = spawnSync(ffmpeg, args, { cwd: root, stdio: "inherit" });
  if (result.error) throw result.error;
  if (result.status !== 0) process.exit(result.status || 1);
  const probe = spawnSync(ffmpeg, ["-hide_banner", "-i", output], {
    cwd: root,
    encoding: "utf8",
  });
  const duration = /Duration: (\d+):(\d+):(\d+\.\d+)/.exec(probe.stderr || "");
  const seconds =
    duration &&
    Number(duration[1]) * 3600 +
      Number(duration?.[2] || 0) * 60 +
      Number(duration?.[3] || 0);
  const script = JSON.parse(
    fs.readFileSync(
      path.join(
        root,
        "public/narration/front-of-eye/full-animation/script.json",
      ),
      "utf8",
    ),
  );
  if (!duration || Math.abs(seconds - script.durationSeconds) > 0.05) {
    throw new Error(
      `Timed video duration ${seconds} does not match narration ${script.durationSeconds}`,
    );
  }
  console.log(`Created ${output}`);
}

module.exports = { source, output, holds, buildFilter };
