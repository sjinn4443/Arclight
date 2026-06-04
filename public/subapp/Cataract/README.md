# Cataract

<!-- APP-DOC-STATUS:START -->

## Current Status (18/5/2026)

- Static packaging: open `index.html` directly; a local HTTP server is optional for testing.
- Mobile target: `360 x 740`, with the main page kept free of required vertical scrolling.
- Shared appbar: `54px` high; `Quicksand` `25px`/`700` title; `44 x 44` burger and info buttons set `12px` from the edges.
- Burger glyph: shared CSS three-bar mark, `18px` wide with `2px` strokes, so no app depends on a bold font glyph.
- Shared side menu: left drawer under the appbar; `min(76vw, 284px)` width; `16px` padding; pale `#f8fbff` surface; blue-grey border; card-style actions with small level dots.
- Appbar content colour: orange `#ff8a00` on a black appbar.
- Favicon: current black-square app favicon with the app letter or letters centred.
<!-- APP-DOC-STATUS:END -->

Last updated: 18/5/2026

Browser-based, one-page cataract triage support app for fast mobile use.

## App Structure

- `index.html`: one-page UI.
- `style.css`: app styling.
- `script.js`: module entrypoint.
- `src/app.js`: app bootstrap.
- `src/cataract-engine.js`: pure decision logic.
- `src/cataract-controller.js`: DOM wiring and rendering.
- `src/mcq-controller.js`, `src/mcq-engine.js`, `src/mcq-data.js`: 3-level MCQ system.
- `src/info-popup-controller.js`: info popup behavior.
- `src/image-preview-controller.js`: long-press image enlargement.
- `src/storage-utils.js`, `src/dom-utils.js`: shared helpers.
- `qa-cataract-acceptance.mjs`: scenario acceptance + invariance checks.
- `qa-cataract-combination-audit.mjs`: exhaustive reachable-combo audit.
- `qa-cataract-result-output-audit.mjs`: visible Result text audit across UI-feasible combinations.
- `qa-cataract-full-audit.mjs`: exhaustive full cartesian audit.
- `qa-cataract-lmic-content.mjs`: LMIC language/content guardrails.
- Audit report `.txt` files are generated on demand and are not kept in the handover folder.

## Current Clinical Flow

- One-page, mobile-first flow.
- History captures:
  - onset (`gradual` / `sudden`)
  - eyes (`1` / `2`)
  - pain/redness (`Yes` if present; blank means not flagged)
  - age group (includes `adolescent 13-17`)
  - Dist VA (binoc) + Near VA
- BCVA options include:
  - `HM`
  - `No test`
  - `Fix+`
  - `Fix-`
- Exam flags are single-`Yes` toggles for speed:
  - pupils abnormal
  - front-eye scar/distortion
  - RAPD / poor light direction
- Progressive unlock:
  - Fundal unlocks after `onset + eyes + Dist VA`
  - Back unlocks after a Fundal selection
  - if Fundal is `Dense`/white, Back auto-sets to `Poor view` and stays locked
  - Result unlocks only when engine returns a complete decision
- White reflex still auto-forces `poor view` in Back of Eye.
- Result block is concise:
  - `Cataract Type`
  - `Next Step`
  - `Check` (up to 3 notes)
- Top radio options are clearable (click selected again to deselect).

## Decision Logic Summary

- Phenotype-first mapping:
  - `normal` -> Nil
  - `dark` -> Nuclear
  - `patches` -> Cortical
  - `spots` -> Subcapsular
  - `white` -> Mature
- Display confidence is layered onto phenotype (definite/probable/possible) without losing underlying phenotype.
- Posterior override precedence:
  - `detached` -> red posterior-first
  - `cupping` / `diabetic` -> orange posterior-first baseline (can escalate)
- Urgency and safety:
  - red urgent history trigger requires `sudden + pain`
  - gradual painful unilateral baseline is not auto-red without extra red triggers
  - sudden + pain + white-reflex routes to urgent same-day main action
- Neuro and competing-pathology behavior:
  - RAPD / poor light direction can route to non-cataract-first pathway
  - abnormal reflex + non-cataract-first pathway uses competing-pathology cataract confidence wording
- Assessment completeness:
  - minimal required inputs: onset, eyes, distanceVA, fundal, back
  - recheck highlighting is used for contradictory patterns and selected consistency checks
- Distance/Near mismatch checks:
  - good distance + poor near (non-presbyopic age bands) -> re-check
  - poor distance + good near -> re-check
- Note policy:
  - black: 0
  - green: <=2
  - orange: <=3
  - red: <=3 (near-VA notes suppressed)

## Automated Audits

Commands:

- `npm run audit`
- `node qa-cataract-acceptance.mjs`
- `node qa-cataract-combination-audit.mjs`
- `node qa-cataract-result-output-audit.mjs`
- `node qa-cataract-full-audit.mjs`
- `node qa-cataract-lmic-content.mjs`

Latest run (`2026-05-11`):

- Acceptance audit: `26/26` passing
- Reachable-state audit: no findings
- Result-output audit:
  - complete UI combinations `580,608`
  - unique visible Result panels `2,577`
  - findings `P0=0, P1=0, P2=0, P3=0`
- Full-state audit:
  - total `7,558,272`
  - complete `2,073,600`
  - complete + reachable `1,741,824`
  - findings `P0=0, P1=0, P2=0, P3=0`
- LMIC content audit: PASS

## Run Locally

- `python -m http.server 8080`
- open `http://127.0.0.1:8080`
