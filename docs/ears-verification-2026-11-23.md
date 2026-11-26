# Ears curriculum verification · 23 November 2026

The source map agrees with the current data. The four category lists contain 6, 4, 3 and 3 cards. One of the 16 cards opens the existing PEC workshop. The other 15 topics own 51 entries, comprising 34 PDF lessons, 8 scroll lessons, 3 videos, 2 diagram viewers and 4 downloads.

## Source and navigation

The six Ears content checks passed. Each lesson has a parent, route and source data. All 18 PDF hashes match the import manifest and all 228 preview paths exist. The three unique video recordings have low and high sources. The fourth supplied recording has the same digest as its recorded duplicate. All assigned PDF page ranges, slide diagrams, scroll artwork and download paths passed. The hashes verify correspondence to the recorded import. The current source index is [the Ears content map](ears-content-source-map.md).

## Browser results

Ran ears-catalog, ears-topic-layout and ears-lesson-layout against the local source app in Chrome at 390 × 844, 820 × 1180 and 1440 × 1000. There were 39 passing cases and three failures of the same legacy Dashboard entry test.

| Scope                             | Observed result                                                                                                                                                                                                                                                                                      |
| --------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Topic and lesson layout           | Each topic's rows passed the Eyes comparison for row/icon width and height, progress height, Start colour/font, level dividers and title/CTA placement. All learning entries fitted their viewports. The lengths of the topic lists and their visible artwork differ by curriculum.                  |
| PDF and scroll                    | The Washout guide opened source pages 52–54, advanced to page 53, enlarged and restored the page on reload. Diagrams opened in an accessible zoom. The tests exercised retry after a reader failure, Previous/Next navigation and parent returns.                                                    |
| Video                             | The low and high Otoscopy files loaded. Switching preserved the position of a playing lesson. The player layout and keyboard quality controls passed against the Eyes reference. Original language audio and source illustrations were retained.                                                     |
| Catalogue, progress and downloads | The carousels, RTL navigation, partial PDF progress, My Learning return and selected download URLs passed in all three viewport runs. Source-document download checks included the 540p high-quality tier.                                                                                           |
| Search and current entry          | From the visible Ears specialty card, opened Ears → PEC workshop and returned to Ears at all three widths. Phone/tablet used global Back to return to Dashboard. Desktop used the sidebar Overview control. Searching for Otoscopy returned Otoscopy and Video Otoscopy & Simulation at every width. |

### Reproducing the legacy test failure

Run the Dashboard case in `tests-e2e/ears-catalog.spec.js` at the sizes above. At 390 and 820px, the first module card under #unifiedDashboard selected by the test is hidden. At 1440px, the unscoped Ears category selector matches two cards. For the independent check, wait for Dashboard initialisation and click the visible `.category-card[data-category="ears"]`, then select PEC workshop. The current entry worked. The test's final global Back assumption also differs from the desktop shell's Overview navigation.

The captures from the local production build pair Eyes Pupils on the left with Ears Otoscopy on the right. The wider captures crop the surrounding margins while preserving the layout at the tested viewport. [Phone](lesson-review-2026-11-23/ears-390.webp) · [Tablet](lesson-review-2026-11-23/ears-820.webp) · [Desktop](lesson-review-2026-11-23/ears-1440.webp). Offline pack selection was tested separately. Physical devices and subjective listening quality were outside this browser run.
