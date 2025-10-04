const csrf = require("csurf");
const cookieParser = require("cookie-parser");
const session = require("express-session");

// Configure session middleware
const sessionMiddleware = session({
  secret: process.env.SESSION_SECRET || "supersecretkey", // Replace with a strong, unique secret from environment variables
  resave: false,
  saveUninitialized: true,
  cookie: { secure: process.env.NODE_ENV === "production" }, // Set to true in production for HTTPS
});

// Configure CSRF protection
const csrfProtection = csrf({ cookie: true });

module.exports = {
  cookieParser,
  sessionMiddleware,
  csrfProtection,
};
