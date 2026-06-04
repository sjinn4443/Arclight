# Product Context

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

## User

Primary user is a GP, learner or Arclight user who needs a compact dermatology aid on a phone-sized screen.

The app should support quick clinical thinking rather than specialist-level teaching. It should not encourage overconfidence or imply a final diagnosis.

## Core Mental Model

The user collects three images:

- `Location`: wider anatomical context
- `Close`: close-up clinical image
- `Dermoscopy`: dermoscopy view where available

The app then shows:

- an illustrative reference image on the left
- the user's relevant image on the right
- the criteria checklist or dropdowns below
- referral urgency at the bottom

The illustrative reference image is an AI-generated aide-memoire, not a real patient photograph. The user still makes the clinical judgement.

Expanded illustrative reference images can show optional teaching overlays for the skin cancer route. Teaching overlays are visual aids only and must not make the app feel diagnostic.

The side menu can carry additional illustrative examples for learning. These are teaching variants, not extra scoring routes.

## Tab Intent

### Lesion

Uses the close-up image. Supports ABCDE-SU lesion risk assessment using visible clinical signs:

- asymmetry
- border irregular
- colour
- diameter
- evolution/recent change
- symptoms
- ugly duckling sign

Expanded teaching mode marks visible callouts for the image-based signs. Symptoms stay as a separate note because itch, bleeding, oozing or crusting is often history rather than a visible feature in the reference image.

ABCDE-SU score 1-2 maps to `Safety-net review`; score 3 or more maps to `Susp cancer pathway (2 week wait)`.

### Dermoscopy

Uses the dermoscopy image. Supports Chaos + Clues for pigmented lesion dermoscopy:

- chaos: uneven colour or structure
- colour
- structure
- edge growth
- vessels / nail
- exception

This is a frontline teaching compression of the formal Chaos and Clues algorithm. Info pop-ups map the buckets back to the full clue set. Logic is sequence-based rather than additive: chaos plus any clue, or an exception, maps to Susp cancer pathway (2 week wait). The clue rows are disabled until chaos is selected and unticking chaos clears any clue ticks. Chaos alone prompts dermoscopy clue review. Palm/sole ridge pigment is in the exception row because the source algorithm lists parallel ridge pattern as an exception even without chaos. Expanded teaching mode marks four image-visible dermoscopy callouts and keeps vessels/nail and exception as written checks to avoid crowding the reference image.

### Rash

Uses the close-up image. Supports rash triage. The internal DPIC-R mnemonic is an Allan teaching prompt, not a recognised formal score:

- duration
- pattern
- itch
- colour or swelling
- red flags

Reference image changes with the Pattern dropdown and Skin type switch.

### Wood's lamp

Uses the close-up image. Supports Wood's lamp fluorescence memory:

- blue-green for Microsporum tinea capitis
- yellow-orange for Pityriasis versicolor
- coral-red for Erythrasma
- bright blue-white for Vitiligo
- orange-red for acne porphyrins
- white for head lice nits

Wood's lamp remains a reference grid. It should not get a local teaching overlay because the learning point is colour recognition rather than a lesion feature.

## Tone

- British English.
- Plain clinical wording for a GP-level user.
- No Oxford commas.
- Avoid specialist jargon unless the row label itself is the clinical term.
- Use caution: `can support`, `may`, `fits the clinical picture` and `not a stand-alone diagnosis`.

## UI Expectations

- Dense but calm.
- The app should feel like a clinical instrument.
- Do not add explanatory text unless the user asks for it through an info icon.
- Keep iconography quiet.
- Prefer the image comparison stage as the main focus.
- Keep the normal reference image clean; teaching belongs in the expanded view.
- Avoid adding more top-level tabs unless the workflow genuinely needs them.
