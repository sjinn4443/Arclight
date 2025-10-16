const helmet = require("helmet");

const csp = helmet.contentSecurityPolicy({
  directives: {
    defaultSrc: ["'self'"],
    scriptSrc: ["'self'"], // All scripts should be served from the same origin
    styleSrc: ["'self'", "https://fonts.googleapis.com"], // Allow Google Fonts stylesheets
    imgSrc: ["'self'", "data:", "https://*.tile.openstreetmap.org"], // Images from same origin, data URIs, and OSM tiles
    mediaSrc: ["'self'"], // Videos and audio from same origin
    fontSrc: ["'self'", "https://fonts.gstatic.com"], // Allow Google Fonts font files
    manifestSrc: ["'self'"], // Web app manifest from same origin
    workerSrc: ["'self'"], // Service worker from same origin
    connectSrc: [
      "'self'",
      process.env.RAILWAY_APP_URL,
      "https://ipinfo.io",
      "https://api.bigdatacloud.net",
    ], // Allow connections to self, Railway app URL, ipinfo.io, and bigdatacloud.net
    objectSrc: ["'none'"], // Disallow <object>, <embed>, <applet>
    baseUri: ["'self'"], // Base URI for relative URLs
    formAction: ["'self'"], // Forms can only submit to the same origin
    frameAncestors: ["'none'"], // Disallow embedding in iframes
    upgradeInsecureRequests: [], // Upgrade HTTP requests to HTTPS
  },
});

module.exports = csp;
