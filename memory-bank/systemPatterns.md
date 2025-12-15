# System Patterns

## System Architecture

Arclight is primarily a **static, client-side PWA** served from `public/` (or `dist/` in production builds). A lightweight **Express server** (`server.cjs`) is used for:

- local development serving
- serving static assets in production
- a small set of app/telemetry APIs
- protecting and serving the reports/admin pages

## Key Technical Decisions

- **PWA-first:** Service worker + web manifest to support offline usage.
- **Static-first delivery:** Most user-facing functionality is in static HTML/CSS/JS under `public/`.
- **Minimal backend surface area:** Backend is intentionally small and focused on hosting + telemetry.
- **Environment-aware storage:**
  - dev/test: NDJSON store under `reports/data/telemetry.ndjson`
  - production: Postgres when `DATABASE_URL` is present

## Design Patterns in Use

- **Module/Page pattern:** Each major section is a page under `public/html/` with corresponding JS modules under `public/js/`.
- **Event-driven UI:** DOM events and listeners drive interactions.
- **Service Worker caching:** Cache-first/asset caching to enable offline flows.
- **ESM in browser, CJS in Node:** Browser code under `public/js/*.js` is ESM; Node server/tests commonly use `*.cjs`.

## Component Relationships

- **Client entry points:**
  - `public/index.html`
  - pages under `public/html/`
- **Client logic:** `public/js/`
- **Server:** `server.cjs`
  - API endpoints: `/api/app/profile`, `/api/app/refresh`, `/track`
  - Reports protection: Basic Auth for `/reports.html` and `/html/reports.html`
  - Reports API: `/api/dev/users`, `DELETE /api/dev/users/:anonId`
- **Storage selection:** `storage/index.cjs`
  - `storage/ndjson-storage.cjs` (dev/test)
  - `storage/pg-storage.cjs` (production with `DATABASE_URL`)
- **Reports encryption helper:** `reports/security/encrypt.cjs`

## Critical Implementation Paths

- **Navigation + rendering:** ensure `public/html/*` pages and `public/js/*` modules stay in sync.
- **Offline capability:** service worker lifecycle + cache correctness.
- **Telemetry integrity:** consistent identifiers, storage selection by environment, and optional at-rest encryption.
- **Reports access control:** Basic Auth + attempt rate limiting for reports pages.
