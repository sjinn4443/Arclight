from __future__ import annotations

import hashlib
from collections.abc import Iterator
from contextlib import contextmanager
from dataclasses import dataclass
from datetime import datetime, timedelta
from typing import Any

import psycopg
from psycopg.rows import dict_row

EXPECTED_USER_COLUMNS = (
    "profile_id",
    "anon_id",
    "name",
    "aims",
    "interest",
    "experience",
    "contact",
    "language",
    "first_seen",
    "last_seen",
    "refresh_count",
)
EXPECTED_IP_COLUMNS = ("ip", "country_name", "ts")


class ReportingDatabaseError(RuntimeError):
    """Deliberately carries no underlying database message."""


@dataclass(frozen=True, slots=True)
class UserRow:
    profile_id: str
    name: str | None
    contact: str | None
    language: str | None
    first_seen: datetime
    last_seen: datetime
    refresh_count: int


@dataclass(frozen=True, slots=True)
class IpRow:
    ip: str
    country_name: str | None
    ts: datetime


@dataclass(frozen=True, slots=True)
class UsageWindow:
    hours: int
    total_profiles: int
    new_profiles: int
    active_profiles: int
    refresh_count_on_active_profiles: int
    ip_events: int
    unique_ips: int
    countries: int


@dataclass(frozen=True, slots=True)
class ValidationResult:
    passed: bool
    counts_equal: bool
    unique_profile_ids: bool
    stable_user_order: bool
    stable_ip_order: bool
    view_shapes_valid: bool
    users_within_limit: bool
    ips_within_limit: bool
    exceptions: tuple[str, ...]
    view_fingerprints: dict[str, str]


@dataclass(frozen=True, slots=True)
class ReportSnapshot:
    as_of: datetime
    usage: dict[str, UsageWindow]
    users: tuple[UserRow, ...]
    latest_ips: tuple[IpRow, ...]
    ip_history: tuple[IpRow, ...]
    user_count: int
    latest_ip_count: int
    ip_history_count: int
    validation: ValidationResult


def validate_pairing(
    users_first: tuple[UserRow, ...],
    users_second: tuple[UserRow, ...],
    ips_first: tuple[IpRow, ...],
    ips_second: tuple[IpRow, ...],
    *,
    total_users: int,
    total_latest_ips: int,
    view_shapes_valid: bool,
    users_within_limit: bool,
    ips_within_limit: bool,
    view_fingerprints: dict[str, str] | None = None,
) -> ValidationResult:
    counts_equal = total_users == total_latest_ips
    unique_profile_ids = len({row.profile_id for row in users_first}) == len(users_first)
    stable_user_order = users_first == users_second
    stable_ip_order = ips_first == ips_second
    checks = {
        "row_count_mismatch": counts_equal,
        "duplicate_profile_id": unique_profile_ids,
        "unstable_user_order": stable_user_order,
        "unstable_ip_order": stable_ip_order,
        "unexpected_view_definition": view_shapes_valid,
        "user_limit_exceeded": users_within_limit,
        "ip_limit_exceeded": ips_within_limit,
    }
    exceptions = tuple(code for code, passed in checks.items() if not passed)
    return ValidationResult(
        passed=not exceptions,
        counts_equal=counts_equal,
        unique_profile_ids=unique_profile_ids,
        stable_user_order=stable_user_order,
        stable_ip_order=stable_ip_order,
        view_shapes_valid=view_shapes_valid,
        users_within_limit=users_within_limit,
        ips_within_limit=ips_within_limit,
        exceptions=exceptions,
        view_fingerprints=view_fingerprints or {},
    )


class DatabaseClient:
    def __init__(self, database_url: str):
        self._database_url = database_url

    @contextmanager
    def _connect(self) -> Iterator[psycopg.Connection[dict[str, Any]]]:
        if not self._database_url:
            raise ReportingDatabaseError("database_not_configured")
        try:
            with psycopg.connect(
                self._database_url,
                row_factory=dict_row,
                connect_timeout=10,
                application_name="arclight-cloud-reporting",
                options=(
                    "-c default_transaction_read_only=on "
                    "-c statement_timeout=30000 -c lock_timeout=5000"
                ),
            ) as connection:
                yield connection
        except ReportingDatabaseError:
            raise
        except Exception as exc:
            raise ReportingDatabaseError("database_unreachable") from exc

    @staticmethod
    def _view_state(
        connection: psycopg.Connection[dict[str, Any]],
    ) -> tuple[bool, dict[str, str]]:
        rows = connection.execute(
            """
            SELECT c.relname AS view_name, pg_get_viewdef(c.oid, true) AS definition
            FROM pg_class c
            JOIN pg_namespace n ON n.oid = c.relnamespace
            WHERE n.nspname = 'public'
              AND c.relkind = 'v'
              AND c.relname = ANY(%s)
            ORDER BY c.relname
            """,
            (["app_users_latest_first", "ip_logs_latest_first"],),
        ).fetchall()
        definitions = {row["view_name"]: str(row["definition"] or "") for row in rows}
        fingerprints = {
            name: hashlib.sha256(definition.encode("utf-8")).hexdigest()
            for name, definition in definitions.items()
        }
        column_rows = connection.execute(
            """
            SELECT table_name, column_name, ordinal_position
            FROM information_schema.columns
            WHERE table_schema = 'public'
              AND table_name = ANY(%s)
            ORDER BY table_name, ordinal_position
            """,
            (["app_users_latest_first", "ip_logs_latest_first"],),
        ).fetchall()
        columns: dict[str, list[str]] = {}
        for row in column_rows:
            columns.setdefault(row["table_name"], []).append(row["column_name"])

        users_definition = definitions.get("app_users_latest_first", "").lower()
        ips_definition = definitions.get("ip_logs_latest_first", "").lower()
        shapes_valid = (
            tuple(columns.get("app_users_latest_first", ())) == EXPECTED_USER_COLUMNS
            and tuple(columns.get("ip_logs_latest_first", ())) == EXPECTED_IP_COLUMNS
            and "order by" in users_definition
            and "last_seen" in users_definition
            and "profile_id" in users_definition
            and "order by" in ips_definition
            and "ts" in ips_definition
        )
        return shapes_valid, fingerprints

    def health(self) -> dict[str, Any]:
        with self._connect() as connection:
            row = connection.execute(
                """
                SELECT
                  current_setting('transaction_read_only') = 'on' AS read_only_session,
                  NOT (r.rolsuper OR r.rolcreaterole OR r.rolcreatedb OR
                       r.rolreplication OR r.rolbypassrls) AS least_privilege_role,
                  has_table_privilege(current_user, 'public.app_users', 'SELECT') AS can_read_users,
                  has_table_privilege(current_user, 'public.ip_logs', 'SELECT') AS can_read_ips,
                  NOT has_table_privilege(current_user, 'public.app_users', 'INSERT,UPDATE,DELETE')
                    AS cannot_write_users,
                  NOT has_table_privilege(current_user, 'public.ip_logs', 'INSERT,UPDATE,DELETE')
                    AS cannot_write_ips
                FROM pg_roles r
                WHERE r.rolname = current_user
                """
            ).fetchone()
            shapes_valid, fingerprints = self._view_state(connection)
            checks = dict(row or {})
            checks["view_shapes_valid"] = shapes_valid
            checks["view_fingerprints"] = fingerprints
            healthy = all(
                bool(value) for key, value in checks.items() if key != "view_fingerprints"
            )
            return {"status": "ok" if healthy else "degraded", "checks": checks}

    @staticmethod
    def _usage_window(
        connection: psycopg.Connection[dict[str, Any]],
        as_of: datetime,
        hours: int,
    ) -> UsageWindow:
        cutoff = as_of - timedelta(hours=hours)
        users = connection.execute(
            """
            SELECT
              COUNT(*)::bigint AS total_profiles,
              COUNT(*) FILTER (WHERE first_seen >= %s)::bigint AS new_profiles,
              COUNT(*) FILTER (WHERE last_seen >= %s)::bigint AS active_profiles,
              COALESCE(SUM(refresh_count) FILTER (WHERE last_seen >= %s), 0)::bigint
                AS refresh_count_on_active_profiles
            FROM app_users
            """,
            (cutoff, cutoff, cutoff),
        ).fetchone()
        ips = connection.execute(
            """
            SELECT
              COUNT(*) FILTER (WHERE ts >= %s)::bigint AS ip_events,
              COUNT(DISTINCT ip) FILTER (WHERE ts >= %s)::bigint AS unique_ips,
              COUNT(DISTINCT country_name) FILTER (
                WHERE ts >= %s AND country_name IS NOT NULL
              )::bigint AS countries
            FROM ip_logs
            """,
            (cutoff, cutoff, cutoff),
        ).fetchone()
        return UsageWindow(
            hours=hours,
            total_profiles=int(users["total_profiles"]),
            new_profiles=int(users["new_profiles"]),
            active_profiles=int(users["active_profiles"]),
            refresh_count_on_active_profiles=int(users["refresh_count_on_active_profiles"]),
            ip_events=int(ips["ip_events"]),
            unique_ips=int(ips["unique_ips"]),
            countries=int(ips["countries"]),
        )

    @staticmethod
    def _fetch_users(
        connection: psycopg.Connection[dict[str, Any]], limit: int
    ) -> tuple[UserRow, ...]:
        rows = connection.execute(
            """
            SELECT profile_id, name, contact, language, first_seen, last_seen,
                   refresh_count
            FROM app_users_latest_first
            ORDER BY last_seen DESC NULLS LAST,
                     first_seen DESC NULLS LAST,
                     profile_id ASC
            LIMIT %s
            """,
            (limit,),
        ).fetchall()
        return tuple(
            UserRow(
                profile_id=str(row["profile_id"]),
                name=row["name"],
                contact=row["contact"],
                language=row["language"],
                first_seen=row["first_seen"],
                last_seen=row["last_seen"],
                refresh_count=int(row["refresh_count"] or 0),
            )
            for row in rows
        )

    @staticmethod
    def _fetch_ips(
        connection: psycopg.Connection[dict[str, Any]],
        source: str,
        limit: int,
    ) -> tuple[IpRow, ...]:
        if source not in {"ip_logs_latest_first", "ip_logs"}:
            raise ValueError("unsupported_ip_source")
        rows = connection.execute(
            f"""
            SELECT ip, country_name, ts
            FROM {source}
            ORDER BY ts DESC, ip ASC, COALESCE(country_name, '') ASC
            LIMIT %s
            """,
            (limit,),
        ).fetchall()
        return tuple(
            IpRow(
                ip=str(row["ip"]),
                country_name=row["country_name"],
                ts=row["ts"],
            )
            for row in rows
        )

    def usage_statistics(self) -> dict[str, Any]:
        with self._connect() as connection:
            connection.execute("SET TRANSACTION ISOLATION LEVEL REPEATABLE READ, READ ONLY")
            as_of = connection.execute("SELECT clock_timestamp() AS as_of").fetchone()["as_of"]
            windows = {
                "24_hours": self._usage_window(connection, as_of, 24),
                "7_days": self._usage_window(connection, as_of, 24 * 7),
                "30_days": self._usage_window(connection, as_of, 24 * 30),
            }
            return {
                "status": "ok",
                "as_of": as_of.isoformat(),
                "periods": {
                    key: {
                        "total_profiles": value.total_profiles,
                        "new_profiles": value.new_profiles,
                        "active_profiles": value.active_profiles,
                        "refresh_count_on_active_profiles": value.refresh_count_on_active_profiles,
                        "ip_events": value.ip_events,
                        "unique_ips": value.unique_ips,
                        "countries": value.countries,
                    }
                    for key, value in windows.items()
                },
            }

    def report_snapshot(self, *, max_users: int, max_ip_history: int) -> ReportSnapshot:
        with self._connect() as connection:
            connection.execute("SET TRANSACTION ISOLATION LEVEL REPEATABLE READ, READ ONLY")
            as_of = connection.execute("SELECT clock_timestamp() AS as_of").fetchone()["as_of"]
            shapes_valid, fingerprints = self._view_state(connection)
            counts = connection.execute(
                """
                SELECT
                  (SELECT COUNT(*)::bigint FROM app_users_latest_first) AS user_count,
                  (SELECT COUNT(*)::bigint FROM ip_logs_latest_first) AS latest_ip_count,
                  (SELECT COUNT(*)::bigint FROM ip_logs) AS ip_history_count
                """
            ).fetchone()
            user_count = int(counts["user_count"])
            latest_ip_count = int(counts["latest_ip_count"])
            ip_history_count = int(counts["ip_history_count"])
            users_within_limit = user_count <= max_users
            ips_within_limit = latest_ip_count <= max_users

            users_first = self._fetch_users(connection, max_users + 1)
            users_second = self._fetch_users(connection, max_users + 1)
            ips_first = self._fetch_ips(connection, "ip_logs_latest_first", max_users + 1)
            ips_second = self._fetch_ips(connection, "ip_logs_latest_first", max_users + 1)
            validation = validate_pairing(
                users_first,
                users_second,
                ips_first,
                ips_second,
                total_users=user_count,
                total_latest_ips=latest_ip_count,
                view_shapes_valid=shapes_valid,
                users_within_limit=users_within_limit,
                ips_within_limit=ips_within_limit,
                view_fingerprints=fingerprints,
            )
            users = users_first[:max_users] if validation.passed else ()
            latest_ips = ips_first[:max_users] if validation.passed else ()
            ip_history = self._fetch_ips(connection, "ip_logs", max_ip_history)
            history_exceptions = list(validation.exceptions)
            if ip_history_count > max_ip_history:
                history_exceptions.append("ip_history_truncated")
                validation = ValidationResult(
                    passed=validation.passed,
                    counts_equal=validation.counts_equal,
                    unique_profile_ids=validation.unique_profile_ids,
                    stable_user_order=validation.stable_user_order,
                    stable_ip_order=validation.stable_ip_order,
                    view_shapes_valid=validation.view_shapes_valid,
                    users_within_limit=validation.users_within_limit,
                    ips_within_limit=validation.ips_within_limit,
                    exceptions=tuple(history_exceptions),
                    view_fingerprints=validation.view_fingerprints,
                )

            usage = {
                "24_hours": self._usage_window(connection, as_of, 24),
                "7_days": self._usage_window(connection, as_of, 24 * 7),
                "30_days": self._usage_window(connection, as_of, 24 * 30),
            }
            return ReportSnapshot(
                as_of=as_of,
                usage=usage,
                users=users,
                latest_ips=latest_ips,
                ip_history=ip_history,
                user_count=user_count,
                latest_ip_count=latest_ip_count,
                ip_history_count=ip_history_count,
                validation=validation,
            )
