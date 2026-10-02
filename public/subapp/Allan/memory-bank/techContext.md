# Technical Context

<!-- APP-DOC-STATUS:START -->

## Current Memory Status (21/7/2026)

- Static packaging: open `index.html` directly, or use HTTP for installable offline support and service-worker testing.
- Mobile target: `360 x 740`, with the main page kept free of required vertical scrolling.
- Shared appbar: `54px` high; `Quicksand` `25px`/`700` title; `44 x 44` burger and info buttons set `12px` from the edges.
- Burger glyph: shared CSS three-bar mark, `18px` wide with `2px` strokes, so no app depends on a bold font glyph.
- Shared side menu: left drawer under the appbar; `min(76vw, 284px)` width; `16px` padding; pale `#f8fbff` surface; blue-grey border; card-style actions with small level dots.
- Appbar content colour: purple `#a855f7` on a black appbar.
- Favicon: current black-square app favicon with the app letter or letters centred.
<!-- APP-DOC-STATUS:END -->

_Last updated: 21/7/2026_

## Runtime

Static HTML, CSS and JavaScript.

Recommended local run:

```powershell
python -m http.server 8877
```

Review URL:

```text
http://127.0.0.1:8877/index.html?v=20260721-1
```

Use the query string for cache busting after edits.

## Bundled Dependencies

No runtime CDN requests are required.

- Inter and Quicksand are stored in `assets/fonts/`.
- The Font Awesome 5.15.4 solid font is stored locally with a minimal set of icon mappings in `styles.css`.
- `assets/fonts/FONT-AWESOME-LICENSE.txt` carries the bundled upstream licence.

No package install is required for Allan.

## Verification

Syntax:

```powershell
node --check referral-logic.js
node --check mcq-bank.js
node --check script.js
node --test tests/referral-logic.test.js
```

Browser:

- use Codex in-app browser
- test at `360 x 740`
- check console errors through browser tooling
- verify image-stage size and bottom referral panel still fit

## Important IDs

- `referencePreview`
- `userPreview`
- `userPreviewPlaceholder`
- `lesionLocation`
- `locationPickerButton`
- `locationPickerMenu`
- `skinToneToggle`
- `ABCDETab`
- `BVPDSTab`
- `DPICTab`
- `UVTab`
- `woodLampFinding`
- `resultPanel`
- `captureUploadStatus`
- `termInfoPopover`
- `holdExpandOverlay`
- `holdExpandTeachingToggle`
- `abcdeTeachingOverlay`
- `abcdeTeachingLegend`
- `bvpdsTeachingOverlay`
- `bvpdsTeachingLegend`
- `reportPreview`
- `reportText`

## Important Functions

- `openTab`
- `setReferencePreviewImage`
- `getReferenceImageSource`
- `getReferenceFallbackSource`
- `setUserPreviewImage`
- `updateCaptureRelevance`
- `toggleSkinTone`
- `handleDPICPatternChange`
- `openImageExpand`
- `closeImageExpand`
- `setTeachingMode`
- `generateReport`
- `getBVPDSFindings`
- `getReferralEvaluation` in `script.js` reads current DOM state and delegates to the pure evaluator
- `evaluateAssessment` in `referral-logic.js`
- `evaluateABCDE`, `evaluateDermoscopy`, `evaluateBccScc` and `evaluateRash` in `referral-logic.js`
- `hasCurrentDPICConcern`
- `hasCurrentDPICClinicalConcern`
- `hasWoodLampAssessment`
- `getReportRoute`
- `getReportPhotoSummary`
- `getImageFileValidationError`
- `copyReportText`
- `shareReportText`
- `updateRiskReferral`
- `selectLocationOption`
- `openTermInfoPopover`
- `closeTermInfoPopover`
- `toggleDermoscopyBucketDetail`
- `closeDermoscopyBucketDetails`

## Naming Notes

The UI says `Location` for the first capture button. The underlying variable is still `limbImage` and the capture type is still `limb`. This avoids broad renaming risk for now.

## Editing Notes

- Use `apply_patch` for manual edits.
- Keep visible text in British English.
- Avoid Oxford commas.
- Keep clinical copy GP-level.
- Do not use long explanatory text in the main UI; use info pop-ups.
- Keep image assets local and referenced by filename.
- Keep runtime fonts and icons local; do not reintroduce Google Fonts or Font Awesome CDN requests.
- Dermoscopy sidebar variants live in `dermoscopy-examples/` and use stable lowercase paired names: `chaos-clues-##_light.webp` and `chaos-clues-##_dark.webp`.
- Use the Codex in-app browser, not Chrome, for UI review.
- Bump the query string in `index.html` and README after browser-visible edits.
- Keep `BVPDSTab` and `bvpds` as internal names only; visible Dermoscopy copy should say Chaos + Clues.
- Keep `DPIC-R` as an internal rash teaching prompt unless explaining the rash route.
- Do not use the ABCDEFG or DPIC-R teaching totals as validated referral scores.
- Only JPEG, PNG and WebP uploads up to `12 MB` are accepted. Keep file-picker and drag-and-drop validation aligned. Keep originals as `File` objects and previews as revocable object URLs; do not reintroduce base64 storage.
- Keep `#woodLampFinding` as the source of truth for Wood's lamp report state; never infer use from `UVTab` being active.
- Preserve explicit empty options for rash selects so untouched defaults cannot enter assessment state or scoring.
- Keep route-specific reference fallbacks. Never use an ABCDEFG image as a fallback for Dermoscopy, Rash or Wood's lamp.
- Keep referral priorities, action labels and shared clinical logic copy in `referral-logic.js`.
- Run `npm test` after code or content changes and `npm run test:ui` after browser-visible, capture, reset, picker or offline changes.
- Offline asset changes require a service-worker cache-name increment and an app-contract test pass.
- Active WebP references are `960 x 960`; re-optimisation requires side-by-side visual checks.

## Refactor verification — 26 July 2026

- `node --check photo-file-store.js`
- `node --check script.js`
- `node tests/photo-file-store.test.js`
- `node tests/referral-logic.test.js`
- `node tests/mcq-bank.test.js`
- `node tests/app-contract.test.js`

The combined Node test command can encounter a Windows sandbox `spawn EPERM`; running the listed files directly exercises the same suites without changing the app.

## Short-screen fit verification — 26 July 2026

- Browser-visible assets and the service-worker cache use `20260726-fit1`.
- `e2e/allan.spec.js` opens every main route at Playwright's configured `360 x 740` viewport and asserts that the document does not exceed the viewport height.
- The direct-file check opens the Lesion route through `file://`, checks the same height contract and rejects console errors.
- The measured Lesion baseline was `744px`; the corrected route is no taller than `740px`.
- Run `npm test` and `npx playwright test` after any shell spacing, font or content-height change.

## MCQ audit verification — 26 July 2026

- Browser-visible MCQ files and the service-worker cache use `20260726-mcqquality1`.
- `tests/mcq-bank.test.js` protects counts, stable unique IDs, answer membership, explanations, source labels and pending clinical-review status.
- `e2e/allan.spec.js` protects the Primary MCQ unanswered guard, 5/5 marked review, five explanations, fresh retry and `44px` answer rows at `360 x 740`.
- `npm test`: 26 passed.
- `npm run test:ui`: six passed.
- Screenshot: `output/playwright/allan-mcq-primary-review-360x740.png`.
