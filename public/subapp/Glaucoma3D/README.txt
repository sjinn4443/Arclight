# Interactive glaucoma eye

Open Videos → Interactive Learning → Intermediate → Glaucoma 3D in Arclight. The host keeps the EYES top bar, menu and Back control above the viewer. Serve this folder over HTTP: the HTML loads the supplied GLB, retina PNGs and local vendor modules. No remote libraries are needed.

Updated viewer: 2026-10-20.

The 24-second sequence follows stages 1 → 2 → 3. Only the brightest central optic CUP changes shape. Its contours are traced from the three reference textures, then morphed continuously. After the first cup has enlarged, its registered surface detail hands over to the next original cup image. The surrounding retinal image, vessels and outer disc border remain fixed. This replaces the earlier broad radial enlargement. Geometry, iris textures, and the cutaway eye are taken from the user's eye.blend.

The viewer opens with a paused anatomy introduction. Eleven interactive parts cover the cornea, iris, pupil, lens, retina, optic nerve, optic disc, sclera, optic cup, neuroretinal rim and cup-to-disc ratio. The optic DISC is the entire pale circular region. The CUP is its brightest central region in these illustration images; the RIM lies between the cup and disc boundaries. Their selections are separate. Selecting Optic nerve highlights both the external nerve bundle and the central retinal cup.

The pupil outline follows 17 actual vertices on the inner iris lip. The disc and rim use a circular boundary, moved slightly to the right in the default view and enlarged to a 27-pixel radius in the retinal texture. Rim selection emphasizes a narrow peripheral band, enlarged by 6% relative to the disc display boundary, and completely excludes the cup. Model surface highlights use fully opaque cyan (#60e8ef) borders around their visible outlines and clipped region edges, while their interior fill remains translucent. The lens now has a separate geometric silhouette, including the exposed cut boundary, instead of relying on its surface tint. All normal anatomy borders use a shared 3.2-CSS-pixel width matching the original iris border at the default desktop view that stays consistent through zoom and mobile/desktop layouts. Clipped region strokes are drawn inside the selection; pupil, disc, cup and rim outlines use the same screen-width target. Disc-related selections include a cup/rim diagram and Stage 1/2/3 comparison buttons. On mobile the three buttons are stacked vertically to the right of the diagram. The cup-to-disc ratio entry explains vertical cup diameter divided by vertical disc diameter. Selecting it adds an I-shaped capped marker on the retinal surface between the cup and disc boundaries, and the ratio label points to the marker midpoint. In ratio mode only, cup and disc boundaries are highlighted in cyan at 55% opacity and a thinner 1.76-CSS-pixel width. The I marker is opaque and 5.28 CSS pixels thick, making it the main emphasis. The marker follows the reference stage and model rotation. The diagram is illustrative and does not report clinical measurements. Anatomy references are linked in the viewer.

At the start of progression, a panel to the right of center, Intermediate orange highlights, rings and arrows point to the nerve and central cup. The connecting lines have a dark backing for visibility over bright surfaces. Playback holds for 1.6 seconds to allow the viewer to locate them, then continues. Stage buttons and the active stage indicator are larger and more prominent.

Desktop text, controls and labels are larger. The desktop Optic nerve label has one shared stem branching halfway between the label and the midpoint of the posterior nerve bundle and central retinal cup anchors. Both branches and endpoint dots highlight together when selected and follow the current cup position, rotation and zoom. On phones, labels sit in a separate dock below the model. Selecting a label opens its description automatically; an Open/Close button lets the viewer collapse it. Each mobile connector bends once, one third of the way from the model back toward the label (two thirds from the label). Optic nerve selection draws one shared stem from the button to a midpoint, then branches to the posterior bundle and the cup on the retinal image. Leaders follow rotation and zoom, and hide when parts are hidden or playback starts. View and Settings buttons reveal secondary controls. The initial mobile screen hides the playback timeline until progression starts. All viewer text is in English.

The central nerve preserves its original yellow #edc78b with an unlit, non-tone-mapped material. UI accents remain Intermediate orange #f25600. The white outer sheaths retain their lower local lighting and compressed highlights. The globe and retina keep their existing lighting.

Controls:
- Drag to rotate; wheel or two-finger pinch to zoom.
- Right-drag or two-finger drag to pan.
- Rotation and zoom remain active during playback.
- Play/pause, speed, stage buttons, and the slider control the animation. Restart returns to the anatomy introduction.
- Anatomy returns to the labeled introduction; Show labels toggles callouts.
- Focus nerve moves closer to the optic nerve without pausing playback.
- The optional “Loop” setting runs 1 → 2 → 3 → 2 → 1 smoothly.
- “Reset view” restores the default view without restarting the animation.
- Focus the model and use arrow keys to orbit, +/− to zoom.
- The anatomy introduction always starts paused.
- On mobile, selecting a part opens its description. Tap Close/Open to collapse or reopen it, View for focus/reset/parts controls, and Settings for playback speed and looping.
- Keep the HTML, GLB, retina PNGs and vendor/ together. source/ contains editable authoring files and is excluded from deployment.

Development:
- source/viewer.js, source/styles.css and source/layout.html contain the editable viewer source.
- source/cup-landmarks.json contains 128-angle contours of the three reference cups and the aligned outer disc border. The four rows of the 128 × 4 contour texture store these four outlines and support WebGL 1 texture wrapping.
- Run `node source/build.cjs` to rebuild the app viewer from the editable sources.
- Run `node source/verify.mjs` for model geometry, interaction state and deformation checks. These checks use a mock renderer; they do not validate actual browser rendering.
- The PNG preview files in this complete source bundle are the original reference previews, not screenshots of the updated UI.

Files:
- glaucoma-eye-interactive.html: interactive viewer entry, using local runtime assets.
- eye-glaucoma-animated.blend: Blender version with a new “Glaucoma Progression” scene, retinal shader transitions and nerve scale animation. Frames 1, 289 and 577 are the reference stages, at 24 fps. The source scene is also retained.
- eye-glaucoma.glb: reusable eye geometry and the nerve scale animation. Cup contour morphing is implemented by the HTML shader. The Blender file retains the original reference material animation; ordinary GLB viewers show the first retinal texture.
- retina-1.png, retina-2.png, retina-3.png: the original packed stage textures used by the viewer.
- anatomy-preview.png: the labeled anatomy introduction.
- anatomy-highlight-preview.png: a selected structure highlighted on the model.
- preview-stage-1.png, preview-stage-2.png, preview-stage-3.png: browser previews at the three stages.

Source preserved: D:\Arclight\ScrollVisualsforApp\Workshop\Glaucoma\eye.blend.

Viewer libraries: Three.js r160, OrbitControls, GLTFLoader, BufferGeometryUtils and RoomEnvironment, distributed under the MIT license. See THIRD-PARTY-LICENSES.txt.
