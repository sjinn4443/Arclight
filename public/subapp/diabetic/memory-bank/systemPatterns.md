# System Patterns

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

## Architecture Overview

Client-side static web app using HTML, CSS and vanilla JavaScript.

Current structure:

```text
Diabetic/
  index.html
  styles.css
  script.js
  README.md
  memory-bank/
  assets/
    images/diabetic/
  src/
    state.js
    findings.js
    triage.js
    referral-note.js
    practice-cases.js
    mcq-data.js
    mcq.js
    ui-shell.js
```

## Key Technical Decisions

- Keep the app backend-free and offline-friendly.
- Keep `script.js` as a small entrypoint.
- Keep clinical triage logic in `src/triage.js`.
- Keep referral note formatting in `src/referral-note.js`.
- Keep finding metadata in `src/findings.js`.
- Keep practice cases separate from clinical state.
- Keep MCQ data separate from MCQ runtime.
- Use Fundal-style MCQ metadata: level title, pass mark, sampled question count and target bank size.
- Use Allan-style real tab semantics for `Arclight (DO) | Holo (BIO)`.
- Use deterministic logic rather than generative text.
- Reuse the Cataract app compact status-select pattern for distance VA.
- Use tick-boxes for BP, lipids and HbA1c.
- Use DOM construction and `textContent` for data rendering.
- Avoid avoidable `innerHTML`, `outerHTML` and `insertAdjacentHTML`.
- Use local diabetic WebP case assets with stable aspect ratios.
- Use local Inter and Quicksand font files; Quicksand 700 is required for the appbar title.

## UI Shell Pattern

Use the shared Arclight/Fundal Reflex shell:

- fixed black appbar.
- red `Diabetic` title.
- Quicksand appbar title font.
- Fundal-style `54px` appbar with `44px` tap targets and a `21px` info glyph.
- red burger icon on the left.
- plain red `i` on the right.
- light off-white side drawer.
- small coloured dots for mode or practice levels.
- compact quick guide popup.
- quick guide popup should use the Fundal popover pattern: pale surface, blue-grey border, `14px` radius, compact `0.78rem` body text and soft shadow.
- mobile-first single column.
- on the `360 x 740` working phone template, the main clinical screen must fit in one viewport without body scrolling.
- main-screen wording should be terse chips and abbreviations, with detailed text moved to popup, drawer, practice and referral note surfaces.
- Action is collapsed by default on the main screen; expanded details and the referral note button are secondary.
- progressive disclosure for guide and practice content.
- main screen owns `Arclight (DO) | Holo (BIO)` clinical mode switching.
- drawer owns practice image cases and MCQs.
- mode switching is an accessible tab system, not only a visual segmented control.
- drawer should not duplicate mode switching in the MVP.

## Component Pattern

Main panels:

1. `Viewer`: image case practice with viewing controls and advanced challenges.
2. `Exam`: RE and LE VA, View, Findings and Action in a separate compact recording system.
3. `Guides`: quick guide, findings guide, image case descriptions, MCQs and referral note modal.

User-facing clinical modes:

- `Arclight (DO)`
- `Holo (BIO)`

Dilation is recorded from the main control strip, not as its own mode.
Dilation should be prominent near the viewer. Holo (BIO) should make the non-dilated limitation visible and Arclight (DO) should record whether the view is dilated.

Dilation reminder pattern:

- Keep it short on the main screen.
- Record dilated status as `Yes / No`.
- If not dilated, show the limitation in the Action panel and referral note.
- Put detailed dilation teaching in the drawer guide.

Mode tab pattern:

- The mode rail uses `role="tablist"`.
- Each mode button uses `role="tab"`, `aria-selected`, `aria-controls` and roving `tabindex`.
- Each mode body uses `role="tabpanel"`, `aria-labelledby`, `tabindex="0"` and `hidden` when inactive.
- `ArrowLeft`, `ArrowRight`, `Home` and `End` move between mode tabs.
- Inactive tabs are flatter and the active tab is slightly raised.
- Practice is not in this tab rail.

Mode state rules:

- Arclight (DO) and Holo (BIO) share clinical findings state.
- Practice does not mutate clinical triage state and is opened from the drawer.
- Referral notes use clinical Arclight/Holo state only and never use the current drawer practice case.
- Arclight (DO) and Holo (BIO) have mode-specific `areaSeen` options.
- If Holo (BIO) `four-quadrants` is active for either eye and the user switches to Arclight (DO), reset that eye's `areaSeen` to a valid Arclight option or require a fresh selection.

Eye recording pattern:

- Record both right and left eyes.
- Record right and left VA plus right and left view directly in the Exam box.
- Record right and left findings through paired `Findings` dropdowns in the Exam box so the detailed sign list is hidden until needed.
- Store distance VA, merged view status and findings per eye.
- The merged view dropdown maps back to `viewQuality` and `areaSeen` for triage and referral notes.
- The Action panel uses the highest-risk eye first and names the eye in the reason text.
- Referral notes include separate right-eye and left-eye sections.

Arclight (DO) merged view options:

- Disc+mac.
- Post pole.
- Limited.
- Hazy.
- Ungradable.

Holo (BIO) adds `4 quad`. Arclight (DO) mode should not present four-quadrant sweep as an equivalent option.

Distance VA pattern:

- Use a compact `<select>` with the same visual treatment as Cataract's `compact-status-select`.
- Options: blank, `6/6`, `6/12`, `6/36`, `6/60`, `HM`, `No test`, `Fix/follow` and `No fix`.
- Store values as per-eye `distanceVA`.
- Label the control `Distance VA`.
- Reduced or untestable VA can support `Soon (days)` when DR or macula-risk context is present.
- VA should not diagnose DMO by itself.
- Referral notes should include right and left VA values.

VA thresholds:

- `6/6`: not a VA-risk trigger.
- `6/12`: mild reduction; record, but do not escalate by itself.
- `6/36`, `6/60`, `HM` and `No fix`: reduced VA trigger `Soon (days)` when DR signs or macula-risk context are present.
- `No test`: limitation; if DR signs are present, use `Soon (days)` rather than reassuring wording.
- `Fix/follow`: non-standard VA, but does not escalate by itself.

Systemic tick-box pattern:

- BP checked / optimise BP.
- Lipids checked / optimise lipids.
- HbA1c checked / optimise glucose control.
- These are supportive checks only and must not change retinal referral urgency.
- Referral notes should include checked and unchecked systemic items.

Finding groups:

- DR signs: green or neutral.
- Macula risk: orange.
- Proliferative signs: red.

Finding state rule:

- `No referable signs seen in view obtained` is mutually exclusive with all lesion findings per eye.
- Selecting any lesion clears `No referable signs seen`.
- Selecting `No referable signs seen` clears all lesion findings for that eye.

## Triage Priority Pattern

Triage each eye first, then derive one overall action. Ungradable or partial views must not override a higher-risk sign seen in either eye.

1. urgent proliferative signs in either eye: NVD, NVE, preretinal haemorrhage or vitreous haemorrhage.
2. macula-risk in either eye: hard exudates near macula, foveal concern or qualifying reduced/untestable VA with DR context.
3. DR signs in either eye without higher-risk features.
4. ungradable, partial or inadequate view with no higher-risk signs found.
5. no referable signs seen in both adequate views.

If one eye is ungradable and the other has proliferative signs, macula-risk or DR signs, use the sign-driven referral category and add the ungradable eye as a limitation note. If one eye is adequate and clear but the fellow eye is ungradable, use ungradable wording rather than a reassuring routine output. Reason text should list the selected trigger findings. Lower-priority findings can be shown as supporting detail.

## Safety Copy Pattern

Use these wording rules:

- Say `No referable signs seen in the view obtained`.
- Do not say `normal retina` from this app.
- Say `possible maculopathy`, not confirmed DMO.
- Say `Routine (weeks)` for DR signs without macula-risk or proliferative features.
- Say `Soon (days)` for macula-risk signs or concerning DR signs.
- Say `Urgent (today)` for possible proliferative diabetic retinopathy.
- Popup should include a tiny red-flags-win line: vitreous haemorrhage, preretinal haemorrhage, NVD or NVE means urgent today.
- Say `refer for retinal treatment assessment`, not treatment choice.
- Always include that routine diabetic eye screening remains required.
- Always include dilation status when it limits the view or referral note.
- Include VA and systemic tick-box status in referral wording where recorded.
- Include a medical review prompt when diabetes care is not available: `Arrange diabetes/medical review when possible, especially BP, lipids and HbA1c.`

Default timescale labels:

- `Routine (weeks)`.
- `Soon (days)`.
- `Urgent (today)`.
- `Ungradable (repeat)`.

Keep these labels in constants for the MVP. Do not build a visible local-protocol settings screen until there is a real local wording requirement.

## Drawer Practice Pattern

Levels:

- Primary: obvious normal versus DR signs.
- Intermediate: DR signs versus macula risk.
- Advanced: proliferative signs and ungradable views.

Practice cards use the final diabetic case thumbnails and open larger case descriptions. Keep captions short and image cards stable. Practice uses both image-first cases and MCQs, launched from the side drawer.

## MCQ Pattern

Use three levels:

- Primary.
- Intermediate.
- Advanced.

MCQ targets:

| Level        | Target bank size | Questions per round | Pass mark |
| ------------ | ---------------: | ------------------: | --------: |
| Primary      |               16 |                   5 |         3 |
| Intermediate |               26 |                   6 |         4 |
| Advanced     |               26 |                   8 |         6 |

MCQ UI:

- side drawer level buttons with small green, orange and red dots.
- light modal shell.
- title `{Level} MCQ`.
- intro `{n} questions. Pass mark {x}.`
- compact question cards.
- question-card borders must sit below the legend text, not through it.
- radio options.
- fixed green `Submit Test` button while the question list scrolls.
- result row hidden before submit.
- correct/wrong states after submit.

Question rules:

- keep Primary plain-language.
- Intermediate distinguishes DR signs from macula risk.
- Advanced tests proliferative signs, mixed-risk priority and referral wording.
- do not include app-navigation distractors.
- do not ask users to choose anti-VEGF versus laser.
- shuffle questions and answer options while preserving answer keys.
