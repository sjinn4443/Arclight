# `security/`

This folder contains security-related helpers and middleware for the Arclight Express server.

## Current state

Some security logic has been consolidated directly into **`server.cjs`** (for example, Basic Auth protection for the reports pages). As a result, some files in this directory are **placeholders** kept for compatibility/history.

## Files

- `rateLimit.cjs`
  - Reusable `express-rate-limit` presets (`generalRateLimiter`, `sensitiveRateLimiter`).
  - **Note:** the current `server.cjs` reports-page limiter is an in-memory, scoped limiter and does not use this file.

- `requireDevAuth.cjs`
  - Helper middleware to require Basic Auth in production (used by some optional/legacy routers under `reports/routes/`).

- `cors.cjs`, `csp.cjs`, `csrf.cjs`
  - Currently placeholders: these configs are not applied from this folder in the current server implementation.

## Recommended production hardening

- Set `DASHBOARD_PASSWORD` to a strong value if enabling the reports pages.
- If using NDJSON telemetry in non-production environments and you want encryption-at-rest, set `ENCRYPTION_SECRET`.
- If you reintroduce CORS/CSP/CSRF/session middleware, document the chosen approach here and keep tests updated.

See also:

- [`reports/README.md`](../reports/README.md)
- [`securitytest/README.md`](../securitytest/README.md)
