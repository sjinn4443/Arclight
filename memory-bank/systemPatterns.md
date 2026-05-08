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
  - default/no DB: no-op storage through `storage/disabled-storage.cjs`
  - DB configured: Postgres through `storage/pg-storage.cjs`
  - E2E isolation: Playwright sets `DISABLE_DB_STORAGE=1`
  - legacy/local NDJSON support remains in `storage/ndjson-storage.cjs` but is not selected by the current storage index

## Design Patterns in Use

- Module/Page pattern: each major section is a page under `public/html/` with corresponding JS modules under `public/js/`.
- Event-driven UI: DOM events and listeners drive interactions.
- Service worker caching: cache-first / asset caching to enable offline flows.
- ESM in browser, CJS in Node: browser code under `public/js/*.js` is ESM; Node server/tests commonly use `*.cjs`.
- i18n QA policy:
  - Locale files keep UI symbol values (`?`, `<`, `?`) unchanged across languages.
  - Medical and clinical copy must prefer correct terminology over literal homonym-based translations.
  - Instructional and clinical UI copy should keep a consistent formal tone where appropriate.
  - UI actions should use natural target-language wording rather than literal `OK` / `Cancel` carry-overs when clearer equivalents exist.
  - Language-picker labels should use native-script names where applicable.
  - Translation checks must include JS-rendered captions, toggles, search labels, and aria labels, not only static HTML.
  - When a route still depends on legacy root alias keys as well as scoped keys, keep both in sync to avoid regressions.
- Videos-route subpage pattern: cards use `data-page` / `data-target` IDs that map to hidden `.page` sections in `public/html/videos.html`; `public/js/videos.js` lazy-loads any `iframe[data-src]` the first time a subpage is shown.
- Hybrid interactive delivery: Interactive Learning can host either local `public/subapp/*` content or external iframe content inside the same page shell.
- Cross-origin embed boundary: parent-page CSS/JS can control the Arclight wrapper (card spacing, headers, iframe size), but cannot directly alter UI inside a remote iframe.
- Workshop flow pattern: route-level lesson pages can use stable `data-target`/`data-lesson`/`data-folder` identifiers, progress bars, and `sessionStorage` restore flags to support foldered learning flows across route boundaries.
- Diabetic workshop next-flow pattern: `public/js/diabeticWorkshopNextFlow.js` owns structural Previous/Next controls, Videos-route jumps, and folder restore on return to the workshop.
- Diabetic route split pattern: `public/html/diabeticRetinopathyWorkshop.html` owns the workshop launcher, scroll lessons, and protocol pages; `public/html/videos.html` owns diabetic video pages and demo quiz pages. Shared `data-target` IDs, hidden `.page` IDs, `VIDEO_PAGE_SOURCES`, progress events, and next-flow mappings are the contract between the routes.
- Build cleanup pattern: `scripts/build.cjs` creates a fresh build output by renaming the old directory to `.build-cleanup-*`, recreating the requested output directory, then continuing the build. This avoids common Windows `ENOTEMPTY`/file-lock failures while leaving ignored cleanup folders that can be deleted later.

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
  - `storage/disabled-storage.cjs` (default/no DB or `DISABLE_DB_STORAGE=1`)
  - `storage/pg-storage.cjs` (Postgres URL configured)
  - `storage/ndjson-storage.cjs` (legacy/local module, not selected by current index)
- Reports encryption helper: `reports/security/encrypt.cjs`
- Diabetic workshop flow:
  - route shell: `public/html/diabeticRetinopathyWorkshop.html`
  - Videos-route diabetic demo/video pages: `public/html/videos.html`
  - lesson/progress/quiz logic: `public/js/diabeticRetinopathyWorkshop.js`, `public/js/diabeticWorkshopProgress.js`
  - cross-route Previous/Next logic: `public/js/diabeticWorkshopNextFlow.js`
  - Videos-route video source registration and subpage display: `public/js/videos.js`

## Critical Implementation Paths

- Navigation + rendering: ensure `public/html/*` pages and `public/js/*` modules stay in sync.
- Interactive Learning embeds: keep card `data-page` / `data-target` values, hidden subpage IDs, and iframe `data-src` values aligned when adding or changing embedded modules.
- Offline capability: service worker lifecycle + cache correctness.
- Telemetry integrity: consistent identifiers, storage selection by environment, and optional at-rest encryption.
- Reports access control: Basic Auth + attempt rate limiting for reports pages.
- Diabetic Retinopathy workshop: keep lesson row targets, hidden page IDs, Videos targets, `VIDEO_PAGE_SOURCES`, progress keys, and `DIABETIC_NAV_CONFIG` entries synchronized.
- Build output: keep generated `dist/`, `tmp-fundal-dist/`, `tmp-codex-build*/`, and `.build-cleanup-*` directories out of source changes.
