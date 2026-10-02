# Mini-app integration into Arclight — 2 October 2026

The supplied 30 September snapshot has been merged into `public/subapp`: 14 existing mini apps updated, Discs added and the 15-app Gallery installed at `/subapp/gallery/index.html`.

## Source and host preservation

- Verified all 1,200 payload SHA-256 checksums against the ZIP's embedded file manifest before integration.
- Retained the host's iframe routes, navigation, quiz imports and shared locale runtime. Existing earned-progress storage keys remain in use.
- Kept the repository's lowercase `diabetic` directory and mapped its Gallery card and metadata accordingly. Fields retains its existing `index.html` redirect to `home.html`.
- Preserved Fundal Reflex's iPhone iris-position fix using CSS layout variables and rebuilt its bundle with the supplied canonical builder.
- Imported the supplied clinical and prescribing sources, authored questions, original artwork and editable Refract diagram. No additional clinical-rule or prescribing-weight edits were made during integration.
- Restored the host's escaped Fields arrow label so the HTML minifier can parse the updated page.
- Archived supplied agent guidance as `AGENTS.source.md` reference material. It was not installed as active workspace policy.

## Host repairs

- App workers read their own caches before considering shared locale assets. They preserve unrelated caches and precache the host translation loader. Cache identities and changed runtime URLs were updated where local bundles changed.
- Encoded folder names and directory entry routes now reach nonce-aware HTML serving, including the production build's separate media tree. External scripts receive the same request nonce so trusted export styling can use it.
- Amsler's export clone includes loaded local CSS and embedded fonts over HTTP, including offline operation. Direct-file exports retain their original stylesheet-loading path. The export library, CSS and font data are reused across repeated exports, with retry after loading failure. Amsler alone permits html2canvas's fixed pseudo-element stylesheet by its exact CSP hash.
- Developer tests, tools, research outputs, case CSVs and development documentation are excluded from generated deployment assets and offline manifests. The source server returns 404 for these paths. Their local copies remain available for development.
- Added `npm run check:miniapps`, host/cache regression tests and browser regressions for offline Amsler export, Glaucoma progress retention and fixture isolation.
- Added Discs to the real app's Interactive Learning list and its lazy-loaded iframe page. It uses the existing experimental learning notice, return navigation and embedded Eyes top bar dimensions. The shared top bar adapter now recognises the Discs and Squint information buttons and gives its injected stylesheet the iframe's CSP nonce; existing host settings are retained.
- CSS minification preserves relative stylesheet imports. This prevents the production build from discarding the split styling used by Fundal Reflex, Glaucoma and Refract.
- Embedded back arrows, menu glyphs and information icons use each app's visible title colour. Squint uses its painted amber title as the colour source. Existing popup behaviour and top bar dimensions are retained.

## Verification

- Gallery consistency: 15 cards, entry routes and thumbnails pass.
- Runtime inventory: 15 app entries, locale hooks and 404 declared precache assets pass existence, deployment filtering and case checks.
- Scoped app checks pass for all 15 apps. Cataract includes 21 contract/regression tests and 30 acceptance cases. Fields includes 28 contract/regression tests and lint. Refract includes its prescribing, context, weighted-rule, safety and bundle-parity checks. Fundal Reflex's 15 tests and bundle parity pass.
- Amsler, Fundal Reflex and Refract were rebuilt with their canonical scripts. Fundal Reflex and Refract use the locked esbuild 0.25.5 compiler; Amsler uses its supplied custom builder.
- Host Jest checks: translation runtime, quiz imports, deployment filtering, encoded HTML serving, CSP and app-cache isolation pass.
- HTTP information panels and drawers: 15/15 pass, including focus entry, Escape and focus return.
- Direct-file information panels and drawers: 15/15 pass.
- Primary MCQ workflows: 14/14 pass, including incomplete submission, marking, fresh retry, Escape and focus return. Morph has no MCQ bank.
- Responsive initial views: 45 views across 360 × 740, 768 × 1024 and 1366 × 900, with no horizontal overflow or captured runtime errors.
- Selected completed and expanded states: 18/18 pass across six apps and the same three viewport sizes.
- Allan teaching cards, Amsler report export and Refract completed advanced output pass over HTTP, direct file and installed offline operation. Amsler's deliberately failed library load recovers on retry. Share was mocked, with no operating-system share sheet or external delivery.
- Browser regressions pass for offline repeated Amsler downloads with metadata, Glaucoma cache isolation/progress retention and unavailable developer fixtures. The existing WebKit iris-centering regression passes with the preserved Fundal Reflex fix.
- The production build passes its asset budgets. Four browser regressions pass against the final minified shell/media deployment, including Gallery thumbnails, routes and responsive layout. No developer files are deployed or listed in its offline manifest.
- Interactive Learning host integration: 28/28 checks pass in desktop Chromium and iPhone WebKit, covering all 13 embedded pages, the existing notice, top bar sizing and return navigation. Discs opens from its new card using mouse/touch and keyboard, and its information popup and menu work.
- The normal local `dist`/`dist-media` build has been refreshed and passes its budgets. Seven final smoke checks pass against that build: Discs on desktop and iPhone, Amsler offline export, Glaucoma cache/progress retention, private fixture filtering, Gallery routes/images and Fundal Reflex iPhone iris positioning. Five project-specific checks are intentionally skipped.
- An isolated same-origin review loaded Glaucoma from the actual pre-integration backup, then loaded the new installation and reloaded offline. Stored earned progress and unrelated host/sibling caches remained intact.

Additional final direct-file, completed-state and deployment-build receipts are recorded in `verification.json` beside this report.

## Evidence and limits

Original upstream notes and receipts are retained here separately from this receiving-host report. Their historical test claims are not fresh checks of this integration. Original source hashes are in `HANDOVER_FILE_MANIFEST.json`; imported-file provenance is in `integration-files.json`.

The previous mini apps are backed up in the ignored workspace directory `tmp-miniapps-20260930/backup`. Current detailed browser evidence and logs are under `tmp-miniapps-20260930`. Responsive source captures are also under the local, deployment-excluded `public/subapp/Allan/output` directory.

No deployment or Git commit was performed. The exhaustive Fields output audit, every quiz tier/pass-fail combination and migration from every historical installed version were not rerun. Clinical sign-off, physical-device acceptance and a real native Share check remain unverified. Headless browser viewports do not establish retained Codex toolbar sizing.

The existing locale scripts are retained; newly authored copy may use the existing English fallback until reviewed translations are added. In particular, the old Fundal Reflex Lao override no longer replaces the revised purpose paragraph with superseded copy.
