# `securitytest/`

This directory contains scripts for manually testing security-related behavior of the Arclight server.

## What these scripts are for

- `cors_tests.ps1` – checks CORS behavior
- `csrf_test.ps1` – checks CSRF protection behavior
- `header_checks.ps1` – checks common security headers
- `rate_burst_test.ps1` – sends a burst of requests to exercise rate limiting
- `rate_test_node.js` – Node-based rate limit test

## Important note about the current server

The current `server.cjs` focuses on:

- **Basic Auth** protection for `/reports.html` and `/html/reports.html`
- A **scoped, in-memory limiter** for repeated auth attempts to those reports pages

The server does **not** currently apply the `security/cors.cjs`, `security/csp.cjs`, or `security/csrf.cjs` modules (they are placeholders). Some scripts in this folder may therefore be **informational** until those protections are re-enabled.

## Running the scripts (PowerShell)

1. Start the server:

```powershell
$env:DASHBOARD_PASSWORD="your-password"
npm start
```

2. Run a script, for example:

```powershell
./securitytest/header_checks.ps1
```

If a script targets the reports page, you may need to provide the Basic Auth password (`DASHBOARD_PASSWORD`).

## Tips

- Use a separate terminal for the server logs.
- Prefer testing against localhost first (`http://localhost:3000`).
