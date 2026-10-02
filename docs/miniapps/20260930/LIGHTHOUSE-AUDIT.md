# Lighthouse audit

Use this only as a development and handover check. It does not add code or dependencies to the mini apps.

## Latest fleet result — 30 September 2026

All 15 apps audited before and after the first safe performance pass using pinned Lighthouse 12.8.2. Mean Performance is 87.7 → 90.2; measured Accessibility and SEO categories are 100 throughout. Nine bundles in eight apps are 46.36% smaller before compression. These are single paired lab runs, not physical-device speed guarantees. Remaining audit warnings and limitations are recorded in the [performance receipt](FLEET_PERFORMANCE_REVIEW_20260930.md).

Baseline: audit-reports/lighthouse/2026-09-30T20-33-13-099Z-mobile/. After: audit-reports/lighthouse/2026-09-30T20-41-26-459Z-mobile/. Combined measurements: output/performance-20260930/measurements.json.

## Historical fleet result — 27 July 2026

The fresh mobile run covered all 15 apps at the configured `360 x 740` Lighthouse viewport using pinned Lighthouse `12.8.2`. HTML, JSON and summary evidence is stored in:

```text
audit-reports/lighthouse/2026-07-27T08-49-32-606Z-mobile/
```

| App           | Performance | Accessibility | Best practices | SEO |
| ------------- | ----------: | ------------: | -------------: | --: |
| Allan         |          72 |            99 |             96 | 100 |
| Amsler        |          86 |           100 |            100 | 100 |
| Cataract      |          92 |           100 |             96 | 100 |
| Diabetic      |          84 |           100 |            100 | 100 |
| Discs         |          81 |           100 |            100 | 100 |
| Fields        |          84 |           100 |             96 | 100 |
| Fundal Reflex |          77 |           100 |            100 | 100 |
| Glaucoma      |          94 |            96 |            100 | 100 |
| Mires         |          96 |           100 |             96 | 100 |
| Morph         |          95 |           100 |            100 | 100 |
| Refract       |          96 |            94 |            100 | 100 |
| Sauron        |          90 |           100 |            100 | 100 |
| Squint        |          86 |           100 |            100 | 100 |
| Swollen Discs |          91 |           100 |            100 | 100 |
| Trauma        |          99 |           100 |            100 | 100 |

Fleet averages are Performance `88.2`, Accessibility `99.3`, Best practices `98.9` and SEO `100`. The median Performance score is `90`.

All 15 reports record zero console errors and zero failed HTTP requests. The actionable non-performance findings are:

- Allan applies `role="tablist"` to an incompatible `section`.
- Glaucoma's four IOP radio inputs provide only `18 x 18px` targets with insufficient spacing.
- Refract leaves focusable MCQ controls inside a closed navigation region marked `aria-hidden="true"`.
- Allan, Cataract, Fields and Mires contain meaningful amounts of text below Lighthouse's `12px` legibility threshold. These need measured UI review before any increase because each app intentionally uses a compact `360 x 740` layout.

Performance findings require interpretation:

- Allan's `72` is driven mainly by an oversized `960 x 960` reference image rendered at roughly `157 x 126px`, with Lighthouse estimating about `708 KiB` of responsive-image saving.
- Fundal Reflex's `77` reflects render-blocking resources and a comparatively large unminified teaching bundle.
- Discs and Diabetic have higher script work than most siblings. Diabetic also transfers about `2.2 MiB` in the untouched audited state.
- Text-compression warnings reflect the deliberately simple local audit server. Compression should be enabled by the eventual integration host rather than simulated inside the apps.

Lighthouse does not itself establish installed offline behaviour, clinical correctness or physical-device acceptance. A separate isolated Chromium pass activated each app-scoped service worker, removed the network and reloaded all 15 apps at `360 x 740`. Every app reached `document.readyState = complete`, retained a semantic `main`, remained service-worker controlled and kept a `360px` document width. The browser recorded no console warning or error. This is a warm installed-cache check, not physical-device or first-install acceptance.

## Run all apps

```powershell
cd "C:\Users\William\Desktop\Arclight App"
node audit-lighthouse.mjs
```

This creates mobile Lighthouse HTML reports for each mini app under:

```text
audit-reports/lighthouse/
```

## Run one app

```powershell
node audit-lighthouse.mjs --app Sauron
```

## Create score data as well

```powershell
node audit-lighthouse.mjs --format both
```

This writes HTML reports, JSON reports and a `summary.csv`.

## What matters for the lightweight app idea

- The catalogue should load only a thumbnail, name and short description for each mini app.
- Each mini app should load only when chosen or installed.
- Keep images as WebP and avoid pulling every app image into the first screen.
- Audit each mini app on its own and audit the catalogue shell separately.
- Treat Accessibility and Best practices as the most actionable Lighthouse sections.
- Treat Performance as a warning signal rather than an absolute score, because local static files can score differently from a real low-bandwidth phone.

## Targeted remediation results - 27 July 2026

Six narrow fixes were applied after the fleet baseline. No clinical thresholds, referral actions, simulator mappings or calculation rules changed.

| App           | Baseline P / A / BP / SEO | Final P / A / BP / SEO | Verified improvement                                                                 |
| ------------- | ------------------------: | ---------------------: | ------------------------------------------------------------------------------------ |
| Allan         |        72 / 99 / 96 / 100 |   76 / 100 / 100 / 100 | Compatible tab-list container, `480 x 480` initial preview and `99.07%` legible text |
| Diabetic      |      84 / 100 / 100 / 100 |   83 / 100 / 100 / 100 | Initial transfer reduced from about `2.26 MiB` to `483 KiB`; FCP and LCP improved    |
| Fundal Reflex |      77 / 100 / 100 / 100 |   85 / 100 / 100 / 100 | Minified production bundle; transfer reduced from about `542 KiB` to `390 KiB`       |
| Glaucoma      |       94 / 96 / 100 / 100 |   94 / 100 / 100 / 100 | Four IOP inputs increased from `18 x 18px` to `24 x 24px`                            |
| Mires         |       96 / 100 / 96 / 100 |   96 / 100 / 100 / 100 | Meaningful compact labels use `12px`; `99.24%` legible text                          |
| Refract       |       96 / 94 / 100 / 100 |   95 / 100 / 100 / 100 | Closed drawer is inert; repeat run reports zero layout shift                         |

The one-point Diabetic performance difference is run noise within a materially improved transfer profile. Its FCP improved from about `2.7s` to `2.5s` and LCP from about `3.2s` to `3.0s`. Refract's first post-fix run recorded a transient layout shift that did not reproduce; the confirmation run scored `95` performance with zero CLS.

Evidence:

- Six-app post-fix run: `audit-reports/lighthouse/2026-07-27T09-44-59-178Z-mobile/`
- Final Allan, Mires and Refract confirmation: `audit-reports/lighthouse/2026-07-27T09-51-54-747Z-mobile/`
- Isolated screenshots: each affected app's `output/playwright/audit-remediation*.png`

Cataract and Fields retain their deliberately compact labels. They were not changed without a measured collision-safe design. Discs retains its default main teaching image because it is visible content rather than speculative prefetch. These are recorded limitations, not clinical approval or physical-device acceptance.
