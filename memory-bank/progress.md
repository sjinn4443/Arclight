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
- Offline content management: a modal allows users to select and download specific assets for offline use via the service worker.
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
- CI/CD pipeline: GitHub Actions CI/CD pipeline at `.github/workflows/ci-cd.yml` runs formatting checks, build, accessibility checks, Jest, and artifact upload.
- Security enhancements: reports Basic Auth protection and attempt rate limiting in `server.cjs`.
- Runtime storage selection: storage now defaults to NDJSON when DB URLs are absent, uses Postgres when configured, and can be forced off with `DISABLE_DB_STORAGE=1`.
- Playwright E2E isolation: the configured web server starts with `DISABLE_DB_STORAGE=1`.
- Windows-safe build cleanup: `scripts/build.cjs` renames old build output directories to `.build-cleanup-*`, recreates the target output directory, and writes `version.json` metadata during builds.
- Module system fix: resolved ES module / CommonJS conflict by renaming `server.js` to `server.cjs` and updating related `require` paths and `package.json` scripts.
- CI/Jest ESM interop fix: Jest `moduleNameMapper` maps ESM browser modules to CJS mocks for CJS tests.
- Documentation refresh: updated README files across `README.md`, `.github/`, `reports/`, `security/`, `securitytest/`, `tests/`, and `vscode-alanui-launcher/`.
- Husky hooks enabled: `prepare` runs `husky`, Git hooksPath is `.husky/_`, and `pre-commit` runs `lint-staged`.

## What's Left to Build

- Security testing: thoroughly test all implemented security measures and ensure they are correctly configured for production environments.
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

The project is a feature-rich PWA with a strong emphasis on interactive learning and offline capabilities. The Express server (`server.cjs`) supports local/prod hosting, telemetry/report APIs, password-protected reports pages, and the offline asset manifest endpoint. Runtime storage uses NDJSON by default unless Postgres URLs are configured, and can be forced off with `DISABLE_DB_STORAGE=1`. Jest, Playwright, accessibility checks, and translation QA are in place. The Interactive Learning page mixes local mini-apps, external embedded tools, Videos-route diabetic demo quizzes, full-animation local MP4 lessons, localized videos/subtitles, case-study chat flows, and workshop-linked progress rows. The Eyes route includes both a substantial Diabetic Retinopathy workshop flow whose video/demo content crosses into the Videos route and a Childhood Fundal Reflex scrollytelling sequence powered by a shared Lottie stage-autoplay engine.

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
- Reports telemetry will appear empty when `DISABLE_DB_STORAGE=1` is set or when the selected runtime store has no collected profile/refresh rows.

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
