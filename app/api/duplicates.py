from fastapi import APIRouter, Depends

from app.core.dependencies import get_current_user
from app.models.user import User
from app.services.duplicate_detection import detect_duplicates


router = APIRouter(
    prefix="/api/duplicates",
    tags=["Duplicate Detection"]
)


@router.post("/")
def find_duplicates(
    records: list[dict],
    current_user: User = Depends(get_current_user),
):
    return detect_duplicates(records)