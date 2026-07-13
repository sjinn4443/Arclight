const fs = require("fs");
const path = require("path");
const { decrypt } = require("../reports/security/encrypt.cjs");

function esc(v) {
  if (v === null || v === undefined) return "NULL";
  // convert to string and escape single quotes for SQL
  return "'" + String(v).replace(/'/g, "''") + "'";
}

(async function () {
  const inPath = path.join(
    __dirname,
    "..",
    "reports",
    "data",
    "telemetry.ndjson",
  );
  const outPath = path.join(
    __dirname,
    "..",
    "reports",
    "data",
    "telemetry.sql",
  );

  if (!fs.existsSync(inPath)) {
    console.error("Input NDJSON not found:", inPath);
    process.exit(1);
  }

  const lines = fs
    .readFileSync(inPath, "utf8")
    .trim()
    .split("\n")
    .filter(Boolean);
  const out = [];
  out.push("-- SQL export generated from telemetry.ndjson");
  out.push("BEGIN;");

  for (const enc of lines) {
    let raw;
    try {
      raw = decrypt(enc);
    } catch (e) {
      console.error("Decrypt failed, skipping line");
      continue;
    }
    let row;
    try {
      row = JSON.parse(raw);
    } catch (e) {
      console.error("JSON parse failed, skipping");
      continue;
    }

    if (row.type === "profile") {
      const pid = (row.user_id || row.email || row.anon_id || "")
        .toString()
        .slice(0, 120);
      if (!pid) continue;
      out.push(
        `INSERT INTO app_users (profile_id, anon_id, user_id, email, name, aims, interest, experience, contact, country, area, language, first_seen, last_seen) VALUES (${esc(pid)}, ${esc(row.anon_id)}, ${esc(row.user_id)}, ${esc(row.email)}, ${esc(row.name)}, ${esc(row.aims)}, ${esc(row.interest)}, ${esc(row.experience)}, ${esc(row.contact)}, ${esc(row.country)}, ${esc(row.area)}, ${esc(row.language)}, ${esc(row.ts)}, ${esc(row.ts)}) ON CONFLICT (profile_id) DO UPDATE SET anon_id=COALESCE(EXCLUDED.anon_id, app_users.anon_id), user_id=COALESCE(EXCLUDED.user_id, app_users.user_id), email=COALESCE(EXCLUDED.email, app_users.email), name=COALESCE(EXCLUDED.name, app_users.name), aims=COALESCE(EXCLUDED.aims, app_users.aims), interest=COALESCE(EXCLUDED.interest, app_users.interest), experience=COALESCE(EXCLUDED.experience, app_users.experience), contact=COALESCE(EXCLUDED.contact, app_users.contact), country=COALESCE(EXCLUDED.country, app_users.country), area=COALESCE(EXCLUDED.area, app_users.area), language=COALESCE(EXCLUDED.language, app_users.language), last_seen = GREATEST(app_users.last_seen, EXCLUDED.last_seen);`,
      );
    } else if (row.type === "refresh") {
      const pid = (row.user_id || row.email || row.anon_id || "")
        .toString()
        .slice(0, 120);
      if (!pid) continue;
      out.push(
        `INSERT INTO app_users (profile_id, anon_id, user_id, email, refresh_count, first_seen, last_seen) VALUES (${esc(pid)}, ${esc(row.anon_id)}, ${esc(row.user_id)}, ${esc(row.email)}, 1, ${esc(row.ts)}, ${esc(row.ts)}) ON CONFLICT (profile_id) DO UPDATE SET anon_id=COALESCE(EXCLUDED.anon_id, app_users.anon_id), user_id=COALESCE(EXCLUDED.user_id, app_users.user_id), email=COALESCE(EXCLUDED.email, app_users.email), refresh_count = app_users.refresh_count + 1, last_seen = GREATEST(app_users.last_seen, EXCLUDED.last_seen);`,
      );
    } else if (row.type === "ip") {
      const countryName = row.geo?.countryName || row.geo?.country || null;
      out.push(
        `INSERT INTO ip_logs (ip, country_name, ts, geo) VALUES (${esc(row.ip)}, ${esc(countryName)}, ${esc(row.ts)}, ${row.geo ? `'${JSON.stringify(row.geo).replace(/'/g, "''")}'` : "NULL"});`,
      );
    }
  }

  out.push("COMMIT;");
  fs.writeFileSync(outPath, out.join("\n") + "\n", "utf8");
  console.log("Wrote SQL to", outPath);
})();
