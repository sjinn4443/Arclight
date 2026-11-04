const crypto = require("node:crypto");
const fs = require("node:fs/promises");
const path = require("node:path");
const PUSH_CONFIG_ID = "__web_push_config";

// The callback serializes updates and delivery for each device. Production uses
// row locks so multiple app replicas cannot send the same milestone concurrently.
function createMemoryReminderStore({ file, encrypt, decrypt } = {}) {
  let data = {};
  let ready;
  let queue = Promise.resolve();
  const run = (operation) => {
    const result = queue.then(async () => {
      ready ||= (async () => {
        if (!file) return;
        try {
          data = JSON.parse(decrypt(await fs.readFile(file, "utf8")));
        } catch (error) {
          if (error.code !== "ENOENT") throw error;
        }
      })();
      await ready;
      const draft = structuredClone(data);
      const result = await operation(draft);
      if (file) {
        await fs.mkdir(path.dirname(file), { recursive: true });
        const temporary = `${file}.${crypto.randomUUID()}.tmp`;
        await fs.writeFile(temporary, encrypt(JSON.stringify(draft)), {
          mode: 0o600,
        });
        await fs.rename(temporary, file);
      }
      data = draft;
      return result;
    });
    queue = result.catch(() => {});
    return result;
  };
  return {
    async ready() {
      await run(() => {});
    },
    ids: () =>
      run((db) => Object.keys(db).filter((id) => id !== PUSH_CONFIG_ID)),
    getOrCreatePushConfig: (create) =>
      run((db) => {
        db[PUSH_CONFIG_ID] ||= create();
        return structuredClone(db[PUSH_CONFIG_ID]);
      }),
    mutate: (id, operation) =>
      run(async (db) => {
        const next = await operation(db[id] || null);
        if (
          next &&
          Object.entries(db).some(
            ([key, row]) =>
              key !== id && row.endpointHash === next.endpointHash,
          )
        )
          throw Object.assign(new Error("subscription_conflict"), {
            status: 409,
          });
        if (next) db[id] = next;
        else delete db[id];
        return next;
      }),
  };
}

function createPostgresReminderStore(connectionString) {
  const { Pool } = require("pg");
  const host = new URL(connectionString).hostname;
  const local = ["localhost", "127.0.0.1", "[::1]"].includes(host);
  const ssl =
    process.env.DB_SSL === "disable" || local
      ? false
      : {
          rejectUnauthorized: !(
            host.endsWith(".railway.internal") ||
            process.env.DB_SSL_ALLOW_SELF_SIGNED === "true"
          ),
          ...(process.env.DB_CA_CERT
            ? {
                ca: process.env.DB_CA_CERT.replace(/\\n/g, "\n"),
                rejectUnauthorized: true,
              }
            : {}),
        };
  const pool = new Pool({
    connectionString,
    ssl,
    max: 3,
    connectionTimeoutMillis: 10000,
  });
  let schema;
  const ready = () =>
    (schema ||= pool
      .query(
        `CREATE TABLE IF NOT EXISTS practice_reminders (
    id TEXT PRIMARY KEY, endpoint_hash TEXT UNIQUE NOT NULL, data JSONB NOT NULL
  );
  CREATE TABLE IF NOT EXISTS practice_reminder_settings (
    id TEXT PRIMARY KEY, data JSONB NOT NULL
  )`,
      )
      .catch((error) => {
        schema = null;
        throw error;
      }));
  return {
    ready,
    async getOrCreatePushConfig(create) {
      await ready();
      const existing = (
        await pool.query(
          "SELECT data FROM practice_reminder_settings WHERE id=$1",
          [PUSH_CONFIG_ID],
        )
      ).rows[0];
      if (existing) return existing.data;
      // Concurrent replicas retain the winning key pair rather than rotating it.
      return (
        await pool.query(
          `INSERT INTO practice_reminder_settings (id, data) VALUES ($1,$2)
        ON CONFLICT (id) DO UPDATE SET id=EXCLUDED.id RETURNING data`,
          [PUSH_CONFIG_ID, JSON.stringify(create())],
        )
      ).rows[0].data;
    },
    async ids() {
      await ready();
      return (
        await pool.query(
          "SELECT id FROM practice_reminders WHERE (data->>'sentMilestone')::int < 30",
        )
      ).rows.map((r) => r.id);
    },
    async mutate(id, operation) {
      await ready();
      const client = await pool.connect();
      try {
        await client.query("BEGIN");
        // Also locks first-time inserts for this device.
        await client.query(
          "SELECT pg_advisory_xact_lock(hashtextextended($1, 0))",
          [id],
        );
        const previous =
          (
            await client.query(
              "SELECT data FROM practice_reminders WHERE id=$1 FOR UPDATE",
              [id],
            )
          ).rows[0]?.data || null;
        const next = await operation(previous);
        if (next)
          await client.query(
            `INSERT INTO practice_reminders (id, endpoint_hash, data) VALUES ($1,$2,$3)
          ON CONFLICT (id) DO UPDATE SET endpoint_hash=EXCLUDED.endpoint_hash, data=EXCLUDED.data`,
            [id, next.endpointHash, JSON.stringify(next)],
          );
        else
          await client.query("DELETE FROM practice_reminders WHERE id=$1", [
            id,
          ]);
        await client.query("COMMIT");
        return next;
      } catch (error) {
        await client.query("ROLLBACK");
        if (error.code === "23505")
          throw Object.assign(new Error("subscription_conflict"), {
            status: 409,
          });
        throw error;
      } finally {
        client.release();
      }
    },
    close: () => pool.end(),
  };
}

let store;
function getReminderStore() {
  if (store) return store;
  if (
    process.env.NODE_ENV === "test" ||
    /^(1|true)$/i.test(process.env.DISABLE_DB_STORAGE || "")
  )
    throw new Error("reminder_storage_disabled");
  if (process.env.DATABASE_URL && process.env.REMINDER_STORAGE !== "file")
    return (store = createPostgresReminderStore(process.env.DATABASE_URL));
  if (
    process.env.NODE_ENV !== "production" &&
    process.env.ENCRYPTION_SECRET?.length >= 32
  ) {
    const { encrypt, decrypt } = require("../reports/security/encrypt.cjs");
    return (store = createMemoryReminderStore({
      file: path.join(__dirname, "../reports/data/reminders.enc"),
      encrypt,
      decrypt,
    }));
  }
  throw new Error("reminder_storage_unavailable");
}

module.exports = {
  createMemoryReminderStore,
  createPostgresReminderStore,
  getReminderStore,
};
