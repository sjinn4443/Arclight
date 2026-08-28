import { bumpRefresh } from "./telemetry.js";
import {
  fetchDictionary,
  get,
  applyTranslations,
  setLanguage,
} from "./i18n.js";
import { installSafeConsole } from "./safe-logging.js";

installSafeConsole();

function createEl(tag, className, text) {
  const el = document.createElement(tag);
  if (className) el.className = className;
  if (text != null) el.textContent = text;
  return el;
}

function appendPopupLine(container, label, value) {
  const line = document.createElement("div");
  line.textContent = `${label}: ${value}`;
  container.appendChild(line);
}

// ---------- Map helpers ----------
let worldMap;
let mapMarkers = [];
let uiDict = {};

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

const COUNTRY_CODE_TO_NAME = {
  GB: "United Kingdom",
  UK: "United Kingdom",
  US: "United States",
  USA: "United States",
  KR: "South Korea",
  TZ: "Tanzania",
};

function initWorldMap() {
  const el = document.getElementById("worldMap");
  const mapStatus = document.getElementById("mapStatus");
  if (!el || worldMap) return;
  const leaflet = globalThis.L;
  if (!leaflet) {
    if (mapStatus) mapStatus.textContent = "Map unavailable";
    return;
  }

  worldMap = leaflet
    .map(el, {
      worldCopyJump: true,
      zoomControl: true,
    })
    .setView([15, 0], 2);

  leaflet
    .tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      maxZoom: 6,
      attribution: "&copy; OpenStreetMap contributors",
    })
    .addTo(worldMap);

  mapStatus.textContent = tl("Map ready");
  applyTranslations(mapStatus);
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

  const code = String(countryRaw || "")
    .trim()
    .toUpperCase();
  const isAlphaCode = /^[A-Z]{2,3}$/.test(code);
  if (isAlphaCode) {
    const aliasName = COUNTRY_CODE_TO_NAME[code];
    if (aliasName) {
      const aliasNorm = normaliseCountryName(aliasName);
      if (COUNTRY_CENTROIDS_NORM[aliasNorm]) {
        const ll = COUNTRY_CENTROIDS_NORM[aliasNorm];
        countryLatLngCache.set(norm, ll);
        return ll;
      }
    }
    try {
      const res = await fetch(
        `https://restcountries.com/v3.1/alpha/${encodeURIComponent(code)}?fields=latlng,name,cca2,cca3`,
      );
      if (res.ok) {
        const data = await res.json();
        const row = Array.isArray(data) ? data[0] : data;
        const latlng = row?.latlng;
        if (Array.isArray(latlng) && latlng.length === 2) {
          const ll = [Number(latlng[0]), Number(latlng[1])];
          countryLatLngCache.set(norm, ll);
          if (row?.cca2)
            countryLatLngCache.set(normaliseCountryName(row.cca2), ll);
          if (row?.cca3)
            countryLatLngCache.set(normaliseCountryName(row.cca3), ll);
          if (row?.name?.common) {
            countryLatLngCache.set(normaliseCountryName(row.name.common), ll);
          }
          return ll;
        }
      }
    } catch (e) {
      console.warn("No lat/lng for country code:", countryRaw, e);
    }
  }

  const nameLookups = [
    `https://restcountries.com/v3.1/name/${encodeURIComponent(countryRaw)}?fullText=true&fields=latlng,name,cca2,cca3`,
    `https://restcountries.com/v3.1/name/${encodeURIComponent(countryRaw)}?fields=latlng,name,cca2,cca3`,
  ];
  for (const url of nameLookups) {
    try {
      const res = await fetch(url);
      if (!res.ok) continue;
      const data = await res.json();
      const row = Array.isArray(data) ? data[0] : data;
      const latlng = row?.latlng;
      if (Array.isArray(latlng) && latlng.length === 2) {
        const ll = [Number(latlng[0]), Number(latlng[1])];
        countryLatLngCache.set(norm, ll);
        if (row?.cca2)
          countryLatLngCache.set(normaliseCountryName(row.cca2), ll);
        if (row?.cca3)
          countryLatLngCache.set(normaliseCountryName(row.cca3), ll);
        if (row?.name?.common) {
          countryLatLngCache.set(normaliseCountryName(row.name.common), ll);
        }
        return ll;
      }
    } catch (e) {
      console.warn("No lat/lng for country:", countryRaw, e);
    }
  }

  countryLatLngCache.set(norm, null);
  return null;
}

async function getCountryLatLng(record) {
  const c = (record?.country || "").trim();
  if (!c) return null;
  return await fetchCountryLatLng(c);
}

async function renderWorldPins(users, ipLocations = []) {
  initWorldMap();
  if (!worldMap) return;

  clearMapMarkers();

  const mapStatus = document.getElementById("mapStatus");
  const leaflet = globalThis.L;
  const useIpLocations = ipLocations.length > 0;
  const records = useIpLocations ? ipLocations : users;
  let pinCount = 0;
  const bounds = [];

  const latLngList = await Promise.all(records.map(getCountryLatLng));

  records.forEach((record, idx) => {
    const ll = latLngList[idx];
    if (!ll) return;

    const label = document.createElement("div");
    const nameRow = document.createElement("div");
    const name = document.createElement("strong");
    name.textContent = useIpLocations
      ? record.country || "Visitor country"
      : record.name || "Anonymous";
    nameRow.appendChild(name);
    label.appendChild(nameRow);

    if (useIpLocations) {
      appendPopupLine(label, "Country", record.country || "—");
      appendPopupLine(label, "IP", record.ip || "—");
      appendPopupLine(label, "Last seen", formatWhen(record.ts));
    } else {
      const expEn = englishFromAny(record.experience, englishDict);
      appendPopupLine(label, "Country", record.country || "—");
      appendPopupLine(label, "Area", record.area || "—");
      appendPopupLine(label, "Experience", expEn || "—");
      appendPopupLine(label, "Last seen", formatWhen(record.last_seen));
    }

    const marker = leaflet.marker(ll).addTo(worldMap).bindPopup(label);
    mapMarkers.push(marker);
    bounds.push(ll);
    pinCount += 1;
  });

  worldMap.invalidateSize();
  if (bounds.length === 1) {
    worldMap.setView(bounds[0], 6);
  } else if (bounds.length > 1) {
    worldMap.fitBounds(leaflet.latLngBounds(bounds), {
      padding: [24, 24],
      maxZoom: 6,
    });
  }

  mapStatus.textContent = pinCount
    ? useIpLocations
      ? `Showing ${pinCount} unique visitor location${pinCount === 1 ? "" : "s"}`
      : `Showing ${pinCount} pinned user${pinCount === 1 ? "" : "s"}`
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
  "lo",
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

function t(path, fallback = "") {
  const translated = get(uiDict, path) ?? get(englishDict, path);
  return translated == null ? fallback : String(translated);
}

function tl(raw, fallback = raw) {
  const translated =
    get(uiDict, `i18nLiteral.${raw}`) ?? get(englishDict, `i18nLiteral.${raw}`);
  return translated == null ? fallback : String(translated);
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
  const users = await res.json();
  return {
    users,
    canDelete: res.headers.get("X-Reports-Delete-Enabled") === "1",
  };
}

async function fetchIpLocations() {
  const res = await fetch("/api/dev/ip-locations", {
    credentials: "same-origin",
  });
  if (res.status === 401)
    throw new Error("401 unauthorised — enter the dev password");
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  return await res.json();
}

let englishDict = {};

async function loadEnglishDictionary() {
  const lang = getLocalPrefLang();
  englishDict = await fetchDictionary("en");
  uiDict = await fetchDictionary(lang);
  await buildReverseIndex();
  await setLanguage(lang);
  applyTranslations(document.body);
}

function formatWhen(value) {
  if (!value) return "—";
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return "—";
  return d.toLocaleString(undefined, {
    year: "numeric",
    month: "short",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  });
}

async function renderUsers(users, canDelete = false, ipLocations = []) {
  const sorted = [...users].sort(
    (a, b) =>
      new Date(b.last_seen || b.first_seen) -
      new Date(a.last_seen || a.first_seen),
  );

  renderStats(sorted, ipLocations);

  // Render columns based on the actual table headers so /reports.html and
  // /html/reports.html can diverge safely.
  const table = document.getElementById("users");
  const headers = [...table.querySelectorAll("thead th")].map((th) => {
    const stableKey = String(th.dataset.col || "")
      .trim()
      .toLowerCase();
    if (stableKey) return stableKey;
    return String(th.textContent || "")
      .trim()
      .toLowerCase();
  });

  const hasDeleteCol = headers.includes("delete");

  const tbody = document.querySelector("#users tbody");
  const status = document.getElementById("status");
  if (!tbody) return;
  tbody.textContent = "";

  const frag = document.createDocumentFragment();
  for (let i = 0; i < sorted.length; i++) {
    const u = sorted[i];

    const aimsEn = englishFromAny(u.aims, englishDict);
    const interestEn = englishFromAny(u.interest, englishDict);
    const expEn = englishFromAny(u.experience, englishDict);

    const arclightOrArea = u.arclight ?? u.area;

    const tr = document.createElement("tr");
    tr.dataset.anonId = u.anon_id || "";

    headers.forEach((h) => {
      const td = document.createElement("td");
      switch (h) {
        case "no.":
        case "no":
          td.textContent = String(i + 1);
          break;
        case "name":
          td.textContent = u.name || "—";
          break;
        case "aims":
        case "professional_group":
        case "professional group":
          td.textContent = aimsEn;
          break;
        case "interest":
          td.textContent = interestEn;
          break;
        case "experience":
          td.textContent = expEn;
          break;
        case "arclight":
        case "area":
          td.textContent = arclightOrArea || "—";
          break;
        case "contact":
          td.textContent = u.contact || "—";
          break;
        case "country":
          td.textContent = u.country || "—";
          break;
        case "language":
          td.textContent = u.language || "—";
          break;
        case "refresh_count":
        case "refresh count":
          td.textContent =
            typeof u.refresh_count === "number" ? String(u.refresh_count) : "0";
          break;
        case "when":
        case "last active":
          td.textContent = formatWhen(u.last_seen || u.first_seen);
          break;
        case "first seen":
          td.textContent = formatWhen(u.first_seen);
          break;
        case "last seen":
          td.textContent = formatWhen(u.last_seen);
          break;
        case "delete": {
          if (canDelete) {
            const btn = document.createElement("button");
            btn.type = "button";
            btn.className = "deleteBtn";
            btn.title = tl("Delete user");
            btn.setAttribute("aria-label", tl("Delete user"));
            btn.dataset.anonId = u.anon_id || "";
            btn.dataset.name = u.name || "—";
            btn.dataset.exp = expEn;
            btn.dataset.country = u.country || "—";
            btn.textContent = "\u{1F5D1}\uFE0F";
            td.appendChild(btn);
          } else {
            td.textContent = "-";
          }
          break;
        }
        default:
          td.textContent = "—";
      }

      tr.appendChild(td);
    });

    frag.appendChild(tr);
  }

  tbody.appendChild(frag);
  status.textContent = `${sorted.length} ${tl("records")}`;

  // Wire delete buttons only when the column exists.
  if (hasDeleteCol && canDelete) {
    tbody.onclick = async (e) => {
      const btn = e.target.closest(".deleteBtn");
      if (!btn) return;

      const anonId = btn.dataset.anonId;
      const name = btn.dataset.name;
      const exp = btn.dataset.exp;
      const ok = window.confirm(
        `${tl("Delete user")}?\n\n` +
          `${t("onboarding.username_label", "Name")}: ${name}\n` +
          `${t("onboarding.experience_label", "Experience")}: ${exp}`,
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
        status.textContent = `${remaining} ${tl("records")}`;
      } catch (err) {
        console.error(err);
        alert(String(err.message || ""));
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
    const [{ users, canDelete }, ipLocations] = await Promise.all([
      fetchUsers(),
      fetchIpLocations().catch((error) => {
        console.warn(
          "IP locations unavailable; using profile locations",
          error,
        );
        return [];
      }),
    ]);
    await renderUsers(users, canDelete, ipLocations);
    await renderWorldPins(users, ipLocations);
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
  return [...m.entries()]
    .sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0]))
    .slice(0, topN);
}

function _metricValues(users, field) {
  return users.flatMap((user) => {
    const translated = englishFromAny(user[field], englishDict);
    if (!translated || translated === "—") return [];
    return translated
      .split(/[;,|\n]/)
      .map((value) => value.trim())
      .filter(Boolean);
  });
}

function _renderList(id, entries) {
  const el = document.getElementById(id);
  if (!el) return;
  if (!entries.length) {
    el.textContent = tl("No data");
    return;
  }
  el.textContent = "";
  const frag = document.createDocumentFragment();
  entries.forEach(([k, c]) => {
    const row = createEl("div", "kv");
    row.appendChild(createEl("span", "", k));
    row.appendChild(createEl("span", "", String(c)));
    frag.appendChild(row);
  });
  el.appendChild(frag);
}

function renderStats(users, ipLocations = []) {
  const aimsTop = _countTop(_metricValues(users, "aims"), 5);
  const interestTop = _countTop(_metricValues(users, "interest"), 5);
  const expTop = _countTop(_metricValues(users, "experience"), 5);
  const countryAreaTop = _countTop(
    (ipLocations.length ? ipLocations : users).map((row) => row.country),
    8,
  );
  const langTop = _countTop(
    users.map((u) => u.language),
    6,
  );

  renderBarChart(document.getElementById("statsAims"), aimsTop, {
    maxItems: 5,
  });
  renderBarChart(document.getElementById("statsInterest"), interestTop, {
    maxItems: 5,
  });
  renderBarChart(document.getElementById("statsExperience"), expTop, {
    maxItems: 5,
  });
  renderBarChart(document.getElementById("statsCountryArea"), countryAreaTop, {
    maxItems: 8,
  });
  renderDonut(document.getElementById("statsLanguage"), langTop, {
    maxItems: 6,
    title: "records",
  });
  renderRefreshKpis(document.getElementById("statsRefresh"), users);
}

function renderBarChart(
  el,
  entries,
  { maxItems = 6, emptyText = "No data" } = {},
) {
  if (!el) return;
  if (!entries || !entries.length) {
    el.textContent = emptyText === "No data" ? tl("No data") : emptyText;
    return;
  }

  const top = entries.slice(0, maxItems);
  const max = Math.max(...top.map(([, c]) => c), 1);

  el.textContent = "";
  const chart = createEl("div", "statChart");

  top.forEach(([label, count]) => {
    const pct = Math.round((count / max) * 100);
    const item = document.createElement("div");

    const row = createEl("div", "barRow");
    const labelEl = createEl("div", "barLabel", label);
    labelEl.title = label;
    const valueEl = createEl("div", "barValue", String(count));
    row.appendChild(labelEl);
    row.appendChild(valueEl);

    const track = createEl("div", "barTrack");
    const fill = createEl("div", "barFill");
    fill.style.width = `${pct}%`;
    track.appendChild(fill);

    item.appendChild(row);
    item.appendChild(track);
    chart.appendChild(item);
  });

  el.appendChild(chart);
}

function renderDonut(el, entries, { maxItems = 6, title = "Total" } = {}) {
  if (!el) return;
  if (!entries || !entries.length) {
    el.textContent = tl("No data");
    return;
  }

  const top = entries.slice(0, maxItems);
  const total = top.reduce((a, [, c]) => a + c, 0) || 1;

  // simple grayscale palette
  const colours = ["#111", "#444", "#666", "#888", "#aaa", "#ccc"];

  let acc = 0;
  const stops = top
    .map(([, c], i) => {
      const start = acc;
      acc += (c / total) * 100;
      return `${colours[i % colours.length]} ${start.toFixed(2)}% ${acc.toFixed(2)}%`;
    })
    .join(", ");

  el.textContent = "";
  const wrap = createEl("div", "donutWrap");
  const donut = createEl("div", "donut");
  donut.style.background = `conic-gradient(${stops})`;

  const center = createEl("div", "donutCenter");
  const centerInner = document.createElement("div");
  const totalEl = document.createElement("strong");
  totalEl.textContent = String(total);
  centerInner.appendChild(totalEl);
  centerInner.appendChild(document.createElement("br"));
  centerInner.appendChild(document.createTextNode(tl(title, title)));
  center.appendChild(centerInner);
  donut.appendChild(center);

  const legend = createEl("div", "legend");
  top.forEach(([label, c], i) => {
    const item = createEl("div", "legendItem");
    const swatch = createEl("div", "legendSwatch");
    swatch.style.background = colours[i % colours.length];
    const labelEl = document.createElement("div");
    labelEl.title = label;
    labelEl.textContent = label;
    const countEl = document.createElement("div");
    countEl.textContent = String(c);
    item.appendChild(swatch);
    item.appendChild(labelEl);
    item.appendChild(countEl);
    legend.appendChild(item);
  });

  wrap.appendChild(donut);
  wrap.appendChild(legend);
  el.appendChild(wrap);
}

function renderRefreshKpis(el, users) {
  if (!el) return;

  const nums = users
    .map((u) => Number(u.refresh_count ?? 0))
    .filter((n) => Number.isFinite(n));
  const total = nums.reduce((a, b) => a + b, 0);
  const avg = nums.length ? total / nums.length : 0;
  const max = nums.length ? Math.max(...nums) : 0;

  el.textContent = "";
  const grid = createEl("div", "kpiGrid");
  const kpis = [
    ["Total refresh", String(total)],
    ["Average per user", avg.toFixed(1)],
    ["Max (single user)", String(max)],
  ];
  kpis.forEach(([label, value]) => {
    const kpi = createEl("div", "kpi");
    kpi.appendChild(createEl("div", "kpiLabel", label));
    kpi.appendChild(createEl("div", "kpiValue", value));
    grid.appendChild(kpi);
  });
  el.appendChild(grid);
}
