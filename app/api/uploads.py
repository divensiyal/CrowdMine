from fastapi import APIRouter, Depends, File, HTTPException, UploadFile
from sqlalchemy.orm import Session

from app.core.dependencies import get_current_user
from app.database.connection import get_db
from app.models.contribution import Contribution
from app.models.dataset_request import DatasetRequest
from app.models.user import User
from app.services.data_validation import validate_file
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
    dataset_request = db.query(DatasetRequest).filter(
        DatasetRequest.id == request_id
    ).first()

    if not dataset_request:
        raise HTTPException(
            status_code=404,
            detail="Dataset request not found"
        )

    result = await save_uploaded_file(
        file=file,
        user_id=current_user.id,
        request_id=request_id,
    )

    validation = validate_file(result["file_path"])

    contribution = Contribution(
        request_id=request_id,
        user_id=current_user.id,
        file_name=result["original_filename"],
        status="validated" if validation["valid"] else "invalid",
    )

    db.add(contribution)
    db.commit()
    db.refresh(contribution)

    return {
        "message": "File uploaded successfully",
        "contribution_id": contribution.id,
        "file": result,
        "validation": validation,
    }