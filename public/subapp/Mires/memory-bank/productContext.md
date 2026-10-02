# Product Context

## v1.1 boundary (23/7/2026)

Mires remains a teaching simulator rather than a patient assessment or diagnostic tool. `Reset` restores visual controls. The new two-step `New training session` restarts both exercises and simulator state while retaining the user-level MCQ achievement.

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

Users:

- Learners training slit-lamp tonometry basics.
- Trainers supervising mire alignment and endpoint technique.

User needs:

- Fast local startup with no build step.
- Clear visual feedback for endpoint alignment.
- Repeated exposure to low, mid, and high IOP cases.
- Simple in-app clinical reminders (Goldmann, NaFl, endpoint, globe pressure).
- Progressive MCQ checks focused on clinical principles, not app trivia.

Why this matters:

- Better endpoint consistency and interpretation confidence can improve real-world assessment quality.

## MCQ learner context — 26 July 2026

Learners need to recognise the correct endpoint, common artefacts and reasons to repeat a reading. Explanatory feedback should connect mire appearance to technique. A simulated endpoint or score is never a patient IOP. The EGS-reviewed fluorescein direction is now explicit, but full clinical approval remains pending.
