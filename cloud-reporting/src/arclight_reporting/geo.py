from __future__ import annotations

import ipaddress
from dataclasses import dataclass
from pathlib import Path

import geoip2.database
from geoip2.errors import AddressNotFoundError

from .safe import safe_text


@dataclass(frozen=True, slots=True)
class GeoLocation:
    city: str
    country: str
    source: str


class GeoResolver:
    """Offline-only GeoIP resolver. It never sends an IP address over the network."""

    def __init__(self, database_path: Path | None):
        self._reader = None
        self._cache: dict[tuple[str, str], GeoLocation] = {}
        if database_path and database_path.is_file():
            try:
                self._reader = geoip2.database.Reader(str(database_path))
            except Exception:
                self._reader = None

    @property
    def available(self) -> bool:
        return self._reader is not None

    def close(self) -> None:
        if self._reader is not None:
            self._reader.close()

    def resolve(self, raw_ip: str, stored_country: str | None) -> GeoLocation:
        key = (raw_ip, stored_country or "")
        if key in self._cache:
            return self._cache[key]

        country = safe_text(stored_country, limit=80) or "Unavailable"
        try:
            address = ipaddress.ip_address(raw_ip)
        except ValueError:
            result = GeoLocation("Unavailable", country, "stored_country")
            self._cache[key] = result
            return result

        if not address.is_global:
            result = GeoLocation(
                "Private or reserved",
                country if country != "Unavailable" else "Private or reserved",
                "local_classification",
            )
            self._cache[key] = result
            return result

        if self._reader is not None:
            try:
                response = self._reader.city(raw_ip)
                city = safe_text(response.city.name, limit=80) or "Unavailable"
                resolved_country = safe_text(response.country.name, limit=80) or country
                result = GeoLocation(city, resolved_country, "offline_mmdb")
                self._cache[key] = result
                return result
            except (AddressNotFoundError, ValueError):
                pass

        result = GeoLocation("Unavailable", country, "stored_country")
        self._cache[key] = result
        return result

    def __enter__(self) -> GeoResolver:
        return self

    def __exit__(self, *_: object) -> None:
        self.close()
