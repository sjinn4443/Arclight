/**
 * @jest-environment jsdom
 */

import { beforeEach, describe, expect, jest, test } from "@jest/globals";
import { captureClientError } from "../public/js/safe-logging.js";

describe("client safe logging", () => {
  beforeEach(() => {
    window.Sentry = {
      captureException: jest.fn(),
    };
  });

  test("redacts sensitive telemetry metadata before forwarding to Sentry", () => {
    const error = new Error("saveProfile failed token=secret");

    captureClientError("[telemetry] saveProfile failed", error, {
      tags: { area: "telemetry", op: "saveProfile" },
      extra: {
        body: {
          anon_id: "anon-123",
          user_id: "user-123",
          email: "alice@example.com",
          contact: "+44 1234 567890",
          lat: 51.5,
          lon: -0.1,
          note: "token=secret",
        },
      },
    });

    expect(window.Sentry.captureException).toHaveBeenCalledTimes(1);
    expect(window.Sentry.captureException).toHaveBeenCalledWith(
      error,
      expect.objectContaining({
        tags: {
          area: "telemetry",
          op: "saveProfile",
        },
        extra: {
          body: {
            anon_id: "[redacted]",
            user_id: "[redacted]",
            email: "[redacted]",
            contact: "[redacted]",
            lat: "[redacted]",
            lon: "[redacted]",
            note: expect.stringContaining("[redacted]"),
          },
        },
      }),
    );
  });
});
