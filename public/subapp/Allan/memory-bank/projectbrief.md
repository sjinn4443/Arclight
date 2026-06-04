# Project Brief

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

## Purpose

Build a mobile-first dermatology teaching and referral-aide app called Allan. The app helps a GP or learner capture a useful image set, compare the current case with reference images and apply simple visual criteria.

The app is not a diagnostic device. It supports clinical pattern recognition and referral urgency.

## Goals

- [x] Match the Fundal Reflex visual language.
- [x] Fit the main workflow into `360 x 740`.
- [x] Support three image captures: Location, Close and Dermoscopy.
- [x] Let users compare reference and user images side by side.
- [x] Add tabbed criteria for Lesion, Dermoscopy, Rash and Wood's lamp.
- [x] Add light/dark skin type context for reference images and wording.
- [x] Add rash pattern references for raised bumps, blisters or pustules, flat patches, eczema/dermatitis and psoriasis plaques.
- [x] Add low-key help pop-ups for all criteria.
- [x] Add a custom location picker with icons beside site options.
- [x] Replace the user-image clinical placeholder with a muted empty camera state.
- [x] Add report modal with copy and share support.
- [x] Add MCQ banks with progression and cup unlock.
- [x] Add expanded teaching overlays for Lesion and Dermoscopy.

## Deliverables

- Static browser app in `index.html`, `styles.css`, `script.js` and `mcq-bank.js`.
- Reference image assets for Lesion, Dermoscopy, Rash and Wood's lamp.
- Compact referral panel.
- Compact referral report pop-out.
- Quick guide popup dated `v1 - 18/5/2026`.
- Memory bank and README documentation for future continuity.

## Success Criteria

- The first screen is usable at `360 x 740`.
- The reference and user image boxes are consistent across tabs.
- `Your image` is visually empty until a real image is loaded.
- The selected tab clearly indicates which captured image should be used.
- Skin type context updates relevant reference images and rash colour wording.
- Help text is plain, clinical, GP-level and in British English.
- The app avoids Oxford commas in visible general text.
- Location options show small icons without making the picker too wide.
- Expanded teaching overlays do not obscure important image details unnecessarily.
- Cleared findings return the referral panel to `Not assessed yet`.
- No console errors during in-app browser review.

## Current Risks

- The report modal is a concise referral summary, not a full clinical document generator.
- The first capture is internally still named `limb` in code for compatibility, while the UI now says `Location`.
- Font Awesome icons are a pragmatic fit, but some anatomy icons are approximate rather than bespoke diagrams.
- Dermoscopy uses Chaos + Clues but still depends on a single reference image, so callout placement should be reviewed conservatively if the dermoscopy reference image changes.
