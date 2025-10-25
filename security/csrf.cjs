const cookieParser = require("cookie-parser");
const crypto = require("crypto"); // Keep crypto for csrfSecret generation

// Custom CSRF protection middleware
const csrfProtection = (req, res, next) => {
  if (
    req.method === "GET" ||
    req.method === "HEAD" ||
    req.method === "OPTIONS"
  ) {
    // Ensure session and csrfSecret exist before trying to access them
    if (req.session && !req.session.csrfSecret) {
      req.session.csrfSecret = crypto.randomBytes(100).toString("base64");
    }
    res.locals.csrfToken = req.session ? req.session.csrfSecret : undefined; // Provide csrfToken if session exists
    return next();
  }

  const token =
    req.body._csrf ||
    req.headers["x-csrf-token"] ||
    req.headers["x-xsrf-token"];
  if (!req.session || !token || token !== req.session.csrfSecret) {
    return res.status(403).send("CSRF token mismatch");
  }
  next();
};

module.exports = {
  cookieParser,
  csrfProtection,
};
