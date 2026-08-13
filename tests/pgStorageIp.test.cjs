/**
 * @jest-environment node
 */

const ORIGINAL_ENV = { ...process.env };
const PROFILE_ID = `session_${"a".repeat(43)}`;

function loadPgStorage() {
  jest.resetModules();
  process.env = {
    ...ORIGINAL_ENV,
    DATABASE_URL: "postgresql://postgres:password@localhost:5432/arclight",
    REPORTS_READ_DATABASE_URL: "",
    REPORTS_ADMIN_DATABASE_URL: "",
    DB_SSL: "disable",
    TELEMETRY_TOKEN_SECRET: "test-telemetry-token-secret-0123456789abcdef",
  };

  const client = {
    query: jest.fn(async (sql) => {
      if (String(sql).includes("SELECT profile_id")) {
        return { rows: [], rowCount: 0 };
      }
      return { rows: [], rowCount: 0 };
    }),
    release: jest.fn(),
  };
  const pool = {
    query: jest.fn().mockResolvedValue({ rows: [], rowCount: 0 }),
    connect: jest.fn().mockResolvedValue(client),
  };
  const Pool = jest.fn(() => pool);
  const enrichIp = jest.fn().mockResolvedValue({
    source: "ipinfo",
    country: "United Kingdom",
    countryName: "United Kingdom",
    countryCode: "GB",
    error: null,
  });

  jest.doMock("pg", () => ({ Pool }));
  jest.doMock("../utils/ipEnricher.cjs", () => ({ enrichIp }));

  return {
    storage: require("../storage/pg-storage.cjs"),
    client,
    pool,
    enrichIp,
  };
}

afterEach(() => {
  jest.resetModules();
  jest.restoreAllMocks();
  process.env = { ...ORIGINAL_ENV };
});

describe("Postgres minimized telemetry storage", () => {
  test("migrates away precise geo and client-controlled identity columns", async () => {
    const { storage, client } = loadPgStorage();

    await storage.init();
    const schemaSql = client.query.mock.calls
      .map(([sql]) => String(sql))
      .join("\n");
    expect(schemaSql).toContain("country_name TEXT");
    expect(schemaSql).toContain(
      "ALTER TABLE app_users DROP COLUMN IF EXISTS user_id",
    );
    expect(schemaSql).toContain(
      "ALTER TABLE app_users DROP COLUMN IF EXISTS email",
    );
    expect(schemaSql).toContain(
      "ALTER TABLE app_users DROP COLUMN IF EXISTS country",
    );
    expect(schemaSql).toContain(
      "ALTER TABLE app_users DROP COLUMN IF EXISTS area",
    );
    expect(schemaSql).toContain(
      "ALTER TABLE app_users DROP COLUMN IF EXISTS lat",
    );
    expect(schemaSql).toContain(
      "ALTER TABLE app_users DROP COLUMN IF EXISTS lon",
    );
    expect(schemaSql).toContain(
      "ALTER TABLE ip_logs DROP COLUMN IF EXISTS geo",
    );
    expect(schemaSql).toContain("SELECT ip, country_name, ts");
    expect(schemaSql).toContain("VIEW app_users_latest_first");
    expect(client.release).toHaveBeenCalledTimes(1);
  });

  test("stores the full IP with only country name and timestamp metadata", async () => {
    const { storage, pool, enrichIp } = loadPgStorage();

    await storage.saveIp("203.0.113.25");

    expect(enrichIp).toHaveBeenCalledWith("203.0.113.25");
    const [insertSql, values] = pool.query.mock.calls.at(-1);
    expect(insertSql).toContain("INSERT INTO ip_logs (ip, country_name)");
    expect(insertSql).not.toContain("geo");
    expect(values).toEqual(["203.0.113.25", "United Kingdom"]);
  });

  test("never writes browser location updates", async () => {
    const { storage, pool } = loadPgStorage();

    await expect(
      storage.updateIpLocation("152.233.29.4", {
        lat: 55.8642,
        lon: -4.2518,
        isPrecise: true,
      }),
    ).resolves.toBe(false);
    expect(pool.query).not.toHaveBeenCalled();
  });

  test("requires the server-derived profile id and omits location fields", async () => {
    const { storage, pool } = loadPgStorage();

    await expect(
      storage.saveProfile({ anon_id: "attacker", name: "Mallory" }),
    ).rejects.toThrow(/server-derived profile identifier/);

    await storage.saveProfile({
      profile_id: PROFILE_ID,
      name: "Alice",
      country: "ignored",
      lat: 51.5,
    });
    const [sql, values] = pool.query.mock.calls.at(-1);
    expect(sql).not.toMatch(/country|\blat\b|\blon\b|user_id|email/);
    expect(values[0]).toBe(PROFILE_ID);
    expect(values).not.toContain("ignored");
  });

  test("returns one masked country record per latest IP", async () => {
    const { storage, pool } = loadPgStorage();
    pool.query.mockResolvedValueOnce({
      rowCount: 1,
      rows: [
        {
          ip: "152.233.29.4",
          ts: "2026-07-13T14:56:03.000Z",
          country_name: "United Kingdom",
        },
      ],
    });

    const locations = await storage.getIpLocationsForDashboard();

    expect(pool.query.mock.calls[0][0]).toContain("DISTINCT ON (ip)");
    expect(locations).toEqual([
      {
        ip: "152.233.29.x",
        country: "United Kingdom",
        ts: "2026-07-13T14:56:03.000Z",
      },
    ]);
    expect(locations[0]).not.toHaveProperty("lat");
    expect(locations[0]).not.toHaveProperty("lon");
    expect(locations[0]).not.toHaveProperty("city");
  });
});
