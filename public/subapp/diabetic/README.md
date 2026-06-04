# Diabetic

<!-- APP-DOC-STATUS:START -->

## Current Status (18/5/2026)

- Static packaging: open `index.html` directly; a local HTTP server is optional for testing.
- Mobile target: `360 x 740`, with the main page kept free of required vertical scrolling.
- Shared appbar: `54px` high; `Quicksand` `25px`/`700` title; `44 x 44` burger and info buttons set `12px` from the edges.
- Burger glyph: shared CSS three-bar mark, `18px` wide with `2px` strokes, so no app depends on a bold font glyph.
- Shared side menu: left drawer under the appbar; `min(76vw, 284px)` width; `16px` padding; pale `#f8fbff` surface; blue-grey border; card-style actions with small level dots.
- Appbar content colour: red `#f04444` on a black appbar.
- Favicon: current black-square app favicon with the app letter or letters centred.
<!-- APP-DOC-STATUS:END -->

## Purpose

Diabetic is a compact Arclight mini app for diabetic retinopathy teaching and triage in LMIC, GP and primary-care settings.

The app supports users examining the fundus with Arclight (DO), a dilated Arclight view or Holo (BIO) where available. It should help the user decide whether the view is adequate, recognise diabetic retinopathy patterns and produce safe referral wording.

This is not a diagnostic grading calculator. It is a structured screening aid and teaching tool.

## Build Status

First full static build completed on 18/5/2026.

Run locally from `C:\Users\William\Desktop\Arclight App`:

```powershell
python -m http.server 8080
```

Open:

```text
http://127.0.0.1:8080/Diabetic/index.html
```

Implemented in this build:

- Fundal-style appbar, side drawer, info popup and modal shell.
- Fundal-style `54px` appbar with `44px` tap targets and a compact `21px` info glyph.
- Local Inter and Quicksand font files copied into `assets/fonts`, with Quicksand used for the appbar title.
- `Arclight (DO)` and `Holo (BIO)` clinical tab system.
- Both-eye recording with compact right/left VA, view and findings dropdowns.
- Dilation recorded with a Fundal Reflex-style `Dilated` switch.
- Action panel with `Routine referral when possible`, `Refer soon (2 weeks)`, `Urgent (today)` and `Ungradable`.
- Action section rolled up by default, with details and referral note opened from `More`.
- Referral-note preview with right-eye, left-eye and systemic-check sections.
- Drawer practice image cases using `assets/placeholders/fundus-placeholder.svg` until final images are supplied.
- Primary, Intermediate and Advanced MCQs with `16 / 26 / 26` question banks.

## Core Principle

The app should answer:

1. Can I see enough?
2. What diabetic retinopathy signs are present?
3. Does this person need referral and how urgently?

The app must never imply that a limited or ungradable view is normal.

## Critical Review And Scope Lock

The first draft was clinically sensible but too broad to act as a build contract. This version narrows the app to diabetic retinopathy only and makes the implementation rules explicit.

Keep in scope:

- DR screening support for Arclight (DO) and Holo (BIO) users, with dilation recorded prominently.
- view quality and field coverage.
- DR signs, macula-risk signs and proliferative signs.
- referral urgency and referral note generation.
- practice cases with placeholder images.

Keep out of scope:

- swollen disc triage.
- arterial or vein occlusion triage.
- glaucoma or pale-disc assessment.
- OCT-based macular oedema diagnosis.
- treatment selection such as anti-VEGF versus laser.
- AI or photo grading.

The app should feel like a practical triage tool with training support, not a formal diabetic eye screening programme replacement.

## Name And Identity

- App name: **Diabetic**
- Appbar: black
- Title colour: red
- Appbar icons: red
- Overall feel: Fundal Reflex shell with Swollen Discs-style comparison cards and Fields-style referral wording
- Working mobile target: `360 x 740`
- Main clinical screen target: visible in one `360 x 740` viewport without page scrolling.
- Main screen text should be terse chips and abbreviations; longer explanations belong in the popup, drawer, practice cards and referral note.

## Shared Arclight UI Pattern

Use the established app shell from Fundal Reflex and the recently aligned apps.

### Appbar

- Fixed top appbar, `54px` high.
- Black background.
- Left burger button.
- Centred title: `Diabetic`.
- Red title text.
- Right plain `i` info button.
- Buttons should be transparent, square `44px` tap targets and visually light.
- Keep title and icons aligned exactly across phone, tablet and desktop layouts.
- Use local `Quicksand` 700 for the appbar title, matching Fundal Reflex.
- Keep the right `i` glyph small and Fundal-like; it should not look like a large text button.

### Burger Side Menu

Use the Fundal-style light drawer.

- Opens from the left.
- Background: off-white or very pale blue.
- Right border: blue-grey.
- Soft shadow.
- Width: about `260-300px`, no wider than roughly `75-82vw` on small phones.
- Small uppercase section headings.
- Level/action cards with soft coloured dots.
- Avoid large saturated blocks.

Menu sections:

1. **Practice**
   - Image cases
   - Primary
   - Intermediate
   - Advanced

2. **Guide**
   - Dilate if safe
   - Arclight (DO) sweep
   - Holo (BIO) sweep
   - Lesion guide
   - Referral wording

3. **Settings**
   - About local referral wording

Practice belongs in the drawer in the MVP. It should not compete with the main clinical flow. The main screen owns only the clinical equipment switch between `Arclight (DO)` and `Holo (BIO)`.

### Info Popup

Use the compact Fundal-style quick guide.

- Opens below the `i` icon.
- Light surface.
- Border: blue-grey.
- Radius around `12-14px`.
- Soft shadow.
- Width: `min(calc(100vw - 20px), 420px)`.
- Must fit on `360 x 740` without feeling like a manual.
- Close button: small, soft hover/focus state, not heavy.

Suggested popup content:

- **Basics**: View, Findings, Action.
- **Dilate**: record Yes or No.
- **Signs**: MA, dot/blot haemorrhage, CWS, venous beading.
- **Urgent**: NVD, NVE, preretinal haemorrhage, vitreous haemorrhage.
- **Red flags win**: vitreous haemorrhage, preretinal haemorrhage, NVD or NVE means urgent today.
- Safety line: `No signs seen only means no referable signs seen in the view obtained. Routine diabetic eye screening is still required.`

### Main Layout

Mobile-first, single column.

Use three compact panels:

1. **View**
2. **Findings**
3. **Action**

Avoid a landing page. The first screen should be the working clinical flow.

Expected first-screen order at `360 x 740`:

1. Appbar.
2. Mode tab rail.
3. View panel.
4. Findings panel.
5. Action panel, visible or partly visible without a long scroll.

Use compact clinical panels, not marketing cards.

## App Modes

Use a compact tab rail near the top of the main screen:

`Arclight (DO) | Holo (BIO)`

### Mode Tab System

Borrow Allan's route-tab behaviour rather than treating the mode row as plain buttons.

- The mode row should be a `role="tablist"` with an accessible name such as `Assessment mode`.
- Each mode control should be a `role="tab"` button with `aria-selected`, `aria-controls`, an id and roving `tabindex`.
- Each mode body should be a `role="tabpanel"` with `aria-labelledby`, `tabindex="0"` and `hidden` when inactive.
- Support `ArrowLeft`, `ArrowRight`, `Home` and `End`.
- Use a shared tab rail, flatter inactive tabs and a slightly raised active tab.
- Keep Practice out of this rail. Practice is a drawer workflow with image cases and MCQs.
- Do not place a second clinical mode switcher in the drawer.

State rules:

- Arclight (DO) and Holo (BIO) share clinical findings state.
- Arclight (DO) and Holo (BIO) have mode-specific `areaSeen` options.
- If the user switches from Holo (BIO) to Arclight (DO) while either eye has `four-quadrants` selected, coerce that eye's `areaSeen` to a valid Arclight option such as `disc-macula` or ask the user to choose again.
- Referral notes are generated from the clinical state only, never from the current Practice case.

### Eye Recording

Record both eyes.

- Record right and left VA plus right and left view directly in the View panel.
- Record right and left findings through compact dropdowns in the Findings panel.
- Distance VA, merged view status and findings are recorded per eye.
- The merged view dropdown maps back to stored `viewQuality` and `areaSeen` values for triage and referral notes.
- The Action panel should show the highest-risk eye first and name the eye in the reason text.
- If both eyes have the same priority, list both briefly.
- The referral note should include right-eye and left-eye sections.
- Keep the eye switcher separate from the equipment tab rail.

### Dilation Reminder

Use a small checklist or reminder, not a long safety lesson.

- Dilated: `Yes / No`.
- Keep dilation as a single compact yes/no field on the main screen.
- If not dilated, show the limitation in the Action panel and referral note.
- Holo (BIO) should visibly prompt dilation before the user records the view.
- Keep detailed dilation teaching in the drawer guide, not on the main screen.

### Arclight (DO) Mode

For Arclight (DO) users.

Dilated Arclight is handled as Arclight (DO) mode with the `Dilated` switch on.

Questions:

- `Dilated` Fundal Reflex-style switch.
- Right and left distance VA dropdowns using the Cataract app compact select pattern.
- View dropdown:
  - Disc+mac
  - Post pole
  - Limited
  - Hazy
  - Ungradable
- Do not offer `Four-quadrant sweep` in Arclight (DO) mode. That belongs to Holo (BIO).
- Findings:
  - no referable signs seen in view obtained
  - microaneurysms
  - dot/blot haemorrhages
  - cotton-wool spots
  - venous beading
  - hard exudates near macula
  - possible foveal involvement
  - new vessels at disc
  - new vessels elsewhere
  - preretinal haemorrhage
  - vitreous haemorrhage

### Holo (BIO) Mode

For users with Holo (BIO) or similar.

Questions:

- `Dilated` Fundal Reflex-style switch, with Holo (BIO) limitation wording when off.
- Right and left distance VA dropdowns using the Cataract app compact select pattern.
- View dropdown:
  - 4 quad
  - Disc+mac
  - Post pole
  - Limited
  - Hazy
  - Ungradable
- Findings use the same DR list as Arclight (DO) mode.
- Holo (BIO) mode should emphasise dilation, peripheral sweep and proliferative signs.

### Drawer Practice

Practice should teach recognition without affecting the clinical output. It lives in the side drawer, not as a main clinical tab.

Levels:

- **Primary**: normal versus obvious DR signs.
- **Intermediate**: DR signs versus macula risk.
- **Advanced**: proliferative signs and ungradable cases.

Use both image-first cases and MCQ cases. Use placeholder images initially.

### VA And Systemic Checks

Use the Cataract app's compact status-select pattern for VA rather than a plain `VA reduced` tick.

Distance VA controls:

```html
<select
  id="rightDistanceVA"
  name="rightDistanceVA"
  class="compact-status-select"
  aria-label="Right distance VA"
>
  <option value=""></option>
  <option value="6/6">6/6</option>
  <option value="6/12">6/12</option>
  <option value="6/36">6/36</option>
  <option value="6/60">6/60</option>
  <option value="HM">HM</option>
  <option value="unable_test">No test</option>
  <option value="fix_follow_good">Fix/follow</option>
  <option value="fix_follow_poor">No fix</option>
</select>

<select
  id="leftDistanceVA"
  name="leftDistanceVA"
  class="compact-status-select"
  aria-label="Left distance VA"
>
  <option value=""></option>
  <option value="6/6">6/6</option>
  <option value="6/12">6/12</option>
  <option value="6/36">6/36</option>
  <option value="6/60">6/60</option>
  <option value="HM">HM</option>
  <option value="unable_test">No test</option>
  <option value="fix_follow_good">Fix/follow</option>
  <option value="fix_follow_poor">No fix</option>
</select>
```

Implementation notes:

- Keep the compact visible-value style from Cataract, including the small chevron and short labels.
- Label the field `Distance VA`.
- Record right and left distance VA separately.
- Derive the worse-eye VA for action priority and short summary text.
- Use reduced or untestable VA as a macula-risk clue, but do not diagnose DMO from VA alone.
- Record both VA values in the referral note.
- Highlight the relevant eye's VA in the Action reason when it contributes to `Refer soon (2 weeks)`.

VA action thresholds:

- `6/6`: not a VA-risk trigger.
- `6/12`: mild reduction; record and mention if useful, but do not escalate by itself.
- `6/36`, `6/60`, `HM` and `No fix`: reduced VA triggers `Refer soon (2 weeks)` when DR signs or macula-risk context are present.
- `No test`: treat as a limitation; if DR signs are present, use `Refer soon (2 weeks)` rather than reassuring wording.
- `Fix/follow`: record as non-standard VA, but do not escalate by itself.

Systemic checks should be tick-boxes, not only reminder text:

- BP checked / optimise BP.
- Lipids checked / optimise lipids.
- HbA1c checked / optimise glucose control.

Keep these as supportive safety prompts. They should appear in the Action panel and referral note, but they should not change the retinal referral urgency.

If there is no diabetes review or primary-care review available, include a short medical review prompt:

`Arrange diabetes/medical review when possible, especially BP, lipids and HbA1c.`

## MCQ Setup

Use the established Arclight tiered MCQ pattern from Fundal Reflex and Sauron, adapted to DR.

### Levels

- **Primary**
- **Intermediate**
- **Advanced**

All levels should be available in the MVP. Do not lock levels at first; completion stars or unlocking can be added later if useful.

### Bank Sizes And Round Size

Use these target bank sizes:

| Level        | Target bank size | Questions per round | Pass mark |
| ------------ | ---------------: | ------------------: | --------: |
| Primary      |               16 |                   5 |         3 |
| Intermediate |               26 |                   6 |         4 |
| Advanced     |               26 |                   8 |         6 |

These match the robust Fundal Reflex pattern: enough spare questions for variation while keeping each round short.

### MCQ UI

MCQs open from the side drawer `Practice` section.

Drawer buttons:

- Primary: soft green dot/card.
- Intermediate: soft orange dot/card.
- Advanced: soft red dot/card.

Modal pattern:

- white/light shell.
- title: `Primary MCQ`, `Intermediate MCQ` or `Advanced MCQ`.
- intro line: `{n} questions. Pass mark {x}.`
- compact question cards.
- radio-button answer options.
- submit button.
- result row hidden until submit.
- close button using the same soft popup/modal close treatment as the other apps.

After submit:

- disable answered options.
- mark correct and wrong answers.
- show `Score x/n. Pass.` or `Score x/n. Review and retry.`
- show missed topics briefly, not a long explanation wall.

### MCQ Content Progression

Primary should stay beginner-facing:

- view quality basics.
- `No referable signs seen in the view obtained`.
- ungradable is not normal.
- basic DR signs: MA, dot/blot haemorrhages, CWS.
- obvious urgent signs in plain wording.

Intermediate should build clinical sorting:

- DR signs versus macula risk.
- hard exudates near macula.
- reduced or untestable VA from the dropdown as a macula-risk clue.
- Arclight (DO) versus Holo (BIO) limitations.
- when to use `Routine referral when possible` versus `Refer soon (2 weeks)`.

Advanced should test triage priority:

- NVD and NVE.
- preretinal and vitreous haemorrhage.
- mixed findings where the highest-risk sign wins.
- `Urgent (today)` wording.
- referral note wording.
- systemic tick-boxes: BP, lipids and HbA1c.

Do not use app-navigation distractors. Do not test treatment choice such as anti-VEGF versus laser.

### MCQ Data Contract

Planned files:

```text
src/mcq-data.js
src/mcq.js
```

`src/mcq-data.js` should export:

```js
export const MCQ_LEVEL_META = {
  primary: {
    title: "Primary",
    passMark: 3,
    questionCount: 5,
    targetBankSize: 16,
  },
  intermediate: {
    title: "Intermediate",
    passMark: 4,
    questionCount: 6,
    targetBankSize: 26,
  },
  advanced: {
    title: "Advanced",
    passMark: 6,
    questionCount: 8,
    targetBankSize: 26,
  },
};
```

Question shape:

```js
{
  question: '...',
  options: ['...', '...', '...', '...'],
  answer: 0,
  topic: 'view-quality'
}
```

Rules:

- four options per question unless there is a strong reason otherwise.
- `answer` must be a valid option index.
- shuffle question order and answer option order while preserving answer keys.
- keep question text short enough for `360 x 740`.
- keep Primary plain-language.

## DR Findings Model

### Non-Proliferative Signs

Use green or neutral accenting.

- MA: microaneurysms
- D/B: dot/blot haemorrhages
- CWS: cotton-wool spots
- VB: venous beading

Output: usually `Routine referral when possible` or `Refer soon (2 weeks)` if widespread or concerning.

### Macula Risk

Use orange accenting.

- hard exudates near macula
- suspected foveal involvement
- reduced or untestable distance VA from the dropdown

Output: `Refer soon (2 weeks) for possible maculopathy`.

Do not diagnose diabetic macular oedema without OCT or stereoscopic assessment.

### Proliferative Signs

Use red accenting.

- NVD: new vessels at disc
- NVE: new vessels elsewhere
- PR-H: preretinal haemorrhage
- Vit H: vitreous haemorrhage

Output: `Urgent (today) referral for possible proliferative diabetic retinopathy`.

Do not include treatment choices such as anti-VEGF versus laser. Use `Refer for retinal treatment assessment`.

## Action Logic

The output should be safe and conservative.

Implement the triage logic as deterministic pure functions so it can be tested without the DOM.

Suggested state shape:

```js
const state = {
  mode: "arclight-do", // arclight-do | holo-bio
  dilation: "yes", // yes | no | unknown
  systemicChecks: {
    bp: false,
    lipids: false,
    hba1c: false,
  },
  eyes: {
    right: {
      distanceVA: "", // '', 6/6, 6/12, 6/36, 6/60, HM, unable_test, fix_follow_good, fix_follow_poor
      viewQuality: "clear", // clear | partial | hazy | ungradable
      areaSeen: "disc-macula", // posterior-pole | disc-macula | four-quadrants | limited
      findings: {
        noReferableSignsSeen: false,
        microaneurysms: false,
        dotBlotHaemorrhages: false,
        cottonWoolSpots: false,
        venousBeading: false,
        maculaHardExudates: false,
        fovealRisk: false,
        nvd: false,
        nve: false,
        preretinalHaemorrhage: false,
        vitreousHaemorrhage: false,
      },
    },
    left: {
      distanceVA: "",
      viewQuality: "clear",
      areaSeen: "disc-macula",
      findings: {
        // same finding keys as right
      },
    },
  },
};
```

### View Quality Overrides

- If no higher-risk signs are present and either eye view is `Ungradable`: output `Ungradable - repeat dilated view/photo if possible; refer if still inadequate or repeat is not possible`.
- If either eye view is `Partial`: do not allow a plain normal result. Use `No referable signs seen in the view obtained` plus a limitation note.
- If not dilated, make the limitation visible in the Action panel and referral note.
- If Holo (BIO) is selected without dilation, make the limited-view warning visible.
- Reduced or untestable distance VA should contribute to `Refer soon (2 weeks)` when macula-risk or DR signs are present.
- Systemic tick-boxes are advisory only and should not override retinal urgency.
- `No referable signs seen in view obtained` is mutually exclusive with all lesion findings for that eye. Selecting any lesion should clear it; selecting it should clear all lesion findings for that eye.

### Referral Categories

1. **Routine screening still required**
   - Both eyes have adequate views and no referable signs selected.

2. **Routine referral when possible**
   - DR signs present without urgent features.

3. **Refer soon (2 weeks)**
   - possible maculopathy, reduced or untestable VA or worrying DR burden.

4. **Urgent (today)**
   - NVD, NVE, preretinal haemorrhage or vitreous haemorrhage.

5. **Ungradable**
   - inadequate view, cataract, media opacity or unable to assess.

Default timescale wording:

- `Routine referral when possible`: DR signs only, without macula-risk or proliferative features.
- `Refer soon (2 weeks)`: possible maculopathy, reduced or untestable VA or concerning DR signs.
- `Urgent (today)`: possible proliferative disease, vitreous haemorrhage or preretinal haemorrhage.
- `Ungradable`: repeat dilated view/photo if possible; refer according to local pathway if the view remains inadequate or repeat is not possible.

Keep the wording configurable later because local referral pathways may use different time windows.

For the MVP, keep these labels in a small constants object rather than building a visible local-protocol settings screen.

Suggested priority order:

Triage each eye first, then derive one overall action. Ungradable or partial views must not override a higher-risk sign seen in either eye.

1. Urgent proliferative signs in either eye: NVD, NVE, preretinal haemorrhage or vitreous haemorrhage.
2. Macula-risk in either eye: hard exudates near macula, foveal concern or qualifying reduced/untestable VA with DR context.
3. DR signs in either eye without higher-risk features.
4. Ungradable, partial or inadequate view with no higher-risk signs found.
5. No referable signs seen in both adequate views.

If one eye is ungradable and the other has proliferative signs, macula-risk or DR signs, use the sign-driven referral category and add the ungradable eye as a limitation note. If both eyes are adequate and clear, use routine screening wording. If one eye is adequate and clear but the fellow eye is ungradable, use ungradable wording rather than a reassuring routine output.

If multiple findings are selected, use the highest-risk output and list the lower-risk findings in the reason text.

## Output Panel

Use a Glaucoma-style action panel but avoid numerical certainty.

Panel content:

- Action title
- Reason
- Next step
- Referral note button

Example:

```text
Refer soon (2 weeks)

Why: hard exudates near the macula and reduced distance VA.
Next: diabetic retinal assessment for possible maculopathy.
Safety: routine diabetic eye screening is still required.
Checks: BP, lipids and HbA1c reviewed if available.
Medical: arrange diabetes/medical review when possible if no routine diabetes care is available.
```

## Referral Note

Generate a short copyable note.

Template:

```text
Diabetic retinal triage - Diabetic app

Equipment: Arclight (DO) / Holo (BIO)
Dilation: yes / no / not recorded

Right eye:
- Distance VA: ...
- View quality: clear / partial / hazy / ungradable
- Area seen: posterior pole / disc-macula / four quadrants / limited
- Findings selected: ...

Left eye:
- Distance VA: ...
- View quality: clear / partial / hazy / ungradable
- Area seen: posterior pole / disc-macula / four quadrants / limited
- Findings selected: ...

Systemic checks:
- BP checked / not checked
- lipids checked / not checked
- HbA1c checked / not checked

Action:
Routine referral when possible / Refer soon (2 weeks) / Urgent (today) / Ungradable

Medical review:
Arrange diabetes/medical review when possible if routine diabetes care is not available.

Comment:
No signs seen only applies to the view obtained. Routine diabetic eye screening remains required.
```

## Placeholder Images

Use placeholders in the first build. Final images will be attached later.

Suggested placeholder files:

- `assets/placeholders/normal-fundus.webp`
- `assets/placeholders/npdr-ma-db.webp`
- `assets/placeholders/cws-vb.webp`
- `assets/placeholders/macula-hard-exudates.webp`
- `assets/placeholders/nvd.webp`
- `assets/placeholders/nve.webp`
- `assets/placeholders/preretinal-haemorrhage.webp`
- `assets/placeholders/vitreous-haemorrhage.webp`
- `assets/placeholders/ungradable-view.webp`
- `assets/placeholders/arclight-do-sweep.webp`
- `assets/placeholders/holo-bio-sweep.webp`

Placeholder behaviour:

- Use neutral grey image boxes with short labels.
- Do not use decorative stock imagery.
- Keep aspect ratios stable so final images can replace placeholders without layout shifts.
- Suggested card ratio: `4:3`.

## File Structure

Proposed MVP structure:

```text
Diabetic/
  index.html
  styles.css
  script.js
  README.md
  memory-bank/
    projectbrief.md
    productContext.md
    systemPatterns.md
    techContext.md
    activeContext.md
    progress.md
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

Start modular from the first build. This app has clinical logic, practice cases and shell behaviour, so a single large `script.js` would drift quickly.

File responsibilities:

```text
index.html              semantic shell and stable controller IDs
styles.css              token layer, appbar, drawer, popup, panels and responsive rules
script.js               tiny entrypoint and controller wiring
src/state.js            shared default state and state update helpers
src/findings.js         DR finding metadata, labels, abbreviations and group colours
src/triage.js           pure action logic and reason builder
src/referral-note.js    referral note formatter
src/practice-cases.js   drawer practice image cases and level definitions
src/mcq-data.js         MCQ level metadata and question banks
src/mcq.js              MCQ modal rendering, sampling, shuffling and scoring
src/ui-shell.js         burger drawer, info popup and accessible clinical mode tablist behaviour
```

Avoid avoidable `innerHTML`. Render selected findings, practice cases and referral text with `createElement`, `textContent` and `replaceChildren`.

## Build Phases

### Phase 1: Static Shell

- Build appbar, burger drawer and info popup.
- Add Arclight (DO)/Holo (BIO) clinical mode tablist with Allan-style ARIA states and keyboard navigation.
- Add three main panels: View, Findings and Action.
- Add compact Right/Left eye switcher.
- Add right and left view dropdowns directly in the View panel.
- Add placeholder image cards.
- Add memory-bank files before implementation so future edits have project context.

### Phase 2: Clinical State

- Wire per-eye merged view status and findings.
- Add Cataract-style right and left distance VA dropdowns.
- Add BP, lipids and HbA1c tick-boxes.
- Handle Arclight (DO)/Holo (BIO) mode-specific `areaSeen` options safely.
- Make dilation status prominent in the View panel, Action panel and referral note.
- Add conservative triage logic.
- Add action output.
- Add referral note generation.
- Add pure tests for `src/triage.js` and `src/referral-note.js`.
- Keep referral timescale labels in constants so local wording can be changed later without rewiring the UI.

### Phase 3: Drawer Practice

- Add drawer practice image cases using placeholder images.
- Add Primary, Intermediate and Advanced levels.
- Keep practice separate from the clinical main screen.
- Keep Practice out of the clinical referral state.
- Add MCQs with the documented `16 / 26 / 26` bank targets, `5 / 6 / 8` sampled rounds and `3 / 4 / 6` pass marks.
- Verify question counts, answer indexes, option shuffling and submit/pass/fail paths.

### Phase 4: Asset Replacement

- Replace placeholders with final supplied images.
- Check crops, contrast and readability at `360 x 740`.
- Confirm final image dimensions do not shift cards.

### Phase 5: QA

- Test at `360 x 740`.
- Spot-check tablet and laptop.
- Check side drawer, quick guide and referral note.
- Confirm ungradable and partial views cannot output a falsely reassuring result.
- Confirm app works offline.

## Visual Acceptance Criteria

- At `360 x 740`, the appbar, first panel and action area should be readable without crowding.
- Keep the first build compact; put explanatory hints in the popup and drawer rather than expanding the main clinical flow.
- The app should record right and left VA, right and left view and right and left findings through compact controls without showing every finding at once.
- Burger drawer should feel like Fundal Reflex, not a separate design.
- Popup should be concise and fit the phone viewport.
- Popup should use the Fundal Reflex popover style, not a large content card.
- Placeholder cards should not jump when images are replaced.
- Red should mark urgency and the app identity, not dominate every panel.
- Arclight (DO) and Holo (BIO) modes should share the same UI grammar, with only the checklist emphasis changing.
- Mode tabs should use a shared rail, flatter inactive tabs and a raised active tab.
- Practice should sit in the drawer and not compete with the main clinical flow.
- Practice should use the same shell and modal style, not feel like a separate app.
- Action should be a compact status strip by default, not a full text panel.

## Safety Acceptance Criteria

- Ungradable view always triggers repeat dilated view/photo advice, then referral if still inadequate or repeat is not possible.
- Partial view uses cautious wording.
- Proliferative signs always trigger `Urgent (today)` referral wording.
- Macula risk never claims confirmed DMO.
- The app never chooses treatment such as anti-VEGF or laser.
- A clear adequate view with no selected findings still says routine diabetic eye screening is required.
- Arclight (DO) mode should not imply a complete peripheral retinal assessment.
- Holo (BIO) mode can record four-quadrant sweep, but still reports only the findings selected by the user.
- Dilation check status, dilation status and reason if not dilated are visible in the Action panel and referral note.
- `No referable signs seen in view obtained` is mutually exclusive with lesion findings per eye.

## Local Checks After Build

Use the same pattern as the other Arclight apps:

```powershell
python -m http.server 8080
```

Open:

```text
http://127.0.0.1:8080/Diabetic/index.html
```

Minimum checks:

1. `360 x 740` phone viewport.
2. Appbar alignment, black background and red title/icons.
3. Burger drawer open/close.
4. Quick guide popup open/close.
5. Arclight (DO) and Holo (BIO) mode switching.
6. Mode tabs expose `tablist`, `tab` and `tabpanel` semantics.
7. `ArrowLeft`, `ArrowRight`, `Home` and `End` move between mode tabs.
8. Right/Left eye switcher stores per-eye view, VA and findings.
9. Right-eye and left-eye view dropdowns update without expanding the layout.
10. Holo (BIO) `four-quadrants` cannot persist as an invalid Arclight (DO) state for either eye.
11. Proliferative signs in one eye plus ungradable fellow eye still trigger `Urgent (today)`.
12. One adequate clear eye plus one ungradable eye does not produce routine reassuring output.
13. Ungradable output when no higher-risk sign is present.
14. Proliferative `Urgent (today)` output.
15. Macula-risk `Refer soon (2 weeks)` output.
16. Routine DR signs use `Routine referral when possible`.
17. VA thresholds behave as documented.
18. `No referable signs seen` clears lesion findings and lesion findings clear it.
19. BP, lipids and HbA1c tick-boxes appear in the Action panel and referral note without changing urgency.
20. Referral note generation includes right-eye and left-eye sections.
21. MCQ modal opens for Primary, Intermediate and Advanced from the drawer.
22. MCQ bank counts and answer indexes are valid.
23. No console errors.

When tests exist:

```powershell
node --check script.js
node --check src/state.js
node --check src/findings.js
node --check src/triage.js
node --check src/referral-note.js
node --check src/practice-cases.js
node --check src/mcq-data.js
node --check src/mcq.js
node --check src/ui-shell.js
```

## Documentation Set

This app should keep the same project memory habit as the established Arclight apps.

Required memory-bank files:

- `memory-bank/projectbrief.md`
- `memory-bank/productContext.md`
- `memory-bank/systemPatterns.md`
- `memory-bank/techContext.md`
- `memory-bank/activeContext.md`
- `memory-bank/progress.md`

Update these when clinical scope, UI conventions, file structure or implementation status changes.
