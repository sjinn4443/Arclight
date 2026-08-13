const crypto = require("crypto");
const { Pool } = require("pg");
const { URL } = require("url");
const { enrichIp } = require("../utils/ipEnricher.cjs");
const {
  resolveAuditRetentionDays,
  resolveTelemetryRetentionDays,
} = require("../security/privacy.cjs");
const { maskIp } = require("../security/safe-logging.cjs");

const LOCAL_DB_HOSTS = new Set(["localhost", "127.0.0.1", "::1"]);
const SERVER_PROFILE_ID_PATTERN = /^(?:session|legacy)_[A-Za-z0-9_-]{40,100}$/;
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
  if (ca) return { rejectUnauthorized: true, ca };
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
    connectionTimeoutMillis: 10_000,
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

async function migrateLegacyProfiles(client) {
  const { rows } = await client.query(`
    SELECT profile_id
    FROM app_users
    WHERE profile_id IS NOT NULL
      AND profile_id !~ '^(session|legacy)_[A-Za-z0-9_-]{40,100}$'
    ORDER BY profile_id
  `);

  for (const row of rows) {
    const previousId = String(row.profile_id || "");
    if (!previousId) continue;
    const nextId = legacyProfileId(previousId);
    await client.query(
      `
        UPDATE app_users
        SET profile_id = $1, anon_id = $1
        WHERE profile_id = $2
      `,
      [nextId, previousId],
    );
    await client.query(
      `UPDATE reports_audit_log SET anon_id = $1 WHERE anon_id = $2`,
      [nextId, previousId],
    );
  }

  await client.query(`
    UPDATE app_users
    SET anon_id = profile_id
    WHERE profile_id ~ '^(session|legacy)_[A-Za-z0-9_-]{40,100}$'
      AND anon_id IS DISTINCT FROM profile_id
  `);
}

async function init() {
  const initPool = writePool || adminPool;
  if (!initPool) return;

  const client = await initPool.connect();
  try {
    await client.query("BEGIN");
    await client.query(`
      CREATE TABLE IF NOT EXISTS app_users (
        profile_id    TEXT PRIMARY KEY,
        anon_id       TEXT,
        name          TEXT,
        aims          TEXT,
        interest      TEXT,
        experience    TEXT,
        contact       TEXT,
        language      TEXT,
        first_seen    TIMESTAMPTZ NOT NULL DEFAULT NOW(),
        last_seen     TIMESTAMPTZ NOT NULL DEFAULT NOW(),
        refresh_count INTEGER NOT NULL DEFAULT 0
      );

      CREATE TABLE IF NOT EXISTS ip_logs (
        ip           TEXT NOT NULL,
        country_name TEXT,
        ts           TIMESTAMPTZ NOT NULL DEFAULT NOW()
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

      ALTER TABLE app_users ADD COLUMN IF NOT EXISTS anon_id TEXT;
      ALTER TABLE app_users ADD COLUMN IF NOT EXISTS name TEXT;
      ALTER TABLE app_users ADD COLUMN IF NOT EXISTS aims TEXT;
      ALTER TABLE app_users ADD COLUMN IF NOT EXISTS interest TEXT;
      ALTER TABLE app_users ADD COLUMN IF NOT EXISTS experience TEXT;
      ALTER TABLE app_users ADD COLUMN IF NOT EXISTS contact TEXT;
      ALTER TABLE app_users ADD COLUMN IF NOT EXISTS language TEXT;
      ALTER TABLE app_users ADD COLUMN IF NOT EXISTS first_seen TIMESTAMPTZ NOT NULL DEFAULT NOW();
      ALTER TABLE app_users ADD COLUMN IF NOT EXISTS last_seen TIMESTAMPTZ NOT NULL DEFAULT NOW();
      ALTER TABLE app_users ADD COLUMN IF NOT EXISTS refresh_count INTEGER NOT NULL DEFAULT 0;
      ALTER TABLE ip_logs ADD COLUMN IF NOT EXISTS country_name TEXT;
      ALTER TABLE ip_logs ADD COLUMN IF NOT EXISTS ts TIMESTAMPTZ NOT NULL DEFAULT NOW();

      DROP VIEW IF EXISTS app_users_latest_first;
      DROP VIEW IF EXISTS ip_logs_latest_first;
    `);

    await migrateLegacyProfiles(client);

    await client.query(`
      UPDATE app_users
      SET contact = COALESCE(contact, email)
      WHERE email IS NOT NULL;

      UPDATE ip_logs
      SET country_name = COALESCE(
        country_name,
        NULLIF(geo ->> 'countryName', ''),
        NULLIF(geo ->> 'country', '')
      )
      WHERE geo IS NOT NULL;

      ALTER TABLE app_users DROP COLUMN IF EXISTS user_id;
      ALTER TABLE app_users DROP COLUMN IF EXISTS email;
      ALTER TABLE app_users DROP COLUMN IF EXISTS country;
      ALTER TABLE app_users DROP COLUMN IF EXISTS area;
      ALTER TABLE app_users DROP COLUMN IF EXISTS lat;
      ALTER TABLE app_users DROP COLUMN IF EXISTS lon;
      ALTER TABLE ip_logs DROP COLUMN IF EXISTS geo;

      UPDATE reports_audit_log
      SET metadata = metadata - 'deletedProfiles'
      WHERE metadata ? 'deletedProfiles';

      CREATE INDEX IF NOT EXISTS ip_logs_ts_desc_idx ON ip_logs (ts DESC);

      CREATE OR REPLACE VIEW ip_logs_latest_first AS
      SELECT ip, country_name, ts
      FROM ip_logs
      ORDER BY ts DESC;

      CREATE OR REPLACE VIEW app_users_latest_first AS
      SELECT profile_id, anon_id, name, aims, interest, experience, contact,
             language, first_seen, last_seen, refresh_count
      FROM app_users
      ORDER BY last_seen DESC NULLS LAST, first_seen DESC, profile_id ASC;
    `);
    await client.query("COMMIT");
  } catch (error) {
    await client.query("ROLLBACK");
    throw error;
  } finally {
    client.release();
  }

  await pruneExpiredTelemetry(initPool);
}

async function pruneExpiredTelemetry(pool) {
  const telemetryRetentionDays = resolveTelemetryRetentionDays();
  if (telemetryRetentionDays != null) {
    await pool.query(
      `DELETE FROM app_users WHERE last_seen < NOW() - ($1::int * INTERVAL '1 day')`,
      [telemetryRetentionDays],
    );
    await pool.query(
      `DELETE FROM ip_logs WHERE ts < NOW() - ($1::int * INTERVAL '1 day')`,
      [telemetryRetentionDays],
    );
  }

  const auditRetentionDays = resolveAuditRetentionDays();
  if (auditRetentionDays != null) {
    await pool.query(
      `DELETE FROM reports_audit_log WHERE created_at < NOW() - ($1::int * INTERVAL '1 day')`,
      [auditRetentionDays],
    );
  }
}

async function saveProfile(fields = {}) {
  if (!writePool) return;
  const profileId = profileIdOf(fields);
  await writePool.query(
    `
      INSERT INTO app_users
        (profile_id, anon_id, name, aims, interest, experience, contact, language, first_seen, last_seen)
      VALUES ($1,$1,$2,$3,$4,$5,$6,$7,NOW(),NOW())
      ON CONFLICT (profile_id) DO UPDATE SET
        anon_id=EXCLUDED.anon_id,
        name=COALESCE(EXCLUDED.name, app_users.name),
        aims=COALESCE(EXCLUDED.aims, app_users.aims),
        interest=COALESCE(EXCLUDED.interest, app_users.interest),
        experience=COALESCE(EXCLUDED.experience, app_users.experience),
        contact=COALESCE(EXCLUDED.contact, app_users.contact),
        language=COALESCE(EXCLUDED.language, app_users.language),
        last_seen=NOW()
    `,
    [
      profileId,
      fields.name ?? null,
      fields.aims ?? null,
      fields.interest ?? null,
      fields.experience ?? null,
      fields.contact ?? null,
      fields.language ?? null,
    ],
  );
}

async function bumpRefresh(fields = {}) {
  if (!writePool) return;
  const profileId = profileIdOf(fields);
  await writePool.query(
    `
      INSERT INTO app_users
        (profile_id, anon_id, language, refresh_count, first_seen, last_seen)
      VALUES ($1,$1,$2,1,NOW(),NOW())
      ON CONFLICT (profile_id) DO UPDATE SET
        anon_id=EXCLUDED.anon_id,
        language=COALESCE(EXCLUDED.language, app_users.language),
        refresh_count=app_users.refresh_count + 1,
        last_seen=NOW()
    `,
    [profileId, fields.language ?? null],
  );
}

async function getUsersForDashboard() {
  if (!readPool) return [];
  const { rows } = await readPool.query(`
    SELECT profile_id, anon_id, name, aims, interest, experience, contact,
           language, first_seen, last_seen, refresh_count
    FROM app_users
    ORDER BY last_seen DESC NULLS LAST, first_seen DESC
  `);
  return rows;
}

async function getIpLocationsForDashboard() {
  if (!readPool) return [];
  const { rows } = await readPool.query(`
    SELECT ip, country_name, ts
    FROM (
      SELECT DISTINCT ON (ip) ip, country_name, ts
      FROM ip_logs
      WHERE country_name IS NOT NULL
      ORDER BY ip, ts DESC
    ) AS latest_by_ip
    ORDER BY ts DESC
  `);
  return rows.map((row) => ({
    ip: maskIp(row.ip) || "unknown",
    country: String(row.country_name || "").trim() || null,
    ts: row.ts,
  }));
}

async function saveIp(ip) {
  if (!writePool) return;
  const storedIp = String(ip || "unknown").trim() || "unknown";
  const geo = await enrichIp(storedIp);
  const countryName =
    String(geo?.countryName || geo?.country || "").trim() || null;
  await writePool.query(
    `INSERT INTO ip_logs (ip, country_name) VALUES ($1, $2)`,
    [storedIp, countryName],
  );
}

async function updateIpLocation() {
  return false;
}

async function deleteUserForDashboard(anonId, actor = {}) {
  if (!adminPool) throw new Error("Admin reports DB is not configured");

  const client = await adminPool.connect();
  try {
    await client.query("BEGIN");
    const deleted = await client.query(
      `DELETE FROM app_users WHERE anon_id = $1 RETURNING profile_id`,
      [anonId],
    );
    if (deleted.rowCount < 1) {
      await client.query("ROLLBACK");
      return false;
    }

    await client.query(
      `
        INSERT INTO reports_audit_log
          (action, anon_id, actor_user, actor_ip, actor_host, metadata)
        VALUES ($1, $2, $3, $4, $5, $6::jsonb)
      `,
      [
        "delete_user",
        anonId,
        actor.user || null,
        actor.ip || null,
        actor.host || null,
        JSON.stringify({ environment: actor.environment || null }),
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

async function closePools() {
  await Promise.all(
    [...new Set(poolCache.values())].map((pool) => pool.end?.()),
  );
}

module.exports = {
  bumpRefresh,
  closePools,
  deleteUserForDashboard,
  getIpLocationsForDashboard,
  getUsersForDashboard,
  init,
  pruneExpiredTelemetry,
  saveIp,
  saveProfile,
  updateIpLocation,
};
