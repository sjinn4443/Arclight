# System Patterns

## Result-state hierarchy

Completed results use the compact label-and-score grid. Untouched results use the dedicated `is-unassessed` stacked layout so instructional text cannot collide with the state heading.

## v1.1 additions

- `scoring-engine.js`: browser/Node-compatible pure scoring data and functions
- `pwa.js`, `manifest.webmanifest`, `sw.js`: scoped offline application shell
- `tests/`: scoring boundaries, contracts and exact-device review

UI rendering consumes the pure engine. Copy/export remains downstream of the same calculated result.

<!-- APP-DOC-STATUS:START -->

## Historical Memory Status (18/5/2026)

- Static packaging: open `index.html` directly; a local HTTP server is optional for testing.
- Mobile target: `360 x 740`, with the main page kept free of required vertical scrolling.
- Shared appbar: `54px` high; `Quicksand` `25px`/`700` title; `44 x 44` burger and info buttons set `12px` from the edges.
- Burger glyph: shared CSS three-bar mark, `18px` wide with `2px` strokes, so no app depends on a bold font glyph.
- Shared side menu: left drawer under the appbar; `min(76vw, 284px)` width; `16px` padding; pale `#f8fbff` surface; blue-grey border; card-style actions with small level dots.
- Appbar content colour: black `#000000` on a red appbar.
- Favicon: current black-square app favicon with the app letter or letters centred.
<!-- APP-DOC-STATUS:END -->

## Architecture

- Single-page static app:
  - HTML for structure
  - CSS for styling/responsiveness
  - Vanilla JS for state/render logic

## Data Pattern

- `acuityMap` stores VA options with:
  - base score
  - outcome table values per category row
- `optionalFields` stores risk factor metadata and penalty values.
- `MCQ_LEVELS` stores tier configs, pass marks, and question banks.

## Calculation Pattern

- Event-driven recomputation (`change` on VA and checkboxes).
- Render calculated output through DOM/text construction downstream of `TraumaScoring`.
- Keep one source of truth for category thresholds in JS logic.

## UI Pattern

- Header app bar + two main cards:
  - input card
  - result card
- App bar identity is Trauma-specific:
  - black background
  - red Quicksand title
  - 54px height
- Current visual language copies the Fundal Reflex lessons:
  - mobile-first clinical density
  - off-white controls with blue-grey borders
  - light side menu actions with small level dots
  - restrained red accents outside the app bar
  - soft outer panels and tighter nested option rows
- Result card contains:
  - headline score row
  - outcome table
  - active plain-language category line
  - collapsible calculation details panel
  - copy/export action controls
- Sidebar contains tiered MCQ buttons.
- MCQ flow runs in modal:
  - random subset per tier
  - answer validation
  - pass/fail scoring + targeted feedback
- MCQ UI follows the Fundal hierarchy:
  - side-menu level rows use light cards with small coloured dots
  - modal shell is soft and scroll-contained
  - question cards use medium radii
  - option rows use tighter nested radii
  - submit is a green primary action
- MCQ bank pattern:
  - Primary uses plain core app concepts
  - Intermediate uses applied arithmetic and thresholds
  - Advanced uses scenario and boundary reasoning
  - answer options shuffle while preserving answer keys

## Responsiveness

- Global mobile-first styling.
- Specific compact adjustments in `@media (max-width: 420px)`.

## Rendering Pattern

- Prefer DOM construction, `textContent` and `replaceChildren` for dynamic visible UI.
- Avoid `innerHTML`, `outerHTML` and `insertAdjacentHTML` for app data.

## Maintenance pattern — 26 July 2026

- Keep static layout in `index.html` and modal/sidebar lifecycle in `shell-controller.js`.
- Load the shell controller after scoring and main behaviour scripts.
- Cache every new local runtime script in the app-scoped service-worker shell.

Use the section heading as the sole full label for dense mobile inputs. Dropdown placeholders and untouched guidance should be concise without repeating that heading.

MCQ records must retain a stable `trauma-{tier}-{NN}` ID, four distinct options, one valid `answerIndex`, a useful rationale, a known source key and explicit review status. Incomplete attempts must not grade. Completed attempts show result, correct and incorrect states, rationales and source status before retry. Keep this teaching layer separate from `TraumaScoring`.
