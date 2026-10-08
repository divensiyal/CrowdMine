from fastapi import APIRouter, Depends, HTTPException
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from jose import jwt

from app.core.jwt import settings, ALGORITHM
from app.services.data_validation import validate_file


router = APIRouter(
    prefix="/api/validation",
    tags=["Data Validation"]
)

security = HTTPBearer()


@router.post("/")
def validate_uploaded_file(
    file_path: str,
    credentials: HTTPAuthorizationCredentials = Depends(security),
):
    try:
        jwt.decode(
            credentials.credentials,
            settings.JWT_SECRET_KEY,
            algorithms=[ALGORITHM]
        )
    except Exception:
        raise HTTPException(
            status_code=401,
            detail="Invalid or expired authentication token"
        )

    return validate_file(file_path)