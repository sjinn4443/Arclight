# System Patterns

<!-- APP-DOC-STATUS:START -->

## Current Memory Status (21/7/2026)

- Static packaging: open `index.html` directly, or use HTTP for installable offline support and service-worker testing.
- Mobile target: `360 x 740`, with the main page kept free of required vertical scrolling.
- Shared appbar: `54px` high; `Quicksand` `25px`/`700` title; `44 x 44` burger and info buttons set `12px` from the edges.
- Burger glyph: shared CSS three-bar mark, `18px` wide with `2px` strokes, so no app depends on a bold font glyph.
- Shared side menu: left drawer under the appbar; `min(76vw, 284px)` width; `16px` padding; pale `#f8fbff` surface; blue-grey border; card-style actions with small level dots.
- Appbar content colour: purple `#a855f7` on a black appbar.
- Favicon: current black-square app favicon with the app letter or letters centred.
<!-- APP-DOC-STATUS:END -->

_Last updated: 21/7/2026_

## Structure

The app is intentionally simple:

- `index.html` for static markup
- `styles.css` for all styling
- `referral-logic.js` for pure referral evaluation, canonical action labels and shared clinical copy
- `script.js` for DOM state, UI orchestration, reports and capture handling
- `mcq-bank.js` for MCQ question banks
- `tests/referral-logic.test.js` for Node regression tests
- image assets in the root folder

No build step is used.

## Image State Pattern

Reference image:

- chosen by active tab
- may be chosen by skin type
- the rash tab also depends on the Pattern dropdown
- uses `setImageWithFallback`
- uses the active route's base image and current skin tone as fallback; it must never fall back to an unrelated lesion route
- hides the image if neither the requested source nor the route fallback loads

User image:

- chosen by active tab from captured data URLs
- empty state if no relevant capture exists
- `Lesion`, `Rash` and `Wood's lamp` use Close
- `Dermoscopy` uses Dermoscopy

The user image should never fall back to the old `celt` reference asset.

## Reference Map

`referenceImageMap` in `script.js` controls reference assets:

- `ABCDETab`: light and dark
- `BVPDSTab`: internal Dermoscopy tab, light and dark
- Dermoscopy side-menu examples: paired light/dark files `dermoscopy-examples/chaos-clues-##_light.webp` and `_dark.webp`
- `DPICTab`: internal rash tab, pattern keys with light and dark
- `UVTab`: `assets/images/uv-reference.webp`

## Capture Relevance Pattern

`updateCaptureRelevance(tabId)` assigns:

- active source
- muted source
- context source

This is a UI guide only. It does not change referral logic.

Capture files are validated before use. Only JPEG, PNG and WebP files up to `12 MB` are accepted. File-picker and drag-and-drop paths share the same validation and error status. Originals remain as `File` objects for sharing; revocable object URLs drive previews and are released when a capture is replaced or New assessment clears the case.

## Help Pop-Up Pattern

All help buttons use:

- `.term-info-button`
- `.term-info-trigger` for teaching legend buttons
- `data-term-body`
- shared `#termInfoPopover`

The pop-up:

- is fixed-position
- closes on outside click
- closes on Escape
- closes on tab change, scroll or resize
- does not affect referral logic
- is capped to the viewport and scrolls internally when the source or logic explanation is long

Dermoscopy bucket rows are the exception to the usual small-info-button pattern. They use inline chevron expanders so the four bucket meanings are readable without leaving the panel. Keep only one bucket detail open at a time.

## Teaching Overlay Pattern

Expanded reference teaching uses the same overlay shell for Lesion and Dermoscopy:

- `#holdExpandOverlay`
- `#holdExpandTeachingToggle`
- `setTeachingMode`
- tab-specific overlay and legend containers
- clickable legend rows using `.term-info-trigger`

Teaching overlays are only available on `ABCDETab` and `BVPDSTab`. The normal comparison-stage reference stays clean. Rash and Wood's lamp currently do not use teaching overlays. Row-level explanations use inline chevron details across Lesion, Dermoscopy, Rash and Wood's lamp; global/source explanations still use the small info pop-up. The Dermoscopy side-menu examples are teaching variants only: selecting one changes the illustrative reference image and does not change scoring. The Lesion reference carousel cycles the base image plus five paired light/dark variations; the expanded Teaching toggle is hidden on variation images because the fixed callouts only fit the base image. The Lesion and Dermoscopy teaching cards are separate side-menu actions that open paired full-screen teaching-card assets and do not change the route or scoring.

## Location Picker Pattern

The visible picker is custom:

- `#locationPickerButton`
- `#locationPickerMenu`
- `.location-option`

The hidden native select remains:

- `#lesionLocation`

When a custom option is selected, the native select value is updated and a `change` event is dispatched.

## Referral Logic Pattern

Referral logic is deliberately simple:

- `calculateABCDEScore`
- `getBVPDSFindings`
- `calculateDPICScore`
- urgency conversion functions per group
- final urgency is the highest urgency across ABCDEFG, dermoscopy, BCC/SCC signs and rash triage
- ties use `ACTION_RANK`, not evaluation-array or tab order

The implementation is split into two layers:

- `script.js` reads the current controls and builds a plain assessment-state object
- `referral-logic.js` evaluates that object without reading the DOM

This pure boundary must be preserved so route priorities and tie behaviour remain directly testable with Node.

Wood's lamp does not affect referral urgency.

Fresh load and fully cleared criteria show `Not assessed yet`. ABCDEFG and dermoscopy are separate pigmented lesion checks; the final urgency uses the highest urgency rather than adding their totals.

The internal Dermoscopy IDs still use `BVPDSTab` and `bvpds` for stability, but visible copy uses a Chaos + Clues teaching compression with chaos, four clue rows and a separate exception row. Chaos, clues and exception are visually grouped to show sequence without making them look unrelated. The final clue row is labelled `Vessels / nail` because palm/sole ridge pigment sits in the exception row. The clue rows are disabled until chaos is selected and unticking chaos clears them. Dermoscopy logic is sequence-based: chaos plus any clue, or an exception, maps to Susp cancer pathway (2 week wait).

ABCDEFG and `DPIC-R` totals are teaching prompts only:

- any ABCDEFG finding maps to `Photo + Review`; the internal total never maps directly to the suspected cancer pathway
- only qualifying dermoscopy findings or explicit SCC concerns map a lesion assessment to the suspected cancer pathway
- every rash select begins with an empty `Not selected` or `Not checked` value
- benign zero-value rash selections mark the section assessed but remain routine
- a selected rash pattern or scored non-red-flag concern maps to `Photo + Review`
- explicit red-flag options alone map to same-day or emergency urgency

Wood's lamp is report state, not urgency state. `#woodLampFinding` records whether it was performed and the observed fluorescence. `getReportRoute` reads that value rather than the active tab. Merely opening or leaving `UVTab` must not change the report route.

## Route Tab Pattern

The route strip is a compact tab system, not a button toolbar:

- `.button-row` uses `role="tablist"`
- `.tab-btn` uses `role="tab"`, `aria-selected`, `aria-controls` and roving `tabindex`
- tab content sections use `role="tabpanel"`
- `openTab` updates selected state, hidden panels, reference image, user image and capture relevance
- Left, Right, Home and End keys move between route tabs
- Visual styling uses a shared tab rail, quiet inactive tabs and a raised active tab; keep the strip compact and avoid extra decorative bars inside the active tab.

## Report Pop-Out Pattern

The report modal follows the Fundal Reflex pop-out/resource pattern:

- compact title row with close control
- formatted preview plus hidden plain-text textarea for copy/share
- blue-grey resource buttons for `Copy note` and `Share note + photos`
- status line under the actions

Share attaches uploaded area/limb, close-up and dermoscopy files where supported by the browser.

The PWA service worker pre-caches the complete static app and reference set. It ignores cross-origin clinical-source links and non-GET requests, uses a navigation network-first fallback and serves versioned same-origin assets cache-first. Patient photos use `blob:` URLs and are never placed in the offline cache.

Report photo expectations depend on recorded assessment content. Lesion findings expect area/limb, close-up and dermoscopy. Rash and Wood's lamp routes expect area/limb and close-up.

## UI Pattern

Follow the Fundal Reflex look:

- black app bar
- purple title and key action accents
- white/off-white panels
- blue-grey borders
- dark image stage
- compact row controls
- low-key helper icons
- soft shadows
- deliberate radius hierarchy

All major changes should be checked at `360 x 740`.

## Photo file and cache isolation — 26 July 2026

- `photo-file-store.js` is the single owner of the three capture `File` objects and their object URLs.
- Replacing a capture revokes the previous URL before storing the new original file.
- A new assessment clears the store and revokes every remaining capture URL.
- `service-worker.js` may delete only obsolete cache names beginning with `allan-`.
- Keep `photo-file-store.js` ahead of `script.js` in the deferred script order and in the precache list.

## Short-screen document-fit pattern — 26 July 2026

At the configured `360 x 740` viewport, every main route must keep the document height at or below `window.innerHeight`. Measure Lesion, Dermoscopy, Rash and Wood's separately because their content heights differ. Deliberately scrollable drawers and modals are checked as components rather than treated as document overflow. Do not conceal a failed fit with `overflow: hidden`; adjust measured outer spacing without removing content.

## MCQ quality pattern — 26 July 2026

- Every question has a stable app-scoped ID, one answer, four distinct options, an explanation, a source label and an explicit review status.
- Attempt sampling may shuffle questions and options but IDs remain stable.
- Submission is blocked until every item is answered and focus moves to the first omission.
- Marking reveals correct and selected-wrong states plus source-labelled rationale.
- The result and actions stay outside the scrolling question area.
- Retry replaces the attempt with fresh unanswered sampled questions while preserving earned progress.
