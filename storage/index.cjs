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

module.exports =
  hasPostgres && !disableStorage
    ? require("./pg-storage.cjs")
    : require("./disabled-storage.cjs");
