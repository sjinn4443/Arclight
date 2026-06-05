/**
 * @jest-environment node
 */

const ORIGINAL_ENV = { ...process.env };

function loadPgStorageWithPool(envOverrides = {}) {
  jest.resetModules();
  process.env = {
    ...ORIGINAL_ENV,
    DATABASE_URL: "",
    REPORTS_READ_DATABASE_URL: "",
    REPORTS_ADMIN_DATABASE_URL: "",
    DB_SSL: "",
    DB_CA_CERT: "",
    DB_SSL_ALLOW_SELF_SIGNED: "",
    ...envOverrides,
  };

  const pools = [];
  const Pool = jest.fn((options) => {
    const pool = {
      options,
      query: jest.fn().mockResolvedValue({ rows: [], rowCount: 0 }),
      connect: jest.fn(),
    };
    pools.push(pool);
    return pool;
  });

  jest.doMock("pg", () => ({ Pool }));
  require("../storage/pg-storage.cjs");
  return { Pool, pools };
}

afterEach(() => {
  jest.resetModules();
  jest.restoreAllMocks();
  process.env = { ...ORIGINAL_ENV };
});

describe("Postgres SSL configuration", () => {
  test("allows Railway internal Postgres self-signed certificates", () => {
    const { pools } = loadPgStorageWithPool({
      DATABASE_URL:
        "postgresql://postgres:password@postgres.railway.internal:5432/railway",
    });

    expect(pools[0].options.ssl).toEqual({ rejectUnauthorized: false });
  });

  test("keeps certificate verification for external Postgres hosts by default", () => {
    const { pools } = loadPgStorageWithPool({
      DATABASE_URL: "postgresql://postgres:password@db.example.com:5432/app",
    });

    expect(pools[0].options.ssl).toEqual({ rejectUnauthorized: true });
  });

  test("uses an explicit CA certificate when configured", () => {
    const { pools } = loadPgStorageWithPool({
      DATABASE_URL:
        "postgresql://postgres:password@postgres.railway.internal:5432/railway",
      DB_CA_CERT:
        "-----BEGIN CERTIFICATE-----\\nabc\\n-----END CERTIFICATE-----",
    });

    expect(pools[0].options.ssl).toEqual({
      rejectUnauthorized: true,
      ca: "-----BEGIN CERTIFICATE-----\nabc\n-----END CERTIFICATE-----",
    });
  });
});
