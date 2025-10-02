const express = require("express");
const path = require("path");
const app = express();
const PORT = process.env.PORT || 3000;

console.log("__dirname:", __dirname);
console.log("Static path:", path.join(__dirname, "public"));
console.log("Index path:", path.join(__dirname, "public", "index.html"));

// Serve static files from the 'public' directory
app.use(
  express.static(path.join(__dirname, "public"), {
    setHeaders: (res, path) => {
      if (path.endsWith(".js")) {
        res.setHeader("Content-Type", "application/javascript");
      }
    },
  })
);

// Fallback to index.html for SPA routing
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

module.exports = app;

if (require.main === module) {
  app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
  });
}
