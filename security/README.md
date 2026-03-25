# `security/`

This folder contains security-related helpers and middleware for the Arclight Express server.

## Current state

Security policy is split between reusable helpers here and route wiring in `server.cjs`.

## Files

- `rateLimit.cjs`
  - Reusable `express-rate-limit` presets (`generalRateLimiter`, `sensitiveRateLimiter`).
  - **Note:** the current `server.cjs` reports auth limiter is still an in-memory, Basic-Auth-specific limiter and does not use this file.

- `requireDevAuth.cjs`
  - Helper middleware to require Basic Auth in production (used by some optional/legacy routers under `reports/routes/`).

- `csp.cjs`
  - Exports the active main-app and reports/admin CSP middleware used by `server.cjs`.

- `telemetry-policy.cjs`
  - Centralizes telemetry host gating and server-side payload allowlisting/validation.

- `cors.cjs`, `csrf.cjs`
  - Still placeholders in the current server implementation.

## Recommended production hardening

- Set `DASHBOARD_PASSWORD` to a strong value if enabling the reports pages.
- Keep telemetry writes restricted to production plus the configured host allowlist.
- Use read-only and admin DB credentials separately for local reports when possible.
- Keep real secrets in `.env` or deployment secrets, never in tracked files or frontend code.

See also:

- [`reports/README.md`](../reports/README.md)
- [`securitytest/README.md`](../securitytest/README.md)
