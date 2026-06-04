# Active Context

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

Current implemented state:

- Two training drawers are active:
  - Left: `Newton IOP`
  - Right: `Variable IOP's`
- Drawers are mutually exclusive and their toggles auto-hide when the opposite drawer is open.
- Variable mode uses centre + inner-edge lock to reveal IOP.
- Newton mode hides separation control and scores estimate bands with:
  - Correct: `+/-2 mmHg`
  - Close: `+/-3 mmHg`
- Newton weight choice (`20/25/30`) is visual aid only, not grading logic.
- Case generation is balanced across buckets to force broad low/mid/high practice.
- MCQ bank has been rewritten to be clinically Goldmann-focused.

Recent UX content changes:

- Info modal condensed to a short Goldmann quick guide.
- Result text simplified (`Correct` highlighted) and no weight-based fail reason.
- May 2026 Fundal-style discipline pass:
  - app bar keeps Quicksand, black and green Newton identity
  - main UI now uses an Inter-style font stack
  - side menu is a light clinical panel with small tier dots
  - side menu now follows the Fundal placement more closely, starts below the app bar and has an explicit close control
  - MCQ levels are directly available; the invented unlock/progress sidebar pattern has been removed
  - Quick Guide popup is a compact top-right panel rather than a centred modal; text content should remain stable unless copy is explicitly requested
  - Quick Guide now uses the beginner endpoint language `Centre / Touch / Steady`
  - Newton IOP drawer has a lighter Fundal-style panel treatment and calmer controls; result is judgement-first (`Correct`, `Close`, `Recheck`) with actual IOP second
  - stylesheet and module imports are cache-busted for local static serving
  - MCQ rendering no longer uses avoidable HTML string injection

Open considerations:

- Confirm final wording of Newton status/result labels.
