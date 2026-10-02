# System Patterns

## Protected end-stage output — 30 September 2026

The user explicitly requires C/D 0.9–1 to retain `END-STAGE` and the black final grid column. Keep structural status alongside emergency/referral advice. Reduced vision or abnormal pupils must retain their differential assessment cue without replacing END-STAGE or EMERGENCY. Do not alter point weights, grid mapping or referral timings without separate approval. This is the approved app rule, not independent clinical validation.

## Controller ownership (26/7/2026)

- Read questionnaire state once, calculate once and render that exact outcome.
- Preserve risk calculation as a pure engine concern. The controller owns DOM state and presentation.
- Rebuild `app.bundle.js` from source and require exact parity after controller or configuration changes.

## Safety patterns (25/7/2026)

- `risk-config.js` owns the non-overlapping pressure bands and action text.
- `risk-engine.js` owns the pure suspicious rim/field referral floor.
- `risk-calculator-controller.js` owns eye laterality and synchronised `aria-pressed` state.
- The controller exposes laterality as `data-eye` on the questionnaire. CSS mirrors only `.ratio-image` for `LE` and honours reduced-motion preference.
- Laterality is optional context rather than a calculation gate. The rock-hard warning also bypasses the ordinary C/D completion gate.
- `report.js` is a pure formatter. `report-controller.js` owns modal, copy, focus and Escape behaviour while `risk-calculator-controller.js` exposes only the most recent valid report data.
- Report availability follows calculated operational state and reset clears it without touching teaching progress.
- The risk output is a polite live region while the untouched output remains absent.
- Browser review bypasses service-worker caches and checks exact `360 x 740` page geometry.

## v1.1 Patterns (23/7/2026)

- `initRiskCalculator` exposes assessment reset without moving clinical logic into the shell.
- Native buttons replace clickable divs for ratio, disc and guide controls.
- Popup and MCQ controllers restore focus and support Escape. The MCQ modal contains Tab focus.
- Service-worker registration is HTTP(S)-only and cache deletion is restricted to `arclight-glaucoma-`.
- Runtime bundles are rebuilt with `npm run build`.

<!-- APP-DOC-STATUS:START -->

## Current Memory Status (18/5/2026)

- Static packaging: open `index.html` directly; a local HTTP server is optional for testing.
- Mobile target: `360 x 740`, with the main page kept free of required vertical scrolling.
- Shared appbar: `54px` high; `Quicksand` `25px`/`700` title; `44 x 44` burger and info buttons set `12px` from the edges.
- Burger glyph: shared CSS three-bar mark, `18px` wide with `2px` strokes, so no app depends on a bold font glyph.
- Shared side menu: left drawer under the appbar; `min(76vw, 284px)` width; `16px` padding; pale `#f8fbff` surface; blue-grey border; card-style actions with small level dots.
- Appbar content colour: bright green `#00ff3b` on a black appbar.
- Favicon: current black-square app favicon with the app letter or letters centred.
<!-- APP-DOC-STATUS:END -->

- Single-page static app (`index.html` + CSS import entrypoint + module entrypoint).
- Controllers handle DOM events/rendering:
  - `risk-calculator-controller`,
  - `popup-controller`,
  - `mcq-controller`.
- Pure engines own deterministic logic:
  - `risk-engine`,
  - `mcq-engine`.
- Data modules hold static configuration (`mcq-data`, `risk-config`).
- UI state remains local to each controller; no global framework/store.

Notable current patterns:

- `styles.css` imports modular CSS layers:
  - `styles/base.css`,
  - `styles/layout.css`,
  - `styles/components.css`,
  - `styles/responsive.css`.
- `risk-config` is the single source for:
  - scoring constants,
  - UI scoring explainer lines (`INFO_LOGIC_ITEMS`),
  - version label (`INFO_LOGIC_VERSION`).
- `popup-controller` renders the scoring explainer list/version dynamically from config.

## Maintenance pattern - 26 July 2026

Capture form inputs once per user event and pass that immutable snapshot to the pure risk engine. Render the returned decision once. Keep eye laterality as presentation context and do not let it change the risk score.

## MCQ data contract — 26 July 2026

Every question must have a stable `glaucoma-{tier}-{number}` ID, one best answer, a concise rationale, a known source key and matching review status. Question and option shuffling must preserve answer mapping. Manual submission rejects unanswered sets while timer expiry may grade unanswered items as incorrect. New set resamples the current tier without changing risk progress.
