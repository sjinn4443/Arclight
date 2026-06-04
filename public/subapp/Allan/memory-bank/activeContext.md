# Active Context

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

## Current State

Allan is a static app in:

`C:\Users\William\Desktop\Arclight App\Allan`

Current cache-busted review URL:

`http://127.0.0.1:8877/index.html?v=20260517-20`

The app has been iterated in the Codex in-app browser, not Chrome.

## Latest UI Decisions

- First capture button now reads `Location`, not `Limb`.
- The underlying variable and input path still use `limb` naming to avoid unnecessary code churn.
- Location picker is custom rather than a native dropdown so each option can have an icon.
- The repeated `Location` label in the context row was removed; the capture button already provides that wording.
- Pin icon beside the old Location label was rejected and removed.
- The location picker menu was narrowed to `156px`.
- `Your image` uses a dark muted camera empty state until a user image is present.
- Expand controls are hidden for empty user-image state.
- Illustrative reference and user images use a tap expand button that opens a persistent enlarged comparison with an `X` close control.
- Main comparison-stage labels are visually hidden to save vertical space; expanded image comparison labels the AI-generated side as `Illustrative ref` and the user's side as `Your image`.
- Visible route tabs now avoid non-standard acronyms where possible: `ABCDE-SU` is shown as `Lesion` and `DPIC-R` is shown as `Rash`.
- Route controls are now a real compact tab strip with `role="tablist"`, `role="tab"`, `role="tabpanel"`, selected state and arrow-key navigation.
- The route strip uses a shared tab rail, flatter inactive tabs and a raised active tab so it reads less like four action buttons.
- The small top accent bar was removed from the active route tab; the tab shape and border now carry the selected state.
- The skin type switch uses the original compact width. The site picker is capped narrower so the context row has more breathing space around the skin-type control.
- The shell remains phone-first but can widen to `520px` on larger screens, with slightly larger comparison images at that breakpoint.
- Location picker menu icons are slightly larger than the closed-picker icon for easier scanning. The menu is tall enough for the current options without normal scrolling.
- Arm and Foot use custom CSS icons so Arm reads as an elbow and Foot reads as a single foot rather than generic Font Awesome fallbacks.
- Expanded `Lesion` and `Dermoscopy` references have an optional `Teaching` toggle.
- The Lesion reference has a small previous/next carousel with arrows only. It cycles through the base image and five paired light/dark variation images without randomising on load.
- ABCDE-SU teaching mode has visible image callouts for image-visible features and a separate symptoms note because symptoms are usually history.
- Dermoscopy now uses a Chaos + Clues teaching compression: chaos, four clue rows and a separate exception row.
- Dermoscopy grouping is visually separated by blue Chaos, teal Clues and red Exception fills without extra left accent bars on the rows.
- Dermoscopy teaching mode keeps four image-visible callouts and leaves vessel / special site and exception as written checks so the reference image does not get crowded.
- Lesion, Rash and Wood's lamp row explanations now use the same inline chevron/dropdown pattern as Dermoscopy.
- Dermoscopy checklist rows use subtle colour accents instead of repeated mini section headings.
- The Dermoscopy reference now has the same small previous/next carousel as Lesion. It cycles through the base image and the five paired light/dark example images from `dermoscopy-examples/chaos-clues-01_light.webp` through `chaos-clues-05_dark.webp`.
- The side menu labels teaching cards by content: `ABCDE-SU card` and `Chaos + Clues card`. They open the paired light/dark card images full-screen and use the current skin type setting.
- Wood's lamp colour swatches are short fluorescent gradient rectangles matched to the composite reference image. `Bright blue-white` stays icy blue-white and the final `White` swatch is kept genuinely white.
- Wood's lamp includes a compact technique caveat about using a blacked out room and false fluorescence from products or lint.
- Wood's lamp rows use tighter spacing to reduce scrolling on a 350x740 layout.
- Dermoscopy bucket rows use chevron inline expanders instead of small `i` popovers; only one bucket detail should be open at a time.
- Expanded row details use short GP-facing clinical reminders and avoid repeated formal clue lists.
- Row detail copy avoids checkbox-style phrasing where the row already makes the action clear.
- The chaos detail explains half-to-half comparison of dermoscopy colour and internal pattern; an odd outline alone is not counted as chaos.
- Teaching legend items are clickable and reuse the shared explanation pop-up.
- Info icons are small, muted and low-key.
- Info pop-ups do not repeat the row title.
- Report opens a Fundal Reflex style pop-out with `Copy note` and `Share note + photos` actions.
- Report sharing attaches uploaded photos where browser support allows.
- Report route wording follows recorded findings rather than whichever tab is open when Report is pressed.
- Rash select fields are treated as assessed once the user changes them, even when the selected option scores zero.
- Fresh load and fully cleared criteria show `Not assessed yet`, not routine. Untouched report sections show `not assessed`, not a default prompt score.

## Current Clinical Copy Decisions

- `Blue-green - M. tinea capitis` is used as the compact Wood's lamp row label; the detail text still spells out Microsporum tinea capitis.
- `Yellow-orange - Pityriasis versicolor`, not yellow-green.
- ABCDE asymmetry includes shape or colour.
- ABCDE-SU visible checklist order now starts each item with the mnemonic where possible: `Border irregular` and `Evolution/recent change`.
- Border help wording uses uneven, blurred, notched or ragged.
- Dermoscopy uses the Chaos + Clues route: first look for chaos, then `If chaos: check clues` colour, structure, edge growth and vessels/nail, with a separate exception row that escalates even without chaos.
- The four clue rows are disabled and greyed until chaos is ticked; unticking chaos clears any clue ticks to avoid stale scoring.
- Palm/sole ridge pigment belongs in the exception row because the Rosendahl Chaos + Clues paper lists parallel ridge pattern as an exception even without chaos.
- Chaos plus any clue, or a dermoscopy exception, maps to `Susp cancer pathway (2 week wait)`.
- Rash red flags specify widespread or painful blistering.
- Rash duration says new or worsening rashes are more concerning than stable long-standing rashes.
- Cancer pathway wording is `Susp cancer pathway (2 week wait)`.
- ABCDE-SU score `1-2` now maps to `Safety-net review`, not `Soon (within a week)`, so the low-level skin cancer route does not look faster than the 2 week wait pathway.
- `DPIC-R` is an Allan teaching prompt, not a recognised formal score.
- ABCDE-SU and dermoscopy are separate skin cancer checks; the app uses highest urgency, not an added total.
- Wood's lamp is supportive for rash-route fluorescence clues and does not change urgency by itself.

## Current Assets

- `assets/images/abcde-su_light.webp`
- `assets/images/abcde-su_dark.webp`
- `assets/images/abcde-su-card_light.webp`
- `assets/images/abcde-su-card_dark.webp`
- `variations/abcde-su-variation-01_light.webp` through `variations/abcde-su-variation-05_dark.webp`
- `assets/images/chaos_light.webp`
- `assets/images/chaos_dark.webp`
- `assets/images/chaos-card_light.webp`
- `assets/images/chaos-card_dark.webp`
- `assets/images/dpic-r_raised-bumps_light.webp`
- `assets/images/dpic-r_raised-bumps_dark.webp`
- `assets/images/dpic-r_blisters-pustules_light.webp`
- `assets/images/dpic-r_blisters-pustules_dark.webp`
- `assets/images/dpic-r_flat-patches_light.webp`
- `assets/images/dpic-r_flat-patches_dark.webp`
- `assets/images/dpic-r_eczema-dermatitis_light.webp`
- `assets/images/dpic-r_eczema-dermatitis_dark.webp`
- `assets/images/dpic-r_psoriasis-plaques_light.webp`
- `assets/images/dpic-r_psoriasis-plaques_dark.webp`
- `assets/images/uv-reference.webp`

The old `celt` reference asset is no longer part of the active reference flow. It should not be used for the `Your image` empty state.

## Verification So Far

- `node --check script.js` passes after current changes.
- `node --check mcq-bank.js` passes after current changes.
- In-app browser checks confirmed:
  - empty user image state
  - location picker open and option select
  - info pop-ups across tabs
  - Rash pattern reference switching
  - skin type reference switching
  - report blank state and report generation
  - ABCDE-SU teaching overlay
  - dermoscopy teaching overlay
  - no console errors in recent checks

## Open Work

- Consider whether rash morphology images should ever get teaching overlays; avoid diagnostic overlays for red flags.
- Consider whether the Report button needs a quiet `Photos 0/3` readiness cue.
- Decide whether the custom location picker needs keyboard arrow navigation.
- Consider replacing approximate Font Awesome location icons with bespoke small anatomy icons later.
