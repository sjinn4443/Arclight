# Arclight Emergency Plan

## Emergency modes

- `off`
  - Normal operation.
- `readonly`
  - Blocks `POST /api/app/profile`, `POST /api/app/refresh`, `POST /track`, and `DELETE /api/dev/users/:anonId`.
  - Keeps public GET routes available.
- `emergency`
  - Returns a server-side `503` maintenance page for public HTML requests.
  - Returns `503` JSON for public app APIs and `/track`.
  - Keeps reports/admin routes available only from allowlisted IPs plus valid Basic Auth.
- `lockdown`
  - Blocks all public traffic except `GET /healthz`.
  - Keeps reports/admin routes available only from allowlisted IPs plus valid Basic Auth.

## How to choose a mode

- Use `readonly` when the incident appears limited to write abuse or data mutation risk.
  - Typical signals: telemetry spam, suspicious write payloads, abnormal `/track` volume, or concern about data corruption while public pages and admin credentials still appear trustworthy.
- Use `emergency` when users may be exposed to unsafe or compromised public content.
  - Typical signals: suspected HTML or JS tampering, suspected XSS, suspicious script injection, or any case where public browsing should stop but admin investigation still needs controlled access.
- Use `lockdown` when the scope is unknown or admin, secrets, or infrastructure may be compromised.
  - Typical signals: suspected `DASHBOARD_PASSWORD` leakage, DB credential leakage, deploy-token leakage, suspicious admin access, or signs the attacker may still have active control.
- If unsure, choose the stronger mode.
  - Default escalation path: `readonly` -> `emergency` -> `lockdown`.

## Immediate incident steps

1. Record the incident start time in UTC, who observed it, the initial symptoms, and the suspected entry point.
2. Set `EMERGENCY_MODE` to the lowest mode that safely contains the incident.
3. Restrict `ADMIN_ALLOWED_IPS` to office, VPN, or investigator IPs before using reports/admin routes in production.
4. Confirm expected behavior on `/`, `/api/app/profile`, `/track`, `/reports.html`, `/api/dev/users`, and `/healthz`.
5. Immediately rotate `DASHBOARD_PASSWORD`, DB credentials, deploy-platform credentials, and third-party API tokens.
6. Export platform logs first, then snapshot database evidence such as `app_users`, `ip_logs`, and `reports_audit_log`.
7. Review suspicious access against `/api/dev/*`, `/track`, `/api/app/profile`, and `/api/app/refresh`.

## Recovery expectations

- Prefer a fresh deployment behind the same public URL.
  - Replace the runtime with a clean new release, container, or instance instead of trusting the compromised process.
- A new public URL is not the default recovery path.
  - Use a new URL only if the existing domain, DNS, edge configuration, or hosting boundary may be compromised, or if a separate isolation site is required.
- Before returning to normal traffic, verify:
  - `EMERGENCY_MODE=off`
  - writes are enabled only in normal mode
  - reports/admin routes require both allowlisted IPs and valid Basic Auth
  - the public app no longer serves the maintenance page

Legacy note: `EMERGENCY_MODE=maintenance` is still accepted and is normalized to `emergency`.
