const fs = require("fs");
const path = require("path");

const dataDir = path.join(__dirname, "..", "dev_dashboard", "data");
const file = path.join(dataDir, "telemetry.ndjson");

function ensureDir() {
  if (!fs.existsSync(dataDir)) fs.mkdirSync(dataDir, { recursive: true });
}
function writeLine(obj) {
  ensureDir();
  fs.appendFileSync(file, JSON.stringify(obj) + "\n", "utf8");
}

async function init() {
  ensureDir();
}

async function saveProfile(fields) {
  const row = {
    type: "profile",
    ts: new Date().toISOString(),
    name: fields.name ?? null,
    aims: fields.aims ?? null,
    interest: fields.interest ?? null,
    experience: fields.experience ?? null,
    contact: fields.contact ?? null,
    country: fields.country ?? null,
    area: fields.area ?? null,
    language: fields.language ?? null,
  };
  writeLine(row);
}

async function bumpRefresh() {
  writeLine({ type: "refresh", ts: new Date().toISOString() });
}

async function getUsersForDashboard() {
  if (!fs.existsSync(file)) return [];
  const lines = fs.readFileSync(file, "utf8").trim().split("\n");

  let profile = {
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

  for (const line of lines) {
    if (!line) continue;
    const r = JSON.parse(line);
    if (r.type === "profile") {
      profile.name = r.name ?? profile.name;
      profile.aims = r.aims ?? profile.aims;
      profile.interest = r.interest ?? profile.interest;
      profile.experience = r.experience ?? profile.experience;
      profile.contact = r.contact ?? profile.contact;
      profile.country = r.country ?? profile.country;
      profile.area = r.area ?? profile.area;
      profile.language = r.language ?? profile.language;
      profile.first_seen = profile.first_seen || r.ts;
      profile.last_seen = r.ts;
    } else if (r.type === "refresh") {
      profile.refresh_count += 1;
      profile.first_seen = profile.first_seen || r.ts;
      profile.last_seen = r.ts;
    }
  }
  return profile.first_seen ? [profile] : [];
}

module.exports = { init, saveProfile, bumpRefresh, getUsersForDashboard };
