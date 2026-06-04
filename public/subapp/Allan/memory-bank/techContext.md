# Technical Context

<!-- APP-DOC-STATUS:START -->

## Current Memory Status (18/5/2026)

- Static packaging: open `index.html` directly; a local HTTP server is optional for testing.
- Mobile target: `360 x 740`, with the main page kept free of required vertical scrolling.
- Shared appbar: `54px` high; `Quicksand` `25px`/`700` title; `44 x 44` burger and info buttons set `12px` from the edges.
- Burger glyph: shared CSS three-bar mark, `18px` wide with `2px` strokes, so no app depends on a bold font glyph.
- Shared side menu: left drawer under the appbar; `min(76vw, 284px)` width; `16px` padding; pale `#f8fbff` surface; blue-grey border; card-style actions with small level dots.
- Appbar content colour: purple `#a855f7` on a black appbar.
- Favicon: current black-square app favicon with the app letter or letters centred.
<!-- APP-DOC-STATUS:END -->

_Last updated: 18/5/2026_

## Runtime

Static HTML, CSS and JavaScript.

Recommended local run:

```powershell
python -m http.server 8877
```

Review URL:

```text
http://127.0.0.1:8877/index.html?v=20260517-20
```

Use the query string for cache busting after edits.

## External Dependencies

Loaded from CDN in `index.html`:

- Google Fonts: Inter and Quicksand
- Font Awesome 5.15.4

No package install is required for Allan.

## Verification

Syntax:

```powershell
node --check mcq-bank.js
node --check script.js
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
- `resultPanel`
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
- `setUserPreviewImage`
- `updateCaptureRelevance`
- `toggleSkinTone`
- `handleDPICPatternChange`
- `openImageExpand`
- `closeImageExpand`
- `setTeachingMode`
- `generateReport`
- `getBVPDSFindings`
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
- Dermoscopy sidebar variants live in `dermoscopy-examples/` and use stable lowercase paired names: `chaos-clues-##_light.webp` and `chaos-clues-##_dark.webp`.
- Use the Codex in-app browser, not Chrome, for UI review.
- Bump the query string in `index.html` and README after browser-visible edits.
- Keep `BVPDSTab` and `bvpds` as internal names only; visible Dermoscopy copy should say Chaos + Clues.
- Keep `DPIC-R` as an internal rash teaching prompt unless explaining the rash route.
