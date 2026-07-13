const { Pool } = require("pg");
const { URL } = require("url");
const { enrichIp } = require("../utils/ipEnricher.cjs");
const {
  anonymizeIpForStorage,
  resolveAuditRetentionDays,
  resolveTelemetryRetentionDays,
} = require("../security/privacy.cjs");

const LOCAL_DB_HOSTS = new Set(["localhost", "127.0.0.1", "::1"]);
const poolCache = new Map();

function normalizeCa(value) {
  const raw = String(value || "");
  return raw ? raw.replace(/\\n/g, "\n") : null;
}

function isLocalDatabase(connectionString) {
  try {
    const hostname = new URL(connectionString).hostname.toLowerCase();
    return LOCAL_DB_HOSTS.has(hostname);
  } catch {
    return false;
  }
}

function isRailwayInternalDatabase(connectionString) {
  try {
    const hostname = new URL(connectionString).hostname.toLowerCase();
    return (
      hostname === "railway.internal" || hostname.endsWith(".railway.internal")
    );
  } catch {
    return false;
  }
}

function resolveSsl(connectionString) {
  if (!connectionString || process.env.DB_SSL === "disable") return false;

  const ca = normalizeCa(process.env.DB_CA_CERT);
  if (ca) {
    return {
      rejectUnauthorized: true,
      ca,
    };
  }

  if (process.env.DB_SSL_ALLOW_SELF_SIGNED === "true") {
    return { rejectUnauthorized: false };
  }

  if (isLocalDatabase(connectionString)) return false;
  if (isRailwayInternalDatabase(connectionString)) {
    return { rejectUnauthorized: false };
  }

  return { rejectUnauthorized: true };
}

function getPool(connectionString) {
  if (!connectionString) return null;
  if (poolCache.has(connectionString)) return poolCache.get(connectionString);

  const pool = new Pool({
    connectionString,
    ssl: resolveSsl(connectionString),
  });
  poolCache.set(connectionString, pool);
  return pool;
}

const writePool = getPool(process.env.DATABASE_URL);
const readPool = getPool(
  process.env.REPORTS_READ_DATABASE_URL || process.env.DATABASE_URL,
);
const adminPool = getPool(
  process.env.REPORTS_ADMIN_DATABASE_URL || process.env.DATABASE_URL,
);

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
  const initPool = writePool || adminPool;
  if (!initPool) return;

  await initPool.query(`
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
      country_name TEXT,
      ts           TIMESTAMPTZ NOT NULL DEFAULT NOW(),
      geo          JSONB
    );

    CREATE TABLE IF NOT EXISTS reports_audit_log (
      id              BIGSERIAL PRIMARY KEY,
      action          TEXT NOT NULL,
      anon_id         TEXT,
      actor_user      TEXT,
      actor_ip        TEXT,
      actor_host      TEXT,
      metadata        JSONB,
      created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
    );

    ALTER TABLE app_users ADD COLUMN IF NOT EXISTS lat DOUBLE PRECISION;
    ALTER TABLE app_users ADD COLUMN IF NOT EXISTS lon DOUBLE PRECISION;
    ALTER TABLE ip_logs ADD COLUMN IF NOT EXISTS country_name TEXT;

    CREATE INDEX IF NOT EXISTS ip_logs_ts_desc_idx ON ip_logs (ts DESC);

    CREATE OR REPLACE VIEW ip_logs_latest_first AS
    SELECT ip, ts, geo, country_name
    FROM ip_logs
    ORDER BY ts DESC;

    CREATE OR REPLACE VIEW app_users_latest_first AS
    SELECT profile_id, anon_id, user_id, email, name, aims, interest,
           experience, contact, country, area, language, lat, lon,
           first_seen, last_seen, refresh_count
    FROM app_users
    ORDER BY last_seen DESC NULLS LAST, first_seen DESC, profile_id ASC;
  `);

  await pruneExpiredTelemetry(initPool);
}

async function pruneExpiredTelemetry(pool) {
  const telemetryRetentionDays = resolveTelemetryRetentionDays();
  if (telemetryRetentionDays != null) {
    await pool.query(
      `
      DELETE FROM app_users
      WHERE last_seen < NOW() - ($1::int * INTERVAL '1 day')
    `,
      [telemetryRetentionDays],
    );
    await pool.query(
      `
      DELETE FROM ip_logs
      WHERE ts < NOW() - ($1::int * INTERVAL '1 day')
    `,
      [telemetryRetentionDays],
    );
  }

  const auditRetentionDays = resolveAuditRetentionDays();
  if (auditRetentionDays != null) {
    await pool.query(
      `
      DELETE FROM reports_audit_log
      WHERE created_at < NOW() - ($1::int * INTERVAL '1 day')
    `,
      [auditRetentionDays],
    );
  }
}

function profileIdOf(f) {
  return (f.user_id || f.email || f.anon_id || "").toString().slice(0, 120);
}

async function saveProfile(f) {
  if (!writePool) return;
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

  await writePool.query(
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
  if (!writePool) return;
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

  await writePool.query(
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
  if (!readPool) return [];

  const { rows } = await readPool.query(`
    SELECT profile_id, anon_id, user_id, name, aims, interest, experience, contact, country, area, language, lat, lon,
           first_seen, last_seen, refresh_count
    FROM app_users
    ORDER BY last_seen DESC NULLS LAST, first_seen DESC
  `);
  return rows;
}

async function getIpLocationsForDashboard() {
  if (!readPool) return [];

  const { rows } = await readPool.query(`
    SELECT ip, ts, country_name, geo
    FROM (
      SELECT DISTINCT ON (ip) ip, ts, country_name, geo
      FROM ip_logs
      WHERE geo IS NOT NULL
      ORDER BY ip, ts DESC
    ) AS latest_by_ip
    ORDER BY ts DESC
  `);

  return rows
    .map((row) => {
      const geo = row.geo && typeof row.geo === "object" ? row.geo : {};
      const lat = toFiniteNumber(geo.latitude ?? geo.lat);
      const lon = toFiniteNumber(geo.longitude ?? geo.lon ?? geo.lng);
      const country = String(
        row.country_name || geo.countryName || geo.country || "",
      ).trim();
      const city = String(geo.city || "").trim();

      if (lat == null || lon == null) return null;
      if (country === "Mock Country" || city === "Mock City") return null;

      return {
        ip: anonymizeIpForStorage(row.ip),
        ts: row.ts,
        country: country || null,
        countryCode:
          String(geo.countryCode || geo.iso2 || "")
            .trim()
            .toUpperCase() || null,
        city: city || null,
        area: String(geo.area || "").trim() || null,
        lat,
        lon,
        source: String(geo.source || "ip_lookup").trim(),
        isPrecise: geo.isPrecise === true,
      };
    })
    .filter(Boolean);
}

async function saveIp(ip) {
  if (!writePool) return;
  const geo = await enrichIp(ip);
  const countryName =
    String(geo?.countryName || geo?.country || "").trim() || null;
  await writePool.query(
    `
    INSERT INTO ip_logs (ip, country_name, geo)
    VALUES ($1, $2, $3)
  `,
    [String(ip || "unknown").trim(), countryName, geo],
  );
}

function preciseGeoForStorage(geo) {
  if (!geo || geo.isPrecise !== true) return null;

  const latitude = toFiniteNumber(geo.lat ?? geo.latitude);
  const longitude = toFiniteNumber(geo.lon ?? geo.lng ?? geo.longitude);
  if (latitude == null || longitude == null) return null;

  const countryName = String(geo.countryName || geo.country || "").trim();
  const countryCode = String(geo.countryCode || geo.iso2 || "")
    .trim()
    .toUpperCase();

  return {
    source: "browser_geolocation",
    country: countryName || null,
    countryName: countryName || null,
    countryCode: countryCode || null,
    city: String(geo.city || "").trim() || null,
    area: String(geo.area || "").trim() || null,
    latitude,
    longitude,
    isPrecise: true,
    error: null,
  };
}

async function updateIpLocation(ip, geo) {
  if (!writePool) return false;

  const preciseGeo = preciseGeoForStorage(geo);
  if (!preciseGeo) return false;

  const storedIp = String(ip || "unknown").trim();
  const updated = await writePool.query(
    `
    WITH latest AS (
      SELECT ctid
      FROM ip_logs
      WHERE ip = $1
        AND ts >= NOW() - INTERVAL '30 minutes'
      ORDER BY ts DESC, ctid DESC
      LIMIT 1
    )
    UPDATE ip_logs AS logs
    SET country_name = $2,
        geo = $3::jsonb
    FROM latest
    WHERE logs.ctid = latest.ctid
  `,
    [storedIp, preciseGeo.countryName, preciseGeo],
  );

  if (updated.rowCount > 0) return true;

  await writePool.query(
    `
    INSERT INTO ip_logs (ip, country_name, geo)
    VALUES ($1, $2, $3)
  `,
    [storedIp, preciseGeo.countryName, preciseGeo],
  );
  return true;
}

async function deleteUserForDashboard(anonId, actor = {}) {
  if (!adminPool) throw new Error("Admin reports DB is not configured");

  const client = await adminPool.connect();
  try {
    await client.query("BEGIN");
    const deleted = await client.query(
      `
      DELETE FROM app_users
      WHERE anon_id = $1
      RETURNING profile_id
    `,
      [anonId],
    );

    if (deleted.rowCount < 1) {
      await client.query("ROLLBACK");
      return false;
    }

    await client.query(
      `
      INSERT INTO reports_audit_log (action, anon_id, actor_user, actor_ip, actor_host, metadata)
      VALUES ($1, $2, $3, $4, $5, $6::jsonb)
    `,
      [
        "delete_user",
        anonId,
        actor.user || null,
        actor.ip || null,
        actor.host || null,
        JSON.stringify({
          deletedProfiles: deleted.rows.map((row) => row.profile_id),
          environment: actor.environment || null,
        }),
      ],
    );

    await client.query("COMMIT");
    return true;
  } catch (error) {
    await client.query("ROLLBACK");
    throw error;
  } finally {
    client.release();
  }
}

module.exports = {
  init,
  saveProfile,
  bumpRefresh,
  getUsersForDashboard,
  getIpLocationsForDashboard,
  saveIp,
  updateIpLocation,
  deleteUserForDashboard,
  pruneExpiredTelemetry,
};
