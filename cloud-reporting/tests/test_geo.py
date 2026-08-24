from pathlib import Path

from arclight_reporting.geo import GeoResolver


def test_geo_resolver_never_requires_network_or_database():
    with GeoResolver(None) as resolver:
        result = resolver.resolve("8.8.8.8", "United States")
    assert result.city == "Unavailable"
    assert result.country == "United States"
    assert result.source == "stored_country"


def test_geo_resolver_classifies_private_ip():
    with GeoResolver(Path("/path/that/does/not/exist.mmdb")) as resolver:
        result = resolver.resolve("10.0.0.4", None)
    assert result.city == "Private or reserved"
    assert result.country == "Private or reserved"
