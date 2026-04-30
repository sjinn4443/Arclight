<!-- THE CHANGES - activeContext.md | 2026-04-30, Codex -->

# Active Context

## Current Work Focus

Diabetic Retinopathy workshop stabilization and documentation refresh:

- the Eyes route now links into a substantial Diabetic Retinopathy workshop
- the workshop combines foldered lessons, progress rows, scroll-style pages, Videos-route lessons, protocol pages, and demo quiz pages
- `public/js/diabeticWorkshopNextFlow.js` owns the structural previous/next buttons and the cross-route flow through Videos pages
- runtime storage defaults to `storage/disabled-storage.cjs` unless Postgres URLs are configured; Playwright explicitly runs with `DISABLE_DB_STORAGE=1`

## Recent Changes

- Diabetic Retinopathy workshop flow (2026-04-30):
  - Added/expanded workshop lesson sections for introduction, diabetes/retinopathy basics, NCD clinic flow, protocol, and demo quizzes.
  - Added lesson progress tracking through `public/js/diabeticWorkshopProgress.js`.
  - Added structural Previous/Next controls that can move through workshop internal pages and Videos-route lessons, then restore the relevant workshop folder on return.
  - Added video page integration for diabetic workshop videos in `public/js/videos.js`.
  - Added assets for diabetic retinopathy and NCD protocol material under `public/images/learning/Diabetic/`.

- Runtime storage and Playwright isolation (2026-04-30):
  - `storage/index.cjs` now selects Postgres only when DB URLs are configured and `DISABLE_DB_STORAGE` is not enabled.
  - No DB URL, or `DISABLE_DB_STORAGE=1`, selects `storage/disabled-storage.cjs`.
  - `playwright.config.js` starts the local E2E web server with `DISABLE_DB_STORAGE=1`.
  - `.env.sample` documents split write/read/admin DB URLs, DB TLS options, telemetry host allowlisting, delete gates, and IPInfo token support.

- accessibility + translation QA baseline (2026-04-16):
  - `npm run test:a11y` now performs an actual static audit and currently passes on `76` HTML files.
  - `npm run check-translations` now audits only keys that are actually referenced by HTML/JS.
  - After removing duplicated onboarding/privacy headings, trimming install-helper labels, and switching reports pages to locale-aware runtime wiring, the remaining translation audit still reports locale debt:
    - missing used keys: `114`
    - damaged UTF-8 strings: `28`
    - exact-English carry-overs: `764`
  - Remaining missing-key debt is now concentrated on `auto.reports.aims`, `auto.reports.contact`, `auto.reports.country`, and `auto.reports.area`.
  - Persistent medical homonym guidance now lives in `scripts/i18n-qa-rules.cjs`.

- translation QA sweep (2026-03-26):
  - Replaced hardcoded English in the visual system eye/brain animation with locale-backed copy.
  - Fixed dashboard recommendations so localized subtitles render without async errors, and quick-action routing no longer depends on English button text.
  - Added shared legacy literal fallback coverage for common UI labels such as `Menu` and search aria labels.
  - Restored Eyes-page legacy root alias keys and aligned locale aliases so older tests/pages still translate correctly.
  - Recorded the standing translation QA rules: medical terminology accuracy, formal tone where appropriate, natural UI wording, native-script language names, symbol preservation, and JS/runtime text checks.

- Interactive Learning external embeds (2026-03-11):
  - Added `Fundal Reflex` and `Trauma` buttons under the Primary section, and `Amsler` under Intermediate on `interactiveLearningPage`.
  - Added matching hidden subpages in `public/html/videos.html` that lazy-load external Netlify apps via `iframe[data-src]`.
  - Kept the existing Videos-route wrapper pattern (same header/container flow and back-button behavior as local subapps such as `Morph` and `Mires`).
  - Normalized Interactive Learning card spacing so all card-to-card gaps match the preferred first-pair spacing.
  - Recorded the key maintenance constraint: Arclight can style the wrapper shell only; cross-origin iframe internals must be changed in the remote app.

- i18n translation policy update (2026-03-02):
  - Added a mandatory symbol-preservation rule for locale files.
  - UI symbols used as button/icon text (for example `☰`, `<`, `×`) must remain unchanged and must not be translated.

- Husky setup cleanup (2026-01-26):
  - Updated root `package.json` `prepare` script from deprecated `husky install` to `husky`.
  - Verified Git hooks path points to `.husky/_` and `pre-commit` runs `lint-staged`.

- Root README script coverage (2026-01-26):
  - Updated `README.md` to document additional `package.json` scripts that are actively available:
    - Playwright E2E/perf (`test:e2e`, `perf:e2e`)
    - Lighthouse CI (`perf:lh`)
    - Translation checks (`check-translations`)
    - Tracking server helper (`start:track`)

- Updated README files to align with current code:
  - Root `README.md`
  - `.github/README.md`
  - `reports/README.md`
  - `security/README.md`
  - `securitytest/README.md`
  - `tests/README.md`
  - `vscode-alanui-launcher/README.md`

## Next Steps

- Fill the remaining missing used keys, now concentrated on the four `auto.reports.*` table labels.
- Repair the remaining damaged locale strings (`�` / mojibake / `???`) before adding more translation content.
- Use `node scripts/check-translations.cjs --strict-english` after each locale sweep to drive down fallback-English carry-overs once missing/damaged keys are under control.
- Continue adding i18n keys for the Diabetic Retinopathy workshop, which currently contains substantial English static copy.
- Keep diabetic workshop folder/progress state aligned when adding or moving lesson rows.
- Keep external embed URLs and their purpose documented when Interactive Learning changes again.
- If a remote embed later blocks framing, switch that module to a local copy or an open-in-new-tab fallback.
- Add translation keys for `Trauma` and `Amsler` if those labels need to be localized instead of staying English-only.
- Keep folder READMEs in sync with future wiring changes (for example if optional routers under `reports/routes/` are re-enabled or if CSP/CORS/CSRF are reintroduced as middleware).
- Consider improving the VS Code launcher extension for Windows/Linux (replace macOS `open -a` with `vscode.env.openExternal()` and add `contributes.commands` to the extension manifest).
- Regenerate `folderList.txt` whenever large folder structure changes occur.

## Active Decisions and Considerations

- Prefer accurate, code-referenced documentation over aspirational or legacy docs.
- Use the existing Videos-route subpage pattern (`data-page`, `data-target`, hidden `.page` blocks, `iframe[data-src]`) when adding more Interactive Learning modules.
- Do not assume parent-page CSS/JS can control embedded external site UI across origins.
- For the Diabetic Retinopathy workshop, use stable `data-target`, `data-lesson`, and `data-folder` values because progress, folder restore, and next-flow routing depend on them.
- Treat no-op storage as the default local behavior unless DB URLs are intentionally configured.

## Important Patterns and Preferences

- When the repo mixes ESM and CJS, document the boundary and the mechanism used to keep tests stable (mocks + `moduleNameMapper`).
- Media accessibility is now enforced in two layers:
  - runtime labeling in `public/js/mediaA11y.js`
  - static audit enforcement in `scripts/test-a11y.mjs`
- In translation JSON files, preserve icon/symbol values exactly as-is. Do not localize `☰`, `<`, `×` (and equivalent UI symbol tokens).
- For Interactive Learning under `videos.html`, prefer the existing hidden-subpage + lazy iframe pattern over special-case navigation.
- Translation QA must also cover runtime strings inserted by JS, not just static HTML and locale files.
- Reports/admin UI must not force English just to keep column wiring stable; use stable identifiers (`data-col`) plus locale-aware runtime strings instead.
- `scripts/check-translations.cjs` is now the canonical audit entry point for used-key coverage, damaged-string detection, and fallback-English review.
- Keep required legacy root alias keys aligned with scoped keys where older pages/tests still reference those root keys.
- For Interactive Learning under `videos.html`, prefer the existing hidden-subpage + lazy iframe pattern over special-case navigation.
- Diabetic workshop route changes should be checked for structural back behavior from both the workshop home and nested lesson pages.
