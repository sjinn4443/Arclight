# Fleet-wide Arclight Upgrade Plan

**Status:** Fleet implementation, MCQ quality and lead verification complete on 26 July 2026. All 15 real apps and seven excluded immediate child directories are classified. Every sibling app has an evidence-backed engineering, UI-polish and MCQ-quality row or a deliberate MCQ exclusion. Independent clinical approval and physical-device acceptance remain explicit external gates.  
**Reference:** `Allan/ALLAN_V1.2_SPRINT_UPGRADE_PLAYBOOK.md`  
**Working viewport:** `360 x 740`  
**Language:** British English. Avoid Oxford commas.

## 1. Objective

Apply the reusable UI, accessibility, offline, documentation and verification improvements from Allan v1.2 across every real app in `C:\Users\William\Desktop\Arclight App`.

This is a consistency and refinement pass. It is not a redesign, clinical rewrite or logic redevelopment project.

## 2. Fixed Scope Rules

### Preserve

- Existing clinical logic, scoring, calculations, simulator behaviour and referral outputs
- Existing workflows and control arrangements
- Layouts that already work at `360 x 740`
- Each app's purpose, content and terminology
- Each app's individual accent colour
- Existing reports, sharing and exports unless broken
- Stable internal IDs and implementation names
- User-created files and current app structure

### Improve

- Consistent black app bar and compact Arclight shell
- App-specific title and app-bar accent colour
- Typography, spacing, visual hierarchy and panel treatment
- Button consistency and touch targets
- Menu and modal behaviour
- Keyboard and screen-reader accessibility
- Local runtime assets instead of CDNs
- Manifest and offline support
- Appropriate case or examination reset
- Tests that protect existing behaviour
- README, memory-bank and governance documentation
- Mobile verification at `360 x 740`

### Do Not Do

- Do not transplant Allan's dermatology content.
- Do not change clinical thresholds or scoring rules.
- Do not invent new reports, image capture or patient workflows.
- Do not rebuild an app merely to make its code resemble Allan.
- Do not rearrange a successful layout without a demonstrated usability reason.
- Do not treat engineering review as clinical approval.
- Do not mark desktop simulation as physical-device acceptance.

If a possible logic defect is discovered, document it for later review. Only alter logic when an existing implementation error clearly prevents the requested UI or safety behaviour and the correction does not require a new clinical judgement.

## 3. Fleet Classification

### Real Apps

1. Allan - reference implementation
2. Amsler
3. Cataract
4. Diabetic
5. Discs
6. Fields
7. Fundal Reflex
8. Glaucoma
9. Mires
10. Morph
11. Refract
12. Sauron
13. Squint
14. Swollen Discs
15. Trauma

### Excluded Directories

- `gallery` - catalogue and thumbnail resource
- `audit-reports` - generated Lighthouse evidence

Parent scripts, reports and `Diabetic.zip` will be recorded as supporting resources rather than apps.

## 4. Recovery and Preservation

- The parent directory is not under usable Git version control.
- The user has confirmed that an external USB backup exists.
- Use narrow, reviewable patches.
- Do not delete, replace wholesale or broadly rename files.
- Rebuild generated bundles from their source files rather than editing them independently.
- Retain existing audit reports as evidence.
- Identify generated evidence refreshed during testing separately from source changes.

## 5. Parent Governance

Before changing the first app:

1. Create the parent `AGENTS.md`.
2. Reference Allan's playbook rather than copying it.
3. Record the shared UI, preservation, language, accessibility and verification rules.
4. Create `ARCLIGHT_APP_UPGRADE_MATRIX.md`.
5. Add one row for every real app.
6. Record `gallery` and `audit-reports` as explicit exclusions.
7. Record USB backup coverage and the absence of usable Git history.

The matrix will use the requested columns:

- folder
- app purpose
- baseline status
- backup or version-control status
- mobile shell
- accessibility
- state safety
- image handling
- report and reset
- local runtime
- PWA and offline
- automated tests
- `360 x 740` browser review
- README and memory bank
- clinical review
- physical-device status
- final status
- evidence

## 6. First App: Cataract

Cataract will establish the shared pattern because its workflow and decision engine already have strong test coverage.

### Cataract Implementation

1. Record its baseline workflow, tests and visual state.
2. Preserve `src/cataract-engine.js` and its clinical behaviour.
3. Compare the existing interface against Allan's reusable shell.
4. Retain Cataract's accent colour.
5. Improve only justified details:
   - app-bar consistency
   - title and icon positioning
   - touch targets
   - typography
   - panel hierarchy
   - spacing
   - button treatment
   - menu, preview and modal accessibility
6. Preserve progressive section unlocking and current output structure.
7. Add reset only if it cleanly clears the existing examination state.
8. Add a local manifest and scoped service worker.
9. Add asset, accessibility and offline contracts around existing behaviour.
10. Rebuild any generated bundle from source.
11. Run its full existing audit suite.
12. Review the workflow at `360 x 740`.
13. Verify incomplete, routine, priority and urgent scenarios without changing their expected results.
14. Update README and all relevant memory-bank files.
15. Add clinical-review and constrained-device records with pending statuses.
16. Update the fleet matrix with exact evidence.

### Cataract Review Gate

After Cataract is complete, stop and present:

- before-and-after UI summary
- changed files
- preserved logic evidence
- automated results
- `360 x 740` screenshots or observations
- offline result
- documentation updates
- unresolved risks

The user approved the final Cataract result on 22 July 2026. The review gate is closed and Fields may proceed as the second sequential app.

### Lessons Locked In from the Cataract Review

- Preserve compact layouts that already work. Fix collisions through measured spacing and track sizing before moving controls onto new rows.
- Compare every visual change with the saved baseline. A technically valid layout is not acceptable if it makes the established workflow feel worse.
- Do not add visible explanatory words to dense controls unless they materially improve understanding and still fit at every target width. Accessible names may remain non-visible where the surrounding label is clear.
- Keep app-specific content, labels, colour and workflow geometry. Reuse Allan's hierarchy and engineering principles rather than copying its page composition.
- Review the untouched and completed states, not only the initial shell.
- Test the required `360 x 740` viewport and any additional viewport exposed by user evidence. Cataract's compact History row was also checked through `566 x 1280`.
- Use rendered-bound checks when adjacent controls are close. A screenshot alone can miss small intersections.
- Verify both direct-file use and local HTTP use where the app supports both. Service workers do not operate on `file://` pages.
- Version changed styles and scripts and bump the app-scoped service-worker cache when browser-visible assets change.
- Stop after the first app for user review. Do not propagate a visual convention across the fleet until that convention is accepted.

## 7. Second App: Fields

After Cataract approval:

1. Apply the proven visual conventions without copying Cataract's colour or content.
2. Preserve the field-testing workflow and rule modules.
3. Examine the initial all-seen state carefully.
4. Change it only if the visible output constitutes a misleading patient conclusion.
5. Protect all established classifications and pathways with regression tests.
6. Preserve the actual page structure if it remains usable at `360 x 740`.
7. Localise Google Fonts.
8. Add scoped offline support.
9. Add appropriate examination reset.
10. Update documentation, review records and matrix evidence.
11. Run existing QA suites and a fresh browser review.

Fields will also be completed before broader batching begins.

### Fields v1.1 Review Receipt

- The compact dual-eye layout and blue Fields identity were preserved.
- Untouched points remain unassessed. `Mark all seen` explicitly completes a normal examination. A user-confirmed defect-first correction restores live results when a point reaches suspect or absent by completing the untouched remainder as seen.
- The clinical `R/?/W` engine, Classic 18 rules, wording and pathway mappings were not changed.
- Local fonts replaced the remaining Google Fonts request.
- A two-step examination reset, app-scoped PWA shell and overlay focus handling were added.
- `npm test` passes 17 contracts, lint and all five established QA suites.
- Untouched, normal, partial, abnormal, reset, guide, offline and six representative pathway states passed at `360 x 740`.
- The pathway presentation follow-up enlarged the existing SVG, removed false internal scrollbar controls and made the existing legend more specific without changing paths, transforms, `part-*` IDs or target mapping.
- The safety follow-up keeps urgent context visible beneath an incomplete `Not assessed` heading and makes unexpected interpretation failure fail closed as `Unable to interpret`.
- The RAPD follow-up confirmed that markup presence and a control-only bounding-box check are not sufficient visual evidence. The label was first clipped, the corrected group then obscured neighbouring faint markers and moving those markers sideways pushed them onto the eye outlines. The final solution preserves original horizontal label positions and creates a dedicated vertical band. Every heading and marker clears the selector and circles at `360 x 740`; `R / 0 / L` state and clinical logic remain unchanged.
- Independent clinical sign-off and physical-device review remain pending.
- Evidence: `Fields/FIELDS_V1.1_EVIDENCE_RECEIPT.md`.

### Lessons Locked In from the Fields Review

- Decide whether an app is operational, educational or mixed before interpreting its default state. Teaching defaults may be harmless while an operational assessment must not present untouched controls as recorded normal findings.
- Keep presentation safety separate from established clinical logic. Where the clinical engine already has strong audit coverage, add a small pure UI-state layer for unassessed, incomplete or recorded status rather than introducing new clinical codes.
- An explicit completion requirement must retain an efficient normal workflow. Provide a concise action which records untouched inputs as normal or seen without overwriting abnormal inputs already entered.
- Do not let an unassessed-state safety guard make an established defect-first tool appear broken. Keep a wholly untouched screen neutral, then restore live interpretation once the user deliberately records a suspect or absent point.
- Test the completion action from both an untouched and partially completed assessment. A bulk action must preserve suspect, absent, abnormal or otherwise non-routine selections.
- Keep operational assessment state separate from teaching state. A new-assessment reset may clear examination controls, output and transient patient-facing surfaces while retaining MCQ achievement and user preferences.
- Use a deliberate two-step reset only where case-specific information can be lost. Keep the action in an existing low-priority surface such as the drawer rather than crowding the primary mobile workflow.
- Do not invent a report, image workflow or other feature solely for fleet uniformity. Apply only the Allan patterns relevant to the app's actual purpose.
- Treat design documentation as evidence which must be checked against rendered CSS. Fields exposed a drift between its documented panel hierarchy and live radius tokens. The final hierarchy uses a more prominent primary stage with flatter secondary cards and smaller control radii.
- Standardise visual hierarchy through tokens while preserving app geometry. For Fields this meant retaining the dual-eye arrangement and blue accent while using a coherent `16/12/10/8px` radius hierarchy.
- Treat an established SVG as protected logic when its paths and IDs drive decisions or teaching. Improve its container and external legend first, then prove the unchanged target map with exhaustive audits.
- On a very small screen, do not add labels inside an already dense SVG. Use the existing external legend as progressive disclosure: keep inactive terms short and add eye, hemisphere or branch detail only to the active red terms.
- An incomplete operational assessment may remain unclassified without hiding an independently urgent context flag. Keep the assessment status neutral and present the established urgent warning separately.
- Defensive parsing must fail closed. An unknown or malformed state must never be converted to a routine or normal clinical conclusion.
- Review every meaningful state at `360 x 740`: untouched, partial, completed normal, abnormal, reset and each important transient surface. A single startup screenshot is not sufficient.
- Check that compact control labels are visibly rendered and not merely present in the DOM or accessibility tree. Measure the control against every adjacent label, marker and target, including low-contrast elements; absolute positioning, clipping and shadows can hide valid markup.
- Record exact viewport evidence where fit is important. Check document width and height, adjacent-control bounds, font loading and console output in addition to screenshots.
- Existing test documentation is not proof of a current pass. Run the app's locked toolchain, repair configuration before rewriting source and distinguish configuration failures from product defects.
- Separate development dependency findings from shipped runtime risk. Record both, avoid automatic dependency rewrites and verify the production/runtime dependency result independently.
- Direct-file support and installable offline support are distinct routes. Keep classic relative scripts and assets usable on `file://`, register service workers only on HTTP(S) and document which offline guarantee applies to each route.
- Bump the app-scoped cache and visible asset versions after the final browser-visible edit, not merely after the first implementation pass. Re-run the offline reload against the final cache version.
- Desktop emulation does not close physical-device risk. Compact controls, older WebView support, screen-reader behaviour and installed-app launch remain external gates until tested on the intended hardware.

## 8. Remaining Decision-support Apps

These will receive conservative UI and infrastructure passes.

### Trauma

- Preserve OTS-style values, penalties and category boundaries.
- Review the automatic initial prognosis only as a state-presentation issue.
- Extract logic only if needed to test existing behaviour reliably.
- Add reset for case-specific inputs.
- Localise fonts and add offline support.

### Glaucoma

- Preserve the existing tested risk engine.
- Keep incomplete-result behaviour.
- Localise fonts and remove unused remote preconnections.
- Repair or replace the broken lint wrapper without changing app logic.
- Add reset and offline support.

### Refract

- Preserve its live heuristic and benchmark behaviour.
- Do not attempt to improve the `24/60` benchmark match during this sprint.
- Check whether blank inputs create a misleading completed output.
- Remove the zoom restriction where safely possible.
- Localise fonts and icons.
- Add case reset and offline support.

### Diabetic and Discs

- Preserve their distinct triage rules and teaching content.
- Keep teaching cases separate from examination state.
- Review copied state residue in Discs without altering behaviour unnecessarily.
- Add suitable reset, tests and offline support.
- Retain their established layouts where effective.

## 9. Teaching and Simulator Apps

These will receive UI consistency without being converted into patient-assessment tools.

### Amsler

- Preserve drawing, analysis and report behaviour.
- Localise fonts, icons and html2canvas.
- Add deliberate examination reset.
- Test report readiness and existing analysis behaviour.
- Add offline support.
- Approved 24 July follow-up: descriptive Compute now uses a fixed-resolution normalised engine, selected-eye assessment state, explicit zone denominators and fail-closed stale-result handling. It no longer infers `wavy` or `dark` from geometry. Independent review of the central-zone definition and closed-region semantics remains pending.

### Fundal Reflex

- Preserve its selected teaching cases and interpretation mappings.
- Keep a normal teaching case separate from any claim about a real patient.
- Improve shell consistency, accessibility and responsive hierarchy.
- Add tests around existing case-to-result behaviour.
- Add session reset only where useful.

### Mires

- Preserve Goldmann and Newton training logic.
- Keep its specialised simulator layout.
- At `360 x 740`, retain the exact `x=10`, `y=74`, `340 x 656` game area while using equal `166 x 44px` mode launchers, aligned `16px` drawer cards and an `18px` Controls surface.
- Capture drawer evidence only after the slide transition settles so a mid-animation frame is not mistaken for clipping.
- Distinguish visual-control reset from full exercise reset.
- Test existing sampling and scoring boundaries.
- Add offline support.

### Morph

- Preserve its compact simulator and canvas interaction.
- Avoid unnecessary extraction of its inline engine.
- Add contract tests around existing behaviour.
- Repair stale verification instructions.
- Add offline support.

### Sauron

- Preserve retinoscopy cases, control behaviour and timed teaching.
- Improve shell and modal consistency.
- Protect current mappings with tests.
- Add an appropriate training-session reset.
- Add offline support.

### Squint

- First classify its initial normal output as either neutral simulator position or clinical conclusion.
- Preserve it if it is intentional teaching state.
- Clarify its label if that prevents misinterpretation.
- Do not change analysis logic without later app-specific review.
- Localise fonts and add offline support.

### Swollen Discs

- Preserve teaching conditions, viewer geometry and MCQ progression.
- Build on its existing test suite.
- Add session reset only where useful.
- Improve shell consistency and offline support.

## 10. Shared UI Standard

Apply proportionately:

- Black app bar around `54px` high
- Existing app-specific accent colour
- Centred local Quicksand title where compatible
- Dependable CSS or local icon controls
- `44 x 44px` touch targets
- Compact white panels
- Soft background and restrained blue-grey borders
- Deliberate radius hierarchy: prominent outer shells around `16-18px`, cards or grouped controls around `12px` and compact controls around `8-10px`, adjusted only where existing geometry requires it
- Use a measured fleet-wide mobile edge rule at `360 x 740`: every principal outer shell, stage or panel has `10px` screen margins and a `340px` width. Apply this to outer containers only. Preserve each app's internal geometry, workflow, clinical or teaching logic and established accent.
- For the related image-led black-stage family, retain Swollen Discs' `16px` stage radius, `18px` result-panel radius and strong stage shadow where those features fit the existing design. Mires keeps its simulator coordinates while its visible dark shell, game area, dock and top controls align to the same `10px` edge.
- Deliberate type hierarchy: app title, section heading, field label, dynamic value and helper copy must remain visually distinct at `360 x 740`
- Italics reserved for useful clinical distinctions, observation cues or secondary explanatory locations, not modes, button labels, calculations, results, operational state or whole instruction sentences
- Consistent button hierarchy
- Clear primary, secondary and teaching actions
- Compact menus that open below the app bar
- Escape, outside-tap and explicit-close behaviour
- Focus restoration after modal closure
- Information cards use Quicksand `14px/700/1.2` titles, Inter `12.5px/400/1.42` body text, Inter `11px/800/1.25` section labels, Inter `12px/700/1.15` cue headings, Inter `10px/400/1.15` cue helpers and Inter `10.5px/700/1.2` version text. These roles remain upright and cards must not require internal scrolling at `360 x 740`; critical safety content remains initially visible while genuinely secondary reference material may use a native disclosure whose open state is also verified
- Information cards end with a separate bottom-right `info-version` footer containing the simple visible `v1` label and current update date; internal package and engine versions remain unchanged and the footer remains visible when secondary disclosures open
- No colour-only state distinction
- No unnecessary movement of successful workflows
- No extra rows, labels or controls merely to make an app resemble Allan
- Preserve the original information density when it is readable and collision-free
- Apply narrow-width exceptions only where measurements show they are needed
- For examiner-facing eye simulators, keep screen-left as patient RE and screen-right as patient LE. Document any internal DOM mapping, then correct visible order, titles and accessible names without renaming keys or changing clinical logic.
- Treat beam-to-pupil response as a two-dimensional distance where the control moves in two dimensions. Protect the pure target calculation with equal horizontal and vertical tests while preserving each app's established temporal response.
- Compare specialist render states such as dense cataract across related apps, but do not treat visual consistency as clinical approval or change clinical presentation solely for cross-app uniformity.

The standard is a design language, not a rigid template.

### Mandatory UI-polish completion gate

An app is not complete after engineering and automated checks alone. Before its matrix row can move to complete, the lead must:

1. Compare the untouched `360 x 740` screen with the saved baseline.
2. Review outer-shell, card, grouped-control and compact-control radii as an intentional hierarchy.
3. Review section-heading, field-label, dynamic-value, helper and action typography, including font size, weight, line height and appropriate use of italics.
4. Review panel spacing, alignment, border contrast, shadows, button hierarchy and dense-control collisions.
5. Open the highest-density or expanded state and any result, report, modal, drawer or reset state relevant to the app.
6. Preserve established workflow order, successful geometry, clinical logic, images and app-specific colour.
7. Capture final rendered evidence and record the visual decisions in the app receipt, README, memory bank and parent matrix.

If no visual change is needed, the receipt must say what was reviewed and why the existing treatment was retained. Silence is not evidence of a UI-polish pass.

## 11. Offline and Runtime Standard

For each independently launched app:

- Bundle runtime fonts and icons locally.
- Retain required licences.
- Remove normal-runtime CDN scripts and styles.
- Add a local manifest.
- Use an app-relative `start_url` and scope.
- Add a valid local icon.
- Register the worker only over HTTP or HTTPS.
- Use an app-specific cache prefix.
- Cache only that app's shell and active local assets.
- Do not let one app delete another app's cache.
- Ignore cross-origin source links.
- Test first load and offline reload.
- Document that direct-file use does not provide service-worker installation.

## 12. Testing Standard

Tests will protect current behaviour rather than redefine it.

### Static Checks

- JavaScript syntax
- duplicate IDs
- broken ARIA targets
- missing local assets
- forbidden runtime CDN references
- manifest integrity
- service-worker asset completeness
- generated bundle alignment

### Existing-behaviour Checks

- current calculation or classification outcomes
- incomplete inputs
- documented boundary values
- teaching progression
- existing report or export output
- reset behaviour where added
- separation between teaching and case state

### Browser Review

At `360 x 740`:

- app bar and primary workflow
- touch targets
- menus and modals
- keyboard navigation
- focus behaviour
- highest-density state
- error and incomplete states
- reset
- report or export where applicable
- offline reload
- console errors
- text zoom and scaling where possible
- rendered document width and horizontal-overflow check
- computed radius and typography checks for the principal shell, cards and controls
- final versioned stylesheet URL after any browser-visible change

### Bounded execution and stall recovery

- Give ordinary browser and verification commands a maximum initial wait of `30 seconds`.
- If a command produces no useful progress within `60 seconds`, terminate it rather than waiting indefinitely.
- Retry once as a smaller single-app or single-session check.
- If the retry fails, use a fresh browser session or the smallest safe static and rendered-style fallback, record the limitation and continue with other safe work.
- Do not launch several approval-gated browser commands together. Run them singly so an approval delay cannot stall the whole batch.
- A hung evidence command does not justify skipping the UI-polish gate or claiming completion.

### Codex browser device-toolbar hand-off

- Keep automated `360 x 740` browser evidence separate from the user-visible Codex browser device toolbar. A verified test viewport does not prove that every retained browser tab will still display at that size.
- Before any browser hand-off, stop and verify the exact retained tab the user is viewing: confirm its intended URL, use `Browser options` → `Show device toolbar`, enter `360` and `740` in the visible spinners, switch to another real tab and back, then re-read the URL and both values before reporting success.
- The Codex browser device-toolbar viewport is tab-specific user-interface state. Automated viewport overrides are temporary and may disappear when browser control is released or finalised, including an ongoing browser hand-off.
- Persistent sizing must use the real Codex browser chrome: `Browser options` → `Show device toolbar`, then `Viewport width = 360` and `Viewport height = 740`. The accessible width and height spinners can be operated directly when a multi-tab hand-off is requested.
- Select each retained browser `TabItem`, set the real device-toolbar values and re-read them. Do not use CDP page emulation as a substitute for this tab-specific interface state.
- Do not claim that a fleet of retained tabs remains at `360 x 740` solely because page measurements passed. Switch away and back normally, then re-read every retained tab's visible toolbar values.
- For dependable automated review, one active tab may still be navigated app by app at `360 x 740`. Keep that test evidence separate from persistent multi-tab hand-off evidence.
- Never overwrite a device-toolbar size the user set manually unless the user explicitly requests a change to that tab.
- Avoid leaving duplicate same-title tabs from different local ports because the Codex browser tab strip does not make those routes easy to distinguish.

On 23 July 2026, the real device toolbar was enabled and set to `360 x 740` on all 15 retained app tabs. A separate switch-through verification re-read `360 x 740` on 15 of 15 tabs and returned the active tab to Amsler.

Physical-device testing remains pending unless it is actually performed on a device.

## 13. Documentation

Every app will receive:

- updated README
- updated relevant memory-bank files
- exact runtime and test instructions
- known issues and preserved limitations
- clinical review status where relevant
- constrained-device status
- explicit offline instructions
- evidence of the completed `360 x 740` review

Logic concerns found during this sprint will be recorded for later individual review rather than silently fixed.

## 14. Per-app release checklist

The lead must complete this checklist for every remaining app before changing its matrix status from `In progress`:

- [x] Baseline workflow, state model, clinical or teaching logic and existing tests recorded
- [x] Baseline geometry and untouched-state evidence recorded before implementation decisions
- [x] App-specific engineering gap list written
- [x] App-specific UI gap list or equivalent dedicated UI section written, covering radius hierarchy, spacing, typography, italic use, alignment, borders, shadows and action hierarchy
- [x] Existing logic, workflow order, imagery, internal IDs and app accent confirmed preserved
- [x] Applicable accessibility, reset, local-runtime and offline work completed
- [x] Automated checks passed after the final source edit
- [x] Untouched, highest-density, completed and relevant transient states reviewed at `360 x 740`
- [x] Loaded local styles, rendered document width, horizontal overflow and principal radius hierarchy checked after the final browser-visible change
- [x] README, relevant memory-bank files, evidence receipt and exact parent-matrix row updated
- [x] Clinical sign-off and physical-device status stated explicitly without inference

The evidence receipt must contain a dedicated **UI polish** paragraph even when the correct decision is to retain the existing presentation. The parent matrix's final-status and browser-evidence cells must mention the completed visual pass explicitly. A completed test suite alone is not a release receipt.

For the next round, group apps only where their architecture is genuinely similar. Reuse verified tokens and interaction patterns, but write and review each app's UI gap list before applying shared CSS. This keeps parallel work efficient without repeating copied-layout mistakes.

## 15. Final Completion

After all apps are processed:

1. Run the complete fleet verification.
2. Audit Allan for consistency without reworking it.
3. Confirm every immediate child directory is classified.
4. Close or explicitly block every real-app matrix row.
5. Confirm README and memory-bank coverage.
6. Confirm clinical and physical-device statuses.
7. Produce the requested fleet evidence receipt covering every app, changed file, test, browser check, remaining risk and blocker.

## 16. Current Review Gate

Current position:

1. Parent governance, classification and recovery records are complete.
2. Allan's v1.2 reference implementation passed its 26 logic, MCQ and app contracts. The MCQ interaction received narrow stable-ID, source-status, rationale, focus and retry improvements without changing the clinical bank.
3. Cataract remains the user-approved visual reference after its compact History arrangement was restored and made collision-free.
4. Fields, Amsler, Diabetic and Discs retain their completed first-wave evidence.
5. Fundal Reflex, Glaucoma and Mires completed the next app batch with lead test and browser verification.
6. Morph, Refract and Sauron completed the following batch with preserved simulator or calculation logic.
7. Squint, Swollen Discs and Trauma completed the final batch. Their stale tooling or accessibility gaps were corrected without redefining clinical or teaching rules.
8. Every sibling app has a documented radius, hierarchy, spacing, typography, italic-use and alignment decision.
9. Every real app has final `360 x 740` browser evidence. A settled clean-page measurement confirms `10px` principal outer edges and `340px` principal widths across all 15 apps with no horizontal overflow. Direct-file use was additionally verified for Fundal Reflex, Morph, Refract, Sauron, Squint, Swollen Discs and Trauma.
10. `node fleet-contract-check.mjs` passes for all 15 apps and seven excluded directories.
11. The final receipt is `ARCLIGHT_FLEET_UPGRADE_EVIDENCE_RECEIPT.md`. The question-level receipt is `ARCLIGHT_FLEET_MCQ_QUALITY_AUDIT.md`. Independent clinical sign-off, installed-device checks and physical-device acceptance remain external gates.

### Lessons Locked In from the First Parallel Batch

- Capture the untouched `360 x 740` screen before edits and use its exact geometry as a regression guard.
- Test meaningful expanded and completed states, not only the attractive collapsed first screen.
- Keep reset scoped to operational examination state so teaching cases, viewer preferences and achievement are not erased.
- Use truthful control semantics: a shared-view mode selector is a radiogroup, not a tab system with invented tabpanels.
- Cache image-heavy apps proportionately. Diabetic can pre-cache its smaller case set while Discs uses shell-first and runtime image caching.
- Wait for local fonts and viewer rendering before final evidence captures, then confirm the DOM labels and a settled screenshot.
- Do not mark an app complete until the explicit radius, hierarchy, spacing, font-size, weight, italic-use and alignment review is documented.
- Measure settled rendered geometry rather than inferring it from CSS alone. Fonts and adaptive canvases may briefly report transitional widths during startup.
- Standardise only the outer edge contract. Do not move internal controls or simulator coordinates merely to make unrelated apps mechanically identical.
- Keep browser checks bounded. Terminate a stalled command, retry it once in isolation and fall back to a smaller evidence check rather than letting the fleet pass stop.
- Treat Codex browser device-toolbar sizing as an active-tab hand-off concern. Prefer one fixed-size review tab and never infer retained background-tab dimensions from pre-finalisation checks.
- Review the main-page role map separately from popup typography. Keep primary headings, secondary headings, controls and helper text internally consistent while allowing each app’s density to differ.
- Treat `10px` as the normal floor for compact operational or teaching labels. Use `9.5px` only where measured geometry requires it and record a collision check at `360 x 740`.
- Do not communicate selected state by changing tab-label size. Prefer weight, colour, border and background so the hierarchy does not jump.

### Sidebar consistency lesson — 23 July 2026

- Audit the drawer as a distinct interface state rather than inferring its quality from the main page.
- Preserve menu content and application identity while standardising role hierarchy, close-control typography and focus behaviour.
- Use `14px/700` for the drawer title, `11px/800` for section labels and `12.5px/400` for supporting copy where present. Primary actions remain at their established `16px/700` scale.
- Verify that opening moves focus inside, Escape closes and focus returns to the trigger.
- Accept vertical drawer scrolling for genuinely long teaching menus. Do not reduce readable type or restructure content merely to force every drawer into one screen.
- Review from a fresh cache at `360 x 740`, wait for transitions to settle and record console and overflow results.

### MCQ and Cup consistency lesson — 23 July 2026

- Treat a visible level button as a functional contract. It must open a real authored set, require all answers, grade against an explicit pass mark and provide retry variation where the bank permits.
- Use the visible level names Primary, Intermediate and Advanced across the fleet. Preserve app-specific questions, attempt sizes, teaching modes and clinical identity.
- Shuffle options only when the correct answer is remapped at the same time.
- Never unlock the Cup because a result merely contains `score` or `complete`. Require an explicit pass class, pass attribute or unambiguous pass wording from the active Advanced attempt.
- Keep MCQ presentation consistent at a 44px minimum target and 12px level-button radius where compatible. A quiz modal may use page-level scrolling because a readable question set is intentionally longer than one mobile screen.
- Check the unanswered, failed and passed paths. A zero score, unanswered submission or review result must leave the Cup locked.
- Add authored questions only from the app's established controls, documented rules or existing teaching content. New or expanded clinical teaching content remains subject to independent clinical review.
- Version changed bundles, helpers, styles and service-worker caches together so the repaired behaviour is what existing offline installations load.

### Final safeguard lesson — 23 July 2026

- Test the real authored bank, not only a synthetic quiz-engine fixture. Protect tier names, pool size, attempt size, pass-mark bounds, unique prompts, distinct options and valid answer keys.
- Do not treat progressive questions on the same concept as accidental duplication. Remove only exact or unjustified repetition and do not invent clinical content for cosmetic variety.
- Confirm suspicious character rendering from the UTF-8 bytes before rewriting question text. Terminal mojibake can misrepresent otherwise valid `×`, `≥` and `≤` characters.
- Require the Advanced tier to represent a clear achievement. Sauron's anomalous 4/8 pass mark was aligned to 6/8 while its authored questions and simulator logic were preserved.

### MCQ clinical-quality implementation lesson — 26 July 2026

- Assign every authored question a stable app-scoped ID. Treat the ID as evidence and test data, not visible teaching copy.
- Require one unambiguous best answer, distinct options, a concise explanation and declared source status. A technically valid answer index is not enough.
- Use current authoritative material to check terminology where available. Keep app-specific or local-pathway statements explicitly marked as internal and pending independent clinical sign-off.
- Do not import referral timings from a reference source whose health-system context differs from the app. Terminology evidence and local action approval are separate.
- Correct malformed, ambiguous or overbroad questions narrowly. Preserve bank size, tier progression, app identity and operational clinical logic unless a separately approved change is required.
- After grading, keep the result and next action visible above the fixed control. A retry label must start a real fresh attempt, not remain disabled.
- If a quiz launches from a drawer which closes, return focus to a visible control such as the app-bar menu button. Do not restore focus to a hidden or inert drawer item.
- Run unanswered, failed, retry and passed paths at `360 x 740`. Check explanation readability, 44px answer rows, horizontal overflow, Escape, focus return and console output.
- Rebuild source-owned bundles, advance app-scoped cache tokens and test source-to-bundle parity before recording evidence.
- The Diabetic pilot is the proven implementation reference for this contract. Its clinical content is not a template for sibling apps.
- Audit Allan against the same contract without treating it as disposable scaffolding. Its 53-question clinical bank, tiering and pass marks were retained after a current-source review found no concrete clinical defect, while stable IDs, `44px` rows and a real fresh retry closed genuine QA and interaction gaps.
- Check semantic repetition as well as exact duplicate strings. The final fleet pass found repeated learning objectives in Amsler, Discs, Fields, Fundal Reflex, Refract and Squint even where every prompt string was unique.
- Prefer a distinct technique, limitation, interpretation or safety application when replacing a repeated restatement. Do not force unrelated content into a tier merely to make counts look varied.
- Remove quiz questions about untouched UI, button labels or software operation unless operating the simulator is itself the declared learning objective.
- Wait for modal animation completion before capturing visual evidence. A capture during Fundal Reflex's 240ms entry animation initially looked like a translucent card even though its settled computed opacity was `1`.

### Simulator interaction and dependent-control lesson — 24 July 2026

Apply these safeguards only where an app has comparable interactive teaching controls. They do not authorise changes to established clinical rules, simulator mappings or app-specific workflows.

- Classify every manipulation as demonstration, examination entry or preset selection. Explain the distinction in the information guide when the same screen supports more than one interaction method.
- Free exploration of a normal teaching model should demonstrate anatomy, movement or optics without inventing a diagnostic suggestion from pointer motion alone. Interpretation may follow an established abnormal restriction, condition preset or deliberately recorded modifier where the app's existing logic supports it.
- Preserve direct manipulation, trackers and presets as distinct input paths. Do not silently make one path imitate another or allow a teaching-only movement to overwrite operational state.
- When secondary settings depend on a parent feature, keep them visible but quiet and natively disabled until the parent is active. Synchronise `disabled`, `aria-disabled` and visible styling after manual changes, preset loading and reset.
- Map continuous sliders and trackers across their useful physical range. Test centre, small departures from centre and both extremes with pointer, touch and keyboard input where supported; avoid an abrupt binary-looking response immediately beside the neutral point unless that is the established behaviour.
- For long preset catalogues, prefer a `44px` in-place search which filters the existing buttons without changing names, levels, order, values or clinical content. Report the visible result count, support Escape to clear and restore the previous folder or disclosure state when the search ends.
- Use concise visible labels where an abbreviation or icon could be misunderstood. Keep accessible names even when a familiar icon replaces visible wording and verify that the icon remains clear at `360 x 740`.
- Keep neutral summaries neutral. Report that no modifiers are selected rather than implying that an examination is normal when the relevant controls remain untouched.
- Protect these behaviours with interaction contracts and real-catalogue audits, then review untouched, manually changed, preset-loaded, reset and dependency-disabled states at `360 x 740`.

## 17. Maintenance-refactor completion - 26 July 2026

The complete 15-app maintenance pass is recorded in `ARCLIGHT_FLEET_UPGRADE_EVIDENCE_RECEIPT.md`. It used the following safeguards:

1. Prove code is dead or duplicated before removing it. Do not infer redundancy from naming or file age.
2. Extract pure state, calculation or simulator helpers before changing an event loop. Protect source/bundle parity where a classic bundle is shipped.
3. Keep one owner for resources with a lifecycle, including object URLs, animation frames, timers and modal state.
4. Replace polling with existing app events only when the same state transitions are covered by interaction tests.
5. Rebuild generated bundles from source and advance app-scoped cache tokens with the browser-visible files.
6. Run app-level contracts before and after the final edit. Then exercise the changed interaction path in a real browser.
7. Treat browser review as a refactor gate. Mires demonstrated why: its tests passed while its stage height had regressed to `200px`. The full browser suite caught the layout defect and the preserved `656px` stage was restored.
8. Check HTTP and direct-file routes separately. Service workers do not run on `file://`, but direct-file asset and module behaviour still matters for apps which support it.
9. Update the app README and relevant memory-bank files only after the final verified implementation is known.
10. Record development-tool advisories honestly. Do not apply a breaking automatic dependency upgrade merely to make an audit summary look clean.

Final maintenance evidence:

- 5/5 focused cross-app interaction checks pass
- 15/15 HTTP fleet reviews pass at `360 x 740`
- 15/15 direct-file fleet reviews pass at `360 x 740`
- all 15 real retained Codex browser tabs persist at `360x740` after switch-away and return
- every app README and all six memory-bank records contain the dated maintenance and MCQ-quality result
- independent clinical sign-off and physical-device acceptance remain external gates

## 18. Fleet MCQ quality completion — 26 July 2026

The full implementation and audit are recorded in `ARCLIGHT_FLEET_MCQ_QUALITY_AUDIT.md`.

- All 14 MCQ apps have stable app-scoped question identities, valid best-answer membership, concise rationales and declared source or review status.
- Morph remains a deliberate no-MCQ exclusion. Its condition-completion Cup was not replaced with an invented quiz.
- A final untouched fleet sweep passed 15/15 apps at a temporary automated `360 x 740` viewport with no horizontal overflow or console error.
- App-specific MCQ paths passed unanswered, first-missing focus, marked-review, source-display, retry and 44px target checks.
- The clinically important Mires fluorescein direction was corrected. Excess tear film can under-read Goldmann applanation IOP while insufficient tear film can over-read it.
- No assessment engine, referral threshold, calculator boundary, simulator mapping or case catalogue changed.
- Independent clinical approval, physical-device acceptance and installed cold-offline confirmation remain external gates.

## 19. Information-purpose completion — 27 July 2026

Every app already had an app-bar `i` surface, so no new overlay or workflow was introduced. Each existing panel now opens with a short app-specific explanation covering:

1. what the app does
2. what the user enters, selects, marks, moves or drags from the patient or teaching view in front of them
3. the limit of the output, such as teaching support, triage support or non-diagnostic status

The opening remains visible. Existing disclosures retain secondary material where already appropriate. No type was reduced to force a fit. A shared contract requires a substantive `info-purpose-copy` block in all 15 entry pages. The isolated browser check opens each real information panel at `360 x 740` and verifies that the card fits the viewport without internal or horizontal scrolling, the close control stays inside the card and no console or page error occurs.

App-specific examples are deliberately concrete. Fields tells the user to test one eye at a time and select Seen, Suspect or Absent to match what the patient reports at each field point. Squint tells the user to drag each iris to match the eye position seen and distinguishes the Gaze tracker, cover controls and pupil controls.

No clinical engine, threshold, simulator mapping, assessment state, report calculation or main-page layout changed. Generated Cataract copy was rebuilt from source and every app-scoped cache identity was advanced so an existing offline installation can receive the new information copy.

Verification:

- `fleet-contract-check.mjs`: 15/15 apps passed
- `fleet-info-popup-review.mjs`: 15/15 open panels passed at a temporary automated `360 x 740`
- all app test suites passed except the unchanged Fields exhaustive output-mode audit, which was still actively computing after the practical timeout and was stopped
- Fields contracts, lint, 59,049-state field audit, 1,062,882-combination pathway audit, MCQ audit and context audit passed
- Squint's separate source/bundle parity check passed

The automated viewport is not evidence of persistent retained-tab size or physical-device acceptance. Independent clinical sign-off remains external.
