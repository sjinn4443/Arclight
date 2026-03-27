if (process.env.NODE_ENV !== "production") {
  console.log("[dev] dev router file loaded");
}

const express = require("express");
const fs = require("fs/promises"); // Use fs/promises for async operations
const path = require("path");
const { decryptField } = require("../security/encrypt.cjs");
const requireDevAuth = require("../security/requireDevAuth.cjs");
const csrfProtection = require("../security/csrf.cjs");

const router = express.Router();
if (process.env.NODE_ENV !== "production") {
  console.log("[dev] dev router created");
}

const USERS_PATH = path.join(process.cwd(), "storage", "users.json"); // Path to users.json

router.get("/", requireDevAuth, async (req, res) => {
  let usersRaw = [];
  try {
    const raw = await fs.readFile(USERS_PATH, "utf8");
    usersRaw = JSON.parse(raw);
  } catch (e) {
    usersRaw = [];
  }

  const users = usersRaw.map((u) => ({
    id: u.id,
    name: decryptField(u.nameEnc),
    job: decryptField(u.jobEnc),
    interest: decryptField(u.interestEnc),
    location: decryptField(u.locationEnc),
  }));

  const rows = users
    .map(
      (u) => `
    <tr>
      <td>${u.name}</td>
      <td>${u.job}</td>
      <td>${u.interest}</td>
      <td>${u.location}</td>
    </tr>
  `,
    )
    .join("");

  res.send(`
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <title>Developer Dashboard</title>
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <style>
    body { font-family: system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial, sans-serif; margin: 32px; color: #111; }
    h1 { font-size: 24px; margin-bottom: 8px; }
    p  { margin: 0 0 16px; color: #555; }
    table { border-collapse: collapse; width: 100%; }
    th, td { padding: 10px 12px; border: 1px solid #e5e7eb; }
    th { background: #f9fafb; text-align: left; }
    tr:nth-child(even) { background: #fcfcfd; }
    .wrap { max-width: 960px; margin: 0 auto; }
    .hint { font-size: 12px; color: #666; margin-bottom: 16px; }
  </style>
</head>
<body>
  <div class="wrap">
    <h1>Developer Dashboard</h1>
    <p>Decrypted view of encrypted user data.</p>
    <div class="hint">Password is controlled via <code>DASHBOARD_PASSWORD</code>. Encryption is controlled via <code>ENCRYPTION_SECRET</code>.</div>
    <table aria-label="Users">
      <thead>
        <tr>
          <th>Name</th>
          <th>Job</th>
          <th>Interest</th>
          <th>Location</th>
        </tr>
      </thead>
      <tbody>
        ${rows}
      </tbody>
    </table>
  </div>
</body>
</html>
  `);
});

router.delete(
  "/users/:anonId",
  requireDevAuth,
  csrfProtection,
  async (req, res) => {
    try {
      const anonId = String(req.params.anonId || "").trim();
      if (!anonId) return res.status(400).json({ error: "Missing anon_id" });

      const raw = await fs.readFile(USERS_PATH, "utf8").catch(() => "[]");
      const users = JSON.parse(raw || "[]");

      const before = users.length;
      const filtered = users.filter((u) => u.anon_id !== anonId);

      if (filtered.length === before) {
        return res.status(404).json({ error: "User not found" });
      }

      await fs.writeFile(USERS_PATH, JSON.stringify(filtered, null, 2), "utf8");

      return res.status(204).end();
    } catch (err) {
      console.error("[dev] delete user failed", err);
      return res.status(500).json({ error: "Failed to delete user" });
    }
  },
);

module.exports = router;
