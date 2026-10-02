# Sauron v1.1 Evidence Receipt

Fleet edge follow-up, 23 July 2026: at `360 x 740`, the control deck and stage measure `x=10`, `width=340` with no horizontal overflow. Simulator maths and internal geometry are unchanged.

_Completed: 23 July 2026. Case curriculum follow-up: 25 July 2026._

## Logic-integrity follow-up — 25 July 2026

- `src/test-mode.js`: Baby mode now intersects the Baby-compatible catalogue with the timed-test pool. Anisometropia remains excluded.
- Timed rounds capture the learner's streak angle before loading the hidden case and restore it immediately afterwards. Axis generation and answer reveal remain unchanged.
- `src/modal.js` and `src/menu-visual-cases.js`: the warning dialog suspends the underlying case dialog with `inert` and `aria-hidden`, then restores it for close-button, backdrop and Escape closure.
- The exaggerated vertical ACG oval is preserved. Its warning text now identifies it as a stylised teaching cue rather than a diagnostic pupil shape.
- `app.bundle.js` was rebuilt from source. The scoped worker cache and bundle token are `20260725-logic1`.

Build, tests and the 28-file syntax check pass. Targeted contracts protect the Baby test pool, timed-round starting angle, dialog suspension hooks, ACG clarification and cache version.

Fresh isolated HTTP review at `360 x 740` confirmed that Baby mode sampled only compatible test cases. A low-cylinder round retained the visible `18°` starting streak while the hidden answer was `51°`. The safety dialog made the case dialog hidden and inert, Escape restored the case dialog and focus returned to the originating warning control. The ACG pupil remained vertically exaggerated at approximately `32 x 40px`. No browser errors or horizontal overflow were recorded.

## Case curriculum and safety follow-up — 25 July 2026

- `src/case-catalog.js`: corrected four teaching-tier assignments. Low astigmatism moved to Intermediate, posterior subcapsular cataract moved to Advanced, dense cataract moved to Intermediate and vitreous floaters moved to Intermediate.
- The resulting catalogue is Primary `5`, Intermediate `10` and Advanced `13`, with global case numbering grouped in that order.
- Safety-note metadata is limited to ACG, leucocoria, vitreous haemorrhage and partial retinal detachment. It does not alter reflex rendering, MCQs or timed-test selection.
- `src/menu-visual-cases.js`, `src/dom.js` and `index.html`: added separate sibling warning controls, an accessible safety-note dialog and one selected-case warning triangle. No nested buttons were introduced.
- `style.css`: adapts Squint's red warning triangle at a smaller case-card scale. The selected-case triangle replaces the tier dot to avoid two competing red markers.
- `sw.js`: the later logic follow-up advances the cache to `20260725-logic1`; versioned assets refresh from the network before offline fallback.
- `app.bundle.js`: rebuilt from modular source.

Automated build, contracts and the 28-file syntax check pass. Contracts protect exact tier counts, the four intended moves, grouped ordering, the four safety metadata records, unchanged timed-test exclusion of anisometropia, separate safety and selection controls, resolved ARIA references and versioned-cache refresh.

Fresh HTTP review at `360 x 740` confirmed `5 / 10 / 13` section counts, four warning controls, no title-marker collisions, a single selected-case triangle, correct `Advanced` accessible naming, safety-dialog close focus, Escape return to the originating marker, exact `360px` document width and no console errors. The safety card measured within the viewport and required no internal scrolling.

Direct-file interaction also opened the case picker at `360 x 740` with `5 / 10 / 13` counts and no horizontal overflow. Chromium blocks the local WOFF2 font requests on `file://`, so direct-file functionality passed but direct-file font loading remains a browser limitation. Service workers do not run on `file://`.

## Eye-engine consistency follow-up

- `src/structural-eye-effects.js`: exposed the existing radial light-responsive pupil target as a pure helper for direct testing. Sauron's immediate response behaviour and acute-angle-closure bypass are unchanged.
- `index.html`: added explicit RE and LE accessible names to paired pupil and upper-lid controls.
- `tests/contracts.test.mjs`: added radial-response and examiner-facing laterality contracts.
- `app.bundle.js`: rebuilt from source. `style.css` and bundle references plus the scoped worker cache now use `20260723-eye1`.

`npm run build`, `npm test` and `npm run lint` all pass, with 28 JavaScript files syntax-checked. Fresh HTTP review at exactly `360 x 740` confirmed the final labels, stage geometry and zero browser warnings or errors. The active-eye dense-cataract state is materially darker than Neutral and matches Fundal Reflex's obstruction pattern. Its rendering was retained rather than making an unreviewed clinical presentation change.

### UI polish

The orange-red identity, monocular eye selector, stage radii, type hierarchy and specialist streak controls remain unchanged. Side labelling is now unambiguous without adding visible rows or disturbing the compact layout. Dense-cataract salience was reviewed and retained.

Current direct-file browser rechecking was blocked by the browser-control URL policy. Earlier direct-file evidence remains recorded below. Service workers do not run on `file://` pages.

## Scope and preservation

The v1.1 upgrade preserved Sauron's simulator maths, teaching and clinical content, case ordering, MCQs, timed-test sequence, workflow, assets, IDs and orange-red identity. The 25 July follow-up changes only teaching-tier assignment, display order and separate safety-note presentation. No independent clinical approval is claimed.

## Changed files

- Runtime: `index.html`, `style.css`, `script.js` source graph via `src/app.js`, `src/dom.js`, `src/retinoscopy.js`, new `src/reset-controller.js`, new `src/pwa.js` and rebuilt `app.bundle.js`
- Offline: new `manifest.webmanifest` and `sw.js`
- Tooling: new `package.json` and `tests/`
- Governance: `README.md`, all six `memory-bank` documents, `SAURON_V1.1_GAP_LIST.md`, `CLINICAL_REVIEW.md`, `DEVICE-TEST-CHECKLIST.md` and this receipt

## Automated evidence

- Build tooling is pinned to project-local `esbuild` `0.25.5` in `package.json` and `package-lock.json`; `npm run build` does not depend on an unpinned `npx` download.
- `npm run build`: pass
- `npm run lint`: pass, 28 JavaScript files checked
- `npm test`: pass
- Contracts cover unique IDs, resolved ARIA references, local-only runtime URLs, complete case/catalogue alignment, local thumbnails, manifest/service-worker scope, protocol guard and built reset/PWA code.

## Browser evidence

The reproducible exact-device script is `tests/browser-review.mjs`. Review states include baseline, advanced panel, case picker, reset confirmation and completed reset at `360 x 740`, with overflow, focus, local-font and browser-error capture. The sequence passes over HTTP and direct-file routes. The default simulator measures `360 px` wide with a `360 px` scroll width and a `740 px` document height. The expanded advanced panel deliberately adds vertical content but does not introduce horizontal overflow.

Measured results: default case `Neutral (0)`, default eye `RE`, local fonts loaded, case modal from `37 px` to `658.6 px` within the `740 px` viewport, close control focused, reset drawer fully visible, changed `LE` state exposed as `aria-pressed="true"` and no captured errors. The second reset press restored `Neutral (0)`, active `RE`, Gaze off and a closed drawer. Baseline, advanced, case-picker, reset-confirmation and reset-complete screenshots were visually inspected.

## Remaining gates

- Independent clinical sign-off: pending
- Physical-device testing: pending
- Installed cold offline reload: pending until a physical or representative installed-browser test

## MCQ quality receipt — 26 July 2026

- Scope: 26 questions across Primary, Intermediate and Advanced, with attempt sizes and pass marks preserved.
- Data evidence: stable IDs, one keyed answer, rationales, source keys and explicit review status are enforced by `tests/contracts.test.mjs`.
- Interaction evidence: unanswered focus, result hierarchy, answer explanations, source display and retry labels are protected by contract.
- Clinical boundary: one unsafe absolute was narrowed and three simulator observations were labelled. Optics, cases, scoring and Cup rules were not changed. Independent clinical sign-off remains pending.
- Runtime evidence: `npm run build`, `npm test` with exact bundle parity and `npm run lint` passed.
- Browser-visible assets and app cache: `20260726-mcqquality1`.
- Remaining gates at that stage were physical-device review and installed offline review; isolated browser evidence is recorded below.

### Isolated MCQ browser evidence

The reproducible path is `tests/mcq-browser-path.js`. Temporary Playwright automation at `360 x 740` recorded a `360px` client and scroll width, a modal within `12px` to `348px` horizontally and `37px` to `673.4px` vertically, 44px minimum option rows, first-unanswered focus with no review revealed, five rationales and five source records after grading and a cleared retry state. Console and page-error collections were empty. Screenshots are `output/playwright/mcq-unanswered-360x740.png` and `output/playwright/mcq-result-review-360x740.png`.

This MCQ path was run over HTTP only. Earlier direct-file evidence remains recorded, but service workers do not operate on `file://`. Retained Codex browser toolbar state was not changed. Remaining gates are physical-device review, installed offline review and independent clinical sign-off.
