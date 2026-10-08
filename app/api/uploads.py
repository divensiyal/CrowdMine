from fastapi import APIRouter, Depends, File, UploadFile
from sqlalchemy.orm import Session

from app.core.dependencies import get_current_user
from app.database.connection import get_db
from app.models.user import User
from app.services.file_upload import save_uploaded_file


router = APIRouter(
    prefix="/api/uploads",
    tags=["File Upload"]
)


@router.post("/")
async def upload_file(
    request_id: int,
    file: UploadFile = File(...),
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    result = await save_uploaded_file(
        file=file,
        user_id=current_user.id,
        request_id=request_id,
    )

    return {
        "message": "File uploaded successfully",
        **result,
    }