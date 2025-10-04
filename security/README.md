# Security Measures

This folder contains configurations for various security measures implemented in the application.

## 1. Rate Limiting (`rateLimit.cjs`)

- **Purpose**: Prevents abuse by limiting the number of requests an IP address can make within a specified timeframe.
- **Configuration**:
  - `generalRateLimiter`: Applied globally to all requests, limiting to 100 requests per 15 minutes.
  - `sensitiveRateLimiter`: (Available for specific sensitive endpoints) Limits to 10 requests per 15 minutes.
- **Middleware**: `express-rate-limit`

## 2. Content Security Policy (CSP) (`csp.cjs`)

- **Purpose**: Mitigates cross-site scripting (XSS) attacks and other code injection vulnerabilities by specifying allowed content sources.
- **Configuration**: A strict CSP is enforced, allowing resources only from trusted sources.
  - `defaultSrc`: `'self'`
  - `scriptSrc`: `'self'`
  - `styleSrc`: `'self'`, `https://fonts.googleapis.com`
  - `imgSrc`: `'self'`, `data:`
  - `mediaSrc`: `'self'`
  - `fontSrc`: `'self'`, `https://fonts.gstatic.com`
  - `manifestSrc`: `'self'`
  - `workerSrc`: `'self'`
  - `objectSrc`: `'none'`
  - `baseUri`: `'self'`
  - `formAction`: `'self'`
  - `frameAncestors`: `'none'`
  - `upgradeInsecureRequests`: `[]`
- **Middleware**: `helmet`

## 3. Cross-Origin Resource Sharing (CORS) Allowlist (`cors.cjs`)

- **Purpose**: Controls which external origins are allowed to make requests to the application, preventing unauthorized cross-origin access.
- **Configuration**: An explicit whitelist of allowed origins is maintained.
  - Currently allows `http://localhost:3000`.
  - Additional production domains should be added to the `whitelist` array as needed.
- **Middleware**: `cors`

## 4. Cross-Site Request Forgery (CSRF) Protection (`csrf.cjs`)

- **Purpose**: Protects against CSRF attacks by ensuring that requests originating from the client are legitimate and intended by the user.
- **Configuration**:
  - Uses `express-session` for session management (requires a strong `SESSION_SECRET` environment variable in production).
  - Uses `cookie-parser` to parse cookies.
  - Generates a CSRF token that must be included in requests (e.g., form submissions) to sensitive endpoints.
  - A `XSRF-TOKEN` cookie is set for client-side access to the token.
- **Middleware**: `csurf`, `express-session`, `cookie-parser`
