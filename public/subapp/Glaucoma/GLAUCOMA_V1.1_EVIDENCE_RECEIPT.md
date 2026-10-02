# Glaucoma v1.1 Evidence Receipt

**Date:** 25 July 2026  
**Clinical sign-off:** Pending  
**Physical-device status:** Pending

## Implemented

- Non-overlapping IOP bands: `≤20`, `21-24`, `25-29` and `≥30`.
- Minimum `SOON` result for thin/notched rim or suspicious field findings.
- Affected-eye escalation and fellow-eye assessment for end-stage results.
- Optional `RE` or `LE` context. Ordinary results calculate without it and rock-hard palpation still raises an emergency without waiting for laterality or C/D.
- Disc illustrations use their authored orientation for `RE`, mirror horizontally for `LE` and reset to neutral without changing any calculation.
- Compact red `R` Report action below the result as the final page action, disabled until a result exists.
- Accessible report modal with available-findings wording, explicit missing-eye state, copy support, Escape closure, focus containment and trigger-focus return.
- Pressed-state semantics, live result announcement, accessible grid structure and corrected thin-rim guide markup.
- Primary pass mark `3/4`, Advanced timer `140` seconds and per-question correct-answer review.
- Compact dense-state fit with the existing geometry, artwork and green identity retained.

## Changed Files

- App shell and release: `index.html`, `scripts.js`, `app.bundle.js`, `sw.js`, `styles.css`.
- Operational logic: `src/risk-config.js`, `src/risk-engine.js`, `src/risk-calculator-controller.js`.
- Report: `src/report.js`, `src/report-controller.js`.
- Teaching logic: `src/mcq-data.js`, `src/mcq-controller.js`.
- UI: `styles/base.css`, `styles/layout.css`, `styles/components.css`, `styles/responsive.css`.
- Verification: `tests/risk-engine.test.mjs`, `tests/report.test.mjs`, `tests/contracts.test.mjs`, `tests/browser-review.mjs`.
- App records: `README.md`, `GLAUCOMA_V1.1_GAP_LIST.md`, `CLINICAL_REVIEW.md`, `DEVICE-TEST-CHECKLIST.md` and all six `memory-bank` files.
- Fleet record: parent `ARCLIGHT_APP_UPGRADE_MATRIX.md`.

## Automated Checks

Build tooling is pinned to project-local `esbuild` `0.25.5` in `package.json` and `package-lock.json`; `npm run build` does not depend on an unpinned `npx` download.

```text
npm run build  PASS
npm run lint   PASS
npm test       PASS
```

The suite includes unit, contract and exhaustive checks. The exhaustive pass evaluates 86,400 combinations of pressure, palpation, C/D, disc size, flags, vision and risk-factor sets.

## Browser Evidence

Exact Chrome device metrics: `360 x 740`, DPR 1.

- HTTP untouched: width 360, scroll width 360, page height 740, empty result and reasoning, fonts loaded.
- HTTP completed and fully dense: expected urgent result and page height 740.
- Report: enabled only after a result, `Eye: Not recorded` without laterality, modal bottom `468.61` within viewport 740, Escape closure and focus return to `reportButton`.
- Laterality artwork: initial `transform=none`, `RE=none`, `LE=matrix(-1, 0, 0, 1, 0, 0)` and reset `transform=none`.
- Quick Guide: open, close control focused, bottom `391.19` within viewport 740.
- Reset: result and reasoning empty, report disabled, no selected ratio or eye and Medium disc restored.
- Interaction semantics: eye, ratio and palpation expose `aria-pressed=true`; grid has four row headers and a caption; result region is `aria-live=polite`.
- Safety states: suspicious rim floor produced provisional `SOON`; valid pressure plus C/D calculated without laterality; rock-hard palpation produced the emergency warning.
- MCQ: four Primary questions, four answer-review lines and option height at least 44px.
- Captured runtime errors: none.

Screenshots were generated in the system temporary directory. The in-app browser bootstrap failed twice because a user-level `type: module` setting conflicted with its CommonJS kernel. The approved isolated headless Chrome fallback produced the evidence above.

The review used an isolated headless Chrome profile. It did not alter retained Codex browser device-toolbar state.

The complete browser sequence also passed from `file://` with the same 360px document width, 740px untouched, completed and dense height, report behaviour and no runtime errors. Service workers do not run on `file://`.

Installed offline reload and physical-device review were not repeated in this follow-up. Asset completeness, cache prefix, same-origin handling and HTTP-only registration are contract-tested.

## Remaining Risks

- Independent clinical sign-off is pending. Engineering correction is not clinical approval.
- Existing `SOON`, `URGENT` and emergency timescales still require review against the intended local pathway.
- Palpation remains explicitly provisional and must not be presented as tonometry.

## MCQ quality receipt — 26 July 2026

- Questions audited: 38 total — Primary 10, Intermediate 12 and Advanced 16.
- Attempt sizes preserved: 4, 5 and 7.
- Source metadata: NICE NG81 primary-source-reviewed, app risk model pending-independent-clinical-sign-off and app scope internal-engineering-review.
- UI: selected wrong and correct marking, explanatory rationale, unanswered guard, timed unanswered fail-safe, fresh **New set**, result focus and 44px rows.
- Generated bundle rebuilt from source. Final lint, source tests and exact bundle parity passed.
- Content-quality follow-up replaced interface and calculator-mechanics questions with NICE NG81 case-finding, GAT, perimetry, repeat-measurement, CCT, gonioscopy, optic-nerve imaging and structural/functional interpretation questions. Counts remain 10/12/16 with 4/5/7-question attempts.
- The sparse-information LMIC dark-grey/end-stage learning objective is retained explicitly as an app-specific model item pending independent clinical sign-off.
- Final isolated browser result: exact `360 x 740`, `scrollWidth=360`, four questions, four explanations, minimum option height `44px`, result focus, Escape closure, fresh four-question set and no runtime errors.
- Browser evidence: `output/playwright/glaucoma-mcq4-mcq-review-360x740.png`.
- Published browser token and scoped cache: `20260726-mcq4`.
- Clinical gate: grid weights, category boundaries and referral timescales remain pending independent sign-off.
