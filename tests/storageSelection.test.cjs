/**
 * @jest-environment node
 */

const ORIGINAL_ENV = { ...process.env };

function loadStorage(envOverrides = {}) {
  jest.resetModules();
  process.env = {
    ...ORIGINAL_ENV,
    DATABASE_URL: "",
    REPORTS_READ_DATABASE_URL: "",
    REPORTS_ADMIN_DATABASE_URL: "",
    DISABLE_DB_STORAGE: "",
    ...envOverrides,
  };

  const pgStorage = { kind: "pg" };
  const ndjsonStorage = { kind: "ndjson" };
  const disabledStorage = { kind: "disabled" };

  jest.doMock("../storage/pg-storage.cjs", () => pgStorage);
  jest.doMock("../storage/ndjson-storage.cjs", () => ndjsonStorage);
  jest.doMock("../storage/disabled-storage.cjs", () => disabledStorage);

  return require("../storage/index.cjs");
}

afterEach(() => {
  jest.resetModules();
  jest.restoreAllMocks();
  process.env = { ...ORIGINAL_ENV };
});

describe("storage selection", () => {
  test("uses NDJSON storage in non-production when no Postgres URL is configured", () => {
    expect(loadStorage()).toEqual({ kind: "ndjson" });
  });

  test("uses disabled storage in production when no Postgres URL is configured", () => {
    expect(loadStorage({ NODE_ENV: "production" })).toEqual({
      kind: "disabled",
    });
  });

  test("allows production NDJSON storage only when explicitly enabled", () => {
    expect(
      loadStorage({
        NODE_ENV: "production",
        ENABLE_NDJSON_STORAGE: "true",
      }),
    ).toEqual({ kind: "ndjson" });
  });

  test("uses Postgres storage when a database URL is configured", () => {
    expect(loadStorage({ DATABASE_URL: "postgres://example/db" })).toEqual({
      kind: "pg",
    });
  });

  test("uses disabled storage when explicitly forced off", () => {
    expect(
      loadStorage({
        DATABASE_URL: "postgres://example/db",
        DISABLE_DB_STORAGE: "1",
      }),
    ).toEqual({ kind: "disabled" });
  });
});
