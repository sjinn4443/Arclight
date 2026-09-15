# Template execution contract

## Reference

- Path: `C:\Users\young\Downloads\15 - 19 June.docx`
- SHA-256: `0B19F0022172001957D1D9703465646C89E02A3AECA2DB284FFAE95386EC5122`
- Recorded page count: 2
- Section count: 1
- Evidence: `reference-style-evidence.json` and the section audit captured in the task log
- Rendering: the packaged renderer could not run because LibreOffice is not installed

## Page system

- Source body: A4 portrait, 8.27 x 11.69 inches
- Source margins: 1 inch on every side
- Empty header and footer
- Output body: retain the source A4 portrait geometry and margins
- Output comparison table: add one A4 landscape section with 0.55 inch margins so four columns remain readable

## Typography and paragraph roles

- Theme fonts: Aptos Display and Aptos
- Title: Word Title style with direct black Aptos 14 pt bold formatting and no rule or border
- Introductory text: Normal style, black Aptos 11 pt
- Section heading: Heading 1 style with direct black Aptos 11 pt bold formatting
- Body item: List Paragraph with numbering level 0 and numbering ID 36
- Table: black Aptos 9 pt body text, 9 pt bold white header text and bold first-column labels

## Lists and table

- Bullets use the source document's real numbering definition
- Table geometry is fixed at 15,240 DXA with column widths of 2,160, 3,420, 4,800 and 4,860 DXA
- Table borders are light grey `D9D9D9`
- Table header fill is dark blue `1F4E78` with white text
- Alternate body rows use pale blue `F2F7FB`
- Header row repeats across pages
- Rows expand with content and do not use fixed heights
- Cell margins are explicitly set and text is vertically centred

## Content flow

1. Weekly update title and one-sentence summary
2. Narration and video learning changes
3. Language and offline access changes
4. Reliability and testing changes
5. Work in progress note
6. Scheduled tasks comparison table

## Slot map and package preservation

- Replace `word/document.xml` body with the new title, prose, bullets, section break and comparison table
- Update `docProps/core.xml` title and modified time
- Preserve all other package parts and relationships byte-for-byte
- Preserve the reference file unchanged

## Fidelity gates

- The reference SHA-256 must remain unchanged
- The first section must remain A4 portrait with 1 inch margins
- The table must be A4 landscape, use fixed column widths and repeat its header
- No Oxford comma, unexplained jargon, placeholder text or internal citation tokens
- The in-progress narration statement must remain clearly marked as unfinished work

