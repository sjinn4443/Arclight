#!/usr/bin/env node
// Match quieter translated narration to the English track in each collection.
// Usage: node scripts/normalize-narration-loudness.cjs [--apply]
// Requires ffmpeg and ffprobe on PATH (or FFMPEG / FFPROBE overrides).
const fs = require("node:fs");
const path = require("node:path");
const crypto = require("node:crypto");
const { spawn } = require("node:child_process");

const root = path.resolve(__dirname, "..");
const narrationRoot = path.join(root, "public/narration");
const work = path.join(root, "tmp/narration-loudness");
const apply = process.argv.includes("--apply");
const ffmpeg = process.env.FFMPEG || "ffmpeg";
const ffprobe = process.env.FFPROBE || "ffprobe";
const toleranceLU = 0.5;

function run(binary, args) {
  return new Promise((resolve, reject) => {
    const child = spawn(binary, args, { windowsHide: true });
    let output = "";
    child.stdout.on("data", (data) => {
      output += data;
    });
    child.stderr.on("data", (data) => {
      output += data;
    });
    child.on("error", reject);
    child.on("close", (code) =>
      code === 0 ? resolve(output) : reject(new Error(`${binary}: ${output}`)),
    );
  });
}

async function measure(file) {
  const output = await run(ffmpeg, [
    "-hide_banner",
    "-nostats",
    "-nostdin",
    "-i",
    file,
    "-af",
    "loudnorm=print_format=json",
    "-f",
    "null",
    "-",
  ]);
  const match = output.match(/\{\s*"input_i"[\s\S]*?\}/);
  if (!match) throw new Error(`No loudness measurement: ${file}`);
  const stats = JSON.parse(match[0]);
  const loudness = Object.fromEntries(
    Object.entries(stats)
      .filter(([key]) => key.startsWith("input_"))
      .map(([key, value]) => [key, Number(value)]),
  );
  if (!Object.values(loudness).every(Number.isFinite))
    throw new Error(`Invalid loudness: ${file}`);
  const metadata = JSON.parse(
    await run(ffprobe, [
      "-v",
      "error",
      "-show_entries",
      "format=duration:stream=sample_rate,channels",
      "-of",
      "json",
      file,
    ]),
  );
  return {
    ...loudness,
    duration: Number(metadata.format.duration),
    ...metadata.streams[0],
  };
}

async function pooled(items, action) {
  let index = 0;
  await Promise.all(
    Array.from({ length: Math.min(3, items.length) }, async () => {
      while (index < items.length) await action(items[index++]);
    }),
  );
}

async function main() {
  fs.mkdirSync(work, { recursive: true });
  const collections = fs
    .readdirSync(narrationRoot)
    .filter((name) =>
      fs.existsSync(
        path.join(narrationRoot, name, "full-animation/manifest.json"),
      ),
    );
  const tracks = [];
  const manifests = new Map();
  for (const collection of collections) {
    const directory = path.join(narrationRoot, collection, "full-animation");
    const manifest = JSON.parse(
      fs.readFileSync(path.join(directory, "manifest.json"), "utf8"),
    );
    manifests.set(collection, { directory, manifest });
    for (const [language, entry] of Object.entries(manifest.tracks)) {
      tracks.push({
        collection,
        language,
        file: path.join(directory, entry.src),
      });
    }
  }
  await pooled(tracks, async (track) => {
    track.before = await measure(track.file);
    console.log(
      `${track.collection}/${track.language}: ${track.before.input_i.toFixed(2)} LUFS`,
    );
  });
  for (const track of tracks) {
    const reference = tracks.find(
      (item) => item.collection === track.collection && item.language === "en",
    );
    if (!reference)
      throw new Error(`No English reference for ${track.collection}`);
    track.targetLUFS = reference.before.input_i;
    track.gainDb = Number((track.targetLUFS - track.before.input_i).toFixed(2));
    track.needsBoost = track.language !== "en" && track.gainDb > toleranceLU;
  }
  const quiet = tracks.filter((track) => track.needsBoost);
  console.log(
    `${quiet.length}/${tracks.length} tracks are quieter than their English reference.`,
  );
  if (apply) {
    await pooled(quiet, async (track) => {
      const before = track.before;
      const output = path.join(
        work,
        `${track.collection}-${track.language}.m4a`,
      );
      // A fixed gain preserves speech dynamics when headroom allows it.
      // Otherwise use measured loudness normalization with a true-peak ceiling.
      // Reserve extra headroom for AAC reconstruction peaks, then verify the encoded file.
      const filter =
        before.input_tp + track.gainDb <= -3.5
          ? `volume=${track.gainDb}dB`
          : `loudnorm=I=${track.targetLUFS}:TP=-3.5:LRA=50:measured_I=${before.input_i}:measured_TP=${before.input_tp}:measured_LRA=${before.input_lra}:measured_thresh=${before.input_thresh}:linear=true`;
      await run(ffmpeg, [
        "-y",
        "-hide_banner",
        "-nostats",
        "-nostdin",
        "-i",
        track.file,
        "-map",
        "0:a:0",
        "-af",
        filter,
        "-c:a",
        "aac",
        "-b:a",
        "48k",
        "-ar",
        String(before.sample_rate),
        "-ac",
        String(before.channels),
        "-t",
        String(before.duration),
        "-movflags",
        "+faststart",
        output,
      ]);
      track.after = await measure(output);
      if (
        Math.abs(track.after.input_i - track.targetLUFS) > toleranceLU ||
        track.after.input_tp > -0.5 ||
        Math.abs(track.after.duration - before.duration) > 0.025 ||
        track.after.sample_rate !== before.sample_rate ||
        track.after.channels !== before.channels
      ) {
        throw new Error(
          `Audio validation failed for ${track.collection}/${track.language}: ${JSON.stringify(track.after)}`,
        );
      }
      track.output = output;
      console.log(
        `Verified ${track.collection}/${track.language}: ${before.input_i} -> ${track.after.input_i} LUFS (+${track.gainDb} dB target)`,
      );
    });
    // Publish only after every candidate passes loudness, peak and timing checks.
    for (const track of quiet) {
      fs.copyFileSync(track.output, track.file);
      const { manifest } = manifests.get(track.collection);
      const bytes = fs.readFileSync(track.file);
      manifest.tracks[track.language].bytes = bytes.length;
      manifest.tracks[track.language].sha256 = crypto
        .createHash("sha256")
        .update(bytes)
        .digest("hex");
    }
    for (const collection of new Set(quiet.map((track) => track.collection))) {
      const { directory, manifest } = manifests.get(collection);
      fs.writeFileSync(
        path.join(directory, "manifest.json"),
        JSON.stringify(manifest, null, 2) + "\n",
      );
    }
  }
  const report = tracks.map(
    ({
      collection,
      language,
      before,
      after,
      targetLUFS,
      gainDb,
      needsBoost,
    }) => ({
      collection,
      language,
      before,
      after: after || before,
      targetLUFS,
      gainDb,
      changed: apply && needsBoost,
    }),
  );
  fs.writeFileSync(
    path.join(work, "report.json"),
    JSON.stringify(report, null, 2) + "\n",
  );
  console.log(
    `${apply ? "Updated" : "Would update"} ${quiet.length} tracks. Report: ${path.relative(root, work)}/report.json`,
  );
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
