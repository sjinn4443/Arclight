# Arclight App

Arclight is a media-rich, offline-capable (PWA) educational web application for clinical learning (ophthalmology + otoscopy). It’s primarily a static web app (`public/`) with an Express server (`server.cjs`) used for local dev, optional APIs, telemetry storage, and a password-protected reports page.

## Contents

- **App docs (this file):** setup, scripts, env vars
- **CI/CD:** [`.github/README.md`](./.github/README.md)
- **Tests:** [`tests/README.md`](./tests/README.md)
- **Telemetry / Reports:** [`reports/README.md`](./reports/README.md)
- **Security notes:** [`security/README.md`](./security/README.md)
- **Security test scripts:** [`securitytest/README.md`](./securitytest/README.md)
- **VS Code launcher extension:** [`vscode-alanui-launcher/README.md`](./vscode-alanui-launcher/README.md)

## Quick start

```bash
npm install
npm run dev
# open http://localhost:3000
```

If you don’t need live reload:

```bash
npm start
```

## Scripts

Common commands (see `package.json` for the full list):

- **Dev server (nodemon):** `npm run dev`
- **Start server (no watch):** `npm start`
- **Build static assets to `dist/`:** `npm run build`
- **Serve built output locally:** `npm run serve:dist`
- **Run Jest tests:** `npm test`
- **CI-style tests:** `npm run test:ci`
- **Accessibility checks:** `npm run test:a11y`
- **Format:** `npm run format` / `npm run format:check`
- **Lint:** `npm run lint`
- **Type check:** `npm run type-check`

## Environment variables

Arclight runs in multiple modes (dev/test/prod). These are the commonly used env vars:

- `NODE_ENV`: `development` | `test` | `production`
- `HOST`: bind address (default `0.0.0.0`)
- `PORT`: server port (default `3000`)
- `SERVE_DIST`: when `true`/`1`, serve `dist/` even if `NODE_ENV !== production`

### Reports / admin access

- `DASHBOARD_PASSWORD`: Basic Auth password for `/reports.html` and `/html/reports.html`.

### Telemetry encryption (optional)

- `ENCRYPTION_SECRET`: when set, telemetry NDJSON rows are encrypted at rest (AES-256-GCM via `reports/security/encrypt.cjs`). If not set, data is written in plain JSON.

### Production DB (Railway)

- `DATABASE_URL`: enables Postgres storage in production.
- `DB_SSL`: set to `disable` to disable SSL (otherwise SSL is enabled with `rejectUnauthorized: false`).

## Telemetry + reports (high level)

The server exposes simple app endpoints used by the client:

- `POST /api/app/profile`
- `POST /api/app/refresh`
- `POST /track`

In **dev/test**, data is stored in `reports/data/telemetry.ndjson` (via `storage/ndjson-storage.cjs`).
In **production**, if `DATABASE_URL` is present, Postgres is used (via `storage/pg-storage.cjs`).

A password-protected reports page is served at:

- `GET /reports.html`
- `GET /html/reports.html`

and reads data via:

- `GET /api/dev/users`
- `DELETE /api/dev/users/:anonId`

See [`reports/README.md`](./reports/README.md) for details.

## Project structure (high level)

- `public/` – the client web app (HTML/CSS/JS, images, videos, service worker)
- `server.cjs` – Express server for dev/prod hosting + APIs
- `storage/` – NDJSON storage for dev/test + Postgres storage for production
- `reports/` – telemetry data files and helpers
- `security/` – security middleware/config modules (some are placeholders; see `security/README.md`)
- `tests/` – Jest tests
- `.github/` – GitHub Actions workflows

## Notes

- The repo root is configured as an ESM package (`"type": "module"`), but the server and many tests are CommonJS (`*.cjs`). See `jest.config.cjs` and `tests/README.md` for ESM/CJS testing notes.

## Changelog (high level)

- **2025-12-15:** CI/Jest ESM interop fix in `jest.config.cjs` (map browser ESM imports to CJS mocks).
- **2025-10-04:** Added security hardening modules (rate limit helpers, auth helpers).
- **2025-09-29:** Added GitHub Actions CI pipeline.
