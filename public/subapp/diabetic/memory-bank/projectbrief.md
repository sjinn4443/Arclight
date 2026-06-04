# Project Brief

<!-- APP-DOC-STATUS:START -->

## Current Memory Status (18/5/2026)

- Static packaging: open `index.html` directly; a local HTTP server is optional for testing.
- Mobile target: `360 x 740`, with the main page kept free of required vertical scrolling.
- Shared appbar: `54px` high; `Quicksand` `25px`/`700` title; `44 x 44` burger and info buttons set `12px` from the edges.
- Burger glyph: shared CSS three-bar mark, `18px` wide with `2px` strokes, so no app depends on a bold font glyph.
- Shared side menu: left drawer under the appbar; `min(76vw, 284px)` width; `16px` padding; pale `#f8fbff` surface; blue-grey border; card-style actions with small level dots.
- Appbar content colour: red `#f04444` on a black appbar.
- Favicon: current black-square app favicon with the app letter or letters centred.
<!-- APP-DOC-STATUS:END -->

Last updated: 18/5/2026

## Purpose

Build **Diabetic**, a mobile-first Arclight mini app for diabetic retinopathy teaching and triage in LMIC, GP and primary-care settings.

The app supports users who have Arclight (DO) and may also have dilation and Holo (BIO) available. It helps them record view quality, recognise diabetic retinopathy signs and choose safe referral wording.

This is not a diagnostic grading calculator and not a replacement for a formal diabetic eye screening programme.

## Core Questions

The app should answer:

1. Can I see enough?
2. What diabetic retinopathy signs are present?
3. What action is safest?

## Product Goals

- Keep the first screen useful at `360 x 740`.
- Preserve the shared Arclight UI language from Fundal Reflex and the aligned apps.
- Support Arclight (DO) and Holo (BIO) workflows without splitting into separate apps.
- Record both eyes, with per-eye view quality, VA, area seen and findings.
- Record dilation as part of the View panel rather than as a separate mode.
- Make a small dilation yes/no reminder prominent because retinal assessment is often limited without dilation.
- Use the Cataract app compact VA dropdown pattern rather than a simple `VA reduced` tick.
- Use tick-boxes for BP, lipids and HbA1c so systemic optimisation is recorded.
- Make view quality a first-class decision.
- Keep ungradable and partial views safe.
- Help non-specialist users recognise DR signs, macula-risk and proliferative patterns.
- Generate a short referral note.
- Provide practice cases with placeholder images until final assets are supplied.

## Non-Goals

- No swollen-disc, cupped-disc, pale-disc, arterial occlusion or vein occlusion triage in this app.
- No OCT-based DMO diagnosis.
- No treatment selection such as anti-VEGF versus laser.
- No AI or photo grading.
- No claim that Arclight (DO) alone clears a diabetic retina.

## Deliverables

- Black appbar with red `Diabetic` title, red burger icon and red plain `i`.
- Fundal-style light side drawer.
- Compact Fundal-style quick guide popup.
- Arclight (DO)/Holo (BIO) accessible clinical tab system based on Allan's route tabs.
- Right/Left eye switcher for per-eye recording.
- View panel.
- Cataract-style right and left distance VA dropdowns.
- BP, lipids and HbA1c tick-boxes.
- Findings panel.
- Action/referral panel.
- Referral note generator.
- Placeholder image cards.
- Drawer practice with image cases and Primary, Intermediate and Advanced MCQs.
- MCQs with Primary, Intermediate and Advanced levels.
- MCQ bank targets: Primary `16`, Intermediate `26` and Advanced `26`.
- MCQ sampled rounds: Primary `5`, Intermediate `6` and Advanced `8`.
- MCQ pass marks: Primary `3/5`, Intermediate `4/6` and Advanced `6/8`.
- Deterministic triage logic in pure JavaScript.
- Memory bank and README kept current.

## Success Criteria

- The user can complete the main triage flow quickly on a slim phone.
- The main screen stays compact, with longer hints kept in the popup or drawer.
- The app records right and left VA plus right and left view directly in the View panel.
- Ungradable never outputs normal.
- Urgent proliferative signs in one eye override an ungradable fellow eye.
- An ungradable fellow eye blocks reassuring routine output when the other eye is merely clear.
- Partial view always uses cautious wording.
- Proliferative signs always trigger `Urgent (today)` referral wording.
- Macula-risk signs trigger `Refer soon (2 weeks)` wording without diagnosing DMO.
- DR signs without macula-risk or proliferative features use `Routine referral when possible`.
- Reduced or untestable VA contributes to macula-risk wording without diagnosing DMO by itself.
- VA thresholds are explicit and testable.
- BP, lipids and HbA1c tick-boxes are recorded but do not change retinal urgency.
- The output says routine diabetic eye screening is still required when no referable signs are seen.
- Arclight (DO) mode does not imply a full peripheral assessment.
- Holo (BIO) mode supports a four-quadrant sweep but only reports selected findings.
- Mode tabs expose correct tab semantics and keyboard navigation.
- Practice stays in the drawer and does not mutate the clinical Arclight/Holo state.
- Holo-only area states cannot persist as invalid Arclight (DO) states.
- Dilation check status, dilation status and reason if not dilated are visible in the View panel, Action panel and referral note.
- `No referable signs seen in view obtained` is mutually exclusive with lesion findings per eye.
- Placeholder images can be replaced later without layout shift.
- MCQs use the same quiet modal and side-drawer style as the other Arclight apps.
- MCQ content stays clinical and avoids treatment-choice questions.
