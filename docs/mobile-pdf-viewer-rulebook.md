# Mobile readers for illustrated PDF handouts

Use the existing Front of Eye PDF(test) reader as the visual reference. The Direct Ophthalmoscopy implementation adds a second reader in the Ophthalmoscopy Primary list. Both original PDFs and the existing workshop launchers keep their own navigation. The lesson title stays searchable in the app's existing Videos catalogue.

## Read and map the source

Open the whole handout at a legible size, then enlarge each row. Record the source file, version or hash, page box, rotation, labels, numbered sections, result symbols and the association between a caption and its illustration. Text extraction alone misses the visual instruction in both handouts. A section is a numbered teaching unit. A reading page is one stop in the viewer. A panel is a connected illustration, including its labels and comparison markers. A gallery is a set of independently enlargeable images.

Front of Eye uses three sections and six pages. Observation and magnified examination span the first three pages, including a gallery of twelve clinical photographs. Chamber depth has one page. Staining and eversion each have one page in the final section. Direct uses three sections and seven pages. Keep related before/after or tick/cross illustrations together when splitting them would separate a sign from its interpretation. A QR code needs its quiet margin. A photographic sequence whose individual frames make sense can be split at empty gutters.

| Direct source on page 1                                | Reader page | Panels in reading order                                         |
| ------------------------------------------------------ | ----------- | --------------------------------------------------------------- |
| Observation and Fundal Reflex, first two blocks        | 1           | External observations, instrument controls                      |
| Same row, final two blocks                             | 2           | Viewing position, paired reflexes and comparisons               |
| Positioning and Flight Path, upper row left and centre | 3           | Fixation, eye and hand selection                                |
| Upper row right, then lower row left                   | 4           | 10–15° approach, alignment and field of view                    |
| Lower row right                                        | 5           | Disc and the original Margin, Colour NRR and Cup comparison     |
| How to Examine, left and first two dark-field frames   | 6           | Illustrated drop sequence, disc, upper-field arrows             |
| Final two dark-field frames and source credits         | 7           | Lower field, horizontal arrow, original project and video codes |

The Direct master is `public/images/pdf/Workshop/DO/DO.pdf`, one A4 page, 595.276 × 841.89 pt with zero rotation. Its existing app preview is `DO.png`. The Direct page map and measured panel boundaries are in [the content definition](../public/js/directOphthalmoscopyBookData.js). Compare the [original handout](../public/images/pdf/Workshop/DO/DO.pdf) with the [seven mobile pages](lesson-review-2026-11-23/direct-seven-pages.webp).

## Extract and check the artwork

The [whole-sheet reference render](lesson-review-2026-11-23/direct-source.webp)
shows the printed row and column boundaries beside the [reader captures](lesson-review-2026-11-23/direct-seven-pages.webp).

1. Use `pdfinfo input.pdf` and render a reference image with `pdftoppm -singlefile -scale-to-x 1200 -scale-to-y -1 -png input.pdf reference`. Measure the actual PNG height. Account for displayed crop box and rotation. For a rotated page, measure on the rendered orientation or apply the full page matrix to all four corners.
2. Keep the measured reference coordinates in source control. For Direct the reference is 1200 × 1698. The authoring command renders it again at width 6000. Convert each left/right edge using `round(x * renderWidth / 1200)`; convert top/bottom using `round(y * renderHeight / 1698)`. Subtract opposite edges after rounding. The first illustration uses [85, 231, 288, 498] in reference pixels. Derive actual height from render metadata to account for fractional A4 scaling.
3. Native PDF point coordinates have their origin at the lower left. For an unrotated, zero-origin page, pixel x is `xPt * W / pageWidth` and top is `(pageHeight - yMaxPt) * H / pageHeight`. For transformed paths, first compose the graphics-state matrices, including saved/restored states. Preserve the original compound clips, masks and embedded photo transforms. Render a composite when separate vector and image exports would lose registration. Retain editable text for substantial passages, paired with the original figures. These two sources primarily communicate through illustrations, numbers and symbols.
4. Front of Eye's measured sheet is 1241 × 1754. Its script renders at width 9928 and measures scaleX and scaleY separately. The 12 gallery photos are a 4-column, 3-row source grid. The script removes near-solid black matte from the cropped photos and exports lossless HD WebP. The normal reader rounds standalone illustrations to 16px and displays the photo gallery and eversion pages with square CSS corners.
5. The eversion exception operates on a temporary PDF copy. The preparation script matches the known transformed bounds of the four outer panels and their group, replaces only the matched outer path, and preserves internal anatomical clipping. It accounts for PDF Y inversion when trimming the final pixels. Direct retains the original painted corner shapes and uses square CSS crops. Its four final fundus views have a continuous black background. Split them at the spaces between discs while retaining all arrowheads.
6. Open each derivative at fit width and again magnified. Compare thin arrows, disc margins, the tick/cross markers, the printed angle, text and QR margins with the original. Check against light and dark backgrounds if a source uses transparency. Prefer source-rendered detail to enlarging a low-resolution preview. Keep a separate output prefix and process large panels sequentially to limit memory.

```sh
node scripts/build-front-of-eye-book.cjs
node scripts/build-direct-ophthalmoscopy-book.mjs
```

Use the first command when regenerating the reference itself. It requires Poppler, Sharp and a Python with pypdf selected by BOOK_PYTHON. Direct requires Poppler and Sharp. PDFTOPPM_PATH can select the renderer. The Direct builder renders to a unique temporary folder and writes only the 15 current HD crops to the mobile asset directory.

## Reproduce the reading surface

The reference styles live in [frontOfEyePdfTest.css](../public/style/frontOfEyePdfTest.css). They use the app's inherited font and text colour. Reuse the book classes inside the new fragment. Scope additional top-bar, zoom and layout rules to the new page ID.

| Element                          | Front of Eye reference                                                                                                                                                    | Use and verification                                                                                                                                               |
| -------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| Outer container                  | 640px max, centred; 18px top, 16px sides, 24px bottom plus safe area; background #f2f2f7                                                                                  | At 320px check both edges and bottom controls with no horizontal page scroll.                                                                                      |
| Reading column and fixed top bar | 440px content max; top bar at least 62px, gap 12px; title 14px/600                                                                                                        | Check logo, global Back and menu in the actual app shell. Direct gives the reader an 80px scroll margin so the fixed bar clears the section controls after a turn. |
| Section buttons                  | 44 × 44px, circular, 10px gap, bottom margin 16px; #fff with #d1d5db border; current #000 and white                                                                       | Set aria-current only on the active section. A numbered button has an accessible name including the section title.                                                 |
| Divider                          | At least 60px; black, white type, 24px horizontal padding; heading padding 12px vertically                                                                                | Above 767px, font clamps from 1.05rem to 1.45rem, weight 500. Below that breakpoint use 1rem and .05em tracking.                                                   |
| Position, heading and hint       | Position 12px #666, 18px top and 8px bottom margin. Heading 20px/600 at 1.2 line height. Hint 12px and 20px bottom margin.                                                | Keep heading focusable with tabindex=-1. Announce position once through an atomic polite live region.                                                              |
| Panels and galleries             | Single column, 20px gap. Gallery uses two minmax(0,1fr) columns, 10px gap. Images width 100%, height auto.                                                                | Keep a marked pair together. Direct's single-column pages have up to three panel buttons. Only current-page panels are mounted.                                    |
| Previous and Next                | Flex row with 8px gap and 24px top margin. Buttons use the app's childhood navigation classes.                                                                            | Disable Previous on page one and Next on the last page. Verify both accessible state and disabled colour.                                                          |
| Enlarged image                   | Native modal dialog, width min(90vw,800px), max-height 90dvh, square corners, 75% black backdrop. Close button 44 × 44px, 8px from top/right, white on translucent black. | Direct adds a separate 52px control strip and a 2× pan view for narrow phones. Verify the button stays visible and never covers an optic disc.                     |

## Configure a new reader

Use a page ID, route, bookmark, progress target and asset folder unique to the lesson. The Direct reader uses route `directOphthalmoscopyMobile`, root and progress target `directOphthalmoscopyMobilePage`, session key `directOphthalmoscopyMobile:page` and prefix `images/pdf/Workshop/DO/mobile/`. Front of Eye uses `frontOfEyePdfTest:page`. A minimal Direct content entry looks like this:

```js
{
  section: 0,
  title: "Observation and light settings",
  panels: [
    ["observation", "Three external eye observations", [85, 231, 288, 498]],
    ["settings", "Instrument controls and room symbols", [303, 231, 522, 498]]
  ]
}
```

The renderer consumes the ID and description and the builder consumes the same ID and box. Use `<button type="button"><img ...></button>` per panel, give the button an enlargement label, and set the displayed alt on the enlarged image. Scope queries to the mounted page. Initialise once per fragment using its ready flag. Fragment removal releases element-local listeners and modal state. Remount from the stored bookmark, accepting only integers within the page range. A denied storage read starts at page one and denied writes leave in-memory navigation available.

Register the new fragment in config.js and its initializer in main.js. Place the additional PDF row immediately after its source in the owning lesson folder. Give it data-route, data-target and a progress bar labelled by a unique title ID. Define its structural Back fallback in navigation.js. Direct's fallback is Videos → directOphthalmoscopy. The existing catalogue reads the explicit route off the Videos row. Use the existing lessonProgress helper with the highest percentage reached. Existing callers of the original PDF remain valid, including workshop Previous/Next. If another PDF has multiple launch contexts, test the original parent return for each context before adding its mobile alternative there.

Use the owning content pack's existing asset prefix where possible. Direct's source folder is already matched by core-ophthalmoscopy and tools. Verify the selected URLs contain every derivative. The renderer and stylesheet must also be present in the built shell. Offline selection and a real offline launch are separate checks.

## Behaviour and acceptance

- A section click opens its first reading page. Previous/Next move one page, focus the heading and reveal the section controls. The viewer handles unmodified Left/Right keys while it has focus. It ignores them when a dialog is open. Inspect the computed top-bar bottom and chooser top after every turn.
- Open each image by pointer and keyboard. Check the same description and image, a named Close control, Escape, focus restoration and a second open after closing. On Direct, choose Zoom in, pan the scrollable image, then Fit image. Reopen at fit size. Rotate while reading and reopen the modal at the new dimensions.
- Reload mid-section. Check the independent session bookmark, opening another reader and returning, and the final lesson-progress record. A page visit tracks the furthest page opened. It does not count distinct pages read.
- For another source, check the original page map against the rendered derivatives at phone, tablet and desktop widths. Verify every referenced file decodes and every figure retains its aspect ratio. Check the source PDF entry, keyboard order, last-page disabled state, menu/Back and selected download assets in the running app.

The repeatable browser checks are in [the Direct reader spec](../tests-e2e/direct-ophthalmoscopy-mobile.spec.js). In a running source or built app, open `#/videos/directOphthalmoscopy`, choose **Direct Ophthalmoscopy PDF (Mobile)**, then open section 2. It starts on Positioning. Next opens Flight path. Reload at this point to verify bookmark restoration. The original Direct Ophthalmoscopy row immediately above still opens the full sheet.

### Direct verification on 23 November

All seven pages decoded at 320, 390, 430, 820 and 1440 CSS pixels. At 390, 820 and 1440 the repeatable Chrome test also exercised every image, 2× zoom, Escape, focus restoration, keyboard navigation, section selection, rotation, bookmark, progress and the original PDF row. The reader test passed in Windows WebKit with iPhone 13 and iPad Pro 11 emulation. The iPhone run exposed a focus issue fixed by returning focus explicitly to the image button when the dialog closes.

In Chrome, the production download dialog cached all 15 Direct panels for the selected Ophthalmoscopy pack. After disconnecting the browser, a full reload and page turns through all seven pages succeeded. These checks used browser emulation. Physical iOS hardware was not tested.
