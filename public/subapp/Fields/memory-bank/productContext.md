# Product Context

<!-- APP-DOC-STATUS:START -->

## Current Memory Status (18/5/2026)

- Static packaging: open `index.html` directly; a local HTTP server is optional for testing.
- Mobile target: `360 x 740`, with the main page kept free of required vertical scrolling.
- Shared appbar: `54px` high; `Quicksand` `25px`/`700` title; `44 x 44` burger and info buttons set `12px` from the edges.
- Burger glyph: shared CSS three-bar mark, `18px` wide with `2px` strokes, so no app depends on a bold font glyph.
- Shared side menu: left drawer under the appbar; `min(76vw, 284px)` width; `16px` padding; pale `#f8fbff` surface; blue-grey border; card-style actions with small level dots.
- Appbar content colour: blue `#2f80ff` on a black appbar.
- Favicon: current black-square app favicon with the app letter or letters centred.
<!-- APP-DOC-STATUS:END -->

Last updated: 18/5/2026

`Fields` is a rapid confrontation visual-field interpretation support tool.

## Core User Goals

1. Enter bedside findings quickly.
2. Get a useful likely primary defect family.
3. See a short lesion-location clue.
4. See plausible alternatives for fuzzy or mixed patterns.
5. Keep the 360x740 mobile screen usable without tiny scroll changes.

## UX Intent

1. One-page flow with minimal friction.
2. Mobile-first touch targets and legible contrast.
3. Snappy output language.
4. Primary output should favour common and high-yield families.
5. Secondary output should retain uncertainty and overlap context.
6. Simple mode should avoid heavy specialist terms.
7. The UI should feel clinical and calm rather than busy.

## Current Main Page Hierarchy

1. Context is quiet and folded by default.
2. The visual field stage is the primary working surface.
3. Result is the primary answer and keeps enough reserved height to avoid jump.
4. Pathway is supporting explanation.
5. The raw state string is secondary and only appears through `Calc`.
6. Context should never be required before field entry; a normal screen with no context is a valid starting state.

## Current Clinical Output Policy

1. Prioritise common defect families for the main line.
2. Keep rarer or overlapping families in `Also:` with a maximum of 2 alternatives.
3. Use `Mixed/Unclassified` only when no safe named family fits.
4. Guard against overcalling via explicit policy and regression checks.
5. Use colour to separate severity:
   - green normal,
   - orange caution,
   - red urgent modifiers.
6. Red-flag context can make a normal field screen urgent; the field pattern label should still describe the field result.
7. Source-modifier hints should change likely anterior source where appropriate without moving posterior or chiasmal patterns away from their anatomical family.
8. Keep named conditions to the Classic 18; more labels would imply precision the 5-point test cannot support.
