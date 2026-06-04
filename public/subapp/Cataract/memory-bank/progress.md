# Progress

<!-- APP-DOC-STATUS:START -->

## Current Memory Status (18/5/2026)

- Static packaging: open `index.html` directly; a local HTTP server is optional for testing.
- Mobile target: `360 x 740`, with the main page kept free of required vertical scrolling.
- Shared appbar: `54px` high; `Quicksand` `25px`/`700` title; `44 x 44` burger and info buttons set `12px` from the edges.
- Burger glyph: shared CSS three-bar mark, `18px` wide with `2px` strokes, so no app depends on a bold font glyph.
- Shared side menu: left drawer under the appbar; `min(76vw, 284px)` width; `16px` padding; pale `#f8fbff` surface; blue-grey border; card-style actions with small level dots.
- Appbar content colour: orange `#ff8a00` on a black appbar.
- Favicon: current black-square app favicon with the app letter or letters centred.
<!-- APP-DOC-STATUS:END -->

Last updated: 18/5/2026

## Completed

- Preserved one-page modular app structure.
- Kept MCQ system and info popup integrated with main page.
- Simplified display text in small selects:
  - Dist VA label now `Dist VA (binoc)`
  - age options display as short ranges
  - BCVA compact options (`No test`, `Fix+`, `Fix-`)
- Removed compact green-dot select indicator; selected values are now visible.
- Added clearable top radios (click selected option again to unset).
- Implemented robust progressive locking:
  - Fundal unlock requires onset + eyes + Dist VA
  - Back unlock requires Fundal selection
  - Dense/white Fundal auto-forces Back `poor view`
  - Result unlock depends on complete decision output
- Added lock hints and semantic disabled behavior (`aria-disabled` + real disabled controls).
- Added distance/near consistency checks:
  - good distance + poor near (non-presbyopic) -> recheck
  - poor distance + good near -> recheck
- Added near field into recheck highlight mapping.
- Reduced repetitive output notes with action-vs-note dedup filter.
- Simplified wording in Check/notes for plain-language outputs.
- Added visible Result-output audit over all complete UI-feasible combinations.

## Verification

Latest `npm run audit` (2026-05-11):

- `qa-cataract-acceptance.mjs`: `26/26` pass
- `qa-cataract-combination-audit.mjs`: no findings
- `qa-cataract-result-output-audit.mjs`: no findings
  - complete UI combinations `580,608`
  - unique visible Result panels `2,577`
- `qa-cataract-full-audit.mjs`: no findings (`P0=0, P1=0, P2=0, P3=0`)
  - total states `7,558,272`
  - complete states `2,073,600`
  - complete+reachable `1,741,824`
- `qa-cataract-lmic-content.mjs`: PASS

## Remaining Optional Refactor

- Split `src/cataract-controller.js` into:
  - `progressive-lock-state`
  - `result-renderer`
  - `interaction-handlers`
- This is optional; current code is stable and audited.
