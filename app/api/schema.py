import json

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.database.connection import get_db
from app.models.dataset_request import DatasetRequest
from app.models.schema_field import SchemaField
from app.models.user import User
from app.schemas.schema import SchemaFieldCreate, SchemaFieldUpdate
from app.core.dependencies import get_current_user


router = APIRouter(
    prefix="/api/requests",
    tags=["Schema Builder"]
)


# ---------------------------------------------------------
# ADD A SCHEMA FIELD
# ---------------------------------------------------------

@router.post("/{request_id}/schema")
def add_schema_field(
    request_id: int,
    field: SchemaFieldCreate,
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
            detail="Schema can only be modified while the request is in draft status"
        )

    # Check for duplicate field name
    existing_field = db.query(SchemaField).filter(
        SchemaField.request_id == request_id,
        SchemaField.field_name == field.field_name
    ).first()

    if existing_field:
        raise HTTPException(
            status_code=400,
            detail="A field with this name already exists in this request"
        )

    # Check minimum and maximum values
    if (
        field.min_value is not None
        and field.max_value is not None
        and field.min_value > field.max_value
    ):
        raise HTTPException(
            status_code=400,
            detail="Minimum value cannot be greater than maximum value"
        )

    new_field = SchemaField(
        request_id=request_id,
        field_name=field.field_name,
        data_type=field.data_type,
        is_required=field.is_required,
        description=field.description,
        min_value=field.min_value,
        max_value=field.max_value,
        allowed_values=(
            json.dumps(field.allowed_values)
            if field.allowed_values is not None
            else None
        )
    )

    db.add(new_field)
    db.commit()
    db.refresh(new_field)

    return {
        "message": "Schema field added successfully!",
        "field_id": new_field.id,
        "request_id": new_field.request_id,
        "field_name": new_field.field_name,
        "data_type": new_field.data_type,
        "is_required": new_field.is_required,
        "description": new_field.description,
        "min_value": new_field.min_value,
        "max_value": new_field.max_value,
        "allowed_values": field.allowed_values
    }


# ---------------------------------------------------------
# GET ALL SCHEMA FIELDS
# ---------------------------------------------------------

@router.get("/{request_id}/schema")
def get_schema_fields(
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

    fields = db.query(SchemaField).filter(
        SchemaField.request_id == request_id
    ).all()

    result = []

    for field in fields:
        result.append({
            "id": field.id,
            "request_id": field.request_id,
            "field_name": field.field_name,
            "data_type": field.data_type,
            "is_required": field.is_required,
            "description": field.description,
            "min_value": field.min_value,
            "max_value": field.max_value,
            "allowed_values": (
                json.loads(field.allowed_values)
                if field.allowed_values
                else None
            )
        })

    return result


# ---------------------------------------------------------
# UPDATE A SCHEMA FIELD
# ---------------------------------------------------------

@router.put("/{request_id}/schema/{field_id}")
def update_schema_field(
    request_id: int,
    field_id: int,
    field_data: SchemaFieldUpdate,
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
            detail="Schema can only be modified while the request is in draft status"
        )

    field = db.query(SchemaField).filter(
        SchemaField.id == field_id,
        SchemaField.request_id == request_id
    ).first()

    if not field:
        raise HTTPException(
            status_code=404,
            detail="Schema field not found"
        )

    # Check duplicate name if the field name is being changed
    if field_data.field_name is not None:
        existing_field = db.query(SchemaField).filter(
            SchemaField.request_id == request_id,
            SchemaField.field_name == field_data.field_name,
            SchemaField.id != field_id
        ).first()

        if existing_field:
            raise HTTPException(
                status_code=400,
                detail="A field with this name already exists in this request"
            )

    new_min_value = (
        field_data.min_value
        if field_data.min_value is not None
        else field.min_value
    )

    new_max_value = (
        field_data.max_value
        if field_data.max_value is not None
        else field.max_value
    )

    if (
        new_min_value is not None
        and new_max_value is not None
        and new_min_value > new_max_value
    ):
        raise HTTPException(
            status_code=400,
            detail="Minimum value cannot be greater than maximum value"
        )

    if field_data.field_name is not None:
        field.field_name = field_data.field_name

    if field_data.data_type is not None:
        field.data_type = field_data.data_type

    if field_data.is_required is not None:
        field.is_required = field_data.is_required

    if field_data.description is not None:
        field.description = field_data.description

    if field_data.min_value is not None:
        field.min_value = field_data.min_value

    if field_data.max_value is not None:
        field.max_value = field_data.max_value

    if field_data.allowed_values is not None:
        field.allowed_values = json.dumps(
            field_data.allowed_values
        )

    db.commit()
    db.refresh(field)

    return {
        "message": "Schema field updated successfully!",
        "field_id": field.id,
        "request_id": field.request_id,
        "field_name": field.field_name,
        "data_type": field.data_type,
        "is_required": field.is_required,
        "description": field.description,
        "min_value": field.min_value,
        "max_value": field.max_value,
        "allowed_values": (
            json.loads(field.allowed_values)
            if field.allowed_values
            else None
        )
    }


# ---------------------------------------------------------
# DELETE A SCHEMA FIELD
# ---------------------------------------------------------

@router.delete("/{request_id}/schema/{field_id}")
def delete_schema_field(
    request_id: int,
    field_id: int,
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
            detail="Schema can only be modified while the request is in draft status"
        )

    field = db.query(SchemaField).filter(
        SchemaField.id == field_id,
        SchemaField.request_id == request_id
    ).first()

    if not field:
        raise HTTPException(
            status_code=404,
            detail="Schema field not found"
        )

    db.delete(field)
    db.commit()

    return {
        "message": "Schema field deleted successfully!"
    }