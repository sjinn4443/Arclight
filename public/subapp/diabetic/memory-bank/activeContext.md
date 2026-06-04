# Active Context

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

## Current Focus

The project is in planning state. No app implementation exists yet.

The current task is to make the Diabetic app plan build-ready and align it with the existing Arclight app family.

## Accepted Product Decisions

- App name is `Diabetic`.
- Appbar is black.
- Title is red.
- Appbar icons are red.
- Focus is diabetic retinopathy only.
- Use `Arclight (DO)` and `Holo (BIO)` as equipment modes.
- Record dilation separately in the View panel and make the prompt prominent.
- Record both eyes with per-eye view, VA and findings.
- Record right and left VA plus right and left view directly in the View panel.
- Keep Practice in the side drawer with image cases and MCQs.
- Implement `Arclight (DO) | Holo (BIO)` as an Allan-style tablist with ARIA state and keyboard navigation.
- Use placeholder images until final images are supplied.
- Keep output as referral support, not diagnosis.
- Keep treatment choices out of the app.
- Use explicit default referral timescales: `Refer soon (2 weeks)` and `Urgent (today)`.
- Use `Routine referral when possible` for routine DR signs referral wording.
- Add a concise red-flags-win line to the popup.
- Do not duplicate mode switching in the drawer for the MVP.
- Keep local referral wording as constants first, not a visible settings screen.
- Use Fundal-style MCQs: Primary `16` bank / `5` round / `3` pass, Intermediate `26` / `6` / `4` and Advanced `26` / `8` / `6`.
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
- Fundal/Sauron: MCQ modal structure, level labels, sampled rounds and pass-mark display.
- Allan: real route-tab semantics, arrow-key navigation, shared tab rail, flatter inactive tabs and raised active tab.

Avoid:

- Refract-style numeric output confidence.
- large saturated drawer buttons.
- landing-page layout.
- long manual text in the popup.
- duplicate mode controls in the drawer.

## Next Build Step

When implementation starts:

1. Build static shell.
2. Add Allan-style `Arclight (DO) | Holo (BIO)` mode tablist and panels.
3. Add compact Right/Left eye switcher.
4. Add placeholder assets.
5. Add pure per-eye triage logic.
6. Add referral note generation.
7. Add drawer practice cases and MCQs.
8. Verify at `360 x 740`.
