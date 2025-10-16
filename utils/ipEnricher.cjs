const fetch = require("node-fetch");
const geoip = require("geoip-lite");

async function enrichIp(ip) {
  try {
    const r = await fetch(
      `https://ipinfo.io/${ip}?token=${process.env.IPINFO_TOKEN}`,
    );
    if (r.ok) {
      const d = await r.json();
      const [lat, lon] = (d.loc || "").split(",");
      return {
        source: "ipinfo",
        country: d.country,
        city: d.city,
        region: d.region,
        lat,
        lon,
        org: d.org,
        timezone: d.timezone,
      };
    }
  } catch (e) {
    console.error("ipinfo.io lookup failed:", e.message);
  }

  try {
    const r2 = await fetch(
      `https://api.bigdatacloud.net/data/ip-geolocation-full?ip=${ip}&key=${process.env.BDCLOUD_KEY}`,
    );
    if (r2.ok) {
      const d2 = await r2.json();
      return {
        source: "bigdatacloud",
        country: d2.country.isoName,
        city: d2.city.name,
        lat: d2.location.latitude,
        lon: d2.location.longitude,
        org: d2.network.organisation,
        timezone: d2.location.timeZone.ianaTimeId,
      };
    }
  } catch (e) {
    console.error("BigDataCloud lookup failed:", e.message);
  }

  // fallback
  const g = geoip.lookup(ip) || null;
  return {
    source: "geoip-lite",
    country: g?.country || null,
    city: g?.city || null,
    lat: g?.ll?.[0],
    lon: g?.ll?.[1],
    timezone: g?.timezone || null,
  };
}

module.exports = { enrichIp };
