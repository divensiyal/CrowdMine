from sqlalchemy import Column, Integer, String, Text, Float, DateTime, ForeignKey
from sqlalchemy.sql import func

from app.database.base import Base


class Dataset(Base):
    __tablename__ = "datasets"

    id = Column(Integer, primary_key=True, index=True)

    request_id = Column(
        Integer,
        ForeignKey("dataset_requests.id"),
        nullable=True
    )

    title = Column(
        String(200),
        nullable=False
    )

    description = Column(
        Text,
        nullable=True
    )

    file_path = Column(
        Text,
        nullable=True
    )

    record_count = Column(
        Integer,
        default=0,
        nullable=False
    )

    quality_score = Column(
        Float,
        nullable=True
    )

    status = Column(
        String(30),
        default="processing",
        nullable=False
    )

    visibility = Column(
    String(20),
    default="private",
    nullable=False
    )

    created_at = Column(
        DateTime(timezone=True),
        server_default=func.now()
    )