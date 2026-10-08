from fastapi import APIRouter, Depends

from app.core.dependencies import get_current_user
from app.models.user import User
from app.services.dataset_integration import integrate_datasets


router = APIRouter(
    prefix="/api/integration",
    tags=["Dataset Integration"]
)


@router.post("/")
def integrate(
    existing_records: list[dict],
    new_records: list[dict],
    key_columns: list[str] | None = None,
    current_user: User = Depends(get_current_user),
):
    return integrate_datasets(
        existing_records,
        new_records,
        key_columns,
    )