from __future__ import annotations

import json
from typing import Any

import anyio
from mcp.server import MCPServer
from mcp.server.transport_security import TransportSecuritySettings
from mcp_types import CallToolResult, ResourceLink, TextContent, ToolAnnotations
from starlette.requests import Request
from starlette.responses import JSONResponse

from . import __version__
from .config import Settings
from .database import DatabaseClient, ReportingDatabaseError
from .railway_api import RailwayStatusClient
from .reporting import (
    find_report,
    generate_error_report,
    generate_report,
)
from .safe import public_error

READ_ONLY = ToolAnnotations(
    readOnlyHint=True,
    destructiveHint=False,
    idempotentHint=True,
    openWorldHint=False,
)
GENERATES_FILE = ToolAnnotations(
    readOnlyHint=False,
    destructiveHint=False,
    idempotentHint=False,
    openWorldHint=False,
)


mcp = MCPServer(
    "Arclight Reporting",
    version=__version__,
    instructions=(
        "Private read-only production reporting. Never repeat identifiers or raw personal "
        "data from report resources in chat. Use aggregate tool results for prose and "
        "give the DOCX resource link directly to the developer."
    ),
)


@mcp.tool(annotations=READ_ONLY)
def health() -> dict[str, Any]:
    """Check service and read-only PostgreSQL health without returning personal data."""
    settings = Settings.from_env()
    if not settings.database_url:
        return public_error("reports_read_database_url_not_configured")
    try:
        database = DatabaseClient(settings.database_url).health()
        return {
            "status": database["status"],
            "service_version": __version__,
            "database": database,
        }
    except ReportingDatabaseError:
        return public_error("database_unreachable")


@mcp.tool(annotations=READ_ONLY)
def deployment() -> dict[str, Any]:
    """Return the running Railway deployment status and deployed Git SHA only."""
    return RailwayStatusClient(Settings.from_env()).deployment()


@mcp.tool(annotations=READ_ONLY)
def backup() -> dict[str, Any]:
    """Return aggregate Railway PostgreSQL volume-backup and schedule health."""
    return RailwayStatusClient(Settings.from_env()).backup()


@mcp.tool(annotations=READ_ONLY)
def usage_statistics() -> dict[str, Any]:
    """Return aggregate 24-hour, 7-day and 30-day PostgreSQL usage statistics."""
    settings = Settings.from_env()
    if not settings.database_url:
        return public_error("reports_read_database_url_not_configured")
    try:
        return DatabaseClient(settings.database_url).usage_statistics()
    except ReportingDatabaseError:
        return public_error("database_unreachable")


@mcp.tool(annotations=GENERATES_FILE, structured_output=False)
async def generate_postgres_docx() -> CallToolResult:
    """Generate, render, inspect and attach the private PostgreSQL DOCX report."""
    settings = Settings.from_env()

    def create_artifact():
        if not settings.database_url:
            return generate_error_report(
                output_dir=settings.report_output_dir,
                retention_hours=settings.report_retention_hours,
                timezone_name=settings.timezone,
                soffice_binary=settings.soffice_binary,
                error_code="reports_read_database_url_not_configured",
            )
        try:
            snapshot = DatabaseClient(settings.database_url).report_snapshot(
                max_users=settings.max_users,
                max_ip_history=settings.max_ip_history,
            )
            return generate_report(
                snapshot,
                output_dir=settings.report_output_dir,
                retention_hours=settings.report_retention_hours,
                timezone_name=settings.timezone,
                geoip_db_path=settings.geoip_db_path,
                soffice_binary=settings.soffice_binary,
            )
        except ReportingDatabaseError:
            return generate_error_report(
                output_dir=settings.report_output_dir,
                retention_hours=settings.report_retention_hours,
                timezone_name=settings.timezone,
                soffice_binary=settings.soffice_binary,
                error_code="database_unreachable",
            )

    try:
        artifact = await anyio.to_thread.run_sync(create_artifact)
    except Exception:
        return CallToolResult(
            isError=True,
            content=[
                TextContent(
                    text=json.dumps(
                        public_error("report_generation_or_render_failed"),
                        separators=(",", ":"),
                    )
                )
            ],
        )

    summary = {
        "status": "ok",
        "filename": artifact.display_name,
        "size_bytes": artifact.size,
        "sha256": artifact.sha256,
        "page_count": artifact.page_count,
        "linked_rows_included": artifact.validation_passed,
        "validation_exceptions": list(artifact.validation_exceptions),
    }
    return CallToolResult(
        content=[
            TextContent(text=json.dumps(summary, separators=(",", ":"))),
            ResourceLink(
                name=artifact.display_name,
                title=artifact.display_name,
                uri=f"arclight-report://{artifact.report_id}",
                description=(
                    "Private PostgreSQL report. Download without reproducing personal data in chat."
                ),
                mimeType=(
                    "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
                ),
                size=artifact.size,
            ),
        ]
    )


@mcp.resource(
    "arclight-report://{report_id}",
    name="Arclight PostgreSQL report",
    description="Private generated Word report",
    mime_type="application/vnd.openxmlformats-officedocument.wordprocessingml.document",
)
def postgres_report_resource(report_id: str) -> bytes:
    settings = Settings.from_env()
    path = find_report(settings.report_output_dir, report_id)
    if path is None:
        raise FileNotFoundError("report_not_found")
    return path.read_bytes()


@mcp.custom_route("/healthz", methods=["GET"], include_in_schema=False)
async def health_route(_: Request) -> JSONResponse:
    return JSONResponse({"status": "ok", "version": __version__})


@mcp.custom_route("/readyz", methods=["GET"], include_in_schema=False)
async def readiness_route(_: Request) -> JSONResponse:
    settings = Settings.from_env()
    if not settings.database_url:
        return JSONResponse(
            {"status": "not_ready", "error_code": "database_not_configured"},
            status_code=503,
        )
    try:
        result = await anyio.to_thread.run_sync(DatabaseClient(settings.database_url).health)
        status = 200 if result["status"] == "ok" else 503
        return JSONResponse({"status": result["status"]}, status_code=status)
    except ReportingDatabaseError:
        return JSONResponse(
            {"status": "not_ready", "error_code": "database_unreachable"},
            status_code=503,
        )


_settings = Settings.from_env()
app = mcp.streamable_http_app(
    streamable_http_path="/mcp",
    json_response=False,
    stateless_http=False,
    host="0.0.0.0",
    transport_security=TransportSecuritySettings(
        enable_dns_rebinding_protection=True,
        allowed_hosts=list(_settings.allowed_hosts),
        allowed_origins=[],
    ),
)
