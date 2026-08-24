# Arclight cloud reporting

Private, read-only MCP reporting service intended for Railway private networking and OpenAI Secure MCP Tunnel. It exposes exactly five tools:

- `health`
- `deployment`
- `backup`
- `usage_statistics`
- `generate_postgres_docx`

The first four tools return no raw personal data. The DOCX tool reads personal data inside the service, generates and validates a Word document, then returns only aggregate QA details and an MCP resource link. Raw database values are never written to application logs or ordinary MCP tool text.

## Required Railway configuration

Create a dedicated PostgreSQL role with `CONNECT`, schema `USAGE` and `SELECT` on `app_users`, `ip_logs`, `app_users_latest_first` and `ip_logs_latest_first`. It must have no write, DDL, role, replication, bypass-RLS or superuser rights. Store its credentials only as Railway variables. Prefer the split `REPORTS_DB_*` variables so the password can be entered separately. `REPORTS_READ_DATABASE_URL` remains available as an alternative. The application writer `DATABASE_URL` is deliberately never used as a fallback.

Set these variables on the reporting service:

| Variable                      | Purpose                                                                              |
| ----------------------------- | ------------------------------------------------------------------------------------ |
| `REPORTS_READ_DATABASE_URL`   | Optional dedicated read-only PostgreSQL connection string                            |
| `REPORTS_DB_HOST`             | Read-only PostgreSQL host when using split variables                                 |
| `REPORTS_DB_PORT`             | Read-only PostgreSQL port when using split variables                                 |
| `REPORTS_DB_NAME`             | Read-only PostgreSQL database name when using split variables                        |
| `REPORTS_DB_USER`             | Dedicated read-only PostgreSQL login                                                 |
| `REPORTS_DB_PASSWORD`         | Dedicated read-only login password, stored as a Railway secret                       |
| `REPORTS_DB_SSLMODE`          | Optional libpq SSL mode suitable for the Railway network path                        |
| `REPORT_OUTPUT_DIR`           | Final report directory, normally `/data/reports`                                     |
| `POSTGRES_VOLUME_INSTANCE_ID` | Railway Postgres volume instance for backup checks                                   |
| `RAILWAY_PROJECT_TOKEN`       | Project-scoped token used only for read-only Railway GraphQL checks                  |
| `GEOIP_DB_PATH`               | Optional authorised offline MaxMind-compatible City MMDB                             |
| `MCP_ALLOWED_HOSTS`           | Comma-separated private MCP Host values if automatic Railway values are insufficient |

Attach a Railway volume at `/data/reports`. Reports are mode `0600`; staging PDF and page images are deleted after every render-and-inspect pass. If no authorised offline City database is mounted, the report uses the stored country and marks city as unavailable. It never sends raw IPs to a third-party lookup service.

## Secure MCP Tunnel worker

Run a second Railway service from the pinned official image:

```text
ghcr.io/openai/tunnel-client:v0.0.12
```

Keep `CONTROL_PLANE_API_KEY` and `CONTROL_PLANE_TUNNEL_ID` as Railway secrets. Point `MCP_SERVER_URL` at the reporting service's private URL ending in `/mcp`, set `MCP_STARTUP_WAIT_TIMEOUT=120s`, `LOG_LEVEL=info`, `LOG_FORMAT=json` and `HEALTH_LISTEN_ADDR=:8080`. Do not create a public domain for either service.

## Verification

```bash
python -m pytest -q
ruff check src tests
```

The production smoke test must confirm the service and tunnel `/healthz` and `/readyz` routes, exactly five discovered MCP tools, aggregate-only responses, matching GitHub and deployment SHAs, read-only database grants, current backup status and a rendered DOCX whose staging files have been removed.
