# Active Context

## Receiving host integration — 2 October 2026

Host routes and locale hooks are retained. Service-worker reads remain app-scoped and shared locale assets are precached. Development material is excluded from deployment and offline manifests.

Current receiving-host evidence is in [the integration report](../../../../docs/miniapps/20260930/INTEGRATION_REPORT.md). Earlier receipts below remain upstream historical evidence.

## Performance review — 30 September 2026

Runtime source retained. A suitably sized derived logo is a future asset-delivery opportunity; original artwork was not altered. Mobile Lighthouse performance: 95 → 95/100 in one paired lab run, not a physical-device speed guarantee.

Shared verification: 24/24 regression jobs, all 15 HTTP and direct-file information/drawer reviews, all 14 Primary quiz workflows and 45 main-page responsive views passed. Selected completed states were also checked. No clinical rules or approved layout were deliberately changed. App-specific asset queries and caches were bumped only where shipped bundles changed. Direct-file checks do not test service workers. Full dead-code elimination, every workflow, offline cache migration and physical-device acceptance are not claimed. The retained Glaucoma tab's real toolbar was verified at 360 x 740 after switching away and back; this does not establish sibling-tab sizes or physical-device acceptance.

[Evidence and remaining priorities](../../FLEET_PERFORMANCE_REVIEW_20260930.md). This entry supersedes older performance figures only; earlier clinical and feature history remains below.

## Current fleet UI refinement receipt — 30 September 2026

Control-card rounding aligned while preserving its dark theme and visual teaching layout; no MCQ bank exists.

App-local versioned `fleet-ui-refinements.css` aligns quiz typography, answer rows, focus outlines and rounding where compatible. Information footers show `v1 · 30/9/2026`. Clinical engines, simulator geometry, authored questions, scoring and progression are unchanged. Earlier dated entries below are historical.

Fleet evidence: 24/24 regression jobs, 45 main-page views, 15/15 HTTP information/drawer reviews, 15/15 direct-file information/drawer reviews and 18/18 selected expanded/completed-state checks. All 14 Primary quiz workflows pass individually; Cataract passed its isolated recheck after one transient connection warning. Automated viewports are temporary. Real Codex retained-toolbar verification remains blocked by the unavailable visible tab; physical-device acceptance and independent clinical sign-off remain pending. See the [full change and verification receipt](../../FLEET_UI_REFINEMENTS_2026-09-30.md).

## Documentation refresh — 29 September 2026

Current visible information footer: `v1 · 29/9/2026`, bottom right in the existing information popup. This entry records a documentation and popup-date synchronisation, not a new clinical audit. App behaviour and the previously recorded verification limits are unchanged. Older dated entries below are historical records, not the current popup date. Independent clinical sign-off and physical-device acceptance are not implied by this date.

## Final Cup evidence — 26 July 2026

Morph deliberately remains a zero-MCQ optical simulator. The conditions-mode Cup still requires Normal, Swollen disc, Cupped disc, CRVO and AMD. Eleven tests and the isolated `360 x 740` five-condition unlock flow pass without changing viewer logic or artwork.

## Maintenance refactor (26/7/2026)

`viewer-logic.js` is the tested boundary for viewer geometry, cataract presets, jitter state and single-loop animation ownership. The inline runtime uses one idempotent frame loop and stops it on page lifecycle exit. Ten tests and syntax checks pass. The UI, teaching artwork and clinical interpretation are unchanged.

Fleet edge follow-up, 23 July 2026: the former `7px` override is corrected so controls and the black stage measure `x=10`, `width=340` at `360 x 740`; simulator geometry and logic are unchanged.

<!-- APP-DOC-STATUS:START -->

## Current Memory Status (18/5/2026)

- Static packaging: open `index.html` directly; a local HTTP server is optional for testing.
- Mobile target: `360 x 740`, with the main page kept free of required vertical scrolling.
- Shared appbar: `54px` high; `Quicksand` `25px`/`700` title; `44 x 44` burger and info buttons set `12px` from the edges.
- Burger glyph: shared CSS three-bar mark, `18px` wide with `2px` strokes, so no app depends on a bold font glyph.
- Shared side menu: left drawer under the appbar; `min(76vw, 284px)` width; `16px` padding; pale `#f8fbff` surface; blue-grey border; card-style actions with small level dots.
- Appbar content colour: black `#111111` on a white appbar.
- Favicon: current black-square app favicon with the app letter or letters centred.
<!-- APP-DOC-STATUS:END -->

Last updated: 18/5/2026

## Current State

Morph has been updated to follow the Fundal Reflex and Swollen Discs UI language while preserving Morph-specific choices:

- White app bar with black title text.
- Cartoon character retained next to the centred title.
- Black page and stage retained.
- Dark compact control cards.
- Cataract, Field, Rx, Condition and Adult/Child hierarchy retained.
- Field now separates Direct fields from BIO fields.
- Rx buttons now use `+++`, `++`, `0`, `--` and `---`.
- Direct/BIO labels are intentionally quiet and compact so the Field row does not dominate the first screen.
- Quick guide copy should describe DO and BIO, and should not tell users to keep the pointer below the circle because the engine handles that automatically.
- Zoom removed.
- Stage toolbar repetition removed.
- Side menu simplified to Conditions only.
- Quick guide updated and dated 18/5/2026.

## Recent Correction

A source-crop experiment for pathology artwork was reverted because it zoomed the artwork. The app now draws pathology images at full source size again. Do not re-add code cropping or scaling to compensate for artwork framing.

## Engine Alignment

- Cataract constants match Swollen Discs.
- Corneal reflex shape, opacity and motion follow Swollen Discs.
- The viewing-window ring now uses the Swollen Discs layered translucent edge rather than a hard single white stroke.
- Pointer movement is below the circle as in Swollen Discs.
- Background patient motion follows the Swollen Discs feel but is tuned down slightly for Morph: small irregular jitter plus a periodic shift-and-return movement. Child mode is slightly livelier.

## Next Useful Checks

- Review the app at 360 x 740 after any visual change.
- Confirm no console errors after condition switching and dragging.
- Keep artwork changes separate from engine or layout changes.

# Active context: v1.1 complete locally (23 July 2026)

The engineering and restrained UI upgrade is implemented and locally verified. Six contract checks pass. Isolated Chrome passed untouched, dense, transient menu, two-press reset and offline reload checks at 360 x 740 with no console or page errors. Independent clinical review and physical-device testing are still pending external gates.

## MCQ and Cup status — 23 July 2026

Morph has no MCQ by design. Its Cup is earned by trying every condition. Preserve that simulator-specific achievement contract and do not add quiz progression merely for fleet uniformity.

## Maintenance refactor - 26 July 2026

Viewer state now uses the pure `viewer-logic.js` module. Two animation loops were consolidated into one idempotent request-animation-frame owner. Viewer geometry, condition mappings, Cup behaviour and artwork remain unchanged.

## MCQ exclusion audit — 26 July 2026

Morph still has no MCQ by design. Its workflow is optical simulation rather than clinical action or referral. The Cup remains condition-completion based and requires the five unique targets: Normal, Swollen disc, Cupped disc, CRVO and AMD. Contracts now protect conditions mode, target uniqueness and the absence of MCQ controls.

# Corrections — 29 September 2026

BIO orientation is now inverted/reversed. Rx scaling is explicitly Direct-only; it is restored on return to Direct. Magnification and field sizes remain illustrative. Mobile cataract filtering now includes blur, contrast and saturation. Canvas-clipped aperture bounds, guide focus trap, 44px control heights and accessible selected states are corrected. Artwork and condition Cup progression unchanged. Tests: 11 source checks plus browser smoke and tests/logic-browser.mjs. Physical-device and clinical approval remain pending.
