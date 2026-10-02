# Refract v1.1 engineering gap list

Date: 23 July 2026

| Gap                                    | Resolution                                                                                                                                                |
| -------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Mobile zoom disabled                   | Removed `maximum-scale` and `user-scalable=no`.                                                                                                           |
| Remote font and icon dependencies      | Removed Google Fonts and Font Awesome. Existing local Inter and Quicksand files now cover runtime typography and the transpose mark is local text.        |
| No deliberate case reset               | Added a two-press **New case** action which reloads the blank case while preserving the cup achievement.                                                  |
| No install or offline shell            | Added an app-scoped manifest and service worker with a `refract-` cache namespace. Direct-file use remains supported without service-worker registration. |
| No formal contracts                    | Added deterministic heuristic, transpose, runtime-locality, zoom and reset/PWA contracts.                                                                 |
| Generated bundle had no declared build | Added a pinned esbuild command and rebuilt `app.bundle.js` from source.                                                                                   |

The live heuristic, prescription configuration, workbook benchmark engine, field IDs, outputs and workflow order were not changed.
