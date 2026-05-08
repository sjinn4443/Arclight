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
- Interactive Learning hybrid embeds: the Videos route now supports both local interactive mini-apps (`public/subapp/*`) and external iframe-based modules (`Fundal Reflex`, `Trauma`, `Amsler`) within the same wrapper flow.
- Diabetic Retinopathy workshop: the Eyes route now launches a foldered workshop with scroll lessons, video lessons, progress rows, protocol pages, structural Previous/Next controls, and demo quizzes.
- Diabetic/Videos split: diabetic video pages and diabetic demo quizzes now live under `public/html/videos.html`, while the diabetic workshop route owns the folder launcher, scroll lessons, and protocol pages.
- Diabetic workshop progress/navigation: progress bars update through `public/js/diabeticWorkshopProgress.js`, while `public/js/diabeticWorkshopNextFlow.js` controls cross-route sequencing and folder restore behavior.
- Diabetic demo quizzes: Videos-route demo quiz pages include matching history to image, findings grouping, connect, retinal-structure tapping, and review-video quiz flows initialized by `public/js/diabeticRetinopathyWorkshop.js`.
- Diabetic protocol media: NCD/protocol visual assets and low-resolution workshop videos are present under `public/images/learning/Diabetic/Diabetes/NCD/` and `public/videos/Workshop/Diabetic/`.
- Offline content management: a modal allows users to select and download specific assets for offline use via the service worker.
- General application refinement: ongoing improvements and content integration across various modules, including updates to video playback, navigation, onboarding, and PWA features.
- Menu search refactor: menu search functionality aligns with dashboard compact search patterns, including HTML structure and CSS for consistent styling and behavior.
- Testing setup: Jest for unit, UI, and API testing, with Git hooks available for automated checks.
- Static accessibility audit: `scripts/test-a11y.mjs` now checks media/button accessible names and currently passes on `76` HTML files.
- Translation audit baseline: `scripts/check-translations.cjs` now audits only used i18n keys, detects damaged UTF-8 strings, and reports fallback-English carry-overs with medical homonym guidance.
- CI/CD pipeline: GitHub Actions CI/CD pipeline at `.github/workflows/ci-cd.yml` runs formatting checks, build, accessibility checks, Jest, and artifact upload.
- Security enhancements: reports Basic Auth protection and attempt rate limiting in `server.cjs`.
- Runtime storage selection: storage now defaults to no-op when DB URLs are absent, uses Postgres when configured, and can be forced off with `DISABLE_DB_STORAGE=1`.
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
- Translation debt: complete the remaining four missing reports-table locale labels, repair mojibake/replacement-character damage, and reduce fallback-English carry-overs in legacy locale content.
- Diabetic Retinopathy workshop i18n debt: add locale keys for new workshop pages, protocol copy, Videos-route demo quizzes, Videos-route diabetic lesson labels, and Previous/Next labels where needed.
- Testing: continue to expand automated tests for new features, edge cases, error handling, and PWA behaviors.
- Performance optimization: further optimize media loading and overall application performance.

## Current Status

The project is a feature-rich PWA with a strong emphasis on interactive learning and offline capabilities. The Express server (`server.cjs`) supports local/prod hosting, telemetry/report APIs, and password-protected reports pages. Runtime storage is no-op unless Postgres URLs are configured. Jest, Playwright, and GitHub Actions CI are in place. The Interactive Learning page mixes local mini-apps, external embedded tools, and Videos-route diabetic demo quizzes. The Eyes route now includes a substantial Diabetic Retinopathy workshop flow whose video/demo content crosses into the Videos route.

## Known Issues

- The application might not immediately show the latest version due to browser caching of the service worker.
- Some placeholder content still exists and needs to be replaced with actual educational material.
- Some security modules under `security/` are placeholders pending re-enablement as middleware.
- External interactive embeds depend on remote site uptime and iframe permissions, and they are not as controllable or offline-cacheable as local `public/subapp/*` content.
- Translation audit is not yet clean: as of `2026-04-16`, used-key QA now reports `114` missing locale keys, `28` damaged strings, and `764` exact-English carry-overs.
- The Diabetic Retinopathy workshop contains newer English-first content that still needs full i18n coverage.
- Diabetic workshop behavior depends on IDs being synchronized across `diabeticRetinopathyWorkshop.html`, `videos.html`, `videos.js`, `diabeticWorkshopNextFlow.js`, and progress storage keys.
- `.build-cleanup-*` folders can remain after builds on Windows if old output files were locked; they are ignored and can be removed once no build is running.
- Reports telemetry will appear empty when no DB URL is configured or `DISABLE_DB_STORAGE=1` is set, because current default storage is no-op.

## Evolution of Project Decisions

- The decision to use a PWA-first approach was made early and has been consistently reinforced, leading to advanced offline features.
- The modular design has proven effective for integrating diverse and expanding educational content.
- The repo maintains a pragmatic mix of ESM and CJS where needed (server/tests), with Jest mappings/mocks used to keep tests stable.
- Interactive Learning continues to use the shared Videos-route subpage pattern, even when the underlying content is hosted externally, to avoid introducing a second navigation model.
- Workshop flows now use stable row/page identifiers plus session storage to preserve progress, folder state, and cross-route sequencing without introducing a separate router.
- Diabetic workshop pages can be split across route fragments when it keeps large video/demo content in the Videos route, but the shared IDs and progress events are the contract.
- Build output cleaning favors preserving build continuity on Windows over deleting locked folders synchronously; stale renamed cleanup folders are treated as disposable artifacts.
