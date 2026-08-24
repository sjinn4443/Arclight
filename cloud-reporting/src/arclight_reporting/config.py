from __future__ import annotations

import os
from dataclasses import dataclass
from pathlib import Path


def _positive_int(name: str, default: int, minimum: int = 1) -> int:
    try:
        value = int(os.getenv(name, str(default)))
    except ValueError:
        return default
    return max(value, minimum)


def _csv(name: str, default: tuple[str, ...]) -> tuple[str, ...]:
    raw = os.getenv(name, "")
    values = tuple(value.strip() for value in raw.split(",") if value.strip())
    return values or default


@dataclass(frozen=True, slots=True)
class Settings:
    database_url: str
    report_output_dir: Path
    report_retention_hours: int
    max_users: int
    max_ip_history: int
    geoip_db_path: Path | None
    soffice_binary: str
    railway_api_url: str
    railway_project_token: str
    railway_project_id: str
    railway_environment_id: str
    railway_service_id: str
    railway_deployment_id: str
    railway_git_commit_sha: str
    postgres_volume_instance_id: str
    allowed_hosts: tuple[str, ...]
    timezone: str

    @classmethod
    def from_env(cls) -> Settings:
        geoip_path = os.getenv("GEOIP_DB_PATH", "").strip()
        private_domain = os.getenv("RAILWAY_PRIVATE_DOMAIN", "").strip()
        default_hosts = ["localhost", "localhost:*", "127.0.0.1", "127.0.0.1:*"]
        if private_domain:
            default_hosts.extend((private_domain, f"{private_domain}:*"))

        return cls(
            database_url=os.getenv("REPORTS_READ_DATABASE_URL", "").strip(),
            report_output_dir=Path(os.getenv("REPORT_OUTPUT_DIR", "/data/reports")),
            report_retention_hours=_positive_int("REPORT_RETENTION_HOURS", 168),
            max_users=_positive_int("REPORT_MAX_USERS", 20_000),
            max_ip_history=_positive_int("REPORT_MAX_IP_HISTORY", 50_000),
            geoip_db_path=Path(geoip_path) if geoip_path else None,
            soffice_binary=os.getenv("SOFFICE_BINARY", "libreoffice").strip() or "libreoffice",
            railway_api_url=os.getenv(
                "RAILWAY_API_URL", "https://backboard.railway.com/graphql/v2"
            ).strip(),
            railway_project_token=os.getenv("RAILWAY_PROJECT_TOKEN", "").strip(),
            railway_project_id=os.getenv("RAILWAY_PROJECT_ID", "").strip(),
            railway_environment_id=os.getenv("RAILWAY_ENVIRONMENT_ID", "").strip(),
            railway_service_id=os.getenv("RAILWAY_SERVICE_ID", "").strip(),
            railway_deployment_id=os.getenv("RAILWAY_DEPLOYMENT_ID", "").strip(),
            railway_git_commit_sha=os.getenv("RAILWAY_GIT_COMMIT_SHA", "").strip(),
            postgres_volume_instance_id=os.getenv("POSTGRES_VOLUME_INSTANCE_ID", "").strip(),
            allowed_hosts=_csv("MCP_ALLOWED_HOSTS", tuple(default_hosts)),
            timezone=os.getenv("REPORT_TIMEZONE", "Europe/London").strip() or "Europe/London",
        )
