from arclight_reporting.config import Settings


def clear_database_environment(monkeypatch):
    for name in (
        "REPORTS_READ_DATABASE_URL",
        "REPORTS_DB_HOST",
        "REPORTS_DB_PORT",
        "REPORTS_DB_NAME",
        "REPORTS_DB_USER",
        "REPORTS_DB_PASSWORD",
        "REPORTS_DB_SSLMODE",
        "DATABASE_URL",
    ):
        monkeypatch.delenv(name, raising=False)


def test_direct_read_only_url_takes_precedence(monkeypatch):
    clear_database_environment(monkeypatch)
    monkeypatch.setenv("REPORTS_READ_DATABASE_URL", "postgresql://reporter@db/reports")
    monkeypatch.setenv("REPORTS_DB_HOST", "ignored")

    assert Settings.from_env().database_url == "postgresql://reporter@db/reports"


def test_database_components_build_safe_conninfo(monkeypatch):
    clear_database_environment(monkeypatch)
    values = {
        "REPORTS_DB_HOST": "postgres.railway.internal",
        "REPORTS_DB_PORT": "5432",
        "REPORTS_DB_NAME": "railway",
        "REPORTS_DB_USER": "arclight_reporting",
        "REPORTS_DB_PASSWORD": "spaces and 'quotes'",
        "REPORTS_DB_SSLMODE": "prefer",
    }
    for name, value in values.items():
        monkeypatch.setenv(name, value)

    conninfo = Settings.from_env().database_url
    assert "host=postgres.railway.internal" in conninfo
    assert "user=arclight_reporting" in conninfo
    assert "password='spaces and \\'quotes\\''" in conninfo
    assert "sslmode=prefer" in conninfo


def test_database_url_is_never_used_as_fallback(monkeypatch):
    clear_database_environment(monkeypatch)
    monkeypatch.setenv("DATABASE_URL", "postgresql://application-writer@db/app")

    assert Settings.from_env().database_url == ""
