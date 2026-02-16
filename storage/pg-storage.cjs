const { Pool } = require("pg");
const { enrichIp } = require("../utils/ipEnricher.cjs");

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.DB_SSL === "disable" ? false : { rejectUnauthorized: false },
});

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

async function init() {
  await pool.query(`
    CREATE TABLE IF NOT EXISTS app_users (
      profile_id   TEXT PRIMARY KEY,     -- user_id/email if present, else anon_id
      anon_id      TEXT,
      user_id      TEXT,
      email        TEXT,
      name         TEXT,
      aims         TEXT,
      interest     TEXT,
      experience   TEXT,
      contact      TEXT,
      country      TEXT,
      area         TEXT,
      language     TEXT,
      lat          DOUBLE PRECISION,
      lon          DOUBLE PRECISION,
      first_seen   TIMESTAMPTZ NOT NULL DEFAULT NOW(),
      last_seen    TIMESTAMPTZ NOT NULL DEFAULT NOW(),
      refresh_count INTEGER NOT NULL DEFAULT 0
    );

    CREATE TABLE IF NOT EXISTS ip_logs (
      ip           TEXT NOT NULL,
      ts           TIMESTAMPTZ NOT NULL DEFAULT NOW(),
      geo          JSONB
    );

    ALTER TABLE app_users ADD COLUMN IF NOT EXISTS lat DOUBLE PRECISION;
    ALTER TABLE app_users ADD COLUMN IF NOT EXISTS lon DOUBLE PRECISION;
  `);
}

function profileIdOf(f) {
  return (f.user_id || f.email || f.anon_id || "").toString().slice(0, 120);
}

async function saveProfile(f) {
  f = f || {};
  const pid = profileIdOf(f);
  if (!pid) throw new Error("identifier required");
  const lat = toFiniteNumber(f.lat ?? f.latitude ?? pickGeoField(f, "lat"));
  const lon = toFiniteNumber(
    f.lon ??
      f.lng ??
      f.longitude ??
      pickGeoField(f, "lon") ??
      pickGeoField(f, "lng") ??
      pickGeoField(f, "longitude"),
  );

  await pool.query(
    `
    INSERT INTO app_users
      (profile_id, anon_id, user_id, email, name, aims, interest, experience, contact, country, area, language, lat, lon, first_seen, last_seen)
    VALUES
      ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,NOW(),NOW())
    ON CONFLICT (profile_id) DO UPDATE SET
      anon_id=COALESCE(EXCLUDED.anon_id, app_users.anon_id),
      user_id=COALESCE(EXCLUDED.user_id, app_users.user_id),
      email=COALESCE(EXCLUDED.email, app_users.email),
      name=COALESCE(EXCLUDED.name, app_users.name),
      aims=COALESCE(EXCLUDED.aims, app_users.aims),
      interest=COALESCE(EXCLUDED.interest, app_users.interest),
      experience=COALESCE(EXCLUDED.experience, app_users.experience),
      contact=COALESCE(EXCLUDED.contact, app_users.contact),
      country=COALESCE(EXCLUDED.country, app_users.country),
      area=COALESCE(EXCLUDED.area, app_users.area),
      language=COALESCE(EXCLUDED.language, app_users.language),
      lat=COALESCE(EXCLUDED.lat, app_users.lat),
      lon=COALESCE(EXCLUDED.lon, app_users.lon),
      last_seen=NOW()
  `,
    [
      pid,
      f.anon_id || null,
      f.user_id || null,
      f.email || null,
      f.name ?? null,
      f.aims ?? null,
      f.interest ?? null,
      f.experience ?? null,
      f.contact ?? null,
      f.country ?? pickGeoField(f, "country") ?? null,
      f.area ?? pickGeoField(f, "area") ?? pickGeoField(f, "city") ?? null,
      f.language ?? pickGeoField(f, "language") ?? null,
      lat,
      lon,
    ],
  );
}

async function bumpRefresh(f) {
  f = f || {};
  const pid = profileIdOf(f);
  if (!pid) throw new Error("identifier required");
  const lat = toFiniteNumber(f.lat ?? f.latitude ?? pickGeoField(f, "lat"));
  const lon = toFiniteNumber(
    f.lon ??
      f.lng ??
      f.longitude ??
      pickGeoField(f, "lon") ??
      pickGeoField(f, "lng") ??
      pickGeoField(f, "longitude"),
  );
  const country = f.country ?? pickGeoField(f, "country") ?? null;
  const area =
    f.area ?? pickGeoField(f, "area") ?? pickGeoField(f, "city") ?? null;
  const language = f.language ?? pickGeoField(f, "language") ?? null;

  await pool.query(
    `
    INSERT INTO app_users (
      profile_id, anon_id, user_id, email, country, area, language, lat, lon,
      refresh_count, first_seen, last_seen
    )
    VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, 1, NOW(), NOW())
    ON CONFLICT (profile_id) DO UPDATE SET
      anon_id=COALESCE(EXCLUDED.anon_id, app_users.anon_id),
      user_id=COALESCE(EXCLUDED.user_id, app_users.user_id),
      email=COALESCE(EXCLUDED.email, app_users.email),
      country=COALESCE(EXCLUDED.country, app_users.country),
      area=COALESCE(EXCLUDED.area, app_users.area),
      language=COALESCE(EXCLUDED.language, app_users.language),
      lat=COALESCE(EXCLUDED.lat, app_users.lat),
      lon=COALESCE(EXCLUDED.lon, app_users.lon),
      refresh_count = app_users.refresh_count + 1,
      last_seen = NOW()
  `,
    [
      pid,
      f.anon_id || null,
      f.user_id || null,
      f.email || null,
      country,
      area,
      language,
      lat,
      lon,
    ],
  );
}

async function getUsersForDashboard() {
  const { rows } = await pool.query(`
    SELECT profile_id, anon_id, user_id, name, aims, interest, experience, contact, country, area, language, lat, lon,
           first_seen, last_seen, refresh_count
    FROM app_users
    ORDER BY first_seen ASC
  `);
  return rows;
}

async function saveIp(ip) {
  const geo = enrichIp(ip);
  await pool.query(
    `
    INSERT INTO ip_logs (ip, geo)
    VALUES ($1, $2)
  `,
    [ip, geo],
  );
}

module.exports = {
  init,
  saveProfile,
  bumpRefresh,
  getUsersForDashboard,
  saveIp,
};
