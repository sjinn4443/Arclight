from __future__ import annotations

import os

import uvicorn


def main() -> None:
    uvicorn.run(
        "arclight_reporting.server:app",
        host="0.0.0.0",
        port=int(os.getenv("PORT", "8000")),
        access_log=False,
        log_level=os.getenv("LOG_LEVEL", "info").lower(),
        proxy_headers=False,
    )


if __name__ == "__main__":
    main()
