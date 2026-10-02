# Fundal Reflex v1.1 evidence receipt

Date: 23 July 2026

## Eye-engine consistency follow-up

- `src/structural-eye-effects.js`: corrected the light-responsive pupil target to use radial beam distance, so vertical and horizontal light movement now produce equal responses at equal distances. The existing smoothing and acute-angle-closure bypass are unchanged.
- `index.html`: added explicit RE and LE accessible names to the paired pupil and upper-lid controls without changing their layout.
- `tests/run-tests.mjs`: added radial-response and examiner-facing laterality contracts.
- `app.bundle.js`: rebuilt from source with the fleet's existing local esbuild 0.25.5 binary.
- `service-worker.js`: bumped the app-scoped cache to `fundal-reflex-v1-1-20260723-eye1`.

Focused verification: `npm test` passed 7/7. The standard `npm run check` wrapper still cannot resolve an app-local esbuild installation because this folder has no `node_modules`, so the production bundle was rebuilt by direct local binary invocation. Fresh HTTP review at exactly `360 x 740` confirmed the RE/LE names, no browser warnings or errors and no change to the established eye geometry. The normal and bilateral dense-cataract states were reviewed side by side. The dense state is already materially darker and uses the same obstruction pattern as Sauron, so no further clinical presentation change was made.

### UI polish

The red identity, outer-shell radii, stage layout, type hierarchy and compact control arrangement remain clear at `360 x 740`. The paired advanced controls gained side-specific accessible names only. Dense-cataract salience was retained because it is already visually distinct and further darkening would require clinical judgement.

Current direct-file browser rechecking was blocked by the browser-control URL policy. Earlier direct-file evidence remains recorded below. Service workers do not run on `file://` pages.

## Changed implementation

- `index.html`: manifest metadata and deliberate session reset controls.
- `script.js`, `src/session-reset.js`, `src/pwa.js`, `app.bundle.js`: source-wired reset and progressive service-worker registration, with the generated bundle rebuilt.
- `styles/menus.css`: restrained menu styling for the secondary reset action.
- `styles/responsive.css`, `style.css`, `index.html`, `service-worker.js`: Swollen Discs-aligned mobile edges plus versioned local stylesheet and cache references.
- `manifest.webmanifest`, `service-worker.js`: installable local app shell and same-origin runtime caching.
- `package.json`, `tools/build.mjs`, `tests/run-tests.mjs`: pinned build and repeatable contracts.
- Governance files: gap list, clinical status, device checklist, README and memory-bank updates.

## Verification

- Bundle: esbuild 0.25.5 completed by direct local binary invocation. The standard npm wrapper encounters sandbox `spawn EPERM`; this is an execution-environment limitation rather than an app build error.
- Contracts: `node tests/run-tests.mjs` — 7/7 passed.
- Runtime dependencies: no HTTP or HTTPS dependency in `index.html` or the stylesheet entrypoint.
- Local runtime: HTTP 200 at `/Fundal%20Reflex/index.html`.
- Browser: isolated Chrome/CDP checks passed over both HTTP and direct-file routes at exactly `360 x 740`. Untouched, dense Advanced controls, open menu, expanded result, armed reset and completed reset states were captured in `output/playwright/`. The document width remained `360px` and no runtime errors were recorded.
- Visual review: the compact red identity, dark eye stage, control hierarchy and established instructional italics were retained. The dense Advanced panel and side menu stay within the viewport without overlap or clipping.
- Follow-up mobile geometry: clean `360 x 740` review measured the black stage at `x=10`, `width=340`, `radius=16px` and the Action panel at `x=10`, `width=340`, `radius=18px`, with no horizontal overflow. Internal controls, teaching cases and output logic were unchanged.
- Follow-up contracts and syntax: 7/7 direct Node contracts passed. `app.bundle.js` was rebuilt from the final source with the fleet's existing local esbuild 0.25.5 binary. The combined npm build wrapper still cannot resolve its declared app-local `esbuild` package because this folder has no `node_modules` installation.

## Remaining gates

- Independent clinical review is not established.
- Physical-device and installed-offline checks remain outstanding.
- The folder has no app-level Git repository. Recovery depends on parent-folder arrangements.

## MCQ quality receipt — 26 July 2026

- Questions audited: 68 total — Primary 16, Intermediate 26 and Advanced 26.
- Attempt sizes preserved: 5, 6 and 8.
- Source metadata: NHS NIPE primary-source-reviewed, simulator catalogue internal-engineering-review and safety wording pending-independent-clinical-sign-off.
- UI: explanatory correct and wrong review, unanswered guard, fresh **New set**, result focus and 44px rows.
- Final automated result: 12/12 source and contract tests passed, generated bundle rebuilt and exact source/bundle parity passed.
- Duplicate-content follow-up: adjacent restatements were replaced with distinct examination-quality, limitation and application questions while preserving the 16/26/26 banks and 5/6/8 attempt sizes.
- Final isolated browser result: exact `360 x 740`, `scrollWidth=360`, five questions, five explanations, minimum option height `44.32px`, result focus, Escape focus return to `burger-icon`, fresh five-question set and no runtime errors.
- Clean-capture check: after the 240ms entrance animation, computed modal opacity was `1` with opaque `rgb(255, 255, 255)` to `rgb(249, 251, 255)` gradient. The earlier grey capture was an animation-frame artefact and was replaced.
- Browser evidence: `output/playwright/fundal-mcq6-mcq-review-360x740.png` and `output/playwright/fundal-mobile-report-mcq6.json`.
- Published browser token and scoped cache: `20260726-mcq6`.
- Clinical gate: simulator-specific interpretations and local escalation wording remain pending independent sign-off.
