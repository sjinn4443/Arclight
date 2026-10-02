# Three targeted loading improvements

30 September 2026. Scope: Allan image loading, Amsler export-library loading and Refract startup layout shift. No clinical rule, score, original image or flowchart changes.

## Implemented

- Allan: 21 reproducible small WebP thumbnails, deferred drawer image sources and full teaching cards loaded only on opening. Original high-resolution artwork and skin-tone variants remain available. Thumbnail builder: `Allan/tools/build-teaching-thumbnails.py`. Thumbnails use the existing menu geometry.
- Amsler: local html2canvas loaded only for first Download or Share, a shared in-flight promise, reuse for later exports, a 15-second timeout and recoverable retry feedback. Both export actions are disabled only during an active export and restored afterwards. Source rebuilt with the existing custom bundle builder.
- Refract: default simple-mode cylinder/axis visibility established in CSS before startup JavaScript, retaining the existing Advanced control and engine.

Versioned runtime asset references and each app's own service-worker cache were updated. Full teaching images and html2canvas remain in offline precache. The app's installed/offline asset footprint was not claimed to shrink.

## Measurements

| App     | Initial resource-body bytes before |   After |             Change | Mobile Lighthouse before → after |
| ------- | ---------------------------------: | ------: | -----------------: | -------------------------------: |
| Allan   |                          1,180,801 | 402,935 |         65.9% less |                          71 → 82 |
| Amsler  |                            391,415 | 194,492 |         50.3% less |                          86 → 96 |
| Refract |                            156,961 | 157,192 | 231 bytes more CSS |                          88 → 97 |

Resource-body totals come from isolated Chrome contexts with service workers blocked, summed from resource timing and excluding the HTML navigation. They measure the initial page path, not offline precache installation. Each app had identical totals at mobile, tablet and desktop in the scoped runs.

With Refract's app bundle delayed by one second in both before and after runs, initial CLS changed from 0.1791049 to 0.0000918 on mobile, 0.1639270 to 0.0000225 on tablet and 0.0253764 to 0.0000108 on desktop. Remaining tiny shifts are not described as zero.

Pinned Lighthouse 12.8.2 mobile audit using Edge: new LCP values were 3.83 s, 2.25 s and 2.26 s respectively. Accessibility and SEO scored 100 for all three. Best practices scored 100 for Allan/Amsler and 96 for Refract, unchanged in that category. No run warnings. These are single separate same-day lab runs, subject to variance and not physical-phone guarantees.

## Verification

- Allan: 30 unit/contract tests pass. Drawer thumbnails decode and stay at no more than 120 px natural width; full ABCDE and Chaos cards decode from original non-thumbnail light/dark sources. Escape closes cards and the drawer returns focus to its trigger. HTTP, file and offline paths pass.
- Amsler: 22 tests and canonical build check pass. First and repeated Download produce genuine non-empty WebP files. Report includes patient name, British date and separate RE/LE snapshots after a drawn mark. Export library is absent before exporting and requested once for repeated exports. Mocked native Share receives a WebP file. HTTP, file and installed offline paths pass. A deliberately aborted library request displays retry feedback, restores both buttons and a second request exports successfully.
- Refract: all six test jobs pass, including 960 context combinations, 60 determinism/swap/transpose cases, 3,780 weighted combinations, 740 safety checks and bundle parity. The new CSS startup contract passes. Simple and advanced field visibility plus completed output pass over HTTP, file and offline.
- Nine initial views at 360 x 740, 768 x 1024 and 1366 x 900 pass horizontal-overflow and runtime/console checks. Targeted workflow checks at 360 x 740 also have no unexpected console/page errors. The simulated library failure is an intentional network error, not a claim of error-free loading under failure.
- Visually inspected mobile main pages, a dark full teaching card, the exported report and Refract's completed advanced state.

Direct-file checks do not exercise service workers. Offline checks use a new context with a completed installation, switch offline then reload and exercise the changed workflows. Migration from every possible older installed cache version was not tested. Share is mocked, not a physical operating-system share sheet.

## Evidence and reproducibility

- `loading-review-20260930.mjs`: paired resource and delayed-start layout measurements with responsive screenshots.
- `loading-workflows-20260930.mjs`: real Chrome HTTP/file/offline teaching-card, report-export and Refract workflow checks plus export failure/retry.
- `output/playwright/loading-20260930/before/results.json` and `after/results.json`: measurements and console records.
- `output/playwright/loading-20260930/workflows/results.json`: nine workflow passes and the forced-failure/retry pass. Screenshots and six exported WebP files are alongside it.
- Lighthouse: `audit-reports/lighthouse/2026-09-30T21-17-16-438Z-mobile/`; earlier comparison: `2026-09-30T20-41-26-459Z-mobile/`.
- Scoped pre-change source/documentation backup: `output/loading-20260930/baseline/`.

## Hand-off and boundaries

Persistent Codex browser-toolbar verification passes for all three updated preview tabs. The first attempt could not find Glaucoma while another chat was foreground; after the user returned, the queued previews opened. The deterministic Arclight hand-off script read each toolbar at 843 x 1192, set it to 360 x 740 then verified both values after switching away and back. Each intended URL was re-read: `http://127.0.0.1:8090/<Allan|Amsler|Refract>/index.html?loadingFix=20260930`. Refract is the final selected tab. These real-chrome checks are separate from temporary automated viewports and do not establish physical-device acceptance or sibling-tab sizes.

No physical-device acceptance, independent clinical sign-off, exhaustive app-workflow coverage or complete fleet dead-code refactor is claimed. The three implementation priorities and scoped browser hand-off are complete. Skills used: Playwright for real-browser testing and arclight-browser-handoff for persistent real-chrome toolbar verification.
