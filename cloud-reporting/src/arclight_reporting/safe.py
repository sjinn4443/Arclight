from __future__ import annotations

import re
from typing import Any

_CONTROL = re.compile(r"[\x00-\x08\x0b\x0c\x0e-\x1f\x7f]")


def safe_text(value: Any, *, limit: int = 500) -> str:
    """Normalise database text for Word without logging or exposing it elsewhere."""
    if value is None:
        return ""
    text = _CONTROL.sub(" ", str(value)).replace("\r\n", "\n").replace("\r", "\n")
    text = " ".join(part for part in text.splitlines() if part).strip()
    if len(text) > limit:
        return text[: max(limit - 1, 0)] + "…"
    return text


def public_error(code: str, *, status: str = "error") -> dict[str, str]:
    """Return a stable non-sensitive error payload."""
    return {"status": status, "error_code": code}
