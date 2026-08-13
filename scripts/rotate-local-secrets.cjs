const crypto = require("crypto");
const fs = require("fs");
const path = require("path");

const envPath = path.join(__dirname, "..", ".env");
if (fs.existsSync(envPath) && fs.lstatSync(envPath).isSymbolicLink()) {
  throw new Error("Refusing to update a symbolic-link .env file");
}

const original = fs.existsSync(envPath) ? fs.readFileSync(envPath, "utf8") : "";
let lines = original.split(/\r?\n/);

function upsert(key, value) {
  const prefix = `${key}=`;
  const index = lines.findIndex((line) => line.startsWith(prefix));
  if (index >= 0) lines[index] = `${prefix}${value}`;
  else lines.push(`${prefix}${value}`);
}

upsert("DASHBOARD_PASSWORD", crypto.randomBytes(32).toString("base64url"));
upsert("TELEMETRY_TOKEN_SECRET", crypto.randomBytes(48).toString("base64url"));
upsert("HOST", "127.0.0.1");
upsert("TRUST_PROXY", "0");
upsert("ENABLE_IP_LOCATION_LOOKUP", "true");

while (lines.length && !lines.at(-1)) lines.pop();
fs.writeFileSync(envPath, `${lines.join("\n")}\n`, {
  encoding: "utf8",
  mode: 0o600,
});
console.log(
  "Rotated local dashboard and telemetry secrets without displaying them.",
);
