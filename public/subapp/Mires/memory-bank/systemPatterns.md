# System Patterns

<!-- APP-DOC-STATUS:START -->

## Current Memory Status (18/5/2026)

- Static packaging: open `index.html` directly; a local HTTP server is optional for testing.
- Mobile target: `360 x 740`, with the main page kept free of required vertical scrolling.
- Shared appbar: `54px` high; `Quicksand` `25px`/`700` title; `44 x 44` burger and info buttons set `12px` from the edges.
- Burger glyph: shared CSS three-bar mark, `18px` wide with `2px` strokes, so no app depends on a bold font glyph.
- Shared side menu: left drawer under the appbar; `min(76vw, 284px)` width; `16px` padding; pale `#f8fbff` surface; blue-grey border; card-style actions with small level dots.
- Appbar content colour: bright green `#00ff00` on a black appbar.
- Favicon: current black-square app favicon with the app letter or letters centred.
<!-- APP-DOC-STATUS:END -->

Architecture pattern:

- Static HTML/CSS/JS modules.
- App split into simulator runtime and MCQ domain.

Key modules:

- `simulator.js`: mire movement, drawer modes, scoring logic, case sampling.
- `mcq.js`: menu state, modal orchestration, test generation, scoring, persistence.
- `questions.js`: tier definitions and clinical question bank.
- `app.js`: startup wiring.

Mode/state pattern:

- `VARIABLE` mode:
  - Separation control enabled.
  - IOP reveals after centre + inner-edge lock.
- `NEWTON` mode:
  - Separation control hidden/disabled.
  - Point buttons (`20/25/30`) alter visual setup.
  - Estimate band selection drives scoring.

Scoring pattern:

- Newton estimate scoring:
  - `+/-2 mmHg` => Correct
  - `+/-3 mmHg` => Close
- Weight selection does not affect correctness.

Sampling pattern:

- Variable and Newton cases use bucketed, least-used selection to keep low/mid/high exposure balanced.

UI pattern:

- App bar with burger menu and info icon.
- App bar keeps Quicksand and the black/green Newton identity.
- Main UI uses an Inter-style font stack for readability.
- Left Newton drawer and right Variable drawer, mutually exclusive.
- Side menu for tier entry.
- Side menu uses light clinical surfaces with small Primary/Intermediate/Advanced tier dots.
- Modal overlays for instruction and MCQ execution.
- MCQ question and result rendering uses DOM/text construction rather than HTML string interpolation.
