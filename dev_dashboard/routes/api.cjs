const fs = require("fs");
const path = require("path");
const express = require("express");
const { decryptField } = require("../security/encrypt.cjs"); // adapt to your export
const router = express.Router();

router.get("/users", async (req, res) => {
  try {
    const file = path.join(__dirname, "..", "data", "users.json");
    const raw = JSON.parse(fs.readFileSync(file, "utf8"));

    // Decrypt on the server; only return what the UI needs.
    const users = raw.map((row) => ({
      name: decryptField(row.name),
      email: decryptField(row.email),
      role: row.role ? decryptField(row.role) : null,
    }));

    res.json(users);
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: "Failed to read users" });
  }
});

module.exports = router;
