# Trauma v1.1 Gap List

_Completed: 23 July 2026_

## Untouched-state follow-up, 25 July 2026

| Area                 | Confirmed gap                                                                                              | Response                                                                                        |
| -------------------- | ---------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------- |
| Result hierarchy     | The unassessed heading and guidance collided because they inherited the completed result's two-column grid | Added a dedicated stacked unassessed presentation without changing scoring or completed results |
| Browser verification | The review harness still expected the obsolete preselected-normal state                                    | Updated it to verify the placeholder, null result, collision-free text and reset restoration    |
| Cache freshness      | Existing browser tabs could retain the earlier layout                                                      | Advanced the scoped cache and visible assets to `20260725-unassessed1`                          |

| Area           | Baseline gap                                                                         | v1.1 response                                                                                          |
| -------------- | ------------------------------------------------------------------------------------ | ------------------------------------------------------------------------------------------------------ |
| Scoring safety | Scoring rules were embedded in the UI script and had no boundary tests               | Added a pure scoring module consumed by the calculator with exact threshold and combined-penalty tests |
| Tooling        | `npm run lint` failed because local stylelint tooling was missing                    | Restored the locked dependency set with `npm ci`; JavaScript, CSS and HTML gates now run locally       |
| Runtime        | Google Fonts were requested during normal use                                        | Switched to the existing local Inter and Quicksand assets                                              |
| State safety   | No deliberate case reset                                                             | Added an eight-second, two-press reset that restores the established initial calculator presentation   |
| Accessibility  | Drawers, dialogs, tooltips and MCQ transitions had incomplete state/focus signalling | Added ARIA state, dialog semantics and close/trigger focus handling                                    |
| Offline        | No installable or offline shell                                                      | Added relative manifest and scoped same-origin service worker                                          |
| Verification   | No runtime or exact-device checks                                                    | Added scoring, contract and reproducible `360 x 740` browser checks                                    |

The existing OTS-style maths, prognosis tables, result wording, initial calculator presentation, copy/export flow, tooltip assets, MCQs, IDs and red identity were preserved. No Allan clinical content or purple styling was imported.
