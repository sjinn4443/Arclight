# Progress

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

## Current Status

First full static build completed and browser-checked locally.

## Completed

- Created `Diabetic/README.md`.
- Defined DR-only scope.
- Chose black appbar with red title and red icons.
- Defined Arclight (DO) and Holo (BIO) clinical modes.
- Defined dilation as a prominent View-panel state rather than a separate mode.
- Studied Allan's tab system and added real tab semantics for Arclight (DO)/Holo (BIO).
- Defined both-eye recording with per-eye view quality, VA, area seen and findings.
- Defined view quality, per-eye findings and action flow.
- Defined conservative referral categories.
- Replaced the old routine DR assessment wording with `Routine referral when possible`.
- Clarified `Routine referral when possible`, `Refer soon (2 weeks)` and `Urgent (today)` boundaries.
- Added Cataract-style compact right and left distance VA dropdowns to the plan.
- Added BP, lipids and HbA1c tick-boxes to the plan.
- Moved Practice out of the main clinical tab rail and into the side drawer.
- Added image-first practice plus MCQ practice plan.
- Added red-flags-win popup wording.
- Added diabetes/medical review prompt when routine diabetes care is not available.
- Fixed triage priority so proliferative signs in one eye override an ungradable fellow eye.
- Tightened routine-clear wording so both eyes must be adequate before reassuring output.
- Added explicit VA thresholds.
- Removed active-eye and per-eye summary chips; Findings now uses right and left dropdown summaries.
- Added mutual exclusivity for `No referable signs seen` and lesion findings.
- Removed drawer-mode duplication from the MVP plan.
- Defined placeholder image set.
- Added MCQ setup based on previous apps: Primary, Intermediate, Advanced, bank counts, sampled round sizes, pass marks and modal UI.
- Added full memory-bank structure.
- Created `index.html`, `styles.css`, `script.js` and `src/` modules.
- Implemented Fundal-style appbar, side drawer, info popup, modal pattern and compact panels.
- Added local Inter and Quicksand font files from the Fundal Reflex pattern; the appbar title uses Quicksand.
- Reworked the phone layout so the main clinical screen fits in one `360 x 740` viewport without page scrolling.
- Replaced long main-screen wording with compact labels and chips; longer text remains in guide, practice and referral note surfaces.
- Matched the Fundal Reflex appbar sizing more closely: fixed `54px` header, `44px` icon targets, Quicksand title and `21px` info glyph.
- Restyled the quick guide popup to the Fundal Reflex popover pattern.
- Rolled up the Action section by default and moved the referral note button into the expanded details.
- Implemented Allan-style `Arclight (DO) | Holo (BIO)` tabs with ARIA state and keyboard navigation.
- Implemented right/left eye recording, Distance VA dropdowns, right/left view dropdowns and right/left findings dropdowns.
- Simplified dilation to a Fundal Reflex-style `Dilated` switch, with non-dilated limitations in Action and referral note.
- Implemented action triage, referral-note modal and BP, lipids and HbA1c tick-boxes.
- Implemented placeholder image practice cases in the drawer using `assets/placeholders/fundus-placeholder.svg`.
- Implemented Primary, Intermediate and Advanced MCQ modals with sampled rounds and pass marks.
- Added data-test-friendly finding values and aria labels.
- Added inline favicon to avoid a local 404 console error.
- Fixed ungradable priority so an ungradable fellow eye with no higher-risk signs cannot become reassuring or routine by VA alone.
- Verified MCQ bank counts and answer indexes.
- Verified the app in browser at `360 x 740`.

## Not Started

- Replacement of placeholder images with final supplied clinical images.
- Local pathway wording customisation beyond the default MVP labels.

## Open Questions

- Local pathways may later customise `Refer soon (2 weeks)` and `Urgent (today)` wording. MVP should keep labels in constants.
- Final image naming once assets are supplied.

## Implementation Risks

- The app could overclaim what Arclight (DO) can exclude.
- The flow could become too long for `360 x 740`.
- Drawer practice could accidentally blur into clinical mode.
- Mode switching could leave Holo-only area state active in Arclight (DO) if not handled explicitly.
- Red could dominate the UI if used for every DR item.
- Placeholder replacement could cause layout shift if card dimensions are not fixed.

## Verification Completed

- Phone viewport `360 x 740`: no horizontal overflow in browser check.
- Phone viewport `360 x 740`: no vertical page scrolling in the main clinical screen.
- Main clinical screen: view, findings and action panels all fit without internal overflow in initial, refer-soon and urgent states.
- Appbar font: Quicksand verified in browser computed styles.
- Appbar/info sizing: `54px` header and `21px` info glyph verified in browser.
- Action section: default collapsed strip verified at `360 x 740`; referral note is hidden until `More` is opened.
- Quick guide popup: Fundal-style background, border, radius, shadow and compact text verified in browser.
- After rolling up Action, phone UI space was reallocated to larger tabs, headings, selects, checkboxes and findings chips while preserving the no-scroll `360 x 740` constraint.
- Moved the active Right/Left eye switch into the View heading, removed the duplicate equipment badge and changed view quality/area from chip groups to compact dropdowns.
- Appbar: black bar with red title verified by computed styles.
- Drawer: opens from burger button and shows image cases plus MCQ practice.
- Info popup: opens from the `i` button.
- Arclight (DO) and Holo (BIO): tab state verified.
- Holo (BIO): four-quadrant area option appears only in Holo mode.
- Both-eye safety: one adequate clear eye plus one ungradable eye outputs `Ungradable`.
- Red-flags-win: NVD in one eye outputs `Urgent (today)` and names the eye.
- Mutual exclusion: `No referable signs seen` clears selected lesion checkboxes.
- Referral note: includes right-eye, left-eye and systemic-check sections.
- MCQ: Primary MCQ opens from drawer and renders 5 questions.
- Console: no browser errors after favicon fix.
- Syntax: checked all JavaScript modules with `node --check`.
- MCQ data: Primary `16`, Intermediate `26` and Advanced `26` with valid answer indexes.

## Verification Still Useful Later

- Visual review against final supplied clinical images.
- Manual comparison against Fundal Reflex once the user has reviewed the feel.
- Offline launch on the target device or deployment package.
