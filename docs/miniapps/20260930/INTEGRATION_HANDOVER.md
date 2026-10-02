# Arclight App Integration Handover

Updated 30 September 2026.

## Current September delivery — read this first

Use `DEVELOPER_UPGRADE_NOTES_20260930.md` as the current integration instructions and agent brief. This delivery is a full snapshot of the 15 app folders, not a delta against an unknown earlier installation. Preserve the receiving host's routing, authentication, storage and native bridges while merging the supplied mini-app improvements.

The Gallery metadata and all 15 previews have been refreshed on 30 September. Fresh initial app captures pass at `360 x 740`. The Gallery passes HTTP checks at `360 x 740`, `768 x 1024` and `1366 x 900` plus direct-file checks at `360 x 740`, with 15 decoded previews, no horizontal overflow and no captured console/page errors. `gallery/contact-sheet.png` is the static wide overview.

`HANDOVER_FILE_MANIFEST.json` in the ZIP records the SHA-256 and byte size of every payload file except the manifest itself. The adjacent ZIP checksum verifies transport integrity. `HANDOVER_PACKAGE_RECEIPT.json` records packaging and validation. No dependency folders, original patient workbooks or large temporary audit directories are included. A small explicitly listed Refract test-fixture subset is retained under `Refract/outputs/` because existing tests import it. This exception is not a promotion of experimental logic. Development case fixtures must not be exposed in the public app deployment.

The remaining verification and cleanup text below was written for the July delivery. It is historical evidence, not a claim that every test or every installed-cache migration was repeated for this ZIP. Current implementation evidence is in the dated September receipts and the developer notes.

## What this folder contains

This is the clean integration copy of the 15 Arclight mini apps plus the shared Gallery catalogue. Each app retains its source, current browser runtime, local assets, tests, package manifest, available package lock, README and memory bank.

The apps are assessment aids, teaching guides and simulators. Engineering verification does not constitute independent clinical sign-off.

## App entry points

| App           | Entry file                 | Gallery thumbnail                       |
| ------------- | -------------------------- | --------------------------------------- |
| Allan         | `Allan/index.html`         | `gallery/thumbnails/allan.webp`         |
| Amsler        | `Amsler/index.html`        | `gallery/thumbnails/amsler.webp`        |
| Cataract      | `Cataract/index.html`      | `gallery/thumbnails/cataract.webp`      |
| Diabetic      | `Diabetic/index.html`      | `gallery/thumbnails/diabetic.webp`      |
| Discs         | `Discs/index.html`         | `gallery/thumbnails/discs.webp`         |
| Fields        | `Fields/home.html`         | `gallery/thumbnails/fields.webp`        |
| Fundal Reflex | `Fundal Reflex/index.html` | `gallery/thumbnails/fundal-reflex.webp` |
| Glaucoma      | `Glaucoma/index.html`      | `gallery/thumbnails/glaucoma.webp`      |
| Mires         | `Mires/index.html`         | `gallery/thumbnails/mires.webp`         |
| Morph         | `Morph/index.html`         | `gallery/thumbnails/morph.webp`         |
| Refract       | `Refract/index.html`       | `gallery/thumbnails/refract.webp`       |
| Sauron        | `Sauron/index.html`        | `gallery/thumbnails/sauron.webp`        |
| Squint        | `Squint/index.html`        | `gallery/thumbnails/squint.webp`        |
| Swollen Discs | `Swollen Discs/index.html` | `gallery/thumbnails/swollen-discs.webp` |
| Trauma        | `Trauma/index.html`        | `gallery/thumbnails/trauma.webp`        |

The machine-readable catalogue is `gallery/apps.json`. Its relative entry paths assume that `gallery` remains beside the 15 app folders.

## Integrating into an existing host

The receiving application already has earlier versions of these apps, so merge one app folder at a time rather than replacing the host application wholesale.

1. Back up the receiving application.
2. Compare each matching app folder and bring across the updated app files.
3. Retain each current browser runtime and any generated bundle as well as its source files.
4. Copy the complete `gallery` folder. If the host uses different routes, change the `entry` values in `gallery/apps.json` and the matching card links in `gallery/index.html`.
5. Keep each app’s manifest and service worker scoped to its own folder.
6. Re-run the dependency-free checks from the parent folder:

```powershell
node gallery/verify.mjs
node fleet-contract-check.mjs
```

7. Review the integrated result at `360 x 740` and on the intended physical device.

The apps include their current runtime assets, so installing Node packages is not required merely to open them. To rebuild or run an app’s development checks, run `npm ci` inside that app folder first.

## Gallery update

The Gallery now lists all 15 apps. It includes:

- current `360 x 740` previews resized to `180 x 370`
- visible app names and concise descriptions
- corrected app purposes, including Mires as a tonometry simulator
- a two-column mobile layout with a 12px descriptive-text floor
- local icons, a local favicon and lazy-loaded previews
- a dependency-free manifest and card consistency check

The Gallery was checked at `360 x 740` and `1024 x 800`. Both reviews had no horizontal overflow and no browser-console warnings or errors.

## Historical July verification receipt

- `gallery/verify.mjs`: passed for 15 apps, entry files, cards and thumbnails
- `fleet-contract-check.mjs`: passed for 15 apps and seven excluded non-app directories before packaging cleanup
- Allan, Amsler, Cataract, Diabetic, Discs, Fundal Reflex, Glaucoma, Mires, Morph, Refract, Sauron, Squint, Swollen Discs and Trauma: current `npm test` passed before dependency removal
- Fields: current contract, lint, MCQ and context checks passed. Its exhaustive output-mode audit was stopped after 45 seconds during this packaging pass to avoid an unbounded wait. The retained `Fields/output-mode-audit-report.txt` records the completed exhaustive audit

The detailed historic engineering evidence remains in the parent Markdown documents and each app’s documentation. Large generated screenshots, reports and browser-control artefacts are intentionally omitted from this clean copy.

## Status and remaining gates

- Engineering consistency: verified for integration
- Independent clinical sign-off: not confirmed
- Physical-device acceptance: not completed
- Desktop browser emulation: not a substitute for physical-device acceptance
- Direct-file operation: retained where the individual app supports it
- Service workers: HTTP or HTTPS only, not `file://`

## Historical July packaging cleanup

The clean copy omits:

- all `node_modules` folders
- generated `output`, `audit-reports` and `fleet-output` folders
- Playwright session folders and temporary browser evidence
- local server logs and review screenshots
- the stale root `Diabetic.zip`
- empty internal `.git` and `.agents` folders

Package files, available lockfiles, tests, runtime bundles, source, manifests, service workers, assets and documentation remain.
