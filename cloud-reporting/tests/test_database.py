from datetime import UTC, datetime

from arclight_reporting.database import IpRow, UserRow, validate_pairing

NOW = datetime(2026, 8, 24, 9, 0, tzinfo=UTC)


def user(profile_id: str) -> UserRow:
    return UserRow(profile_id, "Name", "contact", "en", NOW, NOW, 2)


def ip(value: str) -> IpRow:
    return IpRow(value, "United Kingdom", NOW)


def validate(users_first, users_second, ips_first, ips_second, **overrides):
    defaults = {
        "total_users": len(users_first),
        "total_latest_ips": len(ips_first),
        "view_shapes_valid": True,
        "users_within_limit": True,
        "ips_within_limit": True,
    }
    defaults.update(overrides)
    return validate_pairing(
        tuple(users_first),
        tuple(users_second),
        tuple(ips_first),
        tuple(ips_second),
        **defaults,
    )


def test_pairing_passes_only_when_all_checks_pass():
    users = [user("profile-a"), user("profile-b")]
    ips = [ip("203.0.113.10"), ip("203.0.113.11")]
    result = validate(users, users, ips, ips)
    assert result.passed is True
    assert result.exceptions == ()


def test_pairing_fails_on_count_mismatch():
    users = [user("profile-a")]
    ips = [ip("203.0.113.10")]
    result = validate(
        users,
        users,
        ips,
        ips,
        total_users=1,
        total_latest_ips=2,
    )
    assert result.passed is False
    assert "row_count_mismatch" in result.exceptions


def test_pairing_fails_on_duplicate_profile_ids():
    users = [user("profile-a"), user("profile-a")]
    ips = [ip("203.0.113.10"), ip("203.0.113.11")]
    result = validate(users, users, ips, ips)
    assert result.passed is False
    assert "duplicate_profile_id" in result.exceptions


def test_pairing_fails_on_unstable_order():
    users = [user("profile-a"), user("profile-b")]
    ips = [ip("203.0.113.10"), ip("203.0.113.11")]
    result = validate(users, list(reversed(users)), ips, list(reversed(ips)))
    assert result.passed is False
    assert "unstable_user_order" in result.exceptions
    assert "unstable_ip_order" in result.exceptions


def test_pairing_fails_on_unexpected_views_or_limits():
    users = [user("profile-a")]
    ips = [ip("203.0.113.10")]
    result = validate(
        users,
        users,
        ips,
        ips,
        view_shapes_valid=False,
        users_within_limit=False,
        ips_within_limit=False,
    )
    assert result.passed is False
    assert set(result.exceptions) == {
        "unexpected_view_definition",
        "user_limit_exceeded",
        "ip_limit_exceeded",
    }
