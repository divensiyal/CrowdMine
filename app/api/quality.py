from fastapi import APIRouter, Depends
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from jose import jwt

from app.core.jwt import settings, ALGORITHM
from app.services.data_quality import calculate_quality


router = APIRouter(
    prefix="/api/quality",
    tags=["Data Quality"]
)

security = HTTPBearer()


@router.post("/")
def quality_check(
    total_records: int,
    valid_records: int,
    missing_values: int = 0,
    duplicate_records: int = 0,
    credentials: HTTPAuthorizationCredentials = Depends(security),
):
    jwt.decode(
        credentials.credentials,
        settings.JWT_SECRET_KEY,
        algorithms=[ALGORITHM]
    )

    return calculate_quality(
        total_records,
        valid_records,
        missing_values,
        duplicate_records,
    )