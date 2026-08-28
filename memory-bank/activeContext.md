<!-- THE CHANGES - activeContext.md | 2026-08-28, Codex -->

# Active Context

## Current Work Focus

August localization and app-wide stabilization:

- Lao (`lo`) localization now spans `public/translation/lao.json`, shared local mini-app copy, the Fundal Reflex subapp, Medical Students workshop content, dynamic UI/accessibility copy, and supported app/Childhood video subtitle VTT/HLS outputs. Translation completeness and terminology QA cover the expanded locale.
- Follow-up UI work localizes settings confirmation dialogs and My Learning metadata, cleans embedded English clinical terms from Lao literal translations, adds Previous/Next case history without double-scoring, enables desktop pointer swipes for primary flashcards, and preserves the actual Visual Acuity launcher when backing out of shared Videos pages.

- offline install/downloads use a build-generated production manifest (one asynchronous cached copy in development), ETag/cache headers, and a service worker that bypasses API/tracking/reports/health URLs and refuses sensitive or `no-store` cache entries
- app video subtitle localization is active through `public/js/videoSubtitles.js`, `public/video-localization/app-video-subtitles.json`, `public/video-localization/childhood-eye-screening.json`, and VTT files under `public/video-subtitles/`
- local full-animation MP4 lessons are now standard Videos-route pages using hidden `.page` blocks in `public/html/videos.html`, low/high source entries in `public/js/videos.js` `VIDEO_PAGE_SOURCES`, and media files under `public/videos/FullAnim/`
- shared lesson progress and completion ticks are centralized in `public/js/lessonProgress.js` and `public/js/lessonCompletionTick.js`, then consumed by Videos, Childhood Workshop, Diabetic Workshop, Glaucoma Workshop, case studies, and My Learning rows
- case-study chat/flashcard work spans `public/html/casestudy.html`, `public/js/casestudy.js`, `public/js/casestudy_primary.js`, `public/html/glaucomaHistoryCaseStudy.html`, `public/js/glaucomaHistoryCaseStudy.js`, and the shared `casechat-*` CSS
- iPad/tablet layout fixes are concentrated in `public/style/responsive.css`; route-specific overrides should stay constrained and be rechecked against phone and desktop layouts
- Interactive Learning Primary now includes a local 7x7 eye-examination `Connect` game (`eyeExaminationConnectPage`) whose six checkpoints must be reached as History -> VA -> Front of eye -> Pupils -> Fundal reflex -> DO while filling all 49 cells; `public/js/eyeExaminationConnect.js` owns its tutorial, pointer/keyboard controls, rule validation, and shared lesson progress
- Medical Students Workshop now has a fully populated, foldered Introduction curriculum using the orange Diabetic scrolly format. The first nested folder is `Getting Started`; its former Timetable and Content lesson is merged into the end of Overview. It also includes objectives, patient journey/barriers/diagnosis/blindness, visual system/development, history taking, and Arclight lessons. Local Previous/Next flow crosses into shared video pages, including the Visual Acuity `vaWhoPage`, and restores the originating nested folder. Blindness stacks separate graph/map crops on mobile and confirms before opening either external inverse-care source; Visual System ends with the local visual-field-loss video. Mobile folders retain their original outer/nested/lesson width hierarchy and spacing while long labels wrap inside the text area. Training keeps RAPD inside the Medical Students flow, hides its menu icon, layers the pickup hint above controls but below dialogs, initializes the active Arclight at the pickup pointer, and halves direct-response strength and hippus amplitude for severe left/right RAPD; it opens `fundalReflexSimulatorPage` from Fundal Reflex App and `morphSimulatorPage` from Back of the Eye. The active `4. Test` folder contains text-only Visual Acuity, Pupils, and Fundal Reflex MCQs driven by `public/js/medicalStudentsTestQuiz.js`, including PowerPoint Notes-based review explanations and score-dependent `Review` / `See why` labels; route loads also clear stale interactive-subapp state so the Eyes back button reappears.
- The PWA static cache is now `arclight-static-v31`, forcing installed clients to discard pre-Lao-rollout HTML/CSS/JS and reload the current locale, navigation, and subapp behavior.

Diabetic Retinopathy workshop and Videos-route stabilization:

- the Eyes route now links into a substantial Diabetic Retinopathy workshop
- the workshop combines foldered lessons, progress rows, scroll-style pages, Videos-route lessons, protocol pages, and demo quiz pages
- diabetic workshop ownership is now split: the workshop route keeps the launcher/protocol/scroll content, while `public/html/videos.html` owns diabetic video subpages and the Interactive Learning `Demo Quizzes` folder/pages
- `public/js/diabeticWorkshopNextFlow.js` owns the structural previous/next buttons and the cross-route flow through Videos pages
- the Direct Ophthalmoscopy nested folder includes `Observation and Fundal Reflex`, `Positioning and Flight Path`, and `How to Examine`, each launching a standalone Fundal-style scrollytelling route
- the Binocular Indirect Ophthalmoscopy nested folder includes `Preparation`, `Fundoscopy Sitting`, and `Fundoscopy with Indentation`, each launching a standalone Fundal-style scrollytelling route
- runtime storage uses Postgres when DB URLs are configured; non-production can use encrypted NDJSON fallback, while production uses no-op storage unless `ENABLE_NDJSON_STORAGE=true`; Playwright explicitly runs with `DISABLE_DB_STORAGE=1`
- telemetry identity is server-derived from a signed HttpOnly cookie; client identity/location fields are ignored; PostgreSQL stores only raw IP, resolved country name, and timestamp, while GPS stays local and is disclosed before direct BigDataCloud use
- external IP-country lookup is opt-in, globally timeout-bounded, cached for 24 hours with a fixed maximum size, and separately rate limited
- development binds to loopback by default; `TRUST_PROXY` is disabled unless validated/configured, and non-loopback admin clients require `ADMIN_ALLOWED_IPS`
- pinned browser libraries are self-hosted through the deterministic vendor sync; the production container runs as non-root

Childhood Fundal Reflex scrollytelling is also an active maintenance area:

- Fundal route shells live in `public/html/childhoodFundal*.html` and use `.childhood-fundal-scroll-page` plus an empty `.childhood-fundal-prep-list`
- `public/js/childhoodFundalPreparation.js` owns the shared Lottie stage-autoplay engine, per-route `ROUTE_CONFIG`, settle-frame behavior, stage replay/down-arrow controls, scroll locks, and `FUNDAL_PAGE_ROUTE_SEQUENCE`
- `public/js/config.js` and `public/js/main.js` provide the route map and lazy initializer for the Fundal route set
- `public/style/pages.css` owns the shared Fundal layout/button/text styling
- FR06 remains the user-approved baseline for Fundal settle behavior; avoid playback/settle experiments unless explicitly requested and rechecked
- Diabetic Fundal-style scrollytelling now depends on hardened pause-frame locking, retained accumulated captions after completion, iOS/WebKit renderer overrides where needed, exact static snapshot recovery for fragile WebKit pause/final holds, and ordinary `< Previous` / `Next >` buttons on the final page of each scrollytelling group.

## Recent Changes

- Medical Students Introduction curriculum (2026-08-20):
  - Replaced the four placeholder Introduction rows with Introduction, Eye Disease & Blindness, Anatomy & Physiology Vision, and Examination Tools folders while retaining History Taking as a standalone scroll lesson.
  - Converted slide text and speaker notes into accessible HTML scrolly panels; recreated blindness/growth/inverse-care diagrams in CSS and retained the source clinical/reference images.
  - Reused the Childhood Normal Visual Development content with the intermediate orange accent and appended the slide 39 reference card.
  - Added Medical Students Previous/Next navigation across local and Videos-route pages, with folder restore and conflict avoidance for the Childhood Mum Vision flow.
  - Renamed Train on Sim Tools to Training, added nested Pupil App Practice/Test and Disc App launchers, linked the Fundal Reflex app, and added the centered Anterior Segment reference page.
  - Activated `4. Test` with deck-derived Visual Acuity, Pupils, and Fundal Reflex MCQs using the Glaucoma quiz format and behavior.

- Eye examination Connect game (2026-07-13):
  - Added a Primary `Connect` row immediately below Anterior chamber depth in `interactiveLearningPage`.
  - Added the responsive Videos-route `eyeExaminationConnectPage` using the six assets under `public/images/quiz/connect/`.
  - Enforced orthogonal, non-overlapping paths, the clinical checkpoint order, and the all-49-cells completion rule; valid completion writes `lessonProgress:eyeExaminationConnectPage` at 100%.
  - Added a three-step first-play tutorial, reopenable How to play control, reset/backtracking, pointer/touch dragging, keyboard arrows, completion feedback, and automated solution/DOM tests.

- Security updates (2026-06-29 to 2026-07-10):
  - Source of truth: `security01`, `security02`, and `security03` on `main`. These security changes landed on `2026-07-07`.

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

- Full-animation Videos-route lessons (2026-06-19):
  - Added/wired `fundalReflexFullAnimationVideoPage`, `directOphthalmoscopyFullAnimationVideoPage`, and `binocularIndirectOphthalmoscopyFullAnimationVideoPage` in `public/html/videos.html`.
  - Registered their low/high MP4 sources in `public/js/videos.js` using files from `public/videos/FullAnim/`.
  - Added launcher rows from Childhood Eye Screening / Fundal Reflex and Diabetic Retinopathy workshop Ophthalmoscopy folders.
  - Updated the Interactive Learning topic target test expectations for the new full-animation targets.

- Offline download pipeline and service worker media handling (2026-05-26 to 2026-06-12):
  - Added `GET /api/app/offline-assets` to enumerate the active static root and return file URLs plus byte sizes.
  - Added full/select/app-only download modes, low/high video filtering, estimated size/time display, cache progress messaging, error summaries, and menu Downloaded Contents inspection.
  - Updated `public/sw.js` so selected URLs can be cached on demand, full cached MP4 files can satisfy browser range requests, `_220p` and `_720p` alternates can be used when only one tier is cached, and Childhood Eye Screening HLS assets remain usable offline after download.

- Video subtitle localization (2026-06-11):
  - Added `public/js/videoSubtitles.js` and the app-wide subtitle catalog at `public/video-localization/app-video-subtitles.json`.
  - Expanded VTT subtitle coverage under `public/video-subtitles/app-videos/`.
  - Kept the Childhood Eye Screening subtitle/HLS pilot catalog in `public/video-localization/childhood-eye-screening.json` synchronized with download/cache handling.

- Shared progress, case studies, and My Learning updates (2026-06-02 to 2026-06-04):
  - Added `public/js/lessonProgress.js` and `public/js/lessonCompletionTick.js` for reusable progress storage, row rendering, completion tick rendering, and `arclight:lesson-progress-changed` events.
  - Wired case-study rows to stable progress targets: `caseStudyChatPagePrimary`, `caseStudyFlashcardPagePrimary`, `caseStudyChatPage`, and `glaucomaHistoryCaseStudy`.
  - Expanded case-study chat behavior for primary/intermediate cases and glaucoma history-taking cases while keeping progress reflected in launcher/My Learning rows.

- Responsive/iPad stabilization (2026-05-27 to 2026-06-12):
  - Added many route-specific responsive overrides in `public/style/responsive.css` for dashboard/menu/onboarding/My Learning, case-study chat, videos, workshops, subapps, and tablet/iPad viewport behavior.
  - Current maintenance rule: keep tablet-only CSS targeted to page IDs/classes and recheck phone and desktop after changes.

- QA baseline refresh (2026-06-12):
  - `npm run test:a11y` passes for `143` HTML files.
  - `npm run check-translations` reports `0` missing used keys, `0` damaged strings, `0` exact-English carry-overs, `0` medical homonym violations, and `0` subtitle medical homonym violations.

- iOS/WebKit Fundal white-frame recovery documentation (2026-05-25):
  - Recorded the reusable fix pattern in `agent.md`, `README.md`, and E2E docs.
  - For white/blank flashes at scrollytelling pause or completion frames, generate an exact PNG from the running local app, map it with `settleSnapshotImageByFile` or `completionSnapshotImageByFile`, prewarm it, and show it immediately at the hold point.
  - Avoid previous-frame runtime fallbacks because they mask the blank while causing visible frame regression/stutter.
  - Keep renderer overrides (`iosRendererByFile`) for mask/direction correctness, and use static snapshots for WebKit layer/canvas drops during holds.

- Diabetic Direct Ophthalmoscopy scrollytelling (2026-05-20):
  - Added `public/html/diabeticObservationFundalReflex.html`, `public/html/diabeticPositioningFlightPath.html`, and `public/html/diabeticHowToExamine.html`.
  - Reused `public/js/childhoodFundalPreparation.js` stage-autoplay config for the DO asset folders under `public/scrolly/coreexam/ophths/DO/`.
  - Wired the Direct Ophthalmoscopy nested folder rows in the Diabetic Retinopathy workshop to the new routes and progress targets.

- Diabetic Binocular Indirect Ophthalmoscopy scrollytelling (2026-05-20):
  - Added `public/html/diabeticBioPreparation.html`, `public/html/diabeticBioFundoscopySitting.html`, and `public/html/diabeticBioFundoscopyIndentation.html`.
  - Reused `public/js/childhoodFundalPreparation.js` stage-autoplay config for the BIO asset folders under `public/scrolly/coreexam/ophths/BIO/`.
  - Wired the Binocular Indirect Ophthalmoscopy nested folder rows in the Diabetic Retinopathy workshop to the new routes and progress targets.
  - Hardened pause-before-frame playback so pauses hold the intended frame without white/final-frame flashes, keep bullet captions visible, and use iOS renderer/warmup overrides for BIO pages that are heavy on WebKit.
  - Added bottom `< Previous` / `Next >` controls to the terminal Diabetic scrollytelling pages so the scroll sequence can return to the surrounding workshop flow.

- Fundal scrollytelling documentation refresh (2026-05-15):
  - Added the Childhood Fundal Reflex stage-autoplay route contract to `README.md`, `agent.md`, and the memory bank.
  - Recorded the canonical source files: `public/html/childhoodFundal*.html`, `public/js/config.js`, `public/js/main.js`, `public/js/childhoodFundalPreparation.js`, and `public/style/pages.css`.
  - Documented the verification path: `npm run test:fundal` for shared engine changes, plus manual mobile/desktop checks for route framing, replay, down-arrow controls, title text toggles, final next-page pill visibility, and blank-frame regressions.
  - Re-stated the FR06 guardrail as the stable reference for Fundal route playback/settle behavior.

- Diabetic Retinopathy workshop and Videos-route split (2026-05-08):
  - Moved diabetic demo quiz pages into `public/html/videos.html` under the Interactive Learning `Demo Quizzes` folder.
  - Kept `public/js/diabeticRetinopathyWorkshop.js` as the initializer for the diabetic quiz interactions so `main.js` imports it for both the diabetic workshop route and the Videos route.
  - Added/kept diabetic video pages in `public/html/videos.html` with sources registered in `public/js/videos.js`.
  - The workshop route now jumps to Videos-route diabetic lessons using `data-route="videos"` rows for video pages.
  - Added additional diabetic protocol video assets under `public/videos/Workshop/Diabetic/` and NCD/protocol visual assets under `public/images/learning/Diabetic/Diabetes/NCD/`.
  - Updated the NCD algorithm SVG and protocol page styling/content in the latest `Diabetic14` pass.

- Build cleanup hardening (2026-05-05):
  - `scripts/build.cjs` now supports safer output cleaning on Windows by renaming old output directories to `.build-cleanup-*`, recreating the requested output directory, and falling back to retrying recursive removal if rename is blocked.
  - `.gitignore` ignores `.build-cleanup-*/` and `tmp-codex-build*/`.
  - Build version metadata is written to `version.json` with `versionDate` and `versionSequence`; sequence resolution can use env vars, git first-parent history, or GitHub API fallback.

- Diabetic Retinopathy workshop flow (2026-04-30):
  - Added/expanded workshop lesson sections for introduction, diabetes/retinopathy basics, NCD clinic flow, protocol, and demo quizzes.
  - Added lesson progress tracking through `public/js/diabeticWorkshopProgress.js`.
  - Added structural Previous/Next controls that can move through workshop internal pages and Videos-route lessons, then restore the relevant workshop folder on return.
  - Added video page integration for diabetic workshop videos in `public/js/videos.js`.
  - Added assets for diabetic retinopathy and NCD protocol material under `public/images/learning/Diabetic/`.

- Runtime storage and Playwright isolation (2026-04-30; restored 2026-06-05):
  - `storage/index.cjs` now selects Postgres only when DB URLs are configured and `DISABLE_DB_STORAGE` is not enabled.
  - No DB URL selects `storage/ndjson-storage.cjs`; `DISABLE_DB_STORAGE=1` selects `storage/disabled-storage.cjs`.
  - `playwright.config.js` starts the local E2E web server with `DISABLE_DB_STORAGE=1`.
  - `.env.sample` documents split write/read/admin DB URLs, DB TLS options, telemetry host allowlisting, delete gates, and IPInfo token support.

- accessibility + translation QA baseline (refreshed 2026-08-28):
  - `npm run test:a11y` performs a static audit and currently passes on `146` HTML files.
  - `npm run check-translations` audits referenced HTML/JS keys, damaged strings, fallback-English carry-overs, medical homonym guidance, and subtitle homonym coverage.
  - Current audit result is clean: `0` missing used keys, `0` missing literal keys, `0` damaged strings, `0` exact-English carry-overs, `0` medical homonym violations, and `0` subtitle medical homonym violations.
  - Persistent medical homonym guidance lives in `scripts/i18n-qa-rules.cjs`.

- translation QA sweep (2026-03-26):
  - Replaced hardcoded English in the visual system eye/brain animation with locale-backed copy.
  - Fixed dashboard recommendations so localized subtitles render without async errors, and quick-action routing no longer depends on English button text.
  - Added shared legacy literal fallback coverage for common UI labels such as `Menu` and search aria labels.
  - Restored Eyes-page legacy root alias keys and aligned locale aliases so older tests/pages still translate correctly.
  - Recorded the standing translation QA rules: medical terminology accuracy, formal tone where appropriate, natural UI wording, native-script language names, symbol preservation, and JS/runtime text checks.

- accessibility/i18n attribute sweep (2026-06-26):
  - Bound uncovered static and JS-created labels to existing locale-backed keys for anterior quiz images, PDF/ATOMS images, fundal replay/next controls, embedded back controls, diabetic image lightbox close controls, lesson completion ticks, and the anterior quiz iframe title.
  - Dynamic DOM paths that create translated accessible labels now call `window.I18N?.applyTranslations?.(node)` immediately after insertion.
  - Confirmed `npm run test:a11y` and `npm run check-translations` remain clean after the sweep.

- Interactive Learning external embeds (2026-03-11):
  - Added `Fundal Reflex` and `Trauma` buttons under the Primary section, and `Amsler` under Intermediate on `interactiveLearningPage`.
  - Added matching hidden subpages in `public/html/videos.html` that lazy-load external Netlify apps via `iframe[data-src]`.
  - Kept the existing Videos-route wrapper pattern (same header/container flow and back-button behavior as local subapps such as `Morph` and `Mires`).
  - Normalized Interactive Learning card spacing so all card-to-card gaps match the preferred first-pair spacing.
  - Recorded the key maintenance constraint: Arclight can style the wrapper shell only; cross-origin iframe internals must be changed in the remote app.

- i18n translation policy update (2026-03-02):
  - Added a mandatory symbol-preservation rule for locale files.
  - UI symbols used as button/icon text (for example `☰`, `<`, `×`) must remain unchanged and must not be translated.

- Husky setup cleanup (2026-01-26):
  - Updated root `package.json` `prepare` script from deprecated `husky install` to `husky`.
  - Verified Git hooks path points to `.husky/_` and `pre-commit` runs `lint-staged`.

- Root README script coverage (2026-01-26):
  - Updated `README.md` to document additional `package.json` scripts that are actively available:
    - Playwright E2E/perf (`test:e2e`, `perf:e2e`)
    - Lighthouse CI (`perf:lh`)
    - Translation checks (`check-translations`)
    - Tracking server helper (`start:track`)

- Updated README files to align with current code:
  - Root `README.md`
  - `.github/README.md`
  - `reports/README.md`
  - `security/README.md`
  - `securitytest/README.md`
  - `tests/README.md`
  - `vscode-alanui-launcher/README.md`

## Next Steps

- Keep the clean translation QA baseline by adding i18n keys, locale values, and VTT subtitles at the same time as new user-facing copy.
- Use `npm run check-translations` after locale/subtitle edits and `node scripts/check-translations.cjs --strict-english` when intentionally checking for fallback-English regressions.
- Keep app video subtitle catalogs, VTT folders, and offline-download cache selections synchronized when adding or moving videos.
- Keep full-animation MP4 lesson wiring synchronized across launcher rows, hidden Videos-route page IDs, `VIDEO_PAGE_SOURCES`, `public/videos/FullAnim/` file names, progress targets, and topic-target tests.
- Keep the offline asset manifest flow working across dev and dist: update static paths, catalog matching, video quality filtering, service-worker cache behavior, and menu Downloaded Contents summaries together.
- Continue checking iPad/tablet overrides against phone and desktop layouts, especially for case-study chat, Videos pages, workshops, and subapps.
- Keep diabetic workshop folder/progress state aligned when adding or moving lesson rows.
- When adding/moving diabetic content, update all route owners together: `public/html/diabeticRetinopathyWorkshop.html`, `public/html/videos.html`, `public/js/videos.js`, `public/js/diabeticRetinopathyWorkshop.js`, `public/js/diabeticWorkshopNextFlow.js`, and `public/js/diabeticWorkshopProgress.js`.
- When adding or changing Fundal scrollytelling pages, update the route shell, `config.js`, `main.js` `FUNDAL_REFLEX_SCROLL_ROUTES`, `childhoodFundalPreparation.js` `ROUTE_CONFIG`/`FUNDAL_PAGE_ROUTE_SEQUENCE`, relevant Childhood Workshop mappings, and `.childhood-fundal-scroll-page` CSS together.
- For shared Fundal engine or settle-frame changes, run `npm run test:fundal` where practical and manually recheck Preparation, Examination, Newborn Eyes Open, and the final page-next boundary on mobile and desktop.
- For iOS/WebKit Fundal white-frame regressions, follow the static exact-frame snapshot recovery pattern before changing segment ranges or adding previous-frame fallbacks.
- Keep external embed URLs and their purpose documented when Interactive Learning changes again.
- If a remote embed later blocks framing, switch that module to a local copy or an open-in-new-tab fallback.
- Add translation keys for `Trauma` and `Amsler` if those labels need to be localized instead of staying English-only.
- Keep folder READMEs in sync with future wiring changes (for example if optional routers under `reports/routes/` are re-enabled or if CSP/CORS/CSRF are reintroduced as middleware).
- Consider improving the VS Code launcher extension for Windows/Linux (replace macOS `open -a` with `vscode.env.openExternal()` and add `contributes.commands` to the extension manifest).
- Regenerate `folderList.txt` whenever large folder structure changes occur.

## Active Decisions and Considerations

- Prefer accurate, code-referenced documentation over aspirational or legacy docs.
- Offline downloads are selected from the server-provided asset manifest; do not maintain separate hand-written all-asset lists unless they are explicit route/category hints.
- Local MP4 playback, subtitle catalogs, HLS fallback metadata, and offline cache selection are one contract for video pages.
- Full-animation lessons should remain ordinary local MP4 video pages unless there is an explicit request to rebuild them as scrollytelling/Lottie routes.
- Shared lesson progress should use `lessonProgress.js` and `lessonCompletionTick.js` before adding route-specific progress/tick logic.
- Case-study progress depends on stable page IDs and `data-target` values; update launcher rows, page IDs, owning JS, My Learning mappings, and CSS together.
- Tablet/iPad responsive patches should stay targeted to affected page IDs/classes in `public/style/responsive.css`.
- Use the existing Videos-route subpage pattern (`data-page`, `data-target`, hidden `.page` blocks, `iframe[data-src]`) when adding more Interactive Learning modules.
- Do not assume parent-page CSS/JS can control embedded external site UI across origins.
- For the Diabetic Retinopathy workshop, use stable `data-target`, `data-lesson`, and `data-folder` values because progress, folder restore, and next-flow routing depend on them.
- For Videos-route diabetic pages, keep `data-target` IDs aligned with hidden `.page` IDs and `VIDEO_PAGE_SOURCES` entries in `public/js/videos.js`.
- Treat no-op storage as the default local behavior unless DB URLs are intentionally configured.
- Treat `.build-cleanup-*` folders as temporary build cleanup leftovers, not source directories.
- Treat the Childhood Fundal Reflex stage-autoplay engine as shared infrastructure across all `childhoodFundal*` routes; route-specific visual fixes should prefer route config before changing global playback behavior.
- Treat static exact-frame snapshots as the preferred iOS/WebKit recovery for fragile Fundal pause/final holds; previous-frame fallbacks are not acceptable because they visibly rewind the animation.
- Preserve FR06 Fundal settle behavior as the baseline unless the user explicitly asks for a behavior change.
- Core Examination PDF lessons use dedicated routes backed by `fundalReflexPdf.html` and `fundalReflexPdf.js`; they use Fundal-style rendered-image viewers rather than browser PDF embeds. Visual Acuity and Front of Eye launch from Primary, while Pupils PEC launches from Primary and Pupils Advanced from Advanced.
- Structural Back navigation replaces the current route/page history entry with its declared parent; Core Examination PDF pages return to their owning lesson page, and Visual Acuity, Pupils, and Front of Eye return to Eyes without revisiting the PDF.

## Important Patterns and Preferences

- When the repo mixes ESM and CJS, document the boundary and the mechanism used to keep tests stable (mocks + `moduleNameMapper`).
- Offline download UX should flow through `languageinstall.js` helpers even when triggered from the menu.
- `public/sw.js` should only synthesize MP4 range responses from a complete cached MP4 response; otherwise let the network handle the range request.
- Add or update localized video subtitles through the JSON catalogs and VTT files, then let `videoSubtitles.js`/`videos.js` attach tracks at runtime.
- For new local MP4 lesson pages, add the hidden `.page`, `VIDEO_PAGE_SOURCES` entry, launcher rows, progress target, offline categorization when needed, and tests in the same change.
- Use `setLessonProgress`, `updateLessonProgressRows`, and `arclight:lesson-progress-changed` for new row progress behavior.
- Media accessibility is now enforced in two layers:
  - runtime labeling in `public/js/mediaA11y.js`
  - static audit enforcement in `scripts/test-a11y.mjs`
- In translation JSON files, preserve icon/symbol values exactly as-is. Do not localize `☰`, `<`, `×` (and equivalent UI symbol tokens).
- For Interactive Learning under `videos.html`, prefer the existing hidden-subpage + lazy iframe pattern over special-case navigation.
- Translation QA must also cover runtime strings inserted by JS, not just static HTML and locale files.
- Reports/admin UI must not force English just to keep column wiring stable; use stable identifiers (`data-col`) plus locale-aware runtime strings instead.
- `scripts/check-translations.cjs` is now the canonical audit entry point for used-key coverage, damaged-string detection, and fallback-English review.
- Keep required legacy root alias keys aligned with scoped keys where older pages/tests still reference those root keys.
- For Interactive Learning under `videos.html`, prefer the existing hidden-subpage + lazy iframe pattern over special-case navigation.
- Diabetic workshop route changes should be checked for structural back behavior from both the workshop home and nested lesson pages.
- Fundal scrollytelling page shells should stay minimal; the JS engine creates the stage DOM inside `.childhood-fundal-prep-list`.
