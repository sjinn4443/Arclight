# Product audit implementation — 18 September 2026

The six selected findings from the 9 September audit were compared with the
current source before changing it. Spanish/Korean timed Fundal captions, speech
cues and VTT already contained the three reported safety instructions. Those
translations were retained; stale broad cues were synchronized and matching
delivery audio was regenerated. Human clinical approval remains pending.

## Implemented

- Generate shell and offline manifests from final build output. Reject failed
  service-worker installation, announce failures accessibly, and preserve
  revision-checked optional downloads across shell upgrades. Interrupted pack
  downloads resume at file boundaries; a partially downloaded file restarts.
- Emit separate shell, media and source-map trees, preserve runtime URLs, serve
  both content trees through Express/Docker, and upload separate CI artifacts.
  Budget every uploaded file, including generated manifests.
- Apply RTL for Arabic, Persian and Urdu, restore LTR for other locales, use
  logical shared spacing and align Eyes carousel controls in either direction.
- Add seven viewport sizes in Chromium and WebKit, overflow/screenshot
  assertions, rendered axe checks, and a service-worker-enabled offline project
  that navigates a real lesson menu and plays cached M4A and MP4 files.
- Gate CI on strict incremental type checking, clinical safety assertions,
  existing animation journeys, and three Lighthouse runs per audited route.
  Clinical approval must pass before publishing build artifacts.
- Fix issues exposed by these gates: nested interactive Eyes cards, small
  carousel targets, disabled zoom, missing page metadata/main landmark, and
  narrow-screen WebKit overflow. Installation alerts stay in document flow so
  they do not cover lesson controls.

## Build evidence

| Output                      |  Actual bytes |        Budget |
| --------------------------- | ------------: | ------------: |
| Complete shell              |    19,174,231 |    20,000,000 |
| Shell, summed per-file gzip |     9,845,022 |    12,000,000 |
| Optional content tree       | 1,579,701,617 | 2,000,000,000 |

The generated offline manifest has 5,205 assets, including 334 shell precache
URLs and 4,869 revisioned pack assets. Every listed URL resolves to an emitted
file. No source maps are listed. Local evidence: `dist-size-report.json`,
`dist/shell-assets.json`, `dist/offline-assets.json`.

## Validation

- Production build, strict type check, formatting and `git diff --check`: passed.
- Jest: 62 suites and 448 tests passed.
- Translation completeness and static accessibility scans: passed.
- Production dependency audit: zero reported vulnerabilities.
- Browser quality matrix: all 43 cases passed across the final full run and
  targeted rechecks. The final full run passed 39 cases; one Windows Playwright
  worker failed to load an existing dependency, and the strengthened offline
  test initially used the empty Videos parent route. The three affected WebKit
  cases and the corrected real-lesson offline journey then passed together.
- Examination animation journeys: all 18 cases passed across the final runs.
  Ten existing heading/navigation cases passed, and all eight speech-clock cases
  passed after isolating keyboard advancement from scroll-triggered autoplay,
  waiting for the arrow transition, and awaiting complete WebKit restoration.
- Existing Fundal browser regression suite: 20 passed and six existing
  browser-specific skips; no failures.

Lighthouse mobile median scores (three runs each, onboarding already completed):

| Route            | Performance | Accessibility | Best practices | SEO |
| ---------------- | ----------: | ------------: | -------------: | --: |
| Dashboard        |          89 |           100 |             96 | 100 |
| Eyes             |          92 |           100 |             96 | 100 |
| Required minimum |          80 |            95 |             95 |  90 |

HTML/JSON evidence is in `quality-reports/lighthouse/`. Screenshot and axe
artifacts are in the Playwright output directories. CI uploads these reports.
The seven sizes are 320×568, 390×844, 844×390, 768×1024, 1024×768, 1440×900 and
1920×1080.

## Remaining human review and limits

Follow [the bilingual review procedure](../clinical-review/README.md) and record
actual approvals in `clinical-review/fundal-es-ko.json`. Automated checks verify
specific safety wording, caption consistency and content hashes; they do not
approve pronunciation or clinical equivalence. The approval command currently
fails intentionally because neither language has a human approval.

Type checking covers the manifest/distribution and locale-direction modules;
it is an incremental baseline. WebKit automation is not physical iOS testing.
The existing Windows WebKit animation tests use their narration-clock helper;
the Chromium offline test uses real media decoding. Screenshot assertions check
dimensions and nonblank content, rather than a pixel-perfect golden baseline.
No production deployment, remote CI run or branch-protection change was made.
The CI check must be required in branch protection to prevent bypassing it.
