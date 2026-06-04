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
- Childhood Fundal scrollytelling pattern: `public/html/childhoodFundal*.html` shells stay minimal and expose `.childhood-fundal-scroll-page` plus an empty `.childhood-fundal-prep-list`; `public/js/childhoodFundalPreparation.js` builds the Lottie stages, segment text, replay buttons, down-arrow/page-next controls, scroll locks, settle frames, and cross-page navigation from route config.
- Fundal route sequence pattern: `FUNDAL_PAGE_ROUTE_SEQUENCE` is the contract for cross-page Childhood Fundal navigation. Keep it aligned with `public/js/config.js`, `public/js/main.js` `FUNDAL_REFLEX_SCROLL_ROUTES`, Childhood Workshop progress/next-flow mappings, and the actual `childhoodFundal*` HTML shells.
- Fundal settle guardrail: FR06 is the stable baseline for shared Fundal playback/settle behavior. Prefer route-level config fixes over global engine changes, and verify shared changes with `npm run test:fundal` plus mobile/desktop manual checks when practical.
- Fundal iOS/WebKit snapshot recovery pattern: when a correct pause/final frame flashes white or drops layers on iOS, generate an exact PNG from the running local app, configure it with `settleSnapshotImageByFile` or `completionSnapshotImageByFile`, prewarm it, and show it immediately at the hold point. Keep `iosRendererByFile` for renderer correctness, but do not use previous-frame fallbacks for blank recovery because they visibly rewind the animation.
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
- Childhood Fundal Reflex flow:
  - route shells: `public/html/childhoodFundal*.html`
  - route map: `public/js/config.js`
  - lazy initializer set: `public/js/main.js` `FUNDAL_REFLEX_SCROLL_ROUTES`
  - shared engine/config/sequence: `public/js/childhoodFundalPreparation.js`
  - workshop launch/progress/next-flow mappings: `public/js/childhoodEyeScreeningWorkshop.js`, `public/js/childhoodWorkshopProgress.js`, `public/js/childhoodWorkshopNextFlow.js`
  - shared layout/control styling: `public/style/pages.css`
- Workshop scrolly page style: use the Diabetic Retinopathy scrolly format as the canonical hero/card/reveal pattern for Childhood `.childhood-scrolly-page` and Glaucoma `.glaucoma-scrolly-page` scroll lessons, while leaving custom Lottie/interactivity engines intact. Glaucoma scroll lessons should convert source slide text into real HTML text with supporting CSS diagrams, not embed the whole slide image as content.

## Critical Implementation Paths

- Navigation + rendering: ensure `public/html/*` pages and `public/js/*` modules stay in sync.
- Interactive Learning embeds: keep card `data-page` / `data-target` values, hidden subpage IDs, and iframe `data-src` values aligned when adding or changing embedded modules.
- Offline capability: service worker lifecycle + cache correctness.
- Telemetry integrity: consistent identifiers, storage selection by environment, and optional at-rest encryption.
- Reports access control: Basic Auth + attempt rate limiting for reports pages.
- Diabetic Retinopathy workshop: keep lesson row targets, hidden page IDs, Videos targets, `VIDEO_PAGE_SOURCES`, progress keys, and `DIABETIC_NAV_CONFIG` entries synchronized.
- Childhood Fundal Reflex scrollytelling: keep route names, shell IDs, `ROUTE_CONFIG` entries, sequence arrays, Lottie asset paths, workshop mappings, and `.childhood-fundal-scroll-page` CSS synchronized.
- Build output: keep generated `dist/`, `tmp-fundal-dist/`, `tmp-codex-build*/`, and `.build-cleanup-*` directories out of source changes.
