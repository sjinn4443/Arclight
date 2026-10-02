# Fields logic correction evidence

Date: 28 September 2026. Scope: eight findings explicitly approved by the user. Independent clinical sign-off remains pending.

## Changes

1. Retinal-detachment headline always says suspected; field confidence stays in the pattern description. Existing urgency retained.
2. Abnormal entry no longer fills untested points. The existing explicit completion action remains available.
3. Tunnel headlines describe peripheral constriction, not definite glaucoma. Simple-mode wording remains compact.
4. Bilateral total loss includes cortical causes in the explanation and both V1 regions in the diagram.
5. Suppressed overlapping rules do not manufacture a mixed-pattern alternative.
6. Bitemporal hemianopia retains central involvement as a qualifier instead of discarding the chiasmal pattern.
7. Opposite altitudinal defects describe the opposite retinal halves and highlight both eyes.
8. Bilateral RAPD wording allows asymmetry. A matching RAPD alone does not narrow anterior localisation to optic nerve rather than retina.

## Verification

- Existing focused contracts: 20 passing; seven new clinical regression tests passing.
- Field-state audit: 59,049 combinations; 15/15 regression cases; no configured findings.
- Pathway audit: 1,062,882 combinations; no alignment findings. Updated expected targets include bilateral cortical possibilities.
- Context-modifier audit: exit 0.
- MCQ audit: exit 0. Live browser console: no warnings or errors; measured 360 x 740 with no horizontal overflow.
- The 17,006,112-comparison Simple/Advanced sweep was stopped after approximately five minutes without completing. Its historical output report is not evidence for this release. Focused Simple/Advanced regression coverage passed, but the exhaustive wording sweep remains outstanding.
- Live HTTP page: untouched result is unassessed; a suspect point leaves the other nine unassessed; explicit completion produces the correct result. Completed-state screenshot inspected at 360 x 740 without layout changes.
- Cache and changed script URLs bumped to `20260928-logic1`.
- Node's `--test` child-process runner was blocked by EPERM; direct execution of the test module passes.
- Direct-file automation is unavailable. No physical-device or independent clinical acceptance is claimed.
- Real device-toolbar script attempted. Width and height read 360 and 740, but the UI Automation tab selection does not reliably switch away and back. Persistent retained-tab hand-off remains unverified.

## Clinical basis

- NEI retinal detachment: symptoms warrant urgent examination, not confirmation from confrontation fields alone: https://www.nei.nih.gov/eye-health-information/eye-conditions-and-diseases/retinal-detachment
- RAPD can accompany asymmetric optic nerve or extensive retinal disease: https://pubmed.ncbi.nlm.nih.gov/2139050/
- Visual-field localisation and cortical blindness: https://www.ncbi.nlm.nih.gov/books/NBK220/

The regression suite verifies implemented rules, not diagnostic accuracy in patients. Historical July audit reports describe the earlier rules and must not be treated as current clinical approval.
