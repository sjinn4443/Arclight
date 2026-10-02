# Cross-App Upgrade Playbook from the Allan v1.2 Sprint

**Reference implementation:** Allan dermatology aid v1.2  
**Reference date:** 21 July 2026  
**Purpose:** Give another coding agent a self-contained specification for upgrading a sibling Arclight app to the same standard of mobile usability, state safety, offline readiness, documentation and verification.

This is a pattern library, not a request to clone Allan. Reuse the engineering approach. Adapt the workflow, brand colour, clinical content, images, report fields and escalation rules to the target app.

## 1. Target outcome

Upgrade the target app into a compact mobile-first tool that:

- works cleanly at a `360 x 740` review viewport
- keeps the main task visible without unnecessary page scrolling
- uses a consistent Arclight app shell and calm clinical visual language
- distinguishes untouched state from an assessed normal or routine state
- separates teaching aids from operational clinical decisions
- handles uploaded images without avoidable memory expansion
- produces a report from recorded findings rather than the currently open screen
- clears patient data deliberately and completely
- has no normal runtime dependency on a CDN
- can be installed and reloaded offline when served over HTTP or HTTPS
- has automated contracts for its most safety-relevant behaviour
- records clinical review status and physical-device testing honestly

Do not describe the app as clinically deployable merely because its engineering tests pass. Independent clinical sign-off and target-device acceptance are separate release gates.

## 2. Start with an audit, not a visual rewrite

Before editing the target app:

1. Read its README, memory bank, HTML, CSS, JavaScript and tests.
2. Map the real user workflow from first input to final action or report.
3. List every item of patient state, learning state and navigation state.
4. Identify every score, mnemonic, threshold, pathway label and emergency trigger.
5. Record which rules have authoritative sources and which are only teaching prompts.
6. Inventory all remote fonts, icon libraries, scripts and images.
7. Run the existing checks and capture the baseline results.
8. Review the current interface at `360 x 740` before changing it.
9. Preserve stable internal names unless renaming them has a clear benefit that exceeds the regression risk.

If Git history is unavailable, state that the work is a current-state audit rather than a commit-by-commit comparison.

## 3. Shared mobile app shell

Use the established Arclight visual language while retaining the target app's identity.

### Shell pattern

- Black app bar, `54px` high.
- Centred app title using locally bundled Quicksand at about `25px` and weight `700`.
- App-specific accent colour for the title and app-bar icons. Allan uses purple `#a855f7`; do not force purple on every sibling app.
- Left menu button and right quick-guide button with `44 x 44px` touch targets.
- Buttons placed approximately `12px` from the app-bar edges.
- A CSS-drawn three-bar menu glyph rather than a font-dependent hamburger character.
- Compact white panels over a soft background with restrained blue-grey borders.
- A dark stage for clinical or reference images.
- A black-square favicon with the app letter or short app mark centred.

### Side menu pattern

- Drawer opens below the app bar rather than covering it.
- Width uses `min(76vw, 284px)` as a useful phone baseline.
- Use about `16px` internal padding.
- Give actions clear grouping and compact card treatment.
- Put secondary learning content, reference cards, reports and MCQs in the drawer when they would crowd the main workflow.
- Closing behaviour must work by explicit close action, outside tap and Escape.

### Density rules

- Keep the app feeling like a practical clinical instrument, not a marketing page.
- Prefer short labels and optional help over permanent explanatory paragraphs.
- Keep the primary comparison or decision task visually dominant.
- Permit long help pop-ups to scroll within a viewport-capped container.
- Allow the shell to widen modestly on larger screens. Allan caps the main layout at `430px`; expanded modal surfaces may reach `520px`.
- Never remove essential labels solely to save space. A visually hidden accessible label is acceptable where context is otherwise clear.

## 4. Navigation and accessible interaction

### Route controls

Implement route switching as real tabs:

- container uses `role="tablist"`
- each control uses `role="tab"`
- each panel uses `role="tabpanel"`
- maintain `aria-selected`, `aria-controls` and roving `tabindex`
- support Left and Right arrow navigation
- make active state clear through shape, fill and border rather than colour alone
- use plain workflow names in visible copy rather than internal abbreviations

Changing tabs is navigation only. It must not record a clinical finding, clear a recorded value or change urgency by itself.

### Custom pickers and listboxes

If a custom picker is needed for icons or compact presentation:

- retain a native value source or otherwise expose a clear form value
- use listbox and option semantics
- support Arrow Up, Arrow Down, Home, End, Enter, Space and Escape
- keep `aria-expanded` and `aria-selected` synchronised
- dispatch the expected change event after selection
- do not close the menu merely because the user scrolls inside it
- keep icons recognisable and avoid misleading generic substitutes

### Pop-ups and modals

- Every trigger needs an accessible name and expanded state where relevant.
- Close on Escape and deliberate outside interaction.
- Return focus to a sensible control when a modal closes.
- Keep one inline detail open at a time when several expanded rows would overwhelm a phone screen.
- Close transient explanations on route change, scroll or resize when their position would otherwise become misleading.
- Announce upload errors, readiness changes and action results through appropriate live status regions.

## 5. Image capture and comparison

Adapt the required photo set to the target app. Allan uses wider location context, close-up and dermoscopy images. Another app may require a different set.

### Capture behaviour

- Highlight which capture is relevant to the current route, but do not let that highlight affect scoring.
- Show route-aware readiness such as `Photos 0/3` or `Photos 0/2`.
- Accept only formats the target browsers can reliably decode and share.
- Allan accepts JPEG, PNG and WebP up to `12 MB`.
- Apply the same validation to picker and drag-and-drop paths.
- Show a clear accessible error for type, size or read failure.

### Memory-safe file handling

- Retain each original `File` object for later sharing.
- Create a preview with `URL.createObjectURL(file)`.
- Revoke the previous object URL when a capture is replaced.
- Revoke every remaining object URL when a case is cleared.
- Do not convert captures to base64 unless the target has a proven requirement for it.
- Never add patient `blob:` URLs or patient files to the offline cache.

The state should conceptually keep both values:

```js
captures[type] = {
  file,
  previewUrl: URL.createObjectURL(file),
};
```

### Comparison stage

- Keep reference and user image boxes stable in size across routes.
- Show the illustrative reference on one side and the relevant user image on the other.
- Use an obviously empty camera state before a user image exists.
- Do not use a clinical reference image as a fake user-image placeholder.
- Hide enlargement controls when there is no image to enlarge.
- Use a persistent expanded comparison with a visible close control rather than press-and-hold interaction.
- Label enlarged content clearly as `Illustrative ref` and `Your image` or the target app's equivalent.

### Reference assets

- Pair variants by stable names, including light and dark skin context where clinically useful.
- Change reference imagery from explicit recorded state such as route, pattern or skin context.
- Give every route a route-appropriate fallback.
- If no safe fallback loads, hide the reference rather than display an unrelated clinical image.
- Keep teaching overlays optional and confined to the enlarged view.
- Put callouts only on image-visible features. Keep history or symptom prompts as written notes.
- Make teaching legends interactive when they connect to concise explanations.
- Compress images only after numerical checks and side-by-side visual review.

Allan reduced 39 active WebP files from `1254 x 1254` to `960 x 960`, saving about `3.51 MiB` while retaining enough detail for an expanded phone view. Treat those dimensions as evidence, not a universal rule.

## 6. State and decision safety

This section is mandatory for any app that presents clinical action, risk or referral guidance.

### Unassessed is not routine

- Fresh load must show `Not assessed yet` or equivalent.
- A fully cleared case must return to the same unassessed state.
- Every select should have an explicit neutral option such as `Not selected`.
- Untouched defaults must not enter scoring or produce reassurance.
- A benign answer chosen by the user may produce a routine result because it is a recorded assessment.
- Untouched report sections must say `not assessed`, not show a default score.

The pure evaluator may use a routine result as its empty technical baseline. The UI still needs a separate `hasAssessment` check so that internal baseline is never presented as a clinical conclusion.

### Separate teaching from action

- Label unvalidated mnemonics or totals as teaching prompts.
- Do not allow a high teaching total to trigger an urgent pathway.
- Base operational urgency only on explicit source-backed findings.
- Keep teaching examples, overlays, active tabs and image selection out of referral logic.
- Never add unrelated teaching totals together to manufacture a higher urgency.

### Use a pure evaluator

Keep DOM reading in the UI layer. Pass a plain assessment object to a separate logic module that contains:

- canonical action labels
- priority values
- explicit tie ranking
- rule thresholds
- driver text
- shared explanation copy

The evaluator should return the winning action, its priority and every driver tied at the winning priority. This makes results explainable and protects clinical logic from visual refactors.

### Combined routes

- Evaluate every route independently.
- Highest urgency wins across routes.
- Resolve equal-priority actions with an explicit rank rather than route order.
- Preserve all winning drivers for the report and explanation.
- Test that changing evaluation order cannot change the result.

### Sequence-dependent controls

When a rule requires a prerequisite:

- disable dependent controls until the prerequisite is recorded
- clear stale dependent values if the prerequisite is removed
- keep defensive handling in the evaluator for impossible restored states
- explain an incomplete sequence rather than silently treating it as negative

Allan uses this pattern for dermoscopy: clues remain disabled until chaos is selected and removing chaos clears prior clue ticks. Copy the state pattern only where the target app has a genuinely sequence-dependent rule.

### Explicit sources of truth

An action such as opening a tab must never stand in for recording that an examination was performed. Use a dedicated control for every finding that affects the report or decision. Recorded values should survive tab changes until the user clears the case.

## 7. Clinical copy and governance

### Copy style

- Use British English.
- Avoid Oxford commas.
- Write for the target user's actual level of training.
- Prefer plain clinical reminders over dense specialist prose.
- Use cautious phrases such as `may`, `can support`, `fits the clinical picture` and `not a stand-alone diagnosis`.
- Keep emergency instructions direct.
- Do not imply diagnosis from an illustrative image or teaching overlay.

### Required clinical review record

Create or update a standalone clinical review file containing:

- app version
- source-review date
- direct links to authoritative sources
- independent clinical sign-off status
- deployment status
- a checklist for terminology, thresholds, emergency triggers, image requirements, privacy wording and report fields
- named reviewer and clinical-owner fields
- a rule that later clinical wording or routing changes require a new review entry and version increment

An engineering review confirms implementation consistency. It does not replace approval by a suitably qualified clinician or local safety lead.

### Do not copy Allan-specific medicine blindly

The following belong to Allan's dermatology workflow and must not be transplanted without independent review:

- its ABCDEFG teaching weights
- its DPIC-R mnemonic
- Chaos + Clues sequencing and exceptions
- BCC and SCC routing distinctions
- Wood's lamp associations
- rash red-flag values
- two-week-wait wording
- its exact action labels and numeric priorities
- its expected two-photo and three-photo sets
- its NICE, RACGP, NHS and DermNet source set

Each sibling app needs sources, terminology, thresholds, report fields and escalation timeframes appropriate to its own clinical domain and local pathway.

## 8. Report, sharing and privacy

Build the report from recorded state, not the active tab.

The report should:

- identify the recorded route or routes
- show the final action and relevant drivers
- say `not assessed` for untouched sections
- include route-appropriate photo readiness
- use the same canonical clinical explanation as the on-screen result
- remain useful as plain text when sharing files is unavailable

Provide:

- a visible report preview
- `Copy note` with a fallback for browsers that block direct clipboard access
- `Share note + photos` when the Web Share API supports it
- clear status for successful sharing, cancellation, unsupported sharing and failure
- original uploaded files as attachments rather than reconstructed preview data
- neutral attachment filenames where appropriate

Privacy wording must match behaviour. State that photos remain in the browser session unless Share is chosen. Do not claim secure storage if the app only holds in-memory browser state.

## 9. New-case reset

Treat reset as a patient-safety boundary.

- Use a deliberate two-step `New` action such as `New` then `Clear?`.
- Clear every capture, finding, score, report field, error message and transient selection.
- Revoke every capture object URL.
- Return the decision panel to `Not assessed yet`.
- Return readiness counts to their empty route values.
- Close open modals, help panels and expanded images.
- Preserve learning achievements only if they are intentionally user-level rather than patient-level state.
- Verify the app remains fully usable immediately after reset.

## 10. Optional learning layer

If the target app includes teaching:

- keep question data in a separate module from DOM behaviour
- divide difficulty into clearly named levels only when this helps the learner
- validate that each question has one valid answer and distinct options
- keep prompts unique across levels
- make progression rules explicit
- keep certificates or achievement codes local unless a real account service exists
- never allow MCQ progress to change patient assessment state
- preserve achievements across New only when that is an intentional product rule

Teaching cards and extra examples belong in secondary navigation. They must not become hidden scoring routes.

## 11. Local runtime and offline release hardening

### Remove normal runtime network dependencies

- Bundle required fonts locally.
- Bundle only the icon font or SVG assets actually used.
- Include upstream licences.
- Remove redundant remote font and icon requests.
- Add a contract test that rejects external runtime scripts and styles.

Clinical source links may remain external. The app should continue to function when those links cannot be reached.

### Manifest

Provide a web app manifest with:

- app name and short name
- concise description
- `lang` set appropriately, normally `en-GB`
- relative `start_url` and scope
- standalone display mode
- matching theme and background colours
- a valid local icon

### Service worker

- Register only when served from HTTP or HTTPS.
- Pre-cache the complete app shell and every active local reference asset.
- Use a versioned cache name.
- Delete older caches for this app during activation. Restrict deletion to the app's cache-name prefix if sibling apps share the same origin.
- Use a navigation fallback to cached `index.html`.
- Ignore query strings when matching cache-busted local assets.
- Handle only same-origin `GET` requests.
- Cache successful same-origin runtime responses where suitable.
- Increment the cache name whenever an offline asset changes.
- Do not cache patient files, object URLs or generated reports.
- Remember that one missing file makes `cache.addAll()` reject the installation. Keep the asset-contract test aligned with the cache list.

Directly opening `index.html` can support basic static use. Installation and service-worker offline behaviour require HTTP or HTTPS.

## 12. Verification strategy

Run checks in layers so a visual pass cannot hide a logic regression.

### Static checks

- Syntax-check every JavaScript module.
- Check for duplicate HTML IDs.
- Check that every `aria-controls` and detail target exists.
- Check that every local runtime file exists.
- Check that no forbidden CDN URL remains.
- Check that every active offline asset appears in the service-worker cache list.
- Check for dead assets, dead JavaScript and unused CSS after the migration.

### Logic tests

Add tests for:

- empty evaluator baseline
- fresh UI state versus assessed routine state
- every explicit urgent trigger
- benign recorded answers
- high teaching totals that must remain non-urgent
- sequence prerequisite present, absent and removed
- defensive handling of stale dependent state
- highest urgency across simultaneous routes
- deterministic ties with all drivers retained
- evaluation-order independence
- report route and expected-photo selection
- explicit `not assessed` report output

### Browser tests at `360 x 740`

Cover at least:

- compact shell loads without console errors
- route tabs and keyboard navigation
- custom listbox keyboard controls
- picker scrolling does not close it
- route-aware photo counts
- accepted and rejected uploads
- capture replacement and preview cleanup
- two-step New reset
- report copy and share fallbacks
- recorded state survives tab changes
- installed app reloads while offline

### Physical-device checks

Record device model, OS version, browser version, available memory, test date and evidence location.

Test:

- camera and gallery input for every supported format
- repeated image replacement on a low-memory handset
- over-limit and unsupported files
- installed offline launch
- app-cache update behaviour
- touch targets and accidental activation
- largest system font and screen magnification
- screen-reader announcements
- browser bars, cut-outs and on-screen keyboard overlap
- copy and share into real target apps
- reset after a complete case

Do not mark physical tests as passed from desktop simulation.

## 13. Recommended implementation order

1. Freeze and record the baseline.
2. Separate patient state, learning state and navigation state.
3. Extract decision logic into a pure module and add tests.
4. Correct unassessed state, prerequisites and tie handling.
5. Implement the shared shell and compact route navigation.
6. Upgrade image capture, object-URL lifecycle and route-aware readiness.
7. Upgrade comparison, teaching help and safe reference fallbacks.
8. Build report, sharing, privacy copy and two-step reset.
9. Localise runtime dependencies.
10. Add manifest, service worker and cache contracts.
11. Add browser regression tests.
12. Optimise assets with visual comparison.
13. Update README, memory bank, clinical review record and device checklist.
14. Run the complete verification set and record remaining gates.

This order reduces the risk of polishing an interface while its underlying state or decision logic is still unsafe.

## 14. What to copy and what to adapt

| Area           | Reuse broadly                                                                  | Adapt for each app                                    |
| -------------- | ------------------------------------------------------------------------------ | ----------------------------------------------------- |
| Shell          | black app bar, compact panels, touch targets, drawer pattern                   | title, accent colour, menu sections, favicon mark     |
| Accessibility  | ARIA tabs, listbox keyboard model, live statuses, modal close behaviour        | labels, control grouping, reading order               |
| Images         | original files plus object URLs, revocation, empty state, validation structure | required captures, formats, limits, reference assets  |
| Decision state | unassessed distinction, pure evaluator, priority and tie model                 | findings, thresholds, action labels, clinical drivers |
| Reporting      | report from recorded state, copy fallback, file sharing, route-aware readiness | report fields, receiving service, attachment rules    |
| Reset          | two-step action, complete patient-state clearing, achievement separation       | exact retained user preferences or learning state     |
| Offline        | local runtime assets, manifest, complete cache, versioned activation           | cache name, icon, asset list, update policy           |
| Tests          | DOM contracts, asset contracts, logic matrix, mobile and offline smoke tests   | clinical cases, routes, supported devices             |
| Governance     | source record, visible sign-off state, versioned clinical changes              | authorities, clinical owner, local deployment policy  |

## 15. Definition of done

The sprint is complete only when all applicable statements are true:

- [ ] The main workflow is usable at `360 x 740` without hidden essential controls.
- [ ] Touch targets and keyboard paths work.
- [ ] Fresh and cleared cases show an unassessed state.
- [ ] Teaching totals cannot produce unsupported urgent actions.
- [ ] Explicit urgent findings match reviewed source rules.
- [ ] Highest urgency and equal-priority ties are deterministic.
- [ ] Tab changes and teaching interactions do not alter assessment state.
- [ ] Upload validation matches across picker and drag-and-drop paths.
- [ ] Original files are retained for sharing and previews use revocable object URLs.
- [ ] New clears all patient state and preserves only intentionally separate state.
- [ ] Reports use recorded findings and mark untouched sections as not assessed.
- [ ] Privacy wording matches actual storage and sharing behaviour.
- [ ] Normal runtime has no CDN dependency.
- [ ] Offline cache includes the full current app shell and active reference set.
- [ ] Static, logic and browser checks pass.
- [ ] README and memory-bank documentation match the implementation.
- [ ] Clinical sign-off status is explicit.
- [ ] Physical-device status is explicit.
- [ ] Any remaining risk is recorded rather than silently deferred.

## 16. Evidence from the Allan sprint

Use these as a proof of principle, not as universal targets:

- Allan v1.2 passes 20 Node tests across referral logic, MCQ data and app contracts.
- The recorded sprint run passes three mobile Chrome smoke tests covering the compact shell, reset and offline reload.
- Runtime fonts and icons are local.
- Service-worker contracts cover the complete app shell and every active WebP reference.
- All 39 active WebP assets were reduced to `960 x 960`, saving about `3.51 MiB`.
- Capture previews moved from base64-style storage to original files plus revocable object URLs.
- The app now has an explicit two-step case reset, route-aware photo readiness, keyboard listbox navigation, visible clinical-review status and a constrained-device checklist.
- Independent clinical sign-off and physical low-memory device acceptance remain pending. Engineering completion did not erase those gates.

## 17. Copy-ready instruction for another coding agent

Copy the block below into the target app task after attaching this playbook:

> Upgrade this app using the attached Allan v1.2 cross-app playbook as the engineering and quality reference. First audit the current implementation, workflow, state model, clinical rules, assets, tests and documentation. Preserve the app's purpose and identity. Reuse the transferable shell, accessibility, image-lifecycle, reset, report, offline and verification patterns. Do not copy Allan's dermatology content, clinical thresholds, action labels, purple accent, asset names, internal IDs or photo counts unless they genuinely match this app and are independently justified. Keep teaching prompts separate from operational decisions. Treat fresh state as unassessed. Centralise decision logic in a pure tested module. Verify the result at `360 x 740`, run all relevant automated checks and record clinical sign-off plus physical-device status honestly. Update the target app's README and memory bank after implementation. Finish with an evidence receipt listing changed files, tests run, visual checks, remaining risks and external approval gates.

## 18. Agent evidence receipt template

Require the implementing agent to finish with:

```text
Target app:
Version:
Date:

Implemented:
-

Adapted rather than copied:
-

Changed files:
-

Automated checks:
- command:
  result:

Mobile visual checks:
- viewport/device:
  flows checked:
  result:

Clinical review:
- sources reviewed:
- independent sign-off:
- deployment status:

Physical-device acceptance:
- status:
- evidence:

Remaining risks or gates:
-
```

The receipt is part of the deliverable. A statement such as “looks good” is not sufficient evidence.
