# `reports/` (Telemetry + Reports)

This folder contains telemetry data files and helpers used by the Arclight server to power the password-protected reports page.

## What this module does (current behavior)

- In **dev/test**, the server writes telemetry to `reports/data/telemetry.ndjson` via `storage/ndjson-storage.cjs`.
- The reports UI is served from the static app (`public/reports.html` and `public/html/reports.html`) and is protected by **Basic Auth**.
- The server exposes a small admin API used by the reports UI:
  - `GET /api/dev/users` – returns aggregated telemetry rows
  - `DELETE /api/dev/users/:anonId` – deletes user rows from the NDJSON store

These routes are implemented directly in **`server.cjs`**.

## Folder contents

- `data/`
  - `telemetry.ndjson` – NDJSON store (one record per line)
  - `telemetry.sql` – helper SQL (optional)
  - `users.json` – legacy/example file (not used by current server flow)
- `security/encrypt.cjs`
  - AES-256-GCM helper used by `storage/ndjson-storage.cjs` to encrypt/decrypt NDJSON rows.
- `routes/`
  - Experimental / legacy Express routers (`dev.cjs`, `api.cjs`).
  - **Note:** these are not mounted by `server.cjs` today; treat as optional reference.

## Environment variables

### Reports access

- `DASHBOARD_PASSWORD` (required to access reports pages)

### At-rest encryption for NDJSON (optional)

- `ENCRYPTION_SECRET`
  - If set, `storage/ndjson-storage.cjs` encrypts each NDJSON line before writing.
  - If not set, data is written as plain JSON lines.

### Storage selection

- In production, if `DATABASE_URL` is set, `storage/index.cjs` selects Postgres storage.

## Run locally

```bash
# PowerShell
$env:DASHBOARD_PASSWORD="your-password"
# optional
$env:ENCRYPTION_SECRET="a-long-random-string"

npm start
# open http://localhost:3000/reports.html
```

Any username is accepted; the password is `DASHBOARD_PASSWORD`.

## Data format

In NDJSON mode, each line represents a telemetry event.

- If `ENCRYPTION_SECRET` is **not** set, the line is JSON.
- If `ENCRYPTION_SECRET` **is** set, the line is an encrypted payload and must be decrypted server-side.

Event types currently written by the server-side storage layer:

- `profile`
- `refresh`
- `ip`

## Security notes

- Access to `/reports.html` and `/html/reports.html` is protected with Basic Auth.
- `server.cjs` also rate-limits repeated auth attempts against the reports pages to reduce password guessing.

See [`security/README.md`](../security/README.md).
