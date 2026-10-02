# Product Context

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

## Problem Statement

Clinicians and trainees need repeated, practical exposure to optic disc appearances. Static teaching material does not provide enough interaction or immediate feedback for confident recognition of suspicious and definitely swollen discs.

## Target Users

- Medical students
- Ophthalmology trainees
- General practitioners
- Emergency clinicians

## User Needs

- Visual examples of normal, suspicious, and swollen discs
- Interactive controls that mimic real fundus viewing constraints
- Progressive self-assessment via tiered MCQ and timed recognition rounds
- Clear, immediate feedback with practical result capture
- Reliable mobile-first behaviour with centred single-column tablet/laptop layouts
- Fast enough image rendering on typical phones without changing core layout simplicity
- A laptop option to preview phone-scale viewer size for more realistic training setup checks
- Visible goals and rewards that encourage progression

## Product Vision

A lightweight browser tool that simulates fundus examination, supports rapid skill-building, and provides low-friction assessment without requiring backend infrastructure.

## User Experience Goals

- Fast startup and simple navigation
- Realistic, responsive retina viewing interaction
- Accessible keyboard flow in modal and menu interactions
- Actionable feedback after each assessment mode
- Explanatory MCQ feedback that states why the best answer is correct
- Clear progression:
  - `Primary` -> `Intermediate` -> `Advanced` in both MCQ and timed sets
  - Unlockable cup achievement when both advanced tiers are completed
  - Downloadable certificate with unique achievement code
- Maintain fair challenge design:
  - Very hard combinations (e.g., small pupil + dense cataract) stay available for exploration/training, not core timed scoring.
- Keep timed interactions fair:
  - Validation must never use blocking popups that can pause timed rounds.
- Keep instructions brief and practical:
  - UK-style wording, minimal text, clear unsafe-view/escalation guidance.

# v1.1 product context (23 July 2026)

The primary workflow remains condition comparison, FOV, cataract, eye orientation, canvas scanning and explanation, with MCQ and timed practice in the drawer. A separated two-press **New training session** action resets volatile training state by reloading the app. Engineering consistency does not validate the referral teaching text or imply clinical approval.

## MCQ learning model — 26 July 2026

MCQs are untimed source-labelled learning checks with rationales and fresh retry. The separate timed mode remains the speeded image-recognition exercise. This keeps knowledge feedback separate from perceptual timing pressure.
