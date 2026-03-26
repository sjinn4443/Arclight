import { spawnSync } from "node:child_process";
import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const projectRoot = path.resolve(__dirname, "..");
const publicRoot = path.join(projectRoot, "public");
const catalogPath = path.join(
  publicRoot,
  "video-localization",
  "childhood-eye-screening.json",
);
const outputRoot = path.join(
  publicRoot,
  "video-hls",
  "childhood-eye-screening",
);
const languageLabels = {
  en: "English",
  am: "Amharic",
  ar: "Arabic",
  bn: "Bangla",
  ny: "Chichewa",
  zh: "Chinese",
  fr: "French",
  ha: "Hausa",
  hi: "Hindi",
  ig: "Igbo",
  id: "Indonesian",
  rw: "Kinyarwanda",
  ko: "Korean",
  ln: "Lingala",
  fa: "Persian",
  pt: "Portuguese",
  sn: "Shona",
  es: "Spanish",
  sw: "Swahili",
  te: "Telugu",
  ur: "Urdu",
  yo: "Yoruba",
  zu: "Zulu",
};

function run(command, args) {
  const result = spawnSync(command, args, {
    cwd: projectRoot,
    encoding: "utf8",
    stdio: ["ignore", "pipe", "pipe"],
  });
  if (result.status !== 0) {
    throw new Error(
      `${command} failed (${result.status}): ${result.stderr || result.stdout}`,
    );
  }
  return result.stdout.trim();
}

function resolvePublicPath(relativeOrAbsolutePath) {
  const normalized = String(relativeOrAbsolutePath || "").replace(/^\/+/, "");
  return path.join(publicRoot, normalized);
}

function toPosixPath(value) {
  return String(value || "").replace(/\\/g, "/");
}

function normalizeHlsWebVtt(rawText) {
  const normalized = String(rawText || "")
    .replace(/^\uFEFF/, "")
    .replace(/\r\n?/g, "\n");
  const body = normalized.replace(/^WEBVTT[^\n]*\n+/, "");
  return `WEBVTT\nX-TIMESTAMP-MAP=LOCAL:00:00:00.000,MPEGTS:0\n\n${body.trimStart()}`;
}

function parseDuration(value) {
  const parsed = Number(value);
  return Number.isFinite(parsed) && parsed > 0 ? parsed : 1;
}

async function ensureCleanDir(dirPath) {
  await fs.rm(dirPath, { recursive: true, force: true });
  await fs.mkdir(dirPath, { recursive: true });
}

function buildSubtitlePlaylist(duration, fileName = "captions.vtt") {
  const targetDuration = Math.max(1, Math.ceil(duration));
  return [
    "#EXTM3U",
    "#EXT-X-VERSION:3",
    `#EXT-X-TARGETDURATION:${targetDuration}`,
    "#EXT-X-MEDIA-SEQUENCE:0",
    "#EXT-X-PLAYLIST-TYPE:VOD",
    `#EXTINF:${duration.toFixed(3)},`,
    fileName,
    "#EXT-X-ENDLIST",
    "",
  ].join("\n");
}

function buildMasterPlaylist({ bandwidth, averageBandwidth, resolution, languages }) {
  const lines = ["#EXTM3U", "#EXT-X-VERSION:3", ""];
  languages.forEach((lang, index) => {
    const label = languageLabels[lang] || lang.toUpperCase();
    lines.push(
      `#EXT-X-MEDIA:TYPE=SUBTITLES,GROUP-ID="subs",NAME="${label}",LANGUAGE="${lang}",AUTOSELECT=YES,DEFAULT=${index === 0 ? "YES" : "NO"},FORCED=NO,URI="subtitles/${lang}/index.m3u8"`,
    );
  });
  lines.push(
    `#EXT-X-STREAM-INF:BANDWIDTH=${bandwidth},AVERAGE-BANDWIDTH=${averageBandwidth},RESOLUTION=${resolution},CODECS="avc1.42E01E,mp4a.40.2",SUBTITLES="subs",CLOSED-CAPTIONS=NONE"`,
  );
  lines.push("video/index.m3u8", "");
  return lines.join("\n");
}

async function main() {
  const catalog = JSON.parse(await fs.readFile(catalogPath, "utf8"));
  const pageIds = Object.keys(catalog);

  for (const pageId of pageIds) {
    const entry = catalog[pageId];
    const iosHls = entry?.iosHls;
    const lowSource = entry?.localSources?.low;
    if (!iosHls?.masterManifest || !lowSource) continue;

    const outputDir = path.join(outputRoot, pageId);
    const videoDir = path.join(outputDir, "video");
    const subtitleRoot = path.join(outputDir, "subtitles");
    await ensureCleanDir(outputDir);
    await fs.mkdir(videoDir, { recursive: true });
    await fs.mkdir(subtitleRoot, { recursive: true });

    const inputPath = resolvePublicPath(lowSource);
    const ffprobeJson = run("ffprobe", [
      "-v",
      "error",
      "-print_format",
      "json",
      "-show_entries",
      "stream=width,height,bit_rate,codec_type:format=duration,bit_rate",
      inputPath,
    ]);
    const mediaInfo = JSON.parse(ffprobeJson);
    const videoStream =
      mediaInfo.streams?.find((stream) => stream.codec_type === "video") || {};
    const formatInfo = mediaInfo.format || {};
    const duration = parseDuration(formatInfo.duration);
    const averageBandwidth = Math.max(
      160000,
      Math.ceil(Number(formatInfo.bit_rate || videoStream.bit_rate || 320000)),
    );
    const bandwidth = Math.ceil(averageBandwidth * 1.1);
    const resolution = `${videoStream.width || 426}x${videoStream.height || 240}`;

    run("ffmpeg", [
      "-y",
      "-i",
      inputPath,
      "-c",
      "copy",
      "-map",
      "0:v:0",
      "-map",
      "0:a:0?",
      "-f",
      "hls",
      "-hls_time",
      "6",
      "-hls_playlist_type",
      "vod",
      "-hls_list_size",
      "0",
      "-hls_flags",
      "independent_segments",
      "-hls_segment_filename",
      path.join(videoDir, "segment_%03d.ts"),
      path.join(videoDir, "index.m3u8"),
    ]);

    const subtitleLanguages = Array.from(
      new Set(
        (iosHls.subtitleLanguages || Object.keys(entry.subtitles || {})).filter(
          (lang) => entry.subtitles?.[lang],
        ),
      ),
    );

    for (const lang of subtitleLanguages) {
      const sourcePath = resolvePublicPath(entry.subtitles[lang]);
      const subtitleDir = path.join(subtitleRoot, lang);
      await fs.mkdir(subtitleDir, { recursive: true });
      const rawVtt = await fs.readFile(sourcePath, "utf8");
      await fs.writeFile(
        path.join(subtitleDir, "captions.vtt"),
        normalizeHlsWebVtt(rawVtt),
        "utf8",
      );
      await fs.writeFile(
        path.join(subtitleDir, "index.m3u8"),
        buildSubtitlePlaylist(duration),
        "utf8",
      );
    }

    await fs.writeFile(
      path.join(outputDir, "master.m3u8"),
      buildMasterPlaylist({
        bandwidth,
        averageBandwidth,
        resolution,
        languages: subtitleLanguages,
      }),
      "utf8",
    );

    const relativeOutput = toPosixPath(path.relative(publicRoot, outputDir));
    console.log(`generated ${relativeOutput}`);
  }
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
