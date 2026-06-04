# Project Brief

<!-- APP-DOC-STATUS:START -->

## Current Memory Status (18/5/2026)

- Static packaging: open `index.html` directly; a local HTTP server is optional for testing.
- Mobile target: `360 x 740`, with the main page kept free of required vertical scrolling.
- Shared appbar: `54px` high; `Quicksand` `25px`/`700` title; `44 x 44` burger and info buttons set `12px` from the edges.
- Burger glyph: shared CSS three-bar mark, `18px` wide with `2px` strokes, so no app depends on a bold font glyph.
- Shared side menu: left drawer under the appbar; `min(76vw, 284px)` width; `16px` padding; pale `#f8fbff` surface; blue-grey border; card-style actions with small level dots.
- Appbar content colour: red `#f03b2f` on a black appbar.
- Favicon: current black-square app favicon with the app letter or letters centred.
<!-- APP-DOC-STATUS:END -->

_Last updated: 18/5/2026_

## Purpose

Deliver a lightweight browser-based fundal reflex training tool where learners can:

- inspect bilateral reflexes carefully
- choose the closest visual case
- apply a few simple modifiers
- see a compact likely interpretation and referral speed

## Goals

- [x] Provide a clear left-right light-patch interaction
- [x] Keep both eyes visible for comparison
- [x] Build a 32-case visual teaching library
- [x] Add a visual case picker on the main stage
- [x] Split cases into Primary, Intermediate and Advanced fold-up sections
- [x] Add a Baby-mode case subset for the picker and case stepper
- [x] Add compact result interpretation
- [x] Add tiered MCQs
- [x] Add timed `Test me`
- [x] Add Baby-mode geometry
- [x] Add a first-screen `Dilated` larger-pupil option
- [x] Add a simpler Primary observation guide for beginners
- [x] Add Primary poor-view technique cases for looking away and upper lid blocking
- [x] Add a Learn handout layer that keeps the one-page visual sheet intact and links explanation panels back to practice cases
- [x] Tighten Baby-mode eye spacing so the canthus distance is visibly smaller
- [x] Refactor into a reusable local-app template with controller modules, split CSS and text-safe DOM rendering
- [x] Add subtle dynamic realism cues without pushing the eye model into uncanny realism
- [x] Align Cases and MCQ surfaces to an explicit rounding hierarchy

## Deliverables

- interactive dual-eye fundal reflex stage
- main-stage `Cases` modal with case snapshots
- Primary / Intermediate / Advanced case organisation, with hypermetropia and myopia in Intermediate only
- optional reference-photo modal for selected photographed cases
- observation guide with compact collapse/reopen behaviour and temporary anatomy-targeted replay highlights
- Primary observation guide using `Match`, `Bright`, `Straight`
- full grouped observation guide for Intermediate and Advanced cases using `Reflex`, `Geometry`, `Surface` and `Check`
- concise `Quick guide` popup with valid modal markup
- `Quick guide` popup dated `v1 - 18/5/2026`, with a fundal reflex definition first, including darker pigmentation, normal orange-yellow or blue-white reflexes and the Alan25 practical sequence, then `Basics`, compact `More detail`, short usage notes and a Learn handout path
- Learn modal with intact handout, cropped explanation panels, case links, PDF/WebP download and browser share fallbacks
- compact referral-first results section
- advanced controls for pupil, lid, cataract, iris, squint and nystagmus
- side-menu assessment tools styled as a light app-matched panel with small coloured level dots
- compact case-tier marker on the current `Cases` trigger
- tuned representational realism: subtle tear-film shimmer, floater drift, front-of-reflex media opacity, crescent clipping, beam brightness ramp, softened Gaze motion and nystagmus visibility effects
- reusable mobile UI style documented in `README.md` under `Reusable UI Style: "Fundal Reflex Look"`
- reusable local-app quality template documented in `README.md`, covering file shape, safe DOM rendering, CSS splitting, input discipline and verification
- conservative design-system token layer for colours, spacing, radii, motion, focus and tap targets

## Success Criteria

- learners can compare both eyes easily
- the closest-match case can be found visually, not only by name
- the `Cases` modal thumbnails should match the live rendered cases closely enough to trust for selection
- when photos exist, they should remain recognisably tied to the matching simulated case through clear camera cues
- the results box stays short and clinically useful
- the app remains usable at `360 x 740`
- the first view remains simple, with advanced depth progressively disclosed
- the first paint on mobile avoids black or pale stage flashes while preserving the loaded dark stage
- timed test rounds do not leak the answer before reveal
- dynamic motion should challenge visibility but should not read as lag, flashing or broken animation
- Baby mode keeps the case list focused on paediatric/screening-relevant cases
- Baby mode visibly narrows the eye spacing/canthus distance as part of the paediatric geometry
- Dilated mode provides a useful larger-pupil aperture without opening Advanced controls
- the corneal reflex remains diagnostically stable, with only a tiny light-driven positional response
- observation-guide highlights should support teaching by targeting the real feature location; Crescent should cover the pupil edge crescent, not the pupil centre
- Primary guide wording should stay beginner-facing and not introduce unnecessary technical labels
- Primary MCQs should stay beginner-facing, with plain visual wording and no advanced/app-navigation distractors
- the handout should stay almost word-free and shareable, with the app carrying the English explanation and practice links
- the app explanation should add concise depth to the sheet: dim light, calm patient, arm's-length comparison, brightness/colour/shape, move side to side then closer and normal variation wording that matches `Quick guide`
- design-system passes preserve the current app-bar height, colour palette, Quicksand title and Inter UI font
- rounding hierarchy is deliberate across Cases and MCQ: soft shells, medium section/action surfaces, tighter cards and tight nested interiors
- code-quality passes should preserve the template shape: small entrypoint, shared state, feature controllers, split CSS and no avoidable HTML-string injection

## Style Success Criteria

- The app should feel like a compact clinical teaching instrument, not a landing page.
- Main controls should be understandable on first glance.
- Visual complexity should be hidden until requested.
- White control surfaces should sit calmly above the dark stage.
- The dark stage should remain the main visual focus.
- Header utility icons should stay subtle; the info control is a plain red `i` rather than a circled mark.
- Interactive controls should have adequate tap regions and visible focus without visually shouting.
- Typography should be readable on mobile without oversized hero-style text.
