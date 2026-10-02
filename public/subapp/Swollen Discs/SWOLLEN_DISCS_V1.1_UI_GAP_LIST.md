# Swollen Discs v1.1 UI gap list

Audit date: 23 July 2026. Reference viewport: 360 x 740.

| Topic            | Finding and action                                                                                                                                                                        |
| ---------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Radius hierarchy | Existing tokens already supplied 18 px outer, 16 px stage, 12 px card, 10 px control and 8 px compact radii. Replaced the quick guide's isolated 14 px radius with the 16 px stage token. |
| Spacing          | Existing compact rows and 4/6/8/10/12/16 px rhythm fit the viewport. The reset section follows the drawer's established spacing.                                                          |
| Typography       | Preserved local Inter and Quicksand, red title and existing label hierarchy.                                                                                                              |
| Italics          | Modal emphasis is upright to avoid decorative italics in task-focused UI.                                                                                                                 |
| Alignment        | Condition, viewer and interpretation edges now share the compact content width. Empty timed-test status space is removed outside timed practice so the initial state still fits.          |
| Borders          | Existing blue-grey one-pixel grouping remains. Reset uses a restrained amber border and dot for consequence without competing with primary teaching actions.                              |
| Shadows          | Soft shadow and page-gradient values now match the Fundal Reflex treatment while preserving stage, drawer and modal separation.                                                           |
| Action hierarchy | Condition and practice actions remain primary. Reset follows all practice and achievement controls and requires a confirming second press.                                                |

Visual inspection found no clipping or horizontal overflow in untouched, dense, fully opened drawer, reset-confirmation or reset states at 360 x 740.

## Follow-up fleet consistency review

Following direct comparison with Discs, Diabetic and Fundal Reflex, the compact viewer's former `300px` maximum was removed. The 16px black stage now aligns with the control and interpretation cards without changing the canvas, condition catalogue, outputs or interaction geometry. Diabetic already matched the Discs viewer shell and required no further change.
