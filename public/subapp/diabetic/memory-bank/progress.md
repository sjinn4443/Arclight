# Progress

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

## Current Status

v1 app review completed on 21/5/26. The app is built, image cases are wired, light and dark pigmentation support is available and final responsive checks have passed.

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
- Replaced the old routine DR assessment wording with `Routine (weeks)`.
- Clarified `Routine (weeks)`, `Soon (days)` and `Urgent (today)` boundaries.
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
- Defined and wired the final diabetic image case set.
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
- Implemented image practice cases in the drawer using final diabetic thumbnails.
- Implemented Primary, Intermediate and Advanced MCQ modals with sampled rounds and pass marks.
- Added data-test-friendly finding values and aria labels.
- Added inline favicon to avoid a local 404 console error.
- Fixed ungradable priority so an ungradable fellow eye with no higher-risk signs cannot become reassuring or routine by VA alone.
- Verified MCQ bank counts and answer indexes.
- Verified the app in browser at `360 x 740`.
- Renamed the recording system from `Assessment` to `Exam`.
- Replaced the Action `More` button with a compact `+` expander.
- Equalised RE/LE VA and View dropdown widths and reduced select text weight.
- Simplified findings dropdown labels to `Findings` for both RE and LE.
- Muted the canvas Temporal/Nasal labels to mid-grey.
- Audited MCQs so content stays clinical rather than app-navigation focused.
- Matched the MCQ modal to Fundal Reflex behaviour: scrolling questions, fixed green `Submit Test` button and question-card borders clear of the legend text.

## Not Started

- Local pathway wording customisation beyond the default v1 labels.
- Further image compression only if deployment size becomes a practical issue.

## Open Questions

- Local pathways may later customise `Soon (days)` and `Urgent (today)` wording. MVP should keep labels in constants.

## Implementation Risks

- The app could overclaim what Arclight (DO) can exclude.
- The flow could become too long for `360 x 740`.
- Drawer practice could accidentally blur into clinical mode.
- Mode switching could leave Holo-only area state active in Arclight (DO) if not handled explicitly.
- Red could dominate the UI if used for every DR item.
- Future asset replacement could cause layout shift if card dimensions are not fixed.

## Verification Completed

- Phone viewport `360 x 740`: main UI fits cleanly without unwanted horizontal overflow.
- Tablet portrait `768 x 1024`: stacked viewer and Exam layout checked.
- Tablet landscape `1024 x 768`: side-by-side viewer and Exam layout checked.
- Laptop `1366 x 768`: side-by-side layout checked.
- Browser interaction sweep: case switching, Skin, Holo, case information and reload all passed.
- Console: no errors in the final sweep.
- Lighthouse mobile: `90 / 100 / 100 / 100`.
- Lighthouse desktop: `100 / 100 / 100 / 100`.
- Appbar, drawer, quick guide, modal shells, referral note and findings guide align with the Fundal Reflex compact UI pattern.
- Triage spot checks: record-both-eyes, ungradable, routine, soon and urgent paths behave as intended.
- MCQ bank counts and answer indexes remain valid.
- MCQ sampled rounds and fixed submit layout were rechecked after the final audit.

## Verification Still Useful Later

- Visual review against final supplied clinical images.
- Manual comparison against Fundal Reflex once the user has reviewed the feel.
- Offline launch on the target device or deployment package.
