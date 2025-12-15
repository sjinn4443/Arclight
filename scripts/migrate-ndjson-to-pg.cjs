#!/usr/bin/env node
/*
  Migration script: reads reports/data/telemetry.ndjson (encrypted lines),
  decrypts them using existing encrypt.cjs, and inserts rows into Postgres using storage/pg-storage.cjs schema.

  Usage:
    DATABASE_URL=postgres://... node scripts/migrate-ndjson-to-pg.cjs
*/

const fs = require("fs");
const path = require("path");
const { pool } = require("../storage/db.cjs");
const { decrypt } = require("../reports/security/encrypt.cjs");

async function run() {
  const file = path.join(
    __dirname,
    "..",
    "reports",
    "data",
    "telemetry.ndjson",
  );
  if (!fs.existsSync(file)) {
    console.error("NDJSON file not found:", file);
    process.exit(1);
  }

  const lines = fs
    .readFileSync(file, "utf8")
    .trim()
    .split("\n")
    .filter(Boolean);
  console.log("Found", lines.length, "lines");

  await pool.query("BEGIN");
  try {
    for (const enc of lines) {
      let row;
      try {
        row = JSON.parse(decrypt(enc));
      } catch (e) {
        console.error("Skipping line - decrypt/parse failed:", e.message);
        continue;
      }

      if (row.type === "profile") {
        const pid = (row.user_id || row.email || row.anon_id || "")
          .toString()
          .slice(0, 120);
        if (!pid) continue;
        await pool.query(
          `INSERT INTO app_users (profile_id, anon_id, user_id, email, name, aims, interest, experience, contact, country, area, language, first_seen, last_seen)
           VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14)
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
             last_seen = GREATEST(app_users.last_seen, EXCLUDED.last_seen)
          `,
          [
            pid,
            row.anon_id || null,
            row.user_id || null,
            row.email || null,
            row.name || null,
            row.aims || null,
            row.interest || null,
            row.experience || null,
            row.contact || null,
            row.country || null,
            row.area || null,
            row.language || null,
            row.ts || null,
            row.ts || null,
          ],
        );
      } else if (row.type === "refresh") {
        const pid = (row.user_id || row.email || row.anon_id || "")
          .toString()
          .slice(0, 120);
        if (!pid) continue;
        await pool.query(
          `INSERT INTO app_users (profile_id, anon_id, user_id, email, refresh_count, first_seen, last_seen)
           VALUES ($1,$2,$3,$4, 1, $5, $6)
           ON CONFLICT (profile_id) DO UPDATE SET
             anon_id=COALESCE(EXCLUDED.anon_id, app_users.anon_id),
             user_id=COALESCE(EXCLUDED.user_id, app_users.user_id),
             email=COALESCE(EXCLUDED.email, app_users.email),
             refresh_count = app_users.refresh_count + 1,
             last_seen = GREATEST(app_users.last_seen, EXCLUDED.last_seen)
          `,
          [
            pid,
            row.anon_id || null,
            row.user_id || null,
            row.email || null,
            row.ts || null,
            row.ts || null,
          ],
        );
      } else if (row.type === "ip") {
        await pool.query(
          `INSERT INTO ip_logs (ip, ts, geo) VALUES ($1, $2, $3)`,
          [row.ip || null, row.ts || null, row.geo || null],
        );
      }
    }

    await pool.query("COMMIT");
    console.log("Migration completed");
  } catch (e) {
    await pool.query("ROLLBACK");
    console.error("Migration failed, rolled back:", e.message);
    process.exit(1);
  } finally {
    pool.end();
  }
}

run().catch((err) => {
  console.error(err);
  process.exit(1);
});
