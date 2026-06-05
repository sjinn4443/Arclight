const fs = require("fs");
const path = require("path");
const { enrichIp } = require("../utils/ipEnricher.cjs");
const { encrypt, decrypt } = require("../reports/security/encrypt.cjs"); // Import encryption module
const { logServerError } = require("../security/safe-logging.cjs");

const dataDir = path.join(__dirname, "..", "reports", "data");
const file = path.join(dataDir, "telemetry.ndjson");

function ensureDir() {
  if (!fs.existsSync(dataDir)) fs.mkdirSync(dataDir, { recursive: true });
}
function writeLine(obj) {
  ensureDir();
  try {
    const encryptedData = encrypt(JSON.stringify(obj)); // Encrypt the data
    fs.appendFileSync(file, encryptedData + "\n", "utf8");
  } catch (e) {
    logServerError("Failed to write to telemetry.ndjson", e);
    throw e; // Re-throw to propagate the error to the caller
  }
}

async function init() {
  ensureDir();
}

function toFiniteNumber(v) {
  const n = Number(v);
  return Number.isFinite(n) ? n : null;
}

function pickGeoField(f, key) {
  if (!f || typeof f !== "object") return null;
  const geo = f.geo && typeof f.geo === "object" ? f.geo : null;
  if (!geo) return null;
  return geo[key] ?? null;
}

async function saveProfile(f) {
  f = f || {};
  const anon = (f.anon_id || "").toString().slice(0, 80);
  const uid = (f.user_id || f.email || "").toString().slice(0, 120); // may be empty
  // If no identifier is present, we cannot log this event.
  // This might happen if localStorage is unavailable or cleared unexpectedly.
  if (!anon && !uid) {
    console.warn("Skipping telemetry event: no identifier found.");
    return;
  }

  writeLine({
    type: "profile",
    ts: new Date().toISOString(),
    anon_id: anon || null,
    user_id: uid || null,
    name: f.name ?? null,
    aims: f.aims ?? null,
    interest: f.interest ?? null,
    experience: f.experience ?? null,
    contact: f.contact ?? null,
    country: f.country ?? pickGeoField(f, "country") ?? null,
    area: f.area ?? pickGeoField(f, "area") ?? pickGeoField(f, "city") ?? null,
    language: f.language ?? pickGeoField(f, "language") ?? null,
    lat: toFiniteNumber(f.lat ?? f.latitude ?? pickGeoField(f, "lat")) ?? null,
    lon:
      toFiniteNumber(
        f.lon ??
          f.lng ??
          f.longitude ??
          pickGeoField(f, "lon") ??
          pickGeoField(f, "lng") ??
          pickGeoField(f, "longitude"),
      ) ?? null,
  });
}

async function bumpRefresh(f) {
  f = f || {};
  const anon = (f.anon_id || "").toString().slice(0, 80);
  const uid = (f.user_id || f.email || "").toString().slice(0, 120);
  // If no identifier is present, we cannot log this event.
  // This might happen if localStorage is unavailable or cleared unexpectedly.
  if (!anon && !uid) {
    console.warn("Skipping telemetry event: no identifier found.");
    return;
  }

  writeLine({
    type: "refresh",
    ts: new Date().toISOString(),
    anon_id: anon || null,
    user_id: uid || null,
    reason: f.reason ?? null,
    country: f.country ?? pickGeoField(f, "country") ?? null,
    area: f.area ?? pickGeoField(f, "area") ?? pickGeoField(f, "city") ?? null,
    language: f.language ?? pickGeoField(f, "language") ?? null,
    lat: toFiniteNumber(f.lat ?? f.latitude ?? pickGeoField(f, "lat")) ?? null,
    lon:
      toFiniteNumber(
        f.lon ??
          f.lng ??
          f.longitude ??
          pickGeoField(f, "lon") ??
          pickGeoField(f, "lng") ??
          pickGeoField(f, "longitude"),
      ) ?? null,
  });
}

// helper: choose a stable key per row
function keyOf(r) {
  return r.user_id || r.email || r.anon_id;
}

function parseLine(line) {
  let decryptedLine;
  try {
    decryptedLine = decrypt(line);
  } catch (e) {
    logServerError("Failed to decrypt telemetry line", e);
    return null;
  }

  try {
    return JSON.parse(decryptedLine);
  } catch {
    return null;
  }
}

async function getUsersForDashboard() {
  if (!fs.existsSync(file)) return [];
  const lines = fs.readFileSync(file, "utf8").split(/\r?\n/).filter(Boolean);

  const map = new Map(); // key -> row
  for (const encryptedLine of lines) {
    const r = parseLine(encryptedLine);
    if (!r || (r.type !== "profile" && r.type !== "refresh")) continue;

    const key = keyOf(r);
    if (!key) continue;

    const cur = map.get(key) || {
      key,
      anon_id: r.anon_id || null,
      user_id: r.user_id || null,
      name: null,
      aims: null,
      interest: null,
      experience: null,
      contact: null,
      country: null,
      area: null,
      language: null,
      lat: null,
      lon: null,
      first_seen: null,
      last_seen: null,
      refresh_count: 0,
    };

    if (r.type === "profile") {
      cur.name = r.name ?? cur.name;
      cur.aims = r.aims ?? cur.aims;
      cur.interest = r.interest ?? cur.interest;
      cur.experience = r.experience ?? cur.experience;
      cur.contact = r.contact ?? cur.contact;
      cur.country = r.country ?? cur.country;
      cur.area = r.area ?? cur.area;
      cur.language = r.language ?? cur.language;
      const profileLat = toFiniteNumber(r.lat ?? r.latitude);
      const profileLon = toFiniteNumber(r.lon ?? r.lng ?? r.longitude);
      if (profileLat != null) cur.lat = profileLat;
      if (profileLon != null) cur.lon = profileLon;
      cur.first_seen = cur.first_seen || r.ts;
      cur.last_seen = r.ts;
    } else if (r.type === "refresh") {
      cur.refresh_count += 1;
      cur.country = r.country ?? cur.country;
      cur.area = r.area ?? cur.area;
      cur.language = r.language ?? cur.language;
      const refreshLat = toFiniteNumber(r.lat ?? r.latitude);
      const refreshLon = toFiniteNumber(r.lon ?? r.lng ?? r.longitude);
      if (refreshLat != null) cur.lat = refreshLat;
      if (refreshLon != null) cur.lon = refreshLon;
      cur.first_seen = cur.first_seen || r.ts;
      cur.last_seen = r.ts;
    }
    map.set(key, cur);
  }
  return Array.from(map.values()).sort(
    (a, b) => new Date(a.first_seen) - new Date(b.first_seen),
  );
}

async function saveIp(ip) {
  const geo = await enrichIp(ip);
  const timestamp = new Date().toISOString();
  // Do not log IP or geo information here to avoid leaking potentially sensitive data.
  writeLine({
    type: "ip",
    ts: timestamp,
    ip: ip,
    geo: geo,
  });
}

async function deleteUserForDashboard(anonId, actor = {}) {
  const target = String(anonId || "").trim();
  if (!target || !fs.existsSync(file)) return false;

  const lines = fs.readFileSync(file, "utf8").split(/\r?\n/).filter(Boolean);
  const kept = [];
  let deleted = false;

  for (const line of lines) {
    const parsed = parseLine(line);
    if (parsed && String(parsed.anon_id || "") === target) {
      deleted = true;
      continue;
    }
    kept.push(line);
  }

  if (!deleted) return false;

  ensureDir();
  fs.writeFileSync(file, kept.length ? `${kept.join("\n")}\n` : "", "utf8");
  writeLine({
    type: "audit",
    ts: new Date().toISOString(),
    action: "delete_user",
    target_anon_id: target,
    actor_user: actor.user || null,
    actor_host: actor.host || null,
    environment: actor.environment || null,
  });

  return true;
}

module.exports = {
  init,
  saveProfile,
  bumpRefresh,
  getUsersForDashboard,
  saveIp,
  deleteUserForDashboard,
};
