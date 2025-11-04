const { Pool } = require("pg");

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.DB_SSL === "disable" ? false : { rejectUnauthorized: false },
});

async function init() {
  await pool.query(`
    CREATE TABLE IF NOT EXISTS app_users (
      id BIGSERIAL PRIMARY KEY,
      name TEXT,
      aims TEXT,
      interest TEXT,
      experience TEXT,
      contact TEXT,
      country TEXT,
      area TEXT,
      language TEXT,
      first_seen TIMESTAMPTZ NOT NULL DEFAULT NOW(),
      last_seen  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
      refresh_count INTEGER NOT NULL DEFAULT 0
    );
  `);
  // ensure singleton row exists (id = 1). You can switch to multi-user later.
  await pool.query(`
    INSERT INTO app_users (id) VALUES (1)
    ON CONFLICT (id) DO NOTHING;
  `);
}

async function saveProfile(f) {
  await pool.query(
    `
    UPDATE app_users
       SET name=$1, aims=$2, interest=$3, experience=$4, contact=$5,
           country=$6, area=$7, language=$8, last_seen=NOW()
     WHERE id=1
  `,
    [
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

async function bumpRefresh() {
  await pool.query(`
    UPDATE app_users
       SET refresh_count = refresh_count + 1,
           last_seen = NOW()
     WHERE id=1
  `);
}

async function getUsersForDashboard() {
  const { rows } = await pool.query(`
    SELECT name, aims, interest, experience, contact,
           country, area, language,
           first_seen, last_seen, refresh_count
      FROM app_users
     WHERE id=1
  `);
  return rows.length ? rows : [];
}

module.exports = { init, saveProfile, bumpRefresh, getUsersForDashboard };
