import json

import pytest

from arclight_reporting.server import mcp


@pytest.mark.asyncio
async def test_exactly_five_tools_are_exposed():
    tools = await mcp.list_tools()
    assert {tool.name for tool in tools} == {
        "health",
        "deployment",
        "backup",
        "usage_statistics",
        "generate_postgres_docx",
    }


@pytest.mark.asyncio
async def test_missing_database_returns_non_sensitive_error(monkeypatch):
    monkeypatch.delenv("REPORTS_READ_DATABASE_URL", raising=False)
    monkeypatch.setenv("DATABASE_URL", "postgresql://user:secret@private.example/db")
    result = await mcp.call_tool("health", {})
    payload = json.loads(result.content[0].text)
    assert payload["error_code"] == "reports_read_database_url_not_configured"
    assert "secret" not in result.content[0].text
    assert "private.example" not in result.content[0].text


@pytest.mark.asyncio
async def test_usage_error_does_not_fall_back_to_write_database(monkeypatch):
    monkeypatch.delenv("REPORTS_READ_DATABASE_URL", raising=False)
    monkeypatch.setenv("DATABASE_URL", "postgresql://writer:secret@private.example/db")
    result = await mcp.call_tool("usage_statistics", {})
    payload = json.loads(result.content[0].text)
    assert payload["error_code"] == "reports_read_database_url_not_configured"
