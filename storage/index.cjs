// Prefer a local NDJSON store outside production so local/dev/test never depend
// on external DB connectivity.
//
// Production (Railway) uses Postgres when DATABASE_URL is present.
const isPg =
  process.env.NODE_ENV === "production" && !!process.env.DATABASE_URL;

module.exports = isPg
  ? require("./pg-storage.cjs")
  : require("./ndjson-storage.cjs");
