# System Patterns

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

## Architecture Overview

Client-side static web app using HTML, CSS and vanilla JavaScript.

Planned structure:

```text
Diabetic/
  index.html
  styles.css
  script.js
  README.md
  memory-bank/
  assets/
    placeholders/
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
- Use local placeholder images first, with stable aspect ratios.
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

1. `View`: equipment, dilation, per-eye distance VA, view quality and area seen.
2. `Findings`: per-eye DR lesion picker grouped by risk.
3. `Action`: referral urgency, reason, systemic tick-boxes and referral note action.

User-facing clinical modes:

- `Arclight (DO)`
- `Holo (BIO)`

Dilation is recorded in the View panel, not as its own mode.
Dilation should be prominent in the View panel. Holo (BIO) should make the non-dilated limitation visible and Arclight (DO) should record whether the view is dilated.

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
- Record right and left VA plus right and left view directly in the View panel.
- Record right and left findings through compact dropdowns in the Findings panel so the detailed sign list is hidden until needed.
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
- Reduced or untestable VA can support `Refer soon (2 weeks)` when DR or macula-risk context is present.
- VA should not diagnose DMO by itself.
- Referral notes should include right and left VA values.

VA thresholds:

- `6/6`: not a VA-risk trigger.
- `6/12`: mild reduction; record, but do not escalate by itself.
- `6/36`, `6/60`, `HM` and `No fix`: reduced VA trigger `Refer soon (2 weeks)` when DR signs or macula-risk context are present.
- `No test`: limitation; if DR signs are present, use `Refer soon (2 weeks)` rather than reassuring wording.
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
- Say `Routine referral when possible` for DR signs without macula-risk or proliferative features.
- Say `Refer soon (2 weeks)` for macula-risk signs or concerning DR signs.
- Say `Urgent (today)` for possible proliferative diabetic retinopathy.
- Popup should include a tiny red-flags-win line: vitreous haemorrhage, preretinal haemorrhage, NVD or NVE means urgent today.
- Say `refer for retinal treatment assessment`, not treatment choice.
- Always include that routine diabetic eye screening remains required.
- Always include dilation status when it limits the view or referral note.
- Include VA and systemic tick-box status in referral wording where recorded.
- Include a medical review prompt when diabetes care is not available: `Arrange diabetes/medical review when possible, especially BP, lipids and HbA1c.`

Default timescale labels:

- `Routine referral when possible`.
- `Refer soon (2 weeks)`.
- `Urgent (today)`.
- `Ungradable`.

Keep these labels in constants for the MVP. Do not build a visible local-protocol settings screen until there is a real local wording requirement.

## Drawer Practice Pattern

Levels:

- Primary: obvious normal versus DR signs.
- Intermediate: DR signs versus macula risk.
- Advanced: proliferative signs and ungradable views.

Practice cards use placeholders first and later supplied images. Keep captions short and image cards stable. Practice uses both image-first cases and MCQs, launched from the side drawer.

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
- radio options.
- submit button.
- result row hidden before submit.
- correct/wrong states after submit.

Question rules:

- keep Primary plain-language.
- Intermediate distinguishes DR signs from macula risk.
- Advanced tests proliferative signs, mixed-risk priority and referral wording.
- do not include app-navigation distractors.
- do not ask users to choose anti-VEGF versus laser.
- shuffle questions and answer options while preserving answer keys.
