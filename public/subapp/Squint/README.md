# Squint App

## Receiving host integration — 2 October 2026

Host routes and locale hooks are retained. Service-worker reads remain app-scoped and shared locale assets are precached. Development material is excluded from deployment and offline manifests.

Current receiving-host evidence is in [the integration report](../../../docs/miniapps/20260930/INTEGRATION_REPORT.md). Earlier receipts below remain upstream historical evidence.

## Performance review — 30 September 2026

Runtime source retained. Ordered globals, controller references and presets are used functionality, not candidates for blind removal. Mobile Lighthouse performance: 85 → 85/100 in one paired lab run, not a physical-device speed guarantee.

Shared verification: 24/24 regression jobs, all 15 HTTP and direct-file information/drawer reviews, all 14 Primary quiz workflows and 45 main-page responsive views passed. Selected completed states were also checked. No clinical rules or approved layout were deliberately changed. App-specific asset queries and caches were bumped only where shipped bundles changed. Direct-file checks do not test service workers. Full dead-code elimination, every workflow, offline cache migration and physical-device acceptance are not claimed. The retained Glaucoma tab's real toolbar was verified at 360 x 740 after switching away and back; this does not establish sibling-tab sizes or physical-device acceptance.

[Evidence and remaining priorities](../FLEET_PERFORMANCE_REVIEW_20260930.md). This entry supersedes older performance figures only; earlier clinical and feature history remains below.

## Clinical follow-up — 30 September 2026

No additional production logic change was made after the four-app review. Current simulator contracts and the amended source parity baseline pass. The earlier 30 September review recorded 68/68 preset audits over HTTP and direct-file routes. Preset recognition, pixel offsets and animation behaviour are teaching mechanisms, not independently validated patient diagnosis.

See [the repair receipt](../CLINICAL_LOGIC_FIXES_20260930.md). Independent clinical sign-off and physical-device acceptance remain pending. Earlier preservation statements refer to their dated work, not this authorised follow-up.

## Current fleet UI refinement receipt — 30 September 2026

Bounded scrollable quiz panel; regular answer text; independent wider-screen input/output columns.

App-local versioned `fleet-ui-refinements.css` aligns quiz typography, answer rows, focus outlines and rounding where compatible. Information footers show `v1 · 30/9/2026`. Clinical engines, simulator geometry, authored questions, scoring and progression are unchanged. Earlier dated entries below are historical.

Fleet evidence: 24/24 regression jobs, 45 main-page views, 15/15 HTTP information/drawer reviews, 15/15 direct-file information/drawer reviews and 18/18 selected expanded/completed-state checks. All 14 Primary quiz workflows pass individually; Cataract passed its isolated recheck after one transient connection warning. Automated viewports are temporary. Real Codex retained-toolbar verification remains blocked by the unavailable visible tab; physical-device acceptance and independent clinical sign-off remain pending. See the [full change and verification receipt](../FLEET_UI_REFINEMENTS_2026-09-30.md).

## Fleet repair receipt — 30 September 2026

Removed direct-file font preload CORS errors and corrected the stale footer-date test. Simulator logic is unchanged. Current information footer: `v1 · 30/9/2026`. Runtime HTML changes use an updated app-scoped cache; internal engine/package versions are retained.

Information-panel and drawer checks pass over HTTP and direct-file routes at temporary `360 x 740`. Available popup checks and the Primary quiz state checks pass. Scoped automated test commands pass. See [fleet repair evidence](../FLEET_FIXES_2026-09-30.md) for exact coverage and exclusions. Service workers do not run on `file://`; offline migration, physical-device acceptance and independent clinical sign-off are not established by this repair. The retained Codex flowchart tab was not changed.

Older dated sections below are historical evidence. This receipt supersedes their release-date and verification-status claims, not their recorded clinical decisions.

## Documentation refresh — 29 September 2026

Current visible information footer: `v1 · 29/9/2026`, bottom right in the existing information popup. This entry records a documentation and popup-date synchronisation, not a new clinical audit. App behaviour and the previously recorded verification limits are unchanged. Older dated entries below are historical records, not the current popup date. Independent clinical sign-off and physical-device acceptance are not implied by this date.

## Condition-logic corrections — 29 September 2026

The eight findings in `CONDITION_REVIEW_20260929.md` have targeted source fixes. Manual eye displacement no longer establishes a definite nerve palsy. Jerk fast phases match their intended direction. Cover fixation retains the gaze target, opaque cover blocks torch afferent input and alternate-cover descriptions retain their phase. Dilated is a reversible display overlay: pupil sliders, models, RAPD and preset hints are unchanged. Near respects the authored third-nerve and Duane adduction restrictions while retaining convergence in the INO example.

Vertical phoria now represents a relative deviation: named right/left hyperphoria gives opposite drift when fixation switches. The existing generic decompensating hyper/hypophoria presets refer to patient RE, matching their diagnostic hints. DVD remains a separate upward drift of either covered eye. These are illustrative simulator conventions, not measured prism-dioptre models. Independent clinical sign-off remains pending.

`node tests/interaction-regression.mjs [URL] [isolated-CDP-port]` tests signed movement, cover/light responses, state-preserving dilation, near restrictions and reset output. It defaults to localhost port 8090 and isolated Chrome port 9335. Run it only against an isolated test profile. `tests/review-all-20260929.mjs [isolated-CDP-port]` sweeps all 68 presets at temporary 360 x 740. Neither script establishes persistent Codex toolbar sizing or physical-device acceptance.

The parity baseline changes only three authorised diagnostic strings; it was not wholesale regenerated. No generated simulator bundle exists: the HTML loads the source controllers directly.

## Advanced dependencies and preset finding — 24 July 2026

Direction, Waveform and Rate are now visibly inactive and removed from keyboard focus until Nystagmus is enabled. Presets still write the same nystagmus values and automatically restore those controls when required. Advanced labels now use `Pain / headache` and `Pupils, iris and lids`.

The guide distinguishes direct iris drag for alignment from the Gaze tracker for conjugate movement and muscle demand. The neutral observation now reads `No urgency modifiers selected.` so it does not imply a completed clinical assessment.

The sidebar has a 44px `Find a preset` search field. It filters the existing 68 buttons in place, retains their Alignment / palsy or Pupil and Primary, Intermediate or Advanced grouping, reports the match count and restores the previous open folders when cleared. No preset is removed, reordered or renamed.

Browser-visible assets and the scoped worker use `20260724-squint9`. HTTP and direct-file workflows pass at `360 x 740`, both 68-preset audits pass and the filtered drawer has no overflow. Physical touch-device and installed-PWA offline checks remain pending.

## Result and Advanced-panel clarity — 24 July 2026

The untouched result now reads `No alignment pattern detected.` rather than the internal `nil | nil` fallback. Pattern and transient observations have separate visual rows, and a new gaze action clears a released-cover note so it cannot be mistaken for part of the later gaze finding. The information panel now explains screen-facing RE/LE orientation and the six muscle abbreviations.

The Advanced panel retains every established control and value but now groups them more clearly as Context, Movement and Pupils / lids. Ambiguous labels were expanded, upper-lid sliders show RE and LE, section and control type is larger and Movement selects use a stacked label layout so Direction, Waveform and torsion labels do not clip at `360 x 740`. No preset, gaze vector, cover calculation, pupil model, urgency rule or eye geometry changed.

Browser-visible assets and the scoped worker use `20260724-squint8`. HTTP and direct-file reviews pass at `360 x 740` with no clipped Advanced labels, horizontal overflow, internal information-card scrolling or runtime errors. Both 68-preset audits still pass. The retained Squint tab was refreshed and its real device toolbar remained `360 x 740` after switching to Allan and back.

Interaction and teaching review, 24 July 2026: cover-uncover, alternate-cover and uncover phases now produce explicit observations, with fixation and phoria changes delayed until the circular paddle has settled. Holding `Near` constricts both pupils and adds a small visual-only convergence movement. Manual pupil-size or Dilated edits clear hidden preset pupil physiology so stale Adie, Horner, RAPD or pharmacological behaviour cannot survive a generic edit. A tap or keyboard action now sweeps the torch across the full track in about 700ms, with the active eye transferring at the midpoint. Direct drag remains pointer-attached. Torch strength is zero at the neutral centre, rises progressively across each half of the track and reaches full strength only at the relevant end.

Ambient-light follow-up, 24 July 2026: the word `Light` in the top switch has been replaced by a compact local bulb rotated to read as a downward-facing ceiling light. The switch retains the accessible name `Ambient light`, so the visual distinction between ambient illumination and the lower examination torch is clearer without adding text or changing pupil logic.

Gaze-tracker UI follow-up, 24 July 2026: `Gaze track pad` is now `Gaze tracker`. A compact status pill shows `Primary` or the live gaze direction, the target uses a clearer yellow and black puck with a neutral guide ring and graded muscle activation uses the Squint yellow accent. RE/LE order, tracker geometry, gaze vectors, condition logic and the one-screen layout are unchanged.

Safety wording and teaching structure were also reviewed. Acute pupil-involving and apparently pupil-sparing 3rd nerve patterns retain urgent neurovascular wording, Horner demonstrates mild ptosis, traumatic miosis prompts consideration of traumatic iritis or iris-ciliary injury and generic anisocoria remains descriptive. The 68 presets are now distributed as Primary 10, Intermediate 14 and Advanced 44. The authored MCQ banks contain 10, 14 and 23 non-duplicate questions, sampled as 5, 6 and 8 per attempt.

Eye-scene UI correction, 24 July 2026: the momentary `Near` control is centred directly beneath the torch track as a quiet secondary control. Covering RE or LE shows a distinct full circular paddle rather than a shape clipped to the eye aperture. The paddle remains inside the eye stage and clears the light controls.

Condition-logic correction and full re-audit, 24 July 2026: all 68 presets were rechecked over HTTP and direct-file routes at `360 x 740`. Plain esotropia no longer establishes a 6th nerve palsy and plain miosis no longer establishes Horner syndrome. Specific presets now carry the motility, pupil or cover-test context needed for their teaching labels. A/V exotropia direction, 3rd nerve restrictions, latent and gaze-evoked nystagmus, INO, Duane, DVD, myasthenic variability and pupil near responses were corrected. The free-drag muscle-teaching workflow, black and yellow identity, eye geometry and compact layout remain intact.

Gaze-trackpad correction, 24 July 2026: ordinary conjugate trackpad movement now remains diagnostically normal while continuing to move both eyes and illuminate the extraocular-muscle readout. Direct iris drag and preset offsets still establish alignment findings. Preset-specific underaction, restriction, upshoot and A/V-pattern behaviour remains visible through the gaze controller. No condition, modifier, urgency rule, ocular geometry or layout was changed.

Eye-engine follow-up, 23 July 2026: pupil, upper-lid and iris-fade controls now identify RE and LE consistently. The gaze muscle readout follows the examiner-facing eye order, RE on the screen-left and LE on the screen-right. The centred torch is neutral grey and fade controls expose their pressed state. Contract and refactor-parity checks pass, with simulator logic and eye geometry unchanged.

Review correction, 23 July 2026: MCQ focus return no longer throws, preset notices clear the Light control and the compact simulator controls now have larger hit areas. Cover state is announced, the gaze pad and swinging light have momentary keyboard controls and online navigation checks the network before using the offline shell. Simulator maths and eye geometry are unchanged.

Fleet edge follow-up, 23 July 2026: the principal simulator shells now use exact `10px` outer margins and `340px` width at `360 x 740`. Ocular geometry and analysis logic are unchanged.

## Fleet upgrade status — 23 July 2026

The current engineering review is complete, including the deliberately approved cover, pupil, safety-wording and teaching-bank changes above. Runtime fonts are local, a two-press session reset and scoped offline shell are present, refactor parity passes and all platform contracts pass. The initial normal output remains an intentional teaching scene, not an unassessed patient finding.

Exact `360 x 740` browser evidence passes over HTTP and direct-file routes. Independent clinical sign-off, installed offline review and physical-device testing remain outstanding. See `SQUINT_V1.1_EVIDENCE_RECEIPT.md`.

<!-- APP-DOC-STATUS:START -->

## Current Status (24/7/2026)

- Static packaging: open `index.html` directly; a local HTTP server is optional for testing.
- Mobile target: `360 x 740`, with the main page kept free of required vertical scrolling.
- Shared appbar: `54px` high; `Quicksand` `25px`/`700` title; `44 x 44` burger and info buttons set `12px` from the edges.
- Burger glyph: shared CSS three-bar mark, `18px` wide with `2px` strokes, so no app depends on a bold font glyph.
- Shared side menu: left drawer under the appbar; `min(76vw, 284px)` width; `16px` padding; pale `#f8fbff` surface; blue-grey border; card-style actions with small level dots.
- Appbar content colour: yellow `#ffb000` on a black appbar.
- Favicon: current black-square app favicon with the app letter or letters centred.
<!-- APP-DOC-STATUS:END -->

Clinical teaching simulator for squint, ocular motility and pupil-sign pattern recognition.

## Purpose

1. Let users match what they see at the bedside using a visual binocular simulator.
2. Teach classic patterns through graded preset libraries.
3. Reinforce pattern recognition and triage logic with MCQs.
4. Keep the first page clear at a 360x740 mobile viewport.

## Core Workflow

1. Use the front-page controls for the common viewing state:
   - `Gaze` starts patient-like live gaze movement,
   - `Dilated` enlarges pupils,
   - `Baby` switches the eye scene to the baby scale,
   - `Adv` opens the detailed clinical controls.
2. Use the cover chips for cover-uncover observation, switch directly between RE and LE for alternate cover and release to observe recovery.
3. Use the light pill for torch and RAPD practice; taps and keyboard actions use the full animated sweep while direct drag follows the pointer. Release or a same-side second tap returns the torch smoothly to centre. Hold `Near` to demonstrate pupil constriction and a small visual convergence movement, including tonic Adie and Argyll Robertson teaching patterns.
4. Use the Gaze tracker to examine conjugate gaze, muscle activation and preset-specific motility behaviour.
   - Pointer input remains momentary and returns to primary gaze on release.
   - Keyboard users can hold one or two arrow keys and release them to return to primary gaze.
   - Normal conjugate gaze does not create an alignment diagnosis.
   - Direct iris drag or a preset establishes the abnormal alignment being examined.
5. Add advanced clinical modifiers when needed.
6. Read concise RE/LE output and condition interpretation.
7. Use sidebar teaching sets (`Primary`, `Intermediate`, `Advanced`) and `Test Me`.
8. Use MCQ mode for rapid retrieval practice.

The swinging-light control also accepts Left Arrow and Right Arrow while focused. Releasing the key returns the torch to the centre and switches it off.

## Current UI Hierarchy

1. The main page follows the Fundal Reflex app visual language:
   - black app bar with yellow title and icons,
   - pale compact control cards,
   - dark eye scene,
   - soft rounded result cards.
2. First-page controls stay limited to `Gaze`, `Dilated`, `Baby` and `Adv`.
3. `Adv` holds lower-frequency detail:
   - Sudden,
   - Pain/HA,
   - Trauma,
   - Diplopia,
   - Head tilt,
   - Fatigue,
   - iris colour,
   - RE and LE torsion,
   - nystagmus,
   - pupil size,
   - fade,
   - upper lid.
4. Cover controls are small `RE`/`LE` overlays so they do not compete with the eyes.

## Gaze Behaviour

1. `Gaze` switch runs Fundal Reflex-style live eye movement.
2. Live movement is visual-only and uses `iris.liveGazeOffset`.
3. The gaze track pad is a motility-examination control and uses `iris.gazeOffset` for the visual eye position.
4. The gaze track pad snaps back to primary gaze when released.
5. RE/LE primary-alignment output excludes ordinary `gazeOffset`, live gaze, micro jitter and transient CSS motion.
6. Direct iris drag, presets and the established cover-test displacement remain part of diagnostic alignment.
7. Preset-specific gaze profiles and comparative A/V sampling continue to reveal genuine restriction, underaction, upshoot and pattern change.

## Preset Library

The app includes 68 preset patterns across:

1. Primary: 10 common and foundational patterns.
2. Intermediate: 14 moderate patterns and examination interpretations.
3. Advanced: 44 subtler, urgent or overlap patterns.

Included families cover:

1. Horizontal and vertical squints.
2. 3rd, 4th and 6th nerve palsy patterns.
3. Pupil-driven patterns including Adie's and Horner.
4. Ptosis severity patterns.
5. Higher-complexity patterns such as pupil-sparing 3rd, partial 6th, myasthenic, thyroid restrictive and INO-like.

## Analysis Engine Notes

1. RE/LE hidden output lines are the source for analysis state.
2. Preset-specific disambiguation uses `hint:*` tokens.
3. Manual diagnostic input clears preset hints to avoid stale over-labelling.
4. Modifier flags are appended to RE/LE tokens and shown as concise context notes.
5. Palsy image panel maps to recognised 3rd/4th/6th labels.
6. Looking away from primary gaze is recorded as gaze context, not converted into a new primary-position squint.
7. Plain esotropia, miosis and anisocoria remain descriptive until preset-specific or manually entered context supports a more specific interpretation.
8. Pupil-specific hints suppress contradictory generic pupil notes.
9. Manual pupil-size edits reset preset-specific pupil models, reactivity and RAPD state before recalculation. Dilated is a display-only overlay and preserves these settings.
10. Cover actions write a short observation distinguishing cover-uncover, alternate cover, under-cover drift and uncover recovery.

## Architecture Notes

1. `script.js` is bootstrap-only.
2. Runtime responsibilities are split into focused modules under `src/`.
3. Eye runtime is split by concern:
   - cover/fixation handover,
   - torch/RAPD/ambient pupil response,
   - gaze pad and live gaze,
   - recurrent blink/micro/nystagmus/cyclo effects.
4. Output writing uses stored simulator offsets rather than DOM geometry.

## File Map

1. `index.html`: app shell, controls, sidebar, popup and cards.
2. `style.css`: theme, responsive layout, components and state styling.
3. `src/sim-core.js`: pure simulator constants and colour helpers.
4. `src/preset-runner.js`: preset case execution map.
5. `src/state.js`: shared state and shared helper wrappers.
6. `src/output-writer.js`: RE/LE token output generation.
7. `src/cover-controller.js`: cover test state and fixation handover.
8. `src/light-controller.js`: torch swing, RAPD, ambient and pupil dynamics.
9. `src/eye-effects-controller.js`: blink, micro/background jitter, cyclo and nystagmus loops.
10. `src/eye-controller.js`: draggable eye and per-eye control wrappers.
11. `src/gaze-controller.js`: diagnostic gaze pad, muscle readout and live gaze movement.
12. `src/controls-controller.js`: control wiring and preset apply orchestration.
13. `src/ui-shell.js`: sidebar/info popup/render helpers and preset flash.
14. `script.js`: bootstrap wiring and compatibility exports.
15. `src/analysis-core.js`: pure analysis helper functions.
16. `analysis.js`: rule interpretation and rendering.
17. `src/mcq-data.js`: MCQ question bank.
18. `mcq.js`: MCQ runtime logic.
19. `qa-refactor-check.cjs`: refactor parity harness.

## Local Run

```powershell
python -m http.server 8080
```

Open `http://127.0.0.1:8080/`.

For Codex visual work, use the in-app browser.

## Quick Checks

```powershell
Get-ChildItem -LiteralPath src -Filter *.js | ForEach-Object { node --check $_.FullName }
node --check script.js
node --check analysis.js
node --check mcq.js
node qa-refactor-check.cjs check
npm test
npm run audit:conditions -- "http://127.0.0.1:8090/Squint/index.html" 9335 http
npm run audit:conditions -- "file:///C:/Users/William/Desktop/Arclight%20App/Squint/index.html" 9335 file
npm run browser:review -- "http://127.0.0.1:8090/Squint/index.html" 9335 http
```

## Clinical Scope

1. Teaching and screening support tool.
2. Not a replacement for full orthoptic, ophthalmic or neurological assessment.
3. Engineering re-audit does not constitute independent clinical sign-off.

## Information popup consistency — 23 July 2026

The non-modal information panel now has an effective `44 x 44px` close target and uses the shared `version · date` presentation. Eye rendering, presets, cover behaviour and pupil logic are unchanged.

## Information-card typography and fit — 23 July 2026

The guide uses the fleet role map of Quicksand `14px/700` title, Inter `12.5px/400` body, Inter `11px/800` section labels and Inter `10.5px/700` version text. It requires no internal scrolling at `360 x 740`. The visible app-bar title uses Quicksand `25px/700` and phoria preset labels are upright. Its simple visible `v1` label and fleet-wide `23/7/2026` date occupy the shared bottom-right footer position. The guide now explains Near and the difference between cover-uncover and alternate cover.

## Sidebar consistency — 23 July 2026

The yellow identity, preset structure and simulator controls are unchanged. The drawer uses the fleet `14px` title, `11px` section-label and `12.5px` supporting-copy roles where present. Focus entry, Escape closure and trigger-focus return were verified at `360 x 740`; its longer preset menu retains deliberate vertical drawer scrolling.

## MCQ consistency — 23 July 2026

Primary and Intermediate attempts now sample smaller subsets from the existing authored banks, reducing repeated full-bank retries. Level labels match the fleet and Cup unlocking requires an explicit Advanced pass. The clinical question content is unchanged.

## MCQ and preset review — 24 July 2026

Preset levels were rebalanced to Primary 10, Intermediate 14 and Advanced 44 without removing any of the 68 simulations. The MCQ banks were rewritten and expanded to 10, 14 and 23 questions, with 5, 6 and 8 sampled per attempt. Contracts reject duplicate prompts, duplicate options and invalid answers. Cover tests, pupil responses, cranial-nerve safety, anisocoria, motility restrictions and advanced overlap patterns now sit at more appropriate teaching levels. Independent clinical sign-off remains pending.

## Maintenance refactor — 26 July 2026

Analysis rendering is now event-driven through `squint:outputs-updated`; the legacy 500 ms poll was removed. Control layout refresh uses one animation-frame update rather than a second delayed refresh. Confirmed orphan CSS was removed while the ordered classic-script architecture remains intact for direct-file use. Tests protect the event lifecycle and all 68 condition presets. Simulator logic, clinical wording and layout are unchanged. Independent clinical sign-off and physical-device acceptance remain open.

## MCQ quality and review workflow — 26 July 2026

All 47 authored questions now have stable `squint-{tier}-{NN}` IDs, a concise answer rationale, a named source and an explicit review status. The first Primary cover-uncover question keeps ID `squint-primary-01` and source `aao-cover-tests`, but now states which eye fixes, which eye is uncovered and that the uncovered eye moves to take fixation. Attempt sizes, pass marks, the 68 presets, simulator logic and Cup unlocking are unchanged. Unanswered attempts do not reveal partial grading and focus the first missing answer. Completed attempts show result, explanations and sources before retry.

The final content spot-check retained IDs while removing repetition: `squint-intermediate-11` now tests fixation-target discipline and `squint-advanced-22` tests prism neutralisation, both under `aao-cover-tests`. Source routing now assigns the direct and consensual light-response item `squint-primary-10` to `aao-neuro-pupil-reference`. Retry also returns the MCQ overlay to its top rather than retaining the previous review position.

## Information purpose pass — 27 July 2026

The existing `i` panel now leads with the main interaction: while observing the patient, the user drags each iris to match the eye position seen. It distinguishes the Gaze tracker, cover controls and pupil controls, then states that the simulator supports teaching rather than final diagnosis. No preset, cover-test, pupil or gaze logic changed. The open panel passed the shared non-scrolling `360 x 740` review.

## Fleet UI alignment — 28 September 2026

The information card now uses a `16px` radius and a measured `44 x 44px` close target. Comparable card headings use the fleet `15px/700/1.2` role while compact control labels retain their existing hierarchy. Clean Chromium checks at `360 x 740` found no overflow, no information-card scrolling and no console errors. Cover-test, pupil and gaze logic are unchanged. Physical-device acceptance remains pending.
