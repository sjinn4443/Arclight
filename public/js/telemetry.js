import { captureClientError } from "./safe-logging.js";

const TELEMETRY_TOKEN_META_NAME = "arclight-telemetry-token";

function shouldSkipTelemetryInBrowser() {
  if (typeof window === "undefined" || !window.location) return false;
  const host = String(window.location.hostname || "").toLowerCase();
  return (
    window.location.protocol === "file:" ||
    host === "localhost" ||
    host === "127.0.0.1" ||
    host === "::1" ||
    host === "[::1]"
  );
}

function getTelemetryToken() {
  if (typeof document === "undefined") return "";
  const meta = document.querySelector(
    `meta[name="${TELEMETRY_TOKEN_META_NAME}"]`,
  );
  return String(meta?.content || "").trim();
}

export function buildTelemetryRequestHeaders(initial = {}) {
  const headers = { ...initial };
  const token = getTelemetryToken();
  if (token) headers["X-Arclight-Telemetry"] = token;
  return headers;
}

export async function saveProfile(fields) {
  if (shouldSkipTelemetryInBrowser()) return { ok: true, skipped: true };

  const body = { ...fields };

  try {
    await fetch("/api/app/profile", {
      method: "POST",
      headers: buildTelemetryRequestHeaders({
        "Content-Type": "application/json",
      }),
      credentials: "same-origin",
      body: JSON.stringify(body),
    });
  } catch (err) {
    captureClientError("[telemetry] saveProfile failed", err, {
      tags: { area: "telemetry", op: "saveProfile" },
    });
    // optional: rethrow if you want callers to know it failed
  }
}

export async function bumpRefresh(fields = {}) {
  if (shouldSkipTelemetryInBrowser()) return { ok: true, skipped: true };

  const body = { ...fields };

  try {
    await fetch("/api/app/refresh", {
      method: "POST",
      credentials: "same-origin",
      headers: buildTelemetryRequestHeaders({
        "Content-Type": "application/json",
      }),
      body: JSON.stringify(body),
    });
  } catch (err) {
    captureClientError("[telemetry] bumpRefresh failed", err, {
      tags: { area: "telemetry", op: "bumpRefresh" },
    });
  }
}

// keep the global export if you use non-module scripts
window.ARCLIGHT = Object.assign(window.ARCLIGHT || {}, {
  buildTelemetryRequestHeaders,
  saveProfile,
  bumpRefresh,
});
