require("dotenv").config();

const fs = require("fs");
const path = require("path");
const { assertRuntimeConfig } = require("../security/runtime-config.cjs");

async function run() {
  assertRuntimeConfig();

  const ndjsonStorage = require("../storage/ndjson-storage.cjs");
  await ndjsonStorage.scrubTelemetryFileAsync();
  const reportsDataDir = path.join(__dirname, "..", "reports", "data");
  for (const obsoleteExport of ["telemetry.sql", "users.json"]) {
    fs.rmSync(path.join(reportsDataDir, obsoleteExport), { force: true });
  }

  if (
    process.env.DATABASE_URL ||
    process.env.REPORTS_READ_DATABASE_URL ||
    process.env.REPORTS_ADMIN_DATABASE_URL
  ) {
    const pgStorage = require("../storage/pg-storage.cjs");
    try {
      await pgStorage.init();
    } finally {
      await pgStorage.closePools();
    }
  }

  console.log(
    "Security data migration complete: legacy identifiers were rekeyed and precise location fields were removed.",
  );
}

run().catch((error) => {
  console.error("Security data migration failed:", error.message);
  process.exitCode = 1;
});
