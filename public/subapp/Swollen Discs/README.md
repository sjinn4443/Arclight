# Swollen Discs

## Receiving host integration — 2 October 2026

Host routes and locale hooks are retained. Service-worker reads remain app-scoped and shared locale assets are precached. Development material is excluded from deployment and offline manifests.

Current receiving-host evidence is in [the integration report](../../../docs/miniapps/20260930/INTEGRATION_REPORT.md). Earlier receipts below remain upstream historical evidence.

## Performance review — 30 September 2026

Production bundle minified from its canonical source. Shipped JavaScript: 162,234 → 76,876 bytes. Mobile Lighthouse performance: 88 → 95/100 in one paired lab run, not a physical-device speed guarantee.

Shared verification: 24/24 regression jobs, all 15 HTTP and direct-file information/drawer reviews, all 14 Primary quiz workflows and 45 main-page responsive views passed. Selected completed states were also checked. No clinical rules or approved layout were deliberately changed. App-specific asset queries and caches were bumped only where shipped bundles changed. Direct-file checks do not test service workers. Full dead-code elimination, every workflow, offline cache migration and physical-device acceptance are not claimed. The retained Glaucoma tab's real toolbar was verified at 360 x 740 after switching away and back; this does not establish sibling-tab sizes or physical-device acceptance.

[Evidence and remaining priorities](../FLEET_PERFORMANCE_REVIEW_20260930.md). This entry supersedes older performance figures only; earlier clinical and feature history remains below.

## Current fleet UI refinement receipt — 30 September 2026

Interpretation-card rounding refined; existing compact hierarchy and accent retained.

App-local versioned `fleet-ui-refinements.css` aligns quiz typography, answer rows, focus outlines and rounding where compatible. Information footers show `v1 · 30/9/2026`. Clinical engines, simulator geometry, authored questions, scoring and progression are unchanged. Earlier dated entries below are historical.

Fleet evidence: 24/24 regression jobs, 45 main-page views, 15/15 HTTP information/drawer reviews, 15/15 direct-file information/drawer reviews and 18/18 selected expanded/completed-state checks. All 14 Primary quiz workflows pass individually; Cataract passed its isolated recheck after one transient connection warning. Automated viewports are temporary. Real Codex retained-toolbar verification remains blocked by the unavailable visible tab; physical-device acceptance and independent clinical sign-off remain pending. See the [full change and verification receipt](../FLEET_UI_REFINEMENTS_2026-09-30.md).

## Fleet repair receipt — 30 September 2026

Deferred modal focus until drawer closure completes and added an integration regression for that order. Rebuilt the UI bundle. Current information footer: `v1 · 30/9/2026`. Runtime HTML changes use an updated app-scoped cache; internal engine/package versions are retained.

Information-panel and drawer checks pass over HTTP and direct-file routes at temporary `360 x 740`. Available popup checks and the Primary quiz state checks pass. Scoped automated test commands pass. See [fleet repair evidence](../FLEET_FIXES_2026-09-30.md) for exact coverage and exclusions. Service workers do not run on `file://`; offline migration, physical-device acceptance and independent clinical sign-off are not established by this repair. The retained Codex flowchart tab was not changed.

Older dated sections below are historical evidence. This receipt supersedes their release-date and verification-status claims, not their recorded clinical decisions.

## Documentation refresh — 29 September 2026

Current visible information footer: `v1 · 29/9/2026`, bottom right in the existing information popup. This entry records a documentation and popup-date synchronisation, not a new clinical audit. App behaviour and the previously recorded verification limits are unchanged. Older dated entries below are historical records, not the current popup date. Independent clinical sign-off and physical-device acceptance are not implied by this date.

## Corrections verified — 29 September 2026

- Failed or loading images clear the previous picture. Failed loads show a retry control.
- Timed rounds wait for the requested image before starting the viewing clock. Failed loads abort without awarding a result and stale callbacks cannot restart an exited round.
- Storage denial no longer prevents startup. Saved progression remains optional.
- Mobile cataract keeps blur, contrast and saturation as well as brightness and occlusion. Physical-device performance still needs acceptance testing.
- Results explicitly describe a teaching example. Guide wording distinguishes poor views and haemorrhage from defining swelling features. Existing referral timings are unchanged.
- Each timed set covers all three image classes before repeats and preserves vertical anatomy. The three-source-image bank is familiarisation, not clinical certification.
- Four repetitive Advanced questions now test applied interpretation. All 30 questions retain tier ownership and scoring, have app-scoped IDs with legacy IDs retained and declare pending independent clinical sign-off.
- `npm test`, lint, isolated browser checks (including offline and direct-file use) and targeted failure tests pass. Dependency audit reports zero vulnerabilities after compatible development-tool updates.
- Codex retained tab: real toolbar changed from 1416 x 1192 to 360 x 740 and remained 360 x 740 after switching to Refract and back. This is separate from automated viewport testing.

Evidence: `AUDIT_2026-09-29.md` and `output/playwright/swollen-fixes-20260929.json`. Independent clinical review and physical-device acceptance remain pending.

<!-- APP-DOC-STATUS:START -->

## Current Status (26/7/2026)

- Static packaging: `index.html` still opens directly through the classic generated bundle. Use `npm start` to enable installation and scoped offline caching.
- Offline shell: `manifest.webmanifest` and `service-worker.js` cache the app shell, local fonts and all adaptive image variants. The worker registers only on HTTP(S).
- Session safety: the drawer includes a two-press **New training session** action which reloads the controls, viewer and any active practice flow while retaining separately earned local progress.
- Verification: the complete logic suite, lint, formatting and isolated Chrome checks cover the generated-bundle contract, 360 x 740 states, reset, offline reload and direct-file use.
- Mobile target: `360 x 740`, with the main page kept free of required vertical scrolling.
- UI alignment: the black viewer now shares the full content width of the control and interpretation cards at the compact review viewport. Empty timed-test status space is removed outside timed practice so the complete initial state still fits.
- Shared appbar: `54px` high; `Quicksand` `25px`/`700` title; `44 x 44` burger and info buttons set `12px` from the edges.
- Burger glyph: shared CSS three-bar mark, `18px` wide with `2px` strokes, so no app depends on a bold font glyph.
- Shared side menu: left drawer under the appbar; `min(76vw, 284px)` width; `16px` padding; pale `#f8fbff` surface; blue-grey border; card-style actions with small level dots.
- Appbar content colour: red `#f03b2f` on a black appbar.
- Favicon: current black-square app favicon with the app letter or letters centred.
- MCQ quality: all 30 questions now have stable tier placement, a single best answer, an explanatory rationale and explicit source-review status. The learning MCQs are untimed because the app already has a separate timed-recognition mode.
<!-- APP-DOC-STATUS:END -->

Interactive ophthalmology teaching app for recognising normal, suspicious and definitely swollen optic discs.

The app is intentionally mobile-first. The usual review size is `360 x 740`, with tablet and laptop views kept as a centred single-column app rather than a split desktop layout.

## What It Teaches

- Compare normal, suspicious and definitely swollen discs.
- Practise narrow, standard and dilated fields of view.
- Switch between right eye and left eye orientation.
- Scan around the disc and retina on a canvas rather than relying on one static crop.
- Add cataract as a viewing challenge.
- Practise with tiered MCQ sets and timed hidden-answer sets.

## Current Feature Set

- Three disc states:
  - `Normal`: crisp disc margins, visible cup, healthy colour and vessels
  - `Suspicious`: halo or nasal elevation without major vessel obscuration
  - `Swollen`: elevation with vessel obscuration, haemorrhages or both
- Adaptive image loading:
  - phones and coarse-pointer devices use `2048w` WebP assets
  - larger screens use full-resolution WebP assets
  - URL override via `?images=mobile` or `?images=full`
- Canvas viewer with drag scanning, gaze shift and cataract overlay.
- FOV slider for `4°`, `8°` and `15°` viewing.
- Cataract remains a slider with labelled stops, using the same dark circular thumb style as the FOV slider.
- Tiered MCQ flow:
  - Primary
  - Intermediate
  - Advanced
  - untimed learning attempts with 3/4, 4/5 and 6/7 pass marks
  - answer explanations, fresh retry and text result export
- Tiered timed test flow with disabled submit until an answer is selected.
- Local cup achievement after both Advanced sets are completed.
- Desktop-only phone-size preview for checking mobile realism.
- Laptop layout stays in the same single-column shape as mobile review.

## Applied UI Style

This app now follows the reusable Fundal Reflex visual language:

- black app bar with red title and compact red icon controls
- Quicksand title font and Inter UI font loaded from local WOFF2 assets
- quiet white/off-white control cards with blue-grey borders
- dark clinical viewing stage
- viewer, control and interpretation edges aligned at the compact mobile breakpoint
- compact mobile-first rows
- Fundal-style range controls with dark circular slider thumbs
- compact grey/red switch styling for binary controls
- light side menu with small coloured level dots
- progressive disclosure for MCQ and timed levels
- soft modal shells, medium action rows, tighter question cards and tighter option rows
- short in-app copy rather than a manual

Keep future UI changes conservative. Prefer existing tokens, compact controls and clear state changes over decorative panels.

## Usage

1. Serve the folder locally, for example `npm start`.
2. Open the local server URL in a browser.
3. Use the disc state buttons to switch between `Normal`, `Suspicious` and `Swollen`.
4. Use the FOV slider, eye toggle and cataract slider to change the viewing challenge.
5. Drag on the canvas to scan around the retina.
6. Open the quick guide from the red `i`.
7. Open the menu for MCQ, timed sets and certificate progress.

## Project Structure

- `index.html`: page shell, controls, modal shells and app mounting points
- `styles.css`: visual system, layout, menus, modals and responsive rules
- `script.js`: app bootstrap and controller wiring
- `viewer.js`: canvas viewer, image loading, gaze shift and cataract rendering
- `viewer-math.js`: pure viewer geometry helpers
- `app-constants.js`: tier, image, cataract and explanation configuration
- `image-assets.js`: adaptive image-set selection
- `mcq-engine.mjs`: pure MCQ selection, scoring and result formatting
- `mcq-controller.js`: MCQ modal flow and tier progression
- `questions.js`: source-labelled 30-question bank and review metadata
- `timed-test.js`: timed test flow and scored rounds
- `modal-manager.js`: side menu, modal state and focus handling

## Local Checks

```powershell
npm test
npm run lint
npm run format:check
npm run test:browser
```

For UI work:

- run `npm start` for the local HTTP and offline checks; direct-file launch remains supported
- check the first screen at `360 x 740`
- check the menu, quick guide, MCQ modal and timed mode
- watch for console errors, horizontal overflow and clipped labels

## Known Constraints

- Scores and achievements are stored locally in the browser.
- The certificate is a local practice certificate, not external verification.
- Existing trusted rendering paths still use limited `innerHTML` for result and explanation markup.
- The normal condition is an initial teaching comparison state, not a patient assessment or recorded clinical conclusion.
- Independent clinical review and physical-device checks remain external gates; see `CLINICAL_REVIEW.md` and `DEVICE-TEST-CHECKLIST.md`.

## Information popup consistency — 23 July 2026

The modal Quick Guide now combines its compact visible close control with an effective `44 x 44px` target and uses the shared `version · date` presentation. Disc simulation, case behaviour and grading content are unchanged.

## Information-card typography and fit — 23 July 2026

The guide now uses the fleet scale of `14px` title, `12.5px` body, `11px` section labels and `10.5px` version text. It measured `442px` at `360 x 740` and required no internal scrolling. Its simple visible `v1` label and current `23/7/2026` date now occupy the shared bottom-right footer position.

## Main-page typography review — 23 July 2026

The four disc-observation prompts now use `10px` helper text beneath their existing headings. The comparison layout, retina viewer and teaching-state behaviour are unchanged. The fresh `360 x 740` page has no horizontal overflow.

## Sidebar consistency — 23 July 2026

The red identity and existing teaching actions are unchanged. The drawer uses the fleet `14px` title, `11px` section-label and `12.5px` supporting-copy roles where present. Opening now moves focus to the first available drawer control and Escape closes the drawer and returns focus to its trigger at `360 x 740`.

## MCQ clinical-quality pass — 26 July 2026

The 30-question bank now follows the Modified Frisén Scale rather than treating Grade 3 as the start of definite swelling or haemorrhage as a grade threshold. Primary covers recognition and safe interpretation, Intermediate covers defining features and common pitfalls and Advanced covers exact grade distinctions and scale limitations. Every question has a stable ID, one best answer, an explanatory rationale and recorded source status. The MCQ modal uses 44px answer rows, visible correct and incorrect states, a real fresh retry and reliable focus return at `360 x 740`.

The separate timed image-recognition mode is unchanged. MCQs are deliberately untimed so the two learning modes no longer duplicate timing pressure. Independent clinical sign-off remains pending.

## Maintenance refactor — 26 July 2026

The generated bundle is now rebuilt with locally pinned esbuild `0.25.5` and protected by exact parity. Information-dialog ownership is centralised in the existing modal controller instead of duplicate inline handlers. Confirmed orphan CSS was removed and a genuine unanswered-MCQ reference error was corrected to use the established result element. Direct-file use, viewer teardown, simulation state and teaching logic remain unchanged. Independent clinical sign-off and physical-device acceptance remain open.

## Information purpose pass — 27 July 2026

The existing `i` panel now tells the user to compare normal, suspicious and swollen examples, then select the appearance that best matches the disc seen. It states that the simulator supports referral recognition but does not grade or diagnose a patient's disc. No viewer, grading or referral logic changed. The open panel passed the shared non-scrolling `360 x 740` review.

## Fleet UI alignment — 28 September 2026

The information card now uses the shared `16px` radius and a measured `44 x 44px` close target. Three pixels of mobile document overflow were removed without changing the established stage or referral card. Clean Chromium checks at `360 x 740` found an exact document fit, no information-card scrolling and no console errors. Viewer, grading and referral logic are unchanged. Physical-device acceptance and independent clinical sign-off remain pending.
