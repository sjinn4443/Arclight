function isEnabled(value) {
  return ["1", "true", "yes", "on"].includes(
    String(value || "")
      .trim()
      .toLowerCase(),
  );
}

const hasPostgres =
  !!process.env.DATABASE_URL ||
  !!process.env.REPORTS_READ_DATABASE_URL ||
  !!process.env.REPORTS_ADMIN_DATABASE_URL;

const disableStorage = isEnabled(process.env.DISABLE_DB_STORAGE);
const allowNdjsonStorage =
  process.env.NODE_ENV !== "production" ||
  isEnabled(process.env.ENABLE_NDJSON_STORAGE);

module.exports = disableStorage
  ? require("./disabled-storage.cjs")
  : hasPostgres
    ? require("./pg-storage.cjs")
    : allowNdjsonStorage
      ? require("./ndjson-storage.cjs")
      : require("./disabled-storage.cjs");
