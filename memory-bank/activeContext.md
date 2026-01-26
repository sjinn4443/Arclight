<!-- THE CHANGES - activeContext.md | 2026-01-26, Cline -->

# Active Context

## Current Work Focus

Documentation refresh: updating README files across key folders so they accurately reflect the current server wiring, telemetry/reports flow, CI pipeline, tests (including ESM/CJS constraints), and the VS Code launcher extension.

## Recent Changes

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

Key corrections included:

- Reports/telemetry docs now match the fact that **`server.cjs`** serves and protects `/reports.html` and `/html/reports.html` and exposes `/api/dev/users` + `DELETE /api/dev/users/:anonId`.
- Telemetry encryption docs now match **`ENCRYPTION_SECRET`** usage from `reports/security/encrypt.cjs` and its integration in `storage/ndjson-storage.cjs`.
- Security docs now note that `security/cors.cjs`, `security/csp.cjs`, and `security/csrf.cjs` are currently placeholders.
- Test docs now document the Jest `moduleNameMapper` approach used to avoid ESM/CJS interop issues when CJS tests import browser ESM modules.

## Next Steps

- Keep folder READMEs in sync with future wiring changes (e.g., if optional routers under `reports/routes/` are re-enabled or if CSP/CORS/CSRF are reintroduced as middleware).
- Consider improving the VS Code launcher extension for Windows/Linux (replace macOS `open -a` with `vscode.env.openExternal()` and add `contributes.commands` to the extension manifest).
- Regenerate `folderList.txt` whenever large folder structure changes occur.

## Active Decisions and Considerations

- Prefer accurate, code-referenced documentation over aspirational/legacy docs.
- Avoid introducing new runtime behavior while updating documentation (docs-only change).

## Important Patterns and Preferences

- When the repo mixes ESM and CJS, document the boundary and the mechanism used to keep tests stable (mocks + `moduleNameMapper`).
