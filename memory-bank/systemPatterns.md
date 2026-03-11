# System Patterns

## System Architecture

Arclight is primarily a static, client-side PWA served from `public/` (or `dist/` in production builds). A lightweight Express server (`server.cjs`) is used for:

- local development serving
- serving static assets in production
- a small set of app/telemetry APIs
- protecting and serving the reports/admin pages

## Key Technical Decisions

- PWA-first: service worker + web manifest to support offline usage.
- Static-first delivery: most user-facing functionality is in static HTML/CSS/JS under `public/`.
- Minimal backend surface area: backend is intentionally small and focused on hosting + telemetry.
- Environment-aware storage:
  - dev/test: NDJSON store under `reports/data/telemetry.ndjson`
  - production: Postgres when `DATABASE_URL` is present

## Design Patterns in Use

- Module/Page pattern: each major section is a page under `public/html/` with corresponding JS modules under `public/js/`.
- Event-driven UI: DOM events and listeners drive interactions.
- Service worker caching: cache-first / asset caching to enable offline flows.
- ESM in browser, CJS in Node: browser code under `public/js/*.js` is ESM; Node server/tests commonly use `*.cjs`.
- i18n symbol preservation: locale files keep UI symbol values (`☰`, `<`, `×`) unchanged across languages; only translatable text is localized.
- Videos-route subpage pattern: cards use `data-page` / `data-target` IDs that map to hidden `.page` sections in `public/html/videos.html`; `public/js/videos.js` lazy-loads any `iframe[data-src]` the first time a subpage is shown.
- Hybrid interactive delivery: Interactive Learning can host either local `public/subapp/*` content or external iframe content inside the same page shell.
- Cross-origin embed boundary: parent-page CSS/JS can control the Arclight wrapper (card spacing, headers, iframe size), but cannot directly alter UI inside a remote iframe.

## Component Relationships

- Client entry points:
  - `public/index.html`
  - pages under `public/html/`
- Client logic: `public/js/`
- Server: `server.cjs`
  - API endpoints: `/api/app/profile`, `/api/app/refresh`, `/track`
  - Reports protection: Basic Auth for `/reports.html` and `/html/reports.html`
  - Reports API: `/api/dev/users`, `DELETE /api/dev/users/:anonId`
- Storage selection: `storage/index.cjs`
  - `storage/ndjson-storage.cjs` (dev/test)
  - `storage/pg-storage.cjs` (production with `DATABASE_URL`)
- Reports encryption helper: `reports/security/encrypt.cjs`

## Critical Implementation Paths

- Navigation + rendering: ensure `public/html/*` pages and `public/js/*` modules stay in sync.
- Interactive Learning embeds: keep card `data-page` / `data-target` values, hidden subpage IDs, and iframe `data-src` values aligned when adding or changing embedded modules.
- Offline capability: service worker lifecycle + cache correctness.
- Telemetry integrity: consistent identifiers, storage selection by environment, and optional at-rest encryption.
- Reports access control: Basic Auth + attempt rate limiting for reports pages.
