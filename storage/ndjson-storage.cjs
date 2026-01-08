const fs = require("fs");
const path = require("path");
const { enrichIp } = require("../utils/ipEnricher.cjs");
const { encrypt, decrypt } = require("../reports/security/encrypt.cjs"); // Import encryption module

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
  for (const encryptedLine of lines) {
    if (!encryptedLine) continue;
    let decryptedLine;
    try {
      decryptedLine = decrypt(encryptedLine); // Decrypt the line
    } catch (e) {
      console.error("Failed to decrypt line:", e.message);
      continue; // Skip this line if decryption fails
    }
    const r = JSON.parse(decryptedLine);
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

  const fs = require("fs/promises");
  const path = require("path");

  async function getUsersForDashboard() {
    const { rows } = await pool.query(`
    SELECT profile_id, name, aims, interest, experience, contact, country, area, language,
           first_seen, last_seen, refresh_count
    FROM app_users
    ORDER BY first_seen ASC
  `);
    return rows;
  }
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

module.exports = {
  init,
  saveProfile,
  bumpRefresh,
  getUsersForDashboard,
  saveIp,
};
