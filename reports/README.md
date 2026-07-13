# `reports/` (Telemetry + Reports)

This folder contains report-facing assets and historical telemetry export files used around the password-protected reports page.

## What this module does (current behavior)

- Runtime telemetry storage is Postgres-backed when a DB URL is configured. In production, missing DB URLs select no-op storage unless `ENABLE_NDJSON_STORAGE=true` is explicitly set.
- Local/dev/test requests do not persist new telemetry events.
- The reports UI is served from the static app (`public/reports.html` and `public/html/reports.html`) and is protected by Basic Auth.
- The server exposes a small admin API used by the reports UI:
  - `GET /api/dev/users` - returns aggregated telemetry rows from the selected runtime store
  - `GET /api/dev/ip-locations` - returns the latest mappable row for each IP with the IP masked for display
  - `DELETE /api/dev/users/:anonId` - deletes user rows only when delete is explicitly enabled
- The reports dashboard plots the latest distinct IP locations on a map and charts real `aims`, `interest`, and `experience` profile data. It does not add demo rows when data is sparse.

These routes are implemented directly in [`server.cjs`](../server.cjs).

## Folder contents

- `data/`
  - `telemetry.ndjson` - runtime fallback storage when Postgres is not configured, plus legacy export data
  - `telemetry.sql` - helper/export SQL
  - `users.json` - legacy/example file
- `security/encrypt.cjs`
  - AES-256-GCM helper kept for legacy NDJSON compatibility.
- `routes/`
  - Experimental / legacy Express routers (`dev.cjs`, `api.cjs`).
  - These are not mounted by `server.cjs`.

## Environment variables

### Reports access

- `DASHBOARD_PASSWORD` - required to access reports pages

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
$env:DASHBOARD_PASSWORD="your-password"
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
- Postgres keeps the full runtime IP for location enrichment and precise-location replacement; the reports API masks it before returning dashboard data. The NDJSON fallback masks IPs at rest.
- Production telemetry writes require an explicit host allowlist.

See [`security/README.md`](../security/README.md).
