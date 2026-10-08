from sqlalchemy import Column, Integer, String, Boolean, Text, Float, ForeignKey

from app.database.base import Base


class SchemaField(Base):
    __tablename__ = "schema_fields"

    id = Column(Integer, primary_key=True, index=True)

    request_id = Column(
        Integer,
        ForeignKey("dataset_requests.id"),
        nullable=False
    )

    field_name = Column(
        String(100),
        nullable=False
    )

    data_type = Column(
        String(50),
        nullable=False
    )

    is_required = Column(
        Boolean,
        default=True,
        nullable=False
    )

    description = Column(
        Text,
        nullable=True
    )

    min_value = Column(
        Float,
        nullable=True
    )

    max_value = Column(
        Float,
        nullable=True
    )

    allowed_values = Column(
        Text,
        nullable=True
    )