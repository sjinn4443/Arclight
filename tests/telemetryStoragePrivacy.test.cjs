/**
 * @jest-environment node
 */

const fs = require("fs");
const os = require("os");
const path = require("path");

const ORIGINAL_ENV = { ...process.env };
let tempDir;

function loadStorage() {
  jest.resetModules();
  tempDir = fs.mkdtempSync(path.join(os.tmpdir(), "arclight-telemetry-test-"));
  process.env = {
    ...ORIGINAL_ENV,
    TELEMETRY_DATA_DIR: tempDir,
    ENCRYPTION_SECRET:
      "0123456789abcdef0123456789abcdef0123456789abcdef0123456789abcdef",
    TELEMETRY_TOKEN_SECRET: "test-telemetry-token-secret-0123456789abcdef",
  };
  const enrichIp = jest.fn().mockResolvedValue({
    country: "United Kingdom",
    countryName: "United Kingdom",
    countryCode: "GB",
  });
  jest.doMock("../utils/ipEnricher.cjs", () => ({ enrichIp }));
  return {
    decrypt: require("../reports/security/encrypt.cjs").decrypt,
    storage: require("../storage/ndjson-storage.cjs"),
  };
}

function readRows(decrypt) {
  const file = path.join(tempDir, "telemetry.ndjson");
  return fs
    .readFileSync(file, "utf8")
    .split(/\r?\n/)
    .filter(Boolean)
    .map((line) => JSON.parse(decrypt(line)));
}

afterEach(() => {
  jest.resetModules();
  jest.restoreAllMocks();
  process.env = { ...ORIGINAL_ENV };
  if (tempDir?.startsWith(os.tmpdir())) {
    fs.rmSync(tempDir, { force: true, recursive: true });
  }
});

describe("NDJSON telemetry minimization", () => {
  test("stores server-derived profiles and country-only masked IP records", async () => {
    const { decrypt, storage } = loadStorage();
    const profileId = `session_${"a".repeat(43)}`;

    await storage.saveProfile({
      profile_id: profileId,
      name: "Alice",
      country: "ignored",
      area: "ignored",
      lat: 51.5,
      lon: -0.1,
      geo: { lat: 51.5, lon: -0.1, city: "London" },
    });
    await storage.saveIp("203.0.113.25");

    const rows = readRows(decrypt);
    expect(rows[0]).toMatchObject({
      type: "profile",
      profile_id: profileId,
      anon_id: profileId,
      name: "Alice",
    });
    expect(rows[0]).not.toHaveProperty("country");
    expect(rows[0]).not.toHaveProperty("area");
    expect(rows[0]).not.toHaveProperty("lat");
    expect(rows[0]).not.toHaveProperty("lon");
    expect(rows[0]).not.toHaveProperty("geo");
    expect(rows[1]).toEqual({
      type: "ip",
      ts: expect.any(String),
      ip: "203.0.113.x",
      country_name: "United Kingdom",
    });
  });

  test("scrubs and encrypts legacy identity and precise-location fields", () => {
    const { decrypt, storage } = loadStorage();
    const file = path.join(tempDir, "telemetry.ndjson");
    fs.writeFileSync(
      file,
      `${JSON.stringify({
        type: "profile",
        ts: "2026-07-15T10:00:00.000Z",
        anon_id: "attacker-controlled-id",
        user_id: "victim@example.com",
        name: "Legacy user",
        country: "United Kingdom",
        area: "London",
        lat: 51.5,
        lon: -0.1,
        geo: { city: "London", lat: 51.5, lon: -0.1, isPrecise: true },
      })}\n`,
      "utf8",
    );

    storage.scrubTelemetryFile();
    const [row] = readRows(decrypt);
    expect(row.profile_id).toMatch(/^legacy_[A-Za-z0-9_-]{40,100}$/);
    expect(row.anon_id).toBe(row.profile_id);
    expect(row.name).toBe("Legacy user");
    expect(row).not.toHaveProperty("user_id");
    expect(row).not.toHaveProperty("country");
    expect(row).not.toHaveProperty("area");
    expect(row).not.toHaveProperty("lat");
    expect(row).not.toHaveProperty("lon");
    expect(row).not.toHaveProperty("geo");
    expect(fs.readFileSync(file, "utf8")).not.toContain("Legacy user");
  });

  test("keeps migrated audit identifiers stable across repeated scrubs", () => {
    const { decrypt, storage } = loadStorage();
    const file = path.join(tempDir, "telemetry.ndjson");
    fs.writeFileSync(
      file,
      `${JSON.stringify({
        type: "audit",
        ts: "2026-07-15T10:00:00.000Z",
        action: "delete_user",
        target_anon_id: "attacker-controlled-id",
      })}\n`,
      "utf8",
    );

    storage.scrubTelemetryFile();
    const [first] = readRows(decrypt);
    storage.scrubTelemetryFile();
    const [second] = readRows(decrypt);

    expect(first.target_anon_id).toMatch(/^legacy_/);
    expect(second.target_anon_id).toBe(first.target_anon_id);
  });
});
