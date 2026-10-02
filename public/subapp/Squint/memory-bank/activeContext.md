# Active Context

## Receiving host integration — 2 October 2026

Host routes and locale hooks are retained. Service-worker reads remain app-scoped and shared locale assets are precached. Development material is excluded from deployment and offline manifests.

Current receiving-host evidence is in [the integration report](../../../../docs/miniapps/20260930/INTEGRATION_REPORT.md). Earlier receipts below remain upstream historical evidence.

## Performance review — 30 September 2026

Runtime source retained. Ordered globals, controller references and presets are used functionality, not candidates for blind removal. Mobile Lighthouse performance: 85 → 85/100 in one paired lab run, not a physical-device speed guarantee.

Shared verification: 24/24 regression jobs, all 15 HTTP and direct-file information/drawer reviews, all 14 Primary quiz workflows and 45 main-page responsive views passed. Selected completed states were also checked. No clinical rules or approved layout were deliberately changed. App-specific asset queries and caches were bumped only where shipped bundles changed. Direct-file checks do not test service workers. Full dead-code elimination, every workflow, offline cache migration and physical-device acceptance are not claimed. The retained Glaucoma tab's real toolbar was verified at 360 x 740 after switching away and back; this does not establish sibling-tab sizes or physical-device acceptance.

[Evidence and remaining priorities](../../FLEET_PERFORMANCE_REVIEW_20260930.md). This entry supersedes older performance figures only; earlier clinical and feature history remains below.

## Clinical follow-up — 30 September 2026

No additional production logic change was made after the four-app review. Current simulator contracts and the amended source parity baseline pass. The earlier 30 September review recorded 68/68 preset audits over HTTP and direct-file routes. Preset recognition, pixel offsets and animation behaviour are teaching mechanisms, not independently validated patient diagnosis.

Current receipt: `../../CLINICAL_LOGIC_FIXES_20260930.md`. Independent clinical sign-off and physical-device acceptance remain pending. Treat older dated entries as historical.

## Current fleet UI refinement receipt — 30 September 2026

Bounded scrollable quiz panel; regular answer text; independent wider-screen input/output columns.

App-local versioned `fleet-ui-refinements.css` aligns quiz typography, answer rows, focus outlines and rounding where compatible. Information footers show `v1 · 30/9/2026`. Clinical engines, simulator geometry, authored questions, scoring and progression are unchanged. Earlier dated entries below are historical.

Fleet evidence: 24/24 regression jobs, 45 main-page views, 15/15 HTTP information/drawer reviews, 15/15 direct-file information/drawer reviews and 18/18 selected expanded/completed-state checks. All 14 Primary quiz workflows pass individually; Cataract passed its isolated recheck after one transient connection warning. Automated viewports are temporary. Real Codex retained-toolbar verification remains blocked by the unavailable visible tab; physical-device acceptance and independent clinical sign-off remain pending. See the [full change and verification receipt](../../FLEET_UI_REFINEMENTS_2026-09-30.md).

## Fleet repair receipt — 30 September 2026

Removed direct-file font preload CORS errors and corrected the stale footer-date test. Simulator logic is unchanged. Current information footer: `v1 · 30/9/2026`. Runtime HTML changes use an updated app-scoped cache; internal engine/package versions are retained.

Information-panel and drawer checks pass over HTTP and direct-file routes at temporary `360 x 740`. Available popup checks and the Primary quiz state checks pass. Scoped automated test commands pass. See [fleet repair evidence](../../FLEET_FIXES_2026-09-30.md) for exact coverage and exclusions. Service workers do not run on `file://`; offline migration, physical-device acceptance and independent clinical sign-off are not established by this repair. The retained Codex flowchart tab was not changed.

Older dated sections below are historical evidence. This receipt supersedes their release-date and verification-status claims, not their recorded clinical decisions.

## Documentation refresh — 29 September 2026

Current visible information footer: `v1 · 29/9/2026`, bottom right in the existing information popup. This entry records a documentation and popup-date synchronisation, not a new clinical audit. App behaviour and the previously recorded verification limits are unchanged. Older dated entries below are historical records, not the current popup date. Independent clinical sign-off and physical-device acceptance are not implied by this date.

29 September 2026: source fixes implement all eight condition-audit findings. Dilated is now display-only and no longer clears pupil physiology, RAPD, authored slider values or preset hints (superseding the July description below). Manual displacement cannot establish a definite third/fourth palsy. Cover retains target gaze and phase, blocks torch afferent input and invalidates queued callbacks on reset. Near restrictions match the third-nerve/Duane examples, with INO convergence preserved. Relative vertical phoria uses patient RE for the generic decompensating examples, consistent with existing hints; named laterality is retained and DVD remains distinct. Signed movement and state regression checks are in `tests/interaction-regression.mjs`. Independent clinical sign-off and physical-device acceptance remain pending.

Advanced dependency and preset-finding follow-up, 24 July 2026: Direction, Waveform and Rate are disabled and visually quiet until Nystagmus is on, including correct preset-driven re-enabling. The guide distinguishes iris drag from Gaze tracker, neutral observations say `No urgency modifiers selected.` and the sidebar filters all 68 existing presets in place with count and Escape-to-clear behaviour. HTTP and direct-file reviews and both 68-preset audits pass at `360 x 740`. Cache and browser-visible assets use `20260724-squint9`.

Result and Advanced-panel clarity follow-up, 24 July 2026: untouched output uses `No alignment pattern detected.` and separates Pattern from Observations. Starting non-primary gaze clears a released-cover observation when no eye remains covered. The guide explains screen-facing RE/LE orientation and the muscle abbreviations. Advanced retains the same controls and values but uses clearer Context, Movement and Pupils / lids hierarchy, explicit RE/LE upper-lid labels and non-clipping stacked Movement selects. HTTP and direct-file reviews and both 68-preset audits pass at `360 x 740`. Cache and browser-visible assets use `20260724-squint8`.

Gaze-tracker UI follow-up, 24 July 2026: the card is titled `Gaze tracker`, its existing direction status is now visible and the target puck and graded muscle activation use the Squint yellow accent. HTTP and direct-file reviews confirm a centred 22px target, correct `Primary` and `Up-right` states, a 360px document, no overflow and no runtime errors. Both 68-preset audits still pass.

Torch and ambient-light follow-up, 24 July 2026: tap and keyboard torch actions use a 700ms full-track sweep with the active side changing at the midpoint. Direct dragging remains pointer-attached. Torch strength now follows position: zero at centre, about half midway to an eye and full only at the end. The top ambient switch uses a downward-facing ceiling-light bulb symbol while retaining the accessible name `Ambient light`. HTTP and direct-file mobile workflows plus both 68-preset audits pass at `360 x 740`.

Interaction and teaching review, 24 July 2026: cover logic now waits for the 1080ms paddle settle and writes separate cover-uncover, alternate-cover, under-cover and uncover observations. `Near` adds 4px visual-only convergence alongside pupil constriction. Manual pupil-size and Dilated edits reset pupil models, reactivity, RAPD and preset hints. Torch crossing is 0.28s and physiological side transfer is 460–880ms.

Teaching sets remain 68 presets but are distributed Primary 10, Intermediate 14 and Advanced 44. MCQ banks contain 10, 14 and 23 non-duplicate questions with 5, 6 and 8 sampled per attempt. 3rd nerve, Horner, traumatic pupil and generic anisocoria wording received the recorded safety corrections. HTTP and direct-file condition and UI reviews pass at `360 x 740`. Independent clinical sign-off, installed-offline review and physical-device testing remain pending.

Eye-scene UI correction, 24 July 2026: `Near` is centred beneath the torch track. The RE/LE cover action displays a responsive circular paddle with a visible rim, remains contained inside the stage and does not overlap the light controls. The `360 x 740` browser contract records both relationships.

Condition-logic correction, 24 July 2026: the full 68-preset browser audit now passes over HTTP and `file://` at `360 x 740`. Plain esotropia and unilateral miosis remain descriptive rather than automatically becoming 6th nerve palsy or Horner syndrome. Specific cranial-nerve and pupil presets use explicit context hints. Dynamic checks cover 3rd, 4th and 6th nerve patterns, all four A/V patterns, latent and gaze-evoked nystagmus, INO, Duane, DVD, myasthenia and near responses. Independent clinical sign-off remains pending.

Gaze-trackpad correction, 24 July 2026: normal trackpad movement now remains `RE: normal | LE: normal` in all eight named directions while continuing to animate both eyes and activate the muscle readout. Primary-alignment output excludes ordinary `gazeOffset`. Direct iris drag, preset offsets, cover behaviour, preset hints and comparative gaze cues remain active. Brown, Duane and A-pattern browser checks pass alongside the 68-preset parity harness.

Eye-engine follow-up, 23 July 2026: paired pupil, upper-lid and iris-fade controls now identify RE and LE consistently. The gaze muscle readout follows examiner view, RE on the screen-left and LE on the screen-right. The resting torch pill is neutral grey and fade buttons expose their pressed state. Contracts and refactor parity pass with simulator logic and eye geometry unchanged.

Review correction, 23 July 2026: fixed MCQ focus return, preset-notice overlap, compact touch areas, cover-state announcements and keyboard access to gaze and swinging-light controls. Online navigation is now network-first with an offline fallback. Simulator logic and eye geometry are unchanged.

Fleet edge follow-up, 23 July 2026: principal simulator shells measure `x=10`, `width=340` at `360 x 740`; ocular geometry and analysis logic are unchanged.

<!-- APP-DOC-STATUS:START -->

## Current Memory Status (24/7/2026)

- Static packaging: open `index.html` directly; a local HTTP server is optional for testing.
- Mobile target: `360 x 740`, with the main page kept free of required vertical scrolling.
- Shared appbar: `54px` high; `Quicksand` `25px`/`700` title; `44 x 44` burger and info buttons set `12px` from the edges.
- Burger glyph: shared CSS three-bar mark, `18px` wide with `2px` strokes, so no app depends on a bold font glyph.
- Shared side menu: left drawer under the appbar; `min(76vw, 284px)` width; `16px` padding; pale `#f8fbff` surface; blue-grey border; card-style actions with small level dots.
- Appbar content colour: yellow `#ffb000` on a black appbar.
- Favicon: current black-square app favicon with the app letter or letters centred.
<!-- APP-DOC-STATUS:END -->

Date: 18/5/2026
Repo: `Arclight App/Squint`

## Current Snapshot

1. One-page teaching app tuned for a 360x740 mobile viewport.
2. Visual direction now follows the Fundal Reflex app more closely: black app bar, yellow title, pale rounded control cards and a dark Fundal-style eye scene.
3. The front-page control hierarchy is deliberately small: `Gaze`, `Dilated`, `Baby` and `Adv`.
4. `Adv` holds lower-frequency clinical controls: Sudden, Pain/HA, Trauma, Diplopia, Head tilt, Tired, iris colour, nystagmus, cyclo, pupil size, fade and upper lid.
5. The gaze track pad remains visible as the motility-examination control.
6. The eye scene uses small `RE`/`LE` cover overlays rather than large cover pills.
7. The `Gaze` switch now runs Fundal Reflex-style live gaze movement rather than showing or hiding the track pad.
8. Live gaze uses separate `liveGazeOffset` values so animation does not contaminate RE/LE diagnostic output.
9. Output writing now uses the stored manual, preset and established cover offsets for primary alignment. Ordinary trackpad `gazeOffset`, live animation, micro jitter and transient transitions do not create false palsy text.
10. Sidebar supports preset teaching sets and MCQ levels.
11. Preset library totals 68 patterns across Primary, Intermediate and Advanced.
12. Analysis uses RE/LE output strings plus preset hint tokens.
13. Preset level counts are 10/14/44 and MCQ bank counts are 10/14/23.
14. `coverObservation` records the active cover-test phase and manual pupil edits clear hidden pupil physiology.

## Recently Completed

1. Copied the Fundal Reflex UI direction into Squint:
   - compact top controls,
   - Fundal-style dark eye card,
   - rounded pale cards,
   - clearer first-page hierarchy.
2. Removed reflex colour from the main workflow and moved iris/pupil/lid detail into `Adv`.
3. Added main-page `Gaze`, `Dilated` and `Baby` controls.
4. Reworked `Gaze` so it starts live patient gaze movement:
   - `src/gaze-controller.js` owns the live gaze timer,
   - `src/state.js` stores `isLiveMotionEnabled` and `gazeShiftTimerId`,
   - `src/eye-controller.js` composes `liveGazeOffset` into the visual transform.
5. Kept the gaze examination pad separate:
   - `iris.gazeOffset` is the momentary examination position,
   - `iris.liveGazeOffset` is only ambient/live motion.
6. Restored gaze pad snap-back to primary gaze on pointer release.
7. Updated output writing to ignore live gaze movement, ordinary conjugate trackpad gaze and other ambient motion while retaining manual and preset alignment.
8. Replaced large `Cover` eye-scene pills with smaller Fundal-style `RE`/`LE` overlays.
9. Verified in the Codex in-app browser:
   - `Gaze` on animates eyes,
   - gaze pad stays visible,
   - results remain `RE: normal | LE: normal` when no diagnostic offset is set,
   - `Gaze` off resets live movement.
10. Earlier refactor work remains in place:

- `src/sim-core.js`,
- `src/preset-runner.js`,
- `src/analysis-core.js`,
- `src/mcq-data.js`,
- focused runtime modules under `src/`,
- `script.js` as bootstrap-only wiring.

## Key Runtime Behaviour

1. `src/state.js` owns shared mutable runtime state.
2. `src/output-writer.js` owns RE/LE token output composition from stored offsets.
3. `src/eye-controller.js` owns drag/slider/fade wrappers and visual transform composition.
4. `src/gaze-controller.js` owns the diagnostic gaze pad and live gaze movement.
5. `src/light-controller.js` owns torch/RAPD/ambient pupil dynamics.
6. `src/cover-controller.js` owns cover state and fixation handover timing.
7. `src/eye-effects-controller.js` owns blink, micro, cyclo and nystagmus loops.
8. `src/controls-controller.js` owns front controls, advanced controls and preset apply.
9. `src/ui-shell.js` owns sidebar and info popup behaviour.
10. `script.js` only bootstraps module init and compatibility globals.
11. `analysis.js` parses hidden RE/LE lines and renders interpretation.
12. `mcq.js` owns quiz state and marking.

## Open Follow-Up

1. Optional: keep refining exact Fundal-style proportions for the eye scene at 360x740.
2. Optional: split remaining `analysis.js` render/rule blocks into smaller modules.
3. Optional: extend the browser review from the current MCQ open/close, preset, cover, keyboard and reset checks to full MCQ scoring and manual-edit hint clearing.

# Fleet upgrade — 23 July 2026

Simulator maths and outputs remain unchanged. Local fonts, deliberate session reset, scoped PWA support and platform contracts were added. Initial normal output is deliberate teaching state. Exact `360 x 740` HTTP and direct-file browser evidence now passes. Physical-device, installed offline and clinical gates remain open.

## MCQ consistency status — 23 July 2026

Primary attempts sample four questions and Intermediate attempts sample five from the existing authored pools. Advanced samples eight. This provides retry variation without changing question content. Cup unlocking requires explicit Advanced pass evidence.

## Maintenance refactor — 26 July 2026

Analysis output now refreshes only on initialisation and the existing `squint:outputs-updated` event. Layout-driven output refresh uses one animation frame. The ordered direct-file script chain and all 68 presets remain authoritative. Clinical and physical-device gates remain open.

## MCQ quality pass — 26 July 2026

All 47 questions now use stable IDs, rationales, named sources and explicit review status. `squint-primary-01` retains its ID and `aao-cover-tests` source while explicitly stating fixation and the observed movement. Incomplete attempts reveal no grading. Results, explanations, sources and retry are shown only after a complete submission. The 68 presets and simulator logic remain unchanged.

The final content spot-check changed `squint-intermediate-11` to fixation-target discipline, `squint-advanced-22` to prism neutralisation and corrected `squint-primary-10` to the pupil source. Retry now resets the overlay scroll position.
