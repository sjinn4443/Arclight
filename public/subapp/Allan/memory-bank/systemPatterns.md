# System Patterns

<!-- APP-DOC-STATUS:START -->

## Current Memory Status (18/5/2026)

- Static packaging: open `index.html` directly; a local HTTP server is optional for testing.
- Mobile target: `360 x 740`, with the main page kept free of required vertical scrolling.
- Shared appbar: `54px` high; `Quicksand` `25px`/`700` title; `44 x 44` burger and info buttons set `12px` from the edges.
- Burger glyph: shared CSS three-bar mark, `18px` wide with `2px` strokes, so no app depends on a bold font glyph.
- Shared side menu: left drawer under the appbar; `min(76vw, 284px)` width; `16px` padding; pale `#f8fbff` surface; blue-grey border; card-style actions with small level dots.
- Appbar content colour: purple `#a855f7` on a black appbar.
- Favicon: current black-square app favicon with the app letter or letters centred.
<!-- APP-DOC-STATUS:END -->

_Last updated: 18/5/2026_

## Structure

The app is intentionally simple:

- `index.html` for static markup
- `styles.css` for all styling
- `script.js` for app logic
- `mcq-bank.js` for MCQ question banks
- image assets in the root folder

No build step is used.

## Image State Pattern

Reference image:

- chosen by active tab
- may be chosen by skin type
- the rash tab also depends on the Pattern dropdown
- uses `setImageWithFallback`

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
- final urgency is the highest urgency across ABCDE-SU, dermoscopy and rash triage

Wood's lamp does not affect referral urgency.

Fresh load and fully cleared criteria show `Not assessed yet`. ABCDE-SU and dermoscopy are separate skin cancer checks; the final urgency uses the highest urgency rather than adding their totals.

The internal Dermoscopy IDs still use `BVPDSTab` and `bvpds` for stability, but visible copy uses a Chaos + Clues teaching compression with chaos, four clue rows and a separate exception row. Chaos, clues and exception are visually grouped to show sequence without making them look unrelated. The final clue row is labelled `Vessels / nail` because palm/sole ridge pigment sits in the exception row. The clue rows are disabled until chaos is selected and unticking chaos clears them. Dermoscopy logic is sequence-based: chaos plus any clue, or an exception, maps to Susp cancer pathway (2 week wait). ABCDE-SU score 1-2 maps to Safety-net review so low-level lesion concern does not look faster than the 2 week wait pathway. `DPIC-R` remains an internal rash teaching prompt.

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

## UI Pattern

Follow the Fundal Reflex look:

- black app bar
- red title and key action accents
- white/off-white panels
- blue-grey borders
- dark image stage
- compact row controls
- low-key helper icons
- soft shadows
- deliberate radius hierarchy

All major changes should be checked at `360 x 740`.
