const rateLimit = require("express-rate-limit");

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
    skip: (req) => req.telemetryWriteAllowed !== true,
    handler: (req, res, next, options) => {
      res.status(options.statusCode).json({
        error: "rate_limited",
        message,
      });
    },
  });
}

function createApiReadRateLimiter({ max, message }) {
  return rateLimit({
    windowMs: 15 * 60 * 1000,
    max,
    standardHeaders: true,
    legacyHeaders: false,
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

const offlineManifestRateLimiter = createApiReadRateLimiter({
  max: 60,
  message: "Too many offline manifest requests. Please try again later.",
});

const appVersionRateLimiter = createApiReadRateLimiter({
  max: 120,
  message: "Too many version requests. Please try again later.",
});

const locationLookupRateLimiter = createApiReadRateLimiter({
  max: 30,
  message: "Too many location requests. Please try again later.",
});

module.exports = {
  appVersionRateLimiter,
  locationLookupRateLimiter,
  offlineManifestRateLimiter,
  sensitiveRateLimiter,
  telemetryProfileRateLimiter,
  telemetryRefreshRateLimiter,
  trackingRateLimiter,
};
