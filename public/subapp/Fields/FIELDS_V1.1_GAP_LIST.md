# Fields v1.1 Gap List

Date: 23 July 2026  
Reference: `../Allan/ALLAN_V1.2_SPRINT_UPGRADE_PLAYBOOK.md`

## Baseline Preserved

- Compact one-page workflow at `360 x 740`
- Blue `#2f80ff` Fields identity on the black app bar
- Dual-eye field geometry, RAPD control and folded context
- Classic 18 rule families, priority order and `R/?/W` point codes
- Simple and advanced output modes
- Visual pathway mapping, teaching cards and three MCQ levels
- Direct-file entry through `index.html`

## Applicable Gaps and Resolution

| Gap                                                                           | Resolution                                                                                                                                                                           | Evidence                                                                   |
| ----------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | -------------------------------------------------------------------------- |
| Untouched points produced an immediate normal conclusion                      | Added a separate pure UI completion model. A wholly untouched output is `Not assessed`; the clinical `R/?/W` engine remains unchanged                                                | `src/assessment-state.js`, `src/state.js`, `src/output.js`, contract tests |
| Explicit completion blocked the established defect-first live-result workflow | Reaching suspect or absent now completes the untouched remainder as seen and shows the result immediately. `Mark all seen` and `Mark rest seen` remain for normal or seen-only entry | Browser defect-first check and assessment-state tests                      |
| No deliberate examination reset                                               | Added drawer `New` then `Clear?` reset. It leaves MCQ achievement and stored preferences intact                                                                                      | `src/main.js`, browser reset check                                         |
| Remote Google Fonts request remained despite local fonts                      | Removed remote links and retained bundled Inter and Quicksand files                                                                                                                  | `home.html`, runtime contract                                              |
| Documented card-radius hierarchy did not match the live CSS                   | Restored the documented hierarchy: 16px primary field stage, 12px secondary cards, 10px controls and 8px tight controls                                                              | `styles.css`, `README.md`, 360 x 740 browser review                        |
| No installable offline shell                                                  | Added app-relative manifest, scoped service worker and HTTP(S)-only registration                                                                                                     | Offline browser reload passed                                              |
| Menu, guide, MCQ and pathway-image focus handling was incomplete              | Added dialog semantics, trigger state, Escape handling, focus entry, focus containment and focus return where applicable                                                             | `home.html`, `src/popup.js`, `src/mcq.js`, `src/main.js`                   |
| Urgent context was hidden from the Result while the field was incomplete      | Kept the `Not assessed` heading and surfaced the existing urgent warning beneath it without producing a field classification or pathway target                                       | `src/output.js`, output-safety contracts, browser review                   |
| An unresolved parser state was converted to a normal field conclusion         | Changed the defensive fallback to `Unable to interpret`, caution or urgent styling as appropriate and no pathway target                                                              | `src/output.js`, output-safety contracts                                   |
| `npm test` failed by design and lint used an incomplete environment model     | Added 17 current contracts, repaired the flat config and made `npm test` the complete verification command                                                                           | `package.json`, `eslint.config.mjs`, `tests/`                              |
| README, memory and review records were stale or missing                       | Updated README and all six memory-bank files. Added review, device and evidence records                                                                                              | Documentation files dated 23 July 2026                                     |

## Deliberately Not Changed

- No clinical label, threshold, priority, urgency rule or pathway mapping was changed.
- No field point, context control, image requirement or MCQ content was added or removed.
- No panel or eye layout was rearranged.
- No report was invented because Fields does not currently have a report workflow.
- No claim of independent clinical approval or physical-device acceptance was made.

## External Gates

- Independent clinical sign-off: pending
- Physical-device testing: pending
- Dev-dependency security review: two high-severity advisories reported by `npm ci`; `npm audit --omit=dev` reports zero runtime vulnerabilities
