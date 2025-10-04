const express = require("express");
const path = require("path");
const app = express();
const PORT = process.env.PORT || 3000;
const { generalRateLimiter } = require("./security/rateLimit.cjs");
const csp = require("./security/csp.cjs");
const corsMiddleware = require("./security/cors.cjs");
const {
  cookieParser,
  sessionMiddleware,
  csrfProtection,
} = require("./security/csrf.cjs");

console.log("__dirname:", __dirname);
console.log("Static path:", path.join(__dirname, "public"));
console.log("Index path:", path.join(__dirname, "public", "index.html"));

// Apply the general rate limit to all requests
app.use(generalRateLimiter);

// Apply CSP
app.use(csp);

// Apply CORS allowlist
app.use(corsMiddleware);

// Apply cookie-parser, session, and CSRF protection
// Apply cookie-parser, session, and CSRF protection only if not in test environment
if (process.env.NODE_ENV !== "test") {
  app.use(cookieParser);
  app.use(sessionMiddleware);
  app.use(csrfProtection);
}

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
  // Pass the CSRF token to the client-side
  res.cookie("XSRF-TOKEN", req.csrfToken());
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

module.exports = app;

if (require.main === module) {
  app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
  });
}
