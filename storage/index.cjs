const hasPostgres =
  !!process.env.DATABASE_URL ||
  !!process.env.REPORTS_READ_DATABASE_URL ||
  !!process.env.REPORTS_ADMIN_DATABASE_URL;

module.exports = hasPostgres
  ? require("./pg-storage.cjs")
  : require("./disabled-storage.cjs");
