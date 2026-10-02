# Cataract logic correction evidence

Date: 29 September 2026. Scope: five user-approved findings.

## Changes

1. Sudden visual loss, recorded detachment and childhood white reflex retain urgent advice when required data are missing. No cataract diagnosis is displayed until the assessment is complete. Fundal entry is available before history completion so the white reflex can be recorded.
2. Dense only defaults an empty back-of-eye entry to Poor view. Existing posterior disease stays selected and the choices remain editable.
3. Pupil and afferent warnings outrank secondary notes within the existing compact note limit.
4. Good fixation alone does not trigger reduced-acuity/amblyopia routing. Poor fixation still does. Good fixation does not assert measured 6/6 acuity.
5. Non-white cataract patterns with 6/6 do not automatically trigger mismatch warnings. The Dense/white-reflex mismatch check remains.

## Evidence

- 13 existing contract tests and five new regression tests pass.
- Acceptance: 30/30 pass.
- Expanded result-output audit: 614,400 combinations; 2,925 unique panels; zero configured P0–P3 findings. The audit now includes Dense with retained posterior disease. Its expected routing preserves urgent childhood white-reflex advice over non-detached posterior-first wording.
- LMIC copy audit passes.
- Bundle rebuilt using the pinned esbuild 0.25.5 dependency. Build parity passes after allowing the local child process outside the sandbox.
- Live HTTP checks: sudden loss with other inputs blank displays same-day advice; Dense preserves selected Detached; completed assessment retains same-day retinal advice. Layout screenshots inspected at 360 x 740. No console errors or warnings.
- Local HTTP server restarted on 127.0.0.1:8090 because it had stopped. Browser cache and service-worker bypasses were used temporarily for verification then restored. A normal reload loads the new release.
- Offline cache now matches assets within Cataract's current named cache with exact query strings. New worker registration requests a cache-independent update. No sibling cache was deliberately cleared.
- The saved retained-tab sizing script could not locate the Cataract tab. Current page measurements are 360 x 740 but persistent real-toolbar switch-away/back verification is not claimed.
- Direct-file automation, physical-device acceptance and independent clinical sign-off remain outstanding. The full legacy combination/full audits were not rerun in this correction pass.

Runtime release: `20260929-logic1`. Development `node_modules` is build-only and should be excluded from an integration zip.
