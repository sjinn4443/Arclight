/**
 * @jest-environment node
 */

const ORIGINAL_ENV = { ...process.env };

function loadPgStorage() {
  jest.resetModules();
  process.env = {
    ...ORIGINAL_ENV,
    DATABASE_URL: "postgresql://postgres:password@localhost:5432/arclight",
    REPORTS_READ_DATABASE_URL: "",
    REPORTS_ADMIN_DATABASE_URL: "",
    DB_SSL: "disable",
  };

  const pool = {
    query: jest.fn().mockResolvedValue({ rows: [], rowCount: 0 }),
    connect: jest.fn(),
  };
  const Pool = jest.fn(() => pool);
  const enrichIp = jest.fn().mockResolvedValue({
    source: "ipinfo",
    country: "United Kingdom",
    countryName: "United Kingdom",
    countryCode: "GB",
    city: "London",
    latitude: 51.5072,
    longitude: -0.1276,
    error: null,
  });

  jest.doMock("pg", () => ({ Pool }));
  jest.doMock("../utils/ipEnricher.cjs", () => ({ enrichIp }));

  return {
    storage: require("../storage/pg-storage.cjs"),
    pool,
    enrichIp,
  };
}

afterEach(() => {
  jest.resetModules();
  jest.restoreAllMocks();
  process.env = { ...ORIGINAL_ENV };
});

describe("Postgres IP storage", () => {
  test("adds the country_name column and stores the full IP with country", async () => {
    const { storage, pool, enrichIp } = loadPgStorage();

    await storage.init();
    const schemaSql = pool.query.mock.calls[0][0];
    expect(schemaSql).toContain("country_name TEXT");
    expect(schemaSql).toContain(
      "ALTER TABLE ip_logs ADD COLUMN IF NOT EXISTS country_name TEXT",
    );

    await storage.saveIp("203.0.113.25");

    expect(enrichIp).toHaveBeenCalledWith("203.0.113.25");
    const [insertSql, values] = pool.query.mock.calls.at(-1);
    expect(insertSql).toContain("INSERT INTO ip_logs (ip, country_name, geo)");
    expect(values[0]).toBe("203.0.113.25");
    expect(values[1]).toBe("United Kingdom");
    expect(values[2]).toMatchObject({
      countryName: "United Kingdom",
      countryCode: "GB",
    });
  });
});
