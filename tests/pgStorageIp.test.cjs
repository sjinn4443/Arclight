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
    expect(schemaSql).toContain("ip_logs_ts_desc_idx");
    expect(schemaSql).toContain("VIEW ip_logs_latest_first");
    expect(schemaSql).toContain("ORDER BY ts DESC");
    expect(schemaSql).toContain("VIEW app_users_latest_first");
    expect(schemaSql).toContain(
      "ORDER BY last_seen DESC NULLS LAST, first_seen DESC, profile_id ASC",
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

  test("updates the latest visit with precise browser geo", async () => {
    const { storage, pool } = loadPgStorage();
    pool.query.mockResolvedValueOnce({ rows: [], rowCount: 1 });

    const updated = await storage.updateIpLocation("152.233.29.4", {
      iso2: "GB",
      country: "United Kingdom",
      city: "Glasgow",
      area: "Glasgow, Scotland, UK",
      lat: 55.8642,
      lon: -4.2518,
      isPrecise: true,
    });

    expect(updated).toBe(true);
    expect(pool.query).toHaveBeenCalledTimes(1);
    const [updateSql, values] = pool.query.mock.calls[0];
    expect(updateSql).toContain("UPDATE ip_logs AS logs");
    expect(updateSql).toContain("ORDER BY ts DESC");
    expect(values[0]).toBe("152.233.29.4");
    expect(values[1]).toBe("United Kingdom");
    expect(values[2]).toMatchObject({
      source: "browser_geolocation",
      countryName: "United Kingdom",
      city: "Glasgow",
      area: "Glasgow, Scotland, UK",
      latitude: 55.8642,
      longitude: -4.2518,
      isPrecise: true,
    });
  });

  test("returns dashboard users newest first", async () => {
    const { storage, pool } = loadPgStorage();

    await storage.getUsersForDashboard();

    expect(pool.query.mock.calls[0][0]).toContain(
      "ORDER BY last_seen DESC NULLS LAST, first_seen DESC",
    );
  });

  test("returns one masked, mappable location per latest IP", async () => {
    const { storage, pool } = loadPgStorage();
    pool.query.mockResolvedValueOnce({
      rowCount: 1,
      rows: [
        {
          ip: "152.233.29.4",
          ts: "2026-07-13T14:56:03.000Z",
          country_name: "United Kingdom",
          geo: {
            source: "browser_geolocation",
            countryCode: "GB",
            city: "Glasgow",
            area: "Glasgow, Scotland, UK",
            latitude: 55.8642,
            longitude: -4.2518,
            isPrecise: true,
          },
        },
      ],
    });

    const locations = await storage.getIpLocationsForDashboard();

    expect(pool.query.mock.calls[0][0]).toContain("DISTINCT ON (ip)");
    expect(pool.query.mock.calls[0][0]).toContain("ORDER BY ts DESC");
    expect(locations).toEqual([
      expect.objectContaining({
        ip: "152.233.29.x",
        country: "United Kingdom",
        city: "Glasgow",
        lat: 55.8642,
        lon: -4.2518,
        isPrecise: true,
      }),
    ]);
  });
});
