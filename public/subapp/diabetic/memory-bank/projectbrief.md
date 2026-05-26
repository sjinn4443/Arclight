# Project Brief

<!-- APP-DOC-STATUS:START -->

## Current Memory Status (21/5/2026)

- v1 app review completed on `21/5/26`.
- Static packaging: open `index.html` directly; a local HTTP server is optional for testing.
- Main screen: image-led diabetic case practice viewer using the Swollen Discs draggable circular viewing engine.
- Case assets: ten expanded WebP diabetic cases in `assets/images/diabetic/`, with thumbnails plus light and dark pigmentation support.
- Viewer controls: `<` / `>` case navigation, icon-only case information, R/L orientation, Gaze, Dilated, Skin and full-width Adv controls for cataract blur and nystagmus.
- Arclight (DO): compact direct-view simulation.
- Holo (BIO): wider lens-style view; corneal reflection is hidden; field is `15 deg` undilated and `25 deg` dilated, and switching to Holo does not automatically switch Dilated on.
- Exam system: RE and LE VA, View, Findings and Action live in one separate compact Exam box below or beside the viewer.
- Findings: paired per-eye dropdowns are both labelled `Findings` and group no referable signs, DR signs, macula risk and proliferative signs with mini explanations.
- Action logic: outputs `Routine (weeks)`, `Soon (days)`, `Urgent (today)`, `Ungradable (repeat)` or `Record both eyes` using green, orange, red and neutral chips, with a compact `+` expander for details.
- Quick guide, side drawer, practice cases, findings guide and referral note follow the Fundal Reflex compact UI pattern.
- Quick guide popup shows `v1 21/5/26` at bottom right.
- MCQs are clinically audited across Primary, Intermediate and Advanced and use the Fundal-style modal with the scrolling question list and fixed `Submit Test` button.
- Final UI polish: equal-width VA/View selects, lighter select text and muted mid-grey Temporal/Nasal canvas labels.
- Responsive checks completed at `360 x 740`, `768 x 1024`, `1024 x 768` and `1366 x 768`.
- Latest Lighthouse: mobile `90 / 100 / 100 / 100`; desktop `100 / 100 / 100 / 100`.
- Shared appbar: `54px` high; `Quicksand` `25px`/`700` title; `44 x 44` burger and info buttons set `12px` from the edges.
- Favicon: black square with a centred red `D`.
<!-- APP-DOC-STATUS:END -->

Last updated: 21/5/2026

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
- Record dilation as a main control rather than as a separate mode.
- Make a small dilation yes/no reminder prominent because retinal assessment is often limited without dilation.
- Use the Cataract app compact VA dropdown pattern rather than a simple `VA reduced` tick.
- Use tick-boxes for BP, lipids and HbA1c so systemic optimisation is recorded.
- Make view quality a first-class decision.
- Keep ungradable and partial views safe.
- Help non-specialist users recognise DR signs, macula-risk and proliferative patterns.
- Generate a short referral note.
- Provide ten diabetic image cases with light and dark pigmentation support.

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
- Exam box with RE/LE VA and View.
- Cataract-style right and left distance VA dropdowns.
- BP, lipids and HbA1c tick-boxes.
- Paired `Findings` dropdowns.
- Compact Action/referral strip with `+` details expander.
- Referral note generator.
- Final diabetic image case cards and thumbnails.
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
- The app records right and left VA plus right and left view directly in the Exam box.
- Ungradable never outputs normal.
- Urgent proliferative signs in one eye override an ungradable fellow eye.
- An ungradable fellow eye blocks reassuring routine output when the other eye is merely clear.
- Partial view always uses cautious wording.
- Proliferative signs always trigger `Urgent (today)` referral wording.
- Macula-risk signs trigger `Soon (days)` wording without diagnosing DMO.
- DR signs without macula-risk or proliferative features use `Routine (weeks)`.
- Reduced or untestable VA contributes to macula-risk wording without diagnosing DMO by itself.
- VA thresholds are explicit and testable.
- BP, lipids and HbA1c tick-boxes are recorded but do not change retinal urgency.
- The output says routine diabetic eye screening is still required when no referable signs are seen.
- Arclight (DO) mode does not imply a full peripheral assessment.
- Holo (BIO) mode supports a four-quadrant sweep but only reports selected findings.
- Mode tabs expose correct tab semantics and keyboard navigation.
- Practice stays in the drawer and does not mutate the clinical Arclight/Holo state.
- Holo-only area states cannot persist as invalid Arclight (DO) states.
- Dilation status and reason if not dilated are visible in the main controls, Action panel and referral note.
- `No referable signs seen in view obtained` is mutually exclusive with lesion findings per eye.
- Final case images are wired through stable metadata and thumbnail assets.
- MCQs use the same quiet modal and side-drawer style as the other Arclight apps, with a scrolling question list and fixed `Submit Test` button.
- MCQ content stays clinical and avoids treatment-choice questions.
