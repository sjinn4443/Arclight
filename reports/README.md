# `reports/` (Telemetry + Reports)

This folder contains report-facing assets and the optional encrypted NDJSON fallback used by the password-protected reports page.

## What this module does (current behavior)

- Runtime telemetry storage is Postgres-backed when a DB URL is configured. In production, missing DB URLs select no-op storage unless `ENABLE_NDJSON_STORAGE=true` is explicitly set.
- Local/dev/test requests do not persist new telemetry events.
- The reports UI is served from the static app (`public/reports.html` and `public/html/reports.html`) and is protected by Basic Auth.
- The server exposes a small admin API used by the reports UI:
  - `GET /api/dev/users` - returns aggregated telemetry rows from the selected runtime store
  - `GET /api/dev/ip-locations` - returns only masked `ip`, `country`, and `ts`
  - `DELETE /api/dev/users/:anonId` - deletes user rows only when delete is explicitly enabled
- The reports dashboard plots country centroids (with Rest Countries fallback) and charts real `aims`, `interest`, and `experience` profile data. It does not expose precise coordinates or add demo rows.

These routes are implemented directly in [`server.cjs`](../server.cjs).

## Folder contents

- `data/`
  - `telemetry.ndjson` - optional encrypted runtime fallback; IPs are masked and detailed location fields are rejected
- `security/encrypt.cjs`
  - AES-256-GCM helper kept for legacy NDJSON compatibility.

## Environment variables

### Reports access

- `DASHBOARD_PASSWORD` - independent password of at least 24 characters, required to access reports pages
- `ADMIN_ALLOWED_IPS` - exact non-loopback client addresses allowed to reach reports/admin routes

### Runtime storage

- `DATABASE_URL` - primary runtime Postgres connection
- `REPORTS_READ_DATABASE_URL` - optional read-only reports connection
- `REPORTS_ADMIN_DATABASE_URL` - optional delete-capable reports connection
- No DB URL in non-production - uses encrypted `reports/data/telemetry.ndjson` unless `DISABLE_DB_STORAGE=true`
- No DB URL in production - uses no-op storage unless `ENABLE_NDJSON_STORAGE=true`
- `DISABLE_DB_STORAGE=true` - forces no-op storage, used by Playwright E2E runs
- `TELEMETRY_RETENTION_DAYS` - profile/IP retention period, default `90`
- `REPORTS_AUDIT_RETENTION_DAYS` - delete-audit retention period, default `365`

### Delete controls

- `REPORTS_ALLOW_LOCAL_DELETE=true` - enables deletes from localhost/local reports
- `REPORTS_ALLOW_DELETE=true` - enables deletes regardless of host

## Run locally

```bash
# PowerShell
$env:DASHBOARD_PASSWORD="replace-with-an-independent-24-character-random-password"
$env:TELEMETRY_TOKEN_SECRET="replace-with-an-independent-32-character-random-secret"
# Required if using the local NDJSON fallback.
$env:ENCRYPTION_SECRET="replace-with-a-long-random-secret"
# Optional. Omit DATABASE_URL to use encrypted reports/data/telemetry.ndjson locally.
# $env:DATABASE_URL="postgres://user:password@host:5432/database"

npm start
# open http://localhost:3000/reports.html
```

Any username is accepted; the password is `DASHBOARD_PASSWORD`.

By default, local reports are read-only. Set `REPORTS_ALLOW_LOCAL_DELETE=true` only when you intentionally need delete access.

## Security notes

- Access to `/reports.html`, `/html/reports.html`, `/api/dev/users`, and `/api/dev/ip-locations` is protected with Basic Auth.
- Repeated auth failures against the reports API are rate limited.
- Reports routes use a stricter anti-framing CSP than the main app.
- Delete actions are audit logged in Postgres when admin storage is configured.
- Postgres intentionally keeps raw runtime IP, resolved `country_name`, and `ts` only; the reports API masks IPs. The NDJSON fallback masks IPs at rest.
- Browser GPS is never sent to this server. After explicit disclosure it is sent directly to BigDataCloud for local reverse-geocoded display only.
- Client identity and location fields are ignored; stored profile IDs are derived from a signed HttpOnly cookie.
- Production telemetry writes require an explicit host allowlist.

## Security migration

Run `npm run security:migrate-data` with deployment secrets configured to drop legacy precise-location columns, rekey client-controlled profile IDs, scrub local NDJSON, and remove obsolete `telemetry.sql`/`users.json` exports. Back up only non-sensitive operational data before running it; precise location is intentionally destroyed.

See [`security/README.md`](../security/README.md).
