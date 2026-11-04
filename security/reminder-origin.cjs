// The public app terminates HTTPS at Railway's proxy. Do not derive its public
// scheme from the backend HTTP socket, or trust arbitrary forwarded headers.
const PUBLIC_ORIGINS = new Set([
  "https://www.arclightproject.app",
  "https://arclightproject.app",
]);

function sameReminderOrigin(req) {
  try {
    const raw = req.get("origin");
    if (!raw || raw === "null") return false;
    const origin = new URL(raw);
    if (origin.origin !== raw || origin.username || origin.password)
      return false;
    const site = req.get("sec-fetch-site");
    if (site && !["same-origin", "same-site", "none"].includes(site))
      return false;
    const host = String(req.get("host") || "").toLowerCase();
    // Only the two exact, HTTPS public origins are aliases. Ports, subdomains,
    // suffix lookalikes and client-supplied proxy headers cannot expand this set.
    if (PUBLIC_ORIGINS.has(`https://${host}`))
      return PUBLIC_ORIGINS.has(origin.origin);
    return origin.origin === `${req.protocol}://${host}`;
  } catch {
    return false;
  }
}
module.exports = { sameReminderOrigin };
