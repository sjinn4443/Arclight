# `security/`

This folder contains security-related helpers and middleware for the Arclight Express server.

## Current state

Security policy is split between reusable helpers here and route wiring in `server.cjs`.

## Files

- `rateLimit.cjs`
  - Reusable `express-rate-limit` presets (`generalRateLimiter`, `sensitiveRateLimiter`).
  - `server.cjs` applies `sensitiveRateLimiter` to reports/admin routes, and keeps an in-memory Basic-Auth-specific limiter as a second line of defense.

- `requireDevAuth.cjs`
  - Helper middleware to require Basic Auth in production (used by some optional/legacy routers under `reports/routes/`).

- `csp.cjs`
  - Exports the active main-app and reports/admin CSP middleware used by `server.cjs`.

- `telemetry-policy.cjs`
  - Centralizes telemetry host gating and server-side payload allowlisting/validation.
  - Production telemetry writes require an explicit host allowlist.

- `telemetry-guard.cjs`
  - Issues short-lived telemetry tokens for HTML responses on allowed production hosts.
  - Requires same-origin proof plus a valid telemetry token before accepting public telemetry writes.

- `runtime-config.cjs`
  - Fails startup for unsafe production settings, including placeholder secrets, NDJSON storage without encryption, telemetry allowlists without a server secret, and disabled DB TLS on remote production databases.

- `privacy.cjs`
  - Centralizes telemetry retention defaults and masks IP addresses before runtime storage.

- Telemetry write rate limits
  - Public telemetry writes are capped at 15 requests per 15 minutes per IP for each write route.
  - `localhost` requests are excluded so local development and manual verification are not throttled.

- `EMERGENCY_PLAN.md`
  - Operator runbook for `EMERGENCY_MODE`, admin IP allowlisting, and incident recovery expectations.

- `cors.cjs`, `csrf.cjs`
  - Still placeholders in the current server implementation.

## Recommended production hardening

- Set `DASHBOARD_PASSWORD` to a strong value if enabling the reports pages.
- Keep telemetry writes restricted to production plus the configured host allowlist.
- Set `TELEMETRY_TOKEN_SECRET` to a stable secret in production so telemetry tokens remain valid across instances.
- Keep `TELEMETRY_RETENTION_DAYS` and `REPORTS_AUDIT_RETENTION_DAYS` aligned with your privacy policy.
- Use read-only and admin DB credentials separately for local reports when possible.
- Keep real secrets in `.env` or deployment secrets, never in tracked files or frontend code.

See also:

- [`reports/README.md`](../reports/README.md)
- [`EMERGENCY_PLAN.md`](./EMERGENCY_PLAN.md)
- [`securitytest/README.md`](../securitytest/README.md)
