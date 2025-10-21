# `security` Directory

This directory contains server-side security configurations for the Arclight application, implemented to protect against common web vulnerabilities. These measures are integrated into `server.cjs` to secure API endpoints and static content delivery.

## Implemented Security Measures

- **Rate Limiting (`rateLimit.cjs`):**
  - Configured using `express-rate-limit` to control the frequency of requests from a single IP address.
  - **General Rate Limiter:** Applies to most endpoints, limiting each IP to `100 requests per 15 minutes`.
  - **Sensitive Rate Limiter:** Applies to more sensitive endpoints, limiting each IP to `10 requests per 15 minutes`.
  - Mitigates brute-force attacks and denial-of-service (DoS) attempts.
  - Returns rate limit information in `RateLimit-*` headers.

- **Content Security Policy (CSP) (`csp.cjs`):**
  - Implemented with `helmet.contentSecurityPolicy` to prevent Cross-Site Scripting (XSS) and other content injection attacks.
  - **`defaultSrc: ['self']`**: By default, resources can only be loaded from the application's own origin.
  - **`scriptSrc: ['self']`**: All JavaScript must be served from the same origin.
  - **`styleSrc: ['self', 'https://fonts.googleapis.com']`**: Allows stylesheets from the application's origin and Google Fonts.
  - **`imgSrc: ['self', 'data:', 'https://*.tile.openstreetmap.org']`**: Allows images from the application's origin, data URIs, and OpenStreetMap tiles for mapping features.
  - **`connectSrc`**: Configured to allow connections to `'self'`, `https://ipinfo.io`, `https://ipapi.co`, `https://api.bigdatacloud.net`, and `https://nominatim.openstreetmap.org` for geolocation and mapping services.
  - **`fontSrc: ['self', 'https://fonts.gstatic.com']`**: Allows fonts from the application's origin and Google Fonts.
  - **`objectSrc: ['none']`**: Disallows `<object>`, `<embed>`, and `<applet>` elements to prevent plugin-based vulnerabilities.
  - **`frameAncestors: ['none']`**: Prevents the application from being embedded in iframes, mitigating clickjacking attacks.
  - **`upgradeInsecureRequests: []`**: Automatically upgrades insecure HTTP requests to HTTPS.

- **CORS Allowlist (`cors.cjs`):**
  - Utilizes the `cors` middleware to restrict cross-origin requests.
  - **Whitelist:** Configured to allow requests only from `https://arclight.up.railway.app`, `http://localhost:3000`, and the `RAILWAY_APP_URL` environment variable.
  - Prevents unauthorized domains from accessing server resources, enhancing data integrity and preventing cross-site data leakage.
  - Supports `GET, HEAD, PUT, PATCH, POST, DELETE` methods and `credentials: true` for cookie handling.

- **CSRF Protection (`csrf.cjs`):**
  - Set up using `cookie-parser`, `express-session`, and a custom `csrfProtection` middleware.
  - **Session Management:** `express-session` is configured with a `SESSION_SECRET` (from environment variables or a default) to manage user sessions securely. Cookies are set to `secure: true` in production.
  - **Token Generation:** For `GET`, `HEAD`, or `OPTIONS` requests, a unique CSRF secret is generated and stored in the user's session, then exposed as `res.locals.csrfToken`.
  - **Token Validation:** For state-changing requests (`POST`, `PUT`, `PATCH`, `DELETE`), the incoming CSRF token (from `req.body._csrf`, `X-CSRF-Token`, or `X-XSRF-Token` headers) is validated against the session's stored secret.
  - Guards against Cross-Site Request Forgery (CSRF) attacks by ensuring that all state-changing requests originate from the application itself.
  - CSRF protection is conditionally applied in `server.cjs`, typically disabled in test environments to avoid conflicts with automated testing.
