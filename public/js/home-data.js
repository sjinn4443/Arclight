// public/scripts/home-data.js

export async function pushLocalStorageToServer() {
  const raw = localStorage.getItem("profileGeo");
  if (!raw) return { ok: true, skipped: "no-geo" };
  const geo = JSON.parse(raw);

  // Guard: only send if we have at least one useful field
  if (!geo?.iso2 && !geo?.lat && !geo?.lon && !geo?.area) {
    return { ok: true, skipped: "no-useful-fields" };
  }

  try {
    const res = await fetch("/api/record-info", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(geo),
    });
    return { ok: res.ok };
  } catch (e) {
    // swallow for now; you can surface a subtle toast in UI if you like
    return { ok: false, error: String(e) };
  }
}
