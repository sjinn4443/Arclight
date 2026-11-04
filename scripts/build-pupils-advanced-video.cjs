// Render shipped Lottie scenes and narration through one shared video edit list.
const fs = require("node:fs");
const path = require("node:path");
const http = require("node:http");
const { spawn, spawnSync } = require("node:child_process");
const { once } = require("node:events");
const { pathToFileURL } = require("node:url");
const { chromium } = require("playwright");
const crypto = require("node:crypto");
const { writeCaptions } = require("./lib/pupils-caption-authoring.cjs");
const videoTimeline = require("./lib/pupils-advanced-video-timeline.cjs");

const root = path.resolve(__dirname, "..");
const publicDir = path.join(root, "public");
const output = path.resolve(
  process.env.PUPILS_ADVANCED_VIDEO_OUTPUT_DIR ||
    path.join(publicDir, "videos/FullAnim"),
);
const stem = "PupilsAdvancedFullAnim";
const titleSeconds = 3;
let titleTranslations;

function prepareNarration(config, ffmpeg) {
  const folder = path.join(
    publicDir,
    "narration/pupils-advanced/full-animation",
  );
  const destination = path.join(folder, "video");
  fs.mkdirSync(destination, { recursive: true });
  const source = JSON.parse(
    fs.readFileSync(path.join(folder, "script.json"), "utf8"),
  );
  const scenes = videoTimeline(config, titleSeconds);
  const sceneAt = (time) =>
    scenes.find(
      (s, i) =>
        time >= s.sourceStart &&
        time < (scenes[i + 1]?.sourceStart ?? Infinity),
    );
  const mapTime = (time, scene = sceneAt(time)) =>
    scene.start + Math.min(time, scene.sourceEnd) - scene.sourceStart;
  const script = {
    ...source,
    sourceVideo: `/videos/FullAnim/${stem}_720p.mp4`,
    durationSeconds: scenes.at(-1).end,
    timingSource:
      "Advanced scenes with seven silent 3s title cards; the first pathways and near examination silent tails are shortened to 1.5s after completion.",
    videoSceneCues: scenes,
    cues: source.cues.map((cue) => ({
      ...cue,
      start: mapTime(cue.start),
      end: mapTime(cue.end, sceneAt(cue.start)),
    })),
    visualCues: (source.visualCues || []).map((cue) => ({
      ...cue,
      at: mapTime(cue.at),
    })),
    videoTitleCues: config.sections.map((section, i) => ({
      id: `video-title-${i + 1}`,
      sourceText: section.title,
      start: scenes[section.startIndex].titleStart,
      end: scenes[section.startIndex].titleEnd,
      translations: titleTranslations[section.title],
    })),
  };
  fs.writeFileSync(
    path.join(destination, "script.json"),
    JSON.stringify(script, null, 2) + "\n",
  );
  const manifest = {
    schemaVersion: 1,
    durationSeconds: script.durationSeconds,
    tracks: {},
  };
  const timestamp = (seconds) =>
    new Date(Math.round(seconds * 1000)).toISOString().slice(11, 23);
  for (const [language, voice] of Object.entries(source.languages)) {
    const sourceAudio = path.join(folder, `${language}.m4a`);
    const filters = [
      `[0:a]asplit=${scenes.length}${scenes.map((_, i) => `[in${i}]`).join("")}`,
    ];
    scenes.forEach((scene, i) => {
      if (scene.title)
        filters.push(
          `anullsrc=r=48000:cl=mono,atrim=duration=${titleSeconds}[silence${i}]`,
        );
      filters.push(
        `[in${i}]atrim=start=${scene.sourceStart}:end=${scene.sourceEnd},asetpts=PTS-STARTPTS[part${i}]`,
      );
    });
    filters.push(
      `${scenes.map((s, i) => `${s.title ? `[silence${i}]` : ""}[part${i}]`).join("")}concat=n=${scenes.length + config.sections.length}:v=0:a=1[out]`,
    );
    const audioFile = path.join(destination, `${language}.m4a`);
    const result = spawnSync(
      ffmpeg,
      [
        "-hide_banner",
        "-loglevel",
        "error",
        "-y",
        "-i",
        sourceAudio,
        "-filter_complex",
        filters.join(";"),
        "-map",
        "[out]",
        "-t",
        String(script.durationSeconds),
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
        audioFile,
      ],
      { encoding: "utf8" },
    );
    if (result.error || result.status !== 0)
      throw result.error || new Error(result.stderr);
    const cues = [
      ...script.cues.map((cue) => ({ ...cue, text: cue[language] })),
      ...script.videoTitleCues
        .filter((cue) => cue.translations[language])
        .map((cue) => ({ ...cue, text: cue.translations[language] })),
    ].sort((a, b) => a.start - b.start);
    fs.writeFileSync(
      path.join(destination, `${language}.vtt`),
      "WEBVTT\n\n" +
        cues
          .map(
            (cue) =>
              `${cue.id}\n${timestamp(cue.start)} --> ${timestamp(cue.end)}\n${cue.text}\n`,
          )
          .join("\n"),
    );
    const bytes = fs.readFileSync(audioFile);
    manifest.tracks[language] = {
      src: `${language}.m4a`,
      captions: `${language}.vtt`,
      label: voice.label,
      voice: voice.voice,
      bytes: bytes.length,
      sha256: crypto.createHash("sha256").update(bytes).digest("hex"),
      durationSeconds: script.durationSeconds,
      sourceSha256: crypto
        .createHash("sha256")
        .update(fs.readFileSync(sourceAudio))
        .digest("hex"),
    };
  }
  fs.writeFileSync(
    path.join(destination, "manifest.json"),
    JSON.stringify(manifest, null, 2) + "\n",
  );
  writeCaptions(script, destination);
}

async function main() {
  const {
    PUPILS_ADVANCED_SCROLL_CONFIG: config,
    PUPILS_ADVANCED_TITLE_TRANSLATIONS,
  } = await import(
    pathToFileURL(path.join(publicDir, "js/pupilsAdvancedScroll.js"))
  );
  titleTranslations = Object.fromEntries(
    config.sections.map((section, i) => [
      section.title,
      { ko: PUPILS_ADVANCED_TITLE_TRANSLATIONS[i] },
    ]),
  );
  const clips = config.narrationClipsByFile;
  const timeline = videoTimeline(config, titleSeconds);
  const ffmpeg =
    process.env.FFMPEG_PATH ||
    path.join(
      root,
      "tmp/fundal-narration-tools/imageio_ffmpeg/binaries/ffmpeg-win-x86_64-v7.1.exe",
    );
  fs.mkdirSync(output, { recursive: true });
  if (process.argv.includes("--narration-only")) {
    prepareNarration(config, ffmpeg);
    return;
  }
  const server = http.createServer((req, res) => {
    const file = path.resolve(
      publicDir,
      "." + decodeURIComponent(req.url.split("?")[0]),
    );
    if (!file.startsWith(publicDir + path.sep)) {
      res.writeHead(403).end();
      return;
    }
    fs.readFile(file, (error, data) => {
      if (error) {
        res.writeHead(404).end();
        return;
      }
      const types = {
        ".js": "text/javascript",
        ".json": "application/json",
        ".webp": "image/webp",
        ".png": "image/png",
      };
      res.setHeader(
        "Content-Type",
        types[path.extname(file)] || "application/octet-stream",
      );
      res.end(data);
    });
  });
  server.listen(0, "127.0.0.1");
  await once(server, "listening");
  let browser;
  let encoder;
  try {
    browser = await chromium.launch(
      process.env.CHROME_CHANNEL ? { channel: process.env.CHROME_CHANNEL } : {},
    );
    const page = await browser.newPage({
      viewport: { width: 658, height: 720 },
      deviceScaleFactor: 1,
    });
    const origin = `http://127.0.0.1:${server.address().port}`;
    await page.goto(origin + "/vendor/versions.json");
    await page.setContent(
      '<div id="stage" style="width:658px;height:720px"></div>',
    );
    await page.addScriptTag({ url: origin + "/vendor/lottie.min.js" });
    encoder = spawn(
      ffmpeg,
      [
        "-hide_banner",
        "-loglevel",
        "error",
        "-y",
        "-f",
        "image2pipe",
        "-framerate",
        "30",
        "-c:v",
        "png",
        "-i",
        "pipe:0",
        "-an",
        "-vf",
        "scale=in_range=full:out_range=tv:out_color_matrix=bt709,format=yuv420p,setsar=1",
        "-color_range",
        "tv",
        "-colorspace",
        "bt709",
        "-color_primaries",
        "bt709",
        "-color_trc",
        "bt709",
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
        path.join(output, `${stem}_720p.mp4`),
      ],
      { stdio: ["pipe", "inherit", "inherit"] },
    );
    const completion = once(encoder, "close");
    encoder.stdin.on("error", () => {});
    const writeFrame = async (image) => {
      if (encoder.exitCode != null)
        throw new Error("Video encoder exited early");
      if (!encoder.stdin.write(Buffer.from(image, "base64")))
        await once(encoder.stdin, "drain");
    };
    for (let i = 0; i < config.paths.length; i++) {
      const section = config.sections.find(
        (section) => section.startIndex === i,
      );
      if (section) {
        const title = await page.evaluate((text) => {
          const canvas = document.createElement("canvas");
          canvas.width = 658;
          canvas.height = 720;
          const context = canvas.getContext("2d");
          context.fillStyle = "#0f0f0f";
          context.fillRect(0, 0, 658, 720);
          context.fillStyle = "#ffffff";
          context.font = "bold 46px Arial";
          context.textAlign = "center";
          context.textBaseline = "middle";
          const words = text.split(/\s+/),
            lines = [];
          let line = "";
          for (const word of words) {
            const candidate = line ? line + " " + word : word;
            if (line && context.measureText(candidate).width > 594) {
              lines.push(line);
              line = word;
            } else line = candidate;
          }
          if (line) lines.push(line);
          lines.forEach((line, i) =>
            context.fillText(
              line,
              329,
              360 + (i - (lines.length - 1) / 2) * 58,
            ),
          );
          return canvas.toDataURL("image/png").split(",")[1];
        }, section.title);
        for (let frame = 0; frame < titleSeconds * 30; frame++)
          await writeFrame(title);
      }
      const file = config.paths[i];
      const data = JSON.parse(
        fs.readFileSync(path.join(publicDir, file), "utf8"),
      );
      for (const asset of data.assets || []) {
        if (asset.p && !asset.e)
          asset.u = new URL(asset.u || "", origin + file).href;
      }
      await page.evaluate(
        (data) =>
          new Promise((resolve, reject) => {
            window.anim?.destroy();
            window.anim = lottie.loadAnimation({
              container: document.getElementById("stage"),
              renderer: "canvas",
              rendererSettings: { clearCanvas: true, dpr: 1 },
              loop: false,
              autoplay: false,
              animationData: data,
            });
            window.anim.addEventListener("DOMLoaded", resolve);
            window.anim.addEventListener("data_failed", () =>
              reject(new Error("Lottie failed")),
            );
          }),
        data,
      );
      await page.waitForFunction(
        () =>
          window.anim.imagePreloader.loadedAssets ===
          window.anim.imagePreloader.totalImages,
      );
      const frames = Math.round((timeline[i].sourceEnd - clips[i].start) * 30);
      // The audio has a one-second lead-in. Hold the first scene's first frame.
      for (let start = i === 0 ? -30 : 0; start < frames; start += 30) {
        const images = await page.evaluate(
          ({ start, end }) => {
            const canvas = document.querySelector("canvas");
            const output = document.createElement("canvas");
            output.width = 658;
            output.height = 720;
            const context = output.getContext("2d");
            const images = [];
            for (let frame = start; frame < end; frame++) {
              window.anim.goToAndStop(Math.max(0, frame), true);
              context.fillStyle = "#0f0f0f";
              context.fillRect(0, 0, 658, 720);
              context.drawImage(canvas, 0, 0);
              images.push(output.toDataURL("image/png").split(",")[1]);
            }
            return images;
          },
          { start, end: Math.min(start + 30, frames) },
        );
        for (const image of images) {
          await writeFrame(image);
        }
      }
      console.log(
        `Rendered scene ${i + 1}/${config.paths.length}: ${clips[i].end}s`,
      );
    }
    encoder.stdin.end();
    const [code] = await completion;
    if (code !== 0) throw new Error(`Encoder exited ${code}`);
    const low = spawnSync(
      ffmpeg,
      [
        "-hide_banner",
        "-loglevel",
        "error",
        "-y",
        "-i",
        path.join(output, `${stem}_720p.mp4`),
        "-vf",
        "scale=-2:240:in_range=tv:out_range=tv,setsar=1",
        "-an",
        "-c:v",
        "libx264",
        "-preset",
        "fast",
        "-crf",
        "20",
        "-pix_fmt",
        "yuv420p",
        "-color_range",
        "tv",
        "-colorspace",
        "bt709",
        "-color_primaries",
        "bt709",
        "-color_trc",
        "bt709",
        "-g",
        "30",
        "-movflags",
        "+faststart",
        path.join(output, `${stem}_240p.mp4`),
      ],
      { stdio: "inherit" },
    );
    if (low.error || low.status !== 0)
      throw low.error || new Error("Low-resolution encode failed");
    prepareNarration(config, ffmpeg);
    console.log(
      `Created both ${timeline.at(-1).end}s delivery videos and retimed narration/captions`,
    );
  } finally {
    if (encoder && encoder.exitCode == null) encoder.kill();
    await browser?.close();
    server.close();
  }
}
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
