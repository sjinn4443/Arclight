<!-- THE CHANGES - activeContext.md | 2026-03-11, Codex -->

# Active Context

## Current Work Focus

Interactive Learning documentation refresh after adding new embedded modules and normalizing card spacing on the Videos route.

## Recent Changes

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

## Important Patterns and Preferences

- When the repo mixes ESM and CJS, document the boundary and the mechanism used to keep tests stable (mocks + `moduleNameMapper`).
- In translation JSON files, preserve icon/symbol values exactly as-is. Do not localize `☰`, `<`, `×` (and equivalent UI symbol tokens).
- For Interactive Learning under `videos.html`, prefer the existing hidden-subpage + lazy iframe pattern over special-case navigation.
