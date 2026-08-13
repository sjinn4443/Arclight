const crypto = require("crypto");
const fs = require("fs");
const path = require("path");
const { enrichIp } = require("../utils/ipEnricher.cjs");
const {
  decrypt,
  decryptAsync,
  encrypt,
} = require("../reports/security/encrypt.cjs");
const { logServerError } = require("../security/safe-logging.cjs");
const {
  anonymizeIpForStorage,
  isExpiredTimestamp,
  resolveAuditRetentionDays,
  resolveTelemetryRetentionDays,
} = require("../security/privacy.cjs");

const SERVER_PROFILE_ID_PATTERN = /^(?:session|legacy)_[A-Za-z0-9_-]{40,100}$/;
const dataDir = process.env.TELEMETRY_DATA_DIR
  ? path.resolve(process.env.TELEMETRY_DATA_DIR)
  : path.join(__dirname, "..", "reports", "data");
const file = path.join(dataDir, "telemetry.ndjson");

function ensureDir() {
  if (!fs.existsSync(dataDir)) fs.mkdirSync(dataDir, { recursive: true });
}

function writeLine(obj) {
  ensureDir();
  try {
    fs.appendFileSync(file, `${encrypt(JSON.stringify(obj))}\n`, "utf8");
  } catch (error) {
    logServerError("Failed to write telemetry data", error);
    throw error;
  }
}

function telemetrySecret() {
  const secret = String(process.env.TELEMETRY_TOKEN_SECRET || "").trim();
  if (secret.length < 32) {
    throw new Error(
      "TELEMETRY_TOKEN_SECRET is required for profile identifier migration",
    );
  }
  return secret;
}

function legacyProfileId(value) {
  const digest = crypto
    .createHmac("sha256", telemetrySecret())
    .update(`legacy.${String(value || "")}`)
    .digest("base64url");
  return `legacy_${digest}`;
}

function profileIdOf(fields) {
  const profileId = String(fields?.profile_id || "").trim();
  if (!SERVER_PROFILE_ID_PATTERN.test(profileId)) {
    throw new Error("server-derived profile identifier required");
  }
  return profileId;
}

function parseLine(line) {
  try {
    const encrypted = isEncryptedLine(line);
    return JSON.parse(encrypted ? decrypt(line) : line);
  } catch (error) {
    logServerError("Failed to parse telemetry record", error);
    return null;
  }
}

function isEncryptedLine(line) {
  return /^(?:v2:[0-9a-f]{24}|[0-9a-f]{32}:[0-9a-f]{24}):[0-9a-f]{32}:[0-9a-f]+$/i.test(
    line,
  );
}

function isV2EncryptedLine(line) {
  return /^v2:[0-9a-f]{24}:[0-9a-f]{32}:[0-9a-f]+$/i.test(line);
}

function migratedProfileId(row) {
  const existing = String(row?.profile_id || "").trim();
  if (SERVER_PROFILE_ID_PATTERN.test(existing)) return existing;
  const legacy = String(
    row?.profile_id || row?.user_id || row?.email || row?.anon_id || "",
  ).trim();
  return legacy ? legacyProfileId(legacy) : null;
}

function sanitizeLegacyRow(row) {
  if (!row || typeof row !== "object" || !row.type || !row.ts) return null;

  if (row.type === "profile" || row.type === "refresh") {
    const profileId = migratedProfileId(row);
    if (!profileId) return null;
    const base = {
      type: row.type,
      ts: row.ts,
      profile_id: profileId,
      anon_id: profileId,
      language: row.language ?? null,
    };
    if (row.type === "refresh") {
      return { ...base, reason: row.reason ?? null };
    }
    return {
      ...base,
      name: row.name ?? null,
      aims: row.aims ?? null,
      interest: row.interest ?? null,
      experience: row.experience ?? null,
      contact: row.contact ?? null,
    };
  }

  if (row.type === "ip") {
    const countryName = String(
      row.country_name || row.geo?.countryName || row.geo?.country || "",
    ).trim();
    return {
      type: "ip",
      ts: row.ts,
      ip: anonymizeIpForStorage(row.ip),
      country_name: countryName || null,
    };
  }

  if (row.type === "audit") {
    const target = String(row.target_anon_id || row.anon_id || "").trim();
    return {
      type: "audit",
      ts: row.ts,
      action: row.action ?? null,
      target_anon_id: target
        ? SERVER_PROFILE_ID_PATTERN.test(target)
          ? target
          : legacyProfileId(target)
        : null,
      actor_user: row.actor_user ?? null,
      actor_host: row.actor_host ?? null,
      environment: row.environment ?? null,
    };
  }

  return null;
}

function scrubTelemetryFile() {
  if (!fs.existsSync(file)) return { kept: 0, removed: 0 };
  const lines = fs.readFileSync(file, "utf8").split(/\r?\n/).filter(Boolean);
  const sanitized = [];
  let changed = false;

  for (const line of lines) {
    const parsed = parseLine(line);
    const row = sanitizeLegacyRow(parsed);
    if (!row) {
      changed = true;
      continue;
    }
    const serialized = JSON.stringify(row);
    if (isV2EncryptedLine(line) && JSON.stringify(parsed) === serialized) {
      sanitized.push(line);
    } else {
      sanitized.push(encrypt(serialized));
      changed = true;
    }
  }

  if (!changed) return { kept: sanitized.length, removed: 0 };

  const tempFile = `${file}.${process.pid}.tmp`;
  fs.writeFileSync(
    tempFile,
    sanitized.length ? `${sanitized.join("\n")}\n` : "",
    "utf8",
  );
  fs.renameSync(tempFile, file);
  return { kept: sanitized.length, removed: lines.length - sanitized.length };
}

async function scrubTelemetryFileAsync({ concurrency = 16 } = {}) {
  if (!fs.existsSync(file)) return { kept: 0, removed: 0 };
  const lines = fs.readFileSync(file, "utf8").split(/\r?\n/).filter(Boolean);
  const sanitized = new Array(lines.length);
  let cursor = 0;
  let changed = false;

  async function worker() {
    while (cursor < lines.length) {
      const index = cursor;
      cursor += 1;
      const line = lines[index];
      let parsed = null;
      try {
        const plaintext = isEncryptedLine(line)
          ? await decryptAsync(line)
          : line;
        parsed = JSON.parse(plaintext);
      } catch (error) {
        logServerError("Failed to parse telemetry record", error);
      }

      const row = sanitizeLegacyRow(parsed);
      if (!row) {
        changed = true;
        sanitized[index] = null;
        continue;
      }

      const serialized = JSON.stringify(row);
      if (isV2EncryptedLine(line) && JSON.stringify(parsed) === serialized) {
        sanitized[index] = line;
      } else {
        sanitized[index] = encrypt(serialized);
        changed = true;
      }
    }
  }

  const workerCount = Math.max(
    1,
    Math.min(Number(concurrency) || 1, lines.length || 1),
  );
  await Promise.all(Array.from({ length: workerCount }, () => worker()));
  const kept = sanitized.filter(Boolean);
  if (!changed) return { kept: kept.length, removed: 0 };

  const tempFile = `${file}.${process.pid}.tmp`;
  fs.writeFileSync(tempFile, kept.length ? `${kept.join("\n")}\n` : "", "utf8");
  fs.renameSync(tempFile, file);
  return { kept: kept.length, removed: lines.length - kept.length };
}

async function init() {
  ensureDir();
  scrubTelemetryFile();
  pruneTelemetryFile();
}

async function saveProfile(fields = {}) {
  const profileId = profileIdOf(fields);
  writeLine({
    type: "profile",
    ts: new Date().toISOString(),
    profile_id: profileId,
    anon_id: profileId,
    name: fields.name ?? null,
    aims: fields.aims ?? null,
    interest: fields.interest ?? null,
    experience: fields.experience ?? null,
    contact: fields.contact ?? null,
    language: fields.language ?? null,
  });
}

async function bumpRefresh(fields = {}) {
  const profileId = profileIdOf(fields);
  writeLine({
    type: "refresh",
    ts: new Date().toISOString(),
    profile_id: profileId,
    anon_id: profileId,
    reason: fields.reason ?? null,
    language: fields.language ?? null,
  });
}

function keyOf(row) {
  return row.profile_id || row.anon_id;
}

function retentionDaysForRow(row) {
  return row?.type === "audit"
    ? resolveAuditRetentionDays()
    : resolveTelemetryRetentionDays();
}

function pruneTelemetryFile(now = new Date()) {
  if (!fs.existsSync(file)) return;
  const lines = fs.readFileSync(file, "utf8").split(/\r?\n/).filter(Boolean);
  const kept = [];
  let changed = false;

  for (const line of lines) {
    const parsed = parseLine(line);
    if (!parsed || !parsed.ts) {
      changed = true;
      continue;
    }
    if (isExpiredTimestamp(parsed.ts, retentionDaysForRow(parsed), now)) {
      changed = true;
      continue;
    }
    kept.push(line);
  }

  if (changed) {
    fs.writeFileSync(file, kept.length ? `${kept.join("\n")}\n` : "", "utf8");
  }
}

async function getUsersForDashboard() {
  if (!fs.existsSync(file)) return [];
  const lines = fs.readFileSync(file, "utf8").split(/\r?\n/).filter(Boolean);
  const users = new Map();

  for (const line of lines) {
    const row = parseLine(line);
    if (!row || !["profile", "refresh"].includes(row.type)) continue;
    const key = keyOf(row);
    if (!key) continue;

    const current = users.get(key) || {
      profile_id: key,
      anon_id: key,
      name: null,
      aims: null,
      interest: null,
      experience: null,
      contact: null,
      language: null,
      first_seen: null,
      last_seen: null,
      refresh_count: 0,
    };
    current.first_seen = current.first_seen || row.ts;
    current.last_seen = row.ts;
    current.language = row.language ?? current.language;
    if (row.type === "profile") {
      current.name = row.name ?? current.name;
      current.aims = row.aims ?? current.aims;
      current.interest = row.interest ?? current.interest;
      current.experience = row.experience ?? current.experience;
      current.contact = row.contact ?? current.contact;
    } else {
      current.refresh_count += 1;
    }
    users.set(key, current);
  }

  return [...users.values()].sort(
    (a, b) => new Date(b.last_seen) - new Date(a.last_seen),
  );
}

async function getIpLocationsForDashboard() {
  if (!fs.existsSync(file)) return [];
  const latestByIp = new Map();
  const lines = fs.readFileSync(file, "utf8").split(/\r?\n/).filter(Boolean);

  for (const line of lines) {
    const row = parseLine(line);
    if (!row || row.type !== "ip" || !row.ip || !row.country_name) continue;
    const current = latestByIp.get(row.ip);
    if (!current || new Date(row.ts) > new Date(current.ts)) {
      latestByIp.set(row.ip, row);
    }
  }

  return [...latestByIp.values()]
    .map((row) => ({
      ip: anonymizeIpForStorage(row.ip),
      country: row.country_name,
      ts: row.ts,
    }))
    .sort((a, b) => new Date(b.ts) - new Date(a.ts));
}

async function saveIp(ip) {
  const geo = await enrichIp(ip);
  writeLine({
    type: "ip",
    ts: new Date().toISOString(),
    ip: anonymizeIpForStorage(ip),
    country_name: String(geo?.countryName || geo?.country || "").trim() || null,
  });
}

async function updateIpLocation() {
  return false;
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
  bumpRefresh,
  deleteUserForDashboard,
  getIpLocationsForDashboard,
  getUsersForDashboard,
  init,
  pruneTelemetryFile,
  saveIp,
  saveProfile,
  scrubTelemetryFile,
  scrubTelemetryFileAsync,
  updateIpLocation,
};
