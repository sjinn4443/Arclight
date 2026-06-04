# Dermatology

<!-- APP-DOC-STATUS:START -->

## Current Status (18/5/2026)

- Static packaging: open `index.html` directly; a local HTTP server is optional for testing.
- Mobile target: `360 x 740`, with the main page kept free of required vertical scrolling.
- Shared appbar: `54px` high; `Quicksand` `25px`/`700` title; `44 x 44` burger and info buttons set `12px` from the edges.
- Burger glyph: shared CSS three-bar mark, `18px` wide with `2px` strokes, so no app depends on a bold font glyph.
- Shared side menu: left drawer under the appbar; `min(76vw, 284px)` width; `16px` padding; pale `#f8fbff` surface; blue-grey border; card-style actions with small level dots.
- Appbar content colour: purple `#a855f7` on a black appbar.
- Favicon: current black-square app favicon with the app letter or letters centred.
<!-- APP-DOC-STATUS:END -->

Mobile-first dermatology teaching and referral-aide app for Arclight image capture, visual comparison and structured rash or lesion triage.

The working review size is `360 x 740`. The app is a static browser page and is currently reviewed through the Codex in-app browser at a local static-server URL.

## Purpose

Dermatology helps a GP or learner collect a useful image set and compare the current case with compact illustrative reference images. These are AI-generated teaching images rather than real patient photographs. It supports clinical pattern recognition and referral urgency. It is not a final diagnosis tool.

## Core Workflow

1. Capture or upload the image set:
   - `Location`: wider anatomical context image
   - `Close`: close-up clinical image
   - `Dermoscopy`: dermoscopy image
2. Choose context:
   - anatomical location
   - skin type context: `Light` or `Dark`
3. Choose the relevant tab:
   - `Lesion`
   - `Dermoscopy`
   - `Rash`
   - `Wood's lamp`
4. Compare the left illustrative reference image with the right user image.
5. Tick or select the closest findings.
6. Use the referral panel as a rough guide.

## Current Feature Set

- Fundal Reflex style app shell:
  - black app bar
  - purple centred `Dermatology` title
  - left burger menu
  - right quick guide icon
  - compact white panels over a soft page background
- Top capture row:
  - `Location`
  - `Close`
  - `Dermoscopy`
  - active capture source highlighted by the selected tab
- Quick guide includes photo expectations:
  - `Area/limb`: site plus nearby skin
  - `Close-up`: fill frame and keep in focus
  - `Dermoscopy`: glare-free detail
- Context row:
  - custom location picker with small icons beside each site option
  - hidden native `#lesionLocation` select kept in sync
  - skin type toggle with explicit `Skin type` caption and `Light` / `Dark` label
- Tab order:
  - `Lesion`
  - `Dermoscopy`
  - `Rash`
  - `Wood's lamp`
  - subtle route divider between the skin cancer pair and rash/Wood's lamp pair
  - route controls use real tab semantics and arrow-key navigation
  - visual treatment uses a shared tab rail with flatter inactive tabs and a raised active tab
- Side menu:
  - `Photo capture`
  - `Illustrative refs`
  - `Primary MCQ`
  - `Intermediate MCQ`
  - `Advanced MCQ`
  - `Report`
  - compact Dermoscopy examples under `Illustrative refs`; tapping one switches to Dermoscopy and swaps the illustrative ref
  - MCQ modal uses the Fundal Reflex level-button look, compact question cards and pass/fail feedback
  - MCQ banks: Primary `15`, Intermediate `18`, Advanced `20`
  - Swollen Discs style level awards: passing a level adds a star, unlocks the next MCQ level and completing Advanced unlocks the Dermatology cup with a local saveable certificate code
- Comparison stage:
  - fixed image stage size across tabs
  - left side shows the current illustrative reference image
  - right side shows the relevant uploaded image
  - right side uses a muted dark camera placeholder when empty
  - expand icon opens a persistent enlarged comparison with an `X` close control
  - expanded `Lesion` and `Dermoscopy` illustrative references have an optional `Teaching` toggle
  - teaching legends are clickable and reuse the same explanation pop-up pattern
- Illustrative reference image behaviour:
  - `Lesion` uses `assets/images/abcde-su_light.webp` or `assets/images/abcde-su_dark.webp`
  - `Dermoscopy` uses `assets/images/chaos_light.webp` or `assets/images/chaos_dark.webp`
  - Dermoscopy side-menu examples live in `dermoscopy-examples/chaos-clues-01_light.webp` through `chaos-clues-05_dark.webp`
  - `Rash` switches reference image by pattern and skin type
  - `Wood's lamp` uses `assets/images/uv-reference.webp` as a combined fluorescence reference
- User image behaviour:
  - `Lesion`: compares against `Close`
  - `Dermoscopy`: compares against `Dermoscopy`
  - `Rash`: compares against `Close`
  - `Wood's lamp`: compares against `Close`
- Low-key info buttons:
  - added beside lesion, dermoscopy, rash and Wood's lamp entries
  - plain GP-level explanations
  - British English clinical wording
  - pop-ups do not repeat the row title
  - tap away, Escape, tab change, scroll or resize closes them
- Referral panel:
  - compact `Referral` result with green / amber / orange / red dot
  - inline `Logic + sources` info button beside `Referral`
  - low-key `Report` button
  - Fundal Reflex style report pop-out with `Copy note` and `Share note + photos` actions
- report modal builds a compact mini referral note from current selections
  - untouched prompt sections show `not assessed` rather than a default score
  - share action attaches uploaded area/limb, close-up and dermoscopy photos where browser support allows
  - fresh load and fully cleared findings show `Not assessed yet`, not routine
- Rash red flag control:
  - same-day and emergency selections receive restrained red/orange styling
  - dropdown labels spell out the same-day and emergency triggers
  - Dermoscopy now uses Chaos + Clues rather than the old internal BVPDS teaching prompt
  - `DPIC-R` is documented as a dermatology teaching prompt, not a recognised formal score

## Clinical Content

### Lesion

ABCDE-SU checklist:

- Asymmetry
- Border irregular
- Colour variation
- Diameter `7 mm or more`
- Evolution/recent change
- Symptoms: itch, bleeding, oozing or crusting
- Ugly duckling sign

Current scoring:

- Asymmetry, border irregular, colour variation and evolution/recent change score `2`
- Diameter, symptoms and ugly duckling sign score `1`
- score `1-2` maps to `Safety-net review`
- score `3` or more maps to Susp cancer pathway (2 week wait) rather than emergency

Expanded teaching mode:

- image callouts mark visible image features only
- symptoms are listed as a separate clickable note because they are usually history or visible crusting, not a reliable marker on the image
- each legend item opens the relevant explanation pop-up

### Dermoscopy

Dermoscopy checklist using the Chaos + Clues route:

- Chaos: uneven colour or structure
- Colour
- Structure
- Edge growth
- Vessels / nail
- Exception

The visible checklist is a frontline teaching compression. Info pop-ups map the buckets back to the formal clues:

- Colour: grey, blue or white areas/lines, or black dots/clods at the lesion edge
- Structure: off-centre blank-looking area, thick dark network or thick branched lines
- Edge growth: one-sided streaks or pseudopods at the edge
- Vessels / nail: mixed vessel patterns or chaotic nail pigment
- Exception: changing pigmented lesion in an adult, pigmented nodule, grey on the head/neck or palm/sole ridge pigment

Current logic:

- chaos plus any clue maps to Susp cancer pathway (2 week wait)
- any exception maps to Susp cancer pathway (2 week wait)
- clue rows are greyed and cannot be ticked until chaos is selected
- unticking chaos clears the clue rows so stale dermoscopy scoring cannot remain
- chaos alone prompts the user to check dermoscopy clues before relying on the route
- clue recorded without chaos remains a defensive fallback in logic rather than the normal UI path

Expanded teaching mode:

- four image-visible Chaos + Clues callouts
- no outline oval in the Dermoscopy teaching overlay
- each legend item opens the relevant explanation pop-up
- main Dermoscopy bucket rows use inline expandable detail; only one row is intended to be open at a time

### Rash

Rash triage fields using the DPIC-R teaching prompt:

- Duration: `New or worsening` or `Long-standing or stable`
- Pattern: `Blisters or pustules`, `Raised bumps`, `Flat patches`, `Eczema / dermatitis-type` or `Psoriasis-type plaques`
- Itch: `Severe itch` or `Mild or none`
- Colour: `Redness or swelling` on light skin context or `Darkening, purple-grey change or swelling` on dark skin context
- Red flags: `None`, `Same-day concern` or `Emergency signs`

Current scoring:

- red flags override the rash score
- `Same-day concern` maps to `Same day`
- `Emergency signs` maps to `Emergency (now)`
- without red flags, score `0-1` is routine, `2-3` is soon and `4` or more is same day

Rash reference assets:

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

### Wood's lamp

Wood's lamp guide:

- Blue-green - `M. tinea capitis`
- Yellow-orange - `Pityriasis versicolor`
- Coral-red - `Erythrasma`
- Bright blue-white - `Vitiligo`
- Orange-red - `Acne porphyrins`
- White - head lice nits
- reference asset: `assets/images/uv-reference.webp`

## Run Locally

1. Open a terminal in this folder.
2. Start a static server:
   `python -m http.server 8877`
3. Open:
   `http://127.0.0.1:8877/index.html?v=20260517-20`

The query string is only for cache busting during review.

## Files

- `index.html`: app markup, quick guide, capture row, location picker, tabs, MCQ modal and info pop-up shell
- `styles.css`: app-shell styling, responsive compact layout, comparison stage, teaching overlays, full-screen teaching card, location picker, empty image state, MCQ modal, report pop-out and pop-ups
- `script.js`: reference switching, image capture handling, teaching overlay toggles, full-screen teaching card handling, referral logic, location picker, MCQ UI, info pop-ups, report sharing and app shell events
- `mcq-bank.js`: MCQ question banks loaded before the main script
- `abcde-su_*.webp`: ABCDE-SU reference images
- `abcde-su-card_*.webp`: full-screen ABCDE-SU teaching card images shown from the side menu
- `variations/abcde-su-variation-*_*.webp`: flick-through Lesion reference variations
- `chaos_*.webp`: Dermoscopy Chaos + Clues reference images
- `chaos-card_*.webp`: full-screen Chaos + Clues teaching card images shown from the side menu
- `dpic-r_*.webp`: rash pattern reference images
- `memory-bank/*.md`: continuity notes

## Quick Checks

- Syntax:
  - `node --check mcq-bank.js`
  - `node --check script.js`
- Browser review:
  - use the Codex in-app browser
  - target `360 x 740`
  - verify no console errors
  - verify the page still fits after changing text or image sizes

## Design Rules

- Use British English in visible text.
- Avoid Oxford commas.
- Keep GP-level wording: plain, practical and clinical.
- Do not make the tool feel like a landing page.
- Keep controls compact, muted and touch-friendly.
- Preserve the Fundal Reflex look:
  - black app bar with purple title and icons
  - soft white panels
  - dark clinical image stage
  - restrained blue-grey borders
  - low-key info icons
- Illustrative reference images should be visually useful, not decorative.
- Missing user image should show an empty state, not a clinical placeholder.
- Clinical copy should use caution words such as `can support`, `may` and `not a stand-alone diagnosis` where appropriate.
