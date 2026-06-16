# Arclight App

Arclight is a media-rich, offline-capable (PWA) educational web application for clinical learning (ophthalmology + otoscopy).

The app is primarily static (served from `public/` in dev, and `dist/` in production builds). A lightweight Express server (`server.cjs`) handles:

- local development serving (with/without watch)
- serving static assets in production
- a small set of app + telemetry APIs
- collecting an offline asset manifest for install/download flows
- protecting and serving the reports/admin pages

## Contents

- App docs (this file): setup, scripts, env vars
- CI/CD: [`.github/README.md`](./.github/README.md)
- Tests: [`tests/README.md`](./tests/README.md)
- Telemetry / Reports: [`reports/README.md`](./reports/README.md)
- Security notes: [`security/README.md`](./security/README.md)
- Emergency runbook: [`security/EMERGENCY_PLAN.md`](./security/EMERGENCY_PLAN.md)
- Security test scripts: [`securitytest/README.md`](./securitytest/README.md)
- VS Code launcher extension: [`vscode-alanui-launcher/README.md`](./vscode-alanui-launcher/README.md)
- Memory bank: [`memory-bank/`](./memory-bank/)
- Agent notes: [`agent.md`](./agent.md)

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
- Generate childhood HLS outputs: `npm run build:childhood-hls`

Build output notes:

- `BUILD_OUTPUT_DIR` can override the output folder. This is used by the Fundal regression suite to build into `tmp-fundal-dist`.
- The build writes `version.json` with a `versionDate` and same-day `versionSequence`, using explicit env vars, git history, or GitHub API fallback when available.
- On Windows, the cleaner first renames the old output directory to `.build-cleanup-*`, recreates the target directory, and falls back to retrying recursive removal if rename is blocked. Leftover `.build-cleanup-*` folders are ignored by git and can be deleted after confirming no build is running.

### Tests / quality

- Run Jest tests: `npm test`
- CI-style tests: `npm run test:ci`
- Accessibility checks: `npm run test:a11y`
  - Audits static HTML for unnamed `img`, `video`, `iframe`, and icon-only buttons.
  - Reuses the runtime helper in `public/js/mediaA11y.js` so the QA rule matches live behavior.
- E2E tests (Playwright): `npm run test:e2e`
- Fundal route E2E regression suite: `npm run test:fundal`
- Performance E2E (Playwright): `npm run perf:e2e`
- Lighthouse CI (LHCI): `npm run perf:lh`
- Lint: `npm run lint`
- Format: `npm run format` / `npm run format:check`
- Type check: `npm run type-check`

### Content / i18n

- Check translations: `npm run check-translations`
  - Audits keys currently referenced from `public/**/*.html` and `public/**/*.js`.
  - Flags missing locale keys, damaged strings (`???` and replacement characters), and exact-English carry-overs.
  - Use `node scripts/check-translations.cjs --strict-english` to fail on exact-English carry-overs as well.
- Translation QA rules:
  - Correct medical mistranslations caused by homonyms and keep terminology clinically accurate.
  - Keep tone consistent and formal where the content is instructional or clinical.
  - Prefer natural UI actions in each language instead of literal `OK` / `Cancel` carry-overs when `Yes` / `No` or an equivalent is clearer.
  - Keep language-picker labels in their native script where applicable.
  - Avoid hardcoded English in JS-rendered captions, menus, search labels, and aria labels; use explicit i18n keys or the shared legacy fallback path.
  - When legacy root alias keys exist alongside scoped keys (for example Eyes page headers), keep both aligned to avoid route/test regressions.
- Rule source: `scripts/i18n-qa-rules.cjs` stores the standing homonym guidance and the small allowlist of acceptable English-only brand/acronym values.
- Symbol preservation rule: button/icon symbols such as `☰`, `<`, `×` must not be translated in locale JSON files. Keep these values identical across all languages.

Current QA baseline as of `2026-06-12`:

- `npm run test:a11y` passes against `143` HTML files.
- `npm run check-translations` reports `0` missing used keys, `0` damaged strings, `0` exact-English carry-overs, `0` medical homonym violations, and `0` subtitle medical homonym violations.
- Keep new HTML/JS copy, locale JSON, VTT subtitles, and generated subtitle catalogs in sync so this baseline stays clean.

## Environment variables

Arclight runs in multiple modes (dev/test/prod). A local `.env` is optional for basic app development because the default scripts already set the main runtime values. If you need reports auth, encryption, or Postgres storage, copy `.env.sample` to `.env` and uncomment only the variables you actually use.

> Note: do not commit real secrets. `.env.sample` exists for documentation.

### Core

- `NODE_ENV`: `development` | `test` | `production`
- `HOST`: bind address (default `0.0.0.0`)
- `PORT`: server port (default `3000`)
- `SERVE_DIST`: when `true` / `1`, serve `dist/` even if `NODE_ENV != production`
- `DISABLE_DB_STORAGE`: when `true` / `1`, forces no-op runtime storage. Playwright uses this so local E2E runs do not write telemetry.

### Reports / admin access

- `DASHBOARD_PASSWORD`: Basic Auth password for `/reports.html` and `/html/reports.html`.
- `ADMIN_ALLOWED_IPS`: comma-separated exact client IPs allowed to reach `/reports.html`, `/html/reports.html`, and `/api/dev/*` in production. If empty in production, admin/report routes are denied to everyone.
- `REPORTS_ALLOW_LOCAL_DELETE`: enables report-row deletion only for local development.
- `REPORTS_ALLOW_DELETE`: enables report-row deletion in deployed environments. Use only with intentional admin access controls.

### Emergency controls

- `EMERGENCY_MODE`: `off` | `readonly` | `emergency` | `lockdown` (`maintenance` is still accepted as a legacy alias)
- `EMERGENCY_MESSAGE`: optional custom maintenance message used in `emergency` and `lockdown`

### Telemetry encryption (optional)

Legacy NDJSON telemetry can be encrypted at rest when that storage module is used.

- `ENCRYPTION_SECRET`: when set, legacy NDJSON telemetry rows are encrypted at rest (AES-256-GCM via `reports/security/encrypt.cjs`). If not set, that module writes plain JSON.

### Telemetry / geo controls

- `TELEMETRY_ALLOWED_HOSTS`: optional comma-separated host allowlist for telemetry writes.
- `IPINFO_TOKEN`: optional server-side token used by IP geolocation enrichment.

### Production DB

- `DATABASE_URL`: enables Postgres storage in production.
- `REPORTS_READ_DATABASE_URL`: optional read-only Postgres URL for reports reads.
- `REPORTS_ADMIN_DATABASE_URL`: optional admin Postgres URL for reports deletes and audit logging.
- `DB_SSL`: set to `disable` to disable SSL.
- `DB_CA_CERT`: optional CA certificate string for verified TLS.
- `DB_SSL_ALLOW_SELF_SIGNED`: set to `true` to allow self-signed DB TLS certificates. Railway internal Postgres hosts (`*.railway.internal`) are handled automatically.

## Telemetry + reports (high level)

The server exposes simple app endpoints used by the client:

- `POST /api/app/profile`
- `POST /api/app/refresh`
- `GET /api/app/offline-assets`
- `POST /track`

Storage selection:

- Current runtime storage is selected by `storage/index.cjs`.
- If any Postgres URL is configured and `DISABLE_DB_STORAGE` is not enabled, Postgres is used via `storage/pg-storage.cjs`.
- If no Postgres URL is configured and `DISABLE_DB_STORAGE` is not enabled, file-backed NDJSON storage is used via `storage/ndjson-storage.cjs`.
- If `DISABLE_DB_STORAGE=1`, storage is no-op via `storage/disabled-storage.cjs`.

The password-protected reports pages are served at:

- `GET /reports.html`
- `GET /html/reports.html`

...and read data via:

- `GET /api/dev/users`
- `DELETE /api/dev/users/:anonId`

See [`reports/README.md`](./reports/README.md) for details.

## Offline install/downloads

The Language/Install route and menu download actions now use the same offline-download pipeline:

- `GET /api/app/offline-assets` enumerates files under the active static root (`public/` in dev, `dist/` when serving a build) and returns `{ assets, bytes, count, urls }`.
- `public/js/languageinstall.js` turns that manifest into download choices: full content, selected content section, or app-only/no-video content, with low/high video quality filtering where both MP4 tiers exist.
- `public/js/menu.js` reuses the same helpers for the menu download action and the Downloaded Contents summary.
- `public/sw.js` receives selected URL lists through `CACHE_URLS` / `CACHE_ASSETS`, reports progress, caches full MP4 files for offline playback, and serves cached MP4 range requests when the browser asks for partial content.
- Childhood Eye Screening HLS assets and subtitle catalogs are included in the cacheable asset model so iOS HLS playback can keep working offline after a successful download.

When adding new media, keep the file path discoverable under the static root, add it to the relevant Videos/catalog mapping, include matching subtitles where applicable, and bump the service worker cache name when cached behavior or required cached assets change.

## Video subtitles and progress

- `public/js/videoSubtitles.js` applies localized caption tracks to app videos using `public/video-localization/app-video-subtitles.json`.
- `public/js/videos.js` also owns the Childhood Eye Screening subtitle/HLS pilot through `public/video-localization/childhood-eye-screening.json` and VTT files under `public/video-subtitles/`.
- Local video pages use `VIDEO_PAGE_SOURCES` for low/high/online or two-state video modes; many glaucoma workshop video pages now use the same tri-toggle source pattern.
- Shared progress helpers live in `public/js/lessonProgress.js` and `public/js/lessonCompletionTick.js`. They read/write compatible progress records from `lessonProgress:`, `videoProgress:`, `childhoodWorkshop:progress:`, `diabeticWorkshop:progress:`, and `glaucomaWorkshop:progress:` keys, dispatch `arclight:lesson-progress-changed`, and add completion ticks when rows reach completion.

## Docker / Railway

A multi-stage `Dockerfile` is included for reliable Railway builds:

- Build stage: installs full deps and runs `npm run build` to produce `dist/`
- Runtime stage: installs production deps only and runs `node server.cjs`

Runtime expectations:

- Railway sets `PORT` at runtime (Dockerfile defaults to `8080`)
- set `DASHBOARD_PASSWORD` if you intend to access `/reports.html`
- set `ADMIN_ALLOWED_IPS` if you intend to access reports/admin routes in production
- set `DATABASE_URL` to use Postgres storage instead of the default NDJSON fallback

## Emergency controls

- `readonly`: blocks `POST /api/app/profile`, `POST /api/app/refresh`, `POST /track`, and reports delete while keeping normal public GET routes available.
- `emergency`: returns a server-side `503` maintenance page for public HTML requests and `503` JSON for app APIs.
- `lockdown`: blocks all public traffic except `/healthz`, while reports/admin routes remain available only from allowlisted IPs plus valid Basic Auth.
- `GET /healthz` always returns `{ ok: true, emergencyMode }` and can be used by uptime checks during an incident.

See [`security/EMERGENCY_PLAN.md`](./security/EMERGENCY_PLAN.md) for the operator runbook and mode-selection criteria.

## Project structure (high level)

- `public/` - the client web app (HTML/CSS/JS, images, videos, service worker)
- `public/subapp/` - local mini-apps embedded inside the Videos route Interactive Learning pages
- `public/html/childhoodFundal*.html` - Childhood Fundal Reflex scrollytelling route shells
- `public/js/childhoodFundalPreparation.js` - shared Lottie stage-autoplay engine/config for the Childhood Fundal Reflex scrollytelling sequence
- `public/html/casestudy.html` - case-study launcher plus primary/intermediate/advanced chat and flashcard pages
- `public/html/glaucomaHistoryCaseStudy.html` - glaucoma workshop history-taking case-study route
- `public/js/casestudy.js`, `public/js/casestudy_primary.js`, `public/js/glaucomaHistoryCaseStudy.js` - case-study chat/flashcard engines and progress wiring
- `public/html/diabeticRetinopathyWorkshop.html` - diabetic retinopathy workshop launcher, lesson folders, progress rows, scroll lessons, and protocol pages
- `public/html/videos.html` - Videos route, including Interactive Learning, diabetic workshop video pages, and diabetic/glaucoma demo quiz pages
- `public/js/lessonProgress.js`, `public/js/lessonCompletionTick.js` - shared lesson progress storage, row updates, and completion tick rendering
- `public/js/languageinstall.js` - language selection, PWA install prompts, offline download selection, and service-worker cache requests
- `public/js/videoSubtitles.js`, `public/video-localization/`, `public/video-subtitles/` - localized caption catalog/runtime and VTT subtitle assets
- `server.cjs` - Express server for dev/prod hosting + APIs
- `scripts/` - build + tooling scripts (esbuild, HTML minify, CSS minify)
- `storage/` - runtime storage selection, no-op storage, legacy NDJSON storage, and Postgres storage
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
- The Diabetic Retinopathy workshop is launched from the Eyes route and combines workshop folders, scroll lessons, Videos-route lessons, progress bars, folder restore behavior, structural previous/next buttons, protocol pages, and demo quizzes.
  - `public/html/diabeticRetinopathyWorkshop.html` owns the workshop shell and protocol/scroll pages.
  - `public/html/videos.html` owns the diabetic video pages and the Interactive Learning `Demo Quizzes` folder.
  - `public/js/diabeticRetinopathyWorkshop.js` initializes both the workshop route and the diabetic demo quiz pages when those pages are present.
  - `public/js/diabeticWorkshopNextFlow.js` and `public/js/diabeticWorkshopProgress.js` keep cross-route sequencing and progress state aligned.
- Case-study chat pages use a shared `casechat-*` UI vocabulary and stable page/progress IDs:
  - `caseStudyChatPagePrimary` and `caseStudyFlashcardPagePrimary` are owned by `public/js/casestudy_primary.js`.
  - `caseStudyChatPage` is owned by `public/js/casestudy.js`.
  - `glaucomaHistoryCaseStudy` is owned by `public/js/glaucomaHistoryCaseStudy.js` and writes Glaucoma workshop progress.
  - Keep `data-target` values, page IDs, progress targets, and My Learning mappings aligned when moving or adding case-study entries.
- Childhood Fundal Reflex scrollytelling pages use a shared Lottie stage-autoplay pattern:
  - page shells live in `public/html/childhoodFundal*.html` with `.childhood-fundal-scroll-page` and an empty `.childhood-fundal-prep-list`
  - `public/js/config.js` maps the route, `public/js/main.js` lazy-loads `public/js/childhoodFundalPreparation.js`, and that module owns `ROUTE_CONFIG`, `FUNDAL_PAGE_ROUTE_SEQUENCE`, stage creation, replay/down-arrow behavior, scroll locks, settle frames, and cross-page navigation
  - styling lives in `public/style/pages.css` under `.childhood-fundal-scroll-page`
  - the Diabetic Retinopathy workshop can also launch Fundal-style scrollytelling routes, including Direct Ophthalmoscopy routes (`diabeticObservationFundalReflex`, `diabeticPositioningFlightPath`, `diabeticHowToExamine`) and Binocular Indirect Ophthalmoscopy routes (`diabeticBioPreparation`, `diabeticBioFundoscopySitting`, `diabeticBioFundoscopyIndentation`), while reusing the same engine and layout contract
  - pause-before-frame behavior must use explicit `segmentRanges`, `segmentPauseAfterMsByFile`, and stable `settleFrameOverrides`; verify that pause holds the intended frame, does not flash white/final frames, and keeps accumulated text visible after completion
  - for iOS/WebKit white-frame glitches at a pause or hold, follow the snapshot recovery pattern in [`agent.md`](./agent.md): generate an exact PNG from the running local app, map it with `settleSnapshotImageByFile` or `completionSnapshotImageByFile`, prewarm it, and show that exact-frame image immediately instead of falling back to a previous rendered frame
  - Diabetic scrollytelling sequences should continue page-to-page by scroll/down-arrow inside the sequence, then place ordinary `< Previous` / `Next >` buttons at the end of the final scrollytelling page to return to the surrounding workshop flow
  - iOS checks matter: WebKit may need per-file renderer overrides, reduced warmup, and cache-version bumps when Lottie assets or service-worker-cached fragments change
  - when touching shared Fundal playback, run `npm run test:fundal` or manually recheck the Childhood Fundal sequence on desktop and mobile; preserve the FR06 baseline/settle guardrails recorded in `agent.md`
- Cross-origin iframe rule: Arclight can style the surrounding card/page shell, but it cannot directly restyle or reposition icons or UI inside an embedded external site. Those changes must be made in the remote app itself.
- External embeds require network access and continued iframe permission from the remote host. They are not cached/offline-capable in the same way as local `public/subapp/*` content. If the remote site later sends `X-Frame-Options` or a restrictive `frame-ancestors` policy, the embed will stop working.

## Changelog (high level)

- 2026-06-12: Refreshed docs for the June app changes: offline asset-manifest downloads, menu Downloaded Contents summaries, cached MP4/HLS playback behavior, localized app-video subtitles, shared lesson-completion ticks, case-study chat progress, clean translation QA, and iPad/responsive layout maintenance.
- 2026-06-11: Added broad localized subtitle coverage for app videos via `public/video-localization/app-video-subtitles.json`, VTT subtitle folders, and runtime subtitle synchronization.
- 2026-06-02: Added shared lesson progress/completion tick infrastructure and expanded case-study chat/flashcard progress wiring.
- 2026-05-26: Added server-backed offline asset manifest support, selectable offline download modes, service-worker cache progress reporting, cached MP4 range responses, and menu download-management actions.
- 2026-05-25: Documented the iOS/WebKit Fundal scrollytelling white-frame recovery pattern: exact static pause/final snapshots, route-level snapshot maps, prewarming, and WebKit iPhone regression coverage.
- 2026-05-20: Added Diabetic Retinopathy workshop Direct Ophthalmoscopy scrollytelling routes for `Observation and Fundal Reflex`, `Positioning and Flight Path`, and `How to Examine` using the shared Fundal Lottie stage-autoplay engine.
- 2026-05-20: Added Diabetic Retinopathy workshop Binocular Indirect Ophthalmoscopy scrollytelling routes for `Preparation`, `Fundoscopy Sitting`, and `Fundoscopy with Indentation`.
- 2026-05-20: Hardened Diabetic scrollytelling pause-frame behavior, iOS renderer/cache handling, final-page previous/next controls, and notes for future Fundal-style route work.
- 2026-05-15: Documented the Childhood Fundal Reflex scrollytelling route contract, shared Lottie stage-autoplay engine, route sequence ownership, verification path, and FR06 settle guardrails.
- 2026-05-08: Refreshed docs for `Diabetic14`, including the split between the diabetic workshop route and Videos-route demo/video pages, additional diabetic protocol video assets, and the Windows-safe build output cleanup.
- 2026-04-30: Refreshed docs for the Diabetic Retinopathy workshop flow, no-op/default storage behavior, Playwright `DISABLE_DB_STORAGE=1`, split reports DB URLs, and additional runtime env vars.
- 2026-03-11: Added external Interactive Learning embeds for `Fundal Reflex`, `Trauma`, and `Amsler`, and documented the cross-origin iframe constraints.
- 2025-12-15: Docs refresh + CI/Jest ESM interop notes (map browser ESM imports to CJS mocks).
- 2025-10-04: Added security hardening modules (rate limit helpers, auth helpers).
- 2025-09-29: Added GitHub Actions CI pipeline.
