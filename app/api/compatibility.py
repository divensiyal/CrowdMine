from fastapi import APIRouter, Depends
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from jose import jwt

from app.core.jwt import settings, ALGORITHM
from app.services.compatibility import check_compatibility


router = APIRouter(
    prefix="/api/compatibility",
    tags=["Compatibility Engine"]
)

security = HTTPBearer()


@router.post("/")
def compatibility_check(
    expected_columns: list[str],
    actual_columns: list[str],
    credentials: HTTPAuthorizationCredentials = Depends(security),
):
    jwt.decode(
        credentials.credentials,
        settings.JWT_SECRET_KEY,
        algorithms=[ALGORITHM]
    )

    return check_compatibility(
        expected_columns,
        actual_columns
    )