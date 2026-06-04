# Fundal Reflex Universal Handout Notes

<!-- APP-DOC-STATUS:START -->

## Current Memory Status (18/5/2026)

- Static packaging: open `index.html` directly; a local HTTP server is optional for testing.
- Mobile target: `360 x 740`, with the main page kept free of required vertical scrolling.
- Shared appbar: `54px` high; `Quicksand` `25px`/`700` title; `44 x 44` burger and info buttons set `12px` from the edges.
- Burger glyph: shared CSS three-bar mark, `18px` wide with `2px` strokes, so no app depends on a bold font glyph.
- Shared side menu: left drawer under the appbar; `min(76vw, 284px)` width; `16px` padding; pale `#f8fbff` surface; blue-grey border; card-style actions with small level dots.
- Appbar content colour: red `#f03b2f` on a black appbar.
- Favicon: current black-square app favicon with the app letter or letters centred.
<!-- APP-DOC-STATUS:END -->

Source: `C:\Users\William\Downloads\Fundal Reflex_Universal Handout.pdf`

Date reviewed: 30 April 2026

## Alan25 Fundal Reflex Reference

Use this as the concise-depth standard for app copy and future handout explanation:

- Fundal reflex means pupil glow from the fundus seen at arm's length with Arclight.
- Prefer `fundal reflex` over `red reflex` because the reflex is not always red and varies with pigmentation and optics.
- A clear reflex suggests, but does not confirm, that the back of the eye is visible.
- Null, milky or black means the back is likely unseen.
- Technique sequence: dim lighting, calm patient, baby fed or swaddled, then arm's-length comparison.
- Compare both eyes for equal brightness, colour and shape.
- Move side to side, then closer.
- In those with darker pigmentation, a normal reflex may look orange-yellow or blue-white; bright, equal and round is reassuring.
- Blue or light-blue reflexes still need checking for clarity and vision.
- Closer examination may reveal scar, cataract or haemorrhage.
- In children, white pupil, squint, big or bulging red painful eye, vessels or folds in the pupil and a suspect pink/yellow reflex are urgent.

## Critical review summary

The first pass was broadly aligned with the handout, but several points were too certain. The PDF is almost entirely visual, so the notes should distinguish three things:

- directly shown by the pictures
- reasonable inference from the pictures
- background or app-design suggestion not explicitly shown

Main corrections made here:

- The phone panel suggests a phone-assisted workflow, but the handout does not prove whether this means recording, sharing, teleconsultation or attachment guidance.
- The crossed-out icons on the Arclight panel probably warn against the wrong light or phone/torch use, but the exact intended meaning needs confirmation.
- "Why this works" is clinical rationale added for app design, not content shown by the handout.
- Possible findings should be read as action categories rather than firm diagnoses.

## Overall read

Single-page, mostly word-free universal handout. It is structured as a practical screening flow rather than a diagnostic teaching sheet:

1. Preparation
2. Examination
3. Unclear findings
4. Possible findings

The design uses a traffic-light visual language:

- Green tick: correct technique or reassuring finding
- Orange question mark: uncertain or needs another look
- Red exclamation or red cross: wrong technique or abnormal finding needing escalation

The main teaching point appears to be comparison. The examiner is not being asked to name detailed pathology. They are being taught to get a good reflex view, compare both eyes together and act on asymmetry, dullness, whiteness, darkness or possible misalignment.

## 1. Preparation

What the PDF directly shows:

- Switch the Arclight on and use the correct illuminated viewing mode.
- The examiner's eye, device and patient should be aligned. The device should be close to the examiner's eye.
- Avoid holding the device away from the examiner's viewing axis.
- Position babies securely with a carer.
- Avoid examining a baby in an unstable or poor position.
- Older children can sit on a carer's lap, sit nearby or stand with support.
- The child should be calm enough to look towards the examiner.

Reasonable inference:

- The crossed-out icons on the Arclight panel likely mean not to use the wrong light source, wrong mode or phone/torch illumination as a substitute. The exact meaning is not certain from the picture alone.
- Poor alignment, poor distance, poor patient position or the wrong light may create a poor view.

Interpretation for our app:

- Preparation is about making the reflex visible before judging it.
- The handout uses adults, children and babies to make clear that the same principle applies across age groups.

## 2. Examination

What the PDF directly shows:

- Shine/view from in front and compare both eyes at the same time.
- The reassuring example shows visible, broadly similar reflexes in both eyes.
- Avoid examining when the child is looking away, looking down or not attending.
- For babies, open the eyelid gently if needed.
- Avoid eyelid handling that blocks the pupil, distorts the eye or spoils the reflex view.
- A sleeping or settled baby may still be examined if the eyelid can be opened gently and the view is good.
- Normal reflex colour varies with pigmentation and eye colour. The examples show darker, mid-tone and lighter appearances.

Interpretation:

- The handout emphasises simultaneous bilateral comparison more than single-eye inspection.
- The examiner should not overcall colour alone. Brightness, symmetry, shape, position and whether the reflex is visible matter.
- There is an implicit "good view first, judgement second" sequence.

## 3. Unclear Findings

What the PDF directly shows:

- If the first view is unclear, adjust technique and repeat.
- Re-check with a better view before deciding.
- Ask another trained person to look if uncertain.
- A phone-assisted workflow is shown.
- The Arclight-phone illustrations show the device used with a phone, probably for imaging or support.

Interpretation:

- "Unclear" is treated as its own outcome, not as normal.
- The correct response to uncertainty is not to ignore it. Improve the view, repeat or ask for help.
- This is useful for app design: uncertain cases should have a clear next action rather than being a weak pass.

## 4. Possible Findings

What the PDF directly shows:

- Symmetrical bright reflexes in both eyes are marked reassuring.
- Some colour difference or weaker orange reflex is marked uncertain rather than immediately abnormal.
- A visibly asymmetric or eccentric reflex with a child-face concern icon is marked abnormal.
- A pale, white, grey, dull or absent reflex in one eye is marked abnormal.
- Both eyes looking dull, grey or poorly reflective is marked abnormal.
- Strong asymmetry between eyes is marked abnormal.

Interpretation:

- The handout collapses possible findings into action categories: reassuring, uncertain or red flag.
- Red flag examples visually include leukocoria-like whiteness, absent or very dark reflex, dull grey reflex, marked asymmetry and possible alignment abnormality.
- Orange examples appear to mean repeat, check again or seek advice rather than "normal".

## Why This Works

This section is background rationale for app design. It is not directly stated in the PDF.

- A normal fundal or red reflex means light can travel through the cornea, lens, vitreous and retina and return to the examiner.
- Bilateral symmetry is the key shortcut for non-specialists.
- Asymmetry, whiteness, darkness, dullness or displacement can indicate media opacity, serious retinal disease, strabismus, significant refractive asymmetry or another problem needing assessment.
- The handout avoids pathology names. Its visual message is whether to pass, repeat, ask for help or refer.

## Design Lessons For The App

- Keep the beginner mental model simple: match, bright and straight.
- Treat "unclear" as an active state with repeat, adjust and ask-for-help actions.
- Show normal variation so users do not confuse iris or skin pigmentation with disease.
- Teach pigmentation as colour context, not as a pass for one dark or reduced reflex.
- Teach the technique before the findings.
- Prefer side-by-side eyes, not isolated single-eye examples.
- Use strong visual coding for referral urgency but reserve red for genuinely abnormal or wrong-technique states.

## Condensed App Priorities

After checking the current app against the handout, the most important lessons can be reduced to four.

1. **Good view first**

   The handout spends a lot of visual effort on light, alignment, child position and eyelid handling. The app should make bad technique and bad view feel distinct from abnormal reflex. Users should learn: adjust, repeat, then judge.

2. **Compare both eyes**

   The central clinical shortcut is bilateral comparison. Keep both eyes visible and make `Match`, `Bright` and `Straight` the beginner layer. Detailed case names should remain secondary.

3. **Three outcomes only at beginner level**

   For Primary mode, the action model should be:
   - reassuring
   - ? repeat, review or ask for help
   - ! refer

   This is stronger than teaching a long diagnostic list too early.

4. **Normal variation must be obvious**

   Show orange-red and blue-grey reflexes as normal when they are symmetrical, bright and clearly seen, across different skin tones. Do not teach a dull, absent, grey, black or one-sided dark/reduced reflex as normal.

Current app fit:

- Already strong: both eyes visible, Primary `Match / Bright / Straight`, compact referral panel and normal colour cases.
- Main opportunity: bring "good view first" further into the primary experience. At present the app is excellent at comparing findings, but less explicit about technique errors before interpretation.
- Avoid using green, orange and red as the beginner action language because those colours already carry Primary, Intermediate and Advanced tier meaning. Use `?` and `!` for action instead.
- Implemented two poor-view Primary practice cases: child looking away and upper lids partly covering the pupils. Dropped lower-lid blocking and light off centre because they did not render clearly enough and risked confusing the teaching point. Both technique cases use `? Action: Repeat view / ask for help`, not pathology framing. Their thumbnails are centred and the upper-lid case deliberately covers more of the pupil so the problem is visible.

## Open Ambiguities To Resolve Before Reusing

- Confirm the exact Arclight setting shown in preparation.
- Confirm whether the crossed-out icons mean no phone torch, no camera flash, no unsuitable mode or a combination.
- Confirm whether the orange possible-finding example is intended as normal variation, repeat-needed asymmetry or a specific "ask advice" category.
- Confirm whether phone support means local recording, teleconsultation, app upload or simply using the phone as an aligned viewing aid.
