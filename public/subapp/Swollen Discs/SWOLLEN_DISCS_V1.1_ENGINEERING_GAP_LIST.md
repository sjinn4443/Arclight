# Swollen Discs v1.1 engineering gap list

Audit date: 23 July 2026

| Area             | Baseline gap                                                                                    | Resolution                                                                                                                                                     |
| ---------------- | ----------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Recovery         | No independent Git repository                                                                   | Applied additive local edits only. No teaching sources, generated bundle, exports or images were removed.                                                      |
| Smoke tooling    | Expected `script.js` once as a module although the page uses the generated classic bundle       | Updated the contract to require one `app.bundle.js`, reject direct source-module loading and protect direct-file compatibility. Product logic was not changed. |
| Accessibility    | Modal focus was managed but the drawer lacked focus entry, containment and reliable restoration | Added an external enhancement layer which observes drawer state, contains Tab focus and restores the trigger.                                                  |
| Session state    | No explicit volatile training-session reset                                                     | Added a separated two-press reset which reloads established defaults. Earned local progress remains separately persisted.                                      |
| Local runtime    | Third-party `serve` was needed for `npm start`                                                  | Replaced it with a small bounded Node server. Normal runtime remains dependency-free and local-only.                                                           |
| PWA/offline      | No manifest or service worker                                                                   | Added an app-scoped manifest and cache covering the shell, fonts, full images, mobile images and phone preview asset.                                          |
| Browser evidence | No repeatable constrained-state receipt                                                         | Added isolated Chrome checks for untouched, dense, drawer, confirmation, reset, offline and direct-file states at 360 x 740.                                   |
| Dependencies     | Initial development audit reported vulnerable transitive tooling                                | Removed the third-party server and applied non-breaking audit remediation. Final audit: zero vulnerabilities.                                                  |

The normal selected condition remains an initial teaching comparison and is not represented as a patient assessment.
