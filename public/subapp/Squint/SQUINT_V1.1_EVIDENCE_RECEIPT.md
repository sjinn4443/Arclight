# Squint v1.1 evidence receipt

## Advanced dependencies and preset finding — 24 July 2026

### Changed

- `src/controls-controller.js` and `style.css`: Direction, Waveform and Rate now use native disabled state, `aria-disabled` and a quiet card treatment until Nystagmus is enabled. Manual changes, reset and preset application resynchronise them.
- `index.html`: expanded `Pain / headache` and `Pupils, iris and lids`.
- `index.html`: guide now distinguishes direct iris drag for alignment from Gaze tracker movement and muscle demand.
- `analysis.js` and `index.html`: neutral observation now reads `No urgency modifiers selected.`.
- `index.html`, `src/ui-shell.js` and `style.css`: added a 44px preset search, polite match count, in-place filtering, Escape clearing and restoration of prior folder state.
- `index.html` and `service-worker.js`: advanced browser-visible assets and the app-scoped cache to `20260724-squint9`.
- All 68 preset values, labels, levels and catalogue order remain unchanged.

### Verification

- Syntax checks, `npm test` and `npm run parity`: passed.
- HTTP and direct-file browser workflows passed at `360 x 740` with no clipped labels, horizontal overflow, information-card scroll or runtime errors.
- Both routes verify all three nystagmus dependencies disabled when off and enabled when on.
- Searching `duane` returns the existing `Duane type I-like` button, reports `1 of 68 presets` and Escape restores all 68 buttons while keeping the drawer open.
- HTTP and direct-file condition audits: 68/68 passed on both routes.
- Evidence: `output/playwright/squint-http-dense-360x740.png`, `output/playwright/squint-http-info-360x740.png`, `output/playwright/squint-http-drawer-filter-360x740.png`, `output/playwright/squint-mobile-report-http.json` and direct-file counterparts.
- Physical touch-device, installed-PWA cold-start, offline review and independent clinical sign-off remain pending.

## Result and Advanced-panel clarity — 24 July 2026

### Changed

- `analysis.js`, `index.html` and `style.css`: replaced the visible neutral `nil | nil` fallback with `No alignment pattern detected.` and separated Pattern from transient Observations with a clearer type hierarchy.
- `src/cover-controller.js` and `src/gaze-controller.js`: a later non-primary gaze action clears the released-cover observation when no eye is covered. Active cover findings and cover calculations remain unchanged.
- `index.html`: added concise examiner-facing RE/LE orientation and SR, IR, MR, LR, SO and IO expansion to the information guide.
- `index.html` and `style.css`: strengthened Context, Movement and Pupils / lids hierarchy, expanded unclear labels, added visible RE/LE upper-lid labels and stacked Movement select labels to prevent clipping.
- `index.html` and `service-worker.js`: advanced browser-visible assets and the scoped cache to `20260724-squint8`.
- No preset, gaze vector, muscle demand, cover calculation, pupil model, urgency rule, eye geometry or condition threshold changed.

### Verification

- JavaScript syntax checks, `npm test` and `npm run parity`: passed.
- HTTP and direct-file browser workflows passed at `360 x 740`, each with a `360px` document, no clipped Advanced labels, no horizontal overflow, no information-card scroll and no runtime errors.
- The browser workflow confirms the neutral result has two rows, gaze Up-right clears `Uncover:` and the Advanced panel retains Context, Movement and Pupils / lids with 10.88px section labels and 12.48px control labels.
- HTTP and direct-file condition audits: 68/68 passed on both routes.
- The retained Squint tab was refreshed twice. Its real device toolbar read `360 x 740` before setting, after setting and after switching to Allan and back.
- Evidence: `output/playwright/squint-http-untouched-360x740.png`, `output/playwright/squint-http-dense-360x740.png`, `output/playwright/squint-http-info-360x740.png`, `output/playwright/squint-mobile-report-http.json` and direct-file counterparts.
- Independent clinical sign-off, physical-device review and installed-PWA cold-start and offline review remain pending.

## Gaze-tracker UI follow-up — 24 July 2026

- `index.html`: renamed `Gaze track pad` to `Gaze tracker`, exposed the existing `gaze-status` direction and updated the accessible tracker name.
- `style.css`: added a compact Primary/direction pill, a 22px yellow and black target puck, a neutral guide ring and yellow graded muscle activation.
- `index.html` and `service-worker.js`: advanced browser-visible assets and the app-scoped cache to `20260724-squint7`.
- No gaze vector, muscle demand, motility profile, diagnostic output, preset, eye geometry or clinical wording changed.
- `npm test`, `npm run parity` and JavaScript syntax checks passed.
- HTTP and direct-file browser workflows passed at `360 x 740` with a `360px` document, no overflow and no runtime errors.
- Both 68-preset condition audits passed.
- The retained Squint tab was refreshed twice, then its real device toolbar read `360 x 740` before setting, after setting and after switching to Allan and back.
- Evidence: `output/playwright/squint-http-untouched-360x740.png`, `squint-http-gaze-tracker-active-360x740.png` and direct-file counterparts.

## Torch sweep and ambient-light distinction — 24 July 2026

### Changed presentation and interaction

- `src/light-controller.js`: tap and keyboard actions move the torch through a 700ms full-track ease, transfer the active side at the midpoint and return smoothly to centre. Direct pointer drag remains direct. A smoothstep gain makes illumination zero at centre, progressive across each half-track and full only at the end.
- `index.html` and `style.css`: replaced the top ambient `Light` text with a compact local bulb SVG rotated to read as a downward-facing ceiling light. The switch retains the accessible name `Ambient light` and a `44 x 44px` touch target.
- `index.html` and `service-worker.js`: advanced browser-visible assets and the app-scoped cache to `20260724-squint6`.
- No clinical rule, pupil model, preset, MCQ, cover-test action, eye geometry or diagnostic wording changed.

### Verification

- `node --check src/light-controller.js`, `node --check tests/browser-review.mjs`, `npm test` and `npm run parity`: passed.
- HTTP and direct-file browser workflows passed at `360 x 740` with a `360px` document, no overflow and no runtime errors.
- Recorded animated sweep positions progress from `0` through approximately `0.14` and `0.55` to `1`, with glow strength falling from `0.86` through `0.69` and `0.03` before returning to `0.86` on the other eye.
- Recorded direct-drag glow strength is approximately `0.05` just beyond centre, `0.55` midway towards the eye and `0.86` at the end.
- HTTP and direct-file condition audits: 68/68 passed on both routes.
- The retained Squint tab was refreshed twice, then its real device toolbar read `360 x 740` before setting, after setting and after switching to Allan and back.
- Visual evidence: `output/playwright/squint-http-untouched-360x740.png`, `squint-http-light-drag-slight-360x740.png`, `squint-http-light-sweep-mid-360x740.png`, `squint-http-light-sweep-right-360x740.png` and direct-file counterparts.
- Independent clinical sign-off, physical-device review and installed-PWA cold-start/offline review remain pending.

## Interaction, safety and teaching-bank review — 24 July 2026

### Changed behaviour

- `src/cover-controller.js`, `analysis.js` and `style.css`: aligned cover logic with the visible 1080ms paddle movement and added distinct cover-uncover, alternate-cover, under-cover and uncover observations.
- `src/light-controller.js`, `src/eye-controller.js` and `script.js`: added 4px visual-only Near convergence, retained pupil constriction and slowed torch crossing and pupil-transfer timing.
- `src/state.js` and `src/controls-controller.js`: generic manual pupil and Dilated edits now clear hidden pupil models, reactivity, RAPD and preset hints.
- `src/analysis-core.js` and `src/preset-runner.js`: strengthened 3rd nerve safety wording, corrected pupil-sparing nuance, made Horner ptosis mild and refined traumatic miosis and generic anisocoria guidance.
- `src/sim-core.js`, `src/mcq-data.js` and `mcq.js`: retained all 68 presets while rebalancing them 10/14/44. Expanded the non-duplicate MCQ banks to 10/14/23 with 5/6/8 sampled per attempt.
- `index.html`: expanded the concise guide while retaining the fleet-wide visible date `23/7/2026`.
- `service-worker.js`: advanced the app-scoped cache to `squint-v1-1-20260724-squint4`.

### Verification

- `npm test`: passed.
- `npm run parity`: passed against the refreshed intentional baseline.
- HTTP and direct-file condition audits: 68/68 passed at `360 x 740`.
- HTTP and direct-file browser workflows: passed with a 360px document, no horizontal overflow and no runtime errors.
- Dynamic evidence protects Near convergence and release, pupil constriction, manual physiology reset, cover timing and cover observations.
- Visual evidence: `output/playwright/squint-http-near-360x740.png`, `squint-http-cover-360x740.png`, `squint-http-info-360x740.png` and their direct-file counterparts.
- Reports: `output/playwright/squint-condition-audit-http.json`, `squint-condition-audit-file.json`, `squint-mobile-report-http.json` and `squint-mobile-report-file.json`.

### Open gates

Independent clinical sign-off, physical-device review and installed-PWA cold-start/offline review remain pending.

## Eye-scene UI correction — 24 July 2026

- `style.css`: centred the momentary `Near` control beneath the torch track and restored the cover occluder outside the clipped eyelid aperture. The responsive 122px paddle at `360 x 740` has a visible rim, remains inside the stage and clears the light controls.
- `tests/browser-review.mjs`: added exact Near-centre and below-slider checks plus settled cover circularity, size, containment, edge and control-clearance checks.
- `index.html` and `service-worker.js`: advanced the stylesheet and app-scoped cache to `20260724-ui4`.
- `npm test`, `npm run parity` and the full HTTP browser workflow pass.
- Fresh `360 x 740` evidence records a `0px` Near centre delta, a circular `122.39px` cover paddle, a `360px` document and no runtime errors.
- The retained Codex Squint tab was reloaded, then its real device-toolbar values were re-read as `360 x 740` after switching to Allan and back.
- Evidence: `output/playwright/squint-mobile-report-ui4.json`, `squint-ui4-untouched-360x740.png` and `squint-ui4-cover-360x740.png`.

## Full condition correction and re-audit — 24 July 2026

### Changed behaviour

- `src/analysis-core.js`, `analysis.js` and `src/preset-runner.js`: removed automatic 6th nerve and Horner overdiagnosis, added condition-specific hints, suppressed conflicting generic pupil notes and corrected angle-closure guidance.
- `src/gaze-controller.js`: added 3rd nerve dynamic restriction and corrected all four A/V pattern directions and cues. Duane now narrows the fissure on adduction.
- `src/eye-effects-controller.js`: latent nystagmus now requires dissociation and changes fast-phase direction with the covered eye. Gaze-evoked nystagmus has a primary null, follows lateral gaze and appears in upgaze. INO adds fellow abducting nystagmus and myasthenia varies over time when fatigability is active.
- `src/light-controller.js`, `index.html` and `style.css`: added a compact momentary `Near` control. Adie and Argyll Robertson demonstrate their near response while pharmacological mydriasis remains fixed.
- `src/mcq-data.js`: corrected A-pattern exotropia, Adie, Horner, 4th nerve and 6th nerve teaching wording.
- `tests/run-tests.cjs`: protects all 68 preset handlers, the diagnostic safety rules, A/V classification and corrected MCQs.
- `tests/condition-audit.mjs`: records one row per preset and tests the dynamic behaviours separately.
- `service-worker.js`: the later eye-scene UI correction advanced the app-scoped cache to `squint-v1-1-20260724-ui4`.

### Verification receipt

- `npm test`: passed.
- `npm run parity`: passed against the refreshed intentional clinical baseline.
- HTTP condition audit: 68/68 passed at `360 x 740`, document width `360px`, no runtime errors.
- Direct-file condition audit: 68/68 passed at `360 x 740`, document width `360px`, no runtime errors. Service workers do not run on `file://`.
- Full browser workflow review: untouched, dense, information, drawer, MCQ, completed, reset, cover, keyboard, normal gaze and abnormal motility states passed at `360 x 740`.
- Evidence JSON: `output/playwright/squint-condition-audit-http-final.json` and `output/playwright/squint-condition-audit-file-final.json`.

### Remaining gates

Independent clinical sign-off, physical-device testing and installed-PWA cold-start/offline testing remain open.

## Gaze-trackpad diagnostic-state correction — 24 July 2026

- `src/output-writer.js`: introduced a named diagnostic-offset calculation that retains manual drag, preset and established cover offsets but excludes ordinary conjugate `gazeOffset`.
- `src/eye-controller.js` and `src/gaze-controller.js`: unchanged. They continue composing visible trackpad movement, muscle activation and preset-specific motility profiles.
- `tests/run-tests.cjs`: added pure contracts proving gaze-only displacement is diagnostically neutral and that established diagnostic offsets remain included.
- `tests/browser-review.mjs`: added functional coverage for eight normal gaze directions, direct outward and down-and-out alignment, Brown restriction, Duane restriction and A-pattern sampling.
- `index.html` and `service-worker.js`: versioned the corrected output writer and advanced the app-scoped cache to `squint-v1-1-20260724-gaze1`.

`npm test`, JavaScript syntax checks and `node qa-refactor-check.cjs check` pass. The isolated HTTP browser review passed at exactly `360 x 740` with a `360px` document, loaded local fonts and no runtime errors. All eight normal gaze directions retained `RE: normal | LE: normal` while activating between two and six muscle chips. Direct outward displacement retained `LE: medium out` without a 3rd nerve suggestion. Direct down-and-out displacement retained the existing possible 3rd nerve pattern. Brown, Duane and A-pattern motility checks retained their distinct restriction or comparative cues.

At that gaze-only correction stage, the clinical condition bank, modifiers, urgency wording, preset values, cover behaviour, ocular geometry and layout were not changed. The later condition-logic correction recorded above deliberately supersedes that statement where it identifies specific teaching-logic and wording changes. Independent clinical sign-off, installed offline review and physical-device review remain pending.

## Eye-engine consistency follow-up — 23 July 2026

- `index.html`: corrected upper-lid laterality labels, standardised RE/LE pupil names, added side-specific fade-button names and placed the gaze muscle columns in examiner-facing RE-left and LE-right order.
- `src/eye-controller.js` and `src/controls-controller.js`: synchronised fade buttons with `aria-pressed` during manual use, presets and reset.
- `style.css`: made the centred torch pill neutral grey while retaining yellow only for active illumination.
- `tests/run-tests.cjs`: added contracts for laterality, gaze order, fade state and final cache version.
- `service-worker.js`: bumped the scoped cache and stylesheet reference to `20260723-eye1`.

`npm test` and `npm run parity` pass. Fresh HTTP review at exactly `360 x 740` confirmed RE on the screen-left, LE on the screen-right, correct advanced-control names, a neutral centred torch and a working `Fade RE iris` pressed state that produces `RE: faded`. There were no browser warnings or errors. Alignment, motility, pupil, cover, gaze and analysis logic are unchanged.

### UI polish

The black and yellow identity, ocular geometry, stage and result radii, compact hierarchy and established one-screen composition remain unchanged. The changes remove misleading state colour and laterality ambiguity without adding rows, moving the eyes or altering simulator output.

The automated review loaded final assets with cache and service-worker bypass in its disposable test tab because an older local worker initially served the previous stylesheet. The app-scoped cache version is bumped, but retained review tabs may need an ordinary refresh. Current direct-file browser rechecking was blocked by the browser-control URL policy. Earlier direct-file evidence remains recorded below and service workers do not run on `file://` pages.

## Review correction — 23 July 2026

The MCQ close error, preset-notice collision, compact hit areas, cover announcement and pointer-only gaze and light controls were corrected. Online navigation is now network-first with a cached offline fallback. Ocular geometry, preset values, analysis rules and MCQ content are unchanged.

Fleet edge follow-up, 23 July 2026: at `360 x 740`, principal simulator shells measure `x=10`, `width=340` with no horizontal overflow. Ocular geometry and analysis logic are unchanged.

Date: 23 July 2026

## Changed files

- Runtime: `index.html`, `src/ui-shell.js`, `mcq.js`, `session-reset.js`, `pwa.js`, `manifest.webmanifest`, `service-worker.js`, `src/cover-controller.js`, `src/gaze-controller.js`, `src/light-controller.js`.
- Presentation: `style.css`.
- Verification: `package.json`, `tests/run-tests.cjs`, `tests/browser-review.mjs`.
- Documentation: gap list, clinical status, device checklist, README, all memory-bank files and this receipt.

## Preservation evidence

- `node qa-refactor-check.cjs check`: passed.
- The ocular alignment, motility, cover, gaze, pupil and analysis controllers remain unchanged. `src/ui-shell.js` and `mcq.js` received focus and ARIA state handling only. MCQ content and scoring were not changed.
- The initial `RE: neutral`, `LE: neutral` markup is locked by contract as teaching simulator state.

## Other checks

- `node tests/run-tests.cjs`: all contracts passed.
- All runtime and new support JavaScript passed `node --check`.
- Local HTTP returned 200 for the updated shell and exposed the `20260723-eye1` asset version.
- Google Fonts and all other runtime URLs were removed from `index.html`.
- `tests/browser-review.mjs` now fails on MCQ focus loss, runtime errors, preset-notice overlap, undersized principal hit areas, stale cover announcements or broken keyboard controls.

## Browser evidence and gates

Exact isolated Chrome/CDP review passed over HTTP and direct-file routes at `360 x 740`. Untouched normal teaching state, dense Advanced controls, information dialog, full drawer, Exotropia (L), armed reset and completed reset states were captured in `output/playwright/`. Document width remained `360px`, local fonts loaded and no runtime errors were recorded.

The information dialog and drawer receive and contain keyboard focus. The drawer now has a visible 44px close control and the app-bar menu button toggles the open state. The reset confirmation remains readable after scrolling the drawer and the second press restores the normal teaching scene.

Physical-device review, installed offline review and independent clinical sign-off remain open. The app has no local Git repository so recovery relies on fleet backup arrangements.

The fresh correction-state HTTP review is complete. Retained tabs may still show an older cached stylesheet until refreshed.

## MCQ quality receipt — 26 July 2026

- Scope: 47 questions across Primary, Intermediate and Advanced, with existing attempt sizes and pass marks preserved.
- Data evidence: stable IDs, one keyed answer, rationales, source keys and explicit review status are enforced by `tests/run-tests.cjs`.
- Clinical wording evidence: `squint-primary-01` retains its ID and `aao-cover-tests` source while explicitly stating fixation and the movement observed.
- Interaction evidence: unanswered fail-safe without partial reveal, first-missing focus, result-first hierarchy, explanations, source display and retry labels are protected by contract.
- Clinical boundary: all 68 presets, simulator calculations, analysis logic, scoring and Cup rules are unchanged. Independent clinical sign-off remains pending.
- Runtime evidence: `npm test`, `npm run parity` and `npm run audit:conditions` passed.
- Browser-visible assets and app cache: `20260726-mcqquality2` after the retry-scroll and content spot-check corrections.
- Remaining gates at that stage were physical-device review and installed offline review; isolated browser evidence is recorded below.

Content spot-check evidence: `squint-intermediate-11` now tests fixation-target discipline and `squint-advanced-22` tests prism neutralisation, both with `aao-cover-tests`. `squint-primary-10` now routes to `aao-neuro-pupil-reference`. IDs and the 10, 14 and 23 bank sizes are unchanged.

### Isolated MCQ browser evidence

The reproducible path is `tests/mcq-browser-path.js`. Temporary Playwright automation at `360 x 740` recorded a `360px` client and scroll width, a full-height `360 x 740` overlay panel, 44px minimum option rows, first-unanswered focus with no partial review, five rationales and five source records after grading and a zero scroll position after retry. Console and page-error collections were empty. Screenshots are `output/playwright/mcq-unanswered-360x740.png` and `output/playwright/mcq-result-review-360x740.png`.

This MCQ path was rerun over HTTP only. Earlier direct-file evidence remains recorded, but service workers do not operate on `file://`. Retained Codex browser toolbar state was not changed. Remaining gates are physical-device review, installed offline review and independent clinical sign-off.
