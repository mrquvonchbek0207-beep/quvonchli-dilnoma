from typing import Annotated

from fastapi import APIRouter, Depends

from app.auth import get_current_admin
from app.models import User
from seed_data import seed_data


router = APIRouter(prefix="/api/admin", tags=["admin"])


@router.post("/seed")
def seed_catalog(
    _: Annotated[User, Depends(get_current_admin)],
) -> dict[str, int | str]:
    return {"status": "ok", **seed_data()}
