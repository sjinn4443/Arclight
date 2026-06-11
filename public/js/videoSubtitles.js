const APP_VIDEO_SUBTITLE_CATALOG_URL =
  "/video-localization/app-video-subtitles.json";

const APP_VIDEO_SUBTITLE_LANGUAGES = {
  en: { label: "English" },
  am: { label: "Amharic" },
  ar: { label: "Arabic" },
  bn: { label: "Bangla" },
  ne: { label: "Nepali" },
  ny: { label: "Chichewa" },
  zh: { label: "Chinese" },
  fr: { label: "French" },
  ha: { label: "Hausa" },
  hi: { label: "Hindi" },
  ig: { label: "Igbo" },
  id: { label: "Indonesian" },
  rw: { label: "Kinyarwanda" },
  ko: { label: "Korean" },
  ln: { label: "Lingala" },
  fa: { label: "Persian" },
  pt: { label: "Portuguese" },
  sn: { label: "Shona" },
  es: { label: "Spanish" },
  sw: { label: "Swahili" },
  te: { label: "Telugu" },
  ur: { label: "Urdu" },
  yo: { label: "Yoruba" },
  zu: { label: "Zulu" },
};

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
  persian: "fa",
  portuguese: "pt",
  shona: "sn",
  spanish: "es",
  swahili: "sw",
  urdu: "ur",
  yoruba: "yo",
  zulu: "zu",
});

let appVideoSubtitleCatalogPromise = null;
let appVideoSubtitleInitialized = false;
let appVideoSubtitleResyncTimer = 0;

function normalizeAppVideoSubtitleLanguage(lang) {
  const normalized = String(lang || "")
    .trim()
    .toLowerCase();
  const aliased = APP_VIDEO_LANGUAGE_ALIASES[normalized] || normalized;
  return Object.prototype.hasOwnProperty.call(
    APP_VIDEO_SUBTITLE_LANGUAGES,
    aliased,
  )
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
  return (
    APP_VIDEO_SUBTITLE_LANGUAGES[normalizeAppVideoSubtitleLanguage(lang)]
      ?.label || "English"
  );
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
    video.currentSrc,
    video.getAttribute("src"),
    ...Array.from(video.querySelectorAll("source")).map((source) =>
      source.getAttribute("src"),
    ),
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
    if (video.querySelector("track[data-childhood-pilot-subtitle='true']")) {
      removeAppVideoSubtitleTracks(video);
      return;
    }

    const sources = collectVideoSources(video);
    const source = sources.find((candidate) => catalog[candidate]);
    if (!source) return;

    const resolved = resolveSubtitleSource(catalog[source], preferredLang);
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
  window.addEventListener("i18n:languageChanged", () => {
    scheduleLocalizedVideoSubtitleSync(document);
  });
}
