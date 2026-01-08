import { bumpRefresh } from "./telemetry.js";
import {
  fetchDictionary,
  get,
  applyTranslations,
  setLanguage,
} from "./i18n.js";

function escapeHtml(s) {
  return String(s ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

// ---------- Map helpers ----------
let worldMap;
let mapMarkers = [];

// Minimal country centroid fallback (extend as needed)
const COUNTRY_CENTROIDS = {
  "United Kingdom": [55.3781, -3.436],
  UK: [55.3781, -3.436],
  England: [52.3555, -1.1743],
  Scotland: [56.4907, -4.2026],
  Wales: [52.1307, -3.7837],
  "Northern Ireland": [54.7877, -6.4923],
  "United States": [39.8283, -98.5795],
  USA: [39.8283, -98.5795],
  Canada: [56.1304, -106.3468],
  Brazil: [-14.235, -51.9253],
  India: [20.5937, 78.9629],
  China: [35.8617, 104.1954],
  Japan: [36.2048, 138.2529],
  Korea: [36.5, 127.8],
  "South Korea": [36.5, 127.8],
  Kenya: [-0.0236, 37.9062],
  Nigeria: [9.082, 8.6753],
  "South Africa": [-30.5595, 22.9375],
  Australia: [-25.2744, 133.7751],
  Germany: [51.1657, 10.4515],
  France: [46.2276, 2.2137],
  Spain: [40.4637, -3.7492],
  Italy: [41.8719, 12.5674],
  // add more as your data needs
};

function initWorldMap() {
  const el = document.getElementById("worldMap");
  const mapStatus = document.getElementById("mapStatus");
  if (!el || worldMap) return;

  worldMap = L.map(el, {
    worldCopyJump: true,
    zoomControl: true,
  }).setView([15, 0], 2);

  L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
    maxZoom: 6,
    attribution: "&copy; OpenStreetMap contributors",
  }).addTo(worldMap);

  mapStatus.textContent = "Map ready";
}

function clearMapMarkers() {
  mapMarkers.forEach((m) => m.remove());
  mapMarkers = [];
}

// ---------- Country → lat/lng (with caching) ----------
const countryLatLngCache = new Map();

// country 이름 정규화
function normaliseCountryName(c) {
  return String(c || "")
    .trim()
    .replace(/\s+/g, " ")
    .replace(/^the\s+/i, "")
    .toLowerCase();
}

const COUNTRY_CENTROIDS_NORM = Object.fromEntries(
  Object.entries(COUNTRY_CENTROIDS).map(([k, v]) => [
    normaliseCountryName(k),
    v,
  ]),
);

async function fetchCountryLatLng(countryRaw) {
  const norm = normaliseCountryName(countryRaw);
  if (!norm) return null;

  if (countryLatLngCache.has(norm)) return countryLatLngCache.get(norm);

  if (COUNTRY_CENTROIDS_NORM[norm]) {
    const ll = COUNTRY_CENTROIDS_NORM[norm];
    countryLatLngCache.set(norm, ll);
    return ll;
  }

  try {
    const res = await fetch(
      `https://restcountries.com/v3.1/name/${encodeURIComponent(countryRaw)}?fields=latlng,name`,
    );
    if (!res.ok) throw new Error("Country lookup failed");

    const data = await res.json();
    const latlng = data?.[0]?.latlng;

    if (Array.isArray(latlng) && latlng.length === 2) {
      const ll = [Number(latlng[0]), Number(latlng[1])];
      countryLatLngCache.set(norm, ll);
      return ll;
    }
  } catch (e) {
    console.warn("No lat/lng for country:", countryRaw, e);
  }

  countryLatLngCache.set(norm, null);
  return null;
}

async function getLatLngFromUser(u) {
  const lat = u.lat ?? u.latitude ?? u.location?.lat ?? u.location?.latitude;
  const lng =
    u.lng ??
    u.lon ??
    u.longitude ??
    u.location?.lng ??
    u.location?.lon ??
    u.location?.longitude;

  if (Number.isFinite(lat) && Number.isFinite(lng)) {
    return [Number(lat), Number(lng)];
  }

  const c = (u.country || "").trim();
  if (!c) return null;
  return await fetchCountryLatLng(c);
}

async function renderWorldPins(users) {
  initWorldMap();
  if (!worldMap) return;

  clearMapMarkers();

  const mapStatus = document.getElementById("mapStatus");
  let pinCount = 0;

  const latLngList = await Promise.all(users.map((u) => getLatLngFromUser(u)));

  users.forEach((u, idx) => {
    const ll = latLngList[idx];
    if (!ll) return;

    const label = `<strong>${escapeHtml(u.name || "Anonymous")}</strong><br>
    Country: ${escapeHtml(u.country || "—")}<br>
    Area: ${escapeHtml(u.area || "—")}<br>
    Experience: ${escapeHtml(expEn || "—")}`;
    const marker = L.marker(ll).addTo(worldMap).bindPopup(label);
    mapMarkers.push(marker);
    pinCount += 1;
  });

  mapStatus.textContent = pinCount
    ? `Showing ${pinCount} pinned user${pinCount === 1 ? "" : "s"}`
    : "No locations available to pin";
}

const REVERSE = new Map();

function flat(obj, p = "", out = {}) {
  for (const [k, v] of Object.entries(obj || {})) {
    const path = p ? `${p}.${k}` : k;
    if (v && typeof v === "object") flat(v, path, out);
    else out[path] = v;
  }
  return out;
}

const LANGS = [
  "en",
  "am",
  "ar",
  "bn",
  "ny",
  "zh",
  "fr",
  "ha",
  "hi",
  "ig",
  "id",
  "rw",
  "ko",
  "ln",
  "fa",
  "pt",
  "sn",
  "es",
  "sw",
  "ur",
  "yo",
  "zu",
];

async function buildReverseIndex() {
  const dicts = await Promise.all(LANGS.map((l) => fetchDictionary(l)));
  dicts.forEach((dict) => {
    const f = flat(dict);
    for (const [key, label] of Object.entries(f)) {
      if (label) {
        const s = String(label).trim();
        const norm = s.toLowerCase();
        if (norm && !REVERSE.has(norm)) REVERSE.set(norm, key);
      }
    }
  });
}

// Change all toe English
function englishFromAny(value, englishDict) {
  if (!value) return "—";

  const raw = String(value).trim();
  if (!raw) return "—";

  // 1) If the whole string is an i18n key, translate directly
  const fromKey = get(englishDict, raw);
  if (fromKey != null) return fromKey;

  // 2) If the whole string is a known label in any language, translate
  const wholeKey = REVERSE.get(raw.toLowerCase());
  if (wholeKey) {
    const en = get(englishDict, wholeKey);
    if (en != null) return en;
  }

  // 3) Otherwise treat it as a list or free text.
  // Split on commas/semicolons/newlines, translate each known token,
  // keep unknown tokens as-is.
  const parts = raw
    .split(/[;,|\n]/)
    .map((p) => p.trim())
    .filter(Boolean);

  if (parts.length <= 1) {
    // Free text: keep original, do not blank it out
    return raw;
  }

  const translated = parts.map((p) => {
    const k1 = get(englishDict, p);
    if (k1 != null) return k1;

    const k2 = REVERSE.get(p.toLowerCase());
    if (k2) {
      const en = get(englishDict, k2);
      if (en != null) return en;
    }

    // Unknown chunk: keep what the user typed
    return p;
  });

  return translated.join(", ");
}

function getLocalAnonId() {
  const KEY = "arclight_anon_id";
  let id = localStorage.getItem(KEY);
  if (!id) {
    // same algo as telemetry.js
    id = ([1e7] + -1e3 + -4e3 + -8e3 + -1e11).replace(/[018]/g, (c) =>
      (
        c ^
        (crypto.getRandomValues(new Uint8Array(1))[0] & (15 >> (c / 4)))
      ).toString(16),
    );
    localStorage.setItem(KEY, id);
  }
  return id;
}

async function deleteUser(anonId) {
  if (!anonId) throw new Error("Missing anon_id");

  const res = await fetch(`/api/dev/users/${encodeURIComponent(anonId)}`, {
    method: "DELETE",
    credentials: "same-origin",
    headers: {
      "Content-Type": "application/json",
      // If your CSRF middleware requires a token, expose it as window.csrfToken
      // or adapt this header to your setup.
      "X-CSRF-Token": window.csrfToken || "",
    },
  });

  if (res.status === 401)
    throw new Error("401 unauthorised — enter the dev password");
  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new Error(text || `HTTP ${res.status}`);
  }
  return true;
}

function getLocalPrefLang() {
  return localStorage.getItem("prefLang") || "en";
}

async function fetchUsers() {
  const res = await fetch("/api/dev/users", { credentials: "same-origin" });
  if (res.status === 401)
    throw new Error("401 unauthorised — enter the dev password");
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  return res.json();
}

let englishDict = {};

async function loadEnglishDictionary() {
  // Force the language to English for the dev dashboard
  await setLanguage("en");
  englishDict = await fetchDictionary("en");
  await buildReverseIndex();
  applyTranslations(document.body);
}

async function renderUsers(users) {
  const sorted = [...users].sort(
    (a, b) => new Date(a.first_seen) - new Date(b.first_seen),
  );

  renderStats(sorted);

  // Render columns based on the actual table headers so /reports.html and
  // /html/reports.html can diverge safely.
  const table = document.getElementById("users");
  const headers = [...table.querySelectorAll("thead th")].map((th) =>
    String(th.textContent || "")
      .trim()
      .toLowerCase(),
  );

  const hasDeleteCol = headers.includes("delete");

  const rows = [];
  for (let i = 0; i < sorted.length; i++) {
    const u = sorted[i];

    const aimsEn = englishFromAny(u.aims, englishDict);
    const interestEn = englishFromAny(u.interest, englishDict);
    const expEn = englishFromAny(u.experience, englishDict);

    const arclightOrArea = u.arclight ?? u.area;

    const cells = headers
      .map((h) => {
        switch (h) {
          case "no.":
          case "no":
            return `<td>${i + 1}</td>`;
          case "name":
            return `<td>${escapeHtml(u.name || "—")}</td>`;
          case "aims":
          case "professional group":
            return `<td>${escapeHtml(aimsEn)}</td>`;
          case "interest":
            return `<td>${escapeHtml(interestEn)}</td>`;
          case "experience":
            return `<td>${escapeHtml(expEn)}</td>`;
          case "arclight":
          case "area":
            return `<td>${escapeHtml(arclightOrArea || "—")}</td>`;
          case "contact":
            return `<td>${escapeHtml(u.contact || "—")}</td>`;
          case "country":
            return `<td>${escapeHtml(u.country || "—")}</td>`;
          case "language":
            return `<td>${escapeHtml(u.language || "—")}</td>`;
          case "refresh count":
            return `<td>${typeof u.refresh_count === "number" ? u.refresh_count : 0}</td>`;
          case "delete":
            return `
              <td>
                <button
                  type="button"
                  class="deleteBtn"
                  title="Delete user"
                  aria-label="Delete user"
                  data-anon-id="${escapeHtml(u.anon_id || "")}"
                  data-name="${escapeHtml(u.name || "—")}"
                  data-exp="${escapeHtml(expEn)}"
                  data-country="${escapeHtml(u.country || "—")}"
                >🗑️</button>
              </td>
            `;
          default:
            // Unknown/unsupported header label: keep table shape consistent.
            return `<td>—</td>`;
        }
      })
      .join("");

    rows.push(
      `<tr data-anon-id="${escapeHtml(u.anon_id || "")}">${cells}</tr>`,
    );
  }

  const tbody = document.querySelector("#users tbody");
  const status = document.getElementById("status");
  tbody.innerHTML = rows.join("");
  status.textContent = `Loaded ${sorted.length} row${
    sorted.length === 1 ? "" : "s"
  }`;

  // Now call renderWorldPins() after users load
  await renderWorldPins(sorted);

  // Wire delete buttons only when the column exists.
  if (hasDeleteCol) {
    tbody.onclick = async (e) => {
      const btn = e.target.closest(".deleteBtn");
      if (!btn) return;

      const anonId = btn.dataset.anonId;
      const name = btn.dataset.name;
      const exp = btn.dataset.exp;
      const country = btn.dataset.country;

      const ok = window.confirm(
        `Do you really want to delete this user data?\n\n` +
          `Name: ${name}\n` +
          `Experience: ${exp}\n` +
          `Country: ${country}`,
      );

      if (!ok) return;

      try {
        btn.disabled = true;
        await deleteUser(anonId);

        // Remove row immediately for snappy UX
        const tr = btn.closest("tr");
        tr?.remove();

        // Update status count
        const remaining = tbody.querySelectorAll("tr").length;
        status.textContent = `Loaded ${remaining} row${
          remaining === 1 ? "" : "s"
        }`;
      } catch (err) {
        console.error(err);
        alert(`Delete failed: ${err.message}`);
        btn.disabled = false;
      }
    };
  } else {
    tbody.onclick = null;
  }
}

async function load() {
  const status = document.getElementById("status");
  try {
    await renderUsers(await fetchUsers());
  } catch (err) {
    console.error(err);
    status.textContent = err.message;
  }
}

document.getElementById("refreshBtn").addEventListener("click", load);

// Optional: keep counting dashboard visits
bumpRefresh().catch(() => {});

(async () => {
  await loadEnglishDictionary();
  load();
})();

// Listen for location updates and refresh the dashboard
document.addEventListener("location:updated", () => {
  // Add a small delay to allow backend to process location update before refetching
  setTimeout(load, 500); // 500ms delay
});

document.addEventListener("telemetry:refreshed", () => {
  load();
});

document.addEventListener("language:updated", () => {
  // Give the backend a moment to write before refetching
  setTimeout(load, 500);
});

function _norm(v) {
  return String(v ?? "").trim();
}

function _countTop(values, topN = 6) {
  const m = new Map();
  for (const v of values) {
    const k = _norm(v);
    if (!k) continue;
    m.set(k, (m.get(k) || 0) + 1);
  }
  return [...m.entries()].sort((a, b) => b[1] - a[1]).slice(0, topN);
}

function _renderList(id, entries) {
  const el = document.getElementById(id);
  if (!el) return;
  if (!entries.length) {
    el.textContent = "No data";
    return;
  }
  el.innerHTML = entries
    .map(
      ([k, c]) =>
        `<div class="kv"><span>${escapeHtml(k)}</span><span>${c}</span></div>`,
    )
    .join("");
}

function renderStats(users) {
  // DEMO: 데이터가 적으면 가짜 레코드를 섞어서 통계가 “보이게”
  const demo =
    users.length >= 10
      ? []
      : [
          {
            interest: "Eyes",
            experience: "Student",
            country: "Kenya",
            area: "Nairobi",
            language: "en",
            refresh_count: 5,
          },
          {
            interest: "Ears",
            experience: "Nurse",
            country: "India",
            area: "Karnataka",
            language: "hi",
            refresh_count: 9,
          },
          {
            interest: "Teach",
            experience: "Community health worker",
            country: "Nigeria",
            area: "Lagos",
            language: "yo",
            refresh_count: 7,
          },
          {
            interest: "Eyes",
            experience: "Doctor",
            country: "Brazil",
            area: "Bahia",
            language: "pt",
            refresh_count: 4,
          },
        ];

  const all = [...users, ...demo];

  _renderList(
    "statsInterest",
    _countTop(all.map((u) => u.interest_en || u.interest)),
  );
  _renderList(
    "statsExperience",
    _countTop(all.map((u) => u.experience_en || u.experience)),
  );
  _renderList(
    "statsCountryArea",
    _countTop(
      all.map((u) => {
        const c = _norm(u.country);
        const a = _norm(u.area);
        return a ? `${c} — ${a}` : c;
      }),
    ),
  );
  _renderList("statsLanguage", _countTop(all.map((u) => u.language)));

  const refreshNums = all
    .map((u) => Number(u.refresh_count ?? 0))
    .filter((n) => Number.isFinite(n));

  const total = refreshNums.reduce((a, b) => a + b, 0);
  const avg = refreshNums.length ? total / refreshNums.length : 0;

  const el = document.getElementById("statsRefresh");
  if (el) {
    el.innerHTML = `
      <div class="kv"><span>Total</span><span>${total}</span></div>
      <div class="kv"><span>Average per user</span><span>${avg.toFixed(1)}</span></div>
    `;
  }
}
