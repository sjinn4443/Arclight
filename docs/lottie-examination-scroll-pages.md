# Building a Lottie examination scroll page

Source review: 7 October 2026. This is the implementation reference for a new
Videos lesson alongside `videos/directOphthalmoscopyScrollPage` and
`videos/fundalReflexExaminationScrollPage`. It records the current source,
including page-specific styles that the shared class alone does not apply.

## Reference pages and ownership

| Concern                                                                                                               | Source and responsibility                                                                                                 |
| --------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------- |
| Hidden page shells and launch rows                                                                                    | `public/html/videos.html`                                                                                                 |
| Showing a subpage, lazy initialisation, audio priming and progress events                                             | `public/js/videos.js`                                                                                                     |
| Stage DOM, route configs, Lottie loading, text, replay, advance controls, scroll locks, completed restore and cleanup | `public/js/childhoodFundalPreparation.js`                                                                                 |
| Narration seconds to local scene frames, translated script cues and heading lookup                                    | `public/js/examinationScrollTiming.js`                                                                                    |
| Standalone lesson config examples                                                                                     | `public/js/frontOfEyeExaminationScroll.js`, `public/js/visualAcuityExaminationScroll.js`                                  |
| Stage geometry, captions, dividers and controls                                                                       | `public/style/pages.css`; check `public/style/responsive.css` for interacting overrides                                   |
| Structural Back destinations                                                                                          | `public/js/navigation.js`                                                                                                 |
| Eyes launch targets                                                                                                   | `public/js/eyes.js`                                                                                                       |
| My Learning destinations and categorisation                                                                           | `public/js/mylearning.js`                                                                                                 |
| Shared earned progress and completion ticks                                                                           | `public/js/lessonProgress.js`, `public/js/lessonCompletionTick.js`                                                        |
| Selective downloads and cache delivery                                                                                | `public/js/languageinstall.js`, `public/js/offline.js`, `public/sw.js`, `utils/offline-manifest.cjs`, `scripts/build.cjs` |
| Narration authoring, regeneration and localisation                                                                    | [Narration production record](../memory-bank/narration-and-subtitles.md)                                                  |

These are `stageAutoplay` lessons: scrolling selects the next eligible animation,
then that animation plays automatically. They do not continuously scrub a frame
for every scroll pixel. Article/image reveal lessons use a different workshop
pattern. The historical `segmentScroll` mode is described in
[Fundal legacy behaviour](../memory-bank/fundal-scroll-legacy-behavior.md) and is
not the template for this request.

| Property                         | Direct Ophthalmoscopy                                                                      | Fundal Reflex                                                                                                                                            |
| -------------------------------- | ------------------------------------------------------------------------------------------ | -------------------------------------------------------------------------------------------------------------------------------------------------------- |
| URL hash                         | `#/videos/directOphthalmoscopyScrollPage`                                                  | `#/videos/fundalReflexExaminationScrollPage`                                                                                                             |
| Internal engine key              | `directOphthalmoscopyScroll`                                                               | `fundalReflexExaminationScroll`                                                                                                                          |
| Page ID                          | `directOphthalmoscopyScrollPage`                                                           | `fundalReflexExaminationScrollPage`                                                                                                                      |
| Stages                           | 13: Observation and Fundal Reflex (5), Positioning and Flight Path (6), How to Examine (2) | 22: Preparation (4), Examination (5), Newborn Eyes Open (3), Newborn Eyes Closed (2), Unclear Findings (4), Possible Findings (2), After Examination (2) |
| Asset root                       | `/scrolly/coreexam/ophths/DO/`                                                             | `/scrolly/coreexam/fundalreflex/`                                                                                                                        |
| Config construction              | Combines three existing Diabetic route configs                                             | Combines seven existing Childhood route configs                                                                                                          |
| Progress prefix used for restore | `diabeticWorkshop:progress:`                                                               | Default `childhoodWorkshop:progress:`                                                                                                                    |
| Motion timing                    | Narration clock plus `EXAMINATION_SCROLL_TIMING`                                           | Existing segment/frame playback plus narration clips                                                                                                     |
| Guidance                         | Full Animation `script.json` cues                                                          | `segmentStartTexts` translated through the dictionary                                                                                                    |
| Audio folder                     | `/narration/direct-ophthalmoscopy/full-animation/`                                         | `/narration/fundal-reflex/full-animation/`                                                                                                               |

The internal engine key is not a top-level URL route. For a sibling Videos page,
keep `config.js`'s existing `videos` route and initialise the engine from
`videos.js`. Separate `childhoodFundal*` routes instead require a fragment in
`config.js` and membership in `main.js`'s `FUNDAL_REFLEX_SCROLL_ROUTES`.

For a procedure-hosted example, see
[Make an eye pad and eye shield](./make-eye-pad-shield-scroll.md).
`eyeCareProcedure.html` supplies a template cloned only for `eyePadShield`, and
`eyeCareProcedure.js` owns launch, lazy initialisation and shared progress. The
same engine config and combined-page CSS still apply. Its timing entry specifies
`route: "eyePadShield"` so generic browser checks use the correct containing route.

## Minimal page shell and launcher

Use the existing topbar and an empty animation list. Replace every example ID,
translation key, label and asset path with the new lesson's values. These snippets
are authoring templates, not registered application content.

```html
<div
  id="newExaminationScrollPage"
  class="page pupils-like has-eyes-topbar childhood-fundal-scroll-page"
>
  <div class="container pupils-container">
    <div class="eyes-topbar">
      <div class="eyes-topbar__title" data-i18n="lessons.new_examination.title">
        New Examination
      </div>
      <div class="eyes-topbar__icons">
        <div
          class="fundal-scroll-narration-controls"
          data-fundal-scroll-narration-controls
        >
          <select
            class="fundal-scroll-narration-controls__language"
            data-fundal-scroll-narration-language
            aria-label="Narration language"
          ></select>
          <button
            type="button"
            class="fundal-scroll-narration-controls__toggle"
            data-fundal-scroll-narration-toggle
            aria-label="Turn narration off"
            aria-pressed="true"
          >
            🔊
          </button>
        </div>
        <span
          class="icon menuBtn"
          aria-label="Menu"
          data-i18n="i18nExtra.menu_aria_label:aria-label"
          >☰</span
        >
      </div>
    </div>
    <h2 class="pupils-subtitle"></h2>
    <div
      class="childhood-fundal-prep-list"
      aria-label="New Examination guide"
    ></div>
  </div>
</div>
```

The current reference shells also contain a translated subtitle; their topbar
synchronisers manage it. Follow their visibility rules to avoid duplicate visible
headings. The narration runtime fills the selector and updates localised control
labels and pressed state. A lesson without narration can omit the narration
controls and config fields.

Add a `lesson-row lesson-row--scroll` launcher in the appropriate folder using
`data-target="newExaminationScrollPage"`. Copy its thumbnail, visible
`.lesson-type`, progress markup and route behaviour from the existing launcher.
Every repeated launcher needs its own title ID, and its progress bar's
`aria-labelledby` must point to that visible title. The page ID remains shared.
Retain `data-i18n` metadata and translate newly inserted DOM through
`window.I18N?.applyTranslations?.(node)` where the shared runtime does not own it.

The engine builds the stage DOM. Do not put individual animations or scripts into
the HTML list:

```text
.childhood-fundal-prep-list
  section.fundal-reflex-examination-section
    .fundal-reflex-section-divider
      h3.fundal-reflex-section-divider__title[data-section-title]
    .fundal-reflex-examination-section-items
      .childhood-fundal-prep-item[data-file-index="0"]
        .childhood-fundal-prep-stage[role="img"][data-file-index="0"]
        .childhood-fundal-segment-text[aria-live="polite"]
        .childhood-fundal-scroll-down-arrow
```

Replay controls and recovery overlays are runtime-owned. File indices are
zero-based across the whole combined lesson, not reset for each section.

## Config and JSON assets

Register `ROUTE_CONFIG.newExaminationScroll` in the shared engine. For new content,
prefer a separate config module like `frontOfEyeExaminationScroll.js`, imported
and registered by the engine. For existing route sections,
`createCombinedFundalRouteConfig(pageId, label, sectionDefs)` combines paths,
copies per-file arrays and offsets file-index lists such as `leftAlignedTextFiles`.
The combiner is internal to the engine, not an exported API. Preserve its deep
copying so a combined lesson does not mutate its source workshop routes.

```js
// Example shape only; frame values must come from the supplied animation.
export const NEW_EXAMINATION_SCROLL_CONFIG = {
  pageId: "newExaminationScrollPage",
  label: "New Examination",
  playMode: "stageAutoplay",
  enableReplay: true,
  segmentTextToggleOnTitle: true,
  persistentSettleSnapshotOverlay: true,
  strictFrameLockNoFallback: true,
  strictFrameRemountOnBlank: true,
  lazyInitialStageCount: 1,
  lazyLoadStageAnimations: true,
  skipRouteImageWarmup: true,
  progressStoragePrefix: "lessonProgress:",
  paths: ["/scrolly/coreexam/new-examination/01Preparation/1/data.json"],
  sections: [{ startIndex: 0, title: "Preparation" }],
  segmentRanges: [[{ from: 0, to: 89 }]],
  settleFrameOverrides: [[89]],
  completionHoldFrameByFile: [89],
  segmentStartTexts: [["Example guidance"]],
  segmentTextModeByFile: ["append"],
};
```

The example follows the newer standalone lesson progress pattern. Set its Videos
progress writer to `setLessonProgress` so restore reads the same key it writes.
Lazy loading and skipped bulk image warmup are used by DO, BIO and the newer
standalone lessons; they are not the combined Fundal defaults. Review them for
the new assets rather than copying every historic renderer override.

For each supplied JSON, inspect `w`, `h`, `fr`, `ip`, `op`, `assets` and referenced
image files. Keep `data.json` beside its image directory and any configured
snapshot files. Preserve image `u`/`p` resolution, filename case and numeric stage
order (`1`, `2`, ... `10`, not lexical order). Use local frame coordinates as
the existing engine does; check non-zero `ip` before assuming frame zero.
Do not derive narration times by dividing frame numbers by FPS when the lesson
has speech holds or a different Full Animation timeline.

| Config family                                                                                           | Purpose                                            |
| ------------------------------------------------------------------------------------------------------- | -------------------------------------------------- |
| `paths`, `sections[{startIndex,title,titleKey}]`                                                        | Explicit asset order and section boundaries        |
| `segmentRanges`, `autoplayStartFrameByFile`, `autoplayEndFrameByFile`                                   | Played portions of each file                       |
| `playbackRateByFile`, `segmentPlaybackRateByFile`, `segmentPauseAfterMsByFile`                          | Frame-based speed and teaching holds               |
| `settleFrameOverrides`, `completionHoldFrameByFile`, `forceExactCompletionHoldFrameByFile`              | Stable pause and completion frames                 |
| `segmentStartTexts`, `segmentTextTriggerFramesByFile`, `segmentTextModeByFile`                          | Guidance and accumulation for frame-based playback |
| `leftAlignedTextFiles`, `bulletTextFiles`, `finalSummaryBulletsByFile`                                  | Guidance presentation                              |
| `stageAspectRatioByFile`, `preserveAspectRatioByFile`, `centerTopBiasByFile`, `desktopTopGapByFile`     | Asset geometry and viewport alignment              |
| `iosRendererByFile`, `richSettleContentFiles`, `richSettleMinAreaByFile`, `iosAggressiveSettleSegments` | Asset-specific WebKit recovery                     |
| `settleSnapshotImageByFile`, `completionSnapshotImageByFile`, `preserveCompletionSnapshotOverlayByFile` | Exact static recovery frames                       |
| `narrationTracks`, `narrationClipsByFile`, `narrationTimeline`                                          | Optional audio and clock-driven animation          |
| `progressStoragePrefix`, `disableCompletedRouteRestore`                                                 | Where completed revisit state comes from           |

Align every per-file array to `paths`; align nested segment arrays to that file's
segment order. Keep intentional gaps and null entries. The combined engine
retains snapshot and renderer settings from its source configs.

## Visual contract

Reuse `.childhood-fundal-scroll-page` in `pages.css`. Also extend the existing
combined-page `:is(...)` selector groups to include the new page ID. They control
the outer list, section wrappers, item spacing, dividers, first divider and
divider title, including mobile overrides. The same class alone leaves the
outer list at the base 107px gap and does not apply the combined section styling.

| Element                          | Current reference styling                                                                                                            |
| -------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------ |
| Base list                        | Vertical flex, `gap: 107px`, `margin: 0 -22px`, bottom padding 32px                                                                  |
| Combined outer list              | `gap: 0`, bottom padding 24px                                                                                                        |
| Combined section / section items | Vertical flex; section gap 0, item gap 107px                                                                                         |
| Section divider                  | Full-width black band, minimum height 60px, horizontal padding 24px, top clearance 120px; first divider has no top margin            |
| Divider title                    | White, weight 500, centred, `clamp(1.05rem, 0.95rem + 0.7vw, 1.45rem)`, tracking 0.03em; mobile 1rem and 0.05em                      |
| Stage                            | Default ratio `1169 / 1280`, full width, `#f5f6f7`, square edges, relative positioning, hidden overflow, isolated paint              |
| Desktop stage (`>=1024px`)       | Centred width `min(66.6667%, calc(var(--fundal-stage-max-height) * var(--fundal-stage-aspect-ratio)))`; default height variable 68vh |
| Caption                          | 14px, line height 1.85, weight 600, `#1f2937`, padding `12px 16px 12px`, minimum height 40px, centred, preserved line breaks         |
| Left-aligned caption             | Centred block, mobile maximum `min(88vw, 700px)`; desktop width follows stage geometry                                               |
| Replay and stage advance         | Shared circular controls: 54px on small mobile, 75px on desktop; keep runtime anchoring and focus styles                             |
| Cross-route trailing spacer      | 136px normally, 76px at `<=37.5em`, only when the engine marks a next route                                                          |

The engine's layout breakpoints are narrow mobile `<=768px`, desktop `>=1024px`
and wide desktop `>=1440px`. CSS also has a `37.5em` small-mobile breakpoint.
Desktop stages align below the measured topbar; mobile alignment uses the
viewport centre with per-file biases. The engine positions advance controls
against the visible scene and guidance. Retain the divider clearance so an
anchored arrow cannot cover the next section heading.

Keep stage aspect ratios in config when the JSON dimensions differ. Preserve the
SVG/canvas clipping and same-frame overlay geometry. DO has caption overrides
for specific source stages; Visual Acuity has extra reading width and paragraph
rules. Copy only overrides appropriate to the new content. Inspect long
translations, captions plus controls, tablet layout and both portrait and
landscape before changing shared spacing.

## Playback, narration and language

On a fresh visit the first ready stage starts. Later stages require the previous
stage to finish and an eligible viewport position or explicit advance request.
Only one stage plays at a time. Forward wheel, touch and keyboard movement is
locked during playback; both window and `#page-content` scroll hosts are handled.
Completion freezes the configured visual, retains accumulated guidance and
reveals replay and advance. The title becomes a keyboard-operable text toggle
when `segmentTextToggleOnTitle` is enabled.

For DO-style narration, add `EXAMINATION_SCROLL_TIMING[newPageId]` with the audio
folder and one `stages` point array per Lottie file:

```js
// Example seconds are absolute positions in the full narration track.
newExaminationScrollPage: {
  folder: "new-examination",
  stages: [[[3, 0], [6, 89], [9, 89]]],
},
```

`frameAtNarrationTime()` interpolates and rounds local frames; repeated frames
create a teaching hold. `configureExaminationTiming()` assigns the timeline,
loads `/narration/<folder>/full-animation/script.json`, resolves each clip's
`cueIds`, supplies translated guidance and translates section titles using
`videoTitleCues`. Register the new config before the engine's
`Object.values(ROUTE_CONFIG).forEach(configureExaminationTiming)` pass.
Provide `narrationTracks` with language labels and local audio URLs and
`narrationClipsByFile` with `{start, end, cueIds}` in stage order. Check cue IDs,
clip bounds, timeline points and available final frames together.

Audible playback follows the media clock. Muted playback uses a monotonic virtual
clock; muting must retain the current position. Completion waits for narration
and the visual timeline. DO stage 8 (index 7) has a visual tail after its speech
ends, so the engine continues that motion in silence without playing the next
stage's speech. DO's timing setup also extends index 8 to frame 645 for the
branch-back-to-disc scene. These are DO-specific facts, not new-page defaults.

Call `primeExaminationNarration(pageId, language)` in the launcher's user gesture
before asynchronous work. The shared narration controller claims that exact
audio element through `takePrimedExaminationAudio()`, preserving iOS permission.
Priming needs an entry in `EXAMINATION_SCROLL_TIMING`; it does not apply to the
existing Fundal clip-only path. Preserve blocked-audio recovery for direct URL
visits and browsers that reject autoplay.

Fundal uses its existing segment playback with 22 audio intervals. Clips can
continue over the held final visual. Its intervals are in stage order and are
not globally increasing in audio time. Do not sort them or add a narration frame
timeline merely to make a new lesson look consistent.

Current narration languages are `en`, `es-419`, `ko`, `ne`, `fr`, `lg`, `ha`,
`yo` and `ig`; unsupported choices resolve to English. Keep Auto and mute
preferences in `videoNarrationLanguage:<pageId>` and `videoNarration:<pageId>`.
The selector changes the lesson voice and stage guidance without changing
`prefLang`. Auto follows the app language. An app-language change resets the
lesson selector to Auto while preserving mute. Fundal guidance still uses the
dictionary, but `getFundalTextLanguage()` selects it from the narration preference
(`es-419` maps to dictionary `es`). DO guidance and script-managed section titles
come from translated script cues. Fundal headings retain their dictionary keys.
Older notes claiming guidance always follows the app language were stale.

## Progress, routing and cleanup

Adding an engine config alone does not register a usable Videos lesson. Wire:

1. The hidden page and every launcher target in `videos.html`.
2. Page ID, engine key and a lazy initializer in `videos.js`, patterned after
   `initializeDirectOphthalmoscopyScrollGuide()`. Its two page-display paths both
   initialise scroll lessons; inspect both, not just one.
3. Launcher audio priming, topbar translation and any return-context handling.
4. A progress synchroniser and scroll/resize hooks. Existing scroll percentage
   is capped at 95; `childhoodWorkshop:route-complete` with `{target: pageId}`
   writes 100 through the correct progress owner. Scrolling alone cannot complete.
5. A matching `progressStoragePrefix` for completed restore. DO uses the
   Diabetic writer, Fundal the Childhood writer, Front of Eye and Visual Acuity
   `setLessonProgress`. Keep monotonic earned progress and completion ticks.
6. Structural Back mapping in `navigation.js`, Eyes launch integration where
   applicable and My Learning's `{route: "videos", subPageId: pageId}` plus
   categorisation in `mylearning.js`.
7. Any workshop-owned row, progress mapping, return folder and Previous/Next flow
   that launches the shared lesson. Review actual launch contexts before copying
   a structural destination; DO currently maps Back to `arclightPage`, Fundal to
   `fundalReflexPage`.

Completed visits restore settled stages and replay controls using the configured
progress key. Test fresh, partial and completed visits separately. Keep page IDs
stable because URLs, earned progress and launch contexts depend on them.

`FUNDAL_PAGE_ROUTE_SEQUENCE` is for cross-page Fundal/Diabetic sequences. A single
combined Videos lesson does not need insertion into that sequence. Its down arrow
advances within the lesson; sequence pages can replace the final arrow with a
Next page pill and expose a Previous page control. Terminal workshop sequences
may also use ordinary bottom Previous/Next buttons.

The engine cleans the prior session when initialising a lesson, on `page:shown`
when another subpage appears and on `page:loaded` for other top-level routes.
Keep those events in the navigation path. Cleanup stops/removes narration,
unlocks scrolling, removes input/media listeners, cancels animation frames and
destroys Lottie instances. Do not add a second unmanaged audio element, scroll
observer or independent animation loop for a new page.

## WebKit and offline delivery

The shared renderer defaults to SVG outside iOS/iPadOS and canvas on iOS-like
WebKit, with `iosRendererByFile` overrides for known fragile assets. Preserve
exact pause/final snapshots and their overlays when reusing existing configs.
If the intended frame renders white on WebKit, inspect the existing same-frame
recovery and snapshot path before changing scene ranges or showing another frame.
The FR06 baseline and mandatory frame rules in [agent notes](../agent.md) remain
in force. This guide does not authorise settle experiments on existing Fundal
lessons.

Place JSON, raster dependencies, snapshots and narration under `public/` so the
build and manifest can ship them. The downloads client treats `/scrolly/` as
content rather than app shell. Narration belongs to media/language selection.
Verify `OFFLINE_SECTION_PATTERNS` and `matchesOfflineCatalog()` for the actual new
paths, then verify the built manifest and selected download contain every JSON,
referenced image, snapshot and intended audio track. Shared JS and vendor Lottie
also need the cached app shell. Do not assume a folder name automatically belongs
to the correct download section. Keep English fallback selection consistent for
lessons that lack the selected narration language.

For shipped HTML, JS, CSS or assets, review the source service-worker fallback
revision and build-injected cache name; bump the cache where needed. Documentation
alone does not require a build or service-worker bump.

## Verification for a future implementation

Use real asset metadata and visual checkpoints, not only source-string checks.
Extend test fixture tables for the new page: some suites have explicit page IDs,
counts and launch hubs, even when timing entries are enumerated automatically.

| Change                                             | Existing checks to adapt or run                                                                                                       |
| -------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------- |
| Shell, launcher, progress and assets               | `tests/videos-subtitles.test.cjs`, `tests/interactive-learning-topic-quizzes.test.js`, `tests/front-of-eye-scroll.test.js`            |
| Narration controls and preferences                 | `tests/fundal-scroll-narration.test.cjs`, `tests-e2e/combined-ophthalmoscopy-narration.spec.js`                                       |
| Scene/caption clock and section clearance          | `tests-e2e/examination-scroll-sync.spec.js`, `tests-e2e/examination-scroll-headings.spec.js`, `tests-e2e/front-of-eye-scroll.spec.js` |
| Shared scroll, final frames, WebKit and navigation | `npm run test:fundal`, `tests-e2e/fundal-page-navigation.spec.js`, `tests-e2e/diabetic-fundal-regressions.spec.js`                    |
| Translation and accessible progress names          | `npm run check-translations`, `npm run test:a11y`                                                                                     |
| Offline download filtering                         | `tests/languageinstall-offline-narration.test.cjs`                                                                                    |
| Build delivery and responsive surfaces             | `npm run build`, `tests-e2e/quality-responsive.spec.js`                                                                               |

Typical focused commands after implementing a sibling lesson:

```powershell
npm test -- --runInBand --runTestsByPath tests/front-of-eye-scroll.test.js tests/fundal-scroll-narration.test.cjs
npm run test:animations
npx playwright test tests-e2e/combined-ophthalmoscopy-narration.spec.js
npm run test:a11y
npm run check-translations
```

Check first-stage autoplay, forward locks, reverse movement, replay, text toggle,
all sections and final visual, mute/unmute mid-clip, Auto/manual language, blocked
audio recovery, refresh, completed revisit, Back, My Learning and cleanup while
leaving a playing stage. Inspect mobile, tablet and desktop, long translations,
heading/arrow clearance, scene cropping and missing-file/slow-network behaviour.
Assess reduced-motion behaviour explicitly; the stage runtime does not currently
declare a dedicated reduced-motion autoplay policy. Do not claim one by copying
the separate workshop article or PEC illustration docs.

WebKit sync tests use `helpers/webkit-narration-clock.js` and cannot prove real
device audio quality. Listen and inspect the supplied scenes on physical iPhone/
iPad before asserting device acceptance. Record what was actually checked.

## Record for this documentation task

This review documents a reusable implementation contract. It adds no lesson,
changes no runtime or animation assets and does not establish new browser,
clinical or physical-device acceptance. README, `agent.md` and the memory bank
link here so a future task can build the sibling page from one maintained guide.

Documentation formatting and guide links/source references were checked. Source
config extraction confirmed 13 DO and 22 Fundal stages; all their JSON files,
basic animation metadata and referenced image files were verified locally.
