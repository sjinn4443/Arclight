# Active Context

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

## Current Focus

The project is at v1 review state. The working app has been built, image cases are wired and the final sweep on 21/5/26 found no console errors. Current focus is now polish, clinical wording review and future local-pathway customisation rather than initial build planning.

## Accepted Product Decisions

- App name is `Diabetic`.
- Appbar is black.
- Title is red.
- Appbar icons are red.
- Focus is diabetic retinopathy only.
- Use `Arclight (DO)` and `Holo (BIO)` as equipment modes.
- Record dilation separately in the main control strip and make the prompt prominent.
- Record both eyes with per-eye view, VA and findings.
- Record right and left VA plus right and left view directly in the Exam box.
- Keep Practice in the side drawer with image cases and MCQs.
- Implement `Arclight (DO) | Holo (BIO)` as an Allan-style tablist with ARIA state and keyboard navigation.
- Use the ten expanded diabetic WebP case images with light and dark pigmentation support.
- Keep output as referral support, not diagnosis.
- Keep treatment choices out of the app.
- Use concise default urgency labels: `Routine (weeks)`, `Soon (days)`, `Urgent (today)` and `Ungradable (repeat)`.
- Use `Routine (weeks)` for routine DR signs referral wording.
- Add a concise red-flags-win line to the popup.
- Do not duplicate mode switching in the drawer for the MVP.
- Keep local referral wording as constants first, not a visible settings screen.
- Use Fundal-style MCQs: Primary `16` bank / `5` round / `3` pass, Intermediate `26` / `6` / `4` and Advanced `26` / `8` / `6`.
- Keep MCQ content clinical, not app-navigation or implementation focused.
- Use Cataract-style compact right and left distance VA dropdowns, not a simple `VA reduced` tick.
- Use BP, lipids and HbA1c tick-boxes as supportive checks.
- Use explicit VA thresholds for triage.
- Make `No referable signs seen` mutually exclusive with lesion findings per eye.
- Let proliferative signs override an ungradable fellow eye.

## Current Clinical Scope

In scope:

- view quality.
- right-eye and left-eye findings.
- dilation status.
- small dilation yes/no reminder.
- area seen.
- DR signs.
- macula-risk signs.
- proliferative signs.
- referral urgency.
- referral note.
- distance VA.
- systemic tick-boxes for BP, lipids and HbA1c.

Out of scope:

- swollen disc.
- cupped disc.
- pale disc.
- arterial occlusion.
- vein occlusion.
- glaucoma warnings.
- DMO confirmation.
- anti-VEGF versus laser choice.

## Current UI Direction

Borrow from:

- Fundal Reflex: appbar, quick guide, drawer, compact mobile layout and radius hierarchy.
- Swollen Discs: visual comparison cards and dark clinical viewing feel where image cards are used.
- Glaucoma: action panel and simple output style.
- Fields: red-flag override logic and referral note discipline.
- Sauron/Mires: practice/sweep training may borrow moving-exam ideas later.
- Fundal/Sauron: MCQ modal structure, level labels, sampled rounds, pass-mark display, scrolling question list and fixed submit button.
- Allan: real route-tab semantics, arrow-key navigation, shared tab rail, flatter inactive tabs and raised active tab.

Avoid:

- Refract-style numeric output confidence.
- large saturated drawer buttons.
- landing-page layout.
- long manual text in the popup.
- duplicate mode controls in the drawer.

## Next Build Step

Next useful work:

1. Review clinical copy and local pathway wording.
2. Tune image compression if deployment size becomes a real constraint.
3. Re-run the final browser and Lighthouse checks after any clinical or asset changes.
4. Keep the memory bank and README updated with dated decisions.
