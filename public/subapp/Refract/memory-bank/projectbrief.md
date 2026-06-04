# Project Brief

<!-- APP-DOC-STATUS:START -->

## Current Memory Status (18/5/2026)

- Static packaging: open `index.html` directly; a local HTTP server is optional for testing.
- Mobile target: `360 x 740`, with the main page kept free of required vertical scrolling.
- Shared appbar: `54px` high; `Quicksand` `25px`/`700` title; `44 x 44` burger and info buttons set `12px` from the edges.
- Burger glyph: shared CSS three-bar mark, `18px` wide with `2px` strokes, so no app depends on a bold font glyph.
- Shared side menu: left drawer under the appbar; `min(76vw, 284px)` width; `16px` padding; pale `#f8fbff` surface; blue-grey border; card-style actions with small level dots.
- Appbar content colour: off-white `#f5f8ff` on a blue appbar.
- Favicon: current black-square app favicon with the app letter or letters centred.
<!-- APP-DOC-STATUS:END -->

_Last updated: 18/5/2026_

## Purpose

Maintain a fast, static refraction support tool that helps clinicians estimate a likely final prescription from current Rx and objective Rx data while remaining easy to run locally and safe to refactor.

## Goals

- [x] Deliver a browser-only prescription calculation tool
- [x] Support both current and objective prescription entry for RE and LE
- [x] Provide age-based reading add guidance
- [x] Support simple and advanced data-entry modes
- [x] Keep the mobile layout compact enough for a `360x740` single-page view
- [x] Refactor the large JS files into smaller ES modules
- [x] Split the stylesheet into layered files
- [x] Unify signed-field rendering and value handling
- [x] Maintain project docs in `README.md` and `memory-bank/`
- [ ] Add automated checks for core calculation and UI regression behavior
- [ ] Decide whether the MCQ drawer should stay as shell UI or gain real behavior

## Objectives

- Keep startup and hosting friction near zero
- Preserve the current heuristic prescription rules in readable code
- Preserve the carefully tuned one-page mobile layout
- Make future UI changes safer by documenting layout constraints and module boundaries
- Keep sign handling and transpose logic explicit enough that they are hard to break by accident

## Deliverables

- Static UI with `Current`, `Objective`, and `Output` sections
- Top controls split into `Age`, `Patient`, and `Mode`
- Context toggles for `health?`, `precise`, `VA good`, and `accurate`
- Separate `advanced` mode control
- RE/LE sphere, cylinder, axis entry plus LE add input
- Rule-based output generation for sphere, cylinder, axis, and reading add
- Spinner-driven numeric entry with validation guardrails
- Shared signed-field system for input and output boxes
- App bar with info popup and MCQ drawer shell
- Root `README.md`
- `memory-bank/` project context files

## Success Criteria

- Users can enter prescription data quickly on touch devices and desktop browsers
- The main view remains usable in the baseline `360x740` mobile layout without vertical overflow
- Output updates immediately after any meaningful input change
- Calculation and sign behavior remain understandable after refactors
- New contributors can understand the current structure without reverse-engineering the whole app first

## Scope

**In Scope:**

- Static front-end UI
- Rule-based prescription calculation
- Touch-oriented numeric entry controls
- Lightweight project documentation
- Refactors that improve maintainability without changing the tool's clinical intent

**Out of Scope:**

- Backend persistence
- User accounts
- Server-side APIs
- Full EMR or optical workflow integration
- Large-screen dashboard redesigns that abandon the compact mobile-first layout

## Stakeholders

- Optometrists
- Ophthalmic clinicians and trainees
- Arclight collaborators
- Future maintainers of the Refract codebase
