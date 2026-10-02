# Morph v1.1 UI gap list

Audit date: 23 July 2026. Reference viewport: 360 x 740.

| Topic            | Finding and action                                                                                                                                                                                     |
| ---------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| Radius hierarchy | The existing tokens already provide restrained 18 px outer, 16 px stage/modal, 12 px card, 10 px control and 8 px compact radii. Replaced the guide's isolated 14 px value with the 16 px stage token. |
| Spacing          | Existing compact rows fit the target viewport without required horizontal or page overflow. The new reset action uses the drawer's existing 8/12/16 px rhythm.                                         |
| Typography       | Local Inter and Quicksand remain authoritative. Labels and headings retain the app's established hierarchy.                                                                                            |
| Italics          | Guide emphasis is rendered upright to avoid decorative italics in operational UI.                                                                                                                      |
| Alignment        | Existing Cataract, Field, Rx, Condition and Adult/Child alignment is preserved. The simulator was not rearranged.                                                                                      |
| Borders          | Existing one-pixel blue-grey borders preserve control grouping and sufficient contrast. The reset uses a restrained amber border to distinguish a consequential action.                                |
| Shadows          | Reduced the strongest shadow from 14/30 to 10/24 while retaining necessary separation on the black stage and pale drawer.                                                                              |
| Action hierarchy | Viewer controls remain primary. Reset is placed after condition teaching controls, separated by space and protected by a second press.                                                                 |

Visual review found no clipping or horizontal overflow in untouched, dense or fully opened drawer states at 360 x 740.
