# Product Context

<!-- APP-DOC-STATUS:START -->

## Historical Memory Status (26/7/2026)

- Release: `v1.1`; focused safety refinement completed 26 July 2026.
- Static packaging: direct-file basic use plus HTTP/HTTPS installable offline support.
- Mobile target: `360 x 740`, with one document scroll and no internal card scrolling.
- Shared appbar: `54px` high; `Quicksand` `25px`/`700` title; `44 x 44` burger and info buttons set `12px` from the edges.
- Burger glyph: shared CSS three-bar mark, `18px` wide with `2px` strokes, so no app depends on a bold font glyph.
- Shared side menu: left drawer under the appbar; `min(76vw, 284px)` width; `16px` padding; pale `#f8fbff` surface; blue-grey border; card-style actions with small level dots.
- Appbar content colour: orange `#ff8a00` on a black appbar.
- Favicon: current black-square app favicon with the app letter or letters centred.
- The app keeps its orange identity and established one-page hierarchy.
- Independent clinical sign-off remains pending.
<!-- APP-DOC-STATUS:END -->

The Cataract app is a fast one-page triage/signposting tool for cataract-pattern findings versus urgent alternate pathology.

Primary user goals:

- complete key history/exam inputs quickly on mobile,
- get concise next-step guidance plus brief checks,
- avoid unsafe over-attribution of visual loss to cataract,
- identify urgent signals and contradictions early.

Current product intent:

- keep workflow simple (single-page, low tap count),
- require minimum high-value context for a completed assessment (`onset + eyes + age + eye VA`) while allowing early observed findings and urgent partial advice,
- distinguish blank safety checks from recorded normal findings,
- treat sudden visual loss and paediatric white reflex cautiously,
- preserve strict precedence (posterior override, urgency safeguards),
- show uncertainty via short recheck notes and field highlights,
- keep language plain and short for LMIC frontline use.

Design guardrails:

- no unnecessary extra modes/pages,
- compact labels for 360x740 phones,
- predictable deterministic outputs,
- exhaustive audit coverage for regressions.
