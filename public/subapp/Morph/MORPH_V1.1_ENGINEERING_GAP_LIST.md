# Morph v1.1 engineering gap list

Audit date: 23 July 2026

## Baseline and resolution

| Area          | Audit gap                                                   | Resolution                                                                                                                            |
| ------------- | ----------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------- |
| Recovery      | Morph is not an independent Git repository                  | Preserved the existing files and made local additive edits only. No files or teaching assets were removed.                            |
| Accessibility | Drawer focus was not contained or reliably returned         | Added trigger capture, focus entry, Tab containment and focus restoration. The guide uses the same containment rule.                  |
| Session state | No explicit way to clear the current teaching configuration | Added a two-press full-session reset in the side menu. It performs a clean reload into the established defaults.                      |
| Runtime       | Fonts and images were already local                         | Retained the local-only runtime and added a contract which rejects remote runtime URLs.                                               |
| PWA/offline   | No manifest or service worker                               | Added a Morph-scoped manifest and service worker which caches the shell, fonts and six teaching images. Direct-file use is unchanged. |
| Tests         | No automated regression checks                              | Added six static contracts and an isolated-Chrome workflow covering 360 x 740, dense state, drawer, reset and offline reload.         |
| Documentation | No explicit clinical or physical-device gate                | Added explicit status documents and refreshed all memory-bank files.                                                                  |

## Deliberately not changed

The inline viewer engine, cataract presets, field radii, Rx scale, pathology rendering, image assets, control order, app IDs, clinical teaching text and cup-achievement behaviour were not redesigned. Morph remains a teaching aid rather than a diagnostic system.
