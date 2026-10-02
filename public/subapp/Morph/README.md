# Morph

## Receiving host integration — 2 October 2026

Host routes and locale hooks are retained. Service-worker reads remain app-scoped and shared locale assets are precached. Development material is excluded from deployment and offline manifests.

Current receiving-host evidence is in [the integration report](../../../docs/miniapps/20260930/INTEGRATION_REPORT.md). Earlier receipts below remain upstream historical evidence.

## Performance review — 30 September 2026

Runtime source retained. A suitably sized derived logo is a future asset-delivery opportunity; original artwork was not altered. Mobile Lighthouse performance: 95 → 95/100 in one paired lab run, not a physical-device speed guarantee.

Shared verification: 24/24 regression jobs, all 15 HTTP and direct-file information/drawer reviews, all 14 Primary quiz workflows and 45 main-page responsive views passed. Selected completed states were also checked. No clinical rules or approved layout were deliberately changed. App-specific asset queries and caches were bumped only where shipped bundles changed. Direct-file checks do not test service workers. Full dead-code elimination, every workflow, offline cache migration and physical-device acceptance are not claimed. The retained Glaucoma tab's real toolbar was verified at 360 x 740 after switching away and back; this does not establish sibling-tab sizes or physical-device acceptance.

[Evidence and remaining priorities](../FLEET_PERFORMANCE_REVIEW_20260930.md). This entry supersedes older performance figures only; earlier clinical and feature history remains below.

## Current fleet UI refinement receipt — 30 September 2026

Control-card rounding aligned while preserving its dark theme and visual teaching layout; no MCQ bank exists.

App-local versioned `fleet-ui-refinements.css` aligns quiz typography, answer rows, focus outlines and rounding where compatible. Information footers show `v1 · 30/9/2026`. Clinical engines, simulator geometry, authored questions, scoring and progression are unchanged. Earlier dated entries below are historical.

Fleet evidence: 24/24 regression jobs, 45 main-page views, 15/15 HTTP information/drawer reviews, 15/15 direct-file information/drawer reviews and 18/18 selected expanded/completed-state checks. All 14 Primary quiz workflows pass individually; Cataract passed its isolated recheck after one transient connection warning. Automated viewports are temporary. Real Codex retained-toolbar verification remains blocked by the unavailable visible tab; physical-device acceptance and independent clinical sign-off remain pending. See the [full change and verification receipt](../FLEET_UI_REFINEMENTS_2026-09-30.md).

## Documentation refresh — 29 September 2026

Current visible information footer: `v1 · 29/9/2026`, bottom right in the existing information popup. This entry records a documentation and popup-date synchronisation, not a new clinical audit. App behaviour and the previously recorded verification limits are unchanged. Older dated entries below are historical records, not the current popup date. Independent clinical sign-off and physical-device acceptance are not implied by this date.

## Corrections — 29 September 2026

BIO now rotates the fundus image 180 degrees. Rx scaling is Direct-only; the previous Direct selection returns when switching back. Field sizes and magnification are explicitly illustrative, not calibrated optics. Mobile and desktop use the same cataract blur, contrast and saturation filter. Aperture bounds now intersect the visible canvas with the image. Guide Shift+Tab stays inside the popup. Field/Rx buttons expose selected state and have 44px-high targets; Field widths remain compact. Same-image selection comparison and image-load feedback are corrected. Artwork is unchanged.

Verification: 11 unit/contracts tests, the established offline/reset/Cup browser suite and `node tests/logic-browser.mjs`. Physical-device performance and independent clinical sign-off remain pending. Clinical orientation reference: https://eyewiki.aao.org/Binocular_Indirect_Ophthalmoscopy. Cache: 20260929-logic1.

Maintenance refactor, 26 July 2026: viewer geometry, cataract presets, corneal jitter and animation ownership now use a small pure local module. Corneal animation advances within the single main frame loop rather than starting a second loop. Starting the loop is idempotent and page lifecycle cleanup is explicit. The inline app, artwork, controls and layout remain established. Ten tests and syntax checks pass. Independent clinical sign-off and physical-device acceptance remain pending.

Fleet edge follow-up, 23 July 2026: the former `7px` mobile override is corrected so the controls and black stage use exact `10px` outer margins and `340px` width at `360 x 740`. Simulator geometry and logic are unchanged.

<!-- APP-DOC-STATUS:START -->

## Current Status (23/7/2026)

- Static packaging: `index.html` still opens directly. Serve the folder over local HTTP to install the scoped service worker and verify offline use.
- Offline shell: `manifest.webmanifest` and `service-worker.js` cache the app shell, local fonts and six teaching images. The worker registers only on HTTP(S), so direct-file use remains unaffected.
- Session safety: the side menu provides a two-press **New training session** action which reloads the app into its original teaching state.
- Verification: `npm test` runs six contract checks. `npm run test:browser` exercises untouched, dense, menu, reset and offline states in isolated Chrome at `360 x 740`.
- Mobile target: `360 x 740`, with the main page kept free of required vertical scrolling.
- Shared appbar: `54px` high; `Quicksand` `25px`/`700` title; `44 x 44` burger and info buttons set `12px` from the edges.
- Burger glyph: shared CSS three-bar mark, `18px` wide with `2px` strokes, so no app depends on a bold font glyph.
- Shared side menu: left drawer under the appbar; `min(76vw, 284px)` width; `16px` padding; pale `#f8fbff` surface; blue-grey border; card-style actions with small level dots.
- Appbar content colour: white on the established black appbar.
- Favicon: current black-square app favicon with the app letter or letters centred.
<!-- APP-DOC-STATUS:END -->

Morph is a compact fundus-view simulator for teaching how the optic nerve and macula view changes with field size, refractive error, cataract and patient movement.

It is designed as a mobile-first teaching app, with the working reference viewport set at 360 x 740. It is a teaching aid, not a diagnostic tool.

## Current UI Direction

- Keep the black app bar with white text.
- Keep the small cartoon character beside the centred Morph title.
- Keep the black clinical stage.
- Use the Fundal Reflex and Swollen Discs visual language for controls: compact rows, clear hierarchy, strong touch targets and restrained clinical colour.
- Keep the first-page control hierarchy as Cataract, Field, Rx then Condition and Adult/Child.
- Split Field visually into Direct fields for 5, 8 and 15 degrees and BIO fields for 25, 35 and 45 degrees.
- Use symbolic Rx buttons: `+++`, `++`, `0`, `--` and `---`.
- Keep the Adult/Child control as a switch.
- Keep Condition as a dropdown on the main screen.
- Keep the side menu for Conditions only.
- Do not restore the duplicate stage toolbar text above the canvas.
- Do not restore the Zoom control.

## Engine Notes

- Cataract presets and occlusion spots match the Swollen Discs app constants.
- The corneal reflex uses the Swollen Discs lower-ellipse shape, opacity model and movement behaviour.
- The circular viewing-window edge uses the Swollen Discs layered ring rather than a single hard white stroke.
- Mouse dragging follows the pointer; touch and pen movement anchors the viewing circle above the contact point so the hand does not cover the view.
- Background movement uses Swollen Discs-style patient motion, tuned down slightly for Morph, with small continuous jitter and a periodic shift-and-return gaze movement. Child mode makes this slightly livelier.
- Pathology artwork is drawn at its original full-image scale. Do not crop, reframe or zoom these assets in code unless the artwork itself is replaced.

## Files

- `index.html` contains the app structure and canvas engine.
- `styles.css` contains the visual system and responsive layout.
- `assets/fonts/` contains local Inter and Quicksand font files copied from the Swollen Discs/Fundal Reflex UI pattern.
- `assets/images/ret180.webp`, `assets/images/S.webp`, `assets/images/C.webp`, `assets/images/crvo.webp` and `assets/images/zyx.webp` are the fundus images.
- `assets/images/morph.webp` is the small cartoon character in the app bar.
- `manifest.webmanifest` and `service-worker.js` provide the installable, app-scoped offline shell.
- `tests/` contains the contract and browser verification checks.

## Quick Checks

Install the local test dependency once with `npm install`, then run:

Useful syntax check:

```powershell
npm test
npm run test:browser
```

The browser check expects Morph to be served at `http://127.0.0.1:8769` unless `MORPH_BASE_URL` is set. Physical-device verification and independent clinical content review remain external gates; see `DEVICE-TEST-CHECKLIST.md` and `CLINICAL_REVIEW.md`.

## Information popup consistency — 23 July 2026

The focus-managed Quick Guide now has an effective `44 x 44px` close target and a release-style `version · date` line. Viewer mathematics, images and teaching controls are unchanged.

## Information-card typography and fit — 23 July 2026

The guide now uses the fleet scale of `14px` title, `12.5px` body, `11px` section labels and `10.5px` version text. It measured `520.3px` at `360 x 740` and required no internal scrolling. Its simple visible `v1` label and current `23/7/2026` date now occupy the shared bottom-right footer position.

## Main-page typography review — 23 July 2026

The Direct and BIO field-method labels now render at `10px` rather than sub-8px text. Simulator geometry, button positions and teaching behaviour are unchanged. The page retains a `360px` document width at the target viewport.

## Sidebar consistency — 23 July 2026

The existing identity, menu actions and simulator controls are unchanged. The drawer uses the fleet `14px` title, `11px` section-label and `12.5px` supporting-copy roles where present, with focus entry, Escape closure and trigger-focus return verified at `360 x 740`.

## MCQ and Cup status — 23 July 2026

Morph intentionally has no MCQ system. Its Cup continues to represent trying every simulator condition, so no quiz labels, grading or progression were added. Condition logic, layout and simulator geometry remain unchanged.

## MCQ exclusion audit — 26 July 2026

The exclusion remains correct. Morph is a compact optical-view simulator rather than a clinical decision or referral app, so adding a fleet-style quiz would invent a new workflow and duplicate teaching already owned by the condition controls. The Cup remains condition-completion based: Normal, Swollen disc, Cupped disc, CRVO and AMD must each be visited. Eleven tests and the isolated `360 x 740` five-condition unlock, offline, reset and direct-file suite pass. A contract protects the conditions-mode Cup, the five unique targets and the absence of MCQ controls.

## Information purpose pass — 27 July 2026

The existing `i` panel now tells the user to move the view over the model eye, adjust the controls and choose a condition while practising direct ophthalmoscopy or BIO views. It states that Morph is not a patient examination or diagnosis. No viewer geometry, condition mapping or Cup logic changed. The open panel passed the shared non-scrolling `360 x 740` review.

## Fleet UI alignment — 28 September 2026

The information card now uses the shared `16px` radius and a measured `44 x 44px` close target. Clean Chromium checks at `360 x 740` found no horizontal overflow, no information-card scrolling, correct Escape focus return and no console errors. Viewer geometry, condition mapping and Cup logic are unchanged. Physical-device acceptance remains pending.
