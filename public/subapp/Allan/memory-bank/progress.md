# Progress

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

## Completed

- Copied Fundal Reflex visual language into Allan:
  - black app bar
  - red title
  - compact white panels
  - dark image stage
  - soft borders and muted controls
- Tuned for `360 x 740`.
- Added side menu and quick guide popup.
- Added capture row:
  - Location
  - Close
  - Dermoscopy
- Added custom location picker with icons.
- Added skin type toggle with explicit `Skin type` caption.
- Added tab system:
  - Lesion
  - Dermoscopy
  - Rash
  - Wood's lamp
- Added stable comparison image sizing.
- Added reference image switching by tab.
- Added light/dark reference switching for Lesion and Dermoscopy.
- Added rash reference switching by Pattern and skin type.
- Added user-image empty state.
- Replaced hold expansion with persistent enlarged image comparison and an `X` close control.
- Added expanded teaching overlays for:
  - Lesion
  - Dermoscopy
- Teaching legends are clickable and reuse the shared explanation pop-up.
- ABCDE-SU symptoms are handled as a separate note rather than an image callout.
- Removed the Dermoscopy teaching oval and kept numbered callouts only.
- Added low-key help icons and pop-ups for:
  - Lesion
  - Dermoscopy
  - Rash
  - Wood's lamp
- Changed visible wording so top tabs read `Lesion`, `Dermoscopy`, `Rash` and `Wood's`.
- Reworked Dermoscopy from the old internal BVPDS prompt to a Chaos + Clues teaching compression with chaos, colour, structure, edge growth, vessel / special site and exception rows.
- Kept `DPIC-R` as an Allan teaching prompt rather than a recognised formal score.
- Converted the route row into a compact real tab strip with ARIA tab semantics, arrow-key navigation, shared rail styling and a raised active tab.
- Removed the active-tab top accent bar and capped the site picker width to give the skin-type control more breathing space.
- Removed main comparison-stage `Reference` and `Your image` captions to save vertical space.
- Reviewed and fixed clinical wording:
  - Yellow-orange for Pityriasis versicolor
  - wider red flag wording
  - simpler atypical-vessel wording
  - asymmetry includes shape or colour
  - ABCDE-SU checklist items now start with their mnemonic letter where possible
  - Dermoscopy now uses chaos, malignant clues and exception rows
- Updated Dermoscopy referral logic:
  - chaos plus any clue maps to Susp cancer pathway (2 week wait)
  - dermoscopy exceptions map to Susp cancer pathway (2 week wait)
  - chaos alone prompts dermoscopy clue review
  - repeated Dermoscopy mini headings were replaced with row colour accents
- Added the Dermoscopy examples sidebar system with five light/dark image pairs in `dermoscopy-examples/`.
  - Dermoscopy bucket details now expand inline with chevrons instead of dense `i` popovers
  - expanded Dermoscopy bucket text now uses short GP-facing clinical reminders rather than repeated formal clue lists
- Added a side-menu Lesion teaching card that opens the light/dark ABCDE-SU card full-screen.
- Added a side-menu Dermoscopy teaching card that opens the light/dark Chaos + Clues card full-screen.
- Added a Lesion reference carousel with previous/next arrows and five paired light/dark variation images.
- Toned down the Report button.
- Replaced Report placeholder alert with a copy and share report modal.
- Restyled Report as a Fundal Reflex style pop-out with `Copy note` and `Share note + photos`.
- Added a temporary-textarea copy fallback for browsers that block direct clipboard writes.
- Report now includes photo readiness and logic notes.
- Fresh load and cleared criteria now show `Not assessed yet`.
- Untouched report sections now show `not assessed` rather than default prompt scores.
- Split MCQ question banks into `mcq-bank.js`.
- Added Primary, Intermediate and Advanced MCQ banks.
- Added star progression and an Allan cup certificate unlock after Advanced MCQ completion.
- Updated first capture label from `Limb` to `Location`.
- Created README and memory-bank docs.

## Recent Verification

- `node --check script.js` passes.
- `node --check mcq-bank.js` passes.
- Browser checks in the Codex in-app browser passed for:
  - location picker open and selection
  - `Location` capture label
  - user-image empty state
  - info pop-up fit
  - Rash dark skin layout
  - report blank state and report output
  - ABCDE-SU teaching overlay
  - Dermoscopy teaching overlay
- no console errors in recent flows

## Remaining

- Consider rash teaching overlays only if they remain morphology-based and do not imply diagnosis.
- Consider a quiet photo readiness cue near the Report button.
- Decide whether to rename `limbImage` and related internals to `locationImage`.
- Consider bespoke anatomy icons for the location picker.
- Consider keyboard arrow support for the custom location picker.
