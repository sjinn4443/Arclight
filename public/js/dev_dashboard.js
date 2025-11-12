import { bumpRefresh } from "./telemetry.js";
import { fetchDictionary, get } from "./i18n.js";

// Cache per-language dictionaries for reverse lookups
const dictCache = new Map();
async function getDict(lang) {
  if (!lang) return {};
  if (!dictCache.has(lang)) dictCache.set(lang, fetchDictionary(lang));
  return await dictCache.get(lang);
}

// Flatten nested dict -> { "a.b.c": "Label", ... }
function flattenDict(obj, prefix = "", out = {}) {
  for (const [k, v] of Object.entries(obj || {})) {
    const path = prefix ? `${prefix}.${k}` : k;
    if (v && typeof v === "object") flattenDict(v, path, out);
    else out[path] = v;
  }
  return out;
}

/**
 * Turn any stored value into an English label:
 * - If it's an i18n key, read English directly.
 * - Otherwise, treat it as a translated literal in the user's language,
 *   find the key via reverse lookup, then show the English string.
 */
async function englishLabelFor(value, userLang) {
  if (!value) return "—";

  // Try as key
  const direct = get(englishDict, value);
  if (direct != null) return direct;

  // Legacy: it's a literal in userLang → find its key then show English
  const langDict = await getDict(userLang);
  const flat = flattenDict(langDict);
  const hit = Object.entries(flat).find(([, label]) => label === value);
  if (hit) {
    const key = hit[0];
    const en = get(englishDict, key);
    if (en != null) return en;
  }

  // Fallback: show original
  return value;
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
  englishDict = await fetchDictionary("en");
}

async function renderUsers(users) {
  const sorted = [...users].sort(
    (a, b) => new Date(a.first_seen) - new Date(b.first_seen),
  );

  // Prefer the browser's local language for "me" so you see changes instantly
  const me = sorted.find((u) => u.anon_id && u.anon_id === getLocalAnonId());
  if (me) {
    const localLang = getLocalPrefLang();
    if (localLang && localLang !== (me.language || "en")) {
      me.language = localLang;
    }
  }

  const rows = [];
  for (let i = 0; i < sorted.length; i++) {
    const u = sorted[i];

    const aimsEn = await englishLabelFor(u.aims, u.language);
    const interestEn = await englishLabelFor(u.interest, u.language);
    const expEn = await englishLabelFor(u.experience, u.language);

    // Keep data-i18n attribute only when the value is actually a key
    const aimsKey = get(englishDict, u.aims || "") != null ? u.aims : null;
    const interestKey =
      get(englishDict, u.interest || "") != null ? u.interest : null;
    const expKey =
      get(englishDict, u.experience || "") != null ? u.experience : null;

    rows.push(`
      <tr>
        <td>${i + 1}</td>
        <td>${u.name || "—"}</td>
        <td ${aimsKey ? `data-i18n="${aimsKey}"` : ""}>${aimsEn}</td>
        <td ${interestKey ? `data-i18n="${interestKey}"` : ""}>${interestEn}</td>
        <td ${expKey ? `data-i18n="${expKey}"` : ""}>${expEn}</td>
        <td>${u.contact || "—"}</td>
        <td>${u.country || "—"}</td>
        <td>${u.area || "—"}</td>
        <td>${u.language || "—"}</td>
        <td>${typeof u.refresh_count === "number" ? u.refresh_count : 0}</td>
      </tr>
    `);
  }

  const tbody = document.querySelector("#users tbody");
  const status = document.getElementById("status");
  tbody.innerHTML = rows.join("");
  status.textContent = `Loaded ${sorted.length} row${sorted.length === 1 ? "" : "s"}`;
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

// Add this to refresh as soon as the telemetry POST completes
document.addEventListener("telemetry:refreshed", () => {
  load();
});

document.addEventListener("language:updated", () => {
  // Give the backend a moment to write before refetching
  setTimeout(load, 500);
});
