# Arclight App Fleet Standards

## Scope

These standards apply to every app beneath this parent folder. Use `Allan/ALLAN_V1.2_SPRINT_UPGRADE_PLAYBOOK.md` as the reusable engineering reference and `ARCLIGHT_FLEET_UPGRADE_PLAN.md` as the approved fleet plan.

## Preservation

- Preserve each app's clinical, calculation and simulator logic unless a separately approved task explicitly changes it.
- Preserve successful workflows and layouts. Make narrow UI refinements rather than wholesale rewrites.
- Compare browser-visible changes with the app's baseline and restore the original arrangement if a proposed refinement makes it less clear or less compact.
- Keep each app's identity, terminology, imagery and accent colour.
- Do not transplant Allan's dermatology content, thresholds, labels, IDs or assets.
- Rebuild generated bundles from source. Do not hand-edit bundles as an independent source.
- Preserve existing files and user changes. The fleet has an external USB backup but no usable shared Git history.

## Shared UI

- Use a compact black app bar with the app's existing accent colour for the title and app-bar controls.
- Target `360 x 740` while retaining layouts that already work.
- Prefer local Quicksand for titles and local Inter for UI text where compatible.
- Use Quicksand `14px/700/1.2` information-card titles, Inter `12.5px/400/1.42` body text, Inter `11px/800/1.25` section labels, Inter `12px/700/1.15` cue headings, Inter `10px/400/1.15` cue helpers and Inter `10.5px/700/1.2` version text. Keep these roles upright. The initial card must fit at `360 x 740` without internal scrolling. Keep critical safety content initially visible and place only genuinely secondary reference material in a native disclosure whose open state is also verified.
- Open every existing information panel with three plain answers: what the app does, what the user enters or manipulates from the patient or teaching view in front of them and what the app cannot conclude. Keep this purpose copy initially visible. Do not create another popup or auto-open it. Keep secondary reference material in a native disclosure when needed so the closed card remains one non-scrolling page at `360 x 740`.
- Reserve italics for genuinely useful clinical distinctions, observations or secondary explanatory locations. Do not italicise operational modes, button labels, calculations, results or whole instruction sentences for decoration.
- Present the simple visible `v1` label and current update date as a separate bottom-right information-card footer. Keep internal package and engine versions unchanged, keep the footer visible in expanded disclosure states and protect its text, date and shared `info-version` hook with a fleet contract.
- Keep primary actions visually clear, secondary teaching content quiet and touch targets at least `44 x 44px` where space permits.
- Keep main-page type roles consistent within each app. Prefer a `10px` floor for compact labels, use `9.5px` only after a measured collision review and do not use font-size changes alone to indicate a selected tab.
- Improve hierarchy, spacing and accessibility without inventing new workflows.
- Do not add visible explanatory text to dense controls unless it remains readable and collision-free at the target widths.
- Fix close-control collisions with measured spacing and track sizing before introducing extra rows or moving controls.

## Safety and Accessibility

- Teaching state must not alter operational clinical decisions.
- Do not present untouched patient-assessment state as a recorded normal finding.
- Add case reset only where patient or examination state exists. Add session reset only where it helps a teaching app.
- Preserve keyboard access, visible focus, accessible names, Escape handling and focus restoration for transient UI.
- Do not change clinical thresholds, referral actions or decision wording without explicit approval.

## Runtime and Verification

- Avoid normal-runtime CDN dependencies. Bundle required fonts, icons and licences locally.
- Use app-scoped manifest and service-worker configuration. Never delete or intercept a sibling app's cache.
- Add tests that protect established behaviour rather than redefine it.
- Verify browser-visible changes at `360 x 740`, check the console and record evidence.
- Check both untouched and completed states. Add the user's observed viewport when it differs from `360 x 740`.
- Verify direct-file use as well as HTTP use when both are supported. Remember that service workers do not run on `file://` pages.
- Version browser-visible assets and bump the app-specific cache when styles or scripts change.
- Desktop emulation does not count as physical-device acceptance.

## Mandatory Codex Browser Hand-off

- Use the personal `$arclight-browser-handoff` skill whenever an Arclight app is opened, reviewed or handed back in the Codex browser. Run its deterministic retained-tab script rather than reconstructing the toolbar procedure from memory.
- **Pre-final stop check:** identify the exact retained tab the user is viewing, use its real browser chrome, confirm the intended URL is loaded, enable `Show device toolbar`, set the visible spinners to `360 x 740`, switch to another real tab and back, then re-read the same URL and both spinner values. Do not send a completion message until every check passes.
- Treat the Codex browser device-toolbar size as tab-specific user-interface state.
- Automated viewport overrides are temporary test settings. They can report `360 x 740` while browser control is active, then disappear when control is released or finalised, including an ongoing hand-off.
- Never claim that retained Codex browser tabs remain at `360 x 740` because automated page measurements passed before hand-off.
- Never overwrite or reapply a viewport the user set manually unless the user explicitly asks for that individual tab to change.
- Set persistent retained-tab sizing through the real Codex browser chrome: `Browser options` → `Show device toolbar`, then enter `360` in `Viewport width` and `740` in `Viewport height`.
- For a multi-tab hand-off, select each real browser `TabItem`, operate the visible device-toolbar controls and re-read both values. Do not substitute CDP page emulation for this user-interface state.
- After setting the tabs, switch away and back normally and re-read every tab's toolbar values. Report success only when every retained tab still shows `360 x 740`.
- For automated review, prefer one active tab and navigate it app by app at `360 x 740`. Keep this separate from the user's persistent review tabs.
- State any `file://` verification limitation explicitly.

## Documentation

- Use British English in general text.
- Do not use Oxford commas.
- Update each app's README and relevant memory-bank files after implementation.
- Record clinical sign-off and physical-device status honestly. Engineering consistency is not clinical approval.
- Update `ARCLIGHT_APP_UPGRADE_MATRIX.md` with exact evidence as work progresses.

## Sidebar Standard

- Preserve each app's menu content, action order and accent colour.
- Use a `14px/700` drawer title, `11px/800` section labels and `12.5px/400` supporting copy where those roles exist. Keep primary menu actions at their established `16px/700` scale.
- Use upright Inter for drawer interface text. Reserve italics for genuine teaching or observation cues.
- Opening a drawer must move focus to an available control. Escape must close it and return focus to the menu trigger.
- Allow drawer-only vertical scrolling when the existing content genuinely exceeds `360 x 740`. Do not compress long teaching menus into unreadable text.
- Verify the open drawer at `360 x 740` for geometry, horizontal overflow, focus entry, Escape closure, focus return and console errors.

## MCQ Standard

- Preserve each app's clinical domain, tier structure and established scoring unless an evidence-backed defect is identified and recorded.
- Give every authored question a stable app-scoped ID, one unambiguous best answer, distinct options, a concise rationale, a declared source status and an explicit pending clinical-sign-off status where approval is incomplete.
- Keep app-operation questions only when operating the teaching tool is itself a genuine learning objective. Prefer clinically useful technique, interpretation, limitation and safety questions.
- Avoid absolute wording where the evidence is conditional. Do not add or change local referral timing without user authority and independent clinical review.
- Block incomplete submission, move focus to the first unanswered item and show correct plus selected-wrong review states with the rationale after marking.
- Provide a real fresh retry after marking. A retry must not remain disabled and must not erase previously earned progression.
- Use the shared Primary, Intermediate and Advanced labels, `44px` answer rows and a compact result-first action area where compatible with the app.
- Test stable IDs, tier ownership, bank size, attempt size, pass marks, duplicate prompts, distinct options, answer membership and source metadata against the real authored bank.
- Review unanswered, failed, passed, rationale, retry, Escape and focus-return paths at `360 x 740`. Record console output, horizontal overflow and the temporary nature of automated viewport emulation.
