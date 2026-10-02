# Refract flowchart layout contract

Approved visual pattern: 30 September 2026. This records the user's acceptance of the presentation, not clinical approval of the prescribing rules.

## Source and scope

- Maintain one integrated, fully editable `Refract-integrated-flowchart.drawio` chart. Do not split it into linked charts or replace it with a flat image.
- Preserve the approved clinical logic unless a separate request authorises a logic change. Layout changes must retain every decision, branch label and destination.
- The draw.io browser URL contains a snapshot. Updating the local file does not automatically update an already-open browser diagram or the prescribing engine. Reload the revised snapshot deliberately and verify it.
- Inspect the current file before editing. The Python routing tools record earlier migrations, not a safe rebuild pipeline. Some recreate discarded designs or are not idempotent.
- The current weighted chart is built by `tools/build-weighted-flowchart.mjs` from the production parameters and catalogue with explicit route geometry. Run its self-tests, regenerate and inspect the actual draw.io rendering before promotion. Back up the main chart before `--promote`, which does not make its own backup.

## Visual rules

- White background, no grid and editor sidebars hidden on opening. Retain the clean-view parameters `ui=min&dark=0&format=0&sidebar=0&windows=0` when opening the diagram.
- Use traditional decision diamonds, action rectangles and rounded start/end shapes. Keep the existing amber decisions, blue actions, red review flags and green result distinction.
- No lettered circles or continuation jumps: not A, B or any other label. Every logical connection must be a continuous arrow.
- Use straight horizontal/vertical segments with deliberate right-angle bends and subtly rounded elbows. The presentation baseline uses a 6-unit SVG corner radius and draw.io `rounded=1;arcSize=12`. Keep the lanes orthogonal and Yes/No runs straight; do not substitute wavy curves, diagonal shortcuts, tiny jogs or unnecessary bends.
- Give long bypasses separate outside lanes. Nest them in source order so earlier paths pass outside later paths without crossing.
- Give incoming paths distinct, adequately spaced destination ports. Never stack lines on the same segment or crowd several arrows into one point. Leave a clear routing band above result boxes.
- Route around every box and diamond, never through them. Keep Yes/No and Correct labels away from lines, bends and arrowheads. Do not use label backgrounds to conceal routing defects.
- Leave sufficient room for the Correct return path. Short side branches must also have separate destination ports, not overlap the main downward path.
- Preserve strong outlines and visible arrowheads. The accepted baseline uses 2.5-unit shape outlines, 2-unit connectors and filled block arrowheads with endSize 14. Judge the rendered result, not just these numbers.
- Keep wording concise without losing conditions, thresholds or exceptions. Use bold for the main action/decision and italics only for secondary review qualifiers. Use British English and no Oxford commas.
- Keep numerical weights visible on the chart itself, prominently beside the opening decisions, not only in a workbook or buried in later formulas. Generate values from the production parameters. Distinguish patient modifiers, precision resistance, measurement confidence and dioptre increments, showing each formula's scope. Keep this reference panel clear of every route. Do not imply that all weights belong to one sum or that authored coefficients have clinical validation.

## Mandatory verification before hand-off

1. Compare node and edge semantics before and after editing. Confirm all endpoints exist and no branch or condition was lost.
2. Open the exact revised file in draw.io and inspect the whole chart for overall organisation.
3. Zoom to readable detail and pan through the entire chart. An overview at 10–20% is not proof of clean routing. Inspect every entry, exit, return, bend and Yes/No label, especially both result-box junctions.
4. Check for shared/overlaid segments, crossings, arrows through shapes, cramped labels, stray stubs and text clipping. Correct and inspect again.
5. Confirm no lettered continuation circles, hidden sidebars and white grid-free background. Keep the final editable diagram open, not an older snapshot.
6. Report what was actually verified. XML validity or endpoint checks do not establish visual quality. Visual approval does not establish clinical correctness or automatic synchronisation.

## Lesson from the rejected versions

Replacing long lines with unexplained circles made the chart harder to follow. Replacing circles with routes that shared a final segment merely moved the clutter. Moving shapes after calculating waypoints introduced diagonal lines. The successful pattern uses continuous, separated paths and separate landing points, followed by close visual inspection. Never claim a routing fix from a zoomed-out view alone.
