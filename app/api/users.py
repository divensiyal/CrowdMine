from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.database.connection import get_db
from app.models.user import User
from app.schemas.user import UserUpdate, PasswordUpdate
from app.core.dependencies import get_current_user
from app.core.security import hash_password, verify_password


router = APIRouter(
    prefix="/api/users",
    tags=["Users"]
)


@router.get("/me")
def get_my_profile(
    current_user: User = Depends(get_current_user)
):
    return {
        "id": current_user.id,
        "username": current_user.username,
        "email": current_user.email,
        "created_at": current_user.created_at
    }


@router.put("/me")
def update_my_profile(
    user_data: UserUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    if user_data.username is not None:
        existing_username = db.query(User).filter(
            User.username == user_data.username,
            User.id != current_user.id
        ).first()

        if existing_username:
            raise HTTPException(
                status_code=400,
                detail="Username already exists"
            )

        current_user.username = user_data.username

    if user_data.email is not None:
        existing_email = db.query(User).filter(
            User.email == user_data.email,
            User.id != current_user.id
        ).first()

        if existing_email:
            raise HTTPException(
                status_code=400,
                detail="Email already exists"
            )

        current_user.email = user_data.email

    db.commit()
    db.refresh(current_user)

    return {
        "message": "Profile updated successfully!",
        "id": current_user.id,
        "username": current_user.username,
        "email": current_user.email
    }


@router.put("/me/password")
def change_password(
    password_data: PasswordUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    if not verify_password(
        password_data.current_password,
        current_user.password_hash
    ):
        raise HTTPException(
            status_code=400,
            detail="Current password is incorrect"
        )

    current_user.password_hash = hash_password(
        password_data.new_password
    )

    db.commit()

    return {
        "message": "Password changed successfully!"
    }