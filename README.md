# Arclight App

Arclight is a media-rich, offline-capable (PWA) educational web application for clinical learning (ophthalmology + otoscopy).

The app is primarily static (served from `public/` in dev, and `dist/` in production builds). A lightweight Express server (`server.cjs`) handles:

- local development serving (with/without watch)
- serving static assets in production
- a small set of app + telemetry APIs
- protecting and serving the reports/admin pages

## Contents

- App docs (this file): setup, scripts, env vars
- CI/CD: [`.github/README.md`](./.github/README.md)
- Tests: [`tests/README.md`](./tests/README.md)
- Telemetry / Reports: [`reports/README.md`](./reports/README.md)
- Security notes: [`security/README.md`](./security/README.md)
- Security test scripts: [`securitytest/README.md`](./securitytest/README.md)
- VS Code launcher extension: [`vscode-alanui-launcher/README.md`](./vscode-alanui-launcher/README.md)

## Quick start

```bash
npm install
npm run dev
# open http://localhost:3000
```

If you do not need watch/live-reload:

```bash
npm start
# open http://localhost:3000
```

## Scripts

Common commands (see `package.json` for the full list):

### Run

- Dev server (nodemon): `npm run dev`
- Start server (no watch): `npm start`
- Start server in production mode: `npm run start:prod`

### Run (special)

- Start a second server for tracking (port 3001): `npm run start:track`

### Build / serve built output

- Build static assets to `dist/`: `npm run build`
- Build then serve `dist/`: `npm run serve:dist`
- Build then serve in production mode: `npm run serve:prod`

If the build fails with an `ENOTEMPTY` error while cleaning `dist/` (can happen on Windows when old files are still present), delete `dist/` and re-run:

```bash
# PowerShell
Remove-Item -Recurse -Force dist

# cmd.exe
rmdir /s /q dist
```

### Tests / quality

- Run Jest tests: `npm test`
- CI-style tests: `npm run test:ci`
- Accessibility checks: `npm run test:a11y`
- E2E tests (Playwright): `npm run test:e2e`
- Performance E2E (Playwright): `npm run perf:e2e`
- Lighthouse CI (LHCI): `npm run perf:lh`
- Lint: `npm run lint`
- Format: `npm run format` / `npm run format:check`
- Type check: `npm run type-check`

### Content / i18n

- Check translations: `npm run check-translations`
- Translation QA rules:
  - Correct medical mistranslations caused by homonyms and keep terminology clinically accurate.
  - Keep tone consistent and formal where the content is instructional or clinical.
  - Prefer natural UI actions in each language instead of literal `OK` / `Cancel` carry-overs when `Yes` / `No` or an equivalent is clearer.
  - Keep language-picker labels in their native script where applicable.
  - Avoid hardcoded English in JS-rendered captions, menus, search labels, and aria labels; use explicit i18n keys or the shared legacy fallback path.
  - When legacy root alias keys exist alongside scoped keys (for example Eyes page headers), keep both aligned to avoid route/test regressions.
- Symbol preservation rule: button/icon symbols such as `☰`, `<`, `×` must not be translated in locale JSON files. Keep these values identical across all languages.

## Environment variables

Arclight runs in multiple modes (dev/test/prod). For local development you can copy `.env.sample` to `.env` and adjust values.

> Note: do not commit real secrets. `.env.sample` exists for documentation.

### Core

- `NODE_ENV`: `development` | `test` | `production`
- `HOST`: bind address (default `0.0.0.0`)
- `PORT`: server port (default `3000`)
- `SERVE_DIST`: when `true` / `1`, serve `dist/` even if `NODE_ENV != production`

### Reports / admin access

- `DASHBOARD_PASSWORD`: Basic Auth password for `/reports.html` and `/html/reports.html`.

### Telemetry encryption (optional)

Telemetry can be stored as NDJSON in dev/test and optionally encrypted at rest.

- `ENCRYPTION_SECRET`: when set, telemetry NDJSON rows are encrypted at rest (AES-256-GCM via `reports/security/encrypt.cjs`). If not set, data is written as plain JSON.

> Historical note: you may also see `MASTER_KEY` referenced in older/experimental code (for example `reports/routes/dev.cjs`) and test setup. Current NDJSON encryption uses `ENCRYPTION_SECRET`.

### Production DB

- `DATABASE_URL`: enables Postgres storage in production.
- `DB_SSL`: set to `disable` to disable SSL (otherwise SSL is enabled with `rejectUnauthorized: false`).

## Telemetry + reports (high level)

The server exposes simple app endpoints used by the client:

- `POST /api/app/profile`
- `POST /api/app/refresh`
- `POST /track`

Storage selection:

- In dev/test, telemetry is stored in `reports/data/telemetry.ndjson` (via `storage/ndjson-storage.cjs`).
- In production, if `DATABASE_URL` is present, Postgres is used (via `storage/pg-storage.cjs`).

The password-protected reports pages are served at:

- `GET /reports.html`
- `GET /html/reports.html`

...and read data via:

- `GET /api/dev/users`
- `DELETE /api/dev/users/:anonId`

See [`reports/README.md`](./reports/README.md) for details.

## Docker / Railway

A multi-stage `Dockerfile` is included for reliable Railway builds:

- Build stage: installs full deps and runs `npm run build` to produce `dist/`
- Runtime stage: installs production deps only and runs `node server.cjs`

Runtime expectations:

- Railway sets `PORT` at runtime (Dockerfile defaults to `8080`)
- set `DASHBOARD_PASSWORD` if you intend to access `/reports.html`
- set `DATABASE_URL` to enable Postgres storage

## Project structure (high level)

- `public/` - the client web app (HTML/CSS/JS, images, videos, service worker)
- `public/subapp/` - local mini-apps embedded inside the Videos route Interactive Learning pages
- `server.cjs` - Express server for dev/prod hosting + APIs
- `scripts/` - build + tooling scripts (esbuild, HTML minify, CSS minify)
- `storage/` - NDJSON storage for dev/test + Postgres storage for production
- `reports/` - telemetry data files and helpers
- `security/` - security middleware/config modules (some are placeholders; see `security/README.md`)
- `tests/` - Jest tests
- `.github/` - GitHub Actions workflows

## Notes

- The repo root is configured as an ESM package (`"type": "module"`), but the server and many tests are CommonJS (`*.cjs`). See `jest.config.cjs` and `tests/README.md` for ESM/CJS testing notes.
- If changes do not show up in the browser, the service worker may be serving cached assets. Use DevTools -> Application -> Service Workers and/or "Clear site data" when troubleshooting.
- The Interactive Learning section inside [`public/html/videos.html`](./public/html/videos.html) uses a shared Videos-route subpage pattern:
  - local modules such as `Morph` and `Mires` load from `public/subapp/*`
  - some modules now lazy-load external Netlify iframes (`Fundal Reflex`, `Trauma`, `Amsler`)
- Cross-origin iframe rule: Arclight can style the surrounding card/page shell, but it cannot directly restyle or reposition icons or UI inside an embedded external site. Those changes must be made in the remote app itself.
- External embeds require network access and continued iframe permission from the remote host. They are not cached/offline-capable in the same way as local `public/subapp/*` content. If the remote site later sends `X-Frame-Options` or a restrictive `frame-ancestors` policy, the embed will stop working.

## Changelog (high level)

- 2026-03-11: Added external Interactive Learning embeds for `Fundal Reflex`, `Trauma`, and `Amsler`, and documented the cross-origin iframe constraints.
- 2025-12-15: Docs refresh + CI/Jest ESM interop notes (map browser ESM imports to CJS mocks).
- 2025-10-04: Added security hardening modules (rate limit helpers, auth helpers).
- 2025-09-29: Added GitHub Actions CI pipeline.
