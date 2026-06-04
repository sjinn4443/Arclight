# Active Context

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

## Current Focus

Keep the Cataract app one-page, mobile-fast, and clinically robust with deterministic audited logic.

## Confirmed Current State

- Active repo: `C:\Users\William\Desktop\Arclight App\Cataract`
- One-page UI preserved.
- Entry and modules preserved:
  - `script.js` -> `src/app.js`
  - clinical logic in `src/cataract-engine.js`
  - UI wiring in `src/cataract-controller.js`
- Top-section minimum for unlock is now:
  - onset selected
  - eyes selected (1/2)
  - Dist VA selected
- Progressive unlocking:
  - Fundal unlocks after top minimum
  - Back unlocks after Fundal selection
  - white/dense Fundal auto-forces Back `poor view` and keeps Back locked
  - Result unlocks only when engine returns result
- Locking now uses:
  - visual dim state
  - `aria-disabled`
  - real `disabled` controls in locked sections
- Top radios are clearable (click selected again).

## Recent Clinical/Logic Changes

- Added distance/near anomaly checks:
  - good distance + poor near (non-presbyopic) -> recheck warning
  - poor distance + good near -> recheck warning
- Added `near` to recheck highlight targeting.
- Kept existing contradiction checks for:
  - dense reflex + relatively good distance VA
  - abnormal reflex + 6/6
  - fix/follow with non-child age
- Check-note dedup remains active to reduce repetition.
- Result-output audit now enumerates complete UI-feasible combinations and checks visible `Cataract Type`, `Next Step` and `Check` text.

## Validation Snapshot

Latest `npm run audit` (2026-05-11):

- Acceptance: `26/26` passing
- Combination audit: no findings
- Result-output audit:
  - complete UI combinations `580,608`
  - unique visible Result panels `2,577`
  - findings `P0=0, P1=0, P2=0, P3=0`
- Full-state audit:
  - total states `7,558,272`
  - complete states `2,073,600`
  - complete+reachable `1,741,824`
  - findings `P0=0, P1=0, P2=0, P3=0`
- LMIC content audit: PASS
