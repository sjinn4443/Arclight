# Trauma v1.1 Evidence Receipt

Untouched-state follow-up, 25 July 2026: the `Not assessed` heading and presenting-VA guidance now form a collision-free two-line block. The exact browser check records `overlap: false` before assessment and after reset. The cache and browser-visible assets use `20260725-unassessed1`.

Fleet edge follow-up, 23 July 2026: at `360 x 740`, calculator and result shells measure `x=10`, `width=340` with no horizontal overflow. Scoring logic and calculator state are unchanged.

_Completed: 23 July 2026_

## Preserved behaviour

No base score, penalty, threshold, category, prognosis table, output, copy/export workflow, tooltip asset, MCQ, established ID or Trauma accent was intentionally changed. The current safe initial presentation is unassessed: presenting VA remains on its placeholder and no score or category is shown.

## Changed files

- Runtime: `index.html`, `styles.css`, `script.js`, new `scoring-engine.js`, new `pwa.js`, new `manifest.webmanifest` and new `sw.js`
- Tooling: `package.json`, `eslint.config.cjs` and new `tests/`
- Documentation: `README.md`, all six memory-bank files, `TRAUMA_V1.1_GAP_LIST.md`, `CLINICAL_REVIEW.md`, `DEVICE-TEST-CHECKLIST.md` and this receipt

## Automated evidence

- Baseline `npm run lint`: failed at CSS because `stylelint` was not locally installed
- `npm ci`: restored the existing locked toolchain
- Final `npm run lint`: pass for JavaScript, CSS and HTML
- `npm test`: pass
- Tests cover scores `44`, `45`, `65`, `66`, `80`, `81`, `91` and `92`, representative combined penalties, initial output, unique IDs, ARIA references, local runtime fonts, tooltip assets and offline contracts.

`npm ci` reported six development-dependency audit findings: one moderate and five high. No automatic audit fix was applied because that could introduce unreviewed tooling changes. These do not form part of the static browser runtime but remain a maintenance risk.

## Browser evidence

Exact Chrome emulation over HTTP at `360 x 740` measured a `360 px` client and scroll width. The untouched state rendered the presenting-VA placeholder, `Not assessed`, no score, no category and no text overlap. VA `1/60 to < 6/60` plus Globe Rupture and RAPD rendered the expected score `47` and Category `2`. The risk tooltip ended at `507.0 px` inside the `740 px` viewport and returned focus to its trigger on close. The confirmed reset restored the placeholder, the unassessed state and zero selected risks. Local fonts loaded and no browser errors were captured. Baseline, changed, tooltip and reset screenshots were visually inspected. Direct-file verification from the earlier pass remains applicable but service workers do not run on `file://`.

## External gates

- Independent clinical sign-off: pending
- Physical-device review: pending
- Installed cold offline reload: pending

## MCQ quality receipt — 26 July 2026

- Scope: 37 questions across Primary, Intermediate and Advanced, with existing attempt sizes and pass marks preserved.
- Data evidence: stable IDs, one keyed answer, rationales, source keys and explicit review status are enforced by `tests/run-tests.cjs`.
- Interaction evidence: unanswered focus, result-first hierarchy, correct and incorrect marking, explanations, source display and retry labels are protected by contract.
- Clinical boundary: the interface-mechanics prompt was replaced by an OTS prerequisite. OTS-style scoring, penalties, boundaries, outcome probabilities and Cup rules were not changed. Independent clinical sign-off remains pending.
- Runtime evidence: `node --check script.js`, `npm test` and the complete `npm run lint` suite passed.
- Browser-visible assets and app cache: `20260726-mcqquality1`.
- Remaining gates at that stage were physical-device review and installed offline review; isolated browser evidence is recorded below.

### Isolated MCQ browser evidence

The reproducible path is `tests/mcq-browser-path.js`. Temporary Playwright automation at `360 x 740` recorded a `360px` client and scroll width, a modal within `14.4px` to `345.6px` horizontally and `37px` to `673.4px` vertically, 44px minimum option rows, first-unanswered focus with no review revealed, five rationales and five source records after grading and a cleared retry state. Console and page-error collections were empty. Screenshots are `output/playwright/mcq-unanswered-360x740.png` and `output/playwright/mcq-result-review-360x740.png`.

This MCQ path was run over HTTP only. Earlier direct-file evidence remains recorded, but service workers do not operate on `file://`. Retained Codex browser toolbar state was not changed. Remaining gates are physical-device review, installed offline review and independent clinical sign-off.
