# `reports/` (Telemetry + Reports)

This folder contains report-facing assets and historical telemetry export files used around the password-protected reports page.

## What this module does (current behavior)

- Runtime telemetry storage is Postgres-backed when a DB URL is configured, otherwise it falls back to `reports/data/telemetry.ndjson`.
- Local/dev/test requests do not persist new telemetry events.
- The reports UI is served from the static app (`public/reports.html` and `public/html/reports.html`) and is protected by Basic Auth.
- The server exposes a small admin API used by the reports UI:
  - `GET /api/dev/users` - returns aggregated telemetry rows from the selected runtime store
  - `DELETE /api/dev/users/:anonId` - deletes user rows only when delete is explicitly enabled

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
- No DB URL - uses `reports/data/telemetry.ndjson` unless `DISABLE_DB_STORAGE=true`
- `DISABLE_DB_STORAGE=true` - forces no-op storage, used by Playwright E2E runs

### Delete controls

- `REPORTS_ALLOW_LOCAL_DELETE=true` - enables deletes from localhost/local reports
- `REPORTS_ALLOW_DELETE=true` - enables deletes regardless of host

## Run locally

```bash
# PowerShell
$env:DASHBOARD_PASSWORD="your-password"
# Optional. Omit DATABASE_URL to use reports/data/telemetry.ndjson.
# $env:DATABASE_URL="postgres://user:password@host:5432/database"

npm start
# open http://localhost:3000/reports.html
```

Any username is accepted; the password is `DASHBOARD_PASSWORD`.

By default, local reports are read-only. Set `REPORTS_ALLOW_LOCAL_DELETE=true` only when you intentionally need delete access.

## Security notes

- Access to `/reports.html`, `/html/reports.html`, and `/api/dev/users` is protected with Basic Auth.
- Repeated auth failures against the reports API are rate limited.
- Reports routes use a stricter anti-framing CSP than the main app.
- Delete actions are audit logged in Postgres when admin storage is configured.

See [`security/README.md`](../security/README.md).
