# Template execution contract

## Reference

- Path: `C:\Users\young\Downloads\15 - 19 June.docx`
- SHA-256: `0B19F0022172001957D1D9703465646C89E02A3AECA2DB284FFAE95386EC5122`
- Recorded page count: 2
- Section count: 1
- Evidence: `reference-style-evidence.json` and the section audit captured in the task log
- Rendering: the packaged renderer could not run because LibreOffice is not installed

## Page system

- A4 portrait: 8.27 x 11.69 inches
- Margins: 1 inch on every side
- One section with no first-page or odd/even-page variants
- Empty linked header and footer, retained unchanged

## Typography and paragraph roles

- Theme fonts: Aptos Display (major) and Aptos (minor)
- Title: Normal paragraph with bold direct run formatting
- Section heading: Normal paragraph with bold direct run formatting
- Body item: List Paragraph with numbering level 0 and numbering ID 36
- Blank Normal paragraphs separate the title and sections
- All inherited spacing, line spacing, indents and font sizes are retained from the reference

## Lists and components

- Bullets are real Word numbering copied from the source paragraph pattern
- No tables, images, callouts, fields, comments, footnotes, text boxes or content controls
- Content flow: title, blank line, repeated bold section heading plus bullet items

## Slot map

- `word/document.xml` body title: replace with the new date range
- `word/document.xml` body content: replace with new section headings and bullet items
- Final `w:sectPr`: preserve exactly
- `docProps/core.xml` title and modified timestamp: update
- Every other package part and relationship: preserve byte-for-byte

## Fidelity gates

- The reference file must retain its recorded SHA-256
- A4 page geometry, margins, section properties, theme, styles and numbering must remain unchanged
- The final document must contain only the requested title, headings and concise bullets
- No Oxford comma, technical jargon without a plain explanation or internal citation tokens
