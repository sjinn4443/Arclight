# `security/`

This folder contains security-related helpers and middleware for the Arclight Express server.

## Current state

Security policy is split between reusable helpers here and route wiring in `server.cjs`.

## Files

- `rateLimit.cjs`
  - Route-specific limits for reports/admin, telemetry writes, location lookup, app version, and the offline manifest.
  - `server.cjs` also keeps a bounded in-memory Basic-Auth-specific limiter as a second line of defense.

- `csp.cjs`
  - Exports the active main-app and reports/admin CSP middleware used by `server.cjs`.

- `telemetry-policy.cjs`
  - Centralizes telemetry host gating and a strict server-side payload allowlist.
  - Client identity, email, country, area, city, GPS, and coordinate fields are ignored.
  - Production telemetry writes require an explicit host allowlist.

- `telemetry-guard.cjs`
  - Issues and verifies a signed HttpOnly telemetry cookie using the dedicated `TELEMETRY_TOKEN_SECRET`.
  - Requires exact-origin proof and derives a stable server-owned profile ID from the cookie.

- `runtime-config.cjs`
  - In every environment, requires an independent 24+ character dashboard password and 32+ character telemetry secret, rejects placeholders/reuse, and validates `TRUST_PROXY`.
  - Also rejects unsafe production storage/TLS settings.

- `privacy.cjs`
  - Centralizes retention defaults and IP masking for dashboard responses and NDJSON fallback storage.
  - PostgreSQL intentionally retains raw IP with only resolved country name and timestamp.

- Route rate limits
  - Public telemetry writes are capped at 15 requests per 15 minutes per IP for each write route.
  - IP-country lookup, version metadata, offline manifests, and reports/admin routes have separate limits.

- `EMERGENCY_PLAN.md`
  - Operator runbook for `EMERGENCY_MODE`, admin IP allowlisting, and incident recovery expectations.

- `cors.cjs`, `csrf.cjs`
  - Reserved modules; telemetry routes use the stricter exact-origin cookie guard.

## Recommended production hardening

- Use distinct randomly generated values for `DASHBOARD_PASSWORD` and `TELEMETRY_TOKEN_SECRET`; never reuse application or encryption secrets.
- Keep telemetry writes restricted to production plus the configured host allowlist.
- Keep `TRUST_PROXY` disabled unless the exact trusted hop count is known. The current Railway topology uses `TRUST_PROXY=1`.
- Keep development bound to loopback; add non-loopback administrator clients explicitly to `ADMIN_ALLOWED_IPS`.
- Enable external IP-country lookup only with `ENABLE_IP_LOCATION_LOOKUP=true`.
- Keep `TELEMETRY_RETENTION_DAYS` and `REPORTS_AUDIT_RETENTION_DAYS` aligned with your privacy policy.
- Use read-only and admin DB credentials separately for local reports when possible.
- Keep real secrets in `.env` or deployment secrets, never in tracked files or frontend code.

See also:

- [`reports/README.md`](../reports/README.md)
- [`EMERGENCY_PLAN.md`](./EMERGENCY_PLAN.md)
- [`securitytest/README.md`](../securitytest/README.md)
