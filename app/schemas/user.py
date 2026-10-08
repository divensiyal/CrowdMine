from pydantic import BaseModel, EmailStr


class UserUpdate(BaseModel):
    username: str | None = None
    email: EmailStr | None = None


class PasswordUpdate(BaseModel):
    current_password: str
    new_password: str