# Agent Notes

Last refreshed: 2026-05-08

## Current repo orientation

- Arclight is a static-first PWA served from `public/` in development and `dist/` after builds, with `server.cjs` providing hosting, reports/admin protection, and app/telemetry APIs.
- Runtime storage is currently no-op by default through `storage/disabled-storage.cjs`; Postgres is selected by `storage/index.cjs` only when DB URLs are configured and `DISABLE_DB_STORAGE` is not enabled.
- Playwright starts its local web server with `DISABLE_DB_STORAGE=1`, so E2E tests should not touch configured DBs.
- The Eyes route includes a Diabetic Retinopathy workshop at `public/html/diabeticRetinopathyWorkshop.html`.
- The diabetic workshop is split across routes:
  - `public/html/diabeticRetinopathyWorkshop.html` owns the folder launcher, scroll lessons, protocol pages, and rows that jump to Videos-route lessons.
  - `public/html/videos.html` owns the diabetic video pages and the Interactive Learning `Demo Quizzes` folder/pages.
  - `public/js/diabeticRetinopathyWorkshop.js` initializes workshop-only behavior plus the diabetic demo quiz pages when those pages exist.
  - `public/js/diabeticWorkshopProgress.js` and `public/js/diabeticWorkshopNextFlow.js` keep progress, previous/next flow, and return-to-folder behavior aligned across route boundaries.
- The Videos route hosts both local subapps and selected external iframe lessons; cross-origin iframe internals cannot be styled or scripted from Arclight.
- `scripts/build.cjs` cleans build outputs by renaming old output directories to `.build-cleanup-*`, recreating the target output directory, and falling back to retrying removal when Windows file locks block the rename.

## Current docs baseline

- Root docs: `README.md`
- Persistent project context: `memory-bank/`
- Test docs: `tests/README.md`
- Reports/security docs: `reports/README.md`, `security/README.md`, `security/EMERGENCY_PLAN.md`

## Agent guardrails

- Prefer code-referenced documentation over aspirational descriptions.
- Keep `README.md`, `memory-bank/activeContext.md`, and `memory-bank/progress.md` aligned when features or runtime behavior change.
- Preserve stable `data-target`, `data-lesson`, `data-folder`, and `data-route` values in the Diabetic Retinopathy workshop and Videos-route demo/video pages unless all dependent navigation/progress/next-flow mappings are updated together.
- When moving diabetic pages between `diabeticRetinopathyWorkshop.html` and `videos.html`, recheck `main.js` initialization, `videos.js` subpage routing, `diabeticWorkshopNextFlow.js`, and progress bar updates together.
- Do not treat `.build-cleanup-*` directories as source artifacts; they are ignored temporary output directories left by safe build cleanup.
- For Fundal scroll work, preserve the mandatory FR06 behavior guardrails below unless the user explicitly approves a change and it is manually rechecked.

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
- Current baseline (`2026-04-16`): accessibility audit passes on `76` HTML files; translation QA is down to `114` missing used keys, `28` damaged strings, and `764` exact-English carry-overs, with missing-key debt now concentrated on four reports labels.

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
