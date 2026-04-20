const rateLimit = require("express-rate-limit");
const { getRequestHost, isLocalHost } = require("./telemetry-policy.cjs");

// General rate limit for all requests
const generalRateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per windowMs
  message: "Too many requests from this IP, please try again after 15 minutes",
  standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers
});

// Stricter rate limit for sensitive endpoints (example, adjust as needed)
const sensitiveRateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 10, // Limit each IP to 10 requests per windowMs
  message:
    "Too many requests to this sensitive endpoint, please try again after 15 minutes",
  standardHeaders: true,
  legacyHeaders: false,
});

function createTelemetryRateLimiter({
  max = 15,
  message = "Too many telemetry writes from this IP, please slow down.",
} = {}) {
  return rateLimit({
    windowMs: 15 * 60 * 1000,
    max,
    standardHeaders: true,
    legacyHeaders: false,
    skip: (req) => isLocalHost(getRequestHost(req)),
    handler: (req, res, next, options) => {
      res.status(options.statusCode).json({
        error: "rate_limited",
        message,
      });
    },
  });
}

const telemetryProfileRateLimiter = createTelemetryRateLimiter({
  max: 15,
  message: "Too many profile updates from this IP, please try again later.",
});

const telemetryRefreshRateLimiter = createTelemetryRateLimiter({
  max: 15,
  message: "Too many refresh updates from this IP, please try again later.",
});

const trackingRateLimiter = createTelemetryRateLimiter({
  max: 15,
  message: "Too many tracking writes from this IP, please try again later.",
});

module.exports = {
  generalRateLimiter,
  sensitiveRateLimiter,
  telemetryProfileRateLimiter,
  telemetryRefreshRateLimiter,
  trackingRateLimiter,
};
