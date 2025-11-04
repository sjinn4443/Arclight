const isPg = !!process.env.DATABASE_URL;
module.exports = isPg
  ? require("./pg-storage.cjs")
  : require("./ndjson-storage.cjs");
