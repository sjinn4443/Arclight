/**
 * @jest-environment node
 */

const {
  clearLookupCache,
  enrichIp,
  isLookupEnabled,
  isPrivateIp,
} = require("../utils/ipEnricher.cjs");

beforeEach(() => clearLookupCache());

function jsonResponse(payload, status = 200) {
  return {
    ok: status >= 200 && status < 300,
    status,
    json: jest.fn().mockResolvedValue(payload),
  };
}

describe("IP country enrichment", () => {
  test("resolves an IPInfo country code to a country name", async () => {
    const fetchImpl = jest.fn().mockResolvedValue(
      jsonResponse({
        country: "US",
        city: "Mountain View",
        loc: "37.4056,-122.0775",
      }),
    );

    const result = await enrichIp("8.8.8.8", {
      fetchImpl,
      lookupEnabled: true,
      timeoutMs: 100,
    });

    expect(result).toMatchObject({
      source: "ipinfo",
      country: "United States",
      countryName: "United States",
      countryCode: "US",
      error: null,
    });
    expect(fetchImpl).toHaveBeenCalledTimes(1);
  });

  test("falls back to BigDataCloud when IPInfo fails", async () => {
    const fetchImpl = jest
      .fn()
      .mockResolvedValueOnce(jsonResponse({}, 503))
      .mockResolvedValueOnce(
        jsonResponse({
          countryCode: "GB",
          countryName: "United Kingdom",
          city: "London",
          latitude: 51.5072,
          longitude: -0.1276,
        }),
      );

    const result = await enrichIp("1.1.1.1", {
      fetchImpl,
      lookupEnabled: true,
      timeoutMs: 100,
    });

    expect(result).toMatchObject({
      source: "bigdatacloud",
      countryName: "United Kingdom",
      countryCode: "GB",
    });
    expect(fetchImpl).toHaveBeenCalledTimes(2);
  });

  test("does not call external providers for private IPs or when disabled", async () => {
    const fetchImpl = jest.fn();

    await expect(
      enrichIp("192.168.1.20", { fetchImpl, lookupEnabled: true }),
    ).resolves.toMatchObject({ source: "private", countryName: null });
    await expect(
      enrichIp("8.8.4.4", { fetchImpl, lookupEnabled: false }),
    ).resolves.toMatchObject({ source: "disabled", countryName: null });

    expect(fetchImpl).not.toHaveBeenCalled();
    expect(isPrivateIp("::ffff:127.0.0.1")).toBe(true);
    expect(isLookupEnabled({})).toBe(false);
    expect(isLookupEnabled({ ENABLE_IP_LOCATION_LOOKUP: "true" })).toBe(true);
    expect(isLookupEnabled({ ENABLE_IP_LOCATION_LOOKUP: "false" })).toBe(false);
  });

  test("uses the bounded lookup cache for repeated IPs", async () => {
    const fetchImpl = jest
      .fn()
      .mockResolvedValue(jsonResponse({ country: "GB" }));

    const first = await enrichIp("9.9.9.9", {
      fetchImpl,
      lookupEnabled: true,
      timeoutMs: 100,
    });
    const second = await enrichIp("9.9.9.9", {
      fetchImpl,
      lookupEnabled: true,
      timeoutMs: 100,
    });

    expect(first.countryName).toBe("United Kingdom");
    expect(second).toEqual(first);
    expect(fetchImpl).toHaveBeenCalledTimes(1);
  });

  test("applies one global timeout across provider fallbacks", async () => {
    const fetchImpl = jest.fn(() => new Promise(() => {}));
    const started = Date.now();

    const result = await enrichIp("4.4.4.4", {
      cache: false,
      fetchImpl,
      lookupEnabled: true,
      timeoutMs: 40,
    });

    expect(result).toMatchObject({
      source: "unavailable",
      countryName: null,
    });
    expect(Date.now() - started).toBeLessThan(250);
    expect(fetchImpl).toHaveBeenCalledTimes(1);
  });
});
