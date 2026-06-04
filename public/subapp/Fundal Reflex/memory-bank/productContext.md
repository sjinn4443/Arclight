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

Learners need repeated, interactive practice looking carefully at fundal reflexes, not just reading condition names. The simulator should train observation first, then interpretation.

## Target Users

- medical students
- optometry trainees
- ophthalmology trainees
- clinical educators

## User Needs

- a simple way to compare both eyes at the same time
- a visual case picker, not just text labels
- case choices that look like the live stage, not abstract preview drawings
- optional real-photo references where they exist, without replacing the simulation
- a shareable, almost word-free handout that can work across languages
- plain English explanation in the app for what each handout image group is showing
- direct links from handout ideas into practice cases
- poor-view practice cases that teach repeat, adjust and ask-for-help before diagnosis
- a clear beginner scan for Primary cases:
  - match
  - bright
  - straight
- a fuller scan order for Intermediate and Advanced cases:
  - light
  - colour
  - shape
  - crescent
  - cornea
  - compare
- compact interpretation output after picking a case, with the referral action visible immediately
- a small number of meaningful modifiers
- quick MCQ and self-test loops

## Product Vision

A compact, mobile-usable fundal reflex teaching app that helps users:

- find the closest visual match
- look at the important features systematically
- attach a sensible likely interpretation and referral speed

## Current UX Direction

- jet-black app bar with red accents
- compact top controls with restrained rounding, neutral borders and softer shadows
- nested UI should use a deliberate radius hierarchy rather than repeating the same softness everywhere
- white/off-white clinical control cards over a quiet light page background
- dark olive/black stage with warm reflex/light cues
- observation guide near the top of the dark stage that can collapse to a small chevron
- Primary cases should show the beginner words `Match`, `Bright`, `Straight`, centred with simple colour emphasis: pale white, red and blue
- Intermediate and Advanced cases should show the grouped fuller guide: `Reflex` (`Light`, `Colour`), `Geometry` (`Shape`, `Crescent`), `Surface` (`Cornea`) and `Check` (`Compare`)
- reopening the observation guide runs a temporary teaching replay; green highlights should point to the actual anatomical feature, especially the crescent at the pupil edge
- main-stage case row with `Previous`, current case trigger and `Next`
- the current case trigger should show a compact Primary / Intermediate / Advanced tier marker so users can orient before opening `Cases`
- `Cases` as the main selector
- `Cases` modal cards should use real stage snapshots and preserve readable eye detail on mobile
- Primary cases should include poor-view technique practice for looking away and upper lid blocking, framed as `? Action: Repeat view / ask for help`
- `Cases` modal should open simple:
  - Primary cases open by default
  - Intermediate cases folded
  - Advanced cases folded
  - green, orange and red fold-up bars distinguish the levels
  - `Similar cases` collapsed
- `Filters` has been removed from `Cases`; level sections and Similar cases carry the navigation burden
- `Dilated` should remain a quick first-screen option for a larger pupil aperture
- Baby mode should reduce case choice to the tighter paediatric/screening-relevant subset and make the face geometry read as baby-like, including a smaller visible inner canthus/IPD distance
- camera icons should clearly signal optional real-photo references
- right-side `Adv` rail instead of a full-width advanced row button
- Advanced rows should use compact label + control layouts rather than stacked titles when possible
- Advanced rows may use very subtle colour tints and coloured labels, but no strong left-edge colour rail
- referral-first results box at the bottom of the page
- burger menu includes `Learn`, MCQs and `Test me` and should use the same light clinical theme as the main controls, with small dot accents only for Primary, Intermediate and Advanced level identity
- `Quick guide` popup should stay concise: define fundal reflex first, say why `fundal` is preferred over `red`, mention darker pigmentation and orange-yellow or blue-white normal reflexes, include the practical Alan25 sequence of dim light, calm patient, arm's-length comparison, equal brightness/colour/shape and moving side to side then closer, then `Basics` for `Match`, `Bright`, `Straight`, compact `More detail`, brief usage notes and a handout path
- Learn should keep the full one-page sheet visually intact and almost word-free, then use app panels for plain English explanation and practice links; the `Normal can vary` panel should match the `Quick guide` wording on darker pigmentation, orange-yellow or blue-white reflexes and bright/equal/round being reassuring
- the app-bar info control should stay visually light as a plain red `i`, not a circled icon
- phone startup should feel deliberate: no black flash, no pale wash-out and the loaded dark stage should be preserved
- the current app-bar height, colours, Quicksand title and Inter UI font are approved and should be preserved during quality passes
- the codebase itself should now act as a reusable template for future local teaching apps:
  - small entrypoint
  - one shared state object
  - feature controller modules
  - text-safe DOM rendering
  - split CSS by responsibility
  - local-server smoke checks before sharing
- design-system improvements should make the app more consistent and accessible without making it look redesigned
- dynamic eye realism should stay representational and educational: enough shimmer, drift, opacity layering, nystagmus and gaze movement to affect visibility, but not so much that the eyes feel uncanny or broken

## Reusable Style Lessons

If a future prompt asks to use the "Fundal Reflex look", copy these principles:

- start from tokens for colour, spacing, radii, motion, focus rings, shadows and tap targets
- mobile-first at `360 x 740`
- black/red identity in the header only, not across every panel
- compact clinical controls with subtle blue-grey borders
- restrained shadows and moderate radii
- softer radii for modal shells, the stage and the result panel, medium radii for section/action bars, tighter radii for cards and tighter still for nested media or option rows
- progressive disclosure for complexity:
  - core first
  - advanced folded
  - Intermediate and Advanced folded in the case picker
  - tools folded
  - referral first, details folded
- helper text can be italic where it acts as a cue (`Blue`, `Red`, `drag eyes`, `Compare`)
- beginner guide language should stay plain and low-load; prefer `Match`, `Bright`, `Straight` over technical labels on Primary cases
- Primary MCQ wording should also stay plain and low-load; avoid advanced disease-name distractors, technical labels such as `leucocoria` and app-navigation distractors
- MCQ question areas should feel like dense teaching cards, with selectable option rows that are clear but visually quieter than the cards
- avoid main-screen controls that appear inactive
- keep corneal reflex movement conservative: squint should read through the eye moving around a mostly stable light reflection, not through a wandering corneal dot
- do not let compact rows leave a large dead gap on the right
- modal close buttons should be light, not heavy square targets
- app-bar secondary icons should avoid heavy outlines when a plain red glyph is enough
- startup fallbacks should solve first-paint artefacts without changing the final loaded composition
- use state completeness as a quality check: default, pressed/hover where relevant, focus-visible, disabled/locked, selected/open and loading/hidden states
- use generated visual thumbnails where visual matching matters
