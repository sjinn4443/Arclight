const cookieParser = require("cookie-parser");
const session = require("express-session");
const crypto = require("crypto");
const redis = require("redis");
const { RedisStore } = require("connect-redis"); // Correctly import RedisStore from the module

// Configure Redis client
const redisClient = redis.createClient({
  url: process.env.REDIS_URL,
});

redisClient.on("error", (err) => console.error("Redis Client Error", err));
redisClient.connect().catch(console.error);

// Create a new RedisStore instance
const redisStore = new RedisStore({ client: redisClient });

// Configure session middleware
const sessionMiddleware = session({
  store: redisStore, // Use the instantiated RedisStore
  secret: process.env.SESSION_SECRET || "supersecretkey", // Replace with a strong, unique secret from environment variables
  resave: false,
  saveUninitialized: true,
  cookie: { secure: process.env.NODE_ENV === "production" }, // Set to true in production for HTTPS
});

// Custom CSRF protection middleware
const csrfProtection = (req, res, next) => {
  if (
    req.method === "GET" ||
    req.method === "HEAD" ||
    req.method === "OPTIONS"
  ) {
    if (!req.session.csrfSecret) {
      req.session.csrfSecret = crypto.randomBytes(100).toString("base64");
    }
    res.locals.csrfToken = req.session.csrfSecret;
    return next();
  }

  const token =
    req.body._csrf ||
    req.headers["x-csrf-token"] ||
    req.headers["x-xsrf-token"];
  if (!token || token !== req.session.csrfSecret) {
    return res.status(403).send("CSRF token mismatch");
  }
  next();
};

module.exports = {
  cookieParser,
  sessionMiddleware,
  csrfProtection,
};
