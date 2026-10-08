from pydantic import BaseModel


class ContributionCreate(BaseModel):
    request_id: int
    file_name: str | None = None
    notes: str | None = None


class ContributionResponse(BaseModel):
    id: int
    request_id: int
    user_id: int
    file_name: str | None
    status: str
    notes: str | None

    class Config:
        from_attributes = True