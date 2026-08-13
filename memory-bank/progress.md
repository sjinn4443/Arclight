# Progress

## What Works

- Core application structure: the main `index.html` and module directories are in place, supporting a comprehensive PWA.
- Advanced navigation: a unified dashboard, language/install page, onboarding, professional interest pages, and detailed module pages for Eyes and Ears are functional.
- PWA setup: `manifest.json` and `sw.js` are present, with service worker registration and an update prompt mechanism implemented in the client.
- Content organization: images and videos are organized in dedicated directories and dynamically loaded.
- Module-specific content: each module (for example Anterior Segment Quiz, Cataract, Mires, Morph, Squint) has its own HTML, CSS, and JavaScript files where appropriate.
- VS Code launch configuration: a `launch.json` file exists to run the application locally for debugging.
- "My Learning" (Liked) page: features a masonry layout, search functionality, and persistent "like" state for modules.
- Atoms Card with dynamic TOC: the "Atoms Card" section includes a dynamic table of contents for both Eyes and Ears, with image display and zoom capabilities.
- Quiz system: implemented for "Direct Ophthalmoscopy" and "Anterior Segment Quiz" modules, providing interactive learning and feedback.
- Video players with interactive toolbars: various learning modules feature video players with time-based event handling and interactive toolbars.
- Full-animation local videos: Fundal Reflex, Direct Ophthalmoscopy, and Binocular Indirect Ophthalmoscopy now have low/high MP4 lesson pages under the Videos route, backed by `public/videos/FullAnim/` and `public/js/videos.js` `VIDEO_PAGE_SOURCES`.
- Interactive Learning hybrid embeds: the Videos route now supports both local interactive mini-apps (`public/subapp/*`) and external iframe-based modules (`Fundal Reflex`, `Trauma`, `Amsler`) within the same wrapper flow.
- Interactive Learning eye-examination Connect game: the Primary launcher opens a local 7x7 path puzzle with six image checkpoints in the required History -> VA -> Front of eye -> Pupils -> Fundal reflex -> DO order, all-cell completion validation, a first-play visual tutorial, pointer/touch and keyboard controls, and shared progress/completion ticks.
- Diabetic Retinopathy workshop: the Eyes route now launches a foldered workshop with scroll lessons, video lessons, progress rows, protocol pages, structural Previous/Next controls, and demo quizzes.
- Diabetic/Videos split: diabetic video pages and diabetic demo quizzes now live under `public/html/videos.html`, while the diabetic workshop route owns the folder launcher, scroll lessons, and protocol pages.
- Diabetic workshop progress/navigation: progress bars update through `public/js/diabeticWorkshopProgress.js`, while `public/js/diabeticWorkshopNextFlow.js` controls cross-route sequencing and folder restore behavior.
- Diabetic DO scrollytelling: the Direct Ophthalmoscopy folder now launches `Observation and Fundal Reflex`, `Positioning and Flight Path`, and `How to Examine` as Fundal-style Lottie stage-autoplay pages using assets under `public/scrolly/coreexam/ophths/DO/`.
- Diabetic BIO scrollytelling: the Binocular Indirect Ophthalmoscopy folder now launches `Preparation`, `Fundoscopy Sitting`, and `Fundoscopy with Indentation` as Fundal-style Lottie stage-autoplay pages using assets under `public/scrolly/coreexam/ophths/BIO/`.
- Diabetic scrollytelling pause/iOS hardening: pause-before-frame playback holds the requested frame, accumulated captions survive completion, heavy BIO routes can use iOS renderer/warmup overrides, fragile WebKit pause/final holds can use exact static snapshots, and final scrollytelling pages can expose ordinary `< Previous` / `Next >` controls.
- Diabetic demo quizzes: Videos-route demo quiz pages include matching history to image, findings grouping, connect, retinal-structure tapping, and review-video quiz flows initialized by `public/js/diabeticRetinopathyWorkshop.js`.
- Diabetic protocol media: NCD/protocol visual assets and low-resolution workshop videos are present under `public/images/learning/Diabetic/Diabetes/NCD/` and `public/videos/Workshop/Diabetic/`.
- Childhood Fundal Reflex scrollytelling: `childhoodFundal*` routes share the Lottie stage-autoplay engine in `public/js/childhoodFundalPreparation.js`, with route shells in `public/html/childhoodFundal*.html`, route wiring in `config.js`/`main.js`, and shared layout/control styling in `public/style/pages.css`.
- Fundal route sequence/navigation: `FUNDAL_PAGE_ROUTE_SEQUENCE` controls the Preparation -> Examination -> Newborn Eyes Open/Closed -> Unclear Findings -> Possible Finding -> After Examination flow, including down-arrow/page-next behavior and boundary navigation.
- Offline content management: a modal uses a build-generated/cached manifest to select assets; sensitive, API, report, health, failed, and `no-store` responses are excluded from service-worker caches.
- Server-backed offline downloads: `GET /api/app/offline-assets` provides a static asset manifest with byte sizes, and `languageinstall.js`/`menu.js` use it for full/select/app-only downloads, low/high MP4 filtering, estimates, progress, and Downloaded Contents summaries.
- Offline media playback: the service worker can cache selected assets on demand, satisfy cached MP4 range requests from complete cached MP4s, fall back between cached `_220p` and `_720p` variants, and keep Childhood Eye Screening HLS assets usable offline after download.
- App video subtitles: localized caption tracks are driven by `public/js/videoSubtitles.js`, `public/video-localization/app-video-subtitles.json`, the Childhood Eye Screening subtitle catalog, and VTT subtitle folders under `public/video-subtitles/`.
- General application refinement: ongoing improvements and content integration across various modules, including updates to video playback, navigation, onboarding, and PWA features.
- Menu search refactor: menu search functionality aligns with dashboard compact search patterns, including HTML structure and CSS for consistent styling and behavior.
- Shared lesson progress/completion ticks: `public/js/lessonProgress.js` and `public/js/lessonCompletionTick.js` centralize progress reads/writes, row updates, completion ticks, and the `arclight:lesson-progress-changed` event across videos, workshops, case studies, and My Learning.
- Case-study chat and flashcards: `casestudy.html` hosts primary/intermediate/advanced case-study entries, with primary chat/flashcards in `casestudy_primary.js`, intermediate chat in `casestudy.js`, and glaucoma history-taking in `glaucomaHistoryCaseStudy.js`.
- iPad/tablet responsive fixes: route-specific responsive overrides in `public/style/responsive.css` now cover dashboard/menu/onboarding/My Learning, Videos pages, case-study chat, workshops, and subapp layouts.
- Testing setup: Jest for unit, UI, and API testing, with Git hooks available for automated checks.
- Static accessibility audit: `scripts/test-a11y.mjs` checks media/button accessible names and currently passes on `145` HTML files.
- Translation audit baseline: `scripts/check-translations.cjs` audits used i18n keys, damaged UTF-8 strings, fallback-English carry-overs, medical homonym guidance, and subtitle homonym coverage; the current baseline is clean.
- CI/CD pipeline: GitHub Actions CI/CD pipeline at `.github/workflows/ci-cd.yml` runs formatting checks, build, runtime security audit, accessibility checks, Jest, and artifact upload.
- Security enhancements: reports Basic Auth, bounded attempt limiting, admin IP allowlisting, strict secrets/proxy validation, signed-cookie telemetry identity, exact-origin checks, route limits, data minimization, and retention pruning are in place.
- Location privacy: PostgreSQL intentionally keeps only raw IP, resolved country name, and timestamp; dashboard/NDJSON IPs remain masked, and GPS never reaches Arclight.
- Supply-chain/runtime hardening: pinned browser libraries are self-hosted, moderate runtime audits gate CI, and the production image runs as the unprivileged `node` user.
- Runtime storage selection: storage uses Postgres when configured, uses NDJSON fallback only for non-production or explicit encrypted production fallback, and can be forced off with `DISABLE_DB_STORAGE=1`.
- Playwright E2E isolation: the configured web server starts with `DISABLE_DB_STORAGE=1`.
- Windows-safe build cleanup: `scripts/build.cjs` renames old build output directories to `.build-cleanup-*`, recreates the target output directory, and writes `version.json` metadata during builds.
- Module system fix: resolved ES module / CommonJS conflict by renaming `server.js` to `server.cjs` and updating related `require` paths and `package.json` scripts.
- CI/Jest ESM interop fix: Jest `moduleNameMapper` maps ESM browser modules to CJS mocks for CJS tests.
- Documentation refresh: updated README files across `README.md`, `.github/`, `reports/`, `security/`, `securitytest/`, `tests/`, and `vscode-alanui-launcher/`.
- Husky hooks enabled: `prepare` runs `husky`, Git hooksPath is `.husky/_`, and `pre-commit` runs `lint-staged`.

## Security Updates (2026-06-29 to 2026-07-10)

Source of truth: `security01`, `security02`, and `security03` on `main`. These security changes landed on `2026-07-07`.

| Item                     | Before                                                                     | After                                                                                    | How                                                                                                                                         |
| ------------------------ | -------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------- |
| Report data in the repo  | Telemetry/user files were tracked in Git.                                  | Report data files are no longer tracked.                                                 | Removed `reports/data/telemetry.ndjson`, `telemetry.sql`, and `users.json` from Git, then ignored generated report data.                    |
| Production file storage  | Production could fall back to local NDJSON files when no database was set. | Production uses no-op storage unless file storage is explicitly enabled.                 | Updated storage selection so Postgres is preferred, and NDJSON needs `ENABLE_NDJSON_STORAGE=true`.                                          |
| Telemetry encryption     | Missing encryption secret could allow unsafe local telemetry writes.       | NDJSON telemetry writes require `ENCRYPTION_SECRET`.                                     | Changed encryption helper to throw instead of writing plaintext.                                                                            |
| Telemetry access         | Production telemetry could be too open if no host allowlist was set.       | Production telemetry is disabled until allowed hosts and a server secret are configured. | Tightened telemetry host policy and token-secret checks.                                                                                    |
| Unsafe production config | Weak or missing production settings could be missed until runtime.         | Unsafe production settings stop server startup.                                          | Added runtime config validation for placeholder secrets, NDJSON without encryption, disabled remote DB TLS, and telemetry without a secret. |
| Location telemetry       | Detailed geo and client-controlled identity could reach storage.           | Postgres retains raw IP/country/timestamp only and uses a server-owned identity.         | Stripped location/identity inputs, kept GPS local, and made country lookup opt-in.                                                          |
| Data retention           | Telemetry could remain indefinitely.                                       | Telemetry defaults to 90 days, audit logs to 365 days.                                   | Added retention pruning for Postgres and NDJSON storage.                                                                                    |
| Admin password check     | Dashboard password used a normal string comparison.                        | Dashboard password uses safer timing-resistant comparison.                               | Switched Basic Auth password matching to `crypto.timingSafeEqual`.                                                                          |
| Dependency risk          | Unused or vulnerable packages remained installed.                          | Full `npm audit` reports 0 vulnerabilities.                                              | Removed unused vulnerable packages and outdated dev tools; updated runtime dependencies.                                                    |
| CI security check        | Runtime audits and image privilege were less strict.                       | CI blocks moderate runtime issues and root runtime images.                               | Uses `npm audit --omit=dev --audit-level=moderate` and asserts a non-root UID.                                                              |
| Test coverage            | New security rules were not all covered.                                   | Security behavior is covered by focused tests.                                           | Added tests for encryption, storage selection, runtime config, privacy, and telemetry policy.                                               |

## What's Left to Build

- Security operations: rotate Railway/GitHub secrets outside the repo, keep `TRUST_PROXY=1` for the current Railway topology, explicitly enable country lookup when wanted, and require collaborators to re-clone after the authorized history rewrite.
- Full content population: ensure all educational modules are fully populated with comprehensive content (text, images, videos, quizzes).
- Interactive elements: continue refining quizzes, case studies, and interactive tools for a more engaging user experience.
- Robust error handling: improve client-side error handling for a smoother user experience across features.
- Accessibility features: enhance ARIA attributes, keyboard navigation, and general accessibility across the application.
- Translation and subtitle maintenance: keep new user-facing HTML/JS copy, accessible label attributes, locale JSON, subtitle catalogs, and VTT files synchronized so the clean `npm run check-translations` baseline stays clean.
- Offline download maintenance: keep asset paths, offline catalog matching, low/high video filtering, HLS/subtitle cache inclusion, service-worker cache behavior, and Downloaded Contents summaries aligned when adding media. For full-animation MP4 lessons, keep `public/videos/FullAnim/` file names and `VIDEO_PAGE_SOURCES` entries aligned with launcher rows and tests.
- Progress/row maintenance: use the shared lesson progress and completion tick helpers for new rows instead of adding route-specific progress storage.
- Case-study maintenance: keep `data-target` values, page IDs, progress targets, My Learning mappings, and `casechat-*` styles synchronized when adding or moving case-study content.
- Fundal scrollytelling maintenance: preserve the FR06 playback/settle baseline and keep route shells, route maps, shared engine config, workshop mappings, and CSS synchronized when adding or changing `childhoodFundal*` pages. For iOS/WebKit white-frame glitches at pause/final holds, use exact static snapshot recovery before changing segment ranges or adding runtime previous-frame fallbacks.
- Testing: continue to expand automated tests for new features, edge cases, error handling, and PWA behaviors.
- Performance optimization: further optimize media loading and overall application performance.

## Current Status

The project is a feature-rich PWA with a strong emphasis on interactive learning and offline capabilities. The Express server (`server.cjs`) supports local/prod hosting, telemetry/report APIs, password-protected reports pages, and the offline asset manifest endpoint. Runtime storage uses Postgres when configured, non-production NDJSON fallback when appropriate, and no-op storage in production unless encrypted NDJSON fallback is explicitly enabled. Jest, Playwright, accessibility checks, translation QA, and security audit checks are in place. The Interactive Learning page mixes local mini-apps, external embedded tools, Videos-route diabetic demo quizzes, full-animation local MP4 lessons, localized videos/subtitles, case-study chat flows, and workshop-linked progress rows. The Eyes route includes both a substantial Diabetic Retinopathy workshop flow whose video/demo content crosses into the Videos route and a Childhood Fundal Reflex scrollytelling sequence powered by a shared Lottie stage-autoplay engine.

## Known Issues

- The application might not immediately show the latest version due to browser caching of the service worker.
- Some placeholder content still exists and needs to be replaced with actual educational material.
- Some security modules under `security/` are placeholders pending re-enablement as middleware.
- External interactive embeds depend on remote site uptime and iframe permissions, and they are not as controllable or offline-cacheable as local `public/subapp/*` content.
- Translation QA is clean as of `2026-06-12`, but new copy can regress it if locale keys, VTT files, or subtitle catalogs are not updated with the feature change.
- Offline video behavior depends on complete cached MP4s for service-worker range responses; if only online or partial media is available, playback falls back to the network.
- Full-animation video rows depend on synchronized target IDs across `childhoodEyeScreeningWorkshop.html`, `diabeticRetinopathyWorkshop.html`, `videos.html`, `videos.js`, and topic-target tests.
- Diabetic workshop behavior depends on IDs being synchronized across `diabeticRetinopathyWorkshop.html`, `videos.html`, `videos.js`, `diabeticWorkshopNextFlow.js`, and progress storage keys.
- Case-study progress depends on IDs being synchronized across `casestudy.html`, `casestudy.js`, `casestudy_primary.js`, `glaucomaHistoryCaseStudy.js`, My Learning mappings, and shared progress keys.
- Tablet/iPad CSS is now substantial and route-specific; a fix for one viewport can still disturb phone or desktop layouts if selectors are too broad.
- Fundal scrollytelling behavior depends on `childhoodFundal*` route shells, `config.js`, `main.js`, `childhoodFundalPreparation.js`, Childhood Workshop mappings, Lottie data files, and `.childhood-fundal-scroll-page` CSS staying synchronized.
- Fundal Lottie settle/playback has a history of blank-frame regressions; FR06 is the canonical stable baseline and shared-engine changes should be checked with the Fundal regression suite and manual desktop/mobile passes.
- Diabetic Fundal-style routes need iOS/WebKit checks after renderer, pause, or cache changes because Safari can expose different Lottie timing/direction and memory behavior than desktop Chromium. If WebKit flashes white at a correct pause/final frame, generate and configure an exact static snapshot for that frame rather than falling back to the previous live frame.
- `.build-cleanup-*` folders can remain after builds on Windows if old output files were locked; they are ignored and can be removed once no build is running.
- Reports telemetry will appear empty when `DISABLE_DB_STORAGE=1` is set, when production has no Postgres or explicit encrypted NDJSON fallback, or when the selected runtime store has no collected profile/refresh rows.
- Startup intentionally fails for missing, weak, placeholder, or reused dashboard/telemetry secrets, invalid proxy trust, unsafe production NDJSON/TLS settings, or an unusable telemetry host policy.

## Evolution of Project Decisions

- The decision to use a PWA-first approach was made early and has been consistently reinforced, leading to advanced offline features.
- The modular design has proven effective for integrating diverse and expanding educational content.
- The repo maintains a pragmatic mix of ESM and CJS where needed (server/tests), with Jest mappings/mocks used to keep tests stable.
- Interactive Learning continues to use the shared Videos-route subpage pattern, even when the underlying content is hosted externally, to avoid introducing a second navigation model.
- Workshop flows now use stable row/page identifiers plus session storage to preserve progress, folder state, and cross-route sequencing without introducing a separate router.
- Lesson rows now share progress storage/event/tick helpers so completion UI stays consistent across Videos, workshops, case studies, and My Learning.
- Offline install/download behavior now favors a generated server manifest plus client-side selection/filtering over static all-content lists.
- Local video localization now favors JSON subtitle catalogs and VTT assets that the runtime attaches to matching video sources.
- Full-animation MP4 lessons are treated as local Videos-route video pages rather than scrollytelling routes; low/high source mapping and launcher progress rows are the synchronization contract.
- Diabetic workshop pages can be split across route fragments when it keeps large video/demo content in the Videos route, but the shared IDs and progress events are the contract.
- Childhood Fundal scrollytelling pages keep minimal HTML shells and let the shared JS engine own stage DOM creation, replay controls, down-arrow/page-next behavior, scroll locking, and settle-frame logic.
- FR06 remains the user-approved baseline for Fundal route playback/settle behavior.
- iOS/WebKit Fundal white-frame recovery should prefer exact static snapshots configured through route-level snapshot maps, with WebKit iPhone E2E coverage for held frame, snapshot URL, overlay visibility, and non-white pixels.
- Build output cleaning favors preserving build continuity on Windows over deleting locked folders synchronously; stale renamed cleanup folders are treated as disposable artifacts.
