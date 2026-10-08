from typing import Literal

from pydantic import BaseModel


class DatasetCreate(BaseModel):
    title: str
    description: str | None = None
    request_id: int | None = None
    visibility: Literal["private", "restricted", "public"] = "private"


class DatasetUpdate(BaseModel):
    title: str | None = None
    description: str | None = None
    visibility: Literal["private", "restricted", "public"] | None = None


class DatasetAccessCreate(BaseModel):
    user_id: int