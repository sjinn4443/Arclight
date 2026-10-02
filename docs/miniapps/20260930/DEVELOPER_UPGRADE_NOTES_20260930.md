# Arclight mini apps — September upgrade hand-over

30 September 2026. Full source/runtime snapshot of 15 mini apps plus the refreshed Gallery. The receiving developer already has earlier iterations installed. Integrate the supplied improvements into those existing routes, not into a new host application.

## Start here

1. Back up the receiving code and deployed assets. Record the existing routes, host-specific changes, local-storage keys, offline scopes and native bridges.
2. Read the root `AGENTS.md`, each app's local guidance and README then the dated receipts listed below. New dated sections supersede older status notes; do not flatten away the history.
3. Compare each corresponding app folder. Merge the supplied source, generated runtime, styles and assets together. Preserve host-specific adaptations. Do not overwrite the host wholesale or infer that all old files are dead.
4. Preserve folder case and spaces or explicitly remap every asset, manifest and service-worker route. Fields opens at `Fields/home.html`; the other 14 apps open at `index.html`.
5. Copy the refreshed `gallery` folder beside the app folders. If host routes differ, update both `gallery/apps.json` and the matching links in `gallery/index.html`. The contact-sheet previews are already refreshed; no manual screenshot replacement is needed.

## What is improved

- Fleet UI: more consistent compact black bars, app-specific accents, local fonts/icons, mobile spacing, information panels, focus/Escape handling and quiz presentation. Existing workflows and app identities remain.
- Information panels: purpose, input and limitations remain initially visible. The simple visible footer is `v1 · 30/9/2026`; internal engine/package versions are separate and must not be forced to v1.
- Quizzes: retain authored questions, tier ownership, rationales, scoring, progression and fresh retry. Morph deliberately has no MCQ bank.
- Performance: nine production bundles in eight apps were minified using canonical source builds. The earlier measured combined shipped JavaScript saving was 46.36%. This is not a claim of exhaustive dead-code removal.
- Allan: 21 small derived teaching thumbnails and deferred hidden/full teaching-image loading. Keep the original high-resolution images and light/dark variants.
- Amsler: local export-library loading is deferred until first Download or Share, reused thereafter and recoverable after failure. Keep patient/date metadata, RE/LE report snapshots, export feedback and offline library precache.
- Refract: simple-mode fields are hidden by CSS before startup scripts arrive, reducing layout shift. Advanced fields and current calculation behaviour remain.
- Refract also includes the current weighted prescribing implementation and editable integrated flowchart from the earlier work. Preserve the installed implementation. Research candidates are not production replacements.
- Earlier explicitly authorised clinical repairs are documented for Cataract and Glaucoma. Preserve Glaucoma's user-approved END-STAGE label and black C/D 0.9–1 column. Fields and Squint had no additional production logic change in that repair pass.

## Safeguards for the receiving agent

Do not change clinical thresholds, referral wording, prescribing weights, simulator mappings or quiz answers as part of integration. Report possible defects separately. Engineering tests and agreement with historical prescribing examples are not clinical approval or prospective accuracy.

Read `Refract/FLOWCHART_LAYOUT_RULES.md` before any future diagram edit. Keep a single white-background editable flowchart, visible weights, direct logical routes, separate outside lanes and ports, no lettered continuation circles and subtly rounded elbows. Inspect every route at readable zoom. Do not replay old migration/experiment scripts to reconstruct the approved chart.

Use British English without Oxford commas. Preserve the main-page layouts and check `360 x 740` first, then tablet and desktop. In Codex, use the real device-toolbar hand-off procedure in `AGENTS.md`; temporary browser emulation is not proof of persistent retained-tab sizing.

## Build and integration checks

The supplied runtime already runs without installing Node packages. Install development dependencies only when rebuilding or testing, using the relevant app's `npm ci` and canonical scripts. Keep lockfiles. Rebuild bundles from source, never independently edit the shipped minified bundles. `build-bundles.cmd` calls the canonical app builds, including custom builders and Refract's separate MCQ bundle.

From the package root:

```powershell
node gallery/verify.mjs
node fleet-contract-check.mjs
```

Then run the applicable per-app tests from their folders. The Fields exhaustive output-mode audit can take a long time: report current completed coverage honestly and do not relabel historical coverage as a fresh pass.

Verify these acceptance paths in the actual receiving host:

- All 15 untouched entries, information panels, drawers, Escape and focus return
- All 14 MCQ apps: incomplete submission, fail/pass review, rationale, fresh retry and retained progression
- Representative completed patient/examination states, reset and required safety cues
- Allan drawer previews plus full teaching cards and their light/dark variants
- Amsler first/repeated Download, Share and deliberately failed library-load recovery
- Refract simple/Advanced visibility and completed output against supplied regression fixtures
- Mobile `360 x 740`, tablet `768 x 1024` and desktop `1366 x 900`, with no horizontal overflow or new runtime errors
- Direct-file use where supported; service workers do not run on `file://`

## Existing installations and caches

Keep each app's service worker and cache scoped to its own route. Preserve the supplied versioned asset URLs and cache updates, adapting scope only if the host route requires it. Never clear sibling-app caches or all local storage. Keep earned quiz progression and other established storage behaviour.

Test an upgrade from the developer's actual older installation: load it first, deploy the new assets, allow its app-scoped service-worker update, reload and exercise the changed paths. Then test offline after successful installation. Report any stale asset, broken route or lost progression. Migration from every historical installed version has not been proved here.

Run physical-phone/tablet acceptance, including real native Share where relevant. Independent clinical sign-off is still pending and must be recorded separately.

## Evidence and measured boundaries

Read these current root receipts in this order:

1. `LOADING_IMPROVEMENTS_20260930.md` — the latest three targeted optimisations and HTTP/file/offline workflow checks
2. `FLEET_PERFORMANCE_REVIEW_20260930.md` — bundle reduction, paired lab results and refactor boundaries
3. `FLEET_UI_REFINEMENTS_2026-09-30.md` and `FLEET_FIXES_2026-09-30.md` — UI and engineering repairs
4. `CLINICAL_LOGIC_FIXES_20260930.md` — the separately authorised clinical logic fixes and caveats
5. `ARCLIGHT_APP_UPGRADE_MATRIX.md` — app-specific evidence and remaining gates

Latest single-run mobile Lighthouse scores were Allan 82, Amsler 96 and Refract 97. Initial resource-body totals fell by 65.9% for Allan and 50.3% for Amsler with service workers blocked. Offline precache still includes full assets, so installation/download footprint did not shrink by those percentages. Refract's forced-delay mobile CLS fell from 0.17910 to 0.00009. These are lab measurements, not physical-phone guarantees.

Large raw screenshots, Lighthouse reports and temporary evidence are omitted from this clean hand-over; their historical workspace paths in receipts will therefore not resolve inside the ZIP. Summary receipts remain included. This package is not a fresh exhaustive test of every app interaction.

## Contents and privacy

Included: all 15 app folders, source, current bundles, local assets and licences, package files/lockfiles, tests, app documentation/memory banks, current Refract draw.io chart, Gallery and root governance/receipts.

Omitted: `node_modules`, `.git`, `.agents`, local tooling caches, browser profiles, temporary output directories, logs and redundant ZIPs. No original Excel workbook is shipped. The minimal Refract regression/research fixtures are preserved solely to keep existing tests reproducible. The 60-row CSV is case-based clinical data even though its patient-name columns are blank: handle it privately and exclude `tools`, `tests`, `outputs` and research documentation from public runtime deployment. Do not infer regulatory anonymisation from blank name columns.

## Paste-ready brief for her agent

> Integrate this 30 September 2026 Arclight mini-app snapshot into our existing installation. Read DEVELOPER_UPGRADE_NOTES_20260930.md and AGENTS.md first. Compare and merge each of the 15 app folders, preserving our host routes, authentication, storage, native bridges and app-specific identity. Bring source, built bundles, styles, local assets and the refreshed Gallery across together. Preserve all supplied clinical logic and quiz scoring. Rebuild only with canonical app scripts. Verify mobile, tablet and desktop layouts, focus/Escape, quizzes, completed states and the three targeted loading workflows. Test upgrade/cache migration from our actual previous installation and then offline behaviour without clearing unrelated caches or earned progression. Keep development case fixtures private and out of the public deployment. Record changed files, tests, host-specific differences and any unresolved clinical or physical-device gates. Do not promote Refract research candidates or rerun obsolete flowchart migrations.
