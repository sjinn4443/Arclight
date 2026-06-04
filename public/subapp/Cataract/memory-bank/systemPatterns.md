# System Patterns

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

## Architecture Pattern

- One-page static UI (`index.html`, `style.css`).
- Module entrypoint (`script.js`) boots `src/app.js`.
- Controllers by concern:
  - `cataract-controller` for clinical form state + rendering,
  - `mcq-controller` for 3-level MCQ flow,
  - `info-popup-controller` and `image-preview-controller` for focused UI behavior.
- Pure rule engine:
  - `cataract-engine` takes plain inputs and returns deterministic decision payloads.

## Progressive Unlock Pattern

1. Top minimum check (`onset + eyes + distanceVA`).
2. Fundal section unlock.
3. Back section unlock only after Fundal selection.
4. White/dense Fundal auto-sets Back to `poor view` and keeps Back locked.
5. Result section unlocks only if engine returns `hasResult = true`.

Lock state is applied through:

- section dim class,
- `aria-disabled`,
- disabling controls inside locked sections.

## Decision Precedence Pattern

1. Required-input gate.
2. White/back normalization.
3. Posterior disease override.
4. Fundal pathway (normal vs cataract-pattern).
5. Distance-VA severity modulation.
6. Age modifiers.
7. Exam/history safety modifiers.
8. Consistency/re-check warnings.
9. Urgency escalation.
10. Note policy and final output shaping.

## Consistency/Anomaly Pattern

- Contradictions add:
  - note codes,
  - `requires_recheck` flag,
  - `recheckFieldKeys` for targeted flashes.
- Current anomaly families include:
  - dense reflex with relatively good distance,
  - abnormal reflex with 6/6,
  - fix/follow in non-child age,
  - distance/near mismatch checks.

## Result Rendering Pattern

- Core action line (`Next Step`) is singular and short.
- Supporting `Check` notes are:
  - deduplicated against main action text,
  - capped by action colour severity.
