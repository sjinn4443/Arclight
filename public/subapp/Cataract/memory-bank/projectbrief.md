# Project Brief

<!-- APP-DOC-STATUS:START -->

## Historical Memory Status (26/7/2026)

- Release: `v1.1`; conservative UI, offline hardening and focused safety refinement complete.
- Static packaging: direct-file basic use plus HTTP/HTTPS installable offline support.
- Mobile target: `360 x 740`, using one document scroll and no internal card scrolling.
- Shared appbar: `54px` high; `Quicksand` `25px`/`700` title; `44 x 44` burger and info buttons set `12px` from the edges.
- Burger glyph: shared CSS three-bar mark, `18px` wide with `2px` strokes, so no app depends on a bold font glyph.
- Shared side menu: left drawer under the appbar; `min(76vw, 284px)` width; `16px` padding; pale `#f8fbff` surface; blue-grey border; card-style actions with small level dots.
- Appbar content colour: orange `#ff8a00` on a black appbar.
- Favicon: current black-square app favicon with the app letter or letters centred.
- Preserve the established workflow and require explicit approval for clinical-routing changes.
<!-- APP-DOC-STATUS:END -->

Deliver and maintain a one-page cataract triage app that is:

- mobile-first and fast at point of care,
- clinically safer through strict rule precedence,
- simple for generalist use with compact controls,
- transparent about contradictions through targeted recheck notes/highlights,
- explicit about same-day urgency for sudden visual loss,
- careful not to treat blank findings as normal,
- reproducible through exhaustive deterministic audits.
