from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.database.connection import get_db
from app.models.dataset import Dataset
from app.models.dataset_request import DatasetRequest
from app.models.dataset_access import DatasetAccess
from app.models.user import User
from app.schemas.dataset import (
    DatasetCreate,
    DatasetUpdate,
    DatasetAccessCreate
)
from app.core.dependencies import get_current_user


router = APIRouter(
    prefix="/api/datasets",
    tags=["Datasets"]
)


@router.post("/")
def create_dataset(
    dataset: DatasetCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    if dataset.request_id is not None:
        request = db.query(DatasetRequest).filter(
            DatasetRequest.id == dataset.request_id
        ).first()

        if request is None:
            raise HTTPException(
                status_code=404,
                detail="Dataset request not found"
            )

        if request.user_id != current_user.id:
            raise HTTPException(
                status_code=403,
                detail="You can only create datasets for your own requests"
            )

    new_dataset = Dataset(
        request_id=dataset.request_id,
        title=dataset.title,
        description=dataset.description,
        visibility=dataset.visibility
    )

    db.add(new_dataset)
    db.commit()
    db.refresh(new_dataset)

    return {
        "message": "Dataset created successfully!",
        "dataset_id": new_dataset.id,
        "title": new_dataset.title,
        "description": new_dataset.description,
        "request_id": new_dataset.request_id,
        "status": new_dataset.status,
        "visibility": new_dataset.visibility
    }


@router.get("/")
def get_datasets(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    datasets = db.query(Dataset).all()

    visible_datasets = []

    for dataset in datasets:

        # Public datasets are visible to everyone
        if dataset.visibility == "public":
            visible_datasets.append(dataset)
            continue

        # Dataset owner can always see their own dataset
        if dataset.request_id is not None:
            request = db.query(DatasetRequest).filter(
                DatasetRequest.id == dataset.request_id
            ).first()

            if request is not None and request.user_id == current_user.id:
                visible_datasets.append(dataset)
                continue

        # Restricted datasets are visible
        # to users who were explicitly granted access
        if dataset.visibility == "restricted":
            access = db.query(DatasetAccess).filter(
                DatasetAccess.dataset_id == dataset.id,
                DatasetAccess.user_id == current_user.id
            ).first()

            if access is not None:
                visible_datasets.append(dataset)

    return visible_datasets


@router.get("/{dataset_id}")
def get_dataset(
    dataset_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    dataset = db.query(Dataset).filter(
        Dataset.id == dataset_id
    ).first()

    if dataset is None:
        raise HTTPException(
            status_code=404,
            detail="Dataset not found"
        )

    # Public dataset
    if dataset.visibility == "public":
        return dataset

    # Check owner
    if dataset.request_id is not None:
        request = db.query(DatasetRequest).filter(
            DatasetRequest.id == dataset.request_id
        ).first()

        if request is not None and request.user_id == current_user.id:
            return dataset

    # Check restricted access
    if dataset.visibility == "restricted":
        access = db.query(DatasetAccess).filter(
            DatasetAccess.dataset_id == dataset.id,
            DatasetAccess.user_id == current_user.id
        ).first()

        if access is not None:
            return dataset

    raise HTTPException(
        status_code=403,
        detail="You do not have access to this dataset"
    )


@router.put("/{dataset_id}")
def update_dataset(
    dataset_id: int,
    dataset_data: DatasetUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    dataset = db.query(Dataset).filter(
        Dataset.id == dataset_id
    ).first()

    if dataset is None:
        raise HTTPException(
            status_code=404,
            detail="Dataset not found"
        )

    if dataset.request_id is not None:
        request = db.query(DatasetRequest).filter(
            DatasetRequest.id == dataset.request_id
        ).first()

        if request is not None and request.user_id != current_user.id:
            raise HTTPException(
                status_code=403,
                detail="You can only update your own datasets"
            )

    if dataset_data.title is not None:
        dataset.title = dataset_data.title

    if dataset_data.description is not None:
        dataset.description = dataset_data.description

    if dataset_data.visibility is not None:
        dataset.visibility = dataset_data.visibility

    db.commit()
    db.refresh(dataset)

    return {
        "message": "Dataset updated successfully!",
        "dataset_id": dataset.id,
        "title": dataset.title,
        "description": dataset.description,
        "visibility": dataset.visibility
    }


@router.delete("/{dataset_id}")
def delete_dataset(
    dataset_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    dataset = db.query(Dataset).filter(
        Dataset.id == dataset_id
    ).first()

    if dataset is None:
        raise HTTPException(
            status_code=404,
            detail="Dataset not found"
        )

    if dataset.request_id is not None:
        request = db.query(DatasetRequest).filter(
            DatasetRequest.id == dataset.request_id
        ).first()

        if request is not None and request.user_id != current_user.id:
            raise HTTPException(
                status_code=403,
                detail="You can only delete your own datasets"
            )

    db.delete(dataset)
    db.commit()

    return {
        "message": "Dataset deleted successfully!"
    }


@router.post("/{dataset_id}/access")
def grant_dataset_access(
    dataset_id: int,
    access_data: DatasetAccessCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    dataset = db.query(Dataset).filter(
        Dataset.id == dataset_id
    ).first()

    if dataset is None:
        raise HTTPException(
            status_code=404,
            detail="Dataset not found"
        )

    # Only the owner can grant access
    if dataset.request_id is not None:
        request = db.query(DatasetRequest).filter(
            DatasetRequest.id == dataset.request_id
        ).first()

        if request is None or request.user_id != current_user.id:
            raise HTTPException(
                status_code=403,
                detail="Only the dataset owner can grant access"
            )

    # Access permissions only make sense for restricted datasets
    if dataset.visibility != "restricted":
        raise HTTPException(
            status_code=400,
            detail="Access can only be granted for restricted datasets"
        )

    user = db.query(User).filter(
        User.id == access_data.user_id
    ).first()

    if user is None:
        raise HTTPException(
            status_code=404,
            detail="User not found"
        )

    existing_access = db.query(DatasetAccess).filter(
        DatasetAccess.dataset_id == dataset_id,
        DatasetAccess.user_id == access_data.user_id
    ).first()

    if existing_access:
        raise HTTPException(
            status_code=400,
            detail="User already has access to this dataset"
        )

    new_access = DatasetAccess(
        dataset_id=dataset_id,
        user_id=access_data.user_id
    )

    db.add(new_access)
    db.commit()
    db.refresh(new_access)

    return {
        "message": "Dataset access granted successfully!",
        "dataset_id": dataset_id,
        "user_id": access_data.user_id
    }

@router.delete("/{dataset_id}/access/{user_id}")
def revoke_dataset_access(
    dataset_id: int,
    user_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    dataset = db.query(Dataset).filter(
        Dataset.id == dataset_id
    ).first()

    if dataset is None:
        raise HTTPException(
            status_code=404,
            detail="Dataset not found"
        )

    # Only the dataset owner can revoke access
    if dataset.request_id is not None:
        request = db.query(DatasetRequest).filter(
            DatasetRequest.id == dataset.request_id
        ).first()

        if request is None or request.user_id != current_user.id:
            raise HTTPException(
                status_code=403,
                detail="Only the dataset owner can revoke access"
            )

    access = db.query(DatasetAccess).filter(
        DatasetAccess.dataset_id == dataset_id,
        DatasetAccess.user_id == user_id
    ).first()

    if access is None:
        raise HTTPException(
            status_code=404,
            detail="User does not have access to this dataset"
        )

    db.delete(access)
    db.commit()

    return {
        "message": "Dataset access revoked successfully!",
        "dataset_id": dataset_id,
        "user_id": user_id
    }