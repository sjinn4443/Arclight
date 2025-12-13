// In test environment we always prefer the local NDJSON store so unit tests
// never depend on external DB connectivity.
const isPg = !!process.env.DATABASE_URL && process.env.NODE_ENV !== "test";
module.exports = isPg
  ? require("./pg-storage.cjs")
  : require("./ndjson-storage.cjs");
