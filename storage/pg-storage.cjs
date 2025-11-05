const { Pool } = require("pg");
const { enrichIp } = require("../utils/ipEnricher.cjs");

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.DB_SSL === "disable" ? false : { rejectUnauthorized: false },
});

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
      first_seen   TIMESTAMPTZ NOT NULL DEFAULT NOW(),
      last_seen    TIMESTAMPTZ NOT NULL DEFAULT NOW(),
      refresh_count INTEGER NOT NULL DEFAULT 0
    );

    CREATE TABLE IF NOT EXISTS ip_logs (
      ip           TEXT NOT NULL,
      ts           TIMESTAMPTZ NOT NULL DEFAULT NOW(),
      geo          JSONB
    );
  `);
}

function profileIdOf(f) {
  return (f.user_id || f.email || f.anon_id || "").toString().slice(0, 120);
}

async function saveProfile(f) {
  const pid = profileIdOf(f);
  if (!pid) throw new Error("identifier required");

  await pool.query(
    `
    INSERT INTO app_users
      (profile_id, anon_id, user_id, email, name, aims, interest, experience, contact, country, area, language, first_seen, last_seen)
    VALUES
      ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,NOW(),NOW())
    ON CONFLICT (profile_id) DO UPDATE SET
      anon_id=EXCLUDED.anon_id, user_id=EXCLUDED.user_id, email=EXCLUDED.email,
      name=EXCLUDED.name, aims=EXCLUDED.aims, interest=EXCLUDED.interest,
      experience=EXCLUDED.experience, contact=EXCLUDED.contact,
      country=EXCLUDED.country, area=EXCLUDED.area, language=EXCLUDED.language,
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
      f.country ?? null,
      f.area ?? null,
      f.language ?? null,
    ],
  );
}

async function bumpRefresh(f) {
  const pid = profileIdOf(f);
  if (!pid) throw new Error("identifier required");

  await pool.query(
    `
    INSERT INTO app_users (profile_id, anon_id, user_id, email, refresh_count, first_seen, last_seen)
    VALUES ($1, $2, $3, $4, 1, NOW(), NOW())
    ON CONFLICT (profile_id) DO UPDATE SET
      anon_id=COALESCE(EXCLUDED.anon_id, app_users.anon_id),
      user_id=COALESCE(EXCLUDED.user_id, app_users.user_id),
      email=COALESCE(EXCLUDED.email, app_users.email),
      refresh_count = app_users.refresh_count + 1,
      last_seen = NOW()
  `,
    [pid, f.anon_id || null, f.user_id || null, f.email || null],
  );
}

async function getUsersForDashboard() {
  const { rows } = await pool.query(`
    SELECT profile_id, name, aims, interest, experience, contact, country, area, language,
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
