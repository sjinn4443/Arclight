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

Create an interactive educational tool that helps learners recognize and differentiate normal, suspicious, and definitely swollen optic discs through realistic interaction and assessment.

## Goals

- [x] Deliver a realistic interactive fundus viewer.
- [x] Provide guided and timed assessment modes.
- [x] Provide immediate scoring and feedback.
- [x] Improve accessibility for modal/menu keyboard navigation.
- [x] Add automated local checks for core logic and project integrity.
- [x] Add tiered progression for both MCQ and timed sets.
- [x] Add visible achievement reward for completing both advanced tiers.

### Objectives

- Teach recognition of disc swelling severity.
- Reinforce pattern recognition with progressive MCQ and timed recall.
- Maintain a lightweight app that runs in-browser without backend requirements.
- Motivate completion with a simple, local achievement and certificate flow.

### Deliverables

- Retina viewer with condition/FOV/eye controls and cataract simulation.
- Adaptive retina image assets for mobile vs larger screens, while preserving the same UI/interaction layout.
- Mobile-optimised cataract rendering path that preserves realism while reducing redraw cost.
- Desktop-only phone-size preview toggle for realism checks on laptop.
- MCQ module with `Primary/Intermediate/Advanced` tiers, tier-specific pools/timers/pass criteria.
- Timed recognition module with `Primary/Intermediate/Advanced` tiers and round-based scoring.
- Timed scoring safeguards that prevent impossible combinations (`Small 4deg` + dense cataract) in core timed tests.
- Timed anti-cheat behavior that avoids blocking dialogs and keeps countdown flow continuous.
- Cup achievement that unlocks when both advanced tiers are completed.
- Structured result exports (MCQ result + cup certificate text export).
- Smoke, unit, integration, and question QA scripts.

### Success Criteria

- Users can distinguish normal vs suspicious vs swollen discs with high confidence.
- Assessment scoring is correct and resilient to answer-pattern guessing.
- App remains usable on mobile-first layouts and larger screens.
- Cataract-on-phone interactions remain responsive without losing clinically useful patch visibility.
- Keyboard users can complete modal workflows without focus leaks.
- Progression and achievement states are clearly communicated in UI.

## Scope

**In Scope:**

- Canvas-based retina simulation and controls.
- Tiered MCQ and timed tests.
- Local progression and achievement persistence.
- Accessibility and responsive UI refinements.
- Local automated checks.

**Out of Scope:**

- Backend accounts, authentication, or cloud storage.
- Native mobile applications.

## Stakeholders

- Medical educators and ophthalmology trainers.
- Students and clinicians learning disc assessment.
- Arclight Project collaborators.
