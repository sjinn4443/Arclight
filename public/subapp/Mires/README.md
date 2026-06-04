# Newton (Mires)

<!-- APP-DOC-STATUS:START -->

## Current Status (18/5/2026)

- Static packaging: open `index.html` directly; a local HTTP server is optional for testing.
- Mobile target: `360 x 740`, with the main page kept free of required vertical scrolling.
- Shared appbar: `54px` high; `Quicksand` `25px`/`700` title; `44 x 44` burger and info buttons set `12px` from the edges.
- Burger glyph: shared CSS three-bar mark, `18px` wide with `2px` strokes, so no app depends on a bold font glyph.
- Shared side menu: left drawer under the appbar; `min(76vw, 284px)` width; `16px` padding; pale `#f8fbff` surface; blue-grey border; card-style actions with small level dots.
- Appbar content colour: bright green `#00ff00` on a black appbar.
- Favicon: current black-square app favicon with the app letter or letters centred.
<!-- APP-DOC-STATUS:END -->

Newton is a browser-based training simulator for Goldmann split-prism mire alignment and IOP estimation practice.

## Core Features

- Mire movement with keyboard and touch input.
- Adjustable motion noise:
  - Jitter
  - Sudden shift
  - Drift
  - Mire thickness
- Blue-light / no-fluorescein visual toggle.
- Two training drawers:
  - `Variable IOP's` (right)
  - `Newton IOP` (left)
- MCQ learning path with three tiers:
  - Primary
  - Intermediate
  - Advanced
- All three MCQ tiers are directly available from the menu.

## Training Modes

### Variable IOP's

- Tier ranges:
  - Primary: `10-30 mmHg`
  - Intermediate: `8-40 mmHg`
  - Advanced: `8-60 mmHg`
- User aligns mires to centre and inner-edge touch.
- IOP is revealed after stable alignment lock.
- New cases are sampled with balanced low/mid/high spread for variety.

### Newton IOP

- Hidden IOP range: `10-50 mmHg` with broad case spread.
- User chooses a point weight (`20`, `25`, `30`) and an estimate band.
- Scoring is based on estimate selection:
  - Correct: within `+/-2 mmHg`
  - Close: within `+/-3 mmHg`
- Weight choice affects visual setup but is not used for correctness scoring.

## Controls

- `Arrow keys`: move mires.
- `R` / `F`: increase / decrease separation (Variable mode only).
- `Z` / `X`: zoom in / out.
- `Alt + Arrow Up/Down`: adjust jitter.
- `Alt + Arrow Right/Left`: adjust sudden movement.
- Touch:
  - One-finger drag to move.
  - Two-finger pinch to zoom.

## Run Locally

```powershell
py -m http.server 5500
```

Open `http://localhost:5500`.

## File Layout

- `index.html`: app shell, drawers, menu, modals and cache-busted local assets.
- `styles.css`: UI styling, typography tokens and responsive layout.
- `app.js`: startup wiring.
- `simulator.js`: simulator runtime, mode logic, scoring, sampling.
- `mcq.js`: MCQ menu, modal flow, timer and result handling.
- `questions.js`: MCQ tier config and question bank.
- `memory-bank/`: concise project context for handover.
