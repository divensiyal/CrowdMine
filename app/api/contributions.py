from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.core.dependencies import get_current_user
from app.database.connection import get_db
from app.models.contribution import Contribution
from app.models.user import User
from app.schemas.contribution import (
    ContributionCreate,
    ContributionResponse
)

router = APIRouter(
    prefix="/api/contributions",
    tags=["Contributions"]
)


@router.post("/", response_model=ContributionResponse)
def create_contribution(
    contribution: ContributionCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    new_contribution = Contribution(
        request_id=contribution.request_id,
        user_id=current_user.id,
        file_name=contribution.file_name,
        notes=contribution.notes
    )

    db.add(new_contribution)
    db.commit()
    db.refresh(new_contribution)

    return new_contribution


@router.get("/", response_model=list[ContributionResponse])
def get_contributions(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    contributions = db.query(Contribution).filter(
        Contribution.user_id == current_user.id
    ).all()

    return contributions


@router.get("/{contribution_id}", response_model=ContributionResponse)
def get_contribution(
    contribution_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    contribution = db.query(Contribution).filter(
        Contribution.id == contribution_id,
        Contribution.user_id == current_user.id
    ).first()

    if not contribution:
        raise HTTPException(
            status_code=404,
            detail="Contribution not found"
        )

    return contribution