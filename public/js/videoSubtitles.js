import { NATIVE_LANGUAGE_NAMES } from "./language-names.js";
import { createVideoDubAudio } from "./videoDubAudio.js";

const APP_VIDEO_SUBTITLE_CATALOG_URL =
  "/video-localization/app-video-subtitles.json";

const APP_VIDEO_LANGUAGE_ALIASES = Object.freeze({
  english: "en",
  amharic: "am",
  arabic: "ar",
  bangla: "bn",
  chichewa: "ny",
  chinese: "zh",
  french: "fr",
  hausa: "ha",
  hindi: "hi",
  nepali: "ne",
  igbo: "ig",
  indonesian: "id",
  kinyarwanda: "rw",
  korean: "ko",
  telugu: "te",
  lingala: "ln",
  luganda: "lg",
  persian: "fa",
  portuguese: "pt",
  shona: "sn",
  spanish: "es",
  swahili: "sw",
  urdu: "ur",
  yoruba: "yo",
  zulu: "zu",
  lao: "lo",
});

let appVideoSubtitleCatalogPromise = null;
let appVideoSubtitleInitialized = false;
let appVideoSubtitleResyncTimer = 0;
const appVideoNarration = new WeakMap();

const NARRATION_SELECT_COPY = {
  en: {
    language: "Narration language",
    auto: "Use app language",
    original: "Original audio",
  },
  ny: {
    language: "Chilankhulo cha mawu ofotokozera",
    auto: "Gwiritsani ntchito chilankhulo cha pulogalamu",
    original: "Mawu oyambirira",
  },
  ur: {
    language: "صوتی بیان کی زبان",
    auto: "ایپ کی زبان استعمال کریں",
    original: "اصل آواز",
  },
};

function normalizeAppVideoSubtitleLanguage(lang) {
  const normalized = String(lang || "")
    .trim()
    .toLowerCase();
  const base = normalized.split(/[-_]/)[0];
  const aliased = APP_VIDEO_LANGUAGE_ALIASES[base] || base;
  return Object.prototype.hasOwnProperty.call(NATIVE_LANGUAGE_NAMES, aliased)
    ? aliased
    : "en";
}

function getCurrentAppVideoSubtitleLanguage() {
  try {
    const fromI18n = window.I18N?.getLanguage?.();
    if (fromI18n) return normalizeAppVideoSubtitleLanguage(fromI18n);
  } catch {
    /* ignore */
  }

  try {
    const stored = localStorage.getItem("prefLang");
    if (stored) return normalizeAppVideoSubtitleLanguage(stored);
  } catch {
    /* ignore */
  }

  return normalizeAppVideoSubtitleLanguage(
    document.documentElement.getAttribute("lang") || "en",
  );
}

function getAppVideoSubtitleLabel(lang) {
  return NATIVE_LANGUAGE_NAMES[normalizeAppVideoSubtitleLanguage(lang)];
}

function normalizeAppVideoSource(src) {
  let value = String(src || "").trim();
  if (!value) return "";

  try {
    value = new URL(value, window.location.href).pathname;
  } catch {
    value = value.split(/[?#]/)[0] || value;
  }

  try {
    value = decodeURIComponent(value);
  } catch {
    /* keep original */
  }

  return value
    .replace(/^\/+/, "")
    .replace(/^public\//, "")
    .replace(/[?#].*$/, "")
    .replace(/\s+/g, " ")
    .trim();
}

function sanitizeAppVideoSubtitleCatalog(rawCatalog = {}) {
  const sanitized = {};

  Object.entries(rawCatalog || {}).forEach(([rawSource, entry]) => {
    if (!entry || typeof entry !== "object") return;
    const source = normalizeAppVideoSource(rawSource);
    if (!source) return;

    const subtitles = {};
    Object.entries(entry.subtitles || {}).forEach(([rawLang, rawSrc]) => {
      if (typeof rawSrc !== "string" || !rawSrc.trim()) return;
      subtitles[normalizeAppVideoSubtitleLanguage(rawLang)] = rawSrc;
    });
    if (!Object.keys(subtitles).length) return;

    sanitized[source] = {
      subtitles,
      audioVariants: Object.fromEntries(
        Object.entries(entry.audioVariants || {}).filter(
          ([, variant]) =>
            typeof variant?.src === "string" && variant.src.trim(),
        ),
      ),
      defaultSubtitleLang: normalizeAppVideoSubtitleLanguage(
        entry.defaultSubtitleLang || "en",
      ),
    };
  });

  return sanitized;
}

async function loadAppVideoSubtitleCatalog() {
  if (!appVideoSubtitleCatalogPromise) {
    appVideoSubtitleCatalogPromise = (async () => {
      try {
        const response = await fetch(APP_VIDEO_SUBTITLE_CATALOG_URL, {
          cache: "no-store",
        });
        if (!response.ok) {
          throw new Error(
            `failed to load subtitle catalog: ${response.status}`,
          );
        }
        return sanitizeAppVideoSubtitleCatalog(await response.json());
      } catch (err) {
        console.warn("[videoSubtitles] catalog unavailable", err);
        return {};
      }
    })();
  }

  return appVideoSubtitleCatalogPromise;
}

function collectVideoSources(video) {
  const values = [
    video.getAttribute("src"),
    ...Array.from(video.querySelectorAll("source")).map((source) =>
      source.getAttribute("src"),
    ),
    video.currentSrc,
  ];

  return values.map(normalizeAppVideoSource).filter(Boolean);
}

function resolveSubtitleSource(entry, preferredLang) {
  const subtitles = entry?.subtitles || {};
  const lang = normalizeAppVideoSubtitleLanguage(preferredLang);
  return {
    lang:
      subtitles[lang] != null
        ? lang
        : subtitles[entry.defaultSubtitleLang] != null
          ? entry.defaultSubtitleLang
          : subtitles.en != null
            ? "en"
            : Object.keys(subtitles)[0] || "en",
    src:
      subtitles[lang] ||
      subtitles[entry.defaultSubtitleLang] ||
      subtitles.en ||
      Object.values(subtitles)[0] ||
      "",
  };
}

function removeAppVideoSubtitleTracks(video) {
  video
    .querySelectorAll("track[data-localized-video-subtitle='true']")
    .forEach((track) => track.remove());
}

function showAppVideoSubtitleTrack(video, lang) {
  try {
    Array.from(video.textTracks || []).forEach((track) => {
      const trackLang = normalizeAppVideoSubtitleLanguage(
        track.language || track.srclang || "",
      );
      const isAppTrack =
        track.kind === "captions" || track.kind === "subtitles";
      if (!isAppTrack) return;
      track.mode = trackLang === lang ? "showing" : "disabled";
    });
  } catch {
    /* ignore */
  }
}

function applyAppVideoSubtitleTrack(video, { lang, src }) {
  if (!video || !src) return;
  if (video.querySelector("track[data-childhood-pilot-subtitle='true']")) {
    removeAppVideoSubtitleTracks(video);
    return;
  }

  const existing = video.querySelector(
    `track[data-localized-video-subtitle='true'][srclang='${lang}'][src='${src}']`,
  );
  if (existing) {
    showAppVideoSubtitleTrack(video, lang);
    return;
  }

  removeAppVideoSubtitleTracks(video);

  try {
    video.playsInline = true;
    video.setAttribute("playsinline", "");
    video.setAttribute("webkit-playsinline", "");
    if (!video.getAttribute("crossorigin")) {
      video.setAttribute("crossorigin", "anonymous");
    }
  } catch {
    /* ignore */
  }

  const track = document.createElement("track");
  track.kind = "captions";
  track.label = getAppVideoSubtitleLabel(lang);
  track.srclang = lang;
  track.src = src;
  track.default = true;
  track.setAttribute("kind", "captions");
  track.setAttribute("default", "");
  track.setAttribute("data-localized-video-subtitle", "true");
  track.addEventListener(
    "load",
    () => {
      showAppVideoSubtitleTrack(video, lang);
      try {
        if (track.track) track.track.mode = "showing";
      } catch {
        /* ignore */
      }
    },
    { once: true },
  );

  video.appendChild(track);
  showAppVideoSubtitleTrack(video, lang);
}

function applyAppVideoNarration(video, entry, preferredLang) {
  const existing = appVideoNarration.get(video);
  if (!Object.keys(entry.audioVariants).length && !existing)
    return preferredLang;

  const state = existing || createAppVideoNarration(video);
  state.entry = entry;
  state.preferredLang = preferredLang;
  state.select.hidden = !Object.keys(entry.audioVariants).length;
  const copy = NARRATION_SELECT_COPY[preferredLang] || NARRATION_SELECT_COPY.en;
  state.select.setAttribute("aria-label", copy.language);
  state.select.replaceChildren(
    new Option(copy.auto, "auto"),
    ...Object.entries(entry.audioVariants).map(
      ([lang, variant]) => new Option(variant.label || lang, lang),
    ),
    new Option(copy.original, "off"),
  );
  if (
    !Array.from(state.select.options).some(
      ({ value }) => value === state.selection,
    )
  ) {
    state.selection = "auto";
  }
  state.select.value = state.selection;
  state.sync();
  return entry.audioVariants[state.selection] ? state.selection : preferredLang;
}

function createAppVideoNarration(video) {
  const audio = document.createElement("audio");
  const select = document.createElement("select");
  select.className = "video-narration-toggle";
  audio.hidden = true;
  video.after(select, audio);
  audio.preload = "none";
  const output = createVideoDubAudio(video, audio);
  const state = {
    select,
    selection: "auto",
    entry: null,
    preferredLang: "en",
    sync,
  };
  appVideoNarration.set(video, state);

  function pause() {
    audio.pause();
  }

  function play(forceSeek = false) {
    if (
      !audio.hasAttribute("src") ||
      video.paused ||
      video.seeking ||
      video.ended
    )
      return;
    if (!video.isConnected || video.getClientRects().length === 0) {
      pause();
      return;
    }
    output.enable(true, {
      unmute: video.autoplay && state.selection !== "auto",
    });
    output.updateVolume();
    audio.playbackRate = video.playbackRate;
    if (
      audio.readyState &&
      (forceSeek || Math.abs(video.currentTime - audio.currentTime) > 0.35)
    ) {
      audio.currentTime = video.currentTime;
    }
    if (audio.paused) audio.play().catch(() => output.enable(false));
  }

  function reset() {
    pause();
    output.enable(false);
    if (!audio.hasAttribute("src")) return;
    audio.removeAttribute("src");
    audio.load();
  }

  function sync() {
    const language =
      state.selection === "auto" ? state.preferredLang : state.selection;
    const variant = state.entry?.audioVariants[language];
    // Autoplay previews keep their existing muted or looping behaviour unless
    // the learner asks for a track explicitly.
    if (!variant || (state.selection === "auto" && video.autoplay)) {
      reset();
      return;
    }
    if (audio.getAttribute("src") !== variant.src) {
      pause();
      audio.src = variant.src;
    }
    play(true);
  }

  select.addEventListener("change", () => {
    state.selection = select.value;
    sync();
    const language = state.entry.audioVariants[state.selection]
      ? state.selection
      : state.preferredLang;
    applyAppVideoSubtitleTrack(
      video,
      resolveSubtitleSource(state.entry, language),
    );
  });
  ["play", "playing", "seeked", "ratechange"].forEach((event) => {
    video.addEventListener(event, () => play(true));
  });
  ["pause", "waiting", "seeking", "ended", "emptied"].forEach((event) => {
    video.addEventListener(event, pause);
  });
  video.addEventListener("timeupdate", () => play());
  audio.addEventListener("loadedmetadata", () => play(true));
  audio.addEventListener("error", reset);
  state.reset = reset;
  return state;
}

export function releaseAppVideoNarration(video) {
  const state = appVideoNarration.get(video);
  if (!state) return;
  state.reset();
  state.select.hidden = true;
}

export async function syncLocalizedVideoSubtitles(root = document) {
  const catalog = await loadAppVideoSubtitleCatalog();
  if (!Object.keys(catalog).length) return;

  const scope = root?.querySelectorAll ? root : document;
  const videos = [
    ...(scope.matches?.("video") ? [scope] : []),
    ...Array.from(scope.querySelectorAll?.("video") || []),
  ];
  const preferredLang = getCurrentAppVideoSubtitleLanguage();

  videos.forEach((video) => {
    if (
      video.dataset.pageLevelVideoLocalization ||
      video.querySelector("track[data-childhood-pilot-subtitle='true']")
    ) {
      releaseAppVideoNarration(video);
      removeAppVideoSubtitleTracks(video);
      return;
    }

    const sources = collectVideoSources(video);
    const source =
      sources.find((candidate) => catalog[candidate]) ||
      sources
        .flatMap((candidate) => {
          const pair = globalThis.ArclightVideoQuality?.pair(candidate);
          return pair ? [pair.low, pair.high, ...(pair.aliases || [])] : [];
        })
        .map(normalizeAppVideoSource)
        .find((candidate) => catalog[candidate]);
    if (!source) {
      releaseAppVideoNarration(video);
      return;
    }

    const entry = catalog[source];
    const language = applyAppVideoNarration(video, entry, preferredLang);
    const resolved = resolveSubtitleSource(entry, language);
    applyAppVideoSubtitleTrack(video, resolved);
  });
}

function scheduleLocalizedVideoSubtitleSync(root = document) {
  window.clearTimeout(appVideoSubtitleResyncTimer);
  appVideoSubtitleResyncTimer = window.setTimeout(() => {
    void syncLocalizedVideoSubtitles(root);
  }, 80);
}

export function initializeLocalizedVideoSubtitles() {
  if (appVideoSubtitleInitialized) return;
  appVideoSubtitleInitialized = true;

  scheduleLocalizedVideoSubtitleSync(document);
  window.addEventListener("page:loaded", () => {
    scheduleLocalizedVideoSubtitleSync(document);
    window.setTimeout(() => syncLocalizedVideoSubtitles(document), 300);
  });
  document.addEventListener("page:shown", () => {
    scheduleLocalizedVideoSubtitleSync(document);
  });
  document.addEventListener(
    "loadedmetadata",
    (event) => {
      if (event.target.matches?.("video"))
        void syncLocalizedVideoSubtitles(event.target);
    },
    true,
  );
  window.addEventListener("i18n:languageChanged", () => {
    scheduleLocalizedVideoSubtitleSync(document);
  });
}
