# Progress

## Receiving host integration — 2 October 2026

Host routes and locale hooks are retained. Service-worker reads remain app-scoped and shared locale assets are precached. Development material is excluded from deployment and offline manifests. The existing iPhone iris-layout fix is preserved in source and its canonically rebuilt bundle.

Current receiving-host evidence is in [the integration report](../../../../docs/miniapps/20260930/INTEGRATION_REPORT.md). Earlier receipts below remain upstream historical evidence.

## Performance review — 30 September 2026

Already-minified canonical bundle retained. The fleet build now uses this app's own builder rather than bypassing it. Mobile Lighthouse performance: 84 → 84/100 in one paired lab run, not a physical-device speed guarantee.

Shared verification: 24/24 regression jobs, all 15 HTTP and direct-file information/drawer reviews, all 14 Primary quiz workflows and 45 main-page responsive views passed. Selected completed states were also checked. No clinical rules or approved layout were deliberately changed. App-specific asset queries and caches were bumped only where shipped bundles changed. Direct-file checks do not test service workers. Full dead-code elimination, every workflow, offline cache migration and physical-device acceptance are not claimed. The retained Glaucoma tab's real toolbar was verified at 360 x 740 after switching away and back; this does not establish sibling-tab sizes or physical-device acceptance.

[Evidence and remaining priorities](../../FLEET_PERFORMANCE_REVIEW_20260930.md). This entry supersedes older performance figures only; earlier clinical and feature history remains below.

## Current fleet UI refinement receipt — 30 September 2026

Context switches and chooser controls enlarged; marked quiz result appears before the retry actions.

App-local versioned `fleet-ui-refinements.css` aligns quiz typography, answer rows, focus outlines and rounding where compatible. Information footers show `v1 · 30/9/2026`. Clinical engines, simulator geometry, authored questions, scoring and progression are unchanged. Earlier dated entries below are historical.

Fleet evidence: 24/24 regression jobs, 45 main-page views, 15/15 HTTP information/drawer reviews, 15/15 direct-file information/drawer reviews and 18/18 selected expanded/completed-state checks. All 14 Primary quiz workflows pass individually; Cataract passed its isolated recheck after one transient connection warning. Automated viewports are temporary. Real Codex retained-toolbar verification remains blocked by the unavailable visible tab; physical-device acceptance and independent clinical sign-off remain pending. See the [full change and verification receipt](../../FLEET_UI_REFINEMENTS_2026-09-30.md).

## Documentation refresh — 29 September 2026

Current visible information footer: `v1 · 29/9/2026`, bottom right in the existing information popup. This entry records a documentation and popup-date synchronisation, not a new clinical audit. App behaviour and the previously recorded verification limits are unchanged. Older dated entries below are historical records, not the current popup date. Independent clinical sign-off and physical-device acceptance are not implied by this date.

- [x] 26/7/2026 final MCQ evidence: removed adjacent semantic restatements, preserved 16/26/26 banks and 5/6/8 attempts, passed 12/12 tests, exact bundle parity and the isolated `360 x 740` review.

## Maintenance refactor (26/7/2026)

- [x] Removed verified unused retinoscopy state and orphan advanced-control CSS.
- [x] Extended contracts around beam geometry, case mapping and pathology overlays.
- [x] Rebuilt `app.bundle.js` and added exact bundle-parity verification.
- [x] Passed `npm run check` with 11/11 tests.
- [ ] Independent clinical sign-off and physical-device acceptance remain pending.

## Eye-engine consistency follow-up (23/7/2026)

- [x] Corrected radial light-responsive pupil calculation without changing smoothing or case exceptions.
- [x] Added RE/LE names to paired pupil and upper-lid controls.
- [x] Rebuilt `app.bundle.js` from source.
- [x] Passed 7/7 focused contracts and a fresh `360 x 740` HTTP review.
- [ ] Independent clinical sign-off and physical-device review remain pending.

## Fleet alignment update (23/7/2026)

- Aligned the black stage and Action panel to the Swollen Discs `10px` mobile content edge and `340px` width.
- Preserved the `16px` stage and `18px` secondary-panel hierarchy, all internal controls and all teaching logic.
- Clean `360 x 740` browser geometry has no horizontal overflow. Seven direct contracts pass.
- The production bundle was rebuilt with the fleet's existing local esbuild 0.25.5 binary. The app-local dependency is still absent, so the combined npm wrapper cannot start until dependencies are restored.

<!-- APP-DOC-STATUS:START -->

## Current Memory Status (18/5/2026)

- Static packaging: open `index.html` directly; a local HTTP server is optional for testing.
- Mobile target: `360 x 740`, with the main page kept free of required vertical scrolling.
- Shared appbar: `54px` high; `Quicksand` `25px`/`700` title; `44 x 44` burger and info buttons set `12px` from the edges.
- Burger glyph: shared CSS three-bar mark, `18px` wide with `2px` strokes, so no app depends on a bold font glyph.
- Shared side menu: left drawer under the appbar; `min(76vw, 284px)` width; `16px` padding; pale `#f8fbff` surface; blue-grey border; card-style actions with small level dots.
- Appbar content colour: red `#f03b2f` on a black appbar.
- Favicon: current black-square app favicon with the app letter or letters centred.
<!-- APP-DOC-STATUS:END -->

_Last updated: 18/5/2026_

## What Works

- Broad light-patch interaction with centred startup and snap-back
- Bilateral reflex rendering with targeted-eye brightening and fellow-eye dimming
- 32 custom teaching cases, grouped by Primary, Intermediate and Advanced level
- Main-stage `Cases` picker with snapshot cards generated from the live stage
- Case picker level sections:
  - Primary cases `1-8`, open by default, including two poor-view technique cases
  - Intermediate cases `9-22`, folded and ordered from common introductory patterns toward harder patterns
  - Advanced cases `23-32`, folded and ordered from more likely introductory specialist patterns toward harder patterns
- Main-stage `Previous` and `Next` case controls
- Reference photos are accessed from camera icons inside the `Cases` modal, not from the main stage
- `Cases` modal no longer uses category filters in the main flow; complexity is handled through Primary/Intermediate/Advanced fold-up sections and collapsed Similar cases
- 7 photographed cases with contained-aspect-ratio reference photo viewing
- Learn modal with the universal handout:
  - intact one-page handout view
  - cropped panel explanations in plain English, aligned to the Alan25 dim-light, calm-patient and arm's-length technique sequence
  - case buttons back into relevant simulator practice cases
- PDF download, image share action, clearer connected share icon and local repo-hosted fonts
  - rounding now follows the accepted modal hierarchy: soft shell, medium tabs/resource actions, tighter cards and tighter media frames
- Corneal circular highlight now subtly responds to beam bias:
  - active/brighter eye grows slightly
  - fellow/darker eye shrinks slightly
- Corneal reflex position now also has a tiny same-direction response to actual light movement:
  - `2%` of light offset
  - capped at `0.8px` horizontally and `0.6px` vertically
  - separate from diagnostic squint geometry
- Results interpreter with `Referral` first and collapsible detail for `Why`, `Site` and `Likely`
- High-risk result text now uses softer `Possible...` phrasing so the teaching output does not read like a final diagnosis
- Selected case artwork has been retuned for `13`, `14`, `20`, `23` and `26`, including corrected dense-cataract light behaviour and a structural left-eye lens-edge cue for subluxation.
- Eye motion/rendering now has slightly more natural timing: irregular blinks, occasional double-blinks, tiny binocular micro-saccade variance, non-metronomic jitter, eased pupil response and corneal highlight micro-drift.
- Optional `Gaze` mode now adds more obvious patient-like gaze-away shifts every few seconds, then returns to centre.
- Some `Gaze` events are intentionally larger down-gaze shifts with a mild upper-lid drop to add real-life challenge without making every frame unstable.
- `Gaze` now adds subtle whole-face movement and occasional larger random tilts while keeping the light handle fixed.
- Current accepted Gaze/light tuning slows off-centre hand jitter, reduces inter-eye stagger, softens endpoint bounce and keeps tilt visible without making the patient movement feel delayed.
- `Gaze` no longer returns to a perfect straight-ahead rest after every event; it now uses small off-centre resting gaze positions and shorter gaps between shifts.
- `Gaze` now changes reflex brightness from live horizontal eye position: a deviated eye loses its extra squint boost if gaze brings it straight and either eye brightens when voluntary gaze moves it off-axis. The accepted version applies brightness, pupil-fill and slight opacity lift so the normal fellow eye reads clearly.
- Blink and Gaze lid animation timers now restore to stable lid baselines, with the lower lid always reopening to `0px`, so repeated animation cycles should not leave lids stuck partly closed.
- Baby-specific slow/long eyelid closures now only happen when `Baby` and `Gaze` are both enabled.
- Case 24 PCO artwork has been adjusted away from a central PSCLO look toward posterior capsule haze with sheet/fibrotic/pearl-like cues, and the cache-busted render import chain was updated so the live static page loads the changed modules.
- Dynamic realism cues now include gentle beam-crossing brightness ramp, poor-tear-film shimmer, floaters drifting relative to eye movement, media opacity sitting in front of the reflex and pupil-edge crescent clipping.
- Aniridia nystagmus now affects visibility without producing light flashing during light movement over the eye.
- Case thumbnails for `18`, `21`, `23` and `26` were restored from the existing contact sheet after the hand-edited thumbnail repair was rejected.
- Removed the stage-level photo button to reduce toolbar clutter; photo access remains in the `Cases` modal.
- Main visible modifiers:
  - `Gaze`
  - `Dilated`
  - `Baby`
- Baby mode now visibly narrows the eye spacing as well as shrinking the eye model; measured at `360 x 740`, the inner canthus gap changes from about `40px` normally to about `22px` in Baby mode.
- Advanced context modifiers:
  - `Gradual / Sudden`
  - `Glare / Glare on`
- Docked `Adv` control for structural and motion tweaks
- Tiered MCQs rewritten around the actual conditions
- Full MCQ audit completed:
  - Primary has `16` banked questions, samples `5`, pass mark `3`
  - Intermediate has `26` banked questions, samples `6`, pass mark `4`
  - Advanced has `26` banked questions, samples `8`, pass mark `6`
  - answer indexes, four-option structure and option shuffling were verified
  - Primary wording was tightened to avoid advanced disease-name distractors, `leucocoria` and app-navigation distractors
  - the MCQ pass star now renders correctly from a character code
- Timed `Test me` flow with hidden answer masking
- Observation guide with startup cue animation, auto-collapse and manual reopen/close
- Primary cases now use a simpler centred guide: `Match`, `Bright`, `Straight`.
- Primary guide colours are pale white for `Match`, red for `Bright` and blue for `Straight`.
- Intermediate and Advanced cases use the full grouped guide: `Reflex` (`Light`, `Colour`), `Geometry` (`Shape`, `Crescent`), `Surface` (`Cornea`) and `Check` (`Compare`).
- Reopening the collapsed observation-guide chevron now runs a slower teaching replay with green target highlights for the active guide.
- Observation-guide teaching highlights now use stable geometry for connector lines, avoiding line drift during highlight animation.
- The Crescent teaching highlight now targets the actual crescent cap, enlarged to cover the visible region and anchored to the upper pupil edge, with mirrored lower-edge placement for myopia.
- Test mode now correctly locks the visible case-shaping controls, including `Baby`, `Dilated` and `iris`
- Valid About modal HTML structure
- `Quick guide` popup now shows `v1 - 18/5/2026`, starts with a natural fundal reflex definition, explains `fundal` rather than `red`, includes darker pigmentation and orange-yellow or blue-white normal reflexes, adds the practical dim-light/calm-patient/brightness-colour-shape comparison sequence, then gives `Basics` cards for `Match`, `Bright`, `Straight`, compact `More detail` cues, short usage notes and a `Learn from the handout` button
- Learn `Normal can vary` now uses the same pigmentation wording as `Quick guide`: in those with darker pigmentation, a normal reflex may look orange-yellow or blue-white; bright, equal and round is reassuring.
- App bar info control is now a plain red lowercase `i` without the earlier circular outline
- Side menu now uses the same light clinical theme as the rest of the app: off-white panel, blue-grey borders, card-style actions and small coloured level dots instead of a dark separate-feeling menu.
- Case `2. Normal (blue) R & L` now stays in the normal/no-referral path as a blue-white reflex variant with `Referral: None needed`.
- Case `8. R normal, L dark` is kept out of the normal-variation Learn links and remains a unilateral reduced/dark reflex practice case.
- Cases `3. Poor view: looking away` and `4. Poor view: upper lid blocking` are Primary technique cases. They return `? Action: Repeat view / ask for help`, have centred WebP thumbnails and are included in Baby mode.
- Conservative design-system pass added named CSS tokens for spacing, tap targets, radii, motion, focus rings and key surfaces without changing the app-bar height, colours, Quicksand title or Inter UI font
- Header icon buttons and modal close buttons now use larger tap regions while keeping their compact visual appearance
- Case stepper and photo buttons have slightly safer compact tap sizing, and shared focus styling now uses tokenised focus-ring values
- Startup first paint no longer shows a black stage or fades the stage through a pale grey state on phone-sized views:
  - `index.html` provides immediate light page CSS and a dark pre-ready stage fallback
  - `src/app.js` adds `app-ready` once the initial light/reflex controls are revealed
  - `.eyes-wrapper` keeps the loaded dark stage background
- Shared modal-controller behaviour for About, MCQ, Cases and reference-photo dialogs
- MCQ rendering now uses DOM/text-node construction instead of HTML string interpolation
- Remaining avoidable HTML-string rendering has been removed from app code; current checks show no `innerHTML`, `outerHTML` or `insertAdjacentHTML`.
- `src/condition-context-controls.js` now owns the Advanced onset/glare switch rendering and state updates.
- `src/observation-guide.js` now owns observation-guide collapse, replay and target-highlight behaviour.
- `src/app.js` has been reduced from `1138` lines to `464` lines and is now closer to a bootstrap/orchestration module.
- `style.css` is now an ordered manifest that imports responsibility-based CSS files from `styles/`.
- The README now documents a reusable local-app quality template covering module shape, safe DOM rendering, CSS splitting, input discipline and verification.
- The README now documents the handout asset workflow and the `Learn` modal modules.
- Current visual polish direction:
  - tighter rounding on functional controls
  - softer shadows on smaller control surfaces
  - more neutral control borders
  - restrained background glow
  - slightly brighter movable light patch
  - soft Advanced-panel section tinting and coloured labels only, no strong edge rail
  - explicit nested radius hierarchy for Cases and MCQ: soft modal shell, medium bars/buttons, tighter cards and tight inner preview/option rows
  - compact tier marker on the main case trigger

## In Progress

- Ongoing fine-tuning of case realism and interpretation wording
- Small UX polish passes for mobile density and readability

## Known Gaps

- No automated UI test suite
- Case rendering still depends heavily on visual inspection
- Some modifiers intentionally affect only a subset of cases, which can feel inactive
- Real reference photos currently cover only 7 of the 32 cases
- Browser file sharing depends on browser support and may fall back to download, especially from static local serving
- `retinoscopy.js` remains the biggest live rendering hotspot
- `menu-visual-cases.js` is now a fairly dense UI module
- `observation-guide.js` is intentionally self-contained but sizeable because it owns geometry, replay and guide interaction
- cache-busting query strings are still updated by hand during local iteration
- snapshot thumbnails are generated assets, so visual changes to cases may require regenerating `assets/case-thumbnails`
- A bounded Chrome/CDP mobile-state check now covers the first screen, dense Advanced controls, the open menu, expanded result and the two-step reset over both HTTP and direct-file routes.

## Evolution of Decisions

- Shifted fully away from a retinoscopy-style streak simulator into a fundal reflex simulator.
- Replaced the visible case dropdown with a visual picker.
- Changed the visible selector label from `Visual cases` to `Cases`.
- Replaced the modal's hand-built mini-eye previews with real stage snapshots.
- Added optional real-photo references via camera icons instead of trying to make the snapshots do both jobs.
- Added category filters inside the `Cases` modal during an earlier iteration; these were later replaced by level fold-up sections for simpler teaching flow.
- Moved advanced controls into a right-side `Adv` dock.
- Changed the interpreter to a referral-first compact disclosure instead of a flat list.
- Trimmed unused modifier plumbing so the code matches the actual UI.
- Kept the current friendly visual identity, but tuned curves/shadows/borders toward a slightly more precise clinical feel.
- Slightly dulled the shared sclera colour so the eye whites feel less stark against the dark stage and pupils.
- Reworked MCQs so options shuffle with answer keys preserved, advanced requires 6/8, and intermediate/advanced questions lean more on visual pattern recognition.
- MCQ questions have been expanded and re-audited against the current case sections: Primary now has `16` questions for the eight-case set, Intermediate has `26` for common/moderately nuanced cases, including cases `9` and `10`, and Advanced has `26` for specialist/adult-skewed cases.
- The later MCQ audit kept those bank sizes but cleaned Primary distractors so the level is not made easier by obviously advanced or app-specific wrong answers.
- Fixed the MCQ cache chain after adding the intro DOM reference so cached `dom.js` cannot stop MCQ initialization.
- Added iOS viewport hardening for modals with bottom safe-area padding, `dvh` sizing where supported, and contained About popup scrolling.
- Converted referenced JPG photos and PNG case thumbnails to WebP and switched app image references to WebP.
- Deleted the old JPG reference photos and PNG case thumbnails after confirming every one had a WebP replacement.
- Case 18 bilateral aniridia now automatically gets subtle horizontal pendular nystagmus without requiring the Advanced nystagmus toggle, and its visible interpretation/teaching text mentions nystagmus.
- Case 19 iris transillumination interpretation and teaching text now mentions peripheral iridectomy or trauma.
- `Gradual / Sudden` and `Glare` context switches now live in Advanced instead of the main control strip; the main strip keeps only `Baby`.
- Reworked the added motion control into `Gaze`: it sits next to `Baby` and adds extra gaze movement for realism without changing Baby behaviour or creating a full freeze mode.
- Increased the `Gaze` effect so it reads as an inattentive patient shift rather than only subtle jitter.
- Simplified the top slider label to `Colour` and removed the now-unused stacked-label CSS.
- Softened modal close-button focus styling, tightened the 360px Advanced panel spacing, and narrowed/labeled the side menu after a full mobile UI review.
- Simplified the Cases modal into Primary, Intermediate and Advanced fold-up sections; Primary is the basics, Intermediate carries moderately nuanced cases and Advanced contains the specialist/adult-skewed patterns.
- Baby mode now filters `Cases`, previous and next to a tighter 16-case subset, with excluded current cases falling back to `1. Normal (orange-red) R & L`.
- Hypermetropia and myopia are Intermediate-only and are currently cases `9` and `10`.
- The non-functional `Filters` tool was removed from the `Cases` modal, leaving the collapsed `Similar cases` tool.
- A first-screen `Dilated` switch now sets both pupils to a larger geometry size for a useful bigger aperture view.
- Intermediate and Advanced were reordered so each tier starts with the more common or introductory cases and leaves the harder patterns toward the end while keeping contiguous numbering.
- Added vertical light movement, with smaller up/down range and closer vertical arrow hints on the light handle.
- Fixed vertical movement behaviour so static opacity layers stay fixed while the reflex behind them shifts subtly.
- Startup visual handling now favours a dark pre-ready stage plus immediate light page fallback rather than changing the loaded stage colour.
- The app-bar info icon was simplified from circled `i` to plain red `i` after the circled version felt too bold.
- Future UI changes should use the token layer and preserve the current visual language unless the task is explicitly a redesign.
- README and memory banks now preserve the reusable `Fundal Reflex look` so future apps can copy the same compact mobile clinical style.
- Observation-guide replay evolved from word-only auto-collapse into a timed teaching overlay; the accepted Crescent cue is edge-anchored, not a generic full-pupil outline.
- Observation-guide wording evolved again into a two-level model: Primary gets `Match`, `Bright`, `Straight`, while Intermediate and Advanced keep the fuller grouped observation system.
- Baby mode spacing was tightened after visual measurement showed the old scaled-eye layout did not reduce the visible canthus distance enough.
- The April 30 refactor turned the app into a stronger template for other local web apps: small entrypoint, shared state, feature controllers, split CSS, safer DOM rendering and repeatable checks before sharing.
- The later April 30 UI pass aligned Cases, MCQ sidebar and MCQ question areas to the accepted rounding hierarchy while preserving the compact mobile layout.
- The May 1 handout pass made the one-page sheet and the app complementary: the sheet stays mostly language-free and shareable while the app explains each visual group and links the learner into practice cases.
- The later May 1 copy alignment made Alan25 the standard for concise depth: arm's-length fundal reflex, pigmentation/optics, blue-white normal variation with double-checking, equal brightness/colour/shape and moving side to side then closer.

# 23 July 2026 fleet upgrade

- Added two-press session reset without clearing the earned cup.
- Added manifest, service worker and local build declaration.
- Rebuilt `app.bundle.js` from source and passed 7/7 contracts.
- Added explicit clinical and constrained-device statuses.
- Exact `360 x 740` CDP mobile-state capture now passes over HTTP and direct-file routes without horizontal overflow or runtime errors. Physical-device review remains outstanding.

## Information popup consistency — 23 July 2026

- Added an effective `44 x 44px` Quick Guide close target.
- Standardised the version separator.
- Preserved simulator mappings, cases and teaching content.

## Information-card typography and fit — 23 July 2026

- Applied the shared popup type hierarchy.
- Verified a `658.7px` card at `360 x 740` with no internal scrolling.
- Standardised the simple visible `v1` label and `23/7/2026` date in the shared bottom-right footer position.
- Made Cases, Learn, advanced controls and colour anchors upright while retaining italics for clinical observation cues.

- Standardised the sidebar hierarchy and added verified focus entry and Escape focus return.
- Standardised MCQ labels and hardened Cup unlocking while preserving the authored reflex bank and simulator behaviour.

## Maintenance refactor - 26 July 2026

- Removed proved-unused retinoscopy state and orphan styles.
- Expanded geometry and pathology contracts.
- Rebuilt the generated bundle from source.
- Passed 11/11 contracts, parity and HTTP/direct-file fleet checks at `360 x 740`.

## 26 July 2026 MCQ pass

- Audited all 68 questions and preserved attempt sizes.
- Added stable IDs, rationales, source metadata and review statuses.
- Narrowed the white-pupil item to urgent referral via the local pathway.
- Added explanatory marking, unanswered result focus and a fresh New set.
- Raised compact answer rows to a 44px minimum.
- Rebuilt the bundle and passed 12/12 contracts plus exact parity.
- Independent clinical sign-off and physical-device acceptance remain pending.

## Lighthouse bundle remediation - 27 July 2026

- [x] Applied one shared minified build contract to production and parity generation.
- [x] Rebuilt the bundle and confirmed exact SHA-256 parity.
- [x] Passed 13/13 tests and isolated `360 x 740` review.
- [x] Cleared the unminified-JavaScript audit and improved Lighthouse performance from `77` to `85`.
- [ ] Independent clinical sign-off and physical-device acceptance remain pending.
