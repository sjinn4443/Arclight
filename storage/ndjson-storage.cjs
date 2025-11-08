const fs = require("fs");
const path = require("path");
const { enrichIp } = require("../utils/ipEnricher.cjs");

const dataDir = path.join(__dirname, "..", "dev_dashboard", "data");
const file = path.join(dataDir, "telemetry.ndjson");

function ensureDir() {
  if (!fs.existsSync(dataDir)) fs.mkdirSync(dataDir, { recursive: true });
}
function writeLine(obj) {
  ensureDir();
  try {
    fs.appendFileSync(file, JSON.stringify(obj) + "\n", "utf8");
  } catch (e) {
    console.error("Failed to write to telemetry.ndjson:", e);
    throw e; // Re-throw to propagate the error to the caller
  }
}

async function init() {
  ensureDir();
}

async function saveProfile(f) {
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
    country: f.country ?? null,
    area: f.area ?? null,
    language: f.language ?? null,
  });
}

async function bumpRefresh(f) {
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
  });
}

// helper: choose a stable key per row
function keyOf(r) {
  return r.user_id || r.email || r.anon_id;
}

async function getUsersForDashboard() {
  if (!fs.existsSync(file)) return [];
  const lines = fs.readFileSync(file, "utf8").trim().split("\n");

  const map = new Map(); // key -> row
  for (const line of lines) {
    if (!line) continue;
    const r = JSON.parse(line);
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
      cur.first_seen = cur.first_seen || r.ts;
      cur.last_seen = r.ts;
    } else if (r.type === "refresh") {
      cur.refresh_count += 1;
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
  const geo = enrichIp(ip);
  const timestamp = new Date().toISOString();
  console.log("Saving IP:", ip, "Geo:", geo, "Timestamp:", timestamp);
  writeLine({
    type: "ip",
    ts: timestamp,
    ip: ip,
    geo: geo,
  });
}

module.exports = {
  init,
  saveProfile,
  bumpRefresh,
  getUsersForDashboard,
  saveIp,
};
