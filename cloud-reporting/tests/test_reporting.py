from datetime import UTC, datetime
from pathlib import Path
from zipfile import ZipFile

import pytest

from arclight_reporting.database import (
    IpRow,
    ReportSnapshot,
    UsageWindow,
    UserRow,
    ValidationResult,
)
from arclight_reporting.reporting import (
    _scrub_docx_metadata,
    build_report_document,
    find_report,
    generate_report,
)

NOW = datetime(2026, 8, 24, 9, 0, tzinfo=UTC)


def snapshot(*, passed: bool = True) -> ReportSnapshot:
    usage = UsageWindow(24, 2, 1, 2, 4, 3, 2, 1)
    exceptions = () if passed else ("row_count_mismatch",)
    validation = ValidationResult(
        passed=passed,
        counts_equal=passed,
        unique_profile_ids=True,
        stable_user_order=True,
        stable_ip_order=True,
        view_shapes_valid=True,
        users_within_limit=True,
        ips_within_limit=True,
        exceptions=exceptions,
        view_fingerprints={"app_users_latest_first": "abc"},
    )
    users = (
        UserRow(
            "session_profile_value",
            "Example Person",
            "person@example.test",
            "en",
            NOW,
            NOW,
            4,
        ),
    )
    latest_ips = (IpRow("8.8.8.8", "United States", NOW),)
    return ReportSnapshot(
        as_of=NOW,
        usage={"24_hours": usage, "7_days": usage, "30_days": usage},
        users=users if passed else (),
        latest_ips=latest_ips if passed else (),
        ip_history=latest_ips,
        user_count=1,
        latest_ip_count=1 if passed else 2,
        ip_history_count=1,
        validation=validation,
    )


def test_docx_metadata_is_scrubbed(tmp_path: Path):
    path = tmp_path / "report.docx"
    document = build_report_document(snapshot(), timezone_name="Europe/London", geoip_db_path=None)
    document.save(path)
    _scrub_docx_metadata(path)

    with ZipFile(path) as archive:
        core = archive.read("docProps/core.xml").decode("utf-8")
        app = archive.read("docProps/app.xml").decode("utf-8")
        assert "Example Person" not in core
        assert "creator" not in core
        assert "lastModifiedBy" not in core
        assert "<Company>" not in app or "<Company></Company>" in app
        assert "docProps/custom.xml" not in archive.namelist()


def test_failed_validation_omits_linked_personal_rows(tmp_path: Path):
    path = tmp_path / "report.docx"
    document = build_report_document(
        snapshot(passed=False), timezone_name="Europe/London", geoip_db_path=None
    )
    document.save(path)
    with ZipFile(path) as archive:
        xml = archive.read("word/document.xml").decode("utf-8")
    assert "Example Person" not in xml
    assert "person@example.test" not in xml
    assert "LINK VALIDATION FAILED" in xml


def test_find_report_rejects_bad_identifier(tmp_path: Path):
    assert find_report(tmp_path, "../../secret") is None


@pytest.mark.skipif(
    not __import__("os").environ.get("RUN_DOCX_RENDER_TEST"),
    reason="requires LibreOffice",
)
def test_full_report_is_rendered_and_every_page_checked(tmp_path: Path, monkeypatch):
    soffice = __import__("os").environ["SOFFICE_BINARY"]
    artifact = generate_report(
        snapshot(),
        output_dir=tmp_path,
        retention_hours=168,
        timezone_name="Europe/London",
        geoip_db_path=None,
        soffice_binary=soffice,
    )
    assert artifact.path.is_file()
    assert artifact.page_count >= 3
    assert artifact.path.stat().st_mode & 0o777 == 0o600
    assert find_report(tmp_path, artifact.report_id) == artifact.path
    assert not list(tmp_path.glob("*.pdf"))
    assert not list(tmp_path.glob("*.png"))
