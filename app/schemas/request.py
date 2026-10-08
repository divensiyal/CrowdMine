from pydantic import BaseModel


class DatasetRequestCreate(BaseModel):
    title: str
    description: str | None = None
    target_records: int


class DatasetRequestUpdate(BaseModel):
    title: str | None = None
    description: str | None = None
    target_records: int | None = None