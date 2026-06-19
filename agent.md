# Agent Notes

Last refreshed: 2026-06-19

## Current repo orientation

- Arclight is a static-first PWA served from `public/` in development and `dist/` after builds, with `server.cjs` providing hosting, reports/admin protection, and app/telemetry APIs.
- Runtime storage uses `storage/ndjson-storage.cjs` by default when DB URLs are absent; Postgres is selected by `storage/index.cjs` when DB URLs are configured and `DISABLE_DB_STORAGE` is not enabled.
- Playwright starts its local web server with `DISABLE_DB_STORAGE=1`, so E2E tests should not write telemetry.
- Offline install/downloads are server-manifest driven: `GET /api/app/offline-assets` returns files and byte sizes from the active static root, `public/js/languageinstall.js` resolves full/select/app-only and low/high video choices, `public/js/menu.js` reuses those helpers, and `public/sw.js` caches the selected URL list.
- The service worker handles cached MP4 range requests only when a full MP4 is already cached, falls back to alternate `_220p` / `_720p` cached MP4s when needed, and keeps Childhood Eye Screening HLS assets usable offline after download.
- App-video subtitles are synchronized by `public/js/videoSubtitles.js` from `public/video-localization/app-video-subtitles.json`; Childhood Eye Screening video pages also use `public/video-localization/childhood-eye-screening.json` and VTT files under `public/video-subtitles/`.
- Full-animation MP4 lessons are standard local Videos-route pages, with hidden pages in `public/html/videos.html`, low/high source entries in `public/js/videos.js` `VIDEO_PAGE_SOURCES`, and media files under `public/videos/FullAnim/`. Current targets are `fundalReflexFullAnimationVideoPage`, `directOphthalmoscopyFullAnimationVideoPage`, and `binocularIndirectOphthalmoscopyFullAnimationVideoPage`.
- Shared lesson progress lives in `public/js/lessonProgress.js` and `public/js/lessonCompletionTick.js`; rows with progress bars are updated from compatible `lessonProgress:`, `videoProgress:`, `childhoodWorkshop:progress:`, `diabeticWorkshop:progress:`, and `glaucomaWorkshop:progress:` storage keys and receive completion ticks at completion.
- The Eyes route includes a Diabetic Retinopathy workshop at `public/html/diabeticRetinopathyWorkshop.html`.
- The diabetic workshop is split across routes:
  - `public/html/diabeticRetinopathyWorkshop.html` owns the folder launcher, scroll lessons, protocol pages, and rows that jump to Videos-route lessons.
  - `public/html/videos.html` owns the diabetic video pages and the Interactive Learning `Demo Quizzes` folder/pages.
  - `public/js/diabeticRetinopathyWorkshop.js` initializes workshop-only behavior plus the diabetic demo quiz pages when those pages exist.
  - `public/js/diabeticWorkshopProgress.js` and `public/js/diabeticWorkshopNextFlow.js` keep progress, previous/next flow, and return-to-folder behavior aligned across route boundaries.
- The Videos route hosts both local subapps and selected external iframe lessons; cross-origin iframe internals cannot be styled or scripted from Arclight.
- The Case Study route (`public/html/casestudy.html`) owns primary/intermediate/advanced case-study pages. Primary chat and flashcard behavior live in `public/js/casestudy_primary.js`; intermediate chat behavior lives in `public/js/casestudy.js`. The Glaucoma history case-study route lives in `public/html/glaucomaHistoryCaseStudy.html` and `public/js/glaucomaHistoryCaseStudy.js`.
- Childhood Fundal Reflex scrollytelling routes (`childhoodFundalPreparation` through `childhoodFundalAfterExamination`) share `public/js/childhoodFundalPreparation.js` for Lottie stage autoplay, settle frames, replay/down-arrow controls, text toggles, scroll locks, and `FUNDAL_PAGE_ROUTE_SEQUENCE`; route shells stay minimal in `public/html/childhoodFundal*.html`.
- `scripts/build.cjs` cleans build outputs by renaming old output directories to `.build-cleanup-*`, recreating the target output directory, and falling back to retrying removal when Windows file locks block the rename.

## Current docs baseline

- Root docs: `README.md`
- Persistent project context: `memory-bank/`
- Test docs: `tests/README.md`
- Reports/security docs: `reports/README.md`, `security/README.md`, `security/EMERGENCY_PLAN.md`

## Agent guardrails

- Prefer code-referenced documentation over aspirational descriptions.
- Keep `README.md`, `memory-bank/activeContext.md`, and `memory-bank/progress.md` aligned when features or runtime behavior change.
- When adding or moving downloadable content, keep the server manifest assumptions, `OFFLINE_CATALOG_OPTIONS`/`matchesOfflineCatalog`, video quality filtering, service-worker cache behavior, and menu Downloaded Contents summary aligned. Bump the service worker cache name when required cached assets or cache behavior change.
- When adding local app videos, update `VIDEO_PAGE_SOURCES`, progress target wiring, subtitle catalogs/VTT files, and offline-download categorization together. For Childhood Eye Screening subtitle pilot pages, keep MP4, HLS manifest, fallback mode, and subtitle language metadata in sync.
- When adding or renaming full-animation MP4 lessons, keep all launcher rows, hidden `.page` IDs, `VIDEO_PAGE_SOURCES` keys, `public/videos/FullAnim/` file names, progress targets, and Interactive Learning target tests synchronized. These pages should stay on the local video-page pattern unless the user explicitly asks for Lottie scrollytelling behavior.
- When adding lesson rows with progress bars, prefer `setLessonProgress`/`updateLessonProgressRows` and let `lessonCompletionTick.js` render completion state. Keep `data-target` values stable because progress keys, My Learning rows, and workshop restore flows depend on them.
- Case-study chat pages depend on stable page IDs and progress targets: `caseStudyChatPagePrimary`, `caseStudyFlashcardPagePrimary`, `caseStudyChatPage`, and `glaucomaHistoryCaseStudy`. Update `casestudy.html`, the owning JS module, progress keys, styles, and My Learning mappings together.
- Responsive layout fixes for iPad/tablet live mainly in `public/style/responsive.css`; keep route-specific overrides constrained to the affected page IDs/classes and recheck desktop/mobile after tablet-only changes.
- Preserve stable `data-target`, `data-lesson`, `data-folder`, and `data-route` values in the Diabetic Retinopathy workshop and Videos-route demo/video pages unless all dependent navigation/progress/next-flow mappings are updated together.
- When moving diabetic pages between `diabeticRetinopathyWorkshop.html` and `videos.html`, recheck `main.js` initialization, `videos.js` subpage routing, `diabeticWorkshopNextFlow.js`, and progress bar updates together.
- Do not treat `.build-cleanup-*` directories as source artifacts; they are ignored temporary output directories left by safe build cleanup.
- For Fundal scroll work, preserve the mandatory FR06 behavior guardrails below unless the user explicitly approves a change and it is manually rechecked.
- Folder item-count badges are intentionally disabled by feature flags, not deleted. To restore them, set `CHILDHOOD_FOLDER_ITEM_COUNTS_ENABLED` in `public/js/childhoodEyeScreeningWorkshop.js`, `GLAUCOMA_FOLDER_ITEM_COUNTS_ENABLED` in `public/js/glaucomaWorkshop.js`, and `INTERACTIVE_FOLDER_ITEM_COUNTS_ENABLED` in `public/js/videos.js` to `true`. The old render/cleanup logic and CSS classes remain in place.

## Diabetic Scrolly Format / Scroll Pages Format Style

Use this when the user asks to make a Diabetic Retinopathy workshop page in the `scrolly format`, `scroll pages format style`, or similar wording. This style is based on the lesson-row scroll pages in `public/html/diabeticRetinopathyWorkshop.html`: `diabeticPragmaticScreeningPage`, `diabeticNcdClinicScreeningPage`, `diabeticOtherEyeDiseasesScreeningPage`, and `diabeticProliferativeOtherDiseasePage`. It intentionally excludes the custom animated `diabeticArclightPackagePage`.

- Page shell: keep the page as `.page.pupils-like.has-eyes-topbar` with a `.container.pupils-container.diabetic-screening-page`, the standard `.eyes-topbar`, and an empty `.pupils-subtitle`.
- Lesson wrapper: use `<section class="diabetic-screening-lesson ...">` with `data-diabetic-scroll-lesson`, an `aria-label`, a `.diabetic-screening-scroll-cue`, a `.diabetic-screening-hero[data-diabetic-scroll-step]`, then a `.diabetic-screening-stack` of `<article class="diabetic-screening-panel" data-diabetic-scroll-step>`.
- Scroll behavior: `public/js/diabeticRetinopathyWorkshop.js` upgrades the cue and toggles `.is-visible` / `.is-current` on every `[data-diabetic-scroll-step]`. Put animations and stateful visual emphasis behind `.is-current`; use `data-diabetic-visible-class` only for a local visual that needs an extra in-view class.
- Overall layout: full-bleed white lesson band (`width: 100vw`, centered with `calc(50% - 50vw)`), narrow mobile-first content, and vertically stacked reveal panels. Base panels are `width: min(88vw, 430px)`, `min-height: 70dvh`, centered, padded, white/translucent, `border-radius: 28px`, subtle border, blur, and soft shadow. On wider screens panels expand toward `min(76vw, 760px)` and may use two columns when the visual needs room.
- Typography: use the diabetic screening hierarchy. Eyebrow is orange `#f25600`, uppercase, 12px, 800 weight, wide tracking. Hero `h2` is black, very bold, tight, `clamp(31px, 9vw, 46px)`, `line-height` near 1. Panel `h3` is black, bold, `clamp(24px, 7vw, 34px)`, tight line height. Body copy is gray `#374151`, semi-bold (`550`-ish), `clamp(15px, 4.1vw, 18px)`, generous `line-height: 1.65`.
- Step markers: every panel starts with `<span class="diabetic-screening-step">01</span>` style circular orange number badge, 42px square, white text, bold.
- Lists and chips: use `.diabetic-screening-checklist` for numbered clinical steps with gray rounded rows and orange number dots. Use `.diabetic-screening-chip-list` for compact orange-outline pills.
- Images: use real clinical/learning images in `figure` or grid/collage containers, with meaningful `alt` text and `loading="lazy"`. Avoid decorative standalone SVGs for this format unless the existing page pattern already uses a diagram or flow.
- Captions: image captions use high-contrast orange labels. `diabetic-disease-card figcaption` / sorter captions are absolute bottom bars with orange `#f25600`, white text, small bold type (`11px`, 950 weight), centered, flush with the image bottom. Images usually have rounded top corners and square bottom corners so the caption bar and image edges line up cleanly.
- Index style: supporting tags like `Sight threatening`, `Refer`, or disease/category labels use the diabetic disease-card index tag pattern: small uppercase text, white background, colored border/text, rounded top corners, no bottom border, positioned immediately above the image/caption group like a tab. Use this pattern for “index style” requests, swapping the accent color only when the workshop has an explicit alternate accent.
- Disease galleries: for proliferative/other disease pages, use `.diabetic-disease-gallery`, `.diabetic-disease-card`, `.diabetic-disease-card--danger`, `--wide`, and `--contain` rather than inventing new card systems. Clinical images use rounded tops, object-fit cover by default, contain mode for full retinal photos, and animated pop-in from `.is-current .diabetic-disease-card`.
- NCD/other disease specifics: use `.diabetic-no-eye-check` for the missed-screening image with an animated red X; `.diabetic-eye-disease-collage` for two-column disease tiles with orange bottom labels; `.diabetic-screening-flow--connected` for clinic-to-screening-to-referral flow with orange connected stations.
- Responsive rules: check desktop and mobile. Base/mobile layout is one column: hero and panels stay around `min(86vw-88vw, 430px)`, panels use `min-height: 70dvh` unless marked content-fit, `.diabetic-screening-stack` uses tighter gaps, clinical collages stay compact two-column only when labels still fit, and captions must not overlap images or following content. At tablet/desktop widths, hero/panels expand toward `min(76vw, 760px)`, stack gaps increase to roughly `48px`-`56px`, panels may switch to two columns (`text + visual`) with `grid-template-columns`, NCD flow switches from vertical connectors to horizontal station flow, and disease sorter/gallery lanes can expand to 2 or 3 columns. Desktop-specific overrides often target exact panel positions with `nth-of-type`; mirror that only when the content needs a custom layout.
- Motion/accessibility: preserve `prefers-reduced-motion` behavior by keeping animations tied to `.is-current` and transition classes, not required content. Keep all scroll steps readable without animation.

### Workshop Scrolly Derivatives

Use the Diabetic scrolly format above as the canonical visual reference when normalizing `lesson-row lesson-row--scroll` child pages in the Childhood Eye Screening and Glaucoma workshops.

- Childhood article/image pages use `.childhood-scrolly-page` with the same hero, reveal panel, numbered badge, image/caption, and white-card stack pattern; keep the Childhood green accent. Current examples include `childhoodIntroVisualDevelopmentPage`, `childhoodNormalVisualDevelopmentPage`, `visualImpairmentPage`, `signsVICasesPage`, and `childhoodReferPage`.
- Childhood custom scrollytelling pages such as Fundal Reflex Lottie routes and Eyes & Brain keep their own animation engines. If they need visual alignment, add only the shared shell/hero where it does not disturb the stage runtime.
- Glaucoma scroll pages in `public/html/glaucomascrollImages.html` use `.glaucoma-scrolly-page`, `.glaucoma-scrolly-hero`, `.glaucoma-scrolly-stack`, and `.glaucoma-scrolly-panel`; slide text should be converted into real HTML text with `.glaucoma-scrolly-copy` plus `.glaucoma-diagram` CSS diagrams where useful, not embedded as full-slide images. The reveal classes are driven by `initializeGlaucomaScrollyPages()` in `public/js/glaucomaWorkshopProgress.js`.
- Do not convert interactive Glaucoma mini-app pages (`glaucomaACDInteractive`, `glaucomaRAPDFullSwingInteractive`) into image panels; keep their existing interactive layout and route-specific initializers.

## scrollytelling

Use this when the user asks to make a page like `childhoodFundalPreparationPage`, "Fundal preparation scrollytelling", or a scrollytelling page that should behave exactly like `http://localhost:3000/#/childhoodFundalPreparation`. This is the Fundal Lottie stage-autoplay scrollytelling format, not the separate `.childhood-scrolly-page` article/card format.

- Canonical source files:
  - Page shell: `public/html/childhoodFundalPreparation.html`
  - Route map: `public/js/config.js` (`childhoodFundalPreparation: "html/childhoodFundalPreparation.html"`)
  - Route initializer: `public/js/main.js` `FUNDAL_REFLEX_SCROLL_ROUTES`
  - Engine/config: `public/js/childhoodFundalPreparation.js`
  - CSS: `public/style/pages.css`, especially `.childhood-fundal-scroll-page` rules around the Fundal section
  - Lottie/runtime assets: `/vendor/lottie.min.js`, `/scrolly/coreexam/fundalreflex/.../data.json`, `/images/icon/base/replay.webp`, `/scrolly/workshop/childhood/eyesbrain/down.png`, `/scrolly/workshop/childhood/eyesbrain/hand.png`

- HTML shell: use one page root with `class="page has-eyes-topbar childhood-fundal-scroll-page"` and a stable page id such as `childhoodFundalPreparationPage`. Add `data-fundal-scroll-key` for the route, keep a standard `.container.pupils-container`, `.eyes-topbar`, `.eyes-topbar__title`, menu span `.icon.menuBtn`, empty `.pupils-subtitle`, then a single empty `.childhood-fundal-prep-list` with an accessible `aria-label`. The JS engine owns all stage DOM inside this list; do not hand-code individual animation stages in the HTML.

- Route wiring: add the page to `public/js/config.js`, add the route name to `FUNDAL_REFLEX_SCROLL_ROUTES` in `public/js/main.js`, and add a matching `ROUTE_CONFIG[routeName]` entry in `public/js/childhoodFundalPreparation.js`. If the page participates in the Fundal next/previous sequence, also update `FUNDAL_PAGE_ROUTE_SEQUENCE`; if it is launched from Childhood Workshop, check `childhoodWorkshopProgress.js`, `childhoodWorkshopNextFlow.js`, and `childhoodEyeScreeningWorkshop.js` mappings.

- Required route config shape: set `pageId`, `label`, `enableReplay: true`, `segmentTextToggleOnTitle: true`, `paths`, and `playMode: "stageAutoplay"`. For this exact Preparation behavior, the source values are:
  - `paths`: prep `1` through `4` data files under `/scrolly/coreexam/fundalreflex/prep/`
  - `playbackRateByFile: [1, 1, 1, 1.3]`
  - `autoplayStartFrameByFile: [0, 0, 0, 90]`
  - `autoplayEndFrameByFile: [null, null, 375, null]`
  - `segmentTextTriggerFramesByFile: [null, null, null, [0, 196, 317, 384]]`
  - `segmentRanges`: file 1 `[37-239]`; file 2 `[0-120], [121-205], [206-299]`; file 3 `[0-101], [102-222], [236-354], [380-539]`; file 4 `[0-164], [271-316], [317-398], [399-539]`
  - `settleFrameOverrides`: `[239]`, `[120,205,299]`, `[101,222,354,539]`, `[164,316,398,539]`
  - `segmentStartTexts`: `Wash hands`; then `Use brightest light setting`, `Push lenses up`, `Examine in quiet, dim room`; then `Hold Arclight close to your eye`; then `Swaddle newborn`, `Parents should hold older baby`, blank spacer, `Older children can sit alone`
  - `segmentTextModeByFile: ["append", "append", "append", "append"]`
  - Keep the stability flags unless intentionally changing renderer behavior: `strictFrameLockNoFallback`, `strictFrameRemountOnBlank`, `iosAggressiveSettleSegments`, `richSettleContentFiles`, and `richSettleMinAreaByFile`.
  - For "pause before frame N" behavior, split playback with explicit `segmentRanges`, put the pause duration in `segmentPauseAfterMsByFile`, and pin each pause/completion with `settleFrameOverrides`. Recheck that the paused frame is the intended visual frame, not the final frame or a blank white renderer state.
  - If a route needs different speeds before/after a visual event, prefer per-segment playback rates over editing Lottie JSON. Keep caption trigger frames aligned to the visible event after speed changes.

- Runtime behavior: initialization cleans the prior active Fundal session, builds one `.childhood-fundal-prep-item` per Lottie file, and inserts `.childhood-fundal-prep-stage`, `.childhood-fundal-segment-text[aria-live="polite"]`, and a disabled next button. It prewarms Lottie image assets, loads `/vendor/lottie.min.js`, then creates each animation with `loop: false`, `autoplay: false`, and renderer `svg` by default; iOS/iPadOS uses canvas unless overridden. File 1 auto-starts when ready. Later files auto-start only after the previous file completed and the next stage is near viewport center. During playback, forward scroll is locked; on completion, the engine freezes on the configured settle frame, shows accumulated guidance text, shows a stage replay button, and enables the next-stage control.
  - Completion text must preserve all accumulated `append`/`appendInline` segment text. If a replay or pause change causes only the first caption to remain, fix the shared completion-text path rather than patching a single page.
  - Left-aligned captions should not be wider than the visible animation on desktop. Use the shared left-aligned caption class or equivalent max-width behavior, especially for bullet captions below wide BIO animations.

- Navigation behavior: the circular down-arrow button scrolls to the next stage. On the last stage, if there is a next Fundal route, the same control changes to a "Next page" pill and calls `navigateAdjacentFundalPage`. Wheel, touch, and keyboard boundary handlers also navigate across `FUNDAL_PAGE_ROUTE_SEQUENCE`, but only at the first/last boundary and after completion. Completion dispatches `childhoodWorkshop:route-complete` with `{ target: cfg.pageId }`.
  - For Diabetic scrollytelling groups, pages inside the group should continue by scroll/down-arrow. The last scrollytelling page in a group should also include ordinary `< Previous` / `Next >` buttons at the bottom, matching non-scrollytelling workshop pages and returning to the surrounding workshop flow when needed.

- Text behavior: segment text is centered below each animation, `font-size: 14px`, `line-height: 1.85`, `font-weight: 600`, color `#1f2937`, `white-space: pre-line`, and `aria-live="polite"`. In `append` mode, new segment copy accumulates instead of replacing older copy. Clicking or pressing Enter/Space on `.eyes-topbar__title.childhood-fundal-title-toggle` toggles all segment text via `.childhood-fundal-segment-text-hidden`.

- Layout: `.childhood-fundal-prep-list` is a vertical flex column with `gap: 107px`, `padding-bottom: 32px`, and `margin: 0 -22px`. If the route has a next page, the list gets an empty trailing spacer of `136px` so the final next-page control can fully enter view; on mobile this spacer is `76px`. Each stage has default aspect ratio `1169 / 1280`, `width: 100%`, background `#f5f6f7`, `position: relative`, `overflow: hidden`, and no rounded card frame. On desktop (`>=1024px`), stages are centered and shrink to `width: min(66.6667%, calc(var(--fundal-stage-max-height) * var(--fundal-stage-aspect-ratio)))` with default `--fundal-stage-max-height: 68vh`. JS breakpoints are `<=768px` narrow mobile, `>=1024px` desktop, and `>=1440px` wide desktop. Desktop scroll alignment pins the stage just below the topbar plus a top gap; mobile normally centers the stage vertically.

- Renderer sizing: Lottie `svg` and `canvas` are absolutely positioned with `inset: -1px`, `width/height: calc(100% + 2px) !important`, `z-index: 2`, and `clip-path: inset(0)` to avoid edge gaps. On iOS-like touch scrolling, keep the `translateZ(0)`, `will-change`, and `backface-visibility` stabilization rules.

- iOS/WebKit white-frame glitch recovery pattern:
  - First compare against the Childhood Fundal Reflex fixes in `public/js/childhoodFundalPreparation.js`, especially `iosRendererByFile`, `iosAggressiveSettleSegments`, `completionSnapshotImageByFile`, `preserveCompletionSnapshotOverlayByFile`, and `settleSnapshotImageByFile`.
  - If the animation is correct but iOS flashes white/blank at a pause, settle, or completion frame, prefer an exact static snapshot for that intended frame instead of changing segment timing or falling back to the previous live-rendered frame.
  - Generate the snapshot from the running local app/server, not a `file://` render, so Lottie image paths, fonts, CSS sizing, and canvas/SVG composition match production. Store it beside the affected Lottie folder as `pause_frame_<frame>.png` or `final_frame.png`.
  - Add the image to the route config with `settleSnapshotImageByFile` for pause/settle frames or `completionSnapshotImageByFile` for final completion frames. Prewarm those URLs with the route asset warmup path before playback.
  - At the hold point, seek/pin the exact target frame, then show the configured static snapshot immediately before any async settle/stability wait. The runtime canvas/SVG clone should remain only as a fallback when no configured image exists.
  - Do not use a previous-frame fallback for iOS blank recovery. It hides the blank but creates a visible frame regression/stutter on scroll pauses.
  - Keep renderer overrides separate from snapshot recovery: use `iosRendererByFile` when a file needs `svg` or `canvas` for mask correctness, and use static snapshots when WebKit drops a layer or canvas surface during a hold.
  - After changing this path, add/extend WebKit iPhone Playwright coverage that asserts the exact held frame, configured snapshot image URL, non-white screenshot content, and no early reveal for masked assets.

- Icon/button style: stage next is a circular button positioned below the item (`top: calc(100% + 12px)`, centered). Mobile/base size is `54px`; desktop size is `75px`. Background is `rgba(58, 58, 58, 0.46)`, no border, fully rounded, hidden by opacity until `.is-visible`, with pointer events only when visible and enabled. The icon is three CSS chevrons made from right/bottom borders, animated by `fundalArrowGrayShift` with staggered delays. Stage replay is also circular (`54px` mobile/base, `75px` desktop), same translucent gray background, anchored to the rendered animation's lower-right corner using `--fundal-replay-right` and `--fundal-replay-bottom`; the image is `/images/icon/base/replay.webp` at `37.5px x 33px` base and `49.5px x 46.5px` desktop. Do not reintroduce the old topbar `.childhood-fundal-replay-btn` unless maintaining legacy behavior; the current visible replay is stage-level.

- Next-page pill: when advancing to another page, the control uses `.childhood-fundal-scroll-down-arrow--page`. The wrapper is transparent but contains `.childhood-fundal-page-next-pill` with gray translucent background `#9d9d9db3`, pill radius, label `12px` bold lowercase, and chevrons. On small mobile (`max-width: 37.5em`), the pill becomes `86px x 128px`, hides CSS chevrons, and instead displays `down.png` plus the floating `hand.png` animation.

- Topbar details: keep the standard back/menu topbar. On small mobile, `.childhood-fundal-scroll-page .eyes-topbar__icons` uses the Fundal-specific offset and the hamburger is `36px x 36px`, `font-size: 25px`, flex-centered, with a small left shift. The title is `white-space: nowrap` and becomes a button-like caption toggle only when `segmentTextToggleOnTitle` is true.

- Verification checklist: open `http://localhost:3000/#/<routeName>` and check at mobile (`390x844` or similar) and desktop (`1280x720` or wider). Confirm first stage starts/settles without a blank frame, text appears below the stage, replay appears inside the stage lower-right, the down button scrolls to the next animation, later animations auto-play only when centered, title toggles text, final page-next pill is fully visible, and no menu/topbar icons overlap. If touching shared Fundal engine or settle behavior, run or manually cover the Fundal regression paths noted in the guardrails below.
  - iOS/WebKit verification is mandatory for new or changed scrollytelling routes. Confirm the route loads without repeated WebKit crashes, renderer overrides still display the intended animation direction, pauses hold the correct configured frame/snapshot, text survives pauses/completion, and the service worker cache name is bumped when cached HTML/JS/CSS behavior changes.

# Newborn Eyes Open Scroll Notes

## 2026-03-11 Interactive Learning External Embed Notes

- Page: `interactiveLearningPage` inside `public/html/videos.html`
- Added external embed cards:
  - Primary: `Fundal Reflex`, `Trauma`
  - Intermediate: `Amsler`
- Embed targets:
  - `https://fundalreflex.netlify.app/`
  - `https://trauma26.netlify.app/`
  - `https://amsler2.netlify.app/`
- Integration pattern:
  - Use the existing Videos-route subpage flow (`data-page`, `data-target`, hidden `.page` blocks, lazy `iframe[data-src]` loading in `public/js/videos.js`).
  - Keep the same wrapper UI as local subapps (`backBtn`, header, shared container flow).
- Styling constraint:
  - Arclight can change the outer wrapper, card spacing, iframe size, and surrounding UI.
  - Arclight cannot directly restyle or reposition icons/elements inside those embedded sites because they are cross-origin iframes.
- Operational note:
  - If any remote site later sends `X-Frame-Options` or restrictive `frame-ancestors` CSP, the iframe embed will break and needs a fallback plan.

## Context

- Page: `childhoodFundalNewbornEyesOpen`
- File set: `eyesopen/1`, `eyesopen/2`, `eyesopen/3` (`eyesopen/4` removed)

## Translation Rule (Persistent)

- In locale JSON files, UI symbol values must be preserved and not translated.
- Keep symbols exactly as-is across languages, including `?`, `<`, `?`.
- Correct mistranslations caused by homonyms and keep the wording medically precise.
- Keep tone consistent and formal where the copy is instructional, clinical, or UI-confirmation text.
- Standardize UI wording to natural target-language actions instead of literal `OK` / `Cancel` carry-overs when better equivalents exist.
- Keep language names in selectors/popups in their native script where applicable.
- Prefer explicit scoped i18n keys for new work, but keep required legacy root alias keys aligned when existing pages/tests still depend on them.
- Check JS-rendered captions, toggles, menus, and aria labels for hardcoded English; translation QA is not limited to static HTML.
- Save locale JSON, VTT subtitle sources, and generated subtitle outputs as UTF-8; do not ship replacement-character damage, `???`, or mojibake.
- After translation or subtitle edits, scan both source files and generated iOS HLS subtitle outputs for `???`, `�`, and unintended fallback English in the target language.

## QA Baseline

- `scripts/check-translations.cjs` is the canonical audit entry point for used-key coverage, damaged-string detection, and fallback-English review.
- `scripts/i18n-qa-rules.cjs` stores the standing medical homonym guidance; use those meanings first when a source term is ambiguous.
- Media elements must either be explicitly decorative or have an accessible name via `alt`, `aria-label`, `aria-labelledby`, or `title`. Runtime support now lives in `public/js/mediaA11y.js`, and the static audit is `scripts/test-a11y.mjs`.
- Current baseline (`2026-06-12`): accessibility audit passes on `143` HTML files; translation QA reports `0` missing used keys, `0` damaged strings, `0` exact-English carry-overs, `0` medical homonym violations, and `0` subtitle medical homonym violations.

## Issue Summary

- After file 2 and file 3 complete, the stage can look like a near-white blank screen with only a few elements visible.
- This happens when settling on terminal tail frames (`"last"`) in long tail segments where renderer state can drop layers (especially with large frame jumps between segments).

## Root Cause

- Segment playback is correct, but settle frame choice at the end of file 2 segment 3 and file 3 segment 4 is unstable.
- Tail-end frames can be visually sparse or can expose SVG layer-drop behavior, so pinning to `"last"` can produce an effectively blank result.

## Current Fix

- Historical notes below this heading are legacy context and are superseded by `2026-02-26 Mandatory Guardrail` when they conflict.
- Keep playback ranges unchanged.
- Override settle frames to stable frames for the problematic segments:
  - file 2 segment 3: settle to frame `205`
  - file 3 segment 4: settle to frame `262`
- Keep required custom behavior:
  - file 3 segment 3 settles to `205` (outside its playback segment) by explicit override.

## Guardrail For Future Edits

- If tail-white/blank appears again on this page, do not first change segment ranges.
- First adjust `settleFrameOverrides` for the affected segment(s) to a stable frame with full visual content.

## 2026-02 Follow-up Update

- Added a richer settle-frame check for `childhoodFundalNewbornEyesOpen` files 2 and 3:
  - During settle/pin, sparse frames (only a few small elements visible) are rejected.
  - The engine searches backward for a frame with enough visible area before freezing.
  - Final pinning now runs in bounded passes (no infinite desktop pin loop) to reduce repeated SVG layer drop.
  - Settled frames for terminal segments were forced to known stable non-white frames:
    - file 2 segment 3 -> frame `205`
    - file 3 segment 4 -> frame `262`
  - Rich-frame memory (`lastRichVisibleFrame*`) is tracked so settle fallback can prefer previously verified full-content frames.
- `childhoodFundalNewbornEyesClosed` update:
  - file 1 now plays from `00000` to end, then holds last frame.
  - file 3 removed from the page sequence.
- Size normalization update:
  - `Unclear Findings` now defines per-file stage aspect ratios so files 1/2/3 are no longer undersized.
  - `Possible Findings` now defines a tall stage aspect ratio so horizontal size matches other animations without shrinking.
  - `Unclear Findings` file 1 gets extra top-visibility bias (`centerTopBiasByFile`, `firstFileExtraTopGap`) to reduce top clipping.

## White-Screen Prevention Coverage (Fundal Scroll Engine)

- Common protections used by all Fundal scroll pages (Preparation, Examination, Newborn Eyes Open/Closed, Unclear, Possible, After Examination):
  - `isStageFrameBlank()` blank-frame detection before final settle/pin.
  - `resolveSettledFrame()` backward search when target frame is blank/unstable.
  - `resolveAnyVisibleFrame()` fallback scan to nearest visible frame.
  - `forceSvgVisibleForController()` Safari/iOS SVG layer stabilization.
  - bounded `startFinalPinLoop()` passes to avoid prolonged pin-loop instability.
- Route-specific protection for `childhoodFundalNewbornEyesOpen`:
  - `richSettleContentFiles` + `richSettleMinAreaByFile` to reject sparse frames at settle time.
  - terminal settle overrides pinned to non-white frames (`205`, `262`).
  - rich-frame memory (`lastRichVisibleFrame*`) as additional fallback source.

## 2026-02-25 Asset Alignment

- `Unclear Findings` file 2 visual alignment request:
  - Updated `public/scrolly/coreexam/fundalreflex/unclear/1/data.json` layer using `image_6` (`img_6.png`) Y position from `46.286` to `54.5` so it sits lower like `unclear/2`.

## Text Overlay Policy (Fundal Scroll Pages)

- Segment text should accumulate and remain visible.
- New segment text should be appended below existing text, not replace it.
- Default engine mode for segment text is `append` when no explicit per-file mode is set.
- Current text style for fundal segment captions:
  - `font-size: 14px`
  - `line-height: 1.85`
  - centered alignment
- Top-bar title click can be used to toggle segment text on/off on enabled routes.
- This is enabled for:
  - `Preparation`
  - `Examination`
  - `Newborn - Eyes Open`
  - `Newborn - Eyes Closed`
  - `Unclear Findings`
  - `Possible Findings`
  - `After Examination`

## 2026-02-26 Mandatory Guardrail (Do Not Regress)

- For all Fundal `segmentScroll` routes, each segment must freeze on that segment's terminal frame (`to`, or file end when `to` is omitted).
- Do not use `settleFrameOverrides` to move the final hold to a different frame unless there is explicit approval for that route and segment.
- White-screen prevention must preserve the same terminal frame:
  - Use same-frame repin/recovery (`goToAndStop(target)` + SVG visibility forcing + renderer refresh).
  - If a nudge is needed for renderer recovery, always return to the exact target frame before final pin.
- Any edit to Fundal scroll/settle logic must be manually rechecked on:
  - `Preparation` file 2 and file 3
  - `Examination` (multi-segment files)
  - `Newborn - Eyes Open` file 2 and file 3

## 2026-02-26 Mandatory Baseline (User-Approved)

- Canonical stable reference for Fundal scroll behavior is commit `4fdee95` (`FR06`), especially `public/js/childhoodFundalPreparation.js`.
- User-verified outcome: FR06 does **not** show the white blank screen regression after segment/scroll animation completion.
- Mandatory rule: keep FR06 behavior as baseline for all Fundal routes (`Preparation`, `Examination`, `Newborn - Eyes Open/Closed`, `Unclear Findings`, `Possible Findings`, `After Examination`).
- If white blank regression appears again, first step is FR06 comparison/restore for this file before adding new logic.
- Do not ship new settle/pin/blank-detection experiments on this file unless explicitly requested and re-verified against FR06 behavior.
