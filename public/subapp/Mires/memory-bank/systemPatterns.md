# System Patterns

## Simulation scheduling (26/7/2026)

- Use one fixed-step RAF scheduler for the 100 ms training update.
- Pause while the document is hidden and stop on lifecycle cleanup.
- Keep band classification, tolerance scoring and training-lock transitions pure and independent of DOM timing.
- Rebuild the generated bundle and require exact parity.
- Anchor the viewport-filling stage to `100dvh`; do not depend on a percentage body height for the `340 × 656px` mobile contract.

## v1.1 patterns (23/7/2026)

- Modal and drawer focus is contained then restored to the opener.
- Session reset requires two presses within five seconds and reloads clean teaching state.
- `arclight-mires` offline caches are app-scoped and versioned.
- Local Node contracts protect Newton tolerances, balanced sampling markers, MCQ integrity, assets, ARIA and runtime locality.
- At `360 x 740`, the two mode launchers are equal `159 x 44px` controls separated by `10px`, with matching neutral surfaces and `12px` radii.
- Open mobile mode drawers use the fleet shell at `x=10`, `width=340`, `radius=16px`.
- The simulator game area remains `x=10`, `y=74`, `340 x 656`; the overlaid Controls surface is centred at `x=16`, `width=328` and uses `radius=16px`.

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

## Maintenance pattern - 26 July 2026

Keep Goldmann and Newton calculations pure and independent of rendering. Own simulation time in one fixed-step request-animation-frame scheduler, pause it when the page is hidden and make loop start idempotent.

App-bar information glyphs use the shared `21px` visible size inside a `44 x 44px` touch target. Keep the Mires green accent and do not resize the app bar to compensate.

Keep the Controls dock visually secondary to the simulator: at the mobile target it is centred at `328px`, uses the shared `16px` stage radius and retains compact internal spacing. Newton and Variable panels remain mutually exclusive and keep their established operational logic.

Newton panel controls use a `44px` minimum touch target, including the close control. Keep the three-column point and estimate structure, full-width estimate pills and `6px` grid gaps. At `360 x 740`, both untouched and completed Newton states must fit without internal scrolling.

Use `2px` colour-matched borders, squarer corners and subtle inset depth for Newton-point buttons. Keep estimate-button borders at `1px` so the two control roles remain visually distinct. The selected Newton point retains an additional inset emphasis.

## MCQ data contract — 26 July 2026

Preserve IDs `p1`–`p10`, `i1`–`i10` and `a1`–`a10`. Every question must have one best answer, rationale, known source and matching review status. Keep 5, 6 and 7-question attempts. Timer expiry may grade unanswered Advanced items as incorrect. Manual submission must reject an incomplete set. New set must resample the active tier.
