<!-- THE CHANGES - techContext.md | 2026-06-19, Codex -->

# Tech Context

## Technologies Used

- Core UI: HTML5, CSS3, JavaScript (ESM in browser)
- Server: Node.js + Express (`server.cjs`)
- PWA: Service Worker API, Web Manifest
- Offline install/downloads: server-generated static asset manifest (`/api/app/offline-assets`), service-worker on-demand caching, cached MP4 range responses, and HLS/subtitle cache support
- Video localization: JSON subtitle catalogs in `public/video-localization/` plus VTT assets in `public/video-subtitles/`, synchronized at runtime by `public/js/videoSubtitles.js` and Videos-route subtitle helpers
- Embedded interactive content: local iframe mini-apps under `public/subapp/*`, selected external Netlify iframes, Videos-route diabetic video pages, full-animation local MP4 pages, and demo quiz pages inside `public/html/videos.html`
- Workshop flows: static HTML lesson shells plus JS navigation/progress helpers, including `public/js/diabeticWorkshopNextFlow.js`, `public/js/diabeticWorkshopProgress.js`, and diabetic quiz/scroll initializers in `public/js/diabeticRetinopathyWorkshop.js`
- Shared progress UI: `public/js/lessonProgress.js` and `public/js/lessonCompletionTick.js`
- Case-study chat: `public/html/casestudy.html`, `public/js/casestudy.js`, `public/js/casestudy_primary.js`, `public/html/glaucomaHistoryCaseStudy.html`, and `public/js/glaucomaHistoryCaseStudy.js`
- Fundal scrollytelling: Lottie JSON animations driven by the shared stage-autoplay engine/config in `public/js/childhoodFundalPreparation.js`, with route shells under `public/html/childhoodFundal*.html`
- Build & Bundling: `esbuild`, `clean-css-cli`, `html-minifier-terser`
- Testing: Jest (mix of `*.cjs` + `*.mjs`), JSDOM, Supertest
- Quality: ESLint, Prettier, Husky + lint-staged
- E2E/Perf (optional): Playwright, Lighthouse CI
- Storage:
  - current default: file-backed NDJSON storage via `storage/ndjson-storage.cjs` when no DB URL is configured
  - Postgres: `storage/pg-storage.cjs` when any configured Postgres URL is present and `DISABLE_DB_STORAGE` is not enabled
  - forced off: `storage/disabled-storage.cjs` when `DISABLE_DB_STORAGE=1`

## Development Setup

- Install deps: `npm install`
- Dev server (watch): `npm run dev`
- Start server: `npm start`
- Build: `npm run build`
- Serve built output: `npm run serve:dist`
- Accessibility audit: `npm run test:a11y`
- Translation/subtitle QA: `npm run check-translations`
- Fundal regression suite: `npm run test:fundal`
- Override build output directory: set `BUILD_OUTPUT_DIR`

### Offline install/download notes

- `server.cjs` exposes `/api/app/offline-assets`, which enumerates files from the active static root and returns file URLs, byte sizes, count, and total bytes.
- `public/js/languageinstall.js` owns download options: full content, selected content section, app-only/no-video, and video quality filtering.
- `public/js/menu.js` reuses the same helpers for menu-started downloads and Downloaded Contents summaries.
- `public/sw.js` caches selected URL lists via `CACHE_URLS` / `CACHE_ASSETS`, reports progress, serves cached MP4 range requests from complete cached MP4s, and keeps cached Childhood Eye Screening HLS assets usable offline.
- When cached behavior or required precached assets change, bump the service-worker cache name.

### Interactive Learning integration notes

- Local interactive modules are typically served from `public/subapp/*`.
- External interactive modules are embedded through hidden subpages in `public/html/videos.html` and lazy-loaded by `public/js/videos.js`.
- Cross-origin iframe internals cannot be styled or scripted directly from Arclight.
- Diabetic workshop previous/next flow can cross from the workshop route into Videos-route pages; the flow state is stored in `sessionStorage` and restored when returning to the workshop folders.
- Diabetic demo quizzes live in `public/html/videos.html` but use initializers exported from `public/js/diabeticRetinopathyWorkshop.js`; `main.js` imports those initializers for the Videos route.
- Diabetic video pages require their hidden `.page` IDs, workshop `data-target` rows, and `VIDEO_PAGE_SOURCES` entries in `public/js/videos.js` to stay in sync.
- Full-animation local MP4 pages currently include `fundalReflexFullAnimationVideoPage`, `directOphthalmoscopyFullAnimationVideoPage`, and `binocularIndirectOphthalmoscopyFullAnimationVideoPage`; their low/high files live in `public/videos/FullAnim/`.
- Local video pages also require subtitle catalog entries and offline-download categorization when subtitles/offline playback should work.
- `public/js/videoSubtitles.js` attaches app-wide subtitle tracks from `public/video-localization/app-video-subtitles.json`; the Childhood Eye Screening pilot uses `public/video-localization/childhood-eye-screening.json` plus HLS metadata and VTT files.

### Shared progress notes

- `setLessonProgress()` writes `lessonProgress:<target>` records and dispatches `arclight:lesson-progress-changed`.
- `readLessonProgress()` considers compatible progress prefixes, including video and workshop prefixes, so launcher rows can reflect progress written by different route owners.
- `lessonCompletionTick.js` observes progress rows and inserts completion ticks when rows reach completion.
- Keep row `data-target` values stable across launcher HTML, route page IDs, My Learning mappings, and progress storage keys.

### Case-study chat notes

- Primary case-study chat and flashcard progress targets are `caseStudyChatPagePrimary` and `caseStudyFlashcardPagePrimary`.
- Intermediate case-study chat progress target is `caseStudyChatPage`.
- Glaucoma history-taking route/progress target is `glaucomaHistoryCaseStudy`.
- Shared `casechat-*` CSS is used by case-study and glaucoma-history pages; route-specific responsive overrides live in `public/style/responsive.css`.

### Childhood Fundal scrollytelling notes

- Route shells use `.childhood-fundal-scroll-page` and an empty `.childhood-fundal-prep-list`; the JS engine creates the stage DOM at runtime.
- Route ownership is split across `public/js/config.js`, `public/js/main.js`, `public/js/childhoodFundalPreparation.js`, Childhood Workshop mapping files, and `public/style/pages.css`.
- `FUNDAL_PAGE_ROUTE_SEQUENCE` defines the cross-page order and page-next behavior.
- Shared engine changes should preserve the FR06 settle/playback baseline and be checked with `npm run test:fundal` plus targeted manual desktop/mobile passes when practical.

### Build output behavior

- `scripts/build.cjs` copies `public/` to the build output, bundles JS into the output `js/` folder, bundles `sw.js`, minifies CSS/HTML, and writes `version.json`.
- Output cleaning is Windows-aware: existing output directories are renamed to `.build-cleanup-*` before a fresh directory is created, with retrying recursive removal as fallback.
- `.build-cleanup-*` folders are ignored by git and are disposable after builds complete.

## Key Environment Variables

- `NODE_ENV`: `development` | `test` | `production`
- `PORT`, `HOST`
- `SERVE_DIST`: serve `dist/` even when `NODE_ENV` is not production
- `DISABLE_DB_STORAGE`: force no-op runtime storage; Playwright starts the web server with this enabled

### Reports

- `DASHBOARD_PASSWORD`: Basic Auth password for `/reports.html` and `/html/reports.html`
- `REPORTS_ALLOW_LOCAL_DELETE`: enables report deletion only for local development
- `REPORTS_ALLOW_DELETE`: enables report deletion in deployed environments

### Telemetry encryption (NDJSON mode)

- `ENCRYPTION_SECRET`: when set, NDJSON rows are encrypted at rest (AES-256-GCM via `reports/security/encrypt.cjs`).

### Production DB

- `DATABASE_URL`: enables Postgres storage
- `REPORTS_READ_DATABASE_URL`: optional read-only database URL for reports reads
- `REPORTS_ADMIN_DATABASE_URL`: optional admin database URL for reports deletes/audit logs
- `DB_SSL`: set to `disable` to disable SSL
- `DB_CA_CERT`: optional CA certificate
- `DB_SSL_ALLOW_SELF_SIGNED`: allow self-signed DB TLS certificates when set to `true`

## Testing Setup

- Jest config: `jest.config.cjs`
- Run tests: `npm test`
- CI-style tests: `npm run test:ci`

### ESM/CJS constraint

The repo root is ESM (`"type": "module"`), but server and many tests are CommonJS (`*.cjs`). To avoid ESM loader issues when CJS tests import browser ESM modules, Jest uses `moduleNameMapper` to map selected ESM modules to CJS mocks under `tests/__mocks__/`.

## CI/CD

- GitHub Actions workflow: `.github/workflows/ci-cd.yml`
- Runs format check, build, accessibility checks, Jest, and uploads `dist/` as an artifact.
