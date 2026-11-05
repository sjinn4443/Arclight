/** @jest-environment node */
const crypto = require("node:crypto");
const webpush = require("web-push");
const ece = require("http_ece");
const {
  pushOptions,
  deliverNotification,
} = require("../utils/notification-delivery.cjs");

test("Apple push request has decryptable AES128GCM payload and a valid VAPID signature", () => {
  const receiver = crypto.createECDH("prime256v1");
  const auth = crypto.randomBytes(16).toString("base64url");
  const subscription = {
    endpoint: "https://web.push.apple.com/test-fixture-not-a-real-device",
    keys: { p256dh: receiver.generateKeys().toString("base64url"), auth },
  };
  const config = {
    ...webpush.generateVAPIDKeys(),
    subject: "mailto:support@arclightproject.com",
  };
  const payload = JSON.stringify({
    id: "enabled:fixture",
    body: "Ready for a little practice? Continue where you left off.",
  });
  const request = webpush.generateRequestDetails(
    subscription,
    payload,
    pushOptions(payload, config),
  );
  expect(request.method).toBe("POST");
  expect(request.headers["Content-Encoding"]).toBe("aes128gcm");
  expect(request.headers.Urgency).toBe("high");
  expect(request.headers.TTL).toBe(86400);
  expect(request.headers.Topic).toBeUndefined();
  const plaintext = ece.decrypt(request.body, {
    version: "aes128gcm",
    privateKey: receiver,
    authSecret: auth,
  });
  expect(plaintext.toString()).toBe(payload);
  const jwt = /vapid t=([^,]+)/.exec(request.headers.Authorization)[1];
  const [header, claims, signature] = jwt.split(".");
  const publicKey = Buffer.from(config.publicKey, "base64url");
  const key = crypto.createPublicKey({
    format: "jwk",
    key: {
      kty: "EC",
      crv: "P-256",
      x: publicKey.subarray(1, 33).toString("base64url"),
      y: publicKey.subarray(33).toString("base64url"),
    },
  });
  expect(
    crypto.verify(
      "sha256",
      Buffer.from(`${header}.${claims}`),
      { key, dsaEncoding: "ieee-p1363" },
      Buffer.from(signature, "base64url"),
    ),
  ).toBe(true);
  expect(JSON.parse(Buffer.from(claims, "base64url")).aud).toBe(
    "https://web.push.apple.com",
  );
});

test("provider error reasons are recorded without logging endpoint or response secrets", async () => {
  const log = jest.spyOn(console, "warn").mockImplementation(() => {});
  try {
    const row = await deliverNotification(
      { subscription: { endpoint: "private-endpoint" } },
      {
        now: 123,
        send: async () => {
          throw {
            statusCode: 400,
            body: JSON.stringify({
              reason: "BadWebPushTopic",
              token: "private-token",
            }),
          };
        },
      },
    );
    expect(row.lastDeliveryFailure).toEqual({
      at: 123,
      status: 400,
      reason: "BadWebPushTopic",
    });
    expect(log.mock.calls.flat().join(" ")).toContain("reason=BadWebPushTopic");
    expect(log.mock.calls.flat().join(" ")).not.toMatch(
      /private-endpoint|private-token/,
    );
    const unsafe = await deliverNotification(
      { subscription: {} },
      {
        send: async () => {
          throw { statusCode: 400, body: '{"reason":"private-token"}' };
        },
      },
    );
    expect(unsafe.lastDeliveryFailure.reason).toBe("unclassified");
    expect(log.mock.calls.flat().join(" ")).not.toContain("private-token");
  } finally {
    log.mockRestore();
  }
});

test("invalid Apple endpoints are renewed instead of retrying forever; signing errors retain consent", async () => {
  const row = { subscription: { endpoint: "private-endpoint" } };
  for (const reason of [
    "BadWebPushToken",
    "VapidPkHashMismatch",
    "BadJwtToken",
  ]) {
    const next = await deliverNotification(row, {
      send: async () => {
        throw { statusCode: 400, body: JSON.stringify({ reason }) };
      },
    });
    expect(next.lastDeliveryFailure.reason).toBe(reason);
    expect(Boolean(next.subscription)).toBe(reason === "BadJwtToken");
  }
});
