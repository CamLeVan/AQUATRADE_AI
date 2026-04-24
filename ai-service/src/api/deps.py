"""FastAPI dependencies chung."""
from __future__ import annotations

import secrets

from fastapi import Depends, Header, HTTPException, status

from .settings import Settings, get_settings


async def require_internal_secret(
    x_internal_secret: str | None = Header(default=None, alias="X-Internal-Secret"),
    settings: Settings = Depends(get_settings),
) -> None:
    """Kiểm tra header X-Internal-Secret khớp settings.internal_secret.

    Dùng constant-time compare chống timing attack.
    """
    expected = settings.internal_secret

    if not x_internal_secret or not secrets.compare_digest(x_internal_secret, expected):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid or missing X-Internal-Secret header",
        )
