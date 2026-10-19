// Render the shipped Lottie scenes on the same absolute clock as the narration.
const fs = require("node:fs");
const path = require("node:path");
const http = require("node:http");
const { spawn, spawnSync } = require("node:child_process");
const { once } = require("node:events");
const { pathToFileURL } = require("node:url");
const { chromium } = require("playwright");

const root = path.resolve(__dirname, "..");
const publicDir = path.join(root, "public");
const output = path.join(publicDir, "videos/FullAnim");
const stem = "MakeEyePadShieldFullAnim";

async function main() {
  const {
    EYE_PAD_SHIELD_SCROLL_CONFIG: config,
    EYE_PAD_SHIELD_SCROLL_CLIPS: clips,
    EYE_PAD_SHIELD_SECTIONS: sections,
    EYE_PAD_SHIELD_TITLE_SECONDS: titleSeconds,
  } = await import(
    pathToFileURL(path.join(publicDir, "js/eyePadShieldScroll.js"))
  );
  const ffmpeg =
    process.env.FFMPEG_PATH ||
    path.join(
      root,
      "tmp/fundal-narration-tools/imageio_ffmpeg/binaries/ffmpeg-win-x86_64-v7.1.exe",
    );
  fs.mkdirSync(output, { recursive: true });
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
      const section = sections.find((section) => section.startIndex === i);
      if (section) {
        const title = await page.evaluate((text) => {
          const canvas = document.createElement("canvas");
          canvas.width = 658;
          canvas.height = 720;
          const context = canvas.getContext("2d");
          context.fillStyle = "#0f0f0f";
          context.fillRect(0, 0, canvas.width, canvas.height);
          context.fillStyle = "#ffffff";
          context.font = "bold 46px Arial";
          context.textAlign = "center";
          context.textBaseline = "middle";
          context.fillText(
            text,
            canvas.width / 2,
            canvas.height / 2,
            canvas.width - 64,
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
      const frames = Math.round((clips[i].end - clips[i].start) * 30);
      // The audio has a one-second lead-in. Hold the first scene's first frame.
      for (let start = i === 0 ? -30 : 0; start < frames; start += 30) {
        const images = await page.evaluate(
          ({ start, end }) => {
            const canvas = document.querySelector("canvas");
            const images = [];
            for (let frame = start; frame < end; frame++) {
              window.anim.goToAndStop(Math.max(0, frame), true);
              images.push(canvas.toDataURL("image/png").split(",")[1]);
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
    // Retire only this builder's superseded low-resolution output.
    fs.rmSync(path.join(output, `${stem}_220p.mp4`), { force: true });
    console.log(
      `Created both ${clips.at(-1).end + sections.length * titleSeconds}s delivery videos`,
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
