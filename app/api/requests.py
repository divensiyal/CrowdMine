from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.database.connection import get_db
from app.models.dataset_request import DatasetRequest
from app.models.schema_field import SchemaField
from app.models.user import User
from app.schemas.request import (
    DatasetRequestCreate,
    DatasetRequestUpdate
)
from app.core.dependencies import get_current_user


router = APIRouter(
    prefix="/api/requests",
    tags=["Dataset Requests"]
)


# ---------------------------------------------------------
# CREATE DATASET REQUEST
# ---------------------------------------------------------

@router.post("/")
def create_request(
    request: DatasetRequestCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    new_request = DatasetRequest(
        user_id=current_user.id,
        title=request.title,
        description=request.description,
        target_records=request.target_records
    )

    db.add(new_request)
    db.commit()
    db.refresh(new_request)

    return {
        "message": "Dataset request created successfully!",
        "request_id": new_request.id,
        "title": new_request.title,
        "description": new_request.description,
        "target_records": new_request.target_records,
        "user_id": current_user.id
    }


# ---------------------------------------------------------
# GET ALL MY DATASET REQUESTS
# ---------------------------------------------------------

@router.get("/")
def get_requests(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    requests = db.query(DatasetRequest).filter(
        DatasetRequest.user_id == current_user.id
    ).all()

    return requests


# ---------------------------------------------------------
# GET PUBLISHED REQUESTS FOR DISCOVERY
# ---------------------------------------------------------

@router.get("/discover")
def discover_requests(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    requests = db.query(DatasetRequest).filter(
        DatasetRequest.status == "published",
        DatasetRequest.user_id != current_user.id
    ).all()

    result = []

    for request in requests:
        fields = db.query(SchemaField).filter(
            SchemaField.request_id == request.id
        ).all()

        schema_fields = []

        for field in fields:
            schema_fields.append({
                "id": field.id,
                "field_name": field.field_name,
                "data_type": field.data_type,
                "is_required": field.is_required,
                "description": field.description,
                "min_value": field.min_value,
                "max_value": field.max_value,
                "allowed_values": field.allowed_values
            })

        result.append({
            "id": request.id,
            "title": request.title,
            "description": request.description,
            "target_records": request.target_records,
            "status": request.status,
            "created_at": request.created_at,
            "schema": schema_fields
        })

    return result


# ---------------------------------------------------------
# GET ONE DATASET REQUEST
# ---------------------------------------------------------

@router.get("/{request_id}")
def get_request(
    request_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    request = db.query(DatasetRequest).filter(
        DatasetRequest.id == request_id,
        DatasetRequest.user_id == current_user.id
    ).first()

    if not request:
        raise HTTPException(
            status_code=404,
            detail="Dataset request not found"
        )

    return request


# ---------------------------------------------------------
# UPDATE DATASET REQUEST
# ---------------------------------------------------------

@router.put("/{request_id}")
def update_request(
    request_id: int,
    request_data: DatasetRequestUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    request = db.query(DatasetRequest).filter(
        DatasetRequest.id == request_id,
        DatasetRequest.user_id == current_user.id
    ).first()

    if not request:
        raise HTTPException(
            status_code=404,
            detail="Dataset request not found"
        )

    if request_data.title is not None:
        request.title = request_data.title

    if request_data.description is not None:
        request.description = request_data.description

    if request_data.target_records is not None:
        request.target_records = request_data.target_records

    db.commit()
    db.refresh(request)

    return {
        "message": "Dataset request updated successfully!",
        "request_id": request.id,
        "title": request.title,
        "description": request.description,
        "target_records": request.target_records,
        "status": request.status
    }


# ---------------------------------------------------------
# DELETE DATASET REQUEST
# ---------------------------------------------------------

@router.delete("/{request_id}")
def delete_request(
    request_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    request = db.query(DatasetRequest).filter(
        DatasetRequest.id == request_id,
        DatasetRequest.user_id == current_user.id
    ).first()

    if not request:
        raise HTTPException(
            status_code=404,
            detail="Dataset request not found"
        )

    db.delete(request)
    db.commit()

    return {
        "message": "Dataset request deleted successfully!"
    }


# ---------------------------------------------------------
# PUBLISH DATASET REQUEST
# ---------------------------------------------------------

@router.put("/{request_id}/publish")
def publish_request(
    request_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    request = db.query(DatasetRequest).filter(
        DatasetRequest.id == request_id,
        DatasetRequest.user_id == current_user.id
    ).first()

    if not request:
        raise HTTPException(
            status_code=404,
            detail="Dataset request not found"
        )

    if request.status != "draft":
        raise HTTPException(
            status_code=400,
            detail="Only draft requests can be published"
        )

    request.status = "published"

    db.commit()
    db.refresh(request)

    return {
        "message": "Dataset request published successfully!",
        "request_id": request.id,
        "status": request.status
    }


# ---------------------------------------------------------
# CLOSE DATASET REQUEST
# ---------------------------------------------------------

@router.put("/{request_id}/close")
def close_request(
    request_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    request = db.query(DatasetRequest).filter(
        DatasetRequest.id == request_id,
        DatasetRequest.user_id == current_user.id
    ).first()

    if not request:
        raise HTTPException(
            status_code=404,
            detail="Dataset request not found"
        )

    if request.status != "published":
        raise HTTPException(
            status_code=400,
            detail="Only published requests can be closed"
        )

    request.status = "closed"

    db.commit()
    db.refresh(request)

    return {
        "message": "Dataset request closed successfully!",
        "request_id": request.id,
        "status": request.status
    }