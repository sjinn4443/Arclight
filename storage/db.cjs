const { Pool } = require("pg");

if (!process.env.DATABASE_URL) {
  throw new Error("DATABASE_URL is not set");
}

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  // Keep SSL default; env DB_SSL can be used to disable in local dev.
  ssl: process.env.DB_SSL === "disable" ? false : undefined,
});

module.exports = { pool };
