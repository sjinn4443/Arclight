# Fields v1.1 Evidence Receipt

RAPD labelling follow-up, 23 July 2026: the established `82px` `R / 0 / L` control remains centred and its visible `RAPD` label sits beneath `0`. A dedicated mobile top band moves both eye diagrams down as a unit, while the heading and quadrant-label rows keep their original horizontal positions. At `360 x 740`, every label has zero overlap with the RAPD group and circular outlines; minimum circle clearance is `4.73px` and IT/IN clearance is `5.57–6.07px`. Quadrant-label opacity is increased from `0.62` to `0.72`. All three positions retained correct state and `aria-checked` values.

Safety follow-up, 23 July 2026: an incomplete assessment retains its neutral `Not assessed` heading while existing urgent context remains visible beneath it. An unresolved parser state now fails closed as `Unable to interpret`; it cannot produce a normal result or pathway target.

Fleet edge follow-up, 23 July 2026: after settled rendering at `360 x 740`, the principal field, result and pathway panels measure `x=10`, `width=340` with no horizontal overflow. State and pathway logic are unchanged.

Defect-first workflow correction, 23 July 2026: a wholly untouched examination remains `Not assessed`. Reaching suspect or absent now completes the untouched remainder as seen and restores the established live result without changing the `R/?/W` rule engine.

Pathway presentation follow-up, 23 July 2026: the existing SVG is enlarged, its viewport no longer exposes false scrollbar controls and the existing legend gives concise active eye, hemisphere, radiation-branch and V1-bank detail. No SVG geometry, internal ID or target mapping changed.

Date: 23 July 2026  
Recovery: external USB backup confirmed by the user; no usable app Git history

## Outcome

Fields received the second sequential fleet upgrade pass. Its established compact layout, blue identity and clinical rule engine were preserved. Untouched examination state is now explicit, runtime assets are local, reset and offline support are present and verification is current.

## Source and Runtime Changes

- `home.html` - local assets, manifest, completion action, reset entry, dialog semantics, coherent asset version and current guide version
- `styles.css` - neutral unassessed appearance, 16/12/10/8px radius hierarchy, compact completion and reset controls, clearly positioned RAPD label, focus styling and reduced-motion support
- `src/assessment-state.js` - pure UI transition, completion and defect-first trigger model
- `src/state.js` - unassessed DOM state, defect-first completion and fill-remaining behaviour
- `src/output.js` - neutral output before explicit completion, incomplete-context safety presentation and fail-closed unresolved interpretation
- `src/main.js` - completion wiring, two-step examination reset and pathway-image focus return
- `src/popup.js` - guide focus entry, Escape, focus containment and return
- `src/mcq.js` - drawer and MCQ trigger state, focus entry, containment, fail-safe review, retry and return
- `src/pathway.js` - unchanged target mapping plus a pure presentation-only legend-state helper
- `manifest.webmanifest`, `service-worker.js`, `pwa-register.js` - scoped install and offline support
- `package.json`, `package-lock.json`, `eslint.config.mjs` - v1.1 scripts and test environment
- `tests/assessment-state.test.mjs`, `tests/pathway-legend.test.mjs`, `tests/output-safety.test.mjs`, `tests/app-contract.test.mjs` - 17 current contracts

## Documentation Changes

- `README.md`
- `memory-bank/activeContext.md`
- `memory-bank/productContext.md`
- `memory-bank/progress.md`
- `memory-bank/projectbrief.md`
- `memory-bank/systemPatterns.md`
- `memory-bank/techContext.md`
- `FIELDS_V1.1_GAP_LIST.md`
- `CLINICAL_REVIEW.md`
- `DEVICE-TEST-CHECKLIST.md`
- `FIELDS_V1.1_EVIDENCE_RECEIPT.md`

Generated QA reports were refreshed by the authorised full test run:

- `report.txt`
- `mcq-qa-report.txt`
- `output-mode-audit-report.txt`
- `context-modifier-audit-report.txt`

## Automated Evidence

Command: `npm test`

- Result: pass, exit code 0
- State and contract tests: 17/17 pass
- ESLint: pass
- Full field matrix: 59,049 states
- Fixed regression scenarios: 15/15 pass
- Field-audit findings: `P0=0`, `P1=0`, `P2=0`, `P3=0`
- Pathway audit: 1,062,882 rendered combinations with no alignment issues
- Output audit: 17,006,112 simple-versus-advanced comparisons completed
- MCQ audit: pass
- Context-modifier audit: 14 representative cases pass

## Browser Evidence at 360 x 740

Playwright checks over `http://127.0.0.1:8081/home.html`:

- Untouched screen shows neutral point markers and `Not assessed`.
- `Mark all seen` restores the established completed-normal layout.
- A suspect point completes untouched points as seen, produces the same existing abnormal classification and highlights the pathway immediately.
- Seen-only partial entry remains unassessed and offers `Mark rest seen`.
- Drawer `New` then `Clear?` returns the examination to unassessed.
- The quick guide fits the viewport and Escape returns focus to the info button.
- Service-worker controller is scoped to Fields.
- Offline reload succeeds.
- Browser console: 0 errors and 0 warnings before offline testing.
- Pathway follow-up: untouched, monocular, bitemporal, superior quadrantanopia, inferior quadrantanopia and homonymous states passed over `http://127.0.0.1:8090/Fields/home.html` at `360 x 740`.
- The pathway SVG measured about `260 x 125px`; the viewport reported `overflow: hidden` with equal client and scroll height.
- Active labels resolved as expected, including `RE Retina` with `RE Nerve`, `Chiasm`, `L Meyer` with `L lower V1`, `L Parietal` with `L upper V1` and `L Radiations` with `L V1`.
- With untouched fields and `Flash/curtain` selected, the heading remained neutral `Not assessed`, the existing urgent retina message appeared in red, the pathway remained unselected and the document width remained `360px`.
- Simple mode used `urgent retina referral`; advanced mode used the established `urgent retina review` wording.
- The unresolved-parser presentation is covered by pure contracts because valid UI states do not intentionally produce malformed input.

Screenshots:

- `output/playwright/baseline/fields-360x740.png`
- `output/playwright/fields-360x740-unassessed.png`
- `output/playwright/fields-360x740-completed-normal.png`
- `output/playwright/fields-360x740-abnormal.png`
- `output/playwright/fields-360x740-info.png`

## Preserved Clinical Logic

No operational clinical rule, result label, threshold, source modifier, severity rule, pathway target, SVG geometry or teaching-card classification was changed. MCQ wording and authored identities changed only as recorded below. The completion model sits before presentation and emits no new clinical code. The pathway legend wording only describes the already-selected SVG targets.

## Remaining Risks and Gates

- Independent clinical sign-off: pending
- Physical-device and constrained-WebView checks: pending
- Direct-file behaviour is protected by classic-script and protocol contracts. The browser-based direct-file check remains part of the physical deployment checklist.
- `npm ci` reported two high-severity advisories in development dependencies. `npm audit --omit=dev` reports zero runtime vulnerabilities. No automatic dependency rewrite was applied.

## MCQ clinical-quality evidence — 26 July 2026

- Preserved teaching pools: Text 5/5/5, Field pattern 5/5/4 and Pathway 5/5/4 for Primary, Intermediate and Advanced.
- Preserved the separate localisation, pattern-recognition and visual-pathway purposes.
- Added rationales, source IDs, pending-review metadata and semantic option identities to all 43 questions.
- Corrected globally duplicated pathway IDs with `pp1` to `pp5`, `ph1` to `ph5` and existing `pa1` to `pa4`.
- Replaced repeated Higher field and pathway items with distinct supported patterns and sites. Narrowed `tp3`, `tp4`, `pa3` and `pa4` with discriminating retinal or optic-nerve context.
- `qa-mcq-audit.mjs` now rejects global question-ID collisions and exact stem-plus-answer repetition.
- Submit and New Set are mutually exclusive. Incomplete submission reveals no answers, completed review shows a rationale for every question and New Set focuses its first option.
- Runtime and app-scoped cache token: `20260726-mcq2`.
- Automated result: ESLint, all contract suites and `npm run qa:mcq` pass. The pathway audit rendered 1,062,882 combinations with no alignment issue.
- Isolated Playwright at `360 x 740`: no page or modal horizontal overflow, no incomplete answer leakage, 5/5 review rationales, no result/action overlap, focused retry, Escape return to `menu-icon` and zero console/page errors.
- Screenshots: `output/playwright/mcq-quality/fields-mcq-unanswered-360x740.png`, `output/playwright/mcq-quality/fields-mcq-review-360x740.png` and `output/playwright/mcq-quality/fields-mcq-retry-360x740.png`.
- Independent clinical sign-off and physical-device acceptance remain pending.
