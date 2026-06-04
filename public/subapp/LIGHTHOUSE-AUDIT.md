# Lighthouse audit

Use this only as a development and handover check. It does not add code or dependencies to the mini apps.

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
