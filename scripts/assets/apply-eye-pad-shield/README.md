# Apply Eye Pad / Shield artwork

`patient-source.svg` retains the original Front of Eye PDF path geometry.
`source.json` records the source file hash, page and MuPDF SVG paint-node IDs.
The original scene clips this figure and hides part of its hair behind the
examiner's hand; the PDF paths contain the complete head and shirt. Ancestor
transforms have been flattened, and scene clips have been removed.

The asset builder separates the same paths into the base, two eyes, closing
lid and foreground nose/skin. Its derivative WebPs are delivery assets that
retain the original artwork.
Source gauze, tape, cotton, scissors and cone come from Make Eye Pad / Shield;
the explaining examiner and the seated body come from the Cataract history scene.
The original Front of Eye head and neck meet the seated figure at the collar.
The chair, trousers, shirt and resting fingers come from the original PDF paths
in `seated-body.svg`. The path IDs refer to the Cataract_Edit5 history patient
selected by `extract-cataract-art.py`. The fills use the Front of Eye palette. Their hashes and material changes
are recorded in the delivery `provenance.json`.

Rebuild with `node scripts/build-apply-eye-pad-shield-scroll.cjs`. No preview
files, external image-generator output or private user paths are dependencies.
If the source PDF changes, re-extract the named paths with the existing PyMuPDF
authoring environment, inspect the complete figure and update the source hash.
Do not silently accept a different PDF while retaining stale extracted paths.

The linked Apply video supplies the clinical placement and round-pad references.
The builder uses the source's oblique, left-pointing cone reusing `12cone.webp` without stretching to cover the
entire pad. `scripts/lib/eye-pad-shield-ribbon.cjs` wraps actual paper pixels over
the gauze/face/cone surfaces, with contact shadows and pinked cut ends. Skin
cleaning deliberately contains no hand. The tensioned roll feed is cut only
when both original scissor blades overlap the contact point.

Cutting now reuses complete equipment-scissor halves rather than removing hands
from partial tool images. The rotating paper face is projected inside a fixed
reel barrel/axle. Single-patient layers share one camera parent so all original
eye, nose, pad and tape contact coordinates stay registered.
