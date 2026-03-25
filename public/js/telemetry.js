function getAnonId() {
  const KEY = "arclight_anon_id";
  let id = localStorage.getItem(KEY);
  if (!id) {
    id = ([1e7] + -1e3 + -4e3 + -8e3 + -1e11).replace(/[018]/g, (c) =>
      (
        c ^
        (crypto.getRandomValues(new Uint8Array(1))[0] & (15 >> (c / 4)))
      ).toString(16),
    );
    localStorage.setItem(KEY, id);
  }
  return id;
}

// NEW: store a stable per-account id when the user signs in
export function setUserId(id) {
  if (!id) return;
  localStorage.setItem("arclight_user_id", String(id));
}
function getUserId() {
  return localStorage.getItem("arclight_user_id") || null;
}

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

export async function saveProfile(fields) {
  if (shouldSkipTelemetryInBrowser()) return { ok: true, skipped: true };

  const body = { anon_id: getAnonId(), user_id: getUserId(), ...fields };

  try {
    await fetch("/api/app/profile", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "same-origin",
      body: JSON.stringify(body),
    });
  } catch (err) {
    console.error("[telemetry] saveProfile failed", err);
    if (window.Sentry && Sentry.captureException) {
      Sentry.captureException(err, {
        tags: { area: "telemetry", op: "saveProfile" },
        extra: { body },
      });
    }
    // optional: rethrow if you want callers to know it failed
  }
}

export async function bumpRefresh(fields = {}) {
  if (shouldSkipTelemetryInBrowser()) return { ok: true, skipped: true };

  const body = { anon_id: getAnonId(), user_id: getUserId(), ...fields };

  try {
    await fetch("/api/app/refresh", {
      method: "POST",
      credentials: "same-origin",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
  } catch (err) {
    console.error("[telemetry] bumpRefresh failed", err);
    if (window.Sentry && Sentry.captureException) {
      Sentry.captureException(err, {
        tags: { area: "telemetry", op: "bumpRefresh" },
        extra: { body },
      });
    }
  }
}

// keep the global export if you use non-module scripts
window.ARCLIGHT = Object.assign(window.ARCLIGHT || {}, {
  saveProfile,
  bumpRefresh,
  setUserId,
});
