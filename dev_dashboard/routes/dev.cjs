console.log("[dev] dev router file loaded");

const express = require("express");
const fs = require("fs");
const path = require("path");
const { decryptField } = require("../security/encrypt.cjs");

const router = express.Router();
console.log("[dev] dev router created");

router.get("/", (req, res) => {
  const jsonPath = path.join(__dirname, "..", "data", "users.json");
  let usersRaw = [];
  try {
    usersRaw = JSON.parse(fs.readFileSync(jsonPath, "utf8"));
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
    <div class="hint">Password is controlled via <code>DASHBOARD_PASSWORD</code>. Encryption key via <code>MASTER_KEY</code>.</div>
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

module.exports = router;
