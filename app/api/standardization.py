from fastapi import APIRouter, Depends

from app.core.dependencies import get_current_user
from app.models.user import User
from app.services.standardization import standardize_records


router = APIRouter(
    prefix="/api/standardization",
    tags=["Standardization"]
)


@router.post("/")
def standardize(
    records: list[dict],
    current_user: User = Depends(get_current_user),
):
    return standardize_records(records)