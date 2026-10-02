# Project Brief

## Approved safety amendment (25/7/2026)

Preserve the one-page workflow, images and bright-green identity. The approved safety amendment permits only these operational changes: non-overlapping IOP bands, optional laterality context, a suspicious rim/field referral floor and clearer end-stage action. The report may reproduce available findings and the calculated output but must not add clinical logic. Further clinical rule changes require separate approval and review.

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

Deliver a lightweight, one-page glaucoma risk calculator that is:

- fast on mobile,
- simple to use at point-of-care,
- transparent in how scores are derived,
- safe to maintain through modular logic and testable core calculations.

Current brief additions:

- Keep scoring and threshold rules visible in-app via the app-bar info popup.
- Treat `Rock` palpation as an explicit acute warning state.

## MCQ quality constraint — 26 July 2026

MCQs reinforce pressure, structure, field and uncertainty reasoning without redefining the calculator. Preserve 4, 5 and 7-question attempts, the Advanced timer and 44px answer rows. Do not use quiz content to imply that the app diagnoses glaucoma or that engineering review approves local referral timescales.
