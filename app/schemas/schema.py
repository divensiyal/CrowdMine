from pydantic import BaseModel


class SchemaFieldCreate(BaseModel):
    field_name: str
    data_type: str
    is_required: bool = True
    description: str | None = None
    min_value: float | None = None
    max_value: float | None = None
    allowed_values: list[str] | None = None


class SchemaFieldUpdate(BaseModel):
    field_name: str | None = None
    data_type: str | None = None
    is_required: bool | None = None
    description: str | None = None
    min_value: float | None = None
    max_value: float | None = None
    allowed_values: list[str] | None = None